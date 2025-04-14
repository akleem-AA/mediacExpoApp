"use client";
import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { API_URL } from "@/constants/Api";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { getToken } from "@/services/auth";

// Define the Patient type for better type safety
interface Patient {
  id: number;
  name: string;
  uhid_number: string;
  email: string;
  gender: string;
  age: number;
  phone_number: string;
  exercise_time: string;
  password?: string;
  role: number;
}

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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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
      if (response.data) {
        const patientData = response.data.filter((p: any) => p.role === 0);
        setPatients(patientData);
        applyFilters(patientData, searchQuery);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert("Error", "Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Apply filters and sorting
  const applyFilters = (data: Patient[], query: string) => {
    let filtered = [...data];

    // Apply search filter
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.uhid_number.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "uhid":
          comparison = a.uhid_number.localeCompare(b.uhid_number);
          break;
        case "gender":
          comparison = a.gender.localeCompare(b.gender);
          break;
        case "age":
          comparison = a.age - b.age;
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

  // Handle delete patient
  const handleDeletePatient = (id: number) => {
    Alert.alert(
      "Delete Patient",
      "Are you sure you want to delete this patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${API_URL}/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setPatients(patients.filter((p) => p.id !== id));
              applyFilters(
                patients.filter((p) => p.id !== id),
                searchQuery
              );
              Alert.alert("Success", "Patient deleted successfully");
            } catch (error) {
              console.error("Error deleting patient:", error);
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

    // Validate required fields
    if (
      !editedPatient.name ||
      !editedPatient.email ||
      !editedPatient.uhid_number
    ) {
      Alert.alert("Error", "Name, Email and UHID are required fields");
      return;
    }

    try {
      const updatedData = {
        ...selectedPatient,
        ...editedPatient,
      };
      const token = await getToken();
      await axios.put(`${API_URL}/users/${selectedPatient.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      const updatedPatients = patients.map((p) =>
        p.id === selectedPatient.id ? (updatedData as Patient) : p
      );

      setPatients(updatedPatients);
      applyFilters(updatedPatients, searchQuery);
      setEditModalVisible(false);
      Alert.alert("Success", "Patient updated successfully");
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
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    fetchPatients();
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

  return (
    <View style={styles.container}>
      {/* Top Bar with Add Patient Button */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Patients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-patients")}
        >
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
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
            </View>
          }
          renderItem={({ item }) => (
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
                  <View style={styles.genderBadge}>
                    <FontAwesome5
                      name={
                        item.gender.toLowerCase() === "male" ? "mars" : "venus"
                      }
                      size={12}
                      color="white"
                    />
                    <Text style={styles.genderText}>{item.gender}</Text>
                  </View>
                </View>

                <View style={styles.patientDetails}>
                  <View style={styles.detailItem}>
                    <FontAwesome5 name="id-card" size={12} color="#bbb" />
                    <Text style={styles.patientInfoText}>
                      UHID: {item.uhid_number}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <FontAwesome5 name="envelope" size={12} color="#bbb" />
                    <Text style={styles.patientInfoText}>{item.email}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <FontAwesome5
                        name="birthday-cake"
                        size={12}
                        color="#bbb"
                      />
                      <Text style={styles.patientInfoText}>
                        Age: {item.age}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <FontAwesome5 name="phone" size={12} color="#bbb" />
                      <Text style={styles.patientInfoText}>
                        {item.phone_number}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <FontAwesome5 name="running" size={12} color="#bbb" />
                    <Text style={styles.patientInfoText}>
                      Exercise: {item.exercise_time}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionIcons}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedPatient(item);
                    setEditedPatient({ ...item });
                    setEditModalVisible(true);
                  }}
                >
                  <MaterialIcons name="edit" size={24} color="#4CAF50" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeletePatient(item.id);
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="#E9446A" />
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
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
                        {selectedPatient.uhid_number}
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
                        {selectedPatient.phone_number}
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
                        {selectedPatient.exercise_time}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.editButton]}
                    onPress={() => {
                      setDetailModalVisible(false);
                      setEditedPatient({ ...selectedPatient });
                      setEditModalVisible(true);
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
                    <Text style={styles.modalButtonText}>Delete</Text>
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
                value={editedPatient.uhid_number}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, uhid_number: text })
                }
                placeholder="Enter UHID"
                placeholderTextColor="#888"
              />

              <Text style={styles.inputLabel}>Email *</Text>
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
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.age?.toString()}
                onChangeText={(text) =>
                  setEditedPatient({
                    ...editedPatient,
                    age: parseInt(text) || 0,
                  })
                }
                placeholder="Enter age"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.phone_number}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, phone_number: text })
                }
                placeholder="Enter phone number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Exercise Time</Text>
              <TextInput
                style={styles.input}
                value={editedPatient.exercise_time}
                onChangeText={(text) =>
                  setEditedPatient({ ...editedPatient, exercise_time: text })
                }
                placeholder="Enter exercise time (e.g. 30 mins)"
                placeholderTextColor="#888"
              />

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
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
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
    elevation: 2,
  },
  patientInfo: {
    flex: 1,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9446A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  genderText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  patientDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  patientInfoText: {
    fontSize: 14,
    color: "#bbb",
  },
  actionIcons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
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
  },
  detailModalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#2A2A3C",
    borderRadius: 12,
    overflow: "hidden",
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
  saveButton: {
    backgroundColor: "#E9446A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
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
  detailRow: {
    flexDirection: "row",
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
