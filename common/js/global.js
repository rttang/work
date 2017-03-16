//var MAPIP = "172.21.12.17";
var MAPIP = "10.2.4.120";
var MAPPort = "554";
//var portalIP = "172.21.12.3";
var portalIP = "10.2.4.66";
var portalPort = "8080";

/** @description npvrServiceUrl npvr狝?竟IPport*/
//var npvrServiceUrl = "h:ttp://172.21.11.86/iPG/T-nsp/";
/** @description videoUrl index?い冀瑈 */
//var videoUrl = "delivery://490000.6875.64QAM.1901.515.515";
/* @description Ы?禜**/
var V, IEPG = V = IEPG || {};

/** @description epgUrl ??家狾隔?1HD_blue?*/
var epgUrl = location.href.split("/template")[0];
var goUrl = location.href.split("/iPG")[0];  // such as:http://172.21.12.12:8080
//var tipUrl = goUrl+"/iPG/";    // ?玡?隔?
var tipUrl = "http://10.2.4.60:8080/iPG/"
var epgVodUrl = "../../";

/* @description 紇???纐??    **/
var defaultPic = "/iPG/common/images/no_pic_m.jpg";
var bigDefaultPic = "/iPG/common/images/no_pic_b.jpg";
var skinImgUrl = "skin/images/";
/* @description ?栋???    **/
var mediaTipFlag = false;
/* @description 穓???    **/
var searchTipFlag = false;
/* @description ?????    **/
var buyTip = false;
/* @description ???????    **/
var tryBuyTip = false;
/* @description Μ旅Θ???Μ旅Θ?︹??иΜ旅 **/
var collectFlag = false;
/* @description ?だ??в **/
var gradeTipFlag = false;
/* XML?―?誹?场 */
var xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
/*XML?―?誹ゲ恶??*/
var portalId = 102;
/*XML?―?誹ゲ恶??  ?*/
var cardId = getSmartCardId();
//var cardId ="8001002110042106";
/** userId ?ノ?ID */
var userId = getUserId();

//userId = cardId = "8851002922709109";

//var userId="LONGVision";
//var userId="wxy00001";
var comeFromTip;
var isComeFrompkgChargeMode1 = false;

var buyFlag = false;
var appFlag = true;

/** @description ?﹚? */
var KEY = {
	"ZERO": 48,
	"ONE": 49,
	"TWO": 50,
	"THREE": 51,
	"FOUR": 52,
	"FIVE": 53,
	"SIX": 54,
	"SEVEN": 55,
	"EIGHT": 56,
	"NINE": 57,

	"HOME": 468,
	"LEFT": 37,
	"RIGHT": 39,
	"UP": 38,
	"DOWN": 40,
	"ENTER": 13,
	"PREV": 33,
	"NEXT": 34,
	"QUIT": 27,
	"RED": 403,
	"GREEN": 404,
	"YELLOW": 405,
	"BLUE": 406,
	"PLAY": 3864,
	"PLAY1": 3862,
	"SEARCH": 3880,
	"SEARCH_N": 4117,
	"SEARCH_G": 84, //google穓 T?

	"UP_N": 87, //N9101舶?
	"DOWN_N": 83,
	"LEFT_N": 65,
	"RIGHT_N": 68,
	"ENTER_N": 10,
	"PREV_N": 306,
	"NEXT_N": 222, //?222     ?307
	"QUIT_N": 72,
	"RED_N": 320,
	"GREEN_N": 323,  //? 323      ?321
	"YELLOW_N": 321, //? 321      ?322
	"BLUE_N": 322,   //? 322      ?323
	"PLAY_N": 59,     //?59        ?39

	"BACK": 8,
	"RETURN": 640,
	"RETURN_N": 69,
	"RED_T": 82, //E600??竟??
	"YELLOW_T": 89, //E600??竟??
	"BLUE_T": 66, //E600??竟??
	"GREEN_T": 71, //E600??竟??
	"STATIC": 67,
	"VOICEUP": 61,
	"VOICEDOWN": 45
};

function New(aClass, params) {
	function _new() {
		if (aClass.initializ) {
			aClass.initializ.call(this, params);
		}
	}

	_new.prototype = aClass;
	return new _new();
}

