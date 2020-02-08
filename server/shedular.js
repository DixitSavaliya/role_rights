var express = require('express');
var dates = require('./dates');
var pool = require('./database')();
var cache = require('./cache');
var dir = require('./directories');
var config = require('./config.json');
var Q = require('q');
var schedule = require('node-schedule');
var async = require('async');
var fs = require('fs');
path = require('path');
var FCM = require('fcm-node');


//shedule runner every second
setInterval(function () {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear().toString();
    var hh = date.getHours().toString()
    var ii = date.getMinutes().toString();
    var ss = date.getSeconds().toString();
    var ms = date.getMilliseconds().toString();
    var ampm = hh > 12 ? 'pm' : 'am';
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss + ', ' +ampm;
    /* console.log("shedular dd  ========= " + dd)
    console.log("shedular mm  ========= " + mm)
    console.log("shedular yy  ========= " + yy)
    console.log("shedular hh  ========= " + hh)
    console.log("shedular ii  ========= " + ii)
    console.log("shedular ss  ========= " + ss)
    console.log("shedular ms  ========= " + ms) */
    
    sentSchedulingNotifications();
}, 1000);

var sentSchedulingNotifications = function(){
	var date = new Date();
    var dd = addZero(date.getDate());
    var mm = addZero(date.getMonth() + 1);
    var yy = date.getFullYear().toString();
    var hh = addZero(date.getHours().toString())
    var ii = addZero(date.getMinutes().toString());
    var ss = addZero(date.getSeconds().toString());
    var ms = date.getMilliseconds().toString();
    var ampm = hh > 12 ? 'PM' : 'AM';
    //2020-01-07 12:48:07 PM
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss + ', ' +ampm;
    //2020-01-07 12:48:07
    var sqlTimeStamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    console.log("<========================================== shedular executed ==========================================>")
    console.log("execution time =========>   " + timestamp);
    var sql = ` select 
                    sm.*,
                    ifnull(sm.data->'$.notification.title', NULL) as title,
                    ifnull(sm.data->'$.type', NULL) as type,
                    ifnull(sm.data->'$.time', NULL) as time,
                    ifnull(sm.data->'$.notification.icon', NULL) as icon,
                    ifnull(sm.data->'$.notification.message', NULL) as message,
                    NULL as app_list
                from shedule_master as sm
                where sm.status = 1 and time = '`+sqlTimeStamp+`' and sm.time_type = 1 and run_state = 0
                order by sm.time desc`;
    console.log("sql at \r\n"+ sql+" for time \r\n" + sqlTimeStamp)
    pool.getConnection(function(err1, con1) {
        if(!err1){
            con1.query(sql, function(err, rows) {
                if(!err){
                    con1.release();
                    let results = [];
                    if(rows.length == 0){
                        console.log("shedular run at " + timestamp + " with empty result")
                    } else {
                        for(let i = 0; i < rows.length; i++){
                            if(rows && rows[i] && rows[i].id){
                                rows[i].title = rows[i].title && isJson(rows[i].title) ? JSON.parse(rows[i].title) : rows[i].title;
                                rows[i].icon = rows[i].icon && isJson(rows[i].icon) ? JSON.parse(rows[i].icon) : rows[i].icon;
                                rows[i].type = rows[i].type && isJson(rows[i].type) ? JSON.parse(rows[i].type) : rows[i].type;
                                rows[i].time = rows[i].time && isJson(rows[i].time) ? JSON.parse(rows[i].time) : rows[i].time;
                                rows[i].message = rows[i].message && isJson(rows[i].message) ? JSON.parse(rows[i].message) : rows[i].message;
                                rows[i].data = rows[i].data ? JSON.parse(rows[i].data) : rows[i].data;
                                if(rows[i].data.app_list){
                                    rows[i].app_list = rows[i].data.app_list && isJson(rows[i].data.app_list) ? JSON.parse(rows[i].data.app_list) : rows[i].data.app_list;
                                }
                            }
                            results.push(rows[i]);
                        }
                        console.log("shedular run at " + timestamp + " results and total records are" + results.length)
                        /* console.log(results);
                        console.log("results[0].id")
                        console.log(results[0].id)
                        console.log("results[0].data")
                        console.log(results[0].data)
                        console.log("results[0].app_list")
                        console.log(results[0].app_list) */
                        /* informApps(results[0].data, results[0].app_list, results[0].id).then(function(resInform){
                            console.log("informApps resInform " + JSON.stringify(resInform))
                        }) */
                        async.forEachOf(results, function (val, i, _callback){
                            informApps(results[i].data, results[i].app_list, results[i].id).then(function(resInform){
                                console.log("informApps resInform " + JSON.stringify(resInform))
                                _callback(null);
                            })
                        }, function(error){
                            if(error){
                                console.log("shedular run at " + timestamp + " with empty result error on notification")
                                console.log(error)
                            }else {
                                console.log("total " + results.length + " schedules run successfully!")
                            }
                        });
                    }
                } else{
                    console.log("shedular run at " + timestamp + " with DB ERROR: " + err)
                }
            });
        }else {
            console.log("shedular run at " + timestamp + " with CON ERROR: " + err1)
        }
    });
}

