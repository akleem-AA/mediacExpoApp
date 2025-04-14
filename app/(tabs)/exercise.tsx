"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

// Exercise data
const exercises = [
  {
    id: "1",
    name: "Walking",
    category: "Cardio",
    difficulty: "Beginner",
    duration: "10-15 min",
    description:
      "1. Benefits: Improves circulation, strengthens the heart, and boosts stamina. 2. Tips: Start with short, flat walks (10-15 minutes) and slowly increase the time and pace over weeks. You can progress to brisk walking as tolerated",
    videoUrl: "https://mediac.in/video/Walking%20Video%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Walking",
  },
  {
    id: "2",
    name: "Neck Stretch",
    category: "Stretching",
    difficulty: "Beginner",
    duration: "5 min",
    description:
      "Description: Sit or stand upright. Gently tilt your head to one side, bringing your ear toward your shoulder. Hold for 10–15 seconds on each side.",
    videoUrl: "https://mediac.in/video/Neck%20Stretch%20(Pexels)(1).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Neck+Stretch",
  },
  {
    id: "3",
    name: "Shoulder Rotation",
    category: "Stretching",
    difficulty: "Beginner",
    duration: "5 min",
    description:
      "Description: Sit or stand with your back straight. Rotate your shoulders forward in a circular motion 5-10 times. Repeat rolling backward.",
    videoUrl: "https://mediac.in/video/Shoulder%20Rotation%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Shoulder+Rotation",
  },
  {
    id: "4",
    name: "Arm Stretches",
    category: "Stretching",
    difficulty: "Beginner",
    duration: "5 min",
    description:
      "Description: Extend one arm across your chest. Use your opposite hand to gently press the arm closer to your chest. Hold for 10-15 seconds per arm.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Arm+Stretches",
  },
  {
    id: "5",
    name: "Forward Bend",
    category: "Stretching",
    difficulty: "Intermediate",
    duration: "5 min",
    description:
      "Description: Slowly bend forward from the hips, keeping your back straight, and reach toward your knees or shins. Hold for 10-15 seconds.",
    videoUrl: "https://mediac.in/video/Forward%20Bend%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Forward+Bend",
  },
  {
    id: "6",
    name: "Ankle Rotations",
    category: "Stretching",
    difficulty: "Beginner",
    duration: "3 min",
    description:
      "Description: Rotate your ankles in a circular motion 10 times in each direction.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Ankle+Rotations",
  },
  {
    id: "7",
    name: "Calf Stretch",
    category: "Stretching",
    difficulty: "Beginner",
    duration: "5 min",
    description:
      "Description: Stand facing a wall. Place your hands on the wall at shoulder height. Step one foot back, keeping it straight with the heel on the floor. Lean forward gently until you feel a stretch in the back leg. Hold for 10-15 seconds per leg.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Calf+Stretch",
  },
  {
    id: "8",
    name: "Stationary Cycling",
    category: "Cardio",
    difficulty: "Intermediate",
    duration: "15-20 min",
    description:
      "1. Benefits: Low-impact exercise that boosts cardiovascular fitness. 2. Tips: Begin with a low resistance and cycle for short intervals, around 10-15 minutes. Increase the time gradually as your endurance improves.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Cycling",
  },
  {
    id: "9",
    name: "Swimming",
    category: "Cardio",
    difficulty: "Intermediate",
    duration: "20-30 min",
    description:
      "1. Benefits: Provides gentle resistance and minimizes joint strain, especially beneficial for those with arthritis or joint issues. 2. Tips: Start with slow-paced swimming or basic water aerobics movements. Perform only if you know swimming or perform under supervision.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Swimming",
  },
  {
    id: "10",
    name: "Slow Dancing",
    category: "Cardio",
    difficulty: "Beginner",
    duration: "10-15 min",
    description:
      "1. Benefits: Fun and rhythmic, this activity improves coordination and cardiovascular health. 2. Tips: Start with slow movements, and ensure you don't exert yourself too much.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Dancing",
  },
  {
    id: "11",
    name: "Running/Jogging",
    category: "Cardio",
    difficulty: "Advanced",
    duration: "20-30 min",
    description:
      "1. Benefits: Running/jogging boosts cardiovascular health, improves endurance, and elevates mood through endorphin release. 2. Tips: Start at a comfortable pace, wear proper footwear, and stay hydrated to prevent fatigue and injury.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Running",
  },
  {
    id: "12",
    name: "Yoga",
    category: "Flexibility",
    difficulty: "Intermediate",
    duration: "15-30 min",
    description:
      "1. Benefits: Enhances flexibility, reduces stress, and increases mobility. 2. Tips: Perform gentle seated movements that engage the upper body, such as arm circles or leg raises, without putting strain on the heart.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Yoga",
  },
  {
    id: "13",
    name: "Head to Toe Relaxation",
    category: "Relaxation",
    difficulty: "Beginner",
    duration: "10 min",
    description:
      "1. Benefits: Helps reduce stress, lower blood pressure, and enhance oxygen flow. 2. Tips: Practice slow, deep breathing techniques like diaphragmatic breathing. Pair this with relaxation techniques such as meditation.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Relaxation",
  },
];

