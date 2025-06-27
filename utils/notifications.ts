// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { IUser } from './jwtHelper';
import axios from 'axios';
import { API_URL } from '@/constants/Api';
import { getToken } from '@/services/auth';

export async function registerForPushNotificationsAsync(user: IUser): Promise<string | undefined> {
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

        const fcmToken = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', fcmToken);
        if (user?.fcmToken === null || fcmToken !== user?.fcmToken) {
            const token = await getToken();
            await axios.post(`${API_URL}/users/fcm-token`,
                {
                    token: fcmToken,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        }
        return fcmToken;
    } catch (error) {
        console.log("error", error)

    }
}
