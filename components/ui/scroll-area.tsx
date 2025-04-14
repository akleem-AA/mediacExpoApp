import React from "react";
import { ScrollView } from "react-native";

interface ScrollAreaProps {
  children: React.ReactNode;
}

export function ScrollArea({ children }: ScrollAreaProps) {
  return <ScrollView>{children}</ScrollView>;
}
