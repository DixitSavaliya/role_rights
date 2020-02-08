var dateNow = new Date();
var dd = addZero(dateNow.getDate());
var monthSingleDigit = dateNow.getMonth() + 1;
var mm = addZero(monthSingleDigit);
var yy = dateNow.getFullYear().toString();
var hh = addZero(dateNow.getHours().toString());
var ii = addZero(dateNow.getMinutes().toString());
var ss = addZero(dateNow.getSeconds().toString());
var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
var ampm = hh > 12 ? 'pm' : 'am';
var twentyHourTime = hh;
if(hh > 12){
    twentyHourTime = addZero((parseInt(hh) - 12));
}
var timestamp = yy +'-'+ mm +'-'+ dd +' '+ twentyHourTime +':'+ ii +':'+ ss + ', ' +ampm;
console.log('application starting time ==> '+ timestamp);


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function _generateTimes(date, units, interval) {
    var ret = date ? new Date(date) : new Date(); //don't change original date
    /*console.log('newDate');
    console.log(ret);
    console.log('units');
    console.log(units);
    console.log('interval');
    console.log(interval);*/
    var newDate = date ? new Date(date) : new Date();
    var checkRollover = function() { if(ret.getDate() != newDate.getDate())ret.setDate(0);};
    switch(units.toLowerCase()) {
        case 'year'   :  ret.setFullYear(ret.getFullYear() + parseInt(interval)); checkRollover();  break;
        case 'quarter':  ret.setMonth(ret.getMonth() + (3*parseInt(interval))); checkRollover();  break;
        case 'month'  :  ret.setMonth(ret.getMonth() + parseInt(interval)); checkRollover();  break;
        case 'week'   :  ret.setDate(ret.getDate() + (7*parseInt(interval)));  break;
        case 'day'    :  ret.setDate(ret.getDate() + parseInt(interval));  break;
        case 'hour'   :  ret.setTime(ret.getTime() + (parseInt(interval)*3600000));  break;
        case 'minute' :  ret.setTime(ret.getTime() + (parseInt(interval)*60000));  break;
        case 'second' :  ret.setTime(ret.getTime() + (parseInt(interval)*1000));  break;
        default       :  ret = undefined;  break;
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    var dd = addZero(ret.getDate().toString());
    var monthSingleDigit = ret.getMonth() + 1;
    var mm = addZero(monthSingleDigit);
    var yy = ret.getFullYear().toString();
    var hh = addZero(ret.getHours().toString());
    var ii = addZero(ret.getMinutes().toString());
    var ss = addZero(ret.getSeconds().toString());
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    /*console.log('new date time ===>   ' + timestamp);*/
    return timestamp;
}

function _generateDate(date, units, interval, format) {
    var ret = date ? new Date(date) : new Date(); //don't change original date
    /*console.log('newDate');
    console.log(ret);*/
    var newDate = date ? new Date(date) : new Date();
    var checkRollover = function() { if(ret.getDate() != newDate.getDate())ret.setDate(0);};
    switch(units.toLowerCase()) {
        case 'year'   :  ret.setFullYear(ret.getFullYear() + parseInt(interval)); checkRollover();  break;
        case 'quarter':  ret.setMonth(ret.getMonth() + (3*parseInt(interval))); checkRollover();  break;
        case 'month'  :  ret.setMonth(ret.getMonth() + parseInt(interval)); checkRollover();  break;
        case 'week'   :  ret.setDate(ret.getDate() + (7*parseInt(interval)));  break;
        case 'day'    :  ret.setDate(ret.getDate() + parseInt(interval));  break;
        case 'hour'   :  ret.setTime(ret.getTime() + (parseInt(interval)*3600000));  break;
        case 'minute' :  ret.setTime(ret.getTime() + (parseInt(interval)*60000));  break;
        case 'second' :  ret.setTime(ret.getTime() + (parseInt(interval)*1000));  break;
        default       :  ret = undefined;  break;
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    var dd = addZero(ret.getDate().toString());
    var monthSingleDigit = ret.getMonth() + 1;
    var mm = addZero(monthSingleDigit);
    var yy = ret.getFullYear().toString();
    var hh = addZero(ret.getHours().toString());
    var ii = addZero(ret.getMinutes().toString());
    var ss = addZero(ret.getSeconds().toString());
   var ms = addZero(ret.getMilliseconds().toString());
    var ampm = hh > 12 ? 'pm' : 'am';
    var twentyHourTime = hh;
    if(hh > 12){
        twentyHourTime = addZero((parseInt(hh) - 12));
    }
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    if(format.length >= 4){
        switch(format.toLowerCase()) {
            case 'hh:ii ap, dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii + ' ' + ampm + ', ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'hh:ii ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii + ' ' + ampm + ' ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'hh:ii:ss ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii +':'+ ss + ' ' + ampm + ' ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'dd-mm-yyyy hh:ii:ss,ap'  : timestamp =  dd +'-'+ mm +'-'+ yy +' '+ twentyHourTime +':'+ ii +':'+ ss + ', ' + ampm; break;
            case 'hh:ii:ss,ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii +':'+ ss +', '+ ampm +' '+ dd +'-'+ mm +'-'+ yy; break;
            case 'dd-mm-yyyy hh:ii:ss:ms'  : timestamp = dd +'-'+ mm +'-'+ yy +' '+ hh +':'+ ii +':'+ ss +':'+ ms; break;
            case 'dd-mm-yyyy hh:ii:ss'  : timestamp = dd +'-'+ mm +'-'+ yy +' '+ hh +':'+ ii +':'+ ss; break;
            case 'yyyy-mm-dd hh:ii:ss'  : timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss; break;
            case 'yyyy_mm_dd_hh_ii_ss'  : timestamp = yy +'_'+ mm +'_'+ dd +'_'+ hh +'_'+ ii +'_'+ ss; break;
            case 'dd-mm-yyyy'           : timestamp = dd +'-'+ mm +'-'+ yy; break;
            case 'mm/dd/yyyy'           : timestamp = mm +'/'+ dd +'/'+ yy; break;
            case 'dd:mm:yyyy'           : timestamp = dd +':'+ mm +':'+ yy; break;
            case 'dd_mm_yyyy'           : timestamp = dd +'_'+ mm +'_'+ yy; break;
            case 'yyyy_mm_dd'           : timestamp = yy +'_'+ mm +'_'+ dd; break;
            case 'yyyy-mm-dd'           : timestamp = yy +'-'+ mm +'-'+ dd; break;
            case 'yyyy:mm:dd'           : timestamp = yy +'-'+ mm +'-'+ dd; break;
            case 'yyyy'                 : timestamp = yy; break;
            default                     : break;
        }
    }
    return timestamp;
}

function _generateTimeStamp(date) {
    var ret = (date) ? new Date(date) : new Date();
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    var dd = addZero(ret.getDate());
    var monthSingleDigit = ret.getMonth() + 1;
    var mm = addZero(monthSingleDigit);
    var yy = ret.getFullYear().toString();
    var hh = addZero(ret.getHours().toString());
    var ii = addZero(ret.getMinutes().toString());
    var ss = addZero(ret.getSeconds().toString());
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    return timestamp;
}

function _generateDateFormat(date, format) {
    var ret = (date) ? new Date(date) : new Date();
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    var dd = addZero(ret.getDate());
    var monthSingleDigit = ret.getMonth() + 1;
    var mm = addZero(monthSingleDigit);
    var yy = ret.getFullYear().toString();
    var hh = addZero(ret.getHours().toString());
    var ii = addZero(ret.getMinutes().toString());
    var ss = addZero(ret.getSeconds().toString());
    var ms = addZero(ret.getMilliseconds().toString());
    var ampm = hh > 12 ? 'pm' : 'am';
    var twentyHourTime = hh;
    if(hh > 12){
        twentyHourTime = addZero((parseInt(hh) - 12));
    }
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    if(format.length >= 4){
        switch(format.toLowerCase()) {
            case 'hh:ii ap, dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii + ' ' + ampm + ', ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'hh:ii ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii + ' ' + ampm + ' ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'hh:ii:ss ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii +':'+ ss + ' ' + ampm + ' ' + dd +'-'+ mm +'-'+ yy ; break;
            case 'dd-mm-yyyy hh:ii:ss,ap'  : timestamp =  dd +'-'+ mm +'-'+ yy +' '+ twentyHourTime +':'+ ii +':'+ ss + ', ' + ampm; break;
            case 'hh:ii:ss,ap dd-mm-yyyy'  : timestamp =  twentyHourTime +':'+ ii +':'+ ss +', '+ ampm +' '+ dd +'-'+ mm +'-'+ yy; break;
            case 'dd-mm-yyyy hh:ii:ss:ms'  : timestamp = dd +'-'+ mm +'-'+ yy +' '+ hh +':'+ ii +':'+ ss +':'+ ms; break;
            case 'dd-mm-yyyy hh:ii:ss'  : timestamp = dd +'-'+ mm +'-'+ yy +' '+ hh +':'+ ii +':'+ ss; break;
            case 'yyyy-mm-dd hh:ii:ss'  : timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss; break;
            case 'yyyy_mm_dd_hh_ii_ss'  : timestamp = yy +'_'+ mm +'_'+ dd +'_'+ hh +'_'+ ii +'_'+ ss; break;
            case 'mm-dd-yyyy'           : timestamp = mm +'-'+ dd +'-'+ yy; break;
            case 'mm/dd/yyyy'           : timestamp = mm +'/'+ dd +'/'+ yy; break;
            case 'dd-mm-yyyy'           : timestamp = dd +'-'+ mm +'-'+ yy; break;
            case 'dd:mm:yyyy'           : timestamp = dd +':'+ mm +':'+ yy; break;
            case 'dd_mm_yyyy'           : timestamp = dd +'_'+ mm +'_'+ yy; break;
            case 'yyyy_mm_dd'           : timestamp = yy +'_'+ mm +'_'+ dd; break;
            case 'yyyy-mm-dd'           : timestamp = yy +'-'+ mm +'-'+ dd; break;
            case 'yyyy:mm:dd'           : timestamp = yy +'-'+ mm +'-'+ dd; break;
            case 'yyyy'                 : timestamp = yy; break;
            default                     : break;
        }
    }
    return timestamp;
}

function generate_token(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var special = "$*(){}".split("")
    var b = [];  
    for (var i = 0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        if(i == length/2){
          var c = (Math.random() * (special.length-1)).toFixed(0);
          console.log("a[c] ------> " + special[c])
          b[i] = special[c];
        }else {
          b[i] = a[j];
        }   
	}
	console.log("salt ----------------------------------> b.join('')" + b.join(''))
    return b.join("");
}

function generate_img_name(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i = 0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

function _generate_otp(length){
    var a = "1234567890".split("");
    var b = [];  
    for (var i = 0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

function _getDifference(from_date, to_date){
    var date1 = from_date ? new Date(from_date) : new Date();
    var date2 = to_date ? new Date(to_date) : new Date();
    var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays;
}

function _generateYearMonth(units, interval) {
    var ret = new Date(); //don't change original date
    /*console.log('newDate');
    console.log(ret);*/
    var newDate = new Date();
    var checkRollover = function() { if(ret.getDate() != newDate.getDate())ret.setDate(0);};
    if(units == 'm'){
        ret.setMonth(ret.getMonth() + parseInt(interval));
        checkRollover();
    }else {
        ret.setFullYear(ret.getFullYear() + parseInt(interval));
        checkRollover();
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    var dd = addZero(ret.getDate().toString());
    var monthSingleDigit = ret.getMonth() + 1;
    var mm = addZero(monthSingleDigit);
    var yy = ret.getFullYear().toString();
    var hh = addZero(ret.getHours().toString());
    var ii = addZero(ret.getMinutes().toString());
    var ss = addZero(ret.getSeconds().toString());
    var timestamp = yy +'-'+ mm +'-'+ dd +' '+ hh +':'+ ii +':'+ ss;
    /*console.log('new date time ===>   ' + timestamp);*/
    return yy;
}

function _getDayMonthYear(date, type, format) {
    var nDate = date != undefined && date ? new Date(date) : new Date();
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var day = nDate.getDay();
    var month = nDate.getMonth();
    var yy = nDate.getFullYear().toString();
    var result;
    if(format == '1' && format != undefined){
        if(type == 'd'){
            result = day;
        }else if(type == 'm'){
            result = month + 1;
        }else {
            result = yy;
        }
    }else if(format == '2' && format != undefined){
        if(type == 'd'){
            result = days[day];
        }else if(type == 'm'){
            result = months[month];
        }else {
            result = yy;
        }
    }else {
        if(type == 'd'){
            result = day;
        }else if(type == 'm'){
            result = month + 1;
        }else {
            result = yy;
        }
    }
    //console.log('result ===>   ' + result);
    return result;
}

function _getDayMonthName(data, type) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var result;
    if(type == 'd'){
        result = days[data];
    }else {
        result = months[(data - 1)];
    }
    //console.log('result ===>   ' + result);
    return result;
}

function _getCurrentDateMonthYear(date, type) {
    var nDate = date != undefined && date ? new Date(date) : new Date();
    var day = nDate.getDate();
    var month = nDate.getMonth();
    var yy = nDate.getFullYear().toString();
    var result;
    if(type == 'd'){
        result = day;
    }else if(type == 'm'){
        result = month + 1;
    }else {
        result = yy;
    }
    //console.log('result ===>   ' + result);
    return result;
}

function _isBetween(date, from_date, to_date){
  var date1 = from_date ? new Date(from_date) : new Date();
  var date2 = to_date ? new Date(to_date) : new Date();
  var date3 = date ? new Date(date) : new Date();
  date1 = _generateDateFormat(date1, 'mm/dd/yyyy');
  date2 = _generateDateFormat(date2, 'mm/dd/yyyy');
  date3 = _generateDateFormat(date3, 'mm/dd/yyyy');
  /* console.log("_isBetween date1 ==> " + date1);
  console.log("_isBetween date2 ==> " + date2);
  console.log("_isBetween date3 ==> " + date3); */
  var d1 = date1.split("/");
  var d2 = date2.split("/");
  var d3 = date3.split("/");
  /* console.log("_isBetween d1 ==> \n\r\t");
  console.log(d1)
  console.log("_isBetween d2 ==> \n\r\t");
  console.log(d2)
  console.log("_isBetween d3 ==> \n\r\t");
  console.log(d3) */
  // -1 because months are from 0 to 11
  var fromD = new Date(d1[2], parseInt(d1[0])-1, d1[1]);
  var toD   = new Date(d2[2], parseInt(d2[0])-1, d2[1]);
  var checkD = new Date(d3[2], parseInt(d3[0])-1, d3[1]);
  fromD = _generateDateFormat(fromD, 'yyyy-mm-dd')
  toD = _generateDateFormat(toD, 'yyyy-mm-dd')
  checkD = _generateDateFormat(checkD, 'yyyy-mm-dd')
  /* console.log("_isBetween fromD ==> " + fromD);
  console.log("_isBetween toD ==> " + toD);
  console.log("_isBetween checkD ==> " + checkD);

  console.log("_isBetween (checkD >= fromD) ==> " + (checkD >= fromD));
  console.log("_isBetween (checkD <= toD) ==> " + (checkD <= toD)); */
  var isValid = false;
  if(checkD >= fromD && checkD <= toD){
      isValid = true;
  }
  console.log("_isBetween ? \t ==> " + isValid);
  return isValid;
}

function generateSecretKey(data){
    var pubKey = data.doctor_id + '_' +  data.type + '_' + data.create_date;
    var key = encode(pubKey);
    console.log("endcoded key =========> " + key)
    console.log("decoded key =========> " + decode(key))
    return key;
}

function encode(data){
    /*if(data.length != 46){
        data += '.'+ _generate_otp(45 - (data.length));
    }*/
    let buff = '';
    let step1 = '';
    //buff = new Buffer(data); //cuz of deprecated
    buff = Buffer.from(data);
    step1 = buff.toString('base64');
    return step1;
}

function decode(data = ''){
    let buff = '';
    let step1 = '';
    //buff = new Buffer(data, 'base64'); //cuz of deprecated
    buff = Buffer.from(data, 'base64');
    step1 = buff.toString('ascii');
    var spliting = step1.split('.');
    if(spliting && spliting[1] != undefined){
        return spliting[0];
    }else {
        return step1;
    }
}

function substr_replace (str, replace, start, length) { 
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/substr_replace/
    // original by: Brett Zamir (http://brett-zamir.me)
    //   example 1: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0)
    //   returns 1: 'bob'
    //   example 2: var $var = 'ABCDEFGH:/MNRPQR/'
    //   example 2: substr_replace($var, 'bob', 0, $var.length)
    //   returns 2: 'bob'
    //   example 3: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0, 0)
    //   returns 3: 'bobABCDEFGH:/MNRPQR/'
    //   example 4: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 10, -1)
    //   returns 4: 'ABCDEFGH:/bob/'
    //   example 5: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', -7, -1)
    //   returns 5: 'ABCDEFGH:/bob/'
    //   example 6: substr_replace('ABCDEFGH:/MNRPQR/', '', 10, -1)
    //   returns 6: 'ABCDEFGH://'

  if (start < 0) {
    // start position in str
    start = start + str.length
  }
  length = length !== undefined ? length : str.length
  if (length < 0) {
    length = length + str.length - start
  }

  return [
    str.slice(0, start),
    replace.substr(0, length),
    replace.slice(length),
    str.slice(start + length)
  ].join('')
}

function rand (min, max) {
  //  discuss at: http://locutus.io/php/rand/
  // original by: Leslie Hoare
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      note 1: See the commented out code below for a version which
  //      note 1: will work with our experimental (though probably unnecessary)
  //      note 1: srand() function)
  //   example 1: rand(1, 1)
  //   returns 1: 1

  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function stringHasDomain(string, appDomain){

    return new RegExp( '\\b' + appDomain + '\\b', 'i').test(string);
}

function utf8_encode(s) {
    var x = '';
    if(s){
        x = encodeURIComponent(s);
        if(x){
            unescape(x);
        }
    }
  return x;
}

function utf8_decode(s) {

  return decodeURIComponent(escape(s));
}

function base64_decode(data) {  
    // Decodes string using MIME base64 algorithm
    // mozilla has this native  
    // - but breaks in 2.0.0.12!  
    //if (typeof window['btoa'] == 'function') {  
    //    return btoa(data);  
    //}  
  
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";  
    var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0, dec = "", tmp_arr = [];  
  
    if (!data) {  
        return data;  
    }  
  
    data += '';  
  
    do {  // unpack four hexets into three octets using index points in b64  
        h1 = b64.indexOf(data.charAt(i++));  
        h2 = b64.indexOf(data.charAt(i++));  
        h3 = b64.indexOf(data.charAt(i++));  
        h4 = b64.indexOf(data.charAt(i++));  
  
        bits = h1<<18 | h2<<12 | h3<<6 | h4;  
  
        o1 = bits>>16 & 0xff;  
        o2 = bits>>8 & 0xff;  
        o3 = bits & 0xff;  
  
        if (h3 == 64) {  
            tmp_arr[ac++] = String.fromCharCode(o1);  
        } else if (h4 == 64) {  
            tmp_arr[ac++] = String.fromCharCode(o1, o2);  
        } else {  
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);  
        }  
    } while (i < data.length);  
  
    dec = tmp_arr.join('');  
    dec = utf8_decode(dec);  
  
    return dec;  
}  

function base64_encode( data ) {  
    // Encodes string using MIME base64 algorithm    
    //   
    // version: 902.2516  
    // discuss at: http://phpjs.org/functions/base64_encode  
    // +   original by: Tyler Akins (http://rumkin.com)  
    // +   improved by: Bayron Guevara  
    // +   improved by: Thunder.m  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +   bugfixed by: Pellentesque Malesuada  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // -    depends on: utf8_encode  
    // *     example 1: base64_encode('Kevin van Zonneveld');  
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='  
    // mozilla has this native  
    // - but breaks in 2.0.0.12!  
    //if (typeof window['atob'] == 'function') {  
    //    return atob(data);  
    //}  
          
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";  
    var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0, enc="", tmp_arr = [];  
  
    if (!data) {  
        return data;  
    }  
  
    data = utf8_encode(data+'');  
      
    do { // pack three octets into four hexets  
        o1 = data.charCodeAt(i++);  
        o2 = data.charCodeAt(i++);  
        o3 = data.charCodeAt(i++);  
  
        bits = o1<<16 | o2<<8 | o3;  
  
        h1 = bits>>18 & 0x3f;  
        h2 = bits>>12 & 0x3f;  
        h3 = bits>>6 & 0x3f;  
        h4 = bits & 0x3f;  
  
        // use hexets to index into b64, and append result to encoded string  
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);  
    } while (i < data.length);  
      
    enc = tmp_arr.join('');  
      
    switch( data.length % 3 ){  
        case 1:  
            enc = enc.slice(0, -2) + '==';  
        break;  
        case 2:  
            enc = enc.slice(0, -1) + '=';  
        break;  
    }  
  
    return enc;  
}

function get_meta_tags(file) {  
    // Extracts all meta tag content attributes from a file and returns an array    
    //   
    // version: 901.1411  
    // discuss at: http://phpjs.org/functions/get_meta_tags  
    // +   original by: Brett Zamir  
    // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.  
    // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.  
    // -    depends on: file_get_contents  
    // *     example 1: get_meta_tags('http://kevin.vanzonneveld.net/pj_test_supportfile_2.htm');  
    // *     returns 1: {description: 'a php manual', author: 'name', keywords: 'php documentation', 'geo_position': '49.33;-86.59'}  
    var fulltxt = '';  
  
    if (false) {  
        // Use this for testing instead of the line above:  
        fulltxt = '<meta name="author" content="name">'+  
        '<meta name="keywords" content="php documentation">'+  
        '<meta name="DESCRIPTION" content="a php manual">'+  
        '<meta name="geo.position" content="49.33;-86.59">'+  
        '</head>';  
    } else {  
        fulltxt = file_get_contents(file).match(/^[^]*<\/head>/i);  
    }  
      
    var patt = /<meta[^>]*?>/gim;  
    var patt1 = /<meta\s+.*?name\s*=\s*(['"]?)(.*?)\1\s+.*?content\s*=\s*(['"]?)(.*?)\3/gim;  
    var patt2 = /<meta\s+.*?content\s*=\s*(['"?])(.*?)\1\s+.*?name\s*=\s*(['"]?)(.*?)\3/gim;  
    var txt, match, name, arr={};  
  
    while ((txt = patt.exec(fulltxt)) != null) {  
        while ((match = patt1.exec(txt)) != null) {  
            name = match[2].replace(/\W/g, '_').toLowerCase();  
            arr[name] = match[4];  
        }  
        while ((match = patt2.exec(txt)) != null) {  
            name = match[4].replace(/\W/g, '_').toLowerCase();  
            arr[name] = match[2];  
        }  
    }  
    return arr;  
}

function http_build_query( formdata, numeric_prefix, arg_separator ) {  
    // Generates a form-encoded query string from an associative array or object.    
    //   
    // version: 810.114  
    // discuss at: http://phpjs.org/functions/http_build_query  
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +   improved by: Legaev Andrey  
    // +   improved by: Michael White (http://getsprink.com)  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // -    depends on: urlencode  
    // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');  
    // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'  
    // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');  
    // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'  
    var key, use_val, use_key, i = 0, j=0, tmp_arr = [];  
  
    if (!arg_separator) {  
        arg_separator = '&';  
    }  
  
    for (key in formdata) {  
        use_val = urlencode(formdata[key].toString());  
        use_key = urlencode(key);  
  
        if (numeric_prefix && !isNaN(key)) {  
            use_key = numeric_prefix + j;  
            j++;  
        }  
        tmp_arr[i++] = use_key + '=' + use_val;  
    }  
  
    return tmp_arr.join(arg_separator);  
}

function rawurldecode( str ) {  
    // Decodes URL-encodes string    
    //   
    // version: 901.1411  
    // discuss at: http://phpjs.org/functions/rawurldecode  
    // +   original by: Brett Zamir  
    // *     example 1: rawurldecode('Kevin+van+Zonneveld%21');  
    // *     returns 1: 'Kevin+van+Zonneveld!'  
    // *     example 2: rawurldecode('http%3A%2F%2Fkevin.vanzonneveld.net%2F');  
    // *     returns 2: 'http://kevin.vanzonneveld.net/'  
    // *     example 3: rawurldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a');  
    // *     returns 3: 'http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'  
    var histogram = {};  
    var ret = str.toString();   
  
    var replacer = function(search, replace, str) {  
        var tmp_arr = [];  
        tmp_arr = str.split(search);  
        return tmp_arr.join(replace);  
    };  
  
    // The histogram is identical to the one in urlencode.  
    histogram["'"]   = '%27';  
    histogram['(']   = '%28';  
    histogram[')']   = '%29';  
    histogram['*']   = '%2A';  
    histogram['~']   = '%7E';  
    histogram['!']   = '%21';  
  
    for (replace in histogram) {  
        search = histogram[replace]; // Switch order when decoding  
        ret = replacer(search, replace, ret) // Custom replace. No regexing  
    }  
  
    // End with decodeURIComponent, which most resembles PHP's encoding functions  
    ret = decodeURIComponent(ret);  
  
    return ret;  
}

function rawurlencode( str ) {  
    // URL-encodes string    
    //   
    // version: 901.1411  
    // discuss at: http://phpjs.org/functions/rawurlencode  
    // +   original by: Brett Zamir  
    // *     example 1: rawurlencode('Kevin van Zonneveld!');  
    // *     returns 1: 'Kevin van Zonneveld%21'  
    // *     example 2: rawurlencode('http://kevin.vanzonneveld.net/');  
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'  
    // *     example 3: rawurlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');  
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'  
   
    var histogram = {}, tmp_arr = [];  
    var ret = str.toString();  
  
    var replacer = function(search, replace, str) {  
        var tmp_arr = [];  
        tmp_arr = str.split(search);  
        return tmp_arr.join(replace);  
    };  
  
    // The histogram is identical to the one in urldecode.  
    histogram["'"]   = '%27';  
    histogram['(']   = '%28';  
    histogram[')']   = '%29';  
    histogram['*']   = '%2A';   
    histogram['~']   = '%7E';  
    histogram['!']   = '%21';  
  
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions  
    ret = encodeURIComponent(ret);  
  
    // Restore spaces, converted by encodeURIComponent which is not rawurlencode compatible  
    ret = replacer('%20', ' ', ret); // Custom replace. No regexing  
  
    for (search in histogram) {  
        replace = histogram[search];  
        ret = replacer(search, replace, ret) // Custom replace. No regexing  
    }  
  
    // Uppercase for full PHP compatibility  
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {  
        return "%"+m2.toUpperCase();  
    });  
  
    return ret;  
}

function json_decode(str_json) {  
    // Decodes the JSON representation into a PHP value    
    //   
    // version: 901.2515  
    // discuss at: http://phpjs.org/functions/json_decode  
    // +      original by: Public Domain (http://www.json.org/json2.js)  
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // *     example 1: json_decode('[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]');  
    // *     returns 1: ['e', {pluribus: 'unum'}]  
    /* 
        http://www.JSON.org/json2.js 
        2008-11-19 
        Public Domain. 
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
        See http://www.JSON.org/js.html 
    */  
  
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;  
    var j;  
    var text = str_json;  
  
    var walk = function(holder, key) {  
        // The walk method is used to recursively walk the resulting structure so  
        // that modifications can be made.  
        var k, v, value = holder[key];  
        if (value && typeof value === 'object') {  
            for (k in value) {  
                if (Object.hasOwnProperty.call(value, k)) {  
                    v = walk(value, k);  
                    if (v !== undefined) {  
                        value[k] = v;  
                    } else {  
                        delete value[k];  
                    }  
                }  
            }  
        }  
        return reviver.call(holder, key, value);  
    }  
  
    // Parsing happens in four stages. In the first stage, we replace certain  
    // Unicode characters with escape sequences. JavaScript handles many characters  
    // incorrectly, either silently deleting them, or treating them as line endings.  
    cx.lastIndex = 0;  
    if (cx.test(text)) {  
        text = text.replace(cx, function (a) {  
            return '\\u' +  
            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);  
        });  
    }  
  
    // In the second stage, we run the text against regular expressions that look  
    // for non-JSON patterns. We are especially concerned with '()' and 'new'  
    // because they can cause invocation, and '=' because it can cause mutation.  
    // But just to be safe, we want to reject all unexpected forms.  
  
    // We split the second stage into 4 regexp operations in order to work around  
    // crippling inefficiencies in IE's and Safari's regexp engines. First we  
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we  
    // replace all simple value tokens with ']' characters. Third, we delete all  
    // open brackets that follow a colon or comma or that begin the text. Finally,  
    // we look to see that the remaining characters are only whitespace or ']' or  
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.  
    if (/^[\],:{}\s]*$/.  
        test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').  
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').  
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {  
  
        // In the third stage we use the eval function to compile the text into a  
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity  
        // in JavaScript: it can begin a block or an object literal. We wrap the text  
        // in parens to eliminate the ambiguity.  
  
        j = eval('(' + text + ')');  
  
        // In the optional fourth stage, we recursively walk the new structure, passing  
        // each name/value pair to a reviver function for possible transformation.  
  
        return typeof reviver === 'function' ?  
        walk({  
            '': j  
        }, '') : j;  
    }  
  
    // If the text is not JSON parseable, then a SyntaxError is thrown.  
    throw new SyntaxError('json_decode');  
}

function json_encode(mixed_val) {  
    // Returns the JSON representation of a value    
    //   
    // version: 901.2515  
    // discuss at: http://phpjs.org/functions/json_encode  
    // +      original by: Public Domain (http://www.json.org/json2.js)  
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // *     example 1: json_encode(['e', {pluribus: 'unum'}]);  
    // *     returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'  
    /* 
        http://www.JSON.org/json2.js 
        2008-11-19 
        Public Domain. 
        NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
        See http://www.JSON.org/js.html 
    */  
      
    var indent;  
    var value = mixed_val;  
    var i;  
  
    var quote = function (string) {  
        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;  
        var meta = {    // table of character substitutions  
            '\b': '\\b',  
            '\t': '\\t',  
            '\n': '\\n',  
            '\f': '\\f',  
            '\r': '\\r',  
            '"' : '\\"',  
            '\\': '\\\\'  
        };  
  
        escapable.lastIndex = 0;  
        return escapable.test(string) ?  
        '"' + string.replace(escapable, function (a) {  
            var c = meta[a];  
            return typeof c === 'string' ? c :  
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);  
        }) + '"' :  
        '"' + string + '"';  
    }  
  
    var str = function(key, holder) {  
        var gap = '';  
        var indent = '    ';  
        var i = 0;          // The loop counter.  
        var k = '';          // The member key.  
        var v = '';          // The member value.  
        var length = 0;  
        var mind = gap;  
        var partial = [];  
        var value = holder[key];  
  
        // If the value has a toJSON method, call it to obtain a replacement value.  
        if (value && typeof value === 'object' &&  
            typeof value.toJSON === 'function') {  
            value = value.toJSON(key);  
        }  
          
        // What happens next depends on the value's type.  
        switch (typeof value) {  
            case 'string':  
                return quote(value);  
  
            case 'number':  
                // JSON numbers must be finite. Encode non-finite numbers as null.  
                return isFinite(value) ? String(value) : 'null';  
  
            case 'boolean':  
            case 'null':  
                // If the value is a boolean or null, convert it to a string. Note:  
                // typeof null does not produce 'null'. The case is included here in  
                // the remote chance that this gets fixed someday.  
  
                return String(value);  
  
            case 'object':  
                // If the type is 'object', we might be dealing with an object or an array or  
                // null.  
                // Due to a specification blunder in ECMAScript, typeof null is 'object',  
                // so watch out for that case.  
                if (!value) {  
                    return 'null';  
                }  
  
                // Make an array to hold the partial results of stringifying this object value.  
                gap += indent;  
                partial = [];  
  
                // Is the value an array?  
                if (Object.prototype.toString.apply(value) === '[object Array]') {  
                    // The value is an array. Stringify every element. Use null as a placeholder  
                    // for non-JSON values.  
  
                    length = value.length;  
                    for (i = 0; i < length; i += 1) {  
                        partial[i] = str(i, value) || 'null';  
                    }  
  
                    // Join all of the elements together, separated with commas, and wrap them in  
                    // brackets.  
                    v = partial.length === 0 ? '[]' :  
                    gap ? '[\n' + gap +  
                    partial.join(',\n' + gap) + '\n' +  
                    mind + ']' :  
                    '[' + partial.join(',') + ']';  
                    gap = mind;  
                    return v;  
                }  
  
                // Iterate through all of the keys in the object.  
                for (k in value) {  
                    if (Object.hasOwnProperty.call(value, k)) {  
                        v = str(k, value);  
                        if (v) {  
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);  
                        }  
                    }  
                }  
  
                // Join all of the member texts together, separated with commas,  
                // and wrap them in braces.  
                v = partial.length === 0 ? '{}' :  
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +  
                mind + '}' : '{' + partial.join(',') + '}';  
                gap = mind;  
                return v;  
        }  
    };  
  
    // Make a fake root object containing our value under the key of ''.  
    // Return the result of stringifying the value.  
    return str('', {  
        '': value  
    });  
}

function get_headers(url, format) {  
    // fetches all the headers sent by the server in response to a HTTP request    
    //   
    // version: 812.1017  
    // discuss at: http://phpjs.org/functions/get_headers  
    // +   original by: Paulo Ricardo F. Santos  
    // %        note 1: This function uses XmlHttpRequest and cannot retrieve resource from different domain.  
    // %        note 1: Synchronous so may lock up browser, mainly here for study purposes.  
    // *     example 1: get_headers('http://kevin.vanzonneveld.net/pj_test_supportfile_1.htm');  
    // *     returns 1: '123'  
      
    var req = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();  
    if (!req) throw new Error('XMLHttpRequest not supported');  
    var tmp, headers, pair, i;  
  
    req.open('HEAD', url, false);  
    req.send(null);  
  
    if (req.readyState < 3) {  
        return false;  
    }  
  
    tmp = req.getAllResponseHeaders();alert(tmp);  
    tmp = tmp.split('\n');  
    tmp = array_filter(tmp, function (value) { return value.substring(1) != ''; });  
    headers = [req.status + ' ' + req.statusText];  
  
    for (i in tmp) {  
        if (format) {  
            pair = tmp[i].split(':');  
            headers[pair.splice(0, 1)] = pair.join(':').substring(1);  
        } else {  
            headers[headers.length] = tmp[i];  
        }  
    }  
  
    return headers;  
}

function strstr(haystack, needle, bool) {
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);    // *     returns 4: ‘name’
    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle); 
    if (pos == -1) {
        return false;
    } else {
        if (bool) {
            return haystack.substr(0, pos);
        } else {
            return haystack.slice(pos);
        }
    }
}

function strpos (haystack, needle, offset) {
    // Finds first occurrence of a string within another
    //
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/strstr    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strstr(‘Kevin van Zonneveld’, ‘van’);
    // *     returns 1: ‘van Zonneveld’    // *     example 2: strstr(‘Kevin van Zonneveld’, ‘van’, true);
    // *     returns 2: ‘Kevin ‘
    // *     example 3: strstr(‘name@example.com’, ‘@’);
    // *     returns 3: ‘@example.com’
    // *     example 4: strstr(‘name@example.com’, ‘@’, true);    // *     returns 4: ‘name’
    var i = (haystack+'').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

function strrpos (haystack, needle, offset) {
    //  discuss at: http://locutus.io/php/strrpos/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //    input by: saulius
    //   example 1: strrpos('Kevin van Zonneveld', 'e')
    //   returns 1: 16
    //   example 2: strrpos('somepage.com', '.', false)
    //   returns 2: 8
    //   example 3: strrpos('baa', 'a', 3)
    //   returns 3: false
    //   example 4: strrpos('baa', 'a', 2)
    //   returns 4: 2

  var i = -1
  if (offset) {
    i = (haystack + '')
      .slice(offset)
      .lastIndexOf(needle) // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset
    }
  } else {
    i = (haystack + '')
      .lastIndexOf(needle)
  }
  return i >= 0 ? i : false    
}

function strtok ( s, chars, rtl ) {
    /**
     * @param   {string}   s      the string to search in
     * @param   {string}   chars  the chars to search for
     * @param   {boolean=} rtl    option to parse from right to left
     * @return  {string}
     * @example tok( 'example.com?q=value#frag', '?#' ); // 'example.com'
     * @example tok( 'example.com?q=value#frag', '?#', true ); // 'frag'
     */
    var n, i = chars.length;
    rtl = true === rtl;
    while ( i-- ) {
        n = s.indexOf(chars[i]);
        s = n < 0 ? s : rtl 
            ? s.substr(++n)
            : s.substr(0, n);
    }
    return s;
}

function urldecode( str ) {  
    // Decodes URL-encoded string    
    //   
    // version: 901.1411  
    // discuss at: http://phpjs.org/functions/urldecode  
    // +   original by: Philip Peterson  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +      input by: AJ  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +   improved by: Brett Zamir  
    // %          note: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/  
    // *     example 1: urldecode('Kevin+van+Zonneveld%21');  
    // *     returns 1: 'Kevin van Zonneveld!'  
    // *     example 2: urldecode('http%3A%2F%2Fkevin.vanzonneveld.net%2F');  
    // *     returns 2: 'http://kevin.vanzonneveld.net/'  
    // *     example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a');  
    // *     returns 3: 'http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'  
      
    var histogram = {};  
    var ret = str.toString();  
      
    var replacer = function(search, replace, str) {  
        var tmp_arr = [];  
        tmp_arr = str.split(search);  
        return tmp_arr.join(replace);  
    };  
      
    // The histogram is identical to the one in urlencode.  
    histogram["'"]   = '%27';  
    histogram['(']   = '%28';  
    histogram[')']   = '%29';  
    histogram['*']   = '%2A';  
    histogram['~']   = '%7E';  
    histogram['!']   = '%21';  
    histogram['%20'] = '+';  
  
    for (replace in histogram) {  
        search = histogram[replace]; // Switch order when decoding  
        ret = replacer(search, replace, ret) // Custom replace. No regexing     
    }  
      
    // End with decodeURIComponent, which most resembles PHP's encoding functions  
    ret = decodeURIComponent(ret);  
  
    return ret;  
}

function urlencode( str ) {  
    // URL-encodes string    
    //   
    // version: 901.1411  
    // discuss at: http://phpjs.org/functions/urlencode  
    // +   original by: Philip Peterson  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +      input by: AJ  
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
    // +   improved by: Brett Zamir  
    // %          note: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/  
    // *     example 1: urlencode('Kevin van Zonneveld!');  
    // *     returns 1: 'Kevin+van+Zonneveld%21'  
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');  
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'  
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');  
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'  
                               
    var histogram = {}, tmp_arr = [];  
    var ret = str.toString();  
      
    var replacer = function(search, replace, str) {  
        var tmp_arr = [];  
        tmp_arr = str.split(search);  
        return tmp_arr.join(replace);  
    };  
      
    // The histogram is identical to the one in urldecode.  
    histogram["'"]   = '%27';  
    histogram['(']   = '%28';  
    histogram[')']   = '%29';  
    histogram['*']   = '%2A';  
    histogram['~']   = '%7E';  
    histogram['!']   = '%21';  
    histogram['%20'] = '+';  
      
    // Begin with encodeURIComponent, which most resembles PHP's encoding functions  
    ret = encodeURIComponent(ret);  
      
    for (search in histogram) {  
        replace = histogram[search];  
        ret = replacer(search, replace, ret) // Custom replace. No regexing  
    }  
      
    // Uppercase for full PHP compatibility  
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {  
        return "%"+m2.toUpperCase();  
    });  
      
    return ret;  
}

function parse_url (str, component) {  
    // Parse a URL and return its components    
    //   
    // version: 901.2514  
    // discuss at: http://phpjs.org/functions/parse_url  
    // +      original by: Steven Levithan (http://blog.stevenlevithan.com)  
    // + reimplemented by: Brett Zamir  
    // %          note: Based on http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js  
    // %          note: blog post at http://blog.stevenlevithan.com/archives/parseuri  
    // %          note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js  
    // %          note: Does not replace invaild characters with '_' as in PHP, nor does it return false with  
    // %          note: a seriously malformed URL.  
    // %          note: Besides function name, is the same as parseUri besides the commented out portion  
    // %          note: and the additional section following, as well as our allowing an extra slash after  
    // %          note: the scheme/protocol (to allow file:/// as in PHP)  
    // *     example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');  
    // *     returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}  
    var  o   = {  
        strictMode: false,  
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],  
        q:   {  
            name:   "queryKey",  
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g  
        },  
        parser: {  
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-protocol to catch file:/// (should restrict this)  
        }  
    };  
      
    var m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),  
    uri = {},  
    i   = 14;  
    while (i--) uri[o.key[i]] = m[i] || "";  
    // Uncomment the following to use the original more detailed (non-PHP) script  
    /* 
        uri[o.q.name] = {}; 
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) { 
        if ($1) uri[o.q.name][$1] = $2; 
        }); 
        return uri; 
    */  
  
    switch (component) {  
        case 'PHP_URL_SCHEME':  
            return uri.protocol;  
        case 'PHP_URL_HOST':  
            return uri.host;  
        case 'PHP_URL_PORT':  
            return uri.port;  
        case 'PHP_URL_USER':  
            return uri.user;  
        case 'PHP_URL_PASS':  
            return uri.password;  
        case 'PHP_URL_PATH':  
            return uri.path;  
        case 'PHP_URL_QUERY':  
            return uri.query;  
        case 'PHP_URL_FRAGMENT':  
            return uri.anchor;  
        default:  
            var retArr = {};  
            if (uri.protocol !== '') retArr.scheme=uri.protocol;  
            if (uri.host !== '') retArr.host=uri.host;  
            if (uri.port !== '') retArr.port=uri.port;  
            if (uri.user !== '') retArr.user=uri.user;  
            if (uri.password !== '') retArr.pass=uri.password;  
            if (uri.path !== '') retArr.path=uri.path;  
            if (uri.query !== '') retArr.query=uri.query;  
            if (uri.anchor !== '') retArr.fragment=uri.anchor;  
            return retArr;  
    }  
}

