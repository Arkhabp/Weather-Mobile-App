import axios from 'axios';
import {API_KEY} from '../constants';

const forecase_endpoint = params =>
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const location_endpoint = params =>
  `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`;

const apiCall = async endpoint => {
  const option = {
    method: 'GET',
    url: endpoint,
  };
  try {
    const response = await axios.request(option);
    return response.data;
  } catch (error) {
    console.log('Error', error);
    return null;
  }
};

export const fetchWeatherForecast = params => {
  return apiCall(forecase_endpoint(params));
};
export const fetchLocations = params => {
  console.log('PARAMS', params);
  return apiCall(location_endpoint(params));
};
