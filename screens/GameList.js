import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

const API_KEY = "af8234613fef443c84fa04105b0121b5";

export default function GameList({ navigation }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`)
      .then((response) => response.json())
      .then((data) => setGames(data.results));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.collectionBtn} onPress={() => navigation.navigate("Collection")}>
        <Text style={styles.collectionBtnTexte}>📚 Ma collection</Text>
      </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  game: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cover: { width: 80, height: 50, borderRadius: 6, marginRight: 12 },
  gameName: { fontSize: 16, flex: 1 },
  collectionBtn: { backgroundColor: "#2196F3", padding: 12, margin: 12, borderRadius: 8, alignItems: "center" },
  collectionBtnTexte: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
