var attachmentUtils = {
	showCloseIframe : function(){},
	openClickEvent : function(){},
	openCloudClickEvent : function(){},
	showvoiceIcon : function(){},
	openVoiceClickEvent : function(){},
	revoiceTit : function(){},
}
attachmentUtils.showiframeClose = function(cid,editorClientType){
	if(editorClientType == true){
    	if (isAndroid && (typeof javaJs !== 'undefined')) {
           javaJs.executeParentJs('zss_editor.isiframeClose("'+cid+'")');
        }
        if (isIOS) {
            if(window.webkit && window.webkit.messageHandlers.executeParentJs){
            window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.isiframeClose("'+cid+'")']);
            }else{
    　　　　     if(window.top["executeParentJs"]) {
                    window.top["executeParentJs"]('zss_editor.isiframeClose("'+cid+'")');
                }
            }
        }
    }else{
    	//显示删除附件叉号2021.05
    	parent.postMessage({'msgType':'showiframeClose','cid': cid}, '*');
    }
}
attachmentUtils.showvoiceIcon = function(cid,editorClientType){
	if(editorClientType == true){
    	if (isAndroid && (typeof javaJs !== 'undefined')) {
           javaJs.executeParentJs('zss_editor.isvoiceIcon("'+cid+'")');
        }
        if (isIOS) {
            if(window.webkit && window.webkit.messageHandlers.executeParentJs){
            window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.isvoiceIcon("'+cid+'")']);
            }else{
    　　　　     if(window.top["executeParentJs"]) {
                    window.top["executeParentJs"]('zss_editor.isvoiceIcon("'+cid+'")');
                }
            }
        }
    }else{
    	//显示修改录音标题图标2021.05
    	parent.postMessage({'msgType':'showvoiceIcon','cid': cid}, '*');
    }
}
// 附件点击调客户端方法
attachmentUtils.openClickEvent = function(e,attachment,json,editorClientType){
    if(e.target.className && e.target.className.indexOf('closeAnnex')!=-1){
        if(json.cid){
            var cid=json.cid;
            if(editorClientType == true){
            	if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.executeParentJs('zss_editor.oniframeClose("'+cid+'")');
                }
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.executeParentJs){
                    window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.oniframeClose("'+cid+'")']);
                    }else{
            　　　　     if(window.top["executeParentJs"]) {
                            window.top["executeParentJs"]('zss_editor.oniframeClose("'+cid+'")');
                        }
                    }
                }
            }else{
            	//删除附件2021.05
    			parent.postMessage({'msgType':'deleteIframe','cid': cid}, '*');
            }
        }
    }else{
        if(editorClientType == true){
            //android
            if (isAndroid && (typeof javaJs !== 'undefined')) {
               javaJs.onClickAttachment(attachment);
            }
            //ios
            if (isIOS) {
                if(window.webkit && window.webkit.messageHandlers.onClickAttachment){
                     window.webkit.messageHandlers.onClickAttachment.postMessage([attachment]);
                 }else{
        　　　　      			 if(window.top["onClickAttachment"]) {
                        window.top["onClickAttachment"](attachment);
                    }
                 }
            }
        }else{
        	// 附件点击事件交给父级页面处理
			parent.postMessage({'msgType':'clickEvent','attachment': json}, '*');
        }
    }
};
//云盘附件点击
attachmentUtils.openCloudClickEvent = function(e,attachment,json,editorClientType){
	if(e.target.className && e.target.className.indexOf('closeAnnex')!=-1){
        if(json.cid){
            var cid=json.cid;
            if(editorClientType == true){
            	if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.executeParentJs('zss_editor.oniframeClose("'+cid+'")');
                }
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.executeParentJs){
                    window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.oniframeClose("'+cid+'")']);
                    }else{
            　　　　     if(window.top["executeParentJs"]) {
                            window.top["executeParentJs"]('zss_editor.oniframeClose("'+cid+'")');
                        }
                    }
                }
            }else{
            	//删除附件2021.05
    			parent.postMessage({'msgType':'deleteIframe','cid': cid}, '*');
            }

        }
    }else if($(e.target).is('.insertVoice') || $(e.target).parents('.insertVoice').length>0){

    		var version = null;
            if(isIOS){
                version = versionSame('4.7.3.3');
            }
            if(isAndroid){
                version = versionSame('4.7.3.6');
            }
            if(version && json.cid){
                var cid=json.cid;
                if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.executeParentJs('zss_editor.onMarkiframeClick("'+cid+'")');
                }
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.executeParentJs){
                    window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.onMarkiframeClick("'+cid+'")']);
                    }else{
            　　　　    				 if(window.top["executeParentJs"]) {
                            window.top["executeParentJs"]('zss_editor.onMarkiframeClick("'+cid+'")');
                        }
                    }
                }
            }else{
                //android
                if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.onClickAttachment(attachment);
                }
                //ios
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.onClickAttachment){
                         window.webkit.messageHandlers.onClickAttachment.postMessage([attachment]);
                     }else{
            　　　　   			    if(window.top["onClickAttachment"]) {
                            window.top["onClickAttachment"](attachment);
                        }
                     }
                }
            }


    }else{
    	if(editorClientType == true){
            //android
            if (isAndroid && (typeof javaJs !== 'undefined')) {
               javaJs.onClickAttachment(attachment);
            }
            //ios
            if (isIOS) {
                if(window.webkit && window.webkit.messageHandlers.onClickAttachment){
                     window.webkit.messageHandlers.onClickAttachment.postMessage([attachment]);
                 }else{
        　　　　      			 if(window.top["onClickAttachment"]) {
                        window.top["onClickAttachment"](attachment);
                    }
                 }
            }
        }else{
        	// 附件点击事件交给父级页面处理
			parent.postMessage({'msgType':'clickEvent','attachment': json}, '*');
        }
    }
}
attachmentUtils.openVoiceClickEvent = function(e,attachment,json,editorClientType){
	if(e.target.className && e.target.className.indexOf('audio-chat-fail')!=-1 || e.target.className.indexOf('audio-infor-fail')!=-1){
        //上传失败重新上传
        reuploadFile(attachment);
    }else if(e.target.className && e.target.className.indexOf('voiceIcon')!=-1){
        // 修改录音标题
        var newname = $(".attach_item h2").html();
        attachmentUtils.revoiceTit(attachment,newname,editorClientType);
    }else if(e.target.className && e.target.className.indexOf('closeAnnex')!=-1){
        if(json.cid){
            var cid=json.cid;
            if(editorClientType == true){
            	if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.executeParentJs('zss_editor.oniframeClose("'+cid+'")');
                }
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.executeParentJs){
                    window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.oniframeClose("'+cid+'")']);
                    }else{
            　　　　     if(window.top["executeParentJs"]) {
                            window.top["executeParentJs"]('zss_editor.oniframeClose("'+cid+'")');
                        }
                    }
                }
            }else{
            	//删除附件2021.05
    			parent.postMessage({'msgType':'deleteIframe','cid': cid}, '*');
            }
        }
    }else{
    	if(editorClientType == true){
    		if(json.cid){
                var cid=json.cid;
                if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.executeParentJs('zss_editor.onMarkiframeClick("'+cid+'")');
                }
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.executeParentJs){
                    window.webkit.messageHandlers.executeParentJs.postMessage(['zss_editor.onMarkiframeClick("'+cid+'")']);
                    }else{
            　　　　     				if(window.top["executeParentJs"]) {
                            window.top["executeParentJs"]('zss_editor.onMarkiframeClick("'+cid+'")');
                        }
                    }
                }
            }else{
                //android
                if (isAndroid && (typeof javaJs !== 'undefined')) {
                   javaJs.onClickAttachment(attachment);
                }
                //ios
                if (isIOS) {
                    if(window.webkit && window.webkit.messageHandlers.onClickAttachment){
                         window.webkit.messageHandlers.onClickAttachment.postMessage([attachment]);
                     }else{
            　　　　       				if(window.top["onClickAttachment"]) {
                            window.top["onClickAttachment"](attachment);
                        }
                     }
                }
            }
    	}else{
    		// 附件点击事件交给父级页面处理
			parent.postMessage({'msgType':'playMedia','mediaType': 'audio', 'media': json}, '*');
    	}

    }
}
//修改录音标题
attachmentUtils.revoiceTit = function(attachment,n,editorClientType){
	if(editorClientType == true){
		//android
        if (isAndroid && (typeof javaJs !== 'undefined')) {
           javaJs.revoiceTit(attachment,n);
        }
        //ios
        if (isIOS) {
            var tmp = {};
            tmp.title = n;
            tmp.attachment = attachment;
            if(window.webkit && window.webkit.messageHandlers.revoiceTit){
                window.webkit.messageHandlers.revoiceTit.postMessage([JSON.stringify(tmp)]);
            }else{
                if(window.top["revoiceTit"]){
                    window.top["revoiceTit"](JSON.stringify(tmp));
                }
            }
        }
	}else{
		var tmp = {};
        tmp.title = n;
        tmp.attachment = attachment;
		parent.postMessage({'msgType':'revoiceTit', 'attachment': tmp}, '*');
	}
}
function formartTime(time) {
    var newtime;
    if (null != time) {
        if(time < 60){
            var seconds = parseInt(time) < 10 ? ('0' + parseInt(time)) : parseInt(time);
            newtime = '00:' + seconds;
        }else  if (time >= 60 && time < 60 * 60) {
            var minute = parseInt(time / 60.0) < 10 ? ('0' + parseInt(time / 60.0)) : parseInt(time / 60.0);
            var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
            newtime = minute + ':' + seconds;
        }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            var hour = parseInt(time / 3600.0) < 10 ? ('0' + parseInt(time / 3600.0)) : parseInt(time / 3600.0);
            var minute = (parseInt(time / 60.0 % 60.0) < 10) ? ('0' + parseInt(time / 60.0 % 60.0)) : parseInt(time / 60.0 % 60.0);
            var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
            newtime = hour + ':' + minute + ':' + seconds;
        }
    }
    return newtime;
}
//文件大小格式
function sizeformat(bytes){
    if (bytes / 1024 > 1) {
        if (bytes / (1024 * 1024 * 1024) > 1) {
            return "" + (bytes/(1024 * 1024 * 1024)).toFixed(1) + "GB";
        } else if (bytes / (1024 * 1024) > 1) {
            return "" + (bytes/(1024 * 1024)).toFixed(1) + "MB";
        } else {
            return "" + parseInt(bytes/1024) + "KB";
        }
    } else {
        return "" + bytes + "B";
    }
}
//时间格式化
function timeformat(limit){
    if(!limit){
        return "0秒";
    }
    limit = parseInt(limit);
    var index=0;
    var timeUnit=new Array('秒','分','小时');
    var timeArray = new Array();
    if(limit>=60){
        while(limit>=60){//数字部分1到60之间
            timeArray.push(limit%60);
            limit = parseInt(limit/60);
            index += 1;
        };
    }
    timeArray.push(limit);
    var timeFormat = "";
    for(var i=timeArray.length-1;i>=0;i--){
        timeFormat += timeArray[i]+timeUnit[i];
    }
    return timeFormat;
}
//xss过滤规则
var xssReg=new RegExp("(\\baler(?=t\\s*\\())|(\\bhref(?=\\s*=\\s*['\"]?\\s*javascript:))|(\\bsrc(?=\\s*=\\s*['\"]?\\s*javascript:))|((data|src)\\s*=['\"]?\\s*data(?=:)(?!:\\s*image))|(^[^<]*<(?=/textarea\\s*>))|(<(?=(script)|(/script)))|(<(?=(details)|(/details)))|(\\b(onstart|onafterprint|onbeforeprint|onbeforeunload|onerror|onhaschange|onload|onmessage|onoffline|ononline|onpagehide|onpageshow|onpopstate|onredo|onresize|onstorage|onundo|onunload|onblur|onchange|oncontextmenu|onfocus|onformchange|onforminput|oninput|oninvalid|onreset|onreset|onsubmit|onkey\\w*|onclick|ondblclick|ondrag\\w*|ondrop|onmouse\\w*|onscroll|ontouch\\w*)(?=(\\s*)=))",'gi')
// base64编码
function b64EncodeUnicode(str) {
    str=str.replace(xssReg,function(){
        return arguments[0] + '　';
    })
    return btoa(encodeURIComponent(str))
}
// base64解码
function b64DecodeUnicode(str) {
    str = decodeURIComponent(atob(str))
    str=str.replace(xssReg,function(){
        return arguments[0] + '　';
    })
    return str
}
// 转义字符
function html_encode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&apos;");
    s = s.replace(/\"/g, "&quot;");
    return s;

}

function html_decode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&apos;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}
