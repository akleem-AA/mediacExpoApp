import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { getToken } from "@/services/auth";
import { useAuth } from "@/context/AuthProvider";
import { SymptomsModal } from "@/components/symptomList";
import { useNavigation } from "@react-navigation/native";
import { Globe } from "lucide-react-native";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

const API_URL = "https://mediac.in/api";

export default function PreviousSymptomsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [symptomHistory, setSymptomHistory] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const symptomsListEn = [
    "Chest pain",
    "Shortness of Breath",
    "Fatigue or weakness",
    "Heart Palpitations",
    "Nausea or Vomiting",
    "Dizziness or lightheadedness",
    "Cold sweats",
    "Indigestion or Heartburn",
    "Back pain",
    "Jaw pain",
    "Others",
  ];

  const symptomsListHi = [
    "छाती में दर्द",
    "सांस लेने में कठिनाई",
    "थकान या कमजोरी",
    "दिल की धड़कन तेज होना",
    "मतली या उल्टी",
    "चक्कर आना या हल्का महसूस होना",
    "ठंडा पसीना",
    "अजीर्ण या एसिडिटी",
    "पीठ में दर्द",
    "जवड़े में दर्द",
    "अन्य",
  ];

  const symptomTranslation = Object.fromEntries(
    symptomsListEn.map((symptom, index) => [symptom, symptomsListHi[index]])
  );

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  const formatDateTime = (createdAt: Date): string => {
  if (isToday(createdAt)) {
    return `Today at ${format(createdAt, "hh:mm a")}`;
  } else if (isYesterday(createdAt)) {
    return `Yesterday at ${format(createdAt, "hh:mm a")}`;
  } else if (isThisWeek(createdAt)) {
    return `${format(createdAt, "EEEE")} at ${format(createdAt, "hh:mm a")}`;
  } else {
    return `${format(createdAt, "dd MMM yyyy")} at ${format(createdAt, "hh:mm a")}`;
  }
};

  useLayoutEffect(() => {
    navigation.setOptions({
      title: language === "en" ? "Symptoms" : "लक्षण",
      headerBackVisible: true,
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleLanguage}
          style={{ marginRight: 15, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ paddingRight: 6 }}>{language === "en" ? "हिंदी" : "EN"}</Text>
          <Globe size={20} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#ffffff",
      },
      headerTitleStyle: {
        color: "#000000",
        fontWeight: "bold",
      },
    });
  }, [navigation, language]);

  const fetchUserSymptoms = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(`${API_URL}/patients/symptom/${user?.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sorted = res.data?.symptoms?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const symptomList = sorted.map((entry: any) => {
        const createdAt = new Date(entry.createdAt);
        const time = formatDateTime(new Date(createdAt));
        // const time = createdAt.toLocaleTimeString("en-US", {
        //   hour: "2-digit",
        //   minute: "2-digit",
        // });

        const parsedSymptoms = JSON.parse(entry.symptom); // Array

        return {
          id: entry.id,
          time,
          symptoms: parsedSymptoms,
        };
      });

      setSymptomHistory(symptomList);
    } catch (error) {
      console.error("Error fetching symptom history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSymptoms();
  }, []);

  const handleSave = async (data) => {
    setModalVisible(false);
    await handleSymptomSave(data);
    fetchUserSymptoms(); // refresh list
  };

  const handleSymptomSave = async (data: {
    otherText?: any;
    symptoms?: any;
    intensities?: any;
  }) => {
    const { symptoms, intensities, otherText } = data;

    if (!symptoms || symptoms.length === 0) {
      Alert.alert(
        language === "en" ? "Validation Error" : "त्रुटि",
        language === "en"
          ? "Please select at least one symptom."
          : "कृपया कम से कम एक लक्षण चुनें।"
      );
      return;
    }

    const symptomData = symptoms.map((symptom: string) => ({
      symptom: symptom === "Others" || symptom === "अन्य" ? otherText : symptom,
      intensity: intensities[symptom] || 5,
    }));

    const params = {
      userid: user?.userId,
      symptoms: symptomData,
    };

    try {
      const token = await getToken();
      const response = await axios.post(`${API_URL}/patients/symptom`, params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        Alert.alert(
          language === "en" ? "Success" : "सफलता",
          language === "en"
            ? "Symptoms saved successfully!"
            : "लक्षण सफलतापूर्वक सहेजे गए!"
        );
      }
    } catch (error) {
      console.error("Error saving symptoms:", error);
      Alert.alert(
        language === "en" ? "Error" : "त्रुटि",
        language === "en"
          ? "Failed to save symptoms. Please try again."
          : "लक्षण सहेजने में विफल। कृपया पुन: प्रयास करें।"
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#7A39A3" />
      ) : symptomHistory.length === 0 ? (
        <Text style={styles.noData}>
          {language === "en" ? "No symptoms added yet." : "कोई लक्षण अभी तक नहीं जोड़े गए।"}
        </Text>
      ) : (
        <FlatList
          data={symptomHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.symptomCard}>
              <Text style={styles.timeText}>🕒 {item.time}</Text>
              {item.symptoms.map((sym: any, i: number) => (
                <Text key={i} style={styles.symptomText}>
                  •{" "}
                  {language === "en"
                    ? sym.symptom
                    : symptomTranslation[sym.symptom] || sym.symptom}{" "}
                  -{" "}
                  {language === "en" ? "Intensity" : "गंभीरता"}: {sym.intensity}
                </Text>
              ))}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>
          {language === "en" ? "+ Add New Symptom" : "+ नया लक्षण जोड़ें"}
        </Text>
      </TouchableOpacity>

      <SymptomsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        symptomsList={language === "en" ? symptomsListEn : symptomsListHi}
        heading={language === "en" ? "Select Symptoms" : "लक्षण चुनें"}
        language={language}
        preSelectedSymptoms={[]} // always fresh
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  noData: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  symptomCard: {
    backgroundColor: "#F5F3FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  symptomText: {
    color: "#333",
    fontSize: 14,
    marginTop: 4,
  },
  timeText: {
    fontWeight: "bold",
    color: "#7A39A3",
    marginBottom: 6,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#7A39A3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
});
