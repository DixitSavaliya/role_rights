var express = require('express');
var bcrypt   = require('bcryptjs');
var fs = require('fs');
path = require('path');
const axios = require('axios');
var request = require('request');
var router = express.Router();
var pool = require('../database')();
var dates = require('../dates');
var cache = require('../cache');
var dir = require('../directories');
var config = require('../config.json');

/*******************************************************************************/
/**************************************WEB**************************************/
/*******************************************************************************/
router.post('/registerUsers', registerUsers);
router.post('/searchUsers', searchUsers);
router.post('/getUsersDetailsById', getUsersDetailsById);
router.post('/getFullUsersDetailsById', getFullUsersDetailsById);
router.post('/updateUsersDetailsById', updateUsersDetailsById);
router.post('/getUsersDetailsByUserGroupId', getUsersDetailsByUserGroupId);
router.post('/uploadUsersImage', uploadUsersImage);
router.post('/removeUsersImage', removeUsersImage);
router.post('/countUsers', countUsers);
router.post('/usersByPg', usersByPg);
router.post('/usersBySearch', usersBySearch);
router.post('/uploadImageByURL', uploadImageByURL);
router.post('/inactiveUser', inactiveUser);



// Create New User with Login  
function registerUsers(req, res){
    var users = {
        id: '',
        status: req.body.status, 
        create_by: req.body.create_by, 
        first_name:req.body.first_name, 
        last_name:req.body.last_name,  
        email_id:req.body.email_id, 
        mobile_no : req.body.mobile_no,
        password:req.body.password, 
        user_type : req.body.user_type, 
        user_role_id : req.body.user_role_id,
        user_group: '',
        user_id: '',
        user_group_id: '',
        secret_key: '',
    };
    if(users.user_type == 1){
        users.user_group = 'advertiser' //Advertiser
    }else {
        users.user_group = 'publisher' //Publisher
    }
    console.log("users.secret_key --------------------> " + users.secret_key)
    if(users.email_id != undefined && users.email_id != '' && users.email_id){
        // For Unique USERNAME
        checkUsersEmail(users.email_id)
        .then(function(userRes){
            if (userRes.status == 1) {
                bcrypt.hash(users.password, 5, function( err, bcryptedPassword) {
                    users.password = bcryptedPassword;
                    var sql = ` insert into users_master(
                                    status,
                                    create_by,
                                    first_name,
                                    last_name,
                                    email_id,
                                    mobile_no,
                                    user_type
                                ) values (
                                    `+ users.status +`,
                                    `+ users.create_by +`,
                                    '`+ users.first_name+`',
                                    '`+ users.last_name +`',
                                    '`+ users.email_id+`',
                                    '`+ users.mobile_no+`',
                                    `+ users.user_type+`
                                )`;
                    console.log("registerUsers sql ---------------> " + sql)
                    pool.getConnection(function (err2, con2){
                        if(!err2){
                            con2.query(sql, function(err3, rows1){
                                if (!err3) {
                                    users.id = '';
                                    users.username = '';
                                    users.user_group_id = rows1.insertId;
                                    createLogin(users).then(function(resLogin){
                                        if(resLogin.status == 1){
                                            users.user_id = resLogin.data;
                                            var jsonObject = {};
                                            jsonObject["status"] = "1";
                                            jsonObject["message"] = "Users Login Details Created Successfully";
                                            jsonObject["data"] = users;
                                            res.send(jsonObject);
                                        }else {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = resLogin.data;
                                            jsonObject["data"] = users;
                                            res.send(jsonObject);
                                        }
                                    })
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
                jsonObject["message"] = "Usersname already taken please choose another one";
                jsonObject["data"] = [];
                res.send(jsonObject);
            }
        });
    }else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "username is required to register users";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Update Users Login Details By Id 
function updateUsersDetailsById(req, res){
    var users = {
        id: req.body.id ? req.body.id : null,
        status: req.body.status, 
        create_by: req.body.create_by, 
        first_name:req.body.first_name, 
        last_name:req.body.last_name,  
        email_id:req.body.email_id, 
        mobile_no : req.body.mobile_no,
        password:req.body.password, 
        user_type : req.body.user_type, 
        username: null,
        user_id: null,
        user_group: '',
        user_role_id : req.body.user_role_id,
        user_group_id: req.body.id ? req.body.id : null,
        secret_key: '',
    };
    if(users.user_type == 1){
        users.user_group = 'users'
    }else {
        users.user_group = 'publisher'
    }
    if(users.id){
        var sql = `select um.* from user_master um where um.user_group_id = `+ users.id;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,function(err, rows){
                    var jsonObject = {};
                    if (!err) {
                        if (rows[0] != undefined && rows[0].id != undefined && rows[0].id > 0) {
                            users.user_id = rows[0].id;
                            if(rows[0].email_id === users.email_id){
                                if(req.body.password && req.body.password != '' && req.body.password != 'undefined' && req.body.password.length > 0){
                                    bcrypt.hash(users.password, 5, function( err, bcryptedPassword) {
                                        var sql = ` update users_master set  
                                                        modify_by= `+users.modify_by+`,                                                        
                                                        first_name= '`+users.first_name+`',
                                                        last_name= '`+users.last_name+`',
                                                        email_id= '`+users.email_id+`',
                                                        mobile_no= `+users.mobile_no+`,
                                                        where id = ` + users.id;
                                        console.log("updateUsersDetailsById with PW sql =====> " + sql)
                                        pool.getConnection(function (err2, con3){
                                            if(!err2){
                                                con3.query(sql,function(err3, rows1){
                                                    if (!err3){
                                                        users.password = bcryptedPassword;
                                                        updateLogin(users, 1).then(function(resUpdate){
                                                            if(resUpdate.status == 1){
                                                                var jsonObject = {};
                                                                jsonObject["status"] = "1";
                                                                jsonObject["message"] = "Users Login Details Updated Successfully";
                                                                jsonObject["data"] = users;
                                                                res.send(jsonObject);
                                                            }else {
                                                                var jsonObject = {};
                                                                jsonObject["status"] = "0";
                                                                jsonObject["message"] = resUpdate.data;
                                                                jsonObject["data"] = users;
                                                                res.send(jsonObject);
                                                            }
                                                        })
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
                                    var sql = ` update users_master set  
                                                    modify_by= `+users.modify_by+`,                                                        
                                                    first_name= '`+users.first_name+`',
                                                    last_name= '`+users.last_name+`',
                                                    email_id= '`+users.email_id+`',
                                                    mobile_no= `+users.mobile_no+`,
                                                where id = ` + users.id;
                                    console.log("updateUsersDetailsById without PW sql =====> " + sql)
                                    pool.getConnection(function (err2, con3){
                                        if(!err2){
                                            con3.query(sql,function(err3, rows1){
                                                if (!err3){
                                                    updateLogin(users).then(function(resUpdate){
                                                        if(resUpdate.status == 1){
                                                            var jsonObject = {};
                                                            jsonObject["status"] = "1";
                                                            jsonObject["message"] = "Users Login Details Updated Successfully";
                                                            jsonObject["data"] = users;
                                                            res.send(jsonObject);
                                                        }else {
                                                            var jsonObject = {};
                                                            jsonObject["status"] = "0";
                                                            jsonObject["message"] = resUpdate.data;
                                                            jsonObject["data"] = users;
                                                            res.send(jsonObject);
                                                        }
                                                    })
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
                                jsonObject["message"] = "Email is not changable!";
                                jsonObject["data"] = [];
                                res.send(jsonObject);
                            }
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "Users does not exist!";
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
        jsonObject["message"] = "Users ID is Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Get Active Users Details By Id
function getUsersDetailsById(req, res){
    var id = req.body.id;
    if(id != undefined && id != '' && id != null){
        var sql = ` select 
                        um1.*,
                        um.user_group,
                        um.user_group_id,
                        um.secret_key,
                        ur.id as user_role_id,
                        ur.name as user_role 
                    from users_master as um1 
                    left join user_master as um on um.user_group_id = um1.id
                    left join user_role as ur on ur.id = um.user_role_id
                    where um.id = ` + id + ` and um.status = 1`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err) {
                        if (rows && rows[0] && rows[0].id){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Users Record read Successfully";
                            jsonObject["data"] = rows[0];
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such users found ";
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

// Get Active Users Details By Id
function getFullUsersDetailsById(req, res){
    var id = req.body.id ? req.body.id : null;
    if(id){
        var sql = ` select 
                        um.*,
                        um1.usre_group,
                        um1.usre_group_id,
                        um1.secret_key,
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
                    from users_master as um 
                    left join user_master as um1 on um1.user_group_id = um.id
                    left join user_master as um2 on um2.id = IF(um.modify_by IS NULL, um.create_by, um.modify_by)
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
                            jsonObject["message"] = "Users Details Found Successfully";
                            jsonObject["data"] = rows[0];
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such users found ";
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
        jsonObject["message"] = "id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Upload Chemist Image
function uploadUsersImage(req,res){
    var file = req.files;
    if(!file){
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "File was not found";
        jsonObject["data"] = [];
        res.send(jsonObject);
    } else {
        if(file.file_name.mimetype =='image/jpeg' || file.file_name.mimetype =='image/jpg' || file.file_name.mimetype =='image/png'|| file.file_name.mimetype =='image/gif' || file.file_name.mimetype =='image/bmp' ){
            var splt_str = file.file_name.name.split(".");
            var last = (splt_str.length - 1);
            var ext_file_name = '';
            if(splt_str[last] != undefined && splt_str[last] != 'undefined'){
                ext_file_name = splt_str[last];
            }else {
                ext_file_name = splt_str[1];
            }
            var save_file_name = dates.generate_img_name(6) + '.' + ext_file_name;                
            var path = "./Images/Users/" + save_file_name;
            file.file_name.mv(path, function(err) {
                if (err){
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "File not saved";
                    jsonObject["data"] = [];
                    res.send(jsonObject);
                } else {
                    var db_file_name = 'Users/' + save_file_name;
                    if(req.body.user_type == 1){
                        db_file_name = 'Publisher/' + save_file_name;
                    }
                    var sql = `update users_master set avatar = '` + db_file_name + `' where id = `+ req.body.user_id;
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

// Remove Users Image
function removeUsersImage(req,res){
    var localPath = dir.imgDir;
    var id = req.body.id ? req.body.id : null;
    var img_path = req.body.image_path ? req.body.image_path : null;
    if(img_path && id){
        localPath += '/' + img_path;
        try {
            status = fs.existsSync(localPath, function(resss){
                console.log('fs.existsSync' , resss)
            });
            fs.unlink(localPath, function(ress){
                console.log(ress);
            });
            var sql = `update users_master set avatar = NULL where id =`+id;
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

// Get Active Users Details By Id
function getUsersDetailsByUserGroupId(req, res){
    var id = req.body.id ? req.body.id : null;
    var usre_type = req.body.usre_type ? req.body.usre_type : null;
    var where = '';
    var join = '';
    if(id && user_type){
        if(user_type == 1){
            user_type = 'users'
        }else {
            user_type = 'publisher'
        }
        where = ` where um.user_group_id = `+ id +` and um.user_group = '`+ user_type + `'`;
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
                            jsonObject["message"] = "Users Login Details Found Successfully";
                            jsonObject["data"] = rows[0];
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such users found";
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
        jsonObject["message"] = "user_id and user_group are required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

function searchUsers(req, res){
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
                from users_master as um
                where (um.user_group = 'advertiser' or um.user_group = 'publisher') and um.status = 1
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

// Count Users
function countUsers(req, res) {        
    var sql = `select count(id) as count from users_master`;
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
}

// Pagination Call Users 
function usersByPg(req,res) {
    var item_per_page = parseInt(req.body.items_per_page);
    var page_no = (parseInt(req.body.page_no) - 1);
    var offset = parseInt(page_no * item_per_page);
    if(item_per_page > 0) {
        var sql = ` select 
                        *
                    from users_master  
                    order by first_name 
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

// Search Users 
function usersBySearch(req,res) {
    var search_string = req.body.search_string;
    var where = '';
    if(search_string.length > 0 ){
        where += ` and (    
                            first_name like '%`+search_string+`%' or 
                            last_name like '%`+search_string+`%' or 
                            email_id like '%`+search_string+`%' or 
                            mobile_no like '%`+search_string+`%' 
                        )`;
    }
    var sql = ` select * from users_master 
                where status = 1 `+ where +` 
                order by first_name 
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
                        jsonObject["data"] = rows;
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
}

//inactive user
function inactiveUser(req,res) {
    var data = req.body.data ? req.body.data : null;
    var status = req.body.status != undefined ? req.body.status : null;
    var insertArray = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i].userID != undefined){
            insertArray.push([data[i].userID]);
        }
    }
    if(insertArray.length > 0){
        var sql = `update users_master set status = `+status+` where id in(`+insertArray+`)`;
        console.log("inactiveUser sql \r\r\n\t"  + sql)
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,[insertArray], function(err, rows) {
                    if (!err){
                        console.log("inactiveUser status \t " + status)
                        console.log("inactiveUser insertArray[0] \t " + insertArray[0])
                        updateLoginService(status, insertArray[0]).then(function(resLogin){
                            if(resLogin.status == 1){
                                var jsonObject = {};
                                jsonObject["status"] = "1";
                                jsonObject["message"] = data.length + " User "+(status ? "Activated" : "Inactivated")+" Successfully";
                                jsonObject["data"] = data;
                                res.send(jsonObject);
                            }else {
                                var jsonObject = {};
                                jsonObject["status"] = "0";
                                jsonObject["message"] = resLogin.data;
                                jsonObject["data"] = [];
                                res.send(jsonObject);
                            }
                        })
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
        jsonObject["message"] = "userID And Status Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

function uploadImageByURL(req, res){
    var imageURL = req.body.imageURL ? req.body.imageURL : null;
    var data = req.body.data ? req.body.data : null;
    if(imageURL && data.module_name){
        var newPath = dates._generate_otp(8) + dates.generate_img_name(8);
        console.log("newName  ------------->  " + JSON.stringify(newPath));
        //var newName = newNames[newNames.length-1];
        var ext = '';
        if(imageURL.includes("jpg") || imageURL.includes("JPG")){
            ext = 'jpg';
        }else if(imageURL.includes("jpeg") || imageURL.includes("JPEG")){
            ext = 'jpeg';
        }else if(imageURL.includes("png") || imageURL.includes("PNG")){
            ext = 'png';
        }else if(imageURL.includes("bmp") || imageURL.includes("BMP")){
            ext = 'bmp';
        }else if(imageURL.includes("svg") || imageURL.includes("SVG")){
            ext = 'svg';
        }else if(imageURL.includes("webp") || imageURL.includes("WEBP")){
            ext = 'webp';
        }else {
            ext = null;
        }
        console.log("ext" + JSON.stringify(ext));
        //ext = ext[1] || null;
        newPath = newPath;
        var filePath = dir.imgDir + '/' + data.module_name +'/'+ newPath;
        var obj = {
            url: imageURL,
            filePath: filePath,
            finalDbFile: data.module_name +'/'+ newPath,
            moduel_name: data.module_name,
            primary_id: data.primary_id,
        }
        moveFiles(obj)
        .then(function(mRes){
            if(mRes.status === 1){
                var jsonObject = {};
                jsonObject["status"] = "1";
                jsonObject["message"] = "Images Upload Successfully";
                jsonObject["data"] = mRes.data;
                res.send(jsonObject);
            } else {
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = mRes.data;
                jsonObject["data"] = [];
                res.send(jsonObject);    
            }
        });
        /* if(!ext || ext == undefined || ext == '' || ext == null){
            var jsonObject = {};
            jsonObject["status"] = "0";
            jsonObject["message"] = "Image URL Must Contain Image Extension";
            jsonObject["data"] = [];
            res.send(jsonObject);
        }else {
            moveFiles(obj)
            .then(function(mRes){
                if(mRes.status === 1){
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Images Upload Successfully";
                    jsonObject["data"] = mRes.data;
                    res.send(jsonObject);
                } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = mRes.data;
                    jsonObject["data"] = [];
                    res.send(jsonObject);    
                }
            });
        } */
    } else {
        var jsonObject = {};
        jsonObject["status"] = "0";
        jsonObject["message"] = "imageURL And Data Are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

var moveFiles = function(data){
    return new Promise(function(resolve) {
        function getTable(name){
            let result = '';
            if(name == "Publisher" || name == "Advertiser"){
                result = ' users_master ';
            }else if(name == "User" || name == "Profile"){
                result = 'user_master';
            }else if(name == "Application"){
                result = ' application_master ';
            }else if(name == "Notification" || name == "Schedule"){
                result = ' shedule_master ';
            }else {
                result = null;
            }
            return result;
        }
        if(getTable(data.moduel_name)){
            if(getTable(data.moduel_name) == 'user_master'){
                if(data.url && data.filePath && data.finalDbFile && data.primary_id){
                    request.get({url: data.url, encoding: 'binary'}, function (err, httpResponse, body){
                        let ext = '';
                        let content_type = httpResponse.headers['content-type'];
                        if(content_type.includes("jpg") || content_type.includes("JPG")){
                            ext = 'jpg';
                        }else if(content_type.includes("jpeg") || content_type.includes("JPEG")){
                            ext = 'jpeg';
                        }else if(content_type.includes("png") || content_type.includes("PNG")){
                            ext = 'png';
                        }else if(content_type.includes("bmp") || content_type.includes("BMP")){
                            ext = 'bmp';
                        }else if(content_type.includes("svg") || content_type.includes("SVG")){
                            ext = 'svg';
                        }else if(content_type.includes("webp") || content_type.includes("WEBP")){
                            ext = 'webp';
                        }else {
                            ext = null;
                        }
                        if(!ext || ext == undefined || ext == '' || ext == null){
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "URL Not Contain Valid Image Type";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }else {
                            fs.writeFile(data.filePath + "." + ext, body, 'binary', function(err) {
                                if(!err) {
                                    var sql = ` update user_master 
                                                set avatar = '`+(data.finalDbFile + "." + ext)+`'
                                                where id = `+data.primary_id;
                                     pool.getConnection(function (err1, con1){
                                        if(!err1){
                                            con1.query(sql,function(err2, rows) {
                                                if (!err2) {
                                                    resolve({status:1, data: (data.finalDbFile + "." + ext)});
                                                } else {
                                                    resolve({status:0, data: err2});
                                                }
                                                con1.release();
                                            });
                                        }else {
                                            resolve({status:0, data: err1});
                                        }
                                    });
                                } else {
                                    resolve({status:0, data: err});
                                }
                            });
                        }
                    });
                }else {
                    resolve({status:0, data: 'validation Error! fields are required'});
                }
            }else {
                if(data.url && data.filePath && data.finalDbFile){
                    request.get({url: data.url, encoding: 'binary'}, function (err, httpResponse, body){
                        let ext = '';
                        let content_type = httpResponse.headers['content-type'];
                        if(content_type.includes("jpg") || content_type.includes("JPG")){
                            ext = 'jpg';
                        }else if(content_type.includes("jpeg") || content_type.includes("JPEG")){
                            ext = 'jpeg';
                        }else if(content_type.includes("png") || content_type.includes("PNG")){
                            ext = 'png';
                        }else if(content_type.includes("bmp") || content_type.includes("BMP")){
                            ext = 'bmp';
                        }else if(content_type.includes("svg") || content_type.includes("SVG")){
                            ext = 'svg';
                        }else if(content_type.includes("webp") || content_type.includes("WEBP")){
                            ext = 'webp';
                        }else {
                            ext = null;
                        }
                        if(!ext || ext == undefined || ext == '' || ext == null){
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "URL Not Contain Valid Image Type";
                            jsonObject["data"] = [];
                            res.send(jsonObject);
                        }else {
                            console.log("image type")
                            console.log("httpResponse.headers['content-type']" + httpResponse.headers['content-type'])
                            fs.writeFile((data.filePath + "." + ext), body, 'binary', function(err) {
                                if(!err) {
                                    resolve({status:1, data: (data.finalDbFile + "." + ext)});
                                } else {
                                    resolve({status:0, data: err});
                                }
                            });
                        }
                    });
                }else {
                    resolve({status:0, data: "all fields are required"});
                }
            }
        }else {
            resolve({status:0, data: 'No Such Module Exists!'});
        }
    });
}


var createLogin = function(data){
    return new Promise(function(resolve){
        if(data.email_id && data.password){
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
                    `+ data.status +`,
                    `+ data.create_by +`,
                    '`+ data.first_name+`',
                    '`+ data.last_name +`',
                    '`+ data.username+`',
                    '`+ data.email_id+`',
                    '`+ data.mobile_no+`',
                    '`+ data.password +`',
                    `+ data.user_role_id+`,
                    '`+ data.user_group+`',
                    `+ data.user_group_id+`
                )`;
            console.log("createLogin sql ---------------> " + sql)
            pool.getConnection(function (err2, con2){
                if(!err2){
                    con2.query(sql, function(err3, rows1){
                        con2.release();
                        if (!err3) {
                            var hasString = rows1.insertId + "_" + data.user_group + "_" + data.user_group_id + "_" + data.user_role_id;
                            data.secret_key = dates.encode(hasString);
                            data.user_id = rows1.insertId;
                            setSecretKey(data).then(function(result){
                                resolve({status: 1, data: rows1.insertId});
                            });
                        } else {
                            resolve({status: 0, data: "DB "+ err3});
                        }
                    }); 
                }else {
                    resolve({status: 0, data: "CON: "+ err2});
                }
            });
        }else {
            resolve({status: 0, data: 'email and password are required!'});
        }
    })
}

var updateLogin = function(data, hasPassword){
    return new Promise(function(resolve){
        if((data.email_id && data.password) || hasPassword){
            var sql = ` update user_master set  
                        modify_by= `+data.modify_by+`,
                        first_name= '`+data.first_name+`',
                        last_name= '`+data.last_name+`',
                        email_id= '`+data.email_id+`',
                        `+ (hasPassword ? (`password = '`+data.password +`',`) : `` )+`
                        mobile_no= `+data.mobile_no+`,
                        user_role_id= `+data.user_role_id+`,
                        user_group= `+data.user_group+`,
                        user_group_id= `+data.id+`
                        where id = ` + data.user_id;
            console.log("updateUsersDetailsById with PW sql =====> " + sql)
            pool.getConnection(function (err2, con3){
            if(!err2){
                con3.query(sql,function(err3, rows1){
                    con3.release();
                    if (!err3){
                        var hasString = data.user_id + "_" + data.user_group + "_" + data.user_group_id + "_" + data.user_role_id;
                        data.secret_key = dates.encode(hasString);
                        setSecretKey(data);
                        resolve({status: 1, data: data});
                    } else {
                        resolve({status: 0, data: "DB " + err3});
                    }
                });
            }else {
                resolve({status: 0, data: "CON: " + err2});
            }
            });
        }else {
            resolve({status: 0, data: 'email and password are required!'});
        }
    })
}

var checkUsersEmail = function(email_id) {
    return new Promise(function(resolve) {
        var sql = ` SELECT
                        count(id) as count
                    FROM
                        users_master
                    WHERE
                        email_id ='`+ email_id +`'`;
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

var setSecretKey = function(data){
    return new Promise((resolve) =>{
        if(data.secret_key && data.id){
            var sql = ` update user_master set secret_key = '`+ data.secret_key +`'
                        where id = `+ data.user_id +``;
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

var updateLoginService = function(status, user_id){
    console.log("updateLoginService status \t" +status)
    console.log("updateLoginService user_id \t" +user_id)
    return new Promise(function(resolve){
        if(status != undefined && user_id){
            var sql = ` update user_master set  
                        status= `+status+`
                        where user_group_id = ` + user_id;
            console.log("updateLoginService  sql =====> \r\n" + sql)
            pool.getConnection(function (err2, con3){
                if(!err2){
                    con3.query(sql,function(err3, rows1){
                        con3.release();
                        if (!err3){
                            resolve({status: 1, data: rows1.affectedRows});
                        } else {
                            resolve({status: 0, data: "DB " + err3});
                        }
                    });
                }else {
                    resolve({status: 0, data: "CON: " + err2});
            }
            });
        }else {
            resolve({status: 0, data: 'status and user_id are required!'});
        }
    })
}

module.exports = router;