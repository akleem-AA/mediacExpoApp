"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

export default function FilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [language, setLanguage] = useState("en"); // en or hi

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  // Translations
  const translations = {
    en: {
      Files: "Files",
      "Upload Files": "Upload Files",
      "Add File": "Add File",
      "Upload medical documents, test results, or images related to your health":
        "Upload medical documents, test results, or images related to your health",
      "Add a description for your file...":
        "Add a description for your file...",
      Document: "Document",
      Gallery: "Gallery",
      Camera: "Camera",
      "Selected Files": "Selected Files",
      Upload: "Upload",
      Back: "Back",
      "No files uploaded": "No files uploaded",
      Today: "Today",
      Yesterday: "Yesterday",
      Description: "Description",
      "Uploaded Files": "Uploaded Files",
      View: "View",
      Download: "Download",
      "Unable to open file": "Unable to open file",
    },
    hi: {
      Files: "फ़ाइलें",
      "Upload Files": "फ़ाइलें अपलोड करें",
      "Add File": "फ़ाइल जोड़ें",
      "Upload medical documents, test results, or images related to your health":
        "अपने स्वास्थ्य से संबंधित चिकित्सा दस्तावेज, परीक्षण परिणाम या छवियां अपलोड करें",
      "Add a description for your file...":
        "अपनी फ़ाइल के लिए एक विवरण जोड़ें...",
      Document: "दस्तावेज़",
      Gallery: "गैलरी",
      Camera: "कैमरा",
      "Selected Files": "चयनित फ़ाइलें",
      Upload: "अपलोड",
      Back: "वापस",
      "No files uploaded": "कोई फ़ाइल अपलोड नहीं की गई",
      Today: "आज",
      Yesterday: "कल",
      Description: "विवरण",
      "Uploaded Files": "अपलोड की गई फ़ाइलें",
      View: "देखें",
      Download: "डाउनलोड",
      "Unable to open file": "फ़ाइल खोलने में असमर्थ",
    },
  };

  // Translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  // Handle file picking
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const newFile = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          description: fileDescription,
          date: new Date(),
          formattedDate: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isToday: true,
        };

        setUploadedFiles([newFile, ...uploadedFiles]);
        setFileDescription("");
      }
    } catch (err) {
      console.log("Document picking error:", err);
    }
  };

  // Handle image picking from camera or gallery
  const pickImage = async (useCamera = false) => {
    try {
      let result;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFile = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          name: `image_${Date.now()}.jpg`,
          type: "image/jpeg",
          description: fileDescription,
          date: new Date(),
          formattedDate: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isToday: true,
        };

        setUploadedFiles([newFile, ...uploadedFiles]);
        setFileDescription("");
      }
    } catch (err) {
      console.log("Image picking error:", err);
    }
  };

  // Handle file upload submission
  const handleFileUpload = () => {
    if (uploadedFiles.length > 0) {
      console.log("Files to upload:", uploadedFiles);
      // Here you would typically send these files to your backend
      setIsAddingFile(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fileDate = new Date(date);
    const fileDay = new Date(
      fileDate.getFullYear(),
      fileDate.getMonth(),
      fileDate.getDate()
    );

    if (fileDay.getTime() === today.getTime()) {
      return t("Today");
    } else if (fileDay.getTime() === yesterday.getTime()) {
      return t("Yesterday");
    } else {
      return fileDate.toLocaleDateString();
    }
  };

  // Load sample data for demo
  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleFiles = [
      {
        id: "1",
        name: "blood_test_results.pdf",
        type: "application/pdf",
        description: "Complete blood count results",
        date: now,
        formattedDate: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isToday: true,
      },
      {
        id: "2",
        name: "chest_xray.jpg",
        type: "image/jpeg",
        description: "Chest X-ray from hospital visit",
        date: yesterday,
        formattedDate: yesterday.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isToday: false,
      },
    ];

    setUploadedFiles(sampleFiles);
  }, []);

  // Function to handle file viewing
  const handleFileView = async (file) => {
    try {
      if (file.type.includes("image")) {
        // For images, open in the browser
        await WebBrowser.openBrowserAsync(file.uri);
      } else {
        // For documents, try to open with the system viewer
        await WebBrowser.openBrowserAsync(file.uri);
      }
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Unable to open this file type");
    }
  };

  // Function to handle file download/sharing
  const handleFileDownload = async (file) => {
    try {
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        // Share the file
        await Sharing.shareAsync(file.uri, {
          mimeType: file.type,
          dialogTitle: `Download ${file.name}`,
        });
      } else {
        alert("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("Unable to download this file");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f8" />
      {/* Background decorative elements */}
      <View style={styles.purpleAccent1} />
      <View style={styles.purpleAccent2} />
      <View style={styles.purpleAccent3} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("Files")}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.languageToggle}>
              {language === "en" ? "हिंदी" : "EN"}
            </Text>
          </TouchableOpacity>
        </View>

        {isAddingFile ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>{t("Upload Files")}</Text>

            <Text style={styles.uploadInstructions}>
              {t(
                "Upload medical documents, test results, or images related to your health"
              )}
            </Text>

            <TextInput
              style={styles.descriptionInput}
              placeholder={t("Add a description for your file...")}
              value={fileDescription}
              onChangeText={setFileDescription}
            />

            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#4A55A2" }]}
                onPress={pickDocument}
              >
                <Ionicons name="document-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>{t("Document")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#7A39A3" }]}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="image-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>{t("Gallery")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#00A86B" }]}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>{t("Camera")}</Text>
              </TouchableOpacity>
            </View>

            {uploadedFiles.length > 0 && (
              <>
                <Text style={styles.filesTitle}>{t("Selected Files")}:</Text>
                <FlatList
                  data={uploadedFiles}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.fileItem}>
                      <View style={styles.fileIconContainer}>
                        <Ionicons
                          name={
                            item.type.includes("image")
                              ? "image"
                              : "document-text"
                          }
                          size={24}
                          color="#4A55A2"
                        />
                      </View>
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.description ? (
                          <Text
                            style={styles.fileDescription}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setUploadedFiles(
                            uploadedFiles.filter((file) => file.id !== item.id)
                          );
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#FF5A5F"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  style={styles.filesList}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleFileUpload}
                >
                  <Text style={styles.submitButtonText}>{t("Upload")}</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        ) : (
          <View style={styles.filesListContainer}>
            <View style={styles.filesListHeader}>
              <Text style={styles.sectionTitle}>{t("Uploaded Files")}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsAddingFile(true)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {uploadedFiles.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="cloud-upload-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  {t("No files uploaded")}
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => setIsAddingFile(true)}
                >
                  <Text style={styles.emptyStateButtonText}>
                    {t("Add File")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={uploadedFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.fileHistoryItem}
                    onPress={() => handleFileView(item)}
                  >
                    <View style={styles.fileHistoryHeader}>
                      <View style={styles.fileIconContainer}>
                        <Ionicons
                          name={
                            item.type.includes("image")
                              ? "image"
                              : "document-text"
                          }
                          size={24}
                          color="#4A55A2"
                        />
                      </View>
                      <View style={styles.fileHeaderContent}>
                        <Text style={styles.fileName}>{item.name}</Text>
                        <View style={styles.fileDateContainer}>
                          <Text style={styles.fileDate}>
                            {formatDate(item.date)}
                          </Text>
                          <Text style={styles.fileTime}>
                            {item.formattedDate}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {item.description ? (
                      <View style={styles.fileDescriptionContainer}>
                        <Text style={styles.descriptionLabel}>
                          {t("Description")}:
                        </Text>
                        <Text style={styles.descriptionText}>
                          {item.description}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.fileActionsContainer}>
                      <TouchableOpacity
                        style={styles.viewFileButton}
                        onPress={() => handleFileView(item)}
                      >
                        <Ionicons name="eye-outline" size={16} color="white" />
                        <Text style={styles.viewFileButtonText}>
                          {t("View")}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.downloadFileButton}
                        onPress={() => handleFileDownload(item)}
                      >
                        <Ionicons
                          name="download-outline"
                          size={16}
                          color="white"
                        />
                        <Text style={styles.viewFileButtonText}>
                          {t("Download")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.filesList}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  languageToggle: {
    fontSize: 16,
    color: "#4A55A2",
    fontWeight: "500",
  },
  backToListButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backToListText: {
    fontSize: 16,
    color: "#4A55A2",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  uploadInstructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  uploadButton: {
    width: "30%",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  filesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  filesList: {
    paddingBottom: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  fileDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: "#4A55A2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  filesListContainer: {
    flex: 1,
  },
  filesListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4A55A2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fileHistoryItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileHistoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fileHeaderContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileDateContainer: {
    alignItems: "flex-end",
  },
  fileDate: {
    fontSize: 14,
    color: "#666",
  },
  fileTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  fileDescriptionContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#4A55A2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  purpleAccent1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(74, 85, 162, 0.1)",
    top: -20,
    right: -30,
  },
  purpleAccent2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74, 85, 162, 0.08)",
    top: 100,
    right: 40,
  },
  purpleAccent3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(74, 85, 162, 0.05)",
    bottom: 100,
    left: -50,
  },
  fileActionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  viewFileButton: {
    backgroundColor: "#4A55A2",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  downloadFileButton: {
    backgroundColor: "#7A39A3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  viewFileButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
