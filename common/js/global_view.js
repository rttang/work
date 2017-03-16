﻿//var MAPIP = "172.21.12.17";
var MAPIP = "10.2.4.120";
var MAPPort = "554";
//var portalIP = "172.21.12.3";
var portalIP = "10.2.4.60";
var portalPort = "8080";

/** @description npvrServiceUrl npvr服务器IP，port*/
//var npvrServiceUrl = "h:ttp://172.21.11.86/iPG/T-nsp/";
/** @description videoUrl index页面中的直播流 */
//var videoUrl = "delivery://490000.6875.64QAM.1901.515.515";
/* @description 全局对象**/
var V, IEPG = V = IEPG || {};

/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
var epgUrl = location.href.split("/template")[0];
var goUrl = location.href.split("/iPG")[0];  // such as:http://172.21.12.12:8080
var tipUrl = goUrl+"/iPG/";    // 弹框前缀路径
var epgVodUrl="../../";

/* @description 影片无图片时默认图片    **/
var defaultPic = "/iPG/common/images/no_pic_m.jpg";
var bigDefaultPic = "/iPG/common/images/no_pic_b.jpg";
var skinImgUrl = "skin/images/";
/* @description 剧集弹出框标识    **/
var mediaTipFlag = false;
/* @description 搜索弹出框标识    **/
var searchTipFlag = false;
/* @description 购买弹出框标识    **/
var buyTip=false;
/* @description 试看结束购买弹出框标识    **/
var tryBuyTip=false;
/* @description 收藏成功弹出框标识，收藏成功按红色键进入我的收藏 **/
var collectFlag=false;
/* @description 评分弹出标志 **/
var gradeTipFlag=false;
/* XML请求数据头部 */
var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
/*XML请求数据必填参数*/
var portalId = 102;
/*XML请求数据必填参数  卡号*/
var cardId =getSmartCardId();
//var cardId ="8001002110042106";
/** userId 为用户ID */
var userId = getUserId();
//var userId="LONGVision";
//var userId="wxy00001";

var comeFromTip;
var isComeFrompkgChargeMode1 = false;

/** @description 键值定义 */
var KEY = {
	"ZERO" : 48,
	"ONE" : 49,
	"TWO" : 50,
	"THREE" : 51,
	"FOUR" : 52,
	"FIVE" : 53,
	"SIX" : 54,
	"SEVEN" : 55,
	"EIGHT" : 56,
	"NINE" : 57,

	"HOME":468,
	"LEFT" : 37,
	"RIGHT" : 39,
	"UP" : 38,
	"DOWN" : 40,
	"ENTER" : 13,
	"PREV" : 33,
	"NEXT" : 34,
	"QUIT" : 27,
	"RED" : 403,
	"GREEN" : 404,
	"YELLOW" : 405,
	"BLUE" : 406,
	"PLAY" : 3864,
	"PLAY1" : 3862,
	"SEARCH" : 3880,
	"SEARCH_N" : 4117,
	"SEARCH_G" : 84, //google搜索 T键值

	"UP_N" : 87, //N9101盒子键值
	"DOWN_N" : 83,
	"LEFT_N" : 65,
	"RIGHT_N" : 68,
	"ENTER_N" : 10,
	"PREV_N" : 306,
	"NEXT_N" : 222, //贵州222     广州307
	"QUIT_N" : 72,
	"RED_N" : 320,
	"GREEN_N" : 323,  //贵州 323      广州321
	"YELLOW_N" : 321, //贵州 321      广州322
	"BLUE_N" : 322,   //贵州 322      广州323
	"PLAY_N": 59,     //贵州59        广州39

	"BACK" : 8,
	"RETURN" : 640,
	"RETURN_N" : 69,
	"RED_T" : 82, //E600浏览器调试
	"YELLOW_T" : 89, //E600浏览器调试
	"BLUE_T" : 66, //E600浏览器调试
	"GREEN_T" : 71, //E600浏览器调试
	"STATIC" : 67,
	"VOICEUP" : 61,
	"VOICEDOWN" : 45
};

function New(aClass, params) {
	function _new() {
		if(aClass.initializ) {
			aClass.initializ.call(this, params);
		}
	}
	_new.prototype = aClass;
	return new _new();
}

