import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { API_URL } from "@/constants/Api";
import axios from "axios";
import { getToken } from "@/services/auth";
import handleFileUpload from "@/utils/handleFileUpload";
import { useLocalSearchParams } from "expo-router";

interface DocumentItem {
  id: number | string;
  url: string;
  uploadedAt?: string;
}

interface Props {
  user: { userId: number | string };
}

const UploadedDocumentsScreen = ({ user }: Props) => {
  const { userId } = useLocalSearchParams();
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(`${API_URL}/patients/files/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("feth all document",res.data)
        setDocuments(res?.data || []);
      } else {
        Alert.alert("Error", "Unable to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      Alert.alert("Error", "Failed to fetch uploaded documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadAndRefresh = async () => {
    await handleFileUpload(userId);
    fetchDocuments(); // Refresh after upload
  };

  const openFile = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open this file");
    }
  };

  const renderItem = ({ item }: { item: DocumentItem }) => {
    const fileName = item.url.split("/").pop();
    return (
      <TouchableOpacity style={styles.item} onPress={() => openFile(item.url)}>
        <Ionicons name="document-outline" size={24} color="#4A55A2" />
        <Text style={styles.fileText}>{fileName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadAndRefresh}>
        <Ionicons name="cloud-upload-outline" size={22} color="white" />
        <Text style={styles.uploadText}>Upload File</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Uploaded Documents</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A55A2" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No documents uploaded.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default UploadedDocumentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#4A55A2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    marginVertical: 16,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  fileText: {
    marginLeft: 10,
    color: "#333",
  },
});
