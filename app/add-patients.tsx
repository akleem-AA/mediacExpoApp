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
import httpApiHandler from "@/utils/httpApiHandler";

interface Medicine {
  medicineId: string;
  frequency: number;
  medicineTimes: Date[];
  medicineDays: number[]; // Add this line to track selected days
}

interface FormData {
  role: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  uhidNumber: string;
  age: string;
  gender: string;
  exerciseTime: string;
  followUpDate: string; // Add this line
  medicines: Medicine[];
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
      role: 0,
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      uhidNumber: "",
      age: "",
      gender: "Male",
      exerciseTime: "00:00",
      followUpDate: "", // Add this line
      medicines: [],
    },
  });

  const selectedGender = watch("gender", "Male");

  const [exerciseTime, setExerciseTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState<
    boolean | { medIndex: number; timeIndex: number }
  >(false);

  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);

  // const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Days of the week with two-letter abbreviations and their corresponding form field names
  const daysOfWeek = [
    { code: 1, label: "Monday", field: "monday", shortName: "Mon" },
    { code: 2, label: "Tuesday", field: "tuesday", shortName: "Tue" },
    { code: 3, label: "Wednesday", field: "wednesday", shortName: "Wed" },
    { code: 4, label: "Thursday", field: "thursday", shortName: "Thus" },
    { code: 5, label: "Friday", field: "friday", shortName: "Fri" },
    { code: 6, label: "Saturday", field: "saturday", shortName: "Sat" },
    { code: 0, label: "Sunday", field: "sunday", shortName: "Sun" },
  ];

  // Fetch medicines data
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);

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
    if (watch("medicines").length < 10) {
      setValue("medicines", [
        ...watch("medicines"),
        {
          medicineId: availableMedicines[0].id,
          name: availableMedicines[0].name,
          frequency: 1,
          medicineTimes: [new Date()],
          medicineDays: [], // Initialize with empty array for no days selected
        },
      ] as Medicine[]);
    } else {
      Alert.alert("Limit Reached", "Maximum 10 medicines can be added");
    }
  };

  const removeMedicine = (index: number) => {
    const updatedMedicines = [...watch("medicines")];
    updatedMedicines.splice(index, 1);
    setValue("medicines", updatedMedicines);

    // Reset day values if no medicines are left
    // if (updatedMedicines.length === 0) {
    //   daysOfWeek.forEach((day) => {
    //     setValue(day.field as keyof FormData, 0);
    //   });
    // }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
    const updatedMedicines = [...watch("medicines")];

    if (field === "frequency") {
      // Preserve existing times if possible
      const currentTimes = updatedMedicines[index].medicineTimes;
      updatedMedicines[index].medicineTimes = Array.from(
        { length: value },
        (_, i) => currentTimes[i] || new Date()
      );
      updatedMedicines[index].frequency = value;
    }

    // Update form values when medicine name (id) is changed
    if (field === "medicineId") {
      updatedMedicines[index].medicineId = value;
    }

    if (field === "medicineDays") {
      updatedMedicines[index].medicineDays = value;
    }

    setValue("medicines", updatedMedicines);
  };

  const updateMedicineTime = (
    medIndex: number,
    timeIndex: number,
    selectedTime: Date | undefined
  ) => {
    if (!selectedTime) return;

    const updatedMedicines = [...watch("medicines")];
    updatedMedicines[medIndex].medicineTimes[timeIndex] = selectedTime;
    setValue("medicines", updatedMedicines);

    // Update the corresponding medicineTime field
    const timeString = selectedTime.toTimeString().slice(0, 5);
    const timeFieldName = `medicineTime${timeIndex + 1}` as keyof FormData;
    setValue(timeFieldName, timeString);
  };

  const toggleMedicineDay = (medIndex: number, day: number) => {
    const updatedMedicines = [...watch("medicines")];
    const currentDays = updatedMedicines[medIndex].medicineDays || [];

    // Find the day object that matches the code
    const dayObj = daysOfWeek.find((d) => d.code === day);
    if (!dayObj) return;

    if (currentDays.includes(day)) {
      // Remove day if already selected
      updatedMedicines[medIndex].medicineDays = currentDays.filter(
        (d) => d !== day
      );
    } else {
      // Add day if not selected
      updatedMedicines[medIndex].medicineDays = [...currentDays, day];
      // setValue(dayObj.field as keyof FormData, 1);
    }

    setValue("medicines", updatedMedicines);
  };

  // Helper function to update all day values based on selected days
  // const updateDayValues = (selectedDays: string[]) => {
  //   daysOfWeek.forEach((day) => {
  //     setValue(
  //       day.field as keyof FormData,
  //       selectedDays.includes(day.code) ? 1 : 0
  //     );
  //   });
  // };

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    try {
      setIsSubmitting(true);

      // Format exercise time as HH:MM
      const formattedExerciseTime = exerciseTime.toTimeString().slice(0, 5);

      // Format medicine times
      const formattedMedicines = watch("medicines").map((med) => ({
        ...med,
        medicineTimes: med.medicineTimes.map((time) =>
          time.toTimeString().slice(0, 5)
        ),
        medicineDays: med.medicineDays, // Include days in the submitted data
      }));

      const patientData: FormData = {
        ...data,
        age: Number.parseInt(data.age) as any,
        exerciseTime: formattedExerciseTime,
        followUpDate: followUpDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        medicines: formattedMedicines as any,
        role: 0, // Assuming 0 is for patients
      };
      console.log(JSON.stringify(patientData, null, 2));
      await httpApiHandler.post(`/patients`, patientData);

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

  // useEffect(() => {
  //   // Update form values when medicines change
  //   if (medicines.length > 0) {
  //     const firstMedicine = medicines[0];

  //     // Set medicineId if available
  //     if (typeof firstMedicine.name === "object" && firstMedicine.name.id) {
  //       setValue("medicineId", firstMedicine.name.id);
  //     }

  //     // Set medicine times
  //     firstMedicine.times.forEach((time, index) => {
  //       const timeString = time.toTimeString().slice(0, 5);
  //       const fieldName = `medicineTime${index + 1}` as keyof FormData;
  //       setValue(fieldName, timeString);
  //     });

  //     // Update day values based on selected days
  //     updateDayValues(firstMedicine.days);
  //   }
  // }, [medicines, setValue]);

  const medicines = watch("medicines");

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
            Email
            {/* <Text style={styles.required}>*</Text> */}
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
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

          <Text style={styles.label}>Follow-up Date</Text>
          <TouchableOpacity
            onPress={() => setShowFollowUpDatePicker(true)}
            style={styles.timePickerButton}
          >
            <FontAwesome5
              name="calendar-alt"
              size={16}
              color="#bbb"
              style={styles.inputIcon}
            />
            <Text style={styles.timeText}>{followUpDate.toDateString()}</Text>
            <FontAwesome5
              name="calendar"
              size={16}
              color="#E9446A"
              style={styles.timeIcon}
            />
          </TouchableOpacity>

          {showFollowUpDatePicker && (
            <DateTimePicker
              value={followUpDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowFollowUpDatePicker(false);
                if (selectedDate) {
                  setFollowUpDate(selectedDate);
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
            watch("medicines").map((medicine, medIndex) => (
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
                    selectedValue={medicine.medicineId}
                    onValueChange={(value) => {
                      updateMedicine(medIndex, "medicineId", value);
                    }}
                    style={styles.picker}
                    dropdownIconColor="#fff"
                  >
                    {availableMedicines.map((med) => (
                      <Picker.Item
                        key={med.medicineName}
                        label={`${med.medicineName} (${med.medicineDose} ${med.medicineDoseUnit})`}
                        value={med.id}
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
                  {medicine.medicineTimes.map((time, timeIndex) => (
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
                          medicine.medicineDays &&
                            medicine.medicineDays.includes(day.code) &&
                            styles.daySelected,
                        ]}
                        onPress={() => toggleMedicineDay(medIndex, day.code)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            medicine.medicineDays &&
                              medicine.medicineDays.includes(day.code) &&
                              styles.dayTextSelected,
                          ]}
                        >
                          {day.shortName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.daySelectionHelp}>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const weekdays = daysOfWeek
                          .filter((_, index) => index < 5)
                          .map((d) => d.code);
                        updateMedicine(medIndex, "medicineDays", weekdays);
                      }}
                    >
                      <Text style={styles.daySelectionButtonText}>
                        Weekdays
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const weekend = daysOfWeek
                          .filter((_, index) => index > 4)
                          .map((d) => d.code);
                        updateMedicine(medIndex, "medicineDays", weekend);
                        // Update form values for weekend
                      }}
                    >
                      <Text style={styles.daySelectionButtonText}>Weekend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.daySelectionButton}
                      onPress={() => {
                        const allDays = daysOfWeek.map((d) => d.code);
                        updateMedicine(medIndex, "medicineDays", allDays);
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
    width: 38,
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
