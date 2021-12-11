const Joi = require('joi');

exports.validate = (req, res, next) => {
	let { path } = req;
	let key;
	path.split('/').forEach((e) => {
		Object.keys(schemas).forEach((k) => {
			key = e === k ? k : null;
		});
	});
	console.log(key);
	if (key) {
		let schema = schemas[key].validate(req.body);
		if (!schema.error) {
			req.body = schema.value;
			next();
		} else {
			res.status(400).json({ message: schema.error.message });
		}
	} else {
		next();
	}
};

const schemas = {
	create: Joi.object({
		fullUrl: Joi.string().required(),
	}),
};
