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
                id: action.id,
                hex: action.hex,
                startTime: action.startTime,
                endTime: action.endTime,
                title: action.title,
                description: action.description
            }
        default:
            return state
    }
}

export default currentSelectedEvent