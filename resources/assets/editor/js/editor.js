/**
 *
 * @authors yanan (weiyanan@chaoxing.com)
 * @date    2018-03-19 17:21:35
 */

var zss_editor = {};
//选中文字拖动判断方向参数
zss_editor.selectionchangeDirection = 0;
zss_editor.contentClick = 0;
zss_editor.contentHeight = 244;
zss_editor.contentInsetOffet = 0;
zss_editor.contentInsetOffset = 0;
zss_editor.recordTime = {id: "", time: -1};
zss_editor.enterEdit = {name: "", html: ""};
// var map = new Map();
// If the user is draging
zss_editor.isDragging = false;
// Sets to true when extra footer gap shows and requires to hide
zss_editor.updateScrollOffset = false;
zss_editor.focusedField = null;
zss_editor.editableFields = {};
zss_editor.isnull = true;
zss_editor.recordVoiceSatus = {};
var fillChar = '\u200B';
zss_editor.prefix = 'https://noteyd.chaoxing.com/res/plugin/meditor/';
//zss_editor.prefix = 'http://test.chaoxing.com/meditor/';
// 协同编辑默认关闭
zss_editor.cooperation = false;
zss_editor.addressList = [];//协同地址临时列表
zss_editor.XTSendData = [];//协同发送数据临时列表
zss_editor.lastTime = {"time": 0};//协同编辑拉取数据控制时间
zss_editor.isSendEnter = false;
zss_editor.isSendDelete = false;
zss_editor.isDeleteAll = false;
zss_editor.account = {};
// The current editing image
zss_editor.currentEditingImage;
zss_editor.tempContent;
zss_editor.tempTitle;
//标签初始值存储2021.06.16
zss_editor.tempLabel = [];
//学习通设置字体大小倍数值
zss_editor.fontsizeTimes = [0.875, 1, 1.125, 1.25, 1.5];
zss_editor.wWidth = $(window).width();
zss_editor.editorClientType = true;
zss_editor.editorWebType = false;
zss_editor.needSetChild = {
	'forecolor': 'color',
	'backcolor': 'background-color',
	'fontsize': 'font-size',
	'fontfamily': 'font-family'
}
zss_editor.deleteInfor = {
	text: '删除后将无法恢复！确认删除？',
	cancel: '取消',
	delete: '删除'
}
zss_editor.deleteImage = {
	text: '图片删除后将无法恢复！确认删除？',
	cancel: '取消',
	delete: '删除'
}
zss_editor.deleteTemplate = {
	text: '模板删除后将无法恢复！确认删除？',
	cancel: '取消',
	delete: '删除'
}
zss_editor.noticeInfor = {
	title: '原站内信函',
	edit: '编辑',
	reCall: '撤回',
	reminder: '未读提醒',
	read: '已读: ',
	to: '收件人: ',
	cc: '抄送: '
}
zss_editor.guid = 0;
zss_editor.compilations = {
	name: '',
	logo: '',
	isVisible: ''
};// 笔记合集信息
//xss攻击
zss_editor.xssReg = new RegExp("(\\baler(?=t\\s*\\())|(\\bhref(?=\\s*=\\s*['\"]?\\s*javascript:))|(\\bsrc(?=\\s*=\\s*['\"]?\\s*javascript:))|((data|src)\\s*=['\"]?\\s*data(?=:)(?!:\\s*image))|(^[^<]*<(?=/textarea\\s*>))|(<(?=(script)|(/script)))|(<(?=(details)|(/details)))|(\\b(onstart|onafterprint|onbeforeprint|onbeforeunload|onerror|onhaschange|onload|onmessage|onoffline|ononline|onpagehide|onpageshow|onpopstate|onredo|onresize|onstorage|onundo|onunload|onblur|onchange|oncontextmenu|onfocus|onformchange|onforminput|oninput|oninvalid|onreset|onreset|onsubmit|onkey\\w*|onclick|ondblclick|ondrag\\w*|ondrop|onmouse\\w*|onscroll|ontouch\\w*)(?=(\\s*)=))", 'gi');
var u = navigator.userAgent, app = navigator.appVersion;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isBackupRange = false; //ios系统大于13.4时时更新range
var regStr_saf = /os [\d._]*/gi;
var verinfo = navigator.userAgent.toLowerCase().match(regStr_saf);
var ver = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
if (ver >= "13.4") {
	isBackupRange = true;
} else {
	isBackupRange = false;
}
var stopUpdateScroll = false;
if (ver >= "17.0") {
	stopUpdateScroll = true;
}
// The current selection
zss_editor.currentSelection = {
	startContainer: null,
	startOffset: 0,
	endContainer: null,
	endOffset: 0,
	isTextarea: false,
	update: function () {
		var sel = getSelection();
		if (sel.rangeCount < 1) return;
		var range = sel.getRangeAt(0);
		var start = range.startContainer.childNodes[range.startOffset];
		var nodeName = !!start ? start.nodeName.toLowerCase() : '';
		zss_editor.currentSelection.isTextarea = false;
		zss_editor.currentSelection.startContainer = range.startContainer;
		zss_editor.currentSelection.startOffset = range.startOffset;
		zss_editor.currentSelection.endContainer = range.endContainer;
		zss_editor.currentSelection.endOffset = range.endOffset;
	},
	restore: function () {
		var sel = getSelection();
		var range = document.createRange();
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			var focuseId = zss_editor.getFocusedField();
			if (focuseId != null) {
				focuseId = focuseId.wrappedObject;
				focuseId.focus();
			} else {
				$('#zss_editor_content').focus();
			}
		} else {
			$('#zss_editor_content').focus();
		}
		range.setStart(zss_editor.currentSelection.startContainer, zss_editor.currentSelection.startOffset);
		range.setEnd(zss_editor.currentSelection.endContainer, zss_editor.currentSelection.endOffset);
		zss_editor.currentSelection.setRange(range);

	},
	restoreIosApp: function () {
		var sel = getSelection();
		var range = document.createRange();
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			var focuseId = zss_editor.getFocusedField();
			if (focuseId != null) {
				focuseId = focuseId.wrappedObject;
				focuseId.focus();
			} else {
				$('#zss_editor_content').focus();
			}
		} else {
			$('#zss_editor_content').focus();
		}
		setTimeout(function () {
			range.setStart(zss_editor.currentSelection.startContainer, zss_editor.currentSelection.startOffset);
			range.setEnd(zss_editor.currentSelection.endContainer, zss_editor.currentSelection.endOffset);
			zss_editor.currentSelection.setRange(range);
		}, 200)
	},
	setRange: function (range) {
		var sel = getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
};
zss_editor.updateWebRange = function () {
	x = zss_editor.currentSelection.startContainer;
	xe = zss_editor.currentSelection.startOffset;
	y = zss_editor.currentSelection.endContainer;
	ye = zss_editor.currentSelection.endOffset;
	$("#zss_editor_content").focus();
	var sel = getSelection();
	var range = document.createRange();

	range.setStart(x, xe);
	range.setEnd(y, ye);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
	$("#zss_editor_content").blur();
};
zss_editor.updateEnterRange = function () {
	x = zss_editor.currentSelection.startContainer;
	xe = zss_editor.currentSelection.startOffset;
	y = zss_editor.currentSelection.endContainer;
	ye = zss_editor.currentSelection.endOffset;
	var sel = getSelection();
	var range = document.createRange();

	range.setStart(x, xe);
	range.setEnd(y, ye);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
};
zss_editor.refreshVisibleViewportSize = function () {
	if ($('#zss_editor_content').length > 0) {
		$(document.body).css('min-height', $(window).height() + 'px');
		if (isIOS) {
			$('#zss_editor_content').css('min-height', ($(window).height()) + 'px');
		} else {
			$('#zss_editor_content').css('min-height', ($(window).height() - $('#zss_editor_content').offset().top) + 'px');
		}

	}

};
zss_editor.setPaddingTop = function (top) {
	$(document.body).css("padding-top", top + 'px');
}
zss_editor.changeClientType = function () {
	zss_editor.editorClientType = false;
}

zss_editor.setWebType = function () {
	zss_editor.editorWebType = true;
}
zss_editor.init = function () {
	//通用编辑器录音播放状态2021.05.27
	if (zss_editor.editorClientType == false) {
		jsBridge.bind('CLIENT_AUDIO_STATE', function (object) {
			var objectId = object.mediaId || "";
			if (objectId != "") {
				var cid = zss_editor.recordVoiceSatus[objectId].cid || "";
				//0-暂停, 2-关闭 1-播放

				if (object.controlConfig.playState == 1) {
					zss_editor.recordVoiceSatus[objectId].playState = 1;
					if (cid != "") {
						zss_editor.openVoiceAnimate(cid);
					}

				} else if (object.controlConfig.playState == 0) {
					zss_editor.recordVoiceSatus[objectId].playState = 0;
					if (cid != "") {
						zss_editor.closeVoiceAnimate(cid);
					}

				} else if (object.controlConfig.playState == 2) {
					delete zss_editor.recordVoiceSatus[objectId];
					if (cid != "") {
						zss_editor.closeVoiceAnimate(cid);
					}
				}
			} else {
				if (object.controlConfig.playState == 2) {
					zss_editor.recordVoiceSatus = {};
				}
			}

		});
	}
	//$('#zss_editor_content').focus();
	var editor = $('.field').each(function () {
		var node = $(this);
		var editableField = new ZSSField(node);
		var editableFieldId = node.attr('id');
		zss_editor.editableFields[editableFieldId] = editableField;
	});
	// 英文环境设置英文提示
	if (zss_editor.isEnLanguage()) {
		$("#zss_editor_tit").attr("placeholder", "Title");
		zss_editor.deleteInfor.text = "Cannot be restored after deleting！Be sure to delete?";
		zss_editor.deleteInfor.cancel = "Cancel";
		zss_editor.deleteInfor.delete = "Delete";
		zss_editor.deleteImage.text = "Picture cannot be recovered after deletion！Be sure to delete?";
		zss_editor.deleteImage.cancel = "Cancel";
		zss_editor.deleteImage.delete = "Delete";
		zss_editor.deleteTemplate.text = "Template cannot be recovered after deletion！Be sure to delete?";
		zss_editor.deleteTemplate.cancel = "Cancel";
		zss_editor.deleteTemplate.delete = "Delete";
	}
	//清除pc自动生成的零宽字符
	$(".todo-inner").text("");
	document.addEventListener('selectionchange', function (e) {
		//Auto Focus On Editor
		var sel = getSelection();
		if (sel.rangeCount > 0) {
			var range = sel.getRangeAt(0);
			var node = range.commonAncestorContainer;
			if (!node.classList || !node.classList.contains('field')) {
				var parent = $(node).parents('.field');
				if (parent.length === 0) {
					node = range.startContainer.childNodes[range.startOffset];
					if (node) {
						if (!node.classList || !node.classList.contains('field')) {
							parent = $(node).parents('.field');
							editor.focus();
						}
					}
				}
			}
		}
		if (isIOS && isBackupRange) {
			zss_editor.backupRange();
		} else {
			if (editor.is(":focus")) {
				zss_editor.backupRange();
			}
		}
		if (!$("body").hasClass('editorNoticeWrap') && $("body").hasClass('editorWrap')) {
			// 笔记编辑器默认高度是编辑区可视区
			zss_editor.refreshVisibleViewportSize();
		}

		if (isIOS) {
			//返回面板状态
			var js = zss_editor.enabledEditingItems(e);
			if (window.webkit && window.webkit.messageHandlers.resetStyleButtonsStatus) {
				window.webkit.messageHandlers.resetStyleButtonsStatus.postMessage([js]);
			} else {
				if (window["resetStyleButtonsStatus"]) {
					window["resetStyleButtonsStatus"](js);
				}

			}
			// 实时滚动到光标位置
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				if(!stopUpdateScroll){
					zss_editor.clientscrollToCursorPos();
				}
			} else {
				//脚本实现滚动到焦点位置
				var hasCol = zss_editor.hasRange();
				//有选区，并且是详情页才做自己计算偏移，否则都走之前的
				if (hasCol && window.webkit && window.webkit.messageHandlers.selectionChangeMove) {
					var selection = window.getSelection();
					var range = selection.getRangeAt(0);
					var array = range.getClientRects();
					var first = array[0];
					var last = array[array.length - 1];
					var firstY = first.top;
					var lastY = last.top;
					window.webkit.messageHandlers.selectionChangeMove.postMessage([firstY, lastY]);
				} else if ($("body").hasClass('editorWrap')) {
					if (!hasCol) {
						zss_editor.updateScrollOffset = false;
						if(!stopUpdateScroll){
							zss_editor.calculateEditorHeightWithCaretPosition();
						}
					}

				}
			}
		}
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			var hasCol = zss_editor.hasRange();
			//有选区，并且是详情页才做自己计算偏移，否则都走之前的
			if (hasCol) {
				var selection = window.getSelection();
				var range = selection.getRangeAt(0);
				var array = range.getClientRects();
				var first = array[0];
				var last = array[array.length - 1];
				var firstY = first.top;
				var lastY = last.bottom;
				javaJs.onSelectionChanged(firstY, lastY);
			} else {
				javaJs.onSelectionChanged(0, 0);
			}
		}
	}, false);
	if (!$("body").hasClass('editorNoticeWrap') && $("body").hasClass('editorWrap')) {
		// 笔记编辑器默认高度是编辑区可视区
		zss_editor.refreshVisibleViewportSize();
	}
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		// zss_editor.editFousEditor();
		//设置安卓字体思源黑体
		// $("body").css("font-family","Source Han Sans CN");
	}

	// Make sure that when we tap anywhere in the document we focus on the editor
	$(window).on('touchmove', function (e) {
		zss_editor.isDragging = true;
		zss_editor.updateScrollOffset = true;
		if (isIOS) {
			zss_editor.contentClick++;
		}
	});
	$(window).on('touchstart', function (e) {
		zss_editor.isDragging = false;
		if (isIOS) {
			if (e.target.nodeName == 'IMG') {
				zss_editor.contentClick = 1;
			} else {
				zss_editor.contentClick = 0;
			}

		}
		if (isAndroid && e.target.nodeName != 'IMG' && $("body").hasClass('editorWrap')) {
			$('#zss_editor_content').attr('contenteditable', true);
		}
	});
	$(window).on('touchend', function (e) {
		if (!zss_editor.isDragging && (e.target.id == "zss_editor_footer" || e.target.nodeName.toLowerCase() == "html")) {
			zss_editor.focusEditor();
		}
		if (isIOS) {
			if (window.webkit && window.webkit.messageHandlers.contentClick) {
				window.webkit.messageHandlers.contentClick.postMessage([zss_editor.contentClick]);
			} else if (window["contentClick"]) {
				window["contentClick"](zss_editor.contentClick);
			}
		}
	});
	//教案点击切换20200811
	$(document).on('click', '#ulTab .classul > div', function (e) {
		var sel = window.getSelection();
		var range = document.createRange();
		$(this).addClass("cur_li").siblings().removeClass("cur_li");
		if ($(this).find(".classBefore").length > 0) {
			$(".classConBefore").show();
			$(".classConCenter,.classConAfter").hide();
			var pack = $(".classConBefore")[0];
			range.setStart(pack, 0);
			range.setEnd(pack, 0);
			zss_editor.currentSelection.setRange(range);
			$(".classConBefore iframe.attach-insertVideo").each(function () {
				var cid = $(this).attr("cid");
				zss_editor.changeVideoHeight(cid);
			})
		}
		if ($(this).find(".classCenter").length > 0) {
			$(".classConCenter").show();
			$(".classConBefore,.classConAfter").hide();
			var pack = $(".classConCenter")[0];
			range.setStart(pack, 0);
			range.setEnd(pack, 0);
			zss_editor.currentSelection.setRange(range);
			$(".classConCenter iframe.attach-insertVideo").each(function () {
				var cid = $(this).attr("cid");
				zss_editor.changeVideoHeight(cid);
			})
		}
		if ($(this).find(".classAfter").length > 0) {
			$(".classConAfter").show();
			$(".classConBefore,.classConCenter").hide();
			var pack = $(".classConAfter")[0];
			range.setStart(pack, 0);
			range.setEnd(pack, 0);
			zss_editor.currentSelection.setRange(range);
			$(".classConAfter iframe.attach-insertVideo").each(function () {
				var cid = $(this).attr("cid");
				zss_editor.changeVideoHeight(cid);
			})
		}

	});
	//教案课前课中课后通知客户端换对应面板2020.08.28
	$(document).on('click', '#ulTab .classul > div', function (e) {
		if ($(this).find(".classBefore").length > 0) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.sendClassStatus("classBefore");
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.sendClassStatus) {
					window.webkit.messageHandlers.sendClassStatus.postMessage(["classBefore"]);
				} else {
					if (window["sendClassStatus"]) {
						window["sendClassStatus"]("classBefore");
					}
				}
			}
		}
		if ($(this).find(".classCenter").length > 0) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.sendClassStatus("classCenter");
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.sendClassStatus) {
					window.webkit.messageHandlers.sendClassStatus.postMessage(["classCenter"]);
				} else {
					if (window["sendClassStatus"]) {
						window["sendClassStatus"]("classCenter");
					}
				}
			}

		}
		if ($(this).find(".classAfter").length > 0) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.sendClassStatus("classAfter");
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.sendClassStatus) {
					window.webkit.messageHandlers.sendClassStatus.postMessage(["classAfter"]);
				} else {
					if (window["sendClassStatus"]) {
						window["sendClassStatus"]("classAfter");
					}
				}
			}
		}
	});
	//标签点击2021.06.11
	$(document).on('click', '#editor_label_box .editor_label_item', function (e) {
		$(this).toggleClass("active");
    if($("#editor_label_box .editor_label_item.active").length > 20){
			$(this).removeClass("active");
      zss_editor.showHint("话题标签限20个")
    }
	});
	//进入标签管理页面2021.06.11
	$(document).on('click', '#editor_label_box .editor_label_manage', function (e) {
			zss_editor.openLabelPage('BUTTON_EDIT');
	});
	//进入新建标签页面2021.06.11
	$(document).on('click', '#editor_label_box .editor_label_add', function (e) {
		zss_editor.openLabelPage('BUTTON_OPEN');
	});
	// 会议模板
	$(document).on('touchstart', '.template_more', function (e) {
		$(this).siblings('.template_more_con').toggle();
		$(this).parents("thead").siblings().find(".template_more_con").hide();
		$(this).parents("tbody").siblings().find(".template_more_con").hide();
		$(this).parents("tr").siblings().find(".template_more_con").hide();
	});
	//会议模板删除
	$(document).on('touchstart', '.template_meeting thead .template_item_del:not(.template_item_delGray)', function (e) {
		var thead = $(this).parents('thead');
		var tbody = thead.next('tbody');
		thead.remove();
		tbody.remove();
		$(".template_opt").each(function (index) {
			if (!$(this).hasClass('template_opt_cur')) {
				var index = index + 1
				$(this).find(".template_opt_h").html("议题" + index);
			}
		})
		$(".template_more_con").hide();
		if ($(".template_opt").length == 1) {
			$(".template_meeting thead .template_item_del").addClass('template_item_delGray');
		} else {
			$(".template_meeting thead .template_item_del").removeClass('template_item_delGray');
		}
	});
	//会议模板添加
	$(document).on('touchstart', '.template_meeting thead .template_item_add', function (e) {
		var thead = $(this).parents('thead');
		var tbody = thead.next('tbody');
		var index = $(".template_opt").index($(this).parents(".template_opt")) + 2;
		var thtml = '<thead>' +
			'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">议题' + index + '</span>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</th>' +
			'</thead>' +
			'<tbody>' +
			'<tr>' +
			'<td class="template_tab_l">' +
			'<p>讨论过程</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<p class="template_focus">\u200b</p>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td class="template_tab_l">' +
			'<p>结论</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<p>\u200b</p>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td class="template_tab_l">' +
			'<p>任务</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<div class="template_item">' +
			'<p>1.</p>' +
			'<p>截止时间：</p>' +
			'<p>负责人：</p>' +
			'</div>' +
			'<p>\u200b</p>' +
			'<div class="template_item">' +
			'<p>2.</p>' +
			'<p>截止时间：</p>' +
			'<p>负责人：</p>' +
			'</div>' +
			'<p>\u200b</p>' +
			'<div class="template_item">' +
			'<p>3.</p>' +
			'<p>截止时间：</p>' +
			'<p>负责人：</p>' +
			'</div>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>' +
			'<tr>' +
			'<td class="template_tab_l">' +
			'<p>遗留问题</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<ol>' +
			'<li class="template_tab_li"><p>\u200b</p></li>' +
			'<li class="template_tab_li"><p>\u200b</p></li>' +
			'<li class="template_tab_li"><p>\u200b</p></li>' +
			'</ol>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>' +
			'</tbody>';
		tbody.after(thtml);
		$(".template_opt").each(function (index) {
			if (!$(this).hasClass('template_opt_cur')) {
				var index = index + 1
				$(this).find(".template_opt_h").html("议题" + index);
			}
		})
		$(".template_more_con").hide();
		if ($(".template_opt").length == 1) {
			$(".template_meeting thead .template_item_del").addClass('template_item_delGray');
		} else {
			$(".template_meeting thead .template_item_del").removeClass('template_item_delGray');
		}
		setTimeout(function () {
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			range.setStart($(".template_focus")[0], 0);
			range.setEnd($(".template_focus")[0], 0);
			range.selectNodeContents($(".template_focus")[0]);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
			$(".template_focus").removeClass('template_focus');
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				setTimeout(zss_editor.clientscrollToCursorPos, 200);
			} else {
				//脚本实现滚动到焦点位置
				setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 200);
			}
		}, 200)

	});
	//听课记录模板
	$(document).on('touchstart', '.template_attendClass thead .template_item_add', function (e) {
		var thead = $(this).parents('thead');
		var tbody = thead.next('tbody');
		var thtml = '<thead>' +
			'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">标题</span>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</th>' +
			'</thead>' +
			'<tbody>' +
			'<tr>' +
			'<td class="template_tab_l">' +
			'<p class="template_focus">\u200b</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<p>\u200b</p>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>' +
			'</tbody>';
		tbody.after(thtml);
		$(".template_more_con").hide();
		if ($(".template_opt").length == 1) {
			$(".template_attendClass thead .template_item_del").addClass('template_item_delGray');
		} else {
			$(".template_attendClass thead .template_item_del").removeClass('template_item_delGray');
		}
		setTimeout(function () {
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			range.setStartAfter($(".template_focus")[0]);
			range.setEndAfter($(".template_focus")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".template_focus").removeClass('template_focus');
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				setTimeout(zss_editor.clientscrollToCursorPos, 200);
			} else {
				//脚本实现滚动到焦点位置
				setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 200);
			}
		}, 200)

	});
	$(document).on('touchstart', '.template_class tbody .template_item_add', function (e) {
		var tr = $(this).parents('tr');
		var tbody = $(this).parents("tbody");
		var thtml = '<tr>' +
			'<td class="template_tab_l">' +
			'<p class="template_focus">\u200b</p>' +
			'</td>' +
			'<td class="template_tab_r">' +
			'<p>\u200b</p>' +
			'<div class="template_more_box">' +
			'<span class="template_more" contenteditable="false"></span>' +
			'<div class="template_more_con" contenteditable="false">' +
			'<span class="template_item_del"></span>' +
			'<span class="template_item_add"></span>' +
			'</div>' +
			'</div>' +
			'</td>' +
			'</tr>';
		tr.after(thtml);
		$(".template_more_con").hide();
		if (tbody.find("tr").length == 1) {
			tbody.find(".template_item_del").addClass('template_item_delGray');
		} else {
			tbody.find(".template_item_del").removeClass('template_item_delGray');
		}
		setTimeout(function () {
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			range.setStartAfter($(".template_focus")[0]);
			range.setEndAfter($(".template_focus")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".template_focus").removeClass('template_focus');
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				setTimeout(zss_editor.clientscrollToCursorPos, 200);
			} else {
				//脚本实现滚动到焦点位置
				setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 200);
			}
		}, 200)

	});
	//听课记录模板删除头部
	$(document).on('touchstart', '.template_attendClass thead .template_item_del:not(.template_item_delGray)', function (e) {
		var thead = $(this).parents('thead');
		var tbody = thead.next('tbody');
		thead.remove();
		tbody.remove();

		$(".template_more_con").hide();
		if ($(".template_tab_h").length == 1) {
			$(".template_attendClass thead .template_item_del").addClass('template_item_delGray');
		} else {
			$(".template_attendClass thead .template_item_del").removeClass('template_item_delGray');
		}
	});
	//听课记录模板删除行
	$(document).on('touchstart', '.template_class tbody .template_item_del:not(.template_item_delGray)', function (e) {
		var tr = $(this).parents('tr');
		var tbody = $(this).parents("tbody");
		tr.remove();
		$(".template_more_con").hide();
		if (tbody.find("tr").length == 1) {
			tbody.find(".template_item_del").addClass('template_item_delGray');
		} else {
			tbody.find(".template_item_del").removeClass('template_item_delGray');
		}
	});
	$(".table").scroll(function () {
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			javaJs.iframeScrollx();
		}
	})
	$(document).on('touchstart', '.template_item_delGray', function (e) {
		$(".template_more_con").hide();
	});
//	$(document).on('click','#zss_editor_content img',function(e) {
//  	var imageUrl = [];
//      $("#zss_editor_content img").each(function() {
//          imageUrl.push($(this).attr("src"));
//      });
//      var position = $("#zss_editor_content img").index($(this));
//     	zss_editor.onImageClick(imageUrl,position);
//	});
	//长按图片
	var touchY = 0;
	var longClick = 0;
	var timeOutEvent;
	$(document).on('touchstart', '#zss_editor_content img', function (e) {
		clearTimeout(timeOutEvent);
		longClick = 0;
		_this = this;
		if (isIOS) {
			document.documentElement.style.webkitTouchCallout = 'none';
			document.documentElement.style.webkitUserSelect = 'none';
		} else {
			$('#zss_editor_content').attr('contenteditable', false);
		}
		timeOutEvent = setTimeout(function () {
			//此处为长按事件
			longClick = 1;//假如长按，则设置为1
			var html = $(_this).parents(".editor-image").prop("outerHTML");
			var top = $(_this).offset().top - $(window).scrollTop();
			var addr = $(_this).attr("src");
			var position = $("#zss_editor_content img").index($(_this));
			zss_editor.showimageForward(html, top, addr, position);
			if (isAndroid && $("body").hasClass('editorWrap')) {
				$('#zss_editor_content').attr('contenteditable', true);
			}
		}, 500);
		var touch = e.originalEvent.targetTouches[0];
		touchY = touch.clientY;
	}).on('touchmove', '#zss_editor_content img', function (e) {
		clearTimeout(timeOutEvent);
		timeOutEvent = 0;
		var touch = e.originalEvent.changedTouches[0];
		if (Math.abs(touch.clientY - touchY) < 10) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				e.preventDefault();
			}
		}
	}).on('touchend', '#zss_editor_content img', function (e) {
		clearTimeout(timeOutEvent);
		if (isIOS) {
			document.documentElement.style.webkitUserSelect = 'text';
		}
		if (isAndroid && $("body").hasClass('editorWrap')) {
			$('#zss_editor_content').attr('contenteditable', true);
		}
		if (timeOutEvent != 0 && longClick == 0) {//点击
			//此处为点击事件----在此处跳转
			if($(this).attr('data-link') && $("body").hasClass('previewWrap')){
				//详情页图片设置了链接的，点击直接跳转到链接
				var link = $(this).attr('data-link');
				if(link.indexOf('http://') != 0 && link.indexOf('https://') != 0){
					link = 'https://' + link
				}
				if(isAndroid || (isIOS && getClientVersion('apiVersion') > '242')){
					//安卓有协议，IOS大于242才有openLink协议
					//android
					if (isAndroid && (typeof javaJs !== 'undefined')) {
						javaJs.openLink(link);
					}
					//ios
					if (isIOS) {
						if (window.webkit && window.webkit.messageHandlers.openLink) {
							window.webkit.messageHandlers.openLink.postMessage([link]);
						} else {
							if (window["openLink"]) {
								window["openLink"](link);
							}
						}
					}
				} else { //没有协议，用a标签跳转
					var a = document.createElement('a');
					a.href = link;
					a.click();
					$(a).remove();
				}
			}else{
				if (zss_editor.editorClientType == false) {
					//通用编辑器图片放大
					var obj = {};
					obj.imageUrl = $(this).attr("src") || "";
					obj.originUrl = $(this).attr("data-original") || "";
					zss_editor.imgZoom(obj);
				} else {
					var imageUrl = [];
					var downloadArr = [];
					$("#zss_editor_content img").each(function () {
						imageUrl.push($(this).attr("src") || '');
						if ($(this).attr("download")) {
							downloadArr.push(1)
						} else {
							downloadArr.push(0)
						}
					});
					var position = $("#zss_editor_content img").index($(this));
					zss_editor.onImageClick(imageUrl, position, downloadArr);
				}
			}

		}
		return false;
	})
	//详情页长按a链接坦复制提示框2020.11.11
	var atouchY = 0;
	var alongClick = 0;
	var atimeOutEvent;
	$(".previewWrap").on('touchstart', '#zss_editor_content a', function (e) {
		clearTimeout(atimeOutEvent);
		alongClick = 0;
		_this = this;
		var touch = e.originalEvent.targetTouches[0];
		atouchY = touch.clientY;
		atimeOutEvent = setTimeout(function () {
			//此处为长按事件
			alongClick = 1;//假如长按，则设置为1
			console.log("长按")
			var aEle = $(e.target);
			var html = aEle.attr("href");
			var top = aEle.offset().top - $(window).scrollTop();
			var left = aEle.offset().left + aEle.width() / 2;
			//掉客户端方法弹框
			zss_editor.showacopyPrompt(html, top, left);
		}, 500);

	}).on('touchmove', '#zss_editor_content a', function (e) {
		clearTimeout(atimeOutEvent);
		atimeOutEvent = 0;
		var touch = e.originalEvent.changedTouches[0];
		if (Math.abs(touch.clientY - atouchY) < 10) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				e.preventDefault();
			}
		}
	}).on('touchend', '#zss_editor_content a', function (e) {
		clearTimeout(atimeOutEvent);
		if (atimeOutEvent != 0 && alongClick == 0) {//点击
			//此处为点击事件----在此处跳转
		}

	})
	//编辑页a链接跳转2021.01.22
	$(".editorWrap").on('click', '#zss_editor_content .dynacALink', function (e) {
		var ahref = $(this).attr("href");
		//window.location.href = ahref;
		if (ahref && !$(this).hasClass("iframe")) {
			//android
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.openLink(ahref);
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.openLink) {
					window.webkit.messageHandlers.openLink.postMessage([ahref]);
				} else {
					if (window["openLink"]) {
						window["openLink"](ahref);
					}
				}
			}
		}

	})
	//文本附件链接打开附件2021.04.15
	$(document).on('click', 'a.iframe', function (e) {
		var attachment = $(this).attr("name");
		if (attachment) {
			try {
				attachment = b64DecodeUnicode(attachment);
			} catch (e) {

			}
			//android
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.onClickAttachment(attachment);
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.onClickAttachment) {
					window.webkit.messageHandlers.onClickAttachment.postMessage([attachment]);
				} else {
					if (window.top["onClickAttachment"]) {
						window.top["onClickAttachment"](attachment);
					}
				}
			}
		}

	})
	// 解决详情页表格滑动卡顿
	var tableOffsetX = 0;
	var tableTouchStatus = 0; //表格触摸状态 0：未触摸或触摸结束或滑动事件已处理 1：正在触摸
	$(document).on('touchstart', '.table', function (e) {
		if ($(this).width() < $(this).find('table').width()) {
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.iframeCanScrollx();
			}
		}
		tableTouchStatus = 1;
		tableOffsetX = $(this).find('table').offset().left;
	}).on('touchmove', '.table', function (e) {
		if (tableTouchStatus == 1) {
			var offsetX = $(this).find('table').offset().left;
			if (Math.abs(offsetX - tableOffsetX) > 50) {
				if (isAndroid && (typeof javaJs !== 'undefined')) {
					javaJs.iframeScrollx();
				}
				tableTouchStatus = 0;
			}
		}
	}).on('touchend', '.table', function (e) {
		tableTouchStatus = 0;
	});
	$(document).on('click', '.loading-chat-fail', function (e) {
		var obj = {};
		var img = $(this).parents(".editor-image").find('img');
		if (zss_editor.editorWebType == true) {
			return;
		}
		if (zss_editor.editorClientType == true) {
			obj.objectid = img.attr("objectid");
			zss_editor.reuploadImage(obj);
		} else {
			obj.cid = img.attr("objectid");
			obj.type = 1;
			obj.data.url = img.attr("src");
			jsBridge.postNotification('CLIENT_UPLOAD_MEDIA_DATA', obj);
		}

	});
	$('#notice_main').on('click', 'img', function (e) {
		var imageUrl = [];
		$("#notice_main img").each(function () {
			imageUrl.push($(this).attr("src"));
		});

		var position = $("#notice_main img").index($(this));
		zss_editor.onReplyImageClick(imageUrl, position);
	});
	// 点击详情页打点掉客户端方法实现当前时间播放
	$(".previewWrap").on('touchstart', '.record-box .record-list-time', function (e) {
		e.stopPropagation();
		if($(this).parents('.record-box-video').length > 0){
			return
		}
		// if($(this).hasClass('record-tit-cur')){

		//    }else{
		//   	    $(".record-list-tit").removeClass('record-tit-cur');
		// 	$(this).addClass('record-tit-cur');
		//    }
		var time = $(this).text();
		time = zss_editor.timeToSecond(time);
		var id = $(this).parents('.record-box').attr('id');
		id = id.substring(id.indexOf("_") + 1);
		var timeArr = zss_editor.getAllmarkTime(id);
		var iframeAllArr = [];
		$("iframe").each(function () {
			var iframeArr = [];
			var iframeId = $(this).attr('cid');
			var iframeTimeArr = zss_editor.getAllmarkTime(iframeId);
			var iframeName = $(this).attr('name');
			try {
				iframeName = b64DecodeUnicode(iframeName);
			} catch (e) {

			}
			iframeArr.push(iframeTimeArr);
			iframeArr.push(iframeName);
			iframeAllArr.push(iframeArr);
		})
		if ($("iframe[cid=" + id + "]").length > 0) {
			var frameName = $("iframe[cid=" + id + "]").attr("name");
			try {
				frameName = b64DecodeUnicode(frameName);
			} catch (e) {

			}
			zss_editor.onMarktimeClick(time, timeArr, frameName, JSON.stringify(iframeAllArr));
		}
	});
	// 点击编辑页打点掉客户端方法实现当前时间播放
	$(".editorWrap").on('touchstart', '.record-box .record-list-time', function (e) {
		e.stopPropagation();
		if($(this).parents('.record-box-video').length > 0){
			return
		}
		// if(isAndroid && (typeof javaJs !== 'undefined')){
		// 	$(this).parents(".record-list-tit").addClass('record-tit-cur').parents(".record-list").siblings().find(".record-list-tit").removeClass('record-tit-cur').parents(".record-box").siblings().find(".record-list-tit").removeClass('record-tit-cur');
		// }
		var time = $(this).text();
		time = zss_editor.timeToSecond(time);
		var id = $(this).parents('.record-box').attr('id');
		id = id.substring(id.indexOf("_") + 1);
		var timeArr = zss_editor.getAllmarkTime(id);
		var iframeAllArr = [];
		$("iframe").each(function () {
			var iframeArr = [];
			var iframeId = $(this).attr('cid');
			var iframeTimeArr = zss_editor.getAllmarkTime(iframeId);
			var iframeName = $(this).attr('name');
			try {
				iframeName = b64DecodeUnicode(iframeName);
			} catch (e) {

			}
			iframeArr.push(iframeTimeArr);
			iframeArr.push(iframeName);
			iframeAllArr.push(iframeArr);
		})
		if ($("iframe[cid=" + id + "]").length > 0) {
			var frameName = $("iframe[cid=" + id + "]").attr("name");
			try {
				frameName = b64DecodeUnicode(frameName);
			} catch (e) {

			}
			zss_editor.onMarktimeClick(time, timeArr, frameName, JSON.stringify(iframeAllArr));
		}
	});
	//视频打点点击
	$("body").on('touchstart', '.record-box-video .record-list-time', function (e) {
		e.stopPropagation();
		// if(isAndroid && (typeof javaJs !== 'undefined')){
		// 	$(this).parents(".record-list-tit").addClass('record-tit-cur').parents(".record-list").siblings().find(".record-list-tit").removeClass('record-tit-cur').parents(".record-box").siblings().find(".record-list-tit").removeClass('record-tit-cur');
		// }
		var iframe = $(this).parents('.record-box').find('.record-iframe iframe,.record-iframe ui-attachment');
		var iframeName = '';
		if (iframe.length > 0) {
			iframeName = $(iframe).attr('name');
			try {
				iframeName = b64DecodeUnicode(iframeName);
			} catch (e) {

			}
		}

		var time = $(this).text();
		time = zss_editor.timeToSecond(time);
		var id = $(this).parents('.record-box').attr('id');
		id = id.substring(id.indexOf("_") + 1);
		//android
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			javaJs.onVideoMarktimeClick(time, id, iframeName);
		}
		//ios
		if (isIOS) {
			if (window.webkit && window.webkit.messageHandlers.onVideoMarktimeClick) {
				window.webkit.messageHandlers.onVideoMarktimeClick.postMessage([time, id, iframeName]);
			} else {
				if (window["onVideoMarktimeClick"]) {
					window["onVideoMarktimeClick"](time, id, iframeName);
				}
			}
		}
	});
	// 点击打点加号
	// $(".editorWrap").on('touchstart','.record-list-add',function(e) {
	// 	e.stopPropagation();
	// 	var id = $(this).parents('.record-box').attr('id');
	//    	id = id.substring(id.indexOf("_")+1);
	// 	zss_editor.onMarkaddClick(id);
	// });
	// content is empty
	var maxHtml = '';
	$(".editor_title,.editor_main").on("input", function (e) {
		// content is empty
		zss_editor.hasContent();
		// limit title words 200
		if ($(this).hasClass('editor_title')) {
			var _html = $('#zss_editor_tit').html();
			_html = _html.replace(/&nbsp;/g, ' ');
			if (_html.length > 200) {
				$('#zss_editor_tit').html(_html.substr(0, 200));
				$('#zss_editor_tit').blur();
				zss_editor.showHint("标题限200字");
			}
		}
		// 去掉通知笔记限制内容2020.10.10
//		if($(this).hasClass('editor_main')){
//			var text = $('#zss_editor_content').text();
//			_text = text.replace(new RegExp("​", 'g'),'');
//			if(_text.length > 20000 && _text.length < 20020){
//				maxHtml = $('#zss_editor_content').html();
//			}else if(_text.length > 20000){
//				if(maxHtml){
//					$('#zss_editor_content').html(maxHtml);
//				    $('#zss_editor_content').blur();
//				    zss_editor.showHint("正文不得超过20000字");
//				}
//			}
//		}
		// 安卓滚动
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置,通知超过一瓶换行抖动,注释掉，影响换行滚动了，放开
				zss_editor.clientscrollToCursorPos();
			} else {
				zss_editor.scrollToCursorPos();
			}
		}
		// 文字前换行也触发滚动计算高度
		if (isIOS) {
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端ios17之前实现滚动到焦点位置
				if(!stopUpdateScroll){
					zss_editor.clientscrollToCursorPos();
				}
			} else {
				//脚本实现滚动到焦点位置,通知超过一瓶换行抖动,注释掉
				zss_editor.updateScrollOffset = false;
				zss_editor.calculateEditorHeightWithCaretPosition();
			}
		}
		// 会议模板议题标题修改过增加标记
		$(".template_more_con").hide();
		var temp = zss_editor.closerParentNodeWithName('.template_opt');
		if (temp && temp.className && temp.className.indexOf("template_opt_cur") == -1) {
			$(temp).addClass('template_opt_cur');
		}
	});
	$("#zss_editor_tit").on('paste', function (e) {
		var pastedText = undefined;
		if (window.clipboardData && window.clipboardData.getData) { // IE
			pastedText = window.clipboardData.getData('Text');
		} else {
			pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
		}
		if (pastedText.length > 200) {
			e.preventDefault();
			$(this).html(pastedText.substr(0, 200));
			this.blur();
			zss_editor.showHint("标题限200字");
		}
	});
	$('#zss_editor_content').on('keyup', function (e) {
		//处理录音打点时间后的输入
		var sel = getSelection();
		if (sel.rangeCount > 0) {
			var range = sel.getRangeAt(0);
			var start = range.startContainer;
			if (start.nodeType == 3) {
				start = start.parentNode;
				while (start.id != 'zss_editor_content') {
					if (start.className && start.className.indexOf('record-list-tit') > -1) {
						break;
					} else {
						start = start.parentNode;
					}
				}
			}
			var li = zss_editor.closerParentNodeWithName('li');
			//20210430 删除后列表为空时,给列表加8203,矫正光标位置高低
			if (li && li.firstChild && li.firstChild.nodeName == 'BR') {
				li.firstChild.remove();
				li.appendChild(document.createElement('p'));
				//2022.05.11协同编辑加elementid
				li.setAttribute('element-id', zss_editor.getRandomId());
				li.firstChild.appendChild(document.createTextNode("\u200b"));
				li.firstChild.appendChild(document.createElement("br"));
				range.setStart(li.firstChild, 1);
				range.collapse(true);
				zss_editor.currentSelection.setRange(range);
			} else if (li && li.firstChild && li.firstChild.nodeType == 1 && li.firstChild.children.length == 1 && li.firstChild.firstChild.nodeName == 'BR') {
				li.firstChild.insertBefore(document.createTextNode("\u200b"), li.firstChild.firstChild);
				range.setStart(li.firstChild, 1);
				range.collapse(true);
				zss_editor.currentSelection.setRange(range);
			} else if (start && range.startOffset > 0 && start.className && start.className.indexOf('record-list-tit') > -1 && e.keyCode != 8) {
				var recordList = start;
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				if ((start.lastChild.nodeType == 3 && start.lastChild.nodeValue != "​") || start.lastChild.nodeType == 1 && start.lastChild.nodeName != 'BR') {
					p.appendChild(start.lastChild);
					var prev = start.lastChild.previousSibling;
					while (prev) {
						if (prev.className && prev.className.indexOf('record-list-time') > -1) {
							break;
						} else {
							p.appendChild(start.lastChild);
						}
						prev = prev.previousSibling;
					}

					if (start.nextSibling) {
						start.parentNode.insertBefore(p, start.nextSibling);
					} else {
						start.parentNode.appendChild(p)
					}
					recordList.appendChild(document.createTextNode("​"))
					range.setStartAfter(p.lastChild);
					range.setEndAfter(p.lastChild);
					zss_editor.currentSelection.setRange(range);
				} else if (start.lastChild.nodeValue == "​") {
					// 设置粗体斜体下划线等样式再输入内容
					var prev = start.lastChild.previousSibling;
					while (prev) {
						if (prev.className && prev.className.indexOf('record-list-time') > -1) {
							break;
						} else {
							p.appendChild(start.lastChild);
						}
						prev = prev.previousSibling;
					}
					if (start.nextSibling) {
						start.parentNode.insertBefore(p, start.nextSibling);
					} else {
						start.parentNode.appendChild(p)
					}
					recordList.appendChild(document.createTextNode("​"))
					if (p.lastChild) {
						range.setStartAfter(p.lastChild);
						range.setEndAfter(p.lastChild);
						zss_editor.currentSelection.setRange(range);
					}

				}


			}
		}
	});
	//剪切
	$("#zss_editor_content").on('cut', function (e) {
		setTimeout(function () {
			normalList();
			zss_editor.undoManagerSave();
		}, 10)
	});
	$("#zss_editor_content").on('paste', function (e) {
		var pastedText = '';
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			pastedText = javaJs.onPasteEvent() || "";

		}
		if (isIOS) {
			if (window.webkit && window.webkit.messageHandlers.beginPaste) {
				window.webkit.messageHandlers.beginPaste.postMessage([]);
			} else {
				if (window["beginPaste"]) {
					window["beginPaste"]();
				}
			}
//             pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
//             if(pastedText.length > 0){
//		     	e.preventDefault();
//		     	document.execCommand('insertText', false, pastedText);
//		     }

			// ios12粘贴html
			if (e && e.originalEvent.clipboardData && e.originalEvent.clipboardData.types && e.originalEvent.clipboardData.getData) {
				var types = e.originalEvent.clipboardData.types;
				if (((types instanceof DOMStringList) && types.contains("text/html")) || (types.indexOf && types.indexOf('text/html') !== -1)) {
					pastedText = e.originalEvent.clipboardData.getData('text/html');
				} else if (((types instanceof DOMStringList) && types.contains("text/plain")) || (types.indexOf && types.indexOf('text/plain') !== -1)) {
					pastedText = e.originalEvent.clipboardData.getData('text/plain');
					//粘贴的多行非富文本 xxx \n xxx \n xxx 转成p
					pastedText = '<p>' + pastedText.replace(/\n/gi, '</p><p>') + '</p>';
				}

			}
		}
		if (pastedText.length != "") {
			e.preventDefault();
			//解决新版笔记粘贴到通知空行丢失的问题
			pastedText = pastedText.replace(/<\s*p[^>]*?><\/p>/gi, '<p><br></p>')
			// 匹配所有的style
			if (pastedText.indexOf('<div class="unfilter_css">') == -1 && pastedText.indexOf('<div class="xiumi">') == -1) {
				var styleReg = /style\s*?=\s*?(['"])[\s\S]*?\1/gi;
				pastedText = pastedText.replace(styleReg, function () {
					return zss_editor.matchcssPaste(arguments[0]);
				});
			}
			//匹配所有元素
			var eleReg = /<[^<>]+>/gi;
			pastedText = pastedText.replace(eleReg, function () {
				return zss_editor.matchelePaste(arguments[0]);
			});
			//20210409 去除 class = Apple-interchange-newline
			pastedText = pastedText.replace(/class\s*?=\s*?['"][^'"]*(Apple-interchange-newline)[^'"]*['"]/gi, function () {
				return arguments[0].replace(arguments[1], '')
			});
			//视频自定义标签替换回来2021.02.04
			var version2 = null;
			if (isIOS) {
				version2 = zss_editor.versionSame('4.8.4.4');
			}
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				version2 = zss_editor.versionSame('4.8.4.2');
			}
			if (version2) {
				var iframeReg = new RegExp('<\\s*span[^>]*?><ui-attachment[^>]*?>\\s*<\/ui-attachment><\/span>', 'gi');
				pastedText = pastedText.replace(iframeReg, function () {
					var str = arguments[0];
					str = str.replace(/<\s*span[^>]*?><ui-attachment/gi, '<iframe');
					str = str.replace(/<\/ui-attachment><\/span>/gi, '</iframe>');
					return str;
				})
			} else {
				var iframeReg = new RegExp('<\\s*div[^>]*?><ui-attachment[^>]*?>\\s*<\/ui-attachment><\/div>', 'gi');
				pastedText = pastedText.replace(iframeReg, function () {
					var str = arguments[0];
					str = str.replace(/<\s*div[^>]*?><ui-attachment/gi, '<iframe');
					str = str.replace(/<\/ui-attachment><\/div>/gi, '</iframe>');
					return str;
				})
			}

			pastedText = pastedText.replace(zss_editor.xssReg, function () {
				return arguments[0] + '　';
			})
			// pastedText = pastedText.replace(/\n/g,'<br>');
			pastedText = zss_editor.replaceIframeSrc(pastedText);
			//处理新笔记粘贴到老笔记
			var div = document.createElement('div');
			div.innerHTML = pastedText;
			div = removeForbidDownloadAttach(div)
			//去除新笔记图片的拖拽按钮和工具栏元素
			$(div).find('.cursor-div,.image_tools').remove()
			$(div).find('.image-wrap img').each(function(index,item){
				if(item.previousElementSibling && item.previousElementSibling.nodeName == 'BR'){
					$(item.previousElementSibling).remove()
				}
				$(item).unwrap()
			})
			//支持粘贴新笔记的附件
			$(div).find('.attachment_card').each(function(index,item){
				var module = $(item).attr('data-module');
				var attachmentName = JSON.parse(b64DecodeUnicode($(item).attr('data-name')||$(item).attr('name')))
				$(item).prop("attributes", null);
				var cid = zss_editor.randomUUID();
				item.setAttribute('cid', cid)
				attachmentName.cid = cid;
				var displayMode = $(item).attr('displaymode');
				if(displayMode && displayMode == 'previewMode' || $(item).hasClass('web-iframe')){
					//预览附件
					item.classList = 'editor-iframe';
					item.setAttribute('contenteditable','false')
					if(module == 'insertWeb'){
						src = attachmentName.att_web.url
					}
					item.innerHTML = '<div class="editor-iframe" contenteditable="false" element-id="'+zss_editor.getRandomId() +'"><iframe frameborder="0" scrolling="no" cid="' + attachmentName.cid + '"' +
						'src="' + src + '" name="' + b64EncodeUnicode(JSON.stringify(attachmentName)) + '"' +
						' class="attach-module attach-' + module + '" module="' + module + '" previewweb="true">' +
						'</iframe></div>'
				}else if(displayMode && displayMode == 'textMode'){
					//文本附件
					item.className = '';
					let src = '', linkClass = '',name = '';
					if(module == 'insertWeb'){
						src = attachmentName.att_web.url;
						name = attachmentName.att_web.title;
						linkClass = 'link';
					}else if(module == 'insertCloud'){
						src = attachmentName.att_clouddisk.downPath || ('https://d0.ananas.chaoxing.com/download/' + attachmentName.att_clouddisk.fileId);
						name = attachmentName.att_clouddisk.name;
						linkClass = 'iframe';
					}
					item.innerHTML = '<div element-id="'+zss_editor.getRandomId() +'"><a href="' + src + '" ' +
						'class="dynacALink ' + linkClass + '" target="_blank" module="' + module + '" ' +
						' name="' + b64EncodeUnicode(JSON.stringify(attachmentName)) + '" cid="' + attachmentName.cid + '">' + name + '</a></div>'
				}else{
					//卡片附件
					item.classList = 'editor-iframe';
					item.setAttribute('contenteditable','false')
					var attachmentSrc = module + '.html';
					if (zss_editor.editorWebType == true) {
						attachmentSrc = zss_editor.prefix + module + '.html#editorClientType=false';
					}
					item.innerHTML = '<div class="editor-iframe" contenteditable="false" element-id="'+zss_editor.getRandomId() +'"><iframe frameborder="0" scrolling="no" cid="' + attachmentName.cid + '"' +
						'src="' + attachmentSrc + '" name="' + b64EncodeUnicode(JSON.stringify(attachmentName)) + '"' +
						' class="attach-module attach-' + module + '" module="' + module + '">' +
						'</iframe></div>'
				}
				$(item.firstChild).unwrap()
			});
			//支持新笔记的列表
			$(div).find('ol[level][style]').each(function(index,item){
				item.removeAttribute('data-changed')
				if(item.style.counterReset){
					var serialnum = parseInt(item.style.counterReset.replace(/\D/g,'')) + 1;
					item.style.cssText = '';
					item.setAttribute('serialnum',serialnum)
					$(item).children().each(function(index,li){
						li.setAttribute('serialnum',serialnum + index)
					})
				}
			})
			//支持新笔记的勾选框
			$(div).find('div.todo_wrap').each(function(index,item){
				var checkedClass = ''
				if(item.className.indexOf('todo-checked') > -1){
					checkedClass = ' checked'
				}
				item.className = 'todo-view' + checkedClass;
				$(item).find('.todo-inner')[0].className = 'todo-text';
				$(item).find('.todo-inner').attr('contenteditable','false');
				if($(item).find('.todo-box')[0]){
					$(item).find('.todo-box')[0].innerHTML = '<span class="todo-inner"></span>';
					$(item).find('.todo-box')[0].className = 'todo-mark';
				}else if(!$(item).find('.todo-mark')[0]){
					$(item).prepend('<span class="todo-mark"><span class="todo-inner"></span></span>')
				}
			})
			//支持新笔记的代码块
			$(div).find('div.cm-editor').each(function(index,item) {
				item.innerHTML = '<pre><code>' + $(item).find('.cm-content').html().replace(/<\/div>/g,'\n').replace(/<[^>]+>/g,'') + '</code></pre>';
				$(item.firstChild).unwrap()
			})
			pastedText = div.innerHTML

			//给img包裹div
			pastedText = zss_editor.getClipboardData(pastedText);

			if (isIOS) {
				zss_editor.restoreRange();
			}

			zss_editor.insertHTML(pastedText);
			//删除通知群聊标记2021.04.28
			$(".chatGroupDivClass").remove();
			$('img').parent(".editor-image").attr("contenteditable", "false");
			$('iframe').parent(".editor-iframe").attr("contenteditable", "false");
			//解决图片丢失不可编辑属性
			$(".drag-image-wrap").attr("contenteditable", "false");
			var width = zss_editor.wWidth - 30;
			zss_editor.updateAllIframeWidth(width);
			//20210425旧列表改为新列表,兼容有序列表
//			normaloldlist();
			normalList();
			// 微信粘贴过来的是本地地址，客户端要下载替换成自己的，不能删除
			// $('img').error(function(){
			//          if($(this).parent().hasClass("editor-image")){
			//          		$(this).parent(".editor-image").remove();
			//          }else{
			//          		$(this).remove();
			//          }
			//       });
			//粘贴过来的附件没有删除按钮,调用isiframeClose
			setTimeout(function () {
				var iframes = document.querySelectorAll('iframe')
				for (var i = 0; i < iframes.length; i++) {
					if (iframes[i]) {
						var cid = iframes[i].getAttribute('cid');
						zss_editor.isiframeClose(cid);
					}
				}
				//通知粘贴后需要重新设置内容高度
				if ($("body").hasClass('editorNoticeWrap')) {
					//通知客户端实现滚动到焦点位置
					zss_editor.clientscrollToCursorPos();
				}

			}, 100);
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知图片加载完更新高度
				var img_length = $("#zss_editor_content img").length;
				var img_start = 1;
				$("#zss_editor_content img").load(function () {
					img_start++;
					if (img_start == img_length) {
						//通知客户端实现滚动到焦点位置
						zss_editor.updateHeight();
					}
				});
			}

		}
		zss_editor.undoManagerSave()

	});
	// 点击勾选框
	$('.editorWrap').on('touchstart', '.todo-mark', function (e) {
		e.stopPropagation();
		var bk = zss_editor.createBookmark();
		if ($(this).parents(".todo-view").is('.checked')) {
			$(this).parents(".todo-view").removeClass('checked')
		} else {
			$(this).parents(".todo-view").addClass('checked')
		}
		setTimeout(function () {
			zss_editor.moveToBookmark(bk);
		}, 100)
	});
	window.addEventListener('onorientationchange' in window?'orientationchange':'resize', function(){
		setTimeout(function(){
			//ipad旋转屏幕重新计算附件宽度
			if($("#zss_editor_content").find("iframe").length > 0){
				//var width = zss_editor.wWidth - 30;
				zss_editor.updateAllIframeWidth();
			}
		}, 200);
	},false)
};
zss_editor.randomUUID = function(){
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
//适配学习通选择字体大小
/*
* 0(0.875)
* 1(1)
* 2(1.125)
* 3(1.25)
* 4(1.5)
* */
zss_editor.changeFontsize = function (type) {
	var fontSizeClass = '';
	var h = $("#zss_editor_content").html();
	var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px", "g");
	if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
		fontSizeClass = 'cxSize' + type;
		h = h.replace(reg, function () {
			return zss_editor.fontsizeZoomIn(arguments[0], type);
		});
	}
	if (fontSizeClass != '') {
		$("#zss_editor_content").addClass(fontSizeClass);
		$("#zss_editor_content").html(h)
	}
}
zss_editor.isEnLanguage = function () {
	var language = (navigator.browserLanguage || navigator.language).toLowerCase();
	if (language.indexOf('en') > -1) {
		return true;
	}
	return false;
}
zss_editor.version = function () {
	//判断版本号
	if (navigator.userAgent.indexOf("ChaoXingStudy") > -1) {
		var ua = navigator.userAgent;
		ua = ua.substring(ua.indexOf("ChaoXingStudy"));
		ua = ua.substring(ua.indexOf("_") + 1);
		ua = ua.substring(ua.indexOf("_") + 1);
		ua = ua.substring(0, ua.indexOf("_"));
		var version = ua;
		if (isIOS) {
			if (version >= '4.2.4.1') {
				return true;
			}
		}
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			if (version >= '4.2.4.6') {
				return true;
			}
		}
	}

	return false;
}
zss_editor.versionSame = function (num) {
	//判断版本号
	if (navigator.userAgent.indexOf("ChaoXingStudy") > -1) {
		var ua = navigator.userAgent;
		ua = ua.substring(ua.indexOf("ChaoXingStudy"));
		ua = ua.substring(ua.indexOf("_") + 1);
		ua = ua.substring(ua.indexOf("_") + 1);
		ua = ua.substring(0, ua.indexOf("_"));
		var version = ua;
		if (version > num) {
			return true;
		}

	}

	return false;
}

zss_editor.getClipboardData = function (callback) {
	var doc = document;
	if (doc.getElementById('pastebin')) {
		return;
	}
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	//创建剪贴的容器div
	var pastebin = doc.createElement('div');
	pastebin.id = 'pastebin';
	// Safari 要求div必须有内容，才能粘贴内容进来
	pastebin.appendChild(doc.createTextNode("\u200b"));
	doc.body.appendChild(pastebin);
	pastebin.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:0;white-space:nowrap;top:0;opacity:0;";
	pastebin.innerHTML = callback;

	for (var i = 0, pastebins = doc.querySelectorAll('#pastebin'), pi; pi = pastebins[i++];) {
		if ($(pi).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(pi).find('img').length == 0 && $(pi).find('iframe').length == 0) {
			$(pi).remove();
		} else {
			pastebin = pi;
			break;
		}
	}

	// 详情页粘过来的#xxt_noteInfo区域内容删除
	$("#zss_editor_tit .tag").remove();
	//全选粘贴带标题粘贴的时候自动填充到笔记、话题、通知
	if (($("#pastebin .editor_title").length > 0 || $("#pastebin .pasteTitleNewCoop").length > 0) && ($("#zss_editor_tit").text() == '' || $("body").hasClass('editorNoticeWrap'))) {
		var $pasteNewTitle = '';
		if ($("#pastebin .pasteTitleNewCoop").length > 0) {
			$pasteNewTitle = $("#pastebin .pasteTitleNewCoop");
		} else {
			$pasteNewTitle = $("#pastebin .editor_title");
		}
		zss_editor.setTitle($pasteNewTitle.text());
		//粘贴通知有标题告诉客户端
		var isPasteTitle = false;
		if (isIOS) {
			isPasteTitle = zss_editor.versionSame('6.0.53');
		}
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			isPasteTitle = zss_editor.versionSame('6.0.52');
		}
		if (isPasteTitle) {
			zss_editor.dealPasteTitle($pasteNewTitle.text());
		}
		$pasteNewTitle.remove();
	}
	//$("#pastebin .editor_title").removeAttr('class');
	$("#pastebin .editor_main").removeAttr('class');
	$("#xxt_noteInfo").remove();
	$("#xxtSourceFile").remove();
	//去去除通知详情的noticeItem
	$("#pastebin .noticeItem").remove();
	$("#pastebin .noteInfo-group").remove();
	$("#pastebin .noticeHead").addClass('noticeHead-no');
	// 去除录音开启标记
	$("#pastebin .voiceBegin").removeClass('voiceBegin');
	//去除粘贴的id
	$("#pastebin *").not(".record-box").removeAttr("id");
	$("#pastebin").find('h1,h2,h3,h4,h5,h6,p,div').each(function () {
		$(this).attr('element-id', zss_editor.getRandomId());
	})

	//表格外面包裹div,实现固定宽度滑动查看表格2021.09.29
	$('#pastebin table').each(function () {
		var _this = $(this);
		if (!$(this).parent().hasClass("table")) {
			_this.wrapAll('<div class="table" element-id="' + zss_editor.getRandomId() + '"></div>');
		}
	})
// 	if(isIOS){
// 		// ios去掉粘贴的样式
// 		$("#pastebin *").removeAttr('style');
// 		$('#pastebin b').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin u').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin i').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin font').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin strong').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin em').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin s').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin a').each(function(){
//		    $(this).replaceWith('<span>'+$(this).html()+'</span>');
//		});
//		$('#pastebin h1,#pastebin h2,#pastebin h3,#pastebin h4,#pastebin h5,#pastebin h6').each(function(){
//		    $(this).replaceWith('<div>'+$(this).html()+'</div>');
//		});
//		$('#pastebin blockquote').each(function(){
//		    $(this).replaceWith('<div>'+$(this).html()+'</div>');
//		});
//
// 	}
	for (var i = 0, pastebins = doc.querySelectorAll('#pastebin img'), pi; pi = pastebins[i++];) {
		if (pi) {
			//ios替换粘贴的图片地址2020.12.24
			if (isIOS) {
				var src = pi.getAttribute('src');
				if (src.indexOf("imgtp://") != -1) {
					src.replace(/imgtp:\/\//gi, "http://");
					pi.setAttribute('src', src);
				} else if (src.indexOf("imgtps://") != -1) {
					src.replace(/imgtps:\/\//gi, "https://");
					pi.setAttribute('src', src);
				}
			}
			if (pi.parentNode && pi.parentNode.className.indexOf('editor-image') > -1) {
				pi.parentNode.setAttribute('element-id', zss_editor.getRandomId());
				if (pi.parentNode.previousSibling) {
					var sibling = pi.parentNode.previousSibling;
					if (sibling.nodeType == 1 && !sibling.firstChild) {
						// 图片外已经有class 为 editor-image 的 div 标签了，且前一个元素是块状元素,但为空,不占位	,里面加br占位
						sibling.innerHTML = '<br>';
					} else {
						//其他情况不处理
					}
				} else {
					//图片外面已经有class 为 editor-image 的 div 标签了,但前面没有br,图片标签外添加br
					var ele = document.createElement('div');
					ele.innerHTML = '<br>';
					var dom = ele.childNodes[0];
					pi.parentNode.parentNode.insertBefore(ele.firstChild, pi.parentNode);
				}
			} else {
				// 图片标签外添加div
				var ele = document.createElement('div');
				var elementId = zss_editor.getRandomId();
				ele.innerHTML = '<br><div class="editor-image" contenteditable="false" element-id="' + elementId + '"></div>';
				var dom = ele.childNodes[1];
				pi.parentNode.insertBefore(ele.firstChild, pi);
				pi.parentNode.insertBefore(ele.lastChild, pi);
				dom.appendChild(pi);
			}
			if (pi.getAttribute('src').indexOf("http") > -1 && pi.getAttribute('src').indexOf("p.ananas.chaoxing") < 0) {
				pi.setAttribute('_src', pi.getAttribute('src'));
				pi.setAttribute('src', '');
				pi.parentNode.classList.add("remoteImage");
			}
		}
	}
	for (var i = 0, pastebins = doc.querySelectorAll('#pastebin iframe'), pi; pi = pastebins[i++];) {
		if (pi) {
			try {
				var attachmentContent = JSON.parse(b64DecodeUnicode(pi.getAttribute('name')));
				if (attachmentContent.attachmentType == 15 && !(attachmentContent.att_chat_course.type && attachmentContent.att_chat_course.type == 4)) {
					//课程活动不允许复制
					pi.parentNode.parentNode.removeChild(pi.parentNode);
					continue
				}
			} catch (e) {

			}
			if (pi.parentNode && pi.parentNode.className.indexOf('editor-iframe') > -1) {
				pi.parentNode.setAttribute('element-id', zss_editor.getRandomId());
				if (pi.parentNode.previousSibling) {
					var sibling = pi.parentNode.previousSibling;
					if (sibling.nodeType == 1 && !sibling.firstChild) {
						// 图片外已经有class 为 editor-iframe 的 div 标签了，且前一个元素是块状元素,但为空,不占位	,里面加br占位
						sibling.appendChild(document.createElement('br'));
					} else {
						//其他情况不处理
					}
				} else {
					//图片外面已经有class 为 editor-iframe 的 div 标签了,但前面没有br,图片标签外添加br
					var ele = document.createElement('div');
					ele.appendChild(document.createElement('br'));
					var dom = ele.childNodes[0];
					pi.parentNode.parentNode.insertBefore(ele.firstChild, pi.parentNode);
				}
			} else {
				// 图片标签外添加div
				var ele = document.createElement('div');
				var elementId = zss_editor.getRandomId();
				ele.innerHTML = '<br><div class="editor-iframe" contenteditable="false" element-id="' + elementId + '"></div>';
				var dom = ele.childNodes[1];
				pi.parentNode.insertBefore(ele.firstChild, pi);
				pi.parentNode.insertBefore(ele.lastChild, pi);
				dom.appendChild(pi);
			}
		}
	}
	// 安卓粘贴附件经常不显示，加时间戳
	for (var i = 0, iframes = doc.querySelectorAll('#pastebin iframe'), pi; pi = iframes[i++];) {
		var src = pi.getAttribute('src').split('#')[0];
		//解决粘贴站内信系统自带本地地址2020.10.14
		if (isIOS && (src.indexOf("blob:null/") != -1 || src.indexOf("file:///") != -1)) {
			var module = pi.getAttribute('module').split('#')[0] + '.html';
			pi.setAttribute('src', module);
		} else {
			src = src + '#timestamp=' + (new Date()).getTime();
			pi.setAttribute('src', src);
		}
	}
	//最后一个元素是附件或图片的时候光标移不到最后，加换行
	zss_editor.noEditnextEmpty(pastebin);
	try {
		pastebin.parentNode.removeChild(pastebin);
	} catch (e) {
	}
	return pastebin.innerHTML;
}
//全选粘贴到通知，有标题告诉客户端
zss_editor.dealPasteTitle = function (title) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.dealPasteTitle(title);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.dealPasteTitle) {
			window.webkit.messageHandlers.dealPasteTitle.postMessage([title]);
		} else {
			if (window["dealPasteTitle"]) {
				window["dealPasteTitle"](title);
			}
		}
	}
};
//图片blob转为base642020.12.30
zss_editor.blobUrlTobase64data = function (src, position) {
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", src, true);
	xmlhttp.setRequestHeader('Content-type', 'image/jpg');
	xmlhttp.responseType = "blob";
	xmlhttp.onload = function () {
		if (this.status == 200) {
			var blobFile = this.response;
			var reader = new FileReader();
			reader.readAsDataURL(blobFile);
			reader.onloadend = function () {
				window.webkit.messageHandlers.readBlobImage.postMessage([reader.result, position]);
			}
		}
	}
	xmlhttp.send();
}

function ZSSField(wrappedObject) {
	this.wrappedObject = wrappedObject;
	this.bindListeners();
};
ZSSField.prototype.bindListeners = function () {
	var thisObj = this, ui = this.wrappedObject;
	var isTitle = (ui[0] === $("#zss_editor_tit")[0]);
	var isMarkdown = (ui[0] === $("#zss_editor_content")[0]);
	ui.bind('focus', function (e) {
		thisObj.handleFocusEvent(e);
	});
	ui.bind('blur', function (e) {
		thisObj.handleBlurEvent(e);
	});
	if (isMarkdown) {
		ui.bind('keydown', function (e) {
			thisObj.handleKeyDownEvent(e);
		});
	}
};
ZSSField.prototype.handleBlurEvent = function (e) {
	zss_editor.backupRange();
	zss_editor.focusedField = null;
};
ZSSField.prototype.handleFocusEvent = function (e) {
	zss_editor.backupRange();
	zss_editor.focusedField = this;
	var self = this.wrappedObject,
		elem = self[0];
	if (elem === $("#zss_editor_tit")[0]) {
		zss_editor.isFocusTitle(true);
	}
	if (elem === $("#zss_editor_content")[0]) {
		zss_editor.isFocusTitle(false);
		if ($("body").hasClass('editorNoticeWrap') && !stopUpdateScroll) {
			//通知客户端实现滚动到焦点位置
			setTimeout(zss_editor.clientscrollToCursorPos, 500);
		}
	}
};
//选中删除20200811
zss_editor.selectRangeDelete = function (range) {
	range.setStart(range.startContainer, range.startOffset);
	range.deleteContents();
	var start = range.startContainer;
	if (start.nodeType == 3) {
		start = start.parentNode;
	}
	//全选删除内容为空2021.07.15
	if ($(start).is("#zss_editor_content") && $(start).text() == '' && $(start).find('img').length == 0 && $(start).find('iframe').length == 0) {
		start.innerHTML = "<p><br></p>";
	}
	if (zss_editor.isNodeEmpty(start) && zss_editor.getprevNode(start) && zss_editor.getprevNode(start).getAttribute('contenteditable') && zss_editor.getprevNode(start).getAttribute('contenteditable') == 'false') {
		if ($(start).text() == '') {
			start.appendChild(document.createElement('br'));
		}
	}
	zss_editor.removeNullList();
	range.collapse(true);
	zss_editor.currentSelection.setRange(range);
	zss_editor.hasContent();
}
ZSSField.prototype.handleKeyDownEvent = function (e) {
	var self = this.wrappedObject,
		elem = self[0];
	//IMPORTANT: without this code, we can have text written outside of paragraphs...
	if (zss_editor.closerParentNode() == elem && $("#zss_editor_content").html().trim() == '') {
		document.execCommand('formatBlock', false, 'p');
		var listId = window.getSelection().focusNode;
		if (listId.nodeType == 3) {
			listId = listId.parentNode;
		}
		listId.setAttribute('element-id', 'init');
	}

	if (e.keyCode !== 8 && e.keyCode !== 13 && e.keyCode !== 229) return;

	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var target = $(range.startContainer);
	if (selection.rangeCount < 1) {
		self.focus();
		e.preventDefault();
		e.stopPropagation();
		return;
	}
	var tmpRange = range.cloneRange();
	var address = zss_editor.createAddress(tmpRange, false, true);
//	if(e.keyCode == 229 && isIOS && inputType == false){
//		setTimeout(function(){
//			zss_editor.backupRange();
//			normalList();
//			zss_editor.updateEnterRange();
//		},50)
//	}
	//全选删除
	if (!range.collapsed) {
		start = range.startContainer;
		startOffset = range.startOffset;
		end = range.endContainer;
		endOffset = range.endOffset;
		var frag = range.cloneContents();
		range.setStart(end, endOffset);
		zss_editor.currentSelection.setRange(range);
		if (e.keyCode == 229 || e.keyCode == 8) {
			e.preventDefault();
			//弹窗删除
			if ((frag.querySelector('img') || frag.querySelector('iframe') || frag.querySelector('.record-list-time')) && (zss_editor.version() || zss_editor.editorClientType == false)) {
				e.preventDefault();
				zss_editor.webConfirmFrag(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, range, start, startOffset, e);
			} else {
				zss_editor.selectRangeDelete(tmpRange);
				//20200629 协同编辑 全选删除
				if (zss_editor.cooperation) {
					var data = {};
					data.name = "delete";
					data.address = address;
					data.isCollapsed = "false";
					zss_editor.sendJoinData(data);
				}
			}
		}
	} else {
		// 删除li,光标定位在当前行
		var li = zss_editor.closerParentNodeWithName('li');
		var pre;
		//delete'&zwnj;'
		if (e.keyCode === 8 && range.startOffset > 0) {
			range = selection.getRangeAt(0).cloneRange();
			range.setStart(range.startContainer, range.startOffset - 1);
			var lastchar = range.toString();
			if (lastchar == "‌" || lastchar == "​") {
				document.execCommand('delete', 'false', null);
			}
		}
		if (e.keyCode === 8) {
			zss_editor.isSendDelete = false;
			range = selection.getRangeAt(0);
			var start = range.startContainer;
			if (start.nodeType == 3) {
				start = start.parentNode;
			}
			//20200811 课程教案--阻止删除课前课中课后
			var prev = zss_editor.getprevNode(start);
			if ((start.nodeType == 1 && range.startOffset == 0 || $(start).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(start).find('img').length == 0 && $(start).find('iframe').length == 0) && prev && $(prev).is('#ulTab')) {
				e.preventDefault();
			}
			if ($(start).is('#ulTab') || $(start).parents('#ulTab').length > 0) {
				e.preventDefault();
			}
			//列表后删除,解决当前行文字删除到上一行后文字没有合并到上一个p里面的问题
			if (range.collapsed) {
				range = zss_editor.shrinkBoundary();
				var start = zss_editor.findParentByTagName(range.startContainer, ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'caption', 'table'], true);
				if (start.nodeType == 1 && range.startOffset == 0 && start.innerText.trim() != '' && start.previousSibling && start.previousSibling.nodeType == 1 && (start.previousSibling.tagName == 'OL' || start.previousSibling.tagName == 'UL') && start.previousSibling.lastChild.lastChild && start.previousSibling.lastChild.lastChild.innerText.trim() != '') {
					e.preventDefault();
					var list = start.previousSibling;
					var p = list.lastChild.lastChild;
					if (p && zss_editor.isBlockElm(p)) {
						if (p.lastChild.tagName == 'BR' && p.lastChild.previousSibling && p.lastChild.previousSibling.nodeType == 3 && p.lastChild.previousSibling.nodeValue.trim() != '') {
							p.lastChild.remove();
						}
						range.setStartAfter(p.lastChild);
						range.collapse(true);
						while (start.firstChild) {
							p.appendChild(start.firstChild);
						}
						if (start) start.remove();
					}
					zss_editor.currentSelection.setRange(range);
					list.normalize();
					return;
				} else if (start.nodeType == 1 && range.startOffset == 0 && start.parentNode.tagName == 'LI' && start.innerText.trim() != '' && start.previousSibling && start.previousSibling.innerText.trim() != '' && start.previousSibling.nodeType == 1 && start.previousSibling.parentNode.tagName == 'LI') {
					e.preventDefault();
					var p = start.previousSibling;
					if (p.lastChild.tagName == 'BR' && p.lastChild.previousSibling && p.lastChild.previousSibling.nodeType == 3 && p.lastChild.previousSibling.nodeValue.trim() != '') {
						p.lastChild.remove();
					}
					range.setStartAfter(p.lastChild);
					range.collapse(true);
					while (start.firstChild) {
						p.appendChild(start.firstChild);
					}
					if (start) start.remove();
					zss_editor.currentSelection.setRange(range);
					p.normalize();
					return;
				}
			}
			var prev = start.previousSibling;
			if (start != li) {
				while (start.parentNode != li) { //start的父级是li时停止循环
					if (prev && prev.innerHTML == "" && (prev.nodeName != 'BR' || prev.nodeName != 'HR' || prev.nodeName != 'IMG' || prev.nodeName != 'INPUT')) { //存在prev,但prev是空节点，不占位
						prev = prev.previousSibling;
					} else if (prev) { //存在prev,不处理
						break;
					} else { //不存在prev
						start = start.parentNode;
						prev = start.previousSibling;
					}
				}
			}
			// 列表删除
			if (li && (range.startContainer == li || !prev) &&
				zss_editor.isStartInblock(range) &&
				(range.startOffset == 0 ||
					(range.startOffset == 1 && range.startContainer.childNodes.length == 1 && range.startContainer.firstChild.nodeName == 'BR') ||
					(range.startOffset == 1 && range.startContainer.firstChild && zss_editor.isFillChar(range.startContainer.firstChild)) ||
					(range.startOffset == 1 && range.startContainer.nodeType == 3 && range.startContainer.nodeValue.substr(0, 1).charCodeAt(0) == '8203')
				)) {
				if (zss_editor.cooperation) {
					var data = {};
					data.name = "delete";
					data.cmdName = "listDelete";
					data.address = zss_editor.createAddress(range, false, true);
					zss_editor.sendJoinData(data);
					zss_editor.isSendDelete = true;
				}
				e.preventDefault();
				zss_editor.listDelete(range, e);
			} else {

				//删除图片音频视频提示
				var range = selection.getRangeAt(0);
				if (zss_editor.version() || zss_editor.editorClientType == false) {
					var startoffset = range.startOffset;
					var start = range.startContainer;
					var prev = start.previousSibling;
					//20210508 prev为文本节点但页面上没有
					if (prev && prev.nodeType == 3 && prev.length == 0) {
						prev = null;
					}

					if (start.nodeType == 3 && (startoffset == 0 || (startoffset == 1 && start.data.substr(0, 1) == "​")) && !prev) { //<p>|xxxx</p>光标在文本最前面
						start = start.parentNode; // start为元素节点
						prev = start.previousSibling;
					} else if (start.nodeType == 3 && start.parentNode.getAttribute('id') == 'zss_editor_content') {  //content的直接文本元素，没有标签的文本
						var text = range.startContainer;
						start = start.parentNode;
						var p = document.createElement('p');
						//2022.05.11协同编辑加elementid
						p.setAttribute('element-id', zss_editor.getRandomId());
						start.insertBefore(p, text);
						p.appendChild(text);
						prev = p.previousSibling;
						range.setStart(text, startoffset);
						range.setEnd(text, startoffset);
						zss_editor.currentSelection.setRange(range);
					}
					if (start.nodeType == 1) {
						var delIndex;
						if (zss_editor.isStartInblock(range)) {
							var prev = start.previousSibling;
							//没有前一个元素往上找2021.06.09
							if (!prev) {
								prev = zss_editor.getPreBlockNode(start);
							}
							while (prev) {
								if (prev.nodeName == 'IMG') { //是图片
									e.preventDefault();
									var pos = $("#zss_editor_content img").index($(prev));
									zss_editor.webConfirm(zss_editor.deleteImage.text, zss_editor.deleteImage.delete, zss_editor.deleteImage.cancel, pos);
									break;
								} else if (prev.nodeName == 'IFRAME') { //是附件
									e.preventDefault();
									var pos = $("#zss_editor_content iframe").index($(prev));
									zss_editor.webConfirmIframe(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, pos);
									break;
								} else if (prev && prev.innerHTML == '' && (prev.nodeName != 'BR' || prev.nodeName != 'HR')) { //前一个元素为空，比如 <p></p>
									prev = prev.previousSibling;
								} else if (prev.lastChild) { //前一个元素有最后一个元素
									prev = prev.lastChild;
								} else {
									break;
								}
							}
						}
					}
					//列表后删除,解决当前行文字删除到上一行后文字没有合并到上一个p里面的问题
					var range = selection.getRangeAt(0);
					if (range.collapsed) {
						range = zss_editor.shrinkBoundary();
						var start = zss_editor.findParentByTagName(range.startContainer, ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'caption', 'table'], true);
						if (start.nodeType == 1 && range.startOffset == 0 && start.innerText.trim() != '' && start.previousSibling && start.previousSibling.nodeType == 1 && (start.previousSibling.tagName == 'OL' || start.previousSibling.tagName == 'UL') && start.previousSibling.lastChild.lastChild && start.previousSibling.lastChild.lastChild.innerText.trim() != '') {
							e.preventDefault();
							var list = start.previousSibling;
							var p = list.lastChild.lastChild;
							if (p && zss_editor.isBlockElm(p)) {
								range.setStartAfter(p.lastChild);
								range.collapse(true);
								while (start.firstChild) {
									p.appendChild(start.firstChild);
								}
								if (start) start.remove();
							}
							zss_editor.currentSelection.setRange(range);
							list.normalize();
							return;
						} else if (start.nodeType == 1 && range.startOffset == 0 && start.parentNode.tagName == 'LI' && start.innerText.trim() != '' && start.previousSibling && start.previousSibling.innerText.trim() != '' && start.previousSibling.nodeType == 1 && start.previousSibling.parentNode.tagName == 'LI') {
							e.preventDefault();
							var p = start.previousSibling;
							if (p.lastChild.tagName == 'BR' && p.lastChild.previousSibling && p.lastChild.previousSibling.nodeType == 3 && p.lastChild.previousSibling.nodeValue.trim() != '') {
								p.lastChild.remove();
							}
							range.setStartAfter(p.lastChild);
							range.collapse(true);
							while (start.firstChild) {
								p.appendChild(start.firstChild);
							}
							if (start) start.remove();
							zss_editor.currentSelection.setRange(range);
							p.normalize();
							return;
						}
					}
				}
				// 删除录音打点
				var range = selection.getRangeAt(0);
				var start = range.startContainer;

				if (start.nodeType == 3) {
					while (!zss_editor.isBlockElm(start)) {
						start = start.parentNode;
					}
				}
				if (start.nodeType == 1 && start.getAttribute('class') && start.getAttribute('class').indexOf('record-list-tit') > -1) { //删除标注标签和时间
					e.preventDefault();
					if (zss_editor.version() || zss_editor.editorClientType == false) {
						start.appendChild(document.createTextNode("​"));
						zss_editor.webConfirmRecordTime(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, start);
					} else {
						zss_editor.removeRecordTime(start);
					}
				} else if (start.nodeType == 1 && start.getAttribute('class') && start.getAttribute('class').indexOf('record-list-add') > -1) { //删除打点加号
					e.preventDefault();
					if (zss_editor.version() || zss_editor.editorClientType == false) {
						var tmpText = document.createTextNode("\u200b");
						start.after(tmpText);
						range.setStartAfter(tmpText);
						range.setEndAfter(tmpText);
						range.collapse(true);
						zss_editor.currentSelection.setRange(range);
						zss_editor.webConfirmRecordTime(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, start.parentNode);
					} else {
						zss_editor.removeRecordTime(start);
					}
				} else if (start.nodeType == 1 && range.startOffset == 0 && start.previousSibling && start.previousSibling.nodeType == 1 && start.previousSibling.getAttribute('class')
					&& start.previousSibling.getAttribute('class').indexOf('record-list-tit') > -1) {
					//删除标注内容
					e.preventDefault();
					if (start.nodeType == 3) {
						start = start.parentNode;
					}
					var startPrev = start.previousSibling;
					// if(start.innerHTML==''||start.innerHTML=='<br>'){ //标注内容是空
					// 	start.remove()
					// }
					if ($(start).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(start).find('img').length == 0 && $(start).find('iframe').length == 0) { //标注内容是空
						start.remove()
					}
					range.setStart(startPrev, startPrev.children.length);
					range.setEnd(startPrev, startPrev.children.length);
					zss_editor.currentSelection.setRange(range);

				} else if (start.nodeType == 1 && range.startOffset == 0 && start.previousSibling && start.previousSibling.nodeType == 1 && start.previousSibling.getAttribute('class')
					&& start.previousSibling.getAttribute('class').indexOf('cxCourseTitle') > -1) {//删除教案标题整块删除
					if (start.previousSibling.getAttribute('contenteditable') == 'false') {
						e.preventDefault();
						start.previousSibling.remove();
					}

				} else if (start.nodeType == 1 && range.startOffset == 0 && !start.previousSibling && start.parentNode.getAttribute('class')
					&& start.parentNode.getAttribute('class').indexOf('record-iframe') > -1) {
					e.preventDefault();
					startParent = start.parentNode; //record-iframe
					startParentParent = startParent.parentNode; //record-box
					nowstart = start;
					while (startParent.firstChild) {
						startParentParent.parentNode.insertBefore(startParent.firstChild, startParentParent);
					}
					startParent.remove();
					range.setStart(nowstart, 0);
					range.setEnd(nowstart, 0);
					zss_editor.currentSelection.setRange(range);
				} else if (start.nodeType == 1 && range.startOffset == 0 && !start.previousSibling && start.parentNode && start.parentNode.previousSibling && start.parentNode.previousSibling.nodeType == 1 && start.parentNode.previousSibling.getAttribute('class')
					&& start.parentNode.previousSibling.getAttribute('class').indexOf('cxCourseTitle') > -1) {
					if (start.parentNode.previousSibling.getAttribute('contenteditable') == 'false') {
						e.preventDefault();
						start.parentNode.previousSibling.remove();

					}

				} else if (start.nodeType == 1 && range.startOffset == 0 && start.previousSibling && start.previousSibling.nodeType == 1 && start.previousSibling.getAttribute('class') && start.previousSibling.getAttribute('class').indexOf('record-box') > -1) {
					//录音record-box后删除不允许删除，否则跳不出去
					if ($('.record-box').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('.record-box').find('img').length == 0 && $('.record-box').find('iframe').length == 0) {
						//内容为空,不阻止,删除
					} else {
						e.preventDefault();
					}

				} else if (start.nodeType == 1 && range.startOffset == 0 && start == start.parentNode.lastChild && start.parentNode.getAttribute('class') && start.parentNode.getAttribute('class').indexOf('record-list') > -1) {
					//标注内容最后一行
					if ($(start).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(start).find('img').length == 0 && $(start).find('iframe').length == 0) {
						if (start.previousSibling && !start.previousSibling.getAttribute('contenteditable')) {
							e.preventDefault();
							if (start.previousSibling && start.previousSibling.nodeType == 1) {
								range.setStartAfter(start.previousSibling.lastChild);
								range.setEndAfter(start.previousSibling.lastChild);
							} else if (start.previousSibling) {
								range.setStartAfter(start.previousSibling);
								range.setEndAfter(start.previousSibling);
							}
							zss_editor.currentSelection.setRange(range);
							start.remove();
						}
					}
				} else if (start.nodeType == 1 && zss_editor.isBlockElm(start) && range.startOffset == 0 && ($(start).is(".todo-text") || $(start).parents(".todo-text").length > 0)) {//删除勾选框
					e.preventDefault();
					//协同编辑勾选框删除
					if (zss_editor.cooperation) {
						var data = {};
						data.name = 'delete';
						data.cmdName = 'todoListDelete';
						data.address = zss_editor.createAddress(range, false, true);
						zss_editor.sendJoinData(data);
						zss_editor.isSendDelete = true;
					}
					//掉勾选框删除
					zss_editor.todoListDelete(range);

				} else if (start.nodeType == 1 && range.startOffset == 0 && ($(start).is('p') || $(start).parents('p').length > 0)) { //删除断开的内容，该列表下面的序号能再继续编号。

					var bk = zss_editor.createBookmark();
					var p;
					if ($(start).parents('p').length > 0) {
						p = $(start).parents('p')[$(start).parents('p').length - 1]
					} else {
						p = start;
					}
					zss_editor.moveToBookmark(bk);
				}

			}


		}

		if (e.keyCode === 13) {
			var start = range.startContainer;
			if (start.nodeType == 3) {
				start = start.parentNode;
			}
			zss_editor.isSendEnter = false;
			var div = zss_editor.closerParentNodeWithName('div');
			if (div) {
				if (div.getAttribute('class') && div.getAttribute('class').indexOf('record-list-tit') > -1) {
					e.preventDefault();
					var divNew = document.createElement('div');
					//2022.05.11协同编辑加elementid
					divNew.setAttribute('element-id', zss_editor.getRandomId());
					divNew.appendChild(document.createTextNode("\u200b"));
					$(div).after(divNew);
					range.setStart(divNew, 0);
					range.setEnd(divNew, 0);
					zss_editor.currentSelection.setRange(range);
				}
				// 去除教案换行后的默认添加的class
				if (div.getAttribute('class') && div.getAttribute('class').indexOf('cxCourseTitle') > -1) {
					e.preventDefault();
					var divNew = document.createElement('div');
					//2022.05.11协同编辑加elementid
					divNew.setAttribute('element-id', zss_editor.getRandomId());
					divNew.appendChild(document.createTextNode("\u200b"));
					$(div).after(divNew);
					range.setStart(divNew, 0);
					range.setEnd(divNew, 0);
					zss_editor.currentSelection.setRange(range);
				}
			}
			// 转发空行focusStart换行去除class
			range = selection.getRangeAt(0);
			var focusStart = $(range.startContainer);
			var pack;
			if (focusStart.is('.focusStart') || focusStart.parents('.focusStart').length > 0) {
				if (focusStart.is('.focusStart')) {
					pack = focusStart;
				} else {
					pack = focusStart.parents('.focusStart');
				}
				if ($(pack).prev().hasClass('focusStart')) {
					$(pack).prev().removeClass('focusStart')
				}
				if ($(pack).next().hasClass('focusStart')) {
					$(pack).next().removeClass('focusStart')
				}
			}
			//       if(focusStart.is('.cxCourseCon') || focusStart.parents('.cxCourseCon').length > 0){
			//      	e.preventDefault();
			//      	var tmpText =  document.createElement("br");

			// range.insertNode(tmpText);
			// range.setStartAfter(tmpText);
			// range.setEndAfter(tmpText);
			// zss_editor.currentSelection.setRange(range);
			// zss_editor.insertHTML('\u200B');

			//      }

			var li = zss_editor.closerParentNodeWithName('li');
			if (li) {
				e.preventDefault();
				var newId = zss_editor.getRandomId();
				//协同编辑列表换行2020.06.24
				if (zss_editor.cooperation) {
					var data = {};
					data.name = 'enter';
					data.cmdName = 'listEnter';
					parent = zss_editor.findParent(range.startContainer, function (node) {
						return zss_editor.isBlockElm(node)
					}, true)
					data.preId = parent ? parent.getAttribute('element-id') : null;
					data.elementId = newId;
					data.address = zss_editor.createAddress(range, false, false);
					zss_editor.sendJoinData(data);
					zss_editor.isSendEnter = true;
				}
				zss_editor.listEnter(range, e, newId)
//		        return;
			}
			var todo = zss_editor.closerParentNodeWithName('.todo-view');
			if (todo) {
				e.preventDefault();
				var newId = zss_editor.getRandomId();
				range = selection.getRangeAt(0).cloneRange();
				//协同编辑勾选框换行2020.06.28
				if (zss_editor.cooperation) {
					var data = {};
					data.name = 'enter';
					data.cmdName = 'todoListEnter';
					data.elementId = newId;
					data.address = zss_editor.createAddress(range, false, false);
					zss_editor.sendJoinData(data);
					zss_editor.isSendEnter = true;
				}
				zss_editor.todoListEnter(range, e, newId);

			}
			//20200811 课堂笔记 -- 换行
			if ($(focusStart).is('.classConBefore') || $(focusStart).is('.classConCenter') || $(focusStart).is('.classConAfter')) {
				e.preventDefault();
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				p.appendChild(document.createTextNode("\u200b"));
				$(focusStart).append(p);
				range.setStart(p, 0);
				range.setEnd(p, 0);
				zss_editor.currentSelection.setRange(range);
			}
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				setTimeout(zss_editor.clientscrollToCursorPos, 50);
			} else {
				//脚本实现滚动到焦点位置
				setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 50);
			}
			zss_editor.enabledEditingItems(e);
		}

	}
};
//ios九宫格换行2020.10.13
zss_editor.iosOtherListEnter = function () {
	zss_editor.restoreRange();
	zss_editor.isSendEnter = false;
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var div = zss_editor.closerParentNodeWithName('div');
	if (div) {
		if (div.getAttribute('class') && div.getAttribute('class').indexOf('record-list-tit') > -1) {
			var divNew = document.createElement('div');
			//2022.05.11协同编辑加elementid
			divNew.setAttribute('element-id', zss_editor.getRandomId());
			divNew.appendChild(document.createTextNode("\u200b"));
			$(div).after(divNew);
			range.setStart(divNew, 0);
			range.setEnd(divNew, 0);
			zss_editor.currentSelection.setRange(range);
		}
		// 去除教案换行后的默认添加的class
		if (div.getAttribute('class') && div.getAttribute('class').indexOf('cxCourseTitle') > -1) {
			var divNew = document.createElement('div');
			//2022.05.11协同编辑加elementid
			divNew.setAttribute('element-id', zss_editor.getRandomId());
			divNew.appendChild(document.createTextNode("\u200b"));
			$(div).after(divNew);
			range.setStart(divNew, 0);
			range.setEnd(divNew, 0);
			zss_editor.currentSelection.setRange(range);
		}
	}
	// 转发空行focusStart换行去除class
	range = selection.getRangeAt(0);
	var focusStart = $(range.startContainer);
	var pack;
	if (focusStart.is('.focusStart') || focusStart.parents('.focusStart').length > 0) {
		if (focusStart.is('.focusStart')) {
			pack = focusStart;
		} else {
			pack = focusStart.parents('.focusStart');
		}
		if ($(pack).prev().hasClass('focusStart')) {
			$(pack).prev().removeClass('focusStart')
		}
		if ($(pack).next().hasClass('focusStart')) {
			$(pack).next().removeClass('focusStart')
		}
	}
	var li = zss_editor.closerParentNodeWithName('li');
	var todo = zss_editor.closerParentNodeWithName('.todo-view');
	if (li) {
		var newId = zss_editor.getRandomId();
		//协同编辑列表换行2020.06.24
		if (zss_editor.cooperation) {
			var data = {};
			data.name = 'enter';
			data.cmdName = 'listEnter';
			parent = zss_editor.findParent(range.startContainer, function (node) {
				return zss_editor.isBlockElm(node)
			}, true)
			data.preId = parent ? parent.getAttribute('element-id') : null;
			data.elementId = newId;
			data.address = zss_editor.createAddress(range, false, false);
			zss_editor.sendJoinData(data);
			zss_editor.isSendEnter = true;
		}
		zss_editor.listEnter(range, '', newId)
		return;
	} else if (todo) {
		var newId = zss_editor.getRandomId();
		range = selection.getRangeAt(0).cloneRange();
		//协同编辑勾选框换行2020.06.28
		if (zss_editor.cooperation) {
			var data = {};
			data.name = 'enter';
			data.cmdName = 'todoListEnter';
			data.elementId = newId;
			data.address = zss_editor.createAddress(range, false, false);
			zss_editor.sendJoinData(data);
			zss_editor.isSendEnter = true;
		}
		zss_editor.todoListEnter(range, '', newId);

	} else if ($(focusStart).is('.classConBefore') || $(focusStart).is('.classConCenter') || $(focusStart).is('.classConAfter')) {
		var p = document.createElement('p');
		//2022.05.11协同编辑加elementid
		p.setAttribute('element-id', zss_editor.getRandomId());
		p.appendChild(document.createTextNode("\u200b"));
		$(focusStart).append(p);
		range.setStart(p, 0);
		range.setEnd(p, 0);
		zss_editor.currentSelection.setRange(range);
	} else {
		var newId = zss_editor.getRandomId();
		var nowEle = range.startContainer;
		if (nowEle.nodeType == 3) {
			while (!zss_editor.isBlockElm(nowEle)) {
				nowEle = nowEle.parentNode;
			}
		}
//		var p = document.createElement('p');
//      p.appendChild( document.createTextNode("\u200b") );
//      $(nowEle).after(p);
//      range.setStart(p,0);
//      range.setEnd(p,0);
//      zss_editor.currentSelection.setRange(range);
		var span = document.createElement('span');
		range.insertNode(span);
		zss_editor.breakParent(span, nowEle);
		var nextEle = span.nextSibling;
		first = nextEle.firstChild;
		if (!first || nextEle.innerHTML == '') {
			nextEle.appendChild(document.createElement('br'));
		}
		if (first) {
			nextEle.setAttribute('element-id', newId);

			while (first && first.nodeType == 1 && first.nodeName != 'BR' && first.nodeName != 'HR') {
				if (first && first.innerHTML == "") {
					//内联元素插入零宽字符，否则换行多个空行
					if (!zss_editor.isBlockElm(first)) {
						first.appendChild(document.createTextNode("\u200b"));
					} else {
						//插入零宽字符和br粘贴列表会自动排序
						first.appendChild(document.createElement('br'));
					}
					break;
				}
				first = first.firstChild;
			}
		}
		var pre = span.previousSibling;
		if (pre && pre.innerHTML == '') {
			pre.appendChild(document.createTextNode("\u200b"));
		}
		range.setStart(nextEle, 0);
		range.setEnd(nextEle, 0);
		zss_editor.currentSelection.setRange(range);
		span.parentNode.removeChild(span);
	}
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知客户端实现滚动到焦点位置
		zss_editor.clientscrollToCursorPos();
	} else {
		//脚本实现滚动到焦点位置
		zss_editor.calculateEditorHeightWithCaretPosition();
	}
}
//列表换行
zss_editor.listEnter = function (range, e, newId, preId) {
	var parentNode;
	var start = range.startContainer;
	if (start.nodeType == 3 && start.parentNode.nodeName != 'LI') { //文本节点且父级不是li
		start = start.parentNode;
	}
	var li = zss_editor.findParent(range.startContainer, function (node) {
		return node.tagName == 'LI'
	}, true);
	var list = zss_editor.findParent(range.startContainer, function (node) {
		return node.tagName == 'OL' || node.tagName == 'UL'
	}, true);
	var parent = zss_editor.findParentByTagName(range.startContainer, ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'caption', 'table'], true);
	var level = parseInt(list.getAttribute('level'));

	var prev = start.previousSibling;
	while (start.parentNode != li) { //start的父级是li时停止循环
		if (prev && prev.innerHTML == "" && (prev.nodeName != 'BR' || prev.nodeName != 'HR' || prev.nodeName != 'IMG' || prev.nodeName != 'INPUT')) { //存在prev,但prev是空节点，不占位
			prev = prev.previousSibling;
		} else if (prev) { //存在prev,不处理
			break;
		} else { //不存在prev
			start = start.parentNode;
			prev = start.previousSibling;
		}
	}

	// li内容为空或光标在内容前序号后换行,向前一级,如果是一级,取消序号,顶头显示
	if (!prev && (start.nodeType == 1 && range.startOffset == 0) ||
		(zss_editor.isStartInblock(range) && range.startOffset == 1 && parent && parent.parentNode == li && !parent.previousSibling && range.startContainer.nodeType == 3 && range.startContainer.nodeValue.substr(0, 1).charCodeAt(0) == '8203') ||
		($(li).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(li).find('img').length == 0 && $(li).find('iframe').length == 0) || ($(li).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && start.nodeType == 1 && range.startOffset == 1)) {
		if (range.collapsed && li && list && level > 1) {
			if (level < 6) {
				list.setAttribute('level', --level);
				if (list.tagName == 'OL') {
					outdentlist(list);
				}
			}
			normalList();
			return;
		} else {
			//列表为一级
			if (list.getAttribute('data-origin-start') || list.getAttribute('data-start')) {
				//找到下一个list,(level一致，serialnum+1)
				var level = list.getAttribute('level');
				var serialnum = addSerialNum(list.getAttribute('serialnum'), level);
				var listnext = list.nextSibling;
				while (listnext) {
					if ((listnext.nodeName == 'OL' || listnext.nodeName == 'UL') && listnext.getAttribute('level') == level && (listnext.getAttribute('data-start') || listnext.getAttribute('data-origin-start'))) {
						break;
					} else if (listnext.tagName == 'OL' && listnext.getAttribute('level') == level && listnext.getAttribute('serialnum') == serialnum) {
						if (list.getAttribute('data-origin-start')) {
							listnext.setAttribute('data-origin-start', list.getAttribute('data-origin-start'));
						} else {
							listnext.setAttribute('data-start', list.getAttribute('data-start'));
						}
						listnext.setAttribute('serialnum', list.getAttribute('serialnum'));
						listnext.firstChild.setAttribute('serialnum', list.getAttribute('serialnum'))
						break;
					} else {
						listnext = listnext.nextSibling;
					}
				}
			}

			var listnext = list.nextSibling;
			//处理ol下有其他li的情况
			var linext = li.nextSibling;
			while (linext) {
				var newlist = document.createElement(list.tagName);
				//2022.05.11协同编辑加elementid
				newlist.setAttribute('element-id', zss_editor.getRandomId());
				newlist.appendChild(linext);
				newlist.setAttribute('level', list.getAttribute('level'));
				if (list.tagName == 'OL') {
					newlist.setAttribute('serialnum', linext.getAttribute('serialnum'));
				}
				list.parentNode.insertBefore(newlist, listnext);
				linext = li.nextSibling;
			}
			listnext = list.nextSibling;
			while (li.firstChild) {
				if (listnext) {
					list.parentNode.insertBefore(li.firstChild, listnext);
				} else {
					list.parentNode.appendChild(li.firstChild)
				}
			}
			//20210430退出列表后光标丢失
			range.setStart(list.nextSibling, 0);
			range.collapse(true);
			list.remove();
			zss_editor.currentSelection.setRange(range);
			normalList();
			return;
		}
	} else {
		//文字后换行

		var first = li.firstChild;
		if (!first || !zss_editor.isBlockElm(first)) {
			var start = range.startOffset;
			var con = range.startContainer;
			var p = document.createElement('p');
			p.setAttribute('element-id', preId);
			if (!li.firstChild) {
				p.appendChild(document.createElement('br'));
				//p.appendChild( document.createTextNode("\u200b") );
			}
			;
			while (li.firstChild) {
				p.appendChild(li.firstChild);
			}
			li.appendChild(p);
			range.setStart(con, start);
			range.setEnd(con, start);
			zss_editor.currentSelection.setRange(range);
			first = p;
		}
		var nowEle = range.startContainer;
		if (nowEle.nodeType == 3) {
			while (!zss_editor.isBlockElm(nowEle)) {
				nowEle = nowEle.parentNode;
			}
		}
		//解决列表下两个附件之间换行如果是8203当前空行会保留，变成br不会保留
		if (nowEle.previousSibling && nowEle.previousSibling.nodeType == 1 && nowEle.previousSibling.getAttribute('contenteditable') == 'false') {
			if ($(nowEle).text() == "​") {
				nowEle.appendChild(document.createElement('br'));
			}
		}
		var span = document.createElement('span');
		range.insertNode(span);
		zss_editor.breakParent(span, li.parentNode);
		var nextList = span.nextSibling;

		//列表改版
		var serialstr, serialnum, level = nextList.getAttribute('level');
		if (nextList.tagName.toLowerCase() == 'ol') {
			serialstr = li.getAttribute('serialnum');
			nextList.setAttribute('serialnum', addSerialNum(serialstr, level));
			nextList.firstChild.setAttribute('serialnum', addSerialNum(serialstr, level));
		}
		nextList.removeAttribute('data-origin-start');
		nextList.removeAttribute('data-start');
		first = nextList.firstChild.firstChild; //p

		if (first && first.nodeType == 1 && first.childNodes.length == 0) {
			first.appendChild(document.createElement('br'));
			//first.appendChild( document.createTextNode("\u200b") );
		}
		if (!first) {
			var p = document.createElement('p');
			//2022.05.11协同编辑加elementid
			p.setAttribute('element-id', zss_editor.getRandomId());
			p.appendChild(document.createElement('br'));
			//p.appendChild( document.createTextNode("\u200b") );
			nextList.firstChild.appendChild(p);
			first = p;
		}
		//20210430 纠正光标位置,加8203
		if (first) {
			first.setAttribute('element-id', newId);
			while (first && first.nodeType == 1 && first.nodeName != 'BR' && first.nodeName != 'HR') {
				if (first && first.innerHTML.trim() == "") {
					//内联元素插入零宽字符，否则换行多个空行
					if (!zss_editor.isBlockElm(first)) {
						first.appendChild(document.createTextNode("\u200b"));
					} else {
						//插入零宽字符和br粘贴列表会自动排序
						$(first).empty();
						first.appendChild(document.createTextNode("\u200b"));
						first.appendChild(document.createElement('br'));
					}
					break;
				} else if (first && first.innerHTML.trim() == "<br>") {
					//p里只有br的情况
					$(first).empty();
					first.appendChild(document.createTextNode("\u200b"));
					first.appendChild(document.createElement('br'));
				}
				first = first.firstChild;
			}
		}
		if (first.nodeType == 3) {
			first = first.parentNode;
		}
		if (first.firstChild && zss_editor.isFillChar(first.firstChild)) {
			range.setStart(first, 1);
			range.setEnd(first, 1);
		} else {
			range.setStart(first, 0);
			range.setEnd(first, 0);
		}
		zss_editor.currentSelection.setRange(range);
		span.parentNode.removeChild(span);
		var pre = nextList.previousSibling;
		if (pre && pre.nodeName == 'LI' && $(pre).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(pre).find('img').length == 0 && $(pre).find('iframe').length == 0) {
			var prep = document.createElement('p');
			//2022.05.11协同编辑加elementid
			prep.setAttribute('element-id', zss_editor.getRandomId());
			pre.appendChild(prep);
			pre.firstChild.appendChild(document.createTextNode("\u200b"));
		}
		if (prev && prev.nodeType == 1 && prev.getAttribute('contenteditable') && prev.getAttribute('contenteditable') == 'false') {
			if (prev.nextSibling) {
				if (!prev.nextSibling.firstChild && zss_editor.isBlockElm(prev.nextSibling)) {
					prev.nextSibling.appendChild(document.createTextNode("\u200b"));
					prev.nextSibling.appendChild(document.createElement("br"));
				} else if (!zss_editor.isBlockElm(prev.nextSibling)) {
					var p = document.createElement('p');
					//2022.05.11协同编辑加elementid
					p.setAttribute('element-id', zss_editor.getRandomId());
					prev.parentNode.insertBefore(p, prev.nextSibling);
					p.appendChild(prev.nextSibling);
				}
			} else {
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				p.appendChild(document.createTextNode("\u200b"));
				p.appendChild(document.createElement("br"));
				prev.parentNode.appendChild(p)
			}
		}
		//换行设置li的样式是最后一个标签的样式
		// if(range.startContainer.nodeType == 1 && range.startContainer.nodeName == 'SPAN' && range.startContainer.style.cssText){
		// 	nextLi.style.cssText=range.startContainer.style.cssText;
		// }
		normalList();
		return;
	}

}
zss_editor.isStartInblock = function (range) {
	var tmpRange = range.cloneRange(),
		flag = 0,
		start = tmpRange.startContainer,
		tmp;
	if (start.nodeType == 1 && start.childNodes[tmpRange.startOffset]) {
		start = start.childNodes[tmpRange.startOffset];
		var pre = start.previousSibling;
		while (pre && zss_editor.isFillChar(pre)) {
			start = pre;
			pre = pre.previousSibling;
		}
	}
	if (zss_editor.isFillChar(start, true) && tmpRange.startOffset == 1) {
		tmpRange.setStartBefore(start);
		start = tmpRange.startContainer;
	}

	while (start && zss_editor.isFillChar(start)) {
		tmp = start;
		start = start.previousSibling
	}
	if (tmp) {
		tmpRange.setStartBefore(tmp);
		start = tmpRange.startContainer;
	}
	if (start.nodeType == 1 && zss_editor.isEmptyNode(start) && tmpRange.startOffset == 1) {
		tmpRange.setStart(start, 0)
		tmpRange.collapse(true);
	}
	while (!tmpRange.startOffset) {
		start = tmpRange.startContainer;
		if (zss_editor.isBlockElm(start) || zss_editor.isBody(start)) {
			flag = 1;
			break;
		}
		var pre = tmpRange.startContainer.previousSibling,
			tmpNode;
		if (!pre) {
			tmpRange.setStartBefore(tmpRange.startContainer);
		} else {
			while (pre && zss_editor.isFillChar(pre)) {
				tmpNode = pre;
				pre = pre.previousSibling;
			}
			if (tmpNode) {
				tmpRange.setStartBefore(tmpNode);
			} else {
				tmpRange.setStartBefore(tmpRange.startContainer);
			}
		}
	}
	return flag && !zss_editor.isBody(tmpRange.startContainer) ? 1 : 0;
}
//列表删除
zss_editor.listDelete = function (range, e) {
	var parentNode;
	var li = zss_editor.findParentByTagName(range.startContainer, 'li', true);
	var list = zss_editor.findParentByTagName(range.startContainer, ['ol', 'ul'], true);
	var start = range.startContainer;
	if (start.nodeType == 3 && start.parentNode.nodeName != 'LI') { //文本节点且父级不是li
		start = start.parentNode;
	}
	if (list.getAttribute('data-origin-start') || list.getAttribute('data-start')) {
		//找到下一个list,(level一致，serialnum+1)
		var level = list.getAttribute('level');
		var serialnum = addSerialNum(list.getAttribute('serialnum'), level);
		var listnext = list.nextSibling;
		while (listnext && (listnext.tagName == 'OL' || listnext.tagName == 'UL')) {
			if (listnext.getAttribute('level') == level && (listnext.getAttribute('data-start') || listnext.getAttribute('data-origin-start'))) {
				break;
			} else if (listnext.tagName == 'OL' && listnext.getAttribute('level') == level && listnext.getAttribute('serialnum') == serialnum) {
				if (list.getAttribute('data-origin-start')) {
					listnext.setAttribute('data-origin-start', list.getAttribute('data-origin-start'));
				} else {
					listnext.setAttribute('data-start', list.getAttribute('data-start'));
				}
				listnext.setAttribute('serialnum', list.getAttribute('serialnum'));
				listnext.firstChild.setAttribute('serialnum', list.getAttribute('serialnum'))
				break;
			} else {
				listnext = listnext.nextSibling;
			}
		}
	}

	var start = li.firstChild;
	if (!zss_editor.isBlockElm(start)) {
		var p = document.createElement('p');
		//2022.05.11协同编辑加elementid
		p.setAttribute('element-id', zss_editor.getRandomId());
		li.insertBefore(p, start);
		p.appendChild(start);
		start = p;
	}

	var listnext = list.nextSibling;
	//处理ol下有其他li的情况
	var linext = li.nextSibling;
	while (linext) {
		var newlist = document.createElement(list.tagName);
		//2022.05.11协同编辑加elementid
		newlist.setAttribute('element-id', zss_editor.getRandomId());
		newlist.appendChild(linext);
		newlist.setAttribute('level', list.getAttribute('level'));
		if (list.tagName == 'OL') {
			newlist.setAttribute('serialnum', linext.getAttribute('serialnum'));
		}
		list.parentNode.insertBefore(newlist, listnext);
		linext = li.nextSibling;
	}
	listnext = list.nextSibling;
	while (li.firstChild) {
		if (listnext) {
			list.parentNode.insertBefore(li.firstChild, listnext);
		} else {
			list.parentNode.appendChild(li.firstChild);
		}
	}
	list.remove();
	range.setStart(start, 0);
	range.setEnd(start, 0);
	zss_editor.currentSelection.setRange(range);
	normalList();
	return;
}
zss_editor.todoListEnter = function (range, e, newId) {
	var start = range.startContainer;
	if (start.nodeType == 3) {
		start = start.parentNode;
	}
	var todoList = zss_editor.findParents(start, false, function (node) {
		return node.className && node.className.indexOf('todo-view') > -1
	}, true);
	var todo = todoList[0];
	var todoText = $(todo).find(".todo-text");
	if (todoText.text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && todoText.find('img').length == 0 && todoText.find('iframe').length == 0) {
		var div = document.createElement('div');
		div.setAttribute('element-id', newId);
		while (todoText.firstChild) {
			div.appendChild(todoText.firstChild);
		}
		if (div && div.childNodes.length == 0) {
			div.appendChild(document.createElement('br'));
		}
		todo.parentNode.insertBefore(div, todo);
		todo.remove();
		range.setStart(div, 0);
		range.setEnd(div, 0);
		zss_editor.currentSelection.setRange(range);
	} else {
		var span = document.createElement('span');
		range.insertNode(span);
		zss_editor.breakParent(span, todo);
		var nextLi = span.nextSibling;
		if (!nextLi.getAttribute('element-id')) {
			nextLi.setAttribute('element-id', newId);
		}
		nextLi.classList.remove("checked");
		first = nextLi.firstChild;
		var todoMark = '<span class="todo-mark" contenteditable="false">' +
			'<span class="todo-inner"></span>' +
			'</span>';
		first.parentNode.insertBefore($(todoMark)[0], first);
		if (first && first.childNodes.length == 0) {
			first.appendChild(document.createElement('br'));
			// first.appendChild( document.createTextNode("\u200b") );
		}
		if (!first) {
			var p = document.createElement('p');
			p.setAttribute('element-id', zss_editor.getRandomId());
			p.appendChild(document.createElement('br'));
			// p.appendChild( document.createTextNode("\u200b") );
			nextLi.appendChild(p);
			first = p;
		}
		if (first) {
			while (first && first.nodeType == 1 && first.nodeName != 'BR' && first.nodeName != 'HR') {
				if (first && first.innerHTML == "") {
					//2022.05.11协同编辑加elementid
					first.setAttribute('element-id', zss_editor.getRandomId());
					//内联元素插入零宽字符，否则换行多个空行
					if (!zss_editor.isBlockElm(first)) {
						first.appendChild(document.createTextNode("\u200b"));
					} else {
						first.appendChild(document.createElement('br'));
					}
					break;
				}
				first = first.firstChild;
			}
		}
		range.setStart(first, 0);
		range.setEnd(first, 0);
		zss_editor.currentSelection.setRange(range);
		span.parentNode.removeChild(span);
		var pre = nextLi.previousSibling;
		if (pre && $(pre).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(pre).find('img').length == 0 && $(pre).find('iframe').length == 0) {
			var prevTodoText = $(pre).find(".todo-text")[0];
			if (prevTodoText && $(prevTodoText).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(prevTodoText).find('img').length == 0 && $(prevTodoText).find('iframe').length == 0) {
				var prevTodoTextp = document.createElement('p');
				//2022.05.11协同编辑加elementid
				prevTodoTextp.setAttribute('element-id', zss_editor.getRandomId());
				prevTodoText.appendChild(prevTodoTextp);
				prevTodoText.firstChild.appendChild(document.createTextNode("\u200b"));
			}

		}
	}
}
zss_editor.todoListDelete = function (range) {
	var start = range.startContainer;
	if (start.nodeType == 3) {
		start = start.parentNode;
	}
	if ($(start).parents(".todo-text").length > 0) {
		// startParent = $(start).parents(".todo-text")[$(start).parents(".todo-text").length-1];
		startParent = $(start).parents(".todo-text")[0];
	} else {
		startParent = start;
	}
	startParentParent = startParent.parentNode;
	if (startParentParent.id == 'zss_editor_content') return;
	nowstart = start;
	zss_editor.remove(startParent.previousSibling);
	while (startParent.firstChild) {
		startParentParent.parentNode.insertBefore(startParent.firstChild, startParentParent);
	}
	zss_editor.remove(startParentParent);
	range.setStart(nowstart, 0);
	range.setEnd(nowstart, 0);
	zss_editor.currentSelection.setRange(range);
}

//上一个元素是否是图片、音频、视频
zss_editor.getlastDeleteObject = function (e, prev) {
	var prevClass;
	if (prev.nodeType == 1) {
		prevClass = prev.getAttribute('class');
		if (prev.getAttribute('contenteditable') == 'false' && prevClass && (prevClass.indexOf('editor-image') > -1 || prevClass.indexOf('editor-iframe') > -1)) {
			e.preventDefault();
			if (prevClass.indexOf('editor-image') > -1) {
				var pos = $("#zss_editor_content img").index($(prev).find("img"));
				zss_editor.webConfirm(zss_editor.deleteImage.text, zss_editor.deleteImage.delete, zss_editor.deleteImage.cancel, pos);
			}
			if (prevClass.indexOf('editor-iframe') > -1) {
				var pos = $("#zss_editor_content .editor-iframe").index($(prev));
				zss_editor.webConfirmIframe(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, pos);
			}
		} else if (prevClass && (prevClass.indexOf('template_class') > -1)) {
			e.preventDefault();
			var pos = $("#zss_editor_content .template_class").index($(prev));
			zss_editor.webConfirmTemplate(zss_editor.deleteTemplate.text, zss_editor.deleteTemplate.delete, zss_editor.deleteTemplate.cancel, pos);
		} else { //前一个元素的最后一个元素是图片或音视频 <p>xxx<div class="editor-image"></div></p>
			var prevlast = prev.lastChild;
			while (prevlast != prev.firstChild) { //循环到prev的第一个元素截止
				var prevlastClass;
				if (!prevlast) {
					break;
				}
				if (prevlast.nodeType == 1) {
					prevlastClass = prevlast.getAttribute('class');
					if (prevlast.getAttribute('contenteditable') == 'false' && prevlastClass && (prevlastClass.indexOf('editor-image') > -1 || prevlastClass.indexOf('editor-iframe') > -1)) {
						e.preventDefault();
						if (prevlastClass.indexOf('editor-image') > -1) {
							var pos = $("#zss_editor_content img").index($(prev).find("img"));
							zss_editor.webConfirm(zss_editor.deleteImage.text, zss_editor.deleteImage.delete, zss_editor.deleteImage.cancel, pos);
						}
						if (prevlastClass.indexOf('editor-iframe') > -1) {
							var pos = $("#zss_editor_content .editor-iframe").index($(prev));
							zss_editor.webConfirmIframe(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, pos);
						}
						break;
					} else if (prevlast.nodeName == 'IMG') {
						e.preventDefault();
						var pos = $("#zss_editor_content img").index($(prev));
						zss_editor.webConfirm(zss_editor.deleteImage.text, zss_editor.deleteImage.delete, zss_editor.deleteImage.cancel, pos);
						break;
					} else if (prevlast && prevlast.innerHTML == '' && (prevlast.nodeName != 'BR' || prevlast.nodeName != 'HR')) {
						prevlast = prevlast.previousSibling;
					} else {
						prevlast = prevlast.lastChild;
					}
				} else {
					break;
				}

			}
		}
	}
}
zss_editor.breakParent = function (node, parent) {
	var tmpNode,
		parentClone = node,
		clone = node,
		leftNodes,
		rightNodes;
	do {
		parentClone = parentClone.parentNode;
		if (leftNodes) {
			tmpNode = parentClone.cloneNode(false);
			tmpNode.appendChild(leftNodes);
			leftNodes = tmpNode;
			tmpNode = parentClone.cloneNode(false);
			tmpNode.appendChild(rightNodes);
			rightNodes = tmpNode;
		} else {
			leftNodes = parentClone.cloneNode(false);
			rightNodes = leftNodes.cloneNode(false);
		}
		while (tmpNode = clone.previousSibling) {
			leftNodes.insertBefore(tmpNode, leftNodes.firstChild);
		}
		while (tmpNode = clone.nextSibling) {
			rightNodes.appendChild(tmpNode);
		}
		clone = parentClone;
	} while (parent !== parentClone);
	tmpNode = parent.parentNode;
	tmpNode.insertBefore(leftNodes, parent);
	tmpNode.insertBefore(rightNodes, parent);
	tmpNode.insertBefore(node, rightNodes);
	var elementId = parent.getAttribute('element-id')
	parent.parentNode.removeChild(parent);
	//20220511 协同编辑 加id
	if (leftNodes && zss_editor.isBlockElm(leftNodes)) {
		leftNodes.setAttribute('element-id', elementId);
	}
	if (rightNodes && zss_editor.isBlockElm(rightNodes)) {
		rightNodes.setAttribute('element-id', zss_editor.getRandomId());
	}
	return node;
}
zss_editor.isBlockElm = function (node) {
	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		address: 1,
		blockquote: 1,
		center: 1,
		dir: 1,
		div: 1,
		section: 1,
		dl: 1,
		fieldset: 1,
		form: 1,
		h1: 1,
		h2: 1,
		h3: 1,
		h4: 1,
		h5: 1,
		h6: 1,
		hr: 1,
		isindex: 1,
		menu: 1,
		noframes: 1,
		ol: 1,
		p: 1,
		pre: 1,
		table: 1,
		ul: 1,
		li: 1
	});
	return node.nodeType == 1 && dtd[node.tagName];
}
zss_editor.clearEmptySibling = function (node, ignoreNext, ignorePre) {
	function clear(next, dir) {
		var tmpNode;
		while (next && !zss_editor.isBookmarkNode(next) && (zss_editor.isEmptyInlineElement(next) || !new RegExp('[^\t\n\r' + '​' + ']').test(next.nodeValue))) {
			//这里不能把空格算进来会吧空格干掉，出现文字间的空格丢掉了
			tmpNode = next[dir];
			next.parentNode.removeChild(next);
			next = tmpNode;
		}
	}

	!ignoreNext && clear(node.nextSibling, 'nextSibling');
	!ignorePre && clear(node.previousSibling, 'previousSibling');
}
zss_editor.isEmptyInlineElement = function (node) {
	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		a: 1,
		abbr: 1,
		acronym: 1,
		address: 1,
		b: 1,
		bdo: 1,
		big: 1,
		cite: 1,
		code: 1,
		del: 1,
		dfn: 1,
		em: 1,
		font: 1,
		i: 1,
		ins: 1,
		label: 1,
		kbd: 1,
		q: 1,
		s: 1,
		samp: 1,
		small: 1,
		span: 1,
		strike: 1,
		strong: 1,
		sub: 1,
		sup: 1,
		tt: 1,
		u: 1,
		'var': 1
	});
	if (node.nodeType != 1 || !dtd[node.tagName]) {
		return 0;
	}
	node = node.firstChild;
	while (node) {
		//如果是创建的bookmark就跳过
		if (zss_editor.isBookmarkNode(node)) {
			return 0;
		}
		if (node.nodeType == 1 && !zss_editor.isEmptyInlineElement(node) || node.nodeType == 3 && !zss_editor.isWhitespace(node)) {
			return 0;
		}
		node = node.nextSibling;
	}
	return 1;

}
zss_editor.moveToBookmark = function (bookmark) {
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var start = bookmark.id ? document.getElementById(bookmark.start) : bookmark.start,
		end = bookmark.end && bookmark.id ? document.getElementById(bookmark.end) : bookmark.end;
	range.setStartBefore(start);
	start.parentNode.removeChild(start);
	if (end) {
		range.setEndBefore(end);
		end.parentNode.removeChild(end);
	} else {
		//range.setStart(range.startContainer,range.startOffset);
		range.collapse(true);
	}
	zss_editor.currentSelection.setRange(range);
	return range;
}
zss_editor.createBookmark = function (serialize, same, tmpRange) {
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	if (tmpRange) {
		range = tmpRange
	}
	var endNode,
		startNode = document.createElement('span');
	startNode.style.cssText = 'display:none;line-height:0px;';
	startNode.appendChild(document.createTextNode('\u200B'));
	startNode.id = '_bookmark_start_' + (same ? '' : zss_editor.guid++);

	if (!range.collapsed) {
		endNode = startNode.cloneNode(true);
		endNode.id = '_bookmark_end_' + (same ? '' : zss_editor.guid++);
	}
	range.insertNode(startNode);
	if (endNode) {
		range.collapse();
		range.insertNode(endNode);
		range.setEndBefore(endNode);
		zss_editor.currentSelection.setRange(range);
	}
	range.setStartAfter(startNode);
	zss_editor.currentSelection.setRange(range);
	return {
		start: serialize ? startNode.id : startNode,
		end: endNode ? serialize ? endNode.id : endNode : null,
		id: serialize
	}
}
zss_editor.isBookmarkNode = function (node) {
	return node.nodeType == 1 && node.id && /^_bookmark_/i.test(node.id);
}
zss_editor.getFocusedField = function () {
	if (zss_editor.focusedField) return zss_editor.focusedField;

	var currentField = $(this.closerParentNodeWithName('.field'));
	if (!currentField) return null;

	var currentFieldId = currentField.attr('id');
	return this.editableFields[currentFieldId];
	// var currentField = $(this.closerParentNodeWithName('div'));
	//    var currentFieldId = currentField.attr('id');

	//    while (currentField
	//           && (!currentFieldId || this.editableFields[currentFieldId] == null)) {
	//        currentField = this.closerParentNodeStartingAtNode('div', currentField);
	//        if(currentField) {
	//            currentFieldId = currentField.attr('id');
	//        }
	//    }

	//    // 这么恶心
	//    var field = this.editableFields[currentFieldId];
	//    if (!field) {
	//        return this.editableFields['zss_field_content'];
	//    }
	//    return field;
};
zss_editor.closerParentNode = function () {
	var parentNode = null;
	var selection = window.getSelection();
	var range = selection.getRangeAt(0).cloneRange();

	// For Input
	var currentNode;
	if (range.startContainer.nodeType === document.ELEMENT_NODE && range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
		currentNode = range.startContainer.childNodes[range.startOffset];
		if (!currentNode || !currentNode.nodeType || currentNode.nodeType !== document.ELEMENT_NODE) {
			currentNode = range.commonAncestorContainer;
		}
	} else {
		currentNode = range.commonAncestorContainer;
	}

	while (currentNode) {
		if (currentNode.nodeType == document.ELEMENT_NODE) {
			parentNode = currentNode;

			break;
		}

		currentNode = currentNode.parentElement;
	}

	return parentNode;
};
zss_editor.closerParentNodeStartingAtNode = function (nodeName, startingNode) {

	nodeName = nodeName.toLowerCase();

	var parentNode = null;
	var currentNode = startingNode, parentElement;

	while (currentNode) {

		if (currentNode.nodeName == document.body.nodeName) {
			break;
		}

		if (currentNode.nodeName && currentNode.nodeName.toLowerCase() == nodeName
			&& currentNode.nodeType == document.ELEMENT_NODE) {
			parentNode = currentNode;

			break;
		}

		currentNode = currentNode.parentElement;
	}

	return parentNode;
};
zss_editor.closerParentNodeWithName = function (nodeName) {
	var selection = window.getSelection();
	if (selection.rangeCount <= 0) return null;
	var range = selection.getRangeAt(0).cloneRange();
	var currentNode = $(range.commonAncestorContainer);

	if (currentNode.is(nodeName)) return currentNode[0];
	var parentNode = currentNode.parents(nodeName);
	if (parentNode.length > 0) return parentNode[0];
	return null;
};
zss_editor.getSelectedNode = function () {
	var node, selection;
	if (window.getSelection) {
		selection = getSelection();
		node = selection.anchorNode;
	}
	if (!node && document.selection) {
		selection = document.selection
		var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
		node = range.commonAncestorContainer ? range.commonAncestorContainer :
			range.parentElement ? range.parentElement() : range.item(0);
	}
	if (node) {
		return (node.nodeName == "#text" ? node.parentNode : node);
	}
};
zss_editor.isHeadOfCaption = function (target, current) {
	if (target.is(current)) return true;
	var parent = current.parent();
	if (parent.is(target)) {
		if (target[0].childNodes[0] === current[0]) {
			return true;
		} else {
			return false;
		}
	} else {
		return zss_editor.isHeadOfCaption(target, parent);
	}
};
zss_editor.backupRange = function () {
	zss_editor.currentSelection.update();
};
zss_editor.restoreRange = function () {
	zss_editor.currentSelection.restore();
};
zss_editor.restoreRangeIosApp = function () {
	zss_editor.currentSelection.restoreIosApp();
};
zss_editor.updateOffset = function () {
	if (!zss_editor.updateScrollOffset)
		return;

	var offsetY = $(window).scrollTop();

	var footer = $('#zss_editor_footer');

	var maxOffsetY = footer.offset().top - zss_editor.contentHeight;

	if (maxOffsetY < 0)
		maxOffsetY = 0;

	if (offsetY > maxOffsetY) {
		window.scrollTo(0, maxOffsetY);
	}

};
zss_editor.getCaretYPosition = function () {
	var selection = window.getSelection();
	if (selection.rangeCount <= 0) return 0;
	var range = selection.getRangeAt(0);
	var span = document.createElement("span");
	range.collapse(false);
	//确保获取尺寸位置,添加零宽度空格字符
	span.appendChild(document.createTextNode("\u200b"));
	range.insertNode(span);
	var y = $(span).offset().top;
	var spanParent = span.parentNode;
	spanParent.removeChild(span);

	// 将任何损坏的文本节点粘合在一起
	spanParent.normalize();

	return y;
};
zss_editor.getYCaretInfo = function () {
	var selection = window.getSelection();
	var noSelectionAvailable = selection.rangeCount == 0;

	if (noSelectionAvailable) {
		return this.getCaretYPosition();
	} else {

		var y = 0;
		var range = selection.getRangeAt(0);
		var needsToWorkAroundNewlineBug = (range.getClientRects().length == 0);

		//问题：iOS似乎在获取某些空节点的偏移量并返回时遇到问题
		// 0 (zero) as the selection range top offset.
		//替代方法：要解决此问题，我们使用不同的方法来获取Y位置。
		if (needsToWorkAroundNewlineBug) {
			y = this.getCaretYPosition();
		} else {
			if (range.getClientRects) {
				var rects = range.getClientRects();
				if (rects.length > 0) {
					//问题：一些iOS版本与getClientRects（）返回的内容不同
					//某些版本从页面顶部返回偏移量，其他一些版本返回从可见视口的顶部偏移。
					//替代方法：查看正文顶部的偏移量是否为负值。 如果是那么这意味着我们所拥有的偏移量是相对于身体顶部的，我们应该添加滚动偏移量。
					var addsScrollOffset = document.body.getClientRects()[0].top < 0;
					if (addsScrollOffset) {
						y = Math.abs(document.body.getClientRects()[0].top);//document.body.scrollTop;
					}
					if (zss_editor.selectionchangeDirection == 0) {
						y += rects[rects.length - 1].top;
					} else {
						y += rects[0].top;
					}


				}
			}
		}
		if (zss_editor.contentInsetOffset > 0) {
			return y + zss_editor.contentInsetOffset;
		} else {
			return y + zss_editor.contentInsetOffet;
		}

	}
};
zss_editor.calculateEditorHeightWithCaretPosition = function () {
	//解决标题不执行滚动到焦点位置2022.02.18
	var focuseId = zss_editor.getFocusedField();
	if (focuseId != null) {
		focuseId = focuseId.wrappedObject;
		if (focuseId[0] === $("#zss_editor_tit")[0]) {
			return;
		}
	}
	var padding = 47;
	var c = zss_editor.getYCaretInfo();

	var editor = $('#zss_editor_content');
	var offsetY = $(window).scrollTop();

	var height = zss_editor.contentHeight;
	var newPos = window.pageYOffset;
	if (c < offsetY) {
		newPos = c;
	} else if (c > (offsetY + height - padding)) {
		newPos = c - height + padding - 15;
	}

	var mHeight = $(window).height() - $('#zss_editor_content').offset().top;
	var realHeight = $('#zss_editor_content').height() + 24; //因为$('#zss_editor_content').height()是不包含上下padding的
	var max_ScrollY = realHeight - mHeight;

	if (isIOS) {
		if (newPos < max_ScrollY && newPos != window.pageYOffset) {
			window.scrollTo(0, newPos);
		}
	} else {
		window.scrollTo(0, newPos);
	}
};
zss_editor.scrollToCursorPos = function () {
	//解决标题不执行滚动到焦点位置2022.02.18
	var focuseId = zss_editor.getFocusedField();
	if (focuseId != null) {
		focuseId = focuseId.wrappedObject;
		if (focuseId[0] === $("#zss_editor_tit")[0]) {
			return;
		}
	}
	var cursorPos = zss_editor.getYCaretInfo() - $(document).scrollTop();
//    console.log("光标位置："+cursorPos);
	var windowHeight = $(window).height();
//    console.log("窗口高度："+windowHeight);
	if (cursorPos - windowHeight > -30) {
		window.scrollBy(0, cursorPos - windowHeight + 30);
	}
};
// 焦点是否在标题中
zss_editor.isFocusTitle = function (status) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.isFocusTitle(status);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.isFocusTitle) {
			window.webkit.messageHandlers.isFocusTitle.postMessage([status]);
		} else {
			if (window["isFocusTitle"]) {
				window["isFocusTitle"](status);
			}
		}
	}
};

//判断内容是否为空
zss_editor.hasContent = function () {
	if ($('#zss_editor_tit').text().replace(/\s+/g, "") == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
		zss_editor.isExistContent(false);
	} else {
		zss_editor.isExistContent(true);
	}
}
//调客户端方法传内容是否为空的状态
zss_editor.isExistContent = function (status) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.isExistContent(status);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.isExistContent) {
			window.webkit.messageHandlers.isExistContent.postMessage([status]);
		} else {
			if (window["isExistContent"]) {
				window["isExistContent"](status);
			}
		}
	}
};
//判断编辑器内容是否为空,false是没内容,true是有内容
zss_editor.hasEditorContent = function () {
	if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
		return false;
	} else {
		return true;
	}
}
// 标题最多200字
zss_editor.showHint = function (c) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.showHint(c);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.showHint) {
			window.webkit.messageHandlers.showHint.postMessage([c]);
		} else {
			if (window["showHint"]) {
				window["showHint"](c);
			}
		}
	}
};
// 替换图片
zss_editor.updateImage = function (url, position, alt, w, h) {
	//zss_editor.restoreRange();
	var imageNode = $("#zss_editor_content img").eq(position);
	imageNode.attr("src", url);
	imageNode.attr("data-original", url);
	imageNode.removeClass("remoteImage");
	if (isIOS) {
		imageNode.attr("data-src", "");
	}
	imageNode.attr("objectid", alt);
	if (imageNode.attr("data-width") && !!w && imageNode.attr("data-height") && !!h) {
		imageNode.attr("data-width", w).attr("data-height", h);
	}
	this.enabledEditingItems();
};
//协同编辑替换图片地址
zss_editor.updateImageUrl = function (url, alt) {
	//zss_editor.restoreRange();
	$("#zss_editor_content img").each(function () {
		var newAlt = $(this).attr("objectid");
		if (newAlt == alt) {
			$(this).attr("src", url);
			$(this).attr("data-original", url);
			// 协同编辑替换图片地址
			if (zss_editor.cooperation || zss_editor.editorClientType == false) {
				$(this).parent().removeAttr("style");
				$(this).parent().find(".loadingDiv").remove();
				if (zss_editor.cooperation) {
					var elementId = $(this).parent().attr('element-id');
					var data = {};
					data.name = 'replace';
					data.elementId = elementId;
					data.html = $(this).prop("outerHTML");
					zss_editor.sendJoinData(data);
				}

			}
		}
	});
	this.enabledEditingItems();
};
// 替换图片objectId
zss_editor.updateImageObjectId = function (url, alt) {
	//zss_editor.restoreRange();
	$("#zss_editor_content img").each(function () {
		var src = $(this).attr("src");
		if (src == url) {
			$(this).attr("objectid", alt)
		}
	});
};
//获取所有图片objectId和地址
zss_editor.getImageObjectIdAddUrl = function () {
	var allImageInfor = [];
	$("#zss_editor_content img").each(function () {
		var obj = {};
		obj.objectid = $(this).attr("objectid") || "";
		obj.src = $(this).attr("src") || "";
		allImageInfor.push(obj);
	});
	return JSON.stringify(allImageInfor);
};
//粘贴图片失败替换成失败展示图
zss_editor.updateFailImage = function (alt, position) {
	if (!!alt) {
		var imageNode = $("#zss_editor_content img[objectid=" + alt + "]");
	} else if (!!position || position == 0) {
		var imageNode = $("#zss_editor_content img").eq(position);
	}
	if (imageNode) {
		imageNode.attr("src", "images/img_fail.jpg");
	}
	this.enabledEditingItems();
};
zss_editor.jumpAfterTodo = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var elementId = zss_editor.getRandomId();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;

		if (node.is('.todo-view') || node.parents('.todo-view').length > 0) {
			if (node.is('.todo-view')) {
				pack = node;
			} else {
				pack = node.parents('.todo-view');
			}
		}
		if (node.is('.template_class') || node.parents('.template_class').length > 0) {
			if (node.is('.template_class')) {
				pack = node;
			} else {
				pack = node.parents('.template_class');
			}
		}
		if (pack && pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			if (node.previousSibling && node.previousSibling.classList && node.previousSibling.classList.contains("voiceBegin")) {
				pack = $("<p class='voiceBegin' element-id='" + elementId + "'>\u200B</p>")[0];
			} else {
				pack = $("<p>\u200B</p element-id='" + elementId + "'>")[0];
			}
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
zss_editor.jumpAfterImage = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var elementId = zss_editor.getRandomId();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.editor-image')) {
			pack = node;
		} else {
			pack = node.parents('.editor-image');
		}
		if (pack && pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			if (node.previousSibling && node.previousSibling.classList && node.previousSibling.classList.contains("voiceBegin")) {
				pack = $("<p class='voiceBegin' element-id='" + elementId + "'>\u200B</p>")[0];
			} else {
				pack = $("<p element-id='" + elementId + "'>\u200B</p>")[0];
			}
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
zss_editor.jumpAfterList = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var elementId = zss_editor.getRandomId();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('ol') || node.parents('ol').length > 0) {
			if (node.is('ol')) {
				pack = node;
			} else {
				pack = node.parents('ol');
			}
		}
		if (node.is('ul') || node.parents('ul').length > 0) {
			if (node.is('ul')) {
				pack = node;
			} else {
				pack = node.parents('ul');
			}
		}
		if (node.is('blockquote') || node.parents('blockquote').length > 0) {
			if (node.is('blockquote')) {
				pack = node;
			} else {
				pack = node.parents('blockquote');
			}
		}
		if (node.is('.todo-view') || node.parents('.todo-view').length > 0) {
			if (node.is('.todo-view')) {
				pack = node;
			} else {
				pack = node.parents('.todo-view');
			}
		}
		if (pack && pack.length > 0) {
			node = pack[pack.length - 1];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			pack = $("<p element-id='" + elementId + "'>\u200B</p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
//录音开始后创建标记，打点后插入到00里
zss_editor.isVoiceBegin = function () {
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		if ((node.is('.voiceBegin') || node.parents('.voiceBegin').length > 0) && node.parents('ul').length == 0 && node.parents('ol').length == 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
//协同笔记还原插入图片
zss_editor.reduceImage = function (data) {
	var range = window.getSelection().getRangeAt(0);
	range = zss_editor.moveToAddress(range, data.address);
	zss_editor.currentSelection.setRange(range);
	var html = data.html;
	zss_editor.jumpAfterTodo();
	if (zss_editor.isemptyP()) {
		zss_editor.insertHTML('\u200B');
	}
	zss_editor.insertHTML(html, range);
	$('.editor-image').attr('contenteditable', false);
	zss_editor.enabledEditingItems();
	zss_editor.jumpAfterImage();
}

//文件大小格式
function sizeformat(bytes) {
	if (bytes / 1024 > 1) {
		if (bytes / (1024 * 1024 * 1024) > 1) {
			return "" + (bytes / (1024 * 1024 * 1024)).toFixed(1) + "GB";
		} else if (bytes / (1024 * 1024) > 1) {
			return "" + (bytes / (1024 * 1024)).toFixed(1) + "MB";
		} else {
			return "" + parseInt(bytes / 1024) + "KB";
		}
	} else {
		return "" + bytes + "B";
	}
}

//重新上传图片
zss_editor.reuploadImage = function (obj) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.reuploadImage(obj);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.reuploadImage) {
			window.webkit.messageHandlers.reuploadImage.postMessage([obj]);
		} else {
			if (window["reuploadImage"]) {
				window["reuploadImage"](obj);
			}
		}
	}
}
//图片上传进度alt为图片唯一objectid，val进度条当前的大小，size指总的大小,status为0代表失败
zss_editor.updateImgProgress = function (alt, progressVal, progressSize, status) {
	var img = $("#zss_editor_content img[objectid=" + alt + "]");
	var imagediv = img.parent();
	var radial = imagediv.find('.circleChart-inner')
	var radialObj;

	if (!radial.data('radialIndicator')) {
		radial.radialIndicator({
			barBgColor: 'transparent',
			barColor: '#0099ff',
			barWidth: 6,
			radius: 44,
			initValue: 0,
			fontSize: 24,
			fontColor: '#FFFFFF',
			fontWeight: '300',
			roundCorner: true,
			percentage: true,
		});
	}
	radialObj = radial.data('radialIndicator');
	$(imagediv).find(".circleChart").show();
	$(imagediv).find(".circleChartMask").show();
	$(imagediv).find(".loadingDiv").removeClass('loading');
	var progress = parseInt((progressVal / progressSize) * 100);
	if (status == 0) {
		$(imagediv).find('.loadingDiv').addClass('loading-chat-fail').removeClass('loading');
		$(imagediv).find(".circleChart").hide();
		$(imagediv).find(".circleChartMask").hide();
	} else if (progress == 100) {
		radialObj.animate(progress);
		setTimeout(function () {
			$(imagediv).find(".loadingDiv").remove();
		}, 200)
	} else if (progress >= 0) {
		$(imagediv).find(".circleChart").show();
		$(imagediv).find(".circleChartMask").show();
		$(imagediv).find(".loadingDiv").removeClass('loading').removeClass("loading-chat-fail");
		radialObj.animate(progress);
	}
}
// 插入图片
zss_editor.insertImage = function (url, alt, width, height, isrecovery, data) {
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
		if ($("#zss_editor_content").text().trim() == '') {
			zss_editor.focusEditor();
		} else {
			zss_editor.restoreRange();
		}
	} else {
		zss_editor.restoreRange();
	}

	var objectid = !!alt ? (' objectid="' + alt + '"') : '';
	var data_width = !!width ? (' data-width="' + width + '"') : '';
	var data_height = !!height ? (' data-height="' + height + '"') : '';
	//2022.05.11协同编辑加elementid
	var divelementId = zss_editor.getRandomId();
	if (!isrecovery && zss_editor.cooperation || zss_editor.editorWebType == true) {//发数据
		var range = window.getSelection().getRangeAt(0);
		var tmpRange = range.cloneRange();
		if (!!width && !!height) {
			var winwidth = $(window).width() - 30;
			var node = $(range.startContainer);
			if (node.parents('.record-iframe').length > 0) {
				var wid = winwidth - 8;
			} else if (node.parents('.record-box').length > 0) {
				var wid = winwidth - 20;
				if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
					wid = wid - 26;
				}
			} else if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
				var wid = winwidth - 26;
			} else {
				var wid = winwidth;
			}
			var imgW1 = width;
			var imgH1 = height;
			var imgW2 = wid;
			if (imgW1 < imgW2) {
				imgW2 = imgW1;
			}
			var imgH2 = parseInt(imgW2 * imgH1 / imgW1);
		} else {
			var imgW2 = "0";
			var imgH2 = "0";
		}
		var loadinghtml = '<div class="loadingDiv loading" id="' + alt + '">' +
			'<div class="circleChartMask"></div>' +
			'<div class="circleChart">' +
			'<div class="circleChart-bg"></div>' +
			'<div class="circleChart-inner"></div>' +
			'</div>' +
			'<div class="loading-waiting"></div>' +
			'<div class="loading-chat-txt clearfix"><span class="loading-txt-aside">上传失败！点击重新上传</span><span class="loading-txt-wait">等待上传…</span></div>' +
			'<div class="loading-fail-icon"></div>' +
			'</div>';
		if (zss_editor.isVoiceBegin()) {
			var html = '<div class="editor-image voiceBegin currentImage" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;">'
				+ '<img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
			var sendhtml = '<div class="editor-image voiceBegin" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;background:#e7e8e7;">'
				+ '<img src=""' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		} else {

			var html = '<div class="editor-image currentImage" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;">'
				+ '<img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
			var sendhtml = '<div class="editor-image" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;background:#e7e8e7;">'
				+ '<img src=""' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		}
		var data = {};
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "inserthtml";
		data.value = "insertImage";
		data.html = sendhtml;
		data.address = address;
		zss_editor.sendJoinData(data);

	} else if (!!isrecovery && zss_editor.cooperation) {
		var range = window.getSelection().getRangeAt(0);
		range = zss_editor.moveToAddress(range, data.address);
		zss_editor.currentSelection.setRange(range);
		var html = data.html;
	} else if (zss_editor.isVoiceBegin()) {
		var html = '<div class="editor-image voiceBegin currentImage" element-id="' + divelementId + '"><img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/></div>';
	} else {
		var html = '<div class="editor-image currentImage" element-id="' + divelementId + '"><img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/></div>';
	}
	zss_editor.jumpAfterTodo();
	// zss_editor.insertHTML('\u200B');
	//    zss_editor.jumpAfterList();
	if (zss_editor.isemptyP()) {
		zss_editor.insertHTML('\u200B');
	}
	this.insertHTML(html);
	this.enabledEditingItems();
	zss_editor.jumpAfterImage();
//  zss_editor.insertHTML('');
	var node = $('div.currentImage');
	$('.editor-image').attr('contenteditable', false);
	node.attr('contenteditable', false).removeClass('currentImage');
	// if (isAndroid && (typeof javaJs !== 'undefined')) {
	// 	setTimeout(zss_editor.calculateEditorHeightWithCaretPosition,50);
	// }
	zss_editor.undoManagerSave()
};
//通用编辑器面板图片插入2021.07.29
zss_editor.insertImageWebType = function (url, alt, width, height, isrecovery, data) {
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
		if ($("#zss_editor_content").text().trim() == '') {
			zss_editor.focusEditor();
		} else {
			zss_editor.restoreRange();
		}
	} else {
		zss_editor.restoreRange();
	}

	var objectid = !!alt ? (' objectid="' + alt + '"') : '';
	var data_width = !!width ? (' data-width="' + width + '"') : '';
	var data_height = !!height ? (' data-height="' + height + '"') : '';
	var divelementId = zss_editor.getRandomId();
	if (zss_editor.editorClientType == false) {
		var range = window.getSelection().getRangeAt(0);
		var tmpRange = range.cloneRange();
		if (!!width && !!height) {
			var winwidth = $(window).width() - 30;
			var node = $(range.startContainer);
			if (node.parents('.record-iframe').length > 0) {
				var wid = winwidth - 8;
			} else if (node.parents('.record-box').length > 0) {
				var wid = winwidth - 20;
				if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
					wid = wid - 26;
				}
			} else if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
				var wid = winwidth - 26;
			} else {
				var wid = winwidth;
			}
			var imgW1 = width;
			var imgH1 = height;
			var imgW2 = wid;
			if (imgW1 < imgW2) {
				imgW2 = imgW1;
			}
			var imgH2 = parseInt(imgW2 * imgH1 / imgW1);
		} else {
			var imgW2 = "0";
			var imgH2 = "0";
		}
		var loadinghtml = '<div class="loadingDiv loading">' +
			'<div class="circleChartMask"></div>' +
			'<div class="circleChart">' +
			'<div class="circleChart-bg"></div>' +
			'<div class="circleChart-inner"></div>' +
			'</div>' +
			'<div class="loading-waiting"></div>' +
			'<div class="loading-chat-txt clearfix"><span class="loading-txt-aside">上传失败！点击重新上传</span><span class="loading-txt-wait">等待上传…</span></div>' +
			'<div class="loading-fail-icon"></div>' +
			'</div>';
		if (zss_editor.isVoiceBegin()) {
			var html = '<div class="editor-image voiceBegin currentImage" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;">'
				+ '<img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
			var sendhtml = '<div class="editor-image voiceBegin" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;background:#e7e8e7;">'
				+ '<img src=""' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		} else {

			var html = '<div class="editor-image currentImage" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;">'
				+ '<img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
			var sendhtml = '<div class="editor-image" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;background:#e7e8e7;">'
				+ '<img src=""' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		}

	} else if (zss_editor.isVoiceBegin()) {
		var html = '<div class="editor-image voiceBegin currentImage" element-id="' + divelementId + '"><img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/></div>';
	} else {
		var html = '<div class="editor-image currentImage" element-id="' + divelementId + '"><img src="' + url + '" data-original="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/></div>';
	}
	zss_editor.jumpAfterTodo();
	// zss_editor.insertHTML('\u200B');
	//    zss_editor.jumpAfterList();
	if (zss_editor.isemptyP()) {
		zss_editor.insertHTML('\u200B');
	}
	this.insertHTML(html);
	this.enabledEditingItems();
	zss_editor.jumpAfterImage();
//  zss_editor.insertHTML('');
	var node = $('div.currentImage');
	$('.editor-image').attr('contenteditable', false);
	node.attr('contenteditable', false).removeClass('currentImage');
	// if (isAndroid && (typeof javaJs !== 'undefined')) {
	// 	setTimeout(zss_editor.calculateEditorHeightWithCaretPosition,50);
	// }
	zss_editor.undoManagerSave()
};
// 插入多张图片
zss_editor.insertImageList = function (url, alt, width, height) {
	for (var i = 0; i < url.length; i++) {
		var data_alt = !!alt ? alt[i] : '';
		var data_width = !!width ? width[i] : '';
		var data_height = !!height ? height[i] : '';
		zss_editor.insertImage(url[i], data_alt, data_width, data_height);
	}
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知客户端实现滚动到焦点位置
		setTimeout(zss_editor.clientscrollToCursorPos, 550);

		//通知图片加载完更新高度
		var img_length = $("#zss_editor_content img").length;
		var img_start = 1;
		$("#zss_editor_content img").load(function () {
			img_start++;
			if (img_start == img_length) {
				//通知客户端实现滚动到焦点位置
				zss_editor.updateHeight();
			}
		});
	} else {
		//脚本实现滚动到焦点位置
		setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 550);
	}
};
// Android插入多张图片
zss_editor.insertImageListAndroid = function (url, alt, width, height, time) {
	for (var i = 0; i < url.length; i++) {
		var data_alt = !!alt ? alt[i] : '';
		var data_width = !!width ? width[i] : '';
		var data_height = !!height ? height[i] : '';
		zss_editor.insertImage(url[i], data_alt, data_width, data_height);
	}
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知客户端实现滚动到焦点位置
		setTimeout(zss_editor.clientscrollToCursorPos, time);
		//通知图片加载完更新高度
		var img_length = $("#zss_editor_content img").length;
		var img_start = 1;
		$("#zss_editor_content img").load(function () {
			img_start++;
			if (img_start == img_length) {
				//通知客户端实现滚动到焦点位置
				zss_editor.updateHeight();
			}
		});
	} else {
		//脚本实现滚动到焦点位置
		setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, time);
	}
	zss_editor.undoManagerSave();
};
zss_editor.jumpRecentImage = function () {

	zss_editor.restoreRange();
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.editor-image')) {
			pack = node;
		} else {
			pack = node.parents('.editor-image');
		}
		if (pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			var pack_next = $("<p>\u200B</p>")[0];
			range.insertNode(pack_next);
			if (pack.prev().length > 0) {
				range.setStartAfter(pack.prev()[0]);
				range.setEndAfter(pack.prev()[0]);
				range.selectNodeContents(pack.prev()[0]);
				range.collapse(false);
				zss_editor.currentSelection.setRange(range);
			} else {
				range.setStartBefore(node);
				range.setEndBefore(node);
				zss_editor.currentSelection.setRange(range);
			}

		}
	}
};
//插入最近使用的图片，光标定位到图片前面
zss_editor.insertRecentImage = function (url, alt, width, height, isrecovery, data) {
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
	}
	zss_editor.restoreRange();
	var objectid = !!alt ? (' objectid="' + alt + '"') : '';
	var data_width = !!width ? (' data-width="' + width + '"') : '';
	var data_height = !!height ? (' data-height="' + height + '"') : '';
	var divelementId = zss_editor.getRandomId();
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var range = window.getSelection().getRangeAt(0);
		var tmpRange = range.cloneRange();
		if (!!width && !!height) {
			var winwidth = $(window).width() - 30;
			var node = $(range.startContainer);
			if (node.parents('.record-iframe').length > 0) {
				var wid = winwidth - 8;
			} else if (node.parents('.record-box').length > 0) {
				var wid = winwidth - 20;
				if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
					wid = wid - 26;
				}
			} else if (node.parents('ol').length > 0 || node.parents('ul').length > 0) {
				var wid = winwidth - 26;
			} else {
				var wid = winwidth;
			}
			var imgW1 = width;
			var imgH1 = height;
			var imgW2 = wid;
			if (imgW1 < imgW2) {
				imgW2 = imgW1;
			}
			var imgH2 = parseInt(imgW2 * imgH1 / imgW1);
		} else {
			var imgW2 = "0";
			var imgH2 = "0";
		}
		var loadinghtml = '<div class="loadingDiv loading">' +
			'<div class="circleChartMask"></div>' +
			'<div class="circleChart">' +
			'<div class="circleChart-bg"></div>' +
			'<div class="circleChart-inner"></div>' +
			'</div>' +
			'<div class="loading-waiting"></div>' +
			'<div class="loading-chat-txt clearfix"><span class="loading-txt-aside">上传失败！点击重新上传</span><span class="loading-txt-wait">等待上传…</span></div>' +
			'<div class="loading-fail-icon"></div>' +
			'</div>';
		var html = '<div class="editor-image" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;">'
			+ '<img src="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		var sendhtml = '<div class="editor-image" element-id="' + divelementId + '" contenteditable="false" style="height:' + imgH2 + 'px;background:#e7e8e7;">'
			+ '<img src=""' + data_width + data_height + objectid + ' class="image-package"/>' + loadinghtml + '</div>';
		var data = {};
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "inserthtml";
		data.value = "insertRecentImage";
		data.html = sendhtml;
		data.address = address;
		zss_editor.sendJoinData(data);
	} else if (!!isrecovery && zss_editor.cooperation) {
		var range = window.getSelection().getRangeAt(0);
		range = zss_editor.moveToAddress(range, data.address);
		zss_editor.currentSelection.setRange(range);
		var html = data.html;
	} else {
		var html = '<div class="editor-image currentImage" element-id="' + divelementId + '"><img src="' + url + '"' + data_width + data_height + objectid + ' class="image-package"/></div>';
	}

	// zss_editor.insertHTML('\u200B');
	// zss_editor.jumpAfterList();
	if (zss_editor.isemptyP()) {
		zss_editor.insertHTML('\u200B');
	}
	this.insertHTML(html);
	this.enabledEditingItems();
	zss_editor.jumpRecentImage();
	//zss_editor.insertHTML('');
	var node = $('div.currentImage');
	node.attr('contenteditable', false).removeClass('currentImage');
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知客户端实现滚动到焦点位置
		setTimeout(zss_editor.clientscrollToCursorPos, 50);
		//通知图片加载完更新高度
		var img_length = $("#zss_editor_content img").length;
		var img_start = 1;
		$("#zss_editor_content img").load(function () {
			img_start++;
			if (img_start == img_length) {
				//通知客户端实现滚动到焦点位置
				zss_editor.updateHeight();
			}
		});
	} else {
		//脚本实现滚动到焦点位置
		setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 50);
	}
	zss_editor.undoManagerSave()
};
//点击图片
zss_editor.onImageClick = function (imageUrl, position, downloadArr) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var versionImg = zss_editor.versionSame('6.0.5.8');
		if (versionImg) {
			javaJs.onImageClick(imageUrl, position, downloadArr);
		} else {
			javaJs.onImageClick(imageUrl, position);
		}

	}
	//ios
	if (isIOS) {
		var versionImg = zss_editor.versionSame('6.0.5.7');
		if (versionImg) {
			if (window.webkit && window.webkit.messageHandlers.onImageClick) {
				window.webkit.messageHandlers.onImageClick.postMessage([imageUrl, position, downloadArr]);
			} else {
				if (window["onImageClick"]) {
					window["onImageClick"](imageUrl, position, downloadArr);
				}
			}
		} else {
			if (window.webkit && window.webkit.messageHandlers.onImageClick) {
				window.webkit.messageHandlers.onImageClick.postMessage([imageUrl, position]);
			} else {
				if (window["onImageClick"]) {
					window["onImageClick"](imageUrl, position);
				}
			}
		}

	}
};
//点击打点时间
zss_editor.onMarktimeClick = function (time, timeArr, file, iframeAllArr) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.onMarktimeClick(time, timeArr, file, iframeAllArr);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.onMarktimeClick) {
			window.webkit.messageHandlers.onMarktimeClick.postMessage([time, timeArr, file, iframeAllArr]);
		} else {
			if (window["onMarktimeClick"]) {
				window["onMarktimeClick"](time, timeArr, file, iframeAllArr);
			}
		}
	}
};
// 点击打点加号
zss_editor.onMarkaddClick = function (id) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.onMarkaddClick(id);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.onMarkaddClick) {
			window.webkit.messageHandlers.onMarkaddClick.postMessage([id]);
		} else {
			if (window["onMarkaddClick"]) {
				window["onMarkaddClick"](id);
			}
		}
	}
};
zss_editor.onMarkiframeClick = function (id) {
	var frameName = $("iframe[cid=" + id + "]").attr("name");
	try {
		frameName = b64DecodeUnicode(frameName);
	} catch (e) {

	}
	// if($("body").hasClass('previewWrap') && zss_editor.versionClickVoice()){
	// 判断版本点击录音附件才能掉该方法，否则只是实现点击播放录音
	var version = null;
	if (isIOS) {
		version = zss_editor.versionSame('4.2.4.9');
	}
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		version = zss_editor.versionSame('4.2.5.7');
	}
	//传-1是点击录音附件，和打点时间作区分
	var time = 0;
	var version2 = null;
	if (isIOS) {
		version2 = zss_editor.versionSame('4.3.3.2');
	}
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		version2 = zss_editor.versionSame('4.3.4.6');
	}
	if (version2) {
		time = -1;
	}
	if (version) {
		var timeArr = zss_editor.getAllmarkTime(id);
		var iframeAllArr = [];
		$("iframe").each(function () {
			var iframeArr = [];
			var iframeId = $(this).attr('cid');
			var iframeTimeArr = zss_editor.getAllmarkTime(iframeId);
			var iframeName = $(this).attr('name');
			try {
				iframeName = b64DecodeUnicode(iframeName);
			} catch (e) {

			}
			iframeArr.push(iframeTimeArr);
			iframeArr.push(iframeName);
			iframeAllArr.push(iframeArr);
		});
		zss_editor.onMarktimeClick(time, timeArr, frameName, JSON.stringify(iframeAllArr));
	} else {
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			javaJs.onClickAttachment(frameName);
		}
		//ios
		if (isIOS) {
			if (window.webkit && window.webkit.messageHandlers.onClickAttachment) {
				window.webkit.messageHandlers.onClickAttachment.postMessage([frameName]);
			} else {
				if (window["onClickAttachment"]) {
					window["onClickAttachment"](frameName);
				}
			}
		}
	}

}
// 更新录音播放时间
zss_editor.onVoiceTime = function (id, time) {
	var frameName = $("iframe[cid=" + id + "]").attr("name");
	try {
		frameName = b64DecodeUnicode(frameName);
	} catch (e) {

	}
	var timeArr = zss_editor.getAllmarkTime(id);
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.updateVoiceTime(frameName, time, timeArr);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.updateVoiceTime) {
			window.webkit.messageHandlers.updateVoiceTime.postMessage([frameName, time, timeArr]);
		} else {
			if (window["updateVoiceTime"]) {
				window["updateVoiceTime"](frameName, time, timeArr);
			}
		}
	}

}
//点击附件删除按钮弹框
zss_editor.oniframeClose = function (id) {
	var pos = $("#zss_editor_content .editor-iframe").index($("iframe[cid=" + id + "]").parent(".editor-iframe"));
	setTimeout(function () {
		zss_editor.webConfirmIframeIcon(zss_editor.deleteInfor.text, zss_editor.deleteInfor.delete, zss_editor.deleteInfor.cancel, pos);
	}, 10);
}
//打点时间标蓝
zss_editor.onMarktimeCur = function (id, index) {
	var obj = $("#mark_" + id).find(".record-list-time");
	obj.eq(index).parents(".record-list-tit").addClass('record-tit-cur').parents(".record-list").siblings().find(".record-list-tit").removeClass('record-tit-cur').parents(".record-box").siblings().find(".record-list-tit").removeClass('record-tit-cur');

	var c = obj.eq(index).offset().top;
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.scrollMarkTimePos(c);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.scrollMarkTimePos) {
			window.webkit.messageHandlers.scrollMarkTimePos.postMessage([c]);
		} else {
			if (window["scrollMarkTimePos"]) {
				window["scrollMarkTimePos"](c);
			}
		}
	}

};
//取消打点时间标蓝
zss_editor.cancelMarktimeCur = function (id) {
	var obj = $("#mark_" + id).find(".record-list-tit");
	obj.removeClass("record-tit-cur");
};
// 获取当前录音所有的打点时间
zss_editor.getAllmarkTime = function (id) {
	var markTime = [];
	$("#mark_" + id).find(".record-list-time").each(function () {
		var time = $(this).text();
		time = zss_editor.timeToSecond(time);
		markTime.push(time);
	});
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		return markTime;
	}
	return JSON.stringify(markTime);
};
// 安卓获取当前录音所有的打点时间
zss_editor.getAllmarkTimeString = function (id) {
	var markTime = [];
	$("#mark_" + id).find(".record-list-time").each(function () {
		var time = $(this).text();
		time = zss_editor.timeToSecond(time);
		markTime.push(time);
	});
	return JSON.stringify(markTime);
};
//删除遗留的空列表
zss_editor.removeNullList = function () {
	$('#zss_editor_content li').each(function () {
		if ($(this).text() == '' && $(this).find('img').length == 0 && $(this).find('iframe').length == 0 && $(this).find('br').length == 0) {
			$(this).remove()
		}
	});
	$('#zss_editor_content ul,#zss_editor_content ol').each(function (index, item) {
		if ($(this).html() == '') {
			$(this).remove()
		}
	});
}
//全选删除弹框
zss_editor.webConfirmFrag = function (message, btnOk, btnCancel, range, start, startOffset, e) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmImg = confirm(JSON.stringify(obj));
	if (confirmImg == true) {
		range.setStart(start, startOffset);
		range.deleteContents();
		zss_editor.removeNullList();
		range.collapse(true);
		zss_editor.currentSelection.setRange(range);
		zss_editor.hasContent();
	} else {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
};
zss_editor.webConfirm = function (message, btnOk, btnCancel, pos) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmImg = confirm(JSON.stringify(obj));
	if (confirmImg == true) {
		zss_editor.removeImage(pos);
		zss_editor.hasContent();
	} else {
		return false;
	}
};
zss_editor.webConfirmIframe = function (message, btnOk, btnCancel, pos) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmIframe = confirm(JSON.stringify(obj));
	if (confirmIframe == true) {
		zss_editor.removeIframe(pos);
		zss_editor.hasContent();
	} else {
		return false;
	}
};
zss_editor.webConfirmTemplate = function (message, btnOk, btnCancel, pos) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmTemplate = confirm(JSON.stringify(obj));
	if (confirmTemplate == true) {
		zss_editor.removeTemplate(pos);
		zss_editor.hasContent();
	} else {
		return false;
	}
};
//叉号删除附件
zss_editor.webConfirmIframeIcon = function (message, btnOk, btnCancel, pos) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmIframe = confirm(JSON.stringify(obj));
	if (confirmIframe == true) {
		zss_editor.removeIframeIcon(pos);
		zss_editor.hasContent();
	} else {
		return false;
	}
};
zss_editor.webConfirmRecordTime = function (message, btnOk, btnCancel, pos) {
	var obj = new Object();
	obj.message = message;
	obj.btnOk = btnOk;
	obj.btnCancel = btnCancel;
	var confirmImg = confirm(JSON.stringify(obj));
	if (confirmImg == true) {
		zss_editor.removeRecordTime(pos);
		zss_editor.hasContent();
	} else {
		return false;
	}
};
//删除标记时间
zss_editor.removeRecordTime = function (start, tagName, isrecovery) {
	var elementid = start.getAttribute('element-id');
	if (!elementid) {
		elementid = zss_editor.getRandomId()
	}
	//协同编辑删除标记时间
	if (!isrecovery && zss_editor.cooperation) {
		var data = {};
		data.name = 'deleteElement';
		data.element = start;
		data.elementId = elementid;
		data.tagName = 'recordtime';
		zss_editor.sendJoinData(data);
	}
	var startParent = start.parentNode;//record-list
	var startNext = start.nextSibling;//标注内容
	var startParentParent = startParent.parentNode; //record-box
	var startParentPrev = startParent.previousSibling;
	var range = window.getSelection().getRangeAt(0);
	if (startParentPrev) { //不是第一个标记
		// 删除打点加号，图标挪到前一个列表中
		// if(startParent.querySelectorAll('.record-list-add').length>0){
		// 	$(startParentPrev).find(".record-list-tit").append('<span class="record-list-add" contenteditable="false"></span>\u200b')
		// }
		start.remove();
		startParentPrevLast = startParentPrev.lastChild;
		startParentFirst = startParent.firstChild;
		var newp = document.createElement('p');
		//2022.05.11协同编辑加elementid
		newp.setAttribute('element-id', zss_editor.getRandomId());
		newp.appendChild(document.createElement('br'));
//		newp.appendChild( document.createTextNode("\u200b") );
		startParentPrev.appendChild(newp);
		if (startParentFirst) {//有标注内容
			while (startParent.firstChild) {
				startParentPrev.appendChild(startParent.firstChild)
			}
		}
		startParent.remove();

		if (startParentParent.querySelectorAll('.record-list-tit').length == 0) {//没有时间标记了
			while (startParentPrev.firstChild) {
				startParentParent.parentNode.insertBefore(startParentPrev.firstChild, startParentParent);
			}
			startParentParent.remove();
		}
		range.setStart(newp, 0);
		range.setEnd(newp, 0);
		zss_editor.currentSelection.setRange(range);

	} else {//是第一个list
		startParentNext = startParent.nextSibling;
		start.remove();
		var startParentFirst = startParent.firstChild;//标注内容
		while (startParent.firstChild) {
			startParentParent.parentNode.insertBefore(startParent.firstChild, startParentParent);
		}
		startParent.remove();
		//如果所有标记为空，删除record-box
		if (startParentFirst) { //有标注内容
			range.setStart(startParentFirst, 0);
			range.setEnd(startParentFirst, 0);
		} else { //没有标注内容，有其他标注
			if (startParentParent.previousSibling && startParentParent.previousSibling.nodeType == 1) { //record-box前面有元素节点
				range.setStartAfter(startParentParent.previousSibling.lastChild);
				range.setEndAfter(startParentParent.previousSibling.lastChild);
			} else if (startParentParent.previousSibling && startParentParent.previousSibling.nodeType == 3) { //record-box前面有文本节点
				range.setStartAfter(startParentParent.previousSibling);
				range.setEndAfter(startParentParent.previousSibling);
			} else {//record-box前面没有内容,新建一行
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				p.appendChild(document.createElement('br'));
				startParentParent.parentNode.insertBefore(p, startParentParent);
				range.setStart(p, 0);
				range.setEnd(p, 0);
			}

		}
		if (startParentParent.innerText == '') { //如果所有标记为空，删除record-box
			startParentParent.remove();
		}
		zss_editor.currentSelection.setRange(range);
	}
}
//删除图片
zss_editor.removeImage = function (position, tagName, isrecovery) {
	zss_editor.restoreRange();
	var imageNode = $("#zss_editor_content img").eq(position);
	if (imageNode.length === 0) {
		return;
	}
	//协同编辑删除图片
	if (!isrecovery && zss_editor.cooperation) {
		var data = {};
		data.name = 'deleteElement';
		data.elementIndex = position;
		data.tagName = 'img';
		zss_editor.sendJoinData(data);
	}
	var imagePack = imageNode;
	// if(imageNode.parent().length > 0 && imageNode.parent().is(".editor-image") && imageNode.parent().attr('contenteditable') == 'false'){
	// 	imagePack = imageNode.parent();
	// 	if(imagePack.parent().length > 0 && imagePack.parent().is(".editor-image") && imagePack.parent().attr('contenteditable') == 'false'){
	// 		imagePack = imagePack.parent();
	// 	}
	// 	// imagePack.attr('contenteditable', true);//解决连续两张没有空格的图片无法删除
	// }
	if (imageNode.parents(".editor-image").length > 0) {
		var imageParents = imageNode.parents(".editor-image").eq(imageNode.parents(".editor-image").length - 1);
		if (imageParents.attr('contenteditable') == 'false' || imageParents.parents('.drag-image-wrap').length > 0) {
			imagePack = imageParents;
		}
		// imagePack.attr('contenteditable', true);//解决连续两张没有空格的图片无法删除
	}
	var selection = getSelection();
	if (selection.rangeCount > 0) {
		if (imagePack.prev().attr('contenteditable') == 'false') {//两个图片之间没有空行用此删除
			imagePack.remove();
		} else if (imagePack.prev().length == 0 && imagePack.parent().prev().attr('contenteditable') == 'false') {//两个图片之间没有空行用此删除，父级的前面元素是不可编辑
			imagePack.remove();
		} else if (imagePack.prev().length == 0 && imagePack.parent().parent().prev().attr('contenteditable') == 'false') {//两个图片之间没有空行用此删除，父级的前面元素是不可编辑
			imagePack.remove();
		} else if (imagePack.prev().length == 0 && imagePack[0] == $("#zss_editor_content").children(":first")[0]) {
			imagePack.remove();
		} else if (imagePack.parents('li').length > 0 && imagePack[0].previousSibling && imagePack[0].previousSibling == imagePack.parents('li')[0].firstChild) {//li的第一个元素后附件删除
			imagePack.remove();
		} else {
			if (imagePack.parents('.drag-image-wrap').length > 0) {
				if (imagePack.parents('.drag-image-wrap').find('.editor-image').length == 1) {
					//兼容并排图片最后一张删除外层包裹
					imagePack = imagePack.parents('.drag-image-wrap');
				}
				imagePack.remove();
			} else {
				var range = selection.getRangeAt(0);
				range.selectNode(imagePack[0]);
				//range.deleteContents();
				zss_editor.currentSelection.setRange(range);
				document.execCommand('insertHTML', false, '');
				document.execCommand('formatBlock', false, 'p');
			}

		}

	} else {
		imagePack.remove();
	}
	this.enabledEditingItems();
	zss_editor.undoManagerSave()
};
//删除附件
zss_editor.removeIframe = function (position, tagName, isrecovery) {
	zss_editor.restoreRange();
	var iframeNode = $(".editor-iframe").eq(position);
	if (iframeNode.length === 0) {
		return;
	}
	//协同编辑删除附件
	if (!isrecovery && zss_editor.cooperation) {
		var data = {};
		data.name = 'deleteElement';
		data.elementIndex = position;
		data.tagName = 'iframe';
		zss_editor.sendJoinData(data);
	}
	var frameName = iframeNode.find("iframe").attr("name");
	try {
		frameName = b64DecodeUnicode(frameName);
	} catch (e) {

	}
	if (iframeNode.prev().attr('contenteditable') == 'false') {//两个附件之间没有空行用此删除
		iframeNode.remove();
	} else if (iframeNode.prev().length == 0 && iframeNode.parent().prev().attr('contenteditable') == 'false') {//两个附件之间没有空行用此删除，父级的前面元素是不可编辑
		iframeNode.remove();
	} else if (iframeNode.prev().length == 0 && iframeNode[0] == $("#zss_editor_content").children(":first")[0]) {
		iframeNode.remove();
	} else if (iframeNode.parents('li').length > 0 && iframeNode[0].previousSibling && iframeNode[0].previousSibling == iframeNode.parents('li')[0].firstChild) {//li的第一个元素后附件删除
		iframeNode.remove();
	} else {
		var selection = getSelection();
		var range = selection.getRangeAt(0);
		range.selectNode(iframeNode[0]);
		//range.deleteContents();
		zss_editor.currentSelection.setRange(range);
		document.execCommand('insertHTML', false, '');
		document.execCommand('formatBlock', false, 'p');
	}

	this.enabledEditingItems();
	// 通知客户端删除附件完成,取消播放器
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.removeIframeEnd(frameName);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.removeIframeEnd) {
			window.webkit.messageHandlers.removeIframeEnd.postMessage([frameName]);
		} else {
			if (window["removeIframeEnd"]) {
				window["removeIframeEnd"](frameName);
			}
		}
	}
	zss_editor.undoManagerSave()
};
zss_editor.removeTemplate = function (position) {
	zss_editor.restoreRange();
	var templateNode = $(".template_class").eq(position);
	if (templateNode.length === 0) {
		return;
	}
	var selection = getSelection();
	var range = selection.getRangeAt(0);
	range.selectNode(templateNode[0]);
	//range.deleteContents();
	zss_editor.currentSelection.setRange(range);
	document.execCommand('insertHTML', false, '');
	document.execCommand('formatBlock', false, 'p');
	this.enabledEditingItems();
	zss_editor.undoManagerSave()
};
//叉号删除附件
zss_editor.removeIframeIcon = function (position, isrecovery) {
	zss_editor.restoreRange();
	var iframeNode = $(".editor-iframe").eq(position);
	if (iframeNode.length === 0) {
		return;
	}
	//协同编辑删除附件
	if (!isrecovery && zss_editor.cooperation) {
		var data = {};
		data.name = 'deleteElement';
		data.elementIndex = position;
		data.tagName = 'iframe';
		zss_editor.sendJoinData(data);
	}
	var frameName = iframeNode.find("iframe").attr("name");
	try {
		frameName = b64DecodeUnicode(frameName);
	} catch (e) {

	}

	if (iframeNode.parents(".record-iframe").length > 0) {
		while (iframeNode.siblings().length > 0) {
			iframeNode.siblings().insertBefore(iframeNode.parents(".record-box"));
		}
		iframeNode.parents(".record-iframe").remove();
	} else {
		iframeNode.remove();
	}
	this.enabledEditingItems();
	// 通知客户端删除附件完成,取消播放器
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.removeIframeEnd(frameName);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.removeIframeEnd) {
			window.webkit.messageHandlers.removeIframeEnd.postMessage([frameName]);
		} else {
			if (window["removeIframeEnd"]) {
				window["removeIframeEnd"](frameName);
			}
		}
	}
	zss_editor.undoManagerSave()
};
// 插入内容
zss_editor.insertHTML = function (html, tmpRange) {
	var li = zss_editor.closerParentNodeWithName('li');
	var regMeta = RegExp(/<meta.*?>/);
	var regStyle = RegExp(/<style>([\s\S]*?)<\/style>/);
	var regTitle = RegExp(/<title>([\s\S]*?)<\/title>/);

	//处理IOS高版本系统列表粘贴带meta走不到li里的问题
	if (li && regMeta.exec(html)) {
		html = html.replace(regMeta, '');
	}
	if (regMeta.exec(html) || regStyle.exec(html) || regTitle.exec(html)) {
		document.execCommand('insertHTML', false, html);
	} else if (li) {//列表中粘贴列表内容
		var range = window.getSelection().getRangeAt(0);
		if (tmpRange) {
			range = tmpRange
		}
		var start = range.startContainer;
		if (start.nodeType == 3) {
			start = start.parentNode;
		}
		html = html.replace(/\<!--.*?--\>/g, '');
		var div = document.createElement('div');
		div.innerHTML = html.trim();

		var list = zss_editor.findParentByTagName(range.startContainer, ['ul', 'ol'], true);
		var level = list.getAttribute('level');
		//第一个元素是块状元素，去除外侧标签，为了和编辑器内的文字合为一行
		if ((div.firstChild.nodeName == "OL" || div.firstChild.nodeName == "UL") && div.firstChild.firstChild.nodeName == "LI") {
			//第一个元素是ol或ul,取出li
			$(div).prepend(div.firstChild.firstChild);
			if (!div.firstChild.nextElementSibling.firstChild) {
				div.firstChild.nextElementSibling.remove()
			}
		}
		var firstChild = div.firstChild;
		if (zss_editor.isBlockElm(div.firstChild) && div.firstChild.nodeName != "OL" && div.firstChild.nodeName != "UL" && !($(div.firstChild).hasClass('editor-iframe') || $(div.firstChild).hasClass('editor-image') || $(div.firstChild).hasClass('record-list-time'))) {
			var child;
			if (div.firstChild.childNodes.length > 0) {
				while (child = div.firstChild.firstChild) {
					div.insertBefore(child, div.firstChild);
				}
			}
			firstChild.remove();
		}
		var next, last;
		while (child = div.firstChild) {
			//针对hr单独处理一下先
			while (child) {
				next = child.nextSibling;
				//移除粘贴时带的上下文的空元素,比如<br><p></p>等
				if (child.nodeName == "BR" || (zss_editor.isBlockElm(child) && !child.firstChild) ||
					(zss_editor.isBlockElm(child) && child.innerText == '' && !child.querySelector('img') && !child.querySelector('iframe') && !child.querySelector('input') && !child.querySelector('br') && !child.querySelector('hr'))) {
					child.remove();
					child = next;
					next = child.nextSibling;
				}
				list = zss_editor.findParentByTagName(range.startContainer, ['ul', 'ol'], true);
				li = zss_editor.findParentByTagName(range.startContainer, 'li', true);
				$(child).removeAttr('data-origin-start').removeAttr('data-start');
				$(child).removeAttr('serialnum');
				if (list && /^(ol|ul)$/i.test(child.tagName)) {
					//部分粘贴时只有<ol><br></ol>,移除,继续循环
					if (child.firstChild.nodeName == 'BR' && child.childNodes.length == 0) {
						child.remove();
						continue;
					}
					$(child.firstChild).removeAttr('serialnum');
					if ((start.nodeName != 'LI' && start != li.lastChild) || range.startOffset < range.startContainer.length) { //光标不在li的最后
						var span = document.createElement('span');
						range.insertNode(span);
						zss_editor.breakParent(span, list);
						prevlist = span.previousSibling;
						prevli = prevlist.lastChild;
						nextlist = span.nextSibling;
						nextli = nextlist.firstChild;
						if (!prevli.lastChild ||
							(prevli.childNodes.length == 1 && zss_editor.isBlockElm(prevli.firstChild) &&
								(!prevli.firstChild.firstChild ||
									(prevli.firstChild.firstChild.nodeType == 3 && (prevli.firstChild.firstChild.nodeValue.trim() == "" || prevli.firstChild.firstChild.nodeValue.trim() == fillChar))))) {
							prevli.remove();
						}
						if (!prevlist.firstChild) {
							if (prevlist.getAttribute('data-origin-start') || prevlist.getAttribute('data-start')) {
								prevlist.remove();
								child.setAttribute('data-origin-start', 1);
							}
						}
						$(nextlist).removeAttr('data-origin-start').removeAttr('data-start');
						range.setStartAfter(span);
						range.collapse(true);
						zss_editor.currentSelection.setRange(range);
						if (nextli.innerText == '' && !nextli.querySelector('img') && !nextli.querySelector('iframe') && !nextli.querySelector('input')) {
							if (nextli.parentNode.childNodes.length == 1) {
								nextli.parentNode.remove()
							} else {
								nextli.remove()
							}
						}
						span.remove();
					}
					var list = zss_editor.findParentByTagName(range.startContainer, ['ul', 'ol'], true);
					if (list) {
						var span = document.createElement('span');
						range.setStartAfter(list)
						range.collapse(true);
						range.insertNode(span);
						var level = parseInt(level) || 1;
						var serialnum = list.getAttribute('serialnum') || 1;
						var childlevel = parseInt(child.getAttribute('level')) || 1;
						var newlevel = level + childlevel - 1;
						$(child).attr('level', newlevel);
						if (level >= newlevel) {
							$(child).attr('serialnum', addSerialNum(serialnum, newlevel));
							$(child.firstChild).attr('serialnum', child.getAttribute('serialnum'));
							$(child).removeAttr('data-start');
						} else if (level < newlevel) {
							$(child).attr('data-origin-start', '1').attr('serialnum', serialnumToString('1', newlevel));
							$(child.firstChild).attr('serialnum', child.getAttribute('serialnum'));
						}
						$(child).insertAfter(span);
						span.remove();
					} else {
						range.insertNode(child)
						range.collapse();
					}
					normalList();
					range.setStartAfter(child.lastChild.lastChild);
					range.setEndAfter(child.lastChild.lastChild);
					zss_editor.currentSelection.setRange(range);
				} else if (list && zss_editor.isBlockElm(child) && !($(div.firstChild).hasClass('editor-iframe') || $(div.firstChild).hasClass('editor-image') || $(div.firstChild).hasClass('record-list-time'))) {
					//粘贴块状元素
					var span = document.createElement('span');
					range.insertNode(span);
					zss_editor.breakParent(span, list);
					prevlist = span.previousSibling;
					nextlist = span.nextSibling;
					if ((prevlist.innerText.trim() == "" || prevlist.innerText.trim() == fillChar) && !prevlist.querySelector('img') && !prevlist.querySelector('iframe') && !prevlist.querySelector('hr') && !prevlist.querySelector('br')) {
						prevlist.remove();
					}
					$(nextlist).removeAttr('data-origin-start').removeAttr('data-start');
					if ((nextlist.innerText.trim() == "" || nextlist.innerText.trim() == fillChar) && !nextlist.querySelector('img') && !nextlist.querySelector('iframe') && !nextlist.querySelector('hr') && !prevlist.querySelector('br')) {
						nextlist.remove();
					}
					range.setStartBefore(span);
					range.collapse(true);
					range.insertNode(child);
					range.collapse(false);
					zss_editor.currentSelection.setRange(range);
					span.remove();
				} else {
					if (child.nodeName == 'LI') {
						var p = child.lastChild;
						while (child.firstChild) {
							range.insertNode(child.firstChild);
						}
						child.remove();
						child = p;
					} else {
						range.insertNode(child);
					}
					start = range.startContainer;
					if (start.nodeType == 3) {
						start = start.parentNode;
					}
					if (li) {
						if ($(li).find(start).length > 0) {
							while (start.parentNode != li) {
								start = start.parentNode;
							}
						}
						if (zss_editor.isBlockElm(child) && start != li) {
							zss_editor.breakParent(child, start);
							var childnext = child.nextSibling;
							if (!child.nextSibling.firstChild || child.nextSibling.childNodes.length == 0) {
								child.nextSibling.remove();
							} else if (zss_editor.isBlockElm(child) && (
								(child.nextSibling.childNodes.length == 1 && child.nextSibling.firstChild.nodeName == 'BR') ||
								(child.nextSibling.childNodes.length == 2 && child.nextSibling.lastChild.nodeName == 'BR' && child.nextSibling.firstChild.nodeType == 3 && child.nextSibling.firstChild.nodeValue.trim() == "")
							)) {
								//断开后的生成的<p><br></p>删掉
								child.nextSibling.remove();
							}
						}
					}
					if (child.nodeType == 1 && ($(child).hasClass('editor-iframe') || $(child).hasClass('editor-image') || $(child).hasClass('record-list-time'))) {
						range.selectNodeContents(child);
						//解决特殊内容列表下插入附件，附件前面没有空行，导致无法删除序号2022.03.04
						var prevFirst = child.previousSibling;
						while (prevFirst && prevFirst.nodeType == 1 && prevFirst.nodeName != 'BR' && prevFirst.nodeName != 'HR') {
							if (prevFirst && prevFirst.innerHTML.trim() == "") {
								//内联元素插入零宽字符，否则换行多个空行
								if (!zss_editor.isBlockElm(prevFirst)) {
									prevFirst.appendChild(document.createTextNode("\u200b"));
								} else {
									//插入零宽字符和br粘贴列表会自动排序
									$(prevFirst).empty();
									prevFirst.appendChild(document.createTextNode("\u200b"));
									prevFirst.appendChild(document.createElement('br'));
								}
								break;
							} else if (prevFirst && prevFirst.innerHTML.trim() == "<br>") {
								//p里只有br的情况
								$(prevFirst).empty();
								prevFirst.appendChild(document.createTextNode("\u200b"));
								prevFirst.appendChild(document.createElement('br'));
							}
							prevFirst = prevFirst.firstChild;
						}
					}
					range.collapse(false);
					range.startContainer.parentNode.normalize();
					zss_editor.currentSelection.setRange(range);
					last = child;
				}
				child = next;
			}
		}

		normalList()
	} else {
		// 光标在标题上插入内容，定位在内容最后
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
			} else {
				//处理录音打点时间后的插入
				var range = window.getSelection().getRangeAt(0);
				if (tmpRange) {
					range = tmpRange
				}
				var start = range.startContainer;
				if (start.nodeType == 3) {
					start = start.parentNode;
				}
				if (start.nodeType == 1) {
					while (start.id != 'zss_editor_content') {
						if (start.className && start.className.indexOf('record-list-tit') > -1) {
							break;
						} else {
							start = start.parentNode;
						}
					}
					if (start && start.className && start.className.indexOf('record-list-tit') > -1) {
						if (!start.nextSibling) {
							var newp = document.createElement('p');
							//2022.05.11协同编辑加elementid
							newp.setAttribute('element-id', zss_editor.getRandomId());
							newp.appendChild(document.createTextNode('\u200B'));
							start.parentNode.appendChild(newp);
						}
						range.setStartAfter(start.nextSibling.lastChild);
						range.setEndAfter(start.nextSibling.lastChild);
						zss_editor.currentSelection.setRange(range);
					}
				}
			}
		}
		document.execCommand('insertHTML', false, html);
		//解决复制图片用该方法插入后图片不可编辑属性丢失2020.10.22
		if (isIOS) {
			$('img').parent(".editor-image").attr("contenteditable", "false");
			//解决图片丢失不可编辑器属性
			$(".drag-image-wrap").attr("contenteditable", "false");
		}

	}

	this.enabledEditingItems();
};
zss_editor.fontsizeAdd = function (str) {
	var str = str.replace(' ', '');
	var px = str.substring(10, str.length - 2);
	str = "font-size: " + Math.round(parseInt(px) * 8 / 7) + 'px';
	return str;
};
//学习通设置字体大小缩放还原
zss_editor.fontsizeZoomOut = function (str, type) {
	var str = str.replace(' ', '');
	var px = str.substring(10, str.length - 2);
	if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
		px = Math.round(parseInt(px) / zss_editor.fontsizeTimes[type]);
	}
	str = "font-size: " + px + 'px';
	return str;
};
//字体-
zss_editor.fontsizeReduce = function (str) {
	var str = str.replace(' ', '');
	var px = str.substring(10, str.length - 2);
	str = "font-size: " + Math.round(parseInt(px) * 7 / 8) + 'px';
	return str;
};
//学习通设置字体大小缩放
zss_editor.fontsizeZoomIn = function (str, type) {
	var str = str.replace(' ', '');
	var px = str.substring(10, str.length - 2);
	if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
		px = Math.round(parseInt(px) * zss_editor.fontsizeTimes[type]);
	}
	str = "font-size: " + px + 'px';
	return str;
};
zss_editor.addLink = function (html) {
	var iframeReg = new RegExp('<\\s*iframe([\\s\\S]*?)>\\s*<\/iframe>', 'gi');
	html = html.replace(iframeReg, function () {
		return '<iframe' + arguments[1].replace(/</gi, '&lt;').replace(/>/gi, '&gt;') + '></iframe>';
	})
	//去除所有的a标签保留内容不包括含有name属性的2021.01.19
//	html=html.replace(/<\/?a.*?>/gi,function(){
//		if(arguments[0].indexOf('name')>-1){
//			return arguments[0];
//		}else{
//			return '';
//		}
//	});
	//匹配出所有标签内的文本内容
	var innertextReg = new RegExp('>(>[^<>]*)*[^<]+(<[^<>]*)*<', 'gi');
	html = '>' + html + '<';
	html = html.replace(innertextReg, function () {
		var str = arguments[0];
		str = str.substr(1, str.length - 2);
		return '>' + zss_editor.matchURL(str) + '<';
	})
	var div = document.createElement('div');
	div.innerHTML = html.substr(1, html.length - 2);
	// a标签套a标签的，移除外层a标签和object
	$(div).find('.dynacALink').each(function (index, item) {
		if ($(this).parents('a').length > 0) {
			while (this.firstChild) {
				$(this.firstChild).insertAfter($(this))
			}
			$(this).remove()
		} else if ($(this).parent().is('object')) {
			//原本没有a标签的，加上object和a标签后，要去掉object
			$(this).unwrap();
			if ($(this).find('object').length == 0) {
				if ((($(this).parents('span').attr('style') && $(this).parents('span').attr('style').indexOf('color') != -1) || $(this).parents('span').attr('color'))
					&& $(this).text().replace(/\u200B/gi, '').trim() == $(this).parents('span').text().replace(/\u200B/g, '').trim()) {
					$(this).css('color', $(this).parents('span').css('color'))
				}
			}
		}
	});
	//去除a标签内层的object
	$(div).find('object').each(function () {
		if ($(this).parents('a').length > 0) {
			while (this.firstChild) {
				$(this.firstChild).insertAfter($(this))
			}
			$(this).remove()
		}
	});
	html = div.innerHTML

	return html;
};
zss_editor.matchURL = function (str) {
	//标签内的文本内容判断是url的加<a>标签
	var urlReg = new RegExp('((((http[s]{0,1}|ftp)://)([a-zA-Z0-9\\-]+\\.)+[a-zA-Z0-9\\-]+(:\\d+)?)|(((http[s]{0,1}|ftp)://)?(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))(:\\d+)?)|(([a-zA-Z0-9\\-]+\\.)+((ac)|(ad)|(ae)|(aero)|(af)|(ag)|(ai)|(al)|(am)|(an)|(ao)|(ar)|(arpa)|(as)|(asia)|(at)|(au)|(aw)|(ax)|(az)|(ba)|(bb)|(bd)|(be)|(bf)|(bg)|(bh)|(bi)|(biz)|(bj)|(bm)|(bn)|(bo)|(br)|(bs)|(bt)|(bv)|(bw)|(by)|(bz)|(ca)|(cat)|(cc)|(cd)|(cf)|(cg)|(ch)|(chintai)|(ci)|(ck)|(cl)|(cm)|(cn)|(co)|(com)|(coop)|(cr)|(cu)|(cv)|(cx)|(cy)|(cz)|(de)|(dj)|(dk)|(dm)|(do)|(dz)|(ec)|(edu)|(ee)|(eg)|(er)|(es)|(et)|(eu)|(fi)|(fj)|(fk)|(fm)|(fo)|(fr)|(ga)|(gb)|(gd)|(ge)|(gf)|(gg)|(gh)|(gi)|(gl)|(global)|(globo)|(gm)|(gmail)|(gn)|(gov)|(gp)|(gq)|(gr)|(gs)|(gt)|(gu)|(gw)|(gy)|(hk)|(hm)|(hn)|(hr)|(ht)|(hu)|(id)|(ie)|(il)|(im)|(in)|(info)|(int)|(iq)|(ir)|(is)|(it)|(je)|(jm)|(jo)|(jobs)|(jp)|(ke)|(kg)|(kh)|(ki)|(km)|(kn)|(kp)|(kr)|(kw)|(ky)|(kz)|(la)|(lb)|(lc)|(li)|(lk)|(lr)|(ls)|(lt)|(lu)|(lv)|(ly)|(ma)|(mc)|(md)|(me)|(mg)|(mh)|(mil)|(mk)|(ml)|(mm)|(mn)|(mo)|(mobi)|(mp)|(mq)|(mr)|(ms)|(mt)|(mu)|(museum)|(mv)|(mw)|(mx)|(my)|(mz)|(na)|(name)|(nc)|(ne)|(net)|(nf)|(ng)|(ni)|(nl)|(no)|(np)|(nr)|(nu)|(nz)|(om)|(org)|(pa)|(pe)|(pf)|(pg)|(ph)|(pk)|(pl)|(pm)|(pn)|(pr)|(pro)|(ps)|(pt)|(pw)|(py)|(qa)|(re)|(ro)|(rs)|(ru)|(rw)|(sa)|(sb)|(sc)|(sd)|(se)|(sg)|(sh)|(si)|(sj)|(sk)|(sl)|(sm)|(smile)|(so)|(sr)|(st)|(su)|(sy)|(sz)|(tc)|(td)|(tel)|(tf)|(tg)|(th)|(tj)|(tl)|(tm)|(tn)|(to)|(tp)|(tr)|(travel)|(tt)|(tv)|(tw)|(tz)|(ua)|(ug)|(uk)|(us)|(uy)|(uz)|(va)|(vc)|(ve)|(vg)|(vi)|(vn)|(vu)|(wf)|(ws)|(ye)|(yt)|(za)|(zm)|(zw))(?![a-zA-Z0-9]))(:\\d+)?)))(/[a-zA-Z0-9\\.\\-~!@#$%^&#$%^&amp;*+?:_/=&lt;&gt;()]*)?', 'gi')
	str = str.replace(urlReg, function () {
		var url = arguments[0].replace(/&nbsp;/gi, ' ').trim();
		if (url.indexOf('http') != 0 && url.indexOf('ftp') != 0) {
			url = 'https://' + url;
		}
		return '<object><a href="' + url + '" class="dynacALink">' + arguments[0].replace(/&nbsp;/gi, ' ').trim() + '</a></object>';
	})
	return str;
};
zss_editor.matchcss = function (str) {
	var cssIndex = str.indexOf('"');
	var csslastIndex = str.lastIndexOf('"');
	var css = str.substring(cssIndex + 1, csslastIndex);
	// css = css.replace(/[^\-]width\s*:\s*[^;]*;?/gi,'').replace(/[^\-]overflow\s*:\s*[^;]*;?/gi,'').replace(/(white-space)\s*:\s*[^;]*;?/gi,'').replace(/(user-select)\s*:\s*[^;]*;?/gi,'');
	css = css.replace(/[^\-]overflow\s*:\s*[^;]*;?/gi, '').replace(/(white-space)\s*:\s*[^;]*;?/gi, '').replace(/(user-select)\s*:\s*[^;]*;?/gi, '');
	//去除宽度
	if (css.indexOf("-width") == -1) {
		css = css.replace(/width\s*:\s*[^;]*;?/gi, '');
	}
	css = 'style=\"' + css + '\"';
	//console.log(css)
	return css;
};
zss_editor.matchcssPaste = function (str) {
	var cssIndex = str.indexOf('"');
	var csslastIndex = str.lastIndexOf('"');
	var css = str.substring(cssIndex + 1, csslastIndex);
	//margin-left为负去掉,为正保留,兼容PC和录音打点内的缩进
	css = css.replace(/margin-left\s*:\s*[^;]*;/gi, function () {
		var mLeft = arguments[0].split(':')[1].split(';')[0];
		if (mLeft.indexOf('-') > -1) {
			return '';
		} else {
			return arguments[0];
		}
	})
	//去除em,rem,替换medium,large,small2021.07.05
	css = css.replace(/font-size\s*:\s*[^;]*;/gi, function () {
		var fontSize = arguments[0].split(':')[1].split(';')[0];
		if (fontSize.indexOf('em') > -1) {
			return '';
		} else if (fontSize.indexOf('medium') > -1) {
			return 'font-size:16px;';
		} else if (fontSize.indexOf('large') > -1) {
			return 'font-size:18px;';
		} else if (fontSize.indexOf('small') > -1) {
			return 'font-size:14px;';
		} else {
			return arguments[0];
		}
	})
	css = css.replace(/[^\-]width\s*:\s*[^;]*;?/gi, '').replace(/[^\-]overflow\s*:\s*[^;]*;?/gi, '').replace(/(font-family|height|line-height|position|float|white-space|display|max-width|padding|padding-top|padding-right|padding-bottom|padding-left|margin|margin-top|margin-right|margin-bottom|text-indent)\s*:\s*[^;]*;?/gi, '');
	css = 'style=\"' + css + '\"';
	//console.log(css)
	return css;
};
zss_editor.matchele = function (str) {
	//表格标签不去除width属性2020.10.16
	if (str.indexOf("<table") == -1 && str.indexOf("<tr") == -1 && str.indexOf("<td") == -1 && str.indexOf("<col") == -1 && str.indexOf("<img") == -1) {
		var ele = str.replace(/[^\-]width\s*=\s*"[^"]+"/gi, '');
		return ele;
	} else {
		return str;
	}
};
zss_editor.matchelePaste = function (str) {
	var ele = str.replace(/crossorigin\s*=\s*[^\s>]*/gi, '').replace(/onclick\s*=\s*[^\s>]*/gi, '');
	if (ele.indexOf("<table") == -1 && ele.indexOf("<th") == -1 && ele.indexOf("<tr") == -1 && ele.indexOf("<td") == -1 && ele.indexOf("<col") == -1 && str.indexOf("<img") == -1) {
		ele = ele.replace(/[^\-]width\s*=\s*[^\s>]*/gi, '');
	}
	if (ele.indexOf("editor-image") != -1 || ele.indexOf("editor-iframe") != -1 || ele.indexOf("record-list-time") != -1) {
		ele = ele.replace(/contenteditable\s*=\s*['"]true[^\s>]*/gi, 'contenteditable="false"');
	} else {
		ele = ele.replace(/contenteditable\s*=\s*[^\s>]*/gi, '');
	}
	return ele;
};
zss_editor.getImgurlParam = function (url, name) {
	url = url.replace(/&amp;/g, '&');
	if (url.indexOf("?") != -1) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = url.split("?")[1].match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	} else {
		return null;
	}
};
zss_editor.imgRule = function (url, w) {
	var imgRw = zss_editor.getImgurlParam(url, 'rw');
	var imgRh = zss_editor.getImgurlParam(url, 'rh');
	if (imgRw != null && imgRh != null && imgRw > 0 && imgRh > 0 && url.indexOf("origin") != -1) {
		if (!!w) {
			var screenWidth = w;
		} else {
			var screenWidth = zss_editor.wWidth;
		}
		var winWidth = screenWidth - 30;
		var imgWidth1 = imgRw;
		var imgHeight1 = imgRh;
		if (imgWidth1 > winWidth) {
			//为了减少服务端裁剪图片压力，图片宽高都基于1080进行计算，不动态取屏幕宽度进行计算了
			var imgWidth = 1080;
			var imgHeight = parseInt(imgWidth * imgHeight1 / imgWidth1);
			var imgUrlNew = url.replace(/origin/g, '' + imgWidth + '_' + imgHeight + 'Q50');
			return imgUrlNew;
		} else {
			return url;
		}

	} else {
		return url;
	}
}
zss_editor.loadImg = function (w) {
	$("#zss_editor_content img").each(function (i, node) {
		if ($(node).parents('.drag-image-wrap').find('img').length > 1 && !$(node).parents('.drag-image-wrap').attr('totalWidth')) {
			//计算并排图片的总宽度，记录原始图片宽度
			var totalWidth = 0;
			$(node).parents('.drag-image-wrap').find('img').each(function (index, item) {
				totalWidth += parseInt(item.getAttribute('width') || item.style.width.replace('px', '') || 0);
				item.setAttribute('owidth', parseInt(item.getAttribute('width') || item.style.width.replace('px', '')) + 2 || 0);
			})
			$(node).parents('.drag-image-wrap').attr('totalWidth', totalWidth)
		}
		var addr = $("#zss_editor_content img").eq(i).attr("src");
		//gif图片加上标识2022.06.14
		var suffix = addr.substring(addr.lastIndexOf(".") + 1, addr.length);
		if (suffix.toLowerCase().indexOf('gif') != -1) {
			$(this).parents('.editor-image').addClass('editor-image-gif');
		}
		if (!!w) {
			var screenWidth = w;
		} else {
			var screenWidth = zss_editor.wWidth;
		}
		var winWidth = parseInt(screenWidth - 30);
		// if($("#zss_editor_content img").eq(i).parents("ul").length > 0 || $("#zss_editor_content img").eq(i).parents("ol").length > 0){
		// 	winWidth = parseInt(screenWidth-56);
		// }
		//解决打点下的图片宽度计算不对的问题
		if ($(this).parents('.record-iframe').length > 0) {
			winWidth = winWidth - 8;
		} else if ($(this).parents('.record-box').length > 0) {
			winWidth = winWidth - 20;
			if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
				if ($(this).parents('ol').length > 0) {
					var node = $(this).parents('ol');
				} else if ($(this).parents('ul').length > 0) {
					var node = $(this).parents('ul');
				}
				var level = node.attr("level") || 1;
				winWidth = winWidth - 26 - 26 * (level - 1);
			}
		} else if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
			if ($(this).parents('ol').length > 0) {
				var node = $(this).parents('ol');
			} else if ($(this).parents('ul').length > 0) {
				var node = $(this).parents('ul');
			}
			var level = node.attr("level") || 1;
			winWidth = winWidth - 26 - 26 * (level - 1);
		}
		//console.log($("#zss_editor_content img").eq(0));
		var imgRw = zss_editor.getImgurlParam(addr, 'rw');
		var imgRh = zss_editor.getImgurlParam(addr, 'rh');
		if (imgRw != null && imgRh != null && imgRw > 0 && imgRh > 0) {
			$("#zss_editor_content img").eq(i).css("opacity", 0);
			$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "#e7e8e7");
			var imgW1 = imgRw;
			var imgH1 = imgRh;
			var imgW2 = winWidth - 2;
			if (imgW1 < imgW2) {
				imgW2 = imgW1;
			}

			var imgH2 = imgW2 * imgH1 / imgW1 + 2;
			$("#zss_editor_content img").eq(i).css({"width": imgW2, "height": imgH2});
			$("#zss_editor_content img")[i].onload = function () {
				if ($("#zss_editor_content img").eq(i).parents(".drag-image-wrap").length > 0 && $("#zss_editor_content img").eq(i).parents(".drag-image-wrap").find("img").length > 1) {
					$("#zss_editor_content img").eq(i).css({"opacity": 1});
				} else {
					$("#zss_editor_content img").eq(i).css({"opacity": 1, "width": "", "height": "auto"});
				}
				$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "");
				if ($(this).parents('.drag-image-wrap').find('img').length > 1) {
					zss_editor.resetImgWidth($(this).parents('.drag-image-wrap').find('img'))
					$(this).removeAttr('owidth');
				}
			}
		} else if ($("#zss_editor_content img").eq(i).attr("data-width") && $("#zss_editor_content img").eq(i).attr("data-height")) {
			$("#zss_editor_content img").eq(i).css("opacity", 0);
			$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "#e7e8e7");
			var imgW1 = $("#zss_editor_content img").eq(i).attr("data-width");
			var imgH1 = $("#zss_editor_content img").eq(i).attr("data-height");
			var imgW2 = winWidth - 2;
			if (imgW1 < imgW2) {
				imgW2 = imgW1;

			}
			var imgH2 = imgW2 * imgH1 / imgW1 + 2;
			$("#zss_editor_content img").eq(i).css({"width": imgW2, "height": imgH2});
			$("#zss_editor_content img")[i].onload = function () {
				if ($("#zss_editor_content img").eq(i).parents(".drag-image-wrap").length > 0 && $("#zss_editor_content img").eq(i).parents(".drag-image-wrap").find("img").length > 1) {
					$("#zss_editor_content img").eq(i).css({"opacity": 1});
				} else {
					$("#zss_editor_content img").eq(i).css({"opacity": 1, "width": "", "height": "auto"});
				}
				$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "");
				if ($(this).parents('.drag-image-wrap').find('img').length > 1) {
					zss_editor.resetImgWidth($(this).parents('.drag-image-wrap').find('img'))
					if ($(this).parents('.drag-image-wrap').find('img').length > 1) {
						zss_editor.resetImgWidth($(this).parents('.drag-image-wrap').find('img'))
						$(this).removeAttr('owidth');
					}
				}
			}
		} else {
			$("#zss_editor_content img").eq(i).css({"opacity": 0, "width": "100%", "height": "200px"});
			$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "#e7e8e7");
			$("#zss_editor_content img")[i].onload = function () {
				// if($("#zss_editor_content img").eq(i).parents(".drag-image-wrap").length > 0 && $("#zss_editor_content img").eq(i).parents(".drag-image-wrap").find("img").length > 1){
				// 	$("#zss_editor_content img").eq(i).css({"opacity":1});
				// }else{
				// 	$("#zss_editor_content img").eq(i).css({"opacity":1,"width":"","height":"auto"});
				// }
				$("#zss_editor_content img").eq(i).css({"opacity": 1, "width": "", "height": "auto"});
				$("#zss_editor_content img").eq(i).parent(".editor-image").css("background-color", "");
				if ($(this).parents('.drag-image-wrap').find('img').length > 1) {
					zss_editor.resetImgWidth($(this).parents('.drag-image-wrap').find('img'))
					$(this).removeAttr('owidth');
				}
			}
		}
	})
}
zss_editor.resetImgWidth = function (imgList) {
	if (!imgList.parents('.drag-image-wrap').attr('totalWidth')) {
		return
	}
	var totalWidth = parseInt(imgList.parents('.drag-image-wrap').attr('totalWidth'));
	if (totalWidth + imgList.length * 6 > $('.editor_main').width()) {
		//防止图片没加载完就开始计算宽度
		for (var i = 0; i < imgList.length; i++) {
			if (!imgList[i].clientHeight) return
		}
		for (var i = 0; i < imgList.length; i++) {
			var scale = imgList[i].clientWidth / imgList[i].clientHeight;
			var width = parseInt(($('.editor_main').width() - imgList.length * 6) * imgList.eq(i).attr('owidth') / totalWidth);
			// imgList[i].width = width;
			imgList[i].style.width = width + 'px';
			imgList[i].style.height = parseInt(width / scale) + 'px';
			imgList[i].removeAttribute('height');
		}
		if (imgList.parents('.drag-image-wrap').find('img[owidth]').length == 0) {
			imgList.parents('.drag-image-wrap').removeAttr('totalWidth');
		}
	}
}

//置空内容
zss_editor.setContentEmpty = function () {
	$('#zss_editor_content').html("<p><br></p>");
	$('#zss_editor_tit').html("");
	zss_editor.tempTitle = "";
	zss_editor.tempContent = "";
	$('#zss_editor_content').focus();
}
//清空详情页内容
zss_editor.setPreviewEmpty = function () {
	if ($('.previewBox #zss_editor_tit #title').length > 0) {
		$('.previewBox #zss_editor_tit #title').html('');
	} else {
		$('.previewBox #zss_editor_tit').html('');
	}
	$("#preview_notice_me").html('');
	$("#zss_editor_content").html('');
}
// 替换内容
zss_editor.setContent = function (html, imgArr, isBasicEdu, datas) {
	zss_editor.isnull = false;
	if (!zss_editor.wWidth) {
		zss_editor.wWidth = $(window).width();
	}
	var width = zss_editor.wWidth - 30;
	var editor = $('#zss_editor_content');
	var content = "";
	if (isIOS) {
		content = html.content;
	} else {
		if (typeof html == 'object') {
			content = html.content;
		} else {
			content = html;
		}
	}
	//解决服务端生成的html属性用单引号时，附件不能正常显示的问题
	content = content.replace(/&apos;/g,"'")
//  var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px","g");
//	content = content.replace(reg,function() {
//      return zss_editor.fontsizeAdd(arguments[0]);
//  });
	//a链接2021.01.19
	//content=zss_editor.addLink(content);
	// 裁剪图片
	//content = content.replace(/&amp;/g, '&');
//   	content = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function () {
	//  	return imgRule(arguments[0]);
	// });
	//xss过滤
	content = content.replace(zss_editor.xssReg, function () {
		return arguments[0] + '　';
	})
	content = content.replace(/<img [^>]*src=['"]([^'"]+)chaoxing\.com([^'"]+)[^>]*>/gi, function () {
		var img = arguments[0];
		var urlReg = new RegExp("src=['\"]([^'\"]+)chaoxing\.com([^'\"]+)", 'gi');
		img = img.replace(urlReg, function () {
			return zss_editor.imgRule(arguments[0]);
		})
		return img;
	});
	content = zss_editor.replaceIframeSrc(content);
	// 匹配所有的style
	if (content.indexOf('<div class="unfilter_css">') == -1 && content.indexOf('<div class="xiumi">') == -1) {
		//var styleReg = /style\s*?=\s*?"[^=>]*"([(\s+\w+=)|>])/gi;
		var styleReg = /style\s*?=\s*?(['"])[\s\S]*?\1/gi;
		content = content.replace(styleReg, function () {
			return zss_editor.matchcss(arguments[0]);
		});
	}
	//匹配所有元素
	var eleReg = /<[^<>]+>/gi;
	content = content.replace(eleReg, function () {
		return zss_editor.matchele(arguments[0]);
	});
	//学习通设置字体缩放
	var fontSizeClass = '';
	var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px", "g");
	var type = html.zoomType;
	if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
		fontSizeClass = 'cxSize' + type;
		content = content.replace(reg, function () {
			return zss_editor.fontsizeZoomIn(arguments[0], type);
		});
	}

	if (!!datas && datas.length > 0) {
		var reolayHtml = zss_editor.replyNoticeEdit(datas, isBasicEdu);
		reolayHtml = '<p><br></p><div class="notice_main" id="notice_main">' + reolayHtml + '</div>';
		content += reolayHtml;

	}
	editor.html(content);
	//学习通设置字体缩放
	if (fontSizeClass != '') {
		$(".editorBox").addClass(fontSizeClass);
	}
	if (editor.find('[module="chart"]').length > 0) {
		renderChart(document);
	}
	//解决原站内信函那几个灰色字不能被光标定位，支持整体删除2022.02.17
	if ($("#notice_main .noticeTitle").length > 0) {
		$("#notice_main .noticeTitle").attr("contenteditable", "false");
	}

	//解决发送人时区显示问题2021.09.31
	$("#notice_main .createTime").each(function () {
		var _this = $(this);
		var dataTime = $(this).data("intime") || "";
		var time_text = _this.text();
		if (dataTime != "") {
			if (zss_editor.isnowYearByLong(dataTime)) {
				time_text = zss_editor.getFormatDateByLong(new Date(dataTime), "MM-dd hh:mm");
			} else {
				time_text = zss_editor.getFormatDateByLong(new Date(dataTime), "yyyy-MM-dd hh:mm");
			}
			_this.text(time_text);
		}
	})
	zss_editor.loadImg();
	//删除通知群聊标记2021.04.28
	$(".chatGroupDivClass").remove();
	//表格外面包裹div,实现固定宽度滑动查看表格2021.01.15
	$('table').each(function () {
		var _this = $(this);
		if (!$(this).parent().hasClass("table")) {
			_this.wrapAll('<div class="table"></div>');
		}
	})
	//iframe外面如果没有editor-iframe,必须加上,否则无法删除
	$('iframe.attach-module').each(function () {
		var _this = $(this);
		if (!$(this).parent().hasClass("editor-iframe")) {
			_this.wrapAll('<div class="editor-iframe"></div>');
		}
		//兼容教务那边动态插入通知内容，构造的iframe移动端隐藏
		if(_this.attr("mobilehide") && $(this).parent().hasClass("editor-iframe")){
			$(this).parent().hide()
		}
	})
	//处理文本框类型的a链接会被断开2021.01.19
	$('.dynacALink.iframe').each(function () {
		var $next = $(this).next();
		if ($next.hasClass('dynacALink') && $next.attr('href') == $(this).attr('href')) {
			$(this).text($next.text());
			$next.remove();
		}
	})
//去除列表li下元素的行距
	$('.editor_main li').children().each(function (index, item) {
		if (item.nodeType == 1 && item.style.lineHeight) {
			item.style.lineHeight = '';
		}
	})
	//20210422有序列表
	normaloldlist();
	//文本附件链接去掉链接跳转2021.04.16
	$("a.iframe").attr("addr", $(this).attr("href")).attr("href", "javascript:;");
	//去除pc粘贴的视频上传失败代码和图片多余2021.01.18
	$(".editor-iframe").find('.video_fail').remove();
	$(".editor-iframe").find('.attachprogress_wrap').remove();
	$(".editor-image").find(".attachhover").remove();
	//去除空p
	$("#zss_editor_content p").each(function () {
		zss_editor.removeEmptyP($(this)[0]);
	})
	//去除录音开始标记
	$(".voiceBegin").removeClass("voiceBegin");
	//内容区第一个是不可编辑，前面加空行
	//zss_editor.noEditprevEmpty($("#zss_editor_content")[0]);
	//内容区最后一个是不可编辑，后面加空行
	zss_editor.noEditnextEmpty($("#zss_editor_content")[0]);
	// $(".attach-module").attr("width",width);
	// $(".attach-module").css("width",width);
	zss_editor.updateAllIframeWidth(width);
	zss_editor.tempContent = editor.html();
	//通知插入内容,通知客户端改变高度
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知客户端实现滚动到焦点位置
		setTimeout(zss_editor.clientscrollToCursorPos, 500);
	}
	zss_editor.hasContent();
	//解决ios编辑页从下往上选择选区丢失问题
	if (isIOS) {
		$('img').parent(".editor-image").attr("contenteditable", "");
	}
	//解决图片光标位置不对问题，猜测是并排图片外层元素导致
	if ($(".drag-image-wrap").length > 0) {
		$(".drag-image-wrap").attr("contenteditable", "false");
	}
};
//更新附件src
zss_editor.replaceIframeSrc = function (content) {
	var iframeReg = /<iframe.*?(?:<\/iframe>)/gi; //匹配iframe标签
	var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配iframe中的src
	var arr = content.match(iframeReg);  //筛选出所有的iframe
	if (arr && arr.length > 0) {
		for (var i = 0; i < arr.length; i++) {
			var src = arr[i].match(srcReg)// 获取iframe src
			var module = arr[i].match(/module=[\'\"]?([^\'\"]*)[\'\"]?/i);
			if (src && src[1]) {
				iframe_src = src[1];
				if (iframe_src.indexOf("insert") > 0) {// 包含insert且不是以insert开头的才需要替换
					content = content.replace(iframe_src, iframe_src.substring(iframe_src.indexOf("insert"), iframe_src.length));
				}
				if(module && module.length > 1 && module[1] == 'insertCloud') {
					if (iframe_src.indexOf('//previewyd.chaoxing.com/res/view/view.html') > -1) {
						// 文件开启原位预览后，保存时地址要改回成insertCloud.html，避免影响手机上查看
						content = content.replace(iframe_src, 'insertCloud.html');
					}
				}
				if (iframe_src.indexOf('appswh.chaoxing.com/res/Spreadsheets/wpsPC.html') > -1) {
					// 在线表格，保存时地址要改成 insertWeb.html，避免影响手机上查看
					content = content.replace(iframe_src, 'insertWeb.html');
				}
			}
		}
	}
	return content;
}


//打开标签页面2021.06.11
zss_editor.openLabelPage = function (messageObj) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.openLabelPage(messageObj);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.openLabelPage) {
			window.webkit.messageHandlers.openLabelPage.postMessage([messageObj]);
		} else {
			if (window["openLabelPage"]) {
				window["openLabelPage"](messageObj);
			}
		}
	}
}
//编辑页创建标签2021.06.11
zss_editor.setLabelEdit = function (datas) {
//	zss_editor.setLabelEdit({"creator":0,"dataLabelArr":[{"name":"aaa","uuid":"2324","isActive":1},{"name":"reer","uuid":"23323","isActive":0},{"name":"reer","uuid":"ss","isActive":0}]})
	var div = document.createElement("div");
	div.setAttribute("class", "editor_label_box");
	div.id = "editor_label_box";
	var dataLabelArr = datas.dataLabelArr || "";
	var labelHtml = "";
	if (datas.creator && datas.creator == 1) {
		if (dataLabelArr != "" && dataLabelArr.length > 0 && !(dataLabelArr.length == 1 && dataLabelArr[0].uuid == 'choice-topic')) {
			for (var l = 0; l < dataLabelArr.length; l++) {
				if (dataLabelArr[l].uuid) {
					if (dataLabelArr[l].isActive && dataLabelArr[l].isActive == 1) {
						labelClass = "editor_label_item active";
						//存储标签初始标蓝id2021.06.16
						zss_editor.tempLabel.push(dataLabelArr[l].uuid);
					} else {
						labelClass = "editor_label_item";
					}
					labelHtml += '<span class="' + labelClass + '" uuid="' + dataLabelArr[l].uuid + '"><em>' + dataLabelArr[l].name + '</em></span>';
				}

			}
//			if(datas.discuss && datas.discuss == 1){
//				labelHtml += '<span class="editor_label_manage"><i></i><em>讨论区管理</em></span>';
//			}else{
//				labelHtml += '<span class="editor_label_manage"><i></i><em>标签管理</em></span>';
//			}
			labelHtml += '<span class="editor_label_manage"><i></i><em>标签管理</em></span>';

		} else {
			labelHtml += '<span class="editor_label_add"><i></i><em>选择标签</em></span>';
		}
	} else {
		if (dataLabelArr != "" && dataLabelArr.length > 0) {
			for (var l = 0; l < dataLabelArr.length; l++) {
				if (dataLabelArr[l].uuid) {
					if (dataLabelArr[l].isActive && dataLabelArr[l].isActive == 1) {
						labelClass = "editor_label_item active";
					} else {
						labelClass = "editor_label_item";
					}
					labelHtml += '<span class="' + labelClass + '" uuid="' + dataLabelArr[l].uuid + '"><em>' + dataLabelArr[l].name + '</em></span>';
				}

			}

		}
	}
	if (labelHtml != "") {
		div.innerHTML = labelHtml;
		var activeArr = [];
		$("#editor_label_box .editor_label_item").each(function () {
			if ($(this).hasClass("active")) {
				activeArr.push($(this).attr("uuid"));
			}
		})
		$("#editor_label_box").remove();
		$(".editorBox").before(div);
		//只有一个标签滚动到标签可显示
		if ($("#editor_label_box .editor_label_item.active").length == 1) {
			var offsetLeft = $("#editor_label_box .editor_label_item.active")[0].offsetLeft;
			var maxWidth = $(window).width() - $("#editor_label_box .editor_label_item.active").outerWidth();
			if (offsetLeft > maxWidth) {
				$("#editor_label_box").scrollLeft(offsetLeft - maxWidth)
			}

		}
		//精华标签的uuid是choice-topic，脚本需要将uuid为这个的标签隐藏掉
		$("#editor_label_box .editor_label_item").each(function () {
			if ($(this).attr("uuid") == 'choice-topic') {
				$(this).remove();
			}
		})
		if (activeArr.length > 0) {
			for (var i = 0; i < activeArr.length; i++) {
				$("#editor_label_box .editor_label_item[uuid=" + activeArr[i] + "]").addClass("active");
			}
		}
	}
}
//获取标签选中2021.06.11
zss_editor.getLabelEditData = function () {
	var activeArr = [];
	$("#editor_label_box .editor_label_item").each(function () {
		if ($(this).hasClass("active")) {
			activeArr.push($(this).attr("uuid"));
		}
	})
	return JSON.stringify(activeArr);
}
zss_editor.replyNoticeEdit = function (datas, isBasicEdu) {
	if (!zss_editor.wWidth) {
		zss_editor.wWidth = $(window).width();
	}
	var w = zss_editor.wWidth;
	if (zss_editor.isEnLanguage()) {
		zss_editor.noticeInfor.title = "Original Station Letter";
		zss_editor.noticeInfor.to = "To:";
		zss_editor.noticeInfor.read = "Read:";
		zss_editor.noticeInfor.cc = "Cc:";
	}
	var dhtml = "";
	for (var i = 0; i < datas.length; i++) {
		var title = datas[i].title || '';
		var createrName = datas[i].createrName || '';
		var createrPuid = datas[i].createrPuid || '';
		var sendTime = datas[i].insertTime || '';
		var insertTimestamp = datas[i].insertTimestamp || '';
		var dataTime = insertTimestamp != '' ? (' data-intime="' + insertTimestamp + '"') : '';
		var id = datas[i].id || '';
		var dataReceiverArray = datas[i].receiverArray || '';
		var receiverArray = "";
		if (dataReceiverArray != "") {
			for (var l = 0; l < dataReceiverArray.length; l++) {
				if (dataReceiverArray[l].puid) {
					receiverArray += '<span class="createTo_name" data-id="' + dataReceiverArray[l].puid + '">' + dataReceiverArray[l].name + '</span>、';
				} else {
					receiverArray += '<span class="createTo_name">' + dataReceiverArray[l].name + '</span>、';
				}
			}
			if (receiverArray.length > 0) {
				receiverArray = receiverArray.substr(0, receiverArray.length - 1);
			}
		}
		var tocc = datas[i].tocc || "";
		var toccArray = "";
		if (tocc != "") {
			for (var t = 0; t < tocc.length; t++) {
				if (tocc[t].puid) {
					toccArray += '<span class="createToCc_name" data-id="' + tocc[t].puid + '">' + tocc[t].name + '</span>、';
				} else {
					toccArray += '<span class="createToCc_name">' + tocc[t].name + '</span>、';
				}

			}
			if (toccArray.length > 0) {
				toccArray = toccArray.substr(0, toccArray.length - 1);
			}
		}
		var count_read = datas[i].count_read || 0;
		var count_all = datas[i].count_all || 0;
		var rtf_content = datas[i].rtf_content || '';
		rtf_content = zss_editor.matchPreview(rtf_content, w, isBasicEdu);
		var node = document.createElement("div");
		node.innerHTML = rtf_content;
		var noticeLiHtml = "";
		if ($(node).find(".notice_main").length > 0) {
			$(node).find(".notice_main").each(function () {
				noticeLiHtml += $(this).html();
			})
			$(node).find(".notice_main").remove();
		}

		dhtml += '<div class="noticeLi" data-noticeId=' + id + '>' +
			'<div class="noticeTitle" contenteditable="false">' +
			'<p>' + zss_editor.noticeInfor.title + '</p>' +
			'</div>' +
			'<div class="noticeHead">' +
			'<div class="noticeHead_title">' + title + '</div>' +
			'<div class="noticeItem noticeHead_from">' +
			'<span class="createName" data-id="' + createrPuid + '">' + createrName + '</span><span class="createTime"' + dataTime + '>' + sendTime + '</span>' +
			'</div>';
		if (receiverArray.length > 0) {
			dhtml += '<div class="noticeItem noticeHead_item"><div class="words2"><span class="createFrom">' + zss_editor.noticeInfor.to + '</span><span class="createTo">' + receiverArray + '</span></div></div>';
		}
		if (toccArray.length > 0) {
			dhtml += '<div class="noticeItem noticeHead_item"><span class="createFrom">' + zss_editor.noticeInfor.cc + '</span><span class="createTo">' + toccArray + '</span></div>';
		}
		if (datas[i].hasSendsign == 1 && count_all > 1) {
			dhtml += '<div class="noticeItem noticeHead_row"><span class="createCount">' + zss_editor.noticeInfor.read + '</span><span><span>' + count_read + '</span>';
			if (datas[i].status != -1) {
				dhtml += '/<span>' + count_all + '</span>';
			}
			dhtml += '</span></div>';
		}
		dhtml += '</div>' +
			'<div class="noticeContent">' + node.innerHTML + '</div>' +
			'</div>' + noticeLiHtml;
	}

	return dhtml;


}
zss_editor.getRandomId = function () {
	var str = "abcdefghijklmnopqrstuvwxyz0123456789";
	var tmp = [];
	var random;
	for (var i = 0; i < 8; i++) {
		random = Math.floor(Math.random() * (str.length));
		if (tmp.indexOf(str[random]) === -1) {
			tmp.push(str[random])
		} else {
			i--;
		}
	}
	return tmp.join('');
}
zss_editor.getAllImage = function () {
	var imageUrl = [];
	$("#zss_editor_content .editor-image img").each(function () {
		var src = $(this).attr("src");
		if(src.indexOf("p.ananas.chaoxing") > -1){
			src = src.replace(/\/\d*_\d*Q50\//gi, '/origin/');
		}
		if (src == '' && $(this).attr("_src").indexOf("p.ananas.chaoxing") < 0) {
			src = $(this).attr("_src");
		}
		imageUrl.push(src);
	});
	return JSON.stringify(imageUrl);
};
zss_editor.getAllImageId = function () {
	var imageId = [];
	$("#zss_editor_content .editor-image img").each(function () {
		imageId.push($(this).attr("objectid"));
	});
	return JSON.stringify(imageId);
};
// 去除空标签
zss_editor.removeEmptyP = function (first) {
	var firstValue = $(first).html().replace(/\n/g, "").replace(/ /g, "");//去除标签中间的换行和空格
	var newp = document.createElement('p');
	newp.innerHTML = firstValue;
	firstValue = newp.innerText;
	newp.remove();
	if ((first.nodeName != 'BR' || first.nodeName != 'HR') && firstValue == '' && $(first).find('br').length == 0 && $(first).find('img').length == 0 && $(first).find('iframe').length == 0) {
		first.remove();
	}

}
zss_editor.removeZeroText = function (pi) {
	if ($(pi).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') != '') {
		$(pi).html($(pi).html().replace(new RegExp("​", 'g'), ''));
	}
}
//内容区第一个是不可编辑，前面加空行
zss_editor.noEditprevEmpty = function (h) {
	var first = h.firstChild;
	while (first != h.lastChild) { //循环到第一个元素截止

		if (!first) {
			break;
		}
		if (first.nodeType == 1) {
			var firstValue = $(first).html().replace(/\n/g, "").replace(/ /g, "");//去除标签中间的换行和空格
			var newp = document.createElement('p');
			newp.innerHTML = firstValue;
			firstValue = newp.innerText;
			newp.remove();
			if (first.getAttribute('contenteditable') && first.getAttribute('contenteditable') == 'false') {
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				p.appendChild(document.createElement('br'))
				first.parentNode.insertBefore(p, first);
				break;
			} else if ((first.nodeName != 'BR' || first.nodeName != 'HR') && firstValue == '' && $(first).find('br').length == 0 && $(first).find('img').length == 0 && $(first).find('iframe').length == 0) {
				first = first.nextSibling;
			} else if (first.nodeName == 'BR' || first.nodeName == 'HR') {
				first = first.nextSibling;
			} else {
				first = first.firstChild;
			}
		} else {
			break;
		}

	}
}
//内容区最后一个是不可编辑，后面加空行
zss_editor.noEditnextEmpty = function (h) {
	var last = h.lastChild;
	while (last != h.firstChild) { //循环到第一个元素截止

		if (!last) {
			break;
		}
		if (last.nodeType == 1) {
			if (last.getAttribute('contenteditable') && last.getAttribute('contenteditable') == 'false') {
				var p = document.createElement('p');
				//2022.05.11协同编辑加elementid
				p.setAttribute('element-id', zss_editor.getRandomId());
				p.appendChild(document.createElement('br'))
				last.after(p);
				break;
			} else if ((last.nodeName != 'BR' || last.nodeName != 'HR') && $(last).text().replace(/\s+/g, "") == '' && $(last).find('br').length == 0 && $(last).find('img').length == 0 && $(last).find('iframe').length == 0) {
				last = last.previousSibling;
			} else if (last.nodeName == 'BR' || last.nodeName == 'HR') {
				last = last.previousSibling;
			} else {
				last = last.lastChild;
			}
		} else {
			break;
		}

	}
}
// 获取内容
zss_editor.getContent = function () {
	// Get the contents

	//内容区第一个是不可编辑，前面加空行
//  zss_editor.noEditprevEmpty($("#zss_editor_content")[0]);
	//内容区最后一个是不可编辑，后面加空行
	zss_editor.noEditnextEmpty($("#zss_editor_content")[0]);
	var cloneWrap = $("#zss_editor_content").clone(true);
	//去除空p
	cloneWrap.find("#zss_editor_content p").each(function (index) {
		zss_editor.removeEmptyP($(this)[0]);
	});
	// 去除图片占位的灰色框,解决详情页图片不显示的情况
	cloneWrap.find("#zss_editor_content .editor-image").find("img").css({
		"opacity": 1,
		"width": "auto",
		"height": "auto"
	});
	cloneWrap.find("#zss_editor_content .editor-image").css("background-color", "");

	// 去除打点时间标蓝
	cloneWrap.find(".record-list-tit").removeClass('record-tit-cur');
	//文本附件链接去掉链接跳转2021.04.16
	cloneWrap.find("a.iframe").attr("href", $(this).attr("addr")).removeAttr("addr");
	//解决ios编辑页设置图片可编辑导致pc图片会出问题
	cloneWrap.find('img').parent(".editor-image").attr("contenteditable", "false");
	var h = cloneWrap.html();
//  var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px","g");
// 	h = h.replace(reg,function() {
//      return zss_editor.fontsizeReduce(arguments[0]);
//  });
//	学习通设置的变化字体要变回来
	var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px", "g");
	if ($("#zss_editor_content").attr("class").indexOf("cxSize") > -1) {
		var fontClass = $("#zss_editor_content").attr("class");
		var fontType = parseInt(fontClass.substring(fontClass.lastIndexOf("cxSize") + 6, fontClass.lastIndexOf("cxSize") + 7));
		if (fontType == 0 || fontType == 2 || fontType == 3 || fontType == 4) {
			h = h.replace(reg, function () {
				return zss_editor.fontsizeZoomOut(arguments[0], fontType);
			});
		}
	}
	//去掉附件src中#后面的内容，影响内容变化比对
	h = h.replace(/src\s*=\s*"\S*.html#\S*"/gi, function () {
		return arguments[0].replace(/#\S*"/gi, '"');
	})
	//替换图片地址为原图地址2021.06.03
	h = h.replace(/<img [^>]*src=['"]([^'"]+)chaoxing\.com([^'"]+)[^>]*>/gi, function () {
		var img = arguments[0];
		var urlReg = new RegExp("src=['\"]([^'\"]+)chaoxing\.com([^'\"]+)", 'gi');
		img = img.replace(urlReg, function () {
			return arguments[0].replace(/\/\d*_\d*Q50\//gi, '/origin/');
		})
		return img;
	});
	// 匹配所有的style
	if (h.indexOf('<div class="unfilter_css">') == -1 && h.indexOf('<div class="xiumi">') == -1) {
		var styleReg = /style\s*?=\s*?(['"])[\s\S]*?\1/gi;
		h = h.replace(styleReg, function () {
			return zss_editor.matchcss(arguments[0]);
		});
	}
	//匹配所有元素
	var eleReg = /<[^<>]+>/gi;
	h = h.replace(eleReg, function () {
		return zss_editor.matchele(arguments[0]);
	});
	//空标签返回空，解决详情页内容多空白行,兼容4.2.7.7以前版本，不能返回空，影响笔记客户端判断
	var version = null;
	if (isIOS) {
		version = zss_editor.versionSame('4.2.7.7');
	}
	if (version || isAndroid) {
		if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			h = "";
		}
	}
	return h;
};
//获取旧版数据格式内容
zss_editor.getEditContent = function () {

	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		address: 1,
		blockquote: 1,
		center: 1,
		dir: 1,
		div: 1,
		dl: 1,
		fieldset: 1,
		form: 1,
		h1: 1,
		h2: 1,
		h3: 1,
		h4: 1,
		h5: 1,
		h6: 1,
		hr: 1,
		isindex: 1,
		menu: 1,
		noframes: 1,
		ol: 1,
		p: 1,
		pre: 1,
		table: 1,
		ul: 1,
		li: 1
	});
	// 列表添加符号
	var $wrap = $("#zss_editor_content").clone(true);
	//去除空p
	$wrap.find("p").each(function () {
		zss_editor.removeEmptyP($(this)[0]);
	})
	$wrap.find("ol li").each(function () {
		//20210430
		var serialnum = $(this).attr('serialnum') || $(this).index();
		$(this).prepend(serialnum + ". ");
	});
	$wrap.find("ul li").each(function () {
		var level = parseInt($(this).parent().attr('level')) || 1;
		switch (level % 3) {
			case 0:
				$(this).prepend("    ▪ ");
				break;
			case 1:
				$(this).prepend("• ");
				break;
			case 2:
				$(this).prepend("  ◦ ");
				break;
			default:
				break;
		}
	});
	$wrap.find(".record-list-tit").remove();
	var html = $wrap.html();
	// 图片替换
	$("#zss_editor_content img").each(function () {
		if ($(this).attr("objectid")) {
			var objectid = $(this).attr("objectid");
			html = html.replace($(this).prop("outerHTML"), "（№♂◎┟ξψ┽" + objectid + "）");
		} else {
			html = html.replace($(this).prop("outerHTML"), '');
		}
	});
	// html = html.replace(new RegExp(' ','g'),'');
	html = html.replace(/>\s+</gi, '><').replace(/>\s+/gi, '>').replace(/\s+</gi, '<');
	html = html.replace(/[\n\r]/g, '');

	html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
		.replace(/<iframe[\s\S]*?>\s*<\/iframe>/gi, '')
		.replace(/<br\/?>/gi, '\n')
		.replace(/<[^>/]+>/g, '')
		.replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
			return dtd[c] ? '\n' : b ? b : '';
		});

	//替换所有标签，取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
	var reg = new RegExp("<\/?[^>]*>", 'g');
	html = html.replace(reg, '').replace(/\u00a0/g, ' ');
	//去除0宽字符
	html = html.replace(/\u200B/g, '').replace(/&#8203;/g, '');
	// 处理转义字符
	html = html.replace(/&nbsp;/g, ' ').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\u200B/g, '').replace(/&#8203;/g, '');
	return html;

};
// 通知富文本获取旧版数据格式内容
zss_editor.getNoticeEditContent = function () {

	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		address: 1,
		blockquote: 1,
		center: 1,
		dir: 1,
		div: 1,
		dl: 1,
		fieldset: 1,
		form: 1,
		h1: 1,
		h2: 1,
		h3: 1,
		h4: 1,
		h5: 1,
		h6: 1,
		hr: 1,
		isindex: 1,
		menu: 1,
		noframes: 1,
		ol: 1,
		p: 1,
		pre: 1,
		table: 1,
		ul: 1,
		li: 1
	});
	// 列表添加符号
	var $wrap = $("#zss_editor_content").clone(true);
	//去除空p
	$wrap.find("p").each(function () {
		zss_editor.removeEmptyP($(this)[0]);
	})
	$wrap.find("ol li").each(function (index, li) {
		//20210430
		var serialnum = $(this).attr('serialnum') || $(this).index();
		$(this).prepend(serialnum + ". ");
	});
	$wrap.find("ul li").each(function () {
		var level = parseInt($(this).parent().attr('level')) || 1;
		switch (level % 3) {
			case 0:
				$(this).prepend("    ▪ ");
				break;
			case 1:
				$(this).prepend("• ");
				break;
			case 2:
				$(this).prepend("  ◦ ");
				break;
			default:
				break;
		}
	});
	$wrap.find(".editor-image,.editor-iframe").each(function () {
		var _this = $(this);
		if (_this.next().text().replace(new RegExp("​", 'g'), '') == '') {
			_this.next().remove();
		}
		_this.remove();
	});
	$wrap.find("img").remove();
	var html = $wrap.html();
	//空标签返回空，解决详情页内容多空白行,兼容4.2.7.7以前版本，不能返回空，影响笔记客户端判断
	var version = null;
	if (isIOS) {
		version = zss_editor.versionSame('4.2.7.7');
	}
	if (version || isAndroid) {
		if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			html = "";
		}
	}
	// html = html.replace(new RegExp(' ','g'),'');
	html = html.replace(/>\s+</gi, '><').replace(/>\s+/gi, '>').replace(/\s+</gi, '<');
	html = html.replace(/[\n\r]/g, '');

	html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
		.replace(/<iframe[\s\S]*?>\s*<\/iframe>/gi, '')
		.replace(/<br\/?>/gi, '\n')
		.replace(/<[^>/]+>/g, '')
		.replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
			return dtd[c] ? '\n' : b ? b : '';
		});

	//替换所有标签，取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
	var reg = new RegExp("<\/?[^>]*>", 'g');
	html = html.replace(reg, '').replace(/\u00a0/g, ' ');
	//去除0宽字符
	html = html.replace(/\u200B/g, '').replace(/&#8203;/g, '');
	// 处理转义字符
	html = html.replace(/&nbsp;/g, ' ').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\u200B/g, '').replace(/&#8203;/g, '');
	return html;

};
// 获取标题和内容
zss_editor.getTitleAndContent = function () {

	var title = zss_editor.getTitle();

	// Get the contents
	var content = zss_editor.getContent();

	var version = zss_editor.versionSame('4.2.7.7');

	if (version) {
		if ($('#zss_editor_tit').text().replace(/\s+/g, "") == '') {
			title = "";
		}
		if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			content = "";
		}
	} else {
		if ($('#zss_editor_tit').text().replace(/\s+/g, "") == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			//zss_editor.isExistContent(false);
			title = "";
			content = "";
		}
	}

	//ios
	if (isIOS) {
		return JSON.stringify([title, content]);
	}
};
// 获取标题和内容,WKWebview要用的
zss_editor.getAllData = function () {
	if ($("body").hasClass('editorNoticeWrap')) {
		var title = "";
	} else {
		var title = zss_editor.getTitle();
	}

	// Get the contents
	var content = zss_editor.getContent();
	var version2 = null;
	if (isIOS) {
		version2 = zss_editor.versionSame('4.8.4.4');
	}
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		version2 = zss_editor.versionSame('4.8.4.2');
	}
	if (version2) {
		var iframeReg = new RegExp('<\\s*span[^>]*?><ui-attachment[^>]*?>\\s*<\/ui-attachment><\/span>', 'gi');
		content = content.replace(iframeReg, function () {
			var str = arguments[0];
			str = str.replace(/<\s*span[^>]*?><ui-attachment/gi, '<iframe');
			str = str.replace(/<\/ui-attachment><\/span>/gi, '</iframe>');
			return str;
		})
	} else {
		var iframeReg = new RegExp('<\\s*div[^>]*?><ui-attachment[^>]*?>\\s*<\/ui-attachment><\/div>', 'gi');
		content = content.replace(iframeReg, function () {
			var str = arguments[0];
			str = str.replace(/<\s*div[^>]*?><ui-attachment/gi, '<iframe');
			str = str.replace(/<\/ui-attachment><\/div>/gi, '</iframe>');
			return str;
		})
	}
	var textSome = zss_editor.getTextSome();
	var imageUrl = [];
	var editContent = zss_editor.getEditContent();
	var noImgEditContent = zss_editor.getNoticeEditContent();
	$("#zss_editor_content .editor-image img").each(function () {
		if ($(this).attr("src")) {
			var src = $(this).attr("src");
			if(src.indexOf("p.ananas.chaoxing") > -1){
				src = src.replace(/\/\d*_\d*Q50\//gi, '/origin/');
			}
			imageUrl.push(src);
		}
	});

	var version = null;
	if (isIOS) {
		version = zss_editor.versionSame('4.2.7.7');
	}
	if (version || isAndroid) {
		if ($('#zss_editor_tit').text().replace(/\s+/g, "") == '') {
			title = "";
		}
		if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			content = "";
			editContent = "";
		}
	} else {
		if ($('#zss_editor_tit').text().replace(/\s+/g, "") == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			//zss_editor.isExistContent(false);
			title = "";
			content = "";
			editContent = "";
		}
	}
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var annex = zss_editor.getAnnex().toString();
		return [title, content, textSome, annex, editContent, noImgEditContent];
	}
	//ios
	if (isIOS) {
		var annex = zss_editor.getAnnex();
		return JSON.stringify([title, content, textSome, annex, imageUrl, editContent]);
	}
};
// 获取文本
zss_editor.getText = function () {
	return $('#zss_editor_content').text().replace(new RegExp("​", 'g'), '');
};
// 获取内容简介
zss_editor.getTextSome = function () {
	var allText = $('#zss_editor_content').text();
	allText = allText.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/\u200B/g, '').replace(/&#8203;/g, '');
	var allNumbers = $("#zss_editor_content").text().length;
	var someNumbers = 100;
	var someText;
	if (allNumbers > someNumbers) {
		someText = allText.substring(0, someNumbers);

	} else {
		someText = allText.substring(0, allNumbers);

	}
	return someText;
};
//去除所有标签
zss_editor.getPlainTxt = function (html) {

	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		address: 1,
		blockquote: 1,
		center: 1,
		dir: 1,
		div: 1,
		dl: 1,
		fieldset: 1,
		form: 1,
		h1: 1,
		h2: 1,
		h3: 1,
		h4: 1,
		h5: 1,
		h6: 1,
		hr: 1,
		isindex: 1,
		menu: 1,
		noframes: 1,
		ol: 1,
		p: 1,
		pre: 1,
		table: 1,
		ul: 1
	});

// html = html.replace(/[\n\r]/g, '');//ie要先去了\n在处理
// 处理换行
	html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
		.replace(/<iframe[\s\S]*?>\s*<\/iframe>/gi, '')
		.replace(/<br\/?>/gi, '\n')
		.replace(/<[^>/]+>/g, '')
		.replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
			return dtd[c] ? '\n' : b ? b : '';
		});
//替换所有标签，取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
	var reg = new RegExp("<\/?[^>]*>", 'g');
	html = html.replace(reg, '').replace(/\u00a0/g, ' ');
// 处理转义字符
	html = html.replace(/&nbsp;/g, ' ').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\u200B/g, '').replace(/&#8203;/g, '');
	html = html.replace(zss_editor.xssReg, function () {
		return arguments[0] + '　';
	})
	return html;
}
// 替换标题
zss_editor.setTitle = function (title) {
	title = title.replace(/&/g, "&amp;").replace(/ /g, '&nbsp;').replace(/&amp;apos;/g, "'");
	var node = $("#zss_editor_tit");
	var newnode = $("#zss_editor_tit").find("#title");
	if (newnode && newnode.length > 0) {
		node = newnode;
	}
	node.html(title);
	zss_editor.tempTitle = node.html();
	zss_editor.hasContent();
};
// 获取标题
zss_editor.getTitle = function () {
	var title = $("#zss_editor_tit").html();
	title = zss_editor.getPlainTxt(title);
	return title;
};
//替换标题内容的提示语
zss_editor.setPlaceHolder = function (title, content) {
	if (!!title) {
		$("#zss_editor_tit").attr("placeholder", title);
	}
	if (!!content) {
		$("#zss_editor_content").attr("placeholder", content);
	}
}

zss_editor.removeStyle = function (element, name) {
	if (element.style.removeProperty) {
		element.style.removeProperty(name);
	} else {
		element.style.removeAttribute(zss_editor.cssStyleToDomStyle(name));
	}

};
//比对内容
zss_editor.contrastAllData = function () {
	var oldTitle = zss_editor.tempTitle || "";
	var oldContent = zss_editor.tempContent || "";
	var newTitle = $("#zss_editor_tit").html();
	var newContent = document.getElementById("zss_editor_content").innerHTML;
	//标签初始标蓝2021.06.16
	var oldLabelArr = zss_editor.tempLabel || [];
	//当前标签标蓝2021.06.16
	var newLabelArr = [];
	$("#editor_label_box .editor_label_item").each(function () {
		if ($(this).hasClass("active")) {
			newLabelArr.push($(this).attr("uuid"));
		}
	})
	var imgReg = /(editor-image|<img).*?(?:>|\/>)/gi; //匹配所有img和含editor-image的div
	// var styleReg = /style=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的style
	var styleReg = /style\s*?=\s*?(['"])[\s\S]*?\1/gi;
	oldContent = oldContent.replace(imgReg, function () {
		return arguments[0].replace(styleReg, '');
	});
	newContent = newContent.replace(imgReg, function () {
		return arguments[0].replace(styleReg, '');
	});
	var iframeReg = new RegExp('<\\s*iframe([\\s\\S]*?)>\\s*<\/iframe>', 'gi');
	oldContent = oldContent.replace(iframeReg, function () {
		return arguments[0].replace(styleReg, '');
	});
	newContent = newContent.replace(iframeReg, function () {
		return arguments[0].replace(styleReg, '');
	});
	//去除.html#后面的内容
	oldContent = oldContent.replace(/src\s*=\s*"\S*.html#\S*"/gi, function () {
		return arguments[0].replace(/#\S*"/gi, '"');
	})
	newContent = newContent.replace(/src\s*=\s*"\S*.html#\S*"/gi, function () {
		return arguments[0].replace(/#\S*"/gi, '"');
	})
	if ($("body").hasClass('editorNoticeWrap')) {
		if (oldContent == newContent) {
			return true;
		} else if (oldContent == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			return true;
		} else if (zss_editor.isnull == true && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			return true;
		} else {
			return false;
		}
	} else {
		if (oldTitle == newTitle && oldContent == newContent && JSON.stringify(oldLabelArr.sort()) === JSON.stringify(newLabelArr.sort())) {
			return true;
		} else if (oldTitle == newTitle && oldContent == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0 && JSON.stringify(oldLabelArr.sort()) === JSON.stringify(newLabelArr.sort())) {
			return true;
		} else if (zss_editor.isnull == true && $('#zss_editor_tit').text().replace(/\s+/g, "") == '' && $('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
			return true;
		} else {
			return false;
		}
	}

}
zss_editor.isCommandEnabled = function (commandName) {
	return document.queryCommandState(commandName);
}
zss_editor.enabledEditingItems = function (e) {
	function formatColor(str) {
		var newstr = str.replace(/(rgb\()|(\))/g, '');
		var arr = newstr.split(',');
		var res = '#';
		for (var i = 0; i < arr.length; i++) {
			var val = arr[i];
			res += fillZero(switchNumToSixteen(parseInt(val)));
		}
		return res;
	}

	function switchNumToSixteen(num) {
		return num.toString(16);
	}

	function fillZero(str) {
		if (parseInt(str, 16) < 16) {
			return '0' + str;
		}
		return str;
	}

	function formatStr(str) {
		return str.replace(/(rgb\().+?(\))/g, function () {
			return formatColor(arguments[0]);
		});
	}

	var items = {};
	if (zss_editor.isCommandEnabled('bold')) {
		//items.push({'bold':true});
		items.bold = true;
	}
	if (zss_editor.isCommandEnabled('italic')) {
		//items.push({'italic':true});
		items.italic = true;
	}
	if (zss_editor.isCommandEnabled('strikeThrough')) {
		//items.push({'strikeThrough':true});
		items.strikeThrough = true;
	}
	if (zss_editor.isCommandEnabled('underline')) {
		//items.push({'underline':true});
		items.underline = true;
	}
	if (zss_editor.isCommandEnabled('insertOrderedList')) {
		//items.push({'orderedList':true});
		items.orderedList = true;
	}
	if (zss_editor.isCommandEnabled('insertUnorderedList')) {
		//items.push({'unorderedList':true});
		items.unorderedList = true;
	}
	if (zss_editor.isCommandEnabled('justifyCenter')) {
		//items.push({'justifyCenter':true});
		items.justifyCenter = true;
	}
	if (zss_editor.isCommandEnabled('justifyLeft')) {
		//items.push({'justifyLeft':true});
		items.justifyLeft = true;
	}
	if (zss_editor.isCommandEnabled('justifyRight')) {
		//items.push({'justifyRight':true});
		items.justifyRight = true;
	}
	if (undoManagerhasUndo == true) {
		items.hasUndo = true;
	} else {
		items.hasUndo = false;
	}
	if (undoManagerhasRedo == true) {
		items.hasRedo = true;
	} else {
		items.hasRedo = false;
	}
	//    var formatBlock = document.queryCommandValue('formatBlock');
	// if (formatBlock.length > 0) {
	// 	items.push(formatBlock.toLowerCase());
	// }

	var t, nodeName = null,
		hasImageInfo = false,
		caption;

	// Use jQuery to figure out those that are not supported
	if (!!e && !!e.target) {
		nodeName = e.target.nodeName.toLowerCase();
		t = $(e.target);
	}

	if (!nodeName || nodeName === '#document') {
		var selection = window.getSelection();
		if (selection.rangeCount > 0) {
			var range = window.getSelection().getRangeAt(0);
			t = $(range.startContainer);
		} else {
			t = $("#zss_editor_content");
		}
		if (t.length > 0) {
			if (t[0].nodeType == 3) {
				t = t.parent();
			}
			nodeName = t[0].nodeName.toLowerCase();
		} else {
			nodeName = null;
		}
	}

	if (nodeName !== null) {
		// Background Color
		try {
			var bgColor = t.css('backgroundColor');
			if (bgColor && bgColor.length != 0 && bgColor != 'rgba(0, 0, 0, 0)' && bgColor != 'rgb(0, 0, 0)' && bgColor != 'transparent') {
				bgColor = formatStr(bgColor);
				if (bgColor == "#ffd696") {
					//items.push({'backgroundcolor':true});
					items.backgroundcolor = true;
				}
			} else {
				items.backgroundcolor = false;
			}
		} catch (e) {

		}

		// Text Color
		try {
			var textColor = t.css('color');
			if (textColor && textColor.length != 0 && textColor != 'rgba(0, 0, 0, 0)' && textColor != 'rgb(0, 0, 0)' && textColor != 'transparent') {
				textColor = formatStr(textColor);
				// var textarr = ["#df402a","#f9973b","#7ea72e","#ae5da1","#a6a8a9","#333333"];
				var textarr = ["#333333", "#df402a", "#f9973b", "#7ea72e", "#ae5da1", "#a6a8a9"];
				var textindex = textarr.indexOf(textColor);
				//items.push({'textcolor':textindex});
				items.textcolor = textindex;
			}
		} catch (e) {

		}
		try {
			var fontsize = t.css('font-size');
			if (fontsize.length != 0 && fontsize != '') {
				var fontarr = ["14px", "16px", "21px", "25px"];
				var fontindex = fontarr.indexOf(fontsize);
				//items.push({'fontsize':fontindex});
				items.fontsize = fontindex;
			}
		} catch (e) {

		}
		try {
			if ($(t).is('ol') || $(t).parents('ol').length > 0) {

				items.orderedList = true;
			}
		} catch (e) {

		}
		try {
			if ($(t).is('ul') || $(t).parents('ul').length > 0) {

				items.unorderedList = true;
			}
		} catch (e) {

		}


	}
	if (zss_editor.editorClientType == true) {
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			var value = JSON.stringify(items);
			javaJs.onEditingItemStatusChanged(value);
			return value;
		}
		if (isIOS) {
			return JSON.stringify(items);
		}
	} else {
		jsBridge.postNotification('CLIENT_EDITOR_A_PANNEL_STATUS', items);
	}
}
zss_editor.focusEditor = function (infor) {
	if (!!infor) {
		var infor = JSON.parse(infor);
		var id = infor.id;
		var offsetX = infor.offsetX;
		var offsetY = infor.offsetY;
		if (infor.index <= -1 || (id && id == 'zss_editor_tit')) {
			zss_editor.focusLast();
			return false;
		}
		//2020.09.01教案编辑器课前课中课后显示
		if (infor.status) {
			var status = infor.status;
			if (status == "classBefore") {
				$(".classBefore").parent().addClass("cur_li").siblings().removeClass("cur_li");
				$(".classConBefore").show();
				$(".classConCenter,.classConAfter").hide();
			}
			if (status == "classCenter") {
				$(".classCenter").parent().addClass("cur_li").siblings().removeClass("cur_li");
				$(".classConCenter").show();
				$(".classConBefore,.classConAfter").hide();
			}
			if (status == "classAfter") {
				$(".classAfter").parent().addClass("cur_li").siblings().removeClass("cur_li");
				$(".classConAfter").show();
				$(".classConBefore,.classConCenter").hide();
			}
			zss_editor.focusLast();

		}

		if (id && id == "title") {
			$("#zss_editor_tit").focus();
			var sel = window.getSelection();
			var range = sel.getRangeAt(0);
			var node = $("#zss_editor_tit");
			var pack = node[0];
			var fontSize = parseInt(node.css("font-size"));
			var lineHeight = parseInt(node.css("line-height"));
			var divWidth = zss_editor.wWidth - 30;
			var rowLen = parseInt(divWidth / fontSize); //一行显示的字数
			var row = Math.floor(offsetY / lineHeight);
			var x = Math.ceil(offsetX / fontSize);
			var len = rowLen * row + x;
			if (pack.firstChild.length > 0) {
				if (len > pack.firstChild.length) {
					len = pack.firstChild.length;
				}
				range.selectNodeContents(pack);
				range.collapse(true);
				range.setStart(pack.firstChild, len)
				range.setEnd(pack.firstChild, len)
			} else {
				range.selectNodeContents(pack);
				range.collapse(true);
				range.setStart(pack.firstChild, 0)
				range.setEnd(pack.firstChild, 0)
			}
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (infor.name) {
			var name = infor.name;
			var index = infor.index;
			$('#zss_editor_content').focus();
			var sel = window.getSelection();
			var range = sel.getRangeAt(0);
			var node = $("#zss_editor_content").find($(name));
			var pack = node[index];
			var fontSize = parseInt(node.css("font-size"));
			var lineHeight = parseInt(node.css("line-height"));
			var divWidth = zss_editor.wWidth - 30;
			var rowLen = parseInt(divWidth / fontSize); //一行显示的字数
			var row = Math.floor(offsetY / lineHeight);
			var x = Math.ceil(offsetX / fontSize);
			var len = rowLen * row + x;

			function getTextNodesDeep(elem, opt_filter) {
				var textNodes = [];
				if (elem) {
					var nodes = elem.childNodes, nub = nodes.length;
					for (var i = 0; i < nub; i++) {
						var node = nodes[i],
							nodeType = node.nodeType;
						if (nodeType === 3) {//文本节点
							if (!opt_filter || opt_filter(node, elem)) {
								textNodes.push(node);
							}
						} else if (nodeType === 1) {//元素节点
							textNodes = textNodes.concat(getTextNodesDeep(node, opt_filter))
						}
					}
				}
				return textNodes;
			}

			var textArr = getTextNodesDeep(pack);
			var first = pack.firstChild;
			var firstLen = 0;
			var l = 0;
			var useLen = 0;
			if (textArr.length == 0) {
				range.selectNodeContents(pack);
				range.collapse(true);
				range.setStart(pack, 0);
				range.setEnd(pack, 0);
				sel.removeAllRanges();
				sel.addRange(range);
			} else {
				if (textArr.length == 1) {
					first = textArr[0];
					if (first.length > len) {
						useLen = len;
					} else {
						useLen = first.length;
					}
				} else {
					while (textArr[l]) {
						first = textArr[l];
						firstLen += first.length;
						if (firstLen >= len) {
							useLen = len - (firstLen - first.length);
							break;
						}
						l++;
					}

				}
				range.selectNodeContents(pack);
				range.collapse(true);
				range.setStart(first, useLen);
				range.setEnd(first, useLen);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}

		// if(pack.firstChild.length > 0){
		// 	  if(len > pack.firstChild.length){
		//  	len = pack.firstChild.length;
		//  }
		//  range.selectNodeContents(pack);
		//  range.collapse(true);
		//  range.setStart(pack.firstChild,len)
		//  range.setEnd(pack.firstChild,len)
		// }else{
		// 	  range.selectNodeContents(pack);
		//  range.collapse(true);
		//  range.setStart(pack.firstChild,0)
		//  range.setEnd(pack.firstChild,0)
		// }
		// sel.removeAllRanges();
		// sel.addRange(range);
	} else {
		if ($("body").hasClass('editorNoticeWrap')) {
			$('#zss_editor_content').focus();
			if ($("#zss_editor_content").html().trim() == '') {
				var p = "<p element-id='init'><br></p>";
				zss_editor.insertHTML(p);
			}
			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			var start = $('#zss_editor_content')[0].firstChild;
			if (start) {
				range.setStart(start, 0);
				range.setEnd(start, 0);
				zss_editor.currentSelection.setRange(range);
			}

		} else {
			zss_editor.focusLast();
		}

	}

	zss_editor.undoManagerSave()
}
//光标定位在最后
zss_editor.focusLast = function () {
	$('#zss_editor_content').focus();
	var sel = window.getSelection();
	var range = document.createRange();
	if ($("#zss_editor_content").html().trim() == '') {
		var p = "<p element-id='init'><br></p>";
		zss_editor.insertHTML(p);
	} else {
		var node = $('#zss_editor_content')[0].lastChild;
		//20200811 最后一个元素是display：none的时候往上找
		if (node && node.nodeType == 1 && node.style.display && node.style.display == 'none') {
			while (!zss_editor.isBody(node)) {
				var prev = node.previousSibling;
				if (prev) {
					node = prev;
					if (prev.nodeType == 1 && !(prev.style.display && prev.style.display == 'none')) {
						break;
					}
				} else {
					node = node.parentNode;
				}
			}
			range.selectNodeContents(node);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			if ($('#zss_editor_content')[0].lastChild && ($('#zss_editor_content')[0].lastChild.nodeName == "OL" || $('#zss_editor_content')[0].lastChild.nodeName == "UL") && $('#zss_editor_content')[0].lastChild.lastChild) {
				range.selectNodeContents($('#zss_editor_content')[0].lastChild.lastChild);
			} else {
				range.selectNodeContents($('#zss_editor_content')[0].lastChild);
			}
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);
		}

	}
	zss_editor.undoManagerSave();
}
zss_editor.editFousEditor = function () {
	window.setTimeout(function () {
		var div = document.getElementById('zss_editor_content');
		var sel, range;
		range = document.createRange();
		range.selectNodeContents(div);
		range.collapse(false);
		sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}, 1);
}

zss_editor.blurEditor = function () {
	$('#zss_editor_content').blur();
}
zss_editor.becomefocus = function () {
	$('#zss_editor_content').focus();
}
zss_editor.parentTags = function () {
	var parentTags = [];
	var selection = window.getSelection();
	var range, currentNode;

	if (selection.rangeCount > 0) {
		range = selection.getRangeAt(0);
		currentNode = range.commonAncestorContainer;
	} else {
		currentNode = document.getElementById("zss_editor_content");
	}

	while (currentNode) {

		if (currentNode.nodeName == document.body.nodeName) {
			break;
		}
		if (currentNode.nodeType == document.ELEMENT_NODE) {
			parentTags.push(currentNode);
		}
		currentNode = currentNode.parentElement;
	}
	return parentTags;
};
zss_editor.iframeWidth = function () {
	var width = $(window).width() - 30;
	var parentTags = zss_editor.parentTags();
	if (parentTags) {
		for (var i = 0; i < parentTags.length; i++) {
			var currentNode = parentTags[i];

			if (currentNode.nodeName.toLowerCase() == 'ol' || currentNode.nodeName.toLowerCase() == 'ul') {
				width = $(window).width() - 56;
			}
			if (currentNode.nodeName.toLowerCase() == 'p') {
				width = $(window).width() - 30;
			}
			if (currentNode.getAttribute('class') && currentNode.getAttribute('class').indexOf('record-box-end') > -1) {
				width = width - 20;
			}

		}
	}
	width = Math.round(width);
	// var width = $(window).width() - 30;
	// width = Math.round(width);
	return width;
}
// 更新所有iframe的宽度
zss_editor.updateAllIframeWidth = function (width) {
	if (!width || width <= 0) {
		width = $(window).width() - 30;
	}
	$('iframe').each(function () {
		if ($(this).parents('.record-iframe').length > 0) {
			var wid = width - 8;
		} else if ($(this).parents('.record-box').length > 0) {
			var wid = width - 20;
			if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
				if ($(this).parents('ol').length > 0) {
					var node = $(this).parents('ol');
				} else if ($(this).parents('ul').length > 0) {
					var node = $(this).parents('ul');
				}
				var level = node.attr("level") || 1;
				wid = wid - 26 - 26 * (level - 1);
			}
		} else if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
			var wid = width;
			if ($(this).parents('ol').length > 0) {
				var node = $(this).parents('ol');
			} else if ($(this).parents('ul').length > 0) {
				var node = $(this).parents('ul');
			}
			var level = node.attr("level") || 1;
			wid = wid - 26 - 26 * (level - 1);
		} else {
			var wid = width;
		}
		$(this).attr('width', wid).css('width', wid);
	});
}
zss_editor.jumpAfterIframe = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var elementId = zss_editor.getRandomId();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.editor-iframe')) {
			pack = node;
		} else {
			pack = node.parents('.editor-iframe');
		}
		if (pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			if (node.previousSibling && node.previousSibling.classList && node.previousSibling.classList.contains("voiceBegin")) {
				pack = $("<p class='voiceBegin' element-id='" + elementId + "'>\u200B</p>")[0];
			} else {
				pack = $("<p element-id='" + elementId + "'>\u200B</p>")[0];
			}

			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
//插入附件
zss_editor.insertAnnex = function (data, id) {
	var type = data.attachmentType;
	var type_live = "";
	if (id == undefined || id == null || id == "") {
		id = (new Date()).getMilliseconds();
	}
	if ($("iframe[cid=" + id + "]").length <= 0 || ($("iframe[cid=" + id + "]").length > 0 && id == '')) {
		if (data.att_chat_course) {
			type_live = data.att_chat_course.type;
		}
		if (type == '1') {
			zss_editor.insert('insertTopic', data, id);
		} else if (type == '2') {
			zss_editor.insert('insertNote', data, id);
		} else if (type == '3') {
			zss_editor.insert('insertSubject', data, id);
		} else if (type == '4') {
			zss_editor.insert('insertNewspaper', data, id);
		} else if (type == '5') {
			zss_editor.insert('insertOnlineread', data, id);
		} else if (type == '6') {
			zss_editor.insert('insertPeriodical', data, id);
		} else if (type == '7') {
			zss_editor.insert('insertGroup', data, id);
		} else if (type == '8') {
			zss_editor.insert('insertNotice', data, id);
		} else if (type == '10') {
			zss_editor.insert('insertNotebook', data, id);
		} else if (type == '11') {
			zss_editor.insert('insertResource', data, id);
		} else if (type == '15' && type_live != '4') {
			zss_editor.insert('insertVote', data, id);
		} else if (type == '15' && type_live == '4') {
			zss_editor.insert('insertLive', data, id);
		} else if (type == '17') {
			zss_editor.insert('insertCourse', data, id);
		} else if (type == '18') {
			zss_editor.insert('insertCloud', data, id);
		} else if (type == '19') {
			zss_editor.insert('insertRedpacket', data, id);
		} else if (type == '20') {
			zss_editor.insert('insertUser', data, id);
		} else if (type == '23') {
			zss_editor.insert('insertGroupchat', data, id);
		} else if (type == '25') {
			zss_editor.insert('insertWeb', data, id);
		} else if (type == '26') {
			zss_editor.insert('insertVoice', data, id);
		} else if (type == '29') {
			zss_editor.insert('insertVideo', data, id);
		} else if (type == '33') {
			zss_editor.insert('insertMaplocation', data, id);
		} else if (type == '37') {
			zss_editor.insert('insertSubjectfolder', data, id);
		} else if (type == '38') {
			zss_editor.insert('insertCloudfolder', data, id);
		} else if (type == '39') {
			zss_editor.insert('insertBook', data, id);
		} else if (type == '40') {
			zss_editor.insert('insertCourseclone', data, id);
		} else if (type == '41') {
			zss_editor.insert('insertMicrocourse', data, id);
		} else if (type == '43') {
			zss_editor.insert('insertClockin', data, id);
		} else if (type == '44') {
			zss_editor.insert('insertClassqrcode', data, id);
		} else if (type == '47') {
			zss_editor.insert('insertTopicfolder', data, id);
		} else if (type == '48') {
			zss_editor.insert('insertDatafolder', data, id);
		} else if (type == '50') {
			zss_editor.insert('insertMeetingnote', data, id);
		} else if (type == '52') {
			zss_editor.insert('insertNoticefolder', data, id);
		} else {
			zss_editor.insert('insertErrorannex', data, id);
		}
	}
	zss_editor.undoManagerSave()
}
zss_editor.isemptyP = function () {
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (start.nodeType == 1 && start.innerHTML == '' || start.innerHTML == '<br>') {
		return true;
	} else if (start.nodeType == 1 && start.getAttribute('class') && start.getAttribute('class').indexOf('focusStart') > -1) {
		return true;
	} else if (start.nodeType == 1 && range.startOffset == 0 && start == $("#zss_editor_content")[0].firstChild) {
		return true;
	} else {
		return false;
	}
}
//通过课程附加aid更新该附件的字段
zss_editor.changevoteData = function (data, aid) {
	var addr = $("iframe[aid=" + aid + "]").attr("src");
	var newtit = data.att_chat_course.title || "";
	var newsubtit = data.att_chat_course.subTitle || "";
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#newtit=" + newtit + "&newsubtit=" + newsubtit;
		$("iframe[aid=" + aid + "]").attr("src", url);
	} else {
		var url = addr + "#newtit=" + newtit + "&newsubtit=" + newsubtit;
		;
		$("iframe[aid=" + aid + "]").attr("src", url);
	}
	var oldName = $("iframe[aid=" + aid + "]").attr("name");
	try {
		oldName = b64DecodeUnicode(oldName);
	} catch (e) {

	}
	oldName = JSON.parse(oldName);
	if (oldName.att_chat_course.title) {
		oldName.att_chat_course.title = newtit;
	}
	if (oldName.att_chat_course.subTitle) {
		oldName.att_chat_course.subTitle = newsubtit;
	}
	var newData = JSON.stringify(oldName);
	try {
		newData = b64EncodeUnicode(newData);
	} catch (e1) {
		;
	}
	$("iframe[aid=" + aid + "]").attr("name", newData);
}
zss_editor.insert = function (insertType, file, id, isrecovery, data) {
//	console.log(JSON.stringify(file))
	//课堂活动那边的活动重复的需要更新
	if (insertType == 'insertVote' && file.att_chat_course.aid && $("iframe[aid=" + file.att_chat_course.aid + "]").length > 0 && file.att_chat_course.atype != 41) {
		zss_editor.changevoteData(file, file.att_chat_course.aid);
	} else {
		if (insertType == 'insertResource') {
			try {
				file.att_resource.content = JSON.parse(file.att_resource.content);
			} catch (e) {
				;
			}
			var json = JSON.stringify(file);
			// json = json.replace('"{','{');('}"','}');

			// json = json.replace		// json = json.replace(/\\/g,"");
		} else if (insertType == 'insertCloud') {
			try {
				file.att_clouddisk.infoJsonStr = JSON.parse(file.att_clouddisk.infoJsonStr);
				try {
					file.att_clouddisk.infoJsonStr.parentPath = JSON.parse(file.att_clouddisk.infoJsonStr.parentPath);
				} catch (e1) {
					;
				}
			} catch (e) {
				;
			}

			try {
				file.att_clouddisk.parentPath = JSON.parse(file.att_clouddisk.parentPath);
			} catch (e) {
				;
			}
			var json = JSON.stringify(file);
		} else if (insertType == 'insertRedpacket') {
			try {
				file.att_red_packet.params = JSON.parse(file.att_red_packet.params);
			} catch (e) {
				;
			}
			var json = JSON.stringify(file);
		} else if (insertType == 'insertSubjectfolder') {
			try {
				file.att_createSpecialResFile.content = JSON.parse(file.att_createSpecialResFile.content);
			} catch (e) {
				;
			}
			var json = JSON.stringify(file);
		} else {
			var json = JSON.stringify(file);
		}
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			var focuseId = zss_editor.getFocusedField();
			if (focuseId != null) {
				focuseId = focuseId.wrappedObject;
				if (focuseId[0] === $("#zss_editor_tit")[0]) {
					zss_editor.focusEditor();
				}
			}
			if ($("#zss_editor_content").text().trim() == '') {
				zss_editor.focusEditor();
			} else {
				zss_editor.restoreRange();
			}
		} else {
			zss_editor.restoreRange();
		}
		var width = zss_editor.iframeWidth();
		// json = json.replace(/&/g, "&amp;");
		// 附件的数据用b64编码
		try {
			json = b64EncodeUnicode(json);
		} catch (e1) {
			;
		}
		var divelementId = zss_editor.getRandomId();
		if (zss_editor.editorClientType == true) {
			var attachmentSrc = insertType + '.html';
		} else {
			var attachmentSrc = zss_editor.prefix + insertType + '.html#editorClientType=false';
		}

		if (insertType == 'insertVote' && file.att_chat_course.aid) {
			var aid = file.att_chat_course.aid;
			if (zss_editor.isVoiceBegin()) {
				var attachHtml = "<div class='editor-iframe voiceBegin currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' aid='" + aid + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px'></iframe></div>";
			} else {
				var attachHtml = "<div class='editor-iframe currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' aid='" + aid + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px'></iframe></div>";
			}
		} else if (insertType == 'insertVideo') {
			var videoWidth = file.att_video.videoWidth || 0;
			var videoHeight = file.att_video.videoHeight || 0;
			var winWidth = $(window).width() - 30;
			var horiScale = 16 / 9;
			var vertiScale = 2 / 3;
			if (parseFloat(videoWidth) < parseFloat(videoHeight)) {
				var imgWidth = winWidth;
				var imgHeight = parseInt(imgWidth / vertiScale);
			} else {
				var imgWidth = winWidth;
				var imgHeight = parseInt(imgWidth / horiScale);
			}
//          var imgWidth = winWidth;
//          var imgHeight = parseInt(imgWidth / horiScale);
			//为了解决详情页获取音频附件高度变化之前的高度,导致总高度不对,内容展示不全,所以iframe上写上固定高度
			if (zss_editor.isVoiceBegin()) {
				var attachHtml = "<div class='editor-iframe voiceBegin currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px;height:" + imgHeight + "px'></iframe></div>";
			} else {
				var attachHtml = "<div class='editor-iframe currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px;height:" + imgHeight + "px'></iframe></div>";
			}
		} else {
			if (zss_editor.isVoiceBegin()) {
				var attachHtml = "<div class='editor-iframe voiceBegin currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px'></iframe></div>";
			} else {
				var attachHtml = "<div class='editor-iframe currentIframe' element-id='" + divelementId + "'><iframe frameborder='0' scrolling='no' cid='" + id + "' src='" + attachmentSrc + "' name='" + json + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' width='" + width + "' style='width:" + width + "px'></iframe></div>";
			}
		}
		if (!isrecovery && zss_editor.cooperation) {//协同发附件数据
			var data = {};
			var range = window.getSelection().getRangeAt(0);
			var tmpRange = range.cloneRange();
			var address = zss_editor.createAddress(tmpRange, false, true);
			data.name = "inserthtml";
			data.value = "insertAttach";
			data.html = attachHtml;
			data.address = address;
			zss_editor.sendJoinData(data);
		} else if (!!isrecovery && zss_editor.cooperation) {
			var range = window.getSelection().getRangeAt(0);
			range = zss_editor.moveToAddress(range, data.address);
			zss_editor.currentSelection.setRange(range);
			attachHtml = data.html;
		}
		if ($("#mark_" + id).length > 0) {
			if ($("#mark_" + id).length > 0 && $("#mark_" + id).html() == "" || ($("#mark_" + id).find(".record-list").length == 1 && $("#mark_" + id).find(".record-list-time").text() == "00:00")) {
				if ($("#mark_" + id).find(".record-list-tit").siblings().text().replace(new RegExp("​", 'g'), '') == "" && $("#mark_" + id).find(".record-list-tit").siblings().find('img').length == 0 && $("#mark_" + id).find(".record-list-tit").siblings().find('iframe').length == 0) {
					$("#mark_" + id).remove();
					zss_editor.insertHTML('\u200B');
					zss_editor.jumpAfterTodo();
					//zss_editor.jumpAfterList();
					this.insertHTML(attachHtml);
					zss_editor.jumpAfterIframe();
//				    zss_editor.insertHTML('');
				} else {
					zss_editor.insertHTML('\u200B');
					zss_editor.jumpAfterTodo();
					//zss_editor.jumpAfterList();
					$("#mark_" + id).before(attachHtml);
					$("#mark_" + id).find(".record-list-tit").remove();
					var startParent = $("#mark_" + id).find(".record-list")[0];
					var startParentParent = $("#mark_" + id)[0];
					while (startParent.firstChild) {
						startParentParent.parentNode.insertBefore(startParent.firstChild, startParentParent);
					}
					startParentParent.remove();
				}

				$(".currentIframe").find("iframe").attr('width', zss_editor.wWidth - 30).css('width', zss_editor.wWidth - 30);
			} else {
				attachHtml = '<div class="record-list record-iframe">' + attachHtml + '</div>';
				// $("#mark_"+id).after("<p><br></p>");
				$("#mark_" + id).prepend(attachHtml);
				$(".record-iframe").find("iframe").attr('width', zss_editor.wWidth - 38).css('width', zss_editor.wWidth - 38);
				$("#mark_" + id).after('<p class="foucus-pos"><br></p>');
				// 上传录音，左侧蓝点变成播放标识
				$("#mark_" + id).addClass("record-box-end");
				zss_editor.restoreRange();
				var selection = window.getSelection();
				var range = selection.getRangeAt(0);
				range.setStart($(".foucus-pos")[0], 0);
				range.setEnd($(".foucus-pos")[0], 0);
				zss_editor.currentSelection.setRange(range);
				$(".foucus-pos").removeClass('foucus-pos');
				var oldWidth = zss_editor.wWidth - 30;
				$('.record-box-end iframe').each(function () {
					if ($(this).parents('.record-iframe').length > 0) {
						var wid = oldWidth - 8;
					} else if ($(this).parents('.record-box').length > 0) {
						var wid = oldWidth - 20;
						if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
							wid = oldWidth - 26;
						}
					} else if ($(this).parents('ol').length > 0 || $(this).parents('ul').length > 0) {
						var wid = oldWidth - 26;
					} else {
						var wid = oldWidth;
					}
					$(this).attr('width', wid).css('width', wid);
				});
			}
			// $("#mark_"+id).find(".record-list-add").remove();
		} else {

			if (zss_editor.isemptyP()) {
				zss_editor.insertHTML('\u200B');
			}
			zss_editor.jumpAfterTodo();
			// zss_editor.jumpAfterList();
			this.insertHTML(attachHtml);
			zss_editor.jumpAfterIframe();
//		    zss_editor.insertHTML('');
		}
		this.enabledEditingItems();
		if ($("body").hasClass('editorNoticeWrap')) {
			//通知客户端实现滚动到焦点位置
			setTimeout(zss_editor.clientscrollToCursorPos, 30);
		} else {
			//脚本实现滚动到焦点位置
			setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 30);
		}
		var node = $('.currentIframe');
		node.attr('contenteditable', false).removeClass('currentIframe');
		var width = zss_editor.wWidth - 30;
		zss_editor.updateAllIframeWidth(width);
		if (insertType == 'insertVoice') {
			$(".voiceBegin").removeClass("voiceBegin");
		}
	}


}
// 转发的附件掉此方法
zss_editor.insertAnnexBeforeList = function (dataArr, idArr) {
	zss_editor.insertBlank();
	for (var i = 0; i < dataArr.length; i++) {
		var data_data = !!dataArr ? dataArr[i] : '';
		var data_id = !!idArr ? idArr[i] : '';
		zss_editor.insertAnnex(data_data, data_id);
	}
	if ($(".focusStart")[0]) {
//		zss_editor.jumpBeforeNode($(".focusStart")[0]);
		var selection = window.getSelection();
		if (selection.rangeCount > 0) {
			var range = selection.getRangeAt(0);
			range.setStart($(".focusStart")[0], 0);
			range.setEnd($(".focusStart")[0], 0);
			zss_editor.currentSelection.setRange(range);
		}
	}
}
// 转发的插入附件，首次插入三个换行
zss_editor.insertBlank = function () {
	if ($('#zss_editor_content').text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $('#zss_editor_content').find('img').length == 0 && $('#zss_editor_content').find('iframe').length == 0) {
		var elementId = zss_editor.getRandomId();
		zss_editor.insertHTML('<p class="focusStart" element-id="' + elementId + '"><br><br><br></p>');
	}
};
zss_editor.jumpBeforeIframe = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.editor-iframe')) {
			pack = node;
		} else {
			pack = node.parents('.editor-iframe');
		}
		if (pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			pack = $("<p>\u200B</p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
			if ($(".focusStart")[0]) {
				range.setStartBefore($(".focusStart")[0]);
				range.setEndBefore($(".focusStart")[0]);
				zss_editor.currentSelection.setRange(range);
			}

		}
	}
};
zss_editor.jumpBeforeNode = function (el) {
	var range = document.createRange();
	range.setStartBefore(el);
	range.setEndBefore(el);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
};
//获取所有附件
zss_editor.getAnnex = function () {
	var allAnnex = new Array();
	$("#zss_editor_content .attach-module").each(function () {
		var name = $(this).attr("name");
		try {
			name = b64DecodeUnicode(name);
		} catch (e) {

		}
		allAnnex.push(name);
	});
	//console.log(allAnnex);
	return allAnnex;
}
zss_editor.getAllAnnex = function () {
	var allAnnex = new Array();
	$("#zss_editor_content .attach-module").each(function () {
		var name = $(this).attr("name");
		try {
			name = b64DecodeUnicode(name);
		} catch (e) {

		}
		allAnnex.push(name);
	});
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		return allAnnex.toString();
	}
	if (isIOS) {
		return JSON.stringify(allAnnex);
	}
}

//获取单个附件
zss_editor.getOneAnnex = function (id) {
	var oneAnnex = $("iframe[cid=" + id + "]").attr("name");
	try {
		oneAnnex = b64DecodeUnicode(oneAnnex);
	} catch (e) {

	}
	return oneAnnex;
}

//改变iframe高度
function changeIframeHeight(cid, height, isrecovery) {
	//20200722 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var senddata = {};
		senddata.name = "changeIframeHeight";
		senddata.iframeId = cid;
		senddata.width = $(window).width();
		senddata.height = height;
		zss_editor.sendJoinData(senddata);
	}
	$("iframe[cid=" + cid + "]").css("height", height);
	if ($("body").hasClass('editorNoticeWrap')) {
		//通知需要重新改变window高度
		zss_editor.clientscrollToCursorPos();
	}
}

//长按附件详情页弹转发框
zss_editor.iframeForward = function (id) {
	if ($("body").hasClass('previewWrap')) {
		var top = $("iframe[cid=" + id + "]").offset().top - $(window).scrollTop();
		var name = $("iframe[cid=" + id + "]").attr("name");
		try {
			name = b64DecodeUnicode(name);
		} catch (e) {

		}
		zss_editor.showiframeForward(name, top);
	}
}
//编辑页显示录音视频修改标题图标
zss_editor.isvoiceIcon = function (id) {
	if ($("body").hasClass('editorWrap') && $("iframe[cid=" + id + "]").parents("#zss_editor_content").length > 0) {
		var timestamp = new Date().getTime();
		var addr = $("iframe[cid=" + id + "]").attr("src");
		if (addr.indexOf('#') != -1) {
			var arr = addr.split('#');
			addr = arr[0];
			var url = addr + "#isvoiceIcon=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		} else {
			var url = addr + "#isvoiceIcon=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		}
	} else if ($("body").hasClass('previewWrap') && $("iframe[cid=" + id + "]").parents("#zss_editor_content").length > 0) {// 详情页录音标题为空删除
		var timestamp = new Date().getTime();
		var addr = $("iframe[cid=" + id + "]").attr("src");
		if (addr.indexOf('#') != -1) {
			var arr = addr.split('#');
			addr = arr[0];
			var url = addr + "#isvoiceTitEmpty=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		} else {
			var url = addr + "#isvoiceTitEmpty=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		}
	}
}
//编辑页显示附件删除图标
zss_editor.isiframeClose = function (id) {
	if ($("body").hasClass('editorWrap') && $("iframe[cid=" + id + "]").parents("#zss_editor_content").length > 0) {
		var timestamp = new Date().getTime();
		var addr = $("iframe[cid=" + id + "]").attr("src");
		if (addr.indexOf('#') != -1) {
			var arr = addr.split('#');
			addr = arr[0];
			var url = addr + "#isiframeClose=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		} else {
			var url = addr + "#isiframeClose=true" + "&timestamp=" + timestamp;
			$("iframe[cid=" + id + "]").attr("src", url);
		}
	}
}
//a标签复制提示框
zss_editor.showacopyPrompt = function (html, y, x) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.showacopyPrompt(html, y, x);
	}
}
//图片转发框2020.10.14
zss_editor.showimageForward = function (html, y, addr, position) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.showimageForward(html, y, addr, position);
	}
	//ios
	if (isIOS) {
		var tmp = {};
		tmp.html = html;
		tmp.y = y;
		tmp.addr = addr;
		tmp.position = position;
		if (window.webkit && window.webkit.messageHandlers.showimageForward) {
			window.webkit.messageHandlers.showimageForward.postMessage([JSON.stringify(tmp)]);
		} else {
			if (window["showimageForward"]) {
				window["showimageForward"](JSON.stringify(tmp));
			}
		}
	}

}
//客户端转发框方法
zss_editor.showiframeForward = function (name, y) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.showiframeForward(name, y);
	}
	//ios
	if (isIOS) {
		var tmp = {};
		tmp.name = name;
		tmp.y = y;

		if (window.webkit && window.webkit.messageHandlers.showiframeForward) {
			window.webkit.messageHandlers.showiframeForward.postMessage([JSON.stringify(tmp)]);
		} else {
			if (window["showiframeForward"]) {
				window["showiframeForward"](JSON.stringify(tmp));
			}
		}
	}

}
//替换音视频
zss_editor.changeAnnex = function (data, id, isrecovery) {
	//20200722 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var senddata = {};
		senddata.name = "changeAnnex";
		senddata.iframeId = id;
		senddata.changedata = data;
		zss_editor.sendJoinData(senddata);
	}
	if (data.attachmentType == '26') {
		var newName = data;
		var oldName = $("iframe[cid=" + id + "]").attr("name");
		try {
			oldName = b64DecodeUnicode(oldName);
		} catch (e) {

		}
		oldName = JSON.parse(oldName);
		newName.att_voice.fileTitle = oldName.att_voice.fileTitle;
		if (oldName.att_voice.titleEdited != "" || oldName.att_voice.titleEdited != undefined || oldName.att_voice.titleEdited != null) {
			newName.att_voice.titleEdited = oldName.att_voice.titleEdited;
		}
		var newData = JSON.stringify(newName);
		try {
			newData = b64EncodeUnicode(newData);
		} catch (e1) {
			;
		}
		$("iframe[cid=" + id + "]").attr("name", newData);
	} else if (data.attachmentType == '29') {
		var newName = data;
		var oldName = $("iframe[cid=" + id + "]").attr("name");
		try {
			oldName = b64DecodeUnicode(oldName);
		} catch (e) {

		}
		oldName = JSON.parse(oldName);
		newName.att_video.fileTitle = oldName.att_video.fileTitle;
		if (oldName.att_video.titleEdited != "" || oldName.att_video.titleEdited != undefined || oldName.att_video.titleEdited != null) {
			newName.att_video.titleEdited = oldName.att_video.titleEdited;
		}
		var newData = JSON.stringify(newName);
		try {
			newData = b64EncodeUnicode(newData);
		} catch (e1) {
			;
		}
		$("iframe[cid=" + id + "]").attr("name", newData);
	} else {
		var videoFrame = $("iframe[cid=" + id + "]");
		var newData = JSON.stringify(data);
		try {
			newData = b64EncodeUnicode(newData);
		} catch (e1) {
			;
		}
		videoFrame.attr("name", newData);
	}

}
//替换音视频封面
zss_editor.changeAnnexImg = function (data, id, isrecovery) {
	//20200722 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var senddata = {};
		senddata.name = "changeAnnexImg";
		senddata.iframeId = id;
		senddata.changedata = data;
		zss_editor.sendJoinData(senddata);
	}
	if (data.att_video.coverUrl != "") {
		var newurl = data.att_video.coverUrl;
		try {
			newurl = b64EncodeUnicode(newurl);
		} catch (e1) {
			;
		}
	}
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#newurl=" + newurl;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#newurl=" + newurl;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
	if (isIOS) {
		var newName = data;
		var oldName = $("iframe[cid=" + id + "]").attr("name");
		try {
			oldName = b64DecodeUnicode(oldName);
		} catch (e) {

		}
		oldName = JSON.parse(oldName);
		newName.att_video.fileTitle = oldName.att_video.fileTitle;
		if (oldName.att_video.titleEdited != "" || oldName.att_video.titleEdited != undefined || oldName.att_video.titleEdited != null) {
			newName.att_video.titleEdited = oldName.att_video.titleEdited;
		}
		var newData = JSON.stringify(newName);
		try {
			newData = b64EncodeUnicode(newData);
		} catch (e1) {
			;
		}
		$("iframe[cid=" + id + "]").attr("name", newData);
	} else {
		var newData = JSON.stringify(data);
		try {
			newData = b64EncodeUnicode(newData);
		} catch (e1) {
			;
		}
		$("iframe[cid=" + id + "]").attr("name", newData);
	}
}
//替换录音视频标题
zss_editor.changevoiceTit = function (newtit, id) {

	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#newtit=" + newtit;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#newtit=" + newtit;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
	var oldName = $("iframe[cid=" + id + "]").attr("name");
	try {
		oldName = b64DecodeUnicode(oldName);
	} catch (e) {

	}
	oldName = JSON.parse(oldName);
	if (oldName.att_voice) {
		oldName.att_voice.fileTitle = newtit;
		oldName.att_voice.titleEdited = 1;
	} else if (oldName.att_video) {
		oldName.att_video.fileTitle = newtit;
		oldName.att_video.titleEdited = 1;
	}
	var newData = JSON.stringify(oldName);
	try {
		newData = b64EncodeUnicode(newData);
	} catch (e1) {
		;
	}
	$("iframe[cid=" + id + "]").attr("name", newData);
}
//播放视频地址
zss_editor.openVideoUrl = function (id, url) {
	try {
		url = b64EncodeUnicode(url);
	} catch (e1) {
		;
	}
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#videourl=" + url;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#videourl=" + url;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
//改变视频高度2021.01.20
zss_editor.changeVideoHeight = function (id) {
	var timestamp = new Date().getTime();
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#ischangeHeight=true" + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#ischangeHeight=true" + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
//视频退出全屏客户端传给网页播放器时间
zss_editor.exitFullscreen = function (id, currentTime) {
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#currentTime=" + currentTime;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#currentTime=" + currentTime;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
//其他视频附件暂停播放2021.01.06
zss_editor.onvideoClose = function (id) {
	$("iframe").each(function () {
		if ($(this).attr('cid') != id) {
			zss_editor.closeVoiceAnimate($(this).attr('cid'));
		}
	})
}
//替换课程活动数量
zss_editor.changeCourseActivityNumber = function (aid, number) {
	var timestamp = new Date().getTime();
	if ($("iframe[aid=" + aid + "]").length > 0) {
		var addr = $("iframe[aid=" + aid + "]").attr("src");
		if (addr.indexOf('#') != -1) {
			var arr = addr.split('#');
			addr = arr[0];
			var url = addr + "#number=" + number + "&timestamp=" + timestamp;
			$("iframe[aid=" + aid + "]").attr("src", url);
		} else {
			var url = addr + "#number=" + number + "&timestamp=" + timestamp;
			$("iframe[aid=" + aid + "]").attr("src", url);
		}
	}
}
//批量替换课程活动数量
zss_editor.changeCourseActivityNumberArr = function (arr) {
	arr.forEach(function (item) {
		zss_editor.changeCourseActivityNumber(item.aid, item.activeNum);
	})
}
//音频添加动画
zss_editor.openVoiceAnimate = function (id) {
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#played=true";
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#played=true";
		$("iframe[cid=" + id + "]").attr("src", url);
	}
	//$("iframe[cid="+id+"]").contents().find("#attach-box").addClass("animate");
}
//音频停止动画,视频停止播放
zss_editor.closeVoiceAnimate = function (id) {
	var timestamp = new Date().getTime();
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#played=false" + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#played=false" + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
	//$("iframe[cid="+id+"]").contents().find("#attach-box").removeClass("animate");
}
/*上传音视频圆形进度条，id为唯一值，val进度条当前的大小，size指总的大小,status为0代表失败*/
zss_editor.openProgress = function (id, val, size, status, videoSize) {
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		if (!!videoSize) {
			var url = addr + "#progressVal=" + val + "&progressSize=" + size + "&progressStatus=" + status + "&videoSize=" + videoSize;
		} else {
			var url = addr + "#progressVal=" + val + "&progressSize=" + size + "&progressStatus=" + status;
		}

		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		if (!!videoSize) {
			var url = addr + "#progressVal=" + val + "&progressSize=" + size + "&progressStatus=" + status + "&videoSize=" + videoSize;
		} else {
			var url = addr + "#progressVal=" + val + "&progressSize=" + size + "&progressStatus=" + status;
		}
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
/*音频播放进度*/
zss_editor.playProgress = function (id, currentTime, duration) {
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#currentTime=" + currentTime + "&duration=" + duration;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#currentTime=" + currentTime + "&duration=" + duration;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
// 直播状态
zss_editor.liveStatus = function (id, backdata, isrecovery) {
	//20200722 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		data.name = "refreshLiveState";
		data.iframeId = id;
		data.backdata = backdata;
		zss_editor.sendJoinData(data);
	}
	var livestatus = backdata.livestatus;
	var ifreview = backdata.ifreview;
	var isdelete = backdata.isdelete;
	var timestamp = new Date().getTime();
	var addr = $("iframe[cid=" + id + "]").attr("src");
	if (addr.indexOf('#') != -1) {
		var arr = addr.split('#');
		addr = arr[0];
		var url = addr + "#livestatusVal=" + livestatus + "&ifreviewVal=" + ifreview + "&isdelete=" + isdelete + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	} else {
		var url = addr + "#livestatusVal=" + livestatus + "&ifreviewVal=" + ifreview + "&isdelete=" + isdelete + "&timestamp=" + timestamp;
		$("iframe[cid=" + id + "]").attr("src", url);
	}
}
zss_editor.exchangeContent = function (oldContent, attach, id) {
	zss_editor.setContent(oldContent);
	$("#zss_editor_content .attach-module").each(function () {
		if ($(this).attr("cid") == id) {
			$(this).attr("name", JSON.stringify(attach));
		}
	});
	var content = document.getElementById("zss_editor_content").innerHTML;
	return content;
}
zss_editor.setFooterHeight = function (footerHeight) {
	var footer = $('#zss_editor_footer');
	footer.height(footerHeight + 'px');
}


zss_editor.restoreRangeBlur = function () {
	if (window.getSelection().rangeCount > 0) {
		var sel = getSelection();
		var range = document.createRange();
		range.setStart(zss_editor.currentSelection.startContainer, zss_editor.currentSelection.startOffset);
		range.setEnd(zss_editor.currentSelection.endContainer, zss_editor.currentSelection.endOffset);
		zss_editor.currentSelection.setRange(range);
	}
}
zss_editor.restoreRangeText = function () {
	if (window.getSelection().rangeCount > 0) {
		var sel = getSelection();
		var range = document.createRange();
		$('#zss_editor_content').focus();
		if (zss_editor.currentSelection.startContainer && zss_editor.currentSelection.endContainer) {
			range.setStart(zss_editor.currentSelection.startContainer, zss_editor.currentSelection.startOffset);
			range.setEnd(zss_editor.currentSelection.endContainer, zss_editor.currentSelection.endOffset);
			zss_editor.currentSelection.setRange(range);
		}
		var con = range.toString();
		return con;
	}
}
zss_editor.secondToTime = function (time) {
	var newtime;
	if (null != time) {
		if (time < 60) {
			var seconds = parseInt(time) < 10 ? ('0' + parseInt(time)) : parseInt(time);
			newtime = '00:' + seconds;
		} else if (time >= 60 && time < 60 * 60) {
			var minute = parseInt(time / 60.0) < 10 ? ('0' + parseInt(time / 60.0)) : parseInt(time / 60.0);
			var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
			newtime = minute + ':' + seconds;
		} else if (time >= 60 * 60 && time < 60 * 60 * 24) {
			var hour = parseInt(time / 3600.0) < 10 ? ('0' + parseInt(time / 3600.0)) : parseInt(time / 3600.0);
			var minute = (parseInt(time / 60.0 % 60.0) < 10) ? ('0' + parseInt(time / 60.0 % 60.0)) : parseInt(time / 60.0 % 60.0);
			var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
			newtime = hour + ':' + minute + ':' + seconds;
		}
	}
	return newtime;
};
zss_editor.timeToSecond = function (time) {
	var s = '';
	var lenArr = time.split(':');
	if (lenArr.length == 2) {
		var min = time.split(':')[0];
		var sec = time.split(':')[1];
		s = Number(min * 60) + Number(sec);
	} else if (lenArr.length == 3) {
		var hour = time.split(':')[0];
		var min = time.split(':')[1];
		var sec = time.split(':')[2];
		s = Number(hour * 3600) + Number(min * 60) + Number(sec);
	}
	if (s == '') {
		s = 0;
	}
	return s;
};
//接收协同编辑数据
zss_editor.setJointEditData = function (data) {
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var tmpRange = range.cloneRange();

	function getTextNodesDeep(elem, opt_filter) {
		var textNodes = [];
		if (elem) {
			var nodes = elem.childNodes, nub = nodes.length;
			for (var i = 0; i < nub; i++) {
				var node = nodes[i],
					nodeType = node.nodeType;
				if (nodeType === 3) {//文本节点
					if (!opt_filter || opt_filter(node, elem)) {
						node.nodeValue = node.nodeValue.replace(new RegExp(fillChar, 'g'), '');
						textNodes.push(node);
					}
				} else if (nodeType === 1) {//元素节点
					textNodes = textNodes.concat(getTextNodesDeep(node, opt_filter))
				}
			}
		}
		return textNodes;
	}

	function setRangeAt(pack, len) {
		var textArr = getTextNodesDeep(pack);
		var first = pack.firstChild;
		var firstLen = 0;
		var l = 0;
		var useLen = 0;
		if (textArr.length == 1) {
			first = textArr[0];
			if (first.length > len) {
				useLen = len;
			} else {
				useLen = first.length;
			}
		} else {
			while (textArr[l]) {
				first = textArr[l];
				firstLen += first.length;
				if (firstLen >= len) {
					useLen = len - (firstLen - first.length);
					break;
				}
				l++;
			}
		}
		tmpRange.selectNodeContents(pack);
		tmpRange.collapse(true);
		tmpRange.setStart(first, useLen);
		tmpRange.setEnd(first, useLen);
		zss_editor.currentSelection.setRange(tmpRange);
	}

	try {
		if (data.name == "insert") {
			if (data.address.startAddress.length == 1) {
				//编辑器为空时加p init
				var p = document.createElement('p');
				p.setAttribute('element-id', 'init');
				p.appendChild(document.createElement('br'));
				tmpRange.insertNode(p);
				tmpRange.setStart(p, 0);
				tmpRange.setEnd(p, 0);
				zss_editor.currentSelection.setRange(tmpRange);
			} else {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
			}
			var insertText = data.insertText;
			var text = document.createTextNode(insertText);
			tmpRange.insertNode(text);
			tmpStart = zss_editor.findParent(tmpRange.startContainer, function (node) {
				return zss_editor.isBlockElm(node);
			}, true);
			tmpStart.normalize();
			tmpRange.collapse(true);
		} else if (data.name == "delete") {
			if (data.cmdName && data.cmdName == 'listDelete') {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
				//列表删除
				zss_editor.listDelete(tmpRange);
			} else if (data.cmdName && data.cmdName == 'todoListDelete') {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
				//勾选框删除
				zss_editor.todoListDelete(tmpRange);
			} else if (data.cmdName == 'deleteAll') {
				//全选删除
				$('#zss_editor_content').html('<p element-id="init"><br/></p>');
				tmpRange.setStart($('#zss_editor_content')[0].firstChild, 0);
			} else if (data.isCollapsed == "false") {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
				tmpRange.deleteContents();
				zss_editor.currentSelection.setRange(tmpRange);
				if (tmpRange.startContainer.nodeType == 1) {
					var child = tmpRange.startContainer.childNodes[tmpRange.startOffset], pre;
					if (child && zss_editor.isBlockElm(child) && (pre = child.previousSibling) && zss_editor.isBlockElm(pre)) {
						while (child.firstChild) {
							pre.appendChild(child.firstChild);
						}
						zss_editor.remove(child);
					}
				}
				tmpRange.collapse(true);
				zss_editor.currentSelection.setRange(tmpRange);
			} else if (data.delLen == 0) {
				var prev = document.querySelector("[element-id = '" + data.elementId + "']");
				if (prev) {
					if (data.eleLen != 0) {
						if (prev.lastChild.nodeName == "BR") {
							prev.lastChild.remove();
						}
						var prevParent;
						if ($(prev).parents(".todo-view").length > 0) {
							prevParent = $(prev).parents(".todo-view")[$(prev).parents(".todo-view").length - 1]
						}
						var parentList = zss_editor.findParents(prev, false, function (node) {
							return node.tagName == 'OL' || node.tagName == 'UL'
						}, true);
						if (parentList.length > 0) {
							prevParent = parentList[0];
						}
						if (prevParent) {
							var pack = prevParent.nextSibling;
						} else {
							var pack = prev.nextSibling;
						}
						// //判断prev是否是空的节点,如果是<p><br/></p>类型的空节点，干掉<br>标签防止它占位
						//             if (zss_editor.isEmptyBlock(prev)) {
						//                 prev.innerHTML = '';
						//             }
						while (pack.firstChild) {
							prev.appendChild(pack.firstChild);
						}
						pack.remove();
						prev.normalize();
					} else {
						var pack = prev.nextSibling;
						if (pack) {
							pack.remove();
						}
					}
				} else {
					//拉取草稿
					zss_editor.webscoketSync()
				}

			} else {
				var len = data.startPos;
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
				zss_editor.currentSelection.setRange(tmpRange);
				var bookmark = zss_editor.createBookmark();
				var pack = document.querySelector("[element-id = '" + data.elementId + "']");
				if (pack) {
					var newlen = 0;
					if (len >= data.delLen) {
						newlen = len - data.delLen;
						setRangeAt(pack, newlen);
						tmpRange.setEndBefore(bookmark.start);
						tmpRange.deleteContents();
						zss_editor.moveToBookmark(bookmark);
						zss_editor.currentSelection.setRange(tmpRange);
					}

				} else {
					if (new Date().getTime() - zss_editor.lastTime.time >= 3000) {
						//获取不到id,重新拉取数据
						if (!(typeof (NoteDraftUtil) == "undefined") && NoteDraftUtil) {
							NoteDraftUtil.getNoteDraft();
						}
						zss_editor.lastTime.time = new Date().getTime();
					}
				}

			}
		} else if (data.name == "enter") {
			if (data.address) {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
			} else {
				if (new Date().getTime() - zss_editor.lastTime.time >= 3000) {
					//获取不到id,重新拉取数据
					if (!(typeof (NoteDraftUtil) == "undefined") && NoteDraftUtil) {
						NoteDraftUtil.getNoteDraft();
					}
					zss_editor.lastTime.time = new Date().getTime();
				}
			}

			var prev = document.querySelector("[element-id = '" + data.preId + "']");
			if (data.cmdName && data.cmdName == 'listEnter') {
				//列表换行
				zss_editor.listEnter(tmpRange, null, data.elementId, data.preId);
			} else if (data.cmdName && data.cmdName == 'todoListEnter') {
				//多选框换行
				zss_editor.todoListEnter(tmpRange, null, data.elementId);
			} else if (prev) {
				var prevLen = prev.innerText.replace(new RegExp(fillChar, 'g'), '').replace(/^\s+|\s+$/g, '').length;
				if (data.startPos == 0) {
					var newp = document.createElement('p');
					newp.innerHTML = prev.innerHTML;
					newp.setAttribute("element-id", data.elementId);
					//                  	prev.appendChild(this.document.createTextNode('\u200B'));
					prev.appendChild(document.createElement('br'));
					$(prev).after(newp);
				} else if (data.startPos == prevLen) {
					var prev = document.querySelector("[element-id = '" + data.preId + "']");
					var newp = document.createElement('p');
					//                  	newp.appendChild(this.document.createTextNode('\u200B'));
					newp.appendChild(document.createElement('br'));
					newp.setAttribute("element-id", data.elementId);
					$(prev).after(newp);
				} else {
					var span = document.createElement('span');
					tmpRange.insertNode(span);
					zss_editor.breakParent(span, prev);
					var newPrev = span.previousSibling;
					var next = span.nextSibling;
					newPrev.setAttribute("element-id", data.preId);
					next.setAttribute("element-id", data.elementId);
					zss_editor.remove(span);
				}
			} else {
				prev = zss_editor.findParent(tmpRange.startContainer, function (node) {
					return zss_editor.isBlockElm(node);
				}, true);
				prev.setAttribute("element-id", data.preId);
				if (data.startPos == 0) {
					var newp = document.createElement('p');
					newp.innerHTML = prev.innerHTML;
					newp.setAttribute("element-id", data.elementId);
					//                      prev.appendChild(this.document.createTextNode('\u200B'));
					prev.appendChild(document.createElement('br'));
					$(prev).after(newp);
				} else if (data.startPos == prevLen) {
					var newp = document.createElement('p');
					//                      newp.appendChild(this.document.createTextNode('\u200B'));
					newp.appendChild(document.createElement('br'));
					newp.setAttribute("element-id", data.elementId);
					$(prev).after(newp);
				} else {
					var span = document.createElement('span');
					tmpRange.insertNode(span);
					var spanParent = zss_editor.findParent(span, function (node) {
						return zss_editor.isBlockElm(node);
					}, true);
					zss_editor.breakParent(span, spanParent);
					var newPrev = span.previousSibling;
					var next = span.nextSibling;
					newPrev.setAttribute("element-id", data.preId);
					next.setAttribute("element-id", data.elementId);
					zss_editor.remove(span);
				}

			}


		} else if (data.name == 'execCommand') { //命令
			tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
			zss_editor.currentSelection.setRange(tmpRange);
			if (data.cmdName == 'bold') {
				zss_editor.setBold(true);
			} else if (data.cmdName == 'italic') {
				zss_editor.setItalic(true);
			} else if (data.cmdName == 'underline') {
				zss_editor.setUnderline(true);
			} else if (data.cmdName == 'strikethrough') {
				zss_editor.setStrikeThrough(true);
			} else if (data.cmdName == 'forecolor') {
				zss_editor.setTextColor(0, true, data.value);
			} else if (data.cmdName == 'backcolor') {
				zss_editor.setBackgroundColor(0, true, data.value);
			} else if (data.cmdName == 'FontSize') {
				zss_editor.setFontSize(0, true, data.value)
			} else if (data.cmdName == 'insertunorderedlist') {
				zss_editor.setUnorderedList(true);
			} else if (data.cmdName == 'insertorderedlist') {
				zss_editor.setOrderedList(true);
			} else if (data.cmdName == 'checkbox') {
				zss_editor.todo(true);
			} else if (data.cmdName == 'justify') {
				if (data.value = 'left') {
					zss_editor.setJustifyLeft(true)
				} else if (data.value = 'center') {
					zss_editor.setJustifyCenter(true)
				} else if (data.value = 'right') {
					zss_editor.setJustifyRight(true)
				}
			} else if (data.cmdName == 'indent') {
				zss_editor.setIndent(true);
			} else if (data.cmdName == 'outdent') {
				zss_editor.setOutdent(true);
			} else if (data.cmdName == 'undo') {
				zss_editor.undoManagerUndo(true);
			} else if (data.cmdName == 'redo') {
				zss_editor.undoManagerRedo(true);
			} else if (data.cmdName == 'formatmatch') {

			} else if (data.cmdName == 'removeformat') {

			} else if (data.cmdName == 'lineheight') {

			} else if (data.cmdName == 'blockquote') {

			} else if (data.cmdName == 'horizontal') {

			} else if (data.cmdName == 'Paragraph') {

			} else if (data.cmdName == 'FontFamily') {

			}


		} else if (data.name == 'inserthtml') {
			if (data.value == "insertAttach") {
				zss_editor.insert('', '', '', true, data);
			} else if (data.value == "insertImage") {
				zss_editor.insertImage('', '', '', '', true, data);
			} else if (data.value == "insertRecentImage") {
				zss_editor.insertRecentImage('', '', '', '', true, data);
			} else {
				tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
				var html = data.html;
				zss_editor.insertHTML(html);
			}

		} else if (data.name == 'replace') {
			var node = document.querySelector("[element-id = '" + data.elementId + "']");
			if (node.classList.contains("editor-image")) {
				node.removeAttribute("style");
			}
			if (node) {
				node.innerHTML = data.html;
			}
		} else if (data.name == 'deleteElement') {
			if (data.tagName == 'img') {
				zss_editor.removeImage(data.elementIndex, 'img', true);
			} else if (data.tagName == 'iframe') {
				zss_editor.removeIframe(data.elementIndex, 'iframe', true);
			} else if (data.tagName == 'recordtime') {
				zss_editor.removeRecordTime(document.querySelector('[element-id = "' + data.elementId + '"]'), 'recordtime', true)
			}
		} else if (data.name == 'refreshLiveState') {
			//更新直播状态
			zss_editor.liveStatus(data.iframeId, data.backdata, true);
		} else if (data.name == 'changeAnnex') {
			//替换音视频
			zss_editor.changeAnnex(data.changedata, data.iframeId, true)
		} else if (data.name == 'changeAnnexImg') {
			//替换音视频封面
			zss_editor.changeAnnexImg(data.changedata, data.iframeId, true)
		} else if (data.name == 'mark') {
			//录音打点
			tmpRange = zss_editor.moveToAddress(tmpRange, data.address);
			zss_editor.mark(data.recordId, data.time, true, tmpRange);
		} else if (data.name == 'changeIframeHeight') {
			if ($("iframe[cid=" + cid + "]").hasClass('attach-insertVideo')) {
				var height = ($("iframe[cid=" + cid + "]").width()) * data.height / data.width;
				changeIframeHeight(data.iframeId, height, true);
			} else {
				changeIframeHeight(data.iframeId, data.height, true)
			}
		}
	} catch (e) {

	}
	zss_editor.currentSelection.setRange(range);
	zss_editor.undoManagerSave();
}
// 发送协同编辑数据
zss_editor.sendJoinData = function (data) {
	data.operationType = 0;
	var json = JSON.stringify(data);
	if (window.ws && window.ws.readyState == 1) {
		console.log('sendjson:' + json)
		ws.send(json);
	} else {
		console.log('连接未开启或连接已关闭，重新连接...')
		//20200616 连接断开后重新连接
		zss_editor.openCoprConnect(zss_editor.account.noteCid, zss_editor.account.puid);
		zss_editor.webscoketSync();
	}
},
//开启协同编辑长连接  参数：笔记id,用户uid
	zss_editor.openCoprConnect = function (noteCid, puid) {
		var linkChannel = 'wss://cooperateyd.chaoxing.com/websocket/' + noteCid + '/' + puid;//这个是websocket的广播消息通道
		zss_editor.account.noteCid = noteCid;
		zss_editor.account.puid = puid;
		if ("WebSocket" in window) {
			var url = 'wss://cooperateyd.chaoxing.com/websocket/' + noteCid + '/' + puid;
			window.ws = new WebSocket(url);
			ws.onopen = function () {
				zss_editor.cooperation = true;
				console.log("websocket:开始发送数据");
			};
			ws.onmessage = function (evt) {
				var received_msg = evt.data;
				console.log('receivejson:' + received_msg)
				var data = JSON.parse(received_msg);
				// 0:发送页面的上的操作，1、清空操作历史，2、获取上一次页面内容保存之后的操作历史，3、有新的人连接进来，4、用户断开连接
				if (data.operationType == undefined || data.operationType == 0) {
					//处理数据
					zss_editor.setJointEditData(data);
				} else if (data.operationType == 2) {
					var operateHistory = data.list;
					if (operateHistory && operateHistory.length > 0) {
						for (var i = 0; i < operateHistory.length; i++) {
							zss_editor.setJointEditData(data);
						}
					}
				} else if (data.operationType == 3) {
					if (!(typeof (NoteCooperateUtil) == "undefined") && NoteCooperateUtil) {
						NoteCooperateUtil.newUserConnection(data.user);
					}
				} else if (data.operationType == 4) {
					if (!(typeof (NoteCooperateUtil) == "undefined") && NoteCooperateUtil) {
						NoteCooperateUtil.userDisconnect(data.puid);
					}
				}
			};
			ws.onclose = function () {
				console.log("websocket:连接已关闭");
			};
		}

//	连接websocket
//	CS.connect(linkChannel,function(frame){  //连接成功
//		//监听消息
//		CS.sc.subscribe(linkChannel, function(response){
//			//监听消息回调
//			var messageObj = response.body;
//			console.log(response.body);
//
//		});
//	}, function(frame){ //连接失败
//		console.log("连接服务器失败");
//	});
	}
//重新从服务端拉取数据
zss_editor.webscoketSync = function () {
	if (new Date().getTime() - zss_editor.lastTime.time >= 3000) {
		//获取不到id,重新拉取数据
//		if (isAndroid && (typeof javaJs !== 'undefined')) {
//	       javaJs.refreshContent();
//	    }
//	    //ios
//	    if (isIOS) {
//	        if(window.webkit && window.webkit.messageHandlers.refreshContent){
//	            window.webkit.messageHandlers.refreshContent.postMessage([]);
//	        }else{
//	　　　　        if(window["refreshContent"]) {
//	                window["refreshContent"]();
//	            }
//	        }
//	    }
		zss_editor.lastTime.time = new Date().getTime();
	}
}
//客户端调用，开启长连接  参数：班级id,学生uid
zss_editor.openConnect = function (classId, uid) {
	var linkChannel = "screenPptLog_" + classId;//这个是websocket的广播消息通道
	//连接websocket
	S.connect(linkChannel, uid, "phoneConnect", function (frame) {  //连接成功
		//监听消息
		S.sc.subscribe('/widget/t/ws/broadcast/' + linkChannel, function (response) {
			//监听消息回调
			var messageObj = response.body;
			console.log(response.body);
			//调客户端方法,客户端处理图片数据,并将时间和id传过来
			if (isAndroid && (typeof javaJs !== 'undefined')) {
				javaJs.sendCoursePPTData(messageObj);
			}
			//ios
			if (isIOS) {
				if (window.webkit && window.webkit.messageHandlers.sendCoursePPTData) {
					window.webkit.messageHandlers.sendCoursePPTData.postMessage([messageObj]);
				} else {
					if (window["sendCoursePPTData"]) {
						window["sendCoursePPTData"](messageObj);
					}
				}
			}
		});
	}, function (frame) { //连接失败
		console.log("连接服务器失败");
	});
}
// 录音开始，做标记
zss_editor.markVoiceBofore = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var start = range.startContainer;
		if ($(start).parents('ol').length > 0 || $(start).parents('ul').length > 0) {

		} else if (start.nodeType == 1 && range.startOffset == 0 || start.innerHTML == '<br>') {
			var div = '<div class="voiceBegin"><br></div>';
			zss_editor.insertHTML(div);
			// var div = $('<div class="voiceBegin"><br></div>')[0];
			// start.parentNode.insertBefore(div,start);
			// range.setStart(div,0);
			// range.setEnd(div,0);
			// zss_editor.currentSelection.setRange(range);
			// start.parentNode.removeChild(start);
		}
	}

}
// 录音打点
zss_editor.mark = function (id, time, isrecovery, tmpRange) {
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
	}

	if (zss_editor.recordTime.id == id && zss_editor.recordTime.time == time) {
	} else {
		zss_editor.restoreRange();
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		//20200722 协同编辑同步打点:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
		if (!isrecovery && zss_editor.cooperation) {//发数据
			var data = {};
			data.name = "mark";
			data.recordId = id;
			data.time = time;
			data.address = zss_editor.createAddress(range, false, true);
			zss_editor.sendJoinData(data);
		} else if (tmpRange) {//恢复数据传过来的range
			range = tmpRange;
		}
		zss_editor.recordTime = {id: id, time: time};
		time = zss_editor.secondToTime(time);
		if ($("#mark_" + id).length > 0) {
			// $(".record-list-add").remove();
			var list = '<div class="record-list">' +
				'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
				'</div>';
			$("#mark_" + id).append(list);
			range.setStartAfter($(".record-tit-pos")[0]);
			range.setEndAfter($(".record-tit-pos")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".record-list-tit").removeClass('record-tit-pos');
			var pack = $("<p><br></p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);

		} else {
			// 如果在有序无序缩进点打点从里面跳出来再建打点
			zss_editor.jumpAfterList();
			var node = range.commonAncestorContainer;
			if (!node.classList || !node.classList.contains('record-box')) {
				var parent = $(node).parents('.record-box');
				if (parent.length > 0) {
					range.setStartAfter(parent[0]);
					range.setEndAfter(parent[0]);
					zss_editor.currentSelection.setRange(range);
				}
			}
			if (time == "00:00") {
				var markHtml = '<p><br></p>' +
					'<div class="record-box record-box-audio" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
					'</div>' +
					'</div>';
			} else {
				var markHtml = '<p><br></p>' +
					'<div class="record-box record-box-audio" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">00:00</div>\u200b</div>' +
					'<p><br></p>' +
					'</div>' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
					'</div>' +
					'</div>';
			}

			if ($(".voiceBegin").length > 0) {
				$(".voiceBegin").eq($(".voiceBegin").length - 1).after(markHtml);
				$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list-tit").next().remove();
				//录音开始写入的内容放到打点00里
				while ($(".voiceBegin").eq(0).length > 0) {
					var obj = $(".voiceBegin").eq(0).clone().removeClass('voiceBegin');
					$(".voiceBegin").eq(0).remove();
					$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").append(obj);
					var width = zss_editor.wWidth - 30;
					// zss_editor.updateAllIframeWidth(width);
				}
				// $("#mark_"+id+" iframe").attr("width",$(window).width()-50).css("width",$(window).width()-50);
				zss_editor.updateAllIframeWidth(width);
				if ($("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").children(':last-child').attr("contenteditable") == "false") {
					$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").append("<p><br></p>")
				}

			} else {
				zss_editor.insertHTML(markHtml, tmpRange);
			}
			range.setStartAfter($(".record-tit-pos")[0]);
			range.setEndAfter($(".record-tit-pos")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".record-list-tit").removeClass('record-tit-pos');
			var pack = $("<p><br></p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);

		}
		$(".record-list-time").attr("contenteditable", "false");
		this.enabledEditingItems();
		if ($("body").hasClass('editorNoticeWrap')) {
			//通知客户端实现滚动到焦点位置
			zss_editor.clientscrollToCursorPos();
		} else {
			//脚本实现滚动到焦点位置
			zss_editor.calculateEditorHeightWithCaretPosition();
		}
	}
	zss_editor.undoManagerSave()

}
//视频打点
zss_editor.videoMark = function (id, time, index) {//视频唯一标识id,打点时间，打点索引
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
	}

	if (zss_editor.recordTime.id == id && zss_editor.recordTime.time == time) {
	} else {
		zss_editor.restoreRange();
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		zss_editor.recordTime = {id: id, time: time};
		time = zss_editor.secondToTime(time);
		if ($("#mark_" + id).length > 0) {
			// $(".record-list-add").remove();
			var list = '<div class="record-list">' +
				'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
				'</div>';
			if (index >= 1) {
				$("#mark_" + id).find(".record-list").eq(index - 1).after(list);
			} else {
				$("#mark_" + id).append(list);
			}
			range.setStartAfter($(".record-tit-pos")[0]);
			range.setEndAfter($(".record-tit-pos")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".record-list-tit").removeClass('record-tit-pos');
			var pack = $("<p><br></p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);

		} else {
			// 如果在有序无序缩进点打点从里面跳出来再建打点
			zss_editor.jumpAfterList();
			var node = range.commonAncestorContainer;
			if (!node.classList || !node.classList.contains('record-box')) {
				var parent = $(node).parents('.record-box');
				if (parent.length > 0) {
					range.setStartAfter(parent[0]);
					range.setEndAfter(parent[0]);
					zss_editor.currentSelection.setRange(range);
				}
			}
			if (time == "00:00") {
				var markHtml = '<p><br></p>' +
					'<div class="record-box record-box-video" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
					'</div>' +
					'</div>';
			} else {
				var markHtml = '<p><br></p>' +
					'<div class="record-box record-box-video" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">00:00</div>\u200b</div>' +
					'<p><br></p>' +
					'</div>' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div>\u200b</div>' +
					'</div>' +
					'</div>';
			}

			if ($(".voiceBegin").length > 0) {
				$(".voiceBegin").eq($(".voiceBegin").length - 1).after(markHtml);
				$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list-tit").next().remove();
				//录音开始写入的内容放到打点00里
				while ($(".voiceBegin").eq(0).length > 0) {
					var obj = $(".voiceBegin").eq(0).clone().removeClass('voiceBegin');
					$(".voiceBegin").eq(0).remove();
					$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").append(obj);
					var width = zss_editor.wWidth - 30;
					// zss_editor.updateAllIframeWidth(width);
				}
				// $("#mark_"+id+" iframe").attr("width",$(window).width()-50).css("width",$(window).width()-50);
				zss_editor.updateAllIframeWidth(width);
				if ($("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").children(':last-child').attr("contenteditable") == "false") {
					$("#mark_" + id + " .record-list-time:contains('00:00')").parents(".record-list").append("<p><br></p>")
				}

			} else {
				zss_editor.insertHTML(markHtml);
			}
			range.setStartAfter($(".record-tit-pos")[0]);
			range.setEndAfter($(".record-tit-pos")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".record-list-tit").removeClass('record-tit-pos');
			var pack = $("<p><br></p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);

		}
		$(".record-list-time").attr("contenteditable", "false");
		this.enabledEditingItems();
		if ($("body").hasClass('editorNoticeWrap')) {
			//通知客户端实现滚动到焦点位置
			zss_editor.clientscrollToCursorPos();
		} else {
			//脚本实现滚动到焦点位置
			zss_editor.calculateEditorHeightWithCaretPosition();
		}
	}
	zss_editor.undoManagerSave()

}
//章节视频打点
zss_editor.insertCourseVideo = function (pointData, attachment) {
	zss_editor.restoreRange();
	var html = '';
	var isHasTime = pointData.time ? true : false;
	$('body').find('.tempPos').removeClass('tempPos')
	//第一次插入，需插入附件
	if (!document.body.querySelector('#mark_' + attachment.cid)) {
		var attachmentSrc = '', insertType = 'insertCourseVideo';
		if (zss_editor.editorClientType == true) {
			attachmentSrc = insertType + '.html';
		} else {
			attachmentSrc = zss_editor.prefix + insertType + '.html#editorClientType=false';
		}
		if(isHasTime){
			html = '<p><br></p>' +
				'<div class="record-box record-box-video" id="mark_' + attachment.cid + '">' +
				'<div class="record-list record-iframe"><div element-id="' + zss_editor.getRandomId() + '" class="editor-iframe" contenteditable="false"><iframe frameborder="0" scrolling="no" cid="' + attachment.cid + '" src="' + attachmentSrc + '" name="' + b64EncodeUnicode(JSON.stringify(attachment)) + '" class="attach-module attach-' + insertType + '" module="' + insertType + '"></iframe></div></div>' +
				// '<div class="record-list"><div class="record-list-tit"><div class="record-list-time" contenteditable="false">00:00</div>\u200b</div><p><br></p></div>' +
				'<div class="record-list"><div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + zss_editor.secondToTime(pointData.time) + '</div>\u200b</div><p class="tempPos"><br></p></div>' +
				'</div>' + '<p><br></p>';
			zss_editor.insertHTML(html)
		}else{
			html = '<p><br></p>' +
				'<div id="mark_' + attachment.cid + '">' +
				'<div class="record-video"><div element-id="' + zss_editor.getRandomId() + '" class="editor-iframe" contenteditable="false"><iframe frameborder="0" scrolling="no" cid="' + attachment.cid + '" src="' + attachmentSrc + '" name="' + b64EncodeUnicode(JSON.stringify(attachment)) + '" class="attach-module attach-' + insertType + '" module="' + insertType + '"></iframe></div></div>'+
				// '<div class="record-list"><div class="record-list-tit"><div class="record-list-time" contenteditable="false">00:00</div>\u200b</div><p><br></p></div>' +
				// '<div class="record-list"><div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + zss_editor.secondToTime(pointData.time) + '</div>\u200b</div><p class="tempPos"><br></p></div>' +
				'</div>';
			zss_editor.insertHTML(html)
			$("#mark_" + attachment.cid).after('<p><br></p>');
		}
	} else {
		if(!$('#mark_' + attachment.cid).hasClass("record-box")){
			$('#mark_' + attachment.cid).addClass("record-box record-box-video");
			$('#mark_' + attachment.cid).find(".record-video").addClass("record-list record-iframe")
		}
		html = '<div class="record-list"><div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + zss_editor.secondToTime(pointData.time) + '</div>\u200b</div><p class="tempPos"><br></p></div>';
		$('body').find('#mark_' + attachment.cid).append(html);
	}
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	if($('body').find('.tempPos')[0]){
		range.setStart($('body').find('.tempPos')[0], 0)
		range.collapse(true);
		zss_editor.currentSelection.setRange(range);
  }
	$('body').find('.tempPos').removeClass('tempPos');
}
// 计算ppt占位高度
zss_editor.loadPPTheight = function (w, h) {
	var screenWidth = zss_editor.wWidth;
	var winWidth = parseInt(screenWidth - 50);
	var imgW1 = w;
	var imgH1 = h;
	var imgW2 = winWidth;
	if (imgW1 < imgW2) {
		imgW2 = imgW1;
	}
	var imgH2 = parseInt(imgW2 * imgH1 / imgW1);
	return imgH2;
}
//课程打点
zss_editor.markCourse = function (id, time, url, page, isScroll) {//录音id，录音打点时间，ppt图片，ppt页码
	var wid = url.split(',')[0];
	wid = wid.substring(wid.lastIndexOf('/') + 1);
	var tmp = '/' + wid + '/g';
	url = url.replace(eval(tmp), zss_editor.wWidth * 2 + "x");
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		var focuseId = zss_editor.getFocusedField();
		if (focuseId != null) {
			focuseId = focuseId.wrappedObject;
			if (focuseId[0] === $("#zss_editor_tit")[0]) {
				zss_editor.focusEditor();
			}
		}
	}
	// 同一秒中老师连续翻页
	if (zss_editor.recordTime.id == id && zss_editor.recordTime.time == time) {
		time = zss_editor.secondToTime(time);
		var img = '<div class="editor-image" contenteditable="false"><img src="' + url + '" class="image-package"/></div>' +
			'<p><br></p>';
		var page = '<div class="record-list-ppt" contenteditable="false">P' + page + '</div>\u200b'
		$(".record-list-time:contains(" + time + ")").parents(".record-list").append(img);
		$(".record-list-time:contains(" + time + ")").parents(".record-list-tit").append(page);

	} else {
		zss_editor.restoreRange();
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		zss_editor.recordTime = {id: id, time: time};
		time = zss_editor.secondToTime(time);
		if ($("#mark_" + id).length > 0) {
			if (isScroll == 1) {
				var list = '<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-ppt" contenteditable="false">P' + page + '</div>\u200b</div>' +
					'</div>';
				$("#mark_" + id).append(list);
				range.setStartAfter($(".record-tit-pos")[0]);
				range.setEndAfter($(".record-tit-pos")[0]);
				zss_editor.currentSelection.setRange(range);
				$(".record-list-tit").removeClass('record-tit-pos');
				var html = '<div class="editor-image" contenteditable="false"><img src="' + url + '" class="image-package"/></div>';
				zss_editor.insertHTML(html);
				zss_editor.jumpAfterImage();
//			    zss_editor.insertHTML('');
				if ($("body").hasClass('editorNoticeWrap')) {
					//通知客户端实现滚动到焦点位置
					setTimeout(zss_editor.clientscrollToCursorPos, 500);
				} else {
					//脚本实现滚动到焦点位置
					setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 500);
				}

			} else {
				var list = '<div class="record-list">' +
					'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-ppt" contenteditable="false">P' + page + '</div>\u200b</div>' +
					'<div class="editor-image" contenteditable="false"><img src="' + url + '" class="image-package"/></div>' +
					'<p><br></p>'
				'</div>';
				$("#mark_" + id).append(list);
			}

		} else {
			var node = range.commonAncestorContainer;
			if (!node.classList || !node.classList.contains('record-box')) {
				var parent = $(node).parents('.record-box');
				if (parent.length > 0) {
					range.setStartAfter(parent[0]);
					range.setEndAfter(parent[0]);
					zss_editor.currentSelection.setRange(range);
				}
			}
			if (time == "00:00") {
				var markHtml = '<p><br></p>' +
					'<div class="record-box" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-ppt" contenteditable="false">P' + page + '</div>\u200b</div>' +
					'</div>' +
					'</div>';
			} else {
				var markHtml = '<p><br></p>' +
					'<div class="record-box" id="mark_' + id + '">' +
					'<div class="record-list">' +
					'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">00:00</div>\u200b</div>' +
					'<p><br></p>' +
					'</div>' +
					'<div class="record-list">' +
					'<div class="record-list-tit record-tit-pos"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-ppt" contenteditable="false">P' + page + '</div>\u200b</div>' +
					'</div>' +
					'</div>';

			}

			zss_editor.insertHTML(markHtml);
			range.setStartAfter($(".record-tit-pos")[0]);
			range.setEndAfter($(".record-tit-pos")[0]);
			zss_editor.currentSelection.setRange(range);
			$(".record-list-tit").removeClass('record-tit-pos');
			var html = '<div class="editor-image" contenteditable="false"><img src="' + url + '" class="image-package"/></div>';
			zss_editor.insertHTML(html);
			zss_editor.jumpAfterImage();
//		    zss_editor.insertHTML('');
			if ($("body").hasClass('editorNoticeWrap')) {
				//通知客户端实现滚动到焦点位置
				setTimeout(zss_editor.clientscrollToCursorPos, 500);
			} else {
				//脚本实现滚动到焦点位置
				setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 500);
			}
		}
		$(".record-list-time").attr("contenteditable", "false");
		$(".record-list-ppt").attr("contenteditable", "false");
		$(".editor-image").attr("contenteditable", "false");
		//解决图片丢失不可编辑器属性
		$(".drag-image-wrap").attr("contenteditable", "false");
		this.enabledEditingItems();
		if ($("body").hasClass('editorNoticeWrap')) {
			//通知客户端实现滚动到焦点位置
			setTimeout(zss_editor.clientscrollToCursorPos, 50);
		} else {
			//脚本实现滚动到焦点位置
			setTimeout(zss_editor.calculateEditorHeightWithCaretPosition, 50);
		}
	}
	zss_editor.undoManagerSave()
}
zss_editor.jumpAfterMark = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.record-list-tit')) {
			pack = node;
		} else {
			pack = node.parents('.record-list-tit');
		}
		if (pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			zss_editor.currentSelection.setRange(range);
			pack = $("<p>\u200b</p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
// 打点重点
zss_editor.markFocus = function (id, time) {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	time = zss_editor.secondToTime(time);
	if ($("#mark_" + id).length > 0) {
		var list = '<div class="record-list record-list-cur">' +
			'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-focus" contenteditable="false"></div>\u200b</div>' +
			'</div>';
		$("#mark_" + id).append(list);
		range.setStart($(".record-list-cur")[0], 0);
		range.setEnd($(".record-list-cur")[0], 0);
		range.selectNodeContents($(".record-list-cur")[0]);
		range.collapse(false);
		var pack = $("<p>\u200b</p>")[0];
		range.insertNode(pack);
		range.selectNodeContents(pack);
		range.collapse(false);
		zss_editor.currentSelection.setRange(range);
		$(".record-list").removeClass('record-list-cur')


	} else {
		range = selection.getRangeAt(0);
		var node = range.commonAncestorContainer;
		if (!node.classList || !node.classList.contains('record-box')) {

			var parent = $(node).parents('.record-box');
			if (parent.length > 0) {
				range.setStartAfter(parent[0]);
				range.setEndAfter(parent[0]);
				// var pack = $("<p><br></p>")[0];
				// range.insertNode(pack);
				// range.selectNodeContents(pack);
				// range.collapse(false);
				zss_editor.currentSelection.setRange(range);
			}
		}
		var markHtml = '<p><br></p>' +
			'<div class="record-box" id="mark_' + id + '">' +
			'<div class="record-list">' +
			'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-focus" contenteditable="false"></div>\u200b</div>' +
			'</div>' +
			'</div>';
		zss_editor.insertHTML(markHtml);
		zss_editor.jumpAfterMark();
		$("#mark_" + id).after('<p><br></p>');

	}
	$(".record-list-time").attr("contenteditable", "false");
	this.enabledEditingItems();
	zss_editor.undoManagerSave()
}
// 打点疑问
zss_editor.markDoubt = function (id, time) {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	time = zss_editor.secondToTime(time);
	if ($("#mark_" + id).length > 0) {
		var list = '<div class="record-list record-list-cur">' +
			'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-doubt" contenteditable="false"></div>\u200b</div>' +
			'</div>';
		$("#mark_" + id).append(list);
		range.setStart($(".record-list-cur")[0], 0);
		range.setEnd($(".record-list-cur")[0], 0);
		range.selectNodeContents($(".record-list-cur")[0]);
		range.collapse(false);
		var pack = $("<p>\u200b</p>")[0];
		range.insertNode(pack);
		range.selectNodeContents(pack);
		range.collapse(false);
		zss_editor.currentSelection.setRange(range);
		$(".record-list").removeClass('record-list-cur')


	} else {
		range = selection.getRangeAt(0);
		var node = range.commonAncestorContainer;
		if (!node.classList || !node.classList.contains('record-box')) {
			var parent = $(node).parents('.record-box');
			if (parent.length > 0) {
				range.setStartAfter(parent[0]);
				range.setEndAfter(parent[0]);
				// var pack = $("<p><br></p>")[0];
				// range.insertNode(pack);
				// range.selectNodeContents(pack);
				// range.collapse(false);
				zss_editor.currentSelection.setRange(range);
			}
		}
		var markHtml = '<p><br></p>' +
			'<div class="record-box" id="mark_' + id + '">' +
			'<div class="record-list">' +
			'<div class="record-list-tit"><div class="record-list-time" contenteditable="false">' + time + '</div><div class="record-list-doubt" contenteditable="false"></div>\u200b</div>' +
			'</div>' +
			'</div>';
		zss_editor.insertHTML(markHtml);
		zss_editor.jumpAfterMark();
		$("#mark_" + id).after('<p><br></p>');

	}
	$(".record-list-time").attr("contenteditable", "false");
	this.enabledEditingItems();
	zss_editor.undoManagerSave()
}
//页面是否有选区
zss_editor.hasRange = function () {
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		if (range.collapsed) {
			return false;
		} else { //有选区
			return true;
		}
	} else {
		return false;
	}
}
//获取选区纯文本
zss_editor.getRangeText = function () {
	var rangeText = '';
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		if (!range.collapsed) {
			rangeText = range.toString();
		}
	}
	return rangeText;
}
//合并选区,true向前合并,false向后合并,默认向后合并
zss_editor.collapseRange = function (toStart) {
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		if (!range.collapsed) {//有选区
			if (toStart) {
				range.collapse(true);
			} else {
				range.collapse(false);
			}
			zss_editor.currentSelection.setRange(range);
			zss_editor.backupRange();
		}
	}
}
//移除当前选区内指定的inline标签，但保留其中的内容
zss_editor.removeInlineStyle = function (tagNames) {
	zss_editor.restoreRange();
	var range = window.getSelection().getRangeAt(0);
	var start = range.startContainer;
	if (range.collapsed) return range;
	zss_editor.shrinkBoundary();
	zss_editor.adjustmentBoundary();
	var start = range.startContainer, end = range.endContainer;
	while (1) {
		if (start.nodeType == 1) {
			if (tagNames.indexOf(start.tagName.toLowerCase()) > -1) {
				break;
			}
			if (start.tagName.toLowerCase() == 'body') {
				start = null;
				break;
			}
		}
		start = start.parentNode;
	}
	while (1) {
		if (end.nodeType == 1) {
			if (tagNames.indexOf(end.tagName.toLowerCase()) > -1) {
				break;
			}
			if (end.tagName.toLowerCase() == 'body') {
				end = null;
				break;
			}
		}
		end = end.parentNode;
	}
	var bookmark = zss_editor.createBookmark(),
		frag,
		tmpRange;
	if (start) {
		tmpRange = range.cloneRange();
		zss_editor.currentSelection.setRange(tmpRange);
		tmpRange.setEndBefore(bookmark.start);
		tmpRange.setStartBefore(start);
		zss_editor.currentSelection.setRange(tmpRange);
		frag = tmpRange.extractContents();
		tmpRange.insertNode(frag);
		zss_editor.clearEmptySibling(start, true);
		start.parentNode.insertBefore(bookmark.start, start);
	}
	if (end) {
		tmpRange = range.cloneRange();
		zss_editor.currentSelection.setRange(tmpRange);
		tmpRange.setStartAfter(bookmark.end);
		tmpRange.setEndAfter(end);
		zss_editor.currentSelection.setRange(tmpRange);
		frag = tmpRange.extractContents();
		tmpRange.insertNode(frag);
		zss_editor.clearEmptySibling(end, false, true);
		end.parentNode.insertBefore(bookmark.end, end.nextSibling);
	}
	var current = zss_editor.getNextDomNode(bookmark.start, false, function (node) {
		return node.nodeType == 1;
	}), next;
	while (current && current !== bookmark.end) {
		next = zss_editor.getNextDomNode(current, true, function (node) {
			return node.nodeType == 1;
		});
		if (tagNames.indexOf(current.tagName.toLowerCase()) > -1) {
			zss_editor.remove(current, true);
		}
		current = next;
	}
	return zss_editor.moveToBookmark(bookmark);
}
//调整range的开始位置和结束位置，使其"收缩"到最小的位置
zss_editor.shrinkBoundary = function (ignoreEnd) {
	zss_editor.restoreRange();
	var range = window.getSelection().getRangeAt(0);
	var start = range.startContainer;
	var me = range, child,
		collapsed = me.collapsed;

	function check(node) {
		return node.nodeType == 1 && !zss_editor.isBookmarkNode(node) && node.nodeName != 'BR' && node.nodeName != 'HR';
	}

	while (me.startContainer.nodeType == 1 && (child = me.startContainer.childNodes[me.startOffset]) && check(child)) {
		me.setStart(child, 0);
		zss_editor.currentSelection.setRange(me);
	}
	if (collapsed) {
		me.collapse(true)
		return me;
	}
	zss_editor.currentSelection.setRange(me);
	if (!ignoreEnd) {
		while (me.endContainer.nodeType == 1 && me.endOffset > 0 && (child = me.endContainer.childNodes[me.endOffset - 1]) && check(child)) {
			me.setEnd(child, child.childNodes.length);
			zss_editor.currentSelection.setRange(me);
		}
	}
	return me;
}
// 加粗斜体下划线删除线字体基础设置
zss_editor.execCommand = function (name, cmdName) {
	var range = window.getSelection().getRangeAt(0);
	var start = range.commonAncestorContainer;
	if (start.nodeType == 3) {
		while (!start.nodeName.toLowerCase() == name) {
			start = start.parentNode;
		}
	}
	if (isIOS) {
		if (range.collapsed) {
			if ($(start).is(name) || $(start).parents(name).length > 0) {
				var strike;
				if ($(start).parents(name).length > 0) {
					strike = $(start).parents(name)[$(start).parents(name).length - 1];
				} else {
					strike = start;
				}
				var tagName = strike.nodeName.toLowerCase();
				var tmpText = document.createTextNode("\u200b");
				//       range.setStartAfter(start);
				// range.setEndAfter(start);
				// zss_editor.currentSelection.setRange(range);
				range.insertNode(tmpText);
				zss_editor.currentSelection.setRange(range);
				zss_editor.removeInlineStyle(tagName);
				range.setStartAfter(tmpText);
				range.setEndAfter(tmpText);
				// zss_editor.remove(tmpText);
				range.collapse(true);
				zss_editor.currentSelection.setRange(range);
			} else {
				var tmpNode = document.createElement(name);
				tmpNode.appendChild(document.createTextNode("\u200b"));
				range.insertNode(tmpNode);
				zss_editor.jumpAfterNode(tmpNode);
			}


		} else {
			document.execCommand(cmdName, false, null);
		}
	} else {
		if (range.collapsed) {
			if ($(start).is(name) || $(start).parents(name).length > 0) {
				document.execCommand(cmdName, false, null);
			} else {
				var tmpNode = document.createElement(name);
				tmpNode.appendChild(document.createTextNode("\u200b"));
				range.insertNode(tmpNode);
				zss_editor.jumpAfterNode(tmpNode);
			}
		} else {
			document.execCommand(cmdName, false, null);
		}

	}
}
// Fonts
zss_editor.setBold = function (isrecovery) {
	// document.execCommand('bold', false, null);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'bold';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	zss_editor.execCommand('b', 'bold');
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
};
zss_editor.setItalic = function (isrecovery) {
	// document.execCommand('italic', false, null);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'italic';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	zss_editor.execCommand('i', 'italic');
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
};
zss_editor.setUnderline = function (isrecovery) {
	// document.execCommand('underline', false, null);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'underline';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	zss_editor.execCommand('u', 'underline');
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
};

//删除线
zss_editor.setStrikeThrough = function (isrecovery) {
	// document.execCommand('strikethrough', false, null);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'strikethrough';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	zss_editor.execCommand('strike', 'strikethrough');
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
};

//高亮
zss_editor.setBackgroundColor = function (status, isrecovery, value) {
	var color;
	if (status == 1) {
		color = "#ffd696";
	} else if (status == 0) {
		color = "#ffffff";
	}
	zss_editor.restoreRange();

	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		if (value) {
			color = value;
		}
		data.name = "execCommand";
		data.cmdName = 'backcolor';
		data.value = color;
		data.address = address;
		zss_editor.sendJoinData(data);
	}

	var selection = window.getSelection();
	if (selection.getRangeAt(0).collapsed) {
		var range = selection.getRangeAt(0);
		var span = zss_editor.closerParentNodeStartingAtNode("span", range.startContainer);
		if (span && !span.children.length && !span['textContent'].replace("​", '').length) {
			span.style.cssText += "background-color:" + color;
		} else {
			var el = document.createElement("span");
			el.style.cssText = "background-color:" + color;
			range.surroundContents(el);
			el.appendChild(document.createTextNode('\u200B'));
			zss_editor.jumpAfterNode(el);
		}
	} else {
		document.execCommand("styleWithCSS", null, true);
		document.execCommand('hiliteColor', false, color);
		document.execCommand("styleWithCSS", null, false);
	}

	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
};
//增加缩进
zss_editor.setIndent = function (isrecovery) {
	zss_editor.restoreRangeBlur();
	var range = window.getSelection().getRangeAt(0);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'indent';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (start.nodeType == 1 && start.getAttribute('class') && start.getAttribute('class').indexOf('record-list-tit') > -1) {//打点时间后面缩进

		var newp = document.createElement('p');
		//2022.05.11协同编辑加elementid
		newp.setAttribute('element-id', zss_editor.getRandomId());
		newp.appendChild(document.createTextNode('\u200B'));
		start.after(newp);
		range.setStart(newp, 0);
		range.setEnd(newp, 0);
		zss_editor.currentSelection.setRange(range);
		start = newp;
		var marginLeft = start.style.marginLeft;
		if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
			mleft = parseInt(marginLeft.substr(0, marginLeft.length - 2)); //数值
			if (mleft < 10) {
				start.style.marginLeft = parseInt(mleft + 2) + 'em';
			}
		} else {
			start.style.cssText += 'margin-left:2em';
		}
	} else if (start.nodeType == 1 && start.parentNode.getAttribute('class') && start.parentNode.getAttribute('class').indexOf('record-list') > -1) {
		var marginLeft = start.style.marginLeft;
		if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
			mleft = parseInt(marginLeft.substr(0, marginLeft.length - 2)); //数值
			if (mleft < 10) {
				start.style.marginLeft = parseInt(mleft + 2) + 'em';
			}
		} else {
			start.style.cssText += 'margin-left:2em';
		}
	} else if ($(start).is('.todo-view') || $(start).parents('.todo-view').length > 0) {
		if ($(start).parents('.todo-view').length > 0) {
			todo = $(start).parents('.todo-view')[$(start).parents('.todo-view').length - 1]
		} else {
			todo = start;
		}
		var marginLeft = start.style.marginLeft;
		if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
			mleft = parseInt(marginLeft.substr(0, marginLeft.length - 2)); //数值
			if (mleft < 10) {
				start.style.marginLeft = parseInt(mleft + 2) + 'em';
			}
		} else {
			start.style.cssText += 'margin-left:2em';
		}
	} else {
		range = zss_editor.shrinkBoundary();
		var li = zss_editor.findParent(range.startContainer, function (node) {
			return node.tagName == 'LI'
		}, true);
		var list = zss_editor.findParent(range.startContainer, function (node) {
			return node.tagName == 'OL' || node.tagName == 'UL'
		}, true);
		if (li && list) {
			if (range.collapsed) {
				var level = parseInt(list.getAttribute('level'));
				if (level < 6) {
					list.setAttribute('level', ++level);
					if (list.tagName == 'OL') {
						indentlist(list);
					}
				}
			} else {
				var bk = zss_editor.createBookmark();
				if (bk.end) {
					while (list && zss_editor.isTagNode(list, 'ol ul') && !(zss_editor.getPosition(list, bk.end) & 2)) {
						var level = parseInt(list.getAttribute('level'));
						if (level < 6) {
							list.setAttribute('level', ++level);
							if (list.tagName == 'OL') {
								indentlist(list);
							}
						}
						list = list.nextSibling;
					}
				}
				zss_editor.moveToBookmark(bk);
			}
		} else {
			//缩进用margin实现2021.06.02
			var notExchange = {
				'P': 1,
				'H1': 1,
				'H2': 1,
				'H3': 1,
				'H4': 1,
				'H5': 1,
				'H6': 1,
				'DIV': 1,
			}
			var filterFn = function (node) {
				return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
			}

			function indent(ele) {
				var marginLeft = ele.style.marginLeft;
				if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
					mleft = parseInt(marginLeft.substr(0, marginLeft.length - 2)); //数值
					if (mleft < 10) {
						ele.style.marginLeft = parseInt(mleft + 2) + 'em';
					}
				} else {
					ele.style.cssText += 'margin-left:2em';
				}
			}

			var bk = zss_editor.createBookmark(), end = bk.end,
				current = zss_editor.getNextDomNode(bk.start, false, filterFn);
			var block = zss_editor.isBlockElm;
			//开始
			var start = zss_editor.findParentByTagName(range.startContainer, ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], true);
			if (start && !zss_editor.isEditorMain(start)) {
				indent(start);
			}
			if (end) {
				while (current && current !== bk.end && (zss_editor.getPosition(current, bk.end) & 4)) {
					if (current.nodeType == 3 || current.tagName != 'LI') {
						if (current.nodeType == 1 && (current.tagName == 'OL' || current.tagName == 'UL')) {


						}
						tmpNode = current;
						while (current && current !== bk.end && (!block(current) || zss_editor.isBookmarkNode(current))) {
							tmpNode = current;
							current = zss_editor.getNextDomNode(current, false, null, function (node) {
								return !notExchange[node.tagName];
							});
						}
						if (current && block(current)) {
							indent(current);
							tmp = zss_editor.getNextDomNode(tmpNode, false, filterFn);
							if (tmp && zss_editor.isBookmarkNode(tmp)) {
								current = zss_editor.getNextDomNode(tmp, false, filterFn);
								tmpNode = tmp;
							}
						}
						current = zss_editor.getNextDomNode(tmpNode, false, filterFn);

					} else {
						current = zss_editor.getNextDomNode(current, true, filterFn);
					}

				}
			}
			zss_editor.moveToBookmark(bk);
			//document.execCommand('indent', false, null);
		}

	}
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave();
};
//减少缩进
zss_editor.setOutdent = function (isrecovery) {
	zss_editor.restoreRangeBlur();
	var range = window.getSelection().getRangeAt(0);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'indent';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (start.nodeType == 1 && start.parentNode.getAttribute('class') && start.parentNode.getAttribute('class').indexOf('record-list') > -1) {
		var marginLeft = start.style.marginLeft;
		if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
			mleft = marginLeft.substr(0, marginLeft.length - 2); //数值
			if (mleft >= 2) {
				start.style.marginLeft = parseInt(mleft - 2) + 'em';
			} else {
				start.style.marginLeft = 0;
			}
		} else {
			start.style.cssText += 'margin-left:0';
		}
	} else if ($(start).is('.todo-view') || $(start).parents('.todo-view').length > 0) {
		if ($(start).parents('.todo-view').length > 0) {
			todo = $(start).parents('.todo-view')[$(start).parents('.todo-view').length - 1]
		} else {
			todo = start;
		}
		var marginLeft = start.style.marginLeft;
		if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
			mleft = marginLeft.substr(0, marginLeft.length - 2); //数值
			if (mleft >= 2) {
				start.style.marginLeft = parseInt(mleft - 2) + 'em';
			} else {
				start.style.marginLeft = 0;
			}
		} else {
			todo.style.cssText += 'margin-left:0';
		}
	} else {
		range = zss_editor.shrinkBoundary();
		var li = zss_editor.findParent(range.startContainer, function (node) {
			return node.tagName == 'LI'
		}, true);
		var list = zss_editor.findParent(range.startContainer, function (node) {
			return node.tagName == 'OL' || node.tagName == 'UL'
		}, true);
		if (li && list) {
			if (range.collapsed) {
				var level = parseInt(list.getAttribute('level'));
				if (level > 1) {
					list.setAttribute('level', --level);
					if (list.tagName == 'OL') {
						outdentlist(list);
					}
				}
			} else {
				var bk = zss_editor.createBookmark();
				if (bk.end) {
					while (list && zss_editor.isTagNode(list, 'ol ul') && !(zss_editor.getPosition(list, bk.end) & 2)) {
						var level = parseInt(list.getAttribute('level'));
						if (level > 1) {
							list.setAttribute('level', --level);
							if (list.tagName == 'OL') {
								outdentlist(list);
							}
						}
						list = list.nextSibling;
					}
				}
				zss_editor.moveToBookmark(bk);
			}
		} else {
			//缩进用margin实现2021.06.02
			var notExchange = {
				'P': 1,
				'H1': 1,
				'H2': 1,
				'H3': 1,
				'H4': 1,
				'H5': 1,
				'H6': 1,
				'DIV': 1,
			}
			var filterFn = function (node) {
				return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
			}

			function outdent(ele) {
				var marginLeft = ele.style.marginLeft;
				if (marginLeft.indexOf('em') > -1 && marginLeft.indexOf('rem') == -1) {
					mleft = marginLeft.substr(0, marginLeft.length - 2); //数值
					if (mleft >= 2) {
						ele.style.marginLeft = parseInt(mleft - 2) + 'em';
					} else {
						ele.style.marginLeft = 0;
					}
				} else {
					ele.style.cssText += 'margin-left:0';
				}
			}

			var bk = zss_editor.createBookmark(), end = bk.end,
				current = zss_editor.getNextDomNode(bk.start, false, filterFn);
			var block = zss_editor.isBlockElm;
			//开始
			var start = zss_editor.findParentByTagName(range.startContainer, ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'], true);
			if (start && !zss_editor.isEditorMain(start)) {
				outdent(start);
			}
			if (end) {
				while (current && current !== bk.end && (zss_editor.getPosition(current, bk.end) & 4)) {
					if (current.nodeType == 3 || current.tagName != 'LI') {
						if (current.nodeType == 1 && (current.tagName == 'OL' || current.tagName == 'UL')) {


						}
						tmpNode = current;
						while (current && current !== bk.end && (!block(current) || zss_editor.isBookmarkNode(current))) {
							tmpNode = current;
							current = zss_editor.getNextDomNode(current, false, null, function (node) {
								return !notExchange[node.tagName];
							});
						}
						if (current && block(current)) {
							outdent(current);
							tmp = zss_editor.getNextDomNode(tmpNode, false, filterFn);
							if (tmp && zss_editor.isBookmarkNode(tmp)) {
								current = zss_editor.getNextDomNode(tmp, false, filterFn);
								tmpNode = tmp;
							}
						}
						current = zss_editor.getNextDomNode(tmpNode, false, filterFn);

					} else {
						current = zss_editor.getNextDomNode(current, true, filterFn);
					}

				}
			}
			zss_editor.moveToBookmark(bk);
			//document.execCommand('outdent', false, null);
		}

	}
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave();
};
zss_editor.setJustifyCenter = function (isrecovery) {
	//zss_editor.restoreRangeBlur();

	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'justify';
		data.value = 'center';
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	document.execCommand('justifyCenter', false, null);
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave();
};
zss_editor.setJustifyLeft = function (isrecovery) {
	//zss_editor.restoreRangeBlur();
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'justify';
		data.value = 'left';
		data.address = address;
		zss_editor.sendJoinData(data);
	}

	document.execCommand('justifyLeft', false, null);
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave();
};
zss_editor.setJustifyRight = function (isrecovery) {
	//zss_editor.restoreRangeBlur();

	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'justify';
		data.value = 'right';
		data.address = address;
		zss_editor.sendJoinData(data);
	}

	document.execCommand('justifyRight', false, null);
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave();
};
zss_editor.enlargeRange = function (range) {
	var start = range.startContainer;
	var end = range.endContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (end.nodeType == 3) {
		while (!zss_editor.isBlockElm(end)) {
			end = end.parentNode;
		}
	}
	range.setStart(start, 0);
	range.setEndAfter(end);
	zss_editor.currentSelection.setRange(range);
}
zss_editor.setOrderedList = function (isrecovery, eleNum) {
	//zss_editor.restoreRangeBlur();
	var range = window.getSelection().getRangeAt(0);
	if (!$('#zss_editor_content')[0].firstChild) {
		$('#zss_editor_content').append('<p><br></p>');
		range.setStart($('#zss_editor_content')[0].firstChild, 0);
	}
	//20200721 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'insertorderedlist';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	range = zss_editor.shrinkBoundary();
	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (range.collapsed && start.nodeType == 1 && start.previousSibling && start.previousSibling.nodeType == 1 && start.previousSibling.getAttribute('class') && start.previousSibling.getAttribute('class').indexOf('record-box') > -1) {
		var ol = document.createElement('ol');
		//2022.05.11协同编辑加elementid
		ol.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		start.parentNode.insertBefore(ol, start);
		ol.appendChild(li);
		li.appendChild(start);
		$(ol).attr('data-origin-start', '1').attr('level', '1').attr('serialnum', '1');
		$(li).attr('serialnum', '1');
		range.setStartAfter(start.lastChild);
		range.setEndAfter(start.lastChild);
		zss_editor.currentSelection.setRange(range);
	} else if (range.collapsed && ($(start).is('.todo-view') || $(start).parents('.todo-view').length > 0)) {
		var bk = zss_editor.createBookmark();
		var todo;
		if ($(start).parents('.todo-view').length > 0) {
			todo = $(start).parents('.todo-view')[$(start).parents('.todo-view').length - 1]
		} else {
			todo = start;
		}
		var todoText = $(todo).find(".todo-text")[0];
		var ol = document.createElement('ol');
		//2022.05.11协同编辑加elementid
		ol.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		ol.appendChild(li);
		todo.parentNode.insertBefore(ol, todo);
		$(ol).attr('data-origin-start', '1').attr('level', '1').attr('serialnum', '1');
		$(li).attr('serialnum', '1');
		while (todoText.firstChild) {
			li.appendChild(todoText.firstChild);
		}
		// 录音开始标记挪到序号里，标记移到ol上
		if (todo.getAttribute('class') && todo.getAttribute('class').indexOf('voiceBegin') > -1) {
			todo.classList.remove("voiceBegin");
			todo.className = "voiceBegin";
		}
		todo.remove();
		zss_editor.moveToBookmark(bk);
		//li跟随第一个子元素的颜色变化
		var list = ol;
		if (list.firstChild.firstChild.firstChild && list.firstChild.firstChild.firstChild.style && list.firstChild.firstChild.firstChild.innerText.length > 1) {
//      	list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
			//2021.07.30
			var style = list.firstChild.firstChild.firstChild.style.cssText;
			zss_editor.getSomeStyle(list.firstChild, style);
			list.firstChild.style.backgroundColor = '';
		}
	} else if (range.collapsed && ($(start).is('ol') || $(start).parents('ol').length > 0 || $(start).is('ul') || $(start).parents('ul').length > 0)) { //有序下点有序或无序
		var bk = zss_editor.createBookmark();
		var ol = $(start).parents('ol,ul')[0] || $(start)[0];
		var li = $(start).parents('li')[0];
		if (ol.tagName == 'OL' && ($(ol).attr('data-start') || $(ol).attr('data-origin-start'))) {
			//取消第一行列表,后面一个序号变成1
			list = ol;
			var level = list.getAttribute('level');
			var serialnum = addSerialNum(list.getAttribute('serialnum'), level);
			var listnext = list.nextSibling;
			while (listnext) {
				if ((listnext.nodeName == 'OL' || listnext.nodeName == 'UL') && listnext.getAttribute('level') == level && (listnext.getAttribute('data-start') || listnext.getAttribute('data-origin-start'))) {
					break;
				} else if (listnext.tagName == 'OL' && listnext.getAttribute('level') == level && listnext.getAttribute('serialnum') == serialnum) {
					if (list.getAttribute('data-origin-start')) {
						listnext.setAttribute('data-origin-start', list.getAttribute('data-origin-start'));
					} else {
						listnext.setAttribute('data-start', list.getAttribute('data-start'));
					}
					listnext.setAttribute('serialnum', list.getAttribute('serialnum'));
					listnext.firstChild.setAttribute('serialnum', list.getAttribute('serialnum'))
					break;
				} else {
					listnext = listnext.nextSibling;
				}
			}
		}
		if (ol.tagName == 'OL' && (start.nodeName == 'OL' || start.nodeName == 'UL' || start.nodeName == 'LI' || (li.firstChild && start == li.firstChild))) { //第一行,取消列表
			if (start.nodeType == 1 && start.nodeName != 'OL' && start.nodeName != 'UL') {  //start在ol内,断开列表
				while (start.nodeName != 'OL' && start.nodeName != 'UL') {
					if (start.nodeName == 'LI') {
						break;
					} else {
						start = start.parentNode;
					}
				}
				if (start.nodeType == 1 && start.nodeName == 'LI') {
					zss_editor.breakParent(start, ol);
					if (!start.previousSibling.firstChild || !start.previousSibling.firstChild.firstChild) {
						start.previousSibling.remove();
					}
					if (!start.nextSibling.firstChild || !start.nextSibling.firstChild.firstChild) {
						start.nextSibling.remove();
					}
					while (start.firstChild) {
						if (start.firstChild.nodeType == 3 && start.firstChild.nodeValue != '') {
							p = document.createElement('p');
							//2022.05.11协同编辑加elementid
							p.setAttribute('element-id', zss_editor.getRandomId());
							p.appendChild(start.firstChild);
							start.parentNode.insertBefore(p, start);
						} else {
							start.parentNode.insertBefore(start.firstChild, start);
						}
					}
					start.remove();
				}
			} else {
				while (ol.firstChild) {
					while (ol.firstChild.firstChild) {
						if ((ol.firstChild.firstChild.nodeType == 3) || (ol.firstChild.firstChild.nodeType == 1 && ol.firstChild.firstChild.nodeName == 'BR')) {
							var p = document.createElement('p');
							//2022.05.11协同编辑加elementid
							p.setAttribute('element-id', zss_editor.getRandomId());
							p.appendChild(ol.firstChild.firstChild);
							ol.parentNode.insertBefore(p, ol);
						} else {
							ol.parentNode.insertBefore(ol.firstChild.firstChild, ol);
						}
					}
					ol.firstChild.remove();
				}
				ol.remove();
			}
		} else {//start不是li的第一行
			zss_editor.breakParent(start, ol);
			if (!start.previousSibling.firstChild || !start.previousSibling.firstChild.firstChild) {
				start.previousSibling.remove();
			}
			if (!start.nextSibling.firstChild) {
				var newli = document.createElement('LI');
				newli.setAttribute('serialnum', addSerialNum(start.nextSibling.getAttribute('serialnum'), start.nextSibling.getAttribute('level')));
				start.nextSibling.appendChild(li);
			}
			if (start.nextSibling.nodeName != "OL") {
				var oldlist = start.nextSibling;
				var newlist = document.createElement('OL');
				//2022.05.11协同编辑加elementid
				newlist.setAttribute('element-id', zss_editor.getRandomId());
				while (start.nextSibling.firstChild) {
					newlist.appendChild(start.nextSibling.firstChild)
				}
				newlist.setAttribute('data-origin-start', '1');
				newlist.setAttribute('serialnum', '1');
				newlist.firstChild.setAttribute('serialnum', '1');
				start.parentNode.insertBefore(newlist, start.nextSibling);
				oldlist.remove()
			}
			newli = start.nextSibling.firstChild;
			newli.prepend(start);
		}
		zss_editor.moveToBookmark(bk);
		normalList();
		if (!zss_editor.wWidth) {
			zss_editor.wWidth = $(window).width();
		}
		var width = zss_editor.wWidth - 30;
		zss_editor.updateAllIframeWidth(width);
	} else if (!!eleNum) {
		var bk = zss_editor.createBookmark(true);
		var ol = document.createElement('ol');
		//2022.05.11协同编辑加elementid
		ol.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		ol.appendChild(li);
		start.parentNode.insertBefore(ol, start);
		li.appendChild(start);
		if (document.getElementById(bk.start).previousSibling) {
			document.getElementById(bk.start).previousSibling.remove();
		}
		if (document.getElementById(bk.start).nextSibling) {
			document.getElementById(bk.start).nextSibling.remove();
		}
		// if(start.innerHTML == ''){
		// 	start.appendChild(document.createTextNode("​"));
		// }
		if (zss_editor.isEmptyNode(start)) {
			start.appendChild(document.createElement('br'));
		}
		// start.appendChild(document.createElement('br'));
		$(ol).attr('data-origin-start', eleNum).attr('level', '1').attr('serialnum', eleNum);
		$(ol.firstChild).attr('serialnum', eleNum);
		range.setStart(start, 0);
		range.setEnd(start, 0);
		zss_editor.currentSelection.setRange(range);
		// zss_editor.moveToBookmark(bk);
		//li跟随第一个子元素的颜色变化
		var list = ol;
		if (list.firstChild.firstChild.firstChild && list.firstChild.firstChild.firstChild.style && list.firstChild.firstChild.firstChild.innerText.length > 1) {
//      	list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
			//2021.07.30
			var style = list.firstChild.firstChild.firstChild.style.cssText;
			zss_editor.getSomeStyle(list.firstChild, style);
			list.firstChild.style.backgroundColor = '';
		}
		zss_editor.moveToBookmark(bk);
		normalList();
	} else if (range.collapsed && ($(start).is('p') || $(start).parents('p').length > 0)) {
		var p;
		if ($(start).parents('p').length > 0) {
			p = $(start).parents('p')[$(start).parents('p').length - 1]
		} else {
			p = start;
		}
		//解决设置列表光标不居中问题
		if (p && p.firstChild && p.firstChild.nodeName == 'BR') {
			range.setStart(p, 0);
			range.setEnd(p, 0);
			var text = document.createTextNode("\u200b");
			range.insertNode(text);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
		var bk = zss_editor.createBookmark();
		var ol = document.createElement('ol');
		//2022.05.11协同编辑加elementid
		ol.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		ol.appendChild(li);
		p.parentNode.insertBefore(ol, p);
		li.appendChild(p);
		//如果前一个是列表,继续编号
		if (ol.previousElementSibling && ol.previousElementSibling.tagName == 'OL') {
			var olprev = ol.previousElementSibling;
			var level = olprev.getAttribute('level');
			var serialnum = olprev.getAttribute('serialnum');
			$(ol).attr('level', level).attr('serialnum', addSerialNum(serialnum, level));
			$(ol.firstChild).attr('serialnum', $(ol).attr('serialnum'));
		} else {
			$(ol).attr('data-origin-start', '1').attr('level', '1').attr('serialnum', '1');
			$(ol.firstChild).attr('serialnum', '1');
		}
		// 录音开始标记挪到序号里，标记移到ol上
		if (p.getAttribute('class') && p.getAttribute('class').indexOf('voiceBegin') > -1) {
			p.classList.remove("voiceBegin");
			ol.className = "voiceBegin";
		}
		zss_editor.moveToBookmark(bk);
		//li跟随第一个子元素的颜色变化
		var list = ol;
		//文字前面是列表点有序,光标位置有问题,需要注释掉
//		if(list.firstChild.firstChild.firstChild){
//			range.setStart(list.firstChild.firstChild.firstChild,list.firstChild.firstChild.firstChild.length);
//			range.setEnd(list.firstChild.firstChild.firstChild,list.firstChild.firstChild.firstChild.length);
//			zss_editor.currentSelection.setRange(range);
//		}
		if (list.firstChild.firstChild.firstChild && list.firstChild.firstChild.firstChild.style && list.firstChild.firstChild.firstChild.innerText.length > 1) {
//      	list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
			//2021.07.30
			var style = list.firstChild.firstChild.firstChild.style.cssText;
			zss_editor.getSomeStyle(list.firstChild, style);
			list.firstChild.style.backgroundColor = '';
		}
		normalList();
	} else if (!range.collapsed) {
		zss_editor.adjustmentBoundary();
		zss_editor.shrinkBoundary();
		var bko = zss_editor.createBookmark(true),
			startLi = getLi(document.getElementById(bko.start)),
			endLi = getLi(document.getElementById(bko.end)),
			list, tmp;
		var filterFn = function (node) {
			return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
		};
		var notExchange = {
			'TD': 1,
			'PRE': 1,
			'BLOCKQUOTE': 1,
			'DIV': 1,
		}
		zss_editor.moveToBookmark(bko);

		if (startLi && endLi && startLi.parentNode.tagName == 'OL') {
			//有选区取消列表或加列表
			var startnext, startparentparent;
			start = startLi.parentNode;
			end = endLi.parentNode;
			startprev = start.previousSibling;
			endnext = start.nextSibling;
			endparent = start.parentNode;

			//如果取消列表第一行是序号1,取消列表后endLi后面的一个元素序号设置为1
			var level = start.getAttribute('level');
			var endserial = endLi.getAttribute('serialnum');
			var endnext = end.nextElementSibling;
			if (serialnumToInt(startLi.getAttribute('serialnum'), level) == 1 && endnext && endnext.nodeName == 'OL' && endnext.getAttribute('serialnum') == addSerialNum(endserial, level)) {
				endnext.setAttribute('serialnum', startLi.getAttribute('serialnum'));
				endnext.setAttribute('data-origin-start', 1);
				endnext.firstChild.setAttribute('serialnum', startLi.getAttribute('serialnum'));
			}
			var bk = zss_editor.createBookmark(),
				current = start,
				cloneRange = range.cloneRange(),
				tmpNode,
				block = zss_editor.isBlockElm;
			while (current && !(zss_editor.getPosition(current, bk.end) & 2)) {
				if ($(current).parents('li').length > 0) {
					cloneRange.setStartBefore($(current).parents('li').children().first()[0]);
					cloneRange.setEndAfter($(current).parents('li').children().last()[0]);

					var list = $(cloneRange.startContainer).parents('ul')[0] || $(cloneRange.startContainer).parents('ol')[0];
					var lip = cloneRange.extractContents();
					cloneRange.setEndBefore(list);
					cloneRange.setEndBefore(list);
					cloneRange.insertNode(lip);
					current = list.previousSibling;
					list.remove();
					current = zss_editor.getNextDomNode(current, false, filterFn);
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			zss_editor.currentSelection.setRange(range);
			zss_editor.moveToBookmark(bk);
			normalList();
		} else {
			range = zss_editor.enlarge(true, function (node) {
				return notExchange[node.tagName];
			});
			//选区有标注和勾选框的暂时设置不允许设置列表
			var rangecontent = range.cloneContents();
			if (rangecontent.querySelector('.record-list') || rangecontent.querySelector('.record-list-tit') || rangecontent.querySelector('.todo-view') || rangecontent.querySelector('.todo-mark')) {
				return;
			}
			frag = document.createDocumentFragment();
			var bk = zss_editor.createBookmark(null, null, range),
				current = zss_editor.getNextDomNode(bk.start, false, filterFn),
				tmpRange = range.cloneRange(),
				tmpNode,
				block = zss_editor.isBlockElm;

			while (current && current !== bk.end && (zss_editor.getPosition(current, bk.end) & 4)) {
				if (current.nodeType == 1 && current.getAttribute('contenteditable') == 'false') {
					if (frag.lastChild) {
						var tmpNode = current;
						current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
						frag.lastChild.appendChild(tmpNode);
						//附件后面如果是空行就移到附件后面,没有就创建2021.06.08
						if (zss_editor.isEmptyNode(current)) {
							var tmpNode = current;
							current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
							frag.lastChild.appendChild(tmpNode);
						} else {
							var p = document.createElement('p');
							//2022.05.11协同编辑加elementid
							p.setAttribute('element-id', zss_editor.getRandomId());
							var br = document.createElement('br');
							p.appendChild(br);
							frag.lastChild.appendChild(p);
						}

					}
				} else if (current.nodeType == 3 || current.tagName != 'LI') {
					if (current.nodeType == 1 && (current.tagName == 'OL' || current.tagName == 'UL')) {
						while (current.firstChild) {
							frag.appendChild(current.firstChild);
						}
						tmpNode = zss_editor.getNextDomNode(current, false, filterFn);
						current.remove();
						current = tmpNode;
						continue;
					}
					tmpNode = current;
					tmpRange.setStartBefore(current);

					while (current && current !== bk.end && (!block(current) || zss_editor.isBookmarkNode(current))) {
						tmpNode = current;
						current = zss_editor.getNextDomNode(current, false, null, function (node) {
							return !notExchange[node.tagName];
						});
					}
					if (current && block(current)) {
						tmp = zss_editor.getNextDomNode(tmpNode, false, filterFn);
						if (tmp && zss_editor.isBookmarkNode(tmp)) {
							current = zss_editor.getNextDomNode(tmp, false, filterFn);
							tmpNode = tmp;
						}
					}
					tmpRange.setEndAfter(tmpNode);
					current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
					var li = document.createElement('li');
					li.appendChild(tmpRange.extractContents());
					if (zss_editor.isEmptyNode(li)) {
						var tmpNode = document.createElement('p');
						tmpNode.setAttribute('element-id', zss_editor.getRandomId())
						while (li.firstChild) {
							tmpNode.appendChild(li.firstChild)
						}
						li.appendChild(tmpNode);
					}
					frag.appendChild(li);
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			range.collapse(true);

			var nowlist = $(range.startContainer).parent('ol,ul')[0];
			if (nowlist) {
				range.setStartAfter(nowlist);
				range.collapse(true);
			}
			list = document.createElement('OL');
			//2022.05.11协同编辑加elementid
			list.setAttribute('element-id', zss_editor.getRandomId());
			list.setAttribute('data-origin-start', 1);
			list.setAttribute('level', 1);
			list.appendChild(frag);
			if (list.firstChild.firstChild.firstChild && list.firstChild.firstChild.firstChild.style && list.firstChild.firstChild.firstChild.innerText.length > 1) {
				//list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
				//2021.07.30
				var style = list.firstChild.firstChild.firstChild.style.cssText;
				zss_editor.getSomeStyle(list.firstChild, style);
				list.firstChild.style.backgroundColor = '';
			}
			range.insertNode(list);

			//和上一列表合并
			var listprev = list.previousSibling;
			while (listprev) {
				if (listprev.tagName == 'OL') {
					list.setAttribute('serialnum', addSerialNum(listprev.getAttribute('serialnum'), listprev.getAttribute('level')));
					list.firstChild.setAttribute('serialnum', list.getAttribute('serialnum'));
					list.setAttribute('level', listprev.getAttribute('level'));
					list.removeAttribute('data-origin-start');
					list.removeAttribute('data-start');
					break;
				} else if (listprev.firstChild && listprev.innerText.trim() == '' && !listprev.querySelector('img') && !listprev.querySelector('iframe') && !listprev.querySelector('hr')) {
					list.setAttribute('data-origin-start', '1');
					break;
				} else {
					listprev = listprev.previousSibling;
				}
			}

			zss_editor.moveToBookmark(bk);
			var last = list.lastChild.lastChild;
			normalList();
			if (last) {
				if (zss_editor.isBlockElm(last)) {
					range.setEnd(last, last.childNodes.length);
				} else {
					range.setEndAfter(last);
				}
			}

			zss_editor.currentSelection.setRange(range);
		}

	} else {
		document.execCommand('insertOrderedList', false, null);
		//20210430选区设置有序列表改为新列表
		normaloldlist();
	}
	//调整附件宽度
	var width = zss_editor.wWidth - 30;
	zss_editor.updateAllIframeWidth(width);
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave()
};
zss_editor.getSomeStyle = function (ele, style) {
	style = style.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');
	style = style.split(';');
	for (var j = 0, s; s = style[j++];) {
		if (s.split(':')[0].indexOf("font-size") != -1 || s.split(':')[0].indexOf("color") != -1 || s.split(':')[0].indexOf("font-family") != -1) {
			ele.style[zss_editor.cssStyleToDomStyle(s.split(':')[0])] = s.split(':')[1];
		}

	}

}

function getLi(start) {
	while (start && !zss_editor.isBody(start)) {
		if (start.nodeName == 'TABLE') {
			return null;
		}
		if (start.nodeName == 'LI') {
			return start
		}
		start = start.parentNode;
	}
}

zss_editor.todo = function (isrecovery) {
	zss_editor.restoreRange();
	var range = window.getSelection().getRangeAt(0);
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'checkbox';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}

	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	//2022.05.11协同编辑加elementid
	var elementId = zss_editor.getRandomId();
	//选区有录音打点和列表的暂时设置不允许设置勾选框
	var rangecontent = range.cloneContents();
	if (rangecontent.querySelector('.record-list') || rangecontent.querySelector('.record-list-tit') || rangecontent.querySelector('li')) {
		return;
	}
	var li = zss_editor.findParentByTagName(range.startContainer, 'li', true) || $(range.startContainer).find('li')[0];
	if (li) {
		return;
	}
	if (!range.collapsed) {

		var filterFn = function (node) {
			return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
		};
		var bko = zss_editor.createBookmark(true);
		var filterFn = function (node) {
			return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
		};
		var notExchange = {
			'TD': 1,
			'PRE': 1,
			'BLOCKQUOTE': 1,
			'DIV': 1,
		}
		range = zss_editor.enlarge(true);
		zss_editor.currentSelection.setRange(range);
		var bookmark2 = zss_editor.createBookmark(null, null, range),
			current = zss_editor.getNextDomNode(bookmark2.start, false, filterFn),
			tmpRange = range.cloneRange(),
			tmpNode,
			block = zss_editor.isBlockElm;
		var todoList = range.cloneContents().querySelector('.todo-view');
		if (!todoList) {
			while (current && current !== bookmark2.end && (zss_editor.getPosition(current, bookmark2.end) & 4)) {
				if (current.nodeType == 3 || !block(current)) {
					tmpRange.setStartBefore(current);
					while (current && current !== bookmark2.end && !block(current)) {
						tmpNode = current;
						current = zss_editor.getNextDomNode(current, false, null, function (node) {
							return !block(node);
						});
					}
					tmpRange.setEndAfter(tmpNode);
					para = document.createElement('p');
					para.setAttribute('element-id', zss_editor.getRandomId())
					para.appendChild(tmpRange.extractContents());

					var todoview = document.createElement('div');
					todoview.setAttribute('class', 'todo-view');
					todoview.setAttribute('element-id', elementId);
					var todoHtml = '<span class="todo-mark" contenteditable="false">' +
						'<span class="todo-inner"></span>' +
						'</span>' +
						'<div class="todo-text">' + para.outerHTML + '</div>';
					todoview.innerHTML = todoHtml;
					tmpRange.insertNode(todoview);
					zss_editor.remove(todoview.parentNode, true);
					current = todoview;
					current = zss_editor.getNextDomNode(current, false, filterFn);
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			zss_editor.moveToBookmark(bookmark2);
			zss_editor.moveToBookmark(bko);
			range = window.getSelection().getRangeAt(0);
			zss_editor.currentSelection.setRange(range);

		} else {
			//取消勾选框
			while (current && !(zss_editor.getPosition(current, bookmark2.end) & 2)) {
				if ($(current).parents('.todo-text').length > 0) {
					tmpRange.setStartBefore($(current).parents('.todo-text').children().first()[0]);
					tmpRange.setEndAfter($(current).parents('.todo-text').children().last()[0]);

					var todoview = $(tmpRange.startContainer).parents('.todo-view')[0];
					var todotext = tmpRange.extractContents();
					tmpRange.setStartAfter(todoview);
					tmpRange.setEndAfter(todoview);
					tmpRange.insertNode(todotext);

					current = todoview.nextSibling;
					todoview.remove();
					current = zss_editor.getNextDomNode(current, false, filterFn);
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			zss_editor.moveToBookmark(bookmark2);
			zss_editor.moveToBookmark(bko);
			range = window.getSelection().getRangeAt(0);
			zss_editor.currentSelection.setRange(range);
		}

	} else if ($(start).is('.todo-view') || $(start).parents('.todo-view').length > 0) { //如果是勾选框
		var bk = zss_editor.createBookmark();
		var todo = $(start).parents('.todo-view')[0];
		var todoText = $(start).parents('.todo-view').find(".todo-text")[0];
		var div = document.createElement("div");
		//2022.05.11协同编辑加elementid
		div.setAttribute('element-id', zss_editor.getRandomId());
		while (todoText.firstChild) {
			div.appendChild(todoText.firstChild);
		}
		todo.parentNode.insertBefore(div, todo);
		todo.remove();
		zss_editor.moveToBookmark(bk);
		if (!zss_editor.wWidth) {
			zss_editor.wWidth = $(window).width();
		}
		var width = zss_editor.wWidth - 30;
		zss_editor.updateAllIframeWidth(width);
	} else if ($(start).is('ol') || $(start).parents('ol').length > 0) { //有序列表下
		var bk = zss_editor.createBookmark(true);
		var ol = $(start).parents('ol')[0];
		if (start.nodeType == 1 && start.nodeName != 'OL') { //断开列表
			while (start.nodeName != 'OL') {
				if (start.nodeName == 'LI') {
					break;
				} else {
					start = start.parentNode;
				}
			}
			zss_editor.breakParent(start, ol);
			if (start.previousSibling.innerHTML == '') {
				start.previousSibling.remove();
			}
			if (start.nextSibling.innerHTML == '') {
				start.nextSibling.remove();
			}
			var div = document.createElement('div');
			//2022.05.11协同编辑加elementid
			div.setAttribute('element-id', zss_editor.getRandomId());
			while (start.firstChild) {
				if (start.firstChild.nodeType == 3 && start.firstChild.nodeValue != '') {
					var p = document.createElement('p');
					p.appendChild(start.firstChild);
					div.appendChild(p);
				} else {
					div.appendChild(start.firstChild);
				}
			}
			var todoHtml = '<div class="todo-view" element-id="' + elementId + '">' +
				'<span class="todo-mark" contenteditable="false">' +
				'<span class="todo-inner"></span>' +
				'</span>' +
				'<div class="todo-text">' + div.innerHTML + '</div>' +
				'</div>';
			start.parentNode.insertBefore($(todoHtml)[0], start);
			start.remove();
		}
		zss_editor.moveToBookmark(bk);
	} else if ($(start).is('ul') || $(start).parents('ul').length > 0) { //无序列表下
		var bk = zss_editor.createBookmark(true);
		var ul = $(start).parents('ul')[0];
		if (start.nodeType == 1 && start.nodeName != 'UL') { //断开列表
			while (start.nodeName != 'uL') {
				if (start.nodeName == 'LI') {
					break;
				} else {
					start = start.parentNode;
				}
			}
			zss_editor.breakParent(start, ul);
			if (start.previousSibling.innerHTML == '') {
				start.previousSibling.remove();
			}
			if (start.nextSibling.innerHTML == '') {
				start.nextSibling.remove();
			}
			var div = document.createElement('div');
			//2022.05.11协同编辑加elementid
			div.setAttribute('element-id', zss_editor.getRandomId());
			while (start.firstChild) {
				if (start.firstChild.nodeType == 3 && start.firstChild.nodeValue != '') {
					var p = document.createElement('p');
					p.appendChild(start.firstChild);
					div.appendChild(p);
				} else {
					div.appendChild(start.firstChild);
				}
			}
			var todoHtml = '<div class="todo-view" element-id="' + elementId + '">' +
				'<span class="todo-mark" contenteditable="false">' +
				'<span class="todo-inner"></span>' +
				'</span>' +
				'<div class="todo-text">' + div.innerHTML + '</div>' +
				'</div>';
			start.parentNode.insertBefore($(todoHtml)[0], start);
			start.remove();
		}
		zss_editor.moveToBookmark(bk);
	} else {
		if ($(start).is($('#zss_editor_content'))) {
			var tmpNode = document.createElement("p");
			tmpNode.appendChild(document.createTextNode("\u200b"));
			range.insertNode(tmpNode);
			zss_editor.jumpAfterNode(tmpNode);
			start = tmpNode;
		}
		var bk = zss_editor.createBookmark(true);
		var div = document.createElement('p');
		//2022.05.11协同编辑加elementid
		div.setAttribute('element-id', zss_editor.getRandomId());
		while (start.firstChild) {
			div.appendChild(start.firstChild);
		}
		var todoHtml = '<div class="todo-view" element-id="' + elementId + '">' +
			'<span class="todo-mark" contenteditable="false">' +
			'<span class="todo-inner"></span>' +
			'</span>' +
			'<div class="todo-text">' + div.outerHTML + '</div>' +
			'</div>';
		start.parentNode.insertBefore($(todoHtml)[0], start);
		start.remove();
		zss_editor.moveToBookmark(bk);


	}
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave()
}
zss_editor.setUnorderedList = function (isrecovery) {
	//zss_editor.restoreRangeBlur();
	var range = window.getSelection().getRangeAt(0);
	if (!$('#zss_editor_content')[0].firstChild) {
		$('#zss_editor_content').append('<p><br></p>');
		range.setStart($('#zss_editor_content')[0].firstChild, 0);
	}
	//20200721 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'insertunorderedlist';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	var start = range.startContainer;
	if (start.nodeType == 3) {
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
	}
	if (range.collapsed && start.nodeType == 1 && start.previousSibling && start.previousSibling.nodeType == 1 && start.previousSibling.getAttribute('class') && start.previousSibling.getAttribute('class').indexOf('record-box') > -1) {
		var ul = document.createElement('ul');
		//2022.05.11协同编辑加elementid
		ul.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		start.parentNode.insertBefore(ol, start);
		ul.appendChild(li);
		li.appendChild(start);
		$(ul).attr('level', '1');
		range.setStartAfter(start.lastChild);
		range.setEndAfter(start.lastChild);
		zss_editor.currentSelection.setRange(range);
	} else if (range.collapsed && ($(start).is('.todo-view') || $(start).parents('.todo-view').length > 0)) {
		var bk = zss_editor.createBookmark();
		var todo;
		if ($(start).parents('.todo-view').length > 0) {
			todo = $(start).parents('.todo-view')[$(start).parents('.todo-view').length - 1]
		} else {
			todo = start;
		}
		var todoText = $(todo).find(".todo-text")[0];
		var ul = document.createElement('ul');
		//2022.05.11协同编辑加elementid
		ul.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		ul.appendChild(li);
		todo.parentNode.insertBefore(ul, todo);
		while (todoText.firstChild) {
			li.appendChild(todoText.firstChild);
		}
		// 录音开始标记挪到序号里，标记移到ul上
		if (todo.getAttribute('class') && todo.getAttribute('class').indexOf('voiceBegin') > -1) {
			todo.classList.remove("voiceBegin");
			todo.className = "voiceBegin";
		}
		$(ul).attr('level', '1');
		todo.remove();
		zss_editor.moveToBookmark(bk);
		//li跟随第一个子元素的颜色变化
		// var list = ul;
		//  if(list.firstChild.firstChild.firstChild&&list.firstChild.firstChild.firstChild.style&&list.firstChild.firstChild.firstChild.innerText.length>1){
		//       	list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
		//       	list.firstChild.style.backgroundColor='';
		//       }

	} else if (range.collapsed && ($(start).is('ul') || $(start).parents('ul').length > 0 || $(start).is('ol') || $(start).parents('ol').length > 0)) {  //无序列表下点无序,只取消当前行的序号
		range = zss_editor.shrinkBoundary();
		var bk = zss_editor.createBookmark();
		var ul = $(start).parents('ul,ol')[0] || $(start)[0];
		var li = $(start).parents('li')[0];
		if (ul.tagName == 'UL' && (start.nodeName == 'OL' || start.nodeName == 'UL' || start.nodeName == 'LI' || (li.firstChild && start == li.firstChild))) { //第一行,取消列表
			if (start.nodeType == 1 && start.nodeName != 'UL' && start.nodeName != 'OL') {  //start在ol内,断开列表
				while (start.nodeName != 'UL' && start.nodeName != 'OL') {
					if (start.nodeName == 'LI') {
						break;
					} else {
						start = start.parentNode;
					}
				}
				if (start.nodeType == 1 && start.nodeName == 'LI') {
					zss_editor.breakParent(start, ul);
					if (!start.previousSibling.firstChild || !start.previousSibling.firstChild.firstChild) {
						start.previousSibling.remove();
					}
					if (!start.nextSibling.firstChild || !start.nextSibling.firstChild.firstChild) {
						start.nextSibling.remove();
					}
					while (start.firstChild) {
						if (start.firstChild.nodeType == 3 && start.firstChild.nodeValue != '') {
							p = document.createElement('p');
							p.appendChild(start.firstChild);
							start.parentNode.insertBefore(p, start);
						} else {
							start.parentNode.insertBefore(start.firstChild, start);
						}
					}
					start.remove();
				}
			} else {
				while (ul.firstChild) {
					while (ul.firstChild.firstChild) {
						if ((ul.firstChild.firstChild.nodeType == 3) || (ul.firstChild.firstChild.nodeType == 1 && ul.firstChild.firstChild.nodeName == 'BR')) {
							var p = document.createElement('p');
							p.appendChild(ul.firstChild.firstChild);
							ul.parentNode.insertBefore(p, ul);
						} else {
							ul.parentNode.insertBefore(ul.firstChild.firstChild, ul);
						}
					}
					ul.firstChild.remove();
				}
				ul.remove();
			}
		} else {//start不是li的第一行
			zss_editor.breakParent(start, ul);
			if (!start.previousSibling.firstChild || !start.previousSibling.firstChild.firstChild) {
				start.previousSibling.remove();
			}
			if (!start.nextSibling.firstChild) {
				var newli = document.createElement('LI');
				start.nextSibling.appendChild(li);
			}
			if (start.nextSibling.nodeName != "UL") {
				var oldlist = start.nextSibling;
				var newlist = document.createElement('UL');
				//2022.05.11协同编辑加elementid
				newlist.setAttribute('element-id', zss_editor.getRandomId());
				while (start.nextSibling.firstChild) {
					newlist.appendChild(start.nextSibling.firstChild)
				}
				newlist.removeAttribute('data-origin-start');
				newlist.removeAttribute('serialnum');
				newlist.firstChild.removeAttribute('serialnum');
				start.parentNode.insertBefore(newlist, start.nextSibling);
				oldlist.remove()
			}
			newli = start.nextSibling.firstChild;
			newli.prepend(start)
		}
		zss_editor.moveToBookmark(bk);
		if (!zss_editor.wWidth) {
			zss_editor.wWidth = $(window).width();
		}
		var width = zss_editor.wWidth - 30;
		zss_editor.updateAllIframeWidth(width);
	} else if (range.collapsed && ($(start).is('p') || $(start).parents('p').length > 0)) {
		var p;
		if ($(start).parents('p').length > 0) {
			p = $(start).parents('p')[$(start).parents('p').length - 1]
		} else {
			p = start;
		}
		//解决设置列表光标不居中问题
		if (p && p.firstChild && p.firstChild.nodeName == 'BR') {
			range.setStart(p, 0);
			range.setEnd(p, 0);
			var text = document.createTextNode("\u200b");
			range.insertNode(text);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
		var bk = zss_editor.createBookmark();
		var ul = document.createElement('ul');
		//2022.05.11协同编辑加elementid
		ul.setAttribute('element-id', zss_editor.getRandomId());
		var li = document.createElement('li');
		ul.appendChild(li);
		p.parentNode.insertBefore(ul, p);
		li.appendChild(p);
		// 录音开始标记挪到序号里，标记移到ul上
		if (p.getAttribute('class') && p.getAttribute('class').indexOf('voiceBegin') > -1) {
			p.classList.remove("voiceBegin");
			ul.className = "voiceBegin";
		}
		$(ul).attr('level', '1')
		zss_editor.moveToBookmark(bk);
		//li跟随第一个子元素的颜色变化
		// var list = ul;
		//  if(list.firstChild.firstChild.firstChild&&list.firstChild.firstChild.firstChild.style&&list.firstChild.firstChild.firstChild.innerText.length>1){
		//       	list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
		//       	list.firstChild.style.backgroundColor='';
		//       }
	} else if (!range.collapsed) {
		zss_editor.adjustmentBoundary();
		zss_editor.shrinkBoundary();
		var bko = zss_editor.createBookmark(true),
			startLi = getLi(document.getElementById(bko.start)),
			endLi = getLi(document.getElementById(bko.end)),
			list, tmp;
		var filterFn = function (node) {
			return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
		};
		var notExchange = {
			'TD': 1,
			'PRE': 1,
			'BLOCKQUOTE': 1,
			'DIV': 1,
		}
		zss_editor.moveToBookmark(bko);

		if (startLi && endLi && startLi.parentNode.tagName == 'UL') {
			//有选区取消列表或加列表
			var startnext, startparentparent;
			start = startLi.parentNode;
			end = endLi.parentNode;
			startprev = start.previousSibling;
			endnext = start.nextSibling;
			endparent = start.parentNode;

			var bk = zss_editor.createBookmark(),
				current = start,
				cloneRange = range.cloneRange(),
				tmpNode,
				block = zss_editor.isBlockElm;
			while (current && !(zss_editor.getPosition(current, bk.end) & 2)) {
				if ($(current).parents('li').length > 0) {
					cloneRange.setStartBefore($(current).parents('li').children().first()[0]);
					cloneRange.setEndAfter($(current).parents('li').children().last()[0]);

					var list = $(cloneRange.startContainer).parents('ul')[0] || $(cloneRange.startContainer).parents('ol')[0];
					var lip = cloneRange.extractContents();
					cloneRange.setEndBefore(list);
					cloneRange.setEndBefore(list);
					cloneRange.insertNode(lip);
					current = list.previousSibling;
					list.remove();
					current = zss_editor.getNextDomNode(current, false, filterFn);
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			zss_editor.currentSelection.setRange(range);
			zss_editor.moveToBookmark(bk);
			normalList();
		} else {
			range = zss_editor.enlarge(true, function (node) {
				return notExchange[node.tagName];
			});
			//选区有标注的暂时设置不允许设置列表
			var rangecontent = range.cloneContents();
			if (rangecontent.querySelector('.record-list') || rangecontent.querySelector('.record-list-tit')) {
				return;
			}

			frag = document.createDocumentFragment();

			var bk = zss_editor.createBookmark(null, null, range),
				current = zss_editor.getNextDomNode(bk.start, false, filterFn),
				tmpRange = range.cloneRange(),
				tmpNode,
				block = zss_editor.isBlockElm;

			while (current && current !== bk.end && (zss_editor.getPosition(current, bk.end) & 4)) {
				if (current.nodeType == 1 && current.getAttribute('contenteditable') == 'false') {
					if (frag.lastChild) {
						var tmpNode = current;
						current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
						frag.lastChild.appendChild(tmpNode);
						//附件后面如果是空行就移到附件后面,没有就创建2021.06.08
						if (zss_editor.isEmptyNode(current)) {
							var tmpNode = current;
							current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
							frag.lastChild.appendChild(tmpNode);
						} else {
							var p = document.createElement('p');
							var br = document.createElement('br');
							p.appendChild(br);
							frag.lastChild.appendChild(p);
						}
					}
				} else if (current.nodeType == 3 || current.tagName != 'LI') {
					if (current.nodeType == 1 && (current.tagName == 'OL' || current.tagName == 'UL')) {
						while (current.firstChild) {
							frag.appendChild(current.firstChild);
						}
						tmpNode = zss_editor.getNextDomNode(current, false, filterFn);
						current.remove();
						current = tmpNode;
						continue;

					}
					tmpNode = current;
					tmpRange.setStartBefore(current);

					while (current && current !== bk.end && (!block(current) || zss_editor.isBookmarkNode(current))) {
						tmpNode = current;
						current = zss_editor.getNextDomNode(current, false, null, function (node) {
							return !notExchange[node.tagName];
						});
					}
					if (current && block(current)) {
						tmp = zss_editor.getNextDomNode(tmpNode, false, filterFn);
						if (tmp && zss_editor.isBookmarkNode(tmp)) {
							current = zss_editor.getNextDomNode(tmp, false, filterFn);
							tmpNode = tmp;
						}
					}
					tmpRange.setEndAfter(tmpNode);
					current = zss_editor.getNextDomNode(tmpNode, false, filterFn);
					var li = document.createElement('li');
					li.appendChild(tmpRange.extractContents());
					if (zss_editor.isEmptyNode(li)) {
						li.remove();
//						var tmpNode = document.createElement('p');
//						tmpNode.setAttribute('element-id', zss_editor.getRandomId())
//						while(li.firstChild) {
//							tmpNode.appendChild(li.firstChild)
//						}
//						li.appendChild(tmpNode);
					} else {
						frag.appendChild(li);
					}
				} else {
					current = zss_editor.getNextDomNode(current, true, filterFn);
				}
			}
			range.collapse(true);
			var nowlist = $(range.startContainer).parent('ol,ul')[0];
			if (nowlist) {
				range.setStartAfter(nowlist);
				range.collapse(true);
			}
			list = document.createElement('UL');
			//2022.05.11协同编辑加elementid
			list.setAttribute('element-id', zss_editor.getRandomId());
			list.appendChild(frag);
			if (list.firstChild.firstChild.firstChild && list.firstChild.firstChild.firstChild.style && list.firstChild.firstChild.firstChild.innerText.length > 1) {
//				list.firstChild.style.cssText = list.firstChild.firstChild.firstChild.style.cssText;
				//2021.07.30
				var style = list.firstChild.firstChild.firstChild.style.cssText;
				zss_editor.getSomeStyle(list.firstChild, style);
				list.firstChild.style.backgroundColor = '';
			}
			range.insertNode(list);

			//和上一列表合并
			var listprev = list.previousSibling;
			while (listprev) {
				if (listprev.tagName == 'UL') {
					list.setAttribute('level', listprev.getAttribute('level'));
					break;
				} else if (listprev.firstChild && listprev.innerText.trim() == '' && !listprev.querySelector('img') && !listprev.querySelector('iframe') && !listprev.querySelector('hr')) {
					break;
				} else {
					listprev = listprev.previousSibling;
				}
			}
			var last = list.lastChild.lastChild;
			range.setStart(list.firstChild.firstChild, 0);
			if (last) {
				if (zss_editor.isBlockElm(last)) {
					range.setEnd(last, last.childNodes.length);
				} else {
					range.setEndAfter(last);
				}
			}
			zss_editor.moveToBookmark(bk)
			zss_editor.currentSelection.setRange(range);
			normalList();
		}
	} else {
		document.execCommand('insertUnorderedList', false, null);
		//20210430选区设置有序列表改为新列表
		normaloldlist();
	}
	//调整附件宽度
	var width = zss_editor.wWidth - 30;
	zss_editor.updateAllIframeWidth(width);
	zss_editor.enabledEditingItems();
	zss_editor.undoManagerSave()
};
zss_editor.jumpAfterNode = function (el) {
	var range = document.createRange();
	range.setStart(el, 0);
	range.setEnd(el, 0);
	range.selectNodeContents(el);
	range.collapse(false);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
};
zss_editor.removeFont = function (str) {
	str = "";
	return str;
}
zss_editor.matchFont = function (obj) {
	var content = obj;
	content = content.replace(/font-size:\s*\d+(\.\d+)?(px|rem|em);/g, '').replace(/size\s*?=\s*?(['"])[\s\S]*?\1/gi, '');
	return content;
}
zss_editor.findParentByTagName = function (root, name) {

	var parent = root;

	if (typeof name === "string") {

		name = [name];

	}

	while (name.indexOf(parent.nodeName.toLowerCase()) === -1 && parent.nodeName !== "BODY" && parent.nodeName !== "HTML") {

		parent = parent.parentNode;

	}

	return parent.nodeName === "BODY" || parent.nodeName === "HTML" ? null : parent;

}
/**
 * 如果选区在文本的边界上，就扩展选区到文本的父节点上, 如果当前选区是闭合的， 则什么也不做
 * @method txtToElmBoundary
 * @remind 该操作不会修改dom节点
 */

/**
 * 如果选区在文本的边界上，就扩展选区到文本的父节点上, 如果当前选区是闭合的， 则根据参数项
 * ignoreCollapsed 的值决定是否执行该调整
 * @method txtToElmBoundary
 * @param { Boolean } ignoreCollapsed 是否忽略选区的闭合状态， 如果该参数取值为true， 则
 *                      不论选区是否闭合， 都会执行该操作， 反之， 则不会对闭合的选区执行该操作
 */
zss_editor.txtToElmBoundary = function (ignoreCollapsed) {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);

	function adjust(r, c) {
		var container = r[c + 'Container'],
			offset = r[c + 'Offset'];
		if (container.nodeType == 3) {
			if (!offset) {
				r['set' + c.replace(/(\w)/, function (a) {
					return a.toUpperCase();
				}) + 'Before'](container);
			} else if (offset >= container.nodeValue.length) {
				r['set' + c.replace(/(\w)/, function (a) {
					return a.toUpperCase();
				}) + 'After'](container);
			}
		}
	}

	if (ignoreCollapsed || !range.collapsed) {
		adjust(range, 'start');
		adjust(range, 'end');
	}
	zss_editor.currentSelection.setRange(range);
	return range;
}
zss_editor.split = function (node, offset) {
	var retval = node.splitText(offset);
	return retval;
}
zss_editor.trimBoundary = function (ignoreEnd) {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	zss_editor.txtToElmBoundary();
	var start = range.startContainer,
		offset = range.startOffset,
		collapsed = range.collapsed,
		end = range.endContainer,
		endOffset = range.endOffset;
	if (start.nodeType == 3) {
		if (offset == 0) {
			range.setStartBefore(start);
		} else {
			if (offset >= start.nodeValue.length) {
				range.setStartAfter(start);
			} else {
				var textNode = zss_editor.split(start, offset);
				//跟新结束边界
				if (start === end) {
					range.setEnd(textNode, endOffset - offset);
				} else if (start.parentNode === end) {
					endOffset += 1;
				}
				range.setStartBefore(textNode);
				zss_editor.currentSelection.setRange(range);
			}
		}
		if (collapsed) {
			return range.collapse(true);
			zss_editor.currentSelection.setRange(range);
		}
	}
	if (!ignoreEnd) {
		offset = range.endOffset;
		end = range.endContainer;
		if (end.nodeType == 3) {
			if (offset == 0) {
				range.setEndBefore(end);
			} else {
				offset < end.nodeValue.length && zss_editor.split(end, offset);
				range.setEndAfter(end);
			}
		}
	}
	zss_editor.currentSelection.setRange(range);
	return range;
}
zss_editor.isBody = function (node) {
	return node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
}
zss_editor.enlarge = function (toBlock, stopFn) {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	var isBody = zss_editor.isBody,
		pre, node, tmp = document.createTextNode('');
	if (toBlock) {
		node = range.startContainer;
		if (node.nodeType == 1) {
			if (node.childNodes[range.startOffset]) {
				pre = node = node.childNodes[range.startOffset]
			} else {
				node.appendChild(tmp);
				pre = node = tmp;
			}
		} else {
			pre = node;
		}
		while (1) {
			if (zss_editor.isBlockElm(node)) {
				node = pre;
				while ((pre = node.previousSibling) && !zss_editor.isBlockElm(pre)) {
					node = pre;
				}
				range.setStartBefore(node);
				zss_editor.currentSelection.setRange(range);
				break;
			}
			pre = node;
			node = node.parentNode;
		}
		node = range.endContainer;
		if (node.nodeType == 1) {
			if (pre = node.childNodes[range.endOffset]) {
				node.insertBefore(tmp, pre);
				zss_editor.currentSelection.setRange(range);
			} else {
				node.appendChild(tmp);
			}
			pre = node = tmp;
		} else {
			pre = node;
		}
		while (1) {
			if (zss_editor.isBlockElm(node)) {
				node = pre;
				while ((pre = node.nextSibling) && !zss_editor.isBlockElm(pre)) {
					node = pre;
				}
				range.setEndAfter(node);
				zss_editor.currentSelection.setRange(range);
				break;
			}
			pre = node;
			node = node.parentNode;
		}
		if (tmp.parentNode === range.endContainer) {
			range.endOffset--;
		}
		tmp.remove();
		zss_editor.currentSelection.setRange(range);
	}

	// 扩展边界到最大
	if (!range.collapsed) {
		while (range.startOffset == 0) {
			if (stopFn && stopFn(range.startContainer)) {
				break;
			}
			if (zss_editor.isBody(range.startContainer)) {
				break;
			}
			range.setStartBefore(range.startContainer);
			zss_editor.currentSelection.setRange(range);
		}
		while (range.endOffset == (range.endContainer.nodeType == 1 ? range.endContainer.childNodes.length : range.endContainer.nodeValue.length)) {
			if (stopFn && stopFn(range.endContainer)) {
				break;
			}
			if (isBody(range.endContainer)) {
				break;
			}
			range.setEndAfter(range.endContainer);
			zss_editor.currentSelection.setRange(range);
		}
	}
	zss_editor.currentSelection.setRange(range);
	return range;
}
/*
 * 调整Range的边界，使其"缩小"到最合适的位置
*/
zss_editor.adjustmentBoundary = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	if (!range.collapsed) {
		while (!zss_editor.isBody(range.startContainer) &&
			range.startOffset == range.startContainer[range.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length &&
			range.startContainer[range.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
			) {

			range.setStartAfter(range.startContainer);
			zss_editor.currentSelection.setRange(range);
		}
		while (!zss_editor.isBody(range.endContainer) && !range.endOffset &&
			range.endContainer[range.endContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
			) {
			range.setEndBefore(range.endContainer);
			zss_editor.currentSelection.setRange(range);
		}
	}
	zss_editor.currentSelection.setRange(range);
	return range;
}
zss_editor.isWhitespace = function (node) {
	return !new RegExp('[^ \t\n\r\u200B]').test(node.nodeValue);
}
zss_editor.getDomNode = function (node, start, ltr, startFromChild, fn, guard) {
	var tmpNode = startFromChild && node[start],
		parent;
	!tmpNode && (tmpNode = node[ltr]);
	while (!tmpNode && (parent = (parent || node).parentNode)) {
		if (parent.tagName == 'BODY' || guard && !guard(parent)) {
			return null;
		}
		tmpNode = parent[ltr];
	}
	if (tmpNode && fn && !fn(tmpNode)) {
		return zss_editor.getDomNode(tmpNode, start, ltr, false, fn);
	}
	return tmpNode;
}
/*
 * 取得node节点的下一个兄弟节点， 如果该节点其后没有兄弟节点， 则递归查找其父节点之后的第一个兄弟节点，
 * 直到找到满足条件的节点或者递归到BODY节点之后才会结束。
 * @method getNextDomNode
 * @param { Node } node 需要获取其后的兄弟节点的节点对象
 * @return { Node | NULL } 如果找满足条件的节点， 则返回该节点， 否则返回NULL
*/
zss_editor.getNextDomNode = function (node, startFromChild, filterFn, guard) {
	return zss_editor.getDomNode(node, 'firstChild', 'nextSibling', startFromChild, filterFn, guard);
}
/*
 * 获取节点A相对于节点B的位置关系
 * @method getPosition
 * @param { Node } nodeA 需要查询位置关系的节点A
 * @param { Node } nodeB 需要查询位置关系的节点B
 * @return { Number } 节点A与节点B的关系
 */
zss_editor.getPosition = function (nodeA, nodeB) {
	// 如果两个节点是同一个节点
	if (nodeA === nodeB) {
		// domUtils.POSITION_IDENTICAL
		return 0;
	}
	var node,
		parentsA = [nodeA],
		parentsB = [nodeB];
	node = nodeA;
	while (node = node.parentNode) {
		// 如果nodeB是nodeA的祖先节点
		if (node === nodeB) {
			// domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
			return 10;
		}
		parentsA.push(node);
	}
	node = nodeB;
	while (node = node.parentNode) {
		// 如果nodeA是nodeB的祖先节点
		if (node === nodeA) {
			// domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
			return 20;
		}
		parentsB.push(node);
	}
	parentsA.reverse();
	parentsB.reverse();
	if (parentsA[0] !== parentsB[0]) {
		// domUtils.POSITION_DISCONNECTED
		return 1;
	}
	var i = -1;
	while (i++, parentsA[i] === parentsB[i]) {
	}
	nodeA = parentsA[i];
	nodeB = parentsB[i];
	while (nodeA = nodeA.nextSibling) {
		if (nodeA === nodeB) {
			// domUtils.POSITION_PRECEDING
			return 4
		}
	}
	// domUtils.POSITION_FOLLOWING
	return 2;
}
/*检测节点的标签是否是给定的标签*/
zss_editor.isTagNode = function (node, tagNames) {
	return node.nodeType == 1 && new RegExp('\\b' + node.tagName + '\\b', 'i').test(tagNames)
}
zss_editor.setAttributes = function (node, attrs) {
	for (var attr in attrs) {
		if (attrs.hasOwnProperty(attr)) {
			var value = attrs[attr];
			switch (attr) {
				case 'class':
					//ie下要这样赋值，setAttribute不起作用
					node.className = value;
					break;
				case 'style' :
					node.style.cssText = node.style.cssText + ";" + value;
					break;
				case 'innerHTML':
					node[attr] = value;
					break;
				case 'value':
					node.value = value;
					break;
				default:
					node.setAttribute(attrFix[attr] || attr, value);
			}
		}
	}
	return node;
}
zss_editor.isSameElement = function (nodeA, nodeB) {
	if (nodeA.tagName != nodeB.tagName) {
		return false;
	}
	var thisAttrs = nodeA.attributes,
		otherAttrs = nodeB.attributes;
	if (thisAttrs.length != otherAttrs.length) {
		return false;
	}
	var attrA, attrB, al = 0, bl = 0;
	for (var i = 0; attrA = thisAttrs[i++];) {
		if (attrA.nodeName == 'style') {
			if (attrA.specified) {
				al++;
			}
			if (zss_editor.isSameStyle(nodeA, nodeB)) {
				continue;
			} else {
				return false;
			}
		}

		attrB = nodeB.attributes[attrA.nodeName];
		if (!attrB.specified || attrA.nodeValue != attrB.nodeValue) {
			return false;
		}
	}

	return true;
}
zss_editor.isSameStyle = function (nodeA, nodeB) {
	var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':'),
		styleB = nodeB.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');

	if (!styleA || !styleB) {
		return styleA == styleB;
	}
	styleA = styleA.split(';');
	styleB = styleB.split(';');
	if (styleA.length != styleB.length) {
		return false;
	}
	for (var i = 0, ci; ci = styleA[i++];) {
		if (styleB.indexOf(ci) == -1) {
			return false;
		}
	}
	return true;
}
zss_editor.mergeSibling = function (node, ignorePre, ignoreNext) {
	function merge(rtl, start, node) {
		var next;
		if ((next = node[rtl]) && !zss_editor.isBookmarkNode(next) && next.nodeType == 1 && zss_editor.isSameElement(node, next)) {
			while (next.firstChild) {
				if (start == 'firstChild') {
					node.insertBefore(next.lastChild, node.firstChild);
				} else {
					node.appendChild(next.firstChild);
				}
			}
			next.remove();
		}
	}

	!ignorePre && merge('previousSibling', 'firstChild', node);
	!ignoreNext && merge('nextSibling', 'lastChild', node);
}
zss_editor.trimWhiteTextNode = function (node) {
	function remove(dir) {
		var child;
		while ((child = node[dir]) && child.nodeType == 3 && zss_editor.isWhitespace(child)) {
			node.removeChild(child);
		}
	}

	remove('firstChild');
	remove('lastChild');
}
zss_editor.cssStyleToDomStyle = function (cssName) {
	var test = document.createElement('div').style,
		cache = {
			'float': test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat' : 'float'
		};


	return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {
		return match.charAt(1).toUpperCase();
	}));
}
zss_editor.remove = function (node, keepChildren) {
	var parent = node.parentNode,
		child;
	if (parent) {
		if (keepChildren && node.hasChildNodes()) {
			while (child = node.firstChild) {
				parent.insertBefore(child, node);
			}
		}
		parent.removeChild(node);
	}
	return node;
}
zss_editor.mergeChild = function (node, tagName, attrs) {
	var list = node.getElementsByTagName(node.tagName.toLowerCase());
	for (var i = 0, ci; ci = list[i++];) {
		if (!ci.parentNode || zss_editor.isBookmarkNode(ci)) {
			continue;
		}
		//span单独处理
		if (ci.tagName.toLowerCase() == 'span') {
			if (node === ci.parentNode) {
				zss_editor.trimWhiteTextNode(node);
				if (node.childNodes.length == 1) {
					node.style.cssText = ci.style.cssText + ";" + node.style.cssText;
					zss_editor.remove(ci, true);
					continue;
				}
			}
			ci.style.cssText = node.style.cssText + ';' + ci.style.cssText;
			if (attrs) {
				var style = attrs.style;
				if (style) {
					style = style.split(';');
					for (var j = 0, s; s = style[j++];) {
						ci.style[zss_editor.cssStyleToDomStyle(s.split(':')[0])] = s.split(':')[1];
					}
				}
			}
			if (zss_editor.isSameStyle(ci, node)) {
				zss_editor.remove(ci, true);
			}
			continue;
		}
		if (zss_editor.isSameElement(node, ci)) {
			zss_editor.remove(ci, true);
		}
	}
}
zss_editor.mergeToParent = function (node) {
	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		a: 1,
		abbr: 1,
		acronym: 1,
		address: 1,
		b: 1,
		bdo: 1,
		big: 1,
		cite: 1,
		code: 1,
		del: 1,
		dfn: 1,
		em: 1,
		font: 1,
		i: 1,
		ins: 1,
		label: 1,
		kbd: 1,
		q: 1,
		s: 1,
		samp: 1,
		small: 1,
		span: 1,
		strike: 1,
		strong: 1,
		sub: 1,
		sup: 1,
		tt: 1,
		u: 1,
		'var': 1
	});
	var parent = node.parentNode;
	while (parent && dtd[parent.tagName]) {
		if (parent.tagName == node.tagName || parent.tagName == 'A') {//针对a标签单独处理
			zss_editor.trimWhiteTextNode(parent);
			//span需要特殊处理  不处理这样的情况 <span stlye="color:#fff">xxx<span style="color:#ccc">xxx</span>xxx</span>
			if (parent.tagName == 'SPAN' && !zss_editor.isSameStyle(parent, node)
				|| (parent.tagName == 'A' && node.tagName == 'SPAN')) {
				if (parent.childNodes.length > 1 || parent !== node.parentNode) {
					node.style.cssText = parent.style.cssText + ";" + node.style.cssText;
					parent = parent.parentNode;
					continue;
				} else {
					parent.style.cssText += ";" + node.style.cssText;
					//trace:952 a标签要保持下划线
					if (parent.tagName == 'A') {
						parent.style.textDecoration = 'underline';
					}
				}
			}
			if (parent.tagName != 'A') {
				parent === node.parentNode && zss_editor.remove(node, true);
				break;
			}
		}
		parent = parent.parentNode;
	}
}
zss_editor.applyInlineStyle = function (tagName, attrs, list) {
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);

	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({'#': 1, br: 1, b: 1, strong: 1, u: 1, i: 1, em: 1, sub: 1, sup: 1, strike: 1, span: 1});
	if (range.collapsed) return range;
	zss_editor.trimBoundary();
	zss_editor.enlarge(false,
		function (node) {
			return node.nodeType == 1 && zss_editor.isBlockElm(node)
		})
	zss_editor.adjustmentBoundary();
	var bookmark = zss_editor.createBookmark(),
		end = bookmark.end,
		filterFn = function (node) {
			return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !zss_editor.isWhitespace(node);
		},
		current = zss_editor.getNextDomNode(bookmark.start, false, filterFn),
		node,
		pre,
		range = range.cloneRange();
	while (current && (zss_editor.getPosition(current, end) & 4)) {
		if (current.nodeType == 3 || dtd[tagName][current.tagName]) {
			range.setStartBefore(current);
			zss_editor.currentSelection.setRange(range);
			node = current;
			while (node && (node.nodeType == 3 || dtd[tagName][node.tagName]) && node !== end) {
				pre = node;
				node = zss_editor.getNextDomNode(node, node.nodeType == 1, null, function (parent) {
					return dtd[tagName][parent.tagName];
				});
			}
			range.setEndAfter(pre);
			zss_editor.currentSelection.setRange(range);
			var frag = range.extractContents(), elm;
			if (list && list.length > 0) {
				var level, top;
				top = level = list[0].cloneNode(false);
				for (var i = 1, ci; ci = list[i++];) {
					level.appendChild(ci.cloneNode(false));
					level = level.firstChild;
				}
				elm = level;
			} else {
				elm = document.createElement(tagName);
			}
			if (attrs) {
				zss_editor.setAttributes(elm, attrs);
			}
			elm.appendChild(frag);
			range.insertNode(list ? top : elm);
			//处理下滑线在a上的情况
			var aNode;
			if (tagName == 'span' && attrs.style && /text\-decoration/.test(attrs.style) && (aNode = zss_editor.closerParentNodeStartingAtNode('a', elm))) {
				zss_editor.setAttributes(aNode, attrs);
				elm.remove();
				elm = aNode;
			} else {
				zss_editor.mergeSibling(elm);
				zss_editor.clearEmptySibling(elm);
			}
			//去除子节点相同的
			zss_editor.mergeChild(elm, attrs);
			current = zss_editor.getNextDomNode(elm, false, filterFn);
			zss_editor.mergeToParent(elm);
			if (node === end) {
				break;
			}
		} else {
			current = zss_editor.getNextDomNode(current, true, filterFn);
		}
	}
	zss_editor.currentSelection.setRange(range);
	return zss_editor.moveToBookmark(bookmark);
}
zss_editor.setFontSize = function (fontSize, isrecovery, value) {
	zss_editor.restoreRangeBlur();
	var font = ["14px", "16px", "21px", "25px"];
	var fontValue = font[fontSize] || "16px";
	var selection = window.getSelection();
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		if (value) fontValue = value;
		data.name = "execCommand";
		data.cmdName = 'justify';
		data.value = fontValue;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	if (selection.getRangeAt(0).collapsed) {
		var range = selection.getRangeAt(0);
		var span = zss_editor.closerParentNodeStartingAtNode("span", range.startContainer);
		if (span && !span.children.length && !span['textContent'].replace("​", '').length) {
			span.style.cssText += "font-size:" + fontValue;
		} else {
			var el = document.createElement("span");
			el.style.cssText = "font-size:" + fontValue;
			var range = selection.getRangeAt(0).cloneRange();
			range.surroundContents(el);
			el.appendChild(document.createTextNode('\u200B'));
			zss_editor.jumpAfterNode(el);
		}
		// var li = zss_editor.closerParentNodeStartingAtNode("li",range.startContainer);
		//    if(li){
		//    	var first = li.firstChild;
		// 	while (first&&first.nodeType == 1&&first.nodeName!= 'BR' && first.nodeName!= 'HR') {

		// 		if(first && first.firstChild.nodeType == 3){
		//     		li.style.cssText+=first.style.cssText;
		//     		break;
		//     	}else if(first.firstChild.nodeName== 'BR' || first.firstChild.nodeName== 'HR'){
		//     		li.style.cssText+="font-size:"+fontValue;
		//     		break;
		//     	}
		//     	first = first.firstChild;
		//        }
		//    }
	} else {
		var range = selection.getRangeAt(0);
		zss_editor.applyInlineStyle('span', {'style': 'font-size:' + fontValue})

		var li = zss_editor.closerParentNodeStartingAtNode("li", range.startContainer);
		var lastli = zss_editor.closerParentNodeStartingAtNode('li', range.endContainer);
		// if(range.startContainer == range.endContainer){
		// 	//全选点击面板时range区域改变，不能使用下面方法
		// 	var list=range.startContainer.getElementsByTagName('li');
		// 	for(var i=0;i<list.length;i++){
		// 		list[i].style.cssText+="font-size:"+fontValue;
		// 	}
		// }
		// if(li){
		// 	var first = li.firstChild;
		// 	while (first&&first.nodeType == 1&&first.nodeName!= 'BR' && first.nodeName!= 'HR') {

		// 		if(first && first.firstChild.nodeType == 3){
		//     		li.style.cssText+=first.style.cssText;
		//     		break;
		//     	}else if(first.firstChild.nodeName== 'BR' || first.firstChild.nodeName== 'HR'){
		//     		li.style.cssText+="font-size:"+fontValue;
		//     		break;
		//     	}
		//     	first = first.firstChild;
		//        }
		// 	// if(li.firstChild.firstChild.nodeType==1){

		//  //   		if(zss_editor.isBlockElm(li.firstChild.firstChild) && li.firstChild.firstChild.firstChild.nodeType==1){
		//  //   			li.style.cssText+=li.firstChild.firstChild.firstChild.style.cssText;
		//  //   		}else{
		//  //   			li.style.cssText+=li.firstChild.firstChild.style.cssText;
		//  //   		}
		//  //   		li.style.backgroundColor='';
		//  //   	}
		//    	if(lastli){ //第一个是li,最后一个是li
		//        	//是在同一个列表下
		//    		while(li != lastli && li.nextSibling){
		//        		li=li.nextSibling;
		//        		li.style.cssText+="font-size:"+fontValue;
		//        	}
		//    		//不同列表下
		//        	while(li != lastli && lastli){
		//        		lastli.style.cssText+="font-size:"+fontValue;
		//        		lastli=lastli.previousSibling;
		//        	}
		//        }else{//第一个是li,最后一个不是li
		//        	while(li.nextSibling){
		//        		li=li.nextSibling;
		//        		li.style.cssText+="font-size:"+fontValue;
		//        	}
		//        }
		// }else if(lastli){ //第一个不是li,最后一个是li
		//    	while(lastli){
		//    		lastli.style.cssText+="font-size:"+fontValue;
		//    		lastli=lastli.previousSibling;
		//    	}
		//    }else{
		//    	var now=range.startContainer;
		//    	while(now.nextSibling && now != range.endContainer){
		//    		now=now.nextSibling;
		//    		if(now.nodeType==1 && (now.nodeName.toLowerCase()=='ul' || now.nodeName.toLowerCase()=='ol')){
		//    			var list=now.getElementsByTagName('li');
		//        		for(var i=0;i<list.length;i++){
		//        			list[i].style.cssText+="font-size:"+fontValue;
		//        		}
		//    		}
		//    	}
		//    }
		mergesibling(range, "fontsize", fontValue);
		zss_editor.restoreRange();
	}
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
}
zss_editor.getCommonAncestor = function (nodeA, nodeB) {
	if (nodeA === nodeB)
		return nodeA;
	var parentsA = [nodeA], parentsB = [nodeB], parent = nodeA, i = -1;
	while (parent = parent.parentNode) {
		if (parent === nodeB) {
			return parent;
		}
		parentsA.push(parent);
	}
	parent = nodeB;
	while (parent = parent.parentNode) {
		if (parent === nodeA)
			return parent;
		parentsB.push(parent);
	}
	parentsA.reverse();
	parentsB.reverse();
	while (i++, parentsA[i] === parentsB[i]) {
	}
	return i == 0 ? null : parentsA[i - 1];

}
zss_editor.each = function (obj, iterator, context) {
	if (obj == null) return;
	if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			if (iterator.call(context, obj[i], i, obj) === false)
				return false;
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (iterator.call(context, obj[key], key, obj) === false)
					return false;
			}
		}
	}
}

function mergeChild(rng, cmdName, value) {
	if (zss_editor.needSetChild[cmdName]) {
		zss_editor.adjustmentBoundary();
		if (!rng.collapsed && rng.startContainer.nodeType == 1) {
			var start = rng.startContainer.childNodes[rng.startOffset];
			if (start && start.tagName == "SPAN") {
				var bk = zss_editor.createBookmark();
				$(start).find("span").each(function (index, span) {
					if (!span.parentNode || zss_editor.isBookmarkNode(span)) return;
					if (cmdName == 'backcolor' && zss_editor.getComputedStyle(span, 'background-color').toLowerCase() === value) {
						return;
					}
					zss_editor.removeStyle(span, zss_editor.needSetChild[cmdName]);
					if (span.style.cssText.replace(/^\s+$/, '').length == 0) {
						zss_editor.remove(span, true)
					}
				})
				zss_editor.moveToBookmark(bk)
			}
		}
	}
}

zss_editor.getChildCount = function (node, fn) {
	var count = 0, first = node.firstChild;
	fn = fn || function () {
		return 1;
	};
	while (first) {
		if (fn(first)) {
			count++;
		}
		first = first.nextSibling;
	}
	return count;
}

function mergeWithParent(node) {
	var parent;
	while (parent = node.parentNode) {
		if (parent.tagName == 'SPAN' && zss_editor.getChildCount(parent, function (child) {
			//勾选框排除2021.07.15
			return !zss_editor.isBookmarkNode(child) && !(child.nodeType == 1 && child.getAttribute('class') && child.getAttribute('class').indexOf('todo-inner') > -1) && !(child.nodeType == 1 && child.tagName == 'BR')
		}) == 1) {
			parent.style.cssText += node.style.cssText;
			zss_editor.remove(node, true);
			node = parent;

		} else {
			break;
		}
	}

}

function mergesibling(rng, cmdName, value) {
	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	var dtd = _({
		a: 0,
		iframe: 1,
		sub: 1,
		img: 1,
		embed: 1,
		object: 1,
		sup: 1,
		basefont: 1,
		map: 1,
		applet: 1,
		font: 1,
		big: 1,
		small: 1,
		b: 1,
		acronym: 1,
		bdo: 1,
		'var': 1,
		'#': 1,
		abbr: 1,
		code: 1,
		br: 1,
		i: 1,
		cite: 1,
		kbd: 1,
		u: 1,
		strike: 1,
		s: 1,
		tt: 1,
		strong: 1,
		q: 1,
		samp: 1,
		em: 1,
		dfn: 1,
		span: 1,
		ins: 1,
		del: 1,
		script: 1,
		style: 1,
		input: 1,
		button: 1,
		select: 1,
		textarea: 1,
		label: 1
	});
	var collapsed = rng.collapsed,
		bk = zss_editor.createBookmark(), common;
	if (collapsed) {
		common = bk.start.parentNode;
		while (dtd[common.tagName]) {
			common = common.parentNode;
		}
	} else {
		common = zss_editor.getCommonAncestor(bk.start, bk.end);
	}
	$(common).find("span").each(function (index, span) {
		if (!span.parentNode || zss_editor.isBookmarkNode(span)) {
			return;
		}
		mergeWithParent(span);
	})
	zss_editor.moveToBookmark(bk);
	mergeChild(rng, cmdName, value)
}

var dtd2 = zss_editor.dtd2 = function () {
	function _(s) {
		for (var k in s) {
			s[k.toUpperCase()] = s[k];
		}
		return s;
	}

	return _({
		//自闭和元素
		$empty: _({
			area: 1,
			base: 1,
			basefont: 1,
			br: 1,
			col: 1,
			command: 1,
			dialog: 1,
			embed: 1,
			hr: 1,
			img: 1,
			input: 1,
			isindex: 1,
			keygen: 1,
			link: 1,
			meta: 1,
			param: 1,
			source: 1,
			track: 1,
			wbr: 1
		}),
		//在table元素里的元素列表
		$tableContent: _({caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1, table: 1}),
		//列表根元素列表
		$list: _({ul: 1, ol: 1, dl: 1}),
		//如果没有子节点就可以删除的元素列表，像span,a
		$removeEmpty: _({
			a: 1,
			abbr: 1,
			acronym: 1,
			address: 1,
			b: 1,
			bdo: 1,
			big: 1,
			cite: 1,
			code: 1,
			del: 1,
			dfn: 1,
			em: 1,
			font: 1,
			i: 1,
			ins: 1,
			label: 1,
			kbd: 1,
			q: 1,
			s: 1,
			samp: 1,
			small: 1,
			span: 1,
			strike: 1,
			strong: 1,
			sub: 1,
			sup: 1,
			tt: 1,
			u: 1,
			'var': 1
		}),
	})
}();
zss_editor.removeAttributes = function (node, attrNames) {
	attrNames = Array.isArray(attrNames) ? attrNames : attrNames.trim().replace(/[ ]{2,}/g, ' ').split(' ');
	for (var i = 0, ci; ci = attrNames[i++];) {
		switch (ci) {
			case 'className':
				node[ci] = '';
				break;
			case 'style':
				node.style.cssText = '';
				var val = node.getAttributeNode('style');
				val && node.removeAttributeNode(val);
		}
		node.removeAttribute(ci);
	}
}
//2021.06.10图片附件也不存在
zss_editor.isNodeEmpty = function (node) {
	return !node.firstChild || (node.innerText == '' && !node.querySelector('br') && !node.querySelector('img') && !node.querySelector('iframe')) || zss_editor.getChildCount(node, function (node) {
		return !zss_editor.isBookmarkNode(node)
	}) == 0
}
zss_editor.isEmptyNode = function (node) {
	return !node.firstChild || zss_editor.getChildCount(node, function (node) {
		return !(node.nodeType == 1 && node.tagName == 'BR') && !zss_editor.isBookmarkNode(node) && !zss_editor.isWhitespace(node)
	}) == 0
}
zss_editor.format = function (cmdName, tags, style, attrs, notIncludeA) {
	var setOpt = {
		'removeFormatTags': 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var',
		'removeFormatAttributes': 'class,style,lang,width,height,align,hspace,valign'
	}
	var tagReg = new RegExp('^(?:' + (tags || setOpt.removeFormatTags).replace(/,/g, '|') + ')$', 'i'),
		removeFormatAttributes = style ? [] : (attrs || setOpt.removeFormatAttributes).split(','),
		range = window.getSelection().getRangeAt(0),
		bookmark, node, parent,
		filter = function (node) {
			return node.nodeType == 1;
		};

	function isRedundantSpan(node) {
		if (node.nodeType == 3 || node.tagName.toLowerCase() != 'span') {
			return 0;
		}
		return !node.attributes.length;
	}

	function doRemove(range) {
		var bookmark1 = zss_editor.createBookmark();
		if (range.collapsed) {
			zss_editor.enlarge(true);
		}

		//不能把a标签切了
		if (!notIncludeA) {
			var aNode = zss_editor.findParentByTagName(range.startContainer, 'a', true);
			if (aNode) {
				range.setStartBefore(aNode);
				zss_editor.currentSelection.setRange(range);
			}

			aNode = zss_editor.findParentByTagName(range.endContainer, 'a', true);
			if (aNode) {
				range.setEndAfter(aNode);
				zss_editor.currentSelection.setRange(range);
			}

		}


		bookmark = zss_editor.createBookmark();

		node = bookmark.start;

		//切开始
		while ((parent = node.parentNode) && !zss_editor.isBlockElm(parent)) {
			zss_editor.breakParent(node, parent);

			zss_editor.clearEmptySibling(node);
		}
		if (bookmark.end) {
			//切结束
			node = bookmark.end;
			while ((parent = node.parentNode) && !zss_editor.isBlockElm(parent)) {
				zss_editor.breakParent(node, parent);
				zss_editor.clearEmptySibling(node);
			}
			//开始去除样式
			var current = zss_editor.getNextDomNode(bookmark.start, false, filter),
				next;
			while (current) {
				if (current == bookmark.end) {
					break;
				}

				next = zss_editor.getNextDomNode(current, true, filter);

				if (!dtd2.$empty[current.tagName.toLowerCase()] && !zss_editor.isBookmarkNode(current)) {
					if (tagReg.test(current.tagName)) {
						if (style) {
							zss_editor.removeStyle(current, style);
							if (isRedundantSpan(current) && style != 'text-decoration') {
								zss_editor.remove(current, true);
							}
						} else {
							zss_editor.remove(current, true);
						}
					} else {
						//trace:939  不能把list上的样式去掉
						if (!dtd2.$tableContent[current.tagName] && !dtd2.$list[current.tagName]) {
							zss_editor.removeAttributes(current, removeFormatAttributes);
							if (isRedundantSpan(current)) {
								zss_editor.remove(current, true);
							}
						}

					}
				}
				current = next;
			}
			var siblingNode = node.previousSibling;
		}
		//不能把td上的样式去掉，比如边框
		var pN = bookmark.start.parentNode;
		if (zss_editor.isBlockElm(pN) && !dtd2.$tableContent[pN.tagName] && !dtd2.$list[pN.tagName]) {
			zss_editor.removeAttributes(pN, removeFormatAttributes);
		}
		pN = bookmark.end.parentNode;
		if (bookmark.end && zss_editor.isBlockElm(pN) && !dtd2.$tableContent[pN.tagName] && !dtd2.$list[pN.tagName]) {
			zss_editor.removeAttributes(pN, removeFormatAttributes);
		}
		zss_editor.moveToBookmark(bookmark);
		zss_editor.moveToBookmark(bookmark1);
		//清除冗余的代码 <b><bookmark></b>
		var node = range.startContainer,
			tmp,
			collapsed = range.collapsed;
		while (node.nodeType == 1 && zss_editor.isNodeEmpty(node) && dtd2.$removeEmpty[node.tagName]) {
			tmp = node.parentNode;
			range.setStartBefore(node);
			zss_editor.currentSelection.setRange(range);
			//更新结束边界
			if (range.startContainer === range.endContainer) {
				range.endOffset--;
			}
			zss_editor.remove(node);
			node = tmp;
		}

		if (!collapsed) {
			node = range.endContainer;
			while (node.nodeType == 1 && zss_editor.isEmptyNode(node) && dtd2.$removeEmpty[node.tagName]) {
				tmp = node.parentNode;
				if (tmp.children && tmp.children.length > 1 && node.nodeName.toLowerCase() == 'br') {
					range.setEndBefore(node);
					zss_editor.currentSelection.setRange(range);
					zss_editor.remove(node);
				}
				node = tmp;
			}

		}
		return siblingNode;
	}


	range = window.getSelection().getRangeAt(0);
	var siblingNode = doRemove(range);
	zss_editor.currentSelection.setRange(range);
	return siblingNode;
}
zss_editor.setTextColor = function (colorIndex, isrecovery, value) {
	// var colorBox = ["#df402a","#f9973b","#7ea72e","#ae5da1","#a6a8a9","#333333"];
	var colorBox = ["#333333", "#df402a", "#f9973b", "#7ea72e", "#ae5da1", "#a6a8a9"];
	var color = colorBox[colorIndex] || "#333";
	zss_editor.restoreRangeBlur();
	// document.execCommand("styleWithCSS", null, true);
	// document.execCommand('foreColor', 0, color);
	// document.execCommand("styleWithCSS", null, false);
	var selection = window.getSelection();

	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		if (value) {
			color = value;
		}
		data.name = "execCommand";
		data.cmdName = 'forecolor';
		data.value = color;
		data.address = address;
		zss_editor.sendJoinData(data);
	}

	if (selection.getRangeAt(0).collapsed) {
		var range = selection.getRangeAt(0);
		var span = zss_editor.closerParentNodeStartingAtNode("span", range.startContainer);
		var text = document.createTextNode('font');
		if (span && !span.children.length && !span['textContent'].replace("​", '').length) {
			span.style.cssText += "color:" + color;
		} else {
			// var el = document.createElement("span");
			// el.style.cssText = "color:"+color;
			// var range = selection.getRangeAt(0).cloneRange();
			// range.surroundContents(el);
			// el.innerHTML = '&#8203';
			// zss_editor.jumpAfterNode(el);
			range.insertNode(text);
			range.setStartBefore(text);
			range.setEndAfter(text);
			zss_editor.currentSelection.setRange(range);
			span = document.createElement('span');
			var sibnode;
			sibnode = zss_editor.format('', 'span,a', 'color');
			if (sibnode) {
				zss_editor.clearEmptySibling(sibnode);
			}
			span.style.cssText = "color:" + color;

			sibnode.parentNode.insertBefore(span, sibnode);
			span.appendChild(sibnode);

			var spanParent = span.parentNode;
			while (!zss_editor.isBlockElm(spanParent)) {
				if (spanParent.tagName == 'SPAN') {
					//opera合并style不会加入";"
					span.style.cssText = spanParent.style.cssText + ";" + span.style.cssText;
				}
				spanParent = spanParent.parentNode;
			}
			while (span.firstChild) {
				span = span.firstChild;
			}
			range.setStartBefore(span);
			range.setEndAfter(span);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
			mergesibling(range, "forecolor", color);
			range.setStartBefore(span);
			range.setEndBefore(span);
			zss_editor.currentSelection.setRange(range);
			var tmpText = document.createTextNode("\u200b");
			range.insertNode(tmpText);
			zss_editor.jumpAfterNode(tmpText);
			zss_editor.remove(text);
			zss_editor.remove(span);
		}
		var li = zss_editor.closerParentNodeStartingAtNode("li", range.startContainer);
		if (li) {
			var first = li.firstChild;
			while (first && first.nodeType == 1 && first.nodeName != 'BR' && first.nodeName != 'HR') {

				if (first && first.firstChild.nodeType == 3) {
					li.style.cssText += first.style.cssText;
					break;
				} else if (first.firstChild.nodeName == 'BR' || first.firstChild.nodeName == 'HR') {
					li.style.cssText += "color:" + color;
					break;
				}
				first = first.firstChild;
			}
		}

	} else {
		//zss_editor.format('','span,a,strong,em,b,i', 'color');
		var range = selection.getRangeAt(0);
		zss_editor.applyInlineStyle('span', {'style': 'color:' + color})


		mergesibling(range, "forecolor", color);
		zss_editor.restoreRange();
//   	document.execCommand("styleWithCSS", null, true);
// 		document.execCommand('foreColor', 0, color);
//  	document.execCommand("styleWithCSS", null, false);
	}
	zss_editor.enabledEditingItems();
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
	}
}
zss_editor.removeFormating = function () {
	zss_editor.restoreRangeBlur();
	document.execCommand('removeFormat', false, null);
	zss_editor.enabledEditingItems();
}

zss_editor.beHtml = function (text, imgArr) {
	var textArr = new Array();
	textArr = text.split("\n"); //字符分割
	var texts = '';
	var imgs = '';
	for (i = 0; i < textArr.length; i++) {
		texts += '<p>' + textArr[i] + '</p>';
	}
	if (!!imgArr) {
		for (l = 0; l < imgArr.length; l++) {
			imgs += '<div class="editor-image" contenteditable="false"><img src="' + imgArr[l] + '" class="image-package"/></div>' +
				'<p><br></p>';
		}
	}

	return texts + imgs;
}
/*node节点是编辑区*/
zss_editor.isEditorMain = function (node) {
	return node && node.nodeType == 1 && node.id && node.id == 'zss_editor_content';
}
zss_editor.findParent = function (node, filterFn, includeSelf) {
	if (node && !zss_editor.isEditorMain(node)) {
		node = includeSelf ? node : node.parentNode;
		while (node) {
			if (!filterFn || filterFn(node) || zss_editor.isEditorMain(node)) {
				return filterFn && !filterFn(node) && zss_editor.isEditorMain(node) ? null : node;
			}
			node = node.parentNode;
		}
	}
	return null;
}
zss_editor.findParents = function (node, includeSelf, filterFn, closerFirst) {
	var parents = includeSelf && (filterFn && filterFn(node) || !filterFn) ? [node] : [];
	while (node = zss_editor.findParent(node, filterFn)) {
		parents.push(node);
	}
	return closerFirst ? parents : parents.reverse();
}
zss_editor.getNodeIndex = function (node) {
	var preNode = node,
		i = 0;
	while (preNode = preNode.previousSibling) {
		if (preNode.nodeType == 3) {
			if (preNode.nodeType != preNode.nextSibling.nodeType) {
				i++;
			}
			continue;
		}
		i++;
	}
	return i;
}
zss_editor.createAddress = function (range, ignoreEnd, ignoreTxt) {
	var addr = {};

	function getAddress(isStart) {
		var node = isStart ? range.startContainer : range.endContainer;
		var hasFillChar = 0;
		var parents = zss_editor.findParents(node, true, function (node) {
				return !zss_editor.isEditorMain(node)
			}),
			addrs = [];
		for (var i = 0, ci; ci = parents[i++];) {
			hasFillChar = 0;
			var index = zss_editor.getNodeIndex(ci);
			if (zss_editor.isFillChar(ci) && index == 0) {//20200702 8203不计
				break;
			} else {
				//20200619 去除8203,还原不准
				if (ci.parentNode && ci.parentNode.firstChild && zss_editor.isFillChar(ci.parentNode.firstChild)) {
					hasFillChar = 1;
				}

				if (index > 0) {
					addrs.push(index - hasFillChar);
				} else {
					addrs.push(index);
				}
			}
		}
		var firstIndex = 0;
		hasFillChar = 0;
		if (ignoreTxt) {
			if (node.nodeType == 3) {
				var tmpNode = node.previousSibling;
				while (tmpNode && tmpNode.nodeType == 3) {
					firstIndex += tmpNode.nodeValue.replace(new RegExp(fillChar, 'g'), '').length;
					tmpNode = tmpNode.previousSibling;
				}
				if (node.nodeValue.indexOf(fillChar) > -1 && node.nodeValue.indexOf(fillChar) < node.nodeValue.length - 1) { //8203和文字连在一起
					hasFillChar = 1;
				}

				firstIndex += (isStart ? range.startOffset : range.endOffset) - hasFillChar;
			} else {
				if (node && node.firstChild && zss_editor.isFillChar(node.firstChild)) {//<p>"8203" "XXX" </p>
					hasFillChar = 1;
				}
				node = node.childNodes[isStart ? range.startOffset : range.endOffset];
				if (node) {
					firstIndex = zss_editor.getNodeIndex(node, ignoreTxt) - hasFillChar;
				} else {
					node = isStart ? range.startContainer : range.endContainer;
					var first = node.firstChild;
					while (first) {
						if (zss_editor.isFillChar(first)) {
							first = first.nextSibling;
							continue;
						}
						firstIndex++;
						if (first.nodeType == 3) {
							while (first && first.nodeType == 3) {
								first = first.nextSibling;
							}
						} else {
							first = first.nextSibling;
						}
					}
				}
			}
		} else {
			if (node.nodeType == 3) {
				if (node.nodeValue.indexOf(fillChar) > -1 && node.nodeValue.indexOf(fillChar) < node.nodeValue.length - 1) { //8203和文字连在一起
					hasFillChar = 1;
				}
			} else {
				if (node && node.firstChild && zss_editor.isFillChar(node.firstChild)) {//<p>"8203" "XXX" </p>
					hasFillChar = 1;
				}
			}
			firstIndex = (isStart ? range.startOffset : range.endOffset) - hasFillChar;
		}

		if (firstIndex < 0) {
			firstIndex = 0;
		}
		addrs.push(firstIndex);
		return addrs;
	}

	addr.startAddress = getAddress(true);
	if (!ignoreEnd) {
		addr.endAddress = range.collapsed ? [].concat(addr.startAddress) : getAddress();
	}
	return addr;
}
zss_editor.moveToAddress = function (range, addr, ignoreEnd) {
	function getNode(address, isStart) {
		var tmpNode = document.getElementById('zss_editor_content'),
			parentNode, offset;
		for (var i = 0, ci, l = address.length; i < l; i++) {
			ci = address[i];
			parentNode = tmpNode;
			//20200619 去除8203,还原不准
			// if(tmpNode.firstChild && zss_editor.isFillChar(tmpNode.firstChild)){
			// 	tmpNode.firstChild.remove()
			// }
			tmpNode = tmpNode.childNodes[ci];
			if (!tmpNode) {
				offset = ci;
				break;
			}
		}
		if (isStart) {
			if (tmpNode) {
				range.setStartBefore(tmpNode)
			} else {
				if (parentNode.length < offset) {
					range.setStart(parentNode, parentNode.length)
				} else {
					range.setStart(parentNode, offset)
				}

			}
		} else {
			if (tmpNode) {
				range.setEndBefore(tmpNode)
			} else {
				if (parentNode.length < offset) {
					range.setEnd(parentNode, parentNode.length)
				} else {
					range.setEnd(parentNode, offset)
				}
			}
		}
	}

	getNode(addr.startAddress, true);
	!ignoreEnd && addr.endAddress && getNode(addr.endAddress);
	return range;
}
zss_editor.isFillChar = function (node, isInStart) {
	if (node.nodeType != 3)
		return false;
	var text = node.nodeValue;
	if (isInStart) {
		return new RegExp('^' + fillChar).test(text)
	}
	return !text.replace(new RegExp(fillChar, 'g'), '').length
}
var saveSceneTimer;
var maxUndoCount = maxInputCount = 30;
var undoManagerList = [];
var undoManagerIndex = 0;
var undoManagerhasUndo = false;
var undoManagerhasRedo = false;
zss_editor.undoManagerUndo = function (isrecovery) {
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'undo';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	if (undoManagerhasUndo) {
		if (!undoManagerList[undoManagerIndex - 1] && undoManagerList.length == 1) {
			zss_editor.undoManagerReset();
			return;
		}
		while (undoManagerList[undoManagerIndex].content == undoManagerList[undoManagerIndex - 1].content) {
			undoManagerIndex--;
			if (undoManagerIndex == 0) {
				return zss_editor.undoManagerRestore(0);
			}
		}
		zss_editor.undoManagerRestore(--undoManagerIndex);
	}
}
zss_editor.undoManagerRedo = function (isrecovery) {
	//20200630 协同编辑:不是恢复数据,就发送数据,是恢复数据,就不发数据,避免形成死循环
	var range = window.getSelection().getRangeAt(0);
	if (!isrecovery && zss_editor.cooperation) {//发数据
		var data = {};
		var tmpRange = range.cloneRange();
		var address = zss_editor.createAddress(tmpRange, false, true);
		data.name = "execCommand";
		data.cmdName = 'redo';
		data.value = null;
		data.address = address;
		zss_editor.sendJoinData(data);
	}
	if (undoManagerhasRedo) {
		while (undoManagerList[undoManagerIndex].content == undoManagerList[undoManagerIndex + 1].content) {
			undoManagerIndex++;
			if (undoManagerIndex == undoManagerList.length - 1) {
				return zss_editor.undoManagerRestore(undoManagerIndex);
			}
		}
		zss_editor.undoManagerRestore(++undoManagerIndex);
	}
};
zss_editor.undoManagerRestore = function () {
	var scene = undoManagerList[undoManagerIndex];
	$('#zss_editor_content').html(scene.content);
	try {
		//   	$('#zss_editor_content').focus();
		//   	var sel = window.getSelection();
		//    var rng = document.createRange();
		// rng.selectNodeContents($('#zss_editor_content')[0].lastChild);
		//    rng.collapse(false);
		//撤销图片不显示灰色占位
		$(".editor-image").find("img").css("opacity", 1);
		$(".editor-image").css("background-color", "");
		//撤销会去除零宽字符，打点时间后面需要加上零宽字符
		if (!$(".record-list-tit").last().is("​")) {
			console.log($(".record-list-tit").last())
			$(".record-list-tit").append("​");
		}
		zss_editor.focusEditor();
		var rng = document.getSelection().getRangeAt(0);
		range = zss_editor.moveToAddress(rng, scene.address);
		zss_editor.currentSelection.setRange(range);
		if ($("body").hasClass('editorNoticeWrap')) {
			//通知客户端实现滚动到焦点位置
			zss_editor.clientscrollToCursorPos();
		} else {
			//脚本实现滚动到焦点位置
			zss_editor.calculateEditorHeightWithCaretPosition();
		}
		//zss_editor.calculateEditorHeightWithCaretPosition();
	} catch (e) {
	}
	zss_editor.undoManagerUpdate();
	zss_editor.undoManagerClearKey();
	zss_editor.hasContent();
};

zss_editor.undoManagerGetScene = function () {
	var cont = $('#zss_editor_content').html();
	cont = cont.replace(/<p>​<\/p>/gi, '<p><br></p>').replace(new RegExp("​", 'g'), '')
		.replace(/src\s*=\s*"\S*.html#\S*"/gi, function () {
			return arguments[0].replace(/#\S*"/gi, '"');
		})
	var rng = document.getSelection().getRangeAt(0);
	rngAddress = zss_editor.createAddress(rng, false, true)
	return {
		content: cont,
		address: rngAddress
	}
};
zss_editor.undoManagerSave = function () {
	clearTimeout(saveSceneTimer);
//	normalList();
	var currentScene = zss_editor.undoManagerGetScene(),
		lastScene = undoManagerList[undoManagerIndex];
	//内容相同位置不同不存
	if (lastScene && lastScene.content == currentScene.content) {
		return;
	}
	undoManagerList = undoManagerList.slice(0, undoManagerIndex + 1);
	undoManagerList.push(currentScene);
	//如果大于最大数量了，就把最前的剔除
	if (undoManagerList.length > maxUndoCount) {
		undoManagerList.shift();
	}
	undoManagerIndex = undoManagerList.length - 1;
	zss_editor.undoManagerClearKey()
	//跟新undo/redo状态
	zss_editor.undoManagerUpdate();
	zss_editor.enabledEditingItems();
	zss_editor.hasContent();
//  console.log(JSON.stringify(undoManagerList[undoManagerList.length-1].content));
//  console.log(JSON.stringify(undoManagerList[undoManagerList.length-1].address));
};
zss_editor.undoManagerUpdate = function () {
	undoManagerhasRedo = !!undoManagerList[undoManagerIndex + 1];
	undoManagerhasUndo = !!undoManagerList[undoManagerIndex - 1];
};
zss_editor.undoManagerReset = function () {
	undoManagerList = [];
	undoManagerIndex = 0;
	undoManagerhasUndo = false;
	undoManagerhasRedo = false;
	zss_editor.undoManagerClearKey();
};
zss_editor.undoManagerClearKey = function () {
	keycont = 0;
};
//输入法状态下不计算字符数
var inputType = false;
$('#zss_editor_content').on('compositionstart', function () {
	inputType = true;
});
$('#zss_editor_content').on('compositionend', function () {
	inputType = false;
});
var isCollapsed = true;
zss_editor.deepEqual = function (x, y) {
	// 指向同一内存时
	if (x === y) {
		return true;
	} else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
		if (Object.keys(x).length != Object.keys(y).length)
			return false;

		for (var prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!zss_editor.deepEqual(x[prop], y[prop]))
					return false;
			} else
				return false;
		}

		return true;
	} else
		return false;
}
$('#zss_editor_content').on('keydown', function (e) {
	var me = this;
	// if(e.keyCode === 32){
	// 	console.log("空格")
	// 	var range = document.getSelection().getRangeAt(0);
	// 	var node = range.startContainer;
	// 	var hasFillChar = 0;
	// 	var parents = zss_editor.findParents(node,true,function(node){return !zss_editor.isEditorMain(node)}),
	// 		addrs = [];
	// 	var firstParent = parents[0];
	// 	var reg = /^\d+\.{1}$/g;
	// 	if(node.nodeType == 3 && reg.test(node.nodeValue.replace(new RegExp("​", 'g'),''))){
	// 		var nodeNum= node.nodeValue.replace(/[^0-9]/ig,"");
	// 		// var ele = node.nodeValue.substring(node.nodeValue.indexOf("1."),node.nodeValue.indexOf("1.")+2);
	// 		// if(start.nodeType == 3){
	// 		// 	while (!zss_editor.isBlockElm(start)) {
	// 		// 		start = start.parentNode;
	// 		// 	}
	// 		// }
	// 		var prev = node.previousSibling;
	// 		if(!prev){
	// 			while((!node.previousSibling || zss_editor.isEmptyNode(node.previousSibling)) && !zss_editor.isEditorMain(node.parentNode)) {
	// 				node = node.parentNode;
	// 			}
	// 			if(zss_editor.isBlockElm(node) && node.tagName != 'OL' && node.tagName != 'UL'){
	// 				console.log("aaa")
	// 				zss_editor.setOrderedList('',nodeNum)
	// 			}
	// 		}
	//
	// 	}
	//
	// }
	if (inputType)
		return;
	if (!window.getSelection().getRangeAt(0).collapsed) { //有选区
		zss_editor.undoManagerSave();
		isCollapsed = false;
		return;
	} else {
		// 协同编辑存输入前的光标位置
		if (zss_editor.cooperation) {
			var rng = document.getSelection().getRangeAt(0);
			var address = zss_editor.createAddress(rng, false, true);
			zss_editor.addressList.push(address);
		}
		//解决ios列表换行原生换行问题2021.07.12
		var li = zss_editor.closerParentNodeWithName('li');
		if (isIOS && li) {
			zss_editor.backupRange();
		}
	}
	if (undoManagerList.length == 0) {
		zss_editor.undoManagerSave();
	}
	clearTimeout(saveSceneTimer);

	function save() {
		zss_editor.undoManagerSave();
		//解决ios列表换行原生换行问题2021.07.12
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		var rng = range.cloneRange();
		var start = rng.startContainer;
		//内容相同不存
		var lastScene = undoManagerList[undoManagerIndex - 1];
		var currentScene = undoManagerList[undoManagerIndex];
		if (lastScene && lastScene.content == currentScene.content) {
			return;
		}
		//计算插入文字
		var currentLen = 0;
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		div1.innerHTML = lastScene.content;
		div2.innerHTML = currentScene.content;
		if (isIOS && $(div1)[0].innerText.replace(new RegExp(fillChar, 'g'), '').replace(/\s+/g, "") == $(div2)[0].innerText.replace(new RegExp(fillChar, 'g'), '').replace(/\s+/g, "")) {
			var li = zss_editor.closerParentNodeWithName('li');
			//解决ios列表换行执行原生操作出错问题2021.07.12
			if (li && $(li).length > 0 && $(li).next().length > 0 && $(li).attr("serialnum") == $(li).next().attr("serialnum")) {
				console.log("进来333")
				normalList();
				zss_editor.updateEnterRange();
			}
		}


		var firstLen = $(div1)[0].innerText.length;
		var lastLen = $(div2)[0].innerText.length;
		if (undoManagerList.length > 1) {
			currentLen = lastLen - firstLen;
		} else {
			currentLen = lastLen;
		}
		if (currentLen > 0) {
			while (!zss_editor.isBlockElm(start)) {
				start = start.parentNode;
			}
			if (start && start.getAttribute("element-id")) {
				var elementId = start.getAttribute("element-id");
			} else {
				start.setAttribute("element-id", zss_editor.getRandomId());
			}
			rng.setStartBefore(start);
			//获取选取的文本
			var rangeText = rng.toString();

			var rangeLen = rangeText.length;
			var startLen = start.innerText.replace(new RegExp(fillChar, 'g'), '').replace(/^\s+|\s+$/g, '').length;
			rng.collapse(false);
			var insertData = {};
			var delData = {};
			var currentText = $(div2)[0].innerText;
			var startPos = rangeLen > 0 ? rangeLen - currentLen : 0;
			var insertText = rangeText.substring(startPos);
			if (insertText == ' ' || insertText == ' ') {
				var node = range.startContainer;
				var reg = /^\d+\.{1}$/g;
				if (node.nodeType == 3 && reg.test(node.nodeValue.replace(new RegExp("​", 'g'), '').trim())) {
					var nodeNum = node.nodeValue.replace(/[^0-9]/ig, "");
					// var ele = node.nodeValue.substring(node.nodeValue.indexOf("1."),node.nodeValue.indexOf("1.")+2);
					// if(start.nodeType == 3){
					// 	while (!zss_editor.isBlockElm(start)) {
					// 		start = start.parentNode;
					// 	}
					// }
					var prev = node.previousSibling;
					if (prev && $(prev).text().replace(/\s+/g, "").replace(new RegExp("​", 'g'), '') == '' && $(prev).find('img').length == 0 && $(prev).find('iframe').length == 0) {
						$(prev).remove();
					}
					if (!prev) {
						while ((!node.previousSibling || zss_editor.isEmptyNode(node.previousSibling)) && !zss_editor.isEditorMain(node.parentNode)) {
							node = node.parentNode;
						}
						if (zss_editor.isBlockElm(node) && node.tagName != 'OL' && node.tagName != 'UL') {
							zss_editor.setOrderedList('', nodeNum)
						}
					}


				}
			}
			if (zss_editor.cooperation) {
				insertData.name = "insert";
				insertData.startPos = startPos;
				insertData.insertText = insertText;
				if (zss_editor.addressList.length > 0) {
					insertData.address = zss_editor.addressList[0];
				}
				var insertDataClone = JSON.parse(JSON.stringify(insertData));
				delete insertDataClone.address;
				if (zss_editor.XTSendData.length >= 1) {
					var lastData = zss_editor.XTSendData[zss_editor.XTSendData.length - 1];
					console.log(zss_editor.deepEqual(lastData, insertDataClone))
					if (zss_editor.deepEqual(lastData, insertDataClone) == false) {
						zss_editor.XTSendData = [];
						zss_editor.XTSendData.push(JSON.parse(JSON.stringify(insertDataClone)));
						zss_editor.sendJoinData(insertData);
					} else {
						zss_editor.XTSendData.push(JSON.parse(JSON.stringify(insertDataClone)));
					}
				} else {
					zss_editor.XTSendData.push(JSON.parse(JSON.stringify(insertDataClone)));
					zss_editor.sendJoinData(insertData);
				}
			}
		}
		// 协同编辑
		if (zss_editor.cooperation) {
			if (e.keyCode == 8 && zss_editor.isSendDelete == false) {
				if (currentLen == 0) {
					var data = {};
					data.name = "delete";
					data.elementId = elementId;
					data.address = zss_editor.addressList[0];
					data.startPos = 0;
					data.delLen = 0;
					zss_editor.sendJoinData(data);

				} else if (currentLen < 0) {
					var delLen = Math.abs(currentLen);
					var startPos = rangeLen + delLen;
					delData.name = "delete";
					delData.address = zss_editor.addressList[0];
					delData.addressEnd = zss_editor.createAddress(rng, false, true);
					delData.elementId = elementId;
					delData.startPos = startPos;
					delData.delLen = delLen;
					zss_editor.sendJoinData(delData);
				}
			}
			zss_editor.addressList = [];
		}
	}

	saveSceneTimer = setTimeout(function () {
		if (inputType) { //正在输入
			var interalTimer = setInterval(function () {
				if (!inputType) {
					save();
					clearInterval(interalTimer)
				}
			}, 300)
			return;
		}
		save();
	}, 200);
	keycont++;
	if (keycont >= maxInputCount) {
		save();
	}
});
//20200811找到前一个元素
zss_editor.getprevNode = function (node) {
	var prev = node.previousSibling;
	if (!prev) {
		//没有前一个元素，找到前一个元素
		while (!node.previousSibling && node.parentNode.tagName != "BODY") {
			node = node.parentNode;
		}
		prev = node.previousSibling;
	}
	if (prev && (!zss_editor.isBlockElm(prev) || zss_editor.isNodeEmpty(prev) || prev.style.display && prev.style.display == 'none')) {
		//有但不是块状元素，找到块状元素
		while (prev && (!zss_editor.isBlockElm(prev) || zss_editor.isNodeEmpty(prev) || prev.style.display && prev.style.display == 'none')) {
			if (prev.previousSibling) {
				prev = prev.previousSibling;
			} else {
				prev = prev.parentNode.previousSibling;
			}
		}
	}
	if (prev) {
		return prev;
	} else {
		return null;
	}
}
//协同编辑获取当前node的前一个块状元素
zss_editor.getPreBlockNode = function (node) {
	var prev = node.previousSibling;
	if (!prev) {
		//没有前一个元素，找到前一个元素
		while (!node.previousSibling && node.parentNode.tagName != "BODY") {
			node = node.parentNode;
		}
		prev = node.previousSibling;
	}
	if (prev) {
		if (!zss_editor.isBlockElm(prev)) {
			//有但不是块状元素，找到块状元素
			while (prev && !zss_editor.isBlockElm(prev)) {
				if (prev.previousSibling) {
					prev = prev.previousSibling;
				} else {
					prev = prev.parentNode.previousSibling;
				}
			}
		}
		//是块状元素--找到prev里的最后一个块状元素
		while (prev) {
			if (zss_editor.isBlockElm(prev)) {
				if (!zss_editor.isNodeEmpty(prev)) {
					prev = prev.lastChild;
				} else {
					prev = prev.previousSibling;
				}
			} else {
				if (prev.nodeType == 3 && prev.nodeValue.trim() != '' || prev.nodeType == 1) {
					//是文本节点或行内元素
					prev = prev.parentNode;
					break;
				} else {
					//其他节点，比如注释节点
					prev = prev.previousSibling;
				}
			}
		}
		return prev;
	} else {
		return null;
	}
}
$('#zss_editor_content').on('keyup', function (e) {
	if (inputType)
		return;
	var keyCode = e.keyCode;
	//删除和换行后整理序号
	if (keyCode == 13 || keyCode == 8) {
		normalList();
		zss_editor.undoManagerSave();
	}
	if (!isCollapsed) { //没有选区
		zss_editor.undoManagerSave();
		isCollapsed = true;
	}
	// 协同编辑加element-id
	var selection = window.getSelection();
	var rng = selection.getRangeAt(0);
	if (keyCode == 13) {
		var start = rng.startContainer;
		while (!zss_editor.isBlockElm(start)) {
			start = start.parentNode;
		}
		//2022.05.11协同编辑加elementid
		if (!start.getAttribute("element-id") || zss_editor.getPreBlockNode(start) && zss_editor.getPreBlockNode(start).getAttribute("element-id") == start.getAttribute("element-id")) {
			start.setAttribute("element-id", zss_editor.getRandomId());
		}
		if (zss_editor.cooperation && zss_editor.isSendEnter == false) {
			var prenode = zss_editor.getPreBlockNode(start);
			var prenodelen = prenode.innerText.replace(new RegExp(fillChar, 'g'), '').replace(/^\s+|\s+$/g, '').length;
			var data = {};
			data.name = "enter";
			data.address = zss_editor.addressList[0];
			data.elementId = start.getAttribute("element-id");
			data.preId = prenode.getAttribute("element-id");
			data.startPos = prenodelen;
			zss_editor.sendJoinData(data);
		}
	}
});
/*ios监听输入事件,记录改变的内容*/
$('#zss_editor_content').on('input', function (e) {
	if (!window.getSelection().getRangeAt(0).collapsed) {
		return;
	}
	//是输入法输入的保存(只在ios手机上可测到)
	if (isIOS && e.originalEvent.inputType.indexOf('Composition') > -1) {
		zss_editor.undoManagerSave();
	}
});
zss_editor.undo = function () {
//	document.execCommand('undo', false, null);
	zss_editor.undoManagerUndo();
	zss_editor.enabledEditingItems();
};
zss_editor.redo = function () {
//	document.execCommand('redo', false, null);
	zss_editor.undoManagerRedo();
	zss_editor.enabledEditingItems();
};
zss_editor.matchPreview = function (content, w, isBasicEdu) {
	//图片裁剪
	content = content.replace(/<img [^>]*src=['"]([^'"]+)chaoxing\.com([^'"]+)[^>]*>/gi, function () {
		var img = arguments[0];
		var urlReg = new RegExp("src=['\"]([^'\"]+)chaoxing\.com([^'\"]+)", 'gi');
		img = img.replace(urlReg, function () {
			return zss_editor.imgRule(arguments[0], w);
		})
		return img;
	});
	content = zss_editor.replaceIframeSrc(content);
//	var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px","g");
//	content = content.replace(reg,function() {
//      return zss_editor.fontsizeAdd(arguments[0]);
//  });
	//xss过滤
	content = content.replace(zss_editor.xssReg, function () {
		return arguments[0] + '　';
	})
	// 匹配所有的style
	if (content.indexOf('<div class="unfilter_css">') == -1 && content.indexOf('<div class="xiumi">') == -1) {
		var styleReg = /style\s*?=\s*?(['"])[\s\S]*?\1/gi;
		content = content.replace(styleReg, function () {
			return zss_editor.matchcss(arguments[0]);
		});
	}
	//匹配所有元素
	var eleReg = /<[^<>]+>/gi;
	content = content.replace(eleReg, function () {
		return zss_editor.matchele(arguments[0]);
	});
	//解决服务端生成的html属性用单引号时，附件不能正常显示的问题
	content = content.replace(/&apos;/g,"'")
	//a链接
	content = zss_editor.addLink(content);
	//去除.html#后面的内容
	content = content.replace(/src\s*=\s*"\S*.html#\S*"/gi, function () {
		return arguments[0].replace(/#\S*"/gi, '"');
	})
	// 插入前改变红包附件
	var newCon = document.createElement('div');
	newCon.id = 'basicEduCon';
	// Safari 要求div必须有内容，才能粘贴内容进来
	newCon.appendChild(document.createTextNode("\u200b"));
	document.body.appendChild(newCon);
	newCon.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:0;white-space:nowrap;top:0;opacity:0;";
	newCon.innerHTML = content;
	// 基础教育不显示红包附件
	if (!!isBasicEdu && isBasicEdu == 1) {
		$('#basicEduCon .attach-module[module="insertRedpacket"]').each(function () {
			$(this).attr("src", "insertRedpacketNo.html");
			$(this).removeClass('attach-insertRedpacket').addClass('attach-insertErrorannex');
		});
	}
	try {
		newCon.parentNode.removeChild(newCon);
	} catch (e) {
	}
	return newCon.innerHTML;
}
//插入详情页数据
zss_editor.insertNoteContent = function (content, w, isBasicEdu, type) {
	//学习通设置字体缩放
	var fontSizeClass = '';
	var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px", "g");
	if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
		fontSizeClass = 'cxSize' + type;
		content = content.replace(reg, function () {
			return zss_editor.fontsizeZoomIn(arguments[0], type);
		});
	}
	//新版协作转化成老笔记格式
	if (content.indexOf("<hidden></hidden>") > -1) {
		content = dateToOld.yjsToHtmlStr(content);
	}
	content = zss_editor.matchPreview(content, w, isBasicEdu);

	$('#zss_editor_content').html(content);
	//学习通设置字体缩放
	if (fontSizeClass != '') {
		$(".previewBox").addClass(fontSizeClass);
	}
	//2021.12.9图表显示
	if ($('#zss_editor_content').find('[module="chart"]').length > 0) {
		renderChart(document);
	}
	//p标签中有内容的去除零宽字符,解决安卓选中文字没有复制弹框2021.10.15
	$('#zss_editor_content p').each(function () {
		zss_editor.removeZeroText($(this)[0]);
	})
	//表格外面包裹div,实现固定宽度滑动查看表格2021.01.15
	$('table').each(function () {
		var _this = $(this);
		if (!$(this).parent().hasClass("table")) {
			_this.wrapAll('<div class="table"></div>');
		}
	})
	$('iframe.attach-module').each(function () {
		var _this = $(this);
		//兼容教务那边动态插入通知内容，构造的iframe移动端隐藏
		if(_this.attr("mobilehide")){
			$(this).hide()
		}
	})
	//去除列表li下元素的行距
	$('.editor_main li').children().each(function (index, item) {
		if (item.nodeType == 1 && item.style.lineHeight) {
			item.style.lineHeight = '';
		}
	})
	//兼容旧列表格式
	normaloldlist();
	//教案默认显示课前20200814
	$("#ulTab .classul > div").eq(0).addClass("cur_li").siblings().removeClass("cur_li");
	$(".classConBefore").show();
	$(".classConCenter,.classConAfter").hide();
	//清除pc自动生成的零宽字符
	$(".todo-inner").text("");
	$('.dynacALink').each(function () {
		if ((($(this).parent().attr('style') && $(this).parent().attr('style').indexOf('color') != -1) || $(this).parent().attr('color'))
			&& $(this).text().trim() == $(this).parent().text().trim()) {
			$(this).css('color', $(this).parent().css('color'))
		}
	});
	//文本附件链接去掉链接跳转2021.04.16
	$("a.iframe").attr("addr", $(this).attr("href")).attr("href", "javascript:;");
	// 转发到笔记三行空行如果为空详情页不显示
	if ($(".focusStart").first().length > 0 && $(".focusStart").first().html().replace(/<br\s*\/?>/gi, "").replace(/\u200B/g, '').trim() == '' && $(".focusStart").first()[0] == $("#zss_editor_content").children().get(0)) {
		$(".focusStart").first().remove();
	}
	if ($(".record-box").first().prev().length > 0 && $(".record-box").first().prev().html().replace(/<br\s*\/?>/gi, "").replace(/\u200B/g, '').trim() == '' && $(".record-box").first().prev()[0] == $("#zss_editor_content").children().get(0)) {
		$(".record-box").first().prev().remove();
	}
	zss_editor.loadImg(w);
	if (!!w) {
		var width = w - 30;
	} else {
		var width = zss_editor.wWidth - 30;
	}
	zss_editor.updateAllIframeWidth(width);
	//去除pc粘贴的视频上传失败代码和图片多余2021.01.18
	$(".editor-iframe").find('.video_fail').remove();
	$(".editor-iframe").find('.attachprogress_wrap').remove();
	$(".editor-image").find(".attachhover").remove();
}
// 安卓插入详情页数据
zss_editor.insertNoteContentAndroid = function (content, isBasicEdu, zoomType) {
	zss_editor.insertNoteContent(content, '', isBasicEdu, zoomType)
}
// 点击回复通知图片
zss_editor.onReplyImageClick = function (imageUrl, position) {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.onReplyImageClick(imageUrl, position);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.onReplyImageClick) {
			window.webkit.messageHandlers.onReplyImageClick.postMessage([imageUrl, position]);
		} else {
			if (window["onReplyImageClick"]) {
				window["onReplyImageClick"](imageUrl, position);
			}
		}
	}
};

// 通知获取焦点位置和编辑区高度，客户端实现滚动
zss_editor.clientscrollToCursorPos = function () {
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var closerParentNode = zss_editor.closerParentNode();
	var fontSize = $(closerParentNode).css('font-size');
	var lineHeight = Math.floor(parseInt(fontSize.replace('px', '')) * 1.5);
	// var windowHeight = $(document.body).height();
	var windowHeight = $(".editorBox").outerHeight();
	var editorHeight = $("#zss_editor_content").outerHeight();
	var replayHeight = $("#notice_main").outerHeight();
	var cursorPos = zss_editor.getYCaretInfo() + lineHeight;
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.clientscrollToCursorPos(cursorPos, windowHeight);
	}
	//ios
	if (isIOS) {
		if(zss_editor.getYCaretInfo() == 0) return;
		if (window.webkit && window.webkit.messageHandlers.clientscrollToCursorPos) {
			window.webkit.messageHandlers.clientscrollToCursorPos.postMessage([cursorPos, replayHeight, editorHeight]);
		} else {
			if (window["clientscrollToCursorPos"]) {
				window["clientscrollToCursorPos"](cursorPos, replayHeight, editorHeight);
			}
		}
	}
}
// 通知改变内容高度方法
zss_editor.updateHeight = function () {
	var windowHeight = $(".editorBox").outerHeight();
	var editorHeight = $("#zss_editor_content").outerHeight();
	var replayHeight = $("#notice_main").outerHeight();
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.updateHeight(windowHeight);
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.updateHeight) {
			window.webkit.messageHandlers.updateHeight.postMessage([replayHeight, editorHeight]);
		} else {
			if (window["updateHeight"]) {
				window["updateHeight"](replayHeight, editorHeight);
			}
		}
	}
}

// 回复通知
zss_editor.replyNotice = function (datas, isBasicEdu) {
	if (!zss_editor.wWidth) {
		zss_editor.wWidth = $(window).width();
	}
	var w = zss_editor.wWidth;
	if (zss_editor.isEnLanguage()) {
		zss_editor.noticeInfor.title = "Original Station Letter";
		zss_editor.noticeInfor.to = "To:";
		zss_editor.noticeInfor.read = "Read:";
		zss_editor.noticeInfor.cc = "Cc:";
	}
	if (datas.length > 0) {
		var dhtml = "";
		for (var i = 0; i < datas.length; i++) {
			var title = datas[i].title || '';
			var createrName = datas[i].createrName || '';
			var createrPuid = datas[i].createrPuid || '';
			var sendTime = datas[i].insertTime || '';
			var dataReceiverArray = datas[i].receiverArray || '';
			var receiverArray = "";
			if (dataReceiverArray != "") {
				for (var l = 0; l < dataReceiverArray.length; l++) {
					if (dataReceiverArray[l].puid) {
						receiverArray += '<span class="createTo_name" data-id="' + dataReceiverArray[l].puid + '">' + dataReceiverArray[l].name + '</span>、';
					} else {
						receiverArray += '<span class="createTo_name">' + dataReceiverArray[l].name + '</span>、';
					}
				}
				if (receiverArray.length > 0) {
					receiverArray = receiverArray.substr(0, receiverArray.length - 1);
				}
			}
			var tocc = datas[i].tocc || "";
			var toccArray = "";
			if (tocc != "") {
				for (var t = 0; t < tocc.length; t++) {
					if (tocc[t].puid) {
						toccArray += '<span class="createToCc_name" data-id="' + tocc[t].puid + '">' + tocc[t].name + '</span>、';
					} else {
						toccArray += '<span class="createToCc_name">' + tocc[t].name + '</span>、';
					}
				}
				if (toccArray.length > 0) {
					toccArray = toccArray.substr(0, toccArray.length - 1);
				}
			}
			var count_read = datas[i].count_read || 0;
			var count_all = datas[i].count_all || 0;
			var rtf_content = datas[i].rtf_content || '';
			rtf_content = zss_editor.matchPreview(rtf_content, w, isBasicEdu);
			dhtml += '<div class="noticeLi" data-index=' + i + '>' +
				'<div class="noticeTitle">' +
				'<p>' + zss_editor.noticeInfor.title + '</p>' +
				'</div>' +
				'<div class="noticeHead">' +
				'<div class="noticeHead_title">' + title + '</div>' +
				'<div class="noticeItem noticeHead_from">' +
				'<span class="createName" data-id="' + createrPuid + '">' + createrName + '</span><span class="createTime">' + sendTime + '</span>' +
				'</div>' +
				'<div class="noticeItem noticeHead_item"><div class="words2"><span class="createFrom">' + zss_editor.noticeInfor.to + '</span><span class="createTo">' + receiverArray + '</span></div></div>';
			if (toccArray.length > 0) {
				dhtml += '<div class="noticeItem noticeHead_item"><span class="createFrom">' + zss_editor.noticeInfor.cc + '</span><span class="createTo">' + toccArray + '</span></div>';
			}
			if (datas[i].hasSendsign == 1 && count_all > 1) {
				dhtml += '<div class="noticeItem noticeHead_row"><span class="createCount">' + zss_editor.noticeInfor.read + '</span><span><span>' + count_read + '</span>';
				if (datas[i].status != -1) {
					dhtml += '/<span>' + count_all + '</span>';
				}
				dhtml += '</span></div>';
			}

			dhtml += '</div>' +
				'<div class="noticeContent">' + rtf_content + '</div>' +
				'</div>';
		}
		$("#notice_main").html(dhtml);
		//大于这个版本点击人名增加puid参数,客户端实现到人员信息界面
		var version2 = null;
		if (isIOS) {
			version2 = zss_editor.versionSame('4.3.9.8');
		}
		if (isAndroid && (typeof javaJs !== 'undefined')) {
			version2 = zss_editor.versionSame('4.4.1.0');
		}
		//点击发送人
		$('#notice_main .createName').on('click', function (e) {
			var liIndex = $(this).parents(".noticeLi").attr("data-index") || 0;
			var dataId = $(this).data("id") || "";
			if (version2) {
				openReplyEvent("OPEN_REPLY_SEND", liIndex, dataId);
			} else {
				openReplyEvent("OPEN_REPLY_SEND", liIndex, '');
			}

		});
		//点击收件人
		$('#notice_main .createTo_name').on('click', function (e) {
			var liIndex = $(this).parents(".noticeLi").attr("data-index") || 0;
			var dataId = $(this).data("id") || "";
			if (version2) {
				var pos = $('#notice_main .createTo_name').index($(this));
				openReplyEvent("OPEN_INFOR", pos, dataId);
			} else {
				var pos = $('.noticeLi').eq(liIndex).find('.createTo_name').index($(this));
				openReplyEvent("OPEN_REPLY_INFOR", liIndex, pos);
			}

		});
		//点击抄送人
		$('#notice_main .createToCc_name').on('click', function (e) {
			var liIndex = $(this).parents(".noticeLi").attr("data-index") || 0;
			var dataId = $(this).data("id") || "";
			if (version2) {
				var pos = $('#notice_main .createToCc_name').index($(this));
				openReplyEvent("OPEN_INFORCC", pos, dataId);
			} else {
				var pos = $('.noticeLi').eq(liIndex).find('.createToCc_name').index($(this));
				openReplyEvent("OPEN_REPLY_INFORCC", liIndex, pos);
			}
		});
		var width = zss_editor.wWidth - 30;
		zss_editor.updateAllIframeWidth(width);
	}

}
// 插入通知详情页内容
zss_editor.setNoticeInfor = function (noteInfo, isBasicEdu) {
	if (!zss_editor.wWidth) {
		zss_editor.wWidth = $(window).width();
	}
	var w = zss_editor.wWidth;
	if (zss_editor.isEnLanguage()) {
		zss_editor.noticeInfor.edit = "Edit";
		zss_editor.noticeInfor.reCall = "Recall";
		zss_editor.noticeInfor.reminder = "Reminder";
		zss_editor.noticeInfor.read = "Read:";
		zss_editor.noticeInfor.to = "To:";
		zss_editor.noticeInfor.cc = "Cc:";
	}
	var isRefreshContent = noteInfo.isRefreshContent || 0;
	var title = noteInfo.title || "";
	var createrName = noteInfo.createrName || '';
	var sendTime = noteInfo.insertTime || '';
	var dataReceiverArray = noteInfo.receiverArray || '';
	var receiverArray = "";
	if (dataReceiverArray != "") {
		for (var l = 0; l < dataReceiverArray.length; l++) {
			if (dataReceiverArray[l].puid) {
				receiverArray += '<span class="createTo_name" data-id="' + dataReceiverArray[l].puid + '">' + dataReceiverArray[l].name + '</span>、';
			} else {
				receiverArray += '<span class="createTo_name">' + dataReceiverArray[l].name + '</span>、';
			}

		}
		if (receiverArray.length > 0) {
			receiverArray = receiverArray.substr(0, receiverArray.length - 1);
		}
	}
	var tocc = noteInfo.tocc || "";
	var toccArray = "";
	if (tocc != "") {
		for (var i = 0; i < tocc.length; i++) {
			if (tocc[i].puid) {
				toccArray += '<span class="createToCc_name" data-id="' + tocc[i].puid + '">' + tocc[i].name + '</span>、';
			} else {
				toccArray += '<span class="createToCc_name">' + tocc[i].name + '</span>、';
			}
		}
		if (toccArray.length > 0) {
			toccArray = toccArray.substr(0, toccArray.length - 1);
		}
	}
	var count_read = noteInfo.count_read || 0;
	var count_all = noteInfo.count_all || 0;
	var rtf_content = noteInfo.rtf_content || "";
	rtf_content = zss_editor.matchPreview(rtf_content, w, isBasicEdu);
	var dhtml = '';
	var ariaTime = sendTime.length > 11 ? sendTime.substring(0, 4) + "年" + sendTime.substring(5, 7) + "月" + sendTime.substring(8, 10) + "日" + sendTime.substring(11, 13) + "时" + sendTime.substring(14, 16) + "分" : sendTime.substring(0, 2) + "月" + sendTime.substring(3, 5) + "日" + sendTime.substring(6, 8) + "时" + sendTime.substring(9, 11) + "分"
	dhtml += '<div class="noticeHead_title" id="preview_notice_tit">' + title + '</div>';
	if (noteInfo.sourceType == 10000) {
		dhtml += '<div class="noticeItem noticeHead_System">' +
			'<span class="createTime">' + sendTime + '</span>';
		if (count_read <= 100000) {
			dhtml += '<span>' + zss_editor.noticeInfor.read + '<span>' + count_read + '</span></span>';
		} else {
			dhtml += '<span>' + zss_editor.noticeInfor.read + '<span>100000+</span></span>';
		}

		dhtml += '</div>';
	} else {
		dhtml += '<div role="option" class="noticeItem noticeHead_from">' +
			'<span style="margin: 0" aria-label="发件人' + createrName + '   时间' + ariaTime + '"></span><span aria-hidden="true"  class="createName blue" onclick="openClickEvent(\'BUTTON_USER\',\'\')">' + createrName + '</span><span aria-hidden="true" class="createTime">' + sendTime + '</span>' +
			'<span class="createEdit blue" id="createEdit" onclick="openClickEvent(\'BUTTON_EDIT\',\'\')"></span>' +
			'<span class="createRetract blue" id="createRetract" onclick="openClickEvent(\'BUTTON_RETRACT\',\'\')"></span>' +
			'<span class="createUnrad blue" id="createUnrad" onclick="openClickEvent(\'BUTTON_UNRAD\',\'\')"></span>' +
			'</div>';
		if (noteInfo.hasReceiver == 1) {
			if (receiverArray.length > 0) {
				dhtml += '<div class="noticeItem noticeHead_item"><div role="option" class="words2"><span class="createFrom">' + zss_editor.noticeInfor.to + '</span><span class="createTo">' + receiverArray + '</span></div></div>';
			}
			if (toccArray.length > 0) {
				dhtml += '<div  role="option"  class="noticeItem noticeHead_item"><span class="createFrom">' + zss_editor.noticeInfor.cc + '</span><span class="createTo">' + toccArray + '</span></div>';
			}
		}
		if (noteInfo.hasSendsign == 1 && count_all > 1) {
			dhtml += '<div role="option" class="noticeItem noticeHead_row"><span aria-label="已读' + count_all + '分之' + count_read + '"></span><span aria-hidden="true" class="createCount">' + zss_editor.noticeInfor.read + '</span><span aria-hidden="true" class="blue" onclick="openClickEvent(\'BUTTON_COUNT\',\'\')"><span  aria-hidden="true">' + count_read + '</span>';
			if (noteInfo.status != -1) {
				dhtml += '/<span aria-hidden="true">' + count_all + '</span>';
			}
			dhtml += '</span></div>';
		}
	}
	//学习通设置字体缩放
	var fontSizeClass = '';
	var type = noteInfo.zoomType;
	$("#preview_notice_me .noticeHead").eq(0).html(dhtml);
	if (isRefreshContent == 0) {
		var reg = new RegExp("font-size\\s{0,2}:\\s{0,2}\\d{1,2}px", "g");
		if (type == 0 || type == 1 || type == 2 || type == 3 || type == 4) {
			fontSizeClass = 'cxSize' + type;
			rtf_content = rtf_content.replace(reg, function () {
				return zss_editor.fontsizeZoomIn(arguments[0], type);
			});
		}
		$("#zss_editor_content").html(rtf_content);
		zss_editor.loadImg();
		//表格外面包裹div,实现固定宽度滑动查看表格2021.07.07
		$('table').each(function () {
			var _this = $(this);
			if (!$(this).parent().hasClass("table")) {
				_this.wrapAll('<div class="table"></div>');
			}
		})
		//老版本客户端站内信函收件人/抄送不支持显示群聊2021.04.28
		var ua = navigator.userAgent;
		ua = ua.substring(ua.indexOf("ChaoXingStudy"));
		ua = ua.substring(ua.indexOf("_") + 1);
		uaid = ua.substring(0, ua.indexOf("_"));
		var haschatGroupDivClass = false;
		if ($(".chatGroupDivClass").length > 0) {
			haschatGroupDivClass = true;
		}
		if (uaid == "3" && haschatGroupDivClass) {
			if (noteInfo.sourceType == 1000) {
				var tiphtml = '<div class="updateTip">此信函收件人未显示完整,请<a href="https://app.chaoxing.com/t">升级版本</a></div>';
			} else {
				var tiphtml = '<div class="updateTip">此通知收件人未显示完整,请<a href="https://app.chaoxing.com/t">升级版本</a></div>';
			}

			if ($(".updateTip").length == 0) {
				$("#preview_notice_me").append(tiphtml);
			}

		}
		//解决时间原站内信创建时间时差问题2021.08.31
		$('#preview_notice_me .createTime').each(function () {
			var _this = $(this);
			var dataTime = $(this).data("intime") || "";
			var time_text = _this.text();
			if (dataTime != "") {
				if (zss_editor.isnowYearByLong(dataTime)) {
					time_text = zss_editor.getFormatDateByLong(new Date(dataTime), "MM-dd hh:mm");
				} else {
					time_text = zss_editor.getFormatDateByLong(new Date(dataTime), "yyyy-MM-dd hh:mm");
				}
				_this.text(time_text);
			}
		})
	}
	//学习通设置字体缩放
	if (fontSizeClass != '') {
		$(".previewBox").addClass(fontSizeClass);
	}
	// 转发到笔记三行空行如果为空详情页不显示
	if ($(".focusStart").first().length > 0 && $(".focusStart").first().html().replace(/<br\s*\/?>/gi, "").replace(/\u200B/g, '').trim() == '' && $(".focusStart").first()[0] == $("#zss_editor_content").children().get(0)) {
		$(".focusStart").first().remove();
	}
	if ($(".record-box").first().prev().length > 0 && $(".record-box").first().prev().html().replace(/<br\s*\/?>/gi, "").replace(/\u200B/g, '').trim() == '' && $(".record-box").first().prev()[0] == $("#zss_editor_content").children().get(0)) {
		$(".record-box").first().prev().remove();
	}
	//兼容旧列表格式
	normaloldlist();
	//签名里的邮箱去掉超链接
	$('.signDiv .dynacALink').attr('href', 'javascript:void(0)').attr('class', '');
	//文本附件链接去掉链接跳转2021.04.16
	$("a.iframe").attr("addr", $(this).attr("href")).attr("href", "javascript:;");
	// 4.3.2.2版本以后点击人名打开个人信息页
	var version = null;
	//大于这个版本点击人名增加puid参数,客户端实现到人员信息界面
	var version2 = null;
	if (isIOS) {
		version = zss_editor.versionSame('4.3.2.2');
		version2 = zss_editor.versionSame('4.3.9.8');
	}
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		version = zss_editor.versionSame('4.3.3.6');
		version2 = zss_editor.versionSame('4.4.1.0');
	}
	if (version) {
		$('#preview_notice_me .createTo_name').off('click').on('click', function (e) {
			var dataId = $(this).data("id") || "";
			var pos = $('#preview_notice_me .createTo_name').index($(this));
			if (version2) {
				openReplyEvent("OPEN_INFOR", pos, dataId);
			} else {
				openClickEvent("OPEN_INFOR", pos);
			}

		});
		$('#preview_notice_me .createToCc_name').off('click').on('click', function (e) {
			var dataId = $(this).data("id") || "";
			var pos = $('#preview_notice_me .createToCc_name').index($(this));
			if (version2) {
				openReplyEvent("OPEN_INFORCC", pos, dataId);
			} else {
				openClickEvent("OPEN_INFORCC", pos);
			}

		});

	} else {
		// 收件人如果是小组可点击
		if (dataReceiverArray && dataReceiverArray.length == 1 && dataReceiverArray[0].type == 2 && noteInfo.send_sign == 1) {
			$("#preview_notice_me .createTo").addClass('blue')
			$('#preview_notice_me .createTo').off('click').on('click', function (e) {
				openClickEvent("OPEN_GROUP", "");
			});
		}
	}
	//点击发送人
	$('#notice_main .createName').off('click').on('click', function (e) {
		var liIndex = $(this).parents(".noticeLi").attr("data-index") || 0;
		var dataId = $(this).data("id") || "";
		if (version2) {
			openReplyEvent("OPEN_REPLY_SEND", liIndex, dataId);
		}
	});
	//点击详情页进入编辑页2020.10.14
	if (noteInfo.send_sign == 1) {
		//点击文字区域进入编辑页
		$('#zss_editor_content').off('click').on('click', function (event) {
			if (!$(event.target).is('img') && !$(event.target).is('.editor-image') && !$(event.target).is('iframe') && !$(event.target).is('a') && !$(event.target).is('.record-list-tit') && !$(event.target).is('.record-list-tit *') && !$(event.target).is('.noticeItem') && !$(event.target).is('.noticeItem *')) {
				var version = null;
				if (isIOS) {
					version = zss_editor.versionSame('4.2.5.3');
				}
				if (isAndroid && (typeof javaJs !== 'undefined')) {
					version = zss_editor.versionSame('4.2.6.4');
				}
				if (version) {
					var tmp = {};
					tmp.name = event.target.nodeName;
					tmp.index = $("#zss_editor_content").find($(event.target.nodeName)).index($(event.target));
					tmp.offsetX = event.offsetX;
					tmp.offsetY = event.offsetY;
					openfocusPos(JSON.stringify(tmp));
				} else {
					openClickEvent('BUTTON_EDIT', '');
				}


			}

		});
		//点击标题进入编辑页
		$('#preview_notice_tit').off('click').on('click', function (event) {
			openClickEvent('BUTTON_EDIT', '');
		});
	}
	var width = zss_editor.wWidth - 30;
	zss_editor.updateAllIframeWidth(width);
}
zss_editor.isnowYearByLong = function (l) {
	var py = new Date(l);
	var nowy = new Date();
	return (py.getFullYear() - nowy.getFullYear() == 0);
}
zss_editor.getFormatDateByLong = function (date, format) {
	if (date == undefined) {
		date = new Date();
	}
	if (format == undefined) {
		format = "yyyy-MM-dd hh:mm:ss";
	}
	var o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
				: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
zss_editor.setNoticeButton = function (buttonInfo) {
	if (zss_editor.isEnLanguage()) {
		zss_editor.noticeInfor.edit = "Edit";
		zss_editor.noticeInfor.reCall = "Recall";
		zss_editor.noticeInfor.reminder = "Reminder";
	}
	var wWidth = $(".noticeHead_from").width() - 10;
	var oWidth = $(".createTime").width() + 8;
	if (buttonInfo.hasEdit == 1) {
		$("#createEdit").text(zss_editor.noticeInfor.edit);
		oWidth += $("#createEdit").width() + 15;
	} else {
		$("#createEdit").text("");
	}
	if (buttonInfo.hasRetract == 1) {
		$("#createRetract").text(zss_editor.noticeInfor.reCall);
		oWidth += $("#createRetract").width() + 15;
	} else {
		$("#createRetract").text("");
	}
	if (buttonInfo.hasUnrad == 1) {
		$("#createUnrad").text(zss_editor.noticeInfor.reminder);
		oWidth += $("#createUnrad").width();
	} else {
		$("#createUnrad").text("");
	}

	$(".createName").css("max-width", wWidth - Math.ceil(oWidth) + "px");
}
// 详情页选区整个内容
zss_editor.getAllrange = function () {
	var range = document.createRange();
	var allCon = $('.previewBox')[0];
	// range.setStartBefore(allCon);
	// range.setEndAfter(allCon);
	range.selectNodeContents(allCon);
	zss_editor.currentSelection.setRange(range);
}
// 插入教案编辑页内容20200811
zss_editor.setTeachContent = function () {
	var html = '<div class="ulTab" id="ulTab" contenteditable="false"><div class="classul"><div class="cur_li"><p class="classBefore">课前</p></div><div><p class="classCenter">课中</p></div><div><p class="classAfter">课后</p></div></div></div><div class="classConBefore"><p>&#8203;<br></p></div><div class="classConCenter" style="display:none"><p><br></p></div><div class="classConAfter" style="display:none"><p><br></p></div>';
	$("#zss_editor_content").html(html);
	$("#ulTab").attr('contenteditable', false)
	var pack = $(".classConBefore")[0];
	$("#zss_editor_content").focus();
	var range = document.createRange();
	range.setStart(pack, 0);
	range.setEnd(pack, 0);
	zss_editor.currentSelection.setRange(range);
	zss_editor.undoManagerSave();
}
//插入模板笔记
zss_editor.insertMethod = function (data) {
	if (data.methodType == "method_class") {
		zss_editor.methodClass();
	}
	if (data.methodType == "method_live") {
		zss_editor.methodLive();
	}
	if (data.methodType == "method_meeting") {
		zss_editor.methodMeeting(data);
	}
	if (data.methodType == "method_dingding") {
		zss_editor.methodDingding();
	}
	if (data.methodType == "method_attachment") {
		zss_editor.methodAttachment(data);
	}
}
//插入通知
zss_editor.methodAttachment = function (data) {
	if (data.title) {
		$("#zss_editor_tit").html(data.title);
	}
	if (data.content) {
		zss_editor.insertHTML(data.content);
	}
	zss_editor.insertBlank();
	if (data.attachmentArr && data.attachmentArr.length > 0) {
		var dataArr = data.attachmentArr;
		for (var i = 0; i < dataArr.length; i++) {
			var data_data = !!dataArr ? dataArr[i] : '';
			var data_id = !!dataArr ? dataArr[i].cid : '';
			zss_editor.insertAnnex(data_data, data_id);
		}
	}

	if ($(".focusStart")[0]) {
		zss_editor.jumpBeforeNode($(".focusStart")[0]);
	}
}
//插入钉钉
zss_editor.methodDingding = function () {
	$("#zss_editor_tit").html("钉钉");
	var html = '<h3 element-id="4a7kn3rt">会议口令：</h3><p class="p1" element-id="97mvgnyu"><b><br/></b></p><p class="p1" element-id="97mvgnyu"><br/></p><h3 element-id="z1p2flji">通过会议口令入会</h3><p element-id="cjlm3y7i">进入钉钉首页，点击右上角「电话图标」，然后选择「输入口令，加入会议」，在弹出的页面输入会议口令即可加入视频会议。</p><div element-id="en2ol1at" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/origin/6b36fd921e775b61f9ddbe5ad3a766ab.png?rw=753&rh=754&_fileSize=422089&_orientation=1" objectid="6b36fd921e775b61f9ddbe5ad3a766ab" style="width: 800px;"/></div><p class="p2" element-id="e5xr81yh"><br/></p><p class="p2" element-id="m60z71h4"><br/></p><h3 element-id="m5nviywh">接受会议邀请入会</h3><div class="item-txt" element-id="7u0a9e2l">当收到别人的会议邀约时，可以选择「视频」或者「语音接听」。如果一时错过了会议邀约，也可以通过点击「消息」页面顶部的蓝条提示加入正在进行中的会议。</div><div element-id="6uolsr7h" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/origin/7ac4c441560e515dbf25aaa147215753.png?rw=743&rh=753&_fileSize=345237&_orientation=1" objectid="7ac4c441560e515dbf25aaa147215753" style="width: 743px;"/></div><p class="p2" element-id="lc2yxmsb"><br/></p><p class="p2" element-id="b7pu8m6i"><br/></p><h3 element-id="dobr8x3m">通过会议卡片入会</h3><div class="item-txt" element-id="8chmvk2g"><p element-id="upbwdj1k">在聊天窗口收到别人发来的会议卡片时，点击下方的「加入会议」即可加入视频会议。<br/></p><div element-id="cb382f06" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/1080_1080Q50/c91f7de3fc6dd29315229188e0874015.png?rw=754&rh=754&_fileSize=298690&_orientation=1" objectid="c91f7de3fc6dd29315229188e0874015" height="" style="width: 800px; opacity: 1;"/></div><p class="p2" element-id="zbwxs1jn"><br/></p></div>';
	$("#zss_editor_content").html(html);
	var pack = $(".p1")[0];
	$("#zss_editor_content").focus();
	var range = document.createRange();
	range.setStart(pack, 0);
	range.setEnd(pack, 0);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
	zss_editor.undoManagerSave();
}
//插入泛雅课堂
zss_editor.methodClass = function () {
	$("#zss_editor_tit").html("泛雅课堂");
	var html = '<p class="p1" element-id="k5eqctls" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">课堂邀请码：</b></p><p class="p1" element-id="2h6zkmwn" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;"><br/></b></p><p class="p1" element-id="ulhd7eik" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">课堂二维码：</b></p><p class="p1" element-id="whk02lnb" style="overflow-wrap: break-word;">​<br/></p><p class="p1" element-id="lkb0j1no" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">课堂链接：</b><br/></p><p class="p1" element-id="br3y4j5g" style="overflow-wrap: break-word;"><br/></p><p class="p1" element-id="1kf4rom7" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">通过邀请码进入课堂</b></p><p element-id="64et5w0m" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;"><b>手机端：</b>打开学习通，点击首页右上角邀请码，选择“邀请码”，输入邀请码后点击“确定”，进入泛雅课堂详情页后点击“加入课堂”，即可成功进入课堂。<br/></p><div element-id="bvkgdc4t" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/origin/4429dbaa735448b48d32588a9bd9a8e0.png?rw=3852&rh=2234&_fileSize=642509&_orientation=1" alt="4429dbaa735448b48d32588a9bd9a8e0.png" style="width: 800px;"/></div><p element-id="ytqh5udo" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;"><b>PC端：</b>打开泛雅课堂客户端，点击“加入”，输入邀请码，点击“加入”，即可成功进入课堂。<br/></p><div class="editor-image" element-id="hzpnk8uf" contenteditable="false" style="overflow-wrap: break-word; color: rgb(24, 30, 51);"><img src="http://p.ananas.chaoxing.com/star3/2630_1109Q50/05dafa76fa1d227c736f65357c8dd5f2.png?rw=2630&rh=1109&_fileSize=153631&_orientation=1" objectid="05dafa76fa1d227c736f65357c8dd5f2" height="" style="overflow-wrap: break-word; width: 800px; opacity: 1;"/></div><p element-id="ls2it10z" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;"><br/></p><div class="item-title-2" element-id="h9xslinr" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">通过二维码进入课堂</b></div><p element-id="9aou2q1j" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;">打开学习通，点击首页右上角邀请码，选择“扫一扫”，将扫描区对准收到的二维码，或点击“相册”选择相册中保存的课堂二维码，识别后进入课堂详情页，点击“加入课堂”，即可成功进入课堂。<br/></p><div element-id="ujdo8hsy" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/origin/9991caa10778b70f71c56ae105078c1a.png?rw=3852&rh=2234&_fileSize=2372926&_orientation=1" alt="9991caa10778b70f71c56ae105078c1a.png" style="width: 800px;"/></div><p element-id="cy6pi385" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;"><br/></p><p element-id="etofqrld" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">通过课堂链接进入课堂</b></p><p element-id="7b9ct5zr" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;">若您收到的邀请信息为链接形式，在学习通内打开链接，点击“加入课堂”，即可成功进入课堂。</p><div element-id="3t9mu0di" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/origin/bfa6c9019047d3b753698de1fe9fc6b6.png?rw=3852&rh=2234&_fileSize=558532&_orientation=1" alt="bfa6c9019047d3b753698de1fe9fc6b6.png" style="width: 800px;"/></div><p element-id="dsj3ich5"><br/></p>';
	$("#zss_editor_content").html(html);
	var pack = $(".p1")[1];
	$("#zss_editor_content").focus();
	var range = document.createRange();
	range.setStart(pack, 0);
	range.setEnd(pack, 0);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
	zss_editor.undoManagerSave();
}
//插超星直播
zss_editor.methodLive = function () {
	$("#zss_editor_tit").html("超星直播");
	var html = '<p class="p1" element-id="oi1ypjmw" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">直播邀请码：</b></p><p class="p1" element-id="fk7rso93" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;"><br/></b></p><p class="p1" element-id="oadu4biz" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">直播二维码：</b></p><p class="p1" element-id="9t5r2wsd" style="overflow-wrap: break-word;">​<br/></p><p class="p1" element-id="hn4iz7m3" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">直播链接：</b><br/></p><p class="p1" element-id="jqxrpwca" style="overflow-wrap: break-word;"><br/></p><p class="p1" element-id="enml2yr5" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">通过邀请码进入直播</b></p><p element-id="f8vcpjsw" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;">打开学习通，点击首页右上角邀请码，选择“邀请码”，输入邀请码，点击“确定”，进入直播详情页后点击“观看直播”，即可成功进入直播观看界面。<br/></p><div class="editor-image" element-id="0qzfwp6k" contenteditable="false" style="overflow-wrap: break-word; color: rgb(24, 30, 51);"><img src="http://p.ananas.chaoxing.com/star3/3852_2234Q50/1a8372ee0625b8958b22b7c5991c1eba.png?rw=3852&rh=2234&_fileSize=2420600&_orientation=1" objectid="1a8372ee0625b8958b22b7c5991c1eba" height="" style="overflow-wrap: break-word; width: 800px; opacity: 1;"/></div><p class="p2" element-id="14jgdh9b" style="overflow-wrap: break-word;"><br/></p><div class="item-title-2" element-id="yw543087" style="overflow-wrap: break-word;"><b style="overflow-wrap: break-word;">通过二维码进入直播</b></div><p element-id="30gotb7r" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;">打开学习通，点击首页右上角邀请码，选择“扫一扫”，将扫描区对准收到的二维码，或点击“相册”选择相册中保存的直播二维码，识别二维码后进入直播详情页，点击“观看直播”即可成功进入直播观看界面。<br/></p><div class="editor-image" element-id="14fznugv" contenteditable="false" style="overflow-wrap: break-word; color: rgb(24, 30, 51);"><img src="http://p.ananas.chaoxing.com/star3/3852_2234Q50/bc6378adf4c3c14aec8f94518de38990.png?rw=3852&rh=2234&_fileSize=4247715&_orientation=1" objectid="bc6378adf4c3c14aec8f94518de38990" height="" style="overflow-wrap: break-word; width: 800px; opacity: 1;"/></div><p element-id="ifjn65ey"><br/></p><p element-id="e4cy0o6m"><b>通过直播链接进入直播</b></p><p element-id="b6kvdgw5" style="overflow-wrap: break-word; color: rgb(24, 30, 51); text-align: start;">若您收到的邀请信息为链接形式，则可点击邀请链接直接进入直播进行观看。<br/></p><div class="editor-image" element-id="desp5mx1" contenteditable="false" style="overflow-wrap: break-word; color: rgb(24, 30, 51);"><img src="http://p.ananas.chaoxing.com/star3/3852_2234Q50/b8d9cc20e16796f4700bf65ddb224c84.png?rw=3852&rh=2234&_fileSize=2335897&_orientation=1" objectid="b8d9cc20e16796f4700bf65ddb224c84" height="" style="overflow-wrap: break-word; width: 800px; opacity: 1;"/></div><p element-id="9umkhowa"><br/></p>';
	$("#zss_editor_content").html(html);
	var pack = $(".p1")[1];
	$("#zss_editor_content").focus();
	var range = document.createRange();
	range.setStart(pack, 0);
	range.setEnd(pack, 0);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
	zss_editor.undoManagerSave();
}
//插入腾讯会议
zss_editor.methodMeeting = function (data) {
	$("#zss_editor_tit").html("腾讯会议");
	var html = '<p class="p1" element-id="08mb9fei"><b>会议号：</b></p><p class="p1" element-id="ub4jht5s"><b><br/></b></p><p class="p1" element-id="9udc7p20"><b>会议链接：</b></p><p class="p1" element-id="9kvibxz7">​<br/></p><p class="p1" element-id="sh2ivxef"><br/></p><p class="p1" element-id="n3eb6pjk"><b>通过会议号加入会议</b></p><p class="p2" element-id="vin4z6gp">打开腾讯会议，在腾讯会议主面板，选择”加入会议“，输入9位会议号，以及您希望在会议中显示的名字（默认使用您个人资料页的昵称），并勾选相应的入会前设置项，点击”加入会议“即可成功入会。</p><div element-id="s12t7moj" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/1080_545Q50/0ee865a5c60f8ba6ddb8d31d8137fd09.jpg?rw=860&rh=434&_fileSize=76490&_orientation=1" objectid="0ee865a5c60f8ba6ddb8d31d8137fd09" height="" style="width: 800px; opacity: 1; height: 403px;"/></div><p class="p2" element-id="ofz0kvy2"><br/></p><p class="p2" element-id="f7rldzyu"><br/></p><div class="item-title-2" element-id="14lt0b38"><b>通过链接加入会议</b></div><div class="item-txt" element-id="bijs0cou">如果您本地已安装腾讯会议，当您收到的邀请信息为链接形式，则可以点击邀请链接，验证身份后即可直接进入会议。</div><div element-id="27c6vp5x" class="editor-image" contenteditable="false"><img src="http://p.ananas.chaoxing.com/star3/1080_545Q50/0ee865a5c60f8ba6ddb8d31d8137fd09.jpg?rw=860&rh=434&_fileSize=76490&_orientation=1" objectid="0ee865a5c60f8ba6ddb8d31d8137fd09" height="" style="width: 800px; opacity: 1; height: 403px;"/></div><p class="p2" element-id="5ew9lip3"><br/></p>';
	$("#zss_editor_content").html(html);
	var pack = $(".p1")[1];
	if (data.meetingTitle) {
		$(".p1").eq(1).html(data.meetingTitle);
	}
	if (data.meetingLink) {
		$(".p1").eq(3).html(data.meetingLink);
	}
	$("#zss_editor_content").focus();
	var range = document.createRange();
	range.setStart(pack, 0);
	range.setEnd(pack, 0);
	zss_editor.currentSelection.setRange(range);
	zss_editor.backupRange();
	zss_editor.undoManagerSave();
}
zss_editor.sendPanelStatus = function () {
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		return JSON.stringify([[31, 47, 29, 24, 7, 35, 1, 5, 6, 15, 34, 44, 9, 10, 11, 12, 52, 18, 33, 3, 37], [10, 6, 12, 11, 5, 24, 1, 7, 15, 34, 44, 9, 35, 31, 47, 29, 52, 18, 33, 3, 37], [31, 47, 29, 24, 7, 35, 1, 5, 6, 15, 34, 44, 9, 10, 11, 12, 52, 18, 33, 3, 37]]);
	}

	return [[31, 47, 29, 24, 7, 35, 1, 5, 6, 15, 34, 44, 9, 10, 11, 12, 52, 18, 33, 3, 37], [10, 6, 12, 11, 5, 24, 1, 7, 15, 34, 44, 9, 35, 31, 47, 29, 52, 18, 33, 3, 37], [31, 47, 29, 24, 7, 35, 1, 5, 6, 15, 34, 44, 9, 10, 11, 12, 52, 18, 33, 3, 37]];
}
// 存储所有base64地址供导出用
// zss_editor.receiveBase64 = function(oldUrl,newUrl){
// 	map.set(oldUrl,newUrl)
// }
// // 导出的html所有img替换成base64
// zss_editor.convertImagesToBase64 = function(content) {
// 	// 图片转base64
// 	var newCon = document.createElement('div');
// 	newCon.id = 'tempCon';
//     // Safari 要求div必须有内容，才能粘贴内容进来
//     newCon.appendChild(document.createTextNode("\u200b"));
//     document.body.appendChild(newCon);
//     newCon.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:0;white-space:nowrap;top:0;opacity:0;";
// 	newCon.innerHTML = content;
// 	$("#tempCon .tag").remove();
//     $("#tempCon #readCount,#tempCon #deleteNote,#tempCon #reEditNote").remove();
// 	for (var i = 0, imgs = document.querySelectorAll('#tempCon #zss_editor_content .editor-image img'), pi; pi = imgs[i++];) {
//         if (pi) {
//         	var oldUrl = $(pi).attr("src");
//         	if(map.get(oldUrl)){
//         		var newUrl = map.get(oldUrl);
//         		$(pi).attr("src",newUrl);
//         		delete map[oldUrl]
//         	}
//         }
//     }
//     try {
//         newCon.parentNode.removeChild(newCon);
//     } catch (e) {
//     }
//     return newCon.innerHTML;
// }
// // 导出word
// zss_editor.htmlGetWord = function(){
// 	var title = $("#title").text().replace(new RegExp("​", 'g'),'');
// 	var date = zss_editor.getDate();
// 	if(title == ""){
// 		title = "笔记_"+date;
// 	}
// 	var content='<!DOCTYPE html>' + $(".previewBox").prop("outerHTML");
// 	try {
//         content = zss_editor.convertImagesToBase64(content);
//     } catch (e) {
//     }
// 	var converted = htmlDocx.asBlob(content, {
// 		orientation: 'Portrait'
// 	});
// 	var docName=title+'.docx';
// 	zss_editor.blobToDataURL(converted, function (dataurl) {
// 		zss_editor.wordSaveCloud(dataurl,docName);
// 	});
// 	//saveAs(converted, docName);
// }
zss_editor.getDate = function () {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
	var dateStr = year + "" + month + "" + day;
	return dateStr;
}
// // 把编码的二进制流和标题传给客户端上传到云盘
// zss_editor.wordSaveCloud = function(converted,docName){
//     //android
//     if (isAndroid && (typeof javaJs !== 'undefined')) {
//         javaJs.wordSaveCloud(converted,docName);
//     }
//     //ios
//     if (isIOS) {
//         if(window.webkit && window.webkit.messageHandlers.wordSaveCloud){
//             window.webkit.messageHandlers.wordSaveCloud.postMessage([converted,docName]);
//         }else{
//             if(window["wordSaveCloud"]){
//                window["wordSaveCloud"](converted,docName);
//             }
//         }
//     }
// };
// //Blob转为base64
// zss_editor.blobToDataURL = function(blob, callback) {

// 	var a = new FileReader();

// 	a.onload = function (e) { callback(e.target.result); }

// 	a.readAsDataURL(blob);

// }
// //base64转为Blob
// zss_editor.dataURLtoBlob = function(dataurl) {

// 	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],

// 	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

// 	while (n--) {

// 	u8arr[n] = bstr.charCodeAt(n);

// 	}

// 	return new Blob([u8arr], { type: mime });

// }
// 语言环境判断
zss_editor.languageData = function (data) {
	if (data.language == "en") {
		$("#zss_editor_tit").attr("placeholder", "Title");
		zss_editor.deleteInfor.text = "Cannot be restored after deleting！Be sure to delete?";
		zss_editor.deleteInfor.cancel = "Cancel";
		zss_editor.deleteInfor.delete = "Delete";
		zss_editor.deleteImage.text = "Picture cannot be recovered after deletion！Be sure to delete?";
		zss_editor.deleteImage.cancel = "Cancel";
		zss_editor.deleteImage.delete = "Delete";
		zss_editor.deleteTemplate.text = "Template cannot be recovered after deletion！Be sure to delete?";
		zss_editor.deleteTemplate.cancel = "Cancel";
		zss_editor.deleteTemplate.delete = "Delete";
	} else {
		$("#zss_editor_tit").attr("placeholder", "标题");
		zss_editor.deleteInfor.text = "删除后将无法恢复！确认删除？";
		zss_editor.deleteInfor.cancel = "取消";
		zss_editor.deleteInfor.delete = "删除";
		zss_editor.deleteImage.text = "图片删除后将无法恢复！确认删除？";
		zss_editor.deleteImage.cancel = "取消";
		zss_editor.deleteImage.delete = "删除";
		zss_editor.deleteTemplate.text = "模板删除后将无法恢复！确认删除？";
		zss_editor.deleteTemplate.cancel = "取消";
		zss_editor.deleteTemplate.delete = "删除";
	}
}
// 插入会议模板
zss_editor.insertTemplate = function (data) {
	zss_editor.restoreRange();
	zss_editor.insertHTML('\u200B');
	if (data.templateType == "temp_meeting") {
		zss_editor.templateMeeting();
	}
	if (data.templateType == "temp_attendClass") {
		zss_editor.templateAttendClass();
	}
	//zss_editor.jumpAfterTemplate();
}
zss_editor.jumpAfterTemplate = function () {
	zss_editor.restoreRange();
	var selection = window.getSelection();
	if (selection.rangeCount > 0) {
		var range = selection.getRangeAt(0);
		var node = $(range.startContainer);
		var pack;
		if (node.is('.template_class')) {
			pack = node;
		} else {
			pack = node.parents('.template_class');
		}
		if (pack.length > 0) {
			node = pack[0];
			range.setStartAfter(node);
			range.setEndAfter(node);
			pack = $("<p>&nbsp;</p>")[0];
			range.insertNode(pack);
			range.selectNodeContents(pack);
			range.collapse(false);
			zss_editor.currentSelection.setRange(range);
		}
	}
};
zss_editor.getTime = function () {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	var day = now.getDay();//得到周几
	var hour = now.getHours();//得到小时
	var minu = now.getMinutes();//得到分钟
	var sec = now.getSeconds();//得到秒
	var MS = now.getMilliseconds();//获取毫秒
	var week;
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	week = arr_week[day];
	var time = "";
	time = month + "-" + date + "" + " " + hour + ":" + minu;
	return time;
}
zss_editor.templateMeeting = function () {
	var title = $("#zss_editor_tit").text().replace(new RegExp("​", 'g'), '');
	var date = zss_editor.getDate();
	if (title == "") {
		title = "会议纪要_" + date;
		$("#zss_editor_tit").html(title);
	}
	var time = zss_editor.getTime();
	var html = '<table class="template_class template_meeting">' +
		'<thead>' +
		'<th colspan="2" class="template_tab_h">会议信息</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>时间</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p class="template_focus">' + time + '</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>地点</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>发起人</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>参会人</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>主持人</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>记录人</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'<thead>' +
		'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">议题1</span>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>讨论过程</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>结论</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>任务</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<div class="template_item">' +
		'<p>1.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<p>\u200b</p>' +
		'<div class="template_item">' +
		'<p>2.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<p>\u200b</p>' +
		'<div class="template_item">' +
		'<p>3.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>遗留问题</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<ol>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'</ol>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'<thead>' +
		'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">议题2</span>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>讨论过程</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>结论</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>任务</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<div class="template_item">' +
		'<p>1.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<p>\u200b</p>' +
		'<div class="template_item">' +
		'<p>2.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<p>\u200b</p>' +
		'<div class="template_item">' +
		'<p>3.</p>' +
		'<p>截止时间：</p>' +
		'<p>负责人：</p>' +
		'</div>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>遗留问题</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<ol>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'</ol>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'<p>\u200b</p>';
	zss_editor.insertHTML(html);
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	range.setStart($(".template_focus")[0], 0);
	range.setEnd($(".template_focus")[0], 0);
	range.selectNodeContents($(".template_focus")[0]);
	range.collapse(false);
	zss_editor.currentSelection.setRange(range);
	$(".template_focus").removeClass('template_focus');

}
zss_editor.templateAttendClass = function () {
	var title = $("#zss_editor_tit").text().replace(new RegExp("​", 'g'), '');
	var date = zss_editor.getDate();
	if (title == "") {
		title = "听课记录_" + date;
		$("#zss_editor_tit").html(title);
	}
	var time = zss_editor.getTime();
	var html = '<table class="template_class template_attendClass">' +
		'<thead>' +
		'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">课程信息</span>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>讲课教师</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p class="template_focus">\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>学校</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>班级</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>学科</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>课题</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>课程内容</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>时间</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>学生人数</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<p>\u200b</p>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'<thead>' +
		'<th colspan="2" class="template_tab_h template_opt"><span class="template_opt_h">听课记录</span>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</th>' +
		'</thead>' +
		'<tbody>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>教学过程</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<ol>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'</ol>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="template_tab_l">' +
		'<p>评议摘要</p>' +
		'</td>' +
		'<td class="template_tab_r">' +
		'<ol>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'<li class="template_tab_li"><p>\u200b</p></li>' +
		'</ol>' +
		'<div class="template_more_box">' +
		'<span class="template_more" contenteditable="false"></span>' +
		'<div class="template_more_con" contenteditable="false">' +
		'<span class="template_item_del"></span>' +
		'<span class="template_item_add"></span>' +
		'</div>' +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'<p>\u200b</p>';
	zss_editor.insertHTML(html);
	var selection = window.getSelection();
	var range = selection.getRangeAt(0);
	range.setStart($(".template_focus")[0], 0);
	range.setEnd($(".template_focus")[0], 0);
	zss_editor.currentSelection.setRange(range);
	$(".template_focus").removeClass('template_focus');

}
//通用编辑器2021.05
zss_editor.imgZoom = function (obj) {
	jsBridge.postNotification('CLIENT_PREVIEW_IMAGES', {
		"showIndex": 1,
		"imageUrls": [
			{
				"imageUrl": obj.imageUrl || "",
				"edit": 1,
				"originUrl": obj.originUrl || "",
				"resultType": 1,
				"getOriginSize": 0,
				"showReview": 0
			}
		]
	});
	jsBridge.bind('CLIENT_PREVIEW_IMAGES', function (object) {
		console.log(object)
	});

}
if (zss_editor.editorWebType == false) {
	window.addEventListener('message', function (e) {
		var data = e.data;
		if (!data) {
			return;
		}
		if (data.msgType == 'playMedia') {
			zss_editor.mediaPlay(data.mediaType, data.media);

		} else if (data.msgType == 'clickEvent') {
			zss_editor.attachmentClickUtils(data.attachment);
		} else if (data.msgType == "showiframeClose") {
			var cid = data.cid || "";
			if (cid != "") {
				zss_editor.isiframeClose(cid);
			}

		} else if (data.msgType == "deleteIframe") {
			var cid = data.cid || "";
			if (cid != "") {
				zss_editor.oniframeClose(cid);
			}

		} else if (data.msgType == "changeIframeHeight") {
			var cid = data.cid || "";
			var height = data.height || "";
			if (cid != "" && height != "") {
				changeIframeHeight(cid, height);
			}

		} else if (data.msgType == "showvoiceIcon") {
			var cid = data.cid || "";
			if (cid != "") {
				zss_editor.isvoiceIcon(cid)
			}

		} else if (data.msgType == "revoiceTit") {
			if (data.attachment) {
				jsBridge.postNotification('CLIENT_EDITOR_CHANGE_MEDIA_TITLE', data.attachment);
				jsBridge.bind('CLIENT_EDITOR_CHANGE_MEDIA_TITLE', function (object) {
					var newTitle = object.title || "";
					var cid = object.cid || "";
					if (newTitle != "" && cid != "") {
						zss_editor.changevoiceTit(newTitle, cid);
					}

				});
			}

		} else if (data.msgType == "reuploadFile") {
			var obj = {};
			obj.cid = data.attachment.cid || "";
			obj.type = "";
			if (data.mediaType && data.mediaType == "audio") {
				obj.type = 2;
			} else if (data.mediaType && data.mediaType == "video") {
				obj.type = 3;
			}
			obj.data = data.attachment;
			jsBridge.postNotification('CLIENT_UPLOAD_MEDIA_DATA', obj);

		} else if (data.msgType == "videoPause") {
			var cid = data.attachment.cid || "";
			if (cid != "") {
				zss_editor.onvideoClose(cid);
			}
		}
	})
}

zss_editor.mediaPlay = function (mediaType, media) {
	if (mediaType == 'audio') {
		var id = media.cid;
		var newName = $("iframe[cid=" + id + "]").attr("name");
		try {
			newName = b64DecodeUnicode(newName);
		} catch (e) {

		}
		newName = JSON.parse(newName);
		var objectId = newName.att_voice.objectId2 || '';
		var fileTitle = newName.att_voice.fileTitle || '';
		//var cataName = fileTitle.substring(0, fileTitle.lastIndexOf("."));
		var url = media.att_voice.url || '';
		var list = new Array();
		var voice_ = {};
		voice_.mediaId = objectId; // objectId
		voice_.mediaTitle = fileTitle; // 文件名去掉后缀
		voice_.mediaInfoUrl = 'https://mooc1-api.rhky.com/ananas/audiostatus/' + objectId;
		list.push(voice_)

		if (zss_editor.recordVoiceSatus.hasOwnProperty("" + objectId + "")) {
			//播放过的掉控制播放状态协议
			if (zss_editor.recordVoiceSatus[objectId].playState == 1) {
				jsBridge.postNotification('CLIENT_AUDIO_CONTROL', {"mediaId": objectId, "controlConfig": {"playState": 0}});
			} else if (zss_editor.recordVoiceSatus[objectId].playState == 0) {
				jsBridge.postNotification('CLIENT_AUDIO_CONTROL', {"mediaId": objectId, "controlConfig": {"playState": 1}});
			}
		} else {
			//暂停所有音频,去掉动画,存储对象清空
			for (var key in zss_editor.recordVoiceSatus) {
				jsBridge.postNotification('CLIENT_AUDIO_CONTROL', {"mediaId": key, "controlConfig": {"playState": 0}});
				zss_editor.closeVoiceAnimate(zss_editor.recordVoiceSatus[key].cid);
			}
			zss_editor.recordVoiceSatus = {};
			//从头开始播放
			zss_editor.recordVoiceSatus[objectId] = {};
			var voiceid = zss_editor.recordVoiceSatus[objectId];
			voiceid.cid = media.cid;
			jsBridge.postNotification('CLIENT_AUDIO_PLAYER', {
				"sourceConfig": {
					"weblink": url
				},
				"sourceType": 1,
				"title": fileTitle,
				"activeIndex": 0, // 当前播放下标
				"list": list
			});
		}
		//监听播放状态
		jsBridge.postNotification('CLIENT_AUDIO_STATE', {});
	} else if (mediaType == 'video') {
		var id = media.cid;
		var newName = $("iframe[cid=" + id + "]").attr("name");
		try {
			newName = b64DecodeUnicode(newName);
		} catch (e) {

		}
		newName = JSON.parse(newName);
		var objectId = newName.att_video.objectId2 || '';
		if (objectId != "") {
			var url = "https://noteyd.chaoxing.com/screen/note_note/files/status/" + objectId + "?isMedia=true";
			$.getJSON(url, function (data) {
				if (undefined == data || data == '') return;
				var dataurl = data.url || "";
				if (dataurl != "") {
					//creat_video(data.url);
					zss_editor.openVideoUrl(id, dataurl)
				} else {
					console.log('文件转码中，请稍后再试');
				}

			})
		}
	}
}
zss_editor.attachmentClickUtils = function (attachment) {
	if (!attachment) {
		return;
	}
	var attachmentType = attachment.attachmentType;
	if (undefined == attachmentType || attachmentType == "") {
		return;
	}
	if (typeof teachingPlanEditEvent == 'function') {
		teachingPlanEditEvent(attachment);
		return;
	}
	switch (attachmentType) {
		case 2:
			var cid = attachment.att_note.cid || "";
			var uid = attachment.att_note.creatorId || "";
			jsBridge.postNotification('CLIENT_OPEN_NOTE_DETAIL', {"uid": uid, "noteCid": cid});
			break;
		default:
			jsBridge.postNotification('CLIENT_OPEN_ATTACHMENT', attachment);
			break;
	}
}

//无障碍: 根据客户端传的cid聚焦iframe
zss_editor.focusIframe = function focusIframe(cid) {
	var iframe = document.querySelector('iframe[cid="' + cid + '"]').contentWindow
	iframe.postMessage('audioFocus', '*')
}

function intToRoman(num) {
	var result = "";
	if (num >= 1000) {
		result = repeatC('m', Math.floor(num / 1000));
		num %= 1000;
	}
	if (num >= 100) {
		result += generBase(Math.floor(num / 100), ['c', 'd', 'm']);
		num %= 100;
	}
	if (num >= 10) {
		result += generBase(Math.floor(num / 10), ['x', 'l', 'c']);
		num %= 10;
	}
	if (num >= 1) {
		result += generBase(Math.floor(num), ['i', 'v', 'x']);
	}
	return result;
}

function generBase(num, arr) {
	var result = "";
	if (num >= 1 && num <= 3) {
		result = repeatC(arr[0], num);
	}
	if (num === 4) {
		result = arr[0] + '' + arr[1];
	}
	if (num >= 5 && num <= 8) {
		result = arr[1] + '' + repeatC(arr[0], num - 5);
	}
	if (num === 9) {
		result = arr[0] + "" + arr[2];
	}
	return result;
}

function repeatC(char, count) {
	var result = "";
	for (var i = 0; i < count; i++) {
		result += char;
	}
	return result;
}

//小写罗马数字转数字
function romanToInt(s) {
	//定义一个对象来存放数据
	var map = {'i': 1, 'v': 5, 'x': 10, 'l': 50, 'c': 100, 'd': 500, 'm': 1000};
	//罗马数分割成数组
	var sArr = s.split('');
	//总数
	var sum = 0;
	for (var i = 0; i < sArr.length; i++) {
		//sArr[i]拿到的是key，只要比较前一个比后一个小就行，大的话相减，并且这个时候，i+1已经不用计算了，我们可以把i+1，跳过下一个数字的比对操作
		var value = map[sArr[i]]
		if (value < map[sArr[i + 1]]) {
			value = map[sArr[i + 1]] - value;
			i++;
		}
		sum += value;
	}
	return sum;
}

//整数转字母
function intToAlpha(num) {
	var str = "";
	while (num > 0) {
		var m = num % 26;
		if (m == 0) {
			m = 26;
		}
		str = String.fromCharCode(m + 96) + str;
		num = (num - m) / 26;
	}
	return str;
}

function alphaToInt(str) {
	var n = 0;
	var s = str.match(/./g);//求出字符数组
	var j = 0;
	for (var i = str.length - 1, j = 1; i >= 0; i--, j *= 26) {
		var c = s[i].toLowerCase();
		if (c < 'a' || c > 'z') {
			return 0;
		}
		n += (c.charCodeAt(0) - 96) * j;
	}
	return n;
}

//列表序号转整数
function serialnumToInt(serialstr, level) {
	var serialnum;
	level = parseInt(level);
	if (level % 3 == 0) {
		serialnum = romanToInt(serialstr);
	} else if (level % 3 == 1) {
		serialnum = parseInt(serialstr);
	} else {
		serialnum = alphaToInt(serialstr);
	}
	return serialnum;
}

//列表序号转字符串
function serialnumToString(serialnum, level) {
	var serialstr;
	level = parseInt(level);
	if (level % 3 == 0) {
		serialstr = intToRoman(serialnum);
	} else if (level % 3 == 1) {
		serialstr = serialnum.toString();
	} else {
		serialstr = intToAlpha(serialnum);
	}
	return serialstr;
}

//列表序号加1
function addSerialNum(serialstr, level) {
	var serialnum;
	serialnum = serialnumToInt(serialstr, level);
	serialnum++;
	serialstr = serialnumToString(serialnum, level);
	return serialstr;
}

//列表序号减1
function minusSerialNum(serialstr, level) {
	var serialnum;
	serialnum = serialnumToInt(serialstr, level);
	if (serialnum > 1) {
		serialnum--;
	}
	serialstr = serialnumToString(serialnum, level);
	return serialstr;
}

//旧格式的列表变新格式列表
function normaloldlist() {
	$('#zss_editor_content ol:not([level]),#zss_editor_content ul:not([level])').each(function (index, list) {
		$(this).removeAttr('class').removeAttr('style');
		if ($(list).parents('ol,ul').eq(0).parents('#zss_editor_content').length > 0 && $(list).parents('ol,ul').length > 0) {
			var listnext = list.nextSibling;
			$(list).attr('level', 1 + parseInt($(list).parents('ol,ul').eq(0).attr('level')));
			zss_editor.breakParent(list, $(list).parents('ol,ul')[0]);
			if (listnext) {
				list.nextSibling.remove();
			}
			if (list.nextSibling && list.nextSibling.firstChild && !list.nextSibling.firstChild.firstChild) {
				list.nextSibling.firstChild.remove();
			}
			if (list.nextSibling && !list.nextSibling.firstChild) {
				list.nextSibling.remove();
			}
		}
		if (!$(this).attr('level')) {
			$(list).attr('level', '1');
			if (list.tagName == 'OL') {
				$(list).attr('serialnum', '1').attr('data-origin-start', '1');
			}
		}
		if ($(list).parents('ol,ul').eq(0).parents('#zss_editor_content').length > 0 && $(this).parents('ol,ul').length > 0) {
			$(list).attr('level', 1 + parseInt($(list).parents('ol,ul').eq(0).attr('level')));
		}
		var level = $(list).attr('level');
		$(list).children('li').each(function (index, li) {
			var serialnum = serialnumToString(index + 1, level);
			$(li).parent().attr('level', level);
			if (list.tagName == 'OL') {
				$(li).attr('serialnum', serialnum);
			}
		});
		var listnext = list.nextSibling;
		$(list).children('li').each(function (index, li) {
			if (index > 0) {
				var newlist = document.createElement(list.tagName);
				//2022.05.11协同编辑加elementid
				newlist.setAttribute('element-id', zss_editor.getRandomId());
				if (list.tagName == 'OL') {
					$(newlist).attr('serialnum', li.getAttribute('serialnum'));
				}
				$(newlist).attr('level', level);
				if (listnext) {
					list.parentNode.insertBefore(newlist, listnext);
				} else {
					list.parentNode.appendChild(newlist);
				}
				newlist.appendChild(li);
			} else {
				if (list.tagName == 'OL') {
					$(list).attr('serialnum', li.getAttribute('serialnum'));
				}
				$(list).attr('level', level);
			}

		})
	});
}

//列表级别减1
function listoudent(range) {
	var li = zss_editor.findParent(range.startContainer, function (node) {
		return node.tagName == 'LI'
	}, true);
	var list = zss_editor.findParent(range.startContainer, function (node) {
		return node.tagName == 'OL' || node.tagName == 'UL'
	}, true);
	if (range.collapsed && li && list) {
		var level = parseInt(list.getAttribute('level'));
		if (level < 6) {
			list.setAttribute('level', --level);
			if (list.tagName == 'OL') {
				outdentlist(list);
			}
		}
	}
}

function indentlist(list) {
	var level = parseInt(list.getAttribute('level'));
	var startlevel = level - 1;
	var startserialnum = serialnumToInt(list.getAttribute('serialnum'), startlevel);
	setNewSerialnum(list, level);
	var listnext = list.nextSibling;
	while (listnext) {
		if (listnext.tagName == 'OL' && parseInt(listnext.getAttribute('level'))) {
			var nextlevel = parseInt(listnext.getAttribute('level'));
			var nextserialnum = listnext.getAttribute('serialnum');
			nextserialnum = serialnumToInt(nextserialnum, nextlevel);
			if (nextlevel == (level - 1) && nextserialnum == startserialnum + 1) {
				//列表缩进前下面有同级列表
				listnext.setAttribute('serialnum', minusSerialNum(listnext.getAttribute('serialnum'), nextlevel));
				listnext.firstChild.setAttribute('serialnum', listnext.getAttribute('serialnum'));
				break;
			} else if (nextlevel == level) {
				//列表缩进后有同级页面
				if (listnext.getAttribute('data-origin-start')) {
					listnext.removeAttribute('data-origin-start');
				}
				listnext.setAttribute('serialnum', addSerialNum(listnext.getAttribute('serialnum'), nextlevel));
				listnext.firstChild.setAttribute('serialnum', listnext.getAttribute('serialnum'));
			} else if (nextlevel < level) {
				break;
			}
		}
		listnext = listnext.nextSibling;
	}
	normalList();
}

function outdentlist(list) {
	var level = parseInt(list.getAttribute('level'));
	var startlevel = level + 1;
	var startserialnum = serialnumToInt(list.getAttribute('serialnum'), startlevel);
	setNewSerialnum(list, level);
	var listnext = list.nextSibling;
	while (listnext) {
		if (listnext.tagName == 'OL' && parseInt(listnext.getAttribute('level'))) {
			var nextlevel = parseInt(listnext.getAttribute('level'));
			var nextserialnum = listnext.getAttribute('serialnum');
			nextserialnum = serialnumToInt(nextserialnum, nextlevel);
			if (nextlevel == (level + 1) && nextserialnum == startserialnum + 1) {
				//列表缩进前下面有同级列表
				listnext.setAttribute('serialnum', serialnumToString(1, nextlevel));
				listnext.firstChild.setAttribute('serialnum', serialnumToString(1, nextlevel));
				listnext.setAttribute('data-origin-start', '1');
				break;
			} else if (nextlevel == level) {
				//列表缩进后有同级页面
				if (listnext.getAttribute('data-origin-start')) {
					listnext.removeAttribute('data-origin-start');
				}
				listnext.setAttribute('serialnum', addSerialNum(listnext.getAttribute('serialnum'), nextlevel));
				listnext.firstChild.setAttribute('serialnum', listnext.getAttribute('serialnum'));
				break;
			} else if (nextlevel < level) {
				break;
			}
		}
		listnext = listnext.nextSibling;
	}
	normalList();
}

function setNewSerialnum(list, level) {
	var listprev = list.previousSibling;
	if (!listprev) {//没有找到前一个
		list.setAttribute('data-origin-start', '1');
	}
	var serialnum = 1;
	//前一个是否有缩进后同级的列表，如果有，序号修改
	while (listprev) {
		if (listprev && listprev.firstChild && listprev.tagName == list.tagName && listprev.getAttribute('level') == list.getAttribute('level')) {
			if (listprev.getAttribute('serialnum')) {
				serialnum = serialnumToInt(listprev.getAttribute('serialnum'), level);
				serialnum++;
				break;
			}
		} else if (listprev.getAttribute('level') < list.getAttribute('level')) {
			break;
		}
		listprev = listprev.previousSibling;
	}
	var serialstr = serialnumToString(serialnum, level);
	list.setAttribute('serialnum', serialstr);
	list.firstChild.setAttribute('serialnum', serialstr);
	if (serialnum == 1) {
		list.setAttribute('data-origin-start', '1');
	} else {
		list.removeAttribute('data-origin-start');
	}
}

function normalList() {
	if (window.getSelection().rangeCount > 0) {
		var bk = zss_editor.createBookmark(true);
	}
	zss_editor.removeNullList();
	//ul下有多个li的情况
	$('#zss_editor_content ol,#zss_editor_content ul').each(function (index, list) {
		if (list.childNodes.length > 1) {
			var firstli = list.firstChild;
			var listnext = list.nextSibling;
			if (!firstli) {
				list.remove();
				return;
			}
			while (firstli.nextSibling) {
				var nextLi = firstli.nextSibling;
				var newlist = document.createElement(list.tagName);
				//2022.05.11协同编辑加elementid
				newlist.setAttribute('element-id', zss_editor.getRandomId());
				if (list.tagName.toLowerCase() == 'ol') {
					//2021.06.01 li后面是文本节点
					if (nextLi.nodeType == 3 || (nextLi.nodeType == 1 && !zss_editor.isBlockElm(nextLi))) {
						var newLi = document.createElement('li');
						var p = document.createElement('p');
						p.setAttribute('element-id', zss_editor.getRandomId());
						p.appendChild(nextLi);
						newLi.appendChild(p);
						while (nextLi.nextsiblings && (nextLi.nextsiblings.nodeType == 3 || (nextLi.nextsiblings.nodeTpye == 1 && !zss_editor.isBlockElm(nextLi.nextsiblings)))) {
							if (nextLi.nextsiblings.nodeName == 'BR') {
								nextLi.nextsiblings.remove();
							} else {
								p.appendChild(nextLi.nextsiblings);
							}

						}
						nextLi = newLi;
					}
				}
				newlist.appendChild(nextLi);
				if (listnext) {
					list.parentNode.insertBefore(newlist, listnext);
				} else {
					list.parentNode.appendChild(newlist)
				}
				newlist.setAttribute('level', list.getAttribute('level'));
			}
		}
	})
	$('#zss_editor_content ol,#zss_editor_content ul').each(function (index, list) {
		var firstli = list.firstChild;
		if (!firstli) {
			list.remove();
			return;
		}
		var firstnode = firstli.firstChild;
		if (!firstnode) {
			list.remove();
			return;
		}
		//处理列表下第一个元素的异常情况
		if (firstnode.nodeType == 3 || (firstnode.nodeType == 1 && !zss_editor.isBlockElm(firstnode))) { //li第一个元素是文本
			var p = document.createElement('p');
			p.setAttribute('element-id', zss_editor.getRandomId());
			p.appendChild(firstnode);
			firstli.prepend(p);
			while (p.nextsiblings && (p.nextsiblings.nodeType == 3 || (p.nextsiblings.nodeTpye == 1 && !zss_editor.isBlockElm(p.nextsiblings)))) {
				p.appendChild(p.nextsiblings);
			}
		} else if (firstnode.nodeType == 1 && zss_editor.isBlockElm(firstnode) && !firstnode.firstChild) {//li第一个元素是空块状元素
			firstnode.remove();
		} else if (zss_editor.isBlockElm(firstnode) && firstnode.firstChild && zss_editor.isBlockElm(firstnode.firstChild)) {//li第一个元素是p套p,预防p套p的问题
			if (!firstnode.firstChild.firstChild) {
				firstnode.firstChild.remove();
			}
			if (firstnode.firstChild && zss_editor.isBlockElm(firstnode.firstChild)) {
				firstli.prepend(firstnode.firstChild);
			}
		} else if (firstnode.innerText.trim() != '' && firstnode.innerText.trim() != fillChar) {
			//第一个p文字内容不为空时,去除第一个p内容最前面的8203,解决输入长英文掉下去的问题
			var firsttext = firstnode.firstChild;
			while (firsttext.firstChild) {
				if (firsttext.nodeType == 3 && firsttext.nodeValue != '') {
					break;
				} else if (firsttext.nodeType == 1) {
					firsttext = firsttext.firstChild;
				}
			}
			if (firsttext && firsttext.nodeType == 3 && (zss_editor.isFillChar(firsttext) || firsttext.nodeValue.substr(0, 1) == fillChar)) {
//				var bk = zss_editor.createBookmark(true);
				if (zss_editor.isFillChar(firsttext)) {
					firsttext.remove();
				} else if (firsttext.nodeValue.substr(0, 1) == fillChar) {
					firsttext.nodeValue = firsttext.nodeValue.replace("​", '');
				}
//				zss_editor.moveToBookmark(bk);
			}
		}

		var listnext = list.nextSibling;
		var serialnum = 1, serialstr = '1';

		var level = parseInt(list.getAttribute('level')) || 1;

		if (list.tagName.toLowerCase() == 'ol') {
			if (!firstli.getAttribute('serialnum')) {
				firstli.setAttribute('serialnum', serialstr);
				list.setAttribute('serialnum', serialstr);
				if (!list.getAttribute('level')) {
					list.setAttribute('data-origin-start', '1');
				}
			} else {
				serialstr = firstli.getAttribute('serialnum');
			}
			serialnum = serialnumToInt(serialstr, level);
		}
		if (!list.getAttribute('level') && $(list).parents('li').length == 0) {
			list.setAttribute('level', 1);
		}
		//序号颜色大小根据文字大小改变
		var fontweight = 600;
		var firsttag = list.firstChild.firstChild;
		list.firstChild.style.backgroundColor = '';
		while (firsttag) {
			if (firsttag.nodeType == 1 && firsttag.nodeName == "SPAN" && firsttag.id.indexOf('bookmark') > -1) {
				firsttag = firsttag.nextSibling;
			} else if (firsttag.nodeType == 1 && firsttag.nodeName == "SPAN" && firsttag.style.cssText != "") {
				//list.firstChild.style.cssText += firsttag.style.cssText;
				zss_editor.getSomeStyle(list.firstChild, firsttag.style.cssText);
				$(list.firstChild).css({'background': ''});
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 1 && firsttag.nodeName == 'H1') {
				list.firstChild.style.cssText += 'font-size:25px;font-weight:' + fontweight;
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 1 && firsttag.nodeName == 'H2') {
				list.firstChild.style.cssText += 'font-size:21px;font-weight:' + fontweight;
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 1 && firsttag.nodeName == 'H3') {
				list.firstChild.style.cssText += 'font-size:19px;font-weight:' + fontweight;
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 1 && firsttag.nodeName == 'H4') {
				list.firstChild.style.cssText += 'font-size:17px;font-weight:' + fontweight;
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 1 && zss_editor.isBlockElm(firsttag)) {
				list.firstChild.style.fontSize = '';
				list.firstChild.style.color = '';
				$(list.firstChild).children().css({'font-size': '', 'color': ''});
				firsttag = firsttag.firstChild;
			} else if (firsttag.nodeType == 3 && zss_editor.isFillChar(firsttag)) {
				firsttag = firsttag.nextSibling;
			} else if (firsttag.nodeType == 3 || firsttag.nodeName == 'BR') {
				break;
			} else {
				firsttag = firsttag.firstChild;
			}
		}
		if (list.getAttribute('data-start') || list.getAttribute('data-origin-start')) {
			while (listnext) {
				if (listnext.nodeType == 1 && listnext.getAttribute('level')) {
					if ((listnext.getAttribute('data-start') || listnext.getAttribute('data-origin-start')) && listnext.getAttribute('level') == list.getAttribute('level')) {
						break;
					} else if (listnext.getAttribute('level') < list.getAttribute('level')) {
						break;
					} else if (listnext && listnext.tagName && listnext.tagName.toLowerCase() == 'ol' && listnext.firstChild && listnext.getAttribute('level') == list.getAttribute('level') && listnext.tagName == list.tagName) {
						++serialnum;
						var serialstr = serialnumToString(serialnum, level);
						listnext.removeAttribute('data-origin-start');
						listnext.setAttribute('serialnum', serialstr);
						listnext.firstChild.setAttribute('serialnum', serialstr);
					}
				}
				listnext = listnext.nextSibling;
			}
		}
	});
	//给有大小颜色的li下的块状子元素添加原始样式,保证后面没有大小颜色的文字样式不被改变
	$('#zss_editor_content li').children().each(function (index, node) {
		if (node.parentNode.style.cssText != '' && zss_editor.isBlockElm(node) && $(node).text().trim() != '' && node.firstChild) {
			if (node.parentNode.style.cssText.indexOf('font-size') > -1 && node.tagName.indexOf('H') == -1) { //不是标题
				if ($(node).parents('#zss_editor_content table').length == -1) {
					$(node).css({'font-size': $('#zss_editor_content').css('font-size')});
				} else {
					$(node).css({'font-size': $(node).parents('#zss_editor_content table').css('font-size')});
				}
			}
			if (node.parentNode.style.cssText.indexOf('color') > -1) {
				$(node).css({'color': '#333333'});
			}
			if (node.style.lineHeight) {
				node.style.lineHeight = '';
			}
		}
	})
	if (bk) {
		zss_editor.moveToBookmark(bk);
	}
}
function getClientVersion(key) {
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
					ua = ua_array[7];
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
}
//增加合集
function setHeji(name, logo, isVisible) {
	// zss_editor.compilations = {
	// 	name: '',
	// 	logo: '',
	// 	isVisible: ''
	// };
	// $('#addSubjectBtn,#collectionAdd,#collectionInfo').addClass('hide');
	// if (isVisible) {
	// 	if(isVisible && getClientVersion('apiVersion') > '231'){
	// 		//合集按钮改为加入专题按钮
	// 		$('#addSubjectBtn').removeClass('hide')
	// 	}else	if (((name && name.length > 0)) || (logo && logo != 'null' && logo.length > 0)) {
	// 		$('#collectionInfo').find('span').text(name);
	// 		zss_editor.compilations.name = name;
	// 		zss_editor.compilations.isVisible = isVisible;
	// 		if (logo && logo != 'null' && logo.length > 0) {
	// 			$('#collectionInfo').find('img').attr('src', logo);
	// 			zss_editor.compilations.logo = logo;
	// 		} else {
	// 			$('#collectionInfo').find('img').attr('src', './images/default-cover.png');
	// 			zss_editor.compilations.logo = '';
	// 		}
	// 		$('#collectionInfo').removeClass('hide');
	// 	} else {
	// 		$('#collectionAdd').removeClass('hide');
	// 	}
	// }
}

zss_editor.addNoteHeji = function () {
	//android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.addNoteHeji();
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.addNoteHeji) {
			window.webkit.messageHandlers.addNoteHeji.postMessage([]);
		} else {
			if (window["addNoteHeji"]) {
				window["addNoteHeji"]();
			}
		}
	}
}
//新版协作笔记转化老笔记格式
var dateToisPc = false;
/*协作笔记转化老笔记 通用方法 begin*/
var dateToOld = {
	yjsToHtmlStr: function () {
	},
	createNode: function () {
	},
	renderSpec: function () {
	},
	b64DecodeUnicode: function () {
	},
};
dateToOld.b64DecodeUnicode = function (str) {
	return decodeURIComponent(atob(str))
}
dateToOld.renderSpec = function (doc, structure, xmlNS) {
	if (xmlNS === void 0) xmlNS = null;
	if (typeof structure == "string") {
		return {
			dom: doc.createTextNode(structure)
		};
	}
	if (structure.nodeType != null) {
		return {
			dom: structure
		};
	}
	if (structure.dom && structure.dom.nodeType != null) {
		return structure;
	}
	var tagName = structure[0],
		space = tagName.indexOf(" ");
	if (space > 0) {
		xmlNS = tagName.slice(0, space);
		tagName = tagName.slice(space + 1);
	}
	var contentDOM = null,
		dom = xmlNS ? doc.createElementNS(xmlNS, tagName) : doc.createElement(tagName);
	var attrs = structure[1],
		start = 1;
	if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
		start = 2;
		for (var name in attrs) {
			if (attrs[name] != null) {
				var space$1 = name.indexOf(" ");
				if (space$1 > 0) {
					dom.setAttributeNS(name.slice(0, space$1), name.slice(space$1 + 1), attrs[name]);
				} else {
					dom.setAttribute(name.trim(), attrs[name]);
				}
			}
		}
	}
	for (var i = start; i < structure.length; i++) {
		var child = structure[i];
		if (child === 0) {
			if (i < structure.length - 1 || i > start) {
				throw new RangeError("Content hole must be the only child of its parent node");
			}
			return {
				dom: dom,
				contentDOM: dom
			};
		} else {
			var ref = dateToOld.renderSpec(doc, child, xmlNS);
			var inner = ref.dom;
			var innerContent = ref.contentDOM;
			dom.appendChild(inner);
			if (innerContent) {
				if (contentDOM) {
					throw new RangeError("Multiple content holes");
				}
				contentDOM = innerContent;
			}
		}
	}
	return {
		dom: dom,
		contentDOM: contentDOM
	};
}
dateToOld.yjsToHtmlStr = function (content) {
	var eleReg = /<[^<>]+>/gi;
	var closeTag = []; //闭合标签栈
	var listNum = -1; //列表计数
	var level = 0; //列表级别
	var htmlstr = content.replace(eleReg, function () {
		var node = dateToOld.createNode(arguments[0]);
		node.attrs.ychange = null;
		if (arguments[0].indexOf('<imagewrap') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.attachment.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</imagewrap>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<image') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.image.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</image>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<img') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.image.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</img>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<paragraph') != -1) {
			arguments[0] = arguments[0].replace("paragraph", 'p')
			return arguments[0]
		} else if (arguments[0].indexOf('</paragraph>') != -1) {
			if (closeTag[closeTag.length - 1] == 'task') {
				closeTag.pop()
				return '</p></div></div>'
			} else {
				return '<br></p>';
			}
		} else if (arguments[0].indexOf('<blockquote') != -1) {
			return '<blockquote>';
		} else if (arguments[0].indexOf('</blockquote>') != -1) {
			return '</blockquote>';
		} else if (arguments[0].indexOf('<horizontal_rule') != -1) {
			return '<hr>';
		} else if (arguments[0].indexOf('</horizontal_rule>') != -1) {
			return '</hr>';
		} else if (arguments[0].indexOf('<heading') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.heading.toDOM(node));
			closeTag.push(dom.dom.outerHTML.slice(-5));
			return dom.dom.outerHTML.slice(0, -5);
		} else if (arguments[0].indexOf('</heading>') != -1) {
			return '<br>' + closeTag.pop();
		} else if (arguments[0].indexOf('<code_block') != -1) {
			return '<pre><code>';
		} else if (arguments[0].indexOf('</code_block>') != -1) {
			return '</pre></code>';
		} else if (arguments[0].indexOf('<attachment') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.attachment.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</attachment>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<folder') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.folder.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</folder>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<note') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.note.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</note>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<special_attachment') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.special_attachment.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</special_attachment>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<hard_break') != -1) {
			return '<br>';
		} else if (arguments[0].indexOf('</hard_break>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<placeholder') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.placeholder.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</placeholder>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<webiframe') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.webIframe.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</webiframe>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<hyperlink') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.hyperLink.toDOM(node));
			return dom.dom.outerHTML;
		} else if (arguments[0].indexOf('</hyperlink>') != -1) {
			return '';
		} else if (arguments[0].indexOf('<rcomment') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.rcomment.toDOM(node));
			return dom.dom.outerHTML.slice(0, -7);
		} else if (arguments[0].indexOf('</rcomment>') != -1) {
			return '</span>';
		} else if (arguments[0].indexOf('<fontcolor') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.fontcolor.toDOM(node));
			return dom.dom.outerHTML.slice(0, -7);
		} else if (arguments[0].indexOf('</fontcolor>') != -1) {
			return '</span>';
		} else if (arguments[0].indexOf('<bgcolor') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.bgcolor.toDOM(node));
			return dom.dom.outerHTML.slice(0, -7);
		} else if (arguments[0].indexOf('</bgcolor>') != -1) {
			return '</span>';
		} else if (arguments[0].indexOf('<fontsize') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.fontsize.toDOM(node));
			return dom.dom.outerHTML.slice(0, -7);
		} else if (arguments[0].indexOf('</fontsize>') != -1) {
			return '</span>';
		} else if (arguments[0].indexOf('<fontfamily') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.fontfamily.toDOM(node));
			return dom.dom.outerHTML.slice(0, -7);
		} else if (arguments[0].indexOf('</fontfamily>') != -1) {
			return '</span>';
		} else if (arguments[0].indexOf('<link') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, marks.link.toDOM(node));
			return dom.dom.outerHTML.slice(0, -4);
		} else if (arguments[0].indexOf('</link>') != -1) {
			return '</a>';
		} else if (arguments[0].indexOf('<emphasis') != -1) {
			return '<em class="sqp-emphasize-dot">';
		} else if (arguments[0].indexOf('</emphasis>') != -1) {
			return '</em>';
		} else if (arguments[0].indexOf('<em') != -1) {
			return '<i>';
		} else if (arguments[0].indexOf('</em>') != -1) {
			return '</i>';
		} else if (arguments[0].indexOf('<strong') != -1) {
			return '<b>';
		} else if (arguments[0].indexOf('</strong>') != -1) {
			return '</b>';
		} else if (arguments[0].indexOf('<underline') != -1) {
			return '<u>';
		} else if (arguments[0].indexOf('</underline>') != -1) {
			return '</u>';
		} else if (arguments[0].indexOf('<strike') != -1) {
			return '<strike>';
		} else if (arguments[0].indexOf('</strike>') != -1) {
			return '</strike>';
		} else if (arguments[0].indexOf('<ordered_list_new') != -1) {
			var attrs = arguments[0].split(' ')
			level = attrs[2].split('=')[1].slice(1, -1)
			listNum = attrs[4] ? attrs[4].slice(0, -2) : attrs[3].replace(/\D/g, '')
			return '<ol level="' + level + '">'
		} else if (arguments[0].indexOf('</ordered_list_new>') != -1) {
			listNum = -1
			level = 0
			return '</ol>'
		} else if (arguments[0].indexOf('<bullet_list_new') != -1) {
			var attrs = arguments[0].split(' ')
			level = attrs[1].split('=')[1].slice(1, -2)
			return '<ul level="' + level + '">'
		} else if (arguments[0].indexOf('</bullet_list_new>') != -1) {
			level = 0
			return '</ul>'
		} else if (arguments[0].indexOf('<list_item_new') != -1) {
			listNum++
			var showNum
			switch (level) {
				case '1':
				case '4':
					showNum = listNum;
					break;
				case '2':
				case '5':
					showNum = numberToLetter(listNum);
					break;
				case '3':
				case '6':
					showNum = numToRoman(listNum);
					break
			}
			return '<li serialnum="' + showNum + '">'
		} else if (arguments[0].indexOf('</list_item_new>') != -1) {
			return '</li>'
		} else if (arguments[0].indexOf('<bullet_list') != -1) {
			return '<ul>';
		} else if (arguments[0].indexOf('</bullet_list>') != -1) {
			return '</ul>';
		} else if (arguments[0].indexOf('<ordered_list') != -1) {
			return '<ol>';
		} else if (arguments[0].indexOf('</ordered_list>') != -1) {
			return '</ol>';
		} else if (arguments[0].indexOf('<list_item') != -1) {
			return '<li>';
		} else if (arguments[0].indexOf('</list_item>') != -1) {
			return '</li>';
		} else if (arguments[0].indexOf('<table_tbody') != -1) {
			return '<tbody>';
		} else if (arguments[0].indexOf('</table_tbody>') != -1) {
			return '</tbody>';
		} else if (arguments[0].indexOf('<table_colgroup') != -1) {
			return '<colgroup>';
		} else if (arguments[0].indexOf('</table_colgroup>') != -1) {
			return '</colgroup>';
		} else if (arguments[0].indexOf('<table_col') != -1) {
			let attr = arguments[0].split(' ')[1].slice(0, -1)
			return '<col ' + attr + '>';
		} else if (arguments[0].indexOf('</table_col>') != -1) {
			return '</col>';
		} else if (arguments[0].indexOf('<table_row') != -1) {
			return '<tr>';
		} else if (arguments[0].indexOf('</table_row>') != -1) {
			return '</tr>';
		} else if (arguments[0].indexOf('<th') != -1) {
			return '<th>';
		} else if (arguments[0].indexOf('</th>') != -1) {
			return '</th>';
		} else if (arguments[0].indexOf('<table_cell') != -1) {
			return '<td>';
		} else if (arguments[0].indexOf('</table_cell>') != -1) {
			return '</td>';
		} else if (arguments[0].indexOf('<table') != -1) {
			return '<table>';
		} else if (arguments[0].indexOf('</table>') != -1) {
			return '</table>';
		} else if (arguments[0].indexOf('<task_list') != -1) {
			let flag = arguments[0].includes('checked')
			return `<div class="todo-view ${flag ? 'checked' : ''}">
              <span class="todo-mark">
                <span class="todo-inner">
                </span>
              </span>
              <div class="todo-text">`;
		} else if (arguments[0].indexOf('</task_list>') != -1) {
			return '</div></div>';
		} else if (arguments[0].indexOf('<highlightblock') != -1) {
			arguments[0] = arguments[0].replace(/"/g, '').replace('>', '').replace('<', '');
			var dom = dateToOld.renderSpec(document, nodes.highlightBlock.toDOM(node));
			closeTag.push(dom.dom.outerHTML.slice(-12));
			return dom.dom.outerHTML.slice(0, -12);
		} else if (arguments[0].indexOf('</highlightblock>') != -1) {
			return closeTag.pop();
		} else {
			return '';
		}
	});
	return htmlstr;
};

// 数字转罗马
function numToRoman(num) {
	const romanNumerals = [
		{value: 1000, symbol: 'm'},
		{value: 900, symbol: 'cm'},
		{value: 500, symbol: 'd'},
		{value: 400, symbol: 'cd'},
		{value: 100, symbol: 'c'},
		{value: 90, symbol: 'xc'},
		{value: 50, symbol: 'l'},
		{value: 40, symbol: 'xl'},
		{value: 10, symbol: 'x'},
		{value: 9, symbol: 'ix'},
		{value: 5, symbol: 'v'},
		{value: 4, symbol: 'iv'},
		{value: 1, symbol: 'i'},
	];
	var result = '';
	for (var i = 0; i < romanNumerals.length; i++) {
		while (num >= romanNumerals[i].value) {
			result += romanNumerals[i].symbol;
			num -= romanNumerals[i].value;
		}
	}
	return result;
}

// 数字转字母
function numberToLetter(num) {
	var result = '';
	while (num > 0) {
		var remainder = (num - 1) % 26; // 获取最右边的数
		result = String.fromCharCode(97 + remainder) + result; // 转化为对应的字母
		num = Math.floor((num - remainder - 1) / 26); // 获取剩余部分的值
	}
	return result;
}

dateToOld.createNode = function (dom) {
	var node = {
		attrs: {}
	};
	if(dom.indexOf('</') != 0){
		var div = document.createElement('div')
		div.innerHTML = dom;
		var attributes = div.firstChild ? div.firstChild.attributes : '';
		if(attributes && attributes.length > 0){
			for (var i = 0;i < attributes.length; i++) {
				var attr = attributes[i]
				if(attr.value){
					node.attrs[attr.name] = attr.value;
				}
			}
		}
	}
	return node;
}

// 获取随机id
function getRandomId() {
	var str = "abcdefghijklmnopqrstuvwxyz0123456789";
	var tmp = [];
	var random;
	for (var i = 0; i < 8; i++) {
		random = Math.floor(Math.random() * (str.length));
		if (tmp.indexOf(str[random]) === -1) {
			tmp.push(str[random])
		} else {
			i--;
		}
	}
	return tmp.join('');
}

var calcYchangeDomAttrs = function calcYchangeDomAttrs(attrs) {
	var domAttrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	domAttrs = Object.assign({}, domAttrs);
	if (attrs.ychange !== null) {
		domAttrs.ychange_user = attrs.ychange.user;
		domAttrs.ychange_state = attrs.ychange.state;
	}
	return domAttrs;
};
//下面的方法依赖于pc端的schema
var nodes = {
	// :: NodeSpec The top level document node.
	doc: {
		content: 'block+'
	},
	// :: NodeSpec A plain paragraph textblock. Represented in the DOM
	// as a `<p>` element.
	paragraph: {
		attrs: {
			ychange: {
				"default": null
			},
			style: {
				"default": null
			},
			"class": {
				"default": null
			}
		},
		content: 'inline*',
		group: 'block',
		parseDOM: [{
			tag: 'p'
		}],
		toDOM: function toDOM(node) {
			return ['p', calcYchangeDomAttrs(node.attrs, {
				style: node.attrs.style,
				"class": node.attrs["class"]
			}), 0];
		}
	},
	// :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
	blockquote: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'blockquote'
		}],
		toDOM: function toDOM(node) {
			return ['blockquote', calcYchangeDomAttrs(node.attrs), 0];
		}
	},
	// 高亮块
	highlightBlock: {
		attrs: {
			// ychange: {default: null},
			style: {default: null}
		},
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'div.callout-block',
			getAttrs(dom) {
				return {
					style: dom.getAttribute('style')
				}
			}
		}],
		toDOM(node) {
			return [
				'div',
				{class: 'callout-block', style: node.attrs.style, id: getRandomId()},
				['span', {class: 'callout-icon'}, ['span', {class: 'callout-inner'}]],
				['div', {class: 'callout-text'}, 0]
			]
		}
	},
	bullet_list: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'ul'
		}],
		toDOM: function toDOM(node) {
			return ['ul', calcYchangeDomAttrs(node.attrs), ['li', 0]];
		}
	},
	ordered_list: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'ol'
		}],
		toDOM: function toDOM(node) {
			return ['ol', calcYchangeDomAttrs(node.attrs), ['li', 0]];
		}
	},
	task_list: {
		attrs: {
			ychange: {
				"default": null
			},
			"class": {
				"default": null
			}
		},
		content: 'block+',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'div.todo_wrap'
		}],
		// dom结构 <div><span></span><p>子元素</p></div>
		toDOM: function toDOM(node) {
			return ['div', calcYchangeDomAttrs(node.attrs, {
				"class": node.attrs["class"]
			}), ['span', {
				"class": 'todo-box'
			}], ['p', {
				"class": 'todo-inner'
			}, 0]];
		}
	},
	// :: NodeSpec A horizontal rule (`<hr>`).
	horizontal_rule: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		group: 'block',
		parseDOM: [{
			tag: 'hr'
		}],
		toDOM: function toDOM(node) {
			return ['hr', calcYchangeDomAttrs(node.attrs)];
		}
	},
	// :: NodeSpec A heading textblock, with a `level` attribute that
	// should hold the number 1 to 6. Parsed and serialized as `<h1>` to
	// `<h6>` elements.
	heading: {
		attrs: {
			level: {
				"default": 1
			},
			ychange: {
				"default": null
			},
			id: {
				"default": null
			}
		},
		content: 'inline*',
		group: 'block',
		defining: true,
		parseDOM: [{
			tag: 'h1',
			attrs: {
				level: 1
			}
		}, {
			tag: 'h2',
			attrs: {
				level: 2
			}
		}, {
			tag: 'h3',
			attrs: {
				level: 3
			}
		}, {
			tag: 'h4',
			attrs: {
				level: 4
			}
		}, {
			tag: 'h5',
			attrs: {
				level: 5
			}
		}, {
			tag: 'h6',
			attrs: {
				level: 6
			}
		}],
		toDOM: function toDOM(node) {
			return ['h' + node.attrs.level, calcYchangeDomAttrs(node.attrs, {
				'data-id': getRandomId()
			}), 0];
		}
	},
	// :: NodeSpec A code listing. Disallows marks or non-text inline
	// nodes by default. Represented as a `<pre>` element with a
	// `<code>` element inside of it.
	code_block: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		content: 'text*',
		marks: 'rcomment',
		group: 'block',
		code: true,
		defining: true,
		parseDOM: [{
			tag: 'pre',
			preserveWhitespace: 'full'
		}],
		toDOM: function toDOM(node) {
			return ['pre', calcYchangeDomAttrs(node.attrs), ['code', 0]];
		}
	},
	// :: NodeSpec The text node.
	text: {
		group: 'inline'
	},
	// :: NodeSpec An inline image (`<img>`) node. Supports `src`,
	// `alt`, and `href` attributes. The latter two default to the empty
	// string.
	image: {
		attrs: {
			ychange: {
				"default": null
			},
			src: {},
			// 展示地址
			_src: {},
			//原图地址
			objectid: {},
			id: {},
			style: {default: ''},
			divstyle: {default: ''},
			download: {default: ''},
			link: {default: ''},
			opentype: {default: ''},
		},
		group: 'block',
		draggable: true,
		parseDOM: [{
			tag: 'img[src]',
			getAttrs: function getAttrs(dom) {
				return {
					src: dom.getAttribute('src'),
					id: getRandomId(),
					style: dom.getAttribute('style'),
					_src: dom.getAttribute('_src'),
					objectid: dom.getAttribute('objectid'),
					download: dom.getAttribute('download'),
					link: dom.getAttribute('data-link'),
					opentype: dom.getAttribute('opentype'),
				};
			}
		}],
		toDOM: function toDOM(node) {
			var data;
			data = ['div', {
				"class": 'editor-image',
				draggable: true
			}, ['img', {
				style: node.attrs.style,
				'data-id': node.attrs.id,
				'src': node.attrs.src,
				'_src': node.attrs._src,
				'objectid': node.attrs.objectid,
				'download': node.attrs.download,
				'data-link': node.attrs.link,
				'opentype': node.attrs.opentype,
			}]];
			return data;
		}
	},

	imagewrap: {
		attrs: {
			ychange: {
				"default": null
			}
		},
		content: 'image*',
		group: 'block',
		defining: true,
		selectable: false,
		parseDOM: [{
			tag: 'div.drag-image-wrap'
		}],
		toDOM: function toDOM(node) {
			return ['div', calcYchangeDomAttrs(node.attrs, {
				"class": 'drag-image-wrap'
			}), 0];
		}
	},
	attachment: {
		attrs: {
			id: {},
			ychange: {
				"default": null
			},
			title: {
				"default": null
			},
			objectid: {
				"default": null
			},
			suffix: {
				"default": null
			},
			height: {
				"default": null
			},
			// 下面两个通用时传
			icon: {
				"default": null
			},
			size: {
				"default": null
			},
			// 是mp4时传
			videoUrl: {
				"default": null
			},
			appInfo: {
				"default": null
			},
			residstr: {
				"default": null
			},
			// 是mp3时传
			audioUrl: {
				"default": null
			},
			// 文件夹预览url
			folderPreviewUrl: {
				"default": null
			},
			// 特殊类型附件
			attachmentType: {
				"default": null
			},
			// 特殊类型附件预览
			attachmentPreviewUrl: {
				"default": null
			},
			name: {
				"default": null
			},
			module: {
				"default": null
			},
			//音频传
			fileLength: {
				"default": null
			},
			voiceLength: {
				"default": null
			},
			download: {default: ''},
			preview: {default: ''},
		},
		group: 'block',
		parseDOM: [{
			tag: 'div.attachment-wrap',
			getAttrs: function getAttrs(dom) {
				var attrs = {};
				var videoSuffix = ['mp4', 'avi', 'rmvb', 'flv', '3gp', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'mkv', 'vob', 'm4v', 'mov', 'f4v', 'wmv'];
				var audioSuffix = ['mp3', 'wav', 'ogg', 'amr', 'mp3pro', 'ra', 'rma', 'real', 'midi', 'mid', 'mod', 'flac', 'ape', 'aac', 'aiff', 'm4a', 'wma'];
				if (videoSuffix.includes(dom.getAttribute('data-suffix'))) {
					attrs = {
						id: getRandomId(),
						suffix: dom.getAttribute('data-suffix'),
						title: dom.getAttribute('data-title'),
						appInfo: JSON.parse(dom.getAttribute('data-appInfo')),
						objectid: dom.getAttribute('data-objectid'),
						residstr: dom.getAttribute('data-residstr'),
						download: dom.getAttribute('download'),
						preview: dom.getAttribute('preview'),
					};
				} else if (audioSuffix.includes(dom.classList[1])) {
					attrs = {
						id: getRandomId(),
						suffix: dom.classList[1],
						objectid: dom.children[0].getAttribute('objectid'),
						audioUrl: dom.children[0].children[1].getAttribute('src'),
						title: dom.children[0].children[0].innerText,
						download: dom.getAttribute('download'),
						preview: dom.getAttribute('preview'),
					};
				} else {
					attrs = {
						id: getRandomId(),
						suffix: dom.classList[1],
						icon: dom.firstChild.firstChild.getAttribute('src'),
						title: dom.children[1].children[0].innerText,
						size: dom.children[1].children[1].innerText,
						objectid: dom.children[2].children[1].getAttribute('objectid')
					};
				}
				return attrs;
			}
		}],
		toDOM: function toDOM(node) {
			//和pc有区别
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			var html = '';
			var insertType = '';
			if (node.attrs.module) {
				insertType = node.attrs.module;
			}
			if (insertType) {
				var attachmentSrc = insertType + '.html';
				if (dateToisPc) {
					attachmentSrc = '//noteyd.chaoxing.com/attachment/' + insertType + '.html';
				}
				var nodeId = getRandomId();
				try {
					var nodeName = dateToOld.b64DecodeUnicode(node.attrs.name);
					json = JSON.parse(nodeName);
					nodeId = json.cid;
				} catch (e) {

				}
				html = "<iframe frameborder='0' scrolling='no' cid='" + nodeId + "' src='" + attachmentSrc + "' name='" + node.attrs.name + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' download='" + node.attrs.download + "' preview='" + node.attrs.preview + "'></iframe>"
			}
			wrap.innerHTML = html;
			return wrap;
		}
	},
	folder: {
		attrs: {
			cid: {
				"default": null
			},
			title: {
				"default": null
			},
			categories: {
				"default": 'resource'
			},
			name: {
				"default": null
			},
			module: {
				"default": null
			},
			resid: {
				"default": null
			}
		},
		group: 'block',
		parseDOM: [{
			tag: 'div.folder-wrap',
			getAttrs: function getAttrs(dom) {
				var attrs = {
					cid: dom.getAttribute('data-cid'),
					title: dom.getAttribute('data-title'),
					isApp: dom.getAttribute('data-isapp'),
					categories: dom.getAttribute('data-categories')
				};
				return attrs;
			}
		}],
		toDOM: function toDOM(node) {
			//和pc有区别
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			var html = '';
			var insertType = '';
			if (node.attrs.module) {
				insertType = node.attrs.module;
			}
			if (insertType) {
				var attachmentSrc = insertType + '.html';
				if (dateToisPc) {
					attachmentSrc = '//noteyd.chaoxing.com/attachment/' + insertType + '.html';
				}
				var nodeId = getRandomId();
				try {
					var nodeName = dateToOld.b64DecodeUnicode(node.attrs.name);
					json = JSON.parse(nodeName);
					nodeId = json.cid;
				} catch (e) {

				}
				html = "<iframe frameborder='0' scrolling='no' cid='" + nodeId + "' src='" + attachmentSrc + "' name='" + node.attrs.name + "' class='attach-module attach-" + insertType + "' module='" + insertType + "'></iframe>"
			}
			wrap.innerHTML = html;
			return wrap;
		}
	},
	// 投票, 专题, 期刊, 直播 ,云盘, 地图, 超链接,
	special_attachment: {
		attrs: {
			cid: {
				"default": null
			},
			url: {
				"default": null
			},
			objectid: {
				"default": null
			},
			status: {
				"default": null
			},
			ifReview: {
				"default": null
			},
			liveCreator: {
				"default": null
			},
			imgUrl: {
				"default": null
			},
			title: {
				"default": null
			},
			description: {
				"default": null
			},
			categories: {
				"default": null
			},
			name: {
				"default": null
			},
			module: {
				"default": null
			},
			download: {default: ''},
			preview: {default: ''},
		},
		group: 'block',
		parseDOM: [{
			tag: 'div.special_attachment',
			getAttrs: function getAttrs(dom) {
				var attrs = {
					cid: dom.getAttribute('data-cid'),
					status: Number.parseInt(dom.getAttribute('data-status')),
					ifReview: Number.parseInt(dom.getAttribute('data-ifreview')),
					liveCreator: dom.getAttribute('data-livecreator'),
					imgUrl: dom.getAttribute('data-imgUrl'),
					title: dom.getAttribute('data-title'),
					description: dom.getAttribute('data-description'),
					categories: dom.getAttribute('data-categories'),
					url: dom.getAttribute('data-url'),
					objectid: dom.getAttribute('data-objectid'),
					download: dom.getAttribute('download'),
					preview: dom.getAttribute('preview'),
				};
				return attrs;
			}
		}],
		toDOM: function toDOM(node) {
			//和pc有区别
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			var html = '';
			var insertType = '';
			if (node.attrs.module) {
				insertType = node.attrs.module;
			}
			if (insertType) {
				var attachmentSrc = insertType + '.html';
				if (dateToisPc) {
					attachmentSrc = '//noteyd.chaoxing.com/attachment/' + insertType + '.html';
				}
				var nodeId = getRandomId();
				try {
					var nodeName = dateToOld.b64DecodeUnicode(node.attrs.name);
					json = JSON.parse(nodeName);
					nodeId = json.cid;
				} catch (e) {

				}
				html = "<iframe frameborder='0' scrolling='no' cid='" + nodeId + "' src='" + attachmentSrc + "' name='" + node.attrs.name + "' class='attach-module attach-" + insertType + "' module='" + insertType + "' download='" + node.attrs.download + "' preview='" + node.attrs.preview + "'></iframe>"
			}
			wrap.innerHTML = html;
			return wrap;
		}
	},
	// 笔记,小组,话题, 通知, 人员信息, 群聊, 微课
	note: {
		attrs: {
			content: {
				"default": null
			},
			title: {
				"default": null
			},
			categories: {
				"default": 'note'
			},
			url: {
				"default": null
			},
			note_name: {
				"default": null
			},
			imageUrl: {
				"default": null
			},
			empty: {
				"default": false
			},
			name: {
				"default": null
			},
			module: {
				"default": null
			},
			type: {
				"default": null
			}
		},
		group: 'block',
		parseDOM: [{
			tag: 'div.note-wrap',
			getAttrs: function getAttrs(dom) {
				var attrs = {
					content: dom.getAttribute('data-content'),
					title: dom.getAttribute('data-title'),
					url: dom.getAttribute('data-url'),
					note_name: dom.getAttribute('data-note_name'),
					categories: dom.getAttribute('data-categories'),
					imageUrl: dom.getAttribute('data-imageUrl')
				};
				return attrs;
			}
		}],
		toDOM: function toDOM(node) {
			//和pc有区别
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			var html = '';
			var insertType = '';
			if (node.attrs.module) {
				insertType = node.attrs.module;
			}
			if (insertType) {
				var attachmentSrc = insertType + '.html';
				if (dateToisPc) {
					attachmentSrc = '//noteyd.chaoxing.com/attachment/' + insertType + '.html';
				}
				var nodeId = getRandomId();
				try {
					var nodeName = dateToOld.b64DecodeUnicode(node.attrs.name);
					json = JSON.parse(nodeName);
					nodeId = json.cid;
				} catch (e) {

				}
				html = "<iframe frameborder='0' scrolling='no' cid='" + nodeId + "' src='" + attachmentSrc + "' name='" + node.attrs.name + "' class='attach-module attach-" + insertType + "' module='" + insertType + "'></iframe>"
			}
			wrap.innerHTML = html;
			return wrap;
		}
	},
	// 插入云盘文件
	cloudStorage: {},
	// :: NodeSpec A hard line break, represented in the DOM as `<br>`.
	hard_break: {
		inline: true,
		group: 'inline',
		selectable: false,
		parseDOM: [{
			tag: 'br'
		}],
		toDOM: function toDOM() {
			return brDOM;
		}
	},
	// placeHolder
	placeholder: {
		attrs: {
			msg: {
				"default": null
			},
			id: {}
		},
		group: 'block',
		toDOM: function toDOM(node) {
			var wrap = document.createElement('div');
			wrap.setAttribute('id', node.attrs.id);
			wrap.classList.add('attachment-wrap');
			var html = "<p><br></p>";
			wrap.innerHTML = html;
			return wrap;
		}
	},
	// 网页iframe
	webIframe: {
		attrs: {
			src: {},
			name: {
				"default": null
			},
			module: {
				"default": null
			}
		},
		group: 'block',
		toDOM: function toDOM(node) {
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			wrap.innerHTML = "<iframe src=" + node.attrs.src + "></iframe>";
			return wrap;
		}
	},
	// 超链接
	hyperLink: {
		attrs: {
			webUrl: '',
			webIcon: '',
			webTitle: '',
			name: {
				"default": null
			},
			module: {
				"default": null
			}
		},
		group: 'block',
		toDOM: function toDOM(node) {
			//和pc有区别
			var wrap = document.createElement('div');
			wrap.classList.add('editor-iframe');
			var html = '';
			var insertType = '';
			if (node.attrs.module) {
				insertType = node.attrs.module;
			}
			if (insertType) {
				var attachmentSrc = insertType + '.html';
				if (dateToisPc) {
					attachmentSrc = '//noteyd.chaoxing.com/attachment/' + insertType + '.html';
				}
				var nodeId = getRandomId();
				try {
					var nodeName = dateToOld.b64DecodeUnicode(node.attrs.name);
					json = JSON.parse(nodeName);
					nodeId = json.cid;
				} catch (e) {

				}
				html = "<iframe frameborder='0' scrolling='no' cid='" + nodeId + "' src='" + attachmentSrc + "' name='" + node.attrs.name + "' class='attach-module attach-" + insertType + "' module='" + insertType + "'></iframe>"
			}
			wrap.innerHTML = html;
			return wrap;
		}
	}
};
var emDOM = ['i', 0];
var strongDOM = ['b', 0];
var codeDOM = ['code', 0];

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
var marks = {
	rcomment: {
		attrs: {
			class: {},
			commentid: {},
			uuid: {}
		},
		// excludes 表示共存mark，默认不能与自身共存，设置’‘为与所有mark共存，解决覆盖问题
		excludes: '',
		spanning: false,
		inclusive: false,
		parseDOM: [{
			tag: null
		}],
		toDOM(node) {
			return ['span', {
				class: node.attrs.class,
				commentid: node.attrs.commentid,
				uuid: node.attrs.uuid
			}, 0];
		}
	},
	// 字体颜色
	fontcolor: {
		attrs: {
			color: {}
		},
		spanning: false,
		parseDOM: [{
			tag: 'span',
			style: 'color',
			getAttrs(dom) {
				if (dom.style[0] && dom.style[0].indexOf('color') != -1) {
					return {
						color: dom.style.color
					};
				} else {
					return false;
				}
			}
		}],
		toDOM(node) {
			return ['span', {
				style: node.attrs.color ? 'color:' + node.attrs.color.toString() : ''
			}, 0];
		}
	},
	// 背景颜色
	bgcolor: {
		attrs: {
			color: {}
		},
		spanning: false,
		parseDOM: [{
			tag: 'span',
			style: 'background',
			getAttrs(dom) {
				if (dom.style[0] && dom.style[0].indexOf('background') != -1) {
					return {
						color: dom.style.background
					};
				} else {
					return false;
				}
			}
		}],
		toDOM(node) {
			return ['span', {
				style: node.attrs.color ? 'background:' + node.attrs.color.toString() : ''
			}, 0];
		}
	},
	fontsize: {
		attrs: {
			fontsize: {}
		},
		spanning: false,
		parseDOM: [{
			tag: 'span',
			style: 'font-size',
			getAttrs(dom) {
				if (dom.style[0] && dom.style[0].indexOf('font-size') != -1) {
					return {
						fontsize: dom.style.fontSize
					};
				} else {
					return false;
				}
			}
		}],
		toDOM(node) {
			return ['span', {
				style: node.attrs.fontsize ? 'font-size:' + node.attrs.fontsize : ''
			}, 0];
		}
	},
	fontfamily: {
		attrs: {
			fontfamily: {}
		},
		spanning: false,
		parseDOM: [{
			tag: 'span',
			style: 'font-family',
			getAttrs(dom) {
				if (dom.style[0] && dom.style[0].indexOf('font-family') != -1) {
					return {
						fontfamily: dom.style.fontFamily
					};
				} else {
					return false;
				}
			}
		}],
		toDOM(node) {
			return ['span', {
				style: node.attrs.fontfamily ? 'font-family:' + node.attrs.fontfamily : ''
			}, 0];
		}
	},
	// :: MarkSpec A link. Has `href` and `title` attributes. `title`
	// defaults to the empty string. Rendered and parsed as an `<a>`
	// element.
	link: {
		attrs: {
			href: {},
			target: {}
		},
		inclusive: false,
		spanning: false,
		parseDOM: [{
			tag: 'a[href]',
			getAttrs(dom) {
				return {
					href: dom.getAttribute('href'),
					target: dom.getAttribute('target')
				};
			}
		}],
		toDOM(node) {
			return ['a', node.attrs, 0];
		}
	},
	// :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
	// Has parse rules that also match `<i>` and `font-style: italic`.
	em: {
		parseDOM: [{
			tag: 'i'
		}, {
			tag: 'em'
		}, {
			style: 'font-style=italic'
		}],
		spanning: false,
		toDOM() {
			return emDOM;
		}
	},
	// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
	// also match `<b>` and `font-weight: bold`.
	strong: {
		spanning: false,
		parseDOM: [{
			tag: 'strong'
		},
			// This works around a Google Docs misbehavior where
			// pasted content will be inexplicably wrapped in `<b>`
			// tags with a font-weight normal.
			{
				tag: 'b',
				getAttrs: node => node.style.fontWeight !== 'normal' && null
			}, {
				style: 'font-weight',
				getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
			}],
		toDOM() {
			return strongDOM;
		}
	},
	underline: {
		spanning: false,
		parseDOM: [{
			tag: 'u'
		}, {
			style: 'text-decoration:underline'
		}],
		toDOM: function () {
			return ['u', 0];
		}
	},
	strike: {
		spanning: false,
		parseDOM: [{
			tag: 'strike'
		}, {
			style: 'text-decoration:line-through'
		}],
		toDOM: function () {
			return ['strike', 0];
		}
	},
	ychange: {
		attrs: {
			user: {
				default: null
			},
			state: {
				default: null
			}
		},
		inclusive: false,
		parseDOM: [{
			tag: 'ychange'
		}],
		toDOM(node) {
			return ['ychange', {
				ychange_user: node.attrs.user,
				ychange_state: node.attrs.state
			}, 0];
		}
	}
};
/*协作笔记转化老笔记 通用方法 end*/


//禁止下载的附件不允许复制
function removeForbidDownloadAttach(tempDiv) {
	$(tempDiv).find('iframe').each(function(index,item){
		var iframename = JSON.parse(b64DecodeUnicode(item.getAttribute('name')));
		if(item.getAttribute('module') == 'insertCloud' && iframename.att_clouddisk.forbidDownload && iframename.att_clouddisk.forbidDownload == 1){
			$(item).parent().remove();
		}else if(item.getAttribute('module') == 'insertVideo' && iframename.att_video.forbidDownload && iframename.att_video.forbidDownload == 1){
			$(item).parent().remove();
		}else if(item.getAttribute('module') == 'insertVoice' && iframename.att_voice.forbidDownload && iframename.att_voice.forbidDownload == 1){
			$(item).parent().remove();
		}else if(item.getAttribute('download') == 'false' && item.attr('allowdownload') == 'false'){
			$(item).parent().remove();
		}
	})
	return tempDiv
}
