//textarea自带增高
(function($){
    $.fn.autoHeight = function(options) {
　　　　 var defaults={
　　　　　　 maxHeight:null,//文本框是否自动撑高,默认:null,不自动撑高;如果自动撑高必须输入数值,该值作为文本框自动撑高的最大高度
　　　　　　 minHeight:$(this).outerHeight() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
　　　　  };
	　　var opts = $.extend({},defaults,options);
	　　return $(this).each(function() {
	　　　　$(this).bind("input propertychange focus",function(){
	　　　　	var height,style=this.style;
	　　　　	this.style.height =  opts.minHeight + 'px';
	　　　　	if (this.scrollHeight > opts.minHeight) {
		　　　　　　if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
		　　　　　　　　	height = opts.maxHeight;
		　　　　　　　　	style.overflowY = 'scroll';
		　　　　　　}
		　　　　　　else {
		　　　　　　　　height = this.scrollHeight;
		　　　　　　　　style.overflowY = 'hidden';
		　　　　　　}
		　　　　　　style.height = height  + 'px';
	　　　    　}
	　　　　});
	　　 });
	　};

})(jQuery);

var scrollTop =0;
function stopscroll(){
	scrollTop = document.body.scrollTop || document.documentElement.scrollTop;// 在弹出层显示之前，记录当前的滚动位置
	document.body.classList.add('popOverflow');// 使body脱离文档流
	document.body.style.top = -scrollTop + 'px';// 把脱离文档流的body拉上去！否则页面会回到顶部！
}
function recoveryscroll(){
	document.body.classList.remove('popOverflow');// body又回到了文档流中
	document.body.scrollTop = document.documentElement.scrollTop = scrollTop;// 滚回到老地方
}
function showTips(msg){
	if (!msg) {
		return;
	}
	if($('.toastTips').length==0){
		$(document.body).append('<div class="toastTips">'+msg+'</div>')
	} else {
		$('.toastTips').text(msg);
	}
	$('.toastTips').show();
	setTimeout(function(){
		$('.toastTips').fadeOut();
	},2000)
}
//兼容h5和客户端
if(navigator.userAgent.indexOf('ChaoXingStudy') > -1){
	$('.fixedHead').hide();
}else{
	$('body').addClass('h5');
	if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != "micromessenger"){
		addIphoneHeight()
	}
}
// ios 高度适配
function addIphoneHeight(){
	var isIphone=/iphone/gi.test(navigator.userAgent);
	if(isIphone && screen.height > 736){
		$('body').addClass('iosxwrapMax');
	}else if(isIphone){
		$('body').addClass('ioswrapMax');
	}
}
CommonUtils = {}
CommonUtils.isTeacher = function(role) {
	return role && role > 0 && role < 4;
}

/**
 * 获取地址上的参数
 * @param param
 * @returns {string}
 */
function getUrlParameter(param){
	var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return r[2]; return ''; //返回参数值
}


/**
 * 根据上课信息获取表单新增页地址
 * @param param
 * @returns {string}
 */
