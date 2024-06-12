Schedule = {
	stime : ['','','','','','','','','','','',''],
	loadLessons : function(){}, // 加载课表数据
	renderPage : function(){}, // 加载后渲染页面
	curriculum : '',
	dailyLessonMap : new Map(), // key:周几，value，对应的课
	allLessonUuidMap:new Map(),// key:lessonConfigUuid，value，对应的课
	allLessonMap : new Map(), // key:leesonid，value，对应的课
	maxWeek : 25, // 最大周数
	firstWeekDate : '', // 设置的第一周的第一天
	weekdata : '',
	visitor : 0, // 是否是访问者身份，0、不是，1、是，访问者不能进行相关操作，2、访问者且未登录
	am : 3,
	pm : 7,
	inClient:false, // 是否是客户端嵌入的
	isClientDate:true, // 是否用的是客户端本地缓存的数据
	getDataByClientCount: 0, //调用客户端方法的次数
	domain:'https://kb.chaoxing.com', // 默认域名，用于页面嵌在客户端时使用，走网页的情况下再动态获取当前域名
	mctx:'', //域名分路径
	// 某些单位做了本地镜像，并且是定制app，依然会拉公网脚本包。这里通过appId来获取对应域名
	mirrorDomainCfg:{
		"1000311":{
			"domain":"http://kb.mooc.ucas.edu.cn",
			"mctx":""
		}
	},
	schoolOpens:1,//是否开学 1 开学 0 未开学（切换学期和修改开学日期时需要判断）
	weeklist: ['周一','周二','周三','周四','周五','周六','周日'],
	weeklistKey : ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'], //i18n配置文件中的key
	monDayIsBegin : true, // 周一是一周的开始
	onlineWayList : [], //传给协议，控制线上授课的方式
	startmove:false,
	firstOpen:true, //是否首次打开此页面
	openStuDetailWithProtocol : false, //是否支持使用协议打开学生详情页
	openTeaDetailWithProtocol : false, //是否支持使用协议打开教师详情页
	isLoadingFormUrl : false, //是否正在获取表单编辑页地址
	hasLocationHistory : 0, // 是否有历史地址
	supportCXMeet : 0, // 是否支持使用泛雅课堂
	dayModel : 0, // 显示当天课程模式
	isKeTang : 0, // 是否是泛雅课堂PC客户端
	deleteLesson : {}, //记录要删除课堂的课
	role : '', //现在移动端正常是通过两个入口进的，客户端会注入Schedule.role=1或4，避免有的地方通过链接访问还没有带role，这里默认给个role=4
	pluginVersion : 130, //当前市场版插件版本号
	clashCourseArr: [], // 冲突课程信息
}
var timer;

