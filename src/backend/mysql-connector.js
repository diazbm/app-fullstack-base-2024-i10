//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'mysql-server',
    port     : '3306',
    user     : 'root',
    password : 'userpass',
    database : 'smart_home'
});

//=======[ Main module code ]==================================================
// Iniciar la conexión unos segundos después para evitar error al levantar con docker compose.
setTimeout(function(){
    connection.connect(function(err) {
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            return;
        }
        console.log('Connected to DB under thread ID: ' + connection.threadId);
    });
},5000)

module.exports = connection;

//=======[ End of file ]=======================================================
