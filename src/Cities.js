import React from 'react';
import './App.css';
import styled from "styled-components";

const cityList = [ "Seattle", "Bellevue", "Redmond", "Tukwila", "Tacoma", "Edmonds", "Spokane", "Tri-Cities (Error)", "Port Angeles" ];

const Select = styled.select`
    padding: 1em;
    margin: 1em;
    background: white;
    border-radius: 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.3);
`;

class Cities extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onCityChange(e.target.value);
    }

    render() {
        return (
            <div>
                <label htmlFor="cities-id">Select a city in Washington to check their weather status:</label><br />
                <Select id="cities-id" name="cities-dropdown" onChange={this.handleChange}>
                    { cityList.map((el, key) => <option value={el} key={key}>{el}</option> )}
                </Select>
            </div>

        )
    }
};

export default Cities