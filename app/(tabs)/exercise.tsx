"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { cardBackgroundColors } from "@/utils/utils";

// Exercise data
const exercises = [
  {
    id: "1",
    name: "Walking",
    category: "Cardio",
    difficulty: "Beginner",
    description_en:
      "1. Benefits: Improves circulation, strengthens the heart, and boosts stamina. 2. Tips: Start with short, flat walks (10–15 minutes) and slowly increase the time and pace over weeks. You can progress to brisk walking as tolerated.",
    description_hi:
      "1. लाभ: परिसंचरण में सुधार करता है, हृदय को मजबूत करता है, और सहनशक्ति को बढ़ाता है। 2. सुझाव: 10–15 मिनट की छोटी, समतल सैर से शुरू करें और धीरे-धीरे समय और गति बढ़ाएँ। जब सहन हो तो तेज़ चलना शुरू करें।",
    videoUrl: "https://mediac.in/video/Walking%20Video%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Walking",
  },
  {
    id: "2",
    name: "Neck Stretch",
    category: "Stretching",
    difficulty: "Beginner",
    description_en:
      "Description: Sit or stand upright. Gently tilt your head to one side, bringing your ear toward your shoulder. Hold for 10–15 seconds on each side.",
    description_hi:
      "विवरण: सीधे बैठें या खड़े हों। धीरे-धीरे सिर को एक ओर झुकाएं, जिससे कान कंधे की ओर जाए। प्रत्येक ओर 10–15 सेकंड के लिए पकड़ें।",
    videoUrl: "https://mediac.in/video/Neck%20Stretch%20(Pexels)(1).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Neck+Stretch",
  },
  {
    id: "3",
    name: "Shoulder Rotation",
    category: "Stretching",
    difficulty: "Beginner",
    description_en:
      "Description: Sit or stand with your back straight. Rotate your shoulders forward in a circular motion 5-10 times. Repeat rolling backward.",
    description_hi:
      "विवरण: सीधे बैठें या खड़े हों। अपने कंधों को आगे की ओर गोल घुमाएं, 5–10 बार। फिर पीछे की ओर घुमाएं।",
    videoUrl: "https://mediac.in/video/Shoulder%20Rotation%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Shoulder+Rotation",
  },
  {
    id: "4",
    name: "Arm Stretches",
    category: "Stretching",
    difficulty: "Beginner",
    description_en:
      "Description: Extend one arm across your chest. Use your opposite hand to gently press the arm closer to your chest. Hold for 10-15 seconds per arm.",
    description_hi:
      "विवरण: एक हाथ को अपने सीने के पार फैलाएं। विपरीत हाथ से धीरे से उस हाथ को अपने सीने की ओर दबाएं। प्रत्येक हाथ के लिए 10–15 सेकंड के लिए पकड़ें।",
    videoUrl: "https://mediac.in/video/Arm%20Stretch%2001%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Arm+Stretches",
  },
  {
    id: "5",
    name: "Forward Bend",
    category: "Stretching",
    difficulty: "Intermediate",
    description_en:
      "Description: Slowly bend forward from the hips, keeping your back straight, and reach toward your knees or shins. Hold for 10-15 seconds.",
    description_hi:
      "विवरण: कूल्हों से धीरे-धीरे आगे झुकें, पीठ को सीधा रखें, और घुटनों या पिंडलियों की ओर हाथ बढ़ाएं। 10–15 सेकंड के लिए रखें।",
    videoUrl: "https://mediac.in/video/Forward%20Bend%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Forward+Bend",
  },
  {
    id: "6",
    name: "Ankle Rotations",
    category: "Stretching",
    difficulty: "Beginner",
    description_en:
      "Description: Rotate your ankles in a circular motion 10 times in each direction.",
    description_hi:
      "विवरण: अपने टखनों को गोल घुमाएं, प्रत्येक दिशा में 10 बार।",
    videoUrl: "https://mediac.in/video/Ankle%20Rotation%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Ankle+Rotations",
  },
  {
    id: "7",
    name: "Calf Stretch",
    category: "Stretching",
    difficulty: "Beginner",
    description_en:
      "Description: Stand facing a wall. Place your hands on the wall at shoulder height. Step one foot back, keeping it straight with the heel on the floor. Lean forward gently until you feel a stretch in the back leg. Hold for 10-15 seconds per leg.",
    description_hi:
      "विवरण: दीवार की ओर मुंह करके खड़े हों। अपने हाथों को कंधे की ऊंचाई पर दीवार पर रखें। एक पैर को पीछे रखें और एड़ी को ज़मीन पर टिकाएं। धीरे से आगे झुकें जब तक पिछली टांग में खिंचाव महसूस न हो। प्रत्येक पैर के लिए 10–15 सेकंड रखें।",
    videoUrl: "https://mediac.in/video/Calf%20Stretch%20(Pexels).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Calf+Stretch",
  },
  {
    id: "8",
    name: "Stationary Cycling",
    category: "Cardio",
    difficulty: "Intermediate",
    description_en:
      "1. Benefits: Low-impact exercise that boosts cardiovascular fitness. 2. Tips: Begin with a low resistance and cycle for short intervals, around 10-15 minutes. Increase the time gradually as your endurance improves.",
    description_hi:
      "1. लाभ: यह एक हल्का व्यायाम है जो हृदय स्वास्थ्य को बेहतर बनाता है। 2. सुझाव: कम प्रतिरोध के साथ शुरू करें और 10–15 मिनट के लिए साइकिल चलाएं। धीरे-धीरे समय बढ़ाएं जैसे-जैसे सहनशक्ति बढ़े।",
    videoUrl: "https://mediac.in/video/Cycling%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Cycling",
  },
  {
    id: "9",
    name: "Swimming",
    category: "Cardio",
    difficulty: "Intermediate",
    description_en:
      "1. Benefits: Provides gentle resistance and minimizes joint strain, especially beneficial for those with arthritis or joint issues. 2. Tips: Start with slow-paced swimming or basic water aerobics movements. Perform only if you know swimming or perform under supervision.",
    description_hi:
      "1. लाभ: यह कोमल प्रतिरोध प्रदान करता है और जोड़ों पर दबाव कम करता है, विशेष रूप से गठिया या जोड़ों की समस्याओं के लिए लाभकारी। 2. सुझाव: धीमी गति से तैराकी या बेसिक वॉटर एरोबिक्स से शुरू करें। केवल तभी करें जब आपको तैरना आता हो या निगरानी में करें।",
    videoUrl: "https://mediac.in/video/Swimming%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Swimming",
  },
  {
    id: "10",
    name: "Slow Dancing",
    category: "Cardio",
    difficulty: "Beginner",
    description_en:
      "1. Benefits: Fun and rhythmic, this activity improves coordination and cardiovascular health. 2. Tips: Start with slow movements, and ensure you don't exert yourself too much.",
    description_hi:
      "1. लाभ: यह एक मजेदार और लयबद्ध गतिविधि है जो समन्वय और हृदय स्वास्थ्य में सुधार करती है। 2. सुझाव: धीमी गति से शुरू करें और खुद को अधिक थकाएं नहीं।",
    videoUrl: "https://mediac.in/video/Slow%20Dancing%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Dancing",
  },
  {
    id: "11",
    name: "Running/Jogging",
    category: "Cardio",
    difficulty: "Advanced",
    description_en:
      "1. Benefits: Running/jogging boosts cardiovascular health, improves endurance, and elevates mood through endorphin release. 2. Tips: Start at a comfortable pace, wear proper footwear, and stay hydrated to prevent fatigue and injury.",
    description_hi:
      "1. लाभ: दौड़ना या जॉगिंग हृदय स्वास्थ्य को बेहतर बनाता है, सहनशक्ति बढ़ाता है, और एंडोर्फिन रिलीज के माध्यम से मूड सुधारता है। 2. सुझाव: आरामदायक गति से शुरू करें, सही जूते पहनें, और थकान व चोट से बचने के लिए हाइड्रेटेड रहें।",
    videoUrl: "https://mediac.in/video/Running%20Jogging%20(Freepik).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Running",
  },
  {
    id: "12",
    name: "Yoga",
    category: "Flexibility",
    difficulty: "Intermediate",
    description_en:
      "1. Benefits: Enhances flexibility, reduces stress, and increases mobility. 2. Tips: Perform gentle seated movements that engage the upper body, such as arm circles or leg raises, without putting strain on the heart.",
    description_hi:
      "1. लाभ: लचीलापन बढ़ाता है, तनाव कम करता है, और गतिशीलता में सुधार करता है। 2. सुझाव: ऐसे कोमल बैठे हुए व्यायाम करें जो ऊपरी शरीर को सक्रिय करें, जैसे आर्म सर्कल या लेग रेज़, बिना दिल पर ज़ोर डाले।",
    videoUrl: "https://mediac.in/video/Pranayama%20(Pexels).mp4",
    thumbnail: "https://via.placeholder.com/150?text=Yoga",
  },
  {
    id: "13",
    name: "Head to Toe Relaxation",
    category: "Relaxation",
    difficulty: "Beginner",
    description_en:
      "1. Benefits: Helps reduce stress, lower blood pressure, and enhance oxygen flow. 2. Tips: Practice slow, deep breathing techniques like diaphragmatic breathing. Pair this with relaxation techniques such as meditation.",
    description_hi:
      "1. लाभ: तनाव को कम करता है, रक्तचाप को घटाता है, और ऑक्सीजन प्रवाह को बढ़ाता है। 2. सुझाव: धीमी और गहरी सांस लेने की तकनीक जैसे डायाफ्रामिक ब्रीदिंग का अभ्यास करें। इसे ध्यान जैसी विश्राम तकनीकों के साथ करें।",
    videoUrl: "https://mediac.in/video/New%20Project.mp4",
    thumbnail: "https://via.placeholder.com/150?text=Relaxation",
  },
];

