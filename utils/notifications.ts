// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    try {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
        return token;
    } catch (error) {
        console.log("error", error)

    }
}
