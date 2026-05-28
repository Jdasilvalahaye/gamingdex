import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getCollection, updateGameStatus, removeGame } from "../storage";

export default function Collection() {
  const [games, setGames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getCollection().then(setGames);
    }, []),
  );

  if (games.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Ta collection est vide 🎮</Text>
        <Text style={styles.emptySubtext}>Recherche des jeux et ajoute-les !</Text>
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
          <TouchableOpacity onPress={() => removeGame(item.id).then(() => getCollection().then(setGames))}>
            <Text style={styles.supprimer}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#888" },
  game: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cover: { width: 70, height: 45, borderRadius: 6, marginRight: 12 },
  infos: { flex: 1 },
  gameName: { fontSize: 15, fontWeight: "bold", marginBottom: 6 },
  statuts: { flexDirection: "row", gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  tagActif: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  tagTexte: { fontSize: 12, color: "#888" },
  tagTexteActif: { color: "#fff" },
  supprimer: { fontSize: 18, color: "#ccc", paddingLeft: 8 },
});
