import React from "react";
import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";
import config from "./config.js";

// grants permission from android device to access location
async function requestLocation() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === PermissionsAndroid.RESULT.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export default class App extends React.Component {
  state = {
    message: "no action being run",
    error: "no error",
    userLocation: {
      latitude: 32.8,
      longitude: -172.4
    },
    savedToFirebase: false,
    userId: "12345"
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          message: "get current position"
        });
        fetch(config.FB_URL + this.state.userId + ".json", {
          method: "PATCH",
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        })
          .then(res => this.setState({ savedToFirebase: res.ok }))
          .catch(err => this.setState({ error: err }));
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 2000 }
    );

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          message: "watch position"
        });
        fetch(config.FB_URL + this.state.userId + ".json", {
          method: "PATCH",
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        })
          .then(res => this.setState({ savedToFirebase: res.ok }))
          .catch(err => this.setState({ error: err }));
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 2000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>`current geolocation action: {this.state.message}`</Text>
        <Text>`error: {this.state.error}`</Text>
        <Text>`latitude: {this.state.userLocation.latitude}`</Text>
        <Text>`lognitude: {this.state.userLocation.longitude}`</Text>
        <Text>
          `Saved To Firebase: {this.state.savedToFirebase.toString()}`
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
