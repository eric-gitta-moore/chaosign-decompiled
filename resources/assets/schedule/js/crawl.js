CrawlUtils = {
    getHtml : function(){},
    index : 0,
    servicer: 0, // 服务提供商，1、正方；2、青果；3、强智
};

// 导入课表
CrawlUtils.getHtml = function(){

	CrawlUtils.index = 0;
    var html = document.body.innerHTML;
    if (window.location.href.indexOf('xk.henu.edu.cn') > -1) {
    	// 河南大学单独处理
    	try {
    		a = document.getElementById('mfrRows');
        	b = a.getElementsByTagName('frame')[1];
        	c = b.contentDocument.getElementById('frmDesk');
        	d = c.contentDocument.getElementById('frame_1');
        	e = d.contentDocument.getElementById('frmReport');
        	f = e.getAttribute('src');
			CrawlUtils.getIframeHtml(f);
        	return;
    	} catch(err){}
    } else if (window.location.href.indexOf('jwgl.thxy.cn') > -1) {
    	// 广州理工学院，课表页面在多级iframe里面，单独处理
		var iframes = document.getElementsByTagName('iframe');
		if (iframes && iframes.length > 0) {
			for(var i=0; i<iframes.length; i++) {
				if (iframes[i].src.indexOf('xsgrkbcx!xsgrkbMain.action') > -1)  {
					var iframe = iframes[i].contentDocument.getElementById('wdkb');
					if (iframe) {
						iframe = iframe.contentDocument.getElementsByTagName('iframe');
						if (iframe) {
							var src = iframe[0].src
							CrawlUtils.getIframeHtml('http://jwgl.thxy.cn/xsgrkbcx!getKbRq.action' + src.substring(src.indexOf('?')));
						}
					}
					return;
				}
			}
		}
	} else if (window.location.href.indexOf('jw.gdsspt.cn') > -1) {
    	// 广东松山职业技术学院 http://jw.gdsspt.cn:88/，课表页面在多级iframe里面，单独处理
		var iframes = document.getElementsByTagName('iframe');
		if (iframes && iframes.length > 0) {
			for(var i=0; i<iframes.length; i++) {
				if (iframes[i].src.indexOf('EducationSchedulingReport/UserReport') > -1)  {
					var iframe = iframes[i].contentDocument.getElementsByTagName('iframe');
					if (iframe) {
						var src = iframe[0].src
						CrawlUtils.getIframeHtml(src);
					}
					return;
				}
			}
		}
	}else if (window.location.href.indexOf('210.44.16.13') > -1) {
    	// 济宁医学院 http://210.44.16.13/，课表页面在多级iframe里面，单独处理
		// 并且需要访问 http://210.44.16.13/xsgrkbcx!xsAllKbList.action?xnxqdm=202102 才能获取一学期的全部课表
		var iframes = document.getElementsByTagName('iframe');
		if (iframes && iframes.length > 0) {
			for(var i=0; i<iframes.length; i++) {
				if (iframes[i].src.indexOf('xsgrkbcx!xsgrkbMain.action') > -1)  {
					var src = 'http://210.44.16.13/xsgrkbcx!xsAllKbList.action?xnxqdm=202102';
					CrawlUtils.getIframeHtml(src);
					return;
				}
			}
		}
	}else if (window.location.href.indexOf('jw.chaoxing.com') > -1) {
    	// 云南国防工业职业技术学院 https://ynou.jw.chaoxing.com/，
		// 黑龙江生物科技职业学院 https://hljswkj.jw.chaoxing.com/
		// 课表页面虽然在一级iframe里面，但是需要访问接口 https://ynou.jw.chaoxing.com/admin/pkgl/xskb/sdpkkbList?xnxq=2021-2022-2&xhid=202100004218&xqdm=5 才能获取一学期的全部课表（返回的是json数据）
		var iframes = document.getElementsByTagName('iframe');
		if (iframes && iframes.length > 0) {
			for(var i=0; i<iframes.length; i++) {
				if (iframes[i].src.indexOf('pkgl/xskb/queryKbForXsd') > -1)  {
					var xnxq = iframes[i].contentDocument.getElementById('xnxq').value;
					var xhid = iframes[i].contentDocument.getElementById('xhid').value;
					var xqdm = iframes[i].contentDocument.getElementById('xqdm').value;
					var src = window.location.origin + '/admin/pkgl/xskb/sdpkkbList?xnxq=' +xnxq+ '&xhid=' +xhid+ '&xqdm=' +xqdm;
					CrawlUtils.getIframeHtml(src);
					return;
				}
			}
		}
	}else if (window.location.href.indexOf('urp.hebau.edu.cn') > -1){
		// 河北农业大学 http://urp.hebau.edu.cn:9002/，课表页面在<frame>标签里面
		var frames = document.getElementsByTagName('frame');
		if (frames && frames.length > 1) {
			html = frames[1].contentDocument.getElementsByTagName('frame')[2].contentDocument.body.innerHTML
			CrawlUtils.postbackData(html);
			return;
		}
	}else if (window.location.href.indexOf('msjw.humc.edu.cn') > -1){
		// 河南开封科技传媒 https://msjw.humc.edu.cn/，课表页面在多层<iframe>标签里面
		var iframes = document.getElementsByTagName('iframe');
		if (iframes && iframes.length > 1) {
			for(var i=0; i<iframes.length; i++) {
				if (iframes[i].src.indexOf('frame/home/homepage.jsp') > -1)  {
					var myiframes = iframes[i].contentDocument.getElementsByTagName('iframe');
					if (myiframes && myiframes.length > 1) {
						for(var j=0; j<myiframes.length; j++) {
							if (myiframes[j].src.indexOf('student/xkjg.wdkb.jsp') > -1)  {
								html = myiframes[j].contentDocument.getElementsByTagName('iframe')[0].contentDocument.body.innerHTML
								CrawlUtils.postbackData(html);
								return;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * 页面抓取逻辑：首先判断当前页面document.body.innerHTML中是否含有‘星期’，有就直接把html入库解析。
	 * 没有‘星期’就遍历所有iframe，直到iframe页面上包含‘星期’。对于课表数据在多级iframe里的，需要单独处理。
	 */
	if (typeof CrawlUtils.jsbridge != 'undefined') {
    	if (html.indexOf('星期') == -1) {
    		// 不包含星期，当前页面里面可能没有课表数据，课表数据嵌入在iframe里面
    		var iframes = document.getElementsByTagName('iframe');
    		if (iframes && iframes.length > 0) {
    			for(var i=0; i<iframes.length; i++) {
    				if (iframes[i].src && iframes[i].src.indexOf('http') > -1) {
    					// ios客户端注入jsbridge，是注入的一个iframe标签，判断是http开头的地址才抓取
						CrawlUtils.index = i;
						// 有的学校（eg：河北经贸大学）是iframe里面嵌入的一个form，地址在form上
						var form = iframes[i].contentWindow.document.getElementsByTagName('form');
						if (form.length > 0 && form[0].getAttribute('action')) {
							var formUrl = form[0].getAttribute('action');
							if (formUrl.indexOf('http') == -1) {
								formUrl = window.location.host + '/' + formUrl;
							}
							CrawlUtils.getIframeHtml(formUrl);
							break;
						}
						CrawlUtils.getIframeHtml(iframes[i].src);
						break;
					}
				}
    			return;
    		}
    	}
    	CrawlUtils.postbackData(html);
    }
}

setTimeout(function(){
    if (typeof androidjsbridge != 'undefined') {
        CrawlUtils.jsbridge = androidjsbridge;
        
        // 安卓的协议回传通过jsBridge.trigger触发，这里定义下jsBridge.trigger方法
        window.jsBridge = {};
        jsBridge.trigger = function(name, object) {
        	if (name == 'CLIENT_OPEN_URL') {
        		CrawlUtils.openUrlCallback(object)
        	}
        }
    } else if (typeof jsBridge != 'undefined'){
        CrawlUtils.jsbridge = jsBridge;
    } 
    // 设置右上角按钮
    if (typeof CrawlUtils.jsbridge != 'undefined') {
        var param = {
            "show":1,
            "menu":"导入课表",
            "width":80,
            "option":"CrawlUtils.getHtml()"
        }
        if (typeof androidjsbridge != 'undefined') {
            // 安卓，参数要传String类型
            param = JSON.stringify(param);
        }
        CrawlUtils.jsbridge.postNotification('CLIENT_CUSTOM_MENU', param);
        
        // 有bind方法，绑定openurl协议回传的数据
        if (typeof CrawlUtils.jsbridge.bind == 'function') {
    		CrawlUtils.jsbridge.bind('CLIENT_OPEN_URL', function(object){
    			CrawlUtils.openUrlCallback(object)
        	});
    	}
    }
    var html = document.body.innerHTML;
    if (html.indexOf('正方') > -1) {
    	CrawlUtils.servicer = 1;
    } else if (html.indexOf('青果') > -1) {
    	CrawlUtils.servicer = 2;
    } else if (html.indexOf('强智') > -1) {
    	CrawlUtils.servicer = 3
    }

    var curriculumUuid = getUrlParam(window.location.href, 'uuid');
    if (curriculumUuid) {
		localStorage.setItem('curriculumUuid', curriculumUuid)
	}
},150)

/**
 * 获取iframe里面的html 
 */
CrawlUtils.getIframeHtml = function(url) {
	if (url.indexOf('http') == -1) {
		url = 'http://' + url;
	}
	var param = {
			loadType : 3,
			webUrl : url,
			reqHeader: {Referer:window.location.href},
	}
	if (CrawlUtils.isIos()) {
		if (window.location.href.indexOf('webvpn.heuet.edu.cn') > -1) {
			param.resetCookie = 1;
		}
	}
	if (typeof androidjsbridge != 'undefined') {
      // 安卓，参数要传String类型
      param = JSON.stringify(param);
	}
	CrawlUtils.index++;
	CrawlUtils.jsbridge.postNotification('CLIENT_OPEN_URL', param);

	CrawlUtils.isRequesting = true;
	// 客户端请求超时时间为15s，有点长，自行检测3s后没有收到响应结果就认为请求超时了
	setTimeout(function (){
		if (CrawlUtils.isRequesting) {
			alert('请求超时，请稍后再试！')
		}
	}, 3000);
}

var conflictLessonConfigUuids = '';

/**
 * 通过openurl协议请求iframe里面的地址后的数据回传后的处理逻辑
 */
CrawlUtils.openUrlCallback = function(object) {
	CrawlUtils.isRequesting = false;
	if (!object) {
		return;
	}
	var backData = object.data;
	if (typeof object.data == 'string' && object.data.indexOf('craw') > -1) {
		try {
			backData = JSON.parse(object.data)
		} catch (e) {

		}
	}
	if (backData.data && backData.data.type == 'craw') {
		// 调用导入接口后的返回值
		if (backData.data.conflictLessonConfigUuids) {
			// 有冲突的课
			conflictLessonConfigUuids = backData.data.conflictLessonConfigUuids;

			// 有的学校页面自己定义了 $ 对象，不能直接使用 jQuery的方法，改用 js 原生方法去创建标签
			var s_div = document.getElementsByClassName('coverModal')[0];
			if (typeof s_div  == 'undefined') {
				s_div = document.createElement('div');
				s_div.setAttribute('class', 'centerMask coverModal')
				s_div.setAttribute('style', 'display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);z-index: 1099;');
				document.body.appendChild(s_div);
			}
			// $('.coverModal').remove();
			var coverHtml =
				// '<div class="centerMask coverModal" style="display: block;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);z-index: 1099;">' +
			'<div class="centerModal" style="width: 610px;padding: 0;border-radius: 30px;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #FFFFFF;position: absolute;">' +
			'<div class="centerCon bottomLine" style="padding: 20px 30px;min-height: 100px;text-align: center;">' +
			'<p class="context" style="font-size: 40px;line-height: 1.5;">' +
			'有'+ conflictLessonConfigUuids.split(',').length +'门课的上课时间与课表已有课程冲突，本次导入是否覆盖冲突课程？' +
			'</p>' +
			'</div>' +
			'<div class="centerBottom">' +
			'<p class="bottomLine sure" style="height: 100px;line-height: 100px;text-align: center;color: #0099FF;font-size: 37px;border-top: solid 1px #ebebeb;">' +
			'覆盖' +
			'</p>' +
			'<p class="bottomLine notCover" style="height: 100px;line-height: 100px;text-align: center;color: #0099FF;font-size: 37px;border-top: solid 1px #ebebeb;">' +
			'不覆盖' +
			'</p>' +
			'<p class="cancel" style="height: 100px;line-height: 100px;text-align: center;color: #0099FF;font-size: 37px;border-top: solid 1px #ebebeb;">' +
			'取消' +
			'</p>' +
			'</div>' +
			'</div>'
			// '</div>'
			// $('body').append(coverHtml);
			s_div.innerHTML = coverHtml;

			// 确定覆盖
			s_div.getElementsByClassName('sure')[0].addEventListener('click', function() {
				s_div.remove(0)
				CrawlUtils.importSchedule('', conflictLessonConfigUuids);
			})

			// 不覆盖
			s_div.getElementsByClassName('notCover')[0].addEventListener('click', function() {
				s_div.remove(0)
				CrawlUtils.importSchedule('https://kb.chaoxing.com/curriculum/importSchedule?cuuid='+localStorage.getItem('curriculumUuid'));
			})
			// 取消
			s_div.getElementsByClassName('cancel')[0].addEventListener('click', function() {
				s_div.remove(0);
			})

			// $('.coverModal .sure').click(function () {
			// 	$('.coverModal').remove();
			// 	CrawlUtils.importSchedule('', conflictLessonConfigUuids);
			// })
			//
			// // 不覆盖
			// $('.coverModal .notCover').click(function () {
			// 	$('.coverModal').remove();
			// 	CrawlUtils.importSchedule('https://kb.chaoxing.com/curriculum/importSchedule');
			// })
			//
			// // 取消
			// $('.coverModal .cancel').click(function () {
			// 	$('.coverModal').remove();
			// })
		} else if (backData.result == 0) {
			if (backData.msg) {
				// ios 里面通过open_url请求接口时，由于ios目前（2021-09-03）不是按照 utf-8 解析的返回结果，会导致中文乱码，改为服务端编码后返回，页面上解码
				alert(decodeURIComponent(decodeURIComponent(backData.msg)));
			} else {
				alert('导入失败')
			}
		} else if (backData.result == 1) {
			if (backData.data.state != 1) {
				// 数据解析不成功，提示用户
				alert('数据解析失败');
			} else {
				// ios里面收到的接口返回的数据中文会乱码，不用接口返回的msg
				var msg = '导入成功'
				if (backData.data.clashNum) {
					msg = '导入成功,有' + backData.data.clashNum + '门课与当前课表冲突未导入'
				}
				CrawlUtils.returnTome(msg);
			}
		}
		return;
	}

	// 通过openurl访问对应的页面地址抓取页面后的回调

	if (window.location.href.indexOf('xk.henu.edu.cn') > -1 || window.location.href.indexOf('jwgl.thxy.cn') > -1
		|| window.location.href.indexOf('jw.gdsspt.cn') > -1 || window.location.href.indexOf('210.44.16.13') > -1
		|| window.location.href.indexOf('jw.chaoxing.com') > -1) {
		// 河南大学、广州理工学院 等学院单独处理
		CrawlUtils.postbackData(object.data);
		return;
	}
	if (object && object.data && object.data.indexOf('星期') > -1) {
		// 页面中包含星期，认为当前页面包含课表数据
		CrawlUtils.postbackData(object.data)
	} else {
		// 页面中不包含课表数据
		var iframes = document.getElementsByTagName('iframe');
		if (CrawlUtils.index < iframes.length) {
			// 还有待遍历的iframe，继续处理
			for(var i=CrawlUtils.index; i<iframes.length; i++) {
				if (iframes[i].src && iframes[i].src.indexOf('http') > -1) {
					// ios客户端注入jsbridge，是注入的一个iframe标签，判断是http开头的地址才抓取
					CrawlUtils.index = i;
					// 有的学校（eg：河北经贸大学）是iframe里面嵌入的一个form，地址在form上
					var form = iframes[i].contentWindow.document.getElementsByTagName('form');
					if (form.length > 0 && form[0].getAttribute('action')) {
						var formUrl = form[0].getAttribute('action');
						if (formUrl.indexOf('http') == -1) {
							formUrl = window.location.host + '/' + formUrl;
						}
						CrawlUtils.getIframeHtml(formUrl);
						break;
					}
					CrawlUtils.getIframeHtml(iframes[i].src);
					break;
				}
			}
		} else {
			// 遍历完了，还未找到对应的数据，回传当前页面的内容
			CrawlUtils.postbackData(document.body.innerHTML)
		}
	}
}

CrawlUtils.html = '';
/**
 * 数据回传给上一个页面
 * 改为在当前页面导入 2021-05-11
 */
CrawlUtils.postbackData = function(html) {
	// var param = {
	// 	'typeflag':'CXWEB_DATA_CRAWL_HTML',
	// 	'info':{'html':html,'schoolUrl':window.location.href, 'servicer':CrawlUtils.servicer}
	// }
	// if (typeof androidjsbridge != 'undefined') {
	// 	// 安卓，参数要传String类型
	// 	param = JSON.stringify(param);
	// }
	// CrawlUtils.jsbridge.postNotification('CLIENT_WEB_EXTRAINFO', param);
	// CrawlUtils.jsbridge.postNotification('CLIENT_EXIT_LEVEL', {});
	CrawlUtils.html = html;
	CrawlUtils.importSchedule();
}

CrawlUtils.importSchedule = function(webUrl, coverLessonConfigUuids) {
	var postData = {
		"curriculumUuid": localStorage.getItem('curriculumUuid') || '',
		"html" : CrawlUtils.html,
		"schoolUrl" : window.location.href,
		"servicer" : CrawlUtils.servicer || 0,
		"coverLessonConfigUuids" : coverLessonConfigUuids || '',
	}
	if (!webUrl) {
		//课表uuid放到url上，便于查日志
		webUrl = 'https://kb.chaoxing.com/curriculum/importScheduleNew?cuuid='+localStorage.getItem('curriculumUuid');
	}
	var param = {
		loadType : 3,
		webUrl : webUrl,
		postData : postData
	}
	if (typeof androidjsbridge != 'undefined') {
		// 安卓，参数要传String类型
		param = JSON.stringify(param);
	}
	CrawlUtils.jsbridge.postNotification('CLIENT_OPEN_URL', param);
}

CrawlUtils.loadCssFile = function(url) {
	if (!url) {
		return;
	}
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = url
	document.getElementsByTagName("head")[0].appendChild(link);
}

CrawlUtils.returnTome = function (msg) {
	var param = {
		'typeflag':'CXWEB_DATA_RELOAD',
		'msg' : msg || '导入成功',
	}
	if (typeof androidjsbridge != 'undefined') {
		// 安卓，参数要传String类型
		param = JSON.stringify(param);
	}
	CrawlUtils.jsbridge.postNotification('CLIENT_WEB_EXTRAINFO', param);
	CrawlUtils.jsbridge.postNotification('CLIENT_EXIT_LEVEL', {});
}

// 取url后面的参数
function getUrlParam(url, name) {
	if (url.indexOf("?") != -1) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = url.split("?")[1].match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	} else {
		return null;
	}
}

CrawlUtils.isIos = function () {
	var agent = navigator.userAgent.toLowerCase(); //检测是否是ios
	if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
		return true;
	}
	return false;
}