Object.extend = function(destination, source) {
	for(var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

/**
 * @description $ 代替document.getElementById
 * @param {string} _id 为页面DIV的id
 */
var $ = function(_id) {
	return typeof _id == 'string' ? document.getElementById(_id) : _id;
};
var G = function(_object, _attribute) {
	if(_object==undefined || _object.getAttribute(_attribute)==null || _object.getAttribute(_attribute)==undefined){
		return "";
	}else{
		return _object.getAttribute(_attribute);
	}
};
var tags = function(_object, _tagname) {
	if(_object==undefined || _object.getElementsByTagName(_tagname)==null || _object.getElementsByTagName(_tagname)==undefined){
		return null;
	}else{
		return _object.getElementsByTagName(_tagname);
	}
};

var changeBg = function(id, url) {//改变背景图
	if(url.indexOf("url") >= 0) {
		$(id).style.background = url + " no-repeat";
	} else {
		$(id).style.background = "url(" + url + ") no-repeat";
	}
};

function changeObjClass(id, className) {//改变对象样式
	$(id).className = className;
}

function getGrade(_recomdLevel) {
	var curGrade = "";
	if(_recomdLevel == 0) {
		curGrade = 3;
	} else {
		curGrade = _recomdLevel;
	}
	return curGrade;
}

/**
 * @description trim 去掉字符串前后空格
 * @param {string} _str 需要处理的字符串
 */
function trim(_str) {
	return _str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * @description getUserId 取AAA下发的userId，供页面请求数据用，此参数是请求数据的url必带字段
 */
function getUserId() {//获取userId
	var userId;
	if(getGlobalVar("monitorFlag")==1){
		return "1234567";
	}
	try {
        userId = Utility.getSystemInfo("UID");
	} catch (e) {
		userId=0;
	}
	return userId;
}
function getSmartCardId(){ 
	try { 
		return Utility.getSystemInfo("SID"); 
	} catch (e) { 
		return 0; 
	} 
}//获取智能卡号

//*********** 逻辑操作时，检查CA和uerId  **************

function checkUser() {
	var userId = getUserId();
	if(userId == "" || userId == "0" || userId == undefined) {
		showMsg(tipUrl + "iPG/tip/a_collect.htm", "认证失败，请检查机顶盒和智能卡！");
		return false;
	}
	return true;
}

//检查智能卡插入、拔出消息
document.onsystemevent = function(e) {
	var code = e.which || e.keyCode;
	var keyType = e.type ? e.type : 1001;
	if(keyType == 1001) {
		switch(code) {
			case 40070://中山，卡插入
			case 11703://南海，卡插入
				break;
			case 40071://中山，卡被拔出
			case 11704://南海，卡被拔出
				showMsg(tipUrl + "iPG/tip/a_collect.htm", "认证失败，请检查机顶盒和智能卡！");
				break;
			case 10902:
			case 40201://播放的流文件到头
				break;
			case 10901:
			case 40200://播放的流文件到尾
				playNextNews();//播放下一个新闻
				break;
			default:
				break;
		}
	}
};


/**
 * @description 写cookie，设置全局参数
 * @param {string} _sName 全局参数名称
 * @param {string} _sValue 全局参数名称对于的值
 */

function setGlobalVar(_sName, _sValue) {
	try {
		_sValue = _sValue + "";
		if(Utility.setEnv) {
			Utility.setEnv(_sName, _sValue);
		} else {
			SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));//9101
		}
	} catch(e) {
		document.cookie = escape(_sName) + "=" + escape(_sValue);
	}
}

/**
 * @description 读cookie，获取全局参数
 * @param {string} _sName 全局参数名称（对应setGlobalVar方法中的_sName）
 * @return {string} result 返回值（对应setGlobalVar方法中的_sValue）
 */

function getGlobalVar(_sName) {
	var result = "";
	try {
		if(Utility.getEnv) {
			result = Utility.getEnv(_sName);
		} else {
			result = decodeURIComponent(SysSetting.getEnv(_sName));//9101
		}
		if(result == "undefined") {
			result = "";
		}
	} catch (e) {
		var aCookie = document.cookie.split("; ");
		for(var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if(escape(_sName) == aCrumb[0]) {
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}


//----------------------  路径缓存操作 start---------------------------------------------------------//
var urlSplitChar = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var urlPathGlobalName = "urlPathGlobalName";//全局变量名
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
function saveUrlPath() {//保存访问路径
	var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "" : getGlobalVar(urlPathGlobalName);//取全局变量
	var urlArr = tempUrl.split(urlSplitChar);
	if(urlArr[urlArr.length-1] == location.href){
		tempUrl = tempUrl
	}else{
		tempUrl = tempUrl + urlSplitChar + location.href;//将已存在的路径和当前URL之间加上分隔符
	}
	var arr = tempUrl.split(urlSplitChar);
	if(arr.length > 6) {
		var removeLength = arr.length - 6;
		var newArr = arr.slice(removeLength);//从指定位置开始复制数组，一直到最后
		tempUrl = arr[1] + urlSplitChar + newArr.join(urlSplitChar);//保留原来数组中第一个路径（portal进入的路径）
	}
	setGlobalVar(urlPathGlobalName, tempUrl);//保存
}

function goReturnUrlPath() {//返回上一路径
	var tempUrl = getGlobalVar(urlPathGlobalName);//取全局变量
	var tuArr = tempUrl.split(urlSplitChar);
	var tl = tuArr.length;
	var tul = tuArr.pop();//移除数组中的最后一个元素并返回该元素，这里取出的是最后保存的url路径
	if(!tul || tul == "") {
		tul = getGlobalVar("PORTAL_ADDR");
	}
	var newUrl = tuArr.join(urlSplitChar);//移除最后一个url路径后，将所剩下的url再次用#分隔符拼接成一个新串保存到全局变量中
	setGlobalVar(urlPathGlobalName, newUrl);
	if(getQueryStr(location.href,"from")=="dvbplayer"){
		location.href = tul;
		Utility.ioctlWrite("START_APP", "PackageName:com.coship.guizhou.dvb");
	}else{
		location.href = tul;
	}
}

function clearUrlPath() {//清除保存的所有路径
	setGlobalVar(urlPathGlobalName, "");
}


var urlTopPathGlobalName = "urlPathGlobalName";//全局变量名
function saveTopUrlPath(){
    var tempUrl = getGlobalVar(urlTopPathGlobalName) == undefined ? "":getGlobalVar(urlTopPathGlobalName);
    tempUrl = tempUrl + urlSplitChar + location.href;
    var arr = tempUrl.split(urlSplitChar);
    if(arr.length>6){
        var removeLength=arr.length-6;
        var newArr=arr.slice(removeLength);
        tempUrl = arr[1]+urlSplitChar+newArr.join(urlSplitChar);
    }
    setGlobalVar(urlTopPathGlobalName, tempUrl);
}

function goReturnTopUrlPath(){
    var tempUrl = getGlobalVar(urlTopPathGlobalName);
    var tuArr = tempUrl.split(urlSplitChar);
    var tl = tuArr.length;
    var tul = tuArr.pop();
    if (!tul || tul == "")
    {
        tul = getGlobalVar("PORTAL_ADDR");

    }
    var newUrl = tuArr.join(urlSplitChar);
    setGlobalVar(urlTopPathGlobalName, newUrl);
    Utility.setEnv("portal_Form","");
    location.href = tul;
}

function clearUrlTopPath(){
    setGlobalVar(urlTopPathGlobalName, "");
}

function doReturnTopPress(){
    setGlobalVar("isBack","Y");
    clearGlobalVar();
    goReturnTopUrlPath();
}

/**
 * @description showTime 用于页面中时间，日期的显示
 * @param {string} _objId 可以是2D页面中的时间对象，也可以是div中的id
 */
var showTime = {
	init : function() {
		if($("time")) {
			this.getTime();
			setInterval(this.getTime, 60000);
		}
	},
	getTime : function() {
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		hour = hour < 10 ? "0" + hour : hour;
		minute = minute < 10 ? "0" + minute : minute;
		var time_ = hour + ":" + minute;
		if($("week")) {
			var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			var week_ = week[date.getDay()];
			$("week").innerHTML = week_;
		}
		if($("date")) {
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? day = "0" + day : day;
			var day_ = year + "." + month + "." + day;
			$("date").innerHTML = day_;
		}
		$("time").innerHTML = time_;
	}
};
//将日期格式2013.05.02转换成20130502000000  yyyyMMddhhmmss年月日时分秒
function dateFormat(date){
	var dataArr=date.split(".");
	var dateStr="";
	for(i=0;i<dataArr.length;i++){
		dateStr+=dataArr[i];
	}
	dateStr+="000000";
	return dateStr;
}

//将03:10:02格式的时间转换成秒
function formateDate(date){
	var dataArr=date.split(":");
	var hour = parseInt(dataArr[0],10);
	var minute = parseInt(dataArr[1],10);
	var second = parseInt(dataArr[2],10);
	return hour*3600+minute*60+second;
}

function ajaxUrl(_url, _handler, _data){
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if(window.XMLHttpRequest) {
			this.xmlHttp = new XMLHttpRequest();
			if (this.xmlHttp.overrideMimeType) {
				this.xmlHttp.overrideMimeType('text/xml');
			}
		} else {
			if(window.ActiveXObject) {
				this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
	};
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlHttp = this.xmlHttp;
//		_url = "http://" + portalIP + ":" + portalPort + _url;
		this.xmlHttp.open("POST", _url, true);
     	this.xmlHttp.send(_data);
		this.xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					callBackData3(xmlHttp, _handler);
				} else {//超时间方法,传入空会自动弹出服务器忙的提示
					showMsg("", "系统忙,请稍候重试。");
				}
			}
		};
	};
	this.getData();
}


function ajax(param) {
	this.url = param.url || "";
   	this.method = param.method || "get";
    	this.handler = param.handler;
	this.data = param.data || null;
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var handler = this.handler;
		var obj = new Object();
		this.xmlHttp.open(this.method, this.url, true);
		this.xmlHttp.send(this.data);
		this.xmlHttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					callBackData2(xmlhttp,handler);
				}
			}
		}
	}
	this.getData();
}

