import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'
import selectedDayEventList from './selectedDayEventList'
import lastEventId from './lastEventId'

export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList,
    selectedDayEventList: selectedDayEventList,
    lastEventId : lastEventId   
})