Schedule.event = function(){

	// 退出
	$('.back').click(function(){
		AppUtils.closeView();
		// 从推送的上课提醒里进入详情页再进入编辑页，编辑完成后会跳到课表首页，从首页退出的时候可能要退出多级页面
		// AppUtils.closeView('', 9);
	})
	//周选择事件，点击展示周次下拉框
	$('.selectWeek').click(function(e){
		$('.settingModal').hide();
		if($(this).parent().hasClass('active')){
			$(this).parent().removeClass('active')
			$('body').removeClass('popOverflow');
		}else{
			$(this).parent().addClass('active')
			$('body').addClass('popOverflow');
		}
		e.stopPropagation(); //阻止事件向上冒泡
	})

	//点击某一周
	$('.selectList').on('click', 'li p', function(){
		$('.completeDelete').hide();
		$('.totalscheduel').click();//默认点击周的时候进入总览
		$('.selectList li p').removeClass('active');
		$('.selectBox').removeClass('active');
		$(this).addClass('active');
		var html = getI18nText($(this).text());
		if (Schedule.schoolOpens == 0) {
			html += '('+ getI18nText('未开学') +')';
		}
		html = html.replace('(' + getI18nText('本周') + ')','');
		$('.selectWeek span').html(html).attr('week',$(this).parent().index()+1);
		$('body').removeClass('popOverflow');

		var chooseWeek = $('.selectWeek span').attr('week');
		updateThead(chooseWeek);
		Schedule.loadLessons(chooseWeek);
		Schedule.clashCourseArr = []
	})

	//20200807 点击阴影关闭弹窗
	$('.selectList').on('click','ul',function(e){
		e.stopPropagation();
	})
	$('.selectList').click(function(){
		$(this).parent().removeClass('active');
		$('body').removeClass('popOverflow');
	})

	//点击设置 右上角
	$('.setting').click(function(e){
		clearTimeout(timer)
		// $('.settingTips').hide()
		$('.tipsMask').hide()
		e.stopPropagation()
		$('.settingMask').show();
		$('.settingModal').show();
	})
	$('.settingModal').click(function(e){
		e.stopPropagation()
	})
	$('.settingMask').click(function(e){
		$('.settingMask').hide();
	})
  // 返回到当前周
  $(".backToWeek").click(function () {
    var backToWeek = 1;
    if (Schedule.curriculum.currentWeek) {
      backToWeek = Schedule.curriculum.currentWeek;
    }
    var html = getI18nText("第" + backToWeek + "周");
    if (Schedule.schoolOpens == 0) {
      html += "(" + getI18nText("未开学") + ")";
    }
    html = html.replace("(" + getI18nText("本周") + ")", "");
    $(".selectWeek span").html(html).attr("week", backToWeek);
    $("body").removeClass("popOverflow");
		Schedule.clashCourseArr = []
    updateThead(backToWeek);
    Schedule.loadLessons(backToWeek);
  });
	//无课程第一次点击，表格背景改变，调出添加备注符号
	$('table').on('click','td.col',function(event){
		//判断如果是泛雅课堂客户端里面，不让加课
		if (Schedule.isKeTang){
			return;
		}
		if (!Schedule.canOperate()) {
			return;
		}
		/** 未开学页面不能添加课程
		var week = $('.selectWeek span.week').attr('week');
		if (week < 1 || week > Schedule.curriculum.maxWeek) {
			return;
		}*/
		//20200819 单日界面，点击空白新增课程
		if ($('table').hasClass('dayView')) {
			if ($(this).children().length == 0){
				var col = $('th.active').find('.week').attr('weekday');
				col = Schedule.getRealIndex(col);
				var row = $(this).parents('tr').index()+1;
				//跳转到新增页面
				var param = '?col=' + col + '&row=' + row
				+ '&length=1'
				+ '&selectWeek=' + $('.selectWeek .week').attr('week')
				+ '&curriculumUuid=' + Schedule.curriculum.uuid
				+ '&maxLength=' + Schedule.curriculum.maxLength
				+ '&maxWeek=' + Schedule.curriculum.maxWeek
				+ '&em=' + Schedule.curriculum.earlyMorningSection
				+ '&role=' + Schedule.role;
				//跳转到新增页面
				var url = Schedule.domain + Schedule.mctx + '/res/app/curriculum/addScheduleNew.html';

				AppUtils.openUrl({
					toolbarType : 1,
					webUrl : url + param
				});
			}
		} else if (!$(this).attr('rowspan')) {
			$('td.col .firstClick').parent().removeAttr('rowspan').removeClass('delete').html('');
			$('td.col .firstClick').remove();
			$('td.delete').removeClass('delete');
			$(this).html('<div class="firstClick ycenter xcenter"><img class="add" src="images/add.png" /></div>')

			//20200827
			setBorder();
		}
	});
	// 冲突课程列表
	$('.popClashCourseModal').click(function(e){
		e.stopPropagation()
		$('.popClashCourseModal').hide();
	})
	//点击课程跳转详情
	$('table').on('click','td[rowspan]',function(event){
		if (!$(this).attr('lessonid') || !Schedule.canOperate()) {
			return;
		}
		var lesson = Schedule.allLessonMap.get($(this).attr('lessonid')) || {};
		// Schedule.openDetailPage(lesson);
		if($(this).find('.clashCourse').length>0){
			showClashCourseModal($(this))
		}else{
			Schedule.openDetailPage(lesson);
		}
	});

	//拖动 20200826定义scrollTop，监听事件加touchend
	var starttotdtop,scrollTop=0,startpageX,startpageY;
	$('table').on('touchstart touchmove touchend','.firstClick',function(e){
		if (!Schedule.canOperate()) {
			return;
		}
		// e.preventDefault();
		var tdtop = $(this).parents('tr').offset().top;
		var tdheight = $(this).parents('tr').height();
		var col = getcol($(this).parent());
		var row = $(this).parents('tr').index()+1;
		var type = e.type;
		var  movetotdtop,dir;
		switch (type){
			case 'touchstart':
			    e.preventDefault();
			    e.stopPropagation();
			    isfolderdown = false;
			    Schedule.startmove=true;
				lastrowspan=1;
				var touch = e.originalEvent.targetTouches[0];
				startpageX = parseInt(touch.clientX);
				startpageY = parseInt(touch.clientY);
				starttotdtop = touch.pageY - tdtop;//开始距离td顶部
				//20200826 禁止body滚动
				scrollTop = document.body.scrollTop || document.documentElement.scrollTop;// 在弹出层显示之前，记录当前的滚动位置
				document.body.classList.add('popOverflow');// 使body脱离文档流
				document.body.style.top = -scrollTop + 'px';// 把脱离文档流的body拉上去！否则页面会回到顶部！
				break;
			case 'touchmove':
				if(Schedule.startmove==false){
					return;
				}
				var touch = e.originalEvent.targetTouches[0];
				movetotdtop = touch.pageY - tdtop; //移动后距离td顶部
//				console.log(starttotdtop +'  '+movetotdtop);
				if(movetotdtop<0 || (movetotdtop>0 && starttotdtop > movetotdtop)){
					//移到上一个td
					var num = parseInt(Math.abs(movetotdtop)/tdheight) + 1;
					if(movetotdtop>0 && starttotdtop > movetotdtop){
						num = 0
					}
					dir = -1;
					if(num>0){
						dragmergecol(row,col,num,dir)
					}
				}else if(movetotdtop > 0  && starttotdtop < movetotdtop ){
					//移到下一个td
					var num = parseInt(movetotdtop/tdheight);
					dir = 1;
					dragmergecol(row,col,num,dir)
				}
				break;
			case 'touchend':
				Schedule.startmove=false;
				//20200826 body恢复滚动
				endpageX = parseInt(e.originalEvent.changedTouches[0].clientX);
				endpageY = parseInt(e.originalEvent.changedTouches[0].clientY);
//				console.log(startpageX +'  '+endpageX +'  '+startpageY+'   '+endpageY)
				starttotdtop=0;
				document.body.classList.remove('popOverflow');// body又回到了文档流中
				document.body.scrollTop = document.documentElement.scrollTop = scrollTop;// 滚回到老地方
				if(startpageX == endpageX && startpageY == endpageY){
					if (!Schedule.canOperate()) {
						return;
					}
					//20200826 阻止冒泡
					e.stopPropagation();
					e.preventDefault();
					starttotdtop=0;
					//20200826 body恢复滚动
					document.body.classList.remove('popOverflow');// body又回到了文档流中
					document.body.scrollTop = document.documentElement.scrollTop = scrollTop;// 滚回到老地方
					//行列
					var col,row;
					var colclass = $(this).parents('.col').attr('class').split(' ');
					for(var i=0;i<colclass.length;i++){
						if(colclass[i].length>3 && colclass[i].indexOf('col')>-1){
							col = colclass[i].split('col')[1];
						}
					}
					col = Schedule.getRealIndex(col);
					row = $(this).parents('tr').index()+1;
					var param = '?col=' + col + '&row=' + row
						+ '&length=' + ($(this).parent().attr('rowspan') || 1)
						+ '&selectWeek=' + $('.selectWeek .week').attr('week')
						+ '&curriculumUuid=' + Schedule.curriculum.uuid
						+ '&maxLength=' + Schedule.curriculum.maxLength
						+ '&maxWeek=' + Schedule.curriculum.maxWeek
						+ '&em=' + Schedule.curriculum.earlyMorningSection
						+ '&role=' + Schedule.role;
					//跳转到新增页面
					var editUrl = Schedule.domain + Schedule.mctx + '/res/app/curriculum/addScheduleNew.html';
					AppUtils.openUrl({
						toolbarType : 1,
						webUrl : editUrl + param
					});
				}
				break;
			default:
				break;
		}
	})

	// 接收其他页面回传的数据
	jsBridge.bind('CLIENT_WEB_EXTRAINFO', function(object){
		if (object && object.typeflag) {
			if (object.typeflag == 'CXWEB_DATA_RELOAD') {
				// 在抓取页面导入成功后也是返回到首页
				if (object.msg) {
					AppUtils.clientMessageDisplay(object.msg);
				}
				// 创建完成或者编辑后的回调，重新加载数据
				Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
			} else if (object.typeflag == 'CXWEB_DATA_UPDATE_CURRET_WEEK') {
				// 修改了当前周
				var currentWeek = parseInt(object.info.currentWeek);
				if (currentWeek < 1) {
					Schedule.schoolOpens = 0;
					$('.selectList li p').eq(0).click();//修改为未开学时先跳转到第一周
				} else {
					Schedule.schoolOpens = 1;
					$('.selectList li p').eq(currentWeek-1).click();
				}
				if (object.info.maxWeek) {
					Schedule.curriculum.maxWeek = object.info.maxWeek;
					initSelectlist();
					Schedule.weekdata = getWeekDate(Schedule.firstWeekDate, Schedule.curriculum.maxWeek);
					Schedule.curriculum.firstWeekDateReal = object.info.firstWeekDateReal;
				}
				if (Schedule.inClient) {
					// 嵌入在客户端中，调客户端方法让客户端调接口取配置数据更新本地缓存
					Schedule.loadLessons($('.selectWeek span').attr('week'), 1, 1)
				}
			} else if (object.typeflag == 'CXWEB_DATA_UPDATE_LESSON_LENGTH') {
				// 更新每日课程节数
				Schedule.stime = JSON.parse(object.info.stime);
				updateTdTime(Schedule.stime);
				refreshTbody('#scheduleTable', Schedule.stime.length);
				if (Schedule.inClient) {
					// 嵌入在客户端中，调客户端方法让客户端调接口取配置数据更新本地缓存
					Schedule.loadLessons($('.selectWeek span').attr('week'), 1, 1)
				}
			} else if (object.typeflag == 'CXWEB_CHANGE_SEMESTER') {
				// 修改当前学期
				if (object.info.schoolYear != Schedule.curriculum.schoolYear
					|| object.info.semester != Schedule.curriculum.semester) {
					var localStorageData = {
						schoolYear: object.info.schoolYear,
						semester : object.info.semester,
						userSelectedTime : new Date().getTime()
					}
					localStorage.setItem('last_selected_curriculum', JSON.stringify(localStorageData));
					// 学期或者学年有变化，重新加载数据
					Schedule.loadLessons('', 0, 1);
				}

			}
		}
	});

	// 详情页可能是客户端的，上面的CLIENT_WEB_EXTRAINFO不能跨页面通信，改成下面的协议获取编辑页修改课表后发过来的消息
	jsBridge.bind('CLIENT_REFRESH_EVENT', function(object){
		Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
	});

	$('body,table,td').on('touchstart',function(){
		if($('body').hasClass('popOverflow')){
			$('body').removeClass('popOverflow');
			document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
		}
	})
	// 设置
	$('.setBtn').click(function(){
		$('.settingMask').click();
		var url = Schedule.domain + Schedule.mctx + '/res/app/curriculum/setting.html?curriculumUuid='
			+ Schedule.curriculum.uuid + '&currentWeek=' + Schedule.curriculum.currentWeek
			+ '&maxWeek=' + Schedule.curriculum.maxWeek
			+ '&firstWeekDate=' + (Schedule.curriculum.firstWeekDateReal||'')
			+ '&role=' + Schedule.role;
		AppUtils.openUrl({
			toolbarType : 1,
			webUrl : url
		});
	})

	// 扫一扫
	$('.richScan').click(function(){
		$('.settingMask').click();
		 jsBridge.postNotification('CLIENT_BARCODE_SCANNER', {'manualInputTitle':'xx','config':{'inputUnable':'xx','lightUnable':'xx','albumUnable':'xx','cancleUnable':'xx'}});
	     jsBridge.bind('CLIENT_BARCODE_SCANNER', function(object){
	    	 if (object && object.message) {
	    		 AppUtils.openUrl({
	 	 			toolbarType : 1,
	 	 			webUrl : object.message,
	 	 		 });
	    	 }
	     });
	})

	// 生成二维码
	$('.QRCode').click(function(){
		$('.settingMask').click();
		var title = (Schedule.curriculum.userName||'') + getI18nText("的课表");
		var param = {
				"cataid":100000015,
				"content":{
					"resLogo": Schedule.domain + Schedule.mctx + "/res/app/curriculum/images/schedule.png",
					"resTitle": title,
					"resUrl": Schedule.domain + Schedule.mctx + "/res/app/curriculum/schedule.html?curriculumUuid=" + Schedule.curriculum.uuid
				}
		};
		jsBridge.postNotification('CLIENT_SHOW_RESOURCE_QR_CODE', param);
	})

	// 转发
	$('.forward').click(function(){
		$('.settingMask').click();
		var title = (Schedule.curriculum.userName||'') + getI18nText("的课表");
		var content = {
				"resTitle": title,
				"resUrl": Schedule.domain + Schedule.mctx + "/res/app/curriculum/schedule.html?curriculumUuid=" + Schedule.curriculum.uuid,
				"resLogo": Schedule.domain + Schedule.mctx + "/res/app/curriculum/images/schedule.png",
				"resUid": Schedule.curriculum.uuid};
		jsBridge.postNotification("CLIENT_TRANSFER_INFO", {"cataid": 100000015,"content": content});
	})

	// 导入
	$('.import').click(function(){
		Schedule.clickImport();
	})

	//fromModel 是否通过弹框导入的
	Schedule.clickImport = function(fromModel) {
		//判断该单位是否可以使用导入功能
		if (Schedule.curriculum.isHasEduLesson) {
			$('.loadingModal').show();
			return;
		}
		$('.settingMask').click();
		var webUrl = Schedule.domain + Schedule.mctx + '/res/app/curriculum/selectSchool.html?v=2&isHasEduLesson='+Schedule.curriculum.isHasEduLesson+'&curriculumUuid=' + Schedule.curriculum.uuid;
		if (fromModel == 1){
			webUrl += '&from=model';
		}
		AppUtils.openUrl({
			toolbarType : 1,
			webUrl : webUrl,
		});
	}

	//点击周几，切换到当天
	$('table').on('click','th',function(event){
		//获取当天日期
		//20200818 点击当日再回到总览页面
		//如果进首页带的有Schedule.dayModel=1，则每次点击还是会显示当天模式
		if(!$(this).hasClass('active') || Schedule.dayModel){
			$('th').removeClass('active');
			$(this).addClass('active');
			$('table').addClass('dayView');
			$('.totalscheduel').show();
			var date = $(this).find('.weekdate').attr('date');
			var index = $(this).index();
			index = Schedule.getRealIndex(index);
			updateDayTbody('#scheduleTable', Schedule.dailyLessonMap.get(index), Schedule.stime);
		} else {
			$('.totalscheduel').click();
		}
	});
	//总览
	$('.totalscheduel').click(function(){
		//20200825 显示第一列时间
		$('.stime').show();
		$('table').removeClass('dayView');
		$(this).hide();
		$('th').removeClass('active');
		updateTbody('#scheduleTable');
		if (Schedule.dailyLessonMap && Schedule.dailyLessonMap.values().length > 0) {
			$.each(Schedule.dailyLessonMap.values(), function(index, lessonArray){
				$.each(lessonArray, function(idx, val) {
					var courseName = val.name;
					if (checkIsEn() && val.englishCourseName) {
						courseName = val.englishCourseName;
					}
					/* 2023-08-25 广东海洋大学课表定制_卡片显示上课时间*/
					let lessonTime = ''
					if (Schedule.isContainsFid(118117)&&val.extendInfo){
						var start = val.extendInfo.startTime.split(' ')[1].split(':')
						var end = val.extendInfo.endTime.split(' ')[1].split(':')
						lessonTime = start[0] + ':' + start[1] + '-' + end[0] + ':' + end[1]
					}
					addCourse(val.beginNumber, val.dayOfWeek, val.length,
						courseName, val.location, val.colorIndex,
						val.lessonId, val.onlineLocation, val.role,lessonTime,val);
				})
			})
		}
	});

	// 复制别人的课表
	$('.copySchedule').click(function(){
		var url = Schedule.mctx + '/curriculum/copyCurriculum?curriculumUuid=' + Schedule.curriculum.uuid;
		$.post(url, {}, function(data){
			if(!data) {
				AppUtils.clientMessageDisplay('复制失败');
				return;
			}
			if (data.result != 1) {
				AppUtils.clientMessageDisplay(data.msg || '复制失败');
				return;
			}
			AppUtils.clientMessageDisplay('复制成功');
		})
	});

	//左右滑动更新周
	var startX, startY;
	$('.table').on('touchstart touchmove touchend',function(e){
		//20200819PM 单日课表不更新--加if判断
		if(!$('table').hasClass('dayView')){
			switch (e.type){
			case 'touchstart':
				startX = e.originalEvent.targetTouches[0].pageX;
				startY = e.originalEvent.targetTouches[0].pageY;
				break;
			case 'touchend':
				moveEndX = e.originalEvent.changedTouches[0].pageX;
				moveEndY = e.originalEvent.changedTouches[0].pageY;
				X = moveEndX - startX;
				Y = moveEndY - startY;
				var nowweek = parseInt($('.selectWeek span').attr('week'));
				if(Math.abs(X) > Math.abs(Y) && X > parseInt($(window).width()/3)) {
					if(nowweek>1){
						var html = getI18nText('第'+(nowweek-1)+'周');
						if (Schedule.schoolOpens == 0) {
							html += '('+ getI18nText('未开学') +')';
						}
						$('.selectWeek .week').html(html).attr('week',nowweek-1);
						$('.selectList li p').removeClass('active');
						$('.selectList li p').eq(nowweek-2).addClass('active');

						updateTbody('#scheduleTable');
						Schedule.loadLessons(nowweek-1);
					}
				} else if(Math.abs(X) > Math.abs(Y) && X < - parseInt($(window).width()/3)) {
					if(nowweek<Schedule.curriculum.maxWeek){
						var html = getI18nText('第'+(nowweek+1)+'周');
						if (Schedule.schoolOpens == 0) {
							html += '('+ getI18nText('未开学') +')';
						}
						$('.selectWeek .week').html(html).attr('week',nowweek+1);
						updateTbody('#scheduleTable');
						Schedule.loadLessons(nowweek+1)
						$('.selectList li p').removeClass('active');
						$('.selectList li p').eq(nowweek).addClass('active');
					}
				}
				break;
			default:
				break;
			}
		}
	});

	// 当日课表下的课点击查看详情
	$('#scheduleTable').on('click', '.dayDiv', function(){
		if (!$(this).attr('lessonid')) {
			return;
		}
		var lesson = Schedule.allLessonMap.get($(this).attr('lessonid')) || {};
		if($(this).find('.day-clash').length){	// 冲突课程
			showClashCourseModal($(this));
		} else {
			Schedule.openDetailPage(lesson);
		}
	});

	// 点击提示页面，关闭页面
	$('.guidMask').click(function(){
		$('body').removeClass('popOverflow');
		$('.guidMask').hide();
		if (Schedule.inClient) {
			// 嵌入在客户端中，调客户端方法让客户端调接口取配置数据更新本地缓存，避免下次进去时先取客户端缓存，客户端里面缓存的curriculum里面还记录着firstOpen=1
			Schedule.loadLessons($('.selectWeek span').attr('week'), 1, 1)
		}
	});

	// 弹框点知道了
	$('.loadingModal .modalbtn').click(function(){
		$('.loadingModal').hide();
	});

	// 导入课表弹框点取消
	$('.centerMask .cancle').click(function(){
		$(this).parents('.centerMask').hide();
	})
	// 导入课表弹框点导入课表
	$('.centerMask .importSche').click(function(){
		$('.centerMask .cancle').click();
		Schedule.clickImport(1);
	});
	// 关闭课程较少的提示
	$('.lessTips i').click(function(){
		$('.lessTips').hide();
		$('body').removeClass('hasLesstips');
	});

	// 点击查看历史课表
	/*$('.settingList .history').click(function () {
		$('.settingMask').click();
		AppUtils.openUrl({
			toolbarType : 1,
			webUrl : Schedule.domain + Schedule.mctx + '/res/app/curriculum/curriculumHistory.html'
		});
	})*/

	//20210428 支持长按删除课程
	var longstart;
	$('table').on('touchstart','td .tddiv',function(e){
		if (!Schedule.canOperate()) {
			return;
		}
		var _this = this;
		longstart = setTimeout(function () {
			if($('.tddiv').find('.delete').length==0){
				for(let i=0;i<$('.tddiv').length;i++){
					if($('.tddiv').eq(i).find('.clashCourse').length == 0){
						$('.tddiv').eq(i).append('<i class="delete"></i>');
					}
				}
				$('.completeDelete').show();
				$('.rightHead').hide();
			}
		}, 700);
	}).on('touchend','td .tddiv',function(e){
		clearTimeout(longstart)
	});
	$('table').on('click','.tddiv i.delete',function(e){
		e.preventDefault();
		e.stopPropagation();
		var index = $('td').index($(this).parents('td'));
		$('.deleteCourseModal').show().attr('index',index);
	});
	//点击其他表格取消删除模式
	$('table').on('click','td,th',function(){
		$('i.delete').remove();
		$('.completeDelete').hide();
		if (!Schedule.canOperate()) {
			return;
		}
		$('.rightHead').show();
	});

	//点右上角完成取消删除模式
	$('.completeDelete').click(function(){
		$('i.delete').remove();
		$('.completeDelete').hide();
		$('.rightHead').show();
	});
	//删除弹窗--取消
	$('.deleteCourseModal').on('click','.cancle',function(){
		$('.deleteCourseModal').hide();
	});
	//删除弹窗--确定
	$('.deleteCourseModal').on('click','.sureDelete',function(){
		$('.deleteCourseModal').hide();
		var td = $('td').eq($('.deleteCourseModal').attr('index'));
		Schedule.deleteLessonId = td.attr('lessonid');
		Schedule.deleteCourse();
	});

	// 取消删除课堂
	$('.popDeleteCourseModal .cancle').on('click',function(){
		$(this).parents('.centerMask').hide();
	})

	// 确认删除课堂
	$('.popDeleteCourseModal .sureDelete').on('click',function(){
		$(this).parents('.centerMask').hide();
		Schedule.updateLessonConfig();
	})

	$('.popClashCourseModal').on('click', '.item', function(e){
		e.stopPropagation();
		e.preventDefault()
		var isDayView = $('table').hasClass('dayView')
		if(isDayView) {
			let lessonid = $(this).find('.location').eq(0).attr('data-lessonid')
			let lesson = Schedule.allLessonMap.get(lessonid) || {}
			Schedule.openDetailPage(lesson);
		}

	})

	//置顶冲突课
	$('.popClashCourseModal').on('click', '.topBtn', function(e){
		e.stopPropagation();
		e.preventDefault()
		var lessonConfigUuid = $(this).attr('data-lessonConfigUuid');
		var url = Schedule.domain + Schedule.mctx + '/pc/curriculum/setLessonTop?lessonConfigUuid=' + lessonConfigUuid + '&term='+Schedule.getTerm();
		if (Schedule.inClient) {
			// 嵌在客户端里，通过openurl协议调接口
			var param = {
				loadType : 3,
				webUrl : url,
			}
			jsBridge.unbind('CLIENT_OPEN_URL');
			jsBridge.postNotification('CLIENT_OPEN_URL', param);
			jsBridge.bind('CLIENT_OPEN_URL', function(object){
				if (typeof object == 'undefined' || object.result == 0) {
					return;
				}
				var data = object.data;
				if (typeof data == 'string') {
					data = JSON.parse(data);
				}
				if (data.result == 0){
					AppUtils.clientMessageDisplay(data.msg);
					return;
				}
				$('.popClashCourseModal').hide();
				Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
			});
		}else {
			Schedule.clashCourseArr = []
			// 线上，直接调接口
			$.getJSON(url, {}, function(data){
				if (data.result == 0){
					AppUtils.clientMessageDisplay(data.msg);
					return;
				}
				$('.popClashCourseModal').hide();
				Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
			})
		}
	})

	$('.popClashCourseModal').on('click', '.detail', function(e){
		e.stopPropagation();
		e.preventDefault()
		$('.popClashCourseModal').hide();
		Schedule.openDetailPage(Schedule.allLessonMap.get($(this).attr('data-lessonid')));
	})
}


