"use client";

import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

export default function NotificationScreen() {
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [smsNotifications, setSmsNotifications] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <LinearGradient
        colors={["#2A2D3E", "#1F2132"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // style={styles.header}
      >
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
        <View style={styles.placeholder} /> */}
      </LinearGradient>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Push Notifications
          </ThemedText>

          <NotificationItem
            title="Push Notifications"
            description="Receive notifications on your device"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />

          <NotificationItem
            title="Sound"
            description="Play sound for notifications"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Communication</ThemedText>

          <NotificationItem
            title="Email Notifications"
            description="Receive updates via email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />

          <NotificationItem
            title="SMS Notifications"
            description="Receive updates via SMS"
            value={smsNotifications}
            onValueChange={setSmsNotifications}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const NotificationItem = ({ title, description, value, onValueChange }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationText}>
      <ThemedText style={styles.itemTitle}>{title}</ThemedText>
      <ThemedText style={styles.itemDescription}>{description}</ThemedText>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#2A2A2A", true: "#4A55A2" }}
      thumbColor={value ? "#FFFFFF" : "#9E9E9E"}
    />
  </View>
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
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  notificationText: {
    flex: 1,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#9E9E9E",
  },
});
