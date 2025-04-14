import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Heart,
  Activity,
  Wind,
  Stethoscope,
  TestTube,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const HomePage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState("about");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: "https://mediac.in/images/mediac.png" }}
            style={styles.bannerLogo}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Mediac</Text>
            <Text style={styles.bannerTagline}>
              A healthy lifestyle is the best way to prevent heart disease!
              🚴‍♂️🥗🚭
            </Text>
          </View>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image
            source={{ uri: "https://mediac.in/images/health1.jpg" }}
            style={styles.galleryImage}
          />
          <Image
            source={{ uri: "https://mediac.in/images/health2.jpg" }}
            style={styles.galleryImage}
          />
          <Image
            source={{ uri: "https://mediac.in/images/health3.jpg" }}
            style={styles.galleryImage}
          />
        </View>

        {/* Accordion Sections */}
        <View style={styles.accordionContainer}>
          {/* About CAD Section */}
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              expandedSection === "about" && styles.accordionHeaderActive,
            ]}
            onPress={() => toggleSection("about")}
          >
            <View style={styles.accordionTitleContainer}>
              <Heart
                color={expandedSection === "about" ? "#fff" : "#6366f1"}
                size={20}
              />
              <Text
                style={[
                  styles.accordionTitle,
                  expandedSection === "about" && styles.accordionTitleActive,
                ]}
              >
                ABOUT CORONARY ARTERY DISEASE
              </Text>
            </View>
            {expandedSection === "about" ? (
              <ChevronUp color="#fff" size={20} />
            ) : (
              <ChevronDown color="#6366f1" size={20} />
            )}
          </TouchableOpacity>

          {expandedSection === "about" && (
            <View style={styles.accordionContent}>
              <Text style={styles.description}>
                Coronary Artery Disease (CAD) is a heart condition where the
                blood vessels that supply oxygen to the heart (coronary
                arteries) become narrow or blocked because of a buildup of fat,
                cholesterol, and other substances, forming plaques. When the
                arteries become too narrow, the heart doesn't get enough
                oxygen-rich blood, leading to chest pain (angina), shortness of
                breath, or even a heart attack.
              </Text>
            </View>
          )}

          {/* Causes Section */}
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              expandedSection === "causes" && styles.accordionHeaderActive,
            ]}
            onPress={() => toggleSection("causes")}
          >
            <View style={styles.accordionTitleContainer}>
              <AlertTriangle
                color={expandedSection === "causes" ? "#fff" : "#f59e0b"}
                size={20}
              />
              <Text
                style={[
                  styles.accordionTitle,
                  expandedSection === "causes" && styles.accordionTitleActive,
                ]}
              >
                WHAT CAUSES CAD?
              </Text>
            </View>
            {expandedSection === "causes" ? (
              <ChevronUp color="#fff" size={20} />
            ) : (
              <ChevronDown color="#f59e0b" size={20} />
            )}
          </TouchableOpacity>

          {expandedSection === "causes" && (
            <View style={styles.accordionContent}>
              <View style={styles.causeItem}>
                <Text style={styles.causeIcon}>⚠️</Text>
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>Unhealthy Diet</Text>
                  <Text style={styles.causeDescription}>
                    Too much fatty, fried, or processed food
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Text style={styles.causeIcon}>🚬</Text>
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>Smoking</Text>
                  <Text style={styles.causeDescription}>
                    Damages blood vessels
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Activity color="#3b82f6" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>Lack of Exercise</Text>
                  <Text style={styles.causeDescription}>
                    Leads to weight gain and heart strain
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Heart color="#ef4444" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>High Blood Pressure</Text>
                  <Text style={styles.causeDescription}>
                    Increases stress on arteries
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Text style={styles.causeIcon}>🧈</Text>
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>High Cholesterol</Text>
                  <Text style={styles.causeDescription}>
                    Leads to plaque buildup
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Wind color="#8b5cf6" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>Stress</Text>
                  <Text style={styles.causeDescription}>
                    Can contribute to high blood pressure
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Stethoscope color="#10b981" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>Family History</Text>
                  <Text style={styles.causeDescription}>
                    Higher risk if relatives had heart disease
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Symptoms Section */}
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              expandedSection === "symptoms" && styles.accordionHeaderActive,
            ]}
            onPress={() => toggleSection("symptoms")}
          >
            <View style={styles.accordionTitleContainer}>
              <AlertTriangle
                color={expandedSection === "symptoms" ? "#fff" : "#ef4444"}
                size={20}
              />
              <Text
                style={[
                  styles.accordionTitle,
                  expandedSection === "symptoms" && styles.accordionTitleActive,
                ]}
              >
                COMMON SYMPTOMS OF CAD
              </Text>
            </View>
            {expandedSection === "symptoms" ? (
              <ChevronUp color="#fff" size={20} />
            ) : (
              <ChevronDown color="#ef4444" size={20} />
            )}
          </TouchableOpacity>

          {expandedSection === "symptoms" && (
            <View style={styles.accordionContent}>
              <View style={styles.symptomItem}>
                <Heart color="#ef4444" size={20} />
                <View style={styles.symptomTextContainer}>
                  <Text style={styles.symptomName}>Chest pain (Angina)</Text>
                  <Text style={styles.symptomDescription}>
                    A tight, squeezing, or burning feeling in the chest,
                    especially during activity or stress.
                  </Text>
                </View>
              </View>

              <View style={styles.symptomItem}>
                <Wind color="#3b82f6" size={20} />
                <View style={styles.symptomTextContainer}>
                  <Text style={styles.symptomName}>Shortness of Breath</Text>
                  <Text style={styles.symptomDescription}>
                    Feeling breathless even with light activity.
                  </Text>
                </View>
              </View>

              <View style={styles.symptomItem}>
                <Text style={styles.symptomIcon}>⚠️</Text>
                <View style={styles.symptomTextContainer}>
                  <Text style={styles.symptomName}>Heart Attack Signs</Text>
                  <Text style={styles.symptomDescription}>
                    Severe chest pain, sweating, nausea, dizziness, and pain in
                    the left arm, jaw, or back.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Diagnosis Section */}
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              expandedSection === "diagnosis" && styles.accordionHeaderActive,
            ]}
            onPress={() => toggleSection("diagnosis")}
          >
            <View style={styles.accordionTitleContainer}>
              <TestTube
                color={expandedSection === "diagnosis" ? "#fff" : "#8b5cf6"}
                size={20}
              />
              <Text
                style={[
                  styles.accordionTitle,
                  expandedSection === "diagnosis" &&
                    styles.accordionTitleActive,
                ]}
              >
                HOW IS CAD DIAGNOSED?
              </Text>
            </View>
            {expandedSection === "diagnosis" ? (
              <ChevronUp color="#fff" size={20} />
            ) : (
              <ChevronDown color="#8b5cf6" size={20} />
            )}
          </TouchableOpacity>

          {expandedSection === "diagnosis" && (
            <View style={styles.accordionContent}>
              <View style={styles.diagnosisItem}>
                <Stethoscope color="#3b82f6" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>
                    ECG (Electrocardiogram)
                  </Text>
                  <Text style={styles.diagnosisDescription}>
                    Checks heart rhythm.
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <TestTube color="#ef4444" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>Blood Tests</Text>
                  <Text style={styles.diagnosisDescription}>
                    Look for signs of heart damage.
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <Activity color="#8b5cf6" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>Stress Test</Text>
                  <Text style={styles.diagnosisDescription}>
                    Measures how the heart works under activity.
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <ShieldCheck color="#f59e0b" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>Angiography</Text>
                  <Text style={styles.diagnosisDescription}>
                    Special X-ray to see blockages in heart arteries.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Treatment Section */}
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              expandedSection === "treatment" && styles.accordionHeaderActive,
            ]}
            onPress={() => toggleSection("treatment")}
          >
            <View style={styles.accordionTitleContainer}>
              <Heart
                color={expandedSection === "treatment" ? "#fff" : "#10b981"}
                size={20}
              />
              <Text
                style={[
                  styles.accordionTitle,
                  expandedSection === "treatment" &&
                    styles.accordionTitleActive,
                ]}
              >
                TREATMENT
              </Text>
            </View>
            {expandedSection === "treatment" ? (
              <ChevronUp color="#fff" size={20} />
            ) : (
              <ChevronDown color="#10b981" size={20} />
            )}
          </TouchableOpacity>

          {expandedSection === "treatment" && (
            <View style={styles.accordionContent}>
              <View style={styles.treatmentSection}>
                <View style={styles.treatmentHeader}>
                  <Text style={styles.treatmentType}>LIFESTYLE CHANGES</Text>
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentItem}>
                    • Eat more fruits, vegetables, and whole grains 🥗
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Avoid fried and junk foods 🍟
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Exercise at least 30 minutes a day 🏃‍♂️💃
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Quit smoking 🚭 and limit alcohol 🍷
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Manage stress through yoga, meditation, or hobbies 🧘‍♂️🎨
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentHeader}>
                  <Text style={styles.treatmentType}>MEDICATIONS</Text>
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentItem}>
                    • Blood thinners to prevent clots.
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Cholesterol-lowering drugs to reduce plaque buildup.
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Blood pressure medications to ease the heart's workload.
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Nitrates to relieve chest pain.
                  </Text>
                </View>
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentHeader}>
                  <Text style={styles.treatmentType}>
                    MEDICAL PROCEDURES (IF NEEDED)
                  </Text>
                </View>
                <View style={styles.treatmentContent}>
                  <Text style={styles.treatmentItem}>
                    • Angioplasty & Stents – Opens blocked arteries.
                  </Text>
                  <Text style={styles.treatmentItem}>
                    • Bypass Surgery – Creates a new path for blood flow around
                    blocked arteries.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Emergency Alert */}
        <View style={styles.emergencyAlert}>
          <AlertTriangle color="#fff" size={24} style={styles.alertIcon} />
          <Text style={styles.alertText}>
            If you have chest pain or other symptoms, see a doctor immediately.
            Early detection saves lives! ❤️
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
    marginTop: 16,
  },
  banner: {
    backgroundColor: "#4f46e5",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  bannerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerTagline: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 4,
  },
  imageGallery: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  galleryImage: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: 12,
  },
  accordionContainer: {
    padding: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  accordionHeaderActive: {
    backgroundColor: "#6366f1",
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#1f2937",
  },
  accordionTitleActive: {
    color: "#fff",
  },
  accordionContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: -4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
  },
  causeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  causeIcon: {
    fontSize: 20,
    width: 24,
    textAlign: "center",
  },
  causeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  causeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  causeDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  symptomItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  symptomIcon: {
    fontSize: 20,
    width: 24,
    textAlign: "center",
  },
  symptomTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  symptomDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  diagnosisItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  diagnosisTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  diagnosisName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  diagnosisDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  treatmentSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  treatmentHeader: {
    backgroundColor: "#f3f4f6",
    padding: 12,
  },
  treatmentType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  treatmentContent: {
    padding: 12,
  },
  treatmentItem: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
    lineHeight: 20,
  },
  emergencyAlert: {
    backgroundColor: "#ef4444",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  alertIcon: {
    marginRight: 12,
  },
  alertText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
});

export default HomePage;
