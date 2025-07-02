import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";

const exercises = [
  {
    id: "1",
    name: "Walking",
    description:
      "1. Benefits: Improves circulation, strengthens the heart, and boosts stamina. 2. Tips: Start with short, flat walks (10-15 minutes) and slowly increase the time and pace over weeks. You can progress to brisk walking as tolerated",
    videoUrl: "https://mediac.in/video/Walking%20Video%20(Freepik).mp4",
  },
  {
    id: "2",
    name: "Light Stretching exercises-Neck Stretch",
    description:
      "Description:Sit or stand upright.Gently tilt your head to one side, bringing your ear toward your shoulder.Hold for 10–15 seconds on each side.",
    videoUrl: "https://mediac.in/video/Neck%20Stretch%20(Pexels)(1).mp4",
  },
  {
    id: "3",
    name: "Light Stretching exercises-Shoulder Rotation",
    description:
      "description: Sit or stand with your back straight.  Rotate your shoulders forward in a circular motion 5%E2%80%9310 times. Repeat rolling backward.",
    videoUrl: "https://mediac.in/video/Shoulder%20Rotation%20(Freepik).mp4",
  },
  {
    id: "4",
    name: "Arm Stretches",
    description:
      "description: Extend one arm across your chest. Use your opposite hand to gently press the arm closer to your chest. Hold for 10%E2%80%9315 seconds per arm.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "5",
    name: "Forward Bend",
    description:
      "description: Slowly bend forward from the hips, keeping your back straight, and reach toward your knees or shins. Hold for 10%E2%80%9315 seconds.",
    videoUrl: "https://mediac.in/video/Forward%20Bend%20(Freepik).mp4",
  },
  {
    id: "6",
    name: "Ankle Rotations",
    description:
      "description: Rotate your ankles in a circular motion 10 times in each direction.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "7",
    name: "Calf Stretch",
    description:
      "description: Stand facing a wall. Place your hands on the wall at shoulder height. Step one foot back, keeping it straight with the heel on the floor. Lean forward gently until you feel a stretch in the back leg. Hold for 10%E2%80%9315 seconds per leg.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "8",
    name: "Stationary Cycling/ Cycling",
    description:
      "1. Benefits: Low-impact exercise that boosts cardiovascular fitness. 2. Tips: Begin with a low resistance and cycle for short intervals, around 10-15 minutes. Increase the time gradually as your endurance improves.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "9",
    name: "Swimming or Water Aerobics",
    description:
      "1. Benefits: Provides gentle resistance and minimizes joint strain, especially beneficial for those with arthritis or joint issues. 2. Tips: Start with slow-paced swimming or basic water aerobics movements. Perform only if you know swimming or perform under supervision.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "10",
    name: "Slow Dancing",
    description:
      "1. Benefits: Fun and rhythmic, this activity improves coordination and cardiovascular health. 2. Tips: Start with slow movements, and ensure you don’t exert yourself too much.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "11",
    name: "Running/ Jogging",
    description:
      "1. Benefits: Running/jogging boosts cardiovascular health, improves endurance, and elevates mood through endorphin release. 2. Tips: Start at a comfortable pace, wear proper footwear, and stay hydrated to prevent fatigue and injury.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "12",
    name: "Yoga or Exercises",
    description:
      "1. Benefits: Enhances flexibility, reduces stress, and increases mobility. 2. Tips: Perform gentle seated movements that engage the upper body, such as arm circles or leg raises, without putting strain on the heart.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "13",
    name: "Head to Toe Relaxation",
    description:
      "1. Benefits: Helps reduce stress, lower blood pressure, and enhance oxygen flow. 2. Tips: Practice slow, deep breathing techniques like diaphragmatic breathing. Pair this with relaxation techniques such as meditation.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
];

const ExerciseList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

  const openVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {exercises.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={() => openVideo(item.videoUrl)}
            >
              <Text style={styles.watchText}>Watch Video</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal for video playback */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Video
              source={{ uri: selectedVideo }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  scrollContainer: { paddingBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 28,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  exerciseName: { fontSize: 18, fontWeight: "bold" },
  description: { fontSize: 14, color: "#555", marginVertical: 5 },
  watchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  watchText: { color: "#fff", fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  video: { width: 300, height: 200 },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  closeText: { color: "#fff", fontSize: 16 },
});

export default ExerciseList;
