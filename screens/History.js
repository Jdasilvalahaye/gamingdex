import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getHistory, removeFromHistory } from "../storage";
import { getPlatformColor } from "../platformColors";

export default function History({ navigation }) {
  const [games, setGames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setGames);
    }, []),
  );

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun jeu dans l'historique 📖</Text>
        <Text style={styles.emptySubtext}>Ajoute des jeux que tu as joués mais que tu ne possèdes plus !</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.game}>
          <Image source={{ uri: item.background_image }} style={styles.cover} />
          <View style={styles.infos}>
            <Text style={styles.gameName}>{item.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformRow}>
              {item.platforms?.map((p) => (
                <View key={p} style={[styles.platformTag, { backgroundColor: getPlatformColor(p) }]}>
                  <Text style={styles.platformTexte}>{p}</Text>
                </View>
              ))}
            </ScrollView>
            {item.note ? <Text style={styles.noteTexte}>📝 {item.note}</Text> : null}
          </View>
          <TouchableOpacity onPress={() => removeFromHistory(item.id).then(() => getHistory().then(setGames))}>
            <Text style={styles.supprimer}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyText: { fontSize: 18, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  emptySubtext: { fontSize: 14, color: "#888", textAlign: "center" },
  game: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cover: { width: 70, height: 45, borderRadius: 6, marginRight: 12 },
  infos: { flex: 1 },
  gameName: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  platformRow: { flexGrow: 0, marginBottom: 4 },
  platformTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 4 },
  platformTexte: { fontSize: 11, color: "#fff", fontWeight: "bold" },
  noteTexte: { fontSize: 12, color: "#888", fontStyle: "italic" },
  supprimer: { fontSize: 18, color: "#ccc", paddingLeft: 8 },
});
