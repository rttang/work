var currentBtn = null; //存储当前按钮
var currentName = 'nav_0'; //用于获取当前按钮的名称
var currentBp = { left: 'buyCollect_0', right: 'show_1', up: 'nav_0', down: 'show_3', myName: 'show_0' }; //保存上一个按钮
var firstNav, secondNav = 'navSecondContent_0'; //存储当前导航
var titleBp = null;
goUrl = "http://10.2.4.60:8080";
//定义栏目信息
var BUY_goog = '';
var isAccessOrder = null;
var pmJson, folderContentsOrder;
var columnId = "MANU228065";
var first_data, second_data; //toThree中用于获取详情页
var judge = true;
var nav = [];
var data_title = [];
nav[0] = columnId; //
nav[1] = "MANU227570"; //风云剧场栏目ID
nav[2] = "MANU228066"; //风云综艺栏目ID   MANU200565
nav[3] = "MANU227571"; //风云3D栏目ID
nav[4] = "MANU228067"; //央视精品栏目ID
nav[5] = "MANU233066"; //免费栏目ID
//鉴权与购买
function authentication(columnId) { //鉴权
    var VOD_getFolderContents = {
        "data": '<GetFolderContents  mergeTV="1" assetId="' + columnId + '" portalId="' + portalId + '" account="' + userId + '" client="' + cardId + '" includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y" maxItems="10" startAt="1" />',
        "callBack": callBackAuthentication
    };
    IEPG.getData(URL.VOD_getAssetList, VOD_getFolderContents);
}

function callBackAuthentication(dataJson) {
    folderContentsOrder = dataJson;
    var serviceIdOrder = dataJson.folderFrame.serviceId;
    var assetIdOrder = dataJson.selectableItemList[0].assetId;
    var providerIdOrder = dataJson.selectableItemList[0].providerId;
    var VOD_checkBuy = {
        "data": "<ValidatePlayEligibility providerId=\"" + providerIdOrder + "\" serviceId=\"" + serviceIdOrder + "\" assetId=\"" + assetIdOrder + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>",
        "callBack": checkBuyOrder
    };
    IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
}

function checkBuyOrder(dataJson) {
    if (dataJson.orderFlag == "N") {
        isAccessOrder = false;
    } else {
        isAccessOrder = true;
    }
    //alert(isAccessOrder);
}
//填充数据
function getSearchTag(dataJson) { //用于子栏目,在接口里作为回调函数调用

    var data = dataJson.selectableItem || dataJson.selectableItemList;
    second_data = data;
    var total = dataJson.totalResults;

    showlist(data, total);
}

