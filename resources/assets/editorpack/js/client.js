/**
 * 调客户端协议的方法,
 * name: 协议名
 * arr：数组，调协议传的参数[参数1，参数2]，安卓数组里的参数1参数2只能是字符串
 */
function clientMessage(name, arr) {
	if (!arr) arr = [];
	if (cxeditor.isAndroid) {//android
		arr.forEach(function (item,index) {
			if(typeof item != 'string'){
				arr[index] = JSON.stringify(item)
			}
		})
		if(name == 'onPasteEvent'){
			let res = javaJs.commonMessage(name, arr);
			return res;
		}else{
			javaJs.commonMessage(name, arr);
		}
	}
	if (cxeditor.isIOS) {//ios
		if (window.webkit && window.webkit.messageHandlers.commonMessage) {
			window.webkit.messageHandlers.commonMessage.postMessage([name, arr]);
		}
	}
}

/**
 * 通过客户端调用接口的方法,
 * json:{url,params,type,headers等}
 * callback：String类型，调用接口后的回调方法名
 */
function clientRequest(json, callback) {
	if (cxeditor.isAndroid) {//android
		javaJs.commonRequest(JSON.stringify(json), callback);
	}
	if (cxeditor.isIOS) {//ios
		if (window.webkit && window.webkit.messageHandlers.commonRequest) {
			window.webkit.messageHandlers.commonRequest.postMessage([json, callback]);
		}
	}
}

window.cxeditor = {isClient: true}
