import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import Footer from "../../components/Footer";
import { useAuth } from "@/context/AuthProvider";

export default function LoginScreen() {
  const { onLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email/phone and password");
      return;
    }

    try {
      setIsLoading(true);
      await onLogin(email, password);
      setIsLoading(false);
      setMessage(`Login successful!`);
    } catch (error: any) {
      //console.log(error);
      setIsLoading(false);
      setMessage(error?.error || "Login failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image
              source={{ uri: "https://mediac.in/images/mediac.png" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Mediac</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your health journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email or Phone Number</Text>
              <TextInput
                placeholder="Enter your email or phone number"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#8A8A9A"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#8A8A9A"
              />
            </View>

            {/* <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}

            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Health Section */}
          <View style={styles.healthSection}>
            <Text style={styles.healthSectionTitle}>Health Tips</Text>
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: "https://mediac.in/images/health1.jpg" }}
                  style={styles.image}
                />
                <Text style={styles.imageCaption}>Exercise</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: "https://mediac.in/images/health2.jpg" }}
                  style={styles.image}
                />
                <Text style={styles.imageCaption}>Nutrition</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: "https://setfacility.in/mediac/health3.jpg" }}
                  style={styles.image}
                />
                <Text style={styles.imageCaption}>Wellness</Text>
              </View>
            </View>
            <Text style={styles.tagline}>
              A healthy lifestyle is the best way to prevent heart disease!
              🚴‍♂️🥗🚭
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121220",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 90,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8A8A9A",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: "#1E1E2C",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2A2A3C",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#E9446A",
    fontSize: 14,
    fontWeight: "600",
  },
  messageText: {
    color: "#E9446A",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  loginButton: {
    height: 50,
    backgroundColor: "#E9446A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#8A8A9A",
    fontSize: 14,
  },
  registerLink: {
    color: "#E9446A",
    fontSize: 14,
    fontWeight: "600",
  },
  healthSection: {
    marginTop: 0,
  },
  healthSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageWrapper: {
    alignItems: "center",
    width: "30%",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageCaption: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  tagline: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
});
