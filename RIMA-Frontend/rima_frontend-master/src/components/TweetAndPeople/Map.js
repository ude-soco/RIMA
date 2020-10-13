import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  Circle,
} from "react-google-maps";

class Map extends Component {
  onCenterChanged = () => {
    this.props.updateInputs(this.refs.mapRef.getCenter().toJSON());
  };
  render() {
    const place = this.props.place;

    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: place.lat,
          lng: place.lng,
        }}
        ref="mapRef"
        onCenterChanged={this.onCenterChanged}
      >
        <Marker
          position={{
            lat: place.lat,
            lng: place.lng,
          }}
        />{" "}
        <Circle
          center={{
            lat: place.lat,
            lng: place.lng,
          }}
          radius={place.radius}
        />{" "}
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(Map));
