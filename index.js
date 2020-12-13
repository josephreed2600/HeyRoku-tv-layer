#!/usr/bin/node
process.env.NODE_ENV = 'debug'; // switch between debug and production to toggle some debugging output
const package = require('./package.json');
const config = require('./config.json');

console.log(`Starting ${package.name} v${package.version}`);
const logger = require('logger').get('main');

logger.info('Requiring packages...');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
logger.info('Required packages.');

logger.info('Configuring Express...');
const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
logger.info('Configured Express.');

logger.info('Configuring routes...');
const routeFiles = ['debug', 'power', 'launch', 'fallback'];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
	logger.info(`Adding ${file} routes...`);
	let component = require(`./routes/${file}`);
	if(component.configure) component.configure(config);
	routeManager.apply(app, component);
	logger.info(`Added ${file} routes.`);
});
logger.info('Configured routes.');

logger.info(`Listening on port ${config.port}`);
app.listen(config.port, '0.0.0.0');
