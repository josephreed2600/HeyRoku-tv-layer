const apply = (app, component) => {
	component.routes.forEach((route) => {
		route.methods.forEach((method) => {
			app[method](route.url, route.handler);
			if(component.logger) component.logger.info(`Adding route: ${method.toLocaleUpperCase()} ${route.url}`);
		});
	});
};


module.exports = { apply };
