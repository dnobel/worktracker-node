const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

class Workday {
    constructor(name) {
        this.name = name;
    }

    print() {
        console.log('Name is :' + this.name);
    }
}

class WorkdayRepository {

    setTravelToWorkMinutes(workday, minutes) {
        this.updateEntry(workday, 'travelToWorkMinutes', minutes);
    }

    setWorkingMinutes(workday, minutes) {
        this.updateEntry(workday, 'workingMinutes', minutes);
    }

    setTravelToHomeMinutes(workday, minutes) {
        this.updateEntry(workday, 'travelToHomeMinutes', minutes);
    }

    updateEntry(workday, property, minutes) {
        const key = datastore.key(['Workday', workday]);
        datastore.get(workday).then(function(results) {
            if (results.length === 0) {
                const workdayEntry = {
                    key: key,
                    data: {
                        day: workday
                    }
                };
                workdayEntry.data[property] = minutes;
                datastore.save(workdayEntry).then(() => {
                    console.log('Saved workday');
                });
            } else {
                const workdayEntry = result[0];
                workdayEntry[property] = minutes;
                datastore.save(workdayEntry).then(() => {
                    console.log('Saved workday');
                });
            }
        });
    }

}

module.exports = {
    Workday,
    WorkdayRepository
}
