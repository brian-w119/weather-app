


   const subRegionCode =  {

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

  };

   getSubCode(countryCode){

     for(const code in this.subRegionCode){
       if(this.subRegionCode[code].includes(countryCode)){
          return code;
       };
     };
    };





