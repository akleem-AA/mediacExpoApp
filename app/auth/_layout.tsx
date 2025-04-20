import { useAuth } from '@/context/AuthProvider';
import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
    const { user } = useAuth();

    if (user) {
        return <Redirect href="/" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