function callBackData2(_xmlHttp, _handler){
    var resText = _xmlHttp.responseText;
	_handler(resText);
}
/**
 * @description 此函数的作用是解析ajax返回的json，将数据变为json对象
 * @param {string} _data ajax返回xmlHttp.responseText
 */

function parseJSON(_data) {
	if( typeof _data !== "string" || !_data) {
		return null;
	}
	//data = trim( data );
	if(_data.indexOf("a_") >= 0) {//此句的作用在于showMsg中的弹出提示框不是json格式
		return _data;
	}
	if(window.JSON && window.JSON.parse) {
		return window.JSON.parse(_data);
	} else {
		return eval("(" + _data + ")");
	}
}


/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */

function callBackData3(_xmlHttp, _handler){
   var resText = _xmlHttp.responseText;
	resText = eval("(" + resText + ")");
	_handler(resText);
}

function getErrorMsg(errorMsg) {
	var errorTextMsg = errorMsg.message;
	if(errorTextMsg == "") {
		errorTextMsg = "系统繁忙，请稍候重试。";
	}
	var errorMessage = errorTextMsg + "。 【 " + errorMsg.errorCode + " 】";
	switch(errorMsg.errorCode) {
		case "12011086"://栏目信息不存在
		case "122000020"://参数不能为空
		case "12200061"://资源不存在或已经下架
		case "10000001"://系统烦忙,请稍后。
		case "10000002"://资源暂不可用！
		case "12200009"://用户无效
		case "2001"://用户信息不存在
		case "-1"://无message信息
		case "2030"://AAA返回资源不存在
			showMsg("", errorMessage);
			break;
		default:
			showMsg(tipUrl + "iPG/tip/a_collect.htm", errorMessage);
			break;
	}
}