// 从课表首页删除课堂
Schedule.updateLessonConfig = function () {
	var param = {
		lessonConfigUuid : Schedule.deleteLesson.lessonConfigUuid,
		curriculumId : Schedule.curriculum.id,
		lessonId : Schedule.deleteLesson.lessonId,
		updateLocationType : 0,
		onlineLocationNoteCid : '',
		meetCode : '',
		onlineLocation : '',
	}
	// 关联班级空间
	$.ajax({
		type: 'POST',
		headers:{"Content-Type":"application/x-www-form-urlencoded"},
		url: Schedule.mctx + '/pc/curriculum/updateLessonConfig',
		data: param,
		dataType: 'json',
		success: function(data){
			if(!data || data.result != 1) {
				if (data.msg) {
					AppUtils.clientMessageDisplay(data.msg);
				}
				return;
			}
			//刷新页面
			Schedule.loadLessons($('.selectWeek span').attr('week'), 0, 1)

		},
	});
}

/** 查指定周的课程
 * @param week 要查的周次
 * @param queryType 查询类型，0、查配置和数据，1、只查配置；用于首页嵌入到客户端时修改了配置后更新客户端本地缓存
 * @param reload 是否需要调接口重新加载数据
 */
Schedule.loadLessons = function(week, queryType, reload) {
	var localStorageData = localStorage.getItem('last_selected_curriculum');
	if (localStorageData) {
		// 	缓存中有记录用户切换后的学期
		try {
			localStorageData = JSON.parse(localStorageData);
		} catch (e) {

		}
	}
	var requestParam = {};
	//先从本地缓存中获取用户上次选择的学年学期
	if (localStorageData) {
		requestParam.schoolYear = localStorageData.schoolYear || '';
		requestParam.semester = localStorageData.semester || '';
		if (!localStorageData.userSelectedTime) {
			// 用户切换课表的时候，为空时默认为当前时间
			localStorageData.userSelectedTime = new Date().getTime();
			localStorage.setItem('last_selected_curriculum', JSON.stringify(localStorageData));
		}
		requestParam.userSelectedTime = localStorageData.userSelectedTime;
	}
	var url = window.location.href;
	if (url.startsWith('http')) {
		// 线上
		Schedule.domain = window.location.origin;
		Schedule.mctx = window.location.pathname.substring(0, window.location.pathname.indexOf('/res')) || '';
		if (url.indexOf('?') > 0 && url.indexOf('curriculumUuid=') > -1) {
			url = '/curriculum/getOtherLessons' + url.substring(url.indexOf('?'));
		} else {
			url = '/curriculum/getMyLessons' + window.location.search;
		}
		if (week) {
			requestParam.week = week;
		}
		$.getJSON(Schedule.mctx + url, requestParam, function(data){
			if (data.result != 1) {
				if (data.msg == '用户信息异常，请登录后再试') {
					window.location.href = getServerDomain('passport2DomainHttps') + '/mlogin?fid=&newversion=true&refer='+window.location.href;
				}
				return;
			}
			if (!data || data.result != 1) {
				return;
			}
			if(Schedule.isContainsFid(16820) && ToolsUtils.getUrlParameter('dayModel') == 1 && Schedule.firstOpen){
				Schedule.firstOpen = false;
				// $('.settingTips').show()
				$('.tipsMask').show()
				timer = setTimeout(function(){
					// $('.settingTips').hide()
					$('.tipsMask').hide()
				},20000)
			}
			Schedule.renderPage(data.data)
		});
	} else {
		// 调用客户端方法
		Schedule.inClient = true;
		// 嵌在客户端内，通过appId强制替换为镜像域名
		var appId = ToolsUtils.getClientVersion('appId');
		var mirrorjson = Schedule.mirrorDomainCfg[appId];
		if (mirrorjson){
			Schedule.domain = mirrorjson.domain;
			Schedule.mctx = mirrorjson.mctx;
		}
		if (!queryType) {
			queryType = 0;
		}
		Schedule.getDataByClient(week, queryType, reload, requestParam);
	}
}
// 将所有的课 无论是否冲突 都放进 dailyLessonMap
function putDailyLessonMap(val){
	var dayArray = new Array();
	dayArray.push(val);
	if(!Schedule.dailyLessonMap.get(val.dayOfWeek)){
		Schedule.dailyLessonMap.put(val.dayOfWeek, dayArray)
	}else{
		dayArray = [...dayArray,...Schedule.dailyLessonMap.get(val.dayOfWeek)]
		Schedule.dailyLessonMap.put(val.dayOfWeek, dayArray)
	}
	if(val.conflictLessons){
		val.conflictLessons.forEach((item)=>{
			var dayNextArray = new Array();
				dayNextArray.push(item);
				if(!Schedule.dailyLessonMap.get(item.dayOfWeek)){
					Schedule.dailyLessonMap.put(item.dayOfWeek, dayArray)
				}else{
					dayArray = [...dayArray,...Schedule.dailyLessonMap.get(item.dayOfWeek)]
					Schedule.dailyLessonMap.put(item.dayOfWeek, dayArray)
				}
		})
	}
}
// 将所有的课 无论是否冲突 都放进 allLessonMap 和 allLessonUuidMap
function putAllLessonMap(val){
	Schedule.allLessonMap.put(val.lessonId, val)
	Schedule.allLessonUuidMap.put(val.lessonConfigUuid, val)
	if(val.conflictLessons){
		val.conflictLessons.forEach((item)=>{
			Schedule.allLessonMap.put(item.lessonId, item)
			Schedule.allLessonUuidMap.put(item.lessonConfigUuid, item)
		})
	}
}
// 加载数据后，渲染页面
Schedule.renderPage = function(data) {

	// 是否是在批量删除模式下重新加载的数据，删除模式下重新加载数据之后为了更新客户端本地缓存，不用进行其他处理
	if ($('.tddiv').find('.delete').length > 0) {
		return;
	}

	if (typeof data == 'string') {
		data = JSON.parse(data);
	}
	if (!data || !data.curriculum) {
		return;
	}
	if (data.curriculum.firstOpen) {
		$('body').addClass('popOverflow');
		$('.guidMask').show();
	}
	Schedule.curriculum = data.curriculum;
	var hideImport = false;
	if (Schedule.isContainsFid(35014) || Schedule.curriculum.isHasEduLesson) {
		// 国科大不显示导入按钮，课表中含有教务课也不显示导入按钮
		// $('.import').hide();
		hideImport = true;
	}
	if (data.visitor && data.visitor > 0) {
		// 访客模式
		Schedule.visitor = data.visitor;
		if(data.visitor == 1){
			// 查看的他人的课表，且登录了，显示复制
			$('.topLine').show();
			$('.table').addClass('other');
		}
	} else if (window.location.href.indexOf('visitor=1') > -1) {
		// 查看历史课表，当做访客模式
		Schedule.visitor = 1;
	} else {
		// 不是访问者，打开的自己的课表，显示设置按钮
		$('.rightHead').show();
	}
	initSelectlist();
	/**
	 * 初次打开页面会先用客户端本地缓存的数据，然后客户端会请求接口拉到最新数据返回，
	 * 比较本地的firstWeekDate和接口返回的firstWeekDate，有变化则修改显示的当期周
	 */
	var hasChangeFirstWeekDate = false;
	if (Schedule.firstWeekDate != data.curriculum.firstWeekDate) {
		hasChangeFirstWeekDate = true;
	}
	Schedule.firstWeekDate = data.curriculum.firstWeekDate;

	// 新增早晨节次，默认0
	Schedule.curriculum.earlyMorningSection = Schedule.curriculum.earlyMorningSection || 0;
	// if (typeof Schedule.curriculum.earlyMorningSection == 'undefined' || Schedule.curriculum.earlyMorningSection == null) {
	// 	Schedule.curriculum.earlyMorningSection = 1;
	// }

	// 根据起始日期和周数算出每周的时间
	Schedule.weekdata = getWeekDate(Schedule.firstWeekDate, Schedule.curriculum.maxWeek);
	// 时间区间配置
	if (data.curriculum.lessonTimeConfigArray) {
		Schedule.stime = data.curriculum.lessonTimeConfigArray;
		//当lessonTimeConfig的长度和（maxLength+早晨节次）大小不一致时，按照maxLength来渲染课表首页
		if (Schedule.stime.length > data.curriculum.maxLength + Schedule.curriculum.earlyMorningSection){
			Schedule.stime.splice(data.curriculum.maxLength,Schedule.stime.length-(data.curriculum.maxLength+Schedule.curriculum.earlyMorningSection));
		}else {
			//lessonTimeConfig的长度不足节次最大长度时，补充""到数组中
			var len = data.curriculum.maxLength + Schedule.curriculum.earlyMorningSection - Schedule.stime.length;
			for (i = 0; i < len; i++) {
				Schedule.stime.push('');
			}
		}
	} else {
		Schedule.stime = new Array();
		for(var i=0; i<data.curriculum.maxLength; i++) {
			Schedule.stime.push('');
		}
	}
	if (Schedule.stime.length < Schedule.curriculum.earlyMorningSection + data.curriculum.maxLength) {
		// 早晨节次是后面新增的，之前的时间配置里面可能没有，补上早晨的时间
		for(var i=0; i<Schedule.curriculum.earlyMorningSection; i++) {
			Schedule.stime.unshift('');
		}
	}
	//左侧上课节次、时间
	updateTbody();
	/*武大定制*/
	if (Schedule.isContainsFid(1024)) {
		Schedule.monDayIsBegin = false;
		Schedule.weeklist = ['周日','周一','周二','周三','周四','周五','周六'];
		Schedule.weeklistKey = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	}

	var week = $('.selectBox .week').attr('week');
	if ($('#scheduleTable tbody').length == 0) {
		// 初次加载，初始化头部
		initTbale();
	}
	if ((!week || hasChangeFirstWeekDate) && Schedule.curriculum.currentWeek) {
		// 没有week，或者在PC端改了当前周，切换成当前周
		/**
		 * 不通过 currentWeek 来判断 换一个字段判断
		 * 从客户端拿数据时，没有传周次时，会用 currentWeek 去取数据，如果 currentWeek < -1 或则 > 25， 会导致取不到数据
		 * 现在服务端判断 currentWeek 不在有效范围内时，会将 currentWeek 设置为 1，用新字段 realCurrentWeek 来返回 -1 或者大于 25 的值
		 * 下面的 currentWeek > maxWeek 或者 currentWeek < -1 判断还保留是避免客户端已经把 currentWeek 缓存到本地了
		 * 如果这两种情况不再请求第一周的数据，会导致显示不了课表
		 */
		$('.selectList li p').removeClass('active');
		// if (Schedule.curriculum.currentWeek > Schedule.curriculum.maxWeek) {
		// 	// 计算出来的当前周大于课表的最大周，表示切换到以前的课表，默认第一周
		// 	Schedule.curriculum.currentWeek = 1;
		// 	$('.selectList li p').eq(0).click();
		// 	Schedule.schoolOpens = 1;
		// } else if (Schedule.curriculum.currentWeek < 1) {
		// 	Schedule.schoolOpens = 0;
		// 	//未开学默认显示第一周 并在后面显示未开学
		// 	Schedule.curriculum.currentWeek = 1;
		// 	$('.selectList li p').eq(0).click();
		// 	if (checkIsEn()){
		// 		$('.selectWeek .week').html('Week 1(Not open)');
		// 	}else {
		// 		$('.selectWeek .week').html('第1周(未开学)');
		// 	}
		// } else{
			// 切换学期后回到首页，需要出发一下点击事件才能从客户端获取本周的课表数据
			$('.selectList li p').eq(Schedule.curriculum.currentWeek-1).click();
			if (Schedule.curriculum.realCurrentWeek < 1) {
				Schedule.schoolOpens = 0;
				$('.selectWeek .week').html(getI18nText('第1周')+'('+getI18nText('未开学')+')');
			}
		// }
		return;
	}
	updateThead(week);
	var lessonColorMap = new Map();
	Schedule.dailyLessonMap = new Map();
	//颜色下标，不要超过30
	var maxColorIndex = 1;
	if (data.lessonArray && data.lessonArray.length > 0) {
		//更新时间正序，使置定的显示在外层
		data.lessonArray.sort((a, b) => {
			return a.updateTime > b.updateTime ? 1 : -1;
		})
		$.each(data.lessonArray, function(idx, val){
			// console.log(val);
			// 同一门课颜色要一样，先根据课程配置id取颜色看是否设置了颜色，下标范围 1~30
			var colorIndex = lessonColorMap.get(val.name);
			if (!colorIndex) {
				colorIndex = maxColorIndex++;
				lessonColorMap.put(val.name, colorIndex);
			}
			val.colorIndex = colorIndex;
			// if (!Schedule.dailyLessonMap.get(val.dayOfWeek)) {
			// 	var dayArray = new Array();
			// 	dayArray.push(val);
			// 	Schedule.dailyLessonMap.put(val.dayOfWeek, dayArray);
			// } else {
			// 	Schedule.dailyLessonMap.get(val.dayOfWeek).push(val);
			// }
			// Schedule.allLessonMap.put(val.lessonId, val);
			putDailyLessonMap(val)
			putAllLessonMap(val)

			// 冲突课程信息需根据总览模式进行初始化 默认显示总览模式
			// if (!Schedule.dayModel) {
				// 添加课程到页面上
				var courseName = val.name;
				if (checkIsEn() && val.englishCourseName) {
					courseName = val.englishCourseName;
				}
				/* 2023-08-25 广东海洋大学课表定制_卡片显示上课时间*/
				let lessonTime = ''
				if (Schedule.isContainsFid(118117)&&val.extendInfo){
					var start = val.extendInfo.startTime.split(' ')[1].split(':')
					var end = val.extendInfo.endTime.split(' ')[1].split(':')
					lessonTime = start[0] + ':' + start[1] + '-' + end[0] + ':' + end[1]
				}
				addCourse(val.beginNumber, val.dayOfWeek, val.length,
					courseName, val.location, colorIndex,
					val.lessonId, val.onlineLocation, val.role,lessonTime,val);
			// }

		})
	} else {
		// 没有数据，默认显示加号
		$('.row1 td.col1').click();
	}

	for(var i=1;i<=12;i++){
		$('.words'+i).each(function(index, element) {
		    $clamp(element, { clamp: i});
		});
	}
	if (Schedule.dayModel) {
		if (Schedule.isKeTang){
			//超星课堂里，只隐藏左侧
			$('.leftHead').remove();
		}else {
			//学习通“课表上课”，保留返回箭头
			$('.leftHead .totalscheduel').remove();
		}
		//如果是在泛雅课堂客户端，首页之前查看的是哪天，回来后还是显示某一个天的课
		var day = $('#scheduleHead .th.active').index(); //day>0说明不是首次进入
		if (Schedule.isKeTang && day > 0){
			$('#scheduleHead .th').eq(day-1).click();
		}else {
			var day = new Date().getDay();
			if (day > 0) {
				$('#scheduleHead .th').eq(day-1).click();
			} else {
				$('#scheduleHead .th').eq(6).click();
			}
		}
	} else if ($('.totalscheduel').is(':visible')) {
		// 加课之前是查看的某一天的课，回来时还是显示某一个天的课
		var day = $('#scheduleHead .th.active').index();
		day = Schedule.getRealIndex(day);
		updateDayTbody('#scheduleTable', Schedule.dailyLessonMap.get(day), Schedule.stime);
	}
	// 显示非本周
	if (
		parseInt($(".selectWeek span").attr("week")) !=
		parseInt(Schedule.curriculum.realCurrentWeek)
	) {
		$(".selectWeek .isNow").html(getI18nText("非本周"));
		$(".selectWeek .isNow").show();
		$(".backToWeek span").html(getI18nText("返回本周"));
		$(".backToWeek").show();
	} else {
		$(".selectWeek .isNow").html(getI18nText("非本周"));
		$(".selectWeek .isNow").hide();
		$(".backToWeek span").html(getI18nText("返回本周"));
		$(".backToWeek").hide();
	}
	// 学期已结束或者未开学时隐藏 非本周和返回本周
	if((Schedule.curriculum.realCurrentWeek >Schedule.curriculum.maxWeek&&Schedule.curriculum.currentWeek==1)||Schedule.schoolOpens == 0){
		$(".selectWeek .isNow").html(getI18nText("非本周"));
		$(".selectWeek .isNow").hide();
		$(".backToWeek span").html(getI18nText("返回本周"));
		$(".backToWeek").hide();
	}
	if (isSupportImport()) {
		if (hideImport){
			return;
		}
		if (typeof Schedule.curriculum.lessonLength == 'undefined' || Schedule.dayModel) {
			return;
		}
		// 支持导入课表，判断用户课程数
		if (Schedule.curriculum.lessonLength==0 && !$('.importScheduleModal').attr('hasShow')) {
			// 首次用的是客户端本地数据，可能会显示导入弹框，即使从接口拉回数据后再次渲染，弹框依然不会隐藏。
			// 所以这里判断在客户端中，第一次使用本地数据时，不显示弹框，避免和接口返回的不一样。
			if (Schedule.inClient && Schedule.isClientDate){
				Schedule.isClientDate = false;
				return;
			}
			// ios首次拉接口数据时，如果和本地缓存一致，就不会把接口数据再给一遍。就会导致左右滑动周的时候才触发显示弹框。
			// 这里判断调用客户端方法超过2次时，就不再显示(模拟周点击事件还有1次)
			if (Schedule.getDataByClientCount>2){
				return;
			}
			// 没有课程，且没有弹过提示框，弹框提示导入课表
			$('.importScheduleModal').attr('hasShow',1).show();
			$('.lessTips').hide();
			$('body').removeClass('hasLesstips');
		} else if (Schedule.curriculum.lessonLength > 0 &&
				Schedule.curriculum.lessonLength < 5 && !$('.lessTips').attr('hasShow')) {
			// 有课程，但是课程数小于5，在头部显示对应提示
			$('.lessTips').attr('hasShow',1).show();
			$('body').addClass('hasLesstips');
			$('.importScheduleModal').hide();
		}
	}
	
};

