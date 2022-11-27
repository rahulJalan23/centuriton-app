import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Background from "../components/Background";
import Button from "../components/Button";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { theme } from "../core/theme";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

export default function GetStarted({ navigation }) {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <Background>
      <Text
        style={{
          fontSize: 26,
          color: "black",
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
          paddingVertical: 12,
        }}
      >
        Shipping simplified
      </Text>
      <Text style={{}}>Minimize processing time.</Text>
      <Text style={{}}>Maximize Transparency.</Text>

      <Image
        source={require("../assets/signInBg.png")}
        style={{ height: 300, width: "100%", marginVertical: 60 }}
      />

      {!connector.connected ? (
        <TouchableOpacity onPress={connectWallet} style={styles.button}>
          <Text style={styles.text}>Connect wallet</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={killSession} style={styles.button}>
            <Text style={styles.text}>Log out</Text>
          </TouchableOpacity>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
        </>
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    color: "#FFFFFF",
    borderRadius: 8,
    width: 300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
