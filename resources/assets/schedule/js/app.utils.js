(function(W, $, B) {

	if (typeof W.AppUtils != 'undefined') {
		return;
	}

	function AppUtils() {
	}

	/**
	 * 退出客户端
	 *
	 * @param tips 退出时的提示信息
	 */
	AppUtils.prototype.exit = function(tips) {
		var cmd = 'CLIENT_EXIT_WEBAPP';

		B.postNotification(cmd, {
			message: tips || ''
		});
	};

	/**
	 * 退回到首页
	 * @param tips 退出时的提示信息
	 */
	AppUtils.prototype.backHome = function(tips){
		var cmd = 'CLIENT_BACK_HOME';

		B.postNotification(cmd, {
			message: tips || ''
		});
	}

	/**
	 * 退出当前webview
	 *
	 * @param tips 退出时的提示信息
	 */
	AppUtils.prototype.closeView = function(tips) {
		var cmd = 'CLIENT_EXIT_LEVEL';

		B.postNotification(cmd, {
			message: tips || ''
		});
	};

	/**
	 * 退出指定层级level 的 webview
	 *
	 * @param tips 退出时的提示信息
	 */
	AppUtils.prototype.closeView = function(tips,level) {
		var cmd = 'CLIENT_EXIT_LEVEL';
		B.postNotification(cmd, {
			message: tips || '',
			level: level || ''
		});
	};

	/**
	 * 打开语音识别
	 *
	 * @param tips 打开语音识别时的提示信息
	 * @param callBack 接收语音识别回调方法
	 */
	AppUtils.prototype.openSpeech = function(tips, callBack) {
		var cmd = 'CLIENT_SPEECH_RECOGNIZER';

		B.unbind(cmd);

		callBack && B.bind(cmd, callBack);

		B.postNotification('CLIENT_SPEECH_RECOGNIZER', {
			message: tips || ''
		});
	};

	/**
	 * 打开条形码
	 *
	 * @param tips 打开条形码时的提示信息
	 * @param callBack 条形码识别后的回调方法
	 */
	AppUtils.prototype.openScanner = function(tips, callBack) {
		var cmd = 'CLIENT_BARCODE_SCANNER';

		B.unbind(cmd);

		callBack && B.bind(cmd, callBack);

		B.postNotification(cmd, {
			manualInputTitle: tips || ''
		});
	};

	/**
	 * 打开视频播放器
	 *
	 * @param option 可以是数组或一个object对象（视频信息）
	 */
	AppUtils.prototype.openVideoPlayer = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_VIDEO_PLAYER';

		var defultOpt = {
			seriesid: 0, // 系列id
			title: '', // 视频标题
			videopathm3u8: '', // m3u8视频播放地址
			videopathmp4: '', // mp4播放地址
			candownload: 0 // 是否允许下载,默认不允许下载  (1可以下载，0不可下载)
		};

		var videos = new Array();

		if ($.isArray(option)) {
			for (var i = 0, o; o =  option[i++];) {
				if (!$.isEmptyObject(o)) {
					videos.push($.extend(defultOpt, o));
				}
			}
		} else {
			videos.push($.extend(defultOpt, option));
		}

		B.postNotification(cmd, {videolist: videos});
	};

	/**
	 * 打开图书
	 *
	 * @param option 图书信息， obejct对象
	 */
	AppUtils.prototype.openBook = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_READ_BOOK';

		B.postNotification(cmd, $.extend({
			type: 'pdz', // 图书类型， 默认是pdz
			uniqueID: '', // 唯一id, 这里是ssid
			remoteUrl: '', // 图书下载地址，book协议地址
			bookName: '', // 图书名
			message: '', // 信息
			coverUrl: '' // 封面地址
		}, option));
	};

	/**
	 * 下载图书
	 *
	 * @param option 图书信息， obejct对象
	 */
	AppUtils.prototype.downloadBook = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_DOWNLOAD_BOOK';

		B.postNotification(cmd, $.extend({
			type: 'pdz', // 图书类型， 默认是pdz
			uniqueID: '', // 唯一id, 这里是ssid
			remoteUrl: '', // 图书下载地址，book协议地址
			bookName: '', // 图书名
			message: '', // 信息
			coverUrl: '' // 封面地址
		}, option));
	};

	/**
	 * 定制菜单 (注：此方法必须放在 _jsBridgeReady方法中执行)
	 *
	 * @param option 数组或obejct对象，菜单信息
	 */
	AppUtils.prototype.customMenu = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_CUSTOM_MENU';

		B.postNotification(cmd, $.extend({
			index:0,
			show: 1, //是否显示  1显示，0不显示
			width:'',
			height:'',
			icon: '', //菜单图标，为空或没有此属性，则不显示
			menu: '', //菜单名称，为空或没有此属性，则不显示
			option: '', //操作，实际类型为js方法，在客户端上调用webapp内的js方法
			children: [] //为子菜单列表，如上述属性
		}, option));
	};


	/**
	 * 打开讨论组
	 * @param type  类型（专题类型值为3000）
	 * @param name 专题名称
	 * @param sid  专题编号
	 * @param puid 生成小组时指定小组创建者为puid；如果不需要为空默认创建者为小星
	 */
	AppUtils.prototype.clientOpenGroup = function(type,name,sid,puid){

		var cmd = 'CLIENT_OPEN_GROUP';

		B.postNotification(cmd,{
			GroupInfo:{
				type:type,
				name:name,
				sid:sid,
				puid:puid
				}
		});
	};
	/**
	 * 打开话题列表
	 * @param GroupId
	 * @param Groupbbsid
	 * @param needRecord
	 */
	AppUtils.prototype.clientOpenTopicList = function(GroupId,Groupbbsid){
		if($.trim(GroupId) == '' && $.trim(Groupbbsid) == '') return;
		var cmd = 'CLIENT_OPEN_GROUP';
		B.postNotification(cmd,{
			GroupId:GroupId,
			Groupbbsid:Groupbbsid,
			needRecord:'true'
		});
	}
	/**
	 * 获取登录状态
	 *
	 * @param accountKey 账户类型的key, "" (空字符串)为统一认证用户信息, "cx_fanya"为泛雅用户信息， "cx_opac"为opac用户信息
	 * @param callback 获取登录状态的回调方法
	 */
	AppUtils.prototype.getLoginState =  function(accountKey, callback) {

		if (accountKey == null) {
			return;
		}

		var cmd = 'CLIENT_LOGIN_STATUS';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
			accountKey: accountKey
		});
	};

	/**
	 * 客户端打开链接地址，可以是webview或客户端浏览器, 默认使用webview打开，默认不检查是否登录
	 *
	 * @param option object对象
	 */
	AppUtils.prototype.openUrl =  function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}
		//非学习通打开，直接打开
		if(navigator.userAgent.indexOf("ChaoXingStudy") == -1){
			window.location.href = option.webUrl;
			return;
		}

		var cmd = 'CLIENT_OPEN_URL';

		if(/.*[\u4e00-\u9fa5]+.*$/.test(option.webUrl)){//有中文进行编码
			option.webUrl = encodeURI(option.webUrl);
		}
		B.postNotification(cmd, $.extend({
			tabBarShowFlag:0,
			title: '', //标题
			loadType: 1, //打开方式，0在本页面打开，1使用客户端webview打开新页面，2打开系统浏览器
			webUrl: '' //要打开的url
		}, option));
	};

	/**
	 * 分享
	 *
	 * @param option object, 分享内容
	 */
	AppUtils.prototype.share = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_SHARE_ITEM';

		B.postNotification(cmd, $.extend({
			url: '',  //网页地址
			imgUrl: '', //图片地址
			type:0, //类型，目前只有0表示网页
			title: '', //标题
			content: '' //文字描述
		}, option));
	};

	/**
	 * 获取书架图书
	 *
	 * @param ids ids id 或 id数组
	 * @param callback 获取到图书后的回调方法
	 */
	AppUtils.prototype.getShelfBooks = function(ids, callback) {

		if (ids == null) {
			return;
		}

		var cmd = 'CLIENT_BOOKS_ON_SHELF';
		var bookIds = null;

		if ($.isArray(ids)) {
			bookIds = ids;
		} else {
			bookIds = new Array();
			bookIds.push(ids);
		}

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, bookIds);
	};

	/**
	 * 打开图书详情
	 *
	 * @param option object对象
	 */
	AppUtils.prototype.getBookDetail = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_OPEN_BOOK_DETAIL';

		B.postNotification(cmd, $.extent({
			dxNumber: '', //图书读秀号
			d: '', //读秀加密串
			languageType: 0 //语言类型，0：中文，1:外文
		}, option));
	};

	/**
	 * 打开指定app
	 *
	 * @param option object对象
	 */
	AppUtils.prototype.openApp = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}

		var cmd = 'CLIENT_OPEN_APP';

		B.postNotification(cmd, $.extent({
			appid: '', //应用id
			appname: '' //应用名称
		}, option));
	};

	/**
	 * 打开不同类型的资源管理器
	 *
	 * @param type file:打开文件管理器, image:打开图库，相机, image_file：打开图库，相机，文件管理器
	 */
	AppUtils.prototype.openResourceMgr = function(type, callback) {

		if (typeof type == 'undefined') {
			return;
		}

		var cmd = 'CLIENT_FILEINPUTTYPE';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
			type: type
		});
	};

	/**
	 * 获取用户登录信息
	 *
	 * @param accountKey 账户类型的key, "" (空字符串)为统一认证用户信息, "cx_fanya"为泛雅用户信息， "cx_opac"为opac用户信息
	 * @param callback 获取到用户信息的回调方法
	 */
	AppUtils.prototype.getUserInfo = function(accountKey, callback) {

		if (typeof accountKey == 'undefined') {
			return;
		}

		var cmd = 'CLIENT_GET_USERINFO';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
			accountKey: accountKey
		});
	};




	/**
	 * 调用客户端登录
	 *
	 * @param accountKey 账户类型的key, "" (空字符串)为统一认证用户信息, "cx_fanya"为泛雅用户信息， "cx_opac"为opac用户信息
	 * @param callback 客户端登录后的回调方法
	 */
	AppUtils.prototype.doAppLogin = function(accountKey, callback) {

		if (typeof accountKey == 'undefined') {
			return;
		}

		var cmd = 'CLIENT_LOGIN';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
			accountKey: accountKey
		});
	};

	/**
	 * 调用手机通讯录，选择联系人
	 *
	 * @param callback
	 */
	AppUtils.prototype.openContacts = function(callback) {

		var cmd = 'CLIENT_OPEN_CONTACTS';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd);
	};


	/**
	 * 打开客户端通讯，选择后回调CLIENT_CHOOSE_CONTACT_RESULT协议
	 * @param multiple 是否多选
	 * @param chooseDept 是否选择部门
	 */
	AppUtils.prototype.chooseContact = function(multiple,chooseDept) {
		var cmd = 'CLIENT_CHOOSE_CONTACT';
		B.unbind(cmd);
		B.postNotification(cmd, {
			multiple:multiple,
			chooseDept:chooseDept
		});
	}


	/**
	 * (新)打开客户端通讯，选择后回调CLIENT_CHOOSE_CONTACT_RESULT协议
	 * @param multiple 是否多选 boolean类型 true 为多选， false为只能单选
	 */
	AppUtils.prototype.chooseNewContact = function(multiple) {
		var cmd = 'CLIENT_CHOOSE_NEWCONTACT';
		B.unbind(cmd);
		B.postNotification(cmd, {
			multiple:multiple || false
		});
	}

	/**
	 * 课堂选人
	 * @param option
	 */
	AppUtils.prototype.selectPerson = function(option) {

		if ($.isEmptyObject(option)) {
			return;
		}
		var cmd = 'CLINET_SELECT_PERSON';
		B.postNotification(cmd, $.extend({
			maxCountWithoutPerson : "",  // 一次最多能选多少组
			maxCountWithoutPersonTips : "",// 上面的组多选后的提示
			multiple:1, //是否多选0：否   1：是   默认值：1
			title:'', //选人页面标题，默认：选择允许加入范围
			showItem:{  //显示选人范围
				showContact:1,   //选人范围是否包含“通讯录”  0：不包含  1：包含  默认值：1
				showCourse:1,   //选人范围是否包含“我的课程”  0：不包含  1：包含  默认值：1
				showGroup:1,   //选人范围是否包含“我的小组”  0：不包含  1：包含  默认值：1
				showChatGroup:1   //选人范围是否包含“群聊”  0：不包含  1：包含  默认值：1
			},
			canChooseItem:{  //可选项
				choosePerson:1, //是否可选人员  0：不可选 1：可选  默认值：1
				chooseDept:1, //是否可选部门  0：不可选 1：可选  默认值：1
				chooseClazz:1, //是否可选班级  0：不可选 1：可选  默认值：1
				chooseGroup:1, //是否可选小组  0：不可选 1：可选  默认值：1
				chooseChatGroup:1, //是否可选群聊  0：不可选 1：可选  默认值：1
			},
			currentSelected:{ //当前已选
				selectedPerson:{},  	//已选人员
				selectedDept:{},  		//已选部门
				selectedClazz:{},  		//已选班级
				selectedGroup:{},  		//已选小组
				selectedChatGroup:{}, //已选群聊
			}
		}, option));
	};

	/**
	 * 调用客户端消息提示
	 * @param message
	 */
	AppUtils.prototype.clientMessageDisplay = function(message){
		if (navigator.userAgent.indexOf("ChaoXingStudy") == -1){
			showTips(message);
			return;
		}
		B.postNotification('CLIENT_DISPLAY_MESSAGE',{
			message: message
		});
	};
	/**
	 * 转发
	 * @param content
	 * @param quoteInfo
	 */
	AppUtils.prototype.clientTransferInfo = function(content,quoteInfo) {
		B.postNotification('CLIENT_TRANSFER_INFO',{
			cataid: "100000001",
			content:content,
			quoteInfo:quoteInfo
//			docContent:docContent
		});
	};
	/**
	 * 转发
	 * @param content
	 * @param quoteInfo
	 */
	AppUtils.prototype.clientTransferInfo = function(cataid,content,quoteInfo) {
		B.postNotification('CLIENT_TRANSFER_INFO',{
			cataid: cataid,
			content:content,
			quoteInfo:quoteInfo
//			docContent:docContent
		});
	};
	/**
	 * 发表话题
	 * @param bbsid
	 * @param circleId
	 * @param TopicId
	 * @param rights
	 * @param inputType 点+号，光标不定位到输入框，没弹起键盘。点回复框定位到输入框弹起键盘2:只显示文本输入框；
	 * @param flagInfo
	 */
	AppUtils.prototype.addBBSTopic = function(bbsid,circleId,TopicId,rights,inputType,flagInfo){
		var cmd = 'CLIENT_WRITE_TOPIC';
		B.postNotification(cmd, {
			Groupbbsid:bbsid,
			GroupId: circleId,
			TopicId:TopicId,
			rights:rights,
			inputType:inputType,
			flagInfo:flagInfo
		});
	};
	/**
	 * 打开话题详情
	 * @param bbsid
	 * @param circleId
	 * @param TopicId
	 * @param rights
	 */
	AppUtils.prototype.clientOpenTopicDieail = function(bbsid,circleId,rights,TopicId){
		var cmd = 'CLIENT_OPEN_TOPIC';
		B.postNotification(cmd, {
			Groupbbsid:bbsid,
			GroupId: circleId,
			TopicId:TopicId,
			source:2,
			rights:rights
		});
	}
	AppUtils.prototype.clientSendNotice = function(id,name) {
		var cmd = 'CLIENT_OPEN_SEND_NOTICE';
		B.postNotification(cmd,{
			subject: [{
				id:id,
				name:name
			}]
		});
	};
	//打开资源
	AppUtils.prototype.openRes = function(appid, appname, appurl,author,cover,puid){
	    if(appid.indexOf("mooc_")==-1){
	    	 appid="mooc_"+appid;
	  	}
	    var cataid= "100000001";//订阅分类号
	    var cataName = "专题";//订阅分类名称
	    var content = {
				"accountKey": "cx_fanya", //对应loginId相应的key值
			    "aid":appid, //同上面的otherConfig.id
			    "appid": $.md5(appurl), //md5(appurl)，appurl的md5值
			    "appname": appname, //订阅源名称
			    "appurl": appurl, //订阅源地址
			    "available": 1, //是否可用，10不可用，1可用，默认为1
			    "bind": 1,
			    "cataid": cataid,
			    "clientType": 127,
			    "description": "", //说明信息
			    "focus": 0,
			    "id": -1,
			    "isPrivate": 1,
			    "isWebapp": 1, //是否是webapp，1是，0不是，默认为1
			    "loginId": 2, //认证类型，1、opac，2、passport，0、统一认证。默认为0
			    "loginUrl": "", //登录认证地址
			    "logopath": cover, //图标地址
			    "logoshowtype": 1, //首页图标显示方式：1、通用app显示方式，2、rss订阅源显示方式
			    "needLogin": 0, //是否需要登录，1需要，0不需要，默认为0
			    "needRegist": 0, //是否需要注册，1需要，0不需要，默认为0
			    "norder": 0, //排序值，默认为int最大值
			    "otherConfig": {
			        "author": author,//创建者
			        "id":appid,//专题id，专题有两种，mooc专题和云盘专题，如果是mooc专题需要在专题id前加"mooc_"前缀，如果是云盘专题需要在专题id前加“yp_”前缀
			        "authorPuid":puid
			    },//扩展信息
			    "productId": 3,
			    "properties": "", //登录提示语
			    "rights": 1, //订阅源权限，默认为1
			    "usable": "", //是否可订阅的验证地址
			    "useClientTool": 2, //是否启用客户端工具条，1启用，0不自定义工具条，2，自定义分层结构的工具条，默认为1
			    "res_src":"market"
		};
		B.postNotification("CLIENT_OPEN_RES", {"cataid":100000001, "cataName":cataName, "key":appid,"content":content } ) ;
	}

	/**
	 * 打开课程
	 * @param cataid:100000002
	 * @param cataName
	 * @param key
	 * @param content
	 */
    AppUtils.prototype.openResCourse = function (cataid,cataName,key,content){
		B.postNotification("CLIENT_OPEN_RES", {"cataid":cataid, "cataName":cataName, "key":key,"content":content});
    };

	/**
	 * 加入小组
	 * @param cataid:100000002
	 * @param cataName
	 * @param key
	 * @param content
	 */
    AppUtils.prototype.addToGroup = function (groupInfo,uid,callback){
		var cmd = 'CLIENT_ADDTO_GROUP';
        B.unbind(cmd);
        callback && B.bind(cmd, callback);
   	 	B.postNotification(cmd,{
   	 		groupInfo : groupInfo,
	 		uid : uid
   	 	});
    };

	/**
	 * 获取章节收藏状态
	 * @param courseId
	 * @param chapterId
	 * @param callback
	 */
	AppUtils.prototype.getChapterSubRssscribeState = function(courseId,chapterId,callback) {
		if ($.trim(courseId) == "" || $.trim(chapterId) == "") {
			return;
		}
		var cataid = "100000015";//专题章节订阅分类号
		var resUid = "300000001"+"_"+courseId+"-"+chapterId;
	    AppUtils.prototype.getSubRssscribeState(cataid, "专题章节", resUid, function(data){
	     	   callback(data);
	 	});
	}
	/**
	 * 收藏专题章节
	 * @param courseId 专题id
	 * @param chapterId 专题章节id
	 * @param chapterName 专题章节名称
	 * @param resTitle 章节标题
	 * @param summary 章节内容(文字)
	 * @param resUrl 章节url
	 * @param author 专题创建人
	 * @param imags 章节内容中的图片
	 */
	AppUtils.prototype.chapterScribe = function (courseId,chapterId,courseName,chapterName,summary,resUrl,author,imags,level,callback) {
		if ($.trim(courseId) == "" || $.trim(chapterId) == "") {
			return;
		}
		var resLogo = "";
		if ($.trim(imags) == "") {
			imags = [];
		}else{
			len = imags.length;
			if (len > 0){
				resLogo = imags[0];//取第一张图片作为封面
			}
		}
		var cataid = "100000015";//专题章节订阅分类号
		var resUid = "300000001"+"_"+courseId+"-"+chapterId;
		var content = {
			    "summary": summary || "",
			    "resTitle": chapterName || "",
			    "resUrl": resUrl || "",
			    "sourceConfig": {
			        "magname": courseName || "",
			        "author": author || "",
			        "cataid": "100000001",
			        "level":level
			    },
			    "resLogo": resLogo || "",
			    "_source_": "300000001",
			    "resUid": resUid,
			    "toolbarType": "2",
			    "imgs": imags
			};
		var cataName="专题章节";
		AppUtils.prototype.recScribe(cataid, cataName, resUid, content,function(data){
        	   callback(data);
		},1);
	}

	//取消订阅
	AppUtils.prototype.cancelChapterScribe = function(courseId,chapterId,callback){
		if ($.trim(courseId) == "" || $.trim(chapterId) == "") {
			return;
		}
		var cataid = "100000015";//专题章节订阅分类号
		var resUid = "300000001"+"_"+courseId+"-"+chapterId;
	    AppUtils.prototype.cancelRecScribe (cataid, "专题章节", resUid, function(data){
	    	   callback(data);
		});
	}
	//专题订阅
	AppUtils.prototype.recScribeImp = function(appid, appname, appurl,author,cover,callback,puid,level){
		 appid=appid+"";
	     if(appid.indexOf("mooc_")==-1){
	    	 appid="mooc_"+appid;
	  	 }

	     var cataid="100000001";//订阅分类号
	     var cataName="专题";//订阅分类名称
	     var content={
				"accountKey": "cx_fanya", //对应loginId相应的key值
			    "aid":appid, //同上面的otherConfig.id
			    "appid": $.md5(appurl), //md5(appurl)，appurl的md5值
			    "appname": appname, //订阅源名称
			    "appurl": appurl, //订阅源地址
			    "available": 1, //是否可用，10不可用，1可用，默认为1
			    "bind": 1,
			    "cataid": cataid,
			    "clientType": 127,
			    "description": "", //说明信息
			    "focus": 0,
			    "id": -1,
			    "isPrivate": 1,
			    "isWebapp": 1, //是否是webapp，1是，0不是，默认为1
			    "loginId": 2, //认证类型，1、opac，2、passport，0、统一认证。默认为0
			    "loginUrl": "", //登录认证地址
			    "logopath": cover, //图标地址
			    "logoshowtype": 1, //首页图标显示方式：1、通用app显示方式，2、rss订阅源显示方式
			    "needLogin": 0, //是否需要登录，1需要，0不需要，默认为0
			    "needRegist": 0, //是否需要注册，1需要，0不需要，默认为0
			    "norder": 0, //排序值，默认为int最大值
			    "otherConfig": {
			        "author": author,//创建者
			        "id":appid,//专题id，专题有两种，mooc专题和云盘专题，如果是mooc专题需要在专题id前加"mooc_"前缀，如果是云盘专题需要在专题id前加“yp_”前缀
			        "authorPuid":puid,
			        "level":level
			    },//扩展信息
			    "productId": 3,
			    "properties": "", //登录提示语
			    "rights": 1, //订阅源权限，默认为1
			    "usable": "", //是否可订阅的验证地址
			    "useClientTool": 2, //是否启用客户端工具条，1启用，0不自定义工具条，2，自定义分层结构的工具条，默认为1
			    "res_src":"market"
			};
	     AppUtils.prototype.recScribe(cataid, cataName, appid, content,function(data){
	    	 if(data.status == 1){
					AppUtils.prototype.clientMessageDisplay('已收藏到书房');
					if(callback == 0){
						$("[name='"+appid+"']").addClass("addGroupC");
						$("[name='"+appid+"']").attr("status","1");
					}else{
						callback(data);
					}

			}
        },0);
	  }


	//获取专题收藏状态
	AppUtils.prototype.getSubRssscribeStateImp = function(appid,callback){
		 appid=appid+"";
	     if(appid.indexOf("mooc_")== -1){
	    	 appid="mooc_"+appid;
	  	 }
	     AppUtils.prototype.getSubRssscribeState("100000001", "专题", appid, function(data){
	    	 if(callback==0){
				if(data.status==1){
					$("[name='"+data.key+"']").addClass("addGroupC");
	   				$("[name='"+data.key+"']").attr("status","1");
				}
	        }else{
	     	   callback(data);
	        }

	 	});
	}

	//取消订阅
	AppUtils.prototype.cancelRecScribeImp = function(appid,callback){
		appid=appid+"";
	    if(appid.indexOf("mooc_")== -1){
	   	 appid="mooc_"+appid;
	 	 }
	    AppUtils.prototype.cancelRecScribe ("100000001", "专题", appid, function(data){
	    	if(data.status == 1){
	    		AppUtils.prototype.clientMessageDisplay('取消收藏成功！');
	    		if(callback == 0){
	    			$("[name='"+appid+"']").removeClass("addGroupC");
					$("[name='"+appid+"']").attr("status",0);
	    		}else{
	    			callback(data);
	    		}


	    	}
		});
	}



    /**
     * 获取资源订阅状态
     * @param appurl url地址
     * @param callback 订阅状态回调方法
     */

    AppUtils.prototype.getSubRssscribeState = function(cataid, cataName, key, callback) {
    	if ((typeof key == 'undefined')|| (typeof cataid == 'undefined')) {
			return;
		}

        var cmd = 'CLIENT_RES_SUBSCRIPTION_STATUS';

        B.unbind(cmd);

        callback && B.bind(cmd, callback);
        B.postNotification(cmd, {
        	"cataid":cataid,
        	"cataName":cataName,
        	"key":key
        });
    };


    /**
     * 资料市场订阅
     * @param cataid
     * @param cataName
     * @param key
     * @param content
     * @param callback
     */

    AppUtils.prototype.recScribe = function(cataid, cataName, key, content, callback,collectionFolder){
    	if ((typeof key == 'undefined')|| (typeof cataid == 'undefined')||(typeof cataName == 'undefined')||(typeof content == 'undefined')) {
			return;
		}
    	 var cmd = 'CLIENT_SUBSCRIBE_RES';
         B.unbind(cmd);
         callback && B.bind(cmd, callback);
    	 B.postNotification(cmd,{
    		 		cataid : cataid,
    		 		cataName :cataName,
    		 		key :key,
    		 		content :content,
    		 		collectionFolder:collectionFolder
    		 	});
    };

    /**
     * 下载专题
     * @param appid
     * @param appname
     * @param appurl
     * @param author
     * @param cover
     * @param puid
     * @param downUrl
     * @param abscissa
     * @param ordinate
     */
    AppUtils.prototype.downSpecial = function(appid, appname, appurl,author,cover,puid,downUrl,packageSize,abscissa, ordinate){
    	 appid = appid+"";
	     if(appid.indexOf("mooc_")==-1){
	    	 appid="mooc_"+appid;
	  	 }
	     var cataid="100000001";//订阅分类号
	     var cataName="专题";//订阅分类名称
	     var content={
				"accountKey": "cx_fanya", //对应loginId相应的key值
			    "aid":appid, //同上面的otherConfig.id
			    "appid": $.md5(appurl), //md5(appurl)，appurl的md5值
			    "appname": appname, //订阅源名称
			    "appurl": appurl, //订阅源地址
			    "available": 1, //是否可用，10不可用，1可用，默认为1
			    "bind": 1,
			    "cataid": cataid,
			    "clientType": 127,
			    "description": "", //说明信息
			    "focus": 0,
			    "id": -1,
			    "isPrivate": 1,
			    "isWebapp": 1, //是否是webapp，1是，0不是，默认为1
			    "loginId": 2, //认证类型，1、opac，2、passport，0、统一认证。默认为0
			    "loginUrl": "", //登录认证地址
			    "logopath": cover, //图标地址
			    "logoshowtype": 1, //首页图标显示方式：1、通用app显示方式，2、rss订阅源显示方式
			    "needLogin": 0, //是否需要登录，1需要，0不需要，默认为0
			    "needRegist": 0, //是否需要注册，1需要，0不需要，默认为0
			    "norder": 0, //排序值，默认为int最大值
			    "otherConfig": {
			        "author": author,//创建者
			        "id":appid,//专题id，专题有两种，mooc专题和云盘专题，如果是mooc专题需要在专题id前加"mooc_"前缀，如果是云盘专题需要在专题id前加“yp_”前缀
			        "authorPuid":puid
			    },//扩展信息
			    "productId": 3,
			    "properties": "", //登录提示语
			    "rights": 1, //订阅源权限，默认为1
			    "usable": "", //是否可订阅的验证地址
			    "useClientTool": 2, //是否启用客户端工具条，1启用，0不自定义工具条，2，自定义分层结构的工具条，默认为1
			    "res_src":"market"
			};
	     AppUtils.prototype.showDownloadButton(cataid, cataName, appid,downUrl,packageSize,abscissa, ordinate,content);
	  }
    /**
     * 显示专题下载按钮
     * @param cataid
     * @param cataName
     * @param key
     * @param downUrl 下载地址
     * @param abscissa 横坐标
     * @param ordinate 纵坐标
     * @param content
     */
    AppUtils.prototype.showDownloadButton = function(cataid, cataName, key, downUrl,packageSize,abscissa,ordinate ,content){
    	 if ((typeof key == 'undefined') || (typeof cataid == 'undefined')||(typeof cataName == 'undefined')||(typeof content == 'undefined') || (typeof downUrl == 'undefined')) {
    		 return;
		 }
		 var cmd = 'CLIENT_DOWNLOAD_RES';
	     B.unbind(cmd);
		 B.postNotification(cmd,{
			 		cataid : cataid,
			 		cataName :cataName,
			 		key :key,
			 		downUrl:downUrl,
			 		packageSize:packageSize,
			 		abscissa: abscissa,
			 		ordinate : ordinate,
			 		content :content
			 	});
    }
    /**
     * 资料市场取消订阅
     * @param cataid
     * @param cataName
     * @param key
     */
    AppUtils.prototype.cancelRecScribe = function(cataid, cataName, key, callback){
    	if ((typeof key == 'undefined')|| (typeof cataid == 'undefined')) {
			return;
		}
    	var cmd = 'CLIENT_REMOVE_RES';
        B.unbind(cmd);
        callback && B.bind(cmd, callback);
        B.postNotification(cmd,{
                cataid : cataid,
                cataName : cataName,
                key : key
        });
    };

