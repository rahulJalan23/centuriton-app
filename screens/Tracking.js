import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Button,
} from 'react-native';
import { theme } from '../core/theme';
import * as Location from 'expo-location';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import { useIsFocused } from '@react-navigation/native';
import {
  acceptShiftById,
  applyShiftById,
  cancelShipment,
  declineShiftById,
  getAvailableShifts,
  getOfferedShifts,
  getShipments,
  recieveShipment,
  shipToNext,
} from '../services';

var radio_props = [
  { label: 'Day', value: 'day' },
  { label: 'Night', value: 'night' },
  { label: 'Both', value: 'both' },
];

const weekDaysLetters = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

function getISOWeekDates2(
  weekNo = moment(new Date()).weeks(),
  year = new Date().getFullYear()
) {
  let d = moment(
    String(year).padStart(4, '0') + 'W' + String(weekNo - 1).padStart(2, '0')
  );

  for (var dates = [], i = 0; i < 7; i++) {
    dates.push(d.format());
    d.add(1, 'day');
  }

  return dates;
}

export default function Tracking({ navigation }) {
  const isFocused = useIsFocused();

  const [cancelModalOpen, setcancelModalOpen] = useState(null);

  const [selectedTab, setSelectedTab] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [calenderModalVisible, setCalenderModalVisible] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [offeredJobs, setOfferedJobs] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [shipments, setShipments] = useState([]);

  const [filterDate, setFilterDate] = useState(new Date().toISOString());
  const [shiftTimePreference, setShiftTimePreference] = useState('both');
  const [radius, setRadius] = useState(0);

  const [recievedShipments, setRecievedShipments] = useState([]);
  const [pendingShipments, setPendingShipments] = useState([]);
  const [completedShipments, setCompletedShipments] = useState([]);

  const [location, set_location] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, set_error] = useState('');
  const [weekDays, setWeekDays] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      setLoading2(true);
      const data1 = await axios.get(getShipments(), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setShipments(data1.data);

      data1.data.map((item) => {
        if (item.status == 'pending') {
          setPendingShipments([...pendingShipments, item]);
        } else if (item.status == 'recieved') {
          setRecievedShipments([...recievedShipments, item]);
        } else if (item.status == 'completed' || item.status == 'cancelled') {
          setCompletedShipments([...completedShipments, item]);
        }
      });
      console.log({
        shipments: data1.data,
      });

      setLoading2(false);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
    }
  };

  useEffect(() => {
    if (weekDays.length == 0) {
      const weekNo = moment(new Date()).weeks();
      const weeksDays = getISOWeekDates2(weekNo);
      setWeekDays([...weeksDays]);
    }

    (async () => {
      await handleRefresh();
    })();
  }, [isFocused, filterDate, shiftTimePreference, radius]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  }, []);

  const handleAccept = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const data1 = await axios.put(
        acceptShiftById(id),
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage({
        message: 'Shift Accepted',
        type: 'success',
      });
      setOfferedJobs(offeredJobs.filter((job) => job.id !== id));
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
      console.log(error);
    }
  };

  const handleDecline = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const data1 = await axios.post(
        declineShiftById(id),
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage({
        message: 'Shift Declined',
        type: 'success',
      });
      setOfferedJobs(offeredJobs.filter((job) => job.id !== id));
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
      console.log(error);
    }
  };

  const handleCancel = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const data1 = await axios.put(
        cancelShipment(id),
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage({
        message: 'Applied Successfully',
        type: 'success',
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
      console.log(error);
    }
  };

  const handleShipToNext = async (shipment) => {
    const token = await AsyncStorage.getItem('token');
    const nextInspector = shipment.ports.find((x) => {
      return x.nextInspector;
    })?.nextInspector;

    try {
      const data1 = await axios.put(
        shipToNext(shipment.id),
        {
          nextInspector,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage({
        message: 'Applied Successfully',
        type: 'success',
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
      console.log(error);
    }
  };

  const handleRecieveShipment = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const data1 = await axios.post(
        recieveShipment(id),
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage({
        message: 'Applied Successfully',
        type: 'success',
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        showMessage({
          message: error.response.data.message,
          type: 'danger',
        });
      }
      console.log(error);
    }
  };
  const handleWeekChange = (date) => {
    setFilterDate(moment(date).format());
    const weekNo = moment(moment(date).format()).weeks();
    const weeksResponse = getISOWeekDates2(weekNo);
    setWeekDays([...weeksResponse]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 15,
              // alignItems: "center",
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  marginBottom: 15,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <MaterialIcons name="filter-alt" size={18} />
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: '500',
                    marginLeft: 5,
                  }}
                >
                  Filters
                </Text>
              </View>

              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <MaterialIcons
                  name="cancel"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={{ textAlign: 'left', fontWeight: '500', marginLeft: 5 }}
              >
                Shifts
              </Text>
            </View>

            <View>
              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: '500',
                  marginLeft: 5,
                  marginBottom: 10,
                }}
              >
                Work Area
              </Text>

              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {radius} Km
              </Text>

              <Slider
                style={{ height: 40 }}
                minimumValue={0}
                maximumValue={16}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                onValueChange={(e) => setRadius(e)}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                padding: 3,
                paddingVertical: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  color: 'white',
                }}
              >
                Apply Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={calenderModalVisible}
        onRequestClose={() => {
          setCalenderModalVisible(!calenderModalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 15,
              // alignItems: "center",
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View style={{}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    marginBottom: 15,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <AntDesign name="calendar" size={18} />
                  <Text
                    style={{
                      textAlign: 'left',
                      fontWeight: '500',
                      marginLeft: 5,
                    }}
                  >
                    Calender
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    marginBottom: 15,
                  }}
                  onPress={() => setCalenderModalVisible(false)}
                >
                  <MaterialIcons name="close" size={18} />
                </TouchableOpacity>
              </View>

              <CalendarPicker
                onDateChange={(date) => {
                  handleWeekChange(date.toISOString().toString());
                  setCalenderModalVisible(false);
                }}
                width={290}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModalOpen !== null}
        onRequestClose={() => {
          setcancelModalOpen(null);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 15,
              // alignItems: "center",
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  marginBottom: 15,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: '500',
                    marginLeft: 5,
                    fontSize: 16,
                  }}
                >
                  Cancel Reason
                </Text>
              </View>

              <TouchableOpacity onPress={() => setcancelModalOpen(null)}>
                <MaterialIcons
                  name="cancel"
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={{
                  textAlign: 'left',
                  fontWeight: '500',
                  marginLeft: 5,
                }}
              >
                Are you sure you want to cancel this shipment?
              </Text>
            </View>

            <View>
              <TextInput
                placeholder="Enter Reason"
                multiline={true}
                numberOfLines={4}
                style={{
                  textAlignVertical: 'top',
                  borderWidth: 1,
                  marginVertical: 10,
                  padding: 10,
                  borderRadius: 3,
                }}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.danger,
                padding: 3,
                paddingVertical: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={() => {
                setcancelModalOpen(null);
              }}
            >
              <Text
                style={{
                  color: 'white',
                }}
              >
                Cancel Shipment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 15,
          marginBottom: 10,
          borderBottomColor: '#e8e8e8',
          borderBottomWidth: 1,
        }}
      >
        <TouchableOpacity
          style={[
            {
              borderColor: theme.colors.primary,
              width: '33.33%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            selectedTab === 1 && { borderBottomWidth: 2 },
          ]}
          onPress={() => setSelectedTab(1)}
        >
          <Text
            style={[
              {
                fontSize: 14,
                color: 'black',
                paddingBottom: 7,
                paddingHorizontal: 15,
                width: '100%',
                textAlign: 'center',
              },
              selectedTab === 1 && {
                color: theme.colors.primary,
                fontWeight: 'bold',
              },
            ]}
          >
            Recieved
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              borderColor: theme.colors.primary,
              width: '33.33%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            selectedTab === 2 && { borderBottomWidth: 2 },
          ]}
          onPress={() => setSelectedTab(2)}
        >
          <Text
            style={[
              {
                fontSize: 14,
                color: 'black',
                paddingBottom: 7,
                paddingHorizontal: 15,
                width: '100%',
                textAlign: 'center',
              },
              selectedTab === 2 && {
                color: theme.colors.primary,
                fontWeight: 'bold',
              },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              borderColor: theme.colors.primary,
              width: '33.33%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
            selectedTab === 3 && { borderBottomWidth: 2 },
          ]}
          onPress={() => setSelectedTab(3)}
        >
          <Text
            style={[
              {
                fontSize: 14,
                color: 'black',
                paddingBottom: 7,
                paddingHorizontal: 15,
                width: '100%',
                textAlign: 'center',
              },
              selectedTab === 3 && {
                color: theme.colors.primary,
                fontWeight: 'bold',
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 20,
          marginTop: 5,
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            borderColor: theme.colors.primary,
            borderRadius: 5,
            borderWidth: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            paddingHorizontal: 15,
          }}
          onPress={() => setCalenderModalVisible(true)}
        >
          <AntDesign name="calendar" size={18} />
          <Text
            style={{
              fontSize: 13,
              color: 'grey',
              paddingLeft: 10,
            }}
          >
            {moment(weekDays[0]).format('MMM')} {moment(weekDays[0]).date()} -{' '}
            {moment(weekDays[6]).format('MMM')} {moment(weekDays[6]).date()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 10,
            padding: 6,
          }}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons color="white" name="filter-alt" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 1 ? (
          <View
            style={{
              width: '100%',
              paddingHorizontal: 15,
              overflow: 'visible',
              paddingBottom: 50,
              marginBottom: 10,
            }}
          >
            {[1, 1, 1, 1].map((shipment, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  navigation.push('ContainerDetails', {
                    id: 2,
                  })
                }
                style={{
                  padding: 15,
                  paddingHorizontal: 19,
                  width: '100%',
                  marginVertical: 7,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  borderRadius: 15,
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 300,
                  elevation: 4,
                  shadowColor: '#171717',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: '700' }}>
                    Container
                    <Text
                      style={{ fontSize: 12, fontWeight: '500', marginLeft: 6 }}
                    >
                      {' '}
                      #123456
                    </Text>
                  </Text>

                  <Text style={{ fontSize: 11, fontWeight: '500' }}>
                    20 Nov 2022
                  </Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingBottom: 8,
                    borderColor: 'gray',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                      }}
                    >
                      {shipment.origin}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      Origin
                    </Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                        color: 'grey',
                      }}
                    >
                      TO
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                      }}
                    >
                      {shipment.destination}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      Departure
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        marginTop: 4,
                      }}
                    >
                      HSN Code
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '500',
                        marginTop: 2,
                      }}
                    >
                      32672638
                    </Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.colors.danger,
                        padding: 3,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        setcancelModalOpen(i);
                      }}
                    >
                      {!true ? (
                        <ActivityIndicator size="large" color="#5D0039" />
                      ) : (
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          Cancel
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.colors.primary,
                        padding: 3,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        handleCancel(shipment.id);
                      }}
                    >
                      {!true ? (
                        <ActivityIndicator size="large" color="#5D0039" />
                      ) : (
                        <Button
                          style={{
                            color: 'white',
                          }}
                          onPress={(shipment) => {
                            handleShipToNext(shipment);
                          }}
                          title="Ship to Next"
                        ></Button>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : selectedTab === 2 ? (
          <View
            style={{
              width: '100%',
              paddingHorizontal: 15,
              overflow: 'visible',
              paddingBottom: 50,
              marginBottom: 10,
            }}
          >
            {[1, 1, 1, 1, 1, 1].map(async (shipment, i) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.push('RecieveContainer', { id: 2 })}
                  key={i}
                  style={{
                    padding: 15,
                    paddingHorizontal: 19,
                    width: '100%',
                    marginVertical: 7,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 15,
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 300,
                    elevation: 4,
                    shadowColor: '#171717',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 17, fontWeight: '700' }}>
                      Container
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '500',
                          marginLeft: 6,
                        }}
                      >
                        {' '}
                        #123456
                      </Text>
                    </Text>

                    <Text style={{ fontSize: 11, fontWeight: '500' }}>
                      20 Nov 2022
                    </Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      paddingBottom: 8,
                      borderColor: 'gray',
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '700',
                          marginTop: 10,
                          textAlign: 'center',
                        }}
                      >
                        DELPRT
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          marginTop: 2,
                          textAlign: 'center',
                        }}
                      >
                        Origin
                      </Text>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '700',
                          marginTop: 10,
                          textAlign: 'center',
                          color: 'grey',
                        }}
                      >
                        TO
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '700',
                          marginTop: 10,
                          textAlign: 'center',
                        }}
                      >
                        MUSPRT
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          marginTop: 2,
                          textAlign: 'center',
                        }}
                      >
                        Departure
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          marginTop: 4,
                        }}
                      >
                        HSN Code
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '500',
                          marginTop: 2,
                        }}
                      >
                        32672638
                      </Text>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderColor: theme.colors.primary,
                          borderWidth: 2,
                          padding: 3,
                          paddingVertical: 8,
                          paddingHorizontal: 15,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 5,
                        }}
                        onPress={() =>
                          navigation.push('RecieveContainer', { id: 2 })
                        }
                      >
                        {!true ? (
                          <ActivityIndicator size="large" color="#5D0039" />
                        ) : (
                          <Button
                            style={{
                              color: theme.colors.primary,
                            }}
                            // onPress={(shipment) => {
                            //   handleShipToNext(shipment);
                            // }}
                            title="Approve"
                          ></Button>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              paddingHorizontal: 15,
              overflow: 'visible',
              paddingBottom: 50,
              marginBottom: 10,
            }}
          >
            {[1, 1, 1, 1, 1].map((shipment, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  padding: 15,
                  paddingHorizontal: 19,
                  width: '100%',
                  marginVertical: 7,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  borderRadius: 15,
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 300,
                  elevation: 4,
                  shadowColor: '#171717',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: '700' }}>
                    Container
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '500',
                        marginLeft: 6,
                      }}
                    >
                      {' '}
                      #123456
                    </Text>
                  </Text>

                  <Text style={{ fontSize: 11, fontWeight: '500' }}>
                    20 Nov 2022
                  </Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingBottom: 8,
                    borderColor: 'gray',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                      }}
                    >
                      DELPRT
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      Origin
                    </Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                        color: 'grey',
                      }}
                    >
                      TO
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '700',
                        marginTop: 10,
                        textAlign: 'center',
                      }}
                    >
                      MUSPRT
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      Departure
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        marginTop: 4,
                      }}
                    >
                      HSN Code
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '500',
                        marginTop: 2,
                      }}
                    >
                      32672638
                    </Text>
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.colors.primary,
                        padding: 3,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        handleApply(ele.id);
                      }}
                    >
                      {!true ? (
                        <ActivityIndicator size="large" color="#5D0039" />
                      ) : (
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          Shipped
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.touchableOpacityCluster}
        onPress={() => navigation.push('QrScanner')}
      >
        <AntDesign name="qrcode" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    // display: "flex",
    // alignItems: "center",
  },
  touchableOpacity: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: 150,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 30,
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    fontWeight: '700',
    zIndex: 1,
  },
  touchableOpacityCluster: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 15,
    backgroundColor: 'white',
    color: theme.colors.primary,
    elevation: 5,
    shadowColor: 'grey',
    fontWeight: '700',
    zIndex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  tooltip: {
    backgroundColor: 'white',
    height: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  touchableOpacityCluster: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 15,
    color: 'white',
    backgroundColor: theme.colors.primary,
    elevation: 10,
    shadowColor: 'grey',
    fontWeight: '700',
    elevation: 10,
  },
});
