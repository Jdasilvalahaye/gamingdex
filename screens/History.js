import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getHistory, removeFromHistory } from "../storage";
import { getPlatformColor } from "../platformColors";

export default function History({ navigation }) {
  const [games, setGames] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setGames);
    }, []),
  );

  const allPlatforms = [...new Set(games.flatMap((g) => g.platforms || []))];

  const filteredGames = games.filter((g) => (filterPlatform ? g.platforms?.includes(filterPlatform) : true));

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun jeu dans l'historique 📖</Text>
        <Text style={styles.emptySubtext}>Ajoute des jeux que tu as joués mais que tu ne possèdes plus !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtre par plateforme */}
      {allPlatforms.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterTag, filterPlatform === null && styles.filterTagActif]}
            onPress={() => setFilterPlatform(null)}
          >
            <Text style={[styles.filterTexte, filterPlatform === null && styles.filterTexteActif]}>Toutes</Text>
          </TouchableOpacity>
          {allPlatforms.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.filterTag,
                filterPlatform === p && { backgroundColor: getPlatformColor(p), borderColor: getPlatformColor(p) },
              ]}
              onPress={() => setFilterPlatform(filterPlatform === p ? null : p)}
            >
              <Text style={[styles.filterTexte, filterPlatform === p && styles.filterTexteActif]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={filteredGames}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyText: { fontSize: 18, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  emptySubtext: { fontSize: 14, color: "#888", textAlign: "center" },
  filterRow: { paddingHorizontal: 12, paddingVertical: 8, flexGrow: 0 },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  filterTagActif: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  filterTexte: { fontSize: 13, color: "#888" },
  filterTexteActif: { color: "#fff" },
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