Object.extend = function (destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

/**
 * @description $ 蠢document.getElementById
 * @param {string} _id ??DIVid
 */
var $ = function (_id) {
	return typeof _id == 'string' ? document.getElementById(_id) : _id;
};
var G = function (_object, _attribute) {
	if (_object == undefined || _object.getAttribute(_attribute) == null || _object.getAttribute(_attribute) == undefined) {
		return "";
	} else {
		return _object.getAttribute(_attribute);
	}
};
var tags = function (_object, _tagname) {
	if (_object == undefined || _object.getElementsByTagName(_tagname) == null || _object.getElementsByTagName(_tagname) == undefined) {
		return null;
	} else {
		return _object.getElementsByTagName(_tagname);
	}
};

var changeBg = function (id, url) {//э?璉春?
	if (url.indexOf("url") >= 0) {
		$(id).style.background = url + " no-repeat";
	} else {
		$(id).style.background = "url(" + url + ") no-repeat";
	}
};

function changeObjClass(id, className) {//э??禜?Α
	$(id).className = className;
}

function getGrade(_recomdLevel) {
	var curGrade = "";
	if (_recomdLevel == 0) {
		curGrade = 3;
	} else {
		curGrade = _recomdLevel;
	}
	return curGrade;
}

/**
 * @description trim 奔才﹃玡
 * @param {string} _str 惠璶?瞶才﹃
 */
function trim(_str) {
	return _str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * @description getUserId AAA?userIdㄑ??―?誹ノ??琌?―?誹urlゲ?琿
 */
function getUserId() {//?userId
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
}//?醇?
//*********** ??巨??琩CA㎝uerId  **************

function checkUser() {
	var userId = getUserId();
	if (userId == "" || userId == "0" || userId == undefined) {
		showMsg(tipUrl + "iPG/tip/a_collect.htm", "??ア???琩审?舶㎝醇");
		return false;
	}
	return true;
}

//?琩醇础┺
document.onsystemevent = function (e) {
	var code = e.which || e.keyCode;
	var keyType = e.type ? e.type : 1001;
	if (keyType == 1001) {
		switch (code) {
			case 40070://い础
			case 11703://玭础
				break;
			case 40071://い砆┺
			case 11704://玭砆┺
				showMsg(tipUrl + "iPG/tip/a_collect.htm", "??ア???琩审?舶㎝醇");
				break;
			case 10902:
			case 40201://冀瑈ゅン?
				break;
			case 10901:
			case 40200://冀瑈ゅンЮ
				playNextNews();//冀?穝?
				break;
			default:
				break;
		}
	}
};


/**
 * @description ?cookie?竚Ы??
 * @param {string} _sName Ы???
 * @param {string} _sValue Ы????
 */

function setGlobalVar(_sName, _sValue) {
	try {
		_sValue = _sValue + "";
		if (Utility.setEnv) {
			Utility.setEnv(_sName, _sValue);
		} else {
			SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue));//9101
		}
	} catch (e) {
		document.cookie = escape(_sName) + "=" + escape(_sValue);
	}
}

/**
 * @description ?cookie?Ы??
 * @param {string} _sName Ы?????setGlobalVarよ猭い_sName
 * @return {string} result ??setGlobalVarよ猭い_sValue
 */

function getGlobalVar(_sName) {
	var result = "";
	try {
		if (Utility.getEnv) {
			result = Utility.getEnv(_sName);
		} else {
			result = decodeURIComponent(SysSetting.getEnv(_sName));//9101
		}
		if (result == "undefined") {
			result = "";
		}
	} catch (e) {
		var aCookie = document.cookie.split("; ");
		for (var i = 0; i < aCookie.length; i++) {
			var aCrumb = aCookie[i].split("=");
			if (escape(_sName) == aCrumb[0]) {
				result = unescape(aCrumb[1]);
				break;
			}
		}
	}
	return result;
}


//----------------------  隔??巨 start---------------------------------------------------------//
var urlSplitChar = "#";//URLぇ?だ筳才皌猔種谔玂ぃ?蒓URL??蝋
var urlPathGlobalName = "urlPathGlobalName";//Ы?秖
/*
 * Τ?铬????ノ ノ?玂?玡?URLURL ぇ? urlSplitChar ?だ筳
 * ?ノよ猭ぇ玡?惠璶玂ㄤウ?秖惠璶巨
 */
globalPath = {};
globalPath.setUrl = saveUrlPath;
function saveUrlPath() {//玂??隔?
	var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "" : getGlobalVar(urlPathGlobalName);//Ы?秖
	var urlArr = tempUrl.split(urlSplitChar);
	if (urlArr[urlArr.length - 1].split("?")[0] == location.href.split("?")[0]) {
		tempUrl = tempUrl
	} else {
		tempUrl = tempUrl + urlSplitChar + location.href;//?隔?㎝?玡URLぇ?だ筳才
	}
	var arr = tempUrl.split(urlSplitChar);
	if (arr.length > 6) {
		var removeLength = arr.length - 6;
		var newArr = arr.slice(removeLength);//?﹚竚?﹍蝋??程
		tempUrl = arr[1] + urlSplitChar + newArr.join(urlSplitChar);//玂痙???い材?隔?portal?隔?
	}
	setGlobalVar(urlPathGlobalName, tempUrl);//玂
}
globalPath.getUrl = goReturnUrlPath;
function goReturnUrlPath() {//隔?
	var tempUrl = getGlobalVar(urlPathGlobalName);//Ы?秖
	var tuArr = tempUrl.split(urlSplitChar);
	var tl = tuArr.length;
	var tul = tuArr.pop();//簿埃??い程?じ?じ?ń琌程玂url隔?
	if (tul.split("?")[0] == location.href.split("?")[0]) {
		tul = tuArr.pop();
	}
	if (!tul || tul == "") {
		Utility.ioctlWrite("LOGICNUM_ALLOW", "Action:true");
		tul = getGlobalVar("PORTAL_ADDR");
	}
	var newUrl = tuArr.join(urlSplitChar);//簿埃程?url隔??┮逞urlΩノ#だ筳才钡Θ?穝﹃玂Ы?秖い
	setGlobalVar(urlPathGlobalName, newUrl);
	location.href = tul;
}
globalPath.clearUrl = clearUrlPath;
function clearUrlPath() {//睲埃玂┮Τ隔?
	setGlobalVar(urlPathGlobalName, "");
}


