var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);

export default class DBHelper {

    constructor() {

    }

    addEvent(event) {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO event(color_hexid, starttime, endtime, title, description) values(?,?,?,?,?)',
                [
                    event.eventColor,
                    event.startTime,
                    event.endTime,
                    event.eventTitle,
                    event.eventDescription,
                ], (tx, results) => { }
            );
        });
    }

    updateEvent(event) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE event set color_hexid = ?, starttime = ?, endtime = ?, title = ?, description = ? WHERE id = ?',
                [
                    event.eventColor,
                    event.startTime,
                    event.endTime,
                    event.eventTitle,
                    event.eventDescription,
                    event.eventId
                ], (tx, results) => { }
            );
        });
    }

    getLatestEventId() {
        return new Promise((resolve, reject) => {            
            db.transaction((tx) => {
                tx.executeSql('SELECT id FROM event ORDER BY id DESC', [], (tx, results) => {
                    let row = results.rows.item(0);
                    let lastEventId = row.id;                    
                    resolve(lastEventId);
                });
            });
            
        });
    }

    getEventList(startTimestamp, endTimestamp) {
        return new Promise((resolve, reject) => {
            let monthEventList = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM event where starttime >= ? and starttime <= ? ORDER BY starttime ASC', [startTimestamp, endTimestamp], (tx, results) => {
                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        let event = {
                            eventId: row.id,
                            eventColor: row.color_hexid,
                            startTime: row.starttime,
                            endTime: row.endtime,
                            eventTitle: row.title,
                            eventDescription: row.description
                        }
                        monthEventList = [...monthEventList, event];
                    }
                    resolve(monthEventList);
                });
            });
        });
    }

    getEventColorList() {
        return new Promise((resolve, reject) => {
            let eventColorList = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM event_color', [], (tx, results) => {

                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        let color = {
                            id: row.id,
                            name: row.name,
                            hex: row.hex,
                        }
                        eventColorList = [...eventColorList, color];
                    }
                    resolve(eventColorList);
                });
            });
        });
    }


    errorCB(err) {
        // console.log("SQL Error: " + err);
    }

    successCB() {
        // console.log("SQL executed fine");
    }

    openCB() {
        // console.log("Database OPENED");
    }

}