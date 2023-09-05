



const weatherMap = {

    baseURL            :"http://api.weatherapi.com/v1",
    apiKey             :"83c85d12493343dfa1d173629232808",

    baseURL2           :"https://api.geoapify.com/v1",
    apiKey2            :"3168d1c4bdac4b6c9f105582e696da33",




    location           :"cheshunt",
    coordinates        :[],
    currentCondition   :[],
    temperatureNow     :[],
    humidityNow        :[],
    currentCloudCover  :[],
    currentAtmPressure :[],
    tempFeelsLike      :[],
    userLocationCurrent:"",
    locationCoordinates:[],



    detectLocalCondition(){
       return `${this.baseURL}/current.json?key=${this.apiKey}&q=${this.location}&qi=no`;
    },

    weatherForecast(){
        return `${this.baseURL}/forecast.json?key=${this.apiKey}&q=${this.location}&days=7&aqi=no&alerts=no`;
    },

    detectCurrentLocation(){
        return `${this.baseURL2}/ipinfo?&apiKey=${this.apiKey2}`;
    },

    
    async get7dayForecast(){
        const response = await fetch(this.weatherForecast());
        const result = await response.json();
        return result.forecast.forecastday;
    },

    //stores coordinates of location in array "coordinates"
    async getLocation(){
       
        this.coordinates = [];
        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.coordinates.push(result.location.lat, result.location.lon);
        return this.coordinates;
    },

    //pushes user's current location as lat. and lon. to array
    async getUserLocation(){

        locationCoordinates = [];
        const response = await fetch(this.detectCurrentLocation());
        const result = await response.json();
        this.locationCoordinates.push(result.location.latitude);
        this.locationCoordinates.push(result.location.longitude);
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
        console.log(this.result);
    },



    //draw map
    init() {


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
         this.get7dayForecast();
    },
};
weatherMap.init();