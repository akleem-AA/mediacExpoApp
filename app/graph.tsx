import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { getToken } from "@/services/auth";
import { API_URL } from "@/constants/Api";
import { useDecodedToken } from "@/hooks/useDecodedToken";
import { Globe } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;

const GraphScreen = () => {
  const user = useDecodedToken();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isHindi, setIsHindi] = useState(false); // language toggle
  const navigation = useNavigation();
  const [typeLabels, setTypeLabels] = useState<string[]>([]);

  type ChartData = {
    labels: string[];
    datasets: {
      data: number[];
      color: () => string;
      strokeWidth: number;
      label: string;
    }[];
    legend: string[];
  };

  const getUserId = async () => {
    return user?.userId;
  };

  const translateDate = (dateString: string, isHindi: boolean) => {
    try {
      // Convert "21 August, 25" → split into day, month, year
      const [day, month, year] = dateString.replace(",", "").split(" ");

      const monthsShort: { [key: string]: { en: string; hi: string } } = {
        January: { en: "Jan", hi: "जन" },
        February: { en: "Feb", hi: "फ़र" },
        March: { en: "Mar", hi: "मार्च" },
        April: { en: "Apr", hi: "अप्रै" },
        May: { en: "May", hi: "मई" },
        June: { en: "Jun", hi: "जून" },
        July: { en: "Jul", hi: "जुल" },
        August: { en: "Aug", hi: "अग" },
        September: { en: "Sep", hi: "सितं" },
        October: { en: "Oct", hi: "अक्टू" },
        November: { en: "Nov", hi: "नवं" },
        December: { en: "Dec", hi: "दिसं" },
      };

      // Format short date: "9 Aug 25" or "9 अग 25"
      const shortMonth = isHindi
        ? monthsShort[month]?.hi
        : monthsShort[month]?.en;
      return `${Number(day)} ${shortMonth} ${year}`;
    } catch (error) {
      console.error("Date translation error:", error);
      return dateString; // fallback
    }
  };

  const toggleLanguage = () => setIsHindi((prev) => !prev);

  // Configure header with translation button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleLanguage}
          style={{
            marginRight: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ paddingRight: 8, fontWeight: "600" }}>
            {isHindi ? "En" : "हिंदी"}
          </Text>
          <Globe size={22} color="#000" />
        </TouchableOpacity>
      ),
      title: isHindi ? "ग्राफ़" : "Graph",
      headerStyle: {
        backgroundColor: "#ffffff",
      },
      headerTitleStyle: {
        color: "#000000",
      },
    });
  }, [navigation, isHindi]);

  const getMeasurementTypeValue = (type: any) => {
    switch (type) {
      case "fasting":
        return 1;
      case "before_meal":
        return 2;
      case "after_meal":
        return 3;
      default:
        return 1;
    }
  };

  const fetchGraphData = async () => {
    setLoading(true);
    setErrorMessage("");
    setNoData(false);

    try {
      const token = await getToken();
      const userId = await getUserId();
      const response = await axios.get(
        `${API_URL}/patients/previousReading/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Graph data fetched:", data);
      const graphTitle = title?.toLowerCase();

      if (graphTitle === "blood pressure") {
        const bp = data?.bp || [];
        if (bp.length === 0) return setNoData(true);

        const labels = bp.map((entry: any) =>
          translateDate(entry.date, isHindi)
        );
        const systolic = bp.map((entry: any) => Number(entry.systolic));
        const diastolic = bp.map((entry: any) => Number(entry.diastolic));
        const pulse = bp.map((entry: any) => Number(entry.pulse));

        setChartData({
          labels,
          datasets: [
            {
              data: systolic,
              color: () => "#FF6384",
              strokeWidth: 2,
              label: "Systolic",
            },
            {
              data: diastolic,
              color: () => "#36A2EB",
              strokeWidth: 2,
              label: "Diastolic",
            },
            {
              data: pulse,
              color: () => "#4BC0C0",
              strokeWidth: 2,
              label: "Pulse",
            },
          ],
          legend: isHindi
            ? ["सिस्टोलिक", "डायस्टोलिक", "नाड़ी"]
            : ["Systolic", "Diastolic", "Pulse"],
        });
      } else if (graphTitle === "blood sugar") {
        const bs = data?.bs || [];
        if (bs.length === 0) return setNoData(true);

        const typeLabelsMap: any = {
          "1": isHindi ? "उपवास" : "Fasting",
          "2": isHindi ? "भोजन से पहले" : "Before Meal",
          "3": isHindi ? "भोजन के बाद" : "After Meal",
        };

        const labels: string[] = [];
        const types: string[] = [];

        bs.forEach((entry: any) => {
          try {
            const [day, month, year] = entry.date.replace(",", "").split(" ");
            const monthsShort: { [key: string]: string } = {
              January: "Jan",
              February: "Feb",
              March: "Mar",
              April: "Apr",
              May: "May",
              June: "Jun",
              July: "Jul",
              August: "Aug",
              September: "Sep",
              October: "Oct",
              November: "Nov",
              December: "Dec",
            };
            const shortDate = `${Number(day)} ${monthsShort[month]} ${year}`;
            labels.push(shortDate);

            const typeLabel = typeLabelsMap[entry.type] || typeLabelsMap["1"];
            types.push(typeLabel);
          } catch (err) {
            labels.push(entry.date);
            types.push("");
          }
        });

        const values = bs.map((entry: any) => Number(entry.value));

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              color: () => "#7A39A3",
              strokeWidth: 2,
              label: "Blood Sugar",
            },
          ],
          legend: [isHindi ? "रक्त शर्करा" : "Blood Sugar"],
        });

        setTypeLabels(types); // 👈 store separately
      } else if (graphTitle === "weight") {
        const weight = data?.weight || [];
        if (weight.length === 0) return setNoData(true);

        const labels = weight.map((entry: any) =>
          translateDate(entry.date, isHindi)
        );
        const values = weight.map((entry: any) => Number(entry.value));

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              color: () => "#FFA500",
              strokeWidth: 2,
              label: "Weight",
            },
          ],
          legend: [isHindi ? "वज़न" : "Weight"],
        });
      } else if (graphTitle === "height") {
        const height = data?.height || [];
        if (height.length === 0) return setNoData(true);

        const labels = height.map((entry: any) =>
          translateDate(entry.date, isHindi)
        );
        const values = height.map((entry: any) => Number(entry.value));

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              color: () => "#2E8B57",
              strokeWidth: 2,
              label: "Height",
            },
          ],
          legend: [isHindi ? "ऊँचाई" : "Height"],
        });
      } else if (graphTitle === "bmi") {
        const bmi = data?.bmi || [];
        if (bmi.length === 0) return setNoData(true);

        const labels = bmi.map((entry: any) =>
          translateDate(entry.date, isHindi)
        );
        const values = bmi.map((entry: any) => Number(entry.value));

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              color: () => "#8B0000",
              strokeWidth: 2,
              label: "BMI",
            },
          ],
          legend: [isHindi ? "बीएमआई" : "BMI"],
        });
      } else {
        setNoData(true);
      }
    } catch (error: any) {
      console.error("Error fetching graph data:", error);
      setErrorMessage(
        isHindi
          ? "कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।"
          : "Something went wrong. Please try again later."
      );
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchGraphData();
    }
  }, [user?.userId, isHindi]); // re-fetch when language changes

  const chartWidth = Math.max(
    screenWidth,
    (chartData?.labels.length || 1) * 100
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isHindi ? "ग्राफ़" : title || "Graph",
          headerBackTitle: isHindi ? "वापस" : "Back",
        }}
      />
      <Text style={styles.title}>
        {isHindi ? `${title} चार्ट` : `${title} Chart`}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : noData ? (
        <View style={styles.graphBox}>
          <Text style={styles.noDataText}>
            {errorMessage ||
              (isHindi
                ? "दिखाने के लिए कोई डेटा उपलब्ध नहीं है।"
                : "No data available to display.")}
          </Text>
        </View>
      ) : (
        <View style={styles.graphBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <LineChart
                data={chartData || { labels: [], datasets: [] }}
                width={chartWidth}
                height={350}
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#007AFF",
                  },
                }}
                bezier
                withVerticalLabels
                withHorizontalLabels
                style={styles.chart}
              />

              {/* 👇 Extra row for TypeLabels */}
              {/* {typeLabels?.length > 0 && (
                <View style={[styles.typeLabelRow]}>
                  {typeLabels.map((label, idx) => (
                    <Text key={idx} style={[styles.typeLabel,{width: chartWidth/5}]}>
                      {label}
                    </Text>
                  ))}
                </View>
              )} */}
              {typeLabels?.length > 0 && (
                <View style={[styles.typeLabelRow, { width: chartWidth }]}>
                  {typeLabels.map((label, idx) => (
                    <Text
                      key={idx}
                      style={[
                        styles.typeLabel,
                        { width: chartWidth / typeLabels.length },
                      ]}
                    >
                      {label}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default GraphScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: "#F8F9FB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  graphBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  chart: {
    borderRadius: 12,
    // borderWidth: 1,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    paddingVertical: 30,
  },
  typeLabelRow: {
    flexDirection: "row",
  },
  typeLabel: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    paddingVertical: 4,
  },
});
