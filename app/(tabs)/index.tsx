import { ThemedView } from "@/components/ThemedView";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Example items array

  // Estado para armazenar a quantidade de cada item (agora pode começar em zero)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    Object.fromEntries(items.map((item) => [item, 0]))
  );

  const increment = (item: number) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: prev[item] + 1,
    }));
  };

  const decrement = (item: number) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: prev[item] > 0 ? prev[item] - 1 : 0,
    }));
  };

  const addToCart = (item: number) => {
    // Lógica para adicionar ao carrinho
    // Exemplo: alert(`Adicionado ${quantities[item]} do item ${item} ao carrinho`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingBottom: 32, // Add padding to avoid overlap with tab bar
          }}
        >
          {items.map((item, index) => (
            <View key={item} style={styles.itemCard}>
              <Image style={styles.itemImage} source={{ uri: "https://confeiteiro.agilecdn.com.br/11464.png?v=340-842183326" }} />
              <Text>Item Name</Text>
              <Text>R$99.99</Text>
              {/* Seletor de quantidade */}
              <View style={styles.quantitySelector}>
                <TouchableOpacity onPress={() => decrement(item)} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantities[item]}</Text>
                <TouchableOpacity onPress={() => increment(item)} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              {/* Botão adicionar ao carrinho */}
              <TouchableOpacity
                style={[
                  styles.cartButton,
                  { backgroundColor: quantities[item] === 0 ? "#ccc" : "#007AFF" },
                ]}
                onPress={() => addToCart(item)}
                disabled={quantities[item] === 0}
              >
                <AntDesign
                  name="shoppingcart"
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.select({ ios: 24, default: 0 }),
  },
  itemCard: {
    width: "48%",
    margin: 4,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
    borderRadius: 48,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    minWidth: 20,
    textAlign: "center",
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
