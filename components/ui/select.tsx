import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SelectProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function Select({ options, selected, onSelect }: SelectProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(option)}
          style={styles.option}
        >
          <Text
            style={[styles.text, selected === option && styles.selectedText]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  option: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontWeight: "bold",
    color: "blue",
  },
});
