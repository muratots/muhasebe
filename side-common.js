/**
 * @hakand
 */

function byid(id){
	return document.getElementById(id);
}

function getid(){
	return getId();
}


function getId(){
	function generateId(){
		return "H"+(((Math.random()+1)*0x10000).toString(16).substring(1) + ((Math.random()+1)*0x10000).toString(16).substring(1) + ((Math.random()+1)*0x10000).toString(16).substring(1)).replace(/\./g,"").substring(0,13);
//		return  "H"+$.uidGen._gen2().replace(/-/g, "").substr(10,13);
	//	return "_"+Math.floor(Math.random()*100000);
	}
	
	return generateId();
}

function def(id){
	return csd.defNodeMap[id];
}

function CSDUtil(){
	
	var maskDiv = byid("maskDiv");
	var busyDiv = byid("busyDiv");
	
	this.init = function() {
	};

	this.escapeAceEditorChars = function(str) {
		if(str === undefined || str === null){
			return str;
		}
		str = str.replace(/\u00A0/g, ' ');
		return str;
	};
	
	this.findPositionX = function (obj){
	    var left = 0;
	    if(obj.offsetParent){
	        while(1){
	          left += obj.offsetLeft;
	          if(!obj.offsetParent)
	            break;
	          obj = obj.offsetParent;
	        }
	    }else if(obj.x){
	        left += obj.x;
	    }
	    return left;
	};

	this.findPositionY = function (obj){
	    var top = 0;
	    if(obj.offsetParent){
	        while(1){
	          top += obj.offsetTop;
	          if(!obj.offsetParent)
	            break;
	          obj = obj.offsetParent;
	        }
	    }else if(obj.y){
	        top += obj.y;
	    }
	    return top;
	};
	
	this.mask = function() {
		maskDiv.style.display ="block";
	};
	
	this.unmask = function() {
		maskDiv.style.display ="none";
	};
	
	this.busy = function() {
		maskDiv.style.display ="block";
		busyDiv.style.display ="block";
	};
	
	this.clearBusy = function() {
		maskDiv.style.display ="none";
		busyDiv.style.display ="none";
	};
	
	this.dontAllowBlank = function(fieldName, element) {
		if( this.removeWhiteSpaces(element.value) == ""){
			this.hataMesaji(fieldName + " alanı boş olamaz!");
			throw "dontAllowBlankExc";
		}
	};
	
	this.mesaj = function(hatami, mesaj, closecallback) {
		var popup = null;
		var title = hatami ? "Hata Mesajı" : "Bilgi Mesajı";
		var textDiv = hatami ? $("#hataMesajiDivText") : $("#bilgiMesajiDivText");
		var divId = hatami ? "hataMesajiDiv" :  "bilgiMesajiDiv" ;
		textDiv.html(mesaj);
		if(window.CSSimplePopup){
			popup = new CSSimplePopup(divId, {dontRemove: true, title: title, buttons: { "Ok": 	function(){popup.close(); if(closecallback){ closecallback(); }} }, width: 400});
			popup.open();
		} else {
			alert(mesaj);
		}
	};
	
	this.bilgiMesaji = function(mesaj, closecallback) {
		this.mesaj(false, mesaj, closecallback);
	};
	
	this.hataMesaji = function(mesaj, closecallback) {
		this.mesaj(true, mesaj, closecallback);
	};
	
	this.confirm = function(mesaj, callback) {
		var popup = null;
		var textDiv = $("#onayMesajiDivText");
		textDiv.html(mesaj);
		popup = new CSSimplePopup("onayMesajiDiv", {dontRemove: true, title: "Confirm", buttons: { "Ok": function(){ popup.close(); callback();}, "Cancel":	function(){ popup.close();} }, width: 400});
		popup.open();
	};
	
	this.removeWhiteSpaces = function(str){
		 return str.split(' ').join('');
	};
	
	this.arrayContains = function (a, obj) {
		var i = a.length;
	    while (i--) {
		   if(typeof obj == "string" || typeof obj == "number"){
			   if (a[i] == obj) {
		           return i;
		       } 	
		   }else if (a[i] === obj) {
	           return i;
	       }
	    }
	    return -1;
	};
	this.clearForm = function(ele) {

	    tags = ele.getElementsByTagName('input');
	    for(var i = 0; i < tags.length; i++) {
	        switch(tags[i].type) {
	            case 'password':
	            case 'text':
	            case 'hidden':
	                tags[i].value = '';
	                break;
	            case 'checkbox':
	            case 'radio':
	                tags[i].checked = false;
	                break;
	        }
	    }
	   
	    tags = ele.getElementsByTagName('select');
	    for(i = 0; i < tags.length; i++) {
	        if(tags[i].type == 'select-one') {
	            tags[i].selectedIndex = 0;
	        }
	        else {
	            for(var j = 0; j < tags[i].options.length; j++) {
	                tags[i].options[j].selected = false;
	            }
	        }
	    }

	    tags = ele.getElementsByTagName('textarea');
	    for(var i=0; i < tags.length; i++) {
	        tags[i].value = '';
	    }
	   
	};
	

	this.getNextsibling = function (n){
		x=n.nextSibling;
		while (x && x.nodeType!=1)
		  {
			x=x.nextSibling;
		  }
		return x;
	};
	
	this.getPrevsibling = function (n){
		x=n.previousSibling;
		while (x && x.nodeType!=1)
		{
			x=x.previousSibling;
		}
		return x;
	};
	
	this.hasClassName = function (id, cls, fromId){
		var dom = fromId ? byid(id) : id;
		if(dom){
			return $$.hasClass(dom, cls);
		}
		return false;
//		if(dom){
//			var clzes = dom.className.split(" ");
//			for(var i=0; i<clzes.length ;i++){
//				if(clzes[i] == cls){
//					return true; 
//				}
//			}
//		}
//		return false; 
	};

	this.addClassName = function (id, cls, fromId){
		var dom = fromId ? byid(id) : id;
		if(dom){
			var clzes = dom.className.split(" ");
			for(var i=0; i<clzes.length ;i++){
				if(clzes[i] == cls){
					return;
				}
			}
			dom.className = dom.className + " "+cls;
		}
	};
	
	this.removeClassName = function (id, cls, fromId){
		var dom = fromId ? byid(id) : id;
		if(dom){
			var newcls = "";
			var clzes = dom && dom.className ? dom.className.split(" ") : [];
			for(var i=0; i<clzes.length ;i++){
				if(clzes[i] != cls){
					newcls += " " + clzes[i];
				}
			}
			dom.className = newcls;
		}
	};

//	this.getDateTimeFromDisplayFormat = function(str) {
//		if(!str){
//			return "";
//		}
//		var date = new Date(str);
//		return date.getFullYear()+''+date.getMonth()+1+''+date.getDate()+''+date.getHours()+''+date.getMinutes();
//	};
	
	this.getDateTimeFromDisplayFormat = function(clientFormattedDateTimeStr) {
		var s = clientFormattedDateTimeStr;
		if(!s || (s && s.length != 16)){
			return "";
		}
		return s.substr(6,4)+""+s.substr(3,2)+""+s.substr(0,2)+""+s.substr(11,2)+""+s.substr(14,2);
	};
	
	this.getDateTimeToDisplayFormat = function(serverFormattedDateTimeStr) {
		var s = serverFormattedDateTimeStr;
		if(!s || (s && s.length != 12)){
			return "";
		}
		return s.substr(6,2)+"/"+s.substr(4,2)+"/"+s.substr(0,4)+" "+s.substr(8,2)+":"+s.substr(10,2);
	};
	

	this.createMask = function(){
		var $mask = document.createElement("div");
		$mask.className = "csdmask";
		
		var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
		var _docWidth = (document.width !== undefined) ? document.width : document.body.offsetWidth;
		$mask.style.height = _docHeight+"px"; 
		$mask.style.width = _docWidth+"px";
		
		return $mask;
	};
	
	this.replaceTurkishChars = function(str) {
		str = str.replace(/\u00c7/g, 'C'); // Ç
		str = str.replace(/\u00e7/g, 'c'); // ç
		str = str.replace(/\u011e/g, 'G'); // Ğ
		str = str.replace(/\u011f/g, 'g'); // ğ
		str = str.replace(/\u0130/g, 'I'); // İ
		str = str.replace(/\u0131/g, 'i'); // ı
		str = str.replace(/\u015e/g, 'S'); // Ş
		str = str.replace(/\u015f/g, 's'); // ş
		str = str.replace(/\u00d6/g, 'O'); // Ö
		str = str.replace(/\u00f6/g, 'o'); // ö
		str = str.replace(/\u00dc/g, 'U'); // Ü
		str = str.replace(/\u00fc/g, 'u'); // ü
		return str;
	};

	function sortObject(o) {
	    var sorted = {},
	    key, a = [];
	    for (key in o) {
	    	if (o.hasOwnProperty(key)) {
	    		a.push(key);
	    	}
	    }
	    a.sort();

	    for (key = 0; key < a.length; key++) {
	    	sorted[a[key]] = o[a[key]];
	    }
	    return sorted;
	}
	
	
	

	
	this.contextMenu = function(options, id, event){
		
		function createContextMenu(items, options){
			
			var ul = document.createElement("ul");
			if(options.sortItems === true){
				items = sortObject(items);
			}
			for(var key in items) {
				var menuItem = items[key];
				
				var li = $$.create("li", { id :"csd-contextmenu-tr"+ (rowCount++), title: menuItem.label}, [ menuItem.disabled ? "csd-contextmenu-disabled": ""], undefined, ul);
				li.tabIndex = -1;
				var liInnerDiv = $$.create("div", {}, ["csd-contextmenu-innerdiv"], undefined, li);
				
				if(menuItem.cssClass){
					$$.addClass(li, menuItem.cssClass);
				}
				if(menuItem.seperator){
					li.style.borderBottom = "1px solid lightgray";	
				}
				
				if(options.noicon !== true){
					var iconDiv = $$.create("div", {}, ["csd-contextmenu-icondiv"], undefined, liInnerDiv);
					if(menuItem.icon ){
						var icon = document.createElement("img");
						icon.setAttribute("src", SideModuleManager.getResourceUrl(options.moduleName, menuItem.icon));
						iconDiv.appendChild(icon);
					}
					if(menuItem.fontIcon ){
						var icon = document.createElement("i");
						icon.className=menuItem.fontIcon;
						iconDiv.appendChild(icon);
					}
				}
				var labelDiv = $$.create("div", {}, ["csd-contextmenu-labeldiv"], undefined, liInnerDiv);
				var label2Div = $$.create("div", {}, ["csd-contextmenu-label2div"], undefined, liInnerDiv);
				if(menuItem.label){
					var a = document.createElement("a");
					a.setAttribute("href", "#");
					a.innerHTML = menuItem.label;
					labelDiv.appendChild(a);
				}
				if(menuItem.label2){
					var a = document.createElement("a");
					a.setAttribute("href", "#");
					a.innerHTML = menuItem.label2;
					label2Div.appendChild(a);
				}
				if(menuItem.action && !menuItem.disabled){
					li.onclick = (function(mi) {
			            return function(event) {
			                removeContextMenu(event);
			                try {
			                	BFEngine.a();
			                	mi.action(event, id);
			                	return false;
			                } finally {
			                	BFEngine.r();
			                }
			            };
			        })(menuItem);
				}
				if(menuItem.desc){
//					tr.onmouseover tr.onmouseleave ???
					li.onfocus = (function(mi) {
			            return function(event) {
			            	//dviDesc pozisyonu focusRow metodunda ayarlanıyor. Eğer mouse geldiğindede açıklama istenirse mouseover ve mouseleave olayları ele alınmalı.
			            	divDesc.style.display = "block";
			            	divDesc.innerHTML = mi.desc;
			            };
			        })(menuItem);
				}
				if(menuItem.subMenu && !menuItem.disabled){
					var subMenuUl = createContextMenu(menuItem.subMenu, options);

					$$.addClass(li, "csd-contextmenu-parent");
					$$.addClass(subMenuUl, "csd-contextmenu");
					if(options.overflowY){
						subMenuUl.style.overflowY = options.overflowY;
					}
					li.appendChild(subMenuUl);
					
					li.onmouseover = (function(subMenuUl) {
						return function(event) {
							var $li = $(this);
							var p = $li.position();
							var o = $li.offset();
							var $subMenuUl = $(subMenuUl);
							var parentUlLeft = 0;
							if(options.dontFitToPage){
								$subMenuUl.css("position", "fixed");
								parentUlLeft = csdu.findPositionX(options.parentMenuUl);
							}
							
							var divOuterHeight = $subMenuUl.outerHeight();
							var clientY = o.top;
							var top = p.top ;
							
							if(windowHeight < divOuterHeight || (windowHeight < (clientY + divOuterHeight) && clientY < divOuterHeight )){//sayfaya sığmıyorsa || (açıldığı yerden aşağı sığmıyorsa && açıldığı yerden yukarı sığmıyorsa)
								top = 0;
								$subMenuUl.height(windowHeight);
								$subMenuUl.css("overflow-y", "scroll");
							}else if(windowHeight < (clientY + divOuterHeight)){//sayfaya sığmıyorsa yukarı doğru aç
								top = top - divOuterHeight + $(li).outerHeight();
							}else if(showAbove){
								top = top - divOuterHeight + $(li).outerHeight();
							}
							
							subMenuUl.style.top = top +'px'
							subMenuUl.style.left = (parentUlLeft + p.left + $li.outerWidth()) + 'px';
						};
					})(subMenuUl);
				}
			}
			
			$$.addClass(ul, "csd-contextmenu");
			if(options.overflowY){
				ul.style.overflowY = options.overflowY;
			}
			options.parentMenuUl = ul;
			return ul;
		}
		
		options = options || {}; 
		var left = options.left, top = options.top, showAbove = options.showAbove, items = options.items, closeCallback = options.closeCallback, selectFirstRow = options.selectFirstRow, width = options.width, keybind = options.keybind;
	
		//TODO
//		keybind = false;
		
		//dizi değilse dizi haline getir.
		if( !(items instanceof Array) ){
			var a = [];
			for(var i in items){
				a.push(items[i]);
			}
			items = a;
		}
		
		if( items.length == 0){
			return;
		}
		
		var themeClass = (window.CSSession ? window.CSSession.get("SIDE-THEME") : "");
		if(window.csd){ themeClass = "";}
		
		var rowCount = 0;
		var div = $$.create("div", {id: "csd-contextmenu-cont"}, ["csd-contextmenu-cont", themeClass, options.clazz], undefined, document.body);
		var divDesc = $$.create("div", {id: "csd-contextmenu-desc"}, ["csd-contextmenu-desc"], undefined, document.body);
	
		if((window.sideRuntimeEnvironment === "designer" || window.sideRuntimeEnvironment === "dev") && options.bf){
			var bf = options.bf;
			var name = bf.$CS$.name;
			div.setAttribute("test-rel", name+"-context-menu");
		}
		
	///--------------------------------------------------------------
		var contextMenuUl = createContextMenu(items, options);
	///--------------------------------------------------------------
		
		div.appendChild(contextMenuUl);
		
		var mask = csdu.createMask();
		document.body.appendChild(mask);

		mask.onclick = removeContextMenu;
		mask.oncontextmenu = function(event) {
			event.preventDefault();
			removeContextMenu(event);
		};
		
		//menu sağda ya da solda açılsın
		var divOuterWidth = $(contextMenuUl).outerWidth();
		var divOuterHeight = $(contextMenuUl).outerHeight();
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var clientX = left;
		var clientY = top;
		if(event){
			clientX = event.clientX;
			clientY = event.clientY;
		}
		if(windowWidth < (clientX + divOuterWidth)){//sayfaya yatay sığmıyorsa sola doğru aç
			left -= divOuterWidth;
		}
		if(width){
			contextMenuUl.style.width = width+"px";
		}
		if(options.position){
			div.style.position= options.position;
		}
		div.style.left = left + "px";
			
		if(windowHeight < divOuterHeight || (windowHeight < (clientY + divOuterHeight) && clientY < divOuterHeight )){//sayfaya sığmıyorsa || (açıldığı yerden aşağı sığmıyorsa && açıldığı yerden yukarı sığmıyorsa)
			top = 0;
			var $contextMenuUl = $(contextMenuUl);
			if(windowHeight < divOuterHeight){
				$contextMenuUl.height(windowHeight-10);
				$contextMenuUl.css("overflow-y", "scroll");
				options.dontFitToPage = true;
			}else{
				$contextMenuUl.height(divOuterHeight);
			}
		}else if(windowHeight < (clientY + divOuterHeight)){//sayfada aşağı sığmıyorsa yukarı doğru aç
			top -= divOuterHeight;
			options.dontFitVertically = true;
		}else if(showAbove){
			top -= divOuterHeight;
		}
		
		div.style.top = top + "px";
		div.style.display = "block";
		divDesc.style.display = "none";

		
		//context menu kapanma olaylarını bağla
		function removeContextMenu(event){
			event = event || window.event;
			if(event){
				event.stopPropagation();
			}
			try {
				$$.remove(div);
				$$.remove(divDesc);
				$$.remove(mask);

				$(document).unbind("keydown.contextmenu");
				
				if(closeCallback){
					closeCallback();
				}
			} catch (e) {
			}
			
		}
		
		
		if(keybind === true){
			
			//key event lerini ayarla, tabloda yukarı aşağı gezebilmesi için
			var row = null;
			
			function focusRow(newRow){
				if(newRow){
					csdu.addClassName(newRow, "csd-context-menu-hover");
					csdu.removeClassName(row, "csd-context-menu-hover");
					//divDesc burada gizleniyor. Eğer desc tanımı varsa tr onfocus'ta ele alınıyor.
					divDesc.style.display = "none";
					
					row = newRow;
					
					var x = window.scrollX, y = window.scrollY;
					newRow.focus();
					window.scrollTo(x, y);
					
					//div desc pozisyon ayarla 
	            	$parent = $(row).parent().parent();
	            	$tr = $(row);
	            	divDesc.style.left = $parent.offset().left + $parent.outerWidth() - 1  + "px";
	            	divDesc.style.top = $tr.offset().top - $tr.scrollTop() -1 + "px";
				}
			}
			
			$(document).bind("keydown.contextmenu", function(event) {
				event.preventDefault();
				event.stopPropagation();
	
				if(event.keyCode == 38){//up
					var newRow = row ? csdu.getPrevsibling(row) : byid("csd-contextmenu-tr"+(rowCount-1)); 
					focusRow(newRow);
				}else if(event.keyCode == 40){//down
					var newRow = row ? csdu.getNextsibling(row) : byid("csd-contextmenu-tr0"); 
					focusRow(newRow);
				}else if(event.keyCode == 13){//enter
					if(row){
						row.onclick();
					}else{
						removeContextMenu();
					}
				}else if(event.keyCode == 27){//esc
					event.stopImmediatePropagation();
					removeContextMenu();
				}else if(event.keyCode != 32){// boşluk değilse(ctrl space için bu kontrol konuldu. istenirse kaldırılabilir eğer kaldırılırsa js autocomplete değiştirilmeli)
					removeContextMenu();
				}
			});
			
			var x = window.scrollX, y = window.scrollY;
			div.tabIndex = -1;// to focus...
			div.focus();// context menuye odaklan
			window.scrollTo(x, y);
			
			if(selectFirstRow === true){
				focusRow(byid("csd-contextmenu-tr0"));//context menude ilk satıra odaklan
			}
		}
	};
	
	this.getStackTrace = function() {
		  var obj = {};
		  Error.captureStackTrace(obj, this.getStackTrace);
		  return obj.stack;
	};

	
	this.getISODateTime = function(d){
	    // padding function
	    var s = function(p){
	        return (''+p).length<2?'0'+p:''+p;
	    };
	    
	    // default parameter
	    if (typeof d === 'undefined'){
	        var d = new Date();
	    };
	    
	    // return ISO datetime
	    return s(d.getDate()) + '/' +
	    	s(d.getMonth()+1) + '/' +
	    	d.getFullYear() + ' ' +
	        s(d.getHours()) + ':' +
	        s(d.getMinutes()) + ':' +
	        s(d.getSeconds());
	};

	    

	
	this.init();
}

var csdu = new CSDUtil();









function CSDOMUtils() {

	var cache = {};
	var isIE = navigator.appName == 'Microsoft Internet Explorer' || navigator.userAgent.match(/Trident/);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isFF = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? true : false;

	this.isie = function () {
		return isIE;
	};

	this.isie9 = function () {
		if(isIE && (document.documentMode === 9 )) {
			return true;
		}
		return false;
	};

	this.isie10 = function () {
		if(isIE && (document.documentMode === 10 )) {
			return true;
		}
		return false;
	};

	this.ischrome = function () {
		return isChrome;
	};

	this.chromeVersion = function(){
	  return parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1]);
  };

	this.isff = function () {
		return isFF;
	};

	this.byid = function (id) {
		return document.getElementById(id);
	};

	this.get = function ($$dom) {
		if(typeof $$dom == "string") {
			$$dom = $$.byid($$dom);
		}
		return $$dom;
	};

	function sureArray(arr) {
		if(!arr) {
			return []
		}
		if(Array.isArray(arr)) {
			return arr;
		}
		return [arr];
	}

	this.byTagname = function (tagName) {
		return document.getElementsByTagName(tagName);
	};

	this.body = function () {
		if(!cache.body) {
			cache.body = this.byTagname("body")[0];
		}
		return cache.body;
	};
	this.head = function () {
		if(!cache.head) {
			cache.head = this.byTagname("head")[0];
		}
		return cache.head;
	};

	this.append = function ($$into, $$doms) {
		$$into = $$.get($$into);
		$$doms = sureArray($$doms);
		for(var i = 0; i < $$doms.length; i++) {
			if($$doms){
				$$into.appendChild($$doms[i]);
			}
		}
		return $$into;
	};

	this.create = function (tag, attrs, classes, css, $$parent) {
		var dom = document.createElement(tag);
		if(attrs) {
			for(var attrName in attrs) {
				if(attrs[attrName] || attrs[attrName] === "" || attrs[attrName] === 0) {
					dom.setAttribute(attrName, attrs[attrName]);
				}
			}
		}
		if(classes) {
			if(!Array.isArray(classes)) {
				classes = [classes];
			}
			for(var i = 0; i < classes.length; i++) {
				this.addClass(dom, classes[i]);
			}
		}
		if(css) {
			this.css(dom, css);
		}
		if($$parent) {
			$$parent.appendChild(dom);
		}
		return dom;
	};

	this.createWithHtml = function (tag, html, $$parent) {
		var $$dom = this.create(tag);
		$$dom.innerHTML = html;
		if($$parent) {
			$$parent.appendChild($$dom);
		}
		return $$dom;
	};

	/**
	 * Craetes html style element
	 */
	this.createStyle = function (content, attrs, insertBefore) {
		if (!content) {
			return;
		}

		var headTag = $$.head();
		var $$style = $$.create('STYLE', attrs);
		$$style.appendChild(document.createTextNode(content));

		if (insertBefore) {
			headTag.insertBefore($$style, $$.byid(insertBefore));
		} else {
			headTag.appendChild($$style);
		}
	};

	this.insertFirst = function ($$dom, $$parent) {
		if(typeof $$dom == "string") {
			$$dom = $$.byid($$dom);
		}
		if(typeof $$parent == "string") {
			$$parent = $$.byid($$parent);
		}
		if(!$$parent || !$$dom) {
			return;
		}
		var $$first = $$parent.childNodes[0];
		if($$first) {
			$$parent.insertBefore($$dom, $$first);
		} else {
			$$parent.appendChild($$dom);
		}
	};

	/**
	 * Dom'a verilen (key, value) ikilis için attribute verir.
	 * Eğer value undefined ise verilen key için dom'daki attribute'unu döner
	 * Eğer key js objesi ise obje içerisindeki key value'ları attribute verir.
	 * @param $$dom
	 * @param key - attribute key
	 * @param value - attribute alue
	 */
	this.attr = function ($$dom, key, value) {
		if(typeof $$dom === "string") {
			$$dom = $$.byid($$dom);
		}
		if(!$$dom || !key){
			return;
		}
		if(typeof key == "string" && value === undefined){
			return $$dom.getAttribute(key);
		}
		if(typeof key === "object") {
			for(var attr in key) {
				$$dom.setAttribute(attr, key[attr]);
			}
		} else {
			$$dom.setAttribute(key, value);
		}
	};

	this.isDomElement = function (element) {
		try {
			//Using W3 DOM2 (works for FF, Opera and Chrom)
			return element instanceof HTMLElement;
		}
		catch (e) {
			//Browsers not supporting W3 DOM2 don't have HTMLElement and
			//an exception is thrown and we end up here. Testing some
			//properties that all elements have. (works on IE7)
			return (typeof element === "object") &&
				(element.nodeType === 1) && (typeof element.style === "object") &&
				(typeof element.ownerDocument === "object");
		}
	};

	var pxStyleAttrs = ["width","height","top","left","right","bottom","minWidth","minHeight","min-width","min-height"];
	this.css = function (dom, style, value) {
		if(typeof dom == "string"){
			dom = this.byid(dom);
		}
		if(!dom || !style) {
			return;
		}
		if(typeof style == "string") {
			if(pxStyleAttrs.indexOf(style) >= 0){
				if(value == "auto") {
					dom.style[style] = value;
				} else if(typeof value == "number" || (typeof value == "string" && parseInt(value) == value)) {
					dom.style[style] = value + "px";
				} else {
					dom.style[style] = value;
				}
			} else {
				dom.style[style] = value;
			}
		} else {
			for(var propName in style) {
				if(pxStyleAttrs.indexOf(propName) >= 0){
					if(style[propName] == "auto") {
						dom.style[propName] = style[propName];
						continue;
					}
					if(typeof style[propName] == "number" || (typeof style[propName] == "string" && parseInt(style[propName]) == style[propName])) {
						dom.style[propName] = style[propName] + "px";
						continue;
					}
				}
				dom.style[propName] = style[propName];
			}
		}
	};

	this.html = function ($$dom, html) {
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom) {
			return;
		}
		$$dom.innerHTML = html;
	};

	this.show = function ($$doms, displayValue) {
		if(!$$doms) {
			return;
		}
		if(!Array.isArray($$doms)) {
			$$doms = [$$doms];
		}
		for(var i = 0; i < $$doms.length; i++) {
			if(typeof $$doms[i] == "string") {
				$$doms[i] = this.byid($$doms[i]);
			}
			if(!$$doms[i]) {
				continue;
			}
			$$doms[i].style.display = displayValue || "block";
		}
	};

	this.hide = function ($$doms) {
		if(typeof $$doms == "string") {
			$$doms = this.byid($$doms);
		}
		if(!$$doms) {
			return;
		}
		if(!Array.isArray($$doms)) {
			$$doms = [$$doms];
		}
		for(var i = 0; i < $$doms.length; i++) {
			if(typeof $$doms[i] == "string") {
				$$doms[i] = this.byid($$doms[i]);
			}
			if(!$$doms[i]) {
				continue;
			}
			$$doms[i].style.display = "none";
		}
	};

	this.isDisplayNone = function ($$dom) {
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom) {
			return true;
		}
		var style = window.getComputedStyle($$dom);
		return style.getPropertyValue("display") == "none";
	};

	this.getComputedBorders = function ($$dom, ishor) {
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom) {
			return true;
		}
		var style = window.getComputedStyle($$dom);
		if(!ishor) {
			var left = style.getPropertyValue("border-left-width");
			if(typeof left == "string" && left.indexOf(".") > 0) {//zoom durumu
				left = Math.ceil(left.replace("px", ""));
			} else {
				left = parseInt(left);
			}
			var right = style.getPropertyValue("border-right-width");
			if(typeof right == "string" && right.indexOf(".") > 0) {//zoom durumu
				right = Math.ceil(right.replace("px", ""));
			} else {
				right = parseInt(right);
			}
			return left + right;
		} else {
			return parseInt(style.getPropertyValue("border-top-width")) + parseInt(style.getPropertyValue("border-bottom-width"));
		}
	};

	this.isVisible = function ($$dom) {
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom) {
			return false;
		}
		if($$dom.offsetWidth > 0 && $$dom.offsetHeight > 0) {
			return true;
		}
		return false;
	};

	this.outerWidth = function (dom, includeMargins) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(!includeMargins) {
			return dom.offsetWidth;
		}
		var style = window.getComputedStyle(dom);
		var marginLeft = parseInt(style.getPropertyValue("margin-left"));
		var marginRight = parseInt(style.getPropertyValue("margin-right"));
		return dom.offsetWidth + marginLeft + marginRight;
	};

	this.outerHeight = function (dom, includeMargins) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(!includeMargins) {
			return dom.offsetHeight;
		}

		var style = window.getComputedStyle(dom);
		var marginTop = parseInt(style.getPropertyValue("margin-top"));
		var marginBottom = parseInt(style.getPropertyValue("margin-bottom"));

		return dom.offsetHeight + marginTop + marginBottom;
	};

	this.innerHeight = function (dom) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(dom == window || dom == this.body()) {
			return window.innerHeight;
		}
		var compStyle = window.getComputedStyle(dom);
		var borderTop = parseInt(compStyle["borderTopWidth"]);
		if(isNaN(borderTop)) {
			borderTop = 0;
		}
		var borderBottom = parseInt(compStyle["borderBottomWidth"]);
		if(isNaN(borderBottom)) {
			borderBottom = 0;
		}
		var paddingTop = parseInt(compStyle["paddingTop"]);
		if(isNaN(paddingTop)) {
			paddingTop = 0;
		}
		var paddingBottom = parseInt(compStyle["paddingBottom"]);
		if(isNaN(paddingBottom)) {
			paddingBottom = 0;
		}
		var height = dom.offsetHeight - borderTop - borderBottom - paddingTop - paddingBottom;
		if(height < 0) {
			return 0;
		}
		return height;
	};

	this.innerWidth = function (dom) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(dom == window) {
			return document.body.offsetWidth;
		}
		var compStyle = window.getComputedStyle(dom);
		var borderLeft = parseInt(compStyle["border-left-width"]);
		if(isNaN(borderLeft)) {
			borderLeft = 0;
		}
		var borderRight = parseInt(compStyle["border-right-width"]);
		if(isNaN(borderRight)) {
			borderRight = 0;
		}
		var paddingLeft = parseInt(compStyle["padding-left"]);
		if(isNaN(paddingLeft)) {
			paddingLeft = 0;
		}
		var paddingRight = parseInt(compStyle["padding-right"]);
		if(isNaN(paddingRight)) {
			paddingRight = 0;
		}
		var width = dom.offsetWidth;
		if(dom instanceof SVGSVGElement) {
			width = dom.width.baseVal.value;
		}
		width = width - borderLeft - borderRight - paddingLeft - paddingRight;
		if(width < 0) {
			return 0;
		}
		return width;
	};

	this.height = function (dom) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(dom == window) {
			return document.body.offsetHeight;
		}
		var paddingTop = parseInt(dom.style.paddingTop) || 0;//avoid NaN
		var paddingBottom = parseInt(dom.style.paddingBottom) || 0;
		var borderTop = parseInt(dom.style.borderTopWidth) || 0;
		var borderBottom = parseInt(dom.style.borderBottomWidth) || 0;
		return dom.offsetHeight - (paddingTop + paddingBottom + borderTop + borderBottom);
	};

	this.width = function (dom) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return 0;
		}
		if(dom == window) {
			return document.body.offsetWidth;
		}
		var paddingLeft = parseInt(dom.style.paddingLeft) || 0;//avoid NaN
		var paddingRight = parseInt(dom.style.paddingRight) || 0;
		var borderLeft = parseInt(dom.style.borderLeftWidth) || 0;
		var borderRight = parseInt(dom.style.borderRightWidth) || 0;
		var width = dom.offsetWidth;
		if(dom instanceof SVGSVGElement) {
			width = dom.width.baseVal.value;
		}
		return width - (paddingLeft + paddingRight + borderLeft + borderRight);
	};

	this.getChildsHasClass = function (dom, className) {
		var result = [];
		if(!dom) {
			return result;
		}
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		for(var i = 0; i < dom.children.length; i++) {
			var classes = dom.children[i].className;
			if(classes && classes.indexOf(className) >= 0) {
				result.push(dom.children[i]);
			}
		}
		return result;
	};

	this.hasClass = function (dom, className) {
		if(typeof dom == "string"){
			dom = this.byid(dom);
		}
		if(!dom){
			return false;
		}
		if(!dom.className) {
			return false;
		}
		var classes = dom.className.match(/\S+/g);
		;
		if(classes && classes.indexOf(className) >= 0) {
			return true;
		}
		return false;
	};

	this.getChildHasClass = function (dom, className) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return;
		}
		for(var i = 0; i < dom.children.length; i++) {
			if(this.hasClass(dom.children[i], className)) {
				return dom.children[i];
			}
		}
	};

	this.findScrolledParent = function (dom) {
		try {
			var scrolledParent = null;
			while(dom) {
				if(dom.scrollTop) {
					scrolledParent = dom;
					break;
				}
				dom = dom.parentNode;
			}
			return scrolledParent;
		} catch (e) {
			console.log(e);
			return null;
		}
	};

	this.parent = function ($$dom, tagName) {
		if(typeof $$dom == "string"){
			$$dom = $$.byid($$dom);
		}
		if(!$$dom || !tagName){
			return;
		}
		tagName = tagName.toUpperCase();
		while($$dom.parentNode) {
			if($$dom.parentNode.tagName == tagName) {
				return $$dom.parentNode;
			}""
			$$dom = $$dom.parentNode;
		}
	};

	this.hasParent = function ($$dom, $$parent) {
		if(!$$dom || !$$parent) {
			return false;
		}
		while($$dom.parentNode) {
			if($$dom.parentNode == $$parent) {
				return true;
			}
			$$dom = $$dom.parentNode;
		}
		return false;
	};

	this.getChildsHasAttr = function (dom, attr, attrValue) {
		var result = [];
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return result;
		}
		for(var i = 0; i < dom.children.length; i++) {
			if(dom.children[i].getAttribute(attr) == attrValue) {
				result.push(dom.children[i]);
			}
		}
		return result;
	};

	this.getChildHasAttr = function (dom, attr, attrValue) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return;
		}
		for(var i = 0; i < dom.children.length; i++) {
			if(dom.children[i].getAttribute(attr) == attrValue) {
				return dom.children[i];
			}
		}
	};

	this.getChildsHasTag = function (dom, tagName) {
		var result = [];
		if(!dom) {
			return result;
		}
		tagName = tagName.toUpperCase();
		for(var i = 0; i < dom.children.length; i++) {
			if(dom.children[i].tagName.toUpperCase() == tagName) {
				result.push(dom.children[i]);
			}
		}
		return result;
	};

	/**
	 * tagname string yada dizi olabilir. Dizi olursa içi içe gider
	 */
	this.child = function (dom, tagName) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return;
		}

		function getFirstChild(tagName) {
			tagName = tagName.toUpperCase();
			for(var i = 0; i < dom.children.length; i++) {
				if(dom.children[i].tagName.toUpperCase() == tagName){
					return dom.children[i];
				}
			}
		}

		if(Array.isArray(tagName)) {
			if(tagName.length == 1) {
				return getFirstChild(tagName[0]);
			} else {
				dom = getFirstChild(tagName[0]);
				tagName.splice(0, 1);
				return this.child(dom, tagName);
			}
		}
		return getFirstChild(tagName);
	};

	this.childs = function (dom, tagName) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		var results = [];
		if(!dom) {
			return results;
		}
		if(tagName) {
			tagName = tagName.toUpperCase();
		}
		for(var i = 0; i < dom.children.length; i++) {
			if(!tagName || dom.children[i].tagName.toUpperCase() == tagName) {
				results.push(dom.children[i]);
			}
		}
		return results;
	};
	/**
	 * Atasında kaçıncı çocuk olduğunu döner
	 */
	this.index = function($$dom){
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom){
			return -1;
		}
		var $$parent = $$dom.parentNode;
		for(var i=0; i<$$parent.children.length; i++) {
			if($$parent.children[i] == $$dom){
				return i;
			}
		}
		return -1;
	};

	this.query = function (dom, queries) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return;
		}
		if(!Array.isArray(queries)) {
			queries = [queries];
		}
		for(var i = 0; i < queries.length; i++) {
			var childs = this.childs(dom, queries[i].tagName);
			var j = 0;
			while(childs.length > 0 && queries[i].clazz) {
				if(!this.hasClass(childs[j], queries[i].clazz)) {
					childs.splice(j, 1);
				} else {
					j++;
				}
				if(j == childs.length) {
					break;
				}
			}
			j = 0;
			while(childs.length > 0 && queries[i].attr) {
				var match = true;
				for(var attrName in queries[i].attr) {
					if(childs[j].getAttribute(attrName) != queries[i].attr[attrName]) {
						childs.splice(j, 1);
						match = false;
						break;
					}
				}
				if(match) {
					j++;
				}
				if(j == childs.length) {
					break;
				}
			}
			if(childs.length == 0) {
				return;
			}
			dom = childs[0];
		}
		return dom;
	};

	this.next = function (dom) {
		do {
			dom = dom.nextSibling;
		} while(dom && dom.nodeType !== 1);
		return dom;
	};

	this.prev = function (dom) {
		do {
			dom = dom.previousSibling;
		} while(dom && dom.nodeType !== 1);
		return dom;
	};

	this.offset = function ($$dom) {
		var offset = {
			left: 0,
			top: 0
		};
		if(typeof $$dom == "string") {
			$$dom = $$.byid($$dom);
		}
		if(!$$dom) {
			return offset;
		}
		// relative to the target field's document
		var rect = $$dom.getBoundingClientRect();
		offset.left = rect.left + this.getScrollLeft();
		offset.top = rect.top + this.getScrollTop();
		return offset;
	};

	this.remove = function ($$doms) {
		try {
			window.csRemoving = true;
			if(!$$doms) {
				return;
			}
			if(!Array.isArray($$doms) && !($$doms instanceof HTMLCollection)) {
				$$doms = [$$doms];
			}
			for(var i = 0; i < $$doms.length; i++) {
				var $$dom = $$doms[i];
				if(typeof $$dom == "string") {
					$$dom = this.byid($$dom);
				}
				if(!$$dom || !$$dom.parentNode) {
					continue;
				}
				$$dom.parentNode.removeChild($$dom);
			}
		} finally {
			window.csRemoving = false;
		}
	};

	this.clear = function ($$domss) {
		if(!Array.isArray($$doms)) {
			$$doms = [$$doms];
		}
		for(var i = 0; i < $$doms.length; i++) {
			var $$dom = $$doms[i];
			if(typeof $$dom == "string") {
				$$dom = this.byid($$dom);
			}
			if($$dom) {
				if($$dom.tagName == "INPUT" || $$dom.tagName == "SELECT") {
					$$dom.value = "";
				} else {
					$$dom.innerHTML = "";
				}
			}
		}
	};

	this.empty = function ($$doms, innerTag) {
		if(!Array.isArray($$doms)) {
			$$doms = [$$doms];
		}
		for(var i = 0; i < $$doms.length; i++) {
			var $$dom = $$doms[i];
			if(typeof $$dom == "string") {
				$$dom = this.byid($$dom);
			}
			if(innerTag) {
				$$dom = this.child($$dom, innerTag);
			}
			if($$dom) {
				$$dom.innerHTML = "";
			}
		}
	};

	this.setClass = function (dom, classNames) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom) {
			return;
		}
		if(!classNames) {
			classNames = "";
		}

		var cls;
		if(!Array.isArray(classNames)) {
			cls = classNames;
		} else {
			cls = "";
			for(var i = 0; i < classNames.length; i++) {
				cls += " " + classNames[i];
			}
		}
		dom.className = cls;
	};

	this.addClass = function (dom, classNames) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!classNames || !dom) {
			return;
		}
		if(typeof classNames == "string") {
			classNames = classNames.trim();
			if(classNames.indexOf(" ") > 0) {
				classNames = classNames.split(" ");
			}
		}
		if(!Array.isArray(classNames)) {
			classNames = [classNames];
		}
		for(var i = 0; i < classNames.length; i++) {
			if(classNames[i]) {
				if(Array.isArray(dom) || dom instanceof HTMLCollection) {
					dom = dom[0];
				}
				if(dom.classList){
					dom.classList.add(classNames[i]);
				}
			}
		}
	};

	this.rmClass = function (dom, classNames) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom || !classNames) {
			return;
		}
		if(typeof classNames == "string") {
			classNames = classNames.trim();
			if(classNames.indexOf(" ") > 0) {
				classNames = classNames.split(" ");
			}
		}
		if(!Array.isArray(classNames)) {
			classNames = [classNames];
		}
		for(var i = 0; i < classNames.length; i++) {
			if(dom.classList){
				dom.classList.remove(classNames[i]);
			}
		}
	};

	this.rmAttr = function (dom, attr) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom || !attr) {
			return;
		}
		dom.removeAttribute(attr);
	};

	this.toggleClass = function (dom, adds, removes) {
		this.rmClass(dom, removes);
		this.addClass(dom, adds);
	};

	this.bindEvent = function (dom, eventName, eventHandler, useCapture) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom || !eventName || !eventHandler) {
			return;
		}
		if(eventName == "overflow") {
			if(isChrome) {
				eventName = "overflowchanged";
			}
		}
		if(dom.addEventListener) {
			dom.addEventListener(eventName, eventHandler, useCapture || false);
		} else if(dom.attachEvent) {
			dom.attachEvent('on' + eventName, eventHandler);
		}
	};

	this.unbindEvent = function (dom, eventName, eventHandler, useCapture) {
		if(typeof dom == "string") {
			dom = this.byid(dom);
		}
		if(!dom || !eventName || !eventHandler) {
			return;
		}
		if(eventName == "overflow") {
			if(isChrome) {
				eventName = "overflowchanged";
			}
		}
		if(dom.removeEventListener) {
			dom.removeEventListener(eventName, eventHandler, useCapture || false);
		} else if(dom.detachEvent) {
			dom.detachEvent('on' + eventName, eventHandler);
		}
	};

	//type -> KeyboardEvent, MouseEvent
	this.fireEvent = function ($$dom, eventName, type) {
		if(typeof $$dom == "string") {
			$$dom = this.byid($$dom);
		}
		if(!$$dom || !eventName) {
			return;
		}
		if(document.createEvent) {
			type = type || "MouseEvents";
			var evt = document.createEvent(type);
			evt.initEvent(eventName, true, false);
			$$dom.dispatchEvent(evt);
		} else if(document.createEventObject) {
			$$dom.fireEvent('on' + eventName);
		} else if(typeof node.onclick == 'function') {
			$$dom.onclick();
		}
	};

	this.getScrollTop = function () {
		if(window.pageYOffset !== undefined) {
			return window.pageYOffset;
		} else if(document.documentElement && document.documentElement.scrollTop !== undefined) {
			return document.documentElement.scrollTop;
		}
		return document.body.scrollTop;
	};

	this.getScrollLeft = function () {
		if(window.pageXOffset !== undefined) {
			return window.pageXOffset;
		} else if(document.documentElement && document.documentElement.scrollLeft !== undefined) {
			return document.documentElement.scrollLeft;
		}
		return document.body.scrollLeft;
	};

	this.getScrollBarWidth = function (inn, isVer) {
		if($$.isie9()) {
			return 17;//IE9'da aşağıdaki kod çalışmıyor
		}
		isVer = isVer === false ? true : false;
		if(!this.scwidth || inn) {
			//from: http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
			var inner = document.createElement('p');
			inner.style.width = isVer ? "100%" : "200px";
			inner.style.height = isVer ? "200px" : "100%";

			var outer = document.createElement('div');
			outer.style.position = "absolute";
			outer.style.top = "0px";
			outer.style.left = "0px";
			outer.style.visibility = "hidden";
			outer.style.width = isVer ? "200px" : "150px";
			outer.style.height = isVer ? "150px" : "200px";
			outer.style.overflow = "hidden";
			outer.appendChild(inner);
			if(!inn) {
				document.body.appendChild(outer);
			} else {
				inn.appendChild(outer);
			}
			var w1 = isVer ? inner.offsetWidth : inner.offsetHeight;
			outer.style.overflow = 'scroll';
			var w2 = isVer ? inner.offsetWidth : inner.offsetHeight;
			if(w1 == w2) w2 = isVer ? outer.clientWidth : outer.clientHeight;
			if(w1 == w2) {
				return 0;
			}
			if(!inn) {
				document.body.removeChild(outer);
				this.scwidth = (w1 - w2) + 1;
			} else {
				inn.removeChild(outer);
				return (w1 - w2) + 1;
			}
		}
		return this.scwidth;
	};

	this.toolTip = function (item) {
		var toolTipWrapperCheck = false;

		function createToolTipDOM(msg) {
			msg = msg || "no tool tip";
			if(!toolTipWrapperCheck) {
				var toolTipWrapper = document.createElement("DIV"),
					toolTipTextContainer = document.createElement("SPAN");
				toolTipTextContainer.innerHTML = msg;
				toolTipWrapper.setAttribute("id", "csc-tooltip");
				toolTipWrapper.classList.add("csc-tooltip");
				toolTipWrapper.appendChild(toolTipTextContainer);
				document.body.appendChild(toolTipWrapper);
			}
			toolTipWrapperCheck = true;
		}

		function showToolTip(elem) {
			var msg = elem.dataset.tooltip;
			createToolTipDOM(msg);

		}

		function moveToolTip(e) {
			var toolTipWrapper = document.getElementById("csc-tooltip"),
				windowWidth = window.innerWidth,
				toolTipWidth = toolTipWrapper.offsetWidth,
				toolTipLeftPosition = parseInt(toolTipWrapper.style.left),
				windowHeight = window.innerHeight,
				toolTipHeight = toolTipWrapper.offsetHeight,
				toolTipTopPositon = parseInt(toolTipWrapper.style.top);

			if(windowWidth - (toolTipLeftPosition + toolTipWidth) < toolTipWidth) {
				toolTipWrapper.style.left = (e.clientX - toolTipWidth) + "px";
			} else {
				toolTipWrapper.style.left = e.clientX + 10 + "px";
			}

			if(windowHeight - (toolTipTopPositon + toolTipHeight) < toolTipHeight) {
				toolTipWrapper.style.top = (e.clientY - toolTipHeight) + "px";
			} else {
				toolTipWrapper.style.top = e.clientY + 10 + "px";
			}
		}

		function removeToolTip() {
			var toolTipWrapper = document.getElementById("csc-tooltip");
			document.body.removeChild(toolTipWrapper);
			toolTipWrapperCheck = false;
		}

		function addEvents(item) {
			if(typeof item === "string") {
				item = $$.byid(item);
			}
			if(item) {
				item.addEventListener("mouseover", function () {
					showToolTip(item);
				}, false);
				item.addEventListener("mouseleave", function () {
					removeToolTip();
				});
				item.addEventListener("mousemove", function (e) {
					moveToolTip(e)
				}, false);
			}

		}

		if(item.constructor === Array) {
			for(var itm in item) {
				addEvents(item[itm]);
			}
		} else {
			addEvents(item, function (e) {
				event(e);
			});
		}
	};
};


var $$ = new CSDOMUtils();
function CSDConstants(){
	// Endpoint list of Microservices
	this.MSE_MAIN = "/ndispatch";
	this.MSE_DEFINITION_MANAGER = "/definition-manager/ndispatch";
	this.MSE_RESOURCE_BUNDLE = "/resource-bundle/ndispatch";
	this.MSE_RESOURCE = "/resource/ndispatch";
	this.MSE_MENU_DEFINITION = "/menu-definition/ndispatch";
	this.MSE_AUTH_MANAGER = "/auth-manager/ndispatch";
	this.MSE_INTEGRATION_MANAGER = "/integration-manager/ndispatch";
	this.MSE_EXPORT_DEFINITION = "/export-definition/ndispatch";
	this.MSE_IMPORT_DEFINITION = "/import-definition/ndispatch";
	this.MSE_ORGANIZATION_MANAGER = "/organization-manager/ndispatch";
	this.MSE_PROJECT_MANAGER = "/project-manager/ndispatch";
	this.MSE_SERVICE_VIRTUALIZATION = "/service-virtualization/ndispatch";
	this.MSE_VCS_MANAGER = "/vcs-manager/ndispatch";
	this.MSE_WEBSOCKET_SERVER = "/socket";
	this.MSE_SERVICE_DEF = "/service-def/ndispatch";
	this.MSE_WELCOMEPAGE_MANAGER = "/welcomepage-manager/ndispatch";
	this.MSE_EXPORT_MODULE = "/export-module/ndispatch";
	this.MSE_HTML_MANAGER = "/html-manager/ndispatch";
	this.MSE_JS_LIBRARY = "/js-library/ndispatch";
	this.MSE_CSS_MANAGER = "/css-manager/ndispatch";
	this.MSE_TEST_SCREEN = "/test-screen/ndispatch";
	this.MSE_WIDGET_MANAGER = "/widget-manager/ndispatch";
	this.MSE_REF_DATA_MANAGER = "/ref-data-manager/ndispatch";
	this.MSE_SERVICE_MANAGER = "/service-manager/ndispatch";

	this.BASE_CLASS_DEFAULT = "BaseBF";
	this.BASE_CLASS_CONTAINER = "BaseContainer";
	this.PANEL_NODE_LABEL = "PANEL";
	this.UNREAL_CLASS_ID_PREFIX = "UNREAL_CLASS_";
	this.DEF_OBJ_ID_PREFIX = "__";
	this.DESIGNER_CTX = "designer-context";

	this.DEFAULT_DESIGN_AREA_WIDTH = 700;
	this.DEFAULT_DESIGN_AREA_HEIGHT = 500;
	this.MIN_DESIGN_AREA_WIDTH = 100;
	this.MIN_DESIGN_AREA_HEIGHT = 20;

	this.DEF_TYPE_CONTAINER = "0";//BF
	this.DEF_TYPE_TYPE = "1";//Type BF
	this.DEF_TYPE_CATEGORI = "2";//--

	this.ROOT_NODE_ID = "libRootNode";
	this.ENTITY_NODE_ID = "libEntityNode";
	this.REGION_NODE_ID = "libRegionNode";
	this.PAGE_NODE_ID = "libPageNode";

	this.NODE_TITLES = {
		libEntityNode: "Entity",
		libRegionNode: "Region",
		libPageNode: "Page"
	};

	this.ROOT_NODE_IDS = [
		this.ROOT_NODE_ID,this.ENTITY_NODE_ID,this.REGION_NODE_ID,this.PAGE_NODE_ID
	];

	this.LAYOUT_TYPE_HOR = "CSC-HORIZONTAL";
	this.LAYOUT_TYPE_VERT = "CSC-VERTICAL";
	this.LAYOUT_TYPE_FORM = "CSC-BASIC-FORM";
	this.LAYOUT_TYPE_GRID = "CSC-GRID";
	this.LAYOUT_TYPE_TABLE = "CSC-TABLE";
	this.LAYOUT_TYPE_TABLE_HEADER = "CSC-TABLE-HEADER";
	this.LAYOUT_TYPE_TABLE_ROW = "CSC-TABLE-ROW";
	this.LAYOUT_TYPE_TREEGRID = "CSC-TREEGRID";
	this.LAYOUT_TYPE_DEFAULT = this.LAYOUT_TYPE_VERT;

	this.DEFAULT_VERSION = "1.00";

	this.KEY_MENU_LOCK = "MENU_LOCK";
	this.KEY_MENU_LOCK_TIME = "MENU_LOCK_TIME";

	this.DISPATCH_SIDE = "side-dispatch";
	this.DISPATCH_APP = "/test-dispatch";

	this.DISPATCH_APP_CSDYS = "side-support-csdys";
	this.DISPATCH_APP_CSAP = "csap/dispatch-app";

	this.LAZY_LOAD_ENABLED = true;

	this.TAG_NAMING_PATTERN = "^([_0-9A-Z]{0,49})([0-9A-Z]$){1}";
	this.MEMBER_NAME_REGEX = /^[A-Za-z]{1}[A-Za-z0-9]+$/;
	this.METHOD_NAME_REGEX = /^[A-Za-z]{1}[A-Za-z0-9]+$/;
	this.METHOD_PARAM_REGEX = /^[A-Za-z]{1}[A-Za-z0-9]+$/;
	this.EVENT_NAME_REGEX = /^[A-Za-z]{1}[A-Za-z0-9]+$/;
	this.EVENT_PARAM_REGEX = /^[A-Za-z]{1}[A-Za-z0-9]+$/;

	this.ERR_METHOD_NAME_INVALID = "Method name invalid. Please check following naming rules:<br><br>Min method length is 2<br>Method name cannot include spaces and special chars.<br>Method name must start with an alfanumeric.";
	this.ERR_MEMBER_NAME_INVALID = "Member name invalid. Please check following naming rules:<br><br>Min member length is 2<br>Member name cannot include spaces and special chars.<br>Member name must start with an alfanumeric.";
	this.ERR_PARAM_INVALID = "Parameter name invalid. Please check following naming rules:<br><br>Min parameter length is 2<br>Parameter cannot include spaces and special chars.<br>Parameter must start with an alfanumeric.";
	this.ERR_EVENT_NAME_INVALID = "Event name invalid. Please check following naming rules:<br><br>Min event name length is 2<br>Event name cannot include spaces and special chars.<br>Event name must start with an alfanumeric.";
	this.ERR_EVENT_PARAM_INVALID = "Event parameter invalid. <br> An event must have at least one parameter and first paramater must be 'component'.";
	this.ERR_EVENT_PARAM_NAME_INVALID = "Parameter name invalid. Please check following naming rules:<br><br>Min parameter length is 2<br>Parameter cannot include spaces and special chars.<br>Parameter must start with an alfanumeric.";

	this.RESERVED_WORDS = ["delete","new","this", "default", "float", "init", "members", "function", "events", "var", "arguments"];

	this.DIRTY_TAG = "DIRTY";
	this.DEFAULT_TAG = "DEFAULT";
	this.DEFAULT_CATEGORY_TAG = "CATEGORY";
	this.DEFAULT_UTILDEF_TAG = "BASE-UTIL-DEF";

	this.logLineSep = "*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=";
	this.logLineSepBegin = "\n"+this.logLineSep;
	this.logLineSepEnd = this.logLineSep+"\n";

	this.USER_ROLE_DESIGNER = "designer";
	this.USER_ROLE_IT_DEPARTMENT = "it";

	this.serviceUrlKey = "side-testScreen-serviceUrl";
	this.serviceModeKey = "side-testScreen-serviceMode";
	this.testServiceMode= "TEST";
	this.appServiceMode= "APP";

	//Side form - KEYS servisi olan getFormDegiskenListesi'nin sonuclarinda yer alabilecek degisken tipleri
    this.SIDE_FORM_DEGISKEN_TIPI_TEXT = 1; //E_TEXT
    this.SIDE_FORM_DEGISKEN_TIPI_BIGTEXT = 2; //E_TEXT
    this.SIDE_FORM_DEGISKEN_TIPI_INT = 3; //E_NUMBER
    this.SIDE_FORM_DEGISKEN_TIPI_LONG = 4; //E_NUMBER
    this.SIDE_FORM_DEGISKEN_TIPI_DOUBLE = 5; //E_NUMBER
    this.SIDE_FORM_DEGISKEN_TIPI_DATE = 6; //E_DATE
    this.SIDE_FORM_DEGISKEN_TIPI_DATETIME = 7; //E_DATETIME
    this.SIDE_FORM_DEGISKEN_TIPI_BOOLEAN = 8;

    this.SIDE_FORM_KOMPONENT_TIPI_TEXT = 1;
    this.SIDE_FORM_KOMPONENT_TIPI_HIDDEN = 2;
    this.SIDE_FORM_KOMPONENT_TIPI_TEXTAREA = 3;
    this.SIDE_FORM_KOMPONENT_TIPI_DATE = 4;
    this.SIDE_FORM_KOMPONENT_TIPI_DATETIME = 5;
    this.SIDE_FORM_KOMPONENT_TIPI_CHECKBOX = 6;
    this.SIDE_FORM_KOMPONENT_TIPI_LISTBOX = 7;
    this.SIDE_FORM_KOMPONENT_TIPI_COMBOBOX = 8;
    this.SIDE_FORM_KOMPONENT_TIPI_RADIOBUTTON = 9;
    this.SIDE_FORM_KOMPONENT_TIPI_HTMLEDITOR = 10;
    this.SIDE_FORM_KOMPONENT_TIPI_OUTPUTTEXT = 11;
    this.SIDE_FORM_KOMPONENT_TIPI_OFISDOSYASI = 12;

    //Side form - custom side form entity'ler
    this.SIDE_FORM_E_TEXT = "E_TEXT";
    this.SIDE_FORM_E_TEXTAREA = "E_TEXTAREA";
    this.SIDE_FORM_E_HIDDEN = "E_HIDDEN";
    this.SIDE_FORM_E_RADIOBUTTON = "E_RADIOBUTTON";
    this.SIDE_FORM_E_LISTBOX = "E_LISTBOX";
    this.SIDE_FORM_E_COMBOBOX = "E_COMBOBOX";
    this.SIDE_FORM_E_HTMLEDITOR = "E_HTMLEDITOR";
    this.SIDE_FORM_E_OUTPUTTEXT = "E_OUTPUTTEXT";
    this.SIDE_FORM_E_OFISDOSYASI = "E_OFISDOSYASI";
    this.SIDE_FORM_E_NUMBER = "E_NUMBER";
    this.SIDE_FORM_E_DATE = "E_DATE";
    this.SIDE_FORM_E_DATETIME = "E_DATETIME";
    this.SIDE_FORM_E_CHECKBOX = "E_CHECKBOX";

    this.SYSTEM_ERROR_MSG = "Bir hata oluştu, lütfen sistem yöneticisine haber veriniz.";

    // SideDefaults varsayılan değerleri. Proje, modül veya kullanıcı tarafından set edilmemişse bunlar geçerli olacak.
	this.defaultAppConfigs = {
		"pg-relogin": {
			"value": "P_RE_LOGIN",
			"type": "string",
			"desc": "Oturum hatası oluştuğunda ya da oturum açılması gerektiğinde açılacak sayfanın ismi."
		},
		"sn-login": {
			"value": "login",
			"type": "string",
			"desc": "'login' servisinin ismi.  Oturum hatası oluştuğunda yeniden login için bu servis ismi kullanılır."
		},
		"sn-logout": {
			"value": "logout",
			"type": "string",
			"desc": "'logout' servisinin ismi."
		},
		"sn-getUserSessionInfo": {
			"value": "getUserSessionInfo",
			"type": "string",
			"desc": "'getUserSessionInfo' servisinin ismi. Bu servis uygulama ilk yüklenirken çağrılır ve client tarafına session bilgilerinin çekilmesiini sağlar. Bu servsiten gelen session bilgilerine CSSession.get(key) metodu ile erişilebilir."
		},
		"createSession-auto": {
			"type": "boolean",
			"desc": "Uygulama içeridinde bir modül yüklenirken 'createSession' servisinin otomatik olarak çağrılsın mı?"
		},
		"createSession-sn": {
			"type": "string",
			"desc": "Bir modül yüklenirken çağrılan 'createSession' servisinin ismi."
		},
		"createSession-params": {
			"type": "string",
			"desc": "'createSession' servisine gönderilecek sabit parametreler."
		},
		"createSession-session-params": {
			"type": "string",
			"desc": "'createSession' servisine session'dan gönderilecek parametreler. Dizi şeklinde verilmelidir: ['USERID','ORG_OID'] gibi"
		},
		"sn-getCacheableRfDataInfo": {
			"value": "GET_CACHABLE_RF_DATA_INFO",
			"type": "string",
			"desc": "'GET_CACHABLE_RF_DATA_INFO' servisinin ismi."
		},
		"sn-designerRfAppUrl": {
			"value": "yes",
			"type": "string",
			"desc": "Side designerda RF data için getCacheable Side servisinden mi karşılansın? "
		},
		"support-test-screen-load-relogin": {
			"value": "yes",
			"type": "string",
			"desc": "Designer test sayfasında re-login (P_RE_LOGIN) sayfası yüklensin mi?"
		},
		"support-app-rf-data": {
			"type": "boolean",
			"desc": "Uygulama referans verileri desteklensin mi?"
		},
		"support-side-im": {
			"type": "boolean",
			"desc": "Side Web Socket desteği olsun mu?"
		},
		"support-side-services": {
			"type": "boolean",
			"desc": "Side servisleri de uygulamada aktif edilsin mi?"
		},
		"support-multi-page": {
			"type": "boolean",
			"desc": "Uygulama birden fazla browser penceresinde çalışsın mı?"
		},
		"support-service-call-path": {
			"type": "boolean",
			"desc": "Servis çağrılarında servisin çağrıldığı ekran yolu servis çağrısında parametre olarak eklensin mi?"
		},
		"support-service-call-extra-params": {
			"type": "boolean",
			"desc": "Servis çağrılarında extra parametreler (window.callParams) eklensin mi?"
		},
		"param-token-key": {
			"value": "token",
			"type": "string",
			"desc": "Token paramtresinin ismi."
		},
		"param-lang-key": {
			"value": "tr",
			"type": "string",
			"desc": "Desteklenecek dil (az/en/tr)"
		},
		"param-global-popup": {
			"type": "boolean",
			"desc": "Popup'lar her zaman global olarak açılsın mı?"
		},
		"param-login-page": {
			"value": "login.html?dl=e",
			"type": "string",
			"desc": "Login sayfasının ismi ve parametreleri."
		},
		"call-logout-on-window-unload": {
			"type": "boolean",
			"desc": "Browser penceresi kapatılırken logout servisi çağrılsın mı?"
		},
		"service-caller-show-messages": {
			"type": "boolean",
			"desc": "Servis çağrılarında hata callback'leri olsa bile hata mesajarı side tarafından gösterilsin mi?"
		},
		"service-caller-show-success-messages": {
			"type": "boolean",
			"desc": "Başarılı servis çağrılarından dönen bilgi mesajları side tarafından otomatik olarak gösterilsin mi?"
		},
		"service-caller-show-sys-error-messages": {
			"type": "boolean",
			"desc": "Servis çağrılarında hata callback'leri olsa bile sistem hataları side tarafından gösterilsin mi?"
		},
		"support-auto-focus": {
			"type": "boolean",
			"desc": "Yeni açılan bir sayfanın ilk elemanına otomatik focus yapılsın mı?"
		},
		"support-dt-for-grid": {
			"type": "boolean",
			"desc": "Grid bileşeni yerine Data Table bileşeni kullanılsın mı?"
		},
		"support-dt-for-table": {
			"type": "boolean",
			"desc": "Tablo bileşeni yerine Data Table bileşeni kullanılsın mı?"
		},
		"support-changed-event-on-setvalue": {
			"type": "boolean",
			"desc": "Bileşenlerde setValue çalıştığında changed eventi fire edilsin mi?"
		},
		"support-bind-components-and-rf-data": {
			"type": "boolean",
			"desc": "Bileşenler ve Ref Data'lar arasında binding işlemi aktif edilsin mi?"
		},
		"theme": {
			"value": "side",
			"type": "string",
			"desc": "Tema prefix bilgisi."
		},
		"enable-slack-integration": {
			"type": "boolean",
			"desc": "Slack entegrasyonu aktif olsun mu?"
		},
		"enable-jira-integration": {
			"type": "boolean",
			"desc": "Jira entegrasyonu aktif olsun mu?"
		},
		"enable-gitlab-integration": {
			"type": "boolean",
			"desc": "Gitlab entegrasyonu aktif olsun mu?"
		},
		"side-start-job": {
			"type": "string",
			"desc": "getUserSession servisi çağrıldıktan sonra ve sayfa render edilmeden önce çalışacak metod ismi."
		},
		"side-init-job": {
			"type": "string",
			"desc": "getUserSession servisinden önce çalışacak metod ismi."
		},
		"content-security-policy-config": {
			"type": "string",
			"desc": "Export'ta Content Security Policy Filter'ı kuralları ile aktif eder."
		},
		"importJspPre": {
			"type": "string",
			"desc": "Export'ta jsp:include ile welcome page'e öncelikli olarak include edilmesi istenilen sayfa ismi."
		},
		"service-caller-show-messages-notify": {
			"type": "boolean",
			"desc": "Servis çağrılarında bildirimler aktif edilsin mi?"
		},
		"service-caller-show-messages-notify-timeout": {
			"value": 0,
			"type": "int",
			"desc": "Servis çağrılarında bildirimler ekranda kaç ms kalsın?"
		},
		"excel-export-send-appRefData": {
			"type": "boolean",
			"desc": "Excel export esnasında AppRefData gönderilsin mi?"
		},
		"excel-export-add-module-to-url": {
			"type": "boolean",
			"desc": "Export işlemi esnasında kullanılan url bilgisine modül prefixini ekle."
		},
		"show-errors-on-runtime-errors": {
			"type": "boolean",
			"desc": "Runtime'da hata oluştursa hatayı göster."
		},
		"mask-page-on-runtime-errors": {
			"type": "boolean",
			"desc": "Runtime'da hata oluştursa ekranı maskele ve işleme izin verme."
		},
		"favicon-path": {
			"type": "string",
			"desc": "Head içerisine link olarak eklenecek favicon adresi."
		},
		"focus-first-component-on-page-opening": {
			"type": "boolean",
			"desc": "Bir sayfa açılırken sayfadaki ilk editable alana focus yapılsın mı?"
		}
	};

    this.roles = {
		"Developer" : 10,
		"Senior Developer" : 20,
		"Module Manager" : 30,
		"Service Manager" : 40,
		"Project Manager" : 50,
		"Organization Manager" : 60,
		"Side Admin" : 70
	};

    this.DEFAULT_USER_PREFERENCES = {
		designerTheme: "light",
		designTheme: "ndesigner",
		rememberLastTabs: true,
		openSearchWindowOnStartup: true,
		dynamicTesting: true
    };
}

window.NConsts = new CSDConstants();
window.csdc = window.NConsts;//FIXME csdc kullanımları bittikten sonra bu satır silinmeli




function CSNotify(){
	var notifies = [];
	var stateKapali2 = true;
	$("#designer-notify-expand-button").click(function(){
		if (stateKapali2) {
			$("#designer-notify").css("height", "80px");
		} else {
			$("#designer-notify").css("height", "0px");
		}
		stateKapali2 = !stateKapali2;
	});
	
	this.notify = {};
	
	this.addNotify = function(item,value,bcName){
		
		var str = " : " + bcName + " da " + item + " " + value + " yapildi";
		
		var date = new Date();
		
		var hour = date.getHours();
		if(hour<10){
			hour = "0" + hour;
		}
		var minutes = date.getMinutes();
		if(minutes<10){
			minutes = "0" + minutes;
		}
		
		var time = hour + ":" + minutes;
		
		notifies.push({
			time: time,
			value: str
		});
		$("#designer-notify").empty();
		for(var i=0; i<notifies.length ;i++){
//			if(notifies.time < 321){
				var $div = $("<div>").html(notifies[i].time + notifies[i].value);
				$("#designer-notify").append($div);
//			}
		}
		this.lightItUp();
	}
	
	this.lightItUp = function(){
		
		$("#designer-notify-change-signal").css("background-image","url('designer/img/notify/circle_green.png')");

		setTimeout(function(){$("#designer-notify-change-signal").css("background-image","url('designer/img/notify/circle_grey.png')");}, 2000);
		
	}
	
}

	
	
	


function CSWaterFall(finishCallback){
	this.errorFlag = false;
	var callbacks = [];
	var listeners = [];
	var runIndex = 0;
	
	this.add = function(callback, params, errormsg, infomesg){
		callbacks.push({c: callback, p:params});
	};
	this.listen = function(listenerCallback){
		//listener parameters: success, index, length, info message
		listeners.push(listenerCallback);
	};
	this.run = function(){
		if(callbacks.length == runIndex){//finito
			if(finishCallback && typeof finishCallback == "function"){
				finishCallback();
			}
			return;
		}
		//Call next callback
//		try {
			callbacks[runIndex].c.apply(null, [this].concat(callbacks[runIndex].p));//call next callback
//		} catch(ex){
//			console.log(ex);
//			this.error("System error. WaterFall failed.");
//		}
	};
	this.ok = function(message){
		//if there is listener for flow, call listeners to tell step ok
		if(listeners.length > 0){
			for(var i=0; i<listeners.length ;i++){
//				try {
					//listener parameters: success, index, length, info message
					listeners[i](true, runIndex, callbacks.length, message);
//				} catch (ex){
//					console.log(ex);
//				}
			}
		}
		runIndex++;
		this.run();
	};
	this.error = function(message){
		//if there is listener for flow, call listeners to tell step fail
		if(listeners.length > 0){
			for(var i=0; i<listeners.length ;i++){
				try {
					//listener parameters: success, index, length, info message
					listeners[i](false, runIndex, callbacks.length, message);
				} catch (ex){
					console.log(ex);
				}
			}
		}
	};
}


function CSParallelFlow(finishCallback){
	var callbacks = [];
	var listeners = [];
	var runIndex = 0;
	
	this.add = function(callback, params, errormsg, infomesg){
		callbacks.push({c: callback, p:params});
	};
	
	this.listen = function(listenerCallback){
		//listener parameters: success, index, length, info message
		listeners.push(listenerCallback);
	};
	
	this.run = function(){
		var runMap = {};
		var me = this;
		var Flow = function(){
			this.ok = function(message){
				if(runMap[this.index]){
					console.error("Paralel flow aynı adım icin cagrildi. index: " + this.index + " message: " + message);
				}
				runMap[this.index] = true;
				
				for(var i=0; i<listeners.length ;i++){
					try {
						//listener parameters: success, index, length, info message
						listeners[i](true, this.index, callbacks.length, message);
					} catch (ex){
						console.log(ex);
					}
				}
				
				for(var index in runMap){
					if(runMap[index] === undefined){
						return;
					}
				}
				if(finishCallback){
					finishCallback();
				}
			};
			
			this.error = function(message){
				runMap[this.index] = false;
				
				for(var i=0; i<listeners.length ;i++){
					try {
						//listener parameters: success, index, length, info message
						listeners[i](false, this.index, callbacks.length, message);
					} catch (ex){
						console.log(ex);
					}
				}
				
				for(index in runMap){
					if(runMap[index] === undefined){
						return;
					}
				}
				if(finishCallback){
					finishCallback();
				}
			};
		};
		for(var i=0; i<callbacks.length ;i++){
			runMap[i] = undefined;
		}
		for(var i=0; i<callbacks.length ;i++){
			var flow = new Flow();
			flow.index = i;
			callbacks[i].c.apply(null, [flow].concat(callbacks[i].p));//call next callback
		}
	};
	
}
		






















/**
 * @author hakand
 */

function ServiceCaller(){

	//IE9 için eklendi
	jQuery.support.cors = true;

	var commErrorMsg = "Sunucuya erişilemiyor. Lütfen bir süre sonra tekrar deneyiniz.";
	var errorMsg = "Bir sistem hatası oluştu. Lütfen sistem yöneticinize haber veriniz.";
	var beatify = false;

	var defaults = {
		url: csdc.DISPATCH_APP_CSAP,
		type: "POST",
		dataType: "json",
		showMessages: true
	};

	var listenServicesFlag = false, inputFlag = false, outputFlag = false, limit, listenOnModule, queueOfListenedServices = [], listenCallback, tempListenedServices =[];

	this.init = function() {
		var serviceUrl = localStorage[csdc.serviceUrlKey];
		this.changeURL(serviceUrl || csdc.DISPATCH_APP_CSAP);
	};

	this.clearListenedServices = function(){
		queueOfListenedServices = [];
	};

	this.getListenedServices = function(){
		return queueOfListenedServices;
	};

	this.listen = function(filter, options, callback){
		listenServicesFlag = true;
		inputFlag = options.input? options.input :false;
		outputFlag = options.output? options.output :false;
		limit = options.limit ? options.limit : 100;
		listenOnModule =filter.moduleName;
		listenCallback = callback;
	};

	function listen(cmd, newJP, respObj, startTime, callId, callPath){
		var obj= {};
		if(respObj === null){
			tempListenedServices[cmd + "@" +callId] = {};
			if(listenOnModule ===SideModuleManager.getLocalModuleName() ){
				if(inputFlag){
					tempListenedServices[cmd + "@" +callId].input = newJP;
				}
				tempListenedServices[cmd + "@" +callId].startTime = startTime;
			}
		}else {
			obj[cmd+ "@" +callId] = {};
			if(listenOnModule ===SideModuleManager.getLocalModuleName() ){
				if(inputFlag){
					obj[cmd+ "@" +callId].input = tempListenedServices[cmd + "@" +callId].input;
				}
				if(outputFlag){
					obj[cmd+ "@" +callId].output = respObj;
				}
				obj[cmd+ "@" +callId].startTime = tempListenedServices[cmd + "@" +callId].startTime;
				obj[cmd+ "@" +callId].timeDiff = new Date()- tempListenedServices[cmd + "@" +callId].startTime; //time difference in ms.

				if(callPath){
					obj[cmd+ "@" +callId].callPath = callPath;
				}
				obj[cmd+ "@" +callId].cmd = cmd;
				if(queueOfListenedServices.length >= limit){
					queueOfListenedServices.shift();
				}else{
					queueOfListenedServices.push(obj[cmd+ "@" +callId]);
				}
				if(listenCallback){
					listenCallback(obj[cmd+ "@" +callId]);
					delete tempListenedServices[cmd + "@" +callId];
				}
			}
		}
	}

	this.changeURL = function(url) {
		defaults.url = url;
	};

	this.setBeatify = function(flag){
		if(flag === undefined){
			flag = true;
		}
		beatify = flag;
	};

	this.getDispatchURL = function(){
		//#hakand burada modüllü yapıya geçmeden önce kullanılan metod devre dışı kaldı. Artık bu metod kullanılmamalı.
		//unutulan yerlere desteğin devamı için local modul app url dönülüyor.
		return SideModuleManager.getLocalModuleAppUrl();

	};

	this.getAppURL = function(servletPath){
		//#hakand burada modüllü yapıya geçmeden önce kullanılan metod devre dışı kaldı. Artık bu metod kullanılmamalı.
		//fakat side de tasarlanan yetki ekranlarına ve unutulan yerlere desteğin devamı için local modul app url dönülüyor(önemli).
		var localModule = SideModuleManager.getLocalModuleName();
		return SideModuleManager.getAppUrl(localModule, servletPath);
	};

	this.getIMURL = function(){
		//#hakand burada modüllü yapıya geçmeden önce kullanılan metod devre dışı kaldı. Artık bu metod kullanılmamalı.
		//unutulan yerlere desteğin devamı için local modul app url dönülüyor.
		var localModule = SideModuleManager.getLocalModuleName();
		return SideModuleManager.getIMUrl(localModule);
	};

	this.getDownloadURL = function(module){
		//#hakand burada modüllü yapıya geçmeden önce kullanılan metod devre dışı kaldı. Artık bu metod kullanılmamalı.
		//unutulan yerlere desteğin devamı için local modul app url dönülüyor.
		return SideModuleManager.getDownloadUrl(module || SideModuleManager.getLocalModuleName());
	};

	this.getFileUploadURL = function(){
		//#hakand burada modüllü yapıya geçmeden önce kullanılan metod devre dışı kaldı. Artık bu metod kullanılmamalı.
		//unutulan yerlere desteğin devamı için local modul app url dönülüyor.
		var localModule = SideModuleManager.getLocalModuleName();
		return SideModuleManager.getFileUploadUrl(localModule);
	};

	this.getFullAppURL = function(servletPath){
		var url = this.getAppURL(servletPath);
		var escapedStr = url.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
		var el= document.createElement('div');
		el.innerHTML= '<a href="'+escapedStr+'">x</a>';
		return el.firstChild.href;
	};


	var callid = 0;

	this.ajaxcall = function(url, params, config, success, error){
		var paramStr = "";
		if(params){
			for(var pname in params){
				paramStr += "&"+pname+"="+ encodeURIComponent(params[pname]);
			}
		}

		config = config || {};
		config = csDefaults(config, defaults);

		$.ajax({
			url : url,
			type : config.type,
			dataType : config.dataType,
			headers: config.headers,
			cache: false,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			data : paramStr
		}).success(function(data, textStatus, jqXHR){
			try {
				BFEngine.a();
				success(data, textStatus, jqXHR);
			} finally {
				BFEngine.r();
			}
		}).error(function(jqXHR, textStatus, errorThrown){
			try {
				BFEngine.a();
				error(jqXHR, textStatus, errorThrown);
			} finally {
				BFEngine.r();
			}
		});
	};

	this.generateId = function(){
		if ( !this.callidPrefix )	this.callidPrefix = ""+(((Math.random()+1)*0x10000).toString(16).substring(1) + ((Math.random()+1)*0x10000).toString(16).substring(1) + ((Math.random()+1)*0x10000).toString(16).substring(1)).replace(/\./g,"").substring(0,13)
		if ( !this.callidCounter )	this.callidCounter = 0;
		this.callidCounter++;
		return this.callidPrefix + "-" + this.callidCounter;
	};

	/**
	 * callParams:
	 * SN: Service Name
	 * param: Service Parameters (JSON)
	 * url: URL to call service (optional, default: dispatch)
	 * type: Call type (optional, default: POST)
	 * onsuccess: callback function on successful service call (optional)
	 * onerror: callback function on failure service call (optional)
	 */
	this.call = function(cmd, callParams, config){
		if(!cmd || typeof cmd != "string"){
			throw "Servis ismi bulunamadı yada servis ismi geçersiz.";
		}
		var isValid = true;
		var thenCaller = null;
		var errorCaller = null;
		if(!config){ config = {};}

		if(config.screenValidation && config.bf){//ekran doğrulama (servis değil)
			var result = config.bf.isValid();
			if(!result.success && result.messages && result.messages.length){
				var msgStr = "";
				for(var i=0; i<result.messages.length ;i++){
					msgStr += result.messages[i] +"<br>";
				}
				CSPopupUTILS.MessageBox(msgStr, {title: "Hata !", error: true});
				window.setTimeout(function(){
					if(errorCaller){
						errorCaller([{ type: 4, text: "Validation error."}]);
					}
				}, 10);
				return;
			}
		}

		var moduleName = SideModuleManager.getLocalModuleName();
		if(config.bf){
			var bfname = config.bf.$CS$.definition.BF_NAME;
			if(bfname.indexOf(".") > 0){
				moduleName = bfname.substring(0, bfname.indexOf("."));
			}
		}
		if(config.module){
			moduleName = config.module;
		}

		//moduller için url bul
//		console.log("service caller func " + arguments.callee.caller.toString());
		if(!config.url){
			config.url = SideModuleManager.getAppUrl(moduleName, undefined, (config.bf || config.bfFromReltvComp) );
		}

		if(!config.url){
			config.url = SideModuleManager.getLocalModuleAppUrl();
		}

		config = csDefaults(config, defaults);

		//client side service validation
		//isValid = CSValidationManager.validateService(moduleName, cmd, callParams);

		/**
		 * servis çağırmak için parametreler string olarak hazırlanır.
		 * callparams BF veya JSON Obj den olusan nesne veya dizi olabilir.
		 */


			//servis ismini ekle
		var callID = this.generateId(),pageId,pageName;
		if(config.bf){
			var bfname = config.bf.$CS$.definition.BF_NAME;
			if(bfname.indexOf(".") > 0){
				pageName = bfname.substring(bfname.indexOf(".")+1);
			}
		}
		var paramStr="cmd="+cmd+"&callid="+callID;
		paramStr = paramStr+"&pageName="+pageName;


		if(beatify){
			paramStr += "&beatify=1";
		}
		//TODO mahmuty burası ferhat hoca ve serdar hoca nuarch'ta düzeltme yaptıktan sonra config.module'u değil yukarıdaki moduleName'i kullanacak şekilde düzeltilecek
		//Nuarch'taki bir hata servis ismine bakmadan çağrının direk modüle yönlendirilmesine sebep oluyor
		if(config.module){
			paramStr += "&module="+config.module;
		}
		if(config.extraParams){
			for(var pname in config.extraParams){
				paramStr += "&"+pname+"="+config.extraParams[pname];
			}
		}
		if(getSideDefaults("support-service-call-extra-params", moduleName) && window.callParams){
			for(var pname in window.callParams){
				paramStr += "&"+pname+"="+window.callParams[pname];
			}
		}

		if( config.pm || ( (typeof sideCurrentPM !== "undefined" ) && (sideCurrentPM !== "") ) ){
			paramStr += "&pm=" + (config.pm || sideCurrentPM);
		}

		if(window.sideCurrentOU){
			var sideToken = NCookies["sidetoken-" + sideCurrentOU];
			if(sideToken && (sideToken !== "")){
				paramStr += "&sidetoken=" + sideToken;
			}
		}

		if(CSSession){
			var token = config.token ? config.token : CSSession.getToken(moduleName);
			if(!token){
				token = CSSession.getToken();
			}
			if(token){
				var tokenKey = window.getSideDefaults("param-token-key", moduleName) || window.getSideDefaults("param-token-key", SideModuleManager.getLocalModuleName());
				paramStr += "&"+ tokenKey+"="+ encodeURIComponent(token);
			}
		}

		//parametre var mı, varsa parametreleri ekle
		var newJP = null;
		if(callParams && isValid){
			if( Array.isArray(callParams)){//parametreler dizi olabilir
				newJP = [];
				for(var i in callParams){
					var p = callParams[i];
					if(typeof p.getValue === 'function'){//BF ise getValue ile değerini al
						var o = {};
						o[p.name] = p.getValue();// "ad": "kamil" şeklinde nesne oluşturarak parametre koy
						newJP.push(o);
					}else{//json ise direk yolla
						newJP.push(p);// verilen nesneyi parametre koy
					}
				}


			}else{//parametre nesne olabilir
				if(typeof callParams.getValue === 'function'){//BF ise getValue ile değerini al
					var p = callParams;
					newJP = p.getValue(); // "ad": "kamil" şeklinde nesne oluşturarak parametre koy;
				}else{//json ise direk yolla
					newJP = callParams; //verilen nesneyi parametre koy
				}
			}

			try {
				if(listenServicesFlag){
					listen(cmd,newJP, null, new Date(), callID, null);
				}
			}
			catch(err) {
				console.log("Service dinlenirken hata olustu " +err);
			}

			if(config.compress){
				var str = JSON.stringify(newJP, function(key, value){
					if(value && value.getValue && typeof value.getValue == "function" ){
						return value.getValue();
					}
					return value;
				});

				var compressedStr = LZString.compressToUTF16(str);
				paramStr += "&jp=" + compressedStr;

			}else{
				paramStr += "&jp=" + encodeURIComponent(JSON.stringify(newJP, function(key, value){
						if(value && value.getValue && typeof value.getValue == "function" ){
							return value.getValue();
						}
						return value;
					}));
			}
		} else {
			paramStr += "&jp={}";
		}

		// bfBase.service metodu için.
		if(config && config.version){
			paramStr += "&v=" + config.version;
		}

		if(isValid){
			var putCallPath = getSideDefaults("support-service-call-path", moduleName);
			if(putCallPath && config.bf){
				var tempBF = config.bf;
				var bfs = [tempBF];
				while(tempBF.$CS$.parent){
					tempBF = tempBF.$CS$.parent;
					if(tempBF.getConfig().mainTab){
						break;
					}
					if(!BFEngine.isNonBusiness(tempBF)){
						bfs.push(tempBF);
					}
				}
				var callPath = bfs[bfs.length-1].getBusinessName(false);
				for(var i=bfs.length-2; i>=0 ;i--){
					callPath += "." + bfs[i].getMemberName();
				}
				paramStr += "&cp="+callPath;
			}

			if(config.maskBF && config.maskBF.mask){
				config.maskBF.mask();
			}

//				console.log("ServiceCaller.call: " +paramStr);
			//servisi çağır, servisten gelmesi beklenen sonuç nesnesi aşağıdaki gibidir.
			/**
			 * data: {}//servis başarılı ise doludur
			 * messages: [{type:1, text: ""}]
			 * messages=> 1: error, 2: warning, 3:info, 4: session, 5: validation
			 * error: {} //hata varsa doludur
			 */

			/* Erce */
			var progressMask = null;
			if(config.progressMask) {
				progressMask = config.progressMask;
				config.bf.mask();
			}
			/* Erce */

			var progressBar = null;
			if(config.progress){
				progressBar = CSPopupUTILS.ProgressBar(config.progress, {bf: config.bf});
			}
			var startTime = new Date();
			var replayed = false;


			function success(data, textStatus, jqXHR){
				var elapsed = new Date() - startTime;
				console.log("Service Call (" + cmd +") elapsed: " + elapsed + " ms.");

				/* Erce */
				if(progressMask) {
					config.bf.unmask();
				}
				/* Erce */

				if(progressBar){
					progressBar.close();
				}
				if(config.maskBF && config.maskBF.unmask){
					config.maskBF.unmask();
				}

				//verinin nesne gelmesi bekleniyor ama string gelirsede eval ederek nesneye çevirir. 
				var respObj = null;
				try {
					if(typeof data === "object"){
						respObj = data;
					}else if(typeof data === "string"){
						respObj = data ? eval("("+data+")") : null;
					}
				} catch(ex){
					respObj = {
						error: "1.1",
						messages: [{ type: 1, text: commErrorMsg}]
					};
				}

				try {
					BFEngine.a();
					//messages: [{type:1, text: ""}]
					//messages=> 1: error, 2: warning, 3:info, 4: session, 5: validation
					if(respObj && respObj.error != 2 && respObj.messages && respObj.messages.length > 0 ){
						if(parseInt(respObj.messages[0].type, 10) == 4){//Session error
							if(window.CSLoginPopupOpened){
								if(errorCaller){
									errorCaller(respObj.messages, {callid:callID});
								}
								return;
							}
							window.CSLoginPopupOpened = true;
							var message = respObj.messages && respObj.messages.length>0 ? respObj.messages[0].text : undefined;
							if(typeof window.APP_SESSION_EXPIRE_CALLBACK == "function"){
								window.APP_SESSION_EXPIRE_CALLBACK(message);
							} else {
								CSPopupUTILS.Login(message);
							}
							if(errorCaller){
								errorCaller(respObj.messages, {callid:callID});
							}
							return;
						}

						var appInfoShowMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-messages", moduleName) : undefined;//gibintra=> errorcaller olsa dahi mesajları göster
						var appInfoShowSuccessMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-success-messages", moduleName) : undefined;//keys
						var appInfoShowSysErrorMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-sys-error-messages", moduleName) : undefined;//evdo
						if( config.showMessages !== false &&
							(
								appInfoShowMessages ||
								(
									(respObj.error && !errorCaller) ||
									(!respObj.error && appInfoShowSuccessMessages) ||
									(respObj.error && respObj.error === "1.1" && errorCaller && appInfoShowSysErrorMessages)//evdo için. eğer comm err ise error callback olsa dahi göster
								)
							)
						){
							var msg = "";
							var details = "";
							var msgType = 1;
							for(var i=0; i<respObj.messages.length ;i++){
								if(typeof respObj.messages[i] == "string"){
									msg += respObj.messages[i] +"<br/>";
								} else if(respObj.messages[i].text){
									msgType = respObj.messages[i].type;
									msg += respObj.messages[i].text +"<br/>";
									if(respObj.messages[i].code){ details += respObj.messages[i].code +"<br/>"; }
								}
							}
							if(msg){
								var notify = getSideDefaults("service-caller-show-messages-notify", moduleName);
								if(notify && (respObj.error == 3 || respObj.type == 3 || ( !respObj.error && !respObj.type && msgType == 3))){	// Info türünde ise.
									var timeout = getSideDefaults("service-caller-show-messages-notify-timeout");
									SIDENavigator.notify(msg, {timeout: timeout});
								}else{
									var errorMsg = (respObj.error && respObj.error != 3) || (msgType && msgType == 1);
									if(details.length > 0){
										CSPopupUTILS.MessageBox(msg, {detail:true, error:errorMsg}, function(buttonName){
											if(buttonName === "detail"){ CSPopupUTILS.MessageBox(details, {title: "Hata Detayı"}); }
										});
									}else{
										CSPopupUTILS.MessageBox(msg,{error:errorMsg}); //Utility-Business servis ayrımı yapıldığında gözden geçirilmeli
									}
								}
							}
							SIDEUtil.showValidationError(config.bf, respObj.messages);
						}
					}

					if(respObj && respObj.metadata && respObj.metadata.totalCount !== undefined){
						window.$CS$RowCount = respObj.metadata.totalCount;
					} else if(respObj && respObj.totalCount !== undefined){
						window.$CS$RowCount = respObj.totalCount;
					} else {
						window.$CS$RowCount = undefined;
					}

					if(respObj && respObj.totalRowSum !== undefined){
						window.$CS$TotalRowSum = respObj.totalRowSum;
					} else {
						delete window.$CS$TotalRowSum;
					}

					if(respObj){
						for(obj in respObj){
							if(obj.indexOf("totalCell") != -1){
								if(!window.$CS$TotalCellValues){
									window.$CS$TotalCellValues = {};
								}

								window.$CS$TotalCellValues[obj] = respObj[obj];
							}
						}
					}

					//sonuc istenilen formatta değilse
					if(!respObj){
						if(thenCaller){
							thenCaller();//success callback varsa çağır
						}
						return;
					}
					//başarılı ise
					if(!respObj.error){
						if(thenCaller){
							try {
								if(listenServicesFlag){
									listen(cmd,newJP, respObj, null,callID, config.bf.getBusinessName(),pageName);
								}
							}
							catch(err) {
								console.log("Service dinlenirken hata olustu " +err);
							}

							thenCaller(respObj.data, respObj.messages, respObj.metadata);//callback varsa çağır
						}
						return;
					}

					//başarısız ise
					if(respObj.error){
						try {
							if(listenServicesFlag){
								listen(cmd,newJP, respObj, null,callID, config.bf.getBusinessName(),pageName);
							}
						}
						catch(err) {
							console.log("Service dinlenirken hata olustu " +err);
						}

						if(respObj.error == 2){//Session error
							if(window.CSLoginPopupOpened){
								errorCaller(respObj.messages, {callid:callID});
								return;
							}
							window.CSLoginPopupOpened = true;
							var message = respObj.messages && respObj.messages.length>0 ? respObj.messages[0].text : undefined;
							if(typeof window.APP_SESSION_EXPIRE_CALLBACK == "function"){
								window.APP_SESSION_EXPIRE_CALLBACK(message);
							} else {
								CSPopupUTILS.Login(message);
							}
							if(errorCaller){
								errorCaller(respObj.messages, {callid:callID});
							}
							return;
						}
						if(errorCaller){//kullanıcı callback vermişse
							if(typeof errorCaller === 'function' ){//if callback is func
								errorCaller(respObj.messages, {callid:callID});
							}else if( typeof(errorCaller) === 'string'){//if callback is String
								//							csdu.hataMesaji(errorCaller);
							}
						}else{//kullanıcı callback vermemişse
							if(respObj.messages){//mesajlar varsa mesajları göster
								SIDEUtil.showValidationError(config.bf, respObj.messages);
							}else{//mesaj yoksa varsayılan mesajı göster.
								//							csdu.hataMesaji(commErrorMsg);
							}
						}
						return;
					}
				} finally {
					BFEngine.r();
				}

			};
			function error(jqXHR, textStatus, errorThrown){
				// if(jqXHR.status == 404){
				// 	if(!replayed){
				// 		console.log("Service 404 error. Service replaying: " + cmd);
				// 		replayed = true;
				// 		$.ajax({
				// 			url : config.url,
				// 			type : config.type,
				// 			dataType : config.dataType,
				// 			cache: false,
				// 			xhrFields: {
				// 		       withCredentials: true
				// 		    },
				// 		    crossDomain: true,
				// 			data : paramStr
				// 		}).success(success).error(error);
				// 		return;
				// 	}
				// }
				if(progressBar){
					progressBar.close();
				}
				if(config.maskBF && config.maskBF.unmask){
					config.maskBF.unmask();
				}
				try {
					BFEngine.a();
					console.error("An error was happened during Ajax call. cmd: "+ cmd + " url: "+ (config ? config.url : "")+" Exc: "+ (errorThrown ? errorThrown.toString() : ""));
					if(errorCaller){//kullanıcı callback vermişse
						var appInfoShowSysErrorMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-sys-error-messages", moduleName) : undefined;//evdo
						if(appInfoShowSysErrorMessages){
							CSPopupUTILS.MessageBox(commErrorMsg, {error: true});
						}
						if(typeof errorCaller === 'function' ){//if callback is func
							errorCaller(commErrorMsg, {callid:callID, thrown: errorThrown});
						}else if( typeof(errorCaller) === 'string'){//if callback is String
							CSPopupUTILS.MessageBox(errorCaller, {error: true});
						}
					} else {//kullanıcı callback vermemişse
						if(jqXHR.status == 404){
							CSPopupUTILS.MessageBox(commErrorMsg, {error: true});
						}if(jqXHR.status == 500 || jqXHR.status == 502){
							CSPopupUTILS.MessageBox(errorMsg, {error: true});
						}
					}
				}finally {
					BFEngine.r();
				}
			};


			var ajaxParams = {
				url : config.url,
				type : config.type,
				dataType : config.dataType,
				cache: false,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data : paramStr
			};

			if(config.timeout){
				ajaxParams.timeout = config.timeout;
			}

			$.ajax(ajaxParams).success(success).error(error);
		}

		return {
			then: function(callback){
				thenCaller = callback;
				return this;
			},
			error: function(callback){
				errorCaller = callback;
				if(!isValid && errorCaller && typeof errorCaller === 'function' ){
					try {
						BFEngine.a();
						errorCaller([{ type: 4, text: "Validation error."}]);
					}finally {
						BFEngine.r();
					}
				}
				return this;
			}
		};
	};

	this.restCall = function(path, parameters, config) {

		if(!path || typeof path != "string") {
			throw "Path bilgisi bulunamadı yada path ismi geçersiz.";
		}
		var isValid = true;
		var thenCaller = null;
		var errorCaller = null;
		if(!config) {
			config = {};
		}

		var moduleName = SideModuleManager.getLocalModuleName();
		var sideParams = {};
		if(!config.url) {
			config.url = SideModuleManager.getAppUrl(moduleName, undefined, (config.bf || config.bfFromReltvComp));
		}

		if(!config.url) {
			config.url = SideModuleManager.getLocalModuleAppUrl();
		}

		config = csDefaults(config, defaults);

		if(config.module){
			sideParams["module"] = config.module;
		}
		if(config.extraParams){
			for(var pname in config.extraParams){
				sideParams[pname] = config.extraParams[pname];
			}
		}
		if(getSideDefaults("support-service-call-extra-params", moduleName) && window.callParams){
			for(var pname in window.callParams){
				sideParams[pname] = window.callParams[pname];
			}
		}

		if( config.pm || ( (typeof sideCurrentPM !== "undefined" ) && (sideCurrentPM !== "") ) ){
			sideParams["pm"] = config.pm || sideCurrentPM;
		}

		if(window.sideCurrentOU){
			var sideToken = NCookies["sidetoken-" + sideCurrentOU];
			if(sideToken && (sideToken !== "")){
				sideParams["sidetoken"] = sideToken;
			}
		}

		if(CSSession) {
			var token = config.token ? config.token : CSSession.getToken(moduleName);
			if(!token) {
				token = CSSession.getToken();
			}
			if(token) {
				var tokenKey = window.getSideDefaults("param-token-key", moduleName) || window.getSideDefaults("param-token-key", SideModuleManager.getLocalModuleName());
				sideParams[tokenKey] = encodeURIComponent(token);
			}
		}

		var callID = this.generateId(),pageId,pageName;
		sideParams["callID"] = callID;
		if(config.bf){
			var bfname = config.bf.$CS$.definition.BF_NAME;
			if(bfname.indexOf(".") > 0){
				pageName = bfname.substring(bfname.indexOf(".")+1);
				sideParams["pageName"] = pageName;
			}
		}
		var paramObject = csCloneObject(parameters);
		delete paramObject["method"];
		var paramStr = null;
		var data;
		var paramKeysObj = Object.keys(paramObject);

		if(paramKeysObj.indexOf("body") > -1){
			data = paramObject.body;
		}
		else if(paramKeysObj.indexOf("formData") > -1){
			var formData = new FormData();
			formData.append("json",JSON.stringify(paramObject.formData));
		}
		var progressMask = null;
		if(config.progressMask) {
			progressMask = config.progressMask;
			config.bf.mask();
		}
		var progressBar = null;
		if(config.progress){
			progressBar = CSPopupUTILS.ProgressBar(config.progress, {bf: config.bf});
		}
		var startTime = new Date();
		var replayed = false;


		function success(data, textStatus, jqXHR) {
			var elapsed = new Date() - startTime;
			console.log("Service Call (" + config.url + path + ") elapsed: " + elapsed + " ms.");

			/* Erce */
			if(progressMask) {
				config.bf.unmask();
			}
			/* Erce */

			if(progressBar) {
				progressBar.close();
			}
			if(config.maskBF && config.maskBF.unmask) {
				config.maskBF.unmask();
			}

			//verinin nesne gelmesi bekleniyor ama string gelirsede eval ederek nesneye çevirir.
			var respObj = null;
			try {
				if(typeof data === "object") {
					respObj = data;
				} else if(typeof data === "string") {
					respObj = data ? eval("(" + data + ")") : null;
				}
			} catch (ex) {
				respObj = {
					error: "1.1",
					messages: [{type: 1, text: commErrorMsg}]
				};
			}

			try {
				BFEngine.a();
				//messages: [{type:1, text: ""}]
				//messages=> 1: error, 2: warning, 3:info, 4: session, 5: validation
				if(respObj && respObj.error != 2 && respObj.messages && respObj.messages.length > 0) {
					if(parseInt(respObj.messages[0].type, 10) == 4) {//Session error
						if(window.CSLoginPopupOpened) {
							if(errorCaller) {
								errorCaller(respObj.messages, {callid: callID});
							}
							return;
						}
						window.CSLoginPopupOpened = true;
						var message = respObj.messages && respObj.messages.length > 0 ? respObj.messages[0].text : undefined;
						if(typeof window.APP_SESSION_EXPIRE_CALLBACK == "function") {
							window.APP_SESSION_EXPIRE_CALLBACK(message);
						} else {
							CSPopupUTILS.Login(message);
						}
						if(errorCaller) {
							errorCaller(respObj.messages, {callid: callID});
						}
						return;
					}

					var appInfoShowMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-messages", moduleName) : undefined;//gibintra=> errorcaller olsa dahi mesajları göster
					var appInfoShowSuccessMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-success-messages", moduleName) : undefined;//keys
					var appInfoShowSysErrorMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-sys-error-messages", moduleName) : undefined;//evdo
					if(config.showMessages !== false &&
						(
							appInfoShowMessages ||
							(
								(respObj.error && !errorCaller) ||
								(!respObj.error && appInfoShowSuccessMessages) ||
								(respObj.error && respObj.error === "1.1" && errorCaller && appInfoShowSysErrorMessages)//evdo için. eğer comm err ise error callback olsa dahi göster
							)
						)
					) {
						var msg = "";
						var details = "";
						var msgType = 1;
						for(var i = 0; i < respObj.messages.length; i++) {
							if(typeof respObj.messages[i] == "string") {
								msg += respObj.messages[i] + "<br/>";
							} else if(respObj.messages[i].text) {
								msgType = respObj.messages[i].type;
								msg += respObj.messages[i].text + "<br/>";
								if(respObj.messages[i].code) {
									details += respObj.messages[i].code + "<br/>";
								}
							}
						}
						if(msg) {
							var notify = getSideDefaults("service-caller-show-messages-notify", moduleName);
							if(notify && (respObj.error == 3 || respObj.type == 3 || (!respObj.error && !respObj.type && msgType == 3))) {	// Info türünde ise.
								var timeout = getSideDefaults("service-caller-show-messages-notify-timeout");
								SIDENavigator.notify(msg, {timeout: timeout});
							} else {
								var errorMsg = (respObj.error && respObj.error != 3) || (msgType && msgType == 1);
								if(details.length > 0) {
									CSPopupUTILS.MessageBox(msg, {detail: true, error: errorMsg}, function (buttonName) {
										if(buttonName === "detail") {
											CSPopupUTILS.MessageBox(details, {title: "Hata Detayı"});
										}
									});
								} else {
									CSPopupUTILS.MessageBox(msg, {error: errorMsg}); //Utility-Business servis ayrımı yapıldığında gözden geçirilmeli
								}
							}
						}
						SIDEUtil.showValidationError(config.bf, respObj.messages);
					}
				}

				if(respObj && respObj.metadata && respObj.metadata.totalCount !== undefined) {
					window.$CS$RowCount = respObj.metadata.totalCount;
				} else if(respObj && respObj.totalCount !== undefined) {
					window.$CS$RowCount = respObj.totalCount;
				} else {
					window.$CS$RowCount = undefined;
				}

				if(respObj && respObj.totalRowSum !== undefined) {
					window.$CS$TotalRowSum = respObj.totalRowSum;
				} else {
					delete window.$CS$TotalRowSum;
				}

				if(respObj) {
					for(obj in respObj) {
						if(obj.indexOf("totalCell") != -1) {
							if(!window.$CS$TotalCellValues) {
								window.$CS$TotalCellValues = {};
							}

							window.$CS$TotalCellValues[obj] = respObj[obj];
						}
					}
				}

				//sonuc istenilen formatta değilse
				if(!respObj) {
					if(thenCaller) {
						thenCaller();//success callback varsa çağır
					}
					return;
				}
				//başarılı ise
				if(!respObj.error) {
					if(thenCaller) {
						try {
							if(listenServicesFlag) {
								listen(path, newJP, respObj, null, callID, config.bf.getBusinessName(), pageName);
							}
						}
						catch (err) {
							console.log("Service dinlenirken hata olustu " + err);
						}
						if(respObj.data){
							thenCaller(respObj.data, respObj.messages, respObj.metadata);//callback varsa çağır
						}
						else{
							thenCaller(respObj);//callback varsa çağır. data keyi yerine farklı formatta gelirse desteklemek için.
						}
					}
					return;
				}

				//başarısız ise
				if(respObj.error) {
					try {
						if(listenServicesFlag) {
							listen(cmd, newJP, respObj, null, callID, config.bf.getBusinessName(), pageName);
						}
					}
					catch (err) {
						console.log("Service dinlenirken hata olustu " + err);
					}

					if(respObj.error == 2) {//Session error
						if(window.CSLoginPopupOpened) {
							errorCaller(respObj.messages, {callid: callID});
							return;
						}
						window.CSLoginPopupOpened = true;
						var message = respObj.messages && respObj.messages.length > 0 ? respObj.messages[0].text : undefined;
						if(typeof window.APP_SESSION_EXPIRE_CALLBACK == "function") {
							window.APP_SESSION_EXPIRE_CALLBACK(message);
						} else {
							CSPopupUTILS.Login(message);
						}
						if(errorCaller) {
							errorCaller(respObj.messages, {callid: callID});
						}
						return;
					}
					if(errorCaller) {//kullanıcı callback vermişse
						if(typeof errorCaller === 'function') {//if callback is func
							errorCaller(respObj.messages, {callid: callID});
						} else if(typeof(errorCaller) === 'string') {//if callback is String
							//							csdu.hataMesaji(errorCaller);
						}
					} else {//kullanıcı callback vermemişse
						if(respObj.messages) {//mesajlar varsa mesajları göster
							SIDEUtil.showValidationError(config.bf, respObj.messages);
						} else {//mesaj yoksa varsayılan mesajı göster.
							//							csdu.hataMesaji(commErrorMsg);
						}
					}
					return;
				}
			} finally {
				BFEngine.r();
			}

		};

		function error(jqXHR, textStatus, errorThrown) {
			if(progressBar) {
				progressBar.close();
			}
			if(config.maskBF && config.maskBF.unmask) {
				config.maskBF.unmask();
			}
			try {
				BFEngine.a();
				console.error("An error was happened during Ajax call. cmd: " + path + " url: " + (config ? config.url : "") + " Exc: " + (errorThrown ? errorThrown.toString() : ""));
				if(errorCaller) {//kullanıcı callback vermişse
					var appInfoShowSysErrorMessages = window.getSideDefaults ? window.getSideDefaults("service-caller-show-sys-error-messages", moduleName) : undefined;//evdo
					if(appInfoShowSysErrorMessages) {
						CSPopupUTILS.MessageBox(commErrorMsg, {error: true});
					}
					if(typeof errorCaller === 'function') {//if callback is func
						errorCaller(commErrorMsg, {callid: callID, thrown: errorThrown});
					} else if(typeof(errorCaller) === 'string') {//if callback is String
						CSPopupUTILS.MessageBox(errorCaller, {error: true});
					}
				} else {//kullanıcı callback vermemişse
					if(jqXHR.status == 404) {
						CSPopupUTILS.MessageBox(commErrorMsg, {error: true});
					}
					if(jqXHR.status == 500 || jqXHR.status == 502) {
						CSPopupUTILS.MessageBox(errorMsg, {error: true});
					}
				}
			} finally {
				BFEngine.r();
			}
		};

		//data["sideParams"] = sideParams;
		var data;
		if(parameters["formData"]){
			data = new FormData();
			var formDataKeys = Object.keys(parameters["formData"]);
			for(var keyIndex = 0; keyIndex < formDataKeys.length; keyIndex++){
				var keyName = formDataKeys[keyIndex];
				data.append(keyName,parameters["formData"][keyName]);
			}
		}
		var ajaxParams = {
			url: config.url + path,
			type: parameters.method,
			//dataType: "multipart/form-data",
			//dataType: config.dataType,
			cache: false,
			processData: false,
			beforeSend: function(xhr){
				for(var headerKey in paramObject.header){
					xhr.setRequestHeader(headerKey, paramObject.header[headerKey]);
				}
			},
			enctype: 'multipart/form-data',
			contentType: "application/json",
			crossDomain: true,
			data: JSON.stringify(data)
		};

		if(parameters.method == "GET"){
			delete ajaxParams["data"];
		}

		if(parameters["formData"]){
			ajaxParams["data"] = data;
			ajaxParams["contentType"] = false;
		}

		if(!paramObject.header){
			delete ajaxParams["beforeSend"];
		}

		/*if(config.timeout) {
			ajaxParams.timeout = config.timeout;
		}*/

		$.ajax(ajaxParams).success(success).error(error);


		return {
			then: function (callback) {
				thenCaller = callback;
				return this;
			},
			error: function (callback) {
				errorCaller = callback;
				if(!isValid && errorCaller && typeof errorCaller === 'function') {
					try {
						BFEngine.a();
						errorCaller([{type: 4, text: "Validation error."}]);
					} finally {
						BFEngine.r();
					}
				}
				return this;
			}
		};

	};


	this.init();
}
CSCaller = new ServiceCaller();
SCaller = CSCaller;



//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);/**
 * @author hakand
 * bu sınıf side nin kendi ihtiyacı olan ml gereksinimleri için var. Bc, util ve core kısımda kullanılan kullanıcı mesajları ve bileşenlere ait gerekli yerlerde kullanılır.
 */
function SideMLManagerClass(lang){
	
	function init(callback){
		var pathPrefix;
		if(CSSession.getEnv() == "designer" || CSSession.getEnv() == "dev" || CSSession.getEnv() == "dashboard"){
			pathPrefix = "core/multi-lang/ml-map-";
		}else{	//runtime
			pathPrefix = "side-data/ml/ml-map-";
		}
		
		var url = SideModuleManager.getResourceUrl(SideModuleManager.getLocalModuleName(), pathPrefix+sideLang+".js");
		url += "?v=" + SIDEUtil.getSideVersion();
		SIDEUtil.loadJS(url, function(err){
			if(err)
				return callback && callback(err);

			//burada proje bileşenlerinin ml ile ilgili ilklendirmeleri yapılır.
			if($.datepicker){
				$.datepicker.setDefaults( $.datepicker.regional[ CSSession.getLang() ] );//csc-calendar lang settings
			}
			if($.timepicker){
				$.timepicker.setDefaults( $.timepicker.regional[ CSSession.getLang() ] );//csc-datetime lang settings
			}

			return callback && callback(err);
		})
	}
	
	function get(args){
		var key = args[0];
		var argIndex = 1;
		if(typeof key === "object"){//ilk parametre bc ise
			key = key.typeName;
			key += "."+args[1];
			argIndex = 2;
		}
		
		var val = SideMLMap[key];
		if(!val){
			console.error("[SideMLManager] Requested mapping not found: lang:"+ sideLang+ ", key:"+key);
			return "";
		}

		if(args.length > argIndex){
			for(var i=argIndex; i<args.length;i++){
				val = val.replace("{"+(i-argIndex)+"}", args[i]);
			}
		}
		
		return val;
	}
	
	//TODO: adaptor.jsp ?

	return {
		init: function(callback){
			init(callback);
		},
		get: function(){
			return get(arguments);
		},
	};
}//~~

var BF_ENGINE_DEBUG_ENABLED = 0;
var required3Libs = [];

function BFEngine() {

	this.definitionMap = {};
	this.instanceMap = {};
	this.modules = [];
	this.eagerLoadedList = [];//eager load yapılan tanımların listesini tutar. load yaparken parametre olarak gönderilir.

	this.BaseBFMap = {};
	this.NonBusinessDefs = {};//NonBusiness tanımların runtime'da base tanımları

	this.stackTrack = 0;
	this.renderStack = [];
	this.lazyRendereds = {};//ctx.name şeklinde string dizisi
	this.bindedLazyEvents = [];//bf dizisi
	this.focused;
	this.otherModuleDepends = {};// {moduleName: {defNames: ["PG_XX"], dependents:["aa.PG_DEP"}} formatında

	this.init = function(){
		window.onresize = function() {
			window.BFEngine.DRL(window.BFEngine.root);
		};
	};

	this.markModule = function(module){
		this.markedModule = module;
	};
	this.unmarkModule = function(){
		this.markedModule = null;
	};
	/**
	 * Yeni bir tipi context'e ismi ile kaydeder. Bir tipin birden fazla
	 * versiyonu olabilir. Tipleri dizide tutar. Dizi elemanlari versiyon
	 * alanina gore sirali tutulur.
	 */
	this.register = function(businessName, definition) {
		var moduleNameFor3Libs;

		if(businessName.indexOf(".") < 0 && this.markedModule){
			moduleNameFor3Libs = this.markedModule;
			businessName = this.markedModule+"."+businessName;
		}
		var module;
		if(businessName.indexOf(".") > 0){
			var found = false;
			module = businessName.substring(0, businessName.indexOf("."));
			for(var i=0; i<this.modules.length ;i++){
				if(this.modules[i] === module){
					found = true;
					break;
				}
			}
			if(!found){
				this.modules.push(module);
			}
		}

		moduleNameFor3Libs = module;
		required3Libs = $.unique(required3Libs.concat(SLibraryLoader.get3LibDepsOfBf(definition, moduleNameFor3Libs)));

		if (!definition.METHODS) {
			definition.METHODS = [];
		}
		var methods = definition.METHODS;
		var events = definition.EVENTS || [];

		definition.BF_NAME = businessName;

		var registereds = this.definitionMap[businessName];
		if (!registereds) {
			registereds = [];
		}
		if(definition.BY == "Designer"){//Designer'da versiyon tutma
			registereds = [];
		}
		if(definition.DEPENDS){
			var omd = window.__otherModuleDepends;
			for(var i=0; i<definition.DEPENDS.length ;i++){
				var depDef = this.getDefinition(definition.DEPENDS[i]);
				if(!depDef){
					var splited = definition.DEPENDS[i].split(".");
					var depModule = splited[0];
					var depDefName = splited[1];
					if(!omd[depModule]){
						omd[depModule] = {
							defNames: [],
							dependents: []
						};
					}
					if(omd[depModule].defNames.indexOf(depDefName) < 0){
						omd[depModule].defNames.push(depDefName);
					}
					if(omd[depModule].dependents.indexOf(businessName) < 0){
						omd[depModule].dependents.push(businessName);
					}
				}
			}
		}

		if (!definition.Business) {
			definition.Business = function () {
			};// Boş BF tanımı
		}

		var bf = definition.Business;
		var bcName = definition.BC_REF || definition.SCR.layout;
		var bcDef = BCEngine.getDefinition(bcName, module);
		var bfBaseClass = definition.SCR.BF_BASE || bcDef.BaseBF;
		var base = this.BaseBFMap[bfBaseClass];
		var baseInstance = eval("new " + base + "()");
		bf.prototype = baseInstance;
		bf.prototype.definition = definition;

		wrapBC(definition, bf, baseInstance);// BC Wrapping
		// TODO mahmuty burada aynı versiyon varsa ezilmeli
		registereds.push(definition);
		registereds = _.sortBy(registereds, function (definition) {
			return definition.VERSION;
		});
		this.definitionMap[businessName] = registereds;
		if (definition.BY !== "Designer") {
			if (definition.CSS) {
				$$.createStyle(definition.CSS, {id: businessName + "-CSS"}, "side-bf-css-end");
			}
		}
	};

	/**
	 * BC metodlarının BF'ye yedirilmesi. BC tarafından dışarıya açılan
	 * metodları (BF'de yada BF'nin base'inde tanımlı değilse) BF'de
	 * oluşturur. BF'de oluşan metod BC'deki orjinal metodu gelen
	 * parametrelerle birlikte çağırır.
	 */
	var wrapBC = function(definition, bf, baseInstance) {
		function wrapBC(bcMethod) {
			bf.prototype[bcMethod] = function() {
				return this.bcRef[bcMethod].apply(this.bcRef, arguments);
			};
		}
		var bcName = definition.BC_REF || definition.SCR.layout;
		var moduleName = null;
		if(definition.BF_NAME.indexOf(".") > 0){
			moduleName = definition.BF_NAME.substring(0, definition.BF_NAME.indexOf("."));
		}
		var bcDef = BCEngine.getDefinition(bcName, moduleName );
		if(bcDef.BaseBF == "TABULAR" || bcDef.BaseBF == "DYN-TABULAR"){
			definition.isTabular = true;
		}

		for ( var i = 0; bcDef.METHODS && i < bcDef.METHODS.length; i++) {
			var bcMethod = stringTrim(bcDef.METHODS[i]);
			if(bcMethod.indexOf('(') > 0){
				bcMethod = stringTrim(bcMethod.substring(0, bcMethod.indexOf('(')));
			}
			if (isInIt(definition.METHODS, bcMethod)) {
				continue;// BF'de overwrite eden bir metod var
			}
			if (baseInstance[bcMethod]) {
				continue;// BF Base'de overwrite eden bir metod/property var
			}
			wrapBC(bcMethod);
		}
	};

	this.wrapBusiness = function(business, config) {
		var defaults = business.definition.SCR || {};
		config = config || {};
		csDefaults(config, defaults);
		if(!config.validation){
			config.validation = {};
		}

		var type = null;
		if (business.definition.BC_REF) {
			type = BCEngine.createType(business.definition.BC_REF, config, business);
			business.bcRef = type;
		} else {
			type = BCEngine.createType(config.layout, config, business);
			business.bcRef = type;
		}
		this.debug("Object wrapped: " + business.$CS$.name);
	};

	this.isNonBusiness = function(business){
		return business.$CS$.definition.NON_BUSINESS === true;
	};

	this.overwriteBusinessMethod = function(business, method){
		business["$$$"+method] = business[method];
		business[method] = function(){
			BFEngine.overwriteBusinessMembers(business, business);
		}
	};

	this.getDefinitionOfNonBusiness = function(bcName, moduleName){
		if(this.NonBusinessDefs[bcName]){
			return this.NonBusinessDefs[bcName];
		}

		var bfDef = function(){};
		function wrapBC(bcMethod) {
			bfDef.prototype[bcMethod] = function() {
				return this.bcRef[bcMethod].apply(this.bcRef, arguments);
			};
		}

		var bcDef = BCEngine.getDefinition(bcName, moduleName );
		if(bcDef.BaseBF == "BASIC"){
			bfDef.prototype = new BaseBF();
		} else if(bcDef.BaseBF == "CONTAINER" || bcDef.BaseBF == "DYN-CONTAINER"){
			bfDef.prototype = new BaseDynamicContainer();
		} else if(bcDef.BaseBF == "NON-BUSINESS"){
			bfDef.prototype = new BaseNonBusiness();
		} else if(bcDef.BaseBF == "TABULAR" || bcDef.BaseBF == "DYN-TABULAR"){
			bfDef.prototype = new BaseDynamicTabular();
		}

		for ( var i = 0; bcDef.METHODS && i < bcDef.METHODS.length; i++) {
			var bcMethod = stringTrim(bcDef.METHODS[i]);
			if(bcMethod.indexOf('(') > 0){
				bcMethod = stringTrim(bcMethod.substring(0, bcMethod.indexOf('(')));
			}
			if (bfDef.prototype[bcMethod]) {
				continue;// BF Base'de overwrite eden bir metod/property var
			}
			wrapBC(bcMethod);
		}

		this.NonBusinessDefs[bcName] = bfDef;
		return bfDef;
	};

	this.create = function(bfInfo, ctx, initParams, isinner, eventsToBind) {
		var bfName = bfInfo.BF || "UNNAMED_BF", childDef, childBf, module;
		if(bfName.indexOf(".") > 0){
			module = bfName.substring(0, bfName.indexOf("."));
		} else {
			module = bfInfo.pmodule;
		}
		if(!module && bfInfo.parent){
			module = this.getModuleName(bfInfo.parent)
		}
		var definition = bfInfo.def || this.getDefinition(bfName, bfInfo.version);
		var context = {engine: this};
		if(!definition){
			throw new Error("Definiton bulunamadi: " + bfName);
		}
		var business = new definition.Business();
		business.$CS$ = {};// Özel bilgiler için scope
		business.$CS$.name = bfInfo.name;
		business.$CS$.definition = definition;
		business.$CS$.CTX = ctx;
		business.$CS$.parent = bfInfo.parent;
		if(bfInfo.inDesigner){
			business.$CS$.inDesigner = true;
		}
		if(bfInfo.def){
			business.definition = definition;
		}
		if(bfInfo.intabular){
			business.$CS$.intabular = bfInfo.intabular;
		}
		if ((window.csd || window.csdTestScreen) && ctx) {
			this.instanceMap[ctx+"."+bfInfo.name] = business;
		}
//		try {
			this.wrapBusiness(business, bfInfo.config);
		// } catch (ex) {
		// 	if (!ex.scope) {
		// 		throw ex;
		// 	}
		// 	console.log(ex.scope + ": " + ex.Ex);
		// 	console.log(ex);
		// 	return null;
		// }
		business.members = {};
		if(definition.isTabular){
			business.tmembers = [];
		}

		// TODO mahmuty tabular için değişiklik yapılacak
		if (definition.MEMBERS) {
			var childCtx = null;
			if(!ctx){
				childCtx = bfInfo.name;
			} else {
				childCtx = ctx + "." + bfInfo.name;
			}
			for ( var memberName in definition.MEMBERS) {
				var memInfo = definition.MEMBERS[memberName];
				var childDyn = false, clazz=null;
				if(typeof memInfo == "string"){
					clazz = definition.MEMBERS[memberName];
					if(clazz.charAt(0) == "#"){
						if(bfInfo.inDesigner){
							clazz = clazz.substring(1);
							childDyn = true;
						}else{
							if(!bfInfo.inDesigner) {
								continue;
							}
						}
					}
				} else {
					if(memInfo.isDyn){
						continue;
					}
				}
				if(module && clazz && clazz.indexOf(".")<0){
					clazz = module+"."+clazz;
				}
				childBf = {
					name : memberName,
					BF : clazz,
					parent : business,
					pmodule: module,
				};
				if(bfInfo.tabular){
					childBf.tabular = bfInfo.tabular;
				}
				if(bfInfo.intabular){
					childBf.intabular = bfInfo.intabular;
				}
				if(bfInfo.inDesigner){
					childBf.inDesigner = true;
				}
				if(typeof memInfo == "string"){
					childDef = this.getDefinition(clazz);
				} else {
					childDef = {
						BF_NAME: "_NB",
						NON_BUSINESS: true
					};
					var layout = null;
					if(bfInfo.config && bfInfo.config.memberConfig && bfInfo.config.memberConfig[memberName]){
						layout = bfInfo.config.memberConfig[memberName].layout;
					}
					if(memInfo.MEMBERS){//non-business container
						childDef.MEMBERS = memInfo.MEMBERS;
						childDef.Business = BaseContainer;
						childDef.SCR =  {layout: layout || memInfo.bcName};
					} else {//non-business entity
						childDef.BC_REF =  layout || memInfo.bcName;
					}
					childDef.isTabular =  BCEngine.isTabular(layout || memInfo.bcName, module);
					childBf.def = childDef;
					childDef.Business = this.getDefinitionOfNonBusiness(layout || memInfo.bcName, module);
				}

				if(bfInfo.tabular){
					if(childDef.SCR && childDef.SCR.layout == "CSC-POPUP"){
						var names = [memberName];
						var parent = business;
						var bfInRow;
						while(!parent.$CS$.definition.isTabular){
							if(this.isNonBusiness(parent)){
								bfInRow = parent;
							}
							names.push(parent.$CS$.name);
							parent = parent.$CS$.parent;
						}
						if(bfInRow){

						}
						var childPath = "";
						for(var i=names.length-1; i>= 0 ;i--){
							childPath += names[i];
							if(i!=0){
								childPath += ".";
							}
						}
						var oteki = this.get(childPath, parent);
						business.members[memberName] = oteki;
						business[memberName] = oteki;
						continue;
					}
					//ah mahmut abi ah
					if(business.$CS$.definition.NON_BUSINESS){
						childBf.config = csCloneObject(this.get(memberName, bfInfo.tabular).getConfig(), true);
					} else {
						childBf.config = this.getMemberConfig(business.getConfig(), memberName, childDef.NON_BUSINESS);
						delete childBf.tabular;
					}
					//childBf.config = this.getMemberConfig(business.getConfig(), memberName, childDef.NON_BUSINESS);
				} else {
					if(!childDef)
						console.log("null class: " + clazz);
					else
						childBf.config = this.getMemberConfig(business.getConfig(), memberName, childDef.NON_BUSINESS && !childDef.isTabular);
				}
				if(childBf && childBf.config && childBf.config.id){
					delete childBf.config.id;//clonlanmışlar id'yi sil çok önemli
				}
				var clonedMemberConfig;
				if(definition.isTabular && childDef && !childDef.BC_REF && childBf.config && childBf.config.memberConfig){
					clonedMemberConfig = csCloneObject(childBf.config.memberConfig, true);
				}
				var member = this.create(childBf, childCtx, undefined, true);
				if(childDyn){//designer için
					member.$CS$.isDyn = true;
				}
				if(clonedMemberConfig){
					member.getConfig().memberConfig = clonedMemberConfig;
				}
				business.members[memberName] = member;
				if(!business[memberName]){//metod yada property'yi ezme
					//TODO mahmuty burada(tersinde) exception da fırlatılabilir
					business[memberName] = member;
				}

				this.setInnerMembers(business, member);

				//member init
				if (member.bcRef.init) {
					member.bcRef.init();
				}
				if (member.init) {
					member.init();
				}
				if(member.$CS$.nonBuss){
					this.setInnerMembers(business, member);
					this.setMembersToParent(member);
				}
			}
		}

		this.setMembersToParent(business);
		if(!isinner){//business init
			if (business.bcRef.init) {
				business.bcRef.init();
			}
			if (business.init) {
				business.init();
			}
			this.fireOnInitEvents(business, initParams);
		}
		if(eventsToBind){
			var binding;
			for(var i=0; i<eventsToBind.length ;i++){
				binding = eventsToBind[i];
				business.on(binding.name, binding.bindObj, binding.callback);
			}
		}
		return business;
	};

	this.addDynamicEvent = function(business, fullpath, eventName, callback){
		var parts = fullpath.split(".");
		var parent = business, path="", dynMember;
		for(var i=0; i<parts.length ;i++){
			if(!parent.members[parts[i]]){
				dynMember = parts[i];
				for(var j=i+1; j<parts.length ;j++){
					path += parts[j];
					if(j != parts.length-1){
						path += ".";
					}
				}
				break;
			}
			parent = parent.members[parts[i]];
		}
		if(!path){
			path = "this";
		}
		if(!parent.$CS$.dynBindings){
			parent.$CS$.dynBindings = {};
		}
		if(!parent.$CS$.dynBindings[dynMember]){
			parent.$CS$.dynBindings[dynMember] = [];
		}
		parent.$CS$.dynBindings[dynMember].push({path: path, event: eventName, callback: callback, bind: business});
	};

	this.destroy = function(business, onlybc){
			// if(onlybc !== true && this.instanceMap){
//			delete this.instanceMap[business.$CS$.CTX +"."+business.$CS$.name];
			// }
		if(business instanceof CSDGridRow){
			var row = business;
			for(var mname in row.members){
				this.destroy(row.members[mname], onlybc);
			}
			if(onlybc === true){
				return;
			}
			for(var prop in row){
				row[prop] = null;
			}
		} else {
			for(var mname in business.members){
				if(onlybc && business.members[mname].getTypeName() == "CSC-POPUP"){
					continue;
				}
				this.destroy(business.members[mname], onlybc);
			}
			if(business.tmembers && business.tmembers.length && !inDesigner(business)){
				for(var i=0; i<business.tmembers.length ;i++){
					this.destroy(business.tmembers[i], onlybc);
				}
				if(onlybc !== true){
					business.tmembers = [];
				}
			}
			if(onlybc !== true){
				if(business.$$destroy){
					business.$$destroy();
				}
				if(business.$CS$ && business.$CS$.gbeBinding){//Bir global eventi dinliyorsa unbind et
					GlobalBusinessEvents.destroy(business);
				}
					business.$CS$ = null;
			}
			if(business.bcRef.destroybc){
				business.bcRef.destroybc(onlybc);
			}
		}
	};

	/**
	 * Panel gibi bir non-business container'ın member'larının üst business atasına set edilmesini sağlar.
	 * Üst ata create işleminden sonra çağrılır.
	 * @param business - ata container
	 * @param member - non-business container
	 */
	this.setInnerMembers = function(business ,member){
		if((!member.$CS$.definition.NON_BUSINESS && !member.$CS$.nonBuss) || member.isTabular()){
			return;
		}
		for(var memberName in member.members){
			if(member.members[memberName].$CS$.definition.NON_BUSINESS && !member.members[memberName].isTabular()){
				this.setInnerMembers(business, member.members[memberName]);
			} else {
				if(business[memberName]){
					console.warn("Business " + business.getBusinessName() + " allready has a method or member with name: " + memberName);
					continue;//metod yada property'yi ezme
				}
				business[memberName] = member[memberName];
			}
		}
	};

	/**
	 * Panel gibi non-business container'ın member'larının üst atalarına set edilmesine sağlar.
	 * Panel create işleminden sonra çağrılır.
	 *
	 * setInnerMembers'tan farklı olarak dinamik kullanımlar için anlamlı (yani panel dimaik olarak klonlanıyorsa setInnerMembers çağrılmaz).
	 * @param business
	 */
	this.setMembersToParent = function(business){
		if(!business.members || (!business.$CS$.definition.NON_BUSINESS && !business.$CS$.nonBuss) || business.isTabular()){
			return;
		}
		var parent = business.$CS$.parent;
		while(parent){
			if((!parent.$CS$.definition.NON_BUSINESS && !parent.$CS$.nonBuss) || parent.isTabular()){
				for(var memName in business.members){
					if(parent[memName]){
						continue;//metod yada property'yi ezme (büyük ihtimalle setInnerMembers'ta set edildi)
					}
					parent[memName] = business.members[memName];
				}
				break;
			}
			parent = parent.$CS$.parent;
		}
	};

	this.applyMemberConfig = function(mainBF, bpath, configKey, configValue, setto, renderReq){
		if(!bpath){
			if(setto){
				configKey = setto+"."+configKey;
			}
			mainBF.setConfig(configKey, configValue, true);
			return;
		}
		//Apply new value to definition
		var bfDef = mainBF.$CS$.definition, defConfig = bfDef.SCR;
		defConfig.memberConfig = defConfig.memberConfig || {};
		defConfig.memberConfig[bpath] = defConfig.memberConfig[bpath] || {};
		if(setto){
			defConfig.memberConfig[bpath][setto] = defConfig.memberConfig[bpath][setto] || {};
			defConfig.memberConfig[bpath][setto][configKey] = configValue;
			configKey = setto+"."+configKey;
		} else {
			defConfig.memberConfig[bpath][configKey] = configValue;
		}

		var pathArr = bpath.split(".");
		var bf=mainBF;
		function toBussPath(arr, i){
			var result = arr[i];
			for(i++; i<arr.length ;i++){
				result += "." + arr[i];
			}
		}
		for(var i=0; i<pathArr.length ;i++){
			bf = BFEngine.get(pathArr[i], bf);
			if(i==pathArr.length-1){//Last item is our target bf
				if(configValue === undefined){
					defConfig = bf.$CS$.definition.SCR;
					if(defConfig){
						configValue = defConfig[configKey];
					}
				}
				bf.setConfig(configKey, configValue, renderReq === false ? false : true);
			} else {
				bpath = toBussPath(pathArr, i+1);
				if(configValue === undefined){
					defConfig = bf.$CS$.definition.SCR;
					if(defConfig && defConfig.memberConfig){
						configValue = defConfig.memberConfig[configKey];
					}
				}
			}
		}
	};

	this.applyMemberConfigOLD = function(mainBF, memConfigs, business, path){
		if(path === undefined || path === null || path == ""){
			return;
		}
		this.getMemberConfig(mainBF.getConfig(), path);//Delete member config info
		
		var config = memConf[path];//this.getMemberConfig(mainBF.getConfig(), path);
		var ref = business.bcRef;
		if(!config){
			return;
		}

		for(var prop in config){
			var item = config[prop];
			var refitem = ref.config[prop];
			if(item != null && typeof item == "object"){
				if(!refitem){
					ref.config[prop] = {};
					refitem = {};
				}
				for(var innerProp in item){
					var innerItem = item[innerProp];
					if(innerItem == null || typeof innerItem == "undefined"){
						var parts = path.split(".");
						if(parts.length > 1){
							var childDef = csd.defNodeMap[csd.defNodeMap[mainBF[parts[0]].$CS$.id].classRefId];
							this.applyMemberConfig(mainBF[parts[0]], childDef.config.memberConfig, business, path.substring(path.indexOf(".")+1));
						} else {
							refitem[innerProp] = undefined;
						}
					} else {
						refitem[innerProp] = innerItem;
					}
				}
			} else if(item == null || typeof item == "undefined"){
				var parts = path.split(".");
				if(parts.length > 1){
					var childDef = csd.defNodeMap[csd.defNodeMap[mainBF[parts[0]].$CS$.id].classRefId];
					this.applyMemberConfig(mainBF[parts[0]], childDef.config.memberConfig, business, path.substring(path.indexOf(".")+1));
				} else {
					ref.config[prop] = undefined;
				}
			} else {
				ref.config[prop] = item;
			}
		}

	};

	this.getModuleName = function(bf){
		var bfname = bf.$CS$.definition.BF_NAME;
		if(bfname == "_NB"){
			return this.getModuleName(bf.getParent());
		}
		return bfname.substring(0, bfname.indexOf("."));
	};

	this.removeScope = function(scopeName){
		if(this.instanceMap[scopeName]){
			delete this.instanceMap[scopeName];
		}
	};

	this.getMemberConfig = function(config, member, isUtildef, deleteConfig) {
		if (!config || !config.memberConfig) {
			return {};
		}
		var memberConfig = config.memberConfig;
		if(isUtildef){
			for(var prop in memberConfig) {
				if (prop == member) {
					var newConfig = csCloneObject(memberConfig[prop], true);
					if(deleteConfig !== false){
						delete memberConfig[prop];
					} else {
						memberConfig = csCloneObject(memberConfig, true);
					}
					newConfig.memberConfig = memberConfig;
					return newConfig;
				}
			}
			return {memberConfig: memberConfig};
		}
		var memConf = {};
    if(memberConfig[member]){
      csExtend(memConf, memberConfig[member]);
      if(deleteConfig !== false){
        delete memberConfig[prop];
      }
    }
		for (var prop in memberConfig) {
			if (startsWith(prop, member + ".")) {
				var propName = prop.substring((member + ".").length);
				memConf.memberConfig = memConf.memberConfig || {};
				memConf.memberConfig[propName] = csExtend(memConf.memberConfig[propName] || {}, memberConfig[prop]);
			}
		}
		return memConf;
	};
	this.cloneMemberConfigFromTabular = function(config, member, nonBusiness) {
		var memberConfig = config.memberConfig;
		if(nonBusiness){
			console.dir(memberConfig);
			return csCloneObject(memberConfig, true);
		}
		var clone = {};
		for ( var prop in memberConfig) {
			if (startsWith(prop, member + ".")) {
				var propName = prop.substring((member + ".").length);
				clone[propName] =  csCloneObject(memberConfig[prop], true);
			}
		}
		return clone;
	};

//		this.getDefinition = function(name, version, callback) {
//			this.debug("Type requested public: " + name);
//			var registereds = getRegisteredBFs(name);
//
//			var getDefCallback = function(){
//				var bf = getDefinition(name, version);
//				callback(bf);
//			};
//
//			if (!registereds) {
//				this.loadDefinition(name, version, getDefCallback);
//			}else{
//				getDefCallback();
//			}
//		};


	this.getRegisteredBFs = function(name) {
		var registereds = this.definitionMap[name];

		if (!registereds) {
			for(var i=0; i<this.modules.length ;i++){
				registereds = this.definitionMap[this.modules[i]+"."+name];
				if(registereds){
					break;
				}
			}
		}
		return registereds;
	};
//
	this.getDefinition = function(name, version) {
		this.debug("Type requested : " + name);
		var registereds = this.getRegisteredBFs(name);

		if (!registereds) {
			this.debug("Registered type definition not found: " + name);
			return null;
		}
		if (version) {
			for ( var i = 0; i < registereds.length; i++) {
				if (registereds[i].VERSION == version) {
					return registereds[i];
				}
			}
			return null;
		}
		return registereds[registereds.length - 1];// en sonuncu en son versiyon
	};

	this.clearModuleDefs = function(moduleName){
		for(var name in this.definitionMap){
			if(name.indexOf(moduleName) == 0){
				this.definitionMap[name] = null;
			}
		}
	};

	this.getDefinitionTree = function(name, version, passNonBusiness) {
		var result = {};
		var def = this.getDefinition(name, version);
		if(!def){
			return;
		}
		result.bfName = def.BF_NAME;
		result.nonBusiness = def.NON_BUSINESS === true;
		result.members = [];
		if(def.MEMBERS){
			for(var mname in def.MEMBERS){
				var innerBF = def.MEMBERS[mname],innerDef;
				innerDef = this.getDefinitionTree(innerBF,null,passNonBusiness);
				innerDef.name = mname;
				result.members.push(innerDef);
			}
		}
		return result;
	};

	this.printDefinition = function(name) {
		var def = this.getDefinition(name).Business;
		console.dir(new def());
	};

	this.isLoaded = function(bfname) {
		if(bfname.indexOf(".") < 0){
			bfname = CSSession.getModuleName() +"."+ bfname;
		}
		var def = this.getDefinition(bfname);
		if(def != null){
			return true;
		}
		return false;
	};

	this.loadDefinition = function(bfnames, params, options, callback) {
		if(!callback && typeof options == "function"){
			callback = options;
			options = {};
			params = params ? params : {};
		}
		if(!callback && typeof params == "function"){
			callback = params;
			options = {};
			params = {};
		}
		if(!Array.isArray(bfnames)){
			bfnames = [bfnames];
		}

		var moduleName = bfnames[0].substring(0, bfnames[0].indexOf("."));

		if(!moduleName || moduleName == ""){
			moduleName = SModuleManager.getLocalModuleName();
		}

		var module = SModules[moduleName];

		if(!SModuleManager.isModuleLoaded(moduleName)){
			var that = this;
			SModuleManager.loadModule(moduleName, function(){
				that.loadDefinition(bfnames, params, callback);
			});
			return;
		}

		var sourceModule = moduleName && SModules[moduleName] ? SModules[moduleName].clonedFrom : undefined;
		var notfoundbfs = [];

		for(var i=0; i<bfnames.length; i++){
			if(!params.force){//force -> tekrar load etmeye zorla
				if(bfnames[i].indexOf(".") < 0){
					bfnames[i] = CSSession.getModuleName() +"."+ bfnames[i];
				}
				var def = this.getDefinition(bfnames[i]);
				if(def != null && !sourceModule){
					console.log("[BFEngine][loadDefinition] already loaded. bfname:"+bfnames[i]);
					continue;
				}
			}
			notfoundbfs.push(bfnames[i]);
		}
		if(notfoundbfs.length == 0){
			if(callback){
				callback(null, true);
			}
			return;
		}

		//kullanıcı kodunu bul
		var userid = "";
		if(["dev","designer","dashboard"].indexOf(SSession.getEnv()) < 0){
			userid = SSession.getUserId();
		}else{
			userid = NUser.getUserid();
			if(!userid){
				throw "[BFEngine] [loadDefinition] Userid not found!";
			}
		}

		// Kaynak Modül tespit ediliyor.
		var returnModuleAs;
		if(sourceModule){
			returnModuleAs = moduleName;
			moduleName = sourceModule;
			for(var i=0; i<notfoundbfs.length ;i++){
				if( notfoundbfs[i].indexOf(".") != -1 && notfoundbfs[i].indexOf(returnModuleAs) == 0 ){
					notfoundbfs[i] = moduleName+notfoundbfs[i].substring(notfoundbfs[i].indexOf("."), notfoundbfs[i].length);
				}
			}
		}

		var me = this;

		//sunucudan ilgili tanıma ait BF tanımlarını(bağımlılıklar dahil) getir.
		var serviceName = "SIDE.GET_EAGER_BF_DEFS";
		var url = SideModuleManager.getSideUrl(moduleName) || NConsts.MSE_TEST_SCREEN;

		console.log("call:" + notfoundbfs[0]);
		CSCaller.call(
			serviceName,
			{
				userid: userid,
				bfnames: notfoundbfs,
				loadedList: options.clean ? [] : me.eagerLoadedList,
				params: params,
				resourceBundleLang: CSSession.getLang() || "tr",
				returnModuleAs: returnModuleAs
			},
			{url: url, pm: module.pm}
		).then(function(data){
			console.log("[BFEngine][loadDefinition] service call achieved.");
			if(!params.force){
				me.eagerLoadedList = me.eagerLoadedList.concat(notfoundbfs);
			}
			var omd = {};
			window.__otherModuleDepends = omd;
			SIDEUtil.loadJSContent(data.bfscript);
			if(!SUtil.isEmpty(omd)){
				console.log("xxx----");
				console.dir(notfoundbfs);
				console.dir(window.__moduleDepends);
			}
			if(data.rfDeleteList && data.rfDeleteList.length > 0){
				SRefDataManager.removeSideRefdata(data.rfDeleteList);
			}

			SAsync.series([
				function(next){
					if(required3Libs && required3Libs.length){
						required3Libs = SLibraryLoader.sort3LibNamesByOrder(required3Libs, moduleName);
						SAsync.map(
							required3Libs,
							function (lib, flow) {
								SLibraryLoader.loadLib(lib, undefined, { serieLoad: true, module: moduleName}, flow);
							},
							next
						);
					} else {
						next();
					}
				},
				function (next) {
					//appRefDepMap sideRefDepMap
					if((data.appRefDepList && data.appRefDepList.length > 0) || (data.sideRefDepList && data.sideRefDepList.length > 0)){
						SAsync.parallel([
							function (flow) {
								if(data.appRefDepList && data.appRefDepList.length > 0){
									SRefDataManager.requestRefData(false, data.appRefDepList, flow, moduleName);
								} else {
									flow();
								}
							},
							function (flow) {
								if(data.sideRefDepList && data.sideRefDepList.length > 0){
									SRefDataManager.requestRefData(true, data.sideRefDepList, flow, moduleName);
								} else {
									flow();
								}
							}
						], function (err) {
							if(err){
								next(err);
							} else {
								try {
									me.a();
									next();
								} finally {
									me.r();
								}
							}
						});
					} else {
						next();
					}
				},
				function (next) {
					if(!SUtil.isEmpty(omd)){
						console.log("There is other module dependency, requesting dependencies.");
						BFEngine.loadDependencies(omd, function(err){
							if(err){
								next(err);
							} else {
								next();
							}
						});
					} else {
						next();
					}
				}
			], function(err){
				callback(err, data);
			});
		}).error(function(data){
			//TODO #mahmuty burası önemli
			var msg = typeof data === "string" ? data : (data && data[0] && data[0].text) || "";
			var err = "[BFEngine][loadDefinition] service call failed. " + msg;
			callback(err);
		});
	};
	/**
	 * Loads other module dependencies
	 * omd format: {defNames: [],	dependents: []};
	 */
	this.loadDependencies = function(omd, callback){
		var moduleRequests = [];
		for(var moduleName in omd){
			moduleRequests.push(moduleName);
		}
		SAsync.parallelMap(moduleRequests, function(moduleName, flow){
			var data = omd[moduleName];
			var defNames = [];
			for(var i=0; i<data.defNames.length; i++){
				defNames.push(moduleName+"."+data.defNames[i]);
			}
			BFEngine.loadDefinition(defNames, function(err){
				if(err){
					//Other module dependency yüklenemediği için dependent tanımların kayıtları da siliniyor
					for(var i=0; i<data.dependents.length ;i++){
						delete BFEngine.definitionMap[data.dependents[i]];
					}
				}
				flow(err);
			});
		}, function(err){
			callback(err);
		})
	};

	this.get = function(path, root){
		if(!root){
			return undefined;
		}
		var parts = path.split(".");
		if(parts.length == 1){
			if(root.members[parts[0]]){
				return root.members[parts[0]];
			}
			for(var memberName in root.members){
				if(root.members[memberName].$CS$.definition.NON_BUSINESS){
					var found = this.get(path, root.members[memberName]);
					if(found){
						return found;
					}
				}
			}
			return undefined;
		}
		var newPath = path;
		if(root.members[parts[0]] !== undefined){
			newPath = path.substring(path.indexOf(".")+1);
			var found = this.get(newPath, root.members[parts[0]]);
			if(found !== undefined){
				return found;
			}
		}
		for(var memberName in root.members){
			if(root.members[memberName].$CS$.definition.NON_BUSINESS) {
				var found = this.get(path, root.members[memberName]);
				if(found !== undefined) {
					return found;
				}
			}
		}
		return undefined;//bulunamadi
	};

	this.lookup = function(defName, root, unique){
		var result = [];
		if(!root){
			for(var path in this.instanceMap){
				var bf = this.instanceMap[path];
				if(!bf.$CS$.parent){
					root = bf;
					break;
				}
			}
		}
		if(!root || !root.members){
			return;
		}
		if(!defName){
			return root;
		}
		if(root.$CS$.definition.BF_NAME == defName){
			if(unique){
				return root;
			}
			result.push(root);
		}
		for(var memname in root.members){
			var bf = root.members[memname];
			if(bf.$CS$.definition.BF_NAME == defName){
				if(unique){
					return bf;
				}
				result.push(bf);
			}
		}
		for(var memname in root.members){
			var bf = root.members[memname];
			var subresult = this.lookup(defName, bf, unique);
			if(unique){
				return subresult;
			}
			result = result.concat(subresult);
		}
		return result;
	};

	/**
	 * Designer için geliştirilmiş bir method
	 */
	this.getFromId = function(id, parent) {

		if (!parent) {
			for (ctx in this.instanceMap) {
				if (this.instanceMap[ctx].$CS$.id == id) {
					return this.instanceMap[ctx];
				}
				var result = this.getFromId(id, this.instanceMap[ctx]);
				if (result) {
					return result;
				}
			}
		} else {
			for ( var memberName in parent.members) {
				if (parent.members[memberName].$CS$.id == id) {
					return parent.members[memberName];
				}
			}
			for ( var memberName in parent.members) {
				var result = this.getFromId(id, parent.members[memberName]);
				if (result) {
					return result;
				}
			}
		}
	};

	this.getLastParent = function(business) {
		while (business.$CS$.parent) {
			business = business.$CS$.parent;
		}
		return business;
	};

	// TODO p3, p4 kısmı adam edilecek
	this.render = function(business, $$container, p3, p4, p5) {
		if(typeof $$container == "string"){
			$$container = $$.byid($$container);
		}
		if(!$$container){
			return;
		}
		if (business.definition.renderer) {
			var result = business.definition.renderer($$container, p3, p4, p5);
			this.bindBCEvents(business, true);
			return result;
		}

		var result = business.bcRef.render($$container, p3, p4, p5);
		this.bindBCEvents(business, true);
		this.addTestRel(business);
		return result;
	};

	this.newDefinition = function(bfName, bcName, members, config, events){
		var Definition = function(){
			this.VERSION = 1;
			this.BC_REF = bcName;
			this.MEMBERS = members;
			this.EVENTS = [];
			this.METHODS = [];
			this.SCR = config;
			this.Business = function(){
				this.$$destroy = function(){};
				this.$$oc = function(){};
				this.init = function(){};
			};

			if(events){
				var m = 0;
				for(var i in  events) {
					this.EVENTS[m++] = i;
				}
			}
		};
		window.BFEngine.register(bfName, new Definition());
	};

	/**
	 * otomatik test yapabilmeleri için eklenmiş bir metod.
	 * ortam "test" ise bc lere ait dom lara relation ekler.
	 *
	 */
	this.addTestRel = function(bf) {
		if(window.sideRuntimeEnvironment === "test"){
			var name = bf.$CS$.name;
			var $$dom = $$.byid(bf.bcRef.config.id);
			if($$dom){
				$$dom.setAttribute("test-rel", name);
//					console.log("BFeng set name:"+name);
			}
		}
	};

  this.reRender = function(business, htmlid) {
    if(business == this.root && this.rootContId && !business.bcRef.isRendered()){
				//Test ekranında root olan ekranın yeniden çizilmesi için
				var $$tmpDiv = $$.create("DIV", {id:business.getConfig().id}, null, null, $$.byid(this.rootContId));
    }
    business.bcRef.reRender(htmlid);
  };

	this.beforeDRL = function(bf) {
		if(!bf || bf.bcRef.typeName == "CSC-POPUP"){
			return;
		}
		if (bf.bcRef.beforeDRL) {
			bf.bcRef.beforeDRL();
		}
		for (var mname in bf.members) {
			this.beforeDRL(bf.members[mname]);
		}
	};

	this.DRL = function(bf) {
		if(!bf || bf.bcRef.typeName == "CSC-POPUP"){
			return;
		}
		this.beforeDRL(bf);
		bf.doReLayout();
	};

	// TODO p3, p4 kısmı adam edilecek
	this.renderTo = function(htmlId, business, p3, p4, p5) {
		if(inDesigner(business)){
			this.root = business;
		}
		if(!this.root){
			this.root = business;
			this.rootContId = htmlId;
		}
		var $$container = htmlId;
		if(typeof htmlId == "string"){
			$$container = $$.byid(htmlId);
		}
		if (!$$container) {
			return;
		}
		$$container.innerHTML = "";
		var start = new Date();
		var obj = this.render(business, $$container, p3, p4, p5);
		var end = new Date();
		console.log("RENDER-TO render: " + (end-start) + " ms");
		start = new Date();
		this.fireLoadEvents(business, true);
		end = new Date();
		console.log("RENDER-TO fire load: " + (end-start) + " ms");
		start = new Date();
		this.bindBCEvents(business, false);
		end = new Date();
		console.log("RENDER-TO bind: " + (end-start) + " ms");
	};

	/**
	 * İlk önce bc'lerin metodunu çağırır. Sonra bf'lerin load eventlerini
	 * ateşler. İlk önce (hem bf'ler için hem bc'ler için) çoluk cocuğun
	 * metodu çağrılır en son atanın metodu çağrılır.
	 */
	this.fireLoadEvents = function(business, bfFire) {
		if (business.bcRef && business.bcRef.load) {
			business.bcRef.load();
		}
		if (business.members) {
			for ( var prop in business.members) {
				var member = business.members[prop];
				if(member.bcRef.typeName != "CSC-POPUP"){
					this.fireLoadEvents(member, bfFire);
				}
			}
		}
		if (bfFire) {
			business.fire("load");
		}
	};

	/**
	 * oninit event'lerini fire eder.
	 * İlk önce çoluk cocuğun event'ini tetikler en son atanın event'ini tetikler.
	 */
	this.fireOnInitEvents = function(business, initParams) {
		if (business.members) {
			for ( var mname in business.members) {
				this.fireOnInitEvents(business.members[mname]);
			}
		}
		business.fire("oninit", initParams);
	};

	this.bindBCEvents = function(business, firstTime, inTabular) {
		for ( var prop in business.events) {
			business.bindEventToComp(prop, firstTime, inTabular);
		}
	};

	this.isParentDisabled = function(business) {
		if(business.bcRef.config.forceEnable){
			return false;
		}
		while (business) {
			if (business.isDisabled(false)) {
				return true;
			}
			if(business.getTypeName() == "CSC-POPUP"){
				break;
			}
			business = business.$CS$.parent;
		}
		return false;
	};

	this.isParentRadonly = function(business) {
		while (business && business.$CS$.parent) {
			business = business.$CS$.parent;
			if (business.isReadonly(false)) {
				return true;
			}
			if(business.getTypeName() == "CSC-POPUP"){
				break;
			}
		}
		return false;
	};

	this.print = function(parent, path) {
		if (!parent) {
			parent = this.global.compMap;
			path = "";
		}
		for (item in parent) {
			console.log(path + "." + item);
			this.print(parent[item], path + "." + item);
		}
	};

	this.debug = function(msg) {
		if (BF_ENGINE_DEBUG_ENABLED) {
			console.log("[CSV] " + msg);
		}
	};

	this.addLazyRendered = function(business){
		this.lazyRendereds[business.$CS$.CTX +"." +business.$CS$.name] = business;
	};

	this.rmLazyRendered = function(business, withChilds){
		var lpath = business.$CS$.CTX +"." +business.$CS$.name;
		delete this.lazyRendereds[lpath];
		if(withChilds) {
			var subDelList = [];
			for(var key in this.lazyRendereds) {
				if(key.indexOf(lpath) == 0) {
					subDelList.push(key);
				}
			}
			for(var i = 0; i < subDelList.length; i++) {
				delete this.lazyRendereds[subDelList[i]];
			}
		}
		var deletelist = [];
		for(var i=0; i<this.bindedLazyEvents.length ;i++){
			var bf = this.bindedLazyEvents[i].bf;
			if(!bf.$CS$){
				deletelist.push(i);
				continue;
			}
			var path = bf.$CS$.CTX +"." +bf.$CS$.name;
			if((path+".").indexOf(lpath+".") == 0){
				deletelist.push(i);
				this.bindedLazyEvents[i].c();
			}
		}
		for(var i=deletelist.length-1; i>= 0 ;i--){
			this.bindedLazyEvents.splice(deletelist[i], 1);
		}
	};

	this.onAfterLazyRender = function(business, callback){
		this.bindedLazyEvents.push({bf: business, c: callback});
	};

	this.isLazyRendered = function(path){
		var path = path +".";
		for(var lazy in this.lazyRendereds){
			if(path != (lazy+".") && path.indexOf(lazy+".") == 0){
				return this.lazyRendereds[lazy];
			}
		}
	};

	this.a = function(){
		this.stackTrack++;
	};

	this.r = function(){
		this.stackTrack--;
		var scrolledParent = null;
		var scrollTop = 0;
		if(this.stackTrack == 0 && this.renderStack.length > 0){

			var focused = document.activeElement;
			var renderDecisions = [];//sample entry: {ctx: "root.a.b.c", name:"d", bf: bfobj, particial: true} particial atasının renderMember metodunun olup olmadığı bilgisi
			var lazyDecisions = {};
			for(var i=0; i<this.renderStack.length ;i++){
				var request = this.renderStack[i];
				var path = request.p;
				var bf = request.b;
				if(!bf || !bf.$CS$){
//						console.log("BF render cancel (no more exist): " + path);
					continue;
				}
				var lazybf = this.isLazyRendered(path);
				if(lazybf){
					lazyDecisions[lazybf.$CS$.CTX +"."+lazybf.$CS$.name] = lazybf;
					continue;
				}

				scrolledParent = $$.findScrolledParent($$.byid(bf.getConfig().id));
				scrollTop = scrolledParent ? scrolledParent.scrollTop : 0;

				var skip = false;
				var parent = bf.$CS$.parent;
				var particial = (parent && (typeof parent.bcRef.renderMember == "function"));
				for(var j=0; j<renderDecisions.length ;j++){
					var decision = renderDecisions[j];
					if(!decision){
						continue;
					}
					if((path+".").indexOf(decision.ctx+"."+decision.name+".") == 0 && ( !decision.row || ( decision.row && request.r && decision.row.rowid == request.r.rowid))){
						skip = true;
						break;
					}
					if(((decision.ctx+"."+decision.name+".").indexOf(path+".") == 0 && !decision.row) || (!particial && (decision.ctx+".").indexOf(bf.$CS$.CTX+".") == 0)){
						renderDecisions[j] = undefined;
					} else if(!decision. particial && (bf.$CS$.CTX+".").indexOf(decision.ctx+".") == 0){
						skip = true;
						break;
					}
				}
				if(skip){
					continue;
				}
				renderDecisions.push({
					ctx: bf.$CS$.CTX,
					name: bf.$CS$.name,
					bf: bf,
					particial: particial,
					row: request.r
				});
			}
//				console.log("RENDER TIME: ");
//				console.dir(renderDecisions);
			this.renderStack = [];
			var rendereds = [];
			try {
				this.stackTrack++;
				//apply
				for(var i=0; i<renderDecisions.length ;i++){
					var decision = renderDecisions[i];
					if(!decision){
						continue;
					}
					var allreadyRendered = false;
					for(var j=0; j<rendereds.length ;j++){
						if((decision.ctx+"."+decision.name+".").indexOf(rendereds[j]+".") == 0){
							allreadyRendered = true;
							break;
						}
					}
					if(allreadyRendered){
						continue;
					}

					var norender = false;
					var parent = decision.bf.$CS$.parent || decision.bf;
					if(!parent.bcRef.isRendered()){
						var name;
						while(parent.$CS$.parent && !parent.bcRef.isRendered()){
							if(parent.bcRef.typeName == "CSC-POPUP"){
								norender = true;
								break;
							}
							name = parent.$CS$.name;
							parent = parent.$CS$.parent;
						}
						if(norender){
							continue;
						}
						if(name && parent.members[name] && typeof parent.bcRef.renderMember == "function"){
							if(typeof parent.members[name].saveState == "function"){
								parent.members[name].saveState();
							}
							this.destroy(parent.members[name], true);
							parent.bcRef.renderMember(parent.members[name]);
							rendereds.push(parent.members[name].$CS$.CTX+"."+name);
						} else {
							if(typeof parent.saveState == "function"){
								parent.saveState();
							}
							this.reRender(parent);
							rendereds.push(parent.$CS$.CTX+"."+parent.$CS$.name);
						}
						continue;
					}

					if(parent.$CS$.parent && !parent.hasVisibleItem()){
						var name;
						while(parent.$CS$.parent && !parent.hasVisibleItem()){
							if(parent.bcRef.typeName == "CSC-POPUP"){
								norender = true;
								break;
							}
							name = parent.$CS$.name;
							parent = parent.$CS$.parent;
						}
						if(norender){
							continue;
						}
						if(name && parent.members[name] && typeof parent.bcRef.renderMember == "function"){
							if(typeof parent.members[name].saveState == "function"){
								parent.members[name].saveState();
							}
							this.destroy(parent.members[name], true);
							parent.bcRef.renderMember(parent.members[name]);
							rendereds.push(parent.members[name].$CS$.CTX+"."+name);
						} else {
							if(typeof parent.saveState == "function"){
								parent.saveState();
							}
							this.reRender(parent);
							rendereds.push(parent.$CS$.CTX+"."+parent.$CS$.name);
						}
						continue;
					}
					if(decision.row){
						decision.row.saveState();
						decision.bf.bcRef.renderRow(decision.row);
					//kolon invisible etme gibi işlemlerde rerendertable metadatayı vs.. tekrar oluşturmadığı için aşağısı commente alındı
					//Ayrıca delete işleminde de hataya sebep oluyor.
//					} else if(typeof decision.bf.bcRef.rerenderTable == "function"){
//						decision.bf.bcRef.rerenderTable();
					} else if(decision.particial){
						decision.bf.saveState();
						this.destroy(decision.bf, true);
						parent.bcRef.renderMember(decision.bf);
					} else {
						parent.saveState();
						this.reRender(parent);
					}
				}
				for(var lazy in lazyDecisions){
					var bf = lazyDecisions[lazy];
					if(!bf){
						continue;
					}
					var tabpanel = bf.$CS$.parent;
					if(typeof tabpanel.bcRef.recheckMemberVisibility == "function"){
						tabpanel.bcRef.recheckMemberVisibility(bf);
					}
				}

				if(this.afterRenderCallbacks){
					var y = this.afterRenderCallbacks.length;
					while(y>0){
						var func = this.afterRenderCallbacks[y-1];
						this.afterRenderCallbacks.splice(y-1, 1);
						y--;
						func();
					}
				}
			}finally{
				this.stackTrack--;
				if(this.renderStack.length){
					try{
						this.a();
					} finally{
						this.r();
					}
				}
			}
			if(this.afterRenderCallbacks){
				var y = this.afterRenderCallbacks.length;
				while(y>0){
					var func = this.afterRenderCallbacks[y-1];
					this.afterRenderCallbacks.splice(y-1, 1);
					y--;
					func();
				}
			}
		}

		if(this.stackTrack == 0){
			if(this.focused){
				var focused = this.focused;
				if(focused.bcRef && typeof focused.bcRef.focus == "function"){
					var child = this;
					var parent = focused.$CS$.parent;
					while(parent){
						//Focuslanacak eleman collpased bir container içinde ise container'ı expand et
						if(typeof parent.bcRef.expand == "function" && parent.bcRef.collapsed){
							parent.bcRef.expand();
						}
						//Focuslanacak eleman seçili olmayan bir tab'da ise tab'ı seçili hale getir
						if(typeof parent.bcRef.selectTab == "function" && parent.bcRef.config && parent.bcRef.config.selected != child.$CS$.name){
							parent.bcRef.selectTab(child.$CS$.name);
						}
						child = parent;
						parent = parent.$CS$.parent;
					}
					focused.bcRef.focus();
				}
				this.focused = undefined;
			}
			if(scrolledParent){
				scrolledParent.scrollTop = scrollTop;
			}
		}
	};

	this.renderRequest = function(business, afterRenderCallback){
		if(!business || !business.$CS$){
			return;
		}
		if(afterRenderCallback){
			if(!this.afterRenderCallbacks){ this.afterRenderCallbacks = []; }
			this.afterRenderCallbacks.push(afterRenderCallback);
		}

		var ctx = business.$CS$.CTX, name = business.$CS$.name;
		if(business.$CS$.intabular){
			var parent = business.$CS$.parent;
			var bf = parent;
			var last = business;
			while(!parent.isTabular()){
				last = parent;
				parent = parent.$CS$.parent;
			}
			this.renderStack.push({b: parent, p: parent.$CS$.CTX + "."+parent.$CS$.name, r: parent.getTypeName() == "CSC-DT" ? last.$CS$.row : null});
		} else {
			this.renderStack.push({b: business, p: ctx + "."+name});
		}
	};

	this.focusRequest = function(bf){
		this.focused = bf;
	};

	this.focusBF = function(bf){
		if(!bf){
			return;
		}

		var htmlid = bf.bcRef.getHtmlId();
		var $$dom = $$.byid(htmlid);
		if(!$$dom){
			return;
		}
		var tabindex = $$dom.getAttribute("tabindex");
		if(!tabindex){
			$$dom.setAttribute("tabindex", 100000);
			$$dom.focus();
			$$dom.removeAttribute("tabindex");
		} else {
			$$dom.focus();
		}
	};

	this.getFocusableBF = function(bf){
		if(!bf || !window.getSideDefaults("support-auto-focus", bf))
			return;

		var func = function(members){
			for(var member in members){
				if(members[member].members){
					var result = func(members[member].members);
					if(result)
						return result;
				}
				if(members[member].getConfig().focusable && members[member].getConfig().visible && !members[member].getConfig().disabled && !members[member].getConfig().readonly)
					return members[member];
			}
		};
		return func(bf.members);
	};


	/*
	 *
	 * Relative RefData, Hücre yönlendirmesi işleri için bilgileri bulacak olan metod.
	 *
	 * */
	window.getCloudInfo = function(bf){
		var bsnss = bf;
		var result = {};
		while (bsnss.$CS$.parent) {
			if(bsnss.$$SIRKET){
				// TODO: ADogan burası değişecek.
				result.oid = bsnss.$$SIRKET.sirketOid;
				result.url = bsnss.$$SIRKET.sirketUrl;

				break;
			}
			bsnss = bsnss.$CS$.parent;
		}
		return result;
	};
}

window.BFEngine = new BFEngine();
window.BFEngine.init();
function getSideDefaults(key, moduleName) {
	if(!moduleName) {
		moduleName = SideModuleManager.getLocalModuleName();
	}
	if(moduleName && typeof moduleName === "object"){//bf ise
		moduleName = moduleName.getModuleName();
	}

	// modul clone yapılmışsa
	var mdl = SideModuleManager.getModules()[moduleName];
	var sourceModule = mdl ? SideModuleManager.getModules()[moduleName].clonedFrom : undefined;
	var sideDefaultList = sourceModule ? SideDefaults[sourceModule] : SideDefaults[moduleName];

	return sideDefaultList[key] || ( NConsts.defaultAppConfigs[key] && NConsts.defaultAppConfigs[key].value );
}

function isTestModeInTestScreen(){
	if(window.SIDE_ENV_DEV && window.sideServiceMode == "TEST"){
		return true;
	}
	return false;
}

//TODO barist: multilanguage icin SideMLManager'i gormuyor.
if((navigator.appName == 'Microsoft Internet Explorer' || navigator.userAgent.match(/Trident/)) && document.documentMode < 10){
	alert("Kullandığınız web tarayıcısı bu uygulama tarafından desteklenmiyor.\n\nLütfen Google Chrome, Mozilla Firefox yada MS Internet Explorer 11 (yada daha üzeri bir versiyon) kullanınız.");
	window.location =  getSideDefaults("param-login-page");
}

if(!window.console){
	window.console = {
		log: function(){},
		info: function(){},
		error: function(){},
		debug: function(){},
		dir: function(){}
	};
}

if(!window.console.group){
	window.console.group = function(){};
}

function inDesigner(bf){
	return bf.$CS$.inDesigner === true;
};

function sideDebugLevel(){
	if(CSSession.getEnv() == "designer"){
		return 3;
	} else if(CSSession.getEnv() == "dev"){
		return 2;
	}
	return 1;//prod en düşük debug seviyesi
};

window.SLog = new function(){
	var levels = {
		"1": "Fatal", "2":"Error", "3":"Warning", "4":"Info", "5":"Log", "6":"Debug"
	}

	/**
	 * Sets log level for Side
	 * @param logLevel
	 */
	this.setLogLevel = function(logLevel){
		if(!this._set){
			console.info("[SLOG] Side log level is changed to " + levels[logLevel]);
		}
		this.debug = logLevel > 5 ? console.log.bind(console) : nop;
		this.log = logLevel > 4 ? console.log.bind(console) : nop;
		this.info = logLevel > 3 ? console.info.bind(console) : nop;
		this.warn = logLevel > 2 ? console.warn.bind(console) : nop;
		this.error = logLevel > 1 ? console.error.bind(console) : nop;
		this.fatal = logLevel > 0 ? console.error.bind(console) : nop;
	}

	//Log seviyeleri 1 fatal, 2 error, 3 warning, 4 info, 5 log, 6 debug
	var logLevel = localStorage.getItem("side-log-level");
	if(!logLevel){
		logLevel = 2;
	}

	console.info("[SLOG] Side default log level is " + levels[logLevel]);

	var nop = function(){};
	this._set = true;
	this.setLogLevel(logLevel);
	this._set = false;
};

window.STimer = {
	/**
	 * Calls callback after timeout expires
	 * @param timeout
	 * @param callback
	 */
	timeout: function(timeout, callback){
		return window.setTimeout(function(){
			try {
				BFEngine.a();
				callback();
			} finally{
				BFEngine.r();
			}
		}, timeout);
	}
};

window.SDate = window.SIDEDateUtil = {
	DEFAULT_SEPERATOR: "/",

	linuxDateBug: undefined,//Bazı linux'larda bulunan bug
	timezoneOffset: (new Date(2016,7,1)).getTimezoneOffset(),

	/**
	 * Gives the time difference with the given date
	 * @param date
	 * @returns {boolean|*}
	 */
	prettyDate : function(date){
//		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
//		var date = new Date(time),
		var diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;

		return day_diff == 0 && (
			diff < 60 && SideMLManager.get("CS-UTIL.now") ||
			diff < 120 && SideMLManager.get("CS-UTIL.oneMinAgo") ||
			diff < 3600 && Math.floor( diff / 60 ) + SideMLManager.get("CS-UTIL.minAgo") ||
			diff < 7200 && SideMLManager.get("CS-UTIL.oneHourAgo") ||
			diff < 86400 && Math.floor( diff / 3600 ) + SideMLManager.get("CS-UTIL.hoursAgo")) ||
			day_diff == 1 && SideMLManager.get("CS-UTIL.yesterday") ||
			day_diff < 7 && day_diff + SideMLManager.get("CS-UTIL.daysAgo") ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + SideMLManager.get("CS-UTIL.weeksAgo");
	},
	/**
	 *
	 * @param date
	 * @param roughly
	 * @returns {boolean|*}
	 */
	prettyDateLater : function(date, roughly){
		var diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) || day_diff > 0 || day_diff >= 31 )
			return;
		day_diff = -1*day_diff;
		diff = -1*diff;

		if(!roughly){
			return (diff < 60 && SideMLManager.get("CS-UTIL.now")  ||
				diff < 120 && SideMLManager.get("CS-UTIL.oneMinLater") ||
				diff < 3600 && Math.floor( diff / 60 ) + SideMLManager.get("CS-UTIL.minLater") ||
				diff < 7200 && SideMLManager.get("CS-UTIL.oneHourLater") ||
				diff < 86400 && Math.floor( diff / 3600 ) + SideMLManager.get("CS-UTIL.hoursLater")) ||
				day_diff == 1 && SideMLManager.get("CS-UTIL.tomorrow") ||
				day_diff < 7 && day_diff + SideMLManager.get("CS-UTIL.daysLater") ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + SideMLManager.get("CS-UTIL.weeksLater");
		} else {
			//todo İMPLEMENT EDİLECEK
			return (diff < 60 && SideMLManager.get("CS-UTIL.now")  ||
				diff < 120 && SideMLManager.get("CS-UTIL.oneMinLater") ||
				diff < 3600 && SideMLManager.get("CS-UTIL.minLater") ||
				diff < 7200 && SideMLManager.get("CS-UTIL.oneHourLater") ||
				diff < 86400 && Math.floor( diff / 3600 ) + SideMLManager.get("CS-UTIL.hoursLater")) ||
				day_diff == 1 && SideMLManager.get("CS-UTIL.tomorrow")  ||
				day_diff < 7 && day_diff + SideMLManager.get("CS-UTIL.daysLater") ||
				day_diff < 31 && Math.ceil( day_diff / 7 ) + SideMLManager.get("CS-UTIL.weeksLater");
		}
	},
	/**
	 * Gives the time difference between two given dates
	 * @param date1
	 * @param date2
	 * @returns {boolean|*}
	 */
	prettyDateDiff : function(date1, date2){
		var diff = ((date1.getTime() - date2.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) )
			return;

		var neg = day_diff < 0;
		day_diff = Math.abs(day_diff);

		var result = day_diff == 0 && (
			diff < 60 && SideMLManager.get("CS-UTIL.rightNow") ||
			diff < 120 &&  SideMLManager.get("CS-UTIL.oneMin") ||
			diff < 3600 && Math.floor( diff / 60 ) + SideMLManager.get("CS-UTIL.minutes") ||
			diff < 7200 && SideMLManager.get("CS-UTIL.oneHour") ||
			diff < 86400 && Math.floor( diff / 3600 ) + SideMLManager.get("CS-UTIL.hours")) ||
			day_diff == 1 && SideMLManager.get("CS-UTIL.yesterday") ||
			day_diff < 7 && day_diff + SideMLManager.get("CS-UTIL.days") ||
			day_diff < 31 && Math.floor( day_diff / 7 ) + SideMLManager.get("CS-UTIL.weeks") ||
			day_diff < 365 && Math.floor( day_diff / 31 ) + SideMLManager.get("CS-UTIL.months") ||
			day_diff >= 365 && Math.floor( day_diff / 365 ) + SideMLManager.get("CS-UTIL.years");

		if(neg){
			if(result == SideMLManager.get("CS-UTIL.yesterday")){
				result = SideMLManager.get("CS-UTIL.oneDay");
			}
			if(result != SideMLManager.get("CS-UTIL.rightNow")){
				result = "-"+result;
			}

		}
		return result;
	},
	/**
	 * Formats the given date with outformat
	 * @param date
	 * @param outformat
	 * @returns {*}
	 */
	getFormattedDateByDate: function(date, outformat){
		if(!date || !(date instanceof Date)){
			return "";
		}
		var day = date.getDate(), month = date.getMonth()+1, year = date.getYear()+1900, hour=date.getHours(), min = date.getMinutes(), sec = date.getSeconds();
		var last = "";
		outformat = outformat || "dd/mm/yyyy";
		var result = outformat;
		for(var i=0; i<outformat.length ; i++){
			if(outformat.charAt(i) == "d" || outformat.charAt(i) == "m" || outformat.charAt(i) == "y" || outformat.charAt(i) == "H" || outformat.charAt(i) == "M" || outformat.charAt(i) == "S"){
				last += outformat.charAt(i);
				switch(last){
					case "dd":
						if(day < 10){
							result = result.replace("dd","0" + day);
						} else {
							result = result.replace("dd",day);
						}
						last = ""; break;
					case "mm":
						if(month < 10){
							result = result.replace("mm","0"+ (month));
						} else {
							result = result.replace("mm",+ (month));
						}
						last = ""; break;
					case "yyyy":
						result = result.replace("yyyy", year);
						last = ""; break;
					case "HH":
						if(hour < 10){
							result = result.replace("HH","0" + hour);
						} else {
							result = result.replace("HH",hour);
						}
						last = ""; break;
					case "MM":
						if(min < 10){
							result = result.replace("MM","0"+ (min));
						} else {
							result = result.replace("MM",+ (min));
						}
						last = ""; break;
					case "SS":
						if(sec < 10){
							result = result.replace("SS","0"+ (sec));
						} else {
							result = result.replace("SS",+ (sec));
						}
						last = ""; break;
				}

			}
		}
		return result;
	},
	/**
	 * Converts date string from informat to outformat
	 * @param date - String
	 * @param informat - String
	 * @param outformat - String
	 * @returns {*}
	 */
	//Format must be given like "dd/mm/yyyy". Default format is "dd/mm/yyyy"
	getFormattedDate: function(date, informat, outformat){
		if(!date){
			return "";
		}
		if(informat === outformat){
			return date;
		}
		var year=0,month=0,day=0,hour=0,min=0,sec=0,milisecond=0;
		if(date instanceof Date){
			day = date.getDate();
			month = date.getMonth();
			year = date.getFullYear();
			hour = date.getHours();
			min = date.getMinutes();
			sec = date.getSeconds();
		} else {
			informat = informat || "dd/mm/yyyy";

			var last = "";
			for(var i=0; i<informat.length ; i++){
				if(informat.charAt(i) == "d" || informat.charAt(i) == "m" || informat.charAt(i) == "y" || informat.charAt(i) == "H" || informat.charAt(i) == "M" || informat.charAt(i) == "S" || informat.charAt(i) == "Z"){
					last += informat.charAt(i);
					switch(last){
						case "dd": day = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
						case "mm": month = parseInt(date.substring(i-1,i+1), 10)-1; last = ""; break;
						case "yyyy": year = parseInt(date.substring(i-3,i+1), 10); last = ""; break;
						case "HH": hour = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
						case "MM": min = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
						case "SS": sec = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
						case "ZZZ": milisecond = parseInt(date.substring(i-2,i+1), 10); last = ""; break;
					}
				} else {
					if(informat.charAt(i) != date.charAt(i)){
						return "";
					}
				}
			}
		}

		last = "";
		outformat = outformat || informat;
		var result = outformat,ystr;
		for(var i=0; i<outformat.length ; i++){
			if(outformat.charAt(i) == "d" || outformat.charAt(i) == "m" || outformat.charAt(i) == "y" || outformat.charAt(i) == "H" || outformat.charAt(i) == "M" || outformat.charAt(i) == "S" || outformat.charAt(i) == "Z"){
				last += outformat.charAt(i);
				switch(last){
					case "dd":
						if(day < 10){
							result = result.replace("dd","0" + day);
						} else {
							result = result.replace("dd",day);
						}
						last = ""; break;
					case "mm":
						if(month < 9){
							result = result.replace("mm","0"+ (month+1));
						} else {
							result = result.replace("mm",+ (month+1));
						}
						last = ""; break;
					case "yyyy":
						if(year < 1000){
							year = ""+year;
							while(year.length != 4){
								year = "0"+year;
							}
						}
						result = result.replace("yyyy", year);
						last = ""; break;
					case "HH":
						if(hour < 10){
							result = result.replace("HH","0" + hour);
						} else {
							result = result.replace("HH",hour);
						}
						last = ""; break;
					case "MM":
						if(min < 10){
							result = result.replace("MM","0"+ (min));
						} else {
							result = result.replace("MM",+ (min));
						}
						last = ""; break;
					case "ZZZ":
						if(milisecond < 10){
							result = result.replace("ZZZ" , "00"+ (milisecond));
						} else if(milisecond < 100){
							result = result.replace("ZZZ", "0"+ (milisecond));
						}
						last = ""; break;
					case "SS":
						if(sec < 10){
							result = result.replace("SS","0"+ (sec));
						} else {
							result = result.replace("SS",+ (sec));
						}
						last = ""; break;
				}
			}
		}
//		return result;
		return result.indexOf("NaN") > -1 ? "" : result ;
	},
	/**
	 *	Checks if the date string is valid
	 * @param string - date
	 * @param string - format
	 * @returns {*}
	 */
	isValidDate: function(date, format){
		if(this.linuxDateBug === undefined){
			var xdate = new Date(1976, 5, 1);
			this.linuxDateBug = xdate.getMonth() == 5 ? false : true;
		}
		format = format || "dd/mm/yyyy";
		var formatMap = {};
		var last = "", d = new Date();
		var year=0,month=0,day=0,hour=0,min=0,sec=0,milisecond=0;
		for(var i=0; i<format.length ; i++){
			if(format.charAt(i) == "d" || format.charAt(i) == "m" || format.charAt(i) == "y" || format.charAt(i) == "H" || format.charAt(i) == "M" || format.charAt(i) == "S" || format.charAt(i) == "Z"){
				last += format.charAt(i);
				switch(last){
					case "dd": day = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "mm": month = parseInt(date.substring(i-1,i+1), 10)-1; last = ""; break;
					case "yyyy": year = parseInt(date.substring(i-3,i+1), 10); last = ""; break;
					case "HH": hour = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "MM": min = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "SS": sec = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "ZZZ": milisecond = parseInt(date.substring(i-2,i+1), 10); last = ""; break;
				}
			} else {
				if(format.charAt(i) != date.charAt(i)){
					return false;
				}
			}
		}
		if(format.indexOf("HH") === 0){//HH:MM:SS ya da HHMMSS ise
			year = 2015; month = 1; day= 1;
		}
		if(format == "mmyyyy"){
			var d = new Date(year, month, 1);
			if(this.linuxDateBug){
				d.setFullYear(year);
				d.setMonth(month);
				d.setDate(1);
			}
			return d && d.getMonth() == month && d.getFullYear() == year;
		}else {
			if(this.linuxDateBug && hour == 0){
				hour = 20;
			}
			var d = new Date(year, month, day, hour, min, sec);
			if(d.getTimezoneOffset() != this.timezoneOffset){//Gün ışığı kazanma zaman uygulaması ile ilgili hatalar için
				hour = 20;
				d = new Date(year, month, day, hour, min, sec);
			}
			if(format.indexOf("HH") >= 0){
				return d && d.getMonth() == month && d.getDate() == Number(day) && hour == d.getHours() && min == d.getMinutes() && sec == d.getSeconds() && (d > new Date(1000,1,1,0,0,0,0) );
			} else {
				return d && d.getMonth() == month && d.getDate() == Number(day) && (d > new Date(1000,1,1,0,0,0,0) );
			}
		}
	},
	/**
	 *	Gets a date object from the given string
	 * @param string - date
	 * @param string - format
	 * @returns {*}
	 */
	getDateObjFromString : function(date, format){
		format = format || "dd/mm/yyyy";
		var formatMap = {};
		var last = "", d = new Date();
		var year=0,month=0,day=0,hour=0,min=0,sec=0;
		for(var i=0; i<format.length ; i++){
			if(format.charAt(i) == "d" || format.charAt(i) == "m" || format.charAt(i) == "y" || format.charAt(i) == "H" || format.charAt(i) == "M" || format.charAt(i) == "S"){
				last += format.charAt(i);
				switch(last){
					case "dd": day = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "mm": month = parseInt(date.substring(i-1,i+1), 10)-1; last = ""; break;
					case "yyyy": year = parseInt(date.substring(i-3,i+1), 10); last = ""; break;
					case "HH": hour = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "MM": min = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "SS": sec = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
				}
			} else {
				if(format.charAt(i) != date.charAt(i)){
					return false;
				}
			}
		}
		if(format == "mmyyyy"){
			return new Date(year, month, 1);
		} else {
			return new Date(year, month, day, hour, min, sec);
		}
	},
	/**
	 * Checks the date
	 * @param date
	 * @param format
	 * @param noWeekend
	 * @param label
	 */
	checkDate: function(date, format, noWeekend, label){
		label = label || SideMLManager.get("CS-UTIL.date");
		format = format || "dd/mm/yyyy";
		var year = 1000, month = 1, day = 1, hour = 0, min = 0, sec = 0, last = "";

		if(this.linuxDateBug === undefined){
			var xdate = new Date(1976, 5, 1);
			this.linuxDateBug = xdate.getMonth() !== 5;
		}

		var dateTmp = date.replace(/_/g,"");
		if(dateTmp.length !== format.length){
			return SideMLManager.get("CS-UTIL.formatRequirement",label,format);
		}

		for(var i=0; i<format.length ; i++){
			if(format.charAt(i) === "d" || format.charAt(i) === "m" || format.charAt(i) === "y" || format.charAt(i) === "H" || format.charAt(i) === "M" || format.charAt(i) === "S"){
				last += format.charAt(i);
				switch(last){
					case "dd": day = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "mm": month = parseInt(date.substring(i-1,i+1), 10)-1; last = ""; break;
					case "yyyy": year = parseInt(date.substring(i-3,i+1, 10)); last = ""; break;
					case "HH": hour = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "MM": min = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
					case "SS": sec = parseInt(date.substring(i-1,i+1), 10); last = ""; break;
				}
			} else {
				if(format.charAt(i) !== date.charAt(i)){
					return SideMLManager.get("CS-UTIL.formatRequirement",label,format);
				}
			}
		}

		if( (format.indexOf("y") !== -1) && (year < 1000) ){//20 gibi değeri de kabul edip 1920 yapıyor
			return SideMLManager.get("CS-UTIL.formatRequirement",label,format);
		}

		if(format === "mm/yyyy"){
			day = 1;
		}

		if(this.linuxDateBug && hour === 0){
			hour = 20;
		}

		var d = new Date(year, month, day, hour, min, sec);
		var previusDay = new Date(year, month, day-1, hour, min, sec);
		if(d.getTimezoneOffset() != previusDay.getTimezoneOffset()){//Gün ışığı kazanma zaman uygulaması ile ilgili hatalar için
			hour = 20;
			d = new Date(year, month, day, hour, min, sec);
		}

		if(noWeekend && (d.getDay() === 0 || d.getDay() === 6)){//Hafta sonu kontrolü
			return SideMLManager.get("CS-UTIL.weekdayCheck",label);
		}

		if(
			!d ||
			( (format.indexOf("mm") !== -1) && (d.getMonth() !== month) ) ||
			( (format.indexOf("dd") !== -1) && (d.getDate() !== Number(day)) ) ||
			( (format.indexOf("HH") !== -1) && (d.getHours() !== hour) ) ||
			( (format.indexOf("MM") !== -1) && (d.getMinutes() !== min) ) ||
			( (format.indexOf("SS") !== -1) && (d.getSeconds() !== sec) )
		){
			return SideMLManager.get("CS-UTIL.formatRequirement",label,format);
		}

		if(d < new Date(1000,1,1,0,0,0,0) ){
			return SideMLManager.get("CS-UTIL.dateTooEarly",label);
		}

		if(d > new Date(2190,1,1,0,0,0,0) ){
			return SideMLManager.get("CS-UTIL.dateTooLate",label);
		}
	},

	/**
	 * Detects separator from format if it is defined
	 * returns defaultSeparator otherwise
	 * @param string - format
	 * @param defaultSeperator
	 * @returns {*}
	 */
	detectSeperatorFromFormat: function(format, defaultSeperator){
		if(!format){
			if(defaultSeperator !== undefined){
				return defaultSeperator;
			}
			return this.DEFAULT_SEPERATOR;
		}
		for(var i=0; i<format.length ;i++){
			if(format.charAt(i) != 'd' && format.charAt(i) != 'm' && format.charAt(i) != 'y'){
				return format.charAt(i);
			}
		}
		if(defaultSeperator !== undefined){
			return defaultSeperator;
		}
		return "";
	}
};
/**
 * Used to show notification
 */
window.SNotifier = new function(){
	var bf, position="csc-notification--top", key ="csc-notification",self=this;
	this.init = function(){
		var def = BFEngine.newDefinition("_SNOTIFIER", "CSC-NOTIFICATION", null, {cssClass:"snotifier"});
		bf = BFEngine.create({BF: "_SNOTIFIER"}, "snotify");
		BFEngine.render(bf, $$.body());
		bf.addClass(key);
	};

	function checkBF(){
		if(!bf){
			self.init();
		}
	}
	this.setTimeOut = function(timeout){
		checkBF();
		timeout = timeout || 3000;
		bf.setConfig("timeOut", timeout);
	}
	this.showIcon = function(iconstatus){
		checkBF();
		bf.setConfig("showIcon", iconstatus);
	}
	/**
	 * Sets the position of notifications
	 * @param [dir]
	 * Available parameters: ["top"], ["bottom"], ["top", "left"], ["top","right"], ["bottom","left"], ["bottom","right"]
	 */
	this.setPosition = function(dir){
		checkBF();
		var cscNotificationList=document.getElementById(bf.getConfig().id+"_cscNotificationListWrapper");
		if(position){
			cscNotificationList.classList.remove(position);
		}
		position="";
		for(var pos in dir){
			position=position+"--"+dir[pos];
		}
		position = key+position;
		cscNotificationList.classList.add(position);
	}
	/**
	 * Any css class name can be given
	 * @param [clazz]
	 */
	this.setCssClass = function(clazz){
		checkBF();
		bf.addClass(clazz);
	}
	/**
	 * Sets the notification type as error
	 * @param [message]
	 * Your message
	 * @param [notifierType]
	 * Available parameters: alert
	 * alert: Notice appears until the user closes the notification panel
	 */
	this.error = function(message, notifierType){
		checkBF();
		bf.error(message, notifierType);
	}
	/**
	 * Sets the notification type as error
	 * @param [message]
	 * Your message
	 * @param [notifierType]
	 * Available parameters: alert
	 * alert: Notice appears until the user closes the notification panel
	 */
	this.warning = function(message, notifierType){
		checkBF();
		bf.warning(message, notifierType);
	}
	/**
	 * Sets the notification type as error
	 * @param [message]
	 * Your message
	 * @param [notifierType]
	 * Available parameters: alert
	 * alert: Notice appears until the user closes the notification panel
	 */
	this.info = function(message, notifierType){
		checkBF();
		bf.info(message, notifierType);
	}
	/**
	 * Sets the notification type as error
	 * @param [message]
	 * Your message
	 * @param [notifierType]
	 * If no parameter is given, it will automatically close after a while
	 * Available parameters: alert
	 * alert: Notice appears until the user closes the notification panel
	 */
	this.success = function(message, notifierType){
		checkBF();
		bf.success(message, notifierType);
	}
};

window.SResourceBundle = {
	get: function (key, parameters) {
		var params = Array.isArray(parameters) ? [""].concat(parameters) : arguments;

		for (var i = 0; i < params.length-1; i++) {
			var point = '\\{' + i + '\\}';
			key = key.replace(new RegExp(point, 'g'), params[i+1]);
		}
		return key;
	}
};

window.SIDEUtil = window.SUtil = {
	insCounter: 1000,
	insPrefix: "$DynIns",

	idCounter: 25,//25 rasgele bir deger bir anlami yok

	/**
	 * Returns side version
	 * @param key
	 */
	getSideVersion: function(){
		return "1.9.1";//TODO gerçek side versiyonu dönülmeli
	},

	/**
	 * Returns chart colors.
	 * @example "#DB6766", "#E49B9C", "#F1C9C4", "#3182bd", "#6baed6"
	 */
	chartColors: function(){
		return ["#C3322A", "#DB6766", "#E49B9C", "#F1C9C4", "#3182bd", "#6baed6", "#9ecae1","#c6dbef", "#637939", "#8ca252","#b5cf6b","#636363","#969696","#bdbdbd"];
	},
	/**
	 * Formats number
	 * @param [n]  - Number to format
	 * @param [decPlaces] - Decimal place. Default value is: 2
	 * @param [thouSeparator] - Decimal seperator. Default value is: "."
	 * @param [decSeparator] - Thousand seperator. Default value is: ","
	 * @example SUtil.formatMoney(32321) returns as "32,321.00"
	 */
	formatMoney: function (n, decPlaces, thouSeparator, decSeparator) {
		var decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
			decSeparator = decSeparator == undefined ? "." : decSeparator,
			thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
			sign = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
		return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
	},
	/**
	 * Returns CilentIp
	 */
	getClientIP: function(){
		return window.sideClientIP;
	},
	/**
	 * Returns generated id
	 */
	generateId: function(){
		return this.idCounter++;
	},
	/**
	 *  Returns id
	 */
	getId: function(){
		return getid();
	},
	/**
	 * Return the dependencies of the given bfNames
	 * @param [bfName] - Name of the definition that you want to list dependencies.
	 * @param [callback]
	 */
	loadDependencies: function(bfNames, callback){
		BFEngine.loadDefinition(bfNames, callback);
	},
	/**
	 * @param [tab]
	 * @param [BFName]
	 * @param [options]
	 * @param [onloadcallback]
	 */
	openToTab: function(tab, BFName, options, onloadcallback){
		for(var memname in tab.members){
			if(tab.members[memname].$CS$.definition.BF_NAME == BFName){
				tab.selectTab(memname);
				if(onloadcallback){
					onloadcallback();
				}
				return;
			}
		}
		var name = this.insPrefix +(++this.insCounter);
		options = options || {};

		tab.addMember(BFName, name, options, true, function(){
			tab.selectTab(name);
			if(onloadcallback){
				onloadcallback();
			}
		});
	},
	/**
	 * @param [BFName]
	 * @param [params]
	 * @param [options]
	 */
	openToNewWindow: function(BFName,params,options){
		var moduleName = SideModuleManager.getLocalModuleName();
		var module = window.SModules[moduleName];
		if(BFName.indexOf(".") > 0){
			moduleName = BFName.substring(0,BFName.indexOf("."));
			BFName = BFName.substring(BFName.indexOf(".")+1);
		}
		if(module.side =="/test-screen/ndispatch" || module.side =="/test-screen/ndispatch"){
			var page = SideModuleManager.getResourceUrl(moduleName, "test-screen.view?bfname="+ BFName+"&pm="+module.pm);
		}
		else{
			var page = SideModuleManager.getResourceUrl(moduleName, "openbf.jsp?bfname="+ BFName);
		}
		if(params){
			for(var paramName in params){
				page += "&" + paramName +"=" +params[paramName];
			}
		}
		if(options && options.newWindow){
			window.open(page, options.title||"Side", "height="+(options.height||800)+",width="+(options.width||600));
		} else {
			var a = $$.create("A", {href: page, target: "_blank", rel:"noreferrer"},undefined,{display: "none"});
			$$.body().appendChild(a);
			$$.fireEvent(a, "click");
		}
	},
	/**
	 * @param [bf]
	 * @param [options]
	 */
	doValidityCheck: function(bf, options){
		var result = bf.isValid();
		if(result.success){
			return true;
		}
		var msgStr = "";
		for(var i=0; i<result.messages.length ;i++){
			msgStr += result.messages[i] +"<br>";
		}
		CSPopupUTILS.MessageBox(msgStr, {title: "Hata !", error: true});
		return false;
	},

	/**
	 *
	 * @param postParams object olmalı. {file: FileObject, file2:FileObject} gibi
	 * @param getParams object olmalı. {cmd: "test", other:"other param"} gibi
	 * @param options Örnek: {url: "fileupload-servlet", module: "module-prefix"}
	 * @param completeCallback Upload tamamlanınca çağrılacak callback
	 * @param errorCallback Upload'da hata oluşursa çağrılacak callback
	 */
	uploadFiles: function(postParams, getParams, options, completeCallback, errorCallback){
		var formData = new FormData();
		for (var pname in postParams) {
			if(postParams[pname].name){
				formData.append(pname, postParams[pname],postParams[pname].name);
			} else {
				formData.append(pname, postParams[pname]);
			}
		}

		function handleResponse(event){
			if(this.status !== 200){
				errorCallback(this.message);
			} else {
				var respObj;
				if (typeof event.target.responseText === "object") {
					respObj = event.target.responseText;
				} else if (typeof event.target.responseText === "string") {
					try {
						respObj = eval("(" + event.target.responseText + ")");
					} catch(e){}
				}
				completeCallback(respObj || event.target.responseText);
			}
		}

		var xhr = new XMLHttpRequest();
		xhr.onload = handleResponse;
		xhr.onerror = handleResponse;

		options = options || {};
		var url = SModuleManager.getAppUrl(options.module, options.url || "fileupload-servlet");
		var token = CSSession.getToken(options.module)||"null";
		var tokenKey = window.getSideDefaults("param-token-key", options.module);
		url += "?"+tokenKey+"="+token;

		if(getParams){
			for (var pname in getParams) {
				url += "&"+pname+"="+getParams[pname];
			}
		}
		xhr.open("POST", url, true);
		xhr.send(formData);
	},

	/**
	 * @param [params]
	 * @param [options]
	 */
	downloadFile: function(params, options){
		options = options || {};
		var url = (options.url || CSCaller.getDownloadURL()) + "?";
		params = params || {};
		if(!params.cmd){
			params.cmd = "downloadResource";
		}
		if(CSSession.getToken(options.module)){
			var tokenKey = window.getSideDefaults("param-token-key");
			url += tokenKey+ "="+encodeURIComponent(CSSession.getToken(options.module))+"&";
		}
		for ( var propName in params) {
			if (typeof params[propName] == "object") {
				url += propName + "=" + encodeURIComponent(JSON.stringify(params[propName], function(key, value){
						if(value && value.getValue && typeof value.getValue == "function" ){
							return value.getValue();
						}
						return value;
					})) + "&";
			} else {
				url += propName + "=" + params[propName] + "&";
			}
		}

		//burada normalde a href ile indirmesi gerekli. iframe ile indirdiğinde büyük pdf dosylarını indirmeye zorlayamıyor tarayıcı içinde gösteriyor.
		//murat caner in evdorapor da dosya indirimediğinde hata mesajı verebilsin isteğini çözebilmek için callback verilmişse iframe kullanılıyor.
		if(options && options.callback){
			var iframe = $$.create("iframe");
			iframe.width = 0;
			iframe.height = 0;
			iframe.style.display = "none";
			iframe.src = url;

			$$.body().appendChild(iframe);
			window.setTimeout(function(){
				$$.remove(iframe);
			},1200000);//20dk sonra sil

			$$.bindEvent(iframe, "load", function(){
				var msg = $("pre",iframe.contentDocument).html();
				//console.log("download file iframe loaded. msg:"+msg);
				options.callback(msg);
			});
		}else{
			var a = $$.create("a");
			if(options.fileName){
				a.download = options.fileName;
			}
			if(window.onbeforeunload){	// "Warn before leaving SIDE" özelliğini ezmek için.
				window.ignoreOnBeforeUnload = true;
			}
			a.href = url;
			if($$.isff() || $$.isie){
				window.location = url;
			}else{
				a.click();
			}
		}
	},
	/**
	 * @param [params]
	 * @param [options]
	 */
	downloadFileWithPost: function(params, options){
		options = options || {};

		params = params || {};
		if(!params.cmd){
			params.cmd = "downloadResource";
		}
		var url = options.url || CSCaller.getDownloadURL(options.module)+"?";
		if(options.module){
			url = SideModuleManager.getAppUrl(options.module, url);
		}
		if(CSSession.getToken(options.module)){
			var tokenKey = window.getSideDefaults("param-token-key");
			url += "?" + tokenKey+ "="+encodeURIComponent(CSSession.getToken(options.module))+"&";
		}
		var iframeName = getId();
		var $$form = $$.create("FORM", {action: url, method: "post", target: iframeName, "accept-charset":"utf8"},undefined,{display: "none"});
		for ( var propName in params) {
			var $$input = $$.create("INPUT", {type:"hidden"});
			$$input.setAttribute("name", propName);
			if (typeof params[propName] == "object") {
				$$input.value = JSON.stringify(params[propName], function(key, value){
					if(value && value.getValue && typeof value.getValue == "function" ){
						return value.getValue();
					}
					return value;
				});
			} else {
				$$input.value = params[propName];
			}
			$$form.appendChild($$input);
		}
		var iframe = $$.create("iframe", {name:iframeName,  width:0, height: 0}, null, {display: "none"});

		$$.body().appendChild(iframe);
		$$.body().appendChild($$form);
		if(options.onload || options.onerror){
			iframe.onload = function(){
				try {
					var data = $("pre", iframe.contentDocument).html();
					var json = JSON.parse(data);
					if(json.error && options.onerror){
						options.onerror(json);
						return;
					}
				} catch(e){
					console.error(e);
				}
				if(options.onload){
					options.onload(this.contentDocument.children[0].innerText);
				}
			};
		}
		if(options.onerror){
			iframe.onerror = function(){
				options.onerror();
			};
		}
		$$form.submit();
		window.setTimeout(function(){
			$$.remove(iframe);
			$$.remove($$form);
		},1200000);//20dk sonra sil
	},
	/**
	 * @param [fileOid]
	 * @param [params]
	 */
	downloadExportedFile: function(fileOid, params){
		var url = url = CSCaller.getAppURL("side-support-gridexport")+"?cmd=DOWNLOAD_EXPORTED&oid="+fileOid;

		if(params){
			url += "&";
			for(var propName in params){
				url += propName + "=" + params[propName] + "&";
			}
		}

		var iframe = $$.create("iframe");
		iframe.width = 0;
		iframe.height = 0;
		iframe.style.display = "none";
		iframe.src = url;

		$$.body().appendChild(iframe);
		window.setTimeout(function(){
			$$.remove(iframe);
		},20000);//20 sn sonra sil
	},
	/**
	 * @param [filename]
	 * @param [text]
	 */
	downloadFileFromClientSide: function(filename, text) {
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);
		pom.click();
	},
	/**
	 * @param [bf]
	 * @param [title]
	 */
	print: function(bf, title,options){
		if(!bf){
			return;
		}
		if(!(bf instanceof BaseBF)){
			throw "bf parameter must be a business field.";
		}
		var ref = bf.bcRef;
//		var readonly = ref.config.readonly;
//		try {
//			BFEngine.a();
//			bf.setReadonly(true);
//			bf.rerender();//TODO mahmuty buraya başka bir çözüm bulunmalı
//		} finally {
//			BFEngine.r();
//		}
		var themeClass = CSSession.get("SIDE-THEME");

		var $$div = $$.create("DIV", {id: "print-div"});
		$$.addClass($$div, themeClass + " section-to-print");

		var $$toPrint= $$.byid(ref.config.id);
		var width = $$.innerWidth($$toPrint);

		var parent = $$toPrint.parentNode;
		$$.remove($$toPrint);
		$$.body().appendChild($$div);
		$$div.appendChild($$toPrint);
		if(options && options["footnote"]){
			var footnoteElement=document.createElement("span");
			footnoteElement.style.padding="10px";
			footnoteElement.style.display="block";
			footnoteElement.innerHTML=options["footnote"];
			$$div.appendChild(footnoteElement);
		}

		if(title){
			var $$title = document.getElementsByTagName("title")[0];
			var oldTitle = $$title.innerHTML;
			$$title.innerHTML = title +" - "+ SIDEDateUtil.getFormattedDateByDate(new Date(),  "dd/mm/yyyy HH:MM");
		}

		window.print();
		window.setTimeout(function(){
			var $$div = $$.byid("print-div");
			var $$toPrint = $$.byid(ref.config.id);
			$$.remove($$div);

			parent.appendChild($$toPrint);

			if($$title && oldTitle){
				$$title.innerHTML = oldTitle;
			}
		//	$$toPrint.style.width = width + "px";
   //	$$toPrint.style.width = "";
			//	bf.rerender();
		}, 100);
	},

	printAll:  function(bf, title,options){
		if(!bf){
			return;
		}
		bf = Object.values(bf);
		var bfData = [];
		for( var i = 0 ; i < bf.length; i++){
			if(!(bf[i] instanceof BaseBF)){
				throw "bf parameter must be a business field.";
			}
			var ref = bf[i].bcRef;
			bfData.push(ref);

		}
		var themeClass = CSSession.get("SIDE-THEME");

		var $$div = $$.create("DIV", {id: "print-div"});
		$$.addClass($$div, themeClass + " section-to-print");
		var parentArray = [];
		for(var i = 0; i<bfData.length; i++){
			if(bfData[i].typeName =="CSC-HIDDEN"){
				continue;
			}
			var $$toPrint= $$.byid(bfData[i].config.id);
			parentArray.push($$toPrint.parentNode);
			//var parent = $$toPrint.parentNode;
			$$.remove($$toPrint);
			var width = $$.innerWidth($$toPrint);
			$$.body().appendChild($$div);
			$$div.appendChild($$toPrint);
		}


		if(options && options["footnote"]){
			var footnoteElement=document.createElement("span");
			footnoteElement.style.padding="10px";
			footnoteElement.style.display="block";
			footnoteElement.innerHTML=options["footnote"];
			$$div.appendChild(footnoteElement);
		}

		if(title){
			var $$title = document.getElementsByTagName("title")[0];
			var oldTitle = $$title.innerHTML;
			$$title.innerHTML = title +" - "+ SIDEDateUtil.getFormattedDateByDate(new Date(),  "dd/mm/yyyy HH:MM");
		}

		window.print();
		window.setTimeout(function(){
			var $$div = $$.byid("print-div");
			for(var i = 0; i< bfData.length; i++){
				if(bfData[i].typeName == "CSC-HIDDEN"){
					continue;
				}
				var $$toPrint = $$.byid(bfData[i].config.id);
				parentArray[i].appendChild($$toPrint);
			}

			$$.remove($$div);



			if($$title && oldTitle){
				$$title.innerHTML = oldTitle;
			}
			    $$toPrint.style.width = width + "px";
//			$$toPrint.style.width = "";
			for( var i = 0 ; i < bf.length; i++){
				bf[i].rerender();
			}

		}, 100);
	},

	/**
	 * @param [bc]
	 * @param [designerPathPrefix]
	 * @param [runtimePathPrefix]
	 * @param [filename]
	 * @param [callback]
	 */
	loadJSFromBC : function(bc, designerPathPrefix, runtimePathPrefix, filename, callback){
		var pathPrefix = "";
		if(CSSession.getEnv() === "designer" || CSSession.getEnv() === "dev" || window.csd){//design and test time
			pathPrefix = designerPathPrefix;
		}else{//runtime
			pathPrefix = runtimePathPrefix;
		}
		var url = SideModuleManager.getSideUrl(BFEngine.getModuleName(bc.bf) || SideModuleManager.getLocalModuleName());
		url = url.indexOf("side-dispatch") !== -1 ? url.replace("side-dispatch", pathPrefix+filename) : "/" + pathPrefix + filename;
		SIDEUtil.loadJS(url, callback);
	},
	/**
	 * @param [filename]
	 * @param [callback]
	 */
	loadJS : function(filename, insertBefore, callback){
		if(typeof insertBefore === "function"){
			callback = insertBefore;
			insertBefore = undefined;
		}

		var fileref;
		if(filename.indexOf(".css?") > 0 || filename.indexOf("/css?") > 0 || filename.indexOf("css", filename.length - 3) !== -1 || filename.indexOf("getCSSFiles")!==-1){
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");

		} else {
			fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("charset", "UTF-8");
		}

		function getChromeVersion(){
			return parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1]);
		}


		if(filename.indexOf(".css?") > 0 || filename.indexOf("/css?") > 0 || filename.indexOf("css", filename.length - 3) !== -1 || filename.indexOf("getCSSFiles")!==-1){
			fileref.setAttribute("href", filename);
			if(insertBefore){
				var headTag = $$.head();
				var targetDom = $$.byid(insertBefore);
				headTag.insertBefore(fileref, targetDom);
			} else {
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
			if($$.ischrome() && getChromeVersion() < 28){//chromun eski versiyonları link için onload eventini desteklemiyor
				var img = document.createElement('img');
				img.onerror = function(err){
					$$.remove(img);
					if(callback){
						callback(err);
					}
				};
				img.src = filename;
				document.getElementsByTagName("body")[0].appendChild(img);
			} else {
				if(callback){
					fileref.onload = function () {
						callback();
					};
					fileref.onerror = function (err) {
						callback(err);
					};
				}
			}
		} else {
			fileref.setAttribute("src", filename);
			if(callback){
				fileref.onload = function () {
					callback();
				};
				fileref.onerror = function (err) {
					callback(err);
				};
			}
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	},
	/**
	 * @param [filecontent]
	 * @param [callback]
	 */
	loadJSContent : function(filecontent, callback){

		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
//		fileref.setAttribute("charset", "UTF-8");
		var text = document.createTextNode(filecontent);
		fileref.appendChild(text);

		document.getElementsByTagName("head")[0].appendChild(fileref);
		if(callback){
			callback();
		}
	},
	/**
	 * @param [filecontent]
	 * @param [callback]
	 */
	loadCSSContent : function(filecontent, callback){
		var fileref=document.createElement('style');
		var text = document.createTextNode(filecontent);
		fileref.appendChild(text);
		document.getElementsByTagName("head")[0].appendChild(fileref);
		if(callback){
			callback();
		}
	},

	/**
	 * Gets document url parameter for given key
	 * @param key
	 * @returns {string}
	 */
	getRequestParam: function(key){
		if(key=(new RegExp('[?&]'+encodeURIComponent(key)+'=([^&]*)')).exec(location.search))
			return decodeURIComponent(key[1]);
	},

	/**
	 * Returns all document url parameters as an object
	 * @returns {object}
	 */
	getAllRequestParams: function(){
		var result = {};
		if (window.location.search){
			// split up the query string and store in an associative array
			var params = window.location.search.slice(1).split("&");
			for (var i = 0; i < params.length; i++)
			{
				var tmp = params[i].split("=");
				result[tmp[0]] = unescape(tmp[1]);
			}
		}

		return result;
	},

	/**
	 * Adds given key value pair to given url as a parameter
	 * @param url
	 * @param key
	 * @param value
	 */
	addParamToUrl: function(url, key, value){
		if(url.indexOf("?") >= 0){
			return url + "&" + encodeURIComponent(key) +"="+ encodeURIComponent(value);
		}
		return url +"?" +encodeURIComponent(key) +"="+encodeURIComponent(value);
	},
	/**
	 * @param [bf]
	 * @param [value]
	 * @param [assignMap]
	 */
	setValue: function(bf, value, assignMap){
		if(!value){
			return;
		}
		if(assignMap){
			for(var prop in assignMap){
				var val = BEANUtils.getValue(value, assignMap[prop]);
				BEANUtils.rmPath(value, assignMap[prop]);
				var innerbf = BFEngine.get(prop, bf);
				if(innerbf){
					innerbf.setValue(val);
				}
			}
		}
		var temp = bf.$CS$.assignmap;
		delete bf.$CS$.assignmap;
		bf.setValue(value);
		bf.$CS$.assignmap = temp;
	},
	/**
	 * @param [business]
	 * @param [messages]
	 * @param [options]
	 */
	showValidationError: function(business, messages, options){
		if(!business){
			return;
		}
		if(!Array.isArray(messages)){
			messages = [messages];
		}
		var assignMap;
		if(business.$CS$.assignmap){
			assignMap = BEANUtils.reverseObject(business.$CS$.assignmap);
		}
		for(var i=0; i<messages.length ;i++){
			var field = messages[i].field;
			if(!field){
				continue;
			}
			if(assignMap && assignMap[field]){
				var bf = BFEngine.get(assignMap[field], business);
			} else {
				var bf = BFEngine.get(field, business);
			}
			if(!bf){
				console.error(field + " not found (for validation error)");
				continue;
			}
			bf.bcRef.putValidationMessage(messages[i].text);
		}
	},
	/**
	 * @param [business]
	 */
	getInnerTables: function(business){
		var result = [];
		if(!business || !business.members){
			return result;
		}
		for(var mname in business.members){
			var member = business.members[mname];
			if( member.$CS$.definition.SCR && (member.$CS$.definition.SCR.layout === "CSC-TABLE") ){
				result.push(member);
			}
		}
		for(var mname in business.members){
			result = result.concat(this.getInnerTables(business.members[mname]));
		}
		return result;
	},

	/**
	 * Returns whether given object is empty.
	 * null, "", undefined, 0 and false accepted as empty.
	 * "deep"parameter causes resursive empty control.
	 * @example
	 *  returns true if deep parameter is true: null, 0, {}, {a: {}}, {a: {b:{}}}, {a: []}
	 *  returns true regardless of whether deep parameter is given: null, 0, {}
	 *  returns false regardless of whether deep parameter is given: {a: {x:5}}, {a: {x:0}} , {a: false}
	 * @param obj - object to process
	 * @param {boolean} [deep=false] - deep process checks object's children also.
	 * @returns {boolean}
	 */
	isEmpty: function(obj, deep){
		if (!obj){
			return true;
		}
		if (Array.isArray(obj)){
			return obj.length === 0;
		}
		for (var key in obj) {
			if (obj.hasOwnProperty(key)){
				if(!deep){
					return false;
				}
				if(typeof obj[key] == "object"){
					if(!this.isEmpty(obj[key], deep)){
						return false;
					}
				} else {
					return false;
				}
			}
		}
		return true;
	},

	/**
	 * @function scrollToBf
	 * @description vdk için yazıldı. basitçe verilen bf ye window scroll yapar.daha alt düzeyde scroll varsa akıllı davranmaz.
	 * @param [bf]
	 * @param [referToOwnContainer] True olursa verilen BF'yi scroll edilmiş olan ilk atasına göre konumlandırır.
	 */
	scrollToBf : function(bf, referToOwnContainer){
		if(!bf){
			return;
		}
		var $$dom = $$.byid(bf.bcRef.config.id);
		if($$dom){
			var x = csdu.findPositionX($$dom);
			var y = csdu.findPositionY($$dom);
			if(y && y > 0){
				if(referToOwnContainer){
					var parent = $$dom.parentNode;
					while(parent){
						if(parent.scrollTop > $$dom.offsetTop){
							parent.scrollTop = $$dom.offsetTop;
							break;
						}
						parent = parent.parentNode;
					}
				}else{
					window.scrollTo(x,y);
				}
			}
		}
	},
	/**
	 * @param [bf]
	 * @param [clazz]
	 * @param [duration]
	 * @param [callback]
	 */
	addClassToBfWithAnimation: function(bf, clazz, duration, callback){
		if(!bf || typeof bf === "string"){
			return;
		}
		window.$("#"+bf.getConfig().id).addClass(clazz, duration || 666, "linear", callback);
	},
	/**
	 * @param [bf]
	 * @param [clazz]
	 * @param [duration]
	 * @param [callback]
	 */
	removeClassFromBfWithAnimation: function(bf, clazz, duration, callback){
		if(!bf || typeof bf === "string"){
			return;
		}
		window.$("#"+bf.getConfig().id).removeClass(clazz, duration || 666, "linear", callback);
	},


	/**
	 * @function bindKey
	 * @description
	 * Nesnelere klavye kısayolu bağlamak için kullanılır.
	 * Aşağıya parametre örnekleri koydum. opt -> paramtrenin optional olduğunu, default ise default değerini belirtiyor
	 * @param [bf] Kısayol bağlanılması istenilen Side nesnesidir (input nesnesi). document veya window da olabilir.
	 * @param [keys] Klavye kısayolu kombinasyonunu tanımlayan String dizisidir. Büyük harf olmalıdır
	 * @example ["CTRL", "S"] veya ["CTRL", "SHIFT", "2"].
	 * @param [callback] Kısayol yakalandığında çalıştırılacak olan fonksiyondur.
	 ***/
	bindKey: function(bf, keys, callback){
		if(!bf || !callback){ return; }
		var $$dom = bf;
		var id;
		if(bf !== window && bf !== document){
			id = bf.bcRef.config.id;
			$$dom = $$.byid(id);
		}
		if(!$$dom){ return; }

		$$dom.addEventListener("keydown", function(event){
			var pressedStatus = [];
			for(var key in keys){
				key = keys[key].toLocaleUpperCase();

				if(key === "CTRL"){
					if(event.ctrlKey) { pressedStatus.push(true); }
				}else if(key === "ALT"){
					if(event.altKey) { pressedStatus.push(true); }
				}else if(key === "SHIFT"){
					if(event.shiftKey) { pressedStatus.push(true); }
				}else if(String.fromCharCode(event.keyCode) === key){
					pressedStatus.push(true);
				}
			}

			if(pressedStatus.length === keys.length){
				event.preventDefault();
				try {
					BFEngine.a();
					callback();
					return false;
				} finally {
					BFEngine.r();
				}
			}

		}, true);
	},
	/**
	 * Returns is side param from is enabled or not.
	 */
	isSideFormModeEnabled: function(){
		if(designerParamFormOid!="null"){
			return true;
		}
		return false;
	},
	clone: function(object, deep){
		return csCloneObject(object, deep);
	}
};

window.SNavigator = window.SIDENavigator = new function(){
	var this_ = this;
	this.insCounter = 1000;
	this.insPrefix = "$DynTab-";
	this.mainTab = null;
	this.mainTabs = {};
	this.popupMainTabs = {};
	this.mainTabListeners = [];

	this.setEvent = function(event){
		this.e = event;
	};

	this.getEvent = function(){
		return this.e;
	};

	this.getContext = function(bf, options){
		var result = [];
		while(bf){
			var bfName = bf.$CS$.definition.BF_NAME;
			if(bfName.indexOf("$$") > 0){//util def
				bf = bf.$CS$.parent;
				continue;
			}
			if(bfName.indexOf(".") > 0){
				bfName = bfName.substring(bfName.indexOf(".")+1);
			}
			if(options && options.getObject){
				result.push(bf);
			} else {
				result.push(bf.getBusinessName());
			}
			bf = bf.$CS$.parent;
			if(!bf || bf.getConfig().mainTab){
				break;
			}
		}
		return result;
	};

	this.getPopupMainTab = function(moduleName){
		return this.popupMainTabs[moduleName];
	};

	this.setPopupMainTab = function(moduleName, mainTab){
		this.popupMainTabs[moduleName] = mainTab;
	};

	this.setMainTab = function(name, mainTab){
		//eski kullanımı desteklemek için
		if(typeof name != "string"){
			mainTab = name;
			name = null;
		}

		for(var i=0; i<this.mainTabListeners.length ;i++){
			this.mainTabListeners[i](name, mainTab);
		}

		if(mainTab){
			mainTab.setConfig("mainTab", true, false);
		}
		if(!name){
			this.mainTab = mainTab;
		} else {
			this.mainTabs[name] = mainTab;
		}
	};

	this.findMainTab = function(bf){
		if(!bf || !(bf instanceof BFBase)){
			return;
		}
		var found = null;
		while(bf){
			if(bf.getConfig().mainTab){
				found = bf;
				break;
			}
			bf = bf.$CS$.parent;
		}
		if(!found){
			return;
		}
		for(var tabname in this.mainTabs){
			if(this.mainTabs[tabname] == found){
				return tabname;
			}
		}
	};

	this.getMainTab = function(name, bf){
		if(!name){
			return this.mainTab;
		}

		if(bf){
			var mainTabFound = false,parent = bf.$CS$.parent;
			while(parent){
				if(parent.bcRef.config.mainTab){
					mainTabFound = true;
					break;
				}
				parent = parent.$CS$.parent;
			}
			if(mainTabFound){
				return parent;
			}
		}

		return this.mainTabs[name];
	};
	this.addMainTabListener =  function(callback){
		this.mainTabListeners.push(callback);
	};

	this.addToMainTab = function(BFName, config, options,callback){
		//Eski kullanımları desteklenemk icin (eskiden 3. parametre callback idi)
		//Hem options hem callback ihitacı için callback parametresi eklendi.
		if(typeof options == "function"){
			var func = options;
			options = {
				onload: func
			};
		}
		options = options || {};
		var maintab = this.mainTab;
		if(options.maintab){
			maintab = this.mainTabs[options.maintab];
		}
		if(!maintab){
			console.info("maintab not found. page will be rendered to popup.");
			config = config || {};
			config.onload = options.onload;
			this.renderToPopup(BFName, config, options);
			return;
		}
		config = csCloneObject(config || {}, true);
		for(var memname in maintab.members){
			if(config.holdOldTab){
				var equal = false;
				var tabBfName = maintab.members[memname].$CS$.definition.BF_NAME;
				if(tabBfName == BFName){
					equal = true;
				} else if(tabBfName.indexOf(".") > 0 && tabBfName.substring(tabBfName.indexOf(".")+1) == BFName){
					equal = true;
				}
				if(equal){
					if(maintab.selectTab){
						maintab.selectTab(memname);
					} else {
						maintab.select(memname);
					}

					if(options && options.onload){
						options.onload(maintab.members[memname]);
					}
					return;
				}
			} else {
				if(!config.createNew){
					var equal = false;
					var tabBfName = maintab.members[memname].$CS$.definition.BF_NAME;
					if(tabBfName == BFName){
						equal = true;
					} else if(tabBfName.indexOf(".") > 0 && tabBfName.substring(tabBfName.indexOf(".")+1) == BFName){
						equal = true;
					}
					if(equal){
						this.removeFromMainTab(maintab.members[memname], maintab, false);
					}
				}
			}
		}
		if(options.memberName && maintab.members[options.memberName]){
			if(maintab.selectTab){
				maintab.selectTab(options.memberName);
			} else {
				maintab.select(options.memberName);
			}
			return;
		}
		var name = (options && options.memberName) ? options.memberName : (this.insPrefix +(++this.insCounter));
		var initParam = options ? options.initParam : undefined;
		var progress = CSPopupUTILS.ProgressBar(SideMLManager.get("CS-UTIL.waitPageLoading"));
		//burada önce tanım sunucudan getirilir, sonra main tab'a ekleme yapılır.
		maintab.addMember(BFName, name, config, initParam, function(err, result) {
				if(err || !result){
					progress.close();
					CSPopupUTILS.MessageBox(SideMLManager.get("CS-UTIL.screenCouldNotLoad",BFName) + "\n" + err, {error: true});
					return;
				}
				if(maintab.selectTab){
					//#hakand => önemli: burada ikinci parametre true yapılmamalı, addToMainTab yapılınca eklenen tab pasif olarak kalıyor.
					//Daha sonra burada sürekli selecttab yapmaması için önlem düşünülmeli.
					maintab.selectTab(name, false);
				} else {
					maintab.select(name);
				}
				progress.close();
				if(options && options.onload){
					options.onload(maintab.members[name]);
				}

				if(callback && (typeof callback == "function")){
					callback(maintab.members[name]);
				}

				if(getSideDefaults("focus-first-component-on-page-opening") !== false){
					var focusableBF = BFEngine.getFocusableBF(maintab.members[name]);
					if(focusableBF)
						BFEngine.focusRequest(focusableBF);
				}
			}
		);
	};

	this.removeFromMainTab = function(bf, maintab, selectPrev){
		if(typeof maintab == "string"){
			maintab = this.mainTabs[maintab];
		}
		if(!maintab){
			maintab = this.mainTab;
		}
		var tabName = this.findTabNameInMainTab(bf, maintab);
		if(!tabName){
			return;
		}
		if(maintab.closeTab){
			maintab.closeTab(tabName, selectPrev);
		} else {
			maintab.close(tabName, selectPrev);
		}
	};

	this.findTabNameInMainTab = function(bf, maintab){
		if(typeof maintab == "string"){
			var popMainTab = this.popupMainTabs[maintab];
			if(popMainTab){
				maintab = popMainTab;
			}
		}
		if(typeof maintab == "string"){
			maintab = this.mainTabs[maintab];
		}
		if(!maintab){
			maintab = this.mainTab;
		}

		var found = null;
		while(bf && bf.$CS$.parent){
			if(bf.$CS$.parent == maintab){
				found = bf;
				break;
			}
			bf = bf.$CS$.parent;
		}
		if(!found){
			return;
		}
		return bf.$CS$.name;
	};

	this.scrollIntoView = function(bf){
		if(!bf){
			return;
		}
		if(!(bf instanceof BaseBF)){
			throw "bf parameter must be a business field.";
		}
		var dom = $$.byid(bf.bcRef.getHtmlId());
		if(dom){
			dom.scrollIntoView();
		}
	};
	/**
	 * @function renderToDiv
	 * @param [div] html elemnent yada html element id olabilir
	 * @param [bf] bir BF name yada BF instance olabilir
	 * @param [config] bf paramtresi bir BF name olduğunda anlamlıdır
	 * @param [options]
	 */
	this.renderToDiv = function(div, bf, config, options, callback){
		options = options || {};
		callback = callback || options.callback;
		if(typeof div == "string"){
			div = $$.byid(div);
		}
		if(!div || !$$.isDomElement(div)){
			console.error("parameter div is not a html element.");
			return;
		}
		if(typeof bf == "string"){
			BFEngine.loadDefinition(bf, function(err, result) {
				if(err){
					if(!options.omitErrors){
						SPopup.MessageBox(bf + " isimli sayfa yüklenemedi. Lütfen daha sonra tekrar deneyiniz.", {error: true});
					}
					callback && callback(err || true);//failure callback çizmeden önce çağır
					return;
				}
				bf = BFEngine.create({BF:bf, name:"testBF", config: config}, "dyn"+SIDEUtil.generateId(), options && options.initParam);
				if(options.parent){
					bf.$CS$.parent = options.parent;
					options.parent.members[bf.getMemberName()] = bf;
					if(!options.parent[bf.getMemberName()]){
						options.parent[bf.getMemberName()] = bf;
					}
				}

				BFEngine.renderTo(div, bf);

				var focusableBF = BFEngine.getFocusableBF(bf);
				if(focusableBF)
					BFEngine.focusBF(focusableBF);
				if(config && typeof config.onload == "function"){
					config.onload(bf);
				}

				if(callback){
					callback();//success callback çizdikten sonra çağır
				}
			});
		}else{
			BFEngine.renderTo(div, bf);
			var focusableBF = BFEngine.getFocusableBF(bf);
			if(focusableBF)
				BFEngine.focusBF(focusableBF);
			if(config && typeof config.onload == "function"){
				config.onload(bf);
			}
			if(callback){
				callback();//success callback çizdikten sonra çağır
			}
		}
	};

	/**
	 * @function renderToPopup
	 * @param [bf] bir BF name olabilir
	 * @param [config] bf paramtresi en az width ve height degerlerini icermelidir
	 * @param [options]
	 * @param [callback]
	 */
	this.renderToPopup = function(bf, config, options, callback){
		config = config || {};
		if(typeof options == "function"){
			callback = options;
			options = null;
		}
		if(typeof bf == "string"){
			return BFEngine.loadDefinition(bf, function(err) {
				options = options || {};
				if(err){
					if(!options.omitErrors){
						SPopup.MessageBox(bf + " sayfası yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyiniz.", {error: true});
					}
					callback(null);
					return;
				}
				if(config.cssClass){
					var def = BFEngine.getDefinition(bf);
					if(def && def.SCR.cssClass){
						config.cssClass += " "+ def.SCR.cssClass;
					}
				}
				bf = BFEngine.create({BF:bf, name:"ref", config: csCloneObject(config, true)}, "dyn"+SIDEUtil.generateId(), options && options.initParam);

				var moduleName = bf.getModuleName();
				var maintab = SIDENavigator.getMainTab(moduleName);

				if(maintab){
					// Popup açıldıktan sonra sorun çıkarttı.
					options.parent = maintab.getSelectedTab();
				}

				preRender(bf, options.parent);
			});
		} else {
			preRender(bf);
		}

		function preRender(bf, parent){

			var moduleName = bf.getModuleName();

			if(options && options.createSession && !CSSession.tokens[moduleName]){
				var url = SideModuleManager.getAppUrl(moduleName, "assos-login");
				var progress = CSPopupUTILS.ProgressBar(SideMLManager.get("CS-UTIL.waitAppOpening"));
				SideModuleManager.createSession(moduleName, {url: url}, function(success, msg){
					progress.close();
					render(bf,parent);
					callback && callback(bf);
				});
			}else{
				render(bf,parent);
				callback && callback(bf);
			}
		}

		function render(bf, parent){
			if(!config.width){
				config.width = bf.getConfig("layoutConfig.width") || bf.getConfig("layoutConfig.minWidth") || bf.getConfig("style.width") || 1000;
			}
			if(config.width == "full"){
				config.width = $$.innerWidth(window);
			}
			if(config.height == "full"){
				config.height = $$.innerHeight(window);
				config.top = 0;
			}
			var popupBF = BFEngine.newDefinition("$$DynPopup", "CSC-POPUP", {}, {layout: "CSC-POPUP",style:{width: config.width, height: config.height}, cssClass: config.cssClass, title: config.title, showCloseIcon:config.showCloseIcon, closeOnEsc:config.closeOnEsc, overlayExist:config.overlayExist, showMaximizeIcon:config.showMaximizeIcon, contextMenu: config.contextMenu, noThemeClass: config.noThemeClass, resizable: config.resizable, relativeTo:config.relativeTo, reverseHor:config.reverseHor, relativeToRightBottom:config.relativeToRightBottom, left: config.left, top: config.top}, bf.events);

			var popupConfig = {
				title: config.title,
				specialid: config.specialid,
				style: {
					width: config.width,
					height: config.height,
					"zIndex": config.zIndex
				},
				closeOnOverlayClick: config.closeOnOverlayClick
			};

			var childBf = {
				name : "$$popup",
				BF : "$$DynPopup",
				config : popupConfig
			};
			var member = BFEngine.create(childBf, "dyn-popup", options && options.initParam);

			member.members.child = bf;
			member.child = bf;
			bf.$CS$.parent = member;

			if(parent){
				member.$CS$.parent = parent;
				parent.members[member.getMemberName()] = member;
				if(!parent[member.getMemberName()]){
					parent[member.getMemberName()] = member;
				}
			}

			if(typeof config.oninit == "function"){
				config.oninit(bf, member);
			}

			member.open(config.global, {maximizeCallback:config.maximizeCallback, minimizeCallback:config.minimizeCallback});

			var focusableBF = BFEngine.getFocusableBF(bf);
			if(focusableBF) {
				BFEngine.focusBF(focusableBF);
			}

			if(typeof config.onload == "function"){
				config.onload(bf, member);
			}
		}
	};

	this.clearWarningNotifies = function(){
		var $$notifierDiv = $$.byid("cs-notifier-div");
		if(!$$notifierDiv){
			return;
		}
		$$.remove($$.getChildsHasClass($$notifierDiv, "csc-notifer-warning"));

		var $$msgSpans = $$.getChildsHasClass($$notifierDiv, "csc-notifier-msg");
		if(!$$msgSpans.length){
			$$notifierDiv.style.display = "none";
		}
	};

	this.notify = function(text, options){
		options = options || {};
		if(!options.notime){
			var id="note-"+ (new Date().getTime());
			text = "<b id='"+id+"' style='color: red;'>"+SIDEDateUtil.getFormattedDateByDate(new Date(), "HH:MM") + "</b> " +text;
			setTimeout(function(){
				var $$bdom = $$.byid(id);
				if($$bdom){
					$$bdom.style.color = "";
				}
			}, 60000);
		}
		var $$notifierDiv = $$.byid("cs-notifier-div");


		if(!$$notifierDiv){
			$$notifierDiv = $$.create("DIV", {id: "cs-notifier-div"}, ["csc-notifer", CSSession.get("SIDE-THEME")]);
			var $$closeBtn = $$.create("SPAN",undefined, "csc-notifier-close");
			$$closeBtn.innerHTML = "x";
			$$closeBtn.onclick = hideNotifier;
			$$notifierDiv.appendChild($$closeBtn);
			$$.body().appendChild($$notifierDiv);
		}
		if(options.clear){
			clearMessages();
		}
		var $$msgSpan = $$.create("SPAN", undefined, "csc-notifier-msg");
		if(options.warning){
			$$.addClass($$msgSpan, "csc-notifer-warning");
		}
		if(options.succes){
			$$.addClass($$msgSpan, "csc-notifer-success");
		}
		if(options.error){
			$$.addClass($$msgSpan, "csc-notifer-error");
		}
		$$notifierDiv.appendChild($$msgSpan);
		$$msgSpan.innerHTML = text;
		$$notifierDiv.style.display = "block";
		$$notifierDiv.style.left = Math.floor((window.innerWidth-800)/2)+"px";

		if(options && options.timeout){
			if(!this.varTimers)
				this.varTimers = [];
			if(!this.varTimersId)
				this.varTimersId = [];

			this.varTimers.push(setTimeout(function(){ hideNotifier(id); },options.timeout));
			this.varTimersId.push(id);
		}

		function clearMessages(){
			var $$msgSpans = $$.getChildsHasClass($$notifierDiv, "csc-notifier-msg");
			for(var i=0; i<$$msgSpans.length ;i++){
				$$.remove($$msgSpans[i]);
			}
			$($$notifierDiv).hide();
		}

		var thiz = this;
		function hideNotifier(id){
			var msgs = $$.getChildsHasClass($$notifierDiv, "csc-notifier-msg");
			if(!id || typeof id !== "string" || ( msgs && msgs.length < 2) ){	// komple kapat
				$($$notifierDiv).hide("highlight", function(){
					clearMessages();
				});

				while(thiz.varTimers && thiz.varTimers.length > 0){
					clearTimeout(thiz.varTimers.pop());
				}
				thiz.varTimersId = [];
			}else{				// mesajları kapat
				var $$div = $$.byid(id).parentNode;
				$($$div).hide("highlight", function(){
					var $$div = $$.byid(id).parentNode;
					$$div.parentNode.removeChild($$div);

					// Aynı anda timeout verilince çıkan sorunu düzeltmek için.
					var tmpNotifierDiv = $$.byid("cs-notifier-div");
					if(tmpNotifierDiv.childNodes.length < 2){
						clearMessages();
					}
				});

				for(var i=0; thiz.varTimersId && i<thiz.varTimersId.length; i++){
					if(thiz.varTimersId[i] === id){
						clearTimeout(thiz.varTimers[i]);
						thiz.varTimers.splice(i,1);
						thiz.varTimersId.splice(i,1);
						break;
					}
				}
			}
		}

	};
};

window.BEANUtils = window.SObject = {
	/**
	 * Clones given object and returnd cloned object.
	 * @param object - object to clone
	 * @param {boolean} [deep=false] - Clone object fully (with deep childs)
	 */
	clone: function (objcet, deep) {
		return csCloneObject(objcet, deep);
	},

	/**
	 * @param [data]
	 * @param [path]
	 */
	getValue: function(data, path){
		if(!data){
			return undefined;
		}
		if(!path){
			return data;
		}
		var props = path.split(".");
		for(var i=0; i<props.length-1 ;i++){
			if(typeof data[props[i]] != "object"){
				return undefined;
			}
			data = data[props[i]];
		}
		return data[props[props.length-1]];
	},
	/**
	 * @param [data]
	 * @param [path]
	 */
	rmPath: function(data, path){
		if(!data || !path){
			return;
		}
		var objs = [], parent=data;
		var props = path.split(".");
		for(var i=0; i<props.length ;i++){
			if(parent[props[i]] === undefined || parent[props[i]] === null){
				break;
			}
			objs.push({
				p: parent,
				n: props[i],
				o: parent[props[i]]
			});
			parent = parent[props[i]];
		}
		for(var i=objs.length-1 ;i>=0 ;i--){
			if(this.isEmpty(objs[i].o)){
				delete objs[i].p[objs[i].n];
			}
		}
	},
	/**
	 * @param [data]
	 * @param [path]
	 * @param [value]
	 */
	setValue: function(data, path, value){
		if(!data){
			return;
		}
		if(!path){
			return;
		}
		var props = path.split(".");
		for(var i=0; i<props.length-1 ;i++){
			if(typeof data[props[i]] === "undefined"){
				data[props[i]] = {};
			}
			if(typeof data[props[i]] != "object"){
				return;
			}
			data = data[props[i]];
		}
		data[props[props.length-1]] = value;
	},
	/**
	 * @param [object] {string}
	 */
	reverseObject: function(object){
		if(!object || typeof object != "object"){
			return object;
		}
		var result = {};
		for(var key in object){
			result[object[key]] = key;
		}
		return result;
	},
	/**
	 * @param [object]
	 */
	isEmpty: function(object){
		if(!object){
			return true;
		}
		if(typeof object != "object"){
			return true;
		}
		for(var p in object){
			return false;
		}
		return true;
	},
	/**
	 * Paramtre ile gönderilen objede fields içideki alanlardan birisi "",undefined yada null ise true döner
	 * @param [object]
	 * @param [fields]
	 */
	hasEmptyField: function(object, fields){
		if(!fields || !fields.length){
			return false;
		}
		if(!object){
			return true;
		}
		for(var i=0; i<fields.length ;i++){
			if(object[fields[i]] === undefined || object[fields[i]] === null || object[fields[i]] === ""){
				return true;
			}
		}
		return false;
	},

	defaults: function(destination, source){
		return csDefaults(destination, source);
	},

	applyDefaultValues: function(destination, defaults){
		if(!destination){
			return destination;
		}
		if(!defaults){
			return csCloneObject(destination, true);
		}
		for(var prop in defaults){
			if(!destination[prop]){
				destination[prop] = csCloneObject(defaults[prop], true);
				continue;
			}
			if(typeof destination[prop] == "object"){
				csDefaults(destination[prop], defaults[prop]);
			}
		}
		return destination;
	}
};

window.SIDEMath = window.SMath = {
	/**
	 * @param [toShared]
	 * @param [percents]
	 */
	proportionalShare: function(toShared, percents){
		var shares = [], totalPercent = 0;
		for(var i=0; i<percents.length ;i++){
			totalPercent += percents[i];
		}
		var sharedTotal = 0;
		for(var i=0; i<percents.length ;i++){
			shares[i] = Math.floor(toShared*percents[i]/totalPercent);
			sharedTotal += shares[i];
		}
		if(toShared != sharedTotal){
			for(var i=0; i<shares.length ;i++){
				shares[i] = shares[i]+1;
				sharedTotal++;
				if(toShared == sharedTotal){
					break;
				}
			}
		}
		return shares;
	},
	/**
	 * @param [toShared]
	 * @param [percents]
	 * @param [mins]
	 */
	proportionalShare2: function(toShared, percents, mins){
		var shares = [];
		if(!Array.isArray(mins)){
			mins = [];
		}
		while(true){
			var totalPercent = 0;
			for(var i=0; i<percents.length ;i++){
				totalPercent += percents[i];
			}
			var sharedTotal = 0, notComplated = false;
			for(var i=0; i<percents.length ;i++){
				shares[i] = 0;
				if(!percents[i]){
					continue;
				}
				shares[i] = Math.floor(toShared*percents[i]/totalPercent);
				if(shares[i] < mins[i]){
					shares[i] = mins[i];
					notComplated = true;
					percents[i] = 0;
					toShared -= mins[i];
					break;
				}
				sharedTotal += shares[i];
			}
			if(!notComplated){
				break;
			}
		}
		if(toShared > sharedTotal){
			for(var i=0; i<shares.length ;i++){
				shares[i] = shares[i]+1;
				sharedTotal++;
				if(toShared == sharedTotal){
					break;
				}
			}
		}
		return shares;
	},
	/**
	 * @param [number]
	 * @param [dec]
	 */
	formatDecimal: function(number, dec, decSep, thSep){
		thSep = thSep || "", decSep = decSep || ".";
		if(number === undefined || number === null || dec === undefined || dec === null){
			return number;
		}
		if(typeof number != "string"){
			number = ""+ number;
		}
		if(number.indexOf(decSep) < 0){
			number = number + decSep;
		}
		number.replace(thSep,"");
		var dotIndex = number.indexOf(decSep);
		if(dec == 0){
			var result = number.substring(0, dotIndex);
			if(thSep){
				return result.replace(/\B(?=(\d{3})+(?!\d))/g, thSep);
			}
			return result;
		}
		if(dotIndex+dec > number.length-1){
			for(var i=number.length-1 ; i<dotIndex+dec ;i++){
				number = number+"0";
			}
		} else if(dotIndex+dec < number.length-1){
			number = number.substring(0, dotIndex+dec+1);
		}
		if(thSep){
			return number.replace(/\B(?=(\d{3})+(?!\d))/g, thSep);
		}
		return number;
	},
	formatNumber: function(number, decSep, thSep, decCount){
		thSep = thSep || "", decSep = decSep || ".";
		if(typeof number != "string"){
			number = ""+ number;
		}
		if(decSep != "."){
			number = number.replace(".", decSep);
		}
		var dotIndex = number.indexOf(decSep);
		if(decCount === 0){
			var result = number.substring(0, dotIndex);
			if(thSep){
				return result.replace(/\B(?=(\d{3})+(?!\d))/g, thSep);
			}
			return result;
		}
		if(decCount > 0){
			if(number.indexOf(decSep) < 0){
				number = number + decSep;
			}
			if(dotIndex+decCount > number.length-1){
				for(var i=number.length-1 ; i<dotIndex+decCount ;i++){
					number = number+"0";
				}
			} else if(dotIndex+decCount < number.length-1){
				number = number.substring(0, dotIndex+decCount+1);
			}
		}
		if(thSep){
			if(dotIndex < 0){
				return number.replace(/\B(?=(\d{3})+(?!\d))/g, thSep);
			}
			var dec = number.substring(dotIndex+1);
			return number.substring(0, dotIndex).replace(/\B(?=(\d{3})+(?!\d))/g, thSep)+decSep+dec;

		}
		return number;
	}
};

window.SString = window.SIDEString = new function(){
	var upperToUpperLettersEng = { "İ": "I", "Ş": "S", "Ğ": "g", "Ü": "U", "Ö": "O", "Ç": "C", "I": "I" };
	var lowerLettersEng = { "i": "I", "ş": "S", "ğ": "g", "ü": "U", "ö": "O", "ç": "C", "ı": "I" };
	var lowerLetters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
	var upperLetters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
	/**
	 * Replaces Turkish letters with English and converts
	 * the string to uppercase
	 * @param string - string
	 * @returns {string}
	 */
	this.turkishToEngUpperCase = function(string){
		string = string.replace(/(([iışğüçö]))/g, function(letter){ return lowerLettersEng[letter]; });
		string = string.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return upperToUpperLettersEng[letter]; });
		return string.toUpperCase();
	};

	/**
	 * Replaces Turkish letters with English and converts
	 * the string to lowercase
	 * @param string - string
	 * @returns {string}
	 */
	this.turkishToEngLowerCase = function(string){
		string = string.replace(/(([iışğüçö]))/g, function(letter){ return lowerLetters[letter]; });
		string = string.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return upperLetters[letter]; });
		return string.toLowerCase();
	};

	/**
	 * Converts the string to Uppercase
	 * @param string - string
	 * @returns {string}
	 */
	this.turkishToUpperCase = function(string){
		if(typeof string == "number"){
			string = ""+string;
		}
		string = string.replace(/(([iışğüçö]))/g, function(letter){ return lowerLetters[letter]; });
		return string.toUpperCase();
	};

	/**
	 * Converts the string to Lowercase
	 * @param string - string
	 * @returns {string}
	 */
	this.turkishToLoverCase = function(string){
		if(typeof string == "number"){
			string = ""+string;
		}
		string = string.replace(/(([İIŞĞÜÇÖ]))/g, function(letter){ return upperLetters[letter]; });
		return string.toLowerCase();
	};

	/**
	 * Checks if the string starts with the given prefix
	 * @param string - string
	 * @param string - prefix
	 * @returns {boolean}
	 */
	this.startsWith = function(str, prefix) {
		if(typeof str != "string"){
			return false;
		}
		return str.indexOf(prefix) == 0;
	};

	/**
	 * Checks if the string ends with the given suffix
	 * @param string - string
	 * @param string - suffix
	 * @returns {boolean}
	 */
	this.endsWith = function(str, suffix) {
		if(typeof str != "string"){
			return false;
		}
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};

	/**
	 * Returns extension string of the given mime type string
	 * @param string - str
	 * @returns {string}
	 */
	this.ifMimeTypeConvertToExtension = function(str){
		var index = str.search("/");
		if(index == -1){
			return str;
		}else{
			return str.substring(index+1, str.length);
		}
	};

	/**
	 * Checks if the string is empty
	 * @param string - str
	 * @returns {string}
	 */
	this.isEmpty = function(str){
		return (!str || /^\s*$/.test(str));
	};

	this.trim = function(str){
		if(!str){
			return str;
		}
		return str.replace(/^\s+|\s+$/g, '');
	};
};

window.SArray = new function(){
	/**
	 * Checks whether given value is in array.
	 * if given array is an array of objects then equality is checked on given property of object.
	 * @param array - array
	 * @param value - value
	 * @param [property] - property
	 * @returns {boolean}
	 */
	this.isInIt = function(array, value, property){
		if(!array){
			return false;
		}
		if(!property){
			return array.indexOf(value) >= 0;
		}
		for(var i=0; i<array.length ;i++){
			if(array[i][property] == value){
				return true;
			}
		}
		return false;
	};

	/**
	 * Searchs given key in array and returns found items.
	 * If array is an array of objects then search comperation will make according to propName parameter.
	 * If multiple results accepted then multiResult parameter must be give with true value
	 * @param {array} array - Array to be searched.
	 * @param searchKey - Search key to be used in search.
	 * @param {string} [propName=null] - Object's property name to be used in comperation if given array is an object array
	 * @param {boolean} [multiResult=false] - If multiple result expected then multiResult must be set to "true". If multiResult parameter is set to true result returns as array
	 * @return found item in array. If not found returns null.  If multiResult parameter is set to true then returns found items as array (if no items found returns empty array).
	 */
	this.find = function(array, searchKey, propName, multiResult){
		var result = multiResult ? [] : null, item, equal;
		for(var i=0; i<array.length ;i++){
			item = array[i];
			equal = false;
			if(propName){
				if(item[propName] == searchKey){
					equal = true;
				}
			} else {
				if(item == searchKey){
					equal = true;
				}
			}
			if(equal){
				if(multiResult){
					result.push(item);
				} else {
					return item;
				}
			}
		}
		return result || null;
	};

	/**
	 * Searchs given key in array and returns found item index.
	 * If array is an array of objects then search comperation will make according to propName parameter.
	 * If multiple results accepted then multiResult parameter must be give with true value
	 * @param {array} array - Array to be searched.
	 * @param searchKey - Search key to be used in search.
	 * @param {string} [propName=null] - Object's property name to be used in comperation if given array is an object array
	 * @param {boolean} [multiResult=false] - If multiple result expected then multiResult must be set to "true". If multiResult parameter is set to true result returns as array
	 * @return found item index in array. If not found returns -1.  If multiResult parameter is set to true then returns found items as array (if no items found returns empty array).
	 */
	this.indexOf = function(array, searchKey, propName, multiResult){
		var result = multiResult ? [] : null, item, equal;
		for(var i=0; i<array.length ;i++){
			item = array[i];
			equal = false;
			if(propName){
				if(item[propName] == searchKey){
					equal = true;
				}
			} else {
				if(item == searchKey){
					equal = true;
				}
			}
			if(equal){
				if(multiResult){
					result.push(i);
				} else {
					return i;
				}
			}
		}
		return -1;
	};

	/**
	 * returns whether given arrays' values are equal.
	 */
	this.equals = function(array1, array2){
		if(!Array.isArray(array1) || !Array.isArray(array2)){
			return false;
		}
		if(array1.length != array2.length){
			return false;
		}
		for(var i=0; i<array1.length ;i++){
			if(array1[i] !== array2[i]){
				return false;
			}
		}
		return true;
	};

	/**
	 * Clones array
	 * If parameter deep is setted to true then clones array's items too.
	 * @param {array} array - array to clone
	 * @param {boolean} [deep=false] - clone array's elements too
	 */
	this.clone = function(array, deep){
		if(!deep){
			return array.slice();
		}
		var newArr = new Array(array.length), item;
		for(var i=0; i<array.length ;i++){
			item = array[i];
			if(Array.isArray(item)){
				newArr[i] = this.clone(item, true);
			} else {
				newArr[i] = csCloneObject(item);
			}
		}
		return newArr;
	}

	/**
	 * Move Array Element
	 * @param {array} array
	 * @param {value} element in array
	 * @param {value} element's new position
	 */
	this.moveElement=function (array, value, positionChange) {
		var oldIndex = array.indexOf(value);
		if (oldIndex > -1){
			var newIndex = positionChange;
			if (newIndex < 0){
				newIndex = 0;
			}else if (newIndex >= array.length){
				newIndex = array.length;
			}
			array = array.slice();
			array.splice(oldIndex,1);
			array.splice(newIndex,0,value);
		}
		return array;
	}
};

window.CSBusinessEvents = function(){
	var bindings = {};
	var reLoginBindings = [];

	this.log = function(){
		console.log("SIDE-ReLogin bindings("+reLoginBindings.length+")");
		console.log("Business bindings:");
		for(var event in bindings){
			console.log("EVENT: " + event);
			for(var i=0; i<bindings[event].length ;i++){
				console.log((i+1)+ ". " + bindings[event][i].who.getBusinessName() +" # "+ bindings[event][i].who.$CS$.name);
			}
		}
	};

	this.on = function(who, eventName, callback){
		if(!who ||  !(who instanceof BaseBF)){
			throw "Parameter 'who' must be business field";
		}
		if(!eventName || !callback){
			throw "Parameters 'eventName' and 'callback' is mandatory.";
		}
		if(typeof callback != "function"){
			throw "Parameters 'callback' must be a function.";
		}
		if(!bindings[eventName]){
			bindings[eventName] = [];
		}
		bindings[eventName].push({who: who, callback: callback});
		who.$CS$.gbeBinding = true;//Global event bağlı olduğu bilgisi
	};

	this.unbind = function(eventName, callback){
		if(eventName == "side-relogin"){
			var binds = reLoginBindings;
		} else {
			var binds = bindings[eventName];
		}
		if(!binds){
			return;
		}
		if(!callback){
			bindings[eventName] = [];
			return;
		}
		for(var i=0; i<binds.length ;i++){
			var bind = binds[i];
			if(bind.callback == callback){
				binds.splice(i, 1);
				return;
			}
		}
	};

	this.destroy = function(who){
		if(!who || !who.$CS$.gbeBinding){
			return;
		}
		for(var event in bindings){
			console.log("EVENT: " + event);
			for(var i=bindings[event].length-1; i>=0 ;i--){
				if(bindings[event][i].who == who){
					bindings[event].splice(i,1);
				}
			}
		}
	};

	this.onReLogin = function(callback){
		reLoginBindings.push({callback: callback});
	};

	this.fire = function(eventName){
		var binds = eventName === "side-relogin" ? reLoginBindings : bindings[eventName];

		if(!binds){
			return;
		}
		//Bir fire işlemi binds'ta azalmaya sebep olabileceği için clone kullanılıyor
		var clonedBinds = SArray.clone(binds);
		for(var i=0; i<clonedBinds.length ;i++){
			var bind = clonedBinds[i];
			bind.callback(bind.who, arguments);
		}
	};
};

window.SGlobalEvents = window.GlobalBusinessEvents = new CSBusinessEvents();

/**
 * @function startsWith
 * @description Bir string verilen bir diğer string ile başlayıp başlamadığını döner.
 * @param [source]
 * @param [key]
 */
function startsWith(source, key){
	return source.indexOf(key) == 0;
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * @function isInIt
 * @description Bir değerin bir dizinin içerisinde olup olmadığına bakar.
 * Karşılaştırma için dizi içindeki elemanların bir property'sine bakılacaksa bu property ismi verilebilir.
 * @param [array]
 * @param [value]
 * @param [property]
 */
function isInIt(array, value, property){
	if(!array){
		return false;
	}
	for(var i=0; i<array.length ;i++){
		if(property){
			if(array[i][property] == value){
				return true;
			}
		} else if(Array.isArray(value)){
			return isInIt(value, array[i]);
		} else {
			if(array[i] == value){
				return true;
			}
		}
	}
	return false;
}

/**
 * @function findInArray
 * @description
 * Bir değerin bir dizinin içerisinde olup olmadığına bakar, varsa inisini döner.
 * Karşılaştırma için dizi içindeki elemanların bir property'sine bakılacaksa bu property ismi verilebilir.
 * @param [array]
 * @param [value]
 * @param [property]
 */
function findInArray(array, value, property){
	if(!array){
		return -1;
	}
	for(var i=0; i<array.length ;i++){
		if(property){
			if(array[i][property] == value){
				return i;
			}
		} else {
			if(array[i] == value){
				return i;
			}
		}
	}
	return -1;
}

function csDefaults(destination, source){
	if(!destination){
		destination = {};
	}
	if(!source){
		return csCloneObject(destination, true);
	}
	for(var prop in source){
		if(typeof destination[prop] == "undefined"){
			destination[prop] = csCloneObject(source[prop], true);
			continue;
		}
		if(destination[prop] === null){
			destination[prop] = null;
		} else if(typeof destination[prop] == "object"){
			csDefaults(destination[prop], source[prop]);
		}
	}
	return destination;
}

function csExtend(destination, source){
	if(!destination){
		destination = {};
	}
	if(!source){
		return destination;
	}
	for(var prop in source){
		if(typeof destination[prop] == "object"){
			csExtend(destination[prop], source[prop]);
		} else {
			destination[prop] = csCloneObject(source[prop], true);
		}
	}
	return destination;
}

function byid(id){
	return document.getElementById(id);
}

function addClassToHtmlElement(id, cls){
	var dom = byid(id);
	if(dom){
		var clzes = dom.className.split(" ");
		for(var i=0; i<clzes.length ;i++){
			if(clzes[i] == cls){
				return;
			}
		}
		dom.className = dom.className + " "+cls;
	}
}

function removeClassToHtmlElement(id, cls){
	var dom = byid(id);
	if(dom){
		var newcls = "";
		var clzes = dom.className.split(" ");
		for(var i=0; i<clzes.length ;i++){
			if(clzes[i] != cls){
				newcls += " " + clzes[i];
			}
		}
		dom.className = newcls;
	}
}

function checkAndAddAttribute(jqueryObj, key, value){
	if(value === undefined || value == null || value == ""){
		return;
	}
	jqueryObj.attr(key, value);
}

function checkAndSetCss(jqueryObj, key, value){
	if(value === null){
		return;
	}
	if(typeof key == "object" && value === undefined){
		jqueryObj.css(key);
	} else {
		jqueryObj.css(key, value);
	}
}

/*Verilen objeji kopyalar. Deep default false'tur.*/
function csCloneObject(obj, deep){
	if(typeof obj != "object"){
		return obj;
	}
	if(obj === null){
		return obj;
	}
	deep = deep === undefined ? false : deep;
	if(Array.isArray(obj)){
		return jQuery.extend(deep, [], obj);
	} else {
		return jQuery.extend(deep, {}, obj);
	}
}

function nthIndexOf(str,ch,n){
	if(!str || !ch || n < 1){
		return -1;
	}
	var count = 0;
	for(var i=0; i<str.length ;i++){
		if(str.charAt(i) == ch){
			count++;
			if(count == n){
				return i;
			}
		}
	}
	return -1;
}

function stringTrim(str){
	if(str === null || str === undefined){
		return str;
	}
	if(typeof str != "string"){
		str = str+"";
	}
	return str.replace(/^\s+|\s+$/g, '');
}

function getPaddingMarginObjFromStr(str, marginObj){
	if(str){
		var arr = str.replace(/\s/g, "").split("px");
		if(arr){
			if(arr.length == 2){
				return {top: parseInt(arr[0]), right: parseInt(arr[0]),bottom: parseInt(arr[0]),left: parseInt(arr[0])};
			}else if(arr.length == 3){
				return {top: parseInt(arr[0]), right: parseInt(arr[1]),bottom: parseInt(arr[0]),left: parseInt(arr[1])};
			}else if(arr.length == 5){
				return {top: parseInt(arr[0]), right: parseInt(arr[1]),bottom: parseInt(arr[2]),left: parseInt(arr[3])};
			}
		}
	}
	return marginObj;
}

function getSideDoc(bf, method, config){

	function extractParams(comment){
		var result = [], pinfo, pdesc, param, delimIndex;
		var paramIndex = comment.indexOf("#param");
		if(paramIndex >= 0){
			comment = comment.substring(paramIndex);
			var params = comment.split("#param");
			for(var i=1; i<params.length ;i++){
				pinfo = params[i].substring(params[i].indexOf("(")+1, params[i].indexOf(")")).replace(/ /g,'');
				delimIndex = pinfo.indexOf(",") || pinfo.length;
				if(delimIndex < 0){
					delimIndex = pinfo.length;
				}
				pname = pinfo.substring(0, delimIndex);
				param = {
					pname: pname,
					opt: pinfo.indexOf(",opt=true") > 0,
					def: pinfo.indexOf(",default=") > 0 ?  pinfo.substring(pinfo.indexOf("default=")+8) : undefined,
					pdesc: params[i].substring(params[i].indexOf(")")+1)
				};
				result.push(param);
			}
		}
		return result;
	}

	function getMethodDoc(aname, func){
		func = func.toString();
		if(func.indexOf("#no-doc") >= 0){
			return;
		}
		if(config.methodNameWithParams){
			aname = aname +" "+ func.substring(func.indexOf("("), func.indexOf(")")+1);
		}


		var comment, params;
		comment = "";
		if(func.indexOf("/**") > 0 && func.indexOf("**/") > 0 && func.indexOf("/**") < func.indexOf("**/")){
			comment = func.substring(func.indexOf("/**")+3, func.indexOf("**/")).replace(/^\s+\*/gm, " ");
		}
		if(comment){
			params = extractParams(comment);
			if(comment.indexOf("#param") >= 0){
				comment = comment.substring(0, comment.indexOf("#param"));
			}
			return {signature: aname, desc: comment, params: params, hasParameter: params.length > 0};
		} else {
			if(config.onlyAvailable){
				return;
			}
			return {signature: aname, desc: "Dökümantasyon hazırlanmamış.", notPrepared: true, hasParameter: false};
		}
	}

	config = config || {};
	var data = [], doc, hasBcDoc;
	if(method){
		if(typeof bf[method] == "function"){
			return getMethodDoc(method, bf[method]);
		}
	} else {
		for(var aname in bf){
			hasBcDoc = false;
			//$ ile başlayan ve init metodunu gösterme
			if(aname.indexOf("$") === 0 || aname.indexOf("init") === 0){
				continue;
			}
			if(typeof bf[aname] == "function"){
				if(typeof bf.bcRef[aname] == "function"){
					var func = bf.bcRef[aname].toString();
					if(func.indexOf("/**") > 0 && func.indexOf("**/") > 0 && func.indexOf("/**") < func.indexOf("**/")){
						hasBcDoc = true;
						doc = getMethodDoc(aname, bf.bcRef[aname]);
					}
				}
				if(!hasBcDoc){
					doc = getMethodDoc(aname, bf[aname]);
				}
				if(doc){
					data.push(doc);
				}
			}
		}
	}
	return data;
}

window.SLibraryLoader = new function(){
	var loadStatus = {};
	var loaded3LibDeps = [];

	this.get3LibDepsOfBc = function (bcNames) {
		if(!Array.isArray(bcNames)){
			bcNames = [bcNames];
		}

		var results = [];
		for (var i = 0; i < bcNames.length; i++) {
			var def = BCEngine.getDefinition(bcNames[i]);
			var deps = def.DEPENDENCIES;
			if(deps){
				deps.map(function (dep) {
					if(results.indexOf(dep.name) === -1){
						results.push(dep.name);
					}
				})
			}
		}

		return results;
	};

	this.get3LibDepsOfBf = function (bf, module) {
		var result = [];

		function addList(bcName) {
			var deps = BCEngine.getDefinition(bcName, module).DEPENDENCIES;
			for (var i = 0; deps && (i < deps.length); i++) {
				if(result.indexOf(deps[i].name) === -1){
					result.push(deps[i].name);
				}
			}
		}

		function f(members) {
			for (var member in members) {
				if(members[member].MEMBERS){
					f(members[member].MEMBERS);
				} else if(members[member].bcName){
					addList(members[member].bcName);
				}
			}
		}

		addList(bf.BC_REF || bf.SCR.layout);
		if(bf.MEMBERS){
			f(bf.MEMBERS);
		}
		var values = [];
		for(var pname in result){
			values.push(result[pname]);
		}
		return values;
	};

	this.sort3LibNamesByOrder = function (libNames, module) {
		module = module || SModuleManager.getLocalModuleName();
		var side3LibDeps = Side3LibDeps[module];
		var side3LibNameOrderMap = {};

		for (var i = 0; i < side3LibDeps.length; i++) {
			side3LibNameOrderMap[side3LibDeps[i].libName] = side3LibDeps[i].libOrder;
		}

		return libNames.sort(function (a, b) {
			return side3LibNameOrderMap[a] < side3LibNameOrderMap[b] ? -1 : 1;
		});
	};

	this.loadLib = function (libname, urls, config, callback) {
		if (!callback && typeof config === "function") {
			callback = config;
			config = null;
		}

		if(!config){
			config = {};
		}

		if(!urls){
			for (var i = 0; i < loaded3LibDeps.length; i++) {
				if(loaded3LibDeps[i].split("#")[0] === libname){
					if(callback){
						callback();
					}
					return;
				}
			}

			if(!urls){
				var mName = config.module || SModuleManager.getLocalModuleName();
				var mSide3LibDeps = Side3LibDeps[mName];
				for (var i = 0; i < mSide3LibDeps.length; i++) {
					if(mSide3LibDeps[i].libName === libname){
						urls = ([].concat(mSide3LibDeps[i].jsImports || [])).concat(mSide3LibDeps[i].cssImports || []);
						for (var j = 0; j < urls.length; j++) {
							if(urls[j].indexOf("http") === 0){
								continue;
							}
							urls[j] = ("js/3thParty/" + mSide3LibDeps[i].libSource + "/" + urls[j]).replace(/#LANG#/g, window.sideLang);
						}
						config.version = mSide3LibDeps[i].libVersion;
						break;
					}
				}

				if(!urls || !urls.length){
					if(callback){
						callback();
					}
					return;
				}
			}
		} else if (!Array.isArray(urls)) {
			urls = [urls];
		}

		if (loadStatus[libname]) {
			if (loadStatus[libname].error) {
				callback && callback(loadStatus[libname].error);
				return;
			}
			if (loadStatus[libname].loaded) {
				callback && callback();
				return;
			}
			loadStatus[libname].callbacks.push(callback);
			return;
		}
		if (config && config.beforeLoad) {
			config.beforeLoad();
		}
		loadStatus[libname] = {
			loading: true,
			callbacks: [callback]
		};

		if (config && config.module) {
			for (var i = 0; i < urls.length; i++) {
				urls[i] = SideModuleManager.getResourceUrl(config.module, urls[i]);
			}
		}
		var asyncMethod = "parallelMap";
		if (config && config.serieLoad) {
			asyncMethod = "map";
		}
		var progress;
		if (config && config.progress) {
			progress = CSPopupUTILS.ProgressBar();
		}
		SAsync[asyncMethod](urls, function (url, flow) {
			SUtil.loadJS(url, function () {
				flow();
			});
		}, function (status) {
			if (progress) {
				progress.close();
			}
			loadStatus[libname].loaded = true;
			loadStatus[libname].loading = null;

			loaded3LibDeps.push(libname + "#" + (config.version || "1.0"));

			//TODO yukarıda flow hiç hata dönmediği için status'ta hiç hata yok
			for (var i = 0; i < loadStatus[libname].callbacks.length; i++) {
				if (loadStatus[libname].callbacks[i]) {
					loadStatus[libname].callbacks[i]();
				}
			}
			loadStatus[libname].callbacks = null;
		});
	};
};

window.SPages = new function(){
	/**
	 * Changes visibilities of given definitions.
	 * @param {business[]} toVisibles - definition or definitions to do visible.
	 * @param {business[]}toInvisibles - definition or definitions to do invisible.
	 */
	this.setVisible = function(toVisibles, toInvisibles){
		if(Array.isArray(toVisibles)){
			for(var i=0; i<toVisibles.length ;i++){
				if(toVisibles[i]){
					toVisibles[i].setVisible();
				}
			}
		} else {
			if(toVisibles){
				toVisibles.setVisible();
			}
		}
		if(Array.isArray(toInvisibles)){
			for(var i=0; i<toInvisibles.length ;i++){
				if(toInvisibles[i]){
					toInvisibles[i].setVisible(false);
				}
			}
		} else {
			if(toInvisibles){
				toInvisibles.setVisible(false);
			}
		}
	};

	this.setDisabled = function(toDisableds, toEnableds){
		if(Array.isArray(toDisableds)){
			for(var i=0; i<toDisableds.length ;i++){
				if(toDisableds[i]){
					toDisableds[i].setDisabled();
				}
			}
		} else {
			if(toDisableds){
				toDisableds.setDisabled();
			}
		}
		if(Array.isArray(toEnableds)){
			for(var i=0; i<toEnableds.length ;i++){
				if(toEnableds[i]){
					toEnableds[i].setDisabled(false);
				}
			}
		} else {
			if(toEnableds){
				toEnableds.setDisabled(false);
			}
		}
	};

	this.setReadonly = function(toReadonlies, toEditables){
		if(Array.isArray(toReadonlies)){
			for(var i=0; i<toReadonlies.length ;i++){
				if(toReadonlies[i]){
					toReadonlies[i].setReadonly();
				}
			}
		} else {
			if(toReadonlies){
				toReadonlies.setReadonly();
			}
		}
		if(Array.isArray(toEditables)){
			for(var i=0; i<toEditables.length ;i++){
				if(toEditables[i]){
					toEditables[i].setReadonly(false);
				}
			}
		} else {
			if(toEditables){
				toEditables.setReadonly(false);
			}
		}
	};
};
function CSsession(){
	
	//Login'den gelen session bilgileri core değişkeninde tutulur.
	var core = { LANG: window.sideLang};
	//Developer'ın zamanla set ettiği bilgiler extra değişkeninde tutulur
	var extra = { };
	var tokens = { };
	var MODULE_NAME = "dm";
	
	this.tokens = tokens;
	
	this.getUserId = function(){
		return extra.userid || core.kullaniciKodu || core.USERID;
	};
	
	this.getUserName = function(){
		return core.USERNAME || core.USER_NAME || core.ad;
	};
	
	this.getLang = function(){
		return core.LANG;
	};
	
	this.getEnv = function(){
		return window.sideRuntimeEnvironment;
	};
	
	this.get = function(key){
		if(key == "$core-session$"){
			return core;
		}
		if(core[key] !== undefined){
			return core[key];
		}
		return extra[key];
	};

	this.getAny = function(key1, key2, key3, key4, key5){
		var keys=[key1,key2,key3,key4,key5];
		var value;
		for(var i=0; i<keys.length ;i++){
			if(keys[i]){
				value = this.get(keys[i]);
				if(value !== undefined){
					return value;
				}
			}
		}
	};
	
	this.getToken = function(module){
		if(module instanceof BaseBF){
			module = module.getModuleName();
		}
		module = module || SideModuleManager.getLocalModuleName();
		return tokens[module] ? tokens[module].token : null;
	};
	
	this.setToken = function(token, module){
		module = module || SideModuleManager.getLocalModuleName();
		if(!token){
			tokens[module] = null;
			return;
		}
		if(typeof token == "string"){
			token = {token: token};
		}
		return tokens[module] = token;
	};
	this.setSessionId = function(sid, module){
		module = module || SideModuleManager.getLocalModuleName();
		if(tokens[module]){
			tokens[module].sid = sid;
		}
	};
	this.getSessionId = function(module){
		if(module instanceof BaseBF){
			module = module.getModuleName();
		}
		module = module || SideModuleManager.getLocalModuleName();
		return tokens[module] ? tokens[module].sid : null;
	};
	
	this.set = function(key, value){
		extra[key] = value;
	};
	
	this.setModuleName = function(module){
		MODULE_NAME = module;
	};
	
	this.getModuleName = function(){
		return MODULE_NAME;
	};
	
	this.deleteKey = function(key){
		delete extra[key];
	};
	
	//Loginden sonra sunucudan gelen session bilgileri bu metod ile verilmelidir
	this.setSession = function(sessionObj){
		if(!sessionObj || typeof sessionObj != "object"){
			console.error("CSSession did not started correctly.");
			return;
		}
		//core'u tamamen sifirla, daha onceki loginden birseyler kalmissa temizlensin.
		core = { LANG: window.sideLang};
		for(var key in sessionObj){
			core[key] = sessionObj[key];
		}
	};
	//Session içindeki tüm bilgileri siler
	this.clearSession = function(){
		core = { LANG: window.sideLang};
		extra = {};
	};
	//core session'ı sıfırlamıyor. modüller için
	this.changeSession = function(sessionObj){
		if(!sessionObj || typeof sessionObj != "object"){
			console.error("CSSession did not started correctly.");
			return;
		}
		for(var key in sessionObj){
			if(key == "token"){
				continue;
			}
			core[key] = sessionObj[key];
		}
	};
	
	this.printSession = function(){
		console.dir(core);
		console.dir(extra);
	};
	
	this.logout = function(callback){
		var cssession = this;
		CSCaller.call("logout")
		 .then(function(){
			 core = {LANG: window.sideLang};
			 extra = {};
			 if(callback){
				 callback(true);
			 }
		 }).error(function(){
			 if(callback){
				 callback(false);
			 }
		 });
	};
	
	/**
	 * Sunucudan session bilgileri tekrar alır
	 */
	this.refreshSession = function(callback) {
		CSCaller.call(getSideDefaults("sn-getUserSessionInfo")).then(function(resp) {
			CSSession.setSession(resp);
			localStorage.setItem("token", CSSession.getToken());
			if (callback) {
				callback(true);
			}
		}).error(function(resp) {
			if (callback) {
				callback(false);
			}
		});
	};
}

window.SSession = CSSession = new CSsession();
function RefDataManager(module){
	/**
	 * CSRefDataInfo Örneği:
	 * CSRefDataInfo = {
	 *   ILLER: {
	 *     cols: ["ID","NAME"], //--> Columns
	 *     v: 123, //---------------> Version
	 *     ml: 1, //----------------> Multilanguage
	 *     o: "NAME", //------------> Order Column
	 *     data: [ //---------------> Data
	 *       ["06","ANKARA"],
	 *       ["07","ANTALYA"],
	 *       ....
	 *     ]
	 *   },
	 *   ILCELER: {....
	 * }
	 */
	
	var CSRefDataInfo = {
		side: {},
		app: {}
	};
	this.debug = true;
	if(this.debug){
		this.refData = CSRefDataInfo;
	}
	
	function getChromeVersion(){
		return parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1]);
	}
	
	function readLocalCache(sideRF, callback){
		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		if(!window.requestFileSystem){
			console.log("Browser not supporting Local File System.");
			if(callback) callback();
			return;
		}
		if($$.ischrome() && getChromeVersion() < 20){
			console.log("Browser version old.")
			if(callback) callback();
			return;
		}
		var filename = sideRF ? "side-refdata.json" : "app-refdata.json";
		try {
			window.requestFileSystem(window.TEMPORARY, 5*1024, initFS, errorHandler);
			function initFS(fs){
				fs.root.getFile(filename, {}, function(fileEntry) {
					fileEntry.file(function(file) {
						var reader = new FileReader();
						reader.onloadend = function(e) {
							try{
								var rd = eval("(" + this.result + ")");
								if(rd.__lang === undefined){
									rd.__lang = "tr";
								}
								if(rd.__lang != window.sideLang){
									SLog.log("Lang of cache is different. Cache will be deleted.");
									fileEntry.remove(function(){
										if(callback) callback();
									});
								} else {
									if(sideRF){
										CSRefDataInfo.side = rd;
									} else {
										CSRefDataInfo.app = rd;
									}
									console.log("Local File System successfully read.");
									if(callback) callback();
								}
							} catch(ex){
								console.log("Local File System could not read." + ex);
								if(callback) callback();
							}
						};
						reader.readAsText(file);
					}, errorHandler);
				}, errorHandler);
			}
			function errorHandler(e){
				//Dosyanın olmaması, dosyanın okunamaması vs.. sorun değil
				if(callback) callback();
			}
		}catch(e){
			console.log(e);
			if(callback) callback();
		}
	}
	
	function deleteLocalCache(sideRF, callback){
		console.log("deleteLocalCache çalışıyor." + sideRF);
		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		if(!window.requestFileSystem){
			console.log("Browser not supporting Local File System.");
			if(callback) callback();
			return;
		}
		if($$.ischrome() && getChromeVersion() < 20){
			console.log("Browser version old.");
			if(callback) callback();
			return;
		}
		var filename = sideRF ? "side-refdata.json" : "app-refdata.json";
		try {
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024, initFS, errorHandler);
			function initFS(fs){
				fs.root.getFile(filename, {create: false}, function(fileEntry) {
					fileEntry.remove(function() {
						console.log("Referans veriler local cache'ten silindi.");
						if(callback) callback();
					}, errorHandler);
				}, errorHandler);
			}
			function errorHandler(e){
				console.log("REF Data info could not deleted  cache from Local File System." + e);
				if(callback) callback();
			}
		}catch(e){
			console.log("File API problem." + e);
			if(callback) callback();
		}
	};
	
	function writeLocalCache(sideRF, callback){
		console.log("writeLocalCache çalışıyor.." + sideRF);
		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		if(!window.requestFileSystem){
			console.log("Browser not supporting Local File System.");
			if(callback) callback();
			return;
		}
		if($$.ischrome() && getChromeVersion() < 20){
			console.log("Browser version old.");
			if(callback) callback();
			return;
		}
		var filename = sideRF ? "side-refdata.json" : "app-refdata.json";
		var refs = sideRF ? CSRefDataInfo.side : CSRefDataInfo.app;
		refs.__lang = window.sideLang;
		try {
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024, initFS, errorHandler);
			function initFS(fs){
				fs.root.getFile(filename, {create: true}, function(fileEntry) {
					fileEntry.createWriter(function(fileWriter) {
					    fileWriter.write(new Blob([JSON.stringify(refs)], {type: "application/json"}));
					    console.log("Referans veriler local cache için fs'e yazıldı.");
					    if(callback) callback();
					}, errorHandler);
				}, errorHandler);
			}
			function errorHandler(e){
				//Dosyanın olmaması, dosyanın okunamaması vs.. sorun değil
				console.log("REF Data info could not writen to Local File System." + e);
				if(callback) callback();
			}
		}catch(e){
			console.log("File API problem." + e);
			if(callback) callback();
		}
	};

	function getMultipleCacheableRFs(refList, moduleName, callback){
		console.log("getMultipleCacheableRFs çalışıyor. refList>"+refList + " moduleName>" + moduleName);
		var moduleReqs = {}, refName, reqModule, temp;
		for(var i=0; i<refList.length ;i++){
			refName = refList[i];
			if(!refName){
				continue;
			}
			if(refName.indexOf(".") > 0){
				temp = refName.split(".");
				reqModule = temp[0];
				refName = temp[1];
			} else {
				reqModule = moduleName;
			}
			if(!reqModule){
				reqModule = SModuleManager.getLocalModuleName();
			}
			if(!moduleReqs[reqModule]){
				moduleReqs[reqModule] = [];
			}
			moduleReqs[reqModule].push(refName);
		}

		var modules = Object.keys(moduleReqs);
		SAsync.parallelMap(modules, function(moduleName, pflow){
			console.log(moduleName + "modülü için getCacheableRFs metodu çalıştırılıyor.." + moduleReqs[moduleName]);
			getCacheableRFs(false, moduleReqs[moduleName], function(success){
				if(!success){
					//pflow("Error getting reference data from module: " + moduleName);
					console.error("getCacheableRFs başarılı dönmedi!");
					pflow();//TODO bu kısım tobb için geçici oalrak omit edildi. Bence bir flag'e bağlanarak bu iş için politika belirlenmeli (önemsem yada cache'i sil şeklinde)
					return;
				}
				pflow();
			}, moduleName);
		}, function(err){
			if(err){
				console.error("Paralel map hata döndü!");
				console.error(err);
				if(callback) callback(false);
				return;
			}
			if(callback) callback(true);
		});
	}

	function getCacheableRFs(sideRF, refList, callback, module, relativeBF, relativeOid){
		console.log("getCacheableRFs çalışıyor..");
		console.log("sideRF: " + sideRF);
		console.log("refList: " + refList);
		console.log("module: " + module);
		console.log("relativeBF: " + relativeBF);
		console.log("relativeOid: " + relativeOid);
		var rfAppUrlFlag = getSideDefaults("sn-designerRfAppUrl", module);
		var serviceName;
		if(rfAppUrlFlag == "yes"){
			serviceName = sideRF || isTestModeInTestScreen() ? "SIDE.GET_CACHABLE_RF_DATA_INFO" : getSideDefaults("sn-getCacheableRfDataInfo", module);
		}
		else{
			serviceName = getSideDefaults("sn-getCacheableRfDataInfo", module);
		}
		console.log("serviceName: " + serviceName);
		var url = sideRF || isTestModeInTestScreen() ? csdc.DISPATCH_SIDE : undefined;
		console.log("url: " + url);
		if(module){
			if(rfAppUrlFlag == "yes"){
				url = sideRF || isTestModeInTestScreen() ? SideModuleManager.getSideUrl(module) : SideModuleManager.getAppUrl(module);
			}
			else{
				url = SideModuleManager.getAppUrl(module);
			}
			console.log("url: " + url);
		}
		
		var status = [];
		for(var i=0; i<refList.length ;i++){
			status.push({rf:refList[i]});
		}
		
		if(relativeBF){
			var remoteRefInfo;
			console.log("relativeBF olduğu için servis çağrısı buradan yapıldı.");
			console.log("lang: " +  window.lang || (CSSession && CSSession.getLang()) || "tr");
			CSCaller.call(serviceName, {lang: window.lang || (CSSession && CSSession.getLang()) || "tr", status: status}, {url: url, module: module, bfFromReltvComp: relativeBF})
			.then(function(remoteRfInfo){
				console.log("Servis başarılı döndü.");
				remoteRefInfo = {
						cols: remoteRfInfo[0].cols,
						v: remoteRfInfo[0].refDataInfo.version,
						ml: remoteRfInfo[0].refDataInfo.multiLang,
						o: remoteRfInfo[0].refDataInfo.orderBy,
						data: remoteRfInfo[0].values,
						module: remoteRfInfo[0].refDataInfo.module || module
					};
				
				CSRefDataInfo.app[ relativeOid +"#"+remoteRfInfo[0].refDataInfo.name ] = remoteRefInfo;
				if(callback){
					callback(true);
				}
			});
			
		}else{
			console.log("relativeBF olmadığı için servis çağrısı buradan yapıldı.");
			console.log("lang: " +  window.lang || (CSSession && CSSession.getLang()) || "tr");
			CSCaller.call(serviceName, { lang: window.lang || (CSSession && CSSession.getLang()) || "tr", status: status}, {url: url, module: module})
			.then(function(remoteRfInfo){
				console.log("Servis çağrısı başarılı...");
				for(var i=0; remoteRfInfo && i<remoteRfInfo.length ;i++){
					if(sideRF){
						CSRefDataInfo.side[ remoteRfInfo[i].refDataInfo.name ] = {
								cols: remoteRfInfo[i].cols,
								v: remoteRfInfo[i].refDataInfo.version,
								ml: remoteRfInfo[i].refDataInfo.multiLang,
								o: remoteRfInfo[i].refDataInfo.orderBy,
								data: remoteRfInfo[i].values,
								module: remoteRfInfo[i].refDataInfo.module || module
						};
					} else {
						CSRefDataInfo.app[ remoteRfInfo[i].refDataInfo.name ] = {
								cols: remoteRfInfo[i].cols,
								v: remoteRfInfo[i].refDataInfo.version,
								ml: remoteRfInfo[i].refDataInfo.multiLang,
								o: remoteRfInfo[i].refDataInfo.orderBy,
								data: remoteRfInfo[i].values,
								module: remoteRfInfo[i].refDataInfo.module || module
						};
					}
				}
				if(callback) callback(true);
			}).error(function(error){
				console.error("Servis çağrısı hata döndü!");
				console.error(error);
				if(callback) callback(false);
			});
		}
	};
	
	this.requestRefData = function(isSideRef, reqList, callback, module, relativeBF, relativeOid){
		if(!reqList || !Array.isArray(reqList) || reqList.length == 0){
			if(callback) callback(true);
			return;
		}
		var list = [];
		var refPropName = isSideRef ? "side" : "app";
		for(var i=0; i<reqList.length ;i++){
			var refName = reqList[i];
			var refObj = CSRefDataInfo[refPropName][refName];
			if(!refObj || (refObj && refName.indexOf(".") < 0 && refObj.module != module) || (refObj && refName.indexOf(".") < 0 && refObj.module == module)){
				list.push(refName);
			}
		}
		if(list.length == 0){
			if(callback) callback(true);
			return;
		}
		var me = this;
		if(relativeBF){
			getCacheableRFs(false, list, function(success){
				if(callback){
					callback(success);
				}
			}, module, relativeBF, relativeOid); 
		}else {
					if(isSideRef){
				getCacheableRFs(true, list, function(success){
					if(success){
						me.updateSideRef(callback, list);
					} else {
						if(callback) callback(success);
					}
				}, module);
			} else {
				getMultipleCacheableRFs(list, module, function (success) {
					if(success){
						me.updateAppRef(callback, list);
				} else {
						if(callback) callback(success);
				}
				});
			}
		}
	};
	
	/**
	 * Referans verinin kendisini döner (Kopyasını değil)
	 * Dönen veride yapılacak değişiklik tüm sistemi etkiler
	 */
	this.getAppRfDataRef = function(name){
		var info = CSRefDataInfo.app[name];
		if(!info){
			return null;
		}
		return info;
	};
	
	this.removeAppRefdata = function(rfNames, callback, relativeOid){
		if(!rfNames){
			return;
		}
		if(!Array.isArray(rfNames)){
			rfNames = [rfNames];
		}
		for(var i=0; i<rfNames.length ;i++){
			if(rfNames[i] == "ILLER" || rfNames[i] == "VDLER"){
				continue;
			}
			relativeOid ? delete CSRefDataInfo.app[relativeOid+"#"+rfNames[i]] : delete CSRefDataInfo.app[rfNames[i]];
		}
		this.updateAppRef(callback, rfNames);
	};

	this.removeAll = function(callback){
		var flow = new CSWaterFall(callback);
		flow.sideRF = false;
		flow.add(deleteLocalCache);
		flow.run();
	};
	
	this.removeSideRefdata = function(rfNames, callback, relativeOid){
		if(!rfNames){
			return;
		}
		if(!Array.isArray(rfNames)){
			rfNames = [rfNames];
		}
		for(var i=0; i<rfNames.length ;i++){
			relativeOid ? delete CSRefDataInfo.side[relativeOid+"#"+rfNames[i]] : delete CSRefDataInfo.side[rfNames[i]];
		}
		this.updateSideRef(callback, rfNames);
	};
	
	this.getAppRefVersionInfo = function(moduleName){
		if(!moduleName){
			moduleName = SideModuleManager.getLocalModuleName();
		}
		var versionInfo = [];
		for(var rfName in CSRefDataInfo.app){
			var rfObj = CSRefDataInfo.app[rfName];
			if(rfObj.module == moduleName){
				versionInfo.push({rf: rfName, v: rfObj.v});
			}
		}
		return versionInfo;
	};
	
	this.getSideRefVersionInfo = function(moduleName){
		if(!moduleName){
			moduleName = SideModuleManager.getLocalModuleName();
		}
		var versionInfo = [];
		for(var rfName in CSRefDataInfo.side){
			var rfObj = CSRefDataInfo.side[rfName];
			if(rfObj.module == moduleName){
				versionInfo.push(rfName +"#"+rfObj.v);
			}
		}
		return versionInfo;
	};
	
	this.updateAppRef = function(callback, rfNameList){
		SAsync.series([
			function (flow) {
				deleteLocalCache(false, flow);
			},
			function (flow) {
				writeLocalCache(false, flow);
			},
			function (flow) {
				rerenderBindedUpdate(rfNameList, flow);
			}
		], function (err, index) {
			console.log(err + " | index: " + index);
			if(callback) callback(err);
		});
	};
	
	this.updateSideRef = function(callback, rfNameList){
		SAsync.series([
			function (flow) {
				deleteLocalCache(true, flow);
			},
			function (flow) {
				writeLocalCache(true, flow);
			},
			function (flow) {
				rerenderBindedUpdate(rfNameList, flow);
			}
		], function (err, index) {
			console.log(err + " | index: " + index);
			if(callback) callback(err);
		});
	};
	
	this.init = function(callback){
		SAsync.series([
			function (flow) {
				readLocalCache(true, flow);
			},
			function (flow) {
				readLocalCache(false, flow);
			},
			checkModuleNames
		], function (err, index) {
			if(err){
				err = err ? err + " | index: " + index : err;
				console.log(err);
			}
			if(callback) callback(err);
		});
	};

	this.checkRefDataStatus = function(callback){
		var seperateCheck = getSideDefaults("sn-checkRefDataStatus");
		if(!seperateCheck){
			if(callback) callback();
			return;
		}
		var appData = SRefDataManager.refData.app;
		var reqModuleMap = {}, localModuleName = SideModuleManager.getLocalModuleName(),moduleName,name,temp;
		for(var rdName in appData){
			if(rdName == "__lang"){
				continue;
			}
			if(rdName.indexOf(".")>0){
				temp = moduleName.split(".");
				moduleName = temp[0];
				name = temp[1];
			} else {
				moduleName = appData[rdName].module || localModuleName;
				name = rdName;
			}
			if(!SideModules[moduleName]){
				continue;
			}
			if(!reqModuleMap[moduleName]){
				reqModuleMap[moduleName] = [];
			}
			reqModuleMap[moduleName].push({rf: name, v: appData[rdName].v});
		}
		if(SIDEUtil.isEmpty(reqModuleMap)){
			if(callback) callback();
			return;
		}
		var reqModuleList = Object.keys(reqModuleMap);
		SAsync.parallelMap(reqModuleList,
			function(moduleName, pflow){
				CSCaller.call(getSideDefaults("sn-checkRefDataStatus"), {rfDataInfo: reqModuleMap[moduleName]}, {module: moduleName})
					.then(function(resp){
						if(resp && resp.rfDeleteList && resp.rfDeleteList.length){
							SRefDataManager.removeAppRefdata(resp.rfDeleteList, function(){
								pflow();
							});
						} else {
							pflow();
						}
					})
					.error(function(){
						console.error("Check ref data status failed for module '"+moduleName+"'");
						pflow("Check ref data status failed for module '"+moduleName+"'");
					});
			}, function(err){
				if(err){
					if(callback) callback(err);
					return;
				}
				if(callback) callback();
			}
		);
	};
	
	function checkModuleNames(callback){
		console.log("RF check module names...");
		var keyArr = ["app", "side"];
		for(var j=0;j<keyArr.length;j++){
			var key = keyArr[j];
			var appData = SRefDataManager.refData[key];
			if(appData){
				for(var i in appData){
					if(i != "__lang" && !appData[i].module){
						SLog.log("RF module name not found. RF will be deleted. rf:"+i);
						delete appData[i];
					}
				}
			}
		}
		if(callback) callback();
	}
	
	this.getMetaInfo = function(refDataName){
		var info = CSRefDataInfo.side[refDataName];
		if(!info){
			return null;
		}
		//Copy columns and return
		var columns = [];
		for(var i=0; i<info.cols.length ;i++){
			columns.push(info.cols[i]);
		}
		return columns;
	};
	
	this.getLocalCacheStatus = function(sideRF){
		var status = [];
		var refData = sideRF ? CSRefDataInfo.side : CSRefDataInfo.app;
		for(var refDataInfo in refData) {
			status.push({
				rf: refDataInfo,
				v: refData[refDataInfo].v
			});
		}
		return status;
	};
	
	
	this.getRefDataNames = function(){
		var names = ["APPLICATION-CACHE"];
		for(var name in CSRefDataInfo.side){
			names.push(name);
		}
		return names;
	};
	
	this.getData = function(name, relativeBF, callback){
		if(!name){
			return null;
		}
		if(name.indexOf(".")>0){
			name = name.split(".")[1];
		}
		if(relativeBF){
			var companyInfo = window.getCloudInfo(relativeBF);
			if(companyInfo && companyInfo.oid){
				
				info = CSRefDataInfo.app[companyInfo.oid + "#" + name];
				
				if(!info){
					var info = this.requestRefData(false, [name], callback, undefined, relativeBF, companyInfo.oid);
					if(!info){
						return null;
					}
				}
				
				var result = [];
				for(var i=0; info.data && i<info.data.length ;i++){
					result.push(info.data[i]);
				}
				return result;
			}
		}
		var info = CSRefDataInfo.side[name];
		if(!info){
			info = CSRefDataInfo.app[name];
			if(!info){
				return null;
			}
			var result = [];
			for(var i=0; info.data && i<info.data.length ;i++){
				result.push(info.data[i]);
			}
			return result;
		}
		return SArray.clone(info.data);
	};

	/**
	 * yeni bir referans veri ekler. Cache'e yazmaz. Cache'e yazmak için updateAppRef metodu kullanılabilir.
	 * #param(rfInfo) referans veri ile ilgili bilgileri içeren nesnedir. Referans verinin adını, versiyonunu, çoklu dil desteği olup olmadığını ve sıra kolonunu içermelidir.
	 * Örnek: {name: "REF_BOLGELER", "v: 1, ml: 0, o: "adi"}
	 * #param(data) referans verinin içeriği. Dizi olmalıdır.
	 * #param(-isSideRef, def(false)) side mi uygulama referans verisi oldugunu belirtir.
	 **/
	this.addRefData = function(rfinfo, data, isSideRef){
		if(!rfinfo || !rfinfo.name || !rfinfo.v){
			throw "parameter rfinfo is invalid'";
		}
		var info = CSRefDataInfo.side[name];
		if(!info){
			info = CSRefDataInfo.app[name];
		}
		if(info){
			throw "A referance data already exist with name '"+name+"'";
		}
		
		rfinfo.data = data;
		if(isSideRef){
			CSRefDataInfo.side[rfinfo.name] = rfinfo;
		} else {
			CSRefDataInfo.app[rfinfo.name] = rfinfo;
		}
	};

	/**
	 * Ref Datayı Cache'den temizleyip tekrar yükler.
	 * #param(rfNames) Ref Data isimleridir, array olmalıdır.
	 * #param(callback) İşlem tamamlandıktan sonra çalıştırılacak fonksiyondur.
	 * #param(module) Geçerli Modül ismi.
	 * #param(isSideRef) Ref Data'nın Side mi yoksa App Ref Data mı olduğunu belirtir.
	 * #param(relativeOid) Yeniden yüklenecek olan  Ref Datalar Relative ise oid bilgisi mutlaka girilmelidir.
	 **/
	this.reloadRefdata = function(rfNames, callback, module, isSideRef, relativeOid){
		var thiz = this;
		var reqCallback = relativeOid ? callback : function(){
			thiz.requestRefData(isSideRef, rfNames, callback, module);
		};
		
		if(isSideRef){
			this.removeSideRefdata(rfNames, reqCallback, relativeOid);
		}else{
			this.removeAppRefdata(rfNames, reqCallback, relativeOid)
		}
	};

	/**
	 * Bileşene RefDatayı anlık güncellenecek şekilde bağlar. Ref Data üzerinde değişiklik olduğu zaman bileşen anlık olarak güncellenir. Bu özellik App Info üzerinden aktif edilir.
	 * #param(bcRef) Ref Data bağlanılacak olan bileşen.
	 * #param(rfName) Ref Data ismi.
	 **/
	this.bindUpdate = function(bcRef, rfName){
		if( !getSideDefaults("support-bind-components-and-rf-data") ){ return; }
		if(!rfName || rfName == "none"){
			return;
		}
		
		//erp'de ekran kodlarında bu metodun kullanıldığı ve paramtre oalrak bf verildiği görüldü. Bu yüzden aşağıdaki satır eklendi. @mahmuty 17.19.2015 
		if(bcRef instanceof BaseBF){
			 bcRef = bcRef.bcRef;
		}
		
		if(!this.bindedUpdateList){
			this.bindedUpdateList = {};
		}
		
		if(!this.bindedUpdateList[rfName]){
			this.bindedUpdateList[rfName] = [];
		}
		
		this.bindedUpdateList[rfName].push(bcRef);
	};

	/**
	 * Bileşene anlık olarak güncelleme yapmak için bağlanılan Ref Datayı iptal eder.
	 * #param(bcRef) Ref Data bağlanıltısı iptal edilecek olan bileşen.
	 **/
	this.unbindUpdate = function(bcRef){
		if( !getSideDefaults("support-bind-components-and-rf-data") ){ return; }
		
		if(this.bindedUpdateList){
			for(var bindedUpdate in this.bindedUpdateList){
				var indice = this.bindedUpdateList[bindedUpdate].indexOf(bcRef);
				if(indice != -1){
					this.bindedUpdateList[bindedUpdate].splice(indice, 1);
				}
			}
		}
	};

	/**
	 * Ref Data güncellemelerine bağlanmış bileşenler varsa bunları rerender yapar.
	 * #param(rfNameList) İlgili ref dataların isimleridir. Array'dir. Boşsa bütün bağlı bileşenler rerender edilir.
	 **/
	function rerenderBindedUpdate(rfNameList, callback){
		var biUpLi = this.bindedUpdateList,bc,bf;
		if( !getSideDefaults("support-bind-components-and-rf-data") ){
			console.warn("'support-bind-components-and-rf-data' özelliği bu proje için aktif değil!");
			if(callback) callback();
			return;
		}

		if(biUpLi){
			if(rfNameList){
				for(var i=0; i<rfNameList.length; i++){
					if(biUpLi[rfNameList[i]]){
						for(var j=0; j<biUpLi[rfNameList[i]].length; j++){
							bc = biUpLi[rfNameList[i]][j], bf=bc.bf;
							if(!bf.$CS$ || bf.$CS$.intabular){
								continue;//TODO aslında bu sorun destroyda unbindUpdate'in çalıştırılmadığı anlamına geliyor.
							}
							if(bc.reRender){
								bc.reRender();
							}else {
								bf.rerender();
							}
						}
					}
				}
			}else{
				for(var binded in biUpLi){
					for(var i=0; i<biUpLi[binded].length; i++){
						bc = biUpLi[binded][i], bf=bc.bf;
						if(!bf.$CS$ || bf.$CS$.intabular){
							continue;//TODO aslında bu sorun destroyda unbindUpdate'in çalıştırılmadığı anlamına geliyor.
						}
						if(bc.reRender){
							bc.reRender();
						}else {
							bf.rerender();
						}
					}
				}
			}
		}

		console.log("Binded bileşenler yeniden çizildi.");
		if(callback) callback();
	}
}

/**
 * @class bf-base
 * @classdesc Bütün BF'lerin ata sınıfı
*/

function BaseBF() {
}

var eventBind = function(bf, event, bindObject, callback, eventid) {
	if (!bf.events)
	{
		bf.events = {};
	}
	if (!bf.events[event])
	{
		bf.events[event] = [];
	}
	bf.events[event].push({
		bind : bindObject,
		callback : callback,
		id : eventid
	});
	
};

/**
 * Tabular'da event bind'ların tekrar etmesini engellemek için copy sırasında event binding'e id veriliyor
 * @type {number}
 */
var sideTabularEventIdCounter=1;
/**
 * @function copyMemberEvents
 * @description tabular'da eklenen satırlara eventlerin kopyalanması
 * @param [from]
 * @param [to]
 */
var copyMemberEvents = function(from, to) {
	for(var ename in from.events){
		if(!to.events){
			to.events = {};
		}
		if(!to.events[ename]){
			to.events[ename] = [];
		}
		var fromEvents = from.events[ename];
		for(var i=0; i<fromEvents.length ;i++){
			var toEvents = to.events[ename];
			var skip = false;
			for(var k=0; k<toEvents.length; k++){
				if(fromEvents[i].id == toEvents[k].id){
					skip = true;
					break;
				}
			}
			if(skip){
				continue;
			}
			fromEvents[i].id=sideTabularEventIdCounter;
			sideTabularEventIdCounter++;
			toEvents.push(fromEvents[i]);
		}
	}
	for ( var memberName in from.members)
	{
		var member = from.members[memberName];
		copyMemberEvents(from.members[memberName], to.members[memberName]);
	}
};

/**
 * #no-doc
 * @function getContext
 * @description BF'nin yaşadığı context'i döndürür
 * @memberof BaseBF
 **/
BaseBF.prototype.getContext = function()
{
	return this.$CS$.CTX;
};

/**
 * @function getParent
 * @description Bileşenin atasını döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.getParent = function(){
	return this.$CS$.parent;
};

BaseBF.prototype.getMembers = function(){
	return [];
};

/**
 * @function getModuleName
 * @description Bileşenin modül ismini döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.getModuleName = function() {
	var moduleName;
	var bfname = this.$CS$.definition.BF_NAME;
	if("_NB" == bfname){
		return this.getParent().getModuleName();
	}
	if(bfname.indexOf(".") > 0){
		moduleName = bfname.substring(0, bfname.indexOf("."));
	}
	return moduleName || SideModuleManager.getLocalModuleName();
};

/**
 * @function bindEventToComp
 * @description Olay'ı ekran bileşenine bağlar.
 * #no-doc
 * @param [event]
 * @param [firstTime] - olayın daha önce bağlanıp bağlanmadığını belirtir. (rerender)
 * @param [inTabular]
 * @memberof BaseBF
 */
BaseBF.prototype.bindEventToComp = function(event, firstTime, inTabular)
{
	var business = this;
	var bcRef = this.bcRef;
	this.bcRef.on(event, function(e)
	{

		if (event === "ondrop") e.preventDefault();
		
		if(window.csRemoving){
			return;
		}
		var disableEvents = bcRef.$CS$.def.DISABLE_EVENTS;
		if(disableEvents && disableEvents.length > 0 && business.isDisabled()){
			for(var i=0; i<disableEvents.length ; i++){
				if(stringTrim(disableEvents[i]) == event){
					return;
				}
			}
		}
		var parent = business;
		do
		{
			if (parent.$CS$.row)
			{
				inTabular = true;
				window.currentRow = parent.$CS$.row;
				break;
			}
			parent = parent.$CS$.parent;
		}
		while (parent);
		if (inTabular && window.currentRow && (bcRef.typeName == "CSC-MINI-BUTTON" || bcRef.typeName == "CSC-BUTTON") && parent.$CS$.parent.bcRef.typeName == "CSC-GRID") {
			window.currentRow.select();
		}
		var currEvent = e || window.event;
		if(currEvent){
			SIDENavigator.setEvent(currEvent);
		}
		business.fire.apply(business, [ event ].concat(Array.prototype.slice.call(arguments)));
	});
};

/**
 * @function fire
 * @description  İsmi parametre ile verilen olayı fırlatmak için kullanılır. Hem bileşen event'lerini
 * hem de  business event'leri fırlatmak için kullanılır.
 * @example business.fire("ogrenciKaydedildi");//ogrenciKaydedildi olayı fırlatılıyor<br/> business.fire("selected");//click olayı fırlatılıyor
 * @param [eventName] fırlatılacak olayın ismi
 * @param [force=false] bileşen disabled olsa da olayı fırlatmaya zorla
 * @memberof BaseBF
 **/
BaseBF.prototype.fire = function(eventName, force) {
	if (!this.events || !this.events[eventName]) {
		return;
	}
	var disableEvents = this.bcRef.$CS$.def.DISABLE_EVENTS;
	if(force !== true && disableEvents && disableEvents.length > 0 && this.isDisabled()){
		for(var i=0; i<disableEvents.length ; i++){
			if(stringTrim(disableEvents[i]) == eventName){
				return;
			}
		}
	}
	//currentrow set et
	var parent = this;
	do{
		if (parent.$CS$ && parent.$CS$.row) {
			inTabular = true;
			window.currentRow = parent.$CS$.row;
			break;
		}
		parent = parent.$CS$ && parent.$CS$.parent;
	}
	while (parent);
	if($$.isff()){
		//arguments[1] event ise
		if(arguments[1] && !(typeof arguments[1].altKey == "undefined")){
			window.event =  arguments[1];//firefox için window.event set et...
		}
	}
	for ( var i = 0; i < this.events[eventName].length; i++)
	{
		var result = this.events[eventName][i].callback.apply(this.events[eventName][i].bind, [ this ].concat(Array.prototype.slice.call(arguments, 1)));
		if (result === false)
		{
			break;
		}
	}
	if($$.isff()){
		window.event =  undefined;
	}
};

/**
 * @function getBusinessName
 * @description Bileşene side'de ekran geliştirici tarafından verilmiş ismi döner.
 * @example E_ADI, E_DOGUM_TARIHI
 * @param [withModuleName=true] Dönen cevapta modül ismi de olsun mu?
 * @memberof BaseBF
 **/
BaseBF.prototype.getBusinessName = function(withModuleName) {
	var bfname = this.$CS$.definition.BF_NAME;
	if(withModuleName === false){
		if(bfname.indexOf(".") > 0){
			bfname = bfname.substring(bfname.indexOf(".")+1);
		}
	}
    return bfname;
};

/**
 * @function getMemberName
 * @description Bileşenin ekran içindeki ismini döner.
 * @example adi, soyadi
 * @memberof BaseBF
 **/
BaseBF.prototype.getMemberName = function(){
	return this.$CS$.name;
};

/**
 * @function getTypeName
 * @description Bileşenin side tip'ini döner.
 * @example CSC-CS-METIN, CSC-CHECKBOX
 * @memberof BaseBF
 **/
BaseBF.prototype.getTypeName = function(){
	return this.bcRef.typeName;
};

/**
 * @function on
 * @description Bileşen'de tanımlı bir olayı ele almak için kullanılır. Normal'de side'de olaylar side tasarım aracından ele alınır. Dinamik olarak ele almak için bu metod kullanılır.<br/>
 * @example
 * adi.on("selected", this, function(component){<br/>
	 * &nbsp;&nbsp;alert("Kullanıcı 'Adı' alınına tıkladı.");<br/>
	 * });
 * @param [event] Ele alınmak istenilen olayın ismi.
 * @param [bindObject] Olayın ilişkilendirildiği nesnedir. Verilen callback bu nesne üzerinden çağrılır. Dolayısıyla callback içerisinde kullanılacak "this" ifadesi bu nesneye karşılık gelecektir.
 * @param [callback] Olay oluştuğunda çağrılacak metodtur. Bu metodun aldığı parametreler olay'a göre değişiklik gösterir.
 * @param [config] İlerisi için düşünülmüş bir parametredir. Şuan bir kullanımı yoktur.
 * @memberof BaseBF
 **/
BaseBF.prototype.on = function(event, bindObject, callback, config)
{
	var parent = this;
	var inpopup = false, intabular = false;
	while(parent){
		
		if(parent.bcRef.typeName == "CSC-POPUP"){
			inpopup = true;
		}
		if(parent.$CS$.definition.isTabular){
			intabular = true;
		}
		parent = parent.$CS$.parent;
	}
	if(inpopup && intabular){
		if(this.events && this.events[event]){
			return;
		}
	}
	eventBind(this, event, bindObject, callback, config);
	if (this.events[event].length == 1)
	{
		this.bindEventToComp(event, true);
	}
};

/**
 * @function setConfigData
 * @description Bileşen üzerinde ekstra veri tutmak için kullanılır.
 * @example birthDate.setConfigData("isAdult", true)
 * @param [key] Tutulacak veriye verilen isim
 * @param [value] Tutulacak verinin değeri
 * @memberof BaseBF
 **/
BaseBF.prototype.setConfigData = function(key, value) {
	var config = this.getConfig();
	if(!config.$data$){
		config.$data$ = {};
	}
	config.$data$[key] = value;
};

/**
 * @function getConfigData
 * @description Bileşen üzerinde tutulan ekstra veriyi okumak için kullanılır.
 * @example var isAdult = birthDate.getConfigData("isAdult");
 * @param [key] Tutulan veriye verilmiş isim
 * @memberof BaseBF
 **/
BaseBF.prototype.getConfigData = function(key) {
	var config = this.getConfig();
	if(!config.$data$){
		return null;
	}
	return config.$data$[key];
};

/**
 * @function rmConfigData
 * @description Bileşen üzerinde tutulan ekstra veriyi silmek için kullanılır.
 * @example birthDate.rmConfigData("isAdult");
 * @param [key] Tutulan veriye verilmiş isim
 * @memberof BaseBF
 **/
BaseBF.prototype.rmConfigData = function(key) {
	if(!config.$data$){
		return;
	}
	config.$data$[key] = null;
};

/**
 * @function unbind
 * @description on metodu ile bağlanmış olayı kaldırmak için kullanılır. event, bindObject ve callback parametreleri on metoduna verilen parametrelerin aynısı olmak zorundadır.<br/>
 * Eğer callback paramtresi verilmezse bindObject ile event olayına ilişkilendirilmiş tüm olaylar kaldırılır.
 * @param [event] kaldırılacak olayın ismi
 * @param [bindObject] olayla ilişkilendirilmiş nesne
 * @param [callback] olayı ele alan metod
 * @memberof BaseBF
 **/
BaseBF.prototype.unbind = function(event, bindObject, callback) {
	if(!this.events[event]){
		return;
	}
    if(!bindObject){
        delete this.events[event];
        return;
    }
	for(var i=0; i<this.events[event].length ;i++){
		var e = this.events[event][i];
		if(e.bind == bindObject && (e.callback == callback || !callback)){
			this.events[event].splice(i, 1);
		}
	}
};

/**
 * @function focus
 * @description Bileşene odaklanılmasını sağlar.
 * (*) Çalışması için bileşenin bu metodu desteklemesi ve saltokunur yada disabled olmaması gerekir.
 * @memberof BaseBF
 **/
BaseBF.prototype.focus = function() {
	BFEngine.focusRequest(this);
};

/**
 * @function isContainer
 * @description Alanın bir container olup olmadığını döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.isContainer = function() {
	return (this.bcRef.$CS$.def.BaseBF == "CONTAINER" || this.bcRef.$CS$.def.BaseBF == "DYN-CONTAINER");
};

/**
 * @function isBusinessField
 * @description Alanın iş'le alakalı alan olup olmadığını döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.isBusinessField = function(){
	return !(this.$CS$.definition.NON_BUSINESS || this.bcRef.$CS$.def.BaseBF == "NON-BUSINESS");
};

/**
 * @function isTabular
 * @description Alanın bir tablo olup olmadığını döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.isTabular = function() {
	return this.bcRef.$CS$.def.BaseBF == "TABULAR" || this.bcRef.$CS$.def.BaseBF == "DYN-TABULAR";
};

/**
 * @function isEmpty
 * @description Bileşenin değerinin boş olup olmadığını döner.
 * @param [omitDefaultValue]
 * @memberof BaseBF
 **/
BaseBF.prototype.isEmpty = function(omitDefaultValue) {
    if(this.bcRef.isEmpty && this.bcRef.isEmpty(omitDefaultValue)){
        return true;
    }
    if(this.getValue()){
        return false;
    }
    return true;
};

/**
 * @function getValue
 * @description Bileşenin değerini döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.getValue = function() {
	if(!this.bcRef.getValue){
		return;
	}
	return this.bcRef.getValue(arguments[0], arguments[1]);
};

/**
 * @function getText
 * @description Bileşenin ekranda gözüken metnini döner.<br/>
 * Ekranda görünür olmayan alanların metinleri dönülmez. Görünür olmayan alanların da metnini almak için force parametresi true verilmelidir.
 * @param [force] Ekranda görünür olmayan alanların metinlerinin de dönülmesini sağlar.
 * @memberof BaseBF
 **/
BaseBF.prototype.getText = function(force) {
	if(!this.bcRef){
		return;
	}
	// 17.02.2014 gorunmeyenleri donme #mahmuty
	if (!force && !this.hasVisibleItem()){
		return;
	}
	if(typeof this.bcRef.getSelectedText == "function"){
		return this.bcRef.getSelectedText();
	}
	if(typeof this.bcRef.getText == "function"){
		return this.bcRef.getText();
	}
	if(typeof this.bcRef.getValue == "function"){
		return this.bcRef.getValue();
	}
	return "";
};

/**
 * @function setValue
 * @description Bileşene değer verilmesini sağlar. BF'ye verilen değeri atar.
 * @param [value] Bileşene verilecek değer
 * @param [text] Verilen değerin karşılığı olan metin (Sadece bazı bileşenler (combobox gibi) bu parametreyi destekler)
 * @memberof BaseBF
 **/
BaseBF.prototype.setValue = function(value, text) {
	this.bcRef.setValue(value, text);
};

/**
 * @function clear
 * @description Bileşenin değerini temizler. BF'nin değerini sıfırlar.
 * @memberof BaseBF
 **/
BaseBF.prototype.clear = function() {
	if(this.bcRef.$CS$.def.BaseBF == "BASIC" || this.bcRef.$CS$.def.BaseBF == "NON-BUSINESS"){
		if (this.bcRef.clear) {
			this.bcRef.clear();
		}
	} else {
		for ( var memberName in this.members) {
			this.members[memberName].clear(true);
		}
	}
};

/**
 * @function isDisabled
 * @description Bileşen değerinin kullanıcı tarafından değiştirilebilir olup olmadığını (true/false) döner.<br/> BF'nin disabled olup olmadığını döner.
 * (*) Disabled özelliği kalıtsal bir özelliktir. Bileşen enabled olsa bile ata container'lardan biri disabled ise bileşenin de disabled olduğu varsayılır ve metodtan disabled sonucu döner.</br/>
 * (*) Atasına bakılmaksızın bileşenin değiştirilebilirliğini elde etmek için checkParent parametresi false verilmelidir.
 * @param [checkParent=true] Bileşenin atasına bakılmaksızın değiştirilebilirliğini elde etmek kullanılır
 * @memberof BaseBF
 **/
BaseBF.prototype.isDisabled = function(checkParent) {
	var ref = this.bcRef;
	if(ref.config.forceEnable || ref.config.runOnDisabled){
		return false;
	}
	if (this.$CS$.row !== undefined && this.$CS$.row.disabled) {
		return true;
	}
	var res = ref.isDisabled();
	if(res === undefined){
		res = false;//disabled default false'tur
	}
	if(!res && (checkParent || checkParent === undefined) && this.$CS$.parent){
		res = BFEngine.isParentDisabled(this.$CS$.parent);
	}
	if (!inDesigner(this) && window.CSAuthorizationMan && !res) {// design time değilse yetki sor.
		if(this.$CS$.aud === undefined){
			this.$CS$.aud = (!window.CSAuthorizationMan ? false :  CSAuthorizationMan.isDisabled(this));
		}
		res = res || this.$CS$.aud;
	}
	return res;
};

/**
 * @function setDisabled
 * @description
 * Bileşen değerini kullanıcı tarafından değiştirilebilir yada değiştirilemez yapar.<br/>
 * (*) Disabled özelliği kalıtsal bir özelliktir. Bileşen enabled yapılsa bile ata container'lardan biri disabled ise bileşen de disabled davranır. <br/>
 * (*) Disabled bir bileşen istisnai durumlar hariç olay fırlatamaz. Bazı bileşenlerin disabled olduğunda da olay fırlatabilmesi için özellikleri vardır, bu özellik aktif olduğunda olay fırlatabilirler. Bu durum dışında disabled bileşenlerin (iş ile ilgili olay yada bileşen olayı farketmeksizin) olay fırlatmaları engellenmiştir.
 * @param [members] Container'ların içindeki alanları toplu olarak değiştirilebilir yada değiştirilemez yapmak için alan isimlerini dizi olarak içeren parametredir.
 * Bir container içindeki name ve birthDate alanlarını değiştirilebilir yapmak için. Bu parametre verilmek istenmiyorsa boş geçilebilir ve direk flag parametresi verilebilir.
 * @example person.setDisabled(["name","birthDate"], false)<br/>
 * @example name.setDisabled(false) yada değiştirilemez yapmak için name.setDisabled()
 * @param [flag=true] Bileşenin değiştirilebilirliğini belirleyen boolean parametredir.
 * @memberof BaseBF
 **/
BaseBF.prototype.setDisabled = function(members, flag) {
	if(typeof members == "boolean"){
		flag = members;
	} else if(typeof members == "string"){
        members = [members];
    }
	if(flag === undefined){
		flag = true;
	}
	
	if(Array.isArray(members)){
		for(var i=0; i<members.length ;i++){
			var member = BFEngine.get(members[i], this);
			if(member){
				var ref = member.bcRef;
				ref.setDisabled(flag);
				BFEngine.renderRequest(member);
			}
		}
	} else {
		var ref = this.bcRef;
		ref.setDisabled(flag);
		BFEngine.renderRequest(this);
	}
};

/**
 * #no-doc
 **/
BaseBF.prototype.saveState = function() {
	var ref = this.bcRef;
	if (ref.saveState && typeof ref.saveState == "function") {
		ref.saveState();
	}
	if (this.members) {
		for ( var memberName in this.members) {
			this.members[memberName].saveState();
		}
	}
};

/**
 * @function isReadonly
 * @description
 * Bileşenin salt okunur olup olmadığını (true/false) döner.<br/>
 * (*) Salt okunurluk özelliği kalıtsal bir özelliktir. Bileşen salt okunur olmasa bile ata container'lardan biri salt okunur ise bileşenin de salt okunur olduğu varsayılır ve metodtan salt okunur sonucu döner.<br/>
 * (*) Atasına bakılmaksızın bileşenin salt okunurluğunu elde etmek için checkParent parametresi false verilmelidir.
 * @param [checkParent=true] Bileşenin atasına bakılmaksızın salt okunurluğunu elde etmek kullanılır.
 * @memberof BaseBF
 **/
BaseBF.prototype.isReadonly = function(checkParent) {
	if (this.$CS$.row !== undefined && this.$CS$.row.readonly) {
		return true;
	}
	if(this.getConfig("skipParentReadonlyCtrl") === true){
		checkParent = false;
	}
	var res = this.bcRef.isReadonly();
	if(res === undefined){
		res = false;//readonly default false'tur
	}
	if(!res && (checkParent || checkParent === undefined) && this.$CS$.parent){
		res = this.$CS$.parent.isReadonly();
	}
//	if (!window.csd)
//	{//design time değilse yetki sor.
//			res = res || CSAuthorizationMan.isReadonly(this);
//	}
	return res;
};

/**
 * @function setReadonly
 * @description
 * Bileşeni salt okunur yada değiştirilebilir yapar.<br/>
 * (*) Salt okunurluk özelliği kalıtsal bir özelliktir. Bileşen salt okunur olmasa bile ata container'lardan biri salt okunur ise bileşen de salt okunur davranır.<br/>
 * (*) Salt okunurluk olay fırlatmaya engel bir durum değildir.
 * @param [members]
 * @param [flag]
 * @memberof BaseBF
 **/
BaseBF.prototype.setReadonly = function(members, flag, skipParentCheck) {
	if(typeof members == "boolean"){
		flag = members;
	} else if(typeof members == "string"){
        members = [members];
    }
	if(flag === undefined){
		flag = true;
	}
	
	if(Array.isArray(members)){
		for(var i=0; i<members.length ;i++){
			var member = BFEngine.get(members[i], this);
			if(member){
				member.saveState();
				if(skipParentCheck){
					member.setConfig("skipParentReadonlyCtrl", true);
				}
				var ref = member.bcRef;
				ref.setReadonly(flag);
				BFEngine.renderRequest(member);
			}
		}
	} else {
		this.saveState();
		if(skipParentCheck){
			this.setConfig("skipParentReadonlyCtrl", true);
		}
		var ref = this.bcRef;
		ref.setReadonly(flag);
		BFEngine.renderRequest(this);
	}
};

/**
 * @function isVisible
 * @description
 * Bileşenin görünür olup olmadığını (true/false) döner.<br/>
 * (*) Görünürlük kalıtsal bir özelliktir. Bileşen görünür olarak ayarlanmış olsa bile ata container'lardan biri görünür değilse bileşen de görünür değildir
 * ve bu metod böyle durumlarda görünür değil sonucunu döner.</br>
 * (*) Atasına bakılmaksızın bileşenin görünürlüğünü elde etmek için checkParent parametresi false verilmelidir.
 * @param [checkParent=true] Bileşenin atasına bakılmaksızın görünürlüğünü elde etmek kullanılır.
 * @memberof BaseBF
 **/
BaseBF.prototype.isVisible = function(checkParent) {
	if(this.$CS$.parent && this.$CS$.parent.getColModelMeta){
		var metas = this.$CS$.parent.getColModelMeta();
		for(var i=0; metas && i<metas.length; i++){
			if(this.getMemberName() == metas[i].name){
				if(metas[i].visibility){
					return true;
				}
				break;
			}
		}
	}
	
	var res = this.bcRef.isVisible();
	if(res === undefined){
		res = true;//visible default true'dur
	}
	if(res && (checkParent || checkParent === undefined) && this.$CS$.parent){
		res = this.$CS$.parent.isVisible();
	}
	if (!inDesigner(this) && window.CSAuthorizationMan) {// design time değilse yetki sor.
		if(this.$CS$.auv === undefined){
			this.$CS$.auv = (!window.CSAuthorizationMan || CSAuthorizationMan.isVisible(this));
		}
		res = res && this.$CS$.auv;
	}
	return res;
};

/**
 * @function setVisible
 * @description
 * Bileşeni görünür yada görünmez yapar.<br/>
 * (*) Görünürlük özelliği kalıtsal bir özelliktir. Bileşen görünür olsa bile ata container'lardan biri görünür değilse ise bileşen de görünür değildir.<br/>
 * (*) Görünürlük / görünmezlik olay fırlatmaya engel bir durum değildir. Görünmez olduğu durumlarda (bileşen görünmediği için) kullanıcı olay fırlatılmasını sağlayamaz ama geliştiriciler olay fırlatabilirler
 * @param [members] Container'ların içindeki alanları toplu olarak görünür / görünmez yapmak için alan isimlerini dizi olarak içeren parametredir.
 * Bir container içindeki name ve birthDate alanlarını görünmez yapmak için. Bu parametre verilmek istenmiyorsa boş geçilebilir ve direk flag parametresi verilebilir.
 * @example
 * person.setVisible(["name","birthDate"], false)<br/>
 * name.setVisible(false) yada görünür yapmak için name.setVisible()
 * @param [flag=true] Bileşenin görünürlüğünü belirleyen boolean parametredir.
 * @memberof BaseBF
 **/
BaseBF.prototype.setVisible = function(members, flag) {
	if(typeof members == "boolean"){
		flag = members;
	}
	if(flag === undefined){
		flag = true;
	}
	
	if(Array.isArray(members)){
		for(var i=0; i<members.length ;i++){
			var member = BFEngine.get(members[i], this);
			if(member){
				member.bcRef.setVisible(flag);
				BFEngine.renderRequest(member);
			}
		}
	} else {
		this.bcRef.setVisible(flag);
		BFEngine.renderRequest(this);
	}
};

/**
 * #no-doc basebf için anlamsız
 **/
BaseBF.prototype.hasVisibleItem = function() {
	return this.isVisible();
};

/**
 * @function getConfig
 * @description
 * Bileşenin özelliklerini ve bu özelliklerin o anki değerlerini içeren nesneyi döner.<br/>
 * (*) Dönen nesne üzerinde yapılacak değişiklikler tutarsızlıklara sebep olabilir, bu yüzden dikkatli kullanılmalıdır.
 * @memberof BaseBF
 **/
BaseBF.prototype.getConfig = function(key) {
	var ref = this.bcRef;
	if(!key){
		return ref.getConfig();
	}
	var parts = key.split("."), config = ref.config;
	for(var i = 0; i < parts.length - 1; i++) {
		if(!ref.config[parts[i]]) {
			return;
		}
		config = ref.config[parts[i]];
	}
	return config[parts[parts.length - 1]];
};

/**
 * @function addClass
 * @description Bileşene CSS sınıfı ekler.
 * @param [clazz] Bileşene verilen CSS sınıfının ismi
 * @memberof BaseBF
 **/
BaseBF.prototype.addClass = function(clazz) {
	this.bcRef.addClass(clazz);
};

/**
 * @function hasClass
 * @description Bileşende CSS sınıfı var mı döner.
 * @param [clazz] Sorgulanan CSS sınıfının ismi
 * @memberof BaseBF
 **/
BaseBF.prototype.hasClass = function(clazz) {
	return this.bcRef.hasClass(clazz);
};

/**
 * @function setClass
 * @description Bileşene CSS sınıfı verir.
 * @param [clazz] Bileşene verilen CSS sınıfının ismi
 * @memberof BaseBF
 **/
BaseBF.prototype.setClass = function(clazz) {
	this.bcRef.setClass(clazz);
};

/**
 * @function setLabelClass
 * @description Bileşenin label'ına CSS sınıfı verir.
 * @param [clazz] Verilen CSS sınıfının ismi
 * @memberof BaseBF
 **/
BaseBF.prototype.setLabelClass = function(clazz) {
	this.getConfig().label_class = clazz;
	BFEngine.renderRequest(this);
};

/**
 * @function removeClass
 * @description Bileşene verilmiş CSS sınıfını kaldırır.
 * @param [clazz] Bileşenden kaldırılacak CSS sınıfının ismi
 * @memberof BaseBF
 **/
BaseBF.prototype.removeClass = function(clazz) {
	this.bcRef.removeClass(clazz);
};

/**
 * @function isValid
 * @description
 * Bileşenin değerinin geçerli olup olmadığını döner.
 * @example Geçerli ise dönen cevap:<br/> {success: true, messages:[]}<br/>
 * @example Geçerli değil ise dönen örnek cevap:<br/> {success:false, messages:["'Adı' alanı boş bırakılamaz."]}
 * @memberof BaseBF
 **/
BaseBF.prototype.isValid = function() {
	var value = this.getValue();
	var retObj = { success : true, messages: [] };
	if (this.isRequired()) {
		if(this.bcRef.isEmpty && this.bcRef.isEmpty()){
			retObj.success = false;
			retObj.messages.push((this.getConfig().label || "(" + this.$CS$.name +")") + " alanı boş bırakılamaz." );
		} else if (value === undefined || value === null || $.trim(value) === "") {
			retObj.success = false;
			retObj.messages.push((this.getConfig().label || "(" + this.$CS$.name +")") + " alanı boş bırakılamaz."  );
		}
	}
	if (this.getConfig().validation.regex) {
		if(!this.checkRegex()){
			retObj.success = false;
			retObj.messages.push((this.getConfig().label || "(" + this.$CS$.name +")") + " alanının değeri geçersiz." );

			// ADogan - sonraki işlemde de regex kontrolü yapıp hata mesajını iki kere basıyor. Bunu önlemek için burada bitiriyorum.
			return retObj;
		}
	}
	if(this.bcRef.validate){
		var message = this.bcRef.validate();
		if(message){
			retObj.success = false;
			retObj.messages.push(message);
		}
	}
	if(typeof this.validate == "function"){
		var message = this.validate();
		if(message){
			retObj.success = false;
			retObj.messages.push(message);
		}
	}
	return retObj;
};

/**
 * @function setRegex
 * @description sets component's regular expression attribute
 * @param [regex] Regular expression like /^\d{4}$/
 * @memberof BaseBF
 **/
BaseBF.prototype.setRegex = function(regex) {
	if(!this.bcRef.config.validation){
		this.bcRef.config.validation = {};
	}
	this.bcRef.config.validation.regex = regex;
};

/**
 * @function checkRegex
 * @description Bileşenin değerinin parametre ile verilen regular expression'dan geçirilmesini sağlar. Değer regex'ten başarı ile geçerse true, geçemez ise false döner.
 * @param [regex] Kontrol için kullanılacak regular expression. Eğer verilemzse bileşen için side'de (Validation -> Regex alanı içinde) özellik olarak olarak verilmiş regular expression kullanılır.
 * @memberof BaseBF
 **/
BaseBF.prototype.checkRegex = function(regex) {
	if(!regex && !this.getConfig().validation.regex){
		return true;
	}
	var value = this.getValue();
	try {
		if(!value){//boş alanlarda regex false dönüyordu. #hakand #mahmuty ortak karar.
			return true;
		}
		//#hakand regex /[A-Z0-9]/ formatında olmalı
		var regex = eval(regex || this.getConfig().validation.regex);
		return regex.test(value);
	} catch (e) {
		console.log("regular expression işletiilirken hata oluştu. RegEX:" + this.getConfig().validation.regex + " value: " + value);
		return false;// @mahmuty burasının true/false dönmesi tartışılmalı
	}
};

/**
 * @function isRequired
 * @description Bileşenin zorunlu bir alan olup olmadığını (true/false) döner.<br/>
 * Zorunluluk koşullu kalıtsal bir özelliktir. Bileşenin kendisi zorunlu yada zorunlu değil olarak işaretlenmemişse (Validation -> Required özelliği boş bırakılmışsa) ama atası zorunlu
 * ise bileşen de zorunlu varsayılır ve metod sonucu olarak zorunlu değeri dönülür. Ama bileşen zorunlu yada zorunlu değil olarak işaretlenmişse
 * (boş bırakılmamışsa) atasının zorunluluğuna bakılmaksızın nasıl işaretlenmişse o cevap olarak dönülür.
 * @memberof BaseBF
 **/
BaseBF.prototype.isRequired = function() {
	if (this.getConfig().validation.req !== undefined) {
		return this.getConfig().validation.req;
	}
	return this.isParentRequired();
};

/**
 * @function setRequired
 * @description Bileşenin zorunlu yada zorunlu değil yapar.
 * @param [flag=true] Bileşenin zorunluluğunu belirler
 * @memberof BaseBF
 **/
BaseBF.prototype.setRequired = function(flag) {
	if (!this.getConfig().validation) {
		this.getConfig().validation = {};
	}
	if (flag === undefined) {
		this.getConfig().validation.req = flag = true;
	} else {
		this.getConfig().validation.req = flag;
	}
	
	if(this.bcRef.$CS$.def.BaseBF == "BASIC"){
		this.bcRef.renderRequired();
		if(this.getParent().bcRef.renderRequiredMember){
			this.getParent().bcRef.renderRequiredMember(this, flag);
		}
		return;
	}
	this.saveState();
	window.BFEngine.reRender(this);
};

/**
 * @function isParentRequired
 * @description Bileşenin atalarından herhangi birisinin zorunlu olup olmadığını (true/false) döner.
 * @memberof BaseBF
 **/
BaseBF.prototype.isParentRequired = function() {
	var parent = this.$CS$.parent;
	if (!parent)
	{
		return false;
	}
	if (parent.getConfig().validation.req === undefined)
	{
		return parent.isParentRequired();
	}
	return (parent.getConfig().validation.req == true);
};

BaseBF.prototype.service = function(serviceName, version) {
    var business = this;
    var config;
    var invoke = function(params){
		if( !config ){
				config = {};
		}
		config.version = version || "latest";
        return business.call(serviceName, params, config);
    }

    return {
        options: function(options){
            config = options;
            return { invoke: invoke };
        },
        invoke: invoke
    }
};

/**
 * @function call
 * @description
 *  Asenkron servis çağrılması sağlar.<br/>
 * (*)Bu metod servisler ile ilgili bölümde detaylı olarak anlatılmıştır.
 * @param [SN] Çağrılan servisin adı
 * @param [jp] Servise gönderilen parametre
 * @param [config] Servis çağrısının özelliklerinin değiştirilmesini sağlayan nesne. Servis çağrısında değiştirilebilecek özellikler şunlardır:<br/>
 * - url (string): Servisin çağrılacağı adres (örnek: /other-app/dispatch )<br/>
 * - extraParams (object): Servis çağrısı ile gönderilecebilecek ekstra parametreler (nesne olarak verilmelidir). Bu parametreler jp parametresinden bağımsız olarak http isteğinde ayrıca yer alırlar.<br/>
 * - progress (string): Servis çağrısı sırasında progress bar açılmasını ve progress barda bu özellikte belirtilen mesajın gösterilmesini sağlar<br/>
 * - showMessages (boolean): Servis sonucunda gelen mesajların side tarafından gösterilmesini yada gösterilmemesini sağlar<br/>
 * - type (string): Servis çağrı tipini belirtir. "POST" yada "GET" olabilir.<br/>
 * - compress (boolean): Servise gönderilen parametrelere sıkıştırma uygulama durumunu aktif eder.<br/>
 * @example örnek config parametresi: { url: " /other-app/dispatch", progress: "Lütfen bekleyiniz" }
 * @memberof BaseBF
 **/
BaseBF.prototype.call = function(SN, jp, config) {
	config = config || {};
	var business = this;
	var thenCaller = null;
	var errorCaller = null;
	config.bf = business;
	var callObj = CSCaller.call(SN, jp, config).then(function()
	{
        if(thenCaller){
            thenCaller.apply(business, arguments);
        }
	});
	return {
		then : function(callback)
		{
			thenCaller = callback;
			return this;
		},
		error : function(callback)
		{
			callObj.error(callback);
			return this;
		}
	};
};


BaseBF.prototype.restCall = function(path, parameters, config) {
	config = config || {};
	var business = this;
	var thenCaller = null;
	var errorCaller = null;
	config.bf = business;
	var callObj = CSCaller.restCall(path, parameters, config).then(function()
	{
		if(thenCaller){
			thenCaller.apply(business, arguments);
		}
	});
	return {
		then : function(callback)
		{
			thenCaller = callback;
			return this;
		},
		error : function(callback)
		{
			callObj.error(callback);
			return this;
		}
	};
};

/**
 * @function rerender
 * @description
 * Bileşenin yeniden çizilmesini sağlar.<br/>
 * (*) Bileşen çizilmesi maliyetli bir işlemdir. Bu yüzden rerender metodu gereksiz yere çağrılmamalıdır.
 * @memberof BaseBF
 **/
BaseBF.prototype.rerender = function() {
	if(this.$CS$.parent && !this.$CS$.parent.bcRef.isRendered()){
		return;
	}
	
	var parent = this.$CS$.parent;
	var toRenderMember = this;
	while (parent && !parent.hasVisibleItem(this.$CS$.name) && !parent.isTabular()){
		toRenderMember = parent;
		parent = parent.$CS$.parent;
	}
	if(parent && parent.isTabular()){
		parent = null;
	}

	parent = parent || this;
	if(parent.bcRef.renderMember){
		toRenderMember.saveState();
		BFEngine.destroy(toRenderMember, true);
		parent.bcRef.renderMember(toRenderMember);
	} else {
		if(parent) {
			parent.saveState();
		}
		BFEngine.destroy(parent, true);
		window.BFEngine.reRender(parent);
	}
};

/**
 * @function setLabel
 * @description Bileşenin label'ını değiştirir.
 * @param [label] bileşene verilen label
 * @memberof BaseBF
 **/
BaseBF.prototype.setLabel = function(label) {
	this.setConfig("label", label);
};

/**
 * @function setConfig
 * @description Bileşenin özelliklerinin değerini değiştirmek için kullanılır.
 * <b>Bu metod çağrıldıktan sonra <u>rerender metodunu çağırmaya gerek yoktur</u>. Bu metod zaten rerender'ı tetikler.</b>
 * @param [key] Değeri değiştirilecek özelliğin side'deki ismi
 * @param [value] Özelliğin değeri
 * @param [renderRequest]
 * @memberof BaseBF
 **/
BaseBF.prototype.setConfig = function(key, value, renderRequest) {
	var ref = this.bcRef;
	var parts = key.split(".");
	var config = ref.config;
	for ( var i = 0; i < parts.length - 1; i++) {
		if (!ref.config[parts[i]]) {
			ref.config[parts[i]] = {};
		}
		config = ref.config[parts[i]];
	}
	config[parts[parts.length - 1]] = value;
	if(ref.configChanged){
		ref.configChanged();
	}
	if(renderRequest !== false){
		try {
			BFEngine.a();
			BFEngine.renderRequest(this);
		} finally {
			BFEngine.r();
		}
	}
};

/**
 * #no-doc
 **/
BaseBF.prototype.doReLayout = function(force){
	if(this.bcRef.DRL){
		this.bcRef.DRL(force);
	}
};
	
function BaseNonBusiness(){};

BaseNonBusiness.prototype = new BaseBF();
BaseNonBusiness.prototype.getValue = function(){
	if(typeof this.bcRef.getValue == "function"){
		return this.bcRef.getValue();
	}
};
BaseNonBusiness.prototype.getText = function(){
	if(typeof this.bcRef.getText == "function"){
		return this.bcRef.getText();
	}
};
BaseNonBusiness.prototype.setValue = function(value){
	if(typeof this.bcRef.setValue == "function"){
		this.bcRef.setValue(value);
	}
};
BaseNonBusiness.prototype.isValid = function(config)
{
	if (!this.members)
	{// container değilse geçerlidir
		return true;
	}
	var result = {
		success : true,
		messages : []
	};
	config = config || {};
	var validationConf = this.getConfig().validation;
	for ( var memberName in this.members)
	{
		var dontValidate = false;
		if(config.notValidate){
			for(var i=0; i<config.notValidate.length ;i++){
				if(config.notValidate[i] == this.members[memberName]){
					dontValidate = true;
				}
			}
		}
		if(dontValidate){
			continue;
		}
		var subResult = this.members[memberName].isValid(config);
		if (!subResult.success)
		{
			result.success = false;
			result.messages = result.messages.concat(subResult.messages);
		}
	}
	return result;
};

/**
 * @function isEmpty
 * @description Bileşenin değerinin boş olup olmadığını döner.
 * @memberof BaseNonBusiness
 **/
BaseNonBusiness.prototype.isEmpty = function() {
    return true;
};

// Container BF'lerin ata sınıfı
function BaseContainer()
{
}
BaseContainer.prototype = new BaseBF();
function getRadioGroupValue(bf){
	for (var mname in bf.members){
		var member = bf.members[mname];
		if(member.getValue() && typeof member.getGroupValue == "function"){
			return member.getGroupValue();
		}
	}
};
function setRadioGroupValue(bf, value){
	for (var mname in bf.members){
		var member = bf.members[mname];
		if(typeof member.getGroupValue != "function"){
			continue;
		}
		if(member.getGroupValue() == value){
			member.setValue(true);
		} else {
			member.setValue(false);
		}
	}
};

/**
 * @function getMember
 * @description Bileşenin içindeki elemanı döner.
 * @param [mname] elemanın adı, içiçe de olabilir.
 * @example this.getMember("student.name");
 * @memberof BaseContainer
 **/
BaseContainer.prototype.getMember = function(mname){
	return BFEngine.get(mname, this);
};

/**
 * @function setAsNonBusiness
 * @description Container'ın getValue ve setValue metodları içerisinde bir non-business container gibi alan isimleri olmadan kullanılmasını sağlar.
 * @memberof BaseContainer
 */
BaseContainer.prototype.setAsNonBusiness = function(){
	this.$CS$.nonBuss = true;
};

BaseContainer.prototype.setAssignMap = function(map){
	this.$CS$.assignmap = map;
	if(!map){
		return;
	}
	var deleteList = [];
	for(var key in map){
		if(key.charAt(0) == "#"){
			var grid = BFEngine.get(key.substring(1), this);
			grid.setAsignMap(map[key]);
			deleteList.push(key);
		}
	}
	for(var i=0; i<deleteList.length ;i++){
		delete map[deleteList[i]];
	}
};

/**
 * @function getValue
 * @description
 * Container'ın değerini nesne olarak döner. Bir container'ın değeri içindeki bileşenlerin değeri'dir.<br/>
 * @example Örneğin name ve birthDate alanlarını içeren bir container'ın değeri şu şekilde olabilir: { name:"Jack", birthDate:"19700205" }
 * @param [returnMap]
 * @memberof BaseContainer
 */
BaseContainer.prototype.getValue = function(returnMap) {
	var result = {};
	//2.12.2013 radiogroup olma ihtimalini kontrol ediliyor #mahmuty 
	if(this.bcRef.isRadioGroup){
		var value = getRadioGroupValue(this);
		if(this.isBusinessField()){
			return value;
		}
		result[this.$CS$.name] = value;
		return result;
	}
	
	var valueAssigned = false;
	if (this.members){
		for (var mname in this.members){
			var member = this.members[mname];
			// 5.5.2013 popup'larin icini donme #mahmuty
			if (member.$CS$.definition.SCR && member.$CS$.definition.SCR.layout == "CSC-POPUP"){
				continue;
			}
			
			var object = member.getValue(false);
			if (object === undefined && member.bcRef && (member.bcRef.$CS$.def.BaseBF == "NON-BUSINESS" || member.$CS$.nonBuss)){
				continue;
			}
			if (!Array.isArray(object) && member.isContainer() && (member.definition.NON_BUSINESS || member.$CS$.nonBuss)){
				for ( var property in object) {
					result[property] = object[property];
					valueAssigned = true;
				}
			} else {
				result[member.$CS$.name] = object;
				valueAssigned = true;
			}
		}
	}
	if (!valueAssigned){
		return undefined;
	}
	if(!returnMap && this.$CS$.assignmap){
		returnMap = this.$CS$.assignmap;
	}
	if(returnMap){
		if(!result){
			return result;
		}
		for(var prop in returnMap){
			var value = BEANUtils.getValue(result, prop);
			BEANUtils.setValue(result, returnMap[prop], value);
			BEANUtils.rmPath(result, prop);
		}
	}
	return result;
};

/**
 * @function getText
 * @description Bir container içerisindeki tüm alanların metnini tek bir nesne şeklinde döner.<br/>
 * @example name ve birthDate alanlarini içerin bir container'ın metni şu şekilde olabilir:<br>
 * { name: "Jack", birthDate:"02/05/1976" }
 * @memberof BaseContainer
 **/
BaseContainer.prototype.getText = function() {
	var result = {};
	var valueAssigned = false;
	if (this.members){
		for ( var member in this.members){
			// 5.5.2013 popup'larin icini donme #mahmuty
			if (this.members[member].getTypeName() == "CSC-POPUP"){
				continue;
			}
			var object = this.members[member].getText();
			if (object === undefined){
				continue;
			}
			if (this.members[member].isContainer() && this.members[member].definition.NON_BUSINESS){
				for ( var property in object)
				{
					result[property] = object[property];
					valueAssigned = true;
				}
			} else {
				result[this.members[member].$CS$.name] = object;
				valueAssigned = true;
			}
		}
	}
	if (!valueAssigned){
		return undefined;
	}
	return result;
};

/**
 * @function setValue
 * @description
 * Container içindeki alanlara değer verilmesini sağlar.<br/>
 * (*) value parametresi ile verilen nesnedeki alanlar container'daki alanlar ile birebir örtüşmelidir.
 * @param [value] Container içindeki alanlara verilecek değer.
 * @example person.setValue({name:"Jack", birthDate: "19750205"});
 * @param [clear=false] Değer verme işleminden önce container'ın içindeki tüm alanların değerlerinin temizlenmesini sağlar.
 * @memberof BaseContainer
 **/
BaseContainer.prototype.setValue = function(value, clear) {
	//2.12.2013 radiogroup olma ihtimalini kontrol ediliyor #mahmuty
	if(this.bcRef.isRadioGroup){
		setRadioGroupValue(this, value);
		return;
	}
	if(this.$CS$.assignmap){
		SIDEUtil.setValue(this, value, this.$CS$.assignmap);
	} else {
		for ( var property in value){
			if (this[property]) {
				this[property].setValue(value[property], value[property+"_text"]);
			}
		}
	}
};

/**
 * @function hasVisibleItem
 * @description
 * Container içerisinde enaz bir tane görünür alan olup olmadığını (true/false) döner.<br/>
 * except parametresi ile verilmiş alanı hariç tutar
 * @param [except] bu parametre ile ismi verilen alan kontrol edilmez.
 * @memberof BaseContainer
 **/
BaseContainer.prototype.hasVisibleItem = function(except) {
	if (!this.isVisible())
	{
		return false;
	}
	var ref = this.bcRef;
	if (ref.hasVisibleItem)
	{
		var result =ref.hasVisibleItem();
		if(result !== undefined){
			return result; 
		}
	}
	// => Container BF
	for ( var prop in this.members)
	{
		if(prop == except){
			continue;
		}
		//#hakand gokhanın istegi uzerine popup varsa visible item olarak görme popupı
		if(this.members[prop].bcRef.typeName === "CSC-POPUP"){
			continue;
		}
		if (this.members[prop].hasVisibleItem()){
			return true;
		}
	}
	return false;
};
BaseContainer.prototype.setTitle = function(title){
	if(typeof this.bcRef.setTitle == "function"){
		this.bcRef.setTitle(title);
	} else {
		this.bcRef.config.title = title;
		this.bcRef.reRender();
	}
	var parent = this.$CS$.parent;
	if(parent && typeof parent.bcRef.rerenderChildTitle == "function"){
		parent.bcRef.rerenderChildTitle(this.$CS$.name, title);
	}
};

/**
 * @function isValid
 * @description Container içindeki bileşenlerin değerinin geçerli olup olmadığını döner.
 * @example Geçerli ise dönen cevap:<br/> {success: true, messages:[]}<br/>
 * @example Geçerli değil ise dönen örnek cevap:<br/> {success:false, messages:["'Adı' alanı boş bırakılamaz.", "'Soyadı' alanı boş bırakılamaz."]}
 * @param [config]
 * @memberof BaseContainer
 **/
BaseContainer.prototype.isValid = function(config) {
	var result = {
		success : true,
		messages : []
	};
	config = config || {};
	if(this.bcRef.isRadioGroup && this.isRequired() ){
		var value = getRadioGroupValue(this);
		if(value === undefined){
			result.success = false;
			result.messages.push((this.getConfig().label || this.getConfig().title) + " alanı boş bırakılamaz.");
		}
	}
	for ( var memberName in this.members)
	{
		var member = this.members[memberName];
		var ref = member.bcRef;
		if(ref.typeName == "CSC-POPUP"){
			continue;
		}
		var dontValidate = false;
		if(config.notValidate){
			for(var i=0; i<config.notValidate.length ;i++){
				if(config.notValidate[i] == this.members[memberName]){
					dontValidate = true;
				}
			}
		}
		if(dontValidate){
			continue;
		}
		var subResult = this.members[memberName].isValid(config);
		if (!subResult.success)
		{
			result.success = false;
			result.messages = result.messages.concat(subResult.messages);
		}
	}
	return result;
};

BaseContainer.prototype.isEmpty = function(omitDefaultValue) {
    for(var mname in this.members){
        if(!this.members[mname].isEmpty(omitDefaultValue)){
            return false;
        }
	}
    return true;
};

BaseContainer.prototype.getMembers = function(){
	var result = [];
	for(var mname in this.members){
		result.push(this.members[mname]);
	}
	return result;
};

/**
 * #no-doc
 **/
BaseContainer.prototype.doReLayout = function(force) {
	var ref = this.bcRef;
	if(ref.DRL){
		var goon = ref.DRL(force);
		if(goon === false){
			return;
		}
	}
	for(var memberName in this.members) {
		this.members[memberName].doReLayout(force, true);
	}
};
BaseContainer.prototype.openFihrist = function(fihristName)
{
	if (this.$CS$FIHRISTS$ && this.$CS$FIHRISTS$[fihristName])
	{
		this.$CS$FIHRISTS$[fihristName].apply(this);
	}
};

BaseContainer.prototype.inlineValidationAvailable = function(memName){
	if(this.bcRef.config.inlineVal === undefined){
		if(this.$CS$.parent && this.$CS$.parent.inlineValidationAvailable){
			return this.$CS$.parent.inlineValidationAvailable();
		}
		return false;
	}
	return this.bcRef.config.inlineVal;
};

// Dynamic Container BF'lerin (dinamik member eklenebilen container) ata sınıfı
function BaseDynamicContainer() {};
BaseDynamicContainer.prototype = new BaseContainer();
function addExistMember(bf, BFName, memberName, config, initParam, callback, bindings){
		BFEngine.a();
	try{
		for ( var prop in bf.members) {
			if (prop == memberName) {
				throw "'" + memberName + "' allready exists in business field definition.";
			}
		}
		
		var childBf = {
			BF : BFName,
			name : memberName,
			parent : bf,
			config : csCloneObject(config, true)
		};

		var member = BFEngine.create(childBf, bf.$CS$.CTX+"."+bf.$CS$.name, initParam, undefined, bindings);
		if(!config){
			config = { title: "No title"};
		}
		bf.members[memberName] = member;
		if(!bf[memberName]){
			bf[memberName] = member;
		}
		
		BFEngine.renderRequest(member, function(){
			
			BFEngine.bindBCEvents(member, false);
			
			if(callback){
				callback(null, member);
			}
		});
		//TODO mahmuty&hakand burası şu oruna sebep oluyor (aşağıdaki satır yukarıdaki renderRequest içindeydi)
		//Sayfa çizilmeden load eventleri çağrılabilir.
		//afterRender isimli yeni bir event eklenmeli
		if(typeof bf.bcRef.newMemberAdded == "function"){
			bf.bcRef.newMemberAdded(memberName);
		}
		BFEngine.fireLoadEvents(member, true);
		
		return member;
	}finally{
			BFEngine.r();
	}
}
BaseDynamicContainer.prototype.addMember = function(BFName, memberName, config, initParam, callback, bindings)
{
	var bf = this;
	if(BFName.indexOf(".") < 0){
		BFName = BFEngine.getModuleName(this)+"."+BFName;
	}
	if(BFEngine.isLoaded(BFName)){
		return addExistMember(bf, BFName, memberName, config, initParam, callback, bindings);
	}
	
	//burada önce tanım sunucudan getirilir, sonra main tab'a ekleme yapılır.
	BFEngine.loadDefinition(BFName, function(err, result) {
		if(!result){
			if(callback){
				callback(err, result);
			}
			return;
		}
		addExistMember(bf, BFName, memberName, config, initParam, callback, bindings);
	});
};

function addDynamicEvents(parentBF, memberBF, bpath){
	for(var i=0; parentBF.$CS$.bindings && i < parentBF.$CS$.bindings.length ;i++){
		var b = parentBF.$CS$.bindings[i];
		if(b.on == bpath){
			memberBF.on(b.event, parentBF, b.f);
		} else if(b.on.indexOf(bpath) == 0){
			var member = BFEngine.get(b.on.substring(bpath.length+1), memberBF);
			if(member){
				member.on(b.event, parentBF, b.f);
			}
		}
	}
	if(!memberBF.isBusinessField() && !parentBF.isTabular()){
		//look for child bindings in non-business
		for(var mname in memberBF.members){
			var lastDotIndex = bpath.substring(bpath.lastIndexOf("."));
			var newBPath = lastDotIndex>0 ? bpath.substring(0,lastDotIndex) +"."+mname : mname;
			addDynamicEvents(parentBF, memberBF.members[mname], newBPath);
		}
	}
	if(parentBF.getParent()){
		if(parentBF.isBusinessField() || parentBF.isTabular()){
			bpath = parentBF.getMemberName()+"."+bpath;
		}
		addDynamicEvents(parentBF.getParent(), memberBF, bpath);
	}
}

BaseDynamicContainer.prototype.cloneMember = function(memberName, newMemberName, config, initParam){

	BFEngine.a();
	try {
		newMemberName = newMemberName || getid();
		
		for ( var prop in this.members){
			if (prop == newMemberName){
				throw "'" + newMemberName + "' allready exists in business field definition.";
			}
		}
		
		var definitionMembers = this.$CS$.definition.MEMBERS;
		var clazz = definitionMembers[memberName];
		
		if(!clazz){
			clazz = this[memberName].$CS$.definition.BF_NAME;//TODO non-buss için çalışır mı?
			if(!clazz){
				throw "'" + newMemberName + "' member bf definition not found. Invalid member name.";
			}
		}
		var childDef, setChildDef;
		if(typeof clazz == "string"){
			//dinamik tanıma aitse başında # vardır. Şu an dinamik tanım olmasına bakılmaksızın clone yapılacak.
			if(clazz.charAt(0) == "#"){
				clazz = clazz.substring(1);
			}
			if(clazz.indexOf(".") < 0){
				clazz = this.getModuleName() + "."+clazz;
			}

			childDef = BFEngine.getDefinition(clazz);
			if(!childDef){
				clazz = clazz.substring(clazz.indexOf(".")+1);
				childDef = BFEngine.getDefinition(clazz);
			}
		} else {
			var memInfo = clazz, layout = null, module=this.getModuleName();
			childDef = {
				BF_NAME: "_NB",
				NON_BUSINESS: true
			};
			if(config && config.layout){
				layout = config.layout;
			}
			if(memInfo.MEMBERS){//non-business container
				childDef.MEMBERS = memInfo.MEMBERS;
				childDef.Business = BaseContainer;
				childDef.SCR =  {layout: layout || memInfo.bcName};
			} else {//non-business entity
				childDef.BC_REF =  layout || memInfo.bcName;
			}
			childDef.isTabular =  BCEngine.isTabular(layout || memInfo.bcName, module);
			childDef.Business = BFEngine.getDefinitionOfNonBusiness(layout || memInfo.bcName, module);
			clazz = null;
			setChildDef = true;
		}

		var childBf = {
			BF : clazz,
			name : newMemberName,
			parent : this,
			config : BFEngine.getMemberConfig(this.getConfig(), memberName, childDef.NON_BUSINESS, false)
		};
		if(setChildDef){
			childBf.def = childDef;
		}
		
		_.extend(childBf.config, config);
		
		var start = new Date();
		var member = BFEngine.create(childBf, this.$CS$.CTX+"."+this.$CS$.name, initParam);
		var end = new Date();
		if(!config){
			config = { title: "No title"};
		}
//		console.log("Tab create: (" +config.title+ ") " + (end-start) + " ms");
		this.members[newMemberName] = member;
		if(!this[newMemberName]){
			this[newMemberName] = member;
		}
		if(typeof this.selectTab == "function"){
			this.selectTab(newMemberName);
		} else if(typeof this.select == "function"){
			this.select(newMemberName);
		}

		addDynamicEvents(this, member, memberName);
		
		var bf = this;
		BFEngine.renderRequest(member, function(){
			if(typeof bf.bcRef.newMemberAdded == "function"){
				bf.bcRef.newMemberAdded(newMemberName);
			}
			
			BFEngine.bindBCEvents(member, false);
		});
		//TODO mahmuty&hakand burası şu oruna sebep oluyor (aşağıdaki satır yukarıdaki renderRequest içindeydi)
		//Sayfa çizilmeden load eventleri çağrılabilir.
		//afterRender isimli yeni bir event eklenmeli
		BFEngine.fireLoadEvents(member, true);
		
		return member;
	}finally{
			BFEngine.r();
	}
};
BaseDynamicContainer.prototype.removeMember = function(memberName){
//		BFEngine.a();
	try{
		if(memberName instanceof BaseBF){
			var child = memberName;
			while(child.$CS$.parent != this){
				child = child.$CS$.parent;
				if(!child){
					return;// mahmuty belki exception fırlatılmalı
				}
			}
			memberName = child.$CS$.name;
		}
		var business = this.members[memberName];
		if(!business){
			return;
		}
		BFEngine.rmLazyRendered(this.members[memberName], true);
		if(this.members[memberName] == this[memberName]){
			delete this[memberName];
		}
		var businessName = this.members[memberName].getBusinessName();
		delete this.members[memberName];
		BFEngine.destroy(business);
		if (this.bcRef.removeMember){
			this.bcRef.removeMember(memberName, businessName);
		} else {
//			BFEngine.reRender(this);
			BFEngine.renderRequest(this);
		}
	
	}finally{
//			BFEngine.r();
	}
};

BaseContainer.prototype.removeMember = BaseDynamicContainer.prototype.removeMember;
BaseContainer.prototype.cloneMember = BaseDynamicContainer.prototype.cloneMember;

function CSDGridRow(grid, rowid, members)
{
	this.grid = grid;
	this.rowid = rowid;
	this.members = members || {};
	this.disabled = false;
}
CSDGridRow.prototype.getRowId = function()
{
	return this.rowid;
};
CSDGridRow.prototype.getIndice = function(){
	if(!this.grid.tmembers){
		return -1;
	}
	for(var i=0; i<this.grid.tmembers.length ;i++){
		if(this.rowid == this.grid.tmembers[i].rowid){
			return i;
		}
	}
	return -1;
};
CSDGridRow.prototype.nextRow = function(){
	var indice = this.getIndice();
	return this.grid.tmembers[indice+1];
};
CSDGridRow.prototype.setRowId = function(rowid) {
	this.rowid = rowid;
};
CSDGridRow.prototype.setMembers = function(members) {
	this.members = members;
};

/**
 * Returns the members of row
 */
CSDGridRow.prototype.getMembers = function() {
	return this.members;
};
CSDGridRow.prototype.get = function(memberName) {
	if (!this.members){
		return null;
	}
	if(this.members[memberName]){
		return this.members[memberName];
	}
	for(var mname in this.members){
		var member = this.members[mname];
		if(member.isContainer() && member.$CS$.definition.NON_BUSINESS && member[memberName]){
			return member[memberName];
		}
	}
	return null;
};

function applyReturnMap(rowValue, rmap){
	if(!rowValue){
		return rowValue;
	}
	for(var prop in rmap){
		var value = BEANUtils.getValue(rowValue, prop);
		BEANUtils.setValue(rowValue, rmap[prop], value);
		BEANUtils.rmPath(rowValue, prop);
	}
};

CSDGridRow.prototype.saveState = function() {
	for(var mname in this.members){
		this.members[mname].saveState();
	}
};
CSDGridRow.prototype.setValue = function(value) {
	if(typeof value != "object"){
		return;
	}
	for(var mname in this.members){
		var member = this.members[mname];
		if(!member.isBusinessField() && member.isContainer()){
			member.setValue(value);
		} else {
			member.setValue(value[mname], value[mname+"_text"]);
		}
	}
};

/**
 * @function getValue
 * @description Satır'ın değerini nesne olarak döner. Bir satır'ın değeri içindeki bileşenlerin değeri'dir.<br/>
 * @example Örneğin name ve id alanlarını içeren bir satır'ın değeri şu şekilde olabilir: { name:"Jack", id:5 }
 * @param [memberNames]
 * @param [returnMap]
 * @memberof CSDGridRow
 **/
CSDGridRow.prototype.getValue = function(memberNames, returnMap) {
	if (!this.members) {
		return null;
	}
	if(memberNames === undefined){
		var value = {};
		for ( var memberName in this.members) {
			var member = this.members[memberName];
			var memValue = member.getValue();
			if(memValue === undefined){
				continue;
			}
			if(member.isContainer() && member.$CS$.definition.NON_BUSINESS){
				for(var subMemName in memValue){
					value[subMemName] = memValue[subMemName];
				}
			} else {
				value[memberName] = memValue;
			}
		}
		if(returnMap){
			applyReturnMap(value, returnMap);
		}
		return value;
	}
	if (!Array.isArray(memberNames)) {
		if(this.members[memberNames]){
			return this.members[memberNames].getValue();
		}
		for (var memberName in this.members) {
			var member = this.members[memberName];
			if(member.isContainer() && member.$CS$.definition.NON_BUSINESS){
				var inner = BFEngine.get(memberNames, member);
				if(inner){
					return inner.getValue();
				}
			}
		}
	} else {
		var value = {};
		for (var i=0; i<memberNames.length ;i++) {
			value[memberNames[i]] = this.members[memberNames[i]].getValue();
		}
		if(returnMap){
			applyReturnMap(value, returnMap);
		}
		return value;
	}
};

/**
 * @funciton getText
 * @description Bir satır içerisindeki tüm alanların metnini nesne şeklinde döner.<br/>
 * @example Örneğin name ve birthDate alanlarini içerin bir satırın metni şu şekilde olabilir:<br> {name: "Jack", birthDate:"02/05/1976"}
 * @param [memberNames]
 * @param [options]
 * @memberof CSDGridRow
 **/
CSDGridRow.prototype.getText = function(memberNames, options){
	if (!this.members) {
		return null;
	}
	if(memberNames === undefined){
		var value = {};
		for ( var memberName in this.members) {
			var member = this.members[memberName];
			if(member.bcRef && member.bcRef.typeName == "CSC-HIDDEN"){
				continue;
			}
			
			var text = member.getText(options && options.exportInvisibleColumns);
			
			if(options && options.fromExcelExport){ // Tablodan excel export sırasında bazı bileşenlerin valuelarını almak için. (useValueInExcel özelliği)
				var memConf = member.getConfig();
				if(memConf.layoutConfig && memConf.layoutConfig.useValueInExcel){
					text = member.getValue();
				}
			}
			
			if(text === undefined){
				continue;
			}
			if(member.isContainer() && member.$CS$.definition.NON_BUSINESS){
				for(var subMemName in text){
					value[subMemName] = text[subMemName];
				}
			} else {
				if(options && options.fromExcelExport){
					value[memberName] = text.toString(); //@SametC Excel exportta int değerlerin oluşturduğu sorun için editlendi.
				}
				else{
					value[memberName] = text;
				}
			}
		}
		return value;
	}
	if (!Array.isArray(memberNames)) {
		return this.members[memberNames].getText();
	} else {
		var value = {};
		for (var i=0; i<memberNames.length ;i++) {
			value[memberNames[i]] = this.members[memberNames[i]].getText();
		}
		return value;
	}
};

/**
 * @function setVisible
 * @description Satırı görünür ya da görünmez yapar.
 * @param [flag=true] Satırın görünürlüğünü belirleyen boolean parametredir.
 * @memberof CSDGridRow
 **/
CSDGridRow.prototype.setVisible = function(flag){
	if (flag === undefined){
		flag = true;
	}
	this.visible = flag;
	if(typeof this.grid.bcRef.setVisibleRow == "function"){
		this.grid.bcRef.setVisibleRow(this.rowid, flag);
	}
};

/**
 * @function isVisible
 * @description Satırın görünür olup olmadığını (true/false) döner.
 * @memberof CSDGridRow
 **/
CSDGridRow.prototype.isVisible = function(){
	return this.visible !== false;
};

CSDGridRow.prototype.setEditable = function(flag)
{
	if (flag === undefined){
		flag = true;
	}
	var htmlids = {};
	for ( var memberName in this.members){
		var member = this.members[memberName];
		member.saveState();
		htmlids[memberName] = member.bcRef.getHtmlId();
	}
	this.readonly = !flag;
	if(this.grid.bcRef.dirty){
		this.grid.bcRef.dirty([this]);
	} else {
		for ( var memberName in this.members){
			BFEngine.reRender(this.members[memberName], htmlids[memberName]);// rerender the grid
		}
	}
};

CSDGridRow.prototype.isEditable = function(){
	return !this.readonly;
};

CSDGridRow.prototype.isEmpty = function(omitDefaultValue){
    for (var memberName in this.members) {
        if(!this.members[memberName].isEmpty(omitDefaultValue)){
            return false;
        }
    }
    return true;
};

CSDGridRow.prototype.highlight = function(color){
	this.grid.bcRef.highlightRow(this.rowid, color);
};

CSDGridRow.prototype.addClass = function(className){
	if(!this.clazz){
		this.clazz = "";
	}
	this.clazz = stringTrim(this.clazz+" "+className);
	if(this.grid.bcRef.addClass){
		this.grid.bcRef.addClass(this.rowid, className);
	}
};

CSDGridRow.prototype.rmClass = function (className){
	if(!this.clazz){
		return;
	}
	//className = "bbb" olduğunu varsayarsak
	if(this.clazz == className){// clazz = "bbb"
		this.clazz = "";
	} else if(this.clazz.indexOf(className+ " ") == 0){// clazz = "bbb ccc"
		this.clazz = this.clazz.substring(className.length+1);
	} else if(this.clazz.indexOf(" " + className+ " ") > 0){// clazz = "aaa bbb ccc"
		this.clazz = this.clazz.replace(" " + className, "");
	} else if(this.clazz.indexOf(" " + className) ==  (this.clazz.length - className.length)-1){// clazz = "aaa bbb"
		this.clazz = this.clazz.replace(" " + className, "");
	}
	if(this.grid.bcRef.rmClass){
		this.grid.bcRef.rmClass(this.rowid, className);
	}
};

/**
 * @function styleCell
 * @description Applies given style to all cells in row
 * @param style style name or style object in json
 * @param value style value if style parameters is not json object
 * @memberof CSDGridRow
 * @example
 * row.styleCell("total", {"background-color": "red"});
 * row.styleCell("total", "background-color", "red");
 */
CSDGridRow.prototype.style = function(style, value){
	if(this.grid.bcRef.styleRow) {
		if(typeof style != "object"){
			var styleObj = {};
			styleObj[style] = value;
		} else {
			var styleObj = style;
		}
		this.grid.bcRef.styleRow(this.rowid, styleObj);
	}
};

/**
 * @function styleCell
 * @description Bir cell'e css style verilmesini sağlar.
 * @param mname işlem yapılacak hücerenin member ismi
 * @param style json oalrak stil yada stil'in adı
 * @param value style paramtresi json değilse stil'in değeri
 * @memberof CSDGridRow
 * @example
 * row.styleCell("total", {"background-color": "red"});
 * row.styleCell("total", "background-color", "red");
 */
CSDGridRow.prototype.styleCell = function(mname, style, value){
		if(this.grid.bcRef.styleCell){
			if(typeof style != "object"){
				var styleObj = {};
				styleObj[style] = value;
			} else {
				var styleObj = style;
			}
			this.grid.bcRef.styleCell(this.rowid, mname, styleObj);
		}
};
/**
 * @function addClassToCell
 * @description adds css class to given cell
 * @param mname member name of cell
 * @param className css class name
 * @memberof CSDGridRow
 * @example
 * row.addClassToCell("total", "red-cell");
 */
CSDGridRow.prototype.addClassToCell = function(mname, className){
	if(this.grid.bcRef.addClassToCell){
		this.grid.bcRef.addClassToCell(this.rowid,mname, className);
	}
};
/**
 * @function removeClassFromCell
 * @description removes css class from given cell
 * @param mname member name of cell
 * @param className css class name
 * @memberof CSDGridRow
 * @example
 * row.removeClassFromCell("total", "red-cell");
 */
CSDGridRow.prototype.removeClassFromCell = function(mname, className){
	if(this.grid.bcRef.removeClassFromCell){
		this.grid.bcRef.removeClassFromCell(this.rowid,mname, className);
	}
};

CSDGridRow.prototype.isSelected = function(){
	if(this.grid.bcRef.getSelectedRows){//csc-dt
		var rows = this.grid.bcRef.getSelectedRows();
		for (var i=0; i<rows.length; i++) {
			if (this.rowid == rows[i].rowid) {
				return true;
			}
		}
	} else {
		var rowIds = this.grid.bcRef.getSelectedRowIds();
		for (var i=0; i<rowIds.length; i++) {
			if (this.rowid == rowIds[i]) {
				return true;
			}
		}
	}
	return false;
};

CSDGridRow.prototype.select = function(select){
	if(select === undefined){
		select = true;
	}
	if(this.grid && this.grid.bcRef.selectRow && typeof this.grid.bcRef.selectRow == "function"){
		this.grid.bcRef.selectRow(this.rowid, select);
	} else {
		this.grid.bcRef.select(this, select);
	}
};

CSDGridRow.prototype.getTable = function(){
	return this.grid;
};

CSDGridRow.prototype.getRawRow = function(){
	var row = this.getValue();
	row.rowid = this.rowid;
	if(this.parentid){
		row.parentid = this.parentid;
	}
	return row;
};
window.CSDGridRow = CSDGridRow;
	
// Grid gibi tabular BF'lerin ata sınıfı
function BaseTabular() {};
BaseTabular.prototype = new BaseBF();

/**
 * @function getParent
 * @description Bileşenin atasını döner.
 * @memberof BaseTabular
 **/
BaseTabular.prototype.getParent = function(){
	return this.$CS$.parent;
};

//TODO mahmuty row içeren tabular'lar için farklı yapmak gerekebilir mi?
BaseTabular.prototype.getMembers = function(){
	var result = [];
	for(var mname in this.members){
		result.push(this.members[mname]);
	}
	return result;
};

//TODO mahmuty row içeren tabular'lar için farklı yapmak gerekebilir mi?
BaseTabular.prototype.getMemberNames = function(){
	var result = [];
	for(var mname in this.members){
		result.push(mname);
	}
	return result;
};

BaseTabular.prototype.setMetaData = function(metadata){
	this.metadata = metadata;
};

BaseTabular.prototype.getMetaData = function(rowName, options, exportExcelFromDs){
	if(this.metadata){
		return this.metadata;
	}
	
	var meta = {
		title: this.getConfig().title,
		columns: [],
		headerColumns: [],
		hasTableHeader: false,
		exportInvisibleColumns: options && options.exportInvisibleColumns
	};
	var bf = this;
	var bfThis = this;
	if(rowName){
		bf = this.members[rowName];
	}
	var rowCounter = -1;
	function createMetaData(bfMembers, isHeader, addParentName){
		for(var memberName in bfMembers){
			var member = bfMembers[memberName];
			var ref = member.bcRef;
			
			if(ref === undefined)
				continue;
			if(member.isContainer() && ref.typeName == "CSC-TABLE-ROW"){
				if(isHeader){
					//	ActionBar ise geçiliyor.
					if(Object.getOwnPropertyNames(member.members).length !== 0 && member.getConfig().isActionBar !== true){
						rowCounter++;
					}else{
						continue;
					}
				}
				createMetaData(member.members, isHeader);
			}
			if(member.isContainer() && ref.typeName == "CSC-TABLE-HEADER"){
				var grandson = member.getMembers();
				if(grandson && grandson.length && grandson[0].bcRef.config.isActionBar !== true){
				createMetaData(member.members, true);
				meta.hasTableHeader = true;
			}
			}
			if(ref.typeName == "CSC-HIDDEN" || ref.typeName == "CSC-POPUP" || ref.typeName == "CSC-BUTTON" || ref.typeName == "CSC-MINI-BUTTON" || ref.typeName == "CSC-IMAGE"){
				continue;
			}
			if(bf.bcRef.getMemberMeta){
				var cellMeta = bf.bcRef.getMemberMeta(memberName);
				if(cellMeta && (cellMeta.excel === false || (cellMeta.excel !== true && !cellMeta.visible && !meta.exportInvisibleColumns))){
					continue;					
				}
			} else if(!member.isVisible(false) && !meta.exportInvisibleColumns){
				continue;
			}
			if(member.isContainer()){
				if(ref.typeName == "CSC-VERTICAL" || ref.typeName == "CSC-HORIZONTAL" || ref.typeName == "CSC-BALANCED-VER" || ref.typeName == "CSC-BALANCED-HOR" || ref.typeName == "CSC-BASIC-FORM"){
					createMetaData(member.members, false, member.isBusinessField());
				}
				
				var hasTextItem = false;
				for(var subMemName in member.members){
					if(!ref.typeName == "CSC-HIDDEN" && !ref.typeName == "CSC-POPUP" && !ref.typeName == "CSC-BUTTON" && !ref.typeName == "CSC-MINI-BUTTON"){
						hasTextItem = true;
						break;
					}
				}
				if(!hasTextItem){
					continue;
				}
			}
			
			var memberConfig = member.getConfig();
			if(isHeader){
				var newTitle;
				if(memberConfig.title && memberConfig.title.indexOf("#") == 0){
					var member = BFEngine.get(memberConfig.title.substring(1), bfThis);
					if(!member){
						newTitle = "?";
					} else {
						newTitle = member.getConfig().title || member.getConfig().label || "";
					}
				} else {
					newTitle = memberConfig.title || memberConfig.label || "";
				}
				var metaObj = {
					name: memberName,
					type: ref.typeName,
					title: newTitle,
					width: bfThis.bcRef.getCellWidth(memberName),
					rfDataSource: memberConfig.appRefData || undefined,
					row: rowCounter,
					rowSpan: memberConfig.rowSpan || 1,
					colSpan: memberConfig.colSpan || 1
				};
			}else{
				var metaObj = {
					name: addParentName ? member.$CS$.parent.getMemberName()+"."+memberName : memberName,
					type: ref.typeName,
					title: memberConfig.title || memberConfig.label || "",
					width: bfThis.bcRef.getCellWidth(memberName),
					rfDataSource: memberConfig.appRefData || undefined
				};
				//app ref data ise sadece rf name ekle
				if(memberConfig.appRefData && exportExcelFromDs && getSideDefaults("excel-export-send-appRefData")){
					metaObj.rfDataSource = memberConfig.appRefData;
					metaObj.textField = memberConfig.textField;
					metaObj.valueField = memberConfig.valueField;
					metaObj.sideAppRefData = member.getOptions();
				}
				//side ref data varsa ref. verisini ekle
				if(memberConfig.refDataNames && memberConfig.refDataNames != "none" && exportExcelFromDs){
					metaObj.sideRfDataSource = memberConfig.refDataNames;
					metaObj.sideRfData = SRefDataManager.getData(memberConfig.refDataNames);
				}
				//set options ile verilmişse
				if(!memberConfig.refDataNames && !memberConfig.appRefData && (ref.localOptions && ref.localOptions.length > 0) && exportExcelFromDs){
					metaObj.staticDataSource = ref.localOptions;
				}
				
				if(ref.typeName == "CSC-TARIH"){
					metaObj.isDate = true;
					metaObj.dateFormat = memberConfig.dateFormat || "dd/mm/yyyy";
					metaObj.dateReturnFormat = memberConfig.returnFormat || metaObj.dateFormat;
				}
				if(ref.typeName == "CSC-DATETIME"){
					metaObj.isDate = true;
					metaObj.dateFormat = memberConfig.dateFormat || "dd/mm/yyyy HH:MM";
					metaObj.dateReturnFormat = memberConfig.returnFormat || metaObj.dateFormat;
				}
			}
			if(isHeader){
				meta.headerColumns.push(metaObj);
			}else{
				meta.columns.push(metaObj);
			}
		}
	};
	
	createMetaData(bf.members);
	
	return meta;
};

BaseTabular.prototype.isValid = function() {
	var result = {success:true, messages:[]};
	for(var i=0; i<this.tmembers.length ;i++){
		if(this.tmembers[i].isEditable()){
			for(var mname in this.tmembers[i].members){
				var subResult = this.tmembers[i].members[mname].isValid();
				if (!subResult.success){
					for(var k=0;k<subResult.messages.length;k++){
						subResult.messages[k] = (this.tmembers[i].getIndice()+1) +". satırda doğrulama hatası ("+subResult.messages[k]+")";
					}
					result.success = false;
					result.messages = result.messages.concat(subResult.messages);
				}
			}
			
		}
	}
	return result;
};

/**
 * @function getValue
 * @description Tablonun değerini dizi olarak döner. Bir tablonun değeri içinde satırların değerini barındıran bir dizidir.<br/>
 * Sadece bir satırındeğeri alınmak isteniyorsa o satırın indisi (index) parametresi ile verilmelidir.<br/>
 * Sadece bir kolonun değer(ler)i alınmak isteniyorsa kolon adı (colname) parametresi ile verilmelidir.<br/>
 * @example Örneğin name ve id alanlarını içeren satırlardan oluşan bir tablonun değeri şu şekilde olabilir: <br/> [{ name:"Jack", id:5 }, { name:"Mary", id:8 }]<br/>
 * @param [index=undefined] değeri alınmak istenen satırın indisi. Bu parametre verilmezse tüm satırların değeri dönülür.
 * @param [colname=undefined] değeri alınmak istenen kolonun indisi. Bu parametre verilmezse tüm kolonların değeri dönülür.
 * @memberof BaseTabular
 **/
BaseTabular.prototype.getValue = function(index, colname) {
	var members = this.fmembers || this.tmembers;
	if (!members) {
		members = [];
	}
	if(typeof index == "string"){
		colname = index;
		index = undefined;
	} else if(index === false){
		index = undefined;
	}
    var checkEmpty = this.getConfig().emptyReturn;
	if(index === undefined){
		var values = [];
		for(var i=0; i<members.length ;i++){
            if(checkEmpty && members[i].isEmpty(true)){
                continue;
            }
			values.push(members[i].getValue(colname, this.$CS$.returnMap));
		}
		return values;
	}
	if(index < 0 || index > members.length){
		throw "index is out of bounds";
	}
	return members[index].getValue(colname, this.$CS$.returnMap);
};

/**
 * @function getText
 * @description Bir tablo içerisindeki tüm satırların metnini dizi şeklinde döner.<br/>
 * @example name ve birthDate alanlarini içe rin satırlardan oluşan tablonun metni şu şekilde olabilir:<br>
 * [{name: "Jack", birthDate:"02/05/1976"}, { name: "Mary", birthDate:"08/10/1978" } ]
 * @param [index]
 * @param [colname]
 * @memberof BaseTabular
 **/
BaseTabular.prototype.getText = function(index, colname) {
	if (!this.tmembers) {
		this.tmembers = [];
	}
	if(index === undefined){
		var values = [], tmembers = this.fmembers || this.tmembers;
		for(var i=0; i<tmembers.length ;i++){
			values.push(tmembers[i].getText(undefined, {fromExcelExport: this.$CS$.fromExcelExport, exportInvisibleColumns: this.$CS$.exportInvisibleColumns}));
		}
		return values;
	}
	if(index < 0 || index > this.tmembers.length){
		throw "index is out of bounds";
	}
	return this.tmembers[index].getText(colname);
};
BaseTabular.prototype.setTitle = function(memberName, title){
	if(!memberName && title){
		this.bcRef.config.title = title;
		this.bcRef.reRender();
		return;
	}
	if(!this.members[memberName]){
		return;
	}
	this.members[memberName].setConfig("title", title);
};

/**
 * @function setValue
 * @description Verilen satırdaki bf'lerin değerini verilen değer ile günceller.
 * @param [value]
 * @param [options]
 * @memberof BaseTabular
 */
BaseTabular.prototype.setValue = function(value, options){
	
	//#hakand bu özellik keys için eklendi. Tabular bileşenlerde filtre yapıldıktan sonra setvalue yapıldığında filtre yok oluyor, ayrıca paging içinde aynı durum geçerli.
	var holdOldProp = getSideDefaults("support-tabular-hold-old-props");
	if(holdOldProp && (!options || (options && options.holdOldProp)) ){
		var oldFilters = this.bcRef.filters;
		var oldPageIndex = this.bcRef.pageIndex;
		if(this.bcRef.getSortInfo){
			var oldSortInfo = this.bcRef.getSortInfo();
		}
	}

	
	if(typeof options != "object"){//eskiden options yerine clear(boolean) parametresi alınıyordu
		options = null;
	}
	this.clear();
	this.add(value, options);
	
	
	if(holdOldProp && (!options || (options && options.holdOldProp))){
		if(oldFilters && Object.keys(oldFilters).length > 0 && this.bcRef.makeFilter){
			this.bcRef.filters =  oldFilters;
			this.bcRef.makeFilter();
		}
		if(oldPageIndex !== undefined){
			this.gotoPage(oldPageIndex);
		}
		if(oldSortInfo !== undefined){
			this.bcRef.sortMap = oldSortInfo;
			for(var membername in this.bcRef.sortMap){
				var sortobj = this.bcRef.sortMap[membername];
				if(sortobj.order){
					this.sort(membername, sortobj.order);
				}
			}
		}
	}
};
    
BaseTabular.prototype.isEmpty = function(omitDefaultValue) {
    for(var i=0; i<this.tmembers.length ;i++){
        if(!this.tmembers[i].isEmpty(omitDefaultValue)){
            return false;
        }
    }
    return true;
};

BaseTabular.prototype.hasActiveFilter = function() {
	return this.fmembers != undefined;
};

/**
 * @function filter
 * @param [criterias]
 * @param [useOrLogic]
 * @example criteria: {type: "equal/like", name:"memberName", value:"any"}
 * @memberof BaseTabular
 */
BaseTabular.prototype.filter = function(criterias, useOrLogic,isTableColumn){
	var parentMap = [];
	if(!criterias || criterias.length === 0){
		this.bcRef.clearFilter && this.bcRef.clearFilter(true);
		this.fmembers = undefined;
		this.rerender();
		return;
	}
	this.fmembers = [];
	for(var i=0; i<this.tmembers.length ;i++){
		var testPass = false;
		for(var k=0; k<criterias.length ;k++){
			var cr = criterias[k];
			if(cr.value === undefined){
				testPass = true;
				continue;
			}
			if(cr.type === "eq"){
				var member = this.tmembers[i].get(cr.name);
				var memText = member.getText(true);
				if(typeof memText === "number"){
					memText = ""+memText;
				}
				//eğer kolon bir region yada panel içeriyorsa submember a göre filtre yapmaya çalış
				if(typeof memText === "object" && cr.path){
					var path = cr.path;
					if(cr.path.indexOf((cr.name+".")) > -1){
						path = cr.path.substring(cr.name.length+1);
					}
					var submember = member[path];
					if(submember){
						memText = submember.getText(true);
					}else{
						memText = undefined;
					}
				}
				if(memText === undefined || SIDEString.turkishToLoverCase(memText) === SIDEString.turkishToLoverCase(cr.value)){
					testPass = true;
					if (useOrLogic){
						break;
					}
				} else if(!useOrLogic){
					testPass = false;
					break;
				}
			} else if(cr.type === "like"){
					var member = this.tmembers[i].get(cr.name);
				  var memText = member.getText();



				if(typeof memText === "number"){
					memText = ""+memText;
				}
				//eğer kolon bir region yada panel içeriyorsa submember a göre filtre yapmaya çalış
				if(typeof memText === "object" && cr.path){
					var path = cr.path;
					if(cr.path.indexOf((cr.name+".")) > -1){
						path = cr.path.substring(cr.name.length+1);
					}
					var submember = member[path];
					if(submember){
						memText = submember.getText(true);
					}else{
						memText = undefined;
					}
				}
				if(!cr.value || ( memText === undefined || (memText && SIDEString.turkishToLoverCase(memText).indexOf(SIDEString.turkishToLoverCase(cr.value)) >= 0))){
					testPass = true;
					if (useOrLogic){
						break;
					}
				} else if(!useOrLogic){
					testPass = false;
					break;
				}
			} else if(cr.type === "regex"){
				var member = this.tmembers[i].get(cr.name);
				if(!(cr.value instanceof RegExp)){
					cr.value = new RegExp(cr.value);
				}
				if(cr.value.test(member.getText(true))){
					testPass = true;
				} else {
					testPass = false;
					break;
				}
			} else if(cr.type === "btw"){
				var member = this.tmembers[i].get(cr.name);
				var start = cr.value[0];
				var end = cr.value[1];
				if(!start && !end){
					testPass = true;
					continue;
				}
				var value = member.getValue("yyyymmdd");
				if( (start && end && value >= start && value <= end) || (start && !end && value >= start) || (!start && end && value <= end)){
					testPass = true;
					if (useOrLogic){
						break;
					}
				} else if(!useOrLogic){
					testPass = false;
					break;
				}
			}
		}
		if(testPass){
			if(isTableColumn){
					if(parentMap.indexOf(this.tmembers[i].parentid) == -1){
						parentMap.push(this.tmembers[i].parentid);
						for(var tMemberIndex=0; tMemberIndex<this.tmembers.length; tMemberIndex++){
							if(this.tmembers[i].parentid == this.tmembers[tMemberIndex].rowid){
								this.fmembers.push(this.tmembers[tMemberIndex]);
								tMemberIndex = this.tmembers.length;
							}
						}
					}
			}
			this.fmembers.push(this.tmembers[i]);

		}
	}
    this.pageIndex = 1;//TODO mahmuty filter'dan sonra pagingin yeniden düzenlemesi yapılınca bu buradan kaldırılacak
	this.rerender();
};

/**
 * #no-doc
 **/
BaseTabular.prototype.saveState = function(){
	var members = this.fmembers || this.tmembers;
	for(var i=0; members && i<members.length ;i++){
		var row = members[i];
		if(row.isEditable()){
			for(var mname in row.members){
				row.members[mname].saveState();
			}
		}
	}
};

BaseTabular.prototype.setReturnMap = function(map){
	if(!map || typeof map != "object"){
		return;
	}
	this.$CS$.returnMap = map;
};

BaseTabular.prototype.setCustomSortFunction = function (compareFunc, memberNames) {
	var customSort = this.$CS$.customSort;
	if(!customSort){
		customSort = {};
		this.$CS$.customSort = customSort;
	}
	if(!memberNames){
		customSort["*"] = customSort;
	} else {
		customSort[memberNames.toString()] = compareFunc;
	}
};

BaseTabular.prototype.getSortMeta = function () {
	return this.$CS$.sortMeta;
};


BaseTabular.prototype.sort = function (memberNames, order) {
	if(!memberNames) {
		return;
	}
	if(!Array.isArray(memberNames)) {
		var x = [];
		x.push(memberNames);
		memberNames = x;
	}

	this.$CS$.sortMeta = {
		memberNames: memberNames,
		order: order
	};

	this.saveState();

	if(this.$CS$.ds && this.$CS$.ds.sn) {//datasource var mı? varsa sunucu taafında sort yapılmalı
		var options = this.$CS$.ds.options;
		if(!options) {
			options = {};
			this.$CS$.ds.options = options;
		}
		options.sorters = [];
		for(var i = 0; i < memberNames.length; i++) {
			var memberName = memberNames[i];
			var member = this.members[memberName];
			options.sorters[i] = {property: memberName, direction: order.toUpperCase()};

			if(options.sortMap && options.sortMap[memberName]) {
				options.sorters[i].property = options.sortMap[memberName];
			}
			if(member.getConfig().layoutConfig && member.getConfig().layoutConfig.sortType) {
				options.sorters[i].sortType = member.getConfig().layoutConfig.sortType;
			} else if(typeof member.bcRef.getSortType == "function"){
				options.sorters[i].sortType = member.bcRef.getSortType();
			}
			if(options.tableAliasMap && options.tableAliasMap[memberName]) {
				options.sorters[i].tableAlias = options.tableAliasMap[memberName];
			}
		}

		var bf = this;
		this.gotoPage(1, function () {
			if(typeof bf.bcRef.sortComplated == "function") {
				bf.bcRef.sortComplated(memberNames[0], order);
			}
		});
		return;
	}

	var sortFunc;
	if(this.$CS$.sorters) {
		for(var i = 0; i < this.$CS$.sorters.length; i++) {
			if(this.$CS$.sorters[i].property == memberNames[0] && this.$CS$.sorters[i].compareFunc) {
				sortFunc = this.$CS$.sorters[i].compareFunc;
				break;
			}
		}
	}
	if(sortFunc) {
		this.tmembers.sort(function (a, b) {
			var aBF = a.get(memberNames[i]);
			var bBF = b.get(memberNames[i]);
			if(!aBF || !bBF) {
				return 0;
			}
			var val1, val2;
			if(aBF.bcRef.getRawValue && bBF.bcRef.getRawValue) {
				val1 = aBF.bcRef.getRawValue();
				val2 = bBF.bcRef.getRawValue();
			} else if(aBF.getSelectedText && bBF.getSelectedText) {
				val1 = aBF.getSelectedText();
				val2 = bBF.getSelectedText();
			} else {
				val1 = aBF.getValue();
				val2 = bBF.getValue();
			}
			return sortFunc(val1, val2);
		});
		if(order != "asc") {
			this.tmembers.reverse();
		}
		if(this.bcRef.addRowsAgain) {
			this.bcRef.addRowsAgain();
		} else {
			this.bcRef.addRow();
		}
		return;
	}

	var customSort = this.$CS$.customSort;
	if(customSort && (customSort[memberNames.toString()] || customSort["*"])){
		this.tmembers.sort((customSort[memberNames.toString()] || customSort["*"]));
	} else {
		var sortTypes = {};//string kolonları number olarak sıralamak için
		for(var i = 0; i < memberNames.length; i++) {
			var member = this[memberNames[i]] || BFEngine.get(memberNames[i], this);
			if(member && member.getConfig().layoutConfig && member.getConfig().layoutConfig.sortType) {
				sortTypes[memberNames[i]] = member.getConfig().layoutConfig.sortType;
			} else if(typeof member.bcRef.getSortType === "function") {
				sortTypes[memberNames[i]] = member.bcRef.getSortType();
			}
		}
		if(order === "asc") {
			this.tmembers.sort(compareAsc);
		} else {
			this.tmembers.sort(compareDesc);
		}
	}

	if(this.bcRef.rerenderTable) {
//		BFEngine.renderRequest(this);
//		this.bcRef.rerenderTable(0, 10000);
		this.bcRef.gotoPage(this.getCurrentPage());
	} else if(this.bcRef.addRowsAgain) {
		this.bcRef.addRowsAgain();
	} else {
		this.bcRef.addRow();
	}
	if(typeof this.bcRef.sortComplated == "function") {
		this.bcRef.sortComplated(memberNames[0], order);
	}

	function compareAsc(a, b) {
		for(var i = 0; i < memberNames.length; i++) {
			var aBF = a.get(memberNames[i]);
			var bBF = b.get(memberNames[i]);
			if(!aBF && !bBF) {
				return 0;
			}
			if(!aBF) {
				return 100000;
			}
			if(!bBF) {
				return -100000;
			}
			var val1, val2;
			if(aBF.bcRef.getRawValue && bBF.bcRef.getRawValue) {
				val1 = aBF.bcRef.getRawValue();
				val2 = bBF.bcRef.getRawValue();
			} else if(aBF.getSelectedText && bBF.getSelectedText) {
				val1 = aBF.getSelectedText();
				val2 = bBF.getSelectedText();
			} else {
				val1 = aBF.getValue();
				val2 = bBF.getValue();
			}
			if(val1 instanceof Date) {
				val1 = val1.getTime();
			}
			if(val2 instanceof Date) {
				val2 = val2.getTime();
			}
			if(typeof val2 == "string") {
				if(val1 === undefined || val1 === null) {
					val1 = "";
				} else if(typeof val1 != "string") {
					val1 = "" + val1;
				}
			}
			if(typeof val1 == "string") {
				if(val2 === undefined || val2 === null) {
					val2 = "";
				} else if(typeof val2 != "string") {
					val2 = "" + val2;
				}
			}
			if(!sortTypes[memberNames[i]] && (typeof val1 == "string" || typeof val2 == "string")) {
				var result = val1.localeCompare(val2);
				if(result != 0) {
					return result;
				}
			} else if(sortTypes[memberNames[i]] == "curr1") {
				val1 = val1 ? val1 + "" : val1;
				val2 = val2 ? val2 + "" : val2;
				val1 = val1.replace(/\./g, "").replace(/,/g, ".");
				val2 = val2.replace(/\./g, "").replace(/,/g, ".");

				val1 = new BigDecimal(((val1 || 0) + "").replace(/,/g, ""));
				val2 = new BigDecimal(((val2 || 0) + "").replace(/,/g, ""));
				return val1.compareTo(val2);
			} else {//sort typee number
				val1 = new BigDecimal(((val1 || 0) + "").replace(/,/g, ""));
				val2 = new BigDecimal(((val2 || 0) + "").replace(/,/g, ""));
				return val1.compareTo(val2);
			}
		}
		return 0;
	}

	function compareDesc(a, b) {
		for(var i = 0; i < memberNames.length; i++) {
			var aBF = a.get(memberNames[i]);
			var bBF = b.get(memberNames[i]);
			if(!aBF && !bBF) {
				return 0;
			}
			if(!aBF) {
				return 100000;
			}
			if(!bBF) {
				return -100000;
			}
			if(aBF.getSelectedText && bBF.getSelectedText) {
				var val1 = aBF.getSelectedText();
				var val2 = bBF.getSelectedText();
			} else {
				var val1 = aBF.getValue();
				var val2 = bBF.getValue();
			}

			if(val1 instanceof Date) {
				val1 = val1.getTime();
			}
			if(val2 instanceof Date) {
				val2 = val2.getTime();
			}
			if(typeof val2 == "string") {
				if(val1 === undefined || val1 === null) {
					val1 = "";
				} else if(typeof val1 != "string") {
					val1 = "" + val1;
				}
			}
			if(typeof val1 == "string") {
				if(val2 === undefined || val2 === null) {
					val2 = "";
				} else if(typeof val2 != "string") {
					val2 = "" + val2;
				}
			}

			if(!sortTypes[memberNames[i]] && (typeof val1 == "string" || typeof val2 == "string")) {
				var result = val1.localeCompare(val2);
				if(result != 0) {
					return (-1) * result;
				}
			} else if(sortTypes[memberNames[i]] == "curr1") {
				val1 = val1 ? val1 + "" : val1;
				val2 = val2 ? val2 + "" : val2;

				val1 = val1.replace(/\./g, "").replace(/,/g, ".");
				val2 = val2.replace(/\./g, "").replace(/,/g, ".");

				val1 = new BigDecimal(((val1 || 0) + "").replace(/,/g, ""));
				val2 = new BigDecimal(((val2 || 0) + "").replace(/,/g, ""));
				return val2.compareTo(val1);
			} else {//sort typee number
				val1 = new BigDecimal(((val1 || 0) + "").replace(/,/g, ""));
				val2 = new BigDecimal(((val2 || 0) + "").replace(/,/g, ""));
				return val2.compareTo(val1);
			}
		}
		return 0;
	}

	this.fire("onsort");
};

BaseTabular.prototype.showColumns = function(columns){
	if(!Array.isArray(columns)){
		columns = [columns];
	}
	for(var i in columns){
		var memberName = columns[i];
		if(this.members[memberName]){
			this.members[memberName].setVisible(true);
		}
	}
	this.rerender();
};

BaseTabular.prototype.hideColumns = function(columns){
	if(!Array.isArray(columns)){
		columns = [columns];
	}
	for(var i in columns){
		var memberName = columns[i];
		if(this.members[memberName]){
			this.members[memberName].setVisible(false);
		}
	}
	this.rerender();
};

BaseTabular.prototype.setDataSource = function(serviceName, params, options, callback, errorCallback){
	params = params || {};
	if(params instanceof BaseBF){
		params = params.getValue();
	} else {
		for(var param in params){// ! Sadece bir seviye derinliğe iniliyor
			if(typeof params[param] instanceof BaseBF){
				params[param] = params[param].getValue();
			}
		}
	}
	
	if(callback === undefined && typeof options == "function"){
		callback = options;
		options = undefined;
	}
	options = options || {};
	
	var oldDs = this.$CS$.ds;
	
	this.$CS$.ds = {
		sn: serviceName,
		params: params,
		options: options,
		callback: callback,
		errorCallback: errorCallback
	};
	
	//#hakand bu özellik keys için eklendi. Tabular bileşenlerde filtre yapıldıktan sonra setvalue yapıldığında filtre yok oluyor, ayrıca paging içinde aynı durum geçerli.
	var gotoPageCallback = undefined;
	var holdOldProp = getSideDefaults("support-tabular-hold-old-props");
	if(oldDs && holdOldProp){
		if(!options){
			options = {};
		}
		options.page = oldDs.page;
		var oldFilters = this.bcRef.filters;
		var that = this;
		gotoPageCallback = function(){
			if(oldFilters && Object.keys(oldFilters).length > 0 && that.bcRef.makeFilter){
				that.bcRef.filters =  oldFilters;
				that.bcRef.makeFilter();
			}
		}
	}
	
	
	//Sort type ekleme
	if(options.sorters){
		for(var i=0; i<options.sorters.length ;i++){
			var memberName = options.sorters[i].property;
			var member = BFEngine.get(memberName, this);
			if(member.getConfig().layoutConfig && member.getConfig().layoutConfig.sortType){
				options.sorters[i].sortType = member.getConfig().layoutConfig.sortType;
			}
			if (options.tableAliasMap && options.tableAliasMap[memberName]) {
				options.sorters[i].tableAlias = options.tableAliasMap[memberName];
			}
		}
	}
	
	for(var i=0; options && options.sortMap && options.sorters && i<options.sorters.length ;i++){
		if (options.sortMap[options.sorters[i].property]) {
			options.sorters[i].property = options.sortMap[options.sorters[i].property];
		}
	}
	
	this.gotoPage(options.page || 1, gotoPageCallback);
};

BaseTabular.prototype.currentPage = function(){
	return this.getCurrentPage();
};

BaseTabular.prototype.gotoPage = function(pageNum, callback){
	if(this.$CS$.ds){
		var config = this.getConfig();
		var params = this.$CS$.ds.params;
		this.$CS$.ds.options = this.$CS$.ds.options || {};
		params.pv = {
			start: (pageNum-1) * (config.pageNum || 10),
			limit: config.pageNum || 10,
			sorters: this.$CS$.ds.options.sorters || []
		};
		this.$CS$.ds.page = pageNum;
		var that = this;
		var call = this.call(
			this.$CS$.ds.sn,
			params,
			{
				mask: this,
				progress: this.$CS$.ds.options.progress,
				module: this.$CS$.ds.options.module,
				pm: this.$CS$.ds.options.pm,
				url: this.$CS$.ds.options.url
			}
		).then(function(resp){
			
			if(params.respKeyParam || ( params.extraParams && params.extraParams.respKeyParam ) ){//gibintra
				var key = params.respKeyParam || params.extraParams.respKeyParam;
				if(resp && resp.totalCount && resp.totalCount>= 0){
					this.$CS$.ds.rowcount = resp.totalCount;
				}
				if(resp && resp[key]){
					resp = resp[key];
				}
			} else {
				if(window.$CS$RowCount !== undefined){
					if(window.$CS$RowCount != -1){//-1 totalCount'un değişmediğini aynı olduğunu ifade ediyor
					this.$CS$.ds.rowcount = window.$CS$RowCount;
					}
				} else {
					this.$CS$.ds.rowcount = Array.isArray(resp) ? resp.length : 0;
				}
			}
			
			if(window.$CS$TotalRowSum){
				this.$CS$.ds.sum = window.$CS$TotalRowSum;
			}
			
			if(window.$CS$TotalCellValues){
				for(val in $CS$TotalCellValues){
					this.$CS$.ds[val] = $CS$TotalCellValues[val];
				}
			}
			
			//keys için eklendi
			if(this.$CS$.ds.rowcount == 0 && pageNum != 1){
				return that.gotoPage(1, callback);
			}
			
			if (this.bcRef.clear)	{
				this.bcRef.clear(false);
			}
			
			this.tmembers = [];
			this.add(resp, this.$CS$.ds.options);
			
			if(this.$CS$.ds.callback){
				this.$CS$.ds.callback.apply(this, arguments);
			}
			if(callback){
				callback();
			}
		});
		if(this.$CS$.ds.errorCallback){
			call.error(this.$CS$.ds.errorCallback);
		}
	} else {
		if(this.bcRef.gotoPage){
			this.bcRef.gotoPage(pageNum);
			if(callback){
				callback();
			}
		} else if(this.bcRef.go){
			this.bcRef.go(pageNum);
			if(callback){
				callback();
			}
		}
	}
};

BaseTabular.prototype.getLastPage = function(){
	return Math.floor(this.tmembers.length / this.bcRef.config.pageNum) + 1;
}

BaseTabular.prototype.getCurrentPage = function(){
	if(this.bcRef.getCurrentPage){
		return this.bcRef.getCurrentPage();
	}
	if(this.$CS$.ds && this.$CS$.ds.page){
		return this.$CS$.ds.page;
	}
	return 1;
};

//grid içindeki non-business container'ların da içni dolaşarak members'a ekler
function getFullMemberInfo(bf, name){
	var mems = null;
	if(name){
		mems = [];
	} else {
		mems = {};
	}
	for (var memberName in bf.members) {
		var member = bf.members[memberName];
		if(member.bcRef.typeName == "CSC-POPUP" || member.bcRef.typeName == "CSC-TABLE-HEADER"){
			continue;
		}
		if(name){
			mems.push(memberName);
			if(member.isContainer() && member.$CS$.definition.NON_BUSINESS){
				var innerMems = getFullMemberInfo(member, memberName);
				mems = mems.concat(innerMems);
			}
		} else {
			if(member.isContainer() && member.$CS$.definition.NON_BUSINESS){
				mems[memberName] = [];
				var innerMems = getFullMemberInfo(member, memberName);
				mems[memberName] = mems[memberName].concat(innerMems);
//					for(var i=0; i<innerMems.length ;i++){
//						mems[innerMems[i]] = innerMems;
//					}
			}
		}
	}
	return mems;
}

function setGridValue(memberName, member, value, assignMap){
	if(assignMap && assignMap[memberName]){
		for(var subMemName in assignMap[memberName]){
			var subMemMap = assignMap[memberName][subMemName];
			var subMem = member;
			if(memberName != subMemName){
				subMem = BFEngine.get(subMemName.substring(subMemName.indexOf(".")+1), member);
			}
			var valueSetted = false;
			for(var propName in subMemMap){
				if(propName == "value"){
					subMem.setValue(BEANUtils.getValue(value, subMemMap.value));
					valueSetted = true;
				} else if(propName == "options" && typeof subMem.setOptions == "function"){
					subMem.setOptions(BEANUtils.getValue(value, subMemMap.options));
				} else {
					BEANUtils.setValue(subMem.getConfig(), propName,BEANUtils.getValue(value, subMemMap[propName])); 
				}
			}
			if (!valueSetted && !member.$CS$.definition.NON_BUSINESS) {
				if(value[memberName+"_text"]){
					subMem.setValue({value: value[memberName], text: value[memberName+"_text"]});
				} else {
					subMem.setValue(value[memberName]);
				}
			}
		}
	} else {
		if (!member.$CS$.definition.NON_BUSINESS || !member.isContainer() || member.$CS$.definition.isTabular) {
			if(value[memberName+"_text"]){
				member.setValue({value: value[memberName], text: value[memberName+"_text"]});
			} else {
				member.setValue(value[memberName]);
			}
		} else {
			for (var mname in member.$CS$.definition.MEMBERS){
				setGridValue(mname, member[mname], value, assignMap);
			}
		}
	}
}

BaseTabular.prototype.setBulkData = function(bdata, options) {
	this.bmembers = bdata;
	this.rerender();
};

BaseTabular.prototype.add = function(value, options) {
	if(options && options.page !== undefined && options.rowcount !== undefined){
		this.$CS$.ds = {
			page: options.page,
			rowcount: options.rowcount
		};
	}
	var ref = this.bcRef;
	if(value === undefined || value === null){
		if(this.tmembers.length == 0 && ref.setNodata){
			ref.setNodata(true);
		}
		if(this.tmembers.length == 0 && ref.putMessage){
			ref.putMessage();
		}
		return;
	}
	if (!Array.isArray(value)) {
		value = [ value ];
	} else if(value.length == 0){
		if(this.tmembers.length == 0 && ref.setNodata){
			ref.setNodata(true);
		}
		if(this.tmembers.length == 0 && ref.putMessage){
			ref.putMessage();
		}
		return;
	}
	if(ref.setNodata){
		ref.setNodata(false);
	}
	if(ref.rmMessage){
		ref.rmMessage();
	}
	
	if (this.$CS$.tindexCounter === undefined) {
		this.$CS$.tindexCounter = 0;
	}
	if (!this.tmembers) {
		this.tmembers = [];
	}
	options = options || {};
	var position = options.position;
	var csd = window.csd;
	var def = this.$CS$.definition;
	var rowAssignMap;
	
	var assignMap = null;
	if(options.assignMap){
		assignMap = {};
		for(var key in options.assignMap){
			var propIndex = key.indexOf(":");
			if(propIndex == 0){
				if(!rowAssignMap){
					rowAssignMap = {};
				}
				rowAssignMap[key.substring(1)] = options.assignMap[key];
				continue;
			}
			if(propIndex > 0){
				var memberName = stringTrim(key.substring(0, propIndex));
				var mainMember = memberName;
				if(memberName.indexOf(".") > 0){
					mainMember = mainMember.substring(0, memberName.indexOf("."));
				}
				if(!assignMap[mainMember]){
					assignMap[mainMember] = {};
					assignMap[mainMember][memberName] = {};
				}
				if(!assignMap[mainMember][memberName]){
					assignMap[mainMember][memberName] = {};
				}
				assignMap[mainMember][memberName][stringTrim(key.substring(propIndex+1))] = options.assignMap[key];
			} else {
				var mainMember = key;
				if(key.indexOf(".") > 0){
					mainMember = key.substring(0, key.indexOf("."));
				}
				if(!assignMap[key]){
					assignMap[key] = {};
					assignMap[mainMember][key] = {};
				}
				assignMap[mainMember][key].value = options.assignMap[key];
			}
		}
	}
	
	if(options.sorters){
		this.$CS$.sorters = options.sorters;
	}
	
	var membersInfo = getFullMemberInfo(this);
	var addedRows = [];
	
	var bfName = this.$CS$.definition.BF_NAME;
	if(bfName.indexOf(".") > 0){
		var module = bfName.substring(0, bfName.indexOf("."));
	}
	
	for ( var i = 0; i < value.length; i++) {
		var rowid = this.$CS$.tindexCounter+"";
		var rawrow = {$$rowid: rowid};
		var newRow = new CSDGridRow(this,rowid);
		addedRows.push(newRow);
		//id ve parentid alanları tree grid için gerekli
		if(value[i].rowid){
			newRow.rowid = value[i].rowid;
		}
		if(value[i].parentid){
			newRow.parentid = value[i].parentid;
		}
		newRow.readonly = !(options.readonly === false);
		newRow.selectDisabled = value[i].selectdisabled || value[i].selectDisabled;
		if(rowAssignMap){
			for(var propName in rowAssignMap){
				newRow[propName] = BEANUtils.getValue(value[i], rowAssignMap[propName]);
			}
		}
		if(newRow.selected){
			newRow.select();
			delete newRow.selected;
		}
		
		var bf = this;
		if(ref.rowsMetaData && ref.rowsMetaData.length > 0){
			bf = null;
			for(var m=0; m<ref.rowsMetaData.length ;m++){
				var rowMeta = ref.rowsMetaData[m];
				if(value[i][rowMeta.identifier] !== undefined){
					bf = rowMeta.member;
					break;
				}
			}
			if(!bf){
				bf = ref.rowsMetaData[0].member;
			}
			def = bf.$CS$.definition;
		}
		
		var columnIndex = 0;
		for (var memberName in bf.members){
			var orjMember = bf.members[memberName];//BFEngine.get(memberName, bf);
			if(orjMember.bcRef && orjMember.bcRef.typeName == "CSC-POPUP"){
				continue;
			}
			if(orjMember.bcRef && orjMember.bcRef.typeName == "CSC-TABLE-TOTAL-ROW"){
				continue;
			}
			var config = csCloneObject(orjMember.getConfig(), true);
			delete config.id;
			var clazz = orjMember.$CS$.definition.BF_NAME;
			if(clazz.indexOf(".") < 0 && module){
				clazz = module+"."+clazz;
			}
			var childBf = {
				name : memberName,
				BF : clazz,
				def: orjMember.$CS$.definition,
				parent : this,
				tabular: this,
				config : config,
				intabular: true
			};
			var member = BFEngine.create(childBf, orjMember.$CS$.CTX);
//				BFEngine.setMembersToParent(member);
			newRow.members[memberName] = member;
			copyMemberEvents(orjMember, member);
			member.$CS$.row = newRow;
			
			if(Array.isArray(value[i])){
				member.setValue(value[i][columnIndex]);
				columnIndex++;
			} else {
				setGridValue(memberName, member, value[i], assignMap);
				if(membersInfo[memberName]){
					for(var k=0; k<membersInfo[memberName].length ;k++){
						setGridValue(membersInfo[memberName][k], BFEngine.get(membersInfo[memberName][k], member), value[i], assignMap);
					}
				}
			}
		}
		
		if (!this.tmembers) {
			this.tmembers = [];
		}
		if(position !== undefined && position <= this.tmembers.length) {
			newRow.i = position;
			this.tmembers.splice(position, 0, newRow);
			position++;
			// Araya eklenen satırdan sonraki satırların i'lerini arttır ki row numberlar doğru sıralansın.
			for (var n = position; n < this.tmembers.length; n++) {
				this.tmembers[n].i++;
			}
		} else {
			newRow.i = this.tmembers.length;
			this.tmembers.push(newRow);
		}
		for ( var mm in def.MEMBERS) {
			var tmember = newRow.get(mm);
			if(!tmember){
				continue;
			}
			BFEngine.bindBCEvents(tmember, true, true);
		}
		this.$CS$.tindexCounter++;
	}
	
	this.bcRef.clearFilter && this.bcRef.clearFilter(true);
	
	this.saveState();
    var scrollPos = [$$.getScrollLeft(), $$.getScrollTop()];
	if(ref.addChildRow){//TreeGrid mi?
		for(var i=0; i<addedRows.length ;i++){
			if(!addedRows[i].parentid){
				addedRows[i].parentid = null;
			}
			ref.addChildRow(addedRows[i]);
		}
	} else {
		if(ref.add){
			ref.add(addedRows);
		} else {
			ref.addRow(addedRows, options.position);
		}
	}
	if((options.highlight || options.rowStyle) && ref.styleRow){
		for ( var i = 0; i < value.length; i++) {
			var css = undefined;
			if(options.rowStyle){
				css = BEANUtils.getValue(value[i], options.rowStyle);
			}
			if(options.highlight){
				var color = BEANUtils.getValue(value[i], options.highlight);
				if(color){
					if(css){
						css.backgroundColor = color;
					} else {
						css = {
							backgroundColor: color
						};
					}
				}
			}
			if(css){
				ref.styleRow(addedRows[i].rowid, css);
			}
		}
	}
	
  window.scrollTo(scrollPos[0], scrollPos[1]);
};

BaseTabular.prototype.length = function(){
	var members = this.fmembers || this.tmembers;
	if (!members) {
		members = [];
	}
	return members.length;
};

BaseTabular.prototype.getDataLength = function(){
	if(this.$CS$.ds){
		return this.$CS$.ds.rowcount;
	}else{
		return this.length();
	}
}

BaseTabular.prototype.getRows = function(indices, useAllData){
	var rows = [];
	var members = useAllData === true ? this.tmembers : this.fmembers || this.tmembers;
	if (!this.tmembers) {
		this.tmembers = [];
	}
	if(indices === undefined){
		for(var i=0; i<members.length ;i++){
			rows.push(members[i]);
		}
	} else if(!Array.isArray(indices)){
		rows.push(members[indices]);
	} else {
		for(var i=0; i<indices.length ;i++){
			rows.push(members[indices[i]]);
		}
	}
	return rows;
};

BaseTabular.prototype.getRow = function(indice){
	if (!this.tmembers) {
		this.tmembers = [];
	}
	if(indice === undefined || typeof indice != "number"){
		return null;
	}
	return this.tmembers[indice];
};

BaseTabular.prototype.getRowByRowId = function(rowid){
	if (!this.tmembers) {
		this.tmembers = [];
	}
	for(var i=0; i<this.tmembers.length ;i++){
		if(this.tmembers[i].getRowId() == rowid){
			return this.tmembers[i];
		}
	}
};

BaseTabular.prototype.each = function(callback){
	if (!this.tmembers) {
		this.tmembers = [];
	}
	for(var i=0; i<this.tmembers.length ;i++){
		callback(this.tmembers[i]);
	}
};

BaseTabular.prototype.except = function(row, callback){
	if (!this.tmembers) {
		this.tmembers = [];
	}
	for(var i=0; i<this.tmembers.length ;i++){
		if(row.rowid == this.tmembers[i].rowid){
			continue;
		}
		callback(this.tmembers[i]);
	}
};

// TODO hatalı düzeltilecek mahmuty
BaseTabular.prototype.getIndexFromRowId = function(rowid)
{
	for ( var i = 0; i < this.tmembers.length; i++)
	{
		if (this.tmembers[i].rowid == rowid)
		{
			return i;
		}
	}
	return -1;
};
BaseTabular.prototype.getSelectedRows = function()
{
	if(this.bcRef.getSelectedRows){//csc-dt
		return this.bcRef.getSelectedRows();
	}
	var rows = [];
	var rowIds = this.bcRef.getSelectedRowIds();
	for ( var i = 0; i < rowIds.length; i++) {
		for ( var j = 0; j < this.tmembers.length; j++) {
			if (this.tmembers[j].rowid == rowIds[i]) {
				rows.push(this.tmembers[j]);
			}
		}
	}
	return rows;
};

BaseTabular.prototype.getSelectedRowValues = function(memberNames) {
	var values = [];
	if(this.bcRef.getSelectedRows){//csc-dt
		var rows = this.bcRef.getSelectedRows();
		for ( var i = 0; i < rows.length; i++) {
			values.push(rows[i].getValue(memberNames));
		}
	} else {
		var rowIds = this.bcRef.getSelectedRowIds();
		for ( var i = 0; i < rowIds.length; i++) {
			for ( var j = 0; j < this.tmembers.length; j++) {
				if (this.tmembers[j].rowid == rowIds[i]) {
					values.push(this.tmembers[j].getValue(memberNames));
				}
			}
		}
	}
	return values;
};

BaseTabular.prototype.deleteSelectedRows = function() {
	var rowids;
	if(this.bcRef.getSelectedRows){//csc-dt
		rowids = [];
		var rows = this.bcRef.getSelectedRows();
		for (var i = 0; i < rows.length; i++) {
			rowids.push(rows[i].rowid);
		}
	} else {
		rowids = this.bcRef.getSelectedRowIds();
	}

	if(this.getConfig("treeColumn")){
		for(var i=0; i<rowids.length ;i++){
			this.deleteRow(rowids[i]);
		}
	} else {
		var removeList = [];
		for(var i=0; i<rowids.length ;i++){
			for(var j=0; j<this.tmembers.length ;j++){
				if(this.tmembers[j].rowid+"" === rowids[i]+""){
					removeList.push(this.tmembers[j]);
					this.tmembers.splice(j, 1);
					break;
				}
			}
		}
		for(var i=0; i<this.tmembers.length; i++){
			this.tmembers[i].i = i;
		}
		if(this.bcRef.remove){//csc-dt
			this.bcRef.remove(removeList);
		} else {
			this.bcRef.deleteRow();
		}
	}
};
BaseTabular.prototype.deleteRow = function(rowid) {
	var index = null;
	for ( var j = 0; j < this.tmembers.length; j++) {
		if (this.tmembers[j].rowid+"" === rowid+"") {
			index = j;
			break;
		}
	}
	if (index === null) {
		return;
	}
	var scrollPos = [$$.getScrollLeft(), $$.getScrollTop()];
	if(this.tmembers[index].parentid){//parentid varsa tree-grid'tir diye kabul ediyorum
		var stack = [index];
		var deletes = [index];
		while(stack.length > 0){
			var parentIndex = stack.pop();
			var parent = this.tmembers[parentIndex];
			for(var i=0; i<this.tmembers.length ;i++){
				if(parent.rowid == this.tmembers[i].parentid){
					stack.push(i);
					deletes.push(i);
				}
			}
		}
		deletes.sort();
		var len = deletes.length, removeList = [];
		for(var i=0; i<len ;i++){
			removeList.push(this.tmembers[deletes[i]-i]);
			this.tmembers.splice(deletes[i]-i, 1);
		}
		//update indices
		for(i=0; i<this.tmembers.length ;i++){
			this.tmembers[i].i = i;
		}
		if(this.bcRef.remove){//csc-dt
			this.bcRef.remove(removeList);
		} else {
			this.bcRef.deleteRow(rowid);
		}
	} else {
		var removeList = [this.tmembers[index]];
		this.tmembers.splice(index, 1);
		// Silinen satırdan sonraki satırların i'lerini azalt ki row numberlar doğru sıralansın.
		for (var n = index; n < this.tmembers.length; n++) {
			this.tmembers[n].i--;
		}
		if (this.bcRef.remove) {//csc-dt
			this.bcRef.remove(removeList);
		} else {
			this.bcRef.deleteRow(rowid);
		}
	}
	window.scrollTo(scrollPos[0], scrollPos[1]);

	this.fire("ondeleterow-bymethod", removeList);
	// TODO mahmuty row'lar member icin destroy yapilacak
};

BaseTabular.prototype.getSubtree = function(rowid) {
	var index = null;
	for ( var j = 0; j < this.tmembers.length; j++) {
		if (this.tmembers[j].rowid+"" === rowid+"") {
			index = j;
			break;
		}
	}
	if (index === null) {
		return;
	}
	var tail = [index];
	var all = [this.tmembers[index]];
	while(tail.length > 0){
		var parentIndex = tail.shift();
		var parent = this.tmembers[parentIndex];
		for(var i=0; i<this.tmembers.length ;i++){
			if(parent.rowid == this.tmembers[i].parentid){
				tail.push(i);
				all.push(this.tmembers[i]);
			}
		}
	}
	return all;
};

BaseTabular.prototype.clear = function() {
	this.tmembers = [];
	this.bcRef.clear();
};

//Satırları silmez, satırlardaki elemanların değerleri temizlenir
BaseTabular.prototype.clearValues = function() {
	for(var i=0; i<this.tmembers.length ;i++){
		for(var mname in this.tmembers[i].members){
			this.tmembers[i].members[mname].clear();
		}
	}
};

/**
 * #no-doc
 **/
BaseTabular.prototype.doReLayout = function(force) {

	if(this.bcRef.DRL) {
		this.bcRef.DRL(force);
	}
};



//Dynamic Container BF'lerin (dinamik member eklenebilen container) ata sınıfı
function BaseDynamicTabular() {};
BaseDynamicTabular.prototype = new BaseTabular();

BaseDynamicTabular.prototype.cloneMember = function(memberName, newMemberName, config, initParam){
		
	newMemberName = newMemberName || getid();
	
	for ( var prop in this.members){
		if (prop == newMemberName){
			throw "'" + newMemberName + "' already exists in business field definition.";
		}
	}
	
	var definitionMembers = this.$CS$.definition.MEMBERS;
	var clazz = definitionMembers[memberName];
	if(!clazz){
		throw "'" + newMemberName + "' member bf definition not found. Invalid member name.";
	}
	//dinamik tanıma aitse başında # vardır. Şu an dinamik tanım olmasına bakılmaksızın clone yapılacak.
	if(clazz.charAt(0) == "#"){
		clazz = clazz.substring(1);
	}
	if(clazz.indexOf(".") < 0){
		clazz = this.getModuleName() + "."+clazz;
	}
	
	var childDef = BFEngine.getDefinition(clazz);
	var childBf = {
		BF : clazz,
		name : newMemberName,
		parent : this,
		config : BFEngine.getMemberConfig(this.getConfig(), memberName, childDef.NON_BUSINESS, false)
	};
	
	csExtend(childBf.config, config);
	
	var start = new Date();
	var member = BFEngine.create(childBf, this.$CS$.CTX+"."+this.$CS$.name, initParam);
	var end = new Date();
	if(!config){
		config = { title: "No title"};
	}
//	console.log("Grid member create: (" +config.title+ ") " + (end-start) + " ms");
	this.members[newMemberName] = member;
	if(!this[newMemberName]){
		this[newMemberName] = member;
	}

	addDynamicEvents(this, member, memberName);
	
	for(var i=0; i<this.tmembers.length ;i++){
		var config = csCloneObject(member.getConfig(), true);
		config.id = null;
		var childBf = {
			name : newMemberName,
			BF : clazz,
			parent : this,
			tabular: this,
			config : config,
			intabular: true
		};
		var tmember = BFEngine.create(childBf, member.$CS$.CTX);
		this.tmembers[i].members[newMemberName] = tmember;
		copyMemberEvents(member, tmember);
		tmember.$CS$.row = this.tmembers[i];
	}
	
	if(this.bcRef.addMember){
		this.bcRef.addMember(newMemberName);
	} else if(this.bcRef.renderMember){
		this.bcRef.renderMember(member);
	} else {
		this.rerender();
	}

	BFEngine.fireLoadEvents(member, true);
	BFEngine.bindBCEvents(member, false);
	
	return member;
};

BaseDynamicTabular.prototype.removeMember = function(memberName){
//		BFEngine.a();
	try{
		if(memberName instanceof BaseBF){
			var child = memberName;
			while(child.$CS$.parent != this){
				child = child.$CS$.parent;
				if(!child){
					return;// mahmuty belki exception fırlatılmalı
				}
			}
			memberName = child.$CS$.name;
		}
		var business = this.members[memberName];
		if(!business){
			return;
		}
		BFEngine.rmLazyRendered(this.members[memberName], true);
		if(this.members[memberName] == this[memberName]){
			delete this[memberName];
		}
		var businessName = this.members[memberName].getBusinessName();
		delete this.members[memberName];
        for(var i=0; i<this.tmembers.length ;i++){
            var b = this.tmembers[i].members[memberName];
            if(b){
                delete this.tmembers[i].members[memberName];
                BFEngine.destroy(b);
            }
        }
		BFEngine.destroy(business);
		BFEngine.renderRequest(this);
	}finally{
//			BFEngine.r();
	}
};

// Register Bases
BFEngine.BaseBFMap["BASIC"] = "BaseBF";
BFEngine.BaseBFMap["NON-BUSINESS"] = "BaseNonBusiness";
BFEngine.BaseBFMap["CONTAINER"] = "BaseContainer";
BFEngine.BaseBFMap["DYN-CONTAINER"] = "BaseDynamicContainer";
BFEngine.BaseBFMap["DYN-TABULAR"] = "BaseDynamicTabular";
BFEngine.BaseBFMap["TABULAR"] = "BaseTabular";




window.SAsync = {
  /**
   * Parametre olarak aldığı function dizisini biri tamamlandıktan sonra diğeri başlayacak şeklinde sıra ile çağırır.
   * Birisinde hata oluştuğunda işlem kesilir ve finishCallback çağrılır. Tümü başarı ile tamamlandıktan sonra finishCallback çağrılır.
   * @param {function[]} funcArr - function array
   * @param {function} finishCallback - finish callback
   */
  series: function(funcArr, finishCallback){
    if(!funcArr || !Array.isArray(funcArr) || !funcArr.length){
      finishCallback(null);
    }
    function call(index){
      funcArr[index](function(err) {
        if(err) {
          finishCallback(err, index);
          return;
        }
        index++;
        if(index == funcArr.length){
          finishCallback();
          return;
        }
        call(index);
      });
    }
    call(0);
  },
  /**
   * Parametre olarak aldığı function dizisini sıra ile ve birbirlerinin tamamlanmasını beklemeden çağırır.
   * Birisinde hata oluştuğunda finishCallback çağrılır. Başka hatalar oluştuğunda finishCallback çağrılmaz sadece ilk hatada çağrılır.
   * Tümü başarı ile tamamlandıktan sonra finishCallback çağrılır.
   */
  parallel: function(funcArr, finishCallback){
    var result = [], counter = 0, errorOccured=false;
    if(!funcArr || !Array.isArray(funcArr) || !funcArr.length){
      finishCallback(null, result);
    }
    function call(index){
      funcArr[index](function(err) {
        if(errorOccured){
          return;
        }
        if(err){
          errorOccured = true;
          finishCallback(err, index);
        }
        counter++;
        if(counter == funcArr.length){
          finishCallback();
        }
      });
    }
    for(var i=0; i<funcArr.length ;i++){
      call(i);
    }
  },

  /**
   * Parametre olarak aldığı dizideki her eleman için eachFunction'ı biri tamamlandıktan sonra diğeri başlayacak şeklinde sıra ile çağırır.
   * Birisinde hata oluştuğunda işlem kesilir ve finish callback çağrılır. Tümü başarı ile tamamlandıktan sonra finish callback çağrılır.
   */
  map: function(array, eachCallback, finishCallback){
    if(!array || !Array.isArray(array) || !array.length){
      finishCallback(null);
    }
    function call(index){
      eachCallback(array[index], function(err) {
        if(err) {
          finishCallback(err, index);
          return;
        }
        index++;
        if(index == array.length){
          finishCallback();
          return;
        }
        call(index);
      });
    }
    call(0);
  },

  /**
   * Parametre olarak aldığı dizideki her eleman için eachFunction'ı sıra ile ama biröncekinin tamamlanmasını beklemeden çağırır.
   * Tümü tamamlandıktan sonra finish callback çağrılır. callback'te işlemlerin sonucu arary içinde paramtre ile verilir.
   */
  parallelMap: function(array, eachCallback, finishCallback){
    if(!array || !Array.isArray(array) || !array.length){
      finishCallback([]);
    }
    var status = [], completeCount = 0;
    function call(index){
      eachCallback(array[index], function(err, result) {
        if(err) {
          status[index] = err;
          finishCallback(err, index);
          return;
        } else {
          status[index] = result;
        }
        completeCount++;

        if(completeCount == array.length){
          finishCallback(null, status);
          return;
        }
      });
    }
    for(var i=0; i<array.length ;i++){
      call(i);
    }
  }
}

/**
 * @hakand
 */
function CSAuthorizationManager() {

	var disableKey = "disable";
	var visibleKey = "visible";
	var seperator = ".";

	this.root = null;
	this.globalAuthEnable;
	this.moduleAuthMap = {};
	this.authMap = {};//Global auth map
	/*
	 * Sample authArr
	 [
	 {key:"root.text1."+visibleKey, value:false},
	 {key:"root.BB.panel.ccc."+visibleKey, value:"false"},
	 {key:"root.BB.panel."+disableKey, value:"false"}
	 ];
	 */

	this.setAuthData = function (module, authArr) {
		var authMap;
		if (module) {
			this.moduleAuthMap[module] = {};
			authMap = this.moduleAuthMap[module];
		} else {
			authMap = this.authMap;
		}

		SLog.debug("[CSAuthorizationMan] set auth data started with " + authArr.length + " auth data.");
		for (var i = 0; i < authArr.length; i++) {
			var auth = authArr[i];
			if (auth.key.indexOf("root.") == 0) {
				auth.key = auth.key.substring(5);
			}
			var dotIndex = auth.key.indexOf(".");
			var lastDotIndex = auth.key.lastIndexOf(".");
			if (dotIndex <= 0 || lastDotIndex <= 0) {
				SLog.error("hatali ekran yetkisi: " + auth.key);
				continue;
			}

			var BFName = auth.key.substring(0, dotIndex);
			var path = auth.key.substring(dotIndex + 1, lastDotIndex);
			var prop = auth.key.substring(lastDotIndex + 1);
			if (!authMap[BFName]) {
				authMap[BFName] = {};
			}
			if (!authMap[BFName][path]) {
				authMap[BFName][path] = {};
			}
			if (typeof auth.value == "string") {
				auth.value = stringTrim(auth.value) == "true";
			}
			authMap[BFName][path][prop] = auth.value;
		}
		SLog.debug("[CSAuthorizationMan] set auth data finished.");
	};

	this.init = function (globalAuthEnable, callback) {
		this.globalAuthEnable = globalAuthEnable;

		if (globalAuthEnable) {
			var me = this;
			CSCaller.call("SIDE.GET_USER_PERMISSIONS", {
				dutyid: CSSession.get("DUTYID") || "DUMMY_DUTY",
				orgid: CSSession.get("ORGID")
			}, {
				url: SideModuleManager.getAppUrl(SideModuleManager.getLocalModuleName(), csdc.DISPATCH_APP_CSDYS)
			}).then(function (data) {
				me.setAuthData(null, data);
				if (callback) {
					callback();
				}
			});
		} else {
			if (callback) {
				callback();
			}
		}
	};

	function bussPath(bf, lastParent) {
		var path = [bf.$CS$.name];
		var parent = bf.$CS$.parent;
		while (parent != lastParent) {
			if (!parent.$CS$.definition.NON_BUSINESS) {
				path.push(parent.$CS$.name);
			}
			parent = parent.$CS$.parent;
		}
		var result = "";
		for (var i = path.length - 1; i >= 0; i--) {
			result += path[i];
			if (i != 0) {
				result += ".";
			}
		}
		return result;
	}

	this.is = function (bf, prop, defValue) {
		var module = bf.getModuleName();
		if (!this.globalAuthEnable && !this.moduleAuthMap[module]) {
			return defValue;
		}
		//Sompo için dev ortamında yetki kontrolü yapılmaması için
		if ("00000000000001" === CSSession.getUserId()) {
			return defValue;
		}
		var parent = bf.$CS$.parent;
		if (!parent) {
			return defValue;//TODO mahmuty unutma implement edilecek
		}
		var result = defValue;
		var authMap = this.globalAuthEnable ? this.authMap : this.moduleAuthMap[module];

		if (!bf.$CS$.definition.NON_BUSINESS) {
			var BFName = bf.$CS$.definition.BF_NAME;
			if (BFName.indexOf(".") > 0) {
				BFName = BFName.substring(BFName.indexOf(".") + 1);
			}
			if (authMap[BFName]) {
				var path = ".";
				if (authMap[BFName][path]) {
					if (authMap[BFName][path][prop] !== undefined) {
						result = authMap[BFName][path][prop];
						return result;
					}
				}
			}
		}

		while (parent) {

			//#hakand root.RG_DOSYA_EXPERTIZ.invisible kuralı işlemiyordu. İşlemesi için eklendi. Yani bir Region kökten invisible yapılmış olabilir. ilgili tabın görünmemesi gerekiyor olabilir. vs...
			if (!parent.$CS$.definition.NON_BUSINESS) {
				var BFName = parent.$CS$.definition.BF_NAME;
				if (BFName.indexOf(".") > 0) {
					BFName = BFName.substring(BFName.indexOf(".") + 1);
				}
				if (authMap[BFName]) {
					var path = ".";
					if (authMap[BFName][path]) {
						if (authMap[BFName][path][prop] !== undefined) {
							result = authMap[BFName][path][prop];
							return result;
						}
					}
				}
			}

			if (parent.$CS$.definition.NON_BUSINESS) {
				parent = parent.$CS$.parent;
				continue;
			}
			var BFName = parent.$CS$.definition.BF_NAME;
			if (BFName.indexOf(".") > 0) {
				BFName = BFName.substring(BFName.indexOf(".") + 1);
			}
			if (!authMap[BFName]) {
				parent = parent.$CS$.parent;
				continue;
			}
			var path = bussPath(bf, parent);
			if (!authMap[BFName][path]) {
				parent = parent.$CS$.parent;
				continue;
			}
			if (authMap[BFName][path][prop] !== undefined) {
				result = authMap[BFName][path][prop];
			}
			parent = parent.$CS$.parent;
		}

		return result;
	};

	this.isDisabled = function (bf) {
		return this.is(bf, disableKey, false);
	};

	this.isVisible = function (bf) {
		return this.is(bf, visibleKey, true);
	};
}











function BaseBC() {
};

BaseBC.prototype.setConfig = function(config) {
	csDefaults(config, this.defaults);
	this.config = config;
	if (!this.config.id) {
		this.config.id = BCEngine.newId();
	}
	this.config.disabled = this.config.disabled === true;
	this.config.readonly = this.config.readonly === true;
	this.config.visible = !(this.config.visible === false);
};

BaseBC.prototype.getConfig = function() {
	return this.config;
};

BaseBC.prototype.isRendered = function(){
	if($$.byid(this.getHtmlId())){
		return true;
	}
	return false;
};

BaseBC.prototype.getHtmlId = function(){
	return this.config.id;
};

BaseBC.prototype.getChildContainer = function(){
	return $$.byid(this.getHtmlId());
};

// kendisini yeniden render eden kod
BaseBC.prototype.reRender = function(htmlid) {
	if(!htmlid){
		htmlid = this.getHtmlId();
	}
	var $$myself = $$.byid(htmlid);
	if(!$$myself){//mahmuty zaten hiç çizilmemiş
		return;
	}

	var $$parent = $$myself.parentNode;
	BFEngine.destroy(this.bf, true);
	
	//Benden önce ve benden sonra bir html element yok. O zaman atamın içine beni render et.
	$$.remove($$myself);
	BFEngine.render(this.bf, $$parent);
};

BaseBC.prototype.rreq = function(){
	/**
	 * Make render request to BFEngine
	 */
	BFEngine.renderRequest(this.bf);
}

BaseBC.prototype.clear = function(){
	if(this.setValue){
		this.setValue(undefined);
	}
};

BaseBC.prototype.byid = function(id) {
	return document.getElementById(id);
};

BaseBC.prototype.on = function(eventName, callback) {
	if(eventName != "drop" && eventName != "dragover"){
		var found = false;
		for ( var i = 0; i < this.events.length; i++) {
			var event = stringTrim(this.events[i]);
			if(event.indexOf("(") > 0){
				event = event.substring(0, event.indexOf("("));
			}
			if (event == eventName) {
				found = true;
				break;
			}
		}
		if (!found) {
			return;
		}
	}
	this.bindEvent(eventName, callback);
};

BaseBC.prototype.isRebindRequired = function(){
	return true;
};

BaseBC.prototype.isDisabled = function() {
	return this.config.disabled;
};

BaseBC.prototype.setDisabled = function(flag) {
	this.config.disabled = flag;
};

BaseBC.prototype.isVisible = function() {
	return this.config.visible;
};

BaseBC.prototype.setVisible = function(flag) {
	this.config.visible = flag;
};

BaseBC.prototype.isReadonly = function() {
	return this.config.readonly;
};

BaseBC.prototype.setReadonly = function(flag) {
	this.config.readonly = flag;
};

BaseBC.prototype.isParentDisabled = function() {
	return BFEngine.isParentDisabled(this.bf);
};

BaseBC.prototype.isParentReadonly = function() {
	return BFEngine.isParentRadonly(this.bf);
};

BaseBC.prototype.isParentInvisible = function() {
	return false;// TODO Yukarıya doğru herhangi bir atanın visible olup
					// olmadığını dönmeli
};

BaseBC.prototype.renderRequired = function(flag) {
	if(!this.config.validation){
		return;
	}
	var $$dom = $$.byid(this.config.id);
	if(!$$dom){
		return;
	}
	if(this.config.validation.req){
		$$.addClass($$dom, "csc-required");
	} else {
		$$.rmClass($$dom, "csc-required");
	}
};

BaseBC.prototype.setClass = function(clazz) {
	this.config.cssClass = clazz;
	var htmlid = this.getHtmlId();
	var $$dom = $$.byid(htmlid);
	if($$dom){
		$$.setClass($$dom, clazz);
	}
};

BaseBC.prototype.addClass = function(clazz) {
	if(!this.config.cssClass){
		this.config.cssClass = "";
	}
	this.config.cssClass += " " + clazz;
	var htmlid = this.getHtmlId();
	var $$dom = $$.byid(htmlid);
	if($$dom){
		$$.addClass($$dom, clazz);
	}
};

BaseBC.prototype.hasClass = function(clazz) {
	var htmlid = this.getHtmlId();
	var $$dom = $$.byid(htmlid);
	if($$dom){
		return $$.hasClass($$dom, clazz);
	}
	return false;
};

BaseBC.prototype.removeClass = function(clazz) {
	if(!this.config.cssClass){
		return;
	}
	this.config.cssClass = this.config.cssClass.replace(new RegExp(clazz, 'g'), "");
	var htmlid = this.getHtmlId();
	var $$dom = $$.byid(htmlid);
	if($$dom){
		$$.rmClass($$dom, clazz);
	}
};

BaseBC.prototype.applyAddedClasses = function(){
};

BaseBC.prototype.applyInlineValidation = function($$this, $$outer){
	if(this.bf.$CS$.parent && this.bf.$CS$.parent.inlineValidationAvailable && this.bf.$CS$.parent.inlineValidationAvailable()){
		if(!$$outer){
			$$outer = $$this;
		}
		var bf = this.bf;
		$$this.onblur = function(){
			var valResult = bf.isValid();
			var id = $$outer.getAttribute("id");
			if(!valResult.success){
				$$.addClass($$outer.parentNode, "val-error");
				$$.addClass(id+"-lbl", "val-error-lbl");
				var titleMsg = "";
				for(var i=0;i<valResult.messages.length;i++){
					titleMsg += valResult.messages[i];
					if(i!=valResult.messages.length-1){
						titleMsg += "\n";
					}
				}
				$$.attr(id+"-val", "title", titleMsg);
			} else {
				$$.rmClass($$outer.parentNode, "val-error");
				$$.rmClass(id+"-lbl", "val-error-lbl");
			}
		};
		$$this.onfocus = function(){
			$$.rmClass($$outer.parentNode, "val-error");
			$$.rmClass($$outer.getAttribute("id")+"-lbl", "val-error-lbl");
		};
	}
};

BaseBC.prototype.validate = function(){
	if (this.config.validation.regex) {
		var value = this.bf.getValue();
		if(!value){
			return;
		}
		try {
			//#hakand regex /[A-Z0-9]/ formatında olmalı
			var regex = eval(this.config.validation.regex);
			if (!regex.test(value)) {
				return this.config.label + " alanının değeri geçersiz.";
			}
		} catch (e) {
			console.error("regular expression işletiilirken hata oluştu. RegEX:" + this.config.validation.regex + " value: " + value);
		}
	}
};

BaseBC.prototype.putValidationMessage = function(message){
	if(!message){
		return;
	}
	var $$dom;
	if(typeof this.getOuterDom == "function"){
		$$dom = this.getOuterDom();
	} else {
		$$dom = $$.byid(this.getHtmlId());
	}
	if(!$$dom){
		return;
	}
	$$.addClass($$dom.parentNode, "val-error");
	var $$lbl = $$.byid(this.config.id+"-lbl");
	if($$lbl){
		$$.addClass($$lbl, "val-error-lbl");
	}
	var $$val = $$.byid(this.config.id+"-val");
	if($$val){
		$$val.setAttribute("title", message);
	}
	
	$$dom.onfocus = function(){
		$$.rmClass($$dom.parentNode, "val-error");
		if($$lbl){
			$$.rmClass($$lbl, "val-error-lbl");
		}
	};
};

BaseBC.prototype.addValidationClass = function(){
	
};
/**
 * Bu sınıftaki metod tanımları BC Engine tarafından "register" metodu ile
 * eklenen BC lere eklenecektir.
 *
 * Yani tüm BC sınıfları bu sınıfı kalıtır.
 *
 * @returns
 */
(function(window, undefined)
{
	function BCEngine()
	{
		var localModuleName = null;
		var moduleSeperator = "-";
		var moduleName = null;
		var typeRegistry = {};
		var idInc = 1000;

		/**
		 * Module manager'da ilgili module ait type ların register edilmesi için  kullanılır.
		 */
		this.setRegisterModuleName = function(moduleNameParam){
			moduleName = moduleNameParam;
		};

		this.getRegisterModuleName = function(){
			return moduleName;
		};

		this.clearRegisterModuleName = function(){
			moduleName = null;
		};

		this.printRegisteredTypes = function(){
			for ( var typeName in typeRegistry){
				console.log(typeName);
			}
		};

		this.isTabular = function(bcName, moduleName){
			var type = typeRegistry[bcName];
			if(moduleName && typeRegistry[moduleName+"-"+bcName]){
				type = typeRegistry[moduleName+"-"+bcName];
			}
			var def = type.def;
			return def.BaseBF == "TABULAR" || def.BaseBF == "DYN-TABULAR";
		};

		this.registerType = function(typeName, definition){

			/*
			 * Bir BC kaydedildiğinde definition'dan bir proxy object
			 * oluşturulur. Dış alemdeki kullanıcılar bu proxy'i bilecektir.
			 * Proxy'de sadece dışarıya açılan metodlara ve BaseBC'deki
			 * metodlara yer verilir.
			 */

			definition.DEFAULTS = definition.DEFAULTS || {};
			var mname = moduleName || SideModuleManager.getLocalModuleName();
			if((typeof BCDefaults != "undefined") && BCDefaults[mname] && BCDefaults[mname][typeName]){
				for(var key in BCDefaults[mname][typeName]){
					definition.DEFAULTS[key] = BCDefaults[mname][typeName][key];
				}
			}

			var type = function(config, moduleName){
				var proxy = new definition.Type(moduleName);
				proxy.typeName = typeName;
				proxy.defaults = definition.DEFAULTS || {};
				proxy.events = definition.EVENTS || [];
				proxy.setConfig(config);
				return proxy;
			};
			// Proxy object kaydediliyor
			typeRegistry[moduleName ? moduleName+moduleSeperator+typeName : typeName] =
			{
				def : definition,
				type : type
			};
		};
		this.getAllDefinitionList = function(){
			return Object.keys(typeRegistry);
		};
		/**
		 * Kayıtlı BC tanımını döner. BFEngine kullanıyor.
		 */
		this.getDefinition = function(typeName, moduleName){
			var fullTypeName = undefined;
			if(SModules[moduleName] && SModules[moduleName].clonedFrom){
				moduleName = SModules[moduleName].clonedFrom;
			}
			if(window.csdTestScreen){
				moduleName = null;
			}
			if(moduleName && moduleName != "side"){
//			if(!window.csd){
				fullTypeName = moduleName+moduleSeperator+typeName ;
			}

			if(typeRegistry[fullTypeName] === undefined){
				if(typeRegistry[typeName] === undefined){
					console.error("[BCEngine] typeName:" + typeName);
					return undefined;
				}
				return typeRegistry[typeName].def;
			}
			return typeRegistry[fullTypeName].def;
		};
		/**
		 * BFEngine.wrapBusiness <-
		 */
		this.createType = function(typeName, config, business){
			var moduleName = undefined;
			var bfName = business.$CS$.definition.BF_NAME;
			if( (SSession.getEnv() != "designer" && SSession.getEnv() != "dev")){
				moduleName = business.getModuleName();
				// modul clone yapılmışsa
				var sourceModule = SideModuleManager.getModules()[moduleName].clonedFrom;
				if(sourceModule){
					moduleName = sourceModule;
				}

				if(!localModuleName){
					localModuleName = SideModuleManager.getLocalModuleName();
				}
				if(localModuleName != moduleName && moduleName != "side"){
					typeName = moduleName+moduleSeperator+typeName;
				}
			}

			if (!typeRegistry[typeName]){
				//DYOP projesi için düzenleme yapıldı.
				var operatorIndex = typeName.indexOf("-");
				typeName = typeName.slice(operatorIndex+1);
				if(!typeRegistry[typeName]){
					throw {
						scope : "BC",
						Ex : typeName + " isimli bir tip tanimli degil"
					};
				}
			}
			var definition = typeRegistry[typeName].def;
			var type = new typeRegistry[typeName].type(config, moduleName);
			type.$CS$ = {
				def: definition
			};
			type.bf = business;
			if (definition.BC_Refs){
				type.$CS$.refs = {};
				for ( var i = 0; i < definition.BC_Refs.length; i++){
					var refType = this.createType(definition.BC_Refs[i].ref, config, business);
					for ( var j = 0; j < definition.BC_Refs[i].states.length; j++)
					{
						type.$CS$.refs[definition.BC_Refs[i].states[j]] = refType;
					}
				}
			}
			if ( type.init) {
	//			type.init();
			}
			return type;
		};
		this.newId = function(key){
			var id = "gen__" + idInc++;
			if(byid(id)){
				console.log("[BC Engine] aynı id'ye sahip baska dom elementi var. yeni id üretiliyor.");
				return this.newId(key);
			}else{
				return id;
			}
		};
	}
	var BCEngine = new BCEngine();
	window.BCEngine = BCEngine;
})(window);
 /**
 * @author mahmuty, hakand
 */
var CSPopupContext = new function(){
	
	var zindexCounter = 2000;
	var globalZindexCounter = 3000;
	var utilZindexCounter = 5000;
	var globalConfig = {};
    
	var eventIdCounter = 1;
	var events = {};

	var idCounter = 1;
	var popups= [];
	

	
	this.newZindex = function(){
		zindexCounter += 2;
		return zindexCounter;
	};
	this.getZindex = function(){
		return zindexCounter;
	};
	this.newGlobalZindex = function(){
		globalZindexCounter += 2;
		return globalZindexCounter;
	};
	this.getGlobalZindex = function(){
		return globalZindexCounter;
	};
	this.utilZindex = function(){
		utilZindexCounter += 2;
		return utilZindexCounter;
	};
	
	this.decreaseZindex = function(){
		zindexCounter -= 2;
		return zindexCounter;
	};
	
	this.setGlobalConfig = function(confObj){
		for(var key in confObj){
			globalConfig[key] = confObj[key];
		}
	};
	
	this.getGlobalConfig = function(){
		return globalConfig;
	};
	
	this.clearGlobalConfig = function(){
		globalConfig = {};
	};
	
	this.getPopups = function(){
		return popups;
	};
	
	this.getPopup = function(popupid){
		for(var i=0; i<popups.length ;i++ ){
			if(popups[i].p.popupid == popupid){
				return popups[i];
			}
		}
	};
	
	this.existGlobalPopup = function(){
		for(var i=0; i<popups.length ;i++){
			var obj = popups[i];
			if(obj.c && obj.c.global === true){
				if(obj.p.isOpen()){
					return true;
				}
			}
		}
		return false;
	};
	
	this.addPopup = function(popup, config){
		popups.push({
			p:popup,
			c: config
		});
		popup.popupid = idCounter++;
		popup.specialid = config.specialid;
	};
	
	this.getPopupBySpecialId = function(id) {
		for(var i=0; i<popups.length ;i++ ){
			if(popups[i].p.specialid == id){
				return popups[i].p;
			}
		}
	};
	
	this.getLastPopup = function(){
		if(popups.length  == 0){
			return;
		}
		return popups[popups.length-1].p;
	};
	/*Yazım hatası var. Eski kullanımlar için kaldırılmadı.*/
	this.getLasPopup = function(){
		return this.getLastPopup();
	};
    
    this.on = function(event, callback){
    	if(!events[event]){
    		events[event] = [];
    	}
    	var eventid = eventIdCounter++;
    	events[event].push({id: eventid, c: callback});
    	return eventid;
    };
    
    this.unbind = function(eventid){
    	for(var event in events){
				if(!Array.isArray(events[event])){
					continue;
				}
    		for(var i=0; i<events[event].length ;i++){
        		if(events[event][i].id == eventid){
        			events[event].splice(i, 1);
        			return;
        		}
        	}
    	}
    };
    
    this.fire = function(event){
    	for(var i=0; events[event] && i<events[event].length ;i++){
    		events[event][i].c();
    	}
    };
	
	this.removePopup = function(popup, notRemoveChilds){
		var foundIndex = -1;
		for(var i=0; i<popups.length ;i++ ){
			if(popups[i].p.popupid == popup.popupid){
				foundIndex = i;
				break;
			}
		}
		if(notRemoveChilds || (foundIndex >= 0 && popups[foundIndex].c.utilPopup)){
			popups.splice(foundIndex, 1);
			return;
		}
		popups.splice(foundIndex, popups.length-foundIndex);
	};
	
	this.getLastPopupInfo = function(){
		if(popups.length > 0){
			return popups[popups.length-1];
		}
	};
	
	this.fixDefaultPosition = function(width, height, $$popupsSection, verticalCenter){
		var position = {};
		// #hakand açılan son popup ile aynı pozisyonda olmayabilir. bu yüzden açıklama satırı yaptım.
//		var lastPopup = this.getLastPopupInfo();
//		if(lastPopup){
//			position.top = Math.floor(lastPopup.c.top + (lastPopup.c.height - height)/2);
//			position.left = Math.floor(lastPopup.c.left + (lastPopup.c.width - width)/2);
//		} else {
			if($$popupsSection){
				if(verticalCenter){
					var t = Math.floor(($$.innerHeight($$popupsSection)-height)/2);
					if(t <0){
						t =0;
					}
					position.top = t;
				}else{
                    if($$popupsSection.offsetHeight - height < 80 ){
                        position.top = 3;
                    } else {
					   position.top = 60;
                    }
				}
				position.left = Math.floor(($$popupsSection.offsetWidth-width)/2);
			} else {
				if(verticalCenter){
					var t = Math.floor(($$.innerHeight(window)-height)/2);
					if(t <0){
						t =0;
					}
					position.top = t;
				}else{
					position.top = 60;
				}
				position.left = Math.floor((window.innerWidth-width)/2);
			}
//		}
		return position;
	};
	
	
	//tüm popuplar window resize olduğunda konumunu tekrar ayarlasın.
	window.popupResizeEvt;
	$$.bindEvent(window, "resize", function(e){
        clearTimeout(window.popupResizeEvt);
        window.popupResizeEvt = setTimeout(function(){
        	var popups = CSPopupContext.getPopups();
        	for(var i=0; i<popups.length ;i++){
        		var popup = popups[i].p;
//        		console.log("Window resized. Set popup position. Popup id:"+popup.c.id);
        		var pos = CSPopupContext.fixDefaultPosition(popup.config.width, popup.config.height, popup.popupsSection);
        		popup.config.left = pos.left;
        		
        		if(!popup.config.global && popup.mainTab){
        			var scrollPos = popup.mainTab.bcRef.getScrollPosition();
        			if(!popup.maximized){
        				pos.top = scrollPos.top + 3 + window.scrollY;
        			}else{
        				pos.top = scrollPos.top + window.scrollY;
        			}
        		}        		
        		
        		popup.config.top = pos.top;
        		popup.setPopupPosition();
        	}
        }, 100);
	})
	
	
};

window.SPopupContext = CSPopupContext;

//$(document).keydown(function(event){
//	var info = CSPopupContext.getLastPopupInfo();
//	if(!info){
//		return;
//	}
//	if(info.c.closeOnEsc && event.which == 27) {
//		info.p.close();
//	}
//});

var CSPopupUTILS = new function(){
	
	var progressBarStack = {};
	var progressBarIdCounter = 1;
	var progressBarPopup = null;
	var $progressDiv = null;
	
	this.findMyPopup = function(bf){
//		if(!bf || !bf.$CS$){
//			console.error("findMyPopup: parameter is not valid");
//			return null;
//		}
		
		//popup context içinde ara 
		var popups = CSPopupContext.getPopups();
		for(var i=0; i<popups.length ;i++){
			var p = popups[i];
			if(p && p.c && p.c.bf === bf){
				return p.p;
			}
		}

		//bulamazsan babalarda ara
		var parent = bf;
		while(parent){
			if(parent.$CS$.definition.SCR.layout == "CSC-POPUP"){
				return parent;
			}
			parent = parent.$CS$.parent;
		}
		return null;
	};
	
	this.ProgressBar = function(message, options){
		
		
		
		//hiç progressbar açılmamış ise 
		if(Object.keys(progressBarStack).length == 0){
			options = options || {};
			var config = {};
			config.showTitleBar = false;
			config.utilPopup = true;
			config.bf = options.bf;
			config.progressbar = true;
			
			$progressDiv = $$.create("div",{tabindex: 1},'csc-progress-img');

			if(!message || message === true || message == "?"){
				message = SideMLManager.get("common.wait");
			}
			
			var $div = $("<div>").css({
				minWidth: "520px",
				width: "100%",
				height: "100px"
			}).append(
				$("<table>").css({
					width: "100%",
					height: "100%"
				}).append(
					$("<tr>").append(
						$("<td>").css({verticalAlign:"middle", textAlign: "center"}).append($progressDiv)
					)
				).append(
					$("<tr>").append(
						$("<td>").css("textAlign", "center").append($("<span>").attr("id", "pb-popup-message").html(message))
					)
				)
			);
			config.global = CSPopupContext.existGlobalPopup() ? true : undefined;
			config.cssClass = "cs-progress-window";
//			config.verticalCenter = true;
			config.closeOnEscape = CSSession.getEnv() == "dev";
			config.closeCallback = function(){ progressBarStack = {}; };
			progressBarPopup = new CSSimplePopup($div, config);
			progressBarPopup.open();
		}
		
		//ilgili progressbar için id üret;
		var progressBarId = progressBarIdCounter++;
		progressBarStack[progressBarId] = message;
		
		//son gelen mesajı dom'da ayarla.
		$("#pb-popup-message").html(message || SideMLManager.get("common.wait"));
		$progressDiv.focus();
		
		function closeCallback(){
			//yığıttan ilgili tanımı çıkar. Burada silinmek istenen eleman her zaman en sondaki olmayabilir. ortadaki bir progress bar kapatılmak istenebilir.
			delete progressBarStack[progressBarId];
			var keys = Object.keys(progressBarStack);
			if(keys.length == 0){//son progress bar ise popup ı kapat.
				progressBarPopup.close(true);
			}else{
				var lastPBId = keys[keys.length-1];
				var msg = progressBarStack[lastPBId];
				$("#pb-popup-message").html(msg || SideMLManager.get("common.wait"));
			}
			
		};
		
		return {
			close: function(){
				closeCallback();
			}
		};
	};
	
	this.MessageBox = function(message, options, callback){
		if(Array.isArray(message) && message.length > 0){
			message = message[0].text;
		}
		if(!message){
			return;
		}
		message = ""+message;
		if(typeof options === "function"){
			callback = options;
			options = {};
		}
		if(!options){
			options = {};
		}
		var areaClasses = "csc-msgbox-message-area";
		var defaultMsg = window.SideMLManager ? SideMLManager.get("CS-POPUP.message") : "Mesaj";
		if(options.error){
			areaClasses += " error";
			defaultMsg = window.SideMLManager ? SideMLManager.get("CS-POPUP.error") : "Hata";
		}
		
		if(options.warning){
			areaClasses += " warning";
			defaultMsg = window.SideMLManager ? SideMLManager.get("CS-POPUP.warning") : "Uyarı";
		}
		if(options.success){
			areaClasses += " success";
			defaultMsg = window.SideMLManager ? SideMLManager.get("CS-POPUP.success") : "Başarılı";
		}
		options.utilPopup = true;
		
		var $closeBtn = $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(window.SideMLManager ? SideMLManager.get("CS-POPUP.ok") : "Tamam").addClass("csc-button"));
		var $div = $("<div>")
			.addClass("csc-msgbox")
			.css("display", "none")
 			.append(
			
			
			$("<table>").addClass(areaClasses)
 				.append($("<tr><td><span class='csc-msgbox-msg-span'>" +message.replace(/\u00a0/g, " ")+ "</span></td></tr>"))
 			)
 			.append($("<div>").addClass("csc-msgbox-buttons-div").append($closeBtn));
		if(options.cssClass){
			$div.addClass(options.cssClass);
		}

		var popupCloseCallback, iclosed = false;

		if(callback) {
			popupCloseCallback = function () {
				if(!iclosed){
					try {
						BFEngine.a();
						callback();
					} finally {
						BFEngine.r();
					}
				}
			};
		}

		var popup = new CSSimplePopup($div, {title: options.title || defaultMsg, cssClass:"cs-popup-msg-box", global: true, util: true, showCloseIcon: options.showCloseIcon, closeOnEscape: options.closeOnEscape, closeCallback: popupCloseCallback});
 		popup.open();
		
 		$('.csc-button').blur();
 		$('.csc-msgbox-buttons-div .csc-button').focus();

		 var value = $("[name='nameofobject']");
		$closeBtn[0].focus();
		$closeBtn.click(function(){
			iclosed = true;
			popup.close();
			if(callback){
				try {
					BFEngine.a();
					callback();
				} finally {
					BFEngine.r();
				}
			}
		});

		if(options.detail){
			var $detailBtn = $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(window.SideMLManager ? SideMLManager.get("CS-POPUP.details") : "Detay").css("margin-right", "20px").addClass("csc-button"));
			$div.find(".csc-msgbox-buttons-div").prepend($detailBtn);
			
			$detailBtn.click(function(){
				callback("detail");
			});
		}
	};
	
	this.Confirm = function(message, options, callback){

		if(typeof options == "function"){
			callback = options;
			options = {};
		}
		if(!options){
			options = {};
		}
		options.utilPopup = true;
		var buttons = {
			yes: $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(SideMLManager.get("common.yes")).addClass("csc-button csc-button--popup")),
			no: $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(SideMLManager.get("common.no")).addClass("csc-button csc-button--popup")),
			cancel: $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(SideMLManager.get("common.cancel")).addClass("csc-button csc-button--popup"))
		};
		var $buttonsDiv = $("<div>").addClass("csc-confirm-buttons-div");
		if(options.yes !== false){
			$buttonsDiv.append(buttons.yes);
		}
		if(options.no !== false){
			$buttonsDiv.append(buttons.no);
		}
		if(options.cancel === true){
			$buttonsDiv.append(buttons.cancel);
		}
		
		var popupCloseCallback;
		
		if(callback){
			var iclosed = false;
			popupCloseCallback = function(){
				if(!iclosed){
					try {
						BFEngine.a();
						callback("cancel");
					}finally {
						BFEngine.r();
					}
				}
			};
			$.each(buttons, function(buttonName, button){
				button.click(function(){
					iclosed = true;
					popup.close();
					try {
						BFEngine.a();
						callback(buttonName);
					}finally {
						BFEngine.r();
					}
				});
			});
		}
		var $div = $("<div>")
			.addClass("csc-confirm")
			.css("display", "none")
			.append(
				$("<div>").addClass("csc-confirm-area").append(
					$("<span>")
						.addClass("csc-confirm-msg-span")
						.html(message))
			)
			.append($buttonsDiv);
		if(options.cssClass){
			$div.addClass(options.cssClass);
		}
		var popup = new CSSimplePopup($div, {title: options.title || SideMLManager.get("CS-POPUP.confirmationMessage"), closeCallback: popupCloseCallback, showCloseIcon:options.showCloseIcon} );
		popup.open();
		if(options.focus && buttons[options.focus]){
			buttons[options.focus].focus();
		}
		//barist: parametre olarak odaklanacak buton girildiyse ve o buton gozukuyorsa ona odaklar, gozukmuyorsa hicbir seye odaklamaz
		if(options.focusButton && buttons[options.focusButton]){
			$("input", buttons[options.focusButton]).focus();
		}
	};
	
	this.Login = function(msg){
		
		var def = BFEngine.getDefinition(getSideDefaults("pg-relogin"));
		if(def){
			var initParam = {message: msg};
			var bf = BFEngine.create({BF:getSideDefaults("pg-relogin"), name:"appLogin"}, "root", initParam);
			bf.on("login",bf,function(bf, data){
				window.CSLoginPopupOpened = false;
				if(data){
					var tokenKey = window.getSideDefaults("param-token-key");
					CSSession.setToken(data[tokenKey]);
				}
				GlobalBusinessEvents.fire("side-relogin");
			});
			
			if(initParam.notopen){
				return;
			}
			SIDENavigator.renderToPopup(bf, {width: parseInt(bf.getDesignedWidth())+36, showCloseIcon: false, closeOnEscape:false, global: true});
			return;
		}
		//P_RE_LOGIN sayfasının olmadığı durum
		var buttons = {
			login: $("<div>").addClass("csc-button-outer").append($("<input>").attr({"type":"button", id:"side-login-btn"}).val(SideMLManager.get("CS-POPUP.login")).addClass("csc-button")),
			cancel: $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(SideMLManager.get("common.cancel")).addClass("csc-button"))
		};
		var $buttonsDiv = $("<div>").addClass("csc-confirm-buttons-div");
		$buttonsDiv.append(buttons.login).append(buttons.cancel);
		
		var popup;
		var popupCloseCallback;
		
		popupCloseCallback = function(){
			var userid = $$.byid("side-username").value, pwd = $$.byid("side-password").value;
			if(CSSession.getEnv() == "dev"){
				localStorage.setItem("test-last-user", userid);
				localStorage.setItem("test-last-pwd", pwd);
			}
		};
		buttons.login.click(function(){
			var userid = $$.byid("side-username").value, pwd = $$.byid("side-password").value;
			CSCaller.call(getSideDefaults("sn-login"), {userid: userid, password: pwd})
			.then(function(data){
				window.CSLoginPopupOpened = false;
				var tokenKey = window.getSideDefaults("param-token-key");
				CSSession.setToken(data[tokenKey]);
				popup.close();
				GlobalBusinessEvents.fire("side-relogin");
			});
		});
		
		buttons.cancel.click(function(){
			window.CSLoginPopupOpened = false;
			popup.close();
		});
		
		var $div = $("<div>")
			.addClass("csc-login")
			.css("display", "none")
			.append(
				$("<div>")
					.append($("<span>").html(SideMLManager.get("CS-POPUP.sessionExpired")))
					.append($("<br>"))
					.append($("<br>"))
					.append($("<table>")
						.append($("<tr>")
							.append($("<td>").append($("<span>").html(SideMLManager.get("CS-POPUP.username"))))
							.append($("<td>").append($("<input>").attr({"id":"side-username"})))
						)
						.append($("<tr>")
							.append($("<td>").append($("<span>").html(SideMLManager.get("CS-POPUP.password"))))
							.append($("<input>").attr({id:"side-password",type: "password"})))
						)
					)
					.append($buttonsDiv);
		popup = new CSSimplePopup($div, {title: "CS-POPUP.login", showCloseIcon: false, closeOnEscape:false, closeCallback: popupCloseCallback} );
		popup.open();
		var username = CSSession.getUserId() || "";
		if(username){
			$$.byid("side-username").setAttribute("value", username);
			$$.byid("side-password").setAttribute("value", localStorage.getItem("test-last-pwd") || "");
			$$.byid("side-password").focus();
		} else if(CSSession.getEnv() == "dev" && localStorage.getItem("test-last-user")){
			$$.byid("side-username").setAttribute("value", localStorage.getItem("test-last-user"));
			$$.byid("side-password").setAttribute("value", localStorage.getItem("test-last-pwd") || "");
			$$.byid("side-password").focus();
		} else {
			$$.byid("side-username").focus();
		}
		
		$$.byid("side-password").onkeypress = function(e){
			if(e.keyCode == 13){
				$$.byid("side-login-btn").click();
			}
		};
		return popup;
	};
	
	this.preventUserOperation = function(message, options, callback){
		if(Array.isArray(message) && message.length > 0){
			message = message[0].text;
		}
		if(typeof options == "function"){
			callback = options;
			options = {};
		}
		if(!options){
			options = {};
		}
		var areaClasses = "csc-msgbox-message-area";
		var defaultMsg = SideMLManager.get("CS-POPUP.message");
		if(options.error){
			areaClasses += " error";
			defaultMsg = SideMLManager.get("CS-POPUP.error");
		}
		
		if(options.warning){
			areaClasses += " warning";
			defaultMsg = SideMLManager.get("CS-POPUP.warning");
		}
		if(options.success){
			areaClasses += " success";
			defaultMsg = SideMLManager.get("CS-POPUP.success");
		}
		options.utilPopup = true;
		
		var $div = $("<div>")
			.addClass("csc-msgbox")
			.css("display", "none")
 			.append(
			
			$("<table>").addClass(areaClasses)
 				.append($("<tr><td><span class='csc-msgbox-msg-span'>" +message.replace(/\u00a0/g, " ")+ "</span></td></tr>"))
 			);
		var popup = new CSSimplePopup($div, {title: options.title || defaultMsg, global: true, util: true, showCloseIcon:false});
 		popup.open();
		
		if(options.detail){
			var $detailBtn = $("<div>").addClass("csc-button-outer").append($("<input>").attr("type","button").val(SideMLManager.get("CS-POPUP.details")).css("margin-right", "20px").addClass("csc-button"));
			$div.find(".csc-msgbox-buttons-div").prepend($detailBtn);
			
			$detailBtn.click(function(){
				callback("detail");
			});
		}
	};
	
	
	
};

window.SPopup = CSPopupUTILS;

/**
 * @param contentDiv div id or div jquery object
 * @param config
 * title: Popup title
 * top: top position
 * left: left position
 * width: popup width
 * height: popup height
 * showTitleBar: true/false
 * showCloseIcon: true/false -> Close icon on title 
 * closeOnEscape: true/false
 * closeOnOverlayClick: true/false
 * overlayExist: true/false -> Background overlay
 * icon: url -> popup icon
 * bindEvents: true -> popup dışındaki alanlarda tab ile ilerlemeyi engellemek için
 */

var CSSimplePopupDefaults = {
//	top: 80,
	showTitleBar: true,
	showCloseIcon: true,
	showMaximizeIcon: false,
	overlayExist: true,
	overlayOpacity: true,
	contextMenu: false,
	bindEvents: true
};

function CSSimplePopup(contentDiv, config){
	config = config || {};
	config = csDefaults(config, CSSimplePopupDefaults);
	if(config.contextMenu){
		config.overlayOpacity = false;
//		config.overlayExist = false;
		config.showTitleBar = false;
	}
	
	if(config.global === undefined){
		config.global = CSPopupContext.existGlobalPopup() ? true : undefined;
	}

	if(config.width == "full"){
		config.width = $$.innerWidth(window);
	}
	if(config.height == "full"){
		config.height = $$.innerHeight(window);
		config.top = 0;
	}
	
	if(window.getSideDefaults && window.getSideDefaults("param-global-popup")){
		config.global = true;
	}
	this.$content = contentDiv;
	this.config = config;
	if(typeof contentDiv == "string"){
		this.$content = $("#"+contentDiv);
	} else if($$.isDomElement(contentDiv)){
		this.$content = $(contentDiv);
	}
	
	this.popupsSection = null;
	this.$overlayDiv = null;
	this.$popupWindow = null;
	this.$$mainTab = null;
	this.$popupTitle = null;
	this.$popupContent = null;
	this.popupEventHandler = null;
};


CSSimplePopup.prototype.open = function(){
	var instance = this;
	if(this.config.contextMenu){
		var event = window.event;
		if(event && event.preventDefault){
			event.preventDefault();
		}
	}
	
	if(this.isOpen()){
		return;
	}
	

	
	if(!this.$popupWindow){
		this.createPopupWindow();
	}

	if(this.config.bindEvents){
		this.popupEventHandler = function (e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (instance.isOpen() && instance == CSPopupContext.getLasPopup()) {
					var $focusables = $(":focusable", this.$popupWindow);
					if(e.shiftKey && $focusables.get(0) == e.target){
						$focusables.get($focusables.length-1).focus();
						return false;
					}
					if(!e.shiftKey && $focusables.get($focusables.length-1) == e.target){
						$focusables.get(0).focus();
						return false;
					}
					if(csdu.arrayContains($focusables.toArray(), e.target) > -1){
						return true
					}
					$focusables.get(0).focus();
					return false;
				}
			}
		}
		//tab için event bağla
		$(document).bind('keydown', {}, this.popupEventHandler);
	}
	
	//maintab scroll etmesin diye
	if(!this.config.global && this.mainTab && typeof this.mainTab.bcRef.getScrollTop == "function"){
		this.prevScrollTop = this.mainTab.bcRef.getScrollTop();
		this.scrollTopCallback = function(component, scrollTop) {
			if(instance.isOpen() && instance.tabName == instance.mainTab.getSelectedTabName()){
				var event = SIDENavigator.getEvent();
				$(event.target).scrollTop(instance.prevScrollTop);
			}
		};
		this.tabSelectedCallback = function(component, bf, tabName) {
			if(instance.tabName == tabName){
				$(instance.popupsSection).scrollTop(instance.prevScrollTop);
			}
		};
		this.mainTab.on("onscroll", this.mainTab, this.scrollTopCallback);
		this.mainTab.on("tabSelected", this.mainTab, this.tabSelectedCallback);
	}
	
	
	this.setPopupPosition();
	CSPopupContext.addPopup(this, this.config);
    CSPopupContext.fire("open");
	this.$popupWindow[0].setAttribute("popupid", instance.popupid);
	
	var zindex = this.config.utilPopup ?  CSPopupContext.utilZindex() : (this.config.global ? CSPopupContext.newGlobalZindex(): CSPopupContext.newZindex()) ;
	if(this.config.zIndex){
		zindex = this.config.zIndex;
	}

	if(this.$overlayDiv){
		this.$overlayDiv.css({
			display: "block",
			"z-index": zindex
		});
	}
	this.$popupWindow.css({
		display: "block",
		"z-index": zindex+1
	});
	this.$content.css("display","");
	
	//control height
//	if(this.$content.height() > this.$popupWindow.height()){
//		this.$popupWindow.css("height", (this.$content.height()+70)+"px");
//	}
	
	
	if(this.config.disableShotcuts === true){
		csd.operationsMan.disableShortcuts(true);
	}
	
	//escape tuşu için olay bağla
	if(this.config.closeOnEscape === true || this.config.closeOnEscape === undefined ){
		$(document).bind("keyup.keyEsc"+instance.popupid, function(event) {
			if(event.keyCode == 27 && !window.fullscreenMode ){
				var lastPopup = CSPopupContext.getLastPopupInfo().p;
				if(lastPopup.popupid == instance.popupid){
					if(instance.isOpen()){
						instance.close();
					}
				}
			}
			return false;
		});
	}
	
	
	if(this.config.openCallback){
		this.config.openCallback(this);
	}
};


CSSimplePopup.prototype.createPopupWindow = function(){
	var instance = this;
	var moduleName = instance.config.bf ? instance.config.bf.getModuleName() : SideModuleManager.getLocalModuleName();
	var mainTab = SIDENavigator.getPopupMainTab(moduleName) ||SIDENavigator.getMainTab(moduleName, instance.config.bf) || SIDENavigator.getMainTab();
	this.mainTab = mainTab;
	
	if(mainTab){
		this.$$mainTab = $$.byid(mainTab.getConfig().id);
		if(this.config.bf){
			this.tabName = SIDENavigator.findTabNameInMainTab(this.config.bf, this.mainTab);
		}
	}
	if(!this.config.global && this.$$mainTab && this.config.bf){
		if(!this.tabName){
			this.tabName = SIDENavigator.findTabNameInMainTab(this.config.bf, this.config.bf.getModuleName());
		}
		this.popupsSection = $$.getChildHasClass(this.$$mainTab, "csc-tab-panels-section");
		if(!this.popupsSection){
			this.popupsSection = $$.getChildHasClass(this.$$mainTab, "csc-acc-container");
			if(this.popupsSection){
				this.popupsSection = $$.getChildHasAttr(this.popupsSection, "rel", this.tabName+"-panel");
			}
		}
	}
	if(!this.popupsSection || this.config.global){
		this.config.global = true;
		this.popupsSection = $$.byTagname("body")[0];
	}

	if(this.config.overlayExist){
		this.$overlayDiv = $("<div>").addClass("cs-popup-overlay");
//		var tabSection = $$.getChildHasAttr(this.popupsSection, "rel", tabName);
//		tabSection.appendChild(this.$overlayDiv[0]);
		this.popupsSection.appendChild(this.$overlayDiv[0]);

		if(this.config.global){
			this.$overlayDiv.css("position", "fixed");
		}else{
			function relayoutOverlayDiv(component, width, height){
//				console.log("POPUP RELAYOUT:"+width+", "+height);
				instance.$overlayDiv.css("width", width+"px");
				instance.$overlayDiv.css("height", height+"px");
			}
			if(mainTab){
				mainTab.on("relayout", null,  relayoutOverlayDiv);
			}
			
			this.$overlayDiv.css("position", "absolute");
			this.$overlayDiv.css("height", this.popupsSection.scrollHeight || "100%");
			this.$overlayDiv.css("width", this.popupsSection.scrollWidth || "100%");
		}
		
		if(this.config.overlayOpacity == false){
			this.$overlayDiv.css("opacity", "0");
		}
		if(this.config.contextMenu || this.config.closeOnOverlayClick){
			this.$overlayDiv.bind("click", function(){ 
				if(instance.isOpen()){
					instance.close();
				}
			});
		}
	}

	this.$popupWindow = $("<div>").addClass("cs-popup-window");
	if(SSession.getEnv() != "designer"){
		this.$popupWindow.addClass("project-css");
	}
	this.$popupWindow.addClass(moduleName + "-css");

	if(!this.config.noThemeClass && !window.csd){
		var theme = CSSession.get("SIDE-THEME-"+moduleName) || CSSession.get("SIDE-THEME") || getSideDefaults("theme");
		this.$popupWindow.addClass(theme);
	}
	if(this.config.global){
		this.$popupWindow.css("position", "fixed");
	}
	if(this.config.minWindowHeight){
		this.$popupWindow.css("minHeight", this.config.minWindowHeight);
	}
	if(this.config.contextMenu){
		var lastPopup = CSPopupContext.getLastPopupInfo();
		if(lastPopup && lastPopup.c.global){
			this.$popupWindow.css("position", "fixed");
			if(!this.config.relativeToRightBottom) {
				this.config.relativeToFixed = true;//popup içinde relative bir context menu açıldığında ve scroll yapıldığında popup kaymasın
			}
		}else{
			this.$popupWindow.css("position", "absolute");//açılan context menu bileşen ile birlikte scroll olsun diye
		}
	}
	if(this.config.cssClass){
		this.$popupWindow.addClass(this.config.cssClass);
	}
	if(this.config.showTitleBar){
		this.$popupTitle = $("<div>").addClass("cs-popup-title");
		this.$popupWindow.append(this.$popupTitle);
		if(this.config.title){
			var $titleSpan = $("<div>").addClass("cs-popup-title-spn").html(this.config.title);
			this.$popupTitle.append($titleSpan);
		}
		if(this.config.showCloseIcon){
			var $closeSpan = $("<div>").addClass("cs-popup-close-btn").html("x");
			this.$popupTitle.append($closeSpan);
			$closeSpan.click(function(){
				instance.close();
				return false;
			});
		}
		if(this.config.showMaximizeIcon){
			var $maxSpan = $("<div>").addClass("cs-popup-maximize-btn");
			this.$popupTitle.append($maxSpan);
			$maxSpan.click(function(){
				instance.maximize();
				return false;
			});
		}
		if(this.config.icon){
			this.$popupTitle
				.css("background-image", "url('" + this.config.icon + "')")
				.addClass("cs-popup-title-icon");
		}
		this.$popupTitle.append($("<div>").addClass("cs-popup-clear"));
	}
	this.$popupContent = $("<div>").addClass("cs-popup-content");
	if(this.config.contentClass){
		this.$popupContent.addClass(this.config.contentClass);
	}
	if(instance.config.sourceType){
		this.$popupContent[0].setAttribute("sourceType",instance.config.sourceType);
	}
	this.$popupWindow.append(this.$popupContent);
	this.$popupContent.append(this.$content);
	if(!this.config.global && mainTab){
		var scrollPos = mainTab.bcRef.getScrollPosition();
		//burada main tab dan bodye kadar olan scrolları bul
		var scrollTopSum = 0; var t = byid(mainTab.bcRef.config.id); var found = null; var scrollCounter = 0;
		while( found == null && t!= null && !$(t).tagName != "body"){
			if(t.scrollTop){
				scrollTopSum += t.scrollTop;
				scrollCounter++;
			}
			t = t.parentNode;
		}
		if(!instance.maximized){
			this.config.top = scrollPos.top + 3 + (window.scrollY || window.pageYOffset) + (scrollCounter > 0 ? scrollTopSum-(window.scrollY || window.pageYOffset) : 0);
		}else{
			this.config.top = scrollPos.top + (window.scrollY || window.pageYOffset) + (scrollCounter > 0 ? scrollTopSum-(window.scrollY || window.pageYOffset) : 0);
		}
	}
	
	//buton varsa ekle
	//TODO: buton adı gelmiyor. TK, 26.03.2015
	if(this.config.buttons){
		var $popupButtons = $("<div>").addClass("cs-popup-buttons-div");
		var $buttonOuter ="";
		for(var i=0; i<this.config.buttons.length ;i++){
			var $$button = $$.create("INPUT", {type:"button", value:this.config.buttons[i].title, rel:i}, "csc-button");
			$$button.onclick = function(){
				var index = parseInt(this.getAttribute("rel"));
				instance.config.buttons[index].callback(instance.config.buttons[index]);
		            };
			$buttonOuter = $("<div>").addClass("csc-button-outer").append($$button);
			$popupButtons.append($buttonOuter);
		}
		//this.$popupWindow.append($popupButtons.append($button));
		this.$popupWindow.append($popupButtons.append($buttonOuter));
	}
	
//	var tabSection = $$.getChildHasAttr(this.popupsSection, "rel", tabName);
//	tabSection.appendChild(this.$popupWindow[0]);
	this.popupsSection.appendChild(this.$popupWindow[0]);
	if(this.tabName){
		this.$popupWindow[0].setAttribute("rel", this.tabName+"-popup");
		if(this.config.overlayExist){
		this.$overlayDiv[0].setAttribute("rel", this.tabName+"-popup");
	}
	}
	this.$content.show();
	this.$popupWindow.css("visibility","hidden");
	this.$popupWindow.css("display","block");
	if(this.config.overlayExist){
		this.$overlayDiv.css("visibility","hidden");
		this.$overlayDiv.css("display","block");
	}
	
//	this.$overlayDiv.css("width", this.popupsSection.offsetWidth +"px");
//	this.$overlayDiv.css("height", this.popupsSection.offsetHeight +"px");
//	this.$overlayDiv.css("left", $(this.popupsSection).offset().left+"px");
//	this.$overlayDiv.css("top", this.popupsSection.offsetTop+"px");
	
	
	//Move
	if(this.$popupTitle){
		this.$popupTitle.mousedown(function(event){
			if(event.target.className != "cs-popup-title" && event.target.className != "cs-popup-title-spn" ){
				return;
			}
			event.preventDefault();
			var offset = instance.$popupTitle.offset();
			var xDiff = Math.floor(event.pageX - (offset.left - $(window).scrollLeft()));
			var yDiff = Math.floor(event.pageY - (offset.top - $(window).scrollTop()));
			yDiff += instance.popupsSection.offsetTop;
			if(this.$overlayDiv){
				offset = instance.$overlayDiv.offset();
				xDiff += Math.floor(offset.left);
				yDiff += Math.floor(offset.top);
			}
			document.body.style.cursor = "move";

			instance.prevX = event.pageX;
			instance.prevY = event.pageY;
			
			$(window).mousemove(function(e){
				var diffX = instance.prevX - e.pageX;
				var diffY = instance.prevY - e.pageY;
				
				instance.prevX = e.pageX;
				instance.prevY = e.pageY;
				
				var l = parseInt(instance.$popupWindow.css("left")) - diffX;
				var t = parseInt(instance.$popupWindow.css("top")) - diffY;
//				console.log(l,t);
				
				instance.$popupWindow.css({
					"left": (l)+"px"
				});
				if(t < 0){return;}
				instance.$popupWindow.css({
					"top": t+"px"
				});
			});
			
			$(window).mouseup(function(e){
				event.preventDefault();
				$(window).unbind("mousemove");
				$(window).unbind("mouseup");
				document.body.style.cursor = "default";
			});
		});
	}
	
	//width height ayarları -----------------------------------------------------

	//width ayarları
	//width % ile verildiyse bulunduğu ekrana göre oranlı width ver
	var w = this.config.width;
	if(w){
		w += "";
		if(w.indexOf("%") > -1){
			var perc = parseInt(w);
			var popupSectionWidth = $(this.popupsSection).width();
			if(this.popupsSection == $$.body()){
				popupSectionWidth = $$.innerWidth(window);
			}
			this.config.width = popupSectionWidth * perc / 100;
		}
	}
	
	var h = this.config.height;
	if(h){
		h += "";
		if(h.indexOf("%") > -1){
			var perc = parseInt(h);
			var popupSectionHeight = $(this.popupsSection).height();
			if(this.popupsSection == $$.body()){
				popupSectionHeight = $$.innerHeight(window);
			}
			this.config.height = popupSectionHeight * perc / 100;
		}
	}

	//parseInt onemli
	this.config.width = parseInt(this.config.width) || (this.$popupWindow.width()+30);
	this.config.height = parseInt(this.config.height);
	
	
	//height ayarları
	var windowHeight = $(window).height();
	var popupSectionHeight = $(this.popupsSection).height();
	if(this.popupsSection == $$.body()){
		popupSectionHeight = $$.innerHeight(window);
	}
	if(popupSectionHeight < 500){//#hakand keys için eklendi. #mahmuty söyledi.s
		popupSectionHeight = 500;
	}
	if(this.config.height > popupSectionHeight){
		this.config.height = popupSectionHeight;
	}
	
	this.$popupWindow.css({
		width: instance.config.width +$$.getScrollBarWidth()+ "px",
//		height: (instance.config.height+60) + "px",
	});
	
	this.$popupContent.css({
		height : (instance.config.height)+"px",
		maxHeight: ((popupSectionHeight > windowHeight ? windowHeight : popupSectionHeight)-$(this.$popupWindow).position().top-5)+"px",
	});
	
	this.$popupWindow.css("display","none");
	this.$popupWindow.css("visibility","");
	if(this.config.overlayExist){
		this.$overlayDiv.css("display","none");
		this.$overlayDiv.css("visibility","");
	}
	
	
	//popup açıkken scroll olayını engelle
	this.$popupWindow.bind("mousewheel", function(event) {
		event = event || window.event;
		event.stopPropagation();

		var $popupContent = $(".cs-popup-content", instance.$popupWindow);
		if( event.target != $popupContent[0] && !$$.hasParent(event.target, $popupContent[0])){
			event.preventDefault();
			return;
		}
		var newScrollTop = instance.$popupContent[0].scrollTop;
		var mw = event.originalEvent.deltaY;
		var myDiv = $popupContent.first()[0];
		
		//eventin oluştugu yerden yukarı dogru ilk scroll eden atayı bul, ata yoksa scrollu engelle varsa karışma
		if(mw < 0 && newScrollTop == 0){//scroll yukarıya
		var t = event.target; var found = null;
		while( found == null && t!= null && !$(t).hasClass("cs-popup-content")){ 
				if(t.scrollTop != 0){
					found = t;
				} else {
					t = t.parentNode;
		} 
			}
			if(!found){
			if(!document.webkitFullscreenElement) {
				event.preventDefault();
			}
			return;
		}
		} else if(mw > 0 && myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight){//scroll aşağıya
		//eventin oluştugu yerden yukarı dogru ilk scroll eden ve bottom scrollu tam olmayan atayı bul, ata yoksa scrollu engelle varsa karışma
		var t = event.target; var found = null; 
		while( found == null && t!= null && !$(t).hasClass("cs-popup-content")){ 
				if(t.offsetHeight + t.scrollTop != t.scrollHeight ){
					found = t;
				} else {
					t = t.parentNode;
				}
		}
		
			if (!found) {
			event.preventDefault();
			return;
		}
		}

		instance.$popupWindow.css({
			width: instance.$popupWindow[0].style.width || ( (instance.config.width + $$.getScrollBarWidth()) + "px" ),
		});
		
		instance.$popupContent.css({
			height : (instance.config.height)+"px",
			maxHeight: ((popupSectionHeight > windowHeight ? windowHeight : popupSectionHeight)-56) +"px"
		});
		
	});
	if(this.$overlayDiv){
		this.$overlayDiv.bind("mousewheel", function(event) {
			event = event || window.event;
			event.stopPropagation();
			event.preventDefault();
		});
	}
	
	if(this.config.resizable){
		var $$resizeIcon = $$.create("DIV", undefined, undefined, {width:"16px", height:"16px", position:"absolute", bottom:"0px", right: "0px", background: "url(css/bc-style/img/csc-table-icons.png) no-repeat", backgroundPosition: "-80px -224px"});
		this.$popupWindow.append($$resizeIcon);
		
		var pw = this.$popupWindow;
		
		$$resizeIcon.onmouseover = function(){ $$resizeIcon.style.cursor = "nwse-resize";}
		
		var minHeight = -1; var minWidth = -1;
		
		$$resizeIcon.onmousedown = function(event){
			var firstY; var firstY; var lastX; var lastY;
			
			firstX = event.clientX;
			firstY = event.clientY;
			
			if(minWidth == -1){
				minWidth = firstX - pw.position().left;
				minHeight = firstY - pw.position().top;
			}
			
			document.documentElement.onmousemove = function(event){
				if(event.preventDefault) event.preventDefault();
				lastX = event.clientX;
				lastY = event.clientY;
				
				if(pw.width() + (lastX-firstX) > minWidth){
					pw.width(pw.width() + (lastX-firstX));
					firstX = lastX;
				}
				
				if(pw.height() + (lastY-firstY) > minHeight){
					pw.height(pw.height() + (lastY-firstY));
					firstY = lastY;
				}
			}
			
			document.documentElement.onmouseup = function(){ document.documentElement.onmousemove = ""; }
		}
	}
};

CSSimplePopup.prototype.maximize = function(){
	var instance = this;
	
	if(!this.maximized){
		//maximize
		var parent = !this.config.global ? this.$popupWindow.parent() : window;
		var w = $(parent).width();
		var h = $(parent).height();

		this.oldPopupWindowCss = {
				w: this.$popupWindow.outerWidth(),
				h: this.$popupWindow.outerHeight(),
				top: this.$popupWindow.css("top"),
				left: this.$popupWindow.css("left")
		}; 
		
		this.$popupWindow.css({
			width: w+"px",
			height: h+"px",
			top: 0,
			left: 0
		});
		this.$popupContent.css({
			height: (h-56)+"px",
			maxHeight: (h-56)+"px"
		});

		if(this.config.maximizeCallback){
			this.config.maximizeCallback(w, h);
		}
	}else{
		//minimize
		var old = instance.oldPopupWindowCss;
		this.$popupWindow.css({
			width: old.w+"px",
			height: old.h+"px",
			top: old.top,
			left: old.left
		});
		
		var popupSectionHeight = $(this.popupsSection).height();
		var windowHeight = $(window).height();
		if(this.popupsSection == $$.body()){
			popupSectionHeight = $$.innerHeight(window);
		}
		if(popupSectionHeight < 500){
			popupSectionHeight = 500;
		}
		this.$popupContent.css({
			height: (old.h-56)+"px",
			maxHeight: ((popupSectionHeight > windowHeight ? windowHeight : popupSectionHeight)-56)+"px"
		});

		if(this.config.minimizeCallback){
			this.config.minimizeCallback(old.w, old.h);
		}
	}
	this.maximized = !this.maximized;
};

CSSimplePopup.prototype.close = function(force){

	var instance = this;
	
	if(!force && !this.isOpen()){
		return;
	}
	
	if(this.config.closeCallback){
		if(this.config.closeCallback() === false){
			return;
		}
	}
    
	if(this.config.dontRemove !== true){
		if(this.$overlayDiv){
			this.$overlayDiv.off();
			this.$overlayDiv.remove();
		}
		if(this.$popupWindow){
			this.$popupWindow.off();
			$("*", this.$popupWindow).off();
			this.$popupWindow.remove();
		}
	}else{
		if(this.$overlayDiv){
			this.$overlayDiv.hide();
		}
		this.$popupWindow.hide();
	}
	
	if(this.config.disableShotcuts === true){
		csd.operationsMan.disableShortcuts(false);
	}
	
	//CSPopupContext.decreaseZindex();
	
	//bağlanan eventleri çöz
	$(document).unbind("keyup.keyEsc"+instance.popupid); 
	$(document).unbind("keydown", this.popupEventHandler);//tabIndex için bağlandı( open metodunda)
	
	
	//maintab scroll etmesin diye bağlanan eventi çöz
	if(!this.config.global && this.mainTab){
		this.mainTab.unbind("onscroll", this.mainTab, this.scrollTopCallback);
		this.mainTab.unbind("tabSelected", this.mainTab, this.tabSelectedCallback);
	}
	
	CSPopupContext.removePopup(this, true);
	CSPopupContext.fire("close");

};

CSSimplePopup.prototype.isOpen = function() {
//	if(this.$popupWindow ){//baska bir tabdaki progress barı kapatmak için visible bakmaz hale getirildi.
	if(this.$popupWindow && this.$popupWindow.is(":visible")){
		return true;
	}
	return false;
};

CSSimplePopup.prototype.setPopupPosition = function(){
	var instance = this, config=this.config;
	if(config.contextMenu){
		var event = SIDENavigator.getEvent() || window.event ;
//		console.log(event.pageX, event.pageY);
		if(config.relativeTo){
			var ref = config.relativeTo.bcRef;
			var $dom = $("#"+ref.getHtmlId());
			if(config.relativeToFixed){
				var pos = $dom[0].getBoundingClientRect();
				config.top =  pos.top + $dom.outerHeight();
				config.left = pos.left;
			}else if(config.relativeToRightBottom){
				var pos = $dom[0].getBoundingClientRect();
				config.top =  pos.top + $dom.outerHeight();
				config.right = ($(window).width() - ($dom.offset().left + $dom.outerWidth()));
			} else {
				if(config.reverseHor){
					if(config.fromRight){
						if(config.global){
							config.right = ($(window).width() - $dom.offset().left - $dom.width()-2);
						} else {
							config.right = ($$.width($dom[0].offsetParent) - $dom[0].offsetLeft - $$.width($dom[0]));
							if(instance.$$mainTab != $dom[0].offsetParent){
								config.right += $dom[0].offsetParent.offsetLeft;
							}
						}
					} else {
						//this.config.left = $dom.offset().left-this.config.width;
						config.right = ($(window).width() - $dom.offset().left);
					}
					config.left = 'auto';
				}else {
					config.left = $dom.offset().left;
				}
				if(config.fromTop){
					if(config.global){
						config.top = $dom.offset().top;
					} else {
						config.top = $dom[0].offsetTop;
						if(instance.$$mainTab != $dom[0].offsetParent){
							config.top += $dom[0].offsetParent.offsetTop;
						}
					}
				} else {
					config.top = $dom.offset().top + $dom.outerHeight();
				}
			}
		} else {
			config.top = event.pageY || event.clientY ;
			config.left = event.pageX || event.clientX;
		}
	}else if(config.top === undefined && config.left === undefined){
		var position = CSPopupContext.fixDefaultPosition(config.width, config.height, this.popupsSection, config.verticalCenter || false);
		config.top = position.top;
		config.left = position.left;
	} else {
		var width, height;
		if(this.popupsSection && this.popupsSection.tagName != "BODY"){
			width = this.popupsSection.offsetWidth;
			height = this.popupsSection.offsetHeight;
		} else {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		config.top = config.top || Math.floor((height-config.height)/2);
		config.left = config.left || Math.floor((width-config.width)/2);
	}

	//top left kullanıcı tarafından verilmişse
	if(config.topPos){
		if(typeof config.topPos == "string" && config.topPos.indexOf("%")>=0){
			config.top = config.topPos;
		} else {
			config.top = parseInt(config.topPos);
		}
	}
	if(config.leftPos){
		if(typeof config.leftPos == "string" && config.leftPos.indexOf("%")>=0) {
			config.left = config.leftPos;
		} else {
			config.left = parseInt(config.leftPos);
		}
	}

	if(config.top < 5){
		config.top = 5;
	}

	//global conf verilmişse daha öncelikli 
	var globalConf = CSPopupContext.getGlobalConfig();
	var top = (parseInt(globalConf.top) || instance.config.top);
	var left = (parseInt(globalConf.left)|| instance.config.left);
	var right = (parseInt(globalConf.right)|| instance.config.right);

	this.$popupWindow.css({
		top: typeof top == "number" ? top+"px" : top,
		left: left !== undefined ? (typeof left == "number" ? left+"px":left) : 'auto',
		right: right !== undefined ? (typeof right == "number" ? right+"px":right) : undefined
	});
};

CSSimplePopup.prototype.changeTitle = function(title){
	if(this.$popupTitle && this.$popupTitle.length > 0){
		var $$titleSpan = $$.getChildsHasClass(this.$popupTitle[0],"cs-popup-title-spn"); 
		if($$titleSpan.length == 0){
			$$titleSpan[0] = $$.create("div");
			$$.addClass($$titleSpan[0], "cs-popup-title-spn");
			this.$popupTitle.prepend($$titleSpan[0]);
		}
		$$titleSpan[0].innerHTML = title;
	}
};

CSSimplePopup.prototype.setMaxHeight = function(maxHeight) {
	if(this.$popupWindow){
		this.$popupContent.css({
			"max-height": maxHeight + "px"
		});
	}
};

CSSimplePopup.prototype.setMinHeight = function(minHeight) {
	if(this.$popupWindow){
		this.$popupWindow.css({
			"min-height": minHeight + "px"
		});
	}
};

CSSimplePopup.prototype.resize = function(width, height) {
	if(this.$popupWindow){
		if(width !== undefined){
			this.$popupWindow.css({
				width: width + "px",
			});
		}
		if(height !== undefined){
			this.$popupWindow.css({
				height: height + "px"
			});
		}
	}
};

SPopupContext.on("open", function(){
	if(SPopupContext.getPopups()[0].c.bf && window.NTestData){
        window.NTestData.changeTestBF(SPopupContext.getPopups()[0].c.bf);
    }
 });

//close'da mainpopup set edilmeli
 SPopupContext.on("close", function(){
     if(window.NTestData && !window.NTestData.mainTabExist){
         window.NTestData.changeTestBF(BFEngine.root);
     }
 });

CSSimplePopup.prototype.hide=function(){
	var bc=this;
	bc.$popupWindow[0].style.display="none";
	bc.$overlayDiv[0].style.display="none";
	CSPopupContext.fire("close");
	CSPopupContext.removePopup(this, true);
}
CSSimplePopup.prototype.show=function(){
	var bc=this;
	bc.$popupWindow[0].style.display="";
	bc.$overlayDiv[0].style.display="block";
	CSPopupContext.addPopup(this, this.config);
    CSPopupContext.fire("open");
}
/**
 * @author hakand
 */
function CSCubeManager(){
	
	//INIT MANAGER
	console.log("CSCubeManager START");
//	var $page = $("#designDiv").length == 1 ? $("#designDiv") : ($("#ts-test-area").length == 1 ? $("#ts-test-area") : $(document.body)); 
	var $page = $(document.body);
	var $container = $("<div>").attr("id", "cube-container");
	var $cube = $("<div>").attr("id", "cube");
	var $side1 = $("<div>").attr("id", "cube-side1").addClass("face front");
	var $side2 = $("<div>").attr("id", "cube-side2").addClass("face right");
	var $side3 = $("<div>").attr("id", "cube-side3").addClass("face back");
	var $side4 = $("<div>").attr("id", "cube-side4").addClass("face left");
	var $side5 = $("<div>").attr("id", "cube-side5").addClass("face top");
	var $side6 = $("<div>").attr("id", "cube-side6").addClass("face bottom");
	var oldParentMap = {};
	var domMap = {};
	var titleMap = {};
	var hideCallback = null;
	var hideCallbackParam = null;
	
	
	var directionMap = {
		0: {up: 4, down:5, right:1, left: 3},
		1: {up: 4, down:5, right:2, left: 0},
		2: {up: 4, down:5, right:3, left: 1},
		3: {up: 4, down:5, right:0, left: 2},
		4: {up: 2, down:0, right:1, left: 3},
		5: {up: 0, down:2, right:1, left: 3}
	};
	
	$page.append($container);
	$container.append($cube);
	$cube.append($side1).append($side2).append($side3).append($side4);//.append($side5).append($side6);
	
	$container.hide();
	
	for(var i=0; i<6; i++){
		var $side = $("#cube-side"+(parseInt(i)+1)).html("");
		var $divHeader = $("<div>").addClass("cube-side-header");
		var $divContent = $("<div>").addClass("cube-side-content");
		var $ul = $("<ul>");
		var $li = $("<li>");
		
		$ul.append($li);
		$divHeader.append($ul);
		$side.append($divHeader);
		
		$side.append($divContent);
	}
//	$cube.bind("webkitTransitionEnd", hideCube);
	
	console.log("CSCubeManager END");
	//INIT END
	
	
	
	//HIDE CUBE
	function hideCube(){
		var func = function(){
			for(var i in domMap){
				var $parent = oldParentMap[i];
				domMap[i].hide().appendTo($parent).fadeToggle(700,"easeInQuad");
			}
			
			if(hideCallback && hideCallbackParam){
				hideCallback(hideCallbackParam);
			}
			
		};
		$container.fadeToggle(700,"easeInQuad", func);
		$("#cubeoverlay").hide();
	}
	
	function showCube(currTabId, orderedArr, callback) {
		var cubeVisible = $cube.is(":visible");
		if(cubeVisible){
			callback();
			return;
		}
		
		var $overlay = $("#cubeoverlay");
		if($overlay.length == 0){
			$overlay = $("<div>").attr("id", "cubeoverlay").css("position", "fixed").css("top", "0").css("left", "0").css("background-color", "black").css("width", "100%").css("height", "100%");
			$("body").append($overlay);
		}
		$overlay.show();
		
		//currTabIndex bul
		var index = 0;
		for(var i=0; i<orderedArr.length; i++){
			if(currTabId == orderedArr[i].id ){
				index = i;
				break;
			} 
		}
		
		//hazırlık yap, eski dom ve babaları sakla
		oldParentMap = {};
		domMap = {};
		titleMap = {};
		var orderedIdArr = [];
		for(var j in orderedArr){
			
			var id = orderedArr[j].id;
			orderedIdArr[j] = id;
			
			titleMap[id] = orderedArr[j].title;
			
			var $dom = orderedArr[j].dom;
			oldParentMap[id] = $dom.parent();
			domMap[id] = $dom;
		}
		
		//kupun ilk yuzune gelecek çocuk dizide ilk sıraya gelmeli...
//		var cubeOrderedIdArr = [];
//		cubeOrderedIdArr = cubeOrderedIdArr.concat(orderedIdArr.slice(index, 6));
//		cubeOrderedIdArr = cubeOrderedIdArr.concat(orderedIdArr.slice(0, index));

		console.log("cube is not visible. create cube.");
		var maxWidth = 0;
		var top = 20;
		var left = 20;
		var maxHeight = 0;
		
		for(var i=0; i<6; i++){
			var sideId = "#cube-side"+(parseInt(i)+1);
			var side = $(sideId+" .cube-side-content").html("");
			var id = orderedIdArr[i];
//			var id = cubeOrderedIdArr[i];
			var $dom = domMap[id];
			
			//title
			$(sideId+" .cube-side-header > ul > li").html("").html(titleMap[id]); 
			
			if($dom && $dom.length>0){
				var w = $dom.parent().width();
				if(w > maxWidth){
					maxWidth = w;
				}
				var h = $dom.parent().height();
				if(h > maxHeight){
					maxHeight = h;
				}
				var t = $dom.offset().top;
				if(t > top){
					top = t;
				}
				var l = $dom.offset().left;
				if(l > left){
					left = l;
				}
				$dom.show().appendTo(side);
			}
		}
		
		
//		if(maxWidth<100 || maxWidth>1000){
//			maxWidth = 1000;
//		}

		//TODO sil
//		maxWidth = 1600;
		
		var transZ = maxWidth/2+30;
//		var transZ = 0;
		$container.css("width", maxWidth);
		$("#cube .front").css("-webkit-transform", "translateZ("+transZ+"px) rotateX(-1deg)");
		$("#cube .back").css("-webkit-transform", "rotateY(180deg) translateZ("+transZ+"px)  rotateX(-1deg)");
		$("#cube .right").css("-webkit-transform", "rotateY(90deg) translateZ("+transZ+"px)  rotateX(-1deg)");
		$("#cube .left").css("-webkit-transform", "rotateY(270deg) translateZ("+transZ+"px)  rotateX(-1deg)");
		
		$("#cube .top").css("-webkit-transform", "rotateX(90deg) translateZ("+maxWidth/2+"px)").css("width", maxWidth+"px").css("height", maxWidth+"px");
		$("#cube .bottom").css("-webkit-transform", "rotateX(-90deg) translateZ("+($side1.height()-maxWidth/2)+"px)").css("width", maxWidth+"px").css("height", maxWidth+"px");
		
		$("#cube .face").css("width", maxWidth+"px");//.css("height", maxHeight+"px");
//		$("#cube-container").css("width", maxWidth+"px").css("top", top+"px").css("left", left+"px");
		$("#cube-container").css("width", maxWidth+"px").css("top", "100px").css("left", ($(window).width()-maxWidth)/2+"px");
		
		//class varsa temizle
		$cube.removeClass();
		
		//seçili yuzu göster
		showSide(index);

		//kupu goster
		$container.fadeToggle(700,"easeInQuad", callback);
		
	}

	function showSide(index){
		var className = "";
		switch (index) {
		case 0:
			className = "show-front";
			break;
		case 1:
			className = "show-right";
			break;
		case 2:
			className = "show-back";
			break;
		case 3:
			className = "show-left";
			break;
		case 4:
			className = "show-top";
			break;
		case 5:
			className = "show-bottom";
			break;
		default:
			break;
		}
		$cube[0].className = "";
		$cube.addClass(className);
	}
	
	function  rotate(p){
		
		//currTabIndex bul
		var index = 0;
		for(var i=0; i<p.orderedArr.length; i++){
			if(p.currTabId == p.orderedArr[i].id ){
				index = i;
				break;
			} 
		}
		var nextIndex = 0;
		var direction = directionMap[index];
		if(p.direction == "up"){
			nextIndex = direction.up;
		}else if(p.direction == "down"){
			nextIndex = direction.down;
		}else if(p.direction == "next"){
			nextIndex = direction.right;
		}else if(p.direction == "prev"){
			nextIndex = direction.left;
		}
		
		if(p.orderedArr.length <= nextIndex){
			return;
		}
		
		//select next tab
		hideCallback = p.callback;
		hideCallbackParam = p.orderedArr[nextIndex].id;
		
		//6 ten fazla tab varsa kupu gosterme, sadece verilen callback i çagır.
		if(p.orderedArr.length <= 6){
			showCube(p.currTabId, p.orderedArr, function() {
				//dönder
				showSide(nextIndex);
				//tabı seç
				if(hideCallback && hideCallbackParam){
					hideCallback(hideCallbackParam);
				}
			});
		}else{
			//tabı seç
			if(hideCallback && hideCallbackParam){
				hideCallback(hideCallbackParam);
			}
		}
	}
	
	
	
	
	return {
		rotate: function(currTabId, orderedArr, callback, direction){
			paramObj = {
				currTabId: currTabId,
				orderedArr: orderedArr, 
				callback: callback,
				direction: direction
			};
			return rotate(paramObj);
		},
		toggle: function(currTabId, orderedArr, callback) {
			var cubeVisible = $cube.is(":visible");
			if(cubeVisible){
				hideCube();
			}else{
				showCube(currTabId, orderedArr, callback);
			}
		}
		
	};
}

var LZString={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",_f:String.fromCharCode,compressToBase64:function(e){if(e==null)return"";var t="";var n,r,i,s,o,u,a;var f=0;e=LZString.compress(e);while(f<e.length*2){if(f%2==0){n=e.charCodeAt(f/2)>>8;r=e.charCodeAt(f/2)&255;if(f/2+1<e.length)i=e.charCodeAt(f/2+1)>>8;else i=NaN}else{n=e.charCodeAt((f-1)/2)&255;if((f+1)/2<e.length){r=e.charCodeAt((f+1)/2)>>8;i=e.charCodeAt((f+1)/2)&255}else r=i=NaN}f+=3;s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+LZString._keyStr.charAt(s)+LZString._keyStr.charAt(o)+LZString._keyStr.charAt(u)+LZString._keyStr.charAt(a)}return t},decompressFromBase64:function(e){if(e==null)return"";var t="",n=0,r,i,s,o,u,a,f,l,c=0,h=LZString._f;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(c<e.length){u=LZString._keyStr.indexOf(e.charAt(c++));a=LZString._keyStr.indexOf(e.charAt(c++));f=LZString._keyStr.indexOf(e.charAt(c++));l=LZString._keyStr.indexOf(e.charAt(c++));i=u<<2|a>>4;s=(a&15)<<4|f>>2;o=(f&3)<<6|l;if(n%2==0){r=i<<8;if(f!=64){t+=h(r|s)}if(l!=64){r=o<<8}}else{t=t+h(r|i);if(f!=64){r=s<<8}if(l!=64){t+=h(r|o)}}n+=3}return LZString.decompress(t)},compressToUTF16:function(e){if(e==null)return"";var t="",n,r,i,s=0,o=LZString._f;e=LZString.compress(e);for(n=0;n<e.length;n++){r=e.charCodeAt(n);switch(s++){case 0:t+=o((r>>1)+32);i=(r&1)<<14;break;case 1:t+=o(i+(r>>2)+32);i=(r&3)<<13;break;case 2:t+=o(i+(r>>3)+32);i=(r&7)<<12;break;case 3:t+=o(i+(r>>4)+32);i=(r&15)<<11;break;case 4:t+=o(i+(r>>5)+32);i=(r&31)<<10;break;case 5:t+=o(i+(r>>6)+32);i=(r&63)<<9;break;case 6:t+=o(i+(r>>7)+32);i=(r&127)<<8;break;case 7:t+=o(i+(r>>8)+32);i=(r&255)<<7;break;case 8:t+=o(i+(r>>9)+32);i=(r&511)<<6;break;case 9:t+=o(i+(r>>10)+32);i=(r&1023)<<5;break;case 10:t+=o(i+(r>>11)+32);i=(r&2047)<<4;break;case 11:t+=o(i+(r>>12)+32);i=(r&4095)<<3;break;case 12:t+=o(i+(r>>13)+32);i=(r&8191)<<2;break;case 13:t+=o(i+(r>>14)+32);i=(r&16383)<<1;break;case 14:t+=o(i+(r>>15)+32,(r&32767)+32);s=0;break}}return t+o(i+32)},decompressFromUTF16:function(e){if(e==null)return"";var t="",n,r,i=0,s=0,o=LZString._f;while(s<e.length){r=e.charCodeAt(s)-32;switch(i++){case 0:n=r<<1;break;case 1:t+=o(n|r>>14);n=(r&16383)<<2;break;case 2:t+=o(n|r>>13);n=(r&8191)<<3;break;case 3:t+=o(n|r>>12);n=(r&4095)<<4;break;case 4:t+=o(n|r>>11);n=(r&2047)<<5;break;case 5:t+=o(n|r>>10);n=(r&1023)<<6;break;case 6:t+=o(n|r>>9);n=(r&511)<<7;break;case 7:t+=o(n|r>>8);n=(r&255)<<8;break;case 8:t+=o(n|r>>7);n=(r&127)<<9;break;case 9:t+=o(n|r>>6);n=(r&63)<<10;break;case 10:t+=o(n|r>>5);n=(r&31)<<11;break;case 11:t+=o(n|r>>4);n=(r&15)<<12;break;case 12:t+=o(n|r>>3);n=(r&7)<<13;break;case 13:t+=o(n|r>>2);n=(r&3)<<14;break;case 14:t+=o(n|r>>1);n=(r&1)<<15;break;case 15:t+=o(n|r);i=0;break}s++}return LZString.decompress(t)},compressToUint8Array:function(e){var t=LZString.compress(e);var n=new Uint8Array(t.length*2);for(var r=0,i=t.length;r<i;r++){var s=t.charCodeAt(r);n[r*2]=s>>>8;n[r*2+1]=s%256}return n},decompressFromUint8Array:function(e){if(e===null||e===undefined){return LZString.decompress(e)}else{var t=new Array(e.length/2);for(var n=0,r=t.length;n<r;n++){t[n]=e[n*2]*256+e[n*2+1]}return LZString.decompress(String.fromCharCode.apply(null,t))}},compressToEncodedURIComponent:function(e){return LZString.compressToBase64(e).replace(/=/g,"$").replace(/\//g,"-")},decompressFromEncodedURIComponent:function(e){if(e)e=e.replace(/$/g,"=").replace(/-/g,"/");return LZString.decompressFromBase64(e)},compress:function(e){if(e==null)return"";var t,n,r={},i={},s="",o="",u="",a=2,f=3,l=2,c="",h=0,p=0,d,v=LZString._f;for(d=0;d<e.length;d+=1){s=e.charAt(d);if(!Object.prototype.hasOwnProperty.call(r,s)){r[s]=f++;i[s]=true}o=u+s;if(Object.prototype.hasOwnProperty.call(r,o)){u=o}else{if(Object.prototype.hasOwnProperty.call(i,u)){if(u.charCodeAt(0)<256){for(t=0;t<l;t++){h=h<<1;if(p==15){p=0;c+=v(h);h=0}else{p++}}n=u.charCodeAt(0);for(t=0;t<8;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}else{n=1;for(t=0;t<l;t++){h=h<<1|n;if(p==15){p=0;c+=v(h);h=0}else{p++}n=0}n=u.charCodeAt(0);for(t=0;t<16;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}delete i[u]}else{n=r[u];for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}r[o]=f++;u=String(s)}}if(u!==""){if(Object.prototype.hasOwnProperty.call(i,u)){if(u.charCodeAt(0)<256){for(t=0;t<l;t++){h=h<<1;if(p==15){p=0;c+=v(h);h=0}else{p++}}n=u.charCodeAt(0);for(t=0;t<8;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}else{n=1;for(t=0;t<l;t++){h=h<<1|n;if(p==15){p=0;c+=v(h);h=0}else{p++}n=0}n=u.charCodeAt(0);for(t=0;t<16;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}delete i[u]}else{n=r[u];for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}}a--;if(a==0){a=Math.pow(2,l);l++}}n=2;for(t=0;t<l;t++){h=h<<1|n&1;if(p==15){p=0;c+=v(h);h=0}else{p++}n=n>>1}while(true){h=h<<1;if(p==15){c+=v(h);break}else p++}return c},decompress:function(e){if(e==null)return"";if(e=="")return null;var t=[],n,r=4,i=4,s=3,o="",u="",a,f,l,c,h,p,d,v=LZString._f,m={string:e,val:e.charCodeAt(0),position:32768,index:1};for(a=0;a<3;a+=1){t[a]=a}l=0;h=Math.pow(2,2);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}switch(n=l){case 0:l=0;h=Math.pow(2,8);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}d=v(l);break;case 1:l=0;h=Math.pow(2,16);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}d=v(l);break;case 2:return""}t[3]=d;f=u=d;while(true){if(m.index>m.string.length){return""}l=0;h=Math.pow(2,s);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}switch(d=l){case 0:l=0;h=Math.pow(2,8);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}t[i++]=v(l);d=i-1;r--;break;case 1:l=0;h=Math.pow(2,16);p=1;while(p!=h){c=m.val&m.position;m.position>>=1;if(m.position==0){m.position=32768;m.val=m.string.charCodeAt(m.index++)}l|=(c>0?1:0)*p;p<<=1}t[i++]=v(l);d=i-1;r--;break;case 2:return u}if(r==0){r=Math.pow(2,s);s++}if(t[d]){o=t[d]}else{if(d===i){o=f+f.charAt(0)}else{return null}}u+=o;t[i++]=f+o.charAt(0);r--;f=o;if(r==0){r=Math.pow(2,s);s++}}}};if(typeof module!=="undefined"&&module!=null){module.exports=LZString}/** @license Copyright (c) 2012 Daniel Trebbien and other contributors
Portions Copyright (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany
Portions Copyright (c) 1995-2001 International Business Machines Corporation and others

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, provided that the above copyright notice(s) and this permission notice appear in all copies of the Software and that both the above copyright notice(s) and this permission notice appear in supporting documentation.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF THIRD PARTY RIGHTS. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Except as contained in this notice, the name of a copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization of the copyright holder.
*/
(function () {

var MathContext = (function () {
/* Generated from 'MathContext.nrx' 8 Sep 2000 11:07:48 [v2.00] */
/* Options: Binary Comments Crossref Format Java Logo Strictargs Strictcase Trace2 Verbose3 */
//--package com.ibm.icu.math;

/* ------------------------------------------------------------------ */
/* MathContext -- Math context settings                               */
/* ------------------------------------------------------------------ */
/* Copyright IBM Corporation, 1997, 2000.  All Rights Reserved.       */
/*                                                                    */
/*   The MathContext object encapsulates the settings used by the     */
/*   BigDecimal class; it could also be used by other arithmetics.    */
/* ------------------------------------------------------------------ */
/* Notes:                                                             */
/*                                                                    */
/* 1. The properties are checked for validity on construction, so     */
/*    the BigDecimal class may assume that they are correct.          */
/* ------------------------------------------------------------------ */
/* Author:    Mike Cowlishaw                                          */
/* 1997.09.03 Initial version (edited from netrexx.lang.RexxSet)      */
/* 1997.09.12 Add lostDigits property                                 */
/* 1998.05.02 Make the class immutable and final; drop set methods    */
/* 1998.06.05 Add Round (rounding modes) property                     */
/* 1998.06.25 Rename from DecimalContext; allow digits=0              */
/* 1998.10.12 change to com.ibm.icu.math package                          */
/* 1999.02.06 add javadoc comments                                    */
/* 1999.03.05 simplify; changes from discussion with J. Bloch         */
/* 1999.03.13 1.00 release to IBM Centre for Java Technology          */
/* 1999.07.10 1.04 flag serialization unused                          */
/* 2000.01.01 1.06 copyright update                                   */
/* ------------------------------------------------------------------ */


/* JavaScript conversion (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany */



/**
 * The <code>MathContext</code> immutable class encapsulates the
 * settings understood by the operator methods of the {@link BigDecimal}
 * class (and potentially other classes).  Operator methods are those
 * that effect an operation on a number or a pair of numbers.
 * <p>
 * The settings, which are not base-dependent, comprise:
 * <ol>
 * <li><code>digits</code>:
 * the number of digits (precision) to be used for an operation
 * <li><code>form</code>:
 * the form of any exponent that results from the operation
 * <li><code>lostDigits</code>:
 * whether checking for lost digits is enabled
 * <li><code>roundingMode</code>:
 * the algorithm to be used for rounding.
 * </ol>
 * <p>
 * When provided, a <code>MathContext</code> object supplies the
 * settings for an operation directly.
 * <p>
 * When <code>MathContext.DEFAULT</code> is provided for a
 * <code>MathContext</code> parameter then the default settings are used
 * (<code>9, SCIENTIFIC, false, ROUND_HALF_UP</code>).
 * <p>
 * In the <code>BigDecimal</code> class, all methods which accept a
 * <code>MathContext</code> object defaults) also have a version of the
 * method which does not accept a MathContext parameter.  These versions
 * carry out unlimited precision fixed point arithmetic (as though the
 * settings were (<code>0, PLAIN, false, ROUND_HALF_UP</code>).
 * <p>
 * The instance variables are shared with default access (so they are
 * directly accessible to the <code>BigDecimal</code> class), but must
 * never be changed.
 * <p>
 * The rounding mode constants have the same names and values as the
 * constants of the same name in <code>java.math.BigDecimal</code>, to
 * maintain compatibility with earlier versions of
 * <code>BigDecimal</code>.
 *
 * @see     BigDecimal
 * @author  Mike Cowlishaw
 * @stable ICU 2.0
 */

//--public final class MathContext implements java.io.Serializable{
 //--private static final java.lang.String $0="MathContext.nrx";

 //-- methods
 MathContext.prototype.getDigits = getDigits;
 MathContext.prototype.getForm = getForm;
 MathContext.prototype.getLostDigits = getLostDigits;
 MathContext.prototype.getRoundingMode = getRoundingMode;
 MathContext.prototype.toString = toString;
 MathContext.prototype.isValidRound = isValidRound;


 /* ----- Properties ----- */
 /* properties public constant */
 /**
  * Plain (fixed point) notation, without any exponent.
  * Used as a setting to control the form of the result of a
  * <code>BigDecimal</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #ENGINEERING
  * @see #SCIENTIFIC
  * @stable ICU 2.0
  */
 //--public static final int PLAIN=0; // [no exponent]
 MathContext.PLAIN = MathContext.prototype.PLAIN = 0; // [no exponent]

 /**
  * Standard floating point notation (with scientific exponential
  * format, where there is one digit before any decimal point).
  * Used as a setting to control the form of the result of a
  * <code>BigDecimal</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #ENGINEERING
  * @see #PLAIN
  * @stable ICU 2.0
  */
 //--public static final int SCIENTIFIC=1; // 1 digit before .
 MathContext.SCIENTIFIC = MathContext.prototype.SCIENTIFIC = 1; // 1 digit before .

 /**
  * Standard floating point notation (with engineering exponential
  * format, where the power of ten is a multiple of 3).
  * Used as a setting to control the form of the result of a
  * <code>BigDecimal</code> operation.
  * A zero result in plain form may have a decimal part of one or
  * more zeros.
  *
  * @see #PLAIN
  * @see #SCIENTIFIC
  * @stable ICU 2.0
  */
 //--public static final int ENGINEERING=2; // 1-3 digits before .
 MathContext.ENGINEERING = MathContext.prototype.ENGINEERING = 2; // 1-3 digits before .

 // The rounding modes match the original BigDecimal class values
 /**
  * Rounding mode to round to a more positive number.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result
  * should be rounded towards the next more positive digit.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_CEILING=2;
 MathContext.ROUND_CEILING = MathContext.prototype.ROUND_CEILING = 2;

 /**
  * Rounding mode to round towards zero.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * All discarded digits are ignored (truncated).  The result is
  * neither incremented nor decremented.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_DOWN=1;
 MathContext.ROUND_DOWN = MathContext.prototype.ROUND_DOWN = 1;

 /**
  * Rounding mode to round to a more negative number.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result
  * should be rounded towards the next more negative digit.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_FLOOR=3;
 MathContext.ROUND_FLOOR = MathContext.prototype.ROUND_FLOOR = 3;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded down.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If the discarded digits represent greater than half (0.5 times)
  * the value of a one in the next position then the result should be
  * rounded up (away from zero).  Otherwise the discarded digits are
  * ignored.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_DOWN=5;
 MathContext.ROUND_HALF_DOWN = MathContext.prototype.ROUND_HALF_DOWN = 5;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded to the nearest even neighbor.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If the discarded digits represent greater than half (0.5 times)
  * the value of a one in the next position then the result should be
  * rounded up (away from zero).  If they represent less than half,
  * then the result should be rounded down.
  * <p>
  * Otherwise (they represent exactly half) the result is rounded
  * down if its rightmost digit is even, or rounded up if its
  * rightmost digit is odd (to make an even digit).
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_EVEN=6;
 MathContext.ROUND_HALF_EVEN = MathContext.prototype.ROUND_HALF_EVEN = 6;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded up.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If the discarded digits represent greater than or equal to half
  * (0.5 times) the value of a one in the next position then the result
  * should be rounded up (away from zero).  Otherwise the discarded
  * digits are ignored.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_UP=4;
 MathContext.ROUND_HALF_UP = MathContext.prototype.ROUND_HALF_UP = 4;

 /**
  * Rounding mode to assert that no rounding is necessary.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * Rounding (potential loss of information) is not permitted.
  * If any of the discarded digits are non-zero then an
  * <code>ArithmeticException</code> should be thrown.
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UNNECESSARY=7;
 MathContext.ROUND_UNNECESSARY = MathContext.prototype.ROUND_UNNECESSARY = 7;

 /**
  * Rounding mode to round away from zero.
  * Used as a setting to control the rounding mode used during a
  * <code>BigDecimal</code> operation.
  * <p>
  * If any of the discarded digits are non-zero then the result will
  * be rounded up (away from zero).
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UP=0;
 MathContext.ROUND_UP = MathContext.prototype.ROUND_UP = 0;


 /* properties shared */
 /**
  * The number of digits (precision) to be used for an operation.
  * A value of 0 indicates that unlimited precision (as many digits
  * as are required) will be used.
  * <p>
  * The {@link BigDecimal} operator methods use this value to
  * determine the precision of results.
  * Note that leading zeros (in the integer part of a number) are
  * never significant.
  * <p>
  * <code>digits</code> will always be non-negative.
  *
  * @serial
  */
 //--int digits;

 /**
  * The form of results from an operation.
  * <p>
  * The {@link BigDecimal} operator methods use this value to
  * determine the form of results, in particular whether and how
  * exponential notation should be used.
  *
  * @see #ENGINEERING
  * @see #PLAIN
  * @see #SCIENTIFIC
  * @serial
  */
 //--int form; // values for this must fit in a byte

 /**
  * Controls whether lost digits checking is enabled for an
  * operation.
  * Set to <code>true</code> to enable checking, or
  * to <code>false</code> to disable checking.
  * <p>
  * When enabled, the {@link BigDecimal} operator methods check
  * the precision of their operand or operands, and throw an
  * <code>ArithmeticException</code> if an operand is more precise
  * than the digits setting (that is, digits would be lost).
  * When disabled, operands are rounded to the specified digits.
  *
  * @serial
  */
 //--boolean lostDigits;

 /**
  * The rounding algorithm to be used for an operation.
  * <p>
  * The {@link BigDecimal} operator methods use this value to
  * determine the algorithm to be used when non-zero digits have to
  * be discarded in order to reduce the precision of a result.
  * The value must be one of the public constants whose name starts
  * with <code>ROUND_</code>.
  *
  * @see #ROUND_CEILING
  * @see #ROUND_DOWN
  * @see #ROUND_FLOOR
  * @see #ROUND_HALF_DOWN
  * @see #ROUND_HALF_EVEN
  * @see #ROUND_HALF_UP
  * @see #ROUND_UNNECESSARY
  * @see #ROUND_UP
  * @serial
  */
 //--int roundingMode;

 /* properties private constant */
 // default settings
 //--private static final int DEFAULT_FORM=SCIENTIFIC;
 //--private static final int DEFAULT_DIGITS=9;
 //--private static final boolean DEFAULT_LOSTDIGITS=false;
 //--private static final int DEFAULT_ROUNDINGMODE=ROUND_HALF_UP;
 MathContext.prototype.DEFAULT_FORM=MathContext.prototype.SCIENTIFIC;
 MathContext.prototype.DEFAULT_DIGITS=9;
 MathContext.prototype.DEFAULT_LOSTDIGITS=false;
 MathContext.prototype.DEFAULT_ROUNDINGMODE=MathContext.prototype.ROUND_HALF_UP;

 /* properties private constant */

 //--private static final int MIN_DIGITS=0; // smallest value for DIGITS.
 //--private static final int MAX_DIGITS=999999999; // largest value for DIGITS.  If increased,
 MathContext.prototype.MIN_DIGITS=0; // smallest value for DIGITS.
 MathContext.prototype.MAX_DIGITS=999999999; // largest value for DIGITS.  If increased,
 // the BigDecimal class may need update.
 // list of valid rounding mode values, most common two first
 //--private static final int ROUNDS[]=new int[]{ROUND_HALF_UP,ROUND_UNNECESSARY,ROUND_CEILING,ROUND_DOWN,ROUND_FLOOR,ROUND_HALF_DOWN,ROUND_HALF_EVEN,ROUND_UP};
 MathContext.prototype.ROUNDS=new Array(MathContext.prototype.ROUND_HALF_UP,MathContext.prototype.ROUND_UNNECESSARY,MathContext.prototype.ROUND_CEILING,MathContext.prototype.ROUND_DOWN,MathContext.prototype.ROUND_FLOOR,MathContext.prototype.ROUND_HALF_DOWN,MathContext.prototype.ROUND_HALF_EVEN,MathContext.prototype.ROUND_UP);


 //--private static final java.lang.String ROUNDWORDS[]=new java.lang.String[]{"ROUND_HALF_UP","ROUND_UNNECESSARY","ROUND_CEILING","ROUND_DOWN","ROUND_FLOOR","ROUND_HALF_DOWN","ROUND_HALF_EVEN","ROUND_UP"}; // matching names of the ROUNDS values
 MathContext.prototype.ROUNDWORDS=new Array("ROUND_HALF_UP","ROUND_UNNECESSARY","ROUND_CEILING","ROUND_DOWN","ROUND_FLOOR","ROUND_HALF_DOWN","ROUND_HALF_EVEN","ROUND_UP"); // matching names of the ROUNDS values




 /* properties private constant unused */

 // Serialization version
 //--private static final long serialVersionUID=7163376998892515376L;

 /* properties public constant */
 /**
  * A <code>MathContext</code> object initialized to the default
  * settings for general-purpose arithmetic.  That is,
  * <code>digits=9 form=SCIENTIFIC lostDigits=false
  * roundingMode=ROUND_HALF_UP</code>.
  *
  * @see #SCIENTIFIC
  * @see #ROUND_HALF_UP
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math.MathContext DEFAULT=new com.ibm.icu.math.MathContext(DEFAULT_DIGITS,DEFAULT_FORM,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 MathContext.prototype.DEFAULT=new MathContext(MathContext.prototype.DEFAULT_DIGITS,MathContext.prototype.DEFAULT_FORM,MathContext.prototype.DEFAULT_LOSTDIGITS,MathContext.prototype.DEFAULT_ROUNDINGMODE);




 /* ----- Constructors ----- */

 /**
  * Constructs a new <code>MathContext</code> with a specified
  * precision.
  * The other settings are set to the default values
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999).
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>MathContext</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public MathContext(int setdigits){
 //-- this(setdigits,DEFAULT_FORM,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 //-- return;}


 /**
  * Constructs a new <code>MathContext</code> with a specified
  * precision and form.
  * The other settings are set to the default values
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> parameter is not one of the appropriate
  * constants.
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>MathContext</code>.
  * @param setform       The <code>int</code> form setting
  *                      for this <code>MathContext</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public MathContext(int setdigits,int setform){
 //-- this(setdigits,setform,DEFAULT_LOSTDIGITS,DEFAULT_ROUNDINGMODE);
 //-- return;}

 /**
  * Constructs a new <code>MathContext</code> with a specified
  * precision, form, and lostDigits setting.
  * The roundingMode setting is set to its default value
  * (see {@link #DEFAULT}).
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> parameter is not one of the appropriate
  * constants.
  *
  * @param setdigits     The <code>int</code> digits setting
  *                      for this <code>MathContext</code>.
  * @param setform       The <code>int</code> form setting
  *                      for this <code>MathContext</code>.
  * @param setlostdigits The <code>boolean</code> lostDigits
  *                      setting for this <code>MathContext</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public MathContext(int setdigits,int setform,boolean setlostdigits){
 //-- this(setdigits,setform,setlostdigits,DEFAULT_ROUNDINGMODE);
 //-- return;}

 /**
  * Constructs a new <code>MathContext</code> with a specified
  * precision, form, lostDigits, and roundingMode setting.
  *
  * An <code>IllegalArgumentException</code> is thrown if the
  * <code>setdigits</code> parameter is out of range
  * (&lt;0 or &gt;999999999), or if the value given for the
  * <code>setform</code> or <code>setroundingmode</code> parameters is
  * not one of the appropriate constants.
  *
  * @param setdigits       The <code>int</code> digits setting
  *                        for this <code>MathContext</code>.
  * @param setform         The <code>int</code> form setting
  *                        for this <code>MathContext</code>.
  * @param setlostdigits   The <code>boolean</code> lostDigits
  *                        setting for this <code>MathContext</code>.
  * @param setroundingmode The <code>int</code> roundingMode setting
  *                        for this <code>MathContext</code>.
  * @throws IllegalArgumentException parameter out of range.
  * @stable ICU 2.0
  */

 //--public MathContext(int setdigits,int setform,boolean setlostdigits,int setroundingmode){super();
 function MathContext() {
  //-- members
  this.digits = 0;
  this.form = 0; // values for this must fit in a byte
  this.lostDigits = false;
  this.roundingMode = 0;

  //-- overloaded ctor
  var setform = this.DEFAULT_FORM;
  var setlostdigits = this.DEFAULT_LOSTDIGITS;
  var setroundingmode = this.DEFAULT_ROUNDINGMODE;
  if (MathContext.arguments.length == 4)
   {
    setform = MathContext.arguments[1];
    setlostdigits = MathContext.arguments[2];
    setroundingmode = MathContext.arguments[3];
   }
  else if (MathContext.arguments.length == 3)
   {
    setform = MathContext.arguments[1];
    setlostdigits = MathContext.arguments[2];
   }
  else if (MathContext.arguments.length == 2)
   {
    setform = MathContext.arguments[1];
   }
  else if (MathContext.arguments.length != 1)
   {
    throw "MathContext(): " + MathContext.arguments.length + " arguments given; expected 1 to 4";
   }
  var setdigits = MathContext.arguments[0];


  // set values, after checking
  if (setdigits!=this.DEFAULT_DIGITS)
   {
    if (setdigits<this.MIN_DIGITS)
     throw "MathContext(): Digits too small: "+setdigits;
    if (setdigits>this.MAX_DIGITS)
     throw "MathContext(): Digits too large: "+setdigits;
   }
  {/*select*/
  if (setform==this.SCIENTIFIC)
   {} // [most common]
  else if (setform==this.ENGINEERING)
   {}
  else if (setform==this.PLAIN)
   {}
  else{
   throw "MathContext() Bad form value: "+setform;
  }
  }
  if ((!(this.isValidRound(setroundingmode))))
   throw "MathContext(): Bad roundingMode value: "+setroundingmode;
  this.digits=setdigits;
  this.form=setform;
  this.lostDigits=setlostdigits; // [no bad value possible]
  this.roundingMode=setroundingmode;
  return;}

 /**
  * Returns the digits setting.
  * This value is always non-negative.
  *
  * @return an <code>int</code> which is the value of the digits
  *         setting
  * @stable ICU 2.0
  */

 //--public int getDigits(){
 function getDigits() {
  return this.digits;
  }

 /**
  * Returns the form setting.
  * This will be one of
  * {@link #ENGINEERING},
  * {@link #PLAIN}, or
  * {@link #SCIENTIFIC}.
  *
  * @return an <code>int</code> which is the value of the form setting
  * @stable ICU 2.0
  */

 //--public int getForm(){
 function getForm() {
  return this.form;
  }

 /**
  * Returns the lostDigits setting.
  * This will be either <code>true</code> (enabled) or
  * <code>false</code> (disabled).
  *
  * @return a <code>boolean</code> which is the value of the lostDigits
  *           setting
  * @stable ICU 2.0
  */

 //--public boolean getLostDigits(){
 function getLostDigits() {
  return this.lostDigits;
  }

 /**
  * Returns the roundingMode setting.
  * This will be one of
  * {@link  #ROUND_CEILING},
  * {@link  #ROUND_DOWN},
  * {@link  #ROUND_FLOOR},
  * {@link  #ROUND_HALF_DOWN},
  * {@link  #ROUND_HALF_EVEN},
  * {@link  #ROUND_HALF_UP},
  * {@link  #ROUND_UNNECESSARY}, or
  * {@link  #ROUND_UP}.
  *
  * @return an <code>int</code> which is the value of the roundingMode
  *         setting
  * @stable ICU 2.0
  */

 //--public int getRoundingMode(){
 function getRoundingMode() {
  return this.roundingMode;
  }

 /** Returns the <code>MathContext</code> as a readable string.
  * The <code>String</code> returned represents the settings of the
  * <code>MathContext</code> object as four blank-delimited words
  * separated by a single blank and with no leading or trailing blanks,
  * as follows:
  * <ol>
  * <li>
  * <code>digits=</code>, immediately followed by
  * the value of the digits setting as a numeric word.
  * <li>
  * <code>form=</code>, immediately followed by
  * the value of the form setting as an uppercase word
  * (one of <code>SCIENTIFIC</code>, <code>PLAIN</code>, or
  * <code>ENGINEERING</code>).
  * <li>
  * <code>lostDigits=</code>, immediately followed by
  * the value of the lostDigits setting
  * (<code>1</code> if enabled, <code>0</code> if disabled).
  * <li>
  * <code>roundingMode=</code>, immediately followed by
  * the value of the roundingMode setting as a word.
  * This word will be the same as the name of the corresponding public
  * constant.
  * </ol>
  * <p>
  * For example:
  * <br><code>
  * digits=9 form=SCIENTIFIC lostDigits=0 roundingMode=ROUND_HALF_UP
  * </code>
  * <p>
  * Additional words may be appended to the result of
  * <code>toString</code> in the future if more properties are added
  * to the class.
  *
  * @return a <code>String</code> representing the context settings.
  * @stable ICU 2.0
  */

 //--public java.lang.String toString(){
 function toString() {
  //--java.lang.String formstr=null;
  var formstr=null;
  //--int r=0;
  var r=0;
  //--java.lang.String roundword=null;
  var roundword=null;
  {/*select*/
  if (this.form==this.SCIENTIFIC)
   formstr="SCIENTIFIC";
  else if (this.form==this.ENGINEERING)
   formstr="ENGINEERING";
  else{
   formstr="PLAIN";/* form=PLAIN */
  }
  }
  {var $1=this.ROUNDS.length;r=0;r:for(;$1>0;$1--,r++){
   if (this.roundingMode==this.ROUNDS[r])
    {
     roundword=this.ROUNDWORDS[r];
     break r;
    }
   }
  }/*r*/
  return "digits="+this.digits+" "+"form="+formstr+" "+"lostDigits="+(this.lostDigits?"1":"0")+" "+"roundingMode="+roundword;
  }


 /* <sgml> Test whether round is valid. </sgml> */
 // This could be made shared for use by BigDecimal for setScale.

 //--private static boolean isValidRound(int testround){
 function isValidRound(testround) {
  //--int r=0;
  var r=0;
  {var $2=this.ROUNDS.length;r=0;r:for(;$2>0;$2--,r++){
   if (testround==this.ROUNDS[r])
    return true;
   }
  }/*r*/
  return false;
  }
return MathContext;
})();

var BigDecimal = (function (MathContext) {
/* Generated from 'BigDecimal.nrx' 8 Sep 2000 11:10:50 [v2.00] */
/* Options: Binary Comments Crossref Format Java Logo Strictargs Strictcase Trace2 Verbose3 */
//--package com.ibm.icu.math;
//--import java.math.BigInteger;
//--import com.ibm.icu.impl.Utility;

/* ------------------------------------------------------------------ */
/* BigDecimal -- Decimal arithmetic for Java                          */
/* ------------------------------------------------------------------ */
/* Copyright IBM Corporation, 1996, 2000.  All Rights Reserved.       */
/*                                                                    */
/* The BigDecimal class provides immutable arbitrary-precision        */
/* floating point (including integer) decimal numbers.                */
/*                                                                    */
/* As the numbers are decimal, there is an exact correspondence       */
/* between an instance of a BigDecimal object and its String          */
/* representation; the BigDecimal class provides direct conversions   */
/* to and from String and character array objects, and well as        */
/* conversions to and from the Java primitive types (which may not    */
/* be exact).                                                         */
/* ------------------------------------------------------------------ */
/* Notes:                                                             */
/*                                                                    */
/* 1. A BigDecimal object is never changed in value once constructed; */
/*    this avoids the need for locking.  Note in particular that the  */
/*    mantissa array may be shared between many BigDecimal objects,   */
/*    so that once exposed it must not be altered.                    */
/*                                                                    */
/* 2. This class looks at MathContext class fields directly (for      */
/*    performance).  It must not and does not change them.            */
/*                                                                    */
/* 3. Exponent checking is delayed until finish(), as we know         */
/*    intermediate calculations cannot cause 31-bit overflow.         */
/*    [This assertion depends on MAX_DIGITS in MathContext.]          */
/*                                                                    */
/* 4. Comments for the public API now follow the javadoc conventions. */
/*    The NetRexx -comments option is used to pass these comments     */
/*    through to the generated Java code (with -format, if desired).  */
/*                                                                    */
/* 5. System.arraycopy is faster than explicit loop as follows        */
/*      Mean length 4:  equal                                         */
/*      Mean length 8:  x2                                            */
/*      Mean length 16: x3                                            */
/*      Mean length 24: x4                                            */
/*    From prior experience, we expect mean length a little below 8,  */
/*    but arraycopy is still the one to use, in general, until later  */
/*    measurements suggest otherwise.                                 */
/*                                                                    */
/* 6. 'DMSRCN' referred to below is the original (1981) IBM S/370     */
/*    assembler code implementation of the algorithms below; it is    */
/*    now called IXXRCN and is available with the OS/390 and VM/ESA   */
/*    operating systems.                                              */
/* ------------------------------------------------------------------ */
/* Change History:                                                    */
/* 1997.09.02 Initial version (derived from netrexx.lang classes)     */
/* 1997.09.12 Add lostDigits checking                                 */
/* 1997.10.06 Change mantissa to a byte array                         */
/* 1997.11.22 Rework power [did not prepare arguments, etc.]          */
/* 1997.12.13 multiply did not prepare arguments                      */
/* 1997.12.14 add did not prepare and align arguments correctly       */
/* 1998.05.02 0.07 packaging changes suggested by Sun and Oracle      */
/* 1998.05.21 adjust remainder operator finalization                  */
/* 1998.06.04 rework to pass MathContext to finish() and round()      */
/* 1998.06.06 change format to use round(); support rounding modes    */
/* 1998.06.25 rename to BigDecimal and begin merge                    */
/*            zero can now have trailing zeros (i.e., exp\=0)         */
/* 1998.06.28 new methods: movePointXxxx, scale, toBigInteger         */
/*                         unscaledValue, valueof                     */
/* 1998.07.01 improve byteaddsub to allow array reuse, etc.           */
/* 1998.07.01 make null testing explicit to avoid JIT bug [Win32]     */
/* 1998.07.07 scaled division  [divide(BigDecimal, int, int)]         */
/* 1998.07.08 setScale, faster equals                                 */
/* 1998.07.11 allow 1E6 (no sign) <sigh>; new double/float conversion */
/* 1998.10.12 change package to com.ibm.icu.math                          */
/* 1998.12.14 power operator no longer rounds RHS [to match ANSI]     */
/*            add toBigDecimal() and BigDecimal(java.math.BigDecimal) */
/* 1998.12.29 improve byteaddsub by using table lookup                */
/* 1999.02.04 lostdigits=0 behaviour rounds instead of digits+1 guard */
/* 1999.02.05 cleaner code for BigDecimal(char[])                     */
/* 1999.02.06 add javadoc comments                                    */
/* 1999.02.11 format() changed from 7 to 2 method form                */
/* 1999.03.05 null pointer checking is no longer explicit             */
/* 1999.03.05 simplify; changes from discussion with J. Bloch:        */
/*            null no longer permitted for MathContext; drop boolean, */
/*            byte, char, float, short constructor, deprecate double  */
/*            constructor, no blanks in string constructor, add       */
/*            offset and length version of char[] constructor;        */
/*            add valueOf(double); drop booleanValue, charValue;      */
/*            add ...Exact versions of remaining convertors           */
/* 1999.03.13 add toBigIntegerExact                                   */
/* 1999.03.13 1.00 release to IBM Centre for Java Technology          */
/* 1999.05.27 1.01 correct 0-0.2 bug under scaled arithmetic          */
/* 1999.06.29 1.02 constructors should not allow exponent > 9 digits  */
/* 1999.07.03 1.03 lost digits should not be checked if digits=0      */
/* 1999.07.06      lost digits Exception message changed              */
/* 1999.07.10 1.04 more work on 0-0.2 (scaled arithmetic)             */
/* 1999.07.17      improve messages from pow method                   */
/* 1999.08.08      performance tweaks                                 */
/* 1999.08.15      fastpath in multiply                               */
/* 1999.11.05 1.05 fix problem in intValueExact [e.g., 5555555555]    */
/* 1999.12.22 1.06 remove multiply fastpath, and improve performance  */
/* 2000.01.01      copyright update [Y2K has arrived]                 */
/* 2000.06.18 1.08 no longer deprecate BigDecimal(double)             */
/* ------------------------------------------------------------------ */


/* JavaScript conversion (c) 2003 STZ-IDA and PTV AG, Karlsruhe, Germany */



function div(a, b) {
    return (a-(a%b))/b;
}

BigDecimal.prototype.div = div;

function arraycopy(src, srcindex, dest, destindex, length) {
    var i;
    if (destindex > srcindex) {
        // in case src and dest are equals, but also doesn't hurt
        // if they are different
        for (i = length-1; i >= 0; --i) {
            dest[i+destindex] = src[i+srcindex];
        }
    } else {
        for (i = 0; i < length; ++i) {
            dest[i+destindex] = src[i+srcindex];
        }
    }
}

BigDecimal.prototype.arraycopy = arraycopy;

function createArrayWithZeros(length) {
    var retVal = new Array(length);
    var i;
    for (i = 0; i < length; ++i) {
        retVal[i] = 0;
    }
    return retVal;
}

BigDecimal.prototype.createArrayWithZeros = createArrayWithZeros;


/**
 * The <code>BigDecimal</code> class implements immutable
 * arbitrary-precision decimal numbers.  The methods of the
 * <code>BigDecimal</code> class provide operations for fixed and
 * floating point arithmetic, comparison, format conversions, and
 * hashing.
 * <p>
 * As the numbers are decimal, there is an exact correspondence between
 * an instance of a <code>BigDecimal</code> object and its
 * <code>String</code> representation; the <code>BigDecimal</code> class
 * provides direct conversions to and from <code>String</code> and
 * character array (<code>char[]</code>) objects, as well as conversions
 * to and from the Java primitive types (which may not be exact) and
 * <code>BigInteger</code>.
 * <p>
 * In the descriptions of constructors and methods in this documentation,
 * the value of a <code>BigDecimal</code> number object is shown as the
 * result of invoking the <code>toString()</code> method on the object.
 * The internal representation of a decimal number is neither defined
 * nor exposed, and is not permitted to affect the result of any
 * operation.
 * <p>
 * The floating point arithmetic provided by this class is defined by
 * the ANSI X3.274-1996 standard, and is also documented at
 * <code>http://www2.hursley.ibm.com/decimal</code>
 * <br><i>[This URL will change.]</i>
 *
 * <h3>Operator methods</h3>
 * <p>
 * Operations on <code>BigDecimal</code> numbers are controlled by a
 * {@link MathContext} object, which provides the context (precision and
 * other information) for the operation. Methods that can take a
 * <code>MathContext</code> parameter implement the standard arithmetic
 * operators for <code>BigDecimal</code> objects and are known as
 * <i>operator methods</i>.  The default settings provided by the
 * constant {@link MathContext#DEFAULT} (<code>digits=9,
 * form=SCIENTIFIC, lostDigits=false, roundingMode=ROUND_HALF_UP</code>)
 * perform general-purpose floating point arithmetic to nine digits of
 * precision.  The <code>MathContext</code> parameter must not be
 * <code>null</code>.
 * <p>
 * Each operator method also has a version provided which does
 * not take a <code>MathContext</code> parameter.  For this version of
 * each method, the context settings used are <code>digits=0,
 * form=PLAIN, lostDigits=false, roundingMode=ROUND_HALF_UP</code>;
 * these settings perform fixed point arithmetic with unlimited
 * precision, as defined for the original BigDecimal class in Java 1.1
 * and Java 1.2.
 * <p>
 * For monadic operators, only the optional <code>MathContext</code>
 * parameter is present; the operation acts upon the current object.
 * <p>
 * For dyadic operators, a <code>BigDecimal</code> parameter is always
 * present; it must not be <code>null</code>.
 * The operation acts with the current object being the left-hand operand
 * and the <code>BigDecimal</code> parameter being the right-hand operand.
 * <p>
 * For example, adding two <code>BigDecimal</code> objects referred to
 * by the names <code>award</code> and <code>extra</code> could be
 * written as any of:
 * <p><code>
 *     award.add(extra)
 * <br>award.add(extra, MathContext.DEFAULT)
 * <br>award.add(extra, acontext)
 * </code>
 * <p>
 * (where <code>acontext</code> is a <code>MathContext</code> object),
 * which would return a <code>BigDecimal</code> object whose value is
 * the result of adding <code>award</code> and <code>extra</code> under
 * the appropriate context settings.
 * <p>
 * When a <code>BigDecimal</code> operator method is used, a set of
 * rules define what the result will be (and, by implication, how the
 * result would be represented as a character string).
 * These rules are defined in the BigDecimal arithmetic documentation
 * (see the URL above), but in summary:
 * <ul>
 * <li>Results are normally calculated with up to some maximum number of
 * significant digits.
 * For example, if the <code>MathContext</code> parameter for an operation
 * were <code>MathContext.DEFAULT</code> then the result would be
 * rounded to 9 digits; the division of 2 by 3 would then result in
 * 0.666666667.
 * <br>
 * You can change the default of 9 significant digits by providing the
 * method with a suitable <code>MathContext</code> object. This lets you
 * calculate using as many digits as you need -- thousands, if necessary.
 * Fixed point (scaled) arithmetic is indicated by using a
 * <code>digits</code> setting of 0 (or omitting the
 * <code>MathContext</code> parameter).
 * <br>
 * Similarly, you can change the algorithm used for rounding from the
 * default "classic" algorithm.
 * <li>
 * In standard arithmetic (that is, when the <code>form</code> setting
 * is not <code>PLAIN</code>), a zero result is always expressed as the
 * single digit <code>'0'</code> (that is, with no sign, decimal point,
 * or exponent part).
 * <li>
 * Except for the division and power operators in standard arithmetic,
 * trailing zeros are preserved (this is in contrast to binary floating
 * point operations and most electronic calculators, which lose the
 * information about trailing zeros in the fractional part of results).
 * <br>
 * So, for example:
 * <p><code>
 *     new BigDecimal("2.40").add(     new BigDecimal("2"))      =&gt; "4.40"
 * <br>new BigDecimal("2.40").subtract(new BigDecimal("2"))      =&gt; "0.40"
 * <br>new BigDecimal("2.40").multiply(new BigDecimal("2"))      =&gt; "4.80"
 * <br>new BigDecimal("2.40").divide(  new BigDecimal("2"), def) =&gt; "1.2"
 * </code>
 * <p>where the value on the right of the <code>=&gt;</code> would be the
 * result of the operation, expressed as a <code>String</code>, and
 * <code>def</code> (in this and following examples) refers to
 * <code>MathContext.DEFAULT</code>).
 * This preservation of trailing zeros is desirable for most
 * calculations (including financial calculations).
 * If necessary, trailing zeros may be easily removed using division by 1.
 * <li>
 * In standard arithmetic, exponential form is used for a result
 * depending on its value and the current setting of <code>digits</code>
 * (the default is 9 digits).
 * If the number of places needed before the decimal point exceeds the
 * <code>digits</code> setting, or the absolute value of the number is
 * less than <code>0.000001</code>, then the number will be expressed in
 * exponential notation; thus
 * <p><code>
 *   new BigDecimal("1e+6").multiply(new BigDecimal("1e+6"), def)
 * </code>
 * <p>results in <code>1E+12</code> instead of
 * <code>1000000000000</code>, and
 * <p><code>
 *   new BigDecimal("1").divide(new BigDecimal("3E+10"), def)
 * </code>
 * <p>results in <code>3.33333333E-11</code> instead of
 * <code>0.0000000000333333333</code>.
 * <p>
 * The form of the exponential notation (scientific or engineering) is
 * determined by the <code>form</code> setting.
 * <eul>
 * <p>
 * The names of methods in this class follow the conventions established
 * by <code>java.lang.Number</code>, <code>java.math.BigInteger</code>,
 * and <code>java.math.BigDecimal</code> in Java 1.1 and Java 1.2.
 *
 * @see     MathContext
 * @author  Mike Cowlishaw
 * @stable ICU 2.0
 */

//--public class BigDecimal extends java.lang.Number implements java.io.Serializable,java.lang.Comparable{
//-- private static final java.lang.String $0="BigDecimal.nrx";

 //-- methods
 BigDecimal.prototype.abs = abs;
 BigDecimal.prototype.add = add;
 BigDecimal.prototype.compareTo = compareTo;
 BigDecimal.prototype.divide = divide;
 BigDecimal.prototype.divideInteger = divideInteger;
 BigDecimal.prototype.max = max;
 BigDecimal.prototype.min = min;
 BigDecimal.prototype.multiply = multiply;
 BigDecimal.prototype.negate = negate;
 BigDecimal.prototype.plus = plus;
 BigDecimal.prototype.pow = pow;
 BigDecimal.prototype.remainder = remainder;
 BigDecimal.prototype.subtract = subtract;
 BigDecimal.prototype.equals = equals;
 BigDecimal.prototype.format = format;
 BigDecimal.prototype.intValueExact = intValueExact;
 BigDecimal.prototype.movePointLeft = movePointLeft;
 BigDecimal.prototype.movePointRight = movePointRight;
 BigDecimal.prototype.scale = scale;
 BigDecimal.prototype.setScale = setScale;
 BigDecimal.prototype.signum = signum;
 BigDecimal.prototype.toString = toString;
 BigDecimal.prototype.layout = layout;
 BigDecimal.prototype.intcheck = intcheck;
 BigDecimal.prototype.dodivide = dodivide;
 BigDecimal.prototype.bad = bad;
 BigDecimal.prototype.badarg = badarg;
 BigDecimal.prototype.extend = extend;
 BigDecimal.prototype.byteaddsub = byteaddsub;
 BigDecimal.prototype.diginit = diginit;
 BigDecimal.prototype.clone = clone;
 BigDecimal.prototype.checkdigits = checkdigits;
 BigDecimal.prototype.round = round;
 BigDecimal.prototype.allzero = allzero;
 BigDecimal.prototype.finish = finish;

 // Convenience methods
 BigDecimal.prototype.isGreaterThan = isGreaterThan;
 BigDecimal.prototype.isLessThan = isLessThan;
 BigDecimal.prototype.isGreaterThanOrEqualTo = isGreaterThanOrEqualTo;
 BigDecimal.prototype.isLessThanOrEqualTo = isLessThanOrEqualTo;
 BigDecimal.prototype.isPositive = isPositive;
 BigDecimal.prototype.isNegative = isNegative;
 BigDecimal.prototype.isZero = isZero;


 /* ----- Constants ----- */
 /* properties constant public */ // useful to others
 // the rounding modes (copied here for upwards compatibility)
 /**
  * Rounding mode to round to a more positive number.
  * @see MathContext#ROUND_CEILING
  * @stable ICU 2.0
  */
 //--public static final int ROUND_CEILING=com.ibm.icu.math.MathContext.ROUND_CEILING;
 BigDecimal.ROUND_CEILING = BigDecimal.prototype.ROUND_CEILING = MathContext.prototype.ROUND_CEILING;

 /**
  * Rounding mode to round towards zero.
  * @see MathContext#ROUND_DOWN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_DOWN=com.ibm.icu.math.MathContext.ROUND_DOWN;
 BigDecimal.ROUND_DOWN = BigDecimal.prototype.ROUND_DOWN = MathContext.prototype.ROUND_DOWN;

 /**
  * Rounding mode to round to a more negative number.
  * @see MathContext#ROUND_FLOOR
  * @stable ICU 2.0
  */
 //--public static final int ROUND_FLOOR=com.ibm.icu.math.MathContext.ROUND_FLOOR;
 BigDecimal.ROUND_FLOOR = BigDecimal.prototype.ROUND_FLOOR = MathContext.prototype.ROUND_FLOOR;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded down.
  * @see MathContext#ROUND_HALF_DOWN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_DOWN=com.ibm.icu.math.MathContext.ROUND_HALF_DOWN;
 BigDecimal.ROUND_HALF_DOWN = BigDecimal.prototype.ROUND_HALF_DOWN = MathContext.prototype.ROUND_HALF_DOWN;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded to the nearest even neighbor.
  * @see MathContext#ROUND_HALF_EVEN
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_EVEN=com.ibm.icu.math.MathContext.ROUND_HALF_EVEN;
 BigDecimal.ROUND_HALF_EVEN = BigDecimal.prototype.ROUND_HALF_EVEN = MathContext.prototype.ROUND_HALF_EVEN;

 /**
  * Rounding mode to round to nearest neighbor, where an equidistant
  * value is rounded up.
  * @see MathContext#ROUND_HALF_UP
  * @stable ICU 2.0
  */
 //--public static final int ROUND_HALF_UP=com.ibm.icu.math.MathContext.ROUND_HALF_UP;
 BigDecimal.ROUND_HALF_UP = BigDecimal.prototype.ROUND_HALF_UP = MathContext.prototype.ROUND_HALF_UP;

 /**
  * Rounding mode to assert that no rounding is necessary.
  * @see MathContext#ROUND_UNNECESSARY
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UNNECESSARY=com.ibm.icu.math.MathContext.ROUND_UNNECESSARY;
 BigDecimal.ROUND_UNNECESSARY = BigDecimal.prototype.ROUND_UNNECESSARY = MathContext.prototype.ROUND_UNNECESSARY;

 /**
  * Rounding mode to round away from zero.
  * @see MathContext#ROUND_UP
  * @stable ICU 2.0
  */
 //--public static final int ROUND_UP=com.ibm.icu.math.MathContext.ROUND_UP;
 BigDecimal.ROUND_UP = BigDecimal.prototype.ROUND_UP = MathContext.prototype.ROUND_UP;

 /* properties constant private */ // locals
 //--private static final byte ispos=1; // ind: indicates positive (must be 1)
 //--private static final byte iszero=0; // ind: indicates zero     (must be 0)
 //--private static final byte isneg=-1; // ind: indicates negative (must be -1)
 BigDecimal.prototype.ispos = 1;
 BigDecimal.prototype.iszero = 0;
 BigDecimal.prototype.isneg = -1;
 // [later could add NaN, +/- infinity, here]

 //--private static final int MinExp=-999999999; // minimum exponent allowed
 //--private static final int MaxExp=999999999; // maximum exponent allowed
 //--private static final int MinArg=-999999999; // minimum argument integer
 //--private static final int MaxArg=999999999; // maximum argument integer
 BigDecimal.prototype.MinExp=-999999999; // minimum exponent allowed
 BigDecimal.prototype.MaxExp=999999999; // maximum exponent allowed
 BigDecimal.prototype.MinArg=-999999999; // minimum argument integer
 BigDecimal.prototype.MaxArg=999999999; // maximum argument integer

 //--private static final com.ibm.icu.math.MathContext plainMC=new com.ibm.icu.math.MathContext(0,com.ibm.icu.math.MathContext.PLAIN); // context for plain unlimited math
 BigDecimal.prototype.plainMC=new MathContext(0, MathContext.prototype.PLAIN);

 /* properties constant private unused */ // present but not referenced

 // Serialization version
 //--private static final long serialVersionUID=8245355804974198832L;

 //--private static final java.lang.String copyright=" Copyright (c) IBM Corporation 1996, 2000.  All rights reserved. ";

 /* properties static private */
 // Precalculated constant arrays (used by byteaddsub)
 //--private static byte bytecar[]=new byte[(90+99)+1]; // carry/borrow array
 //--private static byte bytedig[]=diginit(); // next digit array
 BigDecimal.prototype.bytecar = new Array((90+99)+1);
 BigDecimal.prototype.bytedig = diginit();

 /**
  * The <code>BigDecimal</code> constant "0".
  *
  * @see #ONE
  * @see #TEN
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math.BigDecimal ZERO=new com.ibm.icu.math.BigDecimal((long)0); // use long as we want the int constructor
 // .. to be able to use this, for speed
BigDecimal.ZERO = BigDecimal.prototype.ZERO = new BigDecimal("0");

 /**
  * The <code>BigDecimal</code> constant "1".
  *
  * @see #TEN
  * @see #ZERO
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math.BigDecimal ONE=new com.ibm.icu.math.BigDecimal((long)1); // use long as we want the int constructor
 // .. to be able to use this, for speed
BigDecimal.ONE = BigDecimal.prototype.ONE = new BigDecimal("1");

 /**
  * The <code>BigDecimal</code> constant "10".
  *
  * @see #ONE
  * @see #ZERO
  * @stable ICU 2.0
  */
 //--public static final com.ibm.icu.math.BigDecimal TEN=new com.ibm.icu.math.BigDecimal(10);
 BigDecimal.TEN = BigDecimal.prototype.TEN = new BigDecimal("10");

 /* ----- Instance properties [all private and immutable] ----- */
 /* properties private */

 /**
  * The indicator. This may take the values:
  * <ul>
  * <li>ispos  -- the number is positive
  * <li>iszero -- the number is zero
  * <li>isneg  -- the number is negative
  * </ul>
  *
  * @serial
  */
 //--private byte ind; // assumed undefined
 // Note: some code below assumes IND = Sign [-1, 0, 1], at present.
 // We only need two bits for this, but use a byte [also permits
 // smooth future extension].

 /**
  * The formatting style. This may take the values:
  * <ul>
  * <li>MathContext.PLAIN        -- no exponent needed
  * <li>MathContext.SCIENTIFIC   -- scientific notation required
  * <li>MathContext.ENGINEERING  -- engineering notation required
  * </ul>
  * <p>
  * This property is an optimization; it allows us to defer number
  * layout until it is actually needed as a string, hence avoiding
  * unnecessary formatting.
  *
  * @serial
  */
 //--private byte form=(byte)com.ibm.icu.math.MathContext.PLAIN; // assumed PLAIN
 // We only need two bits for this, at present, but use a byte
 // [again, to allow for smooth future extension]

 /**
  * The value of the mantissa.
  * <p>
  * Once constructed, this may become shared between several BigDecimal
  * objects, so must not be altered.
  * <p>
  * For efficiency (speed), this is a byte array, with each byte
  * taking a value of 0 -> 9.
  * <p>
  * If the first byte is 0 then the value of the number is zero (and
  * mant.length=1, except when constructed from a plain number, for
  * example, 0.000).
  *
  * @serial
  */
 //--private byte mant[]; // assumed null

 /**
  * The exponent.
  * <p>
  * For fixed point arithmetic, scale is <code>-exp</code>, and can
  * apply to zero.
  *
  * Note that this property can have a value less than MinExp when
  * the mantissa has more than one digit.
  *
  * @serial
  */
 //--private int exp;
 // assumed 0

 /* ---------------------------------------------------------------- */
 /* Constructors                                                     */
 /* ---------------------------------------------------------------- */

 /**
  * Constructs a <code>BigDecimal</code> object from a
  * <code>java.math.BigDecimal</code>.
  * <p>
  * Constructs a <code>BigDecimal</code> as though the parameter had
  * been represented as a <code>String</code> (using its
  * <code>toString</code> method) and the
  * {@link #BigDecimal(java.lang.String)} constructor had then been
  * used.
  * The parameter must not be <code>null</code>.
  * <p>
  * <i>(Note: this constructor is provided only in the
  * <code>com.ibm.icu.math</code> version of the BigDecimal class.
  * It would not be present in a <code>java.math</code> version.)</i>
  *
  * @param bd The <code>BigDecimal</code> to be translated.
  * @stable ICU 2.0
  */

 //--public BigDecimal(java.math.BigDecimal bd){
 //-- this(bd.toString());
 //-- return;}

 /**
  * Constructs a <code>BigDecimal</code> object from a
  * <code>BigInteger</code>, with scale 0.
  * <p>
  * Constructs a <code>BigDecimal</code> which is the exact decimal
  * representation of the <code>BigInteger</code>, with a scale of
  * zero.
  * The value of the <code>BigDecimal</code> is identical to the value
  * of the <code>BigInteger</code>.
  * The parameter must not be <code>null</code>.
  * <p>
  * The <code>BigDecimal</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the
  * <code>BigInteger</code> is negative.  A leading zero will be
  * present only if the <code>BigInteger</code> is zero.
  *
  * @param bi The <code>BigInteger</code> to be converted.
  * @stable ICU 2.0
  */

 //--public BigDecimal(java.math.BigInteger bi){
 //-- this(bi.toString(10));
 //-- return;}
 // exp remains 0

 /**
  * Constructs a <code>BigDecimal</code> object from a
  * <code>BigInteger</code> and a scale.
  * <p>
  * Constructs a <code>BigDecimal</code> which is the exact decimal
  * representation of the <code>BigInteger</code>, scaled by the
  * second parameter, which may not be negative.
  * The value of the <code>BigDecimal</code> is the
  * <code>BigInteger</code> divided by ten to the power of the scale.
  * The <code>BigInteger</code> parameter must not be
  * <code>null</code>.
  * <p>
  * The <code>BigDecimal</code> will contain only decimal digits, (with
  * an embedded decimal point followed by <code>scale</code> decimal
  * digits if the scale is positive), prefixed with a leading minus
  * sign (hyphen) if the <code>BigInteger</code> is negative.  A
  * leading zero will be present only if the <code>BigInteger</code> is
  * zero.
  *
  * @param  bi    The <code>BigInteger</code> to be converted.
  * @param  scale The <code>int</code> specifying the scale.
  * @throws NumberFormatException if the scale is negative.
  * @stable ICU 2.0
  */

 //--public BigDecimal(java.math.BigInteger bi,int scale){
 //-- this(bi.toString(10));
 //-- if (scale<0)
 //--  throw new java.lang.NumberFormatException("Negative scale:"+" "+scale);
 //-- exp=(int)-scale; // exponent is -scale
 //-- return;}

 /**
  * Constructs a <code>BigDecimal</code> object from an array of characters.
  * <p>
  * Constructs a <code>BigDecimal</code> as though a
  * <code>String</code> had been constructed from the character array
  * and the {@link #BigDecimal(java.lang.String)} constructor had then
  * been used. The parameter must not be <code>null</code>.
  * <p>
  * Using this constructor is faster than using the
  * <code>BigDecimal(String)</code> constructor if the string is
  * already available in character array form.
  *
  * @param inchars The <code>char[]</code> array containing the number
  *                to be converted.
  * @throws NumberFormatException if the parameter is not a valid
  *                number.
  * @stable ICU 2.0
  */

 //--public BigDecimal(char inchars[]){
 //-- this(inchars,0,inchars.length);
 //-- return;}

 /**
  * Constructs a <code>BigDecimal</code> object from an array of characters.
  * <p>
  * Constructs a <code>BigDecimal</code> as though a
  * <code>String</code> had been constructed from the character array
  * (or a subarray of that array) and the
  * {@link #BigDecimal(java.lang.String)} constructor had then been
  * used. The first parameter must not be <code>null</code>, and the
  * subarray must be wholly contained within it.
  * <p>
  * Using this constructor is faster than using the
  * <code>BigDecimal(String)</code> constructor if the string is
  * already available within a character array.
  *
  * @param inchars The <code>char[]</code> array containing the number
  *                to be converted.
  * @param offset  The <code>int</code> offset into the array of the
  *                start of the number to be converted.
  * @param length  The <code>int</code> length of the number.
  * @throws NumberFormatException if the parameter is not a valid
  *                number for any reason.
  * @stable ICU 2.0
  */

 //--public BigDecimal(char inchars[],int offset,int length){super();
 function BigDecimal() {
  //-- members
  this.ind = 0;
  this.form = MathContext.prototype.PLAIN;
  this.mant = null;
  this.exp = 0;

  //-- overloaded ctor
  if (BigDecimal.arguments.length == 0)
   return;
  var inchars;
  var offset;
  var length;
  if (BigDecimal.arguments.length == 1)
   {
    inchars = BigDecimal.arguments[0];
    offset = 0;
    length = inchars.length;
   }
  else
   {
    inchars = BigDecimal.arguments[0];
    offset = BigDecimal.arguments[1];
    length = BigDecimal.arguments[2];
   }
  if (typeof inchars == "string")
   {
    inchars = inchars.split("");
   }

  //--boolean exotic;
  var exotic;
  //--boolean hadexp;
  var hadexp;
  //--int d;
  var d;
  //--int dotoff;
  var dotoff;
  //--int last;
  var last;
  //--int i=0;
  var i=0;
  //--char si=0;
  var si=0;
  //--boolean eneg=false;
  var eneg=false;
  //--int k=0;
  var k=0;
  //--int elen=0;
  var elen=0;
  //--int j=0;
  var j=0;
  //--char sj=0;
  var sj=0;
  //--int dvalue=0;
  var dvalue=0;
  //--int mag=0;
  var mag=0;
  // This is the primary constructor; all incoming strings end up
  // here; it uses explicit (inline) parsing for speed and to avoid
  // generating intermediate (temporary) objects of any kind.
  // 1998.06.25: exponent form built only if E/e in string
  // 1998.06.25: trailing zeros not removed for zero
  // 1999.03.06: no embedded blanks; allow offset and length
  if (length<=0)
   this.bad("BigDecimal(): ", inchars); // bad conversion (empty string)
  // [bad offset will raise array bounds exception]

  /* Handle and step past sign */
  this.ind=this.ispos; // assume positive
  if (inchars[0]==('-'))
   {
    length--;
    if (length==0)
     this.bad("BigDecimal(): ", inchars); // nothing after sign
    this.ind=this.isneg;
    offset++;
   }
  else
   if (inchars[0]==('+'))
    {
     length--;
     if (length==0)
      this.bad("BigDecimal(): ", inchars); // nothing after sign
     offset++;
    }

  /* We're at the start of the number */
  exotic=false; // have extra digits
  hadexp=false; // had explicit exponent
  d=0; // count of digits found
  dotoff=-1; // offset where dot was found
  last=-1; // last character of mantissa
  {var $1=length;i=offset;i:for(;$1>0;$1--,i++){
   si=inchars[i];
   if (si>='0')  // test for Arabic digit
    if (si<='9')
     {
      last=i;
      d++; // still in mantissa
      continue i;
     }
   if (si=='.')
    { // record and ignore
     if (dotoff>=0)
      this.bad("BigDecimal(): ", inchars); // two dots
     dotoff=i-offset; // offset into mantissa
     continue i;
    }
   if (si!='e')
    if (si!='E')
     { // expect an extra digit
      if (si<'0' || si>'9')
       this.bad("BigDecimal(): ", inchars); // not a number
      // defer the base 10 check until later to avoid extra method call
      exotic=true; // will need conversion later
      last=i;
      d++; // still in mantissa
      continue i;
     }
   /* Found 'e' or 'E' -- now process explicit exponent */
   // 1998.07.11: sign no longer required
   if ((i-offset)>(length-2))
    this.bad("BigDecimal(): ", inchars); // no room for even one digit
   eneg=false;
   if ((inchars[i+1])==('-'))
    {
     eneg=true;
     k=i+2;
    }
   else
    if ((inchars[i+1])==('+'))
     k=i+2;
    else
     k=i+1;
   // k is offset of first expected digit
   elen=length-((k-offset)); // possible number of digits
   if ((elen==0)||(elen>9))
    this.bad("BigDecimal(): ", inchars); // 0 or more than 9 digits
   {var $2=elen;j=k;j:for(;$2>0;$2--,j++){
    sj=inchars[j];
    if (sj<'0')
     this.bad("BigDecimal(): ", inchars); // always bad
    if (sj>'9')
     { // maybe an exotic digit
      /*if (si<'0' || si>'9')
       this.bad(inchars); // not a number
      dvalue=java.lang.Character.digit(sj,10); // check base
      if (dvalue<0)
       bad(inchars); // not base 10*/
      this.bad("BigDecimal(): ", inchars);
     }
    else
     dvalue=sj-'0';
    this.exp=(this.exp*10)+dvalue;
    }
   }/*j*/
   if (eneg)
    this.exp=-this.exp; // was negative
   hadexp=true; // remember we had one
   break i; // we are done
   }
  }/*i*/

  /* Here when all inspected */
  if (d==0)
   this.bad("BigDecimal(): ", inchars); // no mantissa digits
  if (dotoff>=0)
   this.exp=(this.exp+dotoff)-d; // adjust exponent if had dot

  /* strip leading zeros/dot (leave final if all 0's) */
  {var $3=last-1;i=offset;i:for(;i<=$3;i++){
   si=inchars[i];
   if (si=='0')
    {
     offset++;
     dotoff--;
     d--;
    }
   else
    if (si=='.')
     {
      offset++; // step past dot
      dotoff--;
     }
    else
     if (si<='9')
      break i;/* non-0 */
     else
      {/* exotic */
       //if ((java.lang.Character.digit(si,10))!=0)
        break i; // non-0 or bad
       // is 0 .. strip like '0'
       //offset++;
       //dotoff--;
       //d--;
      }
   }
  }/*i*/

  /* Create the mantissa array */
  this.mant=new Array(d); // we know the length
  j=offset; // input offset
  if (exotic)
   {exotica:do{ // slow: check for exotica
    {var $4=d;i=0;i:for(;$4>0;$4--,i++){
     if (i==dotoff)
      j++; // at dot
     sj=inchars[j];
     if (sj<='9')
      this.mant[i]=sj-'0';/* easy */
     else
      {
       //dvalue=java.lang.Character.digit(sj,10);
       //if (dvalue<0)
        this.bad("BigDecimal(): ", inchars); // not a number after all
       //mant[i]=(byte)dvalue;
      }
     j++;
     }
    }/*i*/
   }while(false);}/*exotica*/
  else
   {simple:do{
    {var $5=d;i=0;i:for(;$5>0;$5--,i++){
     if (i==dotoff)
      j++;
     this.mant[i]=inchars[j]-'0';
     j++;
     }
    }/*i*/
   }while(false);}/*simple*/

  /* Looks good.  Set the sign indicator and form, as needed. */
  // Trailing zeros are preserved
  // The rule here for form is:
  //   If no E-notation, then request plain notation
  //   Otherwise act as though add(0,DEFAULT) and request scientific notation
  // [form is already PLAIN]
  if (this.mant[0]==0)
   {
    this.ind=this.iszero; // force to show zero
    // negative exponent is significant (e.g., -3 for 0.000) if plain
    if (this.exp>0)
     this.exp=0; // positive exponent can be ignored
    if (hadexp)
     { // zero becomes single digit from add
      this.mant=this.ZERO.mant;
      this.exp=0;
     }
   }
  else
   { // non-zero
    // [ind was set earlier]
    // now determine form
    if (hadexp)
     {
      this.form=MathContext.prototype.SCIENTIFIC;
      // 1999.06.29 check for overflow
      mag=(this.exp+this.mant.length)-1; // true exponent in scientific notation
      if ((mag<this.MinExp)||(mag>this.MaxExp))
       this.bad("BigDecimal(): ", inchars);
     }
   }
  // say 'BD(c[]): mant[0] mantlen exp ind form:' mant[0] mant.length exp ind form
  return;
  }

 /**
  * Constructs a <code>BigDecimal</code> object directly from a
  * <code>double</code>.
  * <p>
  * Constructs a <code>BigDecimal</code> which is the exact decimal
  * representation of the 64-bit signed binary floating point
  * parameter.
  * <p>
  * Note that this constructor it an exact conversion; it does not give
  * the same result as converting <code>num</code> to a
  * <code>String</code> using the <code>Double.toString()</code> method
  * and then using the {@link #BigDecimal(java.lang.String)}
  * constructor.
  * To get that result, use the static {@link #valueOf(double)}
  * method to construct a <code>BigDecimal</code> from a
  * <code>double</code>.
  *
  * @param num The <code>double</code> to be converted.
  * @throws NumberFormatException if the parameter is infinite or
  *            not a number.
  * @stable ICU 2.0
  */

 //--public BigDecimal(double num){
 //-- // 1999.03.06: use exactly the old algorithm
 //-- // 2000.01.01: note that this constructor does give an exact result,
 //-- //             so perhaps it should not be deprecated
 //-- // 2000.06.18: no longer deprecated
 //-- this((new java.math.BigDecimal(num)).toString());
 //-- return;}

 /**
  * Constructs a <code>BigDecimal</code> object directly from a
  * <code>int</code>.
  * <p>
  * Constructs a <code>BigDecimal</code> which is the exact decimal
  * representation of the 32-bit signed binary integer parameter.
  * The <code>BigDecimal</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the parameter is
  * negative.
  * A leading zero will be present only if the parameter is zero.
  *
  * @param num The <code>int</code> to be converted.
  * @stable ICU 2.0
  */

 //--public BigDecimal(int num){super();
 //-- int mun;
 //-- int i=0;
 //-- // We fastpath commoners
 //-- if (num<=9)
 //--  if (num>=(-9))
 //--   {singledigit:do{
 //--    // very common single digit case
 //--    {/*select*/
 //--    if (num==0)
 //--     {
 //--      mant=ZERO.mant;
 //--      ind=iszero;
 //--     }
 //--    else if (num==1)
 //--     {
 //--      mant=ONE.mant;
 //--      ind=ispos;
 //--     }
 //--    else if (num==(-1))
 //--     {
 //--      mant=ONE.mant;
 //--      ind=isneg;
 //--     }
 //--    else{
 //--     {
 //--      mant=new byte[1];
 //--      if (num>0)
 //--       {
 //--        mant[0]=(byte)num;
 //--        ind=ispos;
 //--       }
 //--      else
 //--       { // num<-1
 //--        mant[0]=(byte)((int)-num);
 //--        ind=isneg;
 //--       }
 //--     }
 //--    }
 //--    }
 //--    return;
 //--   }while(false);}/*singledigit*/
 //--
 //-- /* We work on negative numbers so we handle the most negative number */
 //-- if (num>0)
 //--  {
 //--   ind=ispos;
 //--   num=(int)-num;
 //--  }
 //-- else
 //--  ind=isneg;/* negative */ // [0 case already handled]
 //-- // [it is quicker, here, to pre-calculate the length with
 //-- // one loop, then allocate exactly the right length of byte array,
 //-- // then re-fill it with another loop]
 //-- mun=num; // working copy
 //-- {i=9;i:for(;;i--){
 //--  mun=mun/10;
 //--  if (mun==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- // i is the position of the leftmost digit placed
 //-- mant=new byte[10-i];
 //-- {i=(10-i)-1;i:for(;;i--){
 //--  mant[i]=(byte)-(((byte)(num%10)));
 //--  num=num/10;
 //--  if (num==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- return;
 //-- }

 /**
  * Constructs a <code>BigDecimal</code> object directly from a
  * <code>long</code>.
  * <p>
  * Constructs a <code>BigDecimal</code> which is the exact decimal
  * representation of the 64-bit signed binary integer parameter.
  * The <code>BigDecimal</code> will contain only decimal digits,
  * prefixed with a leading minus sign (hyphen) if the parameter is
  * negative.
  * A leading zero will be present only if the parameter is zero.
  *
  * @param num The <code>long</code> to be converted.
  * @stable ICU 2.0
  */

 //--public BigDecimal(long num){super();
 //-- long mun;
 //-- int i=0;
 //-- // Not really worth fastpathing commoners in this constructor [also,
 //-- // we use this to construct the static constants].
 //-- // This is much faster than: this(String.valueOf(num).toCharArray())
 //-- /* We work on negative num so we handle the most negative number */
 //-- if (num>0)
 //--  {
 //--   ind=ispos;
 //--   num=(long)-num;
 //--  }
 //-- else
 //--  if (num==0)
 //--   ind=iszero;
 //--  else
 //--   ind=isneg;/* negative */
 //-- mun=num;
 //-- {i=18;i:for(;;i--){
 //--  mun=mun/10;
 //--  if (mun==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- // i is the position of the leftmost digit placed
 //-- mant=new byte[19-i];
 //-- {i=(19-i)-1;i:for(;;i--){
 //--  mant[i]=(byte)-(((byte)(num%10)));
 //--  num=num/10;
 //--  if (num==0)
 //--   break i;
 //--  }
 //-- }/*i*/
 //-- return;
 //-- }

 /**
  * Constructs a <code>BigDecimal</code> object from a <code>String</code>.
  * <p>
  * Constructs a <code>BigDecimal</code> from the parameter, which must
  * not be <code>null</code> and must represent a valid <i>number</i>,
  * as described formally in the documentation referred to
  * {@link BigDecimal above}.
  * <p>
  * In summary, numbers in <code>String</code> form must have at least
  * one digit, may have a leading sign, may have a decimal point, and
  * exponential notation may be used.  They follow conventional syntax,
  * and may not contain blanks.
  * <p>
  * Some valid strings from which a <code>BigDecimal</code> might
  * be constructed are:
  * <pre>
  *       "0"         -- Zero
  *      "12"         -- A whole number
  *     "-76"         -- A signed whole number
  *      "12.70"      -- Some decimal places
  *     "+0.003"      -- Plus sign is allowed
  *      "17."        -- The same as 17
  *        ".5"       -- The same as 0.5
  *      "4E+9"       -- Exponential notation
  *       "0.73e-7"   -- Exponential notation
  * </pre>
  * <p>
  * (Exponential notation means that the number includes an optional
  * sign and a power of ten following an '</code>E</code>' that
  * indicates how the decimal point will be shifted.  Thus the
  * <code>"4E+9"</code> above is just a short way of writing
  * <code>4000000000</code>, and the <code>"0.73e-7"</code> is short
  * for <code>0.000000073</code>.)
  * <p>
  * The <code>BigDecimal</code> constructed from the String is in a
  * standard form, with no blanks, as though the
  * {@link #add(BigDecimal)} method had been used to add zero to the
  * number with unlimited precision.
  * If the string uses exponential notation (that is, includes an
  * <code>e</code> or an <code>E</code>), then the
  * <code>BigDecimal</code> number will be expressed in scientific
  * notation (where the power of ten is adjusted so there is a single
  * non-zero digit to the left of the decimal point); in this case if
  * the number is zero then it will be expressed as the single digit 0,
  * and if non-zero it will have an exponent unless that exponent would
  * be 0.  The exponent must fit in nine digits both before and after it
  * is expressed in scientific notation.
  * <p>
  * Any digits in the parameter must be decimal; that is,
  * <code>Character.digit(c, 10)</code> (where </code>c</code> is the
  * character in question) would not return -1.
  *
  * @param string The <code>String</code> to be converted.
  * @throws NumberFormatException if the parameter is not a valid
  * number.
  * @stable ICU 2.0
  */

 //--public BigDecimal(java.lang.String string){
 //-- this(string.toCharArray(),0,string.length());
 //-- return;}

 /* <sgml> Make a default BigDecimal object for local use. </sgml> */

 //--private BigDecimal(){super();
 //-- return;
 //-- }

 /* ---------------------------------------------------------------- */
 /* Operator methods [methods which take a context parameter]        */
 /* ---------------------------------------------------------------- */

 /**
  * Returns a plain <code>BigDecimal</code> whose value is the absolute
  * value of this <code>BigDecimal</code>.
  * <p>
  * The same as {@link #abs(MathContext)}, where the context is
  * <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will
  * be <code>this.scale()</code>
  *
  * @return A <code>BigDecimal</code> whose value is the absolute
  *         value of this <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal abs(){
 //- return this.abs(plainMC);
 //- }

 /**
  * Returns a <code>BigDecimal</code> whose value is the absolute value
  * of this <code>BigDecimal</code>.
  * <p>
  * If the current object is zero or positive, then the same result as
  * invoking the {@link #plus(MathContext)} method with the same
  * parameter is returned.
  * Otherwise, the same result as invoking the
  * {@link #negate(MathContext)} method with the same parameter is
  * returned.
  *
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is the absolute
  *             value of this <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal abs(com.ibm.icu.math.MathContext set){
 function abs() {
  var set;
  if (abs.arguments.length == 1)
   {
    set = abs.arguments[0];
   }
  else if (abs.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "abs(): " + abs.arguments.length + " arguments given; expected 0 or 1";
   }
  if (this.ind==this.isneg)
   return this.negate(set);
  return this.plus(set);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this+rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #add(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the maximum of the scales of the two operands.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the addition.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this+rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal add(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.add(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>this+rhs</code>.
  * <p>
  * Implements the addition (<b><code>+</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the addition.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this+rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal add(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function add() {
  var set;
  if (add.arguments.length == 2)
   {
    set = add.arguments[1];
   }
  else if (add.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "add(): " + add.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = add.arguments[0];
  //--com.ibm.icu.math.BigDecimal lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  //--byte usel[];
  var usel;
  //--int usellen;
  var usellen;
  //--byte user[];
  var user;
  //--int userlen;
  var userlen;
  //--int newlen=0;
  var newlen=0;
  //--int tlen=0;
  var tlen=0;
  //--int mult=0;
  var mult=0;
  //--byte t[]=null;
  var t=null;
  //--int ia=0;
  var ia=0;
  //--int ib=0;
  var ib=0;
  //--int ea=0;
  var ea=0;
  //int eb=0;
  var eb=0;
  //byte ca=0;
  var ca=0;
  //--byte cb=0;
  var cb=0;
  /* determine requested digits and form */
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity and proxy

  /* Quick exit for add floating 0 */
  // plus() will optimize to return same object if possible
  if (lhs.ind==0)
   if (set.form!=MathContext.prototype.PLAIN)
    return rhs.plus(set);
  if (rhs.ind==0)
   if (set.form!=MathContext.prototype.PLAIN)
    return lhs.plus(set);

  /* Prepare numbers (round, unless unlimited precision) */
  reqdig=set.digits; // local copy (heavily used)
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   // [we could reuse the new LHS for result in this case]
   }

  res=new BigDecimal(); // build result here

  /* Now see how much we have to pad or truncate lhs or rhs in order
     to align the numbers.  If one number is much larger than the
     other, then the smaller cannot affect the answer [but we may
     still need to pad with up to DIGITS trailing zeros]. */
  // Note sign may be 0 if digits (reqdig) is 0
  // usel and user will be the byte arrays passed to the adder; we'll
  // use them on all paths except quick exits
  usel=lhs.mant;
  usellen=lhs.mant.length;
  user=rhs.mant;
  userlen=rhs.mant.length;
  {padder:do{/*select*/
  if (lhs.exp==rhs.exp)
   {/* no padding needed */
    // This is the most common, and fastest, path
    res.exp=lhs.exp;
   }
  else if (lhs.exp>rhs.exp)
   { // need to pad lhs and/or truncate rhs
    newlen=(usellen+lhs.exp)-rhs.exp;
    /* If, after pad, lhs would be longer than rhs by digits+1 or
       more (and digits>0) then rhs cannot affect answer, so we only
       need to pad up to a length of DIGITS+1. */
    if (newlen>=((userlen+reqdig)+1))
     if (reqdig>0)
      {
       // LHS is sufficient
       res.mant=usel;
       res.exp=lhs.exp;
       res.ind=lhs.ind;
       if (usellen<reqdig)
        { // need 0 padding
         res.mant=this.extend(lhs.mant,reqdig);
         res.exp=res.exp-((reqdig-usellen));
        }
       return res.finish(set,false);
      }
    // RHS may affect result
    res.exp=rhs.exp; // expected final exponent
    if (newlen>(reqdig+1))
     if (reqdig>0)
      {
       // LHS will be max; RHS truncated
       tlen=(newlen-reqdig)-1; // truncation length
       userlen=userlen-tlen;
       res.exp=res.exp+tlen;
       newlen=reqdig+1;
      }
    if (newlen>usellen)
     usellen=newlen; // need to pad LHS
   }
  else{ // need to pad rhs and/or truncate lhs
   newlen=(userlen+rhs.exp)-lhs.exp;
   if (newlen>=((usellen+reqdig)+1))
    if (reqdig>0)
     {
      // RHS is sufficient
      res.mant=user;
      res.exp=rhs.exp;
      res.ind=rhs.ind;
      if (userlen<reqdig)
       { // need 0 padding
        res.mant=this.extend(rhs.mant,reqdig);
        res.exp=res.exp-((reqdig-userlen));
       }
      return res.finish(set,false);
     }
   // LHS may affect result
   res.exp=lhs.exp; // expected final exponent
   if (newlen>(reqdig+1))
    if (reqdig>0)
     {
      // RHS will be max; LHS truncated
      tlen=(newlen-reqdig)-1; // truncation length
      usellen=usellen-tlen;
      res.exp=res.exp+tlen;
      newlen=reqdig+1;
     }
   if (newlen>userlen)
    userlen=newlen; // need to pad RHS
  }
  }while(false);}/*padder*/

  /* OK, we have aligned mantissas.  Now add or subtract. */
  // 1998.06.27 Sign may now be 0 [e.g., 0.000] .. treat as positive
  // 1999.05.27 Allow for 00 on lhs [is not larger than 2 on rhs]
  // 1999.07.10 Allow for 00 on rhs [is not larger than 2 on rhs]
  if (lhs.ind==this.iszero)
   res.ind=this.ispos;
  else
   res.ind=lhs.ind; // likely sign, all paths
  if (((lhs.ind==this.isneg)?1:0)==((rhs.ind==this.isneg)?1:0))  // same sign, 0 non-negative
   mult=1;
  else
   {signdiff:do{ // different signs, so subtraction is needed
    mult=-1; // will cause subtract
    /* Before we can subtract we must determine which is the larger,
       as our add/subtract routine only handles non-negative results
       so we may need to swap the operands. */
    {swaptest:do{/*select*/
    if (rhs.ind==this.iszero)
     {} // original A bigger
    else if ((usellen<userlen)||(lhs.ind==this.iszero))
     { // original B bigger
      t=usel;
      usel=user;
      user=t; // swap
      tlen=usellen;
      usellen=userlen;
      userlen=tlen; // ..
      res.ind=-res.ind; // and set sign
     }
    else if (usellen>userlen)
     {} // original A bigger
    else{
     {/* logical lengths the same */ // need compare
      /* may still need to swap: compare the strings */
      ia=0;
      ib=0;
      ea=usel.length-1;
      eb=user.length-1;
      {compare:for(;;){
       if (ia<=ea)
        ca=usel[ia];
       else
        {
         if (ib>eb)
          {/* identical */
           if (set.form!=MathContext.prototype.PLAIN)
            return this.ZERO;
           // [if PLAIN we must do the subtract, in case of 0.000 results]
           break compare;
          }
         ca=0;
        }
       if (ib<=eb)
        cb=user[ib];
       else
        cb=0;
       if (ca!=cb)
        {
         if (ca<cb)
          {/* swap needed */
           t=usel;
           usel=user;
           user=t; // swap
           tlen=usellen;
           usellen=userlen;
           userlen=tlen; // ..
           res.ind=-res.ind;
          }
         break compare;
        }
       /* mantissas the same, so far */
       ia++;
       ib++;
       }
      }/*compare*/
     } // lengths the same
    }
    }while(false);}/*swaptest*/
   }while(false);}/*signdiff*/

  /* here, A is > B if subtracting */
  // add [A+B*1] or subtract [A+(B*-1)]
  res.mant=this.byteaddsub(usel,usellen,user,userlen,mult,false);
  // [reuse possible only after chop; accounting makes not worthwhile]

  // Finish() rounds before stripping leading 0's, then sets form, etc.
  return res.finish(set,false);
  }

 /**
  * Compares this <code>BigDecimal</code> to another, using unlimited
  * precision.
  * <p>
  * The same as {@link #compareTo(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @see    #compareTo(Object)
  * @stable ICU 2.0
  */

 //--public int compareTo(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.compareTo(rhs,plainMC);
 //-- }

 /**
  * Compares this <code>BigDecimal</code> to another.
  * <p>
  * Implements numeric comparison,
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns a result of type <code>int</code>.
  * <p>
  * The result will be:
  * <table cellpadding=2><tr>
  * <td align=right><b>-1</b></td>
  * <td>if the current object is less than the first parameter</td>
  * </tr><tr>
  * <td align=right><b>0</b></td>
  * <td>if the current object is equal to the first parameter</td>
  * </tr><tr>
  * <td align=right><b>1</b></td>
  * <td>if the current object is greater than the first parameter.</td>
  * </tr></table>
  * <p>
  * A {@link #compareTo(Object)} method is also provided.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @see    #compareTo(Object)
  * @stable ICU 2.0
  */

 //public int compareTo(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function compareTo() {
  var set;
  if (compareTo.arguments.length == 2)
   {
    set = compareTo.arguments[1];
   }
  else if (compareTo.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "compareTo(): " + compareTo.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = compareTo.arguments[0];
  //--int thislength=0;
  var thislength=0;
  //--int i=0;
  var i=0;
  //--com.ibm.icu.math.BigDecimal newrhs;
  var newrhs;
  // rhs=null will raise NullPointerException, as per Comparable interface
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  // [add will recheck in slowpath cases .. but would report -rhs]
  if ((this.ind==rhs.ind)&&(this.exp==rhs.exp))
   {
    /* sign & exponent the same [very common] */
    thislength=this.mant.length;
    if (thislength<rhs.mant.length)
     return -this.ind;
    if (thislength>rhs.mant.length)
     return this.ind;
    /* lengths are the same; we can do a straight mantissa compare
       unless maybe rounding [rounding is very unusual] */
    if ((thislength<=set.digits)||(set.digits==0))
     {
      {var $6=thislength;i=0;i:for(;$6>0;$6--,i++){
       if (this.mant[i]<rhs.mant[i])
        return -this.ind;
       if (this.mant[i]>rhs.mant[i])
        return this.ind;
       }
      }/*i*/
      return 0; // identical
     }
   /* drop through for full comparison */
   }
  else
   {
    /* More fastpaths possible */
    if (this.ind<rhs.ind)
     return -1;
    if (this.ind>rhs.ind)
     return 1;
   }
  /* carry out a subtract to make the comparison */
  newrhs=this.clone(rhs); // safe copy
  newrhs.ind=-newrhs.ind; // prepare to subtract
  return this.add(newrhs,set).ind; // add, and return sign of result
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #divide(BigDecimal, int)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the rounding mode is {@link MathContext#ROUND_HALF_UP}.
  *
  * The length of the decimal part (the scale) of the result will be
  * the same as the scale of the current object, if the latter were
  * formatted without exponential notation.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the division.
  * @return     A plain <code>BigDecimal</code> whose value is
  *             <code>this/rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divide(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.dodivide('D',rhs,plainMC,-1);
 //-- }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic and a
  * rounding mode.
  * <p>
  * The same as {@link #divide(BigDecimal, int, int)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the second parameter is <code>this.scale()</code>, and
  * the third is <code>round</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will
  * therefore be the same as the scale of the current object, if the
  * latter were formatted without exponential notation.
  * <p>
  * @param  rhs   The <code>BigDecimal</code> for the right hand side of
  *               the division.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link MathContext} class).
  * @return       A plain <code>BigDecimal</code> whose value is
  *               <code>this/rhs</code>, using fixed point arithmetic
  *               and the specified rounding mode.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if <code>round</code> is {@link
  *               MathContext#ROUND_UNNECESSARY} and
  *               <code>this.scale()</code> is insufficient to
  *               represent the result exactly.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divide(com.ibm.icu.math.BigDecimal rhs,int round){
 //-- com.ibm.icu.math.MathContext set;
 //-- set=new com.ibm.icu.math.MathContext(0,com.ibm.icu.math.MathContext.PLAIN,false,round); // [checks round, too]
 //-- return this.dodivide('D',rhs,set,-1); // take scale from LHS
 //-- }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this/rhs</code>, using fixed point arithmetic and a
  * given scale and rounding mode.
  * <p>
  * The same as {@link #divide(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * <code>new MathContext(0, MathContext.PLAIN, false, round)</code>,
  * except that the length of the decimal part (the scale) to be used
  * for the result is explicit rather than being taken from
  * <code>this</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the same as the scale of the current object, if the latter were
  * formatted without exponential notation.
  * <p>
  * @param  rhs   The <code>BigDecimal</code> for the right hand side of
  *               the division.
  * @param  scale The <code>int</code> scale to be used for the result.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link MathContext} class).
  * @return       A plain <code>BigDecimal</code> whose value is
  *               <code>this/rhs</code>, using fixed point arithmetic
  *               and the specified rounding mode.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if <code>round</code> is {@link
  *               MathContext#ROUND_UNNECESSARY} and <code>scale</code>
  *               is insufficient to represent the result exactly.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divide(com.ibm.icu.math.BigDecimal rhs,int scale,int round){
 //-- com.ibm.icu.math.MathContext set;
 //-- if (scale<0)
 //--  throw new java.lang.ArithmeticException("Negative scale:"+" "+scale);
 //-- set=new com.ibm.icu.math.MathContext(0,com.ibm.icu.math.MathContext.PLAIN,false,round); // [checks round]
 //-- return this.dodivide('D',rhs,set,scale);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>this/rhs</code>.
  * <p>
  * Implements the division (<b><code>/</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the division.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divide(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function divide() {
  var set;
  var scale = -1;
  if (divide.arguments.length == 2)
   {
    if (typeof divide.arguments[1] == 'number')
     {
      set=new MathContext(0,MathContext.prototype.PLAIN,false,divide.arguments[1]); // [checks round, too]
     }
    else
     {
      set = divide.arguments[1];
     }
   }
  else if (divide.arguments.length == 3)
   {
    scale = divide.arguments[1];
    if (scale<0)
     throw "divide(): Negative scale: "+scale;
    set=new MathContext(0,MathContext.prototype.PLAIN,false,divide.arguments[2]); // [checks round]
   }
  else if (divide.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "divide(): " + divide.arguments.length + " arguments given; expected between 1 and 3";
   }
  var rhs = divide.arguments[0];
  return this.dodivide('D',rhs,set,scale);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is the integer
  * part of <code>this/rhs</code>.
  * <p>
  * The same as {@link #divideInteger(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the integer division.
  * @return     A <code>BigDecimal</code> whose value is the integer
  *             part of <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divideInteger(com.ibm.icu.math.BigDecimal rhs){
 //-- // scale 0 to drop .000 when plain
 //-- return this.dodivide('I',rhs,plainMC,0);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is the integer
  * part of <code>this/rhs</code>.
  * <p>
  * Implements the integer division operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the integer division.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is the integer
  *             part of <code>this/rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if the result will not fit in the
  *             number of digits specified for the context.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal divideInteger(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function divideInteger() {
  var set;
  if (divideInteger.arguments.length == 2)
   {
    set = divideInteger.arguments[1];
   }
  else if (divideInteger.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "divideInteger(): " + divideInteger.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = divideInteger.arguments[0];
  // scale 0 to drop .000 when plain
  return this.dodivide('I',rhs,set,0);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * the maximum of <code>this</code> and <code>rhs</code>.
  * <p>
  * The same as {@link #max(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @return     A <code>BigDecimal</code> whose value is
  *             the maximum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal max(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.max(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is
  * the maximum of <code>this</code> and <code>rhs</code>.
  * <p>
  * Returns the larger of the current object and the first parameter.
  * <p>
  * If calling the {@link #compareTo(BigDecimal, MathContext)} method
  * with the same parameters would return <code>1</code> or
  * <code>0</code>, then the result of calling the
  * {@link #plus(MathContext)} method on the current object (using the
  * same <code>MathContext</code> parameter) is returned.
  * Otherwise, the result of calling the {@link #plus(MathContext)}
  * method on the first parameter object (using the same
  * <code>MathContext</code> parameter) is returned.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             the maximum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal max(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function max() {
  var set;
  if (max.arguments.length == 2)
   {
    set = max.arguments[1];
   }
  else if (max.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "max(): " + max.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = max.arguments[0];
  if ((this.compareTo(rhs,set))>=0)
   return this.plus(set);
  else
   return rhs.plus(set);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * the minimum of <code>this</code> and <code>rhs</code>.
  * <p>
  * The same as {@link #min(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @return     A <code>BigDecimal</code> whose value is
  *             the minimum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal min(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.min(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is
  * the minimum of <code>this</code> and <code>rhs</code>.
  * <p>
  * Returns the smaller of the current object and the first parameter.
  * <p>
  * If calling the {@link #compareTo(BigDecimal, MathContext)} method
  * with the same parameters would return <code>-1</code> or
  * <code>0</code>, then the result of calling the
  * {@link #plus(MathContext)} method on the current object (using the
  * same <code>MathContext</code> parameter) is returned.
  * Otherwise, the result of calling the {@link #plus(MathContext)}
  * method on the first parameter object (using the same
  * <code>MathContext</code> parameter) is returned.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the comparison.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             the minimum of <code>this</code> and <code>rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal min(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function min() {
  var set;
  if (min.arguments.length == 2)
   {
    set = min.arguments[1];
   }
  else if (min.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "min(): " + min.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = min.arguments[0];
  if ((this.compareTo(rhs,set))<=0)
   return this.plus(set);
  else
   return rhs.plus(set);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this*rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #add(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the sum of the scales of the operands, if they were formatted
  * without exponential notation.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the multiplication.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this*rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal multiply(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.multiply(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>this*rhs</code>.
  * <p>
  * Implements the multiplication (<b><code>*</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the multiplication.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this*rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal multiply(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function multiply() {
  var set;
  if (multiply.arguments.length == 2)
   {
    set = multiply.arguments[1];
   }
  else if (multiply.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "multiply(): " + multiply.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = multiply.arguments[0];
  //--com.ibm.icu.math.BigDecimal lhs;
  var lhs;
  //--int padding;
  var padding;
  //--int reqdig;
  var reqdig;
  //--byte multer[]=null;
  var multer=null;
  //--byte multand[]=null;
  var multand=null;
  //--int multandlen;
  var multandlen;
  //--int acclen=0;
  var acclen=0;
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  //--byte acc[];
  var acc;
  //--int n=0;
  var n=0;
  //--byte mult=0;
  var mult=0;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity and proxy

  /* Prepare numbers (truncate, unless unlimited precision) */
  padding=0; // trailing 0's to add
  reqdig=set.digits; // local copy
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   // [we could reuse the new LHS for result in this case]
   }
  else
   {/* unlimited */
    // fixed point arithmetic will want every trailing 0; we add these
    // after the calculation rather than before, for speed.
    if (lhs.exp>0)
     padding=padding+lhs.exp;
    if (rhs.exp>0)
     padding=padding+rhs.exp;
   }

  // For best speed, as in DMSRCN, we use the shorter number as the
  // multiplier and the longer as the multiplicand.
  // 1999.12.22: We used to special case when the result would fit in
  //             a long, but with Java 1.3 this gave no advantage.
  if (lhs.mant.length<rhs.mant.length)
   {
    multer=lhs.mant;
    multand=rhs.mant;
   }
  else
   {
    multer=rhs.mant;
    multand=lhs.mant;
   }

  /* Calculate how long result byte array will be */
  multandlen=(multer.length+multand.length)-1; // effective length
  // optimize for 75% of the cases where a carry is expected...
  if ((multer[0]*multand[0])>9)
   acclen=multandlen+1;
  else
   acclen=multandlen;

  /* Now the main long multiplication loop */
  res=new BigDecimal(); // where we'll build result
  acc=this.createArrayWithZeros(acclen); // accumulator, all zeros
  // 1998.07.01: calculate from left to right so that accumulator goes
  // to likely final length on first addition; this avoids a one-digit
  // extension (and object allocation) each time around the loop.
  // Initial number therefore has virtual zeros added to right.
  {var $7=multer.length;n=0;n:for(;$7>0;$7--,n++){
   mult=multer[n];
   if (mult!=0)
    { // [optimization]
     // accumulate [accumulator is reusable array]
     acc=this.byteaddsub(acc,acc.length,multand,multandlen,mult,true);
    }
   // divide multiplicand by 10 for next digit to right
   multandlen--; // 'virtual length'
   }
  }/*n*/

  res.ind=lhs.ind*rhs.ind; // final sign
  res.exp=(lhs.exp+rhs.exp)-padding; // final exponent
  // [overflow is checked by finish]

  /* add trailing zeros to the result, if necessary */
  if (padding==0)
   res.mant=acc;
  else
   res.mant=this.extend(acc,acc.length+padding); // add trailing 0s
  return res.finish(set,false);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>-this</code>.
  * <p>
  * The same as {@link #negate(MathContext)}, where the context is
  * <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * be <code>this.scale()</code>
  *
  *
  * @return A <code>BigDecimal</code> whose value is
  *         <code>-this</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal negate(){
 //-- return this.negate(plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>-this</code>.
  * <p>
  * Implements the negation (Prefix <b><code>-</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return A <code>BigDecimal</code> whose value is
  *         <code>-this</code>.
  * @stable ICU 2.0
  */

 //public com.ibm.icu.math.BigDecimal negate(com.ibm.icu.math.MathContext set){
 function negate() {
  var set;
  if (negate.arguments.length == 1)
   {
    set = negate.arguments[0];
   }
  else if (negate.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "negate(): " + negate.arguments.length + " arguments given; expected 0 or 1";
   }
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  // Originally called minus(), changed to matched Java precedents
  // This simply clones, flips the sign, and possibly rounds
  if (set.lostDigits)
   this.checkdigits(null,set.digits);
  res=this.clone(this); // safe copy
  res.ind=-res.ind;
  return res.finish(set,false);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>+this</code>.
  * Note that <code>this</code> is not necessarily a
  * plain <code>BigDecimal</code>, but the result will always be.
  * <p>
  * The same as {@link #plus(MathContext)}, where the context is
  * <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * be <code>this.scale()</code>
  *
  * @return A <code>BigDecimal</code> whose value is
  *         <code>+this</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal plus(){
 //-- return this.plus(plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is
  * <code>+this</code>.
  * <p>
  * Implements the plus (Prefix <b><code>+</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  * <p>
  * This method is useful for rounding or otherwise applying a context
  * to a decimal value.
  *
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return A <code>BigDecimal</code> whose value is
  *         <code>+this</code>.
  * @stable ICU 2.0
  */

 //public com.ibm.icu.math.BigDecimal plus(com.ibm.icu.math.MathContext set){
 function plus() {
  var set;
  if (plus.arguments.length == 1)
   {
    set = plus.arguments[0];
   }
  else if (plus.arguments.length == 0)
   {
    set = this.plainMC;
   }
  else
   {
    throw "plus(): " + plus.arguments.length + " arguments given; expected 0 or 1";
   }
  // This clones and forces the result to the new settings
  // May return same object
  if (set.lostDigits)
   this.checkdigits(null,set.digits);
  // Optimization: returns same object for some common cases
  if (set.form==MathContext.prototype.PLAIN)
   if (this.form==MathContext.prototype.PLAIN)
    {
     if (this.mant.length<=set.digits)
      return this;
     if (set.digits==0)
      return this;
    }
  return this.clone(this).finish(set,false);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this**rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #pow(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The parameter is the power to which the <code>this</code> will be
  * raised; it must be in the range 0 through 999999999, and must
  * have a decimal part of zero.  Note that these restrictions may be
  * removed in the future, so they should not be used as a test for a
  * whole number.
  * <p>
  * In addition, the power must not be negative, as no
  * <code>MathContext</code> is used and so the result would then
  * always be 0.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the operation (the power).
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this**rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is out of range or
  *             is not a whole number.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal pow(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.pow(rhs,plainMC);
 //-- }
 // The name for this method is inherited from the precedent set by the
 // BigInteger and Math classes.

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>this**rhs</code>.
  * <p>
  * Implements the power (<b><code>**</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  * <p>
  * The first parameter is the power to which the <code>this</code>
  * will be raised; it must be in the range -999999999 through
  * 999999999, and must have a decimal part of zero.  Note that these
  * restrictions may be removed in the future, so they should not be
  * used as a test for a whole number.
  * <p>
  * If the <code>digits</code> setting of the <code>MathContext</code>
  * parameter is 0, the power must be zero or positive.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the operation (the power).
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this**rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is out of range or
  *             is not a whole number.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal pow(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function pow() {
  var set;
  if (pow.arguments.length == 2)
   {
    set = pow.arguments[1];
   }
  else if (pow.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "pow(): " + pow.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = pow.arguments[0];
  //--int n;
  var n;
  //--com.ibm.icu.math.BigDecimal lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //-- int workdigits=0;
  var workdigits=0;
  //--int L=0;
  var L=0;
  //--com.ibm.icu.math.MathContext workset;
  var workset;
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  //--boolean seenbit;
  var seenbit;
  //--int i=0;
  var i=0;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  n=rhs.intcheck(this.MinArg,this.MaxArg); // check RHS by the rules
  lhs=this; // clarified name

  reqdig=set.digits; // local copy (heavily used)
  if (reqdig==0)
   {
    if (rhs.ind==this.isneg)
     //--throw new java.lang.ArithmeticException("Negative power:"+" "+rhs.toString());
     throw "pow(): Negative power: " + rhs.toString();
    workdigits=0;
   }
  else
   {/* non-0 digits */
    if ((rhs.mant.length+rhs.exp)>reqdig)
     //--throw new java.lang.ArithmeticException("Too many digits:"+" "+rhs.toString());
     throw "pow(): Too many digits: " + rhs.toString();

    /* Round the lhs to DIGITS if need be */
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);

    /* L for precision calculation [see ANSI X3.274-1996] */
    L=rhs.mant.length+rhs.exp; // length without decimal zeros/exp
    workdigits=(reqdig+L)+1; // calculate the working DIGITS
   }

  /* Create a copy of set for working settings */
  // Note: no need to check for lostDigits again.
  // 1999.07.17 Note: this construction must follow RHS check
  workset=new MathContext(workdigits,set.form,false,set.roundingMode);

  res=this.ONE; // accumulator
  if (n==0)
   return res; // x**0 == 1
  if (n<0)
   n=-n; // [rhs.ind records the sign]
  seenbit=false; // set once we've seen a 1-bit
  {i=1;i:for(;;i++){ // for each bit [top bit ignored]
   //n=n+n; // shift left 1 bit
   n<<=1;
   if (n<0)
    { // top bit is set
     seenbit=true; // OK, we're off
     res=res.multiply(lhs,workset); // acc=acc*x
    }
   if (i==31)
    break i; // that was the last bit
   if ((!seenbit))
    continue i; // we don't have to square 1
   res=res.multiply(res,workset); // acc=acc*acc [square]
   }
  }/*i*/ // 32 bits
  if (rhs.ind<0)  // was a **-n [hence digits>0]
   res=this.ONE.divide(res,workset); // .. so acc=1/acc
  return res.finish(set,true); // round and strip [original digits]
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * the remainder of <code>this/rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #remainder(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * This is not the modulo operator -- the result may be negative.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the remainder operation.
  * @return     A <code>BigDecimal</code> whose value is the remainder
  *             of <code>this/rhs</code>, using fixed point arithmetic.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal remainder(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.dodivide('R',rhs,plainMC,-1);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is the remainder of
  * <code>this/rhs</code>.
  * <p>
  * Implements the remainder operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  * <p>
  * This is not the modulo operator -- the result may be negative.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the remainder operation.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is the remainder
  *             of <code>this+rhs</code>.
  * @throws ArithmeticException if <code>rhs</code> is zero.
  * @throws ArithmeticException if the integer part of the result will
  *             not fit in the number of digits specified for the
  *             context.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal remainder(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function remainder() {
  var set;
  if (remainder.arguments.length == 2)
   {
    set = remainder.arguments[1];
   }
  else if (remainder.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "remainder(): " + remainder.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = remainder.arguments[0];
  return this.dodivide('R',rhs,set,-1);
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose value is
  * <code>this-rhs</code>, using fixed point arithmetic.
  * <p>
  * The same as {@link #subtract(BigDecimal, MathContext)},
  * where the <code>BigDecimal</code> is <code>rhs</code>,
  * and the context is <code>new MathContext(0, MathContext.PLAIN)</code>.
  * <p>
  * The length of the decimal part (the scale) of the result will be
  * the maximum of the scales of the two operands.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the subtraction.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this-rhs</code>, using fixed point arithmetic.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal subtract(com.ibm.icu.math.BigDecimal rhs){
 //-- return this.subtract(rhs,plainMC);
 //-- }

 /**
  * Returns a <code>BigDecimal</code> whose value is <code>this-rhs</code>.
  * <p>
  * Implements the subtraction (<b><code>-</code></b>) operator
  * (as defined in the decimal documentation, see {@link BigDecimal
  * class header}),
  * and returns the result as a <code>BigDecimal</code> object.
  *
  * @param  rhs The <code>BigDecimal</code> for the right hand side of
  *             the subtraction.
  * @param  set The <code>MathContext</code> arithmetic settings.
  * @return     A <code>BigDecimal</code> whose value is
  *             <code>this-rhs</code>.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal subtract(com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set){
 function subtract() {
  var set;
  if (subtract.arguments.length == 2)
   {
    set = subtract.arguments[1];
   }
  else if (subtract.arguments.length == 1)
   {
    set = this.plainMC;
   }
  else
   {
    throw "subtract(): " + subtract.arguments.length + " arguments given; expected 1 or 2";
   }
  var rhs = subtract.arguments[0];
  //--com.ibm.icu.math.BigDecimal newrhs;
  var newrhs;
  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  // [add will recheck .. but would report -rhs]
  /* carry out the subtraction */
  // we could fastpath -0, but it is too rare.
  newrhs=this.clone(rhs); // safe copy
  newrhs.ind=-newrhs.ind; // prepare to subtract
  return this.add(newrhs,set); // arithmetic
  }

 /* ---------------------------------------------------------------- */
 /* Other methods                                                    */
 /* ---------------------------------------------------------------- */

 /**
  * Converts this <code>BigDecimal</code> to a <code>byte</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part or is
  * out of the possible range for a <code>byte</code> (8-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>byte</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a <code>byte</code>.
  * @stable ICU 2.0
  */

 //--public byte byteValueExact(){
 //-- int num;
 //-- num=this.intValueExact(); // will check decimal part too
 //-- if ((num>127)|(num<(-128)))
 //--  throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //-- return (byte)num;
 //-- }

 /**
  * Compares this <code>BigDecimal</code> with the value of the parameter.
  * <p>
  * If the parameter is <code>null</code>, or is not an instance of the
  * <code>BigDecimal</code> type, an exception is thrown.
  * Otherwise, the parameter is cast to type <code>BigDecimal</code>
  * and the result of the {@link #compareTo(BigDecimal)} method,
  * using the cast parameter, is returned.
  * <p>
  * The {@link #compareTo(BigDecimal, MathContext)} method should be
  * used when a <code>MathContext</code> is needed for the comparison.
  *
  * @param  rhs The <code>Object</code> for the right hand side of
  *             the comparison.
  * @return     An <code>int</code> whose value is -1, 0, or 1 as
  *             <code>this</code> is numerically less than, equal to,
  *             or greater than <code>rhs</code>.
  * @throws ClassCastException if <code>rhs</code> cannot be cast to
  *                 a <code>BigDecimal</code> object.
  * @see    #compareTo(BigDecimal)
  * @stable ICU 2.0
  */

 //--public int compareTo(java.lang.Object rhsobj){
 //-- // the cast in the next line will raise ClassCastException if necessary
 //-- return compareTo((com.ibm.icu.math.BigDecimal)rhsobj,plainMC);
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to a <code>double</code>.
  * If the <code>BigDecimal</code> is out of the possible range for a
  * <code>double</code> (64-bit signed floating point) result then an
  * <code>ArithmeticException</code> is thrown.
  * <p>
  * The double produced is identical to result of expressing the
  * <code>BigDecimal</code> as a <code>String</code> and then
  * converting it using the <code>Double(String)</code> constructor;
  * this can result in values of <code>Double.NEGATIVE_INFINITY</code>
  * or <code>Double.POSITIVE_INFINITY</code>.
  *
  * @return A <code>double</code> corresponding to <code>this</code>.
  * @stable ICU 2.0
  */

 //--public double doubleValue(){
 //-- // We go via a String [as does BigDecimal in JDK 1.2]
 //-- // Next line could possibly raise NumberFormatException
 //-- return java.lang.Double.valueOf(this.toString()).doubleValue();
 //-- }

 /**
  * Compares this <code>BigDecimal</code> with <code>rhs</code> for
  * equality.
  * <p>
  * If the parameter is <code>null</code>, or is not an instance of the
  * BigDecimal type, or is not exactly equal to the current
  * <code>BigDecimal</code> object, then <i>false</i> is returned.
  * Otherwise, <i>true</i> is returned.
  * <p>
  * "Exactly equal", here, means that the <code>String</code>
  * representations of the <code>BigDecimal</code> numbers are
  * identical (they have the same characters in the same sequence).
  * <p>
  * The {@link #compareTo(BigDecimal, MathContext)} method should be
  * used for more general comparisons.
  * @param  rhs The <code>Object</code> for the right hand side of
  *             the comparison.
  * @return     A <code>boolean</code> whose value <i>true</i> if and
  *             only if the operands have identical string representations.
  * @throws ClassCastException if <code>rhs</code> cannot be cast to
  *                 a <code>BigDecimal</code> object.
  * @stable ICU 2.0
  * @see    #compareTo(Object)
  * @see    #compareTo(BigDecimal)
  * @see    #compareTo(BigDecimal, MathContext)
  */

 //--public boolean equals(java.lang.Object obj){
 function equals(obj) {
  //--com.ibm.icu.math.BigDecimal rhs;
  var rhs;
  //--int i=0;
  var i=0;
  //--char lca[]=null;
  var lca=null;
  //--char rca[]=null;
  var rca=null;
  // We are equal iff toString of both are exactly the same
  if (obj==null)
   return false; // not equal
  if ((!(((obj instanceof BigDecimal)))))
   return false; // not a decimal
  rhs=obj; // cast; we know it will work
  if (this.ind!=rhs.ind)
   return false; // different signs never match
  if (((this.mant.length==rhs.mant.length)&&(this.exp==rhs.exp))&&(this.form==rhs.form))

   { // mantissas say all
    // here with equal-length byte arrays to compare
    {var $8=this.mant.length;i=0;i:for(;$8>0;$8--,i++){
     if (this.mant[i]!=rhs.mant[i])
      return false;
     }
    }/*i*/
   }
  else
   { // need proper layout
    lca=this.layout(); // layout to character array
    rca=rhs.layout();
    if (lca.length!=rca.length)
     return false; // mismatch
    // here with equal-length character arrays to compare
    {var $9=lca.length;i=0;i:for(;$9>0;$9--,i++){
     if (lca[i]!=rca[i])
      return false;
     }
    }/*i*/
   }
  return true; // arrays have identical content
  }

 /**
  * Converts this <code>BigDecimal</code> to a <code>float</code>.
  * If the <code>BigDecimal</code> is out of the possible range for a
  * <code>float</code> (32-bit signed floating point) result then an
  * <code>ArithmeticException</code> is thrown.
  * <p>
  * The float produced is identical to result of expressing the
  * <code>BigDecimal</code> as a <code>String</code> and then
  * converting it using the <code>Float(String)</code> constructor;
  * this can result in values of <code>Float.NEGATIVE_INFINITY</code>
  * or <code>Float.POSITIVE_INFINITY</code>.
  *
  * @return A <code>float</code> corresponding to <code>this</code>.
  * @stable ICU 2.0
  */

 //--public float floatValue(){
 //-- return java.lang.Float.valueOf(this.toString()).floatValue();
 //-- }

 /**
  * Returns the <code>String</code> representation of this
  * <code>BigDecimal</code>, modified by layout parameters.
  * <p>
  * <i>This method is provided as a primitive for use by more
  * sophisticated classes, such as <code>DecimalFormat</code>, that
  * can apply locale-sensitive editing of the result.  The level of
  * formatting that it provides is a necessary part of the BigDecimal
  * class as it is sensitive to and must follow the calculation and
  * rounding rules for BigDecimal arithmetic.
  * However, if the function is provided elsewhere, it may be removed
  * from this class. </i>
  * <p>
  * The parameters, for both forms of the <code>format</code> method
  * are all of type <code>int</code>.
  * A value of -1 for any parameter indicates that the default action
  * or value for that parameter should be used.
  * <p>
  * The parameters, <code>before</code> and <code>after</code>,
  * specify the number of characters to be used for the integer part
  * and decimal part of the result respectively.  Exponential notation
  * is not used. If either parameter is -1 (which indicates the default
  * action), the number of characters used will be exactly as many as
  * are needed for that part.
  * <p>
  * <code>before</code> must be a positive number; if it is larger than
  * is needed to contain the integer part, that part is padded on the
  * left with blanks to the requested length. If <code>before</code> is
  * not large enough to contain the integer part of the number
  * (including the sign, for negative numbers) an exception is thrown.
  * <p>
  * <code>after</code> must be a non-negative number; if it is not the
  * same size as the decimal part of the number, the number will be
  * rounded (or extended with zeros) to fit.  Specifying 0 for
  * <code>after</code> will cause the number to be rounded to an
  * integer (that is, it will have no decimal part or decimal point).
  * The rounding method will be the default,
  * <code>MathContext.ROUND_HALF_UP</code>.
  * <p>
  * Other rounding methods, and the use of exponential notation, can
  * be selected by using {@link #format(int,int,int,int,int,int)}.
  * Using the two-parameter form of the method has exactly the same
  * effect as using the six-parameter form with the final four
  * parameters all being -1.
  *
  * @param  before The <code>int</code> specifying the number of places
  *                before the decimal point.  Use -1 for 'as many as
  *                are needed'.
  * @param  after  The <code>int</code> specifying the number of places
  *                after the decimal point.  Use -1 for 'as many as are
  *                needed'.
  * @return        A <code>String</code> representing this
  *                <code>BigDecimal</code>, laid out according to the
  *                specified parameters
  * @throws ArithmeticException if the number cannot be laid out as
  *                requested.
  * @throws IllegalArgumentException if a parameter is out of range.
  * @stable ICU 2.0
  * @see    #toString
  * @see    #toCharArray
  */

 //--public java.lang.String format(int before,int after){
 //-- return format(before,after,-1,-1,com.ibm.icu.math.MathContext.SCIENTIFIC,ROUND_HALF_UP);
 //-- }

 /**
  * Returns the <code>String</code> representation of this
  * <code>BigDecimal</code>, modified by layout parameters and allowing
  * exponential notation.
  * <p>
  * <i>This method is provided as a primitive for use by more
  * sophisticated classes, such as <code>DecimalFormat</code>, that
  * can apply locale-sensitive editing of the result.  The level of
  * formatting that it provides is a necessary part of the BigDecimal
  * class as it is sensitive to and must follow the calculation and
  * rounding rules for BigDecimal arithmetic.
  * However, if the function is provided elsewhere, it may be removed
  * from this class. </i>
  * <p>
  * The parameters are all of type <code>int</code>.
  * A value of -1 for any parameter indicates that the default action
  * or value for that parameter should be used.
  * <p>
  * The first two parameters (<code>before</code> and
  * <code>after</code>) specify the number of characters to be used for
  * the integer part and decimal part of the result respectively, as
  * defined for {@link #format(int,int)}.
  * If either of these is -1 (which indicates the default action), the
  * number of characters used will be exactly as many as are needed for
  * that part.
  * <p>
  * The remaining parameters control the use of exponential notation
  * and rounding.  Three (<code>explaces</code>, <code>exdigits</code>,
  * and <code>exform</code>) control the exponent part of the result.
  * As before, the default action for any of these parameters may be
  * selected by using the value -1.
  * <p>
  * <code>explaces</code> must be a positive number; it sets the number
  * of places (digits after the sign of the exponent) to be used for
  * any exponent part, the default (when <code>explaces</code> is -1)
  * being to use as many as are needed.
  * If <code>explaces</code> is not -1, space is always reserved for
  * an exponent; if one is not needed (for example, if the exponent
  * will be 0) then <code>explaces</code>+2 blanks are appended to the
  * result.
  * <!-- (This preserves vertical alignment of similarly formatted
  *       numbers in a monospace font.) -->
  * If <code>explaces</code> is not -1 and is not large enough to
  * contain the exponent, an exception is thrown.
  * <p>
  * <code>exdigits</code> sets the trigger point for use of exponential
  * notation. If, before any rounding, the number of places needed
  * before the decimal point exceeds <code>exdigits</code>, or if the
  * absolute value of the result is less than <code>0.000001</code>,
  * then exponential form will be used, provided that
  * <code>exdigits</code> was specified.
  * When <code>exdigits</code> is -1, exponential notation will never
  * be used. If 0 is specified for <code>exdigits</code>, exponential
  * notation is always used unless the exponent would be 0.
  * <p>
  * <code>exform</code> sets the form for exponential notation (if
  * needed).
  * It  may be either {@link MathContext#SCIENTIFIC} or
  * {@link MathContext#ENGINEERING}.
  * If the latter, engineering, form is requested, up to three digits
  * (plus sign, if negative) may be needed for the integer part of the
  * result (<code>before</code>).  Otherwise, only one digit (plus
  * sign, if negative) is needed.
  * <p>
  * Finally, the sixth argument, <code>exround</code>, selects the
  * rounding algorithm to be used, and must be one of the values
  * indicated by a public constant in the {@link MathContext} class
  * whose name starts with <code>ROUND_</code>.
  * The default (<code>ROUND_HALF_UP</code>) may also be selected by
  * using the value -1, as before.
  * <p>
  * The special value <code>MathContext.ROUND_UNNECESSARY</code> may be
  * used to detect whether non-zero digits are discarded -- if
  * <code>exround</code> has this value than if non-zero digits would
  * be discarded (rounded) during formatting then an
  * <code>ArithmeticException</code> is thrown.
  *
  * @param  before   The <code>int</code> specifying the number of places
  *                  before the decimal point.
  *                  Use -1 for 'as many as are needed'.
  * @param  after    The <code>int</code> specifying the number of places
  *                  after the decimal point.
  *                  Use -1 for 'as many as are needed'.
  * @param  explaces The <code>int</code> specifying the number of places
  *                  to be used for any exponent.
  *                  Use -1 for 'as many as are needed'.
  * @param  exdigits The <code>int</code> specifying the trigger
  *                  (digits before the decimal point) which if
  *                  exceeded causes exponential notation to be used.
  *                  Use 0 to force exponential notation.
  *                  Use -1 to force plain notation (no exponential
  *                  notation).
  * @param  exform   The <code>int</code> specifying the form of
  *                  exponential notation to be used
  *                  ({@link MathContext#SCIENTIFIC} or
  *                  {@link MathContext#ENGINEERING}).
  * @param  exround  The <code>int</code> specifying the rounding mode
  *                  to use.
  *                  Use -1 for the default, {@link MathContext#ROUND_HALF_UP}.
  * @return          A <code>String</code> representing this
  *                  <code>BigDecimal</code>, laid out according to the
  *                  specified parameters
  * @throws ArithmeticException if the number cannot be laid out as
  *                  requested.
  * @throws IllegalArgumentException if a parameter is out of range.
  * @see    #toString
  * @see    #toCharArray
  * @stable ICU 2.0
  */

 //--public java.lang.String format(int before,int after,int explaces,int exdigits,int exformint,int exround){
 function format() {
  var explaces;
  var exdigits;
  var exformint;
  var exround;
  if (format.arguments.length == 6)
   {
    explaces = format.arguments[2];
    exdigits = format.arguments[3];
    exformint = format.arguments[4];
    exround = format.arguments[5];
   }
  else if (format.arguments.length == 2)
   {
    explaces = -1;
    exdigits = -1;
    exformint = MathContext.prototype.SCIENTIFIC;
    exround = this.ROUND_HALF_UP;
   }
  else
   {
    throw "format(): " + format.arguments.length + " arguments given; expected 2 or 6";
   }
  var before = format.arguments[0];
  var after = format.arguments[1];
  //--com.ibm.icu.math.BigDecimal num;
  var num;
  //--int mag=0;
  var mag=0;
  //--int thisafter=0;
  var thisafter=0;
  //--int lead=0;
  var lead=0;
  //--byte newmant[]=null;
  var newmant=null;
  //--int chop=0;
  var chop=0;
  //--int need=0;
  var need=0;
  //--int oldexp=0;
  var oldexp=0;
  //--char a[];
  var a;
  //--int p=0;
  var p=0;
  //--char newa[]=null;
  var newa=null;
  //--int i=0;
  var i=0;
  //--int places=0;
  var places=0;


  /* Check arguments */
  if ((before<(-1))||(before==0))
   this.badarg("format",1,before);
  if (after<(-1))
   this.badarg("format",2,after);
  if ((explaces<(-1))||(explaces==0))
   this.badarg("format",3,explaces);
  if (exdigits<(-1))
   this.badarg("format",4,exdigits);
  {/*select*/
  if (exformint==MathContext.prototype.SCIENTIFIC)
   {}
  else if (exformint==MathContext.prototype.ENGINEERING)
   {}
  else if (exformint==(-1))
   exformint=MathContext.prototype.SCIENTIFIC;
   // note PLAIN isn't allowed
  else{
   this.badarg("format",5,exformint);
  }
  }
  // checking the rounding mode is done by trying to construct a
  // MathContext object with that mode; it will fail if bad
  if (exround!=this.ROUND_HALF_UP)
   {try{ // if non-default...
    if (exround==(-1))
     exround=this.ROUND_HALF_UP;
    else
     new MathContext(9,MathContext.prototype.SCIENTIFIC,false,exround);
   }
   catch ($10){
    this.badarg("format",6,exround);
   }}

  num=this.clone(this); // make private copy

  /* Here:
     num       is BigDecimal to format
     before    is places before point [>0]
     after     is places after point  [>=0]
     explaces  is exponent places     [>0]
     exdigits  is exponent digits     [>=0]
     exformint is exponent form       [one of two]
     exround   is rounding mode       [one of eight]
     'before' through 'exdigits' are -1 if not specified
  */

  /* determine form */
  {setform:do{/*select*/
  if (exdigits==(-1))
   num.form=MathContext.prototype.PLAIN;
  else if (num.ind==this.iszero)
   num.form=MathContext.prototype.PLAIN;
  else{
   // determine whether triggers
   mag=num.exp+num.mant.length;
   if (mag>exdigits)
    num.form=exformint;
   else
    if (mag<(-5))
     num.form=exformint;
    else
     num.form=MathContext.prototype.PLAIN;
  }
  }while(false);}/*setform*/

  /* If 'after' was specified then we may need to adjust the
     mantissa.  This is a little tricky, as we must conform to the
     rules of exponential layout if necessary (e.g., we cannot end up
     with 10.0 if scientific). */
  if (after>=0)
   {setafter:for(;;){
    // calculate the current after-length
    {/*select*/
    if (num.form==MathContext.prototype.PLAIN)
     thisafter=-num.exp; // has decimal part
    else if (num.form==MathContext.prototype.SCIENTIFIC)
     thisafter=num.mant.length-1;
    else{ // engineering
     lead=(((num.exp+num.mant.length)-1))%3; // exponent to use
     if (lead<0)
      lead=3+lead; // negative exponent case
     lead++; // number of leading digits
     if (lead>=num.mant.length)
      thisafter=0;
     else
      thisafter=num.mant.length-lead;
    }
    }
    if (thisafter==after)
     break setafter; // we're in luck
    if (thisafter<after)
     { // need added trailing zeros
      // [thisafter can be negative]
      newmant=this.extend(num.mant,(num.mant.length+after)-thisafter);
      num.mant=newmant;
      num.exp=num.exp-((after-thisafter)); // adjust exponent
      if (num.exp<this.MinExp)
       throw "format(): Exponent Overflow: " + num.exp;
      break setafter;
     }
    // We have too many digits after the decimal point; this could
    // cause a carry, which could change the mantissa...
    // Watch out for implied leading zeros in PLAIN case
    chop=thisafter-after; // digits to lop [is >0]
    if (chop>num.mant.length)
     { // all digits go, no chance of carry
      // carry on with zero
      num.mant=this.ZERO.mant;
      num.ind=this.iszero;
      num.exp=0;
      continue setafter; // recheck: we may need trailing zeros
     }
    // we have a digit to inspect from existing mantissa
    // round the number as required
    need=num.mant.length-chop; // digits to end up with [may be 0]
    oldexp=num.exp; // save old exponent
    num.round(need,exround);
    // if the exponent grew by more than the digits we chopped, then
    // we must have had a carry, so will need to recheck the layout
    if ((num.exp-oldexp)==chop)
     break setafter; // number did not have carry
    // mantissa got extended .. so go around and check again
    }
   }/*setafter*/

  a=num.layout(); // lay out, with exponent if required, etc.

  /* Here we have laid-out number in 'a' */
  // now apply 'before' and 'explaces' as needed
  if (before>0)
   {
    // look for '.' or 'E'
    {var $11=a.length;p=0;p:for(;$11>0;$11--,p++){
     if (a[p]=='.')
      break p;
     if (a[p]=='E')
      break p;
     }
    }/*p*/
    // p is now offset of '.', 'E', or character after end of array
    // that is, the current length of before part
    if (p>before)
     this.badarg("format",1,before); // won't fit
    if (p<before)
     { // need leading blanks
      newa=new Array((a.length+before)-p);
      {var $12=before-p;i=0;i:for(;$12>0;$12--,i++){
       newa[i]=' ';
       }
      }/*i*/
      //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,i,a.length);
      this.arraycopy(a,0,newa,i,a.length);
      a=newa;
     }
   // [if p=before then it's just the right length]
   }

  if (explaces>0)
   {
    // look for 'E' [cannot be at offset 0]
    {var $13=a.length-1;p=a.length-1;p:for(;$13>0;$13--,p--){
     if (a[p]=='E')
      break p;
     }
    }/*p*/
    // p is now offset of 'E', or 0
    if (p==0)
     { // no E part; add trailing blanks
      newa=new Array((a.length+explaces)+2);
      //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,0,a.length);
      this.arraycopy(a,0,newa,0,a.length);
      {var $14=explaces+2;i=a.length;i:for(;$14>0;$14--,i++){
       newa[i]=' ';
       }
      }/*i*/
      a=newa;
     }
    else
     {/* found E */ // may need to insert zeros
      places=(a.length-p)-2; // number so far
      if (places>explaces)
       this.badarg("format",3,explaces);
      if (places<explaces)
       { // need to insert zeros
        newa=new Array((a.length+explaces)-places);
        //--java.lang.System.arraycopy((java.lang.Object)a,0,(java.lang.Object)newa,0,p+2); // through E and sign
        this.arraycopy(a,0,newa,0,p+2);
        {var $15=explaces-places;i=p+2;i:for(;$15>0;$15--,i++){
         newa[i]='0';
         }
        }/*i*/
        //--java.lang.System.arraycopy((java.lang.Object)a,p+2,(java.lang.Object)newa,i,places); // remainder of exponent
        this.arraycopy(a,p+2,newa,i,places);
        a=newa;
       }
     // [if places=explaces then it's just the right length]
     }
   }
  return a.join("");
  }

 /**
  * Returns the hashcode for this <code>BigDecimal</code>.
  * This hashcode is suitable for use by the
  * <code>java.util.Hashtable</code> class.
  * <p>
  * Note that two <code>BigDecimal</code> objects are only guaranteed
  * to produce the same hashcode if they are exactly equal (that is,
  * the <code>String</code> representations of the
  * <code>BigDecimal</code> numbers are identical -- they have the same
  * characters in the same sequence).
  *
  * @return An <code>int</code> that is the hashcode for <code>this</code>.
  * @stable ICU 2.0
  */

 //--public int hashCode(){
 //-- // Maybe calculate ourselves, later.  If so, note that there can be
 //-- // more than one internal representation for a given toString() result.
 //-- return this.toString().hashCode();
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to an <code>int</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part it is
  * discarded. If the <code>BigDecimal</code> is out of the possible
  * range for an <code>int</code> (32-bit signed integer) result then
  * only the low-order 32 bits are used. (That is, the number may be
  * <i>decapitated</i>.)  To avoid unexpected errors when these
  * conditions occur, use the {@link #intValueExact} method.
  *
  * @return An <code>int</code> converted from <code>this</code>,
  *         truncated and decapitated if necessary.
  * @stable ICU 2.0
  */

 //--public int intValue(){
 //-- return toBigInteger().intValue();
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to an <code>int</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part or is
  * out of the possible range for an <code>int</code> (32-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return An <code>int</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in an
  *                 <code>int</code>.
  * @stable ICU 2.0
  */

 //--public int intValueExact(){
 function intValueExact() {
  //--int lodigit;
  var lodigit;
  //--int useexp=0;
  var useexp=0;
  //--int result;
  var result;
  //--int i=0;
  var i=0;
  //--int topdig=0;
  var topdig=0;
  // This does not use longValueExact() as the latter can be much
  // slower.
  // intcheck (from pow) relies on this to check decimal part
  if (this.ind==this.iszero)
   return 0; // easy, and quite common
  /* test and drop any trailing decimal part */
  lodigit=this.mant.length-1;
  if (this.exp<0)
   {
    lodigit=lodigit+this.exp; // reduces by -(-exp)
    /* all decimal places must be 0 */
    if ((!(this.allzero(this.mant,lodigit+1))))
     throw "intValueExact(): Decimal part non-zero: " + this.toString();
    if (lodigit<0)
     return 0; // -1<this<1
    useexp=0;
   }
  else
   {/* >=0 */
    if ((this.exp+lodigit)>9)  // early exit
     throw "intValueExact(): Conversion overflow: "+this.toString();
    useexp=this.exp;
   }
  /* convert the mantissa to binary, inline for speed */
  result=0;
  {var $16=lodigit+useexp;i=0;i:for(;i<=$16;i++){
   result=result*10;
   if (i<=lodigit)
    result=result+this.mant[i];
   }
  }/*i*/

  /* Now, if the risky length, check for overflow */
  if ((lodigit+useexp)==9)
   {
    // note we cannot just test for -ve result, as overflow can move a
    // zero into the top bit [consider 5555555555]
    topdig=div(result,1000000000); // get top digit, preserving sign
    if (topdig!=this.mant[0])
     { // digit must match and be positive
      // except in the special case ...
      if (result==-2147483648)  // looks like the special
       if (this.ind==this.isneg)  // really was negative
        if (this.mant[0]==2)
         return result; // really had top digit 2
      throw "intValueExact(): Conversion overflow: "+this.toString();
     }
   }

  /* Looks good */
  if (this.ind==this.ispos)
   return result;
  return -result;
  }

 /**
  * Converts this <code>BigDecimal</code> to a <code>long</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part it is
  * discarded. If the <code>BigDecimal</code> is out of the possible
  * range for a <code>long</code> (64-bit signed integer) result then
  * only the low-order 64 bits are used. (That is, the number may be
  * <i>decapitated</i>.)  To avoid unexpected errors when these
  * conditions occur, use the {@link #longValueExact} method.
  *
  * @return A <code>long</code> converted from <code>this</code>,
  *         truncated and decapitated if necessary.
  * @stable ICU 2.0
  */

 //--public long longValue(){
 //-- return toBigInteger().longValue();
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to a <code>long</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part or is
  * out of the possible range for a <code>long</code> (64-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>long</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a
  *                 <code>long</code>.
  * @stable ICU 2.0
  */

 //--public long longValueExact(){
 //-- int lodigit;
 //-- int cstart=0;
 //-- int useexp=0;
 //-- long result;
 //-- int i=0;
 //-- long topdig=0;
 //-- // Identical to intValueExact except for result=long, and exp>=20 test
 //-- if (ind==0)
 //--  return 0; // easy, and quite common
 //-- lodigit=mant.length-1; // last included digit
 //-- if (exp<0)
 //--  {
 //--   lodigit=lodigit+exp; // -(-exp)
 //--   /* all decimal places must be 0 */
 //--   if (lodigit<0)
 //--    cstart=0;
 //--   else
 //--    cstart=lodigit+1;
 //--   if ((!(allzero(mant,cstart))))
 //--    throw new java.lang.ArithmeticException("Decimal part non-zero:"+" "+this.toString());
 //--   if (lodigit<0)
 //--    return 0; // -1<this<1
 //--   useexp=0;
 //--  }
 //-- else
 //--  {/* >=0 */
 //--   if ((exp+mant.length)>18)  // early exit
 //--    throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //--   useexp=exp;
 //--  }
 //--
 //-- /* convert the mantissa to binary, inline for speed */
 //-- // note that we could safely use the 'test for wrap to negative'
 //-- // algorithm here, but instead we parallel the intValueExact
 //-- // algorithm for ease of checking and maintenance.
 //-- result=(long)0;
 //-- {int $17=lodigit+useexp;i=0;i:for(;i<=$17;i++){
 //--  result=result*10;
 //--  if (i<=lodigit)
 //--   result=result+mant[i];
 //--  }
 //-- }/*i*/
 //--
 //-- /* Now, if the risky length, check for overflow */
 //-- if ((lodigit+useexp)==18)
 //--  {
 //--   topdig=result/1000000000000000000L; // get top digit, preserving sign
 //--   if (topdig!=mant[0])
 //--    { // digit must match and be positive
 //--     // except in the special case ...
 //--     if (result==java.lang.Long.MIN_VALUE)  // looks like the special
 //--      if (ind==isneg)  // really was negative
 //--       if (mant[0]==9)
 //--        return result; // really had top digit 9
 //--     throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //--    }
 //--  }
 //--
 //-- /* Looks good */
 //-- if (ind==ispos)
 //--  return result;
 //-- return (long)-result;
 //-- }

 /**
  * Returns a plain <code>BigDecimal</code> whose decimal point has
  * been moved to the left by a specified number of positions.
  * The parameter, <code>n</code>, specifies the number of positions to
  * move the decimal point.
  * That is, if <code>n</code> is 0 or positive, the number returned is
  * given by:
  * <p><code>
  * this.multiply(TEN.pow(new BigDecimal(-n)))
  * </code>
  * <p>
  * <code>n</code> may be negative, in which case the method returns
  * the same result as <code>movePointRight(-n)</code>.
  *
  * @param  n The <code>int</code> specifying the number of places to
  *           move the decimal point leftwards.
  * @return   A <code>BigDecimal</code> derived from
  *           <code>this</code>, with the decimal point moved
  *           <code>n</code> places to the left.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal movePointLeft(int n){
 function movePointLeft(n) {
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  // very little point in optimizing for shift of 0
  res=this.clone(this);
  res.exp=res.exp-n;
  return res.finish(this.plainMC,false); // finish sets form and checks exponent
  }

 /**
  * Returns a plain <code>BigDecimal</code> whose decimal point has
  * been moved to the right by a specified number of positions.
  * The parameter, <code>n</code>, specifies the number of positions to
  * move the decimal point.
  * That is, if <code>n</code> is 0 or positive, the number returned is
  * given by:
  * <p><code>
  * this.multiply(TEN.pow(new BigDecimal(n)))
  * </code>
  * <p>
  * <code>n</code> may be negative, in which case the method returns
  * the same result as <code>movePointLeft(-n)</code>.
  *
  * @param  n The <code>int</code> specifying the number of places to
  *           move the decimal point rightwards.
  * @return   A <code>BigDecimal</code> derived from
  *           <code>this</code>, with the decimal point moved
  *           <code>n</code> places to the right.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal movePointRight(int n){
 function movePointRight(n) {
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  res=this.clone(this);
  res.exp=res.exp+n;
  return res.finish(this.plainMC,false);
  }

 /**
  * Returns the scale of this <code>BigDecimal</code>.
  * Returns a non-negative <code>int</code> which is the scale of the
  * number. The scale is the number of digits in the decimal part of
  * the number if the number were formatted without exponential
  * notation.
  *
  * @return An <code>int</code> whose value is the scale of this
  *         <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public int scale(){
 function scale() {
  if (this.exp>=0)
   return 0; // scale can never be negative
  return -this.exp;
  }

 /**
  * Returns a plain <code>BigDecimal</code> with a given scale.
  * <p>
  * If the given scale (which must be zero or positive) is the same as
  * or greater than the length of the decimal part (the scale) of this
  * <code>BigDecimal</code> then trailing zeros will be added to the
  * decimal part as necessary.
  * <p>
  * If the given scale is less than the length of the decimal part (the
  * scale) of this <code>BigDecimal</code> then trailing digits
  * will be removed, and in this case an
  * <code>ArithmeticException</code> is thrown if any discarded digits
  * are non-zero.
  * <p>
  * The same as {@link #setScale(int, int)}, where the first parameter
  * is the scale, and the second is
  * <code>MathContext.ROUND_UNNECESSARY</code>.
  *
  * @param  scale The <code>int</code> specifying the scale of the
  *               resulting <code>BigDecimal</code>.
  * @return       A plain <code>BigDecimal</code> with the given scale.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if reducing scale would discard
  *               non-zero digits.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal setScale(int scale){
 //-- return setScale(scale,ROUND_UNNECESSARY);
 //-- }

 /**
  * Returns a plain <code>BigDecimal</code> with a given scale.
  * <p>
  * If the given scale (which must be zero or positive) is the same as
  * or greater than the length of the decimal part (the scale) of this
  * <code>BigDecimal</code> then trailing zeros will be added to the
  * decimal part as necessary.
  * <p>
  * If the given scale is less than the length of the decimal part (the
  * scale) of this <code>BigDecimal</code> then trailing digits
  * will be removed, and the rounding mode given by the second
  * parameter is used to determine if the remaining digits are
  * affected by a carry.
  * In this case, an <code>IllegalArgumentException</code> is thrown if
  * <code>round</code> is not a valid rounding mode.
  * <p>
  * If <code>round</code> is <code>MathContext.ROUND_UNNECESSARY</code>,
  * an <code>ArithmeticException</code> is thrown if any discarded
  * digits are non-zero.
  *
  * @param  scale The <code>int</code> specifying the scale of the
  *               resulting <code>BigDecimal</code>.
  * @param  round The <code>int</code> rounding mode to be used for
  *               the division (see the {@link MathContext} class).
  * @return       A plain <code>BigDecimal</code> with the given scale.
  * @throws IllegalArgumentException if <code>round</code> is not a
  *               valid rounding mode.
  * @throws ArithmeticException if <code>scale</code> is negative.
  * @throws ArithmeticException if <code>round</code> is
  *               <code>MathContext.ROUND_UNNECESSARY</code>, and
  *               reducing scale would discard non-zero digits.
  * @stable ICU 2.0
  */

 //--public com.ibm.icu.math.BigDecimal setScale(int scale,int round){
 function setScale() {
  var round;
  if (setScale.arguments.length == 2)
   {
    round = setScale.arguments[1];
   }
  else if (setScale.arguments.length == 1)
   {
    round = this.ROUND_UNNECESSARY;
   }
  else
   {
    throw "setScale(): " + setScale.arguments.length + " given; expected 1 or 2";
   }
  var scale = setScale.arguments[0];
  //--int ourscale;
  var ourscale;
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  //--int padding=0;
  var padding=0;
  //--int newlen=0;
  var newlen=0;
  // at present this naughtily only checks the round value if it is
  // needed (used), for speed
  ourscale=this.scale();
  if (ourscale==scale)  // already correct scale
   if (this.form==MathContext.prototype.PLAIN)  // .. and form
    return this;
  res=this.clone(this); // need copy
  if (ourscale<=scale)
   { // simply zero-padding/changing form
    // if ourscale is 0 we may have lots of 0s to add
    if (ourscale==0)
     padding=res.exp+scale;
    else
     padding=scale-ourscale;
    res.mant=this.extend(res.mant,res.mant.length+padding);
    res.exp=-scale; // as requested
   }
  else
   {/* ourscale>scale: shortening, probably */
    if (scale<0)
     //--throw new java.lang.ArithmeticException("Negative scale:"+" "+scale);
     throw "setScale(): Negative scale: " + scale;
    // [round() will raise exception if invalid round]
    newlen=res.mant.length-((ourscale-scale)); // [<=0 is OK]
    res=res.round(newlen,round); // round to required length
    // This could have shifted left if round (say) 0.9->1[.0]
    // Repair if so by adding a zero and reducing exponent
    if (res.exp!=(-scale))
     {
      res.mant=this.extend(res.mant,res.mant.length+1);
      res.exp=res.exp-1;
     }
   }
  res.form=MathContext.prototype.PLAIN; // by definition
  return res;
  }

 /**
  * Converts this <code>BigDecimal</code> to a <code>short</code>.
  * If the <code>BigDecimal</code> has a non-zero decimal part or is
  * out of the possible range for a <code>short</code> (16-bit signed
  * integer) result then an <code>ArithmeticException</code> is thrown.
  *
  * @return A <code>short</code> equal in value to <code>this</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *                 decimal part, or will not fit in a
  *                 <code>short</code>.
  * @stable ICU 2.0
  */

 //--public short shortValueExact(){
 //-- int num;
 //-- num=this.intValueExact(); // will check decimal part too
 //-- if ((num>32767)|(num<(-32768)))
 //--  throw new java.lang.ArithmeticException("Conversion overflow:"+" "+this.toString());
 //-- return (short)num;
 //-- }

 /**
  * Returns the sign of this <code>BigDecimal</code>, as an
  * <code>int</code>.
  * This returns the <i>signum</i> function value that represents the
  * sign of this <code>BigDecimal</code>.
  * That is, -1 if the <code>BigDecimal</code> is negative, 0 if it is
  * numerically equal to zero, or 1 if it is positive.
  *
  * @return An <code>int</code> which is -1 if the
  *         <code>BigDecimal</code> is negative, 0 if it is
  *         numerically equal to zero, or 1 if it is positive.
  * @stable ICU 2.0
  */

 //--public int signum(){
 function signum() {
  return this.ind; // [note this assumes values for ind.]
  }

 /**
  * Converts this <code>BigDecimal</code> to a
  * <code>java.math.BigDecimal</code>.
  * <p>
  * This is an exact conversion; the result is the same as if the
  * <code>BigDecimal</code> were formatted as a plain number without
  * any rounding or exponent and then the
  * <code>java.math.BigDecimal(java.lang.String)</code> constructor
  * were used to construct the result.
  * <p>
  * <i>(Note: this method is provided only in the
  * <code>com.ibm.icu.math</code> version of the BigDecimal class.
  * It would not be present in a <code>java.math</code> version.)</i>
  *
  * @return The <code>java.math.BigDecimal</code> equal in value
  *         to this <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public java.math.BigDecimal toBigDecimal(){
 //-- return new java.math.BigDecimal(this.unscaledValue(),this.scale());
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to a
  * <code>java.math.BigInteger</code>.
  * <p>
  * Any decimal part is truncated (discarded).
  * If an exception is desired should the decimal part be non-zero,
  * use {@link #toBigIntegerExact()}.
  *
  * @return The <code>java.math.BigInteger</code> equal in value
  *         to the integer part of this <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger toBigInteger(){
 //-- com.ibm.icu.math.BigDecimal res=null;
 //-- int newlen=0;
 //-- byte newmant[]=null;
 //-- {/*select*/
 //-- if ((exp>=0)&(form==com.ibm.icu.math.MathContext.PLAIN))
 //--  res=this; // can layout simply
 //-- else if (exp>=0)
 //--  {
 //--   res=clone(this); // safe copy
 //--   res.form=(byte)com.ibm.icu.math.MathContext.PLAIN; // .. and request PLAIN
 //--  }
 //-- else{
 //--  { // exp<0; scale to be truncated
 //--   // we could use divideInteger, but we may as well be quicker
 //--   if (((int)-this.exp)>=this.mant.length)
 //--    res=ZERO; // all blows away
 //--   else
 //--    {
 //--     res=clone(this); // safe copy
 //--     newlen=res.mant.length+res.exp;
 //--     newmant=new byte[newlen]; // [shorter]
 //--     java.lang.System.arraycopy((java.lang.Object)res.mant,0,(java.lang.Object)newmant,0,newlen);
 //--     res.mant=newmant;
 //--     res.form=(byte)com.ibm.icu.math.MathContext.PLAIN;
 //--     res.exp=0;
 //--    }
 //--  }
 //-- }
 //-- }
 //-- return new BigInteger(new java.lang.String(res.layout()));
 //-- }

 /**
  * Converts this <code>BigDecimal</code> to a
  * <code>java.math.BigInteger</code>.
  * <p>
  * An exception is thrown if the decimal part (if any) is non-zero.
  *
  * @return The <code>java.math.BigInteger</code> equal in value
  *         to the integer part of this <code>BigDecimal</code>.
  * @throws ArithmeticException if <code>this</code> has a non-zero
  *         decimal part.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger toBigIntegerExact(){
 //-- /* test any trailing decimal part */
 //-- if (exp<0)
 //--  { // possible decimal part
 //--   /* all decimal places must be 0; note exp<0 */
 //--   if ((!(allzero(mant,mant.length+exp))))
 //--    throw new java.lang.ArithmeticException("Decimal part non-zero:"+" "+this.toString());
 //--  }
 //-- return toBigInteger();
 //-- }

 /**
  * Returns the <code>BigDecimal</code> as a character array.
  * The result of this method is the same as using the
  * sequence <code>toString().toCharArray()</code>, but avoids creating
  * the intermediate <code>String</code> and <code>char[]</code>
  * objects.
  *
  * @return The <code>char[]</code> array corresponding to this
  *         <code>BigDecimal</code>.
  * @stable ICU 2.0
  */

 //--public char[] toCharArray(){
 //-- return layout();
 //-- }

 /**
  * Returns the <code>BigDecimal</code> as a <code>String</code>.
  * This returns a <code>String</code> that exactly represents this
  * <code>BigDecimal</code>, as defined in the decimal documentation
  * (see {@link BigDecimal class header}).
  * <p>
  * By definition, using the {@link #BigDecimal(String)} constructor
  * on the result <code>String</code> will create a
  * <code>BigDecimal</code> that is exactly equal to the original
  * <code>BigDecimal</code>.
  *
  * @return The <code>String</code> exactly corresponding to this
  *         <code>BigDecimal</code>.
  * @see    #format(int, int)
  * @see    #format(int, int, int, int, int, int)
  * @see    #toCharArray()
  * @stable ICU 2.0
  */

 //--public java.lang.String toString(){
 function toString() {
  return this.layout().join("");
  }

 /**
  * Returns the number as a <code>BigInteger</code> after removing the
  * scale.
  * That is, the number is expressed as a plain number, any decimal
  * point is then removed (retaining the digits of any decimal part),
  * and the result is then converted to a <code>BigInteger</code>.
  *
  * @return The <code>java.math.BigInteger</code> equal in value to
  *         this <code>BigDecimal</code> multiplied by ten to the
  *         power of <code>this.scale()</code>.
  * @stable ICU 2.0
  */

 //--public java.math.BigInteger unscaledValue(){
 //-- com.ibm.icu.math.BigDecimal res=null;
 //-- if (exp>=0)
 //--  res=this;
 //-- else
 //--  {
 //--   res=clone(this); // safe copy
 //--   res.exp=0; // drop scale
 //--  }
 //-- return res.toBigInteger();
 //-- }

 /**
  * Translates a <code>double</code> to a <code>BigDecimal</code>.
  * <p>
  * Returns a <code>BigDecimal</code> which is the decimal
  * representation of the 64-bit signed binary floating point
  * parameter. If the parameter is infinite, or is not a number (NaN),
  * a <code>NumberFormatException</code> is thrown.
  * <p>
  * The number is constructed as though <code>num</code> had been
  * converted to a <code>String</code> using the
  * <code>Double.toString()</code> method and the
  * {@link #BigDecimal(java.lang.String)} constructor had then been used.
  * This is typically not an exact conversion.
  *
  * @param  dub The <code>double</code> to be translated.
  * @return     The <code>BigDecimal</code> equal in value to
  *             <code>dub</code>.
  * @throws NumberFormatException if the parameter is infinite or
  *             not a number.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math.BigDecimal valueOf(double dub){
 //-- // Reminder: a zero double returns '0.0', so we cannot fastpath to
 //-- // use the constant ZERO.  This might be important enough to justify
 //-- // a factory approach, a cache, or a few private constants, later.
 //-- return new com.ibm.icu.math.BigDecimal((new java.lang.Double(dub)).toString());
 //-- }

 /**
  * Translates a <code>long</code> to a <code>BigDecimal</code>.
  * That is, returns a plain <code>BigDecimal</code> whose value is
  * equal to the given <code>long</code>.
  *
  * @param  lint The <code>long</code> to be translated.
  * @return      The <code>BigDecimal</code> equal in value to
  *              <code>lint</code>.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math.BigDecimal valueOf(long lint){
 //-- return valueOf(lint,0);
 //-- }

 /**
  * Translates a <code>long</code> to a <code>BigDecimal</code> with a
  * given scale.
  * That is, returns a plain <code>BigDecimal</code> whose unscaled
  * value is equal to the given <code>long</code>, adjusted by the
  * second parameter, <code>scale</code>.
  * <p>
  * The result is given by:
  * <p><code>
  * (new BigDecimal(lint)).divide(TEN.pow(new BigDecimal(scale)))
  * </code>
  * <p>
  * A <code>NumberFormatException</code> is thrown if <code>scale</code>
  * is negative.
  *
  * @param  lint  The <code>long</code> to be translated.
  * @param  scale The <code>int</code> scale to be applied.
  * @return       The <code>BigDecimal</code> equal in value to
  *               <code>lint</code>.
  * @throws NumberFormatException if the scale is negative.
  * @stable ICU 2.0
  */

 //--public static com.ibm.icu.math.BigDecimal valueOf(long lint,int scale){
 //-- com.ibm.icu.math.BigDecimal res=null;
 //-- {/*select*/
 //-- if (lint==0)
 //--  res=ZERO;
 //-- else if (lint==1)
 //--  res=ONE;
 //-- else if (lint==10)
 //--  res=TEN;
 //-- else{
 //--  res=new com.ibm.icu.math.BigDecimal(lint);
 //-- }
 //-- }
 //-- if (scale==0)
 //--  return res;
 //-- if (scale<0)
 //--  throw new java.lang.NumberFormatException("Negative scale:"+" "+scale);
 //-- res=clone(res); // safe copy [do not mutate]
 //-- res.exp=(int)-scale; // exponent is -scale
 //-- return res;
 //-- }

 /* ---------------------------------------------------------------- */
 /* Private methods                                                  */
 /* ---------------------------------------------------------------- */

 /* <sgml> Return char array value of a BigDecimal (conversion from
       BigDecimal to laid-out canonical char array).
    <p>The mantissa will either already have been rounded (following an
       operation) or will be of length appropriate (in the case of
       construction from an int, for example).
    <p>We must not alter the mantissa, here.
    <p>'form' describes whether we are to use exponential notation (and
       if so, which), or if we are to lay out as a plain/pure numeric.
    </sgml> */

 //--private char[] layout(){
 function layout() {
  //--char cmant[];
  var cmant;
  //--int i=0;
  var i=0;
  //--java.lang.StringBuffer sb=null;
  var sb=null;
  //--int euse=0;
  var euse=0;
  //--int sig=0;
  var sig=0;
  //--char csign=0;
  var csign=0;
  //--char rec[]=null;
  var rec=null;
  //--int needsign;
  var needsign;
  //--int mag;
  var mag;
  //--int len=0;
  var len=0;
  cmant=new Array(this.mant.length); // copy byte[] to a char[]
  {var $18=this.mant.length;i=0;i:for(;$18>0;$18--,i++){
   cmant[i]=this.mant[i]+'';
   }
  }/*i*/

  if (this.form!=MathContext.prototype.PLAIN)
   {/* exponential notation needed */
    //--sb=new java.lang.StringBuffer(cmant.length+15); // -x.xxxE+999999999
    sb="";
    if (this.ind==this.isneg)
     sb += '-';
    euse=(this.exp+cmant.length)-1; // exponent to use
    /* setup sig=significant digits and copy to result */
    if (this.form==MathContext.prototype.SCIENTIFIC)
     { // [default]
      sb += cmant[0]; // significant character
      if (cmant.length>1)  // have decimal part
       //--sb.append('.').append(cmant,1,cmant.length-1);
       sb += '.';
       sb += cmant.slice(1).join("");
     }
    else
     {engineering:do{
      sig=euse%3; // common
      if (sig<0)
       sig=3+sig; // negative exponent
      euse=euse-sig;
      sig++;
      if (sig>=cmant.length)
       { // zero padding may be needed
        //--sb.append(cmant,0,cmant.length);
        sb += cmant.join("");
        {var $19=sig-cmant.length;for(;$19>0;$19--){
         sb += '0';
         }
        }
       }
      else
       { // decimal point needed
        //--sb.append(cmant,0,sig).append('.').append(cmant,sig,cmant.length-sig);
        sb += cmant.slice(0,sig).join("");
        sb += '.';
        sb += cmant.slice(sig).join("");
       }
     }while(false);}/*engineering*/
    if (euse!=0)
     {
      if (euse<0)
       {
        csign='-';
        euse=-euse;
       }
      else
       csign='+';
      //--sb.append('E').append(csign).append(euse);
      sb += 'E';
      sb += csign;
      sb += euse;
     }
    //--rec=new Array(sb.length);
    //--Utility.getChars(sb, 0,sb.length(),rec,0);
    //--return rec;
    return sb.split("");
   }

  /* Here for non-exponential (plain) notation */
  if (this.exp==0)
   {/* easy */
    if (this.ind>=0)
     return cmant; // non-negative integer
    rec=new Array(cmant.length+1);
    rec[0]='-';
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,1,cmant.length);
    this.arraycopy(cmant,0,rec,1,cmant.length);
    return rec;
   }

  /* Need a '.' and/or some zeros */
  needsign=((this.ind==this.isneg)?1:0); // space for sign?  0 or 1

  /* MAG is the position of the point in the mantissa (index of the
     character it follows) */
  mag=this.exp+cmant.length;

  if (mag<1)
   {/* 0.00xxxx form */
    len=(needsign+2)-this.exp; // needsign+2+(-mag)+cmant.length
    rec=new Array(len);
    if (needsign!=0)
     rec[0]='-';
    rec[needsign]='0';
    rec[needsign+1]='.';
    {var $20=-mag;i=needsign+2;i:for(;$20>0;$20--,i++){ // maybe none
     rec[i]='0';
     }
    }/*i*/
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,(needsign+2)-mag,cmant.length);
    this.arraycopy(cmant,0,rec,(needsign+2)-mag,cmant.length);
    return rec;
   }

  if (mag>cmant.length)
   {/* xxxx0000 form */
    len=needsign+mag;
    rec=new Array(len);
    if (needsign!=0)
     rec[0]='-';
    //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,needsign,cmant.length);
    this.arraycopy(cmant,0,rec,needsign,cmant.length);
    {var $21=mag-cmant.length;i=needsign+cmant.length;i:for(;$21>0;$21--,i++){ // never 0
     rec[i]='0';
     }
    }/*i*/
    return rec;
   }

  /* decimal point is in the middle of the mantissa */
  len=(needsign+1)+cmant.length;
  rec=new Array(len);
  if (needsign!=0)
   rec[0]='-';
  //--java.lang.System.arraycopy((java.lang.Object)cmant,0,(java.lang.Object)rec,needsign,mag);
  this.arraycopy(cmant,0,rec,needsign,mag);
  rec[needsign+mag]='.';
  //--java.lang.System.arraycopy((java.lang.Object)cmant,mag,(java.lang.Object)rec,(needsign+mag)+1,cmant.length-mag);
  this.arraycopy(cmant,mag,rec,(needsign+mag)+1,cmant.length-mag);
  return rec;
  }

 /* <sgml> Checks a BigDecimal argument to ensure it's a true integer
       in a given range.
    <p>If OK, returns it as an int. </sgml> */
 // [currently only used by pow]

 //--private int intcheck(int min,int max){
 function intcheck(min, max) {
  //--int i;
  var i;
  i=this.intValueExact(); // [checks for non-0 decimal part]
  // Use same message as though intValueExact failed due to size
  if ((i<min)||(i>max))
   throw "intcheck(): Conversion overflow: "+i;
  return i;
  }

 /* <sgml> Carry out division operations. </sgml> */
 /*
    Arg1 is operation code: D=divide, I=integer divide, R=remainder
    Arg2 is the rhs.
    Arg3 is the context.
    Arg4 is explicit scale iff code='D' or 'I' (-1 if none).

    Underlying algorithm (complications for Remainder function and
    scaled division are omitted for clarity):

      Test for x/0 and then 0/x
      Exp =Exp1 - Exp2
      Exp =Exp +len(var1) -len(var2)
      Sign=Sign1 * Sign2
      Pad accumulator (Var1) to double-length with 0's (pad1)
      Pad Var2 to same length as Var1
      B2B=1st two digits of var2, +1 to allow for roundup
      have=0
      Do until (have=digits+1 OR residue=0)
        if exp<0 then if integer divide/residue then leave
        this_digit=0
        Do forever
           compare numbers
           if <0 then leave inner_loop
           if =0 then (- quick exit without subtract -) do
              this_digit=this_digit+1; output this_digit
              leave outer_loop; end
           Compare lengths of numbers (mantissae):
           If same then CA=first_digit_of_Var1
                   else CA=first_two_digits_of_Var1
           mult=ca*10/b2b   -- Good and safe guess at divisor
           if mult=0 then mult=1
           this_digit=this_digit+mult
           subtract
           end inner_loop
         if have\=0 | this_digit\=0 then do
           output this_digit
           have=have+1; end
         var2=var2/10
         exp=exp-1
         end outer_loop
      exp=exp+1   -- set the proper exponent
      if have=0 then generate answer=0
      Return to FINISHED
      Result defined by MATHV1

    For extended commentary, see DMSRCN.
  */

 //--private com.ibm.icu.math.BigDecimal dodivide(char code,com.ibm.icu.math.BigDecimal rhs,com.ibm.icu.math.MathContext set,int scale){
 function dodivide(code, rhs, set, scale) {
  //--com.ibm.icu.math.BigDecimal lhs;
  var lhs;
  //--int reqdig;
  var reqdig;
  //--int newexp;
  var newexp;
  //--com.ibm.icu.math.BigDecimal res;
  var res;
  //--int newlen;
  var newlen;
  //--byte var1[];
  var var1;
  //--int var1len;
  var var1len;
  //--byte var2[];
  var var2;
  //--int var2len;
  var var2len;
  //--int b2b;
  var b2b;
  //--int have;
  var have;
  //--int thisdigit=0;
  var thisdigit=0;
  //--int i=0;
  var i=0;
  //--byte v2=0;
  var v2=0;
  //--int ba=0;
  var ba=0;
  //--int mult=0;
  var mult=0;
  //--int start=0;
  var start=0;
  //--int padding=0;
  var padding=0;
  //--int d=0;
  var d=0;
  //--byte newvar1[]=null;
  var newvar1=null;
  //--byte lasthave=0;
  var lasthave=0;
  //--int actdig=0;
  var actdig=0;
  //--byte newmant[]=null;
  var newmant=null;

  if (set.lostDigits)
   this.checkdigits(rhs,set.digits);
  lhs=this; // name for clarity

  // [note we must have checked lostDigits before the following checks]
  if (rhs.ind==0)
   throw "dodivide(): Divide by 0"; // includes 0/0
  if (lhs.ind==0)
   { // 0/x => 0 [possibly with .0s]
    if (set.form!=MathContext.prototype.PLAIN)
     return this.ZERO;
    if (scale==(-1))
     return lhs;
    return lhs.setScale(scale);
   }

  /* Prepare numbers according to BigDecimal rules */
  reqdig=set.digits; // local copy (heavily used)
  if (reqdig>0)
   {
    if (lhs.mant.length>reqdig)
     lhs=this.clone(lhs).round(set);
    if (rhs.mant.length>reqdig)
     rhs=this.clone(rhs).round(set);
   }
  else
   {/* scaled divide */
    if (scale==(-1))
     scale=lhs.scale();
    // set reqdig to be at least large enough for the computation
    reqdig=lhs.mant.length; // base length
    // next line handles both positive lhs.exp and also scale mismatch
    if (scale!=(-lhs.exp))
     reqdig=(reqdig+scale)+lhs.exp;
    reqdig=(reqdig-((rhs.mant.length-1)))-rhs.exp; // reduce by RHS effect
    if (reqdig<lhs.mant.length)
     reqdig=lhs.mant.length; // clamp
    if (reqdig<rhs.mant.length)
     reqdig=rhs.mant.length; // ..
   }

  /* precalculate exponent */
  newexp=((lhs.exp-rhs.exp)+lhs.mant.length)-rhs.mant.length;
  /* If new exponent -ve, then some quick exits are possible */
  if (newexp<0)
   if (code!='D')
    {
     if (code=='I')
      return this.ZERO; // easy - no integer part
     /* Must be 'R'; remainder is [finished clone of] input value */
     return this.clone(lhs).finish(set,false);
    }

  /* We need slow division */
  res=new BigDecimal(); // where we'll build result
  res.ind=(lhs.ind*rhs.ind); // final sign (for D/I)
  res.exp=newexp; // initial exponent (for D/I)
  res.mant=this.createArrayWithZeros(reqdig+1); // where build the result

  /* Now [virtually pad the mantissae with trailing zeros */
  // Also copy the LHS, which will be our working array
  newlen=(reqdig+reqdig)+1;
  var1=this.extend(lhs.mant,newlen); // always makes longer, so new safe array
  var1len=newlen; // [remaining digits are 0]

  var2=rhs.mant;
  var2len=newlen;

  /* Calculate first two digits of rhs (var2), +1 for later estimations */
  b2b=(var2[0]*10)+1;
  if (var2.length>1)
   b2b=b2b+var2[1];

  /* start the long-division loops */
  have=0;
  {outer:for(;;){
   thisdigit=0;
   /* find the next digit */
   {inner:for(;;){
    if (var1len<var2len)
     break inner; // V1 too low
    if (var1len==var2len)
     { // compare needed
      {compare:do{ // comparison
       {var $22=var1len;i=0;i:for(;$22>0;$22--,i++){
        // var1len is always <= var1.length
        if (i<var2.length)
         v2=var2[i];
        else
         v2=0;
        if (var1[i]<v2)
         break inner; // V1 too low
        if (var1[i]>v2)
         break compare; // OK to subtract
        }
       }/*i*/
       /* reach here if lhs and rhs are identical; subtraction will
          increase digit by one, and the residue will be 0 so we
          are done; leave the loop with residue set to 0 (in case
          code is 'R' or ROUND_UNNECESSARY or a ROUND_HALF_xxxx is
          being checked) */
       thisdigit++;
       res.mant[have]=thisdigit;
       have++;
       var1[0]=0; // residue to 0 [this is all we'll test]
       // var1len=1      -- [optimized out]
       break outer;
      }while(false);}/*compare*/
      /* prepare for subtraction.  Estimate BA (lengths the same) */
      ba=var1[0]; // use only first digit
     } // lengths the same
    else
     {/* lhs longer than rhs */
      /* use first two digits for estimate */
      ba=var1[0]*10;
      if (var1len>1)
       ba=ba+var1[1];
     }
    /* subtraction needed; V1>=V2 */
    mult=div((ba*10),b2b);
    if (mult==0)
     mult=1;
    thisdigit=thisdigit+mult;
    // subtract; var1 reusable
    var1=this.byteaddsub(var1,var1len,var2,var2len,-mult,true);
    if (var1[0]!=0)
     continue inner; // maybe another subtract needed
    /* V1 now probably has leading zeros, remove leading 0's and try
       again. (It could be longer than V2) */
    {var $23=var1len-2;start=0;start:for(;start<=$23;start++){
     if (var1[start]!=0)
      break start;
     var1len--;
     }
    }/*start*/
    if (start==0)
     continue inner;
    // shift left
    //--java.lang.System.arraycopy((java.lang.Object)var1,start,(java.lang.Object)var1,0,var1len);
    this.arraycopy(var1,start,var1,0,var1len);
    }
   }/*inner*/

   /* We have the next digit */
   if ((have!=0)||(thisdigit!=0))
    { // put the digit we got
     res.mant[have]=thisdigit;
     have++;
     if (have==(reqdig+1))
      break outer; // we have all we need
     if (var1[0]==0)
      break outer; // residue now 0
    }
   /* can leave now if a scaled divide and exponent is small enough */
   if (scale>=0)
    if ((-res.exp)>scale)
     break outer;
   /* can leave now if not Divide and no integer part left  */
   if (code!='D')
    if (res.exp<=0)
     break outer;
   res.exp=res.exp-1; // reduce the exponent
   /* to get here, V1 is less than V2, so divide V2 by 10 and go for
      the next digit */
   var2len--;
   }
  }/*outer*/

  /* here when we have finished dividing, for some reason */
  // have is the number of digits we collected in res.mant
  if (have==0)
   have=1; // res.mant[0] is 0; we always want a digit

  if ((code=='I')||(code=='R'))
   {/* check for integer overflow needed */
    if ((have+res.exp)>reqdig)
     throw "dodivide(): Integer overflow";

    if (code=='R')
     {remainder:do{
      /* We were doing Remainder -- return the residue */
      if (res.mant[0]==0)  // no integer part was found
       return this.clone(lhs).finish(set,false); // .. so return lhs, canonical
      if (var1[0]==0)
       return this.ZERO; // simple 0 residue
      res.ind=lhs.ind; // sign is always as LHS
      /* Calculate the exponent by subtracting the number of padding zeros
         we added and adding the original exponent */
      padding=((reqdig+reqdig)+1)-lhs.mant.length;
      res.exp=(res.exp-padding)+lhs.exp;

      /* strip insignificant padding zeros from residue, and create/copy
         the resulting mantissa if need be */
      d=var1len;
      {i=d-1;i:for(;i>=1;i--){if(!((res.exp<lhs.exp)&&(res.exp<rhs.exp)))break;
       if (var1[i]!=0)
        break i;
       d--;
       res.exp=res.exp+1;
       }
      }/*i*/
      if (d<var1.length)
       {/* need to reduce */
        newvar1=new Array(d);
        //--java.lang.System.arraycopy((java.lang.Object)var1,0,(java.lang.Object)newvar1,0,d); // shorten
        this.arraycopy(var1,0,newvar1,0,d);
        var1=newvar1;
       }
      res.mant=var1;
      return res.finish(set,false);
     }while(false);}/*remainder*/
   }

  else
   {/* 'D' -- no overflow check needed */
    // If there was a residue then bump the final digit (iff 0 or 5)
    // so that the residue is visible for ROUND_UP, ROUND_HALF_xxx and
    // ROUND_UNNECESSARY checks (etc.) later.
    // [if we finished early, the residue will be 0]
    if (var1[0]!=0)
     { // residue not 0
      lasthave=res.mant[have-1];
      if (((lasthave%5))==0)
       res.mant[have-1]=(lasthave+1);
     }
   }

  /* Here for Divide or Integer Divide */
  // handle scaled results first ['I' always scale 0, optional for 'D']
  if (scale>=0)
   {scaled:do{
    // say 'scale have res.exp len' scale have res.exp res.mant.length
    if (have!=res.mant.length)
     // already padded with 0's, so just adjust exponent
     res.exp=res.exp-((res.mant.length-have));
    // calculate number of digits we really want [may be 0]
    actdig=res.mant.length-(((-res.exp)-scale));
    res.round(actdig,set.roundingMode); // round to desired length
    // This could have shifted left if round (say) 0.9->1[.0]
    // Repair if so by adding a zero and reducing exponent
    if (res.exp!=(-scale))
     {
      res.mant=this.extend(res.mant,res.mant.length+1);
      res.exp=res.exp-1;
     }
    return res.finish(set,true); // [strip if not PLAIN]
   }while(false);}/*scaled*/

  // reach here only if a non-scaled
  if (have==res.mant.length)
   { // got digits+1 digits
    res.round(set);
    have=reqdig;
   }
  else
   {/* have<=reqdig */
    if (res.mant[0]==0)
     return this.ZERO; // fastpath
    // make the mantissa truly just 'have' long
    // [we could let finish do this, during strip, if we adjusted
    // the exponent; however, truncation avoids the strip loop]
    newmant=new Array(have); // shorten
    //--java.lang.System.arraycopy((java.lang.Object)res.mant,0,(java.lang.Object)newmant,0,have);
    this.arraycopy(res.mant,0,newmant,0,have);
    res.mant=newmant;
   }
  return res.finish(set,true);
  }

 /* <sgml> Report a conversion exception. </sgml> */

 //--private void bad(char s[]){
 function bad(prefix, s) {
  throw prefix + "Not a number: "+s;
  }

 /* <sgml> Report a bad argument to a method. </sgml>
    Arg1 is method name
    Arg2 is argument position
    Arg3 is what was found */

 //--private void badarg(java.lang.String name,int pos,java.lang.String value){
 function badarg(name, pos, value) {
  throw "Bad argument "+pos+" to "+name+": "+value;
  }

 /* <sgml> Extend byte array to given length, padding with 0s.  If no
    extension is required then return the same array. </sgml>

    Arg1 is the source byte array
    Arg2 is the new length (longer)
    */

 //--private static final byte[] extend(byte inarr[],int newlen){
 function extend(inarr, newlen) {
  //--byte newarr[];
  var newarr;
  if (inarr.length==newlen)
   return inarr;
  newarr=createArrayWithZeros(newlen);
  //--java.lang.System.arraycopy((java.lang.Object)inarr,0,(java.lang.Object)newarr,0,inarr.length);
  this.arraycopy(inarr,0,newarr,0,inarr.length);
  // 0 padding is carried out by the JVM on allocation initialization
  return newarr;
  }

 /* <sgml> Add or subtract two >=0 integers in byte arrays
    <p>This routine performs the calculation:
    <pre>
    C=A+(B*M)
    </pre>
    Where M is in the range -9 through +9
    <p>
    If M<0 then A>=B must be true, so the result is always
    non-negative.

    Leading zeros are not removed after a subtraction.  The result is
    either the same length as the longer of A and B, or 1 longer than
    that (if a carry occurred).

    A is not altered unless Arg6 is 1.
    B is never altered.

    Arg1 is A
    Arg2 is A length to use (if longer than A, pad with 0's)
    Arg3 is B
    Arg4 is B length to use (if longer than B, pad with 0's)
    Arg5 is M, the multiplier
    Arg6 is 1 if A can be used to build the result (if it fits)

    This routine is severely performance-critical; *any* change here
    must be measured (timed) to assure no performance degradation.
    */
 // 1996.02.20 -- enhanced version of DMSRCN algorithm (1981)
 // 1997.10.05 -- changed to byte arrays (from char arrays)
 // 1998.07.01 -- changed to allow destructive reuse of LHS
 // 1998.07.01 -- changed to allow virtual lengths for the arrays
 // 1998.12.29 -- use lookaside for digit/carry calculation
 // 1999.08.07 -- avoid multiply when mult=1, and make db an int
 // 1999.12.22 -- special case m=-1, also drop 0 special case

 //--private static final byte[] byteaddsub(byte a[],int avlen,byte b[],int bvlen,int m,boolean reuse){
 function byteaddsub(a, avlen, b, bvlen, m, reuse) {
  //--int alength;
  var alength;
  //--int blength;
  var blength;
  //--int ap;
  var ap;
  //--int bp;
  var bp;
  //--int maxarr;
  var maxarr;
  //--byte reb[];
  var reb;
  //--boolean quickm;
  var quickm;
  //--int digit;
  var digit;
  //--int op=0;
  var op=0;
  //--int dp90=0;
  var dp90=0;
  //--byte newarr[];
  var newarr;
  //--int i=0;
  var i=0;




  // We'll usually be right if we assume no carry
  alength=a.length; // physical lengths
  blength=b.length; // ..
  ap=avlen-1; // -> final (rightmost) digit
  bp=bvlen-1; // ..
  maxarr=bp;
  if (maxarr<ap)
   maxarr=ap;
  reb=null; // result byte array
  if (reuse)
   if ((maxarr+1)==alength)
    reb=a; // OK to reuse A
  if (reb==null){
   reb=this.createArrayWithZeros(maxarr+1); // need new array
   }

  quickm=false; // 1 if no multiply needed
  if (m==1)
   quickm=true; // most common
  else
   if (m==(-1))
    quickm=true; // also common

  digit=0; // digit, with carry or borrow
  {op=maxarr;op:for(;op>=0;op--){
   if (ap>=0)
    {
     if (ap<alength)
      digit=digit+a[ap]; // within A
     ap--;
    }
   if (bp>=0)
    {
     if (bp<blength)
      { // within B
       if (quickm)
        {
         if (m>0)
          digit=digit+b[bp]; // most common
         else
          digit=digit-b[bp]; // also common
        }
       else
        digit=digit+(b[bp]*m);
      }
     bp--;
    }
   /* result so far (digit) could be -90 through 99 */
   if (digit<10)
    if (digit>=0)
     {quick:do{ // 0-9
      reb[op]=digit;
      digit=0; // no carry
      continue op;
     }while(false);}/*quick*/
   dp90=digit+90;
   reb[op]=this.bytedig[dp90]; // this digit
   digit=this.bytecar[dp90]; // carry or borrow
   }
  }/*op*/

  if (digit==0)
   return reb; // no carry
  // following line will become an Assert, later
  // if digit<0 then signal ArithmeticException("internal.error ["digit"]")

  /* We have carry -- need to make space for the extra digit */
  newarr=null;
  if (reuse)
   if ((maxarr+2)==a.length)
    newarr=a; // OK to reuse A
  if (newarr==null)
   newarr=new Array(maxarr+2);
  newarr[0]=digit; // the carried digit ..
  // .. and all the rest [use local loop for short numbers]
  //--if (maxarr<10)
   {var $24=maxarr+1;i=0;i:for(;$24>0;$24--,i++){
    newarr[i+1]=reb[i];
    }
   }/*i*/
  //--else
   //--java.lang.System.arraycopy((java.lang.Object)reb,0,(java.lang.Object)newarr,1,maxarr+1);
  return newarr;
  }

 /* <sgml> Initializer for digit array properties (lookaside). </sgml>
    Returns the digit array, and initializes the carry array. */

 //--private static final byte[] diginit(){
 function diginit() {
  //--byte work[];
  var work;
  //--int op=0;
  var op=0;
  //--int digit=0;
  var digit=0;
  work=new Array((90+99)+1);
  {op=0;op:for(;op<=(90+99);op++){
   digit=op-90;
   if (digit>=0)
    {
     work[op]=(digit%10);
     BigDecimal.prototype.bytecar[op]=(div(digit,10)); // calculate carry
     continue op;
    }
   // borrowing...
   digit=digit+100; // yes, this is right [consider -50]
   work[op]=(digit%10);
   BigDecimal.prototype.bytecar[op]=((div(digit,10))-10); // calculate borrow [NB: - after %]
   }
  }/*op*/
  return work;
  }

 /* <sgml> Create a copy of BigDecimal object for local use.
    <p>This does NOT make a copy of the mantissa array.
    </sgml>
    Arg1 is the BigDecimal to clone (non-null)
    */

 //--private static final com.ibm.icu.math.BigDecimal clone(com.ibm.icu.math.BigDecimal dec){
 function clone(dec) {
  //--com.ibm.icu.math.BigDecimal copy;
  var copy;
  copy=new BigDecimal();
  copy.ind=dec.ind;
  copy.exp=dec.exp;
  copy.form=dec.form;
  copy.mant=dec.mant;
  return copy;
  }

 /* <sgml> Check one or two numbers for lost digits. </sgml>
    Arg1 is RHS (or null, if none)
    Arg2 is current DIGITS setting
    returns quietly or throws an exception */

 //--private void checkdigits(com.ibm.icu.math.BigDecimal rhs,int dig){
 function checkdigits(rhs, dig) {
  if (dig==0)
   return; // don't check if digits=0
  // first check lhs...
  if (this.mant.length>dig)
   if ((!(this.allzero(this.mant,dig))))
    throw "Too many digits: "+this.toString();
  if (rhs==null)
   return; // monadic
  if (rhs.mant.length>dig)
   if ((!(this.allzero(rhs.mant,dig))))
    throw "Too many digits: "+rhs.toString();
  return;
  }

 /* <sgml> Round to specified digits, if necessary. </sgml>
    Arg1 is requested MathContext [with length and rounding mode]
    returns this, for convenience */

 //--private com.ibm.icu.math.BigDecimal round(com.ibm.icu.math.MathContext set){
 //-- return round(set.digits,set.roundingMode);
 //-- }

 /* <sgml> Round to specified digits, if necessary.
    Arg1 is requested length (digits to round to)
            [may be <=0 when called from format, dodivide, etc.]
    Arg2 is rounding mode
    returns this, for convenience

    ind and exp are adjusted, but not cleared for a mantissa of zero

    The length of the mantissa returned will be Arg1, except when Arg1
    is 0, in which case the returned mantissa length will be 1.
    </sgml>
    */

 //private com.ibm.icu.math.BigDecimal round(int len,int mode){
 function round() {
  var len;
  var mode;
  if (round.arguments.length == 2)
   {
    len = round.arguments[0];
    mode = round.arguments[1];
   }
  else if (round.arguments.length == 1)
   {
    var set = round.arguments[0];
    len = set.digits;
    mode = set.roundingMode;
   }
  else
   {
    throw "round(): " + round.arguments.length + " arguments given; expected 1 or 2";
   }
  //int adjust;
  var adjust;
  //int sign;
  var sign;
  //byte oldmant[];
  var oldmant;
  //boolean reuse=false;
  var reuse=false;
  //--byte first=0;
  var first=0;
  //--int increment;
  var increment;
  //--byte newmant[]=null;
  var newmant=null;
  adjust=this.mant.length-len;
  if (adjust<=0)
   return this; // nowt to do

  this.exp=this.exp+adjust; // exponent of result
  sign=this.ind; // save [assumes -1, 0, 1]
  oldmant=this.mant; // save
  if (len>0)
   {
    // remove the unwanted digits
    this.mant=new Array(len);
    //--java.lang.System.arraycopy((java.lang.Object)oldmant,0,(java.lang.Object)mant,0,len);
    this.arraycopy(oldmant,0,this.mant,0,len);
    reuse=true; // can reuse mantissa
    first=oldmant[len]; // first of discarded digits
   }
  else
   {/* len<=0 */
    this.mant=this.ZERO.mant;
    this.ind=this.iszero;
    reuse=false; // cannot reuse mantissa
    if (len==0)
     first=oldmant[0];
    else
     first=0; // [virtual digit]
   }

  // decide rounding adjustment depending on mode, sign, and discarded digits
  increment=0; // bumper
  {modes:do{/*select*/
  if (mode==this.ROUND_HALF_UP)
   { // default first [most common]
    if (first>=5)
     increment=sign;
   }
  else if (mode==this.ROUND_UNNECESSARY)
   { // default for setScale()
    // discarding any non-zero digits is an error
    if ((!(this.allzero(oldmant,len))))
     throw "round(): Rounding necessary";
   }
  else if (mode==this.ROUND_HALF_DOWN)
   { // 0.5000 goes down
    if (first>5)
     increment=sign;
    else
     if (first==5)
      if ((!(this.allzero(oldmant,len+1))))
       increment=sign;
   }
  else if (mode==this.ROUND_HALF_EVEN)
   { // 0.5000 goes down if left digit even
    if (first>5)
     increment=sign;
    else
     if (first==5)
      {
       if ((!(this.allzero(oldmant,len+1))))
        increment=sign;
       else /* 0.5000 */
        if ((((this.mant[this.mant.length-1])%2))==1)
         increment=sign;
      }
   }
  else if (mode==this.ROUND_DOWN)
   {} // never increment
  else if (mode==this.ROUND_UP)
   { // increment if discarded non-zero
    if ((!(this.allzero(oldmant,len))))
     increment=sign;
   }
  else if (mode==this.ROUND_CEILING)
   { // more positive
    if (sign>0)
     if ((!(this.allzero(oldmant,len))))
      increment=sign;
   }
  else if (mode==this.ROUND_FLOOR)
   { // more negative
    if (sign<0)
     if ((!(this.allzero(oldmant,len))))
      increment=sign;
   }
  else{
   throw "round(): Bad round value: "+mode;
  }
  }while(false);}/*modes*/

  if (increment!=0)
   {bump:do{
    if (this.ind==this.iszero)
     {
      // we must not subtract from 0, but result is trivial anyway
      this.mant=this.ONE.mant;
      this.ind=increment;
     }
    else
     {
      // mantissa is non-0; we can safely add or subtract 1
      if (this.ind==this.isneg)
       increment=-increment;
      newmant=this.byteaddsub(this.mant,this.mant.length,this.ONE.mant,1,increment,reuse);
      if (newmant.length>this.mant.length)
       { // had a carry
        // drop rightmost digit and raise exponent
        this.exp++;
        // mant is already the correct length
        //java.lang.System.arraycopy((java.lang.Object)newmant,0,(java.lang.Object)mant,0,mant.length);
        this.arraycopy(newmant,0,this.mant,0,this.mant.length);
       }
      else
       this.mant=newmant;
     }
   }while(false);}/*bump*/
  // rounding can increase exponent significantly
  if (this.exp>this.MaxExp)
   throw "round(): Exponent Overflow: "+this.exp;
  return this;
  }

 /* <sgml> Test if rightmost digits are all 0.
    Arg1 is a mantissa array to test
    Arg2 is the offset of first digit to check
            [may be negative; if so, digits to left are 0's]
    returns 1 if all the digits starting at Arg2 are 0

    Arg2 may be beyond array bounds, in which case 1 is returned
    </sgml> */

 //--private static final boolean allzero(byte array[],int start){
 function allzero(array, start) {
  //--int i=0;
  var i=0;
  if (start<0)
   start=0;
  {var $25=array.length-1;i=start;i:for(;i<=$25;i++){
   if (array[i]!=0)
    return false;
   }
  }/*i*/
  return true;
  }

 /* <sgml> Carry out final checks and canonicalization
    <p>
    This finishes off the current number by:
      1. Rounding if necessary (NB: length includes leading zeros)
      2. Stripping trailing zeros (if requested and \PLAIN)
      3. Stripping leading zeros (always)
      4. Selecting exponential notation (if required)
      5. Converting a zero result to just '0' (if \PLAIN)
    In practice, these operations overlap and share code.
    It always sets form.
    </sgml>
    Arg1 is requested MathContext (length to round to, trigger, and FORM)
    Arg2 is 1 if trailing insignificant zeros should be removed after
         round (for division, etc.), provided that set.form isn't PLAIN.
   returns this, for convenience
   */

 //--private com.ibm.icu.math.BigDecimal finish(com.ibm.icu.math.MathContext set,boolean strip){
 function finish(set, strip) {
  //--int d=0;
  var d=0;
  //--int i=0;
  var i=0;
  //--byte newmant[]=null;
  var newmant=null;
  //--int mag=0;
  var mag=0;
  //--int sig=0;
  var sig=0;
  /* Round if mantissa too long and digits requested */
  if (set.digits!=0)
   if (this.mant.length>set.digits)
    this.round(set);

  /* If strip requested (and standard formatting), remove
     insignificant trailing zeros. */
  if (strip)
   if (set.form!=MathContext.prototype.PLAIN)
    {
     d=this.mant.length;
     /* see if we need to drop any trailing zeros */
     {i=d-1;i:for(;i>=1;i--){
      if (this.mant[i]!=0)
       break i;
      d--;
      this.exp++;
      }
     }/*i*/
     if (d<this.mant.length)
      {/* need to reduce */
       newmant=new Array(d);
       //--java.lang.System.arraycopy((java.lang.Object)this.mant,0,(java.lang.Object)newmant,0,d);
       this.arraycopy(this.mant,0,newmant,0,d);
       this.mant=newmant;
      }
    }

  this.form=MathContext.prototype.PLAIN; // preset

  /* Now check for leading- and all- zeros in mantissa */
  {var $26=this.mant.length;i=0;i:for(;$26>0;$26--,i++){
   if (this.mant[i]!=0)
    {
     // non-0 result; ind will be correct
     // remove leading zeros [e.g., after subtract]
     if (i>0)
      {delead:do{
       newmant=new Array(this.mant.length-i);
       //--java.lang.System.arraycopy((java.lang.Object)this.mant,i,(java.lang.Object)newmant,0,this.mant.length-i);
       this.arraycopy(this.mant,i,newmant,0,this.mant.length-i);
       this.mant=newmant;
      }while(false);}/*delead*/
     // now determine form if not PLAIN
     mag=this.exp+this.mant.length;
     if (mag>0)
      { // most common path
       if (mag>set.digits)
        if (set.digits!=0)
         this.form=set.form;
       if ((mag-1)<=this.MaxExp)
        return this; // no overflow; quick return
      }
     else
      if (mag<(-5))
       this.form=set.form;
     /* check for overflow */
     mag--;
     if ((mag<this.MinExp)||(mag>this.MaxExp))
      {overflow:do{
       // possible reprieve if form is engineering
       if (this.form==MathContext.prototype.ENGINEERING)
        {
         sig=mag%3; // leftover
         if (sig<0)
          sig=3+sig; // negative exponent
         mag=mag-sig; // exponent to use
         // 1999.06.29: second test here must be MaxExp
         if (mag>=this.MinExp)
          if (mag<=this.MaxExp)
           break overflow;
        }
       throw "finish(): Exponent Overflow: "+mag;
      }while(false);}/*overflow*/
     return this;
    }
   }
  }/*i*/

  // Drop through to here only if mantissa is all zeros
  this.ind=this.iszero;
  {/*select*/
  if (set.form!=MathContext.prototype.PLAIN)
   this.exp=0; // standard result; go to '0'
  else if (this.exp>0)
   this.exp=0; // +ve exponent also goes to '0'
  else{
   // a plain number with -ve exponent; preserve and check exponent
   if (this.exp<this.MinExp)
    throw "finish(): Exponent Overflow: "+this.exp;
  }
  }
  this.mant=this.ZERO.mant; // canonical mantissa
  return this;
  }

 function isGreaterThan(other) {
  return this.compareTo(other) > 0;
 };
 function isLessThan(other) {
  return this.compareTo(other) < 0;
 };
 function isGreaterThanOrEqualTo(other) {
  return this.compareTo(other) >= 0;
 };
 function isLessThanOrEqualTo(other) {
  return this.compareTo(other) <= 0;
 };
 function isPositive() {
  return this.compareTo(BigDecimal.prototype.ZERO) > 0;
 };
 function isNegative() {
  return this.compareTo(BigDecimal.prototype.ZERO) < 0;
 };
 function isZero() {
  return this.setScale(0, BigDecimal.ROUND_UP).equals(BigDecimal.prototype.ZERO);
 };
return BigDecimal;
})(MathContext); // BigDecimal depends on MathContext

if (typeof define === "function" && define.amd != null) {
	// AMD-loader compatible resource declaration
	// require('bigdecimal') will return JS Object:
	// {'BigDecimal':BigDecimalPointer, 'MathContext':MathContextPointer}
	define({'BigDecimal':BigDecimal, 'MathContext':MathContext});
} else if (typeof this === "object"){
	// global-polluting outcome.
	this.BigDecimal = BigDecimal;
	this.MathContext = MathContext;
}

}).call(this); // in browser 'this' will be 'window' or simulated window object in AMD-loading scenarios.
(function(){var m,k=function(){this.form=this.digits=0;this.lostDigits=!1;this.roundingMode=0;var a=this.DEFAULT_FORM,b=this.DEFAULT_LOSTDIGITS,c=this.DEFAULT_ROUNDINGMODE;if(4==k.arguments.length)a=k.arguments[1],b=k.arguments[2],c=k.arguments[3];else if(3==k.arguments.length)a=k.arguments[1],b=k.arguments[2];else if(2==k.arguments.length)a=k.arguments[1];else if(1!=k.arguments.length)throw"MathContext(): "+k.arguments.length+" arguments given; expected 1 to 4";var d=k.arguments[0];if(d!=this.DEFAULT_DIGITS){if(d<
this.MIN_DIGITS)throw"MathContext(): Digits too small: "+d;if(d>this.MAX_DIGITS)throw"MathContext(): Digits too large: "+d;}if(a!=this.SCIENTIFIC&&a!=this.ENGINEERING&&a!=this.PLAIN)throw"MathContext() Bad form value: "+a;if(!this.isValidRound(c))throw"MathContext(): Bad roundingMode value: "+c;this.digits=d;this.form=a;this.lostDigits=b;this.roundingMode=c};k.prototype.getDigits=function(){return this.digits};k.prototype.getForm=function(){return this.form};k.prototype.getLostDigits=function(){return this.lostDigits};
k.prototype.getRoundingMode=function(){return this.roundingMode};k.prototype.toString=function(){var a=null,b=0,c=null,a=this.form==this.SCIENTIFIC?"SCIENTIFIC":this.form==this.ENGINEERING?"ENGINEERING":"PLAIN",d=this.ROUNDS.length,b=0;a:for(;0<d;d--,b++)if(this.roundingMode==this.ROUNDS[b]){c=this.ROUNDWORDS[b];break a}return"digits="+this.digits+" form="+a+" lostDigits="+(this.lostDigits?"1":"0")+" roundingMode="+c};k.prototype.isValidRound=function(a){var b=0,c=this.ROUNDS.length,b=0;for(;0<c;c--,
b++)if(a==this.ROUNDS[b])return!0;return!1};k.PLAIN=k.prototype.PLAIN=0;k.SCIENTIFIC=k.prototype.SCIENTIFIC=1;k.ENGINEERING=k.prototype.ENGINEERING=2;k.ROUND_CEILING=k.prototype.ROUND_CEILING=2;k.ROUND_DOWN=k.prototype.ROUND_DOWN=1;k.ROUND_FLOOR=k.prototype.ROUND_FLOOR=3;k.ROUND_HALF_DOWN=k.prototype.ROUND_HALF_DOWN=5;k.ROUND_HALF_EVEN=k.prototype.ROUND_HALF_EVEN=6;k.ROUND_HALF_UP=k.prototype.ROUND_HALF_UP=4;k.ROUND_UNNECESSARY=k.prototype.ROUND_UNNECESSARY=7;k.ROUND_UP=k.prototype.ROUND_UP=0;k.prototype.DEFAULT_FORM=
k.prototype.SCIENTIFIC;k.prototype.DEFAULT_DIGITS=9;k.prototype.DEFAULT_LOSTDIGITS=!1;k.prototype.DEFAULT_ROUNDINGMODE=k.prototype.ROUND_HALF_UP;k.prototype.MIN_DIGITS=0;k.prototype.MAX_DIGITS=999999999;k.prototype.ROUNDS=[k.prototype.ROUND_HALF_UP,k.prototype.ROUND_UNNECESSARY,k.prototype.ROUND_CEILING,k.prototype.ROUND_DOWN,k.prototype.ROUND_FLOOR,k.prototype.ROUND_HALF_DOWN,k.prototype.ROUND_HALF_EVEN,k.prototype.ROUND_UP];k.prototype.ROUNDWORDS="ROUND_HALF_UP ROUND_UNNECESSARY ROUND_CEILING ROUND_DOWN ROUND_FLOOR ROUND_HALF_DOWN ROUND_HALF_EVEN ROUND_UP".split(" ");
k.prototype.DEFAULT=new k(k.prototype.DEFAULT_DIGITS,k.prototype.DEFAULT_FORM,k.prototype.DEFAULT_LOSTDIGITS,k.prototype.DEFAULT_ROUNDINGMODE);m=k;var v,G=function(a,b){return(a-a%b)/b},K=function(a){var b=Array(a),c;for(c=0;c<a;++c)b[c]=0;return b},h=function(){this.ind=0;this.form=m.prototype.PLAIN;this.mant=null;this.exp=0;if(0!=h.arguments.length){var a,b,c;1==h.arguments.length?(a=h.arguments[0],b=0,c=a.length):(a=h.arguments[0],b=h.arguments[1],c=h.arguments[2]);"string"==typeof a&&(a=a.split(""));
var d,e,i,f,g,j=0,l=0;e=!1;var k=l=l=j=0,q=0;f=0;0>=c&&this.bad("BigDecimal(): ",a);this.ind=this.ispos;"-"==a[0]?(c--,0==c&&this.bad("BigDecimal(): ",a),this.ind=this.isneg,b++):"+"==a[0]&&(c--,0==c&&this.bad("BigDecimal(): ",a),b++);e=d=!1;i=0;g=f=-1;k=c;j=b;a:for(;0<k;k--,j++){l=a[j];if("0"<=l&&"9">=l){g=j;i++;continue a}if("."==l){0<=f&&this.bad("BigDecimal(): ",a);f=j-b;continue a}if("e"!=l&&"E"!=l){("0">l||"9"<l)&&this.bad("BigDecimal(): ",a);d=!0;g=j;i++;continue a}j-b>c-2&&this.bad("BigDecimal(): ",
a);e=!1;"-"==a[j+1]?(e=!0,j+=2):j="+"==a[j+1]?j+2:j+1;l=c-(j-b);(0==l||9<l)&&this.bad("BigDecimal(): ",a);c=l;l=j;for(;0<c;c--,l++)k=a[l],"0">k&&this.bad("BigDecimal(): ",a),"9"<k?this.bad("BigDecimal(): ",a):q=k-0,this.exp=10*this.exp+q;e&&(this.exp=-this.exp);e=!0;break a}0==i&&this.bad("BigDecimal(): ",a);0<=f&&(this.exp=this.exp+f-i);q=g-1;j=b;a:for(;j<=q;j++)if(l=a[j],"0"==l)b++,f--,i--;else if("."==l)b++,f--;else break a;this.mant=Array(i);l=b;if(d){b=i;j=0;for(;0<b;b--,j++)j==f&&l++,k=a[l],
"9">=k?this.mant[j]=k-0:this.bad("BigDecimal(): ",a),l++}else{b=i;j=0;for(;0<b;b--,j++)j==f&&l++,this.mant[j]=a[l]-0,l++}0==this.mant[0]?(this.ind=this.iszero,0<this.exp&&(this.exp=0),e&&(this.mant=this.ZERO.mant,this.exp=0)):e&&(this.form=m.prototype.SCIENTIFIC,f=this.exp+this.mant.length-1,(f<this.MinExp||f>this.MaxExp)&&this.bad("BigDecimal(): ",a))}},H=function(){var a;if(1==H.arguments.length)a=H.arguments[0];else if(0==H.arguments.length)a=this.plainMC;else throw"abs(): "+H.arguments.length+
" arguments given; expected 0 or 1";return this.ind==this.isneg?this.negate(a):this.plus(a)},w=function(){var a;if(2==w.arguments.length)a=w.arguments[1];else if(1==w.arguments.length)a=this.plainMC;else throw"add(): "+w.arguments.length+" arguments given; expected 1 or 2";var b=w.arguments[0],c,d,e,i,f,g,j,l=0;d=l=0;var l=null,k=l=0,q=0,t=0,s=0,n=0;a.lostDigits&&this.checkdigits(b,a.digits);c=this;if(0==c.ind&&a.form!=m.prototype.PLAIN)return b.plus(a);if(0==b.ind&&a.form!=m.prototype.PLAIN)return c.plus(a);
d=a.digits;0<d&&(c.mant.length>d&&(c=this.clone(c).round(a)),b.mant.length>d&&(b=this.clone(b).round(a)));e=new h;i=c.mant;f=c.mant.length;g=b.mant;j=b.mant.length;if(c.exp==b.exp)e.exp=c.exp;else if(c.exp>b.exp){l=f+c.exp-b.exp;if(l>=j+d+1&&0<d)return e.mant=i,e.exp=c.exp,e.ind=c.ind,f<d&&(e.mant=this.extend(c.mant,d),e.exp-=d-f),e.finish(a,!1);e.exp=b.exp;l>d+1&&0<d&&(l=l-d-1,j-=l,e.exp+=l,l=d+1);l>f&&(f=l)}else{l=j+b.exp-c.exp;if(l>=f+d+1&&0<d)return e.mant=g,e.exp=b.exp,e.ind=b.ind,j<d&&(e.mant=
this.extend(b.mant,d),e.exp-=d-j),e.finish(a,!1);e.exp=c.exp;l>d+1&&0<d&&(l=l-d-1,f-=l,e.exp+=l,l=d+1);l>j&&(j=l)}e.ind=c.ind==this.iszero?this.ispos:c.ind;if((c.ind==this.isneg?1:0)==(b.ind==this.isneg?1:0))d=1;else{do{d=-1;do if(b.ind!=this.iszero)if(f<j||c.ind==this.iszero)l=i,i=g,g=l,l=f,f=j,j=l,e.ind=-e.ind;else if(!(f>j)){k=l=0;q=i.length-1;t=g.length-1;c:for(;;){if(l<=q)s=i[l];else{if(k>t){if(a.form!=m.prototype.PLAIN)return this.ZERO;break c}s=0}n=k<=t?g[k]:0;if(s!=n){s<n&&(l=i,i=g,g=l,l=
f,f=j,j=l,e.ind=-e.ind);break c}l++;k++}}while(0)}while(0)}e.mant=this.byteaddsub(i,f,g,j,d,!1);return e.finish(a,!1)},x=function(){var a;if(2==x.arguments.length)a=x.arguments[1];else if(1==x.arguments.length)a=this.plainMC;else throw"compareTo(): "+x.arguments.length+" arguments given; expected 1 or 2";var b=x.arguments[0],c=0,c=0;a.lostDigits&&this.checkdigits(b,a.digits);if(this.ind==b.ind&&this.exp==b.exp){c=this.mant.length;if(c<b.mant.length)return-this.ind;if(c>b.mant.length)return this.ind;
if(c<=a.digits||0==a.digits){a=c;c=0;for(;0<a;a--,c++){if(this.mant[c]<b.mant[c])return-this.ind;if(this.mant[c]>b.mant[c])return this.ind}return 0}}else{if(this.ind<b.ind)return-1;if(this.ind>b.ind)return 1}b=this.clone(b);b.ind=-b.ind;return this.add(b,a).ind},p=function(){var a,b=-1;if(2==p.arguments.length)a="number"==typeof p.arguments[1]?new m(0,m.prototype.PLAIN,!1,p.arguments[1]):p.arguments[1];else if(3==p.arguments.length){b=p.arguments[1];if(0>b)throw"divide(): Negative scale: "+b;a=new m(0,
m.prototype.PLAIN,!1,p.arguments[2])}else if(1==p.arguments.length)a=this.plainMC;else throw"divide(): "+p.arguments.length+" arguments given; expected between 1 and 3";return this.dodivide("D",p.arguments[0],a,b)},y=function(){var a;if(2==y.arguments.length)a=y.arguments[1];else if(1==y.arguments.length)a=this.plainMC;else throw"divideInteger(): "+y.arguments.length+" arguments given; expected 1 or 2";return this.dodivide("I",y.arguments[0],a,0)},z=function(){var a;if(2==z.arguments.length)a=z.arguments[1];
else if(1==z.arguments.length)a=this.plainMC;else throw"max(): "+z.arguments.length+" arguments given; expected 1 or 2";var b=z.arguments[0];return 0<=this.compareTo(b,a)?this.plus(a):b.plus(a)},A=function(){var a;if(2==A.arguments.length)a=A.arguments[1];else if(1==A.arguments.length)a=this.plainMC;else throw"min(): "+A.arguments.length+" arguments given; expected 1 or 2";var b=A.arguments[0];return 0>=this.compareTo(b,a)?this.plus(a):b.plus(a)},B=function(){var a;if(2==B.arguments.length)a=B.arguments[1];
else if(1==B.arguments.length)a=this.plainMC;else throw"multiply(): "+B.arguments.length+" arguments given; expected 1 or 2";var b=B.arguments[0],c,d,e,i=e=null,f,g=0,j,l=0,k=0;a.lostDigits&&this.checkdigits(b,a.digits);c=this;d=0;e=a.digits;0<e?(c.mant.length>e&&(c=this.clone(c).round(a)),b.mant.length>e&&(b=this.clone(b).round(a))):(0<c.exp&&(d+=c.exp),0<b.exp&&(d+=b.exp));c.mant.length<b.mant.length?(e=c.mant,i=b.mant):(e=b.mant,i=c.mant);f=e.length+i.length-1;g=9<e[0]*i[0]?f+1:f;j=new h;var g=
this.createArrayWithZeros(g),m=e.length,l=0;for(;0<m;m--,l++)k=e[l],0!=k&&(g=this.byteaddsub(g,g.length,i,f,k,!0)),f--;j.ind=c.ind*b.ind;j.exp=c.exp+b.exp-d;j.mant=0==d?g:this.extend(g,g.length+d);return j.finish(a,!1)},I=function(){var a;if(1==I.arguments.length)a=I.arguments[0];else if(0==I.arguments.length)a=this.plainMC;else throw"negate(): "+I.arguments.length+" arguments given; expected 0 or 1";var b;a.lostDigits&&this.checkdigits(null,a.digits);b=this.clone(this);b.ind=-b.ind;return b.finish(a,
!1)},J=function(){var a;if(1==J.arguments.length)a=J.arguments[0];else if(0==J.arguments.length)a=this.plainMC;else throw"plus(): "+J.arguments.length+" arguments given; expected 0 or 1";a.lostDigits&&this.checkdigits(null,a.digits);return a.form==m.prototype.PLAIN&&this.form==m.prototype.PLAIN&&(this.mant.length<=a.digits||0==a.digits)?this:this.clone(this).finish(a,!1)},C=function(){var a;if(2==C.arguments.length)a=C.arguments[1];else if(1==C.arguments.length)a=this.plainMC;else throw"pow(): "+
C.arguments.length+" arguments given; expected 1 or 2";var b=C.arguments[0],c,d,e,i=e=0,f,g=0;a.lostDigits&&this.checkdigits(b,a.digits);c=b.intcheck(this.MinArg,this.MaxArg);d=this;e=a.digits;if(0==e){if(b.ind==this.isneg)throw"pow(): Negative power: "+b.toString();e=0}else{if(b.mant.length+b.exp>e)throw"pow(): Too many digits: "+b.toString();d.mant.length>e&&(d=this.clone(d).round(a));i=b.mant.length+b.exp;e=e+i+1}e=new m(e,a.form,!1,a.roundingMode);i=this.ONE;if(0==c)return i;0>c&&(c=-c);f=!1;
g=1;a:for(;;g++){c<<=1;0>c&&(f=!0,i=i.multiply(d,e));if(31==g)break a;if(!f)continue a;i=i.multiply(i,e)}0>b.ind&&(i=this.ONE.divide(i,e));return i.finish(a,!0)},D=function(){var a;if(2==D.arguments.length)a=D.arguments[1];else if(1==D.arguments.length)a=this.plainMC;else throw"remainder(): "+D.arguments.length+" arguments given; expected 1 or 2";return this.dodivide("R",D.arguments[0],a,-1)},E=function(){var a;if(2==E.arguments.length)a=E.arguments[1];else if(1==E.arguments.length)a=this.plainMC;
else throw"subtract(): "+E.arguments.length+" arguments given; expected 1 or 2";var b=E.arguments[0];a.lostDigits&&this.checkdigits(b,a.digits);b=this.clone(b);b.ind=-b.ind;return this.add(b,a)},r=function(){var a,b,c,d;if(6==r.arguments.length)a=r.arguments[2],b=r.arguments[3],c=r.arguments[4],d=r.arguments[5];else if(2==r.arguments.length)b=a=-1,c=m.prototype.SCIENTIFIC,d=this.ROUND_HALF_UP;else throw"format(): "+r.arguments.length+" arguments given; expected 2 or 6";var e=r.arguments[0],i=r.arguments[1],
f,g=0,g=g=0,j=null,l=j=g=0;f=0;g=null;l=j=0;(-1>e||0==e)&&this.badarg("format",1,e);-1>i&&this.badarg("format",2,i);(-1>a||0==a)&&this.badarg("format",3,a);-1>b&&this.badarg("format",4,b);c!=m.prototype.SCIENTIFIC&&c!=m.prototype.ENGINEERING&&(-1==c?c=m.prototype.SCIENTIFIC:this.badarg("format",5,c));if(d!=this.ROUND_HALF_UP)try{-1==d?d=this.ROUND_HALF_UP:new m(9,m.prototype.SCIENTIFIC,!1,d)}catch(h){this.badarg("format",6,d)}f=this.clone(this);-1==b?f.form=m.prototype.PLAIN:f.ind==this.iszero?f.form=
m.prototype.PLAIN:(g=f.exp+f.mant.length,f.form=g>b?c:-5>g?c:m.prototype.PLAIN);if(0<=i)a:for(;;){f.form==m.prototype.PLAIN?g=-f.exp:f.form==m.prototype.SCIENTIFIC?g=f.mant.length-1:(g=(f.exp+f.mant.length-1)%3,0>g&&(g=3+g),g++,g=g>=f.mant.length?0:f.mant.length-g);if(g==i)break a;if(g<i){j=this.extend(f.mant,f.mant.length+i-g);f.mant=j;f.exp-=i-g;if(f.exp<this.MinExp)throw"format(): Exponent Overflow: "+f.exp;break a}g-=i;if(g>f.mant.length){f.mant=this.ZERO.mant;f.ind=this.iszero;f.exp=0;continue a}j=
f.mant.length-g;l=f.exp;f.round(j,d);if(f.exp-l==g)break a}b=f.layout();if(0<e){c=b.length;f=0;a:for(;0<c;c--,f++){if("."==b[f])break a;if("E"==b[f])break a}f>e&&this.badarg("format",1,e);if(f<e){g=Array(b.length+e-f);e-=f;j=0;for(;0<e;e--,j++)g[j]=" ";this.arraycopy(b,0,g,j,b.length);b=g}}if(0<a){e=b.length-1;f=b.length-1;a:for(;0<e;e--,f--)if("E"==b[f])break a;if(0==f){g=Array(b.length+a+2);this.arraycopy(b,0,g,0,b.length);a+=2;j=b.length;for(;0<a;a--,j++)g[j]=" ";b=g}else if(l=b.length-f-2,l>a&&
this.badarg("format",3,a),l<a){g=Array(b.length+a-l);this.arraycopy(b,0,g,0,f+2);a-=l;j=f+2;for(;0<a;a--,j++)g[j]="0";this.arraycopy(b,f+2,g,j,l);b=g}}return b.join("")},F=function(){var a;if(2==F.arguments.length)a=F.arguments[1];else if(1==F.arguments.length)a=this.ROUND_UNNECESSARY;else throw"setScale(): "+F.arguments.length+" given; expected 1 or 2";var b=F.arguments[0],c,d;c=c=0;c=this.scale();if(c==b&&this.form==m.prototype.PLAIN)return this;d=this.clone(this);if(c<=b)c=0==c?d.exp+b:b-c,d.mant=
this.extend(d.mant,d.mant.length+c),d.exp=-b;else{if(0>b)throw"setScale(): Negative scale: "+b;c=d.mant.length-(c-b);d=d.round(c,a);d.exp!=-b&&(d.mant=this.extend(d.mant,d.mant.length+1),d.exp-=1)}d.form=m.prototype.PLAIN;return d};v=function(){var a,b=0,c=0;a=Array(190);b=0;a:for(;189>=b;b++){c=b-90;if(0<=c){a[b]=c%10;h.prototype.bytecar[b]=G(c,10);continue a}c+=100;a[b]=c%10;h.prototype.bytecar[b]=G(c,10)-10}return a};var u=function(){var a,b;if(2==u.arguments.length)a=u.arguments[0],b=u.arguments[1];
else if(1==u.arguments.length)b=u.arguments[0],a=b.digits,b=b.roundingMode;else throw"round(): "+u.arguments.length+" arguments given; expected 1 or 2";var c,d,e=!1,i=0,f;c=null;c=this.mant.length-a;if(0>=c)return this;this.exp+=c;c=this.ind;d=this.mant;0<a?(this.mant=Array(a),this.arraycopy(d,0,this.mant,0,a),e=!0,i=d[a]):(this.mant=this.ZERO.mant,this.ind=this.iszero,e=!1,i=0==a?d[0]:0);f=0;if(b==this.ROUND_HALF_UP)5<=i&&(f=c);else if(b==this.ROUND_UNNECESSARY){if(!this.allzero(d,a))throw"round(): Rounding necessary";
}else if(b==this.ROUND_HALF_DOWN)5<i?f=c:5==i&&(this.allzero(d,a+1)||(f=c));else if(b==this.ROUND_HALF_EVEN)5<i?f=c:5==i&&(this.allzero(d,a+1)?1==this.mant[this.mant.length-1]%2&&(f=c):f=c);else if(b!=this.ROUND_DOWN)if(b==this.ROUND_UP)this.allzero(d,a)||(f=c);else if(b==this.ROUND_CEILING)0<c&&(this.allzero(d,a)||(f=c));else if(b==this.ROUND_FLOOR)0>c&&(this.allzero(d,a)||(f=c));else throw"round(): Bad round value: "+b;0!=f&&(this.ind==this.iszero?(this.mant=this.ONE.mant,this.ind=f):(this.ind==
this.isneg&&(f=-f),c=this.byteaddsub(this.mant,this.mant.length,this.ONE.mant,1,f,e),c.length>this.mant.length?(this.exp++,this.arraycopy(c,0,this.mant,0,this.mant.length)):this.mant=c));if(this.exp>this.MaxExp)throw"round(): Exponent Overflow: "+this.exp;return this};h.prototype.div=G;h.prototype.arraycopy=function(a,b,c,d,e){var i;if(d>b)for(i=e-1;0<=i;--i)c[i+d]=a[i+b];else for(i=0;i<e;++i)c[i+d]=a[i+b]};h.prototype.createArrayWithZeros=K;h.prototype.abs=H;h.prototype.add=w;h.prototype.compareTo=
x;h.prototype.divide=p;h.prototype.divideInteger=y;h.prototype.max=z;h.prototype.min=A;h.prototype.multiply=B;h.prototype.negate=I;h.prototype.plus=J;h.prototype.pow=C;h.prototype.remainder=D;h.prototype.subtract=E;h.prototype.equals=function(a){var b=0,c=null,d=null;if(null==a||!(a instanceof h)||this.ind!=a.ind)return!1;if(this.mant.length==a.mant.length&&this.exp==a.exp&&this.form==a.form){c=this.mant.length;b=0;for(;0<c;c--,b++)if(this.mant[b]!=a.mant[b])return!1}else{c=this.layout();d=a.layout();
if(c.length!=d.length)return!1;a=c.length;b=0;for(;0<a;a--,b++)if(c[b]!=d[b])return!1}return!0};h.prototype.format=r;h.prototype.intValueExact=function(){var a,b=0,c,d=0;a=0;if(this.ind==this.iszero)return 0;a=this.mant.length-1;if(0>this.exp){a+=this.exp;if(!this.allzero(this.mant,a+1))throw"intValueExact(): Decimal part non-zero: "+this.toString();if(0>a)return 0;b=0}else{if(9<this.exp+a)throw"intValueExact(): Conversion overflow: "+this.toString();b=this.exp}c=0;var e=a+b,d=0;for(;d<=e;d++)c*=
10,d<=a&&(c+=this.mant[d]);if(9==a+b&&(a=G(c,1E9),a!=this.mant[0])){if(-2147483648==c&&this.ind==this.isneg&&2==this.mant[0])return c;throw"intValueExact(): Conversion overflow: "+this.toString();}return this.ind==this.ispos?c:-c};h.prototype.movePointLeft=function(a){var b;b=this.clone(this);b.exp-=a;return b.finish(this.plainMC,!1)};h.prototype.movePointRight=function(a){var b;b=this.clone(this);b.exp+=a;return b.finish(this.plainMC,!1)};h.prototype.scale=function(){return 0<=this.exp?0:-this.exp};
h.prototype.setScale=F;h.prototype.signum=function(){return this.ind};h.prototype.toString=function(){return this.layout().join("")};h.prototype.layout=function(){var a,b=0,b=null,c=0,d=0;a=0;var d=null,e,b=0;a=Array(this.mant.length);c=this.mant.length;b=0;for(;0<c;c--,b++)a[b]=this.mant[b]+"";if(this.form!=m.prototype.PLAIN){b="";this.ind==this.isneg&&(b+="-");c=this.exp+a.length-1;if(this.form==m.prototype.SCIENTIFIC)b+=a[0],1<a.length&&(b+="."),b+=a.slice(1).join("");else if(d=c%3,0>d&&(d=3+d),
c-=d,d++,d>=a.length){b+=a.join("");for(a=d-a.length;0<a;a--)b+="0"}else b+=a.slice(0,d).join(""),b=b+"."+a.slice(d).join("");0!=c&&(0>c?(a="-",c=-c):a="+",b+="E",b+=a,b+=c);return b.split("")}if(0==this.exp){if(0<=this.ind)return a;d=Array(a.length+1);d[0]="-";this.arraycopy(a,0,d,1,a.length);return d}c=this.ind==this.isneg?1:0;e=this.exp+a.length;if(1>e){b=c+2-this.exp;d=Array(b);0!=c&&(d[0]="-");d[c]="0";d[c+1]=".";var i=-e,b=c+2;for(;0<i;i--,b++)d[b]="0";this.arraycopy(a,0,d,c+2-e,a.length);return d}if(e>
a.length){d=Array(c+e);0!=c&&(d[0]="-");this.arraycopy(a,0,d,c,a.length);e-=a.length;b=c+a.length;for(;0<e;e--,b++)d[b]="0";return d}b=c+1+a.length;d=Array(b);0!=c&&(d[0]="-");this.arraycopy(a,0,d,c,e);d[c+e]=".";this.arraycopy(a,e,d,c+e+1,a.length-e);return d};h.prototype.intcheck=function(a,b){var c;c=this.intValueExact();if(c<a||c>b)throw"intcheck(): Conversion overflow: "+c;return c};h.prototype.dodivide=function(a,b,c,d){var e,i,f,g,j,l,k,q,t,s=0,n=0,p=0;i=i=n=n=n=0;e=null;e=e=0;e=null;c.lostDigits&&
this.checkdigits(b,c.digits);e=this;if(0==b.ind)throw"dodivide(): Divide by 0";if(0==e.ind)return c.form!=m.prototype.PLAIN?this.ZERO:-1==d?e:e.setScale(d);i=c.digits;0<i?(e.mant.length>i&&(e=this.clone(e).round(c)),b.mant.length>i&&(b=this.clone(b).round(c))):(-1==d&&(d=e.scale()),i=e.mant.length,d!=-e.exp&&(i=i+d+e.exp),i=i-(b.mant.length-1)-b.exp,i<e.mant.length&&(i=e.mant.length),i<b.mant.length&&(i=b.mant.length));f=e.exp-b.exp+e.mant.length-b.mant.length;if(0>f&&"D"!=a)return"I"==a?this.ZERO:
this.clone(e).finish(c,!1);g=new h;g.ind=e.ind*b.ind;g.exp=f;g.mant=this.createArrayWithZeros(i+1);j=i+i+1;f=this.extend(e.mant,j);l=j;k=b.mant;q=j;t=10*k[0]+1;1<k.length&&(t+=k[1]);j=0;a:for(;;){s=0;b:for(;;){if(l<q)break b;if(l==q){c:do{var r=l,n=0;for(;0<r;r--,n++){p=n<k.length?k[n]:0;if(f[n]<p)break b;if(f[n]>p)break c}s++;g.mant[j]=s;j++;f[0]=0;break a}while(0);n=f[0]}else n=10*f[0],1<l&&(n+=f[1]);n=G(10*n,t);0==n&&(n=1);s+=n;f=this.byteaddsub(f,l,k,q,-n,!0);if(0!=f[0])continue b;p=l-2;n=0;c:for(;n<=
p;n++){if(0!=f[n])break c;l--}if(0==n)continue b;this.arraycopy(f,n,f,0,l)}if(0!=j||0!=s){g.mant[j]=s;j++;if(j==i+1)break a;if(0==f[0])break a}if(0<=d&&-g.exp>d)break a;if("D"!=a&&0>=g.exp)break a;g.exp-=1;q--}0==j&&(j=1);if("I"==a||"R"==a){if(j+g.exp>i)throw"dodivide(): Integer overflow";if("R"==a){do{if(0==g.mant[0])return this.clone(e).finish(c,!1);if(0==f[0])return this.ZERO;g.ind=e.ind;i=i+i+1-e.mant.length;g.exp=g.exp-i+e.exp;i=l;n=i-1;b:for(;1<=n&&g.exp<e.exp&&g.exp<b.exp;n--){if(0!=f[n])break b;
i--;g.exp+=1}i<f.length&&(e=Array(i),this.arraycopy(f,0,e,0,i),f=e);g.mant=f;return g.finish(c,!1)}while(0)}}else 0!=f[0]&&(e=g.mant[j-1],0==e%5&&(g.mant[j-1]=e+1));if(0<=d)return j!=g.mant.length&&(g.exp-=g.mant.length-j),e=g.mant.length-(-g.exp-d),g.round(e,c.roundingMode),g.exp!=-d&&(g.mant=this.extend(g.mant,g.mant.length+1),g.exp-=1),g.finish(c,!0);if(j==g.mant.length)g.round(c);else{if(0==g.mant[0])return this.ZERO;e=Array(j);this.arraycopy(g.mant,0,e,0,j);g.mant=e}return g.finish(c,!0)};h.prototype.bad=
function(a,b){throw a+"Not a number: "+b;};h.prototype.badarg=function(a,b,c){throw"Bad argument "+b+" to "+a+": "+c;};h.prototype.extend=function(a,b){var c;if(a.length==b)return a;c=K(b);this.arraycopy(a,0,c,0,a.length);return c};h.prototype.byteaddsub=function(a,b,c,d,e,i){var f,g,j,h,k,m,p=0;f=m=0;f=a.length;g=c.length;b-=1;h=j=d-1;h<b&&(h=b);d=null;i&&h+1==f&&(d=a);null==d&&(d=this.createArrayWithZeros(h+1));k=!1;1==e?k=!0:-1==e&&(k=!0);m=0;p=h;a:for(;0<=p;p--){0<=b&&(b<f&&(m+=a[b]),b--);0<=
j&&(j<g&&(m=k?0<e?m+c[j]:m-c[j]:m+c[j]*e),j--);if(10>m&&0<=m){do{d[p]=m;m=0;continue a}while(0)}m+=90;d[p]=this.bytedig[m];m=this.bytecar[m]}if(0==m)return d;c=null;i&&h+2==a.length&&(c=a);null==c&&(c=Array(h+2));c[0]=m;a=h+1;f=0;for(;0<a;a--,f++)c[f+1]=d[f];return c};h.prototype.diginit=v;h.prototype.clone=function(a){var b;b=new h;b.ind=a.ind;b.exp=a.exp;b.form=a.form;b.mant=a.mant;return b};h.prototype.checkdigits=function(a,b){if(0!=b){if(this.mant.length>b&&!this.allzero(this.mant,b))throw"Too many digits: "+
this.toString();if(null!=a&&a.mant.length>b&&!this.allzero(a.mant,b))throw"Too many digits: "+a.toString();}};h.prototype.round=u;h.prototype.allzero=function(a,b){var c=0;0>b&&(b=0);var d=a.length-1,c=b;for(;c<=d;c++)if(0!=a[c])return!1;return!0};h.prototype.finish=function(a,b){var c=0,d=0,e=null,c=d=0;0!=a.digits&&this.mant.length>a.digits&&this.round(a);if(b&&a.form!=m.prototype.PLAIN){c=this.mant.length;d=c-1;a:for(;1<=d;d--){if(0!=this.mant[d])break a;c--;this.exp++}c<this.mant.length&&(e=Array(c),
this.arraycopy(this.mant,0,e,0,c),this.mant=e)}this.form=m.prototype.PLAIN;c=this.mant.length;d=0;for(;0<c;c--,d++)if(0!=this.mant[d]){0<d&&(e=Array(this.mant.length-d),this.arraycopy(this.mant,d,e,0,this.mant.length-d),this.mant=e);d=this.exp+this.mant.length;if(0<d){if(d>a.digits&&0!=a.digits&&(this.form=a.form),d-1<=this.MaxExp)return this}else-5>d&&(this.form=a.form);d--;if(d<this.MinExp||d>this.MaxExp){b:do{if(this.form==m.prototype.ENGINEERING&&(c=d%3,0>c&&(c=3+c),d-=c,d>=this.MinExp&&d<=this.MaxExp))break b;
throw"finish(): Exponent Overflow: "+d;}while(0)}return this}this.ind=this.iszero;if(a.form!=m.prototype.PLAIN)this.exp=0;else if(0<this.exp)this.exp=0;else if(this.exp<this.MinExp)throw"finish(): Exponent Overflow: "+this.exp;this.mant=this.ZERO.mant;return this};h.prototype.isGreaterThan=function(a){return 0<this.compareTo(a)};h.prototype.isLessThan=function(a){return 0>this.compareTo(a)};h.prototype.isGreaterThanOrEqualTo=function(a){return 0<=this.compareTo(a)};h.prototype.isLessThanOrEqualTo=
function(a){return 0>=this.compareTo(a)};h.prototype.isPositive=function(){return 0<this.compareTo(h.prototype.ZERO)};h.prototype.isNegative=function(){return 0>this.compareTo(h.prototype.ZERO)};h.prototype.isZero=function(){return this.equals(h.prototype.ZERO)};h.ROUND_CEILING=h.prototype.ROUND_CEILING=m.prototype.ROUND_CEILING;h.ROUND_DOWN=h.prototype.ROUND_DOWN=m.prototype.ROUND_DOWN;h.ROUND_FLOOR=h.prototype.ROUND_FLOOR=m.prototype.ROUND_FLOOR;h.ROUND_HALF_DOWN=h.prototype.ROUND_HALF_DOWN=m.prototype.ROUND_HALF_DOWN;
h.ROUND_HALF_EVEN=h.prototype.ROUND_HALF_EVEN=m.prototype.ROUND_HALF_EVEN;h.ROUND_HALF_UP=h.prototype.ROUND_HALF_UP=m.prototype.ROUND_HALF_UP;h.ROUND_UNNECESSARY=h.prototype.ROUND_UNNECESSARY=m.prototype.ROUND_UNNECESSARY;h.ROUND_UP=h.prototype.ROUND_UP=m.prototype.ROUND_UP;h.prototype.ispos=1;h.prototype.iszero=0;h.prototype.isneg=-1;h.prototype.MinExp=-999999999;h.prototype.MaxExp=999999999;h.prototype.MinArg=-999999999;h.prototype.MaxArg=999999999;h.prototype.plainMC=new m(0,m.prototype.PLAIN);
h.prototype.bytecar=Array(190);h.prototype.bytedig=v();h.ZERO=h.prototype.ZERO=new h("0");h.ONE=h.prototype.ONE=new h("1");h.TEN=h.prototype.TEN=new h("10");v=h;"function"===typeof define&&null!=define.amd?define({BigDecimal:v,MathContext:m}):"object"===typeof this&&(this.BigDecimal=v,this.MathContext=m)}).call(this);
function SideModuleMan() {

	this.imUrlMap = {};
	this.downloadUrlMap = {};
	this.fileUploadUrlMap = {};
	this.loadedModuleThemesMap = {};
	this.loadedThemes = [];

	this.getModules = function () {
		return window.SModules;
	};

	this.getUrl = function (urlProp, modulePrefix) {
		modulePrefix = modulePrefix || this.getLocalModuleName();
		var module = window.SModules[modulePrefix];
		if(module){
			return module[urlProp];
		}
		throw "Module is not exist: ("+modulePrefix+")";
	};

	this.getSideUrl = function (modulePrefix) {
		return this.getUrl("side", modulePrefix) || csdc.DISPATCH_SIDE;
	};

	this.getAppUrl = function (modulePrefix, resourceUrl, bf) {
		var url;

		if(bf && window.getCloudInfo) {	// Şirkete ait url kullanılıyor.
			var cloudInfo = window.getCloudInfo(bf);
			if(cloudInfo) {
				url = cloudInfo.url;
			}
		}

		if(!url) {
			url = this.getUrl("app", modulePrefix);
		}

		if(typeof resourceUrl !== "string") {
			return url;
		}
		var slashIndex = url.lastIndexOf("/");
		if(slashIndex < 0) {
			return resourceUrl;
		} else {
			if(resourceUrl.indexOf("/") === 0) {// TODO mahmuty bu durumun ayrıca ele alınması gerekebilir
				var ssIndex = url.indexOf("//");
				if(ssIndex > 0) {
					slashIndex = url.indexOf("/", ssIndex + 2);
					return url.substring(0, slashIndex) + "/" + resourceUrl.substring(1);
				} else {
					return resourceUrl;
				}
			}
			if(resourceUrl.indexOf("http") > -1) {
				return resourceUrl;
			}
			return url.substring(0, slashIndex) + "/" + resourceUrl;
		}
	};

	this.getFullAppUrl = function (modulePrefix, resourceUrl, bf) {
		var url = this.getAppUrl(modulePrefix, resourceUrl, bf);
		var escapedStr = url.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
		var el = document.createElement('div');
		el.innerHTML = '<a href="' + escapedStr + '">x</a>';
		return el.firstChild.href;
	};

	this.getDispatchURL = function (modulePrefix) {
		var module = window.SModules[modulePrefix];
		if(module) {
			return module.app;
		}
		throw "Module is not exist: ("+modulePrefix+")";
	};

	this.getLocalModuleAppUrl = function () {
		return this.getLocalModuleUrl("app");
	};

	this.getLocalModuleSideUrl = function () {
		return this.getLocalModuleUrl("side");
	};

	this.getLocalModuleUrl = function (urlProp) {
		for(var prefix in window.SModules) {
			var m = window.SModules[prefix];
			if(m.isLocalModule) {
				return m[urlProp];
			}
		}
		return undefined;
	};

	this.getLocalModuleName = function () {
		if(!window.SModules) {
			return null;
		}
		for(var prefix in window.SModules) {
			var m = window.SModules[prefix];
			if(m.isLocalModule) {
				return prefix;
			}
		}
		return undefined;
	};

	this.getIMUrl = function (moduleName) {
		if(!this.imUrlMap[moduleName]) {
			var url = this.getUrl("im", moduleName);//önce sidemodule nesnesine bak url orada varsa oradan al yoksa eski yapıyı destekle.
			if(!url) {
				if(window.csd) {
					var url = window.location.href.replace("http", "ws");
					if(url.indexOf("?") > 0) {
						url = url.substring(0, url.indexOf("?"))
					}
					var slashIndex = url.lastIndexOf("/");
					this.imUrlMap[moduleName] = url.substring(0, slashIndex) + "/im";
				} else {
					var protocol = window.location.protocol;
					var ws = "ws://";
					if(protocol == "https:") {
						ws = "wss://";
					}

					var url = this.getAppUrl(moduleName, "im");
					if(url.indexOf("/") == 0) {
						url = ws + window.location.host + url;
					} else {
						if(url.indexOf("http://") != 0) {
							url = window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/" + url;
						}
						url = url.replace("http://", "ws://");
						url = url.replace("https://", "wss://");
					}

					this.imUrlMap[moduleName] = url;
				}
			} else {
				this.imUrlMap[moduleName] = url;
			}
		}
		return this.imUrlMap[moduleName];
	};

	this.getDownloadUrl = function (moduleName) {
		if(!this.downloadUrlMap[moduleName]) {
			var url = this.getAppUrl(moduleName);
			var slashIndex = url.lastIndexOf("/");
			if(slashIndex < 0) {
				this.downloadUrlMap[moduleName] = "download";
			} else {
				this.downloadUrlMap[moduleName] = url.substring(0, slashIndex) + "/download";
			}
		}
		return this.downloadUrlMap[moduleName];
	};

	this.getFileUploadUrl = function (moduleName) {
		if(!this.fileUploadUrlMap[moduleName]) {
			var url = this.getAppUrl(moduleName);
			var slashIndex = url.lastIndexOf("/");
			if(slashIndex < 0) {
				this.fileUploadUrlMap[moduleName] = "fileupload";
			} else {
				this.fileUploadUrlMap[moduleName] = url.substring(0, slashIndex) + "/fileupload";
			}
		}
		return this.fileUploadUrlMap[moduleName];
	};


	this.getResourceUrl = function (modulePrefix, resourceUrl) {
		if(!window.SModules) {
			return resourceUrl;
		}
		if(resourceUrl && /^http(s?):/.test(resourceUrl)) {
			return resourceUrl;
		}
		var module = window.SModules[modulePrefix];
		if(!module) {
			return resourceUrl;
		}
		if(module.resourceUrlPrefix) {
			return module.resourceUrlPrefix + resourceUrl;
		}
		if(module.isLocalModule) {
			return resourceUrl;
		}
		if(module.side == "/test-screen/ndispatch" || module.side == "test-screen/ndispatch"){//dev env
			return resourceUrl;
		}

		var slashIndex = module.side.lastIndexOf("/");
		if(slashIndex < 0) {
			return resourceUrl;
		} else {
			module.resourceUrlPrefix = module.side.substring(0, slashIndex) + "/";
			return module.resourceUrlPrefix + resourceUrl;
		}
	};

	//sadece designerda im için kullanılıyor
	this.getIMServiceUrl = function () {
		if(!this.imServiceUrl) {
			var url = window.location.href;
			if(url.indexOf("?") > 0) {
				url = url.substring(0, url.indexOf("?"))
			}
			var slashIndex = url.lastIndexOf("/");
			this.imServiceUrl = url.substring(0, slashIndex) + "/imService";
		}
		return this.imServiceUrl;
	};

	this.isModuleLoaded = function (modulePrefix) {
		var module = window.SModules[modulePrefix];
		if(module && (module.loaded || module.isLocalModule)) {
			return true;
		}
		return false;
	};

	this.isThemeLoaded = function (theme) {
		var me = this, i;
		if(theme === "ndesigner")
			return true;
		for(i = 0; i < me.loadedThemes.length; i++) {
			if(me.loadedThemes[i] === theme) {
				return true;
			}
		}
		return false;
	};

	this.loadModule = function (modulePrefix, callback) {
		var me = this, this_=this;
		if(!me.loadedThemes.length) {
			me.loadedThemes.push(CSSession.get("SIDE-THEME"));
		}

		if(SSession.getEnv() === "designer" || SSession.getEnv() === "dev") {
			return this.loadModuleTestEnv(modulePrefix, callback)
		}

		// Buradan sonrası export alınan paket çalışırken yani runtimeda modül yükleyecek.

		var module = window.SModules[modulePrefix];
		if(module && (module.loaded || module.isLocalModule)) {
			if(module.isLocalModule) {
				me.loadedModuleThemesMap[this.getLocalModuleName()] = window.defaultTheme || window.SideDefaults[module.prefix].theme;
			}
			return true;
		}

		var sideDispatchUrl = this_.getSideUrl(modulePrefix);//module.side;
		CSCaller.call("SIDE.GET_MODULE_INFO", {
			moduleName: modulePrefix
		}, {url: sideDispatchUrl}).then(function (resp) {

			var now = new Date();
			var v = resp.version || now.getTime();
			SAsync.series([
				function (next) { //Clienttaki RefData'lar eskiyse sil.
					if(resp.refDataVersions) {
						var localRefDatas = SRefDataManager.getLocalCacheStatus(true);
						var removeList = [];
						for(var i = 0; i < localRefDatas.length; i++) {
							var refDataVer = resp.refDataVersions[localRefDatas[i].rf];
							if(refDataVer) {
								var lv = localRefDatas[i].v;
								if(!lv || lv < refDataVer.version) {
									removeList.push(localRefDatas[i].rf);
								}
							}
						}

						SRefDataManager.removeSideRefdata(removeList, function (err) {
							next(err);
						});
					} else {
						next();
					}
				},
				function (next) { //SideDefaults yükle
					try {
						if(resp.sideDefaults && resp.sideDefaults !== "") {
							SideDefaults[modulePrefix] = JSON.parse(resp.sideDefaults);
						}

						if(resp.sideBcDefaults){
							window.BCDefaults[modulePrefix] = JSON.parse(resp.sideBcDefaults);
						}

						next();
					} catch (e) {
						console.error(e);
						next(e);
					}
				},
				function (next) { //3th party kütüphanelerin listesini yükle
					if(resp.side3LibDeps) {
						window.Side3LibDeps[modulePrefix] = JSON.parse(resp.side3LibDeps);
						console.log(modulePrefix + " => 3th party dependency list of components loaded.");
					}
					next();
				},
				function (next) { //Kullanıcı kütüphanelerini yükle
					var sideDispatchUrl = this_.getSideUrl(modulePrefix);//module.side;
					var libUrl = sideDispatchUrl.replace(csdc.DISPATCH_SIDE, "js/cs/lib_" + modulePrefix + ".js?v=" + v);
					SIDEUtil.loadJS(libUrl, function (err) {
						if(!err) {
							console.log(modulePrefix + " => Module js library loaded.");
						}
						next(err);
					});
				},
				function (next) { //Modül css'ini yükle
					var sideDispatchUrl = this_.getSideUrl(modulePrefix);//module.side;
					var cssUrl = sideDispatchUrl.replace(csdc.DISPATCH_SIDE, "side-module-" + modulePrefix + ".css?v=" + v);
					SIDEUtil.loadJS(cssUrl, "side-module-css-end", function (err) {
						if(!err) {
						    $$.addClass($$.byTagname("body"), modulePrefix + "-css");
							console.log(modulePrefix + " => Module bf css library loaded.");
						}
						next();
					});
				},
				function (next) { //Modül theme css'ini yükle
					if(resp.moduleThemeCssUrl) {
						var sideDispatchUrl = this_.getSideUrl(modulePrefix);//module.side;
						var moduleThemeUrl = sideDispatchUrl.replace(csdc.DISPATCH_SIDE, resp.moduleThemeCssUrl + "?v=" + v);
						SIDEUtil.loadJS(moduleThemeUrl, "side-module-theme-end", function (err) {
							if(!err) {
								if(!err) {
    								$$.addClass($$.byTagname("body"), resp.moduleTheme);
    								console.log(modulePrefix + " => Module theme css library loaded.");
    							}

								console.log(modulePrefix + " => Module theme css library loaded.");
							}
							next(err);
						});
					} else {
						next();
					}
				},
				function (next) { //Modül servis tanımlarını yükle
					CSServiceManager.load(modulePrefix, function (err) {
						if(!err) {
							console.log(modulePrefix + " => Module service definitions loaded.");
						}
						next(err);
					});
				},
				function (next) { //modul BC'lerini yükle
					BCEngine.setRegisterModuleName(modulePrefix);
					var sideDispatchUrl = this_.getSideUrl(modulePrefix);//module.side;
					var sideBcUrl = sideDispatchUrl.replace(csdc.DISPATCH_SIDE, "js/cs/side-bc.js?v=" + v);
					SIDEUtil.loadJS(sideBcUrl, function (err) {
						if(!err) {
							BCEngine.clearRegisterModuleName();
							console.log(modulePrefix + " => Module bc js library loaded.");
						}
						next(err);
					});
				},
				function (next) { //Create session fo module
					if(window.getSideDefaults("createSession-auto")) {
						this_.createSession(modulePrefix, {moduleLoaded: true}, function (err) {
							if(!err) {
								console.log(modulePrefix + " => createSession called.");
							}
							next(err);
						});
					} else {
						if(this.createSessionCallbacks){
							var moduleName = modulePrefix;
							if(!this.createSessionCallbacks[moduleName]){
								moduleName = SModuleManager.getLocalModuleName();
							}
							if(!this.createSessionCallbacks[moduleName]){
								next();
								return;
							}
							this.createSessionCallbacks[moduleName](modulePrefix, next);
							return;
						}
						next();
					}
				}
			], function (err) {
				module.loaded = true;
				if(callback) {
					callback(err);
				}
			});

		});
	};

	this.loadModuleTestEnv = function (modulePrefix, callback) {
		var this_ = this;

		var module = window.SModules[modulePrefix];
		if(module && (module.loaded || module.isLocalModule)) {
			return true;
		}

		CSCaller.call("module.getModule", {modulePrefix: modulePrefix}, {url: NConsts.MSE_PROJECT_MANAGER}).then(function (resp) {
			window.BCDefaults[modulePrefix] = resp[0][modulePrefix];
			window.SideDefaults[modulePrefix] = resp[1][modulePrefix];
			var jsLibContent = resp[2];
			var cssLibContent = resp[3];
			window.Side3LibDeps[modulePrefix] = resp[4];
			var theme = getSideDefaults("theme", modulePrefix);

			SAsync.parallel([
				// Temayı yükle.
				function (flow) {
					if(!this_.isThemeLoaded(theme) && (sideRuntimeEnvironment != "designer" && theme != "side")) {
						var themeUrl = getSideDefaults("moduleThemeCssPath", modulePrefix);
						if(!themeUrl || themeUrl == "") {
							themeUrl = "/css/themes/" + theme + "/" + theme + ".css";
						} else {
							var sideDispatchUrl = this_.getSideUrl(modulePrefix);
							themeUrl = sideDispatchUrl.replace(csdc.DISPATCH_SIDE, themeUrl);
						}

						SIDEUtil.loadJS(themeUrl, "side-module-theme-end", function (err) {
							if(err) {
								flow(err);
							} else {
								CSSession.set("SIDE-THEME-" + modulePrefix, theme);
								this_.loadedThemes.push("SIDE-THEME-" + modulePrefix);
								console.log(module.prefix + " => theme loaded.");
								flow();
							}
						});
					} else {
						flow();
					}
				},

				// JS Libray yükle.
				function (flow) {
					if(jsLibContent && jsLibContent !== "")
						SUtil.loadJSContent(jsLibContent, function (err) {
							if(!err)
								console.log(modulePrefix + " => js library loaded.");
							flow(err);
						});
					else
						flow();
				},

				// CSS Libray yükle.
				function (flow) {
					if(cssLibContent && cssLibContent !== ""){
						$$.createStyle(cssLibContent, {id: modulePrefix + "-pm-CSS"}, "side-module-css-end");
						$$.addClass($$.byTagname("body"), modulePrefix + "-css");

						console.log(modulePrefix + " => css library loaded.");
					}
					flow();
				}
			], function (err) {
				if(!err){
					console.log(modulePrefix + " => BCDefaults and SideDefaults loaded.");
					var module = window.SModules[modulePrefix];
					module.loaded = true;
				}

				if(callback)
					callback(err);
			});

		}).error(function (err) {
			callback(err);
		});
	};

	/**
	 * Sets a callback function executes "create session" process for given module
	 * @param moduleName
	 * @param func must be given signature: createSession(moduleName, callback)
	 */
	this.setCreateSessionCallback = function(moduleName, func){
		if(!moduleName){
			func = moduleName;
			moduleName = this.getLocalModuleName();
		}
		if(!this.createSessionCallbacks){
			this.createSessionCallbacks = {};
		}
		this.createSessionCallbacks[moduleName] = func;
	};

	this.createSession = function (moduleName, options, callback) {
		var that = this;

		if(!options || !options.moduleLoaded) {
			if(!SideModuleManager.loadModule(moduleName, function () {
					that.createSession(moduleName, options, callback);
				})) {
				return;
			}
		}

		var sn = window.getSideDefaults("createSession-sn");
		var callGetUserSessionInfo = window.getSideDefaults("createSession-call-getUserSessionInfo");
		var params = window.getSideDefaults("createSession-params");
		var sessionParams = window.getSideDefaults("createSession-session-params");
		var appDispatchUrl = this.getAppUrl(moduleName);
		//createsession servisi ve url'i yok. hiçbirşey yapma
		if(!sn && (!options || !options.url)) {
			if(callback) {
				callback(true);
			}
			return;
		}
		//servis ismi varsa servis çağır
		if(sn) {
			var param = {};
			if(sessionParams) {
				sessionParams = eval("(" + sessionParams + ")");
				if(Array.isArray(sessionParams)) {
					for(var i = 0; i < sessionParams.length; i++) {
						var value = CSSession.get(sessionParams[i]);
						if(value !== undefined) {
							param[sessionParams[i]] = value;
						}
					}
				}
			}
			var extraParams = null;
			if(params) {
				extraParams = eval("(" + params + ")");
			}
			if(!param.token) {
				param.token = CSSession.getToken();
			}
			CSCaller.call(sn, param, {url: appDispatchUrl, extraParams: extraParams}).then(function (sessionParams) {
				if(sessionParams && typeof sessionParams == "object") {
					CSSession.changeSession(sessionParams);
					if(sessionParams.token) {
						CSSession.setToken(sessionParams.token, moduleName);
					}
					if(sessionParams.ASessionId) {
						CSSession.setSessionId(sessionParams.ASessionId, moduleName);
					}
				}
				if(callGetUserSessionInfo) {
					SideModuleManager.getUserSessionInfoService(moduleName, function (success) {
						if(success) {
							SideModuleManager.loadAuthInfo(moduleName, callback);
						} else {
							callback && callback(success);
						}
					});
				} else {
					SideModuleManager.loadAuthInfo(moduleName, callback);
				}
			}).error(function () {
				if(callback) {
					callback(false);
				}
			});
		} else {
			var extraParams = null;
			if(params) {
				extraParams = eval("(" + params + ")");
			}
			extraParams = extraParams || {};
			extraParams.token = CSSession.getToken();
			CSCaller.ajaxcall(options.url, extraParams, null, function (sessionParams) {
				if(sessionParams && typeof sessionParams == "object") {
					if(sessionParams.error) {
						callback(false, sessionParams.messages[0].text);
						return
					}
					if(sessionParams.token) {
						CSSession.setToken(sessionParams.token, moduleName);
					}

					SideModuleManager.getUserSessionInfoService(moduleName, function (success) {
						if(success) {
							SideModuleManager.loadAuthInfo(moduleName, callback);
						} else {
							callback && callback(success);
						}
					});
				} else {
					callback(false);
				}
			}, function () {
				callback(false);
			});
		}
	};

	this.loadAuthInfo = function (moduleName, callback) {
		var that = this;

		var sn = window.getSideDefaults("createSession-auth-sn", moduleName);
		if(!sn) {
			callback && callback(true);
			return;
		}
		CSCaller.call(sn, {}, {module: moduleName}).then(function (authData) {
			if(!authData || !authData.length) {
				callback && callback(true);
				return;
			}
			if(!window.CSAuthorizationMan) {
				window.CSAuthorizationMan = new CSAuthorizationManager();
				CSAuthorizationMan.init(false);
			}
			CSAuthorizationMan.setAuthData(moduleName, authData);
			callback && callback(true);
		}).error(function () {
			callback && callback(false);
		});
	};

	this.getUserSessionInfoService = function (moduleName, callback) {
		var appDispatchUrl = this.getAppUrl(moduleName);
		CSCaller.call(getSideDefaults("sn-getUserSessionInfo", moduleName), {rfDataInfo: SRefDataManager.getAppRefVersionInfo(moduleName),token:CSSession.getToken()}, {
			url: appDispatchUrl,
			module: moduleName
		}).then(function (resp) {
			CSSession.changeSession(resp);
			if(resp.ASessionId) {
				CSSession.setSessionId(resp.ASessionId, moduleName);
			}
			if(resp.rfDeleteList && resp.rfDeleteList.length > 0) {
				SRefDataManager.removeAppRefdata(resp.rfDeleteList, function () {
					if(callback) {
						callback(true, resp);
					}
				});
			} else {
				if(callback) {
					callback(true);
				}
			}
		}).error(function (resp) {
			//TODO mahmuty
			if(callback) {
				callback(false);
			}
		});
	};

	this.cloneModule = function (sourceModule, targetModule, config, callback) {
		var cloneModule = function () {
			var clonedModule = csCloneObject(SideModuleManager.getModules()[sourceModule], true);
			clonedModule.app = config.appUrl || clonedModule.app;
			clonedModule.side = config.sideUrl || clonedModule.side;
			clonedModule.im = config.imUrl || clonedModule.im;
			clonedModule.prefix = targetModule;
			clonedModule.clonedFrom = sourceModule;
			SideModuleManager.getModules()[targetModule] = clonedModule;

			if(SideDefaults[sourceModule]) {
				SideDefaults[targetModule] = csCloneObject(SideDefaults[sourceModule], true);
			}

			if(callback) {
				callback();
			}
		};

		if(!this.isModuleLoaded(sourceModule)) {
			this.loadModule(sourceModule, function () {
				cloneModule();
			});
		} else {
			cloneModule();
		}
	};
};

window.SModuleManager = window.SideModuleManager = new SideModuleMan();
/**
 * @author hakand
 */

function CSValidationManager(){
	
	//global error arr.
	var errors = [];
	
	function getLabel(bf, config){
		var parentTitle = (config && config.parentTitle) || "";
		if(config && config.withParentTitle && bf.$CS$){
			var parent = bf.$CS$.parent;
			while(parent){
				if(parent.getConfig().mainTab){
					break;
				}
				if(parent.getConfig().validation && parent.getConfig().validation.showLabel){
					parentTitle = parent.getConfig().title +" > " + parentTitle;
				}
				parent = parent.$CS$.parent;
			}
		}
		if(parentTitle){
			return parentTitle + bf.getConfig().label;
		}
		return bf.getConfig().label;
	}
	
	function assertReq(p, index, config){
		if(p === undefined || p === null){
			errors.push(SideMLManager.get("VAL.assert-req-param-not-valid") + index || 0);
		}else if(typeof p.getValue === 'function'){//BF ise getValue ile değerini al
			if(p.bcRef && typeof p.bcRef.isEmpty == "function"){
				if(p.bcRef.isEmpty()){
					errors.push(SideMLManager.get("VAL.required",getLabel(p, config)));
				}
			} else if(!p.getValue() || !stringTrim(p.getValue())){
				errors.push(SideMLManager.get("VAL.required",getLabel(p, config)));
			}	
		}else if(typeof p === 'string'){
			if(!p || (p && p.trim() === "")){
				errors.push(SideMLManager.get("VAL.required",(index || 0)));
			}
		}else{
			errors.push(SideMLManager.get("VAL.parameter-not-supported"));
		}
	}
	
	/**
	 * Geliştirici tarafından kullanılır. Servis tanımlama ekranında validation metodu içinde kullanır.
	 * Servise parametre olarak gelen nesne yapısı içinde "required" alanların doğrulamasını yapar.
	 * Hataları biriktirir ve son olarak mesaj kutusu içinde tüm hataları gösterir.
	 * 
	 * @param jsonParam Dizi ya da nesne alabilir. Örn: jp.police.kodu || [jp.police.kodu, jp.police.tarihi]
	 */
	function assertRequired(jsonParam, config){
		if( Array.isArray(jsonParam)){//dizi olabilir
			for(var i=0;i<jsonParam.length;i++){
				var p = jsonParam[i];
				assertReq(p, i, config);
			}
		}else{//nesne olabilir.
			assertReq(jsonParam, undefined, config);
		}
	}
	
	function assertRegex(bf, regex){
		if(!bf || !regex){
			return;
		}
		var value = bf;
		if(typeof bf.getValue === 'function'){//BF ise getValue ile değerini al
			value = bf.getValue();
		}
		if(!regex.test(value)){
			errors.push(SideMLManager.get("VAL.not-valid",getLabel(bf)));
		}
	}
	
	function assertDate(bfs, format){
		if(!bf){
			return;
		}
		if(!Array.isArray(bfs)){
			bfs = [bfs];
		}
		format = format || "yyyymmdd";
		
		for(var i=0; i<bfs.length ;i++){
			var bf = bfs[i];
			var value = bf;
			if(typeof bf.getValue === 'function'){//BF ise getValue ile değerini al
				value = bf.getValue();
			}
			if(!SIDEDateUtil.isValidDate(value, format)){
				errors.push(SideMLManager.get("VAL.invalid-date",getLabel(bf)));
			}
		}
	}
	
	/**
	 * Geliştirici tarafından kullanılır. Servis tanımlama ekranında validation metodu içinde kullanır.
	 * Servise parametre olarak gelen nesne yapısı içinde "required" alanların doğrulamasını yapar.
	 * Hataları biriktirir ve son olarak mesaj kutusu içinde tüm hataları gösterir.
	 * 
	 * @param jsonParam Dizi ya da nesne alabilir. Örn: jp.police.kodu || [jp.police.kodu, jp.police.tarihi]
	 */
	function assertRequiredAll(jsonParams, config){
		if(!jsonParams){
			return;
		}
		if(!Array.isArray(jsonParams)){
			jsonParams = [jsonParams];
		}
		
		for(var i=0; i<jsonParams.length ;i++){
			var jsonParam = jsonParams[i];
			if(jsonParam instanceof BaseNonBusiness || jsonParam instanceof BaseTabular){
				continue;
			}
			if(typeof jsonParam.getValue === 'function'){//BF mi?
				if(jsonParam instanceof BaseContainer){
					for(var memname in jsonParam.members){
						assertRequiredAll(jsonParam.members[memname], config);
					}
				} else {
					assertReq(jsonParam, undefined, config);
				}
			} else {
				if(typeof jsonParam === 'object'){
					for(var prop in jsonParam){
						assertRequiredAll(jsonParam[prop], config);
					}
				} else {
					assertReq(jsonParam, undefined, config);
				}
			}
		}
	}
	
	/**
	 * En az bir alanın dolu almasını kontrol eder
	 * 
	 * @param jsonParam Dizi ya da nesne alabilir. Örn: jp.police.kodu || [jp.police.kodu, jp.police.tarihi]
	 */
	function assertRequiredNotEmpty(jsonParams, config, first){
		if(!Array.isArray(jsonParams)){
			jsonParams = [jsonParams];
		}
		var empty = true;
		for(var index=0; index<jsonParams.length ;index++){
			var jsonParam = jsonParams[index];
			if(jsonParam === undefined || jsonParam === null){
				continue;
			} else if(jsonParam instanceof BaseNonBusiness || jsonParam instanceof BaseTabular){
				continue;
			} else if(typeof jsonParam.getValue === 'function'){//BF ise getValue ile değerini al
				//ignore listesindeyse bakma devam et
				if(config && config.ignore && csdu.arrayContains(config.ignore, jsonParam) > -1){
					continue;
				}
				if(jsonParam instanceof BaseContainer){
					for(var memname in jsonParam.members){
						if(!assertRequiredNotEmpty(jsonParam.members[memname], config, false)){
							empty = false;
							break;
						}
					}
				} else {
					if(jsonParam.bcRef && typeof jsonParam.bcRef.isEmpty == "function"){
						if(!jsonParam.bcRef.isEmpty()){
							empty = false;
							break;
						}
					} else if(jsonParam.getValue() || stringTrim(jsonParam.getValue())){
						empty = false;
						break;
					}
				}
			}else if(typeof jsonParam === 'object'){
				for(var prop in jsonParam){
					if(prop == "pv"){
						continue;
					}
					if(!assertRequiredNotEmpty(jsonParam[prop], config, false)){
						empty = false;
						break;
					}
				}
			}else if(typeof jsonParam == 'string'){
				if(jsonParam.trim() !== ""){
					empty = false;
				}
			} else {//number vs..
				if(jsonParam){
					empty = false;
				}
			}
			if(!empty){
				break;
			}
		}
		if(first !== false && empty){
			errors.push(SideMLManager.get("VAL.fill-atleast-one"));
		} else {
			return empty !== false;
		}
	}
	
	var preCount = 0;
	
	//BF validation'ı yapar. Örneğin email componenti email format kontrolü gibi
	function preValidate(jp){
		if(preCount > 1000){
			return;
		}
		preCount++;
		if(typeof jp != "object" || jp === null){
			return;
		}
		if(jp.$CS$ && jp.$CS$.CTX){//BF oldugunu anliyoruz
			if(jp.bcRef && jp.bcRef.validate && typeof jp.bcRef.validate == "function"){
				var err = jp.bcRef.validate();
				if(err){
					errors.push(err);
				}
			}
			if(!jp.members){
				return;
			}
			for(var memberName in jp.members){
				preValidate(jp.members[memberName]);
			}
		} else {//BF değil
			for(var propName in jp){
				preValidate(jp[propName]);
			}
		}
	}
	
	/**
	 * 
	 * service-caller.js'den cagrilir. Servis cagrisi yapilmadan once servisi dogrulamak icin kullanilir.
	 * Geliştiricinin servis ile ilgili yazdigi dogrulama kodu calistirilir.
	 * 
	 * @param cmd
	 * @param jp
	 * @returns {Boolean}
	 */
	function validateService(moduleName, cmd, jp, showErrors) {
		
		if(typeof cmd === "object"){
			showErrors = arguments[2];
			jp = arguments[1];
			cmd = arguments[0];
			moduleName = SideModuleManager.getLocalModuleName();
		}
		
		if(showErrors){
			errors = [];//iç içe çağrım değil
		}
		
		if(!cmd){
			var msg = SideMLManager.get("VAL.validation-fail-cmd");
			CSPopupUTILS.MessageBox(msg);
			console.error(msg);
			return false;
		}
		
//		if(!moduleName){
//			var msg = "Service validation failed. module name not found.";
//			CSPopupUTILS.MessageBox(msg);
//			console.error(msg);
//			return false;
//		}
		
		//side servislerini es geç
		if(cmd.indexOf("SIDE.") == 0){
			return true;
		}
		
		//servisi bul
		var service = window.CSServiceManager.getServiceByName(moduleName, cmd);
		if(!service){
//			var msg = "Service validation failed. Service not found. cmd: "+cmd; 
//			CSPopupUTILS.MessageBox(msg);
//			console.error(msg);
//			return false;
			return true;
		}
		
		preCount = 0;
		preValidate(jp); 
		
		//servisteki validation metodunu al ve eval'e ver.
		var valFunction = service.validation;
		if(!valFunction){
			return true;
		}
		valFunction = "function val(jp){\n"+valFunction+"\n }";
		
		try {
			valFunction = eval("("+valFunction+")");
		} catch (e) {
			var msg = SideMLManager.get("VAL.validation-fail-val-func");
			CSPopupUTILS.MessageBox(msg);
			console.error(msg);
			return false;
		}
		
		//geliştiricinin yazdığı doğrulama kodunu çağrılacak servisin paratmetreleri ile çağır.
//		try {
			valFunction(jp);
			
			if(errors.length > 0 && showErrors){
				CSPopupUTILS.MessageBox(errors.join("<br>"));
				return  false;
			}
			
			return true;
//		} catch (e) {
//			console.error(e);
//			return false;
//		}
		
		return false;
	}
	
	function copyValidationRulesToClipboard(ids){
		function findBF(bf){
			if(bf.$CS$.id == def.id){
				return bf;
			}
			for(var memName in bf.members){
				var result = findBF(bf.members[memName]);
				if(result){
					return bf.members[memName];
				}
			}
		}
		function reqPath(bf, path){
			var result = [];
			for(var memName in bf.members){
				var member = bf.members[memName];
				var config = member.getConfig();
				if(config && config.validation && config.validation.req){
					result.push(path+"."+memName); 
				}
				if(member.isContainer() && !member.isTabular()){
					if(!member.$CS$.definition.NON_BUSINESS){
						var inner = reqPath(member, path+"."+memName);
					} else {
						var inner = reqPath(member, path);
					}
					if(inner.length > 0){
						result = result.concat(inner);
					}
				}
			}
			return result;
		}
		function regexPath(bf, path){
			var result = [];
			for(var memName in bf.members){
				var member = bf.members[memName];
				var config = member.getConfig();
				if(config && config.validation && config.validation.regex){
					result.push({path: path+"."+memName, regex: config.validation.regex}); 
				}
				if(member.isContainer() && !member.isTabular()){
					if(!member.$CS$.definition.NON_BUSINESS){
						var inner = regexPath(member, path+"."+memName);
					} else {
						var inner = regexPath(member, path);
					}
					if(inner.length > 0){
						result = result.concat(inner);
					}
				}
			}
			return result;
		}
		var def = csd.loadDefinition(ids[0]);
		var mainDef = def;
		if(!def.isRealNode){
			mainDef = csd.loadDefinition(def.findMainContainerId());
		}
		var mainbf = BFEngine.create({BF:mainDef.clazz, name:"clipboard", config: csCloneObject(mainDef.config,true) }, mainDef.id, mainDef.id);

		var bf = findBF(mainbf);
		if(!bf){
			console.error("Val Kurali icin BF bulunamadi !!");
			return;
		}
		
		var requireds = reqPath(bf, "jp");
		var regexes = regexPath(bf, "jp");
		if(requireds.length == 0 && regexes.length == 0){
			CSPopupUTILS.MessageBox(SideMLManager.get("VAL.no-required-field"));
		} else {
			var str = "";
			if(requireds.length > 0){
				var str = "assertRequired([ ";
				for(var i=0; i<requireds.length ;i++){
					str += requireds[i];
					if(i != requireds.length-1){
						str += ",";
					}
				}
				str += " ]);\n";
			}
			if(regexes.length > 0){
				for(var i=0; i<regexes.length ;i++){
					str += "assertRegex(" + regexes[i].path +"," + regexes[i].regex+");\n";
				}
			}
			window.prompt(SideMLManager.get("VAL.press-ctrl-c"), str);
		}
		BFEngine.destroy(bf);
		console.dir(requireds);
		return;
	}
	
	return {
		validateService: function(moduleName, cmd, jp) {
			return validateService(moduleName, cmd, jp, true);
		}, 
		copyValidationRulesToClipboard: function(ids){
			return copyValidationRulesToClipboard(ids);
		},
		addError: function(msg){
			errors.push(msg);
		}
	};
}//~~

var CSValidationManager = new CSValidationManager();





/**
 * Created by hakand on 6/10/16.
 */

function NRestCallerClass(){

    function createRequest() {
        var result = null;
        if (window.XMLHttpRequest) {
            // FireFox, Safari, etc.
            result = new XMLHttpRequest();
            /*if (typeof xmlhttp.overrideMimeType != 'undefined') {
                result.overrideMimeType('text/xml'); // Or anything else
            }*/
        }else if (window.ActiveXObject) {
            // MSIE
            result = new ActiveXObject("Microsoft.XMLHTTP");
        }else {
            console.error("NRest could not create XMLHttpRequest.");
        }
        return result;
    }

    function encodeParams(args){
        var result="", counter = 1;
        // create enconded URL from args
        for (var key in args) {
            var keyValue = "";
            if ( args[key] instanceof Array )  {
                /*
                 * query string  ?key=Value0&key=Value1
                 * That a REST application translates into key=[Value0, Value1]
                 */
                for ( var ii=0, sizeArray = args[key].length; ii < sizeArray; ii++ ) {
                    result = result.concat((counter > 1 ? "&": "") + key + "=" + encodeURIComponent(args[key][ii]));
                    counter++;
                }
            } else { //No array, just a single &key=value
                keyValue = key + "=" + encodeURIComponent(args[key]);
                result = result.concat((counter > 1 ? "&":"") + keyValue);
            }
            counter++;
        }
        return result;
    }

    //TODO: headers, mimeTypes, ele alınmadı
    this.call = function(){
        var serviceName, params, options, callback;
        if(arguments.length == 3){
            serviceName = arguments[0], params= arguments[1], callback= arguments[2];
        }else if(arguments.length == 4){
            serviceName = arguments[0], params= arguments[1], options= arguments[2], callback= arguments[3];
        }else{
            console.log("NRest invalid argument number.");
            return;
        }

        var serviceObj = NRestManager.restMap[serviceName];
        if(!serviceObj){
            console.error("NRest service not found.");
            return;
        }

        //prepare rest URI params
        var endpoint = serviceObj.endpoint;
        for(var key in params){
            var regex = new RegExp("\\$\\{" + key + "\\}","ig");
            endpoint = endpoint.replace(regex, params[key]);
        }

        //prepare request params str
        var paramStr = encodeParams(params);

        var req = createRequest();
        req.onreadystatechange = function() {
            if (req.readyState != 4) return;
            if (req.status != 200) {
                callback && callback(true);
                return;
            }
            var resp = req.responseText;
            callback && callback(false, resp);
        }

        if(serviceObj.method == "GET"){
            endpoint += "?" + paramStr;
        }

        req.open(serviceObj.method, endpoint, true);

        if(serviceObj.method == "GET"){
            req.send();
        }else{
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.send(paramStr);
        }
    };

}//~~

window.NRest = new NRestCallerClass();





















/**
 * Created by hakand on 6/10/16.
 */

function NRestManagerClass(){

    var that = this;
    this.restMap = {};

    this.init = function(callback){
		CSCaller.call("restServices.query", {}, function(err, resp){
			if(err)
				return callback(err);
			if(resp)
				for(var i=0; i<resp.length; i++){
					var restDefObj =  resp[i];
					that.restMap[restDefObj.name] = restDefObj;
				}
            callback();
		})
    };
};

window.NRestManager = new NRestManagerClass();function CsServiceManager() {

	var serviceListCached = {};

	function getServiceListFromServer(moduleName, callback) {
		var url = SideModuleManager.getSideUrl(moduleName);
		if (!url) {
			err = "CSServiceManager module url not found";
			console.log(err);
			return callback && callback(err);
		}

		console.log("CSServiceManager get service list from server. moduleName: " + moduleName);

		var start = new Date();
		var serviceListerServiceName = ["dev","designer","dashboard"].indexOf(window.sideRuntimeEnvironment) >= 0 ?  "serviceDef.getServiceListWithParams": "SIDE.GET_SERVICE_DEF_LIST";

		CSCaller.call(serviceListerServiceName, {}, {url: url})
			.then(function (resp) {
				if (resp.serviceDefList) {
					var l = resp.serviceDefList;
					for (var i = 0; i < l.length; i++) {
						serviceListCached[moduleName + "." + l[i].name] = l[i];
					}
				} else {
					console.log("CSServiceManager service query failed.");
				}
				console.log("CSServiceManager elapsed time:" + (new Date() - start));
				callback && callback();
			})
			.error(function (err) {
				console.error(err);
				callback && callback(err);
			});
	}


	function getServiceByName(moduleName, serviceName) {
		if (window.getSideDefaults && (serviceName === getSideDefaults('sn-getUserSessionInfo', moduleName) || serviceName === getSideDefaults('sn-login', moduleName))) {
			return null;
		}
		var service = serviceListCached[moduleName + "." + serviceName];
		if (service) {
			return service;
		}
		return null;
	}

	return {
		init: function (callback) {
			var moduleName = SideModuleManager.getLocalModuleName();
			getServiceListFromServer(moduleName, callback);
		},
		load: function (moduleName, callback) {
			getServiceListFromServer(moduleName, callback);
		},
		getServiceByName: function (moduleName, serviceName) {
			return getServiceByName(moduleName, serviceName);
		}
	};
}/**
 * @author hakand
 */
function CSTree(containerid, config) {
	config = config || {};
	var defaults = {
		searchMinLength: 3,
		searchPlaceHolder: "Ara"
	};
	this.containerid = containerid;
	this.config = csDefaults(config, defaults);
	this.contulid = containerid + "_ul";
	this.idPrefix = config.idPrefix !== undefined ? config.idPrefix : getId();

	this.disabled = false;
	this.selNodeArr = [];
	this.storageHighlight = [];
	this.keywordMap = [];
}

CSTree.prototype.encapID = function (id) {
	if (id == -1 || !this.idPrefix || this.containerid == id || id === undefined) {
		return id;
	}
	if (Array.isArray(id)) {
		var result = [];
		for (var i = 0; i < id.length; i++) {
			result[i] = this.encapID(id[i]);
		}
		return result;
	}
	return this.idPrefix + "-" + id;
}

CSTree.prototype.decapID = function (id) {
	if (id == -1 || !this.idPrefix || this.containerid == id || id === undefined) {
		return id;
	}
	if (Array.isArray(id)) {
		var result = [];
		for (var i = 0; i < id.length; i++) {
			result[i] = this.decapID(id[i]);
		}
		return result;
	}
	return id.substring((this.idPrefix + "-").length);
}

CSTree.prototype.init = function () {
	var tree = this, config = this.config;
	if (config.searchable || config.addButton) {
		var $$topdiv = $$.create("DIV", null, "csctree-top-div");
		$$.insertFirst($$topdiv, this.containerid);
	}
	if (config.searchable) {
		var $$searchInput = $$.create("INPUT", {
			id: this.containerid + "_search_input",
			placeholder: config.searchPlaceHolder
		}, "cstree-search-input", null, $$topdiv);
		$$searchInput.onkeyup = function (event) {
			tree.searchInTree();
			return true;
		};
	}
	if (config.addButton) {
		$$.addClass($$topdiv, "tree-add-btn");
		var $$addInput = $$.create("A", {id: this.containerid + "_add_input"}, "cstree-add-input", null, $$topdiv);
		var $$addInputIcon = $$.create("I", null, "fa fa-plus", null, $$addInput);
		$$addInput.onclick = function (event) {
			tree.addclickCB && tree.addclickCB();
			return true;
		};
	}
	if (config.accordion && config.keyboardShortcutEnabled) {
		//kepçiler için yapıldı. ctrl-m basınca accordion menude ki ilk elemanı seçsin olayı.
		var $$cont = $$.byid(this.containerid);
		if ($$cont) {
			$$cont.tabIndex = 0;
			$$.bindEvent(window, "keydown", function () {
				var $$cont = $$.getChildHasClass(this.containerid, "outer-menu");
				var id = $$cont ? $$cont.getAttribute("id") : null;
				if (event.ctrlKey && event.keyCode == config.keyboardShortcutKeyCode && config.keyboardShortcutEnabled && id) {
					tree.selectNode(id, window.event, false);
				}
			});
		}
	}
};

CSTree.prototype.searchInTree = function () {
	this.clearSearch(false);

	var tree = this, config = this.config;
	var $$searchInput = $$.byid(this.containerid + "_search_input");
	var str = $$searchInput.value;

	function highlight($$dom) {
		var child, index, before, replaced, after;
		for (var i = 0; i < $$dom.childNodes.length; i++) {
			child = $$dom.childNodes[i];
			if (child.nodeType == 3) {//3 text node
				index = SString.turkishToEngLowerCase(child.textContent)	.indexOf(str);
				if (index >= 0) {
					$$dom.orjContent = $$dom.innerHTML;
					before = child.textContent.substring(0, index);
					replaced = $$.createWithHtml("SPAN", child.textContent.substring(index, index + str.length));
					$$.addClass(replaced, "cstree-search-highlight");
					after = child.textContent.substring(index + str.length);
					if (before) {
						$$dom.insertBefore(document.createTextNode(before), child);
					}
					$$dom.replaceChild(replaced, child);
					if (after) {
						$$dom.insertBefore(document.createTextNode(after), replaced.nextSibling);
					}
					break;
				}
			}
			else {
				highlight(child);
			}
		}
	}

	function processSearch($$ul, found) {
		var $$li, $$a, $$subul, index;
		for (var i = 0; i < $$ul.childNodes.length; i++) {
			$$li = $$ul.childNodes[i];
			$$subul = $$.child($$li, "UL");
			if(config.showHideSearch){
					$$.addClass($$li, "hideSearchLI");
			}
			$$a = $$.child($$li, "A");
			if (SString.turkishToEngLowerCase($$li.textContent).indexOf(str) >= 0) {
				index = SString.turkishToEngLowerCase($$a.innerText).indexOf(str);
				if (index >= 0) {
					tree.storageHighlight.push($$a);
					highlight($$a);
				}
				//$$subul = $$.child($$li, "UL");
				if ($$subul && SString.turkishToEngLowerCase($$subul.textContent).indexOf(str) >= 0) {
					$$.addClass($$li, "cstree-open");
					$$.rmClass($$li, "cstree-closed");
					processSearch($$subul, found || index >= 0);
				}
			} else {
				var liTag = $$a.parentNode;
				var keywords = liTag.getAttribute("rel-keyword");
				if(keywords){
					keywords = keywords.split(",");
					for(var j = 0; j < keywords.length; j++){
						if(str == keywords[j]){
							tree.keywordMap.push($$a);
						}
					}
				}
				if (!found) {
						$$.addClass($$li, ["cstree-search-not-found"]);
				}
			}
			if($$subul){
				processSearch($$subul, found);
			}
		}
	}

	if (str && str.length >= config.searchMinLength) {
		if (config.showOnlySearchResults) {
			str = str.toLowerCase();
			if (config.accordion) {
				var $$accDiv = $$.byid(this.containerid), $$node, $$outer, $$ul, $$labelDiv, $$labelSpan;
				var outerFound;
				for (var i = 0; i < $$accDiv.childNodes.length; i++) {
					$$node = $$accDiv.childNodes[i];
					if ($$.hasClass($$node, "csctree-top-div")) {
						continue;
					}
					if ($$.hasClass($$node, "outer-menu")) {
						$$outer = $$node;
						if ($$outer.innerText.toLowerCase().indexOf(str) >= 0) {
							$$labelDiv = $$.getChildHasClass($$outer, "outer-menu-label-cont-div");
							$$labelSpan = $$.child($$labelDiv, "SPAN");
							highlight($$labelSpan);
							outerFound = true;
						} else {
							outerFound = false;
							$$.addClass($$outer, ["cstree-search-not-found", "cstree-outer-opened"]);
						}
					} else {
						if ($$node.textContent.toLowerCase().indexOf(str) >= 0) {
							$$.rmClass($$outer, "cstree-search-not-found");
							$$node.style.display = "block";
							$$ul = $$.child($$node, "UL");
							if ($$ul) {
								processSearch($$ul, outerFound);
							}
						} else {
							$$node.style.display = "";
							$$.addClass($$node, "cstree-search-not-found");
						}
					}
				}
			} else {//Not accordion
				var $$tree = $$.byid(this.containerid), $$ul = $$.child($$tree, "UL");
				if ($$ul) {
					tree.storageHighlight = [];
					tree.keywordMap = [];
					processSearch($$ul, false);
					if(config.showHideSearch){
						for(var highlightIndex = 0; highlightIndex < tree.storageHighlight.length; highlightIndex++){
							var editHightligth = tree.storageHighlight[highlightIndex].parentNode;
							if(editHightligth.className.indexOf("hideSearchLI") > -1){
								$$.rmClass(editHightligth, "hideSearchLI");
							}
							highlightEditParent(editHightligth.parentNode);
						}
					}
					for(var keywordIndex = 0; keywordIndex < tree.keywordMap.length; keywordIndex++){
						var keywordItemParent = tree.keywordMap[keywordIndex].parentNode;
						$$.addClass(keywordItemParent,"keyword-highlight");
						keywordHighlight(keywordItemParent);
					}
				}
			}
		} else {
			var $$tree = $$.byid(this.containerid);
			var ancList = $$tree.querySelectorAll("a"), $$a;
			for (var i = 0; ancList && i < ancList.length; i++) {
				$$a = ancList[i];
				if (SString.turkishToEngLowerCase($$a.innerText).indexOf(str.toLowerCase()) >= 0 || SString.turkishToEngUpperCase($$a.innerText).indexOf(str.toUpperCase()) >=0 ) {
					var id = $$a.getAttribute("id");
					$$.addClass($$a, "cstree-search-result");
					var parentid = tree.getParentNodeId(tree.decapID(id));
					tree.expandTree(tree.decapID(parentid), false, true);
					if (config && config.accordion) {
						var parentNode = $$a.parentNode, $$searchResult;
						if (parentNode.className !== " outer-menu-label-cont-div") {
							while (parentNode && !SIDEString.endsWith(parentNode.id, "innerdiv")) {
								parentNode = parentNode.parentNode;
							}
							$$searchResult = parentNode.previousSibling.querySelector(".outer-menu-search-result");
						} else {
							$$searchResult = parentNode.querySelector(".outer-menu-search-result");
						}
						var count = $$searchResult.innerText || 0;
						$$searchResult.innerHTML = ++count;
						$$.addClass($$searchResult, "show");
					}
				}
				else{
					var liTag = $$a.parentNode;
					var keywords = liTag.getAttribute("rel-keyword");
					if(keywords){
						keywords = keywords.split(",");
						for(var j = 0; j < keywords.length; j++){
							if(str == keywords[j]){
								var id = $$a.getAttribute("id");
								$$.addClass($$a, "cstree-search-result");
								$$a.orjContent = $$a.innerHTML;
								var replaced = $$.createWithHtml("SPAN", $$a.innerHTML);
								$$.addClass(replaced, "cstree-search-highlight");
								$$a.replaceChild(replaced, $$a.childNodes[0]);
								var parentid = tree.getParentNodeId(tree.decapID(id));
								tree.expandTree(tree.decapID(parentid), false, true);
								if (config && config.accordion) {
									var parentNode = $$a.parentNode, $$searchResult;
									if (parentNode.className !== " outer-menu-label-cont-div") {
										while (parentNode && !SIDEString.endsWith(parentNode.id, "innerdiv")) {
											parentNode = parentNode.parentNode;
										}
										$$searchResult = parentNode.previousSibling.querySelector(".outer-menu-search-result");
									} else {
										$$searchResult = parentNode.querySelector(".outer-menu-search-result");
									}
									var count = $$searchResult.innerText || 0;
									$$searchResult.innerHTML = ++count;
									$$.addClass($$searchResult, "show");
								}
								j = keywords.length;
							}
						}
					}

				}
			}
		}
	}

	else{
		if(config.showHideSearch) {
			var $$tree = $$.byid(this.containerid), $$liHide = $$tree.querySelectorAll(".hideSearchLI"), $$openLi = $$tree.querySelectorAll(".cstree-open");
			for(var liIndex = 0; liIndex < $$liHide.length; liIndex++){
				$$.rmClass($$liHide[liIndex],"hideSearchLI");
			}
			for(var openLiIndex = 0; openLiIndex < $$openLi.length; openLiIndex++){
				$$.rmClass($$openLi[openLiIndex],"cstree-open");
				$$.addClass($$openLi[openLiIndex],"cstree-closed");

			}
		}
	}

	function highlightEditParent($dom){
		var parentNode = $dom.parentNode;
		if(parentNode.tagName != "DIV"){
			if(parentNode.className.indexOf("hideSearchLI") > -1){
				$$.rmClass(parentNode, "hideSearchLI");
			}
			highlightEditParent(parentNode.parentNode);
		}
	}

	function keywordHighlight($dom) {
		if($dom.tagName != "DIV"){
			$$.rmClass($dom,"cstree-search-not-found");
			if($dom.className.indexOf("cstree-leaf") == -1){
				$$.rmClass($dom,"cstree-closed");
				$$.addClass($dom,"cstree-open");
			}
			keywordHighlight($dom.parentNode.parentNode);
		}
	}
};

CSTree.prototype.clearSearch = function (flag) {
	var $$tree = $$.byid(this.containerid);
	if ($$tree) {
		var list = $$tree.querySelectorAll(".cstree-search-result");
		for (var i = 0; list && i < list.length; i++) {
			$$.rmClass(list[i], "cstree-search-result");
		}
		list = $$tree.querySelectorAll(".outer-menu-search-result");
		for (var i = 0; list && i < list.length; i++) {
			list[i].innerHTML = "";
			$$.rmClass(list[i], "show");
		}
		var list = $$tree.querySelectorAll(".cstree-search-highlight"), parent;
		for (var i = 0; list && i < list.length; i++) {
			parent = list[i].parentNode;
			parent.innerHTML = parent.orjContent;
		}
		list = $$tree.querySelectorAll(".cstree-search-not-found");
		for (var i = 0; list && i < list.length; i++) {
			$$.rmClass(list[i], "cstree-search-not-found");
		}
		list = $$tree.querySelectorAll(".keyword-highlight");
		for(var i = 0; list && i < list.length; i++){
			$$.rmClass(list[i], "keyword-highlight");
		}

		$$.remove(this.containerid + "_search_result_ul");
		if (flag) {
			var $$searchInput = $$.byid(this.containerid + "_search_input");
			if ($$searchInput) {
				$$searchInput.value = "";
			}
		}
	}
};

/**
 * verilen düğümün babasının id'sini döner
 *
 * @param id
 * @returns
 */
CSTree.prototype.getParentNodeId = function (id) {
	id = this.encapID(id);
	var parentLiId = $$.byid(id).parentNode.id;
	var parentUlId = $$.byid(parentLiId).parentNode.id;
	parentLiId = $$.byid(parentUlId).parentNode.id;
	var $$a = $$.child(parentLiId, "a");
	return $$a ? this.decapID($$a.getAttribute("id")) : undefined;
};


CSTree.prototype.getSelectedId = function () {
	if (this.selNodeArr.length > 0) {
		return this.decapID(this.selNodeArr[0]);
	}
};

CSTree.prototype.getSelectedIdArr = function () {
	var copy = this.selNodeArr.slice();
	for (var i = 0; i < copy.length; i++) {
		copy[i] = this.decapID(copy[i]);
	}
	return copy;
};

CSTree.prototype.expandAllParents = function (li) {
	var ul = li.parentNode;
	var parentli = ul.parentNode;

	if (ul && parentli && ul.id != this.contulid && ul.id != this.containerid) {
		$$.rmClass(parentli, "cstree-closed");
		$$.addClass(parentli, "cstree-open");
		this.expandAllParents(parentli);
	}
};

CSTree.prototype.select = function (id, callCallback, focus, event) {
	if (this.disabled) {
		return;
	}

	event = event || window.event;
	id = this.encapID(id);
	var li = $$.byid(id + "_li");
	var config = this.config;
	if (li) {
		if (event && event.ctrlKey === true && csdu.arrayContains(this.selNodeArr, id) != -1) {
			deselect(id);
			return;
		}

		//önceki seçilenleri iptal et
		if (event && event.which == 1 && event.ctrlKey !== true && event.shiftKey !== true || (event && event.which == 3 && csdu.arrayContains(this.selNodeArr, id) == -1)) {
			var selArr = this.selNodeArr.slice();
			for (var i = 0; i < selArr.length; i++) {
				this.deselect(selArr[i]);
			}
		}

		if (config.multiselect === false) {
			var arr = this.getSelectedIdArr();
			if (arr && arr.length > 0) {
				return;
			}
		}

		if (event && event.shiftKey === true) {
			var selArr = this.selNodeArr.slice();
			for (var i = 0; i < selArr.length; i++) {
				var sel = $$.byid(selArr[i] + "_li");
				if (sel.parentNode.id == li.parentNode.id) {
					var parentChildren = sel.parentNode.children;
					var selectStarted = false;
					for (var j = 0; j < parentChildren.length; j++) {
						var child = parentChildren[j];
						if (child.id == sel.id || child.id == li.id) {
							if (selectStarted) {
								selectStarted = false;
							} else {
								selectStarted = true;
							}
						}
						if (selectStarted) {
							this.selectTreeNode(child.id.split("_li")[0], undefined, focus);
						}
					}
					break;
				}
			}
		}

		//yeni seçilenin sınıfını ayarla ve diziye ekle
		this.selectTreeNode(this.decapID(id), undefined, focus);

		this.expandAllParents(li);

		//seçildiğinde callback varsa çağır
		if (callCallback === undefined || callCallback === true) {
			if (this.selectCB) {
				this.selectCB(this.decapID(id), event);
			}
		}
	} else if (config.accordion) {
		//accoridon'un ana düğümü seçilmişse
		var selArr = this.selNodeArr.slice();
		for (var i = 0; i < selArr.length; i++) {
			this.deselect(this.decapID(selArr[i]));
		}
		if (id.indexOf("_outerdiv") == -1) {
			this.selectTreeNode(this.decapID(id) + "_outerdiv", undefined, focus);
		} else {
			this.selectTreeNode(this.decapID(id), undefined, focus);
		}

		id = id.replace("_outerdiv", "");

		if (callCallback === undefined || callCallback === true) {
			if (this.selectCB) {
				this.selectCB(this.decapID(id), event);
			}
		}
	}
};

CSTree.prototype.selectTreeNode = function (id, scrollTo, focus) {
	id = this.encapID(id);
	var el = $$.byid(id);
	if (el) {
		$$.addClass(el, "cstree-clicked");

		if (csdu.arrayContains(this.selNodeArr, id) == -1) {
			this.selNodeArr.push(id);
		}
		if (focus) {
			el.focus();//designerda link with editor özelliği yanlış çalıştığı için bu blok içine alındı
		}
		if (!window.csd && scrollTo === undefined) {
			this.scrollToNode(this.decapID(id));
		}
	}
};

CSTree.prototype.scrollToNode = function (id) {
	id = this.encapID(id);
	var $$convUl = $$.byid(this.containerid);
	var $$dom = $$.byid(id);
	var top = $$dom.offsetTop;
	var h = $$.height($$convUl);
	$$convUl.scrollTop = top - h / 2;
};

CSTree.prototype.deselect = function (id) {
	$$.rmClass(id, "cstree-clicked");

	var index = this.selNodeArr.indexOf(id);
	if (index != -1) {
		this.selNodeArr.splice(index, 1);
	}
};

CSTree.prototype.deselectAll = function () {
	for (var i = 0; i < this.selNodeArr.length; i++) {
		$$.rmClass(this.selNodeArr[i], "cstree-clicked");
	}
	this.selNodeArr = [];
};

CSTree.prototype.cstreeInsClicked = function (el) {
	if (this.disabled) {
		return;
	}
	var parent = el.parentNode;
	if ($$.hasClass(parent, "cstree-open")) {
		$$.rmClass(parent, "cstree-open");
		$$.addClass(parent, "cstree-closed");

		if (this.nodecollapsedCB) {
			this.nodecollapsedCB(el.getAttribute("id").split("_")[0]);
		}
	} else if ($$.hasClass(parent, "cstree-closed")) {
		$$.rmClass(parent, "cstree-closed");
		$$.addClass(parent, "cstree-open");

		if (this.nodeexpandedCB) {
			this.nodeexpandedCB(el.getAttribute("id").split("_")[0]);
		}
	}
};

//context menu tek boyutlu oluşturulur. içi içe menu varsa oluşturmaz.
//gereksinim olmadığı için iç içe menu oluşturmaya uğraşmadım...
CSTree.prototype.showcontextmenu = function (event, id) {
	event.preventDefault();
	id = this.encapID(id);
	var menuItemsObj = this.contextmenuCB(this.decapID(id));

	csdu.contextMenu({
		left: event.pageX,
		top: event.pageY,
		items: menuItemsObj
	}, id);
};

CSTree.prototype.rename = function (id) {
	id = this.encapID(id);
	var tree = this;
	var $$a = $$.byid(id);
	var mask = csdu.createMask();
	var $$div = $$.create("DIV", {id: "cstree-rename-div"});
	var $$input = $$.create("INPUT", {id: "cstree-rename-input", value: $$a.innerHTML}, null, null, $$div);

	$$input.onkeydown = function (event) {
		if (event.keyCode == 13) {//enter ise
			removeRenameDialog(event);
			return false;
		}
		return true;
	};

	$$.body().appendChild(mask);
	$$.body().appendChild($$div);
	var x = window.scrollX, y = window.scrollY;
	$$input.focus();
	window.scrollTo(x, y);

	var offset = $$.offset($$a);
	$$div.style.top = offset.top + "px";
	$$div.style.left = offset.left + "px";
	$$div.style.display = "block";

	//kapanma olaylarını bağla
	function removeRenameDialog(event) {
		$$.remove($$div);
		$$.remove(mask);

		if (tree.renameCB) {
			tree.renameCB(id, $$input.value);
		}
	}

	mask.onclick = removeRenameDialog;
	mask.oncontextmenu = function (event) {
		event.preventDefault();
		removeRenameDialog(event);
	};
};

CSTree.prototype.changeNodeId = function (id, newId) {
	id = this.encapID(id);
	var $$a = $$.byid(id);
	if (!$$a) {
		return;
	}
	$$.attr(id, "id", newId);
	$$.attr(id + "_li", "id", newId + "_li");
	$$.attr(id + "_ins", "id", newId + "_ins");
	$$.attr(id + "_ul", "id", newId + "_ul");
	$$.attr(id + "_innerdiv", "id", newId + "_innerdiv");
	$$.attr(id + "_outerdiv", "id", newId + "_outerdiv");
	$$.attr(id + "_checkbox", "id", newId + "_checkbox");
	$$.attr(id + "_star", "id", newId + "_star");
};

CSTree.prototype.renameNode = function (id, newName) {
	id = this.encapID(id);
	var config = this.config;
	if (!config.accordion) {
		$$.html(id, newName);
		return;
	}
	$$outerDiv = $$.byid()
	$$span = $$.child($$.getChildHasClass(id + "_outerdiv", "outer-menu-label-cont-div"), "SPAN");
	$$.html($$span, newName);
};

CSTree.prototype.createFromObj = function (obj) {
//	var nodeObj = csCloneObject(obj, true);
	return this.create(obj);
};

CSTree.prototype.create = function (id, parentid, label, icon, childIndex, label2, newTreeData, cssClass) {
	var config = this.config;
	if (typeof id == "object") {
		var checkboxFlag = id.checkbox === undefined ? (config.checkbox || false) : id.checkbox;
		var checkedFlag = id.checked === undefined ? (config.defaultChecked === false ? false : (config.checkbox ? config.checkbox : false)) : id.checked;
		var rel = id.rel;
		var attributes = id.attributes;
		label2 = id.label2;
		childIndex = id.childIndex;
		icon = id.icon;
		label = id.label;
		cssClass = id.cssClass;
		parentid = this.encapID(id.parentid);
		id = this.encapID(id.id);
	} else {
		id = this.encapID(id);
		parentid = this.encapID(parentid);
	}
	var tree = this, ul;

	if (newTreeData === true) {
		parentid = parentid + "";
		if (parentid.indexOf("menuDefRoot") > -1) {
			parentid = parentid.split("-")[0];
		}
		parentid = (parentid == -1 ? this.containerid : parentid);
	} else {
		parentid = (parentid == -1 ? this.containerid : parentid);
	}

	//accordion tree isteniyorsa ilk düzeyi accordion olarak çiz
	if (config.accordion && parentid == this.containerid) {
		if ($$.byid(id + "_ul")) {
			return;
		}
		parentid = this.containerid;
		var innerDivId = id + "_innerdiv";
		var innerDivUlId = id + "_ul";
		var outerdivSearchResult = $$.create("SPAN", null, "outer-menu-search-result");
		var outerdivLabel = $$.createWithHtml("SPAN", label);
		var outerdivLabel2 = $$.createWithHtml("SPAN", label2 || "");
		$$.addClass(outerdivLabel2, "outer-menu-label2");
		var outerdiv = $$.create("DIV", {id: id + "_outerdiv"}, ["outer-menu", cssClass]);
		var iconDiv = $$.create("DIV", null, "outer-menu-icon-div");
		var labelContDiv = $$.create("DIV", null, "outer-menu-label-cont-div");
		if (icon) {
			var iconImg = $$.create("IMG", {src: icon}, null, null, iconImg);
		}

		outerdiv.onclick = function (event) {
			var id = this.getAttribute("id").split("_outerdiv")[0];
			var outerMenuARR = outerdiv.parentNode.querySelectorAll(".outer-menu");
			for (var i = 0; i < outerMenuARR.length; i++) {
				$$.rmClass(outerMenuARR[i], ["cstree-outer-opened", "cstree-clicked"]);
			}
			var $$innerDivUl = $$.byid(innerDivUlId);
			//accordion içinde menu varsa alt menuyu goster. yoksa tıklandı olayı fırlat.
			if ($$innerDivUl.childNodes.length > 0) {
				var $innerDiv = $("#" + innerDivId);
				if ($innerDiv.is(":visible")) {
					$innerDiv.slideUp();
					$(this).removeClass("cstree-outer-opened");
				} else {
					$innerDiv.slideDown();
					$(this).addClass("cstree-outer-opened");
				}
				$(".inner-menu", "#" + this.containerid).each(function () {
					if ($(this).attr("id") != $innerDiv.attr("id")) {
						$(this).slideUp(function () {
							this.style.display = "none";
						});
						$(this).removeClass("cstree-outer-opened");
					}
				});
			} else {
				$(".inner-menu", "#" + this.containerid).each(function () {
					$(this).slideUp();
					$(this).removeClass("cstree-outer-opened");
				});
				event.preventDefault();
				tree.select(tree.decapID(id), undefined, undefined, event);
			}
			tree.deselectAll();
			tree.selectTreeNode(tree.decapID(this.id), undefined, true);
			if (tree.accCB) {
				tree.accCB(tree.decapID(id), event);
			}
		};
		outerdiv.setAttribute("tabIndex", "0");
		outerdiv.onkeyup = function (event) {
			tree.keyupSelect(event);
		};

		var innerdiv = $$.create("DIV", {"id": innerDivId}, "inner-menu");
		var ul = $$.create("UL", {id: id + "_ul"});
		innerdiv.appendChild(ul);
		outerdiv.appendChild(iconDiv);
		outerdiv.appendChild(labelContDiv);
		labelContDiv.appendChild(outerdivLabel);
		labelContDiv.appendChild(outerdivSearchResult);
		labelContDiv.appendChild(outerdivLabel2);
		var parent = $$.byid(parentid);
		parent.appendChild(outerdiv);
		parent.appendChild(innerdiv);
		return;
	}

	var parentUl = $$.byid(parentid + "_ul");
	if (!parentUl) {
		var p = $$.byid(parentid);
		if (p) {
			parentUl = $$.create("UL", {id: parentid + "_ul"}, null, null, p);
		}
	}
	if (parentUl) {
		//çizilmiş ise tekrar çizme
		if ($$.byid(id + "_li")) {
			return;
		}
		//ağaç düğümü oluştur
		//html elemanlarını oluştur.
		var li = $$.create("LI", {id: id + "_li"});
		if (attributes) {
			var attrKeys = Object.keys(attributes);
			for (var i = 0; i < attrKeys.length; i++) {
				li.setAttribute("rel-" + attrKeys[i], attributes[attrKeys[i]]);
			}
		}

		var ins = $$.create("INS", {id: id + "_ins"});
		var a = $$.create("A", {id: id, href: "#", draggable: "true", tabIndex: "0"});
		if (rel) {
			li.setAttribute("rel", rel);
		}
		a.onkeydown = function (e) {
			if (e.keyCode == 10 || e.keyCode == 13) {
				tree.dblclickCB(tree.decapID(this.getAttribute("id")), event);
			}
		};
		ul = $$.create("UL", {id: id + "_ul"});

		//yapı:	li => [ ins, (checkbox), a , (icon), ul]
		li.appendChild(ins);
		if (config.checkbox && checkboxFlag) {
			if (!config.checkType || config.checkType === "default") {
				var checkbox = $$.create("INPUT", {id: id + "_checkbox", "type": "checkbox"});
				li.appendChild(checkbox);
				if (checkedFlag) {
					checkbox.checked = true;
				}

				if (this.checkboxchangeCB) {
					//barist: bu kod acikken tree hic cizilmiyor.
//						if(disabled){
//							return;
//						}
					checkbox.onclick = function (event) {
						event.stopPropagation();
						var isChecked = true, id = this.getAttribute("id").split("_checkbox")[0];
						if (this.checked === false) {
							isChecked = false;
						}

						if (tree.beforecheckboxchangeCB) {
							var result = tree.beforecheckboxchangeCB(tree.decapID(id), this.checked, event, 0);
							if (!result) {
								event.preventDefault();
								return;
							}
						}

						if (config.hierarchicCheck !== false) {
							//baba checkbox lardan birisi seçilmişse altındaki düğümleride seç
							var $$ul = $$.byid(id + "_ul");
							if ($$ul) {
								if ($$ul.parentNode.getAttribute("class").indexOf("cstree-leaf") < 0) {
									$$ul.previousSibling.previousSibling.isChecked = isChecked;
									tree.checkboxchangeCB(tree.decapID($$.attr($$ul.previousSibling.previousSibling, "id").split("_checkbox")[0]), isChecked, event, 0);//cause = 0 => baba seçilmiş bebeleri etkiliyor

									var checklist = $$ul.querySelectorAll("input[type=checkbox]");
									for (var i = 0; checklist && i < checklist.length; i++) {
										checklist[i].checked = isChecked;
										tree.checkboxchangeCB(tree.decapID($$.attr(checklist[i], "id")).split("_checkbox")[0], isChecked, event, 2);//cause = 2 => baba seçilmiş bebeleri etkiliyor
									}
								} else {
									var leaf = $$ul.previousSibling;
									if (leaf.tagName != "A") {
										leaf = leaf.previousSibling;
									}
									leaf.checked = isChecked;
									tree.checkboxchangeCB(tree.decapID($$.attr(leaf, "id")).split("_checkbox")[0], isChecked, event, 0);
								}
							}
							//babalarınıda seç
							var $$temp = $$.byid(id), $$tempUL;
							while (true) {
								if ($$temp.getAttribute("id") == tree.contulid) {
									break;
								}
								if ($$temp.tagName.toUpperCase() != "LI") {
									$$temp = $$temp.parentNode;
									continue;
								}
								if (id + "_li" == $$temp.getAttribute("id")) {//kendi checkbox ın ise devam etme
									return;
								}
								var checkboxes = $$temp.querySelectorAll("input[type=checkbox]:checked")
								//babalarından biri başka alt düğümlerde seçili olan elemana sahip ise devam etme.
								if (checkboxes.length) {
									return;
								}
								checkboxes = $$temp.querySelectorAll("input[type=checkbox]")
								if (checkboxes.length) {
									checkboxes[0].checked = isChecked;
									tree.checkboxchangeCB(dtree.ecapID(checkboxes[0].id).split("_checkbox")[0], isChecked, event, 1);//cause = 1 => bebe seçilmiş babalarını etkiliyor
								}
								$$temp = $$temp.parentNode;
							}
						}
						tree.checkboxchangeCB(tree.decapID(id), this.checked, event, 0);//cause = 0 => kendi seçilmiş
					};
				}
			} else if (config.checkType === "star") {
				var elType = "p";
				var star = $$.create(elType, {id: id + "_star"}, ["cstree-star", "cstree-icon", checkedFlag ? "cstree-filled-star" : "cstree-empty-star"], null, li);

				if (this.checkboxchangeCB) {
					if (this.disabled) {
						return;
					}
					star.onclick = function (event) {
						event.stopPropagation();
						var isChecked = $$.hasClass(this, "cstree-filled-star"), id = this.getAttribute("id").split("_star")[0];
						isChecked = !isChecked;

						if (tree.beforecheckboxchangeCB) {
							var result = tree.beforecheckboxchangeCB(tree.decapID(id), isChecked, event, 0);
							if (!result) {
								event.preventDefault();
								return;
							}
						}

						if (!isChecked) {
							$$.addClass(this, "cstree-empty-star");
							$$.rmClass(this, "cstree-filled-star");
						} else {
							$$.addClass(this, "cstree-filled-star");
							$$.rmClass(this, "cstree-empty-star");
						}

						if (config.hierarchicCheck !== false) {
							//bebelerdeki düğümleride seç
							var $$ul = $$.byid(id + "_ul");
							if ($$ul) {
								var checkboxes = $$ul.querySelectorAll(elType + ".cstree-star");
								for (var i = 0; i < checkboxes.length; i++) {
									var $$check = checkboxes[i];
									if (isChecked) {
										$$.addClass($$check, "cstree-filled-star");
										$$.rmClass($$check, "cstree-empty-star");
									} else {
										$$.addClass($$check, "cstree-empty-star");
										$$.rmClass($$check, "cstree-filled-star");
									}
									tree.checkboxchangeCB(tree.decapID($$check.id).split("_star")[0], isChecked, event, 2);//cause = 2 => baba seçilmiş bebeleri etkiliyor
								}
							}
							var $$temp = $$.byid(id);
							while (true) {
								if ($$temp.getAttribute("id") == tree.contulid) {
									break;
								}
								if ($$temp.tagName.toUpperCase() != "LI") {
									$$temp = $$temp.parentNode;
									continue;
								}
								if (id + "_li" == $$temp.getAttribute("id")) {//kendi checkbox ın ise devam etme
									return;
								}
								var checkboxes = $$temp.querySelectorAll(elType + ".cstree-filled-star");
								if (checkboxes.length) {
									var $$div = checkboxes[0];
									if (isChecked) {
										$$.addClass($$div, "cstree-filled-star");
										$$.rmClass($$div, "cstree-empty-star");
									} else {
										$$.addClass($$div, "cstree-empty-star");
										$$.rmClass($$div, "cstree-filled-star");
									}
									tree.checkboxchangeCB(tree.decapID(checkboxes[0].id).split("_star")[0], isChecked, event, 1);//cause = 1 => bebe seçilmiş babalarını etkiliyor
								}
								$$temp = $$temp.parentNode;
							}
						}
						tree.checkboxchangeCB(tree.decapID(id), isChecked, event, 0);//cause = 0 => kendi seçilmiş
					};
				}
			}
		}
		if (icon) {
			var iconImg = $$.create("IMG", {src: icon}, "cstree-icon", null, li);
		}
		li.appendChild(a);
		li.appendChild(ul);

		ins.innerHTML = "&nbsp;";
		a.innerHTML = label;

		if (cssClass) {
			$$.addClass(a, cssClass);
		}

		//eventler
		ins.onclick = function (event) {
			tree.cstreeInsClicked(this);
			return false;
		};

		if (config.accordion || config.toggleOnSelect) {
			a.onclick = function (event) {
				var id = this.getAttribute("id");
				if ($$.hasClass(li, "cstree-leaf")) {
					event.preventDefault();
					event.stopPropagation();
					tree.select(tree.decapID(id), undefined, undefined, event);
				} else {
					event.stopPropagation();
					tree.cstreeInsClicked(this);
					tree.deselectAll();
					tree.selectTreeNode(tree.decapID(id), undefined, true);
				}
				return false;
			};
		} else {
			a.onclick = function (event) {
				var id = this.getAttribute("id");
				event.preventDefault();
				event.stopPropagation();
				tree.select(tree.decapID(id), undefined, undefined, event);
				return false;
			};
		}

		a.onkeyup = function (event) {
			tree.keyupSelect(event);
		};

		if (tree.dblclickCB) {
			a.ondblclick = function (event) {
				var id = this.getAttribute("id");
				tree.dblclickCB(tree.decapID(id), event);
			};
		}
		if (tree.contextmenuCB) {
			a.oncontextmenu = function (event) {
				var id = this.getAttribute("id");
				tree.select(tree.decapID(id), undefined, undefined, event);
				tree.showcontextmenu(event, tree.decapID(id));
			};
		}
		if (tree.dragstartCB) {
			a.ondragstart = function (event) {
				var id = this.getAttribute("id");
				return tree.dragstartCB(event, tree.decapID(id));
			};
		}
		if (tree.dragoverCB) {
			li.ondragover = function (event) {
				var id = this.getAttribute("id").split("_li")[0];
				tree.dragoverCB(event, tree.decapID(id));
			};
		}
		if (tree.dragleaveCB) {
			li.ondragleave = function (event) {
				var id = this.getAttribute("id").split("_li")[0];
				tree.dragleaveCB(event, tree.decapID(id));
			};
		}
		if (tree.dragendCB) {
			li.ondragend = function (event) {
				var id = this.getAttribute("id").split("_li")[0];
				tree.dragendCB(event, tree.decapID(id));
			};
		}
		if (tree.dropCB) {
			li.ondrop = function (event) {
				var id = this.getAttribute("id").split("_li")[0];
				tree.dropCB(event, tree.decapID(id));
			};
		}

		if (childIndex === undefined || (childIndex && childIndex > parentUl.children.length)) {
			childIndex = parentUl.children.length;
		}

		//son çocuk ise
		if (childIndex == parentUl.children.length) {
			//yeni eklenen düğüm son düğümdür.
			$$.addClass(li, "cstree-last");
			//cstree-last sınıfını babasının son çocuğundan çıkar
			if (parentUl.children.length > 0) {
				$$.rmClass(parentUl.lastChild, "cstree-last");
			}
		}

		//yeni eklenen düğüm yapraktır.
		$$.addClass(li, "cstree-leaf");

		if (parentid != this.containerid) {
			var parLi = $$.byid(parentid + "_li");
			//babasından yaprak sınıfını çıkar.
			$$.rmClass(parLi, "cstree-leaf");
			//babasını açık değilse kapat :)
			if (!$$.hasClass(parLi, "cstree-open")) {
				$$.addClass(parLi, "cstree-closed");
			}
		}

		//babasına ekle
		if (childIndex == parentUl.children.length) {
			parentUl.appendChild(li);
		} else {
			parentUl.insertBefore(li, parentUl.children[childIndex]);
		}
		return a;

	}
};

CSTree.prototype.keyupSelect = function (event) {
	event = event || window.event;
	event.preventDefault();
	event.stopPropagation();
	event.returnValue = false;
	var tree = this;

	if (event.which == 37) {//left => babayı seç
		tree.selectParentNode(tree.getSelectedId());
	} else if (event.which == 38) {//up => ust kardesi seç || babayı seç
		var done = tree.selectPreviousSiblingNode(tree.getSelectedId());
		if (!done) {
			tree.selectParentNode(tree.getSelectedId());
		}
	} else if (event.which == 39) {//right => bebeyi seç
		tree.selectFirstChildNode(tree.getSelectedId());
	} else if (event.which == 40) {//down => alt kardesi seç || babanın alt kardesini seç
		var done = tree.selectNextSiblingNode(tree.getSelectedId());
		if (!done) {
			done = tree.selectParentNextSiblingNode(tree.getSelectedId());
			if (!done) {
				tree.selectFirstChildNode(tree.getSelectedId());
			}
		}
	} else if (event.which == 32 || event.which == 13) {//space ya da enter => seçildi eventi fırlat
		event.preventDefault();
		$$.fireEvent($$.byid(tree.getSelectedId()), "click");
	}
	return false;
};

CSTree.prototype.selectParentNextSiblingNode = function (id) {
	id = this.encapID(id);
	var config = this.config;
	var node = $$.byid(id);
	if (node) {
		var parentNodeLi = node.parentNode;
		var parentNodeUl = parentNodeLi.parentNode;
		if (parentNodeUl && parentNodeUl.parentNode) {
			var parentid = parentNodeUl.parentNode.id;
			if (config.accordion && parentid && parentid.indexOf("_innerdiv") > 0) {
				parentid = parentid.replace("innerdiv", "outerdiv");
				return this.selectNextSiblingNode(this.decapID(parentid));
			}

			var parentAnchorNode = this.findElementByTagNameInChildren(parentNodeUl.parentNode, "a");
			if (parentAnchorNode) {//babayı bulduk
				return this.selectNextSiblingNode(this.decapID(parentAnchorNode.id));
			}
		}
	}
	return false;
};

CSTree.prototype.getAncestors = function (id, rel) {
	id = this.encapID(id);
	if (id == this.containerid) {
		return null;
	}
	var result = [];
	var $$a = $$.byid(id), $$li, $$ul;
	if (!$$a) {
		return null;
	}
	$$li = $$a.parentNode;
	if ((rel && !$$li.getAttribute("rel"))) {
		return null;
	}
	result.push(rel ? $$li.getAttribute("rel") : id)
	while ($$a) {
		$$ul = $$li.parentNode;
		id = $$ul.getAttribute("id").split("_ul")[0];
		if (id == this.containerid) {
			break;
		}
		$$a = $$.child($$ul.parentNode, "A");
		if ($$a) {
			$$li = $$a.parentNode;
		}
		if (rel) {
			var relVal = $$li.getAttribute("rel");
			if (!relVal) {
				result.push(this.decapID(id))
				break;
			}
			result.push(relVal)
		} else {
			result.push(this.decapID(id))
		}
	}
	return result;
};

CSTree.prototype.selectNextSiblingNode = function (id) {
	id = this.encapID(id);
	var node = $$.byid(id), tree = this, config = this.config;
	if (node) {
		if (config.accordion && id && id.indexOf("_outerdiv") > 0) {
			var next = node.nextSibling;
			if (next && next.nextSibling) {
				tree.deselectAll();
				tree.selectTreeNode(this.decapID(next.nextSibling.id), false, true);//bir sonraki outer divi seç
				return true;
			}
		} else {
			var siblingLiNode = node.parentNode.nextSibling;
			if (siblingLiNode) {
				var siblingAnchorNode = tree.findElementByTagNameInChildren(siblingLiNode, "a");
				tree.deselectAll();
				tree.selectTreeNode(this.decapID(siblingAnchorNode.id), false, true);
				tree.expandTree(this.decapID(siblingAnchorNode.id), false, true);
				return true;
			}
		}
	}
	return false;
};

CSTree.prototype.selectPreviousSiblingNode = function (id) {
	id = this.encapID(id);
	var node = $$.byid(id), tree = this, config = this.config;
	if (node) {
		if (config.accordion && id && id.indexOf("_outerdiv") > 0) {
			var pre = node.previousSibling;
			if (pre && pre.previousSibling) {
				tree.deselectAll();
				tree.selectTreeNode(this.decapID(pre.previousSibling.id), false, true);//bir önceki outer divi seç
				return true;
			}
		} else {
			var siblingLiNode = node.parentNode.previousSibling;
			if (siblingLiNode) {
				var siblingAnchorNode = tree.findElementByTagNameInChildren(siblingLiNode, "a");
				tree.deselectAll();
				tree.selectTreeNode(this.decapID(siblingAnchorNode.id), false, true);
				tree.expandTree(this.decapID(siblingAnchorNode.id), false, true);
				return true;
			}
		}
	}
	return false;
};

CSTree.prototype.selectFirstChildNode = function (id) {
	id = this.encapID(id);
	var node = $$.byid(id), tree = this, config = this.config;
	if (node) {
		var siblingUlNode = null;
		var callClickCallback = false;
		if (config.accordion && id && id.indexOf("_outerdiv") > 0) {
			siblingUlNode = node.nextSibling.firstElementChild;
			var innerdivid = id.replace("outerdiv", "innerdiv");
			if ($$.byid(innerdivid).style.display !== "block") {
				callClickCallback = true;
			}
		} else {
			siblingUlNode = tree.findElementByTagNameInChildren(node.parentNode, "ul");
		}
		if (siblingUlNode && siblingUlNode.firstElementChild) {
			if (callClickCallback) {
				node.click();
			}
			var childAnchorNode = tree.findElementByTagNameInChildren(siblingUlNode.firstElementChild, "a");
			tree.deselectAll();
			tree.selectTreeNode(this.decapID(childAnchorNode.id), false, true);
			tree.expandTree(this.decapID(childAnchorNode.id), false, true);
			return true;
		}
	}
	return false;
};

CSTree.prototype.selectParentNode = function (id) {
	id = this.encapID(id);
	var node = $$.byid(id), tree = this, config = this.config;
	if (node) {
		var parentNodeLi = node.parentNode;
		var parentNodeUl = parentNodeLi.parentNode;
		if (parentNodeUl && parentNodeUl.parentNode) {
			var parentAnchorNode = tree.findElementByTagNameInChildren(parentNodeUl.parentNode, "a");
			if (parentAnchorNode) {
				tree.deselectAll();
				tree.selectTreeNode(this.decapID(parentAnchorNode.id), false, true);
				tree.expandTree(this.decapID(parentAnchorNode.id), false, true);
				return true;
			} else if (config.accordion) {
				var parentInnerDiv = parentNodeUl.parentNode;
				if (parentInnerDiv.id && parentInnerDiv.id.indexOf("_inner") > 0) {
					tree.deselectAll();
					tree.selectTreeNode(this.decapID(parentInnerDiv.previousSibling.id), undefined, true);
					return true;
				}
			}
		}
	}
	return false;
};

CSTree.prototype.findElementByTagNameInChildren = function (node, tagname) {
	for (var i in node.children) {
		var el = node.children[i];
		if (el.tagName && el.tagName.toLowerCase() == tagname) {
			return el;
		}
	}
	return null;
};

CSTree.prototype.move = function (id, targetid, index) {
	id = this.encapID(id);
	targetid = this.encapID(targetid);
	var li = $$.byid(id + "_li");
	var target = $$.byid(targetid + "_li");
	var targetParent = target.parentNode;//ul

	$$.rmClass(li, "cstree-last");//son li den "cstree-last" sınıfını kaldır
	if (li.id === li.parentNode.lastChild.id && li.parentNode.children.length > 1) {//kaynak babasının son çocuğu ise ve kendinden önce kardeşi varsa
		$$.addClass(csdu.getPrevsibling(li), "cstree-last");//yeni li son olacağı için "cstree-last" sınıfı ekle
	}
	if (li.parentNode.children.length === 1) {//kaynak babasının tek çocuğu ise kaynağın babasına yaprak sınıfı ver.
		var sourceParent = li.parentNode.parentNode;//babasıul.babasıli
		$$.rmClass(sourceParent, ["cstree-open", "cstree-closed"]);
		$$.addClass(sourceParent, "cstree-leaf");
	}

	if (index === "after") {
		if (targetParent.lastChild.id === target.id) {//hedef son çocuk ise
			$$.rmClass(targetParent.lastChild, "cstree-last");//son li den "cstree-last" sınıfını kaldır
			$$.addClass(li, "cstree-last");//yeni li son olacağı için "cstree-last" sınıfı ekle
			targetParent.appendChild(li);//sona ekle
		} else {//bir sonraki çocuktan önceye ekle
			target = $$.next(target);
			targetParent.insertBefore(li, target);
		}
	} else if (index === "before") {
		targetParent.insertBefore(li, target);
	} else if (index === "last") {
		target = target.lastChild;//ul yi al
		if (target.lastChild) {
			$$.rmClass(target.lastChild, "cstree-last");//son li den "cstree-last" sınıfını kaldır
		}
		$$.addClass(li, "cstree-last");//yeni li son olacağı için "cstree-last" sınıfı ekle

		if (target.children.length === 0) {//hedefin çocuğu yoksa
			$$.rmClass(target.parentNode, "cstree-leaf");//liye sınıf ekle
			$$.addClass(target.parentNode, "cstree-open");
		}

		target.appendChild(li);
	} else {
		throw "move sırasında index istenmeyen bir değer geldi...";
	}
};

CSTree.prototype.del = function (id) {
	id = this.encapID(id);
	var li = $$.byid(id + "_li");
	var parentul = null;
	if (li) {
		parentul = li.parentNode;
		this.deselect(this.decapID(id));
	}

	if (li && parentul) {
		if (parentul.children.length == 1) {//tek çocuk ise
			var parentli = parentul.parentNode;
			$$.rmClass(parentli, ["cstree-open", "cstree-closed"]);
			$$.addClass(parentli, "cstree-leaf");
		} else {
			if (parentul.lastChild.id == li.id) {//son çocuk ise
				$$.addClass($$.prev(li), "cstree-last");
			}
		}
		$$.remove(li);
	}
};

CSTree.prototype.deleteChildTreeNodes = function (id) {
	id = this.encapID(id);
	var ul = $$.byid(id + "_ul");
	if (ul) {
		ul.innerHTML = "";
	}
	var li = $$.byid(id + "_li");
	if (li) {
		$$.rmClass(li, ["cstree-open", "cstree-closed"]);
		$$.addClass(li, "cstree-leaf");
	}
};

CSTree.prototype.toggleNode = function (id) {
	id = this.encapID(id);
	this.cstreeInsClicked($$.byid(id));
};

CSTree.prototype.expandTree = function (id, deepExpand, expandParents) {
	id = this.encapID(id);
	var tree = this;
	if (id != this.containerid) {
		var li = $$.byid(id + "_li"), tree = this;
		if (!li) {
			return;
		}
		var exp = $$.byid(id + "_expand"), coll = $$.byid(id + "_collapse");

		if (exp && coll) {
			coll.style.display = "inline-block";
			exp.style.display = "none";
		}

		if (expandParents) {
			tree.expandAllParents(li);
		}

		var liChildren = li.lastChild.children;
		if (liChildren.length > 0) {
			$$.rmClass(li, "cstree-closed");
			$$.addClass(li, "cstree-open");
			if (deepExpand == undefined || deepExpand == true) {
				for (var i = 0; i < liChildren.length; i++) {
					tree.expandTree(this.decapID(liChildren[i].id).split("_li")[0]);
				}
			}
		}
	} else {//tüm ağacı expand et
		var rootChilds = $$.byid(this.contulid) ? $$.byid(this.contulid).children : [];
		for (var i = 0; i < rootChilds.length; i++) {
			tree.expandTree(this.decapID(rootChilds[i].id).split("_li")[0], deepExpand);
		}
	}
};

CSTree.prototype.collapseTree = function (id) {
	id = this.encapID(id);
	var tree = this;
	if (id != this.containerid) {
		var li = $$.byid(id + "_li"), exp = $$.byid(id + "_expand"), coll = $$.byid(id + "_collapse");

		if (exp && coll) {
			exp.style.display = "inline-block";
			coll.style.display = "none";
		}

		var liChildren = li.lastChild.children;
		if (liChildren.length > 0) {
			$$.rmClass(li, "cstree-open");
			$$.addClass(li, "cstree-closed");

			for (var i = 0; i < liChildren.length; i++) {
				tree.collapseTree(this.decapID(liChildren[i].id).split("_li")[0]);
			}
		}
	} else {//tüm ağacı collapse et
		var rootChilds = $$.byid(this.contulid).children;
		for (var i = 0; i < rootChilds.length; i++) {
			tree.collapseTree(this.decapID(rootChilds[i].id).split("_li")[0]);
		}
	}
};

CSTree.prototype.setDisabled = function (flag) {
	this.disabled = flag;
};
CSTree.prototype.getTreeNode = function (id) {
	if (id == this.containerid) {
		return $$.byid(id);
	}
	id = this.encapID(id);
	return $$.byid(id + "_li");
};

CSTree.prototype.getState = function (id) {
	var node = this.getTreeNode(id);
	if (node && $$.hasClass(node, "cstree-open")) {
		return true;
	} else if (node && $$.hasClass(node, "cstree-closed")) {
		return false;
	}
};

CSTree.prototype.setState = function (id, isOpened) {
	var node = this.getTreeNode(id);
	if (node && isOpened === true) {
		$$.rmClass(node, "cstree-closed");
		$$.addClass(node, "cstree-open");
	} else if (node && isOpened === false) {
		$$.rmClass(node, "cstree-open");
		$$.addClass(node, "cstree-closed");
	}
};

CSTree.prototype.getCheckedTreeNodeIds = function () {
	var checkedArr = [], $$ul = $$.byid(this.contulid), config = this.config;
	if (!$$ul) {
		return checkedArr;
	}
	if (config && config.checkbox && config.checkType == "star") {
		var $$divs = $$ul.querySelectorAll(".cstree-filled-star")
		for (var i = 0; i < $$divs.length; i++) {
			checkedArr.push(this.decapID($$.attr($$divs[i], "id").split("_star")[0]));
		}
	} else {
		var $$checks = $$ul.querySelectorAll("input:checked")
		for (var i = 0; i < $$checks.length; i++) {
			checkedArr.push(this.decapID($$.attr($$checks[i], "id").split("_checkbox")[0]));
		}
	}
	return checkedArr;
};

CSTree.prototype.isChecked = function (id) {
	id = this.encapID(id);
	var config = this.config;
	if (config.checkbox) {
		if (config.checkType == "star") {
			return $$.hasClass(id + "_star", "cstree-filled-star");
		} else {
			var $$check = $$.byid(id + "_checkbox");
			return $$check ? $$check.checked : false;
		}
	}
	return false;
};

CSTree.prototype.isRendered = function () {
	return $$.byid(this.contulid) != null;
};

CSTree.prototype.setCheckedNodes = function (idArr) {
	idArr = this.encapID(idArr);
	var $$ul = $$.byid(this.contulid), config = this.config;
	if (!$$ul) {
		return;
	}
	if (config.checkbox && config.checkType == "star") {
		//hepsini seçilmemiş hale getir.
		var $$divs = $$ul.querySelectorAll(".cstree-filled-star");
		for (var i = 0; i < $$divs.length; i++) {
			$$.rmClass($$divs[0], "cstree-filled-star");
			$$.addClass($$divs[0], "cstree-empty-star");
		}

		if (idArr) {
			for (var i in idArr) {
				var checkbox = $$.byid(idArr[i] + "_star");
				if (checkbox) {
					$$.addClass(checkbox, "cstree-filled-star");
					$$.rmClass(checkbox, "cstree-empty-star");
				}
			}
		}
	} else {
		//hepsini seçilmemiş hale getir.
		var $$checks = $$ul.querySelectorAll("input:checked");
		for (var i = 0; i < $$checks.length; i++) {
			$$checks[i].checked = false;
		}

		if (idArr) {
			for (var i in idArr) {
				var checkbox = $$.byid(idArr[i] + "_checkbox");
				if (checkbox) {
					checkbox.checked = true;
				}
			}
		}
	}
};

CSTree.prototype.setKeyboardShortcutKeyCode = function (keyCode) {
	this.keyboardShortcutKeyCode = keyCode;
};

CSTree.prototype.setKeyboardShortcutEnabled = function (isEnabled) {
	this.keyboardShortcutEnabled = isEnabled;
};

CSTree.prototype.ondblclick = function (f) {
	this.dblclickCB = f;
	return this;
};

CSTree.prototype.onselect = function (f) {
	this.selectCB = f;
	return this;
};
CSTree.prototype.onaddclick = function (f) {
	this.addclickCB = f;
	return this;
};
CSTree.prototype.onacc = function (f) {
	this.accCB = f;
	return this;
};
CSTree.prototype.oncheckboxchange = function (f) {
	this.checkboxchangeCB = f;
	return this;
};
CSTree.prototype.onbeforecheckboxchange = function (f) {
	this.beforecheckboxchangeCB = f;
	return this;
};
CSTree.prototype.oncontextmenu = function (f) {
	this.contextmenuCB = f;
	return this;
};
CSTree.prototype.onrename = function (f) {
	this.renameCB = f;
	return this;
};
CSTree.prototype.ondragstart = function (f) {
	this.dragstartCB = f;
	return this;
};
CSTree.prototype.ondragover = function (f) {
	this.dragoverCB = f;
	return this;
};
CSTree.prototype.ondragleave = function (f) {
	this.dragleaveCB = f;
	return this;
};
CSTree.prototype.ondragend = function (f) {
	this.dragendCB = f;
	return this;
};
CSTree.prototype.ondrop = function (f) {
	this.dropCB = f;
	return this;
};
CSTree.prototype.onnodeexpanded = function (f) {
	this.nodeexpandedCB = f;
	return this;
};
CSTree.prototype.onnodecollapsed = function (f) {
	this.nodecollapsedCB = f;
	return this;
};
CSTree.prototype.focus = function (id) {
	this.scrollToNode(id);
	id = this.encapID(id);
	var $$a = $$.byid(id);
	if ($$a) {
		$$a.focus();
	}
};
CSTree.prototype.expandParents = function (id) {
	id = this.encapID(id);
	var $$li = $$.byid(id + "_li");
	if ($$li) {
		this.expandAllParents($$li);
	}
};
CSTree.prototype.clearTree = function () {
	var $$tree = $$.byid(this.containerid);
	if ($$tree) {
		for (var i = 0; i < $$tree.childNodes.length; i++) {
			if (!$$.hasClass($$tree.childNodes[i], "csctree-top-div")) {
				$$.remove($$tree.childNodes[i]);
			}
		}
	}
};
CSTree.prototype.setConfig = function (paramConf) {
	if (paramConf) {
		for (var i in paramConf) {
			this.config[i] = paramConf[i];
		}
	}
};

CSTree.prototype.destroy = function (paramConf) {
	this.dblclickCB = null;
	this.selectCB = null;
	this.addclickCB = null;
	this.accCB = null;
	this.checkboxchangeCB = null;
	this.beforecheckboxchangeCB = null;
	this.contextmenuCB = null;
	this.renameCB = null;
	this.dragstartCB = null;
	this.dragoverCB = null;
	this.dragleaveCB = null;
	this.dragendCB = null;
	this.dropCB = null;
	this.nodeexpandedCB = null;
	this.nodecollapsedCB = null;
};function WebsocketManager(environment){
    var socket = io();

    socket.on('connect', function (data) {
        console.log("Connected websocket server successfuly.");
        socket.emit("register user", {environment: environment, pm: sideCurrentPM, ou: window.sideCurrentOU || undefined});
    });

    socket.on("connect_failed", function(err){
        console.log("Websocket connecyion error: " + err);
    });

    socket.on("logged out", function(){
		window.location = "login.html";
    });

    this.emitEvent = function (action, data, target) {
        socket.emit("emit event", {action: action, target: target, data: data});
    };

    this.on = function(action, callback){
        socket.on(action, callback);
    };
}
