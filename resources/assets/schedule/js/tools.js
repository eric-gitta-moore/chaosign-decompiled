var ToolsUtils = {
		enescape:function(str){},
		unescape:function(str){},
		setViewMode:function(){},
		getClientType:function(){},
		getClientVersion:function(){},
		getUrlParameter:function(param){},
		format_fileDuration:function(param){},
		format_fileSize:function(param){}
}

//Unicode编码
ToolsUtils.enescape= function(str){
	if(undefined == str || '' == str)
        return "";
	var res=[];
	for(var i=0;i < str.length;i++){
	        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
	}
	str="\\u"+res.join("\\u");
	str=str.replace(/\\/g,"%");
	return str;
}

//Unicode解码
ToolsUtils.unescape= function(str){
    if(undefined == str || '' == str)
        return "";
    str=unescape(str);
	return str;
}

//设置夜间模式
ToolsUtils.setViewMode= function(str){
	var view = isViewMode();
	if(view){
		$("body").toggleClass("nightmode");
	}
}
//判断客户端是否是夜间模式是返回true
function isViewMode(){
	var view = getUrlParam('m_o_d_e');
	if(view !=null && view=='nightmode'){
		return true;
	}
	return false;
}
//获取url中的参数
function getUrlParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}
//解决iframe跨域
function iframeAutoResize(doc) {
	$(doc).iFrameResize({
        log : false,                  // Enable console logging
        enablePublicMethods : true,  // Enable methods within iframe hosted page
    });
    try{
    	var sum = swiper.slides.length;
        var startX,startY,endX,endY,distanceX,distanceY;
        var index,childindex;
        var iframe = $(doc).prop('contentWindow').document;
        var iframe_swiper = $(doc).prop('contentWindow').ztopicOptions;
        if(undefined != iframe_swiper && null != iframe_swiper && undefined != iframe_swiper.slides && null != iframe_swiper.slides){
        	var childsum = iframe_swiper.slides.length;
    	    iframe.addEventListener('touchstart',function (e) {
    	        startX = e.targetTouches[0].pageX;
    	        startY = e.targetTouches[0].pageY;
    	        childindex =  $(doc).prop('contentWindow').ztopicOptions.activeIndex;
    	    });
    	    iframe.addEventListener('touchend',function (e) {
    	    	index = swiper.activeIndex;
    	    	var touchesend= e.changedTouches[0];
    	        endX = touchesend.pageX;
    	        endY = touchesend.pageY;
    	        distanceX = endX - startX;
    	        distanceY = endY - startY;
    	        if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>($(window).width()/6)){
    	            if(index !=0 && childindex ==0){
    	                swiper.slidePrev();
    	            }
    	            console.log('往右滑动');
    	        }else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<-($(window).width()/6)){
    	            if(index != (sum-1) && childindex ==(childsum-1)){

    	                 swiper.slideNext();
    	            }
    	            console.log('往左滑动');
    	        }
    	    });
        }else{
        	iframe.addEventListener('touchstart',function (e) {
    	        startX = e.targetTouches[0].pageX;
    	        startY = e.targetTouches[0].pageY;
    	    });
    	    iframe.addEventListener('touchend',function (e) {
    	    	index = swiper.activeIndex;
    	    	var touchesend= e.changedTouches[0];
    	        endX = touchesend.pageX;
    	        endY = touchesend.pageY;
    	        distanceX = endX - startX;
    	        distanceY = endY - startY;
    	        if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>($(window).width()/6)){
    	            if(index !=0){
    	                swiper.slidePrev();
    	            }
    	            console.log('往右滑动');
    	        }else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<-($(window).width()/6)){
    	            if(index != (sum-1)){
    	                 swiper.slideNext();
    	            }
    	            console.log('往左滑动');
    	        }
    	    });
        }
    }catch(e){
        console.log(e);
    }
}
//获取url中的参数
ToolsUtils.getUrlParameter = function(param){
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return r[2]; return ''; //返回参数值
}
//将秒格式化为时分秒
ToolsUtils.format_fileDuration = function(value){
	var theTime = parseInt(value);// 秒 
	var theTime1 = 0;// 分 
	var theTime2 = 0;// 小时 
	// alert(theTime); 
	if(theTime > 60) {
		theTime1 = parseInt(theTime/60); 
		theTime = parseInt(theTime%60); 
		// alert(theTime1+"-"+theTime); 
		if(theTime1 > 60) { 
			theTime2 = parseInt(theTime1/60); 
			theTime1 = parseInt(theTime1%60); 
		}
	}
	var result = ""+parseInt(theTime)+"秒"; 
	if(theTime1 > 0) { 
		result = ""+parseInt(theTime1)+"分"+result; 
	} 
	if(theTime2 > 0) { 
		result = ""+parseInt(theTime2)+"时"+result; 
	} 
	return result;
}
//文件大小格式
ToolsUtils.format_fileSize = function(limit){
	if(limit ==null || limit == ""){
		return "0KB";
	}
	var index=0;
	var array=new Array('B','KB','MB','GB','TB','PT');
	while(limit>=1024){//数字部分1到1024之间
	    limit /= 1024;
	    index += 1;
	}
	limit=limit.toFixed(1)+array[index];
	return limit;
}
//获取设备类型
ToolsUtils.getClientType = function(){
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/(iphone|ipod|ipad);?/i)){
	  	return 'ios';
	}
	return 'android';
}

