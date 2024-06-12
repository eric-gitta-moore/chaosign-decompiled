/**
 * 合集按钮的方法
 */
const collectionAdd = $('#collectionAdd');
const collectionInfo = $('#collectionInfo');
const colleciionLogo = collectionInfo.find('img');
const colleciionName = collectionInfo.find('span');
function addNoteHeji() {
  //android
	if (isAndroid && (typeof javaJs !== 'undefined')) {
		javaJs.addNoteHeji();
	}
	//ios
	if (isIOS) {
		if (window.webkit && window.webkit.messageHandlers.addNoteHeji) {
			window.webkit.messageHandlers.addNoteHeji.postMessage();
		} else {
			if (window["addNoteHeji"]) {
				window["addNoteHeji"]();
			}
		}
	}
}
function setHeji(name, logo, isVisible){
  zss_editor.compilations = {
    name:'', 
    logo:'', 
    isVisible:''
  };
  collectionAdd.addClass('hide');
  collectionInfo.addClass('hide');
  if(isVisible) {
    if(((name && name.length > 0)) || (logo && logo.length > 0)) {
      colleciionName.text(name);
      colleciionLogo.attr('src', logo);
      zss_editor.compilations.name = name;
      zss_editor.compilations.logo = logo;
      zss_editor.compilations.isVisible = isVisible;
      collectionInfo.removeClass('hide');
    }else {
      collectionAdd.removeClass('hide');
    }
  }
}