function file_get_contents (url, flags, context, offset, maxLen) { 
  // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/file_get_contents/
  //      original by: Legaev Andrey
  //         input by: Jani Hartikainen
  //         input by: Raphael (Ao) RUDLER
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Kevin van Zonneveld (http://kvz.io)
  //           note 1: This used to work in the browser via blocking ajax
  //           note 1: requests in 1.3.2 and earlier
  //           note 1: but then people started using that for real app,
  //           note 1: so we deprecated this behavior,
  //           note 1: so this function is now Node-only
  //        example 1: var $buf = file_get_contents('test/never-change.txt')
  //        example 1: var $result = $buf.indexOf('hash') !== -1
  //        returns 1: true

  return fs.readFileSync(url, 'utf-8')
}

function dirname (path) {
  //  discuss at: http://locutus.io/php/dirname/
  // original by: Ozh
  // improved by: XoraX (http://www.xorax.info)
  //   example 1: dirname('/etc/passwd')
  //   returns 1: '/etc'
  //   example 2: dirname('c:/Temp/x')
  //   returns 2: 'c:/Temp'
  //   example 3: dirname('/dir/test/')
  //   returns 3: '/dir'

  return path.replace(/\\/g, '/')
    .replace(/\/[^/]*\/?$/, '')
}

function pathinfo (path, options) {
  //  discuss at: http://locutus.io/php/pathinfo/
  // original by: Nate
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Dmitry Gorelenkov
  //    input by: Timo
  //      note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
  //      note 1: The way the bitwise arguments are handled allows for greater flexibility
  //      note 1: & compatability. We might even standardize this
  //      note 1: code and use a similar approach for
  //      note 1: other bitwise PHP functions
  //      note 1: Locutus tries very hard to stay away from a core.js
  //      note 1: file with global dependencies, because we like
  //      note 1: that you can just take a couple of functions and be on your way.
  //      note 1: But by way we implemented this function,
  //      note 1: if you want you can still declare the PATHINFO_*
  //      note 1: yourself, and then you can use:
  //      note 1: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
  //      note 1: which makes it fully compliant with PHP syntax.
  //   example 1: pathinfo('/www/htdocs/index.html', 1)
  //   returns 1: '/www/htdocs'
  //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME')
  //   returns 2: 'index.html'
  //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION')
  //   returns 3: 'html'
  //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME')
  //   returns 4: 'index'
  //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4)
  //   returns 5: {basename: 'index.html', extension: 'html'}
  //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL')
  //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
  //   example 7: pathinfo('/www/htdocs/index.html')
  //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}

  var basename = require('../filesystem/basename')
  var opt = ''
  var realOpt = ''
  var optName = ''
  var optTemp = 0
  var tmpArr = {}
  var cnt = 0
  var i = 0
  var haveBasename = false
  var haveExtension = false
  var haveFilename = false

  // Input defaulting & sanitation
  if (!path) {
    return false
  }
  if (!options) {
    options = 'PATHINFO_ALL'
  }

  // Initialize binary arguments. Both the string & integer (constant) input is
  // allowed
  var OPTS = {
    'PATHINFO_DIRNAME': 1,
    'PATHINFO_BASENAME': 2,
    'PATHINFO_EXTENSION': 4,
    'PATHINFO_FILENAME': 8,
    'PATHINFO_ALL': 0
  }
  // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
  for (optName in OPTS) {
    if (OPTS.hasOwnProperty(optName)) {
      OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName]
    }
  }
  if (typeof options !== 'number') {
    // Allow for a single string or an array of string flags
    options = [].concat(options)
    for (i = 0; i < options.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[options[i]]) {
        optTemp = optTemp | OPTS[options[i]]
      }
    }
    options = optTemp
  }

  // Internal Functions
  var _getExt = function (path) {
    var str = path + ''
    var dotP = str.lastIndexOf('.') + 1
    return !dotP ? false : dotP !== str.length ? str.substr(dotP) : ''
  }

  // Gather path infos
  if (options & OPTS.PATHINFO_DIRNAME) {
    var dirName = path
      .replace(/\\/g, '/')
      .replace(/\/[^/]*\/?$/, '') // dirname
    tmpArr.dirname = dirName === path ? '.' : dirName
  }

  if (options & OPTS.PATHINFO_BASENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    tmpArr.basename = haveBasename
  }

  if (options & OPTS.PATHINFO_EXTENSION) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveExtension !== false) {
      tmpArr.extension = haveExtension
    }
  }

  if (options & OPTS.PATHINFO_FILENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveFilename === false) {
      haveFilename = haveBasename.slice(0, haveBasename.length - (haveExtension
        ? haveExtension.length + 1
        : haveExtension === false
          ? 0
          : 1
        )
      )
    }

    tmpArr.filename = haveFilename
  }

  // If array contains only 1 element: return string
  cnt = 0
  for (opt in tmpArr) {
    if (tmpArr.hasOwnProperty(opt)) {
      cnt++
      realOpt = opt
    }
  }
  if (cnt === 1) {
    return tmpArr[realOpt]
  }

  // Return full-blown array
  return tmpArr
}

