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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import packageJson from "../../package.json";
import { useDecodedToken } from "@/hooks/useDecodedToken";
import { useState } from "react";

export default function Dashboard() {
  const user = useDecodedToken();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

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
                  label="Sugar Level"
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
    marginBottom: 24,
    marginTop: 15,
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
