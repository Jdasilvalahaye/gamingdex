import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { addGame } from "../storage";

export default function GameDetail({ route }) {
  const { jeu } = route.params;

  function handleAjouter(statut) {
    addGame(jeu, statut);
    Alert.alert("Ajouté !", `${jeu.name} ajouté à ta collection.`);
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: jeu.background_image }} style={styles.cover} />
      <View style={styles.infos}>
        <Text style={styles.titre}>{jeu.name}</Text>
        <Text style={styles.note}>⭐ {jeu.rating} / 5</Text>
        <Text style={styles.label}>Plateformes :</Text>
        <Text style={styles.valeur}>{jeu.platforms?.map((p) => p.platform.name).join(", ")}</Text>
        <Text style={styles.label}>Genres :</Text>
        <Text style={styles.valeur}>{jeu.genres?.map((g) => g.name).join(", ")}</Text>

        <Text style={styles.label}>Ajouter à ma collection :</Text>
        <View style={styles.boutons}>
          <TouchableOpacity style={[styles.btn, styles.joue]} onPress={() => handleAjouter("joué")}>
            <Text style={styles.btnTexte}>Joué</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.encours]} onPress={() => handleAjouter("en cours")}>
            <Text style={styles.btnTexte}>En cours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.backlog]} onPress={() => handleAjouter("backlog")}>
            <Text style={styles.btnTexte}>Backlog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cover: { width: "100%", height: 220 },
  infos: { padding: 16 },
  titre: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  note: { fontSize: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "bold", color: "#888", marginTop: 12 },
  valeur: { fontSize: 15, marginTop: 4 },
  boutons: { flexDirection: "row", gap: 8, marginTop: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  btnTexte: { color: "#fff", fontWeight: "bold" },
  joue: { backgroundColor: "#4CAF50" },
  encours: { backgroundColor: "#2196F3" },
  backlog: { backgroundColor: "#FF9800" },
});
