const logger = require('logger').get('fallback');
const fetch = require('node-fetch');

let default_bob = null;

const redirect = (req, res) => {
	let dest = Object.assign({}, {'dest': default_bob}, req.body, req.query).dest;
	if (!(/^http/).test(dest)) dest = 'http://' + dest;
	//let queries = url.parse(req.originalUrl);
	//console.log(queries);
	res.redirect(308, dest + req.originalUrl); // 308: don't change methods
	//fetch(dest + req.originalUrl, {method: req.method}).then(res.send.bind(res));
};

const routes = [
	{
		urls: '*',
		methods: 'all',
		handlers: redirect
	}
];

const configure = (options) => {
	default_bob = options.default_bob;
};

module.exports = { logger, routes, configure }