var nowTip="";
/** @description goToPortal 对业务的整体键值进行监听*/
//document.onkeyPress = globalEvent;
document.onkeydown = grabEvent;
var keycode;
function grabEvent(_e) {
	keycode = _e.keyCode || _e.which;
	if(tipFlag) {
		switch(keycode) {
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
				_e.preventDefault();
				if(searchTipFlag) {//搜索弹出框按返回时的处理
					if(($("search_Input").value).length != 0) {
						deleteValue();
					} else {
						closeTip();
					}
				} else {//弹出框默认处理
					closeTip();
				}
				break;
		}
	} else if(mediaTipFlag) {//弹出集数选择框
		switch(keycode) {
			case KEY.ENTER:
			case KEY.ENTER_N:
				doMediaConfirm();
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
				_e.preventDefault();
				closeTip();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
				_e.preventDefault();
				moveMediaLeft();
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
				_e.preventDefault();
				moveMediaRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
				turnNextMediaPage();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				turnPrevMediaPage();
				break;
		}
	} else {
		switch(keycode) {
			case KEY.ONE:
			case KEY.TWO:
			case KEY.THREE:
			case KEY.FOUR:
			case KEY.FIVE:
			case KEY.SIX:
			case KEY.SEVEN:
			case KEY.EIGHT:
			case KEY.NINE:
			case KEY.ZERO:
				doNumberKey(keycode,KEY.ZERO);
				break;
        	case KEY.HOME://主页
				goToPortal();
			break;
			case KEY.UP:
			case KEY.UP_N:
				moveUp();
				break;
			case KEY.DOWN:
			case KEY.DOWN_N:
				moveDown();
				break;
			case KEY.LEFT:
			case KEY.LEFT_N:
				moveLeft();
				break;
			case KEY.RIGHT:
			case KEY.RIGHT_N:
				moveRight();
				break;
			case KEY.NEXT:
			case KEY.NEXT_N:
				turnNextPage();
				break;
			case KEY.PREV:
			case KEY.PREV_N:
				turnPrevPage();
				break;
			case KEY.ENTER:
			case KEY.ENTER_N:
				doConfirm();
				break;
			case KEY.PLAY:
			case KEY.PLAY1:
			case KEY.PLAY_N:
				doPlayKey();
				break;
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.RETURN_N:
				doReturnKey();
				_e.preventDefault();
				break;
			case KEY.RED:
			case KEY.RED_N:
			case KEY.RED_T:
				doRedKey();
				break;
			case KEY.YELLOW:
			case KEY.YELLOW_N:
			case KEY.YELLOW_T:
				doYellowKey();
				break;
			case KEY.BLUE:
			case KEY.BLUE_N:
			case KEY.BLUE_T:
				doBlueKey();
				break;
			case KEY.GREEN:
			case KEY.GREEN_N:
			case KEY.GREEN_T:
				 _e.preventDefault();
				doGreenKey();
				break;
			case KEY.QUIT_N:
			case KEY.QUIT:
				_e.preventDefault();
				doPortalKey();
				break;
			case KEY.SEARCH:
			    _e.preventDefault();
				doPositionKey();
				break;
			case KEY.STATIC:
				if(videoObj != undefined){
					videoObj.resetStatic();
				}
				break;
			case KEY.VOICEUP:
			case KEY.VOICEDOWN:
				if(videoObj != undefined){
					if(!isDisplayVoice()){
						voice.displayVoice(true);
					}else{
						doVoice(keycode, _e);
					}
				}
				break;
			default:
				break;
		}
	}
}




//***************************     搜索 开始             *************************
/** @description 搜索*/
function goToSearch() {
	saveUrlPath();saveTopUrlPath();
	if(typeof(columnId)=="undefined"){
		window.location.href =goUrl+ "/iPG/search/search.htm";
	}else{
		window.location.href =goUrl+ "/iPG/search/search.htm?columnId="+columnId;
	}
}

function deleteValue() {
	$("search_Input").value = ($("search_Input").value).substring(0, ($("search_Input").value).length - 1);
}

function deleteAll() {
	$('search_Input').value = '';
}

function doSearch() {
	var keyWord = $('search_Input').value;
	if(keyWord == "") {
		$('search_Input').value = "请输入关键字进行搜索";
	} else {
		saveUrlPath();
		window.location.href = 'search_list.htm?keyWord=' + keyWord;
	}
}

function onSearchButton(id) {
	var value = "";
	if($("search_Input").value != "") {
		value = $("search_Input").value + id;
	} else {
		value += id;
	}
	$("search_Input").value = value;
}
//***************************     搜索 结束             *************************


//---------------------- 按0-9数字键调用方法-------------------------------
function goToRec(recJson) {
	if(recJson.length != 0) {//推荐海报数据长度
		keycode = keycode - 49 >= -1 ? keycode - 49 : -2;
        if(keycode == -1) {
            keycode = 9;
        }
		if(recJson.length - 1 < keycode || keycode < 0) {//页面显示的推荐海报个数
			return;
		} else {
            if(recJson[keycode].assetInfo.recordType=="pakg"){
                window.location.href =goUrl+ "/iPG/detail/dsj_detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].assetInfo.columnId;
            }else{
                window.location.href = goUrl+ "/iPG/detail/detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].assetInfo.columnId;
            }
		}
	}
}

/** @description doRedKey 数字键处理函数，页面重写此方法*/
/* function doNumberKey(){

 }*/

function doReturnKey() {
	setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
	clearGlobalVar();
	goReturnUrlPath();
    //doReturnTopPress();
}

/** @description doRedKey 红色键处理函数*/
function doRedKey() {//我的空间
	goToMyZone();
}

function goToMyZone() {
    saveUrlPath();saveTopUrlPath();
    window.location.href = goUrl + "/iPG/myzone/myZone_list.htm";
}

/** @description doGreenKey 绿色键处理函数*/
function doGreenKey(){
	goToSearch();
}

/** @description doYellowKey 黄色键处理函数*/
function doYellowKey(){
    clearUrlPath();clearUrlTopPath();
    location.href = Utility.getEnv("ROOT_PATH") + "help/user_docs.htm";
}

/** @description doBlueKey 蓝色键处理函数*/
function doBlueKey() {//点播排行
	goToTop();
}

