import { jwtDecode } from 'jwt-decode';

export interface IUser {
    userId: number;
    exp: number;
    iat: number;
    role: number;
    name: string;
    email: string;
    fcmToken: string | null;
}

export const decodeToken = (token: string): IUser | null => {
    try {
        return jwtDecode<IUser>(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
