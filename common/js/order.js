//userId=cardId="8851003744907962";//有钱的卡号
//userId=cardId="8851002922273759";//没钱的卡号
var bossNetwork = "http://10.68.1.17:8180"; //现网
//var bossNetwork = "http://10.68.1.65:8180";//测试
var o = {
    balance: 0,
    clientcode: "DCYDB001",
    clientpwd: "DCYDB001",
    citycode: "",
    custData: [],
    price: 0,
    serviceId: "",
    assetId: "",
    providerId: "",
    pcode: "",
    yxcode: "",
    isAccess: true, ///是否有权限
    checkPrice: false,
    showCancel: false,
    checkPlayCallback: null,
    folderContents: {},
    authentication: function(columnId) { //鉴权
        var VOD_getFolderContents = {
            "data": '<GetFolderContents  mergeTV="1" assetId="' + columnId + '" portalId="' + portalId + '" account="' + userId + '" client="' + cardId + '" includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y" maxItems="10" startAt="1" />',
            "callBack": o.callBackAuthentication
        };
        IEPG.getData(URL.VOD_getAssetList, VOD_getFolderContents);
    },
    callBackAuthentication: function(dataJson) {
        o.folderContents = dataJson;
        o.serviceId = dataJson.folderFrame.serviceId;
        o.assetId = dataJson.selectableItemList[0].assetId;
        o.providerId = dataJson.selectableItemList[0].providerId;
        var VOD_checkBuy = {
            "data": "<ValidatePlayEligibility providerId=\"" + o.providerId + "\" serviceId=\"" + o.serviceId + "\" assetId=\"" + o.assetId + "\" portalId=\"" + portalId + "\" client=\"" + cardId + "\" account=\"" + userId + "\"/>",
            "callBack": o.checkBuy
        };
        IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
    },
    checkBuy: function(dataJson) {
        if (dataJson.orderFlag == "N") {
            o.isAccess = false;
            o.order(dataJson);
        } else {
            o.isAccess = true;
        }
    },
    init: function(param) {
        o.columnId = param.columnId || "";
        o.showCancel = param.showCancel || false;
        o.checkPlayCallback = param.checkPlayCallback || null;
        o.checkPlayCallbackParam = param.checkPlayCallbackParam || 0;
        o.count = param.count || 1; //周期，1：一个月，6：半年，12：一年	
        o.authentication(o.columnId);
        //o.bossInquiry();
    },
    order: function(param) { //订购方式
        if (!o.isAccess) {
            /*setTimeout(function(){
            	alert("该栏目没有订购，即将走订购流程。 cardId: " + cardId + ", price: " + param.price);
            	o.queryBalance();				
            },2000)；*/
            //o.checkPrice = true;
            //o.getCitycode();
            o.queryBalance();
            //x$.buy("该栏目没有订购，即将走订购流程。 cardId: " + cardId + ", price: " + o.price);
            //o.checkPrice = false;
        } else {
            // 鉴权成功，开始播放。
            IEPG.doPlay();
        }
    },
    queryPcode: function() {
        var url = bossNetwork + "/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
        var requestContent = {
            count: o.count,
            caid: o.serviceId,
            smno: cardId
        }
        ajaxUrl(url + "&version=1&clientcode=" + o.clientcode + "&clientpwd=" + o.clientpwd + "&servicecode=QUE_PCODEINFO&citycode=" + o.citycode + "&requestid=" + getRequestid(o.clientcode) + "&requestContent=" + Obj2str(requestContent) + "&dataSign=\"\"", o.callBackQueryPcode, null);
    },
    callBackQueryPcode: function(dataJson) {
        alert(dataJson.status);
        if (dataJson.status == "0") {
            o.pcode = dataJson.output.pcode;
            o.bossInquiry();
        }
    },
    queryBalance: 　 function() { //查询余额
        ajaxUrl(
            bossNetwork + "/UAP/UAPJAction.do?METHOD=uniForward&opcode=Z02&syscode=DCYDB001&sm_no=" + cardId,
            o.callBackQueryBalance,
            null
        );
    },
    callBackQueryBalance: function(dataJson) {
        if (dataJson.status == "0000") {
            o.balance = dataJson.ouput.cashbox;
        } else {
            o.balance = 0;
        }
        o.getCitycode();
    },
    getCitycode: function() {
        ajaxUrl(bossNetwork + "/UAP/InterfacerouteWXAction.do?METHOD=queryCityByKeyno&requestContent={keyno:" + cardId + "}",
            function(dataJson) {
                if (dataJson.status == "0000") {
                    o.citycode = dataJson.output.citycode;
                    o.queryCustInfo();
                }
            },
            null
        )
    },
    queryCustInfo: function() {
        //var bossNetwork = "http://10.68.1.17:8180";
        var url = bossNetwork + "/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
        var requestContent = {
            identifierType: "3", //0：证件编码（身份证号等）1：手机号,2：客户ID,3：智能卡号
            identifier: 　cardId,
            city: o.citycode
        }
        ajaxUrl(url + "&version=1&clientcode=" + o.clientcode + "&clientpwd=" + o.clientpwd + "&servicecode=QUE_CUSTINFO&citycode=" + o.citycode + "&requestid=" + getRequestid(o.clientcode) + "&requestContent=" + Obj2str(requestContent) + "&dataSign=\"\"", o.callBackQueryCustInfo, null);
    },
    callBackQueryCustInfo: function(dataJson) {
        if (dataJson.status == "0") {
            o.custData = dataJson.output[0];
            o.bossInquiry();
        }
    },
    bossInquiry: function() { //boss询价
        var url = bossNetwork + "/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
        var requestContent = {
            custid: o.custData.custid,
            keyno: cardId,
            pcode: "",
            prodtype: "",
            count: o.count,
            caid: o.serviceId,
            salespatterns: [{
                patternflag: "mounth",
                ordercount: "1",
                orderunit: "1",
                ispostpone: "N",
            }]
        };
        ajaxUrl(url + "&version=1.0&clientcode=" + o.clientcode + "&clientpwd=" + o.clientpwd + "&servicecode=QUE_PRDPRICES&requestid=" + getRequestid(o.clientcode) + "&citycode=" + o.citycode + "&requestContent=" + Obj2str(requestContent), o.callBackInquiry, null);
    },
    callBackInquiry: function(dataJson) {
        if (dataJson.status == "0") {

            o.price = dataJson.output.pricelist[0].price;
            //alert(o.price);
            o.pcode = dataJson.output.pcode;
            o.prodtype = dataJson.output.prodtype; //0：产品；1：促销
            //alert(o.prodtype);
            if (o.prodtype == 0) {
                o.pcode = o.pcode;
                o.yxcode = "";
                o.cyclename = "cycle";
            } else if (o.prodtype == 1) {
                o.yxcode = o.pcode;
                o.pcode = "";
                o.cyclename = "yxcycle";
            }

            if (o.price > o.balance) {
                saveUrlPath();
                window.location.href = "./common/js/zf/index.html?productName=" + o.folderContents.folderFrame.displayName + "&serviceId=" + o.serviceId + "&count=" + o.count;
            } else {
                o.doOrer(1)
            }

        } else {
            showMsg("",dataJson.status + ":" + dataJson.message);
        }
    },
    doOrer: function(cycle) {
        //alert("doOrer");
        //var url = "http://10.68.0.65:8080/OssWeb/core/interactive/mscp/MSCPAction.do?METHOD=doOrder&keyno="+cardId+"&cycle="+cycle+"&cycleUnit=1&pcode="+o.pcode+"&sums="+o.price+"&ChannelVO=MP&channelCode=MP";
        //var url = "http://10.68.1.17:8180/UAP/UAPJAction.do?METHOD=uniForward";//现网
        var url = bossNetwork + "/UAP/UAPJAction.do?METHOD=uniForward"; //测试
        var str = "&opcode=Z04&syscode=DCYDB001&sm_no=" + cardId + "&keyno=" + cardId + "&" + o.cyclename + "=" + cycle + "&cycleUnit=1&permark=1&pcode=" + o.pcode + "&yxcode=" + o.yxcode + "&sums=" + o.price;
        ajaxUrl(url + str, o.callBackDoOder, null);
    },
    callBackDoOder: function(dataJson) {
        if (dataJson.state == "1") {
            o.isAccess = true;
            isAccessOrder = true;
            showMsg("","订购成功，请重新进入专区！");
        } else {
            showMsg("","扣款失败，请营业厅购买！");
        }
    }
}

function Obj2str(o) {
    if (o == undefined) {
        return "";
    }
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push("\"" + i + "\":" + Obj2str(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}"
        } else {
            for (var i = 0; i < o.length; i++)
                r.push(Obj2str(o[i]))
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString().replace(/\"\:/g, '":""');
}

function getRequestid(clientc) {
    var code = clientc || clientcode;
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    return code + y + m + d + Math.floor(Math.random() * 100000000);
}
