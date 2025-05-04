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

export default function HeightInput() {
  const user = useDecodedToken();
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [unit, setUnit] = useState("cm"); // cm or ft
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
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (unit === "cm") {
      if (!heightCm) {
        newErrors.heightCm = "Height is required";
      } else if (parseInt(heightCm) < 50 || parseInt(heightCm) > 250) {
        newErrors.heightCm = "Value should be between 50-250 cm";
      }
    } else {
      if (!heightFt) {
        newErrors.heightFt = "Feet value is required";
      } else if (parseInt(heightFt) < 1 || parseInt(heightFt) > 8) {
        newErrors.heightFt = "Value should be between 1-8 feet";
      }

      if (heightIn && (parseInt(heightIn) < 0 || parseInt(heightIn) > 11)) {
        newErrors.heightIn = "Value should be between 0-11 inches";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserId = async () => {
    return user?.userId;
  };

  const getUnitValue = () => {
    return unit === "cm" ? 1 : 2;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = await getToken();

        // Convert to cm for storage if in feet/inches
        let heightInCm;
        if (unit === "cm") {
          heightInCm = parseInt(heightCm);
        } else {
          const feet = parseInt(heightFt) || 0;
          const inches = parseInt(heightIn) || 0;
          heightInCm = Math.round(feet * 30.48 + inches * 2.54);
        }

        // Prepare the data payload
        const heightData = {
          userId: await getUserId(),
          entryDatetime: date.toISOString(),
          height: heightInCm,
          unit: getUnitValue(),
          notes: notes || undefined,
        };
        console.log(heightData);

        // Make the API call
        const response = await axios.post(
          `${API_URL}/patient_heights`,
          heightData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle success
        if (response.status === 201 || response.status === 200) {
          alert("Height measurement saved successfully!");
          router.back();
        } else {
          alert("Error saving height measurement. Please try again.");
        }
      } catch (error) {
        console.error("Error saving height:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          alert(
            `Failed to save: ${error.response?.data?.message || error.message}`
          );
        } else {
          alert("Failed to save height measurement. Please try again.");
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
            <Ionicons name="arrow-back" size={24} color="#00A86B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Height</Text>
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
              color="#00A86B"
            />
            <Text style={styles.infoText}>
              Tracking your height over time is important for monitoring growth
              in children and adolescents.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#00A86B" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Unit</Text>
            <View style={styles.unitSelectorContainer}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === "cm" && styles.unitButtonActive,
                ]}
                onPress={() => setUnit("cm")}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === "cm" && styles.unitButtonTextActive,
                  ]}
                >
                  Centimeters (cm)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === "ft" && styles.unitButtonActive,
                ]}
                onPress={() => setUnit("ft")}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === "ft" && styles.unitButtonTextActive,
                  ]}
                >
                  Feet & Inches
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {unit === "cm" ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={[styles.input, errors.heightCm && styles.inputError]}
                value={heightCm}
                onChangeText={setHeightCm}
                placeholder="175"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.heightCm && (
                <Text style={styles.errorText}>{errors.heightCm}</Text>
              )}
            </View>
          ) : (
            <View style={styles.feetInchContainer}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Feet</Text>
                <TextInput
                  style={[styles.input, errors.heightFt && styles.inputError]}
                  value={heightFt}
                  onChangeText={setHeightFt}
                  placeholder="5"
                  keyboardType="numeric"
                  maxLength={1}
                />
                {errors.heightFt && (
                  <Text style={styles.errorText}>{errors.heightFt}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Inches</Text>
                <TextInput
                  style={[styles.input, errors.heightIn && styles.inputError]}
                  value={heightIn}
                  onChangeText={setHeightIn}
                  placeholder="10"
                  keyboardType="numeric"
                  maxLength={2}
                />
                {errors.heightIn && (
                  <Text style={styles.errorText}>{errors.heightIn}</Text>
                )}
              </View>
            </View>
          )}

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
            style={[styles.submitButton, { backgroundColor: "#00A86B" }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Measurement</Text>
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
    backgroundColor: "#e6f7ef",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#00A86B",
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
  unitSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: "#00A86B",
    borderColor: "#00A86B",
  },
  unitButtonText: {
    color: "#333",
    fontSize: 14,
  },
  unitButtonTextActive: {
    color: "white",
    fontWeight: "500",
  },
  feetInchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
