const express = require('express');
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
const app = express();

app.use(express.json());
app.post('/', function(req, res) {
	const entryKey = datastore.key(['Event']);
	const payload = req.body;

	const entry = {
		key: entryKey,
		data: {
			'location': payload.location,
			'type': payload.type,
			'date': new Date()
		}
	};


	datastore
		.save(entry)
		.then(() => {
			console.log(`Saved entity: ` + entry);
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