function substr (str, start, len) { 
  //  discuss at: http://locutus.io/php/substr/
  // original by: Martijn Wieringa
  // bugfixed by: T.Wild
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Theriault (https://github.com/Theriault)
  //      note 1: Handles rare Unicode characters if 'unicode.semantics' ini (PHP6) is set to 'on'
  //   example 1: substr('abcdef', 0, -1)
  //   returns 1: 'abcde'
  //   example 2: substr(2, 0, -6)
  //   returns 2: false
  //   example 3: ini_set('unicode.semantics', 'on')
  //   example 3: substr('a\uD801\uDC00', 0, -1)
  //   returns 3: 'a'
  //   example 4: ini_set('unicode.semantics', 'on')
  //   example 4: substr('a\uD801\uDC00', 0, 2)
  //   returns 4: 'a\uD801\uDC00'
  //   example 5: ini_set('unicode.semantics', 'on')
  //   example 5: substr('a\uD801\uDC00', -1, 1)
  //   returns 5: '\uD801\uDC00'
  //   example 6: ini_set('unicode.semantics', 'on')
  //   example 6: substr('a\uD801\uDC00z\uD801\uDC00', -3, 2)
  //   returns 6: '\uD801\uDC00z'
  //   example 7: ini_set('unicode.semantics', 'on')
  //   example 7: substr('a\uD801\uDC00z\uD801\uDC00', -3, -1)
  //   returns 7: '\uD801\uDC00z'
  //        test: skip-3 skip-4 skip-5 skip-6 skip-7

  str += ''
  var end = str.length

  var iniVal = 'off';//(typeof require !== 'undefined' ? require('../info/ini_get')('unicode.emantics') : undefined) || 'off'

  if (iniVal === 'off') {
    // assumes there are no non-BMP characters;
    // if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
    if (start < 0) {
      start += end
    }
    if (typeof len !== 'undefined') {
      if (len < 0) {
        end = len + end
      } else {
        end = len + start
      }
    }

    // PHP returns false if start does not fall within the string.
    // PHP returns false if the calculated end comes before the calculated start.
    // PHP returns an empty string if start and end are the same.
    // Otherwise, PHP returns the portion of the string from start to end.
    if (start >= str.length || start < 0 || start > end) {
      return false
    }

    return str.slice(start, end)
  }

  // Full-blown Unicode including non-Basic-Multilingual-Plane characters
  var i = 0
  var allBMP = true
  var es = 0
  var el = 0
  var se = 0
  var ret = ''

  for (i = 0; i < str.length; i++) {
    if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
      allBMP = false
      break
    }
  }

  if (!allBMP) {
    if (start < 0) {
      for (i = end - 1, es = (start += end); i >= es; i--) {
        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
          start--
          es--
        }
      }
    } else {
      var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
      while ((surrogatePairs.exec(str)) !== null) {
        var li = surrogatePairs.lastIndex
        if (li - 2 < start) {
          start++
        } else {
          break
        }
      }
    }

    if (start >= end || start < 0) {
      return false
    }
    if (len < 0) {
      for (i = end - 1, el = (end += len); i >= el; i--) {
        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
          end--
          el--
        }
      }
      if (start > end) {
        return false
      }
      return str.slice(start, end)
    } else {
      se = start + len
      for (i = start; i < se; i++) {
        ret += str.charAt(i)
        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
          // Go one further, since one of the "characters" is part of a surrogate pair
          se++
        }
      }
      return ret
    }
  }
}

