const yargs = require('yargs');
const axios = require('axios');

const parsedArgs = yargs.options({
    address: {
        describe: 'Enter the address',
        demand: true,
        alias: 'a',
        string: true
    }
})
    .help()
    .alias('help', 'h')
    .argv;

const encodedAddress = encodeURIComponent(parsedArgs.address);

axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAecQYhu12BtTLvutyE34VY8k4d7BKvIsQ`).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Invalid address');
    }
    console.log(`Address : ${response.data.results[0].formatted_address}`);
    var lat = response.data.results[0].geometry.location.lat;
    var lon = response.data.results[0].geometry.location.lng;
    return axios.get(`https://api.darksky.net/forecast/2eee74e2ce8f4e8254f5c790adab7e51/${lat},${lon}`).then((response) => {
        console.log(`It's currently ${response.data.currently.currentTemperature} and it feels like ${response.data.currently.apparentTemperature}`);
    });
}).catch((error) => {
    if (error.code === 'ENOTFOUND') {
        console.log(error);
    } else {
        console.log(error.message);
    }
});