import React, { Component } from "react";
import Credit from "./Credit";
import Raining from "./Raining"
import Cities from "./Cities"
import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

//these are keys for the APIs
// const api_key = process.env.REACT_APP_WEATHER_API_KEY;
// const appid_unsplash = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const api_key = "976b34bcb10c584654ed3dadf365da5e";
const appid_unsplash = "48aa243333c6fae5faa1dfe2fe483cfb55459673e1f3457d9556d3f6238d1d4e";
const axios = require("axios");

const Background = styled(LazyLoadImage)`
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0.5;
`;

const Content = styled.div`
    text-align: center;
    margin: 0 auto;
    color: white;
    text-shadow: 0 1px 8px rgba(0, 0, 0, .8);
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    width: 100%;
`;

const Title = styled.h1`
    font-family: Arial;
    font-size: 1em;
    margin: 0;
`;

const Weather = styled.h2`
    margin: 0;
    font-size: 3.5em;
`;

const Caption = styled.section`
    position: absolute;
    bottom: 10%;
    right: 10%;
`;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRaining: null,
            user: {},
            weatherDescription: '',
            city: "Seattle", //default city
        };

    this.loadWeather = this.loadWeather.bind(this);
    this.onCityChange = this.onCityChange.bind(this);
    }

    // loads the weather json from the openweathermap api
    loadWeather = async () => {
        try{
        var result = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.state.city},us&appid=${api_key}`
        )
        .then((response) => response.json())

        //receives the first (or only) weather type from the result
        var currentWeather = result.weather[0];

        // from OPM Api:
        //main is the group of weather parameters
        //description describes the weather condition within the group
        this.setState({
            isRaining: (currentWeather.main === ("Rain" || "Drizzle" || "Thunderstorm")),
            weatherDescription: currentWeather.description
        })

        } catch(err) {
            this.setState({
                hasError: true
            })
        }

    }

    //this function will get the data from Unsplash using axios
    //it will return two objects: results and user
    //it will move those objects into state
    //so that it can be accessed by Credit and Background components
    async getBackgroundUnsplash() {
        let data;
        // var searchKeyword = this.state.isRaining ? `raining+weather+${this.state.city}` : `${this.state.city}`;
        var searchKeyword = this.state.isRaining ? `raining+weather+seattle` : `seattle`;
        try {
            data = await axios
                .get(
                    `https://api.unsplash.com/search/photos/?query=${searchKeyword}&client_id=${appid_unsplash}`
                )
                .then((response) => {
                    //returning a random photo of seattle
                    var max = Math.round(Math.random() * Math.floor(response.data.results.length-1));
                    return response.data.results[max];
                });
        } catch (err) {
            console.log("Fetch error on Unsplash API", err);
        }

        this.setState({
            url: data.urls.regular,
            user: {
                username: data.user.username,
                url: data.user.links.html
            }
        });
    }

    // called when Cities component passes it a new City from the dropdown box
    async onCityChange(city) {
        // Wait until this state of the city has been changed before moving on
        await this.setState({
            city
        })
    }

    componentWillMount() {
        // Load all APIs
        this.loadWeather();
        this.getBackgroundUnsplash();
    }

    componentDidUpdate(prevProps, prevState) {
        // If the city was changed, load the weather again
        if(prevState.city !== this.state.city){
            this.setState({
                isRaining: null,
                hasError: false //reset the error message
            })
            this.loadWeather();

        }

        //load unsplash api again if the state changes
        //this will check for a different query to show 'rainy' photos (though it sometimes might not be, unsplash's search isn't always accurate)
        // if(prevState.isRaining !== this.state.isRaining) {
        //     this.getBackgroundUnsplash();
        // }
        //I still get errors with this, will need to improve on this later
        //On first load, the app fetches 2 photos because state 'technically' changed
    }

    render() {
        return (
            <div>
                <Background
                    alt="Background Image"
                    src={this.state.url}
                    />
                <Content>
                    <Title>Is it raining in {this.state.city}?</Title>
                    <Weather>

                        {this.state.hasError === true ? <span>There has been an error. Please select a different city.</span>
                        :  this.state.isRaining === null ? "Checking.." :  <Raining isRaining={this.state.isRaining} weather={this.state.weatherDescription} />
                        }
                    </Weather>
                    <Cities onCityChange={this.onCityChange} />
                    <Caption>
                        <Credit getUser={this.state.user} />
                    </Caption>
                </Content>

            </div>
        );
    }
}

export default App;
