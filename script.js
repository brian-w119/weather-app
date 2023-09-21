



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
    weatherCondition           : [],

    // values for current conditions:
    currentCondition   : null,
    temperatureNow     : null,
    humidityNow        : null,
    currentCloudCover  : null,
    currentAtmPressure : null,
    tempFeelsLike      : null,

    

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
    climateDisplay     : document.querySelector("#climateData"),

    introduction       : null,
    speed              : 50,
    textPosition       : 0,
    localTime          : null,
    timeAtLocation     : null,

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
        return `${this.baseURL2}/staticmap?style=osm-carto&width=400&height=400&center=lonlat:${this.coordinates[0]},${this.coordinates[1]}&zoom=11&apiKey=${this.apiKey3}`;
    },

   //generates location map on page load
    async renderZoomedMap(){
 
        //this.coordinates = [];
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

        this.searchClicked = 1;
        this.location     = null;
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
        this.coordinates  = []; 

        this.location = this.searchbar.value;

        const response = await fetch(this.weatherForecast(this.location));
        const result = await response.json();
        this.coordinates.push(result.location.lon, result.location.lat);
        this.timeAtLocation = result.current.last_updated;
        console.log(result);
    },

    displayLocationTime(){
        this.timeAtLocation = this.timeAtLocation.slice(10, 17);
        this.intro.innerHTML = "";
        this.intro.innerHTML = `See the weather in ${this.location} as at ${this.timeAtLocation} Hours, local time.`;
        this.intro.style.color = "red";
    },


    //stores coordinates of location in array "coordinates"
    async getLocation(){

        this.location = null;
        this.coordinates = [];
        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.coordinates.push(result.location.lon, result.location.lat);
        //console.log(this.coordinates);
        console.log(result);
        //return this.coordinates;
    },

    //pushes user's current location as lat. and lon., and stores city and country in variable
    async getCurrentLocation(){
        
        this.location = "";
        coordinates = [];
        const response = await fetch(this.detectCurrentLocation());
        const result = await response.json();
        this.coordinates.push(result.location.longitude, result.location.latitude);
        const city = result.city.name;
        const country = result.country.name;
        const finalResult = `${city}, ${country}`;
        this.userLocationCurrent = finalResult;
        this.location = finalResult;
        //console.log(finalResult);
        return this.location;

    },

    //stores current atmospheric condition and pushes to weatherCondition array
    async currentAtmospheric(){

        this.searchClicked === 1 ? this.location = this.searchbar.value: "";

        this.temperatureNow = null;
        this.currentAtmPressure = null;
        this.currentCloudCover = null;
        this.humidityNow = null;
        this.tempFeelsLike = null;
        this.currentCondition = null;
        this.uvIndex = null;

        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();

        this.currentCondition = result.current.condition.text;
        this.temperatureNow  = result.current.temp_c;
        this.humidityNow = result.current.humidity;
        this.currentCloudCover = result.current.cloud;
        this.currentAtmPressure = result.current.pressure_mb;
        this.tempFeelsLike = result.current.feelslike_c; 
        this.uvIndex = (result.current.uv).toFixed(1);
        
        const current_temp = `Temperature: ${this.temperatureNow}°C`;
        this.weatherCondition.push(current_temp);

        const currentCondition = `Condition: ${this.currentCondition}`;
        this.weatherCondition.push(currentCondition);

        const currentHumidity = `Humidity: ${this.humidityNow}%`;
        this.weatherCondition.push(currentHumidity);

        const tempLike = `Feels Like: ${this.tempFeelsLike}°C`;
        this.weatherCondition.push(tempLike);

        const cloudCover = `Cloud Cover: ${this.currentCloudCover}%`;
        this.weatherCondition.push(cloudCover);

        const pressure = `Atmospheric Pressure: ${this.currentAtmPressure}mb`;
        this.weatherCondition.push(pressure);

        const uv = `UV Index: ${this.uvIndex}`;
        this.weatherCondition.push(uv);

        this.displayCurrentWeather();

    },
    
    displayCurrentWeather(){
        const howLong = this.weatherCondition.length;
        for(let i = 0; i < howLong; i++){
           this.climateDisplay.innerHTML += "<pre>" + this.weatherCondition[i] + "<br><br>";
        };
    },

    clearCurrentWeather(){
        this.climateDisplay.innerHTML = '';
        this.weatherCondition = [];
    },

    async setLocation(){
        this.userLocationCurrent = await this.getCurrentLocation();
        this.location = this.userLocationCurrent;
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

    time(){
       
        this.localTime = null; 
        
        const d        = new Date();
        let hour       = d.getHours();
        let min        = d.getMinutes();
        let sec        = d.getSeconds();
        
        const newTime  = `${hour}:${min}:${sec}`;
        this.localTime = newTime;

        console.log(this.localTime);
        return this.localTime;
    },

    displayTime(){

        this.localTime = null;
        setInterval(this.time, 1000);
    },
    

    //draw map
    init(){

        this.searchButton.addEventListener("click", async () => {
          
          this.clearCurrentWeather();
          await this.get3dayForecast();
          this.image.src = this.generateZoomedMap();
          this.displayLocationTime();
          this.currentAtmospheric();
          
    });

        // displays user's location on page load with typewriter effect
        
        window.addEventListener("load", async () => {

           this.searchClicked = 0;
           this.coordinates = [];
           this.location = "";
           this.userLocationCurrent = "";
           await this.setLocation();
           this.image.src = this.generateZoomedMap();
           this.introduction = [`Your current location is in or near to ${this.userLocationCurrent}.`],
           this.typewriterEffect();
           this.currentAtmospheric();
        });
        

        google.charts.load('current', {
            'packages': ['geochart'],
        });
        google.charts.setOnLoadCallback(this.drawRegionsMap);

        window.addEventListener("load", () => {
            this.drawRegionsMap();
        });
    },
};
weatherMap.init();