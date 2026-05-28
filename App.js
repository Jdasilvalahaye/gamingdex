import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameList from "./screens/GameList";
import GameDetail from "./screens/GameDetail";
import Collection from "./screens/Collection";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Liste" component={GameList} options={{ title: "GamingDex 🎮" }} />
        <Stack.Screen name="Detail" component={GameDetail} options={{ title: "Détail du jeu" }} />
        <Stack.Screen name="Collection" component={Collection} options={{ title: "Ma collection" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
