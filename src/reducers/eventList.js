// refreshEventList = () => {
//     let SQLite = require('react-native-sqlite-storage');
//     let db = SQLite.openDatabase({ name: 'calendarr.db', createFromLocation: '~calendar.db' }, this.openCB, this.errorCB);
//     let events = [];
//     db.transaction((tx) => {
//         tx.executeSql('SELECT * FROM event', [], (tx, results) => {
//             let len = results.rows.length;
//             for (let i = 0; i < len; i++) {
//                 let row = results.rows.item(i);
//                 let event = {
//                     eventId: row.id,
//                     eventColor: row.color_hexid,
//                     startTime: row.starttime,
//                     endTime: row.endtime,
//                     eventTitle: row.title,
//                     eventDescription: row.description
//                 }

//                 // console.log(event);
//                 events = [...events, event];
//                 console.log(events);
//             }
//         });
//         return events;
//     });
// }

const eventList = (state = [], action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            // console.log(action);
            return [
                ...state,
                action
            ]

        case 'UPDATE_EVENT':
            return state.map(event =>
                (event.eventId === action.eventId)
                    ? { ...action } : event)

        // case 'LOAD_EVENT':
        //     return state

        default:
            return state
    }
}

export default eventList