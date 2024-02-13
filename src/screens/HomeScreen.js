import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Helper from '../helper/helper';
import {theme} from '../theme';
import {debounce} from 'lodash';
import {useToast} from 'react-native-toast-notifications';
import LottieView from 'lottie-react-native';
import {Modalize} from 'react-native-modalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {
  weatherImages,
  weatherAnimations,
  weatherAnimationsNight,
} from '../constants';
import {getData, storeData} from '../utils/asyncStorage';

const HomeScreen = () => {
  const toast = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [onRefresh, setOnRefresh] = useState(false);
  const [timeNow, setTimeNow] = useState();

  const handleLocation = loc => {
    setLocations([]);
    setShowSearch(false);
    setIsloading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setWeather(data);
      setIsloading(false);
      setNotFound(false);
      // setTimeNow(data.location.localtime);
      storeData('CITY', loc.name);
      conditionTime(data.location.localtime);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        if (data.length > 0) {
          setLocations(data);
          setNotFound(false);
          setOnRefresh(false);
        } else {
          toast.show('City not found', {data: {title: 'Toast title'}});
          setNotFound(true);
          setOnRefresh(false);
          setLocations([]);
        }
      });
    } else {
      setNotFound(false);
      setOnRefresh(false);
      setLocations([]);
    }
  };

  const fetchDefaulttWeather = async () => {
    setIsloading(true);
    let defaultCIty = await getData('CITY');
    let cityName = 'Tangerang';
    if (defaultCIty) cityName = defaultCIty;
    fetchWeatherForecast({
      cityName,
      days: '7',
    }).then(data => {
      setWeather(data);
      setIsloading(false);
      setOnRefresh(false);
      conditionTime(data.location.localtime);
      // setTimeNow(data.location.localtime);
    });
  };

  const modalRef = useRef(<Modalize />);

  const openModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.open();
    }
  }, []);

  const conditionTime = time => {
    let dateString = time;
    var parts = dateString.split(' ');
    var tanggal = parts[0];
    var waktu = parts[1];

    // Pisahkan jam dan menit dari waktu
    var waktuParts = waktu.split(':');
    var jam = waktuParts[0];

    return setTimeNow(jam);
  };

  const refreshing = () => {
    setOnRefresh(true);
    fetchDefaulttWeather();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 900));

  const {current, location} = weather;

  useEffect(() => {
    fetchDefaulttWeather();
  }, []);

  return (
    <GestureHandlerRootView style={{backgroundColor: 'black', flex: 1}}>
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'black',
        }}
        refreshControl={
          <RefreshControl
            refreshing={onRefresh}
            onRefresh={refreshing}
            // colors={'white'}
          />
        }>
        <StatusBar
          animated={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
          translucent={true}
        />
        <Image
          source={require('../assets/images/bg.png')}
          style={styles.image}
          blurRadius={60}
          position="absolute"
        />
        <SafeAreaView style={styles.wrapperSection}>
          {/* Search Section */}
          <View
            style={{
              zIndex: 50,
              position: 'absolute',
              top: 40,
              alignSelf: 'center',
              paddingHorizontal: Helper.normalize(8),
            }}>
            <View
              style={
                showSearch
                  ? [styles.searchBar, {backgroundColor: theme.bgWhite(0.2)}]
                  : [styles.searchBar, {backgroundColor: 'transparent'}]
              }>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search city"
                  placeholderTextColor={theme.lightGray}
                  style={styles.textInput}
                />
              ) : null}
              <TouchableOpacity
                style={styles.searchIcon}
                onPress={() => setShowSearch(!showSearch)}>
                <MagnifyingGlassIcon
                  size={Helper.normalize(22)}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View style={styles.containerLocations}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderStyle = showBorder ? 0.3 : 0;
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      style={[
                        styles.containerListLoc,
                        {borderBottomWidth: borderStyle},
                      ]}>
                      <MapPinIcon
                        size={Helper.normalize(18)}
                        color={theme.lightGray}
                      />
                      <Text style={styles.textLoc}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Forecast Section */}
          {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, justifyContent: 'space-between'}}
          keyboardVerticalOffset={0}> */}
          {notFound ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  width: Helper.normalize(210),
                  height: Helper.normalize(210),
                  marginBottom: Helper.normalize(-20),
                  alignItems: 'center',
                }}>
                <LottieView
                  source={require('../assets/animations/notFound.json')}
                  style={{width: '100%', height: '100%'}}
                  autoPlay
                  loop
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: Helper.normalize(14),
                    fontWeight: '500',
                  }}>
                  Location not found
                </Text>
              </View>
            </View>
          ) : (
            <>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <ActivityIndicator size="large" color={'white'} />
                  <Text
                    style={{color: 'white', marginLeft: Helper.normalize(2)}}>
                    Loading...
                  </Text>
                </View>
              ) : (
                <View style={styles.wrapperForcastSect}>
                  {/* Location */}
                  <Text style={styles.locationTextBold}>
                    {location?.name},{' '}
                    <Text style={styles.locationTextThin}>
                      {location?.country}
                    </Text>
                  </Text>

                  {/* Weather Image */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: Helper.normalize(210),
                        height: Helper.normalize(210),
                        marginBottom: Helper.normalize(-20),
                      }}>
                      {timeNow > 19 ? (
                        <LottieView
                          source={
                            weatherAnimationsNight[current?.condition?.text] ||
                            weatherAnimationsNight['Sunny']
                          }
                          style={{width: '100%', height: '100%'}}
                          autoPlay
                          loop
                        />
                      ) : (
                        <LottieView
                          source={
                            weatherAnimations[current?.condition?.text] ||
                            weatherAnimations['Sunny']
                          }
                          style={{width: '100%', height: '100%'}}
                          autoPlay
                          loop
                        />
                      )}
                    </View>
                  </View>
                  {/* Degree Celcius */}
                  <View style={{gap: 2}}>
                    <Text style={styles.degreeText}>
                      {current?.temp_c}&#176;
                    </Text>
                    <Text style={styles.degreeDescText}>
                      {current?.condition.text}
                    </Text>
                  </View>

                  {/* Other Status */}
                  <View style={styles.otherStatusWrapper}>
                    <View style={styles.OtherStatusComponent}>
                      <Image
                        source={require('../assets/icons/wind.png')}
                        style={styles.otherStatusIcons}
                      />
                      <Text style={styles.otherStatusText}>
                        {current?.wind_kph}km
                      </Text>
                    </View>
                    <View style={styles.OtherStatusComponent}>
                      <Image
                        source={require('../assets/icons/drop.png')}
                        style={styles.otherStatusIcons}
                      />
                      <Text style={styles.otherStatusText}>
                        {current?.humidity}%
                      </Text>
                    </View>
                    <View style={styles.OtherStatusComponent}>
                      <Image
                        source={require('../assets/icons/sun.png')}
                        style={styles.otherStatusIcons}
                      />
                      <Text style={styles.otherStatusText}>
                        {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                      </Text>
                    </View>
                  </View>

                  {/* Daily Forecast  */}
                  <View
                    style={{
                      marginBottom: Helper.normalize(2),
                      gap: Helper.normalize(10),
                      bottom: 0,
                      // marginTop: 100,
                    }}>
                    <View style={styles.containerDailyForcast}>
                      <CalendarDaysIcon
                        size={Helper.normalize(22)}
                        color="white"
                      />
                      <Text style={styles.dailyForcastText}>
                        Daily forecast
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{
                        paddingHorizontal: Helper.normalize(12),
                      }}
                      showsHorizontalScrollIndicator={false}>
                      {weather?.forecast?.forecastday.map((item, index) => {
                        let date = new Date(item.date);
                        let options = {weekday: 'long'};
                        let dayName = date.toLocaleDateString('en-US', options);
                        return (
                          <View
                            key={index}
                            style={styles.containerDailyForecastComp}>
                            <Image
                              // source={weatherImages[item?.day?.condition?.text]}
                              source={
                                weatherImages[item?.day?.condition?.text] ||
                                weatherImages['Sunny']
                                // weatherImages[
                                //   item?.day?.condition?.text
                                //     ? item?.day?.condition?.text
                                //     : 'Sunny' // Provide the key for the default image
                                // ]
                              }
                              style={{
                                width: Helper.normalize(40),
                                height: Helper.normalize(40),
                                padding: 0,
                              }}
                            />
                            <Text
                              style={{
                                color: 'white',
                                fontWeight: '400',
                                fontSize: Helper.normalize(12),
                              }}>
                              {dayName}
                            </Text>
                            <Text
                              style={{
                                color: 'white',
                                fontWeight: '500',
                                fontSize: Helper.normalize(18),
                                marginTop: -6,
                              }}>
                              {item?.day?.avgtemp_c}&#176;
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              )}
            </>
          )}
          <Text onPress={openModal}>{'Open Modal'}</Text>
          {/* </KeyboardAvoidingView> */}
          <Modalize ref={modalRef}>
            <View style={{padding: 20}}>
              <Text style={{fontSize: 22, fontWeight: 'bold', lineHeight: 34}}>
                {'This is a modal'}
              </Text>
              <Text>
                {
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et euismod nisl. Nulla facilisi. Aenean et mi volutpat, iaculis libero non, luctus quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur euismod dapibus metus, eget egestas quam ullamcorper eu.'
                }
              </Text>
            </View>
          </Modalize>
        </SafeAreaView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  wrapperSection: {
    flex: 1,
    paddingTop: Helper.normalize(30),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    borderRadius: Helper.normalize(22),
  },
  textInput: {
    paddingLeft: Helper.normalize(16),
    flex: 1,
    color: 'white',
  },
  searchIcon: {
    backgroundColor: theme.bgWhite(0.3),
    borderRadius: Helper.normalize(16),
    padding: Helper.normalize(6),
    margin: Helper.normalize(8),
  },
  containerLocations: {
    // position: 'absolute',
    backgroundColor: 'grey',
    top: Helper.normalize(5),
    borderRadius: Helper.normalize(18),
    paddingTop: Helper.normalize(5),
  },
  containerListLoc: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Helper.normalize(10),
    marginBottom: Helper.normalize(6),
  },
  textLoc: {
    color: 'black',
    fontSize: Helper.normalize(14),
    fontWeight: '600',
    marginLeft: Helper.normalize(2),
  },
  wrapperForcastSect: {
    marginHorizontal: Helper.normalize(4),
    paddingBottom: Helper.normalize(23),
    paddingTop: Helper.normalize(56),
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: Helper.normalize(2),
    // minHeight: '100%',
  },
  locationTextBold: {
    color: 'white',
    textAlign: 'center',
    fontSize: Helper.normalize(18),
    fontWeight: '700',
  },
  locationTextThin: {
    color: theme.lightGray,
    textAlign: 'center',
    fontSize: Helper.normalize(16),
    fontWeight: '400',
  },
  degreeText: {
    fontSize: Helper.normalize(42),
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    marginLeft: Helper.normalize(6),
  },
  degreeDescText: {
    fontSize: Helper.normalize(18),
    textAlign: 'center',
    color: 'white',
    fontWeight: '400',
  },
  otherStatusWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Helper.normalize(5),
    paddingHorizontal: Helper.normalize(14),
  },
  OtherStatusComponent: {
    flexDirection: 'row',
    gap: Helper.normalize(5),
    alignContent: 'center',
  },
  otherStatusIcons: {
    width: Helper.normalize(22),
    height: Helper.normalize(22),
  },
  otherStatusText: {
    fontSize: Helper.normalize(16),
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
  },
  containerDailyForcast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Helper.normalize(8),
    marginHorizontal: Helper.normalize(5),
    gap: Helper.normalize(5),
  },
  dailyForcastText: {color: 'white', fontSize: Helper.normalize(14)},
  containerDailyForecastComp: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Helper.normalize(86),
    borderRadius: Helper.normalize(16),
    padding: Helper.normalize(10),
    gap: Helper.normalize(5),
    marginRight: Helper.normalize(5),
    backgroundColor: theme.bgWhite(0.15),
  },
});
