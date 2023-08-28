

const weatherMap = {

    baseURL            :"http://api.weatherapi.com/v1",
    apiKey             :"83c85d12493343dfa1d173629232808",

    location           :"cheshunt",
    coordinates        :[],
    currentCondition   :[],
    temperatureNow     :[],
    humidityNow        :[],
    currentCloudCover  :[],
    currentAtmPressure :[],
    tempFeelsLike      :[],



    detectLocalCondition(){
       
        return `${this.baseURL}/current.json?key=${this.apiKey}&q=${this.location}&qi=no`;

    },


    weatherForecast(){

        console.log(`${this.baseURL}/forecast.json?key=${this.apiKey}&q=${this.location}&days=1&aqi=no&alerts=no`);

    },

    //stores coordinates of location in array "coordinates"
    async getLocation(){
       
        this.coordinates = [];
        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.coordinates.push(result.location.lat, result.location.lon);
        return this.coordinates;
    },

    //stores current atmospheric conditions in arrays
    async currentAtmospheric(){

        
        this.temperatureNow = [];
        this.currentAtmospheric = [];
        this.currentCloudCover = [];
        this.humidityNow = [];
        this.tempFeelsLike = [];

        const response = await fetch(this.detectLocalCondition());
        const result = await response.json();
        this.currentCondition.push(result.current.condition.text);
        this.temperatureNow.push(result.current.temp_c);
        this.humidityNow.push(result.current.humidity);
        this.currentCloudCover.push(result.current.cloud);
        this.currentAtmPressure.push(result.current.pressure_mb);
        this.tempFeelsLike.push(result.current.feelslike_c);
        console.log(this.tempFeelsLike);
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
        this.currentAtmospheric();
    },
};
weatherMap.init();











