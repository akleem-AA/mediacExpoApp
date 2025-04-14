import {jwtDecode} from 'jwt-decode';

export interface DecodedToken {
    userId: number;
    exp: number;
    iat: number;
    role: number;
    name:string;
    email:string;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
