const logger = require('logger').get('power');

const powerOn = (req, res) => {
	res.redirect('/keypress/powerOn');
};

const powerOff = (req, res) => {
	res.redirect('/keypress/powerOff');
};

const routes = [
	{
		url: '/power/on',
		methods: ['post'],
		handler: powerOn
	}
,	{
		url: '/power/off',
		methods: ['post'],
		handler: powerOff
	}
];

module.exports = { logger, routes }
