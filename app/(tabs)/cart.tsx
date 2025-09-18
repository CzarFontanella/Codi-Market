import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../components/ui/CartContext";

export default function TabTwoScreen() {
  const { cart } = useCart();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Carrinho
        </Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={{ padding: 10 }}>
              {item.name} x {item.quantity}
            </Text>
          )}
          ListEmptyComponent={<Text>O carrinho está vazio.</Text>}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
