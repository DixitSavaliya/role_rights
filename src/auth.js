import fetchIntercept from 'fetch-intercept';

export const unregister = fetchIntercept.register({
    request: function (url, config) {
        document.body.classList.add('load');
        return ([url, config]);
    },

    requestError: function (error) {
        return Promise.reject(error);
    },

    response: function (response) {
        document.body.classList.remove('load');
        return response;
    },

    responseError: function (error) {
        return Promise.reject(error);
    }
});