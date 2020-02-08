var express = require('express');
var fs = require('fs');
var cache = require('../cache');
var dates = require('../dates');
var json2xls = require('json2xls');
var pool = require('../database')();
var dir = require('../directories');
var config = require('../config.json');
var router = express.Router(); 

// Application
router.post('/insertApplication', insertApplication);
router.post('/updateApplication', updateApplication);
router.post('/deleteApplication',deleteApplication);
router.post('/getApplication',getApplication);
router.post('/getViewApplicationDetailsById',getViewApplicationDetailsById);
router.post('/importApplication',importApplication);
router.post('/exportApplication',exportApplication);
router.post('/countApplication',countApplication);
router.post('/applicationByPg', applicationByPg);
router.post('/applicationBySearch',applicationBySearch);
router.post('/uploadApplicationIcon', uploadApplicationIcon);
router.post('/removeApplicationIcon', removeApplicationIcon);
router.post('/insertAppMonetisation', insertAppMonetisation);
router.post('/updateAppMonetisation', updateAppMonetisation);
router.post('/removeAppMonetisation', removeAppMonetisation);
router.post('/inactiveAppMonetisation', inactiveAppMonetisation);
router.post('/activeAppMonetisation', activeAppMonetisation);
router.post('/getAppMonetisation', getAppMonetisation);
router.post('/insertCustomAds', insertCustomAds);
router.post('/getCustomAds', getCustomAds);
router.post('/removeCustomAds', removeCustomAds);
router.post('/getAdsSettings', getAdsSettings);
router.post('/getAdvertiserAppHitCount', getAdvertiserAppHitCount);
router.post('/getPublisherAppHitCount', getPublisherAppHitCount);

