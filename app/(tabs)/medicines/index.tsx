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
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { API_URL } from "@/constants/Api";
import { getToken } from "@/services/auth";

// Define the Medicine type for better type safety
interface Medicine {
  id: number;
  medicineName: string;
  medicineDose: string;
  medicineDoseUnit: string;
  medicineFrequency: string;
  timing: string;
  medicine_notes?: string;
  notes?: string;
  medicineNotes?: string;
  startDate: string;
  endDate?: string;
}

// Dose unit options
const doseUnits = ["mg", "mcg", "g", "ml", "IU", "mEq"];

export default function MedicineScreen() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState<Partial<Medicine>>({});
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({});
  const [sortBy, setSortBy] = useState("recent");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch medicines data
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        // Filter out null/undefined entries and ensure each item has required properties
        const medicineData = response.data
          .filter((p) => p)
          .map((medicine) => ({
            id: medicine.id || Math.random(),
            medicineName: medicine.medicineName || "Unknown",
            medicineDose: medicine.medicineDose || "0",
            medicineDoseUnit: medicine.medicineDoseUnit || "mg",
            medicineFrequency: medicine.medicineFrequency || "Once daily",
            timing: medicine.timing || "",
            medicine_notes:
              medicine.medicineNotes || medicine.medicine_notes || "",
            startDate: medicine.startDate || new Date().toISOString(),
          }));
        setMedicines(medicineData);
        applyFilters(medicineData, searchQuery);
      }
    } catch (error) {
      console.error("Error fetching Medicines:", error);
      Alert.alert("Error", "Failed to load Medicines. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Apply filters and sorting
  const applyFilters = (data: Medicine[], query: string) => {
    let filtered = [...data];

    // Apply search filter
    if (query) {
      filtered = filtered.filter(
        (m) =>
          m.medicineName.toLowerCase().includes(query.toLowerCase()) ||
          m.medicineFrequency.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "recent":
          // Sort by ID (assuming higher ID means more recent)
          comparison = a.id - b.id;
          break;
        case "name":
        case "medicineName":
          comparison = a.medicineName.localeCompare(b.medicineName);
          break;
        case "dose":
        case "medicineDose":
          const doseA = Number.parseFloat(a.medicineDose) || 0;
          const doseB = Number.parseFloat(b.medicineDose) || 0;
          comparison = doseA - doseB;
          break;
        case "frequency":
        case "medicineFrequency":
          comparison = a.medicineFrequency.localeCompare(b.medicineFrequency);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredMedicines(filtered);
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(medicines, text);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicines();
  };
  const handleDeleteMedicine = (id: number) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await getToken(); // Get the auth token

              const response = await axios.patch(
                `${API_URL}/medicines/${id}/delete`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              // Check the response status
              if (response.status === 200) {
                // Update state after successful "delete" (e.g., marking as deleted)
                const updatedMedicines = medicines.filter((m) => m.id !== id);
                setMedicines(updatedMedicines);
                applyFilters(updatedMedicines, searchQuery);

                if (detailModalVisible) setDetailModalVisible(false);
                Alert.alert("Success", "Medication deleted successfully");
              } else {
                throw new Error(`Unexpected response: ${response.status}`);
              }
            } catch (error: any) {
              console.error("Error deleting medicine:", error);
              const message =
                error.response?.status === 400
                  ? "Invalid request. Please try again."
                  : "There was an issue deleting the medication. Please try again.";
              Alert.alert("Error", message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle update medicine
  const handleUpdateMedicine = async () => {
    if (!selectedMedicine) return;

    // Validate required fields
    if (!editedMedicine.medicineName || !editedMedicine.medicineDose) {
      Alert.alert("Error", "Name and Dose are required fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken(); // Get the auth token

      // Construct the JSON object to submit
      const updateData = {
        medicineName: editedMedicine.medicineName || "", // Ensure empty string if not provided
        medicineDose: editedMedicine.medicineDose || "", // Ensure empty string if not provided
        medicineDoseUnit: editedMedicine.medicineDoseUnit || "", // Default to empty string if not provided
        medicineNotes:
          editedMedicine.medicineNotes !== undefined
            ? editedMedicine.medicineNotes
            : "", // Default to empty string if not undefined
      };

      // Send PATCH request
      const response = await axios.patch(
        `${API_URL}/medicines/${selectedMedicine.id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Update the local state with the updated medicine
        const updatedMedicine = { ...selectedMedicine, ...response.data };

        setMedicines(
          medicines.map((m) =>
            m.id === selectedMedicine.id ? updatedMedicine : m
          )
        );
        applyFilters(medicines, searchQuery);
        setEditModalVisible(false);
        Alert.alert("Success", "Medication updated successfully");
      } else {
        // Handle unexpected response status
        Alert.alert(
          "Error",
          `Unexpected response from server: ${response.status}. Please try again.`
        );
      }
    } catch (error: any) {
      console.error("Error updating medicine:", error);

      // Handle errors based on the response status code
      const message =
        error.response?.status === 400
          ? `Bad request: ${
              error.response?.data?.message || "Please check your input."
            }`
          : error.response?.status === 404
          ? "Medicine not found. Please try again."
          : "There was an issue updating the medication. Please try again.";

      // Show an error alert with the appropriate message
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // Handle add medicine
  const handleAddMedicine = async () => {
    // Validate required fields
    if (!newMedicine.medicineName || !newMedicine.medicineDose) {
      Alert.alert("Error", "Name and Dose are required fields");
      return;
    }

    const medicineData = {
      medicineName: newMedicine.medicineName,
      medicineDose: newMedicine.medicineDose,
      medicineDoseUnit: newMedicine.medicineDoseUnit || "mg",
      medicineFrequency: newMedicine.medicineFrequency || "Once daily",
      medicineNotes: newMedicine.notes || "",
    };

    try {
      setLoading(true);
      // Get the authentication token
      const token = await getToken();

      // Send a POST request to add the medicine to the backend with the Authorization header
      const response = await axios.post(`${API_URL}/medicines`, medicineData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming the API returns the newly added medicine with an `id` and other details
      const newMedicineFromAPI = response.data;

      // Ensure the new medicine has all required properties before adding to state
      const completeNewMedicine = {
        id: newMedicineFromAPI.id || Math.random(), // Fallback to random ID if none provided
        medicineName:
          newMedicineFromAPI.medicineName || medicineData.medicineName,
        medicineDose:
          newMedicineFromAPI.medicineDose || medicineData.medicineDose,
        medicineDoseUnit:
          newMedicineFromAPI.medicineDoseUnit || medicineData.medicineDoseUnit,
        medicineFrequency:
          newMedicineFromAPI.medicineFrequency ||
          medicineData.medicineFrequency,
        medicine_notes:
          newMedicineFromAPI.medicineNotes || medicineData.medicineNotes,
        startDate: new Date().toISOString(), // Default to current date if not provided
        timing: "",
      };

      // Update the state with the new medicine
      const updatedMedicines = [...medicines, completeNewMedicine];
      setMedicines(updatedMedicines);

      // Apply any filters or updates needed after adding the new medicine
      applyFilters(updatedMedicines, searchQuery);

      // Close the modal and reset the form
      setAddModalVisible(false);
      setNewMedicine({
        medicineName: "",
        medicineDose: "",
        medicineDoseUnit: "mg",
        medicineFrequency: "Once daily",
      });

      Alert.alert("Success", "Medication added successfully");
    } catch (error) {
      console.error("Error adding medicine:", error);
      Alert.alert(
        "Error",
        "There was an issue adding the medication. Please try again."
      );
    } finally {
      setLoading(false);
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
    fetchMedicines();
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
      {/* Top Bar with Add Medicine Button */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Medications</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.reloadButton} onPress={onRefresh}>
            <Feather name="refresh-cw" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
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
            placeholder="Search by name or frequency"
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
            sortBy === "dose" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("dose")}
        >
          <Text style={styles.sortButtonText}>Dose</Text>
          {renderSortIndicator("dose")}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "frequency" && styles.activeSortButton,
          ]}
          onPress={() => toggleSort("frequency")}
        >
          <Text style={styles.sortButtonText}>Frequency</Text>
          {renderSortIndicator("frequency")}
        </TouchableOpacity>
      </ScrollView>

      {/* Medicine List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E9446A" />
          <Text style={styles.loadingText}>Loading medications...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E9446A"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="pills" size={50} color="#555" />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No medications match your search"
                  : "No medications found"}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            // Ensure all required properties exist
            if (!item || !item.medicineName) {
              return null; // Skip rendering if essential data is missing
            }

            return (
              <Pressable
                style={styles.medicineCard}
                onPress={() => {
                  setSelectedMedicine(item);
                  setDetailModalVisible(true);
                }}
              >
                <View style={styles.medicineInfo}>
                  <View style={styles.medicineHeader}>
                    <Text style={styles.medicineName}>{item.medicineName}</Text>
                    <View style={styles.doseBadge}>
                      <Text style={styles.doseText}>
                        {item.medicineDose || "N/A"}{" "}
                        {item.medicineDoseUnit || ""}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.medicineDetails}>
                    <View style={styles.detailItem}>
                      <FontAwesome5 name="clock" size={12} color="#bbb" />
                      <Text style={styles.medicineInfoText}>
                        {item.medicineFrequency || "N/A"}
                      </Text>
                    </View>

                    {(item.medicineNotes || item.medicine_notes) && (
                      <View style={styles.detailItem}>
                        <FontAwesome5
                          name="sticky-note"
                          size={12}
                          color="#bbb"
                        />
                        <Text style={styles.medicineInfoText} numberOfLines={1}>
                          {item.medicineNotes || item.medicine_notes}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.actionIcons}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelectedMedicine(item);
                      setEditedMedicine({
                        ...item,
                        notes: item.medicine_notes || item.medicineNotes || "",
                      });
                      setEditModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="edit" size={24} color="#4CAF50" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteMedicine(item.id);
                    }}
                  >
                    <MaterialIcons name="delete" size={24} color="#E9446A" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {/* Medicine Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medication Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {selectedMedicine && (
              <ScrollView style={styles.detailContent}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Medication Information
                  </Text>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Name</Text>
                      <Text style={styles.detailValue}>
                        {selectedMedicine.medicineName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Dose</Text>
                      <Text style={styles.detailValue}>
                        {selectedMedicine.medicineDose}{" "}
                        {selectedMedicine.medicineDoseUnit}
                      </Text>
                    </View>

                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Frequency</Text>
                      <Text style={styles.detailValue}>
                        {selectedMedicine.medicineFrequency}
                      </Text>
                    </View>
                  </View>
                </View>

                {(selectedMedicine.medicine_notes ||
                  selectedMedicine.medicineNotes) && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Notes</Text>

                    <View style={styles.detailRow}>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailValue}>
                          {selectedMedicine.medicine_notes ||
                            selectedMedicine.medicineNotes}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.editButton]}
                    onPress={() => {
                      setDetailModalVisible(false);
                      setEditedMedicine({
                        ...selectedMedicine,
                        notes:
                          selectedMedicine.medicine_notes ||
                          selectedMedicine.medicineNotes ||
                          "",
                      });
                      setEditModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="edit" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      handleDeleteMedicine(selectedMedicine.id);
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

      {/* Edit Medicine Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Medication</Text>
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
                value={editedMedicine.medicineName}
                onChangeText={(text) =>
                  setEditedMedicine({ ...editedMedicine, medicineName: text })
                }
                placeholder="Enter medication name"
                placeholderTextColor="#888"
              />

              <View style={styles.rowContainer}>
                {/* <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Dose *</Text>
                  <TextInput
                    style={styles.input}
                    value={editedMedicine.medicineDose}
                    onChangeText={(text) =>
                      setEditedMedicine({
                        ...editedMedicine,
                        medicineDose: text,
                      })
                    }
                    placeholder="Enter dose"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                </View> */}

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={editedMedicine.medicineDoseUnit}
                      onValueChange={(value) =>
                        setEditedMedicine({
                          ...editedMedicine,
                          medicineDoseUnit: value,
                        })
                      }
                      style={styles.picker}
                      dropdownIconColor="#fff"
                    >
                      {doseUnits.map((unit) => (
                        <Picker.Item key={unit} label={unit} value={unit} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              {/* <Text style={styles.inputLabel}>Frequency</Text> */}
              {/* <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedMedicine.medicineFrequency}
                  onValueChange={(value) =>
                    setEditedMedicine({
                      ...editedMedicine,
                      medicineFrequency: value,
                    })
                  }
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Once daily" value="Once daily" />
                  <Picker.Item label="Twice daily" value="Twice daily" />
                  <Picker.Item
                    label="Three times daily"
                    value="Three times daily"
                  />
                  <Picker.Item
                    label="Four times daily"
                    value="Four times daily"
                  />
                  <Picker.Item label="Every 4 hours" value="Every 4 hours" />
                  <Picker.Item label="Every 6 hours" value="Every 6 hours" />
                  <Picker.Item label="Every 8 hours" value="Every 8 hours" />
                  <Picker.Item label="Every 12 hours" value="Every 12 hours" />
                  <Picker.Item label="As needed" value="As needed" />
                </Picker>
              </View> */}

              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedMedicine.notes}
                onChangeText={(text) =>
                  setEditedMedicine({ ...editedMedicine, notes: text })
                }
                placeholder="Add any special instructions"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateMedicine}
              >
                <Text style={styles.saveButtonText}>Update Medication</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Medicine Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Medication</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={newMedicine.medicineName?.toString()}
                onChangeText={(text) =>
                  setNewMedicine({ ...newMedicine, medicineName: text })
                }
                placeholder="Enter medication name"
                placeholderTextColor="#888"
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Dose *</Text>
                  <TextInput
                    style={styles.input}
                    value={newMedicine.medicineDose?.toString()}
                    onChangeText={(text) =>
                      setNewMedicine({
                        ...newMedicine,
                        medicineDose: text,
                      })
                    }
                    placeholder="Enter dose"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newMedicine.medicineDoseUnit}
                      onValueChange={(value) =>
                        setNewMedicine({
                          ...newMedicine,
                          medicineDoseUnit: value,
                        })
                      }
                      style={styles.picker}
                      dropdownIconColor="#fff"
                    >
                      {doseUnits.map((unit) => (
                        <Picker.Item key={unit} label={unit} value={unit} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>

              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newMedicine.medicineFrequency}
                  onValueChange={(value) =>
                    setNewMedicine({ ...newMedicine, medicineFrequency: value })
                  }
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Once daily" value="Once daily" />
                  <Picker.Item label="Twice daily" value="Twice daily" />
                  <Picker.Item
                    label="Three times daily"
                    value="Three times daily"
                  />
                  <Picker.Item
                    label="Four times daily"
                    value="Four times daily"
                  />
                  <Picker.Item label="Every 4 hours" value="Every 4 hours" />
                  <Picker.Item label="Every 6 hours" value="Every 6 hours" />
                  <Picker.Item label="Every 8 hours" value="Every 8 hours" />
                  <Picker.Item label="Every 12 hours" value="Every 12 hours" />
                  <Picker.Item label="As needed" value="As needed" />
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newMedicine.notes}
                onChangeText={(text) =>
                  setNewMedicine({ ...newMedicine, notes: text })
                }
                placeholder="Add any special instructions"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMedicine}
              >
                <Text style={styles.saveButtonText}>Add Medication</Text>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reloadButton: {
    backgroundColor: "#3A3A4C",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
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
  medicineCard: {
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
  medicineInfo: {
    flex: 1,
  },
  medicineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  doseBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9446A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  doseText: {
    color: "#fff",
    fontSize: 12,
  },
  medicineDetails: {
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
  medicineInfoText: {
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
    elevation: 5,
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  halfInput: {
    width: "48%",
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