function goToTop() {
    saveUrlPath();saveTopUrlPath();
    window.location.href = goUrl + "/iPG/dbph/vod_top.htm";
}

/** @description doPositionKey 定位键处理函数*/
function doPositionKey() {//搜索
    goToSearch();
}

function doPortalKey(){//按主页键清除全局变量，返回至portal页
	//clearGlobalVar();//页面重写此方法
	goToPortal();
}

/** @description goToPortal 返回portal处理函数*/
function goToPortal() {//清除路径
	clearUrlPath();clearUrlTopPath();
	location.href = getGlobalVar("PORTAL_ADDR");
}

function clearGlobalVar() {
 
}

var doEvent = {
	/** @description  红色键处理函数*/
	red : function() {
		goTo.myZone("collect_list.htm?type=0");
	},
	/** @description  绿色键处理函数*/
	green : function() {
		goTo.myZone("collect_list.htm?type=1");
	},
	/** @description  黄色键处理函数*/
	yellow : function() {
	},
	/** @descript
	 * ion  蓝色键处理函数*/
	blue : function() {
		goTo.top("top.htm");
	},
	/** @description  返回键处理函数*/
	back : function() {
		goTo.back();
	},
	/** @description  主页键处理函数*/
	home : function() {
		goTo.portal();
	},
	/** @description  定位键处理函数*/
	position : function() {
		goTo.search("search.htm");
	},
};

/** @description 页面静态跳转*/
var goTo = {
	/** @description  进入列表页*/
	list : function(_pageType, _columnId) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnId=" + _columnId;
	},
	/** @description  进入详情页_columnMapId 媒资ID，_recordType 电影电视剧，columnId栏目ID*/
	detail : function(_pageType, _columnMapId, _recordType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnMapId=" + _columnMapId+"&columnId="+columnId+"&recordType="+_recordType;
	},
	/** @description  进入点播排行*/
	top : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  进入我的空间*/
	myZone : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  进入我的搜索*/
	search : function(_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  退出回到portal首页*/
	portal : function() {
		globalPath.cleanUrl();
		location.href = getGlobalVar("portalIndexUrl");
	},
	/** @description  返回上一目录*/
	back : function() {
		globalPath.getUrl();
		setGlobalVar("isBack", "Y");	
	}
};

var doExecute = {
	/** @description  收藏节目VOD：点播(单片，默认值)  BTV：回看  nPVR：个人录像 VODPkg：媒资包*/
	collect : function(columnId, assetId, assetName,custom) {
		if(checkUser()){
			columnId="123";//栏目ID写死，保证folderAssetId的值不为空
			var VOD_saveVodFavorites = {
				"data":"<AddBookmark titleAssetId=\"" + assetId +"\" custom=\"" + custom+"\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
				"callBack" : function(_dataJson) {
					if(_dataJson.code){
						showMsg(tipUrl + "iPG/tip/a_collect.htm","收藏已达到最大收藏记录数");	
						return;
					}
					var bookmarkedId = _dataJson.bookmarkedId;
					if(bookmarkedId==0){
						collectFlag=true;
						var allsetName_char=assetName.replace(/[^\x00-\xff]/g, "**");
						var msg='';
						if(allsetName_char.length>47){
							msg="收藏节目成功！按遥控红色键可到‘点看记录’页面查看您收藏的节目！";
						}else {
						    msg="收藏节目("+assetName+")成功！按遥控红色键可到‘点看记录’页面查看您收藏的节目！";
						}
						showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
					}else{
						var msg=_dataJson.message;;
						showMsg(tipUrl + "iPG/tip/a_collect.htm", "系统繁忙！");
					}
				}
			};
			IEPG.getData(URL.VOD_addSavedProgram, VOD_saveVodFavorites);
		}
	},
	/** @description  推荐节目*/
	recmd : function(assetId,providerId,recommandPoint) {//推荐
		if(checkUser()){
			var recommandURL="<RecommandProgram assetId=\"" + assetId + "\" providerId=\"" + providerId+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
			if(recommandPoint!=""&& recommandPoint!=undefined){
				recommandURL="<RecommandProgram assetId=\"" + assetId + "\" recommandPoint=\"" + recommandPoint+"\" providerId=\"" + providerId+ "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>";
			}
			var VOD_recommendAsset = {
				"data":recommandURL,
				"callBack" : function(_dataJson) {
					if(_dataJson.code){
						showMsg(tipUrl + "iPG/tip/a_collect.htm",_dataJson.message );
						return;
					}
					var result = _dataJson.recommandTimes;
					var recommandPoint = _dataJson.recommandPoint;
					if(result){		
						setGlobalVar("recmdId",assetId);			
						var msg = "推荐成功，感谢您的参与！目前有" + result + "位用户推荐该节目！";
						showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
						$("recmdCount").innerHTML = result;
					}else if(recommandPoint){
						gradeTipFlag=false;
						$("grade").src = skinImgUrl + "star_blue/star" + Math.ceil(recommandPoint) + ".png";
					}
				}
			};
			IEPG.getData(URL.VOD_recommendAsset, VOD_recommendAsset);
		}
	},
	/** @description  连续剧追剧*/
	playHis : function(_columnMapId) {
		var VOD_addTeleplayHis = {
			"param" : {
				"columnMapId" : _columnMapId
			},
			"callBack" : function(_dataJson) {
				if(_dataJson.errorCode == "200") {
					var msg = "本节目追剧成功，精彩敬请期待！";
					showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
				}
			}
		};
		IEPG.getData(URL.VOD_addTeleplayHis, VOD_addTeleplayHis);
	}
};

