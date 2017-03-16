/**
 * @author 905112
 */
var MultiList = function(_config) {
	this.focusId = _config.focusId || "";//焦点div
	this.focusIndex = _config.focusIndex || 0;
	this.focusCssName = _config.cssName || "";
	this.blurCssName = _config.blurName || "";
	this.size = _config.size || 0;
	this.splitNum = parseInt(this.size / 2);
	this.iterator = _config.iterator || this._blank;
	this.onFocus = _config.onFocus || this._blank;
	this.onBlur = _config.onBlur || this._blank;
	this.changeFun = _config.changeFun || this._blank;
};

MultiList.prototype = {
	initData : function(data) {
		this.data = data || "";
		this.length = this.data.length || 0;
		this.showSize = this.length > this.size ? this.size : this.length;
		this.showData();
	},
	showData : function() {
		for( i = 0; i < this.size; i++) {
			this.iterator(i < this.length ? this.data[i] : null, i);
		}
	},
	move : function(offset) {
		if(this.length == 0){
			return;
		}
		this.setBlur();
		this.focusIndex += offset;
		if(this.focusIndex > this.showSize - 1) {
			this.focusIndex = this.showSize - 1;
		} else if(this.focusIndex < 0) {
			this.focusIndex = 0;
		}
		this.setFocus();
	},
	moveSplit : function(offset) {
		if(this.length == 0){
			return;
		}
		if(offset == -1) {
			if(this.focusIndex < this.splitNum) {
				this.changeFun(offset, this.focusIndex);
			} else if(this.focusIndex >= this.splitNum) {
				this.setBlur();
				this.focusIndex = this.focusIndex - this.splitNum;
				this.setFocus();
			}
		} else {
			if(this.focusIndex < this.splitNum) {
				this.setBlur();
				this.focusIndex = this.focusIndex + this.splitNum;
				if(this.focusIndex > this.showSize - 1) {
					this.focusIndex = this.focusIndex - this.splitNum;
				}
				this.setFocus();
			} else if(this.focusIndex >= this.splitNum) {
				this.changeFun(offset, this.focusIndex);
			}
		}
	},
	setBlur : function() {
		if(this.length != 0){
			this.onBlur(this.focusIndex);
			if(this.focusId) {
				$(this.focusId + this.focusIndex).className = this.blurCssName;
			}
		}
	},
	setFocus : function() {
		if(this.length != 0){
			this.onFocus(this.focusIndex);
			if(this.focusId) {
				$(this.focusId + this.focusIndex).className = this.focusCssName;
			}			
		}
	},
	_blank : function() {

	}
};