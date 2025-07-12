import axios from "axios";
import { getToken } from "@/services/auth";
import { API_URL } from "@/constants/Api";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export const fetchUploadedDocuments = async (patientId) => {
  try {
    const token = await getToken();

    const response = await axios.get(`${API_URL}/patients/files/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("api resonse>>", response);
    if (response.status === 200) {
      return response.data; // assumed to be an array of file objects
    } else {
      console.error("Unexpected response:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

export const viewDocument = async (url) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    Alert.alert("Error", "Unable to open document.");
  }
};

// export const downloadDocument = async (url, filename) => {
//   try {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission denied",
//         "Enable storage permissions to download."
//       );
//       return;
//     }

//     const fileUri = FileSystem.documentDirectory + filename;
//     const downloadRes = await FileSystem.downloadAsync(url, fileUri);

//     const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
//     await MediaLibrary.createAlbumAsync("Downloads", asset, false);

//     Alert.alert("Success", "File downloaded to Downloads folder.");
//   } catch (error) {
//     console.error(error);
//     Alert.alert("Error", "Download failed.");
//   }
// };
export const downloadDocument = async (fileUrl, filename) => {
  try {
    const localUri = FileSystem.documentDirectory + filename;
    const downloadRes = await FileSystem.downloadAsync(fileUrl, localUri);

    Alert.alert("Download complete", `File saved to:\n${downloadRes.uri}`);
    console.log("Saved at:", downloadRes.uri);

    // Optionally open the file directly
    // await WebBrowser.openBrowserAsync(downloadRes.uri);
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert("Error", "Download failed.");
  }
};
