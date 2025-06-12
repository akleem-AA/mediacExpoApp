"use client";

import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";

export default function SimplePDFViewer() {
  const [viewerType, setViewerType] = useState<"webview" | "external">(
    "webview"
  );
  const [error, setError] = useState(false);

  const pdfUrl = "https://mediac.in/diet.pdf";

  // Simple, reliable PDF viewer URL that works in production
  const pdfViewerUrl = `data:text/html;charset=utf-8,
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; }
            iframe { width: 100%; height: 100vh; border: none; }
            .error { padding: 20px; text-align: center; font-family: Arial; }
        </style>
    </head>
    <body>
        <iframe src="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          pdfUrl
        )}" 
                onerror="document.body.innerHTML='<div class=error>PDF failed to load. <a href=${pdfUrl}>Open directly</a></div>'">
        </iframe>
    </body>
    </html>`;

  const openInExternalApp = async () => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert(
          "No PDF Viewer",
          "Please install a PDF viewer app to open this document.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Download PDF App",
              onPress: () => {
                const storeUrl =
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/app/adobe-acrobat-reader/id469337564"
                    : "https://play.google.com/store/apps/details?id=com.adobe.reader";
                Linking.openURL(storeUrl);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Could not open PDF");
    }
  };

  const renderWebViewPDF = () => (
    <WebView
      source={{ uri: pdfViewerUrl }}
      style={styles.webview}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      mixedContentMode="compatibility"
      originWhitelist={["*"]}
      onError={() => setError(true)}
      onHttpError={() => setError(true)}
      userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
    />
  );

  const renderErrorFallback = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>PDF Viewer</Text>
      <Text style={styles.errorText}>
        Choose how you'd like to view the PDF document:
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={openInExternalApp}
      >
        <Text style={styles.buttonText}>📱 Open in PDF App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => {
          setError(false);
          setViewerType("webview");
        }}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          🌐 Try Web Viewer
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.linkButton]}
        onPress={() => Linking.openURL(pdfUrl)}
      >
        <Text style={[styles.buttonText, styles.linkButtonText]}>
          🔗 Open Link Directly
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diet PDF</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setError(!error)}
        >
          <Text style={styles.headerButtonText}>Options</Text>
        </TouchableOpacity>
      </View>

      {/* PDF Content */}
      <View style={styles.content}>
        {error || viewerType === "external"
          ? renderErrorFallback()
          : renderWebViewPDF()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  headerButtonText: {
    fontSize: 14,
    color: "#666666",
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fafafa",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  linkButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  linkButtonText: {
    color: "#666666",
  },
});
