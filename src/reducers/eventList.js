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

        default:
            return state
    }
}

export default eventList