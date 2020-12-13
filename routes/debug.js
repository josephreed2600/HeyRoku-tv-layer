const logger = require('logger').get('fallback');

let default_bob = null;

const print = (req, res, next) => {
	console.log(req.method.toLocaleUpperCase() + ' ' + req.originalUrl);
	next();
};

const routes = [
	{
		urls: '*',
		methods: 'all',
		handlers: print
	}
];

module.exports = { logger, routes }