//****************时间秒转换为00：00：00格式**********************
function convertToShowTime(second) {
	if(isNaN(second) || second < 0)
		second = 0;
	var hh = parseInt(second / 3600);
	var mm = parseInt((second % 3600) / 60);
	var ss = (second % 3600) % 60;
	return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}

function addZero(val) {
	if(val < 10){
		return "0" + val;
	}
	return val;
}

/**
 * @description subText 汉字与字符都都在时截取长度
 * @param {string} _str 需要截取的字符串
 * @param {string} _subLength 页面上展示字符串的长度（汉字个数*2）
 * @param {number} _num 是否滚动（num等于0时字符截取，num等于1时数据进行滚动）
 */

IEPG.subText = function(_str, _subLength, _num) {
	var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
	var temp2 = temp1.substring(0, _subLength);
	var x_length = temp2.split("\*").length - 1;
	var hanzi_num = x_length / 2;
	_subLength = _subLength - hanzi_num;
	var res = _str.substring(0, _subLength);
	if(_num === 0) {
		if(_subLength < _str.length) {
			res = res + "...";
		}
		return res;
	} else {
		if(_subLength < _str.length) {
			return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='100' id='marqueeId' >" + _str + "</marquee>";
		}
		return _str;
	}
};
/*var MyMmar11;
IEPG.subText = function(_str, _subLength, _num) {
var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
var temp2 = temp1.substring(0, _subLength);
var x_length = temp2.split("\*").length - 1;
var hanzi_num = x_length / 2;
_subLength = _subLength - hanzi_num;
var res = _str.substring(0, _subLength);
if(_num === 0) {
if(_subLength < _str.length) {
res = res;
}
return res;
} else {

//clearInterval(MyMmar);
if(_subLength < _str.length) {
MyMmar11=setInterval(marqpuee22,5);
return "<span id='div1' style='width:auto;height:auto;overflow:hidden;white-space:nowrap;display:block;'><span id='div4' style='float:left;display:block;'><span id='div2' style='float:left;'>" + _str + "&nbsp&nbsp</span><span id='div3' style='float:left;'></span></span></span>";
} else {
return _str;
}
}
};

function marqpuee22(){
var s1=document.getElementById("div1");
var s2=document.getElementById("div2");
var s3=document.getElementById("div3");
var s4=document.getElementById("div4");
s4.style.width=(s2.offsetWidth*2)+"px";
s3.innerHTML=s2.innerHTML;
if(s2.offsetWidth<=s1.scrollLeft){
s1.scrollLeft-=s2.offsetWidth;
}else{
s1.scrollLeft++;
}
}*/

//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(_url, _param) {
	var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url), tmp;
	if( tmp = rs) {
		return tmp[2];
	}
	return "";
}

/*替换字符串中参数的值searchStr：查找的字符串，replaceVal：替换的变量值
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function(_replaceVal, _searchStr) {
	var restr = _searchStr + "=" + _replaceVal;
	var rs = new RegExp("(^|)" + _searchStr + "=([^\&]*)(\&|$)", "g").exec(this), tmp;
	var val = null;
	if( tmp = rs) {
		val = tmp[2];
	}
	if(val == null) {
		if(this.lastIndexOf("&") == this.length - 1) {
			return this + restr;
		} else if(this.lastIndexOf("?") >= 0) {
			return this + "&" + restr;
		}
		return this + "?" + restr;
	}
	var shs = _searchStr + "=" + val;
	if(this.lastIndexOf("?" + shs) >= 0) {
		return this.replace("?" + shs, "?" + restr);
	}
	return this.replace("&" + shs, "&" + restr);
};

//页面做分页处理时，pageLength：总数据长度，pageSize：页面可显示的数据长度
function getMaxPage(_pageLength, _pageSize) {//求最大页数
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return Math.ceil(_pageLength / _pageSize);
	}
	return _pageLength / _pageSize;
}

function getMaxPageSize(_pageLength, _pageSize) {//求为最大页数时pagesize
	if(_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if(_pageLength % _pageSize != 0) {
		return _pageLength % _pageSize;
	}
	return _pageSize;
}

//******************************* 真焦点处理 *********************************
// inputs 标签状态保存
var inputsStates;
//将页面上所有的标签都设为可用
function enabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = false;
	}
}

//将页面上所有的标签都设为不可用
function disabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	inputsStates = new Array(inputs.length);
	for(var i = 0; i < inputs.length; i++) {
		inputsStates[i] = inputs[i].disabled;
		inputs[i].disabled = true;
	}
}

//*************************** 消息弹出框 ***********************************
/**
 * @description subText 消息弹出框，显示提示信息,传入 空,弹出服务器忙的提示
 */

