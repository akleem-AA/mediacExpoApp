import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDecodedToken } from "@/hooks/useDecodedToken";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useDecodedToken();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="patients/index"
        options={{
          title: "Patients",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="group.fill" color={color} />
          ),
          href: user?.role
            ? user?.role === 0
              ? null
              : "/(tabs)/patients"
            : null,
        }}
      />

      <Tabs.Screen
        name="medicines/index"
        options={{
          title: "Medcines",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="medication.fill" color={color} />
          ),
          href: user?.role
            ? user?.role === 0
              ? null
              : "/(tabs)/medicines"
            : null,
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          title: "Diet",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="fastfood.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercise"
        options={{
          title: "Exercise",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="moniter-heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="info-outline.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