// Get unique categories for filter
const categories = ["All", ...new Set(exercises.map((ex) => ex.category))];

const ExerciseList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      setCountdownActive(false);
      setExerciseStarted(true);
    }
    return () => clearTimeout(timer);
  }, [countdownActive, countdown]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === "All" || exercise.category === selectedCategory;
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setCountdownActive(false);
      setCountdown(5);
      setExerciseStarted(false);
    });
  };

  const startExercise = () => {
    setCountdownActive(true);
    setCountdown(5);
  };

  const dismissDisclaimer = () => {
    setDisclaimerVisible(false);
  };

  const renderCategoryPill = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryPill,
        selectedCategory === category && styles.categoryPillActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryPillText,
          selectedCategory === category && styles.categoryPillTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderExerciseCard = (exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.card}
      onPress={() => openExerciseDetails(exercise)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardThumbnail}>
          <Image
            source={{ uri: exercise.thumbnail }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <Ionicons name="play-circle" size={28} color="#fff" />
          </View>
        </View>
        <View style={styles.cardHeaderContent}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.exerciseMetaRow}>
            <View style={styles.exerciseMetaItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.exerciseMetaText}>{exercise.duration}</Text>
            </View>
            <View style={styles.exerciseMetaItem}>
              <Ionicons name="fitness-outline" size={14} color="#666" />
              <Text style={styles.exerciseMetaText}>{exercise.difficulty}</Text>
            </View>
          </View>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{exercise.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {exercise.description}
      </Text>
    </TouchableOpacity>
  );

  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const modalOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercise Library</Text>
          <Text style={styles.subtitle}>
            Find the perfect exercise for your routine
          </Text>
        </View>

        {/* Category Filter - Made more visible for mobile */}
        <View style={styles.categoryFilterContainer}>
          <Text style={styles.filterLabel}>Filter by category:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map(renderCategoryPill)}
          </ScrollView>
        </View>

        {/* Disclaimer Section */}
        {disclaimerVisible && (
          <View style={styles.disclaimerContainer}>
            <View style={styles.disclaimerHeader}>
              <View style={styles.disclaimerTitleContainer}>
                <Ionicons name="alert-circle" size={22} color="#e53935" />
                <Text style={styles.disclaimerTitle}>Important Guidelines</Text>
              </View>
              <TouchableOpacity onPress={dismissDisclaimer}>
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.disclaimerContent}>
              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>1.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    Consult Your Doctor
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    Discuss your physical activity plan with a healthcare
                    provider before starting, after a recent cardiac event,
                    surgery, or diagnosis.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>2.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    Gradual Progression
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    Begin with low-intensity exercises and gradually increase
                    duration and intensity. Start with sessions as short as 5–10
                    minutes if needed, and gradually aim for 30 minutes per day.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>3.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    Warm-Up and Cool-Down
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    Warm-Up: Spend 5–10 minutes preparing your body with light
                    activity (e.g., slow walking).{"\n"}
                    Cool-Down: Gradually lower your heart rate with light
                    activity and stretching.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>4.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>Target</Text>
                  <Text style={styles.disclaimerItemText}>
                    At least 150 minutes of moderate-intensity or 75 minutes of
                    vigorous-intensity aerobic exercise per week. Alternatively,
                    a combination of both intensities is recommended.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>5.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    Avoid Overexertion
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    Stop exercising and seek medical attention if you experience
                    chest pain, shortness of breath, dizziness, or extreme
                    fatigue.
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>6.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>Pace Yourself</Text>
                  <Text style={styles.disclaimerItemText}>
                    On days when energy levels are lower, opt for lighter
                    activities like slow walking or stretching.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.disclaimerButton}
              onPress={dismissDisclaimer}
            >
              <Text style={styles.disclaimerButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {filteredExercises.length > 0 ? (
            filteredExercises.map(renderExerciseCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No exercises found</Text>
            </View>
          )}
        </ScrollView>

        {/* Exercise Details Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity,
                },
              ]}
            >
              {selectedExercise && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedExercise.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  {countdownActive && (
                    <View style={styles.countdownOverlay}>
                      <View style={styles.countdownContainer}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                        <Text style={styles.countdownLabel}>
                          Starting in...
                        </Text>
                      </View>
                    </View>
                  )}

                  {exerciseStarted ? (
                    <View style={styles.exerciseActiveContainer}>
                      <Text style={styles.exerciseActiveTitle}>
                        Exercise in Progress
                      </Text>
                      <View style={styles.exerciseTimerContainer}>
                        <Ionicons name="time" size={24} color="#4A55A2" />
                        <Text style={styles.exerciseTimerText}>
                          {selectedExercise.duration}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.stopButton}
                        onPress={closeModal}
                      >
                        <Text style={styles.stopButtonText}>End Exercise</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.videoContainer}>
                        <Video
                          source={{ uri: selectedExercise.videoUrl }}
                          style={styles.video}
                          useNativeControls
                          resizeMode="contain"
                          shouldPlay
                        />
                      </View>

                      <View style={styles.exerciseDetails}>
                        <View style={styles.detailsRow}>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="time-outline"
                              size={18}
                              color="#4A55A2"
                            />
                            <Text style={styles.detailLabel}>Duration</Text>
                            <Text style={styles.detailValue}>
                              {selectedExercise.duration}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="fitness-outline"
                              size={18}
                              color="#4A55A2"
                            />
                            <Text style={styles.detailLabel}>Difficulty</Text>
                            <Text style={styles.detailValue}>
                              {selectedExercise.difficulty}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="grid-outline"
                              size={18}
                              color="#4A55A2"
                            />
                            <Text style={styles.detailLabel}>Category</Text>
                            <Text style={styles.detailValue}>
                              {selectedExercise.category}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <ScrollView style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>
                          Instructions
                        </Text>
                        <Text style={styles.descriptionText}>
                          {selectedExercise.description}
                        </Text>
                      </ScrollView>

                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={startExercise}
                      >
                        <Ionicons
                          name="play"
                          size={18}
                          color="#fff"
                          style={styles.startButtonIcon}
                        />
                        <Text style={styles.startButtonText}>
                          Start Exercise
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  // Enhanced category filter visibility
  categoryFilterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    paddingLeft: 4,
  },
  categoryContainer: {
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f4ff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryPillActive: {
    backgroundColor: "#4A55A2",
    borderColor: "#4A55A2",
  },
  categoryPillText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryPillTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  // Disclaimer styles
  disclaimerContainer: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  disclaimerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffebee",
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
  },
  disclaimerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c62828",
    marginLeft: 8,
  },
  disclaimerContent: {
    maxHeight: 300,
    padding: 16,
  },
  disclaimerItem: {
    flexDirection: "row",
    marginBottom: 14,
  },
  disclaimerItemNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c62828",
    marginRight: 8,
    width: 20,
  },
  disclaimerItemContent: {
    flex: 1,
  },
  disclaimerItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  disclaimerItemText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  disclaimerButton: {
    backgroundColor: "#c62828",
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  disclaimerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  cardThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  playIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  cardHeaderContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  exerciseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  exerciseMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseMetaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: "#4A55A2",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  exerciseDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  descriptionContainer: {
    padding: 16,
    maxHeight: 200,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: "#4A55A2",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  startButtonIcon: {
    marginRight: 8,
  },
  // Countdown styles
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  countdownText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#4A55A2",
  },
  countdownLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  // Exercise active styles
  exerciseActiveContainer: {
    padding: 20,
    alignItems: "center",
  },
  exerciseActiveTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A55A2",
    marginBottom: 20,
  },
  exerciseTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  exerciseTimerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A55A2",
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ExerciseList;