//弹出框div的ID
var tipDivId = "tip_visibility";
//显示消息文字的div的ID
var messInfoId = "tip_window";
//弹出窗口之前有焦点的对象
var lastObj;
//弹出框标识，true为有弹出框，默认为false；
var tipFlag = false;
var OKButtonId = "OKButton";
var cancelButtonId = "cancle";
var timer;
function showMsg(url, msg) {
	clearTimeout(timer);
	if(!tipFlag){// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
		lastObj = document.activeElement;
		disabledAll();
	}
	var tipDiv = $(tipDivId);
	if(tipDiv)tipDiv.style.display = "block";
	var tipWindow = $(messInfoId);
	if(url == "") {
		url = tipUrl + "iPG/tip/a_busyInfo.htm";
		if(msg == "") {
			msg = "系统忙，请稍后再试！";
		}
	}
	new ajax({
		"url" : url,
		"handler" : function(resText) {
			tipDiv.style.visibility = "visible";
			tipWindow.innerHTML = resText;
			tipFlag = true;
			if(resText.indexOf("a_searchTip") >= 0) {    //搜索提示框
				searchTipFlag = true;
				$('search_Input').focus();
				return;
			}
			$("message").innerHTML = msg;
			if($(OKButtonId)){   //弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
				$(OKButtonId).focus();
			}
			if(resText.indexOf("a_buyTip") >= 0) {
				$(OKButtonId).onclick = function() {
					Buy.doBuy();//提示购买时按确认键购买
				};
			}else if(resText.indexOf("a_buyPkgTip") >= 0) {
				$(OKButtonId).onclick = function() {
					Buy.doBuy();//提示购买时按确认键购买
				};
				$(cancelButtonId).onclick = function() {
					Buy.chargeMode = "6";
					Buy.doBuy();//提示购买时按确认键购买
				};
			} else if(resText.indexOf("a_buyTvplayTip") >= 0) {
				$("OKButton").onclick = function() {
					Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
					IEPG.doPlay();
					//Buy.getPrice();//单集按次
				};
				$("OKButton1").onclick = function() {
					Buy.goodsId = detailJson.goodsId;
					IEPG.doPlay();
					//Buy.goodsId=detailJson.goodsId;//整部按次
					//Buy.getPrice();
				};
			} else if(resText.indexOf("a_buyPackTip") >= 0) {
				$("OKButton").onclick = function() {
					if(productJson.implNum == 3){
						Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
						IEPG.doPlay();
					}else{
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					}						
				};
				if(productJson.implNum == 3){
					$("OKButton2").onclick = function() {//包月购买
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					};
				}
				
				$("OKButton1").onclick = function() {//包月购买
					IEPG.getMonthPriceToken();
				}
				
			}else if(resText.indexOf("a_buyOk") >= 0) {
				$(OKButtonId).onclick = function() {
					IEPG.doPlay();//订购成功后按确认键直接播放
				};
			} else if(resText.indexOf("a_breakTimeTip") >= 0) {
				$(OKButtonId).onclick = function() {
					Buy.buyPlayType = "1";
					//IEPG.doBookmarkPlay(getGlobalVar("timePosition"));//从断点处播放
					IEPG.doPlay();
					
				};
				$("rePlayButton").onclick = function() {
					//setGlobalVar("timePosition", "");
					Buy.buyPlayType = "0";
					IEPG.doPlay();//重新播放
				};
			}
		},
		"method":"post"
	});
	timer=setTimeout(function(){
				closeTip();		
	},8000);
}

function closeTip() {//关闭提示信息
	var tipDiv = $(tipDivId);
	var tipWindow = $(messInfoId);
	if(tipWindow) {
		tipDiv.style.visibility = "hidden";
		tipWindow.innerHTML = "";
		//$("message").innerHTML = "";
	}
	tipFlag = false;
	collectFlag=false;
	mediaTipFlag = false;
	searchTipFlag = false;
	gradeTipFlag=false;
	enabledAll();
	if(lastObj) {
		lastObj.focus();
	}
	return false;
}

/**
 * @description  获取海报
 */
/*function getPoster(posterJson, width, height){
	var suitPoster = -1;
	var variance = 999999;
    if(posterJson == undefined){
        return defaultPic;
    }
	for(var i = 0; i < posterJson.length; i++) {
		if((posterJson[i].width-width)*(posterJson[i].height-height) < variance) {
			variance = (posterJson[i].width-width)*(posterJson[i].height-height);
			suitPoster = i;
		}
	}
	if(posterJson.length != 0 && suitPoster != -1){
		return goUrl+"/"+posterJson[suitPoster].posterUrl;
	}else{
		return defaultPic;
	}
}*/


/**
 * 获取海报，最新的方法
 */
function gPoster(imageList,width,height){
	var picUrl = defaultPic;
	var standard = 999999;
	if(imageList){
		for(var i = 0; i < imageList.length; i++){
			var imgUrl = imageList[i].posterUrl || imageList[i].displayUrl;
			getImgSize(imageList[i]);
			var distance = Math.sqrt((imageList[i].width - width)*(imageList[i].width - width) + (imageList[i].height - height)*(imageList[i].height - height));
			if(distance < standard){
				standard = distance;
				picUrl = goUrl+"/"+imgUrl;
			}
		}
		
	}
	return picUrl;
}
var getPoster=gPoster;
function getImgSize(imgJson){
	if(imgJson.width==0&&imgJson.width==0){
		var url = imgJson.posterUrl || imgJson.displayUrl;
		var width = url.split("/")[1].split("x")[0];
		var height = url.split("/")[1].split("x")[1];
		imgJson.width = parseInt(width,10);
		imgJson.height = parseInt(height,10);
	}else{
			
	}
}



/*
 * @description debug函数为页码打印方式，可以替代alert对页面效果的影响。一个htm只能有一个Debug函数。
 * @param {object} _configs 可以为Array或者为json对象。
 */
function debug(_configs) {
	var paramArr = [], debugType = "0", arrLength;
	if( typeof _configs != "object") {
		return;
	}
	arrLength = _configs.length;
	if(arrLength == undefined) {
		var i = 0;
		for(var key in _configs) {
			paramArr[i] = key + "=" + _configs[key];
			i++;
		}
		arrLength = paramArr.length;
		debugType = "1";
	} else {
		arrLength = _configs.length;
	}
	var newDiv = document.createElement("div");
	newDiv.setAttribute("id", "DEBUG");
	newDiv.setAttribute("style", "background:#D6D6D6; width:auto; heigth:auto; position:absolute; left:50px; top:50px;")
	document.body.appendChild(newDiv);
	var obj = document.getElementById("DEBUG");
	for(var i = 0; i < arrLength; i++) {
		var testDiv = document.createElement("div");
		testDiv.setAttribute("id", "MSG_" + i);
		if(i % 2 == 0) {//偶数样式
			testDiv.setAttribute("style", "background:#A9A9A9;");
		}
		if(debugType == "0") {//为数组
			testDiv.innerHTML = "No." + i + " ==== " + _configs[i];
		} else {//为json对象
			var arr = paramArr[i].split("=");
			testDiv.innerHTML = arr[0] + " ==== " + arr[1];
		}
		obj.appendChild(testDiv);
	}
}