/**
 *正则匹配到的结果数组，根据索引号说明：
 0 ： 整个useragent
 1 ： appid，代表客户端id，比如通用版客户端是 3 ， 移动图书馆2.0 是 1000057
 2 ： 客户端版本号
 3 ： 操作系统类型
 4 ： 终端类型
 5 ： 客户端内部版本号
 6 ： 客户端接口版本号
 7 ： 如果值为@Azeroth ， 代表是灰度版本，否则是旧版本和客户端的机型、操作系统版本、语言 等信息
 8 ： 终端标识
 */
ToolsUtils.getClientVersion = function(key){
	if(undefined == key || null == key || '' == key){
		key = "clientVersion";
	}
	var ua = navigator.userAgent;
	if(ua.indexOf("ChaoXingStudy") > -1){
		if(key){
			var reg = /.*\/ChaoXingStudy_(\d+)_(\d+[^_]*)_(\w+)_(\w+)_(\d+)_(\d+) \(([^)]*)\)_([-]?\w+).*/;
			var ua_array = ua.match(reg);
			switch(key) {
				case "appId" :
					ua = ua_array[1];
					break;
				case "clientType":
					ua = ua_array[3];
					break;
				case "clientVersion":
					ua = ua_array[2];
					break;
				case "apiVersion":
					ua = ua_array[6];
					break;
				default:
					ua=0;
			}
		}
	}
	return ua;
};


