//new on 2014-03-19

var x$ = function (selector, context) {
	// Handle x$(""), x$(null), or x$(undefined)
	if (!selector)  return [];

	else{
		// Handle x$(DOMElement)
		if (selector.nodeType)
			return [selector];
		else
			return Array.prototype.slice.call((context || document).querySelectorAll(selector));
	}
};

if (!JSON) {
	var JSON = {
		parse: function (str) {
			return eval("(" + str + ")");
		}
	};
}


//
x$.EMPTY_FN = function () {
};

//
x$.browser = window.navigator.userAgent;
x$.version = '0.21';

//
x$.byId = function (str) {
	return document.getElementById(str);
};
x$.byClass = function (clsName, context) {
	return (context || document).getElementsByClassName(clsName);
};
x$.byTag = function (clsName, context) {
	return (context || document).getElementsByTagName(clsName);
};
//

//
x$.extend = function () {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !(typeof target === 'function')) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[ i ]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && ( Object.prototype.toString.call(copy) === "[object Object]" || (copyIsArray = (copy instanceof Array)) )) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && (src instanceof Array) ? src : [];

					} else {
						clone = src && (Object.prototype.toString.call(src) === "[object Object]") ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = x$.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


//
var log = x$.EMPTY_FN;
x$.activeLog = function (active) {
	if (active) {
		document.write('<div id="divLog"></div>');
		var e = document.getElementById("divLog");
		window.log = function () {
			if (e.scrollHeight > 600) e.innerHTML = '';
			else e.innerHTML += "<p>";
			for (var i = 0 , len = arguments.length; i < len; i++) {
				e.innerHTML += arguments[i] + " ";
			}
		}
	}
	else window.log = x$.EMPTY_FN;
};


x$.hasClass = function (elem, className) {
	var classList = ' ' + elem.className + ' ';
	return classList.indexOf(' ' + className + ' ') > -1;
};

x$.addClass = function (elem, className) {
	var classList = ' ' + elem.className + ' ';
	if (classList.indexOf(' ' + className + ' ') === -1)
		elem.className += (classList ? ' ' : '') + className;
};

x$.removeClass = function (elem, className) {
	var classList = ' ' + elem.className + ' ' , ts = ' ' + className + ' ' , cur = classList.indexOf(ts);
	if (cur > -1) elem.className = classList.substr(1, cur) + classList.substring(cur + className.length + 2, classList.length - 1);
};

x$.toggleClass = function (elem, className) {
	return x$[x$.hasClass(elem, className) ? 'removeClass' : 'addClass'](elem, className);
};


x$.attr = function (elem, attr, value) {
	if (value !== undefined) {
		return elem.setAttribute(attr, value);
	}
	else {
		return elem.getAttribute(attr);
	}
};

x$.formatJSON = (function () {
	var pattern = /\{(\w*[:]*[=]*\w+)\}(?!})/g;
	return function (template, json) {
		return template.replace(pattern, function (match, key, value) {
			return json[key];
		});
	}
})();

//
x$.request = (function () {
	var ret = {},
		a = window.location,
		seg = a.search.replace(/^\?/, '').split('&'),
		len = seg.length,
		i = 0,
		s;
	for (; i < len; i++) {
		if (!seg[i]) continue;
		s = seg[i].split('=');
		ret[s[0]] = s[1];
		/*try{
		 ret[s[0]] = decodeURI(s[1]);
		 }
		 catch (e) {
		 continue;
		 }*/
	}
	return ret;
})();


