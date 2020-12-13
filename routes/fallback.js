const logger = require('logger').get('fallback');

let default_bob = null;

const redirect = (req, res) => {
	let dest = Object.assign({}, {'dest': default_bob}, req.body, req.query).dest;
	if (!(/^http/).test(dest)) dest = 'http://' + dest;
	//let queries = url.parse(req.originalUrl);
	//console.log(queries);
	res.redirect(308, dest + req.originalUrl); // 308: don't change methods
};

const routes = [
	{
		url: '*',
		methods: ['all'],
		handler: redirect
	}
];

const configure = (options) => {
	default_bob = options.default_bob;
};

module.exports = { logger, routes, configure }
