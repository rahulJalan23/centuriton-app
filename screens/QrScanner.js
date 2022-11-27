import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { theme } from "../core/theme";
import { BarCodeScanner } from "expo-barcode-scanner";

const QrScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 430, width: Dimensions.get("window").width }}
      />
      {scanned && (
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => setScanned(false)}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Tap to Scan Again
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  },
  touchableOpacity: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    fontWeight: "600",
    width: "90%",
    marginTop: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    paddingHorizontal: 18,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 6,
  },
});

export default QrScanner;
