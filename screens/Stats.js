import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getPlatformColor } from "../platformColors";
import { getCollection, getHistory } from "../storage";

export default function Stats() {
  const [games, setGames] = useState([]);
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getCollection().then(setGames);
      getHistory().then(setHistory);
    }, []),
  );

  const total = games.length;
  const joué = games.filter((g) => g.statut === "joué").length;
  const enCours = games.filter((g) => g.statut === "en cours").length;
  const backlog = games.filter((g) => g.statut === "backlog").length;

  const platformCount = {};
  games.forEach((g) => {
    g.platforms?.forEach((p) => {
      platformCount[p] = (platformCount[p] || 0) + 1;
    });
  });
  const topPlatforms = Object.entries(platformCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const genreCount = {};
  games.forEach((g) => {
    g.genres?.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const playedPlatformCount = {};
  [...games.filter((g) => g.statut === "joué"), ...history].forEach((g) => {
    g.platforms?.forEach((p) => {
      playedPlatformCount[p] = (playedPlatformCount[p] || 0) + 1;
    });
  });
  const topPlayedPlatforms = Object.entries(playedPlatformCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalJoués = joué + history.length;

  if (total === 0 && history.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun jeu dans ta collection 🎮</Text>
        <Text style={styles.emptySubtext}>Ajoute des jeux pour voir tes stats !</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Résumé global */}
      <Text style={styles.sectionTitre}>Résumé</Text>
      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: "#E3F2FD" }]}>
          <Text style={[styles.cardNombre, { color: "#2196F3" }]}>{total}</Text>
          <Text style={styles.cardLabel}>Total</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#E8F5E9" }]}>
          <Text style={[styles.cardNombre, { color: "#4CAF50" }]}>{joué}</Text>
          <Text style={styles.cardLabel}>Joués</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#FFF3E0" }]}>
          <Text style={[styles.cardNombre, { color: "#FF9800" }]}>{enCours}</Text>
          <Text style={styles.cardLabel}>En cours</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#FCE4EC" }]}>
          <Text style={[styles.cardNombre, { color: "#E91E63" }]}>{backlog}</Text>
          <Text style={styles.cardLabel}>Backlog</Text>
        </View>
      </View>

      {/* Barre de progression */}
      {total > 0 && (
        <>
          <Text style={styles.sectionTitre}>Progression</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              {joué > 0 && <View style={[styles.progressSegment, { flex: joué, backgroundColor: "#4CAF50" }]} />}
              {enCours > 0 && <View style={[styles.progressSegment, { flex: enCours, backgroundColor: "#2196F3" }]} />}
              {backlog > 0 && <View style={[styles.progressSegment, { flex: backlog, backgroundColor: "#FF9800" }]} />}
            </View>
            <View style={styles.legendeRow}>
              <View style={styles.legende}>
                <View style={[styles.legendePuce, { backgroundColor: "#4CAF50" }]} />
                <Text style={styles.legendeTexte}>Joué ({Math.round((joué / total) * 100)}%)</Text>
              </View>
              <View style={styles.legende}>
                <View style={[styles.legendePuce, { backgroundColor: "#2196F3" }]} />
                <Text style={styles.legendeTexte}>En cours ({Math.round((enCours / total) * 100)}%)</Text>
              </View>
              <View style={styles.legende}>
                <View style={[styles.legendePuce, { backgroundColor: "#FF9800" }]} />
                <Text style={styles.legendeTexte}>Backlog ({Math.round((backlog / total) * 100)}%)</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Top plateformes collection */}
      {topPlatforms.length > 0 && (
        <>
          <Text style={styles.sectionTitre}>Top plateformes</Text>
          {topPlatforms.map(([platform, count]) => (
            <View key={platform} style={styles.barRow}>
              <Text style={styles.barLabel}>{platform}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { flex: count, backgroundColor: getPlatformColor(platform) }]} />
                <View style={{ flex: total - count }} />
              </View>
              <Text style={styles.barCount}>{count}</Text>
            </View>
          ))}
        </>
      )}

      {/* Top genres */}
      {topGenres.length > 0 && (
        <>
          <Text style={styles.sectionTitre}>Top genres</Text>
          {topGenres.map(([genre, count]) => (
            <View key={genre} style={styles.barRow}>
              <Text style={styles.barLabel}>{genre}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { flex: count, backgroundColor: "#9C27B0" }]} />
                <View style={{ flex: total - count }} />
              </View>
              <Text style={styles.barCount}>{count}</Text>
            </View>
          ))}
        </>
      )}

      {/* Expériences de jeu */}
      <Text style={styles.sectionTitre}>Expériences de jeu</Text>
      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: "#ECEFF1" }]}>
          <Text style={[styles.cardNombre, { color: "#607D8B" }]}>{history.length}</Text>
          <Text style={styles.cardLabel}>Plus en ma possession</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#ECEFF1" }]}>
          <Text style={[styles.cardNombre, { color: "#607D8B" }]}>{totalJoués}</Text>
          <Text style={styles.cardLabel}>Total joués</Text>
        </View>
      </View>

      {/* Répartition par plateforme des jeux joués */}
      {topPlayedPlatforms.length > 0 && (
        <>
          <Text style={styles.sectionTitre}>Joués par plateforme</Text>
          {topPlayedPlatforms.map(([platform, count]) => (
            <View key={platform} style={styles.barRow}>
              <Text style={styles.barLabel}>{platform}</Text>
              <View style={styles.barContainer}>
                <View style={[styles.barFill, { flex: count, backgroundColor: getPlatformColor(platform) }]} />
                <View style={{ flex: Math.max(totalJoués - count, 0) }} />
              </View>
              <Text style={styles.barCount}>{count}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#888" },
  sectionTitre: { fontSize: 18, fontWeight: "bold", marginTop: 24, marginBottom: 12 },
  cardsRow: { flexDirection: "row", gap: 8 },
  card: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
  cardNombre: { fontSize: 28, fontWeight: "bold" },
  cardLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  progressContainer: { marginBottom: 8 },
  progressBar: { flexDirection: "row", height: 20, borderRadius: 10, overflow: "hidden", backgroundColor: "#f2f2f2" },
  progressSegment: { height: "100%" },
  legendeRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  legende: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendePuce: { width: 10, height: 10, borderRadius: 5 },
  legendeTexte: { fontSize: 12, color: "#888" },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  barLabel: { fontSize: 13, color: "#333", width: 120 },
  barContainer: {
    flex: 1,
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  barFill: { height: "100%", borderRadius: 6 },
  barCount: { fontSize: 13, color: "#888", width: 24, textAlign: "right" },
});
