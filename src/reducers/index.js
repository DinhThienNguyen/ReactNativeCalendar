import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'
import selectedMonthEventList from './selectedMonthEventList'
import latestEventId from './latestEventId'

export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList,
    selectedMonthEventList: selectedMonthEventList,
    latestEventId : latestEventId   
})