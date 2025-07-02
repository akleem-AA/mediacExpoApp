import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Linking } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Designed & Developed by{" "}
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL("https:codekumbh.com")}
        >
          CodeKumbh
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linkText: {
    fontSize: 16,
    color: "#007BFF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1E1E2C",
    paddingVertical: 10,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
});