//
x$.getJSON = (function (jPanel) {

	var xhrPool = [] , ajaxTimeout = 0;

	jPanel.ajaxSetup = function (sets) {
		ajaxTimeout = sets.timeout;
	};

	jPanel.cancelAllAjax = function () {
		for (var i = 0, len = xhrPool.length; i < len; i++) {
			xhrPool[i].abort();
		}
	};

	jPanel.param = function (obj) {
		var arr = [];
		for (var key in obj) {
			arr[ arr.length ] = key + "=" + encodeURIComponent(obj[key]);
		}
		return arr.join("&").replace(/%20/g, "+").replace(/%25/g, "%");
	};


	return function (url, params, callback, errHandler) {

		//var that = this;
		var req , timer;

		for (var i = 0, len = xhrPool.length; i < len; i++) {
			if (xhrPool[i].readyState == 4 || xhrPool[i].readyState == 0) {
				req = xhrPool[i];
				break;
			}
		}

		if (!req) {
			req = new XMLHttpRequest();
			xhrPool.push(req);
		}

		req.handleResp = req.handleErr = null;

		if (typeof params === 'function') {
			req.handleResp = params;
			if (typeof callback === 'function') req.handleErr = callback;
		}
		else {
			req.handleResp = callback;
			if (typeof errHandler === 'function') req.handleErr = errHandler;
			url += (url.indexOf('?') === -1 ? '?' : '&') + jPanel.param(params);
		}

		req.open('GET', url, true);
		//log(url);

		//Set "X-Requested-With" header
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


		function hdl() {
			//log(req.readyState + ' : ' + req.status + ' : [' + req.responseText + ']');
			if (req.readyState == 4 && req.responseText) {
				if (ajaxTimeout && timer) {
					clearTimeout(timer);
					timer = null;
				}

				if (req.status === 0 || req.status == 200) {
					var obj;
					try {
						obj = JSON.parse(req.responseText);
					}
					catch (e) {
						if (req.handleErr) req.handleErr(e.message, req.responseText);
					}
					req.handleResp(obj, x$);
				}
				else {
					if (req.handleErr) req.handleErr('Server error: ' + req.status, req.responseText);
				}
			}
		}

		req.onreadystatechange = hdl;

		req.send();

		if (ajaxTimeout) {
			timer = setTimeout(function () {
				req.abort();
				timer = null;
				if (req.handleErr) req.handleErr('timeout', ajaxTimeout);
			}, ajaxTimeout);
		}

		return req;
	}

})(x$);

x$.off = function(seed){
	var b = false , ss = x$.on.seeds ;
	for(var i = 0 , l = ss.length ; i < l ; i++){
		if(ss[i]==seed){
			ss.splice(i , 1);
			delete x$.on.listeners[seed] ;
			b = true ;
			break ;
		}
	}
	return b;
} ;

x$.on = function (evn , fn , addToHead) {
	var seed ;
	if(addToHead) {
		seed = --x$.on.seedMin ;
		x$.on.seeds.unshift(seed) ;
	}
	else {
		seed = ++x$.on.seedMax ;
		x$.on.seeds.push(seed) ;
	}
	x$.on.listeners[seed] = fn;
	//fn.seed = seed ;
	return seed ;
};

x$.once = function(evt , cb , addToHead){
	var hdl = x$.on(evt , function(evn){
		x$.off(hdl) ;
		hdl = null;
		return cb.call(window, evn) ;
	} , addToHead) ;

	return hdl ;

	//cb.isOnce = true ;
	//return x$.on(evt , cb , addToHead) ;
} ;

x$.on.seeds = [] ;
x$.on.seedMin = 0;
x$.on.seedMax = -1;
x$.on.listeners = {};
x$.on.homepage = '';
//

// document.onkeydown = function(evt){

// 	var ls = x$.on.listeners , ss = x$.on.seeds.slice() ;


// 	for(var i = 0 ,l= ss.length ; i<l; i++){
// 		var fn = ls[ss[i]] ;
// 		var v = fn.call(window, evt);
// 		/*if(fn.isOnce) {
// 			x$.off(fn.seed) ;
// 		}*/
// 		if(v===false) return v;
// 	}


// 	//Home or Esc
// 	if((evt.keyCode == 72 ||evt.keyCode == 27)  && x$.on.homepage){
// 		location.href = x$.on.homepage ;
// 		return false;
// 	}
// 	//Backspace
// 	if(evt.keyCode == 8){
// 		history.back();
// 		return false;
// 	}

