const latestEventNotifyId = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_LAST_EVENT_NOTIFY_ID":
            // console.log("action.latestEventId: ");
            // console.log(action);
            return state = action.latestEventNotifyId;

        default:
            return state
    }
}

export default latestEventNotifyId