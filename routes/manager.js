const apply = (app, component) => {
	if (component.routes.constructor.name != 'Array') component.routes = [component.routes];
	component.routes.forEach((route) => {
		if (route.methods.constructor.name != 'Array') route.methods = [route.methods];
		if (route.urls.constructor.name != 'Array') route.urls = [route.urls];
		if (route.handlers.constructor.name != 'Array') route.handlers = [route.handlers];
		route.methods.forEach((method) => {
			route.urls.forEach((url) => {
				route.handlers.forEach((handler) => {
					app[method](url, handler);
				});
				if(component.logger) component.logger.info(`Adding route: ${method.toLocaleUpperCase()} ${route.url}`);
			});
		});
	});
};


module.exports = { apply };
