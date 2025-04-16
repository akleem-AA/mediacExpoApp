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

export default function BloodPressureInput() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!systolic) {
      newErrors.systolic = "Systolic pressure is required";
    } else if (parseInt(systolic) < 70 || parseInt(systolic) > 220) {
      newErrors.systolic = "Value should be between 70-220 mmHg";
    }

    if (!diastolic) {
      newErrors.diastolic = "Diastolic pressure is required";
    } else if (parseInt(diastolic) < 40 || parseInt(diastolic) > 120) {
      newErrors.diastolic = "Value should be between 40-120 mmHg";
    }

    if (pulse && (parseInt(pulse) < 40 || parseInt(pulse) > 200)) {
      newErrors.pulse = "Value should be between 40-200 bpm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would save the data to your backend or local storage
      console.log({
        systolic,
        diastolic,
        pulse,
        notes,
        date,
      });

      // Show success message and navigate back
      alert("Blood pressure reading saved successfully!");
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Reading</Text>
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
