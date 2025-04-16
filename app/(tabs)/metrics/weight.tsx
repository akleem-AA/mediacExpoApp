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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function WeightInput() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg"); // kg or lbs
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!weight) {
      newErrors.weight = "Weight is required";
    } else if (
      unit === "kg" &&
      (parseFloat(weight) < 20 || parseFloat(weight) > 300)
    ) {
      newErrors.weight = "Value should be between 20-300 kg";
    } else if (
      unit === "lbs" &&
      (parseFloat(weight) < 44 || parseFloat(weight) > 660)
    ) {
      newErrors.weight = "Value should be between 44-660 lbs";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert to kg for storage if in lbs
      let weightInKg;
      if (unit === "kg") {
        weightInKg = parseFloat(weight);
      } else {
        weightInKg = parseFloat(weight) * 0.45359237;
      }

      // Here you would save the data to your backend or local storage
      console.log({
        weight: weightInKg,
        unit: "kg", // Always store in kg for consistency
        displayUnit: unit,
        notes,
        date,
      });

      // Show success message and navigate back
      alert("Weight measurement saved successfully!");
      router.back();
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
            <Ionicons name="arrow-back" size={24} color="#FFC107" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weight</Text>
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
              color="#FFC107"
            />
            <Text style={styles.infoText}>
              Regular weight tracking helps monitor your health progress. Try to
              measure at the same time of day for consistency.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#FFC107" />
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
                  unit === "kg" && styles.unitButtonActive,
                ]}
                onPress={() => setUnit("kg")}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === "kg" && styles.unitButtonTextActive,
                  ]}
                >
                  Kilograms (kg)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === "lbs" && styles.unitButtonActive,
                ]}
                onPress={() => setUnit("lbs")}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === "lbs" && styles.unitButtonTextActive,
                  ]}
                >
                  Pounds (lbs)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight ({unit})</Text>
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              value={weight}
              onChangeText={setWeight}
              placeholder={unit === "kg" ? "70.5" : "155"}
              keyboardType="numeric"
              maxLength={5}
            />
            {errors.weight && (
              <Text style={styles.errorText}>{errors.weight}</Text>
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
            style={[styles.submitButton, { backgroundColor: "#FFC107" }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Save Measurement</Text>
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
    backgroundColor: "#fff8e1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#FFC107",
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
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
  },
  unitButtonText: {
    color: "#333",
    fontSize: 14,
  },
  unitButtonTextActive: {
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
