import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a11cb" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <FontAwesome5 name="apple-alt" size={32} color="white" />
          </View>
          <Text style={styles.title}>Diet Recommendations</Text>
          <Text style={styles.subtitle}>Your guide to healthy eating</Text>
        </View>

        <View style={styles.generalTipsContainer}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={24}
              color="#6a11cb"
            />
            <Text style={styles.sectionTitle}>General Guidelines</Text>
          </View>
          <View style={styles.tipsList}>
            <TipItem
              number="1"
              text="Avoid overeating, choose small portions"
              icon="food-variant"
            />
            <TipItem
              number="2"
              text="Always eat home cooked meal"
              icon="home-variant"
            />
            <TipItem number="3" text="Drink plenty of water" icon="water" />
            <TipItem number="4" text="Manage sleep and stress" icon="sleep" />
            <TipItem number="5" text="Be consistent" icon="calendar-check" />
            <TipItem
              number="6"
              text="Maintain a healthy body weight (BMI = 18.5-24.9 Kg/m²)"
              icon="scale-balance"
            />
            <TipItem
              text="Reduce sodium intake to 1500-2300 mg for BP control"
              icon="bowl-mix-outline"
            />
            <TipItem
              text="Avoid saturated fats and trans fats"
              icon="food-off"
            />
            <TipItem text="Avoid Alcohol and Smoking" icon="smoking-off" />
          </View>
        </View>

        <View style={styles.foodCategoriesContainer}>
          <View style={styles.sectionTitleContainer}>
            <FontAwesome5 name="carrot" size={24} color="#6a11cb" />
            <Text style={styles.sectionTitle}>Recommended Foods</Text>
          </View>

          <FoodCategory
            title="Fruits & Vegetables"
            icon="fruit-cherries"
            color="#56ab2f"
            items={[
              "At least 3 fruits daily",
              "At least 3 vegetables daily",
              "Include seasonal fruits and vegetables",
            ]}
            icons={[
              { lib: "FontAwesome5", name: "apple-alt" },
              { lib: "MaterialCommunityIcons", name: "food" },
              { lib: "MaterialCommunityIcons", name: "carrot" },
            ]}
          />

          <FoodCategory
            title="Whole Grains"
            icon="grain"
            color="#F09819"
            items={[
              "Millets (Jowar, Bajra, Ragi)",
              "Barley",
              "Corn",
              "Quinoa",
              "Buckwheat (Kuttu)",
              "Brown Rice",
              "Oats",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "grain" },
              { lib: "FontAwesome5", name: "seedling" },
              { lib: "MaterialCommunityIcons", name: "rice" },
            ]}
          />

          <FoodCategory
            title="Protein Sources"
            icon="food-steak"
            color="#FF512F"
            items={[
              "Paneer",
              "Dals, Rajma",
              "Soy Chunks",
              "Legumes (Lentils, Chickpeas, Lobia)",
              "Egg white",
              "Chicken breasts",
              "Fish (Rohu, Surmai)",
            ]}
            icons={[
              { lib: "FontAwesome5", name: "cheese" },
              { lib: "MaterialCommunityIcons", name: "food-variant" },
              { lib: "MaterialCommunityIcons", name: "soy-sauce" },
              { lib: "MaterialCommunityIcons", name: "food-takeout-box" },
              { lib: "FontAwesome5", name: "egg" },
              { lib: "MaterialCommunityIcons", name: "food-drumstick" },
              { lib: "FontAwesome5", name: "fish" },
            ]}
          />

          <FoodCategory
            title="Healthy Fats"
            icon="oil"
            color="#8E2DE2"
            items={[
              "Almonds",
              "Walnuts",
              "Chia Seeds",
              "Hemp Seeds",
              "Flax Seeds",
              "Pumpkin Seeds",
              "Mustard Oil",
              "Olive Oil",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "MaterialCommunityIcons", name: "seed" },
              { lib: "FontAwesome5", name: "oil-can" },
              { lib: "FontAwesome5", name: "oil-can" },
            ]}
          />

          <FoodCategory
            title="Dairy"
            icon="cup"
            color="#2193b0"
            items={[
              "Toned Milk",
              "Curd",
              "Low fat Paneer",
              "Yoghurt",
              "Buttermilk",
              "Low Fat Cheese",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "cup-water" },
              { lib: "FontAwesome5", name: "water" },
              { lib: "MaterialCommunityIcons", name: "cheese" },
              { lib: "FontAwesome5", name: "water" },
              { lib: "MaterialCommunityIcons", name: "cup-water" },
              { lib: "MaterialCommunityIcons", name: "cheese" },
            ]}
          />
        </View>

        <View style={styles.avoidContainer}>
          <View style={styles.sectionTitleContainer}>
            <FontAwesome name="ban" size={24} color="#e53935" />
            <Text style={[styles.sectionTitle, { color: "#e53935" }]}>
              Foods to Avoid
            </Text>
          </View>

          <FoodCategory
            title="Unhealthy Fats"
            icon="food-off"
            color="#e53935"
            items={[
              "Ghee",
              "Refined Oils",
              "Red Meat (Mutton, Beef, Pork)",
              "Fried foods (Pakoras, Samosa, Pooris)",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "water" },
              { lib: "FontAwesome5", name: "oil-can" },
              { lib: "MaterialCommunityIcons", name: "food-drumstick-off" },
              { lib: "MaterialCommunityIcons", name: "french-fries" },
            ]}
            isAvoid={true}
          />

          <FoodCategory
            title="Unhealthy Dairy"
            icon="cheese"
            color="#e53935"
            items={[
              "Whole Milk",
              "Full Fat Paneer",
              "Cheese",
              "Butter",
              "Cream",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "cup-water" },
              { lib: "FontAwesome5", name: "cheese" },
              { lib: "MaterialCommunityIcons", name: "cheese" },
              { lib: "FontAwesome5", name: "cheese" },
              { lib: "MaterialCommunityIcons", name: "ice-cream" },
            ]}
            isAvoid={true}
          />

          <FoodCategory
            title="Refined Carbs"
            icon="bread-slice"
            color="#e53935"
            items={["White Bread", "Pasta", "White Rice", "Maida"]}
            icons={[
              { lib: "FontAwesome5", name: "bread-slice" },
              { lib: "MaterialCommunityIcons", name: "noodles" },
              { lib: "MaterialCommunityIcons", name: "rice" },
            ]}
            isAvoid={true}
          />

          <FoodCategory
            title="Sugary Items"
            icon="candy"
            color="#e53935"
            items={[
              "Carbonated/sweetened beverages",
              "Fruit Juices",
              "Candy / Jellies",
              "Sweets",
            ]}
            icons={[
              { lib: "MaterialCommunityIcons", name: "food-fork-drink" },
              { lib: "MaterialCommunityIcons", name: "cup-water" },
              { lib: "MaterialCommunityIcons", name: "candy" },
              { lib: "MaterialCommunityIcons", name: "spoon-sugar" },
            ]}
            isAvoid={true}
          />

          <FoodCategory
            title="Processed Foods"
            icon="hamburger"
            color="#e53935"
            items={[
              "Fast Foods (Burger, Pizza, Fries)",
              "Baked foods (Cakes, biscuits, Pastries)",
              "Junk foods (Chips, Namkeen)",
              "Instant and processed Foods (Noodles, Frozen Snacks, Pickles, Ketchup)",
              "Alcohol",
            ]}
            icons={[
              { lib: "FontAwesome5", name: "pizza-slice" },
              { lib: "FontAwesome5", name: "birthday-cake" },
              { lib: "FontAwesome5", name: "beer" },
            ]}
            isAvoid={true}
          />
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionButtonInner}>
            <Text style={styles.actionButtonText}>
              Start Healthy Diet Today
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const TipItem = ({ number, text, icon }) => (
  <View style={styles.tipItem}>
    {number ? (
      <View style={styles.tipNumberContainer}>
        <View style={styles.tipNumber}>
          <Text style={styles.tipNumberText}>{number}</Text>
        </View>
      </View>
    ) : (
      <View style={styles.tipIconContainer}>
        <MaterialCommunityIcons name={icon} size={20} color="#6a11cb" />
      </View>
    )}
    <View style={styles.tipTextContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#6a11cb"
        style={styles.tipIcon}
      />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  </View>
);

const FoodCategory = ({
  title,
  icon,
  color,
  items,
  icons,
  isAvoid = false,
}) => (
  <View style={styles.foodCategory}>
    <View style={[styles.categoryHeader, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
      <Text style={styles.categoryTitle}>{title}</Text>
    </View>
    <View style={styles.categoryItems}>
      {items.map((item, index) => (
        <View key={index} style={styles.categoryItem}>
          <View style={styles.categoryItemIcon}>
            {renderIcon(icons[index % icons.length], color, isAvoid)}
          </View>
          <Text
            style={[styles.categoryItemText, isAvoid && styles.avoidItemText]}
          >
            {item}
          </Text>
          {isAvoid && (
            <FontAwesome
              name="ban"
              size={16}
              color="#e53935"
              style={styles.avoidIcon}
            />
          )}
        </View>
      ))}
    </View>
  </View>
);

const renderIcon = (iconData, color, isAvoid) => {
  const iconColor = isAvoid ? "#e53935" : color;
  const iconSize = 24;

  switch (iconData.lib) {
    case "MaterialCommunityIcons":
      return (
        <MaterialCommunityIcons
          name={iconData.name}
          size={iconSize}
          color={iconColor}
        />
      );
    case "FontAwesome5":
      return (
        <FontAwesome5 name={iconData.name} size={iconSize} color={iconColor} />
      );
    case "FontAwesome":
      return (
        <FontAwesome name={iconData.name} size={iconSize} color={iconColor} />
      );
    case "Ionicons":
      return (
        <Ionicons name={iconData.name} size={iconSize} color={iconColor} />
      );
    default:
      return (
        <MaterialCommunityIcons
          name="help-circle"
          size={iconSize}
          color={iconColor}
        />
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    padding: 30,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: "#6a11cb",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
  generalTipsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: -20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a11cb",
    marginLeft: 10,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipNumberContainer: {
    marginRight: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6a11cb",
  },
  tipNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  tipIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 17, 203, 0.05)",
    padding: 12,
    borderRadius: 12,
  },
  tipIcon: {
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: "#495057",
    lineHeight: 24,
  },
  foodCategoriesContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  foodCategory: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  categoryItems: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryItemIcon: {
    marginRight: 12,
    width: 32,
    alignItems: "center",
  },
  categoryItemText: {
    flex: 1,
    fontSize: 16,
    color: "#495057",
    lineHeight: 22,
  },
  avoidItemText: {
    color: "#e53935",
  },
  avoidIcon: {
    marginLeft: 8,
  },
  avoidContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#6a11cb",
  },
  actionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});
