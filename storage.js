import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ma_collection";

export async function getCollection() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addGame(jeu, statut = "backlog") {
  const collection = await getCollection();
  const alreadyInCollection = collection.find((j) => j.id === jeu.id);
  if (alreadyInCollection) return; // était encore "dejaDedans"
  const newGame = {
    id: jeu.id,
    name: jeu.name,
    background_image: jeu.background_image,
    rating: jeu.rating,
    statut: statut,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...collection, newGame])); // CLE → STORAGE_KEY, nouveauJeu → newGame
}

export async function updateGameStatus(id, statut) {
  const collection = await getCollection();
  const updated = collection.map((j) => (j.id === id ? { ...j, statut } : j));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // CLE → STORAGE_KEY, mise_a_jour → updated
}

export async function removeGame(id) {
  const collection = await getCollection();
  const filtered = collection.filter((j) => j.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
