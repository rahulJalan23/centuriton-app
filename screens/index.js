import React, { useEffect, useState } from "react";
import { Provider as ThemeProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "../core/theme";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5, Feather, Entypo } from "@expo/vector-icons";
import GetStarted from "./GetStarted";
import Dashboard from "./Dashboard";
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { storeFirstTimeState, storeToken } from "../reducers/authReducer";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import QrScanner from "./QrScanner";
import Tracking from "./Tracking";
import PersonalDetails from "./PersonalDetails";
import ContainerDetails from "./ContainerDetails";
import RecieveContainer from "./RecieveContainer";

function LogoTitle() {
  return (
    <Text
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        paddingTop: 8,
        marginLeft: 20,
      }}
    >
      <Text style={{ fontWeight: "500", color: "#7e7e7e" }}>Easy</Text>
      <Text style={{ fontWeight: "600", color: "#03abab" }}>Ship</Text>
    </Text>
  );
}

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const Tabs = createBottomTabNavigator();

const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MARCUS"
        component={Dashboard}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerLeft: () => <LogoTitle />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <HomeStack.Screen
        name="QrScanner"
        component={QrScanner}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const TrackStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MARCUS"
        component={Tracking}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerLeft: () => <LogoTitle />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="ContainerDetails"
        component={ContainerDetails}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="RecieveContainer"
        component={RecieveContainer}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <HomeStack.Screen
        name="QrScanner"
        component={QrScanner}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const AccountStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MARCUS"
        component={PersonalDetails}
        options={{
          title: "", //Set Header Title
          headerStyle: {
            shadowOffset: {
              width: 0,
              height: 10,
            },
          },
          headerTintColor: "black", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerTitleAlign: "center",
          headerLeft: () => <LogoTitle />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert("You have no notifications")}
              style={{ marginLeft: 10 }}
            >
              <View
                style={{
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                <Entypo name="bell" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

const MainScreen = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const connector = useWalletConnect();

  useEffect(() => {
    (async () => {
      try {
        const localToken = await AsyncStorage.getItem("token");
        let isFirstTime = await AsyncStorage.getItem("isFirstTime");
        console.log(isFirstTime);
        dispatch(storeToken(localToken));
        // isFirstTime = isFirstTime == "true" ? true : false;
        // dispatch(storeFirstTimeState(Boolean(isFirstTime)));
        setLoading(false);
      } catch (error) {
        if (error?.response?.data?.message) {
          showMessage({
            message: error.response.data.message,
            type: "danger",
          });
        }
        console.log(error);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <View
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
          backgroundColor: theme.colors.background,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            position: "relative",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "black", fontSize: 23, fontWeight: "900" }}>
            EASY
          </Text>
          <Text style={{ color: "#063FED", fontSize: 23, fontWeight: "900" }}>
            SHIP
          </Text>
        </View>
        <ActivityIndicator size="large" color="#063FED" />
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <FlashMessage position="bottom" />
        {connector.connected ? (
          <Tabs.Navigator>
            <Tabs.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                headerShown: false,
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="md-home" size={20} color="black" />
                ),
                tabBarStyle: {
                  height: 60,
                  paddingBottom: 10,
                  paddingTop: 5,
                },
              }}
            />

            <Tabs.Screen
              name="Track"
              component={TrackStackScreen}
              options={{
                headerShown: false,
                tabBarLabel: "Tracking",
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="route" size={20} color="black" />
                ),
                tabBarStyle: {
                  height: 60,
                  paddingBottom: 10,
                  paddingTop: 5,
                },
              }}
            />

            <Tabs.Screen
              name="ContainerDetails"
              component={ContainerDetails}
              options={{
                tabBarVisible: false,
                tabBarButton: (props) => null,
              }}
            />

            <Tabs.Screen
              name="Account"
              component={AccountStackScreen}
              options={{
                headerShown: false,
                tabBarLabel: "Account",
                tabBarIcon: ({ color, size }) => (
                  <Feather name="user" size={20} color="black" />
                ),
                tabBarStyle: {
                  height: 60,
                  paddingBottom: 10,
                  paddingTop: 5,
                },
              }}
            />
          </Tabs.Navigator>
        ) : (
          <AuthStack.Navigator>
            <AuthStack.Screen
              name="GetStarted"
              component={GetStarted}
              options={{
                headerShown: false,
              }}
            />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  hamburger: {
    width: 27,
    height: 8,
    padding: 10,
  },
  hamburgerLine1: {
    borderRadius: 1.5,
    backgroundColor: "#7e7e7e",
    width: 27,
    height: 3,
  },
  hamburgerLine2: {
    borderRadius: 1.5,
    backgroundColor: "#7e7e7e",
    width: 15,
    height: 3,
    marginTop: 2,
  },
  backArrow: {
    marginTop: 5,
  },
  icon: {
    width: 23,
    height: 23,
  },
});

export default MainScreen;
