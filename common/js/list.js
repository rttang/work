/**
 * @fileOverview List控件
 * @author 905576 ，905112
 * @version 1.00
 * 
 */
/**
 * @description 带有显示、上下移动、上下翻页、焦点控制、滑动功能的List控件,支持一次性取数据显示
 * @constructor List
 * @param {Number}
 *            pageSize 一页能够显示的最大行数
 * @param {Function}
 *            iterator 遍历显示每行数据的函数
 * @param {Function}
 *            onFocus 获取焦点函数
 * @param {Function}
 *            onBlur 失去焦点函数
 * @param {String}
 *            focusId 焦点条的ID【滑动需要的参数,普通焦点移动时可为空】
 * @param {Number}
 *            focusTop 焦点条处于第一行时的top值【滑动需要的参数,普通焦点移动时可为空】
 * @param {Number}
 *            focusStep 焦点每移动一行的步长【滑动需要的参数,普通焦点移动时可为空】
 * @param {Number}
 *            isLoop 列表循环翻页标志 true 循环翻页 false 不循环【第一条记录和最后一条记录之间循环】
 * 
 */
IEPG.List = function(_config) {
	this.pageSize = _config.pageSize || 7;
	this.iterator = _config.iterator || this._blank;
	this.onFocus = _config.onFocus || this._blank;
	this.onBlur = _config.onBlur || this._blank;
	this.focusId = _config.focusId || "";
	this.focusTop = _config.focusTop || 0;
	this.focusStep = _config.focusStep || 0;
	this.isLoop=_config.isLoop || false;
	this.moveDir = _config.moveDir || "V";
	this.percent = _config.percent || 0.7;
	this.moveFlag = Boolean(typeof (this.focusId) != 'undefined'
			&& typeof (this.focusTop) != 'undefined'
			&& typeof (this.focusStep) != 'undefined');
};

IEPG.List.prototype = {
	/**
	 * @description 数据绑定函数，一次性获取所有数据，页面做分页处理
	 * @param {Object} data 数组
	 * @param {Object} index 当前焦点所处下标
	 * @return null
	 */
	bindData : function(data, index) {
		this.data = data;
		this.currIndex = index;
		this.focusIndex = this.currIndex % this.pageSize;
		this.length = data.length;
		this.totalPage = Math.ceil(this.length / this.pageSize);
		this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
		this.showList();
		var initTop=this.focusTop + (this.currIndex * this.focusStep);
		$(this.focusId).style.top = initTop + "px";
	},
	/**
	 * @description 显示列表数据
	 * @return null
	 */
	showList : function() {
		this.start = (this.currPage - 1) * this.pageSize;
		this.end = this.currPage * this.pageSize;
		for ( var i = 0, len = this.end - this.start; i < len; i++) {
			var index = this.start + i;
			this.iterator(index < this.length ? this.data[index] : null,index, i);
		}
	},
	/**
	 * @description 向上移动一行焦点
	 * @return null
	 */
	up : function() {
		if (this.length == 0)
			return;
		var oldFocusIndex = this.currIndex % this.pageSize;
		var oldIndex = this.currIndex;
		this.currIndex--;
		this.pageUpdate = false;
		if(this.totalPage > 1&&oldFocusIndex == 0){
			this.pageUpdate = true;
		}	
		if (this.currIndex < 0) {
			if(this.isLoop){
				this.currIndex = this.length - 1;
			}else{
				this.currIndex=0;
				this.pageUpdate = false;
			}
		}
		var newIndex = this.currIndex;
		var newFocusIndex = this.currIndex % this.pageSize;
		this.focusIndex = newFocusIndex;
		if (this.moveFlag) {
			slide(this.focusId, this.focusTop
					+ (oldFocusIndex * this.focusStep), this.focusTop
					+ (newFocusIndex * this.focusStep),this.moveDir,this.percent);
		}
		if (this.pageUpdate) {
			this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
			this.showList();
		}
	},
	/**
	 * @description 向下移动一行焦点
	 * @return null
	 */
	down : function() {
		if (this.length == 0)
			return;
		var oldFocusIndex = this.currIndex % this.pageSize;
		var oldIndex = this.currIndex;
		this.currIndex++;
		this.pageUpdate = false;
		if (this.totalPage > 1
				&& (oldFocusIndex == this.pageSize - 1 || (this.currPage == this.totalPage && oldFocusIndex == this.length
						% this.pageSize - 1))) {
			this.pageUpdate = true;
		}
		if (this.currIndex > this.length - 1) {
			if (this.isLoop) {
				this.currIndex = 0;
			}else{
				this.currIndex = this.length - 1;
			}
		}
		var newIndex = this.currIndex;
		var newFocusIndex = this.currIndex % this.pageSize;
		this.focusIndex = newFocusIndex;
		if (this.moveFlag) {
			slide(this.focusId, this.focusTop
					+ (oldFocusIndex * this.focusStep), this.focusTop
					+ (newFocusIndex * this.focusStep),this.moveDir,this.percent);
		}
		if (this.pageUpdate) {
			this.currPage = Math.ceil((this.currIndex + 1) / this.pageSize);
			this.showList();
		}
	},
	/**
	 * @description 向上翻页
	 * @return null
	 */
	pageUp : function() {
		if (this.totalPage < 2) {
			return;
		}
		if ((!this.isLoop||typeof (this.isLoop) == 'undefined')&&(this.currPage == 1)) {
			return;
		}
		this.currPage--;
		if (this.currPage < 1) {
			this.currPage = this.totalPage;
		}
		this.showList();
		this.setBlur();
		this.currIndex = this.currPage * this.pageSize<this.length?this.currPage * this.pageSize-1:this.length-1;
		this.focusIndex = Math.min(this.pageSize-1,this.length-(this.currPage-1)*this.pageSize-1);
		this.setFocus();
	},
	/**
	 * @description 向下翻页
	 * @return null
	 */
	pageDown : function() {
		if (this.totalPage < 2) {
			return;
		}
		if ((!this.isLoop||typeof (this.isLoop) == 'undefined')&&(this.currPage == this.totalPage)) {
			return;
		}
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
	setFocus : function() {
		this.onFocus(this.focusIndex);
	},
	/**
	 * @description 使某行失去焦点
	 * @return null
	 */
	setBlur : function() {
		this.onBlur(this.focusIndex);
	},
	/**
	 * @description 没数据时，隐藏焦点
	 * @return null
	 */
	hideFocus : function()
	{
		$(this.focusId).style.display = "none";
	},
	/**
	 * @description 有数据时，显示焦点
	 * @return null
	 */
	showFocus : function()
	{
		$(this.focusId).style.display = "block";
	},
		/**
	 * @description 设置页码
	 * @param {string} _pageId 页码id
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
	/**
	 * @description 空函数
	 * @return null
	 */
	_blank : function()
	{
	}
};

