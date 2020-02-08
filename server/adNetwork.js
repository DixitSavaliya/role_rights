var compression = require('compression');
var express = require('express');
var fileUpload = require('express-fileupload');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var request = require('request');
var schedule = require('node-schedule');
var session = require('express-session');
var findRemoveSync = require('find-remove');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');
var path = require('path');
var cors = require('cors');
var fs = require('fs');
var util = require('util');
var helmet = require('helmet');
var _ = require('lodash');
var dates = require('./dates');
var cache = require('./cache');
// var sheduler = require('./shedular');
var pool = require('./database')();
// intializing REDIS SERVER FOR caching
cache._checkRedis();

// Create Express Application Server
app = express();
app.use(compression());
app.use(cors({credentials: true, origin: '*'}));
app.use(bodyParser.json({limit: '100mb', extended: true, parameterLimit: 10000000 }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 10000000 }));
app.use(cookieParser());
app.use(helmet());
app.use(nocache);
app.use(fileUpload({ limits: { fileSize: 1 * 8196 * 8196 },}));

var logDirectory ='./Log';

// for No Cache Controll over node using express

app.use( errorHandler( {dumpExceptions: true,showStack: true} ) );

function nocache(req, res, next) {
    //apm.captureError('testing 192.168.5.15 error');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Cache-Control', 'public, max-age=' + 172800000);
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

var _validateSecretTokens = function(tokendata, id){
    return new Promise(function(resolve) {
        if(tokendata){
            var user_form_token = '';
            var user_from_id = '';
            cache._getRedisData(tokendata, function(result1, error){
                if(result1){
                    user_form_token = JSON.parse(result1);
                    if(user_form_token.secret_key == id){
                        cache._getRedisData(user_form_token.secret_key, function(result2, error1){
                            if(result2){
                                user_from_id = JSON.parse(result2);
                                if(user_from_id.secret_key == id && user_form_token.access_token == user_from_id.access_token){
                                    if(dates._generateTimeStamp(user_form_token.expire_time) >= dates._generateTimeStamp()){
                                        resolve({"status": "1"});
                                    }else {
                                        resolve({"status": "0"});
                                    }
                                }else {
                                    resolve({"status": "0"});
                                }
                            }else {
                                resolve({"status": "0"});
                            }
                        });
                    }else {
                        resolve({"status": "2"});
                    }
                }else {
                    resolve({"status": "0"});
                }
            });
        }else {
            resolve({status:0});
        }
    });
}

// auth from redis
function returnTokenFromRedis(username, id, cb){
    cache._getRedisData(username, function(result1, error){
        if(result1){            
            var refresh_token_data = JSON.parse(result1);
            if(refresh_token_data.id == id){
                cb(result1);
            }else {
                cb("2");    
            }
        }else {
            cb("0");
        }
    });
}

var updateAppFCM = function(package, token, device){
    return new Promise(function(resolve){
        if(package && token){
            pool.getConnection(function(err, con){
                if(!err){
                    let sql = ` select 
                                    count(id) as count,
                                    id,
                                    (select count(id) as device_id from device_master where device_id = '`+device+`' limit 1) as hasDevice
                                from application_master 
                                where
                                    package= '`+package+`' and 
                                    owner = 'publisher'
                                group by id
                                limit 1`;
                    console.log("updateAppFCM sql \r\n" + sql)
                    con.query(sql, function(err1, rows1){
                        if(!err1){
                            if(rows1 && rows1[0].count != undefined && rows1[0].count > 0){
                                if(rows1[0].hasDevice){
                                    pool.getConnection(function(err, con){
                                        if(!err){
                                            let sql = ` update device_master 
                                                        set 
                                                            fcm = '`+token+`'
                                                        where
                                                            device_id= '`+device+`' and 
                                                            app_id = `+rows1[0].id+``;
                                            console.log("updateDeviceFCM sql \r\n" + sql)
                                            con.query(sql, function(err1, rows){
                                                con.release();
                                                if(!err1){
                                                    resolve({status: 1, data: rows.affectedRows})
                                                }else {
                                                    resolve({status: 0, data: "DB: " + err1})
                                                }
                                            })
                                        }else {
                                            resolve({status: 0, data: "CON: " + err})
                                        }
                                    })
                                }else {
                                    pool.getConnection(function(err, con){
                                        if(!err){
                                            let sql = ` insert into device_master(app_id, device_id, fcm) VALUES 
                                                        (
                                                            `+rows1[0].id+`,
                                                            '`+device+`',
                                                            '`+token+`'
                                                        )`;
                                            console.log("insertDeviceFCM sql \r\n" + sql)
                                            con.query(sql, function(err1, rows){
                                                con.release();
                                                if(!err1){
                                                    resolve({status: 1, data: rows.affectedRows})
                                                }else {
                                                    resolve({status: 0, data: "DB: " + err1})
                                                }
                                            })
                                        }else {
                                            resolve({status: 0, data: "CON: " + err})
                                        }
                                    })
                                }
                            }else {
                                resolve({status: 0, data: "no such application is found to update fcm data"})
                            }
                        }else {
                            resolve({status: 0, data: "DB: " + err1})
                        }
                    })
                }else {
                    resolve({status: 0, data: "CON: " + err})
                }
            })
            
        }else {
            resolve({status: 0, data: 'app_package and fcm token are required'});
        }
    })
}

var increaseAdvertiserAppCount = function(app_id, request_id){
    return new Promise(function(resolve){
        if(app_id && request_id){
            var sql = `insert into application_hit_count(app_id, request_id) values(`+app_id+`, `+request_id+`)`;
            console.log("increaseAdvertiserAppCount sql \r\n "+ sql);
            pool.getConnection(function (err2, con3){
                if(!err2){
                    con3.query(sql, function(err, rows1){
                        con3.release();
                        if (!err) {
                            resolve({status: 1, data: rows1.affectedRows});
                        } else {
                            resolve({status: 0, data: "DB :" + err});
                        }
                    });
                }else {
                    resolve({status: 0, data: "CON: " + err2});
                }
            });
        }else {
            resolve({status: 0, data: "request app_id and app data are required"})
        }
    });
}

// for JWT
app.use(function(req, res, next) {
    var origin = req.headers.origin != undefined ? req.headers.origin : '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials, Access-Control-Allow-Origin, X-Requested-With, Access-Control-Allow-Headers, content-type, Authorization, content-md5');
    var currentUrl = req.url ? req.url : '';
    var check = true;
    console.log('requested_plain_url ==>    ' + req.url);
    if(currentUrl && check === true){
        switch(currentUrl) {
            case 'favicon.ico'   :  check = false ;  break;
            case 'favicon.png'   :  check = false ;  break;            
            case '/User/getAuthTokens'   :  check = false ;  break;
            case '/User/getAccessTokenByRefreshToken' : check = false;  break;
            case '/User/forgotPassword'   :  check = false ;  break;
            case '/User/registerUser'   :  check = false ;  break;
            case '/AP/registerUsers'   :  check = false ;  break;
            case '/AP/updateFCM'   :  check = false ;  break;
            case '/Application/getAdsSettings'   :  check = false ;  break;
            case '/Application/updateAppHitCount'   :  check = false ;  break;
            case '/Notification/sendPushNotification'   :  check = false ;  break;
            case '/UserRole/searchUserRole'   :  check = false ;  break;
            case '/User/ping'   :  check = false ;  break;
            case '/User/'   :  check = false ;  break;
            default :  check = true;  break;
        }
    }
    //var for multimedia cases
    var multimedia = [];
    var prefix = '';
    prefix = currentUrl.substring(0, 3)
    var multimedia = currentUrl.split(".");
    if (multimedia && multimedia.length > 1) {
        console.log("multimedia[(multimedia.length - 1)]" +  multimedia[(multimedia.length - 1)])
        if( multimedia[(multimedia.length - 1)] == 'jpg' || 
            multimedia[(multimedia.length - 1)] == 'jpeg' || 
            multimedia[(multimedia.length - 1)] == 'png' || 
            multimedia[(multimedia.length - 1)] == 'gif' || 
            multimedia[(multimedia.length - 1)] == 'ico' || 
            multimedia[(multimedia.length - 1)] == 'svg' || 
            multimedia[(multimedia.length - 1)] == 'bmp' || 
            multimedia[(multimedia.length - 1)] == 'webp' || 
            multimedia[(multimedia.length - 1)] == 'JPG' || 
            multimedia[(multimedia.length - 1)] == 'JPEG' || 
            multimedia[(multimedia.length - 1)] == 'PNG' || 
            multimedia[(multimedia.length - 1)] == 'GIF' || 
            multimedia[(multimedia.length - 1)] == 'ICO' || 
            multimedia[(multimedia.length - 1)] == 'SVG' || 
            multimedia[(multimedia.length - 1)] == 'BMP' || 
            multimedia[(multimedia.length - 1)] == 'WEBP' ||
            multimedia[(multimedia.length - 1)] == 'xlsx' || 
            multimedia[(multimedia.length - 1)] == 'xls' || 
            multimedia[(multimedia.length - 1)] == 'ppt' || 
            multimedia[(multimedia.length - 1)] == 'pptx' || 
            multimedia[(multimedia.length - 1)] == 'pdf' || 
            multimedia[(multimedia.length - 1)] == 'doc' || 
            multimedia[(multimedia.length - 1)] == 'docx' ||
            multimedia[(multimedia.length - 1)] == 'XLSX' || 
            multimedia[(multimedia.length - 1)] == 'XLS' || 
            multimedia[(multimedia.length - 1)] == 'PDF' || 
            multimedia[(multimedia.length - 1)] == 'DOC' || 
            multimedia[(multimedia.length - 1)] == 'DOCX' ||
            multimedia[(multimedia.length - 1)] == 'PPT' ||
            multimedia[(multimedia.length - 1)] == 'PPTX' ||
            multimedia[(multimedia.length - 1)] == 'ICO' ||
            multimedia[(multimedia.length - 1)] == 'mp4' || 
            multimedia[(multimedia.length - 1)] == 'mkv' || 
            multimedia[(multimedia.length - 1)] == 'flv' || 
            multimedia[(multimedia.length - 1)] == 'avi' || 
            multimedia[(multimedia.length - 1)] == '3gp' 
        ) {
            check = false;
        }
    }
    if(currentUrl.indexOf('socket.io') > -1){
        check = false;
    }
    var end_user_id;
    var end_user_key;
    end_user_id = req.body.end_user_id != undefined ? req.body.end_user_id : req.headers['content-md5'];
    end_user_key = req.body.end_user_key != undefined ? req.body.end_user_key : req.headers['content-md5'];
    var group = '';
    check = false;
    var hasAccess = true;
    end_user_id = end_user_key != undefined ? end_user_key : end_user_id;
    console.log("required check ------------------------->  " + check)
    if(check){
        var authorization = req.headers.authorization;
        if(authorization != '' && authorization != undefined && authorization !== undefined){
            var data = authorization.split(" ");
            var authToken = data[1] ? data[1] : '';
            if (authToken != '') {
                if(authToken.length === 32){
                    var jsonObject = {};
                    if(end_user_id != undefined){
                        _validateSecretTokens(authToken, end_user_id)
                        .then(function(result){
                            if(result.status == 1){
                                if(currentUrl == '/AP/increaseAppCount'){
                                    let obj = {
                                        app_id: req.body.id ? req.body.id : null,
                                        app_id: req.body.id ? req.body.id : null,
                                        request_id: req.body.request_id ? req.body.request_id : null,
                                    }
                                    if(end_user_id != undefined){
                                        returnTokenFromRedis(req.body.username, end_user_id, function(redisHasToken){
                                            if(redisHasToken == '2'){
                                                var jsonObject = {};
                                                jsonObject['status'] = '0';
                                                jsonObject['message'] = 'Invalid Access';
                                                jsonObject['data'] = [];
                                                res.send(jsonObject);
                                                
                                            }else if(redisHasToken != '0'){
                                                if(redisHasToken.length > 0){
                                                    var jsonObject = {};
                                                    jsonObject['status'] = '1';
                                                    jsonObject['message'] = 'Access Token return from redis successfully!';
                                                    jsonObject["data"] = JSON.parse(redisHasToken);
                                                    res.send(jsonObject);
                                                }else {
                                                    next(); 
                                                }
                                            }else {
                                                next();
                                            }
                                        });
                                    }else {
                                        var jsonObject = {};
                                        jsonObject['status'] = '0';
                                        jsonObject['message'] = 'user id not found in request!';
                                        jsonObject['data'] = [];
                                        res.send(jsonObject); 
                                    }
                                }else {
                                    next();
                                }
                            }else if(result.status == 2){
                                var jsonObject = {};
                                jsonObject['status'] = '0';
                                jsonObject['message'] = 'Invalid Access';
                                jsonObject['data'] = [];
                                res.send(jsonObject);
                            }else {
                                var jsonObject = {};
                                jsonObject['status'] = '2';
                                jsonObject['message'] = 'Token expired';
                                jsonObject['token'] = '0';
                                res.send(jsonObject);
                            }
                        })
                    }else {
                        var jsonObject = {};
                        jsonObject['status'] = '0';
                        jsonObject['message'] = (prefix == '/v2') ? 'end_user_key not found in request!' : 'end_user_id not found in request!';
                        jsonObject['data'] = [];
                        res.send(jsonObject);    
                    }
                }else {
                    var jsonObject = {};
                    jsonObject['status'] = '0';
                    jsonObject['message'] = 'Either Token is not valid or not found!';
                    jsonObject['token'] = '0';
                    res.send(jsonObject);
                }
            }else {
                var jsonObject = {};
                jsonObject['status'] = '0';
                jsonObject['message'] = 'Empty token found!';
                jsonObject['token'] = '0';
                res.send(jsonObject);
            }
        }else {
            var jsonObject = {};
            jsonObject['status'] = '0';
            jsonObject['message'] = 'Token not found!';
            jsonObject['token'] = '0';
            res.send(jsonObject);
        }
    }else {
        if(currentUrl == '/User/getAccessTokenByRefreshToken'){
            if(end_user_id != undefined){
                returnTokenFromRedis(req.body.username, end_user_id, function(redisHasToken){
                    if(redisHasToken == '2'){
                        var jsonObject = {};
                        jsonObject['status'] = '0';
                        jsonObject['message'] = 'Invalid Access';
                        jsonObject['data'] = [];
                        res.send(jsonObject);
                        
                    }else if(redisHasToken != '0'){
                        if(redisHasToken.length > 0){
                            var jsonObject = {};
                            jsonObject['status'] = '1';
                            jsonObject['message'] = 'Access Token return from redis successfully!';
                            jsonObject["data"] = JSON.parse(redisHasToken);
                            res.send(jsonObject);
                        }else {
                            next(); 
                        }
                    }else {
                        next();
                    }
                });
            }else {
                var jsonObject = {};
                jsonObject['status'] = '0';
                jsonObject['message'] = 'user id not found in request!';
                jsonObject['data'] = [];
                res.send(jsonObject); 
            }
        } else if(currentUrl == '/AP/updateFCM'){
            let fcm = req.body.fcm != undefined && req.body.fcm ? req.body.fcm : null;
            let package = req.body.package != undefined && req.body.package ? req.body.package : null;
            let device_id = req.body.device_id != undefined && req.body.device_id ? req.body.device_id : null;
            if(package && fcm && device_id){
                updateAppFCM(package, fcm, device_id).then(function(resUpdate){
                    if(resUpdate.status == 1){
                        var jsonObject = {};
                        jsonObject['status'] = '1';
                        jsonObject['message'] = 'FCM Updated Successfully!';
                        jsonObject['data'] = [];
                        res.send(jsonObject);
                        
                    }else {
                        var jsonObject = {};
                        jsonObject['status'] = '0';
                        jsonObject['message'] = 'Failed To Update FCM: ' + resUpdate.data;
                        jsonObject['data'] = [];
                        res.send(jsonObject);
                    }
                });
            }else {
                var jsonObject = {};
                jsonObject['status'] = '0';
                jsonObject['message'] = 'add_package and fcm token required';
                jsonObject['data'] = [];
                res.send(jsonObject); 
            }
        } else if(currentUrl == '/AP/incrementAppClick'){
            let app_id = req.body.app_id != undefined && req.body.app_id ? req.body.app_id : null;
            let request_id = req.body.request_id != undefined && req.body.request_id ? req.body.request_id : null;
            if(app_id && request_id){
                increaseAdvertiserAppCount(app_id, request_id).then(function(resUpdate){
                    if(resUpdate.status == 1){
                        var jsonObject = {};
                        jsonObject['status'] = '1';
                        jsonObject['message'] = 'Click Count Updated Successfully!';
                        jsonObject['data'] = [];
                        res.send(jsonObject);
                        
                    }else {
                        var jsonObject = {};
                        jsonObject['status'] = '0';
                        jsonObject['message'] = 'Failed To Update Click: ' + resUpdate.data;
                        jsonObject['data'] = [];
                        res.send(jsonObject);
                    }
                });
            }else {
                var jsonObject = {};
                jsonObject['status'] = '0';
                jsonObject['message'] = 'application id and requested application id are required';
                jsonObject['data'] = [];
                res.send(jsonObject); 
            }
        }  else {

            next();
        }
    }
});