function str_replace (search, replace, subject, countObj) { 
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/str_replace/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Gabriel Paderni
    // improved by: Philip Peterson
    // improved by: Simon Willison (http://simonwillison.net)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Anton Ongson
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Oleg Eremeev
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
    //    input by: Onno Marsman (https://twitter.com/onnomarsman)
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Oleg Eremeev
    //      note 1: The countObj parameter (optional) if used must be passed in as a
    //      note 1: object. The count will then be written by reference into it's `value` property
    //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
    //   returns 1: 'Kevin.van.Zonneveld'
    //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
    //   returns 2: 'hemmo, mars'
    //   example 3: str_replace(Array('S','F'),'x','ASDFASDF')
    //   returns 3: 'AxDxAxDx'
    //   example 4: var countObj = {}
    //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
    //   example 4: var $result = countObj.value
    //   returns 4: 4

  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }

  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}

function strlen (string) {
  //  discuss at: http://locutus.io/php/strlen/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Sakimori
  // improved by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Kirk Strobeck
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: May look like overkill, but in order to be truly faithful to handling all Unicode
  //      note 1: characters and to this function in PHP which does not count the number of bytes
  //      note 1: but counts the number of characters, something like this is really necessary.
  //   example 1: strlen('Kevin van Zonneveld')
  //   returns 1: 19
  //   example 2: ini_set('unicode.semantics', 'on')
  //   example 2: strlen('A\ud87e\udc04Z')
  //   returns 2: 3

  var str = string + ''

  var iniVal = 'off';//(typeof require !== 'undefined' ? require('../info/ini_get')('unicode.semantics') : undefined) || 'off'
  if (iniVal === 'off') {
    return str.length
  }

  var i = 0
  var lgth = 0

  var getWholeChar = function (str, i) {
    var code = str.charCodeAt(i)
    var next = ''
    var prev = ''
    if (code >= 0xD800 && code <= 0xDBFF) {
      // High surrogate (could change last hex to 0xDB7F to
      // treat high private surrogates as single characters)
      if (str.length <= (i + 1)) {
        throw new Error('High surrogate without following low surrogate')
      }
      next = str.charCodeAt(i + 1)
      if (next < 0xDC00 || next > 0xDFFF) {
        throw new Error('High surrogate without following low surrogate')
      }
      return str.charAt(i) + str.charAt(i + 1)
    } else if (code >= 0xDC00 && code <= 0xDFFF) {
      // Low surrogate
      if (i === 0) {
        throw new Error('Low surrogate without preceding high surrogate')
      }
      prev = str.charCodeAt(i - 1)
      if (prev < 0xD800 || prev > 0xDBFF) {
        // (could change last hex to 0xDB7F to treat high private surrogates
        // as single characters)
        throw new Error('Low surrogate without preceding high surrogate')
      }
      // We can pass over low surrogates now as the second
      // component in a pair which we have already processed
      return false
    }
    return str.charAt(i)
  }

  for (i = 0, lgth = 0; i < str.length; i++) {
    if ((getWholeChar(str, i)) === false) {
      continue
    }
    // Adapt this line at the top of any loop, passing in the whole string and
    // the current iteration and returning a variable to represent the individual character;
    // purpose is to treat the first part of a surrogate pair as the whole character and then
    // ignore the second part
    lgth++
  }

  return lgth
}

