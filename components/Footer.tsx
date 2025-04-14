import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>
                Designed & Developed by ....
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#1E1E2C",
        paddingVertical: 10,
        alignItems: "center",
    },
    footerText: {
        color: "#fff",
        fontSize: 14,
    },
});
