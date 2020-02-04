import React,{useState, useEffect} from 'react';
import MapContainer from './MapContainer';
import { useCookies } from 'react-cookie';
import '../App.css';
import History from './History';
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
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies, setCookie] = useCookies(['adresses']);
    const [show,setShow] = useState(false);

    //we gonna use this flag to stop useEffect from running, it only runs after the first render
    const flag = "i am a quick learner ;)"

    //initialise the cookies array after the first render of the application
    useEffect( () => 
    {
        if(cookies.adresses === undefined)
        setCookie('adresses',[]);
        // eslint-disable-next-line
    },[flag]);

    //Trigger the queryadress whenever the userInput changes
    useEffect(() => {
        if( userInput !== '') 
        queryAdress();
        // eslint-disable-next-line
    },[userInput]);
    
    
    //Input Form Handler Function
    const handleChange = (event) =>
    {
        setUserInput(event.currentTarget.value);
        setShowAdresses(true);    
    }
    //this function uses Fetch to get the result from the GEO api and updates the component's state
    const queryAdress = () =>
    {
        fetch(`https://api-adresse.data.gouv.fr/search/?q=${userInput}&limit=100&autocomplete=1`)
        .then(res => res.json())
        .then((result) => setAdressesList(result.features))
    }

    
    //Submit Form Handler Function
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        if(userInput !== '')
        {
            setAdressCoordinates([...adressCoordinates,{longitude : activeAdressLongitude, latitude : activeAdressLatitude}])
            setCookie('adresses',cookies.adresses.concat([userInput]));
            setErrorMessage('');
        }
        else
        {
            setErrorMessage('Please enter an adress');
        }
        //handle key events
        
    }

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


    const handleShow = () => setShow(!show);

    //Adresses List
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
        <>
        <div className="container">
        <h3>{errorMessage}</h3>
            <div>
                <input id="autoComplete" type="text" value={userInput} onChange={handleChange}  onKeyDown={handleKeysEvents}/>
                {list}
            </div>
            <input type="submit" value="search" onClick={handleSubmit}/>
            <input type="submit" value="history" onClick={handleShow}/>
            {adressCoordinates.length > 0 && <MapContainer coordinates={adressCoordinates} />}
            <History show={show} adressesList={cookies.adresses} onClose={handleShow}/>
        </div>
        </>
    );
   
}
export default Form;