function trim (str, charlist) {
  //  discuss at: http://locutus.io/php/trim/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: mdsjack (http://www.mdsjack.bo.it)
  // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Steven Levithan (http://blog.stevenlevithan.com)
  // improved by: Jack
  //    input by: Erkekjetter
  //    input by: DxGx
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: trim('    Kevin van Zonneveld    ')
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: trim('Hello World', 'Hdle')
  //   returns 2: 'o Wor'
  //   example 3: trim(16, 1)
  //   returns 3: '6'

  var whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
  ].join('')
  var l = 0
  var i = 0
  str += ''

  if (charlist) {
    whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
  }

  l = str.length
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i)
      break
    }
  }

  l = str.length
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1)
      break
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}

function array_filter (arr, func) { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_filter/
  // original by: Brett Zamir (http://brett-zamir.me)
  //    input by: max4ever
  // improved by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Takes a function as an argument, not a function's name
  //   example 1: var odd = function (num) {return (num & 1);}
  //   example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
  //   returns 1: {"a": 1, "c": 3, "e": 5}
  //   example 2: var even = function (num) {return (!(num & 1));}
  //   example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
  //   returns 2: [ 6, , 8, , 10, , 12 ]
  //   example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
  //   returns 3: {"a":1, "c":-1}

  var retObj = {}
  var k

  func = func || function (v) {
    return v
  }

  // @todo: Issue #73
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    retObj = []
  }

  for (k in arr) {
    if (func(arr[k])) {
      retObj[k] = arr[k]
    }
  }

  return retObj
}

