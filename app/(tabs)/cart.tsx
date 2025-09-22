import { ThemedView } from "@/components/ThemedView";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../components/ui/CartContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabTwoScreen() {
  const { cart } = useCart();

  const valorTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return `R$${total.toFixed(2)}`;
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.logo}>
          <FontAwesome5 name="shopping-cart" size={32} color="#fff" />
        </View>
        <View style={styles.cardCart}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemLine}>
                <Image style={styles.itemImage} source={{ uri: item.image }} />
                <Text>{item.name}</Text>
                <Text>R$ {item.price.toFixed(2)}</Text>
                <Text>{item.quantity}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyCartText}>O carrinho está vazio.</Text>
            }
          />
        </View>
        {!(cart.length === 0) && (
          <>
            <View style={styles.totalValue}>
              <Text style={styles.totalValueText}>Valor Total: </Text>
              <Text style={[styles.totalValueText, { color: "green" }]}>
                {valorTotal()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => alert("Compra finalizada!")}
              style={styles.payButton}
            >
              <FontAwesome5 name="dollar-sign" size={20} color="white" /><Text style={{color: "white", fontSize: 20, fontWeight: "bold"}}> Finalizar Compra</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: Platform.select({ ios: 32, default: 0 }),
  },
  cardCart: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#007AFF",
    marginBottom: 16,
    alignSelf: "center",
  },
  emptyCartText: {
    textAlign: "center",
    padding: 16,
  },
  itemLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomColor: "#888",
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  itemImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 48,
  },

  totalValue: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  totalValueText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: { 
    marginTop: 16, 
    backgroundColor: "#007AFF",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
