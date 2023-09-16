



const weatherMap = {

    baseURL  : "http://api.weatherapi.com/v1",
    apiKey   : "83c85d12493343dfa1d173629232808",

    baseURL2 : "https://api.geoapify.com/v1",
    apiKey2  : "3168d1c4bdac4b6c9f105582e696da33",
    apiKey3  : "ece9098a17614bb5aefd8164203b3e95",




    location                   : "",
    userLocationCurrent        : "",
    countryCode                : "",
    currentLocationCoordinates : [],
    coordinates                : [],
    longitude                  : null,
    latitude                   : null,

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

    searchbar          : document.querySelector("#searchBar"),
    searchButton       : document.querySelector("#searchButton"),
    resultDisplay      : document.querySelector("#resultDisplay"),
    intro              : document.querySelector(".intro"),
    image              : document.querySelector(".image"),

    introduction       : null,
    speed              : 50,
    textPosition       : 0,


    // changes to a 1 when search is clicked
    searchClicked      : 0,
    

    detectLocalCondition(){
        return `${this.baseURL}/current.json?key=${this.apiKey}&q=${this.location}&qi=no`;
    },

    weatherForecast(situated = this.location){
        return `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${situated}&days=3&aqi=no&alerts=no`;
    },

    detectCurrentLocation(){
        return `${this.baseURL2}/ipinfo?&apiKey=${this.apiKey2}`;
    },

    autocompleteFeature(){
        return `${this.baseURL}/search.json?key=key=${this.apiKey}&q=${this.location}`;
    },
    
    get2LetterCode(){
        return `${this.baseURL2}/geocode/search?text=${this.location}&lang=en&limit=10&type=city&apiKey=${this.apiKey2}`;
    },

    generateZoomedMap(){
        return `${this.baseURL2}/staticmap?style=osm-carto&width=400&height=400&center=lonlat:${this.coordinates[0]},${this.coordinates[1]}&zoom=13&apiKey=${this.apiKey3}`;
    },


    async renderZoomedMap(){
 
        this.coordinates = [];
        await this.getLocation(); 
        
        //const response = await fetch(this.generateZoomedMap());
        this.image.src = this.generateZoomedMap();
    },


    async get2LetterCountryCode(){

        const response = await fetch(this.get2LetterCode());
        const result = await response.json();
        let finalResult = result.features[0].properties.country_code;
        finalResult = finalResult.toUpperCase();
        this.countryCode = finalResult;
        return finalResult;

    },


    async get3dayForecast(){

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

        this.searchClicked = 1;

        console.log(result.forecast.forecastday);
        
    },

    //stores coordinates of location in array "coordinates"
    async getLocation(){

        this.coordinates = [];
        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.coordinates.push(result.location.lon, result.location.lat);
        //console.log(this.coordinates);
        //console.log(result);
        //return this.coordinates;
    },

    //pushes user's current location as lat. and lon., and stores city and country in variable
    async getCurrentLocation(){

        coordinates = [];
        const response = await fetch(this.detectCurrentLocation());
        const result = await response.json();
        this.coordinates.push(result.location.longitude, result.location.latitude);
        const city = result.city.name;
        const country = result.state.name;
        const finalResult = `${city}, ${country}`;
        this.userLocationCurrent = finalResult;
        console.log(this.coordinates);
        return finalResult;

    },

    //stores current atmospheric conditions in arrays
    async currentAtmospheric(){

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

       this.intro.innerHTML = this.introduction[0].substring(0, this.textPosition);
       if(this.textPosition++ != this.introduction[0].length){
        setTimeout( ()=> this.typewriterEffect(), this.speed);
       };
    },

    optionsObject(){

        const options = {
            region: this.countryCode,
            backgroundColor: '#81d4fa',
            datalessRegionColor: '#f8bbd0',
            defaultColor: '#f5f5f5',
        }
    },

    //part of function required to draw map
    drawRegionsMap(){

        let data = google.visualization.arrayToDataTable([
            ['Country']
        ]);

        const options = {
            //region: this.countryCode,
            backgroundColor: "rgb(62, 138, 237)",
        };

       chart = new google.visualization.GeoChart(document.getElementById('worldMap'));
       chart.draw(data, options);

    },

    //draw map
    init(){

        this.searchButton.addEventListener("click", () => {
            this.resultDisplay.innerHTML = "";
            this.location = "";
            this.location = this.searchbar.value;
            this.get3dayForecast();
        });

        
       // displays user's location on page load with typewriter effect
        window.addEventListener("load", async () => {
           this.coordinates = [];
           await this.setLocation();
           this.introduction = [`Your current location is in or near to ${this.userLocationCurrent}.`],
           this.typewriterEffect();
        });


        google.charts.load('current', {
            'packages': ['geochart'],
        });
        google.charts.setOnLoadCallback(this.drawRegionsMap);

        window.addEventListener("load", () => {
            this.drawRegionsMap();
        });
        this.renderZoomedMap();
    },
};
weatherMap.init();