function addJiaoBiao(e, data, num) {
    //var el=document.getElementById(el_id);
    var x = e.offsetLeft,
        y = e.offsetTop;
    while (e = e.offsetParent) {
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    if (data.displayFlags == "N") {
        document.getElementById("g_" + num).setAttribute('style', 'top:' + (y - 5) + 'px;left:' + (x - 6) + 'px;display:block;');
    } else if (data.videoType == 1) {
        document.getElementById("i_" + num).setAttribute('style', 'top:' + (y - 5) + 'px;left:' + (x - 6) + 'px;display:block;');
    }

}

function showlist(data, total) {
    //console.log('data:', data);
    var data_list = $("secondShowContent").getElementsByTagName("li");

    for (var i = 0; i < data_list.length; i++) {
        $("i_" + i).setAttribute("style", ""); //角标
        $("g_" + i).setAttribute("style", "");

        if (i < 12) {
            data_list[i].style.display = 'none';
            data_list[i].getElementsByTagName('img')[0].src = '';
            data_list[i].getElementsByTagName('p')[0].innerHTML = '';
        }

        if (i < data.length) {
            data_list[i].style.display = 'block';
            data_list[i].getElementsByTagName('img')[0].src = gPoster(data[i].imageList, 288, 383);
            data_list[i].getElementsByTagName('p')[0].innerHTML = data[i].titleFull;
            data_title[i] = data[i].titleFull;
            addJiaoBiao(data_list[i], data[i], i);
        }

    }

    $("pageNow").innerHTML = PortFun.curPage;
    PortFun.totalPage = Math.ceil(total / PortFun.dataSize);
    $("pageAll").innerHTML = PortFun.totalPage;
    PortFun.curDataSize = data.length;
    judge = true;
}

function getZiyuan(dataJson) { //用于首页
    //$('dataJson').innerHTML=JSON.stringify(dataJson.childFolderList);
    pmJson = {
        "recordType": "vod",
        "chargeMode": 1, //(可选)
        "goodsId": 'YSDBZQ', //(套餐必填)'YSDBZQ'
        "columnMapId": '', //(单片和资源包必填)
        "resourceId": dataJson.folderFrame.assetId, //（资源包子集必填）
        "singleFlag": false, //(可选)
        "isBuyOnline": true, //(可选)
        "buyPlayType": "1", //(可选)
        "rtspType": "N", //(可选)
        "tryFlag": "0" //(可选)
    }
    var data = dataJson.selectableItemList;
    first_data = data;
    // var str = JSON.stringify(data);
    //  $('b1').innerText=str;
    var arr = ['', '', ''];
    $('showMidd1').getElementsByTagName('img')[0].src = gPoster(data[3].imageList, 360, 270);
    $('showMidd2').getElementsByTagName('img')[0].src = gPoster(data[4].imageList, 360, 270);
    $('showSm3').getElementsByTagName('img')[0].src = gPoster(data[7].imageList, 250, 130);
    $('showSm2').getElementsByTagName('img')[0].src = gPoster(data[6].imageList, 250, 130);
    $('showSm1').getElementsByTagName('img')[0].src = gPoster(data[5].imageList, 250, 130);
    $('showBigPic').getElementsByTagName('img')[2].src = gPoster(data[2].imageList, 780, 400);
    $('showBigPic').getElementsByTagName('img')[1].src = gPoster(data[1].imageList, 780, 400);
    $('showBigPic').getElementsByTagName('img')[0].src = gPoster(data[0].imageList, 780, 400);
    for (var i = 0; i < 3; i++) {
        $('showBigPic').getElementsByTagName('img')[i].src = gPoster(data[i].imageList, 780, 400);
        arr[i] = data[i].titleFull;
    }
    var run = showBigPic('showBigPic', 'circle', 'title', 'showPic', 'circleFocus', arr, 1500);
    setTimeout(run, 500);
}

function queryBalance() { //查询余额
    var bossNetwork = "http://10.68.1.17:8180";
    ajaxUrl(
        bossNetwork + "/UAP/UAPJAction.do?METHOD=uniForward&opcode=Z02&syscode=DCYDB001&sm_no=" + cardId,
        callBackQueryBalance,
        null
    );
}

function callBackQueryBalance(dataJson) {
    var balanceOrder = 0;
    if (dataJson.status == "0000") {
        balanceOrder = dataJson.ouput.cashbox;
    } else {
        balanceOrder = 0;
    }
    $("buyLayout").getElementsByTagName("h3")[0].innerHTML = "账户余额为" + balanceOrder + "元,余额不足时直接跳转微信支付";
}
/**
 * [description]
 * 用作全局按钮存储，以及按钮操作
 * @Array     btns 用于保存所有的按钮 
 * @object    operations 按钮操作对象 btnAdd用于增加按钮 groupGenerate用于矩阵按钮生成
 * @function  ReceiveMessage 用于外部操作operations，接受多个变量，但是第一个变量必须是btnAdd或groupGenerate
 * @function  Find 接受一个参数需要查找的按钮的名字
 * @return  返回一个对象，包含上边两个函数接口
 */
var BtnDirector = (function() {
    var btns = [],
        operations = {};

    operations.btnAdd = function( /*btnArray*/ ) {
        var btn = Array.prototype.slice.call(arguments);
        var length = btn.length;
        for (i = 0; i < length; i++) {
            var myName = btn[i].myName;
            btns[myName] = btn[i];
        }

    };
    operations.groupGenerate = function( /*ulName,groupRule,Row*/ ) {
        var arg = Array.prototype.slice.call(arguments),
            ulName = arg[0],
            groupRule = arg[1],
            row = arg[2];


        var liNum = $(ulName).getElementsByTagName("li").length,
            column = Math.ceil(liNum / row); //循环变量

        for (var i = 0; i < row; i++) { //行
            (function(_i) {
                for (var j = 0; j < column; j++) { //列
                    //这个写入里面的原因是，引用类型每次修改他的副本一起就被修改了。。
                    var btnRule = {
                            'left': null,
                            'right': null,
                            'up': null,
                            'down': null
                        },
                        btnIndex, btnName;
                    //console.log([i, j]);
                    btnIndex = i * column + j;
                    //console.log('i*column',[i*column]);
                    btnName = ulName + '_' + btnIndex;
                    //判断方向，向左减一向右加一，向上减列数，向下加列数
                    btnRule['left'] = (btnIndex - 1) >= i * column ? (ulName + '_' + (btnIndex - 1)) : groupRule['left'];
                    btnRule['right'] = ((btnIndex + 1) >= 0 && (btnIndex + 1) < column * (i + 1)) ? (ulName + '_' + (btnIndex + 1)) : groupRule['right'];
                    btnRule['up'] = (btnIndex - column) >= 0 ? (ulName + '_' + (btnIndex - column)) : groupRule['up'];
                    btnRule['down'] = (btnIndex + column) < liNum ? ulName + '_' + (btnIndex + column) : groupRule['down'];
                    btnRule['confirm'] = groupRule['confirm'] || null;
                    btnRule['myName'] = btnName;
                    //console.log('right',btnRule['right']);
                    //将生成的按钮存到数组里
                    operations.btnAdd(btnRule);

                }
            })(i)
        }
    };
    operations.log = function() {
        return (function(btns) {
            console.log(btns);
        })(btns)

    };
    var ReceiveMessage = function() {
        var message = Array.prototype.shift.call(arguments);
        var that = this;
        return function() {
            operations[message].apply(that, arguments); //that貌似是谁都无所谓
        }
    };
    var Find = function() { //这样写的原因在于对象中的键值对形式的函数

        return function(direction) {
            return btns[direction];
        }
    }
    return {
        ReceiveMessage: ReceiveMessage,
        Find: Find
    };
})();

/*
 *具体按键策略
 */
var PortFun = {
    /*
    頁面跳转相关参数
     */
    dataSize: 12,
    curDataSize: 12,
    curPage: 1,
    curPageBp: 1,
    totalPage: 1,
    currNavNum: 1,
    currTag: '',
    startAt: 1,
    buyNum: 0,
    pageRight: function() {

        PortFun.curPage >= PortFun.totalPage ? PortFun.curPage = PortFun.totalPage : PortFun.curPage++;
        PortFun.startAt = PortFun.curPage * PortFun.dataSize - 11;
        if (PortFun.currTag != null && PortFun.currTag != "最新")
            PortFun.getContent(PortFun.currNavNum, PortFun.currTag, PortFun.startAt);
        else PortFun.getFirstPage(PortFun.currNavNum, PortFun.startAt);
        currentName = 'secondShowContent_0';
        currentBtn = find(currentName);
        setFocus(currentBtn);

    },
    pageLeft: function() {
        //console.log('pageLeft');
        PortFun.curPage <= 1 ? PortFun.curPage = 1 : PortFun.curPage--;
        PortFun.startAt = PortFun.curPage * PortFun.dataSize - 11;
        if (PortFun.currTag != null && PortFun.currTag != "最新")
            PortFun.getContent(PortFun.currNavNum, PortFun.currTag, PortFun.startAt);
        else PortFun.getFirstPage(PortFun.currNavNum, PortFun.startAt);
        currentName = 'secondShowContent_5';
        currentBtn = find(currentName);
        setFocus(currentBtn);
    },
    getSecondContent: function(liNum) { //一级栏目获取节目
        judge = false;
        VOD_getChildColumnList = {
            data: '<GetFolderContents  mergeTV="1" includeFolderProperties="Y" includeSubFolder="Y"  includeSelectableItem="Y" startAt="1"  maxItems="12"  assetId="' + nav[liNum] + '" portalId="' + portalId + '" client="' + cardId + '" account="' + userId + '"/>',
            callBack: getSearchTag
        };
        IEPG.getData(URL.VOD_getChildColumnList, VOD_getChildColumnList);

    },
    getFirstPage: function(liNum, startAt) { //一级栏目有翻页的情况下
        var start = startAt || 1;
        judge = false;
        VOD_getChildColumnList = {
            data: '<GetFolderContents  mergeTV="1" includeFolderProperties="Y" includeSubFolder="Y"  includeSelectableItem="Y" startAt="' + start + '"  maxItems="12"  assetId="' + nav[liNum] + '" portalId="' + portalId + '" client="' + cardId + '" account="' + userId + '"/>',
            callBack: getSearchTag
        };
        IEPG.getData(URL.VOD_getChildColumnList, VOD_getChildColumnList);
    },
    getContent: function(liNum, tag, startAt) { //子导航获取节目
        var start = startAt || 1;
        judge = false;
        VOD_getAssetListByKeyword = {
            data: "<SearchAction assetId='" + nav[liNum] + "' startAt='" + start + "'  maxItems='12' portalId='" + portalId + "' client='" + cardId + "' account='" + userId + "'  keyword='" + tag + "' mergeTV='1'><UserParams sortButtons='byNewOld' sortDirection='DESC'><FilterBoxes serviceType='VOD'></FilterBoxes></UserParams></SearchAction>",
            callBack: getSearchTag
        };
        IEPG.getData(URL.VOD_getAssetListByKeyword, VOD_getAssetListByKeyword);
    },

    /*
    购买相关
     */
    //普通购买
    reFreshBuy: function(num) {
        o.init({
            columnId: "MANU228065", //环球剧场 MANU177573 样式点播 MANU228065
            count: num //订购周期,1,6,12
        });
        // saveUrlPath();
        // window.location.href = "./common/js/zf/index.html?productName="+folderContentsOrder.folderFrame.displayName+"&serviceId="+folderContentsOrder.folderFrame.serviceId+"&count="+num;
    },
    //微信购买 num同上，均为购买周期
    gotoWeixin: function(num) {
        saveUrlPath();
        window.location.href = "./common/js/zf/index.html?productName=" + folderContentsOrder.folderFrame.displayName + "&serviceId=" + folderContentsOrder.folderFrame.serviceId + "&count=" + num;
    },
    saveGlobals: function() {
        //返回后想获得原来的焦点，首先得知道一级导航和二级导航是谁
        PortFun.curPage = $("pageNow").innerText;//修正页码
        PortFun.startAt = PortFun.curPage * PortFun.dataSize - 11;//修正个数
        setGlobalVar("current_Name", currentBtn['myName']);
        setGlobalVar("currNav_Num", PortFun.currNavNum);
        //setGlobalVar("curr_Tag", PortFun.currTag);
        setGlobalVar("start_At", PortFun.startAt);
        setGlobalVar("cur_Page", PortFun.curPage);
        setGlobalVar("first_Nav", firstNav);
        setGlobalVar("second_Nav", secondNav);

        // console.group("saveGlobals");　
        // console.log("currentName:", currentName);　　
        // console.log("firstNav:", firstNav);　　　　
        // console.log("PortFun.currNavNum:", PortFun.currNavNum);
        // console.log("PortFun.currTag:", PortFun.currTag);
        // console.log("PortFun.startAt:", PortFun.startAt);
        // console.log("PortFun.curPage:", PortFun.curPage);
        // console.groupEnd();

    },
    clearGlobals: function() {
        setGlobalVar("current_Name", '');
        setGlobalVar("currNav_Num", '');
        setGlobalVar("curr_Tag", '');
        setGlobalVar("start_At", '');
        setGlobalVar("first_Nav", '');
        setGlobalVar("cur_Page", '');
        setGlobalVar("second_Nav", '');
    },
    getGlobals: function() {
        currentName = getGlobalVar("current_Name") ? getGlobalVar("current_Name") : currentName;
        if (!currentName) currentName = 'nav_0';
        firstNav = getGlobalVar("first_Nav") ? getGlobalVar("first_Nav") : firstNav;
        secondNav = getGlobalVar("second_Nav") ? getGlobalVar("second_Nav") : secondNav;
        PortFun.currNavNum = getGlobalVar("currNav_Num") ? getGlobalVar("currNav_Num") : parseInt(PortFun.currNavNum);
        //PortFun.currTag = getGlobalVar("curr_Tag") ? getGlobalVar("curr_Tag") : parseInt(PortFun.currTag);
        PortFun.startAt = getGlobalVar("start_At") ? getGlobalVar("start_At") : parseInt(PortFun.startAt);
        PortFun.curPage = getGlobalVar("cur_Page") ? getGlobalVar("cur_Page") : parseInt(PortFun.curPage);
        currentBtn = find('currentName');

        PortFun.clearGlobals();
    },
    /*
    页面跳转相关
     */
    //详情页跳转
    toThree: function(index, list_data) { //进入详情页,媒资下标与first_data、second_data
        if (list_data[index].isPackage == 1) {
            var pageType;
            if (list_data[index].showType == 2) {
                pageType = '3_many.html';
            } else {
                pageType = '3_list.html';
            }
            window.location.href = pageType + "?assetId=" + list_data[index].assetId + "&folderAssetId=" + list_data[index].folderAssetId + "&providerId=" + list_data[index].providerId;
        } else {
            window.location.href = "3_single.html?assetId=" + list_data[index].assetId + "&folderAssetId=" + list_data[index].folderAssetId + "&providerId=" + list_data[index].providerId;
        }
    },
    goBack: function() {

    }
}

var Strategies = {
    nav: function(liNum, direction) {
        var navUl = $('nav');
        var navList = navUl.childNodes;
        var navLi = [];
        var currentName = 'nav_' + liNum;
        var navSecondUl = $('navSecond');
        var liNum = parseInt(liNum); //注意传进来的参数是字符串
        var show = $('show');
        var secondShow = $('secondShow');
        var secondNavarr = wordDismantle(secondNav);
        var navBar = $('navBar');
        var clear;

        PortFun.currNavNum = liNum;
        PortFun.curPage = 1;
        clearClass('navSecondContent');
        allInit()
            //console.log([liNum, direction]);
        if (wordDismantle(currentBp['myName'])[0] == 'navSecondContent') {
            PortFun.getSecondContent(liNum);
        }
        PortFun.currTag = null;
        switch (liNum) {
            case 0:
                {

                    navBar.setAttribute('style', 'height:73px');
                    navSecondUl.className = 'showHidden';
                    secondShow.className = 'showHidden';
                    change(currentName, { down: 'show_0' });
                    show.setAttribute("class", "");
                    firstNav = currentName;

                    for (var i = 0; i < 12; i++) {
                        $("i_" + i).setAttribute("style", "display:none"); //角标
                        $("g_" + i).setAttribute("style", "display:none");
                        $("i_" + i).setAttribute("class", "jiaobiao"); //角标
                        $("g_" + i).setAttribute("class", "jiaobiao");
                    }
                    break;
                }
            case 1:
                {
                    navBar.setAttribute('style', 'height:110px');
                    navSecondUl.className = '';
                    creatLi('navSecondContent', '最新,欧美剧,韩剧');

                    navSecondUl.getElementsByTagName('li')[0].setAttribute('class', '');
                    change(currentName, { down: 'navSecondContent_0' })

                    groupGenerate('navSecondContent', { left: null, right: null, up: currentName, down: 'secondShowContent_0' }, 1)
                    secondShow.className = '';
                    secondShow.setAttribute("class", "xiaojiantou");
                    show.setAttribute("class", "showHidden");
                    firstNav = currentName;

                    if (direction == 'left' || direction == 'right')
                        PortFun.getSecondContent(liNum);
                    // if (direction == 'left')
                    //     PortFun.getSecondContent(liNum);
                    break;
                }
            case 2:
                {
                    navBar.setAttribute('style', 'height:110px');
                    //无导航时
                    navSecondUl.className = 'showHidden';
                    change(currentName, { down: 'secondShowContent_0' });
                    //有导航时
                    //navSecondUl.className = '';
                    //creatLi('navSecondContent', '最新,美国综艺,韩国综艺');

                    //navSecondUl.getElementsByTagName('li')[0].setAttribute('class','');
                    //change(currentName,{down:'navSecondContent_0'})

                    // groupGenerate('navSecondContent', { left: null, right: null, up: currentName, down: 'secondShowContent_0' }, 1)
                    secondShow.className = '';
                    secondShow.setAttribute("class", "xiaojiantou");
                    show.setAttribute("class", "showHidden");
                    firstNav = currentName;
                    if (direction == 'left' || direction == 'right')
                        PortFun.getSecondContent(liNum);

                    break;
                }
            case 3:
                {
                    navBar.setAttribute('style', 'height:110px');
                    navSecondUl.className = 'showHidden';
                    show.setAttribute("class", "showHidden");
                    change(currentName, { down: 'secondShowContent_0' });
                    secondShow.className = '';
                    secondShow.setAttribute("class", "xiaojiantou");
                    firstNav = currentName;
                    if (direction == 'left' || direction == 'right')
                        PortFun.getSecondContent(liNum);
                    break;
                }
            case 4:
                {
                    navBar.setAttribute('style', 'height:110px');
                    navSecondUl.className = '';
                    creatLi('navSecondContent', '最新,纪录片,电视剧,栏目');

                    navSecondUl.getElementsByTagName('li')[0].setAttribute('class', '');
                    change(currentName, { down: 'navSecondContent_0' })

                    groupGenerate('navSecondContent', { left: null, right: null, up: currentName, down: 'secondShowContent_0' }, 1)
                    secondShow.className = '';
                    secondShow.setAttribute("class", "xiaojiantou");
                    show.setAttribute("class", "showHidden");
                    firstNav = currentName;
                    if (direction == 'left' || direction == 'right')
                        PortFun.getSecondContent(liNum);
                    break;
                }
            case 5:
                {
                    navBar.setAttribute('style', 'height:110px');
                    navSecondUl.className = 'showHidden';
                    secondShow.className = '';
                    secondShow.setAttribute("class", "xiaojiantou");
                    change(currentName, { down: 'secondShowContent_0' });
                    show.setAttribute("class", "showHidden");
                    firstNav = currentName;
                    if (direction == 'right')
                        PortFun.getSecondContent(liNum);
                    break;
                }
        }


        for (var i = 0; i < navList.length; i++) {
            if (navList[i].nodeType == 1) {
                navLi[navLi.length] = navList[i];
            }
        }
        for (var j = 0; j < navLi.length; j++)
            navLi[j].className = '';
        navLi[liNum].className = 'wordAction';
        navUl.className = '';
        navUl.className = 'nav' + liNum;
    }, //nav  end
    navSecondContent: function(liNum, direction) {
            liNum = parseInt(liNum);
            var navUl = $('navSecondContent'),
                navLi = navUl.getElementsByTagName('li')[liNum],
                div = $('navSecond'),
                currentName = 'navSecondContent_' + liNum,
                firstNavNum = wordDismantle(firstNav)[1];
            if (wordDismantle(firstNav)[0] == 'nav')
                change(firstNav, { down: currentName });
            clearClass('navSecondContent');
            allInit();
            navLi.setAttribute('class', 'secondNavWordFocus');
            secondNav = currentName;
            //console.log(direction);
            if (direction == 'left' || direction == 'right') {
                PortFun.curPage = 1;

                var tag = navLi.getElementsByTagName('span')[0].innerText

                if (liNum != 0 && tag != '最新') {
                    PortFun.getContent(firstNavNum, tag);
                    //console.log(tag);
                    PortFun.currTag = tag;
                    PortFun.currPage = 1;
                } else {
                    PortFun.currTag = null;
                    PortFun.getSecondContent(firstNavNum);
                    PortFun.currPage = 1;
                }
            }

        } //navSecondContent end
        ,
    show: function(liNum) {
            liNum = parseInt(liNum);
            var navUl = $('show');
            var navList = navUl.childNodes;
            var navLi = [];
            allInit();
            for (var i = 0; i < navList.length; i++) {
                if (navList[i].nodeType == 1) {
                    navLi[navLi.length] = navList[i];
                }
            }
            for (var j = 0; j < navLi.length; j++) { navLi[j].className = ''; }
            switch (liNum) {
                case 0:
                    {
                        navLi[liNum].className = 'choseFrame1';
                        break;
                    }
                case 1:

                case 2:
                    {
                        navLi[liNum].className = 'choseFrame2';

                        break;
                    }
                case 3:

                case 4:

                case 5:
                    {
                        navLi[liNum].className = 'choseFrame3';
                        break;
                    }
            }
        } //show end 
        ,
    buyCollect: function(liNum) {
        var bcUl = $('buyCollect'),
            bcLi = bcUl.getElementsByTagName('li'),
            liNum = parseInt(liNum);
        allInit();
        bcLi[liNum].setAttribute('class', 'buyCollectFocus');
    },

    secondShowContent: function(liNum) {
        var Ul = $('secondShowContent'),
            img = Ul.getElementsByTagName('img'),
            liNum = parseInt(liNum),
            li = Ul.getElementsByTagName('li')[liNum],
            arr = wordDismantle(firstNav),
            title = data_title[liNum];
        arrBp = wordDismantle(currentBp['myName']);

        allInit();
        clearClass('navSecondContent');
        img[liNum].setAttribute('class', 'secondPicChose');
        if (arrBp[0] == 'secondShowContent') {

            Ul.getElementsByTagName('li')[arrBp[1]].getElementsByTagName('p')[0].innerHTML = data_title[parseInt(arrBp[1])];
        }
        li.getElementsByTagName('p')[0].innerHTML = IEPG.subText(title, 16, 1);
        switch (parseInt(arr[1])) {
            case 1:

            case 4:
                {
                    groupGenerate('secondShowContent', { left: null, right: null, up: secondNav, down: null }, 2);
                    break;
                };
            case 2:
            case 3:
            case 5:
                {
                    groupGenerate('secondShowContent', { left: null, right: null, up: firstNav, down: null }, 2);
                    break;
                }
        }


    },
    buyChose: function(liNum) {
        var bcUl = $('buyChose'),
            bcLi = bcUl.getElementsByTagName('li'),
            liNum = parseInt(liNum);
        //allInit();
        clearClass('buyChose');
        clearClass('buyConfirm');
        bcUl.setAttribute('class', '');
        $('buyConfirm').setAttribute('class', 'showHidden');
        $('buyConfirmText').setAttribute('class', 'showHidden');
        bcLi[liNum].setAttribute('class', 'buyActive');
    },
    buyConfirm: function(liNum) {
        var bcUl = $('buyConfirm'),
            bcLi = bcUl.getElementsByTagName('li'),
            liNum = parseInt(liNum);
        clearClass('buyConfirm');
        $('buyChose').setAttribute('class', 'showHidden');
        bcUl.setAttribute('class', '');
        $('buyConfirmText').setAttribute('class', '');
        bcLi[liNum].setAttribute('class', 'buyActive');
        //console.log(currentBtn);
    },
    init: function(who) {
        switch (who) {
            case 'buyCollect':
                {
                    clearClass('buyCollect');
                    break;
                };
            case 'secondShowContent':
                {
                    var navUl = $('secondShowContent'),
                        img = navUl.getElementsByTagName('img');
                    for (var i = 0; i < img.length; i++)
                        img[i].setAttribute('class', '');
                    break;
                };
            case 'show':
                {
                    clearClass('show');
                };
            case 'nav':
                {
                    var navUl = $('nav');
                    navUl.setAttribute('class', '');
                    clearClass('nav');

                };
            case 'buyChose':
                {
                    var ul = $('buyChose'),
                        li = ul.getElementsByTagName('li'),
                        buyLayout = $('buyLayout');
                    clearClass('buyChose');
                    li[0].setAttribute('class', 'buyActive');
                    buyLayout.setAttribute('style', 'display:none');
                }

        }

    }
};

var btnConfirm = {
    show: function(liNum) {
        var liNum = parseInt(liNum);
        saveUrlPath();
        PortFun.saveGlobals();
        var num = 0;
        switch (liNum) {
            case 0:
                {
                    var li = $('showBigPic').getElementsByTagName('li');
                    for (var i = 0; i < 3; i++) {
                        if (li[i].className == 'showPic') num = i;
                    };
                    break;
                }
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                {
                    num = liNum + 2;
                    break;
                }
        }

        PortFun.toThree(num, first_data);
    },
    secondShowContent: function(liNum) {
        var liNum = parseInt(liNum);
        saveUrlPath();
        PortFun.saveGlobals();
        PortFun.toThree(liNum, second_data);
    },
    buyCollect: function(liNum) {
        var bcUl = $('buyCollect'),
            bcLi = bcUl.getElementsByTagName('li'),
            liNum = parseInt(liNum);
        allInit();
        change('buyCollect_0', { confirm: 'buyChose_0' }); //修正按钮
        saveUrlPath();
        PortFun.saveGlobals();
        if (liNum == 0) {
          if (isAccessOrder) { //如果购买过产品
                showMsg("", "您已经购买过该产品！");
                change('buyCollect_0', { confirm: null }); //修正按钮
                bcLi[0].setAttribute('class', 'buyCollectFocus')

            } else {
                var ul = $('buyChose'),
                    li = ul.getElementsByTagName('li'),
                    buyLayout = $('buyLayout');
                clearClass('buyChose');
                li[0].setAttribute('class', 'buyActive');
                buyLayout.setAttribute('style', 'display:block');
            }

        } else {
            window.location.href = goUrl + "/iPG/myzone/myZone_list.htm";

        }
    },
    buyChose: function(liNum) {
        var ul = $('buyChose'),
            li = ul.getElementsByTagName('li'),
            buyLayout = $('buyLayout'),
            liNum = parseInt(liNum),
            buyTime = '';
        if (liNum != 6) {
            $('buyChose').setAttribute('class', 'showHidden');
            $('buyConfirm').setAttribute('class', '');
            $('buyConfirmText').setAttribute('class', '');
            $('buyConfirm').getElementsByTagName('li')[1].setAttribute('class', 'buyActive');
            PortFun.buyNum = liNum;
            switch (liNum) {
                case 0:

                case 1:
                    buyTime = '一个月';
                    break;
                case 2:

                case 3:
                    buyTime = '一季度';
                    break;
                case 4:

                case 5:
                    buyTime = '一年';

                    break;
            }
            $('buyConfirmText').innerHTML = '请您确定订购数量：' + buyTime;
        } else {
            buyLayout.setAttribute('style', 'display:none');
            Strategies['buyCollect'](0);

        }
    },
    buyConfirm: function(liNum) {
        var ul = $('buyConfirm'),
            li = ul.getElementsByTagName('li'),
            buyLayout = $('buyLayout'),
            liNum = parseInt(liNum);
        if (liNum == 0) {
            //console.log(PortFun.buyNum);
            switch (PortFun.buyNum) {
                case 0:
                    PortFun.reFreshBuy(1);
                    break;
                case 1:
                    PortFun.gotoWeixin(1);
                    break;
                case 2:
                    PortFun.reFreshBuy(3);
                    break;
                case 3:
                    PortFun.gotoWeixin(3);
                    break;
                case 4:
                    PortFun.reFreshBuy(12);
                    break;
                case 5:
                    PortFun.gotoWeixin(12);
                    break;
                default:
                    showMsg("", "系统错误，请营业厅购买");
                    break;
            }
        } else {
            buyLayout.setAttribute('style', 'display:none');
            Strategies['buyCollect'](0);
        }
        $('buyChose').setAttribute('class', '');
        $('buyConfirm').setAttribute('class', 'showHidden');
        $('buyConfirmText').setAttribute('class', 'showHidden');
        buyLayout.setAttribute('style', 'display:none');
        clearClass('buyConfirm');
        Strategies['buyCollect'](0);
    }

};
//工具函数及使用声明
var addBtn = BtnDirector.ReceiveMessage('btnAdd');
var logBtn = BtnDirector.ReceiveMessage('log');
var groupGenerate = BtnDirector.ReceiveMessage('groupGenerate');
var find = BtnDirector.Find();
var change = btnChange(find);

function wordDismantle(direction) { //字符串分割，用于分割'_'作为分隔符的字符串
    if (!direction) alert(direction);
    //sconsole.trace();
    return direction.split('_');
};

function btnExcute(direction, currentBtn, Strategies) {
    var arry = wordDismantle(currentBtn[direction]);
    var ulName = arry[0];
    var liNum = arry[1];
    //console.log(ulName);
    Strategies[ulName](liNum, direction);

};
//创建二级导航
function creatLi(ulId, string) {
    var ul = $(ulId),
        arr = string.split(','),
        str = String();
    for (var i = 0; i < arr.length; i++) {
        str += "<li><span>" + arr[i] + "</span></li>";

    }
    ul.innerHTML = str;
};

function clearClass(ID) {
    var navUl = $(ID);
    var navList = navUl.childNodes;
    var navLi = [];
    for (var i = 0; i < navList.length; i++) {
        if (navList[i].nodeType == 1) {
            navList[i].className = '';
        }
    }
};

function btnChange(fun) {
    return function(myName, direction) {
        var btn = fun(myName);
        for (key in direction) {
            btn[key] = direction[key];
        }
    };


}

function keyAction(direction, Strategies) {
    if (currentBtn[direction] != null) {
        currentBp = currentBtn;
        btnExcute(direction, currentBtn, Strategies);
        currentBtn = find(currentBtn[direction]);
    }
}

function allInit() {
    var navBar = $('navBar');
    Strategies['init']('buyCollect');
    Strategies['init']('secondShowContent');
    Strategies['init']('show');
    Strategies['init']('nav');
    Strategies['init']('buyChose');
    navBar.setAttribute('height', '73px');
}


function setFocus(currentBtn) {
    btnExcute('myName', currentBtn, Strategies);

}
//用这个获取标签的内联样式，当标签被隐藏时按钮不移动
function getStyle(obj, attr) {
    if (window.getComputedStyle) {
        return getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}
//仓库页判断
function btnAssert(currentBtn, direction) {
    var myName = currentBtn['myName'];
    if (myName == null) return true;

    if (wordDismantle(myName)[0] == 'secondShowContent') {
        var liBtn = $(wordDismantle(myName)[0]).getElementsByTagName("li")[wordDismantle(myName)[1]];
        if (currentBtn[direction]) {
            var btnArr = wordDismantle(currentBtn[direction]);
            var li = $(btnArr[0]).getElementsByTagName("li")[btnArr[1]];
            //仓库页按钮判断，若被隐藏则什么都不执行
            if (getStyle(li, 'display') == '' || getStyle(li, 'display') == 'none') {

                return true;
            }
        } else
        //仓库页翻页判断
        if (direction == 'left') {
            if (myName == 'secondShowContent_0' || myName == 'secondShowContent_6') {
                if (PortFun.curPage > 1) {
                    PortFun.pageLeft();
                    return true;
                } else {
                    return false;
                }
            }
        } else if (direction == 'right') {
            if (myName == 'secondShowContent_5' || myName == 'secondShowContent_11') {
                if (PortFun.curPage < PortFun.totalPage) {
                    PortFun.pageRight();
                    return true;
                } else {
                    return false;
                }
            }

        }
    } else {
        return false
    };


}

function btnBack() {
    if (!firstNav) firstNav = 'nav_0';
    var firstArr = wordDismantle(firstNav);
    var secondArr = wordDismantle(secondNav);
    //alert(firstNav);

    switch (parseInt(firstArr[1])) {
        case 0:
            {
                var navBar = $('navBar');
                navBar.setAttribute('style', 'height:73px');
                break;
            }
        case 1:
        case 4:
            {
                var navBar = $('navBar');
                navBar.setAttribute('style', 'height:110px');
                setFocus(find(firstNav));
                var navLi = $(secondArr[0]).getElementsByTagName('li')[secondArr[1]];
                var tag = navLi.getElementsByTagName('span')[0].innerText
                PortFun.currTag = tag;
                PortFun.curPage = PortFun.curPageBp; //页码修正
                change(secondNav, { down: 'secondShowContent_0' });
                change(secondNav, { up: firstNav });
                groupGenerate('secondShowContent', { left: null, right: null, up: secondNav, down: null }, 2);
                //console.log('1',PortFun.currTag, PortFun.currTag,PortFun.startAt);
                if (PortFun.currTag != null && PortFun.currTag != '最新') {
                    //console.log(PortFun.currTag, PortFun.currTag,PortFun.startAt);
                    PortFun.getContent(PortFun.currNavNum, PortFun.currTag, PortFun.startAt);
                } else PortFun.getFirstPage(PortFun.currNavNum, PortFun.startAt);
                break;
            }
        case 2:
        case 3:
        case 5:
            {
                var navBar = $('navBar');
                navBar.setAttribute('style', 'height:110px');
                setFocus(find(firstNav));
                PortFun.curPage = PortFun.curPageBp;
                //console.log('PortFun.curPageBp:', PortFun.curPageBp);
                groupGenerate('secondShowContent', { left: null, right: null, up: firstNav, down: null }, 2);
                PortFun.getFirstPage(firstArr[1], PortFun.startAt);
                break;
            }
    }

};
/*
 *按钮生成
 */
//导航
groupGenerate('nav', { left: null, right: 'buyCollect_0', up: null, down: 'navSecondContent_0' }, 1);
//首页内容栏
addBtn({ left: 'buyCollect_1', right: 'show_1', up: 'nav_0', down: 'show_3', myName: 'show_0' }, //0
    { left: 'show_0', right: null, up: 'nav_0', down: 'show_2', myName: 'show_1' }, //1
    { left: 'show_5', right: null, up: 'show_1', down: null, myName: 'show_2' }, //2
    { left: null, right: 'show_4', up: 'show_0', down: null, myName: 'show_3' }, //3
    { left: 'show_3', right: 'show_5', up: 'show_0', down: null, myName: 'show_4' }, //4 
    { left: 'show_4', right: 'show_2', up: 'show_0', down: null, myName: 'show_5' } //5
);
//购买
groupGenerate('buyCollect', { left: 'nav_5', right: null, up: null, down: 'secondShowContent_0' }, 1);
change('buyCollect_0', { confirm: 'buyChose_0' });
//第二页内容栏
//需要定义left：pageLeft； right：pageRight
groupGenerate('secondShowContent', { left: null, right: null, up: 'nav_3', down: null }, 2);
//购买界面按钮
groupGenerate('buyChose', { left: null, right: null, up: null, down: null, confirm: 'buyConfirm_1' }, 4);
change('buyChose_6', { confirm: 'buyCollect_0' })

//购买确定
groupGenerate('buyConfirm', { left: null, right: null, up: null, down: null, confirm: 'buyCollect_0' }, 1);

/*
 *按钮执行程序
 */
function moveRight() {
    //console.log(currentBtn);
    if (!judge) return;
    if (!btnAssert(currentBtn, 'right'))
        keyAction('right', Strategies);
}

function moveLeft() {
    //console.log(currentBtn);
    if (!btnAssert(currentBtn, 'left'))
        keyAction('left', Strategies);
}

function moveUp() {
    //console.log(currentBtn);
    keyAction('up', Strategies);
}

function moveDown() {
    //console.log(currentBtn);
    if (!btnAssert(currentBtn, 'down'))
        keyAction('down', Strategies);
}

function doConfirm() {
    //console.log(currentBtn);
    keyAction('myName', btnConfirm);
    if (currentBtn['confirm'] != null)
        currentBtn = find(currentBtn['confirm']); //修正
    //console.log('123', currentBtn);
}
var $Path = {//路径处理
    _globalName : 'urlPathGlobalName',//此处不能修改，全部用统一的名字
    _splitChar : '#',
    _get : function(){
        this.cookie = getGlobalVar(this._globalName) == undefined ? "" : getGlobalVar(this._globalName);//取机顶盒cookie
        this.urlArr = this.cookie.split(this._splitChar);
    },
    _wr : function(){//写入中间件cookie
        this.cookie = this.urlArr.join(this._splitChar);
        setGlobalVar(this._globalName, this.cookie);//保存
    },
    last : function(){
        this._get();
        return this.urlArr[this.urlArr.length-1];
    },
    mod : function(){//处理当前地址（加入焦点位置，页码，等参数）
//如：当前地址为：http://10.69.2.31/list.html，焦点位置index为2，页码p为3
//保存路径之前，在此加上url参数http://10.69.2.31/list.html?index=2&p=3
//如不需要处理当前地址，直接返回location.href
        this.url = '';
        return this.url;
    },
    sav : function(){
        this._get();
        var urlArr = this.urlArr;
        try{//如果最后一条地址和当前地址相同，则删除最后一条，避免重复保存
            if(urlArr[urlArr.length-1].match(/.*(?=\?)/)[0] == location.href.match(/.*(?=\?)/)[0])
                urlArr.pop();
        }catch(e){
            if(urlArr[urlArr.length-1] == location.href)
                urlArr.pop()
        };
        this.mod();
        urlArr.push(this.url);//将修改后的当前地址放入数组末尾
        if(urlArr.length > 6) {//最多保留7条路径
            var newArr = urlArr.slice(urlArr.length - 6);//从指定位置截取数组
            this.urlArr = urlArr[1].concat(newArr);//保留原来数组中第一个路径（portal进入的路径）
        }
        this._wr();
    },
    back : function(){//返回前一路径
        this._get();
        var href = this.urlArr.pop();
        this._wr();
        if (!href||href=='') {
            this.home();
        }
        location.href = href;
        if(getQueryStr(location.href,"from")=="dvbplayer"){//频道混排
            Utility.ioctlWrite("START_APP", "PackageName:com.coship.guizhou.dvb");
        }
    },
    home : function(){
        this.clear();
        Utility.setEnv("portal_Form","");
        location.href = getGlobalVar("PORTAL_ADDR");
    },
    clear : function(){//清除所有路径
        setGlobalVar(this._globalName, '');
    }
};
function getPrevPath() { //从机顶盒变量或浏览器cookie中获取前一路径，前一页面需要saveUrlPath
    var tempUrl = getGlobalVar(urlPathGlobalName);
    if (tempUrl == undefined || tempUrl == "") return "";
    var tuArr = tempUrl.split(urlSplitChar);
    var tl = tuArr.length;
    var tul = tuArr.pop();
    if (tul.split("?")[0] == location.href.split("?")[0]) {
        tul = tuArr.pop();
    }
    return tul;
};
function doReturnKey() {
    
        setGlobalVar("isBack", "Y"); //页面返回标示，Y如果是从其他页面返回到当前页则取保存的机顶盒变量
        //clearGlobalVar();
   var result = getPrevPath();
    if(result.indexOf('hd')==-1){
        goReturnUrlPath();
    }else{
       window.location.href = getGlobalVar("PORTAL_ADDR");
    }
        return false;
    
}
var timer = "";

function doNumberKey(num, start) {
    if (firstNav != 'nav_0') {
        if (timer) clearTimeout(timer);
        if ($("pagenumber").innerHTML == '输入页面自动跳转') { $("pagenumber").innerHTML = ''; }
        $("pagenumber").innerHTML += num - start;
        timer = setTimeout(function() {

            var index = parseInt($("pagenumber").innerHTML);
            if (index > PortFun.totalPage) {
                index = PortFun.totalPage;
            }
            if (index < 1) {
                index = 1;
            }
            PortFun.curPage = index;
            PortFun.startAt = PortFun.curPage * PortFun.dataSize - 11;
            var firstArr = wordDismantle(firstNav);
            switch (parseInt(firstArr[1])) {
                case 0:
                    {
                        break;
                    }
                case 1:
                case 4:
                    {
                        if (PortFun.currTag != null && PortFun.currTag != "最新")
                            PortFun.getContent(PortFun.currNavNum, PortFun.currTag, PortFun.startAt);
                        else PortFun.getFirstPage(firstArr[1], PortFun.startAt);
                        break;
                    }
                case 2:
                case 3:
                case 5:
                    {
                        PortFun.getFirstPage(firstArr[1], PortFun.startAt);
                        break;
                    }
            }
            $("pagenumber").innerHTML = "输入页面自动跳转";
            var arr = wordDismantle(currentBtn['myName'])
           // console.log('myName', currentBtn['myName'])
            //console.log('arr[0]', arr[0]);
            if (arr[0] == 'secondShowContent') {
                setFocus(find('secondShowContent_0'));
                currentBtn = find('secondShowContent_0');
            }
        }, 2000);
    }
}
/**
 * 轮播图
 **/
function showBigPic(picUlName, markUlName, title, picFocus, markFocus, titleContent, time) {
    var picUl = $(picUlName),
        picLi = picUl.getElementsByTagName('li'),
        length = picLi.length,
        markUl = $(markUlName),
        markLi = markUl.getElementsByTagName('li'),
        title = $(title),
        cnt = 0;
    return function run() {
        if (cnt > length - 1) cnt = 0;
        for (var i = 0; i < length; i++) {
            picLi[i].className = '';
            markLi[i].className = '';
        };
        picLi[cnt].className = picFocus;
        markLi[cnt].className = markFocus;
        title.innerHTML = titleContent[cnt];
        cnt++;
        setTimeout(run, time);
    }
}

window.onload = function() {
    if (getGlobalVar("isBack") == "Y") {
        PortFun.getGlobals();
        PortFun.curPageBp = PortFun.curPage;
        btnBack();
        // console.group("btnBack");　
        // console.log("currentName:", currentName);　　
        // console.log("firstNav:", firstNav);　　　　
        // console.log("PortFun.currNavNum:", PortFun.currNavNum);
        // console.log("PortFun.currTag:", PortFun.currTag);
        // console.log("PortFun.startAt:", PortFun.startAt);
        // console.log("PortFun.curPage:", PortFun.curPage);
        // console.groupEnd();
        PortFun.clearGlobals();
    }
    allInit();
    for (var i = 0; i < 12; i++) {
        $("i_" + i).setAttribute("style", ""); //角标
        $("g_" + i).setAttribute("style", "");
    }
    currentBtn = find(currentName);
    VOD_getChildColumnList = {
        data: '<GetFolderContents  mergeTV="1" includeFolderProperties="Y" includeSubFolder="Y"  includeSelectableItem="Y" startAt="1"  maxItems="8"  assetId="' + columnId + '" portalId="' + portalId + '" client="' + cardId + '" account="' + userId + '"/>',
        callBack: getZiyuan
    };
    IEPG.getData(URL.VOD_getChildColumnList, VOD_getChildColumnList);
    authentication("MANU228065");
    queryBalance();
    setFocus(currentBtn);
};
