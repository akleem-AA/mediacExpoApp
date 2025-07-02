import React from "react";
import { Text, StyleSheet } from "react-native";

interface LabelProps {
  children: React.ReactNode;
}

export function Label({ children }: LabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
});
