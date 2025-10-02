import { ThemedView } from "@/components/ThemedView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../components/ui/CartContext";

type RootStackParamList = {
  admin: undefined;
  // add other routes here if needed
};

export default function TabTwoScreen() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = () => {
    // Inicia o timer de 10 segundos
    timerRef.current = setTimeout(() => {
      navigation.navigate("admin");
    }, 10000);
  };

  const handlePressOut = () => {
    // Cancela o timer caso solte antes dos 10s
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const valorTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return `R$${total.toFixed(2)}`;
  };

  // Funções auxiliares para alterar quantidade e remover item
  const handleIncrement = (item: any) => {
    if (item.quantity < (item.stock ?? 99)) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = (item: any) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = (item: any) => {
    removeFromCart(item.id);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.logo}>
            <FontAwesome5 name="shopping-cart" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.cardCart}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemLine}>
                <Image style={styles.itemImage} source={{ uri: item.image }} />
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemText}>
                  Preço: <br />
                  R$ {item.price.toFixed(2)}
                </Text>
                {/* Quantidade com botões */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => handleDecrement(item)}
                    style={[
                      styles.qtyButton,
                      { opacity: item.quantity === 1 ? 0.5 : 1 },
                    ]}
                    disabled={item.quantity === 1}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => handleIncrement(item)}
                    style={[
                      styles.qtyButton,
                      {
                        opacity: item.quantity === (item.stock ?? 99) ? 0.5 : 1,
                      },
                    ]}
                    disabled={item.quantity === (item.stock ?? 99)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                {/* Botão remover */}
                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                  style={styles.removeButton}
                >
                  <FontAwesome5 name="trash" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyCartText}>O carrinho está vazio.</Text>
            }
          />
          {!(cart.length === 0) && (
            <View style={styles.totalValue}>
              <Text style={styles.totalValueText}>Valor Total: </Text>
              <Text style={[styles.totalValueText, { color: "green" }]}>
                {valorTotal()}
              </Text>
            </View>
          )}
        </View>

        {!(cart.length === 0) && (
          <TouchableOpacity
            onPress={() => alert("Compra finalizada!")}
            style={styles.payButton}
          >
            <FontAwesome5 name="dollar-sign" size={20} color="white" />
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {" "}
              Finalizar Compra
            </Text>
          </TouchableOpacity>
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
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  itemImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 48,
  },
  itemText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: 8,
  },
  totalValue: {
    flexDirection: "row",
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
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: "red",
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
