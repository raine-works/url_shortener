require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(
	cors({
		origin: '*',
		methods: 'POST, OPTIONS',
	})
);
app.use(require('./src/middleware/schema').validate);
app.use('/api', require('./src/routes/api'));

exports.app = functions.https.onRequest(app);
