const logger = require('logger').get('volume');

const volumeUp = (req, res) => {
	res.redirect(308, '/keypress/VolumeUp');
};

const volumeDown = (req, res) => {
	res.redirect(308, '/keypress/VolumeDown');
};

const volumeMute = (req, res) => {
	res.redirect(308, '/keypress/VolumeMute');
};

const routes = [
	{
		urls: '/volume/up',
		methods: 'post',
		handlers: volumeUp
	}
,	{
		urls: '/volume/down',
		methods: 'post',
		handlers: volumeDown
	}
,	{
		urls: '/volume/mute',
		methods: 'post',
		handlers: volumeMute
	}
];

module.exports = { logger, routes }
