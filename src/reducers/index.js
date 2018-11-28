import {combineReducers} from 'redux'
import currentSelectedEvent from './currentSelectedEvent'
import eventColorList from './eventColorList'
import selectedDayEventList from './selectedDayEventList'


export default combineReducers({
    currentSelectedEvent: currentSelectedEvent,
    eventColorList: eventColorList,
    selectedDayEventList: selectedDayEventList,    
})