import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Stack, useLocalSearchParams } from "expo-router";
import { getToken } from "@/services/auth";
import { API_URL } from "@/constants/Api";
import { useDecodedToken } from "@/hooks/useDecodedToken";

const screenWidth = Dimensions.get("window").width;

const GraphScreen = () => {
  const user = useDecodedToken();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const fetchGraphData = async () => {
    setLoading(true);
    setErrorMessage("");
    setNoData(false);

    try {
      const token = await getToken();
      const userId = await getUserId();
      console.log("User ID:", user?.userId);
      console.log("url:", `${API_URL}/patients/previousReading/${userId}`);
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

        const labels = bp.map((entry: any) => entry.date);
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
          legend: ["Systolic", "Diastolic", "Pulse"],
        });
      } else if (graphTitle === "blood sugar") {
        const bs = data?.bs || [];
        if (bs.length === 0) return setNoData(true);

        const labels = bs.map((entry: any) => entry.date);
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
          legend: ["Blood Sugar"],
        });
      } else if (graphTitle === "weight") {
        const weight = data?.weight || [];
        if (weight.length === 0) return setNoData(true);

        const labels = weight.map((entry: any) => entry.date);
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
          legend: ["Weight"],
        });
      } else if (graphTitle === "height") {
        const height = data?.height || [];
        if (height.length === 0) return setNoData(true);

        const labels = height.map((entry: any) => entry.date);
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
          legend: ["Height"],
        });
      } else {
        setNoData(true);
      }
    } catch (error: any) {
      console.error("Error fetching graph data:", error);
      setErrorMessage("Something went wrong. Please try again later.");
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchGraphData();
    }
  }, [user?.userId]);

  const chartWidth = Math.max(
    screenWidth,
    (chartData?.labels.length || 1) * 60
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: title || "Graph",
          headerBackTitle: "Back",
        }}
      />
      <Text style={styles.title}>{title + " Chart"}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : noData ? (
        <View style={styles.graphBox}>
          <Text style={styles.noDataText}>
            {errorMessage || "No data available to display."}
          </Text>
        </View>
      ) : (
        <View style={styles.graphBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    paddingVertical: 10,
    paddingHorizontal: 5,
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
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    paddingVertical: 30,
  },
});
