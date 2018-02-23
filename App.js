import React from "react";
import { StyleSheet, Text, View, PermissionsAndroid } from "react-native";

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
    }
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
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 2000 }
    );

    // watchPosition wouldn't work properly without the options as the first argument
    // error as second
    // and success as third
    // Not sure why but it's different from getCurrentPosition
    this.watchId = navigator.geolocation.watchPosition(
      ({
        enableHighAccuracy: true,
        timeout: 2000,
        distanceFilter: 1
      },
      error => this.setState({ error: error.message }),
      position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          message: "watch position"
        });
      })
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
