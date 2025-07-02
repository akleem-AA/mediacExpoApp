"use client";

import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Globe } from "lucide-react-native";
import { Stack } from "expo-router";

const { width } = Dimensions.get("window");

// English text content
const englishText = {
  content: `Coronary Artery Disease (CAD) remains one of the leading causes of morbidity and mortality worldwide. Managing CAD effectively requires more than just medication—it involves a holistic approach, including lifestyle modification, regular monitoring, diet control, physical activity, and strict adherence to prescribed treatment plans.

To support patients in their journey toward better heart health, "Mediac" has been developed as a comprehensive digital tool tailored specifically for individuals living with CAD. This user-friendly mobile application is designed to empower patients by integrating essential features for self-care, education, and monitoring into one platform.

The app provides:
✓ Personalized Medication reminders to improve adherence
✓ Daily logs for Blood Pressure, Heart Rate, Blood Sugar, Weight, BMI and Symptoms
✓ Dietary recommendations based on heart-healthy nutrition principles
✓ Goal setting and tracking for exercises
✓ Educational resources on CAD, Risk factors, Symptom recognition, and Emergency response
✓ Motivational alerts to encourage long-term engagement

By combining technology with evidence-based cardiac rehabilitation strategies, Mediac aims to enhance patient outcomes, reduce hospital readmissions, and promote a proactive role in heart disease management.

Whether newly diagnosed or managing chronic CAD, this app serves as a daily guide and support system, helping patients take control of their heart health—anytime, anywhere.`,
};

// Hindi text content
const hindiText = {
  content: `कोरोनरी धमनी रोग (सीएडी) दुनिया भर में रुग्णता और मृत्यु दर के प्रमुख कारणों में से एक है। सीएडी को प्रभावी ढंग से प्रबंधित करने के लिए केवल दवा से अधिक की आवश्यकता होती है - इसमें जीवनशैली में बदलाव, नियमित निगरानी, ​​आहार नियंत्रण, शारीरिक गतिविधि और निर्धारित उपचार योजनाओं का सख्ती से पालन करने सहित एक समग्र दृष्टिकोण शामिल है।

बेहतर हृदय स्वास्थ्य की ओर अपने सफर में रोगियों का समर्थन करने के लिए, "MEDIAC" को सीएडी से पीड़ित व्यक्तियों के लिए विशेष रूप से तैयार एक व्यापक डिजिटल उपकरण के रूप में विकसित किया गया है। यह उपयोगकर्ता के अनुकूल मोबाइल एप्लिकेशन स्व-देखभाल, शिक्षा और निगरानी के लिए आवश्यक सुविधाओं को एक मंच पर एकीकृत करके रोगियों को सशक्त बनाने के लिए डिज़ाइन किया गया है।

ऐप प्रदान करता है:
✓ अनुपालन में सुधार के लिए व्यक्तिगत दवा अनुस्मारक
✓ रक्तचाप, हृदय गति, रक्त शर्करा, वजन, बीएमआई और लक्षणों के लिए दैनिक लॉग
✓ हृदय-स्वस्थ पोषण सिद्धांतों पर आधारित आहार संबंधी सिफारिशें
✓ व्यायाम के लिए लक्ष्य निर्धारण और ट्रैकिंग
✓ सीएडी, जोखिम कारक, लक्षण पहचान और आपातकालीन प्रतिक्रिया पर शैक्षिक संसाधन
✓ दीर्घकालिक जुड़ाव को प्रोत्साहित करने के लिए प्रेरक अलर्ट

प्रौद्योगिकी को साक्ष्य-आधारित हृदय पुनर्वास रणनीतियों के साथ जोड़कर, MEDIAC का उद्देश्य रोगी के परिणामों को बढ़ाना, अस्पताल में दोबारा भर्ती होने की संख्या को कम करना और हृदय रोग प्रबंधन में सक्रिय भूमिका को बढ़ावा देना है।

चाहे हाल ही में निदान किया गया हो या क्रोनिक सीएडी का प्रबंधन किया गया हो, यह ऐप एक दैनिक मार्गदर्शक और सहायता प्रणाली के रूप में कार्य करता है, जो रोगियों को उनके हृदय स्वास्थ्य को नियंत्रित करने में मदद करता है - कभी भी, कहीं भी।`,
};

const AboutUs: React.FC = () => {
  const [isHindi, setIsHindi] = useState(false);
  const navigation = useNavigation();

  const toggleLanguage = () => {
    setIsHindi((prev) => !prev);
  };

  const text = isHindi ? hindiText : englishText;

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
          <Text style={{ paddingRight: 10 }}>{isHindi ? "En" : "हिंदी"}</Text>
          <Globe size={24} color="#000" />
        </TouchableOpacity>
      ),
      title: isHindi ? "हमारे बारे में" : "About Us",
      headerStyle: {
        backgroundColor: "#ffffff",
      },
      headerTitleStyle: {
        color: "#000000",
      },
    });
  }, [navigation, isHindi]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerBackTitle: !isHindi ? "Back" : "पीछे", // Text shown on back button (iOS only)
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.contentText}>{text.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1f2937", // Tailwind's gray-800
    textAlign: "left",
  },
});

export default AboutUs;
