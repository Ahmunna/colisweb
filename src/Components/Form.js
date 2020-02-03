import React,{useState} from 'react';
import MapContainer from './MapContainer';
import '../App.css';
const Form = () =>
{
    //define states
    const [userInput,setUserInput] = useState('');
    const [activeAdress,setActiveAdress] = useState(0);
    const [adressesList,setAdressesList] = useState([]);
    const [showAdresses,setShowAdresses] = useState(false);
    const [adressCoordinates,setAdressCoordinates] = useState([]);
    const [activeAdressLongitude,setActiveAdressLongitude] = useState(0);
    const [activeAdressLatitude,setActiveAdressLatitude] = useState(0);
    

    //Input Form Handler Function
    const handleChange = async (event) =>
    {
        await Promise.all([setUserInput(event.currentTarget.value),setShowAdresses(true)])
        if( userInput !== '') queryAdress();        
    }
    //this function uses Fetch to get the result from the GEO api and updates the component's state
    const queryAdress = () =>
    {
        return fetch(`https://api-adresse.data.gouv.fr/search/?q=${userInput}&limit=100&autocomplete=1`)
        .then(res => res.json())
        .then((result) => setAdressesList(result.features))
    }

    
    //Submit Form Handler Function
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        setAdressCoordinates([...adressCoordinates,{longitude : activeAdressLongitude, latitude : activeAdressLatitude}])
    }

    //handle key events
    const handleKeysEvents = (event) =>
    {
        //if the user clicks enter
        if(event.keyCode === 13)
        {
            setActiveAdress(0);
            setShowAdresses(false);
            setUserInput(adressesList[activeAdress].properties.label);
            setActiveAdressLongitude(adressesList[activeAdress].geometry.coordinates[0]);
            setActiveAdressLatitude( adressesList[activeAdress].geometry.coordinates[1]);
        }
        //if the user clicks up arrow 
        else if(event.keyCode === 38)
        {
            if(activeAdress === 0 ) return;
            setActiveAdress(activeAdress -1);
        }
        //if the user click down arrow
        else if(event.keyCode === 40)
        {
            if(activeAdress -1 === adressesList.length) return;
            setActiveAdress(activeAdress  + 1);
        }
    };

    //handle Click
    const handleClick = (event) =>
    {
        setActiveAdress(0);
        setShowAdresses(false);
        setUserInput(event.currentTarget.innerText);
        setActiveAdressLongitude(adressesList[activeAdress].geometry.coordinates[0]);
        setActiveAdressLatitude(adressesList[activeAdress].geometry.coordinates[1]);
    }
    
    let list;
    if(userInput !== '' && showAdresses)
    {
        if(adressesList.length)
        {
            list = (
                <ul className="suggestions">
                    {adressesList.map((adress,index) => {
                        
                        let className;
                        if(index === activeAdress)
                        {
                            className = "suggestion-active";
                        }
                        return(
                            <li className={className} key={adress.properties.id} onClick={handleClick}>
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
                <input id="autoComplete" type="text" value={userInput} onChange={handleChange}  onKeyDown={handleKeysEvents}/>
                {list}
            </div>
            <input type="submit" value="search" onClick={handleSubmit}/>
            {adressCoordinates.length > 0 && <MapContainer coordinates={adressCoordinates} />}
        </div>
    );
   
}
export default Form;