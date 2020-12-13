const logger = require('logger').get('launch');
const levensort = require('leven-sort');
const xml2js = require('xml2js');
const fetch = require('node-fetch');

let port = null;
let baseURL = () => `http://localhost:${port}`;
let buttonQueue = [];

const queueButtons = (buttons) => {
	let delay = 0;
	for (let button of buttons) {
		setTimeout(() => {
			pressButton(button.value);
		}, delay);
		console.log(`Queueing ${button.value} at ${delay}`);
		delay += button.delay;
	}
};

const getApps = async () => {
	return fetch(`${baseURL()}/query/apps`)
		.then(res => res.text())
		.then(xml2js.parseStringPromise)
		.then(j => j.apps.app)
		.then(apps => {
			return apps.map(app => ({id: app.$.id, name: app._.toLocaleLowerCase()}))
		})
	;
};

const findChannelID = async (query) => {
	return getApps()
		.then(apps => levensort(apps, query.toLocaleLowerCase(), 'name', query.toLocaleLowerCase(), 'id')[0]);
};

const sendString = (req, res) => {
	const input = Object.assign({}, req.params, req.body).input;
	typeString(input).then(() => res.sendStatus(204));
};

const typeString = async (string) => {
	console.log('Spelling out ' + string);
	queueButtons(getKeystrokes(string));
};
const getKeystrokes = (string, delay = 100) => {
	let out = [];
	for (let char of string)
		out.push({value:`Lit_${encodeURIComponent(char)}`, delay:delay});
	return out;
};

const pressButton = async (button) => {
	if (button) {
		console.log('Pressing button ' + button);
		fetch(`${baseURL()}/keypress/${button}`, {method: 'POST'});
	}
};

const listChannels = (req, res) => {
	getApps()
		.then(apps => apps.sort((a,b) => a.id - b.id < 0 ? -1 : a.id - b.id > 0 ? 1 : 0))
		.then(res.send.bind(res));
};

const getChannelID = (req, res) => {
	// TODO also use req.params, but with lower precedence than req.body
	const app = Object.assign({}, req.params, req.body).app;
	findChannelID(app).then(res.send.bind(res)); // https://stackoverflow.com/a/42832428/6627273
};

const launch = (req, res, next) => {
	const app = Object.assign({}, req.params, req.body).app;
	if (app) findChannelID(app).then(app => {
		fetch(`${baseURL()}/launch/${app.id}`, {method: 'POST'});
		if (next) next();
		else res.send(app);
	});
	else res.redirect(308, '/power/on');
};

const searchForTitle = (req, res) => {
	const app = Object.assign({}, req.params, req.body).app.toLocaleLowerCase();
	const title = Object.assign({}, req.params, req.body).title.toLocaleLowerCase();
	switch (app) {
		case 'netflix':
			res.send('searching netflix for ' + title);
			// oh god
			setTimeout(() => {
				let buttons = [];
				for(let i = 0; i < 10; i++) buttons.push({value:'Back', delay:100});
				for(let i = 0; i < 10; i++) buttons.push({value:'Left', delay:200});
				buttons.push({value:null, delay: 500});
				for(let i = 0; i < 10; i++) buttons.push({value:'Up'  , delay:300});
				buttons.push({value:null, delay: 1000});
				buttons.push({value:'Down'  , delay:500});
				buttons.push({value:'Down'  , delay:500});
				buttons.push({value:'Select', delay:100});
				for(let i = 0; i < 64; i++) buttons.push({value:'Backspace', delay:10});
				buttons.push({value:null, delay: 500});
				buttons = buttons.concat(getKeystrokes(title + ' ', 100)); // add a space and then backspace it so we know
				buttons.push({value:null, delay: 2000});
				buttons.push({value:'Backspace', delay:2000});         // where the cursor is
				buttons.push({value:'Right'    , delay:500});
				buttons.push({value:'Select'   , delay:100});
				queueButtons(buttons);
			}, 5000);
			break;
		default: res.send('fell through');
	}
};

const routes = [
	{
		urls: '/start',
		methods: 'post',
		handlers: launch
	}
	,	{
		urls: '/start/:app',
		methods: 'post',
		handlers: launch
	}
	,	{
		urls: '/start/:app/:title',
		methods: 'post',
		handlers: [launch, searchForTitle]
	}
	,	{
		urls: '/list',
		methods: 'get',
		handlers: listChannels
	}
	,	{
		urls: '/type/:input',
		methods: 'post',
		handlers: sendString
	}
];

const configure = (options) => {
	port = options.port;
};

module.exports = { logger, routes, configure }