function array_chunk (input, size, preserveKeys) { 
    // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_chunk/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Important note: Per the ECMAScript specification,
    //      note 1: objects may not always iterate in a predictable order
    //   example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
    //   returns 1: [['Kevin', 'van'], ['Zonneveld']]
    //   example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
    //   returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
    //   example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
    //   returns 3: [['Kevin', 'van'], ['Zonneveld']]
    //   example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
    //   returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]

  var x
  var p = ''
  var i = 0
  var c = -1
  var l = input.length || 0
  var n = []

  if (size < 1) {
    return null
  }

  if (Object.prototype.toString.call(input) === '[object Array]') {
    if (preserveKeys) {
      while (i < l) {
        (x = i % size)
          ? n[c][i] = input[i]
          : n[++c] = {}; n[c][i] = input[i]
        i++
      }
    } else {
      while (i < l) {
        (x = i % size)
          ? n[c][x] = input[i]
          : n[++c] = [input[i]]
        i++
      }
    }
  } else {
    if (preserveKeys) {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][p] = input[p]
            : n[++c] = {}; n[c][p] = input[p]
          i++
        }
      }
    } else {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][x] = input[p]
            : n[++c] = [input[p]]
          i++
        }
      }
    }
  }

  return n
}

function array_map (callback) { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_map/
  // original by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: thekid
  //      note 1: If the callback is a string (or object, if an array is supplied),
  //      note 1: it can only work if the function name is in the global context
  //   example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] )
  //   returns 1: [ 1, 8, 27, 64, 125 ]

  var argc = arguments.length
  var argv = arguments
  var obj = null
  var cb = callback
  var j = argv[1].length
  var i = 0
  var k = 1
  var m = 0
  var tmp = []
  var tmpArr = []

  var $global = (typeof window !== 'undefined' ? window : global)

  while (i < j) {
    while (k < argc) {
      tmp[m++] = argv[k++][i]
    }

    m = 0
    k = 1

    if (callback) {
      if (typeof callback === 'string') {
        cb = $global[callback]
      } else if (typeof callback === 'object' && callback.length) {
        obj = typeof callback[0] === 'string' ? $global[callback[0]] : callback[0]
        if (typeof obj === 'undefined') {
          throw new Error('Object not found: ' + callback[0])
        }
        cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1]
      }
      tmpArr[i++] = cb.apply(obj, tmp)
    } else {
      tmpArr[i++] = tmp
    }

    tmp = []
  }

  return tmpArr
}