var increaseNotificationTrueCount = function(shedule_id){
    return new Promise(function(resolve){
        if(shedule_id){
            var sql = `update shedule_master set run_state = 1, true_count = (true_count + 1) where id = `+shedule_id+``;
            console.log("increaseNotificationTrueCount sql \r\n "+ sql);
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
            resolve({status: 0, data: "shedule_id is required"})
        }
    })
}

var increaseNotificationFalseCount = function(shedule_id){
    return new Promise(function(resolve){
        if(shedule_id){
            var sql = `update shedule_master set run_state = 1, false_count = (false_count + 1) where id = `+shedule_id+``;
            console.log("increaseNotificationFalseCount sql \r\n "+ sql);
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
            resolve({status: 0, data: "shedule_id is required"})
        }
    })
}


var informApps = function(appData, apps, shedule_id){
    return new Promise(function(resolve){
        let result = [];
        var async = require('async');
        async.forEachOf(apps, function (val, i, _callback){
            let fcmKey = apps[i].serverKey;
            let fcmPUSH;
            if(fcmKey){
                fcmPUSH = new FCM(fcmKey);
            }
            var sql = ` select 
                            dm.*
                        from device_master as dm
                        where dm.app_id = `+val.id+``;
            console.log("informApps get Devices sql \r\n " + sql);
            pool.getConnection(function(err1, con1) {
                if(!err1){
                    con1.query(sql, function(err, rows) {
                        con1.release();
                        if(!err){
                            async.forEachOf(rows, function (value, j, _callback1){
                                let notification = {
                                    "data": {
                                        "title": appData.title,
                                        "body": JSON.stringify(appData.notification),
                                        "data": JSON.stringify(appData.notification),
                                        "message": appData.message,
                                        "sound": "default",
                                        "icon": appData.icon,
                                        "click_action": appData.click_action
                                    },
                                    "to": value.fcm,
                                    "apns": {
                                        "headers": {
                                            'apns-priority': '10'
                                        },
                                        "payload": {
                                            "aps": {
                                                "alert": {
                                                    "title": appData.title,
                                                    "body": appData.message,
                                                },
                                                "badge": 42,
                                            }
                                        }
                                    },
                                    "notification": {
                                        "title": appData.title,
                                        "body": JSON.stringify(appData.notification),
                                        "data": JSON.stringify(appData.notification),
                                        "message": appData.message,
                                        "sound": "default",
                                        "icon": appData.icon,
                                        "click_action": appData.click_action
                                    },
                                };
                                console.log("appData -----------------------------------> \t\t " + JSON.stringify(appData.notification));
                                if(value.fcm && fcmKey && fcmPUSH){
                                    console.log("app : "+val.name+" with package: "+val.package+" has fcm token and serverKey \t \r\n")
                                    fcmPUSH.send(notification, function(error, response){
                                        if (error) {
                                            result.push({"error": error, "app_id": val.id});
                                            console.log('Error sent FCM Push message for fcm_token : \t \r\n' + value.fcm);
                                            //console.log(error)
                                            increaseNotificationFalseCount(shedule_id).then(function(resFalse){
                                                _callback1({'error': error});
                                            });
                                        } else {
                                            //result.push({"response": response});
                                            result.push({"success": response, "app_id": val.id});
                                            console.log('Successfully sent FCM Push message for fcm_token : \t \r\n' + value.fcm);
                                            //console.log(response)
                                            increaseNotificationTrueCount(shedule_id).then(function(resTrue){
                                                _callback1(null);
                                            });
                                        }
                                    });
                                }else {
                                    console.log("App: '"+val.name+"' with package: '"+val.package+"' does not have fcm token or serverKey to recieve the push notifications \t \r\n")
                                    //result.push({"error": "you do not have fcm to recieve the push notifications"});
                                    result.push({"app_id": val.id, "error": "App: '"+val.name+"' with package: '"+val.package+"' does not have fcm token or serverKey to recieve the push notifications"});
                                    increaseNotificationFalseCount(shedule_id).then(function(resFalse){
                                        _callback1(null);
                                    });
                                }
                            }, function(error1){
                                if(error1){
                                    _callback(error1)
                                }else {
                                    _callback(null);
                                }
                            });
                        }else {
                            _callback(err)
                        }
                    });
                }else {
                    _callback(err1)
                }
            });
        }, function(error){
            if(!error){
                resolve({status: 1, data: result})
            }else {
                resolve({status: 0, data: result})
            }
        });
    });
}

function isJson(){
    try {
        JSON.parse(str)
    }catch(e){
        return false;
    }
    return true;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

module.exports = { 
	sentSchedulingNotifications, 
};

