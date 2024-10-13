//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var dbConnection = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// ABM Dispositivos
app.get('/devices', function (req, res, next) {
    // Ejecutamos una query para obtener la lista de dispositivos
    devices = dbConnection.query('SELECT * FROM `Devices`', function (error, results) {
        if (error) throw error;
        res.send(JSON.stringify(results)).status(200);
    });
});

app.post('/devices', function (req, res, next) {
    const device = req.body
    devices = dbConnection.query('INSERT INTO `Devices` SET ?', device, function (error) {
        if (error) {
            console.error('Error insertando datos:', JSON.stringify(device))
        };
        console.log(`Dispositivo ${JSON.stringify(device)} insertado correctamente.`)
        res.send('').status(200);
    });
});

app.put('/devices/:id', function (req, res, next) {
    const device = req.body
    const deviceId = req.params.id
    const query = 'UPDATE `Devices` SET ? WHERE id=' + deviceId
    devices = dbConnection.query(query, device, function (error) {
        if (error) {
            console.error(`Error actualizando datos deviceId: ${deviceId}`, JSON.stringify(device))
        };
        console.log(`Dispositivo ${deviceId} actualizado correctamente.`)
        res.send('').status(200);
    });
});

app.delete('/devices/:id', function (req, res, next) {
    const deviceId = req.params.id
    const query = 'DELETE FROM `Devices` WHERE id=' + deviceId
    devices = dbConnection.query(query, function (error) {
        if (error) {
            console.error(`Error eliminado datos deviceId: ${deviceId}`)
        };
        console.log(`Dispositivo ${deviceId} eliminado correctamente.`)
        res.send('').status(200);
    });
});

// ABM Ambientes
app.get('/rooms', function (req, res, next) {
    // Ejecutamos una query para obtener la lista de ambientes
    rooms = dbConnection.query('SELECT * FROM `Rooms`', function (error, results) {
        if (error) throw error;
        res.send(JSON.stringify(results)).status(200);
    });
});

app.post('/rooms', function (req, res, next) {
    const room = req.body
    rooms = dbConnection.query('INSERT INTO `Rooms` SET ?', room, function (error) {
        if (error) {
            console.error('Error insertando datos:', JSON.stringify(room))
        };
        console.log(`Ambiente ${JSON.stringify(room)} insertado correctamente.`)
        res.send('').status(200);
    });
});

app.put('/rooms/:id', function (req, res, next) {
    const room = req.body
    const roomId = req.params.id
    const query = 'UPDATE `Rooms` SET ? WHERE id=' + roomId
    rooms = dbConnection.query(query, room, function (error) {
        if (error) {
            console.error(`Error actualizando datos roomId: ${roomId}`, JSON.stringify(room))
        };
        console.log(`Ambiente ${roomId} actualizado correctamente.`)
        res.send('').status(200);
    });
});

app.delete('/rooms/:id', function (req, res, next) {
    const roomId = req.params.id
    const query = 'DELETE FROM `Rooms` WHERE id=' + roomId
    rooms = dbConnection.query(query, function (error) {
        if (error) {
            console.error(`Error eliminado datos roomId: ${roomId}`)
        };
        console.log(`Ambiente ${roomId} eliminado correctamente.`)
        res.send('').status(200);
    });
});

// Listado de dispositivos por habitación
app.get('/rooms/devices/list', function (req, res, next) {
    // Ejecutamos una query para obtener la lista de ambientes
    let rooms = []
    let devices = []
    dbConnection.query('SELECT * FROM `Devices`', function (error, resultsDevices) {
        if (error) throw error;
        devices = resultsDevices

        dbConnection.query('SELECT * FROM `Rooms`', function (error, resultsRooms) {
            if (error) throw error;
            rooms = resultsRooms

            // Armamos una lista de ambientes con una lista de dispositivos por ambiente
            rooms.forEach(room => {
                room.devices = []
                for (let i = 0; i < devices.length; i++) {
                    const device = devices[i]
                    if (device.room_id === room.id) {
                        room.devices.push(devices[i])
                    }
                }
            });

            console.log(JSON.stringify(rooms))
            res.send(rooms).status(200);
        });
    });
});


app.listen(PORT, function (req, res) {
    //=======[ Main module code ]==================================================
    // Iniciar la conexión unos segundos después para evitar error al levantar con docker compose.
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