function getFormAddUrl(lesson){
	if (!lesson){
		return;
	}
	var skrqStr = lesson.schoolYear + '-' + lesson.beginNumber.toString()+'-'+(parseInt(lesson.beginNumber)+parseInt(lesson.length)-1).toString()
	var tempBeginTime = lesson.lessonBeginTime.split(':')[0]
	if(lesson.lessonBeginTime.split(':')[0].length == 1){
		tempBeginTime = '0'+tempBeginTime
		console.log(tempBeginTime);
	}
	tempBeginTime = tempBeginTime + ':' + lesson.lessonBeginTime.split(':')[1] + ":00"

	var tempEndTime = lesson.lessonEndTime.split(':')[0]
	if(lesson.lessonEndTime.split(':')[0].length == 1){
		tempEndTime = '0'+tempEndTime
		console.log(tempEndTime);
	}
	tempEndTime = tempEndTime+ ':' + lesson.lessonEndTime.split(':')[1] + ":00"
	var param = {data :[]}
	var kcmc = {'alias': 'kcmc', 'val': [lesson.name?lesson.name.toString():''], 'compt': 'editinput'}
	var kcdm = {'alias': 'kcdm', 'val': [lesson.courseNo?lesson.courseNo.toString():''], 'compt': 'editinput'}
	var jsgh = {'alias': 'jsgh', 'val': [lesson.teacherNo?lesson.teacherNo.toString():''], 'compt': 'editinput'}
	var jsxm = {'alias': 'jsxm', 'val': [lesson.teacherName?lesson.teacherName.toString():''], 'compt': 'editinput'}
	var jxbmc = {'alias': 'jxbmc', 'val': [lesson.className?lesson.className.toString():''], 'compt': 'editinput'}
	var skrq = {'alias': 'skrq', 'val': [lesson.wholeDay?lesson.wholeDay.toString():''], 'compt': 'editinput'}
	var skjc = {'alias': 'skjc', 'val': [skrqStr], 'compt': 'editinput'}
	var skdd = {'alias': 'skdd', 'val': [lesson.location.toString()], 'compt': 'editinput'}
	var xn = {'alias': 'xn', 'val': [ lesson.schoolYear + '-' + (parseInt(lesson.schoolYear)+1)], 'compt': 'editinput'}
	var xq = {'alias': 'xq', 'val': ['第'+ lesson.semester + '学期'], 'compt': 'editinput'}
	var skzc = {'alias': 'skzc', 'val': [lesson.week.toString()], 'compt': 'editinput'}
	var dayofweek = {'alias': 'dayofweek', 'val': [lesson.dayOfWeek.toString()], 'compt': 'editinput'}
	var courseid = {'alias': 'courseid', 'val': [lesson.courseId?lesson.courseId.toString():''], 'compt': 'editinput'}
	var classid = {'alias': 'classid', 'val': [lesson.classId?lesson.classId.toString():''], 'compt': 'editinput'}
	var uid = {'alias': 'uid', 'val': [lesson.puid?lesson.puid.toString():''], 'compt': 'editinput'}
	var starttime = {'alias': 'starttime', 'val': [lesson.lessonBeginTime?skrqStr + ' '+ tempBeginTime :''], 'compt': 'editinput'}
	var endtime = {'alias': 'endtime', 'val':[lesson.lessonEndTime?skrqStr + ' '+ tempEndTime :''], 'compt': 'editinput'}
	param.data.push(kcmc)
	param.data.push(kcdm)
	param.data.push(jsgh)
	param.data.push(jsxm)
	param.data.push(jxbmc)
	param.data.push(skrq)
	param.data.push(skjc)
	param.data.push(skdd)
	param.data.push(xn)
	param.data.push(xq)
	param.data.push(skzc)
	param.data.push(dayofweek)
	param.data.push(courseid)
	param.data.push(classid)
	param.data.push(uid)
	param.data.push(starttime)
	param.data.push(endtime)
	// console.log(param.data);
	// 填写表单数据
	var precast = encodeURIComponent(JSON.stringify(param))

	if(lesson.fid == 484){
		var url  = 'https://office.chaoxing.com/front/web/apps/forms/fore/apply?id=962046&formAppId=' +
		'&enc=8f00918bab7b78b6a8a27fafa0ceb560&appId=fdd38594125845489dfa1d42b2c9f50c&appKey=590R42Ho6QB0y6wc' +
		'&fidEnc=d2cf849eb79863b2&uid=100932412&mappId=8893288&formid=962046&roleid=217' +
		'&rolename=%E8%B6%85%E7%BA%A7%E7%AE%A1%E7%90%86%E5%91%98&topMenu=&mappIdEnc=0d791a3a818d023ce89bd7119d492e95' +
		'&permissionGroupId=&code=spOpYYkx&state=484' +
		'&precast='+precast;
		return url;
	}

	if(lesson.fid == 1035){
		var url  = 'https://office.chaoxing.com/front/web/apps/forms/fore/apply?id=934308&enc=a98c5f107e7632e8d1263aa9a5b0a20d'+
		'&precast='+precast;
		return url;
	}
	
}

/**
 * 目前前端页面上用的其他服务域名如下，如果有单位定制课表域名，需要注意以下服务的定制域名是否满足CommonUtils.convertUrl的通用替换方式
 * mooc1.chaoxing.com
 * mooc1-2.chaoxing.com
 * stat2-ans.chaoxing.com
 * mooc2-ans.chaoxing.com
 * mobilelearn.chaoxing.com
 * pan-yz.chaoxing.com
 * p.ananas.chaoxing.com
 * passport2.chaoxing.com
 * k.chaoxing.com
 * noteyd.chaoxing.com
 */
