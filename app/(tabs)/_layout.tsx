import { Redirect, Tabs, useSegments } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native"; // updated
import { useAuth } from "@/context/AuthProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme(); // system theme
  const segments = useSegments();
  const { user } = useAuth();

  if (user === undefined) return null;
  if (!user) return <Redirect href="/auth/login" />;

  const isMetricsRoute = segments.includes("metrics");

  // Theme-aware background colors
  const cardBackgroundColors = colorScheme === "dark"
    ? [
        "#1E1E1E", // Home
        "#292929", // Patients
        "#333333", // Medicines
        "#3A3A3A", // Diet
        "#444",     // Exercise
        "#4D4D4D",  // About
      ]
    : [
        "#E6F7FF", // Home
        "#FFF2E6", // Patients
        "#E6FFFA", // Medicines
        "#F2E6FF", // Diet
        "#E6FFE6", // Exercise
        "#FFE6E6", // About
      ];

  const TabIcon = ({
    iconName,
    color,
    bgColor,
  }: {
    iconName: string;
    color: string;
    bgColor: string;
  }) => (
    <View
      style={{
        backgroundColor: bgColor,
        padding: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconSymbol size={22} name={iconName} color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isMetricsRoute
          ? { display: "none" }
          : Platform.OS === "ios"
          ? { position: "absolute" }
          : undefined,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="house.fill"
              color={color}
              bgColor={cardBackgroundColors[0]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="patients/index"
        options={{
          title: "Patients",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="drop.fill"
              color={color}
              bgColor={cardBackgroundColors[1]}
            />
          ),
          href: user?.role === 0 ? null : "/(tabs)/patients",
        }}
      />
      <Tabs.Screen
        name="medicines/index"
        options={{
          title: "Medicines",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="location.fill"
              color={color}
              bgColor={cardBackgroundColors[2]}
            />
          ),
          href: user?.role === 0 ? null : "/(tabs)/medicines",
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="fork.knife"
              color={color}
              bgColor={cardBackgroundColors[3]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercise"
        options={{
          title: "Exercise",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="heart.fill"
              color={color}
              bgColor={cardBackgroundColors[4]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About CAD",
          tabBarIcon: ({ color }) => (
            <TabIcon
              iconName="info.circle.fill"
              color={color}
              bgColor={cardBackgroundColors[5]}
            />
          ),
        }}
      />
      <Tabs.Screen name="metrics/blood-pressure" options={{ href: null }} />
      <Tabs.Screen name="metrics/sugar-level" options={{ href: null }} />
      <Tabs.Screen name="metrics/height" options={{ href: null }} />
      <Tabs.Screen name="metrics/weight" options={{ href: null }} />
    </Tabs>
  );
}
