import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useState } from "react";
import { addGame } from "../storage";

export default function GameDetail({ route }) {
  const { jeu } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatut, setSelectedStatut] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [note, setNote] = useState("");

  const availablePlatforms = jeu.platforms?.map((p) => p.platform.name) || [];

  function handleStatutPress(statut) {
    setSelectedStatut(statut);
    setSelectedPlatforms([]);
    setNote("");
    setModalVisible(true);
  }

  function togglePlatform(platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  }

  function handleConfirm() {
    addGame(jeu, selectedStatut, selectedPlatforms, note);
    setModalVisible(false);
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: jeu.background_image }} style={styles.cover} />
      <View style={styles.infos}>
        <Text style={styles.titre}>{jeu.name}</Text>
        <Text style={styles.note}>⭐ {jeu.rating} / 5</Text>
        <Text style={styles.label}>Plateformes :</Text>
        <Text style={styles.valeur}>{availablePlatforms.join(", ")}</Text>
        <Text style={styles.label}>Genres :</Text>
        <Text style={styles.valeur}>{jeu.genres?.map((g) => g.name).join(", ")}</Text>

        <Text style={styles.label}>Ajouter à ma collection :</Text>
        <View style={styles.boutons}>
          {["joué", "en cours", "backlog"].map((statut) => (
            <TouchableOpacity
              key={statut}
              style={[styles.btn, styles[statut.replace(" ", "")]]}
              onPress={() => handleStatutPress(statut)}
            >
              <Text style={styles.btnTexte}>{statut}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitre}>Sur quelle(s) plateforme(s) ?</Text>
            {availablePlatforms.map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[styles.platformRow, selectedPlatforms.includes(platform) && styles.platformSelected]}
                onPress={() => togglePlatform(platform)}
              >
                <Text
                  style={[styles.platformTexte, selectedPlatforms.includes(platform) && styles.platformTexteSelected]}
                >
                  {selectedPlatforms.includes(platform) ? "✓ " : ""}
                  {platform}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Note personnelle (optionnel) :</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Ex: J'ai la version Sword, 80% complété..."
              value={note}
              onChangeText={setNote}
              multiline
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmTexte}>Confirmer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.annuler}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  joué: { backgroundColor: "#4CAF50" },
  encours: { backgroundColor: "#2196F3" },
  backlog: { backgroundColor: "#FF9800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitre: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  platformRow: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#eee", marginBottom: 8 },
  platformSelected: { backgroundColor: "#E3F2FD", borderColor: "#2196F3" },
  platformTexte: { fontSize: 15, color: "#333" },
  platformTexteSelected: { color: "#2196F3", fontWeight: "bold" },
  noteInput: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: "top",
  },
  confirmBtn: { backgroundColor: "#2196F3", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  confirmTexte: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  annuler: { textAlign: "center", marginTop: 12, color: "#888", fontSize: 15 },
});
