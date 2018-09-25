const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const apiKey = require('./environment');


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
})

const api = express.Router();

app.use('/api', api);

const port = 4201;

api.get('/directions/:origin/:destination/:waypoints/:departureTime/:mode/:trafficModel', async (req, res) => {

    // let directionRequest = JSON.parse(req.params.directionRequest);
    console.log(apiKey.GOOGLE_MAPS_API_KEY);
    console.log('request params origin: ', (req.params.origin).toString());
    console.log('request params destination: ', (req.params.destination).toString());
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' +
        (req.params.origin).toString() +
        '&destination=' +
        (req.params.destination).toString() +
        '&waypoints=' +
        req.params.waypoints +
        '&departure_time=' +        
        req.params.departureTime +
        '&mode=' +
        req.params.travelMode +
        '&traffic_model=' +
        req.params.trafficModel +
        '&key=' + 
        apiKey.GOOGLE_MAPS_API_KEY)
        .then(function (response) {
            if (response.data.status == "OK") {
                console.log('response.data.result:', response.data.routes);
                res.send(response.data);
            }
            else {
                console.log(response);
                res.status(400).send("Error");
            }
        })
        .catch(function (error) {
            res.status(500).send("There was an error!");
        })
                
});

// '&mode=' +
        // directionRequest.travelMode +
        // '&departure_time=' +
        // directionRequest.drivingOptions.departureTime +
            


// api.get('/directions/', (req, res) => {
//     axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=43.270584762037416,5.39729277752383&destination=43.2794,5.3891&departure_time=1537152030000&mode=driving&key=AIzaSyCTUO8mVPiYvT9lcxA_GRGI5GipYke4oLw')
//         .then(function (response) {
//             if (response.data.status == "OK") {
//                 console.log('response.data.result:', response.data.routes);
//                 res.send(response.data);
//             }
//             else {
//                 res.status(400).send("Error");
//             }
//         })
//         .catch(function (error) {
//             res.status(500).send("There was an error!");
//         })
        
// });


// api.get('/directions/', (req, res) => {   
//     console.log(req);
//     console.log(res.json(directions));   
// });

// require('./directions')(app, {});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});