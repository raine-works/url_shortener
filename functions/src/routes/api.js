const router = require('express').Router();
const db = require('../db/db.js');
const requestIp = require('request-ip');
const axios = require('axios');
const { DateTime } = require('luxon');

router.get('/:shortUrl', async (req, res) => {
	try {
		let redirectUrl = (
			await db.getBy('urls', '==', {
				shortUrl: req.params.shortUrl,
			})
		)[0];
		if (redirectUrl) {
			let ip = requestIp.getClientIp(req);
			let ipData = (await axios.get(`http://ipwhois.app/json/${ip}`))
				.data;
			let lat, long;
			if (ipData) {
				lat = ipData.latitude;
				long = ipData.longitude;
			}
			await db.create('logs', new Log(redirectUrl.id, ip, lat, long));
			await db.update('urls', redirectUrl.id, {
				hitCounter: redirectUrl.hitCounter + 1,
			});
			garbageCollection();
			res.redirect(redirectUrl.fullUrl);
		} else {
			res.status(404).json({ message: 'url not found' });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.get('/logs/:shortUrl', async (req, res) => {
	try {
		let urlRecord = (
			await db.getBy('urls', '==', {
				shortUrl: req.params.shortUrl,
			})
		)[0];
		if (urlRecord) {
			let logs = await db.getBy('logs', '==', { urlId: urlRecord.id });
			res.status(200).json({ logs: logs, hits: urlRecord.hitCounter });
		} else {
			res.status(404).json({ message: 'url not found' });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post('/create', async (req, res) => {
	try {
		let baseUrl = 'https://short.raineworks.com/api/';
		let existingRecord = (
			await db.getBy('urls', '==', {
				fullUrl: req.body.fullUrl,
			})
		)[0];
		if (!existingRecord) {
			let urlRecord = await db.create(
				'urls',
				new UrlRecord(req.body.fullUrl)
			);
			res.status(200).json({ newUrl: baseUrl + urlRecord.shortUrl });
		} else {
			res.status(200).json({ newUrl: baseUrl + existingRecord.shortUrl });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Creating a new url record.
class UrlRecord {
	constructor(fullUrl) {
		this.fullUrl = fullUrl;
		this.shortUrl = getUniqueId();
		this.hitCounter = 0;
	}
}

// Create usage log
class Log {
	constructor(urlId, ip, lat, long) {
		this.timestamp = DateTime.utc().toISO();
		this.urlId = urlId;
		this.ip = ip;
		this.lat = lat;
		this.long = long;
	}
}

const getUniqueId = () => {
	return `${(Math.ceil(Math.random()) * DateTime.utc().toMillis())
		.toString(36)
		.substr(2, 9)}`;
};

// Destoys logs that are older than 30 days on the ceation of a new log.
const garbageCollection = () => {
	db.batchDelete('logs', '<', {
		createdDate: DateTime.utc().minus({ days: 30 }).toISO(),
	});
};

module.exports = router;
