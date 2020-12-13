const logger = require('logger').get('power');

const powerOn = (req, res) => {
	res.redirect(308, '/keypress/powerOn');
};

const powerOff = (req, res) => {
	res.redirect(308, '/keypress/powerOff');
};

const routes = [
	{
		urls: '/power/on',
		methods: 'post',
		handlers: powerOn
	}
,	{
		urls: '/power/off',
		methods: 'post',
		handlers: powerOff
	}
];

module.exports = { logger, routes }
