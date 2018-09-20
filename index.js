const express = require('express');
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
const app = express();
const moment = require('moment');
const {WorkdayRepository, Workdays} = require('./workday-repository.js')
const workdayRepository = new WorkdayRepository();

app.use(express.json());
app.get('/workdays', function(req, res) {
	const query = datastore
		.createQuery('Workday')
		.order('day', {
			descending: true
		});
	datastore.runQuery(query).then(results => {
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(results[0]));
	});
});

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
	const query = datastore
		.createQuery('Event')
		.order('date', {
			descending: true,
		})
		.limit(2);
	datastore.runQuery(query).then(results => {

		const events = results[0];
		const currentEvent = events[0];
		const previousEvent = events[1];

		var workday = moment(currentEvent.date).format('YYYY-MM-DD');
		const minutes = moment.duration(moment(currentEvent.date).diff(moment(previousEvent.date))).asMinutes();

		if (currentEvent.location === 'work' && currentEvent.type === 'entered') {
			workdayRepository.setTravelToWorkMinutes(workday, minutes);
		} else if (currentEvent.location === 'work' && currentEvent.type === 'exited') {
			workdayRepository.setWorkingMinutes(workday, minutes);
		} else if (currentEvent.location === 'home' && currentEvent.type === 'entered') {
			workdayRepository.setTravelToHomeMinutes(workday, minutes);
		}
/*
		const workdayEntry = {
			key: datastore.key(['Workday', workday.day]),
			data: workday
		};

		datastore.upsert(workdayEntry).then(() => {
				console.log('Saved workday');
			})
			.catch(err => {
				console.error('ERROR:', err);
			});*/
	});
}
