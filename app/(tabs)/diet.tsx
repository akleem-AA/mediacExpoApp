"use client";

import { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

const { width, height } = Dimensions.get("window");

export default function PDFViewerApp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentViewer, setCurrentViewer] = useState(0);
  const [downloadedUri, setDownloadedUri] = useState<string | null>(null);

  const pdfUrl = "https://mediac.in/diet.pdf";

  // Multiple PDF viewer options for better production compatibility
  const pdfViewers = [
    {
      name: "PDF.js",
      url: `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
        pdfUrl
      )}`,
    },
    {
      name: "Google Drive",
      url: `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
        pdfUrl
      )}`,
    },
    {
      name: "Google Docs",
      url: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        pdfUrl
      )}`,
    },
    {
      name: "Office Online",
      url: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        pdfUrl
      )}`,
    },
  ];

  const downloadPDF = useCallback(async () => {
    try {
      setLoading(true);

      // Check if already downloaded
      if (downloadedUri) {
        Alert.alert("Success", "PDF already downloaded!");
        return;
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        FileSystem.documentDirectory + "diet.pdf",
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${(progress * 100).toFixed(2)}%`);
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        setDownloadedUri(result.uri);
        Alert.alert("Success", "PDF downloaded successfully!");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "Unable to download PDF. Try opening externally."
      );
    } finally {
      setLoading(false);
    }
  }, [downloadedUri]);

  const sharePDF = useCallback(async () => {
    try {
      if (downloadedUri) {
        // Share downloaded file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadedUri);
        } else {
          throw new Error("Sharing not available");
        }
      } else {
        // Share URL
        await Share.share({
          message: `Check out this PDF: ${pdfUrl}`,
          url: pdfUrl,
          title: "Diet PDF",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Share Failed", "Unable to share PDF");
    }
  }, [downloadedUri]);

  const printPDF = useCallback(async () => {
    try {
      if (downloadedUri) {
        await Print.printAsync({
          uri: downloadedUri,
        });
      } else {
        Alert.alert("Print", "Please download the PDF first to print it.");
      }
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Print Failed", "Unable to print PDF");
    }
  }, [downloadedUri]);

  const openInExternalApp = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert(
          "No PDF Reader Found",
          "Please install a PDF reader app to view this document.",
          [
            {
              text: "Download PDF Reader",
              onPress: () => {
                const storeUrl = Platform.select({
                  ios: "https://apps.apple.com/app/adobe-acrobat-reader/id469337564",
                  android:
                    "https://play.google.com/store/apps/details?id=com.adobe.reader",
                });
                if (storeUrl) Linking.openURL(storeUrl);
              },
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      console.error("External app error:", error);
      Alert.alert("Error", "Failed to open PDF in external app");
    }
  }, []);

  const switchViewer = useCallback(() => {
    const nextViewer = (currentViewer + 1) % pdfViewers.length;
    setCurrentViewer(nextViewer);
    setError(false);
    Alert.alert(
      "Switched Viewer",
      `Now using: ${pdfViewers[nextViewer].name}`,
      [{ text: "OK" }]
    );
  }, [currentViewer]);

  const handleWebViewError = useCallback(
    (syntheticEvent: any) => {
      const { nativeEvent } = syntheticEvent;
      console.warn("WebView error:", nativeEvent);
      setError(true);

      Alert.alert(
        "Loading Error",
        `Failed to load PDF with ${pdfViewers[currentViewer].name}. Try a different viewer or open externally?`,
        [
          { text: "Switch Viewer", onPress: switchViewer },
          { text: "Open Externally", onPress: openInExternalApp },
          { text: "Cancel", style: "cancel" },
        ]
      );
    },
    [currentViewer, switchViewer, openInExternalApp]
  );

  const handleWebViewHttpError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("HTTP error:", nativeEvent);
    if (nativeEvent.statusCode >= 400) {
      setError(true);
    }
  }, []);

  const renderWebView = () => {
    if (downloadedUri) {
      // Show downloaded PDF
      return (
        <WebView
          source={{ uri: downloadedUri }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          onError={handleWebViewError}
          onHttpError={handleWebViewHttpError}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6a11cb" />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )}
        />
      );
    }

    // Show online PDF viewer
    return (
      <WebView
        source={{ uri: pdfViewers[currentViewer].url }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
        onError={handleWebViewError}
        onHttpError={handleWebViewHttpError}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6a11cb" />
            <Text style={styles.loadingText}>
              Loading with {pdfViewers[currentViewer].name}...
            </Text>
          </View>
        )}
      />
    );
  };

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
      <Text style={styles.errorTitle}>Failed to Load PDF</Text>
      <Text style={styles.errorText}>
        Current viewer: {pdfViewers[currentViewer].name}
      </Text>
      <View style={styles.errorButtons}>
        <TouchableOpacity style={styles.errorButton} onPress={switchViewer}>
          <Text style={styles.errorButtonText}>Try Different Viewer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={openInExternalApp}
        >
          <Text style={styles.errorButtonText}>Open Externally</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diet PDF Viewer</Text>
        <TouchableOpacity onPress={switchViewer} style={styles.switchButton}>
          <Ionicons name="refresh-outline" size={20} color="#6a11cb" />
        </TouchableOpacity>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        {error ? renderErrorState() : renderWebView()}
      </View>

      {/* Bottom Navigation Links */}
      {/* <View style={styles.bottomLinksContainer}>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={downloadPDF}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={16} color="#6a11cb" />
          ) : (
            <Ionicons
              name={
                downloadedUri ? "checkmark-circle-outline" : "download-outline"
              }
              size={20}
              color="#6a11cb"
            />
          )}
          <Text style={styles.linkText}>
            {downloadedUri ? "Downloaded" : "Download"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={sharePDF}>
          <Ionicons name="share-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={openInExternalApp}>
          <Ionicons name="open-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>External</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={printPDF}>
          <Ionicons name="print-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>Print</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  switchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(106, 17, 203, 0.1)",
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6a11cb",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ff6b6b",
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  errorButtons: {
    flexDirection: "row",
    gap: 10,
  },
  errorButton: {
    backgroundColor: "#6a11cb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomLinksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    minWidth: 70,
  },
  linkText: {
    color: "#6a11cb",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
});
