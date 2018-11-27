import PushNotification from 'react-native-push-notification';

export default class NotifService {

  constructor(onNotification) {
    this.configure(onNotification);    
  }

  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,
    });
  }  

  scheduleNotif(notifyTime, eventId) {    
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (notifyTime * 1000)), // in 30 secs      
      id: `${eventId}`, 
      message: "My Notification Message",      
    });
  }
}