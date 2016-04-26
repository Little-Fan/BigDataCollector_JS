/**
 * Created by fanxiaolong on 2016/4/22.
 */

var GetVideoInfo = function (options) {
    options || (options = {});
    $.extend(this, options);
    this._reset();
    this.initialize.apply(this);   //初始化操作
};

$.extend(true, GetVideoInfo.prototype, {
    videoObject: '',
    model: {},
    initialize: function () {},
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    clearCookie: function (name) {
        this.setCookie(name, "", -1);
    },
    createUID: function (num) {
        var g = "", i = num;
        while (i--) {
            g += Math.floor(Math.random() * 16.0).toString(16);
        }
        return g
    },
    _reset: function () {
        this.length = 0;
        this.models = [];
    },
    getVideo: function (selector) {
        //只获取页面上第一个视频
        this.videoObject = $(selector)[0];
    },
    getReferrer: function () {
        var ref = '';
        if (document.referrer.length > 0) {
            ref = document.referrer;
        }
        try {
            if (ref.length == 0 && opener.location.href.length > 0) {
                ref = opener.location.href;
            }
        } catch (e) {
        }
        return ref;
    },
    getTitle: function () {
        return $('title').text();
    },
    getCurrentURL: function () {
        return window.location.href;
    },
    getVideoURL: function () {
        return this.videoObject.currentSrc
    },
    getVideoDuration: function () {
        return Math.round(this.videoObject.duration);
    },
    startTime: function () {
        this.videoObject.addEventListener("loadstart", function () {
            console.log((new Date()).getTime());
        }, false);
    },
    userAgent: function () {
        this.ua = window.navigator.userAgent;
        return this.ua;
    },
    detectOS: function () {
        var ua = this.ua;
        switch (true) {
        case /Android/.test(ua):
            return "Android";
        case /iPhone|iPad|iPod/.test(ua):
            return "iOS";
        case /Windows/.test(ua):
            return "Windows";
        case /Mac OS X/.test(ua):
            return "Mac";
        case /CrOS/.test(ua):
            return "Chrome OS";
        case /Firefox/.test(ua):
            return "Firefox OS";
        }
        return "";
    },
    detectBrowser: function () {
        var ua = this.ua;
        switch (true) {
        case /CriOS/.test(ua):
            return "Chrome for iOS";
        case /Edge/.test(ua):
            return "Edge";
        case /Chrome/.test(ua):
            return "Chrome";
        case /Firefox/.test(ua):
            return "Firefox";
        case /Android/.test(ua):
            return "AOSP";
        case /MSIE|Trident/.test(ua):
            return "IE";
        case /Safari\//.test(ua):
            return "Safari";
        case /AppleWebKit/.test(ua):
            return "WebKit";
        }
        return "";
    },
    detectOSVersion: function () {
        var ua = this.ua;
        var os = this.detectOS();
        switch (os) {
        case "Android":
            return this._getVersion(ua, "Android");
        case "iOS":
            return this._getVersion(ua, /OS /);
        case "Windows":
            return this._getVersion(ua, /Phone/.test(ua) ? /Windows Phone (?:OS )?/ : /Windows NT/);
        case "Mac":
            return this._getVersion(ua, /Mac OS X /);
        }
        return "0.0.0";
    },
    _getVersion: function (ua, token) {
        try {
            return this._normalizeSemverString(ua.split(token)[1].trim().split(/[^\w\.]/)[0]);
        } catch (o_O) {
            // ignore
        }
        return "0.0.0";
    },
    _normalizeSemverString: function (version) {
        var ary = version.split(/[\._]/); // "1_2_3" -> ["1", "2", "3"]
                                          // "1.2.3" -> ["1", "2", "3"]
        return ( parseInt(ary[0], 10) || 0 ) + "." +
            ( parseInt(ary[1], 10) || 0 ) + "." +
            ( parseInt(ary[2], 10) || 0 );
    }
});