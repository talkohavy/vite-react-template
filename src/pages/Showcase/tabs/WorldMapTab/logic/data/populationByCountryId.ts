/**
 * Approximate 2023 population in millions, keyed by ISO 3166-1 numeric code
 * (the `id` used by `world-atlas`).
 */
export const POPULATION_BY_COUNTRY_ID: Record<string, number> = {
  '004': 42.2, // Afghanistan
  '008': 2.8, // Albania
  '012': 45.6, // Algeria
  '024': 36.7, // Angola
  '031': 10.4, // Azerbaijan
  '032': 46.7, // Argentina
  '036': 26.6, // Australia
  '040': 9.1, // Austria
  '044': 0.41, // Bahamas
  '050': 173, // Bangladesh
  '051': 2.8, // Armenia
  '056': 11.8, // Belgium
  '064': 0.79, // Bhutan
  '068': 12.4, // Bolivia
  '070': 3.2, // Bosnia and Herzegovina
  '072': 2.7, // Botswana
  '076': 216.4, // Brazil
  '084': 0.41, // Belize
  '090': 0.74, // Solomon Islands
  '096': 0.45, // Brunei
  '100': 6.4, // Bulgaria
  '104': 54.6, // Myanmar
  '108': 13.2, // Burundi
  '112': 9.2, // Belarus
  '116': 16.9, // Cambodia
  '120': 28.6, // Cameroon
  '124': 39.1, // Canada
  '140': 5.7, // Central African Republic
  '144': 21.9, // Sri Lanka
  '148': 18.3, // Chad
  '152': 19.6, // Chile
  '156': 1410.7, // China
  '158': 23.9, // Taiwan
  '170': 52.1, // Colombia
  '178': 6.1, // Congo
  '180': 102.3, // DR Congo
  '188': 5.2, // Costa Rica
  '191': 3.9, // Croatia
  '192': 11.2, // Cuba
  '196': 1.3, // Cyprus
  '203': 10.5, // Czechia
  '204': 13.7, // Benin
  '208': 5.9, // Denmark
  '214': 11.3, // Dominican Republic
  '218': 18.2, // Ecuador
  '222': 6.4, // El Salvador
  '226': 1.7, // Equatorial Guinea
  '231': 126.5, // Ethiopia
  '232': 3.7, // Eritrea
  '233': 1.3, // Estonia
  '238': 0.0037, // Falkland Islands
  '242': 0.94, // Fiji
  '246': 5.6, // Finland
  '250': 68.2, // France
  '262': 1.1, // Djibouti
  '266': 2.4, // Gabon
  '268': 3.7, // Georgia
  '270': 2.8, // Gambia
  '275': 5.4, // Palestine
  '276': 84.5, // Germany
  '288': 34.1, // Ghana
  '300': 10.4, // Greece
  '304': 0.056, // Greenland
  '320': 18.1, // Guatemala
  '324': 14.2, // Guinea
  '328': 0.81, // Guyana
  '332': 11.7, // Haiti
  '340': 10.6, // Honduras
  '348': 9.6, // Hungary
  '352': 0.39, // Iceland
  '356': 1428.6, // India
  '360': 277.5, // Indonesia
  '364': 89.2, // Iran
  '368': 45.5, // Iraq
  '372': 5.1, // Ireland
  '376': 9.2, // Israel
  '380': 58.9, // Italy
  '384': 28.9, // Côte d'Ivoire
  '388': 2.8, // Jamaica
  '392': 124.5, // Japan
  '398': 19.6, // Kazakhstan
  '400': 11.3, // Jordan
  '404': 55.1, // Kenya
  '408': 26.2, // North Korea
  '410': 51.7, // South Korea
  '414': 4.3, // Kuwait
  '417': 7, // Kyrgyzstan
  '418': 7.6, // Laos
  '422': 5.4, // Lebanon
  '426': 2.3, // Lesotho
  '428': 1.9, // Latvia
  '430': 5.4, // Liberia
  '434': 6.9, // Libya
  '440': 2.8, // Lithuania
  '442': 0.65, // Luxembourg
  '450': 30.3, // Madagascar
  '454': 20.9, // Malawi
  '458': 34.3, // Malaysia
  '466': 23.3, // Mali
  '478': 4.9, // Mauritania
  '484': 128.5, // Mexico
  '496': 3.4, // Mongolia
  '498': 2.5, // Moldova
  '499': 0.62, // Montenegro
  '504': 37.8, // Morocco
  '508': 33.9, // Mozambique
  '512': 4.6, // Oman
  '516': 2.6, // Namibia
  '524': 30.9, // Nepal
  '528': 17.9, // Netherlands
  '540': 0.29, // New Caledonia
  '548': 0.33, // Vanuatu
  '554': 5.2, // New Zealand
  '558': 7, // Nicaragua
  '562': 27.2, // Niger
  '566': 223.8, // Nigeria
  '578': 5.5, // Norway
  '586': 240.5, // Pakistan
  '591': 4.5, // Panama
  '598': 10.3, // Papua New Guinea
  '600': 6.9, // Paraguay
  '604': 34.4, // Peru
  '608': 117.3, // Philippines
  '616': 36.7, // Poland
  '620': 10.4, // Portugal
  '624': 2.2, // Guinea-Bissau
  '626': 1.4, // Timor-Leste
  '630': 3.2, // Puerto Rico
  '634': 2.7, // Qatar
  '642': 19.1, // Romania
  '643': 144.4, // Russia
  '646': 14.1, // Rwanda
  '682': 36.9, // Saudi Arabia
  '686': 17.8, // Senegal
  '688': 6.6, // Serbia
  '694': 8.8, // Sierra Leone
  '703': 5.4, // Slovakia
  '704': 98.9, // Vietnam
  '705': 2.1, // Slovenia
  '706': 18.1, // Somalia
  '710': 60.4, // South Africa
  '716': 16.7, // Zimbabwe
  '724': 48.4, // Spain
  '728': 11.1, // South Sudan
  '729': 48.1, // Sudan
  '732': 0.59, // Western Sahara
  '740': 0.62, // Suriname
  '748': 1.2, // Eswatini
  '752': 10.6, // Sweden
  '756': 8.8, // Switzerland
  '760': 23.2, // Syria
  '762': 10.1, // Tajikistan
  '764': 71.8, // Thailand
  '768': 9.1, // Togo
  '780': 1.5, // Trinidad and Tobago
  '784': 9.5, // United Arab Emirates
  '788': 12.5, // Tunisia
  '792': 85.8, // Turkey
  '795': 6.5, // Turkmenistan
  '800': 48.6, // Uganda
  '804': 37, // Ukraine
  '807': 1.8, // North Macedonia
  '818': 112.7, // Egypt
  '826': 68.4, // United Kingdom
  '834': 67.4, // Tanzania
  '840': 339.9, // United States
  '854': 23.3, // Burkina Faso
  '858': 3.4, // Uruguay
  '860': 35.2, // Uzbekistan
  '862': 28.8, // Venezuela
  '887': 34.4, // Yemen
  '894': 20.6, // Zambia
};
