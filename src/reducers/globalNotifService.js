const globalNotifService = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_NOTIF_SERVICE':
            return state = action.notifService;

        default:
            return state
    }
}

export default globalNotifService