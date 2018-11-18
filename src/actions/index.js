// export const udpateCurrentSelectedEvent = (eventId, eventColor, startTime, endTime, eventTitle, eventDescription) => ({
//     type: 'UPDATE_CURRENT',
//     eventId,
//     eventColor, 
//     startTime,
//     endTime, 
//     eventTitle,
//     eventDescription
// })

export const updateCurrentSelectedEvent = (action) => ({
    type: 'UPDATE_CURRENT',
    eventId: action.eventId,
    eventColor: action.eventColor,
    startTime: action.startTime,
    endTime: action.endTime,
    eventTitle: action.eventTitle,
    eventDescription: action.eventDescription
})