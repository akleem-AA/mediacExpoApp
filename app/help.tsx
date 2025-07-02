"use client";

import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";

export default function HelpScreen() {
  const handleEmailSupport = () => {
    Linking.openURL("mailto: dahiyan100@gmail.com");
  };

  const handlePhoneSupport = () => {
    Linking.openURL("tel:+91");
  };

  const handleWebsite = () => {
    Linking.openURL("https://mediac.in");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      {/* <LinearGradient
        colors={["#2A2D3E", "#1F2132"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Help & Support</ThemedText>
        <View style={styles.placeholder} />
      </LinearGradient> */}

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Support</ThemedText>

          <ContactItem
            icon="mail-outline"
            title="Email Support"
            description="dahiyan100@gmail.com"
            onPress={handleEmailSupport}
          />

          <ContactItem
            icon="call-outline"
            title="Phone Support"
            description="+91 "
            onPress={handlePhoneSupport}
          />

          <ContactItem
            icon="globe-outline"
            title="Help Center"
            description="mediac.in"
            onPress={handleWebsite}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={styles.faqHeader}>
        <ThemedText style={styles.faqQuestion}>{question}</ThemedText>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9E9E9E"
        />
      </View>
      {expanded && <ThemedText style={styles.faqAnswer}>{answer}</ThemedText>}
    </TouchableOpacity>
  );
};

const ContactItem = ({ icon, title, description, onPress }) => (
  <TouchableOpacity style={styles.contactItem} onPress={onPress}>
    <View style={styles.contactIcon}>
      <Ionicons name={icon} size={24} color="#4A55A2" />
    </View>
    <View style={styles.contactText}>
      <ThemedText style={styles.contactTitle}>{title}</ThemedText>
      <ThemedText style={styles.contactDescription}>{description}</ThemedText>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    padding: 16,
    paddingBottom: 8,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#9E9E9E",
    marginTop: 8,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 85, 162, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: "#9E9E9E",
  },
});
