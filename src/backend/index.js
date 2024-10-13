//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
const { getDatabaseInstance } = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// Iniciar la conexión unos segundos después para evitar error al levantar con docker compose.
setTimeout(() => {
    try {
        const dbInstance = getDatabaseInstance();
        dbInstance.connect();
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}, 10000); // 10000 ms = 10 segundos

// ABM Dispositivos
app.get('/devices', function (req, res, next) {
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos una query para obtener la lista de dispositivos
        devices = dbConnection.query('SELECT * FROM `Devices`', function (error, results) {
            if (error) throw error;
            res.send(JSON.stringify(results)).status(200);
        });
    } catch (error) {
        console.error('Ocurrió un error en la obtención de dispositivos', error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

app.post('/devices', function (req, res, next) {
    const device = req.body
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        devices = dbConnection.query('INSERT INTO `Devices` SET ?', device, function (error) {
            if (error) {
                console.error('Error insertando datos:', JSON.stringify(device))
            };
            console.log(`Dispositivo ${JSON.stringify(device)} insertado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la creación del dispositivo ${device.name}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }

});

app.put('/devices/:id', function (req, res, next) {
    const device = req.body
    const deviceId = req.params.id
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        const query = 'UPDATE `Devices` SET ? WHERE id=' + deviceId
        devices = dbConnection.query(query, device, function (error) {
            if (error) {
                console.error(`Error actualizando datos deviceId: ${deviceId}`, JSON.stringify(device))
            };
            console.log(`Dispositivo ${deviceId} actualizado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la actualización del dispositivo ${deviceId}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

app.delete('/devices/:id', function (req, res, next) {
    const deviceId = req.params.id
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        const query = 'DELETE FROM `Devices` WHERE id=' + deviceId
        devices = dbConnection.query(query, function (error) {
            if (error) {
                console.error(`Error eliminado datos deviceId: ${deviceId}`)
            };
            console.log(`Dispositivo ${deviceId} eliminado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la eliminación del dispositivo ${deviceId}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

// ABM Ambientes
app.get('/rooms', function (req, res, next) {
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos una query para obtener la lista de ambientes
        rooms = dbConnection.query('SELECT * FROM `Rooms`', function (error, results) {
            if (error) throw error;
            res.send(JSON.stringify(results)).status(200);
        });
    } catch (error) {
        console.error('Ocurrió un error en la obtención de ambientes', error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

app.post('/rooms', function (req, res, next) {
    const room = req.body
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        rooms = dbInstance.query('INSERT INTO `Rooms` SET ?', room, function (error) {
            if (error) {
                console.error('Error insertando datos:', JSON.stringify(room))
            };
            console.log(`Ambiente ${JSON.stringify(room)} insertado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la creación de ambiente ${room.name}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

app.put('/rooms/:id', function (req, res, next) {
    const room = req.body
    const roomId = req.params.id
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        const query = 'UPDATE `Rooms` SET ? WHERE id=' + roomId
        rooms = dbInstance.query(query, room, function (error) {
            if (error) {
                console.error(`Error actualizando datos roomId: ${roomId}`, JSON.stringify(room))
            };
            console.log(`Ambiente ${roomId} actualizado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la actualización del ambiente ${roomId}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

app.delete('/rooms/:id', function (req, res, next) {
    const roomId = req.params.id
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

        // Ejecutamos la query
        const query = 'DELETE FROM `Rooms` WHERE id=' + roomId
        rooms = dbConnection.query(query, function (error) {
            if (error) {
                console.error(`Error eliminado datos roomId: ${roomId}`)
            };
            console.log(`Ambiente ${roomId} eliminado correctamente.`)
            res.send('').status(200);
        });
    } catch (error) {
        console.error(`Ocurrió un error en la eliminación del ambiente ${roomId}`, error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});

// Listado de dispositivos por habitación
app.get('/rooms/devices/list', function (req, res, next) {
    try {
        // Reutilizamos la conexión
        const dbInstance = getDatabaseInstance();
        const dbConnection = dbInstance.connection;

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
                console.log('Lista de dispositivos por ambiente obtenida correctamente')
                res.send(rooms).status(200);
            });
        });
    } catch (error) {
        console.error('Ocurrió un error en la obtención de dispositivos por habitación', error);
        res.status(500);
        res.send({ error: "internal server error" });
    }
});


app.listen(PORT, function (req, res) {
    //=======[ Main module code ]==================================================
    console.log("NodeJS API running correctly");
});
