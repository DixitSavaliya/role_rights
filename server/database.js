'use strict'
var mysql = require('mysql');  
module.exports = function handle_db(req, res) { 
    // Database Pool
    /* var pool = mysql.createPool
    ({  
        connectionLimit:1000,
        connectionTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: 'localhost',
        user: 'root',  
        password: 'igotmywork@123',  
        database: 'igotmywork' 
    }); */
    var pool = mysql.createPool
    ({  
        connectionLimit:1000,
        /* connectionTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000, */
        host: 'localhost',
        user: 'root',  
        password: 'root',  
        database: 'ad_network' 
    });
    return pool;
}