/**
 * 通过客户端取数据
 * @param week 要查的周次
 * @param queryType 查询类型，0、查配置和数据，1、只查配置
 * @param reload 是否需要调接口重新加载数据 0、不调接口 1、调接口
 * @param requestParam 本地缓存中的学年学期等参数
 */
Schedule.getDataByClient = function(week, queryType, reload, requestParam) {
	try{
		Schedule.getDataByClientCount++;
		if (!queryType) {
			queryType = 0;
		}
		if (!reload) {
			reload = 0;
		}
		var u = navigator.userAgent, app = navigator.appVersion;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if (typeof requestParam == 'undefined') {
			requestParam = {}
		}
		var param = {
    		"week":week,
    		"queryType":queryType,
    		"reload":reload,
    		"requestUrl": Schedule.domain + Schedule.mctx + "/apis/curriculum/getAllLessons"
		}
		if (requestParam.schoolYear && requestParam.semester) {
			if (isIOS && ToolsUtils.getClientVersion('apiVersion') <= 59) {
				/**
				 * 旧版ios在地址后面加参数，加密的时候不会带上地址后面的参数，会导致服务端校验不通过
				 * 旧版ios，将schoolYear，semester，userSelectedTime 都放到queryType里面传给服务端
				 * 例如 schoolYear：2020， semester：2，queryType：1， userSelectedTime：1616987089299
				 * schoolYear 取后两位 20，服务端再在前面补上20，userSelectedTime 取前5位，服务端再后面补上8个0
				 * 20 2 1 16169
				 */
				var queryType = requestParam.schoolYear.substring(2,4) + requestParam.semester + param.queryType;
				if (requestParam.userSelectedTime) {
					queryType += (requestParam.userSelectedTime+"").substring(0,5);
				}
				param.queryType = queryType;
			} else {
				param.requestUrl += '?schoolYear=' + requestParam.schoolYear + '&semester=' + requestParam.semester;
				if (requestParam.userSelectedTime) {
					param.requestUrl += '&userSelectedTime=' + requestParam.userSelectedTime;
				}
			}

		}
		//ios使用post请求，安卓使用get请求
		if(isIOS){
			if(window.webkit && window.webkit.messageHandlers.getLessonData){
                    window.webkit.messageHandlers.getLessonData.postMessage([param, "Schedule.renderPage"]);
			}
		}else{
			javaJs.getLessonData(JSON.stringify(param), "Schedule.renderPage");
		}
	} catch(e){}
}

 /* 渲染课程dom 
  * @param td 元素类名
	* @param rowspan 节次长度
	* @param row 开始节次
	* @param col 周几
	* @param lessonId 每日课程表id
	* @param colorIndex 颜色下标
	* @param courseName 课程名称
	* @param teaNameHtml 教师姓的dom html
	* @param courseLocHtml 线下地点的dom html
	* @param courseOnlineLocHtml 线上地点的dom html
	* @param weekHtml周次的dom html
	* @param classHtml班级名称的dom html
	* @param time 广东海洋大学课表定制_卡片显示上课时间
	*/ 
function renderCourse(td,rowspan,row,col,lessonId,colorIndex,courseName,teaNameHtml,courseLocHtml,courseOnlineLocHtml,weekHtml,classHtml,time,obj) {
  if (obj.conflictUuids && obj.conflictUuids.length > 0) {
		/* 2023-08-25 广东海洋大学课表定制_卡片显示上课时间*/
		if (Schedule.isContainsFid(118117) && time.length > 0) {
			$(td)
				.attr("rowspan", rowspan)
				.html(
					'<div class="tddiv color' +
						colorIndex +
						'"><div class="clashCourse color' +
						colorIndex +
						'" clashCourseIds=' +
						obj.conflictUuids.join(",") +
						' >冲突</div><p class="timeBox">' +
						time +
						'</p><p class="courseName">' +
						courseName +
						"</p>" +
						teaNameHtml +
						courseLocHtml +
						courseOnlineLocHtml +
						weekHtml +
						classHtml +
						"</div>"
				);
		} else {
			$(td)
				.attr("rowspan", rowspan)
				.html(
					'<div class="tddiv color' +
						colorIndex +
						'"><div class="clashCourse color' +
						colorIndex +
						'" clashCourseIds=' +
						obj.conflictUuids.join(",") +
						' >冲突</div><p class="courseName">' +
						courseName +
						"</p>" +
						teaNameHtml +
						courseLocHtml +
						courseOnlineLocHtml +
						weekHtml +
						classHtml +
						"</div>"
				);
		}
  }else{
		if (Schedule.isContainsFid(118117) && time.length > 0) {
			$(td)
				.attr("rowspan", rowspan)
				.html(
					'<div class="tddiv color' +
						colorIndex +
						'"><p class="timeBox">' +
						time +
						'</p><p class="courseName">' +
						courseName +
						"</p>" +
						teaNameHtml +
						courseLocHtml +
						courseOnlineLocHtml +
						weekHtml +
						classHtml +
						"</div>"
				);
		} else {
			$(td)
				.attr("rowspan", rowspan)
				.html(
					'<div class="tddiv color' +
						colorIndex +
						'"><p class="courseName">' +
						courseName +
						"</p>" +
						teaNameHtml +
						courseLocHtml +
						courseOnlineLocHtml +
						weekHtml +
						classHtml +
						"</div>"
				);
		}
  }
	$(td).attr("lessonid", lessonId);
	for (var i = 1; i < rowspan; i++) {
		$(".row" + (row + i) + " .col" + col).remove();
	}
}
/**
 * 添加课程 ：  行（起始节数）  列（周几）  跨度几节课  课程名  上课地点，颜色下标
 * @param row 开始节次
 * @param col 周几
 * @param rowspan 节次长度
 * @param courseName 课程名称
 * @param courseLoc 上课地点
 * @param colorIndex 颜色下标
 * @param lessonId 每日课程表id
 * @param onlineLocation 线上地址类型
 * @param role
 * @param time
 * @param obj
 */
function addCourse(row,col,rowspan,courseName,courseLoc,colorIndex,lessonId,
		onlineLocation, role,time, obj){
	// 新增了早晨，在原来的row上加上早晨的节次
	row += Schedule.curriculum.earlyMorningSection;
	if (row < 1) {
		// 表示之前设置了两节早晨，开始节次是-1，然后改成了一节，导致row小于1，这种情况将节次往下顺延
		row = 1;
	}
	/*武大定制，周日显示在第一列*/
	if (Schedule.isContainsFid(1024)){
		col++;
		if (col == 8){
			col = 1;
		}
	}
	//教师名称
	var teaNameHtml = '';
	//线下地点
	var prefix = '@';
	var courseLocHtml = '';
	if (courseLoc) {
		if (Schedule.isContainsFid(1807)) {
			prefix = '地点：';
		}
		courseLocHtml = '<p class="courseLoc">' + prefix + courseLoc + '</p>';
	}
	//线上地点
	var courseOnlineLocHtml = '';
	if (onlineLocation) {
		if (ToolsUtils.checkUrl(onlineLocation)) {
			var locationDesc = '线上学习';
			// 教师端和学生端现在线上地址都是手动输入的
			if (ToolsUtils.isTeacher(role)) {
				if (onlineLocation.indexOf("meeting.tencent.com") > -1) {
					locationDesc = '腾讯会议'
				} else if (onlineLocation.indexOf("meeting.dingtalk.com") > -1) {
					locationDesc = '钉钉';
				} else {
					locationDesc = '线上教学';
				}
			}
			if (Schedule.isContainsFid(1807)) {
				prefix = courseLocHtml ? '@' : '地点：';
			}
			courseOnlineLocHtml = '<p class="courseLoc">' + prefix + locationDesc +'</p>';
		} else {
			if (onlineLocation == 'Other'){
				onlineLocation = '其他';
			}
			courseOnlineLocHtml = '<p class="courseLoc">@' + ToolsUtils.getCXClassDesc(onlineLocation) + '</p>';
		}
	}
	//周次
	var weekHtml = '';
	//班级名称
	var classHtml = '';
	/*fid1807北京科技大学定制，显示周次和班级（学生显示教师），第一个@改为'地点'*/
	if (Schedule.isContainsFid(1807)) {
		weekHtml = '<p class="courseLoc">周次：' + ToolsUtils.getWeekDes(obj.weeks).replace('第', '') + '</p>';
		if (ToolsUtils.isTeacher(role)){
			classHtml = '<p class="courseLoc">班级：' + obj.className + '</p>';
		}else {
			teaNameHtml = '<p class="courseLoc">教师：' + obj.teacherName + '</p>';
		}
	}
	var td='.row'+row+' .col'+col;
	if(!colorIndex){colorIndex = 1;}
	if ($(td).length > 0) {
		// 增加课程冲突适配
		renderCourse(td,rowspan,row,col,lessonId,colorIndex,courseName,teaNameHtml,courseLocHtml,courseOnlineLocHtml,weekHtml,classHtml,time,obj) 
		//超出显示省略号
		var rem = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0];
		var height=(rowspan*1.4-0.1-0.16) +'rem' ; //彩色框高度
		$(td).find('.tddiv').css({'height':height});
		var remainHeight = (rowspan*1.4-0.1)*rem - 0.16*rem;
		var isout=false;
		for(var i=0;i<$(td).find('.tddiv p').length;i++){
			var thisdiv = $(td).find('.tddiv p').eq(i);
			if(isout == false){
				var thisheight = thisdiv.height();
				if(i==0){
					lineheight = 0.34;
				}else{
					lineheight = 0.28;
				}
				if(remainHeight<=thisheight){
					var line = parseInt(remainHeight/(lineheight*rem));
					thisdiv.css('height',lineheight*line+'rem').addClass('words words'+line);
					if(line==0){
						thisdiv.prev().html(thisdiv.prev().html()+'...');
						var prevline = thisdiv.prev().height()/(lineheight*rem);
						thisdiv.prev().addClass('words words'+prevline);
					}
					isout=true;
				}else{
					remainHeight = remainHeight - thisheight - 0.08*rem;
				}
			}else{
				thisdiv.css('height',0);
			}
		}
		//所有课程添加动画
		$('td[rowspan]').addClass('rowspan').removeClass('col');

		//20200827 修正有课程的格子分割线
		//20210309
		if(row == Schedule.earlymorning+1 && rowspan>1){
			$(td).removeClass('border');
		}else if(row+rowspan-1 == Schedule.earlymorning+1){
			$(td).addClass('border');
		}else if(row == Schedule.am+1){
			$(td).removeClass('border');
		}else if(row+rowspan-1 == Schedule.am+1){
			$(td).addClass('border')
		}
		setBorder()
	}
}

