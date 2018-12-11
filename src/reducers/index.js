import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'
import selectedMonthEventList from './selectedMonthEventList'
import latestEventId from './latestEventId'
import latestEventNotifyId from './latestEventNotifyId'
import globalNotifService from './globalNotifService'

export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList,
    selectedMonthEventList: selectedMonthEventList,
    latestEventId : latestEventId,
    globalNotifService : globalNotifService,
    latestEventNotifyId: latestEventNotifyId
})