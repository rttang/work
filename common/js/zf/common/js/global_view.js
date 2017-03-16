/**
 *
 * @fileOverview
 * @description 此文件包含页面地址及相关全局变量的申明，包含的主要函数有
 * $			作用替代document.getElementById
 * trim			去掉字符串的两边空格
 * getUserId	userId的获取
 * setGlobalVar	设置全局变量
 * getGlobalVar	获取设置的全局变量
 * showDateTime	日期，星期，时间
 * ajaxUrl		ajax请求
 * parseJSON	json数据的处理
 * globalEvent	键值的统一处理
 *
 * @author 905112
 * @version 1.0
 */

/** @description npvrServiceUrl npvr服务器IP，port*/
var npvrServiceUrl = "http://172.20.101.13:8081";
/** @description videoUrl index页面中的直播流 */
var videoUrl = "delivery://490000.6875.64QAM.1901.515.515";
/* @description 全局对象    **/
var V, IEPG = V = IEPG || {};
/** @description userId 为用户ID */
var userId = getUserId();
/** @description epgUrl 业务模板存放路径，到1HD_blue的下层*/
//var epgUrl = location.href.substring(0,parseInt(location.href.lastIndexOf("/"))+1);
//var epgUrl = "http://localhost:8080/templateFile/indexblue/"
//var epgUrl1 = location.href.substring(0,parseInt(location.href.lastIndexOf("/"))+1);

var epgUrl = location.href.split("/tempview")[0];
var goUrl = location.href.split("/iPG")[0];
//var epgVodUrl = "../../";
//var epgVodUrl=epgUrl;
var epgVodUrl=location.href.split("/iPG")[0];//getGlobalVar("URLPATH");
var defaultPic = "/images/no_pic_b.jpg";
var defaultNoPic = "/images/no_pic_m.jpg";
/** @description json中的有效字符 */
var rvalidchars = /^[\],:{}\s]*$/;
/** @description "@"编译 */
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
/** @description "]"编译 */
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
/** @description ""编译 */
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

var mediaTipFlag = false;//剧集弹出框标识
var searchTipFlag = false;//搜索弹出框标识
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

	"UP_N" : 87,		//N9101盒子键值
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

	"RED_T" : 82,		//E600浏览器调试
	"YELLOW_T" : 89,	//E600浏览器调试
	"BLUE_T" : 66,		//E600浏览器调试
	"GREEN_T" : 71,		//E600浏览器调试
	"STATIC":67,
	"VOICEUP":61,
	"VOICEDOWN":45
};

/**
 * @description $ 代替document.getElementById
 * @param {string} _id 为页面DIV的id
 */
function $(_id) {return document.getElementById(_id);}

/**
 * @description trim 去掉字符串前后空格
 * @param {string} _str 需要处理的字符串
 */
function trim(_str) {return _str.replace(/(^\s*)|(\s*$)/g, "");}

/**
 * @description getUserId 取AAA下发的userId，供页面请求数据用，此参数是请求数据的url必带字段
 */
function getUserId() {
	var userId;
	try {
		if(Utility.getSystemInfo) {		//深圳天威
			userId = Utility.getSystemInfo("UID");
		}
		if(CITV.loginInfo.getValue) {	//吉林省网用
			userId = CITV.loginInfo.getValue("userId");
		}
		if(DataAccess.getInfo) {		//广东省网用
			userId = DataAccess.getInfo("UserInfo", "account");
		}
	} catch(e) {
		userId = 0;
	}
   //return userId;  //正式运行使用
   return "gz"; //测试时使用ID
}
//*********** 逻辑操作时，检查CA和uerId  **************

