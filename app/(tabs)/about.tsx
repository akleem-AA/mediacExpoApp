"use client";

import type React from "react";
import { useState } from "react";
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

// English text content
const englishText = {
  bannerTagline:
    "A healthy lifestyle is the best way to prevent heart disease! 🚴‍♂️🥗🚭",
  aboutTitle: "ABOUT CORONARY ARTERY DISEASE",
  aboutContent:
    "Coronary Artery Disease (CAD) is a heart condition where the blood vessels that supply oxygen to the heart (coronary arteries) become narrow or blocked because of a buildup of fat, cholesterol, and other substances, forming plaques. When the arteries become too narrow, the heart doesn't get enough oxygen-rich blood, leading to chest pain (angina), shortness of breath, or even a heart attack.",
  causesTitle: "WHAT CAUSES CAD?",
  causes: {
    unhealthyDiet: {
      name: "Unhealthy Diet",
      description: "Too much fatty, fried, or processed food",
    },
    smoking: {
      name: "Smoking",
      description: "Damages blood vessels",
    },
    lackOfExercise: {
      name: "Lack of Exercise",
      description: "Leads to weight gain and heart strain",
    },
    highBloodPressure: {
      name: "High Blood Pressure",
      description: "Increases stress on arteries",
    },
    highCholesterol: {
      name: "High Cholesterol",
      description: "Leads to plaque buildup",
    },
    stress: {
      name: "Stress",
      description: "Can contribute to high blood pressure",
    },
    familyHistory: {
      name: "Family History",
      description: "Higher risk if relatives had heart disease",
    },
  },
  symptomsTitle: "COMMON SYMPTOMS OF CAD",
  symptoms: {
    chestPain: {
      name: "Chest pain (Angina)",
      description:
        "A tight, squeezing, or burning feeling in the chest, especially during activity or stress.",
    },
    shortnessOfBreath: {
      name: "Shortness of Breath",
      description: "Feeling breathless even with light activity.",
    },
    heartAttackSigns: {
      name: "Heart Attack Signs",
      description:
        "Severe chest pain, sweating, nausea, dizziness, and pain in the left arm, jaw, or back.",
    },
  },
  diagnosisTitle: "HOW IS CAD DIAGNOSED?",
  diagnosis: {
    ecg: {
      name: "ECG (Electrocardiogram)",
      description: "Checks heart rhythm.",
    },
    bloodTests: {
      name: "Blood Tests",
      description: "Look for signs of heart damage.",
    },
    stressTest: {
      name: "Stress Test",
      description: "Measures how the heart works under activity.",
    },
    angiography: {
      name: "Angiography",
      description: "Special X-ray to see blockages in heart arteries.",
    },
  },
  treatmentTitle: "TREATMENT",
  treatment: {
    lifestyleChanges: {
      title: "LIFESTYLE CHANGES",
      items: [
        "• Eat more fruits, vegetables, and whole grains 🥗",
        "• Avoid fried and junk foods 🍟",
        "• Exercise at least 30 minutes a day 🏃‍♂️💃",
        "• Quit smoking 🚭 and limit alcohol 🍷",
        "• Manage stress through yoga, meditation, or hobbies 🧘‍♂️🎨",
      ],
    },
    medications: {
      title: "MEDICATIONS",
      items: [
        "• Blood thinners to prevent clots.",
        "• Cholesterol-lowering drugs to reduce plaque buildup.",
        "• Blood pressure medications to ease the heart's workload.",
        "• Nitrates to relieve chest pain.",
      ],
    },
    procedures: {
      title: "MEDICAL PROCEDURES (IF NEEDED)",
      items: [
        "• Angioplasty & Stents – Opens blocked arteries.",
        "• Bypass Surgery – Creates a new path for blood flow around blocked arteries.",
      ],
    },
  },
  emergencyAlert:
    "If you have chest pain or other symptoms, see a doctor immediately. Early detection saves lives! ❤️",
  translateButton: "हिंदी में अनुवाद करें",
};

