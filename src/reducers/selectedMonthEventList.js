import moment from 'moment';

const selectedMonthEventList = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            let dateString = moment(action.event.startTime * 1000).format('YYYY-MM-DD');
            if (!state[dateString]) {
                state[dateString] = [];
            }
            state[dateString] = [...state[dateString], action.event];
            return state;

        case 'UPDATE_LIST':
            state = action.dayEventList;
            return state;

        case 'RESET_LIST':
            state = [];

        default:
            return state
    }
}

export default selectedMonthEventList