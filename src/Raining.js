import React from 'react';
import './App.css';

const Raining = (props) => (
    <span>
        {props.isRaining ? "Yes, it is raining." : `No, it is not. The condition is ${props.weather} today.`}
    </span>
);

export default Raining;
