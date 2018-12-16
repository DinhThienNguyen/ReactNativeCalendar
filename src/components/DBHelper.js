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

    deleteEvent(event) {
        db.transaction((tx) => {
            tx.executeSql('DELETE FROM event WHERE eventId = ?',
                [
                    event.eventId
                ], (tx, results) => { }
            );
        });
    }

    updateEvent(event) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE event set color_hexid = ?, starttime = ?, endtime = ?, title = ?, description = ? WHERE eventId = ?',
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

    addEventNotfication(notification) {
        // console.log("\nnotification: ");
        // console.log(notification);
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO event_notification(notifyId, eventId, notifyTime) values(?,?,?)',
                [
                    notification.notifyId,
                    notification.eventId,
                    notification.notifyTime,
                ], (tx, results) => { }
            );
        });
    }

    updateEventNotification(notification) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE event_notification set notifyTime = ? WHERE notifyId = ?',
                [
                    notification.notifyTime,
                    notification.notifyId,
                ], (tx, results) => { }
            );
        });
    }

    getAllEventNotification() {
        return new Promise((resolve, reject) => {
            let notificationList = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM event_notification', [], (tx, results) => {

                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        let notification = {
                            notifyId: row.notifyId,
                            eventId: row.eventId,
                            notifyTime: row.notifyTime,
                        }
                        notificationList = [...notificationList, notification];
                    }
                    resolve(notificationList);
                });
            });
        });
    }

    deleteEventNotification(notification) {
        db.transaction((tx) => {
            tx.executeSql('delete from event_notification where notifyId = ?',
                [
                    notification.notifyId
                ], (tx, results) => { }
            );
        });
    }

    getLatestEventId() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT eventId FROM event ORDER BY eventId DESC', [], (tx, results) => {
                    let row = results.rows.item(0);
                    let latestEventId = row.eventId;
                    resolve(latestEventId);
                });
            });

        });
    }

    getLatestEventNotifyId() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT notifyId FROM event_notification ORDER BY notifyId DESC', [], (tx, results) => {
                    let row = results.rows.item(0);
                    let latestEventNotifyId = row.notifyId;
                    resolve(latestEventNotifyId);
                });
            });

        });
    }

    getEventById(id) {
        return new Promise((resolve, reject) => {

            db.transaction((tx) => {
                tx.executeSql('SELECT event.*, event_notification.notifyId, event_notification.notifyTime from event left join event_notification on event.eventId = event_notification.eventId where event.eventId = ?', [id], (tx, results) => {
                    let len = results.rows.length;
                    let tempRow = results.rows.item(0);
                    let event = {
                        eventId: tempRow.eventId,
                        eventColor: tempRow.color_hexid,
                        startTime: tempRow.starttime,
                        endTime: tempRow.endtime,
                        eventTitle: tempRow.title,
                        eventDescription: tempRow.description,
                        notifyTime: []
                    };
                    if (tempRow.notifyId !== null) {
                        let notification = {
                            notifyId: tempRow.notifyId,
                            eventId: tempRow.eventId,
                            notifyTime: tempRow.notifyTime
                        };
                        event.notifyTime = [...event.notifyTime, notification];
                    }

                    for (let i = 1; i < len; i++) {
                        let row = results.rows.item(i);
                        if (event.eventId === row.eventId) {
                            if (row.notifyId !== null) {
                                let notification = {
                                    notifyId: row.notifyId,
                                    eventId: row.eventId,
                                    notifyTime: row.notifyTime
                                };
                                event.notifyTime = [...event.notifyTime, notification];
                            }
                        }
                    }
                    resolve(event);
                });
            });
        });
    }

    getEventList(startTimestamp, endTimestamp) {
        return new Promise((resolve, reject) => {

            db.transaction((tx) => {
                tx.executeSql('SELECT event.*, event_notification.notifyId, event_notification.notifyTime from event left join event_notification on event.eventId = event_notification.eventId where starttime >= ? and starttime <= ? ORDER BY starttime ASC', [startTimestamp, endTimestamp], (tx, results) => {
                    let len = results.rows.length;
                    let monthEventList = [];
                    let tempRow = results.rows.item(0);
                    let event = {
                        eventId: tempRow.eventId,
                        eventColor: tempRow.color_hexid,
                        startTime: tempRow.starttime,
                        endTime: tempRow.endtime,
                        eventTitle: tempRow.title,
                        eventDescription: tempRow.description,
                        notifyTime: []
                    };
                    if (tempRow.notifyId !== null) {
                        let notification = {
                            notifyId: tempRow.notifyId,
                            eventId: tempRow.eventId,
                            notifyTime: tempRow.notifyTime
                        };
                        event.notifyTime = [...event.notifyTime, notification];
                    }

                    for (let i = 1; i < len; i++) {
                        let row = results.rows.item(i);
                        if (event.eventId !== row.eventId) {
                            monthEventList = [...monthEventList, { ...event }];

                            event.eventId = row.eventId;
                            event.eventColor = row.color_hexid;
                            event.startTime = row.starttime;
                            event.endTime = row.endtime;
                            event.eventTitle = row.title;
                            event.eventDescription = row.description;
                            event.notifyTime = [];

                            if (row.notifyId !== null) {
                                let notification = {
                                    notifyId: row.notifyId,
                                    eventId: row.eventId,
                                    notifyTime: row.notifyTime
                                };
                                event.notifyTime = [...event.notifyTime, notification];
                            }
                        } else if (event.eventId === row.eventId) {
                            if (row.notifyId !== null) {
                                let notification = {
                                    notifyId: row.notifyId,
                                    eventId: row.eventId,
                                    notifyTime: row.notifyTime
                                };
                                event.notifyTime = [...event.notifyTime, notification];
                            }
                        }
                    }
                    monthEventList = [...monthEventList, { ...event }];
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
                            id: row.colorId,
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

    getLatestOEPFetchTime() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT latestOEPFetchTime FROM settings where id = 1', [], (tx, results) => {
                    let latestOEPFetchTime = 0;
                    let row = results.rows.item(0);
                    latestOEPFetchTime = row.latestOEPFetchTime;
                    resolve(latestOEPFetchTime);
                });
            });
        });
    }

    updateLatestOEPFetchTime(timeStamp) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE settings set latestOEPFetchTime = ? where id = 1', [timeStamp], (tx, results) => {
            });
        });
    }

    getLatestCTSVFetchTime() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT latestCTSVFetchTime FROM settings where id = 1', [], (tx, results) => {
                    let latestCTSVFetchTime = 0;
                    let row = results.rows.item(0);
                    latestCTSVFetchTime = row.latestCTSVFetchTime;
                    resolve(latestCTSVFetchTime);
                });
            });
        });
    }

    updateLatestCTSVFetchTime(timeStamp) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE settings set latestCTSVFetchTime = ? where id = 1', [timeStamp], (tx, results) => {
            });
        });
    }

    getLatestDAAFetchTime() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT latestDAAFetchTime FROM settings where id = 1', [], (tx, results) => {
                    let latestDAAFetchTime = 0;
                    let row = results.rows.item(0);
                    latestDAAFetchTime = row.latestDAAFetchTime;
                    resolve(latestDAAFetchTime);
                });
            });
        });
    }

    updateLatestDAAFetchTime(timeStamp) {
        db.transaction((tx) => {
            tx.executeSql('UPDATE settings set latestDAAFetchTime = ? where id = 1', [timeStamp], (tx, results) => {
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