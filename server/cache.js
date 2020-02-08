var redis = require('redis');
var express = require('express');
var dates = require('./dates');
var pool = require('./database')();
var Q = require('q');
var async = require('async');
var redis_configuration ={
	"host": 'localhost',
	"string_numbers": true,
	"socket_keepalive": true,
	"detect_buffers": true,
	"debug_mode": true,
};
// creating redis _clients;
var _client = redis.createClient(redis_configuration);

// check for redis server is live or not?
function _checkRedis(){
	_client.on('ready',function(res) {
		return res ? res : "0";
	});
}

// check if redis server giving error
function _checkRedisError(){
	_client.on('error',function(err) {
    	return res ? res : "0";
	});
}

// persisting key for permanent store
function _persistRedisData(dataKey, cb){
	console.log("persisting data for key  ===>>   " + JSON.stringify(dataKey));
    _client.persist(dataKey, function(res){
    	console.log("redis persist res  " + JSON.stringify(res));
    	cb(res ? res : "0");
    });
}

// flushing data from redis server
function _removeRedisData(dataKey, cb){
    _client.del(dataKey, function(res){
    	cb(res ? res : "0");
    });
}

function _removeMasterKeys(role_id){
	console.log("_removeMasterKeys called with key " + role_id)
	if(role_id){
		var sql = `select um.id from user_master as um where um.user_role_id = `+ role_id +``;
	    pool.getConnection(function (err1, con1){
	        if(!err1){
	            con1.query(sql,function(err, rows) {
	                if (!err){
	                	if(rows.length > 0){
	                		var i = 0;
	                		async.forEachOf(rows, function (val, i, _callback){
	                			if(rows[i]){
									var key1 = 'user_' + rows[i].id;
									if(rows[i].id){
										newKeyPatern = '*' + key1 + '*';
										console.log("removing keys for pattern  ===>  " + newKeyPatern);
									    _client.keys(newKeyPatern, function(err, res){
									    	if(!err){
									    		//console.log("Master Key Matched Keys are ==>  " + JSON.stringify(res))
									    		_client.del(res, function(res){
											    	if(res == null){
											    		_callback(res);
											    	}else {
											    		_callback(res);
											    	}
											    });
									    	}else{
									    		_callback(err);
									    		//console.log("error while getting keys  ==>  " + JSON.stringify(err))
									    	}
									    });
									}else {
										_callback("in rows id not found");
										//console.log("in rows id not found")
									}
		                		}else {
		                			_callback("error rows[i] not present");
		                			//console.log("error rows[i] not present")
		                		}
	                		}, function(error){
					            if(error){
					            	console.log("Caching _removeMasterKeys has Error ========> " + JSON.stringify(error))
					            }else{
					            	console.log("Caching _removeMasterKeys result ========> " + JSON.stringify(error))
					            }
					        });
	                	}else {
	                		console.log("error no record found")
	                	}
	                    
	                } else {
	                	console.log("_removeMasterKeys DB: " + JSON.stringify(err))
	                }
	                con1.release();
	            });
	        }else {
	            console.log("_removeMasterKeys CON: " + JSON.stringify(err1))
	        }
	    });
	}
}

// removing reids cache keys
function _removeRedisKeys(key1, key2){
	console.log("_removeRedisKeys called with keys " + key1 + "  ,  "+ key2)
	if(key2 != undefined){
		//user_2_ads_pg_undefined_undefined  ,  user_2_ads_count
		key2 = key2.split("_");
		console.log("splited keys ====> " + JSON.stringify(key2));
		var newKeyPatern = key2[0] + "_" + key2[1] + "_" + key2[2];
		console.log("newKeyPatern ===> " + newKeyPatern);
		newKeyPatern = '*' + newKeyPatern + '*';
		var pgKeys = [];
		_client.del(key1);
		//console.log('getting keys of following pattern  ==> ' + newKeyPatern);
	    _client.keys(newKeyPatern, function(err, res){
	    	console.log("Keys will be deleted  ==>  " + res)
	    	if(!err){
	    		//console.log("Matched Keys are ==>  " + JSON.stringify(res))
	    		_client.del(res, function(res){
			    	if(res == null){
			    		console.log("Key deleted  ==> " + res)
			    	}
			    });
	    	}else{
	    		console.log("error while getting keys  ==>  " + JSON.stringify(err))
	    	}
	    });
	    
	    //console.log("_client  ==>  ");
	    //console.log(_client);
	    
	}else {
		_client.del(key1, function(res){
	    	if(res == null){
	    		console.log("Key deleted  ==> " + key1)
	    	}
	    });
	}
}

// flushing all data from redis server
function _flushAllRedisData(){
    _client.flushall(function(res){
    });
}

// seting data to redis server
function _setDataInRedis(key, data){
	_client.set(key, data, "EX", 7200, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting data to redis server
function _setTransactionDataInRedis(key, data){
	_client.set(key, data, "EX", 86400, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting data to redis server
function _setChatDataInRedis(key, data){
	_client.set(key, data, "EX", 86000, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting current user data to redis server
function _setCurrentUserDataInRedis(key, data){
	_client.set(key, data, "EX", 86000, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting data to redis server
function _setDashboardDataInRedis(key, data){
	_client.set(key, data, "EX", 14400, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting data to redis server
function _setPagingDataInRedis(key, data){
	_client.set(key, data, "NX", function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}

// seting access token data to redis server
function _setAcceessTokenDataInRedis(key, data){
	var date = (JSON.parse(data)).expire_time;
    var curDate = dates._generateTimeStamp();
    var expDate = new Date(date);
    var sysDate = new Date(curDate);
    var diffMs = (expDate - sysDate);
    var diffDays = Math.floor(diffMs / 86400000);
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    var diffSecs = parseInt(diffMs / 1000);
    var expire_time = parseInt(diffSecs) - 60;
	console.log("expire in =>  " + expire_time + '  seconds');
	_client.set(key, data, "EX", expire_time, function (err, res) {
		if(err){
			return err;
		}else {
	    	return res == "OK" ? "1" : "0";
		}
	});
}


// geting data from redis server
function _getRedisData(dataKey, cb){
    _client.get(dataKey, function(err, res){
    	if(res){
			cb(res);
    	}else {
    		cb(err);
    	}
    });
}

// check data existance from redis server
function _checkRedisData(dataKey, cb){
    _client.exists(dataKey, function(res){
    	cb(res ? res : "0");
    });
}

module.exports = { 
	_client, 
	_checkRedis, 
	_checkRedisError, 
	_persistRedisData, 
	_removeRedisData,
	_flushAllRedisData, 
	_setDataInRedis,
	_setTransactionDataInRedis,
	_setChatDataInRedis,
	_setDashboardDataInRedis,
	_getRedisData, 
	_checkRedisData,
	_setAcceessTokenDataInRedis,
	_setPagingDataInRedis,
	_removeRedisKeys,
	_removeMasterKeys
};

