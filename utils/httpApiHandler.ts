import { API_URL } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const httpApiHandler = axios.create({
    baseURL: API_URL,
})

httpApiHandler.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // or AsyncStorage in React Native
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default httpApiHandler