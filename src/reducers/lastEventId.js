const lastEventId = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_LAST_ID":
            // console.log(action);
            state = action.lastEventId;
            // console.log(action.lastEventId);
        default:
            return state
    }
}

export default lastEventId