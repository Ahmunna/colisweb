import React from 'react';
import { Map, GoogleApiWrapper,Marker } from 'google-maps-react';
import config from '../config';
import '../App.css';

/*

This component is responsable for displaying the map using Google Maps api

*/
class MapContainer extends React.Component
{
    //this function displays all the markers from the props to the map
    displayMarkers = () => {
      return this.props.coordinates.map((coordinate, index) => {
        return <Marker key={index} id={index} position={{
         lat: coordinate.latitude,
         lng: coordinate.longitude
       }}
       onClick={() => console.log("You clicked me!")} />
      })
    }

    shouldComponentUpdate(nextProps,nextState)
    {
      if(this.props.coordinates.length === nextProps.coordinates.length) return false;
      return true;
    }

    render()
    {
       /* France position as initial center for the map*/
        return(
              <Map
              google={this.props.google}
              zoom={5}
              style={mapStyle}
              initialCenter={{ lat: 48.864716, lng: 2.349014}}
            >
            {this.displayMarkers()}
            </Map>  
          
        );
    }
}

const mapStyle = {

  width : '100%',
  height : '50%',
}


export default GoogleApiWrapper({
    apiKey: config.apiKey
  })(MapContainer);