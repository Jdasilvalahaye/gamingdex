import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { useState, useEffect } from "react";

const API_KEY = "af8234613fef443c84fa04105b0121b5";

export default function GameList({ navigation }) {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGames(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  function fetchGames(query) {
    setLoading(true);
    const url = query
      ? `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=20`
      : `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setGames(data.results || []);
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un jeu..."
          placeholderTextColor="#6B8A99"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Detail", { jeu: item })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.background_image }} style={styles.cover} />
              <View style={styles.cardOverlay} />
              <View style={styles.cardInfos}>
                <Text style={styles.gameName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.gameRating}>⭐ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4F7" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D4E4EC",
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchBar: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#1A2F3A" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { color: "#6B8A99", fontSize: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  card: { height: 160, borderRadius: 16, overflow: "hidden", backgroundColor: "#D4E4EC" },
  cover: { position: "absolute", width: "100%", height: "100%" },
  cardOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(26,47,58,0.45)",
  },
  cardInfos: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 },
  gameName: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  gameRating: { color: "#FFD700", fontSize: 13 },
});