function clearMarquee() {//清除文字滚动循环，在失焦时调用
	if(marquee.obj == undefined)
		return;
	if(marquee.handle != undefined)
		clearInterval(marquee.handle);
	marquee.obj.style.position = marquee.oldPosition;
	marquee.obj.style.overflow = marquee.oldOverflow;
}

/**
 * conObj(contentObject):放置文字的组件对象
 * calObj(calculationObjcet):用于计算的组件对象，即文字过长的情况下，在该组件范围内进行滚动，该组件有显式定义的长宽
 * step：滚动步长，默认是文字宽度
 * delay：滚动频率
 * marqueeNum:文字长度上限(以半角字符为计数单位)，当文字长度超过这个范围，将进行滚动操作
 * content:文字内容，当conObj组件中存在该内容，该参数可以省略
 */
function marquee(conObj, calObj, step, delay, marqueeNum, content) {//文字过长时候的滚动操作
	if(marquee.handle != undefined)
		clearInterval(marquee.handle);
	var temp = (content != undefined && typeof content == "string") ? content : conObj.innerHTML;
	if(marqueeNum == undefined || getCharLength(temp) < marqueeNum) {
		conObj.innerHTML = temp;
		return;
	}
	var x = 0;
	marquee.obj = calObj;
	marquee.oldPosition = calObj.style.position;
	calObj.style.position = "relative";
	marquee.oldOverflow = calObj.style.overflow;
	calObj.style.overflow = "hidden";

	var w = calObj.offsetWidth;
	var h = calObj.offsetHeight;
	step = step ? step : parseInt(getCurrentStyle(calObj, "fontSize").replace("px", ""));
	var fragment = document.createDocumentFragment();
	for(var i = 0, ilen = w; i < ilen; i += step) {
		var rSpan = document.createElement("span");
		rSpan.style.display = "inline-block";
		rSpan.style.width = step + "px";
		fragment.appendChild(rSpan);
	}

	var lSpan = document.createElement("span");
	lSpan.style.display = "inline-block";
	lSpan.innerHTML = temp;

	var mainSpan = document.createElement("div");
	mainSpan.style.position = "absolute";
	mainSpan.style.height = h + "px";
	mainSpan.appendChild(lSpan);
	mainSpan.appendChild(fragment);
	mainSpan.style.left = "0px";

	conObj.innerHTML = "";
	conObj.appendChild(mainSpan);
	var finalW = mainSpan.offsetWidth;
	var oldW = finalW;
	marquee.handle = setInterval(function() {
		x -= step;
		mainSpan.style.left = x + "px";
		var newW = mainSpan.offsetWidth;
		if(newW <= oldW) {
			conObj.innerHTML = "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='" + step + "' scrolldelay='" + delay + "'>" + temp + "</marquee>";
			clearInterval(marquee.handle);
		} else {
			oldW += step;
		}
	}, delay);
}

//随机截取影片中的10分钟进行播放
function getRandomPlayTime(totalTime) {
	var preplayTime = Math.floor(totalTime * 0.1);
	var vNum = Math.random();
	var startTime = Math.floor(vNum * (totalTime - preplayTime));
	var endTime = startTime + preplayTime;
	return [startTime, Math.min(endTime, totalTime), preplayTime];
}


function getCharLength(str) {
	var temp1 = str.replace(/[^\x00-\xff]/g, "**");
	return temp1.split("\*").length - 1;
}

/**
 * @description 焦点滑动实现函数
 * @param {String}
 *            _divId 滑动的焦点层ID
 * @param {Number}
 *            _preTop 滑动前的top值
 * @param {Number}
 *            _top 滑动后的top值
 * @param {String}
 *            _moveDir 滑动方向，V纵向，H横向
 * @param {Number}
 * 			  _percent 滑动系数  默认0.7
 * @return null
 */
function slide(_divId, _preTop, _top, _moveDir, _percent) {
	if( typeof (_divId) != 'undefined' && typeof (_preTop) != 'undefined' && typeof (_top) != 'undefined' && typeof (_moveDir) != 'undefined') {
		this.focusId = _divId;
		this.preTop = _preTop;
		this.focusTop = _top;
		this.moveDir = _moveDir;
	}
	var moveStep = (this.focusTop - this.preTop) * _percent;
	if(Math.abs(moveStep) > 3) {
		this.preTop += moveStep;
		if(this.moveDir == "V") {
			$(this.focusId).style.top = this.preTop + "px";
		} else {
			$(this.focusId).style.left = this.preTop + "px";
		}
		clearTimeout(this.slideTimer);
		this.slideTimer = setTimeout(slide, 1);
	} else {
		if(moveDir == "V") {
			$(this.focusId).style.top = this.focusTop + "px";
		} else {
			$(this.focusId).style.left = this.focusTop + "px";
		}
	}
}

/**
 * @description 获取推荐值
 * @param {String}
 *            _divId 滑动的焦点层ID
 * @return null
 */
function getLevel(levelJson){
    if (levelJson == "") {
        levelJson = 0;
    }
    else 
        if (levelJson > 5) {
            levelJson = 5;
        }
    return levelJson;
}



