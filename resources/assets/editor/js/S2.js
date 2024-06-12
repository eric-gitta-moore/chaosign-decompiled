var S = {
	sc: null,
		//errorCallback(errorMsg, [obj]);   successCallback([obj])
	_connChannel:null,
	_connSuccessCallback:null,
	_connErrorCallback: null,
	connect:function (channel, uid,connectUser,successCallback, errorCallback){
		if(!!S.retryHandler){
	    	delete S.retryHandler;
		}
    	if(S.retryTimes>100){
    		//errorCallback("持续5分钟未能建立连接，请检查网络情况");
    		if(!!window.console){    			
    			console.log("PPT websocket持续5分钟未能建立连接，请检查网络情况");
    		}
    		try {
    			if(parent.showConnectMessage){
    				parent.showConnectMessage("无法建立连接，请检查网络情况",false);
				}
			} catch (e) {
			}
    		return ;
    	}
    	if(!!window.console){			
    		console.log("PPT websocket正在尝试建立连接...");
		}
		S._connChannel = channel;
		S._uid = uid;
		S._connectUser = connectUser;
		S._connSuccessCallback = successCallback;
		S._connErrorCallback = errorCallback;
		try{
			$("#channelHostScript").remove();
			var script=$('<script id="channelHostScript" src="https://mobilelearn.chaoxing.com/widget/config/getChannelHostScript?channel='+channel+'&t='+new Date().getTime()+'"><\/script>');
			$("body").append(script);
		}catch(exp){}
		axios.get("https://mobilelearn.chaoxing.com/widget/config/getChannelHost?channel="+channel+"&t="+new Date().getTime())
			.then(function(data, textStatus){//请求成功，服务端将socket连接的host写入cookie
				var socketUrl='https://mobilelearn.chaoxing.com/widget/t/endpointWidget?channel='+channel+'&uid='+uid+'&connectUser='+connectUser;
				var socket = new SockJS(socketUrl);
				S.sc = Stomp.over(socket);
			    S.sc.heartbeat.outgoing = 10000; 
			    S.sc.heartbeat.incoming = 10000; 
			    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0"){
			    	S.sc.heartbeat.outgoing = 10000; 
				    S.sc.heartbeat.incoming = 0; 
				}
			    S.sc.connect({},function(frame){
			    	S.retryTimes=0;
			    	if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0"){
			    		S.sessionId="8888888";
					}else if(socket._transport&&socket._transport.url){
						try{
							var ur=socket._transport.url;
					    	var ssss=ur.substring(0,ur.lastIndexOf("/"));
					    	S.sessionId=ssss.substring(ssss.lastIndexOf("/")+1,ssss.length);
						}catch(exp){}
					}else{
						S.sessionId="8888888";
					}
			    	var ur=socket._transport.url;
			    	var ssss=ur.substring(0,ur.lastIndexOf("/"));
			    	S.sessionId=ssss.substring(ssss.lastIndexOf("/")+1,ssss.length);
			    	if(!!window.console){		    			
			    		console.log("PPT websocket成功建立连接 sessionId="+S.sessionId);
		    		}
			    	successCallback(frame);
			    }, function(frame){
			    	if(!!window.console){		    			
			    		console.log("PPT websocket连接失败，稍后重试");
		    		}
			    	S.retryHandler = setTimeout("S.connect(S._connChannel,S._uid,S._connectUser,S._connSuccessCallback,S._connErrorCallback)", 3000);
			    	S.retryTimes++;
			    });
			})
			.catch(function(xhr, textStatus, errorThrown){
				//errorCallback("连接服务器出错，稍后重试");
				if(!!window.console){	    			
					console.log("PPT websocket连接出错，稍后重试 sessionId="+S.sessionId);
	    		}
				S.retryHandler = setTimeout("S.connect(S._connChannel,S._uid,S._connectUser,S._connSuccessCallback,S._connErrorCallback)", 3000);
		    	S.retryTimes++;
			});
	},
	retryHandler: null,
	retryTimes:0,
	sessionId:""
};