// };

/*
 x$.share = {
 data: function (name, value) {
 var top = window.top,
 cache = top['__CACHE'] || {};
 top['__CACHE'] = cache;

 return value === undefined ? cache[name] : (cache[name] = value) ;
 },
 remove: function (name) {
 var cache = window.top['__CACHE'];
 if (cache && cache[name]) delete cache[name];
 }
 };
 */

(function (x$) {
	// the setting cache for bindUrl and bindList use
	var boundCache = {
		m_Count: 0,
		make: function (sets) {
			//alert('boundCache.make.caller');

			var template = sets.template , cache = { name: template } ,
				nullShown = sets['null'] || '';
			pnter = /\w+[:=]+\w+/g ,
				rnderFns = template.match(pnter),
				renderEvalStr = 'row[":index"]=i;';

			if (rnderFns) {
				var _attr , _ndex;
				for (var fs = 0; fs < rnderFns.length; fs++) {
					_attr = rnderFns[fs];
					_ndex = _attr.indexOf(":=");
					renderEvalStr += "row['" + _attr + "']=scope['" + _attr.substr(_ndex + 2) + "'](row['" + _attr.substr(0, _ndex) + "'] , i , row) ;";
				}
			}

			var pattern = /\{(\w*[:]*[=]*\w+)\}(?!})/g ,
			//ods = template.match(pattern) ,
				str = template.replace(pattern, function (match, key, i) {
					return '\'+(row[\'' + key + '\']===null?\'' + nullShown + '\':row[\'' + key + '\'])+\'';
				});

			renderEvalStr += 'var out=\'' + str + '\';return out;';

			//console.warn(renderEvalStr);

			cache["render"] = new Function("row", "i", "scope", renderEvalStr);

			if (sets.itemRender) cache.itemRender = sets.itemRender;
			if (sets.itemFilter) cache.itemFilter = sets.itemFilter;
			if (sets.onBound) cache.onBound = sets.onBound;

			cache['joiner'] = sets.joiner || '';
			cache['null'] = nullShown;

			return cache;
		},
		newId: function () {
			return "_Object__bind_" + this.m_Count++;
		},
		remove: function (id) {
			delete this[id];
		}
	};


	// bindList :
	// 转义用： {{property}}
	// 模板特定内置值  : {:index} 代入当前的nodeIndex，不受filter影响;  {:rowNum} 当前的行序号（此指受filter影响, 运行时产生，未必等于{:index}+1）
	// sets.itemRender : 在每个function可依次传入3个参数： 属性值/当前索引值/当前整个listNode[i]的obj对象，必须返回string
	// sets.itemFilter ：可在每行操作前，先对该 Node 对象做一些预先加工操作, 可接收2个参数 node/index ， 返回node
	//                   也可以用这个对nodeList进行过滤，将满足过滤条件的node，返回false即可，
	//					 后续的node 的{:index}不受过滤影响
	// sets.onBound  : [event]
	// sets.joiner : 各个结果的连接字符，默认空
	// set['null'] : 将值为null的属性作何种显示，默认显示为empty string
	x$.bindList = function (elem, sets) {
		if (!elem.nodeType) {
			elem = x$(elem)[0]
		}
		var cacheId = elem.id || elem.uniqueID || (function () {
			elem.id = boundCache.newId();
			return elem.id;
		})();

		var cache = boundCache[cacheId] || {} ,
			template , list , itemRender , itemFilter , storeArray;

		if (sets instanceof Array) {
			// 当先前已经设定过template的时候，
			// 可以只传入一个JSON list作参数以精简代码，
			// 而且render/filter/mode/event 均依照最近一次设定
			list = sets;
			itemRender = cache.itemRender;
			itemFilter = cache.itemFilter;
			mode = cache.mode;
		}
		else {
			template = sets.template;

			if (template !== undefined && cache["name"] != template) {
				cache = boundCache.make(sets);
				boundCache[cacheId] = cache;
			}

			list = sets.list;
			itemRender = sets.itemRender || cache.itemRender;
			itemFilter = sets.itemFilter || cache.itemFilter;
		}

		var scope = itemRender || window ,
			html = [] , i = 0 , nb = 0 , rowObject ,
			useFilter = (typeof(itemFilter) === 'function');

		for (; rowObject = list[i];) {
			//过滤data
			if (useFilter) rowObject = itemFilter(rowObject, i);

			//如果data没有被itemFilter过滤掉
			if (rowObject) {
				//行号
				rowObject[":rowNum"] = ++nb;
				//renderer
				html[i] = cache["render"](rowObject, i, scope);
			}
			++i;
		}
		elem.innerHTML = html.join(cache["joiner"]);

		if (typeof(cache.onBound) === 'function') {
			cache.onBound.call(elem, list, sets);
		}

		return elem;
	};

	x$.bindLists = function (elems, sets) {
		var cache;

		if (sets.mode === "setCache") cache = sets.cache;
		else  cache = boundCache.make(sets);

		for (var i = 0, l = elems.length; i < l; i++) {
			var o = elems[i];
			var cacheId = o.id || o.uniqueID || (function () {
				o.id = boundCache.newId();
				return o.id;
			})();

			boundCache[cacheId] = cache;
		}

		var len = Math.min(l, sets.lists.length);
		for (var j = 0; j < len; j++) {
			sets.list = sets.lists[j];
			x$.bindList(elems[j], sets);
		}

		if (typeof(sets.onAllComplete) === 'function') {
			sets.onAllComplete(sets);
		}

		if (sets.mode === "getCache") return cache;

		return this;
	};

})(x$);



