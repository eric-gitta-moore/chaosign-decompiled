/**
 * 域名工具类，每个服务的域名key可参考 https://kb.chaoxing.com/apis/mirrorConfig
 */
DomainUtil = {
	domain : {},
}

/**
 * 课表cname到公网，且不符合convertUrl()通用替换方式的域名
 */
let cnameSpecialDomain = {
	//武大定制域名
	"www.mooc.whu.edu.cn" : {
			"mooc1_2Domain" : "http://www.mooc.whu.edu.cn/mooc-ans",
			"mobilelearnDomain" : "http://www.mooc.whu.edu.cn/ketang-mobilelearn",
			"mobilelearnDomainHttps" : "https://www.mooc.whu.edu.cn/ketang-mobilelearn",
			"stat2DomainHttps" : "https://www.mooc.whu.edu.cn/stat2",
			"panDomain" : "http://www.mooc.whu.edu.cn/pan",
			"panDomainHttps" : "https://www.mooc.whu.edu.cn/pan",
			"passport2Domain" : "http://passport2.mooc.whu.edu.cn",
			"passport2DomainHttps" : "https://passport2.mooc.whu.edu.cn"
		},
	//深职院定制域名（要求打开课堂还用超星域名）
	"appswh.istudy.szpt.edu.cn" : {
			"ktDomainHttps" : "https://k.chaoxing.com",
			"mooc1_2Domain" : "http://mooc.istudy.szpt.edu.cn",
		},
};


var mctx = window.location.pathname.substring(0, window.location.pathname.indexOf('/res')) || '';

initMirrorConfig();

/**
 * 从接口获取各个服务域名
 */
function initMirrorConfig() {
	//首页嵌入在客户端时，不执行获取镜像域名逻辑，避免本地报错
	if (!window.location.href.startsWith('http')) {
		return;
	}
	let url = mctx + '/apis/mirrorConfig';
	const xhr = new XMLHttpRequest()
	xhr.open('get', url, false) // 同步请求
	xhr.send(null)
	let res = xhr.responseText;
	try{
		res = JSON.parse(res)
		if(res && res.result == 1){
			DomainUtil.domain = res.data.domainMap;
			for(var key in DomainUtil.domain){
				DomainUtil.domain[key] = window.location.protocol + DomainUtil.domain[key].replace('https:','').replace('http:','')
			}
			if(res.data.isMirrorDeploy){
				DomainUtil.domain.isMirrorDeploy = true;
			}
		}
	}catch (e) {

	}
}

/**
 * 根据域名key获取对应的域名
 */
function getServerDomain(key) {
	if (!key){
		return '';
	}
	var serverDomain = DomainUtil.domain[key] || ''
	if (!serverDomain){
		return serverDomain;
	}
	//如果是镜像部署，直接信任接口返回的各个域名
	if (DomainUtil.domain.isMirrorDeploy){
		return serverDomain;
	}
	//公网，通过convertDomain获取各服务域名
	serverDomain = convertDomain(serverDomain, key);
	//兼容当前页面协议
	serverDomain = window.location.protocol + serverDomain.replace('https:', '').replace('http:', '');
	return serverDomain;
}


/**
 * 根据当前页面域名，通用替换其他服务域名（兼容域名+路径）
 * 例：http://noteyd.chaoxing.com -> http://xxx.xxx.xxx/noteyd
 * 或 http://noteyd.chaoxing.com -> http://noteyd.xxx.xxx
 */
function convertDomain(serverDomain, key) {
	try {
		var host = window.location.host;
		if (host.indexOf('chaoxing.com') > -1) {
			// 当前是超星域名，不做处理
			return serverDomain;
		}
		//以下是公网情况下，但课表域名做了cname
		//返回的域名不含chaoxing，说明金鑫那边已经处理过了，直接信任接口返回的各个域名
		if (serverDomain.indexOf('chaoxing.com') == -1){
			return serverDomain;
		}
		//不符合通用替换方式的
		if (cnameSpecialDomain[window.location.host] && cnameSpecialDomain[window.location.host][key]){
			return cnameSpecialDomain[window.location.host][key];
		}
		if (mctx){
			//域名+分路径
			//截取serverDomain中的服务名
			var serverName = serverDomain.substring(serverDomain.indexOf('://')+3, serverDomain.indexOf('.chaoxing.com'));
			serverDomain = host + '/' + serverName;
		}else {
			// 截取一级域名
			var firstDomain = host.substring(host.indexOf('.'))
			serverDomain = serverDomain.replace('.chaoxing.com', firstDomain);
		}
	} catch (e) {

	}
	return serverDomain;
}

