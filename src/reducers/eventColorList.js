const eventColorList = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_COLOR_LIST':
            console.log(action);
            return [
                ...state,
                action
            ]

        default:
            return state
    }
}

export default eventColorList