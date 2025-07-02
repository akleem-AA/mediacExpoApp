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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import Slider from "@react-native-community/slider";

export default function SymptomsPage() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomIntensity, setSymptomIntensity] = useState(5);
  const [sliderMoving, setSliderMoving] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [recordedSymptoms, setRecordedSymptoms] = useState([]);
  const [isAddingSymptom, setIsAddingSymptom] = useState(false);
  const [language, setLanguage] = useState("en"); // en or hi

  // Use a ref to track the actual slider value during sliding
  const sliderValueRef = useRef(5);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

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

  // Translations
  const translations = {
    en: {
      Symptoms: "Symptoms",
      "Add Symptom": "Add Symptom",
      "Select a Symptom": "Select a Symptom",
      Intensity: "Intensity",
      Mild: "Mild",
      Severe: "Severe",
      "Additional Notes": "Additional Notes",
      "Describe your symptoms in detail...":
        "Describe your symptoms in detail...",
      Submit: "Submit",
      Change: "Change",
      Back: "Back",
      "No symptoms recorded": "No symptoms recorded",
      "Recorded Symptoms": "Recorded Symptoms",
      Today: "Today",
      Yesterday: "Yesterday",
      Intensity: "Intensity",
      Notes: "Notes",
    },
    hi: {
      Symptoms: "लक्षण",
      "Add Symptom": "लक्षण जोड़ें",
      "Select a Symptom": "एक लक्षण चुनें",
      Intensity: "तीव्रता",
      Mild: "हल्का",
      Severe: "गंभीर",
      "Additional Notes": "अतिरिक्त नोट्स",
      "Describe your symptoms in detail...":
        "अपने लक्षणों का विस्तार से वर्णन करें...",
      Submit: "जमा करें",
      Change: "बदलें",
      Back: "वापस",
      "No symptoms recorded": "कोई लक्षण दर्ज नहीं किया गया",
      "Recorded Symptoms": "दर्ज किए गए लक्षण",
      Today: "आज",
      Yesterday: "कल",
      Intensity: "तीव्रता",
      Notes: "नोट्स",
    },
  };

  // Translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

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
      const now = new Date();
      const newSymptom = {
        id: Date.now().toString(),
        name: selectedSymptom,
        intensity: symptomIntensity,
        notes: symptomNotes,
        date: now,
        formattedDate: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isToday: true,
      };

      // Add to recorded symptoms
      setRecordedSymptoms([newSymptom, ...recordedSymptoms]);

      // Reset form
      setSelectedSymptom(null);
      setSymptomIntensity(5);
      sliderValueRef.current = 5;
      setSymptomNotes("");
      setIsAddingSymptom(false);

      // Here you would typically send this data to your backend
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const symptomDate = new Date(date);
    const symptomDay = new Date(
      symptomDate.getFullYear(),
      symptomDate.getMonth(),
      symptomDate.getDate()
    );

    if (symptomDay.getTime() === today.getTime()) {
      return t("Today");
    } else if (symptomDay.getTime() === yesterday.getTime()) {
      return t("Yesterday");
    } else {
      return symptomDate.toLocaleDateString();
    }
  };

  // Load sample data for demo
  useEffect(() => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleSymptoms = [
      {
        id: "1",
        name: "Headache",
        intensity: 7,
        notes: "Frontal headache, worse in the morning",
        date: now,
        formattedDate: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isToday: true,
      },
      {
        id: "2",
        name: "Cough",
        intensity: 4,
        notes: "Dry cough, mostly at night",
        date: yesterday,
        formattedDate: yesterday.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isToday: false,
      },
    ];

    setRecordedSymptoms(sampleSymptoms);
  }, []);

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("Symptoms")}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.languageToggle}>
              {language === "en" ? "हिंदी" : "EN"}
            </Text>
          </TouchableOpacity>
        </View>

        {isAddingSymptom ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TouchableOpacity
              style={styles.backToListButton}
              onPress={() => {
                setIsAddingSymptom(false);
                setSelectedSymptom(null);
              }}
            >
              {/* <Ionicons name="arrow-back" size={18} color="#7A39A3" /> */}
              {/* <Text style={styles.backToListText}>{t("Back")}</Text> */}
            </TouchableOpacity>

            {selectedSymptom ? (
              <View style={styles.symptomForm}>
                <View style={styles.selectedSymptomHeader}>
                  <Text style={styles.selectedSymptomTitle}>
                    {selectedSymptom}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedSymptom(null)}>
                    <Text style={styles.changeSymptomText}>{t("Change")}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.intensityLabel}>
                  {t("Intensity")}: {symptomIntensity}/10
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
                  <Text style={styles.sliderLabel}>{t("Mild")}</Text>
                  <Text style={styles.sliderLabel}>{t("Severe")}</Text>
                </View>

                <Text style={styles.notesLabel}>{t("Additional Notes")}:</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline={true}
                  numberOfLines={4}
                  placeholder={t("Describe your symptoms in detail...")}
                  value={symptomNotes}
                  onChangeText={setSymptomNotes}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSymptomSubmit}
                >
                  <Text style={styles.submitButtonText}>{t("Submit")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.symptomSelectionContainer}>
                <Text style={styles.sectionTitle}>{t("Select a Symptom")}</Text>
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
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={styles.symptomsListContainer}>
            <View style={styles.symptomsListHeader}>
              <Text style={styles.sectionTitle}>{t("Recorded Symptoms")}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsAddingSymptom(true)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {recordedSymptoms.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="medical-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  {t("No symptoms recorded")}
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => setIsAddingSymptom(true)}
                >
                  <Text style={styles.emptyStateButtonText}>
                    {t("Add Symptom")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={recordedSymptoms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.symptomHistoryItem}>
                    <View style={styles.symptomHistoryHeader}>
                      <Text style={styles.symptomHistoryName}>{item.name}</Text>
                      <View style={styles.symptomHistoryDateContainer}>
                        <Text style={styles.symptomHistoryDate}>
                          {formatDate(item.date)}
                        </Text>
                        <Text style={styles.symptomHistoryTime}>
                          {item.formattedDate}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.symptomHistoryDetails}>
                      <View style={styles.intensityIndicatorContainer}>
                        <Text style={styles.intensityLabel}>
                          {t("Intensity")}:{" "}
                        </Text>
                        <View style={styles.intensityBar}>
                          <View
                            style={[
                              styles.intensityFill,
                              { width: `${(item.intensity / 10) * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.intensityValue}>
                          {item.intensity}/10
                        </Text>
                      </View>

                      {item.notes ? (
                        <View style={styles.notesContainer}>
                          <Text style={styles.notesLabel}>{t("Notes")}:</Text>
                          <Text style={styles.notesText}>{item.notes}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.symptomsList}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  languageToggle: {
    fontSize: 16,
    color: "#7A39A3",
    fontWeight: "500",
  },
  backToListButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backToListText: {
    fontSize: 16,
    color: "#7A39A3",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  symptomSelectionContainer: {
    flex: 1,
  },
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
  symptomsListContainer: {
    flex: 1,
  },
  symptomsListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#7A39A3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  symptomsList: {
    paddingBottom: 20,
  },
  symptomHistoryItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  symptomHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symptomHistoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  symptomHistoryDateContainer: {
    alignItems: "flex-end",
  },
  symptomHistoryDate: {
    fontSize: 14,
    color: "#666",
  },
  symptomHistoryTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  symptomHistoryDetails: {
    marginTop: 8,
  },
  intensityIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  intensityBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  intensityFill: {
    height: "100%",
    backgroundColor: "#7A39A3",
    borderRadius: 4,
  },
  intensityValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#7A39A3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
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