//初始化tbody
function initTbale(){

	getBorderPos();

	$('#scheduleHead,#scheduleTable').append('<thead></thead><tbody></tbody>');
	var thead = $('#scheduleHead').find('thead');
	var tbody = $('#scheduleTable').find('tbody');
	var th='<tr><th></th>';
	var index = 1;
	for(var k=0;k<7;k++){
		var dateArr = Schedule.weekdata[index][k].split('-');
		var date = (dateArr[1]<10?('0'+dateArr[1]):dateArr[1]) +'-'+ (dateArr[2]<10?('0'+dateArr[2]):dateArr[2]);
		var nowDate = new Date();
		if(dateArr[0] == nowDate.getFullYear() && dateArr[1] == (nowDate.getMonth()+1) && dateArr[2] == nowDate.getDate()){
			//12-27 app端首页判断当前语言
			th+='<th class="th"><div class="thdiv today"><span class="week" weekday = "'+(k+1)+'">'+getI18nText(Schedule.weeklist[k])+'</span><span class="weekdate" date="'+Schedule.weekdata[index][k]+'">'+date+'</span></div></th>'
		}else{
			//12-27 app端首页判断当前语言
			th+='<th class="th"><div class="thdiv"><span class="week" weekday = "'+(k+1)+'">'+getI18nText(Schedule.weeklist[k])+'</span><span class="weekdate" date="'+Schedule.weekdata[index][k]+'">'+date+'</span></div></th>';
		}
	}
	th+='</tr>';
	thead.append(th);
	for(var i=0;i<Schedule.stime.length;i++){
		var html = '<tr class="row'+(i+1)+'">';
		//20200821 加每节课起止时间
		var stimeHtml = '';
		if (Schedule.stime[i]) {
			stimeHtml = '<p class="stime">'+Schedule.stime[i].split('-')[0]+'</p><p class="stime">'+Schedule.stime[i].split('-')[1]+'</p>'
		}
		var text = '';
		if(i<Schedule.curriculum.earlyMorningSection){
			var text = getI18nText('晨')+parseInt(i+1);
			if(Schedule.curriculum.earlyMorningSection == 1){
				text = getI18nText('早晨')
			}
		} else {
			text = i-Schedule.curriculum.earlyMorningSection+1;
		}
		html +='<td class="col0"><p class="sIndex">'+text+ '</p>'+ stimeHtml +'</td>';
		for(var j=0;j<7;j++){
			html+='<td class="col col'+parseInt(j+1)+'"></td>';
		}
		html +='</tr>';
		tbody.append(html);
	}
	//20200827
	setBorder()
}

//20200827 获取分割线所在位置
function getBorderPos(){
	Schedule.earlymorning = Schedule.curriculum.earlyMorningSection - 1;
	Schedule.am = (Schedule.curriculum.morningSection || 4) + Schedule.earlymorning
	Schedule.pm = Schedule.am + (Schedule.curriculum.afternoonSection || 4)
	// var stime = Schedule.stime;
	// for(var i=0;i<stime.length;i++){
	// 	if(stime[i]==''){
	// 		am = 3; pm = 7;
	// 		break;
	// 	}else{
	// 		if(compareTime(stime[i].split('-')[0],'12:00')>0){
	// 			if(compareTime(stime[i].split('-')[1],'12:00')==-1||((i+1)<stime.length && compareTime(stime[i+1].split('-')[0],'12:00')<=0)){
	// 				Schedule.am = i;
	// 			}
	// 		}
	// 		if(compareTime(stime[i].split('-')[0],'18:00')>0){//小于18:00
	// 			if(compareTime(stime[i].split('-')[1],'18:00')==-1 || ((i+1)<stime.length && compareTime(stime[i+1].split('-')[0],'18:00')<=0)){//大于18:00
	// 				Schedule.pm = i;
	// 			}
	// 		}
	// 	}
	//
	// }
}
//20200827 给表格加上午、下午、晚上的分割线
function setBorder(){
	$('#scheduleTable td').removeClass('border');
	if (Schedule.earlymorning >= 0) {
		//20210309
		$('#scheduleTable').find('tr').eq(Schedule.earlymorning).find('td').addClass('border');
	}
	$('#scheduleTable').find('tr').eq(Schedule.am).find('td').addClass('border');
	$('#scheduleTable').find('tr').eq(Schedule.pm).find('td').addClass('border');
	for(var i=0;i<$('td[rowspan]').length;i++){
		//20210309
		if($('td[rowspan]').eq(i).parent().index() == Schedule.earlymorning && parseInt($('td[rowspan]').eq(i).attr('rowspan'))>1){
			$('td[rowspan]').eq(i).removeClass('border')
		}

		if($('td[rowspan]').eq(i).parent().index()+ parseInt($('td[rowspan]').eq(i).attr('rowspan'))-1 == Schedule.am){
			$('td[rowspan]').eq(i).addClass('border')
		}
		if($('td[rowspan]').eq(i).parent().index() == Schedule.am && parseInt($('td[rowspan]').eq(i).attr('rowspan'))>1){
			$('td[rowspan]').eq(i).removeClass('border')
		}
	}
}
//20200827 比较两个时间大小
function compareTime(t1,t2){
	var date = new Date();
    var a = t1.split(":");
    var b = t2.split(":");
    if(a[0]>b[0] || (a[0]==b[0] && a[1]>b[1])){
    	return -1;
    }else if(a[0]<b[0] || (a[0]==b[0] && a[1]<b[1])){
    	return 1;
    }else if(a[0]==b[0] && a[1]==b[1]){
    	return 0;
    }
}

//更新课表
function updateTbody(id){
	var tbody = $('#scheduleTable').find('tbody');
	for(var i=0;i<Schedule.stime.length;i++){
		tbody.find('tr').eq(i).html('');
		var stimeHtml = '';
		if (Schedule.stime[i]) {
			stimeHtml = '<p class="stime">'+Schedule.stime[i].split('-')[0]+'</p><p class="stime">'+Schedule.stime[i].split('-')[1]+'</p>'
		}
		var text = '';
		if(i<Schedule.curriculum.earlyMorningSection){
			var text = getI18nText('晨')+parseInt(i+1);
			if(Schedule.curriculum.earlyMorningSection == 1){
				text = getI18nText('早晨')
			}
		} else {
			text = i-Schedule.curriculum.earlyMorningSection+1;
		}
		var html='<td class="col0"><p class="sIndex">'+text+'</p>'+ stimeHtml +'</td>';
		for(var j=0;j<7;j++){
			html+='<td class="col col'+parseInt(j+1)+'"></td>';
		}
		tbody.find('tr').eq(i).html(html);
	}
	//20200827
	getBorderPos();
	setBorder()
}

//更新课表头部日期
function updateThead(index){
	if (index < 1) {//未开学时查看当前日期
		updateNowThead();
		return;
	}
	var thead = $('#scheduleHead').find('thead');
	thead.find('.thdiv').removeClass('today');
	for(var i=0;i<7;i++){
		var dateArr = Schedule.weekdata[index][i].split('-');
		var date = (dateArr[1]<10?('0'+dateArr[1]):dateArr[1]) +'-'+ (dateArr[2]<10?('0'+dateArr[2]):dateArr[2]);
		var nowDate = new Date();
		if(dateArr[0] == nowDate.getFullYear() && dateArr[1] == (nowDate.getMonth()+1) && dateArr[2] == nowDate.getDate()){
			thead.find('.thdiv').eq(i).addClass('today')
		}
		var fulldate = dateArr.join('-');
		thead.find('th span.weekdate').eq(i).html(date).attr('date',fulldate);
	}
}

// 未开学更新为当前日期
function updateNowThead(){
	var thead = $('#scheduleHead').find('thead');
	thead.find('.thdiv').removeClass('today');
	var weekdata = getCurrentWeekData();
	for(var i=0;i<7;i++){
		var dateArr = weekdata[i].split('-');
		var date = (dateArr[1]<10?('0'+dateArr[1]):dateArr[1]) +'-'+ (dateArr[2]<10?('0'+dateArr[2]):dateArr[2]);
		var nowDate = new Date();
		if(dateArr[0] == nowDate.getFullYear() && dateArr[1] == (nowDate.getMonth()+1) && dateArr[2] == nowDate.getDate()){
			thead.find('.thdiv').eq(i).addClass('today')
		}
		var fulldate = dateArr.join('-');
		thead.find('th span.weekdate').eq(i).html(date).attr('date',fulldate);
	}
}
// 获取当前周的日期数据
function getCurrentWeekData() {
	var now = new Date();
	var weekday = now.getDay();
	weekday = (weekday == 0) ? 7 : weekday;
	var monday = now.getTime() - ((weekday - 1)*1000*60*60*24);
	var data = [];
	for (var i=0; i<7; i++) {
		var time = new Date(monday + 1000*60*60*24*i);
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var day = time.getDate();
		var datestr = year + '-' + month + '-' + day;
		data[i] = datestr;
	}
	return data;
}

//输入开学第一周的日期和总周数，计算出本学期的周数和每周的日期
function getWeekDate(startDate,weekNum){
	var week={};
	var weekindex=[];
	var lastDate = startDate;
	for(var i=0;i<weekNum;i++){
		weekindex[i]=(i+1);
		week[weekindex[i]]=[];
		for(var j=0;j<7;j++){
			var date = new Date(new Date(lastDate).getTime() + 24*60*60*1000*j);
			week[weekindex[i]].push(date.getFullYear() +'-'+ (date.getMonth()+1) +'-'+date.getDate());
			}
		lastday = new Date(new Date(lastDate).getTime() + 24*60*60*1000*7);
		lastDate = new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate());
	}
	return week;
}
//拖动合并表格
var lastrowspan=1,isfolderdown=false;
function dragmergecol(row,col,num,dir){
	var scrollTop = document.scrollingElement.scrollTop;
	var td=$('.row'+row+' .col'+col);
	var rowspan = $('.row'+row+' .col'+col).attr('rowspan')?parseInt($('.row'+row+' .col'+col).attr('rowspan')):1;
//	console.log('row:'+row +'  newrowspan:'+(num+1)+'  lastrowspan:'+lastrowspan+'  row-num:'+(row-num))
	var newrowspan = num + row > $('#scheduleTable tr').length ? $('#scheduleTable tr').length - row + 1 : num + 1;
	if(newrowspan>lastrowspan){//增加合并表格
		if(dir>0){//向下合并
			// console.log('向下合并')
			for(var i=1;i<newrowspan;i++){
				if(!$('.row'+(row+i)+' .col'+col).attr('rowspan')){
					$('.row'+(row+i)+' .col'+col).addClass('delete').removeAttr('rowspan').html('');
				}else{
					Schedule.startmove=false;
					return;
				}
			}
			$('.row'+row+' .col'+col).attr('rowspan',newrowspan);
			td = $('.row'+row+' .col'+col)
		}else{//向上合并
			// console.log('向上合并')
			for(var i=1;i<newrowspan;i++){
				if($('.row'+(row-num+i-1)+' .col'+col).length == 0 || $('.row'+(row-num+i-1)+' .col'+col).attr('rowspan')){
					Schedule.startmove=false;
					return;
				}else{
					$('.row'+(row-num+i)+' .col'+col).addClass('delete').removeAttr('rowspan');
				}
			}
			$('.row'+(row-num)+' .col'+col).removeClass('delete').attr('rowspan',newrowspan).html('<div class="firstClick ycenter xcenter"><img class="add" src="images/add.png"></div>');
			td = $('.row'+(row-num)+' .col'+col);
		}
		lastrowspan = newrowspan;
	}else if(newrowspan<lastrowspan){//减少合并表格
		if(dir>0){//向下的收起
			isfolderdown = true;
			// console.log('向下的收起'+num)
			$('.row'+row+' .col'+col).attr('rowspan',newrowspan);
			if(num>0){
				for(var i = 1; i < rowspan-num; i++){
					$('.row'+(row+rowspan-i)+' .col'+col).removeClass('delete').removeAttr('rowspan').html('');
				}
			}else{
				$('.row'+(row+rowspan-1)+' .col'+col).removeClass('delete').removeAttr('rowspan');
			}
			td = $('.row'+row+' .col'+col);
		}else{//向上的收起
			isfolderup = true;
			// console.log('向上的收起'+num)
			$('.row'+((row-num))+' .col'+col).removeClass('delete').attr('rowspan',newrowspan).html('<div class="firstClick ycenter xcenter"><img class="add" src="images/add.png"></div>');
			if(num==0 && isfolderdown){
				$('.row'+(row-num-i)+' .col'+col).removeClass('delete').removeAttr('rowspan');
			}else{
				for(var i=1;i<lastrowspan-num;i++){
					$('.row'+(row-num-i)+' .col'+col).removeClass('delete').removeAttr('rowspan').html('');
				}
			}
			td = $('.row'+((row-num))+' .col'+col);
		}
	}

	//20200827 修正合并的格子分割线
	setBorder();
	if($('.firstClick').parent('td').not('.delete').parent().index()+newrowspan-1 == Schedule.am){
		$('.firstClick').parent('td').not('.delete').addClass('border')
	}else{
		$('.firstClick').parent('td').not('.delete').removeClass('border');
	}
}

//获取当前列
function getcol(td){
	var col;
	var colclass = td.attr('class').split(' ');
	for(var i=0;i<colclass.length;i++){
		if(colclass[i].length>3 && colclass[i].indexOf('col')>-1){
			col = colclass[i].split('col')[1];
		}
	}
	return col;
}

// ios 高度适配
function addIphoneHeight(){
    var isIphone=/iphone/gi.test(navigator.userAgent);
    if(isIphone && screen.height > 736){//iPhoneX及以上机型
    	$('body').addClass('iosxwrapMax');
    }else if(isIphone){
			$('body').addClass('ioswrapMax');
		}
}

// 初始化周选择列表
function initSelectlist(){
	var maxWeek = Schedule.curriculum.maxWeek;
	var selectHtml='';
	//12-27 移动端首页下拉周列表
	for (var i=1;i<=maxWeek;i++){
		if(i == parseInt(Schedule.curriculum.realCurrentWeek)&&Schedule.schoolOpens != 0){
			selectHtml+='<li><p>'+ getI18nText('第'+i+'周') +'(' + getI18nText('本周') + ')</p></li>';
		}else{
			selectHtml+='<li><p>'+ getI18nText('第'+i+'周') +'</p></li>';
		}
	}
	$('.selectList ul').html(selectHtml);
	var week = $('.selectBox .week').attr('week')
	if (week) {
		$('.selectList ul li').eq(parseInt(week)-1).find('p').addClass('active');
	} else {
		$('.selectList ul li:first p').addClass('active');
	}
}

