"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var getWindow = function () {
    return window;
};
var getUserInfo = function (props, state, setState) {
    getWindow().FB.api('/me', { locale: props.language, fields: props.fields.join(',') }, function (response) {
        var currentUser = response;
        setState(__assign({}, state, { isLoggedIn: true, currentUser: currentUser, isProcessing: false, loaded: true }));
    });
};
var checkLoginCallback = function (response, props, state, setState) {
    if (response.status === 'connected') {
        getUserInfo(props, state, setState);
    }
    else {
        setState(__assign({}, state, { isLoggedIn: false, currentUser: undefined, isProcessing: false }));
    }
};
var setFacekbookAsyncInit = function (props, state, setState) {
    getWindow().fbAsyncInit = function () {
        getWindow().FB.init({
            version: "v" + props.version,
            appId: "" + props.appId,
            xfbml: false,
            cookie: false,
        });
        setState(__assign({}, state, { isSdkLoaded: true }));
        getWindow().FB.getLoginStatus(function (response) { return checkLoginCallback(response, props, state, setState); });
    };
};
var loadSdkAsynchronously = function (props, state) {
    (function (doc, script, sdkId) {
        var newScriptElement = doc.createElement(script);
        newScriptElement.id = sdkId;
        newScriptElement.src = "https://connect.facebook.net/" + props.language + "/sdk.js";
        doc.head.appendChild(newScriptElement);
        var fbRoot = doc.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = doc.createElement('div');
            fbRoot.id = 'fb-root';
            doc.body.appendChild(fbRoot);
        }
    })(document, 'script', 'facebook-jssdk');
};
var loginCallback = function (response, props, state, setState) {
    if (response.authResponse) {
        getUserInfo(props, state, setState);
    }
    else {
        if (props.onFailure) {
            props.onFailure(response);
            setState(__assign({}, state, { isProcessing: false }));
        }
    }
};
var logoutCallback = function (response, props, state, setState) {
    if (response.authResponse) {
        setState(__assign({}, state, { isLoggedIn: false, currentUser: undefined, isProcessing: false }));
    }
    else {
        if (props.onFailure) {
            props.onFailure(response);
        }
    }
};
exports.useFacebookLogin = function (props) {
    var _a = react_1.useState({
        isSdkLoaded: false,
        isProcessing: false,
        isLoggedIn: false,
        loaded: false,
    }), state = _a[0], setState = _a[1];
    var login = function () {
        setState(__assign({}, state, { isProcessing: true }));
        getWindow().FB.login(function (response) { return loginCallback(response, props, state, setState); });
    };
    var logout = function () {
        setState(__assign({}, state, { isProcessing: true }));
        getWindow().FB.logout(function (response) { return logoutCallback(response, props, state, setState); });
    };
    react_1.useEffect(function () {
        setState(__assign({}, state, { isProcessing: true }));
        setFacekbookAsyncInit(props, state, setState);
        loadSdkAsynchronously(props, state);
    }, [props.appId, props.fields.join(','), props.language, props.version]);
    return [state, login, logout];
};
//# sourceMappingURL=use-fb-login.js.map