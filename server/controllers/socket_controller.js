var config = require('../config.json');
var _ = require('lodash');
var pool = require('../database')();
var moment = require('moment');
var FCM = require('fcm-node');
var express = require('express');
var cors = require('cors');
var fs = require('fs');
var app = express();
app.use(cors({credentials: true, origin: '*'}));
var router = express.Router();
/* var key  = fs.readFileSync('/var/www/html/crt/my.key', 'utf8');
var cert = fs.readFileSync('/var/www/html/crt/my.crt', 'utf8');
var credentials = {
    key: key,
    cert: cert,
    requestCert: false,
    rejectUnauthorized: false
}; */
let port = 4002;
var server = require('http').createServer(app);
var io = require('socket.io')(server, { origins: '*:*', 'pingInterval': 5000, 'pingTimeout': 25000});
io.set('transports', ['websocket', 'polling']);
io.on('connection', function (socket) {
    //sending socket.id
    io.to(socket.id).emit('getSocketID', {socketId : socket.id});

    socket.on('getAppInfo', function(user_id, ack){
        
    });
    
    socket.on('disconnect', function () {
        console.log("Delete  SocketId:" + socket.id);
        socket.disconnect(); 
    });

    socket.on('right_updated', function (ack) {
        console.log('\t\t\t\t\t\t \n\r new_right_updated brodcasted ');
        io.emit('new_right_updated');
        ack({status: 1, msg:`right updated called successfully to socketID ${socket.id}`});
    });
});

function sendFcmMessage(msgObj){
    return new Promise((response)=> {
        console.log("Inside FCM Function " + JSON.stringify(msgObj));
        function isJosn(str){
            try{
                JSON.parse(str);
            }catch(e){
                return false;
            }
            return true;
        }
        var sender = msgObj.from_user ? msgObj.from_user : null;
        var receiver = msgObj.to_user ? msgObj.to_user : null;
        var text = '';
        var flag = 0;
        var error;
        text = msgObj.msg;    
        var type = 1;
        var msg = '';
        if(msgObj.msg !== undefined){
            msg = msgObj.msg;
        } else {
            type = 2;
            msg = msgObj.file;
        } 
        text = {
            from_user : sender,
            to_user : receiver, 
            type : type,
            msg : msg,
            date : msgObj.date,
            time : msgObj.time,
        };    
        console.log("Inside Step1" );
        var ios_message = msg;
        var jsonObject = {};
        console.log("ios_message => " + ios_message);
        function _checkUserExistance(username){
            return new Promise((x)=> {
                var sql = ` select 
                                mobile_no,
                                email,
                                id,
                                username,
                                user_info 
                            from user_master 
                            where username = '`+ username + `' 
                            limit 1`;
                pool.getConnection(function(err1, con1){
                    if(!err1){
                        con1.query(sql,function(err, rows) {         
                            if (!err) { 
                                if(rows.length > 0){
                                    rows[0].device_info = rows[0].device_info && isJson(rows[0].device_info) ? JSON.parse(rows[0].device_info) : null;
                                    x({status : 1, data: rows[0]});
                                }else {
                                    x({status : 0, data: []});
                                }
                            } else {                              
                                x({status : 0, data: err});
                            } 
                            con1.release();  
                        }); 
                    }else {
                        x({status : 0, data: err1});
                    }
                });
            })
        }
        var text = isJosn(text) ? text: JSON.stringify(text);
        console.log("text");
        console.log(text);
        if(sender && receiver){
            console.log("Inside Step2 " );
            _checkUserExistance(receiver, function(response){
                if(response.status == 1){
                    var userData = response1.data;
                    //console.log("userData");
                    //console.log(userData);
                    var type = userData.device_info.type;
                    var fcmKey = config.serverKey;
                    var fcm = new FCM(fcmKey);
                    console.log("user OS Type =>  "  + type);
                    //data: "This is to notify you for the following transaction no: " + transaction_id + text
                    var message;
                    if(type == 2){
                        message = {
                            "data": {
                                "title": "Ad_network",
                                "body": text,
                                "sound": "default",
                                "icon": "ic_launcher",
                                "click_action": sender_mobile
                            },
                            "to": userData.fcm_token,
                            "apns": {
                                "headers": {
                                'apns-priority': '10'
                                },
                                "payload": {
                                    "aps": {
                                        alert: {
                                            title: "Ad_network",
                                            body: text,
                                        },
                                        badge: 42,
                                    }
                                }
                            },
                            "notification": {
                                "body": ios_message,
                                "sound": "default"
                            },
                        };
                    } 
                    if(type == 1 || type == null || type == 'null'){
                        message = { 
                            "data": {
                                "title": "Ad_network",
                                "body": text,
                                "sound": "default",
                                "icon": "ic_launcher",
                                "click_action": "chat" 
                            },
                            "to": userData.fcm_token,
                        };
                    }
                    console.log("message");
                    console.log(message);
                    var jsonObject = {};
                    var count = 0;
                    fcm.send(message, function(err, response){
                        if (err) {
                            count++;
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "FCM Error: " + err;
                            jsonObject["data"] = [];
                        } else {
                            count++;
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Notification Send Successfully!...";
                            jsonObject["data"] = message;
                        }
                        if(count === 1){
                            response(jsonObject);
                        }
                    });
                }else {
                    var jsonObject = {};
                    jsonObject["status"] = 0;
                    jsonObject["message"] = "No User found in system";
                    jsonObject["data"] = [];
                    response(jsonObject);
                }
            });
        }else {
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "sender and recipient mobile number is required to send push notification";
            jsonObject["data"] = [];
            response(jsonObject);
        }
    })
}

server.listen(port);
console.log("socket server started on port " + port);
module.exports = router;
