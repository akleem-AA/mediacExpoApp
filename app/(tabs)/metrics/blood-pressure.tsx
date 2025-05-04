"use client";

import { useState } from "react";
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

export default function BloodPressureInput() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onDateChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!systolic) {
      newErrors.systolic = "Systolic pressure is required";
    } else if (
      Number.parseInt(systolic) < 70 ||
      Number.parseInt(systolic) > 220
    ) {
      newErrors.systolic = "Value should be between 70-220 mmHg";
    }

    if (!diastolic) {
      newErrors.diastolic = "Diastolic pressure is required";
    } else if (
      Number.parseInt(diastolic) < 40 ||
      Number.parseInt(diastolic) > 120
    ) {
      newErrors.diastolic = "Value should be between 40-120 mmHg";
    }

    if (
      pulse &&
      (Number.parseInt(pulse) < 40 || Number.parseInt(pulse) > 200)
    ) {
      newErrors.pulse = "Value should be between 40-200 bpm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserId = async () => {
    // This is a placeholder - implement according to your auth system
    // For example, you might get it from AsyncStorage or a context
    // return await AsyncStorage.getItem('userId');
    return "current-user-id"; // Replace with actual implementation
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const token = await getToken();

        // Prepare the data payload
        const bloodPressureData = {
          userId: await getUserId(), // You'll need to implement this function
          entryDatetime: date.toISOString(),
          systolic: Number.parseInt(systolic),
          diastolic: Number.parseInt(diastolic),
          pulse: pulse ? Number.parseInt(pulse) : undefined,
          notes: notes || undefined,
        };

        // Make the API call
        const response = await axios.post(
          `${API_URL}/blood-pressures`,
          bloodPressureData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle success
        if (response.status === 201 || response.status === 200) {
          alert("Blood pressure reading saved successfully!");
          router.back();
        } else {
          alert("Error saving blood pressure reading. Please try again.");
        }
      } catch (error) {
        console.error("Error saving blood pressure:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          alert(
            `Failed to save: ${error.response?.data?.message || error.message}`
          );
        } else {
          alert("Failed to save blood pressure reading. Please try again.");
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
            <Ionicons name="arrow-back" size={24} color="#4A55A2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Pressure</Text>
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
              color="#4A55A2"
            />
            <Text style={styles.infoText}>
              Normal blood pressure is less than 120/80 mmHg. Record your
              readings regularly to track your health.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date & Time</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#4A55A2" />
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

          <View style={styles.bpContainer}>
            <View style={styles.bpInputGroup}>
              <Text style={styles.inputLabel}>Systolic (mmHg)</Text>
              <TextInput
                style={[styles.input, errors.systolic && styles.inputError]}
                value={systolic}
                onChangeText={setSystolic}
                placeholder="120"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.systolic && (
                <Text style={styles.errorText}>{errors.systolic}</Text>
              )}
            </View>

            <View style={styles.bpSeparator}>
              <Text style={styles.bpSeparatorText}>/</Text>
            </View>

            <View style={styles.bpInputGroup}>
              <Text style={styles.inputLabel}>Diastolic (mmHg)</Text>
              <TextInput
                style={[styles.input, errors.diastolic && styles.inputError]}
                value={diastolic}
                onChangeText={setDiastolic}
                placeholder="80"
                keyboardType="numeric"
                maxLength={3}
              />
              {errors.diastolic && (
                <Text style={styles.errorText}>{errors.diastolic}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pulse (bpm)</Text>
            <TextInput
              style={[styles.input, errors.pulse && styles.inputError]}
              value={pulse}
              onChangeText={setPulse}
              placeholder="72"
              keyboardType="numeric"
              maxLength={3}
            />
            {errors.pulse && (
              <Text style={styles.errorText}>{errors.pulse}</Text>
            )}
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
            style={styles.submitButton}
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
    backgroundColor: "#e8f0fe",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#4A55A2",
  },
  inputGroup: {
    marginBottom: 20,
  },
  bpContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  bpInputGroup: {
    flex: 1,
  },
  bpSeparator: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  bpSeparatorText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#4A55A2",
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
