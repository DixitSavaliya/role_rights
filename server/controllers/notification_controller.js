var express = require('express');
var dates = require('../dates');
var pool = require('../database')();
var FCM = require('fcm-node');
var router = express.Router(); 

// Notification
router.post('/sendPushNotification', sendPushNotification);
router.post('/notificationCount', notificationCount);
router.post('/notificationByPage', notificationByPage);
router.post('/deleteNotification', deleteNotification);
router.post('/notificationByDetailsById', notificationByDetailsById);

// sendPushNotification
function sendPushNotification(req, res){
    var application = {
        id: req.body.id ? req.body.id : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        data: req.body.data ? req.body.data : null,
        time: req.body.time ? req.body.time : null,
        type: req.body.type ? req.body.type : null,
        serverKey: req.body.serverKey ? req.body.serverKey : null,
        status: req.body.status,
    };
    let apps = application.data.app_list;
    let newApp = apps.map((x) => {
        if(x.data){
            x.data = null;
        }
        //x.data = x.data.split('"').join("'");
        return x;
    })
    console.log(`newApp \t  ${JSON.stringify(newApp)}`);
    application.data.app_list = newApp;
    if(application.data){
        if(application.type && application.type == 1){
            console.log("if case scheduled send")
            insertShedular(application.data, application.user_id, application.status, application.time, application.serverKey).then(function(resInsert){
                if(resInsert.status == 1){
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Notification Scheduled Successfully!";
                    jsonObject["data"] = resInsert.data;
                    res.send(jsonObject);
                }else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = resInsert.data;
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                }
            })
        }else {
            console.log("else case imediate send")
            insertShedular(application.data, application.user_id, application.status, application.serverKey).then(function(resInsert){
                if(resInsert.status == 1){
                    let notification_data = application.data;
                    let apps = application.data.app_list;
                    let shedule_id = resInsert.data;
                    informApps(notification_data, apps, shedule_id, application.serverKey).then(function(resInform){
                        if(resInform.status == 1){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Notification Sent Successfully!";
                            jsonObject["data"] = resInform.data;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "Notification Sent With Errors!";
                            jsonObject["data"] = resInform.data;
                            res.send(jsonObject);
                        }
                    })
                }else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = resInsert.data;
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                }
            })
            
        }
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "notification data are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Count Application
function notificationCount(req, res) {    
    let user_id = req.body.user_id ? req.body.user_id : null;
    if(user_id){
        var sql = `select count(id) as count from shedule_master where user_id = `+user_id;
        pool.getConnection(function (err1, con1){ 
            if(!err1){
                con1.query(sql,function(err, rows){  
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1" ;
                        jsonObject["message"] = "Count Found Successfully";
                        jsonObject["data"] = rows[0].count;   
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0" ;                
                        jsonObject["message"] = "DB Error: " + err ;                
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
        jsonObject["message"] = "User ID and User Group Are Required";
        jsonObject["data"] = [];          
        res.send(jsonObject);
    }
}

// Pagination Call Application 
function notificationByPage(req,res) {
    var item_per_page = parseInt(req.body.items_per_page);
    var page_no = (parseInt(req.body.page_no) - 1);
    var offset = parseInt(page_no * item_per_page);
    let user_id = req.body.user_id ? req.body.user_id : null;
    if(item_per_page > 0 && user_id) {
        var sql = ` select 
                        sm.*,
                        ifnull(sm.data->'$.notification.title', NULL) as title,
                        ifnull(sm.data->'$.type', NULL) as type,
                        ifnull(sm.data->'$.time', NULL) as time,
                        ifnull(sm.data->'$.notification.icon', NULL) as icon,
                        ifnull(sm.data->'$.notification.message', NULL) as message,
                        NULL as app_list
                    from shedule_master as sm
                    where sm.user_id = `+user_id+`
                    order by sm.time desc 
                    limit ` + offset + ` , ` + item_per_page;
        pool.getConnection(function(err1, con1) {
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if(!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        if(rows.length == 0 ){
                            jsonObject["data"] = [];
                        } else {
                            let results = [];
                            for(let i = 0; i < rows.length; i++){
                                if(rows && rows[i] && rows[i].id){
                                    rows[i].title = rows[i].title && isJson(rows[i].title) ? JSON.parse(rows[i].title) : rows[i].title;
                                    rows[i].icon = rows[i].icon && isJson(rows[i].icon) ? JSON.parse(rows[i].icon) : rows[i].icon;
                                    rows[i].type = rows[i].type && isJson(rows[i].type) ? JSON.parse(rows[i].type) : rows[i].type;
                                    rows[i].time = rows[i].time && isJson(rows[i].time) ? JSON.parse(rows[i].time) : rows[i].time;
                                    rows[i].message = rows[i].message && isJson(rows[i].message) ? JSON.parse(rows[i].message) : rows[i].message;
                                    rows[i].data = rows[i].data && isJson(rows[i].data) ? JSON.parse(rows[i].data) : rows[i].data;
                                    if(rows[i].data.app_list){
                                        rows[i].app_list = rows[i].data.app_list && isJson(rows[i].data.app_list) ? JSON.parse(rows[i].data.app_list) : rows[i].data.app_list;
                                    }
                                }
                                results.push(rows[i]);
                            }
                            jsonObject["data"] = results;
                        }
                        res.send(jsonObject);
                    } else{
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = " DB " + err;
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
        jsonObject["message"] = "PerPage and Page Number is required & must valid integer";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// cancel notifications
function deleteNotification(req, res){
    var notifications = req.body.data != undefined && req.body.data.length ? req.body.data : [];
    var insertArray = []; 
    for (let i = 0; i < notifications.length; i++) {
        if(notifications[i].notificationID != undefined){
            insertArray.push([notifications[i].notificationID]);
        }
    }
    if(insertArray.length > 0){
        var sql = 'delete from shedule_master where id in('+ insertArray +`)`;
        pool.getConnection(function (err1, con1) {
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.affectedRows +" Notifications Removed Successfully";
                        jsonObject["data"] = insertArray;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB: " + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con1.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON: "+err1;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "notificationID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// get Notification Details by Id
function notificationByDetailsById(req,res) {
    var shedule_id = req.body.shedule_id ? req.body.shedule_id : null;
    let user_id = req.body.user_id ? req.body.user_id : null;
    if(shedule_id > 0 && user_id) {
        var sql = ` select 
                        sm.*,
                        ifnull(sm.data->'$.notification.title', NULL) as title,
                        ifnull(sm.data->'$.notification.icon', NULL) as icon,
                        ifnull(sm.data->'$.type', NULL) as type,
                        ifnull(sm.data->'$.time', NULL) as time,
                        ifnull(sm.data->'$.notification.message', NULL) as message,
                        NULL as app_list
                    from shedule_master as sm
                    where sm.user_id = `+user_id+` and sm.id = `+shedule_id+`                     
                    limit 1`;
        pool.getConnection(function(err1, con1) {
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if(!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        if(rows.length == 0 ){
                            jsonObject["data"] = [];
                        } else {
                            if(rows && rows[0] && rows[0].id){
                                rows[0].title = rows[0].title && isJson(rows[0].title) ? JSON.parse(rows[0].title) : rows[0].title;
                                rows[0].icon = rows[0].icon && isJson(rows[0].icon) ? JSON.parse(rows[0].icon) : rows[0].icon;
                                rows[0].type = rows[0].type && isJson(rows[0].type) ? JSON.parse(rows[0].type) : rows[0].type;
                                rows[0].time = rows[0].time && isJson(rows[0].time) ? JSON.parse(rows[0].time) : rows[0].time;
                                rows[0].message = rows[0].message && isJson(rows[0].message) ? JSON.parse(rows[0].message) : rows[0].message;
                                rows[0].data = rows[0].data && isJson(rows[0].data) ? JSON.parse(rows[0].data) : rows[0].data;
                                if(rows[0].data.app_list){
                                    rows[0].app_list = rows[0].data.app_list && isJson(rows[0].data.app_list) ? JSON.parse(rows[0].data.app_list) : rows[0].data.app_list;
                                }
                            }
                            jsonObject["data"] = rows;
                        }
                        res.send(jsonObject);
                    } else{
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = " DB " + err;
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
        jsonObject["message"] = "PerPage and Page Number is required & must valid integer";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

var informApps = function(appData, apps, shedule_id){
    return new Promise(function(resolve){
        var async = require('async');
        let result = [];
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

var insertShedular = function(data, user_id, status, time){
    return new Promise(function(resolve){
        if(data && status){
            data = JSON.stringify(data);
            if(isJson(data)){
                console.log("data is valid JSON ")
            }else {
                console.log("data is invalid JSON ")
            }
            time = time != undefined && time ? time : dates._generateDateFormat('','yyyy-mm-dd hh:ii:ss');
            var sql = `insert into shedule_master(data, user_id, time, status) values('`+data+`', `+user_id+`, '`+time+`', `+status+`);`;
            console.log("insertShedular sql \r\n "+ sql);
            pool.getConnection(function (err2, con3){
                if(!err2){
                    con3.query(sql, function(err, rows1){
                        con3.release();
                        if (!err) {
                            resolve({status: 1, data: rows1.insertId});
                        } else {
                            resolve({status: 0, data: "DB :" + err});
                        }
                    });
                }else {
                    resolve({status: 0, data: "CON: " + err2});
                }
            });
        }else {
            resolve({status: 0, data: "schedule data and status are required"})
        }
    })
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

var increaseAppCount = function(data){
    return new Promise(function(resolve){
        if(data && data.app_id && data.custom_ads_app_list){
            if(data.custom_ads_app_list.length > 0){
                increaseAdvertiserAppCount(data.app_id, data.custom_ads_app_list).then(function(resPI){
                    if(resPI.status == 1){
                        resolve({status: 1, data: resPI.data});
                    }else {
                        resolve({status: 0, data: resPI.data});
                    }
                })
            }else {
                increasePublisherAppCount(data.app_id).then(function(resPI){
                    if(resPI.status == 1){
                        resolve({status: 1, data: resPI.data});
                    }else {
                        resolve({status: 0, data: resPI.data});
                    }
                })
            }
        }else {
            resolve({status: 0, data: 'app_id and request_apps are required'});
        }
    })
}

function isJson(str){
    try {
        JSON.parse(str);
    }catch(e){
        return false;
    }
    return true;
}

module.exports = router;