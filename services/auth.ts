import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from "@/constants/Api";
import { decodeToken } from '@/utils/jwtHelper';


export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });

        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);        
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getToken = async () => {
    return await AsyncStorage.getItem('token');
};

export const getDecodedToken = async () => {
    try {
        const token= await AsyncStorage.getItem('token');
        if (!token) return null;
        const decoded = decodeToken(token);
        return decoded;
    } catch (error) {
        
    }
};

export const logoutUser = async () => {
    try {        

    await AsyncStorage.removeItem('token');
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};
