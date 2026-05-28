import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getCollection, updateGameStatus, removeGame } from "../storage";
import { getPlatformColor } from "../platformColors";

export default function Collection({ navigation }) {
  const [games, setGames] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState(null);
  const [filterStatut, setFilterStatut] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getCollection().then(setGames);
    }, []),
  );

  // Récupère toutes les plateformes uniques de la collection
  const allPlatforms = [...new Set(games.flatMap((g) => g.platforms || []))];

  const filteredGames = games.filter((g) => {
    const matchPlatform = filterPlatform ? g.platforms?.includes(filterPlatform) : true;
    const matchStatut = filterStatut ? g.statut === filterStatut : true;
    return matchPlatform && matchStatut;
  });

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Ta collection est vide 🎮</Text>
        <Text style={styles.emptySubtext}>Recherche des jeux et ajoute-les !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtres par statut */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {[null, "joué", "en cours", "backlog"].map((s) => (
          <TouchableOpacity
            key={s ?? "tous"}
            style={[styles.filterTag, filterStatut === s && styles.filterTagActif]}
            onPress={() => setFilterStatut(s)}
          >
            <Text style={[styles.filterTexte, filterStatut === s && styles.filterTexteActif]}>{s ?? "Tous"}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtres par plateforme */}
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
              {/* Tags plateformes */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformRow}>
                {item.platforms?.map((p) => (
                  <View key={p} style={[styles.platformTag, { backgroundColor: getPlatformColor(p) }]}>
                    <Text style={styles.platformTexte}>{p}</Text>
                  </View>
                ))}
              </ScrollView>
              {item.note ? <Text style={styles.noteTexte}>📝 {item.note}</Text> : null}
              {/* Boutons statut */}
              <View style={styles.statuts}>
                {["joué", "en cours", "backlog"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.tag, item.statut === s && styles.tagActif]}
                    onPress={() => updateGameStatus(item.id, s).then(() => getCollection().then(setGames))}
                  >
                    <Text style={[styles.tagTexte, item.statut === s && styles.tagTexteActif]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate("EditGame", { game: item })}>
                <Text style={styles.editer}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeGame(item.id).then(() => getCollection().then(setGames))}>
                <Text style={styles.supprimer}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#888" },
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
  platformRow: { flexGrow: 0, marginBottom: 6 },
  platformTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 4 },
  platformTexte: { fontSize: 11, color: "#fff", fontWeight: "bold" },
  statuts: { flexDirection: "row", gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  tagActif: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  tagTexte: { fontSize: 12, color: "#888" },
  tagTexteActif: { color: "#fff" },
  supprimer: { fontSize: 18, color: "#ccc", paddingLeft: 8 },
  noteTexte: { fontSize: 12, color: "#888", fontStyle: "italic", marginBottom: 4 },
  actions: { alignItems: "center", gap: 8 },
  editer: { fontSize: 16 },
});
