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

const screenWidth = Dimensions.get("window").width;

const GraphScreen = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { title } = useLocalSearchParams<{ title?: string }>();
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

  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Simulate API call
  const fetchGraphData = async () => {
    setLoading(true);
    try {
      // Simulated API data (replace with your real API)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve([
            { date: "Jun 1", value: 120 },
            { date: "Jun 5", value: 118 },
            { date: "Jun 10", value: 115 },
            { date: "Jun 15", value: 130 },
            { date: "Jun 20", value: 125 },
            { date: "Jun 25", value: 122 },
            { date: "Jun 30", value: 121 },
            { date: "Jul 5", value: 117 },
            { date: "Jul 10", value: 119 },
            { date: "Jul 15", value: 123 },
            { date: "Jul 20", value: 128 },
            { date: "Jul 25", value: 126 },
          ]);
        }, 1000)
      );

      const data = response as { date: string; value: number }[];

      setLabels(data.map((item) => item.date));
      setValues(data.map((item) => item.value));
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);
  const apiResponse = {
    status: "ok",
    bp: [
      {
        date: "25 June, 25",
        systolic: 101,
        diastolic: 80,
        pulse: 72,
      },
      {
        date: "26 June, 25",
        systolic: 102,
        diastolic: 82,
        pulse: 72,
      },
      {
        date: "27 June, 25",
        systolic: 103,
        diastolic: 86,
        pulse: 70,
      },
    ],
  };

  useEffect(() => {
    const bp = apiResponse.bp;

    const labels = bp.map((entry) => entry.date);
    const systolic = bp.map((entry) => entry.systolic);
    const diastolic = bp.map((entry) => entry.diastolic);
    const pulse = bp.map((entry) => entry.pulse);

    setChartData({
      labels: labels,
      datasets: [
        {
          data: systolic,
          color: () => "#FF6384", // red
          strokeWidth: 2,
          label: "Systolic",
        },
        {
          data: diastolic,
          color: () => "#36A2EB", // blue
          strokeWidth: 2,
          label: "Diastolic",
        },
        {
          data: pulse,
          color: () => "#4BC0C0", // green
          strokeWidth: 2,
          label: "Pulse",
        },
      ],
      legend: ["Systolic", "Diastolic", "Pulse"],
    });
  }, []);

  const chartWidth = Math.max(screenWidth, labels.length * 60);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: title || "Graph", // Header title
          headerBackTitle: "Back", // Text shown on back button (iOS only)
        }}
      />
      <Text style={styles.title}>{title + " " + " Chart"}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View style={styles.graphBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              //   data={{
              //     labels,
              //     datasets: [
              //       {
              //         data: values,
              //         color: () => "#007AFF",
              //         strokeWidth: 2,
              //       },
              //     ],
              //   }}
              data={
                chartData || {
                  labels: [],
                  datasets: [],
                }
              }
              width={chartWidth}
              height={350}
              yAxisSuffix=" v"
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
  },
  chart: {
    borderRadius: 12,
  },
});