//显示单日课程
function updateDayTbody(id, coursedata, stime){
	//20200825 隐藏第一列时间
	$('.stime').hide();
	var tbody = $(id).find('tbody');
	var sectionnum=12;
	if(stime && stime.length>0){
		sectionnum = stime.length;
	}

	//规则：每日模式下有11种颜色，要求每天的每节课颜色都随机，且不同课的颜色不能一样
	var lessonColorMap = new Map();
	var colorList = [1,2,3,4,5,6,7,8,9,10,11];
	//20200820 单日课表，课程有多节时，卡片只在多节的第一节上显示了，应每节都显示该课程卡片。
	var div='',rownum=0,daydata;
	for (var i=0;i<sectionnum;i++) {
		if(coursedata){
			for(var j=0;j<coursedata.length;j++){
				if(coursedata[j].beginNumber + Schedule.curriculum.earlyMorningSection == (i+1)){
					rownum = coursedata[j].length;
					daydata = coursedata[j];
				}
			}
		}
		var text = '';
		if(i<Schedule.curriculum.earlyMorningSection){
			var text = getI18nText('晨')+parseInt(i+1);
			if(Schedule.curriculum.earlyMorningSection == 1){
				text = getI18nText('早晨')
			}
		} else {
			text = i-Schedule.curriculum.earlyMorningSection+1;
		}
		if(rownum){
			var timediv = '';
			if(stime && stime.length>0 && stime[i]){
				timediv = '<div class="day-time"><p class="startTime">'+stime[i].split('-')[0]+'</p><p class="endTime">'+stime[i].split('-')[1]+'</p></div>';
			}
			var loctionHtml = '';
			if (daydata.onlineLocation) {
				loctionHtml += '<span>@' + daydata.onlineLocation.replace('泛雅课堂','在线课堂') + '</span>'
			} else if (daydata.location) {
				loctionHtml += '<span>@' + daydata.location + '</span>'
			}
			// 同一门课颜色要一样，先根据课程看是否设置了颜色，下标范围 1~11
			var colorIndex = lessonColorMap.get(daydata.name);
			if (!colorIndex) {
				//从剩余的颜色中随机取
				colorIndex = colorList[Math.floor(Math.random()*colorList.length)];
				lessonColorMap.put(daydata.name, colorIndex);
				//删除这种颜色
				colorList.splice(colorList.indexOf(colorIndex), 1);
			}
			// var showClash = singleDayShowClash(daydata)
			// let courserInfo = Schedule.clashCourseArr.find(it => it.lessonid === daydata.lessonId)
			// let clashcourseids = courserInfo ?  courserInfo.clashCidList : ''
			var showClash = daydata.conflictUuids && daydata.conflictUuids.length > 0
			let clashcourseids =showClash? daydata.conflictUuids.join(",") :''
			// 单日模式展示展示冲突标识
			let clashHtmlStr = showClash ? '<div class="day-clash color'+colorIndex+'" clashcourseids=' + clashcourseids + '>冲突</div>' : ''
			div = '<div class="dayDiv ycenter color'+colorIndex+'" lessonid="'+ daydata.lessonId +'">'
						+timediv
						+'<div class="day-course"><div class="day-CourseName">'+daydata.name+'</div><div class="day-CourseLoc">'+ loctionHtml +'</div></div>'
						+ clashHtmlStr
					+'</div>';
			var html='<td class="col0"><p class="sIndex">'+ text +'</p></td>'
					+'<td class="col col1" colspan="7">'+ div +'</td>';
			rownum--;
		}else{
			var html='<td class="col0"><p class="sIndex">'+ text +'</p></td>'
					+'<td class="col col1" colspan="7"></td>';
		}
		tbody.find('tr').eq(i).html(html);
	}
	 //20200827
	getBorderPos();
	setBorder()
}

//20200819 修改节数后更新课表
function refreshTbody(id,num){
	var tbody = $(id).find('tbody');
	var nowtrNum = tbody.find('tr').length;
	if(nowtrNum<num){
		for(var i=nowtrNum;i<num;i++){
			var stimeHtml = '';
			if (Schedule.stime[i]) {
				stimeHtml = '<p class="stime">'+Schedule.stime[i].split('-')[0]+'</p><p class="stime">'+Schedule.stime[i].split('-')[1]+'</p>'
			}
			var html='<tr><td class="col0"><p class="sIndex">'+parseInt(i+1)+'</p>'+ stimeHtml +'</td>';
			for(var j=0;j<7;j++){
				html+='<td class="col col'+parseInt(j+1)+'"></td>';
			}
			html+='</tr>';
			tbody.append(html);
		}
	}else if(nowtrNum>num){
		for(var i=num;i<=nowtrNum;i++){
			tbody.children().eq(num).remove();
		}
	}
	//20200827
	getBorderPos();
	setBorder()
}

function updateTdTime(times){
	$('.stime').remove();
	for(var i=0;i<times.length;i++){
		if (times[i]) {
			$('#scheduleTable tr').eq(i).find('.col0').append('<p class="stime">'+times[i].split('-')[0]+'</p><p class="stime">'+times[i].split('-')[1]+'</p>')
		}
	}
}

/**
 *  是否支持导入课表
 * @returns
 */
function isSupportImport() {
	if (window.location.href.indexOf('curriculumUuid') > -1 || Schedule.isKeTang) {
		return false;
	}
	var ua = navigator.userAgent.toLowerCase();
	var clientVerson = ToolsUtils.getClientVersion();
	if(clientVerson > '4.7.1' || (ua.match(/(iphone|ipod|ipad);?/i) && clientVerson > '4.7')){
		// 安卓 大于4.7.1 显示导入课表按钮,ios 大于4.7，显示导入课表按钮
		return true;
	}
	return false;
}

/**
 * 客户端详情页是否支持跳转自定义"教学日志"链接
 * @returns
 */
function isClientSupportTeaLog() {
	//市场版Android & iOS  apiVersion>=218
	//内测版Android apiVersion>=217   iOS>=232
	var clientType = ToolsUtils.getClientType();
	var apiVersion = ToolsUtils.getClientVersion('apiVersion');
	if (ToolsUtils.isMarketVersion()){
		 return apiVersion >= 218;
	}else if (ToolsUtils.isBetaVersion()){
		return (clientType == 'android' && apiVersion >= 217) || (clientType == 'ios' && apiVersion >= 232);
	}
	return false;
}

/**
 * 获取上课节次的描述
 */
function getLessonRangeDesc(beginNumber, length) {
	var beginText = '';
	var endText = '';
	if (beginNumber < 1) {
		// 新增了早晨的逻辑，为了不影响以前的数据，早晨的开始接口从负数到0
		if (Schedule.curriculum.earlyMorningSection == 1) {
			beginText = getI18nText('早晨');
		} else {
			beginText = getI18nText('晨') + (beginNumber + Schedule.curriculum.earlyMorningSection);
		}
	} else {
		beginText = getI18nText('第') + beginNumber;
	}
	if (length == 1) {
		// 一节课
		if (beginNumber > 0) {
			endText += getI18nText('节');
		}
	} else {
		// 大于1节，
		var endNumber = (beginNumber + length - 1);
		if (endNumber <= 0) {
			endText = '-' + getI18nText('晨') + (endNumber + Schedule.curriculum.earlyMorningSection);
		} else {
			endText = '-' + endNumber + getI18nText('节');
		}
	}
	return  beginText + endText;
}

/**
 * 跳转详情页，即这里是移动端首页点击进入详情页的入口
 * @param lesson
 */
