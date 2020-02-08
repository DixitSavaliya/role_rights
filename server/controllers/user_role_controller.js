var express = require('express');
var fs = require('fs');
var cache = require('../cache');
var dates = require('../dates');
var json2xls = require('json2xls');
var pool = require('../database')();
var dir = require('../directories');
var config = require('../config.json');
var router = express.Router(); 

// UserRole
router.post('/registerUserRole', registerUserRole);
router.post('/updateUserRole', updateUserRole);
router.post('/deleteUserRole',deleteUserRole);
router.post('/getUserRole',getUserRole);
router.post('/importUserRole',importUserRole);
router.post('/exportUserRole',exportUserRole);
router.post('/countUserRole',countUserRole);
router.post('/getUserRoleDetailsPg', getUserRoleDetailsPg);
router.post('/searchUserRole',searchUserRole);
router.post('/searchDuplicateUserRole',searchDuplicateUserRole);


// UserRight
router.post('/registerUserRight', registerUserRight);
router.post('/updateUserRight', updateUserRight);
router.post('/deleteUserRight',deleteUserRight);
router.post('/getUserRight',getUserRight);
router.post('/importUserRight',importUserRight);
router.post('/exportUserRight',exportUserRight);
router.post('/countUserRight',countUserRight);
router.post('/getUserRightDetailsPg', getUserRightDetailsPg);
router.post('/searchUserRight',searchUserRight);
router.post('/searchDuplicateUserRight',searchDuplicateUserRight);

// UserRoleToRight
router.post('/registerUserRoleToRight', registerUserRoleToRight);
router.post('/getUserRoleToRight', getUserRoleToRight);


/****************** USER ROLE SECTION ******************/

