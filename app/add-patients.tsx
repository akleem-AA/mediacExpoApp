"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { API_URL } from "@/constants/Api";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { getToken } from "@/services/auth";
import { decodeToken } from "@/utils/jwtHelper";

interface Medicine {
  name: string;
  frequency: number;
  times: Date[];
  days: string[]; // Add this line to track selected days
}

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  uhidNumber: string;
  age: string;
  gender: string;
  exerciseTime: string;
}

const AddPatient = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      uhidNumber: "",
      age: "",
      gender: "Male",
      exerciseTime: "00:00",
    },
  });

  const selectedGender = watch("gender", "Male");
  const [exerciseTime, setExerciseTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState<
    boolean | { medIndex: number; timeIndex: number }
  >(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Days of the week with two-letter abbreviations
  const daysOfWeek = [
    { code: "Mo", label: "Monday" },
    { code: "Tu", label: "Tuesday" },
    { code: "We", label: "Wednesday" },
    { code: "Th", label: "Thursday" },
    { code: "Fr", label: "Friday" },
    { code: "Sa", label: "Saturday" },
    { code: "Su", label: "Sunday" },
  ];

  // const availableMedicines = [
  //   "Paracetamol",
  //   "Ibuprofen",
  //   "Amoxicillin",
  //   "Cetrizine",
  //   "Aspirin",
  //   "Loratadine",
  //   "Omeprazole",
  //   "Metformin",
  // ];

  // Fetch medicines data
  const [availableMedicines, setAvailableMedicines] = useState<string[]>([]);

  const fetchAvailableMedicines = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        // Assuming response.data.medicineName is an array of strings
        setAvailableMedicines(response.data);
      }
    } catch (error) {
      console.error("Error fetching Medicines:", error);
      Alert.alert("Error", "Failed to load Medicines. Please try again.");
    }
  };

  useEffect(() => {
    fetchAvailableMedicines();
  }, []);

  const frequencies = [1, 2, 3, 4];

  const addMedicine = () => {
    if (medicines.length < 5) {
      setMedicines([
        ...medicines,
        {
          name: availableMedicines[0],
          frequency: 1,
          times: [new Date()],
          days: [], // Initialize with empty array for no days selected
        },
      ]);
    } else {
      Alert.alert("Limit Reached", "Maximum 5 medicines can be added");
    }
  };

  const removeMedicine = (index: number) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    if (field === "frequency") {
      // Preserve existing times if possible
      const currentTimes = updatedMedicines[index].times;
      updatedMedicines[index].times = Array.from(
        { length: value },
        (_, i) => currentTimes[i] || new Date()
      );
    }
    setMedicines(updatedMedicines);
  };

  const updateMedicineTime = (
    medIndex: number,
    timeIndex: number,
    selectedTime: Date | undefined
  ) => {
    if (!selectedTime) return;

    const updatedMedicines = [...medicines];
    updatedMedicines[medIndex].times[timeIndex] = selectedTime;
    setMedicines(updatedMedicines);
  };

  const toggleMedicineDay = (medIndex: number, day: string) => {
    const updatedMedicines = [...medicines];
    const currentDays = updatedMedicines[medIndex].days || [];

    if (currentDays.includes(day)) {
      // Remove day if already selected
      updatedMedicines[medIndex].days = currentDays.filter((d) => d !== day);
    } else {
      // Add day if not selected
      updatedMedicines[medIndex].days = [...currentDays, day];
    }

    setMedicines(updatedMedicines);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Format exercise time as HH:MM
      const formattedExerciseTime = exerciseTime.toTimeString().slice(0, 5);

      // Format medicine times
      const formattedMedicines = medicines.map((med) => ({
        ...med,
        times: med.times.map((time) => time.toTimeString().slice(0, 5)),
        days: med.days || [], // Include days in the submitted data
      }));

      const patientData = {
        ...data,
        age: Number.parseInt(data.age),
        exerciseTime: formattedExerciseTime,
        medicines: formattedMedicines,
        role: 0, // Assuming 0 is for patients
      };
      const token = await getToken();
      const response = await axios.post(`${API_URL}/patients`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Patient added successfully", [
        { text: "OK", onPress: () => router.push("/(tabs)/patients") },
      ]);
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to add patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (fieldName: keyof FormData) => {
    return errors[fieldName] ? (
      <Text style={styles.errorText}>{errors[fieldName]?.message}</Text>
    ) : null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Patient</Text>
          <View style={{ width: 24 }} />
        </View> */}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="user"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter patient's full name"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              </View>
            )}
          />
          {renderError("name")}

          <Text style={styles.label}>
            UHID Number <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="uhidNumber"
            rules={{
              required: "UHID Number is required",
              pattern: {
                value: /^[A-Z0-9]+$/,
                message:
                  "UHID should contain only uppercase letters and numbers",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="id-card"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter UHID number"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>
            )}
          />
          {renderError("uhidNumber")}

          <Text style={styles.label}>
            Age <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="age"
            rules={{
              required: "Age is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Age must be a number",
              },
              validate: (value) =>
                (Number.parseInt(value) > 0 && Number.parseInt(value) < 120) ||
                "Age must be between 1 and 120",
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="birthday-cake"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter age"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            )}
          />
          {renderError("age")}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {["Male", "Female"].map((gender) => (
              <TouchableOpacity
                key={gender}
                onPress={() => setValue("gender", gender)}
                style={styles.genderOption}
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedGender === gender && styles.radioCircleSelected,
                  ]}
                >
                  {selectedGender === gender && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.genderText}>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="envelope"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter email address"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
          />
          {renderError("email")}

          <Text style={styles.label}>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="phone"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            )}
          />
          {renderError("phoneNumber")}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <Text style={styles.label}>
            Password <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="lock"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#888"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  secureTextEntry
                />
              </View>
            )}
          />
          {renderError("password")}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Health Information</Text>

          <Text style={styles.label}>Exercise Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timePickerButton}
          >
            <FontAwesome5
              name="running"
              size={16}
              color="#bbb"
              style={styles.inputIcon}
            />
            <Text style={styles.timeText}>
              {exerciseTime.toTimeString().slice(0, 5)}
            </Text>
            <FontAwesome5
              name="clock"
              size={16}
              color="#E9446A"
              style={styles.timeIcon}
            />
          </TouchableOpacity>

          {showTimePicker === true && (
            <DateTimePicker
              value={exerciseTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setExerciseTime(selectedTime);
                }
              }}
            />
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <TouchableOpacity
              style={styles.addMedicineButton}
              onPress={addMedicine}
            >
              <Ionicons name="add-circle" size={20} color="#E9446A" />
              <Text style={styles.addMedicineText}>Add Medicine</Text>
            </TouchableOpacity>
          </View>

          {medicines.length === 0 ? (
            <View style={styles.emptyMedicines}>
              <FontAwesome5
                name="prescription-bottle-alt"
                size={32}
                color="#555"
              />
              <Text style={styles.emptyMedicinesText}>No medicines added</Text>
              <Text style={styles.emptyMedicinesSubtext}>
                Tap "Add Medicine" to add medications
              </Text>
            </View>
          ) : (
            medicines.map((medicine, medIndex) => (
              <View key={medIndex} style={styles.medicineCard}>
                <View style={styles.medicineHeader}>
                  <Text style={styles.medicineTitle}>
                    Medicine {medIndex + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeMedicine(medIndex)}
                    style={styles.removeMedicineButton}
                  >
                    <MaterialIcons name="delete" size={20} color="#E9446A" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.medicineLabel}>Medicine Name</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={medicine.name}
                    onValueChange={(value) =>
                      updateMedicine(medIndex, "name", value)
                    }
                    style={styles.picker}
                    dropdownIconColor="#fff"
                  >
                    {availableMedicines.map((med) => (
                      <Picker.Item
                        key={med.medicineName}
                        label={`${med.medicineName} (${med.medicineDose} ${med.medicineDoseUnit})`}
                        value={`${med.medicineName} (${med.medicineDose})`}
                        color="#000"
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.medicineLabel}>
                  Frequency (times per day)
                </Text>
                <View style={styles.frequencyContainer}>
                  {frequencies.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyOption,
                        medicine.frequency === freq && styles.frequencySelected,
                      ]}
                      onPress={() =>
                        updateMedicine(medIndex, "frequency", freq)
                      }
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          medicine.frequency === freq &&
                            styles.frequencyTextSelected,
                        ]}
                      >
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.medicineLabel}>Timing</Text>
                <View style={styles.timesContainer}>
                  {medicine.times.map((time, timeIndex) => (
                    <View key={timeIndex} style={styles.timeItem}>
                      <Text style={styles.timeLabel}>Dose {timeIndex + 1}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setShowTimePicker({ medIndex, timeIndex })
                        }
                        style={styles.timeButton}
                      >
                        <Text style={styles.timeButtonText}>
                          {time.toTimeString().slice(0, 5)}
                        </Text>
                        <FontAwesome5 name="clock" size={14} color="#E9446A" />
                      </TouchableOpacity>

                      {typeof showTimePicker === "object" &&
                        showTimePicker.medIndex === medIndex &&
                        showTimePicker.timeIndex === timeIndex && (
                          <DateTimePicker
                            value={time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedTime) => {
                              setShowTimePicker(false);
                              updateMedicineTime(
                                medIndex,
                                timeIndex,
                                selectedTime
                              );
                            }}
                          />
                        )}
                    </View>
                  ))}
                </View>

                <Text style={styles.medicineLabel}>Days of Week</Text>
                <View style={styles.daysWrapper}>
                  <View style={styles.daysContainer}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day.code}
                        style={[
                          styles.dayCircle,
                          medicine.days &&
                            medicine.days.includes(day.code) &&
                            styles.daySelected,
                        ]}
                        onPress={() => toggleMedicineDay(medIndex, day.code)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            medicine.days &&
                              medicine.days.includes(day.code) &&
                              styles.dayTextSelected,
                          ]}
                        >
                          {day.code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.daySelectionHelp}>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const weekdays = daysOfWeek
                          .slice(0, 5)
                          .map((d) => d.code);
                        updateMedicine(medIndex, "days", weekdays);
                      }}
                    >
                      <Text style={styles.daySelectionButtonText}>
                        Weekdays
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const weekend = daysOfWeek.slice(5).map((d) => d.code);
                        updateMedicine(medIndex, "days", weekend);
                      }}
                    >
                      <Text style={styles.daySelectionButtonText}>Weekend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const allDays = daysOfWeek.map((d) => d.code);
                        updateMedicine(medIndex, "days", allDays);
                      }}
                    >
                      <Text style={styles.daySelectionButtonText}>
                        All Days
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <FontAwesome5
                name="save"
                size={16}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitText}>Save Patient</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  contentContainer: {
    padding: 20,
    // paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E9446A",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
  },
  required: {
    color: "#E9446A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A4C",
    borderRadius: 8,
    marginBottom: 4,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    padding: 12,
  },
  errorText: {
    color: "#E9446A",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: "#E9446A",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E9446A",
  },
  genderText: {
    color: "#fff",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A4C",
    borderRadius: 8,
    padding: 12,
  },
  timeText: {
    flex: 1,
    color: "#fff",
  },
  timeIcon: {
    marginRight: 12,
  },
  addMedicineButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addMedicineText: {
    color: "#E9446A",
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyMedicines: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyMedicinesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyMedicinesSubtext: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 4,
  },
  medicineCard: {
    backgroundColor: "#3A3A4C",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  removeMedicineButton: {
    padding: 4,
  },
  medicineLabel: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#2A2A3C",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    height: 50,
  },
  frequencyContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  frequencyOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  frequencySelected: {
    backgroundColor: "#E9446A",
    borderColor: "#E9446A",
  },
  frequencyText: {
    color: "#fff",
    fontSize: 16,
  },
  frequencyTextSelected: {
    fontWeight: "bold",
  },
  timesContainer: {
    marginBottom: 16,
  },
  timeItem: {
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A3C",
    borderRadius: 8,
    padding: 12,
  },
  timeButtonText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#E9446A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  daysWrapper: {
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayCircle: {
    width: 35,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  daySelected: {
    backgroundColor: "#E9446A",
    borderColor: "#E9446A",
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  dayTextSelected: {
    fontWeight: "bold",
  },
  daySelectionHelp: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  daySelectionButton: {
    backgroundColor: "#2A2A3C",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#555",
  },
  daySelectionButtonText: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default AddPatient;