Schedule.openDetailPage = function(lesson) {
	if (!Schedule.canOperate()) {
		return;
	}
	// 是否通过协议打开学生端详情页（apiversion>52）
	Schedule.openStuDetailWithProtocol = lesson && (!lesson.role || lesson.role == 4) && ToolsUtils.getClientVersion('apiVersion') > 52
	// 是否通过协议打开教师端详情页（apiversion>59）
	Schedule.openTeaDetailWithProtocol = lesson && (lesson.role > 0 && lesson.role < 4) && ToolsUtils.getClientVersion('apiVersion') > 59

	/*武大定制*/
	var weekday = lesson.dayOfWeek;
	if (!Schedule.monDayIsBegin){
		weekday++;
		if (weekday == 8){
			weekday = 1;
		}
	}
	var date = $('#scheduleHead .week[weekday="'+ (weekday) +'"]').next().attr('date');
	var dateWithMonthAndDay = $('#scheduleHead .week[weekday="'+ (weekday) +'"]').next().text();
	var lessonBeginTime = $('td[lessonid='+ lesson.lessonId +']').parent().find('td').eq(0).find('.stime').eq(0).text();
	// var lessonEndTime = $('td[lessonid='+ lesson.lessonId +']').parent().find('td').eq(0).find('.stime').eq(1).text();
	var lessonEndTime = Schedule.curriculum.lessonTimeConfigArray[lesson.beginNumber+lesson.length+Schedule.curriculum.earlyMorningSection-2].split('-')[1];

	lesson.wholeDay = date;
	/*fid118117 广东海洋大学定制，学生开课前30分钟到课程结束后30分钟的课堂才能进入*/
	if (lesson.fid == 118117 || Schedule.isContainsFid(118117)) {
		if (lesson.extendInfo&&lesson.extendInfo.startTime && lesson.extendInfo.endTime){
			var start = lesson.extendInfo.startTime.split(' ')[1].split(':')
			var end = lesson.extendInfo.endTime.split(' ')[1].split(':')
			var startTime = start[0] + ':' + start[1]
			var endTime =  end[0] + ':' + end[1]
			if (lesson.meetCode && !ToolsUtils.isTeacher(lesson.role) && startTime && endTime &&
				!Schedule.isDuringLessonTime(date+' '+startTime, date+' '+endTime)){
				//toast提示
				AppUtils.clientMessageDisplay('当前不在上课时间，只能查看当前上课时间的课堂');
				return;
			}
		}
	}
	var attendanceUrl = '';
	if (lesson && lesson.courseNo && Schedule.isContainsFid(1860)) {
		// 深职院，fid：1860，添加显示考勤地址
		attendanceUrl = 'https://szpt.fanya.chaoxing.com/dz/getAttendanceData?skls='+ lesson.courseNo
			+'&kcmc='+ encodeURIComponent(lesson.name) +'&jc='+ lesson.beginNumber +'&scrq=' + date;
	}
	if (Schedule.dayModel) {
		if (Schedule.isKeTang) {
			var openUrl = '';
			// 在泛雅课堂PC端里面，如果关联了泛雅课堂，直接打开泛雅课堂，否则跳转到PC详情页
			if (lesson.meetCode) {
				openUrl = 'https://k.chaoxing.com/pc/meet/meeting?_from=detail&uuid='+ lesson.noteCid
					+'&classId='+(lesson.classId||'')
					+'&canMaximizeWindow=true&canDragWindowSize=true&windowWidth=1105&v=v2&windowTitle=' + encodeURIComponent('在线课堂')
					+'&windowHeight=755&minWindowWidth=1105&minWindowHeight=755&audioStatus=0&videoStatus=0';

				//查课堂信息，如果课堂已被删除，给弹框提示
				$.getJSON(Schedule.mctx + '/curriculum/getMeetInfo', {'uuid':lesson.noteCid}, function (backdata) {
					var result = backdata.result || 0;
					if(result == 0 && backdata.msg == '课堂不存在'){
						//弹框提示
						$('.popDeleteCourseModal').show();
						Schedule.deleteLesson = lesson;
						return;
					}
					window.open(openUrl);
				});
				return;
			} else {
				openUrl = Schedule.domain + Schedule.mctx + '/res/pc/curriculum/scheduleDetail.html?curriculumUuid='
					+ Schedule.curriculum.uuid +'&lessonConfigUuid='+ lesson.lessonConfigUuid
					+ '&week='+ $('.selectWeek .week').attr('week') + '&windowWidth=1300'
			}
			window.open(openUrl);
			return;
		} else if (lesson.meetCode){
			// 调用客户端协议打开泛雅课堂
			Schedule.getMeetInfo(lesson.noteCid);
			Schedule.deleteLesson = lesson;
			return;
		}
	}

	//走这里的详情页是用的协议 （什么情况下会走协议？当关联的有课程和班级时，即courseId和classId不为空时）
	if (lesson && lesson.courseId && lesson.classId
		&& (Schedule.openStuDetailWithProtocol || Schedule.openTeaDetailWithProtocol)) {
		// 有课程id和班级id，并且支持用协议打开
		var webTitle = Schedule.weeklist[lesson.dayOfWeek-1] + getLessonRangeDesc(lesson.beginNumber, lesson.length);
		if (lesson.noteCid && !lesson.onlineLocation) {
			// 有笔记cid，新增逻辑，泛雅课堂类型线上地址改为直接创建一个泛雅课堂，之前是写笔记
			// 最开始线上线下地址都存在location字段里面，有cid，但是onlineLocation没有值时，location值赋给onlineLocation
			lesson.onlineLocation = lesson.location
			lesson.location = '';
		}
		var editUrl = Schedule.domain + Schedule.mctx + '/res/app/curriculum/addScheduleNew.html?curriculumUuid='+
			Schedule.curriculum.uuid +"&lessonId="+ lesson.lessonId + '&maxWeek=' + Schedule.curriculum.maxWeek
			+ '&em=' + Schedule.curriculum.earlyMorningSection + '&role=' + (Schedule.role||'');
		//编辑页地址带上教务课的合并信息
		if (lesson.mergeId){
			editUrl += '&mergeId='+ lesson.mergeId +'&jc=' + lesson.jc;
		}
		var weekDes = ToolsUtils.getWeekDes(lesson.weeks, lesson.weekType, Schedule.curriculum.maxWeek);
		var courseName = lesson.name;
		if (checkIsEn() && lesson.englishCourseName) {
			courseName = lesson.englishCourseName;
		}
		var data = {
			title: (dateWithMonthAndDay + ' ' + webTitle) || '',
			courseId: lesson.courseId || '',
			courseName: courseName || '',
			classId: lesson.classId || '',
			className: lesson.className || '',
			location: lesson.location || '',
			onlineLocation: lesson.onlineLocation || '',
			meetCode: lesson.meetCode || '',
			noteCid: lesson.noteCid || '',
			teacherName: lesson.teacherName || '',
			teachPlanId: lesson.teachPlanId || '',
			teachPlanName: lesson.teachPlanName || '',
			teachPlanPPT : '',
			editUrl: editUrl,
			weeks : weekDes,
			fid : lesson.fid || '',
			isMirror : lesson.isMirror || 0,
			attendanceUrl : attendanceUrl,
			courseNoteCid : lesson.courseNoteCid || '',
			curriculumId : Schedule.curriculum.id,
			lessonConfigUuid : lesson.lessonConfigUuid,
			lessonId : lesson.lessonId,
			lessonTime : weekDes + '，' + webTitle,
			hasLocationHistory : Schedule.hasLocationHistory,
			supportCXMeet : Schedule.supportCXMeet,
			supportTXMeet : 1,
			tencentCode : lesson.tencentCode,
			onlineLocationUrl : lesson.onlineLocationUrl,
		}

		//判断协议详情页打卡按钮是否显示(fid=1355并且是中间库推过来的课)
		//2022-7-14 单位要求学生从教师入口进去和教师从学生入口进去都不显示按钮，避免打错卡，即role1、role2要么都是true，要么都是false才显示
		var role1 = ToolsUtils.isTeacher(Schedule.role);
		var role2 = ToolsUtils.isTeacher(lesson.role);
		if ((lesson.fid == 1355 || Schedule.isContainsFid(1355)) && lesson.courseNo && lesson.classNo && (role1^role2 == 0)) {
			var punchUrl = '';
			if (lesson.role > 0 && lesson.role < 4){
				//教师端
				punchUrl = 'https://office.chaoxing.com/front/apps/forms/fore/apply?id=230583&formAppId=&enc=a1847309dfea45145f87340c4977237f&fidEnc=756cfcb8e339c126';
			}else {
				//学生端
				punchUrl = 'https://office.chaoxing.com/front/apps/forms/fore/apply?id=230622&formAppId=&enc=119ff881c1bd97f809081e08c744b2d2&fidEnc=756cfcb8e339c126';
			}
			//产品要求教师端和学生端都显示按钮
			data.showPunchButton = 1;
			data.punchButton = {
				text : '打卡',
				url : punchUrl
			}
		}

		/*fid1024武大定制，详情页显示德林直播和教学平台*/
		if (lesson.fid == 1024 || Schedule.isContainsFid(1024)
			|| lesson.fid == 1638 || Schedule.isContainsFid(1638)) {
			data.classRoomLive = {};
			if (lesson.extendInfo && lesson.extendInfo.thirdCourseUrl){
				data.classRoomLive.liveButton = {
					"title": "教室在线直播",
					"webUrl": lesson.extendInfo.thirdCourseUrl,
					"description": "详情"
				}
			}
			if (lesson.extendInfo && lesson.extendInfo.teachingInfo){
				data.classRoomLive.livePlatform = {
					"title": "教学平台",
					"webUrl": "",
					"description": lesson.extendInfo.teachingInfo
				}
			}
		}
		/*fid2146温医大定制，详情页显示上课备注和学时类型*/
		if (lesson.fid == 2146 || Schedule.isContainsFid(2146)) {
			if (lesson.extendInfo){
				data.classRoomLive = {};
				if (lesson.extendInfo.remark){
					data.classRoomLive.liveButton = {
						"title": "上课要求",
						"webUrl": "",
						"description": lesson.extendInfo.remark
					}
				}
				if (lesson.extendInfo.xsType){
					data.classRoomLive.livePlatform = {
						"title": "学时类型",
						"webUrl": "",
						"description": lesson.extendInfo.xsType
					}
				}
			}
		}
		/*fid1807北京科技大学定制，详情页显示周次*/
		if (lesson.fid == 1807 || Schedule.isContainsFid(1807)) {
			if (lesson.weeks){
				data.classRoomLive = {};
				data.classRoomLive.livePlatform = {
					"title": "周次",
					"webUrl": "",
					"description": weekDes
				}
			}
		}

		// PPT教案地址
		if (lesson.pptObjectId) {
			var mobilelearnDomain = 'https://mobilelearn.chaoxing.com';
			if (!Schedule.inClient){
				//嵌在客户端时，不对域名做处理，避免替换成file://开头引起报错
				mobilelearnDomain = getServerDomain('mobilelearnDomainHttps');
			}
			data.teachPlanPPT = mobilelearnDomain + '/widget/teleController?parentId='+ lesson.teachPlanId
				+'&classId='+ lesson.classId +'&courseId='+ lesson.courseId + '&turnToCatalog=0';
		}
		// 写课堂笔记或教学日志需要的数据
		var courseNoteTitle = '';

		if (lesson.role > 0 && lesson.role < 4) {
			// 教师
			courseNoteTitle = "《"+ lesson.name +"》教学日志 " + dateWithMonthAndDay + ' ' + lessonBeginTime
			var courseTime = '';
			if (lessonBeginTime && lessonEndTime) {
				courseTime = lessonBeginTime + "-" + lessonEndTime
			}
			data.courseNoteContent = "<p>课程：《"+ (lesson.name||'') +"》</p><p>班级："+ (lesson.className||'')
				+ "</p><p>上课时间："+ date + ' ' + courseTime +"</p><p><br/></p>";
			if (lesson.courseId && lesson.classId) {
				var mobilelearnDomain = 'https://mobilelearn.chaoxing.com';
				if (!Schedule.inClient){
					//嵌在客户端时，不对域名做处理，避免替换成file://开头引起报错
					mobilelearnDomain = getServerDomain('mobilelearnDomainHttps');
				}
				var url = mobilelearnDomain + '/widget/courseStatistics/index?classId='+ lesson.classId
					+ '&courseId=' + lesson.courseId + '&from=kebiao&stime=' + new Date(date.replace(/-/g, "/")).getTime();
				data.attachmentArr = [
					{
						"att_web": {
							"content": dateWithMonthAndDay + ' ' + lessonBeginTime,
							"logo": Schedule.domain + Schedule.mctx + "/res/app/curriculum/images/classReport.png",
							"showContent": 1,
							"title": "《"+ (lesson.name||'') +"》课堂报告 ",
							"toolbarType": 2,
							"url": url,
						},
						"attachmentType": 25,
					}
				]
			}
		} else {
			// 学生
			courseNoteTitle = "《"+ lesson.name +"》课堂笔记 " + webTitle;
		}
		data.courseNoteTitle = courseNoteTitle;
		//单位后台统一设置了教学日志/课堂笔记
		if (lesson.unitNoteUrl && isClientSupportTeaLog()){
			data.unitNoteUrl = lesson.unitNoteUrl;
			data.courseNoteTitle = '详情';
		}

		/*智博课堂相关定制*/
		if (window.location.search.indexOf('learnModel=2') > -1){
			Schedule.getZhiboktStatus(lesson, data);
			return;
		}
		/*fid484、1035定制，老师的教务课数据关联表单*/
		if ((lesson.fid == 484 || lesson.fid == 1035) && ToolsUtils.isTeacher(lesson.role) && lesson.courseNo && isClientSupportTeaLog()) {
			lesson.schoolYear = Schedule.curriculum.schoolYear;
			lesson.semester = Schedule.curriculum.semester;
			lesson.puid = Schedule.curriculum.puid;
			lesson.week = $('.selectWeek .week').attr('week');
			lesson.lessonBeginTime = lessonBeginTime;
			lesson.lessonEndTime = lessonEndTime;
			Schedule.getFormEditUrl(lesson, data);
			return;
		}
		Schedule.openClientDetail(data);
		return;
	}

	//进h5网页版详情页需要携带的参数
	var param = '?curriculumUuid=' + Schedule.curriculum.uuid
		+ '&lessonId=' + lesson.lessonId
		+ '&date=' + date
		+ '&maxWeek=' + Schedule.curriculum.maxWeek
		+ window.location.search.replace('?', '&');

	if (param.indexOf("role=") == -1){
		param += '&role=' + Schedule.role;
	}

	//合并的教务课带上额外的参数
	if (lesson.mergeId){
		param += '&mergeId='+ lesson.mergeId +'&jc='+ lesson.jc;
	}

	//进h5网页版的详情页一共有3个，经过客户端版本迭代，现在应该都走的是scheduleDetailNew2.html
	var openurl = Schedule.domain + Schedule.mctx + '/res/app/curriculum/scheduleDetailNew2.html';

	AppUtils.openUrl({
		toolbarType : 1,
		webUrl : openurl + param
	});
}

// 使用协议打开客户端详情页
Schedule.openClientDetail = function(data) {
	if (Schedule.openStuDetailWithProtocol) {
		jsBridge.postNotification('CLIENT_STU_CURRICULUM_DETAIL', data);
	} else if (Schedule.openTeaDetailWithProtocol) {
		data.onlineWayList = Schedule.onlineWayList;
		jsBridge.postNotification('CLIENT_TEA_CURRICULUM_DETAIL', data);
	}
}

//调接口查智博课堂状态
Schedule.getZhiboktStatus = function(lesson, protocolData) {
	if (!lesson || !protocolData) {
		return;
	}
	lesson.week = $('.selectWeek span').attr('week') || Schedule.curriculum.currentWeek;
	lesson.schoolYear = Schedule.curriculum.schoolYear;
	lesson.semester = Schedule.curriculum.semester;
	lesson.fid = Schedule.curriculum.fid;
	$.ajax({
		type: 'POST',
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		url: Schedule.mctx + '/curriculum/getZhiboktStatus',
		data: {
			lessonDetail : JSON.stringify(lesson)
		},
		dataType: 'json',
		success: function (resultData) {
			if (resultData && resultData.result == 1 && resultData.data
				&& resultData.data.zhiboStatus && resultData.data.zhiboStatus.status
				&& resultData.data.zhiboStatus.isshow){
				//智博课堂的参数控制
				protocolData.showZhiBoButton = 1;
				protocolData.zhiBoButton = {
					code: resultData.data.zhiboStatus.code,
					appurl : resultData.data.zhiboStatus.appurl || ''
				}
			}
			Schedule.openClientDetail(protocolData);
		}
	});
}

// 根据上课信息获取对应的表单编辑页地址
Schedule.getFormEditUrl = function(lesson, protocolData) {
	if (!lesson || !protocolData) {
		return;
	}
	if (Schedule.isLoadingFormUrl){
		return;
	}
	Schedule.isLoadingFormUrl = true;
	var formAddUrl = getFormAddUrl(lesson);
	var url = Schedule.domain + Schedule.mctx + '/curriculum/getFormEditUrl?wholeDay='+lesson.wholeDay
		+'&lessonConfigUuid='+ lesson.lessonConfigUuid +'&term='+ Schedule.getTerm();
	if (!Schedule.inClient) {
		// 线上，直接调接口
		$.ajax({
			type: 'POST',
			url: url,
			data: {},
			dataType: 'json',
			success: function(data){
				if(data && data.result == 1 && data.data) {
					//表单编辑页地址
					protocolData.unitNoteUrl = data.data;
					protocolData.courseNoteTitle = '详情';
				}else {
					//表单新增页地址
					protocolData.unitNoteUrl = formAddUrl;
					protocolData.courseNoteTitle = '';
				}
				Schedule.isLoadingFormUrl = false;
				Schedule.openClientDetail(protocolData);
			},
		});
	} else {
		// 客户端里，通过openurl协议调接口
		var param = {
			loadType : 3,
			webUrl : url,
		}
		jsBridge.unbind('CLIENT_OPEN_URL');
		jsBridge.postNotification('CLIENT_OPEN_URL', param);
		jsBridge.bind('CLIENT_OPEN_URL', function(object){
			if (typeof object == 'undefined' || object.result == 0) {
				return;
			}
			var data = object.data;
			if (typeof data == 'string') {
				data = JSON.parse(data);
			}
			if(data && data.result == 1 && data.data) {
				//表单编辑页地址
				protocolData.unitNoteUrl = data.data;
				protocolData.courseNoteTitle = '详情';
			}else {
				//表单新增页地址
				protocolData.unitNoteUrl = formAddUrl;
				protocolData.courseNoteTitle = '';
			}
			Schedule.isLoadingFormUrl = false;
			Schedule.openClientDetail(protocolData);
		});
	}
}

// 删除课程
Schedule.deleteCourse = function() {
	var lesson = Schedule.allLessonMap.get(Schedule.deleteLessonId) || {};
	if (!lesson) {
		return;
	}
	//教务课不允许删除
	if (lesson.courseNo && lesson.classNo){
		AppUtils.clientMessageDisplay('教务课表不允许删除');
		return;
	}
	var url = window.location.href;
	if (url.startsWith('http')) {
		// 线上，直接调接口
		$.ajax({
			type: 'POST',
			url: Schedule.mctx + '/curriculum/deleteLesson?lessonConfigUuid=' + lesson.lessonConfigUuid + '&term='+Schedule.getTerm(),
			data: {},
			dataType: 'json',
			success: function(data){
				if(!data || data.result != 1) {
					AppUtils.clientMessageDisplay(data.msg || '删除失败')
					return;
				}
				AppUtils.clientMessageDisplay('删除成功');

				Schedule.deleteCourseCallback();
			},
		});
	} else {
		// 客户端里，通过openurl协议调接口
		var param = {
			loadType : 3,
			webUrl : Schedule.domain + Schedule.mctx + '/curriculum/deleteLesson?lessonConfigUuid=' + lesson.lessonConfigUuid + '&term='+Schedule.getTerm(),
		}
		jsBridge.unbind('CLIENT_OPEN_URL');
		jsBridge.postNotification('CLIENT_OPEN_URL', param);
		jsBridge.bind('CLIENT_OPEN_URL', function(object){
			if (typeof object == 'undefined' || object.result == 0) {
				return;
			}
			var data = object.data;
			if (typeof data == 'string') {
				data = JSON.parse(data);
			}
			if(!data || data.result != 1) {
				AppUtils.clientMessageDisplay(data.msg || '删除失败')
				return;
			}
			AppUtils.clientMessageDisplay('删除成功');

			Schedule.deleteCourseCallback();
		});

	}
}
// 删除课程成功后的回调
Schedule.deleteCourseCallback = function() {
	var td = $('td[lessonid='+ Schedule.deleteLessonId +']');
	if (td.length == 0) {
		return;
	}
	td.find('.tddiv').remove();
	var rowspan = td.attr('rowspan');
	td.removeClass('rowspan').removeClass('border').removeClass('delete').removeAttr('rowspan').addClass('col').removeAttr('lessonid');

	var row = parseInt(td.parents('tr').attr('class').replace('row',''));
	var col = parseInt(td.attr('class').replace('col',''));
	for(var i=1;i<rowspan;i++){
		$('<td class="col col'+col+'"></td>').insertAfter($('.row'+parseInt(row+i)).find('.col'+parseInt(col-1)))
	}
	setBorder();
	Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
}

