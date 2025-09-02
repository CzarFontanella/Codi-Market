import { ThemedView } from "@/components/ThemedView";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Firebase imports
// Ajuste o caminho conforme a localização do seu arquivo firebase.ts/js
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebase";

export default function HomeScreen() {
  // Estado para armazenar os produtos do Firebase
  const [products, setProducts] = useState<any[]>([]);
  // Estado para armazenar a quantidade de cada item (agora pode começar em zero)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "Products"));
      const productsData: any[] = [];
      const initialQuantities: { [key: string]: number } = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({ id: doc.id, ...data });
        initialQuantities[doc.id] = 0;
      });
      setProducts(productsData);
      setQuantities(initialQuantities);
    };
    fetchProducts();
  }, []);

  const increment = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  };

  const decrement = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0,
    }));
  };

  const addToCart = (itemId: string) => {
    // Lógica para adicionar ao carrinho
    // Exemplo: alert(`Adicionado ${quantities[itemId]} do item ${itemId} ao carrinho`);
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
          {products.map((product) => {
            const stock = Number(product.stock) || 0;
            const quantity = quantities[product.id] || 0;
            const outOfStock = stock === 0;
            return (
              <View key={product.id} style={styles.itemCard}>
                <Image style={styles.itemImage} source={{ uri: product.image }} />
                <Text>{product.name}</Text>
                <Text>R${Number(product.price).toFixed(2)}</Text>
                {/* Seletor de quantidade ou mensagem de estoque */}
                {outOfStock ? (
                  <Text style={styles.outOfStockText}>Sem estoque</Text>
                ) : (
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      onPress={() => decrement(product.id)}
                      style={styles.quantityButton}
                      disabled={quantity === 0}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (quantity < stock) increment(product.id);
                      }}
                      style={styles.quantityButton}
                      disabled={quantity >= stock}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* Botão adicionar ao carrinho */}
                <TouchableOpacity
                  style={[
                    styles.cartButton,
                    {
                      backgroundColor:
                        outOfStock || quantity === 0 ? "#ccc" : "#007AFF",
                    },
                  ]}
                  onPress={() => addToCart(product.id)}
                  disabled={outOfStock || quantity === 0}
                >
                  <AntDesign
                    name="shoppingcart"
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.select({ ios: 32, default: 0 }),
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
  outOfStockText: {
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
});
