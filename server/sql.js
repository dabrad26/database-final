const mysql = require('mysql');

/**
 * Insercure auth is used for basic passwords with MySQL version 8.
 */
class sqlClass {
  /** @type {import('mysql').Connection} */
  currentConnection = mysql.createConnection({
    host: 'localhost',
    user: 'school_user',
    password: 'school_pass',
    database: 'db_final',
    insecureAuth : true
  });;

  /**
   * Connect to MySQL
   *
   * @returns {Promise} promise that resolves if success or rejects if fails
   */
  initConnection() {
    let resolver, rejecter;
    const promise = new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });

    this.currentConnection.connect(error => {
      if (error) {
        rejecter(error);
      } else {
        resolver();
      }
    });

    return promise;
  }

  /**
   * Run a SQL command
   *
   * @param {string} query SQL to run
   * @returns {Promise} promise that resolves if success or rejects if fails
   */
  query(query) {
    let resolver, rejecter;
    const promise = new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });

    this.currentConnection.query(query, (error, result) => {
      if (error) {
        rejecter(error);
      } else {
        resolver(result);
      }
    });

    return promise;
  }
}

const sql = new sqlClass();

module.exports = sql;
