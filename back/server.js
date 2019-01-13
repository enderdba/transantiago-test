// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var cors = require('cors');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'La API se encuentra funcionando correctamente.' });
});

router.get("/allRoutes", function (req, res) {
    let sql = `SELECT route_id, route_short_name FROM route`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

router.get("/getTrip/:route", function (req, res) {
    const route = req.params.route;

    let sql = `SELECT DISTINCT route_id, shape_id FROM trips
    WHERE route_id = "${route}"
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

router.get("/getPath/:path", function (req, res) {
    const path = req.params.path;

    let sql = `SELECT shape_pt_lat, shape_pt_lon FROM shapes
    WHERE shape_id = "${path}"
    ORDER BY shape_pt_sequence ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER AFTER THE DB IS CONNECTED
// =============================================================================
let db = new sqlite3.Database('./transantiago.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('La base de datos existe... Abriendo listener...');
    app.listen(port);
    console.log('El api se encuentra en http://localhost:' + port);
});

