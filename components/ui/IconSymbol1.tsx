// components/ui/IconSymbol.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export const IconSymbol = ({
  name,
  size = 24,
  color = "black",
}: {
  name: string;
  size?: number;
  color?: string;
}) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};