/*1.用正则表达式实现html转码*/
ToolsUtils.htmlEncodeByRegExp = function(str){
	var s = "";
	if(str.length == 0) return "";
	s = str.replace(/&/g,"&amp;");
	s = s.replace(/</g,"&lt;");
	s = s.replace(/>/g,"&gt;");
	s = s.replace(/ /g,"&nbsp;");
	s = s.replace(/\'/g,"&#39;");
	s = s.replace(/\"/g,"&quot;");
	return s;
};

/*2.用正则表达式实现html解码*/
ToolsUtils.htmlDecodeByRegExp = function(str){
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;  
};




ToolsUtils.transfer = function(title, cont, logo, url){
	var cataid = "100000015";//网页转发逻辑
	var quoteInfo = '';
	var content = {};
	if(title == ''){
		title = document.title;
	}
	if(logo == ''){
		if (getClientApiVersion() >= 107){
			logo = 'http://apps.wh.chaoxing.com/res/pc/meet/images/meet_logo_FY.png';
		}else {
			logo = 'http://apps.wh.chaoxing.com/res/pc/meet/images/meet_logo.png';
		}
	}
	if(url == ''){
		url = window.location.href;
	}
	if(url.indexOf('&v=v2') == -1){
		url = url + '&v=v2';
	}
	var showCon = 0;
	if(cont != ''){
		showCon = 1;
	}
	content = {
			"cataid":cataid,
			"resTitle": title,
			"showContent":showCon,
			"resContent":cont,
			"resUrl": url,
			"resLogo": logo
	};
	AppUtils.clientTransferInfo(cataid,content,quoteInfo);
};

ToolsUtils.alert = function(msg){
	if(msg ==''){
		return;
	}
	var ua = navigator.userAgent;
	if(ua.indexOf("ChaoXingStudy") > -1){
		AppUtils.clientMessageDisplay(msg);
	}else{
//		alert(msg);
		$(".myAlert").remove();
		var html = "<div class='myAlert' style='display:inline-block;width:150px;position:fixed;left:50%;top:50%;margin:-25px 0 0 -75px;z-index:999; text-align:center; background:rgba(0,0,0,.7); border-radius:5px; display:none;' ><a href=\"javascript:\" style='width:100%; min-height:50px; padding:10px;display:-webkit-box;-webkit-box-pack:center; -webkit-box-align:center; color:#FFF !important;'>"+msg+"</a></div>";

		$("body").append("\r\n"+html+"\r\n");
		$(".myAlert").fadeIn();
		function hide(){
			$(".myAlert").fadeOut();
		}
		setTimeout(hide, 2000)
	}
}

/**
 * 获取泛雅课堂描述，部分定制单位不想显示泛雅课堂，改为在线课堂
 */
ToolsUtils.getCXClassDesc = function (name) {
	if (!name || name.indexOf('泛雅') == -1) {
		return name;
	}
	// 现在说都不显示超星，都改为在线
	// if (ToolsUtils.getClientVersion('appId') == '1000311') {
	// 	// 国科大定制域名，泛雅课堂改为在线课堂
	// 	name = name.replace('超星', '在线');
	// }
	return name.replace('泛雅', '在线');;
}

/**
 * 检测是否是网址
 * @param linkStr
 * @returns {boolean}
 */
var urlReg = new RegExp('((((http[s]{0,1}|ftp)://)([a-zA-Z0-9\\-]+\\.)+[a-zA-Z0-9\\-]+(:\\d+)?)|(((http[s]{0,1}|ftp)://)?(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))(:\\d+)?)|(([a-zA-Z0-9\\-]+\\.)+((ac)|(ad)|(ae)|(aero)|(af)|(ag)|(ai)|(al)|(am)|(an)|(ao)|(ar)|(arpa)|(as)|(asia)|(at)|(au)|(aw)|(ax)|(az)|(ba)|(bb)|(bd)|(be)|(bf)|(bg)|(bh)|(bi)|(biz)|(bj)|(bm)|(bn)|(bo)|(br)|(bs)|(bt)|(bv)|(bw)|(by)|(bz)|(ca)|(cat)|(cc)|(cd)|(cf)|(cg)|(ch)|(chintai)|(ci)|(ck)|(cl)|(cm)|(cn)|(co)|(com)|(coop)|(cr)|(cu)|(cv)|(cx)|(cy)|(cz)|(de)|(dj)|(dk)|(dm)|(do)|(dz)|(ec)|(edu)|(ee)|(eg)|(er)|(es)|(et)|(eu)|(fi)|(fj)|(fk)|(fm)|(fo)|(fr)|(ga)|(gb)|(gd)|(ge)|(gf)|(gg)|(gh)|(gi)|(gl)|(global)|(globo)|(gm)|(gmail)|(gn)|(gov)|(gp)|(gq)|(gr)|(gs)|(gt)|(gu)|(gw)|(gy)|(hk)|(hm)|(hn)|(hr)|(ht)|(hu)|(id)|(ie)|(il)|(im)|(in)|(info)|(int)|(iq)|(ir)|(is)|(it)|(je)|(jm)|(jo)|(jobs)|(jp)|(ke)|(kg)|(kh)|(ki)|(km)|(kn)|(kp)|(kr)|(kw)|(ky)|(kz)|(la)|(lb)|(lc)|(li)|(lk)|(lr)|(ls)|(lt)|(lu)|(lv)|(ly)|(ma)|(mc)|(md)|(me)|(mg)|(mh)|(mil)|(mk)|(ml)|(mm)|(mn)|(mo)|(mobi)|(mp)|(mq)|(mr)|(ms)|(mt)|(mu)|(museum)|(mv)|(mw)|(mx)|(my)|(mz)|(na)|(name)|(nc)|(ne)|(net)|(nf)|(ng)|(ni)|(nl)|(no)|(np)|(nr)|(nu)|(nz)|(om)|(org)|(pa)|(pe)|(pf)|(pg)|(ph)|(pk)|(pl)|(pm)|(pn)|(pr)|(pro)|(ps)|(pt)|(pw)|(py)|(qa)|(re)|(ro)|(rs)|(ru)|(rw)|(sa)|(sb)|(sc)|(sd)|(se)|(sg)|(sh)|(si)|(sj)|(sk)|(sl)|(sm)|(smile)|(so)|(sr)|(st)|(su)|(sy)|(sz)|(tc)|(td)|(tel)|(tf)|(tg)|(th)|(tj)|(tl)|(tm)|(tn)|(to)|(tp)|(tr)|(travel)|(tt)|(tv)|(tw)|(tz)|(ua)|(ug)|(uk)|(us)|(uy)|(uz)|(va)|(vc)|(ve)|(vg)|(vi)|(vn)|(vu)|(wf)|(ws)|(ye)|(yt)|(za)|(zm)|(zw))(?![a-zA-Z0-9]))(:\\d+)?)))(/[a-zA-Z0-9\\.\\-~!@#$%^&#$%^&amp;*+?:_/=&lt;&gt;()]*)?','i');
ToolsUtils.checkUrl = function(linkStr) {
	if (!linkStr) {
		return false;
	}
	return urlReg.test(linkStr)
}

ToolsUtils.getWeekDes = function (weeks, weekType, maxWeek) {
	var weekArray = weeks.split(',');
	// 当学期总数变小时  处理一下周数据
	if (weekArray[weekArray.length-1] > maxWeek) {
		var newArray = new Array();
		for(var i = 0; i < weekArray.length; i++) {
			if (parseInt(weekArray[i]) <= maxWeek) {
				newArray.push(weekArray[i]);
			}
		}
		weekArray = newArray;
	}
	var weekDes = '';
	var weekText=getI18nText('周');
	var singleWeekText=getI18nText('单周');
	var doubleWeekText=getI18nText('双周');
	weekType = parseInt(weekType);
	// 当改变学期的总教学周数之后，如果有weekType但是总周数变了显示就会有问题，将课程的周数与总周数对比一下
	if (weekType == 0 && weeks != even(maxWeek)) {
		// 之前设置的双周，但是和修改总周数的后的双周数据不匹配
		weekType = -1;
	} else if (weekType == 1 && weeks != odd(maxWeek)) {//单周
		// 之前设置的单周，但是和修改总周数的后的单周数据不匹配
		weekType = -1;
	} else if (weekType == 2 && weekArray.length != maxWeek) {
		// 之前设置的全部，但是和修改总周数的后的全部周数据不匹配
		weekType = -1;
	}
	if (weekType == 0) {
		weekDes = '1-'+ maxWeek + weekText +'('+doubleWeekText+')';
	} else if (weekType == 1) {
		weekDes = '1-'+ maxWeek + weekText +'('+singleWeekText+')';
	} else if (weekType == 2) {
		weekDes = '1-'+ maxWeek + weekText;
	} else {
		var index = parseInt(weekArray[0]);
		var tindex = index;
		var isempty = '';
		for(var i = 1;i<weekArray.length;i++){
			var week = parseInt(weekArray[i])
			if(tindex+1 == week){
				tindex = week;
			}else{
				isempty = weekDes==''?'':'，';
				if(index!=tindex){
					weekDes += isempty + index + '-' + tindex+weekText;
				}else{
					weekDes += isempty + tindex +weekText;
				}
				tindex = index = week;
			}
		}
		isempty = weekDes==''?'':'，';
		if(index!=tindex){
			weekDes += isempty+index + '-' + tindex+weekText;
		}else{
			weekDes += isempty + tindex +weekText;
		}
	}
	weekDes = getI18nText('第') + weekDes;
	return weekDes;
}

function even(n){
	var arr = new Array();
	for(var i=1;i<=n;i++){
		if(i%2 == 0){//被2整除
			arr.push(i)
		}
	}
	return arr.join(',');
}
function odd(n){
	var arr = new Array();
	for(var i=1;i<=n;i++){
		if(i%2 != 0){//不能被2整除
			arr.push(i)
		}
	}
	return arr.join(',');
}

//取url后面的参数
ToolsUtils.getUrlParam = function(url,name) {
	if (url.indexOf("?") != -1) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r =url.split("?")[1].match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}else{
		return null;
	}
}

ToolsUtils.randomUUID = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

/**
 * 判断是否是教师
 * @param role
 * @returns {boolean}
 */
ToolsUtils.isTeacher = function(role) {
	return role && role > 0 && role < 4;
}

/**
 * 从cookie中取值
 * @param name
 * @returns {string|*}
 */
ToolsUtils.getCookie = function(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return '';
	}
}

