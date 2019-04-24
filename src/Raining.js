import React from 'react';
import './App.css';

function Raining(props) {
    const isRaining = props.isRaining;

    if(isRaining){
        return <span>Yes, it is raining</span>
    }

    return <span>No, it is not.</span>
};

export default Raining;