// Hindi text content
const hindiText = {
  bannerTagline:
    "हृदय रोग को रोकने का सबसे अच्छा तरीका है स्वस्थ जीवनशैली! 🚴‍♂️🥗🚭",
  aboutTitle: "कोरोनरी आर्टरी डिजीज के बारे में",
  aboutContent:
    "कोरोनरी आर्टरी डिजीज (CAD) एक हृदय स्थिति है जहां हृदय को ऑक्सीजन की आपूर्ति करने वाली रक्त वाहिकाएं (कोरोनरी धमनियां) वसा, कोलेस्ट्रॉल और अन्य पदार्थों के जमा होने के कारण संकीर्ण या अवरुद्ध हो जाती हैं, जिससे प्लाक बनता है। जब धमनियां बहुत संकीर्ण हो जाती हैं, तो हृदय को पर्याप्त ऑक्सीजन युक्त रक्त नहीं मिलता, जिससे छाती में दर्द (एंजाइना), सांस की तकलीफ, या यहां तक कि दिल का दौरा भी पड़ सकता है।",
  causesTitle: "CAD के कारण क्या हैं?",
  causes: {
    unhealthyDiet: {
      name: "अस्वास्थ्यकर आहार",
      description: "अधिक वसायुक्त, तला हुआ, या प्रसंस्कृत खाद्य पदार्थ",
    },
    smoking: {
      name: "धूम्रपान",
      description: "रक्त वाहिकाओं को नुकसान पहुंचाता है",
    },
    lackOfExercise: {
      name: "व्यायाम की कमी",
      description: "वजन बढ़ने और हृदय पर तनाव का कारण बनता है",
    },
    highBloodPressure: {
      name: "उच्च रक्तचाप",
      description: "धमनियों पर तनाव बढ़ाता है",
    },
    highCholesterol: {
      name: "उच्च कोलेस्ट्रॉल",
      description: "प्लाक के निर्माण का कारण बनता है",
    },
    stress: {
      name: "तनाव",
      description: "उच्च रक्तचाप में योगदान कर सकता है",
    },
    familyHistory: {
      name: "पारिवारिक इतिहास",
      description: "अगर रिश्तेदारों को हृदय रोग था तो अधिक जोखिम",
    },
  },
  symptomsTitle: "CAD के सामान्य लक्षण",
  symptoms: {
    chestPain: {
      name: "छाती में दर्द (एंजाइना)",
      description:
        "छाती में कसा हुआ, निचोड़ने वाला, या जलन वाला अहसास, विशेष रूप से गतिविधि या तनाव के दौरान।",
    },
    shortnessOfBreath: {
      name: "सांस की तकलीफ",
      description: "हल्की गतिविधि के साथ भी सांस फूलना।",
    },
    heartAttackSigns: {
      name: "दिल के दौरे के संकेत",
      description:
        "छाती में तेज दर्द, पसीना, मतली, चक्कर आना, और बाएं हाथ, जबड़े, या पीठ में दर्द।",
    },
  },
  diagnosisTitle: "CAD का निदान कैसे किया जाता है?",
  diagnosis: {
    ecg: {
      name: "ईसीजी (इलेक्ट्रोकार्डियोग्राम)",
      description: "हृदय की लय की जांच करता है।",
    },
    bloodTests: {
      name: "रक्त परीक्षण",
      description: "हृदय क्षति के संकेतों की तलाश करता है।",
    },
    stressTest: {
      name: "स्ट्रेस टेस्ट",
      description: "गतिविधि के दौरान हृदय कैसे काम करता है, इसका मापन करता है।",
    },
    angiography: {
      name: "एंजियोग्राफी",
      description: "हृदय धमनियों में रुकावटों को देखने के लिए विशेष एक्स-रे।",
    },
  },
  treatmentTitle: "उपचार",
  treatment: {
    lifestyleChanges: {
      title: "जीवनशैली में परिवर्तन",
      items: [
        "• अधिक फल, सब्जियां और साबुत अनाज खाएं 🥗",
        "• तले हुए और जंक फूड से बचें 🍟",
        "• प्रतिदिन कम से कम 30 मिनट व्यायाम करें 🏃‍♂️💃",
        "• धूम्रपान छोड़ें 🚭 और शराब सीमित करें 🍷",
        "• योग, ध्यान, या शौक के माध्यम से तनाव का प्रबंधन करें 🧘‍♂️🎨",
      ],
    },
    medications: {
      title: "दवाएं",
      items: [
        "• रक्त को पतला करने वाली दवाएं थक्के को रोकने के लिए।",
        "• कोलेस्ट्रॉल कम करने वाली दवाएं प्लाक निर्माण को कम करने के लिए।",
        "• रक्तचाप की दवाएं हृदय के कार्यभार को कम करने के लिए।",
        "• नाइट्रेट्स छाती के दर्द को राहत देने के लिए।",
      ],
    },
    procedures: {
      title: "चिकित्सा प्रक्रियाएं (यदि आवश्यक हो)",
      items: [
        "• एंजियोप्लास्टी और स्टेंट - अवरुद्ध धमनियों को खोलता है।",
        "• बाईपास सर्जरी - अवरुद्ध धमनियों के चारों ओर रक्त प्रवाह के लिए एक नया मार्ग बनाता है।",
      ],
    },
  },
  emergencyAlert:
    "यदि आपको छाती में दर्द या अन्य लक्षण हैं, तो तुरंत डॉक्टर से मिलें। शीघ्र पता लगाने से जीवन बचता है! ❤️",
  translateButton: "Translate to English",
};

