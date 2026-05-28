import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameList from "./screens/GameList";
import GameDetail from "./screens/GameDetail";
import Collection from "./screens/Collection";
import EditGame from "./screens/EditGame.js";
import Stats from "./screens/Stats";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Liste" component={GameList} options={{ title: "GamingDex 🎮" }} />
        <Stack.Screen name="Detail" component={GameDetail} options={{ title: "Détail du jeu" }} />
        <Stack.Screen name="Collection" component={Collection} options={{ title: "Ma collection" }} />
        <Stack.Screen name="EditGame" component={EditGame} options={{ title: "Modifier le jeu" }} />
        <Stack.Screen name="Stats" component={Stats} options={{ title: "Mes stats 📊" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