var logDirectory = path.join(__dirname, 'Log');
// create a rotating write stream
var accessLogStream = rfs('access_'+ dates._generateDateFormat('','dd_mm_yyyy') + '_' + dates._generate_otp(6)+'.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

var log_file = fs.createWriteStream(logDirectory + '/log_debug_'+ dates._generateDateFormat('','dd_mm_yyyy') + '_' + dates._generate_otp(6)+'.log', {flags : 'a'});
var log_stdout = process.stdout; 

console.log = function(d) { 
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

morgan.token('date', function () {
    return dates._generateDateFormat('','dd-mm-yyyy hh:ii:ss:ms');
});

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// setup the logger
morgan.format = "' Request_From_IP ' :remote-addr, ' Request_User ' :remote-user, ' Request_Date_Time ' :date[clf], ' Request_Type ' :method, ' Request_URL ' :url, ' HTTP_Version ' :http-version, ' Response_Code ' :status, ' Content_Length ' :res[content-length], ' Response_Time ' :response-time ms,";
app.use(morgan(morgan.format));
app.use(morgan(morgan.format, {stream: accessLogStream}));

// controllers mapping
var applicationApi = require('./controllers/application_controller');
var notificationApi = require('./controllers/notification_controller');
var users_Api = require('./controllers/users_controller');
var userApi = require('./controllers/user_controller');
var userRoleApi = require('./controllers/user_role_controller');


// controller binding
app.use('/Application', applicationApi);
app.use('/Notification', notificationApi);
app.use('/AP', users_Api);
app.use('/User', userApi);
app.use('/UserRole', userRoleApi);
app.use('/', require('./controllers/socket_controller'));


app.use(express.static(__dirname + '/Upload'));
app.use(express.static(__dirname + '/Files'));
app.use(express.static(__dirname + '/Images'));

app.get('/', function(req, res){   
    var a = 0;
    var r = '';
    if(a){
        r = 'false is passed';
    }else {
        r = 'false is not passed';
    }
    res.send(r);
});

/* var key  = fs.readFileSync('/var/www/html/crt/my.key', 'utf8');
var cert = fs.readFileSync('/var/www/html/crt/my.crt', 'utf8');
var credentials = {
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false
}; */
let http_port, https_port = '';
http_port = 3004;
https_port = 3005;
var http = require('http');
var https = require('https');
var httpServer = http.createServer(app).listen(http_port);
//var httpsServer = https.createServer(credentials, app).listen(https_port);
console.log('Listening HTTP on port '+ http_port);
//console.log('Listening HTTPS on port ' + https_port); 
module.exports = app;


