import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { useState } from "react";
import { getCollection, updateGameStatus, updateNote } from "../storage";
import { getPlatformColor } from "../platformColors";

// Toutes les plateformes disponibles
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
      <Image source={{ uri: game.background_image }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.titre}>{game.name}</Text>

        <Text style={styles.label}>Statut :</Text>
        <View style={styles.statuts}>
          {["joué", "en cours", "backlog"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statutBtn, selectedStatut === s && styles.statutBtnActif]}
              onPress={() => setSelectedStatut(s)}
            >
              <Text style={[styles.statutTexte, selectedStatut === s && styles.statutTexteActif]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Plateformes :</Text>
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

        <Text style={styles.label}>Note personnelle :</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Ex: Version Sword, 80% complété..."
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnTexte}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cover: { width: "100%", height: 160 },
  content: { padding: 16 },
  titre: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "bold", color: "#888", marginTop: 16, marginBottom: 8 },
  statuts: { flexDirection: "row", gap: 8 },
  statutBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", alignItems: "center" },
  statutBtnActif: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  statutTexte: { fontSize: 13, color: "#888" },
  statutTexteActif: { color: "#fff", fontWeight: "bold" },
  platformsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  platformBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "#ddd" },
  platformTexte: { fontSize: 12, color: "#888" },
  platformTexteActif: { color: "#fff", fontWeight: "bold" },
  noteInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  saveBtnTexte: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
