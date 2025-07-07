"use client";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { API_URL } from "@/constants/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { getToken } from "@/services/auth";
import DateTimePicker from "@react-native-community/datetimepicker";

// Define the Patient type for better type safety
interface Patient {
  id: number;
  name: string;
  uhidNumber: string;
  email: string;
  gender: string;
  age: number;
  phoneNumber: string;
  exerciseTime: string;
  followUpDate?: string;
  password?: string;
  role: number;
  createdAt?: string;
  medicines?: any;
}

const daysOfWeek = [
  { code: "Mon", shortName: "M" },
  { code: "Tue", shortName: "T" },
  { code: "Wed", shortName: "W" },
  { code: "Thu", shortName: "T" },
  { code: "Fri", shortName: "F" },
  { code: "Sat", shortName: "S" },
  { code: "Sun", shortName: "S" },
];

const frequencies = ["Once a Day", "Twice a Day", "Thrice a Day"];

export default function PatientScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});
  const [sortBy, setSortBy] = useState("recent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  const [showTimePicker, setShowTimePicker] = useState(false);

  // Date picker states
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(new Date());

  // Fetch patients data
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched patients:", response.data[0]);
      if (response.data) {
        const patientData = response.data
          .filter((p: any) => p && p.role === 0)
          .map((p: any) => ({
            ...p,
            createdAt: p.createdAt || new Date().toISOString(),
          }));
        setPatients(patientData);
        console.log("Patients data:", patientData);
        // initializeMedicines(patientData[0]);
        applyFilters(patientData, searchQuery);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert("Error", "Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsRefreshing(false);
    }
  };

  const fetchPatientList = async () => {
    try {
      // https://mediac.in/api/medicines

      const token = await getToken();
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Fetched patient list:", response.data);
    } catch (error) {
      console.error("Error fetching patient list:", error);
      Alert.alert("Error", "Failed to load patient list. Please try again.");
    }
  };

  // Apply filters and sorting
  const applyFilters = (data: Patient[], query: string) => {
    let filtered = [...data];

    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.uhidNumber?.toLowerCase().includes(query.toLowerCase()) ||
          p.email?.toLowerCase().includes(query.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "recent":
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          comparison = dateB - dateA;
          break;
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        case "uhid":
          comparison = (a.uhidNumber || "").localeCompare(b.uhidNumber || "");
          break;
        case "gender":
          comparison = (a.gender || "").localeCompare(b.gender || "");
          break;
        case "age":
          comparison = (a.age || 0) - (b.age || 0);
          break;
        case "followup":
          const followUpA = a.followUpDate
            ? new Date(a.followUpDate).getTime()
            : 0;
          const followUpB = b.followUpDate
            ? new Date(b.followUpDate).getTime()
            : 0;
          comparison = followUpA - followUpB;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPatients(filtered);
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(patients, text);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  // Manual refresh function
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchPatients();
  };

  // Handle delete patient
  const handleDeletePatient = (id: number) => {
    Alert.alert(
      "Delete Patient",
      "Are you sure you want to deactivate this patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.patch(
                `${API_URL}/patients/delete/${id}`,
                { isActive: false },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setPatients(patients.filter((p) => p.id !== id));
              applyFilters(
                patients.filter((p) => p.id !== id),
                searchQuery
              );
              Alert.alert("Success", "Patient deleted successfully");
            } catch (error) {
              console.error("Error deactivating patient:", error);
              Alert.alert("Error", "Failed to delete patient");
            }
          },
        },
      ]
    );
  };

  // Handle update patient
  const handleUpdatePatient = async () => {
    if (!selectedPatient) return;

    if (!editedPatient.name || !editedPatient.uhidNumber) {
      Alert.alert("Error", "Name and UHID are required fields");
      return;
    }

    try {
      const updatedData = {
        ...selectedPatient,
        ...editedPatient,
        followUpDate: followUpDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      };

      if (!editedPatient.password || editedPatient.password.trim() === "") {
        delete updatedData.password;
      }

      const token = await getToken();

      const response = await axios.put(
        `${API_URL}/patients/users/${selectedPatient.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedPatients = patients.map((p) =>
          p.id === selectedPatient.id ? (updatedData as Patient) : p
        );

        setPatients(updatedPatients);
        applyFilters(updatedPatients, searchQuery);
        setEditModalVisible(false);
        Alert.alert("Success", "Patient updated successfully");
      } else {
        Alert.alert("Error", "Failed to update patient. Please try again.");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      Alert.alert("Error", "Failed to update patient");
    }
  };

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "recent" ? "desc" : "asc");
    }
  };

  // Open edit modal with patient data
  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient, password: "" });

    // Set follow-up date for date picker
    if (patient.followUpDate) {
      setFollowUpDate(new Date(patient.followUpDate));
    } else {
      setFollowUpDate(new Date());
    }

    setEditModalVisible(true);
  };

  useEffect(() => {
    fetchPatients();
    fetchPatientList();
  }, []);

  useEffect(() => {
    applyFilters(patients, searchQuery);
  }, [sortBy, sortOrder]);

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    return (
      <MaterialIcons
        name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
        size={16}
        color="#E9446A"
      />
    );
  };

  // Format phone number for better readability
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  // Get time elapsed since creation
  const getTimeElapsed = (createdAt: string) => {
    if (!createdAt) return "";

    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else {
      return created.toLocaleDateString();
    }
  };

  // Get follow-up status with color coding
  const getFollowUpStatus = (followUpDate: string) => {
    if (!followUpDate) return { text: "Not scheduled", color: "#999" };

    const followUp = new Date(followUpDate);
    const today = new Date();
    const diffTime = followUp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Overdue", color: "#E9446A" };
    } else if (diffDays === 0) {
      return { text: "Today", color: "#FF9800" };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: "#FF9800" };
    } else {
      return { text: followUp.toLocaleDateString(), color: "#4CAF50" };
    }
  };

  useEffect(() => {
    fetchAvailableMedicines();
    // initializeMedicines();
  }, []);

  const fetchAvailableMedicines = async () => {
    try {
      const token = await getToken(); // Replace with your token logic
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableMedicines(response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch available medicines");
    }
  };

  const addNewMedicine = () => {
    const newMedicine = {
      medicineId: "",
      frequency: "",
      medicineTimes: [new Date()],
      medicineDays: [],
    };
    setEditedPatient((prev) => ({
      ...prev,
      medicines: [...(prev.medicines || []), newMedicine],
    }));
  };
  // console.log("Edited Patient Data:", editedPatient);

  //for medicine

  return (
    <View style={styles.container}>
      {/* Top Bar with Add Patient Button */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Patients</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={handleManualRefresh}
            disabled={isRefreshing}
          >
            <Feather
              name="refresh-cw"
              size={22}
              color="white"
              style={isRefreshing ? styles.rotating : undefined}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-patients")}
          >
            <Ionicons name="add-circle-outline" size={28} color="white" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#bbb"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, UHID or email"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#bbb" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Sort Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortContainer}
      >
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "recent" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("recent")}
        >
          <Text style={styles.sortButtonText}>Recent</Text>
          {renderSortIndicator("recent")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "name" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("name")}
        >
          <Text style={styles.sortButtonText}>Name</Text>
          {renderSortIndicator("name")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "uhid" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("uhid")}
        >
          <Text style={styles.sortButtonText}>UHID</Text>
          {renderSortIndicator("uhid")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "gender" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("gender")}
        >
          <Text style={styles.sortButtonText}>Gender</Text>
          {renderSortIndicator("gender")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "age" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("age")}
        >
          <Text style={styles.sortButtonText}>Age</Text>
          {renderSortIndicator("age")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "followup" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("followup")}
        >
          <Text style={styles.sortButtonText}>Follow-up</Text>
          {renderSortIndicator("followup")}
        </TouchableOpacity>
      </ScrollView>

      {/* Patient List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E9446A" />
          <Text style={styles.loadingText}>Loading patients...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E9446A"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-injured" size={50} color="#555" />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No patients match your search"
                  : "No patients found"}
              </Text>
              <TouchableOpacity
                style={styles.emptyRefreshButton}
                onPress={onRefresh}
              >
                <Text style={styles.emptyRefreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const followUpStatus = getFollowUpStatus(item.followUpDate || "");

            return (
              <Pressable
                style={styles.patientCard}
                onPress={() => {
                  setSelectedPatient(item);
                  setDetailModalVisible(true);
                }}
              >
                <View style={styles.patientInfo}>
                  <View style={styles.patientHeader}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <View style={styles.headerBadges}>
                      <View style={styles.genderBadge}>
                        <FontAwesome5
                          name={
                            item.gender?.toLowerCase() === "male"
                              ? "mars"
                              : "venus"
                          }
                          size={12}
                          color="white"
                        />
                        <Text style={styles.genderText}>{item.gender}</Text>
                      </View>

                      {item.createdAt && (
                        <View style={styles.timeBadge}>
                          <Feather name="clock" size={10} color="white" />
                          <Text style={styles.timeText}>
                            {getTimeElapsed(item.createdAt)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.patientDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <FontAwesome5 name="id-card" size={12} color="#bbb" />
                        <Text style={styles.patientInfoText}>
                          <Text style={styles.labelText}>UHID:</Text>{" "}
                          {item.uhidNumber}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <FontAwesome5
                          name="birthday-cake"
                          size={12}
                          color="#bbb"
                        />
                        <Text style={styles.patientInfoText}>
                          <Text style={styles.labelText}>Age:</Text> {item.age}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <FontAwesome5 name="envelope" size={12} color="#bbb" />
                      <Text style={styles.patientInfoText} numberOfLines={1}>
                        <Text style={styles.labelText}>Email:</Text>{" "}
                        {item.email}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <FontAwesome5 name="phone" size={12} color="#bbb" />
                        <Text style={styles.patientInfoText}>
                          <Text style={styles.labelText}>Phone:</Text>{" "}
                          {formatPhoneNumber(item.phoneNumber)}
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <FontAwesome5 name="running" size={12} color="#bbb" />
                        <Text style={styles.patientInfoText}>
                          <Text style={styles.labelText}>Exercise:</Text>{" "}
                          {item.exerciseTime}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <FontAwesome5
                          name="calendar-check"
                          size={12}
                          color={followUpStatus.color}
                        />
                        <Text
                          style={[
                            styles.patientInfoText,
                            { color: followUpStatus.color },
                          ]}
                        >
                          <Text style={styles.labelText}>Follow-up:</Text>{" "}
                          {followUpStatus.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.actionIcons}>
                  {/* <TouchableOpacity
                    style={styles.actionButton}
                    onPress={async (e) => {
                      e.stopPropagation();
                      try {
                        const token = await getToken();
                        const response = await axios.get(
                          `${API_URL}/patients/users/${item.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        if (response.data) {
                          const patientData = {
                            ...item,
                            name: response.data.name || item.name,
                            age: response.data.age || item.age,
                            gender: response.data.gender || item.gender,
                            uhidNumber:
                              response.data.uhidNumber || item.uhidNumber,
                            phoneNumber:
                              response.data.phoneNumber || item.phoneNumber,
                            exerciseTime:
                              response.data.exerciseTime || item.exerciseTime,
                            followUpDate:
                              response.data.followUpDate || item.followUpDate,
                            medicines: response.data.patientMedicine || [],
                          };
                          initializeMedicines(response.data);
                          openEditModal(patientData);
                        }
                      } catch (error) {
                        console.error("Error fetching patient details:", error);
                        openEditModal(item);
                      }
                    }}
                  >
                    <MaterialIcons name="edit" size={22} color="#4CAF50" />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      const mappedMedicines = (item.patientMedicine || []).map(
                        (med) => {
                          const found = availableMedicines.find(
                            (m) => m.id === med.id
                          );
                          return {
                            medicineId: found?.id || "",
                            frequency: med.frequency || "",
                            medicineTimes: (med.medicineTimes || []).map(
                              (t) => {
                                const parsed = new Date(t);
                                return isNaN(parsed.getTime())
                                  ? new Date()
                                  : parsed;
                              }
                            ),
                            medicineDays: Array.isArray(med.medicineDays)
                              ? med.medicineDays
                              : [],
                          };
                        }
                      );

                      const patientData = {
                        ...item,
                        medicines: mappedMedicines,
                      };
                      console.log("Opening edit modal with data:", patientData);
                      openEditModal(patientData);
                    }}
                  >
                    <MaterialIcons name="edit" size={22} color="#4CAF50" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(item.id);
                    }}
                  >
                    <MaterialIcons name="delete" size={22} color="#E9446A" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {/* Patient Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Patient Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {selectedPatient && (
              <ScrollView style={styles.detailContent}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Personal Information
                  </Text>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Name</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.name}
                      </Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>UHID</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.uhidNumber}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Gender</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.gender}
                      </Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Age</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.age}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Contact Information
                  </Text>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Email</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.email}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailValue}>
                        {formatPhoneNumber(selectedPatient.phoneNumber)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Health Information
                  </Text>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Exercise Time</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.exerciseTime}
                      </Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Follow-up Date</Text>
                      <Text style={styles.detailValue}>
                        {selectedPatient.followUpDate
                          ? new Date(
                              selectedPatient.followUpDate
                            ).toLocaleDateString()
                          : "Not scheduled"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.editButton]}
                    onPress={async () => {
                      try {
                        const token = await getToken();
                        const response = await axios.get(
                          `${API_URL}/patients/users/${selectedPatient.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        if (response.data) {
                          const patientData = {
                            ...selectedPatient,
                            name: response.data.name || selectedPatient.name,
                            age: response.data.age || selectedPatient.age,
                            gender:
                              response.data.gender || selectedPatient.gender,
                            uhidNumber:
                              response.data.uhidNumber ||
                              selectedPatient.uhidNumber,
                            phoneNumber:
                              response.data.phoneNumber ||
                              selectedPatient.phoneNumber,
                            exerciseTime:
                              response.data.exerciseTime ||
                              selectedPatient.exerciseTime,
                            followUpDate:
                              response.data.followUpDate ||
                              selectedPatient.followUpDate,
                          };

                          setDetailModalVisible(false);
                          openEditModal(patientData);
                        }
                      } catch (error) {
                        console.error("Error fetching patient details:", error);
                        setDetailModalVisible(false);
                        openEditModal(selectedPatient);
                      }
                    }}
                  >
                    <MaterialIcons name="edit" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      setDetailModalVisible(false);
                      handleDeletePatient(selectedPatient.id);
                    }}
                  >
                    <MaterialIcons name="delete" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Deactivate</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Patient</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.name}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, name: text })
                }
                placeholder="Enter name"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>UHID Number *</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.uhidNumber}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, uhidNumber: text })
                }
                placeholder="Enter UHID"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.email}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, email: text })
                }
                placeholder="Enter email"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />

              <Text style={styles.inputLabel}>Reset Password</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.password || ""}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, password: text })
                }
                placeholder="Enter new password to reset"
                placeholderTextColor="#888"
                secureTextEntry={!!editedPatient.password}
              />

              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedPatient.gender}
                  onValueChange={(value) =>
                    setEditedPatient({ ...editedPatient, gender: value })
                  }
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.age?.toString()}
                onChangeText={(text) =>
                  setEditedPatient({
                    ...editedPatient,
                    age: Number.parseInt(text) || 0,
                  })
                }
                placeholder="Enter age"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.phoneNumber}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, phoneNumber: text })
                }
                placeholder="Enter phone number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Exercise Time</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.exerciseTime}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, exerciseTime: text })
                }
                placeholder="Enter exercise time (e.g. 30 mins)"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Follow-up Date</Text>
              <TouchableOpacity
                onPress={() => setShowFollowUpDatePicker(true)}
                style={styles.datePickerButton}
              >
                <FontAwesome5
                  name="calendar-alt"
                  size={16}
                  color="#bbb"
                  style={styles.inputIcon}
                />
                <Text style={styles.dateText}>
                  {followUpDate.toDateString()}
                </Text>
                <FontAwesome5
                  name="calendar"
                  size={16}
                  color="#E9446A"
                  style={styles.dateIcon}
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
              {(editedPatient.medicines || []).map((medicine, medIndex) => (
                <View
                  key={medIndex}
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Medicine {medIndex + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const updated = [...editedPatient.medicines];
                        updated.splice(medIndex, 1);
                        setEditedPatient((prev) => ({
                          ...prev,
                          medicines: updated,
                        }));
                      }}
                    >
                      <MaterialIcons name="delete" size={20} color="red" />
                    </TouchableOpacity>
                  </View>

                  {/* Medicine Picker */}
                  <Text style={{ marginTop: 8 }}>Medicine Name</Text>
                  <Picker
                    selectedValue={medicine.medicineId}
                    onValueChange={(value) => {
                      const updated = [...editedPatient.medicines];
                      updated[medIndex].medicineId = value;
                      setEditedPatient((prev) => ({
                        ...prev,
                        medicines: updated,
                      }));
                    }}
                  >
                    <Picker.Item label="Select Medicine" value="" />
                    {availableMedicines.map((med) => (
                      <Picker.Item
                        key={med.id}
                        label={`${med.medicineName} (${med.medicineDose} ${med.medicineDoseUnit})`}
                        value={med.id}
                      />
                    ))}
                  </Picker>

                  {/* Frequency */}
                  <Text style={{ marginTop: 8 }}>Frequency</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {frequencies.map((freq) => (
                      <TouchableOpacity
                        key={freq}
                        onPress={() => {
                          const updated = [...editedPatient.medicines];
                          updated[medIndex].frequency = freq;
                          setEditedPatient((prev) => ({
                            ...prev,
                            medicines: updated,
                          }));
                        }}
                        style={{
                          padding: 8,
                          margin: 4,
                          borderWidth: 1,
                          borderRadius: 6,
                          backgroundColor:
                            medicine.frequency === freq ? "#4CAF50" : "#2C2C2C",
                          borderColor:
                            medicine.frequency === freq ? "#4CAF50" : "#666",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              medicine.frequency === freq ? "#fff" : "#ccc",
                          }}
                        >
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Dose Timings */}
                  <Text style={{ marginTop: 8 }}>Dose Timings</Text>
                  {medicine.medicineTimes.map((time, timeIndex) => (
                    <View
                      key={timeIndex}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 4,
                      }}
                    >
                      <Text>Dose {timeIndex + 1}: </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setShowTimePicker({ medIndex, timeIndex })
                        }
                        style={{
                          marginLeft: 10,
                          padding: 6,
                          borderWidth: 1,
                          borderRadius: 6,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ marginRight: 8 }}>
                          {time instanceof Date && !isNaN(time)
                            ? time.toTimeString().slice(0, 5)
                            : "00:00"}
                        </Text>
                        <FontAwesome5 name="clock" size={14} color="#E9446A" />
                      </TouchableOpacity>
                      {showTimePicker &&
                        showTimePicker.medIndex === medIndex &&
                        showTimePicker.timeIndex === timeIndex && (
                          <DateTimePicker
                            value={new Date(time)}
                            mode="time"
                            is24Hour
                            display="default"
                            onChange={(event, selectedTime) => {
                              setShowTimePicker(null);
                              if (selectedTime) {
                                const updated = [...editedPatient.medicines];
                                updated[medIndex].medicineTimes[timeIndex] =
                                  selectedTime;
                                setEditedPatient((prev) => ({
                                  ...prev,
                                  medicines: updated,
                                }));
                              }
                            }}
                          />
                        )}
                    </View>
                  ))}

                  {/* Days of Week */}
                  <Text style={{ marginTop: 8 }}>Days</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day.code}
                        onPress={() => {
                          const updated = [...editedPatient.medicines];
                          const currentDays =
                            updated[medIndex].medicineDays || [];
                          updated[medIndex].medicineDays = currentDays.includes(
                            day.code
                          )
                            ? currentDays.filter((d) => d !== day.code)
                            : [...currentDays, day.code];
                          setEditedPatient((prev) => ({
                            ...prev,
                            medicines: updated,
                          }));
                        }}
                        style={{
                          margin: 4,
                          padding: 8,
                          borderRadius: 16,
                          borderWidth: 1,
                          backgroundColor: medicine.medicineDays.includes(
                            day.code
                          )
                            ? "#4CAF50"
                            : "#2C2C2C",
                          borderColor: medicine.medicineDays.includes(day.code)
                            ? "#4CAF50"
                            : "#666",
                        }}
                      >
                        <Text
                          style={{
                            color: medicine.medicineDays.includes(day.code)
                              ? "#fff"
                              : "#ccc",
                          }}
                        >
                          {day.shortName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              {editedPatient.medicines?.length === 0 && (
                <Text style={{ color: "#888" }}>No medicines added yet.</Text>
              )}

              <TouchableOpacity
                onPress={addNewMedicine}
                style={{
                  marginTop: 12,
                  backgroundColor: "#007bff",
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  + Add Medicine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdatePatient}
              >
                <Text style={styles.saveButtonText}>Update Patient</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#E9446A",
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 3,
  },
  reloadButton: {
    backgroundColor: "#3A3A4C",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3C",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#3A3A4C",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    height: 40,
  },
  sortContainer: {
    flexDirection: "row",
    marginBottom: 16,
    height: 40,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3C",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
  },
  activeSortButton: {
    backgroundColor: "#3A3A4C",
    borderColor: "#E9446A",
    borderWidth: 1,
  },
  sortButtonText: {
    color: "#fff",
    marginRight: 4,
  },
  patientCard: {
    backgroundColor: "#2A2A3C",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#E9446A",
  },
  patientInfo: {
    flex: 1,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerBadges: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9446A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
  },
  genderText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  patientDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  labelText: {
    color: "#999",
    fontWeight: "500",
  },
  patientInfoText: {
    fontSize: 14,
    color: "#ddd",
  },
  actionIcons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#bbb",
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#bbb",
    marginTop: 16,
    fontSize: 16,
  },
  emptyRefreshButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E9446A",
    borderRadius: 8,
    elevation: 2,
  },
  emptyRefreshText: {
    color: "#fff",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  detailModalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A4C",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#3A3A4C",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: "#3A3A4C",
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    color: "#fff",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A4C",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  dateText: {
    flex: 1,
    color: "#fff",
  },
  dateIcon: {
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: "#E9446A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailContent: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E9446A",
    marginBottom: 12,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#bbb",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#E9446A",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
