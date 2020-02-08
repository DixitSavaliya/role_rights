import axios from 'axios';
import { config } from './config';
let oldRequest;
let reqCount = 0;
axios.interceptors.request.use((req) => {
    let auth =  JSON.parse(window.sessionStorage.getItem('ad_network_auth'))
    req.headers['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
    req.headers['content-md5'] = auth ? auth.secret_key : '';
    if(req.data && req.url != config.baseApiUrl + "User/getAuthTokens"){
        req.data.end_user_key = auth ? auth.secret_key : '';
    }
    //config.data['end_user_key'] = auth ? auth.secret_key : '';
    if(req.url != config.baseApiUrl + "User/getAccessTokenByRefreshToken"){
        oldRequest = {};
        oldRequest['url'] = req.url;
        oldRequest['body'] = req.data;
        oldRequest['method'] = req.method;
        oldRequest['headers'] = req.headers;
    }else {
        //reqCount = 0;
        //console.log("auth".auth)
        console.log("config", req)
    }
    return req;
},function (error) {
    console.log('error: ', error);
});



axios.interceptors.response.use((response) => {
    let auth =  JSON.parse(window.sessionStorage.getItem('ad_network_auth'))
    let res = {};
    let oldCount = 0;
    if(response.data.token != undefined){
        if(reqCount == 0){
            reqCount = 1;
            //console.log("response", response)
            axios.post(config.baseApiUrl + "User/getAccessTokenByRefreshToken",{refresh_token:auth.refresh_token,username:auth.username ? auth.username : auth.email_id})
            .then(result => {
                window.sessionStorage.setItem('ad_network_auth', JSON.stringify(result.data.data))
                //oldRequest
                if(oldCount == 0){
                    oldCount = 1;
                    oldRequest.headers['Authorization'] = 'Barier ' + (result.data.data ? result.data.data.access_token : '');
                    // console.log("oldRequest",oldRequest)
                    // console.log("oldRequest.url",oldRequest.url)
                    axios[oldRequest.method](oldRequest.url,oldRequest.body, {headers: oldRequest.headers})
                    .then(result1 => {  
                        // console.log("oldrequest result ", result1)
                        // console.log("oldrequest result response", response)
                        //return result1;
                        response = result1;
                        return response;
                    }).catch(error1 => {
                        // console.log("oldrequest error ", error1)
                        return error1;
                    })
                }
            }).catch(error => {
                console.log("intercepting error of refresh token", error);
            })
        }
    }else {
        return response
    }


}, function (error) {
    const originalRequest = error.config;
    let auth = JSON.parse(window.sessionStorage.getItem('ad_network_auth'))
    if (error.response.status === 401) {
        window.location.href = "/login";
        return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        axios.defaults.headers.post['Authorization']  = 'Barier ' + (auth ? auth.refresh_token : '');
    }
    return Promise.reject(error);
})


