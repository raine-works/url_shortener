import axios from 'axios';

export default {
	install: (app) => {
		axios.defaults.baseURL = location.hostname.includes('localhost')
			? 'http://localhost:3000/raineworks-4f78a/us-central1/app/api/'
			: 'https://short.raineworks.com/api/';
		axios.defaults.validateStatus = (status) => {
			return status >= 200 && status < 300;
		};
		app.config.globalProperties.$axios = axios;
	},
};
