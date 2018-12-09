const eventColorList = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_COLOR_LIST':
            // console.log(action);
            // console.log(action);
            return state = action.eventColorList;

        default:
            return state
    }
}

export default eventColorList