/**
 * 是否在学习通中
 * @returns {""|boolean|boolean}
 */
ToolsUtils.isXXT = function () {
	var ua = navigator.userAgent.toLowerCase();
	return ua && ua.indexOf("chaoxingstudy")!=-1 && ua.indexOf('chaoxingstudypc') == -1;
}

//获取客户端API版本号
function getClientApiVersion(){
	var userAgent = navigator.userAgent;
	var pattern = ".*ChaoXingStudy_(\\d+)_(\\d+[^_]*)_([^_]*)_([^_]*)_([^ ]*)?( \\([^)]*\\))?.*_(.*[-]?\\w+).*";
	if(userAgent.indexOf("ChaoXingStudy_")==-1){
		return 0;
	}
	var versionArray = userAgent.match(pattern);
	if(versionArray!="undefined"&&versionArray.length>6){
		var ApiVersion = versionArray[5].split("_")[1];
		return ApiVersion;
	}
	return 0;
}

/**
 * 是否是内测版
 * @returns {""|boolean|boolean}
 */
ToolsUtils.isBetaVersion = function () {
	var ua = navigator.userAgent.toLowerCase();
	return ua && ua.indexOf('@azeroth')>-1;
}

/**
 * 是否是市场版
 * @returns {""|boolean|boolean}
 */
ToolsUtils.isMarketVersion = function () {
	var ua = navigator.userAgent.toLowerCase();
	return ua && ua.indexOf('@kalimdor')>-1;
}
