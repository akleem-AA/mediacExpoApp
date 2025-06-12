"use client";

import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

export default function PDFViewerApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  // Use Google Docs Viewer as fallback for better compatibility
  const pdfUrl = "https://mediac.in/diet.pdf";
  const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    pdfUrl
  )}`;

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // Test if the PDF URL is accessible
        const response = await fetch(pdfUrl, { method: "HEAD" });
        if (response.ok) {
          setPdfUri(googleDocsUrl); // Use Google Docs viewer for better compatibility
        } else {
          throw new Error("PDF not accessible");
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        setError(true);
        Alert.alert("Error", "Failed to load the PDF file.");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, []);

  const handleOpenInBrowser = () => {
    Linking.openURL(pdfUrl).catch(() => {
      Alert.alert("Error", "Could not open PDF in browser");
    });
  };

  const renderWebView = () => {
    if (pdfUri) {
      return (
        <WebView
          source={{ uri: pdfUri }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          // Production-ready configurations
          allowsFullscreenVideo={true}
          allowsProtectedMedia={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          originWhitelist={["*"]}
          userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
            setError(true);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("HTTP error: ", nativeEvent);
            if (nativeEvent.statusCode >= 400) {
              setError(true);
            }
          }}
          onShouldStartLoadWithRequest={(request) => {
            return true;
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6a11cb" />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a11cb" />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      );
    }
  };

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Failed to Load PDF</Text>
      <Text style={styles.errorText}>
        Something went wrong while loading the PDF.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleOpenInBrowser}
      >
        <Text style={styles.retryButtonText}>Open in Browser</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diet PDF Viewer</Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        {loading
          ? renderWebView()
          : error
          ? renderErrorState()
          : renderWebView()}
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
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
  retryButton: {
    backgroundColor: "#6a11cb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
