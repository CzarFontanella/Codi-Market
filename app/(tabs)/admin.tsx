import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFocusEffect } from "@react-navigation/native";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { app } from "../../firebase";

const ADMIN_PASSWORD = "admin123"; // Troque para sua senha segura

export default function AdminScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form state
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  const db = getFirestore(app);

  // Carrega produtos do Firebase
  const fetchProducts = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "Products"));
    const productsData: any[] = [];
    querySnapshot.forEach((docSnap) => {
      productsData.push({ id: docSnap.id, ...docSnap.data() });
    });
    setProducts(productsData);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated]);

  // Adiciona novo produto
  const handleAdd = async () => {
    if (!form.name || !form.price || !form.stock || !form.image) {
      Alert.alert("Preencha todos os campos!");
      return;
    }
    const newProduct = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image,
    };
    await addDoc(collection(db, "Products"), newProduct);
    setForm({ id: "", name: "", price: "", stock: "", image: "" });
    setModalVisible(false);
    fetchProducts();
  };

  // Atualiza produto existente
  const handleEdit = async () => {
    if (!form.id) return;
    const ref = doc(db, "Products", form.id);
    await updateDoc(ref, {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image,
    });
    setEditing(false);
    setForm({ id: "", name: "", price: "", stock: "", image: "" });
    setModalVisible(false);
    fetchProducts();
  };

  // Preenche formulário para edição
  const startEdit = (item: any) => {
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      stock: String(item.stock),
      image: item.image,
    });
    setEditing(true);
    setModalVisible(true);
  };

  // Exclui produto
  const handleDelete = async (id: string) => {
    Alert.alert("Excluir", "Tem certeza que deseja excluir este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "Products", id));
          fetchProducts();
        },
      },
    ]);
  };

  // Abre modal para adicionar novo produto
  const openAddModal = () => {
    setForm({ id: "", name: "", price: "", stock: "", image: "" });
    setEditing(false);
    setModalVisible(true);
  };

  // Sempre pede autenticação ao focar na tab ou recarregar
  useFocusEffect(
    React.useCallback(() => {
      setAuthenticated(false);
      setPassword("");
      // Opcional: também pode limpar outros estados sensíveis aqui
    }, [])
  );

  // Autenticação simples
  if (!authenticated) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.title}>Área Secreta do Admin 👀</ThemedText>
        <TextInput
          placeholder="Senha de administrador"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Button
          title="Entrar"
          onPress={() => {
            if (password === ADMIN_PASSWORD) {
              setAuthenticated(true);
            } else {
              Alert.alert("Senha incorreta!");
            }
          }}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16, paddingTop: Platform.select({ ios: 48, default: 16 }) }}>
      <ThemedText style={styles.title}>Gerenciar Produtos</ThemedText>
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Adicionar Produto</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchProducts}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* Imagem do produto */}
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>Preço: R${Number(item.price).toFixed(2)}</Text>
              <Text style={styles.itemText}>Estoque: {item.stock}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(item)}>
              <Text style={{ color: "#fff" }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={{ color: "#fff" }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>Nenhum produto cadastrado.</Text>}
      />

      {/* Modal para adicionar/editar produto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{editing ? "Editar Produto" : "Adicionar Produto"}</Text>
            <TextInput
              placeholder="Nome"
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Preço"
              value={form.price}
              onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Estoque"
              value={form.stock}
              onChangeText={(v) => setForm((f) => ({ ...f, stock: v }))}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="URL da Imagem"
              value={form.image}
              onChangeText={(v) => setForm((f) => ({ ...f, image: v }))}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                title={editing ? "Salvar Alterações" : "Adicionar"}
                onPress={editing ? handleEdit : handleAdd}
              />
              <Button
                title="Cancelar"
                color="gray"
                onPress={() => {
                  setEditing(false);
                  setModalVisible(false);
                  setForm({ id: "", name: "", price: "", stock: "", image: "" });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 2,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});
