const globalDBHelper = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_DB_HELPER':
            return state = action.DBHelper;

        default:
            return state
    }
}

export default globalDBHelper