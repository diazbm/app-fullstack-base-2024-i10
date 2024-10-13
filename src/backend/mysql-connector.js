//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');

// Se implementa la clase Database, que sirve para poder tener solo una conexión a la base, se usa el patrón de diseño singleton
class Database {
  constructor() {
    this.connection = null;
    this.retryLimit = 10; // Máximo número de reintentos
    this.retry = 0;
  }

  connect() {
    if (!this.connection) {
      console.log(`Conectando a la DB, intento ${this.retry} de ${this.retryLimit}`);
      this.connection = mysql.createConnection({
        host     : 'mysql-server',
        port     : '3306',
        user     : 'root',
        password : 'userpass',
        database : 'smart_home'
      });

      this.connection.connect((err) => {
        if (err) {
            console.error('Error conectando a la base de datos, reintentando en 5seg' + err.stack);

            // Si no se pudo establecer la conexión (por ejemplo porque la base aún no está levantada), se reinicia el valor de connection
            this.connection = null

            // Se reintenta de forma recursiva cada 5 segundos hasta que la conexión se concrete, o hasta que se agoten los reintentos.
            if(this.retry <= this.retryLimit) {
                setTimeout(()=>{
                    this.retry = this.retry + 1; // Se incrementa el reintento
                    this.connect();
                },5000);
            } else {
                console.error('Reintentos alcanzados');
                throw err;
            }
        } else {
            console.log('Conexión exitosa a la base de datos mediante el theadId: ' + this.connection.threadId);
        }
      });
    }
    return this.connection;
  }
}

// Se exporta la instancia de la clase, de esta forma se va a poder reutilizar en cada query.
const databaseInstance = new Database();

module.exports = {
  getDatabaseInstance: () => databaseInstance,
};
