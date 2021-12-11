const admin = require('firebase-admin');
const { DateTime } = require('luxon');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// Get all records.
exports.getAll = async (table) => {
	try {
		let list = new Set();
		let docRef = await db.collection(table).get();
		docRef.forEach((doc) => {
			let obj = doc.data();
			let data = {};
			data['id'] = doc.id;
			for (let key in obj) {
				data[key] = obj[key];
			}
			list.add(data);
		});
		return Array.from(list);
	} catch (err) {
		throw err;
	}
};

// Get record by query.
exports.getBy = async (table, operator, query) => {
	try {
		let list = new Set();
		let docRef = await db.collection(table);
		for (let key in query) {
			let snapshot = await docRef.where(key, operator, query[key]).get();
			snapshot.forEach((doc) => {
				let obj = doc.data();
				let data = {};
				data['id'] = doc.id;
				for (let key in obj) {
					data[key] = obj[key];
				}
				list.add(data);
			});
		}
		return Array.from(list);
	} catch (err) {
		throw err;
	}
};

// Create record.
exports.create = async (table, value) => {
	try {
		let data = {};
		for (let key in value) {
			data[key] = value[key];
		}
		data['createdDate'] = DateTime.utc().toISO();
		data['lastModified'] = DateTime.utc().toISO();

		let res = await db.collection(table).add(data);
		data['id'] = res.id;
		return data;
	} catch (err) {
		throw err;
	}
};

// Update record.
exports.update = async (table, id, value) => {
	try {
		let data = {};
		for (let key in value) {
			data[key] = value[key];
		}
		data['lastModified'] = DateTime.utc().toISO();

		let docRef = db.collection(table).doc(id);
		await docRef.update(data);
		let res = await docRef.get();
		let returnData = res.data();
		returnData['id'] = res.id;
		return returnData;
	} catch (err) {
		throw err;
	}
};

// Delete record.
exports.delete = async (table, id) => {
	try {
		let docRef = await db.collection(table).doc(id);
		let doc = await docRef.get();
		if (doc.data()) {
			await docRef.delete();
			return {
				status: 200,
				message: `${id} = deleted...`,
			};
		}
	} catch (err) {
		throw err;
	}
};

exports.batchDelete = async (table, operator, query) => {
	try {
		let docRef = await db.collection(table);
		let batch = db.batch();
		for (let key in query) {
			let snapshot = await docRef.where(key, operator, query[key]).get();
			snapshot.forEach((doc) => {
				batch.delete(doc.ref);
			});
		}
		batch.commit();
	} catch (err) {
		throw err;
	}
};
