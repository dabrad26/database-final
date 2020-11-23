const mysql = require('mysql');

/**
 * Insercure auth is used for basic passwords with MySQL version 8.
 * This is just for the school project demo.
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

  /**
   * Run a SQL command in transactions
   *
   * @param {string[]} queries SQL to run in order
   * @returns {Promise} promise that resolves if success or rejects if fails
   */
  transaction(queries) {
    let resolver, rejecter;
    const promise = new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });
    let queryCount = 0;
    const eachQuery = (query, priorError) => {
      if (priorError) {
        this.currentConnection.rollback(() => {
          rejecter(priorError);
        });
      } else {
        this.currentConnection.query(query, (error) => {
          queryCount++;
          if (queries[queryCount]) {
            eachQuery(queries[queryCount], error);
          } else {
            this.currentConnection.commit((finalError, result) => {
              if (finalError) {
                rejecter(finalError);
              } else {
                resolver(result);
              }
            });
          }
        });
      }
    }

    this.currentConnection.beginTransaction(error => {
      if (error) rejecter(error);
      eachQuery(queries[queryCount]);
    });

    return promise;
  }
}

const sql = new sqlClass();

module.exports = sql;
