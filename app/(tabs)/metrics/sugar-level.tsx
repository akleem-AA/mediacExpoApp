"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { API_URL } from "@/constants/Api";
import { getToken } from "@/services/auth";
import { useDecodedToken } from "@/hooks/useDecodedToken";

export default function SugarLevelInput() {
  const user = useDecodedToken();
  const [glucoseLevel, setGlucoseLevel] = useState("");
  const [measurementType, setMeasurementType] = useState("fasting"); // fasting, before_meal, after_meal
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!glucoseLevel) {
      newErrors.glucoseLevel = "Blood sugar level is required";
    } else if (parseInt(glucoseLevel) < 20 || parseInt(glucoseLevel) > 600) {
      newErrors.glucoseLevel = "Value should be between 20-600 mg/dL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserId = async () => {
    return user?.userId;
  };

  const getMeasurementTypeValue = () => {
    switch (measurementType) {
      case "fasting":
        return 1;
      case "before_meal":
        return 2;
      case "after_meal":
        return 3;
      default:
        return 1;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = await getToken();

        // Prepare the data payload
        const bloodSugarData = {
          userId: await getUserId(),
          entryDatetime: date.toISOString(),
          sugarLevel: Number.parseInt(glucoseLevel),
          measurementType: getMeasurementTypeValue(),
          notes: notes || undefined,
        };
        console.log(bloodSugarData);

        // Make the API call
        const response = await axios.post(
          `${API_URL}/blood_sugars`,
          bloodSugarData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle success
        if (response.status === 201 || response.status === 200) {
          alert("Blood sugar reading saved successfully!");
          router.back();
        } else {
          alert("Error saving blood sugar reading. Please try again.");
        }
      } catch (error) {
        console.error("Error saving blood sugar:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          alert(
            `Failed to save: ${error.response?.data?.message || error.message}`
          );
        } else {
          alert("Failed to save blood sugar reading. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FF5A5F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Sugar</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#FF5A5F"
            />
            <Text style={styles.infoText}>
              Normal fasting blood sugar is 70-99 mg/dL. After meals, levels
              below 140 mg/dL are typically normal.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date & Time</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#FF5A5F" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Blood Sugar Level (mg/dL)</Text>
            <TextInput
              style={[styles.input, errors.glucoseLevel && styles.inputError]}
              value={glucoseLevel}
              onChangeText={setGlucoseLevel}
              placeholder="95"
              keyboardType="numeric"
              maxLength={3}
            />
            {errors.glucoseLevel && (
              <Text style={styles.errorText}>{errors.glucoseLevel}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Measurement Type</Text>
            <View style={styles.measurementTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.measurementTypeButton,
                  measurementType === "fasting" &&
                    styles.measurementTypeButtonActive,
                ]}
                onPress={() => setMeasurementType("fasting")}
              >
                <Text
                  style={[
                    styles.measurementTypeText,
                    measurementType === "fasting" &&
                      styles.measurementTypeTextActive,
                  ]}
                >
                  Fasting
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.measurementTypeButton,
                  measurementType === "before_meal" &&
                    styles.measurementTypeButtonActive,
                ]}
                onPress={() => setMeasurementType("before_meal")}
              >
                <Text
                  style={[
                    styles.measurementTypeText,
                    measurementType === "before_meal" &&
                      styles.measurementTypeTextActive,
                  ]}
                >
                  Before Meal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.measurementTypeButton,
                  measurementType === "after_meal" &&
                    styles.measurementTypeButtonActive,
                ]}
                onPress={() => setMeasurementType("after_meal")}
              >
                <Text
                  style={[
                    styles.measurementTypeText,
                    measurementType === "after_meal" &&
                      styles.measurementTypeTextActive,
                  ]}
                >
                  2hrs After Meal
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes here..."
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: "#FF5A5F" }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Reading</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    backgroundColor: "white",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#FF5A5F",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF5A5F",
  },
  errorText: {
    color: "#FF5A5F",
    fontSize: 12,
    marginTop: 4,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  measurementTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  measurementTypeButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  measurementTypeButtonActive: {
    backgroundColor: "#FF5A5F",
    borderColor: "#FF5A5F",
  },
  measurementTypeText: {
    color: "#333",
    fontSize: 14,
  },
  measurementTypeTextActive: {
    color: "white",
    fontWeight: "500",
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
