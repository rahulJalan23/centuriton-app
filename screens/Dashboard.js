import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  View,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import { theme } from "../core/theme";
import * as Location from "expo-location";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { logout, storeFirstTimeState } from "../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getShipments } from "../services";
import moment from "moment";
import { showMessage } from "react-native-flash-message";
// import { StackedAreaChart } from "react-native-svg-charts";
// import * as shape from "d3-shape";

export default function Dashboard({ navigation }) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const { isFirstTime } = useSelector((state) => state.auth);

  const [shipments, setShipments] = useState({});
  const [timesheet, setTimesheet] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentShift, setCurrentShift] = useState(null);
  const [isCurrentShiftLoaded, setIsCurrentShiftLoaded] = useState(false);
  const [location, set_location] = useState({
    latitude: null,
    longitude: null,
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const data = [
    {
      month: new Date(2015, 0, 1),
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 2, 1),
      apples: 640,
      bananas: 960,
      cherries: 3640,
      dates: 400,
    },
    {
      month: new Date(2015, 3, 1),
      apples: 3320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ];

  const handleRefresh = async () => {
    // const token = await AsyncStorage.getItem('token');
    try {
      const { data } = await axios.get(getShipments(), {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setShipments(data);
      console.log({
        shipments: data,
      });
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: "danger",
        });
      }
      console.log(error);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            borderRadius: 5,
            width: "90%",
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
            marginBottom: 10,
            marginTop: 15,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                marginVertical: 2,
                alignSelf: "center",
                width: "48%",
                backgroundColor: "#CFF5E7",
                padding: 15,
                height: 100,
                borderRadius: 10,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "hidden",
              }}
              onPress={() => navigation.navigate("Track")}
            >
              <Ionicons
                name="list"
                size={23}
                color="black"
                style={{ marginRight: 7, marginTop: 5 }}
              />

              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  32
                </Text>

                <Text
                  style={{
                    color: "black",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  Total
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: -25,
                  right: -25,
                  borderRadius: 100,
                  height: 80,
                  width: 80,
                  zIndex: -1,
                  backgroundColor: "#59C1BD",
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginVertical: 2,
                alignSelf: "center",
                width: "48%",
                backgroundColor: "#A4BE7B",
                padding: 15,
                height: 100,
                borderRadius: 10,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "hidden",
              }}
              onPress={() => navigation.navigate("Track")}
            >
              <Ionicons
                name="list"
                size={23}
                color="black"
                style={{ marginRight: 7, marginTop: 5 }}
              />

              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  22
                </Text>

                <Text
                  style={{
                    color: "black",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  Shipped
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: -25,
                  right: -25,
                  borderRadius: 100,
                  height: 80,
                  width: 80,
                  zIndex: -1,
                  backgroundColor: "#5F8D4E",
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={{
                marginVertical: 2,
                alignSelf: "center",
                width: "48%",
                backgroundColor: "#ffabbd",
                padding: 15,
                height: 100,
                borderRadius: 10,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "hidden",
              }}
              onPress={() => navigation.navigate("Track")}
            >
              <Ionicons
                name="list"
                size={23}
                color="black"
                style={{ marginRight: 7, marginTop: 5 }}
              />

              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  5
                </Text>

                <Text
                  style={{
                    color: "black",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  Recieved
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: -25,
                  right: -25,
                  borderRadius: 100,
                  height: 80,
                  width: 80,
                  zIndex: -1,
                  backgroundColor: "#FA5B7D",
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginVertical: 2,
                alignSelf: "center",
                width: "48%",
                backgroundColor: "#ffc98f",
                padding: 15,
                height: 100,
                borderRadius: 10,
                display: "flex",
                flexDirection: "row",
                position: "relative",
                overflow: "hidden",
              }}
              onPress={() => navigation.navigate("Track")}
            >
              <Ionicons
                name="list"
                size={23}
                color="black"
                style={{ marginRight: 7, marginTop: 5 }}
              />

              <View>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  5
                </Text>

                <Text
                  style={{
                    color: "black",
                    marginTop: 2,
                    fontSize: 13,
                  }}
                >
                  Pending
                </Text>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: -25,
                  right: -25,
                  borderRadius: 100,
                  height: 80,
                  width: 80,
                  zIndex: -1,
                  backgroundColor: "#ff9626",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginVertical: 2,
            alignSelf: "center",
            width: "90%",
            border: "1px",
            borderColor: "gray",
            borderWidth: 1,
            padding: 18,
            borderRadius: 10,
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "black",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            Notifications
          </Text>

          <View
            style={{
              borderBottomColor: "gray",
              marginTop: 5,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />

          <View style={{ marginTop: 5, display: "flex", flexDirection: "row" }}>
            <View style={{ margin: 5, marginTop: 6, marginRight: 12 }}>
              <FontAwesome5 name="box" size={18} color="black" />
            </View>

            <View>
              <Text
                style={{
                  color: "black",
                  marginTop: 2,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                New orders on your way
              </Text>

              <Text
                style={{
                  color: "gray",
                  marginTop: 2,
                  fontSize: 13,
                  width: "90%",
                }}
              >
                7 new containers has been added to your way
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: 10, display: "flex", flexDirection: "row" }}
          >
            <View style={{ margin: 5, marginTop: 6, marginRight: 12 }}>
              <FontAwesome5 name="box" size={18} color="black" />
            </View>

            <View>
              <Text
                style={{
                  color: "black",
                  marginTop: 2,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                New orders on your way
              </Text>

              <Text
                style={{
                  color: "gray",
                  marginTop: 2,
                  fontSize: 13,
                  width: "90%",
                }}
              >
                7 new containers has been added to your way
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.touchableOpacityCluster}
          onPress={() => navigation.push("QrScanner")}
        >
          <AntDesign name="qrcode" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 15,
    display: "flex",
    alignItems: "center",
    height: Dimensions.get("window").height - 115,
  },
  touchableOpacity: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    width: 150,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    right: 10,
    bottom: 30,
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    fontWeight: "700",
    zIndex: 10,
    elevation: 10,
  },
  touchableOpacityCluster: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 10,
    bottom: 15,
    color: "white",
    backgroundColor: theme.colors.primary,
    elevation: 10,
    shadowColor: "grey",
    fontWeight: "700",
    elevation: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  tooltip: {
    backgroundColor: "white",
    height: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