var urlTopPathGlobalName = "urlPathGlobalName";//Ы?秖
function saveTopUrlPath() {
	var tempUrl = getGlobalVar(urlTopPathGlobalName) == undefined ? "" : getGlobalVar(urlTopPathGlobalName);
	tempUrl = tempUrl + urlSplitChar + location.href;
	var arr = tempUrl.split(urlSplitChar);
	if (arr.length > 6) {
		var removeLength = arr.length - 6;
		var newArr = arr.slice(removeLength);
		tempUrl = arr[1] + urlSplitChar + newArr.join(urlSplitChar);
	}
	setGlobalVar(urlTopPathGlobalName, tempUrl);
}

function goReturnTopUrlPath() {
	var tempUrl = getGlobalVar(urlTopPathGlobalName);
	var tuArr = tempUrl.split(urlSplitChar);
	var tl = tuArr.length;
	var tul = tuArr.pop();
	if (!tul || tul == "") {
		tul = getGlobalVar("PORTAL_ADDR");

	}
	var newUrl = tuArr.join(urlSplitChar);
	setGlobalVar(urlTopPathGlobalName, newUrl);
	Utility.setEnv("portal_Form", "");
	location.href = tul;
}

function clearUrlTopPath() {
	setGlobalVar(urlTopPathGlobalName, "");
}

function doReturnTopPress() {
	setGlobalVar("isBack", "Y");
	clearGlobalVar();
	goReturnTopUrlPath();
}

/**
 * @description showTime ノ?い??ら戳?ボ
 * @param {string} _objId 琌2D?い???禜琌divいid
 */
