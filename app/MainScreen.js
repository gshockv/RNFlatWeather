import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import Weather from "./Weather";
import { API_KEY } from "./utils/WeatherAPIKey";

export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      temperature: 0,
      weatherCondition: null,
      error: null
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({isLoading: true});  
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: "Error fetching Weather conditions",
          isLoading: false
        });
      },
      {enableHighAccuracy: false, timeout: 50000}
    );
  }

  fetchWeather = (lat = 25, lon = 25) => {
        console.log(`***** API_KEY: ${API_KEY}`);

      fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
      )
      .then(response => response.json())
      .then(json => {
          console.log(json);
          this.setState({
              isLoading: false,
              temperature: json.main.temp,
              weatherCondition: json.weather[0].main,
          });
      })
      .catch(error => {
        this.setState({
            error: "Error fetching Weather conditions",
            isLoading: false
          });
      });
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingLabel}>Fetching data...</Text>
          </View>
        ) : (
          <Weather weather={this.state.weatherCondition} temperature={this.state.temperature} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#203A43",
    justifyContent: "center"
  },
  loadingContainer: {
    alignItems: "center"
  },
  loadingLabel: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16
  }
});
