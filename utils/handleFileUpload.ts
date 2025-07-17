import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { Alert } from 'react-native';
import { getToken } from '@/services/auth';
import { API_URL } from '@/constants/Api';

interface User {
  userId: number | string;
}

/**
 * Opens a file picker, and uploads the selected file to the backend.
 * @param user User object containing userId
 */
const handleFileUpload = async (user: User | null) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    if (!asset.uri || !user) {
      Alert.alert('Error', 'Missing file or user information.');
      return;
    }

    const token = await getToken();

    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType || 'application/octet-stream', // fallback still added
    } as any);

    formData.append('userid',user.toString());

    const response = await axios.post(`${API_URL}/patients/files`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200 || response.status === 201) {
      Alert.alert('Success', 'File uploaded successfully.');
    } else {
      Alert.alert('Upload Failed', 'Unexpected response from the server.');
    }
  } catch (err: any) {
    console.error('File upload error:', err?.response || err?.message || err);
    Alert.alert('Error', 'Something went wrong while uploading the file.');
  }
};

export default handleFileUpload;
