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
            return state = action.event;
            
        default:
            return state
    }
}

export default currentSelectedEvent