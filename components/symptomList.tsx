import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Check, Circle } from "lucide-react-native";

interface SymptomsModalProps {
  visible: boolean;
  symptomsList?: string[];
  language?: string;
  heading?: string;
  onClose: () => void;
  onSave: (data: {
    symptoms: string[];
    intensities: { [key: string]: number };
    otherText: string;
  }) => void;
}

const { height } = Dimensions.get("window");

export const SymptomsModal: React.FC<SymptomsModalProps> = ({
  visible,
  onClose,
  onSave,
  symptomsList = [],
  heading = "Select Symptoms",
  language = "en",
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensityValues, setIntensityValues] = useState<{
    [key: string]: number;
  }>({});
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!visible) {
      setSelectedSymptoms([]);
      setIntensityValues({});
      setOtherText("");
    }
  }, [visible]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
      const newIntensities = { ...intensityValues };
      delete newIntensities[symptom];
      setIntensityValues(newIntensities);
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setIntensityValues({ ...intensityValues, [symptom]: 5 });
    }
  };

  const handleSave = () => {
    onSave({
      symptoms: selectedSymptoms,
      intensities: intensityValues,
      otherText,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>{heading}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#7A39A3", fontSize: 16 }}>
                {language === "en" ? "Close" : "बंद करें"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: height * 0.7 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Symptom List */}
            {symptomsList.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom);
              return (
                <TouchableOpacity
                  key={symptom}
                  onPress={() => toggleSymptom(symptom)}
                  style={styles.symptomItem}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { backgroundColor: selected ? "#7A39A3" : "#ccc" },
                    ]}
                  >
                    {selected ? (
                      <Check size={18} color="white" />
                    ) : (
                      <Circle size={18} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.symptomText}>{symptom}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Others input */}
            {selectedSymptoms.includes(
              language === "en" ? "Others" : "अन्य"
            ) && (
              <TextInput
                style={styles.input}
                placeholder="Please describe..."
                value={otherText}
                onChangeText={setOtherText}
              />
            )}

            {/* Intensity Sliders */}
            {selectedSymptoms.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.title, { marginBottom: 10 }]}>
                  {language === "en"
                    ? "Set Intensity "
                    : "लक्षण की गंभीरता बताएं"}{" "}
                  (1 - 10)
                </Text>
                {selectedSymptoms.map((symptom) => (
                  <View key={symptom} style={styles.sliderContainer}>
                    <Text style={styles.symptomText}>
                      {symptom === (language === "en" ? "Others" : "अन्य")
                        ? otherText || "Others"
                        : symptom}
                    </Text>
                    <Slider
                      style={{ width: "100%" }}
                      minimumValue={1}
                      maximumValue={10}
                      step={1}
                      value={intensityValues[symptom]}
                      onValueChange={(val) =>
                        setIntensityValues((prev) => ({
                          ...prev,
                          [symptom]: val,
                        }))
                      }
                      minimumTrackTintColor="#7A39A3"
                      maximumTrackTintColor="#ddd"
                      thumbTintColor="#7A39A3"
                    />
                    <Text style={{ textAlign: "right", color: "#7A39A3" }}>
                      {language === "en" ? "Intensity" : "गंभीरता"}:{" "}
                      {intensityValues[symptom]}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={{ color: "white" }}>
              {language === "en" ? "Save" : "जमा करें"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    // marginBottom: 10,
    color: "#7A39A3",
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  symptomText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: "#7A39A3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
