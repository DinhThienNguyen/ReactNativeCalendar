import PushNotification from 'react-native-push-notification';

export default class NotifService {

  constructor(onNotification) {    
    this.configure(onNotification);    
    console.log("configured");
  }

  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,
    });
  }  

  scheduleNotif(notifyTime, event, notifId) {    
    console.log("scheduling")
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (notifyTime * 1000)), 
      id: `${notifId}`, 
      message: event.eventTitle,      
      number: `${event.eventId}`,
    });
  }
}