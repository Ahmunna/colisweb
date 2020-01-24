import React from 'react';
import autoComplete from 'autocomplete.js';
import '../App.css';
class Form extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            value : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.queryAdress = this.queryAdress.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
    }

    //Input Form Handler Function
    async handleChange(event)
    {
        await this.setState({value : event.target.value});
        if( this.state.value !== '') this.queryAdress();        
    }

    queryAdress()
    {
        return fetch(`https://api-adresse.data.gouv.fr/search/?q=${this.state.value}&limit=100&autocomplete=1`)
        .then(res => res.json())
        .then((result) => result.features)
    }

    autoComplete()
    {

    }

    //Submit Form Handler Function
    handleSubmit(event)
    {
        event.prevenDefault();
    }

    render()
    {
        return(
            <div className="container">
                <input  type="text" value={this.state.value} onChange={this.handleChange}/>
                <input type="submit" value="Search" />
            </div>
        );
    }
   
}
export default Form;