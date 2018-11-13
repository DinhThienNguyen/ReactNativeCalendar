import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'

export default combineReducers({
    currentEvent: currentSelectedEvent,
})