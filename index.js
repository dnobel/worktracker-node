const express = require('express');
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
const app = express();
const moment = require('moment');

app.use(express.json());
app.post('/ifttt/area', function(req, res) {
	
	const entryKey = datastore.key(['Event']);
	const payload = req.body;
	const date = moment(payload.at, 'MMM DD, YYYY at hh:mm A');
	
	const entry = {
		key: entryKey,
		data: {
			'location': payload.location,
			'type': payload.type,
			'date': date.toDate()
		}
	};

	datastore
		.save(entry)
		.then(() => {
			console.log(`Saved entity: ` + entry);
			newEntryAdded(entry);
			res.status(200).send(entry);
		})
		.catch(err => {
			console.error('ERROR:', err);
			res.status(500).send(err);
		});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

function newEntryAdded(entry) {
	console.log("New " + entry);
}
