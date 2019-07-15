import React, { Component } from "react";
import Raining from "./Raining";
import Credit from "./Credit";
import styled from "styled-components";

//these are keys for the APIs
const api_key = process.env.REACT_APP_WEATHER_API_KEY;
const appid_unsplash = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const axios = require("axios");

//styled-components
const Background = styled.div`
  background: url('${(props) => props.bgImage || "black"}');
  background-size: cover;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 2em;
`;

const Content = styled.div`
    flex: 1;
    text-align: center;
    margin: 0;
    padding-top: 8em;
`;

const Heading = styled.h1`
    margin: 0;
    font-size: 6em;
`;

const Caption = styled.section`
    font-size: 1em;
    character-spacing: 10px;
`;

class App extends Component {
    //isRaining is set to default false, even though we all know it's ALWAYS raining here
    state = {
        isRaining: false,
        results: [],
        user: {}
    };

    // loads the weather json from the api
    loadWeather = async (e) => {
        e.preventDefault();

        const api_call = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=seattle,us&appid=${api_key}`
        );
        const response = await api_call.json();

        if (response.main === "Rain" || "Drizzle" || "Thunderstorm") {
            this.setState({ isRaining: true });
        }
        console.log(response);
    };

    //this function will get the data from Unsplash using axios
    //it will return two objects: results and user
    //it will move those objects into state
    //so that it can be accessed by Credit and Background components
    async getBackgroundUnsplash() {
        let data;
        try {
            data = await axios
                .get(
                    `https://api.unsplash.com/search/photos/?query=seattle&client_id=${appid_unsplash}`
                )
                .then((response) => {
                    return response;
                })
                .then((response) => {
                    return response.data.results[0];
                    //return the results of the first object that will show
                    //this will return all data of the first photo including url and user
                    //IMPROVEMENT return a random photo of seattle
                });
        } catch (err) {
            console.log("Fetch error", err);
        }

        this.setState({
            url: data.urls.full,
            user: {
                username: data.user.username,
                url: data.user.links.self
            }
        });
        // return url; //for testing
    }

    componentDidMount() {
        //this will load the background so no function needs to declare it
        this.getBackgroundUnsplash();
    }

    render() {
        return (
            <Background bgImage={this.state.url}>
                <Content>
                    Is it raining in Seattle?
                    <Heading>
                        {/* returns a phrase if isRaining is true/false */}
                        <Raining isRaining={this.state.isRaining} />
                    </Heading>
                    <Caption>
                        <Credit getUser={this.state.user} />
                    </Caption>
                </Content>
            </Background>
        );
    }
}

export default App;
