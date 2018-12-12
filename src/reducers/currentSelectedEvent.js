const currentSelectedEvent = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_CURRENT':
            return state = action.event;
            
        default:
            return state
    }
}

export default currentSelectedEvent