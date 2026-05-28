import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getCollection, updateGameStatus, removeGame } from "../storage";
import { getPlatformColor } from "../platformColors";

const STATUT_CONFIG = {
  joué: { couleur: "#4CAF50", emoji: "✅" },
  "en cours": { couleur: "#2196F3", emoji: "🎮" },
  backlog: { couleur: "#FF9800", emoji: "📋" },
};

export default function Collection({ navigation }) {
  const [games, setGames] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState(null);
  const [filterStatut, setFilterStatut] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getCollection().then(setGames);
    }, []),
  );

  const allPlatforms = [...new Set(games.flatMap((g) => g.platforms || []))];

  const filteredGames = games.filter((g) => {
    const matchPlatform = filterPlatform ? g.platforms?.includes(filterPlatform) : true;
    const matchStatut = filterStatut ? g.statut === filterStatut : true;
    return matchPlatform && matchStatut;
  });

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🎮</Text>
        <Text style={styles.emptyText}>Ta collection est vide</Text>
        <Text style={styles.emptySubtext}>Recherche des jeux et ajoute-les !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtres par statut */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {[null, "joué", "en cours", "backlog"].map((s) => (
          <TouchableOpacity
            key={s ?? "tous"}
            style={[
              styles.filterTag,
              filterStatut === s && {
                backgroundColor: s ? STATUT_CONFIG[s].couleur : "#2196F3",
                borderColor: s ? STATUT_CONFIG[s].couleur : "#2196F3",
              },
            ]}
            onPress={() => setFilterStatut(s)}
          >
            <Text style={[styles.filterTexte, filterStatut === s && styles.filterTexteActif]}>
              {s ? `${STATUT_CONFIG[s].emoji} ${s}` : "Tous"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtres par plateforme */}
      {allPlatforms.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
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
              <Text style={styles.gameName} numberOfLines={1}>
                {item.name}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformRow}>
                {item.platforms?.map((p) => (
                  <View key={p} style={[styles.platformTag, { backgroundColor: getPlatformColor(p) }]}>
                    <Text style={styles.platformTexte}>{p}</Text>
                  </View>
                ))}
              </ScrollView>
              {item.note ? <Text style={styles.noteTexte}>📝 {item.note}</Text> : null}
              <View style={styles.statuts}>
                {["joué", "en cours", "backlog"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.tag,
                      item.statut === s && {
                        backgroundColor: STATUT_CONFIG[s].couleur,
                        borderColor: STATUT_CONFIG[s].couleur,
                      },
                    ]}
                    onPress={() => updateGameStatus(item.id, s).then(() => getCollection().then(setGames))}
                  >
                    <Text style={[styles.tagTexte, item.statut === s && styles.tagTexteActif]}>
                      {STATUT_CONFIG[s].emoji} {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate("EditGame", { game: item })}>
                <Text style={styles.actionBtn}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeGame(item.id).then(() => getCollection().then(setGames))}>
                <Text style={styles.actionBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4F7" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF4F7" },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#1A2F3A", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#6B8A99" },
  filterRow: { flexGrow: 0 },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterTag: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4E4EC",
    backgroundColor: "#fff",
  },
  filterTagActif: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  filterTexte: { fontSize: 13, color: "#6B8A99" },
  filterTexteActif: { color: "#fff" },
  game: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4E4EC",
  },
  cover: { width: 80, height: 55, borderRadius: 8, marginRight: 12, backgroundColor: "#D4E4EC" },
  infos: { flex: 1 },
  gameName: { fontSize: 15, fontWeight: "bold", color: "#1A2F3A", marginBottom: 6 },
  platformRow: { flexGrow: 0, marginBottom: 6 },
  platformTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 4 },
  platformTexte: { fontSize: 11, color: "#fff", fontWeight: "bold" },
  noteTexte: { fontSize: 12, color: "#6B8A99", fontStyle: "italic", marginBottom: 6 },
  statuts: { flexDirection: "row", gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#D4E4EC" },
  tagTexte: { fontSize: 11, color: "#6B8A99" },
  tagTexteActif: { color: "#fff", fontWeight: "bold" },
  actions: { alignItems: "center", gap: 10, paddingLeft: 8 },
  actionBtn: { fontSize: 16, color: "#6B8A99" },
});
