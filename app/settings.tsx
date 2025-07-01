"use client";

import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Globe } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { user, onLogout } = useAuth();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [isHindi, setIsHindi] = useState(false);
  const navigation = useNavigation();

  // English text content
  const englishText = {
    Notification: `Notifications`,
    NotificationDetail: `Manage your alerts and reminders`,
    Help: `Help & Support`,
    HelpDetail: `FAQs and contact information`,
    About: `About App`,
    AboutDetail: `App version and legal information`,
    Setting: `Setting`,
    Logout: `Logout`,
  };

  // Hindi text content
  const hindiText = {
    Notification: "सूचना",
    Help: "मदद और समर्थन",
    About: "ऐप के बारे में",
    Setting: "सेटिंग",
    Logout: "लॉग आउट",
    NotificationDetail: "अपने अलर्ट और अनुस्मारक प्रबंधित करें",
    HelpDetail: "अक्सर पूछे जाने वाले प्रश्न और संपर्क जानकारी",
    AboutDetail: "ऐप संस्करण और कानूनी जानकारी",
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Animation for header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const toggleLanguage = () => {
    setIsHindi((prev) => !prev);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleLanguage}
          style={{
            marginRight: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ paddingRight: 10 }}>{isHindi ? "En" : "हिंदी"}</Text>
          <Globe size={24} color="#000" />
        </TouchableOpacity>
      ),
      title: isHindi ? "सेटिंग" : "Setting",
      headerStyle: {
        backgroundColor: "#ffffff",
      },
      headerTitleStyle: {
        color: "#000000",
      },
    });
  }, [navigation, isHindi]);

  const text = isHindi ? hindiText : englishText;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Header */}
      {/* <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </Animated.View> */}

      <Animated.ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Profile Section with Gradient */}
        <LinearGradient
          colors={["#2A2D3E", "#1F2132"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarOuterRing}>
                <View style={styles.avatarInnerRing}>
                  <Ionicons name="person" size={40} color="#E0E0E0" />
                </View>
              </View>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>
                {user?.user || "User Name"}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email || "user@example.com"}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {/* <MenuItem
            icon="settings-outline"
            title="Account Settings"
            description="Privacy, security, and language"
            onPress={() => console.log("Settings pressed")}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            description="Control your data and permissions"
            onPress={() => console.log("Privacy pressed")}
          /> */}
          <MenuItem
            icon="notifications-outline"
            title={(text.Notification)}
            description={(text.NotificationDetail)}
            onPress={() => router.push("/notification")}
          />
          <MenuItem
            icon="help-circle-outline"
            title={(text.Help)}
            description={(text.HelpDetail)}
            // description="FAQs and contact information"
            onPress={() => router.push("/help")}
          />
          <MenuItem
            icon="information-circle-outline"
            title={(text.About)}
            description={(text.AboutDetail)}
            // onPress={() => router.push("/about")}
            onPress={() => router.push("/aboutUs")}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={["#FF5A5F", "#FF414B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <ThemedText style={styles.logoutText}>{text.Logout}</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// Enhanced Menu Item Component
const MenuItem = ({ icon, title, description, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconContainer}>
      <LinearGradient
        colors={["#4A55A2", "#3A4382"]}
        style={styles.iconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={22} color="#fff" />
      </LinearGradient>
    </View>
    <View style={styles.menuTextContainer}>
      <ThemedText style={styles.menuTitle}>{title}</ThemedText>
      <ThemedText style={styles.menuDescription}>{description}</ThemedText>
    </View>
    <View style={styles.menuArrow}>
      <Ionicons name="chevron-forward" size={20} color="#6D6D6D" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  animatedHeader: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#121212",
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  profileGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    marginBottom: 10,
  },
  profileSection: {
    alignItems: "center",
    padding: 10,
    //paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatarOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInnerRing: {
    width: 70,
    height: 70,
    borderRadius: 55,
    backgroundColor: "#4A55A2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  userEmail: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  menuSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  menuIconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: "#9E9E9E",
  },
  menuArrow: {
    padding: 4,
  },
  logoutButton: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