// registerUserRole
function registerUserRole(req, res){
    var userRole = {
        status: req.body.status,
        name: req.body.name, 
    };
    if(userRole.name != undefined && userRole.name){
        var sql = `select count(id) as count from user_role where name = '`+ userRole.name + `' and status = 1`;
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
                        if (duplicate === 0){
                            var sql = `insert into user_role(name, status) values(?, ?)`;
                            pool.getConnection(function (err2, con3){
                                if(!err2){
                                    con3.query(sql,
                                        [userRole.name, userRole.status], 
                                        function(err, rows1){
                                        if (!err) {
                                            var jsonObject = {};
                                            jsonObject["status"] = "1";
                                            jsonObject["message"] = "UserRole Inserted Successfully";
                                            jsonObject["data"] = rows1.insertId;
                                            res.send(jsonObject);
                                        }
                                        else {
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
                            jsonObject["message"] = "User Role already taken please choose another one";
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
        jsonObject["message"] = "name is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Update UserRole By Id
function updateUserRole(req, res){
    var userRole = {
        id: req.body.id ? req.body.id : null,
        name: req.body.name,
        status: req.body.status
    };
    if(userRole.id){
        var sql1 = 'update user_role set name = ?, status = ? where id =? ';
        pool.getConnection(function (err2, con2) {
            if(!err2){
                con2.query(sql1, [userRole.name, userRole.status, userRole.id], 
                    function(err, rows1) {
                    if (!err){
                        if(rows1.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "UserRole Updated Successfully";
                            jsonObject["data"] = userRole;
                            res.send(jsonObject);
                        }
                        else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such UserRole found in database";
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
        jsonObject["message"] = "user_role_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Delete UserRole By Id
function deleteUserRole(req, res){
    var userRole = req.body.data != undefined && req.body.data.length ? req.body.data : [];
    var insertArray = [];
    for (let i = 0; i < userRole.length; i++) {
        if(userRole[i].userRoleID != undefined){
            insertArray.push([userRole[i].userRoleID]);
        }
    }
    if(insertArray.length > 0){
        var sql = `delete from user_role where id in(?) and modifiable = 1`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql,[insertArray], function(err, rows) {
                    if (!err){
                        if(rows.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "UserRole Removed Successfully";
                            jsonObject["data"] = userRole;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such UserRole found in database";
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
        jsonObject["message"] = "user_role_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//  Get UserRole 
function getUserRole(req, res){
    var userRole_id = req.body.userRole_id ? req.body.userRole_id : null ;
    var access = req.body.access ? req.body.access : null ;
    var user_type = req.body.user_type ? req.body.user_type : null ;
    var where = '';
    if (userRole_id){
        where = ` where ur.modifiable = 1 and ur.id = ` + userRole_id;
    }
    if(access == 1) {
        where = ``;
        if (userRole_id){
            where += ` where and ur.id = ` + userRole_id;
        }
    }
    if(user_type == 1) {
        where = `where ur.name = 'Freelancer'`;
    }
    if(user_type == 2) {
        where = `where ur.name = 'Company'`;
    }
    var sql = `select ur.* from user_role as ur ` + where;
    console.log("getUserRole sql ===> " + sql);
    pool.getConnection(function (err1, con1){
        if(!err1){
            con1.query(sql,function(err, rows) {
                if (!err){
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = rows.length + " Records found";
                    jsonObject["data"] = rows;
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
}

// Import UserRole
function importUserRole(req, res) {
    var userRole = req.body.data;
    var data = [];
    var filteredData = [];
    for(let i = 0; i < userRole.length; i++){
        filteredData.push([(`'`+userRole[i]['Name']+`'`)]);
        data.push([
            userRole[i]['Name'],
            (userRole[i]['Status'] == 'Active' ? 1 : 0 )
        ]);
    }
    if(data.length > 0){
        checkDuplicateRole(filteredData).then(function(resDuplicate){
            if(resDuplicate.status === 1){
                pool.getConnection(function (err1, con1){
                if(!err1){
                    var sql = 'insert into user_role (name, status) values ?';
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
                jsonObject["message"] = "duplicate role name found kindly check all the role name before import";
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

// Export UserRole
function exportUserRole(req, res){
    var sql = ` select name, if(status > 0, "Active", "Inactive") as status from user_role`;
    pool.getConnection(function (err1, con1){
        if(!err1){
            con1.query(sql, function(err, rows){
                if (!err){
                    if (rows.length > 0){
                        let arrayOfData = [];
                        arrayOfData.push(['Name', 'Type', 'Type ID', 'Status']);
                        for(let j = 0; j < rows.length; j++){
                            arrayOfData.push([rows[j].name, rows[j].type, rows[j].type_id, rows[j].status]);
                        }
                        var myData = json2xls(arrayOfData);
                        var fileExtension = '.xlsx';
                        var currentDate = dates._generateDateFormat('', 'yyyy_mm_dd_hh_ii_ss');
                        var filename = 'userRole_' + currentDate + fileExtension;
                        var path = dir.fileDir + "/UserRole/" + filename;
                        fs.writeFile(path, myData, 'binary', function(ress){
                            console.log(ress);
                        });
                        var jsonObject = {};
                        jsonObject['status'] = "1";
                        jsonObject['message'] = (arrayOfData.length -1) + " UserRoles Exported Successfully";
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
}

// Count UserRole
function countUserRole(req, res) {
    var sql = `select count(id) as count from user_role`;
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

// Pagination Call UserRole 
function getUserRoleDetailsPg(req,res) {
    var item_per_page = parseInt(req.body.items_per_page);
    var page_no = (parseInt(req.body.page_no) - 1);
    var offset = parseInt(page_no * item_per_page);
    if(item_per_page > 0) {
        var sql = `select * from user_role order by name  limit ` + offset + ` , ` + item_per_page;
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

// Search UserRole 
function searchUserRole(req,res) {
    var search_string = req.body.search_string;
    var where = '';
    if(search_string.length > 0 ){
        where = ` and name like '%`+search_string+`%'`;
    }
    var sql = `select * from user_role where status = 1  `+ where +` order by name limit 100`;
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

// Search UserRole 
function searchDuplicateUserRole(req,res) {
    var search_string = req.body.search_string ? req.body.search_string : '';
    console.log("search_string ------------------>  " + search_string)
    console.log(req.body);
    var where = '';
    if(search_string){
        where = ` and name = '`+search_string+`'`;
    }
    var sql = `select * from user_role where status = 1 `+ where +` order by name limit 1`;
    console.log("searchDuplicateUserRole sql \r\n" + sql);
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

// registerUserRight
function registerUserRight(req, res){
    var userRight = {
        name: req.body.name, 
        display_name: req.body.display_name,
        group_name: req.body.group_name,
        group_display_name: req.body.group_display_name,
    };
    var sql = ` insert into user_right
                (name, display_name, group_name, group_display_name) 
                values(?,?,?,?)`;
    pool.getConnection(function (err1, con1){
        if(!err1){
            con1.query(sql,
                 [
                    userRight.name, 
                    userRight.display_name, 
                    userRight.group_name, 
                    userRight.group_display_name, 
                ], function(err, rows) {
                if (!err) {
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "UserRight Inserted Successfully";
                    jsonObject["data"] = rows.insertId;
                    res.send(jsonObject);
                }
                else {
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

// Update UserRight By Id
function updateUserRight(req, res){
    var userRight = {
        name: req.body.name,
        display_name: req.body.display_name,
        group_name: req.body.group_name,
        group_display_name: req.body.group_display_name,
        id: req.body.id ? req.body.id : null
    };
    if(userRight.id){
        var sql = ` update user_right 
                    set 
                        name ='`+ userRight.name +`',
                        display_name ='`+ userRight.display_name +`',
                        group_name ='`+ userRight.group_name +`',
                        group_display_name ='`+ userRight.group_display_name +`'
                    where id =`+ userRight.id +``;
        pool.getConnection(function (err1, con1) {
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = "UserRight Updated Successfully";
                        jsonObject["data"] = userRight;
                        res.send(jsonObject);
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
        jsonObject["message"] = "user_right_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Delete UserRight By Id
function deleteUserRight(req, res){
    var UserRights = req.body.data != undefined && req.body.data.length ? req.body.data : [];
    var insertArray = [];
    for (let i = 0; i < UserRights.length; i++) {
        if(UserRights[i].userRightID != undefined){
            insertArray.push([UserRights[i].userRightID]);
        }
    }
    if(insertArray.length > 0){
        var sql = `delete from user_right where id in(`+ insertArray + `)`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err){
                        if(rows.affectedRows > 0){
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "UserRight Removed Successfully";
                            jsonObject["data"] = UserRights;
                            res.send(jsonObject);
                        } else {
                            var jsonObject = {};
                            jsonObject["status"] = "0";
                            jsonObject["message"] = "No such UserRight found in database";
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
        jsonObject["message"] = "user_right_id is required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//  Get UserRight 
function getUserRight(req, res){
    var userRight_id = req.body.userRight_id;
    var user_role_name = req.body.user_role_name ? req.body.user_role_name : '';
    var where = '';
    if (userRight_id){
        where = ` where id =` + userRight_id;
    }
    var sql = `select * from user_right ` + where + ` order by group_name`;
    pool.getConnection(function (err1, con1){
        if(!err1){
            con1.query(sql,function(err, rows) {
                if (!err){
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = rows.length + " Records found";
                    jsonObject["data"] = rows;
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
}

// Import UserRight
function importUserRight(req, res){
    var UserRight = req.body.data;
    var data = [];
    var filteredData = [];
    for(let i = 0; i < UserRight.length; i++){
        filteredData.push([(`'`+UserRight[i]['Name']+`'`)]);
        data.push([
            UserRight[i]['Name'],
            UserRight[i]['Display Name'],
            UserRight[i]['Group Name'],
            UserRight[i]['Group Display Name'],
        ]);
    }
    if(data.length > 0){
        checkDuplicateRight(filteredData).then(function(resDuplicate){
            if(resDuplicate.status === 1){
                var sql = 'insert into user_right (name, display_name, group_name, group_display_name) values ?';
                pool.getConnection(function (err1, con1) { 
                    if(!err1){
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
            }else{
                var jsonObject = {};
                jsonObject["status"] = "0";
                jsonObject["message"] = "duplicate right name found please check right name before import";
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

// Export UserRight
function exportUserRight(req, res) {
    var sql = 'select u.name, u.display_name, u.group_name, u.group_display_name, if(u.status > 0, "Active", "Inactive") as status from user_right as u';
    pool.getConnection(function (err1, con1) {
        if(!err1){
            con1.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0){
                        let arrayOfData = [];
                        arrayOfData.push(['Name', 'Display Name', 'Group Name', 'Group Display Name']);
                        for(let j = 0; j < rows.length; j++){
                            arrayOfData.push([rows[j].name, rows[j].display_name, rows[j].group_name, rows[j].group_display_name]);
                        }
                        var myData = json2xls(arrayOfData);
                        var fileExtension = '.xlsx';
                        var currentDate = dates._generateDateFormat('','yyyy_mm_dd_hh_ii_ss');
                        var filename = 'UserRight_' + currentDate + fileExtension;
                        var path = dir.fileDir + "/UserRight/" + filename;
                        fs.writeFile(path, myData, 'binary', function(ress){
                            console.log(ress);
                        });
                        var jsonObject = {};
                        jsonObject['status'] = "1";
                        jsonObject['message'] = rows.length + " UserRights Exported Successfully";
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
}

// Count UserRight
function countUserRight(req, res) {
    var sql = `select count(id) as count from user_right`;
    console.log("countUserRight sql  \n\n" +sql)
    pool.getConnection(function (err1, con1){
        if(!err1){
            con1.query(sql,function(err, rows){
                if (!err){
                    var jsonObject = {};
                    jsonObject["status"] = "1";
                    jsonObject["message"] = "Count Found Successfully";
                    jsonObject["data"] = rows[0].count;
                    res.send(jsonObject);
                } else {
                    var jsonObject = {};
                    jsonObject["status"] = "0";
                    jsonObject["message"] = "DB : " + err;
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

// Pagination Call UserRight 
function getUserRightDetailsPg(req,res) {
    var item_per_page = parseInt(req.body.items_per_page);
    var page_no = (parseInt(req.body.page_no) - 1);
    var offset = parseInt(page_no * item_per_page);
    var limit = '';
    if(item_per_page > 0) {
        limit = ' limit ' + offset + ' , ' + item_per_page ;
        var sql = ` select 
                        id,
                        display_name,
                        group_display_name,
                        group_name,
                        modify_date,
                        name,
                        status
                    from user_right 
                    order by name ` + limit;
        console.log("getUserRightDetailsPg sql  \n\n" +sql)
        pool.getConnection(function(err1, con1){
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if(!err) {
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        if(rows.length === 0 ){
                            jsonObject["data"] = [];
                        } else {
                            jsonObject["data"] = rows;
                        }
                        res.send(jsonObject);
                    } else{
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
        jsonObject["message"] = "PerPage and Page Number is required & must valid integer";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

// Search UserRight 
function searchUserRight(req,res) {
    var search_string = req.body.search_string;
    var where = '';
    if(search_string.length > 0 ){
        where = `where name like '%`+ search_string +`%'`;
    }
    var sql = ` select
                    id,
                    display_name,
                    group_display_name,
                    group_name,
                    modify_date,
                    name,
                    status
                from user_right 
                `+ where +`
                order by name limit 100`;
    console.log("searchUserRight sql ===> " + sql)
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

// Search UserRight 
function searchDuplicateUserRight(req,res) {
    var search_string = req.body.search_string ? req.body.search_string : '';
    var where = '';
    console.log("search_string ------------------>  " + search_string)
    console.log(req.body);
    if(search_string){
        where = `and name ='`+ search_string +`'`;
    }
    var sql = ` select
                    id,
                    display_name,
                    group_display_name,
                    group_name,
                    modify_date,
                    name,
                    status
                from user_right 
                where status = 1 `+ where +`
                order by name limit 100`;
    console.log("searchUserRight sql ===> " + sql)
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

// insertUserRoleToRight
function registerUserRoleToRight(req, res){
    var data = {
        role_id: req.body.userRole, 
        right: req.body.right,
    }; 
    if(data.role_id != '' && data.role_id != null && data.role_id != undefined && data.right != "" && data.right != undefined && data.right != null && data.right.length > 0){
        let sql = `delete from user_role_to_right where user_role_id = ` + data.role_id;
        pool.getConnection(function (err1, con1) {
            if(!err1){
                con1.query(sql, function(err, rows) {
                    if (!err){
                        var object = data.right;
                        var array = [];
                        for(i = 0; i< object.length; i++) {
                            if(object[i].read == 1 || 
                               object[i].write == 1 || 
                               object[i].delete == 1 ||
                               object[i].import == 1 || 
                               object[i].export == 1 ){
                                array.push([data.role_id, object[i].id, object[i].read, object[i].write, object[i].delete, object[i].import, object[i].export]);
                            }
                        }
                        if(array.length > 0){
                            let sql1 = "insert into user_role_to_right(`user_role_id`, `user_right`, `read`, `write`, `delete`, `import`, `export`) values ?";
                            pool.getConnection(function (err2, con3) {
                                if(!err2){
                                    con3.query(sql1,[array],function(err3, rows1) {
                                        if (!err3) {
                                            var jsonObject = {};
                                            jsonObject["status"] = "1";
                                            jsonObject["message"] = "Rights Allocated Successfully";
                                            jsonObject["data"] = rows1.insertId;
                                            res.send(jsonObject);
                                            /* var key = 'user_role_to_right_for_' + req.body.userRole;
                                            var master_key = req.body.userRole;
                                            cache._removeRedisKeys('', key);
                                            cache._removeMasterKeys(master_key);
                                            //res.send(jsonObject);
                                            informUsers(data.role_id)
                                            .then(function(resPush){
                                                console.log("informUsers result resPush")
                                                console.log(resPush)
                                                if(resPush.status == 1){
                                                    var jsonObject = {};
                                                    jsonObject["status"] = "1";
                                                    jsonObject["message"] = "Rights Allocated Successfully";
                                                    jsonObject["data"] = rows1.insertId;
                                                    res.send(jsonObject);
                                                }else {
                                                    var jsonObject = {};
                                                    jsonObject["status"] = "0";
                                                    jsonObject["message"] = resPush.data;
                                                    jsonObject["data"] = [];
                                                    res.send(jsonObject);
                                                }
                                            }); */
                                        }
                                        else {
                                            var jsonObject = {};
                                            jsonObject["status"] = "0";
                                            jsonObject["message"] = "DB "+ err3;
                                            jsonObject["data"] = [];
                                            res.send(jsonObject);
                                        }
                                        con3.release();
                                    });
                                }else {
                                    var jsonObject = {};
                                    jsonObject["status"] = "0";
                                    jsonObject["message"] = "CON :" + err2;
                                    jsonObject["data"] = [];
                                    res.send(jsonObject);
                                }
                            });
                        }else {
                            var jsonObject = {};
                            jsonObject["status"] = "1";
                            jsonObject["message"] = "Rights Allocated Successfully";
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
        jsonObject["message"] = "User Rights and Role Id are Required";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

//  Get UserRight 
function getUserRoleToRight(req, res){
    var role_id = req.body.userRole;
    if (role_id != undefined && role_id != '' && role_id){
        var sql1 = ` select 
                        ur.id as role_id, 
                        ur.name as role_name, 
                        urr.name, 
                        urr.id, 
                        urr.display_name, 
                        urtr.read, 
                        urtr.write, 
                        urtr.delete, 
                        urtr.import,
                        urtr.export
                    from user_right as urr 
                    join user_role_to_right as urtr on urtr.user_right = urr.id 
                    join user_role as ur on ur.id = urtr.user_role_id and urtr.user_role_id =`+ role_id +`
                    where ur.id = `+ role_id +` group by urtr.id`;
        pool.getConnection(function (err1, con1){
            if(!err1){
                con1.query(sql1, function(err, rows){
                    if (!err){
                        var jsonObject = {};
                        jsonObject["status"] = "1";
                        jsonObject["message"] = rows.length + " Records found";
                        jsonObject["data"] = rows;
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
        jsonObject["message"] = "please select user role first";
        jsonObject["data"] = [];
        res.send(jsonObject);
    }
}

var checkDuplicateRole = function(name){
    return new Promise(function(resolve){
        var sql = `select count(id) as count from user_role where name in(`+ name + `) and status = 1`;
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

var checkDuplicateRight = function(name){
    return new Promise(function(resolve){
        var sql = `select count(id) as count from user_right where name in(`+ name +`)  and status = 1`;
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


module.exports = router;