function array_keys (input, searchValue, argStrict) { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_keys/
  // original by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: P
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // improved by: jd
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
  //   returns 1: [ 'firstname', 'surname' ]

  var search = typeof searchValue !== 'undefined'
  var tmpArr = []
  var strict = !!argStrict
  var include = true
  var key = ''

  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true
      if (search) {
        if (strict && input[key] !== searchValue) {
          include = false
        } else if (input[key] !== searchValue) {
          include = false
        }
      }

      if (include) {
        tmpArr[tmpArr.length] = key
      }
    }
  }

  return tmpArr
}

function array_merge () { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: var $arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: var $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge($arr1, $arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: var $arr1 = []
  //   example 2: var $arr2 = {1: "data"}
  //   example 2: array_merge($arr1, $arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments)
  var argl = args.length
  var arg
  var retObj = {}
  var k = ''
  var argil = 0
  var j = 0
  var i = 0
  var ct = 0
  var toStr = Object.prototype.toString
  var retArr = true

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false
      break
    }
  }

  if (retArr) {
    retArr = []
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i])
    }
    return retArr
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i]
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j]
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k]
          } else {
            retObj[k] = arg[k]
          }
        }
      }
    }
  }

  return retObj
}

function array_merge_recursive (arr1, arr2) { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_merge_recursive/
  // original by: Subhasis Deb
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: var $arr1 = {'color': {'favorite': 'red'}, 0: 5}
  //   example 1: var $arr2 = {0: 10, 'color': {'favorite': 'green', 0: 'blue'}}
  //   example 1: array_merge_recursive($arr1, $arr2)
  //   returns 1: {'color': {'favorite': {0: 'red', 1: 'green'}, 0: 'blue'}, 1: 5, 1: 10}
  //        test: skip-1

  var arrayMerge = require('../array/array_merge')
  var idx = ''

  if (arr1 && Object.prototype.toString.call(arr1) === '[object Array]' &&
    arr2 && Object.prototype.toString.call(arr2) === '[object Array]') {
    for (idx in arr2) {
      arr1.push(arr2[idx])
    }
  } else if ((arr1 && (arr1 instanceof Object)) && (arr2 && (arr2 instanceof Object))) {
    for (idx in arr2) {
      if (idx in arr1) {
        if (typeof arr1[idx] === 'object' && typeof arr2 === 'object') {
          arr1[idx] = arrayMerge(arr1[idx], arr2[idx])
        } else {
          arr1[idx] = arr2[idx]
        }
      } else {
        arr1[idx] = arr2[idx]
      }
    }
  }

  return arr1
}

function in_array (needle, haystack, argStrict) { 
    // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/in_array/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: vlado houba
  // improved by: Jonas Sciangula Street (Joni2Back)
  //    input by: Billy
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
  //   returns 2: false
  //   example 3: in_array(1, ['1', '2', '3'])
  //   example 3: in_array(1, ['1', '2', '3'], false)
  //   returns 3: true
  //   returns 3: true
  //   example 4: in_array(1, ['1', '2', '3'], true)
  //   returns 4: false

  var key = ''
  var strict = !!argStrict

  // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
  // in just one for, in order to improve the performance
  // deciding wich type of comparation will do before walk array
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) { // eslint-disable-line eqeqeq
        return true
      }
    }
  }

  return false
}
module.exports = { 
	generate_token, 
	_generateTimeStamp, 
	_generateTimes, 
	_generateDate,
	_generateDateFormat,
	_generate_otp, 
	generate_img_name,
	_getDifference,
	_generateYearMonth,
	_getDayMonthYear,
	_getDayMonthName,
	_getCurrentDateMonthYear,
	generateSecretKey,
	encode,
	decode,
	_isBetween
};