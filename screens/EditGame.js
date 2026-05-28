import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { useState } from "react";
import { getCollection } from "../storage";
import { getPlatformColor } from "../platformColors";

const ALL_PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "PlayStation 3",
  "PlayStation 2",
  "PlayStation",
  "Xbox Series S/X",
  "Xbox One",
  "Xbox 360",
  "Nintendo Switch",
  "Nintendo 3DS",
  "Nintendo DS",
  "Nintendo 64",
  "GameCube",
  "Game Boy Advance",
  "Game Boy Color",
  "Game Boy",
  "iOS",
  "Android",
  "macOS",
];

const STATUT_CONFIG = {
  joué: { couleur: "#4CAF50", emoji: "✅" },
  "en cours": { couleur: "#2196F3", emoji: "🎮" },
  backlog: { couleur: "#FF9800", emoji: "📋" },
};

export default function EditGame({ route, navigation }) {
  const { game } = route.params;
  const [selectedPlatforms, setSelectedPlatforms] = useState(game.platforms || []);
  const [selectedStatut, setSelectedStatut] = useState(game.statut);
  const [note, setNote] = useState(game.note || "");

  function togglePlatform(platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  }

  async function handleSave() {
    const collection = await getCollection();
    const updated = collection.map((j) =>
      j.id === game.id ? { ...j, platforms: selectedPlatforms, statut: selectedStatut, note: note } : j,
    );
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    await AsyncStorage.setItem("ma_collection", JSON.stringify(updated));
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: game.background_image }} style={styles.cover} />
        <View style={styles.coverOverlay} />
        <Text style={styles.titre}>{game.name}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Statut</Text>
        <View style={styles.statuts}>
          {["joué", "en cours", "backlog"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statutBtn,
                selectedStatut === s && {
                  backgroundColor: STATUT_CONFIG[s].couleur,
                  borderColor: STATUT_CONFIG[s].couleur,
                },
              ]}
              onPress={() => setSelectedStatut(s)}
            >
              <Text style={[styles.statutTexte, selectedStatut === s && styles.statutTexteActif]}>
                {STATUT_CONFIG[s].emoji} {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Plateformes</Text>
        <View style={styles.platformsGrid}>
          {ALL_PLATFORMS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.platformBtn,
                selectedPlatforms.includes(p) && {
                  backgroundColor: getPlatformColor(p),
                  borderColor: getPlatformColor(p),
                },
              ]}
              onPress={() => togglePlatform(p)}
            >
              <Text style={[styles.platformTexte, selectedPlatforms.includes(p) && styles.platformTexteActif]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note personnelle</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Ex: Version Sword, 80% complété..."
          placeholderTextColor="#6B8A99"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnTexte}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4F7" },
  coverContainer: { height: 180, position: "relative", justifyContent: "flex-end" },
  cover: { position: "absolute", width: "100%", height: "100%" },
  coverOverlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(26,47,58,0.5)" },
  titre: { fontSize: 20, fontWeight: "bold", color: "#fff", padding: 16 },
  content: { padding: 16 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B8A99",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statuts: { flexDirection: "row", gap: 8 },
  statutBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4E4EC",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  statutTexte: { fontSize: 13, color: "#6B8A99" },
  statutTexteActif: { color: "#fff", fontWeight: "bold" },
  platformsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  platformBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D4E4EC",
    backgroundColor: "#fff",
  },
  platformTexte: { fontSize: 12, color: "#6B8A99" },
  platformTexteActif: { color: "#fff", fontWeight: "bold" },
  noteInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4E4EC",
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: "top",
    color: "#1A2F3A",
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  saveBtnTexte: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
