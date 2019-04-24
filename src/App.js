import React, { Component } from 'react';
import Raining from './Raining';
// import Background from './Background';
import Credit from './Credit';
// import Unsplash from 'unsplash-js';
import {
  Box,
  Image,
  Heading,
  Text
} from 'rebass'

//hiding the key so it doesn't show up when committed
const api_key = process.env.REACT_APP_WEATHER_API_KEY;
// const Unsplash = require('unsplash-js').default;
const appid_unsplash = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const axios = require('axios');


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

    const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=seattle,us&appid=${api_key}`);
    const response = await api_call.json();
    
    if(response.main === "Rain"){
      this.setState({isRaining: true});
    }
    console.log(response);
  };

  //this function will get the data from Unsplash using axios
  //it will return two objects: results and user
  //it will move those objects into state
  //so that it can be accessed by Credit and Background components
  async getBackgroundUnsplash() {
    let data;
    try{
      data = await axios
        .get(
          `https://api.unsplash.com/search/photos/?page=1&per_page=1&query=seattle&client_id=${appid_unsplash}`
        ).then(response => { return response })
        .then(response => { 
          return response.data.results[0]; 
          //return the results of the first object that will show
          //this will return all data of the first photo including url and user
          //IMPROVEMENT return a random photo of seattle
           }) 
    } catch(err) {
        console.log('Fetch error', err);
      };

      this.setState({
        url: data.urls.full,
        user: {
          username: data.user.username,
          url: data.user.links.self
        }
      })
      // return url; //for testing
  };

  componentDidMount() {
    //this will load the background so no function needs to declare it
    this.getBackgroundUnsplash();
  };
  
  render() {
      const Background = {
        // scale the background image for screen view
        // backgroundImage: `(url${props.getUrl})`
        // width: "100vw",
        backgroundImage: "url(" + this.state.url + ")"
      }
      return (
        <div className="App" style={Background}>
          <Box
           p={5}>

            {/* returns a phrase if isRaining is true/false */}
            <Heading 
              color="white"
              textAlign="center"
              fontFamily="Futura"
              fontSize="5em"
              pt={5}>
              <Raining isRaining={this.state.isRaining} />
            </Heading>
            
            <Text
              color="white"
              fontFamily="Futura"
              fontSize={1}>
              <Credit getUser={this.state.user} />
            </Text>
          </Box>
        </div>
      );
  };
}

export default App;



