//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var dbConnection   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices', function(req, res, next) {
    // Ejecutamos una query para obtener la lista de dispositivos
    devices = dbConnection.query('SELECT * FROM `Devices`', function (error, results) {
        if (error) throw error;
        res.send(JSON.stringify(results)).status(200);
      });
});

app.post('/devices', function(req, res, next) {
    const device = req.body
    devices = dbConnection.query('INSERT INTO `Devices` SET ?', device, function (error) {
        if (error) {
            console.error('Error insertando datos:', JSON.stringify(device))
        };
        console.log(`Dispositivo ${JSON.stringify(device)} insertado correctamente.`)
        res.send('').status(200);
      });
});

app.put('/devices/:id', function(req, res, next) {
    const device = req.body
    const deviceId = req.params.id
    const query = 'UPDATE `Devices` SET ? WHERE id='+deviceId
    devices = dbConnection.query(query, device, function (error) {
        if (error) {
            console.error(`Error actualizando datos deviceId: ${deviceId}`, JSON.stringify(device))
        };
        console.log(`Dispositivo ${deviceId} actualizado correctamente.`)
        res.send('').status(200);
      });
});

app.delete('/devices/:id', function(req, res, next) {
    const deviceId = req.params.id
    const query = 'DELETE FROM `Devices` WHERE id='+deviceId
    devices = dbConnection.query(query, function (error) {
        if (error) {
            console.error(`Error eliminado datos deviceId: ${deviceId}`)
        };
        console.log(`Dispositivo ${deviceId} eliminado correctamente.`)
        res.send('').status(200);
      });
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
