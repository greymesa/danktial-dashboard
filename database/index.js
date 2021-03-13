const sqlite3 = require('sqlite3');

class Database {
    /**
     * @type {sqlite3.Database}
     */
    static connection = undefined;

    static db() {
        if (!Database.connection) {
            Database.connection = new sqlite3.Database('./cache.db', (err) => {
                if (err) throw err;
                Database.connection.run('CREATE TABLE IF NOT EXISTS users (id VARCHAR(32) PRIMARY KEY, data VARCHAR(2048))');
            });
        }
        return Database.connection;
    }

    /**
     * 
     * @param {"update" | "delete"} code 
     */
    static getStatement(code) {
        switch (code.toLowerCase()) {
            case 'update':
                return 'REPLACE INTO users (id,data) VALUES (?,?)';
            case 'delete':
                return 'DELETE FROM users WHERE id=(?)';
            default:
                return 'SELECT * FROM users';
        }
    }

    static run(query, ...args) {
        return new Promise((resolve, reject) => {
            Database.db().run(query, ...args, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static all(query, ...args) {
        return new Promise((resolve, reject) => {
            Database.db().all(query, ...args, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Database;