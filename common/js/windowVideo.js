/*
	*******�����ڴ�����Ƶ����*******
	
	
	(���²�������ʵ���������)
		* vodServer : "",				//��Ƶ��Դ��ַ
		* ads : "",						//��Ƶ�Ϸ���ͼƬid
		* delay : "",						//�ڸ�����Ƶ�����ͼƬ��ʾʱ��
		* columnId : "",							//��Դ��Ŀ����
		* position : {										//��Ƶ������λ�úʹ�С���ֱ�Ϊ����߾࣬�ϱ߾࣬�?��
			left:"", top:"", width:"", height:""	
		}
		
*/
var portalId = "102";
//var cardId = getSmartCardId();
var userId = "1234567";
var cardId = "1234567";
function apply(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

/******************************  ҳ����Ƶ����Start *************************************/
function WindowVideo(config){
	var _this = this;
         if(typeof  MediaPlayer != "undefined"){
	     _this.mp = new MediaPlayer();
		 mp = _this.mp;
        }
	apply(this, config, {
		videoIndex : 0,		//��Ƶ�±�
		delay : 2000,			//�ڸ�����Ƶ�����ͼƬ��ʾʱ��
		isLoop : false			//true��ʾ������Ƶѭ����false��ʾ���õ���Ƶѭ����
	});
	_this .areaCode = "";			//������
	_this .assetList = [];
	_this .rtsp = "";
	function getRtsp(){			//��ȡRtsp��
		if(_this.assetList && _this.assetList.length>0){
			var asset = _this.assetList[_this.videoIndex];
			if(!asset) return;
			/*var url = _this.vodServer + "/play/playAction!getVodPlayRtsp.action?userId=" + userId + "&columnMapId=" + asset.columnMapId + "&resourceId=" + asset.resourceId + "&rtspType=O&tryFlag=0";
			ajaxUrl({
				url : url,
				handler : function(data){
					_this.rtsp = data.rtsp;
					playVideo();
				}
			});*/
			var url =_this.vodServer+"/SelectionStart";
			var VOD_getToken = {
				"data":"<SelectionStart titleProviderId=\""+ asset.providerId +"\" titleAssetId=\"" + asset.assetId + "\" folderAssetId=\"\" serviceId=\"\" portalId=\"" + portalId +"\" client=\"" + getSmartCardId() +"\" account=\"" + userId +"\"/>",
				"callBack" : function(data){
						_this.rtsp = data.rtsp;
						if(_this.isPlay){
							playVideo();
						}else{	
							var div = document.createElement("div");
							div.style.position = "absolute";
							div.style.top = "200px";
							div.style.left = "100px";
							div.style.width = "900px";
							div.style.fontSize = "30px";
							div.innerHTML = "rtsp="+_this.rtsp;
							window.location.href = _this.rtsp;
							document.body.appendChild(div);
						}
				}
			};
			IEPG.getData(url, VOD_getToken);
		}
	};
		
	function getAssetList(){		//��ȡ��Դ�б�
		IEPG.getData(URL.VOD_getAssetList, {
			"data":"<GetFolderContents  includeSelectableItem=\"Y\" maxItems=\"1\" startAt=\"1\"  includeFolderProperties=\"Y\" includeSubFolder=\"Y\" assetId=\"" + _this.columnId + "\" portalId=\"" + portalId +"\" client=\"" + cardId+"\" account=\"" + userId +"\"/>",
			"callBack" : function(data){
				_this.assetList = data.selectableItemList
				if(_this.assetList && _this.assetList.length > 0){
					getRtsp();
				}
			}
		});
	};
		
		
	function playVideo(){			//��Ƶ����
		if(_this.rtsp){
			setTimeout(function() {
				if(_this.ads && $(_this.ads)){				//������Ƶ�Ϸ�ͼƬ��ʧ
					$(_this.ads).style.display = "none";
				}
			},
			_this.delay);
			document.body.bgColor = "transparent";				//����͸��
			_this.rtsp = _this.rtsp.replaceQueryStr(_this.areaCode, "areaCode");
			_this.mp.setMuteFlag(1);
			_this.mp.setSingleMedia(_this.rtsp);
			_this.mp.setVideoDisplayArea(_this.position.left, _this.position.top, _this.position.width, _this.position.height);	//������Ƶλ�ô�С
			_this.mp.setVideoDisplayMode(0);
			_this.mp.refreshVideoDisplay();
			_this.mp.playFromStart();
			_this.mp.setMuteFlag(0);
		}
	};
		
	this.stopVideo = function(){  		//ֹͣ����
		this.mp.stop();
	};
	
	this.play = function(){
            if(typeof Utility != "undefined"){		
                  this.areaCode = Utility.getSystemInfo("ARC");			//�������ȡ
            }
		if(this.columnId){			
			getAssetList();
		}
	};
	this.replay = function(){				//������Ƶѭ��
		this.stopVideo();
		if(this.isLoop && this.rtsp){
			playVideo();
		}
	};
}

document.onkeypress = grabPress;		//���Ŵ�����
function grabPress(d) {
	var f = d.which || d.keyCode;
	switch (f) {
	case 768:
		var b = Utility.getEvent();
		var c = 0;
		var a = jsonParse(b);
		if (!isNaN(a.error_code)) {
			c = parseInt(a.error_code, 10)
		}
		switch (c) {
			case 6:
			case 19:
				break;
			case 8:				//���Ž���
				doWindowVideoOver();
				break;
			case 20:
				break;
		}
		break;
		default:
		break
	}
}
function jsonParse(text) {
	try {
		return ! (/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + text + ")")

	} catch(e) {
		return false
	}
}

/******************************  ҳ����Ƶ����End *************************************/