// registerApplication
function insertApplication(req, res){
    /*  INSERT INTO `application_master`(
            id,
            name,
            description,
            package,
            fcm,
            icon,
            type,
            is_live,
            owner,
            user_id,
            status,
            link,
            banner,
            data: {any json format data(not fixed) text input},
            web_view,
            privacy,
            other = {
                is_features: true/false
                more_apps: (text input value)
                version_code: text input value
                exit_status: true/false
            }
        )
    */
    var application = {
        id: req.body.id ? req.body.id : null,
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        package: req.body.package ? req.body.package : null,
        icon: req.body.icon ? req.body.icon : null,
        type: req.body.type ? req.body.type : 1,
        is_live: req.body.is_live ? req.body.is_live : 0,
        owner: req.body.user_group ? req.body.user_group : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        link: req.body.link ? req.body.link : null,
        banner: req.body.banner ? req.body.banner : null,
        data: req.body.data ? req.body.data : "",
        web_view: req.body.web_view ? req.body.web_view : null,
        privacy: req.body.privacy ? req.body.privacy : null,
        other: req.body.other ? JSON.stringify(req.body.other) : null,
        status: req.body.status,
    };
    let dataObj = application.data;
    dataObj = dates.encode(dataObj);
    /* let desc = application.description;
    const regex = /"/gi ;
    desc = desc.split('"').join("'"); */
    let desc = application.description;
    console.log("desc -------------_> \t" + desc)
    const regex = /"/gi;
    desc = desc.replace(regex, "'");
    if(application.name && application.user_id && application.owner){
        checkDuplicateApplication([`'`+application.package+`'`], application.user_id).then(function(resDuplicate){
            console.log("desc \t\t"+  desc)
            if(resDuplicate.status == 1){
                var sql = `insert into application_master(
                    name,
                    description,
                    package,
                    icon,
                    type,
                    owner,
                    user_id,
                    link,
                    banner,
                    data,
                    web_view,
                    privacy,
                    other,
                    status
                ) values(
                    '`+application.name+`',
                    "`+desc+`",
                    '`+application.package+`',
                    `+(application.icon ? `'`+application.icon+`'`: `NULL`)+`,
                    `+application.type+`,
                    '`+application.owner+`',
                    `+application.user_id+`,
                    `+(application.link ? `'`+application.link+`'`: `NULL`)+`,
                    `+(application.banner ? `'`+application.banner+`'`: `NULL`)+`,
                    `+(dataObj ? `'`+ JSON.stringify(dataObj)+`'`: `NULL`)+`,
                    `+application.web_view+`,
                    `+(application.privacy ? `'`+application.privacy+`'`: `NULL`)+`,
                    `+(application.other ? `'`+application.other+`'`: `NULL`)+`,
                    `+application.status+`
                )`;
                console.log("insertApplication sql \r\n "+ sql);
                pool.getConnection(function (err2, con3){
                    if(!err2){
                        con3.query(sql, function(err, rows1){
                            if (!err) {
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = "Application Inserted Successfully";
                                jsonObject["data"] = rows1.insertId;
                                res.send(jsonObject);
                            } else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "DB :" + err;
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
            } else {
                
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "Duplicate Application Name Found, please choose another one!";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        })
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "application name, owner group and owner_id are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Update Application By Id
function updateApplication(req, res){
    var application = {
        id: req.body.id ? req.body.id : null,
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        package: req.body.package ? req.body.package : null,
        icon: req.body.icon ? req.body.icon : null,
        type: req.body.type ? req.body.type : 1,
        is_live: req.body.is_live ? req.body.is_live : 0,
        owner: req.body.user_group ? req.body.user_group : null,
        user_id: req.body.user_id ? req.body.user_id : null,
        link: req.body.link ? req.body.link : null,
        banner: req.body.banner ? req.body.banner : null,
        data: req.body.data ? req.body.data : "",
        web_view: req.body.web_view ? req.body.web_view : null,
        privacy: req.body.privacy ? req.body.privacy : null,
        other: req.body.other ? JSON.stringify(req.body.other) : null,
        status: req.body.status,
    };
    let dataObj = application.data;
    dataObj = dates.encode(dataObj);
    let desc = application.description;
    console.log("desc -------------_> \t" + desc)
    const regex = /"/gi;
    desc = desc.replace(regex, "'");
    //desc = desc.split('"').join("'");
    if(application.id){
        console.log("desc \t\t"+  desc)
        var sql1 = `update application_master set 
                        name = '`+ application.name +`',
                        description = "`+ desc +`",
                        package = '`+ application.package +`',
                        icon = `+(application.icon ? `'`+application.icon+`'`: `NULL`)+`,
                        type = `+ application.type +`,
                        is_live = `+ application.is_live +`,
                        link = `+(application.link ? `'`+application.link+`'`: `NULL`)+`,
                        banner = `+(application.banner ? `'`+application.banner+`'`: `NULL`)+`,
                        data = `+(dataObj ? `'`+ JSON.stringify(dataObj)+`'`: `NULL`)+`,
                        web_view = `+application.web_view+`,
                        privacy = `+(application.privacy ? `'`+application.privacy+`'`: `NULL`)+`,
                        other = `+(application.other ? `'`+application.other+`'`: `NULL`)+`,
                        status = `+application.status+`
                    where id =`+application.id;
        console.log("updateApplication sql \r\r\n\n" + sql1)
        pool.getConnection(function (err2, con2) {
            if(!err2){
                con2.query(sql1, function(err, rows1) {
                    if (!err){
                        if(rows1.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Application Updated Successfully";
                            jsonObject["data"] = application;
                            res.send(jsonObject);
                        }
                        else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such Application found in database";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    }else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject); 
                    }
                    con2.release();
                });
            }else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON: " + err2;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else{
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "application_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Delete Application By Id
function deleteApplication(req, res){
    var application = req.body.data != undefined && req.body.data.length ? req.body.data : [];
    var user_id = req.body.user_id ? req.body.user_id : null;
    var status = req.body.status != undefined ? req.body.status : null;
    var insertArray = [];
    for (let i = 0; i < application.length; i++) {
        if(application[i].applicationID != undefined){
            insertArray.push([application[i].applicationID]);
        }
    }
    if(insertArray.length > 0 && user_id){
        var sql = `update application_master set status = `+status+` where id in(?) and user_id = `+user_id+``;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,[insertArray], function(err, rows) {
                    if (!err){
                        if(rows.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Application "+(status ? 'Activated':'Inactivated')+" Successfully";
                            jsonObject["data"] = application;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such Application found in database";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }
                    }else {
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
        jsonObject["message"] = "user_id and application_id are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//  Get Application 
function getApplication(req, res){
    var application_id = req.body.application_id ? req.body.application_id : null;
    var user_id = req.body.user_id ? req.body.user_id : null;
    var owner = req.body.user_group ? req.body.user_group : null;
    if(application_id && user_id && owner){
        var sql = ` select 
                        c.*
                    from application_master as c 
                    where 
                        c.id= ` + application_id + ` and
                        c.user_id= ` + user_id + ` and
                        c.owner= '` + owner + `'
                    limit 1`;
        console.log("getApplication sql ===> " + sql);
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        /* banner,
                        data,
                        web_view,
                        privacy,
                        other : {
                            is_features: true/false
                            more_apps: (text input value)
                            version_code: text input value
                            exit_status: true/false
                        }, */
                        if(rows && rows[0] && rows[0].id){
                            rows[0].description = rows[0].description && isJson(rows[0].description) ? JSON.parse(rows[0].description) : rows[0].description;
                            rows[0].data = rows[0].data && isJson(rows[0].data) ? JSON.parse(rows[0].data) : rows[0].data;
                            rows[0].data = rows[0].data ? dates.decode(rows[0].data) : null;
                            let other = rows[0].other && isJson(rows[0].other) ? JSON.parse(rows[0].other) : rows[0].other;
                            delete rows[0].other;
                            if(rows[0].owner == 'advertiser'){
                                if(other && other.is_features){
                                    rows[0]['is_features'] = other.is_features;
                                }else {
                                    rows[0]['is_features'] = false;
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.more_apps){
                                    rows[0]['more_apps'] = other.more_apps;
                                }else {
                                    rows[0]['more_apps'] = "";
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.version_code){
                                    rows[0]['version_code'] = other.version_code;
                                }else {
                                    rows[0]['version_code'] = "";   
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.exit_status){
                                    rows[0]['exit_status'] = other.exit_status;
                                }else {
                                    rows[0]['exit_status'] = false;
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.serverKey){
                                    rows[0]['serverKey'] = other.serverKey;
                                }else {
                                    rows[0]['serverKey'] = "";
                                }
                            }
                        }
                        jsonObject["data"] = rows[0];
                        res.send(jsonObject);
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
        jsonObject["message"] = "type and type_id are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//  Get Application 
function getViewApplicationDetailsById(req, res){
    var application_id = req.body.application_id ? req.body.application_id : null;
    var user_id = req.body.user_id ? req.body.user_id : null;
    var owner = req.body.user_group ? req.body.user_group : null;
    if(application_id){
        var sql = ` select 
                        c.*
                    from application_master as c 
                    where 
                        c.id= ` + application_id + `
                    limit 1`;
        console.log("getApplication sql ===> " + sql);
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        if(rows && rows[0] && rows[0].id){
                            rows[0].description = rows[0].description && isJson(rows[0].description) ? JSON.parse(rows[0].description) : rows[0].description;
                            rows[0].data = rows[0].data && isJson(rows[0].data) ? JSON.parse(rows[0].data) : rows[0].data;
                            rows[0].data = rows[0].data ? dates.decode(rows[0].data) : null;
                            let other = rows[0].other && isJson(rows[0].other) ? JSON.parse(rows[0].other) : rows[0].other;
                            delete rows[0].other;
                            if(rows[0].owner == 'advertiser'){
                                if(other && other.is_features){
                                    rows[0]['is_features'] = other.is_features;
                                }else {
                                    rows[0]['is_features'] = false;
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.more_apps){
                                    rows[0]['more_apps'] = other.more_apps;
                                }else {
                                    rows[0]['more_apps'] = "";
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.version_code){
                                    rows[0]['version_code'] = other.version_code;
                                }else {
                                    rows[0]['version_code'] = "";   
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.exit_status){
                                    rows[0]['exit_status'] = other.exit_status;
                                }else {
                                    rows[0]['exit_status'] = false;
                                }
                            }
                            if(rows[0].owner == 'publisher'){
                                if(other && other.serverKey){
                                    rows[0]['serverKey'] = other.serverKey;
                                }else {
                                    rows[0]['serverKey'] = "";
                                }
                            }
                        }
                        jsonObject["data"] = rows[0];
                        res.send(jsonObject);
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
        jsonObject["message"] = "type and type_id are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Import Application
function importApplication(req, res) {
    var application = req.body.data;
    var data = [];
    var filteredData = [];
    for(let i = 0; i < application.length; i++){
        filteredData.push([(`'`+application[i]['Package Name']+`'`)]);
        let type = 0;
        if(application[i]['Application Type'] == 'Android'){
            type = 1;
        }else if(application[i]['Application Type'] == 'IOS'){
            type = 2;
        }else {
            type = 3;
        }
        data.push([
            application[i]['Name'],
            application[i]['Description'],
            application[i]['Package Name'],
            (application[i]['Is Live'] == 'True' ? 1 : 0 ),
            type,
            (application[i]['Status'] == 'Active' ? 1 : 0 )
        ]);
    }
    if(data.length > 0){
        checkDuplicateApplication(filteredData).then(function(resDuplicate){
            if(resDuplicate.status === 1){
                pool.getConnection(function (err1, con1){
                if(!err1){
                    var sql = 'insert into application_master (name, description, package, type, status) values ?';
                    con1.query(sql, [data], function(err, rows) {
                        if(!err){
                            if (rows.affectedRows > 0) {
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = rows.affectedRows + " Records Imported Successfully";
                                jsonObject["data"] = data;
                                res.send(jsonObject);
                            } else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "Something went wrong please try again later!...";
                                jsonObject["data"] = [];
                                res.send(jsonObject);
                            }
                        }else {
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
                jsonObject["message"] = "duplicate application name found kindly check all the application name before import";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else{
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Data is required to import";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Export Application
function exportApplication(req, res){
    var user_group = req.body.user_group ? req.body.user_group : null;
    if(user_group){
        var sql = ` select 
                        name,
                        description,
                        package,
                        type,
                        if(status > 0, "Active", "Inactive") as status
                    from application_master`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows){
                    if (!err){
                        if (rows.length > 0){
                            let arrayOfData = [];
                            arrayOfData.push(['Name', 'Description', 'Package Name', 'Application Type', 'Status']);
                            for(let j = 0; j < rows.length; j++){
                                let type = '';
                                if(rows[i]['type'] == 1){
                                    type = 'Android';
                                }else if(rows[i]['type'] == 2){
                                    type = 'IOS';
                                }else {
                                    type = 'Both';
                                }
                                arrayOfData.push([rows[j].name, rows[j].description, rows[j].package, type, rows[j].status]);
                            }
                            var myData = json2xls(arrayOfData);
                            var fileExtension = '.xlsx';
                            var currentDate = dates._generateDateFormat('', 'yyyy_mm_dd_hh_ii_ss');
                            var filename = 'application_' + currentDate + fileExtension;
                            var path = dir.fileDir + "/Application/" + filename;
                            fs.writeFile(path, myData, 'binary', function(ress){
                                console.log(ress);
                            });
                            var jsonObject = {};
                            jsonObject['status'] = "1";
                            jsonObject['message'] = (arrayOfData.length -1) + " Applications Exported Successfully";
                            jsonObject["data"] = filename;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No Records founds to export";
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
        jsonObject["message"] = "user_group is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Count Application
function countApplication(req, res) {
    let group = req.body.user_group ? req.body.user_group : null;
    let user_id = req.body.user_id ? req.body.user_id : null;
    let ownership = req.body.ownership ? req.body.ownership : null;
    if(group && user_id){
        var where = '';
        if(group == 'publisher'){
            if(ownership == 1){
                where = `where (user_id = `+user_id+` and owner='`+group+`')`;
            }else if(ownership == 2){
                where = `where user_id != `+user_id+` and owner ='advertiser'`;
            }else {
                where = `where (user_id = `+user_id+` and owner='`+group+`') or owner='advertiser'`;
            }
        } else if(group == 'admin'){
            where = `where owner='publisher' or owner='advertiser'`;
            if(ownership == 1){
                where = `where owner = 'publisher'`;
            }
            if(ownership == 2){
                where = `where owner = 'advertiser'`;
            }
        } else {
            where = `where user_id = `+user_id+` and owner='`+group+`'`;
        }
        var sql = `select count(id) as count from application_master `+where;
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
function applicationByPg(req,res) {
    var item_per_page = parseInt(req.body.items_per_page);
    var page_no = (parseInt(req.body.page_no) - 1);
    var offset = parseInt(page_no * item_per_page);
    let group = req.body.user_group ? req.body.user_group : null;
    let ownership = req.body.ownership ? req.body.ownership : null;
    let user_id = req.body.user_id ? req.body.user_id : null;
    let where = '';
    if(group == 'publisher'){
        if(ownership == 1){
            where = `where (am.user_id = `+user_id+` and am.owner='`+group+`')`;
        }else if(ownership == 2){
            where = `where am.user_id != `+user_id+` and am.owner ='advertiser'`;
        }else {
            where = `where (am.user_id = `+user_id+` and am.owner='`+group+`') or am.owner='advertiser'`;
        }
    }else if(group == 'admin'){
        where = `where am.owner='publisher' or am.owner='advertiser'`;
        if(ownership == 1){
            where = `where am.owner = 'publisher'`;
        }
        if(ownership == 2){
            where = `where am.owner = 'advertiser'`;
        }
    }else {
        where = `where am.user_id = `+user_id+` and am.owner='`+group+`'`;
    }
    if(item_per_page > 0 && where) {
        var sql = ` select 
                        am.*,
                        (
                            select concat_ws(' ',first_name, last_name) as owner_name from user_master where id = am.user_id limit 1
                        ) as owner_name,
                        (
                            select id from application_ads_mapping where app_id = am.id limit 1
                        ) as ad_id,
                        ifnull((
                            select status from application_ads_mapping where app_id = am.id limit 1
                        ), 0) as ad_status,
                        (
                            select data->"$.FB_ADS" from application_ads_mapping where app_id = am.id limit 1
                        ) as fb_ads_status,
                        (
                            select data->"$.MO_ADS" from application_ads_mapping where app_id = am.id limit 1
                        ) as mopub_ads_status,
                        (
                            select data->"$.GAN_ADS" from application_ads_mapping where app_id = am.id limit 1
                        ) as admob_ads_status
                    from application_master as am
                    `+where+`
                    order by am.name 
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
                            let result = [];
                            for(let i = 0; i < rows.length; i++){
                                if(rows && rows[i] && rows[i].id){
                                    rows[i].description = rows[i].description && isJson(rows[i].description) ? JSON.parse(rows[i].description) : rows[i].description;
                                    rows[i].data = rows[i].data && isJson(rows[i].data) ? JSON.parse(rows[i].data) : rows[i].data;
                                    rows[i].data = rows[i].data ? dates.decode(rows[i].data) : null;
                                    let other = rows[i].other && isJson(rows[i].other) ? JSON.parse(rows[i].other) : rows[i].other;
                                    delete rows[i].other;
                                    if(rows[i].owner == 'advertiser'){
                                        if(other && other.is_features != undefined){
                                            rows[i]['is_features'] = other.is_features;
                                        }else {
                                            rows[i]['is_features'] = false;
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.more_apps){
                                            rows[i]['more_apps'] = other.more_apps;
                                        }else {
                                            rows[i]['more_apps'] = "";
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.version_code){
                                            rows[i]['version_code'] = other.version_code;
                                        }else {
                                            rows[i]['version_code'] = "";
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.exit_status != undefined){
                                            rows[i]['exit_status'] = other.exit_status;
                                        }else {
                                            rows[i]['exit_status'] = false;
                                        }
                                        
                                    }
                                }
                                result.push(rows[i])
                            }
                            jsonObject["data"] = result;
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

// Search Application 
function applicationBySearch(req,res) {
    var search_string = req.body.search_string;
    let group = req.body.user_group ? req.body.user_group : null;
    let user_id = req.body.user_id ? req.body.user_id : null;
    let ownership = req.body.ownership ? req.body.ownership : null;
    let where1 = '';
    if(group == 'publisher'){
        if(ownership == 1){
            where1 = `and (am.user_id = `+user_id+` and am.owner='`+group+`')`;
        }else if(ownership == 2){
            where1 = `and am.user_id != `+user_id+` and am.owner ='advertiser'`;
        }else {
            where1 = `and (am.user_id = `+user_id+` and am.owner='`+group+`') or am.owner='advertiser'`;
        }
    } else if(group == 'admin'){
        where1 = `and am.owner='publisher' or am.owner='advertiser'`;
        if(ownership == 1){
            where1 = `and am.owner = 'publisher'`;
        }
        if(ownership == 2){
            where1 = `and am.owner = 'advertiser'`;
        }
    } else {
        where1 = `and am.user_id = `+user_id+` and am.owner='`+group+`'`;
    }
    var where = '';
    if(search_string.length > 0 ){
        where += ` and (am.name like '%`+search_string+`%' or am.package like '%`+search_string+`%')`;
    }
    if(where1){
        var sql = ` select 
                        am.*,
                        (
                            select concat_ws(' ',first_name, last_name) as owner_name from user_master where id = am.user_id limit 1
                        ) as owner_name,
                        (
                            select id from application_ads_mapping where app_id = am.id limit 1
                        ) as ad_id,
                        ifnull((
                            select status from application_ads_mapping where app_id = am.id limit 1
                        ), 0) as ad_status,
                        (
                            select data->"$.fb_ads" from application_ads_mapping where app_id = am.id limit 1
                        ) as fb_ads_status,
                        (
                            select data->"$.mopub_ads" from application_ads_mapping where app_id = am.id limit 1
                        ) as mopub_ads_status,
                        (
                            select data->"$.admob_ads" from application_ads_mapping where app_id = am.id limit 1
                        ) as admob_ads_status
                    from application_master as am
                    where am.status = 1 `+ where +` `+ where1 +` 
                    order by name 
                    limit 100`;
        pool.getConnection(function(err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows){
                    if(!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records Found";
                        if(rows.length === 0 ){
                            jsonObject["data"] = [];
                        } else {
                            let result = [];
                            for(let i = 0; i < rows.length; i++){
                                if(rows && rows[i] && rows[i].id){
                                    rows[i].description = rows[i].description && isJson(rows[i].description) ? JSON.parse(rows[i].description) : rows[i].description;
                                    rows[i].data = rows[i].data && isJson(rows[i].data) ? JSON.parse(rows[i].data) : rows[i].data;
                                    rows[i].data = rows[i].data ? dates.decode(rows[i].data) : null;
                                    rows[i].data = isJson(rows[i].data) ? JSON.parse(rows[i].data): rows[i].data;
                                    let other = rows[i].other && isJson(rows[i].other) ? JSON.parse(rows[i].other) : rows[i].other;
                                    delete rows[i].other;
                                    if(rows[i].owner == 'advertiser'){
                                        if(other && other.is_features != undefined){
                                            rows[i]['is_features'] = other.is_features;
                                        }else {
                                            rows[i]['is_features'] = false;
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.more_apps){
                                            rows[i]['more_apps'] = other.more_apps;
                                        }else {
                                            rows[i]['more_apps'] = "";
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.version_code){
                                            rows[i]['version_code'] = other.version_code;
                                        }else {
                                            rows[i]['version_code'] = "";
                                        }
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.exit_status != undefined){
                                            rows[i]['exit_status'] = other.exit_status;
                                        }else {
                                            rows[i]['exit_status'] = false;
                                        }
                                        
                                    }
                                    if(rows[i].owner == 'publisher'){
                                        if(other && other.serverKey){
                                            rows[i]['serverKey'] = other.serverKey;
                                        }else {
                                            rows[i]['serverKey'] = "";
                                        }
                                    }
                                }
                                result.push(rows[i])
                            }
                            jsonObject["data"] = result;
                        }
                        res.send(jsonObject);
                    } else{
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = " DB :" + err;
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
        jsonObject["message"] = "User Id and User Group Are Required!";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Upload Application File
function uploadApplicationIcon(req,res) {
    var file = req.files;
    if(!file){
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "File was not found";
        jsonObject["data"] = [];
        res.send(jsonObject);
    } else {
        if( file.file_name.mimetype == 'image/png' || 
            file.file_name.mimetype == 'image/jpg' || 
            file.file_name.mimetype == 'image/jpeg' || 
            file.file_name.mimetype == 'image/webp' || 
            file.file_name.mimetype == 'image/bmp'
        ){
            var splt_str = file.file_name.name.split(".");
            var last = (splt_str.length - 1);
            var ext_file_name = '';
            if(splt_str[last] != undefined && splt_str[last] != 'undefined'){
                ext_file_name = splt_str[last];
            }else {
                ext_file_name = splt_str[1];
            }
            var save_file_name = dates.generate_img_name(6) + '.' + ext_file_name;                
            var path = "./Images/Application/" + save_file_name;
            file.file_name.mv(path, function(err) {
                if (err){
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "File not saved";
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                } else {
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "File Uploaded Successfully!";
                    jsonObject["data"] = "Application/" + save_file_name;
                    res.send(jsonObject);
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

// Remove Application File
function removeApplicationIcon(req,res) {
    var localPath = dir.imgDir;
    var file_path = req.body.file_path ? req.body.file_path : null;
    console.log("file_path =================> " + file_path)
    if(file_path){
        localPath += '/' + file_path;
        try {
            status = fs.existsSync(localPath, function(resss){
                console.log('fs.existsSync' , resss)
            });
            fs.unlink(localPath, function(ress){
                console.log(ress);
            });
            var jsonObject = {};
            jsonObject["status"] = "1";
            jsonObject["message"] = "File Removed Successfully!..";
            jsonObject["data"] = file_path;
            res.send(jsonObject);
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
        jsonObject["message"] = "Given File Not Found!";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}





// Mapp Application Ads
function insertAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])

    /*  
        //new
        FACEBOOK 
        -> FB_ADS : Switch	
        -> FB_id: 
        -> FB_interstitial_ads
        -> FB_banner_ads
        -> FB_native_banner
        -> FB_native_ads
        -> FB_rewareded_ads

        GOOGLE ::
        -> GAN_ADS : Switch
        -> GAN_id
        -> GAN_interstitial_ads
        -> GAN_banner_ads
        -> GAN_native_banner
        -> GAN_native_ads
        -> GAN_rewareded_ads 

        MOPUB ::
        -> MO_ADS : Switch
        -> MO_id
        -> MO_interstitial_ads
        -> MO_banner_ads
        -> MO_native_banner
        -> MO_native_ads
        -> MO_rewareded_ads 


        //old
        "fb_ads": "true",
        "fb_interstitial": "YOUR_PLAMENT_ID",
        "fb_banner": "PLACE_ID",
        "fb_native_banner": "PLACE_ID",
        "fb_native": "PLACE_ID",
        "mopub_ads": "true",
        "mopub_interstitial": "YOUR_PLAMENT_ID",
        "mopub_banner": "PLACE_ID",
        "mopub_reward_video": "PLACE_ID",
        "mopub_video": "PLACE_ID",
        "mopub_native_banner": "PLACE_ID",
        "mopub_native": "PLACE_ID",
        "admob_ads":"true",
        "admob_appid":"ca-app-pub-3940256099942544~3347511713",
        "admob_interstitial":"ca-app-pub-3940256099942544/1033173712",
        "admob_rewarded":"ca-app-pub-3940256099942544/5224354917",
        "admob_banner":"ca-app-pub-3940256099942544/6300978111",
        "admob_native_banner":"ca-app-pub-3940256099942544/2247696110",
    */
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        data: req.body.data ? req.body.data : null,
        status: req.body.status,
    };
    app.data = JSON.stringify(app.data);
    if(app.app_id){
        checkAppMonetisation(app.app_id).then(function(resDuplicate){
            if(resDuplicate.status == 1){
                var sql = `insert into application_ads_mapping(app_id, data, status) values(
                    `+app.app_id+`,
                    '`+app.data+`',
                    `+app.status+`
                )`;
                console.log("insertAppMonetisation sql \r\n "+ sql);
                pool.getConnection(function (err2, con3){
                    if(!err2){
                        con3.query(sql, function(err, rows1){
                            if (!err) {
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = "Monetisation Setup Successfully";
                                jsonObject["data"] = rows1.insertId;
                                res.send(jsonObject);
                            } else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "DB :" + err;
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
            } else {
                
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "Duplicate Entry Found, Please Choose Another Ad Network or Application!";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        })
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Application ID and Ad ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Mapp Application Ads
function updateAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])

    /*  
        //new
        FACEBOOK 
        -> FB_ADS : Switch	
        -> FB_id: 
        -> FB_interstitial_ads
        -> FB_banner_ads
        -> FB_native_banner
        -> FB_native_ads
        -> FB_rewareded_ads

        GOOGLE ::
        -> GAN_ADS : Switch
        -> GAN_id
        -> GAN_interstitial_ads
        -> GAN_banner_ads
        -> GAN_native_banner
        -> GAN_native_ads
        -> GAN_rewareded_ads 

        MOPUB ::
        -> MO_ADS : Switch
        -> MO_id
        -> MO_interstitial_ads
        -> MO_banner_ads
        -> MO_native_banner
        -> MO_native_ads
        -> MO_rewareded_ads 

        //old
        "fb_ads": "true",
        "fb_interstitial": "YOUR_PLAMENT_ID",
        "fb_banner": "PLACE_ID",
        "fb_native_banner": "PLACE_ID",
        "fb_native": "PLACE_ID",
        "mopub_ads": "true",
        "mopub_interstitial": "YOUR_PLAMENT_ID",
        "mopub_banner": "PLACE_ID",
        "mopub_reward_video": "PLACE_ID",
        "mopub_video": "PLACE_ID",
        "mopub_native_banner": "PLACE_ID",
        "mopub_native": "PLACE_ID",
        "admob_ads":"true",
        "admob_appid":"ca-app-pub-3940256099942544~3347511713",
        "admob_interstitial":"ca-app-pub-3940256099942544/1033173712",
        "admob_rewarded":"ca-app-pub-3940256099942544/5224354917",
        "admob_banner":"ca-app-pub-3940256099942544/6300978111",
        "admob_native_banner":"ca-app-pub-3940256099942544/2247696110",
    */
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        data: req.body.data ? req.body.data : null,
        status: req.body.status,
    };
    app.data = JSON.stringify(app.data);
    if(app.id){
        var sql = ` update application_ads_mapping
                    set 
                        status = `+app.status+`,
                        data = '`+app.data+`'
                    where id = `+app.id+``;
        console.log("updateAppMonetisation sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Monetisation Updated Successfully";
                        jsonObject["data"] = app;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Monetisation ID Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Remove Application Ads
function removeAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        data: req.body.data ? req.body.data : null,
        status: req.body.status,
    };
    if(app.id){
        var sql = `delete from application_ads_mapping where id = `+app.id;
        console.log("removeAppMonetisation sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Application Inserted Successfully";
                        jsonObject["data"] = rows1.insertId;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Application ID and Ad ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Inactive Application Ads
function inactiveAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        data: req.body.data ? req.body.data : null,
        status: req.body.status,
    };
    if(app.id){
        var sql = `update application_ads_mapping set status = 0 where id = `+app.id;
        console.log("inactiveAppMonetisation sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Advertisement Inactivated Successfully!";
                        jsonObject["data"] = rows1.insertId;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Application ID and Ad ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Active Application Ads
function activeAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        data: req.body.data ? req.body.data : null,
        status: req.body.status,
    };
    if(app.id){
        var sql = `update application_ads_mapping set status = 1 where id = `+app.id;
        console.log("activeAppMonetisation sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Advertisement Inactivated Successfully!";
                        jsonObject["data"] = rows1.insertId;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Application ID and Ad ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Application Ads
function getAppMonetisation(req,res) {
    //INSERT INTO application_ads_mapping(id, app_id, ads_id, data, status) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])
    var app = {
        id: req.body.id ? req.body.id : null,
        app_id: req.body.app_id ? req.body.app_id : null,
        ad_id: req.body.ad_id ? req.body.ad_id : null,
    };
    if(app.app_id || app.ad_id || app.id){
        let where = '';
        let limit = '';
        if(app.id){
            where = `where aasm.id = `+ app.id
            limit = ` limit 1`;
        }
        if(app.app_id){
            where = `where aasm.app_id = `+ app.app_id
            limit = ` limit 1`;
        }
        /* if(app.ad_id){
            where = `where aasm.ad_id = `+ app.ad_id
            limit = ` `;
        } */
        var sql = ` select 
                        aasm.*,
                        am.name as app_name,
                        am.name as app_icon,
                        am.name as app_package,
                        am.name as app_description,
                        am.name as app_type,
                        am.name as app_is_live,
                        am.name as app_status
                    from application_ads_mapping as aasm
                    left join application_master as am on am.id = aasm.app_id
                    `+where+`
                    group by aasm.id
                    order by am.name
                    `+ limit +``;
        console.log("getAppMonetisation sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "App Monetisations Found Successfully";
                        if(rows1 && rows1[0]){
                            if(isJson(rows1[0].data)){
                                rows1[0].data = JSON.parse(rows1[0].data);
                            }else {
                                rows1[0].data = rows1[0].data;
                            }
                            jsonObject["data"] = rows1[0];
                        }else {
                            jsonObject["message"] = "No Monetisations Found For This Application!";
                            jsonObject["data"] = [];
                        }
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
                        jsonObject["data"] = [];
                        res.send(jsonObject);
                    }
                    con3.release();
                });
            } else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "CON: " + err2;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "Application ID and Ad ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}


// Mapp Application Ads
function insertCustomAds(req,res) {
    //INSERT INTO `custom_ads_mapping`(`id`, `publisher_app_id`, `advertise_app_id`, `status`) VALUES ([value-1],[value-2],[value-3],[value-4])

    /*
        "app_id": "1",
        "app_list": [
            {
                id: 1,
                package: "com.android.web.app.list.player"
            }
        ],
        "status": "0",
    */
    var app_id = req.body.app_id ? req.body.app_id : null;
    var app_package = req.body.app_package ? req.body.app_package : null;
    var app_list = req.body.app_list ? req.body.app_list : null;
    let data = [];
    for(let i = 0; i < app_list.length; i++){
        data.push([
            app_id,
            app_package,
            app_list[i]['id'],
            app_list[i]['package'],
            1
        ]);
    }
    if(data.length > 0){
        deleteCustomAds(app_id).then(function(resDelete){
            if(resDelete.status == 1){
                var sql = `insert into custom_ads_mapping(publisher_app_id, publisher_app_package, advertiser_app_id, advertiser_app_package, status) values ?`;
                console.log("insertCustomAds sql \r\n "+ sql);
                pool.getConnection(function (err2, con3){
                    if(!err2){
                        con3.query(sql, [data], function(err, rows1){
                            if (!err) {
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = "Custom Ads Save Successfully";
                                jsonObject["data"] = rows1.affectedRows;
                                res.send(jsonObject);
                            } else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = "DB :" + err;
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
            } else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = resDelete.data;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        })
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "app_id and app_list are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Mapp Application Ads
function removeCustomAds(req,res) {
    var app_id = req.body.app_id ? req.body.app_id : null;   
    if(app_id){
        deleteCustomAds(app_id).then(function(resDelete){
            if(resDelete.status == 1){
                var jsonObject = {};
                jsonObject["status"] = "1";
                jsonObject["message"] = "Custom Ads Removed Successfully";
                jsonObject["data"] = [];
                res.send(jsonObject);
            } else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = resDelete.data;
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        })
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "app_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// getCustomAds
function getCustomAds(req,res) {
    var app_id = req.body.app_id ? req.body.app_id : null;
    if(app_id){
        var sql = ` select 
                        am.id as app_id,
                        am.name as app_name,
                        am.package as app_package,
                        am.icon as app_icon,
                        (
                            select 
                                CONCAT(
                                    '[', 
                                        GROUP_CONCAT(
                                            JSON_OBJECT(
                                                'app_id', am1.id,
                                                'app_name', am1.name,
                                                'app_package', am1.package,
                                                'app_icon', am1.icon,
                                                'row_checked', true
                                            )
                                        ), 
                                    ']'
                                )
                            from application_master as am1 
                            where am1.id = cam.advertiser_app_id
                            order by am1.name
                        ) as app_list
                    from custom_ads_mapping as cam
                    left join application_master as am on am.id = cam.publisher_app_id 
                    where cam.publisher_app_id = `+app_id+`
                    order by am.name asc`;
        console.log("getCustomAds sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Custom Ads Found Successfully";
                        let result = {};
                        result['app_list'] = [];
                        let apps = [];
                        for(let i = 0; i< rows1.length; i++){
                            if(rows1 && rows1[i] && rows1[i].app_list){
                                rows1[i].app_list = isJson(rows1[i].app_list) ? JSON.parse(rows1[i].app_list) : rows1[i].app_list;
                            }else {
                                let obj = {
                                    app_id : "",
                                    app_name : "",
                                    app_package : "",
                                    app_icon : "",
                                    row_checked: false
                                };
                                rows1[i].app_list = [obj];
                            }
                            if(i == 0){
                                result['app_id'] = rows1[i].app_id;
                                result['app_name'] = rows1[i].app_name;
                                result['app_package'] = rows1[i].app_package;
                                result['app_icon'] = rows1[i].app_icon;
                            }
                            apps.push(rows1[i].app_list[0]);
                        }
                        result['app_list'] = apps;
                        jsonObject["data"] = result;
                        res.send(jsonObject);
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Application ID Is Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// getCustomAds
function getAdsSettings(req,res) {
    var app_package = req.body.package ? req.body.package : null;
    var publisher_id = req.body.publisher_id ? req.body.publisher_id : null;
    if(app_package && publisher_id){
        /*  INSERT INTO `application_master`(
            id,
            name,
            description,
            package,
            fcm,
            icon,
            type,
            is_live,
            owner,
            user_id,
            status,
            banner,
            data: {any json format data(not fixed) text input},
            web_view,
            privacy,
            other = {
                is_features: true/false
                more_apps: (text input value)
                version_code: text input value
                exit_status: true/false
            }
        )
    */
        var sql = ` select 
                        cam.id as mapp_id,
                        cam.status,
                        am.id as app_id,
                        am.name as app_name,
                        am.package as app_package,
                        am.fcm as app_fcm,
                        am.icon as app_icon,
                        am.description as app_description,
                        am.is_live as app_is_live,
                        am.link as app_link,
                        am.banner as app_banner,
                        am.data as app_data,
                        am.web_view as app_web_view,
                        am.privacy as app_privacy_policy,
                        am.owner as owner,
                        am.other as app_other,
                        aam.data as monetisation,
                        (
                            select 
                                CONCAT(
                                    '[', 
                                        GROUP_CONCAT(
                                            JSON_OBJECT(
                                                'app_id', am1.id,
                                                'app_name', am1.name,
                                                'app_package', am1.package,
                                                'app_icon', am1.icon,
                                                'app_description', am1.description,
                                                'app_is_live', am1.is_live,
                                                'app_link', am1.link,
                                                'app_banner', am1.banner,
                                                'owner', am1.owner,
                                                'app_data', am1.data,
                                                'app_web_view', am1.web_view,
                                                'app_privacy_policy', am1.privacy,
                                                'app_other', am1.other
                                            )
                                        ), 
                                    ']'
                                )
                            from application_master as am1 
                            left join custom_ads_mapping as camm on camm.advertiser_app_id = am1.id
                            where camm.publisher_app_id = cam.publisher_app_id
                            order by am1.name
                        ) as app_list
                    from application_master as am 
                    left join custom_ads_mapping as cam on cam.publisher_app_id = am.id
                    left join application_ads_mapping as aam on aam.app_id = am.id
                    where am.package = '`+app_package+`' and am.user_id = '`+publisher_id+`'
                    order by am.name asc
                    limit 1`;
        console.log("getAdsSettings sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows1){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Advertisement Settings Found Successfully!";
                        let result = {};
                        let apps = [];
                        /*

                                id,
                                name,
                                description,
                                package,
                                fcm,
                                icon,
                                type,
                                is_live,
                                owner,
                                user_id,
                                status,
                                banner,
                                data: {any json format data(not fixed) text input},
                                web_view,
                                privacy,
                                other : {
                                    is_features: true/false
                                    more_apps: (text input value)
                                    version_code: text input value
                                    exit_status: true/false
                                }

                        */
                        //console.log("rows" + JSON.stringify(rows1));
                        if(rows1 && rows1[0]){
                            if(rows1 && rows1[0] && rows1[0].app_id){
                                rows1[0].app_description = rows1[0].app_description && isJson(rows1[0].app_description) ? JSON.parse(rows1[0].app_description) : rows1[0].app_description;
                                rows1[0].app_data = rows1[0].app_data && isJson(rows1[0].app_data) ? JSON.parse(rows1[0].app_data) : null;
                                rows1[0].app_data = rows1[0].app_data ? dates.decode(rows1[0].app_data) : null;
                                let other = rows1[0].app_other && isJson(rows1[0].app_other) ? JSON.parse(rows1[0].app_other) : null;
                                if(rows1[0].owner == 'advertiser'){
                                    if(other && other.is_features != undefined){
                                        rows1[0]['app_is_features'] = other.is_features;
                                    }else {
                                        rows1[0]['app_is_features'] = false;
                                    }
                                }
                                if(rows1[0].owner == 'publisher'){
                                   if(other && other.more_apps){
                                       rows1[0]['app_more_apps'] = other.more_apps;
                                   }else {
                                    rows1[0]['app_more_apps'] = "";
                                   }
                                }
                                if(rows1[0].owner == 'publisher'){
                                    if(other && other.version_code){
                                        rows1[0]['app_version_code'] = other.version_code;
                                    }else {
                                        rows1[0]['app_version_code'] = "";
                                    }
                                }
                                if(rows1[0].owner == 'publisher'){
                                    if(other && other.exit_status != undefined){
                                        rows1[0]['app_exit_status'] = other.exit_status;
                                    }else {
                                        rows1[0]['app_exit_status'] = false;
                                    }
                                }
                            }
                            if(rows1 && rows1[0] && rows1[0].monetisation){
                                rows1[0].monetisation = isJson(rows1[0].monetisation) ? JSON.parse(rows1[0].monetisation) : rows1[0].monetisation;
                                console.log("rows1[0].monetisation")
                                console.log(rows1[0].monetisation)
                            }else {
                                let monetisationObj = {
                                    "ad_mapping_id": null,
                                    "app_id": null,
                                    "status": "0",
                                    "FB_ADS": false,
                                    "FB_id": "",
                                    "FB_interstitial_ads": "",
                                    "FB_banner_ads": "",
                                    "FB_native_banner": "",
                                    "FB_native_ads": "",
                                    "FB_rewareded_ads": "",
                                    "GAN_ADS": false,
                                    "GAN_id": "",
                                    "GAN_interstitial_ads": "",
                                    "GAN_banner_ads": "",
                                    "GAN_native_banner": "",
                                    "GAN_native_ads": "",
                                    "GAN_rewareded_ads": "",
                                    "MO_ADS": false,
                                    "MO_id": "",
                                    "MO_interstitial_ads": "",
                                    "MO_banner_ads": "",
                                    "MO_native_banner": "",
                                    "MO_native_ads": "",
                                    "MO_rewareded_ads" : "",
                                };
                                rows1[0].monetisation = monetisationObj;
                            }
                            if(rows1 && rows1[0] && rows1[0].app_list){
                                console.log("rows1[0].app_list")
                                console.log(rows1[0].app_list)
                                rows1[0].app_list = isJson(rows1[0].app_list) ? JSON.parse(rows1[0].app_list) : rows1[0].app_list;
                                //console.log("isJson(rows1[0].app_list) \t" + isJson(rows1[0].app_list))
                                //console.log("rows1[0].app_list \t" + JSON.stringify(rows1[0].app_list))
                                //console.log("rows1[0].app_list.length \t" + JSON.stringify(rows1[0].app_list.length))
                                if(rows1[0].app_list.length > 0){
                                    //console.log("rows1[0].app_list \t " + JSON.stringify(rows1[0].app_list))
                                    console.log("rows1[0].app_list.length \t " + rows1[0].app_list.length)
                                    for(let i = 0; i< rows1[0].app_list.length; i++){
                                        rows1[0].app_list[i].app_description = rows1[0].app_list[i].app_description && isJson(rows1[0].app_list[i].app_description) ? JSON.parse(rows1[0].app_list[i].app_description) : rows1[0].app_list[i].app_description;
                                        let obj = {};
                                        rows1[0].app_list[i].app_data = rows1[0].app_list[i].app_data && isJson(rows1[0].app_list[i].app_data) ? JSON.parse(rows1[0].app_list[i].app_data) : null;
                                        rows1[0].app_list[i].app_data = rows1[0].app_list[i].app_data ? dates.decode(rows1[0].app_list[i].app_data) : null;
                                        let other = rows1[0].app_list[i].app_other && isJson(rows1[0].app_list[i].app_other) ? JSON.parse(rows1[0].app_list[i].app_other) : null;
                                        delete rows1[0].app_list[i].app_other;
                                        if(rows1[0].app_list[i].owner == 'advertiser'){
                                            if(other && other.is_features != undefined){
                                                rows1[0].app_list[i]['app_is_features'] = other.is_features;
                                            }else {
                                                rows1[0].app_list[i]['app_is_features'] = false;
                                            }
                                            obj['app_is_features'] = rows1[0].app_list[i].is_features ? rows1[0].app_list[i].is_features : null;
                                        }
                                        if(rows1[0].app_list[i].owner == 'publisher'){
                                            if(other && other.more_apps){
                                                rows1[0].app_list[i]['app_more_apps'] = other.more_apps;
                                            }else {
                                                rows1[0].app_list[i]['app_more_apps'] = "";
                                            }
                                            obj['app_more_apps'] = rows1[0].app_list[i].more_apps ? rows1[0].app_list[i].more_apps : null;
                                        }
                                        if(rows1[0].app_list[i].owner == 'publisher'){
                                            if(other && other.version_code){
                                                rows1[0].app_list[i]['app_version_code'] = other.version_code;
                                            }else {
                                                rows1[0].app_list[i]['app_version_code'] = "";
                                            }
                                            obj['app_version_code'] = rows1[0].app_list[i].version_code ? rows1[0].app_list[i].version_code : null;
                                        }
                                        if(rows1[0].app_list[i].owner == 'publisher'){
                                            if(other && other.exit_status != undefined){
                                                rows1[0].app_list[i]['app_exit_status'] = other.exit_status;
                                            }else {
                                                rows1[0].app_list[i]['app_exit_status'] = false;
                                            }
                                            obj['app_exit_status'] = rows1[0].app_list[i].exit_status != undefined ? rows1[0].app_list[i].exit_status : false;
                                        }
                                        obj['app_id'] = rows1[0].app_list[i].app_id;
                                        obj['app_name'] = rows1[0].app_list[i].app_name;
                                        obj['app_package'] = rows1[0].app_list[i].app_package;
                                        obj['app_fcm'] = rows1[0].app_list[i].app_fcm;
                                        obj['app_icon'] = rows1[0].app_list[i].app_icon;
                                        obj['app_description'] = rows1[0].app_list[i].app_description;
                                        obj['app_is_live'] = rows1[0].app_list[i].app_is_live;
                                        obj['app_link'] = rows1[0].app_list[i].app_link;
                                        obj['app_banner'] = rows1[0].app_list[i].app_banner;
                                        obj['app_web_view'] = rows1[0].app_list[i].web_view != undefined ? rows1[0].app_list[i].web_view : false;
                                        obj['app_privacy_policy'] = rows1[0].app_list[i].privacy ? rows1[0].app_list[i].privacy : null;
                                        obj['app_data'] = rows1[0].app_list[i].app_data ? rows1[0].app_list[i].app_data : null;
                                        obj['app_status'] = rows1[0].app_list[i].app_status != undefined ? rows1[0].app_list[i].app_status : 0;
                                        apps.push(obj);
                                    }
                                }
                            }/* else {
                                let obj = {
                                    "app_id" : "",
                                    "app_name" : "",
                                    "app_package" : "",
                                    "app_fcm" : "",
                                    "app_icon" : "",
                                    "app_description" : "",
                                    "app_is_live" : "",
                                    "app_link" : "",
                                    "app_banner" : "",
                                    "app_data" : null,
                                    "app_web_view" : false,
                                    "app_privacy_policy" : "",
                                    "app_status" : false,
                                };
                                if(rows1[0].owner == 'advertiser'){
                                    obj['app_is_features'] = false;
                                }else {
                                    obj['app_more_apps'] = "";
                                    obj['app_version_code'] = "";
                                    obj['app_exit_status'] = false;
                                }
                                //rows1[0].app_list = [obj];
                                apps.push(obj);
                            } */
                            /* console.log("rows1[0]")
                            console.log(rows1[0]) */
                            delete rows1[0].app_list;
                            delete rows1[0].app_other;
                            delete rows1[0].owner;
                            result = rows1[0];
                            result["FB_ADS"] = rows1[0].monetisation && rows1[0].monetisation.FB_ADS != undefined ? (rows1[0].monetisation.FB_ADS ? rows1[0].monetisation.FB_ADS : false) : false;
                            result["FB_id"] = rows1[0].monetisation && rows1[0].monetisation.FB_id != undefined ? rows1[0].monetisation.FB_id : "";
                            result["FB_interstitial_ads"] = rows1[0].monetisation && rows1[0].monetisation.FB_interstitial_ads != undefined ? rows1[0].monetisation.FB_interstitial_ads : "";
                            result["FB_banner_ads"] = rows1[0].monetisation && rows1[0].monetisation.FB_banner_ads != undefined ? rows1[0].monetisation.FB_banner_ads : "";
                            result["FB_native_banner"] = rows1[0].monetisation && rows1[0].monetisation.FB_native_banner != undefined ? rows1[0].monetisation.FB_native_banner : "";
                            result["FB_native_ads"] = rows1[0].monetisation && rows1[0].monetisation.FB_native_ads != undefined ? rows1[0].monetisation.FB_native_ads : "";
                            result["FB_rewareded_ads"] = rows1[0].monetisation && rows1[0].monetisation.FB_rewareded_ads != undefined ? rows1[0].monetisation.FB_rewareded_ads : "";
                            result["GAN_ADS"] = rows1[0].monetisation && rows1[0].monetisation.GAN_ADS != undefined ? (rows1[0].monetisation.GAN_ADS ? rows1[0].monetisation.GAN_ADS : false) : false;
                            result["GAN_id"] = rows1[0].monetisation && rows1[0].monetisation.GAN_id != undefined ? rows1[0].monetisation.GAN_id : "";
                            result["GAN_interstitial_ads"] = rows1[0].monetisation && rows1[0].monetisation.GAN_interstitial_ads != undefined ? rows1[0].monetisation.GAN_interstitial_ads : "";
                            result["GAN_banner_ads"] = rows1[0].monetisation && rows1[0].monetisation.GAN_banner_ads != undefined ? rows1[0].monetisation.GAN_banner_ads : "";
                            result["GAN_native_banner"] = rows1[0].monetisation && rows1[0].monetisation.GAN_native_banner != undefined ? rows1[0].monetisation.GAN_native_banner : "";
                            result["GAN_native_ads"] = rows1[0].monetisation && rows1[0].monetisation.GAN_native_ads != undefined ? rows1[0].monetisation.GAN_native_ads : "";
                            result["GAN_rewareded_ads"] = rows1[0].monetisation && rows1[0].monetisation.GAN_rewareded_ads != undefined ? rows1[0].monetisation.GAN_rewareded_ads : "";
                            result["MO_ADS"] = rows1[0].monetisation && rows1[0].monetisation.MO_ADS != undefined ? (rows1[0].monetisation.MO_ADS ? rows1[0].monetisation.MO_ADS : false) : false;
                            result["MO_id"] = rows1[0].monetisation && rows1[0].monetisation.MO_id != undefined ? rows1[0].monetisation.MO_id : "";
                            result["MO_interstitial_ads"] = rows1[0].monetisation && rows1[0].monetisation.MO_interstitial_ads != undefined ? rows1[0].monetisation.MO_interstitial_ads : "";
                            result["MO_banner_ads"] = rows1[0].monetisation && rows1[0].monetisation.MO_banner_ads != undefined ? rows1[0].monetisation.MO_banner_ads : "";
                            result["MO_native_banner"] = rows1[0].monetisation && rows1[0].monetisation.MO_native_banner != undefined ? rows1[0].monetisation.MO_native_banner : "";
                            result["MO_native_ads"] = rows1[0].monetisation && rows1[0].monetisation.MO_native_ads != undefined ? rows1[0].monetisation.MO_native_ads : "";
                            result["MO_rewareded_ads"] = rows1[0].monetisation && rows1[0].monetisation.MO_rewareded_ads != undefined ? rows1[0].monetisation.MO_rewareded_ads : "";
                            result['custom_ads_app_list'] = apps;
                            delete rows1[0].monetisation;
                            jsonObject["data"] = result;
                            //console.log("apps \t\t\n\n\r")
                            //console.log(apps)
                            //console.log("result")
                            //console.log(result);
                        }else {
                            jsonObject["data"] = [];
                        }
                        if(rows1 && rows1.length > 0){
                            /* console.log("rows1")
                            console.log(rows1); */
                            increaseAppCount(result).then(function(resIncrease){
                                /* if(resIncrease.status == 1){
                                    res.send(jsonObject);
                                }else {
                                    jsonObject["message"] = resIncrease.data;
                                    jsonObject["data"] = result;
                                    res.send(jsonObject);
                                } */
                                res.send(jsonObject);
                            })
                        }else {
                            res.send(jsonObject);
                        }
                    } else {
                        var jsonObject = {};
                        jsonObject["status"] = "0";
                        jsonObject["message"] = "DB :" + err;
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
        jsonObject["message"] = "Application Package And Publisher ID Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// getAdvertiserAppHitCount
function getAdvertiserAppHitCount(req,res) {
    var advertiser_id = req.body.advertiser_id ? req.body.advertiser_id : null;
    var app_id = req.body.app_id ? req.body.app_id : null;
    if(advertiser_id){
        let where = '';
        if(app_id){
            where = ` and am.id = `+app_id;
        }
        let dt = dates._generateDateFormat('', 'yyyy-mm-dd')
        var sql = ` select 
                        am.id,
                        am.name,
                        am.icon,
                        am.banner,
                        am.package,
                        (select count(id) from application_hit_count where request_id = am.id) as total_count,
                        (select count(id) from application_hit_count where request_id = am.id and cast(create_date as date) = '`+dt+`') as today_count
                    from application_master as am
                    where am.user_id = '`+advertiser_id+`' `+where+`
                    group by am.id
                    order by am.name asc`;
        console.log("getAdvertiserAppHitCount sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Impression Counts Found Successfully!";
                        if(rows && rows.length > 0){
                            jsonObject["data"] = rows;
                            res.send(jsonObject);
                        }else {
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
        jsonObject["message"] = "Advertiser ID Is Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// getPublisherAppHitCount
function getPublisherAppHitCount(req,res) {
    var publisher_id = req.body.publisher_id ? req.body.publisher_id : null;
    var app_id = req.body.app_id ? req.body.app_id : null;
    if(publisher_id){
        let where = '';
        if(app_id){
            where = ` and am.id = `+app_id;
        }
        let dt = dates._generateDateFormat('', 'yyyy-mm-dd')
        var sql = ` select 
                        am.id,
                        am.name,
                        am.icon,
                        am.banner,
                        am.package,
                        (select count(request_id) from application_hit_count where request_id = am.id) as total_impression_count,
                        (select count(request_id) from application_hit_count where request_id = am.id and cast(create_date as date) = '`+dt+`') as today_impression_count,
                        (select count(id) from application_hit_count where app_id = am.id) as total_hit_count,
                        (select count(id) from application_hit_count where app_id = am.id and cast(create_date as date) = '`+dt+`') as today_hit_count
                    from application_master as am
                    where am.user_id = '`+publisher_id+`' `+where+`
                    group by am.id
                    order by am.name asc`;
        console.log("getPublisherAppHitCount sql \r\n "+ sql);
        pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql, function(err, rows){
                    if (!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "Impression Counts Found Successfully!";
                        if(rows && rows.length > 0){
                            jsonObject["data"] = rows;
                            res.send(jsonObject);
                        }else {
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
        jsonObject["message"] = "Advertiser ID Is Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}







var checkAppMonetisation = function(app_id){
    return new Promise(function(resolve){
        var sql = `select count(id) as count from application_ads_mapping where app_id =`+ app_id +``;
        console.log("checkAppMonetisation \r\n" + sql);
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err){
                        var duplicate = 0;
                        if(rows && 
                           rows[0] && 
                           rows[0].count != undefined && 
                           rows[0].count != null && 
                           rows[0].count != 'null' && 
                           rows[0].count != undefined){
                            duplicate = rows[0].count;
                        }
                        if(duplicate > 0){
                            resolve({status: 0, data: duplicate});
                        }else {
                            resolve({status: 1, data: duplicate});
                        }
                    } else {
                        resolve({status: 0, data: err});
                    }
                    con1.release();
                });
            }else {
                resolve({status: 0, data: err1});
            }
        });
    });
}

var checkDuplicateApplication = function(name){
    return new Promise(function(resolve){
        var sql = `select count(id) as count from application_master where package in(`+ name + `)`;
        console.log("checkDuplicateApplication \r\n" + sql);
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows) {
                    if (!err){
                        var duplicate = 0;
                        if(rows && 
                           rows[0] && 
                           rows[0].count != undefined && 
                           rows[0].count != null && 
                           rows[0].count != 'null' && 
                           rows[0].count != undefined){
                            duplicate = rows[0].count;
                        }
                        if(duplicate > 0){
                            resolve({status: 0, data: duplicate});
                        }else {
                            resolve({status: 1, data: duplicate});
                        }
                    } else {
                        resolve({status: 0, data: err});
                    }
                    con1.release();
                });
            }else {
                resolve({status: 0, data: err1});
            }
        });
    });
}

var deleteCustomAds = function(app_id){
    return new Promise(function(resolve){
        if(app_id){
            var sql = `delete from custom_ads_mapping where publisher_app_id = `+app_id+``;
            console.log("deleteCustomAds sql \r\n" + sql);
            pool.getConnection(function(err, con){
                if(!err){
                    con.query(sql, function(err1, rows){
                        if(!err1){
                            resolve({status:1, data: rows.affectedRows})
                        }else {
                            resolve({status:0, data: "DB : "+ err1})
                        }
                    })
                }else {
                    resolve({status:0, data: "CON : "+ err})
                }
            })
        }else {
            resolve({status:0, data: "app_id is required"})
        }
    })
}

var increasePublisherAppCount = function(app_id){
    return new Promise(function(resolve){
        if(app_id){
            var sql = `insert into application_hit_count(app_id) values (`+app_id+`)`;
            console.log("increasePublisherAppCount sql \r\n "+ sql);
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
            resolve({status: 0, data: "app_id is required"})
        }
    })
}

var increaseAdvertiserAppCount = function(app_id, app_data){
    return new Promise(function(resolve){
        let data = [];
        for(let i = 0; i < app_data.length; i++){
            data.push([
                app_id,
                app_data[i]['app_id'],
            ]);
        }
        console.log("apps")
        console.log(data)
        console.log("app_id  ---------->  " + app_id)
        if(data.length > 0 && app_id){
            var sql = `insert into application_hit_count(app_id, request_id) values ?`;
            console.log("increaseAdvertiserAppCount sql \r\n "+ sql);
            pool.getConnection(function (err2, con3){
                if(!err2){
                    con3.query(sql, [data], function(err, rows1){
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

var increaseAppCount = function(data){
    return new Promise(function(resolve){
        if(data && data.app_id && data.custom_ads_app_list){
            /* if(data.custom_ads_app_list.length > 0){
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
            } */
            increasePublisherAppCount(data.app_id).then(function(resPI){
                if(resPI.status == 1){
                    resolve({status: 1, data: resPI.data});
                }else {
                    resolve({status: 0, data: resPI.data});
                }
            })
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