// AuthProvider.js
import { loginUser } from '@/services/auth';
import { decodeToken, IUser } from '@/utils/jwtHelper';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContext = {
    user?: IUser | null,
    token?: string
    onLogin: (email: string, password: string) => void,
    onLogout: () => void,
}
const AuthContext = createContext<AuthContext>({
    user: null,
    token: undefined,
    onLogin: () => { },
    onLogout: () => { },
});

type AuthProviderProps = {
    children: React.ReactNode;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const [token, setToken] = useState();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(token)
                    const user = decodeToken(storedToken);
                    if (user) {
                        setUser(user);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Failed to load user:', err);
                setUser(null);
            }
        };
        loadUser();
    }, []);

    const onLogin = async (email: string, password: string) => {
        try {
            const response = await loginUser(email, password);
            if (response.token) {
                console.log("response", response.token)
                setToken(response.token);
                const user = decodeToken(response.token);
                if (user) {
                    setUser(user);
                    await registerForPushNotificationsAsync(user);
                }
                console.log("Token:", response.token);
                router.push("/(tabs)");
            }
        } catch (error) {
            console.log("error", error)
            throw (error)
        }
    }

    const onLogout = async() => {
        await AsyncStorage.removeItem('token');
        setUser(null);
        setToken(undefined);
    }
    return (
        <AuthContext.Provider value={{
            user,
            token,
            onLogin,
            onLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