// CommonUtils.convertUrl = function (url, serverDomainKey) {
//
// 	url = window.location.protocol + url.replace('https:', '').replace('http:', '');
//
// 	//某些单位其他服务的定制域名，采用以下通用替换方式不合适，
// 	//比如武大 mobilelearn.chaoxing.com -> www.mooc.whu.edu.cn/ketang-mobilelearn
//
// 	/*武大定制域名*/
// 	if (window.location.host == 'www.mooc.whu.edu.cn'){
// 		if (url.indexOf('mooc1-2.chaoxing.com') > -1){
// 			url = url.replace('mooc1-2.chaoxing.com', 'www.mooc.whu.edu.cn/mooc-ans');
// 			return url;
// 		}
// 		if (url.indexOf('mobilelearn.chaoxing.com') > -1){
// 			url = url.replace('mobilelearn.chaoxing.com', 'www.mooc.whu.edu.cn/ketang-mobilelearn');
// 			return url;
// 		}
// 		if (url.indexOf('stat2-ans.chaoxing.com') > -1){
// 			url = url.replace('stat2-ans.chaoxing.com', 'www.mooc.whu.edu.cn/stat2');
// 			return url;
// 		}
// 		if (url.indexOf('pan-yz.chaoxing.com') > -1){
// 			url = url.replace('pan-yz.chaoxing.com', 'www.mooc.whu.edu.cn/pan');
// 			return url;
// 		}
// 		if (url.indexOf('passport2.chaoxing.com') > -1){
// 			url = url.replace('passport2.chaoxing.com', 'passport2.mooc.whu.edu.cn');
// 			return url;
// 		}
// 	}
//
// 	var mctx = window.location.pathname.substring(0, window.location.pathname.indexOf('/res')) || '';
// 	try {
// 		var protocol = window.location.protocol;
// 		// 获取当前域名，有一些单位定制了域名，需求请求对应的定制笔记域名
// 		// 例如: http://groupyd2.ecourse.ucas.ac.cn/pc/activity/activityList
// 		var domain = window.location.host;
// 		if (domain.indexOf('chaoxing.com') > -1) {
// 			// 当前是超星域名，不对url做处理
// 			if (protocol == 'http:') {
// 				// 当前协议是http的，之前http页面可以调用https的接口，现在新版的chrome浏览器上面不行了，这里做下域名适配
// 				url = url.replace('https://', 'http://');
// 			}
// 			return url;
// 		}
//
// 		if (mctx){
// 			//域名+分路径
// 			//截取url中的服务名和域名
// 			var urlServerName = url.substring(url.indexOf('://')+3, url.indexOf('.chaoxing.com'));
// 			var urlDomain = url.substring(url.indexOf('://')+3, url.indexOf('.chaoxing.com')+13);
//
// 			serverDomain = domain + '/' + urlServerName;
// 			url = url.replace(urlDomain, domain);
// 		}else {
// 			// 截取域名
// 			domain = domain.substring(domain.indexOf('.'))
// 			// 笔记服务和小组，有http页面是两级的，note.yd.chaoxing.com , group.yd.chaoxing.com，去掉yd
// 			domain = domain.replace('.yd.', '.');
//
// 			if (protocol == 'http:' && url.indexOf('https://noteyd.chaoxing.com') > -1) {
// 				// 当前页面是http协议的，使用的接口地址是笔记的https域名，需要改成笔记http域名，大多定制单位都是配置http的定制域名，没有配https的
// 				url = url.replace('https://noteyd.chaoxing.com', 'http://note.yd' + domain)
// 			} else {
// 				if (url.indexOf('mooc1-2.chaoxing.com') > -1) {
// 					// 目前看一个定制域名的单位（国科大），慕课域名是用的mooc1，mooc1.ecourse.ucas.ac.cn
// 					url = url.replace('mooc1-2.chaoxing.com', 'mooc1.chaoxing.com')
// 				}
// 				url = url.replace('.chaoxing.com', domain);
// 			}
// 		}
//
// 		if (protocol == 'http:' && url.indexOf('https://') > -1) {
// 			// 当前页面是http的，请求的地址是https的换，换成http
// 			url = url.replace('https://', 'http://')
// 		}
// 	} catch (e) {
//
// 	}
// 	return url;
// }