var showTime = {
	init: function () {
		if ($("time")) {
			this.getTime();
			setInterval(this.getTime, 60000);
		}
	},
	getTime: function () {
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		hour = hour < 10 ? "0" + hour : hour;
		minute = minute < 10 ? "0" + minute : minute;
		var time_ = hour + ":" + minute;
		if ($("week")) {
			var week = ["琍戳ら", "琍戳", "琍戳", "琍戳", "琍戳", "琍戳き", "琍戳せ"];
			var week_ = week[date.getDay()];
			$("week").innerHTML = week_;
		}
		if ($("date")) {
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
//?ら戳Α2013.05.02??Θ20130502000000  yyyyMMddhhmmssるら?だ
function dateFormat(date) {
	var dataArr = date.split(".");
	var dateStr = "";
	for (i = 0; i < dataArr.length; i++) {
		dateStr += dataArr[i];
	}
	dateStr += "000000";
	return dateStr;
}

//?03:10:02Α????Θ
function formateDate(date) {
	var dataArr = date.split(":");
	var hour = parseInt(dataArr[0], 10);
	var minute = parseInt(dataArr[1], 10);
	var second = parseInt(dataArr[2], 10);
	return hour * 3600 + minute * 60 + second;
}

function ajaxUrl(_url, _handler, _data) {
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if (window.XMLHttpRequest) {
			this.xmlHttp = new XMLHttpRequest();
			if (this.xmlHttp.overrideMimeType) {
				this.xmlHttp.overrideMimeType('text/xml');
			}
		} else {
			if (window.ActiveXObject) {
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
		this.xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					callBackData3(xmlHttp, _handler);
				} else {//禬??よ猭,????狝?竟Γ矗ボ
					showMsg("", "╰?Γ,?祔?");
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
	this.xmlHttp = null;
	this.createXMLHttpRequest = function () {
		if (window.ActiveXObject) {
			this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			this.xmlHttp = new XMLHttpRequest();
		}
	}
	this.getData = function () {
		this.createXMLHttpRequest();
		var xmlhttp = this.xmlHttp;
		var handler = this.handler;
		var obj = new Object();
		this.xmlHttp.open(this.method, this.url, true);
		this.xmlHttp.send(null);
		this.xmlHttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200 || xmlhttp.status == 0) {
					callBackData2(xmlhttp, handler);
				}
			}
		}
	}
	this.getData();
}

function callBackData2(_xmlHttp, _handler) {
	//var resText = parseJSON(_xmlHttp.responseText);
	_handler(_xmlHttp.responseText);
}
/**
 * @description ㄧ?ノ琌秆猂ajaxjson??誹??json?禜
 * @param {string} _data ajaxxmlHttp.responseText
 */

function parseJSON(_data) {
	if (typeof _data !== "string" || !_data) {
		return null;
	}
	//data = trim( data );
	if (_data.indexOf("a_") >= 0) {//ノshowMsgい?矗ボぃ琌jsonΑ
		return _data;
	}
	if (window.JSON && window.JSON.parse) {
		return window.JSON.parse(_data);
	} else {
		return eval("(" + _data + ")");
	}
}


/**
 * @description callBackData ?ajax?誹?︽??瞶
 * @param {object} xmlHttp ?ajaxxmlHttp?禜
 * @param {function} _handler ??―?誹Θ????ㄧ?
 */

function callBackData3(_xmlHttp, _handler) {
	var resText = _xmlHttp.responseText;
	resText = eval("(" + resText + ")");
	_handler(resText);
}

function getErrorMsg(errorMsg) {
	var errorTextMsg = errorMsg.message;
	if (errorTextMsg == "") {
		errorTextMsg = "╰?羉Γ?祔?";
	}
	var errorMessage = errorTextMsg + "  " + errorMsg.errorCode + " ";
	switch (errorMsg.errorCode) {
		case "12011086"://?ヘ獺ぃ
		case "122000020"://??ぃ?
		case "12200061"://?方ぃ┪?琜
		case "10000001"://╰??Γ,?祔
		case "10000002"://?方?ぃノ
		case "12200009"://ノ??
		case "2001"://ノ?獺ぃ
		case "-1"://?message獺
		case "2030"://AAA?方ぃ
			showMsg("", errorMessage);
			break;
		default:
			showMsg(tipUrl + "iPG/tip/a_collect.htm", errorMessage);
			break;
	}
}

var nowTip = "";
/** @description goToPortal ???俱蔨??︽?*/
//document.onkeyPress = globalEvent;
document.onkeydown = grabEvent;
var keycode;
function grabEvent(_e) {
	keycode = _e.keyCode || _e.which;
	if (tipFlag) {
		switch (keycode) {
			case KEY.BACK:
			case KEY.RETURN:
			case KEY.QUIT:
				_e.preventDefault();
				if (searchTipFlag) {//穓???瞶
					if (($("search_Input").value).length != 0) {
						deleteValue();
					} else {
						closeTip();
					}
				} else {//?纐??瞶
					closeTip();
				}
				break;
		}
	} else if (mediaTipFlag) {//?栋???
		switch (keycode) {
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
		switch (keycode) {
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
				doNumberKey(keycode, KEY.ZERO);
				break;
			case KEY.HOME://?
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
				//doEvent.back();
				doReturnKey();
				//closeTip();
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
				if (videoObj != undefined) {
					videoObj.resetStatic();
				}
				break;
			case KEY.VOICEUP:
			case KEY.VOICEDOWN:
				if (videoObj != undefined) {
					if (!isDisplayVoice()) {
						voice.displayVoice(true);
					} else {
						doVoice(keycode, _e);
					}
				}
				break;
			default:
				break;
		}
	}
}


//***************************     穓 ?﹍             *************************
/** @description 穓*/
function goToSearch() {
	saveUrlPath();
	saveTopUrlPath();
	if (typeof(columnId) == "undefined") {
		window.location.href = goUrl + "/iPG/search/search.htm";
	} else {
		window.location.href = goUrl + "/iPG/search/search.htm?columnId=" + columnId;
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
	if (keyWord == "") {
		$('search_Input').value = "?????︽穓";
	} else {
		saveUrlPath();
		window.location.href = 'search_list.htm?keyWord=' + keyWord;
	}
}

function onSearchButton(id) {
	var value = "";
	if ($("search_Input").value != "") {
		value = $("search_Input").value + id;
	} else {
		value += id;
	}
	$("search_Input").value = value;
}
//***************************     穓 ?             *************************


//---------------------- 0-9???ノよ猭-------------------------------
function goToRec(recJson) {
	if (recJson.length != 0) {//崩??誹?
		keycode = keycode - 49 >= -1 ? keycode - 49 : -2;
		if (keycode == -1) {
			keycode = 9;
		}
		if (recJson.length - 1 < keycode || keycode < 0) {//??ボ崩???
			return;
		} else {
			if (recJson[keycode].assetInfo.recordType == "pakg") {
				window.location.href = goUrl + "/iPG/detail/dsj_detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId + "&checkBookmark=Y&columnId=" + recJson[keycode].assetInfo.columnId;
			} else {
				window.location.href = goUrl + "/iPG/detail/detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].assetInfo.columnMapId + "&checkBookmark=Y&columnId=" + recJson[keycode].assetInfo.columnId;
			}
		}
	}
}

/** @description doRedKey ???瞶ㄧ???よ猭*/
/* function doNumberKey(){

 }*/

function doReturnKey() {
	setGlobalVar("isBack", "Y");//??ボY狦琌?ㄤ??玡??玂审?舶?秖
	clearGlobalVar();
	goReturnUrlPath();
	//doReturnTopPress();
}

/** @description doRedKey ?︹??瞶ㄧ?*/
function doRedKey() {//и?
	goToMyZone();
}

function goToMyZone() {
	saveUrlPath();
	saveTopUrlPath();
	window.location.href = goUrl + "/iPG/myzone/myZone_list.htm";
}

/** @description doGreenKey ?︹??瞶ㄧ?*/
function doGreenKey() {
	goToSearch();
}

/** @description doYellowKey ?︹??瞶ㄧ?*/
function doYellowKey() {
	clearUrlPath();
	clearUrlTopPath();
	location.href = Utility.getEnv("ROOT_PATH") + "help/user_docs.htm";
}

/** @description doBlueKey ?︹??瞶ㄧ?*/
function doBlueKey() {//?冀逼︽
	goToTop();
}

function goToTop() {
	saveUrlPath();
	saveTopUrlPath();
	window.location.href = goUrl + "/iPG/dbph/vod_top.htm";
}

/** @description doPositionKey ﹚??瞶ㄧ?*/
function doPositionKey() {//穓
	goToSearch();
}

function doPortalKey() {//??睲埃Ы?秖portal?
	//clearGlobalVar();//??よ猭
	goToPortal();
}

/** @description goToPortal portal?瞶ㄧ?*/
function goToPortal() {//睲埃隔?
	clearUrlPath();
	clearUrlTopPath();
	location.href = getGlobalVar("PORTAL_ADDR");
}

function clearGlobalVar() {

}

var doEvent = {
	/** @description  ?︹??瞶ㄧ?*/
	red: function () {
		goTo.myZone("collect_list.htm?type=0");
	},
	/** @description  ?︹??瞶ㄧ?*/
	green: function () {
		goTo.myZone("collect_list.htm?type=1");
	},
	/** @description  ?︹??瞶ㄧ?*/
	yellow: function () {
	},
	/** @descript
	 * ion  ?︹??瞶ㄧ?*/
	blue: function () {
		goTo.top("top.htm");
	},
	/** @description  ??瞶ㄧ?*/
	back: function () {
		if (!buyFlag) {
			goTo.back();
		} else {
			closeTip();
		}
	},
	/** @description  ???瞶ㄧ?*/
	home: function () {
		goTo.portal();
	},
	/** @description  ﹚??瞶ㄧ?*/
	position: function () {
		goTo.search("search.htm");
	}
};

/** @description ???铬?*/
var goTo = {
	/** @description  ??*/
	list: function (_pageType, _columnId) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnId=" + _columnId;
	},
	/** @description  ??薄?_columnMapId 碈?ID_recordType ?紇???columnId?ヘID*/
	detail: function (_pageType, _columnMapId, _recordType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType + "?columnMapId=" + _columnMapId + "&columnId=" + columnId + "&recordType=" + _recordType;
	},
	/** @description  ??冀逼︽*/
	top: function (_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  ?и?*/
	myZone: function (_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  ?и穓*/
	search: function (_pageType) {
		globalPath.setUrl();
		window.location.href = epgUrl + _pageType;
	},
	/** @description  癶portal?*/
	portal: function () {
		globalPath.cleanUrl();
		location.href = getGlobalVar("portalIndexUrl");
	},
	/** @description  ヘ?*/
	back: function () {
		if (appFlag) {
			globalPath.getUrl();
			setGlobalVar("isBack", "Y");
		} else {
			doBackEvent();
		}
	}
};

var doExecute = {
	/** @description  Μ旅?ヘVOD?冀(?纐?)  BTV  nPVR??钩 VODPkg碈?*/
	collect: function (columnId, assetId, assetName, custom) {
		if (checkUser()) {
			columnId = "123";//?ヘID?玂?folderAssetIdぃ?
			var VOD_saveVodFavorites = {
				"data": "<AddBookmark titleAssetId=\"" + assetId + "\" custom=\"" + custom + "\" folderAssetId=\"" + columnId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>",
				"callBack": function (_dataJson) {
					if (_dataJson.code) {
						showMsg(tipUrl + "iPG/tip/a_collect.htm", "Μ旅?程Μ旅???");
						return;
					}
					var bookmarkedId = _dataJson.bookmarkedId;
					if (bookmarkedId == 0) {
						collectFlag = true;
						var allsetName_char = assetName.replace(/[^\x00-\xff]/g, "**");
						var msg = '';
						if (allsetName_char.length > 47) {
							msg = "Μ旅?ヘΘ?北?︹?ˉ???ˇ?琩眤Μ旅?ヘ";
						} else {
							msg = "Μ旅?ヘ(" + assetName + ")Θ?北?︹?ˉ???ˇ?琩眤Μ旅?ヘ";
						}
						showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
					} else {
						var msg = _dataJson.message;
						;
						showMsg(tipUrl + "iPG/tip/a_collect.htm", "╰?羉Γ");
					}
				}
			};
			IEPG.getData(URL.VOD_addSavedProgram, VOD_saveVodFavorites);
		}
	},
	/** @description  崩?ヘ*/
	recmd: function (assetId, providerId, recommandPoint) {//崩
		if (checkUser()) {
			var recommandURL = "<RecommandProgram assetId=\"" + assetId + "\" providerId=\"" + providerId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>";
			if (recommandPoint != "" && recommandPoint != undefined) {
				recommandURL = "<RecommandProgram assetId=\"" + assetId + "\" recommandPoint=\"" + recommandPoint + "\" providerId=\"" + providerId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>";
			}
			var VOD_recommendAsset = {
				"data": recommandURL,
				"callBack": function (_dataJson) {
					if (_dataJson.code) {
						showMsg(tipUrl + "iPG/tip/a_collect.htm", _dataJson.message);
						return;
					}
					var result = _dataJson.recommandTimes;
					var recommandPoint = _dataJson.recommandPoint;
					if (result) {
						setGlobalVar("recmdId", assetId);
						var msg = "崩Θ稰?眤?蒓ヘ玡Τ" + result + "ノ?崩??ヘ";
						showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
						$("recmdCount").innerHTML = result;
					} else if (recommandPoint) {
						gradeTipFlag = false;
						$("grade").src = skinImgUrl + "star_blue/star" + Math.ceil(recommandPoint) + ".png";
					}
				}
			};
			IEPG.getData(URL.VOD_recommendAsset, VOD_recommendAsset);
		}
	},
	/** @description  ???發?*/
	playHis: function (_columnMapId) {
		var VOD_addTeleplayHis = {
			"param": {
				"columnMapId": _columnMapId
			},
			"callBack": function (_dataJson) {
				if (_dataJson.errorCode == "200") {
					var msg = "セ?ヘ發?Θ弘眒穛?戳";
					showMsg(tipUrl + "iPG/tip/a_collect.htm", msg);
				}
			}
		};
		IEPG.getData(URL.VOD_addTeleplayHis, VOD_addTeleplayHis);
	}
};

//****************?????000000Α**********************
function convertToShowTime(second) {
	if (isNaN(second) || second < 0)
		second = 0;
	var hh = parseInt(second / 3600);
	var mm = parseInt((second % 3600) / 60);
	var ss = (second % 3600) % 60;
	return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}

function addZero(val) {
	if (val < 10) {
		return "0" + val;
	}
	return val;
}

/**
 * @description subText ?蒓才常常?篒?
 * @param {string} _str 惠璶篒才﹃
 * @param {string} _subLength ?甶ボ才﹃????*2
 * @param {number} _num 琌??num单0?才篒num单1??誹?︽??
 */

IEPG.subText = function (_str, _subLength, _num) {
	var temp1 = _str.replace(/[^\x00-\xff]/g, "**");
	var temp2 = temp1.substring(0, _subLength);
	var x_length = temp2.split("\*").length - 1;
	var hanzi_num = x_length / 2;
	_subLength = _subLength - hanzi_num;
	var res = _str.substring(0, _subLength);
	if (_num === 0) {
		if (_subLength < _str.length) {
			res = res + "...";
		}
		return res;
	} else {
		if (_subLength < _str.length) {
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

//******************************* urlい???  **********************************************
//?urlいparam??  ㄒvar serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(_url, _param) {
	var rs = new RegExp("(^|)" + _param + "=([^\&]*)(\&|$)", "g").exec(_url), tmp;
	if (tmp = rs) {
		return tmp[2];
	}
	return "";
}

/*蠢?才﹃い??searchStr琩т才﹃replaceVal蠢??秖
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function (_replaceVal, _searchStr) {
	var restr = _searchStr + "=" + _replaceVal;
	var rs = new RegExp("(^|)" + _searchStr + "=([^\&]*)(\&|$)", "g").exec(this), tmp;
	var val = null;
	if (tmp = rs) {
		val = tmp[2];
	}
	if (val == null) {
		if (this.lastIndexOf("&") == this.length - 1) {
			return this + restr;
		} else if (this.lastIndexOf("?") >= 0) {
			return this + "&" + restr;
		}
		return this + "?" + restr;
	}
	var shs = _searchStr + "=" + val;
	if (this.lastIndexOf("?" + shs) >= 0) {
		return this.replace("?" + shs, "?" + restr);
	}
	return this.replace("&" + shs, "&" + restr);
};

//?暗だ??瞶?pageLength??誹?pageSize??ボ?誹?
function getMaxPage(_pageLength, _pageSize) {//―程??
	if (_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if (_pageLength % _pageSize != 0) {
		return Math.ceil(_pageLength / _pageSize);
	}
	return _pageLength / _pageSize;
}

function getMaxPageSize(_pageLength, _pageSize) {//―?程???pagesize
	if (_pageLength == 0 || _pageLength == undefined) {
		return 0;
	}
	if (_pageLength % _pageSize != 0) {
		return _pageLength % _pageSize;
	}
	return _pageSize;
}

//******************************* 痷礘??瞶 *********************************
// inputs ????玂
var inputsStates;
//??┮Τ??常??ノ
function enabledAll() {//┮Τ input ??
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = false;
	}
}

//??┮Τ??常??ぃノ
function disabledAll() {//┮Τ input ??
	var inputs = document.getElementsByTagName("input");
	inputsStates = new Array(inputs.length);
	for (var i = 0; i < inputs.length; i++) {
		inputsStates[i] = inputs[i].disabled;
		inputs[i].disabled = true;
	}
}

//*************************** ? ***********************************
/**
 * @description subText ??ボ矗ボ獺,? ,?狝?竟Γ矗ボ
 */

//?divID
var tipDivId = "tip_visibility";
//?ボゅdivID
var messInfoId = "tip_window";
//?怠ぇ玡Τ礘??禜
var lastObj;
//???true?Τ?纐??false
var tipFlag = false;
var OKButtonId = "OKButton";
var cancelButtonId = "cancle";
var timer;
function showMsg(url, msg) {
	clearTimeout(timer);
	if (!tipFlag) {// 狦?玡??Τ?怠,?惠璶玂?玡礘??禜㎝??Τ??
		lastObj = document.activeElement;
		disabledAll();
	}
	var tipDiv = $(tipDivId);
	if (tipDiv)tipDiv.style.display = "block";
	var tipWindow = $(messInfoId);
	if (url == "") {
		url = tipUrl + "iPG/tip/a_busyInfo.htm";
		if (msg == "") {
			msg = "╰?Γ?祔?";
		}
	}
	new ajax({
		"url": url,
		"handler": function (resText) {
			tipDiv.style.visibility = "visible";
			tipWindow.innerHTML = resText;
			tipFlag = true;
			if (resText.indexOf("a_searchTip") >= 0) {    //穓矗ボ
				searchTipFlag = true;
				$('search_Input').focus();
				return;
			}
			$("message").innerHTML = msg;
			if ($(OKButtonId)) {   //?怠谔﹚?Idゲ?? OKButton ,OKButton??怠?ノID
				$(OKButtonId).focus();
			}
			if (resText.indexOf("a_buyTip") >= 0) {
				$(OKButtonId).onclick = function () {
					Buy.doBuy();//矗ボ???谔????
				};
			} else if (resText.indexOf("a_buyPkgTip") >= 0) {
				$(OKButtonId).onclick = function () {
					Buy.doBuy();//矗ボ???谔????
				};
				$(cancelButtonId).onclick = function () {
					Buy.chargeMode = "6";
					Buy.doBuy();//矗ボ???谔????
				};
			} else if (resText.indexOf("a_buyTvplayTip") >= 0) {
				$("OKButton").onclick = function () {
					Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
					IEPG.doPlay();
					//Buy.getPrice();//?栋Ω
				};
				$("OKButton1").onclick = function () {
					Buy.goodsId = detailJson.goodsId;
					IEPG.doPlay();
					//Buy.goodsId=detailJson.goodsId;//俱场Ω
					//Buy.getPrice();
				};
			} else if (resText.indexOf("a_buyPackTip") >= 0) {
				$("OKButton").onclick = function () {
					if (productJson.implNum == 3) {
						Buy.goodsId = mediaListJson[tempMedaiFocus].goodsId;
						IEPG.doPlay();
					} else {
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					}
				};
				if (productJson.implNum == 3) {
					$("OKButton2").onclick = function () {//る??
						Buy.goodsId = detailJson.goodsId;
						IEPG.doPlay();
					};
				}

				$("OKButton1").onclick = function () {//る??
					IEPG.getMonthPriceToken();
				}

			} else if (resText.indexOf("a_buyOk") >= 0) {
				$(OKButtonId).onclick = function () {
					IEPG.doPlay();//??Θ谔??钡冀
				};
			} else if (resText.indexOf("a_breakTimeTip") >= 0) {
				$(OKButtonId).onclick = function () {
					Buy.buyPlayType = "1";
					//IEPG.doBookmarkPlay(getGlobalVar("timePosition"));//????冀
					IEPG.doPlay();

				};
				$("rePlayButton").onclick = function () {
					//setGlobalVar("timePosition", "");
					Buy.buyPlayType = "0";
					IEPG.doPlay();//穝冀
				};
			}
		},
		"method": "post"
	});
	timer = setTimeout(function () {
		closeTip();
	}, 8000);
}

function closeTip() {//??矗ボ獺
	var tipDiv = $(tipDivId);
	var tipWindow = $(messInfoId);
	if (tipWindow) {
		tipDiv.style.visibility = "hidden";
		tipWindow.innerHTML = "";
		//$("message").innerHTML = "";
	}
	tipFlag = false;
	collectFlag = false;
	mediaTipFlag = false;
	searchTipFlag = false;
	gradeTipFlag = false;
	enabledAll();
	if (lastObj) {
		lastObj.focus();
	}
	return false;
}

/**
 * @description  ??
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
 * ??程穝よ猭
 */
function gPoster(imageList, width, height) {
	var picUrl = defaultPic;
	var standard = 999999;
	if (imageList) {
		for (var i = 0; i < imageList.length; i++) {
			var imgUrl = imageList[i].posterUrl || imageList[i].displayUrl;
			getImgSize(imageList[i]);
			var distance = Math.sqrt((imageList[i].width - width) * (imageList[i].width - width) + (imageList[i].height - height) * (imageList[i].height - height));
			if (distance < standard) {
				standard = distance;
				picUrl = goUrl + "/" + imgUrl;
			}
		}

	}
	return picUrl;
}
var getPoster = gPoster;
function getImgSize(imgJson) {
	if (imgJson.width == 0 && imgJson.width == 0) {
		var url = imgJson.posterUrl || imgJson.displayUrl;
		var width = url.split("/")[1].split("x")[0];
		var height = url.split("/")[1].split("x")[1];
		imgJson.width = parseInt(width, 10);
		imgJson.height = parseInt(height, 10);
	} else {

	}
}


/*
 * @description debugㄧ????ゴよΑ蠢alert??狦紇??htmΤ?Debugㄧ?
 * @param {object} _configs ?Array┪?json?禜
 */
function debug(_configs) {
	var paramArr = [], debugType = "0", arrLength;
	if (typeof _configs != "object") {
		return;
	}
	arrLength = _configs.length;
	if (arrLength == undefined) {
		var i = 0;
		for (var key in _configs) {
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
	for (var i = 0; i < arrLength; i++) {
		var testDiv = document.createElement("div");
		testDiv.setAttribute("id", "MSG_" + i);
		if (i % 2 == 0) {//案??Α
			testDiv.setAttribute("style", "background:#A9A9A9;");
		}
		if (debugType == "0") {//???
			testDiv.innerHTML = "No." + i + " ==== " + _configs[i];
		} else {//?json?禜
			var arr = paramArr[i].split("=");
			testDiv.innerHTML = arr[0] + " ==== " + arr[1];
		}
		obj.appendChild(testDiv);
	}
}

function clearMarquee() {//睲埃ゅ??碻?ア礘??ノ
	if (marquee.obj == undefined)
		return;
	if (marquee.handle != undefined)
		clearInterval(marquee.handle);
	marquee.obj.style.position = marquee.oldPosition;
	marquee.obj.style.overflow = marquee.oldOverflow;
}

/**
 * conObj(contentObject):竚ゅ?ン?禜
 * calObj(calculationObjcet):ノ?衡?ン?禜ゅ??薄???ン璖???︽????ンΤ?Α﹚???
 * step??˙?纐?琌ゅ?
 * delay???瞯
 * marqueeNum:ゅ?(à才????)?ゅ?禬???璖???︽??巨
 * content:ゅ?甧?conObj?ンい??甧???菠
 */
function marquee(conObj, calObj, step, delay, marqueeNum, content) {//ゅ?????巨
	if (marquee.handle != undefined)
		clearInterval(marquee.handle);
	var temp = (content != undefined && typeof content == "string") ? content : conObj.innerHTML;
	if (marqueeNum == undefined || getCharLength(temp) < marqueeNum) {
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
	for (var i = 0, ilen = w; i < ilen; i += step) {
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
	marquee.handle = setInterval(function () {
		x -= step;
		mainSpan.style.left = x + "px";
		var newW = mainSpan.offsetWidth;
		if (newW <= oldW) {
			conObj.innerHTML = "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='" + step + "' scrolldelay='" + delay + "'>" + temp + "</marquee>";
			clearInterval(marquee.handle);
		} else {
			oldW += step;
		}
	}, delay);
}

//?审篒紇い10だ??︽冀
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
 * @description 礘?菲???ㄧ?
 * @param {String}
 *            _divId 菲?礘??ID
 * @param {Number}
 *            _preTop 菲?玡top
 * @param {Number}
 *            _top 菲?top
 * @param {String}
 *            _moveDir 菲?よV?H?
 * @param {Number}
 *              _percent 菲?╰?  纐?0.7
 * @return null
 */
function slide(_divId, _preTop, _top, _moveDir, _percent) {
	if (typeof (_divId) != 'undefined' && typeof (_preTop) != 'undefined' && typeof (_top) != 'undefined' && typeof (_moveDir) != 'undefined') {
		this.focusId = _divId;
		this.preTop = _preTop;
		this.focusTop = _top;
		this.moveDir = _moveDir;
	}
	var moveStep = (this.focusTop - this.preTop) * _percent;
	if (Math.abs(moveStep) > 3) {
		this.preTop += moveStep;
		if (this.moveDir == "V") {
			$(this.focusId).style.top = this.preTop + "px";
		} else {
			$(this.focusId).style.left = this.preTop + "px";
		}
		clearTimeout(this.slideTimer);
		this.slideTimer = setTimeout(slide, 1);
	} else {
		if (moveDir == "V") {
			$(this.focusId).style.top = this.focusTop + "px";
		} else {
			$(this.focusId).style.left = this.focusTop + "px";
		}
	}
}

/**
 * @description ?崩
 * @param {String}
 *            _divId 菲?礘??ID
 * @return null
 */
function getLevel(levelJson) {
	if (levelJson == "") {
		levelJson = 0;
	}
	else if (levelJson > 5) {
		levelJson = 5;
	}
	return levelJson;
}

/**
 * @description ??禜?┦
 *
 */
function getStyle(_obj, _styleName) {

	var currentStyle = "";

	if (document.defaultView) { //firefox

		currentStyle = document.defaultView.getComputedStyle(_obj, null)[_styleName];

	} else { //ie

		currentStyle = _obj.currentStyle[_styleName];

	}

	return currentStyle;

}



