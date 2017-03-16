

IEPG.MenuList = function(_config)
{
	this.pageSize = _config.pageSize || 7;//列表、菜单显示最大数。
	this.iterator = _config.iterator || this._blank;//数据显示函数。
	this.onFocusMove = _config.onFocusMove;//焦点移动函数。
	this.onFocus = _config.onFocus || this._blank;//获取焦点函数。
	this.onBlur = _config.onBlur || this._blank;//失去焦点函数。
	this.onNoData = _config.onNoData;//无数据显示函数。
	this.isLoop = _config.isLoop || false;//是否循环翻页,false不循环。
	this.isFocusLoop = _config.isFocusLoop || false;//是否焦点移动,true不移动。
	this.focusId = _config.focusId || "";
	this.focusTop = _config.focusTop || 0;
	this.focusStep = _config.focusStep || 0;
	this.menuIndex = _config.menuIndex || 0;
	this.menuFocus = _config.menuFocus || 0;
	this.isTurnPage = _config.isTurnPage || "";
	this.type = _config.type || 0;
	this.moveFlag = Boolean( typeof (this.focusId) != 'undefined' && typeof (this.focusTop) != 'undefined' && typeof (this.focusStep) != 'undefined');
};

IEPG.MenuList.prototype = {
	initData : function(data, index){
		//this.type = type;
		this.data = data;
		this.currIndex = index;
		this.focusIndex = this.currIndex % this.pageSize;
		this.length = data.length;
		this.totalPage = Math.ceil(this.length / this.pageSize);
		this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
		if(!this.type || this.type == 0) {
			this.showList();
		} else {
			this.showMenu();	
		} 
		if (this.onNoData && this.length == 0) {
			this.onNoData();
		}
		if(this.dataLength == 0) {
			this._hideFocus();
		}
	},
	showList : function(){
		this.start = (this.currPage - 1) * this.pageSize;
		this.end = this.currPage * this.pageSize;
		for ( var i = 0, len = this.end - this.start; i < len; i++) {
			var index = this.start + i;
			this.iterator(index < this.length ? this.data[index] : null,index, i);
		}
	},
	showMenu : function()
	{
		var offsetPos;
		if(this.isFocusLoop) {
			offsetPos = 0;
		}
		else {
			offsetPos = this.menuIndex - this.menuFocus;
		}
		for(var i = 0; i < this.pageSize; i++) {
			//页面上处理函数this.iterator
			this.iterator(i < this.length ? this.data[i + offsetPos] : null, i+offsetPos, i);
		}
	},
	/**
	 * @description 向上移动一行焦点
	 * @return null
	 */
	listUp: function(){
		if (this.length == 0) return;
		var oldFocusIndex = this.currIndex % this.pageSize;
		var oldIndex = this.currIndex;
		this.currIndex--;
		this.pageUpdate = false;
		if (this.totalPage > 1 && oldFocusIndex == 0) {
			this.pageUpdate = true;
		}
		if (this.currIndex < 0) {
			this.currIndex = this.length - 1;
		}
		var newIndex = this.currIndex;
		var newFocusIndex = this.currIndex % this.pageSize;
		this.focusIndex = newFocusIndex;
		/*if (this.moveFlag) {
			slide(this.focusId, this.focusTop + (oldFocusIndex * this.focusStep), this.focusTop + (newFocusIndex * this.focusStep));
		}*/
		if (this.pageUpdate) {
			this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
			this.showList();
		}
		this.onFocusMove(oldFocusIndex, newFocusIndex, oldIndex, newIndex);
	},
	/**
	 * @description 向下移动一行焦点
	 * @return null
	 */
	listDown: function(){
		if (this.length == 0) return;
		var oldFocusIndex = this.currIndex % this.pageSize;
		var oldIndex = this.currIndex;
		this.currIndex++;
		this.pageUpdate = false;
		if (this.totalPage > 1 && (oldFocusIndex == this.pageSize - 1 || (this.currPage == this.totalPage && oldFocusIndex == this.length % this.pageSize - 1))) {
			this.pageUpdate = true;
		}
		if (this.currIndex > this.length - 1) {
			this.currIndex = 0;
		}
		var newIndex = this.currIndex;
		var newFocusIndex = this.currIndex % this.pageSize;
		this.focusIndex = newFocusIndex;
		/*if (this.moveFlag) {
			slide(this.focusId, this.focusTop + (oldFocusIndex * this.focusStep), this.focusTop + (newFocusIndex * this.focusStep));
		}*/
		if (this.pageUpdate) {
			this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
			this.showList();
		}
		this.onFocusMove(oldFocusIndex, newFocusIndex, oldIndex, newIndex);
	},
	/**
	 * @description 向左或向上移动
	 * @return null
	 */
	menuUp : function()
	{
		this.setBlur();
		this.oldFocusIndex = this.menuFocus;
		//焦点不动，文字循环
		if(this.isFocusLoop) {
			this.menuIndex--;
			if(this.menuIndex < 0) {
				this.menuIndex = this.data.length - 1;
			}
			//移除数组中最后第一个元素并返回该元素
			var dateItem = this.data.pop();
			//向数组的末尾添加一个元素，并返回新的长度	
			this.data.unshift(dateItem);
			this.showMenu();
		}
		else {
			this.menuFocus--;
			this.menuIndex--;
			if(this.menuFocus < 0) {
				this.menuFocus = 0;
				if(this.menuIndex < 0) {
					if(this.isLoop) {
						this.menuIndex = this.data.length - 1;
						this.menuFocus = this.pageSize - 1;
					}
					else {
						this.menuIndex = 0;
						this.menuFocus = 0;
					}
					
				}
				this.showMenu();
			}
		}
		this.setFocus();
		this.onFocusMove(this.menuIndex, this.menuFocus);
	},
	/**
	 * @description 向右或向下移动
	 * @return null
	 */
	menuDown : function()
	{
		this.setBlur();
		this.oldFocusIndex = this.menuFocus;
		//焦点不动，文字循环
		if(this.isFocusLoop) {
			this.menuIndex++;
			if(this.menuIndex > this.data.length - 1) {
				this.menuIndex = 0;
			}
			//移除数组中第一个元素并返回该元素
			var dateItem = this.data.shift();
			//向数组的末尾添加一个元素，并返回新的长度
			this.data.push(dateItem);
			this.showMenu();
		}
		else {
			this.menuFocus++;
			this.menuIndex++;
			if(this.menuFocus > this.pageSize - 1) {
				this.menuFocus = this.pageSize - 1;
				if(this.menuIndex > this.data.length - 1) {
					if(this.isLoop) {
						this.menuIndex = 0;
						this.menuFocus = 0;
					}
					else {
						this.menuIndex = this.data.length - 1;
						this.menuFocus = this.pageSize - 1;
					}
				}
				this.showMenu();
			}
		}
		this.setFocus();
		this.onFocusMove(this.menuIndex, this.menuFocus);
	},
	/**
	 * @description 向上翻页
	 * @return null
	 */
	pageUp: function(){
		if (this.totalPage < 2) return;
		this.currPage--;
		if (this.currPage < 1) {
			this.currPage = this.totalPage;
		}
		this.showList();
		this.setBlur();
		this.focusIndex = 0;
		this.currIndex = (this.currPage - 1) * this.pageSize;
		this.setFocus();
	},
	/**
	 * @description 向下翻页
	 * @return null
	 */
	pageDown: function(){
		if (this.totalPage < 2) return;
		this.currPage++;
		if (this.currPage > this.totalPage) {
			this.currPage = 1;
		}
		this.showList();
		this.setBlur();
		this.focusIndex = 0;
		this.currIndex = (this.currPage - 1) * this.pageSize;
		this.setFocus();
	},
	
	/**
	 * @description 使某行获取焦点
	 * @return null
	 */
	setFocus: function(){
		if(!this.type || this.type == 0) {
			this.onFocus(this.focusIndex);
		} else {
			this.onFocus(this.menuFocus,this.menuIndex);
		}
	},
	/**
	 * @description 使某行推动焦点
	 * @return null
	 */
	setBlur: function(){
		if(!this.type || this.type == 0) {
			this.onBlur(this.focusIndex);
		} else {
			this.onBlur(this.menuFocus,this.menuIndex);
		}
	},
	/**
	 * @description 翻页后更新数据
	 * @return null
	 */
	upDate: function()
	{
		this.upDate(this.currPage);
	},
	/**
	 * @description 显示页数
	 * @return null
	 */
	setPageInfo : function(_pageId)
	{
		if(this.totalPage <= 0) {
			this.currPage = 0;
			this.totalPage = 0;
		}
		$(_pageId).innerHTML = "第" + this.currPage + "/" + this.totalPage + "页";
	},
	resetSlide:function(){
		
	},
	hideFocus:function(){
		
	},
	showFocus:function(){
		
	},
	_blank : function()
	{
	}
}


