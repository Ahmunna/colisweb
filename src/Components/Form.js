import React from 'react';
import MapContainer from './MapContainer';
import '../App.css';
class Form extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            userInput : '',
            activeAdress : 0,
            adressesList : [],
            showAdresses : false,
            adressCoordinates : [],
            activeAdressLongitude : 0,
            activeAdressLatitude : 0

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.queryAdress = this.queryAdress.bind(this);
        this.handleKeysEvents = this.handleKeysEvents.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    //Input Form Handler Function
    async handleChange(event)
    {
        await this.setState({
            userInput : event.currentTarget.value,
            showAdresses : true
        });
        if( this.state.userInput !== '') this.queryAdress();        
    }
    //this function uses Fetch to get the result from the GEO api and updates the component's state
    queryAdress()
    {
        return fetch(`https://api-adresse.data.gouv.fr/search/?q=${this.state.userInput}&limit=100&autocomplete=1`)
        .then(res => res.json())
        .then((result) => this.setState({adressesList : result.features}))
    }

    
    //Submit Form Handler Function
    handleSubmit(event)
    {
        event.preventDefault();
        const {adressCoordinates, activeAdressLongitude,activeAdressLatitude } = this.state;
        this.setState({
            adressCoordinates : [...adressCoordinates, {longitude : activeAdressLongitude, latitude : activeAdressLatitude}]
        })
    }

    //handle key events
    async handleKeysEvents(event)
    {
        const {activeAdress, adressesList} = this.state;
        //if the user clicks enter
        if(event.keyCode === 13)
        {
            this.setState({
                activeAdress : 0 ,
                showAdresses : false, 
                userInput : adressesList[activeAdress].properties.label,
                activeAdressLongitude : adressesList[activeAdress].geometry.coordinates[0],
                activeAdressLatitude : adressesList[activeAdress].geometry.coordinates[1]
            })
            
        }
        //if the user clicks up arrow 
        else if(event.keyCode === 38)
        {
            if(activeAdress === 0 ) return;
            this.setState({activeAdress : activeAdress -1})
        }
        //if the user click down arrow
        else if(event.keyCode === 40)
        {
            if(activeAdress -1 === adressesList.length) return;

            this.setState({activeAdress : activeAdress + 1})
            
        }
    };

    //handle Click
    handleClick(event)
    {
        const {adressesList, activeAdress} = this.state;
        this.setState({
            activeAdress : 0,
            showAdresses : false,
            userInput : event.currentTarget.innerText,
            activeAdressLongitude : adressesList[activeAdress].geometry.coordinates[0],
            activeAdressLatitude : adressesList[activeAdress].geometry.coordinates[1]
        })
    }
    
    render()
    {
        let list;
        if(this.state.userInput !== '' && this.state.showAdresses)
        {
            if(this.state.adressesList.length)
            {
                list = (
                    <ul className="suggestions">
                        {this.state.adressesList.map((adress,index) => {
                            
                            let className;
                            if(index === this.state.activeAdress)
                            {
                                className = "suggestion-active";
                            }
                            return(
                                <li className={className} key={adress.properties.id} onClick={this.handleClick}>
                                    {adress.properties.label}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
            else
            {
                list = (
                    <div className="no-suggestions">
                        <em> No adresses Found !</em>
                    </div>
                );
            }
        }
        return(
            <div className="container">
                <div>
                    <input id="autoComplete" type="text" value={this.state.userInput} onChange={this.handleChange}  onKeyDown={this.handleKeysEvents}/>
                    {list}
                </div>
                <input type="submit" value="search" onClick={this.handleSubmit}/>
                {this.state.adressCoordinates.length > 0 && <MapContainer coordinates={this.state.adressCoordinates} />}
            </div>
        );
    }
   
}
export default Form;