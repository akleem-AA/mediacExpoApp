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
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import packageJson from "../../package.json";
import { useDecodedToken } from "@/hooks/useDecodedToken";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/services/auth";
import { API_URL } from "@/constants/Api";
import { ChevronDown, ChevronUp, Heart } from "lucide-react-native";

const { width } = Dimensions.get("window");
export default function Dashboard() {
  const user = useDecodedToken();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [language, setLanguage] = useState("en"); // en or hi
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [bloodSugar, setBloodSugar] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [readingsLoading, setReadingsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  const appName =
    packageJson.name.charAt(0).toUpperCase() + packageJson.name.slice(1);

  // Translations
  const translations = {
    en: {
      "Good morning": "Good morning",
      "Good afternoon": "Good afternoon",
      "Good evening": "Good evening",
      Today: "Today",
      "Quick Access": "Quick Access",
      Patients: "Patients",
      Exercises: "Exercises",
      Medicines: "Medicines",
      Appointments: "Appointments",
      "Blood Pressure": "Blood Pressure",
      "Blood Sugar": "Blood Sugar",
      Height: "Height",
      Weight: "Weight",
      "Add Symptoms": "Symptoms   ",
      "Upload Files": "Upload Files   ",
      "Latest Readings": "Latest Readings",
      "Total Patients": "Total Patients",
      "Prescribed Medicines": "Prescribed Medicines",
      Morning: "Morning",
      Afternoon: "Afternoon",
      Evening: "Evening",
      Daily: "Daily",
      "Twice Daily": "Twice Daily",
      "Every Other Day": "Every Other Day",
      "Mon,Wed,Fri": "Mon,Wed,Fri",
      "All Days": "All Days",
      "Multiple Times": "Multiple Times",
      "Once Daily": "Once Daily",
      "No medicines prescribed": "No medicines prescribed",
      aboutTitle: "ABOUT CORONARY ARTERY DISEASE",
      aboutContent:
        "Coronary Artery Disease (CAD) is a heart condition where the blood vessels that supply oxygen to the heart (coronary arteries) become narrow or blocked because of a buildup of fat, cholesterol, and other substances, forming plaques. When the arteries become too narrow, the heart doesn't get enough oxygen-rich blood, leading to chest pain (angina), shortness of breath, or even a heart attack.",
      bannerTagline:
        "A healthy lifestyle is the best way to prevent heart disease! 🚴‍♂️🥗🚭",
    },
    hi: {
      "Good morning": "सुप्रभात",
      "Good afternoon": "नमस्कार",
      "Good evening": "शुभ संध्या",
      Today: "आज",
      "Quick Access": "त्वरित पहुंच",
      Patients: "मरीज़",
      Exercises: "व्यायाम",
      Medicines: "दवाइयां",
      Appointments: "अपॉइंटमेंट",
      "Blood Pressure": "रक्तचाप",
      "Blood Sugar": "रक्त शर्करा",
      Height: "ऊंचाई",
      Weight: "वज़न",
      "Add Symptoms": "लक्षण जोड़ें",
      "Upload Files": "फ़ाइलें अपलोड करें",
      "Latest Readings": "नवीनतम रीडिंग",
      "Total Patients": "कुल मरीज़",
      "Prescribed Medicines": "निर्धारित दवाएं",
      Morning: "सुबह",
      Afternoon: "दोपहर",
      Evening: "शाम",
      Daily: "रोज़ाना",
      "Twice Daily": "दिन में दो बार",
      "Every Other Day": "एक दिन छोड़कर",
      "Mon,Wed,Fri": "सोम,बुध,शुक्र",
      "All Days": "सभी दिन",
      "Multiple Times": "कई बार",
      "Once Daily": "दिन में एक बार",
      "No medicines prescribed": "कोई दवा निर्धारित नहीं है",
      aboutTitle: "कोरोनरी आर्टरी डिजीज के बारे में",
      aboutContent:
        "कोरोनरी आर्टरी डिजीज (CAD) एक हृदय स्थिति है जहां हृदय को ऑक्सीजन की आपूर्ति करने वाली रक्त वाहिकाएं (कोरोनरी धमनियां) वसा, कोलेस्ट्रॉल और अन्य पदार्थों के जमा होने के कारण संकीर्ण या अवरुद्ध हो जाती हैं, जिससे प्लाक बनता है। जब धमनियां बहुत संकीर्ण हो जाती हैं, तो हृदय को पर्याप्त ऑक्सीजन युक्त रक्त नहीं मिलता, जिससे छाती में दर्द (एंजाइना), सांस की तकलीफ, या यहां तक कि दिल का दौरा भी पड़ सकता है।",
      bannerTagline:
        "हृदय रोग को रोकने का सबसे अच्छा तरीका है स्वस्थ जीवनशैली! 🚴‍♂️🥗🚭",
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

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/patients/${user?.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const medicineData = response.data.filter((p: any) => p); // Filter out falsy values
        setMedicines(medicineData);
      }
    } catch (error) {
      //console.error("Error fetching Medicines:", error);
      //Alert.alert("Error", "Failed to load Medicines. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBloodPressure = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/patients/bloodpressure/${user?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setBloodPressure(response.data);
      }
    } catch (error) {
      console.error("Error fetching blood pressure:", error);
    }
  };

  const fetchBloodSugar = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/patients/bloodsugar/${user?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setBloodSugar(response.data);
      }
    } catch (error) {
      console.error("Error fetching blood sugar:", error);
    }
  };

  const fetchHeight = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/patients/height/${user?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setHeight(response.data);
      }
    } catch (error) {
      console.error("Error fetching height:", error);
    }
  };

  const fetchWeight = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${API_URL}/patients/weight/${user?.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setWeight(response.data);
      }
    } catch (error) {
      console.error("Error fetching weight:", error);
    }
  };

  const fetchAllReadings = async () => {
    setReadingsLoading(true);
    await Promise.all([
      fetchBloodPressure(),
      fetchBloodSugar(),
      fetchHeight(),
      fetchWeight(),
    ]);
    setReadingsLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMedicines();
    fetchAllReadings();
  };

  useEffect(() => {
    if (user?.userId) {
      fetchMedicines();
      fetchAllReadings();
    }
  }, [user]);

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

  const formatDays = (days) => {
    if (!days || days.length === 0) return t("All Days");
    if (days.length === 7) return t("All Days");

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((day) => dayNames[day]).join(", ");
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
              {t(greeting)} {user?.user || "User"}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguage}
            >
              <Text style={styles.languageText}>
                {language === "en" ? "हिंदी" : "EN"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons name="person-circle" size={40} color="#4A55A2" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* ADMIN VIEW - For healthcare providers */}
          {user?.role === 1 && (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryContainer}>
                <SummaryCard
                  icon="people"
                  label={t("Total Patients")}
                  count={10}
                  trend="up"
                  color="#4A55A2"
                />
                <SummaryCard
                  icon="calendar"
                  label={t("Appointments")}
                  count={0}
                  trend="neutral"
                  color="#FF5A5F"
                />
              </View>

              {/* Section Title */}
              <Text style={styles.sectionTitle}>{t("Quick Access")}</Text>

              {/* Dashboard Grid */}
              <View style={styles.dashboardGrid}>
                <DashboardCard
                  icon="people-outline"
                  label={t("Patients")}
                  count={10}
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[0]}
                  onPress={() => console.log("Patients pressed")}
                />
                <DashboardCard
                  icon="barbell-outline"
                  label={t("Exercises")}
                  count={20}
                  color="#00A86B"
                  backgroundColor={cardBackgroundColors[2]}
                  onPress={() => console.log("Exercises pressed")}
                />
                <DashboardCard
                  icon="medkit-outline"
                  label={t("Medicines")}
                  count={2}
                  color="#FF5A5F"
                  backgroundColor={cardBackgroundColors[5]}
                  onPress={() => console.log("Medicines pressed")}
                />
                <DashboardCard
                  icon="calendar-outline"
                  label={t("Appointments")}
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
              {/* <ScrollView
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
                      <Text style={styles.todayLabel}>{t("Today")}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView> */}

              {/* Banner */}
              <View style={styles.banner}>
                <Image
                  source={{ uri: "https://mediac.in/images/mediac.png" }}
                  style={styles.bannerLogo}
                />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTagline}>{t("bannerTagline")}</Text>
                </View>
              </View>

              {/* Image Gallery */}
              <View style={styles.imageGallery}>
                <Image
                  source={{ uri: "https://mediac.in/images/health1.jpg" }}
                  style={styles.galleryImage}
                />
                <Image
                  source={{ uri: "https://mediac.in/images/health2.jpg" }}
                  style={styles.galleryImage}
                />
                <Image
                  source={{ uri: "https://mediac.in/images/health3.jpg" }}
                  style={styles.galleryImage}
                />
              </View>
              {/* Accordion Sections */}
              <View style={styles.accordionContainer}>
                {/* About CAD Section */}
                <TouchableOpacity
                  style={[
                    styles.accordionHeader,
                    expandedSection && styles.accordionHeaderActive,
                  ]}
                  onPress={() => setExpandedSection(!expandedSection)}
                >
                  <View style={styles.accordionTitleContainer}>
                    <Heart
                      color={expandedSection ? "#fff" : "#6366f1"}
                      size={20}
                    />
                    <Text
                      style={[
                        styles.accordionTitle,
                        expandedSection && styles.accordionTitleActive,
                      ]}
                    >
                      {t("aboutTitle")}
                    </Text>
                  </View>
                  {expandedSection ? (
                    <ChevronUp color="#fff" size={20} />
                  ) : (
                    <ChevronDown color="#6366f1" size={20} />
                  )}
                </TouchableOpacity>

                {expandedSection && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.description}>{t("aboutContent")}</Text>
                  </View>
                )}
              </View>

              {/* Health Metrics Grid */}
              <View style={styles.dashboardGrid}>
                <HealthMetricCard
                  icon="fitness-outline"
                  label={t("Blood Pressure")}
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[0]}
                  onPress={() => router.push("/metrics/blood-pressure")}
                />
                <HealthMetricCard
                  icon="water-outline"
                  label={t("Blood Sugar")}
                  color="#FF5A5F"
                  backgroundColor={cardBackgroundColors[5]}
                  onPress={() => router.push("/metrics/sugar-level")}
                />
                <HealthMetricCard
                  icon="resize-outline"
                  label={t("Height")}
                  color="#00A86B"
                  backgroundColor={cardBackgroundColors[4]}
                  onPress={() => router.push("/metrics/height")}
                />
              </View>

              {/* Health Tracking Section */}
              <View style={styles.dashboardGrid}>
                <HealthMetricCard
                  icon="scale-outline"
                  label={t("Weight")}
                  color="#FFC107"
                  backgroundColor={cardBackgroundColors[6]}
                  onPress={() => router.push("/metrics/weight")}
                />
                <HealthMetricCard
                  icon="medical-outline"
                  label={t("Add Symptoms")}
                  color="#7A39A3"
                  backgroundColor={cardBackgroundColors[3]}
                  onPress={() => {}} // Disabled functionality
                  isUpcoming={true}
                />
                <HealthMetricCard
                  icon="cloud-upload-outline"
                  label={t("Upload Files")}
                  color="#4A55A2"
                  backgroundColor={cardBackgroundColors[7]}
                  onPress={() => {}} // Disabled functionality
                  isUpcoming={true}
                />
              </View>

              {/* Prescribed Medicines Section */}
              <Text style={styles.sectionTitle}>
                {t("Prescribed Medicines")}
              </Text>
              <View style={styles.medicinesContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#4A55A2" />
                    <Text style={styles.loadingText}>Loading medicines...</Text>
                  </View>
                ) : medicines.length > 0 ? (
                  medicines.map((medicine, index) => (
                    <MedicineItem
                      key={medicine.id}
                      name={medicine.medicineName}
                      frequency={
                        medicine.medicineTime.length > 1
                          ? t("Multiple Times")
                          : t("Once Daily")
                      }
                      doseTime={medicine.medicineTime.join(", ")}
                      daysOfWeek={formatDays(medicine.medicineDays)}
                      color={index % 2 === 0 ? "#4A55A2" : "#FF5A5F"}
                      isLast={index === medicines.length - 1}
                    />
                  ))
                ) : (
                  <Text style={styles.noMedicinesText}>
                    {t("No medicines prescribed")}
                  </Text>
                )}
              </View>

              {/* Latest Readings Section */}
              <Text style={styles.sectionTitle}>{t("Latest Readings")}</Text>
              <View style={styles.latestReadingsContainer}>
                {readingsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#4A55A2" />
                    <Text style={styles.loadingText}>Loading readings...</Text>
                  </View>
                ) : (
                  <>
                    <LatestReading
                      icon="fitness-outline"
                      title={t("Blood Pressure")}
                      value={
                        bloodPressure
                          ? `${bloodPressure.systolic}/${bloodPressure.diastolic}`
                          : "--/--"
                      }
                      unit="mmHg"
                      time={
                        bloodPressure
                          ? new Date(bloodPressure.createdAt).toLocaleString()
                          : "--"
                      }
                      color="#4A55A2"
                    />
                    <LatestReading
                      icon="water-outline"
                      title={t("Blood Sugar")}
                      value={bloodSugar ? bloodSugar.sugarLevel : "--"}
                      unit={
                        bloodSugar
                          ? `mg/dL${
                              bloodSugar.measurementType === 1
                                ? " (Fasting)"
                                : bloodSugar.measurementType === 2
                                ? " (Before meal)"
                                : bloodSugar.measurementType === 3
                                ? " (2hrs after meal)"
                                : ""
                            }`
                          : "mg/dL"
                      }
                      time={
                        bloodSugar
                          ? new Date(bloodSugar.createdAt).toLocaleString()
                          : "--"
                      }
                      color="#FF5A5F"
                    />
                    <LatestReading
                      icon="resize-outline"
                      title={t("Height")}
                      value={height ? height.height : "--"}
                      unit="cm"
                      time={
                        height
                          ? new Date(height.createdAt).toLocaleString()
                          : "--"
                      }
                      color="#00A86B"
                    />
                    <LatestReading
                      icon="scale-outline"
                      title={t("Weight")}
                      value={weight ? weight.weight : "--"}
                      unit="kg"
                      time={
                        weight
                          ? new Date(weight.createdAt).toLocaleString()
                          : "--"
                      }
                      color="#FFC107"
                    />
                  </>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Medicine Item Component
const MedicineItem = ({
  name,
  frequency,
  doseTime,
  daysOfWeek,
  color,
  isLast,
}) => (
  <View style={[styles.medicineItem, !isLast && styles.medicineItemBorder]}>
    <View
      style={[styles.medicineIconContainer, { backgroundColor: `${color}15` }]}
    >
      <Ionicons name="medical" size={20} color={color} />
    </View>
    <View style={styles.medicineContent}>
      <Text style={styles.medicineName}>{name}</Text>
      <View style={styles.medicineDetailsContainer}>
        <View style={styles.medicineDetailItem}>
          <Ionicons
            name="repeat"
            size={14}
            color="#666"
            style={styles.medicineDetailIcon}
          />
          <Text style={styles.medicineDetailText}>{frequency}</Text>
        </View>
        <View style={styles.medicineDetailItem}>
          <Ionicons
            name="time-outline"
            size={14}
            color="#666"
            style={styles.medicineDetailIcon}
          />
          <Text style={styles.medicineDetailText}>{doseTime}</Text>
        </View>
        <View style={styles.medicineDetailItem}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#666"
            style={styles.medicineDetailIcon}
          />
          <Text style={styles.medicineDetailText}>{daysOfWeek}</Text>
        </View>
      </View>
    </View>
  </View>
);

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
const HealthMetricCard = ({
  icon,
  label,
  color,
  backgroundColor,
  onPress,
  isUpcoming = false,
}) => (
  <TouchableOpacity
    style={[
      styles.healthCard,
      { backgroundColor: backgroundColor || "rgba(255, 255, 255, 0.9)" },
      isUpcoming && styles.upcomingCard,
    ]}
    onPress={onPress}
    disabled={isUpcoming}
  >
    <View
      style={[
        styles.healthCardIconContainer,
        { backgroundColor: `${color}20`, borderColor: `${color}40` },
        isUpcoming && styles.upcomingIcon,
      ]}
    >
      <Ionicons name={icon} size={24} color={isUpcoming ? "#999" : color} />
    </View>
    <Text style={[styles.healthCardLabel, isUpcoming && styles.upcomingText]}>
      {label}
    </Text>
    {isUpcoming ? (
      <View style={styles.upcomingBadge}>
        <Text style={styles.upcomingBadgeText}>Upcoming</Text>
      </View>
    ) : (
      <View style={styles.addButtonContainer}>
        <Ionicons name="add-circle" size={20} color={color} />
      </View>
    )}
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    marginRight: 12,
    padding: 4,
  },
  languageText: {
    fontSize: 16,
    color: "#7A39A3",
    fontWeight: "500",
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
    paddingVertical: 8,
    marginBottom: 16,
  },
  dateItem: {
    width: 50,
    height: 70,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  selectedDateItem: {
    backgroundColor: "#7A39A3",
    borderColor: "#6A2993",
    shadowColor: "#7A39A3",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayName: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDayText: {
    color: "#fff",
  },
  reminderBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "#FF5A5F",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  reminderCount: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  todayLabel: {
    position: "absolute",
    bottom: 4,
    fontSize: 8,
    color: "#7A39A3",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 4,
    borderRadius: 4,
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
    marginBottom: 24,
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
    width: "31%",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  healthCardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  healthCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 6,
    right: 6,
  },
  // Prescribed Medicines styles
  medicinesContainer: {
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
  medicineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  medicineItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  medicineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicineContent: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  medicineDetailsContainer: {
    marginTop: 2,
  },
  medicineDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  medicineDetailIcon: {
    marginRight: 6,
  },
  medicineDetailText: {
    fontSize: 13,
    color: "#666",
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  noMedicinesText: {
    padding: 20,
    textAlign: "center",
    color: "#666",
  },
  upcomingCard: {
    opacity: 0.8,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  upcomingIcon: {
    opacity: 0.6,
  },
  upcomingText: {
    color: "#999",
  },
  upcomingBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  upcomingBadgeText: {
    fontSize: 8,
    color: "#666",
    fontWeight: "bold",
  },
  banner: {
    backgroundColor: "#4f46e5",
    padding: 20,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    borderRadius: 12,
  },
  bannerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  bannerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerTagline: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 4,
  },
  imageGallery: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 12,
    marginTop: 10,
  },
  galleryImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 12,
  },
  accordionContainer: {
    // padding: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accordionHeaderActive: {
    backgroundColor: "#6366f1",
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#1f2937",
  },
  accordionTitleActive: {
    color: "#fff",
  },
  accordionContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: -4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  causeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  causeIcon: {
    fontSize: 20,
    width: 24,
    textAlign: "center",
  },
  causeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  causeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  causeDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
});
