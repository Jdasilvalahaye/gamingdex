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
      .then((response) => response.json())
      .then((data) => {
        setGames(data.results || []);
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un jeu..."
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
      />
      {loading ? (
        <Text style={styles.loading}>Chargement...</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.game} onPress={() => navigation.navigate("Detail", { jeu: item })}>
              <Image source={{ uri: item.background_image }} style={styles.cover} />
              <Text style={styles.gameName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchBar: { margin: 12, padding: 10, borderRadius: 10, backgroundColor: "#f2f2f2", fontSize: 16 },
  loading: { textAlign: "center", marginTop: 40, color: "#888" },
  game: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cover: { width: 80, height: 50, borderRadius: 6, marginRight: 12 },
  gameName: { fontSize: 16, flex: 1 },
});
