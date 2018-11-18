import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'

export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList
})