import React from 'react';
import { Map, GoogleApiWrapper,Marker } from 'google-maps-react';
import config from '../config';
import '../App.css';

/*

This component is responsable for displaying the map using Google Maps api

*/
const MapContainer = props =>
{
    //this function displays all the markers from the props to the map
    const displayMarkers = () => {
      return props.coordinates.map((coordinate, index) => {
        return <Marker key={index} id={index} position={{
         lat: coordinate.latitude,
         lng: coordinate.longitude
       }}
       />
      })
    }

    /* France position as initial center for the map*/
      return(
            <Map
              google={props.google}
              zoom={5}
              style={mapStyle}
              initialCenter={{ lat: 48.864716, lng: 2.349014}}
            >
            {displayMarkers()}
            </Map>     
      );

}

const mapStyle = {

  width : '100%',
  height : '50%'
}

const googleWrapper = GoogleApiWrapper({ apiKey: config.apiKey })(MapContainer);

/*
React.memo was introduced in React 16.6 To replace the lifecyle method shouldComponentUpdate
*/
export default React.memo(googleWrapper);