/**
 * 2014-05-06
**/
(function (window , x$ , undefined) {

	x$.Grid = (function () {
		var Grid = function (sets) {
				return new Grid.fn.init(sets);
			},
			arrowKeyName = {'left':null,'right':null,'up':null,'down':null} ;

		Grid.fn = Grid.prototype = {
			init: function (config) {

				var sets = x$.extend(true, {}, this.defaults, config);
				
				//cache into this' attributes
				this.edgeRule = sets.edgeRule;
				this.keyMap = config.keyMap || this.defaults.keyMap;
				this.offset = sets.offset;
				this.grid = sets.grid;
				this.focus = sets.focus;
				this.blur = sets.blur;
				this.click = sets.click;
				this.beforeChange = sets.beforeChange;
				this.change = sets.change;
				this.hover = sets.hover;
				this.name = sets.name;
				this.noData = sets.noData;
				this.delayTime = sets.delayTime;
				this.hoverClass = sets.hoverClass ? sets.hoverClass : undefined;
				this.prevIndex = -1;
				this.selectedIndex = -1;
				this.boxIndex = -1;
				this.selector = sets.selector;
				this.frame = x$(sets.frame)[0];
				this.elems(x$(this.selector));
				if (config.forceRec instanceof Array) {
					this.matrix = config.forceRec;
					this.forceRec = false;
				}
				else {
					this.matrix = [];
					this.forceRec = config.forceRec || false;
					var rec = this.forceRec;
					if (rec && typeof rec !== 'boolean') {
						if (rec === 'strict' && this.length) {
							var recagle = this.items[0].getBoundingClientRect();
							rec = {
								x: recagle.left + this.offset.x,
								y: recagle.top + this.offset.y,
								w: recagle.width,
								h: recagle.height
							};
						}
						var x , y , g = this.grid;
						for (var i = 0 , t = g.cols * g.rows; i < t; i++) {
							x = (i % g.cols) * rec.w + rec.x;
							y = (i / g.cols | 0) * rec.h + rec.y;
							this.matrix[i] = {x: x, y: y};
						}
						this.forceRec = false;
					}
				}
				if(this.length) this.setIndex(sets.selectedIndex, 'auto');
				return this;
			},
			reset : function (i, d) {
				/*
				if(this.hoverClass) {
					var sm = this.selectedElem() ;
					if(sm) x$.removeClass(sm , this.hoverClass);
				}
				*/

				this.elems(x$(this.selector));
				this.prevIndex = this.selectedIndex = -1 ;
				if (!isNaN(i) && this.length) this.setIndex(i, d || 'auto');

				return this;
			},
			elems : function (list) {
				this.items = list;
				this.length = list.length;
				if (this.length === 0) {
					if (this.frame) this.frame.style.cssText += ";visibility:hidden;";
					if (this.noData) this.noData();
				}
				//todo: maybe not supported
				else if (this.frame && window.getComputedStyle(this.frame, null).visibility == 'hidden') this.frame.style.cssText += ";visibility:visible;";
				return this;
			},
			jumpToBox: function (i, j) {
				if (i === -1) x$.Box.jumpBack();
				else x$.Box.jumpTo(i, j);
				return this;
			},
			addIntoBox: function (asName) {
				if (asName) this.name = asName;
				x$.Box.addGrid(this);
				return this;
			},
			overRange: function (w) {
				if (this.edgeRule[w] === 'stop') return this;
				switch (w) {
					case 'up':
					case 'left':
						if (this.edgeRule[w] === 'loop') {
							var i = this.selectedIndex - 1;
							this.setIndex(i < 0 ? this.length - 1 : i, w);
						} else {
							this.edgeRule[w].call(this, w);
						}
						break;
					case 'down':
					case 'right':
						if (this.edgeRule[w] === 'loop') {
							var i = this.selectedIndex + 1;
							this.setIndex((i > this.length - 1) ? 0 : i, w);
						} else {
							this.edgeRule[w].call(this, w);
						}
						break;
					default:{}
				}
				return this;
			},
			keyHandler: function (evt) {
				if (this.length !== 0) {
					var keyCode = evt.keyCode ? evt.keyCode : evt.which;
					var keyName = this.keyMap[keyCode];
					if (keyName) {
						if (keyName === 'ok') {
							if(this.click) this.click();
						}
						else if(keyName in arrowKeyName){
							//press arrow key
							var c = this.grid.cols,
								r = this.grid.rows;
							if ((keyName === 'left' && this.selectedIndex % c === 0) || (keyName === 'right' && (this.selectedIndex + 1) % c === 0) || (keyName === 'up' && this.selectedIndex < c) || (keyName === 'down' && (this.selectedIndex + c + 1) > Math.min(r * c, this.length))) {
								this.overRange.call(this, keyName);
							}
							else {
								var i = keyName === 'left' ? -1 : keyName === 'right' ? 1 : keyName === 'up' ? -c : c;
								this.setIndex(this.selectedIndex + i, keyName);
							}
						}
					}
				}
				return this;
			},
			setIndex: function (t, direc) {
				if (this.beforeChange) this.beforeChange(direc);
				if (t < 0 || t + 1 > this.length) this.overRange.call(this, direc);
				else {
					clearTimeout(this.timer);
					this.prevIndex = this.selectedIndex;
					this.selectedIndex = t;
					var obj = this.frame, mx;
					if (obj) {
						if (!this.matrix[t] || this.forceRec) {
							//todo: maybe not supported
							var point = this.items[t].getBoundingClientRect();
							mx = {
								x: point.left + this.offset.x,
								y: point.top + this.offset.y
							};
							this.matrix[t] = mx;
						} else {
							mx = this.matrix[t];
						}
						if ((this.grid.rows > 1 && direc) || direc == 'auto') obj.style.cssText += ";top:" + mx.y + "px;";
						if ((this.grid.cols > 1 && direc) || direc == 'auto') obj.style.cssText += ";left:" + mx.x + "px;";
					}
					if (this.hover && direc) this.delay(this, this.hover, this.delayTime, direc);
					if (this.change) this.change(direc);

					//switch hover class
					if (direc != "auto" && this.hoverClass) {
						var sm = this.prevElem();
						if (sm) x$.removeClass(sm, this.hoverClass);

						sm = this.selectedElem();
						x$.addClass(sm, this.hoverClass);
					}
				}
				return this;
			},
			prevElem: function () {
				return this.items[this.prevIndex];
			},
			selectedElem: function () {
				return this.items[this.selectedIndex];
			},
			timer: 0,
			defaults: {
				edgeRule: {
					up: 'stop', down: 'stop', left: 'stop', right: 'stop'
				},
				hover: null,
				focus: function () {
					if (this.frame)  this.frame.style.cssText += ";display:block;";
					if (this.hoverClass) x$.addClass(this.selectedElem(), this.hoverClass);
					return this;
				},
				blur: function () {
					if (this.frame) this.frame.style.cssText += ";display:none;";
					if (this.hoverClass) x$.removeClass(this.selectedElem(), this.hoverClass);
					return this;
				},
				keyMap: {
					"37": "left", "39": "right", "38": "up", "40": "down", "13": "ok"
				},
				offset: { x: 0, y: 0 },
				grid: { cols: 1, rows: 1 },
				selectedIndex: 0,
				delayTime: 1000,
				items: null,
				frame: null
			},
			delay: function (obj, func, time, direc) {
				x$.Grid.delayFunc = function () {
					func.call(obj, direc);
				};
				this.timer = setTimeout(x$.Grid.delayFunc, time);
			}
		};
		Grid.fn.init.prototype = Grid.fn;


		return Grid;
	})();


	//Box Class
	x$.Box = {
		boxes: [],
		current: null,
		currentIndex: -1,
		enable: true,
		eventName: "keydown",
		gridMap: {},
		previous: null,
		previousIndex: -1,
		getGrid: function (i) {
			if (typeof i === 'string') {
				i = this.gridMap[i];
				if (i == undefined) i = -1;
			}
			return this.boxes[i];
		},
		addGrid: function (grid) {
			for (var i = 0, l = arguments.length; i < l; i++) {
				if (arguments[i].name) this.gridMap[arguments[i].name] = this.boxes.length;
				arguments[i].boxIndex = this.boxes.length;
				this.boxes.push(arguments[i]);
			}
			return this;
		},
		removeGrid: function(i){
			if(this.currentIndex === i) {
				this.current = null ;
				this.currentIndex = -1 ;

				if(this.previous){
					this.jumpTo(this.previous) ;
					this.previous = null;
					this.previousIndex = -1 ;
				}
			}
			this.boxes.splice(i,1) ;
			return this;
		} ,
		jumpTo: function (i, j) {
			if (i instanceof x$.Grid) {
				i = i.boxIndex;
			} else if (typeof i === 'string') {
				i = this.gridMap[i];
				if (i == undefined) i = this.currentIndex;
			}
			if (i === -1) i = this.previousIndex;
			var tar = this.boxes[i];
			if (this.current != tar) {
				if (tar.length) {
					if (this.current) {
						this.current.blur();
						this.previous = this.current;
						this.previousIndex = this.currentIndex;
					}
					this.current = tar;
					this.currentIndex = i;
					if (j != undefined) this.current.setIndex(j, 'sync');
					this.current.focus();
				}
			}
			return this;
		},
		jumpBack: function(){
			return this.jumpTo(this.previousIndex);
		},
		keyHolder: function(evt){
			//evt.stopPropagation();
			var xb = x$.Box ;
			if (xb.enable && xb.currentIndex != -1)
				xb.current.keyHandler(evt);
		},
		active: function(evtName){
			if(this.currentIndex === -1 && this.boxes.length) {
				this.jumpTo(0) ;
			}
			this.eventName = evtName || this.eventName;
			x$.on(this.eventName, this.keyHolder);
			return this;
		},
		inactive: function(){
			document.removeEventListener(this.eventName, this.keyHolder);
			return this;
		} ,
		reset : function(blurCurrent , i , j){
			if(blurCurrent && this.current) this.current.blur();
			this.current = this.previous = null ;
			this.currentIndex = this.previousIndex = -1 ;

			if(i !== undefined) this.jumpTo(i , j) ;
		}
	};

	var PageList = function(sets){
		return new PageList.fnc(sets);
	};
	PageList.fnc = function (sets) {
		this.container = x$(sets.container)[0] ;
		this.pageDiv = x$(sets.pageDiv)[0] ;
		this.template = sets.template ;
		this.itemRender = sets.itemRender ;
		this.itemFilter = sets.itemFilter ;
		this.pageSize = sets.pageSize || 5 ;
		this.singlePage = sets.singlePage ;
		this.pagination = sets.pagination ;
		this.noData = sets.noData ;
		this.bound = sets.bound ;
		this.reBind(sets);
		return this;
	};
	PageList.fnc.prototype = {
		selectedItem: function (gridIndex) {
			return this.data[this.pageIndex * this.pageSize + gridIndex];
		},
		reBind: function (sets) {
			this.data = sets.data;
			if (this.data) {
				this.length = sets.data.length;
				var _pageIndex = sets.pageIndex || 0;
				this.pageCount = Math.ceil(this.length / this.pageSize);
				this.pageIndex = Math.min(this.pageCount - 1, _pageIndex);
				if (this.pageCount === 1 && this.singlePage) this.singlePage();

				if (this.length) {
					this.bindPage(this.pageIndex * this.pageSize);
					if (this.bound) this.bound();
				} else {
					this.container[0].innerHTML = '';
					if (this.noData) this.noData();
				}
			}
			return this;
		},
		turnPage: function (i) {
			if (i > 0) {
				this.pageIndex = this.pageIndex + i >= this.pageCount ? 0 : this.pageIndex + i;
			} else {
				this.pageIndex = this.pageIndex - i < 0 ? this.pageCount - 1 : this.pageIndex - i;
			}
			this.bindPage();
		},
		gotoPage: function(i){
			i = parseInt(i,10);
			if(!isNaN(i)){
				if(i>this.pageCount-1) i=this.pageCount-1;
				else if(i<0) i=0;
				this.pageIndex = i ;
				this.bindPage();
			}
		} ,
		nextPage: function () {
			this.pageIndex = this.pageIndex + 1 === this.pageCount ? 0 : this.pageIndex + 1;
			this.bindPage();
		},
		prevPage: function () {
			this.pageIndex = this.pageIndex === 0 ? this.pageCount - 1 : this.pageIndex - 1;
			this.bindPage();
		},
		bindPage: function() {
			var dataIndex = this.pageIndex * this.pageSize;
			x$.bindList(this.container , {
				template: this.template,
				itemRender: this.itemRender,
				itemFilter: this.itemFilter,
				list: this.pageArray(this.data, dataIndex, this.pageSize)
			});
			if (this.pageDiv) {
				this.pageDiv.style.cssText += ';display:block;';
				if (this.pagination) {
					if(typeof this.pagination==='function'){
						this.pageDiv.innerHTML = this.pagination.call(this , (this.pageIndex + 1), this.pageCount , this.length)
					}
					else //string
						this.pageDiv.innerHTML = x$.formatJSON(this.pagination, {
							pageIndex: (this.pageIndex + 1),
							pageCount: this.pageCount ,
							rows : this.length
						});
				} else {
					this.pageDiv.innerText = (this.pageIndex + 1) + '/' + this.pageCount + ' ' + unescape('%u9875');
				}
			}
			//if (this.linkedGrid) this.linkedGrid.reset(0 , 'arrSync');
			return this;
		},
		pageArray: function (arr, startIndex, pageSize) {
			var len = arr.length;
			var count = startIndex + pageSize > len ? len % pageSize : pageSize;
			return arr.slice(startIndex, startIndex + count);
		}
	};

	x$.PageList = PageList;

	x$.Grid.fn.extra = x$.Grid.prototype.extra = x$.Grid.fn.init.prototype.extra = PageList.fnc.prototype.extra = function (extras, unsafe) {
		for (var key in extras) {
			if (this[key] === undefined || unsafe) this[key] = extras[key];
		}
		return this;
	};

})(window , x$);
