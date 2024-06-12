/**
 * 国际化js，pc和app共用
 */
I18Util = {
    lanMap : {},
    isEnglish : false,
    isNotZH_CN : false
}

var mctx = window.location.pathname.substring(0, window.location.pathname.indexOf('/res')) || '';

I18Util.isEnglish = getBrowserLanguage() == 2;
I18Util.isNotZH_CN = getBrowserLanguage() != 1;
init();

/**
 * 根据当前设置的语言读取配置文件信息
 */
function init() {
    // 获取设置的语言
    var language = getBrowserLanguage();
    var lang = '';
    switch(language) {
        case 1:
            //中文
            return;
        case 2 :
            //英文
            lang = 'en';
            document.body.classList.add('English');
            break;
        case 3 :
            //繁体
            lang = 'tw';
            break;
    }
    //嵌入在客户端
    /*var path = 'language/';
    if (window.location.href.startsWith('http')){
        //线上
        path = mctx + '/res/app/curriculum/language/'
    }*/
    // alert('1=='+path+'=='+lang);
    /*jQuery.i18n.properties({//加载语言对应的资源文件
        name: 'strings', //资源文件名称
        path: path, //资源文件路径
        language: lang,
        cache: false,
        encoding: 'UTF-8',
        mode:'map', //用Map的方式使用资源文件中的值
        callback: function() {
            // alert('size='+Object.keys($.i18n.map).length)
        }
    });*/

    if (window.location.href.startsWith('http')) {
        //线上
        $.get({
            url: mctx + '/res/language/strings_' + lang + ".json",
            async: false,
            success: function (data) {
                I18Util.lanMap = data;
            }
        });
    }else {
        //嵌在客户端里，通过openurl协议调接口
        var param = {
            loadType : 3,
            webUrl : 'https://kb.chaoxing.com/res/language/strings_' + lang + ".json",
        }
        jsBridge.postNotification('CLIENT_OPEN_URL', param);
        jsBridge.bind('CLIENT_OPEN_URL', function(object){
            if (typeof object == 'undefined') {
                return;
            }
            I18Util.lanMap = object;
        });
    }
}

/**
 * 替换页面上"data-lang"属性
 */
function loadI18nProperties(){
    // 获取设置的语言
    var language = getBrowserLanguage();
    if (language == 1){
        //中文直接return
        return;
    }
    var key;
    var value;
    $('[data-lang]').each(function () {
        key = $(this).attr('data-lang');
        value = getI18nText(key);
        //判断下，如果已经修改过，就不再修改
        if ($(this).attr('i18nFlag') == 1){
            return true;
        }
        if (value){
            if ($(this).attr('placeholder')){
                $(this).attr('placeholder',value);
                return true;
            }
            $(this).text(value);
            $(this).attr('i18nFlag',1);
        }
    })
}


/**
 * 判断当前语言是否是英语
 * @returns {boolean}
 */
function checkIsEn() {
    return I18Util.isEnglish;
}

/**
 * 判断当前语言是否不是简体中文
 * @returns {boolean}
 */
function checkIsNotZH_CN() {
    return I18Util.isNotZH_CN;
}

/**
 * 获取cookie
 * @param name
 * @returns {string}
 */
function getCookie(name){
    var arr,reg=new RegExp("(^| )*"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return '';
    }
}

/**
 * 获取当前设置的语言（客户端优先从浏览器取。非客户端优先从cookie中取，cookie没有再从浏览器取）
 * return：1：中文或其它未支持的语言 2：英文 3：中文繁体
 */
function getBrowserLanguage(){
    var language = '';
    //非客户端
    if(navigator.userAgent.indexOf("ChaoXingStudy") == -1){
        language = getCookie('browserLocale').toLowerCase() || navigator.language.toLowerCase();
    }else {
        var iphone = /iphone/gi.test(navigator.userAgent);
        if (iphone){
            //ios从apiVersion中取语言
            var appVersion = navigator.appVersion.toLowerCase();
            if (appVersion.indexOf('language/en')>-1){
                language = 'language/en';
            }else if (appVersion.indexOf('language/zh-hant')>-1){
                //ios的中文繁体是zh-hant
                language = 'language/tw';
            }
        }else {
            //安卓
            language = navigator.language.toLowerCase();
        }
    }
    var result = 1;
    if(language.indexOf('en')>-1){
        result = 2;
    }else if (language.indexOf('tw')>-1){
        result = 3;
    }
    return result;
}

/**
 * 获取中文（key）对应的国际化翻译
 */
function getI18nText(key){
    // 中文直接返回
    var language = getBrowserLanguage();
    if (language == 1){
        return key;
    }
    return I18Util.lanMap[key] || key;
    //properties文件中的key是unicode编码的，这里转换下
    // var unicodeKey = escape(key).replace(/\%u/g,'\\u');
    // return $.i18n.map[unicodeKey] || key;
}
