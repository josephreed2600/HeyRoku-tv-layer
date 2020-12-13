const logger = require('logger').get('launch');
const levensort = require('leven-sort');
const xml2js = require('xml2js');
const fetch = require('node-fetch');

let port = null;

const getApps = async () => {
	return fetch(`http://localhost:${port}/query/apps`)
		.then(res => res.text())
		.then(xml2js.parseStringPromise)
		.then(j => j.apps.app)
		.then(apps => {
			return apps.map(app => ({id: app.$.id, name: app._.toLocaleLowerCase()}))
		})
	;
};

const findChannelID = async (query) => {
	return getApps().then(apps => levensort(apps, query.toLocaleLowerCase(), 'name', query.toLocaleLowerCase(), 'id')[0])
};

const getChannelID = (req, res) => {
	// TODO also use req.params, but with lower precedence than req.body
	const query = Object.assign({}, req.params, req.body).query;
	findChannelID(query).then(res.send.bind(res)); // https://stackoverflow.com/a/42832428/6627273
};

const launch = (req, res) => {
	const query = Object.assign({}, req.params, req.body).query;
	findChannelID(query).then(app => {
		let request = `fetch("http://localhost:${port}/launch/${app.id}", {method: 'POST'})`;
		console.log(request);
		fetch(`http://localhost:${port}/launch/${app.id}`, {method: 'POST'}).then(console.log);
		res.send(app);
	});
};

const routes = [
	{
		url: '/start',
		methods: ['post'],
		handler: launch
	}
,	{
		url: '/start/:query',
		methods: ['post'],
		handler: launch
	}
];

const configure = (options) => {
	port = options.port;
};

module.exports = { logger, routes, configure }
