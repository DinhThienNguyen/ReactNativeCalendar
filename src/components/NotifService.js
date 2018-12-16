import PushNotification from 'react-native-push-notification';

export default class NotifService {

  // constructor() {

  // }

  constructor(onNotification) {
    this.configure(onNotification);
  }

  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,
    });
    console.log("configured");
  }

  scheduleNotif(notifyTime, event, notifId) {
    console.log("scheduling")
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + (notifyTime * 1000)),
      id: `${notifId}`,
      title: event.eventTitle,
      message: event.eventDescription,
      number: `${event.eventId}`,
    });
  }

  cancelNotif(notifyId) {
    PushNotification.cancelLocalNotifications({id: `${notifyId}`});
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }
}