/**
 * 客户端课表首页的两个入口地址后面并不会携带参数role，而是通过调用setRole方法把1或4设置给Schedule.role，
 * 所以首页相关的js用到角色的地方都要使用Schedule.role，而不能使用ToolsUtils.getUrlParameter('role')来获取.
 * 首页跳到其他页面后可以通过截取参数获取
 */
Schedule.setRole = function (role) {
	Schedule.role = role;
}


$(function(){

	if (navigator.userAgent.indexOf('ChaoxingClassroomPc') > -1) {
		Schedule.isKeTang = 1;
	}
	if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
		&& !Schedule.isKeTang) {
		// 非手机端，也不是泛雅课堂客户端，跳转到PC端（转发的地址统一用的手机端地址）
		Schedule.mctx = window.location.pathname.substring(0, window.location.pathname.indexOf('/res')) || '';
		window.location.href = window.location.origin + Schedule.mctx + "/res/pc/curriculum/schedule.html" + window.location.search;
		return;
	}
	if (window.location.search.indexOf('dayModel=1') > -1) {
		// 按天模式显示课表
		Schedule.dayModel = 1;
	}
	// ios 高度适配
	if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) != "micromessenger"){
		addIphoneHeight()
	}

	Schedule.event();
	if (isSupportImport()){
		//显示导入按钮
		$('.settingMask .import').show();
	}
	// 加载课程
	Schedule.loadLessons('', 0, 1);

	if (window.location.href.indexOf('role=1') > -1) {
		Schedule.setRole(1);
	} else if (window.location.href.indexOf('role=4') > -1) {
		Schedule.setRole(4);
	}

	setTimeout(function () {
		// 查询地址相关配置，是否有历史地址，是否支持设置泛雅课堂
		// 延迟一下请求，避免和其他地方 同时绑定 CLIENT_OPEN_URL 导致前面的收不到数据
		Schedule.getLocationConfig();
	}, 200);

	/*if (checkIsEn()) {
		// 处理需要翻译的地方
		Schedule.translate();
	}*/
	loadI18nProperties();

	// 监听课表详情页发过来的消息，重新加载页面
	//泛雅课堂客户端现在详情页是pc的，首页是app的，这里需要监听详情页的删除、修改操作
	if (Schedule.isKeTang) {
		setInterval(function() {
			if (localStorage.getItem('reload') == 1) {
				localStorage.removeItem('reload');
				// 刷新页面
				Schedule.loadLessons($('.selectBox .week').attr('week'), 0, 1);
			}
		}, 1000)
	}
	if(navigator.userAgent.indexOf('ChaoXingStudy') == -1) {
		Schedule.h5afterRelation()
	}else {
		//兼容学习通里的“课表上课”
		var fromsetting = window.localStorage.getItem('fromsetting');
		if(fromsetting) {
			Schedule.firstOpen = false;
			window.localStorage.removeItem('fromsetting');
		}
	}
})
Schedule.h5afterRelation = function() {
//解决history.back()不刷新页面的问题
	window.addEventListener('pageshow', function (e) {
		if (e.persisted) {
			window.location.reload()
		}
	})
	//h5不隐藏导入按钮是因为服务端抓取可以正常使用，但是客户端抓取需要用协议，在h5页面无法使用
	$('.richScan,.QRCode,.forward').hide();
	if (Schedule.isKeTang){
		$('.import').hide();
	}
	var fromsetting = window.localStorage.getItem('fromsetting');
	if(fromsetting){
		Schedule.firstOpen = false;
		window.localStorage.removeItem('fromsetting');
		var lessonlength = window.localStorage.getItem('lessonLength');
		var semster = window.localStorage.getItem('semster');
	}else{
		window.localStorage.removeItem('semster');
		window.localStorage.removeItem('lessonLength');
	}
	//学期选择
	if(semster){
		semster = JSON.parse(semster);
		// 修改当前学期
		if (semster.schoolYear != Schedule.curriculum.schoolYear
			|| semster.semester != Schedule.curriculum.semester) {
			var localStorageData = {
				schoolYear: semster.schoolYear,
				semester : semster.semester,
				userSelectedTime : new Date().getTime()
			}
			localStorage.setItem('last_selected_curriculum', JSON.stringify(localStorageData));
			// 学期或者学年有变化，重新加载数据
			Schedule.loadLessons('', 0, 1);
		}
	}
	//每节时长与节数
	if(lessonlength){
		lessonlength = JSON.parse(lessonlength)
		// 更新每日课程节数
		Schedule.stime = JSON.parse(lessonlength.stime);
		updateTdTime(Schedule.stime);
		refreshTbody('#scheduleTable', Schedule.stime.length);
		if (Schedule.inClient) {
			// 嵌入在客户端中，调客户端方法让客户端调接口取配置数据更新本地缓存
			Schedule.loadLessons($('.selectWeek span').attr('week'), 1, 1)
		}
	}
}

Schedule.getLocationConfig = function () {
	var param = {
		loadType : 3,
		webUrl : Schedule.domain + Schedule.mctx + '/curriculum/getLocationConfig?pluginVersion='+Schedule.pluginVersion,
	}
	jsBridge.unbind('CLIENT_OPEN_URL');
	jsBridge.postNotification('CLIENT_OPEN_URL', param);
	jsBridge.bind('CLIENT_OPEN_URL', function(object){

		if (typeof object == 'undefined') {
			return;
		}
		var data = object.data;
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}
		if (data.result == 0 || !data.data) {
			return;
		}
		data = data.data;
		Schedule.hasLocationHistory = data.hasLocationHistory || 0;
		Schedule.supportCXMeet = data.supportCXMeet || 0;

		//判断是否显示泛雅课堂和腾讯会议，组装onlineWayList传给协议
		if (data.supportCXMeet == 1){
			Schedule.onlineWayList.push({
				"onlineType": 1,
				"title": "在线课堂"
			})
		}
		if (data.banTXMeet != 1){
			Schedule.onlineWayList.push({
				"onlineType": 2,
				"title": "腾讯会议"
			})
		}
		Schedule.onlineWayList.push({
			"onlineType": 4,
			"title": "Zoom"
		})
		Schedule.onlineWayList.push({
			"onlineType": 5,
			"title": "ClassIn"
		})
	});
}


/**
 * 获取cookie
 * @param name
 * @returns {string}
 */
Schedule.getCookie = function(name){
	var arr,reg=new RegExp("(^| )*"+name+"=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return '';
	}
}

// 根据课表配置的周日/周一为一周的开始，获取周几真正的下标
Schedule.getRealIndex = function(index) {
	if (!Schedule.monDayIsBegin){
		index--;
		if (index == 0){
			index = 7;
		}
	}
	return index;
}

// 是否可以进行增、删、进详情页等操作
Schedule.canOperate = function() {
	if (Schedule.visitor > 0 || ToolsUtils.getUrlParameter('curriculumUuid')) {
		return false;
	}
	return true;
}

/**
 * 判断当前时间是否在上课时间前后30分钟内
 * beginDate：上课时间
 * endDate：下课时间
 */
Schedule.isDuringLessonTime = function(beginDate, endDate){
	//未设置上课时间时，不做判断
	if (!beginDate || !endDate){
		return true;
	}
	var curDate = new Date().getTime(),
		beginDate = new Date(beginDate.replace(/-/g, "/")).getTime() - 30 * 60 * 1000,
		endDate = new Date(endDate.replace(/-/g, "/")).getTime() + 30 * 60 * 1000;
	if (curDate >= beginDate && curDate <= endDate) {
		return true;
	}
	return false;
}

/**
 * 判断用户课表或默认单位是否等于某个fid
 */
Schedule.isContainsFid = function(fid){
	if (!fid){
		return false;
	}
	return (Schedule.curriculum.fid == fid || Schedule.curriculum.userFid == fid);
}

/**
 * 获取"20221"格式的学年学期
 */
Schedule.getTerm = function(){
	return Schedule.curriculum.schoolYear+Schedule.curriculum.semester;
}

// 查课堂信息（这里和智博课堂都不使用协议调接口是因为都是通过链接进入的，嵌在客户端时是不会调用这两个接口的）
Schedule.getMeetInfo = function(uuid) {
	$.getJSON(Schedule.mctx + '/curriculum/getMeetInfo', {uuid, uuid}, function (backdata) {
		var result = backdata.result || 0;
		if(result == 0 && backdata.msg == '课堂不存在'){
			//弹框提示
			$('.popDeleteCourseModal').show();
			return;
		}
		if(result != 1){
			return;
		}
		data = backdata.data;
		//添加融科sdk判断
		if (data.sdkType == '1' && ToolsUtils.getClientVersion('apiVersion') < 90){
			AppUtils.clientMessageDisplay('版本过低,请升级后重试[0001]');
			return;
		}

		var meetData = {};
		meetData = JSON.parse(decodeURIComponent(data.tokens));
		meetData.uuid = uuid;
		meetData.courseid = data.courseId;
		var audioStatus = 0;
		if (Schedule.curriculum.puid == data.puid) {
			audioStatus = 1;
		}
		Schedule.meetInfo = {
			qrcode : data.qrcode,
			chatRoomid: data.meetClass.chatId,
			meetData : meetData,
			audioStatus : audioStatus,
			hosterLimit : data.hosterLimit,
		}
		AppUtils.clientCXMeeting(Schedule.meetInfo.qrcode, Schedule.meetInfo.chatRoomid,
			Schedule.meetInfo.meetData, Schedule.meetInfo.audioStatus, 0, Schedule.meetInfo.hosterLimit);
	});
}

// 保存冲突课程信息
function saveClashInfo(lessonid, clashCidList) {
	let courseInfo = Schedule.allLessonMap.get(lessonid) || {}
	let beginNumber = courseInfo.beginNumber
	let dayOfWeek = courseInfo.dayOfWeek
	let clashArr = Schedule.clashCourseArr
	let targetIndex = -1

	for(let i = 0; i < clashArr.length; i++){
		if(clashArr[i].beginNumber == beginNumber && clashArr[i].dayOfWeek === dayOfWeek) {
			targetIndex = i
			break
		}
	}

	// 含有该课程 替换
	if(targetIndex > -1) {
		clashArr[targetIndex] = {
			lessonid,
			beginNumber,
			dayOfWeek,
			clashCidList
		}
	} else { // 不含新增
		clashArr.push({
			lessonid,
			beginNumber,
			dayOfWeek,
			clashCidList
		})
	}
}

// 单日模式展示是否展示冲突标识; target => 目标课程
function singleDayShowClash(target) {
	let clashArr = Schedule.clashCourseArr
	// 无冲突课程
	if(!clashArr.length) return false

	for(let i = 0; i < clashArr.length; i++){
		if(clashArr[i].beginNumber === target.beginNumber && clashArr[i].dayOfWeek === target.dayOfWeek)
			return true
	}
	return false
}

// 获取冲突课程模板htm
function getClashItemHtml(colorName, item, wrapClass) {
	// 是否为单日模式
	var isDayView = $('table').hasClass('dayView')

	let locationHtml = '<span>上课地点:&nbsp;</span>'

	if(isDayView) {
		locationHtml = ''
	}

	if(item.onlineLocation) {
		locationHtml += '<span class="onlineWrap"><img src="./images/play.png" alt="" srcset="">' + item.onlineLocation +'</span>'
	} else if(item.location) {
		locationHtml += item.location
	}

	let tempStr = '<div class="item '+ wrapClass + ' '+ colorName +'"><div class="titleBox">'+
			'<div class="title">'+ item.name+'</div>'+
			'<div class="topImg">置顶</div>'+
			'<div class="topBtn" data-lessonConfigUuid='+ item.lessonConfigUuid +' ><img class="topBtnImg" src="./images/clashCourseTopBtn.png" alt="" srcset="">置顶</div></div>'+
			'<div class="week">上课周次:  '+ ToolsUtils.getWeekDes(item.weeks) +'</div>'+
			'<div class="week">上课节次: '+ getLessonRangeDesc(item.beginNumber, item.length) +'</div>'+
			'<div class="location">'+ locationHtml +'</div>'+
			(ToolsUtils.isTeacher(item.role) == true ?'<div class="class">班级:  '+ item.className +'</div>':'<div class="teacher">教师  '+ item.teacherName +'</div>')+
			'<div class="detail" data-lessonId='+ item.lessonId +' >查看详情<img class="detailImg" src="./images/clashCourseDetail.png" alt="" srcset=""></div></div></div>'

	if(isDayView) {
		tempStr = '<div class="item '+ wrapClass + ' '+ colorName +'" style="height:auto; min-height: 90px;"><div class="titleBox">'+
			'<div class="title">'+ item.name+'</div>'+
			'<div class="topImg">置顶</div>'+
			'<div class="topBtn" data-lessonConfigUuid='+ item.lessonConfigUuid +' ><img class="topBtnImg" src="./images/clashCourseTopBtn.png" alt="" srcset="">置顶</div></div>'+
			'<div class="week">上课节次: '+ getLessonRangeDesc(item.beginNumber, item.length) +'</div>'+
			'<div class="location" data-lessonId='+ item.lessonId +'>'+ locationHtml +'</div>'+
			'</div></div>'
	}

	return tempStr
}

// 展示冲突课程列表弹窗
function showClashCourseModal($this) {
	$(".popClashCourseModal .clashCourseList").empty()

	var isDayView = $('table').hasClass('dayView')
	var topId = $this.attr('lessonid')
	var topCrouse = Schedule.allLessonMap.get(topId) 
	var clashIds = []
	var colorName =  ''

	if(isDayView) {	// 单日模式
		clashIds = $this.find('.day-clash').attr('clashcourseids').split(",")
		colorName = $this.find('.day-clash').prop("class").split(' ')[1]
	} else {	// 总览模式
		clashIds = $this.find('.clashCourse').attr('clashcourseids').split(",")
		colorName =  $this.find('.clashCourse').prop("class").split(' ')[1]
	}

	let clashHtml = getClashItemHtml(colorName, topCrouse, 'topItem')

	clashIds.forEach(uuid => {
		let course = Schedule.allLessonUuidMap.get(uuid)
		clashHtml += getClashItemHtml('', course, '')
	})

	$('.popClashCourseModal .clashCourseList').append(clashHtml)
	$('.popClashCourseModal').show()
}