const HomePage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState("about");
  const [isHindi, setIsHindi] = useState(false);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const toggleLanguage = () => {
    setIsHindi(!isHindi);
  };

  // Select the appropriate text based on current language
  const text = isHindi ? hindiText : englishText;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Toggle Button */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Mediac</Text>
            <TouchableOpacity
              style={styles.languageToggle}
              onPress={toggleLanguage}
            >
              <Text style={styles.languageToggleText}>
                {isHindi ? "EN" : "हिंदी"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: "https://mediac.in/images/mediac.png" }}
            style={styles.bannerLogo}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTagline}>{text.bannerTagline}</Text>
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
                {text.aboutTitle}
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
              <Text style={styles.description}>{text.aboutContent}</Text>
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
                {text.causesTitle}
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
                  <Text style={styles.causeName}>
                    {text.causes.unhealthyDiet.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.unhealthyDiet.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Text style={styles.causeIcon}>🚬</Text>
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.smoking.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.smoking.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Activity color="#3b82f6" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.lackOfExercise.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.lackOfExercise.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Heart color="#ef4444" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.highBloodPressure.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.highBloodPressure.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Text style={styles.causeIcon}>🧈</Text>
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.highCholesterol.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.highCholesterol.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Wind color="#8b5cf6" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.stress.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.stress.description}
                  </Text>
                </View>
              </View>

              <View style={styles.causeItem}>
                <Stethoscope color="#10b981" size={20} />
                <View style={styles.causeTextContainer}>
                  <Text style={styles.causeName}>
                    {text.causes.familyHistory.name}
                  </Text>
                  <Text style={styles.causeDescription}>
                    {text.causes.familyHistory.description}
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
                {text.symptomsTitle}
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
                  <Text style={styles.symptomName}>
                    {text.symptoms.chestPain.name}
                  </Text>
                  <Text style={styles.symptomDescription}>
                    {text.symptoms.chestPain.description}
                  </Text>
                </View>
              </View>

              <View style={styles.symptomItem}>
                <Wind color="#3b82f6" size={20} />
                <View style={styles.symptomTextContainer}>
                  <Text style={styles.symptomName}>
                    {text.symptoms.shortnessOfBreath.name}
                  </Text>
                  <Text style={styles.symptomDescription}>
                    {text.symptoms.shortnessOfBreath.description}
                  </Text>
                </View>
              </View>

              <View style={styles.symptomItem}>
                <Text style={styles.symptomIcon}>⚠️</Text>
                <View style={styles.symptomTextContainer}>
                  <Text style={styles.symptomName}>
                    {text.symptoms.heartAttackSigns.name}
                  </Text>
                  <Text style={styles.symptomDescription}>
                    {text.symptoms.heartAttackSigns.description}
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
                {text.diagnosisTitle}
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
                    {text.diagnosis.ecg.name}
                  </Text>
                  <Text style={styles.diagnosisDescription}>
                    {text.diagnosis.ecg.description}
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <TestTube color="#ef4444" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>
                    {text.diagnosis.bloodTests.name}
                  </Text>
                  <Text style={styles.diagnosisDescription}>
                    {text.diagnosis.bloodTests.description}
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <Activity color="#8b5cf6" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>
                    {text.diagnosis.stressTest.name}
                  </Text>
                  <Text style={styles.diagnosisDescription}>
                    {text.diagnosis.stressTest.description}
                  </Text>
                </View>
              </View>

              <View style={styles.diagnosisItem}>
                <ShieldCheck color="#f59e0b" size={20} />
                <View style={styles.diagnosisTextContainer}>
                  <Text style={styles.diagnosisName}>
                    {text.diagnosis.angiography.name}
                  </Text>
                  <Text style={styles.diagnosisDescription}>
                    {text.diagnosis.angiography.description}
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
                {text.treatmentTitle}
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
                  <Text style={styles.treatmentType}>
                    {text.treatment.lifestyleChanges.title}
                  </Text>
                </View>
                <View style={styles.treatmentContent}>
                  {text.treatment.lifestyleChanges.items.map((item, index) => (
                    <Text key={index} style={styles.treatmentItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentHeader}>
                  <Text style={styles.treatmentType}>
                    {text.treatment.medications.title}
                  </Text>
                </View>
                <View style={styles.treatmentContent}>
                  {text.treatment.medications.items.map((item, index) => (
                    <Text key={index} style={styles.treatmentItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.treatmentSection}>
                <View style={styles.treatmentHeader}>
                  <Text style={styles.treatmentType}>
                    {text.treatment.procedures.title}
                  </Text>
                </View>
                <View style={styles.treatmentContent}>
                  {text.treatment.procedures.items.map((item, index) => (
                    <Text key={index} style={styles.treatmentItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Emergency Alert */}
        <View style={styles.emergencyAlert}>
          <AlertTriangle color="#fff" size={24} style={styles.alertIcon} />
          <Text style={styles.alertText}>{text.emergencyAlert}</Text>
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
  header: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  languageToggle: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageToggleText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  banner: {
    backgroundColor: "#4f46e5",
    padding: 20,
    paddingTop: 0,
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
