import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'
import eventList from './eventList'

export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList,
    eventList: eventList
})