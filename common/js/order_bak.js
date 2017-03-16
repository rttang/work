//userId=cardId="8851003744907962";//有钱的卡号
//userId=cardId="8851003052566467";//2105的卡号
//userId=cardId="8851003838372164";//没钱的卡号
var o = {
	balance : 0,
	clientcode : "DCYDB001",
	clientpwd : "DCYDB001",
	citycode : "",
	custData : [],
	price : 0,	
	serviceId : "",
	assetId : "",
	providerId : "",
	isAccess : true,///是否有权限
	folderContents : {},
	authentication : function(columnId){//鉴权
		var VOD_getFolderContents = {
			"data": '<GetFolderContents  mergeTV="1" assetId="'+columnId+'" portalId="' + portalId + '" account="'+userId+'" client="'+cardId+'" includeFolderProperties="Y" includeSubFolder="Y" includeSelectableItem="Y" maxItems="10" startAt="1" />',
			"callBack": o.callBackAuthentication
		};
		IEPG.getData(URL.VOD_getAssetList, VOD_getFolderContents);
	},
	callBackAuthentication : function(dataJson){
		o.folderContents = dataJson;
		o.serviceId = dataJson.folderFrame.serviceId;
		o.assetId = dataJson.selectableItemList[0].assetId;
		o.providerId = dataJson.selectableItemList[0].providerId;
		var VOD_checkBuy = {
			"data":"<ValidatePlayEligibility providerId=\""+ o.providerId+"\" serviceId=\""+o.serviceId+"\" assetId=\"" + o.assetId + "\" portalId=\"" + portalId +"\" client=\"" + cardId +"\" account=\"" + userId +"\"/>",
			"callBack" : o.checkBuy
		};
        IEPG.getData(URL.VOD_checkBuy, VOD_checkBuy);
	},
	checkBuy : function(dataJson){
		if(dataJson.orderFlag == "N"){
			o.isAccess = false;
			alert("您还没有订购该产品！");
			o.order();
			
		}else{
			o.isAccess = true;
			alert("您已经订购该产品！")
		}
	},
	init : function(param){
		o.columnId = param.columnId || "";
		o.authentication(o.columnId);
	},
	order : function(){//订购方式
		//alert("进入订购");
		if(!o.isAccess){
			setTimeout(function(){
				//alert(cardId)
				//alert("该栏目没有订购，即将走订购流程。")
				o.queryBalance();
			},100)
		}
	},
	queryPcode : function(){
		alert("queryPcode");
		
		var url = "http://10.68.1.17:8180/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
		var requestContent = {
			caid : o.serviceId
		}
		ajaxUrl(url+"&version=1&clientcode="+o.clientcode+"&clientpwd="+o.clientpwd+"&servicecode=QUE_PCODE&citycode="+o.citycode+"&requestid="+getRequestid(o.clientcode)+"&requestContent="+Obj2str(requestContent)+"&dataSign=\"\"",o.callBackQueryPcode,null);
	},
	callBackQueryPcode : function(dataJson){
		alert("获取PCD");
		alert("状态码："+dataJson.status);//101
		if(dataJson.status == "0"){ //应该是0，一直都是这里过不去~BUG
			o.pcode = dataJson.output.pcode;
			o.bossInquiry();
		}
	},	
	queryBalance :　function(){//查询余额
		ajaxUrl(
			"http://10.68.1.17:8180/UAP/UAPJAction.do?METHOD=uniForward&opcode=Z02&syscode=DCYDB001&sm_no="+cardId,
			o.callBackQueryBalance,
			null
		);
	},
	callBackQueryBalance : function(dataJson){
		//alert("余额");
		if(dataJson.status=="0000"){
			 o.balance = dataJson.ouput.cashbox;
			 alert("您的余额是:"+o.balance); //获取账户余额
		}else{
			 o.balance = 0;
			 alert("您的账户余额为111");
		}

		o.getCitycode();
	},
	getCitycode : function(){
		alert("城市代码");
		ajaxUrl("http://10.68.1.17:8180/UAP/InterfacerouteWXAction.do?METHOD=queryCityByKeyno&requestContent={keyno:"+cardId+"}",
			function(dataJson){
				if(dataJson.status == "0000"){
					o.citycode = dataJson.output.citycode;
					alert("您的城市代码是："+o.citycode);//获取城市代码
					o.queryCustInfo();
				}	
			},
			null
		)
	},
	queryCustInfo : function(){
		var url = "http://10.68.1.17:8180/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
		alert("pcd");
		var requestContent = {
			identifierType : "3",//0：证件编码（身份证号等）1：手机号,2：客户ID,3：智能卡号
			identifier :　cardId,
			city : o.citycode
		}
		ajaxUrl(url+"&version=1&clientcode="+o.clientcode+"&clientpwd="+o.clientpwd+"&servicecode=QUE_CUSTINFO&citycode="+o.citycode+"&requestid="+getRequestid(o.clientcode)+"&requestContent="+Obj2str(requestContent)+"&dataSign=\"\"",o.callBackQueryCustInfo,null);
	},
	callBackQueryCustInfo : function(dataJson){
		alert("custinfo");

		if(dataJson.status == "0"){
			o.custData = dataJson.output[0];
			o.queryPcode();
		}
	},
	bossInquiry : function(){//boss询价
		alert("boss询价");
		var url = "http://10.68.1.17:8180/UAP/InterfacerouteWXAction.do?METHOD=uniForward";
		var requestContent = {
			custid : o.custData.custid,
			keyno : cardId,
			pcode : o.pcode,
			prodtype : "0",
			salespatterns : [{
				patternflag : "mounth",
				ordercount : "1",
				orderunit : "1",
				ispostpone : "N"
			}]
		};
		ajaxUrl(url+"&version=1.0&clientcode="+o.clientcode+"&clientpwd="+o.clientpwd+"&servicecode=QUE_PRDPRICES&requestid="+getRequestid(o.clientcode)+"&citycode="+o.citycode+"&requestContent="+Obj2str(requestContent),o.callBackInquiry,null);
	},
	callBackInquiry : function(dataJson){
		if(dataJson.status == "0"){
			o.price = dataJson.output.pricelist[0].price;
			$("buy_layout").getElementsByTagName("h3")[0].innerHTML="账户余额为："+o.balance+"，专区包月价格为："+o.price+"。";

			alert("产品价格是："+o.price);//获取产品价格
			//从这里开始可以自动修改
			
			if(o.price > o.balance){
				saveUrlPath();
				window.location.href = "./zf/index.html?productName="+o.folderContents.folderFrame.displayName+"&serviceId="+o.serviceId;//跳转到充值页面
			}else{
				alert("订购中...")
				//o.doOrer(1)
			}
			
			//从这里开始修改结束
		}
	},
	doOrer : function(cycle){//订购功能动作实现
		//var url = "http://10.68.0.65:8080/OssWeb/core/interactive/mscp/MSCPAction.do?METHOD=doOrder&keyno="+cardId+"&cycle="+cycle+"&cycleUnit=1&pcode="+o.pcode+"&sums="+o.price+"&ChannelVO=MP&channelCode=MP";
		//var url = "http://10.68.1.17:8180/UAP/UAPJAction.do?METHOD=uniForward";//现网

        var url = "http://10.68.1.17:8180/UAP/UAPJAction.do?METHOD=uniForward";//测试
		var str = "&opcode=Z04&syscode=DCYDB001&sm_no="+cardId+"&keyno="+cardId+"&cycle="+cycle+"&cycleUnit=1&permark=1&pcode="+o.pcode+"&sums="+o.price;
		ajaxUrl(url+str,o.callBackDoOder,null);
	},
	callBackDoOder : function(dataJson){
		if(dataJson.state == "1"){
				$("buy_layout").getElementsByTagName("h3")[0].innerHTML="购买成功,3秒后自动关闭";
				op.buyStep=1;op.buyButtonIndex=1;
				$("buy_layout").getElementsByTagName("p")[1].setAttribute("style", "display:none;");
				$("buy_layout").getElementsByTagName("p")[0].innerHTML="立即观看";
				$("buy_layout").getElementsByTagName("p")[0].className="buy_active";
				setTimeout(function(){$("buy_layout").setAttribute("style", "display:none;");op.buyStep=0;op.buyButtonIndex=0;}, 3000);
				o.isAccess=true;
		}//订购成功
		//alert(dataJson.info)
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

function getRequestid(clientc){
	var code = clientc || clientcode;
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	m = m < 10 ? "0" + m : m;
	var d = date.getDate();
	d = d < 10 ? "0" + d : d;
	return code+y+m+d+Math.floor(Math.random()*100000000);
}