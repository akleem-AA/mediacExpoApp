import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

export default function App() {
  const pdfUrl = "https://mediac.in/diet.pdf";

  // For PDF viewing in React Native, we'll use WebView with Google Docs viewer
  const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    pdfUrl
  )}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        <WebView
          source={{ uri: pdfViewerUrl }}
          style={styles.webview}
          startInLoadingState={true}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Bottom Navigation Links */}
      {/* <View style={styles.bottomLinksContainer}>
        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="download-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>Download PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="share-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Ionicons name="bookmark-outline" size={20} color="#6a11cb" />
          <Text style={styles.linkText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
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
    marginTop: 40,
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
