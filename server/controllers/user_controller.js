var express = require('express');
var bcrypt   = require('bcryptjs');
var fs = require('fs');
path = require('path');
const axios = require('axios');
var router = express.Router();
var pool = require('../database')();
var dates = require('../dates');
var cache = require('../cache');
var dir = require('../directories');
var config = require('../config.json');

// For OAuth
router.post('/getAccessTokenByRefreshToken', getAccessTokenByRefreshToken);
router.post('/getAuthTokens', getAuthTokens);
router.post('/updateWebPushToken', updateWebPushToken);

/*******************************************************************************/
/*************************************OAuth*************************************/
/*******************************************************************************/

// Refresh Tokens
function getAccessTokenByRefreshToken(req, res){
    var user = {
        refresh_token : req.body.refresh_token,
        username : req.body.username,
    };
    if(user.username != undefined && user.username != '' && user.username && 
       user.refresh_token != undefined && user.refresh_token != '' && user.refresh_token.length == 32){
        var sql = ` select * 
                    from user_master 
                    where refresh_token = "` + user.refresh_token +`" and (username = '`+ user.username +`' or email_id = '`+ user.username +`')`;
        pool.getConnection(function(err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err) {
                        if(rows && rows[0] && rows[0].id > 0) {
                            var user1 = {
                                id: rows[0].id,
                                secret_key: rows[0].secret_key,
                                user_group: rows[0].user_group,
                                user_group_id: rows[0].user_group_id,
                                username:rows[0].username,
                                user_email: rows[0].email_id ? rows[0].email_id : '',
                                refresh_token: rows[0].refresh_token,
                                access_token: rows[0].access_token,
                                expire_time:rows[0].expire_time,
                                updated_at: '',
                                server_time: dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                            };
                            _generateTokenByRefreshToken(user1, function(result){
                                if(result){
                                    var obj = {
                                        id: user1.id,
                                        secret_key: user1.secret_key,
                                        user_group: user1.user_group,
                                        user_group_id: user1.user_group_id,
                                        access_token: user1.access_token,
                                        refresh_token: user1.refresh_token,
                                        expire_time:user1.expire_time,
                                        updated_at: '',
                                        server_time: dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                                    };
                                    if (result.status == 1) {  
                                        var jsonObject = {};
                                        obj.access_token = result.access_token;
                                        obj.expire_time = result.expire_time;
                                        obj.updated_at = result.updated_at;
                                        var redis_obj = {
                                            "id": rows[0].id,
                                            "secret_key": rows[0].secret_key,
                                            "username": rows[0].username ? rows[0].username : '',
                                            "user_email": rows[0].email_id ? rows[0].email_id : '',
                                            "user_group": rows[0].user_group,
                                            "user_group_id": rows[0].user_group_id,
                                            "access_token": obj.access_token,
                                            "refresh_token": obj.refresh_token,
                                            "expire_time": obj.expire_time,
                                            "updated_at": obj.updated_at,
                                            "server_time": dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                                        };
                                        cache._setAcceessTokenDataInRedis(redis_obj.access_token, JSON.stringify(redis_obj));
                                        cache._setAcceessTokenDataInRedis(redis_obj.secret_key, JSON.stringify(redis_obj));
                                        jsonObject["status"] = "1";
                                        jsonObject["message"] = "New Access Token generated successfully!";
                                        jsonObject["data"] = redis_obj;
                                        res.send(jsonObject);
                                    } else {
                                        var jsonObject = {};
                                        jsonObject["status"] = "0";
                                        jsonObject["message"] = result.message;
                                        jsonObject["data"] = [];
                                        res.send(jsonObject);
                                    }
                                }else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = result.message;
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                            });
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No Token Found!";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON " + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id and refresh token is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Tokens 
function getAuthTokens(req, res){
    var user =  {
        username : req.body.username ? req.body.username : '',
        password : req.body.password ? req.body.password : '',
        user_group : req.body.user_group ? req.body.user_group : ''
    };
    
    if(user.username != undefined && user.username != '' && user.username && 
       user.user_group != undefined && user.user_group != '' && user.user_group){
        if(user.user_group == 'admin' || 
            user.user_group == 'admin_staff' || 
            user.user_group == 'publisher' || 
            user.user_group == 'advertiser'
        ){
            var sql = ` select 
                            um.*, 
                            ur.id as user_role_id, 
                            ur.name as user_role,
                            um.status 
                        from user_master as um  
                        left join user_role as ur on ur.id = um.user_role_id 
                        where BINARY um.username ='` + user.username + `' or BINARY um.email_id ='` + user.username + `' 
                        and BINARY um.user_group = '`+user.user_group+`' group by um.id limit 1`;
            console.log("getAuthTokens login  sql ---------------------> \r\n\t " + sql);
            pool.getConnection(function (err1, con1){
                if(!err1){
                    con1.query(sql, function (err, rows){
                        if (err){
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "DB :" + err;
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        } else {
                            if(rows.length > 0) {
                                if(rows[0].status == 1){
                                    bcrypt.compare(user.password, rows[0].password,function(error, doesMatch) {
                                        if (doesMatch) {
                                            var group = user.user_group == 'null' ? null : user.user_group;
                                            var status = rows[0].status;
                                            if(status === 0){
                                                var jsonObject = {};
                                                jsonObject["status"] = "0";
                                                jsonObject["message"] = "User Credentials Found Inactivated Please Contact Admin";
                                                jsonObject["data"] = [];
                                                res.send(jsonObject);
                                            }else {
                                                if (rows[0].user_group == group) {
                                                    var hasString = rows[0].id + "_" + rows[0].user_group + "_" + rows[0].user_group_id + "_" + rows[0].user_role_id;
                                                    var secKey = dates.encode(hasString);
                                                    if (!rows[0].secret_key) {                                                    
                                                        setSecretKey({id: rows[0].id, secret_key : secKey})
                                                        .then(function (xs) {
                                                            if (xs.status == 1) {
                                                                rows[0].secret_key = secKey;
                                                                var user1 = {
                                                                    id: rows[0].id,
                                                                    secret_key: rows[0].secret_key ? rows[0].secret_key : secKey,
                                                                    username:rows[0].username,
                                                                    user_email:rows[0].email_id,
                                                                    access_token: rows[0].access_token,
                                                                    refresh_token:rows[0].refresh_token, 
                                                                    expire_time:rows[0].expire_time,
                                                                    updated_at: dates._generateTimeStamp(),
                                                                    user_group: user.user_group,
                                                                    user_group_id: rows[0].user_group_id
                                                                };
                                                                console.log("user1")
                                                                console.log(user1);
                                                                _processTokens(user1, function(result){
                                                                    if(result){
                                                                        if (result.status == 1) {
                                                                            var jsonObject = {};
                                                                            user1.access_token = result.access_token;
                                                                            user1.refresh_token = result.refresh_token;
                                                                            user1.expire_time = result.expire_time;
                                                                            user1.updated_at = result.updated_at;
                                                                            var redis_obj = {
                                                                                "id": rows[0].id,
                                                                                "secret_key": rows[0].secret_key,
                                                                                "username": rows[0].username ? rows[0].username : '',
                                                                                "user_email": rows[0].email_id ? rows[0].email_id : '',
                                                                                "access_token": user1.access_token,
                                                                                "refresh_token":user1.refresh_token, 
                                                                                "expire_time": user1.expire_time,
                                                                                "server_time": dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                                                                                "updated_at": user1.updated_at,
                                                                                "user_group": user1.user_group,
                                                                                "user_group_id": user1.user_group_id
                                                                            };
                                                                            console.log("redis_obj stored")
                                                                            console.log(redis_obj)
                                                                            cache._setAcceessTokenDataInRedis(redis_obj.access_token, JSON.stringify(redis_obj));
                                                                            cache._setAcceessTokenDataInRedis(redis_obj.secret_key, JSON.stringify(redis_obj));
                                                                            jsonObject["status"] = "1";
                                                                            jsonObject["message"] = "Login Successfully!";
                                                                            jsonObject["data"] = redis_obj;
                                                                            res.send(jsonObject);
                                                                        } else {
                                                                            var jsonObject = {};
                                                                            jsonObject["status"] = "0";
                                                                            jsonObject["message"] = result.message;
                                                                            jsonObject["data"] = [];
                                                                            res.send(jsonObject);
                                                                        }
                                                                    }else {
                                                                        var jsonObject = {};
                                                                        jsonObject["status"] = "0";
                                                                        jsonObject["message"] = result.message;
                                                                        jsonObject["data"] = [];
                                                                        res.send(jsonObject);
                                                                    }
                                                                });
                                                            } else {
                                                                var jsonObject = {};
                                                                jsonObject["status"] = "0";
                                                                jsonObject["message"] = xs.data;
                                                                jsonObject["data"] = [];
                                                                res.send(jsonObject);
                                                            }
                                                        })
                                                    } else {
                                                        var user1 = {
                                                            id: rows[0].id,
                                                            secret_key: rows[0].secret_key ? rows[0].secret_key : secKey,
                                                            username:rows[0].username,
                                                            user_email: rows[0].email_id ? rows[0].email_id : '',
                                                            access_token: rows[0].access_token,
                                                            refresh_token:rows[0].refresh_token, 
                                                            expire_time:rows[0].expire_time,
                                                            updated_at: dates._generateTimeStamp(),
                                                            server_time: dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                                                            user_group: user.user_group,
                                                            user_group_id:rows[0].user_group_id,
                                                        };
                                                        _processTokens(user1, function(result){
                                                            if(result){
                                                                if (result.status == 1) {
                                                                    var jsonObject = {};
                                                                    user1.access_token = result.access_token;
                                                                    user1.refresh_token = result.refresh_token;
                                                                    user1.expire_time = result.expire_time;
                                                                    user1.updated_at = result.updated_at;
                                                                    var redis_obj = {
                                                                        "id": rows[0].id,
                                                                        "secret_key": rows[0].secret_key,
                                                                        "username": rows[0].username,
                                                                        "user_email": rows[0].email_id ? rows[0].email_id : '',
                                                                        "access_token": user1.access_token,
                                                                        "refresh_token":user1.refresh_token, 
                                                                        "expire_time": user1.expire_time,
                                                                        "updated_at": user1.updated_at,
                                                                        "server_time": dates._generateDateFormat("","yyyy-mm-dd hh:ii:ss"),
                                                                        "user_group": user1.user_group,
                                                                        "user_group_id": user1.user_group_id,
                                                                    };
                                                                    cache._setAcceessTokenDataInRedis(result.access_token, JSON.stringify(redis_obj));
                                                                    cache._setAcceessTokenDataInRedis(rows[0].secret_key, JSON.stringify(redis_obj));
                                                                    jsonObject["status"] = "1";
                                                                    jsonObject["message"] = "Login Successfully!";
                                                                    jsonObject["data"] = redis_obj;
                                                                    res.send(jsonObject);
                                                                } else {
                                                                    var jsonObject = {};
                                                                    jsonObject["status"] = "0";
                                                                    jsonObject["message"] = result.message;
                                                                    jsonObject["data"] = [];
                                                                    res.send(jsonObject);
                                                                }
                                                            }else {
                                                                var jsonObject = {};
                                                                jsonObject["status"] = "0";
                                                                jsonObject["message"] = result.message;
                                                                jsonObject["data"] = [];
                                                                res.send(jsonObject);
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    var jsonObject = {};
                                                    jsonObject["status"] = "0";
                                                    jsonObject["message"] = "Unauthorised Admin Access";
                                                    jsonObject["data"] = [];
                                                    jsonObject["error"] = "Try login again as staff by checking staff checkbox";
                                                    res.send(jsonObject);
                                                }
                                            }
                                        } else {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = "User Id or Password incorrect";
                                            jsonObject["data"] = [];
                                            res.send(jsonObject);
                                        }
                                    });
                                }else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["data"] = [];
                                    jsonObject["message"] = "All Services For This User Are Inactivated! Kindly Contact Admin";
                                    res.send(jsonObject);
                                }
                            } else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["data"] = [];
                                jsonObject["message"] = "User not exist with given credentials";
                                res.send(jsonObject);
                            }
                        }
                        con1.release();
                    });
                }else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "CON :" + err1;
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                }
            });
        }else {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "not valid user type";
            jsonObject["data"] = [];
            res.send(jsonObject);
        }
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "username and password is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//update Web Push Token
function updateWebPushToken(req, res){
    var user = {
        id: req.body.id ? req.body.id : null,
        web_token: req.body.web_token ? req.body.web_token : null
    };
    if(user.id != null && user.id != 'null'){
        var sql = ` update user_master set web_token= `+( user.web_token ? `'`+user.web_token+`'` : null)+` where id = ` + user.id;
        console.log("update user web_token sql ==>  " + sql);
        pool.getConnection(function (err2, con3){     
            if(!err2){
                con3.query(sql,function(err3, rows1){
                    if (!err3){
                        if(rows1.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "User Token Details Updated Successfully";
                            jsonObject["data"] = user.id;
                            res.send(jsonObject);
                        }else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "Something went wrong please try again later!...";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {  
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB " + err3;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }       
                    con3.release();
                }); 
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON: " + err2;
                jsonObject["data"] = [];
                res.send(jsonObject);
            } 
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User ID and Token are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

/*******************************************************************************/
/**************************************WEB**************************************/
/*******************************************************************************/
router.post('/registerUser', registerUser);
router.post('/forgotPassword', forgotPassword);
router.post('/changePassword', changePassword);
router.post('/currentUser', currentUser);
router.post('/getUserBySearch', getUserBySearch);
router.post('/getUserDetailsById', getUserDetailsById);
router.post('/getFullUserDetailsById', getFullUserDetailsById);
router.post('/updateUserDetailsById', updateUserDetailsById);
router.post('/getUserDetailsByUserGroupId', getUserDetailsByUserGroupId);
router.post('/renewProductSubscription', renewProductSubscription);
router.post('/uploadUserImage', uploadUserImage);
router.post('/removeUserImage', removeUserImage);



// Create New User Login  
function registerUser(req, res){
    var user = {
        id: '',
        status: req.body.status, 
        create_by: req.body.create_by, 
        first_name:req.body.first_name, 
        last_name:req.body.last_name,  
        username:req.body.username, 
        email_id:req.body.email_id, 
        mobile_no : req.body.mobile_no,
        password:req.body.password, 
        user_role_id : req.body.user_role_id,
        user_group: req.body.user_group,
        user_group_id: req.body.user_group_id,
        secret_key: '',
    };
    
    console.log("user.secret_key --------------------> " + user.secret_key)
    if(user.username != undefined && user.username != '' && user.username){
        // For Unique USERNAME
        checkUserUsername(user.username)
        .then(function(userRes){
            if (userRes.status == 1) {
                bcrypt.hash(user.password, 5, function( err, bcryptedPassword) {
                    var sql = `insert into user_master(
                                status,
                                create_by,
                                first_name,
                                last_name,
                                username,
                                email_id,
                                mobile_no,
                                password,
                                user_role_id,
                                user_group,
                                user_group_id
                            ) values (
                                `+ user.status +`,
                                `+ user.create_by +`,
                                '`+ user.first_name+`',
                                '`+ user.last_name +`',
                                '`+ user.username+`',
                                '`+ user.email_id+`',
                                '`+ user.mobile_no+`',
                                '`+ user.bcryptedPassword +`',
                                `+ user.user_role_id+`,
                                '`+ user.user_group+`',
                                `+ user.user_group_id+`
                            )`;
                    console.log("registerUser sql ---------------> " + sql)
                    pool.getConnection(function (err2, con2){
                        if(!err2){
                            con2.query(sql, function(err3, rows1){
                                if (!err3) {
                                    var hasString = rows1.insertId + "_" + user.user_group + "_" + user.user_group_id + "_" + user.user_role_id;
                                    user.secret_key = dates.encode(hasString);
                                    user.id = rows1.insertId;
                                    setSecretKey(user);
                                    var jsonObject = {};
                                    jsonObject["status"] = "1";
                                    jsonObject["message"] = "User Login Details Created Successfully";
                                    jsonObject["data"] = rows1.insertId;
                                    res.send(jsonObject);
                                } else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = "DB "+err3;
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                                con2.release();
                            }); 
                        }else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "CON: "+ err2;
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    });
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "Username already taken please choose another one";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "username is required to register user";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Update User Login Details By Id 
function updateUserDetailsById(req, res){
    var user = {
        id: req.body.id,
        status: req.body.status,
        modify_by:req.body.create_by, 
        first_name:req.body.first_name, 
        username:req.body.username, 
        last_name:req.body.last_name, 
        mobile_no:req.body.mobile_no,  
        email_id:req.body.email_id,  
        password: req.body.password,
        secret_key: '',
    };
    if(user.id && 
       user.id != 'undefined' && 
       user.id != undefined && 
       user.id != '' && 
       user.id != null){
        var sql = `select um.* from user_master um where um.id = `+ user.id;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows){
                    var jsonObject = {};
                    if (!err) {
                        if (rows[0] != undefined && rows[0].id != undefined && rows[0].id > 0) {
                            var hasString = rows[0].id + "_" + rows[0].user_group + "_" + rows[0].user_group_id + "_" + rows[0].user_role_id;
                            user.secret_key = dates.encode(hasString);
                            console.log("hasString --------------------> " + hasString)
                            console.log("user.secret_key --------------------> " + user.secret_key)
                            if(rows[0].username === user.username){
                                if(req.body.password && req.body.password != '' && req.body.password != 'undefined' && req.body.password.length > 0){
                                    bcrypt.hash(user.password, 5, function( err, bcryptedPassword) {
                                        var sql = ` update user_master set  
                                                        modify_by= `+user.modify_by+`,                                                        
                                                        `+ (user.secret_key != undefined && user.secret_key != "undefined" ? (`secret_key = '`+user.secret_key +`',`) : `` )+`
                                                        first_name= '`+user.first_name+`',
                                                        last_name= '`+user.last_name+`',
                                                        email_id= '`+user.email_id+`',
                                                        mobile_no= `+user.mobile_no+`,
                                                        password= '`+bcryptedPassword+`'
                                                        where id = ` + user.id;
                                        console.log("updateUserDetailsById with PW sql =====> " + sql)
                                        pool.getConnection(function (err2, con3){
                                            if(!err2){
                                                con3.query(sql,function(err3, rows1){
                                                    if (!err3){
                                                        if(rows1.affectedRows > 0){
                                                            var jsonObject = {};
                                                            jsonObject["status"] = "1";
                                                            jsonObject["message"] = "User Login Details Updated Successfully";
                                                            jsonObject["data"] = user.id;
                                                            res.send(jsonObject);
                                                        }else {
                                                            var jsonObject = {};
                                                            jsonObject["status"] = "0";
                                                            jsonObject["message"] = "Something went wrong please try again later!...";
                                                            jsonObject["data"] = [];
                                                            res.send(jsonObject);
                                                        }
                                                    } else {
                                                    var jsonObject = {};
                                                        jsonObject["status"] = "0";
                                                        jsonObject["message"] = "DB " + err3;
                                                        jsonObject["data"] = [];
                                                        res.send(jsonObject);
                                                    }
                                                    con3.release();
                                                });
                                            }else {
                                                var jsonObject = {};
                                                jsonObject["status"] = "0";
                                                jsonObject["message"] = "CON: " + err2;
                                                jsonObject["data"] = [];
                                                res.send(jsonObject);
                                            }
                                        });
                                    });
                                }else {
                                    var sql = ` update user_master set  
                                                    modify_by= `+user.modify_by+`,
                                                    `+ (user.secret_key != undefined && user.secret_key != "undefined" ? (`secret_key = '`+user.secret_key +`',`) : `` )+`
                                                    first_name= '`+user.first_name+`',
                                                    last_name= '`+user.last_name+`',
                                                    email_id= '`+user.email_id+`',
                                                    mobile_no= `+ user.mobile_no +`
                                                    where id = ` + user.id;
                                    console.log("updateUserDetailsById without PW sql =====> " + sql)
                                    pool.getConnection(function (err2, con3){
                                        if(!err2){
                                            con3.query(sql,function(err3, rows1){
                                                if (!err3){
                                                    if(rows1.affectedRows > 0){
                                                        var jsonObject = {};
                                                        jsonObject["status"] = "1";
                                                        jsonObject["message"] = "User Login Details Updated Successfully";
                                                        jsonObject["data"] = user.id;
                                                        res.send(jsonObject);
                                                    }else {
                                                        var jsonObject = {};
                                                        jsonObject["status"] = "0";
                                                        jsonObject["message"] = "Something went wrong please try again later!...";
                                                        jsonObject["data"] = [];
                                                        res.send(jsonObject);
                                                    }
                                                } else {
                                                    var jsonObject = {};
                                                    jsonObject["status"] = "0";
                                                    jsonObject["message"] = "DB :" + err3;
                                                    jsonObject["data"] = [];
                                                    res.send(jsonObject);
                                                }
                                                con3.release();
                                            });
                                        }else {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = "CON: " + err2;
                                            jsonObject["data"] = [];
                                            res.send(jsonObject);
                                        }
                                    });
                                }
                            }else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "username not changable";
                                jsonObject["data"] = [];
                                res.send(jsonObject);
                            }
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "User does not exist";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "User ID is Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Active User Details By Id
function currentUser(req, res){
    var id = req.body.id;
    var group = req.body.group;
    var sql = '';
    if(id != undefined && id != null && id != '' && id){
        sql = ` select 
                    um.*,
                    if(um.user_group = 'admin_staff', sm.id , null) as type_id,
                    2 as type,
                    null as parent_id,
                    ur.id as user_role_id,
                    ur.name as user_role
                from user_master as um 
                left join staff_master as sm on sm.id = um.user_group_id 
                left join user_role as ur on ur.id = um.user_role_id
                where um.id = `+ id +` and um.status = 1 group by um.id`;
        console.log("currentUser sql -------------> " + sql);
        pool.getConnection(function (err1, con1) {  
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err) {
                        if (rows != '' && rows != null && rows.length){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "User Record read Successfully";
                            var userObj = {
                                "id" : rows[0].id,
                                "secret_key": rows[0].secret_key,
                                "username" : rows[0].username,
                                "mobile_no" : rows[0].mobile_no,
                                "email_id" : rows[0].email_id,
                                "first_name" : rows[0].first_name,
                                "last_name" : rows[0].last_name,
                                "user_group" : rows[0].user_group,
                                "user_group_id" : rows[0].user_group_id,
                                "user_role_id" : rows[0].user_role_id,
                                "user_role" : rows[0].user_role,
                                "parent_id" : rows[0].parent_id,
                                "avatar" : rows[0].avatar,
                                "type" : rows[0].type,
                                "type_id" : rows[0].type_id,
                            };
                            jsonObject["data"] = userObj;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0"; 
                            jsonObject["message"] = "No such user found ";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id and type are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Forgot Password for user
// params username
// return message
function forgotPassword(req,res){
    var username = req.body.username;
    if(username != undefined && username != '' && username != null){
        var sql = ` select 
                    um.email_id as email, 
                    um.first_name as user, 
                    um.username, 
                    um.password, 
                    um.mobile_no, 
                    um.id as id, 
                    um.user_role_id, 
                    um.user_group 
                from user_master as um
                where um.username = '` + username + `' or um.email_id = '` + username + `' and um.status = 1 `;
        pool.getConnection(function (err1, con1) {
            if(!err1){
                con1.query(sql,function (err, rows){
                    if (err){
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    } else {
                        if(rows.length > 0) {
                            var data = rows[0];
                            salt = dates.generate_token(8);
                            bcrypt.hash(salt , 5, function(error, temp_password) {
                                if(!error){
                                    var nodemailer = require('nodemailer');
                                    var smtpTransport = require('nodemailer-smtp-transport');
                                    var transporter = nodemailer.createTransport(smtpTransport({
                                        /*service: 'Gmail',
                                        host: 'smtp.gmail.com',
                                        port: '587',
                                        auth: {
                                            user: 'kbhfushion@gmail.com',
                                            pass: 'kbh@1791'
                                        },
                                        secureConnection: 'false',
                                        tls: {
                                            ciphers: 'SSLv3',
                                            rejectUnauthorized: false
                                        }*/
                                        service: 'gmail',
                                        type: "SMTP",
                                        host: "smtp.gmail.com",
                                        secure: true,
                                        auth: {
                                            user: 'kbhfushion@gmail.com',
                                            pass: 'kbh@1791'
                                        },
                                    }));
                                    var html =  '<strong style="color:blue;">Welcome : '+ data.user +' </strong><br><br>'+
                                                '<strong style="color:blue;">Your Updated Login Details Are : </strong><br>'+
                                                '<strong style="color:blue;">Username:</strong>&nbsp;&nbsp;<b>'+ data.username +'</b><br>'+
                                                '<strong style="color:blue;">New Password :</strong>&nbsp;&nbsp;<b>'+ salt +'</b>';    
                                    var mailOptions = [];
                                    mailOptions["from"] = "RK WEB Tech : <kbhfushion@gmail.com>";
                                    mailOptions["to"] = data.user +' : <'+ data.email + '>';
                                    mailOptions["subject"] = "Password Recovery";
                                    mailOptions["text"] = "Hello "+ data.user +" your password is successfully recovered.";
                                    mailOptions["html"] = html;
                                    transporter.sendMail(mailOptions, function(error11, info){
                                        if (error11) {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = error11;
                                            jsonObject["data"] = [];
                                            res.send(jsonObject);
                                        } else {
                                            var sql = `update user_master set password = '`+ temp_password +`' where username = '` + username + `' or email_id = '` + username + `'`;
                                            con1.query(sql, function(err, rows) {
                                                if (!err) {
                                                    if(rows && rows != '' && rows != null && rows.affectedRows > 0) {
                                                        var jsonObject = {};
                                                        jsonObject["status"] = "1";
                                                        jsonObject["message"] = "Password has been sent to your register Email";
                                                        jsonObject["data"] = [];
                                                        res.send(jsonObject);
                                                    } else {
                                                        var jsonObject = {};
                                                        jsonObject["status"] = "0";
                                                        jsonObject["message"] = "Something went wrong please try again!!!";
                                                        jsonObject["data"] = [];
                                                        res.send(jsonObject);
                                                    }
                                                } else {
                                                    var jsonObject = {};
                                                    jsonObject["status"] = "0";
                                                    jsonObject["message"] = "DB :" + err;
                                                    jsonObject["data"] = [];
                                                    res.send(jsonObject);
                                                }
                                            });
                                        }
                                    });
                                }else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = "Failed to generate new password" + error;
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                            });
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "User Id does not exist";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Username is required to forgot password request!";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// change Password for user
// params username, old_password & newpassword, user_role
// return message
function changePassword(req,res){
    var user = {
        id : req.body.id,
        username : req.body.username,
        old_password : req.body.old_password, 
        new_password : req.body.new_password 
    };
    if(user.id != undefined &&
        user.id != '' &&
        user.id != null &&
        user.username != undefined &&
        user.username != '' &&
        user.username != null
    ){
        var sql = ` select 
                        um.password, 
                        concat_ws(' ', um.first_name, um.last_name) as user,
                        um.username, 
                        um.email_id,
                        um.mobile_no, 
                        um.id as id
                    from user_master as um
                    left join user_role as ur on ur.id = um.user_role_id 
                    where binary um.username = '` + user.username + `' or um.email_id = '` + user.username + `'
                        and um.id = ` + user.id + ` 
                        and um.status = 1`; 
        console.log("changePassword sql \r\n" + sql);
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function (err, rows){
                    if (err){
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    } else {
                        if(rows.length > 0) {
                            bcrypt.compare(user.old_password,rows[0].password,function(error,doesMatch) {        
                                if (doesMatch){                                 
                                    // If Old password match for user id then set new password
                                    pool.getConnection(function (err3, con3) {    
                                        if(!err3){
                                            bcrypt.hash(user.new_password, 5, function(err_bcrypt, bcryptedPassword) {
                                                var data = rows[0];
                                                var sql = ` update user_master 
                                                                set password = '` + bcryptedPassword + `' 
                                                            where id = `+ user.id;
                                                con3.query(sql, function(err2, rows1) {
                                                    if (!err2) {
                                                        if(rows1 && rows1 != '' && rows1 != null && rows1.affectedRows > 0) {
                                                            var nodemailer = require('nodemailer');
                                                            var smtpTransport = require('nodemailer-smtp-transport');
                                                            var transporter = nodemailer.createTransport(smtpTransport({
                                                                /*service: 'Gmail',
                                                                host: 'smtp.gmail.com',
                                                                port: '587',
                                                                auth: {
                                                                    user: 'kbhfushion@gmail.com',
                                                                    pass: 'kbh@1791'
                                                                },
                                                                secureConnection: 'false',
                                                                tls: {
                                                                    ciphers: 'SSLv3',
                                                                    rejectUnauthorized: false
                                                                }*/
                                                                service: 'gmail',
                                                                type: "SMTP",
                                                                host: "smtp.gmail.com",
                                                                secure: true,
                                                                auth: {
                                                                    user: 'kbhfushion@gmail.com',
                                                                    pass: 'kbh@1791'
                                                                },
                                                            }));
                                                            var html =  '<strong style="color:blue;">Welcome : '+ (data.user) +' </strong><br><br>'+
                                                                        '<strong style="color:blue;">Your Updated Login Details Are : </strong><br>'+
                                                                        '<strong style="color:blue;">Email :</strong>&nbsp;&nbsp;<b>'+ data.email_id +'</b><br>'+
                                                                        '<strong style="color:blue;">New Password :</strong>&nbsp;&nbsp;<b>'+ user.new_password +'</b>';    
                                                            var mailOptions = [];
                                                            mailOptions["from"] = "RK WEB Tech : <kbhfushion@gmail.com>";
                                                            mailOptions["to"] = data.user +' : <'+ data.email_id + '>';
                                                            mailOptions["subject"] = "Password Changed";
                                                            mailOptions["text"] = "Hello "+ data.user +" your password is successfully changed.";
                                                            mailOptions["html"] = html;
                                                            transporter.sendMail(mailOptions, function(error11, info){
                                                                console.log("error")
                                                                console.log(error11)
                                                                if (error11) {
                                                                    var jsonObject = {};
                                                                    jsonObject["status"] = "0";
                                                                    jsonObject["message"] = error11;
                                                                    jsonObject["data"] = [];
                                                                    res.send(jsonObject);
                                                                } else {
                                                                    var jsonObject = {};
                                                                    jsonObject["status"] = "1";
                                                                    jsonObject["message"] = "New Password has been sent to your register Email";
                                                                    jsonObject["data"] = [];
                                                                    res.send(jsonObject);
                                                                }
                                                            });
                                                        } else {
                                                            var jsonObject = {};
                                                            jsonObject["status"] = "0";
                                                            jsonObject["message"] = "id or username does not matched";
                                                            jsonObject["data"] = [];
                                                            res.send(jsonObject);
                                                        }
                                                    } else {
                                                        var jsonObject = {};
                                                        jsonObject["status"] = "0";
                                                        jsonObject["message"] = "DB :" + err2;
                                                        jsonObject["data"] = [];
                                                        res.send(jsonObject);
                                                    }
                                                    con3.release();
                                                });
                                            });
                                        }else {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = "CON: "+err3;
                                            jsonObject["data"] = [];
                                            res.send(jsonObject);
                                        }
                                    });
                                } else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = "Old Password does not match";
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                            });
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0"; 
                            jsonObject["message"] = "User not exists";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON " + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "username and user_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Active User Details By Id
function getUserDetailsById(req, res){
    var id = req.body.id;
    if(id != undefined && id != '' && id != null){
        var sql = ` select 
                        um.*, 
                        ur.id as user_role_id,
                        ur.name as user_role 
                    from user_master as um 
                    left join user_role as ur on ur.id = um.user_role_id
                    where um.id = ` + id + ` and um.status = 1`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err) {
                        if (rows != '' && rows != null && rows.length){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "User Record read Successfully";
                            jsonObject["data"] = {
                                "id" : rows[0].id,
                                "username" : rows[0].username,
                                "mobile_no" : rows[0].mobile_no,
                                "email_id" : rows[0].email_id,
                                "first_name" : rows[0].first_name,
                                "last_name" : rows[0].last_name,
                                "user_group" : rows[0].user_group,
                                "user_role_id" : rows[0].user_role_id,
                                "user_role" : rows[0].user_role  
                            };
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such user found ";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Active User Details By Id
function getFullUserDetailsById(req, res){
    var id = req.body.user_id;
    var group = req.body.user_group;
    var where = '';
    if(group && group != 'null' &&  group != '' && group != undefined){
        where = ` where um.user_group = "`+ group +`"`;
    }
    if(id && id != '' && id != undefined){
        where = `where um.id = ` + id + ` and um.user_group IS NULL `;
    }
    if(id && id != '' && id != undefined && group && group != 'null' && group != '' && group != undefined){
        where = `where um.user_group = "`+ group +`" and um.id = ` + id;
    }else {
        where = `where um.user_group IS NULL and um.id = ` + id;
    }
    if(id && id != '' && id != undefined){
        var sql = ` select 
                        um.*,
                        em.*,
                        if(sm.gender = 1, "Male", "Female") as gender,
                        sm.address,
                        if(um.modify_by IS NULL, concat_ws(' ', um2.first_name , um2.last_name), NULL)  as create_by, 
                        if(um.modify_by IS NOT NULL, concat_ws(' ', um2.first_name , um2.last_name), NULL) as modify_by, 
                        if(um.modify_by IS NULL, if(um2.user_group IS NULL, 'Admin', um2.user_group), NULL) as creator_group, 
                        if(um.modify_by IS NOT NULL, if(um2.user_group IS NULL, 'Admin', um2.user_group), NULL) as modifier_group,
                        if(um.modify_by IS NULL, ur.name, NULL) as creator_role, 
                        if(um.modify_by IS NOT NULL, ur.name, NULL) as modifier_role,
                        urr.id as user_role_id,
                        urr.name as user_role
                    from user_master as um 
                    left join employee_master as em on em.id = um.user_group_id
                    left join user_master as um2 on um2.id = IF(um.modify_by IS NULL, um.create_by, um.modify_by)
                    left join staff_master as sm on sm.id = um.user_group_id
                    left join user_role as ur on um2.user_role_id = ur.id 
                    left join user_role as urr on um.user_role_id = urr.id 
                    `+ where+` group by um.id limit 1`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows){
                    if (!err) {
                        if (rows != '' && rows != null && rows){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "User Details Found Successfully";
                            jsonObject["data"] = rows[0];
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such user found ";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Upload Chemist Image
function uploadUserImage(req,res){
    var file = req.files;
    if(!file){
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "File was not found";
        jsonObject["data"] = [];
        res.send(jsonObject);
    } else {
        if (req.url == '/uploadUserImage' && req.method.toLowerCase() == 'post') {
            if(file.file_name.mimetype =='image/jpeg' || file.file_name.mimetype =='image/jpg' || file.file_name.mimetype =='image/png'|| file.file_name.mimetype =='image/gif' || file.file_name.mimetype =='image/bmp' ){
                var splt_str = file.file_name.name.split(".");
                var last = (splt_str.length - 1);
                var ext_file_name = '';
                if(splt_str[last] != undefined && splt_str[last] != 'undefined'){
                    ext_file_name = splt_str[last].trim();
                }else {
                    ext_file_name = splt_str[1].trim();
                }
                var save_file_name = dates.generate_img_name(6) + '.' + ext_file_name;                
                var path = "./Images/User/" + save_file_name.trim();
                file.file_name.mv(path, function(err) {
                    if (err){
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "File not saved";
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    } else {
                        var db_file_name = 'User/' + save_file_name;
                        var sql = `update user_master set avatar = '` + db_file_name + `' where id = `+ req.body.user_id;
                        pool.getConnection(function (err, con1){
                            con1.query(sql,function(err, rows) {
                                if (!err) {
                                    var jsonObject = {};
                                    jsonObject["status"] = "1";
                                    jsonObject["message"] = "File Uploaded";
                                    jsonObject["data"] = db_file_name;
                                    res.send(jsonObject);
                                } else {
                                    res.send(jsonObject);
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = "DB :" + err;
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                                con1.release();
                            });
                        });
                    }
                });
            } else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "File type not valid";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        }
    }
}

// Remove User Image
function removeUserImage(req,res){
    var localPath = dir.imgDir;
    var id = req.body.id;
    var img_path = req.body.image_path;
    if(img_path != undefined && 
       img_path != '' && 
       img_path != '' && 
       img_path != null &&
       id != undefined && 
       id != '' && 
       id != '' && 
       id != null
    ){
        localPath += '/' + img_path;
        try {
            status = fs.existsSync(localPath, function(resss){
                console.log('fs.existsSync' , resss)
            });
            fs.unlink(localPath, function(ress){
                console.log(ress);
            });
            var sql = `update user_master set avatar = '' where id =`+id;
            pool.getConnection(function (err1, con1){
                if(!err1){
                    con1.query(sql,function(err, rows){
                        if (!err) {
                            if(rows.affectedRows > 0){
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = "File Removed Successfully!..";
                                jsonObject["data"] = id;
                                res.send(jsonObject);
                            }else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "Something went wrong please try again later!...";
                                jsonObject["data"] = [];
                                res.send(jsonObject);
                            }
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "DB :" + err;
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                        con1.release();
                    });
                }else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "CON :" + err1;
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                }
            });
        }catch (e) {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Some Error : "+ e;
            jsonObject["data"] = [];
            res.send(jsonObject);
        }
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "No image founds";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Active User Details By Id
function getUserDetailsByUserGroupId(req, res){
    var id = req.body.id;
    var type = req.body.type;
    var type_id = req.body.type_id;
    var parent_id = req.body.parent_id;
    var group = req.body.group;
    var where = '';
    var join = '';
    if(id != undefined && id != '' && id != null){
        if(type == undefined){
            where = ' where um.user_group_id = '+ id +' and um.user_group = "'+ group + '"';
        }else {

        }
        var sql = ` select 
                        um.id,
                        um.status, 
                        um.create_by, 
                        um.first_name, 
                        um.last_name,
                        um.username,
                        um.email_id,
                        um.mobile_no,
                        um.user_group,
                        um.user_group_id, 
                        ur.id as user_role_id,
                        ur.name as user_role, 
                        um.avatar
                    from user_master as um  
                    left join user_role as ur on ur.id = um.user_role_id 
                    `+ join +`
                    ` + where;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err) {
                        if (rows != '' && rows != null && rows.length){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "User Login Details Found Successfully";
                            jsonObject["data"] = rows[0];
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such user found";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON :" + err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id or user_group_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

function renewProductSubscription(req, res){
    user_info = {
        id: req.body.id ? req.body.id : null,
        type: req.body.type != 'null' && req.body.type != null ? req.body.type : null,
        plan_id: req.body.plan_id ? req.body.plan_id : null,
        end_user_key: req.body.end_user_key ? req.body.end_user_key : null,
    }
    if(user_info.id && user_info.type && user_info.plan_id){
        var jsonObject = {};
        jsonObject["status"] = "1";
        jsonObject["message"] = "Your Subscription Renewed Successfully!";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "user_id , type and plan_id are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

function getUserBySearch(req, res){
    var search_string = req.body.search_string;
    var whereCond1 = '';
    if(search_string.length > 0 ){
        whereCond1 = ` and (  um.first_name like '%` + search_string + `%' or 
                                um.mobile_no like '%` + search_string + `%' or 
                                um.email_id like '%` + search_string + `%'
                            )`;
    } 
    var sql = ` select 
                    um.id,
                    concat_ws(' ',um.first_name, um.last_name) as name
                from user_master as um
                where (um.user_group = 'freelancer' or um.user_group = 'company') and um.status = 1
                `+ whereCond1 +`
                order by um.first_name asc
                limit 100`;
    pool.getConnection(function(err1, con1){
        if(!err1){
            con1.query(sql, function(err, rows){
                if(!err) {
                    if(rows.length > 0) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Employees found successfully!..";
                        jsonObject["data"] = rows;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = " No Employee data found !..";
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "DB :" + err;
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                }
                con1.release();
            });
        }else {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "CON :" + err1;
            jsonObject["data"] = [];
            res.send(jsonObject);
        }
    });
}

var checkUserUsername = function(username) {
    return new Promise(function(resolve) {
        var sql = ` SELECT
                        count(id) as count
                    FROM
                        user_master
                    WHERE
                        username ='`+ username +`'`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows){
                    if (!err){
                        if (rows && rows[0] && rows[0].count != undefined){
                            if(rows[0].count === 0){
                                resolve({status:1, data: []});
                            }else {
                                resolve({status:0, data: rows[0].count});
                            }
                        }else {
                            resolve({status:0, data: []});
                        }
                    } else{
                        resolve({status:0, data: err});
                    }
                    con1.release();
                });
            } else{
                resolve({status:0, data: err1});
            }
        });
    });
}

var informUsers = function(role){
    var to = '';
    var message = {
        notification: {
            title: 'Access Rights Updated!',
            body: '',
        },
        data:{
            role: "",
        },
        token: to
    };
    return new Promise(function(resolve){
        var sql = `select id, username, web_token from user_master where user_role_id = `+ role +``
        console.log("sql for informUsers ==>  " + sql);
        pool.getConnection(function(err, con1){
            if(!err){
                con1.query(sql, function(err1, rows){
                    if(!err1){
                        if(rows.length > 0){
                            var result = [];
                            for(var i = 0; i< rows.length; i++){
                                var registrationToken = rows[i].web_token; 
                                var body = 'hello, ' + rows[i].username + ' your access rights for mr app are updated successfully!..';
                                var user_id = rows[i].id;
                                if(registrationToken != undefined && registrationToken){
                                    message.data.role = user_id.toString();
                                    message.notification.body = body;
                                    message.token = registrationToken;
                                    console.log(message);
                                    admin.messaging().send(message)
                                    .then((response) => {
                                        result.push(response);
                                        console.log('Successfully sent message:');
                                        console.log(response)
                                    })
                                    .catch((error) => {
                                        result.push(error);
                                        console.log('Error sending message:');
                                        console.log(error)
                                    });
                                }else {
                                    resolve({status: 1, data: rows[i].username + ' does not have webpush functionality'});
                                    console.log(rows[i].username + ' does not have webpush functionality');
                                }
                                if(i == (rows.length - 1)){
                                    resolve({status: 1, data:result});
                                }
                            }
                        }else {
                            resolve({status: 1, data: []});
                        }
                    }else {
                        resolve({status: 0, data: err});
                    }
                    con1.release();
                });
            }else {
                resolve({status: 0, data: err})
            }
        });
    });
}

function sendWebPush(req, res){
    var to = 'cpR9ZEKPJfE:APA91bEaK5LbVeiuNQVOIpnR49Vtma9HRBsRyecTRYP018WbXyZpzXgadsusKJYnhAgpk8Pz92dDmr3vCD89A6bMfGh1syH4390D9SNhRxMEZhaWMeHLwazL7NiFnCM0xbwPlFmyQvDK';
    var message = {
        notification: {
            title: '$GOOG up 1.43% on the day',
            body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
        },
        data:{
            role: "",
        },
        token: to
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    var result = [];
    admin.messaging().send(message)
    .then((response) => {
        // Response is a message ID string.
        result.push(response);
        console.log('Successfully sent message:', response);
        res.send({
            status: 1,
            message: 'Push Send Successfully',
            data:response
        })
    })
    .catch((error) => {
        result.push(error);
        console.log('Error sending message:', error);
        res.send({
            status: 0,
            message: 'Failed To Send Push',
            data:result
        })
    });
}

function _processTokens (data, result) {
    var user = data;
    var issue = '';
    var access_token = '';
    var refresh_token = '';
    _userHasTokens(user.id, function(res){
        if(res == 1){
            _validateTokens(user, function(res1){
                if(res1 == 1) {
                    var data = {
                        "id" : user.id,
                        "status" : 1,
                        "message" : 'success',
                        "access_token" : user.access_token,
                        "refresh_token" : user.refresh_token,
                        "expire_time" : dates._generateTimeStamp(user.expire_time),
                        "updated_at" : dates._generateTimeStamp()
                    };
                    result(data);
                }else {
                    access_token = dates.generate_token(32).trim();
                    refresh_token = user.refresh_token;
                    var validity = 120;
                    var newTime = new Date();
                    var expire_time = dates._generateTimes(dates._generateTimeStamp(), 'minute', validity);
                    var token_data = {
                        "id" : user.id,
                        "access_token" : access_token,
                        "refresh_token" : refresh_token,
                        "expire_time" : dates._generateDateFormat(expire_time, 'yyyy-mm-dd hh:ii:ss'),
                        "updated_at" : dates._generateTimeStamp()
                    };
                    // Token founds then update token else create new one
                    _updateTokenDetails(token_data, function(res2){
                        var data = {
                            "id" : user.id,
                            "status" : res2.status,
                            "message" : res2.message,
                            "access_token" : res2.data.access_token,
                            "refresh_token" : res2.data.refresh_token,
                            "expire_time" : dates._generateTimeStamp(res2.data.expire_time),
                            "updated_at" : dates._generateTimeStamp()
                        };
                        var data1 = {
                            "id" : user.id,
                            "status" : res2.status,
                            "message" : res2.message,
                            "access_token" : '',
                            "refresh_token" : res2.data.refresh_token,
                            "expire_time" : '',
                            "updated_at" : dates._generateTimeStamp()
                        };
                        var final = (res2.status == 1) ? data : data1;
                        result(final);
                    });
                }
            });
        }else {
            access_token = dates.generate_token(32).trim();
            refresh_token = dates.generate_token(32).trim();
            var validity = 120;
            var expire_time = dates._generateTimes(dates._generateTimeStamp(), 'minute', validity);
            var token_data = {
                "id" : user.id,
                "access_token" : access_token,
                "refresh_token" : refresh_token,
                "expire_time" : dates._generateDateFormat(expire_time, 'yyyy-mm-dd hh:ii:ss'),
                "updated_at" : dates._generateTimeStamp()
            };
            _updateTokenDetails(token_data, function(res4){
                var data = {
                    "id" : user.id,
                    "status" : res4.status,
                    "message" : res4.message,
                    "access_token" : res4.data.access_token,
                    "refresh_token" : res4.data.refresh_token,
                    "expire_time" : dates._generateTimeStamp(res4.data.expire_time),
                    "updated_at" : dates._generateTimeStamp()
                };
                var data1 = {
                    "id" : user.id,
                    "status" : res4.status,
                    "message" : res4.message,
                    "access_token" : '',
                    "refresh_token" : res4.data.refresh_token,
                    "expire_time" : '',
                    "updated_at" : dates._generateTimeStamp()
                };
                var final = (res4.status == 1) ? data : data1;
                result(final);
            });
        }
    });
}

function _validateTokens(tokendata, result) {
    if(tokendata.access_token && tokendata.id){
        var sql = ` select id, access_token, refresh_token, expire_time 
                    from user_master 
                    where access_token = "` + tokendata.access_token +`" and id = ` + tokendata.id;
         pool.getConnection(function(err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {         
                    if (!err) {  
                        if(rows && rows[0] && rows[0].id > 0) {
                            var data = rows[0];
                            if(data){
                                var expire = (data.expire_time && data.expire_time != "" && data.expire_time != null) ? dates._generateTimeStamp(data.expire_time) : '' ;
                                if (expire != "" && expire >= dates._generateTimeStamp()){
                                    result(1);
                                } else {
                                    result(0);
                                }
                            }else {
                                result(0);
                            }
                        } else {
                            result(0);
                        }
                    } else {
                        result(0);
                    }
                    con1.release();
                });
            } else {
                result(0);
            }
        });
    }else {
        result(0);
    }
}

function _userHasTokens(id, result){
    if(id && id != 'undefined' && id !== undefined){
        var sql = `select id, access_token, refresh_token from user_master where id = ` + id;
         pool.getConnection(function(err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err) {
                        if(rows && rows[0] && rows[0].id > 0) {
                            var data = rows[0];
                            if(data) {
                                if(data.access_token || data.refresh_token){
                                    result(1);
                                }else {
                                    result(0);
                                }
                            }else {
                                result(0);
                            }
                        } else {
                            result(0);
                        }
                    } else {
                        result(0);
                    }
                    con1.release();
                });
            }else {
                result(0);
            }
        });
    }else {
        result(0);
    }
}

function _updateTokenDetails(data, result){
    var user = {
        "id": data.id,
        "access_token": data.access_token,
        "refresh_token": data.refresh_token,
        "expire_time": data.expire_time
    };
    var sql1 = ` update user_master set  
                    access_token = "`+user.access_token+`",
                    refresh_token = "`+user.refresh_token+`",
                    expire_time = "`+user.expire_time+`"
                    where id = ` + user.id;
    console.log("_updateTokenDetails sql ============> \t\r\n" + sql1)
    pool.getConnection(function(err1, con1){
        if(!err1){
            con1.query(sql1,function(err, rows) {
                if (!err) { 
                    if(rows.affectedRows > 0){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "success";
                        jsonObject["data"] = user;
                        result(jsonObject);
                    }else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "failed";
                        jsonObject["data"] = [];
                        result(jsonObject);
                    }
                } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "DB :" + err;
                    jsonObject["data"] = [];
                    result(jsonObject);
                }
                con1.release();
            });
        }else {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "CON :" + err1;
            jsonObject["data"] = [];
            result(jsonObject);
        }
    });
}

function _generateTokenByRefreshToken(data, result){
    var user = data;
    access_token = dates.generate_token(32).trim();
    refresh_token = user.refresh_token;
    var validity = 120;
    var expire_time = dates._generateTimes(dates._generateTimeStamp(), 'minute', validity);
    var token_data = {
        "id" : user.id,
        "access_token" : access_token,
        "refresh_token" : refresh_token,
        "expire_time" : dates._generateDateFormat(expire_time, 'yyyy-mm-dd hh:ii:ss'),
        "updated_at" : dates._generateTimeStamp()
    };
    // Token founds then update token else create new one
    _updateTokenDetails(token_data, function(res){
        var data = {
            "id" : user.id,
            "status" : res.status,
            "message" : res.message,
            "access_token" : res.data.access_token,
            "refresh_token" : res.data.refresh_token,
            "expire_time" : dates._generateTimeStamp(res.data.expire_time),
            "updated_at" : dates._generateTimeStamp()
        };
        var data1 = {
            "id" : user.id,
            "status" : res.status,
            "message" : res.message,
            "access_token" : '',
            "refresh_token" : res.data.refresh_token,
            "expire_time" : '',
            "updated_at" : dates._generateTimeStamp()
        };
        var final = (res.status == 1) ? data : data1;
        result(final);
    });
}

var setSecretKey = function(data){
    return new Promise((resolve) =>{
        if(data.secret_key && data.id){
            var sql = ` update user_master set secret_key = '`+ data.secret_key +`'
                        where id = `+ data.id +``;
            console.log("setSecretKey sql ==========> " + sql)
             pool.getConnection(function(err1, con1){
                if(!err1){
                    con1.query(sql, function(err, rows){
                        if(!err) {
                            resolve({status: 1, data: data});
                        } else {
                            resolve({status: 0, data: "DB : " + err});
                        }
                        con1.release();
                    });  
                }else {
                    resolve({status: 0, data: "CON: " + err1});
                }
            });
        }else {
            resolve({status: 0, data: "id and key are required"});
        }
    })
}
module.exports = router;