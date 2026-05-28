import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import GameList from "./screens/GameList";
import GameDetail from "./screens/GameDetail";
import Collection from "./screens/Collection";
import EditGame from "./screens/EditGame";
import History from "./screens/History";
import Stats from "./screens/Stats";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GameList" component={GameList} options={{ title: "GamingDex 🎮" }} />
      <Stack.Screen name="Detail" component={GameDetail} options={{ title: "Détail du jeu" }} />
    </Stack.Navigator>
  );
}

function CollectionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CollectionScreen" component={Collection} options={{ title: "Ma collection" }} />
      <Stack.Screen name="EditGame" component={EditGame} options={{ title: "Modifier le jeu" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2196F3",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tab.Screen
          name="Recherche"
          component={SearchStack}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text> }}
        />
        <Tab.Screen
          name="Collection"
          component={CollectionStack}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎮</Text> }}
        />
        <Tab.Screen
          name="Historique"
          component={History}
          options={{
            headerShown: true,
            title: "Historique",
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>📖</Text>,
          }}
        />
        <Tab.Screen
          name="Stats"
          component={Stats}
          options={{
            headerShown: true,
            title: "Mes stats",
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