// Get unique categories for filter
const categories = ["All", ...new Set(exercises.map((ex) => ex.category))];

const ExerciseList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [language, setLanguage] = useState("en"); // en or hi
  const [creditsVisible, setCreditsVisible] = useState(false);

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  // Translations
  const translations = {
    en: {
      "Exercise Library": "Exercise Library",
      "Find the perfect exercise for your routine":
        "Find the perfect exercise for your routine",
      "Filter by category:": "Filter by category:",
      "Important Guidelines": "Important Guidelines",
      "Consult Your Doctor": "Consult Your Doctor",
      "Gradual Progression": "Gradual Progression",
      "Warm-Up and Cool-Down": "Warm-Up and Cool-Down",
      Target: "Target",
      "Avoid Overexertion": "Avoid Overexertion",
      "Pace Yourself": "Pace Yourself",
      "I Understand": "I Understand",
      "No exercises found": "No exercises found",
      Instructions: "Instructions",
      "Start Exercise": "Start Exercise",
      "Exercise in Progress": "Exercise in Progress",
      "End Exercise": "End Exercise",
      "Starting in...": "Starting in...",
      Difficulty: "Difficulty",
      Category: "Category",
      Walking: "Walking",
      "Neck Stretch": "Neck Stretch",
      "Shoulder Rotation": "Shoulder Rotation",
      "Arm Stretches": "Arm Stretches",
      "Forward Bend": "Forward Bend",
      "Ankle Rotations": "Ankle Rotations",
      "Calf Stretch": "Calf Stretch",
      "Stationary Cycling": "Stationary Cycling",
      Swimming: "Swimming",
      "Slow Dancing": "Slow Dancing",
      "Running/Jogging": "Running/Jogging",
      Yoga: "Yoga",
      "Head to Toe Relaxation": "Head to Toe Relaxation",
      All: "All",
      Cardio: "Cardio",
      Stretching: "Stretching",
      Flexibility: "Flexibility",
      Relaxation: "Relaxation",
      Beginner: "Beginner",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
      Status: "Status",
      Connected: "Connected",
      "You are connected to the internet.":
        "You are connected to the internet.",
      Connectivity: "Connectivity",
      "Wi-Fi": "Wi-Fi",
      "Your internet connection is stable.":
        "Your internet connection is stable.",
      Latency: "Latency",
      High: "High",
      "We are experiencing some delays.": "We are experiencing some delays.",
      Throughput: "Throughput",
      Reduced: "Reduced",
      "Your connection speed is slower than usual.":
        "Your connection speed is slower than usual.",
      "Packet Loss": "Packet Loss",
      Increased: "Increased",
      "Some data is not reaching its destination.":
        "Some data is not reaching its destination.",
      guideline1:
        "Discuss your physical activity plan with a healthcare provider before starting, after a recent cardiac event, surgery, or diagnosis.",
      guideline2:
        "Begin with low-intensity exercises and gradually increase duration and intensity. Start with sessions as short as 5–10 minutes if needed, and gradually aim for 30 minutes per day.",
      guideline3:
        "Warm-Up: Spend 5–10 minutes preparing your body with light activity (e.g., slow walking).",
      guideline4:
        "Cool-Down: Gradually lower your heart rate with light activity and stretching.",
      "Warm-Up: Spend 5–10 minutes preparing your body with light activity (e.g., slow walking).":
        "Warm-Up: Spend 5–10 minutes preparing your body with light activity (e.g., slow walking).",
      "Cool-Down: Gradually lower your heart rate with light activity and stretching.":
        "Cool-Down: Gradually lower your heart rate with light activity and stretching.",
      "At least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic exercise per week. Alternatively, a combination of both intensities is recommended.":
        "At least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic exercise per week. Alternatively, a combination of both intensities is recommended.",
        guideline5:'Stop exercising and seek medical attention if you experience chest pain, shortness of breath, dizziness, or extreme fatigue.',
      "Stop exercising and seek medical attention if you experience chest pain, shortness of breath, dizziness, or extreme fatigue.":
        "Stop exercising and seek medical attention if you experience chest pain, shortness of breath, dizziness, or extreme fatigue.",
      "On days when energy levels are lower, opt for lighter activities like slow walking or stretching.":
        "On days when energy levels are lower, opt for lighter activities like slow walking or stretching.",
      Credits: "Credits",
      "Media Attribution": "Media Attribution",
      "Photos & Videos": "Photos & Videos",
      "This app uses photos and videos from the following sources:":
        "This app uses photos and videos from the following sources:",
      "High-quality stock photos and graphics":
        "High-quality stock photos and graphics",
      "Professional design templates and media":
        "Professional design templates and media",
      "We thank these platforms for providing excellent creative resources.":
        "We thank these platforms for providing excellent creative resources.",
      Close: "Close",
    },
    hi: {
      "Exercise Library": "व्यायाम पुस्तकालय",
      "Find the perfect exercise for your routine":
        "अपनी दिनचर्या के लिए सही व्यायाम खोजें",
      "Filter by category:": "श्रेणी के अनुसार फ़िल्टर करें:",
      "Important Guidelines": "महत्वपूर्ण दिशानिर्देश",
      "Consult Your Doctor": "अपने डॉक्टर से परामर्श करें",
      "Gradual Progression": "क्रमिक प्रगति",
      "Warm-Up and Cool-Down": "वार्म-अप और कूल-डाउन",
      Target: "लक्ष्य",
      "Avoid Overexertion": "अधिक परिश्रम से बचें",
      "Pace Yourself": "अपनी गति से चलें",
      "I Understand": "मैं समझता हूँ",
      "No exercises found": "कोई व्यायाम नहीं मिला",
      Instructions: "निर्देश",
      "Start Exercise": "व्यायाम शुरू करें",
      "Exercise in Progress": "व्यायाम प्रगति पर है",
      "End Exercise": "व्यायाम समाप्त करें",
      "Starting in...": "शुरू हो रहा है...",
      Difficulty: "कठिनाई",
      Category: "श्रेणी",
      Walking: "चलना",
      "Neck Stretch": "गर्दन की स्ट्रेचिंग",
      "Shoulder Rotation": "कंधे का घुमाव",
      "Arm Stretches": "बाहों की स्ट्रेचिंग",
      "Forward Bend": "आगे झुकना",
      "Ankle Rotations": "टखने का घुमाव",
      "Calf Stretch": "पिंडली की स्ट्रेचिंग",
      "Stationary Cycling": "स्थिर साइकिलिंग",
      Swimming: "तैराकी",
      "Slow Dancing": "धीमा नृत्य",
      "Running/Jogging": "दौड़ना/जॉगिंग",
      Yoga: "योग",
      "Head to Toe Relaxation": "सिर से पैर तक आराम",
      All: "सभी",
      Cardio: "कार्डियो",
      Stretching: "स्ट्रेचिंग",
      Flexibility: "लचीलापन",
      Relaxation: "आराम",
      Beginner: "शुरुआती",
      Intermediate: "मध्यम",
      Advanced: "उन्नत",
      Status: "स्थिति",
      Connected: "जुड़ा हुआ",
      "You are connected to the internet.": "आप इंटरनेट से जुड़े हैं।",
      Connectivity: "कनेक्टिविटी",
      "Wi-Fi": "वाई-फाई",
      "Your internet connection is stable.": "आपका इंटरनेट कनेक्शन स्थिर है।",
      Latency: "विलंबता",
      High: "उच्च",
      "We are experiencing some delays.": "हमें कुछ देरी का अनुभव हो रहा है।",
      Throughput: "थ्रूपुट",
      Reduced: "कम",
      "Your connection speed is slower than usual.":
        "आपकी कनेक्शन गति सामान्य से धीमी है।",
      "Packet Loss": "पैकेट लॉस",
      Increased: "बढ़ा हुआ",
      "Some data is not reaching its destination.":
        "कुछ डेटा अपने गंतव्य तक नहीं पहुंच रहा है।",
      guideline1:
        "हाल ही में हुई हृदय संबंधी घटना, सर्जरी या निदान के बाद, शुरू करने से पहले अपनी शारीरिक गतिविधि योजना पर स्वास्थ्य सेवा प्रदाता से चर्चा करें।",
      guideline2:
        "कम तीव्रता वाले व्यायामों से शुरुआत करें और धीरे-धीरे अवधि और तीव्रता बढ़ाएँ। ज़रूरत पड़ने पर 5-10 मिनट जैसे छोटे सत्रों से शुरुआत करें, और धीरे-धीरे प्रतिदिन 30 मिनट तक व्यायाम करने का लक्ष्य रखें।",
      guideline3:'वार्म-अप: अपने शरीर को हल्की गतिविधि (जैसे, धीमी गति से चलना) के साथ तैयार करने में 5-10 मिनट का समय लगाएं।',
      guideline4:'कूल-डाउन: हल्की गतिविधि और स्ट्रेचिंग के साथ धीरे-धीरे अपनी हृदय गति को कम करें।',
      guideline5:'यदि आपको सीने में दर्द, सांस लेने में तकलीफ, चक्कर आना या अत्यधिक थकान महसूस हो तो व्यायाम करना बंद कर दें और चिकित्सीय सहायता लें।',
      "Discuss your physical activity plan with a healthcare provider before starting, हाल ही में हृदय संबंधी घटना, सर्जरी या निदान के बाद":
        "शुरू करने से पहले, हाल ही में हृदय संबंधी घटना, सर्जरी या निदान के बाद अपने शारीरिक गतिविधि योजना के बारे में स्वास्थ्य सेवा प्रदाता से चर्चा करें।",
      "Begin with low-intensity exercises and gradually increase duration and intensity. Start with sessions as short as 5–10 minutes if आवश्यक हो तो 5-10 मिनट के छोटे सत्रों से शुरू करें, और धीरे-धीरे प्रति दिन 30 मिनट का लक्ष्य रखें।":
        "कम तीव्रता वाले व्यायामों से शुरुआत करें और धीरे-धीरे अवधि और तीव्रता बढ़ाएं। यदि आवश्यक हो तो 5-10 मिनट के छोटे सत्रों से शुरू करें, और धीरे-धीरे प्रति दिन 30 मिनट का लक्ष्य रखें।",
      "Warm-Up: Spend 5–10 minutes preparing your body with light activity (e.g., धीमी चाल) के साथ अपने शरीर को तैयार करने के लिए 5-10 मिनट बिताएं।":
        "वार्म-अप: हल्की गतिविधि (जैसे, धीमी चाल) के साथ अपने शरीर को तैयार करने के लिए 5-10 मिनट बिताएं।",
      "Cool-Down: Gradually lower your heart rate with light activity and stretching.":
        "कूल-डाउन: हल्की गतिविधि और स्ट्रेचिंग के साथ धीरे-धीरे अपनी हृदय गति को कम करें।",
      "At least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic exercise per week. Alternatively, a combination of both intensities is recommended.":
        "प्रति सप्ताह कम से कम 150 मिनट मध्यम तीव्रता या 75 मिनट तीव्र तीव्रता वाले एरोबिक व्यायाम। वैकल्पिक रूप से, दोनों तीव्रताओं के संयोजन की सिफारिश की जाती है।",
      "Stop exercising and seek medical attention if you experience chest pain, shortness of breath, चक्कर आना या अत्यधिक थकान":
        "यदि आप सीने में दर्द, सांस की तकलीफ, चक्कर आना या अत्यधिक थकान का अनुभव करते हैं तो व्यायाम बंद करें और चिकित्सा सहायता लें।",
      "On days when energy levels are lower, opt for lighter activities like slow walking or stretching.":
        "जिन दिनों ऊर्जा का स्तर कम हो, उन दिनों धीमी चाल या स्ट्रेचिंग जैसी हल्की गतिविधियों का चयन करें।",
      Credits: "श्रेय",
      "Media Attribution": "मीडिया एट्रिब्यूशन",
      "Photos & Videos": "फोटो और वीडियो",
      "This app uses photos and videos from the following sources:":
        "यह ऐप निम्नलिखित स्रोतों से फोटो और वीडियो का उपयोग करता है:",
      "High-quality stock photos and graphics":
        "उच्च गुणवत्ता वाली स्टॉक फोटो और ग्राफिक्स",
      "Professional design templates and media":
        "पेशेवर डिज़ाइन टेम्प्लेट और मीडिया",
      "We thank these platforms for providing excellent creative resources.":
        "हम इन प्लेटफॉर्म का धन्यवाद करते हैं जो उत्कृष्ट रचनात्मक संसाधन प्रदान करते हैं।",
      Close: "बंद करें",
    },
  };

  // Translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  const getExerciseDescription = (exercise, lang) => {
    return lang === "hi" ? exercise.description_hi : exercise.description_en;
  };
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      setCountdownActive(false);
      setExerciseStarted(true);
    }
    return () => clearTimeout(timer);
  }, [countdownActive, countdown]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === "All" || exercise.category === selectedCategory;
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setCountdownActive(false);
      setCountdown(5);
      setExerciseStarted(false);
    });
  };

  const startExercise = () => {
    setCountdownActive(true);
    setCountdown(5);
  };

  const dismissDisclaimer = () => {
    setDisclaimerVisible(false);
  };

  const renderCategoryPill = (category, index) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryPill,
        {
          backgroundColor:
            cardBackgroundColors[index % cardBackgroundColors.length],
        },
        selectedCategory === category && styles.categoryPillActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryPillText,
          selectedCategory === category && styles.categoryPillTextActive,
        ]}
      >
        {t(category)}
      </Text>
    </TouchableOpacity>
  );

  const renderExerciseCard = (exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.card}
      onPress={() => openExerciseDetails(exercise)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardThumbnail}>
          <Image
            source={{ uri: exercise.thumbnail }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <Ionicons name="play-circle" size={28} color="#fff" />
          </View>
        </View>
        <View style={styles.cardHeaderContent}>
          <Text style={styles.exerciseName}>{t(exercise.name)}</Text>
          <View style={styles.exerciseMetaRow}>
            <View style={styles.exerciseMetaItem}>
              <Ionicons name="fitness-outline" size={14} color="#666" />
              <Text style={styles.exerciseMetaText}>
                {t(exercise.difficulty)}
              </Text>
            </View>
          </View>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{t(exercise.category)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {/* {t(exercise.description)} */}
        {getExerciseDescription(exercise, language)}
      </Text>
    </TouchableOpacity>
  );

  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const modalOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{t("Exercise Library")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.creditsButton}
                onPress={() => setCreditsVisible(true)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#4A55A2"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.languageToggle}
                onPress={toggleLanguage}
              >
                <Text style={styles.languageToggleText}>
                  {language === "en" ? "हिंदी" : "EN"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitle}>
            {t("Find the perfect exercise for your routine")}
          </Text>
        </View>

        {/* Category Filter - Made more visible for mobile */}
        <View style={styles.categoryFilterContainer}>
          <Text style={styles.filterLabel}>{t("Filter by category:")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map(renderCategoryPill)}
          </ScrollView>
        </View>

        {/* Disclaimer Section */}
        {disclaimerVisible && (
          <View style={styles.disclaimerContainer}>
            <View style={styles.disclaimerHeader}>
              <View style={styles.disclaimerTitleContainer}>
                <Ionicons name="alert-circle" size={22} color="#e53935" />
                <Text style={styles.disclaimerTitle}>
                  {t("Important Guidelines")}
                </Text>
              </View>
              <TouchableOpacity onPress={dismissDisclaimer}>
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.disclaimerContent}>
              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>1.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    {t("Consult Your Doctor")}
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    {t("guideline1")}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>2.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    {t("Gradual Progression")}
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    {t("guideline2")}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>3.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    {t("Warm-Up and Cool-Down")}
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    {t(
                      "guideline3"
                    )}
                    {"\n"}
                    {t(
                      "guideline4"
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>4.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>{t("Target")}</Text>
                  <Text style={styles.disclaimerItemText}>
                    {t(
                      "At least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic exercise per week. Alternatively, a combination of both intensities is recommended."
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>5.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    {t("Avoid Overexertion")}
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    {t(
                      "guideline5"
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.disclaimerItem}>
                <Text style={styles.disclaimerItemNumber}>6.</Text>
                <View style={styles.disclaimerItemContent}>
                  <Text style={styles.disclaimerItemTitle}>
                    {t("Pace Yourself")}
                  </Text>
                  <Text style={styles.disclaimerItemText}>
                    {t(
                      "On days when energy levels are lower, opt for lighter activities like slow walking or stretching."
                    )}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.disclaimerButton}
              onPress={dismissDisclaimer}
            >
              <Text style={styles.disclaimerButtonText}>
                {t("I Understand")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {filteredExercises.length > 0 ? (
            filteredExercises.map(renderExerciseCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>
                {t("No exercises found")}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Exercise Details Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity,
                },
              ]}
            >
              {selectedExercise && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {t(selectedExercise.name)}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  {countdownActive && (
                    <View style={styles.countdownOverlay}>
                      <View style={styles.countdownContainer}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                        <Text style={styles.countdownLabel}>
                          {t("Starting in...")}
                        </Text>
                      </View>
                    </View>
                  )}

                  {exerciseStarted ? (
                    <View style={styles.exerciseActiveContainer}>
                      <Text style={styles.exerciseActiveTitle}>
                        {t("Exercise in Progress")}
                      </Text>
                      <TouchableOpacity
                        style={styles.stopButton}
                        onPress={closeModal}
                      >
                        <Text style={styles.stopButtonText}>
                          {t("End Exercise")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.videoContainer}>
                        <Video
                          source={{ uri: selectedExercise.videoUrl }}
                          style={styles.video}
                          useNativeControls
                          resizeMode="contain"
                          shouldPlay
                        />
                      </View>

                      <View style={styles.exerciseDetails}>
                        <View style={styles.detailsRow}>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="fitness-outline"
                              size={18}
                              color="#4A55A2"
                            />
                            <Text style={styles.detailLabel}>
                              {t("Difficulty")}
                            </Text>
                            <Text style={styles.detailValue}>
                              {t(selectedExercise.difficulty)}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons
                              name="grid-outline"
                              size={18}
                              color="#4A55A2"
                            />
                            <Text style={styles.detailLabel}>
                              {t("Category")}
                            </Text>
                            <Text style={styles.detailValue}>
                              {t(selectedExercise.category)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <ScrollView style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>
                          {t("Instructions")}
                        </Text>
                        <Text style={styles.descriptionText}>
                          {t(selectedExercise.description)}
                        </Text>
                      </ScrollView>

                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={startExercise}
                      >
                        <Ionicons
                          name="play"
                          size={18}
                          color="#fff"
                          style={styles.startButtonIcon}
                        />
                        <Text style={styles.startButtonText}>
                          {t("Start Exercise")}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </Animated.View>
          </View>
        </Modal>
        {/* Credits Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={creditsVisible}
          onRequestClose={() => setCreditsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.creditsModalContent}>
              <View style={styles.creditsHeader}>
                <Text style={styles.creditsTitle}>{t("Credits")}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCreditsVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.creditsContent}>
                <View style={styles.creditsSection}>
                  <Text style={styles.creditsSectionTitle}>
                    {t("Media Attribution")}
                  </Text>
                  <Text style={styles.creditsDescription}>
                    {t(
                      "This app uses photos and videos from the following sources:"
                    )}
                  </Text>
                </View>

                <View style={styles.creditItem}>
                  <View style={styles.creditItemHeader}>
                    <Image
                      source={{
                        uri: "https://via.placeholder.com/40x40/00C4CC/FFFFFF?text=F",
                      }}
                      style={styles.creditLogo}
                    />
                    <View style={styles.creditItemContent}>
                      <Text style={styles.creditItemTitle}>Freepik</Text>
                      <Text style={styles.creditItemSubtitle}>freepik.com</Text>
                    </View>
                  </View>
                  <Text style={styles.creditItemDescription}>
                    {t("High-quality stock photos")}
                  </Text>
                </View>

                <View style={styles.creditItem}>
                  <View style={styles.creditItemHeader}>
                    <Image
                      source={{
                        uri: "https://via.placeholder.com/40x40/7D2AE8/FFFFFF?text=C",
                      }}
                      style={styles.creditLogo}
                    />
                    <View style={styles.creditItemContent}>
                      <Text style={styles.creditItemTitle}>Canva</Text>
                      <Text style={styles.creditItemSubtitle}>canva.com</Text>
                    </View>
                  </View>
                  <Text style={styles.creditItemDescription}>
                    {t("Professional media")}
                  </Text>
                </View>

                <View style={styles.creditsFooter}>
                  <Text style={styles.creditsFooterText}>
                    {t(
                      "We thank these platforms for providing excellent creative resources."
                    )}
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.creditsCloseButton}
                onPress={() => setCreditsVisible(false)}
              >
                <Text style={styles.creditsCloseButtonText}>{t("Close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  languageToggle: {
    backgroundColor: "#4A55A2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageToggleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  // Enhanced category filter visibility
  categoryFilterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    paddingLeft: 4,
  },
  categoryContainer: {
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f4ff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryPillActive: {
    backgroundColor: "#4A55A2",
    borderColor: "#4A55A2",
  },
  categoryPillText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryPillTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  // Disclaimer styles
  disclaimerContainer: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  disclaimerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffebee",
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
  },
  disclaimerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c62828",
    marginLeft: 8,
  },
  disclaimerContent: {
    maxHeight: 300,
    padding: 16,
  },
  disclaimerItem: {
    flexDirection: "row",
    marginBottom: 14,
  },
  disclaimerItemNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c62828",
    marginRight: 8,
    width: 20,
  },
  disclaimerItemContent: {
    flex: 1,
  },
  disclaimerItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  disclaimerItemText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  disclaimerButton: {
    backgroundColor: "#c62828",
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  disclaimerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  cardThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  playIconOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  cardHeaderContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  exerciseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  exerciseMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseMetaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: "#4A55A2",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  exerciseDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  descriptionContainer: {
    padding: 16,
    maxHeight: 200,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: "#4A55A2",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  startButtonIcon: {
    marginRight: 8,
  },
  // Countdown styles
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  countdownText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#4A55A2",
  },
  countdownLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  // Exercise active styles
  exerciseActiveContainer: {
    padding: 20,
    alignItems: "center",
  },
  exerciseActiveTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A55A2",
    marginBottom: 20,
  },
  exerciseTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  exerciseTimerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A55A2",
    marginLeft: 10,
  },
  stopButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  creditsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(74, 85, 162, 0.1)",
    marginLeft: 8,
  },
  creditsModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  creditsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f8f9fa",
  },
  creditsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  creditsContent: {
    padding: 20,
  },
  creditsSection: {
    marginBottom: 20,
  },
  creditsSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  creditsDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  creditItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  creditItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  creditLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  creditItemContent: {
    flex: 1,
  },
  creditItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  creditItemSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  creditItemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  creditsFooter: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  creditsFooterText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    fontStyle: "italic",
  },
  creditsCloseButton: {
    backgroundColor: "#4A55A2",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  creditsCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ExerciseList;
