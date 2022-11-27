import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  StatusBar,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../core/theme';
import {
  getUserDetails,
  updateUser,
  uploadFiles,
  uploadPhoto,
} from '../services';
import CalendarPicker from 'react-native-calendar-picker';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import { logout, storeFirstTimeState } from '../reducers/authReducer';
import { useDispatch } from 'react-redux';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const shortenAddress = (address) => {
  return `${address.slice(0, 15)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

const createFormData = (photo) => {
  const data = new FormData();

  data.append('file', {
    name: 'profilePicture',
    type: 'image/jpeg',
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  return data;
};

('use strict');
const PersonalDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [dob, setDob] = useState(false);

  const [portCode, setPortCode] = useState(null);
  const connector = useWalletConnect();

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const handleChoosePhoto = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (response && !response.didCancel) {
      setPhoto(response);
    }
  };

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      setPortCode(await AsyncStorage.getItem('portCode'));
    })();
  }, []);
  console.log({ portCode });

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 40 }}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              width: 120,
              height: 120,
              backgroundColor: theme.colors.primary,
              overflow: 'hidden',
              borderRadius: 100,
              borderWidth: 2,
              borderColor: theme.colors.primary,
            }}
            onPress={handleChoosePhoto}
          >
            {photo ? (
              <Image
                source={{ uri: photo.uri }}
                style={{ height: 123, width: '100%' }}
              />
            ) : userData.image?.length > 0 ? (
              <Image
                style={{ height: 123 }}
                source={{
                  uri: uploadFiles(userData.image),
                }}
              />
            ) : (
              <Image
                source={require('../assets/emptyDp.png')}
                style={{ height: 123, width: '100%' }}
              />
            )}
          </TouchableOpacity>

          <Text style={{ width: '90%', textAlign: 'center', marginTop: 8 }}>
            {shortenAddress(connector.accounts[0])}
          </Text>
        </View>

        <Formik
          initialValues={{
            name: portCode,
            email: userData?.email,
            contactNumber: userData?.contactNumber,
            address: userData.address,
            height: userData?.height,
            bodyType: userData?.bodyType,
          }}
          onSubmit={async (values) => {
            setSubmitting(true);

            try {
              await AsyncStorage.setItem('portCode', String(values.name));
            } catch (error) {
              console.log(error?.response?.data);
            }
            showMessage({
              message: 'Profile Updated',
              type: 'success',
            });
            setSubmitting(false);
          }}
        >
          {(props) => (
            <View>
              <Text style={{ color: 'gray', marginBottom: 5 }}>Port Code</Text>
              <TextInput
                style={styles.input}
                onChangeText={props.handleChange('name')}
                value={props.values.name}
              />

              <Text style={{ color: 'gray', marginVertical: 5 }}>Address</Text>

              <TextInput
                multiline
                numberOfLines={5}
                style={styles.input}
                onChangeText={props.handleChange('height')}
                value={props.values.height ? String(props.values.height) : ''}
              />

              <View style={{ borderRadius: 10, marginBottom: 20 }}>
                <Button mode="contained" onPress={props.submitForm}>
                  Update
                </Button>
              </View>
              <View style={{ borderRadius: 10, marginBottom: 20 }}>
                <Button mode="contained" onPress={killSession}>
                  Logout
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 5,
    textAlignVertical: 'top',
    paddingTop: 17,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 10,
    borderRadius: 6,
  },
});

export default PersonalDetails;