///////////////////////////////////////////订阅新协议end/////////////////////////////////////////////////////////////

	/**
	 * 获取订阅状态
	 * @param appurl url地址
	 * @param callback 订阅状态回调方法
	 */
  //老的订阅协议
    /*
	AppUtils.prototype.getSubscribeState = function(appurl, callback) {

		if (typeof appurl == 'undefined') {
			return;
		}

		var cmd = 'CLIENT_APP_SUBSCRIPTION_STATUS';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
			appurl: appurl
		});
	};
	*/
	/**
	 * 将网页订阅到首页
	 *
	 * @param option object对象
	 */
	//老的订阅协议
    /*
	AppUtils.prototype.subscribe = function(option,callback) {
		if ($.isEmptyObject(option)) {
			return;
		}
		var cmd = 'CLIENT_SUBSCRIBE_APP';

		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, $.extend({
			appname: '', //订阅源名称
			loginId: 0, //认证类型，1、opac，2、passport，0、统一认证。默认为0
			appurl: '', //订阅源地址
			available: 1, //是否可用，10不可用，1可用，默认为1
			logoPath: '', //图标地址
			isWebapp: 1, //是否是webapp，1是，0不是，默认为1
			useClientTool: 2, //是否启用客户端工具条，1启用，0不自定义工具条，2，自定义分层结构的工具条，默认为1
			needLogin: 0, //是否需要登录，1需要，0不需要，默认为0
			needRegist: 0, //是否需要注册，1需要，0不需要，默认为0
			norder: 0, //排序值，默认为int最大值
			loginUrl: '', //登录认证地址
			properties: '', //登录提示语
			extendField: '', //扩展信息
			description: '', //说明信息
			usable: '', //是否可订阅的验证地址
			logoshowtype: 1, //首页图标显示方式：1、通用app显示方式，2、rss订阅源显示方式
			rights: 1, //订阅源权限，默认为1
			loginkey: '' //对应loginId相应的key值
		}, option));
	};
	*/
	/**
	 * 取消专题订阅
	 * @param cataid
	 * @param cataName
	 * @param key
	 */
  //老的订阅协议
    /*
	AppUtils.prototype.cancelSpecialSubscribe = function(cataName,key,callback){
		var cmd = 'CLIENT_REMOVE_RES';
		B.unbind(cmd);
		callback && B.bind(cmd, callback);

		B.postNotification(cmd,{
				cataid:'100000001',
				cataName:cataName,
				key:key
		});
	}
	*/
	/**
	 * 打开和保存图片
	 * @param img_url
	 * @param index
	 */
	AppUtils.prototype.clientPreviewImages = function(img_urlArray,index) {
		var cmd = 'CLIENT_PREVIEW_IMAGES';
		B.postNotification(cmd,{
			imageUrls:img_urlArray,
			showIndex:index
		});
	};

	/**
	 * 显示话题回复框
	 * @param groupId
	 * @param topicInfo
	 * @param imgageWidht
	 */
	AppUtils.prototype.showTopicReplyBar = function(flagInfo,groupId,topicInfo,imageWidth){
		if(undefined == groupId || groupId == '') return;
		var cmd = 'CLIENT_SHOW_TOPIC_REPLY_BAR';

		B.postNotification(cmd,{
			flagInfo:flagInfo,
			groupId: groupId,
			topicInfo:topicInfo,
			imageWidth:imageWidth
		});
	}

	/**
	 * 打开话题回复框
	 * @param replyInfo
	 * @param replyLevel
	 * @param imgageWidht
	 * @param callback
	 */
	AppUtils.prototype.triggerReplyInput = function(inputType,groupId,topicInfo,flagInfo,replyInfo,replyLevel,imageWidth){
		var cmd = "CLIENT_TRIGGER_REPLY_INPUT";
		B.postNotification(cmd,{
			inputType:inputType,
			groupId:groupId,
			topicInfo:topicInfo,
			flagInfo:flagInfo,
			replyInfo:replyInfo,
			replyLevel:replyLevel,
			imageWidth:imageWidth
		});
	}
	/**
	 * 打开客户端花瓣 + 星星
	 * @param type
	 * @param petalInfo  如：{"count": {"friendsCount": 48,"myStarCount": 0.2,"mySpecialsSubCount": 5,"noteCount": 12,"opendNoteCount": 1,"pv": 24816,"subCount": 44,"topicCount": 139},
	 * "userInfo": {"sex": 1,"isFriend": 1,"right": 8,"name": "王峰（研发）","uid": 20970448}}
	 */
	AppUtils.prototype.clientShowPetal = function(type, petalInfo) {
		B.postNotification('CLIENT_SHOW_PETAL', {
		    "type": type,
		    "petalInfo": petalInfo
		});
	};

	/**
     * 添加/删除好友
     * @param friendid
     * @param operate 0：添加好友 1：删除好友(默认0)
     */
	AppUtils.prototype.clientOperateFriend = function(friendid, operate, callback) {

		var cmd = 'CLIENT_OPERATE_FRIEND';
		B.unbind(cmd);

		callback && B.bind(cmd, callback);

		B.postNotification(cmd, {
		    "friendid": friendid,
		    "operate": operate
		});
	};
	/**
	 * 支付
	 * @param sid
	 * @param money
	 */
	AppUtils.prototype.pay = function(money,orderTitle,category,params,chparams,params_sign,chparams_sign,attach,returntype){
		if($.trim(money) == "" ||
				$.trim(orderTitle) == "" ||
				$.trim(category) == "" ||
				$.trim(params) == "" ||
				$.trim(params_sign) == "" ||
				$.trim(chparams) == "") return;
		var cmd = 'CLIENT_OPEN_PAY';
		if($.trim(returntype) == '')returntype = 0;
		B.unbind(cmd);
		B.postNotification(cmd, {
		    "money": money,
		    "orderTitle":orderTitle,
		    "category":category,
		    "attach":attach,
		    "returntype":returntype,
		    "orderInfo":{
		    	"params":params,
		    	"chparams":chparams,
		    	"params_sign":params_sign,
		    	"chparams_sign":chparams_sign
		    }
		});
	}
	/**
	 * 检查客户端是否支持支付
	 */
	AppUtils.prototype.checkPay = function(){
		var cmd = 'CLIENT_CAN_PAY';
		B.postNotification(cmd,{});
	}
	/**
	 * 发送领取红包消息给客户端
	 * @param packetId 红包id
	 * @param createId 红包创建人id
	 * @param receiveId 红包领取人id
	 * @param receiveName 红包领取人名称
	 * @param receiveOver 是否领完，0：未全部领完，1：全部领取完
	 */
	AppUtils.prototype.sendRedPackGetMsg = function(packetId,createId,receiveId,receiveName,receiveOver){
		if($.trim(packetId) == "" || packetId == 0
				|| $.trim(createId) == ""
				|| $.trim(receiveId) == ""
				|| $.trim(receiveName) == ""
				|| $.trim(receiveOver) == ""
		){
			return;
		}
		var cmd = 'CLIENT_OPEN_PACKET';
		B.unbind(cmd);
		B.postNotification(cmd, {
		    	"packetId":packetId,
		    	"createId":createId,
		    	"receiveId":receiveId,
		    	"receiveName":receiveName,
		    	"receiveOver":receiveOver
		});
	}
	/**
	 * 打开群聊或单聊
	 * @param groupId 群聊id
	 * @param personId 单聊id
	 */
	AppUtils.prototype.openChat = function(groupId,personId){
		if($.trim(groupId) == "" && $.trim(personId) == "") {
			return;
		}
		var cmd = 'CLIENT_OPEN_CHAT';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"groupId":groupId,
	    	"personId":personId
		});
	}
	/**
	 * 打开笔记详情
	 * @param noteCid 笔记cid 字符串
	 */
	AppUtils.prototype.openNoteDetail = function(noteCid){
		if($.trim(noteCid) == "") return;
		var cmd = 'CLIENT_OPEN_NOTE_DETAIL';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"noteCid":noteCid
		});
	}
	/**
	 * 打开笔记文件夹
	 * @param noteCid 笔记文件夹cid 字符串
	 */
	AppUtils.prototype.openNoteFolder = function(noteCid,noteBookName){
		if($.trim(noteCid) == "") return;
		var cmd = 'CLIENT_OPEN_NOTE_FOLDER';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"noteBookCid":noteCid,
	    	"noteBookName":noteBookName
		});
	}

	/**
	 * 打开通知详情
	 * @param noticeId
	 */
	AppUtils.prototype.openNoticeDetail = function(noticeId){
		if($.trim(noticeId) == "") return;
		var cmd = 'CLIENT_OPEN_NOTICE_BYID';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"NoticeID":noticeId
		});
	}
	/**
	 * 打开书房
	 * @param uid
	 * @param uname
	 */
	AppUtils.prototype.openSubs = function(uid,puid,uname){
		if($.trim(uid) == "" && $.trim(puid) == "") return;
		var cmd = 'CLIENT_OPEN_SUBS';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"uid":uid,
	    	"puid":puid,
	    	"uname":uname
		});
	}
	/**
	 * 打开直播
	 */
	AppUtils.prototype.openLive = function(THIS){
		var attr = $(THIS).attr("attr");
		if(undefined == attr || attr == "") {
			return;
		}
		var obj = "";
		try {
			obj = JSON.parse(attr);
		} catch (e) {
			obj = "";
		}
		if(obj == ""){
			return;
		}
		var liveInfo = obj.liveInfo || "";
		if($.trim(liveInfo) == "") return;
		var cmd = 'CLIENT_OPEN_LIVE';
		B.unbind(cmd);
		B.postNotification(cmd, {
	    	"description":liveInfo
		});
	}
	/**
	 * 发布专题
	 */
	AppUtils.prototype.publish = function(target,content,quoteInfo){
		var cmd = 'CLIENT_RES_PUBLISH';
//		B.unbind(cmd);
		B.postNotification(cmd, {
			cataid: "100000001",
			target:target,
			content:content,
			quoteInfo:quoteInfo
		});
	}
	/**
	 * 刷新页面协议
	 */
	AppUtils.prototype.execRefresh = function () {
        var cmd = 'CLIENT_REFRESH_STATUS';

        B.postNotification(cmd, {
            "status": "1"
        });
    };
    /**
     * 通知客户端触发全屏
     */
    AppUtils.prototype.fullScreen = function(){
        var cmd = 'CLIENT_FULL_SCREEN';
        B.postNotification(cmd, {
            "enabled": 1
        });
    }

    /**
     * 编辑器
     * @param title
     * @param conf
     * @param params {courseid:xxx,cardid:xxx}
     * @param knowledgeid 章节id
     */
    AppUtils.prototype.editor = function(title,conf,params){
    	var cmd = 'CLIENT_RICHEIDTOR_CREATE';
        B.postNotification(cmd, {
        	'title':title,
        	'conf':conf,
        	'params':params
        });
    }
    /**
     * 专题编辑
     * @param specialTitle
     * @param specialId
     */
    AppUtils.prototype.specialEdit = function (specialTitle,specialId) {
    	var cmd = 'CLIENT_SPECIAL_EDIT';
    	 B.postNotification(cmd, {
	    	'specialTitle':specialTitle,
	    	'specialId':specialId
	    });
    }

    /**
     * 获取资源收藏状态
     * @param type 收藏资源类型  小组:1，笔记:2，话题:3 ，专题:4，章节:5，期刊:6，报纸:7
     * @param sourceId 收藏资源ID
     */
    AppUtils.prototype.getCollectionState = function(type,sourceId) {
    	if ((typeof type == 'undefined') || (typeof sourceId == 'undefined')) {
			return;
		}
        var cmd = 'CLIENT_RES_COLLECTION_STATUS';
//        B.unbind(cmd);
//        callback && B.bind(cmd, callback);
        B.postNotification(cmd, {
        	"type":type,
        	"sourceId":sourceId
        });
    };

    /**
     * 资源收藏/取消收藏
     * @param type 收藏资源类型  小组:1，笔记:2，话题:3 ，专题:4，章节:5，期刊:6，报纸:7
     * @param action 操作标识 0 删除 1添加
     * @param id 收藏ID
     * @param sourceId 收藏资源ID
     * @param cataid: "100000001",
     * @param content 和转发协议数据一致
     * @param quoteInfo  和转发协议数据一致
     */
    AppUtils.prototype.recCollection = function(type,action,id,sourceId,cataid,content,quoteInfo){
    	if ((typeof type == 'undefined') || (typeof action == 'undefined') || (typeof sourceId == 'undefined') || (typeof cataid == 'undefined')) {
			return;
		}
    	//当为取消操作时 id 不能为空
    	if(action == 0 && (typeof id == 'undefined')){
    		return;
    	}
    	var cmd = 'CLIENT_COLLECTION_RES';
//         B.unbind(cmd);
//         callback && B.bind(cmd, callback);
    	B.postNotification(cmd,{
        	"type":type,
    		"action":action,
    		"id":id,
    		"sourceId":sourceId,
			"cataid": cataid,
			"content":content,
			"quoteInfo":quoteInfo
    	});
    };

    /**
     * 音频播放
     * @param title
     * @param activeIndex 当前播放下标
     * @param list 音频列表
     * @param url
     */
    AppUtils.prototype.audioPlay = function (title,activeIndex,list,url) {
    	var cmd = 'CLIENT_AUDIO_PLAYER';
    	B.postNotification(cmd,{
    		"sourceConfig":{
	 			"weblink":url
	 		},
			"sourceType" : 1,
			"title" : title,
			"activeIndex" : activeIndex, // 当前播放下标
			"list" : list
    	});
    }

    /**
     * 浏览记录
     * @param appid
     * @param appname
     * @param appurl
     * @param author
     * @param cover
     * @param callback
     * @param puid
     * @param level
     */
    AppUtils.prototype.recently = function(appid, appname, appurl,author,cover,puid,level){
    	var cmd = 'CLIENT_RES_RECENTLY';
    	appid=appid+"";
	     if(appid.indexOf("mooc_")==-1){
	    	 appid="mooc_"+appid;
	  	 }

	     var cataid="100000001";//订阅分类号
	     var cataName="专题";//订阅分类名称
	     var content={
				"accountKey": "cx_fanya", //对应loginId相应的key值
			    "aid":appid, //同上面的otherConfig.id
			    "appid": $.md5(appurl), //md5(appurl)，appurl的md5值
			    "appname": appname, //订阅源名称
			    "appurl": appurl, //订阅源地址
			    "available": 1, //是否可用，10不可用，1可用，默认为1
			    "bind": 1,
			    "cataid": cataid,
			    "clientType": 127,
			    "description": "", //说明信息
			    "focus": 0,
			    "id": -1,
			    "isPrivate": 1,
			    "isWebapp": 1, //是否是webapp，1是，0不是，默认为1
			    "loginId": 2, //认证类型，1、opac，2、passport，0、统一认证。默认为0
			    "loginUrl": "", //登录认证地址
			    "logopath": cover, //图标地址
			    "logoshowtype": 1, //首页图标显示方式：1、通用app显示方式，2、rss订阅源显示方式
			    "needLogin": 0, //是否需要登录，1需要，0不需要，默认为0
			    "needRegist": 0, //是否需要注册，1需要，0不需要，默认为0
			    "norder": 0, //排序值，默认为int最大值
			    "otherConfig": {
			        "author": author,//创建者
			        "id":appid,//专题id，专题有两种，mooc专题和云盘专题，如果是mooc专题需要在专题id前加"mooc_"前缀，如果是云盘专题需要在专题id前加“yp_”前缀
			        "authorPuid":puid,
			        "level":level
			    },//扩展信息
			    "productId": 3,
			    "properties": "", //登录提示语
			    "rights": 1, //订阅源权限，默认为1
			    "usable": "", //是否可订阅的验证地址
			    "useClientTool": 2, //是否启用客户端工具条，1启用，0不自定义工具条，2，自定义分层结构的工具条，默认为1
			    "res_src":"market"
			};
	     	B.postNotification(cmd,{
		 		cataid : cataid,
		 		cataName :cataName,
		 		key :appid,
		 		content :content
		 	});
    }

    //定位
    AppUtils.prototype.userLocation = function(callback) {
		var cmd = 'CLIENT_USER_LOCATION';
		B.unbind(cmd);
		callback && B.bind(cmd, callback);
		B.postNotification(cmd);
	};

	/**
	 * 客户端打开小组列表
	 *
	 * @param listType int类型，默认为0，可选0、1、2，其中0表示我加入或我创建的小组
	 */
	AppUtils.prototype.openGroupList =  function(listType) {
		var option = {};
		if (!listType) {
			option = {listType:0};
		}else{
			option = {listType:listType};
		}

		var cmd = 'CLIENT_OPEN_GROUPLIST';
		B.postNotification(cmd, option);
	};
	AppUtils.prototype.fullScreen = function(){
	        var cmd = 'CLIENT_FULL_SCREEN';
	        B.postNotification(cmd, {
	            "enabled": 1
	        });
	}
	/**
	 * 截屏分享协
	 * @param type 0:返回截图信息，1：跳转到转发页
	 * @param litUrl 附加在截屏底部图片，比如二维码
	 */
	AppUtils.prototype.snapshot = function(type,litUrl) {
		var cmd = 'CLIENT_SNAPSHOT';
        B.postNotification(cmd, {
            "type": type || 0,
            "litUrl":litUrl || ''
        });
	}

	/**
	 * 打开手机图库 返回objectid的有上传进度条
	 * @param camare 空：打开相机+图库返回图片数据流；0打开相机返回图片数据流；2打开视频（objectid）；3打开相机+图库（objectid）；5打开相机（objectid）；6打开图库（objectid）
	 * @param maxImageCount 限制选择图片个数，默认为9
	 * @param maxVideoSize（单位M） 限制大小0不限制
	 */
	AppUtils.prototype.chooseImages = function(camare,maxImageCount,maxVideoSize) {
		var cmd = 'CLIENT_CHOOSE_IMAGE';
		B.unbind(cmd);
		B.postNotification(cmd, {
			camare:camare,
			maxImageCount:maxImageCount,
			maxVideoSize:1024*1024*maxVideoSize || 0
		});
	}

	/**
	 * 图片编辑
	 * @param imageUrl 需要编辑的图片地址
	 * @param resultImageType 返回图片格式 默认1 0jpg格式,1png格式
	 * @param backgroundColor 编辑器背景色值 默认黑色0x000000
	 * @param "canvasColor "编辑区画布背景色 默认白0xffffff
	 */
	AppUtils.prototype.editImage = function(imageUrl,resultImageType,backgroundColor) {
		var cmd = 'CLIENT_EDIT_IMAGE';
        B.postNotification(cmd, {
            "imageUrl": imageUrl || '',
            "resultImageType":resultImageType,
            "backgroundColor":backgroundColor || '0x000000',
            "canvasColor" : '0xffffff'
        });
	};

	/**
	 * 录音上传
	 */
	AppUtils.prototype.audioRecord = function(option) {
		var cmd = 'CLIENT_AUDIO_RECORD';
        B.postNotification(cmd, $.extend({
			"audioType" : ''
		}, option));
	};

	/**
	 * 电脑云盘文件上传
	 * CLIENT_SELECT_CLOUDRES
	 * @param supports 支持文件类型数组["ppt","pptx"]
	 * @param maxSize 最大选择数量
	 * @param folderEnable 是否选择文件夹 默认true
	 * @param titleClick  是否切换分类 默认true
	 */
	AppUtils.prototype.selectCloudRes = function(supports,maxSize,folderEnable,titleClick) {
		var cmd = 'CLIENT_SELECT_CLOUDRES';
        B.postNotification(cmd, {
        	"supports" : supports,
        	"maxSize" : maxSize || 1,
        	"folderEnable" : folderEnable || true,
        	"titleClick" : titleClick || true
        });
	};

	W['AppUtils'] = new AppUtils();

	// 隐藏打开链接后最上面默认显示的白框
	AppUtils.prototype.hideToolbar =  function(option) {
		var cmd = 'CLIENT_TOOLBAR_TYPE';
		B.postNotification(cmd, option);
	};

	/**
	 *  打开文件资源（"cataid":100000019）
	 */
	AppUtils.prototype.openRes = function (cataid,cataName,key,content){
		B.postNotification("CLIENT_OPEN_RES", {"cataid":cataid, "cataName":cataName, "key":key,"content":content});
    };

    /**
     * 打开笔记
     */
	AppUtils.prototype.openNote = function (creatorPuid,noteCid){
		B.postNotification('CLIENT_OPEN_NOTE_DETAIL', {"uid":creatorPuid , "noteCid":noteCid});
    };

    /**
     * 禁止ios下 元素下拉拖拽效果
     */
	AppUtils.prototype.iosForbidDrag = function (){
		B.postNotification('CLIENT_WEB_BOUNCES', {"forbiddenFlag":1});
    };

    /**
     * 调用相机/图库ocr识别图片
	 * @param picture:0 拍摄 1图片
     */
    AppUtils.prototype.photoOcr = function(picture) {
    	var cmd = 'CLIENT_PHOTO_OCR';
    	B.postNotification(cmd, {
    		"picture" : picture
    	});
	};

	/**
	 * 获取健康数据协议
	 * @param category：获取数据类型，默认0。  category=0 获取步数+距离数据；
	 * @param type：获取数据类型(汇总或批量明细) type=0 回调汇总数据；type=1 回调明细数据(不包含汇总数据)
	 */
	AppUtils.prototype.healthExecutor = function(category,type){
        var cmd = 'CLIENT_HEALTH_EXECUTOR';
        B.postNotification(cmd, {
			"category":category || 0,
			"type":type || 0
        });
    };

    /**
	 * 打开教案详情
	 * @param
	 */
	AppUtils.prototype.openTeachPlan = function(option) {
		if ($.isEmptyObject(option)) {
			return;
		}
		var cmd = 'CLIENT_OPEN_TEACH_PLAN';
		B.postNotification(cmd, $.extend({
			uuid: '', // 教案id
			tools: '', // 编辑器工具栏数据
			title: '', // 教案标题
			courseId: '', // 课程id
			classId: '' // 班级id
		}, option));
	};


	/**
	 * 打开进行中会议
	 * @param meetingRoomId
	 * @param chatRoomId
	 * @param audioStatus 麦克风0关闭；1开启
	 * @param videoStatus  摄像头0关闭；1开启
	 * @param hosterLimit  主播数的限制
	 */
	AppUtils.prototype.clientCXMeeting = function(meetingRoomId,chatRoomId, meetData, audioStatus, videoStatus, hosterLimit){
		if($.trim(meetingRoomId) == '') return;
		if(meetData != null && meetData != undefined && meetData != ''){
			meetData = JSON.stringify(meetData);
		}
		var cmd = 'CLIENT_CXMEETING';
		if(meetData == ''){
			B.postNotification(cmd,{
				hosterLimit: hosterLimit || 30,
				meetingRoomId:meetingRoomId,
				chatRoomId:chatRoomId,
				statPointerURL:'https://k.chaoxing.com/res/html/gpoint.html',
				statTalkPointerURL:'https://k.chaoxing.com/res/html/ypoint.html',
				sharePointerURL:'https://k.chaoxing.com/pc/meet/shareScreenPointer'
			});
		}else{
			B.postNotification(cmd,{
				hosterLimit: hosterLimit || 30,
				meetingRoomId:meetingRoomId,
				chatRoomId:chatRoomId,
				meetData:meetData,
				audioStatus:audioStatus || 0,
				videoStatus:videoStatus || 0,
				statPointerURL:'https://k.chaoxing.com/res/html/gpoint.html',
				statTalkPointerURL:'https://k.chaoxing.com/res/html/ypoint.html',
				sharePointerURL:'https://k.chaoxing.com/pc/meet/shareScreenPointer'
			});
		}
	}

})(window, jQuery, jsBridge);
