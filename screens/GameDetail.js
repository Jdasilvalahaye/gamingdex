import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useState } from "react";
import { addGame, addToHistory } from "../storage";

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

  function handleHistorique() {
    setSelectedStatut("historique");
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
    if (selectedStatut === "historique") {
      addToHistory(jeu, selectedPlatforms, note);
    } else {
      addGame(jeu, selectedStatut, selectedPlatforms, note);
    }
    setModalVisible(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: jeu.background_image }} style={styles.cover} />
        <View style={styles.coverOverlay} />
        <View style={styles.coverInfos}>
          <Text style={styles.titre}>{jeu.name}</Text>
          <Text style={styles.rating}>⭐ {jeu.rating} / 5</Text>
        </View>
      </View>

      <View style={styles.infos}>
        <Text style={styles.label}>Plateformes</Text>
        <Text style={styles.valeur}>{availablePlatforms.join(", ")}</Text>

        <Text style={styles.label}>Genres</Text>
        <Text style={styles.valeur}>{jeu.genres?.map((g) => g.name).join(", ")}</Text>

        <Text style={styles.label}>Ajouter à ma collection</Text>
        <View style={styles.boutons}>
          {[
            { statut: "joué", couleur: "#4CAF50", emoji: "✅" },
            { statut: "en cours", couleur: "#2196F3", emoji: "🎮" },
            { statut: "backlog", couleur: "#FF9800", emoji: "📋" },
          ].map(({ statut, couleur, emoji }) => (
            <TouchableOpacity
              key={statut}
              style={[styles.btn, { backgroundColor: couleur }]}
              onPress={() => handleStatutPress(statut)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnEmoji}>{emoji}</Text>
              <Text style={styles.btnTexte}>{statut}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Ajouter à l'historique</Text>
        <TouchableOpacity style={styles.historiqueBtn} onPress={handleHistorique} activeOpacity={0.8}>
          <Text style={styles.btnTexte}>📖 J'y ai joué mais je ne l'ai plus</Text>
        </TouchableOpacity>
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
                  {selectedPlatforms.includes(platform) ? "✓  " : ""}
                  {platform}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.modalLabel}>Note personnelle (optionnel)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Ex: Version Sword, 80% complété..."
              placeholderTextColor="#6B8A99"
              value={note}
              onChangeText={setNote}
              multiline
            />

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
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
  container: { flex: 1, backgroundColor: "#EEF4F7" },
  coverContainer: { height: 280, position: "relative" },
  cover: { width: "100%", height: "100%" },
  coverOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(26,47,58,0.45)",
  },
  coverInfos: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 },
  titre: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 6 },
  rating: { fontSize: 15, color: "#FFD700" },
  infos: { padding: 20 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B8A99",
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  valeur: { fontSize: 15, color: "#1A2F3A", lineHeight: 22 },
  boutons: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  btnEmoji: { fontSize: 20, marginBottom: 4 },
  btnTexte: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  historiqueBtn: { backgroundColor: "#607D8B", padding: 14, borderRadius: 12, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(26,47,58,0.6)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitre: { fontSize: 18, fontWeight: "bold", color: "#1A2F3A", marginBottom: 16 },
  platformRow: { padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#D4E4EC", marginBottom: 8 },
  platformSelected: { backgroundColor: "#DDF0F9", borderColor: "#2196F3" },
  platformTexte: { fontSize: 15, color: "#1A2F3A" },
  platformTexteSelected: { color: "#2196F3", fontWeight: "bold" },
  modalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B8A99",
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  noteInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4E4EC",
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: "top",
    color: "#1A2F3A",
    backgroundColor: "#EEF4F7",
  },
  confirmBtn: { backgroundColor: "#2196F3", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 16 },
  confirmTexte: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  annuler: { textAlign: "center", marginTop: 14, color: "#6B8A99", fontSize: 15 },
});
