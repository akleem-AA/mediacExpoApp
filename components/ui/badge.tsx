import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface BadgeProps {
  text: string;
}

export function Badge({ text }: BadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#007bff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
});
