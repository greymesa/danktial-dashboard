const sqlite = require('sqlite3');
const events = require('events');

const oneDay = 86400;

module.exports = function(connect){
   var Store = connect.Store;
 
   function SQLiteStore(options) {
     options = options || {};
     Store.call(this, options);
 
     this.table = options.db || 'sessions';
     this.client = new events.EventEmitter();
 
     var dbFile = (options.dir || '.') + '/' + this.table + '.db';
 
     this.db = new sqlite.Database(dbFile, (err) => {
       if (err) throw err;
       this.db.run('CREATE TABLE IF NOT EXISTS ' + this.table + ' (' +
       'sid PRIMARY KEY, ' +
       'expired, sess);',
       (err) => {
         if (err) throw err;
         this.client.emit('connect');
       });
     });
   }

   SQLiteStore.prototype.__proto__ = Store.prototype;

   SQLiteStore.prototype.get = function(sid, fn){
     var now = new Date().getTime();
     this.db.all('SELECT sess FROM ' + this.table + ' WHERE sid = ? AND ? <= expired;',
       [sid, now],
       function(err, rows) {
         if (err) fn(err);
           if (!rows || rows.length === 0) {
             return fn();
           }
           fn(null, JSON.parse(rows[0].sess));
       }
     );
   };
 
   SQLiteStore.prototype.set = function(sid, sess, fn) {
     try {
       var maxAge = sess.cookie.maxAge;
       var now = new Date().getTime();
       var expired = maxAge ? now + maxAge : now + oneDay;
       sess = JSON.stringify(sess);
 
       this.db.all('INSERT OR REPLACE INTO ' + this.table + ' VALUES (?, ?, ?);',
         [sid, expired, sess],
         function(err, rows) {
           if (fn) fn.apply(this, arguments);
         }
       );
     } catch (e) {
       if (fn) fn(e);
     }
   };

   SQLiteStore.prototype.destroy = function(sid, fn){
     this.db.run('DELETE FROM ' + this.table + ' WHERE sid = ?;', [sid], fn);
   };
 
   SQLiteStore.prototype.length = function(fn){
     this.db.run('SELECT COUNT(*) AS count FROM ' + this.table + ';', function(err, rows) {
       if (err) fn(err);
       fn(null, rows[0].count);
     });
   };
 
   SQLiteStore.prototype.clear = function(fn){
     this.db.run('DELETE FROM ' + this.table + ';', function(err) {
       if (err) fn(err);
       fn(null, true);
     });
   };
 
   return SQLiteStore;
 };
 