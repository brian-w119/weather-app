const weatherMap = {

    baseURL  : "http://api.weatherapi.com/v1",
    apiKey   : "83c85d12493343dfa1d173629232808",

    baseURL2 : "https://api.geoapify.com/v1",
    apiKey2  : "3168d1c4bdac4b6c9f105582e696da33",
    apiKey3  : "ece9098a17614bb5aefd8164203b3e95",

    location                   : "",
    userLocationCurrent        : "",
    countryCode                : null,
    currentLocationCoordinates : [],
    coordinates                : [],
    longitude                  : null,
    latitude                   : null,
    weatherCondition           : [],
    locationName               : [],
    subRegionCode              : null,
    country                    : null,
    pageLoad                   : false,

    // values for current conditions:
    threeDayForecast    : [],
    subRegionCode       : null,

    searchbar           : document.querySelector("#searchBar"),
    searchButton        : document.querySelector("#searchButton"),
    resultDisplay       : document.querySelector("#resultDisplay"),
    intro               : document.querySelector(".intro"),
    image               : document.querySelector(".image"),
    climateDisplay      : document.querySelector("#climateData"),
    forecast            : document.querySelector(".forecast"),
    column1             : document.querySelector("#column1"),
    column2             : document.querySelector("#column2"),
    column3             : document.querySelector("#column3"),
    columnHeading       : document.querySelector("#colHeading"),
    defaultMap          : document.querySelector("#worldMap"),

    introduction        : null,
    localTime           : null,
    timeAtLocation      : null,

    // changes to a 1 when search is clicked
    searchClicked      : 0,

    subRegionObject : {

        "015": ["DZ", "EG", "EH", "LY", "MA", "SD", "SS", "TN"],
        "011": ["BF", "BJ", "CI", "CV", "GH", "GM", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SL", "SN", "TG"],
        "017": ["AO", "CD", "ZR", "CF", "CG", "CM", "GA", "GQ", "ST", "TD"],
        "014": ["AO", "CD", "ZR", "CF", "CG", "CM", "GA", "GQ", "ST", "TD"],
        "018": ["BW", "LS", "NA", "SZ", "ZA"],
        "154": ["GG", "JE", "AX", "DK", "EE", "FI", "FO", "GB", "IE", "IM", "IS", "LT", "LV", "NO", "SE", "SJ"],
        "155": ["AT", "BE", "CH", "DE", "DD", "FR", "FX", "LI", "LU", "MC", "NL"],
        "151": ["BG", "BY", "CZ", "HU", "MD", "PL", "RO", "RU", "SU", "SK", "UA"],
        "039": ["AD", "AL", "BA", "ES", "GI", "GR", "HR", "IT", "ME", "MK", "MT", "RS", "PT", "SI", "SM", "VA", "YU"],
        "021": ["BM", "CA", "GL", "PM", "US"],
        "029": ["AG", "AI", "AN", "AW", "BB", "BL", "BS", "CU", "DM", "DO", "GD", "GP", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "TC", "TT", "VC", "VG", "VI"],
        "013": ["BZ", "CR", "GT", "HN", "MX", "NI", "PA", "SV"],
        "005": ["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PE", "PY", "SR", "UY", "VE"],
        "143": ["TM", "TJ", "KG", "KZ", "UZ"],
        "030": ["CN", "HK", "JP", "KP", "KR", "MN", "MO", "TW"],
        "034": ["AF", "BD", "BT", "IN", "IR", "LK", "MV", "NP", "PK"],
        "035": ["BN", "ID", "KH", "LA", "MM", "BU", "MY", "PH", "SG", "TH", "TL", "TP", "VN"],
        "145": ["AE", "AM", "AZ", "BH", "CY", "GE", "IL", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "NT", "SY", "TR", "YE", "YD"],
        "053": ["AU", "NF", "NZ"],
        "054": ["FJ", "NC", "PG", "SB", "VU"],
        "057": ["FM", "GU", "KI", "MH", "MP", "NR", "PW"],
        "061": ["AS", "CK", "NU", "PF", "PN", "TK", "TO", "TV", "WF", "WS"],
    
    },
    
   
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
        await this.getLocation(); 
        //const response = await fetch(this.generateZoomedMap());
        this.image.src = this.generateZoomedMap();
    },


    async get2LetterCountryCode(){

        const response   = await fetch(this.get2LetterCode());
        const result     = await response.json();
        let finalResult  = result.features[0].properties.country_code;
        finalResult      = finalResult.toUpperCase();
        this.countryCode = finalResult;
        this.country     = result.features[0].properties.country;
        return finalResult;

    },

    async get3dayForecast(){
        this.searchClicked      = true;
        this.location           = null;

        const avgHumidity        = [];
        const avgTemp            = [];  
        const windSpeedmax       = [];
        const maxTemp            = [];
        const minTemp            = [];
        const sunrise            = [];
        const sunset             = [];
        const forecastCondition  = [];
        const forecastVis        = [];
        
        //this.this.location     = this.searchbar.value;
        this.pageLoad === true ? this.location = this.searchbar.value: this.location = await this.getCurrentLocation();
        const response    = await fetch(this.weatherForecast(this.location));
        const result      = await response.json();
        this.locationName = result.location.name;

        this.coordinates.push(result.location.lon, result.location.lat);
        this.timeAtLocation = result.current.last_updated;

        //push respective values to their arrays
        for(let count = 0; count < 3; count++){
            const resultPath  = result.forecast.forecastday[count];
            const resultPath2 = result.forecast.forecastday[count].day;

            const sunUp = `Sunrise: ${resultPath.astro.sunrise}`;
            sunrise.push(sunUp);
            
            const sunDown = `Sunset: ${resultPath.astro.sunset}`;
            sunset.push(sunDown);

            const humdity = `Average Humidity: ${resultPath2.avghumidity}%`;
            avgHumidity.push(humdity);

            const temperature = `Average Temperature: ${resultPath2.avgtemp_c}°C`;
            avgTemp.push(temperature);

            const visual = `Visibility: ${resultPath2.avgvis_miles} miles`;
            forecastVis.push(visual);

            const conditionAvg = `${resultPath2.condition.text}`;
            forecastCondition.push(conditionAvg);

            const tempMax = `Temperature High: ${resultPath2.maxtemp_c}°C`;
            maxTemp.push(tempMax);

            const tempMin = `Temperature Low: ${resultPath2.mintemp_c}°C`;
            minTemp.push(tempMin);

            const windSpeed = `Windspeed Maximum: ${resultPath2.maxwind_mph} mph`;
            windSpeedmax.push(windSpeed);
        };

        //push all forecast arrays to array "threeDayforecast"
        this.threeDayForecast.push(sunrise);
        this.threeDayForecast.push(sunset);
        this.threeDayForecast.push(avgHumidity);
        this.threeDayForecast.push(avgTemp);
        this.threeDayForecast.push(forecastVis);
        this.threeDayForecast.push(forecastCondition);
        this.threeDayForecast.push(maxTemp);
        this.threeDayForecast.push(minTemp);
        this.threeDayForecast.push(windSpeedmax);
    },

    forecastday1(){
        this.column1.innerHTML = "";
        for(let value = 0; value < this.threeDayForecast.length; value++){
            this.column1.style.color = "red";
            this.column1.innerHTML += "<pre>" + "<br>" + this.threeDayForecast[value][0];
        };
    },

    forecastday2(){
        this.column2.innerHTML = "";
        for(let value = 0; value < this.threeDayForecast.length; value++){
            this.column2.style.color = "red";
            this.column2.innerHTML += "<pre>" + "<br>" + this.threeDayForecast[value][1];
        };
    },

    forecastday3(){
        this.column3.innerHTML = "";
        for(let value = 0; value < this.threeDayForecast.length; value++){
            this.column3.style.color = "red";
            this.column3.innerHTML += "<pre>" + "<br>" + this.threeDayForecast[value][2];
        };
    },

    forecastAll(){
        console.log('Overwriting content');
        this.forecastday1();
        this.forecastday2();
        this.forecastday3();
    },

    displayLocationTime(){
        this.timeAtLocation    = this.timeAtLocation.slice(10, 17);
        this.intro.innerHTML   = "";
        this.intro.innerHTML   = `See the weather in ${this.location} as at ${this.timeAtLocation} Hours, local time.`;
        this.intro.style.color = "red";
    },


    //stores coordinates of location in array "coordinates"
    async getLocation(){
        this.location    = null;
        this.coordinates = [];
        const response   = await fetch(this.detectLocalCondition());
        const result     = await response.json();
        this.coordinates.push(result.location.lon, result.location.lat);
        //console.log(this.coordinates);
        console.log(result);
        //return this.coordinates;
    },

    //pushes user's current location as lat. and lon., and stores city and country in variable
    async getCurrentLocation(){
        this.location  = "";
        coordinates    = [];
        const response = await fetch(this.detectCurrentLocation());
        const result   = await response.json();
        this.coordinates.push(result.location.longitude, result.location.latitude);
        const city               = result.city.name;
        const country            = result.country.name;
        const finalResult        = `${city}, ${country}`;
        this.userLocationCurrent = finalResult;
        this.location            = finalResult;
        return this.location;
    },

    //stores current atmospheric condition and pushes to weatherCondition array
    async currentAtmospheric(){
        this.searchClicked === true ? this.location = this.searchbar.value: this.location = await this.getCurrentLocation();

        const response = await fetch(this.detectLocalCondition());
        const result   = await response.json();

        const currentCondition   = `Condition: ${result.current.condition.text}`;
        const temperatureNow     = `Temperature: ${result.current.temp_c}°C`;
        const humidityNow        = `Humidity: ${result.current.humidity}%`;
        const currentCloudCover  = `Cloud Cover: ${result.current.cloud}%`;
        const currentAtmPressure = `Atmospheric Pressure: ${result.current.pressure_mb}mb`;
        const tempFeelsLike      = `Feels Like: ${result.current.feelslike_c}°C`; 
        const uvIndex            = `UV Index: ${(result.current.uv).toFixed(1)}`;
        
        this.weatherCondition.push(temperatureNow);
        this.weatherCondition.push(currentCondition);
        this.weatherCondition.push(humidityNow);
        this.weatherCondition.push(tempFeelsLike);
        this.weatherCondition.push(currentCloudCover);
        this.weatherCondition.push(currentAtmPressure);
        this.weatherCondition.push(uvIndex);

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
        console.log(`Current Location: ${this.userLocationCurrent}`);
    },

    
    // prints the user's location in typing effect
    typewriterEffect(){
        const speed = 50;
        let textPosition = 0;
        this.intro.innerHTML = this.introduction[0].substring(0, textPosition);
        if (textPosition++ != this.introduction[0].length){
            setTimeout(() => this.typewriterEffect(), speed);
        };
    },
    
    //draws regional map, and highlight country of interest on search
    highlightCountry(){
        let data = google.visualization.arrayToDataTable([
            ['Country'],
            [this.country],
        
        ]);

        const options = {
            region             : this.subRegionCode,
            colorAxis          : {
                                   colors: ['#00853f', 'black', '#e31b23']
                                 },
            backgroundColor    : "rgb(62, 138, 237)",
            datalessRegionColor: "white",   
        };

        chart = new google.visualization.GeoChart(document.getElementById("worldMap"));
        chart.draw(data, options);
    },
    
    //draws map of the world on page load
    drawRegionsMap(){
        let data = google.visualization.arrayToDataTable([
            ['Country'],
        
        ]);

        const options = {
           backgroundColor: "rgb(62, 138, 237)",
        };
        
        chart = new google.visualization.GeoChart(document.getElementById("worldMap"));
        chart.draw(data, options);
    },

    time(){
        this.localTime = null; 
        const d   = new Date();
        let hour  = d.getHours();
        let min   = d.getMinutes();
        let sec   = d.getSeconds();
        
        const newTime  = `${hour}:${min}:${sec}`;
        this.localTime = newTime;

        console.log(this.localTime);
        return this.localTime;
    },

    displayTime(){
        this.localTime = null;
        setInterval(this.time, 1000);
    },

    getSubRegionCode(){
        //console.log('Calling getSubRegionCode()');
        for(const code in this.subRegionObject){
            if(this.subRegionObject[code].includes(this.countryCode)){
                this.subRegionCode = code;
               console.log(this.subRegionCode);
               return code;
            };
          };
    },

    displayAnim(){
        const image1 = document.createElement("img");
        const image2 = document.createElement("img");
        const image3 = document.createElement("img");

        image1.src   = "https://github.com/brian-w119/my-images/blob/main/circleProgress.gif?raw=true";
        image2.src   = "https://github.com/brian-w119/my-images/blob/main/circleProgress.gif?raw=true";
        image3.src   = "https://github.com/brian-w119/my-images/blob/main/circleProgress.gif?raw=true";

        this.column1.innerHTML = "";
        this.column2.innerHTML = "";
        this.column3.innerHTML = "";

        this.column1.appendChild(image1);
        this.column2.appendChild(image2);
        this.column3.appendChild(image3);

        image1.style.position = "absolute";
        image2.style.position = "absolute";
        image3.style.position = "absolute";

        image1.style.top = "30%";
        image2.style.top = "30%";
        image3.style.top = "30%";
    },

     //draw map
    init(){
        this.searchButton.addEventListener("click", async () => {
           // this.location     = this.searchbar.value;
          this.countryCode = null;
          this.threeDayForecast = [];
          this.clearCurrentWeather();
          await this.get3dayForecast();
          this.image.src = this.generateZoomedMap();
          this.displayLocationTime();
          this.currentAtmospheric();
          this.displayAnim();
          setTimeout(() => this.forecastAll(), 2000);
          await this.get2LetterCountryCode();
          this.getSubRegionCode();
          //console.log("ok");
          //this.defaultMap.innerHTML = "";
          this.highlightCountry();
        });

        window.addEventListener("load", async () => {
           this.searchClicked = false;
           this.coordinates = [];
           this.location = "";
           this.userLocationCurrent = "";
           await this.setLocation();
           this.image.src = this.generateZoomedMap();
           this.introduction = [`Your current location is in or near to ${this.userLocationCurrent}.`],
           this.typewriterEffect();
           this.currentAtmospheric();
           await this.get3dayForecast();
           this.pageLoad = true;
           this.forecastAll();
           
        }),
        

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
