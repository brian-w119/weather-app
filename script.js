



const weatherMap = {

    baseURL  : "http://api.weatherapi.com/v1",
    apiKey   : "83c85d12493343dfa1d173629232808",

    baseURL2 : "https://api.geoapify.com/v1",
    apiKey2  : "3168d1c4bdac4b6c9f105582e696da33",




    location           : "",
    userLocationCurrent: "",
    locationCoordinates: [],
    coordinates        : [],

    // values for current conditions:
    currentCondition   : [],
    temperatureNow     : [],
    humidityNow        : [],
    currentCloudCover  : [],
    currentAtmPressure : [],
    tempFeelsLike      : [],

    

    // values for the forecast:
    avgHumidity        : null,
    avgTemp            : null,
    windSpeedmax       : null,
    uvIndex            : null,
    visibilty          : null,
    chanceOfRain       : null,
    chanceOfSnow       : null,
    maxTemp            : null,
    minTemp            : null,

    //astronomy values:
    sunrise            : null,
    sunset             : null,

    //event listeners

    searchbar          : document.querySelector("#searchBar"),
    searchButton       : document.querySelector("#searchButton"),
    resultDisplay      : document.querySelector("#resultDisplay"),

    introduction       : null,
    speed              : 50,
    textPosition       : 0,
    
    

    detectLocalCondition() {
        return `${this.baseURL}/current.json?key=${this.apiKey}&q=${this.location}&qi=no`;
    },

    weatherForecast(situated = this.location) {
        return `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${situated}&days=3&aqi=no&alerts=no`;
    },

    detectCurrentLocation() {
        return `${this.baseURL2}/ipinfo?&apiKey=${this.apiKey2}`;
    },

    autocompleteFeature() {
        return `${this.baseURL}/search.json?key=key=${this.apiKey}&q=${this.location}`;
    },


    async get3dayForecast() {

        this.avgHumidity  = null;
        this.avgTemp      = null;  
        this.windSpeedmax = null;
        this.uvIndex      = null;    
        this.visibilty    = null;
        this.chanceOfRain = null;
        this.chanceOfSnow = null;
        this.maxTemp      = null;    
        this.minTemp      = null;     
        this.sunrise      = null;
        this.sunset       = null;  

        const response = await fetch(this.weatherForecast(this.location));
        const result = await response.json();

        console.log(result.forecast.forecastday);
    },

    //stores coordinates of location in array "coordinates"
    async getLocation() {

        this.coordinates = [];
        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.coordinates.push(result.location.lat, result.location.lon);
        console.log(this.coordinates);
        //return this.coordinates;
    },

    //pushes user's current location as lat. and lon., and stores city and country in variable
    async getCurrentLocation() {

        locationCoordinates = [];
        const response = await fetch(this.detectCurrentLocation());
        const result = await response.json();
        this.locationCoordinates.push(result.location.latitude);
        this.locationCoordinates.push(result.location.longitude);
        const city = result.city.name;
        const country = result.state.name;
        const finalResult = `${city}, ${country}`;
        this.userLocationCurrent = finalResult;
        return finalResult;
    },

    //stores current atmospheric conditions in arrays
    async currentAtmospheric() {

        this.temperatureNow = [];
        this.currentAtmospheric = [];
        this.currentCloudCover = [];
        this.humidityNow = [];
        this.tempFeelsLike = [];
        this.currentCondition = [];

        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.currentCondition.push(result.current.condition.text);
        this.temperatureNow.push(result.current.temp_c);
        this.humidityNow.push(result.current.humidity);
        this.currentCloudCover.push(result.current.cloud);
        this.currentAtmPressure.push(result.current.pressure_mb);
        this.tempFeelsLike.push(result.current.feelslike_c); 

    },

    async setLocation(){
        this.userLocationCurrent = await this.getCurrentLocation();
    },


    // prints the user's location in typing effect
    typewriterEffect(){

       this.resultDisplay.innerHTML = this.introduction[0].substring(0, this.textPosition);
       if(this.textPosition++ != this.introduction[0].length){
        setTimeout( ()=> this.typewriterEffect(), this.speed);
       };
    },



    //draw map
    init() {

        this.searchButton.addEventListener("click", () => {

            this.resultDisplay.innerHTML = "";
            this.location = "";
            this.location = this.searchbar.value;
            this.get3dayForecast();
            
        });

        

        

        // displays user's location on page load

        window.addEventListener("load", async () => {

           await this.setLocation();
           this.introduction = [`Your current location is in or near to ${this.userLocationCurrent}`],
           this.typewriterEffect();
        });


        google.charts.load('current', {
            'packages': ['geochart'],
        });
        google.charts.setOnLoadCallback(drawRegionsMap);
        function drawRegionsMap() {
            var data = google.visualization.arrayToDataTable([
                ['Country']


            ]);

            const options = {
                backgroundColor: "rgb(62, 138, 237)",
            };

            const chart = new google.visualization.GeoChart(document.getElementById('worldMap'));

            chart.draw(data, options);
        };
       //this.getCurrentLocation();
    },

};
weatherMap.init();