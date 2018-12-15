import PushNotification from 'react-native-push-notification';

export default class NotifService {

  constructor() {

  }

  // constructor(onNotification) {
  //   this.configure(onNotification);
  // }

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
      message: event.eventTitle,
      number: `${event.eventId}`,
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }
}