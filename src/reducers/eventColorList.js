const eventColorList = (state = [], action) => {
    switch (action.type) {
        case 'ADD_COLOR':
            // console.log(action);
            return [
                ...state,
                action
            ]

        default:
            return state
    }
}

export default eventColorList