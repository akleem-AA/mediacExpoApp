"use client";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import packageJson from "../../package.json";
import { useDecodedToken } from "@/hooks/useDecodedToken";
import { useState, useRef } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";

export default function Dashboard() {
  const user = useDecodedToken();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [symptomsModalVisible, setSymptomsModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomIntensity, setSymptomIntensity] = useState(5);
  const [sliderMoving, setSliderMoving] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState("");

  // Use a ref to track the actual slider value during sliding
  const sliderValueRef = useRef(5);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  const appName =
    packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1);

  // Get current date for the greeting
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Good morning";
  if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon";
  } else if (hours >= 18) {
    greeting = "Good evening";
  }

  // Format date as "Monday, 2 April"
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Generate next 6 days (today + 5 more)
  const generateNextDays = () => {
    const days = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(date);
      const dayNumber = date.getDate();

      // Random reminder count for demo purposes
      const reminderCount = Math.floor(Math.random() * 3);

      days.push({
        date,
        dayName,
        dayNumber,
        reminderCount,
        isToday: i === 0,
      });
    }
    return days;
  };

  const nextDays = generateNextDays();

  // Card background colors
  const cardBackgroundColors = [
    "#E6F7FF", // Light blue
    "#FFF2E6", // Light orange
    "#E6FFFA", // Light teal
    "#F2E6FF", // Light purple
    "#E6FFE6", // Light green
    "#FFE6E6", // Light red
    "#FFF9E6", // Light yellow
    "#F0E6FF", // Light lavender
  ];

  // List of common symptoms
  const symptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Sore Throat",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Shortness of Breath",
    "Chest Pain",
    "Muscle Ache",
    "Joint Pain",
    "Rash",
  ];

  // Handle slider value change during sliding
  const handleSliderValueChange = (value) => {
    // Store the raw value in the ref without updating state
    sliderValueRef.current = value;

    // Only update the UI if we're actively sliding
    if (sliderMoving) {
      setSymptomIntensity(Math.round(value));
    }
  };

  // Handle slider sliding start
  const handleSlidingStart = () => {
    setSliderMoving(true);
  };

  // Handle slider sliding complete
  const handleSlidingComplete = (value) => {
    // Update the state with the final rounded value
    const roundedValue = Math.round(value);
    setSymptomIntensity(roundedValue);
    sliderValueRef.current = roundedValue;
    setSliderMoving(false);
  };

  // Handle symptom submission
  const handleSymptomSubmit = () => {
    if (selectedSymptom) {
      console.log("Symptom:", selectedSymptom);
      console.log("Intensity:", symptomIntensity);
      console.log("Notes:", symptomNotes);

      // Reset form and close modal
      setSelectedSymptom(null);
      setSymptomIntensity(5);
      sliderValueRef.current = 5;
      setSymptomNotes("");
      setSymptomsModalVisible(false);

      // Here you would typically send this data to your backend
    }
  };

  // Handle file picking
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const newFile = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
          description: fileDescription,
        };

        setUploadedFiles([...uploadedFiles, newFile]);
        setFileDescription("");
      }
    } catch (err) {
      console.log("Document picking error:", err);
    }
  };

  // Handle image picking from camera or gallery
  const pickImage = async (useCamera = false) => {
    try {
      let result;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFile = {
          uri: result.assets[0].uri,
          name: `image_${Date.now()}.jpg`,
          type: "image/jpeg",
          description: fileDescription,
        };

        setUploadedFiles([...uploadedFiles, newFile]);
        setFileDescription("");
      }
    } catch (err) {
      console.log("Image picking error:", err);
    }
  };

  // Handle file upload submission
  const handleFileUpload = () => {
    console.log("Files to upload:", uploadedFiles);
    // Here you would typically send these files to your backend
    setUploadModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f8" />
      {/* Background decorative elements */}
      <View style={styles.purpleAccent1} />
      <View style={styles.purpleAccent2} />
      <View style={styles.purpleAccent3} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting} {user?.user || "User"}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons name="person-circle" size={40} color="#4A55A2" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ADMIN VIEW - For healthcare providers */}
          {user?.role === 1 && (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryContainer}>
                <SummaryCard
                  icon="people"
                  label="Total Patients"
                  count={10}
                  trend="up"
                  color="#4A55A2"
                />
                <SummaryCard
                  icon="calendar"
                  label="Appointments"
                  count={0}
                  trend="neutral"
                  color="#FF5A5F"
                />
              </View>

              {/* Section Title */}
              <Text style={styles.sectionTitle}>Quick Access</Text>

              {/* Dashboard Grid */}
              <View style={styles.dashboardGrid}>
                <DashboardCard
                  icon="people-outline"
                  label="Patients"
                  count={10}
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[0]}
                  onPress={() => console.log("Patients pressed")}
                />
                <DashboardCard
                  icon="barbell-outline"
                  label="Exercises"
                  count={20}
                  color="#00A86B"
                  backgroundColor={cardBackgroundColors[2]}
                  onPress={() => console.log("Exercises pressed")}
                />
                <DashboardCard
                  icon="medkit-outline"
                  label="Medicines"
                  count={2}
                  color="#FF5A5F"
                  backgroundColor={cardBackgroundColors[5]}
                  onPress={() => console.log("Medicines pressed")}
                />
                <DashboardCard
                  icon="calendar-outline"
                  label="Appointments"
                  count={0}
                  color="#FFC107"
                  backgroundColor={cardBackgroundColors[6]}
                  onPress={() => console.log("Appointments pressed")}
                />
              </View>
            </>
          )}

          {/* PATIENT VIEW - For regular users */}
          {user?.role === 0 && (
            <>
              {/* Date selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateSelector}
              >
                {nextDays.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateItem,
                      selectedDateIndex === index && styles.selectedDateItem,
                    ]}
                    onPress={() => setSelectedDateIndex(index)}
                  >
                    <Text
                      style={[
                        styles.dayName,
                        selectedDateIndex === index && styles.selectedDayText,
                      ]}
                    >
                      {day.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        selectedDateIndex === index && styles.selectedDayText,
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                    {day.reminderCount > 0 && (
                      <View style={styles.reminderBadge}>
                        <Text style={styles.reminderCount}>
                          {day.reminderCount}
                        </Text>
                      </View>
                    )}
                    {day.isToday && (
                      <Text style={styles.todayLabel}>Today</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Health Metrics Grid */}
              <View style={styles.dashboardGrid}>
                <HealthMetricCard
                  icon="fitness-outline"
                  label="Blood Pressure"
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[0]}
                  onPress={() => router.push("/metrics/blood-pressure")}
                />
                <HealthMetricCard
                  icon="water-outline"
                  label="Blood Sugar"
                  color="#FF5A5F"
                  backgroundColor={cardBackgroundColors[5]}
                  onPress={() => router.push("/metrics/sugar-level")}
                />
                <HealthMetricCard
                  icon="resize-outline"
                  label="Height"
                  color="#00A86B"
                  backgroundColor={cardBackgroundColors[4]}
                  onPress={() => router.push("/metrics/height")}
                />
                <HealthMetricCard
                  icon="scale-outline"
                  label="Weight"
                  color="#FFC107"
                  backgroundColor={cardBackgroundColors[6]}
                  onPress={() => router.push("/metrics/weight")}
                />
              </View>

              {/* NEW SECTION: Symptoms Tracker */}
              {/* <Text style={styles.sectionTitle}>Health Tracking</Text> */}
              <View style={styles.dashboardGrid}>
                <HealthActionCard
                  icon="medical-outline"
                  label="Add Symptoms"
                  color="#7A39A3"
                  backgroundColor={cardBackgroundColors[3]}
                  onPress={() => setSymptomsModalVisible(true)}
                />
                <HealthActionCard
                  icon="cloud-upload-outline"
                  label="Upload Files"
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[7]}
                  onPress={() => setUploadModalVisible(true)}
                />
              </View>

              {/* Latest Readings Section */}
              <Text style={styles.sectionTitle}>Latest Readings</Text>
              <View style={styles.latestReadingsContainer}>
                <LatestReading
                  icon="fitness-outline"
                  title="Blood Pressure"
                  value="120/80"
                  unit="mmHg"
                  time="Today, 8:30 AM"
                  color="#4A55A2"
                />
                <LatestReading
                  icon="water-outline"
                  title="Sugar Level"
                  value="95"
                  unit="mg/dL"
                  time="Yesterday, 7:15 PM"
                  color="#FF5A5F"
                />
                <LatestReading
                  icon="scale-outline"
                  title="Weight"
                  value="68"
                  unit="kg"
                  time="3 days ago"
                  color="#FFC107"
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {/* Symptoms Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={symptomsModalVisible}
        onRequestClose={() => setSymptomsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Symptoms</Text>
              <TouchableOpacity onPress={() => setSymptomsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedSymptom ? (
              <View style={styles.symptomForm}>
                <View style={styles.selectedSymptomHeader}>
                  <Text style={styles.selectedSymptomTitle}>
                    {selectedSymptom}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedSymptom(null)}>
                    <Text style={styles.changeSymptomText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.intensityLabel}>
                  Intensity: {symptomIntensity}/10
                </Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={symptomIntensity}
                    onValueChange={handleSliderValueChange}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    minimumTrackTintColor="#7A39A3"
                    maximumTrackTintColor="#D0D0D0"
                    thumbTintColor="#7A39A3"
                  />
                  <View style={styles.sliderMarksContainer}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={styles.sliderMarkTouchable}
                        onPress={() => {
                          setSymptomIntensity(value);
                          sliderValueRef.current = value;
                        }}
                      >
                        <View
                          style={[
                            styles.sliderMark,
                            symptomIntensity >= value && {
                              backgroundColor: "#7A39A3",
                            },
                            symptomIntensity === value &&
                              styles.sliderMarkActive,
                          ]}
                        />
                        <Text
                          style={[
                            styles.sliderMarkText,
                            symptomIntensity === value && {
                              color: "#7A39A3",
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Mild</Text>
                  <Text style={styles.sliderLabel}>Severe</Text>
                </View>

                <Text style={styles.notesLabel}>Additional Notes:</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Describe your symptoms in detail..."
                  value={symptomNotes}
                  onChangeText={setSymptomNotes}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSymptomSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={symptoms}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.symptomItem}
                    onPress={() => setSelectedSymptom(item)}
                  >
                    <Text style={styles.symptomItemText}>{item}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#7A39A3"
                    />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={uploadModalVisible}
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Files</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.uploadInstructions}>
              Upload medical documents, test results, or images related to your
              health
            </Text>

            <TextInput
              style={styles.descriptionInput}
              placeholder="Add a description for your file..."
              value={fileDescription}
              onChangeText={setFileDescription}
            />

            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#4A55A2" }]}
                onPress={pickDocument}
              >
                <Ionicons name="document-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#7A39A3" }]}
                onPress={() => pickImage(false)}
              >
                <Ionicons name="image-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: "#00A86B" }]}
                onPress={() => pickImage(true)}
              >
                <Ionicons name="camera-outline" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>

            {uploadedFiles.length > 0 && (
              <>
                <Text style={styles.filesTitle}>Selected Files:</Text>
                <FlatList
                  data={uploadedFiles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.fileItem}>
                      <View style={styles.fileIconContainer}>
                        <Ionicons
                          name={
                            item.type.includes("image")
                              ? "image"
                              : "document-text"
                          }
                          size={24}
                          color="#4A55A2"
                        />
                      </View>
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.description ? (
                          <Text
                            style={styles.fileDescription}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setUploadedFiles(
                            uploadedFiles.filter(
                              (file) => file.uri !== item.uri
                            )
                          );
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#FF5A5F"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  style={styles.filesList}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleFileUpload}
                >
                  <Text style={styles.submitButtonText}>Upload Files</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Summary Card Component
const SummaryCard = ({ icon, label, count, trend, color }) => {
  let trendIcon = null;
  if (trend === "up") {
    trendIcon = <Ionicons name="arrow-up" size={16} color="#00A86B" />;
  } else if (trend === "down") {
    trendIcon = <Ionicons name="arrow-down" size={16} color="#FF5A5F" />;
  }

  return (
    <View style={styles.summaryCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <View style={styles.summaryCountRow}>
          <Text style={styles.summaryCount}>{count}</Text>
          {trendIcon}
        </View>
      </View>
    </View>
  );
};

// Dashboard Card Component
const DashboardCard = ({
  icon,
  label,
  count,
  color,
  backgroundColor,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.card,
      { backgroundColor: backgroundColor || "rgba(255, 255, 255, 0.9)" },
    ]}
    onPress={onPress}
  >
    <View style={[styles.cardIconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.cardCount}>{count}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

// Health Metric Card Component for patient view
const HealthMetricCard = ({ icon, label, color, backgroundColor, onPress }) => (
  <TouchableOpacity
    style={[
      styles.healthCard,
      { backgroundColor: backgroundColor || "rgba(255, 255, 255, 0.9)" },
    ]}
    onPress={onPress}
  >
    <View
      style={[
        styles.healthCardIconContainer,
        { backgroundColor: `${color}20` },
      ]}
    >
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <Text style={styles.healthCardLabel}>{label}</Text>
    <View style={styles.addButtonContainer}>
      <Ionicons name="add-circle" size={24} color={color} />
    </View>
  </TouchableOpacity>
);

// Health Action Card Component for new sections
const HealthActionCard = ({ icon, label, color, backgroundColor, onPress }) => (
  <TouchableOpacity
    style={[
      styles.healthCard,
      { backgroundColor: backgroundColor || "rgba(255, 255, 255, 0.9)" },
    ]}
    onPress={onPress}
  >
    <View
      style={[
        styles.healthCardIconContainer,
        { backgroundColor: `${color}20` },
      ]}
    >
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <Text style={styles.healthCardLabel}>{label}</Text>
    <View style={styles.addButtonContainer}>
      <Ionicons name="chevron-forward-circle" size={24} color={color} />
    </View>
  </TouchableOpacity>
);

// Latest Reading Component for patient view
const LatestReading = ({ icon, title, value, unit, time, color }) => (
  <View style={styles.latestReadingItem}>
    <View
      style={[styles.readingIconContainer, { backgroundColor: `${color}15` }]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.readingContent}>
      <Text style={styles.readingTitle}>{title}</Text>
      <View style={styles.readingValueContainer}>
        <Text style={styles.readingValue}>{value}</Text>
        <Text style={styles.readingUnit}>{unit}</Text>
      </View>
      <Text style={styles.readingTime}>{time}</Text>
    </View>
  </View>
);

// Activity Item Component - Keeping this in case it's used elsewhere
const ActivityItem = ({ icon, title, description, time }) => (
  <View style={styles.activityItem}>
    <View style={styles.activityIconContainer}>
      <Ionicons name={icon} size={20} color="#4A55A2" />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f8", // Light blue-gray base color
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "transparent", // Make transparent to show the background
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  // Date selector styles
  dateSelector: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  selectedDateItem: {
    backgroundColor: "#7A39A3",
  },
  dayName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDayText: {
    color: "#fff",
  },
  reminderBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF5A5F",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderCount: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  todayLabel: {
    position: "absolute",
    bottom: 5,
    fontSize: 9,
    color: "#7A39A3",
    fontWeight: "bold",
  },
  titleContainer: {
    marginTop: 0,
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 4,
  },
  summaryCountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    //marginBottom: 24,
    //marginTop: 15,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  // Health Metric Card styles for patient view
  healthCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 16,
    position: "relative",
  },
  healthCardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  healthCardLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  // Latest readings styles
  latestReadingsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 24,
  },
  latestReadingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  readingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  readingContent: {
    flex: 1,
  },
  readingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  readingValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },
  readingValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  readingUnit: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  readingTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  // Modal styles for symptoms and file upload
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  // Symptoms modal styles
  symptomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  symptomItemText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  symptomForm: {
    paddingVertical: 10,
  },
  selectedSymptomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  selectedSymptomTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  changeSymptomText: {
    fontSize: 14,
    color: "#7A39A3",
    fontWeight: "500",
  },
  intensityLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  sliderContainer: {
    width: "100%",
    height: 60,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderMarksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: -5,
  },
  sliderMarkTouchable: {
    alignItems: "center",
    width: 30,
  },
  sliderMark: {
    width: 4,
    height: 12,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
  },
  sliderMarkActive: {
    height: 16,
    width: 6,
    borderRadius: 3,
  },
  sliderMarkText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  notesLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#7A39A3",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // File upload modal styles
  uploadInstructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  uploadButton: {
    width: "30%",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  filesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  filesList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  fileDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  // Keeping activity styles in case they're used elsewhere
  activityContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  activityDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
  purpleAccent1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(122, 57, 163, 0.1)",
    top: -20,
    right: -30,
  },
  purpleAccent2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(122, 57, 163, 0.08)",
    top: 100,
    right: 40,
  },
  purpleAccent3: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(122, 57, 163, 0.05)",
    bottom: 100,
    left: -50,
  },
});
