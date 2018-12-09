const latestEventId = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_LAST_ID":
            // console.log("action.latestEventId: ");
            // console.log(action);
            return state = action.latestEventId;

        default:
            return state
    }
}

export default latestEventId