function checkUser() {
	var userId = getUserId();
	if(userId == "" || userId == "0" || userId == undefined) {
		showMsg(goUrl + "/iPG/tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
		return false;
	}
	return true;
}

//检查智能卡插入、拔出消息
document.onsystemevent = function(e) {
    var code = e.which || e.keyCode;
    var keyType = e.type?e.type:1001;
 	if(keyType == 1001){
  		switch(code) {
			case 40070: //中山，卡插入
			case 11703://南海，卡插入
				break;
			case 40071: //中山，卡被拔出
			case 11704://南海，卡被拔出
				showMsg(goUrl + "/iPG/tip/a_errorTip.htm", "认证失败，请检查机顶盒和智能卡！");
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

/**
 * @description showDateTime 用于页面中时间，日期的显示
 * @param {string} _objId 可以是2D页面中的时间对象，也可以是div中的id
 */

function showDateTime(_objId) {
	if( typeof (_objId) == "string") {
		$(_objId).innerHTML = setDateTime();
	} else {
		_objId.string = setDateTime();
		canvas.refresh();
	}
	window.setInterval(function() {
		showDateTime(_objId);
	}, 60000);
}

function setDateTime() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var week = "";
	var hour = date.getHours();
	var minute = date.getMinutes();
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	switch(date.getDay()) {
		case 0:
			week = "星期天";
			break;
		case 1:
			week = "星期一";
			break;
		case 2:
			week = "星期二";
			break;
		case 3:
			week = "星期三";
			break;
		case 4:
			week = "星期四";
			break;
		case 5:
			week = "星期五";
			break;
		case 6:
			week = "星期六";
			break;
	}
	var date_time = year + "-" + month + "-" + day + "  " + week + " " + hour + ":" + minute;
	return date_time;
}

/**
 * @description GetXmlHttpObject ajax请求时状态判断
 * @param {function} _handler 回调函数
 */

var xmlHttp;
function GetXmlHttpObject(_handler) {
	var objXmlHttp = null;
	if(window.XMLHttpRequest) {
		objXmlHttp = new XMLHttpRequest();
	} else {
		if(window.ActiveXObject) {
			objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	objXmlHttp.onreadystatechange = function() {
		if(objXmlHttp.readyState == 4) {
			if(objXmlHttp.status == 200) {
				callBackData(xmlHttp, _handler);
			} else {
				//超时间方法,传入空会自动弹出服务器忙的提示
				showMsg("","系统忙,请稍候重试。");
			}
		}
	};
	return objXmlHttp;
}

/**
 * @description ajaxUrl ajax请求函数，与服务器进行数据交互
 * @param {string} _callbackfun 回调函数
 */

function ajaxUrl(_url, _callbackfun) {
	xmlHttp = GetXmlHttpObject(_callbackfun);
	xmlHttp.open("GET", _url, true);
	xmlHttp.send(null);
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
	if(window.JSON && window.JSON.parse) {
		//alert(_data);
		return window.JSON.parse(_data);
	} else if(rvalidchars.test(_data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
		return (new Function("return " + _data))();
	} else {
		return eval("(" + _data + ")");
	}
}

/**
 * @description callBackData 对ajax返回的数据进行统一的处理
 * @param {object} xmlHttp 为ajax返回xmlHttp对象
 * @param {function} _handler 当请求的数据成功返回时，为页面的回调函数
 */

function callBackData(_xmlHttp, _handler) {
	//alert("fsdjfjsldjfj"+_xmlHttp.responseText);
	var resText = parseJSON(_xmlHttp.responseText);
	if(_xmlHttp.responseText.indexOf("errMessage") >= 0){	//返回错误数据
	    getErrorMsg(resText.errMessage[0]);
	} else {	//返回正常数据时
		_handler(resText);
	}
}

function getErrorMsg(errorMsg) {
    var errorTextMsg = errorMsg.message;
    if(errorTextMsg == "") {
        errorTextMsg = "系统繁忙，请稍候重试。";
    }
    var errorMessage = errorTextMsg + "。 【 " + errorMsg.errorCode + " 】";
    switch(errorMsg.errorCode) {
        case "12011086":   //栏目信息不存在
        case "122000020":  //参数不能为空  
        case "12200061":   //资源不存在或已经下架
        case "10000001":   //系统烦忙,请稍后。
        case "10000002":   //资源暂不可用！ 
        case "12200009":   //用户无效
        case "2001":       //用户信息不存在
        case "-1":         //无message信息
        case "2030":       //AAA返回资源不存在
            showMsg("", errorMessage);
            break;
        default:
            showMsg(goUrl + "/iPG/tip/a_errorTip.htm", errorMessage);
            break;
    }
}

function ajax(url, handler) {
	var xmlHttp;
	if(window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.readyState == 4) {
			if(xmlHttp.status == 200 || xmlHttp.status == 0) {
				handler(xmlHttp.responseText);
			} else {
				showMsg("","系统忙,请稍候重试。");
			}
		}
	};
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

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
				doNumberKey();
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
//			if(recJson[keycode].columnMapId == undefined){//我的点播
////				location.href = "detail.htm?columnMapId=" + recJson[keycode].assetInfo.columnMapId;
//				location.href = "../template/templateAction!getAssetDetailTemplate.action?columnMapId=" + recJson[keycode].assetInfo.columnMapId+"&columnId="+recJson[keycode].assetInfo.columnId;
//			}else{
////				location.href = "detail.htm?columnMapId=" + recJson[keycode].columnMapId;
//				location.href = "../template/templateAction!getAssetDetailTemplate.action?columnMapId=" + recJson[keycode].columnMapId+"&columnId="+recJson[keycode].columnId;
//			}

            if(recJson[keycode].recordType=="pakg"){
                window.location.href =goUrl+ "/iPG/detail/dsj_detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].columnId;
            }else{
                window.location.href = goUrl+ "/iPG/detail/detail.htm?userId=" + getUserId() + "&columnMapId=" + recJson[keycode].columnMapId+"&checkBookmark=Y&columnId="+recJson[keycode].columnId;
            }
		}
	}
}

// /** @description doRedKey 数字键处理函数，页面重写此方法*/
// function doNumberKey(){
//
// }



function doReturnKey() {
	setGlobalVar("isBack", "Y");//页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
	//clearGlobalVar();
	//goReturnUrlPath();
    doReturnTopPress();
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



// /** @description clearGlobalVar 清除页面焦点，页面重载此方法*/
// function clearGlobalVar() {
// 
// }



//----------------------  路径缓存操作 start---------------------------------------------------------
var urlSplitChar = "#";//URL之间的分隔符，可配，但注意确保不会与URL参数重复
var urlPathGlobalName = "urlPathGlobalName";//全局变量名
/*
 * 在有页面跳转动作时调用 ，用来保存当前页面的URL，URL 之间以 urlSplitChar 号分隔，
 * 调用此方法之前页面需要保存其它的变量需要自己操作
 */
function saveUrlPath() {//保存访问路径
	var tempUrl = getGlobalVar(urlPathGlobalName) == undefined ? "" : getGlobalVar(urlPathGlobalName);//取全局变量
	tempUrl = tempUrl + urlSplitChar + location.href;//将已存在的路径和当前URL之间加上分隔符
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
	location.href = tul;
}

function clearUrlPath() {//清除保存的所有路径
	setGlobalVar(urlPathGlobalName, "");
}

function changeObjClass(id, className) {//改变对象样式
	$(id).className = className;
}

var urlTopPathGlobalName = "urlPathGlobalName";//全局变量名
function saveTopUrlPath(){    //
    var tempUrl = getGlobalVar(urlTopPathGlobalName) == undefined ? "":getGlobalVar(urlTopPathGlobalName);//ȡȫ�ֱ���
    tempUrl = tempUrl + urlSplitChar + location.href;//�
    var arr = tempUrl.split(urlSplitChar);
    if(arr.length>6){
        var removeLength=arr.length-6;
        var newArr=arr.slice(removeLength);//�
        tempUrl = arr[1]+urlSplitChar+newArr.join(urlSplitChar);//��
    }
    setGlobalVar(urlTopPathGlobalName, tempUrl);//����
}
function goReturnTopUrlPath(){
    var tempUrl = getGlobalVar(urlTopPathGlobalName);//ȡȫ�ֱ���
    var tuArr = tempUrl.split(urlSplitChar);
    var tl = tuArr.length;
    var tul = tuArr.pop();//�
    if (!tul || tul == "")
    {
        tul = getGlobalVar("PORTAL_ADDR");

    }
    var newUrl = tuArr.join(urlSplitChar);//
    setGlobalVar(urlTopPathGlobalName, newUrl);
    Utility.setEnv("portal_Form","");
    location.href = tul;
}

function clearUrlTopPath(){//�
    setGlobalVar(urlTopPathGlobalName, "");
}
function doReturnTopPress(){  //�
    setGlobalVar("isBack","Y");
    clearGlobalVar();
    goReturnTopUrlPath();
}


//----------------------  路径缓存操作 end----------------------------------------------------------
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
//****************时间秒转换为00：00：00格式**********************
function convertToShowTime(second) {
    if (isNaN(second) || second < 0) second = 0;
    var hh = parseInt(second / 3600);
    var mm = parseInt((second % 3600) / 60); 
    var ss = (second % 3600) % 60;
    return addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss);
}
function addZero(val) {
    if (val < 10) return "0" + val;
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
			res = res;
		}
		return res;
	} else {
		if(_subLength < _str.length) {
			return "<marquee scrollLeft='1' behavior='scroll' direction='left' scrollamount='6' scrolldelay='100'>" + _str + "</marquee>";
		} else {
			return _str;
		}
	}
};
//******************************* 取url中的相关参数  **********************************************
//获取url中param参数的值  例子：var serviceCode = getQueryStr(location.href, "serviceCode");
function getQueryStr(url, param){
	var rs = new RegExp("(^|)" + param + "=([^\&]*)(\&|$)", "gi").exec(url), tmp;
	if( tmp = rs){
	    return tmp[2];
	}else{
	    return "";
	}
}

/*替换字符串中参数的值searchStr：查找的字符串，replaceVal：替换的变量值
 var backUrl=backUrl.replaceQueryStr(breakpointTime,"vod_ctrl_breakpoint");
 */
String.prototype.replaceQueryStr = function(replaceVal, searchStr) {
	var restr = searchStr + "=" + replaceVal;
	var rs = new RegExp("(^|)" + searchStr + "=([^\&]*)(\&|$)", "gi").exec(this), tmp;
	var val = null;
	if( tmp = rs)
		val = tmp[2];
	if(val == null) {
		if(this.lastIndexOf("&") == this.length - 1)
			return this + restr;
		else if(this.lastIndexOf("?") >= 0)
			return this + "&" + restr;
		return this + "?" + restr;
	}
	var shs = searchStr + "=" + val;
	if(this.lastIndexOf("?" + shs) >= 0)
		return this.replace("?" + shs, "?" + restr);
	return this.replace("&" + shs, "&" + restr);
};

//页面做分页处理时，pageLength：总数据长度，pageSize：页面可显示的数据长度
function getMaxPage(pageLength, pageSize) {//求最大页数
	if(pageLength == 0 || pageLength == undefined) {
		return 0;
	}
	if(pageLength % pageSize != 0) {
		return Math.ceil(pageLength / pageSize);
	} else {
		return pageLength / pageSize;
	}
}

function getMaxPageSize(pageLength, pageSize) {//求为最大页数时pagesize
	if(pageLength == 0 || pageLength == undefined) {
		return 0;
	}
	if(pageLength % pageSize != 0) {
		return pageLength % pageSize;
	} else {
		return pageSize;
	}
}

//******************************* 真焦点处理 *********************************
var inputsStates;// inputs 标签状态保存
//将页面上所有的标签都设为可用
function enabledAll() {//所有 input 标签
	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = inputsStates[i];
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

var tipDivId = "tip_visibility";//弹出框div的ID
var messInfoId = "tip_window";//显示消息文字的div的ID
var lastObj;//弹出窗口之前有焦点的对象
var tipFlag = false;//弹出框标识，true为有弹出框，默认为false；
var OKButtonId="OKButton";
function showMsg(url, msg) {
	if(!tipFlag)// 如果当前已经没有弹出窗口,则需要保存当前焦点对象和面页按键的有效状态
	{
		lastObj = document.activeElement;
		disabledAll();
	}
	var tipDiv = $(tipDivId);
	var tipWindow = $(messInfoId);
	if(url == "") {
		url = goUrl + "/iPG/tip/a_busyInfo.htm";
		if(msg == "") {
			msg = "系统忙，请稍后再试！";
		}
	}
	ajax(url, function(resText) {
		tipDiv.style.visibility = "visible";
		tipWindow.innerHTML = resText;
		tipFlag = true;
		if(resText.indexOf("a_searchTip") >= 0) {//搜索提示框
		    searchTipFlag = true;
			$('search_Input').focus();
			return;
		}
		$("message").innerHTML = msg;
		if($(OKButtonId))//弹出窗口确定按钮Id必须为 OKButton ,OKButton为弹出窗口专用ID
		{
			$(OKButtonId).focus();
		}
		if(resText.indexOf("a_buyTip") >= 0) {
			$(OKButtonId).onclick = function() {
				Buy.doBuy(URL.VOD_buy, buy);//提示购买时按确认键购买
			};
		} else if(resText.indexOf("a_buyOk") >= 0) {
			$(OKButtonId).onclick = function() {
				IEPG.doPlay();//订购成功后按确认键直接播放
			};
		}else if(resText.indexOf("a_breakTimeTip") >= 0){
			$(OKButtonId).onclick = function() {
				//IEPG.doBookmarkPlay(getGlobalVar("timePosition"));//从断点处播放
				IEPG.doPlay();
			};
			$("rePlayButton").onclick = function() {
				setGlobalVar("timePosition","");
				IEPG.doPlay();//重新播放
			};						
		}
        if(typeof(imgurl) != 'undefined' && imgurl != ''){
            document.getElementById('vodAd').src=imgurl;
        }else{
            document.getElementById('vodAd').src='/iPG/common/images/no_pic1.png';
        }
	});
}

function closeTip()//关闭提示信息
{
	var tipDiv = $(tipDivId);
	var tipWindow = $(messInfoId);
	if(tipWindow) {
		tipDiv.style.visibility = "hidden";
		tipWindow.innerHTML = "";
		//$("message").innerHTML = "";
	}
	tipFlag = false;
	mediaTipFlag = false;
	searchTipFlag = false;
	enabledAll();
	lastObj.focus();
}

/**
 * @description subText 获取海报
 */
function getPoster(posterJson, width, height) {
	for(var i = 0; i < posterJson.length; i++) {
		if(posterJson[i].width > width && posterJson[i].height > height) {
			return "/" + posterJson[i].displayUrl;
		}
	}
	if(posterJson.length != 0){
		return "/" + posterJson[0].displayUrl;
	}else{
		return defaultNoPic;
	}
}

/**
 * @description  在列表直接按播放键响应函数
 */
IEPG.onPlayAction = function(dataArr, focusIndex) {
	if(dataArr.length > 0) {
		saveGlobalVar();
		if(dataArr[focusIndex].recordType == "pakg") {
//			window.location.href = "detail.htm?columnMapId=" + dataArr[focusIndex].columnMapId;
			window.location.href = "../template/templateAction!getAssetDetailTemplate.action?columnMapId=" + dataArr[focusIndex].columnMapId+"&columnId="+dataArr[focusIndex].columnId;
			
		} else {
			var pmJson = {
				"chargeModel" : dataArr[focusIndex].chargeModel,
				"goodsId" : dataArr[focusIndex].goodsId,
				"columnMapId" : dataArr[focusIndex].columnMapId,
				"resourceId" : dataArr[focusIndex].resourceId,
				"assetName" : dataArr[focusIndex].assetName,
				"recordType" : dataArr[focusIndex].recordType,
				"providerId" : dataArr[focusIndex].providerId,
				"buyPlayType" : "1"
			};
			Buy = new IEPG.BUY(pmJson);
			Buy.doBuy(URL.VOD_checkBuy, checkBuy);
		}
	}
};
/**
 * @description  子集列表按播放键、确定键直接播放，
 */
IEPG.doPlayAction = function(playJson) {
	var pmJson = {
		"chargeModel" : playJson.chargeModel,
		"goodsId" : playJson.goodsId,
		"columnMapId" : playJson.columnMapId,
		"resourceId" : playJson.resourceId,
		"assetName" : playJson.assetName,
		"recordType" : playJson.recordType,
		"providerId" : playJson.providerId,
		"buyPlayType" : "1"
	};
	Buy = new IEPG.BUY(pmJson);
	Buy.doBuy(URL.VOD_checkBuy, checkBuy);
};
/**
 * @description MediaPlayer 页面显示直播视频流
 * @param {object} _config 视频对象包含url，静音div的id，是否全屏标识，视频的区域x,Y,W,H
 * @param {string} videoUrl 直播视频url
 * @param {number} x,y,w,h 视频的区域x值（left）,y值 (top),宽(width),高(height)
 * @param {string} IsFullScreen 是否全屏播放，0为不全屏，1为全屏展示忽略x,y,w,h的值。
 * @param {function} initVoice 页面上次处理静音图片的展示函数
 * @param {string} muteMode 盒子接口，用来获取当前播放器是否为静音状态,1为静音，0为非静音
 * 
 var videoConfig = {
	 videoUrl:"delivery://339000.6875.64QAM.101.80.80"，
	 area:{x:"",y:"",w:"",h:""}，
	 IsFullScreen:0,
	 init:initVoice
 }
 */

IEPG.MediaPlayer = function(_config) {
	var mp = null, muteMode = null;
	this.videoUrl = _config.videoUrl || "";
	this.X = _config.area.x || 0;
	this.Y = _config.area.y || 0;
	this.W = _config.area.w || 1280;
	this.H = _config.area.h || 720;
	this.IsFullScreen = _config.IsFullScreen || 0;
	this.init = _config.init || this._blank;
};

IEPG.MediaPlayer.prototype = {
	openVideo : function() {		//8606盒子用此方法
		try {
			mp = new MediaPlayer();
			this._initStatic();
			if(_videoUrl != "") {
				mp.setSingleMedia(this.videoUrl);
				mp.setVideoDisplayArea(this.X, this.Y, this.W, this.H);
				mp.setVideoDisplayMode(0);
				mp.refreshVideoDisplay();
				mp.playFromStart();
			}
		} catch(err) {
		}
	},
	openNewVideo : function() {		//9101的盒子用此方法
		try {
			mp = new MediaPlayer();
			this._initStatic();
			mp.createPlayerInstance("video", 2);
			mp.position = this.IsFullScreen + "," + this.X + "," + this.Y + "," + this.W + "," + this.H;
			mp.source = this.videoUrl;
			mp.play();
			mp.refresh();
		} catch(err) {
		}
	},
	closeVideo : function() {
		try {
			if(mp != null) {
				if(mp.releasePlayerInstance) {
					mp.releasePlayerInstance();
					mp.pause(0);
				} else {
					mp.stop();
					mp.setVideoDisplayMode(1);
					mp.refreshVideoDisplay();
				}
			}
		} catch(err) {
		}
	},
	_initStatic : function() {
	    try{
	        muteMode = mp.getMute();
	    }catch(err){
	        muteMode = 0;
	    }
        this.init(muteMode);
	},
	resetStatic : function() {
		muteMode = mp.getMute();
		if(muteMode == 1) {
			muteMode = 0;
			mp.audioUnmute();	//将当前播放实例解除静音状态
		} else {
			muteMode = 1;
			mp.audioMute();		//将某个播放实例设置为静音
		}
		this._initStatic();
	},
	_blank : function(){}
};



//***************************     搜索 开始             *************************
/** @description 搜索*/
function goToSearch() {
        window.location.href =goUrl+ "/iPG/search/search.htm";
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
