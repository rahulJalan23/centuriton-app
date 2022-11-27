import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../core/theme";
import {
  getSelfData,
  getUserShiftById,
  submitNewIncident,
  uploadBase64Image,
} from "../services";
import moment from "moment";
import { showMessage } from "react-native-flash-message";

const ContainerDetails = ({ route, navigation }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [issueType, setIssueType] = useState("Medical Emergency");
  const [description, setDescription] = useState("");
  const [license, setLicense] = useState("");
  const [dob, setDob] = useState(new Date());
  const [continuedToWork, setContinuedToWork] = useState(true);
  const [signature, setSignature] = useState("");
  const [signatureKey, setSignatureKey] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  const { id } = route.params;
  const [shift, setShift] = useState();

  const onDobChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDob(currentDate);
  };

  const showDobMode = (currentMode) => {};

  const showDatepicker = () => {
    showDobMode("date");
  };

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {};

  const showTimepicker = () => {
    showMode("time");
  };

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const [res1, res2] = await Promise.all([
          axios.get(getUserShiftById(id), {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(getSelfData(id), {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setShift(res1.data);
        setUserData(res2.data);
        setLicense(res2.data.licenceNumber);

        if (res2.data.dob) setDob(new Date(res2.data.dob));
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
  }, []);

  async function handleSignatureUpload(image) {
    const token = await AsyncStorage.getItem("token");

    try {
      const { data } = await axios.post(
        uploadBase64Image(),
        {
          base64: String(image),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSignature(image);
      setSignatureKey(data.key);
      console.log("hi");
    } catch (error) {
      setSignature("");
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: "danger",
        });
      }
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    const timeOfIncident = moment(date).format("x");
    const dateOfBirth = moment(dob).format("x");

    const token = await AsyncStorage.getItem("token");

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        submitNewIncident(),
        {
          timeOfIncident: +timeOfIncident,
          userShiftId: +id,
          signatureFile: signatureKey,
          description: description,
          licenseNumber: license,
          dateOfBirth: +dateOfBirth,
          continuedToWork: continuedToWork,
          issueType: issueType,
          companyId: +shift?.shift?.companyId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);

      navigation.pop(2);
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        console.log(error.response.data.message);
        showMessage({
          message: error.response.data.message,
          type: "danger",
        });
      }
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Container
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            #123456
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Origin
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            Delhi Port
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Destination
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            Moscow Port
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Container type
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            Refrigerated ISO containers
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Gross weight
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            300 Kg
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Size
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            20m x 8m x 8m
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            No. of items
          </Text>
          <Text style={{ color: "gray", marginBottom: 5, fontSize: 14 }}>
            7
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              color: "black",
              marginBottom: 5,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Location
          </Text>
          <Text
            style={{
              color: "gray",
              marginBottom: 5,
              fontSize: 14,
              textAlign: "right",
            }}
          >
            hcbdhjsbjh
          </Text>
        </View>

        <View style={{ borderRadius: 10, marginTop: 10 }}>
          {submitting ? (
            <Button mode="contained" onPress={() => {}}>
              Submitting...
            </Button>
          ) : (
            <Button mode="contained" onPress={() => handleSubmit()}>
              Submit Report
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
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
    padding: 20,
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 5,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 10,
    borderRadius: 6,
  },
});

export default ContainerDetails;
