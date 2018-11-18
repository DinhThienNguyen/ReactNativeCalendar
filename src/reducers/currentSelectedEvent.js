const initialState = {
    id: -1,
    hex: '',
    startTime: 0,
    endTime: 0,
    title: '',
    description: ''
}

const currentSelectedEvent = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_CURRENT':
            console.log(action);
            return {
                eventId: action.eventId,
                eventColor: action.eventColor,
                startTime: action.startTime,
                endTime: action.endTime,
                eventTitle: action.eventTitle,
                eventDescription: action.eventDescription
            }
        default:
            return state
    }
}

export default currentSelectedEvent