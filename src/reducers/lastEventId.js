const lastEventId = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_LAST_ID":
            state = action;

        default:
            return state
    }
}

export default lastEventId