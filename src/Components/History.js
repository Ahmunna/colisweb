import React from 'react';

const History = (props) => 
{
    let HistoryContent;
    //handle Modal content
    if( props.adressesList !== undefined && props.adressesList.length)
    {
        HistoryContent = (
        <ul>
            {props.adressesList.map((adress,index) => <li key={index}>{adress}</li>)}
        </ul>
        );
    }
    else
    {
        HistoryContent = <em>History is Clear</em>
    }
    
    //Arrow function to handle to Modal's closing
    const handleClose = (event) => props.onClose && props.onClose(event);
    
    if(props.show)
    {
        return (
            <div className="modal">
                <h2>History</h2>
                <div className="content">{HistoryContent}</div>
                <div className="actions">
                    <input type="submit" value="Close" onClick={handleClose} />
                </div>    
            </div>
        );
    }
    else
    return null;
    
}


export default React.memo(History);
