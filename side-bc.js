
/****************************=csc-vertical.js=******************************/
(function(window, undefined) {
/** @class CSC-VERTICAL LAYOUT */
function Definition(CS) {
	this.DEFAULTS = {
		style : {
			textAlign : "left"
		}
	};

	this.BaseBF = "DYN-CONTAINER";

	this.METHODS = [ "mask", "unmask", "collapse", "expand", "accordion(width)", "hasVisibleItem", "scrollTo(direction)", "isCollapsed()", "close", "saveScrollPosition" ];
	this.EVENTS = [ "selected", "oncontextmenu", "onEnterPressed", "onload", "oninit(param)", "onexpand(expanded)", "closeIconSelected", "ondragstart(member)", "ondrop","dragover","dragleave" ];
  this.DISABLE_EVENTS = [ "selected" ];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-VERTICAL", def);

var BC = def.Type;

/**
 * @function accordion
 * @description Expands o collapses according to given width
 * @param {string} width - width of member
 */
BC.prototype.accordion = function(width) {
	if(typeof width != "string"){
		return;
	}
	var bc=this, config=bc.config;
	var $$vertContainer = $$.byid(config.id);
	if(!$$vertContainer){
		return;
	}
	var $container = $($$vertContainer);
	if(width.indexOf("-") == 0){
		$container.animate({
			width : width
		}, 500, function() {
			$container.hide();
		});
	} else {
		$container.show();
		var bf = bc.bf;
		$container.animate({
			width : width
		}, 500, function() {
			BFEngine.DRL(bf);
		});
	}
};

BC.prototype.saveScrollPosition = function(){
	this.saveScroll = true;
};

BC.prototype.scrollTo = function(arg){
	var bc=this, config=bc.config;
	if(arg == "bottom"){
		var $$cont = $$.byid(config.id);
		if($$cont){
			bc.scrollTop = 10000;
			$$cont.scrollTop = bc.scrollTop;
		}
	}
};

BC.prototype.renderMember = function(member, $$verItemsContainer){
	if (member.bcRef.typeName == "CSC-POPUP") {
		return;
	}
	var bc = this, bf=bc.bf, config=bc.config;
	var $$vertContainer = $$.byid(config.id);
	if(!$$vertContainer){
		return;
	}
	var scrolledParent = $$.findScrolledParent($$vertContainer);
	var scrollTop = scrolledParent ? scrolledParent.scrollTop : 0;
	var $$after = null, $$into = null;
	if(!$$verItemsContainer){
		var previusMember = null;
		$$verItemsContainer = $$.getChildHasClass($$vertContainer, "csc-ver-items-container");
		if(!$$verItemsContainer){
			var $$verItemsContainer = $$.query($$vertContainer, [{clazz:"csc-form-fieldset"},{clazz:"csc-ver-items-container"}]);
		}
		for(var memName in bf.members){
			if(bf.members[memName] == member){
				break;
			}
			var $$tmp = $$.query($$verItemsContainer, {clazz: "csc-ver-block", attr: {rel:memName}});
			if($$tmp){
				$$after = $$tmp;
			}
		}
		if(!$$after){
			$$into = $$verItemsContainer;
		}
	}
	
	var memName = member.$CS$.name;

	var $$renderedDiv = $$.query($$verItemsContainer, {clazz: "csc-ver-block", attr: {rel:memName}});
	if($$renderedDiv){//zaten render edilmiş, rerender isteniyor
		$$.remove($$renderedDiv)
	}
	if (!inDesigner(bf) && (!bf.isVisible() || !member.hasVisibleItem())) {
		return;
	}

	var memberConfig = member.getConfig();
	var $$labelDiv = null;
	var $$elementDiv = $$.create("div");
	var labelPosition = memberConfig.labelPosition === "inherited" ? config.labelPosition : (memberConfig.labelPosition || config.labelPosition);
    var labelColonVisible = memberConfig.labelColonVisible === "yes" ? config.labelColonVisible : (memberConfig.labelColonVisible || config.labelColonVisible);
	if (labelPosition == "inherited") {
		labelPosition = "none";
	}
	if (labelPosition != "none") {
		$$labelDiv = $$.create("div", null, ["csc-form-label",memberConfig.label_class]);
		if (memberConfig.label) {
			var label = memberConfig.label;
			if(labelPosition == "left"){
                if(!labelColonVisible){
                    label = label + " : ";
                }
                if (labelColonVisible){
                    $$labelDiv.classList.add("hidden-dot");
                    label = label + "  ";
                }
			}
			if(memberConfig.labelClick){
				$$labelDiv.innerHTML = "<label for='"+memberConfig.id+"'>"+ label +"</label>";
			}else{
				$$labelDiv.innerHTML = "<label>"+ label +"</label>";
			}
		}
	}

	var $$containerDiv = $$.create("div", {"rel": memName}, "csc-ver-block ");
	if (false/*member.isContainer() || member.isTabular()*/) {
		// containe ve tabular BF'ler için hor align sadece label pos=top olduğunda önemli, diğer durumlarda bir fark yaratmıyor
		if(memberConfig.label && labelPosition && labelPosition !== "none"){
			if (labelPosition == "left") {
				$$containerDiv.style.display = "table";
				var $$rowDiv = $$.create("div", null, null,{display: "table-row"});
				$$.css($$elementDiv, {display: "table-cell", width: "100%"});
				$$.css($$labelDiv, {display: "table-cell", verticalAlign: "middle"});
				$$rowDiv.appendChild($$labelDiv);
				$$rowDiv.appendChild($$elementDiv);
				$$containerDiv.appendChild($$rowDiv);
				$$labelDiv.classList.add("csc-left-align-label");
			} else if (labelPosition == "top") {
				$$.css($$labelDiv, {width: "100%", textAlign: this.config.horAlign});
				$$containerDiv.appendChild($$labelDiv);
				$$containerDiv.appendChild($$elementDiv);
			} else if (labelPosition == "right") {
				$$containerDiv.style.display = "table";
				var $$rowDiv = $$.create("div", null, null,{display: "table-row"});
				$$.css($$elementDiv, {display: "table-cell", width: "100%"});
				$$.css($$labelDiv, {display: "table-cell", verticalAlign: "middle"});
				$$rowDiv.appendChild($$elementDiv);
				$$rowDiv.appendChild($$labelDiv);
				$$containerDiv.appendChild($$rowDiv);
				$$labelDiv.classList.add("csc-right-align-label");
			}
		} else {
			$$elementDiv.style.width = "100%";
			$$containerDiv.appendChild($$elementDiv);
		}
	} else {// Basic Type
		if (this.config.horAlign == "left" || config.horAlign == "right") {
			if(memberConfig.label && labelPosition && labelPosition !== "none"){
				if (labelPosition == "left") {
					$$.css($$containerDiv, {textAlign: config.horAlign, width: "100%"});
					$$elementDiv.style.display = "inline-block";
					$$labelDiv.style.display = "inline-block";
					$$containerDiv.appendChild($$labelDiv);
					$$containerDiv.appendChild($$elementDiv);
					$$labelDiv.classList.add("csc-left-align-label");
				} else if (labelPosition == "top") {
					$$.css($$labelDiv, {width: "100%",textAlign: config.horAlign});
					$$.css($$elementDiv, {width: "100%",textAlign: config.horAlign});
					$$containerDiv.appendChild($$labelDiv);
					$$containerDiv.appendChild($$elementDiv);
				} else if (labelPosition == "right") {
					$$.css($$containerDiv, {width: "100%",textAlign: config.horAlign});
					$$elementDiv.style.display = "inline-block";
					$$labelDiv.style.display = "inline";
					$$containerDiv.appendChild($$elementDiv);
					$$containerDiv.appendChild($$labelDiv);
					$$labelDiv.classList.add("csc-right-align-label");
				}
			} else {// none
				$$elementDiv.style.width = "100%";
				$$.css($$containerDiv, {width: "100%",textAlign: config.horAlign});
				$$containerDiv.appendChild($$elementDiv);
			}
		} else {// Hor align is CENTER
			if(memberConfig.label && labelPosition && labelPosition !== "none"){
				if (labelPosition == "left") {
					$$.css($$containerDiv, {width: "100%",textAlign: config.horAlign});
					$$elementDiv.style.display = "inline-block";
					$$labelDiv.style.display = "inline-block";
					$$containerDiv.appendChild($$labelDiv);
					$$containerDiv.appendChild($$elementDiv);
					$$labelDiv.classList.add("csc-left-align-label");
				} else if (labelPosition == "top") {
					$$containerDiv.style.textAlign = config.horAlign;
					$$.css($$labelDiv, {width: "100%",textAlign: config.horAlign});
					$$.css($$elementDiv, {width: "100%",textAlign: config.horAlign});
					$$containerDiv.appendChild($$labelDiv);
					$$containerDiv.appendChild($$elementDiv);
				} else if (labelPosition == "right") {
					$$.css($$containerDiv, {width: "100%",textAlign: config.horAlign});
					$$elementDiv.style.display = "inline-block";
					$$labelDiv.style.display = "inline";
					$$containerDiv.appendChild($$elementDiv);
					$$containerDiv.appendChild($$labelDiv);
					$$labelDiv.classList.add("csc-right-align-label");
				}	
			}else {// none
				$$.css($$containerDiv, {width: "100%",textAlign: config.horAlign});
				$$containerDiv.appendChild($$elementDiv);
			}
		}
	}
	if(memberConfig.layoutConfig && memberConfig.layoutConfig.vertHeight){
		$$elementDiv.style.height = memberConfig.layoutConfig.vertHeight;
	}
	
	if($$after){
		var $$next = $$.next($$after);
		$$verItemsContainer.insertBefore($$containerDiv, $$next || null);
	} else if($$into){
		$$verItemsContainer.insertBefore($$containerDiv, $$into.firstChild);
	} else {
		$$verItemsContainer.appendChild($$containerDiv);
	}

	if (member.isRequired() && (!bf.isDisabled() && !member.isDisabled())) {
		$$.addClass($$elementDiv, "csc-required");
	}
	if(bc.config.draggable){
		$$elementDiv.setAttribute("draggable", "true");
		$$.bindEvent($$elementDiv, "dragstart", function(event){
			console.log("vertical on drag start, member name:" + memName);
			event.stopPropagation();
			bc.bf.fire("ondragstart", memName);
		});
	}
	
	BFEngine.render(member, $$elementDiv);
//	if(scroolTop != $$.getScrollTop()){
//		window.scrollTo(undefined, scrool);
//	}
	if(scrolledParent){
		scrolledParent.scrollTop = scrollTop;
	}
};

BC.prototype.render = function($container) {
	var bc = this, bf=bc.bf, config=bc.config, style=config.style;
	
	var $$vertContainer = $$.create("div", {"id": config.id}, ["csc-ver-container", config.cssClass]);
	var $$verItemsContainer = $$.create("div", undefined, ["csc-ver-items-container", "csc-bordered-box"]);
	$$vertContainer.style.display = config.visible ? "" : "none";

	if(config.panelType){
		$$verItemsContainer.classList.add("csc-ver-container__"+config.panelType);
	}
	if(style && style.fillPanel){
		$$verItemsContainer.classList.add("csc-ver-container--filled");
	}
	if(style && style.borderPanel){
		$$verItemsContainer.classList.add("csc-ver-container--bordered");	
	}
	if(inDesigner(bf)){
		$$vertContainer.style.display = "";
	}
	if(sideDebugLevel() > 1){
			$$vertContainer.setAttribute("rel-def", bf.getBusinessName());
	}
	if (style && style.width) {
		$$vertContainer.style.width = style.width;
		if(style.overflowAuto){
			$$.css($$verItemsContainer, "overflow-x", "auto");
		}
	}
	if (style && style.height) {
		$$.css($$vertContainer, "height", style.height);
		if(style.overflowAuto){
			$$.css($$vertContainer, "overflow-y", "auto");
		}
	}
	if (style && style.padding) {
		$$.css($$vertContainer, "padding", style.padding);
	}
	$$.css($$verItemsContainer, style);

	var titleType = config.titleType || "none";
	if (titleType == "window") {
		var $$titleDiv = $$.create("div", null, ["csc-form-title", config.titleClass], {"width": "100%"});
		var $$titleSpan = $$.create("span", null, config.titleIcon);
		$$titleSpan.innerHTML = config.title || "";
		$$titleDiv.appendChild($$titleSpan);
		if (config.collapsible === true) {
			var $$collapseBtn = $$.create("ins", null, "collapse");
			$$collapseBtn.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$titleDiv.appendChild($$collapseBtn);
			if(config.collapsePos === "left"){
				$$.addClass($$titleDiv, "csc-form-title-collapse-left"); 
			}
		}
		if(config.showCloseIcon){
			var $$closeBtn = $$.create("ins", null, "close");
			$$closeBtn.onclick = function() {
				bc.bf.fire("closeIconSelected");
			};
			$$titleDiv.appendChild($$closeBtn);
		}
		$$vertContainer.appendChild($$titleDiv);
		$$.addClass($$verItemsContainer, "csc-bordered-container");
		$$vertContainer.appendChild($$verItemsContainer);
	} else if (titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("fieldset", null, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset":null]);
		var $$legend = $$.create("legend", undefined,  config.titleClass);
		if (config.collapsible === true && config.showTitle !== false) {
			$$.addClass($$legend, "collapse");
			$$legend.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$legend.innerHTML = "<span>" +(config.title || "&nbsp;")+ "</span>";
			$$fieldSet.appendChild($$legend);
		} else if (config.title && config.showTitle !== false) {
			$$legend.innerHTML = "<span>" +(config.title || "&nbsp;")+ "</span>";
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
		if(config.bottomBorder === false){
				$$.addClass($$fieldSet, "no-bottom-border");
		}
		$$fieldSet.appendChild($$verItemsContainer);
		$$vertContainer.appendChild($$fieldSet);

	} else if (titleType === undefined || titleType == "none") {
		//$$.addClass($$vertContainer, "csc-form-container");
		$$vertContainer.appendChild($$verItemsContainer);
	}
	
	$container.appendChild($$vertContainer);
	for ( var memberName in bf.members) {
		var member = bf.members[memberName];
		bc.renderMember(member, $$verItemsContainer);
	}
	
	if (config.collapsible === true) {
		if(bc.collapsed){
			bc.collapse();
		} else {
			bc.expand();
		}
	}
	if (config.defaultCollapseStatus) {
		bc.collapse();
	}
	
	bc.applyAddedClasses();
	
	if(bc.scrollTop){//scrollTo metodu için gerekli
		$$vertContainer.scrollTop = bc.scrollTop;
	}
	if(config.maskIt){
		bc.mask();
	}
	if(this.savedScrolls){
		$$vertContainer.scrollTop = this.savedScrolls.top;
		$$vertContainer.scrollLeft = this.savedScrolls.left;
	}


	if(config.popupable){
		var $$togglePopupButton = document.createElement("button");
		$$togglePopupButton.innerHTML = "<i class='fa fa-external-link'></i>";
		$$togglePopupButton.classList.add("toggle-popup");
        $container.classList.add("popupable");
        $$togglePopupButton.onclick = function() {
            $container.classList.toggle("popupon");
            for(var mname in bf.members){
                BFEngine.DRL(bf.members[mname]);
            }
		};
        $$vertContainer.appendChild($$togglePopupButton);

        var $$popupableCover = document.createElement("div");
        $$popupableCover.classList.add("popupable-cover");
        $container.appendChild($$popupableCover);
	}
};

BC.prototype.saveState = function() {
	if(this.saveScroll){
		var $$vertContainer = $$.byid(this.config.id);
		if($$vertContainer){
			this.savedScrolls = {
				top: $$vertContainer.scrollTop,
				left:$$vertContainer.scrollLeft
			};
		}
	}
};

BC.prototype.load = function() {
	if (this.onloadcallback) {
		this.onloadcallback();
	}
};

/**
 * @description Collapses the container
 * @function collapse
 */
BC.prototype.collapse = function() {
	var bc = this, bf=bc.bf, config=bc.config;
	var $$container = $$.byid(config.id);
	if(config.titleType == "fieldset" || config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "expand", "collapse");
		$$.toggleClass($$fieldset, "expanded", "collapsed");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-ver-items-container"), "display", "none");
		$$.css($$fieldset, "height", "8px");
	} else if(config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "expand", "collapse");
		$$.css($$.getChildHasClass($$container, "csc-ver-items-container"), "display", "none");
	}
	
	bc.collapsed = true;
	bf.fire("onexpand", false);
};

BC.prototype.isCollapsed = function() {
	return this.collapsed;
};

/**
 * @function expand
 * @description Expands the collaped container
 */
BC.prototype.expand = function() {
	var bc = this, bf=bc.bf, config=bc.config;
	var $$container = $$.byid(config.id);
	if(config.titleType == "fieldset" || config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "collapse", "expand");
		$$.toggleClass($$fieldset, "collapsed", "expanded");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-ver-items-container"), "display", "");
		if($$fieldset){
			$$fieldset.style.height = "";
		}
	} else if(config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "collapse", "expand");
		$$.css($$.getChildHasClass($$container, "csc-ver-items-container"), "display", "");
	}
	
	bc.collapsed = false;
	for(var mname in bf.members){
		BFEngine.DRL(bf.members[mname]);
	}
	bf.fire("onexpand", true);
};

BC.prototype.getChildContainer = function(memberName) {
	var bc = this, config=bc.config;
	var $$container = $$.byid(config.id);
	if(!$$container){
		return;
	}
	if(config.titleType == "fieldset" || config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		var $$vertContainer = $$.getChildHasClass($$fieldset, "csc-ver-items-container");
		return $$.getChildHasAttr($$vertContainer, "rel", memberName);
	} else {
		var $$vertContainer = $$.getChildHasClass($$container, "csc-ver-items-container");
		return $$.getChildHasAttr($$vertContainer, "rel", memberName);
	}
};

/**
 * @function mask
 * @description Masks the container with given message.
 * @param {string} [message] message
 */
BC.prototype.mask = function(message) {
	var bc=this, config=bc.config, id=config.id;

	config.maskMessage = message || config.maskMessage;
	config.maskIt = true;
	 
	var $$gen = $$.byid(id);
	if(!$$gen){
		return;
	}
	var maskDivId = id + "-mask";
	$$dom = $$.byid(maskDivId);
	$$.remove($$dom);
	
	var $$maskDiv = $$.create("DIV",{"id": maskDivId}, "maskDiv", {"width": $$.innerWidth($$gen)+"px", "height": $$.innerHeight($$gen)+"px"});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = config.maskMessage;
	
	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);
	
	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);
	$$.css($$parent, { position: "relative"});
	
	$$.css($$loadingDiv, {"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2+"px", "margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2+"px"});
};

/**
 * @function unmask
 * @description Unmasks the masked container
 */
BC.prototype.unmask = function() {
	$$dom = $$.byid(this.config.id+"-mask");
	$$.remove($$dom);
	this.config.maskIt = undefined;
};

/**
 * Sets a title to container
 * @param {string} title title
 */
BC.prototype.setTitle = function(title){
	var bc=this, config=bc.config;
	config.title = title;
	var $$container = $$.byid(config.id);
	if(this.config.titleType == "window") {
		var $$spanTitle = $$.query($$container, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	} else if(config.titleType == "fieldset" || config.titleType == "bfieldset") {
		var $$spanTitle = $$.query($$container, [{tagName: "fieldset"}, {tagName: "legend"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	}
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	var $$dom,id=this.config.id;
	if (eventName == "selected") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.onclick = callback;
		}
	}else if (eventName == "oncontextmenu") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.oncontextmenu = callback;
		}
	} else if (eventName == "drop" || eventName == "ondrop") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.ondrop = callback;
			$$.bindEvent($$dom, "dragover", function (ev){ev.preventDefault(); ev.stopPropagation();});//drop olayının çalışması için
		}
	} else if (eventName == "dragover") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.ondragover = callback;
		}
	} else if (eventName == "dragleave") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.ondragleave = callback;
		}
	} else if (eventName == "onload") {
		this.onloadcallback = callback;
	} else if (eventName == "onEnterPressed") {
		$$dom = $$.byid(id);
		if ($$dom) {
			$$dom.onkeypress = function(e) {
				if (e.keyCode == 10 || e.keyCode == 13) {//keyCode is 10 if ctrl+enter in chrome
					SIDENavigator.setEvent(e);
					callback();
				}
			};
		}
	}
};




})(window);
/****************************=csc-balanced-ver.js=******************************/
(function(window, undefined) {
/** CSC-VERTICAL LAYOUT* */

function Definition(CS) {
	this.DEFAULTS = {
		style : {
			textAlign : "left"
		},
		collapsePos:"right"
	};

	this.BaseBF = "CONTAINER";
	this.METHODS = [ "collapse", "expand", "mask", "unmask", "close" ];
	this.EVENTS = [ "selected", "oncontextmenu", "onEnterPressed", "onload", "oninit(param)", "closeIconSelected"   ];

	this.Type = function() {
	};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-BALANCED-VER", def);

var BC = def.Type;

BC.prototype.beforeDRL = function () {
	var bc = this, config=bc.config, style=config.style||{};
	if(style.fillHeight){
		var $$vertContainer = $$.byid(config.id);
		if($$vertContainer){
			var $container = $$vertContainer.parentNode;
			$$.css($$vertContainer, {"height": "20px"});
		}
	}
};

BC.prototype.DRL = function () {
	var bc = this, config=bc.config, style=config.style||{};
	if(style.fillHeight){
		var $$vertContainer = $$.byid(config.id);
		if($$vertContainer){
			var $container = $$vertContainer.parentNode;
			$$.css($$vertContainer, {"height": $$.height($container)+"px"});
		}
	}
};

BC.prototype.render = function($container) {
	var bc = this, bf = bc.bf, config=bc.config, style=config.style||{};
	var $$vertContainer = $$.create("DIV", {"id": config.id}, ["csc-balanced-ver-container", config.cssClass]);
	var $$vertTable = $$.create("DIV", undefined, "csc-balanced-ver-table");
	// set style's of container
	$$.css($$vertContainer, {"display": config.visible ? "" : "none"});
	if(inDesigner(bf)){
		$$.css($$vertContainer, {"display": ""});
	}
	if(sideDebugLevel() > 1){
			$$vertContainer.setAttribute("rel-def",bf.getBusinessName());
	}
	if(style.width) {
		$$.css($$vertContainer, {"width": style.width});
	}
	$$.css($$vertTable, style);
	if(style.height) {
		$$.css($$vertTable, {"height": "100%"});
		$$.css($$vertContainer, {"height": style.height});
	}
	if(style.fillHeight){
		$$.css($$vertContainer, {"height": $$.height($container)+"px"});
		$$.css($$vertTable, {"height": "100%"});
	}

	var titleType = config.titleType || "none";
	if (titleType == "window") {
		var $$titleDiv = $$.create("DIV", undefined, "csc-form-title", {"width": "100%"});
		var $$titleSpan = $$.create("SPAN");
		$$titleSpan.innerHTML = config.title;
		if (config.titleIcon) {
			$$.addClass($$titleSpan, config.titleIcon);
		}
		$$.addClass($$titleDiv, config.titleClass);
		$$titleDiv.appendChild($$titleSpan);
		if (config.collapsible === true) {
			var $$collapseBtn = $$.create("INS", undefined, "collapse");
			$$collapseBtn.click(function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			});
			$$titleDiv.appendChild($$collapseBtn);
			if(config.collapsePos === "left"){
				$$.addClass($$titleDiv, "csc-form-title-collapse-left"); 
			}
		}
		if(config.showCloseIcon){
			var $$closeBtn = $$.create("ins", null, "close");
			$$closeBtn.onclick = function() {
				bc.bf.fire("closeIconSelected");
			};
			$$titleDiv.appendChild($$closeBtn);
		}
		$$vertContainer.appendChild($$titleDiv);
		$$.addClass($$vertTable, "csc-bordered-container");
		$$vertContainer.appendChild($$vertTable);
	} else if (titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("FIELDSET", undefined, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset":null]);
		var $$legend = $$.create("LEGEND");
		if (config.collapsible === true && config.showTitle !== false) {
			$$.addClass($$legend, "collapse");
			$$legend.onclick = (function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			});
			var $$span = $$.create("SPAN");
			$$span.innerHTML = config.title || "&nbsp;";
			$$legend.appendChild($$span);
			$$fieldSet.appendChild($$legend);
		} else if (config.title && config.showTitle !== false) {
			var $$span = $$.create("SPAN");
			$$span.innerHTML = config.title;
			$$legend.appendChild($$span);
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
		if(config.bottomBorder === false){
			$$.addClass($$fieldSet, "no-bottom-border");
		}
		$$fieldSet.appendChild($$vertTable);
		$$vertContainer.appendChild($$fieldSet);
	} else if (titleType === undefined || titleType == "none") {
		$$.addClass($$vertContainer, "csc-bordered-box");
		$$vertContainer.appendChild($$vertTable);
	}

	$container.appendChild($$vertContainer);

	var contentMember, $$contentContainer;

	// append members into container
	for ( var memberName in bf.members) {
		var member = bf.members[memberName];
		if (member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if (!inDesigner(bf) && !member.hasVisibleItem()) {
			continue;
		}

		var memberConfig = member.getConfig();
		var $$rowDiv = $$.create("DIV", undefined, "csc-balanced-ver-row");
		var $$labelDiv = null, $$elementDiv = $$.create("DIV", undefined, "csc-ver-cell");
		var labelPosition = memberConfig.labelPosition === "inherited" ? this.config.labelPosition : (memberConfig.labelPosition || config.labelPosition);

		if (labelPosition != "none") {
			$$labelDiv = $$.create("DIV", undefined, ["csc-form-label", memberConfig.label_class]);
			if (memberConfig.label) {
				var label = memberConfig.label;
				if(labelPosition != "right"){
					label = label + ":";
				}
				$$labelDiv.innerHTML = label;
			}
		}

		if (labelPosition == "left") {
			$$.addClass($$labelDiv, "csc-ver-cell");
			$$.css($$labelDiv, "text-align", "right");
			$$rowDiv.appendChild($$labelDiv);
			$$rowDiv.appendChild($$elementDiv);
			$$vertTable.appendChild($$rowDiv);
			if (config.horAlign == "left") {
				$$.css($$elementDiv, "width", "100%");
			} else if (config.horAlign == "center") {
				$$.css($$elementDiv, "text-align", "left");
			} else {
				$$.css($$labelDiv, "width", "100%");

			}
		} else if (labelPosition == "top") {
			$$.addClass($$labelDiv, "csc-ver-cell");
			$$vertTable.appendChild($$labelDiv);
			$$vertTable.appendChild($$elementDiv);
		} else if (labelPosition == "right") {
			var $$containerDiv = $$.create("DIV", undefined, "csc-ver-row");
			$$.css($$labelDiv, "textAlign", "left");
			$$containerDiv.appendChild($$elementDiv);
			$$containerDiv.appendChild($$labelDiv);
			$$vertTable.appendChild($$containerDiv);
		} else {// label position == none
			$$rowDiv.appendChild($$elementDiv);
			$$vertTable.appendChild($$rowDiv);
		}

		if (member.isRequired() && (!bf.isDisabled() && !member.isDisabled())) {
			$$.addClass($$elementDiv, "csc-required");
		}
		var memLayoutConfig = memberConfig.layoutConfig;
		if(memLayoutConfig){
			if(memLayoutConfig.height){
				$$.css($$elementDiv, "height", memLayoutConfig.height == "*" ? "" : memLayoutConfig.height);
			}
			if(memLayoutConfig.valign){
				$$.css($$elementDiv, "vertical-align", memLayoutConfig.valign);
			}
		}

		if(memLayoutConfig && memLayoutConfig.height == "*"){
			//Content olan elemanı en son çiz (kalan yüksekliği doğru alabilmesi için)
			contentMember = member;
			$$contentContainer = $$elementDiv;
		} else {
			BFEngine.render(member, $$elementDiv);
		}
	}
	if(contentMember){
		BFEngine.render(contentMember, $$contentContainer);
	}

	
	if (config.collapsible === true) {
		if(this.collapsed){
			this.collapse();
		} else {
			this.expand();
		}
	}
	if (config.defaultCollapseStatus) {
		bc.collapse();
	}
	this.applyAddedClasses();//Apply css classes added by user
	
	if(config.maskIt){
		this.mask();
	}
};

BC.prototype.load = function() {
	if (this.onloadcallback) {
		this.onloadcallback();
	}
};

/**
 * @description Collapses the container
 * @function collapse
 */
BC.prototype.collapse = function() {

	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "expand", "collapse");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "expanded", "collapsed");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-balanced-ver-table"), "display", "none");//-----> içeriği kapat
		$$.css($$fieldset, "height", 0);
	} else if(this.config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "expand", "collapse");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-balanced-ver-table"), "display", "none");//----> içeriği kapat
	}
	
	this.collapsed = true;
};

/**
 * @function expand
 * @description Expands the collaped container
 */
BC.prototype.expand = function() {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "collapse", "expand");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "collapsed", "expanded");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-balanced-ver-table"), "display", "");//-----> içeriği kapat
		if($$fieldset){
			$$fieldset.style.height = "";
		}
	} else if(this.config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "collapse", "expand");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-balanced-ver-table"), "display", "");//----> içeriği kapat
	}
	
	this.collapsed = false;
};

/**
 * @function mask
 * @description Masks the container with given message.
 * @param {string} [message] message
 */
BC.prototype.mask = function(message) {
	var id = this.config.id;

	var $$gen = $$.byid(id);
	if(!$$gen){
		this.config.maskIt = true;
		return;
	}
	
	var $$maskDiv = $$.create("DIV",{"id": id + "-mask"}, "maskDiv", {"width": $$.innerWidth($$gen)+"px", "height": $$.innerHeight($$gen)+"px"});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = message;
	
	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);
	
	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);
	
	$$.css($$loadingDiv, {"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2+"px", "margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2+"px"});
};

/**
 * @function unmask
 * @description Unmasks the masked container
 */
BC.prototype.unmask = function() {
	$$dom = $$.byid(this.config.id+"-mask");
	$$.remove($$dom);
	this.config.maskIt = undefined;
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	}else if (eventName == "oncontextmenu") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.oncontextmenu = callback;
		}
	} else if (eventName == "drop") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
		}
	} else if (eventName == "dragover") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	} else if (eventName == "onload") {
		this.onloadcallback = callback;
	} ""
};



})(window);
/****************************=csc-balanced-hor.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-BALANCED-HOR LAYOUT
 */
function Definition(CS) {
	this.DEFAULTS = {
		verAlign: "top",
		itemsPlacement: "equal",
		style: {
			textAlign: "left",
			verticalAlign: "top"
		}
	};

	this.BaseBF = "CONTAINER";
	this.METHODS = ["collapse", "expand", "accordion", "mask", "unmask", "makeResizable", "close"];
	this.EVENTS = ["selected", "oncontextmenu", "onEnterPressed", "onload", "oninit(param)", "closeIconSelected"];

	this.Type = function () {
	};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-BALANCED-HOR", def);

var BC = def.Type;

BC.prototype.isCollapsed = function () {
	return this.collapsed;
};

BC.prototype.DRL = function () {
	var bc=this, config=bc.config, style=config.style, bf=bc.bf;
	var $$childContainer, $$tr, $$tds;
	var $$container = $$.byid(config.id);
	var $$table = $$.query($$container, [{tagName: "TABLE"}]);
	if($$table) {
		$$table.style.width = "100%";
	}
	if(style && (style.fillHeight || style.fillWidth)) {
		if(!$$container) {
			return;
		}
		if(!bc.pageParent) {
			var parent = bf.getParent(), childName, before = bf;
			var fixedParentFound = false;
			while(parent) {
				var pconfig = parent.getConfig();
				if(pconfig.layoutConfig && pconfig.layoutConfig.pageLayout == "fixed") {
					childName = before.getMemberName();
					fixedParentFound = true;
					break;
				}
				before = parent;
				parent = parent.getParent();
			}
			if(fixedParentFound) {
				bc.pageParent = parent;
				bc.pageChildName = childName;
			}
		}
		if(bc.pageParent) {
			$$childContainer = bc.pageParent.bcRef.getChildContainer(bc.pageChildName);
			if($$childContainer) {
				$$tr = $$.query($$container, [{tagName: "TABLE"}, {tagName: "TR"}]);
				$$tds = $$.childs($$tr);
			}
		}
	}
	if(style && style.fillHeight) {
		if(bc.pageParent && $$childContainer) {
			var height = $$.innerHeight($$childContainer) + "px";
			for(var i = 0; i < $$tds.length; i++) {
				$$tds[i].style.height = height;
			}
		}
	}
	if(bc.balancedMember && style && style.fillWidth) {
		if(this.pageParent && $$childContainer && $$tr && $$tds) {
			var width = $$.innerWidth($$childContainer);
			var widthTotal = 0, $$balancedTd;
			for(var i = 0; i < $$tds.length; i++) {
				$$tds[i].style.height = height;
				if($$tds[i].getAttribute("rel") != this.balancedMember) {
					widthTotal += $$.outerWidth($$tds[i]);
				} else {
					$$balancedTd = $$tds[i];
				}
			}
			if($$balancedTd) {
				$$balancedTd.style.overflowX = "auto";
				$$balancedTd.style.width = (width - widthTotal) + "px";
				$$balancedTd.style.maxWidth = (width - widthTotal) + "px";
			}
		}
	}
	if(bc.resized){
		this.makeResizable(this.config.includeLastColumn);
	}
};

BC.prototype.getFixedWidth = function () {
	var bc=this,config=bc.config;
	if(!bc.balancedMember || !config.style || !config.style.fillWidth) {
		return;
	}
	var $$container = $$.byid(this.config.id);
	var $$table = $$.query($$container, [{tagName: "TABLE"}]), $$tr=$$.child($$table, "TR");
	var $$balTD = $$.getChildHasAttr($$tr, "rel", this.balancedMember);
	if(!$$balTD) {
		return;
	}
	return $$.innerWidth($$balTD);
};

BC.prototype.render = function ($container) {
	var bf = this.bf, bc = this, config = bc.config;
	var $$horContainer = $$.create("div", {"id": config.id}, ["csc-balanced-hor-container", "csc-bordered-box", config.cssClass]);
	var $$horTable = $$.create("table", undefined, "csc-balanced-hor-table", {"width": "100%"});
	var $$horRow = $$.create("tr", null, "csc-balanced-row");

	// set styles of container
	$$horContainer.style.display = (config.visible ? "" : "none");
	if(config.style && config.style.margin !== undefined) {
		$$horContainer.style.margin = config.style.margin;
	}
	if(inDesigner(bf)) {
		$$horContainer.style.display = "";
	}
	if(sideDebugLevel() > 1) {
		$$horContainer.setAttribute("rel-def", bf.getBusinessName());
	}
	if(config.style && config.style.width) {
		$$horContainer.style.width = config.style.width;
	}
	$$.css($$horTable, config.style || {});
	if(config.style && config.style.height) {
		// $horTable.css({width: "100%"/*,height: ""*/});
		$$.css($$horTable, {
			width: "100%"/* ,height: "" */
		});
		$$.css($$horContainer, {
			"height": config.style.height,
			"width": $$horContainer.style.width || "100%",
		});
	}

	var titleType = config.titleType || "none";
	if(titleType == "window") {
		var $$titleDiv = $$.create("div", {width: "100%"}, "csc-form-title");
		var $$titleSpan = $$.create("span");
		$$titleSpan.innerHTML = config.title || "";
		$$.addClass($$titleSpan, config.titleIcon);
		$$.addClass($$titleDiv, config.titleClass);
		$$titleDiv.appendChild($$titleSpan);
		if(config.collapsible === true) {
			var $$collapseBtn = $$.create("ins", null, "collapse");
			$$collapseBtn.onclick = function () {
				if(bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$titleDiv.appendChild($$collapseBtn);
			if(this.config.collapsePos === "left") {
				$$.addClass($$titleDiv, "csc-form-title-collapse-left");
			}
		}
		if(config.showCloseIcon) {
			var $$closeBtn = $$.create("ins", null, "close");
			$$closeBtn.onclick = function () {
				bc.bf.fire("closeIconSelected");
			};
			$$titleDiv.appendChild($$closeBtn);
		}
		$$horContainer.appendChild($$titleDiv);
		$$.addClass($$horTable, "csc-bordered-container");
		$$horContainer.appendChild($$horTable);
	} else if(titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("fieldset", null, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset" : null]);
		var $$legend = $$.create("legend");
		if(config.collapsible === true && config.showTitle !== false) {
			$$.addClass($$legend, "collapse");
			$$legend.onclick = function () {
				if(bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			var $$span = $$.create("span");
			$$span.innerHTML = config.title || "&nbsp;";
			$$legend.appendChild($$span);
			$$fieldSet.appendChild($$legend);
		} else if(config.title && config.showTitle !== false) {
			var $$span = $$.create("span");
			$$span.innerHTML = config.title || ";";
			$$legend.appendChild($$span);
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
		if(config.bottomBorder === false) {
			$$.addClass($$fieldSet, "no-bottom-border");
		}
		$$fieldSet.appendChild($$horTable);
		$$horContainer.appendChild($$fieldSet);
	} else if(titleType === undefined || titleType == "none") {
		$$.addClass($$horContainer, "csc-bordered-box");
		$$horContainer.appendChild($$horTable);
	}

	$$horTable.appendChild($$horRow);
	$container.appendChild($$horContainer);

	var tds = {};
	var itemCount = 0;
	for(var memberName in bf.members) {
		var member = bf.members[memberName];
		if(member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if(!inDesigner(bf) && !member.hasVisibleItem()) {
			continue;
		}
		itemCount++;
		var $$td = $$.create("td", {
			rel: memberName
		}, "csc-balanced-cell", {
			verticalAlign: config.verAlign
		});
		$$horRow.appendChild($$td);
		tds[memberName] = $$td;
	}
	var nonWidthTd;
	if(config.itemsPlacement == "equal") {
		var tdWidth = Math.floor(100 / itemCount) + "%";
		for(var memberName in tds) {
			$$.css(tds[memberName], {
				"width": tdWidth
			});
		}
	} else if(config.itemsPlacement == "balanced" && config.fix && stringTrim(config.fix) != "") {
		var tdWidth = config.fix.split(",");
		var index = 0, totalWidth = 0;
		for(var memberName in tds) {
			if(tdWidth[index] && tdWidth[index] != "*") {
				if(tdWidth[index].indexOf("%") !== -1) {
					$$.css(tds[memberName], {
						"width": tdWidth[index].slice(0, tdWidth[index].length - 1) + "%"
					});
				} else {
					$$.css(tds[memberName], {
						"width": tdWidth[index] + "px"
					});
					totalWidth += tdWidth[index];
				}
			} else {
				nonWidthTd = tds[memberName];
				bc.balancedMember = memberName;
			}
			index++;
		}
		if(nonWidthTd) {
			nonWidthTd.style.width = ($$horTable.offsetWidth - totalWidth) + "px";
		}
	}
	for(var memberName in bf.members) {
		var member = bf.members[memberName];
		if(member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if(!inDesigner(bf) && !member.hasVisibleItem()) {
			continue;
		}

		var memberConfig = member.getConfig();
		var $$labelDiv = undefined;
		var labelPos = memberConfig.labelPosition === "inherited" ? config.labelPosition : (memberConfig.labelPosition || config.labelPosition);
		if(memberConfig.label) {
			$$labelDiv = $$.create("div", null, ["csc-form-label", memberConfig.label_class], {
				verticalAlign: config.verAlign
			});
			var label = memberConfig.label;
			if(labelPos != "right") {
				label = label + ":";
			}
			$$labelDiv.innerHTML = "<label for='"+memberConfig.id+"'>"+label+"</label>";
		}
		var $$elementDiv = null;
		var $$td = tds[memberName];
		if(this.config.style && this.config.style.padding !== undefined) {
			$$td.style.padding = this.config.style.padding;
		}
		if(labelPos == "top") {
			if($$labelDiv) {
				$$.addClass($$labelDiv, "csc-top-align-label");
				$$td.appendChild($$labelDiv);
			}
		} else if(labelPos == "left") {
			if($$labelDiv) {
				$$elementDiv = $$.create("div");
				var $$table = $$.create("table", null, null, {
					width: "100%"
				});
				var $$tr = $$.create("tr");
				var $$innerTd = $$.create("td");
				$$labelDiv.style.textAlign = "right";
				$$innerTd.appendChild($$labelDiv);
				$$tr.appendChild($$innerTd);
				$$innerTd = $$.create("td");
				$$innerTd.appendChild($$elementDiv);
				$$tr.appendChild($$innerTd);
				$$table.appendChild($$tr);
				$$td.appendChild($$table);
			}
		} else if(labelPos == "right") {
			if($$labelDiv) {
				$$elementDiv = $$.create("div");
				var $$table = $$.create("table", null, null, {
					width: "100%"
				});
				var $$tr = $$.create("tr");
				var $$innerTd = $$.create("td");
				$$elementDiv.style.textAlign = "right";
				$$innerTd.appendChild($$elementDiv);
				$$tr.appendChild($$innerTd);
				$$innerTd = $$.create("td");
				$$labelDiv.style.textAlign = "left";
				$$innerTd.appendChild($$labelDiv);
				$$tr.appendChild($$innerTd);
				$$table.appendChild($$tr);
				$$td.appendChild($$table);
			}
		}

		if($$elementDiv && member.isRequired() && (!bf.isDisabled() && !member.isDisabled())) {
			$$.addClass($$elementDiv, "csc-required");
		}

		BFEngine.render(member, $$elementDiv || $$td);
	}

	if(config.itemsPlacement != "equal") {
		BFEngine.DRL(bf);
	}

	if(nonWidthTd) {
		nonWidthTd.style.width = "";
	}

	if(config.collapsible === true) {
		if(bc.collapsed) {
			bc.collapse();
		} else {
			bc.expand();
		}
	}
	if (config.defaultCollapseStatus) {
		bc.collapse();
	}
	bc.applyAddedClasses();// Apply css classes added by user

	if(config.maskIt) {
		bc.mask();
	}
};

BC.prototype.load = function () {
	if(this.onloadcallback) {
		this.onloadcallback();
	}
};

/**
 * @description Collapses the container
 * @function collapse
 */
BC.prototype.collapse = function () {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$fieldset = $$.child($$container, "fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "expand", "collapse");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "expanded", "collapsed");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-balanced-hor-table"), "display", "none");//-----> içeriği kapat
		$$.css($$fieldset, "height", 0);
	} else if(this.config.titleType == "window") {
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "expand", "collapse");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-balanced-hor-table"), "display", "none");//----> içeriği kapat
	}

	this.collapsed = true;
};

/**
 * @function expand
 * @description Expands the collaped container
 */
BC.prototype.expand = function () {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$fieldset = $$.child($$container, "fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "collapse", "expand");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "collapsed", "expanded");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-balanced-hor-table"), "display", "");//-----> içeriği kapat
		if($$fieldset) {
			$$fieldset.style.height = "";
		}
	} else if(this.config.titleType == "window") {
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "collapse", "expand");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-balanced-hor-table"), "display", "");//----> içeriği kapat
	}

	this.collapsed = false;
	BFEngine.DRL(this.bf);
};

BC.prototype.getChildContainer = function (memberName) {
	if(!memberName) {
		return;
	}
	var $$container = $$.byid(this.config.id);
	if(!$$container) {
		return;
	}
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {// fieldset varsa
		var td = $$.query($$container, [
			{tagName: "fieldset"},
			{tagName: "table"},
			{tagName: "tr"},
			{tagName: "td", attr: {rel: memberName}}
		]);
	} else {// fieldset yoksa (window || none)
		var td = $$.query($$container, [
			{tagName: "table"},
			{tagName: "tr"},
			{tagName: "td", attr: {rel: memberName}}
		]);
	}
	return td;
};

/**
 * @function accordion
 * @description Expands o collapses the given member according to given width
 * @param {string} memberName - member name
 * @param {string} [width=350px] - width of member
 * @param {boolean} [openClose] - whether open or close
 * @param [duration] - animation duration
 * @param [memberNameToResizeWith]
 */
BC.prototype.accordion = function (memberName, width, openClose, duration, memberNameToResizeWith) {
	if(this.accordionWait){
		return;
	}
	this.accordionWait = true;
	function updateColumnWidths() {
		var widths = that.config.fix.split(",");
		$.each(widths, function (index, value) {
			if(parseInt(value) == value) {
				widths[index] = newColumnWidths[index];
			}
			that.config.fix = widths.toString();
		});
	}

	duration === "" ? undefined : duration;
	if(openClose !== undefined) {
		this.accordWidth = openClose ? true : undefined;
	}
	var $td = $("#" + this.config.id).find(">table>tr>td[rel='" + memberName + "']");
	if(memberNameToResizeWith !== undefined) {
		$tdToBeResizedWith = $("#" + this.config.id).find(">table>tr>td[rel='" + memberNameToResizeWith + "']");
		var tdToBeResizedWithWidth = $tdToBeResizedWith.css("width");
	}
	var bc=this, bf = this.bf;
	var member = bf[memberName];
	if(!width) {
		var memberStyle = member.bcRef.config.style;
		if(memberStyle && memberStyle.width) {
			width = memberStyle.width;
		} else {
			width = "350px";
		}
	}
	if(width == "auto") {
		var width = $td[0].style.width;
	}

	if(this.accordWidth === undefined) {
		this.accordWidth = $td.css("width");

		$td.animate({
			width: "toggle"
		}, {duration: duration === undefined ? 500 : duration, queue: false, done: function () {
				bc.accordionWait = false;
				for(var memName in bf.members) {
					if(memberName !== memName) {
						BFEngine.DRL(bf.members[memName]);
					}

				}
			}});
		if(memberNameToResizeWith !== undefined) {
			tdToBeResizedWithWidth = window.parseInt(tdToBeResizedWithWidth) + window.parseInt(width) + "px";
			$tdToBeResizedWith.animate({
				width: tdToBeResizedWithWidth

			}, {duration: duration === undefined ? 500 : duration, queue: false});
		}
		$td.css({
			overflow: "hidden"
		});
		if(member.accordion && typeof member.accordion == "function") {
			member.accordion("-=" + width);
		}
	} else {


		$td.animate({
			width: "toggle"
		}, {duration: duration === undefined ? 500 : duration, queue: false, done: function () {
				bc.accordionWait = false;
				for(var memName in bf.members) {
					if(memberName !== memName) {
						BFEngine.DRL(bf.members[memName]);
					}
				}
			}});
		if(memberNameToResizeWith !== undefined) {
			var that = this;
			var newColumnWidths = [];
			tdToBeResizedWithWidth = window.parseInt(tdToBeResizedWithWidth) - window.parseInt(width) + "px";
			$tdToBeResizedWith.animate({
					width: tdToBeResizedWithWidth
				}, {
					duration: duration === undefined ? 500 : duration,
					queue: false,
					complete: function () {
						$("#" + that.config.id).find(">table>tr>td").each(function (index) {
							newColumnWidths.push(parseInt(this.style.width).toString());
						});
						updateColumnWidths();
					}
				}
			);
		}
		$td.css({
			overflow: ""
		});
		if(member.accordion && typeof member.accordion == "function") {
			member.accordion("+=" + width);
			delete this.accordWidth;
		}
	}
};

/**
 * @function mask
 * @description Masks the container with given message.
 * @param {string} [message] message
 */
BC.prototype.mask = function (message) {
	var id = this.config.id;
	this.config.maskMessage = message || this.config.maskMessage;
	this.config.maskIt = true;

	var $$gen = $$.byid(id);
	if(!$$gen) {
		return;
	}

	var $$maskDiv = $$.create("DIV", {"id": id + "-mask"}, "maskDiv", {
		"width": $$.innerWidth($$gen) + "px",
		"height": $$.innerHeight($$gen) + "px"
	});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = message;

	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);

	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);

	$$.css($$loadingDiv, {
		"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2 + "px",
		"margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2 + "px"
	});
};

/**
 * @function unmask
 * @description Unmasks the masked container
 */
BC.prototype.unmask = function () {
	$$dom = $$.byid(this.config.id + "-mask");
	$$.remove($$dom);
	this.config.maskIt = undefined;
};

/**
 * Sets a title to container
 * @param {string} title title
 */
BC.prototype.setTitle = function (title) {
	this.config.title = title;
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "window") {
		var $$spanTitle = $$.query($$container, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "span"}]);
		if($$spanTitle) {
			$$spanTitle.innerHTML = title;
		}
	} else if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$spanTitle = $$.query($$container, [{tagName: "fieldset"}, {tagName: "legend"}, {tagName: "span"}]);
		if($$spanTitle) {
			$$spanTitle.innerHTML = title;
		}
	}
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "selected") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	} else if(eventName == "oncontextmenu") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.oncontextmenu = callback;
		}
	} else if(eventName == "drop") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
		}
	} else if(eventName == "dragover") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	} else if(eventName == "onload") {
		this.onloadcallback = callback;
	} else if(eventName == "onEnterPressed") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onkeypress = function (e) {
				if(e.keyCode == 13) {
					callback();
				}
			};
		}
	}
};

/**
 * Panel sütunları'nı resizable yapar.
 **/
BC.prototype.makeResizable = function (includeLastColumn) {
	var bc=this, config=bc.config, id=config.id;
	config.includeLastColumn = includeLastColumn;
	bc.resized=true;
	window.setTimeout(function () {
		var $ = window.$;
		var targetElem = $("#" + id);

		var columnHeaders = targetElem.find("tr:first-child > td");
		window.pressed = false;
		window.start = undefined;
		//window.startX, window.startWidth;
		var columnHeadersLen;
		if(includeLastColumn) {
			columnHeadersLen = columnHeaders.length;
		} else {
			columnHeadersLen = columnHeaders.length - 1;
			targetElem.addClass("last-column-not-resizable");
		}
		for(var k = 0; k < columnHeadersLen; k++) {
			var currElem = columnHeaders[k].getAttribute("rel");
			//if(window.isInIt(columns,currElem)) { // =="methodsEventsList") {
			$(columnHeaders[k]).mousedown(function (e) {
				var currElem = $(this).attr("rel");
				var isBusinessTreeOpen = "";
				if((e.clientX > ($(this).offset().left + $(this).innerWidth() - 6) && e.clientX < ($(this).offset().left + $(this).innerWidth() + 6)) && $(this).is(':last-child') !== true) {
					$(this).closest("table").addClass("resizing");
					window.start = $(this);
					window.startNextColumn = $(this).next();
					window.initialNextColumnWidth = $(this).next().width();
					window.pressed = true;
					window.startX = e.pageX;
					window.startWidth = $(this).width();
				}
			});
		}

		columnHeaders.mousemove(function (e) {
			if(window.pressed) {
				var selectedElem = $(window.start);
				var widthDiff = e.pageX - window.startX;

				var columnWidth = window.startWidth + widthDiff;
				var nextColumnWidth = window.initialNextColumnWidth - widthDiff;
				selectedElem.width(columnWidth);
				selectedElem.next().width(nextColumnWidth);
			}
		});

		columnHeaders.dblclick(function (e) {
			if((e.clientX > ($(this).offset().left + $(this).innerWidth() - 6) && e.clientX < ($(this).offset().left + $(this).innerWidth() + 6)) && $(this).is(':last-child') !== true) {
				var elem = $("div.methodsEventsList")[0];
				if((elem.style.width == "inherit") || (elem.style.width == "")) {
					elem.style.width = "auto";
				} else {
					elem.style.width = "inherit";
				}
			}
		});

		columnHeaders.mouseup(function () {
			$(this).closest("table").removeClass("resizing");
			if(window.pressed) {
				window.pressed = false;
			}
		});
	}, 200);
};




})(window);
/****************************=csc-basic-form.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-BASIC-FORM-LAYOUT
 */
function Definition(CS) {
	this.DEFAULTS = {
		twodots: true,
		forceColWidth: true,
		showCloseIcon:false,
		collapsePos:"right",
		wideContainer:false,
		style: {
			inputAlign: "left"
		}
	};

	this.BaseBF = "DYN-CONTAINER";
	this.METHODS = [ "collapse", "expand", "mask", "unmask", "setColumnWidths(widths)", "setColumnCount(count)", "close" ];
	this.EVENTS = [ "selected", "oncontextmenu", "onEnterPressed", "onload", "oninit(param)", "closeIconSelected" , "onexpand(expanded)", "ondrop", "ondragstart(member)" ];

	this.Type = function() {
	};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-BASIC-FORM", def);

var BC = def.Type;

BC.prototype.renderRequiredMember = function(member, flag) {
	if(member){
		var labelid = member.getConfig().id+"-lbl";
		var $$dom = $$.byid(labelid);
		if($$dom){
			var $$tdLeft = $$dom.parentNode;
		if(flag){
			$$.addClass($$tdLeft, "required");
		}else{
			$$.rmClass($$tdLeft, "required");
		}
	}
	}
};

BC.prototype.render = function($container) {
	var bc = this, bf = bc.bf, config=bc.config;
	var colWidth = config.colWidth;// "30,50-40,60" şeklinde

	var scrolledParent = $$.findScrolledParent($$.byid(config.id));
	var scrollTop = scrolledParent ? scrolledParent.scrollTop : 0;
	
	// create form container and set attributes and styles
	var $$formContainer = $$.create("DIV",{id: config.id}, ["csc-form-container", config.cssClass], config.style);
	var $$formTable = $$.create("TABLE", null, "csc-form-table");
	if(config.style && config.style.width){
		$$formTable.style.width = "100%";
	}
	if(config.applyAllColWidths){
		$$formTable.style.width = "auto";
	}

	if (inDesigner(this.bf)) {
		$$formContainer.style.display = "";
	} else {
		$$formContainer.style.display = this.config.visible ? "" : "none";
	}
    if(sideDebugLevel() > 1){
        $$formContainer.setAttribute("rel-def",bf.getBusinessName());
    }

	var titleType = config.titleType || "none";
	if (titleType == "window") {
		var $$titleDiv = $$.create("DIV", null, "csc-form-title");
		var $$titleSpan = $$.create("SPAN", null, [config.titleIcon, config.titleClass]);
		$$titleSpan.innerHTML = config.title || "";
		$$titleDiv.appendChild($$titleSpan);
		
		if (config.collapsible === true) {
			var $$collapseBtn = $$.create("INS", null, "collapse");
			$$collapseBtn.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$titleDiv.appendChild($$collapseBtn);
			if(config.collapsePos === "left"){
				$$.addClass($$titleDiv, "csc-form-title-collapse-left"); 
			}
		}
		if(config.showCloseIcon){
			var $$closeBtn = $$.create("ins", null, "close");
			$$closeBtn.onclick = function() {
				bc.bf.fire("closeIconSelected");
			};
			$$titleDiv.appendChild($$closeBtn);
		}
		$$formContainer.appendChild($$titleDiv);
		$$.addClass($$formTable, "csc-bordered-container");
		$$formContainer.appendChild($$formTable);
	} else if (titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("FIELDSET", null, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset":null]);
		var $$legend = $$.create("LEGEND");
		if (config.collapsible === true && config.showTitle !== false) {
			$$.addClass($$legend, "collapse");

			$$legend.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$legend.innerHTML = "<span>"+ (config.title || "&nbsp;") + "<span>";
			$$fieldSet.appendChild($$legend);
		} else if (config.title && config.showTitle !== false) {
			$$legend.innerHTML = "<span>"+ this.config.title + "<span>";
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
		if(config.bottomBorder === false){
				$$.addClass($$fieldSet, "no-bottom-border");
		}
		$$fieldSet.appendChild($$formTable);
		$$formContainer.appendChild($$fieldSet);
	} else if (titleType === undefined || titleType == "none") {
		$$.addClass($$formContainer, "csc-bordered-box");
		$$formContainer.appendChild($$formTable);
	}

	$container.appendChild($$formContainer);

	var colNumber = 1;// default column number of form is 1
	if (config.colNumber && config.colNumber > 0) {
		colNumber = config.colNumber;
	}
	var counter = 0, $$formRow = null, colWidthArray = [];
	if (colWidth) {
		colWidthArray = colWidth.split("-");
		if(config.forceColWidth){
			var fullColWidths = colWidth.split(/-|,/),minWidth=0;
			for(var i=0; i<fullColWidths.length ;i++){
				minWidth += parseInt(fullColWidths[i]);
			}
			if(colWidth.indexOf("-")<0 && config.colNumber > 1){
				minWidth = minWidth*config.colNumber;
			}
			$$formContainer.style.minWidth = minWidth+"px";
		}
	} else {
		colWidthArray = [ (30 / colNumber) + "," + (70 / colNumber) ];
	}

	var isWideR = config.wideContainer || false;
	
	for ( var memberName in bf.members) {
		var colWidthArrayWithComma = [];
		if (colWidthArray.length > 0) {
			colWidthArrayWithComma = colNumber == colWidthArray.length ? colWidthArray[counter % colNumber].split(",") : colWidthArray[0].split(",");
		}

		var member = bf.members[memberName];
		if (member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if (!inDesigner(bf) && (!member.isVisible() || !member.hasVisibleItem())) {
			continue;
		}
		
		var config = member.getConfig();

		var wRCond = (isWideR && (member.isTabular() || member.isContainer()));
		
		if ((counter % colNumber) === 0 || wRCond) {
			$$formRow = $$.create("TR", null, "csc-form-row");
			$$formTable.appendChild($$formRow);// append formRow to Form Container
		}

		if(!wRCond){
			// Create a Row's left(label) cell and set its class
			var $$tdLeft = $$.create("TD", null, "csc-form-row-left");
			$$formRow.appendChild($$tdLeft);// append left cell to Main Row

			var memConfig = member.getConfig();
			if (memConfig.label && (inDesigner(bf) || member.hasVisibleItem())) {
				var labelid = member.bcRef.getLabelId ? member.bcRef.getLabelId() : memConfig.id;
				var $$label = $$.create("LABEL", {id: memConfig.id + "-lbl"}, ["csc-form-label", memConfig.label_class]);
				var twoDots=config.twodots && memConfig.label ? ":" : "";
				$$label.innerHTML = memConfig.label + twoDots;
				if(memConfig.labelClick!==false){
					$$label.setAttribute("for",labelid);
				}
				if(memConfig.tips){
					$$label.title = memConfig.tips;
				}
				if(member.isRequired()) {
					$$.addClass($$tdLeft, "required");
				}
				$$tdLeft.appendChild($$label);// -------------------------> Append span to row's left cell
				$$label = null;
			}
		}

		// create row's right (component) cell and set its class
		var $$tdRight = $$.create("TD", {rel: memberName}, "csc-form-row-right");
		if (bc.config.style && bc.config.style.inputAlign) {
			$$tdRight.setAttribute("style", "text-align:" + bc.config.style.inputAlign);
		}
		
		if(wRCond){
			$$.attr($$tdRight, "colspan", colNumber*2);
			counter = counter - counter%(colNumber*2)-1;
		}else{
			if (colWidthArrayWithComma.length > 1) {
				var colwidth = colWidthArrayWithComma[0];
				if (colwidth.indexOf("px") < 0) {
					colwidth = colwidth + "%";
				}
				$$tdLeft.style.width = colwidth;

				if(bc.config.applyAllColWidths || (counter+1) % colNumber != 0) {//En sağdaki td'ye width verme çünkü browser'ın orantılamasına sebep oluyor
					var colwidth = colWidthArrayWithComma[1];
					if(colwidth.indexOf("px") < 0) {
						colwidth = colwidth + "%";
					}
					$$tdRight.style.width = colwidth;
				}
			}
		}
		$$formRow.appendChild($$tdRight);

		if(config.draggable){
			var dragstartCallback = function(member){
				return function(event){
					var memName = member.$CS$.name;
					console.log("form layout on drag start, member name:" + memName);
					event.stopPropagation();
					bc.bf.fire("ondragstart", memName);	
				};
			}(member);
			$$tdRight.setAttribute("draggable", "true");
			$$.bindEvent($$tdRight, "dragstart", dragstartCallback);
		}
		
		// append the bf member to right row container
		BFEngine.render(member, $$tdRight);
		if (member.bcRef && bf.inlineValidationAvailable()) {
			var $$valImg = $$.create("IMG", {id : config.id + "-val", src : "css/bc-style/img/val_error.gif"}, "val-img");
			if (member.bcRef.renderInlineVal) {
				member.bcRef.renderInlineVal($$valImg);
			} else {
				$$tdRight.appendChild($$valImg);
			}
		}
		counter++;
	}
	// Add remaining cells if exists
	if (counter % colNumber > 0) {
		for ( var remainingCell = (colNumber - (counter % colNumber)); remainingCell > 0; remainingCell--) {
			$$formRow.appendChild($$.create("TD", null, "csc-form-row-left"));
			$$formRow.appendChild($$.create("TD", null, "csc-form-row-right"));
		}
	}

	if (config.collapsible === true) {
		if (bc.collapsed) {
			bc.collapse();
		} else {
			bc.expand();
		}
	}
	bc.applyAddedClasses();// Apply css classes added by user
	
	if(scrolledParent){
		scrolledParent.scrollTop = scrollTop;
	}
	
	if(config.maskIt){
		bc.mask();
	}
	if (this.config.defaultCollapseStatus) {
		bc.collapse();
	}
};

/**
 * @function setColumnWidths
 * @description sets the column widths of members
 * @param {string} [widths] widths of members format: labelwidth,memberwidth-labelwidth,memberwidth Ex: 120px,200px
 */
BC.prototype.setColumnWidths = function(widths) {
	this.config.colWidth = widths;
	BFEngine.renderRequest(this.bf);
};

/**
 * @function setColumnCount
 * @description Sets th column count of form
 * @param {number} [count] Column count
 */
BC.prototype.setColumnCount = function(count) {
	this.config.colNumber = count;
	BFEngine.renderRequest(this.bf);
};

/**
 * @function mask
 * @description Masks the container with given message.
 * @param {string} [message] message
 */
BC.prototype.mask = function(message) {
	var id = this.config.id;

	var $$gen = $$.byid(id);
	if(!$$gen){
		this.config.maskIt = true;
		return;
	}
	var $$maskDiv = $$.create("DIV",{"id": id + "-mask"}, "maskDiv", {"width": $$.innerWidth($$gen)+"px", "height": $$.innerHeight($$gen)+"px"});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = message;
	
	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);
	
	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);
	
	$$.css($$loadingDiv, {"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2+"px", "margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2+"px"});
};

/**
 * @function unmask
 * @description Unmasks the masked container
 */
BC.prototype.unmask = function() {
	$$dom = $$.byid(this.config.id+"-mask");
	$$.remove($$dom);
	this.config.maskIt = undefined;
};

/**
 * @description Collapses the container
 * @function collapse
 */
BC.prototype.collapse = function() {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "expand", "collapse");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "expanded", "collapsed");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-form-table"), "display", "none");//-----> içeriği kapat
		$$.css($$fieldset, "height", 9);
	} else if(this.config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "expand", "collapse");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-form-table"), "display", "none");//----> içeriği kapat
	}
	this.collapsed = true;
	this.bf.fire("onexpand", false);
};

/**
 * @function expand
 * @description Expands the collaped container
 */
BC.prototype.expand = function() {
	var bc=this, config=bc.config, $$container = $$.byid(config.id);
	if(config.titleType == "fieldset" || config.titleType == "bfieldset"){
		var $$fieldset = $$.child($$container,"fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "collapse", "expand");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "collapsed", "expanded");
		$$.css($$.getChildHasClass($$fieldset, "csc-form-table"), "display", "");//-----> içeriği kapat
		if($$fieldset){
			$$fieldset.style.height = "";
		}
	} else if(config.titleType == "window"){
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "collapse", "expand");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-form-table"), "display", "");//----> içeriği kapat
	}
	
	bc.collapsed = false;
	bc.bf.fire("onexpand", true);
	
	BFEngine.DRL(bc.bf);
};

BC.prototype.beforeDRL = function(mname) {
	var $$container = $$.byid(this.config.id);
	if(!$$container){
		return;
	}
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset"){
		$$container = $$.child($$container,"fieldset");
	}
	if(!this.config.applyAllColWidths){
		var $$table = $$.child($$container,"table");
		$$table.style.width = "100%";
	}
};
BC.prototype.DRL = function(mname) {
	var $$container = $$.byid(this.config.id);
	if(!$$container) {
		return;
	}

	if(this.config.titleType === "fieldset" || this.config.titleType === "bfieldset") {
		$$container = $$.child($$container, "fieldset");
	}

	if(!this.config.applyAllColWidths) {
		var $$table = $$.child($$container, "table");
		$$table.style.width = "";
	}
};

BC.prototype.getChildContainer = function(mname) {
	var $$container = $$.byid(this.config.id);
	if(!$$container){
		return;
	}
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset"){
		$$container = $$.child($$container,"fieldset");
	}
	var $$table = $$.child($$container,"table");
	var $$tbody = $$.child($$table, "tbody");
	if(!$$tbody){
		$$tbody = $$table;
	}
	var $$trs = $$.childs($$tbody, "TR");
	for(var i=0; i<$$trs.length ;i++){
		var $$tds = $$.childs($$trs[i],"TD");
		for(var k=0; k<$$tds.length ;k++){
			if($$tds[k].getAttribute("rel") == mname){
				return $$tds[k];
			}
		}
	}
};

/**
 * Sets a title to container
 * @param {string} title title
 */
BC.prototype.setTitle = function(title){
	this.config.title = title;
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "window") {
		var $$spanTitle = $$.query($$container, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	} else if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$spanTitle = $$.query($$container, [{tagName: "fieldset"}, {tagName: "legend"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	}
};

BC.prototype.load = function() {
	if (this.onloadcallback) {
		this.onloadcallback();
	}
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	}else if (eventName == "oncontextmenu") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.oncontextmenu = callback;
		}
	} else if (eventName == "drop" || eventName == "ondrop") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
			$$.bindEvent(dom, "dragover", function (ev){ev.preventDefault();});//drop olayının çalışması için
		}
	} else if (eventName == "dragover") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	} else if (eventName == "onload") {
		this.onloadcallback = callback;
	} else if (eventName == "onEnterPressed") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onkeypress = function(e) {
				if (e.keyCode == 13) {
					callback();
				}
			};
		}
	}
};



})(window);
/****************************=csc-horizontal.js=******************************/
(function(window, undefined) {
/** @class CSC-HORIZONTAL LAYOUT */
function Definition(CS) {
	this.DEFAULTS = {};

	this.BaseBF = "DYN-CONTAINER";
	this.METHODS = ["mask", "unmask", "collapse", "expand", "isCollapsed()", "close"];
	this.EVENTS = ["onload", "selected", "oncontextmenu", "onEnterPressed", "oninit(param)", "closeIconSelected"];

	this.Type = function () {
	};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-HORIZONTAL", def);

var BC = def.Type;

BC.prototype.init = function () {
	var bc = this, bf = bc.bf, config = bc.config;
	if(config.conWidth) {
		config.labelPosition = "none";
		bc.conWidths = {};
		var widths = config.conWidth.split(","), i = 0;
		for(var mname in bf.members) {
			bc.conWidths[mname] = widths[i];
			i++;
		}
	}
};

BC.prototype.getLabelId = function () {
	var bc = this, bf = bc.bf;
	for(var mname in bf.members) {
		var ref = bf.members[mname].bcRef;
		var memConfig = ref.config;
		if(memConfig.layoutConfig && memConfig.layoutConfig.plabel) {
			bc.plabelid = ref.getLabelId ? ref.getLabelId() : memConfig.id;
			break;
		}
	}
	return bc.plabelid || bc.config.id;
};

BC.prototype.getChildContainer = function (memberName) {
	var $$container = $$.byid(this.config.id);
	if(!$$container) {
		return;
	}
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$fieldset = $$.child($$container, "fieldset");
		var $$vertContainer = $$.getChildHasClass($$fieldset, "csc-hor-items-container");
		return $$.getChildHasAttr($$vertContainer, "rel", memberName);
	} else {
		var $$vertContainer = $$.getChildHasClass($$container, "csc-hor-items-container");
		return $$.getChildHasAttr($$vertContainer, "rel", memberName);
	}
};

BC.prototype.renderMember = function (member, $$formItemsContainer) {
	if(member.bcRef.typeName == "CSC-POPUP") {
		return;
	}
	var bc = this, bf = bc.bf;
	var $$after = null, $$into = null;
	if(!$$formItemsContainer) {
		var previusMember = null;
		$$formItemsContainer = $$.getChildHasClass(this.config.id, "csc-hor-items-container");

		if(!$$formItemsContainer) {
			var $$filedset = $$.getChildHasClass(this.config.id, "csc-form-fieldset");
			$$formItemsContainer = $$.getChildHasClass($$filedset, "csc-hor-items-container");
		}
		for(var memName in this.bf.members) {
			var mem = this.bf.members[memName];
			if(mem == member) {
				break;
			}
			var ref = mem.bcRef;
			if(ref.isRendered()) {
				previusMember = this.bf.members[memName];
			}
		}
		if(previusMember) {
			$$after = $$.query($$formItemsContainer, [{
				tagName: "DIV",
				clazz: "csc-hor-block",
				attr: {rel: previusMember.$CS$.name}
			}])
		} else {
			$$into = $$formItemsContainer;
		}
	}

	var memName = member.$CS$.name;
	var renderedDiv = $$.query($$formItemsContainer, [{tagName: "DIV", clazz: "csc-hor-block", attr: {rel: memName}}])
	if(renderedDiv) {
		$$.remove(renderedDiv);
	}
	if(!inDesigner(this.bf) && !member.hasVisibleItem()) {
		return;
	}

	var memberConfig = member.getConfig();
	var labelPos = memberConfig.labelPosition === "inherited" ? this.config.labelPosition : (memberConfig.labelPosition || this.config.labelPosition);
	var alignClass = null;

	if(labelPos == "top") {
		alignClass = "csc-top-align";
	} else if(labelPos == "left") {
		alignClass = "csc-left-align";
	} else if(labelPos == "right") {
		alignClass = "csc-right-align";
	}

	var $$horBlock = $$.create("DIV", {"rel": memName}, "csc-hor-block");
	if(bc.conWidths && bc.conWidths[memName]) {
		$$horBlock.style.width = bc.conWidths[memName];
	}
	if(memberConfig.layoutConfig && memberConfig.layoutConfig.newLine) {
		$$.addClass($$horBlock, "csc-hor-block-newline");
	}

	if(memberConfig.label) {
		if(alignClass != null) {
			var $$labelDiv = $$.create("DIV", undefined, ["csc-form-label " + alignClass + "-label", memberConfig.label_class]);
			if(memberConfig.label) {
				var label = memberConfig.label;
				if(labelPos == "left") {
					label = label + ":";
				}
				if(memberConfig.labelClick){
					$$labelDiv.innerHTML = "<label for='"+memberConfig.id+"'>"+ label +"</label>";
				}else{
					$$labelDiv.innerHTML = "<label>"+ label +"</label>";
				}
			}
			if($$horBlock.childNodes[0]) {
				$$horBlock.insertBefore($$labelDiv, $$horBlock.childNodes[0]);
			} else {
				$$horBlock.appendChild($$labelDiv);
			}
		} else {
			alignClass = "csc-left-align";
		}
	}

	var $$elementDiv = $$.create("DIV", undefined);
	if(!bc.conWidths) {
		$$.addClass($$elementDiv, alignClass + "-element");
	}
	if(member.isRequired() && (!this.bf.isDisabled() && !member.isDisabled())) {
		$$.addClass($$elementDiv, "csc-required");
	}

	$$horBlock.appendChild($$elementDiv);

	if($$after) {
		var $$parent = $$after.parentNode;
		if($$after.nextSibling) {
			$$parent.insertBefore($$horBlock, $$after.nextSibling);
		} else {
			$$parent.appendChild($$horBlock);
		}
	} else if($$into && $$into.childNodes.length) {
		$$into.insertBefore($$horBlock, $$into.childNodes[0]);
	} else {
		$$formItemsContainer.appendChild($$horBlock);
	}

	BFEngine.render(member, $$elementDiv);

	var $$dom = $$.byid(this.config.id);
	if($$dom) {
		var style = window.getComputedStyle($$dom);
		if(style.getPropertyValue("position") == "fixed") {
			$$dom.style.position = "absolute";
			window.setTimeout(function () {
				$$dom.style.position = "";
			}, 100);
		}
	}
};

BC.prototype.render = function ($container) {
	var bf = this.bf;
	var bc = this;
	var config = bc.config;

	var displayProp = this.config.visible ? "" : "none";
	var $$horContainer = $$.create("DIV", {"id": this.config.id}, [this.config.cssClass, "csc-hor-container"], {
		"width": "100%",
		"display": displayProp
	});

	if(this.config.style && this.config.style.width) {
		$$.css($$horContainer, "width", this.config.style.width);
	}

	if(this.config.style && this.config.style.height) {
		$$.css($$horContainer, "height", this.config.style.height);
	}

	var $$formItemsContainer = $$.create("DIV", {"rel": this.config.id}, [this.config.cssClass+"-container", "csc-hor-items-container"], this.config.style || {});
	if(config.panelType) {
		$$.addClass($$formItemsContainer, "csc-hor-container__" + config.panelType);
	}
	if(config.style && config.style.fillPanel) {
		$$.addClass($$formItemsContainer, "csc-hor-container--filled");
	}
	if(config.style && config.style.borderPanel) {
		$$.addClass($$formItemsContainer, "csc-hor-container--bordered");
	}
	if(inDesigner(this.bf)) {
		$$.css($$horContainer, "display", "");
	}
	if(sideDebugLevel() > 1) {
		$$horContainer.setAttribute("rel-def", bf.getBusinessName());
	}

	var titleType = this.config.titleType || "none";

	if(titleType == "window") {
		var $$titleDiv = $$.create("DIV", undefined, ["csc-form-title", this.config.titleClass], {"width": "100%"});
		var $$titleSpan = $$.create("SPAN", undefined, "csc-form-title", {"width": "100%"});
		$$titleSpan.innerHTML = this.config.title;
		if(this.config.titleIcon) {
			$$.addClass($$titleSpan, this.config.titleIcon);
		}

		$$titleDiv.appendChild($$titleSpan);

		if(this.config.collapsible === true) {
			var $$collapseBtn = $$.create("INS", undefined, "collapse");
			$$collapseBtn.onclick = function () {
				if(bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$titleDiv.appendChild($$collapseBtn);
			if(this.config.collapsePos === "left") {
				$$.addClass($$titleDiv, "csc-form-title-collapse-left");
			}
		}

		if(this.config.showCloseIcon) {
			var $$closeBtn = $$.create("ins", null, "close");
			$$closeBtn.onclick = function () {
				bc.bf.fire("closeIconSelected");
			};
			$$titleDiv.appendChild($$closeBtn);
		}

		$$horContainer.appendChild($$titleDiv);
		$$horContainer.appendChild($$formItemsContainer);
		$$.addClass($$formItemsContainer, "csc-bordered-container");
	} else if(titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("FIELDSET", undefined, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset" : null]);
		var $$legend = $$.create("LEGEND");
		var $$titleSpan = $$.create("SPAN");
		if(this.config.collapsible === true && this.config.showTitle !== false) {
			$$.addClass($$legend, "collapse");

			$$legend.onclick = function () {
				if(bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};

			$$titleSpan.innerHTML = this.config.title || "&nbsp;";
			$$legend.appendChild($$titleSpan);
			$$fieldSet.appendChild($$legend);
		} else if(this.config.title && this.config.showTitle !== false) {
			$$titleSpan.innerHTML = this.config.title;
			$$legend.appendChild($$titleSpan);
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
		if(this.config.bottomBorder === false) {
			$$.addClass($$fieldSet, "no-bottom-border");
		}
		$$fieldSet.appendChild($$formItemsContainer);
		$$horContainer.appendChild($$fieldSet);
	} else if(titleType === undefined || titleType == "none") {
		$$.addClass($$horContainer, "csc-bordered-box");
		$$horContainer.appendChild($$formItemsContainer);
	}
	$container.appendChild($$horContainer);

	for(var memberName in bf.members) {
		var member = bf.members[memberName];
		this.renderMember(member);
	}

	if(this.config.collapsible === true) {
		if(this.collapsed) {
			this.collapse();
		} else {
			this.expand();
		}
	}
	if (config.defaultCollapseStatus) {
		bc.collapse();
	}
	this.applyAddedClasses();// Apply css classes added by user

	if(this.config.maskIt) {
		this.mask();
	}
};

/**
 * @description Collapses the container
 * @function collapse
 */
BC.prototype.collapse = function () {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$fieldset = $$.child($$container, "fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "expand", "collapse");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "expanded", "collapsed");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-hor-items-container"), "display", "none");//-----> içeriği kapat
		$$.css($$fieldset, "height", 0);
	} else if(this.config.titleType == "window") {
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "expand", "collapse");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-hor-items-container"), "display", "none");//----> içeriği kapat
	}

	this.collapsed = true;
};

BC.prototype.isCollapsed = function () {
	return this.collapsed;
};
/**
 * @function expand
 * @description Expands the collaped container
 */
BC.prototype.expand = function () {
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$fieldset = $$.child($$container, "fieldset");
		$$.toggleClass($$.child($$fieldset, "legend"), "collapse", "expand");//-------------> legend'in class'ını değiştir
		$$.toggleClass($$fieldset, "collapsed", "expanded");//-------------> fieldset'in class'ını değiştir TODO: legend'de eklenmiş sınıf yerine fieldset'i kullan ve gerecek css değişikliğini tüm temalarda yap.
		$$.css($$.getChildHasClass($$fieldset, "csc-hor-items-container"), "display", "");//-----> içeriği kapat
		if($$fieldset) {
			$$fieldset.style.height = "";
		}
	} else if(this.config.titleType == "window") {
		var $$ins = $$.query($$container, [{tagName: "DIV", clazz: "csc-form-title"}, {tagName: "INS"}]);
		$$.toggleClass($$ins, "collapse", "expand");//--------------------------------------> legend'in class'ını değiştir
		$$.css($$.getChildHasClass($$container, "csc-hor-items-container"), "display", "");//----> içeriği kapat
	}
	this.collapsed = false;
	BFEngine.DRL(this.bf);
};

/**
 * Sets a title to container
 * @param {string} title title
 */
BC.prototype.setTitle = function (title) {
	this.config.title = title;
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "window") {
		var $$spanTitle = $$.query($$container, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "span"}]);
		if($$spanTitle) {
			$$spanTitle.innerHTML = title;
		}
	} else if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$spanTitle = $$.query($$container, [{tagName: "fieldset"}, {tagName: "legend"}, {tagName: "span"}]);
		if($$spanTitle) {
			$$spanTitle.innerHTML = title;
		}
	}
};

BC.prototype.load = function () {
	if(this.onloadcallback) {
		this.onloadcallback();
	}
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "selected") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	} else if(eventName == "oncontextmenu") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.oncontextmenu = callback;
		}
	} else if(eventName == "drop") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
		}
	} else if(eventName == "dragover") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	} else if(eventName == "onload") {
		this.onloadcallback = callback;
	} else if(eventName == "onEnterPressed") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onkeypress = function (e) {
				if(e.keyCode == 13) {
					callback();
				}
			};
		}
	}
};

/**
 * @function mask
 * @description Masks the container with given message.
 * @param {string} [message] message
 */
BC.prototype.mask = function (message) {
	var id = this.config.id;
	this.config.maskMessage = message || this.config.maskMessage;
	this.config.maskIt = true;
	var $$gen = $$.byid(id);
	if(!$$gen) {
		return;
	}

	var $$maskDiv = $$.create("DIV", {"id": id + "-mask"}, "maskDiv", {
		"width": $$.innerWidth($$gen) + "px",
		"height": $$.innerHeight($$gen) + "px"
	});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = message;

	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);

	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);

	$$.css($$loadingDiv, {
		"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2 + "px",
		"margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2 + "px"
	});
};

/**
 * @function unmask
 * @description Unmasks the masked container
 */
BC.prototype.unmask = function () {
	$$dom = $$.byid(this.config.id + "-mask");
	$$.remove($$dom);
	this.config.maskIt = undefined;
};



})(window);
/****************************=csc-static-table.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-STATIC-TABLE
 * @author Mahmut Yıldız
 */
function Definition(CS) {
	this.DEFAULTS = {
		colCount: 3
	};

	this.BaseBF = "CONTAINER";

	this.METHODS = [ "collapse", "expand", "setColumnWidths(widths)", "setColumnCount(count)" ];
	this.EVENTS = [ "selected", "onload", "oninit(param)" ];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-STATIC-TABLE", def);

var BC = def.Type;


BC.prototype.render = function($container) {
	var bf = this.bf;
	var bc = this;
	
	var colWidths = [];
	if(this.config.colWidths){
		var parts = this.config.colWidths.split(",");
		for(var i=0; i<parts.length ;i++){
			colWidths[i] = stringTrim(parts[i]);
		}
	}
	
	var $$containerDiv = $$.create("div", {id: this.config.id}, ["csc-static-table", this.config.cssClass]);
	var $$table = $$.create("table", {id: this.config.id+"-t"});
	var $$tbody = $$.create("tbody", {id: this.config.id+"-b"}, null, null, $$table);
	$$table.style.display = (inDesigner(this.bf) || this.config.visible) ? "" : "none";
	
	$$.css($$table, this.config.style || {});
	
	var titleType = this.config.titleType || "none";
	if (titleType == "window") {
		var $$titleDiv = $$.create("div", null, ["csc-form-title", this.config.titleClass], {"width": "100%"});
		var $$titleSpan = $$.create("span", null, this.config.titleIcon);
		$$titleSpan.innerHTML = this.config.title;
		$$titleDiv.appendChild($$titleSpan);
		if (this.config.collapsible === true) {
			var $$collapseBtn = $$.create("ins", null, "collapse");
			$$collapseBtn.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$titleDiv.appendChild($$collapseBtn);
		}
		$$containerDiv.appendChild($$titleDiv);
		$$containerDiv.appendChild($$table);
	} else if (titleType == "fieldset" || titleType == "bfieldset") {
		var $$fieldSet = $$.create("fieldset", null, ["csc-form-fieldset", titleType == "bfieldset" ? "borderless-fieldset":null]);
		var $$legend = $$.create("legend");
		if (this.config.collapsible === true && this.config.showTitle !== false) {
			$$.addClass($$legend, "collapse");
			$$legend.onclick = function() {
				if (bc.collapsed) {
					bf.expand();
				} else {
					bf.collapse();
				}
			};
			$$legend.innerHTML = "<span>" +(this.config.title || "&nbsp;")+ "</span>";
			$$fieldSet.appendChild($$legend);
		} else if (this.config.title && this.config.showTitle !== false) {
			$$legend.innerHTML = "<span>" +(this.config.title || "&nbsp;")+ "</span>";
			$$fieldSet.appendChild($$legend);
		} else {
			$$.addClass($$fieldSet, "csc-form-fieldset-nolegend");
		}
        if(this.config.bottomBorder === false){
            $$.addClass($$fieldSet, "no-bottom-border");
        }
		$$fieldSet.appendChild($$table);
		$$containerDiv.appendChild($$fieldSet);
	} else if (titleType === undefined || titleType == "none") {
		$$containerDiv.appendChild($$table);
	}
	
	$container.appendChild($$containerDiv);
	var counter = 0;
	var $$tr;
	for ( var memberName in bf.members) {
		var member = bf.members[memberName];
		var memConfig = member.getConfig();
		var memberRef = member.bcRef;
		if(memberRef.typeName == "CSC-POPUP" || memberRef.typeName == "CSC-HIDDEN"){
			continue;
		}
		if (!inDesigner(this.bf) && !member.isVisible()) {
			continue;
		}
		if(counter % this.config.colCount == 0){
			$$tr = $$.create("tr",null,null,null,$$tbody);
		}
		counter++;
		var $$td = $$.create("td",{rel: memberName},null,null,$$tr);
		if(memConfig.layoutConfig && memConfig.layoutConfig.horAlign){
			$$td.style.textAlign = memConfig.layoutConfig.horAlign;
		}
		if(memConfig.layoutConfig && memConfig.layoutConfig.verAlign){
			$$td.style.verticalAlign = memConfig.layoutConfig.verAlign;
		}
		if(counter <= this.config.colCount && colWidths[counter-1] !== undefined && colWidths[counter-1] != "*"){
			$$td.style.width = colWidths[counter-1];
		}
		BFEngine.render(member, $$td);
	}
	while(true){
		if(counter % this.config.colCount == 0){
			break;
		}
		counter++;
		$$.create("td",null,null,null,$$tr);
	}
	
	for ( var memberName in bf.members) {
		BFEngine.DRL(bf.members[memberName]);
	}
	if (this.config.defaultCollapseStatus) {
		bc.collapse();
	}
};

BC.prototype.getChildContainer = function(memberName) {
	var $$tbody = $$.byid(this.config.id+"-b");
	if(!$$tbody){
		return;
	}
	var $$trs = $$.childs($$tbody, "tr");
	for(var i=0; i<$$trs.length ; i++){
		var $$td = $$.getChildHasAttr($$trs[i], "rel", memberName);
		if($$td){
			return $$td;
		}
	}
};

BC.prototype.setColumnWidths = function(widths) {
	this.config.colWidths = widths;
	BFEngine.renderRequest(this.bf);
};

BC.prototype.setColumnCount = function(count) {
	this.config.colCount = count;
	BFEngine.renderRequest(this.bf);
};


BC.prototype.collapse = function() {
	var $$containerDiv = $$.byid(this.config.id);
	var fieldset = $$.child($$containerDiv, "fieldset");
	if (!fieldset) {// window
		var $$ins = $$.query($$containerDiv, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "ins"}]);
		if($$ins){
			$$.rmClass($$ins, "collapse");
			$$.addClass($$ins, "expand");
		}
		
	} else {// fieldset
		var $$legend = $$.query($$containerDiv, [{tagName: "fieldset"}, {tagName: "legend"}]);
		if($$legend){
			$$.rmClass($$legend, "collapse");
			$$.addClass($$legend, "expand");
		}
	}
	var $$table = $$.byid(this.config.id+"-t");
	$$table.style.display = "none";
	this.collapsed = true;
};

BC.prototype.expand = function() {
	var $$containerDiv = $$.byid(this.config.id);
	var fieldset = $$.child($$containerDiv, "fieldset");
	if (!fieldset) {// window
		var $$ins = $$.query($$containerDiv, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "ins"}]);
		if($$ins){
			$$.rmClass($$ins, "expand");
			$$.addClass($$ins, "collapse");
		}
		
	} else {// fieldset
		var $$legend = $$.query($$containerDiv, [{tagName: "fieldset"}, {tagName: "legend"}]);
		if($$legend){
			$$.rmClass($$legend, "expand");
			$$.addClass($$legend, "collapse");
		}
	}
	var $$table = $$.byid(this.config.id+"-t");
	$$table.style.display = "";
	BFEngine.DRL(this.bf);
	this.collapsed = false;
};

BC.prototype.setTitle = function(title){
	this.config.title = title;
	var $$container = $$.byid(this.config.id);
	if(this.config.titleType == "window") {
		var $$spanTitle = $$.query($$container, [{tagName: "div", clazz: "csc-form-title"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	} else if(this.config.titleType == "fieldset" || this.config.titleType == "bfieldset") {
		var $$spanTitle = $$.query($$container, [{tagName: "fieldset"}, {tagName: "legend"}, {tagName: "span"}]);
		if($$spanTitle){
			$$spanTitle.innerHTML = title;
		}
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	} else if (eventName == "drop") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
		}
	} else if (eventName == "dragover") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	}
};

BC.prototype.load = function(){
	this.bf.fire("onload");
};
})(window);
/****************************=csc-tab-panel.js=******************************/
(function(window, undefined) {
/** @class CSC-TAB-PANEL LAYOUT */
function Definition(CS) {
	this.DEFAULTS = {
		closable: false,
		showButtons: true,
		border: false,
		effect: "none",
		tabPlacement: "top",
		buttonsView: "multi"
	};

	this.BaseBF = "DYN-CONTAINER";
	this.LABEL = "Tab Panel";


	this.TabbedPane = true;

	this.METHODS = ["setInnerTab(outertab,memberName)","getSelectedTabName", "getSelectedTab", "getTabByName(tabName)", "getTabByBusinessName(businessName)", "select(mname)", "selectTab(mname)", "closeTab(tabName, selectPrev)", "close(tabName, selectPrev)", "closeAllTabs",
		"disableTab(tabName, flag)", "focusTab(tabName)", "accordion", "changeTabTitle(memberName, newTitle)", "cancel(action)", "addClassToTabButton(memberName, cssClass)", "hasClassInTabButton(memberName, cssClass)", "rmClassFromTabButton(memberName, cssClass)","toggleButtons(status)",
		"getScrollPosition", "setScrollPosition(position)"];
	this.EVENTS = ["selected", "tabSelected(selectedTab, tabname)", "tabRendered(tab, tabname)", "tabAdded(tabName)", "onload", "oninit(param)", "drop", "dragover", "tabClosed(tabName, businessName)", "relayout()", "onscroll(scrollTop, scrollLeft)", "menuselected", "onclose(tabName)", "fullMembersRendered"];
	this.DEPENDENCIES = [];

	this.Type = function () {
	};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TAB-PANEL", def);

var BC = def.Type;
var fixMainTabHeight = BCDefaults.get("CSC-TAB-PANEL", "fixMainTabHeight", true);
var putCloseX = BCDefaults.get("CSC-TAB-PANEL", "putCloseX", false);

BC.prototype.setInnerTab=function (innertab,memberName) {
	var bc = this;
	var config = bc.config;
	var tab=document.getElementById(bc.config.id);
	var innerTabElement=document.getElementById(innertab.getConfig().id);
	var buttonsDiv = bc.getButtonsUL(tab);
	var buttonsDivAlt=null;

	for (var tabnode in tab.children) {
		if(tab.children.hasOwnProperty(tabnode)){
			if(tab.children[tabnode].classList.contains("csc-tab-buttons-section")){
				buttonsDivAlt=tab.children[tabnode];
			}
		}
	}
	for (var buttonsDivnode in buttonsDivAlt.children) {
		if(buttonsDivAlt.children.hasOwnProperty(buttonsDivnode)){
			buttonsDivAlt=buttonsDivAlt.children[buttonsDivnode];
		}
	}
	for (var buttonsDivAltnode in buttonsDivAlt.children) {
		if(buttonsDivAlt.children.hasOwnProperty(buttonsDivAltnode)){
			buttonsDivAlt=buttonsDivAlt.children[buttonsDivAltnode];
		}
	}
	for (var buttonsnode in buttonsDivAlt.children) {
		if(buttonsDivAlt.children.hasOwnProperty(node)){
			if(buttonsDivAlt.children[buttonsnode].classList.contains("csc-tab-buttons-section")){
				buttonsDivAlt=buttonsDivAlt.children[buttonsnode];
			}
		}
	}
	for (var node in buttonsDivAlt.children) {
		if(buttonsDivAlt.children.hasOwnProperty(node)){
			if(buttonsDivAlt.children[node].classList.contains("csc-tab-buttons-container")){
				buttonsDivAlt=buttonsDivAlt.children[node];
			}
		}
	}
	//buttonsDiv=buttonsDivAlt.children[0];
	buttonsDivAlt.classList.add("inner-tab-buttons");
	var currentLI=$$.getChildHasClass(buttonsDivAlt, "selected");
	currentLI.classList.add("inner-tab-buttons--item");


	var innerTabButtonList=document.createElement("UL");

	for (var node in currentLI.children) {
		if(currentLI.children.hasOwnProperty(node)){
			if(currentLI.children[node].nodeName==="UL"){
				innerTabButtonList=currentLI.children[node];
			}
		}
	}
	innerTabButtonList.classList.add("inner-tab-button-list");
	currentLI.appendChild(innerTabButtonList);

	function removeSelected () {
		for (var node in innerTabButtonList.children) {
			if(innerTabButtonList.children.hasOwnProperty(node)){
				innerTabButtonList.children[node].classList.remove("inner-tab-selected");
			}
		}
	}

	function createInnerTabButton (title,name,memberClosable) {
		var innerTabLIElement=document.createElement("LI");
		innerTabLIElement.innerHTML="<span>"+title+"</span>";
		innerTabLIElement.setAttribute("rel", name);
		innerTabButtonList.appendChild(innerTabLIElement);
		innerTabLIElement.addEventListener("click",function () {
			innertab.selectTab(name);
		});
		removeSelected ();
		innerTabLIElement.classList.add("inner-tab-selected");
		if(memberClosable){
			var closeButton=document.createElement("SPAN");
			closeButton.classList.add("inner-tab-close");
			closeButton.innerHTML="X";
			innerTabLIElement.appendChild(closeButton);
			closeButton.addEventListener("click",function (e) {
				e.stopPropagation();
				if(innerTabLIElement.classList.contains("inner-tab-selected")){
					innertab.selectTab(innerTabLIElement.previousElementSibling.getAttribute("rel"));
				}
				innerTabButtonList.removeChild(innerTabLIElement);
				return false;
			})
		}
	}

	function addInnerTabMember (tabname) {
		if(tabname){
			var memberConfig=tabname.getConfig();
			var memberClosable=false;
			if(memberConfig.layoutConfig && memberConfig.layoutConfig.closable){
				memberClosable=true;
			}
			var ifmemberExist=($$.getChildHasAttr(innerTabButtonList, "rel", tabname.getMemberName()))
			if(!ifmemberExist){
				if(tabname.getConfig().title){
					createInnerTabButton(tabname.getConfig().title,tabname.getMemberName(),memberClosable);
				}
			}else{
				removeSelected ();
				ifmemberExist.classList.toggle("inner-tab-selected");
			}
		}
	}

	innertab.on("tabSelected",this,function(selectedTab, tabname){
		addInnerTabMember (tabname);
	});

	innertab.on("tabAdded",this,function(tabname){
		addInnerTabMember (tabname);
	});

	if(innerTabButtonList.children.length===0){
		addInnerTabMember(innertab.getSelectedTab());
	}
};

BC.prototype.prepareOrderedArr = function () {
	var $panels = $("#" + this.config.id + " > .csc-tab-panels-section > .csc-tab-panel");

	var tabDomArrObj = {};
	var orderedArr = [];

	$panels.each(function (index) {
		tabDomArrObj[$(this).attr("rel")] = $(this).children(0);
	});

	var i = 0;
	for(var member in this.bf.members) {
		var memConfig = this.bf.members[member].getConfig();
		orderedArr[i++] = {
			id: member,
			title: memConfig.title,
			dom: tabDomArrObj[member]
		};
	}
	return orderedArr;
};

BC.prototype.rotateCube = function (direction) {
	var selectedId = this.config.selected;

	var orderedArr = this.prepareOrderedArr();

	if(direction == "toggle") {
		this.csCubeManager.toggle(selectedId, orderedArr);
	} else {
		var _this = this;
		this.csCubeManager.rotate(selectedId, orderedArr, function (nextTabId) {
			_this.selectTab(nextTabId);
		}, direction);
	}
};


BC.prototype.getVisibleTabNames  = function(){
	var result = [];
	for(var mname in this.bf.members){
		if(this.bf.members[mname].isVisible()){
			result.push(mname);
		}
	}
	return result;
};

BC.prototype.selectPreviousTab = function () {
	var selectedId = this.config.selected, tabNames = this.getVisibleTabNames(), index;

	index = tabNames.indexOf(selectedId);
	if(index === 0){
		index = tabNames.length-1;
	}else{
		index -=1;
	}
	this.selectTab(tabNames[index]);
};

BC.prototype.selectNextTab = function () {
	var selectedId = this.config.selected, tabNames = this.getVisibleTabNames(), index;

	index = tabNames.indexOf(selectedId);
	if(index === tabNames.length-1){
		index =0;
	}else{
		index +=1;
	}
	this.selectTab(tabNames[index]);

};

BC.prototype.hasVisibleItem = function () {
	if(this.config.mainTab) {
		return true;
	}
};

BC.prototype.init = function () {
	var bc = this, config = bc.config;
	bc.renderMap = {};
	bc.buttonMap = [];
	bc.cancels = {};
	if(fixMainTabHeight && config.mainTab && config.forceRelayout !== false) {
		$(window).resize(function () {// #mahmuty burası düzeltilmeli ??
			var $tabDiv = $("#" + config.id);
			var $buttonsSection = $tabDiv.children(".csc-tab-buttons-section");
			var $panelsDiv = $tabDiv.children(".csc-tab-panels-section");
			var tabsHeight = $buttonsSection.outerHeight();
			var height = $tabDiv.parent().height() - tabsHeight;
			if(!config.overflow || config.overflow == "auto") {
				$panelsDiv.css("height", height + "px");
				$panelsDiv.css("overflow-y", "auto");
			}
		});
	}
};

/**
 * @description Seçili sekmenin adını getirir.
 **/
BC.prototype.getSelectedTabName = function () {
	return this.config.selected;
};

/**
 * Returns the the selected tab
 * @returns {*} selected tab
 */
BC.prototype.getSelectedTab = function () {
	var tabname = this.config.selected;
	return this.bf.members[tabname];
};

BC.prototype.getTabByName = function (tabName) {
	return this.bf.members[tabName];
};

BC.prototype.getTabByBusinessName = function (bfName) {
	for(var memname in this.bf.members) {
		if(this.bf.members[memname].$CS$.definition.BF_NAME == bfName) {
			return this.bf.members[memname];
		}
	}
};

BC.prototype.getFixedHeight = function () {

};

BC.prototype.toggleButtons=function (status) {
	var bc=this;
	var bf=bc.bf;
	var config=bc.config;
	var $container=$$.byid(config.id);
	var childNodeList=$container.children;
	var targetNode=null;
	for (node in childNodeList) {
		if(childNodeList.hasOwnProperty(node)){
			if(childNodeList[node].classList.contains("right-buttons")){
				targetNode=childNodeList[node];
			}
		}
	}
	switch (status) {
		case "show":
			targetNode.classList.remove("hide");
			break;
		case "hide":
			targetNode.classList.add("hide");
			break;
		default:
			targetNode.classList.toggle("hide");
			break;
	}
}

BC.prototype.getFixedWidth = function () {
	if(!this.config.style.fillWidth) {
		return;
	}
	var $$tab = $$.byid(this.config.id);
	if(!$$tab) {
		return 0;
	}
	if(!this.pageParent) {
		var parent = this.bf.$CS$.parent, childName, before = this.bf;
		var fixedParentFound = false;
		while(parent) {
			if(parent.bcRef.getFixedWidth) {
				var fixedWidth = parent.bcRef.getFixedWidth();
				if(fixedWidth) {
					var $$buttonsSection = $$.getChildHasClass($$tab, "csc-tab-buttons-section");
					if(this.config.tabPlacement != "left" && this.config.tabPlacement != "right") {
						return fixedWidth;
					}
					var style = window.getComputedStyle($$tab)
					var tabInnerGap = parseInt(style.getPropertyValue("margin-left")) + parseInt(style.getPropertyValue("margin-right")) + parseInt(style.getPropertyValue("padding-left")) + parseInt(style.getPropertyValue("padding-right"));
					return fixedWidth - $$.outerWidth($$buttonsSection, true) - tabInnerGap;
				}
			}
			var pconfig = parent.getConfig();
			if(pconfig.layoutConfig && pconfig.layoutConfig.pageLayout == "fixed") {
				childName = before.getMemberName();
				fixedParentFound = true;
				break;
			}
			before = parent;
			parent = parent.$CS$.parent;
		}
		if(fixedParentFound) {
			this.pageParent = parent;
			this.pageChildName = childName;
		}
	}
	if(this.pageParent) {
		var $$childContainer = this.pageParent.bcRef.getChildContainer(this.pageChildName);
		this.pageParent = undefined;
		if($$childContainer) {
			if(this.config.tabPlacement != "left" || !this.config.showButtons) {
				return $$.innerWidth($$childContainer);
			}
			var style = window.getComputedStyle($$tab);
			var tabInnerGap = parseInt(style.getPropertyValue("margin-left")) + parseInt(style.getPropertyValue("margin-right")) + parseInt(style.getPropertyValue("padding-left")) + parseInt(style.getPropertyValue("padding-right"));
			var $$buttonsSection = $$.getChildHasClass($$tab, "csc-tab-buttons-section");
			var bsPosition = $$buttonsSection ? window.getComputedStyle($$buttonsSection).position : "";
			return $$.innerWidth($$childContainer) - (bsPosition == "fixed" ? 0 : $$.outerWidth($$.getChildHasClass($$tab, "csc-tab-buttons-section")), true) - tabInnerGap;
		}
	}
};

BC.prototype.beforeDRL = function () {
	var bc = this, config = bc.config, $$tab = $$.byid(config.id);
	if($$tab && config.style && config.style.fillHeight){
		var $$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
		if($$panelsDiv){
			$$panelsDiv.style.height = "20px";
		}
	}
};
BC.prototype.DRL = function () {
	var bc = this, config = bc.config;
	var $$tab = $$.byid(config.id);
	if(!$$tab) {
		return false;
	}
	var $$panelsDiv, $$buttonsSection;
	if(fixMainTabHeight && config.mainTab && config.forceRelayout !== false) {
		$$buttonsSection = $$.getChildHasClass($$tab, "csc-tab-buttons-section");
		$$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");

		var tabsHeight = config.tabPlacement == "left" ? 0 : $$.outerHeight($$buttonsSection, true);
		var height = $$.height($$tab.parentNode) - tabsHeight;
		if($$panelsDiv) {
			if(!config.overflow || config.overflow == "auto") {
				$$panelsDiv.style.height = height + "px";
				$$panelsDiv.style.overflowY = "auto";
			}
		}
	}

	if(config.style && (config.style.fillHeight || config.style.fillWidth)) {
		if(!$$panelsDiv){
			$$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
		}
		if(!$$buttonsSection){
			$$buttonsSection = $$.getChildHasClass($$tab, "csc-tab-buttons-section");
		}
		if($$panelsDiv) {
			if(config.style.fillHeight) {
				var tabsHeight = config.tabPlacement == "left" ? 0 : $$.outerHeight($$buttonsSection, true);
				var height = $$.height($$tab.parentNode) - tabsHeight;
				if($$tab.parentNode.style.height && $$tab.parentNode.style.height.indexOf("px")>0){
					height = parseInt($$tab.parentNode.style.height) - tabsHeight;
				}
				if($$tab && $$tab.parentNode) {
					$$panelsDiv.style.height = height+"px";
				}
			}

			if(config.style.fillWidth) {
				$$panelsDiv.style.width = (bc.getFixedWidth() - (bc.config.style ? bc.config.style.widthCroppingSize || 0 : 0)) + "px";
			}
		}
	}

	var $$btnsContainer = (config.tabPlacement == "left" || config.tabPlacement == "right") ? null : $$.getChildHasClass($$.getChildHasClass($$tab, "csc-tab-buttons-section"), "csc-tab-buttons-container");
	if($$btnsContainer) {
		var bosluk = window.mainTabBosluk || 46;
		$$btnsContainer.style.width = "";
		var tabWidth = $$tab.offsetWidth;
		if(!tabWidth) {
			tabWidth = 200;
		}
		if(tabWidth - bosluk == tabWidth) {
			return false;
		}
		bc.tabWidth = tabWidth - bosluk;
		if(config.menuButton) {
			bc.tabWidth -= 34;
		}
		$$btnsContainer.style.width = bc.tabWidth + "px";
	}
	if(config.tabPlacement != "left" && bc.buttonMap.length > 0) {
		var $$rightBtn = $$.byid(config.id + "-right");
		if($$rightBtn) {
			$$rightBtn.style.left = bc.tabWidth + 26 + "px";
		}
		var $$buttonsUL = bc.getButtonsUL($$tab);
		var left = -1 * (parseInt($$buttonsUL.style.left) || 0), total = 0;
		for(var i = 0; i < bc.buttonMap.length; i++) {
			var name = bc.buttonMap[i].n;
			var $$li = $$.getChildHasAttr($$buttonsUL, "rel", name);
			if($$li && !$$.isDisplayNone($$li)) {
				var bwidth = $$.outerWidth($$li, true);
				this.buttonMap[i].w = bwidth;
				total += bwidth;
				if(total - left >= 0 && total - left <= bc.tabWidth) {
					bc.buttonMap[i].v = true;
				} else {
					bc.buttonMap[i].v = false;
				}
				bc.buttonMap[i].d = true;
			} else {
				bc.buttonMap[i].d = false;
			}
		}

		bc.focusTab();
	}

	var $$panelsSection = $$.getChildHasClass($$tab, "csc-tab-panels-section");
	if($$panelsSection) {
		bc.bf.fire("relayout", $$tab.offsetWidth, $$panelsSection.scrollHeight);
	}
};

BC.prototype.render = function ($$container) { 
	var bc = this, bf = bc.bf, config = bc.config;
	bc.renderMap = {};
	var $$tabDiv = $$.create("DIV", {id: config.id}, ["csc-tab", config.cssClass], config.style);
	if(config.mainTab) {
		$$.addClass($$tabDiv, "csc-main-tab");
	}else{
		$$.addClass($$tabDiv, "csc-normal-tab");
	}
	
	// set styles of container
	$$tabDiv.style.display = config.visible ? "" : "none";
	$$container.appendChild($$tabDiv);

	// cubeEffect2 varsa farklı çiz, yoksa normal tab çiz.
	if(config.cubeEffect2) {
		bc.renderCube2_1(bf.members);
	} else {
		var selected = config.selected;
		if(selected && !bf.members[selected].hasVisibleItem()) {
			selected = undefined;
		}
		// Render buttons section
		for(var mname in bf.members) {
			BFEngine.addLazyRendered(bf.members[mname]);
		}
		for(var mname in bf.members) {
			var select = false;
			var member = bf.members[mname];
			if(!selected && member.hasVisibleItem()) {
				selected = mname;
			}
			bc.appendNewMember(member, mname, selected == mname);
		}
		bc.selectTab(selected,null, null,true);
		bf.fire("fullMembersRendered");
		if(!bc.tabWidth || bc.tabWidth < 200 || (config.style && config.style.fillHeight)) {
			bc.DRL();
		}
	}
};

BC.prototype.getScrollPosition = function () {
	var $$tabPanelsSection = $$.getChildHasClass(this.config.id, "csc-tab-panels-section"), result = {top:0, left: 0};
	if($$tabPanelsSection){
		result.top = $$tabPanelsSection.scrollTop;
		result.left = $$tabPanelsSection.scrollLeft;
	}
	return result;
};

BC.prototype.setScrollPosition = function (pos) {
	var $$tabPanelsSection = $$.getChildHasClass(this.config.id, "csc-tab-panels-section");
	if($$tabPanelsSection){
		$$tabPanelsSection.scrollTop = pos.top;
		$$tabPanelsSection.scrollLeft = pos.left;
	}
};

BC.prototype.focusTab = function (index) {
	if(this.config.buttonsView != "single") {
		return;
	}
	if(index === undefined) {
		index = this.config.selected;
	}
	if(typeof index == "string") {
		for(var i = 0; i < this.buttonMap.length; i++) {
			if(this.buttonMap[i].n == index) {
				index = i;
				break;
			}
		}
	}
	if(typeof index != "number") {
		return;
	}
	if(!this.buttonMap[index] || !this.buttonMap[index].d) {
		return;
	}
	var $$buttonsUL = this.getButtonsUL($$.byid(this.config.id));
	if(!$$buttonsUL) {
		return;
	}
	var firstVisible, lastVisible, isleft = true;
	for(var i = 0; i < this.buttonMap.length; i++) {
		if(firstVisible === undefined && this.buttonMap[i].v && this.buttonMap[i].d) {
			firstVisible = i;
		}
		if(this.buttonMap[i].v && this.buttonMap[i].d) {
			lastVisible = i;
		}
	}


	var calcedWidth = 0, left = 0;
	if(index < firstVisible) {//sol tarafta kalıyor
		for(var i = 0; i < index; i++) {
			if(this.buttonMap[i].d) {
				left += this.buttonMap[i].w;
			}
		}
		$($$buttonsUL).animate({left: -(left) + "px"}, 300);
	} else if(index > lastVisible) {//sağ tarafta kalıyor
		for(var i = 0; i <= index; i++) {
			if(this.buttonMap[i].d) {
				calcedWidth += this.buttonMap[i].w;
			}
		}
		if($$.outerWidth($$buttonsUL) >= this.tabWidth) {
			left = calcedWidth - this.tabWidth;
			$($$buttonsUL).animate({left: -(left) + "px"}, 300);
		}
	} else {
		left = -1 * parseInt($$buttonsUL.style.left) || 0;
	}

	calcedWidth = 0;
	for(var i = 0; i < this.buttonMap.length; i++) {
		if(!this.buttonMap[i].d) {
			continue;
		}
		calcedWidth += this.buttonMap[i].w;
		if(calcedWidth - this.buttonMap[i].w < left || calcedWidth - left > this.tabWidth) {
			this.buttonMap[i].v = false;
		} else {
			this.buttonMap[i].v = true;
		}
	}

	var $$left = $$.byid(this.config.id + "-left"), $$right = $$.byid(this.config.id + "-right");
	var fd = false, ld = 0;
	for(var i = 0; i < this.buttonMap.length; i++) {
		if(this.buttonMap[i].d && fd === false) {
			fd = i;
		}
		if(this.buttonMap[i].d) {
			ld = i;
		}
	}
	if(!fd) {
		fd = 0;
	}
	if(!this.buttonMap[fd].v || !this.buttonMap[ld].v) {
		$$left.style.visibility = "visible";
		$$right.style.visibility = "visible";
		if(this.buttonMap[fd].v) {
			$$.addClass($$left, "disabled");
		} else {
			$$.rmClass($$left, "disabled");
		}
		if(this.buttonMap[ld].v) {
			$$.addClass($$right, "disabled");
		} else {
			$$.rmClass($$right, "disabled");
		}
	} else {
		$$left.style.visibility = "";
		$$right.style.visibility = "";
	}
};

BC.prototype.reCalculateButtons = function ($$buttonsUL) {
	if(this.config.buttonsView != "single") {
		return;
	}
	if(!$$buttonsUL) {
		return;
	}

	var left = -1 * (parseInt($$buttonsUL.style.left) || 0), total = 0;
	for(var i = 0; i < this.buttonMap.length; i++) {
		var name = this.buttonMap[i].n;
		var $$li = $$.getChildHasAttr($$buttonsUL, "rel", name);
		if($$li && !$$.isDisplayNone($$li)) {
			var bwidth = $$.outerWidth($$li, true);
			this.buttonMap[i].w = bwidth;
			total += bwidth;
			if(total - left >= 0 && total - left <= this.tabWidth) {
				this.buttonMap[i].v = true;
			} else {
				this.buttonMap[i].v = false;
			}
			this.buttonMap[i].d = true;
		} else {
			this.buttonMap[i].d = false;
		}
	}
};

BC.prototype.changeTabTitle = function (memberName, newTitle) {
	var member = typeof memberName == "string" ? this.bf.members[memberName] : memberName;
	member.setConfig("title", newTitle);
	this.rerenderChildTitle(member.getMemberName(), newTitle);
};

/**
 * Adds css class to tab button
 * @param memberName {string} - member name of tab
 * @param cssClass {string} - css class
 */
BC.prototype.addClassToTabButton = function (memberName, cssClass) {
	var bc = this;
	if(!bc.btnClasses) {
		bc.btnClasses = {};
	}
	if(!bc.btnClasses[memberName]) {
		bc.btnClasses[memberName] = [];
	}
	if(bc.btnClasses[memberName].indexOf(cssClass) < 0){
		bc.btnClasses[memberName].push(cssClass);
	}
	var $$tab = $$.byid(bc.config.id), $$ul = bc.getButtonsUL($$tab), $$li;
	if($$ul) {
		$$li = $$.getChildHasAttr($$ul, "rel", memberName);
		$$.addClass($$li, cssClass);
	}
};

/**
 * Checks whether given css class in the tab button
 * @param memberName {string} - member name of tab
 * @param cssClass {string} - css class
 */
BC.prototype.hasClassInTabButton = function (memberName, cssClass) {
	var bc = this;
	if(!bc.btnClasses || !bc.btnClasses[memberName]) {
		return false;
	}
	return bc.btnClasses[memberName].indexOf(cssClass) >= 0;
};

/**
 * Removes css class from tab button
 * @param memberName {string} - member name of tab
 * @param cssClass {string} - css class
 */
BC.prototype.rmClassFromTabButton = function (memberName, cssClass) {
	var bc = this;
	if(!bc.btnClasses || !bc.btnClasses[memberName]) {
		return;
	}
	var index = bc.btnClasses[memberName].indexOf(cssClass);
	if(index >= 0){
		bc.btnClasses[memberName].splice(index, 1);
	}
	var $$tab = $$.byid(bc.config.id), $$ul = bc.getButtonsUL($$tab), $$li;
	if($$ul) {
		$$li = $$.getChildHasAttr($$ul, "rel", memberName);
		$$.rmClass($$li, cssClass);
	}
};

BC.prototype.rerenderChildTitle = function (mname, title) {
	title = title || "";
	var $$tab = $$.byid(this.config.id);
	var $$buttonsUL = this.getButtonsUL($$tab);
	var $$li = $$.getChildHasAttr($$buttonsUL, "rel", mname);
	var $$span = $$.child($$li, "SPAN");
	if($$span) {
		$$span.innerHTML = title;
		this.reCalculateButtons($$buttonsUL);
	}
};


BC.prototype.appendNewMember = function (member, memberName, select, acccordion) {
	var bc = this, bf = bc.bf, config = bc.config, forceDrl;
	var $tabDiv = $("#" + config.id);
	var $$tab = $tabDiv[0];
	if(!$$tab) {
		return;
	}
	var memberVisible = member.hasVisibleItem();
	var $$buttonsUL = null;
	if(config.showButtons && member.bcRef.typeName != "CSC-POPUP") {
		var $$buttonsDiv = $$.getChildHasClass($$tab, "csc-tab-buttons-section");
		if(!$$buttonsDiv) {
			$$buttonsDiv = $$.create("div", null, ["csc-tab-buttons-section", config.cssClass]);
			var $$btnsContainer = $$.create("div", null, ["csc-tab-buttons-container"]);
			if(config.buttonsView == "single") {
				$$.addClass($$buttonsDiv, "csc-tab-buttons-section-single");
			}
			$$buttonsUL = $$.create("ul");
			$$tab.appendChild($$buttonsDiv);
			if(config.tabAlign === "center") {
				$$.addClass($$buttonsUL, "csc-tab-buttons-align-center");
			}

			if(config.menuButton) {
				var $$btnMenu = $$.create("div", {id: config.id + "-menu", title: "Menü"}, "csc-tab-btns-menu");
				$$buttonsDiv.appendChild($$btnMenu);
				$$btnMenu.onclick = function () {
					bf.fire("menuselected");
				};
			}
			var $$btnsLeft = $$.create("div", {id: config.id + "-left"}, "csc-tab-btns-left");
			var $$btnsRight = $$.create("div", {id: config.id + "-right"}, "csc-tab-btns-right");
			$$buttonsDiv.appendChild($$btnsContainer);
			$$buttonsDiv.appendChild($$btnsLeft);
			$$buttonsDiv.appendChild($$btnsRight);
			$$btnsContainer.appendChild($$buttonsUL);

			if(this.config.cubeEffect) {
				var $$cubeIcon = $$.create("img", {id: config.id + "-cube-icon"}, "csc-tab-cube-icon");
				var bfname = bf.$CS$.definition.BF_NAME;
				$$cubeIcon.src = SideModuleManager.getResourceUrl(bfname.substring(0, bfname.indexOf(".")), "css/bc-style/img/cube2/cube.png");
				$$buttonsDiv.appendChild($$cubeIcon);
				$$btnsContainer.style.left = "25px";
				$$.bindEvent($$cubeIcon, "click", function (e) {
					bc.rotateCube("toggle");
				});
			}
			if(config.tabPlacement != "left" && config.tabPlacement != "right") {
				var bosluk = window.mainTabBosluk || 46;
				bc.tabWidth = $$tab.offsetWidth - bosluk;
				if(!bc.tabWidth) {
					bc.tabWidth = 200;
				}
				if(config.menuButton) {
					bc.tabWidth -= 34;
				}
				$$btnsContainer.style.width = (bc.tabWidth) + "px";
				$$btnsRight.onclick = function () {
					var lastVisible;
					for(var i = 0; i < bc.buttonMap.length; i++) {
						if(bc.buttonMap[i].d && bc.buttonMap[i].v) {
							lastVisible = i;
						}
					}
					for(var i = lastVisible + 1; i < bc.buttonMap.length; i++) {
						if(bc.buttonMap[i].d) {
							bc.focusTab(i);
							return;
						}
					}
				};

				$$btnsLeft.onclick = function () {
					for(var i = 0; i < bc.buttonMap.length; i++) {
						if(bc.buttonMap[i].d && bc.buttonMap[i].v) {
							if(i > 0) {
								for(var j = i - 1; j >= 0; j--) {
									if(bc.buttonMap[j].d) {
										bc.focusTab(j);
										return;
									}
								}
							}
							break;
						}
					}
				};
			}
		} else {
			$$buttonsUL = $$.child($$.getChildHasClass($$buttonsDiv, "csc-tab-buttons-container"), "ul");
		}

		if(config.tabPlacement == "top") {
			$$.addClass($$buttonsDiv, "top-buttons");
		} else if(config.tabPlacement == "left") {
			$$.addClass($$tab, "csc-left-tab");
			$$.addClass($$buttonsDiv, "left-buttons");
			if(this.config.tabBtnWidth && parseInt(config.tabBtnWidth, 10) > 0) {
				$$buttonsDiv.style.width = parseInt(config.tabBtnWidth, 10) + "px";
			}

			var tabPanelsSection = $$.getChildHasClass($$tab, "csc-tab-panels-section");
			if(tabPanelsSection) {
				tabPanelsSection.style.display = "table-cell";
				tabPanelsSection.style.verticalAlign = "top";
			}
		}else if(config.tabPlacement==="right"){
			var $$panelsSection=$$.getChildHasClass($$tab, "csc-tab-panels-section");
			$$.addClass($$tab,"csc-right-tab");
			$$.addClass($$buttonsDiv, "right-buttons");
			$$tab.appendChild($$buttonsDiv);
			if(this.config.tabBtnWidth && parseInt(config.tabBtnWidth, 10) > 0) {
				$$buttonsDiv.style.width = parseInt(config.tabBtnWidth, 10) + "px";
				if($$panelsSection){
					$$panelsSection.style.width=($$tab.offsetWidth-config.tabBtnWidth)+"px";
				}
				
			}else{
				$$buttonsDiv.style.width="";
			}
		}
		var $$li = $$.getChildHasAttr($$buttonsUL, "rel", memberName);
		if(!$$li) {
			var memConfig = member.getConfig();
			if(memConfig.title === undefined) {
				memConfig.title = "Tab ";
			}
			var closable = (memConfig.layoutConfig && memConfig.layoutConfig.closable !== undefined) ? memConfig.layoutConfig.closable : config.closable;
			$$li = $$.create("li", {rel: memberName});

			if(memConfig.layoutConfig && memConfig.layoutConfig.tip !== undefined) {
				$$.attr($$li, "title", memConfig.layoutConfig.tip);
			}

			if(memConfig.layoutConfig && memConfig.layoutConfig.tabimage) {
				var bfname = bf.$CS$.definition.BF_NAME;
				var $$img = $$.create("img", {src: SideModuleManager.getResourceUrl(bfname.substring(0, bfname.indexOf(".")), memConfig.layoutConfig.tabimage)});
				$$li.appendChild($$img);
			}
			if(bc.btnClasses && bc.btnClasses[memberName]) {
				$$.addClass($$li, bc.btnClasses[memberName]);
			}

			var $$span = $$.create("span");
			$$span.innerHTML = memConfig.title;
			$$li.appendChild($$span);
			if(closable && !member.bcRef.config.notClosed) {
				var $$closeDiv = $$.create("div", null, "csc-tab-close");
				if(putCloseX) {
					$$closeDiv.innerHTML = "x";
				}
				$$closeDiv.onclick = function () {
					try {
						BFEngine.a();
						bf.closeTab($(this).parent().attr("rel"));
						return false;
					} finally {
						BFEngine.r();
					}
				};
				$$li.closable=true;
				$$li.appendChild($$closeDiv);
			}else{
				$$li.closable=false;
			}

			$$li.onclick = function (event) {
				if(member.getConfig().tabDisabled) {
					return;
				}
				if(closable && event.which == 2) {
					event.preventDefault();
					bf.closeTab(this.getAttribute("rel"));
					return false;
				}
				try {
					BFEngine.a();
					bf.selectTab(this.getAttribute("rel"));
				} finally {
					BFEngine.r();
				}
				return false;
			};
			if(memConfig.tabDisabled) {
				$$.addClass($$li, "disabled-tab");
			}
			var buttonsHeightOld = $$buttonsUL.offsetHeight;
			$$buttonsUL.appendChild($$li);
			if(config.style && config.style.fillHeight && buttonsHeightOld-$$buttonsUL.offsetHeight != 0){
				forceDrl = true;
			}
			var bwidth = $$.outerWidth($$li, true);
			var calcedWidth = 0;
			var left = -1 * parseInt($$buttonsUL.style.left) || 0;
			var prevVisible = false;
			for(var i = 0; i < bc.buttonMap.length; i++) {
				if(this.buttonMap[i].v) {
					prevVisible = true;
					calcedWidth += bc.buttonMap[i].w;
				} else if(prevVisible) {
					calcedWidth = 1000000;
					break;
				}
			}
			var visible = true;
			if(calcedWidth + bwidth - left > bc.tabWidth) {
				visible = false;
			}
			var bbutton;
			for(var i = 0; i < bc.buttonMap.length; i++) {
				if(bc.buttonMap[i].n == memberName) {
					bbutton = bc.buttonMap[i];
					break;
				}
			}
			if(!bbutton) {
				bbutton = {
					n: memberName,
					v: visible
				};
				bc.buttonMap.push(bbutton);
			}
			bbutton.w = bwidth;
			bbutton.d = !$$.isDisplayNone($$li);
			if(!visible) {
				var $$btnsRight = $$.byid(config.id + "-right");
				$$btnsRight.style.visibility = "visible";
			}
			//tab button right click
			if(config.tabContectMenuType && config.tabContectMenuType==="close"){
				var standartContextmenu=
					[
						{
							"label" : "Diğer Sekmeleri Kapat",
							"action" : function (event, tabNameOBJ) {
								console.log(event,tabNameOBJ);
								tabNameOBJ.tabNameList.forEach( function(element, index) {
									if(tabNameOBJ.currentTab!==element){
										bc.closeTab(element);
									}
								});
							},
						},
						{
							"label" : "Sağdaki Sekmeleri Kapat",
							"action" : function (event, tabNameOBJ) {
								var thisIndex=tabNameOBJ.tabNameList.indexOf(tabNameOBJ.currentTab);
								tabNameOBJ.tabNameList.forEach( function(element, index) {
									if(index>thisIndex){
										bc.closeTab(element);
									}
								});
							},
						},
						{
							"label" : "Soldaki Sekmeleri Kapat",
							"action" : function (event, tabNameOBJ) {
								var thisIndex=tabNameOBJ.tabNameList.indexOf(tabNameOBJ.currentTab);
								tabNameOBJ.tabNameList.forEach( function(element, index) {
									if(index<thisIndex){
										bc.closeTab(element,false);
									}
								});
							}
						}
					];
				function openstandartContextmenu(item, event){
					var tabNameList=[];
					var thisTabName=item.getAttribute("rel");
					console.log(closable);
					if(closable){
						var closeSelf={
							"label" : "Sekmeyi Kapat",
							"action" : function (event, tabNameOBJ) {
								if(tabNameOBJ.tabNameList.indexOf(tabNameOBJ.currentTab)>-1){
									bc.closeTab(tabNameOBJ.currentTab);
								}
							}
						};
						if(standartContextmenu.length===3){
							standartContextmenu.unshift(closeSelf);
						}
					}
					for (var i =0; i < $$buttonsUL.children.length; i++) {
						var isClosable=$$buttonsUL.children[i].closable;
						if(isClosable===true){
							tabNameList.push($$buttonsUL.children[i].getAttribute("rel"));
						}
					}
					var tabNameOBJ={};
					tabNameOBJ.currentTab=thisTabName;
					tabNameOBJ.tabNameList=tabNameList;
					var options = {
						top : event.pageY,
						left: event.pageX,
						items: standartContextmenu
					};
					csdu.contextMenu(options,tabNameOBJ);
					if(standartContextmenu.length>3){
						standartContextmenu.shift();
					}
				}
				$$li.addEventListener("contextmenu",function (e) {
					e.preventDefault();
					openstandartContextmenu(this, e);
				});
				var contextMenuTrigger=document.createElement("i");
				contextMenuTrigger.classList.add("fa");
				contextMenuTrigger.classList.add("fa-bars");
				$$li.insertBefore(contextMenuTrigger, $$li.firstChild);
				contextMenuTrigger.addEventListener("click",function(e){
					e.preventDefault();
					openstandartContextmenu(this.parentElement,e);
				});
			}
			
		} else {
			var bbutton;
			for(var i = 0; i < bc.buttonMap.length; i++) {
				if(bc.buttonMap[i].n == memberName) {
					bbutton = bc.buttonMap[i];
					break;
				}
			}
			if(bbutton) {
				bbutton.d = inDesigner(bf) || memberVisible;
				bbutton.w = $$.outerWidth($$li, true);
			}
			bc.reCalculateButtons($$buttonsUL);

			if(bc.btnClasses && bc.btnClasses[memberName]) {
				$$.addClass($$li, bc.btnClasses[memberName]);
			}
		}
		var memConfig = member.getConfig();
		if((!inDesigner(bf) && !memberVisible) || (memConfig.layoutConfig && memConfig.layoutConfig.showBtn === false)) {
			$$li.style.display = "none";
		} else {
			$$li.style.display = "";
		}
	}

	// Render panels section
	var $$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
	if(!$$panelsDiv) {
		$$panelsDiv = $$.create("div", null, "csc-tab-panels-section");
		$$tab.appendChild($$panelsDiv);
		if(fixMainTabHeight && config.mainTab && config.forceRelayout !== false) {
			var tabsHeight = $$.outerHeight($$buttonsDiv);
			var height = $$.height($$tab.parentNode) - tabsHeight;
			if(!config.overflow || config.overflow == "auto") {
				$$panelsDiv.style.height = height + "px";
				$$panelsDiv.style.overflowY = "auto";
			}
		}
		$$panelsDiv.onscroll = function(e) {
			SIDENavigator.setEvent(e);
			bf.fire("onscroll", this.scrollTop, this.scrollLeft);
		};
		if(config.tabPlacement == "left") {
			$$panelsDiv.setAttribute("tabindex", 1111);
		}
	}

	if(member.bcRef.typeName == "CSC-POPUP") {
		return;// popup ise çizme devam et
	}
	if(!inDesigner(bf) && !memberVisible) {
		if(select) {
			config.selected = memberName;
		}
		return;// visible değilse çizme devam et
	}
	if(config.selected == memberName || select || config.cubeEffect || acccordion) {
		bc.renderMap[memberName] = true;
		BFEngine.rmLazyRendered(member);
		//TODO: burada cubeEffect olduğunda önce csc-tab-panel-show yapmalı. kup hide iken calısmaz...
		var $$div = $$.create("div", {rel: memberName}, ["csc-tab-panel", "csc-tab-panel-hide"]);
		if(acccordion) {
			$$.insertFirst($$div, $$panelsDiv);
		} else {
			$$panelsDiv.appendChild($$div);
		}

		if(config.selected == memberName || select) {
			bc.selectTab(memberName, null, config.selected != memberName);
		}
		BFEngine.render(member, $$div);
		bf.fire("tabRendered", member, memberName);
		if(config.cubeEffect) {
			$$.rmClass($$div, "csc-tab-panel-show");
			$$.addClass($$div, "csc-tab-panel-hide");
		}
	}
	if(forceDrl){
		BFEngine.DRL(this.bf);
	}
};

BC.prototype.getScrollTop = function () {
	var $$tab = $$.byid(this.config.id);
	var $$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
	return $$panelsDiv.scrollTop;
};

BC.prototype.getButtonsUL = function ($$tab) {
	var $$buttonsDiv = $$.getChildHasClass($$.getChildHasClass($$tab, "csc-tab-buttons-section"), "csc-tab-buttons-container");
	return $$.child($$buttonsDiv, "ul");
};

BC.prototype.disableTab = function (tabNameArr, flag) {
	if(!Array.isArray(tabNameArr)) {
		tabNameArr = [tabNameArr];
	}
	for(var i in tabNameArr) {
		var tabName = tabNameArr[i];
		if(!this.bf.members[tabName]) {
			continue;
		}
		this.bf.members[tabName].setDisabled(flag);
		this.bf.members[tabName].getConfig().tabDisabled = flag;
	}
	BFEngine.renderRequest(this.bf);
};

BC.prototype.recheckMemberVisibility = function (member) {
	var $$tab = $$.byid(this.config.id);
	if(!$$tab) {
		return;
	}
	var tabName = member.$CS$.name;
	var $$buttonsUL = this.getButtonsUL($$tab);
	var $$li = $$.getChildHasAttr($$buttonsUL, "rel", tabName);
	var bbutton;
	for(var i = 0; i < this.buttonMap.length; i++) {
		if(this.buttonMap[i].n == tabName) {
			bbutton = this.buttonMap[i];
			break;
		}
	}
	if(member.hasVisibleItem()) {
		if($$li) {
			$$li.style.display = "";
		}
		if(bbutton) {
			bbutton.d = true;
			bbutton.w = $$.outerWidth($$li, true);
		}
	} else {
		if(bbutton) {
			bbutton.d = false;
		}
		if($$li) {
			$$li.style.display = "none";
		}
	}
	this.reCalculateButtons($$buttonsUL);

	if(this.config.selected) {
		this.selectTab(this.config.selected);
	}
};

/**
 * Return true if a rendered member exist
 */
BC.prototype.hasAnyRenderedMember = function () {
	var bc = this, config = bc.config;
	var $$tab = $$.byid(config.id);
	if(!$$tab) {
		return false;
	}
	var $$panelsSection = $$.getChildHasClass($$tab, "csc-tab-panels-section");
	if(!$$panelsSection || !$$panelsSection.childNodes.length) {
		return false;
	}
	return true;
};

BC.prototype.renderMember = function (member) {
	var bc = this, bf = bc.bf, config = bc.config;
	config.style = config.style || {};
	var tabName = member.$CS$.name;
	if(!bc.renderMap[tabName]) {
		var forceDRL = config.style.fillHeight && !bc.hasAnyRenderedMember();
		bc.appendNewMember(bf.members[tabName], tabName, tabName == config.selected);
		if(forceDRL) {
			bc.DRL();
		}
		return;
	}
	var $$tab = $$.byid(this.config.id);
	if(!$$tab) {
		return;
	}
	var $$buttonsUL = this.getButtonsUL($$tab);
	var $$li = $$.getChildHasAttr($$buttonsUL, "rel", tabName);
	var bbutton;
	for(var i = 0; i < this.buttonMap.length; i++) {
		if(this.buttonMap[i].n == tabName) {
			bbutton = this.buttonMap[i];
			break;
		}
	}

	if(member.hasVisibleItem()) {
		if(bbutton) {
			bbutton.d = true;
		}
		if($$li) {
			$$li.style.display = "";
		}
		var ref = member.bcRef;
		ref.reRender();
	} else {
		if(bbutton) {
			bbutton.d = false;
		}
		if($$li) {
			$$li.style.display = "none";
		}
		var $$panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
		var $$div = $$.getChildHasAttr($$panelsDiv, "rel", tabName);
		if($$div) {
			$$.remove($$div);
		}
		this.renderMap[tabName] = undefined;


		//seçili tab bu tab. Ama görünür olmadığı için farklı bir tab seçilir olmalı
		if(this.config.selected == tabName) {
			for(var memberName in this.bf.members) {
				if(memberName == tabName) {
					continue;
				}
				var othermember = this.bf.members[memberName];
				if(othermember.hasVisibleItem()) {
					this.selectTab(memberName);
					break;
				}
			}
		}
	}
};

//Accordion ile uyumluluk için eklendi, selectTab ile aynı işi yapıyor
BC.prototype.select = function (tabName, norender) {
	this.selectTab(tabName, norender);
};

BC.prototype.selectTab = function (tabName, norender, fireEvent, renderSelectFlag) {
	if(!tabName) {
		return;
	}
	if(!this.bf.members[tabName]) {
		return;
	}

	var bc=this, config=bc.config, bf=bc.bf;
	var oldSelected = this.config.selected;
	var $tab = $("#" + this.config.id);
	var tab = $tab[0];
	var $$buttonsUL = this.getButtonsUL(tab);
	var direction = "right";

	var panelsDiv = $$.getChildHasClass(tab, "csc-tab-panels-section");
	if(config.tabPlacement == "left") {
		panelsDiv.focus();
	}

	// Popup işleri
	if(oldSelected) {
		var $$popupDivs = $$.getChildsHasAttr(panelsDiv, "rel", oldSelected + "-popup");
		for(var i = 0; i < $$popupDivs.length; i++) {
			$$popupDivs[i].style.display = "none";
		}
	}
	var $$popupDivs = $$.getChildsHasAttr(panelsDiv, "rel", tabName + "-popup");
	for(var i = 0; i < $$popupDivs.length; i++) {
		var flexCheckPopup = $$popupDivs[i];
		flexCheckPopup = flexCheckPopup.querySelector("div[rel='flexPdf']");
		if(flexCheckPopup){
			var sourceType = $$popupDivs[i].childNodes[1].getAttribute("sourcetype");
			if(sourceType && sourceType != "pdf"){
				$$popupDivs[i].style.display = "none";
				$$popupDivs[i-1].style.display = "none";
			}
			else{
				$$popupDivs[i].style.display = "block";
				$$popupDivs[i-1].style.display = "block";
			}

		}
		else{
			$$popupDivs[i].style.display = "block";
		}
	}

	//burası popup işlerinden sonra olmalı yoksa oldSelected bulunamıyor #hakand
	if(norender) {
		this.config.selected = tabName;
		return;
	}
	if(!this.renderMap[tabName]) {
		this.appendNewMember(this.bf.members[tabName], tabName, true);
		this.config.selected = tabName;
		return;
	}

	for(var member in this.bf.members) {
		if(oldSelected == member) {
			direction = "left";
		}
		if(member == tabName) {
			//Butonlarin selected degerlerinin degistirldigi kisim
			var prevSelectedLI = $$.getChildHasClass($$buttonsUL, "selected");
			$$.rmClass(prevSelectedLI, "selected");
			var selectedLI = $$.getChildHasAttr($$buttonsUL, "rel", tabName);
			if(selectedLI) {
				$$.addClass(selectedLI, "selected");
			}
			var shownDiv = $$.getChildHasClass(panelsDiv, "csc-tab-panel-show");
			var toShowDiv = $$.getChildHasAttr(panelsDiv, "rel", tabName);
			if(this.config.tabEffect == "flip") {
				shownDiv = $$.getChildHasClass(panelsDiv, "flip-right-to-left-back") || $$.getChildHasClass(panelsDiv, "flip-left-to-right-back") || $$.getChildHasClass(panelsDiv, "csc-tab-panel-show");

				var oldShownDiv = $$.getChildHasClass(panelsDiv, "flip-right-to-left") || $$.getChildHasClass(panelsDiv, "flip-left-to-rgiht");
				if(oldShownDiv) {
					$$.rmClass(oldShownDiv, "flip-right-to-left");
					$$.rmClass(oldShownDiv, "flip-left-to-right");
					$$.rmClass(oldShownDiv, "csc-tab-flip-animate");
					$$.rmClass(oldShownDiv, "csc-tab-panel-show");
					$$.addClass(oldShownDiv, "csc-tab-panel-hide");
				}

				panelsDiv.style.position = "relative";
				panelsDiv.style.perspective = "1000px";
				if((!shownDiv && toShowDiv) || (shownDiv == toShowDiv)) {
					$$.rmClass(toShowDiv, "csc-tab-panel-hide");
					$$.addClass(toShowDiv, "csc-tab-panel-show");
				} else if(shownDiv && toShowDiv) {

					$$.rmClass(shownDiv, "csc-tab-flip-animate");
					$$.rmClass(shownDiv, "flip-right-to-left");
					$$.rmClass(shownDiv, "flip-right-to-left-back");
					$$.rmClass(shownDiv, "flip-left-to-right");
					$$.rmClass(shownDiv, "flip-left-to-right-back");
					$$.rmClass(shownDiv, "csc-tab-panel-hide");
					$$.addClass(shownDiv, "csc-tab-panel-show");

					$$.rmClass(toShowDiv, "csc-tab-flip-animate");
					$$.rmClass(toShowDiv, "flip-right-to-left");
					$$.rmClass(toShowDiv, "flip-right-to-left-back");
					$$.rmClass(toShowDiv, "flip-left-to-right");
					$$.rmClass(toShowDiv, "flip-left-to-right-back");
					$$.rmClass(toShowDiv, "csc-tab-panel-hide");
					$$.addClass(toShowDiv, "csc-tab-panel-show");

					if(direction == "right") {
						$$.addClass(toShowDiv, "csc-tab-flip-animate flip-left-to-right-back");
						$$.addClass(shownDiv, "csc-tab-flip-animate flip-left-to-right");
					} else {
						$$.addClass(toShowDiv, "csc-tab-flip-animate flip-right-to-left-back");
						$$.addClass(shownDiv, "csc-tab-flip-animate flip-right-to-left");
					}
				}

			} else if(this.config.tabEffect == "slide") {
				tab.style.position = "relative";
				tab.style.overflow = "hidden";
				if(shownDiv) {
					if(!toShowDiv) {
						$$.rmClass(shownDiv, "csc-tab-panel-show");
						$$.addClass(shownDiv, "csc-tab-panel-hide");
					} else {
						shownDiv.style.top = 0;
						toShowDiv.style.top = 0;
						var width = panelsDiv.offsetWidth;
						var animate = null;
						if(direction == "right") {
							toShowDiv.style.visibility = "hidden";
							toShowDiv.style.display = "block";
							toShowDiv.style.visibility = "";
							toShowDiv.style.display = "";
							toShowDiv.style.left = "-" + width + "px";
							toShowDiv.style.width = width + "px";
							shownDiv.style.left = 0;
							shownDiv.style.width = width + "px";
							animate = {
								left: "+" + width + "px"
							};
						} else {
							toShowDiv.style.left = width + "px";
							toShowDiv.style.width = width + "px";
							shownDiv.style.width = width + "px";
							shownDiv.style.left = 0;
							animate = {
								left: "-" + width + "px"
							};
						}
						panelsDiv.style.position = "absolute";
						shownDiv.style.position = "absolute";
						toShowDiv.style.position = "absolute";

						toShowDiv.style.display = "block";
						$(panelsDiv).animate(animate, 1000, function () {
							panelsDiv.style.position = "";
							shownDiv.style.position = "";
							toShowDiv.style.position = "";
							toShowDiv.style.display = "";
							shownDiv.style.width = "";
							toShowDiv.style.width = "";
							$$.rmClass(shownDiv, "csc-tab-panel-show");
							$$.addClass(shownDiv, "csc-tab-panel-hide");
							$$.rmClass(toShowDiv, "csc-tab-panel-hide");
							$$.addClass(toShowDiv, "csc-tab-panel-show");
							panelsDiv.style.left = 0;
						});
					}
				} else if(toShowDiv) {
					$$.rmClass(toShowDiv, "csc-tab-panel-hide");
					$$.addClass(toShowDiv, "csc-tab-panel-show");
				}
				tab.style.overflow = "";
			} else if(this.config.effect === undefined || this.config.effect == "none") {
				$$.rmClass(shownDiv, "csc-tab-panel-show");
				$$.addClass(shownDiv, "csc-tab-panel-hide");
				$$.rmClass(toShowDiv, "csc-tab-panel-hide");
				$$.addClass(toShowDiv, "csc-tab-panel-show");
			} else {
				$("#" + this.config.id + " > div > div.csc-tab-panel-show").hide(this.config.effect, function () {
					$(this).removeClass("csc-tab-panel-show").addClass("csc-tab-panel-hide");
				});
				$("#" + this.config.id + " > div > div[rel='" + tabName + "']").show(this.config.effect, function () {
					$(this).removeClass("csc-tab-panel-hide").addClass("csc-tab-panel-show");
				});
			}

			BFEngine.DRL(this.bf.members[member]);
			break;
		}
	}

	this.config.selected = tabName;
	this.focusTab(tabName);
	if((oldSelected != tabName && fireEvent !== false)) {
		this.bf.fire("tabSelected", this.bf.members[tabName], tabName);
	}


	//yeni seçilen tab scrolltop 0 olsun
	var p = $tab.position();
	if(p && p.top < 0) {
		var mainTab = $(".csc-main-tab .csc-tab-panels-section")[0];
		if(mainTab) {
			var st = mainTab.scrollTop;
			mainTab.scrollTop = st + p.top;
		}
	}
};

BC.prototype.closeAllTabs = function () {
	for(var memberName in this.bf.members) {
		var memConfig = this.bf.members[memberName].getConfig();
		var closable = (memConfig.layoutConfig && memConfig.layoutConfig.closable !== undefined) ? memConfig.layoutConfig.closable : this.config.closable;
		if(closable) {
			this.bf.closeTab(memberName);
		}
	}
};

BC.prototype.cancel = function (eventName) {
	this.cancels[eventName] = true;
};

/**
 * @function close
 * @description Closes the tab whose name is given by parameter.
 * @param [tabName] Name of tab to be closed
 * @param [selectPrev] After close, selects the previous tab
 */
BC.prototype.close = function (tabName, selectPrev) {
	var bc = this, bf = bc.bf, config = bc.config, member = bf.members[tabName];
	if(inDesigner(bf)) {
		return;
	}
	bc.cancels.close = false;
	var oldSelected = config.selected;
	bf.fire("onclose", tabName);
	if(member) {
		member.fire("onclose");
	}
	if(bc.cancels.close) {
		return;
	}
	var selectedChanged = false;
	if(oldSelected != config.selected){
		selectedChanged = true;
	}
	//tab panel kapatıldığında tab panele ait popuplarıda kapat
	var panelsDiv = $$.getChildHasClass($$.byid(config.id), "csc-tab-panels-section");
		var $$popupDivs = $$.getChildsHasAttr(panelsDiv, "rel", tabName + "-popup");
	for(var i = 0; i < $$popupDivs.length; i++) {
		var popupid = $$popupDivs[i].getAttribute("popupid");
		if(popupid) {
			var popup = CSPopupContext.getPopup(popupid);
			if(popup) {
				popup.p.close();
			}
		}
	}

	if(!selectedChanged){
	var previus = null, noPrevius = false;
	for(var memberName in bf.members) {
		var member = bf.members[memberName];
		if(member.bcRef.typeName == "CSC-POPUP") {
			continue;
		}
		if(memberName == tabName) {
			if(previus) {
				break;
			}
			noPrevius = true;
			continue;
		}
		if(member.isVisible(false)){
			previus = memberName;
			if(noPrevius) {
				break;
			}
		}
	}
	}

	bf.removeMember(tabName);
	bc.renderMap[tabName] = null;
	if(config.selected == tabName) {
		config.selected = undefined;
	}

	if(previus && !selectedChanged && selectPrev !== false) {
		bc.selectTab(previus);
	}
};

/**
 * @function closeTab
 * @description Deprecated, use close method
 * @param [tabName]
 * @param [selectPrev]
 */
BC.prototype.closeTab = function (tabName, selectPrev) {
	this.close(tabName, selectPrev);
};


//keys anasayfa için eklendi
BC.prototype.accordion = function (tabName, open, width) {
	var $$tab = $$.byid(this.config.id);
	var panelsDiv = $$.getChildHasClass($$tab, "csc-tab-panels-section");
	if(!this.renderMap[tabName]) {
		this.appendNewMember(this.bf.members[tabName], tabName, false, true);
	}

	var toAccDiv = $$.getChildHasAttr(panelsDiv, "rel", tabName);
	toAccDiv.style.width = width + "px";
	if(open) {
		$$.rmClass(toAccDiv, "csc-tab-panel-hide");
		$$.addClass(toAccDiv, "csc-tab-panel-show");
	} else {
		$$.rmClass(toAccDiv, "csc-tab-panel-show");
		$$.addClass(toAccDiv, "csc-tab-panel-hide");
	}
};


var preselectedFace = "";
var sens = 300;
var rotateDuration = 1400;
var toggleDuration = 400;
BC.prototype.renderCube2_1 = function (members) {
	var _this = this;
	var $tabDiv = $("#" + this.config.id);
	var $panelsDiv = $("#" + this.config.id).children(".csc-tab-panels-section");
	if($panelsDiv.length === 0) {
		$panelsDiv = $("<div>").addClass("csc-tab-panels-section");
		$tabDiv.append($panelsDiv);
	}

	var $tabPanelDiv = $("<div>").attr("id", this.config.id + "-tab-panel");

	var $cube2ContainerDiv = $("<div>").attr("id", this.config.id + "-cube2-container").addClass("cube2-container");
	var $cube2 = $("<div>").attr("id", "cube2").addClass("cube2").addClass("show-front");
	$cube2ContainerDiv.append($cube2);
	$panelsDiv.append($cube2ContainerDiv);
	$panelsDiv.append($tabPanelDiv);

	$cube2ContainerDiv.hide();

	var i = 0;
	// tabları çiz (max 3)
	for(var memberName in members) {
		if(i < 3) {
			var member = members[memberName];

			var $tabPanelDiv = $("<div>").addClass("csc-tab-panel").attr("rel", memberName);
			$tabPanelDiv.addClass("csc-tab-panel-show");

			if(i === 0) {
				var $leftFaceDiv = $("<div>").attr("id", this.config.id + "-left-face").addClass("cube2-left-face").addClass("face left");
				$leftFaceDiv.append($tabPanelDiv);
				$cube2.append($leftFaceDiv);
			} else if(i == 1) {
				var $frontFaceDiv = $("<div>").attr("id", this.config.id + "-front-face").addClass("cube2-front-face").addClass("face front");
				$frontFaceDiv.append($tabPanelDiv);
				$cube2.append($frontFaceDiv);
			} else if(i == 2) {
				var $rightFaceDiv = $("<div>").attr("id", this.config.id + "-right-face").addClass("cube2-right-face").addClass("face right");
				$rightFaceDiv.append($tabPanelDiv);
				$cube2.append($rightFaceDiv);
			}

			BFEngine.render(member, $tabPanelDiv[0]);
		} else {
			break;
		}
		i++;
	}

	this.selectCubeFaceAsTab("front");
};

BC.prototype.selectCubeFaceAsTab = function (face) {
	var $tabPanel = $("#" + this.config.id + "-tab-panel");
	var $frontFace = $("#" + this.config.id + "-front-face");
	var $leftFace = $("#" + this.config.id + "-left-face");
	var $rightFace = $("#" + this.config.id + "-right-face");

	var selectedTabPanel = null;

	if(face == "front") {
		selectedTabPanel = $frontFace.children();
		$tabPanel.html("").append($frontFace.children());
	} else if(face == "left") {
		selectedTabPanel = $leftFace.children();
		$tabPanel.html("").append($leftFace.children());
	} else if(face == "right") {
		selectedTabPanel = $rightFace.children();
		$tabPanel.html("").append($rightFace.children());
	}

	var memberName = selectedTabPanel.attr("rel");
	this.bf.members[memberName].fire("selected", undefined, true);

	preselectedFace = face;
};

BC.prototype.rotateCube2 = function (direction) {
	var _this = this;
	var $tabPanel = $("#" + this.config.id + "-tab-panel");
	var $cubeContainer = $("#" + this.config.id + "-cube2-container");
	var $frontFace = $("#" + this.config.id + "-front-face");
	var $leftFace = $("#" + this.config.id + "-left-face");
	var $rightFace = $("#" + this.config.id + "-right-face");
	var $cube2 = $("#cube2");

	var cubeVisible = $cubeContainer.is(":visible");
	if(cubeVisible) {
		return;
	}


	var cls = "";
	var selectedFace = "";
	if(direction == "left") {
		if(preselectedFace == "front") {
			cls = "show-left";
			selectedFace = "left";
		} else if(preselectedFace == "right") {
			cls = "show-front";
			selectedFace = "front";
		}
	} else if(direction == "right") {
		if(preselectedFace == "front") {
			cls = "show-right";
			selectedFace = "right";
		} else if(preselectedFace == "left") {
			cls = "show-front";
			selectedFace = "front";
		}
	}
	if(cls) {

		// tabpanel de duran küpün yüzünü tekrar küpe koy
		if(preselectedFace == "front") {
			$frontFace.html("").append($tabPanel.children());
		} else if(preselectedFace == "left") {
			$leftFace.html("").append($tabPanel.children());
		} else if(preselectedFace == "right") {
			$rightFace.html("").append($tabPanel.children());
		}
		$tabPanel.hide();

		var mainTab = SIDENavigator.getMainTab();
		if(mainTab) {
			$("#" + mainTab.getConfig().id + "> .csc-tab-panels-section").css("overflow-y", "visible");
		}

		$cube2.css("zoom", "0.8");

		$cubeContainer.fadeToggle(toggleDuration, "easeInQuad", function () {
			for(var mem in _this.bf.members) {
				BFEngine.DRL(_this.bf.members[mem]);
			}
			// dönder
			$cube2.removeClass().addClass(cls);
			// küçült
			// $cube2.animate({ 'zoom': 0.8 }, 400);

			// büyüt ve kapat
			setTimeout(function () {

				$cubeContainer.fadeToggle(toggleDuration, "easeInQuad", function () {
					if(mainTab) {
						$("#" + mainTab.getConfig().id + "> .csc-tab-panels-section").css("overflow-y", "auto");
					}
					_this.selectCubeFaceAsTab(selectedFace);
					$tabPanel.fadeToggle(350, "easeInQuad");
					$cube2.css("zoom", "1.0");

				});
			}, rotateDuration);
		});
	}
};

BC.prototype.addMember = function (name) {
	this.appendNewMember(this.bf.members[name], name, true);
	this.bf.fire("tabAdded", name);
};

BC.prototype.newMemberAdded = function (name) {
	this.bf.fire("tabAdded", name);
};

BC.prototype.removeMember = function (name, businessName) {
	this.renderMap[name] = undefined;
	var $$tab = $$.byid(this.config.id), $$buttonsUL = this.getButtonsUL($$tab), forceDrl, ulHeight;
	if($$tab){
		if($$buttonsUL){
			ulHeight = $$buttonsUL.offsetHeight;
			var $$li = $$buttonsUL.querySelector("li[rel='"+name+"']");
			$$.remove($$li);
			if(ulHeight - $$buttonsUL.offsetHeight != 0 ){
				forceDrl = true;
			}
		}
		var $$panelDiv = $$tab.querySelector(".csc-tab-panels-section > div[rel='" + name + "']");
		$$.remove($$panelDiv);
	}
	this.bf.fire("tabClosed", name, businessName);

	for(var i = 0; i < this.buttonMap.length; i++) {
		if(this.buttonMap[i].n == name) {
			this.buttonMap.splice(i, 1);
			break;
		}
	}

	this.reCalculateButtons($$buttonsUL);
	if(forceDrl){
		BFEngine.DRL(this.bf);
	}
	this.focusTab();
};

BC.prototype.load = function () {
	if(this.onloadcallback) {
		this.onloadcallback();
	}

	if(this.config.cubeEffect) {
		this.csCubeManager = new CSCubeManager();
		var _this = this;
		$(window).bind('keydown', function (event) {
			if(event.ctrlKey) {
				var keyCode = event.keyCode;
				if(keyCode == 13) {//enter
					event.preventDefault();
					_this.rotateCube("toggle");
				} else if(keyCode == 37) {//left
					event.preventDefault();
					_this.rotateCube("prev");
				} else if(keyCode == 38) {//up
					event.preventDefault();
					_this.rotateCube("up");
				} else if(keyCode == 39) {//right
					event.preventDefault();
					_this.rotateCube("next");
				} else if(keyCode == 40) {//down
					event.preventDefault();
					_this.rotateCube("down");
				} else if(keyCode == 27) {//escape
					event.preventDefault();
					_this.rotateCube("toggle");
				}
			}


		});
	}

	if(this.config.navigateWithShortcuts){
		var _this = this;
		$(window).bind('keydown', function (event) {
			if(!$$.width(_this.config.id)){
				return;
			}
			if(event.ctrlKey) {
				var keyCode = event.keyCode;
				if(keyCode == 37) {//left
					event.preventDefault();
					_this.selectPreviousTab();
				} else if(keyCode == 39) {//right
					event.preventDefault();
					_this.selectNextTab();
				}
			}
		});
	}
};

BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "selected") {
		var dom = byid(this.config.id);
		if(typeof dom !== "undefined" && dom !== null) {
			dom.onclick = callback;
		}
	} else if(eventName === "drop") {
		var dom = byid(this.config.id);
		if(typeof dom !== "undefined" && dom !== null) {
			dom.ondrop = callback;
		}
	} else if(eventName == "dragover") {
		var dom = byid(this.config.id);
		if(typeof dom !== "undefined" && dom !== null) {
			dom.ondragover = callback;
		}
	} else if(eventName == "onload") {
		this.onloadcallback = callback;
	}
};







})(window);
/****************************=csc-combobox.js=******************************/
(function(window, undefined) {
/* CSC-DYN-COMBOBOX
 * Seçimli ve editable kullanılmak üzere tasarlanmış combobox.
 *
 * @author mahmuty
 */
function Definition(CS) {
    this.DEFAULTS = {
        disabled: false,
        cls: "csc-combobox",
        focusable: true,
        disabledKey: "disabled"
    };

    this.BaseBF = "BASIC";
    this.METHODS = ["setOptions(items, config)", "addOptions(items, index)", "filter(filterProp, filterValue, config)", "inverseFilter(filterProp, filterValue, setNull)", "getSelectedText", "clearOptions", "focus", "setEmptyOption(flag)", "setEmptyText(text)", "getOptions()",
        "setDatasource(serviceName, parameterObj, callback)", "setRefData(refDataName, isSideRef, callback)", "changeRefData(refName, callback)",
        "sortOptions(fieldName, order)", "setDefaultValue(value)", "getSelectedOption", "setTable(name)", "selectFirstOption"];
    this.EVENTS = ["changed", "selected", "keyup(prevValue, value)", "button-click", "blur", "onfocus", "oninit(param)"];

    this.Type = function (moduleName) {
    };
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-COMBOBOX", def);
var BC = def.Type;


BC.prototype.init = function () {
    var bc = this, bf = bc.bf, config = bc.config;
    bc.inTabular = false;
    var parent = bf;
    bc.fprop = config.filterProp;

    bc.EMPTY_TEXT = "-----";
    bc.EMPTY_VALUE = config.defaultValue;

    if (config.emptyValue) {
        bc.EMPTY_TEXT = config.emptyText;
        bc.EMPTY_VALUE = config.emptyValue;
        config.defaultValue = bc.EMPTY_VALUE;
    }
    while (parent) {
        if (parent.bcRef.typeName == "CSC-POPUP") {
            break;
        }
        if (parent.$CS$.definition.isTabular) {
            bc.inTabular = true;
            break;
        }
        parent = parent.$CS$.parent;
    }
    if (bc.inTabular) {//Grid içerisinde editable combo sapıtıyor
        config.editable = false;
    }
    if (bc.inTabular && parent[bf.getMemberName()]) {
        var tabularBc = parent[bf.getMemberName()].bcRef;
        bc.tabularBc = tabularBc, tabularConfig = tabularBc.config;

        bc.options = tabularBc.options;
        bc.optionsConfig = tabularBc.optionsConfig;

        config.refDataNames = tabularConfig.refDataNames;
        config.appRefData = tabularConfig.appRefData;

        config.sortFieldName = tabularConfig.sortFieldName;
        config.sortOrder = tabularConfig.sortOrder;

        bc.fprop = tabularBc.fprop || bc.fprop;
        bc.fvalue = tabularBc.fvalue;

        bc.iprop = tabularBc.iprop || bc.iprop;
        bc.ivalue = tabularBc.ivalue;
    }

    if ((config.refDataNames || config.appRefData) && (!bc.inTabular || (bc.inTabular && parent && parent[bf.getMemberName()] && parent[bf.getMemberName()].bcRef != bc))) {
        SRefDataManager.bindUpdate(bc, config.refDataNames || config.appRefData);
    }
};

/**
 * @function setDefaultValue
 * @description Set the default value of component
 * @param [value] default value
 */
BC.prototype.setDefaultValue = function (value) {
    this.config.defaultValue = value;
}

/**
 * @function clear
 * @description Clears the value of component
 */
BC.prototype.clear = function () {
    var bc = this, config = bc.config;
    bc.setValue(config.defaultValue);
    config.text = undefined;
    config.rawvalue = undefined;//bu önemli. clear ve clearOptions çağırıldığı halde getvalue deyince rawvalue dönmemesi için.
    BFEngine.renderRequest(bc.bf);
}

/**
 * @function changeRefData
 * @description Changes the reference data of component. After change comlete callback function is called
 * @param [refName] name of reference data
 * @param {function} [callback] callback function
 */
BC.prototype.changeRefData = function (refName, callback) {
    delete this.config.refDataNames;
    delete this.config.appRefData;
    var bc = this;

    function finishOperation() {
        bc.bf.rerender();
        if (callback) {
            callback();
        }
    }

    if (!refName) {
        finishOperation();
    } else if (SRefDataManager.refData.side[refName]) {//side referans verisi mi? o zaman dinamik olarak getirmeye ihtiyaç yok
        this.config.refDataNames = refName;
        finishOperation();
    } else {
        this.config.appRefData = refName;
        SRefDataManager.requestRefData(false, [refName], finishOperation, BFEngine.getModuleName(this.bf));
    }
};

BC.prototype.createMaskDiv = function () {
    var bc = this;
    var $$dynDiv = $$.byid(bc.config.id);
    if ($$dynDiv) {//bc çizilmişse
        if (!$$.byid(bc.config.id + "-mask")) {
            var $dynDiv = $($$dynDiv);
            var offset = $dynDiv.offset();
            var width = $dynDiv.width();
            var height = $dynDiv.height();
            var cssObj = {
                width: width + 3,
                height: height + 3,
                top: offset.top - 1 + "px",
                left: offset.left + "px",
                position: "absolute",
                background: "#d0d0d0",
                textAlign: "center",
                zIndex: 1111
            };

            var $$maskDiv = $$.create("div", {id: bc.config.id + "-mask"}, ["csc-dyncombo-mask"], cssObj, $$dynDiv.parentNode);
            var $$loaderImg = $$.create("img", {src: "css/bc-style/img/ajax-loader2.gif"}, [], null, $$maskDiv);
        }
    }
};

BC.prototype.removeMaskDiv = function () {
    var bc = this;
    var $$maskDiv = $$.byid(bc.config.id + "-mask");
    if ($$maskDiv) {
        $$.remove($$maskDiv);
//		$$maskDiv.remove();
    }
};

/**
 * @function setDatasource
 * @description Set a service to fill components options with service results
 * @param [serviceName] Service name
 * @param [parameterObj] Parameters of service
 * @param [callback] Callback function (It is called after filling options finished.)
 */
BC.prototype.setDatasource = function (serviceName, parameterObj, callback) {
    var bc = this;
    bc.createMaskDiv();
    bc.config.isMasked = true;
    CSCaller.call(serviceName, parameterObj).then(function (resp) {
        bc.setOptions(resp.items);
        if (callback) {
            callback();
        }
        bc.removeMaskDiv();
        bc.config.isMasked = false;
    }).error(function () {
        CSPopupUTILS.MessageBox(SideMLManager.get("common.errorSystemAdmin"));
    });

};

/**
 * @function setRefData
 * @description Sets a reference data to component
 * @param [refDataName] Name of reference data
 * @param [isSideRef] Referans verinin Side referansı olup olmadığı
 * @param [callback] Callback function (It is called after filling options finished.)
 */
BC.prototype.setRefData = function (refDataName, isSideRef, callback) {
    var bc = this;
    if (bc.rfRequested) {
        return;//realtive ref eklendikten sonra rerender'lar dolayı içiçe tekrar tekrar bu metoda girildiği için bu kod eklendi @mahmuty
    }

    bc.createMaskDiv();
    bc.config.isMasked = true;

    var relavetiveBF = null;
    if (bc.config.relativeRefData) {
        relavetiveBF = bc.bf;
    }

    bc.rfRequested = true;
    SRefDataManager.requestRefData(isSideRef, [refDataName], function () {
        bc.rfRequested = false;
        bc.removeMaskDiv();
        bc.config.isMasked = false;
        if (isSideRef) {
            bc.config.refDataNames = refDataName;
        } else {
            bc.config.appRefData = refDataName;
        }
        bc.reRender();
        if (callback) {
            callback();
        }
    }, bc.bf.getModuleName(), relavetiveBF);

    SRefDataManager.bindUpdate(this, refDataName);
};

BC.prototype.getValue = function () {
    if (this.config.editable || this.isParentReadonly() || this.bf.isReadonly()) {
        if (this.config.editable && this.config.allowNew) {
            var $$input = $$.byid(this.config.id + "-i");
            if ($$input && $$input.value) {
                var inValue = $$input.value;
                for (var i = 0; i < this.localOptions.length; i++) {
                    var text = this.localOptions[i][1];
                    if (text == inValue) {
                        return this.localOptions[i][0];
                    }
                }
                return $$input.value;
            }
        }
        if (this.config.value === 0) {
            return 0;
        }
        return (this.config.value === undefined || this.config.value === null) ? this.EMPTY_VALUE : this.config.value;
    }
    //Non editable
    var $$dom = $$.byid(this.config.id);
    if ($$dom) {
        var value = $$dom.value;
        if (value == "") {
            value = this.config.defaultValue;
        }
        if (!this.config.emptyOption && !value && this.config.rawvalue) {
            return this.config.rawvalue;
        }
        this.config.rawvalue = undefined;// #mahmuty bu cok onemli
        this.config.value = value;
    }
    return (this.config.value === undefined || this.config.value === null) ? this.config.defaultValue : this.config.value;
};

BC.prototype.checkPassiveOption = function (value) {
    if (!this.passiveOptions) {
        return;
    }
    for (var i = 0; i < this.passiveOptions.length; i++) {
        if (this.passiveOptions[i][0] == value) {
            this.nonPassiveValue = value;
            this.localOptions.push(this.passiveOptions[i]);
            this.passiveOptions.splice(i, 1);

            var $$dom = $$.byid(this.getHtmlId());
            if ($$dom) {
                this.reRender();
            }
            return;
        }
    }
};

BC.prototype.selectFirstOption = function () {
    var bc = this;
    if (!bc.localOptions) {
        bc.prepareOptions();
    }
    if (!bc.localOptions || !bc.localOptions.length) {
        return;
    }
    bc.setValue(bc.localOptions[0][0]);
};

BC.prototype.setValue = function (value, text) {
    var bc = this, bf = bc.bf, config = bc.config, readonly = bf.isReadonly();
    if (value !== null && typeof value == "object") {
        bc.checkPassiveOption(value.value);
        config.value = value.value;
        config.text = value.text;
    } else {
        bc.checkPassiveOption(value);
        config.value = value;
        if (value === undefined || value === null) {
            config.text = (readonly ? config.roEmptyText : null) || config.emptyText || bc.EMPTY_TEXT;
        } else {
            config.text = bc.getText(value);
        }
    }

    if (readonly) {
        var $$span = $$.byid(config.id + "-s");
        if ($$span) {
            $$span.innerHTML = config.text;
        }
    } else {
        if (config.editable) {
            var $$input = $$.byid(config.id + "-i");
            if ($$input) {
                if (!value && config.placeholder) {
                    $$input.value = "";
                } else {
                    $$input.value = config.text;
                }
                $$input.setAttribute("title", config.text);
            }
        } else {
            if (value === null || value === undefined) {
                value = "";
            }
            var $$select = $$.byid(config.id);
            if ($$select) {
                config.rawvalue = undefined;
                if (config.emptyOption !== false || (value !== undefined && value !== null && value !== "")) {
                    $$select.value = value;
                }
                var domValue = $$select.value;
                if (domValue !== value) {
                    config.rawvalue = value;
                }
            }
        }
    }

    if (getSideDefaults("support-changed-event-on-setvalue")) {
        bf.fire("changed");
    }
};

BC.prototype.saveState = function () {
    if (this.config.editable || this.isParentReadonly() || this.bf.isReadonly()) {
        return;
    }
    var value = this.getValue();
    if (value == this.EMPTY_VALUE && value !== 0 && this.config.rawvalue !== undefined) {
        this.config.value = this.config.rawvalue;
    } else {
        this.config.value = value;
    }
};

BC.prototype.getText = function (value) {
    var bc = this, config = bc.config;
    if (value === undefined) {
        value = bc.getValue();
    }

    if (config.tableBFName && value && value !== "") {
        var row = config.tableBF.getRowByRowId(value);
        return row.getValue()[config.tableFilterProb];
    }

    if (!bc.localOptions) {
        bc.prepareOptions();
    }
    var loptions = bc.localOptions, val;
    for (var i = 0; loptions && i < loptions.length; i++) {
        val = loptions[i][0];
        if (val === "" && value === 0) {
            continue;
        }
        if (val == value) {
            if (val === bc.EMPTY_VALUE) {
                return bc.bf.isReadonly() ? config.roEmptyText || loptions[i][1] : loptions[i][1];
            }
            return loptions[i][1];
        }
    }
    return config.text === undefined ? (bc.bf.isReadonly() ? config.roEmptyText : null) || bc.EMPTY_TEXT : config.text;
};

BC.prototype.getSelectedText = function () {
    /**
     * @function getSelectedText
     * @description Seçilen metni getirir.
     */
    return this.getText();
};

/**
 * @function focus
 * @description Focuses the component
 */
BC.prototype.focus = function () {
    if (this.config.editable) {
        var $$input = $$.byid(this.config.id + "-i");
        if ($$input) {
            $$input.focus();
        }
    } else {
        $$combo = $$.byid(this.config.id);
        if ($$combo) {
            $$combo.focus();
        }
    }
};

BC.prototype.setVisible = function (flag) {
    this.config.visible = flag;
    var $$div = $$.byid(this.config.id);
    if ($$div) {
        $$div.style.display = flag ? "" : "none";
        return;
    }
    //readonly state
    var $$span = $$.byid(this.config.id + "-s");
    if ($$span) {
        $$span.style.display = flag ? "" : "none";
    }
};

BC.prototype.getHtmlId = function () {
    if (this.bf.isReadonly()) {
        return this.config.id + "-s";
    } else {
        return this.config.id;
    }
};

BC.prototype.addPassiveOption = function (value, text) {
    if (!this.passiveOptions) {
        this.passiveOptions = [];
    }
    this.passiveOptions.push([value, text]);
};

/**
 * @function sortOptions
 * @description Sorts the options asc or desc
 * @param [fieldName] Field name to be used for ordering.
 * @param {string} [order="asc"] Type of ordering. Accepted values: "desc", "asc"
 */
BC.prototype.sortOptions = function (fieldName, order) {
    this.sortFieldName = fieldName;
    this.sortOrder = order || "asc";
    this.reRender();
};

BC.prototype.sortArray = function (data) {
    var me = this;
    if (data) {
        return data.sort(function (a, b) {
            if (me.sortOrder == "desc") {
                if (typeof a[me.sortFieldName] == "string") {
                    return b[me.sortFieldName].localeCompare(a[me.sortFieldName]);
                } else {
                    if (a[me.sortFieldName] < b[me.sortFieldName]) return 1;
                    if (a[me.sortFieldName] > b[me.sortFieldName]) return -1;
                    return 0;
                }
            } else {
                if (typeof b[me.sortFieldName] == "string") {
                    return a[me.sortFieldName].localeCompare(b[me.sortFieldName]);
                } else {
                    if (a[me.sortFieldName] < b[me.sortFieldName]) return -1;
                    if (a[me.sortFieldName] > b[me.sortFieldName]) return 1;
                    return 0;
                }
            }
        });
    }
}

BC.prototype.prepareOptions = function (force) {
    if (force !== true && this.tabularBc && this.config.parentOptions) {
        if (!this.tabularBc.localOptions) {
            this.tabularBc.prepareOptions(true);
        }
        this.localOptions = this.tabularBc.localOptions;
        return;
    }
    var selectedRefDataName = (this.config.refDataNames && this.config.refDataNames != "none") ? this.config.refDataNames : this.config.appRefData;
    this.localOptions = [];
    if (this.config.emptyOption !== false) {
        this.localOptions.push([this.config.emptyValue || this.EMPTY_VALUE, this.config.emptyText || this.EMPTY_TEXT]);
    }
    if ((this.fprop && !this.fvalue) || (this.iprop && !this.ivalue)) {
        //return;
    }

    if (this.options) {

        if (this.sortFieldName) {
            this.options = this.sortArray(this.options);
        }

        for (var i = 0; i < this.options.length; i++) {
            var item = this.options[i];
            if (Array.isArray(item)) {
                if (this.fprop && Array.isArray(this.fvalue) && !isInIt(this.fvalue, item[0])) {
                    continue;
                }
                if (this.iprop && Array.isArray(this.ivalue) && isInIt(this.ivalue, item[0])) {
                    continue;
                }
                this.localOptions.push([item[0], item[1], item[2]]);
            } else if (typeof item != "object") {
                if (this.fprop && Array.isArray(this.fvalue) && !isInIt(this.fvalue, item)) {
                    continue;
                }
                if (this.iprop && Array.isArray(this.ivalue) && isInIt(this.ivalue, item)) {
                    continue;
                }
                this.localOptions.push([item, item, item]);
            } else {
                if (this.fprop) {//filter va mı?
                    if (Array.isArray(this.fvalue) && !isInIt(this.fvalue, BEANUtils.getValue(item, this.fprop))) {
                        continue;
                    }
                    if (!Array.isArray(this.fvalue) && item[this.fprop] != this.fvalue) {
                        continue;
                    }
                }
                if (this.iprop) {//inverse filter va mı?
                    if (Array.isArray(this.ivalue) && isInIt(this.ivalue, BEANUtils.getValue(item, this.iprop))) {
                        continue;
                    }
                    if (!Array.isArray(this.ivalue) && item[this.iprop] == this.ivalue) {
                        continue;
                    }
                }
                if (this.optionsConfig && this.optionsConfig.value && this.optionsConfig.text) {
                    var value = BEANUtils.getValue(item, this.optionsConfig.value),
                        text = BEANUtils.getValue(item, this.optionsConfig.text),
                        label = BEANUtils.getValue(item, this.optionsConfig.label)
                    ;

                    if ((item.aktifPasif === false || item.aktifPasif === "false") && this.nonPassiveValue !== value) {
                        this.addPassiveOption(value, text, label);
                    } else {
                        this.localOptions.push([value, text, label]);
                    }
                } else if (this.config.valueField && this.config.textField && item[this.config.valueField] !== undefined && item[this.config.textField] !== undefined) {
                    if ((item.aktifPasif === false || item.aktifPasif === "false") && this.nonPassiveValue !== item.value) {
                        this.addPassiveOption(item.value, item.text);
                    } else {
                        this.localOptions.push([item[this.config.valueField], item[this.config.textField], item[this.config.labelField]]);
                    }
                } else {
                    if ((item.aktifPasif === false || item.aktifPasif === "false") && this.nonPassiveValue !== item.value) {
                        this.addPassiveOption(item.value, item.text, item.label);
                    } else {
                        this.localOptions.push([item.value, item.text, item.label]);
                    }
                }
            }
        }
    } else if (selectedRefDataName != undefined) {
        if (!inDesigner(this.bf) && selectedRefDataName != "none") {

            var data;
            var bc = this;
            if (this.config.relativeRefData) {
                if (!bc.config.isMasked) {
                    bc.createMaskDiv();
                    bc.config.isMasked = true;
                }
                data = SRefDataManager.getData(selectedRefDataName, this.bf, function () {
                    bc.config.appRefData = selectedRefDataName;
                    bc.reRender();

                    bc.removeMaskDiv();
                    bc.config.isMasked = false;
                });
                if (!data) {
                    return;
                }
                bc.removeMaskDiv();
                bc.config.isMasked = false;
            } else {
                data = SRefDataManager.getData(selectedRefDataName);
            }

            if (this.sortFieldName) {
                data = this.sortArray(data);
            }

            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (this.fprop && this.fvalue) {
                        if (Array.isArray(this.fvalue) && !isInIt(this.fvalue, data[i][this.fprop])) {
                            continue;
                        }
                        if (!Array.isArray(this.fvalue) && data[i][this.fprop] != this.fvalue) {
                            continue;
                        }
                    }
                    if (this.iprop && this.ivalue) {
                        if (Array.isArray(this.ivalue) && isInIt(this.ivalue, data[i][this.iprop])) {
                            continue;
                        }
                        if (!Array.isArray(this.ivalue) && data[i][this.iprop] == this.ivalue) {
                            continue;
                        }
                    }
                    if (this.config.valueField && this.config.textField) {
                        if (data[i].aktifPasif === false || data[i].aktifPasif === "false") {
                            this.addPassiveOption(data[i][this.config.valueField], data[i][this.config.textField]);
                        } else {
                            this.localOptions.push([data[i][this.config.valueField], data[i][this.config.textField], data[i][this.config.labelField]]);
                        }
                    } else {
                        if ((data[i].aktifPasif === false || data[i].aktifPasif === "false") && this.nonPassiveValue !== data[i].value) {
                            this.addPassiveOption(data[i].value, data[i].text);
                        } else {
                            this.localOptions.push([data[i].value, data[i].text, data[i].label]);
                        }
                    }
                }
            }
        }
    }
};

BC.prototype.DRL = function () {
    if (this.config.editable) {
        var $$selectDiv = $$.byid(this.config.id);
        if (!$$selectDiv) {
            return;
        }
        var divWidth = $$selectDiv.offsetWidth;
        var $$img = $$.child($$selectDiv, "IMG");
        if ($$img && divWidth) {
            $$img.style.left = (divWidth - 20) + "px";
        }
    }
};

BC.prototype.render = function ($container) {
    var bc = this, bf = bc.bf, config = bc.config, readonly = bf.isReadonly();
    var $$span, $$select, $$selectDiv, $$button;

    $$.addClass($container, "csc-combobox-wrapper");
    if (readonly) {
        $$.addClass($container, "csc-combobox-readonly");
        $$span = $$.create("span", {
            "id": config.id + "-s",
            "title": config.tips
        }, ["csc-rospan", config.cssClass], config.style, $container);
    } else {
        if (config.button) {
            $$button = $$.create("INPUT", {id: config.id + "-btn", type: "button"});
            $$button.onclick = function () {
                bf.fire("button-click");
            };
        }
        if (!config.editable) {
            $$select = $$.create("select", {
                "id": config.id,
                "title": config.tips,
                "tabindex": config.tabIndex
            }, ["csc-combobox", config.cssClass], config.style);
            if (bf.isDisabled()) {
                $$select.setAttribute("disabled", "disabled");
            }
            $$select.onblur = function () {
                bf.fire("blur");
            };
            $$select.onfocus = function () {
                bf.fire("onfocus");
            };
            if (config.button) {
                $$selectDiv = $$.create("div", {"id": config.id + "-div"}, ["csc-select-div"], null, $container);
                $$selectDiv.appendChild($$select);
                $$selectDiv.appendChild($$button);
            } else {
                $container.appendChild($$select);
            }
        } else {
            $$selectDiv = $$.create("div", {"id": config.id}, ["csc-dyn-select", config.cssClass], config.style, $container);
            if (config.button) {
                $$selectDiv.appendChild($$button);
            }
        }
    }

    this.prepareOptions();//this.localOptions hazirlaniyor.   bu her seferinde yapılmalı mı?

    var bc = this;
    if (readonly) {
        $$span.style.display = this.bf.isVisible() ? "" : "none";
        if (inDesigner(this.bf)) {
            $$span.style.display = "";// Design Time da visible yap
            $$span.innerHTML = "Readonly";
        } else {
            config.text = bc.getText();
            $$span.innerHTML = config.text;
        }
        if (!config.style || !config.style.whiteSpace) {
            $$span.style.whiteSpace = "normal";
        }
        if (config.value !== undefined) {
            this.setValue(config.value, config.text);
        } else if (config.defaultValue) {
            this.setValue(config.defaultValue);
        }
    } else {
        if (!config.editable) {
            $$select.style.display = inDesigner(bf) || bf.isVisible() ? "" : "none";// Design Time da visible yap

            if (bf.isRequired()) {
                $$.addClass($$select, "csc-required");
            }
            this.renderStaticOptions($$select);
            $$select.onchange = function (e) {
                bc.config.rawvalue = undefined;
                bf.fire("changed");
                if (config.tooltipTitle) {
                    $$select.title = $$select.options[$$select.selectedIndex].text
                }
            };

            if (config.rawvalue !== undefined) {
                this.setValue(config.rawvalue);
            } else if (config.value !== undefined) {
                this.setValue(config.value);
            } else if (config.defaultValue) {
                this.setValue(config.defaultValue);
            }
        } else {
            var disabled = bf.isDisabled();
            // create combobox
            var $$input = $$.create("input", {
                "id": config.id + "-i",
                title: config.tips,
                "maxLength": config.maxLengthOfNew,
                rel3: config.id,
                "placeholder": (config.placeholder || "")
            }, "csc-dc-text", null, $$selectDiv);
            if (disabled) {
                $$input.setAttribute(config.disabledKey, config.disabledKey);
            }
            if (config.style && config.style.width) {
                $$.css($$input, "width", config.style.width);
            }
            var $$optionsDiv = $$.create("div", {"id": config.id + "-opt"}, "csc-dyn-options", null, $$selectDiv);
            if (!config.placeholder && config.emptyText) {
                $$input.value = config.emptyText;
            }

            $$.css($$selectDiv, "display", inDesigner(bf) || bf.isVisible() ? "" : "none");// Design Time da visible yap

            var divWidth = $$selectDiv.offsetWidth;
            if (!disabled) {
                var $$img = $$.create("img", {src: "css/bc-style/img/cdown.png"}, undefined, {left: (divWidth - 20) + "px"});
                $$selectDiv.appendChild($$img);
            }

            $$input.onclick = function (event) {
                bf.fire("selected", event);
            };

            if (bf.isRequired()) {
                $$.addClass($$input, "csc-required");
            }

            if (inDesigner(bf)) {
                return;
            }

            if (!disabled) {
                $$input.onfocus = function () {
                    bc.onEnter($$selectDiv, $$optionsDiv, $$input);
                    bf.fire("onfocus");
                };
                $$img.onclick = function () {
                    if (!bc.config.skipImgClickEvent) {
                        bc.onEnter($$selectDiv, $$optionsDiv, $$input);
                    }
                };
                $$input.onkeyup = function (event) {
                    if (this.maxLength === -1 || this.value.length < this.maxLength) {
                        if (event.keyCode == 38 || event.keyCode == 13 || event.keyCode == 40 || event.keyCode == 9 || event.keyCode == 16) {
                            return;
                        }
                        if (bc.onkeyup) {
                            bc.onkeyup(this.prevValue, this.value);
                        } else {
                            bc.renderDynOptions($$selectDiv, $$optionsDiv, this, "x");
                        }
                        if (this.prevValue != this.value) {
                            this.prevValue = this.value;
                        }
                    } else {
                        return;
                    }
                };

                $$selectDiv.onkeydown = function (event) {
                    if ($$optionsDiv.style.display == "none") {
                        if (event.keyCode == 40) {// asagi
                            bc.renderDynOptions($$selectDiv, $$optionsDiv, $$input, "x");
                            //$$optionsDiv.style.display = "block";
                        }
                        return;
                    }
                    var optionsUl = $$.child($$optionsDiv, "ul");
                    var selected = $$.getChildsHasClass(optionsUl, "csc-dc-selected")[0];
                    var toSelect = null;
                    if (event.keyCode == 40) {// asagi
                        if (window.getComputedStyle($$optionsDiv).display == "none") {
                            $$optionsDiv.style.display = "block";
                        }
                        if (selected) {
                            toSelect = $$.next(selected);
                        } else {
                            toSelect = $$.child(optionsUl, "li");
                        }
                    } else if (event.keyCode == 38) {// yukari
                        if (selected) {
                            toSelect = $$.prev(selected);
                        }
                    } else if (event.keyCode == 13) {// enter
                        if (selected) {
                            var val = selected.getAttribute("rel");
                            bc.selectOption($$selectDiv, $$optionsDiv, selected, val);
                        }
                        return;
                    }
                    if (selected && toSelect) {
                        $$.rmClass(selected, "csc-dc-selected");
                        $$.addClass(toSelect, "csc-dc-selected");
                    } else if (toSelect) {
                        $$.addClass(toSelect, "csc-dc-selected");
                    }
                };
            }
            if (config.value !== undefined) {
                this.setValue(config.value);
            }
        }
    }
    this.applyAddedClasses();// Apply css classes added by user

    if (config.isMasked) {
        bc.createMaskDiv();
    }
    if (config.tooltipTitle) {
        $$select.title = $$select.options[$$select.selectedIndex].text
    }
};

var dynComboClickObj = {
    bc: undefined,
    handler: function (event, bcid) {
        if (!dynComboClickObj.bc) {
            return;
        }
        if (event && event.target && event.target.getAttribute("rel3") == dynComboClickObj.bc.config.id) {
            return;
        }
        if (bcid === dynComboClickObj.bc.config.id) {
            return;
        }
        var bc = dynComboClickObj.bc;
        document.body.removeEventListener("click", dynComboClickObj.handler, true);

        var $$selectDiv = $$.byid(bc.config.id);
        if (!$$selectDiv) {
            return;
        }
        var $$input = $$.byid(bc.config.id + "-i");
        var $$optionsDiv = $$.byid(bc.config.id + "-opt");
        if ($$optionsDiv) {
            $$optionsDiv.style.display = "none";
            $$optionsDiv.style.zIndex = "";
        }
        $$selectDiv.style.zIndex = "";
        if (!$$input) {
            return;
        }

        var bcvalue = bc.config.value;
        var bctext = $$input.value;
        for (var i = 0; i < bc.localOptions.length; i++) {
            var val = bc.localOptions[i][0];
            var text = bc.localOptions[i][1];
            if (text == bctext && val == bcvalue) {
                return;
            }
        }
        if (bc.config.allowNew !== true) {
            $$input.value = "";
            bc.config.value = undefined;
            bc.config.text = "";
        } else {
            bc.config.value = $$input.value;
            bc.config.text = $$input.value;
        }

        bc.config.skipImgClickEvent = true;
        setTimeout(function () {
            bc.config.skipImgClickEvent = false;
        }, 100);
    }

};

BC.prototype.renderStaticOptions = function ($$select) {
    if ($$.isie9()) {
        //var optLabel=$$.create("optgroup", {label:"deneme"},null,null);
        for (var i = 0; i < this.localOptions.length; i++) {
            var opt = document.createElement('option');
            var value = this.localOptions[i][0];
            if (value === undefined || value === null) {
                value = "";
            }

            opt.value = value;
            opt.text = this.localOptions[i][1];
            //optLabel.appendChild(opt)
            $$select.options.add(opt);
        }
        //$$select.appendChild(optLabel);
    } else {
        var optionStr = "";
        labelgroup = null;
        var optLabel = null;
        for (var i = 0; i < this.localOptions.length; i++) {
            if (this.localOptions[i][2] && typeof this.localOptions[i][2] != "object")  {
                if (labelgroup != this.localOptions[i][2]) {
                    labelgroup = this.localOptions[i][2];
                    if (this.labeGroup) {
                        optLabel = $$.create("optgroup", {label: this.labeGroup[this.localOptions[i][2]]}, null, null);
                    } else {
                        optLabel = $$.create("optgroup", {label: this.localOptions[i][2]}, null, null);
                    }
                    $$select.appendChild(optLabel);
                }
                var value = this.localOptions[i][0];
                if (value === undefined || value === null) {
                    value = "";
                }
                var text = this.localOptions[i][1];
                if (typeof text == "string" && text.indexOf("<") >= 0) {
                    text = text.replace("<", "&#060;");
                }
                if (typeof value == "string" && value.indexOf("'") >= 0) {
                    value = value.replace(/'/g, "&#39;")
                }

                var opt = document.createElement('option');
                opt.value = value;
                opt.text = text;
                optLabel.appendChild(opt);

                optionStr += "<option value='" + value + "'>" + text + "</option>";
            }
            else {
                    var value = this.localOptions[i][0];
                    if (value === undefined || value === null) {
                        value = "";
                    }
                    var text = this.localOptions[i][1];
                    if (typeof text == "string" && text.indexOf("<") >= 0) {
                        text = text.replace("<", "&#060;");
                    }
                    if (typeof value == "string" && value.indexOf("'") >= 0) {
                        value = value.replace(/'/g, "&#39;")
                    }
                    var opt = document.createElement('option');
                    opt.value = value;
                    opt.text = text;
                    $$select.appendChild(opt);

                optionStr += "<option value='" + value + "'>" + text + "</option>";
            }

        }
        //$$select.innerHTML = optionStr;
    }
};

/**
 * @function setTable
 * @description Comboda liste olarak başka bir tabloyu kullanabilmeyi sağlar. Seçim yapıldığında value: seçilen satırın rowID'si, text: seçilen satırın filtreleme yapılan sütundaki değeridir.
 * @param [name] Tablonun bulunduğu bileşen adı. Table layout olmalıdır. Modül ismiyle birlikte verilmedir. Örnek: "test.RG_TABLO"
 * @param [filterProb] Filtreleme yapılması istenilen sütun ismini alır. Bu isim table layout içerisindeki bileşen adıdır.
 */
BC.prototype.setTable = function (name, filterProb) {
    this.config.tableBFName = name;
    this.config.tableFilterProb = filterProb;
}

BC.prototype.renderDynOptions = function ($$selectDiv, $$optionsDiv, $$input, doFilter) {
    if (!$$optionsDiv) {
        $$optionsDiv = $$.byid(this.config.id + "-opt");
        if (!$$optionsDiv) {
            return;
        }
    }
    if (dynComboClickObj.bc) {
        dynComboClickObj.handler(null, this.config.id);
    }

    dynComboClickObj.bc = this;
    dynComboClickObj.handler(null, this.config.id);
    document.body.removeEventListener("click", dynComboClickObj.handler, true);
    document.body.addEventListener("click", dynComboClickObj.handler, true);

    $$selectDiv.style.overflow = "hidden";
    $$optionsDiv.style.visibility = "hidden";
    $$optionsDiv.style.width = "1000px";
    $$optionsDiv.style.display = "block";
    var bc = this;

    var str = SIDEString.turkishToUpperCase($$input.value).replace("\\", "").replace("*", "\\*");
    var regex;
    try {
        regex = $$input.value ? new RegExp(str) : null;
    } catch (ex) {
        regex = new RegExp("--------xx");//geçmeyecek bir regex
    }

    if (this.config.tableBFName) {
        SIDENavigator.renderToDiv($$optionsDiv, this.config.tableBFName, {
            onload: function (bf) {
                if (doFilter && regex) {
                    bf.filter([{value: $$input.value, "type": "like", name: "name"}]);
                }
                if (bf.getConfig().style.width) {
                    $$optionsDiv.style.overflowX = "hidden";
                    var width = bf.getConfig().style.width;
                    $$optionsDiv.style.width = width.indexOf("px") === -1 ? width + "px" : width;
                }
                bc.config.tableBF = bf;
            }
        });

        $$optionsDiv.onclick = function () {
            if (bc.config.tableBFName && bc.config.tableBF) {
                var text = bc.config.tableBF.getSelectedRowValues(bc.config.tableFilterProb)[0];
                var rowId = bc.config.tableBF.getSelectedRows()[0].getRowId();
                bc.selectOption($$selectDiv, $$optionsDiv, text, rowId);
            }
        }
    } else {
        $$optionsDiv.onscroll = function () {
            bc.liclick = true;
        };
        var $$optionsUl = $$.child($$optionsDiv, "ul");
        var $$selectDiv = $$.byid(this.config.id);
        $$optionsUl.innerHTML = "";
        var maxWidth = $$selectDiv.offsetWidth;
        for (var i = 0; i < this.localOptions.length; i++) {
            var val = this.localOptions[i][0];
            var text = this.localOptions[i][1];
            try {
                if (doFilter && regex && !regex.test(SIDEString.turkishToUpperCase(text))) {
                    continue;
                }
            } catch (ex) {
                continue;
            }
            var $$li = $$.create("li", {rel: val, rel2: text, rel3: "dc"});
            var $$span = $$.create("span", {rel3: "dc"});
            $$span.innerHTML = this.localOptions[i][1];

            $$optionsUl.appendChild($$li);
            $$li.appendChild($$span);
            $$li.onclick = function (e) {
                e.stopPropagation();
                bc.selectOption($$selectDiv, $$optionsDiv, this, this.getAttribute("rel"));
            };
            if ($$span.offsetWidth > maxWidth) {
                maxWidth = $$span.offsetWidth;
            }
        }
    }

    if (maxWidth == $$selectDiv.offsetWidth) {
        $$optionsDiv.style.width = (maxWidth) + "px";
    } else {
        $$optionsDiv.style.width = (maxWidth + 20) + "px";
    }
    $$optionsDiv.style.visibility = "";
    $$selectDiv.style.overflow = "";
};

//Click ile yada tab ile dyncombo'ya girildiğinde componenti hazirlayan metod
BC.prototype.onEnter = function ($$selectDiv, $$optionsDiv, $$input) {
    var bc = this;

    $$input.onblur = function () {
        if (bc.blurHandled) {
            bc.blurHandled = false;
            return;
        }
        window.setTimeout(function () {
            $$optionsDiv.style.display = "none";
            $$optionsDiv.style.zIndex = "";
            $$selectDiv.style.zIndex = "";

            var bcvalue = bc.config.value;
            var $$input = $$.byid(bc.config.id + "-i");
            if (!$$input) {
                return;
            }
            var bctext = stringTrim($$input.value);
            if (bc.config.tableBFName) {
                return;
            } else {
                for (var i = 0; i < bc.localOptions.length; i++) {
                    var val = bc.localOptions[i][0];
                    var text = stringTrim(bc.localOptions[i][1]);
                    if (text == bctext) {
                        bc.config.value = val;
                        return;
                    }
                }
            }
            if (bc.config.allowNew !== true) {
                $$input.value = "";
                bc.config.value = undefined;
                bc.config.text = "";
            }
            document.body.removeEventListener("click", dynComboClickObj.handler, true);
            bc.bf.fire("blur");
        }, 200);
    };

    $$optionsDiv.innerHTML = "";
    $$selectDiv.style.zIndex = CSPopupContext.newZindex();

    $$optionsDiv.style.top = $$selectDiv.offsetHeight + "px";

    var $$optionsUl = $$.create("ul");
    $$optionsDiv.appendChild($$optionsUl);

    this.renderDynOptions($$selectDiv, $$optionsDiv, $$input);
};

BC.prototype.selectOption = function ($$selectDiv, $$optionsDiv, $$li, value) {
    if (typeof $$li === "string") {
        var text = $$li;
    } else {
        var text = $$li.getAttribute("rel2");
    }
    this.config.value = value;
    this.config.text = text;
    var $$input = $$.byid(this.config.id + "-i");
    $$input.value = text;
    $$input.setAttribute("title", text);

    $$optionsDiv.style.display = "none";
    this.blurHandled = true;
    this.bf.fire("blur");

    //changed evntinde başka bir elemana focus yapılırsa click eventi o elemanda da çalışıyor
    //o yüzden timeout konuldu #mahmuty 27/11/2014
    var bc = this;
    window.setTimeout(function () {
        bc.bf.fire("changed");
    }, 10);
};

/**
 * @function setOptions
 * @description Combobox'a seçeneklerin verilmesini sağlar.
 *
 * @param [items] dizi olmalı. <br/>
 * @example En basit kullanımı: ["Erkek","Kadın"] yada [1920, 2000, 2021] Bu kullanımda value ve text alanlarının değerleri aynıdır. <br/>
 * Dizi içeriği dizi olabilir: [[1,"Erkek"], [2,"Kadın"]] Bu kullanımda iç dizide ilk eleman value alanının, ikinci eleman ise text alanının içeriğidir. <br/>
 * Dizi içeriği nesne olabilir (value ve text isimleri sabit): [{value: "1", text: "Erkek"},{value:"2", text: "Kadın"}} <br/>
 * Dizi içeriği nesne olabilir (value ve text isimleri config ile verilir): items => [{plaka: "06", adi: "Ankara"},{value:"01", adi: "Adana"}], config=> {value: "plaka", text: "adi"}
 *
 * @param [config] items parametresi nesne dizisi olduğunda ve nesnelerin value ve text alanları standart dışı olduğunda hangi alanın value alanı hangi alanın text alan olarak kullanılabileceğini belirtir.<br/>
 * @example items=> [{plaka: "06", adi: "Ankara"},{value:"01", adi: "Adana"}]  config=> {value: "plaka", text: "adi"}
 */
BC.prototype.setOptions = function (items, config, labelGroup) {
    if (!Array.isArray(items)) {
        return;
    }
    this.options = items;
    this.optionsConfig = config;
    this.labeGroup = labelGroup;
    if (this.inTabular) {
        this.config.parentOptions = false;
    }
    this.prepareOptions(true);
    if (this.config.editable) {
        var $$optionsDiv = $$.byid(this.config.id + "-opt");
        var $$input = $$.byid(this.config.id + "-i");
        if ($$optionsDiv && window.getComputedStyle($$optionsDiv).display != "none") {
            var $$selectDiv = $$.byid(this.config.id);
            this.renderDynOptions($$selectDiv, $$optionsDiv, $$input, false);
        }
        if (this.config.value !== undefined && document.activeElement != $$input) {
            this.setValue(this.config.value);
        }
    } else {
        this.reRender();
    }
};

BC.prototype.addOptions = function (items, index) {
    if (!Array.isArray(items)) {
        items = [items];
    }
    if (!this.options) {
        this.options = [];
    }
    if (index !== undefined) {
        var op2 = this.options.splice(index, this.options.length - index);
        this.options = this.options.concat(items, op2);
    } else {
        this.options = this.options.concat(items);
    }
    this.prepareOptions();
    this.reRender();

};

/**
 * @function getOptions
 * @description Combobox'taki verileri dizi halinde getirir.
 * @param [full] dizinin içinde bütün nesnenin mi olacağı yoksa sadece text,value ikilisinin mi olacağı.
 */
BC.prototype.getOptions = function (full) {
    if (this.config.tableBFName) {
        if (this.config.tableBF) {
            return this.config.tableBF.getValue();
        }
        return;
    }

    if (this.options) {
        return this.options ? this.options.slice() : this.options;
    }
    var result = [];
    if (!this.localOptions) {
        this.prepareOptions();
    }
    if (this.localOptions) {
        var valueField = this.config.valueField || "value", textField = this.config.textField || "text";
        var selectedRefDataName = (this.config.refDataNames && this.config.refDataNames != "none") ? this.config.refDataNames : this.config.appRefData;
        var data = this.config.relativeRefData ? SRefDataManager.getData(selectedRefDataName, this.bf) : SRefDataManager.getData(selectedRefDataName);
        for (var i = 0; i < this.localOptions.length; i++) {
            for (var j = 0; data && j < data.length; j++) {
                var value = BEANUtils.getValue(data[j], valueField);
                var text = BEANUtils.getValue(data[j], textField);
                if ((this.localOptions[i][0] === value) && (this.localOptions[i][1] === text)) {
                    if (full) {
                        result.push(data[j]);//TODO mahmuty klonlamak gerekebilir
                    } else {
                        result.push({value: value, text: text});
                    }
                    break;
                }
            }
        }
    }
    return result;
};

/**
 * @function getSelectedOption
 * @description Seçilen seçeneği döner. Eğer seçenekler setOptions metodu ile verilmiş ise verildiği şekliyle dönülür.<br/>
 * Eğer seçenekler referans veri olarak verilmişse seçilen seçenek [value, text] şeklinde dizi olarak dönülür.
 * Eğer setTable kullanılmışsa tablodaki satır nesnesi dönülür.
 */
BC.prototype.getSelectedOption = function () {
    var value = this.getValue();

    if (this.config.tableBFName && value && value !== "") {
        return this.config.tableBF.getRowByRowId(value);
    }

    if (this.options) {
        for (var i = 0; i < this.options.length; i++) {
            var item = this.options[i];
            if (Array.isArray(item)) {
                if (value === "" && item[0] === 0) {
                    continue;
                }
                if (item[0] == value) {
                    return item;
                }
            } else if (typeof item != "object") {
                if (value === "" && item === 0) {
                    continue;
                }
                if (value == item) {
                    return item;
                }
            } else {
                if (this.optionsConfig && this.optionsConfig.value) {
                    var beanValue = BEANUtils.getValue(item, this.optionsConfig.value);
                    if (value === "" && beanValue === 0) {
                        continue;
                    }
                    if (beanValue == value) {
                        return item;
                    }
                } else {
                    if (value === "" && item.value === 0) {
                        continue;
                    }
                    if (item.value == value) {
                        return item;
                    }
                }
            }
        }
    } else {//options yok
        var selectedRefDataName = (this.config.refDataNames && this.config.refDataNames != "none") ? this.config.refDataNames : this.config.appRefData;
        var data = this.config.relativeRefData ? SRefDataManager.getData(selectedRefDataName, this.bf) : SRefDataManager.getData(selectedRefDataName);
        if (data) {
            var valueField = this.config.valueField || "value";
            for (var i = 0; i < data.length; i++) {
                if (data[i][valueField] == value) {
                    return data[i];
                }
            }
        }
    }
};

/**
 * @function clearOptions
 * @description Clears the options of component.
 */
BC.prototype.clearOptions = function () {
    this.setOptions([]);
};

/**
 * @function setEmptyOption
 * @description Combobox'ta hiçbir şey seçili olmadığında bir değer ayarlanıp ayarlanmayacağına karar verir.
 * @param [flag] true olursa combobox'ta hiçbir şey seçili değilken varsayılan değeri olacaktır.
 */
BC.prototype.setEmptyOption = function (flag) {
    if (flag === undefined) {
        flag = true;
    }
    this.config.emptyOption = flag;
    this.reRender();
};

/**
 * @function setEmptyText
 * @description Combobox'ta hiçbir şey seçili olmadığında ayarlanacak varsayılan değeri belirler.
 * @param [text] Ayarlanacak varsayılan değerin metni
 * @param [value] Ayarlanacak varsayılan değer
 */
BC.prototype.setEmptyText = function (text, value) {
    this.config.emptyText = text;
    if (value !== undefined) {
        this.config.emptyValue = value;
    }
    this.reRender();
};

/**
 * @function filter
 * @description Combo'daki seçenekleri filtreler. Örnek:
 * @example combo.filter("ilKodu", "06");//Sadece ilkodu değeri "06" olan seçenekler görüntülenir.
 * combo.filter("ilKodu", ["06","07","08"]);//Sadece ilkodu değeri "06", "07" yada "08" olan seçenekler görüntülenir.
 * combo.filter(["06"]);//Sadece ilkodu değeri "06" olan seçenekler görüntülenir. (İl Kodu alanı "Filter Field" özelliğinde verildiği varsayılmıştır)
 * @param [filterProp] filtrelemenin hangi alana göre yapılacağını belirler. Bu alan verilmediğinde "Filter Field" özelliğinde verilmiş olan kullanılır.<br/>
 * @param [filterValue] filtreleme kullanılacak değerleri belirleyen parametredir
 * @param [config] setNull true verildiğinde filtreleme işleminden sonra combonun değerini temizlemiyi sağlar.
 */
BC.prototype.filter = function (filterProp, filterValue, config) {
    var disableFilterInverseFilter = BCDefaults.get("CSC-COMBOBOX", "allowMultipleFilter", false, this.bf.getModuleName());

    if (disableFilterInverseFilter) {
        this.iprop = null;
        this.ivalue = null;
    }

    if ((typeof config === "boolean" && config == true) || (config && config.setNull === true)) {
        this.setValue(null);
    }
    if (filterValue === undefined) {
        this.fprop = this.config.filterProp;
        filterValue = filterProp;
    } else {
        this.fprop = filterProp;
    }
    this.fvalue = filterValue;

    if (config && config.forcePrepareOptions) {
        this.prepareOptions();
    }

    this.reRender();
};

/**
 * @function inverseFilter
 * @description Combo'daki seçenekleri ters filtreler, yani paramtre ile verilen değerler dışındaki seçenekler gösterilir.
 * @example combo.filter("ilKodu", "06");//ilkodu değeri "06" olmayan seçenekler görüntülenir.<br/>
 * combo.filter("ilKodu", ["06","07","08"]);//ilkodu değeri "06", "07" yada "08" olmayan seçenekler görüntülenir.<br/>
 * combo.filter(["06"]);//ilkodu değeri "06" olmayan seçenekler görüntülenir. ("ilkodu" alanı "Filter Field" özelliğinde verildiği varsayılmıştır)
 * @param [filterProp] def="deneme" filtrelemenin hangi alana göre yapılacağını belirler. Bu alan verilmediğinde "Filter Field" özelliğinde verilmiş olan kullanılır.
 * @param [filterValue] filtreleme kullanılacak değerleri belirleyen parametredir
 * @param [setNull] true verildiğinde filtreleme işleminden sonra combonun değerini temizlemiyi sağlar.
 */
BC.prototype.inverseFilter = function (filterProp, filterValue, setNull) {
    var disableFilterInverseFilter = BCDefaults.get("CSC-COMBOBOX", "allowMultipleFilter", false, this.bf.getModuleName());

    if (disableFilterInverseFilter) {
        this.fprop = null;
        this.fvalue = null;
    }

    if (setNull === true) {
        this.setValue(null);
    }
    if (filterValue === undefined) {
        this.iprop = this.config.filterProp;
        filterValue = filterProp;
    } else {
        this.iprop = filterProp;
    }
    this.ivalue = filterValue;
    this.reRender();
};

BC.prototype.renderRequired = function () {
    if (!this.config.validation) {
        return;
    }
    var $$dom = null;
    if (this.config.editable) {
        $$dom = $$.byid(this.config.id + "-i");
    } else {
        $$dom = $$.byid(this.config.id);
    }
    if (!$$dom) {
        return;
    }
    if (this.config.validation.req) {
        $$.addClass($$dom, "csc-required");
    } else {
        $$.rmClass($$dom, "csc-required");
    }
};

BC.prototype.destroybc = function (onlybc) {
    if (!onlybc) {
        SRefDataManager.unbindUpdate(this);
    }
}

BC.prototype.bindEvent = function (eventName, callback) {
    if (eventName == "selected") {
        if (this.config.editable) {
            var domInput = byid(this.config.id + "-i");
            if (domInput) {
                return;//input onclik'te fire var
            }
            //readonly state
            var domSpan = byid(this.config.id + "-s");
            if (domSpan) {
                domSpan.onclick = callback;
                if (!inDesigner(this.bf) && domSpan.tagName == "SPAN" && !this.bf.isDisabled()) {
                    $$.addClass(domSpan, "csc-textbox-linked");
                }
            }
        } else {
            if (this.isParentReadonly() || this.bf.isReadonly()) {
                var $$span = $$.byid(this.config.id + "-s");
                if ($$span) {
                    $$span.onclick = callback;
                    if (!inDesigner(this.bf) && !this.bf.isDisabled()) {
                        $$.addClass($$span, "csc-textbox-linked");
                    }
                }
            } else {
                var $$dom = byid(this.config.id);
                if ($$dom) {
                    $$dom.onclick = callback;
                }
            }
        }
    } else if (eventName == "keyup") {
        if (!this.config.editable) {
            return;
        }
        this.onkeyup = callback;
    }
};

})(window);
/****************************=csc-page.js=******************************/
(function(window, undefined) {
/**
 * csc-page LAYOUT
 */
function Definition(CS) {
	this.DEFAULTS = {
		cls : "csc-page",
		border : false,
		style : {
			width : "800px",
			minHeight : "40px"
		},
		layoutConfig : {
			pageLayout : "rows",
			ref : "window",
			minWidth : 800,
			minHeight : 500
		}
	};

	this.BaseBF = "CONTAINER";
	this.METHODS = [ "getDesignedWidth", "close"];
	this.EVENTS = [ "oninit(param)", "onload(param)", "selected", "onopen(param)", "onclose" ];
	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-PAGE", def);

var BC = def.Type;

var defaultMemberHeight = 100, defaultMinWidth = 250, defaultMinHeight = 40;

BC.prototype.init = function() {
	this.config.layoutConfig.minWidth = parseInt(this.config.layoutConfig.minWidth || defaultMinWidth, 10);
	this.config.layoutConfig.minHeight = parseInt(this.config.layoutConfig.minHeight || defaultMinHeight, 10);
	if (this.config.layoutConfig.pageLayout == "fixed" && !inDesigner(this.bf)) {
		var bc = this;
		//TODO destroyda aşağıda eventi unbind gerekli
		$$.bindEvent(window, "resize", function() {
			//Eğer popup açıksa birşey yapma çünkü hesap hatalarına sebep oluyor. PopupContext'in close eventinde yeniden render yap
			if(CSPopupContext.getPopups().length){
				if(bc.popupEventid){//birden fazla event bağlanmaması için
					return;
				}
				bc.popupEventid = CSPopupContext.on("close", function(){
					if(CSPopupContext.getPopups().length){//açık popup kalmışsa birşey yapma
						return;
					}
					CSPopupContext.unbind(bc.popupEventid);
					bc.popupEventid = null;
					bc.renderFixedLayout($$.byid(bc.config.id));
				});
				return;
			}
			var $$dom = $$.byid(bc.config.id);
			if($$dom){
				bc.renderFixedLayout($$dom);
			}
		});
	}
};

/**
 * @function getDesignedWidth
 * @description Tasarlanan genişliği getirir.
 */
BC.prototype.getDesignedWidth = function(){
	if (this.config.layoutConfig.width) {
		return this.config.layoutConfig.width;
	} else if (this.config.layoutConfig.minWidth) {
		return this.config.layoutConfig.minWidth;
	}
	return defaultMinWidth;
};

/**
 * @functon close
 * @description Closes the page that is opened as popup or opened in a tab panel or an accordion panel.
 */
BC.prototype.close = function(){
	var parent = this.bf.getParent();
	if(parent && typeof parent.close == "function"){
		parent.close(this.bf.getMemberName());
	}
};

BC.prototype.setTitle = function(title){
	this.config.title = title;
	var parent = this.bf.$CS$.parent;
	if(parent && parent.bcRef.typeName == "CSC-POPUP"){
		parent.setTitle(title);
	}
};

BC.prototype.DRL = function(){
	var bc=this, config=bc.config;
	if (config.layoutConfig.pageLayout == "fixed" && !inDesigner(bc.bf)) {
		var $$dom = $$.byid(config.id);
		if($$dom){
			bc.renderFixedLayout($$dom);
		}
	}
};

BC.prototype.renderFixedLayout = function($$div) {
	if(!$$div){
		return;
	}
	if (inDesigner(this.bf)) {
		var mainDef = NDefDesigner.getMainDef();
		if (!mainDef) {
			return;
		}
	}
	var bf = this.bf;

	if (!this.config.layoutConfig.minWidth || this.config.layoutConfig.minWidth < 100) {
		this.config.layoutConfig.minWidth = defaultMinWidth;
	}
	if (!this.config.layoutConfig.minHeight || this.config.layoutConfig.minHeight < 100) {
		this.config.layoutConfig.minHeight = defaultMinHeight;
	}
	var width = this.config.layoutConfig.minWidth + "px", height = this.config.layoutConfig.minHeight;
	var winWidth = 0, winHeight = 0;
	if (this.config.layoutConfig.ref == "window") {
		if (!inDesigner(this.bf)) {
			winWidth = $$.innerWidth(window);
			winHeight = $$.innerHeight(window) - (this.config.layoutConfig && this.config.layoutConfig.ignoreScrollSize ? 0 : 12);//scroll için 12
		} else {
			var mainDef = NDefDesigner.getMainDef();
			winWidth = mainDef.designerConfig.width;
			winHeight = mainDef.designerConfig.height;
		}
		if (winWidth > this.config.layoutConfig.minWidth) {
			width = "100%";
		}
		if (winHeight > this.config.layoutConfig.minHeight) {
			height = winHeight;
		}
	} else {
		width = this.config.layoutConfig.minWidth + "px";
		height = this.config.layoutConfig.minHeight;
		var $$parent = $$div.parentNode;
		var conHeight = $$.innerHeight($$parent), conWidth = $$.innerWidth($$parent);
		if(conHeight > height){
			height = conHeight;
		}
		if(conWidth > this.config.layoutConfig.minWidth){
			width = conWidth;
		}
	}
	$$.css($$div, {
		width : width,
	});
	var topTotal = 0, bottomTotal = 0, middle = undefined, bottoms = [];
	for ( var memberName in bf.members) {
		var member = bf.members[memberName];
		if (member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if (member.bcRef.typeName == "CSC-PAGE-BOX") {
			var $$warn = $$.create("DIV");
			$$warn.innerHTML = "PAGEBOX layout is no longer supported.";
			$$div.appendChild($$warn);
			continue;
		}
		if (!inDesigner(this.bf) && !member.hasVisibleItem()) {
			continue;
		}
		var memConfig = this.getMemberConfig(member);
		var $$memberDiv = $$.byid(this.config.id + "-" + memberName);
		var rerender = false;
		if (!$$memberDiv) {
			$$memberDiv = $$.create("DIV", {"id": this.config.id + "-" + memberName});
			rerender = true;
		}
		if (memConfig.layoutConfig.placement == "top") {
			var memHeight = memConfig.layoutConfig.height || defaultMemberHeight;
			$$.css($$memberDiv, {
				width : width,
				height : memHeight + "px",
				overflow : memConfig.layoutConfig.overflow || "auto"
			});
			topTotal += parseInt(memHeight, 10);
		} else if (memConfig.layoutConfig.placement == "bottom") {
			bottoms.push(memberName);
			var memHeight = memConfig.layoutConfig.height || defaultMemberHeight;
			bottomTotal += parseInt(memHeight, 10);
			rerender = false;
		} else {// placement ise middle
			if (middle) {
				console.error(memberName + "will not be rendered. Only one middle can be render.");
				continue;
			}
			middle = memberName;
			rerender = false;
		}
		if (rerender) {
			$$div.appendChild($$memberDiv);
			BFEngine.render(member, $$memberDiv);
		} else {
			BFEngine.DRL(member);
		}
	}
	if (middle) {// middle en son çizilmeli (bottomTotal ve topTotal tam olarak belli olmalı)
		var $$memberDiv = $$.byid(this.config.id + "-" + middle);
		var rerender = false;
		if (!$$memberDiv) {
			$$memberDiv = $$.create("DIV", {"id": this.config.id + "-" + middle});
			rerender = true;
		}
		var member = bf.members[middle];
		var memConfig = this.getMemberConfig(member);
		var memHeight = height - (bottomTotal + topTotal);
		$$.css($$memberDiv, {
			width : width,
			overflow : memConfig.layoutConfig.overflow || "auto"
		});
/*		if(memConfig.layoutConfig.fixedHeight !== false){*/
			$$.css($$memberDiv, {height : memHeight + "px"});
/*		}*/
		if (rerender) {
			$$div.appendChild($$memberDiv);
			BFEngine.render(member, $$memberDiv);
		} else {
			BFEngine.DRL(member);
		}
	}
	for(var i=0; i<bottoms.length ;i++){
		var $$memberDiv = $$.byid(this.config.id + "-" + bottoms[i]);
		var rerender = false;
		if (!$$memberDiv) {
			$$memberDiv = $$.create("DIV", {"id": this.config.id + "-" + bottoms[i]});
			rerender = true;
		}
		var member = bf.members[bottoms[i]];
		var memConfig = this.getMemberConfig(member);
		
		var memHeight = memConfig.layoutConfig.height || defaultMemberHeight;
		$$.css($$memberDiv, {
			width : width,
			height : memHeight + "px",
			"z-index" : memConfig.layoutConfig.zindex,
			overflow : memConfig.layoutConfig.overflow || "auto"
		});
		
		if (rerender) {
			$$div.appendChild($$memberDiv);
			BFEngine.render(member, $$memberDiv);
		} else {
			BFEngine.DRL(member);
		}
	}
};

BC.prototype.renderAbsoluteLayout = function($$div) {
	if (inDesigner(this.bf)) {
		var mainDef = NDefDesigner.getMainDef();
		if (!NDefDesigner.getMainDef()) {
			return;
		}
	}
	// TODO mahmuty
};

// Rows layout
BC.prototype.renderRowsLayout = function($$div) {
	var bf = this.bf;
	$$.css($$div, {
		width : this.config.layoutConfig.width || "auto",
		// height: this.config.layoutConfig.height+"px",
		minWidth : this.config.layoutConfig.minWidth + "px"
	});
	if(this.config.layoutConfig.height){
		$$.css($$div, {
			height: this.config.layoutConfig.height+"px"
		});
	}
//	if(this.config.title){
//		var $$titlediv = $$.create("DIV",undefined,["csc-form-title", "csc-page-title", this.config.titleClass]);
//		var $$titlespan = $$.create("span", undefined, this.config.titleIcon);
//		$$titlespan.innerHTML = this.config.title;
//		$$titlediv.appendChild($$titlespan);
//		$div.append($$titlediv);
//	}
	for ( var memberName in bf.members) {
		var member = bf.members[memberName];
		if (member.bcRef.typeName == "CSC-POPUP") {
			continue;// popup ise çizme devam et
		}
		if (member.bcRef.typeName == "CSC-PAGE-BOX") {
			var $$warn = $$.create("DIV");
			$$warn.innerHTML = "PAGEBOX layout is no longer supported.";
			$$div.appendChild($$warn);
			continue;
		}
		if (!inDesigner(this.bf) && !member.hasVisibleItem()) {
			continue;
		}
		var memConfig = this.getMemberConfig(member);
		var $$memberDiv = $$.create("DIV", {"id": this.config.id + "-" + memberName});
		var memHeight = memConfig.layoutConfig.height ? (memConfig.layoutConfig.height + "px") : "";
		$$.css($$memberDiv, {
			width : "100%",
			height : memHeight,
			overflow : memConfig.layoutConfig.overflow || ""
		});
		$$div.appendChild($$memberDiv);
		BFEngine.render(member, $$memberDiv);
	}
};

BC.prototype.render = function($container) {
	var $$div = $$.create("DIV", {"id": this.config.id}, ["csc-page", this.config.cssClass]/*, this.config.style*/);
    if(sideDebugLevel() > 1){
        $$div.setAttribute("rel-def",this.bf.getBusinessName());
    }
	if(!inDesigner(this.bf) && this.config.bodyClass){
		$$.addClass($$.body(), this.config.bodyClass);
	}
	
	
	$container.appendChild($$div);

	if (this.config.layoutConfig.pageLayout == "fixed") {
		this.renderFixedLayout($$div);
	} else if (this.config.layoutConfig.pageLayout == "rows") {
		this.renderRowsLayout($$div);
	}
};

BC.prototype.getChildContainer = function(memberName) {
	return $$.byid(this.config.id + "-" + memberName);
};

BC.prototype.getMemberConfig = function(member) {
	var memConfig = member.getConfig();
	if (!memConfig.layoutConfig) {
		memConfig.layoutConfig = {};
	}
	if (this.config.layoutConfig.pageLayout == "fixed") {
		if (!memConfig.layoutConfig.placement) {
			memConfig.layoutConfig.placement = "top";
		}
	}
	return memConfig;
};

BC.prototype.load = function() {
	if (this.onloadcallback) {
		this.onloadcallback();
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	} else if (eventName == "drop") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondrop = callback;
		}
	} else if (eventName == "dragover") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.ondragover = callback;
		}
	} else if (eventName == "onload") {
		this.onloadcallback = callback;
	}
};

})(window);
/****************************=csc-dt.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-DT
 */
function Definition(CS) {
    this.DEFAULTS = {
        saveMeta: true,
        hovercell: true,
        multiselect: true,
        woverflow: null,//width overflow null, ellapsis yada hidden olabilir. null auto gibi davranır taşmalarda width'in genişlemesinis sağlar
//		fixHeight: true,//fixHeight tüm satırların sabir yükseklikte olmasını sağlar. Dikey taşmalarda davranış taşan kısmın gizlenmesidir
        style: {
            minHeight: 100
        }
    };

    this.BaseBF = "DYN-TABULAR";

    this.METHODS = ["mask", "unmask", "selectAll(select)", "setOnContextMenuCallback(callback)", "showContextMenu", "setPageRowCount(rowCount)", "getPageRowCount", "setNoDataText(text)", "setExcelFileName(filename)",
        "group(fieldName, collapse)", "getSortInfo()", "getColModelMeta()", "setColModelMeta(colModelMeta)", "showButton(buttonName, flag)", "cancelAdd", "cancelDelete", "hideActionBar(flag)", "getColModelMeta",
        "getSearchInfo", "excelExport()", "reCalculateTotalRow", "addEmptyRow", "removeLastRow", "removeSelectedRows", "onExcelImport(callback)", "getTotal(sumProp)", "setExtraSearchParams(params)",
        "setExcelExportPath(path)", "setExcelModule(moduleName)", "setExcelConfig(config)"];
    this.EVENTS = ["selected", "onload", "oninit", "rowClicked(row, isSelectedEvent, memberName)", "rowRightClicked(row, memberName)", "rowDoubleClicked(row, memberName)", "rowselected(row, select)", "onselectall(select)",
        "onpaging(page)", "onsort()", "onnodeexpanded(rowid)", "onaddrow(addedRowId)", "ondeleterow(deletedRowId)", "ondeleterow-complated(deletedRowId)", "ondeleteselectedrow(deletedRowIds)",
        "ondeleteselectedrow-complated(deletedRowIds)", "oncolmodelmetachanged", "onDoRelayout", "pageRowCountChanged(rowCount)", "ondrop", "rowChanged(member, row)", "onbeforeexcelexport", "onbeforeexcelimport",
        "onbefore-search", "onExcelImport-complated()", "specialEvent()","onkeypress","onkeyup","changeTable"];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();

if (getSideDefaults("support-dt-for-grid")) {
    BCEngine.registerType("CSC-GRID", def);
}
BCEngine.registerType("CSC-DT", def);

var BC = def.Type;
var DT_HOVER_WIDTH = 5;
var DT_EMPTY_CHAR = "&nbsp;";
var DT_RN_WIDTH = 25;
var DT_SEL_WIDTH = 35;
var DT_DEFAULT_MIN_WIDTH = 25;
var DT_DEFAULT_PAGE_ROW_COUNT = 10;
var DT_NO_DATA_TEXT;

BC.prototype.init = function () {
    var bc = this, bf = bc.bf;
    DT_NO_DATA_TEXT = SideMLManager.get("common.noRecord");
    bc.selecteds = [];
    bc.rowStyles = {};
    bc.cellStyles = {};
    bc.cellClasses = {};
    bc.pnumber = 1;

    bc.nrows = [];//new added rows
    bc.mrows = [];//modified (dirty) rows
    bc.rrows = [];//removed rows

    bc.filters = {};

    //--------
    var config = bc.config;
    config.style = config.style || {};

    if (config.saveMeta) {
        var userMetaPath = this.getSavePath();
        var userMeta = localStorage.getItem(userMetaPath);
        if (userMeta) {
            bc.userMeta = JSON.parse(userMeta);
        }
    }

    for (var mname in bf.members) {
        var mconf = bf.members[mname].getConfig();
        if (bf.members[mname].getTypeName() == "CSC-TABLE-HEADER") {
            bc.hasTableHeader = true;
        }
        if (bf.members[mname].getTypeName() == "CSC-TABLE-ROW" && !mconf.isActionBar) {
            bc.hasTableRow = true;
        }
    }

    var rowIndex = 0;
    for (var mname in bf.members) {
        var member = bf.members[mname];
        var mconf = member.getConfig();

        if (member.getTypeName() == "CSC-TABLE-ROW") {
            if (mconf.isActionBar) {//TODO mahmuty actionbar içinde member olduğu durum ele alınmalı mı?
                this.tableRowAsActionBar = member;
            } else {
                if (rowIndex > 0) {
                    bc.rowsMetaData.push({});
                } else {
                    bc.rowsMetaData = [{}];
                }
                var mcounter = 0;
                for (var innerMname in member.members) {
                    var innerMember = member.members[innerMname], mconf = innerMember.getConfig(),
                        mconfLayout = mconf.layoutConfig || {};
                    if (mcounter == 0 || mconfLayout.rowIdentifier) {
                        bc.rowsMetaData[rowIndex].identifier = innerMname;
                        bc.rowsMetaData[rowIndex].member = member;
                    }
                    mcounter++;
                }
                rowIndex++;
            }
        }
    }

    bc.configChanged();
};

BC.prototype.configChanged = function (key) {
    var bc = this, config = bc.config, style = config.style;
    config.selectall = config.selectall && config.multiselect;//multiselect yoksa seleck all olmamalı

    if (style.height || style.maxHeight || style.heightByRows) {
        if (style.heightByRows) {
            bc.rowHeight = parseInt(style.rowHeight) || bc.calcDefaultRowHeight();
            bc.bodyHeight = parseInt(style.heightByRows) * bc.rowHeight;
            config.fixHeight = true;
        }
        config.vscroll = true;
    }
    if (style.rowHeight) {
        bc.rowHeight = parseInt(style.rowHeight);
        config.fixHeight = true;
    }
    if (style.minHeight) {
        style.minHeight = parseInt(style.minHeight);
    }
    if ((config.srchBtn || config.useColModelMeta) && !style.minHeight) {
        style.minHeight = 100;
    }

    if (!style.heightByRows) {
        bc.mheight = parseInt(style.height) || parseInt(style.maxHeight);
    }

    if (bc.hasTableRow) {//table row varsa tree table olamaz
        config.treeColumn = null;
    }

    if (config.treeColumn) {
        config.fixHeight = true;
        config.page = false;
        config.nodeStatus = config.nodeStatus || "expanded";
        bc.t_rendereds = [];//çizilen tree satırları
        bc.t_not_rendereds = [];//çizilmemiş (ağaç yapısına (atası-cocugu bozuk) uygun olmadığı ) tree satırları
    }
    config.pageNum = parseInt(config.pageNum) || 10;

    var leftCellCount = 0;
    if (config.hovercell) {
        leftCellCount++;
    }
    if (config.rownumbers) {
        leftCellCount++;
    }
    if (config.selectable) {
        leftCellCount++;
    }
    if (config.treeColumn) {
        leftCellCount++;
    }
    bc.leftCellCount = leftCellCount;
};

BC.prototype.getMemberMeta = function (mname) {
    var bc = this, userMeta, rowMembers, i;
    for (i = 0; i < bc.userMeta.length; i++) {
        if (bc.userMeta[i].name == mname) {
            userMeta = bc.userMeta[i];
            break;
        }
    }
    for (var i = 0; i < this.metadata.rows.length; i++) {
        rowMembers = this.metadata.rows[i];
        for (var k = 0; k < rowMembers.length; k++) {
            if (rowMembers[k].mname == mname) {
                return {
                    visible: rowMembers[k].visible,
                    excel: userMeta.excel
                };
            }
        }
    }
    //Eğer buraya gelmişse panel içinde eleman için soruluyor olabilir
    if (userMeta) {
        return {
            excel: userMeta.excel
        };
    }
};

BC.prototype.addMember = function (mname) {
    var bc = this;
    bc.fullRerender = true;
    BFEngine.renderRequest(bc.bf);
};

BC.prototype.setOnContextMenuCallback = function (callback, options) {
    this.contextMenuCallback = callback;
    this.contextMenuOptions = options;
};

BC.prototype.rightClickCallback = function (rowid, event) {
    var bc = this;
    if (bc.contextMenuCallback) {
        var row = bc.bf.getRowByRowId(rowid);
        window.currentRow = row;
        bc.showContextMenu2(event, row, rowid);
    }
};

BC.prototype.showContextMenu2 = function (event, row, rowid) {
    event = event || window.event;
    var bc = this;
    /*if(bc.bf.isDisabled() || bc.config.disabled){ //DYOP isteği için kapatıldı.
			return;
    }*/
    //console.log("table context menu. rowid:", rowid);
    event.preventDefault();
    var menuItemsObj = this.contextMenuCallback(row, rowid);

    csdu.contextMenu({
        moduleName: bc.bf.getModuleName(),
        left: event.pageX,
        top: event.pageY,
        items: menuItemsObj,
        leftSide: (bc.contextMenuOptions && bc.contextMenuOptions.leftSide) ? true : false

    }, rowid, event);
};

BC.prototype.showContextMenu = function () {
    var bc = this;
    var event = window.event;
    /*if(bc.bf.isDisabled() || bc.config.disabled){ //DYOP isteği için kapatıldı.
       return;
    }*/
    var rowid = currentRow.getRowId();
    var row = currentRow;
    //console.log("table context menu2. rowid:", rowid);
    event.preventDefault();
    var menuItemsObj = this.contextMenuCallback(row, rowid);
    csdu.contextMenu({
        moduleName: bc.bf.getModuleName(),
        left: event.pageX,
        top: event.pageY,
        items: menuItemsObj,
        leftSide: (bc.contextMenuOptions && bc.contextMenuOptions.leftSide) ? true : false
    }, rowid, event);
};

//row numbers ve zebra görünümü güncellenir (render ve delete'den sonra)
BC.prototype.updateRows = function ($$lbody, $$rbody, start, end) {
    var bc = this, bf = bc.bf, config = bc.config, meta = bc.metadata;
    if (!meta.rowNumbers && config.rowApp != "zebra") {
        return;
    }
    var odd = true;
    for (var i = start; i < end; i++) {
        var row = bf.tmembers[i];
        if (!row) {
            continue;
        }
        row.i = i;
        var $$ltr = $$.getChildHasAttr($$lbody, "rowid", row.rowid);
        if ($$ltr) {
            if (meta.rowNumbers) {
                var $$td = $$.getChildHasClass($$ltr, "dt-rn");
                var $$incell = $$.child("DIV");
                if ($$incell) {
                    $$incell.innerHTML = (i + 1);
                }
            }
            if (config.rowApp == "zebra") {
                var $$rtr = $$.getChildHasAttr($$rbody, "rowid", row.rowid);
                if (odd) {
                    $$.rmClass($$ltr, "dt-even-row");
                    $$.rmClass($$rtr, "dt-even-row");
                    $$.addClass($$ltr, "dt-odd-row");
                    $$.addClass($$rtr, "dt-odd-row");
                } else {
                    $$.rmClass($$ltr, "dt-odd-row");
                    $$.rmClass($$rtr, "dt-odd-row");
                    $$.addClass($$ltr, "dt-even-row");
                    $$.addClass($$rtr, "dt-even-row");
                }
                odd = !odd;
            }
        }
    }
};


BC.prototype.renderRow = function (row, mname) {
    var bc = this, bf = bc.bf, config = bc.config, rowid = row.rowid;
//Aşağıdaki kısım sort sırasında saçmaladığı için kapatıldı
//	if(config.page){//paging var mı?
//		var start = (this.pnumber-1)*(config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT);
//		var end = (this.pnumber)*(config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT);
//		if(row.i < start || row.i > end){//sayfanın dışında kalıyor çizme
//			return;
//		}
//	}
    var refRowIndex = 0;
    if (bc.hasTableRow) {
        for (var i = 0; i < bc.rowsMetaData.length; i++) {
            if (row.get(bc.rowsMetaData[i].identifier)) {
                refRowIndex = i;
                break;
            }
        }
    }

    var $$lbody = this.$$lbody, $$rbody = this.$$rbody, meta = this.metadata, colCounter = 0, index = row.i, $$tr, $$td,
        selected = this.isSelected(row.rowid), $$divInTd;
    if ($$lbody) {
        $$tr = $$.getChildHasAttr($$lbody, "rowid", rowid);
        if (!$$tr || !mname) {//tr'yi yeniden çiz
            if (!$$tr) {
                $$tr = $$.create("DIV", {rowid: rowid, tabindex: "850"}, ["brow", "r" + rowid], null, $$lbody);
                if (config.rowApp == "zebra") {
                    $$.addClass($$tr, (index % 2 == 0) ? "dt-odd-row" : "dt-even-row");
                }
                if (config.fixHeight) {
                    $$.addClass($$tr, "rs");
                }
                if (row.clazz) {
                    $$.addClass($$tr, row.clazz);
                }
                $$tr.onmouseover = function () {
                    bc.hover(this.getAttribute("rowid"), true);
                };
                $$tr.onmouseout = function () {
                    bc.hover(this.getAttribute("rowid"), false);
                };
                $$tr.onkeyup = function (e) {
                    if (e.target == this && (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 32)) {//Aşağı yukarı ve space önemli bizim için
                        var rowid = this.getAttribute("rowid");
                        if (e.keyCode == 32 && bc.hrowid) {//space
                            bc.select(bc.hrowid, !bc.isSelected(bc.hrowid), false);
                        } else if (e.keyCode == 40) {//down
                            bc.hover(null, true, "down");
                        } else if (e.keyCode == 38) {//up
                            bc.hover(null, true, "up");
                        }
                    }
                    return;
                };
            } else {
                $$tr.innerHTML = "";
            }
            if (meta.hover) {
                $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-hover"], null, $$tr);
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
            }
            if (meta.rowNumbers) {
                $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-rn"], null, $$tr);
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                if (this.config.startt == undefined ) {
                    this.config.startt = 0;
                }
                var start = 0;
                index++;
                if (config.page) {//paging var mı?
                    $$divInTd.innerHTML = (start) * (config.pageNum || 1) + index;
                    tart = (bc.getCurrentPage() - 1) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT);
                }
                //$$divInTd.innerHTML = (this.config.startt + 1);
                $$divInTd.innerHTML = bc.config.syc++// parseInt(rowid)+1;
               // this.config.startt += 1;
                //$$divInTd.innerHTML = (start+index+1);
                //$$divInTd.innerHTML = (start-1)*(config.pageNum || 1) + index;
            }
            if (meta.selectable) {
                $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-select-td"], null, $$tr);
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                var $$checkbox = $$.create("INPUT", {
                    type: "checkbox",
                    checked: bc.isSelected(rowid)
                }, null, null, $$divInTd);
                if (config.disabled/* || config.readonly*/) {
                    $$checkbox.setAttribute("disabled", "true");
                }
                $$checkbox.onclick = function (e) {
                    var $$tr = this.parentNode.parentNode.parentNode;
                    e.csselectFlag = true;
                    bc.select($$tr.getAttribute("rowid"), $$checkbox.checked, false);
                };
            }
            if (meta.treeIndex >= 0) {
                var colMeta = meta.rows[refRowIndex][meta.treeIndex];
                ;
                $$td = $$.create("DIV", {mn: colMeta.mname}, ["cell", "c" + (colCounter++), "tree-cell"], null, $$tr);
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                if (colMeta.align) {
                    $$divInTd.style.textAlign = colMeta.align;
                }
                if (colMeta.valign) {
                    $$divInTd.style.verticalAlign = colMeta.valign;
                }
                var member = row.get(colMeta.mname);
                if (member) {
                    BFEngine.render(row.get(colMeta.mname), $$divInTd);
                }
            }
        } else {
            $$td = $$.getChildHasAttr($$tr, "mn", mname);
            if ($$td) {
                $$td.innerHTML = "";
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                var member = row.get(colMeta.mname);
                if (member) {
                    BFEngine.render(row.get(colMeta.mname), $$divInTd);
                }
            }
        }
        var css = bc.rowStyles[rowid];
        if (css) {
            var $$tds = $$.childs($$tr, "DIV"), c;
            for (c = 0; c < $$tds.length; c++) {
                $$.css($$tds[c], css);
            }
        }
        var rowCss = bc.cellStyles[rowid];
        if (rowCss) {
            for (var cssMemberName in rowCss) {
                var $$td = $$.getChildHasAttr($$tr, "mn", cssMemberName);
                $$.css($$td, rowCss[cssMemberName]);
            }
        }
        var cellClasses = bc.cellClasses[rowid];
        if (cellClasses) {
            for (var cssMemberName in cellClasses) {
                var $$td = $$.getChildHasAttr($$tr, "mn", cssMemberName);
                $$.addClass($$td, Array.from(cellClasses[cssMemberName]));
            }
        }
        if (selected) {
            $$.addClass($$tr, "dt-selected");
        }
    }
    if (row.readonly === false) {
        $$.addClass($$tr, "csc-dt-editable");
    } else {
        $$.rmClass($$tr, "csc-dt-editable");
    }
    $$tr = $$.getChildHasAttr($$rbody, "rowid", rowid);
    if (!$$tr || !mname) {//tr'yi yeniden çiz
        if (!$$tr) {
            $$tr = $$.create("DIV", {rowid: row.rowid, tabindex: "850"}, ["brow", "r" + rowid], null, $$rbody);
            if (config.rowApp == "zebra") {
                $$.addClass($$tr, (index % 2 == 0) ? "dt-odd-row" : "dt-even-row");
            }
            if (config.fixHeight) {
                $$.addClass($$tr, "rs");
            }
            if (row.clazz) {
                $$.addClass($$tr, row.clazz);
            }
            $$tr.onmouseover = function () {
                bc.hover(this.getAttribute("rowid"), true);
            };
            $$tr.onmouseout = function () {
                bc.hover(this.getAttribute("rowid"), false);
            };
            $$tr.onkeyup = function (e) {
                if (e.target == this && (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 32)) {//Aşağı yukarı ve space önemli bizim için
                    var rowid = this.getAttribute("rowid");
                    if (e.keyCode == 32 && bc.hrowid) {//space
                        bc.select(bc.hrowid, !bc.isSelected(bc.hrowid), false);
                    } else if (e.keyCode == 40) {//down
                        bc.hover(null, true, "down");
                    } else if (e.keyCode == 38) {//up
                        bc.hover(null, true, "up");
                    }
                }
                return;
            };
        } else {
            $$tr.innerHTML = "";
        }
        for (var k = 0; k < meta.rows[refRowIndex].length; k++) {
            if (k == meta.treeIndex) {
                continue;
            }
            var colMeta = meta.rows[refRowIndex][k];
            if (colMeta.visible === false) {
                continue;
            }
            var member = row.get(colMeta.mname);
            if (member) {//hidden, popup gibi bir alan olabilir
                // rowChanged aktif ise changeler bağlanacak.
                if (bf.events && bf.events.rowChanged) {
                    member.on("changed", bc, function () {
                        bf.fire("rowChanged", member, row);
                    });
                }

                var mconf = member.getConfig();
                $$td = $$.create("DIV", {mn: colMeta.mname}, ["cell", "c" + (colCounter++)], null, $$tr);
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                if (mconf.layoutConfig && mconf.layoutConfig.colSpan) {
                    $$.addClass($$td, "cs");
                }
                if (colMeta.align) {
                    $$divInTd.style.textAlign = colMeta.align;
                }
                if (colMeta.valign) {
                    $$divInTd.style.verticalAlign = colMeta.valign;
                }
                if (colMeta.overflow) {
                    $$td.style.overflow = colMeta.overflow;
                }
                BFEngine.render(row.get(colMeta.mname), $$divInTd);
//				console.log(row.i+"#"+mname+"#"+$$td.offsetHeight);
            }
        }
    } else {
        $$td = $$.getChildHasAttr($$tr, "mn", mname);
        if ($$td) {
            $$td.innerHTML = "";
            var member = row.get(colMeta.mname);
            if (member) {//hidden, popup gibi bir alan olabilir
                $$divInTd = $$.create("DIV", null, ["in-cell"], null, $$td);
                BFEngine.render(row.get(colMeta.mname), $$divInTd);
            }
        }
    }
    if (row.readonly === false) {
        $$.addClass($$tr, "csc-dt-editable");
    } else {
        $$.rmClass($$tr, "csc-dt-editable");
    }
    var css = bc.rowStyles[rowid];
    if (css) {
        var $$tds = $$.childs($$tr, "DIV"), c;
        for (c = 0; c < $$tds.length; c++) {
            $$.css($$tds[c], css);
        }
    }
    var rowCss = bc.cellStyles[rowid];
    if (rowCss) {
        for (var cssMemberName in rowCss) {
            var $$td = $$.getChildHasAttr($$tr, "mn", cssMemberName);
            $$.css($$td, rowCss[cssMemberName]);
        }
    }
    var cellClasses = bc.cellClasses[rowid];
    if (cellClasses) {
        for (var cssMemberName in cellClasses) {
            var $$td = $$.getChildHasAttr($$tr, "mn", cssMemberName);
            $$.addClass($$td, Array.from(cellClasses[cssMemberName]));
        }
    }
    if (selected) {
        $$.addClass($$tr, "dt-selected");
    }
//	console.log("row rendered: " + row.i);
};
BC.prototype.organizeTmembersForTree = function () {
//function x(){
    this.bf = {
        tmembers: [
            {rowid: 1, parentid: 0, text: "1"},
            {rowid: 11, parentid: 1, text: "1.1"},
            {rowid: 111, parentid: 11, text: "1.1.1"},
            {rowid: 12, parentid: 1, text: "1.2"},
            {rowid: 121, parentid: 12, text: "1.2.1"},
            {rowid: 2, parentid: 5, text: "2"},
            {rowid: 21, parentid: 2, text: "2.1"},
            {rowid: 122, parentid: 12, text: "1.2.2"},
            {rowid: 13, parentid: 1, text: "1.3"},
            {rowid: 112, parentid: 11, text: "1.1.2"},
        ]
    };
    var bc = this, bf = bc.bf, tree = {}, parentIds = [0], tmembers = bf.tmembers.slice(0), i, j, rid, pid, found,
        notfounds = [], result = [];
    for (i = 0; i < tmembers.length; i++) {
        pid = tmembers[i].parentid;
        found = false;
        for (j = 0; j < parentIds.length; j++) {
            if (pid == parentIds[j]) {
                rid = tmembers[i].rowid;
                tree[rid] = tmembers[i];
                if (tree[pid]) {
                    if (!tree[pid].children) {
                        tree[pid].children = [];
                    }
                    tree[pid].children.push(tmembers[i]);
                }
                parentIds.push(rid);
                found = true;
                break;
            }
        }
        if (!found) {
            notfounds.push(tmembers[i]);
        }
        tmembers.splice(i, 1);
        i--;
    }
    function getResult(childs, result) {
        for (var i = 0; childs && i < childs.length; i++) {
            result.push(childs[i]);
            getResult(childs[i].children, result);
        }
    }

    console.dir(tree);
    for (var item in tree) {
        if (!tree[item].parentid || tree[item].parentid == -1) {
            result.push(tree[item]);
            getResult(tree[item].children, result);
        }
    }
    getResult(tree, result);
    result = result.concat(notfounds);
    console.dir(result);
};
BC.prototype.rerenderTree = function () {
    //console.log("rrender tree");
    var bc = this, bf = bc.bf, config = bc.config, $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, meta = bc.metadata;
    var defaultNodeStatus = config.nodeStatus == "collapsed" ? "c" : "e";
    for (var i = 0; i < bc.rrows.length; i++) {
        //Silme işlemi yapılırken ağacın yapısı bozuluyor mu kontrol edilmez. Bu iş ekran geliştiriciye bırakılmıştır
        var row = bc.rrows[i];
        var removed = false;
        for (var k = 0; k < bc.t_rendereds.length; k++) {
            if (row.rowid == bc.t_rendereds[k].rowid) {
                bc.t_rendereds.splice(k, 1);
                $$.remove($$.getChildHasAttr($$lbody, "rowid", row.rowid));
                $$.remove($$.getChildHasAttr($$rbody, "rowid", row.rowid));
                removed = true;
                break;
            }
        }
        for (k = 0; !removed && k < bc.t_not_rendereds.length; k++) {
            if (bc.rrows[i].rowid == bc.t_not_rendereds[k].rowid) {
                bc.t_not_rendereds.splice(k, 1);
                removed = true;
            }
        }
    }
    //Ekleme yapılırken ağacın yapısına uygun gelmeyen satırlar t_not_rendereds içinde tutulur.
    for (i = 0; i < bc.t_not_rendereds.length; i++) {
        bc.nrows.unshift(bc.t_not_rendereds[i]);
    }

    for (var i = bc.nrows.length - 1; i >= 0; i--) {
        var row = bc.nrows[i];
        if (!row.parentid) {
            continue;
        }
        row.isleaf = true;
        found = false;
        for (var k = 0; !found && i < bc.t_rendereds.length; k++) {
            var otherRow = bc.t_rendereds[k];
            if (row.parentid == otherRow.rowid) {
                otherRow.isleaf = false;
                found = true;
            }
        }
        for (var k = 0; !found && k < bc.nrows.length; k++) {
            var otherRow = bc.nrows[k];
            if (row.parentid == otherRow.rowid) {
                if (i < k) {
                    bc.nrows.splice(k, 1);
                    bc.nrows.splice(i, 0, otherRow);
                }
                found = true;
            }
        }
        if (!found) {
            bc.t_not_rendereds.push(row);//atası render edilmiş ve edileceklerde bulunamadı
        }
    }

    var $$ltr, $$rtr;
    for (var i = 0; i < bc.nrows.length; i++) {
        var row = bc.nrows[i];
        var after = null, lastBrother = null, brotherIndex = 0, parent = null, parentIndex;
        for (var k = 0; row.parentid && k < bc.t_rendereds.length; k++) {
            var otherRow = bc.t_rendereds[k];
            if (row.parentid == otherRow.rowid) {
                row.treeLevel = otherRow.treeLevel + 1;
                parent = otherRow;
                parentIndex = k;
            }
            if (!row.treeLevel || !otherRow.treeLevel) {
                continue;
            }
            if (parentIndex && parentIndex != k && row.treeLevel > otherRow.treeLevel) {
                break;
            }
            lastBrother = otherRow;
            brotherIndex = k;
        }
        if (!row.parentid) {
            $$.create("DIV", {
                rowid: row.rowid,
                treelevel: "1",
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"], null, $$lbody);
            $$.create("DIV", {
                rowid: row.rowid,
                treelevel: "1",
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"], null, $$rbody);
            row.treeLevel = 1;
            bc.t_rendereds.push(row);
        } else {
            $$ltr = $$.create("DIV", {
                rowid: row.rowid,
                treelevel: row.treeLevel,
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"]);
            $$rtr = $$.create("DIV", {
                rowid: row.rowid,
                treelevel: row.treeLevel,
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"]);
            var $$lastBrother = $$.getChildHasAttr($$lbody, "rowid", lastBrother.rowid);
            if ($$lastBrother.nextSibling) {
                $$lastBrother.parentNode.insertBefore($$ltr, $$lastBrother.nextSibling);
                $$lastBrother = $$.getChildHasAttr($$rbody, "rowid", lastBrother.rowid);
                $$lastBrother.parentNode.insertBefore($$rtr, $$lastBrother.nextSibling);
            } else {
                $$lastBrother.parentNode.appendChild($$ltr);
                $$lastBrother = $$.getChildHasAttr($$rbody, "rowid", lastBrother.rowid);
                $$lastBrother.parentNode.appendChild($$rtr);
            }
            bc.t_rendereds.splice(brotherIndex + 1, 0, row);
            var $$parent = $$.getChildHasAttr($$lbody, "rowid", row.parentid);
            $$parent.setAttribute("isleaf", "e");
        }
        bc.renderRow(row);
    }

    if (bc.rrows.length) {
        bc.updateRows($$lbody, $$rbody, start, end);
    }
    bc.nrows = [];
    bc.rrows = [];
    bc.renderFooter();
    bc.fixTable();
};


BC.prototype.rerenderTree_old = function () {
    //console.log("rrender tree");
    var bc = this, bf = bc.bf, config = bc.config, $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, meta = bc.metadata;
    var defaultNodeStatus = config.nodeStatus == "collapsed" ? "c" : "e";
    for (var i = 0; i < bc.rrows.length; i++) {
        //Silme işlemi yapılırken ağacın yapısı bozuluyor mu kontrol edilmez. Bu iş ekran geliştiriciye bırakılmıştır
        var row = bc.rrows[i];
        var removed = false;
        for (var k = 0; k < bc.t_rendereds.length; k++) {
            if (row.rowid == bc.t_rendereds[k].rowid) {
                bc.t_rendereds.splice(k, 1);
                $$.remove($$.getChildHasAttr($$lbody, "rowid", row.rowid));
                $$.remove($$.getChildHasAttr($$rbody, "rowid", row.rowid));
                removed = true;
                break;
            }
        }
        for (k = 0; !removed && k < bc.t_not_rendereds.length; k++) {
            if (bc.rrows[i].rowid == bc.t_not_rendereds[k].rowid) {
                bc.t_not_rendereds.splice(k, 1);
                removed = true;
            }
        }
    }
    //Ekleme yapılırken ağacın yapısına uygun gelmeyen satırlar t_not_rendereds içinde tutulur.
    for (i = 0; i < bc.t_not_rendereds.length; i++) {
        bc.nrows.unshift(bc.t_not_rendereds[i]);
    }

    for (var i = bc.nrows.length - 1; i >= 0; i--) {
        var row = bc.nrows[i];
        if (!row.parentid) {
            continue;
        }
        row.isleaf = true;
        found = false;
        for (var k = 0; !found && i < bc.t_rendereds.length; k++) {
            var otherRow = bc.t_rendereds[k];
            if (row.parentid == otherRow.rowid) {
                otherRow.isleaf = false;
                found = true;
            }
        }
        for (var k = 0; !found && k < bc.nrows.length; k++) {
            var otherRow = bc.nrows[k];
            if (row.parentid == otherRow.rowid) {
                if (i < k) {
                    bc.nrows.splice(k, 1);
                    bc.nrows.splice(i, 0, otherRow);
                }
                found = true;
            }
        }
        if (!found) {
            bc.t_not_rendereds.push(row);//atası render edilmiş ve edileceklerde bulunamadı
        }
    }

    var $$ltr, $$rtr;
    for (var i = 0; i < bc.nrows.length; i++) {
        var row = bc.nrows[i];
        var after = null, lastBrother = null, brotherIndex = 0, parent = null, parentIndex;
        for (var k = 0; row.parentid && k < bc.t_rendereds.length; k++) {
            var otherRow = bc.t_rendereds[k];
            if (row.parentid == otherRow.rowid) {
                row.treeLevel = otherRow.treeLevel + 1;
                parent = otherRow;
                parentIndex = k;
            }
            if (!row.treeLevel || !otherRow.treeLevel) {
                continue;
            }
            if (parentIndex && parentIndex != k && row.treeLevel > otherRow.treeLevel) {
                break;
            }
            lastBrother = otherRow;
            brotherIndex = k;
        }
        if (!row.parentid) {
            $$.create("DIV", {
                rowid: row.rowid,
                treelevel: "1",
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"], null, $$lbody);
            $$.create("DIV", {
                rowid: row.rowid,
                treelevel: "1",
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"], null, $$rbody);
            row.treeLevel = 1;
            bc.t_rendereds.push(row);
        } else {
            $$ltr = $$.create("DIV", {
                rowid: row.rowid,
                treelevel: row.treeLevel,
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"]);
            $$rtr = $$.create("DIV", {
                rowid: row.rowid,
                treelevel: row.treeLevel,
                isleaf: row.isleaf ? "l" : defaultNodeStatus
            }, ["brow", "rs"]);
            var $$lastBrother = $$.getChildHasAttr($$lbody, "rowid", lastBrother.rowid);
            if ($$lastBrother.nextSibling) {
                $$lastBrother.parentNode.insertBefore($$ltr, $$lastBrother.nextSibling);
                $$lastBrother = $$.getChildHasAttr($$rbody, "rowid", lastBrother.rowid);
                $$lastBrother.parentNode.insertBefore($$rtr, $$lastBrother.nextSibling);
            } else {
                $$lastBrother.parentNode.appendChild($$ltr);
                $$lastBrother = $$.getChildHasAttr($$rbody, "rowid", lastBrother.rowid);
                $$lastBrother.parentNode.appendChild($$rtr);
            }
            bc.t_rendereds.splice(brotherIndex + 1, 0, row);
            var $$parent = $$.getChildHasAttr($$lbody, "rowid", row.parentid);
            $$parent.setAttribute("isleaf", "e");
        }
        bc.renderRow(row);
    }

    if (bc.rrows.length) {
        bc.updateRows($$lbody, $$rbody, start, end);
    }
    bc.nrows = [];
    bc.rrows = [];
    bc.renderFooter();
    bc.fixTable();
};

BC.prototype.rerenderTable = function (start, end) {
    //console.log("rerenderTable");
    var bc = this, bf = bc.bf, config = bc.config, $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, meta = bc.metadata,
        members = bf.fmembers || bf.tmembers, i, k;
    if (!$$rbody) {
        bc.nrows = [];
        bc.rrows = [];
        bc.mrows = [];
        return;//hiç render edilmemiş zaten
    }
    if (bc.fullRerender) {
        bc.fullRerender = null;
        bc.metadata = bc.prepareMetadata();
        bc.reRender();
        return;
    }
    if (!bc.hasTableRow && config.treeColumn) {
        bc.rerenderTree();
        return;
    }
    var $$nodata = $$.byid(config.id + "-nodata");
    if (!$$nodata) {
        return;
    }
    $$nodata.style.display = (members.length && bc.nodatatext) ? "" : "block";
    if (!members.length && bc.nodatatext) {
        if ($$rbody) {
            $$rbody.style.minHeight = "40px";
        }
        $$nodata.style.top = (bc.$$title ? bc.$$title.offsetHeight : 0) + (bc.$$action ? bc.$$action.offsetHeight : 0) + (bc.$$rhead ? bc.$$rhead.offsetHeight : 0);
    }
    var $$tr, $$td;
    if (config.page && bc.pnumber > 1 && ((bc.pnumber - 1) > Math.floor((members.length - 1) / ((config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT))))) {
        this.go(Math.floor((members.length - 1) / ((config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT))) + 1);
        return;
    }
    if (end) {//paging geçişi (full rerender)
        $$lbody && ($$lbody.innerHTML = "");
        $$rbody && ($$rbody.innerHTML = "");
        if(config.page){
            bc.config.syc=(parseInt(bf.getCurrentPage())*config.pageNum)-config.pageNum+1;;
        }
        else{
            bc.config.syc=1;
        }

        for (var i = start; i < end; i++) {
            var row = members[i];
            if (row) {
                bc.renderRow(row);
            }
        }


    } else {
        if (!bc.end) {
            start = config.page ? (bc.pnumber - 1) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : 0;
            end = (config.page ? (bc.pnumber) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : members.length) || 1;
        }
        //delete removed rows
        if (bc.rrows.length) {
            for (i = 0; i < bc.rrows.length; i++) {
                var row = bc.rrows[i];
                $$.remove($$.getChildHasAttr($$lbody, "rowid", row.rowid));
                $$.remove($$.getChildHasAttr($$rbody, "rowid", row.rowid));
                for (k = 0; k < bc.nrows.length; k++) {
                    if (bc.nrows[k].rowid == row.rowid) {
                        bc.nrows.splice(k, 1);
                    }
                }
                for (k = 0; k < bc.mrows.length; k++) {
                    if (bc.mrows[k].rowid == row.rowid) {
                        bc.mrows.splice(k, 1);
                    }
                }
            }
            for (var i = start; i < end; i++) {
                var row = members[i];
                if (!row) {
                    break;
                }
                $$tr = $$.getChildHasAttr($$rbody, "rowid", row.rowid);
                if (!$$tr) {
                    bc.renderRow(row);
                    for (var k = 0; k < bc.nrows.length; k++) {
                        if (bc.nrows[k].rowid == row.rowid) {
                            bc.nrows.splice(k, 1);
                            break;
                        }
                    }
                }
            }

        }
        //add new rows
        for (i = 0; i < bc.nrows.length; i++) {
            var row = bc.nrows[i];
            if (row.i >= start && row.i < end) {
                bc.renderRow(row);
            }
        }
        //reredner modified rows
        for (i = 0; i < bc.mrows.length; i++) {
            var row = bc.mrows[i];
            if (row.i >= start && row.i < end) {
                bc.renderRow(row);
            }
        }
    }
    if (bc.rrows.length) {
        bc.updateRows($$lbody, $$rbody, start, end);
    }
    bc.nrows = [];
    bc.mrows = [];
    bc.rrows = [];
    bc.renderFooter();
    bc.fixTable();
    if(bc.config.changeTableEvent){
        bc.bf.fire("changeTable");
    }
};

BC.prototype.go = function (pnumber) {
    var bc = this, bf = bc.bf, config = bc.config, start, end;
    if (!bf.$CS$.ds) {//Editable ise save state işlemi
        start = config.page ? (bc.pnumber - 1) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : 0;
        end = config.page ? (bc.pnumber) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : bf.tmembers.length;
        for (var i = 0; i < bf.tmembers.length; i++) {
            var row = bf.tmembers[i];
            if (row && row.isEditable()) {
                row.saveState();
            }
        }
    }

    this.saveScrollPosition();
    start = config.page ? (pnumber - 1) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : 0;
    end = config.page ? (pnumber) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : bf.tmembers.length;
    bc.pnumber = pnumber;
    bc.rerenderTable(start, end);
    this.loadScrollPosition();
    bc.bf.fire("onpaging", pnumber);
};

BC.prototype.beforeDRL = function () {
    var bc = this, config = this.config, $$table = $$.byid(config.id);
    if (config.style.width) {
        return;
    }
    if (!$$table) {
        return;
    }
    var childs = $$.childs($$table, "DIV");
    bc.oldWidth = $$table.offsetWidth;
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].className) {
            if (childs[i].className.indexOf("hor-sc") >= 0) {
                bc.scDisplay = childs[i].style.display;
            }
            if (childs[i].className.indexOf("nodata") >= 0) {
                bc.nodataDisplay = childs[i].style.display;
            }
        }
        childs[i].style.display = "none";
    }
    $$table.style.width = "";
};

BC.prototype.DRL = function () {
    var bc = this, bf = bc.bf, config = this.config, $$table = this.$$table, $$lbody = this.$$lbody,
        $$rbody = this.$$rbody, meta = this.metadata;
    var pwidth = bc.getParentWidth();
    if (config.style.width || !pwidth) {
//		return; //atası dispaly none ise width verilse bile yanlış çiziyor (collapse-expand form içinde örneğin)
    }
    bc.pwidth = pwidth;
    //console.log("csc-dt dorelayout");
    if (!$$table) {
        return;
    }

    if (!$$rbody) {//tablo hiç çizilmemiş (render sırasında width belli olmadığı için)
        if ($$table) {
//			$$.remove($$table);
//			BFEngine.renderRequest(this.bf);
//			this.render($$table.parentNode);
        }
//		return;
    }
    var childs = $$.childs($$table, "DIV");
    for (var i = 0; i < childs.length; i++) {
        if (childs[i].className) {
            if (childs[i].className.indexOf("hor-sc") >= 0) {
                childs[i].style.display = bc.scDisplay;
            } else if (childs[i].className.indexOf("nodata") >= 0) {
                childs[i].style.display = bc.nodataDisplay;
            } else {
                childs[i].style.display = "";
            }
        } else {
            childs[i].style.display = "";
        }
    }

    var newWidth = pwidth;
    if (bc.oldWidth != newWidth) {
        //console.log("table w: " +bc.oldWidth + " parent inner w: " + newWidth);
        if ($$table) {
            $$table.style.width = newWidth + "px";
        }
        if (meta && meta.rows[meta.refRowIndex]) {
            for (var c = 0; c < meta.rows[meta.refRowIndex].length; c++) {
                var model = meta.rows[meta.refRowIndex][c];
                if (model.realMinw) {
                    model.realMinw = undefined;
                }
            }
        }

        // this.prepareCSS($$table, newWidth);
        // this.fixTable();
    } else {
        if ($$table) {
            $$table.style.width = bc.oldWidth + "px";
        }
    }
    this.fixTable();
};

BC.prototype.calcDefaultRowHeight = function () {
    var bc = this, config = bc.config, result;
    var $$cont = $$.create("DIV", {id: config.id + "-temp-cont"}, [CSSession.get("SIDE-THEME")], {
        visibility: "hidden",
        position: "absolute",
        left: "0px",
        top: "-10000px"
    }, $$.body());
    var $$table = $$.create("DIV", {id: config.id + "-temp"}, ["csc-dt", config.cssClass], null, $$cont);
    var $$rbody = $$.create("DIV", {id: config.id + "-rbody"}, ["csc-dt-rbody"], null, $$table);
    var $$tr = $$.create("DIV", {rowid: "0", tabindex: "850"}, ["brow", "r0"], null, $$rbody);
    var $$td = $$.create("DIV", null, ["cell", "c0"], {width: "500px"}, $$tr);
    var $$cell = $$.create("DIV", null, ["in-cell", "c0"], {width: "400px"}, $$td);
    $$cell.innerHTML = "<span class='csc-rospan'>TestData</span>";
    result = $$cell.offsetHeight;
    $$.remove($$cont);
    return result;
};

BC.prototype.bindBodyEvents = function ($$body) {
    var bc = this, bf = bc.bf, config = bc.config;

    function findRow(e, that) {
        var target = e.target, cell;
        while (target && target != that) {
            if (target.className.indexOf("cell") >= 0) {
                cell = target.getAttribute("mn");
            }
            if (target.className && target.className.indexOf("brow") >= 0) {
                return {r: target.getAttribute("rowid"), c: cell};
            }
            target = target.parentNode;
        }
    }

    $$body.onclick = function (e) {
        var row = findRow(e, this);
        if (row) {
            SIDENavigator.setEvent(e);
            if (config.selectOnClick && !e.csselectFlag && !config.disabled && !bc.bf.isDisabled()) {
                bc.select(row.r, !bc.isSelected(row.r), false);
            }
            bf.fire("rowClicked", bf.getRowByRowId(row.r), e.csselectFlag || false, row.c);
        }
    };
    $$body.oncontextmenu = function (e) {
        var row = findRow(e, this);
        if (row) {
            SIDENavigator.setEvent(e);
            bf.fire("rowRightClicked", bf.getRowByRowId(row.r), row.c);
            bc.rightClickCallback(row.r, e);
        }
    };

    $$body.ondblclick = function (e) {
        var row = findRow(e, this);
        if (row) {
            e.preventDefault();
            SIDENavigator.setEvent(e);
            bf.fire("rowDoubleClicked", bf.getRowByRowId(row.r), row.c);
        }
    };
};

BC.prototype.clearFilter = function () {
    var bc = this;
    bc.filters = [];
    var $$div = $$.byid(bc.config.id + "-filter-div");
    if ($$div) {
        $$div.parentNode.style.width = "";
        $$.remove($$div);
    }
};

BC.prototype.clear = function (clearDataSource) {
    var bc = this, bf = bc.bf;
    bc.rowStyles = {};
    this.clearSelectAll();
//    this.clearFilter();
    bc.selecteds = [];
    bc.pnumber = 1;
    bc.$$lbody && (bc.$$lbody.innerHTML = "");
    bc.$$rbody && (bc.$$rbody.innerHTML = "");

    var $$nodata = $$.byid(this.config.id + "-nodata");
    if ($$nodata) {
        $$nodata.style.display = (bc.nodatatext) ? "block" : "";
    }


    if (clearDataSource !== false) {
        bf.$CS$.ds = null;
    }
//	if(bc.totalRow && ((SIDEUtil.isEmpty(bc.totalRow.members) && bc.totalRow.isVisible()) || (!SIDEUtil.isEmpty(bc.totalRow.members) && bc.totalRow.hasVisibleItem() && bc.totalRow.isVisible()))){
//		bc.addTotalRow();
//	}
    bc.renderFooter();
};

BC.prototype.getParentWidth = function ($$container) {
    var pwidth = 0, bc = this, bf = bc.bf, config = bc.config, parent = bf.getParent();
    if (config.style && config.style.width && config.style.width != "auto" && config.style.width.indexOf("%") < 0) {
        return config.style.width;
    }
    if (parent && parent.bcRef.typeName == "CSC-HORIZONTAL") {
        pwidth = $$.innerWidth(parent.getConfig().id);
    } else if (parent && parent.bcRef.typeName == "CSC-VERTICAL") {
        pwidth = $$.innerWidth(parent.bcRef.getChildContainer(bf.$CS$.name));
    } else if (!pwidth) {
        if (!$$container && bc.$$table) {
            $$container = bc.$$table.parentNode;
        }
        if ($$container) {
            pwidth = $$.innerWidth($$container);
        }
        if (!pwidth && parent) {
            pwidth = $$.innerWidth(parent.getConfig().id);
        }
    }
    return pwidth;
};

BC.prototype.addRowOnEnter = function ($$table) {
    var bc = this, bf = bc.bf;
    if (bc.config.newRowOnEnter) {
        $$table.setAttribute("tabindex", 100);
        $$table.onkeypress = function (e) {
	          bc.bf.fire("onkeypress");
            if (e.which == 13) {
                var target = e.target;
                while (target && !$$.hasClass(target, "brow")) {
                    target = target.parentNode;
                }
                if (target) {
                    var rowid = target.getAttribute("rowid");
                    if (rowid) {
                        var index = bf.getIndexFromRowId(rowid) + 1;
                        BFEngine.a();
                        try {
                            bf.add({}, {readonly: false, position: index});
                            var row = bf.getRow(index);
                            for (var mname in row.members) {
                                if (!row.members[mname].isReadonly()) {
                                    row.members[mname].focus();
                                    break;
                                }
                            }
                        } finally {
                            BFEngine.r();
                        }
                        bc.cadd = false;
                        bc.addedRowid = row.rowid;
                        bf.fire("onaddrow", row.rowid);
                        if (bc.cadd) {
                            bc.cadd = undefined;
                            return;
                        }
                        var page = Math.ceil(bf.length() / bf.getPageRowCount());
                        if (page != bf.getCurrentPage()) {
                            bf.gotoPage(page || 1);
                        }
                    }
                }
                ;
            }
        }
    }
};

BC.prototype.render = function ($$container) {
    //console.log("dt render");
    var bc = this, bf = bc.bf, meta = bc.metadata;
    var config = bc.config, parent = bf.getParent();

//	if(!meta){  //elemanlardan birinin visibility'si değişti ise güncellenmiyordu o yüzden commente aldım mahmuty
    meta = bc.prepareMetadata();
//	}

    bc.initCInfo();

    var $$table, $$title, $$action, $$lhead, $$rhead, $$lbody, $$rbody, $$hscroll, $$vscroll, $$footer, $$totalRow,
        $$totalRowInner, $$totalRowContainer, $$nodata, $$nodataSpan;
    bc.$$table = $$table = $$.create("DIV", {id: config.id}, ["csc-dt", config.cssClass], null, $$container);
    bc.$$table.setAttribute("rel", this.bf.$CS$.name);
    var pwidth = bc.getParentWidth();
//	if(!pwidth || !$($$container).is(":visible")){
//		bc.$$rbody = null;//diğerleri için de yapılması gerekebilir ilginç bir durum
//		return;//yer yok boşuna çizme, gerekirse dorelayout'ta tekrar çizilir TODO mahmuty bir işaret koyulmalı
//	}

    bc.addRowOnEnter($$table);
    if (config.style.height && !config.style.heightByRows) {
        $$table.style.height = config.style.height + "px";
    }
    this.pwidth = pwidth;
    if (pwidth != parseInt(pwidth)) {//pwidth %, px, em, yada auto verilmiş olabilir
        $$table.style.width = pwidth;
    } else {
        $$table.style.width = pwidth + "px";
    }
    //scroll width bir kez hesaplanıyor ve ver ve hor scroll width'lerinin aynı olduğu varsayılıyor
    if (!bc.scwidth || bc.scwidth < 5) {//display none iken scwidth 1,2 gibi birşey hesaplanıyor ie9'dan dolayı
        bc.scwidth = $$.getScrollBarWidth($$table);
    }
    if (config.vscroll) {
        $$.create("DIV", {id: config.id + "-ver-sc-ground"}, ["ver-sc-ground"], {width: this.scwidth}, $$table);//vertical scroll ground
    }

    if (config.noTitle !== true && config.title) {
        bc.$$title = $$title = $$.create("DIV", {id: config.id + "-title"}, ["csc-dt-title"], null, $$table);
        $$title.innerHTML = config.title;
    }
    if ((!config.utilButtonsBottom && (config.showActionButtons || this.config.useColModelMeta || this.tableRowAsActionBar)) || (config.addBtn || config.delBtn || config.rmBtn)) {
        if (!this.tableRowAsActionBar || this.tableRowAsActionBar.isVisible()) {
            bc.$$action = $$action = $$.create("DIV", {id: config.id + "-action"}, ["csc-dt-action-bar"], null, $$table);
            bc.renderActionBar($$action);
        }
    }

    if (config.noHeader !== true) {
        if (meta.hover || meta.rowNumbers || meta.selectable || meta.treeColumn) {
            bc.$$lhead = $$lhead = $$.create("DIV", {id: config.id + "-lhead"}, ["csc-dt-lhead"], null, $$table);
        }
        bc.$$rhead = $$rhead = $$.create("DIV", {id: config.id + "-rhead"}, ["csc-dt-rhead"], null, $$table);
        bc.renderHeaders($$table, $$lhead, $$rhead);
    }

    if (!bc.bf.members.length) {
        bc.setNodata();
    }

    //Nodata div
    bc.$$nodata = $$nodata = $$.create("DIV", {id: config.id + "-nodata"}, "csc-dt-nodata", null, $$table);
    $$nodataSpan = $$.create("SPAN", null, null, null, $$nodata);
    $$nodataSpan.innerHTML = bc.nodatatext;
    $$nodata.appendChild($$nodataSpan);

    if (bc.leftCellCount) {
        $$.create("DIV", null, ["csc-dt-clear"], null, $$table);
        bc.$$lbody = $$lbody = $$.create("DIV", {id: config.id + "-lbody"}, ["csc-dt-lbody"], null, $$table);
        bc.bindBodyEvents($$lbody);
    }
    //render headers
    bc.$$rbody = $$rbody = $$.create("DIV", {id: config.id + "-rbody"}, ["csc-dt-rbody"]);
    bc.bindBodyEvents($$rbody);
    if (config.vscroll) {
        bc.$$vscroll = $$vscroll = $$.create("DIV", {id: config.id + "-ver-sc"}, ["ver-sc"], null, $$table);
    }
    $$table.appendChild($$rbody);

    if (this.totalRow && ((SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.isVisible()) || (!SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.hasVisibleItem() && this.totalRow.isVisible()))) {
        var totalRowConfig = this.totalRow.getConfig();
        this.$$totalRowContainer = $$totalRowContainer = $$.create("DIV", {id: totalRowConfig.id + "totalRow-contianer"}, [this.totalRow.getConfig().cssClass], {
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            position: "relative",
            top: "-1px"
        }, $$table);
        this.$$totalRow = $$totalRow = $$.create("DIV", {id: totalRowConfig.id + "totalRow"}, [], {
            overflow: "hidden",
            borderLeft: "1px solid #ddd"
        }, $$totalRowContainer);
        this.$$totalRowInner = $$totalRowInner = $$.create("DIV", {id: totalRowConfig.id + "-totalRow-inner"}, ["brow"], {display: "block"}, $$totalRow);
    }

    $$.create("DIV", null, ["csc-dt-clear"], null, $$table);

    bc.$$hscroll = $$hscroll = $$.create("DIV", {id: config.id + "-hor-sc"}, ["hor-sc"], {height: bc.scwidth}, $$table);
    bc.$$hscrollInner = $$.create("DIV", {id: config.id + "-hor-sc-inner"}, ["hor-sc-inner"], null, $$hscroll);

    if (config.noFooter !== true) {
        this.$$footer = $$footer = $$.create("DIV", {id: config.id + "-footer"}, ["csc-dt-footer"], null, $$table);
        $$footer.innerHTML = SideMLManager.get(bc, "bottomPart");
        this.renderFooter();
    }

    if (config.vscroll) {
        var top = ($$title ? $$title.offsetHeight : 0) + ($$action ? $$action.offsetHeight : 0);
        var $$vscrollInner = $$.create("DIV", {id: config.id + "-ver-sc-inner"}, ["ver-sc-inner"], {height: $$rbody.scrollHeight}, $$vscroll);
        $$vscroll.style.top = top + "px";
        $$vscroll.onscroll = function () {
            if ($$lbody) {
                $$lbody.scrollTop = $$vscroll.scrollTop;
            }
            if ($$rbody) {
                $$rbody.scrollTop = $$vscroll.scrollTop;
            }
        };
    }

    if (inDesigner(bf) && !bf.tmembers.length) {
//		bf.clear();
        if (bc.rowsMetaData) {
            for (var i = 0; i < bc.rowsMetaData.length; i++) {
                var obj = {};
                obj[bc.rowsMetaData[i].identifier] = "";
                BFEngine.a();
                bf.add(obj);
                BFEngine.r();
            }
        } else {
            BFEngine.a();
            bf.add({});
            BFEngine.r();
        }
    }
    if(!bc.config.newRowOnEnter){
	    bc.$$table.onkeypress = function(e){
		    bc.bf.fire("onkeypress");
	    }
    }


	  bc.$$table.onkeyup = function(e){
		    bc.bf.fire("onkeyup");
	  }
//	this.fixTable();
    bc.go(bc.pnumber);
};

BC.prototype.reCalculateTotalRow = function () {
    this.renderTotalRow();
};

BC.prototype.getTotal = function (sumProp) {
    var sum = new BigDecimal("0");
    if (sumProp) {
        for (var i = 0; i < this.bf.length(); i++) {
            var value = this.bf.getValue(i, sumProp) || "0";
            if (typeof value != "string") {
                value = value + "";
            }
            value = value.replace(/,/g, "");
            value = new BigDecimal(value);
            sum = sum.add(value);
        }
    }

    return sum;
};

BC.prototype.renderTotalRow = function () {
    if (this.$$totalRowContainer) {
        if (!this.bf.tmembers.length) {
            this.$$totalRowContainer.style.display = "none";
        } else {
            this.$$totalRowContainer.style.display = "";
        }
    }
    if (this.$$totalRowInner) {
        var meta = this.metadata;
        var k = 0;
        var colCounter = this.config.hovercell ? 1 : 0;
        var cellLeft = 0;
        var maxHeight = 0;
        var totalRowConfig = this.totalRow.getConfig();
        var label = totalRowConfig.label;
        if (label === undefined) {
            label = "Toplam: ";
        }

        var hasCell = false;
        for (var memberName in this.totalRow.members) {
            hasCell = true;
            break;
        }

        if (this.config.selectable && this.config.rownumbers) {
            colCounter += 2;
        } else if (this.config.selectable || this.config.rownumbers) {
            colCounter++;
        }

        this.$$totalRowInner.innerHTML = "";
        if (!hasCell) {
            var sum = new BigDecimal("0"), sumProp = totalRowConfig.sumProp;
            if (!totalRowConfig.sumFromDS && sumProp) {
                for (var i = 0; i < this.bf.length(); i++) {
                    var value = this.bf.getValue(i, sumProp) || "0";
                    if (typeof value != "string") {
                        value = value + "";
                    }
                    value = value.replace(/,/g, "");
                    value = new BigDecimal(value);
                    sum = sum.add(value);
                }
            } else if (totalRowConfig.sumFromDS) {
                if (this.bf.$CS$ && this.bf.$CS$.ds && this.bf.$CS$.ds.sum) {
                    sum = new BigDecimal(this.bf.$CS$.ds.sum.toString());
                }
            }
            var $$td = $$.create("DIV", {}, "cell", {borderTop: "none", width: "100%"}, this.$$totalRowInner);
            var $$incell = $$.create("DIV", {}, "in-cell", {
                borderTop: "none",
                borderLeft: "none",
                width: "100%"
            }, $$td);
            var $$span = $$.create("span", undefined, "csc-rospan", undefined, $$incell);
            $$span.innerHTML = label + this.formatTotal(sum);
        } else {
            for (row in this.totalRow.members) {
                var memConfig = this.totalRow.members[row].getConfig();
                if (!memConfig.visible) {
                    continue;
                }
                var align = (memConfig.layoutConfig && memConfig.layoutConfig.cellAlign) ? memConfig.layoutConfig.cellAlign : undefined;
                if (k < meta.rows[meta.refRowIndex].length) {
                    var colMeta = meta.rows[meta.refRowIndex][k];
                    if (colMeta.visible === false || k == meta.treeIndex) {
                        k++;
                        continue;
                    }
                    var member = this.totalRow.members[row];
                    if (member) {//hidden, popup gibi bir alan olabilir
                        var colspan = 0;
                        if (member.bcRef.config && member.bcRef.config.layoutConfig && member.bcRef.config.layoutConfig.colSpan) {
                            colspan = parseInt(member.bcRef.config.layoutConfig.colSpan);
                        }

                        if (colspan > 1) {
                            var colspanWidth = 0;
                            for (var i = 0; i < colspan; i++) {
                                colspanWidth += $$.outerWidth(document.querySelector("#" + this.config.id + " .c" + (colCounter++)));
                            }
                            $$td = $$.create("DIV", {mn: colMeta.mname}, ["cell", "c" + (colCounter - colspan + 1)], {
                                borderTop: "none",
                                left: cellLeft + "px",
                                minWidth: colspanWidth + "px",
                                maxWidth: colspanWidth + "px"
                            }, this.$$totalRowInner);
                        } else {
                            $$td = $$.create("DIV", {mn: colMeta.mname}, ["cell", "c" + (colCounter++)], {
                                borderTop: "none",
                                left: cellLeft + "px"
                            }, this.$$totalRowInner);
                        }
                        cellLeft += $$.outerWidth($$td);

                        if (align) {
                            $$td.style.textAlign = align;
                        }
                        if (colMeta.overflow) {
                            $$td.style.overflow = colMeta.overflow;
                        }
                        var $$incell = $$.create("DIV", null, ["in-cell"], null, $$td);
                        BFEngine.render(member, $$incell);
                        if (member.bcRef && member.bcRef.typeName == "CSC-TABLE-TOTAL-CELL") {
                            var sum = new BigDecimal("0"), sumProp = (memConfig || totalRowConfig).sumProp;
                            if (!memConfig.sumFromDS && sumProp) {
                                for (var i = 0; i < this.bf.length(); i++) {
                                    var value = this.bf.getValue(i, sumProp) || "0";
                                    if (typeof value != "string") {
                                        value = value + "";
                                    }
                                    value = value.replace(/,/g, "");
                                    value = new BigDecimal(value);
                                    sum = sum.add(value);
                                }
                            } else if (memConfig.sumFromDS && memConfig.sumPropInDS) {
                                if (this.bf.$CS$ && this.bf.$CS$.ds && this.bf.$CS$.ds[memConfig.sumPropInDS]) {
                                    sum = new BigDecimal(this.bf.$CS$.ds[memConfig.sumPropInDS].toString());
                                }
                            }
                            if (sumProp || (memConfig.sumFromDS && memConfig.sumPropInDS) || !memConfig.value) {
                                member.setValue(sum);
                            }
                        }

                        var height = $$.height(this.$$rbody.childNodes[0]);
                        if (height > maxHeight) {
                            maxHeight = height;
                        }
                    }
                }
                k++;
            }
        }

        if (maxHeight === 0) {
            var h = ($$.height(this.$$rbody.childNodes[0]) < 5 ? $$.height(this.$$rhead) : $$.height(this.$$rbody.childNodes[0]) ) - 1;
            $$.css(this.$$totalRowInner, "height", h + "px");
        } else {
            $$.css(this.$$totalRowInner, "height", maxHeight);
            for (var i = 0; i < this.$$totalRowInner.childNodes.length; i++) {
                $$.css(this.$$totalRowInner.childNodes[i], "height", maxHeight);
            }
        }
    }
};

BC.prototype.getSearchInfo = function () {
    var bc = this;
    return {
        service: bc.config.searchService,
        params: bc.searchParams
    };
};

BC.prototype.getCellMeta = function (mname) {
    var bc = this, meta = bc.metadata, i, k, row;
    for (i = 0; i < meta.rows.length; i++) {
        row = meta.rows[i];
        for (k = 0; k < row.length; k++) {
            if (row[k].mname == mname) {
                return row[k];
            }
        }
    }
};

BC.prototype.addEmptyRow = function () {
    if (inDesigner(this.bf)) {
        return;
    }

    var lastRow = this.bf.getRow(this.bf.length() - 1);
    if (lastRow && lastRow.isEmpty(true)) {
        return;//zaten boş bir satır varsa ekleme
    }
    BFEngine.a();
    try {
        this.bf.add({}, {readonly: false});
        this.cadd = false;
        this.bf.fire("onaddrow", this.bf.getRow(this.bf.length() - 1).rowid);
        if (this.cadd) {
            this.cadd = undefined;
            return;
        }
        var page = Math.ceil(this.bf.length() / this.bf.getPageRowCount());
        if (page != this.bf.getCurrentPage()) {
            this.bf.gotoPage(page || 1);
        }
    } finally {
        BFEngine.r();
        this.reRender();
    }
};

BC.prototype.removeSelectedRows = function () {
    if (inDesigner(this.bf)) {
        return;
    }

    var rows = this.bf.getSelectedRows();
    if (!rows.length) {
        CSPopupUTILS.MessageBox(SideMLManager.get("common.selectRowsToDelete"));
        return
    }

    var deletedRows = this.bf.getSelectedRows();
    var deletedRowIds = [];
    for (var i = 0; i < deletedRows.length; i++) {
        deletedRowIds.push(deletedRows[i].rowid);
    }

    this.cdel = null;
    this.bf.fire("ondeleteselectedrow", deletedRowIds);
    if (this.cdel) {//cancel delete?
        this.cdel = null;
        return;
    }
    try {
        this.bf.deleteSelectedRows();
				var lastPage;
				if(!this.bf.$CS$.ds){
					if(this.bf.currentPage() != 1){
						lastPage = Math.ceil(this.bf.length() / this.bf.getPageRowCount());
					}
				}
				else{
					if(this.bf.length() == 0 && this.bf.getCurrentPage() != 1){
						lastPage = parseInt(this.bf.getCurrentPage()) - 1;
					}
					else{
						lastPage = parseInt(this.bf.getCurrentPage());
					}
				}
				this.bf.gotoPage(lastPage || 1);
        /*var lastPage = Math.ceil(this.bf.length() / this.bf.getPageRowCount());
        if (lastPage != this.bf.getCurrentPage()) {
            this.bf.gotoPage(lastPage || 1);
        }*/
        this.bf.fire("ondeleteselectedrow-complated", deletedRowIds);
    } finally {
        this.reRender();
    }
};

BC.prototype.removeLastRow = function () {
    if (inDesigner(this.bf)) {
        return;
    }

    var tableSize = this.bf.length();

    if (tableSize > 0 /*&& !tablebf.getRow(tableSize-1).readonly*/) {
        var deletedRowId = this.bf.getRow(tableSize - 1).rowid;
        this.cdel = null;
        this.bf.fire("ondeleterow", deletedRowId);
        if (this.cdel) {//cancel delete?
            this.cdel = null;
            return;
        }
        try {
            this.bf.deleteRow(deletedRowId);

            var lastPage = Math.ceil(this.bf.length() / this.bf.getPageRowCount());
            if (lastPage != this.bf.getCurrentPage()) {
                this.bf.gotoPage(lastPage || 1);
            }
            this.bf.fire("ondeleterow-complated", deletedRowId);
        } finally {
            this.reRender();
        }
    }
};

BC.prototype.renderMetaWindow = function ($$btn) {
    var bc = this, bf = bc.bf, config = bc.config;
    $$.remove(config.id + "-metaContainer");
    var opened = $$btn.getAttribute("opened");
    if (opened) {
        $$.rmAttr($$btn, "opened");
        return;
    } else {
        $$btn.setAttribute("opened", "yes");
        $$.rmAttr(config.id + "-search", "opened");
    }
    $$.css($$.byid(config.id + "-searchContainer"), "display", "none");
    if (!inDesigner(bc.bf)) {
        var top = (bc.$$title ? bc.$$title.offsetHeight : 0) + (bc.$$action ? bc.$$action.offsetHeight : 0)/* + 10*/;
        var $$metaDiv = $$.create("DIV", {id: bc.config.id + "-metaContainer"}, "csc-dt-meta-cont", {top: top + "px"/*, height: (bc.$$table.offsetHeight - ((bc.$$footer ? bc.$$footer.offsetHeight:0)+top))+"px"*/}, bc.$$table);
        var $$htable = $$.create("TABLE", null, null, {width: "100%"}, $$metaDiv);
        var $$contentDiv = $$.create("DIV", null, "csc-dt-meta-content", null, $$metaDiv);
        var $$ctable = $$.create("TABLE", null, null, {width: "100%"}, $$contentDiv);
        var $$buttonsDiv = $$.create("DIV", null, "csc-dt-meta-btns", {width: "100%"}, $$metaDiv);

        var oldTitles = [], $$tr, $$td, $$tumunuCheck;

        $$tr = $$.create("TR", undefined, undefined, {textAlign: "center", fontWeight: "bold"});
        $$htable.appendChild($$tr);

        $$td = $$.create("TD");
        $$td.innerHTML = "<span>" + SideMLManager.get("common.colHeader") + "</span>";
        $$tr.appendChild($$td);

        if (config.editColVisibility) {
            $$td = $$.create("TD");
            $$td.innerHTML = "<span>" + SideMLManager.get(bc, "show") + "</span>";
            $$tumunuCheck = $$.create("INPUT", {type: "checkbox"}, null, null, $$td);
            $$tumunuCheck.onclick = function () {
                var $$tr, $$td, i, k, $$check;
                for (i = 0; i < $$ctable.children.length; i++) {
                    $$tr = $$ctable.children[i];
                    for (k = 0; k < $$tr.children.length; k++) {
                        $$td = $$tr.children[k];
                        if ($$td.getAttribute("rel") == "vis") {
                            $$check = $$.child($$td, "INPUT");
                            if ($$check) {
                                $$check.checked = this.checked;
                                break;
                            }
                        }
                    }
                }
            };
            $$tr.appendChild($$td);
        }
        if (config.editExcel) {
            $$td = $$.create("TD");
            $$td.innerHTML = "<span>" + SideMLManager.get(bc, "existInExcel") + "</span>";
            $$tumunuCheck = $$.create("INPUT", {type: "checkbox"}, null, null, $$td);
            $$tumunuCheck.onclick = function () {
                var $$tr, $$td, i, k, $$check;
                for (i = 0; i < $$ctable.children.length; i++) {
                    $$tr = $$ctable.children[i];
                    for (k = 0; k < $$tr.children.length; k++) {
                        $$td = $$tr.children[k];
                        if ($$td.getAttribute("rel") == "excel") {
                            $$check = $$.child($$td, "INPUT");
                            if ($$check) {
                                $$check.checked = this.checked;
                                break;
                            }
                        }
                    }
                }
            };
            $$tr.appendChild($$td);
        }

        function drawMetaTable(parent) {
            if (parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-BUTTON" || parent.bcRef.typeName === "CSC-HIDDEN")) {
                return;
            }
            var memberConfig = parent.getConfig();
            if (memberConfig.layoutConfig && (memberConfig.layoutConfig.editExcel === false || !config.editExcel) && (memberConfig.layoutConfig.editVis === false || !config.editColVisibility)) {
                return;
            }
            var cellMeta = bc.getCellMeta(parent.getMemberName()), userCellMeta;
            for (var i = 0; i < bc.userMeta.length; i++) {
                if (parent.getMemberName() === bc.userMeta[i].name) {
                    userCellMeta = bc.userMeta[i];
                    break;
                }
            }

            $$tr = $$.create("TR", {rel: parent.getMemberName()});

            var $$td = $$.create("TD", {rel: "title"});
            var title = userCellMeta && userCellMeta.title ? userCellMeta.title : memberConfig.title || memberConfig.label;
            if (bc.config.editColName) {
                $$.create("INPUT", {type: "text", value: title}, "csc-textbox", null, $$td);
            } else {
                var $$span = $$.create("SPAN", null, null, null, $$td);
                $$span.innerHTML = title;
            }
            oldTitles.push(title);
            $$tr.appendChild($$td);
            if (bc.config.editColVisibility) {
                var $$td = $$.create("TD", {rel: "vis"}, undefined, {textAlign: "center"});
                if (!memberConfig.layoutConfig || memberConfig.layoutConfig.editVis !== false) {
                    var $$visibility = $$.create("INPUT", {type: "checkbox"}, "csc-checkbox");
                    if (cellMeta && cellMeta.visible) {
                        $$.attr($$visibility, "checked", true);
                    }
                    $$td.appendChild($$visibility);
                }
                $$tr.appendChild($$td);
            }
            if (bc.config.editExcel) {
                var $$td = $$.create("TD", {rel: "excel"}, undefined, {textAlign: "center"});
                if (!memberConfig.layoutConfig || memberConfig.layoutConfig.editExcel !== false) {
                    var $$input = $$.create("INPUT", {type: "checkbox"});
                    if ((userCellMeta.excel === true) || (cellMeta && cellMeta.visible && userCellMeta.excel !== false)) {
                        $$.attr($$input, "checked", true);
                    }
                    $$td.appendChild($$input);
                }
                $$tr.appendChild($$td);
            }
            $$ctable.appendChild($$tr);
        }

        for (var member in bf.members) {
            if (!bf.members[member].isContainer()) {
                drawMetaTable(bf.members[member]);
            } else if (bf.members[member].isContainer() && (!bf.members[member].getConfig().isActionBar && bf.members[member].getConfig().layout === "CSC-TABLE-ROW")) {
                var tableRow = bf.members[member].members;
                for (var member in tableRow) {
                    drawMetaTable(tableRow[member]);
                }
            }
        }
        var $$saveButon = $$.create("INPUT", {
            type: "button",
            value: SideMLManager.get("common.save")
        }, null, null, $$buttonsDiv);
        $$contentDiv.style.maxHeight = /*((bc.$$table.offsetHeight - ((bc.$$footer ? bc.$$footer.offsetHeight:0)+top))-($$htable.offsetHeight + $$buttonsDiv.offsetHeight +5))*/300 + "px";

        $$saveButon.onclick = function () {
            // tablodakilerle colmodelmetayı düzenle
            for (var i = 0; i < $$ctable.children.length && ( config.editColVisibility || config.editColName || config.editExcel); i++) {
                var rel = $$ctable.children[i] ? $$ctable.children[i].getAttribute("rel") : undefined;
                if (rel) {
                    var member = bf.members[rel];
                    var memConfig = member.getConfig();
                    for (var j = 0; j < bc.userMeta.length; j++) {
                        var $$tr = $$ctable.children[i], $$visTD, $$titleTD, $$excelTD;
                        if (bc.userMeta[j].name === rel) {
                            var $$visTD = $$tr.children[1];
                            if ($$visTD.children.length) {
                                if ($$visTD.children[0].checked) {
                                    if (memConfig.visible) {
                                        delete bc.userMeta[j].visibility;
                                    } else {
                                        bc.userMeta[j].visibility = true;
                                        bc.setVisible(true);
                                    }
                                } else {
                                    if (!memConfig.visible) {
                                        delete bc.userMeta[j].visibility;
                                    } else {
                                        bc.userMeta[j].visibility = false;
                                    }
                                }
                            }
                            if (config.editColName) {
                                var $$titleTD = $$tr.children[0];
                                var newTitle = $$titleTD.children[0].value;
                                if (!newTitle || memConfig.title == newTitle) {
                                    delete bc.userMeta[j].title;
                                } else {
                                    bc.userMeta[j].title = newTitle;
                                }
                            }
                            if (bc.config.editExcel) {
                                var $$excelTD = $$tr.children[1];
                                if ($$excelTD.children[0].checked) {
                                    if ($$visTD.children.length && $$visTD.children[0].checked) {
                                        delete bc.userMeta[j].excel;
                                    } else {
                                        bc.userMeta[j].excel = true;
                                    }
                                } else {
                                    if ($$visTD.children.length && $$visTD.children[0].checked) {
                                        bc.userMeta[j].excel = false;
                                    } else {
                                        delete bc.userMeta[j].excel;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }

            if (config.saveMeta) {
                bc.saveUserMeta();
            }

            bc.bf.fire("oncolmodelmetachanged");
            $$.remove($$metaDiv);
            bf.rerender();
        };
    }
};

BC.prototype.setExtraSearchParams = function (params) {
    /**
     * @function setExtraSearchParams
     * @description Search servisine ekstra parametreler eklenmesi sağlar.
     * @param [params] search servisine eklenecek parametre
     */
    this.esparams = params;
}

BC.prototype.renderActionBar = function ($$actionDiv) {
    var bc = this, config = bc.config, bf = bc.bf;

    var $$ldiv = $$.create("DIV", null, "csc-dt-action-left", null, $$actionDiv);
    var $$rdiv = $$.create("DIV", null, "csc-dt-action-right", null, $$actionDiv);

    if (config.showActionButtons && config.addBtn) {
        var $$inputAdd = $$.create("SPAN", {id: config.id + "-add"}, ["csc-dt-action-btn", "csc-dt-action-add"], null, $$ldiv);
        $$inputAdd.innerHTML = SideMLManager.get("common.add");
        if (bc.config.disabled || bc.bf.isDisabled()) {
            $$.css($$inputAdd, {"opacity": "0.5", "cursor": "default"});
        } else {
            $$inputAdd.onclick = function () {
                bc.addEmptyRow();
            };
        }
    }
    if (config.showActionButtons && this.config.delBtn) {
        var $$inputRemove = $$.create("SPAN", {id: this.config.id + "-del"}, ["csc-dt-action-btn", "csc-dt-action-del"], null, $$ldiv);
        $$inputRemove.innerHTML = SideMLManager.get("common.deleteLastRow");
        if (bc.config.disabled || bc.bf.isDisabled()) {
            $$.css($$inputRemove, {"opacity": "0.5", "cursor": "default"});
        } else {
            $$inputRemove.onclick = function () {
                bc.removeLastRow();
            };
        }
    }
    if (config.showActionButtons && this.config.rmBtn) {
        var $$inputRemove = $$.create("SPAN", {id: this.config.id + "-rm"}, ["csc-dt-action-btn", "csc-dt-action-del-sel"], null, $$ldiv);
        $$inputRemove.innerHTML = SideMLManager.get("common.delete");
        if (bc.config.disabled || bc.bf.isDisabled()) {
            $$.css($$inputRemove, {"opacity": "0.5", "cursor": "default"});
        } else {
            $$inputRemove.onclick = function () {
                bc.removeSelectedRows();
            };
        }
    }
    if (config.showActionButtons && this.config.rfrshBtn) {
        var $$inputRefresh = $$.create("SPAN", {id: this.config.id + "-rfrsh"}, ["csc-dt-action-btn", "csc-dt-action-rfrsh"], null, $$ldiv);
        $$inputRefresh.innerHTML = SideMLManager.get("common.refresh");
        if (bc.config.disabled || bc.bf.isDisabled()) {
            $$.css($$inputRefresh, {"opacity": "0.5", "cursor": "default"});
        } else {
            $$inputRefresh.onclick = function () {
                if (bf.$CS$ && bf.$CS$.ds) {
                    bf.setDataSource(bf.$CS$.ds.sn, bf.$CS$.ds.params, bf.$CS$.ds.options, bf.$CS$.ds.callback);
                } else {
                    if (bc.rerender) {
                        bc.rerender();
                    } else {
                        bc.reRender();
                    }
                }
            };
        }
    }

    if (config.showActionButtons && this.config.srchBtn) {
        var $$inputSearch = $$.create("SPAN", {id: this.config.id + "-search"}, ["csc-dt-action-btn", "csc-dt-action-search"], null, $$rdiv);
        var popupOpened = false;

        $$inputSearch.onclick = function () {
            $$.remove(config.id + "-searchContainer");
            var opened = this.getAttribute("opened");
            if (opened) {
                $$.rmAttr(this, "opened");
                return;
            } else {
                this.setAttribute("opened", "yes");
                $$.rmAttr(config.id + "-modify", "opened");
            }
            $$.remove(config.id + "-metaContainer");

            var top = (bc.$$title ? bc.$$title.offsetHeight : 0) + (bc.$$action.offsetHeight);
            var $$searchContainer = $$.create("DIV", {id: bc.config.id + "-searchContainer"}, "csc-dt-search-cont", {top: top + "px"/*, height: (bc.$$rhead.offsetHeight+bc.$$rbody.offsetHeight+"px")*/}, bc.$$table);
            var $$htable = $$.create("TABLE", null, null, {width: "100%"}, $$searchContainer);
            var $$contentDiv = $$.create("DIV", null, "csc-dt-meta-content", null, $$searchContainer);
            var $$ctable = $$.create("TABLE", null, null, {width: "100%"}, $$contentDiv);
            var $$tbody = $$.create("TBODY", null, null, null, $$ctable);
            var $$buttonsDiv = $$.create("DIV", null, "csc-dt-search-btns", {width: "100%"}, $$searchContainer);

            var components = [];

            var $$tr = $$.create("TR", undefined, "csc-table-searchpanel-header", undefined, $$htable);

            var $$th = $$.create("TH");
            $$th.innerHTML = SideMLManager.get("common.title");
            $$tr.appendChild($$th);

            $$th = $$.create("TH");
            $$th.innerHTML = SideMLManager.get("common.start");
            $$tr.appendChild($$th);

            $$th = $$.create("TH");
            $$th.innerHTML = SideMLManager.get("common.finish");
            $$tr.appendChild($$th);

            $$th = $$.create("TH");
            $$th.innerHTML = SideMLManager.get(bc, "searchCriteria");
            $$tr.appendChild($$th);

            var options = [SideMLManager.get(bc, "searchNoCriteria"),
                SideMLManager.get("common.searchEquals"),
                SideMLManager.get("common.searchNotEquals"),
                SideMLManager.get("common.searchLessThan"),
                SideMLManager.get("common.searchGreaterThan"),
                SideMLManager.get("common.searchLessThanOrEquals"),
                SideMLManager.get("common.searchGreaterThanOrEquals"),
                SideMLManager.get("common.searchIncludes"),
                SideMLManager.get("common.searchExcludes")];
            var c = 0;

            function drawSearchTable(parent, force) {
                if (parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-BUTTON" || parent.bcRef.typeName === "CSC-HIDDEN" || !parent.bcRef.config.visible)) {
                    return;
                }
                // colmodelmeta'da invisible'sa geç.
                if (bc.config.useColModelMeta && bc.userMeta) {
                    for (var i = 0; i < bc.userMeta.length; i++) {
                        if ((parent.getMemberName() === bc.userMeta[i].name) && (bc.userMeta[i].visibility === false)) {
                            return;
                        }
                    }
                }

                var memberConfig = parent.getConfig();
                if (!memberConfig.layoutConfig || ( memberConfig.layoutConfig && ( (memberConfig.layoutConfig.searchable === undefined || memberConfig.layoutConfig.searchable === true) || force ) )) {
                    var $$tr = $$.create("TR");
                    $$tbody.appendChild($$tr);

                    var $$th = $$.create("TD");
                    $$th.innerHTML = memberConfig.label + " : ";
                    $$tr.appendChild($$th);

                    $$th = $$.create("TD");

                    var startMemberConfig = csCloneObject(memberConfig, true);
                    delete startMemberConfig.value;
                    BFEngine.newDefinition(parent.$CS$.definition.BF_NAME + "_SEARCH_START", parent.$CS$.definition.BC_REF, parent.members, startMemberConfig, parent.bcRef.events);
                    var clonedParentStart = BFEngine.create({
                        name: parent.$CS$.name + "SearchStart",
                        BF: parent.$CS$.definition.BF_NAME + "_SEARCH_START"
                    });
                    clonedParentStart.setReadonly(false, undefined, true);
                    clonedParentStart.setConfig("forceEnable", true);

                    // Relative Ref Data'da parent üzerinden getCloudInfo'nun çalışabilmesi için
                    clonedParentStart.$CS$.parent = parent.getParent();

                    SIDENavigator.renderToDiv($$th, clonedParentStart);

                    // End Kısmı
                    var endMemberConfig = csCloneObject(startMemberConfig, true);
                    var clonedParentEnd;
                    var newId = BCEngine.newId();

                    $$tr.appendChild($$th);
                    $$th = $$.create("TD");

                    endMemberConfig.id = newId;

                    if (parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-CHECKBOX")) {	// Bazı bileşenleri tek çizmek için.
                        newId = null;
                    } else {
                        BFEngine.newDefinition(parent.$CS$.definition.BF_NAME + "_SEARCH_END", parent.$CS$.definition.BC_REF, parent.members, endMemberConfig, parent.bcRef.events);
                        clonedParentEnd = BFEngine.create({
                            name: parent.$CS$.name + "SearchEnd",
                            BF: parent.$CS$.definition.BF_NAME + "_SEARCH_END"
                        });
                        clonedParentEnd.setReadonly(false, undefined, true);
                        clonedParentEnd.setConfig("forceEnable", true);

                        // Relative Ref Data'da parent üzerinden getCloudInfo'nun çalışabilmesi için
                        clonedParentEnd.$CS$.parent = parent.getParent();

                        SIDENavigator.renderToDiv($$th, clonedParentEnd);
                    }

                    $$tr.appendChild($$th);

                    // Kriter Kısmı
                    $$th = $$.create("TD");
                    var comboId = "combo-" + c;
                    c++;
                    var $$combo = $$.create("SELECT", {id: comboId}, "csc-combobox", undefined, $$th);
                    for (var i = 0; i < options.length; i++) {
                        var $$option = $$.create("OPTION", i === 0 ? undefined : {value: i}, undefined, undefined, $$combo);
                        $$option.innerHTML = options[i];
                    }
                    $$tr.appendChild($$th);

                    var obj = {};
                    obj.start = clonedParentStart;
                    obj.end = clonedParentEnd;
                    obj.name = parent.getMemberName();
                    obj.combo = comboId;
                    obj.type = parent.bcRef.typeName;
                    components.push(obj);

                    // Bir önceki arama değerleri set ediliyor.
                    if (bc.config.holdOldSearchValues && bc.datasForSearch && bc.datasForSearch[obj.name]) {
                        obj.start.setValue(bc.datasForSearch[obj.name][0]);
                        obj.end.setValue(bc.datasForSearch[obj.name][1]);
                        $$.byid(obj.combo).selectedIndex = options.indexOf(bc.datasForSearch[obj.name][2]);
                    }
                }
            }

            for (var member in bf.members) {
                if (!bf.members[member].isContainer()) {
                    drawSearchTable(bf.members[member]);
                } else if (bf.members[member].isContainer() && (!bf.members[member].getConfig().isActionBar && bf.members[member].getConfig().layout === "CSC-TABLE-ROW")) {
                    var tableRow = bf.members[member].members;
                    for (var member in tableRow) {
                        drawSearchTable(tableRow[member]);
                    }
                    break;
                }
            }

            // sonradan eklenenleri çizmek için.
            if (bc.addedToSearchPanel) {
                for (var member in bf.members) {
                    if (!bf.members[member].isContainer()) {
                        if (bc.addedToSearchPanel.indexOf(member) !== -1) {
                            drawSearchTable(bf.members[member], true);
                        }
                    } else if (bf.members[member].isContainer() && (!bf.members[member].getConfig().isActionBar && bf.members[member].getConfig().layout === "CSC-TABLE-ROW")) {
                        var tableRow = bf.members[member].members;
                        for (var member in tableRow) {
                            if (bc.addedToSearchPanel.indexOf(member) !== -1) {
                                drawSearchTable(tableRow[member], true);
                                break;
                            }
                        }
                    }
                }
            }

            var $$searchButton = $$.create("INPUT", {type: "button", value: SideMLManager.get("common.search")});
            $$searchButton.onclick = function () {
                if (bc.config.searchService) {
                    bc.datasForSearch = {}
                    for (var i = 0; i < components.length; i++) {
                        var start = components[i].start ? (components[i].start).getValue() : "";
                        var end = components[i].end ? (components[i].end).getValue() : "";
                        var combo = options[$$.byid(components[i].combo).selectedIndex];
                        var type = components[i].type;

                        if (start == "" || combo == "-----") {
                            continue;
                        }
                        bc.datasForSearch[components[i].name] = [start, end, combo, type];
                    }

                    bc.searchParams = bc.datasForSearch;

                    bf.fire("onbefore-search");

                    bf.setDataSource(config.searchService, {
                        request: bc.datasForSearch,
                        extraParams: bc.esparams
                    }, function () {
                        $$.css(bc.$$table, "position", "");
                        if ($$searchContainer.parentNode) {
                            $$searchContainer.parentNode.removeChild($$searchContainer);
                        }
                    });
                }
            };
            $$buttonsDiv.appendChild($$searchButton);

            var $$clearButton = $$.create("INPUT", {type: "button", value: SideMLManager.get("common.clear")});
            $$clearButton.onclick = function () {
                for (var i = 0; i < components.length; i++) {
                    if (components[i].start) {
                        components[i].start.clear();
                    }

                    if (components[i].end) {
                        components[i].end.clear();
                    }
                }

                for (var i = 0; i < $$tbody.childNodes.length; i++) {
                    var tr = $$tbody.childNodes[i].childNodes[3];
                    if (tr) {
                        var combo = $$.getChildHasClass(tr, "csc-combobox");
                        if (combo) {
                            combo.value = "-----";
                        }
                    }
                }
            };
            $$buttonsDiv.appendChild($$clearButton);

            var $$cancelButton = $$.create("INPUT", {type: "button", value: SideMLManager.get("common.cancel")});
            $$cancelButton.onclick = function () {
                $$.css($$searchContainer, "display", "none");
                $$.css(bc.$$table, "position", "");
                $$.rmAttr($$.byid(bc.config.id + "-search"), "opened");
                $$inputSearch.onclick = function () {
                    $$.css($$searchContainer, "display", $$searchContainer.style.display == "" ? "none" : "");
                    $$.css(bc.$$table, "position", "relative");
                    $$.attr($$.byid(bc.config.id + "-search"), "opened", $$searchContainer.style.display == "" ? "yes" : "");
                    $$.remove(config.id + "-metaContainer");
                    $$.rmAttr(config.id + "-modify", "opened");
                };
            };
            $$buttonsDiv.appendChild($$cancelButton);

            $$contentDiv.style.maxHeight = 300 + "px";
        };
    }

    if (config.useColModelMeta && !config.utilButtonsBottom) {
        var $$inputModify = $$.create("SPAN", {id: config.id + "-modify"}, ["csc-dt-action-btn", "csc-dt-action-modify"], null, $$rdiv);
        $$inputModify.onclick = function () {
            bc.renderMetaWindow(this);
        };
    }

    if (this.tableRowAsActionBar) {
        for (var mname in this.tableRowAsActionBar.members) {
            BFEngine.render(this.tableRowAsActionBar.members[mname], $$ldiv);
        }
    }
};

BC.prototype.saveUserMeta = function () {
    var bc = this;
    localStorage.setItem(bc.getSavePath(), JSON.stringify(bc.userMeta));
};

BC.prototype.getSavePath = function (rows) {
    var bf = this.bf, parent = bf.$CS$.parent, path = "";
    while (parent) {
        if (parent.bcRef.config.mainTab || parent.bcRef.typeName == "CSC-POPUP") {
            break;
        }
        if (!parent.isBusinessField()) {
            parent = parent.$CS$.parent;
            continue;
        }
        path += "#" + parent.getBusinessName();
        parent = parent.$CS$.parent;
    }
    if (!path) {
        path = bf.getBusinessName();
    }
    return path;
};

BC.prototype.add = function (rows) {
//	console.log("add row");
    for (var i = 0; i < rows.length; i++) {
        this.nrows.push(rows[i]);
    }
    BFEngine.renderRequest(this.bf);
};

/**
 * @function dirty
 * @description Satırı tekrar çizilecek şekilde işaretler
 * @param [rows]
 */
BC.prototype.dirty = function (rows) {
    for (var i = 0; i < rows.length; i++) {
        this.mrows.push(rows[i]);
    }
    BFEngine.renderRequest(this.bf);
};

BC.prototype.remove = function (rows) {
    var bc = this, bf = bc.bf, config = bc.config;
    for (var i = 0; i < rows.length; i++) {
        bc.rrows.push(rows[i]);

        for (var k = 0; k < bc.selecteds.length; k++) {
            if (bc.selecteds[k].rowid == rows[i].rowid) {
                bc.selecteds.splice(k, 1);
                break;
            }
        }
    }

    bc.clearSelectAll();

    var pnumber = bf.getCurrentPage();
    var start = config.page ? (pnumber - 1) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : 0;
    var end = config.page ? (pnumber) * (config.pageNum || DT_DEFAULT_PAGE_ROW_COUNT) : bf.tmembers.length;
    this.bf.saveState();
    this.rerenderTable(start, end);
};

BC.prototype.isSelected = function (rowid) {
    var found = false;
    for (var i = 0; i < this.selecteds.length; i++) {
        if (this.selecteds[i].rowid == rowid) {
            return true;
        }
    }
    return false;
};

BC.prototype.hover = function (rowid, hover, direction) {
    //TODO mahmuty soonraki/önceki sayfaya geçiş yapılmalı
    var $$lbody = this.$$lbody, $$rbody = this.$$rbody, $$tr, bc = this, tmembers = bc.bf.tmembers;
    if (!tmembers.length) {
        return;
    }
    if (direction) {
        rowid = bc.hrowid || tmembers[0].rowid;
        for (var i = 0; i < tmembers.length; i++) {
            if (tmembers[i].rowid == rowid) {
                if (direction == "up") {
                    if (i == 0) {
                        return;
                    }
                    rowid = tmembers[i - 1].rowid;
                    break;
                } else {//direction down
                    if (i == tmembers.length - 1) {
                        return;
                    }
                    rowid = tmembers[i + 1].rowid;
                    break;
                }
            }
        }
    }
    if (hover) {
        if (bc.hrowid) {
            $$.rmClass($$.getChildHasAttr($$lbody, "rowid", bc.hrowid), "row-over");
            $$.rmClass($$.getChildHasAttr($$rbody, "rowid", bc.hrowid), "row-over");
        }
        $$.addClass($$.getChildHasAttr($$lbody, "rowid", rowid), "row-over");
        $$.addClass($$.getChildHasAttr($$rbody, "rowid", rowid), "row-over");
        bc.hrowid = rowid;
    } else {
        $$.rmClass($$.getChildHasAttr($$lbody, "rowid", rowid), "row-over");
        $$.rmClass($$.getChildHasAttr($$rbody, "rowid", rowid), "row-over");
        if (bc.hrowid && bc.hrowid != rowid) {
            $$.rmClass($$.getChildHasAttr($$lbody, "rowid", bc.hrowid), "row-over");
            $$.rmClass($$.getChildHasAttr($$rbody, "rowid", bc.hrowid), "row-over");
        }
        bc.hrowid = null;
    }
};

BC.prototype.selectAll = function (select) {
    var bc = this, bf = bc.bf, config = bc.config, $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, $$trs;
    if (select === undefined) {
        select = true;
    }
    this.config.isSelectAllChecked = select;
    var $$sall = $$.byid(config.id + "-sall");
    if ($$sall) {
        $$sall.checked = select;
    } else if (select) {
        this.selectAllOnRender = select;
    }
    bc.selecteds = [];
    if (select) {
        for (var i = 0; i < bf.tmembers.length; i++) {
            bc.selecteds.push(bf.tmembers[i]);
        }
    }

    if ($$lbody) {
        $$trs = $$.childs($$lbody, "DIV");
        for (var i = 0; i < $$trs.length; i++) {
            if (select) {
                $$.addClass($$trs[i], "dt-selected");
            } else {
                $$.rmClass($$trs[i], "dt-selected");
            }
            var $$td = $$.getChildHasClass($$trs[i], "dt-select-td");
            if ($$td) {
                var $$incell = $$.child($$td, "DIV");
                var $$input = $$.child($$incell, "INPUT");
                if ($$input) {
                    $$input.checked = (select !== false);
                }
            }
        }
    }
    if ($$rbody) {
        $$trs = $$.childs($$rbody, "DIV");
        for (var i = 0; i < $$trs.length; i++) {
            if (select) {
                $$.addClass($$trs[i], "dt-selected");
            } else {
                $$.rmClass($$trs[i], "dt-selected");
            }
            var $$td = $$.getChildHasClass($$trs[i], "dt-select-td");
            if ($$td) {
                var $$incell = $$.child($$td, "DIV");
                var $$input = $$.child($$incell, "INPUT");
                if ($$input) {
                    $$input.checked = (select !== false);
                }
            }
        }
    }

    bf.fire("onselectall", select);
};

BC.prototype.clearSelectAll = function () {
    var $$input = $$.byid(this.config.id + "-sall");
    if ($$input) {
        $$input.checked = false;
    }
};

BC.prototype.select = function (row, select, inner) {
    var bc = this, bf = bc.bf;
    var $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, $$tr, $$td;
    if (typeof row == "string") {
        for (var i = 0; i < bf.tmembers.length; i++) {
            if (bf.tmembers[i].rowid == row) {
                row = bf.tmembers[i];
                break;
            }
        }
    }

    var rowid = row.rowid, found = false;
    for (var i = 0; i < this.selecteds.length; i++) {
        if (this.selecteds[i].rowid == rowid) {
            found = true;
            if (!select) {
                this.selecteds.splice(i, 1);
            }
            break;
        }
    }
    if ((select && found) || (!select && !found)) {
        return;
    }

    //left body
    if ($$lbody) {
        $$tr = $$.getChildHasAttr($$lbody, "rowid", rowid);
        if (select) {
            $$.addClass($$tr, "dt-selected");
        } else {
            $$.rmClass($$tr, "dt-selected");
        }
        if (!inner) {
            var $$td = $$.getChildHasClass($$tr, "dt-select-td");
            if ($$td) {
                var $$incell = $$.child($$td, "DIV");
                var $$input = $$.child($$incell, "INPUT");
                if ($$input) {
                    $$input.checked = (select !== false);
                }
            }
        }
    }
    //right body
    $$tr = $$.getChildHasAttr($$rbody, "rowid", rowid);
    if (select) {
        $$.addClass($$tr, "dt-selected");
    } else {
        $$.rmClass($$tr, "dt-selected");
    }

    if (this.config.multiselect === false) {
        if (select) {
            this.selecteds = [row];
        } else {
            this.selecteds = [];
        }
        var $$trs = $$.childs($$lbody, "DIV");
        for (var i = 0; i < $$trs.length; i++) {
            var trRowid = $$trs[i].getAttribute("rowid");
            if (trRowid == rowid) {
                continue;
            }
            if ($$.hasClass($$trs[i], "dt-selected")) {
                $$.rmClass($$trs[i], "dt-selected");
                var $$td = $$.getChildHasClass($$trs[i], "dt-select-td");
                if ($$td) {
                    var $$incell = $$.child($$td, "DIV");
                    var $$input = $$.child($$incell, "INPUT");
                    if ($$input && $$input.checked) {
                        $$input.checked = false;
                    }
                }
            }
        }
        $$trs = $$.childs($$rbody, "DIV");
        for (var i = 0; i < $$trs.length; i++) {
            var trRowid = $$trs[i].getAttribute("rowid");
            if (trRowid == rowid) {
                continue;
            }
            if ($$.hasClass($$trs[i], "dt-selected")) {
                $$.rmClass($$trs[i], "dt-selected");
            }
        }
    } else {
        if (select) {
            this.selecteds.push(row);
        }
    }

    if (!inner) {
        var row = this.bf.getRow(this.bf.getIndexFromRowId(rowid));
        this.bf.fire("rowselected", row, select);
    }

    bc.clearSelectAll();
};

BC.prototype.getSelectedRows = function () {
    var copy = [];
    for (var i = 0; i < this.selecteds.length; i++) {
        copy.push(this.selecteds[i]);
    }
    return copy;
};

/**
 * @function prepareMetadata
 * @description CellInfo cinfo örneği:
 * @example
 * Row 1: [adi, soyadi#colspan(2)]
 * Row 2: [okulu, notu, sonuc]
 * [
 *  { ctype: "hover"},
 *  { ctype: "rn"},
 *  { ctype: "sel"},
 *  { ctype: "data", i: 0, width: 40, rows: [{mname: "adi"}, {mname: "okulu"}]},
 *  { ctype: "data", i: 1, width: 120, rows: [{mname: "soyadi", col: 1}, {mname: "notu"}]},
 *  { ctype: "data", i: 2, width: 30, rows: [{mname: "soyadi", col: 2}, {mname: "sonuc"}]},
 *  @param [$$table]
 *  @param [pwidth]
 */

BC.prototype.prepareMetadata = function ($$table, pwidth) {
    var config = this.config, bc = this, bf = bc.bf, userMeta = bc.userMeta || [];
    if (!bc.userMeta) {
        bc.userMeta = userMeta;
    }
    this.metadata = {
        rowNumbers: config.rownumbers,
        selectable: config.selectable,
        selectall: config.selectall,
        hover: config.hovercell,
        treeColumn: config.treeColumn,
        treeIndex: -1,

        refRowIndex: 0,//width hesaplmalarında referans alınacak row'un index'i
        rows: []
    };
    this.cinfo = [];//renderred cell info
    var meta = this.metadata;

    function prepareMemberMeta(mname, member, mconf, mconfLayout, userMeta) {
        var mmeta = {
            mname: mname,
            label: mconf.title || mconf.label,
            width: mconfLayout.columnWidth || 10,
            minw: mconfLayout.minw,
            sort: mconfLayout.sortable === undefined ? config.sortable : mconfLayout.sortable,
            filter: mconfLayout.filter,
            ftype: mconfLayout.ftype || "like",
            visible: member.isVisible(),
            align: mconfLayout.cellAlign
        };
        if (member.getTypeName() == "CSC-POPUP") {
            mmeta.visible = false;
        }
        if (mconfLayout.overflow) {
            mmeta.overflow = mconfLayout.overflow;
        }
        if (mconfLayout.vertAlign) {
            mmeta.valign = mconfLayout.vertAlign;
        }
        if (mconfLayout.colSpan) {
            mmeta.cs = mconfLayout.colSpan;
        }
        var modelFound = false;
        for (var k = 0; k < userMeta.length; k++) {
            if (mname == userMeta[k].name) {
                if (userMeta[k].visibility === false) {
                    mmeta.visible = false;
                } else if (userMeta[k].visibility === true) {
                    mmeta.visible = true;
                }
                if (userMeta[k].title) {
                    mmeta.label = userMeta[k].title;
                }
                if (userMeta[k].width) {
                    mmeta.width = userMeta[k].width;
                }
                modelFound = true;
                break;
            }
        }
        if (!modelFound) {
            userMeta.push({
                name: mname,
                defTitle: mmeta.label
            });
        }
        return mmeta;
    }

    meta.rows.push([]);
    var i = 0, rowIndex = 0;
    //TODO mahmuty aşağısı çok satır için düzenlenecek, şuan tek satır olarak yapıldı
    for (var mname in bf.members) {
        if (mname == config.treeColumn) {
            meta.treeIndex = i;
        }
        var member = bf.members[mname], mconf = member.getConfig(), mconfLayout = mconf.layoutConfig || {};

        if (member.getTypeName() == "CSC-TABLE-TOTAL-ROW") {
            this.totalRow = member;
            continue;
        }

        if (member.getTypeName() == "CSC-TABLE-ROW") {
            if (mconf.isActionBar) {//TODO mahmuty actionbar içinde member olduğu durum ele alınmalı mı?
                this.tableRowAsActionBar = member;
            } else {
                if (rowIndex > 0) {
                    meta.rows.push([]);
                }
                var mcounter = 0;
                for (var innerMname in member.members) {
                    var innerMember = member.members[innerMname], mconf = innerMember.getConfig(),
                        mconfLayout = mconf.layoutConfig || {};
                    meta.rows[rowIndex].push(prepareMemberMeta(innerMname, innerMember, mconf, mconfLayout, userMeta));
                    mcounter++;
                }
                rowIndex++;
            }
            continue;
        }

        meta.rows[rowIndex].push(prepareMemberMeta(mname, member, mconf, mconfLayout, userMeta));
        i++;
        //bc.userMeta.push({name: mname});
    }
    return meta;
};

BC.prototype.initCInfo = function ($$table, pwidth) {
    var bc = this, meta = bc.metadata, cinfo = bc.cinfo = [];
    if (meta.hover) {
        cinfo.push({ctype: "hover"});
    }
    if (meta.rowNumbers) {
        cinfo.push({ctype: "rn"});
    }
    if (meta.selectable) {
        cinfo.push({ctype: "sel"});
    }

    var i = 0, n = 0;
    //TODO mahmuty aşağısı çok satır için düzenlenecek, şuan tek satır olarak yapıldı
    for (var i = 0; i < meta.rows[0].length; i++) {
        rowMeta = meta.rows[0][i];
        if (rowMeta.visible) {
            cinfo.push({ctype: "data", i: n++, rmeta: rowMeta, rows: [{mname: rowMeta.mname}]});
        }
    }
};

BC.prototype.bindHeaderEvents = function ($$table, $$rhead) {
    if (!$$rhead) {
        return;
    }
    var bc = this, cinfo = bc.cinfo, config = bc.config;
    var $$hrow = $$.child($$rhead, "DIV");
    var tableLeft = $$.offset($$rhead).left;//  csdu.findPositionX($$table);
    function findColumnInfo(cinfo, eventX) {
        var total = tableLeft;
        eventX += $$rhead.scrollLeft;
        for (var i = 0; i < cinfo.length; i++) {
            if (cinfo[i].ctype == "rn" || cinfo[i].ctype == "sel") {
                continue;
            }
            total += cinfo[i].width;
            if (total >= eventX) {
                return {l: total - cinfo[i].width, r: total, rmeta: cinfo[i].rmeta};
            }
        }
    }

    var hoverMname = null;
    $$rhead.onmousemove = function (e) {
        if ($$rhead.cs_ds) {
            return;
        }
        var info = findColumnInfo(bc.cinfo, e.pageX);
        if (!info || !info.rmeta) {
            $$rhead.cs_mv = false;
            $$rhead.style.cursor = "";
            var $$td = $$.getChildHasAttr($$hrow, "rel", hoverMname);
            $$.rmClass($$td, "csc-dt-th-hover");
            hoverMname = null;
            return;
        }
        if (hoverMname != info.rmeta.mname) {
            var $$td = $$.getChildHasAttr($$hrow, "rel", hoverMname);
            $$.rmClass($$td, "csc-dt-th-hover");
            hoverMname = info.rmeta.mname;
            $$td = $$.getChildHasAttr($$hrow, "rel", hoverMname);
            $$.addClass($$td, "csc-dt-th-hover");
        }
        if ((info.r - 8) < (e.pageX + $$rhead.scrollLeft)) {
            if ($$rhead.cs_mv) {
                return;
            }
            $$rhead.cs_mv = info;
            $$rhead.style.cursor = "e-resize";
        } else {
            if (!$$rhead.cs_mv) {
                return;
            }
            $$rhead.cs_mv = false;
            $$rhead.style.cursor = "";
        }
    };
    $$rhead.onmouseout = function (e) {
        if (e.target == $$rhead || e.target == $$hrow || e.target.className.indexOf("cell") >= 0) {
            $$rhead.cs_mv = false;
            $$rhead.style.cursor = "";
            var $$td = $$.getChildHasAttr($$hrow, "rel", hoverMname);
            $$.rmClass($$td, "csc-dt-th-hover");
            hoverMname = null;
        }
    };
    $$rhead.onmousedown = function (e) {
        var info = $$rhead.cs_mv;
        if (info && info.rmeta) {
            e.preventDefault();
            var firstMousePosition = e.pageX;

            var meta = info.rmeta, mname = meta.mname;
            $$.body().style.cursor = "col-resize";
            var $$div = $$.create("DIV", null, null, {
                position: "absolute",
                left: e.pageX + "px",
                top: (e.pageY - e.offsetY) + "px",
                height: this.offsetHeight + "px",
                backgroundColor: "#444",
                width: "1px"
            });
            $$.body().appendChild($$div);
            window.onmousemove = function (ev) {
                var dist = info.r - (firstMousePosition - ev.pageX);
                if (dist < info.l || ev.pageX - (tableLeft + $$table.offsetWidth) > 50) {	//ADogan - Son kolonun genişletilebilmesi için sağdaki sınırı genişlettim.
                    $$.remove($$div);
                    $$.body().style.cursor = "";
                    window.onmouseup = null;
                    window.onmousemove = null;
                    return;
                }
                $$div.style.left = dist - $$rhead.scrollLeft + "px";
            };
            window.onmouseup = function (ev) {
                meta.width = (ev.pageX - info.l + $$rhead.scrollLeft) + "px";
                var userMeta = bc.userMeta;
                if (config.saveMeta && userMeta) {
                    for (var k = 0; k < userMeta.length; k++) {
                        if (mname == userMeta[k].name) {
                            userMeta[k].width = meta.width;
                            bc.saveUserMeta();
                            break;
                        }
                    }
                }
                $$.remove($$div);
                $$.body().style.cursor = "";
                window.onmouseup = null;
                window.onmousemove = null;
//				bc.prepareCSS();
                bc.fixTable();
            };
        }
    };
    $$rhead.ondragstart = function (e) {
        var info = findColumnInfo(bc.cinfo, e.pageX);
        if (info && info.rmeta) {
            this.cs_ds = true;//set drag start true
            bc.dragMember = info.rmeta.mname;
            e.dataTransfer.setData("mname", bc.dragMember);
        }
    };
    $$rhead.ondragover = function (e) {
        var info = findColumnInfo(bc.cinfo, e.pageX);
        if (info && info.rmeta) {
            //console.log(bc.dragOverMember +"#"+info.rmeta.mname);
            if (bc.dragMember == info.rmeta.mname || bc.dragOverMember != info.rmeta.mname) {
                $$.rmClass($$.getChildHasAttr($$hrow, "rel", bc.dragOverMember), "dt-col-gragover");
            }
            if (bc.dragMember != info.rmeta.mname) {
                $$.addClass($$.getChildHasAttr($$hrow, "rel", info.rmeta.mname), "dt-col-gragover");
                bc.dragOverMember = info.rmeta.mname;
                e.preventDefault();
                return;
            }
        }
        return false;
    };

    $$rhead.ondragleave = function (e) {
        this.cs_ds = null;//set drag start null
        $$.rmClass($$.getChildHasAttr($$hrow, "rel", bc.dragOverMember), "dt-col-gragover");
    };
    $$rhead.ondrop = function (e) {
        this.cs_dt = null;//set drag start null
        var mname = bc.dragOverMember;
        bc.dragOverMember = null;
        if (bc.dragMember == mname || !mname) {
            $$.rmClass($$.getChildHasAttr($$hrow, "rel", bc.dragOverMember), "dt-col-gragover");
            return;
        }
        var meta = bc.metadata, dragMeta, reverse = false;
        for (var i = 0; i < meta.rows[0].length; i++) {
            if (meta.rows[0][i].mname == mname) {
                reverse = true;
            }
            if (meta.rows[0][i].mname == bc.dragMember) {
                dragMeta = meta.rows[0][i];
                meta.rows[0].splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < meta.rows[0].length; i++) {
            if (meta.rows[0][i].mname == mname) {
                meta.rows[0].splice(reverse ? i : i + 1, 0, dragMeta);
                break;
            }
        }
        bc.bf.rerender();
    };
};

BC.prototype.renderHeaders = function ($$table, $$lhead, $$rhead) {
    //TODO column header olduğunda ne yapmalı?
    var bc = this, bf = bc.bf, meta = bc.metadata, colCounter = 0, $$td, config = bc.config;
    if ($$lhead) {
        var $$tr = $$.create("DIV", null, ["hrow"], null, $$lhead);
        if (meta.hover) {
            $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-hover"], null, $$tr);
            $$.create("DIV", null, ["in-cell"], null, $$td);//in-cell
        }
        if (meta.rowNumbers) {
            $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-rn"], null, $$tr);
            $$.create("DIV", null, ["in-cell"], null, $$td);//in-cell
        }
        if (meta.selectable) {
            $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++), "dt-select-td"], null, $$tr);
            $$td = $$.create("DIV", null, ["in-cell"], null, $$td);//in-cell
            if (meta.selectall) {
                var $$check = $$.create("INPUT", {
                    type: "checkbox",
                    id: config.id + "-sall",
                    checked: this.config.isSelectAllChecked || false
                }, "csc-dt-selectall", null, $$td);
                if (config.disabled/* || config.readonly*/) {
                    $$check.setAttribute("disabled", "true");
                }

                if (this.selectAllOnRender) {
                    $$check.checked = this.selectAllOnRender;
                    delete this.selectAllOnRender;
                }

                $$check.onclick = function () {
                    bc.selectAll(this.checked);
                };
                if (bc.config.disabled || bc.bf.isDisabled()) {
                    $$check.disabled = true;
                }
            }
        }
        if (meta.treeIndex >= 0) {
            $$td = $$.create("DIV", null, ["cell", "c" + (colCounter++)], null, $$tr);
            $$td = $$.create("DIV", null, ["in-cell"], null, $$td);//in-cell
            $$td.innerHTML = meta.rows[meta.refRowIndex][meta.treeIndex].label || "";
        }
        //TODO tree column ele alınmalı
    }
    var $$tr = $$.create("DIV", null, ["hrow"], null, $$rhead), $$cell;
    for (var i = 0; i < meta.rows[meta.refRowIndex].length; i++) {
        var colMeta = meta.rows[meta.refRowIndex][i], mname = colMeta.mname;
        if (mname == meta.treeColumn || colMeta.visible === false) {
            continue;//tree column left head'de yer alır
        }
        $$td = $$.create("DIV", {draggable: true, rel: mname}, ["cell", "c" + (colCounter++)], null, $$tr);
        $$td = $$.create("DIV", null, ["in-cell"], null, $$td);//in-cell
        $$td.innerHTML = colMeta.label || "";
        if (bc.filters[mname] && bc.filters[mname].rendered) {
            bc.renderFilterInput($$td, mname, colMeta.ftype);
        }
        if (colMeta.sort || colMeta.filter) {
            var $$utilDiv = $$.create("DIV", {mname: colMeta.mname}, "csc-dt-th-util", null, $$td.parentNode);
            $$utilDiv.colMeta = colMeta;
            $$utilDiv.onclick = function (e) {
                e.stopPropagation();
                var $$utilDiv = this;
                var mname = this.getAttribute("mname"), colMeta = this.colMeta;
                var items = [];
                if (colMeta.sort) {
                    items.push({
                        label: SideMLManager.get("common.ascendingOrder"), icon: "css/bc-style/img/order-asc.png",
                        action: function () {
                            bc.bf.sort(mname, "asc");
                        }
                    });
                    items.push({
                        label: SideMLManager.get("common.descendingOrder"), icon: "css/bc-style/img/order-desc.png",
                        action: function () {
                            bc.bf.sort(mname, "desc");
                        }
                    });
                }
                if (colMeta.filter) {
                    var rendered = bc.filters[mname] && bc.filters[mname].rendered;
                    items.push({
                        label: rendered ? SideMLManager.get("common.removeFilter") : SideMLManager.get("common.filter"),
                        icon: "css/bc-style/img/filter.png",
                        action: function () {
                            if (rendered !== true) {
                                var $$incell = $$.child($$utilDiv.parentNode, "DIV")
                                bc.renderFilterInput($$utilDiv.parentNode, mname, "like");
                            } else {
                                var $$incell = $$.child($$utilDiv.parentNode, "DIV")
                                bc.unrenderFilterInput($$utilDiv.parentNode, mname, "like");
                            }
                        }
                    });
                }
                csdu.contextMenu({
                    left: csdu.findPositionX(this) - 124 - $$rhead.scrollLeft,
                    top: e.pageY,
                    clazz: "csc-dt-th-util-popup",
                    items: items
                });
            };
        }
    }

    // başlıkları arama paneline eklemek için.
    if (bc.config.srchBtn) {
        var $$headerTr = $$rhead.children[0];
        for (var memberName in bf.members) {
            var member = bf.members[memberName];
            var memberConfig = member.getConfig();
            if (memberConfig) {
                var memberLayoutConfig = memberConfig.layoutConfig;
                if (memberLayoutConfig && memberLayoutConfig.searchable === false) {
                    var $$header = $$.getChildHasAttr($$headerTr, "rel", memberName);
                    if ($$header) {
                        $$header.addEventListener("contextmenu", function (e) {
                            e.preventDefault();
                            if (!$$.byid(bc.config.id + "-addSearchPanel")) {
                                var targetMemberName = e.target.getAttribute("rel");
                                var $$addSearchPanelSection = $$.create("DIV", {
                                    id: bc.config.id + "-addSearchPanel",
                                    rel: targetMemberName
                                }, "csc-dt-searchPanel-add", {"top": e.y + "px", "left": e.x + "px"});

                                if (!bc.addedToSearchPanel) {
                                    bc.addedToSearchPanel = [];
                                }

                                var indice = bc.addedToSearchPanel.indexOf(targetMemberName);

                                if (indice == -1) {
                                    $$addSearchPanelSection.innerHTML = SideMLManager.get("common.addToSearchPanel")

                                    $$addSearchPanelSection.onclick = function () {
                                        bc.addedToSearchPanel.push(this.getAttribute("rel"));
                                        $$addSearchPanelSection.parentNode.removeChild($$addSearchPanelSection);
                                    };
                                } else {
                                    $$addSearchPanelSection.innerHTML = SideMLManager.get(bc, "removeFromSearchPanel")

                                    $$addSearchPanelSection.onclick = function () {
                                        bc.addedToSearchPanel.splice(indice, 1);
                                        $$addSearchPanelSection.parentNode.removeChild($$addSearchPanelSection);
                                    };
                                }

                                document.getElementsByTagName("body")[0].appendChild($$addSearchPanelSection);

                                window.addEventListener("click", function (e) {
                                    if (e.target.className !== "csc-dt-searchPanel-add" && $$addSearchPanelSection.parentNode) {
                                        $$addSearchPanelSection.parentNode.removeChild($$addSearchPanelSection);
                                    }
                                });
                                return false;
                            }
                        });
                    }
                }
            }
        }
    }
};

BC.prototype.renderFilterInput = function ($$th, mname, ftype) {
    var value = "", bc = this, bf = bc.bf, config = bc.config;
    if (bc.filters[mname]) {
        value = bc.filters[mname].fvalue;
    }
    if (!bc.filters[mname]) {
        bc.filters[mname] = {};
    }
    bc.filters[mname].rendered = true;
    var $$div = $$.create("DIV", {id: config.id + "-filter-div"}, "csc-dt-filter-div");
    $$th.appendChild($$div);
    var $$br = $$.create("BR", {id: this.config.id + "-f-br-" + mname});
    if (ftype == "eq" || ftype == "like") {
        var $$input = $$.create("INPUT", {
            type: "text",
            rel: mname,
            value: value,
            id: this.config.id + "-f-input-" + mname
        }, "csc-dt-filter-input");
        $$div.appendChild($$input);
        $$input.onkeyup = function (event) {
            if (event.keyCode == 13) {
                var mname = this.getAttribute("rel");
                var value = this.value ? this.value : undefined;

                var fpath = "";
                var member = bf.members[mname];
                if (member) {
                    var memberConfig = member.getConfig();
                    fpath = memberConfig.layoutConfig.fpath;
                }

                bc.makeFilter(mname, ftype, value, fpath);
            }
        };
        $$input.focus();
    } else if (ftype == "cmb") {
        var fpath;
        var member = bc.bf.members[mname];
        if (member) {
            var memberConfig = member.getConfig();
            fpath = memberConfig.layoutConfig.fpath;
        }

        var valueMap = {};
        var options = "<option>------</option>";
        for (var i = 0; i < this.bf.tmembers.length; i++) {
            var row = this.bf.tmembers[i];
            var val = row.get(fpath || mname).getText();
            if (val) {
                valueMap[val] = true;
            }
        }
        for (var val in valueMap) {
            options += "<option value='" + val + "'>" + val + "</option>";
        }
        var $$select = $$.create("SELECT", {
            rel: mname,
            id: this.config.id + "-f-input-" + mname
        }, "csc-table-filter-select");
        $$select.innerHTML = options;
        $$select.value = value;
        $$th.appendChild($$br);
        $$th.appendChild($$select);
//		$$th.style.width = $$th.offsetWidth+"px";
        $$select.onchange = function (event) {
            var value = this.value ? this.value : undefined;

            var fpath;
            var mname = this.getAttribute("rel");
            var member = bc.bf.members[mname];
            if (member) {
                var memberConfig = member.getConfig();
                fpath = memberConfig.layoutConfig.fpath;
            }

            bc.makeFilter(mname, "eq", value, fpath);
        };
    } else if (ftype == "btw") {
        if (!value) {
            value = [];
        }
        var $th = $($$th);
        var $tarihStart = $("<input>").attr({
            rel: mname,
            rel2: "start",
            value: SIDEDateUtil.getFormattedDate(value[0] || "", "yyyymmdd", "dd/mm/yyyy"),
            id: this.config.id + "-f-input-" + mname
        }).addClass("csc-table-filter-date");
        var $tarihEnd = $("<input>").attr({
            rel: mname,
            rel2: "end",
            value: SIDEDateUtil.getFormattedDate(value[1] || "", "yyyymmdd", "dd/mm/yyyy"),
            id: this.config.id + "-f-input2-" + mname
        }).addClass("csc-table-filter-date");
        $th.append($$.create("BR", {id: this.config.id + "-f-br-" + mname}));
        $th.append($tarihStart);
        $tarihStart.datepicker({
            showButtonPanel: false,
            onSelect: function (date) {
                $tarihStart.val(date);
                var start = SIDEDateUtil.getFormattedDate(date, "dd/mm/yyyy", "yyyymmdd");
                var end = SIDEDateUtil.getFormattedDate($tarihEnd.val(), "dd/mm/yyyy", "yyyymmdd");
                bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
            }
        });
        $tarihStart[0].onchange = function () {
            var start = SIDEDateUtil.getFormattedDate(this.value, "dd/mm/yyyy", "yyyymmdd");
            var end = SIDEDateUtil.getFormattedDate($tarihEnd.val(), "dd/mm/yyyy", "yyyymmdd");
            bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
        };
        $th.append($$.create("BR", {id: this.config.id + "-f-br2-" + mname}));
        $th.append($tarihEnd);
        $tarihEnd.datepicker({
            showButtonPanel: false,
            onSelect: function (date) {
                $tarihEnd.val(date);
                var end = SIDEDateUtil.getFormattedDate(date, "dd/mm/yyyy", "yyyymmdd");
                var start = SIDEDateUtil.getFormattedDate($tarihStart[0].value, "dd/mm/yyyy", "yyyymmdd");
                bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
            }
        });
        $tarihEnd[0].onchange = function () {
            var end = SIDEDateUtil.getFormattedDate(this.value, "dd/mm/yyyy", "yyyymmdd");
            var start = SIDEDateUtil.getFormattedDate($tarihStart.val(), "dd/mm/yyyy", "yyyymmdd");
            bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
        };
    }

};


BC.prototype.unrenderFilterInput = function ($$th, mname, ftype) {
    var bc = this;
    $$th.style.width = "";
    var $$div = $$.byid(bc.config.id + "-filter-div");
    $$.remove($$div);

    bc.filters[mname].rendered = null;
    bc.makeFilter(mname, ftype, undefined);
};


BC.prototype.makeFilter = function (mname, ftype, fvalue, fpath) {
    var bc = this;
    if (mname) {
        bc.filters[mname].ftype = ftype;
        bc.filters[mname].fvalue = fvalue;
        bc.filters[mname].fpath = fpath;
    }

    var filters = [];
    for (var mname in bc.filters) {
        if (!bc.filters[mname].rendered) {
            continue;
        }
        filters.push({
            name: mname,
            type: bc.filters[mname].ftype,
            value: bc.filters[mname].fvalue,
            path: bc.filters[mname].fpath
        });
    }
    bc.bf.filter(filters);
};

BC.prototype.getPageRowCount = function () {
    return this.config.pageNum;
};

BC.prototype.excelExport = function () {
    var data, cmd, bc = this, bf = bc.bf;
    var exportInvisibleColumns = bc.config.exportInvisibleColumns;
    var excelFileFormat = bc.config.gridFileType, exportExcelFromDs = false;
    if (bc.excelExportButtonClicked) {
        CSPopupUTILS.MessageBox("You cannot export excel for the duration of this timeout: " + (getSideDefaults("excelExport-button-timeout") / 1000) % 60 + "sec.", {error: true});
        return;
    }
    bc.excelExportButtonClicked = true;
    setTimeout(function () {
        bc.excelExportButtonClicked = false;
    }, getSideDefaults("excelExport-button-timeout") || 100);

    bf.fire("onbeforeexcelexport");

    if (bf.$CS$.ds) {// datasource exist?
        cmd = "EXPORT_EXCEL_FROM_DS";
        data = csCloneObject(bf.$CS$.ds, true);
        exportExcelFromDs = true;
        if (data.params && data.params.pv) {
            data.params.pv.limit = 100000;
        }
    } else {
        cmd = "EXPORT_EXCEL";
        bf.$CS$.fromExcelExport = true; // ADogan - useValueInExcel özelliğini kullanabilmek için getText içerisine girdiğinde excel exporttan geldiğini bilsin diye.
        bf.$CS$.exportInvisibleColumns = exportInvisibleColumns;
        bf.$CS$.excelFileFormat = excelFileFormat;
        data = bf.getText();
        delete bf.$CS$.fromExcelExport;
        delete bf.$CS$.exportInvisibleColumns;
        delete bf.$CS$.excelFileFormat;
    }

    if (getSideDefaults("support-service-call-extra-params", bf.getModuleName()) && window.callParams && data) {
        if (!data.params) {
            data.params = {};
        }
        for (var pname in window.callParams) {
            data.params[pname] = window.callParams[pname];
        }
    }

    var bfname = bf.$CS$.definition.BF_NAME;
    var module = this.excelModule || bf.getModuleName();
    var cp = "", bfTmp = bf, parent = bf.getParent();
    do {
        if (parent) {
            if (parent.$CS$.CTX == "root" || parent.getConfig("mainTab")) {
                cp = bfTmp.getBusinessName(false) + (cp ? "." + cp : "");
                break;
            }
        }
        if (bfTmp.isBusinessField()) {
            cp = bfTmp.$CS$.name + (cp ? "." + cp : "");
        }
        if (!cp) {
            cp = bfTmp.$CS$.name;
        }
        if (parent) {
            bfTmp = parent;
            parent = parent.getParent();
        }
    } while (parent && parent.$CS$.CTX !== "root");
    var stdMsg = "Excel'e çıkarma işlemi başarızsız oldu.";
    SIDEUtil.downloadFileWithPost({
        cmd: cmd,
        s: "ş",//türkçe karakter problemi için
        jp: {
            metadata: bf.getMetaData(undefined, {exportInvisibleColumns: exportInvisibleColumns}, exportExcelFromDs),
            ds: data,
            filename: bc.efl,
            excelFileFormat: excelFileFormat,
            checkSpecialChars: bc.config.checkSpecialChars || false,
            config: this.excelConfig || undefined,
            sideLang: window.sideLang,
            cp: cp,
            page: cp.split(".")[0]
        }
    }, {
        url: SideModuleManager.getAppUrl(module, this.config.excelExportPath || "side-support-gridexport"),
        module: module,
        onload: !getSideDefaults("show-excel-export-errors") ? null : function (err) {
            if (!err) {
                CSPopupUTILS.MessageBox(stdMsg, {error: true});
            } else {
                try {
                    var errorObj = JSON.parse(err);
                    CSPopupUTILS.MessageBox(errorObj.messages[0].text, {error: true});
                } catch (e) {
                    CSPopupUTILS.MessageBox(stdMsg, {error: true});
                }
            }
        },
        onerror: !getSideDefaults("show-excel-export-errors") ? null : function () {
            CSPopupUTILS.MessageBox(stdMsg, {error: true});
        }
    });
};

BC.prototype.setExcelExportPath = function (path) {
    this.config.excelExportPath = path;
};

BC.prototype.renderFooter = function () {
    var bc = this, bf = this.bf, config = bc.config, $$spanPagingInfo;
    if (!bc.$$rbody || !bc.$$footer) {
        return;
    }
    var members = this.bf.fmembers || this.bf.tmembers;
    var page = this.pnumber, total = members.length;
    if (this.bf.$CS$.ds) {
        page = this.bf.$CS$.ds.page;
        total = this.bf.$CS$.ds.rowcount;
    }

    var $$footer = this.$$footer;
    $$footer.innerHTML = "";
    var $$footertable = $$.create("TABLE", null, null, null, $$footer);
    var $$tr = $$.create("TR", null, null, null, $$footertable);
    var $$leftTD = $$.create("TD", {rel: "l"}, null, null, $$tr);
    var $$centerTD = $$.create("TD", {rel: "c"}, null, null, $$tr);
    var $$rightTD = $$.create("TD", {rel: "r"}, null, null, $$tr);

    if (config.useColModelMeta && config.utilButtonsBottom) {
        var $btnsDiv = $$.create("DIV", null, "csc-dt-actions-div", null, $$leftTD);
        var $$inputModify = $$.create("SPAN", {id: config.id + "-modify"}, ["csc-dt-action-btn", "csc-dt-action-modify"], null, $btnsDiv);
        $$inputModify.onclick = function () {
            bc.renderMetaWindow(this);
            var $$metaWindow = $$.byid(bc.config.id + "-metaContainer");
            $$.css($$metaWindow, "bottom", $$.height(bc.$$hscroll) + $$.height(bc.$$footer) + "px");
            $$.css($$metaWindow, "top", "");
//			$$.css($$metaWindow, "left", "0px" );
            $$.css($$metaWindow, "right", "inherit");
        };
    }

    if (this.config.page && this.config.showAllBtn) {
        var $$btnShowAll = $$.create("INPUT", {
            type: "button",
            value: bc.showAll ? SideMLManager.get("common.showPaging") : SideMLManager.get("common.showAll")
        }, "csc-dt-showallbtn");
        $$leftTD.appendChild($$btnShowAll);
        $$btnShowAll.onclick = function () {
            bc.showAll = !bc.showAll;
            var pageNum = bc.config.pageNum;
            if (bc.showAll) {
                bc.oldPageNum = pageNum;
                pageNum = 100000;
            } else {
                pageNum = bc.oldPageNum;
            }
            bc.config.pageNum = pageNum;
            bc.pnumber = 1;
            bc.bf.gotoPage(1);
        };
    }
    if (this.config.gridExport) {
        var $$btnExport = $$.create("INPUT", {
            type: "button",
            value: SideMLManager.get("common.exportExcel")
        }, "csc-dt-exportbtn");
        $$leftTD.appendChild($$btnExport);
        var exportThis = this;
        $$btnExport.onclick = function () {
            /*
             * Excel Export ve Special Export seçili ise specialEvent designer kodunu ele alır. Sadece Excel Export "Yes" ile seçilmiş ise
             * default olarak Side'nin excel export işlemi gerçekleşir.
             */
            if (exportThis.config.specialExport) {
                bc.bf.fire("specialEvent");
            } else {
                bc.excelExport();
            }
        };
    }

    if (this.config.gridImport) {
        var $$btnImport = $$.create("INPUT", {
            type: "button",
            value: SideMLManager.get("common.importExcel")
        }, "csc-dt-importbtn");
        $$leftTD.appendChild($$btnImport);

        $$btnImport.onclick = function () {

            var $$div = $$.create("DIV", {"id": "excel_import_popup"});
            var $$tbl = $$.create("TABLE", {}, undefined, {width: "300px"}, $$div);
            var $$tr1 = $$.create("TR", {}, undefined, undefined, $$tbl);
            var $$td1_1 = $$.create("TD", {}, undefined, undefined, $$tr1);
            var $$td1_2 = $$.create("TD", {}, undefined, undefined, $$tr1);
            var $$tr2 = $$.create("TR", {}, undefined, undefined, $$tbl);
            var $$td2_1 = $$.create("TD", {colspan: "2"}, undefined, undefined, $$tr2);

            if (bc.config.gridImportCheckbox) {
                $$td1_1.innerHTML = SideMLManager.get("common.clearTable");
                var $$appendCheckbox = $$.create("INPUT", {
                    type: "checkbox",
                    id: "excel_import_clear_checkbox"
                }, undefined, undefined, $$td1_2);
            }
            var $$buton = $$.create("INPUT", {
                type: "button",
                id: "excel_import_doneButton",
                value: SideMLManager.get("common.done")
            }, "csc-button", undefined, $$td2_1);
            var $$description = $$.create("SPAN", undefined, "csc-rospan", undefined, $$div);
            $$description.innerHTML = SideMLManager.get("common.importExcelWarning");

            var $$textarea = $$.create("TEXTAREA", {"id": "excel_import_contentTextarea"}, ["excel-import-textarea"], {
                "width": "100%",
                "height": "405px"
            }, $$div);
            $$buton.onclick = function () {
                var tableClearCheckbox = $$.byid("excel_import_clear_checkbox");
                var tableClearChecked = false;
                if (tableClearCheckbox) {
                    tableClearChecked = tableClearCheckbox.checked;
                }
                excelImportPopup.close();
                bc.bf.fire("onbeforeexcelimport");
                var rows = $$textarea.value.split("\n");
                if (rows[rows.length - 1] == "")
                    rows.pop();

                var memberNames = [];
                var typeNames = [];
                var currencyConfigs;
                for (var mname in bc.bf.members) {
                    var mem = bc.bf.members[mname];
                    if (mem.bcRef.typeName !== "CSC-HIDDEN" && mem.isVisible()) {
                        memberNames.push(mname);
                        typeNames.push(mem.bcRef.typeName);
                    }
                    if (mem.bcRef.typeName == "CSC-CURRENCY" && mem.isVisible() && !currencyConfigs) {
                        var memid = bc.bf.members[mname].getConfig().id;
                        if (memid) {
                            var dom = $$.byid(memid);
                            for (var i = 0; dom && i < dom.attributes.length; i++) {
                                if (dom.attributes[i].nodeName.indexOf("data") != -1) {
                                    if (!currencyConfigs) {
                                        currencyConfigs = {};
                                    }
                                    currencyConfigs[dom.attributes[i].nodeName] = dom.attributes[i].nodeValue;
                                }
                            }
                        }
                    }
                }

                var newRows = [];
                for (var i = 0; i < rows.length; i++) {
                    var newRow = {};
                    var cols = rows[i].split("\t");
                    if (bc.onexcelimport) {
                        cols = bc.onexcelimport(cols, rows[i]);
                        if (!cols) {
                            continue;
                        }
                    }
                    for (var j = 0; j < memberNames.length; j++) {
                        if (cols[j]) {
                            if (typeNames[j] == "CSC-CURRENCY") {
                                $$body = document.getElementsByTagName("BODY")[0];
                                var $$tempAutonumeric = $$.create("SPAN", currencyConfigs, undefined, undefined, $$body);
                                var $tempAutonumeric = $($$tempAutonumeric);
                                $tempAutonumeric.autoNumeric("init", {aForm: false})
                                $tempAutonumeric.html(cols[j]);
                                var unformattedValue = $tempAutonumeric.autoNumeric("get");
                                $tempAutonumeric.remove();
                                newRow[memberNames[j]] = unformattedValue;
                            } else if (typeNames[j] == "CSC-DYN-COMBOBOX" || typeNames[j] == "CSC-COMBOBOX") {
                                var bcRef = bc.bf.members[memberNames[j]];
                                var options = bcRef.getOptions();
                                for (var k = 0; k < options.length; k++) {
                                    if (cols[j] == options[k].text) {
                                        newRow[memberNames[j]] = options[k].value;
                                        break;
                                    }
                                }
                            } else if (typeNames[j] == "CSC-CHECKBOX") {
                                var colValue = SString.trim(cols[j].toUpperCase());
                                if (["EVET", "YES", "TRUE", "1"].indexOf(colValue) >= 0) {
                                    newRow[memberNames[j]] = true;
                                } else {
                                    newRow[memberNames[j]] = false;
                                }
                            } else {
                                newRow[memberNames[j]] = cols[j];
                            }
                        }
                    }
                    newRows.push(newRow);
                }
                if (tableClearChecked) {
                    bc.bf.clear();
                }
                bc.bf.add(newRows, {readonly: bc.config.readonly});
                bc.bf.fire("onExcelImport-complated");
                bc.reRender();
            };

            var excelImportPopup = new CSSimplePopup($$div, {
                dontRemove: false,
                title: SideMLManager.get("common.importExcel"),
                width: 750,
                height: 550,
                closeOnEscape: true
            });

            excelImportPopup.open();
        };
    }

    if (config.page && !bc.showAll) {
        var $$div = $$.create("div", {id: this.config.id + "-div"}, "csc-dt-paging-div");
        $$centerTD.appendChild($$div);

        var lastPage = Math.ceil(total / this.config.pageNum);
        var $$spanToplamSayfa = $$.create("span");
        if (this.bf.$CS$.ds) {
            $$spanToplamSayfa.innerHTML = " /" + (Math.ceil(total / this.config.pageNum) || 1) + " ";
        } else {
            $$spanToplamSayfa.innerHTML = " /" + (Math.ceil(this.bf.tmembers.length / this.config.pageNum) || 1) + " ";
        }
        var bc = this;


        var $$spanFirst = $$.create("span", undefined, "csc-dt-paging-btn csc-dt-seek-first");
        var $$spanPrev = $$.create("span", undefined, "csc-dt-paging-btn csc-dt-seek-prev");
        if (page == 1) {
            $$.addClass($$spanFirst, "csc-dt-paging-btn-disabled");
            $$.addClass($$spanPrev, "csc-dt-paging-btn-disabled");
        } else {
            $$spanPrev.onclick = function () {
                if (bc.bf.$CS$.ds) {
                    if (bc.onpaging) {
                        bc.bf.fire("onpaging", page - 1);
                        return;
                    }
                }
                bc.bf.gotoPage(page - 1);
            };
            $$spanFirst.onclick = function () {
                if (bc.bf.$CS$.ds) {
                    if (bc.onpaging) {
                        bc.bf.fire("onpaging", 1);
                        return;
                    }
                }
                bc.bf.gotoPage(1);
            };
        }
        var $$spanSayfa = $$.create("span");
        $$spanSayfa.innerHTML = SideMLManager.get("common.page");
        var $$input = $$.create("span", {type: "text", contenteditable: true}, "csc-dt-paging-text");
        $$input.innerHTML = page;
        $$input.onkeydown = function (event) {
            if (event.keyCode == 13) {
                var value = parseInt(this.innerHTML);
                if (value >= 1 && value <= lastPage) {
                    if (bc.bf.$CS$.ds) {
                        if (bc.onpaging) {
                            bc.bf.fire("onpaging", value);
                            return;
                        }
                    }
                    bc.bf.gotoPage(value);
                } else {
                    this.innerHTML = page;
                }
                return false;
            }
            //37 ->Right, 39 ->Left, 46-> Del, 8-> Backspace
            if (event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 46 && event.keyCode != 8 && (event.keyCode < 48 || event.keyCode > 58) && (event.keyCode < 96 || event.keyCode > 106)) {
                return false;
            }
            return true;
        };
        $$input.onpaste = function () {
            return false;
        };

        $$div.appendChild($$spanFirst);


        var $$spanNext = $$.create("span", undefined, "csc-dt-paging-btn csc-dt-seek-next");
        var $$spanEnd = $$.create("span", undefined, "csc-dt-paging-btn csc-dt-seek-last ");
        $$div.appendChild($$spanFirst);
        $$div.appendChild($$spanPrev);
        $$div.appendChild($$spanSayfa);
        $$div.appendChild($$input);
        $$div.appendChild($$spanToplamSayfa);
        $$div.appendChild($$spanNext);
        $$div.appendChild($$spanEnd);

        if (page >= lastPage) {
            $$.addClass($$spanNext, "csc-dt-paging-btn-disabled");
            $$.addClass($$spanEnd, "csc-dt-paging-btn-disabled");
        } else {
            $$spanNext.onclick = function () {
                if (bc.bf.$CS$.ds) {
                    if (bc.onpaging) {
                        bc.bf.fire("onpaging", page + 1);
                        return;
                    }
                }
                bc.bf.gotoPage(page + 1);
            };
            $$spanEnd.onclick = function () {
                if (bc.bf.$CS$.ds) {
                    if (bc.onpaging) {
                        bc.bf.fire("onpaging", lastPage);
                        return;
                    }
                }
                bc.bf.gotoPage(lastPage);
            };
        }

        $$spanPagingInfo = $$.create("DIV", undefined, "csc-dt-paging-info");
        //&nbsp; karakteri wrap eden yeri özellikle belirlemek kullanıldı
        $$spanPagingInfo.innerHTML = (((page - 1) * this.config.pageNum) + 1) + "&nbsp;-&nbsp;" + (total < ((page) * this.config.pageNum) ? total : ((page) * this.config.pageNum)) + SideMLManager.get("common.pagingFooter") + total;
        $$rightTD.appendChild($$spanPagingInfo);

        if (bc.config.editPageNum && !bc.showAll) {
            var $$editPageRowCountText = $$.create("SPAN", undefined, undefined, {marginLeft: "6px"});
            var $$editPageRowCountBox = $$.create("SPAN", {
                contenteditable: "true",
                type: "text"
            }, "csc-table-paging-text");

            $$editPageRowCountBox.onkeydown = function (event) {
                if (event.keyCode == 13) {
                    var value = parseInt(this.innerHTML);
                    if (value >= 0) {
                        bc.setPageRowCount(value);
                    } else {
                        this.innerHTML = bc.getPageRowCount();
                    }
                    bc.bf.fire("pageRowCountChanged", value);
                    return false;
                }
            };

            $$editPageRowCountBox.innerHTML = this.getPageRowCount();
            $$editPageRowCountText.innerHTML = SideMLManager.get(this, "onEachPage");
            $$spanPagingInfo.appendChild($$editPageRowCountText);
            $$spanPagingInfo.appendChild($$editPageRowCountBox);
        }
    }

    if (!config.page && total != 0 && this.config.noRowSum !== true) {
        if (!$$spanPagingInfo) {
            $$spanPagingInfo = $$.create("DIV", undefined, "csc-dt-paging-info");
        }
        if (this.config.page) {
            //&nbsp; karakteri wrap eden yeri özellikle belirlemek kullanıldı
            $$spanPagingInfo.innerHTML = (((page - 1) * this.config.pageNum) + 1) + "&nbsp;-&nbsp;" + (total < ((page) * this.config.pageNum) ? total : ((page) * this.config.pageNum)) + SideMLManager.get("common.pagingFooter") + total;
        } else {
            $$spanPagingInfo.innerHTML = SideMLManager.get("common.total") + "&nbsp" + total + "&nbsp" + SideMLManager.get("common.records");
        }
        $$rightTD.appendChild($$spanPagingInfo);
    }

};

BC.prototype.prepareCSS = function ($$table, pwidth) {
    var config = this.config, $$css, meta = this.metadata, cinfo = this.cinfo;
    $$.remove("dt-css-" + config.id);
    $$css = document.createElement('style');
    $$css.type = 'text/css';
    $$css.rel = 'stylesheet';
    $$css.id = 'dt-css-' + config.id;
    $$.head().appendChild($$css);
    var css = "", left = 0, bwidths = [0, 0], bwidth = $$.getComputedBorders($$table);

    var absTotal = 0, relTotal = 0, relatives = [];

    for (var c = 0; c < meta.rows[meta.refRowIndex].length; c++) {
        var model = meta.rows[meta.refRowIndex][c];
        if (model.visible === false) {
            continue;
        }
        if (typeof model.width == "string" && model.width.indexOf("px") > 0) {
            model.absoluteWidth = parseInt(model.width, 10);
            absTotal += model.absoluteWidth;
        } else {
            model.relativeWidth = parseInt(model.width, 10);
            relTotal += model.relativeWidth;
            relatives.push(model);
        }
    }

    var diff = pwidth - absTotal - bwidth;
    if (config.vscroll) {
        diff -= this.scwidth;
    }
    if (meta.hover) {
        diff -= DT_HOVER_WIDTH;
    }
    if (meta.rowNumbers) {
        diff -= DT_RN_WIDTH;
    }
    if (meta.selectable) {
        diff -= DT_SEL_WIDTH;
    }
    var relativeRates = [], mins = [];
    for (var i = 0; i < relatives.length; i++) {
        relativeRates.push(parseInt(relatives[i].relativeWidth, 10));
        mins.push(parseInt(relatives[i].minw, 10));
    }
    var absoluteWidths = SIDEMath.proportionalShare2(diff, relativeRates, mins);
    for (var i = 0; i < relatives.length; i++) {
        var min = parseInt(relatives[i].minw, 10) || DT_DEFAULT_MIN_WIDTH;
        if (absoluteWidths[i] < min) {
            relatives[i].relativeWidth = min;
        } else {
            relatives[i].relativeWidth = absoluteWidths[i];
        }
    }
    absTotal = 0;
    for (c = 0; c < meta.rows[meta.refRowIndex].length; c++) {
        var model = meta.rows[meta.refRowIndex][c];
        if (model.visible === false) {
            continue;
        }
        absTotal += (model.absoluteWidth || model.relativeWidth);
    }

    var columnCounter = 0, leftWidth = 0, rightWidth = 0, n = 0;
    if (meta.hover) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_HOVER_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_HOVER_WIDTH) + "px;}\n";
        leftWidth += DT_HOVER_WIDTH;
        cinfo[n++].width = DT_HOVER_WIDTH;
    }
    if (meta.rowNumbers) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_RN_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_RN_WIDTH) + "px;}\n";
        leftWidth += DT_RN_WIDTH;
        cinfo[n++].width = DT_RN_WIDTH;
    }
    if (meta.selectable) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_SEL_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_SEL_WIDTH) + "px;}\n";
        leftWidth += DT_SEL_WIDTH;
        cinfo[n++].width = DT_SEL_WIDTH;
    }

    for (var i = 0; i < meta.rows[meta.refRowIndex].length; i++) {
        var colMeta = meta.rows[meta.refRowIndex][i];
        if (colMeta.visible === false) {
            continue;
        }
        var cw = (colMeta.absoluteWidth || colMeta.relativeWidth);
        //if(colMeta.absoluteWidth){
        css += "#" + config.id + " .c" + columnCounter + ".cell{width:" + cw + "px;left:" + rightWidth + "px;}\n";
        css += "#" + config.id + " .c" + columnCounter + ".cell > .in-cell{width:" + cw + "px;}\n";
        //}
        cinfo[n++].width = cw;
        if (colMeta.mname == meta.treeColumn) {
            leftWidth += cw;
        } else {
            rightWidth += cw;
        }
        columnCounter++;
    }
    this.rwidth = rightWidth;
    this.bwidth = bwidth;
    //set left right head/body widths
    css += "#" + config.id + " .csc-dt-lhead{width:" + (leftWidth) + "px;}\n";
    css += "#" + config.id + " .csc-dt-lbody{width:" + (leftWidth) + "px;}\n";
    css += "#" + config.id + " .csc-dt-rhead{width:" + (pwidth - (leftWidth + bwidth + (config.vscroll ? this.scwidth : 0))) + "px;}\n";
    css += "#" + config.id + " .csc-dt-rbody{width:" + (pwidth - (leftWidth + bwidth + (config.vscroll ? this.scwidth : 0))) + "px;}\n";
    $$css.innerHTML = css;

};


BC.prototype.postCSS = function ($$table, pwidth, widths, $$lh_tds, $$rh_tds, $$rb_trs) {
    var bc = this, config = bc.config, $$css, meta = bc.metadata, cinfo = bc.cinfo;
    var $$css = $$.byid("dt-css-" + config.id), css = $$css.innerHTML;
    var left = 0, bwidths = [0, 0], bwidth = bc.bwidth, headerHeight = 0, $$td, $$tds, $$incell;

    var absTotal = 0, relTotal = 0, relatives = [];

    for (var c = 0; c < meta.rows[meta.refRowIndex].length; c++) {
        var model = meta.rows[meta.refRowIndex][c];
        if (model.visible === false) {
            continue;
        }
        if (typeof model.width == "string" && model.width.indexOf("px") > 0) {
            model.absoluteWidth = parseInt(model.width, 10);
            absTotal += model.absoluteWidth;
        } else {
            model.relativeWidth = parseInt(model.width, 10);
            relTotal += model.relativeWidth;
            relatives.push(model);
        }
    }

    var diff = pwidth - absTotal - bwidth, tdCounter = 0;
    if (config.vscroll) {
        diff -= this.scwidth;
    }
    if (meta.hover) {
        diff -= widths[tdCounter++];
    }
    if (meta.rowNumbers) {
        diff -= widths[tdCounter++];
    }
    if (meta.selectable) {
        diff -= widths[tdCounter++];
    }
    var relativeRates = [], mins = [];
    for (var i = 0; i < relatives.length; i++) {
        relativeRates.push(parseInt(relatives[i].relativeWidth, 10));
        mins.push(relatives[i].realMinw);
    }
    var absoluteWidths = SIDEMath.proportionalShare2(diff, relativeRates, mins);
    for (var i = 0; i < relatives.length; i++) {
        var min = relatives[i].realMinw || parseInt(relatives[i].minw, 10) || DT_DEFAULT_MIN_WIDTH;
        if (absoluteWidths[i] < min) {
            relatives[i].relativeWidth = min;
        } else {
            relatives[i].relativeWidth = absoluteWidths[i];
        }
    }
    absTotal = 0;
    for (c = 0; c < meta.rows[meta.refRowIndex].length; c++) {
        var model = meta.rows[meta.refRowIndex][c];
        if (model.visible === false) {
            continue;
        }
        absTotal += (model.absoluteWidth || model.relativeWidth);
    }

    var columnCounter = 0, leftWidth = 0, rightWidth = 0, n = 0;
    if (meta.hover) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_HOVER_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_HOVER_WIDTH) + "px;}\n";
        leftWidth += DT_HOVER_WIDTH;
        cinfo[n++].width = DT_HOVER_WIDTH;
    }
    if (meta.rowNumbers) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_RN_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_RN_WIDTH) + "px;}\n";
        leftWidth += DT_RN_WIDTH;
        cinfo[n++].width = DT_RN_WIDTH;
    }
    if (meta.selectable) {
        css += "#" + config.id + " .c" + (columnCounter) + ".cell {width:" + (DT_SEL_WIDTH) + "px;left:" + leftWidth + "px;}\n";
        css += "#" + config.id + " .c" + (columnCounter++) + ".cell > .in-cell{width:" + (DT_SEL_WIDTH) + "px;}\n";
        leftWidth += DT_SEL_WIDTH;
        cinfo[n++].width = DT_SEL_WIDTH;
    }

    for (var i = 0; i < meta.rows[meta.refRowIndex].length; i++) {
        var colMeta = meta.rows[meta.refRowIndex][i];
        if (colMeta.visible === false) {
            continue;
        }
        var cw = (colMeta.absoluteWidth || colMeta.relativeWidth);
        if (!colMeta.absoluteWidth && $$rh_tds[tdCounter - bc.leftCellCount]) {
            $$td = $$rh_tds[tdCounter - bc.leftCellCount];
            $$incell = $$.child($$td, "DIV");
            if ($$td && $$incell) {
                if ($$incell.offsetWidth > cw) {
                    cw = $$incell.offsetWidth;
                }
                $$incell.style.width = cw + "px";
            }
        }
        widths[tdCounter++] = cw;
        css += "#" + config.id + " .c" + columnCounter + ".cell{width:" + cw + "px;left:" + rightWidth + "px;}\n";
        css += "#" + config.id + " .c" + columnCounter + ".cell > .in-cell{width:" + cw + "px;}\n";
        cinfo[n++].width = cw;
        if (colMeta.mname == meta.treeColumn) {
            leftWidth += cw;
        } else {
            rightWidth += cw;
        }
        columnCounter++;
    }
    this.rwidth = rightWidth;
    this.bwidth = bwidth;

    //fix header heights using calculated widths
    for (k = 0; k < $$lh_tds.length; k++) {
        $$td = $$lh_tds[k];
        $$incell = $$.child($$td, "DIV");
        $$incell.style.width = widths[k] + "px";
        if ($$incell.offsetHeight > headerHeight) {
            headerHeight = $$incell.offsetHeight;
        }
    }
    for (k = 0; k < $$rh_tds.length; k++) {
        $$td = $$rh_tds[k];
        $$incell = $$.child($$td, "DIV");
        $$incell.style.width = widths[k + bc.leftCellCount] + "px";
        if ($$incell.offsetHeight > headerHeight) {
            headerHeight = $$incell.offsetHeight;
        }
    }

    css += "#" + config.id + " .csc-dt-rhead, #" + config.id + " .csc-dt-lhead {height:" + headerHeight + "px;}\n";
    css += "#" + config.id + " .hrow{height:" + headerHeight + "px;}\n";
    css += "#" + config.id + " .hrow .cell > .in-cell{height:" + headerHeight + "px;}\n";

    //set left right head/body widths
    css += "#" + config.id + " .csc-dt-lhead{width:" + (leftWidth) + "px;}\n";
    css += "#" + config.id + " .csc-dt-lbody{width:" + (leftWidth) + "px;}\n";
    css += "#" + config.id + " .csc-dt-rhead{width:" + (pwidth - (leftWidth + bwidth + (config.vscroll ? this.scwidth : 0))) + "px;}\n";
    css += "#" + config.id + " .csc-dt-rbody{width:" + (pwidth - (leftWidth + bwidth + (config.vscroll ? this.scwidth : 0))) + "px;}\n";
    $$css.innerHTML = css;

    //Fix body heights according to new widths
    for (var i = 0; i < $$rb_trs.length; i++) {
        maxHeight = 0;
        $$tds = $$.childs($$rb_trs[i]);
        var rowid = $$rb_trs[i].getAttribute("rowid");
        for (var k = 0; k < $$tds.length; k++) {
            $$td = $$tds[k];
            $$incell = $$.child($$td, "DIV");
            mname = $$td.getAttribute("mn");
            mmeta = cinfo[k + bc.leftCellCount].rmeta;
            if (maxHeight < $$incell.offsetHeight) {
                maxHeight = $$incell.offsetHeight;
            }
            if (mmeta.mname != mname) {
                continue;
            }
        }
        if (i == 0) {
            rowHeight = config.style.rowHeight || maxHeight;
            css += "#" + config.id + " .rs{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .r0{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .rs .cell{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .rs .cell > .in-cell{height:" + rowHeight + "px;}\n";
        }
        if (!config.fixHeight) {//herkez aynı yüksekliği kullansın mı
            css += "#" + config.id + " .r" + rowid + "{height:" + maxHeight + "px;}\n";
            css += "#" + config.id + " .r" + rowid + " .cell {height:" + maxHeight + "px;}\n";
            css += "#" + config.id + " .r" + rowid + " .cell > .in-cell{height:" + maxHeight + "px;}\n";
        }
    }
    $$css.innerHTML = css;
};
BC.prototype.fixTable = function () {
    var bc = this, bf = bc.bf, config = bc.config, style = config.style, meta = bc.metadata, cinfo = bc.cinfo;
    var $$table = bc.$$table, $$title = bc.$$title, $$action = bc.$$action, $$lhead = bc.$$lhead, $$rhead = bc.$$rhead,
        $$lbody = bc.$$lbody, $$rbody = bc.$$rbody, $$footer = bc.$$footer, $$vscroll = bc.$$vscroll,
        $$hscroll = bc.$$hscroll;

    if (!$$.width($$table)) {
        return;//Non-visible state (display: none;)
    }

    this.saveScrollPosition();

    if (!bc.scwidth || bc.scwidth < 5) {
        bc.scwidth = $$.getScrollBarWidth($$table);
    }
    bc.prepareCSS($$table, this.pwidth, config.vscroll ? this.scwidth : 0);
    var $$css = $$.byid("dt-css-" + config.id), css = $$css.innerHTML;
    var leftWidth = 0, maxHeight = 0, rowHeight = 0, headerHeight = 0;

    //Header cell gerçek genişliklerini (scrollWidth) bul
    var $$lh_trs = $$.childs($$lhead, "DIV");
    var $$rh_trs = $$.childs($$rhead, "DIV");
    var tdWidths = [];

    var rowmeta = meta.rows[0];

    //Calculate left header widths and max header height
    var $$lh_tds = $$.childs($$lh_trs[0]), $$td, mname, mmeta, $$incell;
    for (var k = 0; k < bc.leftCellCount; k++) {
        $$td = $$lh_tds[k];
        $$incell = $$.child($$td, "DIV");
        if (!$$td || !$$incell) {//header yok
            tdWidths[k] = cinfo[k].width;
        } else {
            if ($$td.offsetHeight > headerHeight) {
                headerHeight = $$td.offsetHeight;
            }
            mname = $$td.getAttribute("mn");
            mmeta = cinfo[k].rmeta;
            if (!config.woverflow && mmeta && mmeta.absoluteWidth) {
                tdWidths[k] = mmeta.absoluteWidth;
            } else {
                tdWidths[k] = $$incell.offsetWidth;
            }
        }
    }
    //Calculate right header widths and max header height
    var $$rh_tds = $$.childs($$rh_trs[0]);
    for (var k = 0; k < $$rh_tds.length; k++) {
        $$td = $$rh_tds[k];
        $$incell = $$.child($$td, "DIV");
        mname = $$td.getAttribute("mn");
        mmeta = cinfo[k + bc.leftCellCount].rmeta;
        if ($$td.offsetHeight > headerHeight) {
            headerHeight = $$td.offsetHeight;
        }
        if (mmeta && mmeta.fixWidth) {
            tdWidths[k + bc.leftCellCount] = mmeta.width;
        } else {
            tdWidths[k + bc.leftCellCount] = $$incell.offsetWidth;
        }
        if (mmeta && (mmeta.realMinw || 0) < $$incell.offsetWidth) {
            mmeta.realMinw = $$incell.offsetWidth;
        }
    }

    //body cell gerçek genişliklerini (scrollWidth) bul
    //TODO Burada bütün satırların standart olduğu varsayılıyor. Çoklu satır tasarımı da ele alınmalı
    var $$lb_trs = $$.childs($$lbody, "DIV");
    var $$rb_trs = $$.childs($$rbody, "DIV");
    for (var i = 0; i < $$rb_trs.length; i++) {
        maxHeight = 0;
        if ($$lbody) {
            var rowid = $$lb_trs[i].getAttribute("rowid");
            var $$tds = $$.childs($$lb_trs[i]);
            for (var k = 0; k < $$tds.length; k++) {
                $$td = $$tds[k];
                $$incell = $$.child($$td, "DIV");
                mname = $$td.getAttribute("mn");
                mmeta = cinfo[k].rmeta;
                if (maxHeight < $$td.offsetHeight) {
                    maxHeight = $$td.offsetHeight;
                }
                if ((!mmeta || (!mmeta.absoluteWidth && !config.woverflow)) && $$incell.offsetWidth > (tdWidths[k] || 0)) {
                    tdWidths[k] = $$incell.offsetWidth;
                    if (mmeta) {
                        mmeta.realMinw = $$incell.offsetWidth;
                    }
                }
                if (!tdWidths[k]) {
                    tdWidths[k] = ($$incell || $$td).offsetWidth;
                }
            }
        } else {
            var rowid = $$rb_trs[i].getAttribute("rowid");
        }
        $$tds = $$.childs($$rb_trs[i]);
        for (var k = 0; k < $$tds.length; k++) {
            $$td = $$tds[k];
            $$incell = $$.child($$td, "DIV");
            mname = $$td.getAttribute("mn");
            mmeta = cinfo[k + bc.leftCellCount].rmeta;
            if (maxHeight < $$td.offsetHeight) {
                maxHeight = $$td.offsetHeight;
            }
            if (mmeta.mname != mname) {
                continue;
            }
            if (mmeta && !mmeta.absoluteWidth && !config.woverflow && $$incell.offsetWidth > (tdWidths[k + bc.leftCellCount] || 0)) {
                tdWidths[k + bc.leftCellCount] = $$incell.offsetWidth;
            }
            if (!tdWidths[k + bc.leftCellCount]) {
                tdWidths[k + bc.leftCellCount] = ($$incell || $$td).offsetWidth;
            }
            if (mmeta && (mmeta.realMinw || 0) < $$incell.offsetWidth) {
                mmeta.realMinw = $$incell.offsetWidth;
            }
        }
        if (i == 0) {
            rowHeight = config.style.rowHeight || maxHeight;
            css += "#" + config.id + " .rs{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .r0{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .rs .cell{height:" + rowHeight + "px;}\n";
            css += "#" + config.id + " .rs .cell > .in-cell{height:" + rowHeight + "px;}\n";
        }
        if (!config.fixHeight) {//herkez aynı yüksekliği kullansın mı
            css += "#" + config.id + " .r" + rowid + "{height:" + maxHeight + "px;}\n";
            css += "#" + config.id + " .r" + rowid + " .cell {height:" + maxHeight + "px;}\n";
            css += "#" + config.id + " .r" + rowid + " .cell > .in-cell{height:" + maxHeight + "px;}\n";
        }
    }
    for (i = 0; i < bc.leftCellCount; i++) {
        leftWidth += tdWidths[i];
    }

    var widthTotal = 0, n = 0;
    for (var i = 0; i < tdWidths.length; i++) {
        cinfo[i].width = tdWidths[i];
        if (i < bc.leftCellCount) {
            css += "#" + config.id + " .c" + (i) + ".cell{width:" + (tdWidths[i]) + "px;left:" + widthTotal + "px;}\n";
            css += "#" + config.id + " .c" + (i) + ".cell > .in-cell{width:" + (tdWidths[i]) + "px;}\n";
        } else {
            css += "#" + config.id + " .c" + (i) + ".cell {width:" + (tdWidths[i]) + "px;left:" + (widthTotal - leftWidth) + "px;}\n";
            css += "#" + config.id + " .c" + (i) + ".cell > .in-cell{width:" + (tdWidths[i]) + "px;}\n";
        }
        widthTotal += tdWidths[i] || 0;
    }

    //col span
    css += "#" + config.id + " .cs.cell {width:" + (widthTotal) + "px;left:" + (0) + "px;}\n";
    css += "#" + config.id + " .cs.cell > .in-cell{width:" + (widthTotal) + "px;}\n";

    $$css.innerHTML = css;

    bc.postCSS($$table, this.pwidth, tdWidths, $$lh_tds, $$rh_tds, $$rb_trs);

    var widthTotal = 0, rwidth = 0;
    for (var i = 0; i < tdWidths.length; i++) {
        if (i >= bc.leftCellCount) {
            rwidth += tdWidths[i] || 0;
        }
        widthTotal += tdWidths[i] || 0;
    }

    if ($$vscroll) {
        widthTotal += bc.scwidth;
    }

    if (widthTotal > $$table.offsetWidth + 3) {//hor scroll gerekli mi? TODO mahmuty +3 efinans tarafındaki hata için geçici olarak koyuldu kaldırılmalı
        $$hscroll.style.display = "block";
        $$table.setAttribute("cs-horsc", "yes");
        bc.$$hscrollInner.style.width = (rwidth + ($$lbody ? $$lbody.offsetWidth : 0)) + (config.vscroll ? bc.scwidth : 0) + "px";
        $$hscroll.onscroll = function () {
            $$rhead && ($$rhead.scrollLeft = $$hscroll.scrollLeft);
            $$rbody && ($$rbody.scrollLeft = $$hscroll.scrollLeft);
            if (bc.$$totalRowInner) {
                bc.$$totalRow.scrollLeft = $$hscroll.scrollLeft;
            }
        };
    } else {
        $$table.setAttribute("cs-horsc", "no");
        $$hscroll.style.display = "";
        //console.log("fw: " + widthTotal +" off: "+$$table.offsetWidth);
        var bwidth = $$.getComputedBorders($$table);//TODO mahmuty yukarıdaki if'e de bwidth eklenmeli mi
        if (widthTotal == $$table.offsetWidth - bwidth) {
            $$table.setAttribute("cs-full-width", "yes");
        } else {
            $$table.setAttribute("cs-full-width", "no");
        }
    }
    if ($$rbody) {
        $$rbody.onscroll = function () {
            if ($$hscroll) {
                $$hscroll.scrollLeft = $$rbody.scrollLeft;
                $$.fireEvent($$hscroll, "scroll");
            }
            if (bc.$$vscroll) {
                bc.$$vscroll.scrollTop = $$rbody.scrollTop;
                $$.fireEvent(bc.$$vscroll, "scroll");
            }
        };
    }

    if (bc.$$totalRowInner) {
        $$.css(bc.$$totalRow, "marginLeft", (($$lbody ? $$lbody.offsetWidth : 1) - 1) + "px");
        var scrollSize = 0;
        if ($$vscroll) {
            scrollSize = $$.height($$hscroll);
            $$.css(bc.$$totalRowContainer, "marginRight", (scrollSize) + "px");
        }

        $$.css(bc.$$totalRowInner, "width", (widthTotal - leftWidth - scrollSize) + "px");
    }

    var $$head = ($$rhead || $$lhead);
    var borderWidths = $$.getComputedBorders($$table, true);//slt üst border widths
    var bodyHeight = bc.bodyHeight || (bc.mheight - ($$title ? $$title.offsetHeight : 0) - ($$action ? $$action.offsetHeight : 0) - ($$head ? $$head.offsetHeight : 0) - ($$footer ? $$footer.offsetHeight : 0) - (widthTotal > $$table.offsetWidth ? bc.scwidth : 0) - borderWidths);
    if (style.height || style.heightByRows) {
        $$lbody && ($$lbody.style.height = bodyHeight + "px");
        $$rbody.style.height = bodyHeight + "px";
    }
    if (style.minHeight) {
        var other = (($$title ? $$title.offsetHeight : 0) + ($$head ? $$head.offsetHeight : 0) + ($$action ? $$action.offsetHeight : 0) + ($$footer ? $$footer.offsetHeight : 0) + (widthTotal > $$table.offsetWidth ? bc.scwidth : 0) + borderWidths);
        if (bc.nodatatext && (style.minHeight - other) < 40) {
            $$rbody.style.minHeight = "40px";
            $$lbody && ($$lbody.style.minHeight = "40px");
        } else {
            $$rbody.style.minHeight = (style.minHeight - other) + "px";
            $$lbody && ($$lbody.style.minHeight = (style.minHeight - other) + "px");
        }
    }

    if ($$vscroll) {
        if (bc.mheight < $$table.offsetHeight) {
            $$vscroll.style.display = "block";
        } else {
            $$vscroll.style.display = "";
        }

        $$rbody.style.maxHeight = bodyHeight + "px";//fix'te bu değer hesaplanıp düzeltiliyor
        $$lbody && ($$lbody.style.maxHeight = bodyHeight + "px");//fix'te bu değer hesaplanıp düzeltiliyor

        $$vscroll.style.width = bc.scwidth + "px";
        $$vscroll.style.height = (($$rhead ? $$rhead.offsetHeight : 0) + $$rbody.offsetHeight) + "px";
        $$vscroll.childNodes[0].style.height = (($$rhead ? $$rhead.offsetHeight : 0) + $$rbody.scrollHeight) + "px";
    }
    bc.bindHeaderEvents($$table, $$rhead);
    bc.renderTotalRow();
    if (config.noFooter !== true) {
        this.renderFooter();
    }
    $$.fireEvent($$hscroll, "scroll");

    this.loadScrollPosition();
};

BC.prototype.saveScrollPosition = function () {
    var $$dom = $$.byid(this.config.id);
    if (!$$dom) {
        return;
    }
    if (!this.scrollInfos) {
        this.scrollInfos = [];
    }
    var scrollInfo = {};
    scrollInfo.parent = $$dom.parentNode;
    if ($$dom) {
        while (scrollInfo.parent) {
            if (scrollInfo.parent.scrollTop > 0) {
                scrollInfo.scrollTop = scrollInfo.parent.scrollTop;
                break;
            }
            scrollInfo.parent = scrollInfo.parent.parentNode;
        }
    }

    this.scrollInfos.push(scrollInfo);
}

BC.prototype.loadScrollPosition = function () {
    if (!this.scrollInfos) {
        return;
    }
    var scrollInfo = this.scrollInfos.pop();
    if (scrollInfo.parent) {
        scrollInfo.parent.scrollTop = scrollInfo.scrollTop;
    }

    if (this.scrollInfos.length == 0) {
        delete this.scrollInfos;
    }
}

BC.prototype.getCellWidth = function (memberName) {
    var bc = this, cinfo = bc.cinfo;
    if (!cinfo) {
        return 100;
    }
    for (var i = 0; i < cinfo.length; i++) {
        if (cinfo[i].rows && cinfo[i].rows[0].mname) {
            return cinfo[i].width;
        }
    }
    return 100;
};

//class bilgileri row üzerinde tutulduğu için ayrıca bu bc üzerinde saklamaya gerek yok
BC.prototype.addClass = function (rowid, classes) {
    var bc = this;
    var $$tr = $$.getChildHasAttr(bc.$$lbody, "rowid", rowid);
    if ($$tr) {
        $$.addClass($$tr, classes);
    }
    $$tr = $$.getChildHasAttr(bc.$$rbody, "rowid", rowid);
    if ($$tr) {
        $$.addClass($$tr, classes);
    }
};

BC.prototype.styleRow = function (rowid, style) {
    if (!style || typeof style != "object") {
        return;
    }
    var bc = this, css = bc.rowStyles[rowid], $$tr, $$tds, i, s;
    if (!css) {
        css = {};
        bc.rowStyles[rowid] = css;
    }
    for (s in style) {
        css[s] = style[s];
    }

    $$tr = $$.getChildHasAttr(bc.$$lbody, "rowid", rowid);
    $$tds = $$.childs($$tr, "DIV");
    for (i = 0; i < $$tds.length; i++) {
        $$.css($$tds[i], style);
    }
    $$tr = $$.getChildHasAttr(bc.$$rbody, "rowid", rowid);
    $$tds = $$.childs($$tr, "DIV");
    for (i = 0; i < $$tds.length; i++) {
        $$.css($$tds[i], style);
    }
};

BC.prototype.styleCell = function (rowid, mname, style) {
    if (!style || typeof style != "object") {
        return;
    }
    var bc = this, rowCss = bc.cellStyles[rowid], $$tr, $$td, i, s;
    if (!rowCss) {
        rowCss = {};
        bc.cellStyles[rowid] = rowCss;
    }
    var css = rowCss[mname];
    if (!css) {
        css = {};
        rowCss[mname] = css;
    }
    for (s in style) {
        css[s] = style[s];
    }

    $$tr = $$.getChildHasAttr(bc.$$lbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.css($$td, style);
    $$tr = $$.getChildHasAttr(bc.$$rbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.css($$td, style);
};

BC.prototype.addClassToCell = function (rowid, mname, className) {
    var bc = this, rowClasses = bc.cellClasses[rowid], $$tr, $$td;
    if (!rowClasses) {
        rowClasses = {};
        rowClasses[mname] = new Set();
        bc.cellClasses[rowid] = rowClasses;
    }
    rowClasses[mname].add(className);

    $$tr = $$.getChildHasAttr(bc.$$lbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.addClass($$td, className);
    $$tr = $$.getChildHasAttr(bc.$$rbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.addClass($$td, className);
};

BC.prototype.removeClassFromCell = function (rowid, mname, className) {
    var bc = this, rowClasses = bc.cellClasses[rowid], $$tr, $$td;
    if (!rowClasses || !rowClasses[mname]) {
        return;
    }
    rowClasses[mname].delete(className);

    $$tr = $$.getChildHasAttr(bc.$$lbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.rmClass($$td, className);
    $$tr = $$.getChildHasAttr(bc.$$rbody, "rowid", rowid);
    $$td = $$.getChildHasAttr($$tr, "mn", mname);
    $$.rmClass($$td, className);
};

BC.prototype.highlightRow = function (rowid, color) {
    this.styleRow(rowid, {backgroundColor: color || "#C3D3EA"});
};

BC.prototype.setPageRowCount = function (rowCount) {
    this.config.pageNum = rowCount || 10;
    this.bf.gotoPage(1);
};

BC.prototype.setExcelFileName = function (filename) {
    this.efl = filename;
};

BC.prototype.setExcelModule = function (moduleName) {
    this.excelModule = moduleName;
};

BC.prototype.formatTotal = function (sum) {
    if (!this.totalRow || !this.totalRow.getConfig().totalFormat) {
        return SIDEMath.formatDecimal(sum.toString(), 2);
    }
    if (this.totalRow.getConfig().totalFormat == "curr1") {//Binlik(,), ondalık(.)
        sum = SIDEMath.formatDecimal(sum.toString(), 2);
        var th = sum.substring(0, sum.length - 3);
        var thstr = "", decstr = sum.substring(sum.indexOf(".") + 1);
        var mod = th.length % 3;
        if (mod == 0) {
            mod = 3;
        }
        for (var i = mod; i <= th.length; i += 3) {
            thstr += th.substring(i - 3, i);
            if (i != th.length) {
                thstr += ",";
            }
        }
        return thstr + "." + decstr;
    }

    if (this.totalRow.getConfig().totalFormat == "curr2") {//Binlik(,), ondalık yok.
        sum = Math.round(sum);
        sum = SIDEMath.formatDecimal(sum, 0);
        var thstr = "";
        var mod = sum.length % 3;
        if (mod == 0) {
            mod = 3;
        }
        for (var i = mod; i <= sum.length; i += 3) {
            thstr += sum.substring(i - 3, i);
            if (i != sum.length) {
                thstr += ",";
            }
        }
        return thstr;
    }
};

BC.prototype.setNodata = function (flag) {
    var bc = this, config = bc.config;
    bc.nodatatext = config.nodata || DT_NO_DATA_TEXT;

    var $$nodata = $$.byid(config.id + "-nodata");
    var $$span = $$.child($$nodata, "SPAN");
    if ($$span) {
        $$span.innerHTML = bc.nodatatext;
        if (bc.$$rbody) {
            bc.$$rbody.style.minHeight = "40px";
        }
        $$nodata.style.top = (bc.$$title ? bc.$$title.offsetHeight : 0) + (bc.$$action ? bc.$$action.offsetHeight : 0) + (bc.$$rhead ? bc.$$rhead.offsetHeight : 0);
    }
};

BC.prototype.setNoDataText = function (text) {
    this.config.nodata = text;
};

BC.prototype.mask = function (text) {
    //TODO implement edilecek
};

BC.prototype.unmask = function () {
    //TODO implement edilecek
};
BC.prototype.group = function (fieldName, collapse) {
    //TODO implement edilecek
};
BC.prototype.getSortInfo = function () {
    //TODO implement edilecek
};
BC.prototype.getColModelMeta = function () {
    return this.userMeta;
};
BC.prototype.setColModelMeta = function (userMeta) {
    this.userMeta = userMeta;
};
BC.prototype.showButton = function (buttonName, flag) {
    //TODO implement edilecek
};
BC.prototype.cancelAdd = function () {
    if (this.cadd === false) {
        this.bf.deleteRow(this.addedRowid);
    }
    this.cadd = true;
};
BC.prototype.cancelDelete = function () {
    this.cdel = true;
};
BC.prototype.hideActionBar = function () {
    this.config.showActionButtons = false;
    BFEngine.renderRequest(this.bf);
};

BC.prototype.load = function () {
    this.bf.fire("onload");
};

BC.prototype.destroybc = function () {
    $$.remove("dt-css-" + this.config.id);
};

BC.prototype.onExcelImport = function (callback) {
    this.onexcelimport = callback;
};

BC.prototype.getCurrentPage = function () {
    if (this.bf.$CS$.ds) {
        return this.bf.$CS$.ds.page;
    }
    return this.pnumber || 1;
};

BC.prototype.bindEvent = function (eventName, callback) {
    if (eventName == "selected") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.onclick = callback;
        }
    } else if (eventName == "drop" || eventName == "ondrop") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.ondrop = callback;
            $$.bindEvent(dom, "dragover", function (ev) {
                ev.preventDefault();
            });//drop olayının çalışması için
        }
    } else if (eventName == "dragover") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.ondragover = callback;
        }
    } else if (eventName == "onpaging") {
        this.onpaging = true;
    }
};

BC.prototype.setExcelConfig = function (config) {
    /**
     * Excel Export işlemi için özel ayarlar verilmesini sağlar.
     * @param [config] Configleri içeren JSON Objesidir.
     *    - templatePath: Excel şablonunun bulunduğu konumdur. side-support-gridexport.jar'ın çalıştığı uygulama sunucusuna verilen "side-excel-template-path" parametresine eklenir.
     *    - templateMap: Excel şablonunundaki keyleri map ile replace edilmesini sağlar. keylerin başına özel keyler verilerek davranışlar özelleştirile bilir.
     *        - $imgPath.logo : Template içerisindeki $key.logo yazılı yere $imgPath.logo ile verilen path'teki resmi ekler. side-support-gridexport.jar'ın çalıştığı uygulama sunucusuna verilen "side-excel-template-path" parametresine eklenerek tam path oluşturulur.
     *
     *    Örnek config:
     *        {
	 * 			templatePath: "templateCategory1/template1.xlsx",
	 * 			templateMap:
	 * 				{
	 * 					"$imgPath.myLogo": "cybersoftLogo.png"
	 * 					"$key.address": "Bilkent Cyberpark"
	 * 				}
	 * 		}
     */

    this.excelConfig = config;
};
})(window);
/****************************=csc-notification.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-BUTTON
 * @classdesc Temel buton componenti.
 * @author Mahmut Yıldız
 */
function Definition(CS) {
	this.DEFAULTS = {
		timeOut: 3000,
		showIcon: true
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "warning(message,notificationType)","error(message,notificationType)","info(message,notificationType)","success(message,notificationType)" ];
	this.EVENTS = [];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-NOTIFICATION", def);

var BC = def.Type;

var CscNotification=function (bc,bf,config,container) {
	this.bc=bc;
	this.bf=bf;
	this.config=config;
	this.container=container;
	this.notificationType=undefined;
	this.notificationListData=[];
	this.cscNotificationListElement;
	this.cscNotificationListWrapperElement;
	this.cscNotificationQuiteCountElement;
	this.cscNotificationLinkElement;
	this.quite=false;
	this.quiteTimerCount=0;
	this.checkTimer=true;
	this.calcTime=function() {
		var notificationTime=new Date();
		var notificationHour=notificationTime.getHours();
		var notificatioMinute=notificationTime.getMinutes();
		if(notificatioMinute.toString().length<2){
			notificatioMinute="0"+notificatioMinute;
		}
		return notificationHour+":"+notificatioMinute;
	}
	this.checkNotificationType=function () {
		var self=this;
		switch (this.notificationType) {
			case "alert":
				this.quite=false;
				this.checkTimer=false;
				break;
			case "quite":
				this.quite=true;
				break;
			default:
				if(this.checkTimer){
					this.notificationTimer=setTimeout(function () {
						self.closeNotificationList ();
					},config.timeOut);
					this.checkTimer=true;
				}
				this.quite=false;
				break;
		}
	};
	this.closeNotificationList=function () {
		this.cscNotificationListWrapperElement.style.display="";
		this.cscNotificationListElement.innerHTML="";
		if(this.notificationTimer){
			clearInterval(this.notificationTimer);
		}
		this.checkTimer=true;
	};
	this.openNotificationList=function () {
		this.cscNotificationListWrapperElement.style.display="block";
		this.cscNotificationQuiteCountElement.innerHTML="0";
		this.cscNotificationQuiteCountElement.style.display="";
		this.cscNotificationLinkElement.classList.remove("warn");
		this.quite=false;
		if(this.quiteTimer){
			clearInterval(this.quiteTimer);
		}
		if(this.cscNotificationListElement.children.length===0){
			this.createNotificationHTML ("info","Yeni mesajınız bulunmamaktadır.","-:-",true);
		}
	};
	this.getNotificationList=function() {
		var self=this;
		this.cscNotificationListElement.innerHTML="";
		if(this.notificationListData.length>0){
			this.notificationListData.forEach( function(element, index) {
				self.createNotificationHTML (element.type,element.message,element.notificationTime,true);
			});
		}else{
			this.createNotificationHTML ("info","Mesajınız bulunmamaktadır.","-:-",true);
		}
	}
};

CscNotification.prototype.createNotificationMainHTML=function () {
	var self=this;
	var $cscNotificationLink=$$.create("A", {"id":this.config.id+"_cscNotificationLink"}, ["csc-notification--link"], null,this.container);
	$cscNotificationLink.innerHTML="<i class='fa fa-bell csc-notification--icon'></i>";
	var $cscNotificationQuiteCount=$$.create("SPAN", {"id":this.config.id+"_cscNotificationQuiteCount"}, ["csc-notification--quite-count"], null,$cscNotificationLink);
	$cscNotificationQuiteCount.innerHTML="0";
	var $cscNotificationListWrapper=$$.create("DIV", {"id":this.config.id+"_cscNotificationListWrapper"}, ["csc-notification--list-wrapper","csc-notification--top"], null);
	document.body.appendChild($cscNotificationListWrapper);
	var $cscNotificationListHeader=$$.create("DIV", {"id":this.config.id+"_cscNotificationListHeader"}, ["csc-notification--list-header"], null,$cscNotificationListWrapper);
	var $cscNotificationShowAll=$$.create("A", {"id":this.config.id+"_cscNotificationShowAll"}, ["csc-notification--show-all"], null,$cscNotificationListHeader);
	$cscNotificationShowAll.innerHTML="Tümünü Göster";
	var $cscNotificationDeleteAll=$$.create("A", {"id":this.config.id+"_cscNotificationDeleteAll"}, ["csc-notification--delete-all"], null,$cscNotificationListHeader);
	$cscNotificationDeleteAll.innerHTML="Hepsini Sil";
	var $cscNotificationClose=$$.create("A", {"id":this.config.id+"_cscNotificationClose"}, ["csc-notification--close"], null,$cscNotificationListHeader);
	$cscNotificationClose.innerHTML="<i class='fa fa-times'></i>";
	var $cscNotificationList=$$.create("UL", {"id":this.config.id+"_cscNotificationList"}, ["csc-notification--list"], null,$cscNotificationListWrapper);
	this.cscNotificationListElement=$cscNotificationList;
	this.cscNotificationListWrapperElement=$cscNotificationListWrapper;
	this.cscNotificationQuiteCountElement=$cscNotificationQuiteCount;
	this.cscNotificationLinkElement=$cscNotificationLink;
	if (!self.config.showIcon) {
		$$.addClass($$.byid(this.config.id + "_cscNotificationLink"), "hide");
	}

	if(self.config.cssClass){
		$$.addClass(this.cscNotificationListElement, self.config.cssClass+"--list");
		$$.addClass(this.cscNotificationListWrapperElement, self.config.cssClass+"--list-wrapper");
	}

	$cscNotificationLink.addEventListener("click",function(){
		self.openNotificationList();
	});
	$cscNotificationClose.addEventListener("click", function () {
		self.closeNotificationList();
	});
	$cscNotificationDeleteAll.addEventListener("click",function(){
		self.cscNotificationListElement.innerHTML="";
		if(self.notificationListData.length>0){
			self.notificationListData=[];
			self.createNotificationHTML ("info","Tüm mesajlar silindi.","-:-",true);
		}else{
			self.createNotificationHTML ("info","Zaten hiç mesajınız yok.","-:-",true);
		}
	});
	$cscNotificationShowAll.addEventListener("click",function(){
		self.getNotificationList();
	});
};
CscNotification.prototype.setNotificationListData=function(type,message,notificationTime) {
	if(message){
		this.notificationListData.push({"message":message,"notificationTime":notificationTime,"type":type});
	}else{
		console.error("csc-notification:\nNotification mesaj bulunamadı.");
		return false;
	}
};
CscNotification.prototype.organizeNotifications=function () {
	var self=this;
	if(self.notificationTimer){
		clearTimeout(self.notificationTimer);
	}
	self.checkNotificationType ();
	if(!self.quite){
		self.openNotificationList ();
	}else{
		if(self.cscNotificationListWrapperElement.style.display!=="block"){
			if(self.quiteTimer){
				clearInterval(self.quiteTimer);
			}
			self.cscNotificationLinkElement.classList.add("warn");
			self.cscNotificationQuiteCountElement.innerHTML=parseInt(self.cscNotificationQuiteCountElement.innerHTML)+1;
			self.cscNotificationQuiteCountElement.style.display="block";
			self.quiteTimer=setInterval(function () {
				self.cscNotificationLinkElement.classList.toggle("warn");
				if(self.quiteTimerCount===7){
					clearInterval(self.quiteTimer);
					self.quite=false;
					self.quiteTimerCount=0;
				}else{
					self.quiteTimerCount=self.quiteTimerCount+1;
				}
			},500);
		}

	}
};
CscNotification.prototype.createNotificationHTML=function (type,message,notificationTime,showAll) {
	var self=this;
	showAll=showAll || false;
	var notificationListItemElement=document.createElement("LI");
	var notificationTextElement=document.createElement("SPAN");
	var notificationTimeElement=document.createElement("TIME");

	notificationTextElement.innerHTML=message;
	notificationTimeElement.innerHTML=notificationTime;

	notificationListItemElement.classList.add("csc-notification--list-item");
	notificationListItemElement.classList.add("list-item__"+type);
	notificationTextElement.classList.add("csc-notification--text");
	notificationTimeElement.classList.add("csc-notification--time");

	notificationListItemElement.appendChild(notificationTextElement);
	notificationListItemElement.appendChild(notificationTimeElement);
	if(this.cscNotificationListElement.children.length>0){
		this.cscNotificationListElement.insertBefore(notificationListItemElement, this.cscNotificationListElement.firstChild);
	}else{
		this.cscNotificationListElement.appendChild(notificationListItemElement);
	}
	if(!showAll){
		this.organizeNotifications();
	}
};

CscNotification.prototype.warning = function(message,notificationType){
	this.notificationType=notificationType;
	var notificationTime=this.calcTime();
	this.setNotificationListData("warning",message,notificationTime);
	this.createNotificationHTML ("warning",message,notificationTime);
};
CscNotification.prototype.error = function(message,notificationType){
	this.notificationType=notificationType || "alert";
	var notificationTime=this.calcTime();
	this.setNotificationListData("error",message,notificationTime);
	this.createNotificationHTML ("error",message,notificationTime);
};
CscNotification.prototype.info = function(message,notificationType){
	this.notificationType=notificationType;
	var notificationTime=this.calcTime();
	this.setNotificationListData("info",message,notificationTime);
	this.createNotificationHTML ("info",message,notificationTime);
};
CscNotification.prototype.success = function(message,notificationType){
	this.notificationType=notificationType;
	var notificationTime=this.calcTime();
	this.setNotificationListData("success",message,notificationTime);
	this.createNotificationHTML ("success",message,notificationTime);
};

BC.prototype.render = function($container) {
	var bc=this;
	var bf=bc.bf;
	var config=bc.config;
	var $$cscNotificationContainer=document.createElement("DIV");

	console.log(config.timeOut);

	$container.appendChild($$cscNotificationContainer);

	if(config.cssClass){
		$$.addClass($$cscNotificationContainer, config.cssClass);
	}

	$$cscNotificationContainer.classList.add("csc-notification");
	$$cscNotificationContainer.setAttribute("id", this.config.id);





	bc.notification =new CscNotification(bc,bf,config,$$cscNotificationContainer);
	bc.notification.createNotificationMainHTML();

};
BC.prototype.warning=function (message,notificationType) {
	this.notification.warning(message,notificationType);
};
BC.prototype.error=function (message,notificationType) {
	this.notification.error(message,notificationType);
};
BC.prototype.info=function (message,notificationType) {
	this.notification.info(message,notificationType);
};
BC.prototype.success=function (message,notificationType) {
	this.notification.success(message,notificationType);
};
BC.prototype.bindEvent = function(eventName, callback) {
	var bc=this;
	var config=bc.config;
	/*if (eventName == "selected") {
	 var dom = $$.byid(config.id);
	 if (dom) {
	 dom.onclick = function(event){
	 SIDENavigator.setEvent(event);
	 var now = new Date().getTime();
	 if(!bc.lastClickedTime || (now - bc.lastClickedTime) > 300 ){
	 bc.lastClickedTime = now;
	 callback("event");
	 }else{
	 console.log("[csc-bread-crumb] Duplicate click prevented.");
	 }
	 };
	 }
	 }*/
};


})(window);
/****************************=csc-popup.js=******************************/
(function(window, undefined) {
/** @class CSC-POPUP */
function Definition(CS) {
	this.DEFAULTS = {
		cls : "csc-popup",
		border : false,
		autoOpen : false,
		modal : true,
		closeTitleBar : false,// Titlebar'i saklamak icin
		closeOnEsc : true,
		resizable : false,
		stack : true,
		width : "auto"
	};

	this.BaseBF = "CONTAINER";
	this.LABEL = "Popup";

	this.METHODS = [ "open(isglobal)", "close", "destroy", "isOpen", "moveToTop", "setTitle(title)", "resize(width, height)", "cancel(action)","hide","show"];
	this.EVENTS = [ "beforeopen(context)", "opened(param)", "selected", "onclose", "onmaximize(width, height)", "onminimize(width, height)" ];

	this.Type = function() {
		this.$popupDiv = null;
		this.popup = null;
	};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-POPUP", def);

var BC = def.Type;

BC.prototype = new BaseBC();

BC.prototype.init = function() {
	this.cancels={};
}
BC.prototype.DRL = function() {
	return false;
};

BC.prototype.render = function($container) {
	var bf = this.bf;
	if (this.$$popupDiv) {
		this.$$popupDiv.innerHTML = "";
	}

	if (!$container) {// run time
		$container = this.$$popupDiv;
	}else {	// ADogan - $$popupDiv olmadığı zaman isRendered doğru çalışmıyordu.
		if(this.$$popupDiv){	// Designer'daki popup patlamaması için.
			$container.appendChild(this.$$popupDiv);
			$container = this.$$popupDiv;
		}
	}
	
	// Bir popup'ın içerisinde sadece bir page olabilir. NŞA'da for birkez dönmeli
	for ( var member in bf.members) {
		BFEngine.render(bf.members[member], $container);
	}
	if(this.popup && ($$.innerHeight(window)< this.popup.$popupWindow.height() + this.popup.$popupWindow.position().top)){
		var wh = $$.innerHeight(window);
		var h = this.popup.$popupWindow.height();
		this.popup.$popupWindow.css({
			top: (wh-h) ? (wh-h) : "0px",
		});
	}
	//this.popup.checkAndSetPopupHeight();
};

BC.prototype.resize = function(width, height) {
	if (this.$$popupDiv) {
		if(width && width.indexOf && width.indexOf('px')>0){
			width = width.split('px')[0];
		}
		if(height && height.indexOf &&  height.indexOf('px')>0){
			height = height.split('px')[0];
		}
		this.popup.resize(width, height);
	}
};

BC.prototype.destroy = function() {
};

BC.prototype.moveToTop = function() {
};

BC.prototype.close = function() {
	if (this.$$popupDiv) {
		this.popup.close();
		this.$$popupDiv = null;
	}
};

BC.prototype.hide = function() {
	if(this.popup){
		this.popup.hide();	
	}
};
BC.prototype.show = function() {
	if(this.popup){
		this.popup.show();	
	}
};

BC.prototype.hasVisibleItem = function(){
	return true;
};

BC.prototype.isOpen = function() {
	if (this.$$popupDiv) {
		return this.popup.isOpen();
	}
	return false;
};


BC.prototype.setTitle = function(title) {
	this.config.title = title;
	if (this.popup) {
		this.popup.changeTitle(title);
	}
};

BC.prototype.cancel = function(action) {
	this.cancels[action] = true;
};

BC.prototype.open = function(isglobal, paramObj) {
	var bc=this,bf = bc.bf;
	this.$$popupDiv = $$.create("DIV", {id: this.config.id});
	var param = csCloneObject(this.config);
	var width = null, height = null;
	var title = this.config.title;

	// popup açılırken focus edilmiş elemanı unfocus yap.
	if(!this.config.contextMenu){
		if(document.activeElement && typeof document.activeElement.blur == "function"){
			document.activeElement.blur();
		}
	}
	
	var member = null;
	for ( var memberName in this.bf.members) {// zaten tek eleman olmalı
		member = this.bf.members[memberName];
		var ref = member.bcRef;
		if( ref.typeName == "CSC-PAGE" ){//page
			var memConfig = ref.config.layoutConfig;
			if (memConfig.pageLayout == "fixed") {
				width = parseInt(memConfig.minWidth, 10) + 34;
				height = parseInt(memConfig.minHeight, 10) + 62;
			} else {
				width = parseInt(memConfig.minWidth, 10) + 34;
				if(memConfig.width && parseInt(memConfig.width, 10) > width){
					width = parseInt(memConfig.width, 10) + 34;
				}
				height = parseInt(memConfig.height, 10) + 62;
			}
			if (!title) {
				title = ref.config.title || "";
			}
		} else {//region
			if(ref.config.style){
				if(ref.config.style.width){
					width = parseInt(ref.config.style.width, 10) + 34;
				}
				if(ref.config.style.height){
					height = parseInt(ref.config.style.height, 10) + 62;
				}
			}
			
			title = title || ref.config.title || "";
		}
	}
	if(!paramObj){
		paramObj = {};
	}
	if(!this.config.style){
		this.config.style = {};
	}
	param.bf = this.bf;
	param.title = title;
	param.global = isglobal !== undefined ? isglobal : (this.config.isGlobal ? true : undefined);
	param.width = paramObj.width || this.config.style.width || width;
	param.height = paramObj.height || this.config.style.height || height;
	param.showMaximizeIcon = paramObj.showMaximizeIcon !== undefined ? paramObj.showMaximizeIcon : (this.config.showMaximizeIcon  || false); 
	param.showCloseIcon = paramObj.showCloseIcon !== undefined ? paramObj.showCloseIcon : (this.config.showCloseIcon); 
	param.overlayExist = paramObj.overlayExist !== undefined ? paramObj.overlayExist : (this.config.overlayExist);
	param.overlayOpacity = paramObj.overlayOpacity !== undefined ? paramObj.overlayOpacity : (this.config.overlayOpacity);
	param.showTitleBar = paramObj.showTitleBar !== undefined ? paramObj.showTitleBar : (this.config.showTitleBar);
	param.contextMenu = paramObj.contextMenu !== undefined ? paramObj.contextMenu : (this.config.contextMenu);
	param.closeOnEscape = paramObj.closeOnEsc !== undefined ? paramObj.closeOnEsc : (this.config.closeOnEsc);
	param.closeOnOverlayClick = paramObj.closeOnOverlayClick !== undefined ? paramObj.closeOnOverlayClick : (this.config.closeOnOverlayClick);
	param.reverseHor = paramObj.reverseHor ;
	param.resizable = paramObj.resizable !==undefined ? paramObj.resizable : this.config.resizable;
	param.fromTop = paramObj.fromTop ;
	param.fromRight = paramObj.fromRight ;
	param.buttons = paramObj.buttons ;
	param.minWindowHeight = paramObj.minWindowHeight ;
	param.relativeToRightBottom = paramObj.relativeToRightBottom || this.config.relativeToRightBottom;
	param.relativeToRightTop = paramObj.relativeToRightTop || this.config.relativeToRightTop;
	param.topPos = paramObj.top !== undefined ? paramObj.top : this.config.top ;
	param.leftPos = paramObj.left !== undefined ? paramObj.left : this.config.left ;
	param.rightPos = paramObj.right !== undefined ? paramObj.right : this.config.right ;
	param.cssClass = (paramObj.cssClass ? (paramObj.cssClass + " ") : "") + (this.config.cssClass || "");
	param.noThemeClass = paramObj.noThemeClass !== undefined ? paramObj.noThemeClass : this.config.noThemeClass;
	param.zIndex = ref.config.zIndex;
	param.sourceType = paramObj.sourceType;
	if(member && member.bcRef.config.cssClass){
		param.cssClass = " pp-" +member.bcRef.config.cssClass;
	}
	param.relativeTo = paramObj.relativeTo || this.config.relativeTo;
	param.closeCallback = function() {
		bf.saveState();
		bf.fire("onclose");
		if (member) {
			member.fire("onclose");
		}
		if(bc.cancels.close){
			bc.cancels.close = false;
			return false;
		}
		BFEngine.destroy(bf, true);//#hakand tinymce destroyu cagırılsın diye
		bc.$$popupDiv = null;
		if(paramObj.closeCallback){
			return paramObj.closeCallback();
		}
	};
	param.maximizeCallback = function(w, h) {
		bf.fire("onmaximize", w, h);
		if (member) {
			member.fire("onmaximize", w, h);
		}
		if(paramObj.maximizeCallback){
			paramObj.maximizeCallback(w, h);
		}
	};
	param.minimizeCallback = function(w, h) {
		bf.fire("onminimize", w, h);
		if (member) {
			member.fire("onminimize", w, h);
		}
		if(paramObj.minimizeCallback){
			paramObj.minimizeCallback(w, h);
		}
	};
	param.fullScreen = paramObj.fullScreen !== undefined ? paramObj.fullScreen : (this.config.fullScreen);

	this.popup = new CSSimplePopup(this.$$popupDiv, param);
	var ctx = {};
	this.bf.fire("beforeopen", ctx);
	if(ctx.notopen){
		return;
	}
	this.popup.open();
	this.render();
	
	BFEngine.fireLoadEvents(this.bf, true);
	this.bf.fire("opened", paramObj.openParam);
	if (member) {
		member.fire("onopen", paramObj.openParam);
	}
	
	var focusableBF = BFEngine.getFocusableBF(bf);
	if(focusableBF)
		BFEngine.focusBF(focusableBF);
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	} else if (eventName == "drop") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.ondrop = callback;
		}
	} else if (eventName == "dragover") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.ondragover = callback;
		}
	}
};

})(window);
/****************************=csc-table.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-TABLE
 * @author Mahmut Yıldız
 */

function Definition(CS) {
    this.DEFAULTS = {
        pageNum: 10,
        checkSpecialChars: false
    };

    this.BaseBF = "DYN-TABULAR";

    this.METHODS = ["clearSelections", "mask", "unmask", "collapse", "expand", "hasVisibleItem", "collapseAll", "collapse(rowid)", "expand(rowid)", "expandAll", "selectAll(select)", "reCalculateTotalRow", "setOnContextMenuCallback(callback)", "showContextMenu", "setPageRowCount(rowCount)", "getPageRowCount", "setNoDataText(text)", "scrollTo(direction)", "setExcelFileName(filename)","setExcelExportPath(path)", "group(fieldName, collapse)", "getSortInfo()", "getColModelMeta()", "setColModelMeta(colModelMeta)", "showButton(buttonName, flag)", "cancelAdd", "cancelDelete", "hideActionBar(flag)", "excelExport", "addEmptyRow", "removeLastRow", "onExcelImport(callback)", "getSearchInfo", "getTotal(sumProp)", "selectRow(rowid, select)", "removeSelectedRows", "setExtraSearchParams(params)", "setExcelModule(moduleName)", "clearFilter"];
    this.EVENTS = [ "selected", "onload","oninit(param)", "rowClicked(row, isSelectedEvent)", "rowRightClicked(row)", "rowDoubleClicked(row)", "rowselected(row, select)", "onselectall(select)", "onpaging(page)", "onpagechange(page)", "onsort()", "onnodeexpanded(rowid)", "onaddrow(addedRowId)", "ondeleterow(deletedRowId)", "ondeleteselectedrow(deletedRowIds)", "ondeleteselectedrow-complated(deletedRowIds)","ondeleterow-complated(deletedRowId)", "oncolmodelmetachanged", "onDoRelayout", "pageRowCountChanged(rowCount)", "ondragstart(member, rowid)", "rowChanged(member, row)" , "onExcelImport-complated()", "specialEvent()","onkeypress","onkeyup"];

    this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TABLE", def);

var BC = def.Type;

var TABLE_NO_DATA_TEXT = "";
BC.prototype.init = function(){
    TABLE_NO_DATA_TEXT = SideMLManager.get("common.noData");
    this.selecteds = [];
    this.rowStyles = {};
    this.collapseMap = {};
    this.prepareMetaData();
    this.pageIndex = 1;
};

BC.prototype.setExcelFileName = function(filename){
    this.efl = filename;
};

/**
 * Adds extra parameters to search service
 * @param {object} params - Parameters map as object like {param1:"value1", param2:"value2"}
 */
BC.prototype.setExtraSearchParams = function(params){
    this.esparams = params;
}

BC.prototype.scrollTo = function(arg){
    if(arg == "bottom"){
        var $$cont = $$.byid(this.config.id);
        if($$cont){
            this.scrollTop = 10000;
            $$cont.scrollTop = 10000;
        }
    }
};

BC.prototype.removeSelectedRows = function(){
    throw "\"removeSelectedRows\" is not implemented, instead use deleteSelectedRows";
};

BC.prototype.clearSelections = function(){
    var rows =  this.bf.getSelectedRows();
    for(var i=0; i<rows.length; i++){
        rows[i].select(false);
    }
};

BC.prototype.addEmptyRow = function(){
    if(inDesigner(this.bf)){ return; }

    var lastRow = this.bf.getRow(this.bf.length()-1);
    if(lastRow && lastRow.isEmpty(true)){
        return;//zaten boş bir satır varsa ekleme
    }
    BFEngine.a();
    try{
        this.bf.add({}, {readonly: false});
        this.cadd = false;
        this.bf.fire("onaddrow", this.bf.getRow(this.bf.length()-1).rowid);
        if(this.cadd){
            this.cadd = undefined;
            return;
        }
        var page = Math.ceil(this.bf.length() / this.bf.getPageRowCount());
        if(page != this.bf.getCurrentPage()){
            this.bf.gotoPage(page||1);
        }
    }finally{
        BFEngine.r();
        this.reRender();
    }
};

BC.prototype.getColumnModel = function(member, memberName){
    var memberRef = member.bcRef;
    if(memberRef.typeName == "CSC-POPUP" || memberRef.typeName == "CSC-HIDDEN" || memberRef.typeName == "CSC-TABLE-HEADER" || memberRef.typeName == "CSC-TABLE-TOTAL-ROW"){
        return;
    }
    if (!member.isVisible()) {
        return;
    }
    var memberConfig = member.getConfig();
    var title = memberConfig.title || memberConfig.label || "";
    var model = {
        name : memberName,
        title: title
    };
    var colWidth = 10;
    if (memberConfig.layoutConfig) {
        if(memberConfig.layoutConfig.columnWidth !== "" && memberConfig.layoutConfig.columnWidth !== undefined ){
            colWidth = memberConfig.layoutConfig.columnWidth;
        }
        model.align = memberConfig.layoutConfig.cellAlign;
        if(memberConfig.layoutConfig.sortable || BCDefaults.get("CSC-TABLE", "sortable", false, this.bf.getModuleName()) === true){
            model.sortable = memberConfig.layoutConfig.sortable === undefined ? BCDefaults.get("CSC-TABLE", "sortable", false, this.bf.getModuleName()) : memberConfig.layoutConfig.sortable;
        }
        if(memberConfig.layoutConfig.sortProp){
            model.sortProp = memberConfig.layoutConfig.sortProp;
        }
        if(memberConfig.layoutConfig.filter){
            model.filter = memberConfig.layoutConfig.filter;
            model.ftype = memberConfig.layoutConfig.ftype || "like";
        }
        if(memberConfig.layoutConfig.headerTip){
            model.headerTip = memberConfig.layoutConfig.headerTip;
        }
    }
    model.width = colWidth;
    return model;
};

BC.prototype.getColModelMeta = function(){
    return this.config.colmodelMeta;
}

BC.prototype.setColModelMeta = function(colModelMeta){
    this.config.colmodelMeta = colModelMeta;
    this.bf.rerender();
}

BC.prototype.prepareColumnModel = function(){
    var colmodel = [];
    var colmodelMeta = this.config.colmodelMeta || [];
    this.colmodel = colmodel;
    if(this.config.rownumbers){
        colmodel.push({
            rownumbers: true
        });
    }

    if(this.config.selectable){
        colmodel.push({
            select: true
        });
    }

    if(this.config.useColModelMeta && colmodelMeta.length !== 0){
        for(var i=0; i<colmodelMeta.length; i++){
            for ( var memberName in this.bf.members) {
                var member = this.bf.members[memberName];
                var model = this.getColumnModel(member, memberName);
                if(model && model.name === colmodelMeta[i].name && colmodelMeta[i].visibility !== false ){
                    colmodel.push(model);
                }
            }
        }
    }else{
        for ( var memberName in this.bf.members) {
            var member = this.bf.members[memberName];
            var model = this.getColumnModel(member, memberName);
            if(model){
                colmodel.push(model);
                if(this.config.useColModelMeta){ colmodelMeta.push({name:model.name}); }
            }
        }
    }

    this.colmodel = colmodel;
    this.config.colmodelMeta = colmodelMeta;
};

BC.prototype.prepareMetaData = function() {
    this.rowsMetaData = [];
    this.simpleElement = false;
    this.header = undefined;
    this.rowSelectable = false;
    var colCellCount = 0;
    for (var memberName in this.bf.members) {
        var member = this.bf.members[memberName];
        var memberRef = member.bcRef;
        if(memberRef.typeName == "CSC-TABLE-HEADER"){
            this.header = member;
        } else if(memberRef.typeName == "CSC-TABLE-ROW"){
            if(memberRef.config.selectable){
                this.rowSelectable = true;
            }
            if(memberRef.config.rownumbers){
                this.rowNumbers = true;
            }
            var meta = {member: member, columns: [], colmodel: [], selectable: memberRef.config.selectable, rownumbers: memberRef.config.rownumbers};
            if(memberRef.config.identifier){
                meta.identifier = memberRef.config.identifier;
            }
            colCellCount = 0;
            if(this.config.selectable){
                meta.colmodel.push({select:true});
                meta.columns.push("");
                colCellCount++;
            }
            for (var rowMemberName in member.members) {
                if(!meta.identifier){
                    meta.identifier = rowMemberName;
                }
                var rowMember = member.members[rowMemberName];
                if(!rowMember.isVisible()){
                    continue;
                }
                var rowMemberConfig = rowMember.getConfig();
                if(rowMemberConfig.layoutConfig && rowMemberConfig.layoutConfig.rowIdentifier){
                    meta.identifier = rowMemberName;
                }
                var memberRef = rowMember.bcRef;
                if(memberRef.typeName != "CSC-POPUP" && memberRef.typeName != "CSC-HIDDEN"){
                    meta.colmodel.push(this.getColumnModel(rowMember, rowMemberName));
                    meta.columns.push(rowMemberName);
                    if(rowMemberConfig.layoutConfig && rowMemberConfig.layoutConfig.colSpan && parseInt(rowMemberConfig.layoutConfig.colSpan) > 0){
                        colCellCount += parseInt(rowMemberConfig.layoutConfig.colSpan);
                    } else {
                        colCellCount++;
                    }
                }
            }
            this.rowsMetaData.push(meta);
        } else if(memberRef.typeName == "CSC-TABLE-TOTAL-ROW"){
            this.totalRow = member;
        } else {
            this.simpleElement = true;
            if(memberRef.typeName != "CSC-POPUP" && memberRef.typeName != "CSC-HIDDEN" && memberRef.isVisible()){
                colCellCount++;
            }
        }
    }
    if(colCellCount){
        if(this.config.selectable){
            colCellCount++;
        }
        if(this.config.rownumbers || this.rowNumbers){
            colCellCount++;
        }
        this.colCellCount = colCellCount;
    }
};

BC.prototype.deleteRow = function(rowid){
    // #hakand addrow da rerender edilmiş. delete row içinde aynısını yaptım cunku toplam kayıt sayısı değişmiyor(footerda)
    if(this.bf.fmembers){//filter varken yeni row silinirse tekrar filter yapsın #hakand
        this.makeFilter();
    }else{
        this.bf.rerender();
    }
};


BC.prototype.setOnContextMenuCallback = function(callback, options) {
    this.contextMenuCallback = callback;
    this.contextMenuOptions = options;

    // #hakand addrow da rerender edilmiş. delete row içinde aynısını yaptım cunku toplam kayıt sayısı değişmiyor(footerda)
    this.bf.rerender();
};

BC.prototype.rightClickCallback = function(rowid, event) {
    var bc = this;
    if(bc.contextMenuCallback){
        var row = bc.bf.getRowByRowId(rowid);
        window.currentRow = row;
        bc.showContextMenu2(event, row, rowid);
    }
};

BC.prototype.showContextMenu2 = function(event, row, rowid) {
    event = event || window.event;
    var bc = this;
    console.log("table context menu. rowid:", rowid);
    event.preventDefault();
    var menuItemsObj = this.contextMenuCallback(row, rowid);

    csdu.contextMenu({
        moduleName: bc.bf.getModuleName(),
        left: event.pageX,
        top: event.pageY,
        items:menuItemsObj,
        leftSide: (bc.contextMenuOptions && bc.contextMenuOptions.leftSide) ? true : false

    }, rowid, event);
};

BC.prototype.showContextMenu = function() {
    var bc = this;
    var event = window.event;
    var rowid = currentRow.getRowId();
    var row = currentRow;
    console.log("table context menu2. rowid:", rowid);
    event.preventDefault();
    if(this.contextMenuCallback){
        var menuItemsObj = this.contextMenuCallback(row, rowid);
        csdu.contextMenu({
            moduleName: bc.bf.getModuleName(),
            left: event.pageX,
            top: event.pageY,
            items:menuItemsObj,
            leftSide: (bc.contextMenuOptions && bc.contextMenuOptions.leftSide) ? true : false
        }, rowid, event);
    }
};

BC.prototype.destroybc = function(){
    this.$$tableDiv = null;
    this.$$table = null;
    this.$$thead = null;
    this.$$tbody = null;
};

BC.prototype.showButton = function(buttonName, flag){
    if(buttonName === "add"){
        this.config.addBtn = flag;
    }else if(buttonName === "del"){
        this.config.delBtn = flag;
    }else if(buttonName === "rm"){
        this.config.rmBtn = flag;
    }

    var $$tr = $$.getChildHasClass(this.$$thead, "csc-table-action-tr");
    if($$tr){
        var $$td = $$.getChildsHasTag($$tr, "th")[0];
        var bf = this.bf;
        this.reRender();
    }
};

BC.prototype.cancelAdd = function(){
    if(this.cadd === false){
        var tableSize = this.bf.length();
        if(tableSize>0){
            this.bf.deleteRow(this.bf.getRow(tableSize-1).rowid);
        }
    }
    this.cadd = true;
};

BC.prototype.cancelDelete = function(){
    this.cdel = true;
};

BC.prototype.renderActionBarButtons = function($$th, tablebf){
    var bc = this;

    if(this.config.addBtn){
        var $$inputAdd = $$.create("INPUT", {id: this.config.id+"-add", type:"button", title: SideMLManager.get("common.addRow")}, ["csc-mini-button","csc-table-action-btn", "addRow","csc-table-add-row-button"],{backgroundImage:"url('css/bc-style/img/row-add.png')"});
        if(bc.config.disabled || bc.bf.isDisabled()){
            $$.css($$inputAdd, {"opacity": "0.5", "cursor": "default"});
        }else{
            $$inputAdd.onclick = function(){
                if(inDesigner(bc.bf)){ return; }

                var lastRow = tablebf.getRow(tablebf.length()-1);
                if(lastRow && lastRow.isEmpty(true)){
                    return;//zaten boş bir satır varsa ekleme
                }
                tablebf.add({}, {readonly: false});
                bc.cadd = false;
                bc.bf.fire("onaddrow", tablebf.getRow(tablebf.length()-1).rowid);
                if(bc.cadd){
                    bc.cadd = undefined;
                    return;
                }
                var page = Math.ceil(tablebf.length() / tablebf.getPageRowCount());
                if(page != tablebf.getCurrentPage()){
                    tablebf.gotoPage(page);
                }
            };
        }
        $$th.appendChild($$inputAdd);
    }
    if(this.config.delBtn){
        var $$inputRemove = $$.create("INPUT", {id: this.config.id+"-del", type:"button", title: SideMLManager.get("common.deleteRow")}, ["csc-mini-button","csc-table-action-btn","deleteRow","csc-table-remove-row-button"],{backgroundImage:"url('css/bc-style/img/row-last-del.png')"});
        if(bc.config.disabled || bc.bf.isDisabled()){
            $$.css($$inputRemove, {"opacity": "0.5", "cursor": "default"});
        }else{
            $$inputRemove.onclick = function(){
                if(inDesigner(bc.bf)){ return; }

                var tableSize = tablebf.length();

                if(tableSize>0 /*&& !tablebf.getRow(tableSize-1).readonly*/){
                    var deletedRowId = tablebf.getRow(tableSize-1).rowid;
                    bc.cdel = null;
                    bc.bf.fire("ondeleterow", deletedRowId);
                    if(bc.cdel){//cancel delete?
                        bc.cdel=null;
                        return;
                    }
                    tablebf.deleteRow(deletedRowId);

                    var lastPage = Math.ceil(tablebf.length() / tablebf.getPageRowCount());
                    if(lastPage != tablebf.getCurrentPage()){
                        tablebf.gotoPage(lastPage);
                    }
                    bc.bf.fire("ondeleterow-complated", deletedRowId);
                }
            };
        }
        $$th.appendChild($$inputRemove);
    }
    if(this.config.rmBtn){
        var $$inputRemove = $$.create("INPUT", {id: this.config.id+"-rm", type:"button", title: SideMLManager.get("common.deleteSelectedRows")}, ["csc-mini-button","csc-table-action-btn","deleteSelectedRows","csc-table-delete-row-button"],{backgroundImage:"url('css/bc-style/img/row-delete.png')"});
        if(bc.config.disabled || bc.bf.isDisabled()){
            $$.css($$inputRemove, {"opacity": "0.5", "cursor": "default"});
        }else{
            $$inputRemove.onclick = function(){
                if(inDesigner(bc.bf)){ return; }

                var rows = tablebf.getSelectedRows();
                if(!rows.length){
                    CSPopupUTILS.MessageBox(SideMLManager.get("common.selectRowsToDelete"));
                    return
                }

                var deletedRows = tablebf.getSelectedRows();
                var deletedRowIds = [];
                for(var i=0;i<deletedRows.length; i++){
                    deletedRowIds.push(deletedRows[i].rowid);
                }

                bc.cdel = null;
                bc.bf.fire("ondeleteselectedrow", deletedRowIds);
                if(bc.cdel){//cancel delete?
                    bc.cdel=null;
                    return;
                }
                tablebf.deleteSelectedRows();
                var lastPage = Math.ceil(tablebf.length() / tablebf.getPageRowCount());
                if(lastPage != tablebf.getCurrentPage()){
                    tablebf.gotoPage(lastPage);
                }
                bc.bf.fire("ondeleteselectedrow-complated", deletedRowIds);
            };
        }
        $$th.appendChild($$inputRemove);
    }
    if(this.config.srchBtn){
//		var $$searchIcon = $$.create("INPUT", {id: this.config.id+"-search", title: "Arama Yap"}, ["csc-mini-button","csc-table-action-btn"],{backgroundImage:"url('css/bc-style/img/searchBcIcon.png')", "float": "right"});
        var $$searchIcon = $$.create("DIV", {id: this.config.id+"-search", title: SideMLManager.get("common.search")}, ["csc-table-search-icon"]);

        var bc = this;
        var popupOpened = false;

        // başlıkları arama paneline eklemek için.
        var $$headerTr = $$.getChildHasAttr(this.$$thead, "rel", "def-tr");
        for(var memberName in tablebf.members){
            var member = tablebf.members[memberName];
            var memberConfig = member.getConfig();
            if(memberConfig){
                var memberLayoutConfig = memberConfig.layoutConfig;
                if(memberLayoutConfig && memberLayoutConfig.searchable === false){
                    var $$header = $$.getChildHasAttr($$headerTr, "rel", memberName);
                    if($$header){
                        $$header.oncontextmenu = function(e){
                            if(!$$.byid(bc.config.id+"-addSearchPanel")){
                                $$.css(this, {position: "relative", overflow: "visible"});

                                var $$addSearchPanelSection = $$.create("DIV", {id: bc.config.id+"-addSearchPanel"}, "csc-table-searchPanel-add");
                                $$addSearchPanelSection.innerHTML = SideMLManager.get("common.addToSearchPanel");

                                var thiz = this;

                                $$addSearchPanelSection.onclick = function(){
                                    if(bc.addedToSearchPanel){
                                        bc.addedToSearchPanel.push(this.parentElement.getAttribute("rel"));
                                    }else {
                                        bc.addedToSearchPanel = [this.parentElement.getAttribute("rel")];
                                    }

                                    $$addSearchPanelSection.parentNode.removeChild($$addSearchPanelSection);
                                    $$.css(thiz, {position: "", overflow: ""});
                                    window.onclick = null;
                                }

                                this.appendChild($$addSearchPanelSection);

                                window.onclick = function(e){
                                    if(e.target.className !== "csc-table-searchPanel-add"){
                                        $$addSearchPanelSection.parentNode.removeChild($$addSearchPanelSection);
                                        $$.css(thiz, {position: "", overflow: ""});
                                        window.onclick = null;
                                    }
                                }
                                return false;
                            }
                        }
                    }
                }
            }
        }


        function fonk(){
            var $$searchContainer = $$.create("DIV", {id: bc.config.id+"-searchContainer"}, undefined, {width: "100%", backgroundColor: "#fff", position:"absolute", top: "0", paddingTop: "2%", height: "100%"}, bc.$$table);
            var $$table = $$.create("TABLE", undefined, undefined, {width: "initial", margin: "auto"}, $$searchContainer);
            $$.css(bc.$$table, "position", "relative");

            var components = [];

            var $$tbody = $$.create("TBODY", undefined, undefined, undefined, $$table);

            var options = ["-----", SideMLManager.get("common.searchEquals"), SideMLManager.get("common.searchNotEquals") , SideMLManager.get("common.searchLessThan"), SideMLManager.get("common.searchGreaterThan"), SideMLManager.get("common.searchLessThanOrEquals"), SideMLManager.get("common.searchGreaterThanOrEquals"), SideMLManager.get("common.searchIncludes"), SideMLManager.get("common.searchExcludes")];

            var c=0;
            function drawTable(parent, force){
                if(parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-BUTTON" || parent.bcRef.typeName === "CSC-HIDDEN")){
                    return;
                }
                var memberConfig = parent.getConfig();
                if(!parent.bcRef.config.visible && memberConfig.layoutConfig.searchable !== true){
                    return;
                }
                // colmodelmeta'da invisible'sa geç.
                if(bc.config.useColModelMeta && bc.config.colmodelMeta){
                    for(var i=0; i<bc.config.colmodelMeta.length; i++){
                        if(memberConfig.layoutConfig.searchable === true){
                            continue;
                        }
                        if( (parent.getMemberName() === bc.config.colmodelMeta[i].name) && (bc.config.colmodelMeta[i].visibility === false) ){
                            return;
                        }
                    }
                }

                if( !memberConfig.layoutConfig || ( memberConfig.layoutConfig && ( (memberConfig.layoutConfig.searchable === undefined || memberConfig.layoutConfig.searchable === true) || force ) ) ){
                    var obj = {};
                    var $$tr = $$.create("TR");
                    $$tbody.appendChild($$tr);

                    // Label
                    var $$td = $$.create("TD");
                    $$td.innerHTML = memberConfig.label+" : ";
                    $$tr.appendChild($$td);

                    // Bileşen
                    $$td = $$.create("TD");
                    var startMemberConfig = csCloneObject(memberConfig, true);
                    delete startMemberConfig.value;
                    startMemberConfig.id = BCEngine.newId();
                    BFEngine.newDefinition(parent.$CS$.definition.BF_NAME+"_SEARCH_START", parent.$CS$.definition.BC_REF, parent.members, startMemberConfig, parent.bcRef.events);
                    var clonedParentStart = BFEngine.create({name: parent.$CS$.name+"SearchStart", BF: parent.$CS$.definition.BF_NAME+"_SEARCH_START"});
                    clonedParentStart.$CS$.parent = parent.getParent();
                    SIDENavigator.renderToDiv($$td, clonedParentStart);
                    $$tr.appendChild($$td);
                    $$.css($$td.children[0], "display", "inline-block");

                    // End Kısmı, sadece date, number ve currency için çizilmeli.
                    if(parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-NUMBER" || parent.bcRef.typeName === "CSC-DATETIME" || parent.bcRef.typeName === "CSC-TARIH" || parent.bcRef.typeName === "CSC-CURRENCY")){
                        var endMemberConfig = csCloneObject(memberConfig, true);
                        var newId = BCEngine.newId();
                        endMemberConfig.id = newId;
                        BFEngine.newDefinition(parent.$CS$.definition.BF_NAME+"_SEARCH_END", parent.$CS$.definition.BC_REF, parent.members, endMemberConfig, parent.bcRef.events);
                        var clonedParentEnd = BFEngine.create({name: parent.$CS$.name+"SearchEnd", BF: parent.$CS$.definition.BF_NAME+"_SEARCH_END"});
                        clonedParentEnd.$CS$.parent = parent.getParent();
                        var $$div = $$.create("DIV");
                        SIDENavigator.renderToDiv($$div, clonedParentEnd);
                        $$div = $$div.children[0];
                        $$.css($$div, "display", "inline-block");
                        $$.css($$td.children[0], "width", "inherit");
                        $$.css($$div, "width", "inherit");
                        var $$seperator = $$.create("SPAN", undefined, undefined, undefined, $$td);
                        $$seperator.innerHTML += " / ";
                        $$td.appendChild($$div);
                        obj.end = clonedParentEnd;
                    }

                    // Kriter Kısmı
                    $$td = $$.create("TD");
                    var comboId = "combo-"+c;
                    var $$combo = $$.create("SELECT", {id: comboId}, "csc-combobox", undefined, $$td);
                    for(var i=0; i<options.length; i++){
                        if(parent.bcRef.typeName && (parent.bcRef.typeName !== "CSC-NUMBER" && parent.bcRef.typeName !== "CSC-DATETIME" && parent.bcRef.typeName !== "CSC-TARIH" && parent.bcRef.typeName !== "CSC-CURRENCY")
                            && (i == 7 || i == 8) ){
                            continue;
                        }

                        var $$option = $$.create("OPTION", i===0 ? undefined : {value:i}, undefined, undefined, $$combo);

                        if(i == 1){
                            $$.attr($$option, "selected");
                        }

                        $$option.innerHTML = options[i];
                    }
                    $$tr.appendChild($$td);


                    // Sıralama alanı
                    if(bc.config.orderColumn){
                        var $$td = $$.create("TD");
                        var orderComboID = "ordercombo-"+c;
                        var $$combo = $$.create("SELECT", {id: orderComboID}, "csc-combobox", undefined, $$td);
                        $$.create("OPTION", {}, undefined, undefined, $$combo);
                        var $$optionasc = $$.create("OPTION", {value: "asc"}, undefined, undefined, $$combo);
                        $$optionasc.innerHTML = SideMLManager.get("common.ascendingOrder");
                        var $$optiondesc = $$.create("OPTION", {value: "desc"}, undefined, undefined, $$combo);
                        $$optiondesc.innerHTML = SideMLManager.get("common.descendingOrder");
                        $$tr.appendChild($$td);
                        obj.order = orderComboID;
                    }

                    c++;


                    obj.start = clonedParentStart;
                    obj.name = parent.getMemberName();
                    obj.combo = comboId;
                    obj.type = parent.bcRef.typeName;
                    components.push(obj);

                    // Bir önceki arama değerleri set ediliyor.
                    if(bc.config.holdOldSearchValues && bc.datasForSearch && bc.datasForSearch[obj.name]){
                        obj.start.setValue(bc.datasForSearch[obj.name][0]);
                        obj.end.setValue(bc.datasForSearch[obj.name][1]);
                        $$.byid(obj.combo).selectedIndex = options.indexOf(bc.datasForSearch[obj.name][2]);
                    }
                }
            }

            for(var member in tablebf.members){
                if(!tablebf.members[member].isContainer()){
                    drawTable(tablebf.members[member]);
                }else if(tablebf.members[member].isContainer() && (tablebf.members[member].getConfig().layout === "CSC-TABLE-ROW") ){
                    var tableRow = tablebf.members[member].members;
                    for(var member in tableRow){
                        drawTable(tableRow[member]);
                    }
                    break;
                }
            }

            // sonradan eklenenleri çizmek için.
            if(bc.addedToSearchPanel){
                for(var member in tablebf.members){
                    if(!tablebf.members[member].isContainer()){
                        if(bc.addedToSearchPanel.indexOf(member) !== -1){
                            drawTable(tablebf.members[member], true);
                        }
                    }else if(tablebf.members[member].isContainer() && (tablebf.members[member].getConfig().layout === "CSC-TABLE-ROW") ){
                        var tableRow = tablebf.members[member].members;
                        for(var member in tableRow){
                            if(bc.addedToSearchPanel.indexOf(member) !== -1){
                                drawTable(tableRow[member], true);
                            }
                        }
                        break;
                    }
                }
            }


            var $$tr = $$.create("TR");
            $$tbody.appendChild($$tr);

            $$th = $$.create("TD", {colspan: 5}, undefined, {textAlign: "center"});
            var $$searchButton = $$.create("INPUT", {type:"button", value:SideMLManager.get("common.search")}, "csc-button");
            $$searchButton.onclick = function(){
                if(!bc.config.searchService) {
                    console.log("No search service name.");
                    return;
                }
                bc.datasForSearch = {}
                for(var i=0; i<components.length; i++){
                    var start = components[i].start ? (components[i].start).getValue() : "";
                    var end = components[i].end ? (components[i].end).getValue() : "";
                    var combo = options[$$.byid(components[i].combo).selectedIndex];
                    var order = bc.config.orderColumn ? $$.byid(components[i].order).value : undefined;
                    var type = components[i].type;

                    if((!order || order ==="") && (start == "" || start == undefined || combo == "-----")){
                        continue;
                    }
                    bc.datasForSearch[components[i].name] = [start, end, combo, type, order];
                }

                bc.searchParams = bc.datasForSearch;

                bc.bf.fire("onbefore-search");

                if(Object.keys(bc.datasForSearch).length > 0){
                    bc.bf.setDataSource(bc.config.searchService, {request: bc.datasForSearch, extraParams: bc.esparams}, function() {
                        $$.css(bc.$$table, "position", "");
                        if($$searchContainer.parentNode){
                            $$searchContainer.parentNode.removeChild($$searchContainer);
                        }
                    });
                }
            };
            $$th.appendChild($$searchButton);

            var $$clearButton = $$.create("INPUT", {type:"button", value:SideMLManager.get("common.clear")}, "csc-button");
            $$clearButton.onclick = function(){
                for(var i=0; i<components.length; i++){
                    if(components[i].start){
                        components[i].start.clear();
                    }

                    if(components[i].end){
                        components[i].end.clear();
                    }
                }

                for(var i=0; i<$$tbody.childNodes.length; i++){
                    var tr = $$tbody.childNodes[i].childNodes[2];
                    if(tr){
                        var combo = $$.getChildHasClass(tr, "csc-combobox");
                        if(combo){
                            combo.value = 1;
                        }
                    }
                }

            }
            $$th.appendChild($$clearButton);

            var $$cancelButton = $$.create("INPUT", {type:"button", value:SideMLManager.get("common.cancel")}, "csc-button");
            $$cancelButton.onclick = function(){
                $$.css(bc.$$table, "position", "");
                $$searchContainer.parentNode.removeChild($$searchContainer);
            }
            $$th.appendChild($$cancelButton);

            $$tr.appendChild($$th);
        }

        $$searchIcon.onclick = function(){
            if(!inDesigner(bc.bf) && !popupOpened){
                fonk();
            }
        };

        $$th.insertBefore($$searchIcon, $$th.children[0]);
    }
}

BC.prototype.renderEditColumnTable = function($$th) {
    var $$editButton = $$.create("INPUT", {id: this.config.id+"-rm", type:"button", title: SideMLManager.get("common.editCol")}, ["csc-mini-button","csc-table-action-btn","editCol","csc-table-column-edit-button"],{backgroundImage:"url('css/bc-style/img/table_column_edit.png')", "float": "right"});
    $$th.insertBefore($$editButton, $$th.children[0]);
    var popupOpened = false;
    var bc = this;
    var tablebf = bc.bf;

    $$editButton.onclick = function(event){
        if(!inDesigner(bc.bf) && !popupOpened){
            SIDENavigator.setEvent(event);
            var popupOpenCallback = function(popup) {
                // Listenin sayfaya sığdırılması işlemi yapılıyor.
                var windowHeight = window.innerHeight;
                var popupBoundingClientReact = popup.$popupContent[0].getBoundingClientRect()
                var popupBottomLocation = popupBoundingClientReact.bottom;

                // Popup devamı window'un altında kalmışsa max heiht ile window içine çek.
                if( popupBottomLocation - windowHeight > 0 ){
                    var diff = popupBottomLocation - windowHeight;
                    var height = popupBoundingClientReact.height;
                    var newHeight = height - diff - 10;
                    popup.setMaxHeight(newHeight);
                }
            };

            var $$table = $$.create("TABLE", undefined, undefined, {width: "100%"});
            var popup = new CSSimplePopup($$table, {cssClass: "csc-table-editmeta", disableShotcuts: false, closeOnEscape: true, dontRemove: false, contextMenu:true, showTitleBar:false, overlayExist: true, closeCallback: function(){popupOpened = false;}, openCallback: popupOpenCallback });

            var oldTitles = [];

            var $$tr = $$.create("TR", undefined, undefined, {textAlign: "center", fontWeight: "bold"});
            $$table.appendChild($$tr);


            if(bc.config.editColVisibility){
                var $$td = $$.create("TD");
                $$td.innerHTML = "<span>" + SideMLManager.get("common.visibility") + "</span>";
                $$tr.appendChild($$td);
            }
            if(!bc.config.editColName){
                var $$td = $$.create("TD");
                $$td.innerHTML = "<span>" +SideMLManager.get("common.colName") + "</span>";
                $$tr.appendChild($$td);
            } else {
                var $$td = $$.create("TD");
                $$td.innerHTML = "<span>" +SideMLManager.get("common.colHeader") + "</span>";
                $$tr.appendChild($$td);
            }

            function drawTable(parent){
                if(parent.bcRef.typeName && (parent.bcRef.typeName === "CSC-BUTTON" || parent.bcRef.typeName === "CSC-HIDDEN" || !parent.bcRef.config.visible)){
                    return;
                }
                var memberConfig = parent.getConfig();
                var meta = undefined;

                for(var i=0; i<bc.config.colmodelMeta.length; i++){
                    if(parent.getMemberName() === bc.config.colmodelMeta[i].name){
                        meta = bc.config.colmodelMeta[i]; break;
                    }
                }

                $$tr = $$.create("TR", {rel:parent.getMemberName()});

                if(bc.config.editColVisibility){
                    var $$td = $$.create("TD", undefined, undefined, {textAlign: "center"});
                    var $$visibility = $$.create("INPUT", {type:"checkbox"}, "csc-checkbox");
                    (meta && meta.visibility === false) ? "" : $$.attr($$visibility, "checked", "true") ;
                    $$td.appendChild($$visibility);
                    $$tr.appendChild($$td);
                }
                if(!bc.config.editColName){
                    var $$td = $$.create("TD", undefined, undefined, {textAlign: "center"});
                    var title = meta && meta.title ? meta.title : memberConfig.label;
                    var $$title = $$.create("SPAN");
                    $$title.innerHTML = title;
                    $$td.appendChild($$title);
                    $$tr.appendChild($$td);
                } else {
                    var $$td = $$.create("TD");
                    var title = meta && meta.title ? meta.title : memberConfig.label;
                    var $$title = $$.create("INPUT", {type:"text", value: title }, "csc-textbox");
                    oldTitles.push(title);
                    $$td.appendChild($$title);
                    $$tr.appendChild($$td);
                }

                $$table.appendChild($$tr);
            }

            for(var member in tablebf.members){
                var memConf = tablebf.members[member].getConfig();
                if(!tablebf.members[member].isContainer() && (!memConf.layoutConfig || !memConf.layoutConfig.hideInModelTable) ){
                    drawTable(tablebf.members[member]);
                }else if(tablebf.members[member].isContainer() && (tablebf.members[member].getConfig().layout === "CSC-TABLE-ROW") ){
                    var tableRow = tablebf.members[member].members;
                    for(var member in tableRow){
                        drawTable(tableRow[member]);
                    }
                    break;
                }
            }

            var $$tr = $$.create("TR");
            $$table.appendChild($$tr);

            if(bc.config.editColVisibility){
                var $$td = $$.create("TD");
                $$tr.appendChild($$td);
            }

            $$td = $$.create("TD");
            var $$saveButon = $$.create("INPUT", {type:"button", value: SideMLManager.get("common.save")}, "csc-button");
            $$td.appendChild($$saveButon);
            var $$cancelButon = $$.create("INPUT", {type:"button", value: SideMLManager.get("common.cancel")}, "csc-button");
            $$cancelButon.onclick = function(){popup.close(); popupOpened = false;}
            $$td.appendChild($$cancelButon);
            $$tr.appendChild($$td);

            $$saveButon.onclick = function(){
                // tablodakilerle colmodelmetayı düzenle
                for(var i=0; i<$$table.children.length && ( bc.config.editColVisibility || bc.config.editColName) ; i++){
                    var rel = $$table.children[i] ? $$table.children[i].getAttribute("rel") : undefined;
                    if(rel){
                        for(var j=0; j<bc.config.colmodelMeta.length; j++){
                            if(bc.config.colmodelMeta[j].name === rel){
                                if(bc.config.editColVisibility){
                                    if(!$$table.children[i].children[0].children[0].checked){
                                        bc.config.colmodelMeta[j].visibility = false;
                                    }else if(bc.config.colmodelMeta[j].visibility === false){
                                        delete bc.config.colmodelMeta[j].visibility;
                                    }
                                }

                                if(!bc.config.editColName){break;}

                                var newTitle = newTitle = $$table.children[i].children[1].children[0].value;
                                if(oldTitles.indexOf(newTitle) === -1){
                                    bc.config.colmodelMeta[j].title = newTitle;
                                }

                                break;
                            }
                        }
                    }
                }

                bc.bf.fire("oncolmodelmetachanged");
                popup.close(); popupOpened = false;
                bc.bf.rerender();
            }

            popup.open();
            popupOpened = true;

            if(popup.isOpen()){
                $poppp = popup.$popupWindow;
                $poppp.css("left", ($poppp.position().left-$poppp.width()))
            }
        }
    };
};

BC.prototype.addRowOnEnter = function($$table){
    var bc=this, bf=bc.bf;
    if(bc.config.newRowOnEnter){
        $$table.setAttribute("tabindex", 100);
        $$table.onkeypress = function(e){
            if (e.which == 13){
                var target = e.target;
                while(target && target.tagName != "TR"){
                    target = target.parentNode;
                }
                if(target){
                    var rowid = target.getAttribute("rowid");
                    if(rowid){
                        var index = bf.getIndexFromRowId(rowid)+1;
                        BFEngine.a();
                        try {
                            bf.add({}, {readonly:false, position: index});
                            var row = bf.getRow(index);
                            for(var mname in row.members){
                                if(!row.members[mname].isReadonly()){
                                    row.members[mname].focus();
                                    break;
                                }
                            }
                        } finally {
                            BFEngine.r();
                        }
                        bc.cadd = false;
                        bf.fire("onaddrow", row.rowid);
                        if(bc.cadd){
                            bc.cadd = undefined;
                            return;
                        }
                    }
                };
            }
        }
    }
};

BC.prototype.render = function($container) {
    this.prepareMetaData();
    var bf = this.bf;
    var bc = this;

    if(bc.config.pageSelect){
        bc.config.selectall=false;
    }

    this.$$tableDiv = $$.create("div", {id: this.config.id}, [this.config.theme, "csc-table", this.config.cssClass]);
    this.$$table = $$.create("table", {id: this.config.id+"-t"}, null, null, this.$$tableDiv);
    this.$$thead = $$.create("thead", {id: this.config.id+"-h"}, null, null, this.$$table);
    this.$$tbody = $$.create("tbody", {id: this.config.id+"-b"}, null, null, this.$$table);
    this.$$tableDiv.style.display = (inDesigner(this.bf) || this.config.visible) ? "" : "none";

    if(this.config.style && this.config.style.width){
        $$.css(this.$$tableDiv, "width", this.config.style.width);
    }
    if(this.config.style && this.config.style.overflow){
        $$.css(this.$$tableDiv, "overflow", this.config.style.overflow);
    }
    if(this.config.tlayout){
        $$.css(this.$$table, "table-layout", this.config.tlayout);
    }
    this.$$table.setAttribute("rel",this.bf.$CS$.name);
    bc.addRowOnEnter(bc.$$table);

    if(this.rowsMetaData.length > 0 && this.simpleElement){
        var $$span = $$.create("span");
        $$span.innerHTML = "TABLE ROW and Non-TABLE ROW element cannot be used in a TABLE together.";
        $container.appendChild($$span);
        return;
    }

    $container.appendChild(this.$$tableDiv);

    var $$parent = this.$$tableDiv.parentNode;
    if(this.bf.$CS$.parent){
        $$parent = this.bf.$CS$.parent.bcRef.getChildContainer(this.bf.$CS$.name);
    }

    if($$parent){
        this.parentWidth = $$parent.offsetWidth;
    }

    this.prepareColumnModel();
    if(this.header && !this.config.noHeader){
        BFEngine.render(this.header, this.$$thead);
        if(this.header.getConfig().defHeader){
            this.renderDefaultHeader();
            this.calculateCellWidths();
            this.applyCellWidths();
        }
    } else if(!this.header && !this.config.noHeader) {
        this.renderDefaultHeader();
        this.calculateCellWidths();
        this.applyCellWidths();
    }

    if(this.rowCounter){
        this.rowCounter = 0;
    }
    if (inDesigner(this.bf) ) {
        this.bf.tmembers = [];
        if(this.rowsMetaData.length == 0){
            var row = new CSDGridRow(bf, 0);
            for(var memberName in bf.members) {
                row.members[memberName] = bf.members[memberName];
            }
            this.bf.tmembers.push(row);
            this.renderRows(0,this.bf.tmembers.length);
        } else {
            for(var i=0; i<this.rowsMetaData.length ;i++){
                var row = new CSDGridRow(bf, 0);
                for(var memberName in this.rowsMetaData[i].member.members) {
                    row.members[memberName] = this.rowsMetaData[i].member.members[memberName];
                }
                this.bf.tmembers.push(row);
            }
            this.renderRows(0,this.bf.tmembers.length);
        }
    } else {
        var members = this.bf.bmembers || this.bf.fmembers || this.bf.tmembers;
        if (bf.$CS$.ds) {
            this.renderRows(0, this.bf.tmembers.length);
        } else {
            if(this.config.page){
                var maxPage = Math.floor(members.length/this.config.pageNum)+1;
                if(this.pageIndex > maxPage){
                    this.pageIndex = maxPage;
                }
                this.renderRows((this.pageIndex-1)*this.config.pageNum, (this.pageIndex)*this.config.pageNum);
            } else {
                this.renderRows(0, members.length);
            }
        }
    }
    if(this.totalRow && ((SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.isVisible()) || (!SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.hasVisibleItem() && this.totalRow.isVisible()))){
        this.addTotalRow();
    }
    if(this.config.noFooter !== true){
        this.addFooterRow();
    }
    this.putMessage(this.nodatamsg);
    if(this.scrollTop){
        this.$$tableDiv.scrollTop = this.scrollTop;
    }

    if( (this.config.showActionButtons || this.config.editColName || this.config.editColVisibility) && this.config.hideActionBar !=true ){
        var $$actionBar = $$.getChildHasClass(this.$$thead, "csc-table-action-tr");
        var $$th = $$.create("th");

        if($$actionBar){
            $$th = $$.getChildsHasTag($$actionBar, "th")[0];
        }else{
            $$actionBar = $$.create("TR", undefined, "csc-table-action-tr");
            $$th.setAttribute("colspan", 100);
            $$actionBar.appendChild($$th);

            if(this.$$thead.childNodes.length && this.$$thead.childNodes[0].getAttribute("id")){	// table-header, table-row kullanılmışsa.
                this.$$thead.insertBefore($$actionBar, this.$$thead.children[0]);
            }else{
                var lastChildPos = this.$$thead.childNodes.length-1;
                this.$$thead.insertBefore($$actionBar, this.$$thead.childNodes[lastChildPos]);
            }
        }
        if(this.config.actionBarAlign==="left"){
            $$actionBar.classList.add("csc-table-action-tr--left");
        }
        if(this.config.showActionButtons){
            this.renderActionBarButtons($$th, bf);
        }

        if(this.config.editColName || this.config.editColVisibility){
            this.renderEditColumnTable($$th);
        }
    }
    this.checkSelectAll();
    this.checkSelectPageAll();
    if(bc.flagCA){//render edilmeden yapılmuış bir collapse all varsa durumu ele al
        this.collapseAll();
    }

    bc.$$table.onkeypress = function(e){
        bc.bf.fire("onkeypress");
    }

	  bc.$$table.onkeyup = function(e){
		    bc.bf.fire("onkeyup");
	  }

};

//Tum satırları kontrol edip hepsi seçili ise select all check'ini set eder, aksinde de check'i kaldırır
BC.prototype.checkSelectAll = function($$sall){
    var bc=this, config=bc.config, bf=bc.bf, members=bf.fmembers || bf.tmembers;
    if(bc.config.selectall && !bc.$CS$.ds && members.length){
        for(var i=0; i<members.length ;i++){
            if(!bc.isSelected(members[i].getRowId())){
                return;
            }
        }
        if(!$$sall){
            $$sall = $$.byid(config.id+"-sall");
        }
        if($$sall){
            $$sall.checked = true;
        }
    }
};
BC.prototype.checkSelectPageAll = function($$spall){

    var bc=this, config=bc.config, bf=bc.bf, members=bf.fmembers || bf.tmembers;
    var pageMember = Math.ceil(members.length/this.config.pageNum);

    var startRowid = (this.pageIndex*this.config.pageNum)-this.config.pageNum;
    var endRowid=(this.pageIndex*this.config.pageNum)-1;
    if(endRowid>members.length-1){
        endRowid=members.length-1;
    }
    var selected;
    if(!$$spall){
        $$spall = $$.byid(config.id+"-spall");
    }
    if($$spall){
        $$spall.checked = true;
    }
    for(var i=endRowid; i>=startRowid ;i--){
        if(startRowid == -1){
            break;
        }
        selected = bc.isSelected(members[i].rowid);
        if(!selected){
            if(!$$spall){
                $$spall = $$.byid(config.id+"-spall");
            }
            if($$spall){
                $$spall.checked = false;
            }
            break;
        }
    }
};
BC.prototype.sortArray = function(data){
    var me = this;
    return data.sort(function(a,b){
        if(typeof b.members[me.config.fieldNameForGroup].getValue() == "string"){
            return a.members[me.config.fieldNameForGroup].getValue().localeCompare(b.members[me.config.fieldNameForGroup].getValue());
        } else {
            if(a.members[me.config.fieldNameForGroup].getValue() < b.members[me.config.fieldNameForGroup].getvalue()) return -1;
            if(a.members[me.config.fieldNameForGroup].getValue() > b.members[me.config.fieldNameForGroup].getvalue()) return 1;
            return 0;
        }
    });
}

BC.prototype.reCalculateTotalRow = function(){
    this.addTotalRow(true);
};

BC.prototype.formatTotal = function(sum){
    if(!this.totalRow || !this.totalRow.getConfig().totalFormat){
        return SIDEMath.formatDecimal(sum.toString(), 2);
    }
    if(this.totalRow.getConfig().totalFormat == "curr1"){//Binlik(,), ondalık(.)
        sum = SIDEMath.formatDecimal(sum.toString(), 2);
        var th = sum.substring(0, sum.length-3);
        var thstr = "", decstr = sum.substring(sum.indexOf(".")+1);
        var mod = th.length%3;
        if(mod == 0){
            mod=3;
        }
        for(var i=mod; i<=th.length ; i+=3){
            thstr += th.substring(i-3,i);
            if(i != th.length){
                thstr += ",";
            }
        }
        return thstr+"."+decstr;
    }

    if(this.totalRow.getConfig().totalFormat == "curr2"){//Binlik(,), ondalık yok.
        sum = Math.round(sum);
        sum = SIDEMath.formatDecimal(sum, 0);
        var thstr = "";
        var mod = sum.length%3;
        if(mod == 0){
            mod=3;
        }
        for(var i=mod; i<=sum.length ; i+=3){
            thstr += sum.substring(i-3,i);
            if(i != sum.length){
                thstr += ",";
            }
        }
        return thstr;
    }
};

BC.prototype.addTotalRow = function(norerender){
    if(!this.$$tbody){
        return;
    }
    this.$$tbody = $$.byid(this.$$tbody.id);
    if(!this.$$tbody){
        return;
    }
    //SIDE-2878
    if(this.totalRow && ((SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.isVisible()) || (!SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.hasVisibleItem() && this.totalRow.isVisible()))){
        var id = this.totalRow.getConfig().id;
        var $$tr = $$.byid(id+"-tr");
        if($$tr){
            if(!norerender){
                var $$nextTr = $$tr.nextElementSibling;
                $$.remove($$tr);
                $$tr = $$.create("tr", {id: id+"-tr"}, ["csc-table-total-row", this.totalRow.getConfig().cssClass]);
                if($$nextTr && $$nextTr.tagName == "TR"){
                    this.$$tbody.insertBefore($$tr, $$nextTr);
                } else {
                    this.$$tbody.appendChild($$tr);
                }
            } else {
                $$tr.innerHTML = "";
            }
        } else {
            $$tr = $$.create("tr", {id: id+"-tr"}, ["csc-table-total-row", this.totalRow.getConfig().cssClass]);
            this.$$tbody.appendChild($$tr);
        }
        var label = this.totalRow.getConfig().label;
        if(label === undefined){
            label = "Toplam: ";
        }

        var hasCell = false;
        for(var memberName in this.totalRow.members){
            hasCell = true;
            break;
        }
        if(!hasCell){
            var sum = new BigDecimal("0"), sumProp = this.totalRow.getConfig().sumProp;
            if(!this.totalRow.getConfig().sumFromDS && sumProp){
                for(var i=0; i<this.bf.length(); i++){
                    var value = this.bf.getValue(i, sumProp) || "0";
                    if(typeof value != "string"){
                        value = value + "";
                    }
                    value = value.replace(/,/g,"");
                    value = new BigDecimal(value)
                    sum = sum.add(value);
                }
            }else if(this.totalRow.getConfig().sumFromDS){
                if(this.bf.$CS$ && this.bf.$CS$.ds && this.bf.$CS$.ds.sum){
                    sum = new BigDecimal(this.bf.$CS$.ds.sum.toString());
                }
            }
            var $$td = $$.create("td", {id: id,colspan: this.colCellCount});
            var $$span = $$.create("span", undefined, "csc-rospan");
            $$span.innerHTML = label + this.formatTotal(sum);
            $$td.appendChild($$span);
            $$tr.appendChild($$td);
        } else {
            var colCellCount = 0;
            if(this.config.selectable){
                colCellCount++;
                $$tr.appendChild($$.create("td"));
            }
            if(this.config.rownumbers){
                colCellCount++;
                $$tr.appendChild($$.create("td"));
            }
            for(var memberName in this.totalRow.members){
                var member = this.totalRow.members[memberName];
                var memConfig = member.getConfig();
                if(!memConfig.visible){
                    continue;
                }
                var colSpan = (memConfig.layoutConfig && memConfig.layoutConfig.colSpan) ? memConfig.layoutConfig.colSpan : undefined;
                var align = (memConfig.layoutConfig && memConfig.layoutConfig.cellAlign) ? memConfig.layoutConfig.cellAlign : undefined;
                var $$td = $$.create("td", {colspan: colSpan}, undefined, {textAlign: align});
                $$tr.appendChild($$td);
                if(member.bcRef && member.bcRef.typeName == "CSC-TABLE-TOTAL-CELL"){
                    var sum = new BigDecimal("0"), sumProp = member.getConfig().sumProp;
                    if(!member.getConfig().sumFromDS && sumProp){
                        for(var i=0; i<this.bf.length(); i++){
                            if(memConfig.sumOnlySelecteds && !this.bf.getRow(i).isSelected()){
                                continue;
                            }
                            var value = this.bf.getValue(i, sumProp) || "0";
                            if(typeof value != "string"){
                                value = value + "";
                            }
                            value = value.replace(/,/g,"");
                            value = new BigDecimal(value)
                            sum = sum.add(value);
                        }
                        member.setValue(sum);
                    }else if(member.getConfig().sumFromDS && member.getConfig().sumPropInDS){
                        if(this.bf.$CS$ && this.bf.$CS$.ds && this.bf.$CS$.ds[member.getConfig().sumPropInDS]){
                            sum = new BigDecimal(this.bf.$CS$.ds[member.getConfig().sumPropInDS].toString());
                        }
                        member.setValue(sum);
                    }
                    BFEngine.render(member, $$td);
                } else {
                    BFEngine.render(member, $$td);
                }
                if(colSpan){
                    colCellCount += colSpan;
                } else {
                    colCellCount++;
                }
            }
            if(colCellCount < this.colCellCount){
                var $$td = $$.create("td", {colspan: this.colCellCount-colCellCount});
                $$tr.appendChild($$td);
            }
        }
    }

};

BC.prototype.putMessage = function(message){
    message = message || this.config.nodata;// || TABLE_NO_DATA_TEXT; burada uygulamaya özel ayar verilebilmeli, yeni side yazıldığı için şimdilik açıklama satırı yaptım #hakand
    this.nodatamsg = message;
    if(!this.$$tbody || this.bf.tmembers != 0 || this.nodatamsg === undefined){
        return;
    }
    var $$msgtr = $$.getChildHasClass(this.$$tbody, "csc-table-msg-tr");
    if(!$$msgtr){
        $$msgtr = $$.create("tr", undefined, "csc-table-msg-tr");
        var $$td = $$.create("td", {colspan: this.colCellCount});

        if(this.$$tbody.firstChild) {
            this.$$tbody.insertBefore($$msgtr, this.$$tbody.firstChild);
        } else {
            this.$$tbody.appendChild($$msgtr);
        }

        $$msgtr.appendChild($$td);
    }
    var $$td = $$.child($$msgtr, "TD");
    $$td.innerHTML = message;
};

BC.prototype.setNoDataText = function(text){
    this.config.nodata = text;
    var $$msgtr = $$.getChildHasClass(this.$$tbody, "csc-table-msg-tr");
    var $$msgtd = $$.child($$msgtr, "TD");
    if($$msgtd){
        $$msgtd.innerHTML = text;
    }
};

BC.prototype.rmMessage = function(){
    this.nodatamsg = null;
};

BC.prototype.excelExport = function(){
    var data, cmd, bc=this, bf=bc.bf, config=bc.config, exportExcelFromDs =false;
    if (bf.$CS$.ds) {// datasource exist?
        cmd = "EXPORT_EXCEL_FROM_DS";
        bf.$CS$.ds.checkSpecialChars = config.checkSpecialChars;
        data = bf.$CS$.ds;
        exportExcelFromDs = true;
    } else {
        if(config.exportInvisibles){
            bf.$CS$.exportInvisibleColumns = true;
        }
        cmd = "EXPORT_EXCEL";
        data = bf.getText();
    }

    if(getSideDefaults("support-service-call-extra-params", this.bf.getModuleName()) && window.callParams && data){
        if(!data.params){
            data.params = {};
        }
        for(var pname in window.callParams){
            data.params[pname] = window.callParams[pname];
        }
    }

    var module = bf.getModuleName();
    var excelFileFormat = config.gridFileType;

    var url = SideModuleManager.getAppUrl(module, this.config.excelExportPath || "side-support-gridexport");
    if(getSideDefaults("excel-export-add-module-to-url")){
        url = url +"/"+module;
    }

    SIDEUtil.downloadFileWithPost({
        cmd: cmd,
        s: "ş",//türkçe karakter problemi için
        jp: {
            metadata : this.bf.getMetaData(null, {exportInvisibleColumns: config.exportInvisibles}, exportExcelFromDs),
            ds: data,
            filename: this.efl,
            checkSpecialChars : config.checkSpecialChars || false,
            excelFileFormat:excelFileFormat,
            sideLang: window.sideLang
        }
    }, {
        url: url,
        module: module
    });
};

BC.prototype.setExcelExportPath = function(path){
    this.config.excelExportPath = path;
};

BC.prototype.addFooterRow = function(){
    if(!this.$$tbody || this.config.noFooter === true){
        return;
    }
    var bc = this, bf = this.bf;
    var members = this.bf.fmembers || this.bf.tmembers;
    var page = this.pageIndex, total = members.length;
    if (this.bf.$CS$.ds) {
        page = this.bf.$CS$.ds.page;
        total = this.bf.$CS$.ds.rowcount;
    }
    $$.remove(this.config.id+"-pr");//zaten varsa kaldır
    var $$tr = $$.create("tr", {id: this.config.id+"-pr"}, ["csc-table-paging-row"]);
    this.$$tbody.appendChild($$tr);

    var $$td = $$.create("td", {id: this.config.id+"-pr-td", colspan: this.colCellCount});

    var $$spanPagingInfo = $$.create("span", undefined, "csc-table-paging-info");

    if(total != 0 && this.config.noRowSum !== true){
        if(this.config.page){
            $$spanPagingInfo.innerHTML = (((page-1)*this.config.pageNum)+1)+ " - " +(total<((page)*this.config.pageNum) ? total: ((page)*this.config.pageNum))+ SideMLManager.get("common.pagingFooter") + total;
        } else {
            $$spanPagingInfo.innerHTML = SideMLManager.get("common.total") + "&nbsp" + total +"&nbsp" + SideMLManager.get("common.records");
        }
    }
    if (this.config.page && this.config.showAllBtn){
        var $$divExport = $$.create("DIV", undefined, "csc-table-showallbtn");
        var $$spanBtn = $$.create("SPAN");
        $$divExport.appendChild($$spanBtn);
        $$divExport.innerHTML = bc.showAll ? $$divExport.innerHTML + SideMLManager.get("common.showPaging") : $$divExport.innerHTML + SideMLManager.get("common.showAll");
        $$divExport.setAttribute("title", bc.showAll ? SideMLManager.get("common.showPaging")  : SideMLManager.get("common.showAll"));
        $$td.appendChild($$divExport);
        $$divExport.onclick = function(){
            bc.saveScrollPosition();
            bc.showAll = !bc.showAll;
            var pageNum = bc.config.pageNum;
            if(bc.showAll){
                bc.oldPageNum = pageNum;
                pageNum = 100000;
            } else {
                pageNum = bc.oldPageNum;
            }
            bc.config.pageNum = pageNum;
            bc.pageIndex = 1;
            bc.bf.rerender();
            bc.loadScrollPosition();
        };
    }
    if (this.config.gridExport) {
        var $$divExport = $$.create("DIV", undefined, "csc-table-exportbtn");
        var $$spanBtn = $$.create("SPAN");
        $$divExport.appendChild($$spanBtn);
        $$divExport.innerHTML = $$divExport.innerHTML + SideMLManager.get("common.exportExcel");
        $$td.appendChild($$divExport);
        var exportThis = this;
        $$divExport.onclick = function(){
			/*
			 * Excel Export ve Special Export seçili ise specialEvent designer kodunu ele alır. Sadece Excel Export "Yes" ile seçilmiş ise
			 * default olarak Side'nin excel export işlemi gerçekleşir.
			 */
            if(exportThis.config.specialExport){
                bc.bf.fire("specialEvent");
            }else{
                bc.excelExport();
            }
        };
    }

    if (this.config.gridImport) {
        var $$divImport = $$.create("DIV", undefined, "csc-table-importbtn");
        var $$spanBtn = $$.create("SPAN");
        $$divImport.appendChild($$spanBtn);
        $$divImport.innerHTML = $$divImport.innerHTML + SideMLManager.get("common.importExcel");
        $$td.appendChild($$divImport);

        $$divImport.onclick = function() {
            var $$div = $$.create("DIV", {"id":"excel_import_popup"});
            var $$buton = $$.create("INPUT", {type: "button",id: "excel_import_doneButton", value: SideMLManager.get("common.addToTable")});
            var $$discription = $$.create("SPAN", undefined, "csc-rospan", undefined, $$div);
            $$discription.innerHTML = SideMLManager.get("common.importExcelWarning");
            var $$textarea = $$.create("TEXTAREA", {"id":"excel_import_contentTextarea"}, undefined, {"width":"100%", "height":"405px"}, $$div);
            $$buton.onclick = function() {
                excelImportPopup.close();
                var rows = $$textarea.value.split("\n");
                if(rows[rows.length-1] == "")
                    rows.pop();

                var memberNames = [];
                for(var mname in bc.bf.members) {
                    if (!window.BFEngine.isNonBusiness(bc.bf.members[mname])) {
                        memberNames.push(mname);
                    }
                    if (bc.bf.members[mname].bcRef.typeName === "CSC-TABLE-ROW" || bc.bf.members[mname].bcRef.typeName === "CSC-TABLE-TOTAL-ROW") {
                        for (var i = 0; i < Object.keys(bc.bf.members[mname].members).length; i++) {
                            if (!bc.bf.members[mname][Object.keys(bc.bf.members[mname].members)[i]].isDisabled() || !bc.bf.members[mname][Object.keys(bc.bf.members[mname].members)[i]].isVisible()) {
                                memberNames = memberNames.concat(Object.keys(bc.bf.members[mname].members)[i]);
                            }
                        }
                    }
                }

                var newRows = [];
                for(var i=0; i<rows.length;i++){
                    var newRow = {};
                    var cols = rows[i].split("\t");
                    if(bc.onexcelimport){
                        cols = bc.onexcelimport(cols, rows[i]);
                        if(!cols){
                            continue;
                        }
                    }
                    for(var j=0; j<memberNames.length; j++){
                        if(cols[j]){
                            newRow[memberNames[j]] = cols[j];
                        }
                    }
                    newRows.push(newRow);
                }
                bc.bf.add(newRows);
                bc.bf.fire("onExcelImport-complated");
            };

            $$div.appendChild($$buton);
            var excelImportPopup = new CSSimplePopup($$div, {dontRemove: false, title: SideMLManager.get("common.importExcel"), width: 750, height: 450, closeOnEscape:true});

            excelImportPopup.open();
        }
    }

    $$td.appendChild($$spanPagingInfo);
    $$tr.appendChild($$td);

    if(!this.config.page){
        return;
    }
    var $$div = $$.create("div", {id: this.config.id+"-div"}, "csc-tale-paging-div");
    $$td.appendChild($$div);

    var lastPage = Math.ceil(total / this.config.pageNum);
    var $$spanToplamSayfa = $$.create("span");
    if (this.bf.$CS$.ds) {
        $$spanToplamSayfa.innerHTML = " /" + (Math.ceil(total / this.config.pageNum) || 1) + " ";
    } else {
        $$spanToplamSayfa.innerHTML = " /" + (Math.ceil(members.length / this.config.pageNum) || 1) + " ";
    }
    var bc = this;


    var $$spanFirst = $$.create("span", undefined, "csc-table-paging-btn csc-table-seek-first");
    var $$spanPrev = $$.create("span", undefined, "csc-table-paging-btn csc-table-seek-prev");
    if(page == 1){
        $$.addClass($$spanFirst, "csc-table-paging-btn-disabled");
        $$.addClass($$spanPrev, "csc-table-paging-btn-disabled");
    } else {
        $$spanPrev.onclick = function(){
            bc.saveScrollPosition();
            bc.bf.fire("onpagechange", page-1);
            if (bc.bf.$CS$.ds) {
                if(bc.onpaging){
                    bc.bf.fire("onpaging", page-1);
                    return;
                }
                bc.bf.gotoPage(page-1);
            } else {
                bc.pageIndex--;
                bc.bf.fire("onpaging", page-1);
                bc.bf.rerender();
            }
            bc.loadScrollPosition();
        };
        $$spanFirst.onclick = function(){
            bc.saveScrollPosition();
            bc.bf.fire("onpagechange", 1);
            if (bc.bf.$CS$.ds) {
                if(bc.onpaging){
                    bc.bf.fire("onpaging", 1);
                    return;
                }
                bc.bf.gotoPage(1);
            } else {
                bc.pageIndex = 1;
                bc.bf.fire("onpaging", 1);
                bc.bf.rerender();
            }
            bc.loadScrollPosition();
        };
    }
    var $$spanSayfa = $$.create("span");
    $$spanSayfa.innerHTML = SideMLManager.get("common.page");
    var $$input = $$.create("span", {type: "text", contenteditable:true}, "csc-table-paging-text");
    $$input.innerHTML = page;
    $$input.onkeydown = function(event){
        if(event.keyCode == 13){
            var value = parseInt(this.innerHTML);
            if(value >= 1 && value <= lastPage){
                bc.bf.fire("onpagechange", value);
                if (bc.bf.$CS$.ds) {
                    if(bc.onpaging){
                        bc.bf.fire("onpaging", value);
                        return;
                    }
                    bc.bf.gotoPage(value);
                } else {
                    bc.pageIndex = value;
                    bc.bf.fire("onpaging", value);
                    bc.bf.rerender();
                }
            } else {
                this.innerHTML = page;
            }
            return false;
        }
        //37 ->Right, 39 ->Left, 46-> Del, 8-> Backspace
        if(event.keyCode != 37 && event.keyCode != 39 && event.keyCode != 46 && event.keyCode != 8 && (event.keyCode < 48 || event.keyCode > 58) && (event.keyCode < 96 || event.keyCode > 106)){
            return false;
        }
        return true;
    };
    $$input.onpaste = function(){
        return false;
    };

    $$div.appendChild($$spanFirst);


    var $$spanNext = $$.create("span", undefined, "csc-table-paging-btn csc-table-seek-next");
    var $$spanEnd = $$.create("span", undefined, "csc-table-paging-btn csc-table-seek-last ");
    $$div.appendChild($$spanFirst);
    $$div.appendChild($$spanPrev);
    $$div.appendChild($$spanSayfa);
    $$div.appendChild($$input);
    $$div.appendChild($$spanToplamSayfa);
    $$div.appendChild($$spanNext);
    $$div.appendChild($$spanEnd);

    if(page >= lastPage){
        $$.addClass($$spanNext, "csc-table-paging-btn-disabled");
        $$.addClass($$spanEnd, "csc-table-paging-btn-disabled");
    } else {
        $$spanNext.onclick = function(){
            bc.saveScrollPosition();
            bc.bf.fire("onpagechange", page+1);
            if (bc.bf.$CS$.ds) {
                if(bc.onpaging){
                    bc.bf.fire("onpaging", page+1);
                    return;
                }
                bc.bf.gotoPage(page+1);
            } else {
                bc.pageIndex++;
                bc.bf.fire("onpaging", page+1);
                bc.bf.rerender();
            }
            bc.loadScrollPosition();
        };
        $$spanEnd.onclick = function(){
            bc.saveScrollPosition();
            bc.bf.fire("onpagechange", lastPage);
            if (bc.bf.$CS$.ds) {
                if(bc.onpaging){
                    bc.bf.fire("onpaging", lastPage);
                    return;
                }
                bc.bf.gotoPage(lastPage);
            } else {
                bc.pageIndex = lastPage;
                bc.bf.fire("onpaging", lastPage);
                bc.bf.rerender();
            }
            bc.loadScrollPosition();
        };
    }

    if(this.config.editPageNum){
        var $$editPageRowCountText = $$.create("SPAN", undefined, undefined, {marginLeft: "6px"});
        var $$editPageRowCountBox = $$.create("SPAN", {contenteditable:"true", type:"text"}, "csc-table-paging-text");

        $$editPageRowCountBox.onkeydown = function(event){
            if(event.keyCode == 13){
                var value = parseInt(this.innerHTML);
                if(value >= 0){
                    bc.setPageRowCount(value);
                } else {
                    this.innerHTML = bc.getPageRowCount();
                }
                bc.bf.fire("onpagechange", 1);
                bc.bf.fire("pageRowCountChanged", value);
                return false;
            }
        };

        $$editPageRowCountBox.innerHTML = this.getPageRowCount();
        $$editPageRowCountText.innerHTML = SideMLManager.get("common.onEachPage");
        $$spanPagingInfo.appendChild($$editPageRowCountText);
        $$spanPagingInfo.appendChild($$editPageRowCountBox);
    }
};

BC.prototype.getCurrentPage = function(){
    if (this.bf.$CS$.ds) {
        return this.bf.$CS$.ds.page;
    }
    return this.pageIndex || 1;
};

BC.prototype.gotoPage = function(page){
    this.pageIndex = page || 1;
    this.bf.rerender();
};

BC.prototype.setPageRowCount = function(rowCount){
    this.config.pageNum = rowCount || 10;
    this.bf.gotoPage(1);
};

BC.prototype.getPageRowCount = function(){
    return this.config.pageNum;
};

//this.config.treeColumn doluysa table -> tree-table'dır
BC.prototype.addRow = function(rows) {
    if(this.bf.fmembers){//filter varken yeni row eklenirse tekrar filter yapsın #hakand
        this.makeFilter();
    }else{
        this.saveScrollPosition();
        this.reRender();
        this.loadScrollPosition();
    }
};

BC.prototype.getCell = function(row, mname){
    if(!row){
        return;
    }
    if(typeof row.get == "function"){
        return row.get(mname);
    }
    return row[mname];
};

BC.prototype.getCellValue = function(row, mname){
    if(!row){
        return;
    }
    if(typeof row.get == "function"){
        var mem = row.get(mname);
        if(mem){
            return mem.getValue();
        }
    } else {
        return row[mname];
    }
};

//this.config.treeColumn doluysa table -> tree-table'dır
BC.prototype.renderRows = function(start, end) {
    var rows = this.bf.bmembers || this.bf.fmembers || this.bf.tmembers;

    if(this.config.fieldNameForGroup){
        this.sortArray(rows);
        groupList = [];
        prevGroup = "";
    }


    if(!this.$$tbody){
        return;
    }
    this.rowCounter = start;
    var bf = this.bf;
    var bc = this;
    var config = bc.config;
    if(this.rowsMetaData.length > 0){
        var rowSpanInfo;
        var lastIdentifier = null;
        for(var k=start; k<rows.length && k<end ;k++){
            var row = rows[k];
            if(this.config.rowApp == "zebra"){
                var rowClass = k % 2 == 0 ? "csc-table-even" : "csc-table-odd";
            }
            var tds = [];
            for(var i=0; i<this.rowsMetaData.length ;i++){
                var rowMeta = this.rowsMetaData[i];
                if(!rowMeta.identifier){
                    continue;
                }
                if((typeof row.get == "function" && row.get(rowMeta.identifier)) || (typeof row.get != "function" && row[rowMeta.identifier] !== undefined)){
                    if(lastIdentifier != rowMeta.identifier){
                        lastIdentifier = rowMeta.identifier;
                        rowSpanInfo = {};
                    }
                    var $$tr = $$.create("tr", {rel: ""+(typeof row.getIndice == "function" ? row.getIndice():k), rowid: ""+row.rowid}, rowClass);

                    if(!row.isVisible()){
                        $$tr.style.display = "none";
                    }
                    if(row.clazz){
                        $$.addClass($$tr, row.clazz);
                    }
                    $$tr.onclick = function(e){
                        var rowid = this.getAttribute("rowid");
                        var rows = bf.getRows(this.getAttribute("rel"));
                        if(!rows || rows.length == 0){
                            return;
                        }
                        if(config.selectOnClick && !e.csselectFlag && !bc.bf.isDisabled()){
                            bc.selectRow(rowid, !bc.isSelected(rowid), true, true);
                        }
                        bf.fire("rowClicked", rows[0], e.csselectFlag || false);
                    };
                    $$tr.ondblclick = function(e){
                        e.preventDefault();
                        SIDENavigator.setEvent(e);
                        var rowid = this.getAttribute("rowid");
                        bf.fire("rowDoubleClicked", bf.getRowByRowId(rowid));
                    };
                    $$tr.oncontextmenu = function(e){
                        var rowid = this.getAttribute("rowid");
                        SIDENavigator.setEvent(e);
                        bf.fire("rowRightClicked", bf.getRowByRowId(rowid));
                        bc.rightClickCallback(rowid, e);
                    };
                    this.$$tbody.appendChild($$tr);
                    if(this.config.rownumbers || this.rowNumbers){
                        if(!this.rowCounter){
                            this.rowCounter = 0;
                        }
                        var $$td = $$.create("td");
                        tds.push($$td);
                        $$.addClass($$td, "csc-table-rowcount");
                        if(rowMeta.rownumbers){
                            this.rowCounter++;
                            var page = 1;
                            if(this.bf.$CS$.ds){
                                page = this.bf.$CS$.ds.page;
                            }
                            $$td.innerHTML = (page-1)*(this.config.pageNum || 1) + this.rowCounter;

                        }
                        $$tr.appendChild($$td);
                    }
                    if(this.config.selectable || this.rowSelectable){
                        var $$td = $$.create("td");
                        tds.push($$td);
                        $$.addClass($$td, "csc-table-select");
                        if(rowMeta.selectable){
                            var $$check = $$.create("input", {type: "checkbox"});
                            if(isInIt(this.selecteds, row.rowid)){
                                $$check.checked = true;
                                $$.addClass($$tr, "csc-table-selected-tr");
                            }
                            if(row.selectDisabled || this.config.disabled || bc.bf.isDisabled()){
                                $$check.disabled = true;
                            }

                            $$check.onclick = function(e){
                                //e.stopPropagation();//row click'i engellemek için @hby kaldirilmasini istedi
                                var rows = bf.getRows(parseInt(this.parentNode.parentNode.getAttribute("rel"), 10));
                                if(!rows || rows.length == 0){
                                    return;
                                }
                                e.csselectFlag = true;
                                bc.selectRow(rows[0].rowid, this.checked, false, true);
                            };

                            if(bc.config.disabled || bc.bf.isDisabled()){
                                $$check.disabled = true;
                            }

                            $$td.appendChild($$check);

                        }
                        $$tr.appendChild($$td);
                    }
                    for(var c=0; c<rowMeta.columns.length ;c++){
                        var $$td = $$.create("td");
                        tds.push($$td);
                        var memName = rowMeta.columns[c];
                        if(!memName){
                            continue;
                        }

                        var member = typeof row.get == "function" ? row.get(memName) : bf[memName];
                        var memConfig = member.getConfig();
                        if(memConfig.layoutConfig){
                            if(memConfig.layoutConfig.colSpan){
                                $$td.setAttribute("colSpan", memConfig.layoutConfig.colSpan);
                            }
                            if(memConfig.layoutConfig.cellAlign){
                                $$td.style.textAlign = memConfig.layoutConfig.cellAlign;
                            }
                            if(memConfig.layoutConfig.vertAlign){
                                $$.addClass($$td, "csc-table-va-"+memConfig.layoutConfig.vertAlign);
                            }
                        }
                        if(memConfig.layoutConfig && memConfig.layoutConfig.rowSpan){
                            var spanMemName = memConfig.layoutConfig.rowSpanProp || memName;
                            if(!rowSpanInfo[memName]){
                                var memValue = this.getCellValue(row, spanMemName);
                                var counter = 0;
                                for(var x=k+1; memValue !== undefined && x<rows.length && x<end ;x++){
                                    var nextRowMember = this.getCell(rows[x], spanMemName);
                                    if(!nextRowMember){
                                        break;
                                    }
                                    var nextValue = this.getCellValue(rows[x], spanMemName);
                                    if(nextValue === undefined || nextValue !== memValue){
                                        break;
                                    }
                                    counter++;
                                }
                                $$td.setAttribute("rowspan", counter+1);
                                rowSpanInfo[memName] = counter;
                                $$tr.appendChild($$td);
                                if(this.config.bulk){
                                    $$td.innerHTML = member.getText();
                                } else {
                                    BFEngine.render(member, $$td);
                                }
                            } else {
                                rowSpanInfo[memName] = rowSpanInfo[memName]-1;
                            }
                        } else {
                            $$tr.appendChild($$td);
                            if(this.config.bulk){
                                if(row.get == "function"){
                                    $$td.innerHTML = member.getText();
                                } else {
                                    $$td.innerHTML = this.getCellValue(row, memName);
                                }
                            } else {
                                BFEngine.render(member, $$td);
                            }
                        }


                        if(bc.config.draggable){
                            var dragstartCallback = function(memName, rowid){
                                return function(event){
                                    console.log("table on drag start, member name:" + memName+", rowid:"+rowid);
                                    event.stopPropagation();
                                    bc.bf.fire("ondragstart", memName, rowid);
                                };
                            }(memName, row.rowid);
                            $$td.setAttribute("draggable", "true");
                            $$.bindEvent($$td, "dragstart", dragstartCallback);
                        }

                    }
                    break;
                }
            }
            var css = this.rowStyles[row.rowid];
            if(css){
                for(var c=0; c<tds.length ;c++){
                    $$.css(tds[c], css);
                }
            }
        }
    } else {
        for(var i=start; i<rows.length && i<end ;i++){
            var row = rows[i];
            if(this.config.rowApp == "zebra"){
                var rowClass = i % 2 == 0 ? "csc-table-even" : "csc-table-odd";
            }
            if(this.config.treeColumn){
                var $$tr = $$.create("tr", {rel: ""+row.getIndice(), rowid: row.rowid, relp: row.parentid, relisleaf: "y"}, ["csc-table-leaf-tr", rowClass]);
            } else {
                var $$tr = $$.create("tr", {rel: ""+row.getIndice(), rowid: row.rowid}, [rowClass]);

                if(this.config.fieldNameForGroup){

                    if(this.config.groupCollapse){ $$.css($$tr, "display", "none"); }

                    var group = row.members[this.config.fieldNameForGroup].getValue();
                    $$.attr($$tr, "group", group);

                    if(prevGroup !== group){
                        groupList[groupList.length] = prevGroup = group;

                        var $$trGroupTitle = $$.create("TR", {"groupRowId":groupList.length}, "csc-table-group-title-tr");
                        var $$tdGroupTitle = $$.create("TD", {"grp": group, "colspan": this.colCellCount, toggle:"false"});
                        if(this.config.groupCollapse){
                            $$.html($$tdGroupTitle, "[ + ] "+group)
                        }else {
                            $$.html($$tdGroupTitle, "[ - ] "+group);
                            $$tdGroupTitle.setAttribute("toggle", "true");
                        }

                        var me = this;
                        $$tdGroupTitle.onclick = function(e){
                            if(this.getAttribute("toggle") === "false"){
                                this.innerHTML = "[ - ] "+this.getAttribute("grp");

                                var hiddenRows = $$.getChildsHasAttr(me.$$tbody, "group", this.getAttribute("grp"));
                                for(var p=0; p<hiddenRows.length; p++){
                                    $$.attr(hiddenRows[p], "style", "");
                                }

                                this.setAttribute("toggle", "true");
                            }else{
                                this.innerHTML = "[ + ] "+this.getAttribute("grp");

                                var hiddenRows = $$.getChildsHasAttr(me.$$tbody, "group", this.getAttribute("grp"));
                                for(var p=0; p<hiddenRows.length; p++){
                                    $$.css(hiddenRows[p], "display", "none");
                                }

                                this.setAttribute("toggle", "false");
                            }
                        }

                        $$trGroupTitle.appendChild($$tdGroupTitle);
                        this.$$tbody.appendChild($$trGroupTitle);
                    }
                }
            }
            if(!row.isVisible()){
                $$tr.style.display = "none";
            }
            if(row.clazz){
                $$.addClass($$tr, row.clazz);
            }
            $$tr.onclick = function(e){
                var rowid = this.getAttribute("rowid");
                var rows = bf.getRows(parseInt(this.getAttribute("rel"), 10));
                if(!rows || rows.length == 0){
                    return;
                }
                if(config.selectOnClick && !e.csselectFlag && !bc.bf.isDisabled()){
                    bc.selectRow(rowid, !bc.isSelected(rowid), true, true);
                }
                bf.fire("rowClicked", rows[0], e.csselectFlag || false);
            };
            $$tr.ondblclick = function(e){
                e.preventDefault();
                SIDENavigator.setEvent(e);
                var rowid = this.getAttribute("rowid");
                bf.fire("rowDoubleClicked", bf.getRowByRowId(rowid));
            };
            $$tr.oncontextmenu = function(e){
                var rowid = this.getAttribute("rowid");
                SIDENavigator.setEvent(e);
                bf.fire("rowRightClicked", bf.getRowByRowId(rowid));
                bc.rightClickCallback(rowid, e);
            };
            this.$$tbody.appendChild($$tr);
            var tds = [];
            //Add selected class to row if it it in selecteds
            if(isInIt(this.selecteds, row.rowid)){
                $$.addClass($$tr, "csc-table-selected-tr");
            }
            for(var c=0; c<this.colmodel.length ;c++){
                var $$td = $$.create("td");
                if(this.colmodel[c].rownumbers){
                    if(!this.rowCounter){
                        this.rowCounter = 0;
                    }
                    $$.addClass($$td, "csc-table-rowcount");
                    this.rowCounter++;
                    var page = 1;
                    if(this.bf.$CS$.ds){
                        page = this.bf.$CS$.ds.page;
                    }
                    $$td.innerHTML = (page-1)*(this.config.pageNum || 1) + this.rowCounter;
                }
                if(this.colmodel[c].select) {
                    $$.addClass($$td, "csc-table-select");
                    var $$check = $$.create("input", {type: "checkbox"});
                    if(isInIt(this.selecteds, row.rowid)){
                        $$check.checked = true;
                    }
                    if(row.selectDisabled || this.config.disabled || bc.bf.isDisabled()){
                        $$check.disabled = true;
                    }
                    $$check.onclick = function(e){
                        //e.stopPropagation();//row click'i engellemek için @hby kaldirilmasini istedi
                        var rows = bf.getRows(parseInt(this.parentNode.parentNode.getAttribute("rel"), 10), true);
                        if(!rows || rows.length == 0){
                            return;
                        }
                        e.csselectFlag = true;
                        bc.selectRow(rows[0].rowid, this.checked, false, true);
                    };
                    $$td.appendChild($$check);
                }
                if(this.colmodel[c].align){
                    $$td.style.textAlign = this.colmodel[c].align;
                }

                $$tr.appendChild($$td);
                tds.push($$td);
            }
            for(var c=0; c<this.colmodel.length ;c++){
                if(this.colmodel[c].select || this.colmodel[c].rownumbers) {
                    continue;
                }
                var $$td = tds[c];
                var member = row.get(this.colmodel[c].name);
                if(this.config.bulk){
                    $$td.innerHTML = member.getText();
                } else {
                    BFEngine.render(member, $$td);
                }

                if(this.colmodel[c].name == this.config.treeColumn){
                    $$.attr($$td, "tree-column", "");
                }
                var memConfig = member.getConfig();
                if(memConfig.layoutConfig && memConfig.layoutConfig.vertAlign){
                    $$.addClass($$td, "csc-table-va-"+memConfig.layoutConfig.vertAlign);
                }

                if(bc.config.draggable){
                    var dragstartCallback = function(memName, rowid){
                        return function(event){
                            console.log("table on drag start, member name:" + memName+", rowid:"+rowid);
                            event.stopPropagation();
                            bc.bf.fire("ondragstart", memName, rowid);
                        };
                    }(this.colmodel[c].name, row.rowid);
                    $$td.setAttribute("draggable", "true");
                    $$.bindEvent($$td, "dragstart", dragstartCallback);
                }
            }
            var css = this.rowStyles[row.rowid];
            if(css){
                for(var c=0; c<this.colmodel.length ;c++){
                    $$.css(tds[c], css);
                }
            }
        }

        var $$trs = $$.getChildsHasTag(this.$$tbody, "tr");
        var childs = [];

        for(var i=0; i<$$trs.length; i++){
            if($$trs[i].getAttribute("relp")){
                childs.push($$trs[i]);
                $$trs[i].parentNode.removeChild($$trs[i]);
                $$trs.splice(i,1);
                i--;
            }
        }
        for(var i=0; i<$$trs.length; i++){
            for(var j=childs.length-1; j>-1; j--){
                if($$trs[i].getAttribute("rowid") === childs[j].getAttribute("relp")){
                    $$trs.splice(i+1,0,childs[j]);
                    $$trs[i].parentNode.insertBefore(childs[j], $$trs[i].nextSibling);
                    childs.splice(j,1);
                    i = -1;
                    break;
                }
            }
        }

        for(var i=0; i<$$trs.length; i++){
            var $$tds = $$trs[i].children;
            for(var j=0; j<$$tds.length; j++){
                if( $$tds[j].hasAttribute("tree-column") ){
                    var $$td = $$tds[j];
                    $$.addClass($$td, "csc-table-tree-td");
                    var deep = this.findNodeDeep($$trs[i].getAttribute("rowid"));
                    $$td.style.paddingLeft = (deep+1)*14 +"px";
                    $$td.style.backgroundPosition = deep*14 +"px center";
                    if(deep > 0){
                        this.setNonLeaf($$trs[i].getAttribute("relp"));
                    }
                }
            }
        }
    }
    if(this.config.treeColumn){
        this.rerenderCollapes();
    }
};

BC.prototype.setVisibleRow = function(rowid, flag){
    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
    if($$tr){
        $$tr.style.display = flag ? "":"none";
    }
};

BC.prototype.styleRow = function(rowid, style) {
    if(!style || typeof style != "object"){
        return;
    }
    var css = this.rowStyles[rowid];
    if(!css){
        css = {};
        this.rowStyles[rowid] = css;
    }
    for(var s in style){
        css[s] = style[s];
    }

    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
    var $$tds = $$.childs($$tr, "TD");
    for(var i=0; i<$$tds.length ;i++){
        $$.css($$tds[i], style);
    }
};


BC.prototype.highlightRow = function(rowid, color) {
    color = color || "#C3D3EA";
    this.styleRow(rowid, {backgroundColor : color });
};

//class bilgileri row üzerinde tutulduğu için ayrıca bu bc üzerinde saklamaya gerek yok
BC.prototype.addClass = function(rowid, classes) {
    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
    if($$tr){
        $$.addClass($$tr, classes);
    }
};

BC.prototype.rmClass = function(rowid, classes) {
    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
    if($$tr){
        $$.rmClass($$tr, classes);
    }
};

BC.prototype.expand = function(rowid) {
    var bc=this;
    bc.flagCA = false;
    delete bc.collapseMap[rowid];
    var $$tr = $$.getChildHasAttr(bc.$$tbody, "rowid", rowid);
    if($$tr){
        var collapsed = $$tr.getAttribute("relcollapsed");
        if(!collapsed){
            return;
        }
        $$tr.removeAttribute("relcollapsed");
        $$.rmClass($$tr, "csc-table-collapsed-tr");
        $$.addClass($$tr, "csc-table-expanded-tr");

        var eparentlist = [rowid];
        var $$nexttr = $$.next($$tr);
        while($$nexttr){
            var parentid = $$nexttr.getAttribute("relp");
            if(isInIt(eparentlist, parentid)){
                $$nexttr.style.display = "";
                var iscollapsed = $$nexttr.getAttribute("relcollapsed");
                if(!iscollapsed){
                    var id = $$nexttr.getAttribute("rowid");
                    if(!isInIt(eparentlist, id)){
                        eparentlist.push(id);
                    }
                }
            }
            $$nexttr = $$.next($$nexttr);
        }
        this.bf.fire("onnodeexpanded", rowid);
    }
};

BC.prototype.collapse = function(rowid) {
    this.collapseMap[rowid] = true;
    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
    if($$tr){
        var collapsed = $$tr.getAttribute("relcollapsed");
        if(collapsed){
            return;
        }
        var isleaf = $$tr.getAttribute("relisleaf");
        if(isleaf == "y"){
            return;
        }
        $$tr.setAttribute("relcollapsed", "y");
        $$.rmClass($$tr, "csc-table-expanded-tr");
        $$.addClass($$tr, "csc-table-collapsed-tr");

        var parentlist = [rowid];
        var $$nexttr = $$.next($$tr);
        while($$nexttr){
            var parentid = $$nexttr.getAttribute("relp");
            if(isInIt(parentlist, parentid)){
                $$nexttr.style.display = "none";
                var id = $$nexttr.getAttribute("rowid");
                if(!isInIt(parentlist, id)){
                    parentlist.push(id);
                }
            }
            $$nexttr = $$.next($$nexttr);
        }
    }
};

BC.prototype.collapseAll = function() {
    var bc=this;
    bc.flagCA = true;
    if(!bc.$$tbody){
        return;
    }
    var roots = [];
    var $$trs = $$.childs(bc.$$tbody, "tr");
    for(var i=0; i<$$trs.length ;i++){
        var $$nexttr = $$trs[i];
        if($$nexttr.getAttribute("relisleaf") && $$nexttr.getAttribute("relisleaf")==="n"){
            roots.push($$nexttr.getAttribute("rowid"));
        }
    }
    for(var i=0; i<roots.length ;i++){
        bc.collapse(roots[i]);
    }
};

BC.prototype.expandAll = function() {
    var roots = [];
    var $$trs = $$.childs(this.$$tbody, "tr");
    for(var i=0; i<$$trs.length ;i++){
        var $$nexttr = $$trs[i];
        var collapsed = $$nexttr.getAttribute("relcollapsed");
        if(collapsed){
            roots.push($$nexttr.getAttribute("rowid"));
        }
    }
    for(var i=0; i<roots.length ;i++){
        this.expand(roots[i]);
    }
};

BC.prototype.rerenderCollapes = function() {
    for(var rowid in this.collapseMap){
        var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", rowid);
        if($$tr){
            var collapsed = $$tr.getAttribute("relcollapsed");
            if(collapsed){
                continue;
            }
            var isleaf = $$tr.getAttribute("relisleaf");
            if(isleaf == "y"){
                continue;
            }
            $$tr.setAttribute("relcollapsed", "y");
            $$.rmClass($$tr, "csc-table-expanded-tr");
            $$.addClass($$tr, "csc-table-collapsed-tr");

            var parentlist = [rowid];
            var $$nexttr = $$.next($$tr);
            while($$nexttr){
                var parentid = $$nexttr.getAttribute("relp");
                if(isInIt(parentlist, parentid)){
                    $$nexttr.style.display = "none";
                    var id = $$nexttr.getAttribute("rowid");
                    if(!isInIt(parentlist, id)){
                        parentlist.push(id);
                    }
                }
                $$nexttr = $$.next($$nexttr);
            }
        }
    }
};

BC.prototype.findNodeDeep = function(id) {
    var deep = 0;
    while(id){
        var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", id);
        if($$tr) {
            id = $$tr.getAttribute("relp");
            deep++;
        } else {
            id = null;
        }
    }
    return deep;
};

//Default leaf olan düğümü parent olarak değiştirir
BC.prototype.setNonLeaf = function(id) {
    var $$tr = $$.getChildHasAttr(this.$$tbody, "rowid", id);
    if($$tr){
        var isleaf = $$tr.getAttribute("relisleaf");
        if(isleaf == "y"){
            $$tr.setAttribute("relisleaf","n");
        } else {
            return;
        }
        $$.addClass($$tr, "csc-table-expanded-tr");

        var bc = this;
        var $$td = $$.getChildHasClass($$tr, "csc-table-tree-td");
        if($$td){
            //set expand-collapse events
            $$td.onclick = function(){
                var $$tr = this.parentNode;
                if($$tr.getAttribute("relcollapsed")){
                    bc.expand($$tr.getAttribute("rowid"));
                } else {
                    bc.collapse($$tr.getAttribute("rowid"));
                }
            };
        }
    }
};

BC.prototype.clear = function(clearDataSource) {
    delete this.rowCounter;
    this.rowStyles = {};
    this.clearSelectAll();
    this.clearPageSelectAll();
    this.clearFilter();
    this.selecteds = [];
    this.pageIndex = 1;
    var childs = $$.childs(this.$$tbody, "TR");
    for(var i=0; i<childs.length ;i++){
        var clses = childs[i].className;
        if(clses.indexOf("csc-table-paging-row") >= 0 || clses.indexOf("csc-table-total-row") >= 0){
            continue;
        }
        $$.remove(childs[i]);
    }
    if(clearDataSource !== false){
        this.bf.$CS$.ds = null;
    }
    this.putMessage();//no-data text
    if(this.totalRow && ((SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.isVisible()) || (!SIDEUtil.isEmpty(this.totalRow.members) && this.totalRow.hasVisibleItem() && this.totalRow.isVisible()))){
        this.addTotalRow();
    }
    this.addFooterRow();
};

BC.prototype.DRL = function(force) {
    if(!this.$$tableDiv){
        return;
    }
    var $$parent = this.$$tableDiv.parentNode;
    if(this.bf.$CS$.parent){
        $$parent = this.bf.$CS$.parent.bcRef.getChildContainer(this.bf.$CS$.name);
    }
    if(!$$parent){
        return;
    }
    if(this.parentWidth == $$parent.offsetWidth){
        return;
    }
    this.bf.fire("onDoRelayout");

    if(!this.header && !this.config.noHeader) {
        this.renderDefaultHeader();
        if(this.colmodel){
            this.calculateCellWidths();
            this.applyCellWidths();
        }
    }

};

BC.prototype.getCellWidth = function(memberName) {
    if(!this.colmodel){
        return 100;
    }
    for(var i=0; i<this.colmodel.length ;i++){
        var model = this.colmodel[i];
        if(model.name == memberName){
            if(model.absoluteWidth !== undefined){
                return model.absoluteWidth;
            }
            return model.relativeWidth;
        }
    }
};

BC.prototype.renderDefaultHeader = function(){
    if(this.config.renderHeaders === false){
        return;
    }
    $$.remove($$.getChildHasAttr(this.$$thead, "rel", "def-tr"));//varsa çizilmiş bir def header sil onu
    var $$tr = $$.create("tr", {rel: "def-tr"});
    this.$$thead.appendChild($$tr);
    var bc = this;
    var colmodel = this.rowsMetaData.length ? SArray.clone(this.rowsMetaData[0].colmodel, true) : this.colmodel;
    if(this.rowsMetaData.length && (this.rowNumbers || this.config.rownumbers)){
        $$tr.appendChild($$.create("th"));
    }
    for(var c=0; c<colmodel.length ;c++){
        var $$th = $$.create("th", {rel:colmodel[c].name});
        if(colmodel[c].align){
            $$th.style.textAlign=colmodel[c].align;
        }
        if(colmodel[c].select && this.config.selectall){
            $$.addClass($$th, "csc-table-select");
            var $$check = $$.create("input", {id: this.config.id+"-sall", type: "checkbox"});
            $$check.onclick = function(){
                bc.selectAll(this.checked);
            };
            if(bc.config.disabled || bc.bf.isDisabled()){
                $$check.disabled = true;
            }
            $$th.appendChild($$check);
            this.checkSelectAll($$check);
        } else {
            var $$span = $$.create("SPAN");

            if(this.config.useColModelMeta && this.config.editColName){
                var colTitle = undefined;
                for(var i=0; i<this.config.colmodelMeta.length; i++){
                    if(this.config.colmodelMeta[i].name === colmodel[c].name){
                        if(this.config.colmodelMeta[i].title){
                            colTitle = this.config.colmodelMeta[i].title;
                        }
                        break;
                    }
                }
                $$span.innerHTML = colTitle || colmodel[c].title || colmodel[c].label || "";
            }else{
                $$span.innerHTML = colmodel[c].title || colmodel[c].label || "";
            }

            if(colmodel[c].sortable){
                this.makeSortable(colmodel[c].sortProp || colmodel[c].name, $$span);
            }
            if(colmodel[c].filter){
                this.makeFilterable(colmodel[c].mname || colmodel[c].name , colmodel[c].ftype, $$span, $$th);
            } else {
                $$th.appendChild($$span);
            }
        }
        if(colmodel[c].select && this.config.pageSelect){
            $$.addClass($$th, "csc-table-page-select");
            var $$check = $$.create("input", {id: this.config.id+"-spall", type: "checkbox"});
            $$check.onclick = function(){
                bc.selectPageAll(this.checked);
            };
            if(bc.config.disabled || bc.bf.isDisabled()){
                $$check.disabled = true;
            }
            $$th.appendChild($$check);
            this.checkSelectPageAll($$check)

        }

        // adogan - sürükleyerek sütun değiştirmek için.
        if(this.config.useColModelMeta && !inDesigner(this.bf) && this.config.dragAndDrop){
            $$.attr($$th,"rel", colmodel[c].name);
            $$.attr($$th,"draggable", true);

            var orderFrom 	= 0;
            var orderTo 	= 0;

            $$th.ondragstart = function(event){
                var rel = this.getAttribute("rel");
                event.dataTransfer.setData("selectedCol", rel);

                $$.addClass(this, "csc-table-sortdnd-th");

                for(var i=0; i<bc.config.colmodelMeta.length; i++){
                    if(bc.config.colmodelMeta[i].name === rel){
                        orderFrom = i;
                        break;
                    }
                }
            };

            $$th.ondragover = function(event){
                event.preventDefault();
                if(!$$.getChildHasClass(this, "csc-table-sortdnd-arrow")){
                    for(var i=0; i<bc.config.colmodelMeta.length; i++){
                        if(bc.config.colmodelMeta[i].name === this.getAttribute("rel")){
                            orderTo = i;
                            break;
                        }
                    }
                    if(orderTo <= orderFrom){	// solda ok göster
                        $$.create("DIV", undefined, "csc-table-sortdnd-arrow csc-table-sortdnd-arrow-left", undefined, this);
                    }else{												// sağda ok göster
                        $$.create("DIV", undefined, "csc-table-sortdnd-arrow", {marginLeft: ($$.width(this)-8)+"px", marginTop: "-18px"}, this);
                    }
                }
            };

            $$th.ondragleave = function(){
                // th'nin üstündeki işareti kaldır.
                var arrow = $$.getChildHasClass(this, "csc-table-sortdnd-arrow");
                if(arrow){ arrow.parentNode.removeChild(arrow); }

            }

            $$th.ondrop = function(event){
                event.preventDefault();

                var arrow = $$.getChildHasClass(this, "csc-table-sortdnd-arrow");
                if(arrow){ arrow.parentNode.removeChild(arrow); }

                $$.rmClass($$.getChildHasClass(this.parentNode, "csc-table-sortdnd-th"), "csc-table-sortdnd-th");

                // datadaki elemanı, kendisinin sırasına taşı.
                if(orderTo !== orderFrom){
                    for(var i=0; i<bc.config.colmodelMeta.length; i++){
                        if(bc.config.colmodelMeta[i].name === event.dataTransfer.getData("selectedCol")){
                            var tmp = bc.config.colmodelMeta[i];
                            bc.config.colmodelMeta.splice(i,1);
                            bc.config.colmodelMeta.splice(orderTo, 0, tmp);

                            bc.bf.fire("oncolmodelmetachanged");
                            bc.bf.rerender();
                            break;
                        }
                    }
                }
            }
        }

        if(colmodel[c].headerTip){
            $$.attr($$th, "title", colmodel[c].headerTip);
        }

        $$tr.appendChild($$th);
    }
};

BC.prototype.makeFilter = function(mname, ftype, fvalue, fpath){
    this.saveScrollPosition();
    if(mname){
        this.filters[mname].ftype = ftype;
        this.filters[mname].fvalue = fvalue;
        this.filters[mname].fpath = fpath;
    }

    var filters = [];
    for(var mname in this.filters){
        if(!this.filters[mname].rendered){
            continue;
        }
        filters.push({
            name: mname,
            type: this.filters[mname].ftype,
            value: this.filters[mname].fvalue,
            path: this.filters[mname].fpath
        });
    }
    if(this.config.treeColumn){
			this.bf.filter(filters,null,true);
		}
    else{
			this.bf.filter(filters);
		}

    this.reCalculateTotalRow();

    this.loadScrollPosition();
};

BC.prototype.clearFilter = function(outer){
    if(!SUtil.isEmpty(this.filters)){
        var $$tr, $$th;
        for(var mname in this.filters){
            $$tr = $$.child(this.$$thead, "TR");
            $$th = $$.getChildHasAttr($$tr, "rel", mname);
            if($$th) {
                this.unrenderFilterInput($$th, mname, this.filters[mname].ftype)
            }
        }
    }
    if(!this.fmembers){
        return;
    }
    this.filters = {};
    if(!outer){
        this.bf.filter();
    }
};


BC.prototype.renderFilterInput = function($$th, mname, ftype){
    var value = "", bc = this;
    if(this.filters && this.filters[mname]){
        value = this.filters[mname].fvalue;
    }
    if(!this.filters[mname]){
        this.filters[mname] = {};
    }
    this.filters[mname].rendered = true;

//	$$th.style.position = "relative";
    var $$br = $$.create("BR", {id: this.config.id+"-f-br-"+mname});
    if(ftype == "eq" || ftype == "like"){
        var $$input = $$.create("INPUT", {type:"text", rel: mname, value: value, id: this.config.id+"-f-input-"+mname}, "csc-table-filter-input");
        $$th.appendChild($$br);
        $$th.appendChild($$input);
//		$$th.style.width = $$th.offsetWidth+"px";
        $$input.onkeyup = function(event){
            if(event.keyCode == 13){
                var mname = this.getAttribute("rel");
                var value = this.value ? this.value : undefined;

                var fpath = "";
                var member = bc.bf.members[mname];
                if(member){
                    var memberConfig = member.getConfig();
                    fpath = memberConfig.layoutConfig.fpath;
                }

                bc.makeFilter(mname, ftype, value, fpath);
            }
        };
        $$input.focus();
    } else if(ftype == "cmb"){
        var fpath;
        var member = bc.bf.members[mname];
        if(member){
            var memberConfig = member.getConfig();
            fpath = memberConfig.layoutConfig.fpath;
        }

        var valueMap = {};
        var options = "<option>--Seçiniz--</option>";
        for(var i=0; i<this.bf.tmembers.length ;i++){
            var row = this.bf.tmembers[i];
            var val = row.get(fpath || mname).getText();
            if(val){
                valueMap[val] = true;
            }
        }
        for(var val in valueMap){
            options += "<option value='"+val+"'>"+val+"</option>";
        }
        var $$select = $$.create("SELECT", {rel: mname, id: this.config.id+"-f-input-"+mname}, "csc-table-filter-select");
        $$select.innerHTML = options;
        $$select.value = value;
        $$th.appendChild($$br);
        $$th.appendChild($$select);
//		$$th.style.width = $$th.offsetWidth+"px";
        $$select.onchange = function(event){
            var value = this.value ? this.value : undefined;

            var fpath;
            var mname = this.getAttribute("rel");
            var member = bc.bf.members[mname];
            if(member){
                var memberConfig = member.getConfig();
                fpath = memberConfig.layoutConfig.fpath;

            }

            bc.makeFilter(mname, "eq", value, fpath);
        };

    } else if(ftype == "btw"){
        if(!value){
            value = [];
        }
        var $th = $($$th);
        var $tarihStart = $("<input>").attr({rel: mname, rel2: "start", value: SIDEDateUtil.getFormattedDate(value[0] || "", "yyyymmdd", "dd/mm/yyyy") , id: this.config.id+"-f-input-"+mname}).addClass("csc-table-filter-date");
        var $tarihEnd = $("<input>").attr({rel: mname, rel2: "end", value: SIDEDateUtil.getFormattedDate(value[1] || "", "yyyymmdd", "dd/mm/yyyy"), id: this.config.id+"-f-input2-"+mname}).addClass("csc-table-filter-date");
        $th.append($$.create("BR", {id:this.config.id+"-f-br-"+mname}));
        $th.append($tarihStart);
        $tarihStart.datepicker({
            showButtonPanel: false,
            yearRange: "1900:2050",
            onSelect: function(date){
                $tarihStart.val(date);
                var start = SIDEDateUtil.getFormattedDate(date, "dd/mm/yyyy", "yyyymmdd");
                var end = SIDEDateUtil.getFormattedDate($tarihEnd.val(), "dd/mm/yyyy", "yyyymmdd");
                bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
            }
        });
        $tarihStart[0].onchange = function(){
            var start = SIDEDateUtil.getFormattedDate(this.value, "dd/mm/yyyy", "yyyymmdd");
            var end = SIDEDateUtil.getFormattedDate($tarihEnd.val(), "dd/mm/yyyy", "yyyymmdd");
            bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);

        };
        $th.append($$.create("BR", {id:this.config.id+"-f-br2-"+mname}));
        $th.append($tarihEnd);
        $tarihEnd.datepicker({
            showButtonPanel: false,
            yearRange: "1900:2050",
            onSelect: function(date){
                $tarihEnd.val(date);
                var end = SIDEDateUtil.getFormattedDate(date, "dd/mm/yyyy", "yyyymmdd");
                var start = SIDEDateUtil.getFormattedDate($tarihStart[0].value, "dd/mm/yyyy", "yyyymmdd");
                bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
            }
        });
        $tarihEnd[0].onchange = function(){
            var end = SIDEDateUtil.getFormattedDate(this.value, "dd/mm/yyyy", "yyyymmdd");
            var start = SIDEDateUtil.getFormattedDate($tarihStart.val(), "dd/mm/yyyy", "yyyymmdd");
            bc.makeFilter(this.getAttribute("rel"), "btw", [start, end]);
        };
    }

};

BC.prototype.unrenderFilterInput = function($$th, mname, ftype){
//	$$th.style.position = "";
    $$th.style.width = "";
    var $$br = $$.byid(this.config.id+"-f-br-"+mname);
    if(ftype == "btw"){
        var $$input = $$.byid(this.config.id+"-f-input-"+mname);
        $$.remove($$input);

        $$input = $$.byid(this.config.id+"-f-input2-"+mname);
        $$.remove($$input);

        var $$br2 = $$.byid(this.config.id+"-f-br2-"+mname);
        $$.remove($$br2);
    }else{
        var $$input = $$.byid(this.config.id+"-f-input-"+mname);
        $$.remove($$input);
    }

    $$.remove($$br);

    delete this.filters[mname].rendered;
};

BC.prototype.getSortInfo = function(){
    var sortInfo = this.sortMap;
    for(var info in sortInfo){
        delete sortInfo[info].span;
        if(!sortInfo[info].order) delete sortInfo[info];
    }
    return sortInfo || {};
}


BC.prototype.makeFilterable = function(mname, ftype, $$span, $$th){
    var bc = this;
    if(!bc.filters){
        bc.filters = {};
    }
    $$.addClass($$th, "csc-table-filtered-th");
    var $$div = $$.create("DIV",null,null,{position:"relative"});
    var $$img = $$.create("IMG",{src: "css/bc-style/img/filtre.png", rel: mname, ftype:ftype, title: SideMLManager.get("common.filter")}, "csc-table-filter-img");
    $$th.appendChild($$div);
    $$div.appendChild($$span);
    $$div.appendChild($$img);
    $$img.onclick = function(){

        var mname = this.getAttribute("rel");
        var ftype = this.getAttribute("ftype");
        if(bc.filters[mname] && bc.filters[mname].rendered){
            bc.unrenderFilterInput(this.parentNode, mname, ftype);
            bc.makeFilter(mname, ftype, undefined);
        } else {
            bc.renderFilterInput(this.parentNode, mname, ftype);
            this.setAttribute("src", "css/bc-style/img/filtre-iptal.png");
            this.setAttribute("title", SideMLManager.get("common.cancelFilter"));
        }
    };
    if(this.filters[mname] && bc.filters[mname].rendered){
        this.renderFilterInput($$th, mname, ftype);
        $$img.setAttribute("src", "css/bc-style/img/filtre-iptal.png");
        $$img.setAttribute("title", SideMLManager.get("common.cancelFilter"));
    }
}


BC.prototype.makeSortable = function(mname, $$span, sortType){
    $$span.setAttribute("rel", mname);
    $$.addClass($$span, "csc-table-sortable");
    if(!this.sortMap){
        this.sortMap = {};
    }

    var sortInfo = this.sortMap[mname];
    if(!sortInfo){
        sortInfo = {};
        this.sortMap[mname] = sortInfo;
    }
    sortInfo.span = $$span;
    if(sortInfo.order == "asc"){
        $$.addClass($$span, "csc-table-sort-asc");
    } else if(sortInfo.order == "desc"){
        $$.addClass($$span, "csc-table-sort-desc");
    }
    var bc = this;
    $$.bindEvent($$span, "click", function(){
        var mname = this.getAttribute("rel");
        var oldOrder = bc.sortMap[mname].order;
        bc.saveScrollPosition();
        if(!oldOrder || oldOrder == "desc"){
            bc.bf.sort(mname, "asc");
        } else {
            bc.bf.sort(mname, "desc");
        }
    });
    if(sortType){
        var mmember = this.bf[mname] || BFEngine.get(mname, this.bf);
        var lconfig = mmember.getConfig().layoutConfig;
        if(!lconfig){
            lconfig = {};
            mmember.getConfig().layoutConfig = lconfig;
        }
        lconfig.sortType = sortType;
    }
};
BC.prototype.sortComplated = function(memberName, order){
    if(!this.sortMap){
        return;
    }
    for(var mname in this.sortMap){
        var sortInfo = this.sortMap[mname];
        if(mname == memberName){
            if(order == "asc"){
                sortInfo.order = "asc";
                $$.rmClass(sortInfo.span, "csc-table-sort-desc");
                $$.addClass(sortInfo.span, "csc-table-sort-asc");
            } else {
                sortInfo.order = "desc";
                $$.rmClass(sortInfo.span, "csc-table-sort-asc");
                $$.addClass(sortInfo.span, "csc-table-sort-desc");
            }
        } else {
            delete sortInfo.order;
            $$.rmClass(sortInfo.span, "csc-table-sort-asc");
            $$.rmClass(sortInfo.span, "csc-table-sort-desc");
        }
    }
    this.loadScrollPosition();
};

BC.prototype.calculateCellWidths = function(){
    var colmodel = this.rowsMetaData && this.rowsMetaData.length > 0 ? this.rowsMetaData[0].colmodel : this.colmodel;
    var $$containerDiv = $$.create("div");
    if(this.bf.$CS$.parent){
        var $$parent = this.bf.$CS$.parent.bcRef.getChildContainer(this.bf.$CS$.name);
    } else {
        var $$parent = this.$$tableDiv.parentNode;
    }
    if($$parent){
        var w = this.parentOldWidth || 0;
        if($($$parent).is(":visible") || $$parent.offsetWidth){
            w = this.parentOldWidth = $$parent.offsetWidth;
        }
        $$containerDiv.style.width = w +"px";
    }

    var $$tableDiv = $$.create("div", null, "csc-table");
    if(this.config.style && this.config.style.width){
        $$.css($$tableDiv, "width", this.config.style.width);
    }
    $$.addClass($$tableDiv, this.config.cls);
    var html = "<table style='visibility:hidden; position:absolute; top:-10000px; width:5px;'><tr>";
    var widthTotal = 0;
    for(var c=0; c<colmodel.length ;c++){
        html += "<td style='min-width:10px'></td>";
        widthTotal += 10;
    }
    html += "</tr></table>";
    $$tableDiv.innerHTML = html;
    $$containerDiv.appendChild($$tableDiv);
    $$.body().appendChild($$containerDiv);
    var borderDiff = $$.child($$tableDiv, "table").offsetWidth - widthTotal;
    var parentWidth = $$containerDiv.offsetWidth;
    $$.remove($$containerDiv);

    var absTotal = 0, relTotal = 0, relatives = [];
    for(var c=0; c<colmodel.length ;c++){
        var model = colmodel[c];
        if(model.select){
            model.absoluteWidth = 24;//sabitten alınmalı
            absTotal += model.absoluteWidth;
            continue;
        }
        if(model.rownumbers){
            model.absoluteWidth = 24;//sabitten alınmalı
            absTotal += model.absoluteWidth;
            continue;
        }
        if(typeof model.width == "string" && model.width.indexOf("px") > 0){
            model.absoluteWidth = parseInt(model.width, 10);
            absTotal += model.absoluteWidth;
        } else {
            model.relativeWidth = parseInt(model.width, 10);
            relTotal += model.relativeWidth;
            relatives.push(model);
        }
    }

    if(relatives.length == 0 || parentWidth <= (absTotal+borderDiff)){
        return;
    }
    var diff = parentWidth - absTotal - borderDiff;
    var relativeRates = [];
    for(var i=0; i<relatives.length ;i++){
        relativeRates.push(parseInt(relatives[i].relativeWidth, 10));
    }
    var absoluteWidths = SIDEMath.proportionalShare(diff, relativeRates);
    for(var i=0; i<relatives.length ;i++){
        relatives[i].relativeWidth = absoluteWidths[i];
    }
};

BC.prototype.applyCellWidths = function(){
    var colmodel = this.rowsMetaData && this.rowsMetaData.length > 0 ? this.rowsMetaData[0].colmodel : this.colmodel;
    var ths = $$.childs($$.getChildHasAttr(this.$$thead,"rel", "def-tr"), "th");
    for(var c=0; c<colmodel.length ;c++){
        if(colmodel[c].absoluteWidth){
            ths[c].style.width = colmodel[c].absoluteWidth+"px";
        } else if(colmodel[c].relativeWidth){
            ths[c].style.width = colmodel[c].relativeWidth+"px";
        } else {
            ths[c].style.width = "1px";
        }
    }
};
BC.prototype.clearPageSelectAll = function(){
    var $$input = $$.byid(this.config.id+"-spall");
    if($$input){
        $$input.checked = false;
    }
};
BC.prototype.clearSelectAll = function(){
    var $$input = $$.byid(this.config.id+"-sall");
    if($$input){
        $$input.checked = false;
    }
};

BC.prototype.selectAll = function(select){
    if(select === undefined){
        select = true;
    }
    var $$sall = $$.byid(this.config.id+"-sall");
    if($$sall){
        $$sall.checked = select
    }
    this.selecteds = [];
    if(select){
        var members = this.bf.fmembers || this.bf.tmembers;
        for(var i=0; i<members.length ;i++){
            this.selecteds.push(members[i].getRowId());
        }
    }

    var $$trs = $$.childs(this.$$tbody, "TR");
    for(var i=0; i<$$trs.length ;i++){
        if(!$$trs[i].getAttribute("rowid")){//rowid varsa satırdır yoksa footer, totalrow vs..dir
            continue;
        }
        if(select){
            $$.addClass($$trs[i], "csc-table-selected-tr");
        } else {
            $$.rmClass($$trs[i], "csc-table-selected-tr");
        }
        var $$td = $$.getChildHasClass($$trs[i], "csc-table-select");
        if($$td){
            var $$input = $$.child($$td, "INPUT");
            if($$input){
                $$input.checked = select;
            }
        }
    }

    this.bf.fire("onselectall", select);
};
BC.prototype.selectPageAll = function (select) {
    var bc=this;
    if(select == undefined){
        select = true;
    }
    var $$spall = $$.byid(this.config.id+"-spall");
    if($$spall){
        $$spall.checked = select
    }
    var members = this.bf.fmembers || this.bf.tmembers
    var pageMember = Math.ceil(members.length/this.config.pageNum);

    var startRowid = (this.pageIndex*this.config.pageNum)-this.config.pageNum;

    var endRowid=(this.pageIndex*this.config.pageNum)-1;
    if(endRowid>members.length-1){
        endRowid=members.length-1;
    }

    if(select){
        for(var i=endRowid; i>=startRowid ;i--){
            if(startRowid == -1){
                break;
            }

            if(this.selecteds.indexOf(members[i].getRowId())==-1){
                this.selecteds.push(members[i].getRowId());
            }
        }

    }
    else{
        for(var i=endRowid; i>=startRowid ;i--){
            if(startRowid == -1){
                break;
            }

            if(this.selecteds.indexOf(members[i].getRowId())>-1){
                this.selecteds.splice(this.selecteds.indexOf(members[i].getRowId()),1);
            }
        }

    }
    var $$trs = $$.childs(this.$$tbody, "TR");
    for(var i=0; i<$$trs.length ;i++){
        if(!$$trs[i].getAttribute("rowid")){//rowid varsa satırdır yoksa footer, totalrow vs..dir
            continue;
        }
        if(select){
            $$.addClass($$trs[i], "csc-table-selected-tr");
        } else {
            $$.rmClass($$trs[i], "csc-table-selected-tr");
        }
        var $$td = $$.getChildHasClass($$trs[i], "csc-table-select");
        if($$td){
            var $$input = $$.child($$td, "INPUT");
            if($$input){
                $$input.checked = select;
            }
        }
    }
}

BC.prototype.isSelected = function(rowid){
    var found = false;
    for(var i=0; i<this.selecteds.length ;i++){
        if(this.selecteds[i] == rowid){
            return true;
        }
    }
    return false;
};
BC.prototype.selectRow = function(rowid, select, selectCheckbox, fireEvent){
    var found = false,i,bc=this,bf=bc.bf;
    for(var i=0; i<bc.selecteds.length ;i++){
        if(bc.selecteds[i] == rowid){
            found = true;
            if(!select){
                bc.selecteds.splice(i, 1);
            }
            break;
        }
    }
    if(select && !found){
        bc.selecteds.push(rowid);
    }
    var $$tr = $$.getChildHasAttr(bc.$$tbody, "rowid", rowid);
    if(select){
        $$.addClass($$tr, "csc-table-selected-tr");
    } else {
        $$.rmClass($$tr, "csc-table-selected-tr");
    }
    if(selectCheckbox !== false){
        var $$td = $$.getChildHasClass($$tr, "csc-table-select");
        if($$td){
            var $$input = $$.child($$td, "INPUT");
            if($$input){
                $$input.checked = (select !== false);
            }
        }
    }

    if(bc.config.multiselect === false){
        if(select){
            bc.selecteds = [rowid];
        } else {
            bc.selecteds = [];
        }
        var $$trs = $$.childs(bc.$$tbody, "TR");
        for(i=0; i<$$trs.length ;i++){
            var trRowid = $$trs[i].getAttribute("rowid");
            if(trRowid == rowid){
                continue;
            }
            $$.rmClass( $$trs[i], "csc-table-selected-tr");
            var $$td = $$.getChildHasClass($$trs[i], "csc-table-select");
            if($$td){
                var $$input = $$.child($$td, "INPUT");
                if($$input){
                    $$input.checked = false;
                }
            }
        }
    }

    if(fireEvent){
        var row = bf.getRow(bf.getIndexFromRowId(rowid));
        bf.fire("rowselected", row, select);
    }
    for(i=0; bc.onselects && i<bc.onselects.length ;i++){
        bc.onselects[i].c(row);
    }

    bc.clearSelectAll();
    bc.clearPageSelectAll();
};
/*
 * İç kullanımlar için, dışarıya açık değil
 */
BC.prototype.addOnSelect = function(bf, callback){
    var bc=this;
    if(!bc.onselects){
        bc.onselects = [];
    }
    bc.onselects.push({bf:bf, c:callback});
};
/*
 * İç kullanımlar için, dışarıya açık değil
 */
BC.prototype.rmOnSelect = function(bf){
    var bc=this,i;
    if(!bc.onselects){
        bc.onselects = [];
    }
    for(i=bc.onselects.length-1; i>=0 ;i--){
        if(bc.onselects[i].bf == bf){
            bc.onselects.splice(i,1);
        }
    }
};

BC.prototype.getSelectedRowIds = function(){
    var copy = [];
    for(var i=0; i<this.selecteds.length ;i++){
        copy.push(this.selecteds[i]);
    }
    return copy;
};

BC.prototype.bindEvent = function(eventName, callback) {
    if (eventName == "selected") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.onclick = callback;
        }
    } else if (eventName == "drop") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.ondrop = callback;
        }
    } else if (eventName == "onpaging") {
        this.onpaging = true;
    } else if (eventName == "dragover") {
        var dom = byid(this.config.id);
        if (dom) {
            dom.ondragover = callback;
        }
    }
};

BC.prototype.load = function(){
    this.bf.fire("onload");
};

BC.prototype.group = function(fieldName, collapse){
    this.config.fieldNameForGroup = fieldName;
    this.config.groupCollapse = collapse;
};

/**
 * @function hideActionBar
 * @description Hides or shows action bar
 * @param {boolean} flag - If true then hides action bar
 **/
BC.prototype.hideActionBar = function(flag){
    this.config.hideActionBar = flag;
};

BC.prototype.onExcelImport = function(callback){
    this.onexcelimport = callback;
};

BC.prototype.getSearchInfo = function(){
};

BC.prototype.getTotal = function(sumProp){
    var sum = new BigDecimal("0");
    if(sumProp){
        for(var i=0; i<this.bf.length(); i++){
            var value = this.bf.getValue(i, sumProp) || "0";
            if(typeof value != "string"){
                value = value + "";
            }
            value = value.replace(/,/g,"");
            value = new BigDecimal(value)
            sum = sum.add(value);
        }
    }

    return sum;
};

BC.prototype.saveScrollPosition = function() {
    var $$dom = $$.byid(this.config.id);
    if(!this.scrollInfos){
        this.scrollInfos = [];
    }
    if($$dom){
        var scrollInfo = {};
        scrollInfo.parent = $$dom.parentNode;
        while(scrollInfo.parent){
            if(scrollInfo.parent.scrollTop > 0){
                scrollInfo.scrollTop = scrollInfo.parent.scrollTop;
                break;
            }
            scrollInfo.parent = scrollInfo.parent.parentNode;
        }
    }

    this.scrollInfos.push(scrollInfo);
};

BC.prototype.loadScrollPosition = function() {
    if(!this.scrollInfos){
        return;
    }
    var scrollInfo = this.scrollInfos.pop();
    if(scrollInfo && scrollInfo.parent){
        scrollInfo.parent.scrollTop = scrollInfo.scrollTop;
    }

    if(this.scrollInfos.length == 0){
        delete this.scrollInfos;
    }
};
})(window);
/****************************=csc-title.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-TITLE
 * @classdesc Temel plaintext componenti.
 * @author Mahmut Yıldız
 */
function Definition(CS) {
	this.DEFAULTS = {};

	this.BaseBF = "NON-BUSINESS";

	this.METHODS = [ "setTitle(title)", "getTitle", "setOnContextMenuCallback(callback)", "showContextMenu", "setTips(tips)" ];
	this.EVENTS = [ "selected" ];
	this.DISABLE_EVENTS = [ "selected" ];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TITLE", def);

var BC = def.Type;


BC.prototype.setOnContextMenuCallback = function(callback) {
	var bc = this;
	this.contextMenuCallback = callback;
	
	var $$dom = $$.byid(this.config.id);
	if($$dom){
		$$.bindEvent($$dom, "contextmenu", function(event){
			bc.showContextMenu(event);
		});
	}
};

BC.prototype.showContextMenu = function(event) {
	event = event || window.event;
	var bc = this;
	console.log("title context menu");
	event.preventDefault();
	var menuItemsObj = this.contextMenuCallback();

	csdu.contextMenu({
		moduleName: bc.bf.getModuleName(),
		left: event.pageX, 
		top: event.pageY, 
		items:menuItemsObj,
		bf: bc.bf
	}, undefined, event);
};

/**
 * @function setTips
 * @description Sets tooltip of component
 * @param {string} tips - tooltip
 **/
BC.prototype.setTips = function(tips) {
	this.config.tips = tips || "";
	var $$p = $$.byid(this.config.id);
	if($$p){
		$$p.setAttribute("title", this.config.tips);
	}
};

BC.prototype.getTitle = function() {
	return this.config.title;
};
BC.prototype.setTitle = function(title) {
	this.config.title = title;
	var domObject = byid(this.config.id);
	if (domObject) {
		domObject.innerHTML = title;
	}
};

BC.prototype.getText = function() {
	return this.config.title;
};

BC.prototype.render = function($container) {
	var bc = this, bf=bc.bf, config=bc.config, style=config.style;
	var value = config.title;
	if(value === undefined || value === null){
		value = "";
	}
	var disabled = bf.isDisabled() ? "disabled" : "";
	// create button
	var $$p = $$.create("P", {id: config.id}, ["csc-rospan csc-title", config.cssClass], config.style);
	
	if(style && style.appearance){
		$$p.classList.add("csc-title-"+style.appearance);
	}

	$$.css($$p, {
		fontWeight: config.fontWeight,
		fontStyle: config.italic ? "italic" : undefined,
		fontSize: config.fontSize ? config.fontSize + "pt"  : undefined
	});
	
	$$p.innerHTML = value;
	if(inDesigner(bf)){
		var bc = this;
		var $$img = $$.create("IMG", {src: "designer/img/edit.gif", title: "Edit Title Content"});
		$$img.onclick = function(){
			window.NPages.openTitleContentEdit({titleBF: bf});
		};
		$$p.appendChild($$img);
		if($$p.firstChild){
			$$p.insertBefore($$img, $$p.firstChild);
		}
	}
	
	if(config.tips){
		$$.attr($$p, "title", config.tips);
	}
	
	$$p.style.display = inDesigner(bf) || config.visible ? "" : "none"; //Design Time da visible yap

	if(this.contextMenuCallback){
		$$.bindEvent($$p, "contextmenu", function(event){
			bc.showContextMenu(event);
		});
	}
	
	// set display if exists
	$container.appendChild($$p);
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			$$.addClass(dom, "csc-title-selected");
			dom.onclick = callback;
		}
	}
};

})(window);
/****************************=csc-cstree.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-TREE
 * @author hakand
 */
function Definition() {
	this.DEFAULTS = {
		disabled: false,
		readonly: false,
		multicheck: true
	};

	this.BaseBF = "BASIC";
	this.LABEL = "Tree";

	this.METHODS = ["clearSearch()", "searchByAttribute(attribute, value, showChilds)", "createNodeFromObj(nodeObj)", "createNode(id, parentid, label, icon)", "deleteNode(id)", "getSelectedNodeId", "getSelectedNodeIds", "getSelectedNodeChildIds", "getData", "getNode(id)", "expand(id, deepExpand, expandParents)", "collapse(id)", "setCheckedNodes(idArr)", "getCheckedTreeNodeIds", "setDragStartCallback(callback)", "setDropCallback(callback)", "setOnContextMenuCallback(callback)", "updateNodeData(nodeObj)", "selectTreeNode(id)", "focusToNode(id)", "setNodeLabel(nodeid, label)", "deselectAll", "deselect(id)", "clearDragData", "getDragData", "cancelEvent", "getAncestors(id, rel)", "searchByKey"];

	this.EVENTS = ["selected", "nodeSelected(id)", "addClick", "beforeNodeChecked(id, isChecked, cause)", "nodeChecked(id, isChecked, cause)", "onload", "onbeforemove(sourceId, targetId, direction)", "onmove(sourceId, targetId, direction, sourceOldParentId)", "dblclick(id)", "onnodeexpanded(id)", "onnodecollapsed(id)", "ondragstart(id)", "ondrop(targetId, direction)"];

	this.DISABLE_EVENTS = ["nodeSelected"];

	this.DEPENDENCIES = [];

	this.Type = function () {
	};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-CSTREE", def);

var BC = def.Type;

BC.prototype.init = function () {
	var bc = this, bf = bc.bf, config = bc.config;
	//init tree
	this.treeMap = {};
	this.tree = new CSTree(config.id+"-tree", {
		multicheck: config.multicheck,
		multiselect: config.multiselect,
		hierarchicCheck: config.hierarchicCheck,
		addButton: config.addButton,
		searchable: config.searchable,
		searchPlaceHolder: config.searchPlaceHolder || SideMLManager.get("common.search"),
		searchMinLength: config.searchMinLength,
		showOnlySearchResults: config.showOnlySearchResults,
		checkbox: config.checkable,
		defaultChecked: config.defaultChecked !== false,
		checkType: config.checkType,
		toggleOnSelect: config.toggleOnSelect,
		showHideSearch: config.showHideSearch
	});

	this.dndHelper = {
		marker: null,
		markerLine: null,
		init: function () {
			this.marker = $("#cstree-marker");
			this.markerLine = $("#cstree-marker-line");
			if(!this.marker.length) {
				this.marker = $('<div id="cstree-marker"></div>').appendTo('body');
			}
			if(!this.markerLine.length) {
				this.markerLine = $('<div id="cstree-marker-line"></div>').appendTo('body');
			}

			this.marker.addClass("cstree-apple");
			this.markerLine.addClass("cstree-apple");

		},
		markerCss: function (left, top, display) {
			if(display == "block" || display == "none") {
				this.marker.css("display", display);
			}
			if(left) {
				this.marker.css("left", left + "px");
			}
			if(top) {
				this.marker.css("top", top + "px");
			}
		},
		markerLineCss: function (left, top, display) {
			if(display == "block" || display == "none") {
				this.markerLine.css("display", display);
			}
			if(left) {
				this.markerLine.css("left", left + "px");
			}
			if(top) {
				this.markerLine.css("top", top + "px");
			}
		}
	};
	var tree = this.tree, treeMap = this.treeMap;
	if(config.checkable) {
		tree.onbeforecheckboxchange(function (id, isChecked, event, cause) {
			if(bf.isDisabled() || bf.isReadonly()) {
				return;
			}
			SIDENavigator.setEvent(event);
			bc.clearEventStatus();
			bf.fire("beforeNodeChecked", id, isChecked, cause);
			return !bc.eventCanceled;
		});
		tree.oncheckboxchange(function (id, isChecked, event, cause) {
			if(!bc.config.multicheck) {
				if(tree.getCheckedTreeNodeIds().length > 0) {
					tree.setCheckedNodes([id]);
				} else {
					tree.setCheckedNodes([]);
				}
			}
			if(bc.config.checkOnlyLeaves) {
				var node = bc.getNode(id);
				if(node.children && node.children.length > 0) {
					treeMap[id].checked = false;
				} else {
					treeMap[id].checked = isChecked;
				}

				//check edilecek agac node'larini array'e at
				var checkedNodeIds = [];
				for(var j in treeMap) {
					if(treeMap[j].checked) {
						checkedNodeIds.push(j);
					}
				}
				tree.setCheckedNodes(checkedNodeIds);
			}
			bf.fire("nodeChecked", id, isChecked, cause);
			bc.clearEventStatus();
		});
	}
	tree.ondblclick(function (id) {
		bf.fire("dblclick", id);
	});
	tree.onaddclick(function () {
		bf.fire("addClick");
	});
	tree.onselect(function (id) {
		if(config.selectOnlyLeaves) {
			if(bc.getNode(id).children && bc.getNode(id).children.length > 0) {
				bc.deselect(id);
				return;
			}
		}
		bf.fire("nodeSelected", id);
	});
	tree.ondragstart(function(e, defid){
		return bc.dragStart(e, defid);
	});
	if(config.movable) {
		tree.ondragover(function(event, defid){
			return bc.dragOver(event, defid);
		}).ondragleave(function(event, defid){
			bc.dragLeave(event, defid);
		}).ondragend(function(event, defid){
			bc.dragEnd(event, defid);
		}).ondrop(function(event, defid){
			bc.drop(event, defid);
		});
		bc.dndHelper.init();
	} else {
		tree.ondragend(function (e) {
			$$.body().ondragover = null;
		});
	}

	if(config.contextmenu) {
		tree.oncontextmenu(bc.contextMenuCallback || function(id){
			return bc.getDefaultContextMenu(id);
		});
	}

	tree.onnodeexpanded(function (id) {
		bf.fire("onnodeexpanded", id);
	});
	tree.onnodecollapsed(function (id) {
		bf.fire("onnodecollapsed", id);
	});
};

BC.prototype.destroybc = function (onlybc) {
	if(onlybc) {
		return;
	}
	if(this.tree && this.tree.destroy){
		this.tree.destroy();
		this.tree = null;
	}
	this.treeMap = null;
};

BC.prototype.addNode = function (nodeObj) {
	var treeMap = this.treeMap;
	var id = nodeObj.id, parentid = nodeObj.parentid, label = nodeObj.label;

	if(!id || !parentid) {
		console.error("CSTree.addNode => id, parentid or label is missing.");
	}

	nodeObj.children = [];

	treeMap[id] = nodeObj;

	//babanın çocuklarına ekle
	var p = treeMap[parentid];
	if(p) {
		p.children.push(id);
	} else if(!p && parentid == -1) {
		//root oluştur
		p = treeMap[parentid] = {
			id: -1,
			children: []
		};
		p.children.push(id);
	}
};

BC.prototype.searchByKey = function (key) {
	var $$dom = $$.byid(this.config.id+"-tree");
	if(!$$dom){
		return;
	}
	var liArr = $$dom.getElementsByTagName("li");
	if(!key) {
		throw "Please fill key parameter.";
	}
	//Turkish char check
	if(/[i|İ|ı|I]/.test(key)) {
		key = key.replace(/[i|İ|ı|I]/g, "[ı,I,i|İ]");
	}
	for(var i = 0; i < liArr.length; i++) {
		var $$a = $$.child(liArr[i], "A");
		if(liArr[i].textContent.trim().search(new RegExp("(" + key + ")", "ig")) === -1) {
			$$.addClass(liArr[i], "csc-cstree-search-hide");
		} else if($$a.textContent.search(new RegExp("(" + key + ")", "ig")) !== -1) {
			$$a.innerHTML = $$a.innerHTML.replace(new RegExp("(" + key + ")", "i"), '<span class="csc-cstree-search-highlight">$1</span>');
		}
	}
	//search sonucunda agac bos ise alert edilir.
	if($$dom.childNodes[0].childNodes[0].className.indexOf("hiding") !== -1) {
		throw "No results were found in tree after searching.";
	}
};

BC.prototype.clearSearch = function () {
	var $$dom = $$.byid(this.config.id+"-tree");
	if($$dom) {
		var hiddens = $$dom.querySelectorAll("li.csc-cstree-search-hide");
		for(var i = 0; i < hiddens.length; i++) {
			$$.rmClass(hiddens[i], "csc-cstree-search-hide");
		}
		var highlights = $$dom.querySelectorAll("span.csc-cstree-search-highlight");
		for(i = 0; i < highlights.length; i++) {
			var parentHtml = highlights[i].parentNode.innerHTML;
			var index1 = parentHtml.indexOf("<span");
			var index2 = parentHtml.indexOf("</span");
			highlights[i].parentNode.innerHTML = parentHtml.substring(0,index1) + highlights[i].innerHTML + parentHtml.substring(index2+7);
		}
	}
};

BC.prototype.searchByAttribute = function (attribute, value, showChilds) {
	var className = showChilds ? "attrFound-showChilds" : "attrFound";
	/*showChilds true: parent, node ve node > li gozukecek.
		showChilds false: parent, node gozukecek.
		(node: attribute'e sahip li)*/
	var $$dom = $$.byid(this.config.id+"-tree");
	if(attribute === "" || value === "" || showChilds === "") {
		var msg = "Please fill attribute, value and showChilds parameters.";
		throw msg;
	}
	//attribute'e sahip li'yi bulur.
	var liWithAttr = $$dom.querySelectorAll('li[' + attribute + '=' + value + ']');
	for(var i = 0; i < liWithAttr.length; i++) {
		$$.addClass(liWithAttr[i], [className, "csc-cstree-search-highlight"]);
		//loop root'a kadar doner, parent olan her li'ye class eklenir.
		var liWithAttrParents = liWithAttr[i].parentNode.parentNode;
		while(liWithAttrParents.className !== "csdTree cstree") {
			/* ul > ins a li > ul  agacin yapisi.
			ul ise parent'ina bak. li ise class'ina ekle. */
			if(liWithAttrParents.nodeName === "LI") {
				liWithAttrParents.classList.add("attrFound");
			}
			liWithAttrParents = liWithAttrParents.parentNode;
		}
	}
	//tum li'lerin displayi none yapilir.
	var arr = $$dom.getElementsByTagName("li");
	for(i = 0; i < arr.length; i++) {
		arr[i].style.display = "none";
	}
	//search sonucunda agac bos ise alert edilir.
	if(window.getComputedStyle($$dom.childNodes[0].childNodes[0], null).getPropertyValue("display") === "none") {
		alert("No results were found in tree after searching.");
	}
};

BC.prototype.updateNodeData = function (nodeObj) {
	var treeMap = this.treeMap, obj = treeMap[nodeObj.id];
	if(obj) {
		nodeObj.children = obj.children;
		nodeObj.parentid = obj.parentid;
		treeMap[nodeObj.id] = nodeObj;

		this.renameTreeNode(nodeObj.id, nodeObj.label);
	}
};

BC.prototype.setNodeLabel = function (nodeid, label) {
	var treeMap = this.treeMap, nodeObj = treeMap[nodeid];
	if(nodeObj) {
		nodeObj.label = label;
		this.renameTreeNode(nodeObj.id, nodeObj.label);
	}
};

BC.prototype.deleteNode = function (id) {
	this.deleteTreeNode(id);//dom dan sil

	var treeMap = this.treeMap,node = treeMap[id];
	if(node) {
		//önce bebbeleri yoket
		var childs = csCloneObject(node.children, true);
		for(var i = 0; i < childs.length; i++) {
			this.deleteNode(childs[i]);
		}

		var parentid = node.parentid;
		delete treeMap[id];
		//babanın çocuklarından sil
		var p = treeMap[parentid];
		if(p) {
			var index = csdu.arrayContains(p.children, id);
			if(index != -1) {
				p.children.splice(index, 1);
			}
		}
	}
};

BC.prototype.moveNode = function (sourceId, targetId, direction) {
	var treeMap = this.treeMap;
	var sNode = treeMap[sourceId];
	var tNode = treeMap[targetId];
	if(!sNode || !tNode) {
		var msg = "[CSC-CSTREE] Ağaçta taşıma yapıldı fakat kaynak ve hedef düğümlerden biri bulunamadı.";
		console.error(msg);
		throw msg;
	}

	//babası ile bağları kopar
	var sParentNode = treeMap[sNode.parentid];
	var tParentNode = treeMap[tNode.parentid];
	var index = csdu.arrayContains(sParentNode.children, sNode.id);
	if(index != -1) {
		sParentNode.children.splice(index, 1);
	}

	if(direction == "up" || direction == "down") {
		//yeni baban bu
		sNode.parentid = tNode.parentid;
		//hedefin babasındaki indexi
		index = csdu.arrayContains(tParentNode.children, tNode.id);
		if(direction == "down") {
			index = index + 1;
		}
		//hedefin babasındaki çocuklara kendini ekle
		tParentNode.children.splice(index, 0, sNode.id);
	} else if(direction == "into") {
		//yeni baban bu
		sNode.parentid = tNode.id;
		//hedefin babasındaki çocuklara kendini ekle
		tNode.children.push(sNode.id);
	}
	return {
		sourceOldParentId: sParentNode.id
	};
};

BC.prototype.createTreeNode = function (obj) {
	this.tree.create(obj);
};
BC.prototype.deleteTreeNode = function (id) {
	this.tree.del(id);
};
BC.prototype.renameTreeNode = function (id, label) {
	this.tree.renameNode(id, label);
};
BC.prototype.setTreeNodeState = function (id, state) {
	this.tree.setState(id, state);
};
BC.prototype.getTreeNodeState = function (id) {
	return this.tree.getState(id);
};
BC.prototype.getTreeNodeChecked = function (id) {
	return this.tree.isChecked(id);
};

BC.prototype.renderTree = function (id) {
	var treeMap = this.treeMap, o = treeMap[id];
	if(!o) {
		return;
	}
	o.label = o.label || o.text;
	this.createTreeNode(o);
	this.setTreeNodeState(o.id, o.state);
	for(var i = 0; i < o.children.length; i++) {
		this.renderTree(o.children[i]);
	}
};
BC.prototype.saveTreeState = function (id) {
	if(!id){
		id = this.config.splitTree && this.rootNode ? this.rootNode.id : -1;
	}
	if(this.stateMap[id]) {
		console.log("Tree save state: endless loop prevented.");
		return;
	}
	if(this.treeMap[id]) {
		this.stateMap[id] = true;
		var treeNode = this.treeMap[id];
		treeNode.state = this.getTreeNodeState(id);
		treeNode.checked = this.getTreeNodeChecked(id);
		for(var i = 0; i < treeNode.children.length; i++) {
			this.saveTreeState(treeNode.children[i]);
		}
	}
};

BC.prototype.getDefaultContextMenu = function (id) {
	var obj = {}, me = this;
	obj["New"] = {
		"label": SideMLManager.get("common.add"),
		"action": function (event, id) {
			me.createNode(getid(), id, "Etiket");
			me.tree.expandTree(id);
		},
		"icon": "css/bc-style/img/newfile.png"
	};
	obj["Delete"] = {
		"label": SideMLManager.get("common.delete"),
		"action": function (event, id) {
			me.deleteNode(id);
		},
		"icon": "css/bc-style/img/delete.png"
	};
	return obj;
};

BC.prototype.setOnContextMenuCallback = function (callback) {
	this.contextMenuCallback = callback;
	this.tree.oncontextmenu(callback);
};

BC.prototype.setDisabled = function (flag) {
	this.config.disabled = flag;
	this.tree.setDisabled(flag);
};

BC.prototype.getValue = function () {
	return this.getSelectedNodeId();
};

BC.prototype.getData = function () {
	var map = csCloneObject(this.treeMap, true);
	delete map["-1"];
	return map;
};

BC.prototype.getNode = function (id) {
	return csCloneObject(this.treeMap[id], false);
};
BC.prototype.expand = function (id, deepExpand, expandParents) {
	var bc = this, config = bc.config;
	if(!this.tree.getTreeNode(id || config.id+"-tree")) {
		bc.expandReq = [id, deepExpand, expandParents];
	} else {
		this.tree.expandTree(id || config.id+"-tree", deepExpand, expandParents);
	}
};

BC.prototype.collapse = function (id) {
	var bc = this, config = bc.config;
	if(!this.tree.getTreeNode(id || config.id+"-tree")) {
		bc.collapseReq = [id];
	} else {
		this.tree.collapseTree(id || config.id+"-tree");
	}
};


/**
 * Multiple root example obj:
 * {
 * 	id: "-1",
 *  label: "Root",
 *  children: [
 *    {id: "1.1", label: "Label 1.1", children: [{id:"1.1.1", label: "Label 1.1.1"}]},
 *    {id: "1.2", label: "Label 1.2"},
 *  ]
 * }
 *
 * Single root example obj:
 * {
 * 	id: "1",
 *  label: "Label 1",
 *  children: [
 *    {id: "1.1", label: "Label 1.1", children: [{id:"1.1.1", label: "Label 1.1.1"}]},
 *    {id: "1.2", label: "Label 1.2"},
 *  ]
 * }
 */
BC.prototype.setValue = function (obj, firstcall) {
	var bc=this, config=bc.config;
	if(firstcall === undefined || firstcall === true) {
		obj = csCloneObject(obj, true);
		this.clear();
	}
	if(config.splitTree){
		this.initDataForSplitTree(obj, true);
		this.reRender();
		return;
	}

	obj.parentid = obj.parentid || -1;
	var children = obj.children;
	if(obj.id != -1) {
		this.createNodeFromObj(obj);
	}

	if(children) {
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			child.parentid = obj.id;
			this.setValue(child, false);
		}
	}
};

BC.prototype.initDataForSplitTree = function (node, firstcall) {
	if(firstcall){
		var children = node.children;
		this.splitOptions =[];
		for(var i=0; children && i<children.length ;i++){
			children[i].parentid = node.id;
			this.splitOptions.push(children[i]);
		}
		node.parentid = -1;
		this.orjRoot = csCloneObject(node, true);
		this.rootNode = node;
		this.treeMap[node.id] = node;
		node.children = [];
		if(children) {
			for(var i = 0; i < children.length; i++) {
				var child = children[i];
				this.initDataForSplitTree(child, false);
			}
		}
		node.children = [];
		return;
	}
	var children = node.children;
	this.createNodeFromObj(node, true);
	if(children) {
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			child.parentid = node.id;
			this.initDataForSplitTree(child, false);
		}
	}
};

BC.prototype.getHtmlId = function() {
	if(this.config.splitTree){
		return this.config.id;
	}
	return this.config.id+"-tree";
};

BC.prototype.createNodeFromObj = function (nodeObj, noRender) {

	nodeObj.label = nodeObj.label || nodeObj.text;

	if(nodeObj.icon) {//buranın create treenode içinde yapılması lazım acele ile böyle oldu.
		nodeObj.icon = SideModuleManager.getResourceUrl(this.bf.getModuleName(), nodeObj.icon);
	}

	if(this.config.nodeCssClass) {
		nodeObj.cssClass = this.config.nodeCssClass;
	}
	if(!noRender) {
		this.createTreeNode(nodeObj);//dom a ekle
	}
	this.addNode(nodeObj);//veri yapısında ekle
};

BC.prototype.createNode = function (id, parentid, label, icon) {
	this.createTreeNode({id: id, parentid: parentid, label: label, icon: icon, cssClass: this.config.nodeCssClass});//dom a ekle
	this.addNode({id: id, parentid: parentid, label: label, icon: icon, cssClass: this.config.nodeCssClass});//veri yapısında ekle
};

BC.prototype.clear = function () {
	this.tree.clearTree();
	this.treeMap = {};
	this.selectedSplitId = null;
	this.rootNode = null;
	this.splitOptions = [];
};

BC.prototype.selectTreeNode = function (id) {
	var bc=this, config=bc.config;
	if(config.splitTree){
		var $$select = $$.byid(config.id+"-select"), found=false;
		if($$select){
			var node = bc.treeMap[id];
			while(node){
				for(var i=0; i<bc.splitOptions.length ;i++){
					if(bc.splitOptions[i].id == node.id){
						if(node.id != bc.selectedSplitId){
							$$select.value = node.id;
							$$.fireEvent($$select, "change");
						}
						found = true;
						break;
					}
				}
				if(found){
					break;
				}
				node = bc.treeMap[node.parentid];
			}
		}
	}
	this.tree.expandTree(id, false, true);
	this.tree.select(id, false);
};

BC.prototype.deselectAll = function () {
	this.tree.deselectAll();
};

BC.prototype.deselect = function (id) {
	this.tree.deselect(id);
};

BC.prototype.focusToNode = function (id) {
	var config=this.config;
	this.tree.expandTree(id, false, true);
	if(!this.tree.getTreeNode(config.id+"-tree")) {
		this.focusId = id;
	} else {
		this.tree.focus(id);
	}
};

BC.prototype.getSelectedNodeId = function () {
	return this.tree.getSelectedId();
};

BC.prototype.setCheckedNodes = function (idArr) {
	var bc=this, config=bc.config, treeMap = bc.treeMap;
	for(var id in treeMap) {
		if(idArr && idArr.indexOf(id) >= 0) {
			treeMap[id].checked = true;
		} else {
			treeMap[id].checked = false;
		}
	}
	if(config.splitTree && idArr && idArr.length){
		var id = idArr[0];//Farklı splitlerde check yapılmayacağı varsayılıyor
		var $$select = $$.byid(config.id+"-select"), found=false;
		if($$select){
			var node = bc.treeMap[id];
			while(node){
				for(var i=0; i<bc.splitOptions.length ;i++){
					if(bc.splitOptions[i].id == node.id){
						if(node.id != bc.selectedSplitId){
							$$select.value = node.id;
							$$.fireEvent($$select, "change");
						}
						found = true;
						break;
					}
				}
				if(found){
					break;
				}
				node = bc.treeMap[node.parentid];
			}
		}
	}

	this.tree.setCheckedNodes(idArr);
};

BC.prototype.getCheckedTreeNodeIds = function () {
	return this.tree.getCheckedTreeNodeIds();
};

BC.prototype.getSelectedNodeChildIds = function () {
	var id = this.tree.getSelectedId();
	var node = this.treeMap[id];
	return node ? node.children : null;
};

BC.prototype.getSelectedNodeIds = function () {
	return this.tree.getSelectedIdArr();
};

BC.prototype.cancelEvent = function () {
	this.eventCanceled = true;
};

BC.prototype.clearEventStatus = function () {
	this.eventCanceled = false;
};

BC.prototype.configChanged = function () {
	this.tree.setConfig(this.config);
};

BC.prototype.load = function () {
	this.bf.fire("onload");
};

BC.prototype.setDragStartCallback = function (c) {
	this.dragStartCallback = c;
};

BC.prototype.setDropCallback = function (c) {
	this.dropCallback = c;
};

BC.prototype.getDragData = function () {
	return this.dragData;
};

BC.prototype.clearDragData = function () {
	this.dragData = undefined;
};

BC.prototype.dragStart = function (e, defid) {
	var bc = this, treeMap=bc.treeMap;
	bc.dragData = {};
	SIDENavigator.setEvent(e);
	bc.bf.fire("ondragstart", defid, e);

	var dragToolTip = $$.create("DIV", null, "dragToolTip", null, $$.body());
	dragToolTip.innerHTML = bc.config.dragToolTipText || "Dragging...";

	$$.body().ondragover = function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'move';
		dragToolTip.style.left = e.clientX + 15 + "px";
		dragToolTip.style.top = e.clientY + 15 + "px";
	};

	$$.body().ondragend = function (e) {
		e.preventDefault();
		if(dragToolTip && dragToolTip.parentNode){//Drag işlemi tree tarafıdnan başlatılmamış olabilir
			$$.body().removeChild(dragToolTip);
		}
	};


	if(bc.dragStartCallback) {
		var callbackResult = bc.dragStartCallback(defid);
		if(!callbackResult) {
			console.log("[CSTree] dragStartCallback taşımaya izin vermiyor.");
			return;
		}
	}

	bc.dragData.sourceId = defid;
	bc.dragData.sourceid = defid;
	bc.dragData.sourceOldParentId = treeMap[bc.dragData.sourceid] ? treeMap[bc.dragData.sourceid].parentid : undefined;
};

BC.prototype.dragOver = function (event, defid) {
	var bc = this;
	if(!event) {
		event = window.event;
	}
	event.preventDefault();
	event.stopPropagation();
	event.dataTransfer.dropEffect = 'none';

	var outerDNDoperation = false; //dışarıdan tree içine drop yapılıyor mu, yoksa tree içindeki düğümlerin taşınması mı?
	if(!bc.dragData || !bc.dragData.sourceId) {
		outerDNDoperation = true;
		bc.dragData = {};
	}

	var targetId = defid;

	if(!outerDNDoperation) {
		var sourceId = bc.dragData.sourceId;

		//kendi bebesinin içine taşımaya izin verme
		var $targetElement = $("#" + targetId);
		if($targetElement.closest($('#' + sourceId + '_li')).length) {
			console.log("[CSTree] kendi bebesinin içine taşımaya izin verilmiyor.");
			return;
		}
	}

	bc.dragData.targetId = targetId;
//	bc.dragData.targetid = decapsulateId(targetId);
	bc.dndHelper.markerCss(0, 0, "none");
	bc.dndHelper.markerLineCss(0, 0, "none");

	var element = $("#" + bc.tree.encapID(targetId));
	var o = element.offset();
	var markerLineTopOffset = 0;
	if((o.top + 5) > event.pageY && (outerDNDoperation || ((bc.dropCallback && bc.dropCallback(sourceId, targetId, "up")) || !bc.dropCallback))) {//hedefin üstüne

		event.dataTransfer.dropEffect = 'move';
		markerLineTopOffset = o.top - 1;
		bc.dndHelper.markerLineCss(o.left - 7, markerLineTopOffset, "block");
		bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

		bc.dragData.direction = "up";
	} else if((o.top + element.height() - 5) < event.pageY && (outerDNDoperation || ((bc.dropCallback && bc.dropCallback(sourceId, targetId, "down")) || !bc.dropCallback))) {//hedefin altına
		event.dataTransfer.dropEffect = 'move';
		markerLineTopOffset = o.top + element.height() - 1;
		bc.dndHelper.markerLineCss(o.left - 7, markerLineTopOffset, "block");
		bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

		bc.dragData.direction = "down";
	} else {//hedefin içine
		if((outerDNDoperation || (bc.dropCallback && bc.dropCallback(sourceId, targetId, "into")) || !bc.dropCallback)) {
			event.dataTransfer.dropEffect = 'move';
			markerLineTopOffset = o.top + 8;
			bc.dndHelper.markerLineCss(0, 0, "none");
			bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

			bc.dragData.direction = "into";
		} else {
			console.log("[CSTree] dragOverCallback taşımaya izin vermiyor.");
		}
	}

	return false;
};

BC.prototype.dragLeave = function (event, defid) {
	var bc = this;

	bc.dndHelper.markerCss(0, 0, "none");
	bc.dndHelper.markerLineCss(0, 0, "none");
};

BC.prototype.dragEnd = function (event, defid) {
	var bc = this;
	bc.dndHelper.markerCss(0, 0, "none");
	bc.dndHelper.markerLineCss(0, 0, "none");
};

BC.prototype.drop = function (event, defid) {
	var bc = this;
	event.preventDefault();
	event.stopPropagation();

	var sourceId, targetId, direction;
	if(bc.dragData) {
		direction = bc.dragData.direction;
		targetId = bc.dragData.targetId;
		sourceId = bc.dragData.sourceId;
	}

	if(!sourceId) {//dışarıdan tree içine drop yapılmış
		bc.dndHelper.markerCss(0, 0, "none");
		bc.dndHelper.markerLineCss(0, 0, "none");

		//event fırlat
		console.log("[CSTree] Ondrop: targetId:" + targetId + ", direction:" + direction);
		bc.bf.fire("ondrop", targetId, direction);
	} else {//tree içindeki düğümlerden drop yapılmış.
		if(!direction || !sourceId || !targetId) {
			console.log("[CSTree] move drop parametre yetersiz. taşıma başarısız.");
			bc.dragData = {};
			return;
		}
		//kendi bebesinin içine taşımaya izin verme
		var $targetElement = $("#" + targetId);
		if($targetElement.closest($('#' + sourceId + '_li')).length) {
			console.log("[CSTree] kendi bebesinin içine taşımaya izin verilmiyor.");
			return;
		}

		if(bc.dropCallback) {
			var callbackResult = bc.dropCallback(sourceId, targetId, direction);
			if(!callbackResult) {
				console.log("[CSTree] dropCallback taşımaya izin vermiyor.");
				return;
			}
		}

		//move node
		var index = (direction == "up") ? "before" : ((direction == "down") ? "after" : "last");

		bc.bf.fire("onbeforemove", sourceId, targetId, direction);
		if(bc.eventCanceled) {
			bc.eventCanceled = false;
			return;
		}

		bc.tree.move(sourceId, targetId, index);
		var moveResultObj = bc.moveNode(sourceId, targetId, direction);

		//event fırlat
		bc.bf.fire("onmove", sourceId, targetId, direction, moveResultObj.sourceOldParentId);
	}
	bc.dragData = {};

};


BC.prototype.saveState = function () {
	var tree = this.tree;
	if(tree && tree.isRendered()) {
		this.stateMap = {};
		this.saveTreeState();
		var $$tree = $$.byid(this.config.id+"-tree");
		if($$tree){
			this.scrollTop = $$tree.scrollTop;
			this.scrollLeft = $$tree.scrollLeft;
		}
	}
};

BC.prototype.getAncestors = function (id, rel) {
	return this.tree.getAncestors(id, rel);
};

BC.prototype.render = function ($$container) {
	var bc = this, bf = bc.bf, config = bc.config, tree = this.tree;
	var disabled = bf.isDisabled(), readonly = bf.isReadonly();

	var $$treeCont = $$container;
	if(config.splitTree){
		$$treeCont = $$.create("DIV", {id:config.id}, "cs-tree-container", null, $$container);
		if(this.splitOptions){
			var $$select = $$.create("SELECT", {id: config.id+"-select"}, "cstree-select", null, $$treeCont);
			var optsStr = "<option>Lütfen ağacın ilk kırılımını seçiniz..</option>";
			for(var i=0; i<this.splitOptions.length ;i++){
				var value = this.splitOptions[i].id;
				var text = this.splitOptions[i].label;
				if(typeof text == "string" && text.indexOf("<") >= 0){
					text = text.replace("<", "&#060;");
				}
				if(typeof value == "string" && value.indexOf("'") >= 0){
					value = value.replace(/'/g,"&#39;")
				}
				optsStr += "<option value='" + value + "'>" + text  + "</option>";
			}
			$$select.innerHTML = optsStr;
			$$select.onchange = function(){
				bc.selectedSplitId = this.value;
				bc.rootNode.children = [bc.selectedSplitId];
				bc.bf.rerender();
				bc.tree.expandTree(bc.selectedSplitId, false, true);
			};
		}
	}

	var $$treediv = $$.create("DIV", {
		id: config.id+"-tree",
		disabled: disabled ? "disabled" : null,
		readonly: readonly ? "readonly" : null
	}, ["csdTree", "cstree", config.theme, config.cssClass], null, $$treeCont);
	if(config.disableZebra) {
		$$.addClass($$treediv, "cstree-nozebra");
	}
	if(config.splitTree) {
		$$.addClass($$treediv, "cstree-split-tree");
	}

	config.style = config.style || {};
	var width = config.style.width || ($$container.offsetWidth ? ($$container.offsetWidth + "px") : "100%");
	var height = config.style.height || ($$container.offsetHeight ? ($$container.offsetHeight + "px") : "100%");

	$$.css($$treediv, {width: width, height: height, "max-height": height, overflow: "auto"});

	$$.create("UL", {id: config.id + "-tree_ul"}, null, {width: "100%"}, $$treediv);

	tree.init();
	tree.setDisabled(disabled);

	if(inDesigner(this.bf) && SIDEUtil.isEmpty(this.treeMap)) {//design time
		this.setValue({
			id: -1,
			label: "Root",
			children: [
				{id: 1,label: "Child 1",children: [{id: 11, label: "Child 1 - 1", children: [{id: 111, label: "Child 1 - 1 - 1"}, {id: 112, label: "Child 1 - 1 - 2"}]}, {id: 12, label: "Child 1 - 2"}]},
				{id: 2, label: "Child 2", children: [{id: 21, label: "Child 2 - 1", children: [{id: 211, label: "Child 2 - 1 - 1"}]}, {id: 22, label: "Child 2 - 2"}]}]
		});
		tree.expandTree(config.id+"-tree");
	} else {//run time
		//veri yapısı dolu ise ağacı çiz
		this.renderTree(this.rootNode ? this.rootNode.id : "-1");
		if(this.scrollTop){
			$$treediv.scrollTop = this.scrollTop;
			$$treediv.scrollLeft = this.scrollLeft;
			this.scrollTop = null;
			this.scrollLeft = null;
		}
	}
	//node'a focuslayinca 2 kere render'a giriyor, bu yuzden focus kayboluyor
	var expandReq = bc.expandReq, collapseReq = bc.collapseReq;
	if(expandReq) {
		bc.expand(expandReq[0], expandReq[1], expandReq[2]);
	} else if(collapseReq) {
		bc.collapse(collapseReq[0]);
	}
	if(this.focusId) {
		this.focusToNode(this.focusId);
		this.focusId = null;
	}
};


BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "selected") {
		var $$dom = $$.byid(this.config.id+"-tree");
		if($$dom) {
			$$dom.onclick = callback;
		}
	}
};

})(window);
/****************************=csc-number.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-NUMBER
 */
function Definition() {
	this.DEFAULTS = {
		allowZero : false,
		roEmptyValue : "-----",
		defvalue : 0,
		focusable: true,
		disabledKey: "disabled",
		allowNegative : true
	};

	this.BaseBF = "BASIC";

	this.METHODS = ["focus", "setDefaultValue(value)", "setEmptyValue(value)"];
	this.EVENTS = [ "changed(event)", "selected(event)", "blur(event)" ];
	this.DEPENDENCIES = [
		{"name": "jquery-autonumeric", "version": "1.9.7"}
	];

	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-NUMBER", def);

var BC = def.Type;

/**
 * @function setDefaultValue
 * @description Number bileşene bir değer verilmediği durumda bileşenin varsayılan değeri belirler.
 * @param [value] alana verilen varsayılan değer
 */
BC.prototype.setDefaultValue = function(value) {
	this.config.defvalue = value;
};

BC.prototype.getSortType = function() {
	return "number";
};

/**
 * @function setEmptyValue
 * @description Sets the empty value. If a number component has an empty value then display value of component is an empty string "".
 * When component doesnt has a value getValue method returns empty value.
 * To use empty value properly defaultValue must be undefined, otherwise empty value will be omitted.
 * @param [value] empty value
 */
BC.prototype.setEmptyValue = function(value) {
	this.config.emptyValue = value;
};

/**
 * @function focus
 * @description Odağı bileşene getirir.
 */
BC.prototype.focus = function(){
	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};

BC.prototype.init = function() {
	if(typeof this.config.min == "string"){
		this.config.min = parseInt(this.config.min, 10);
	}
	if(typeof this.config.max == "string"){
		this.config.max = parseInt(this.config.max, 10);
	}

	if (inDesigner(this.bf)) {
		var t = this.config.thousandSeperator || "";
		var d = this.config.decimalSeperator || ".";
		if( (d || t) && (d == t) ){
			CSPopupUTILS.MessageBox("Thousand Sep. and Decimal Sep. cannot equal!", {error: true});
			this.config.thousandSeperator = "";
			this.config.decimalSeperator = ".";
			this.reRender();
		}
	}
};

BC.prototype.getValue = function() {
	var bc=this, bf=bc.bf, config=bc.config;
	var $el = $("#" + config.id);
	var readonly = bc.isParentReadonly() || bf.isReadonly();
	if ($el.length && !readonly) {
		config.value = $el.autoNumeric('get');
	}
	var value = config.value;
	if(config.emptyValue !== undefined && (value === null || value === undefined || value === "" || isNaN(value) )){
		return config.emptyValue;
	}
	if (config.defvalue !== undefined && (value === null || value === undefined || value === "" || isNaN(value) )) {
		return config.defvalue;
	}

	if (value === null) {
		return value;
	}
	return parseFloat(value);
};

BC.prototype.setValue = function(value) {
	var bc=this, bf=bc.bf, config=bc.config;
	if(value && typeof value == "number"){
		value = new BigDecimal(""+value);
		value.form = 0;
		value = value.toString();
	}
	if(config.emptyValue !== undefined && config.emptyValue === value){
		value = "";
	}
	config.value = value;
	$el = $("#" + config.id);

	var readonly = bf.isReadonly();
	if (readonly) {
		if (config.value !== undefined && config.value !== null) {
			$el.autoNumeric('set', config.value);
		} else {
			$el.html(config.roEmptyValue || "");
		}
	} else {
		if (config.value !== undefined && config.value !== null) {
			$el.autoNumeric('set', config.value);
		} else {
			$el.autoNumeric('set', "");
		}
	}

	if( getSideDefaults("support-changed-event-on-setvalue") ){
		bf.fire("changed");
	}
};

BC.prototype.setDisabled = function(flag) {
	var bc=this, config=bc.config;
	config.value = bc.getValue();
	if(config.emptyValue !== undefined && config.value===config.emptyValue){
		config.value = "";
	}
	config.disabled = flag;
};

BC.prototype.saveState = function() {
	var bc=this, config=bc.config;
	var value = bc.getValue();
	if(value && typeof value == "number"){
		value = new BigDecimal(""+value);
		value.form = 0;
		value = value.toString();
	}
	if(config.emptyValue !== undefined && value===config.emptyValue){
		value = "";
	}
	config.value = value;
};

BC.prototype.isEmpty = function(omitDefaultValue) {
	var bc=this, config=bc.config;
	var value = bc.getValue();
	if(omitDefaultValue && value == 0){
		return true;
	}
	if(config.emptyValue !== undefined && value===config.emptyValue){
		return true;
	}
	if (config.allowZero) {
		return false;
	}
	return value == 0;
};

BC.prototype.destroybc = function(){
	$("#"+this.config.id).remove();
};

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config;
	var readonly = bc.isParentReadonly() || bf.isReadonly();
	if (config.value === undefined && config.min !== undefined) {
		config.value = config.min;
	}
	var decSep = config.decimalSeperator;
	var thousandSep = config.thousandSeperator || "";

	if(config.autoDecimalLength == "false"){
		config.autoDecimalLength = false;
	}
	var decimalLen = config.decimalLength || 0;
	if (decimalLen < 0 || config.autoDecimalLength)
		decimalLen = 0;

	var max = 9999999999999;
	if (config.max !== undefined && !isNaN(config.max)) {
		max = config.max;
	}
	if (!config.allowNegative) {
		min = 0;
	}else{
		min = 0 - max;
	}
	if (!config.style) {
		config.style = {};
	}
	if (!config.style.textAlign) {
		config.style.textAlign = "right";
	}
	if (readonly) {
		var $span = $("<span>");
		$span.attr({
			id : config.id,
			title:config.tips
		});
		$span.css(config.style || {});
		$span.addClass("csc-rospan").addClass("csc-number").addClass(config.cssClass);
		if(!inDesigner(bf) && bc.clickBinded && !bf.isDisabled()){
			$span.addClass("csc-textbox-linked");
		}

		$span.attr({
			"data-a-sep" : thousandSep,
			"data-a-dec" : decSep,
			"data-m-dec" : decimalLen,
			"data-v-max" : max,
			"data-v-min" : min,
			"data-autoDecimalLength" : config.autoDecimalLength
		});
		if(config.maxDecLength && config.maxDecLength > 0){
			$span.attr("data-maxDecLength", config.maxDecLength);
		}
		$span.autoNumeric('init');

		if (config.value !== undefined && config.value !== null) {
			$span.autoNumeric('set', config.value);
		} else {
			$span.html(config.roEmptyValue || "");
		}
		if (inDesigner(bf)) {
			$span.css("display", "");
			$span.html(config.roEmptyValue || "Readonly").addClass("csc-readonly");
		}
		$container.appendChild($span[0]);
	} else {
		var $newTextBox = $("<input>");
		// Set ID, Type, Value And Disabled Attributes if exists

		$newTextBox.attr({
			id : config.id,
			type : "text",
			size : config.size,
			value : config.value,
			title:config.tips,
			tabindex: config.tabIndex,
			placeholder:config.placeholder,
			"data-a-sign" : "",
			"data-a-sep" : thousandSep,
			"data-a-dec" : decSep,
			"data-m-dec" : decimalLen,
			"data-v-max" : max,
			"data-v-min" : min,
			"data-w-empty" : "empty",
			"data-l-zero" : "deny",
			"data-autoDecimalLength" : config.autoDecimalLength
		});
		if(bf.isDisabled()){
			$newTextBox.attr(config.disabledKey,config.disabledKey);
		}

		if(config.maxDecLength && config.maxDecLength > 0){
			$newTextBox.attr("data-maxDecLength", config.maxDecLength);
		}

		try {
			$newTextBox.autoNumeric('init');
		} catch (ex) {
			$newTextBox.attr("value", min);
			$newTextBox.autoNumeric('init');
		}

		$newTextBox.addClass("csc-number").addClass(config.cssClass);

		checkAndSetCss($newTextBox, "display", config.visible ? "" : "none");
		$newTextBox.css(config.style || {});

		$newTextBox.blur(function(){
			var value = bc.getValue();
			if(value === undefined || value === null || value === ""){
				return;
			}
			if(bc.config.min !== undefined && parseInt(bc.config.min) > value){
				bc.setValue("");
			}
			if(bc.config.allowZero === false && value === 0){
				bc.setValue("");
			}
		});

		// Design Time da visible yap
		if (inDesigner(bf)) {
			$newTextBox.css("display", "");
		}
		if (config.cssClass) {
			$newTextBox.addClass(config.cssClass);
		}

		if (bf.isRequired()) {
			$newTextBox.addClass("csc-required");
		}

		$newTextBox.bind('change', function(event) {
			if(!bc.validate()){
				bc.bf.fire("changed", bc.getValue());
			}else{
				bc.setValue("");
			}
			if(bc.bf.getParent().bcRef.typeName  === "CSC-TABLE" && bc.bf.getParent().bcRef.totalRow){
				bc.bf.getParent().bcRef.reCalculateTotalRow();
			}
		});

		bc.applyInlineValidation($newTextBox[0]);
		$container.appendChild($newTextBox[0]);
		if (config.addOn) {
			$$.addClass($container, "input_group");
			if (config.addOnText) {
				var addOntext = $$.create("span", null, ["csc-textbox-addon-text"]);
				addOntext.innerHTML = config.addOnText;
				if (config.addOnTextPosition === "right") {
					$container.appendChild(addOntext);
				} else {
					$container.insertBefore(addOntext, $container.childNodes[0]);
				}
			}
			if (config.addOnIcon) {
				var addOnIcon = $$.create("span", null, ["csc-textbox-addon-icon"]);
				addOnIcon.innerHTML = "<i class='fa " + config.addOnIcon + " '></i>";
				if (config.addOnIconPosition === "right") {
					$container.appendChild(addOnIcon);
				} else {
					$container.insertBefore(addOnIcon, $container.childNodes[0]);
				}
			}
		}
	}

};
BC.prototype.validate = function() {
	var value = this.getValue(), label = this.bf.getConfig("label");
	if (this.config.max !== undefined && parseFloat(this.config.max) < value) {
		return SideMLManager.get(this, "maxValue", this.config.max, label);
	}
	if (this.config.min !== undefined && parseFloat(this.config.min) > value) {
		return SideMLManager.get(this, "minValue", this.config.min, label);
	}
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var bc=this, $$dom = byid(bc.config.id);
		if ($$dom) {
			$$dom.onclick = callback;
			if(!inDesigner(bc.bf) && $$dom.tagName == "SPAN" && !bc.bf.isDisabled()){
				$$.addClass($$dom, "csc-textbox-linked");
			}
		}
	} else if (eventName == "blur") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onblur = callback;
		}
	}
};

})(window);
/****************************=csc-iframe.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-IFRAME
 */
function Definition() {
	this.DEFAULTS = {
		disabled : false
	};

	this.BaseBF = "BASIC";
	this.METHODS = [ "setSource(src)", "setData(html)", "print()", "mask", "unmask" ];
	this.EVENTS = [ "oninit(param)", "iframeLoaded"];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-IFRAME", def);

var BC = def.Type;

BC.prototype.setDisabled = function(flag) {
	this.config.value = this.getValue();
	this.config.disabled = flag;
};

BC.prototype.setVisible = function(flag) {
	this.config.visible = flag;
	$$.css($$.byid(this.config.id), "display", flag ? "" : "none");
};

/**
 * @function setSource
 * @description IFrame'in kaynağını ayarlar.
 * @param [src] IFrame'in kaynağı
 */
BC.prototype.setSource = function(src) {
	this.config.src = src;
	var $$dom = $$.byid(this.config.id);
	if($$dom){
		$$dom.setAttribute("src", src);
	}
};

/**
 * @function setData
 * @description IFrame'in içereceği html içeriğin verilmesini sağlayan metoddur.
 * @param [innerHTML] IFrame'in içinde gösterilecek html içerik
 */
BC.prototype.setData = function(innerHTML) {
	var $$dom = $$.byid(this.config.id);
	if($$dom){
		$$dom.contentDocument.body.innerHTML = "";
		$$dom.contentDocument.write(innerHTML);
	}
};

/**
 * @function print
 * @description IFrame'in yazdırılması için print pop-up'ını açar.
 */
BC.prototype.print = function() {
	$$iframe = $$.byid(this.config.id);
	if($$iframe){
		$$iframe.focus();
		$$iframe.contentWindow.print();
	}
};

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config, style=config.style;
	if (style && style.width) {
		size = style.width.split("px")[0];
	}

	var $$newiframe = $$.create("IFRAME", {frameborder: config.borderWidth});

	if (!inDesigner(bf) && config.src) {
		$$.attr($$newiframe, "src", config.src);
	}

	$$.attr($$newiframe, {
		id : config.id,
		size : config.size
	});
	
	if (bf.isDisabled()) {
		$$.attr($$newiframe, "disabled", "disabled");
	}

	$$.css($$newiframe, "display", config.visible ? "" : "none");
	$$.css($$newiframe, style || {});

	// Design Time da visible yap
	if (inDesigner(bf)) {
		$$.css($$newiframe, "display", "");
	}

	$$.addClass($$newiframe, ["csc-iframe", config.cssClass]);

	$container.appendChild($$newiframe);
};

/**
 * @function mask
 * @description IFrame'e bir mesaj içeren koyu renkli "Yükleniyor" maskesi koymaya yarar.
 * @param [message] Maskenin üstünde yazan mesaj
 */
BC.prototype.mask = function(message) {
	message = message || SideMLManager.get("common.loadingText");
	var id = this.config.id;

	var $$gen = $$.byid(id);
	var $$maskDiv = $$.create("DIV",{"id": id + "-mask"}, "maskDiv", {"width": $$.innerWidth($$gen)+"px", "height": $$.innerHeight($$gen)+"px"});

	var $$loadingDiv = $$.create("DIV", undefined, "maskedLoadInfo");

	var $$img = $$.create("IMG", {"src": "css/bc-style/img/loadmaskicon.gif"});
	var $$span = $$.create("SPAN");
	$$span.innerHTML = message;
	
	$$loadingDiv.appendChild($$img);
	$$loadingDiv.appendChild($$span);
	$$maskDiv.appendChild($$loadingDiv);
	
	var $$parent = $$gen.parentNode;
	$$parent.insertBefore($$maskDiv, $$gen);
	
	$$.css($$loadingDiv, {"margin-left": $$.innerWidth($$gen) / 2 - $$.innerWidth($$loadingDiv) / 2+"px", "margin-top": $$.innerHeight($$gen) / 2 - $$.innerHeight($$loadingDiv) / 2+"px"});
};

/**
 * @function unmask
 * @description IFrame'e konulan mesaj içerikli maskeyi kaldırmaya yarar.
 */
BC.prototype.unmask = function() {
	$$dom = $$.byid(this.config.id+"-mask");
	$$.remove($$dom);
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "iframeLoaded") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onload = callback;
		}
	} 
};

})(window);
/****************************=csc-maskfield.js=******************************/
(function(window, undefined) {
/** @class CSC-MASKFIELD */
function Definition(CS) {
	this.DEFAULTS = {
		disabled : false,
		cls : "csc-mask",
		mask : "",
		roEmptyValue : "-----",
		focusable: true,
		disabledKey: "disabled"
	};

	this.BaseBF = "BASIC";

	this.METHODS = [ "focus", "changeMask(mask)", "getRawValue", "setRawValue(value)" ];
	this.EVENTS = [ "changed", "selected", "blur", "onload", "maskerror", "onfocus", "onEnterPressed" ];
	this.DISABLE_EVENTS = [ "selected" ];
	this.DEPENDENCIES = [
		{"name": "jquery-maskedinput", "version": "1.3"}
	];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-MASKFIELD", def);

var BC = def.Type;

BC.prototype.load = function() {
	this.bf.fire("onload");
};

/**
 * @function changeMask
 * @description Maskeyi ayarlar.
 * @param {string} [mask] Mask field'da uygulanacak maske.
 * @param mask içinde aşağıdaki karakterler kullanılabilir.
 * '9': "[0-9]", Sadece rakam
 * 'a': "[A-Za-zığüşçöİĞÜŞÇÖ]", Sadece harf
 * 'U': "[A-ZİĞÜŞÇÖ]", Sadece büyük harf
 * 'B': "[A-ZİĞÜŞÇÖ0-9]", Sadece büyük harf ve rakam
 * 'L': "[a-zığüşçö]", Sadece küçük harf
 * '*': "[A-Za-z0-9ığüşçöİĞÜŞÇÖ]" Harf yada rakam
 */
BC.prototype.changeMask = function(mask) {

	this.config.mask = mask;
	this.bf.rerender();
};

BC.prototype.getRawValue = function() {
	var readonly = this.isParentReadonly() || this.bf.isReadonly();
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		if (readonly) {
			var value = this.config.value;
		} else {
			var value = $$dom.value;
		}
	} else {
		var value = this.config.value;
	}
	var raw = "";
	if (!value) {
		return raw;
	}
	var clone_mask = this.config.mask;
	clone_mask = clone_mask.replace("\\", "");

	for (var i = 0; i < clone_mask.length; i++) {
		var ch = clone_mask.charAt(i);

		if(this.config.ignoreUnderscores && value.charAt(i) === '_'){

			continue;
		}

		if (ch == '*' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
			raw += value.charAt(i);

		} else if (ch == '_') {

			raw += " ";
		}
	}

	return raw;
};

BC.prototype.setRawValue = function(raw)
{
	if (raw === undefined || raw === null) {
		raw = "";
	} else if (typeof raw != "string") {
		raw = "" + raw;
	}
	var readonly = this.isParentReadonly() || this.bf.isReadonly();
	var value = "", index = 0;
	if (raw) {
		for (var i = 0; i < this.config.mask.length; i++) {
			var ch = this.config.mask.charAt(i);
			if (ch == '*' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
				if (index < raw.length) {
					value += raw.charAt(index);
				}
				index++;
			} else {
				value += ch;
			}
		}
	}
	this.config.value = value;
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		if (readonly) {
			if(this.config.roNoMask === true){
				$$dom.innerHTML = raw;
			} else {
				$$dom.innerHTML = value;
			}
		} else {
			$$dom.value = value;
			if(!this.config.value){
				$($$dom).trigger("clearmask");
			}
		}
	}
};

BC.prototype.getValue = function() {

	if (this.config.raw) {
		return this.getRawValue();
	}
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		var readonly = this.isParentReadonly() || this.bf.isReadonly();
		if (readonly) {
			return this.config.value;
		} else {

			var value = $$dom.value === undefined ? this.config.value || "" : $$dom.value;
			if (this.config.notclearvalue) {

				return value.replace(/_/g, "");
			}
			if (value && value.indexOf("_") >= 0) {// Kullanıcı veri girmeyi tamamlamamış
				return "";
			}
			return value;
		}
	}
	return this.config.value || "";
};
BC.prototype.setValue = function(value) {
	if (this.config.raw) {
		return this.setRawValue(value);
	}
	if (value === null || undefined === value) {
		value = "";
	} else {
		value = "" + value;
	}
	
	var readonly = this.isParentReadonly() || this.bf.isReadonly();
	if(readonly && this.config.mask && this.config.roNoMask !== true){


		var $newMaskField = $("<input>");
		$newMaskField.attr({
			"id" : this.config.id+"temp",
			"type" : "text",
			"value" : value
		});
		$newMaskField.mask(this.config.mask);

		value = $newMaskField.val();
		$newMaskField.remove();
	}
	
	this.config.value = value;
	
	var domObject = byid(this.config.id);
	if (domObject) {
		if (readonly) {
			domObject.innerHTML = value;
		} else {
			domObject.value = value;
			if(!this.config.value){
				$(domObject).trigger("clearmask");
			}
		}
	}
	
	if( getSideDefaults("support-changed-event-on-setvalue") ){
		this.bf.fire("changed");
	}
};

BC.prototype.saveState = function() {
	var raw = this.config.raw;
	this.config.raw = false;
	this.config.value = this.getValue();
	this.config.raw = raw;
};

/**
 * @function focus
 * @description Odağı maskfield'a getirir.
 */
BC.prototype.focus = function() {
	$$txt = $$.byid(this.config.id);
	if ($$txt) {
		$$txt.focus();
	}
};

BC.prototype.destroybc = function(){
	$("#" + this.config.id).unmask().off().unbind("maskfield");
};

BC.prototype.render = function($container) {
	var regex = "", bc=this, bf=bc.bf, config=bc.config;
	if (config.validation && config.validation.regex) {
		regex = config.validation.regex;
	}
	var readonly = bc.isParentReadonly() || bf.isReadonly();
	if (readonly) {
		var $newMaskField = $("<span>").addClass("csc-rospan");
		$newMaskField.attr({id : config.id});
		
		if (config.value === undefined || config.value === null || config.value === "") {
			$newMaskField.html(config.roEmptyValue || "");
		} else {
			if(config.roNoMask === true){
				$newMaskField.html(bc.getRawValue(config.value));
			} else {
				$newMaskField.html(config.value);
			}
		}
		if (!inDesigner(bf) && bc.clickBinded && !bf.isDisabled()) {
			$newMaskField.addClass("csc-textbox-linked");
		}
		if(!config.style || !config.style.whiteSpace){
			$$.css($newMaskField[0], "white-space", "normal");
		}
		if(config.style && config.style.whiteSpace == "non"){
			$$.css($newMaskField[0], "white-space", "");
		}
		if (inDesigner(bf)) {
			$newMaskField.css("display", "");
			$newMaskField.html(config.roEmptyValue || "Readonly").addClass("csc-readonly");
		}
	} else {
		var mask = config.maskAnkara === undefined ? false : config.mask;
		var maxlength = config.maxlength === undefined ? false : config.maxlength;
		// Create MaskField
		var $newMaskField = $("<input>");
		// Set ID, Disabled and Type Attributes if exists

		$newMaskField.attr({
			"id" : config.id,
			"type" : "text",
			"maxlength" : maxlength,
			"value" : config.value,
			"tabindex": config.tabIndex,
			placeholder: config.placeholder
		});

		$newMaskField.bind("keypress.maskfield", function(e){
				if (e.keyCode == 10 || e.keyCode == 13) {//keyCode is 10 if ctrl+enter in chrome
					SIDENavigator.setEvent(e);
					bc.bf.fire("onEnterPressed");
				}
		});
		
		if(bf.isDisabled()){
			$newMaskField.attr(config.disabledKey,config.disabledKey);
		}

		$newMaskField.focus(function() {

			if (this.createTextRange) {
				var range = this.createTextRange();
				range.move('character', 0);
				range.select();
			} else {
				this.setSelectionRange(0, 1);
			}
			bf.fire("onfocus");
		});

		// Set Mask to MaskField
		if (config.mask) {
			$newMaskField.mask(config.mask, {
				notclearvalue : config.notclearvalue,
				warning: config.warning,
				warningMsg: config.warningMsg,
				required: bf.isRequired(),
				callback : function() {
					bf.fire("maskerror");
				}
			});
		}
		if (bf.isRequired()) {
			$newMaskField.addClass("csc-required");
		}
		bc.applyInlineValidation($newMaskField[0]);
		if(config.value){
			$newMaskField.val(config.value);
		}
	}

	$newMaskField.addClass("csc-maskfield");
	
	if(config.rawCopy){
		$newMaskField[0].oncopy = function(e) {
			e.preventDefault();
			e.clipboardData.setData("text/plain",bc.getRawValue());
		};
	}

	checkAndSetCss($newMaskField, "display", config.visible ? "" : "none");
	$newMaskField.css(config.style || {});

	// Design Time da visible yap
	if (inDesigner(bf)) {
		$newMaskField.css("display", "");
	}

	if (config.cssClass) {
		$newMaskField.addClass(config.cssClass);
	}

	$container.appendChild($newMaskField[0]);
};

BC.prototype.bindEvent = function(eventName, callback) {
	var id=this.config.id;
	if (eventName == "changed") {
		var dom = $$.byid(id);
		if (dom) {
			dom.onchange = function(){
				if(!this.csFireChange){
					return;//2 kez changed fire etme hatası bug fix
				}
				this.csFireChange=null;
				callback();
			};
		}
	} else if (eventName == "blur") {
		var dom = $$.byid(id);
		if (dom) {
			$$.bindEvent(dom, "blur", callback);
		}
	} else if (eventName == "selected") {
		this.clickBinded = true;
		var dom = byid(id);
		if (dom) {
			dom.onclick = callback;
			if (dom.tagName == "SPAN" && !this.bf.isDisabled()) {
				$$.addClass(dom, "csc-textbox-linked");
			}
		}
	}
};

})(window);
/****************************=csc-currency.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-CURRENCY
 * @author Murat Ozudogru 05.2013
 */
function Definition(CS) {
	this.DEFAULTS = {
		allowNegative: false,
		allowZero: false,
		roEmptyValue: "-----",
		focusable: true,
		disabledKey: "disabled"
	};

	this.BaseBF = "BASIC";
	this.METHODS = ["focus", "setDefaultValue(value)", "setMaxValue(value)", "changeFormat(currencyUnit, thousandSeperator, decimalSeperator, decimalLength)"];
	this.EVENTS = [ "changed", "selected", "blur" ];
	this.DEPENDENCIES = [
		{"name": "jquery-autonumeric", "version": "1.9.7"}
	];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-CURRENCY", def);

var BC = def.Type;

BC.prototype.focus = function() {
	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};
BC.prototype.init =function () {
	var bc =this, config =bc.config;
	if(!config.thousandSeperator && config.decimalSeperator){
		var LOCALE_MAP = {
			tr: {
				thousandSeperator: ".",
				decimalSeperator:","
			},
			en: {
				thousandSeperator: ".",
				decimalSeperator:","
			},

		}
		var locale = SSession.getAny("LOCALE_CURRENCY", "LOCALE") || window.sideLang;
		config.thousandSeperator = LOCALE_MAP[locale].thousandSeperator;
		config.decimalSeperator = LOCALE_MAP[locale].decimalSeperator;
	}
	if(config.maxValue < 0){
		config.value = config.maxValue;
	}
};

/**
 * @description Number bileşene bir değer verilmediği durumda bileşenin varsayılan değeri belirler.
 * @function setDefaultValue
 * @param [value] alana verilen varsayılan değer
 */
BC.prototype.setDefaultValue = function(value) {
	this.config.defvalue = value;
};

/**
 * @description Sets max value limit of input.
 * @function setMaxValue
 * @param [value] max value
 */
BC.prototype.setMaxValue = function(value) {
	this.config.maxValue = value;
	if(this.config.maxValue < 0){
		var value = this.config.value;
		if(value === undefined || value === null || value === ""){
			this.config.value = this.config.maxValue;
		}
	}
	this.reRender();
};

BC.prototype.getSortType = function() {
	if(this.config.decimalSeperator == ","){
		return "curr1";
	}
	return "curr2";
};

/**
 * @function checkValue
 * @description autonumeric 3th party kütüphanesinden alınmıştır, getValue metodunda read only değer dönerken kullanılır.
 * @param [value]
 */
BC.prototype.checkValue = function(value) {
	if(value === undefined){
		return;
	}
	value += "";

	var decimal = value.indexOf('.');
	if (decimal !== -1) {
		if (decimal === 1 && value.charAt(0) === '0') {
			value = +value;
			if (value < 0.000001 && value > 0) {
				value = (value + 1).toString();
				value = value.substring(1);
			}
			if (value < 0 && value > -1) {
				value = (value - 1).toString();
				value = '-' + value.substring(2);
			}
			value = value.toString();
		} else {
			var parts = value.split('.');
			if (parts[1] !== undefined) {
				if (+parts[1] === 0) {
					value = parts[0];
				} else {
					parts[1] = parts[1].replace(/0*$/, '');
					value = parts.join('.');
				}
			}
		}
	}
	return value.replace(/^0*(\d)/, '$1');
};

BC.prototype.getValue = function() {
	var bc=this,bf=bc.bf,config=bc.config;
	var $el = $("#" + config.id);
	var readonly = bf.isReadonly();
	if($el.length && !readonly){
		config.value = $el.autoNumeric('get');
	}

	var value = config.value;
	if(config.defvalue !== undefined && (value === null || value === undefined || value === "")){
		value = config.defvalue;
	}
	if(!$el.length || readonly){
		var decimalLen = config.decimalLength || ( config.autoDecimalLength ? "0": "2" );
		if (parseInt(decimalLen) < 0 || config.autoDecimalLength){
			decimalLen = "0";
		}

		var $tmpInput=$($$.create("INPUT")).autoNumeric("init", {aSep:config.thousandSeperator,aDec:config.decimalSeperator,mDec:decimalLen,autoDecimalLength:config.autoDecimalLength,wEmpty:"zero",lZero:"deny",aForm:true,vMax:"9000000000000000000",vMin:"-9000000000000000000"})
		$tmpInput.autoNumeric("set", value === undefined ? "":value);
		var res = $tmpInput.autoNumeric("get");
		$tmpInput.autoNumeric("destroy");
		return res;
	}
	if(value === null){
		return value;

	}
	return value;
};

BC.prototype.setValue = function(value) {
	if (value === null || undefined === value) {
		if(this.config.maxValue < 0){
			value = this.config.maxValue;
		} else {
			value = "";
		}
	}

	this.config.value = value;
	var $$el = $$.byid(this.config.id);
	if(this.config.badDataBehavior == "exception" || this.config.badDataBehavior == undefined){
		if($$el){
			try{
				$($$el).autoNumeric('set', value);
			}catch(ex){
				console.error(ex);
			}
		}
	};
	if(this.config.badDataBehavior == "omit"){
		if($$el){
			return value = 0;
		}

	}
	if(this.config.badDataBehavior == "omit&showError"){
		if($$el){
			CSPopupUTILS.MessageBox("Max. değerden büyük değer girdiniz", {error: true});
			return value = 0;
		}


	}


};

/*BC.prototype.getText = function() {
	var bc = this;
	var config = bc.config;
	var container = document.getElementById(config.id);
  if(container){
  	return container.value;
  }
};*/

BC.prototype.isEmpty = function(omitDefaultValue){
	var value = parseFloat(this.getValue());
	if(omitDefaultValue && value == 0){
		return true;
	}
	if(this.config.allowZero){
		return false;
	}
	return value == 0;
};

BC.prototype.saveState = function() {
	this.config.value = this.getValue();
};

BC.prototype.destroybc = function(){
	$("#" + this.config.id).autoNumeric("destroy");
	$("#" + this.config.id).off();
};

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config;
	var readonly = bf.isReadonly();
	var cunit = config.currencyUnit || "";
	var punit = config.currencyUnitPosition == "right" ? "s" : "p";//p || s
	var tousanSep = config.thousandSeperator;
	var decSep = config.decimalSeperator;
	if(config.autoDecimalLength == "false"){
		config.autoDecimalLength = false;
	}
	var decimalLen = config.decimalLength || ( config.autoDecimalLength ? "0": "2" );
	if (parseInt(decimalLen) < 0 || config.autoDecimalLength) {
		if(config.maxDecLength) {
			decimalLen = config.maxDecLength;
		}
		else {
			decimalLen = "0";
		}
	}

	var max = this.config.max;

	if(config.maxValue){
		max = ""+config.maxValue;
		if (config.maxValue < 0) {
			max = "999999999999999999.99";
			config.allowNegative = true;
		}
	} else {
		if (!max || max < 1) {
			max = "999999999999999999.99";
		} else {
			var bdMax = new BigDecimal(max.toString());
			var bdTen = new BigDecimal("10");
			var a = bdTen.pow(bdMax);
			var b = (new BigDecimal("1")).divide(bdTen.pow(new BigDecimal(decimalLen)), new MathContext(100))
			bdMax = a.subtract(b);
			max = bdMax.toString();
		}
	}

	var min = 0;
	if (config.allowNegative) {
		if (config.maxValue < 0) {
			min = "-9999999999999";
		} else {
			min = (new BigDecimal("0")).subtract(new BigDecimal(max));
		}
	}

	if (readonly) {
		var $span = $("<span>");
		$span.attr({id : config.id});
		$span.css(config.style || {});
		$span.addClass("csc-rospan").addClass("csc-currency").addClass(config.cssClass);
		if(config.textAlign){
			$span.addClass("csc-currency-"+config.textAlign);
		}
		if(!inDesigner(bf) && bc.clickBinded && !bf.isDisabled()){
			$span.addClass("csc-textbox-linked");
		}

		$span.attr({
			"data-a-sign" : cunit,
			"data-p-sign" : punit,
			"data-a-sep" : tousanSep,
			"data-a-dec" : decSep,
			"data-m-dec" : decimalLen,
			"data-v-max" : max,
			"data-v-min" : min,
			"data-autoDecimalLength" : config.autoDecimalLength
		});
		$span.autoNumeric('init');

		if (config.value !== undefined && config.value !== null && config.value !== "") {
			try {
				$span.autoNumeric('set', config.value);
			} catch(ex){
			}
		} else {
			$span.html(config.roEmptyValue || "");
		}
		if (inDesigner(bf)) {
			$span.css("display", "");
			$span.html(config.roEmptyValue || "Readonly").addClass("csc-readonly");
		}

		$container.appendChild($span[0]);
	} else {
		var $newTextBox = $("<input>");
		// Set ID, Type, Value And Disabled Attributes if exists

		$newTextBox.attr({
			id : config.id,
			type : "text",
			size : config.size,
			value : config.value,
			tabindex: config.tabIndex,
			title: config.tips,
			placeholder: config.placeholder,
			"data-a-sign" : cunit,
			"data-p-sign" : punit,
			"data-a-sep" : tousanSep,
			"data-a-dec" : decSep,
			"data-m-dec" : decimalLen,
			"data-v-max" : max,
			"data-v-min" : min,
			"data-w-empty" : "zero",
			"data-l-zero" : "deny",
			"data-a-form": true,
			"data-autoDecimalLength" : config.autoDecimalLength
		});

		if(bf.isDisabled()){
			$newTextBox.attr(config.disabledKey,config.disabledKey);
			$newTextBox.bind('copy cut paste', function (e) {
					$(this).val(this.val());
					return false;
			});
		}

		try {
			$newTextBox.autoNumeric('init');
		} catch (ex) {
			if(config.maxValue < 0){
				$newTextBox.attr("value", config.maxValue);
			} else {
				$newTextBox.attr("value", min);
			}
			$newTextBox.autoNumeric('init');
		}

		$newTextBox.addClass("csc-currency").addClass(config.cssClass);

		checkAndSetCss($newTextBox, "display", bf.isVisible() ? "" : "none");
		$newTextBox.css("text-align", "right");
		$newTextBox.css(config.style || {});

		if(config.holdFormat){
			$newTextBox.autoNumeric('set', 0);
		}
		
		$newTextBox.bind('change', function(event) {
			if(bc.bf.getParent().bcRef.typeName  === "CSC-TABLE" && bc.bf.getParent().bcRef.totalRow){
				bc.bf.getParent().bcRef.reCalculateTotalRow();
			}
		});
		if(config.maxValue < 0 ){
			$newTextBox.bind('blur', function() {
				if(bc.getValue() > config.maxValue){
					bc.setValue(config.maxValue);
				}
			});
		}

		$newTextBox.bind('mousedown', function() {
			if ($(this).autoNumeric('get') == 0){
				if(config.holdFormat){
					var a = "0.";
					for(var i=0; i<decimalLen; i++){
						a +="0";
					}
					$(this).autoNumeric('set', a);
				}else{
					$(this).autoNumeric('set', '');
				}
			}
		});

		if (inDesigner(bf)) {//Design Time da visible yap
			$newTextBox.css("display", "");
		}

		if (config.cssClass) {
			$newTextBox.addClass(config.cssClass);
		}
		if(bf.isRequired()){
			$newTextBox.addClass("csc-required");
		}
		bc.applyInlineValidation($newTextBox[0]);
		$container.appendChild($newTextBox[0]);
		if (config.addOn) {
			$$.addClass($container, "input_group");
			if (config.addOnText) {
				var addOntext = $$.create("span", null, ["csc-textbox-addon-text"]);
				addOntext.innerHTML = config.addOnText;
				if (config.addOnTextPosition === "right") {
					$container.appendChild(addOntext);
				} else {
					$container.insertBefore(addOntext, $container.childNodes[0]);
				}
			}
			if (config.addOnIcon) {
				var addOnIcon = $$.create("span", null, ["csc-textbox-addon-icon"]);
				addOnIcon.innerHTML = "<i class='fa " + config.addOnIcon + " '></i>";
				if (config.addOnIconPosition === "right") {
					$container.appendChild(addOnIcon);
				} else {
					$container.insertBefore(addOnIcon, $container.childNodes[0]);
				}
			}
		}
	}

};

/**
 * @function changeFormat
 * @description Currency alanının formatında değişiklik yapmak için kullanılır.
 * @param [currencyUnit] Currency alanınında gösterilecek olan string sembol bilgisidir. Örnek: " $ "
 * @param [thousandSeperator] Binlik dilimleri bölecek olan karakter bilgisidir. Örnek; " "
 * @param [decimalSeperator] Ondalık dilimi bölecek olan karakter bilgisidir. Örnek; ","
 * @param [decimalLength] Ondalık dilimin basamak sayısı bilgisidir. Örnek; 2
 */
BC.prototype.changeFormat = function(currencyUnit, thousandSeperator, decimalSeperator, decimalLength) {
	this.config.currencyUnit = currencyUnit;
    if(thousandSeperator){
        this.config.thousandSeperator = thousandSeperator;
    }
	if(decimalSeperator){
        this.config.decimalSeperator = decimalSeperator;
    }
    if(decimalLength){
        this.config.decimalLength = decimalLength;
    }
	this.reRender();
}

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "changed") {
		var bc=this,$$dom = byid(bc.config.id);
		if ($$dom) {
			$$dom.onchange = callback;
			if(!inDesigner(bc.bf) && $$dom.tagName == "SPAN" && !bc.bf.isDisabled()){
				$$.addClass($$dom, "csc-textbox-linked");
			}
		}
	} else if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	} else if (eventName == "blur") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onblur = callback;
		}
	}
};


})(window);
/****************************=csc-image.js=******************************/
(function(window, undefined) {
/** @class CSC-IMAGE */
function Definition(CS) {
	this.DEFAULTS = {
		tools : false
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "notify", "setBase64Data(mimetype, data, notrender)", "setSrc(src, dontUseResourceUrl)", "setTips(tips)" ];
	this.EVENTS = [ "changed", "selected", "ondrag", "ondrop", "ondownload", "onmouseover", "onmouseout" ];
	this.DISABLE_EVENTS = [ "selected" ];

	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-IMAGE", def);

var BC = def.Type;

/**
 * @function setSrc
 * @description Görüntünün kaynağını belirler.
 * @param [src] Görüntünün kaynağı
 * @param [dontUseResourceUrl] kaynağı belirlerken URL kullanılıp kullanılmaması durumunu belirler
 */
BC.prototype.setSrc = function(src, dontUseResourceUrl) {
	this.config.src = src;
	this.config.dontUseResourceUrl = dontUseResourceUrl;
	
	this.bf.rerender();
};

/**
 * @function setTips
 * @description Görüntünün üstüne gelip bekleyince beliren ipucunu ayarlar.
 * @param [tips] Görüntünün üstünde beliren ipucu
 */
BC.prototype.setTips = function(tips) {
	this.config.tips = tips;
	var $$img = $$.byid(this.config.id);
	if ($$img) {
		$$img.setAttribute("title", this.config.tips);
	}
};

/**
 * @function setBase64Data
 * @description Görüntünün Base64 cinsinden kodlanmış halini ayarlar.
 * @param [mimetype] Dosya kimlik tanımlayıcısı. Örn: "image/png", "image/jpeg"
 * @param [data] Base64 cinsinden kodlanmış veri
 * @param [notrender] Veriler değiştikten sonra görüntünün (image) render edilip edilmemesini belirler.
 */
BC.prototype.setBase64Data = function(mimetype, data, notrender) {
	if(mimetype == "fullpath"){
		this.config.src = data;
	} else {
		mimetype = mimetype || "image/png";
		this.config.src = "data:"+mimetype+";base64,"+data;
	}
	if (notrender) {
		return;
	}
	this.bf.rerender();
};

BC.prototype.setVisible = function(flag) {
	this.config.visible = flag;
	var $$dom = $$.byid(this.config.id);
	if($$dom){
		$$dom.style.display = (flag ? "" : "none");
	}
};

BC.prototype.render = function($container) {
	var bc = this;
	var title = this.config.tips || this.config.title;
	var moduleName = this.bf.getModuleName(), pm, $$div, $$img;
	var src = this.config.src;

	if(src && src.indexOf("base64") < 0 && this.config.dontUseResourceUrl !== false){
		src = SideModuleManager.getResourceUrl(moduleName, src);
	}

	if(SModules[moduleName]){
		pm = SModules[moduleName].pm;
	}

	if(this.config.sprite){
		src = ( window.sideRuntimeEnvironment === "prod" ? src : SUtil.addParamToUrl(src, "pm", pm) );
		$$img = $$.create("DIV", {"id": this.config.id, title: title, "draggable": (this.config.draggable ? "true" : "false"), "droppable": (this.config.droppable ? "true" : "false")}, ["csc-image", this.config.cssClass],
				{"background": "url("+src+") no-repeat",
				 "backgroundPosition": this.config.backgroudPos,
				 "backgroundSize": (this.config.spriteWidth || "")+" "+ (this.config.spriteHeight || "") });
	}else{
		src = src || "css/bc-style/img/iconNotAvaliable.png";
		if(src.indexOf("base64")<0){
			src = (["dev","designer","dashboard"].indexOf(window.sideRuntimeEnvironment) < 0 ? src : SUtil.addParamToUrl(src, "pm", pm) );
		}
		$$img = $$.create("IMG", {"id": this.config.id, src: src, title: title, "draggable": (this.config.draggable ? "true" : "false"), "droppable": (this.config.droppable ? "true" : "false"), }, ["csc-image", this.config.cssClass]);
	}
	
	if(this.config.progress){
		var $$progresDiv = $$.create("DIV", undefined, undefined, {textAlign: "center"}, $container);
		var $$progresImg = $$.create("IMG", {src: "css/bc-style/img/ajax-loader2.gif"}, undefined, undefined, $$progresDiv);
		var $$progresSpan = $$.create("SPAN", undefined, undefined, {lineHeight: "16px"}, $$progresDiv);
		$$progresSpan.innerHTML = SideMLManager.get(this,"imageLoading");
	}
	
	if(this.config.msg && !this.config.tools){
		$$div = $$.create("DIV", {id: this.config.id}, "csc-notify-div");
		if(!this.config.style || !this.config.style.width){
			$$div.innerHTML = SideMLManager.get(this,"notifyError");
			$container.appendChild($$div);
			return;
		}
		var $$span = $$.create("SPAN");
		$$span.innerHTML = this.config.msg;
		$$span.style.left = (parseInt(this.config.style.width, 10)-25)/2 +"px";
		$$div.appendChild($$span);
		$$div.appendChild($$img);
	}
	if(this.config.tools){
		$$div = $$.create("DIV", {id: this.config.id}, "csc-image-tools");
		$$divcontainer = $$.create("DIV", {id: this.config.id+"-cont"}, "csc-image-container");
		$$.css($$div, this.config.style);
		$$divcontainer.appendChild($$img);
		$$div.appendChild($$divcontainer);
		
		this.angle = this.angle || 0;
		
		var $$iconsDiv = $$.create("DIV", {id: this.config.id+"-icons"}, "csc-image-tools-icons");
		var $$rotateLeft = $$.create("SPAN", {title: "Sola çevir"}, "csc-image-tools-rleft");
		var $$rotateRight = $$.create("SPAN", {title: "Sağa çevir"}, "csc-image-tools-rright");
		var $$zoomIn = $$.create("SPAN", {title: "Büyüt"}, "csc-image-tools-zin");
		var $$zoomOut = $$.create("SPAN", {title: "Küçült"}, "csc-image-tools-zout");
		var $$save = $$.create("SPAN", {title: "Kaydet"}, "csc-image-tools-save");
		var $$print = $$.create("SPAN", {title: "Yazdır"}, "csc-image-tools-print");
		
		$$print.onclick = function(){
			SIDEUtil.print(bc.bf,"");
		};
		
		$$save.onclick = function(){
			bc.bf.fire("ondownload");
		};
		
		$$rotateRight.onclick = function(){
			var old = bc.angle;
			bc.angle = (bc.angle + 90) % 360;
			$$.rmClass($$img, "rotate-left-"+old);
			if(bc.angle){
				$$.addClass($$img, "rotate-left-"+bc.angle);
			}
			if(bc.angle === 90 || bc.angle === 270){
				$$divcontainer.style.height = $$img.width +"px";
				$$divcontainer.style.width = $$img.height +"px";
			}else{
				$$divcontainer.style.height = $$img.height +"px";
				$$divcontainer.style.width = $$img.width +"px";
			}
		};
		
		$$rotateLeft.onclick = function(){
			var old = bc.angle;
			bc.angle = Math.abs((360+(bc.angle-90)) % 360);
			$$.rmClass($$img, "rotate-left-"+old);
			if(bc.angle){
				$$.addClass($$img, "rotate-left-"+bc.angle);
			}
			if(bc.angle === 90 || bc.angle === 270){
				$$divcontainer.style.height = $$img.width +"px";
				$$divcontainer.style.width = $$img.height +"px";
			}else{
				$$divcontainer.style.height = $$img.height +"px";
				$$divcontainer.style.width = $$img.width +"px";
			}
			
		};
		
		$$zoomIn.onclick = function(){
			$$img.style.width = parseInt($$img.offsetWidth + $$img.offsetWidth*0.20)+"px";
			$$img.style.height = parseInt($$img.offsetHeight + $$img.offsetHeight*0.20)+"px";
		};
		
		$$zoomOut.onclick = function(){
			$$img.style.width = parseInt($$img.offsetWidth - $$img.offsetWidth*0.20)+"px";
			$$img.style.height = parseInt($$img.offsetHeight - $$img.offsetHeight*0.20)+"px";
		};
		
		$$div.appendChild($$iconsDiv);
		$$iconsDiv.appendChild($$rotateLeft);
		$$iconsDiv.appendChild($$rotateRight);
		$$iconsDiv.appendChild($$zoomIn);
		$$iconsDiv.appendChild($$zoomOut);
		$$iconsDiv.appendChild($$save);
		$$iconsDiv.appendChild($$print);
		
		var onLoadFunction = function(img){
			$$img = img || $$img;
			var containerWidth = $$div.offsetWidth;
			var containerHeight = $$div.offsetHeight;
			var imgWidth = $$img.offsetWidth;
			var imgHeight = $$img.offsetHeight;
			if(imgWidth > containerWidth || imgHeight > containerHeight){
				if(imgHeight / containerHeight > imgWidth / containerWidth){
					imgWidth = Math.ceil(imgWidth*(containerHeight/imgHeight));
					imgHeight = containerHeight;
				} else {
					imgHeight = Math.ceil(imgHeight*(containerWidth/imgWidth));
					imgWidth = containerWidth;
				}
				$$img.style.width = imgWidth+"px";
				$$img.style.height = imgHeight+"px";
			} else if(bc.config.fill){
				if(containerWidth/imgWidth < containerHeight/imgHeight){
					var rate = containerWidth/imgWidth;
					$$img.style.width = containerWidth+"px";
					$$img.style.height = Math.floor(imgHeight*rate)+"px";
				} else {
					var rate = containerHeight/imgHeight;
					$$img.style.height = containerHeight+"px";
					$$img.style.width = Math.floor(imgWidth*rate)+"px";
				}
			}
			$$img.style.left = parseInt((containerWidth-imgWidth)/2)+"px";
			$$img.style.top = parseInt((containerHeight-imgHeight)/2)+"px";
			
			if(bc.config.progress){
				$container.removeChild($$progresDiv);
			}
		};
		
		if(this.config.sprite){
			var img = new Image();
			img.src = src;
			img.onload = function(){ onLoadFunction(this); };
		}
		
		$$img.onload = function(){ onLoadFunction(); };
		
	} else {
		$$.css($$img, this.config.style);
		if(this.config.progress){
			
			if(this.config.sprite){
				var img = new Image();
				img.src = src;
				img.onload = function(){
					$container.removeChild($$progresDiv);
				};
			}
			
			$$img.onload = function(){
				$container.removeChild($$progresDiv);
			};
		}
	}
	
	if(this.config.draggable){
		$$img.ondragstart = function() {
			bc.bf.fire("ondrag");
		};
	}
	if(this.config.droppable){
		$$img.ondrop = function() {
			bc.bf.fire("ondrop");
		};
		$$img.ondragover = function(event) {
			event.preventDefault();
		};
	}
	
	if(this.selectable){
		$$.addClass($$img, "selectable");
	}
	
	$$img.style.display = this.bf.isVisible() || inDesigner(this.bf) ? "" : "none";// Design Time da visible yap
	if($$div){
		$container.appendChild($$div);
	} else {
		$container.appendChild($$img);
	}
	
};

/**
 * @function notify
 * @description Görüntünün üstünde bir bildirim çıkmasını sağlar. Bunun için genişlik(width) özelliğinin verilmiş olması gerekmektedir.
 * @param [message] Bildirimde yazacak mesaj
 */
BC.prototype.notify = function(message){
	this.config.msg = message;
	this.reRender();
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "changed") {
		var $$dom = $$.byid(this.config.id);
		if ($$dom) {
			$$dom.onchange = callback;
		}
	} else if (eventName == "selected") {
		this.selectable = true;
		var $$dom = $$.byid(this.config.id);
		if ($$dom) {
			$$dom.onclick = callback;
			$$.addClass($$dom, "selectable");
		}
	} else if (eventName == "onmouseover") {
		var $$dom = $$.byid(this.config.id);
		if ($$dom) {
			$$dom.onmouseover = callback;
		}
	} else if (eventName == "onmouseout") {
		var $$dom = $$.byid(this.config.id);
		if ($$dom) {
			$$dom.onmouseout = callback;
		}
	}
};
})(window);
/****************************=csc-datetime.js=******************************/
(function(window, undefined) {
/** CSC-DATE-TIME* */
function Definition(CS) {
    this.DEFAULTS = {
        cls: "csc-tarih",
        focusable: true,
        labelPosition: "inherited",
        returnFormat: "yyyy-mm-dd HH:MM",
        disabledKey: "disabled",
			iconWidth: 32
    };

	this.BaseBF = "BASIC";
	this.METHODS = ["getText", "setMaxDate(date)", "setMinDate(date)", "setTips(tips)"];
	this.EVENTS = ["changed", "selected", "blur"];
	this.DEPENDENCIES = [
		{"name": "jquery-ui", "version": "1.12.0"},
		{"name": "jquery-ui-timepicker", "version": "1.3"},
		{"name": "jquery-maskedinput", "version": "1.3"}
	];

	this.Type = function () {
		this.ddf = "dd/mm/yyyy HH:MM";//Default date-time format
	};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-DATETIME", def);

var BC = def.Type;

BC.prototype.init = function () {
	var bc = this, config = bc.config;
  if (config.initToday) {
    config.value = SIDEDateUtil.getFormattedDateByDate(new Date(), this.config.dateFormat || this.ddf);
  }
	if (!config.dateFormat) {
  	var LOCAL_MAP = {
  		tr:{
  			dateFormat:"dd/mm/yyyy HH:MM"
		  },
		  en:{
  			dateFormat:"mm/dd/yyyy HH:MM"
		  },
		  az: {
  			dateFormat:"mm.dd.yyyy HH:MM"
		  },
		};
		var locale = SSession.getAny("LOCALE_DATE", "LOCALE") || window.sideLang;
		config.dateFormat = LOCAL_MAP[locale].dateFormat || bc.ddf;
	}
  this.emptyMask = (this.config.dateFormat || this.ddf).replace("yyyy", "____").replace("mm", "__").replace("dd", "__").replace("MM", "__").replace("HH", "__");
};

BC.prototype.getRawValue = function() {
	return this.getValue("yyyymmddHHMM");
};

BC.prototype.getValue = function () {
    var value = this.getText();
    if (value.indexOf('_') >= 0) {//mask geliyor
        return "";
    }
    if (stringTrim(value) == "" || !this.config.returnFormat || this.config.returnFormat == "same") {
        return value;
    }
    return SIDEDateUtil.getFormattedDate(value, this.config.dateFormat || this.ddf, this.config.returnFormat || this.config.dateFormat || this.ddf);
};

BC.prototype.setValue = function (value) {
    if (value === undefined || value === null) {
        value = "";
    }

    var format = this.config.dateFormat;
    if (this.config.returnFormat) {
        if (this.config.returnFormat == "same") {
            format = this.config.dateFormat || this.ddf || this.config.returnFormat;
            this.config.returnFormat = format;
        } else {
            format = this.config.returnFormat;
        }
    }

    // Date Valid değilse hata mesajı atıp dön;
    if (stringTrim(value) != "" && !SIDEDateUtil.isValidDate(value, format)) {
        return;
    }

    value = SIDEDateUtil.getFormattedDate(value, format, this.config.dateFormat || this.ddf);
    this.config.value = value;
    var domObject = byid("date-" + this.config.id);
    if (domObject) {
        domObject.value = value;
    } else {// readonly durumunu kontrol et
        var domObject = byid(this.config.id);
        if (domObject) {
            domObject.innerHTML = value + this.getPrettyDate(value);
        }
    }

    if ( getSideDefaults("support-changed-event-on-setvalue") ) {
        this.bf.fire("changed");
    }
};

/**
 * @function setTips
 * @description Set the tooltip of component
 * @param  {string} [tips] tooltip text
 */
BC.prototype.setTips = function (tips) {
    this.config.tips = tips || "";
    var $$p = $$.byid(this.config.id);
    if ($$p) {
        $$p.setAttribute("title", this.config.tips);
    }
};

BC.prototype.saveState = function () {
    var domObject = byid("date-" + this.config.id) || byid(this.config.id);
    if (!domObject) {
        return;
    }
    this.config.value = this.getText();
};

/**
 * @function getText
 * @description Returns the displayed text on component
 */
BC.prototype.getText = function () {
    var domObject = byid("date-" + this.config.id);
    var value = this.config.value || "";
    if (domObject) {
        value = domObject.value;
    } else {// readonly durumunu kontrol et
        var domObject = byid(this.config.id);
        if (domObject) {
            value = domObject.innerHTML;
        }
    }
    return value;
};

/**
 * @function setMaxDate
 * @description Seçilebilecek en geç tarihi ayarlar.
 * @param [date] Girilebilecek en geç tarih. Formatı yyyymmdd olmalı.
 */
BC.prototype.setMaxDate = function (date) {
    if (!(date instanceof Date)) {
        date = SIDEDateUtil.getDateObjFromString(date, "yyyymmdd");
    }
    this.maxDate = date;
    var $tarih = $(this.config.id);
    if ($tarih) {
        $tarih.datepicker("option", "maxDate", this.maxDate);
    }
};

/**
 * @function setMinDate
 * @description Seçilebilecek en erken tarihi ayarlar.
 * @param [date] Girilebilecek en erken tarih. Formatı yyyymmdd olmalı.
 */
BC.prototype.setMinDate = function (date) {
    if (!(date instanceof Date)) {
        date = SIDEDateUtil.getDateObjFromString(date, "yyyymmdd");
    }
    this.minDate = date;

    var $tarih = $(this.config.id);
    if ($tarih) {
        $tarih.datepicker("option", "minDate", this.minDate);
    }
};

BC.prototype.setVisible = function (flag) {
    this.config.visible = flag;
    $("#" + this.config.id).css("display", flag ? "" : "none");
};

BC.prototype.getPrettyDate = function (val) {
    if (this.config.pretty) {
        var format = this.config.dateFormat || this.ddf;
        var dateObj = SIDEDateUtil.getDateObjFromString(val, format);
        var retStr = (SIDEDateUtil.prettyDate(dateObj) || "");
        if (retStr) {
            return " ( " + retStr + " )";
        }
    }
    return "";
};

BC.prototype.destroybc = function () {
	var bc=this, config=bc.config;
	var $tarih = $("#date-" + config.id);
	if(!bc.selectEvent && $tarih.datepicker("widget").is(":visible")){
		bc.fireDestroy=true;
		bc.destroys = bc.destroys || [];
		bc.destroys.push($tarih);
		return;
	}
	if(bc.selectEvent){
		window.setTimeout(function(){
			for(var i=0; bc.destroys && i<bc.destroys.length ;i++){
				bc.destroys[i].datepicker("destroy").unmask().off();
				bc.destroys = [];
			}
		}, 1);
	} else {
		for(var i=0; bc.destroys && i<bc.destroys.length ;i++){
			bc.destroys[i].datepicker("destroy").unmask().off();
		}
		bc.destroys = [];
		$tarih.datepicker("destroy").unmask().off();
	}
};

BC.prototype.render = function ($container) {
	var bc = this, bf = bc.bf, config = bc.config;
	var readonly = bc.isParentReadonly() || bf.isReadonly();
	if(readonly) {
		var $tarih = $("<span>").attr("id", config.id).addClass("csc-rospan");
		if(config.cssClass) {
			$tarih.addClass(config.cssClass);
		}
		if(config.value) {
			var text = config.value || "";
			if(text.indexOf("(") == -1) {
				text = text + bc.getPrettyDate(text);
			}
			$tarih.append(text);
		}
		if(inDesigner(bf)) {
			var text = "01/01/1901 00:00";
			if(text.indexOf("(") === -1) {
				text = text + bc.getPrettyDate(text);
			}
			$tarih.html(text);
		}
		if(config.tips) {
			$tarih.attr("title", config.tips);
		}
		$container.appendChild($tarih[0]);
	} else {
		var disabled = bf.isDisabled();
		var dateFormat = config.dateFormat || this.ddf;
		var $tarihDiv = $("<div>").attr("id", config.id).addClass("csc-tarih-container");
		if(config.style && config.style.width) {
			var size = parseInt(config.style.width.split("px")[0], 10);
			if(config.iconWidth){
				size = size + parseInt(config.iconWidth, 10);
			}
			$tarihDiv.css("min-width", size + "px");
		}

		if(config.tips) {
			$tarihDiv.attr("title", config.tips);
		}
		var placeHolder =config.placeholder;
		if( config.placeholder == "auto"){
			placeHolder = dateFormat;
			if(window.sideLang == "tr"){
				placeHolder = placeHolder.replace("dd","gg").replace("mm","aa").replace("HH","SS" ).replace("MM","DD");
			}
		}
		var $tarih = $("<input>").attr({
			id: "date-" + config.id,
			type: "text",
			placeholder:placeHolder ||  config.placeholder,
			value: config.value || ""
		}).css(config.style || {}).css("display", config.visible ? "" : "none").addClass("csc-tarih").addClass(config.cssClass);
		if(disabled || config.onlyPicker) {
			$tarih.attr(config.disabledKey, config.disabledKey);
		}

		if(bf.isRequired()) {
			$tarih.addClass("csc-required");
		}

		$tarihDiv.append($tarih);
		$container.appendChild($tarihDiv[0]);

		if(config.immError) {
			$$.bindEvent($tarih[0], "blur", function () {
				if($tarih.datepicker("widget").is(":visible")) {
					return;
				}
				var value = $tarih[0].value;
				if(value == "" || value == bc.emptyMask) {
					$tarih.val("");
					return;
				}
				var error = bc.validate();
				if(error) {
					$tarih.val("");
					setMask();
					CSPopupUTILS.MessageBox(error);
				}
			});
		}
		if(SModules[this.bf.getModuleName()]){
			var pm = SModules[this.bf.getModuleName()].pm;
		}
		if ( config.iconSource && (config.iconSource.indexOf("pm=") === -1) ) {
			config.iconSource = (["dev","designer","dashboard"].indexOf(window.sideRuntimeEnvironment) < 0 ? config.iconSource : SUtil.addParamToUrl(config.iconSource, "pm", pm) );
		}
		if(!disabled) {
			var timeformat = "HH:mm";
			if(dateFormat.indexOf("SS") >= 0) {
				timeformat = "HH:mm:ss";
			}
			var hours, minutes, secs;
			if(config.defTime && !config.value) {
				try {
					hours = config.defTime.substring(0, 2);
					minutes = config.defTime.substring(3, 5);
					secs = config.defTime.substring(6, 8);
				} catch (ex) {
				}
			}

			if(config.dateFormat === "HH:MM:SS") {
				// timepicker
				var configObj = {
					showOn: "button",
					hour: hours,
					minute: minutes,
					second: secs,
					timeFormat: timeformat,
					changeMonth: true,
					changeYear: true,
					buttonText: bc.config.tips || "",
					buttonImage: config.iconSource || "css/bc-style/img/calendar.png",
					buttonImageOnly: true,
					onSelect: function (date) {
						$tarih.val(date);
						$tarih.blur();
					},
					onClose: function () {
						bf.fire("changed");
						bc.selectEvent =true;
						if(bc.fireDestroy) {
							bc.destroybc();
						}
						bc.selectEvent =false;
					}
				};
				if(bc.config.rejectWeekend){
					configObj.beforeShowDay = function(date) {
						if($.datepicker.noWeekends(date)){
							return $.datepicker.noWeekends(date)
						}
						return [true, ""];
					};
				}
				$tarih.timepicker(configObj);
			} else {
				var configObj = {
					showOn: "button",
					hour: hours,
					minute: minutes,
					second: secs,
					timeFormat: timeformat,
					changeMonth: true,
					changeYear: true,
					buttonImage: config.iconSource || "css/bc-style/img/calendar.png",
					buttonImageOnly: true,
					buttonText: config.tips || "",
					yearRange: config.yearRange,
					reverseYearRange: config.reverseYears,
					onSelect: function (date) {
						$tarih.val(date);
						$tarih.blur();
					},
					onClose: function () {
						bf.fire("changed");
						bc.selectEvent =true;
						if(bc.fireDestroy) {
							bc.destroybc();
						}
						bc.selectEvent =false;
					}
				};
				if(bc.config.rejectWeekend){
					configObj.beforeShowDay = function(date) {
						if($.datepicker.noWeekends(date)){
							return $.datepicker.noWeekends(date)
						}
						return [true, ""];
					};
				}
				$tarih.datetimepicker(configObj);
			}
			$tarih.focus(function () {
				if(this.createTextRange) {
					var range = this.createTextRange();
					range.move('character', 0);
					range.select();
				} else {
					this.setSelectionRange(0, 1);
				}
			});
			this.applyInlineValidation($tarih[0], $tarihDiv[0]);
		}

		// Set Mask
		function setMask() {
			var mask = dateFormat.replace("dd", "99").replace("mm", "99").replace("yyyy", "9999").replace("HH", "99").replace("MM", "99").replace("SS", "99");
			$tarih.mask(mask);
		}

		setMask();

		$tarih.datepicker("option", "minDate", this.minDate);
		$tarih.datepicker("option", "maxDate", this.maxDate);
	}
};

BC.prototype.renderRequired = function (flag) {
    if (!this.config.validation) {
        return;
    }
    var $$dom = $$.byid("date-" + this.config.id);
    if (!$$dom) {
        return;
    }
    if (this.config.validation.req) {
        $$.addClass($$dom, "csc-required");
    } else {
        $$.rmClass($$dom, "csc-required");
    }
};

BC.prototype.validate = function () {
    var value = stringTrim(this.getText());
    var format = this.config.dateFormat || this.ddf;
    if (value != "" && value != this.emptyMask) {
        return SIDEDateUtil.checkDate(value, format, this.config.rejectWeekend, this.config.label);
    }
};


BC.prototype.renderInlineVal = function ($val) {
    if (!this.bf.isReadonly()) {
        var $tarihDiv = $("#" + this.config.id);
        $tarihDiv.append($val);
    }
};

BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "changed") {
		var dom = byid("date-" + this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onchange = function () {
				if($(dom).datepicker( "widget" ).is(":visible")){
					return;
				}
				try {
					BFEngine.a();
					callback();
				} finally {
					BFEngine.r();
				}
			};
		}
	} else if(eventName == "selected") {
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
			var bc = this;
			if(!inDesigner(bc.bf) && dom.tagName == "SPAN" && !bc.bf.isDisabled()) {
				$$.addClass(dom, "csc-textbox-linked");
			}
		}
	} else if(eventName == "blur") {
		var dom = byid("date-" + this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onblur = callback;
		}
	}
};


})(window);
/****************************=csc-seperator.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-SEPERATOR
 * @classdesc Seperator.
 * @author Mahmut Yıldız, Mete Işık
 */
function Definition(CS) {
	this.DEFAULTS = {};

	this.BaseBF = "NON-BUSINESS";

	this.METHODS = [];
	this.EVENTS = [ "changed", "selected" ];

	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-SEPERATOR", def);

var BC = def.Type;

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config, size = config.size || 2;
	var layout = bf.$CS$.parent.bcRef.typeName;
	var $$newSeperator = $$.create("DIV", {"id": config.id}, "csc-seperator", config.style);
	$$newSeperator.style.display = config.visible ? "" : "none";
	if (config.cssClass) {
		$$.addClass($$newSeperator, config.cssClass);
	}
	
	// Design Time da visible yap
	if (inDesigner(bf)) {
		$$newSeperator.style.display = "";
	}

	if(config.fill === "line"){
		$$newSeperator.style.background = "url('css/bc-style/img/sep-hor-back.png') center repeat-x";
		$$.addClass($$newSeperator, "fill-line");
	}
	if (layout == "CSC-HORIZONTAL") {
		$$.css($$newSeperator, "height", "10px");
		$$.css($$newSeperator, "width", size);
	} else {
		$$.css($$newSeperator, "width", "100%");
		$$.css($$newSeperator, "height", size);
	}

	$container.appendChild($$newSeperator);
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "changed") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onchange = callback;
		}
	} else if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	}
};
})(window);
/****************************=csc-button.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-BUTTON
 * @classdesc Temel buton componenti.
 * @author Mahmut Yıldız
 */
function Definition(CS) {
	this.DEFAULTS = {
		focusable: true,
		style:{
			buttonManifest:"none",
			buttonIcon:"none",
			buttonIconAlign: "left"
		}
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "setTitle(title)", "setTips(tips)", "setIcon(iconPath)", "focus" ];
	this.EVENTS = [ "selected" ];
	this.DISABLE_EVENTS = [];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-BUTTON", def);

var BC = def.Type;

/**
 * @function focus
 * @description focus to button
 */
BC.prototype.focus = function(){

	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config, style=config.style||{}, css={width:style.width, height: style.height};
	var bfname = bf.getBusinessName();
	var title = (config.title === undefined || config.title === null) ? "Button" :  config.title;
	var $$divOuter = $$.create("DIV", null,"csc-button-outer", {width: style.width});
	css.width = css.width && (""+css.width).indexOf("%")>0 ? "100%" : css.width;
	css.height = css.height && (""+css.height).indexOf("%")>0 ? "100%" : css.height;
	var $$input = $$.create("INPUT", {type: "button", id:config.id, title : config.tips, "tabindex": config.tabIndex, value : title, disabled : (bf.isDisabled() && !config.runOnDisabled)}, ["csc-button", config.cssClass], css);
	$$input.setAttribute("rel",bf.$CS$.name);
	$$divOuter.style.display = inDesigner(bf) || config.visible ? "" : "none";
	if (config.cssClass) {
		$$.addClass($$divOuter, "csc-button-outer__" + config.cssClass);
	}
	if(bf.isDisabled() && !config.runOnDisabled){
		$$.addClass($$divOuter, "csc-button-outer--disabled");
	}
	if(config.theme){
		$$.addClass($$input, "csc-button-theme "+config.theme);
	}
	
	if(config.buttonType){
		$$.addClass($$divOuter, "csc-button-type "+config.buttonType);
	}
	if(style.buttonManifest!="none"){
		$$.addClass($$input,"btn--"+style.buttonManifest);
		$$.addClass($$divOuter,"csc-button__btn--"+style.buttonManifest);
	}
	if(style.buttonIcon!="none" || style.buttonIconClass){
		$$.addClass($$divOuter,"csc-button--with-icon");
		var buttonIconElement=$$.create("I", {title: config.tips}, "fa "+(style.buttonIconClass ||style.buttonIcon));
		$$divOuter.appendChild(buttonIconElement);
		if (style.buttonIconAlign === "right") {
			buttonIconElement.style.right = "0px";
			$$input.style.paddingRight = "27px";
		} else {
			buttonIconElement.style.left = "0px";
			$$input.style.paddingLeft = "27px";
		}
	}
	if(config.icon) {
		$$.css($$input, {
			backgroundImage : "url('" + SideModuleManager.getResourceUrl(bfname.substring(0, bfname.indexOf(".")), config.icon )+ "')",
			paddingLeft : "28px",
			backgroundPosition : "4px center",
			backgroundRepeat : "no-repeat"
		});
		$$.addClass($$input, "csc-button-icon");
	}
	if(config.tooltip){//HTML tooltip
		$$.addClass($$divOuter, "csc-tooltip-div");
		var $$img = $$.create("IMG", {src: "css/bc-style/img/ucgen-beyaz.png"}, "csc-tooltip-img");
		var $$span = $$.create("SPAN", null, "csc-tooltip-span");
		$$span.innerHTML = config.tooltip;
		$$divOuter.appendChild($$input);
		$$divOuter.appendChild($$img);
		$$divOuter.appendChild($$span);
	} else {
		$$divOuter.appendChild($$input);
	}
	$container.appendChild($$divOuter);
};

/**
 * @function setTitle
 * @description Butonun üstünde yazan yazıyı ayarlar.
 * @param [title] Butonun üstünde yer alacak yazı
 */
BC.prototype.setTitle = function(title) {
	var config=this.config;
	config.title = title || "";
	var $$input = $$.byid(config.id);
	if($$input){
		$$input.setAttribute("value", config.title);
	}
};

/**
 * @function setTips
 * @description Butonun üstüne gelip bekleyince beliren ipucunu ayarlar.
 * @param [tips] Butonun üstünde beliren ipucu
 */
BC.prototype.setTips = function(tips) {
	var config=this.config;
	config.tips = tips || "";
	var $$input = $$.byid(config.id);
	if($$input){
		$$input.setAttribute("title", config.tips);
	}
};

/**
 * @function setIcon
 * @description Butonu ikon olarak ayarlar.
 * @param [iconPath] Butonun yerine ayarlanacak ikonun hangi lokasyondan alınacağı
 */
BC.prototype.setIcon = function(iconPath) {
	this.config.icon = iconPath;
	this.reRender();
};

BC.prototype.bindEvent = function(eventName, callback) {
	var bc=this, config=bc.config;
	if (eventName == "selected") {
		var dom = $$.byid(config.id);
		if (dom) {
			dom.onclick = function(event){
				SIDENavigator.setEvent(event);
				var now = new Date().getTime();
				if(!bc.lastClickedTime || (now - bc.lastClickedTime) > 300 ){
					bc.lastClickedTime = now;
					callback(event);
				}else{
					console.log("[csc-button] Duplicate click prevented.");
				}
			};
		}
	}
};


})(window);
/****************************=csc-link.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-link
 */
function Definition(CS) {
	this.DEFAULTS = {
		disabled : false,
		cls : "csc-link",
		value : "link"
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "setLink(link)", "getLink", "setHref(href)", "getHref" ];
	this.EVENTS = [ "selected" ];
	this.DISABLE_EVENTS = [ "selected" ];

	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-LINK", def);

var BC = def.Type;

/**
 * @function getLink
 * @description Bağlantıda yazan metni getirir.
 */
BC.prototype.getLink = function() {
	return this.config.title;
};

/**
 * @function setLink
 * @description Bağlantının metnini ayarlar.
 * @param [title] Bağlantıda yazan metin.
 */
BC.prototype.setLink = function(title) {
	this.config.title = (title === undefined ? "" : title);
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		$$dom.innerHTML = title;
	}
};

/**
 * @function setHref
 * @description Bağlantının gideceği adresi ayarlar.
 * @param [href] Bağlantının gideceği adres.
 */
BC.prototype.setHref = function(href) {
	var disabled = this.bf.isDisabled() ? "disabled" : "";
	if((disabled || disabled != "") && !this.config.runOnDisabled){
		return;
	}
	this.config.href = href || "#";
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		$$.attr($$dom, {href: href, target: "_blank"});
	}
};

/**
 * @function getHref
 * @description Bağlantının gideceği adresi getirir.
 */
BC.prototype.getHref = function() {
	return this.config.href;
};

BC.prototype.setValue = function(title) {
	if(title !== undefined){
		this.setLink(title);
	}
};

BC.prototype.getText = function() {
	return this.config.title;
};

BC.prototype.render = function($container) {
	var bc=this,config=bc.config,bf=bc.bf;
	var value = (config.title === undefined ? "" : config.title);
	var disabled = bf.isDisabled() ? "disabled" : "";
	var fontWeight = config.fontWeight || "";
	var fontSize = config.fontSize || "";
	var italic = config.italic || "";
	// create link
	var $$a = $$.create("A", {"href": "#", id: config.id, title: config.tips}, [config.cls, config.cssClass], {"font-weight": fontWeight});
	$$a.innerHTML = value;
	if(!inDesigner(bf) && config.href){
		$$.attr($$a, {href: config.href, target: "_blank" });
	}
	
	// Design Time da visible yap
	if (inDesigner(this.bf)) {
		$$a.style.display = "";
	}
	if(config.style && config.style.width){
		$$.css($$a, {width: config.style.width, display: "inline-block"});
	}

	// Italic mi kontrol et
	if (italic) {
		$$a.style.fontStyle = "italic";
	}
	if (fontSize != "") {
		$$a.style.fontSize = fontSize + "px";
	}

	if((disabled || disabled != "") && !config.runOnDisabled){
		$$.addClass($$a, "csc-link-disabled");
		$$.rmAttr($$a, "href");
	}
	$container.appendChild($$a);
};

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var $$dom = $$.byid(this.config.id);
		if ($$dom) {
			$$dom.onclick = function(e){
				e.preventDefault();
				callback();
			};
		}
	}
};
})(window);
/****************************=csc-cs-metin.js=******************************/
(function(window, undefined) {
/**
 * CSC-TEXTBOX Temel textox bileşeni
 */
function Definition() {
	this.DEFAULTS = {
		sql: true,
		roEmptyValue: "-----",
		emptyValue: "",
		focusable: true,
		disabledKey: "disabled"
	};

	this.BaseBF = "BASIC";
	this.METHODS = ["focus", "setEmptyValue(value)", "setMaxLength(maxLength)", "setDefaultValue(value)"];
	this.EVENTS = ["changed()", "selected()", "blur()", "fihrist()", "keyup", "onfocus()"];
	this.DISABLE_EVENTS = ["selected"];

	//bf engine için gerekli underscore
	this.Type = function () {
	};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-CS-METIN", def);

var BC = def.Type;

BC.prototype.setEmptyValue = function (value) {
	/**
	 * @function setEmptyValue
	 * @description Textbox bileşene bir değer verilmediği durumda ekranda gösterilecek değeri belirler.
	 * @param [value] alana bir değer verilmediği durumda ekranda gösterilecek değer
	 */
	this.config.emptyValue = value;
};

BC.prototype.setDefaultValue = function (value) {
	/**
	 * @function setDefaultValue
	 * @description Textbox bileşene bir değer verilmediği durumda bileşenin varsayılan değeri belirler.
	 * @param [value] alana verilen varsayılan değer
	 */
	this.config.defaultValue = value;
}

BC.prototype.clear = function () {
	this.setValue(this.config.defaultValue || "");
}

BC.prototype.getValue = function () {
	var bc = this, config = bc.config, $$dom = $$.byid(config.id);
	var result;
	if ($$dom && $$dom.tagName == "INPUT") {
		result = $$dom.value;
	} else {
		result = config.value;
	}
	if (result === null || result === undefined || result === "") {
		return config.emptyValue;
	}
	return result;
};

BC.prototype.setValue = function (value) {
	if (value === null || undefined === value) {
		value = "";
	}
	var bc = this, config = bc.config, $$dom = $$.byid(config.id);
	config.value = value;
	if ($$dom) {
		if ($$dom.tagName == "INPUT") {
			$$dom.value = value;
		} else {//readonly durumu
			if (config.roInnerText) {
				$$dom.innerText = value;
			} else {
				$$dom.innerHTML = value;
			}
		}
	}

	if ($$dom && config.filter == "upper") {
		if ($$dom.tagName == "INPUT") {
			$$dom.value = SIDEString.turkishToUpperCase(value);
		} else {
			if (config.roInnerText) {
				$$dom.innerText = SIDEString.turkishToUpperCase(value);
			} else {
				$$dom.innerHTML = SIDEString.turkishToUpperCase(value);
			}
		}
	}  

	if ($$dom && config.filter == "upperEnglish") {
		if ($$dom.tagName == "INPUT") {
			$$dom.value = SIDEString.turkishToEngUpperCase(value);
		} else {
			if (config.roInnerText) {
				$$dom.innerText = SIDEString.turkishToEngUpperCase(value);
			} else {
				$$dom.innerHTML = SIDEString.turkishToEngUpperCase(value);
			}
		}
	}

	if ($$dom && config.filter === "lower") {
		if ($$dom.tagName === "INPUT") {
			$$dom.value = SIDEString.turkishToLoverCase(value);
		} else {
			if (config.roInnerText) {
				$$dom.innerText = SIDEString.turkishToLoverCase(value);
			} else {
				$$dom.innerHTML = SIDEString.turkishToLoverCase(value);
			}
		}
	}

	if ($$dom && (config.filter === "lowerEnglish")) {
		if ($$dom.tagName === "INPUT") {
			$$dom.value = SIDEString.turkishToEngLowerCase(value);
		} else {
			if (config.roInnerText) {
				$$dom.innerText = SIDEString.turkishToEngLowerCase(value);
			} else {
				$$dom.innerHTML = SIDEString.turkishToEngLowerCase(value);
			}
		}
	}

	if (getSideDefaults("support-changed-event-on-setvalue")) {
		bc.bf.fire("changed");
	}
	if(config.tooltip){
		$$dom.title = config.value;
	}
};

BC.prototype.saveState = function () {
	this.config.value = this.getValue();
};

BC.prototype.focus = function () {
	$$txt = $$.byid(this.config.id);
	if ($$txt && $$txt.focus) {
		$$txt.focus();
	}
};

BC.prototype.setMaxLength = function (maxLength) {
	/**
	 * @function setMaxLength
	 * @description Textbox'a kullanıcının girebileceği karakter limitini belirler
	 * @param [maxLength] kullanıcının girebileceği karakter limiti
	 */
	this.config.maxLength = maxLength;
}

BC.prototype.render = function ($container) {
	var bc = this, bf = bc.bf, config = bc.config, style = config.style,$$dom = $$.byid(config.id);
	var readonly = bf.isReadonly();
	if (readonly) {
		var $$span = $$.create("span", {"id": config.id, title: config.tips}, ["csc-rospan", config.cssClass], style);
		if (!inDesigner(bf) && bc.clickBinded && !bf.isDisabled()) {
			$$.addClass($$span, "csc-textbox-linked");
		}
		if (config.value === undefined || config.value === null || config.value === "") {
			$$span.innerHTML = config.roEmptyValue || config.defaultValue || "";
		} else {
			$$span.innerHTML = config.value;
		}
		if (inDesigner(bf) && bf.getModuleName() == "side") {
			$$span.style.display = "";
			$$span.innerHTML = config.roEmptyValue || "Readonly";
			$$.addClass($$span, "csc-readonly");
		}
		if (!style || !style.whiteSpace) {
			$$span.style.whiteSpace = "normal";
		}
		if (style && style.whiteSpace == "non") {
			$$span.style.whiteSpace = "";
		}
		$$.css($$span, "display", bf.isVisible() ? "" : "none");

		$container.appendChild($$span);
	} else {
		var $$input = $$.create("input", {
			id: config.id,
			type: "text",
			tabindex: config.tabIndex,
			title: config.tips,
			size: config.size,
			placeholder: config.placeholder,
			tooltip:config.tooltip
		}, ["csc-textbox", config.cssClass], style);
		if (bf.isDisabled()) {
			$$input.setAttribute(config.disabledKey, config.disabledKey);
		}
		if (config.value === undefined || config.value === null || config.value === "") {
			$$input.setAttribute("value", config.defaultValue === undefined ? "" : config.defaultValue);
		} else {
			$$input.setAttribute("value", config.value);
		}
		if (config.maxLength) {
			$$input.setAttribute("maxlength", config.maxLength);
		}


		var $$fihristDiv = null;
		if (config.fihrist) {
			$$fihristDiv = $$.create("div");
			$$.css($$fihristDiv, "display", bf.isVisible() ? "" : "none");
			var $$fihristBtn = $$.create("input", {id: config.id + "-fh", type: "button", value: "..."}, "csc-fihrist-btn");
			$$fihristDiv.appendChild($$input);
			$$fihristDiv.appendChild($$fihristBtn);
		} else {
			$$.css($$input, "display", bf.isVisible() ? "" : "none");
		}

		$$.css($$input, style);
		// Design Time da visible yap
		if (inDesigner(bf)) {
			$$.css($$input, "display", "");
		}

		if (bf.isRequired()) {
			$$.addClass($$input, "csc-required");
		}

		if (config.fihrist) {
			$container.appendChild($$fihristDiv);
		} else {
			$container.appendChild($$input);
		}

		$$input.onchange = function () {
			if (bc.bf.getParent().bcRef.typeName === "CSC-TABLE" && bc.bf.getParent().bcRef.totalRow) {
				bc.bf.getParent().bcRef.reCalculateTotalRow();
			}
		};
		//var ctrlDown = false;
		//var ctrlKey = 17,cKey = 67, aKey = 65;

		if (config.filter == "upper") {
			$$.bindEvent($$input, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$input.value = SIDEString.turkishToUpperCase($$input.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter == "upperEnglish") {
			$$.bindEvent($$input, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$input.value = SIDEString.turkishToEngUpperCase($$input.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter === "lower") {
			$$.bindEvent($$input, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$input.value = SIDEString.turkishToLoverCase($$input.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter === "lowerEnglish") {
			$$.bindEvent($$input, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$input.value = SIDEString.turkishToLoverCase($$input.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filterRegex) {
			$$.bindEvent($$input, "keypress", function (e) {
				if (isInIt([186, 188, 190, 219, 221, 222], e.which)) {
					return true;
				}
				var input = String.fromCharCode(e.which);
				try {
					var regex = new RegExp(config.filterRegex);
					if (!regex.test(input)) {
						e.preventDefault();
						return false;
					}
				} catch (ex) {
					e.preventDefault();
					return false;
				}
			});
		}
		if (config.sql || config.filter == "number") {
			$$.bindEvent($$input, "keypress", function (e) {
				if (config.sql) {
					if (e.which == 37 || e.which == 91 || e.which == 93 || e.which == 95 || e.which == 94) {
						e.preventDefault();
						return false;
					}
				}
				if (config.filter == "number") {
					if (e.charCode == 0) {//backspace, tab, del vs
						return true;
					}
					if (e.charCode < 48 || e.charCode > 57) {//[0..9]
						e.preventDefault();
						return false;
					}
				}
			});
		}
		$$input.onpaste = function (e) {
			try {
				var data = "";
				if (e.clipboardData) {
					data = e.clipboardData.getData('text/plain');

				} else if (window.clipboardData) {
					data = window.clipboardData.getData('Text');
				}
				if (config.sql) {
					if (/[\^_\[\]\%]/g.test(data)) {
						return false;
					}
				}
				if (config.filter == "number") {
					for (var i = 0; i < data.length; i++) {
						if (data.charAt(i) < '0' || data.charAt(i) > '9') {
							return false;
						}
					}
				} else if (config.filter == "upper") {
					e.clipboardData.setData('text/plain', SIDEString.turkishToUpperCase(data));
					return true;
				} else if (config.filter == "upperEnglish") {
					e.clipboardData.setData('text/plain', SIDEString.turkishToEngUpperCase(data));
					return true;
				} else if (config.filter === "lower") {
					e.clipboardData.setData('text/plain', SIDEString.turkishToLoverCase(data));
					return true;
				} else if (config.filter === "lowerEnglish") {
					e.clipboardData.setData('text/plain', SIDEString.turkishToEngLowerCase(data));
					return true;
				}
				if (config.filterRegex) {
					var regex = new RegExp(bc.config.filterRegex);
					for (var c = 0; c < data.length; c++) {
						if (!regex.test(data[c])) {
							return false;
						}
					}
				}
			} catch (ex) {
				return false;
			}
		};
		if (config.addOn) {
			$$.addClass($container, "input_group");
			if (config.addOnText) {
				var addOntext = $$.create("span", null, ["csc-textbox-addon-text"]);
				addOntext.innerHTML = config.addOnText;
				if (config.addOnTextPosition === "right") {
					$container.appendChild(addOntext);
				} else {
					$container.insertBefore(addOntext, $container.childNodes[0]);
				}
			}
			if (config.addOnIcon) {
				var addOnIcon = $$.create("span", null, ["csc-textbox-addon-icon"]);
				addOnIcon.innerHTML = "<i class='fa " + config.addOnIcon + " '></i>";
				if (config.addOnIconPosition === "right") {
					$container.appendChild(addOnIcon);
				} else {
					$container.insertBefore(addOnIcon, $container.childNodes[0]);
				}
			}
		}

		bc.applyInlineValidation($$input);
		var microphoneDiv = $$.create("div",null,"microphoneDiv",null,$container);
		if(config.microphone){
			var $$dom = $$.byid(config.id);
			var rect = $$dom.getBoundingClientRect();

			var microphoneButton = $$.create("button",null,microphoneButton,null,microphoneDiv);
			$$.addClass(microphoneButton, "fa fa-microphone");
			microphoneDiv.style.marginLeft = 2+ "px";
			microphoneDiv.style.display= "inline-block";
			if (!('webkitSpeechRecognition' in window)) {
				alert("Unable to use the Speech Recognition API");
			}
			var recognition = new webkitSpeechRecognition();
			recognition.condition = true;
			recognition.interimResults = true;
			recognition.lang = "tr-TR";
			recognition.onerror = function(event) {
				console.error(event);
			};
			recognition.onstart = function() {
				console.log('Speech recognition service has started');
			};
			recognition.onend = function() {
				console.log('Speech recognition service disconnected');
			};
			recognition.onresult = function(event) {
				var interim_transcript = '';
				var final_transcript = '';

				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					} else {
						interim_transcript += event.results[i][0].transcript;
					}
				}

				// Choose which result may be useful for you

				console.log("Interim: ", interim_transcript);


				console.log("Final: ",final_transcript);


				console.log("Simple: ", event.results[0][0].transcript);
				$$dom.value = event.results[0][0].transcript;
			};
			microphoneButton.onclick = function () {
				recognition.start();
				$$.addClass(microphoneButton, "fa fa-microphone-slash");
			}
		}
	}
	bc.applyAddedClasses();//Apply css classes added by user
};

BC.prototype.bindEvent = function (eventName, callback) {
	var bc = this, $$dom = $$.byid(bc.config.id);
	if (!$$dom && eventName != "selected") {
		return;
	}
	if (eventName == "changed") {
		$$dom.onchange = callback;
	} else if (eventName == "selected") {
		bc.clickBinded = true;
		if ($$dom) {
			$$dom.onclick = callback;
			if (!inDesigner(bc.bf) && $$dom.tagName == "SPAN" && !bc.bf.isDisabled()) {
				$$.addClass($$dom, "csc-textbox-linked");
			}
		}
	} else if (eventName == "blur") {
		$$dom.onblur = function (e) {
			if (bc.changedFlag) {//keyup ile müdahele edince changed eventi çağırılmıyor
				bc.changedFlag = false;
				bc.bf.fire("changed");
			}
			callback();//blur callback
		}
	} else if (eventName == "keyup") {
		$$dom.onkeyup = callback;
	} else if (eventName == "fihrist") {
		var $$dom = byid(this.config.id + "-fh");
		if ($$dom) {
			$$dom.onclick = callback;
		}
		this.config.fihrist = true;
	} else if (eventName == "onfocus") {
		$$dom.onfocus = callback;
	}
};


})(window);
/****************************=csc-checkbox.js=******************************/
(function(window, undefined) {
/** CSC-CHECKBOX* */
function Definition(CS) {
	this.DEFAULTS = {
		cls : "csc-checkbox",
		rtype: "number",
		focusable: true,
		labelPosition:"inherited",
		labelClick:true
	};

	this.BaseBF = "BASIC";
	this.METHODS = ["isChecked", "changeReturnType(rtype)", "focus", "setDefaultValue(value)"];
	this.EVENTS = [ "changed", "selected" ];
	
	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-CHECKBOX", def);

var BC = def.Type;

BC.prototype.rmap = {
	"number": [1, 0],
	"boolean": [true, false],
	"string": ["1", "0"],
};

/**
 * @function setDefaultValue
 * @description sets a default value to component
 * @param [value] default value
 */
BC.prototype.setDefaultValue = function(value) {
	this.config.defaultValue = value;
	this.clear();
};

BC.prototype.clear = function() {
	this.setValue(this.config.defaultValue || false);
};

/**
 * @function focus
 * @description focuses the component
 */
BC.prototype.focus = function(){
	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};

BC.prototype.getValue = function() {
	var domObject = byid(this.config.id);
	if(!domObject){
		if(this.config.value){
			return this.rmap[this.config.rtype][0];//true
		}
		return this.rmap[this.config.rtype][1];//false
	}
	if(domObject.checked){
		return this.rmap[this.config.rtype][0];//true
	}
	return this.rmap[this.config.rtype][1];//false
};

/**
 * @function changeReturnType
 * @description Changes the return type of component
 * @param {string} [rtype] Return type. Accepted values: "number", "string", "boolean"
 * If it is given as "number" then return values are: 1,0
 * If it is given as "boolean" then return values are: true,false
 * If it is given as "string" then return values are: "1","0"
 */
BC.prototype.changeReturnType = function(rtype){
	this.config.rtype = rtype;
};

/**
 * @function isChecked
 * @description Returns whether checkbox is checked or not
 */
BC.prototype.isChecked = function(){
	var bc=this,value = bc.getValue();
	if(bc.config.rtype == "string"){
		if(value == "0" || value == "false"){
			value = 0;
		} else {
			value = 1;
		}
	}
	if(value){
		return true;
	}
	return false;
};

BC.prototype.getText = function(){
	var bc=this,value = bc.getValue();
	if(bc.config.rtype == "string"){
		if(value == "0" || value == "false"){
			value = 0;
		} else {
			value = 1;
		}
	}
	if(value){
		return SideMLManager.get("common.yes");
	}
	return SideMLManager.get("common.no");
};

BC.prototype.setValue = function(value) {
	if(this.config.rtype == "string"){
		if(value == "0" || value == "false"){
			value = 0;
		} else {
			value = 1;
		}
	}
	this.config.value = value;
	var domObject = byid(this.config.id);
	if(domObject){
		domObject.checked = value;
	} else {
		domObject = byid(this.config.id+"-ro");//readonly state
		if(domObject){
			domObject.innerHTML = this.config.value ? SideMLManager.get("common.yes") : SideMLManager.get("common.no");
		}
	}
};

BC.prototype.saveState = function() {
	var bc=this,value = bc.getValue();
	if(bc.config.rtype == "string"){
		if(value == "0" || value == "false"){
			value = 0;
		} else {
			value = 1;
		}
	}
	this.config.value = value;
};

BC.prototype.getHtmlId = function() {
	if(this.bf.isReadonly()){
		return this.config.id+"-ro";
	} else {
		return this.config.id;
	}
};

BC.prototype.render = function($container) {
	var bc=this,bf=bc.bf,config=bc.config, readonly = bc.isParentReadonly() || bf.isReadonly();
	$$.addClass($container, "csc-checkbox__container");
	if (readonly) {
		var $$span = $$.create("DIV", {"id": config.id+"-ro", "title": config.tips}, ["csc-checkbox",config.cssClass]);
		$$.css($$span, "display", this.bf.isVisible() ? "" : "none");
		if (inDesigner(bf)) {
			$$.css($$span, "display", "");// Design Time da visible yap
			$$span.innerHTML ="Readonly";
		} else {
			if (config.value) {
				$$span.innerHTML = SideMLManager.get("common.yes");
			} else if(config.defaultValue){
				$$span.innerHTML = SideMLManager.get("common.yes");
			}else{
				$$span.innerHTML = SideMLManager.get("common.no");
			}
		}
		$container.appendChild($$span);
	} else {
		var disabled = bf.isDisabled() ? "disabled" : "";
		
		// create checkbox
		var $$newCheckbox = $$.create("INPUT", {id: config.id, "type": "checkbox", "title": config.tips, tabindex: config.tabIndex}, ["csc-checkbox", config.cssClass], config.style);
		if(config.value !== undefined && config.value != null && config.value != ""){
			$$.attr($$newCheckbox, "value", this.config.value);
		}
		if(disabled !== undefined && disabled != null && disabled != ""){
			$$.attr($$newCheckbox, "disabled", disabled);
		}
		// set display attribute if exists
		$$.css($$newCheckbox, "display", config.visible ? "" : "none");
		
		// Design Time da visible yap
		if (inDesigner(bf)) {
			$$.css($$newCheckbox, "display", "");
		}
		$container.appendChild($$newCheckbox);
		if (config.componentTheme === "fonticon") {
			$$.addClass($$newCheckbox, "theme_font_icon");
			var $$checkboxIcon = $$.create("i", {}, ["fa", "fa-square-o"]);
			var $$checkboxIconChecked = $$.create("i", {}, ["fa", "fa-check-square-o"]);
			$container.appendChild($$checkboxIcon);
			$container.appendChild($$checkboxIconChecked);
			$$checkboxIcon.addEventListener("click", function () {
				$$newCheckbox.click();
			});
			$$checkboxIconChecked.addEventListener("click", function () {
				$$newCheckbox.click();
			});
		}
		if (config.componentTheme === "slide") {
			$$.addClass($$newCheckbox, "theme_slide");
			var $$checkboxSlider = $$.create("span", {}, ["checkbox-slider"]);
			$container.appendChild($$checkboxSlider);
			$$checkboxSlider.addEventListener("click", function () {
				$$newCheckbox.click();
			});
		}
		//var bc = this;
		if (config.value !== undefined) {
			bc.setValue(config.value);
		}else if(config.defaultValue){
			bc.setValue(config.defaultValue);
		}
	}
};
BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "changed") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onchange = callback;
		}
	} else if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	}
};
})(window);
/****************************=csc-tree-menu.js=******************************/
(function(window, undefined) {
/** CSC-TREE-MENU @hakand */
function Definition() {
    this.DEFAULTS = {
        cls: "csc-tree-menu",
        sn: "GET_ALL_MENU_DEFINITIONS"
    };

    this.BaseBF = "NON-BUSINESS";
    this.METHODS = ["accordion", "collapse", "expand", "setMenu(menu)", "updateNodeText(nodeid, text)", "setKeyboardShortcutKeyCode(keyCode)", "setKeyboardShortcutEnabled(isEnabled)", "selectTreeNode(id)", "getNode(id)", "toggleMenu", "closeAll", "selectOne(id)"];
    this.EVENTS = ["selected", "menuSelected(menuDefObj)", "accordionSelected(menuDefObj)", "menuLoaded(menu)", "windowClicked", "ondragstart(id)"];
    this.DISABLE_EVENTS = ["menuSelected"];

    this.Type = function () {
        this.tree = null;
        var this_ = this;

        this.setDragStartCallback = function (c) {
            this.dragStartCallback = c;
        };


        this.getDragData = function () {
            return this.dragData;
        };

        this.clearDragData = function () {
            this.dragData = undefined;
        };

        this.dragStart = function (e, defid) {
            var bc = this_;
            bc.dragData = {};
            SIDENavigator.setEvent(e);
            bc.bf.fire("ondragstart", defid, e);

            if (bc.dragStartCallback) {
                var callbackResult = bc.dragStartCallback(defid);
                if (!callbackResult) {
                    console.log("[CSTree] dragStartCallback taşımaya izin vermiyor.");
                    return;
                }
            }
            //decapsulate uygulanmasina gerek yok. simdilik dragOver'da vs. duruyor. aceleye geldi.
            bc.dragData.sourceId = defid;
            bc.dragData.sourceid = decapsulateId(defid);
            bc.dragData.sourceOldParentId = bc.menuMap[bc.dragData.sourceId] ? bc.menuMap[bc.dragData.sourceId].parentid : undefined;
        };

        this.dragOver = function (event, defid) {
            var bc = this_;

            if (!event) event = window.event;
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'none';

            var outerDNDoperation = false; //dışarıdan tree içine drop yapılıyor mu, yoksa tree içindeki düğümlerin taşınması mı?
            if (!bc.dragData || !bc.dragData.sourceId) {
                outerDNDoperation = true;
                bc.dragData = {};
            }

            var targetId = defid;

            if (!outerDNDoperation) {
                var sourceId = bc.dragData.sourceId;

                //kendi bebesinin içine taşımaya izin verme
                var $targetElement = $("#" + targetId);
                if ($targetElement.closest($('#' + sourceId + '_li')).length) {
                    console.log("[CSTree] kendi bebesinin içine taşımaya izin verilmiyor.");
                    return;
                }
            }

            bc.dragData.targetId = targetId;
            bc.dragData.targetid = decapsulateId(targetId);
            bc.dndHelper.markerCss(0, 0, "none");
            bc.dndHelper.markerLineCss(0, 0, "none");

            var element = $("#" + targetId);
            var o = element.offset();
            var markerLineTopOffset = 0;
            if ((o.top + 5) > event.pageY && (outerDNDoperation || ((bc.dropCallback && bc.dropCallback(decapsulateId(sourceId), decapsulateId(targetId), "up")) || !bc.dropCallback ))) {//hedefin üstüne

                event.dataTransfer.dropEffect = 'move';
                markerLineTopOffset = o.top - 1;
                bc.dndHelper.markerLineCss(o.left - 7, markerLineTopOffset, "block");
                bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

                bc.dragData.direction = "up";
            } else if ((o.top + element.height() - 5) < event.pageY && (outerDNDoperation || ((bc.dropCallback && bc.dropCallback(decapsulateId(sourceId), decapsulateId(targetId), "down")) || !bc.dropCallback ))) {//hedefin altına
                event.dataTransfer.dropEffect = 'move';
                markerLineTopOffset = o.top + element.height() - 1;
                bc.dndHelper.markerLineCss(o.left - 7, markerLineTopOffset, "block");
                bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

                bc.dragData.direction = "down";
            } else {//hedefin içine
                if ((outerDNDoperation || (bc.dropCallback && bc.dropCallback(decapsulateId(sourceId), decapsulateId(targetId), "into")) || !bc.dropCallback )) {
                    event.dataTransfer.dropEffect = 'move';
                    markerLineTopOffset = o.top + 8;
                    bc.dndHelper.markerLineCss(0, 0, "none");
                    bc.dndHelper.markerCss(o.left - 7, markerLineTopOffset - 5, "block");

                    bc.dragData.direction = "into";
                } else {
                    console.log("[CSTree] dragOverCallback taşımaya izin vermiyor.");
                }
            }

            return false;
        };

        this.dragLeave = function (event, defid) {
            var bc = this_;

            bc.dndHelper.markerCss(0, 0, "none");
            bc.dndHelper.markerLineCss(0, 0, "none");
        };

        this.dragEnd = function (event, defid) {
            var bc = this_;
            bc.dndHelper.markerCss(0, 0, "none");
            bc.dndHelper.markerLineCss(0, 0, "none");
        };

        function decapsulateId(id) {
            if (id === -1) {
                return id;
            }
            return id ? id.split("_")[0] : id;
        }
    };
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TREE-MENU", def);

var BC = def.Type;

BC.prototype.setVisible = function (flag) {
    this.config.visible = flag;
    if (this.config.autoClose) {
        var event = SIDENavigator.getEvent();
        if (event) {
            event.stopPropagation();
        }
    }
}

BC.prototype.setDisabled = function (flag) {
    this.config.disabled = flag;
    if (this.tree) {
        this.tree.setDisabled(flag);
    }
};

BC.prototype.collapse = function () {
    var $menu = $("#" + this.config.id);
    $menu.addClass("acc-menu-collapse");
    if (this.config.autoExpand !== false) {
        $menu.bind("mouseover", function () {
            $(this).removeClass("acc-menu-collapse");
        });
        $menu.bind("mouseout", function () {
            $(this).addClass("acc-menu-collapse");
        });
    }
};

BC.prototype.expand = function () {
    var $menu = $("#" + this.config.id);
    $menu.removeClass("acc-menu-collapse");
    $menu.unbind();
};


BC.prototype.accordion = function (width) {
    if (this.menuClosed === undefined) {
        this.menuClosed = false;
    }
    var $menu = $("#" + this.config.id).find(">.csc-acc-menu-left");

    $menu.parent().animate({"width": width}, 500, function () {
        if (this.menuClosed) {
            $menu.show();
        } else {
            $menu.hide();
        }
        this.menuClosed = !this.menuClosed;
    });
};

BC.prototype.clear = function () {
    if (this.tree) {
        this.tree.clearTree();
    }
};

BC.prototype.getSelectedNodeId = function () {
    if (this.tree) {
        return this.tree.getSelectedId();
    }
};

BC.prototype.getValue = function () {
    return this.getSelectedNodeId();
};

BC.prototype.setValue = function (value) {
    // menu sadece vt den set edilebilir şimdilik...
};

BC.prototype.updateNodeText = function (nodeid, text) {
    if (!this.menuMap) {
        return;
    }
    var menuDef = this.menuMap[nodeid];
    if (menuDef) {
        this.tree.renameNode(nodeid, text);
    }
};

BC.prototype.createTree = function (defid) {
    var self = this;
    if (!this.menuMap) {
        return;
    }
    var menuDef = this.menuMap[defid];
    var moduleName = this.bf.getModuleName(), pm;
    if (SModules[moduleName]) {
        pm = SModules[moduleName].pm;
    }
    if (menuDef.children) {
        if (menuDef) {
            if (menuDef.iconPath) {
                var bfname = this.bf.$CS$.definition.BF_NAME;
                menuDef.iconPath = SideModuleManager.getResourceUrl(bfname.substring(0, bfname.indexOf(".")), menuDef.iconPath)
                menuDef.iconPath = (["dev", "designer", "dashboard"].indexOf(window.sideRuntimeEnvironment) < 0 ? menuDef.iconPath : SUtil.addParamToUrl(menuDef.iconPath, "pm", pm) );
            }
            this.tree.create(menuDef.id, menuDef.parentid, menuDef.text, menuDef.iconPath, undefined, menuDef.text2, false, menuDef.cssClass);
            var c = menuDef.children;
            for (var i in c) {
                //Özyineli çağır
                this.createTree(c[i]);
            }
        }
    } else {
        if (menuDef.iconPath) {
            var bfname = this.bf.$CS$.definition.BF_NAME;
            menuDef.iconPath = SideModuleManager.getResourceUrl(bfname.substring(0, bfname.indexOf(".")), menuDef.iconPath);
            menuDef.iconPath = (["dev", "designer", "dashboard"].indexOf(window.sideRuntimeEnvironment) < 0 ? menuDef.iconPath : SUtil.addParamToUrl(menuDef.iconPath, "pm", pm) );
        }
        this.tree.create(menuDef.id, menuDef.parentid, menuDef.text, menuDef.iconPath, undefined, menuDef.text2, true, menuDef.cssClass);
    }

};

BC.prototype.selectTreeNode = function (id, select, fireSelectEvent) {
    if (select === undefined) {
        select = true;
    }
    this.tree.expandTree(id, false, true);
    if (select) {
        this.tree.select(id, fireSelectEvent);
    }
};


BC.prototype.treeNodeSelected = function (id, event) {
    this.bf.fire("menuSelected", this.menuMap[id]);
};

BC.prototype.accordionSelected = function (id, event) {
    this.bf.fire("accordionSelected", this.menuMap[id]);
};
/*
 * Sets a title to container
 * @param {menu} title title
 *
 *@example
 *[
 *    {id:"menuDefRoot"},
 *    {id:"1", text: "Level 1-1", parentid:"menuDefRoot"},
 *    {id:"11", text: "Level 1-1-1", parentid:"1"},
 *    {id:"12", text: "Level 1-1-2", parentid:"1"},
 *    {id:"2", text: "Level 1-2", parentid:"menuDefRoot"}
 *]
 **/
BC.prototype.setMenu = function (menu) {
    menu = SArray.clone(menu, true);
    this.menuMap = {};
    var bc = this;
    for (var i = 0; i < menu.length; i++) {
        var menuDef = menu[i];
        if (menu[i].json) {
            menuDef = menu[i].json
        }
        // multi lang supp.
        menuDef.id = menu[i].id || menu[i].defId;
        menuDef.text = menuDef.text;
        menuDef.title = menuDef.title;
        // put to map
        this.menuMap[menuDef.id] = menuDef;
    }
    //Prepare children
    for (var menuid in this.menuMap) {
        var def = this.menuMap[menuid], parentid = def.parentid;
        var parentDef = this.menuMap[parentid];
        if (parentDef && (!parentDef.children || parentDef.children.indexOf(menuid) < 0)) {
            if (!parentDef.children) {
                parentDef.children = [];
            }
            parentDef.children.push(menuid);
        }
    }
    //Çoklu root durumu, Tree'nin düzgün çalışması için parent'ı menuDefRoot olanların parent'ı -1 olarak değiştirilmeli
    if (!this.menuMap.menuDefRoot) {
        for (var menuid in this.menuMap) {
            var def = this.menuMap[menuid], parentid = def.parentid;
            if (parentid == "menuDefRoot") {
                def.parentid = -1;
            }
        }
    }

    //Ataları olmayan cocuklari sil, yetki islerinden dolayi
    for (var k = 0; k < menu.length; k++) {
        var toDelete = [];
        var menuDef = menu[k];
        if (menu[k].json) {
            menuDef = menu[k].json
        }
        for (var i = 0; menuDef.children && i < menuDef.children.length; i++) {
            if (!this.menuMap[menuDef.children[i]]) {
                toDelete.push(i);
            }
        }
        for (var i = 0; i < toDelete.length; i++) {
            menuDef.children.splice(toDelete[i] - i, 1);
        }
    }

    this.reRender();
};

BC.prototype.setKeyboardShortcutKeyCode = function (keyCode) {
    this.config.keyboardShortcutKeyCode = keyCode;
    if (this.tree) {
        this.tree.setKeyboardShortcutKeyCode(this.config.keyboardShortcutKeyCode);
    }
};

BC.prototype.setKeyboardShortcutEnabled = function (isEnabled) {
    this.config.keyboardShortcutEnabled = isEnabled;
    if (this.tree) {
        this.tree.setKeyboardShortcutEnabled(this.config.keyboardShortcutEnabled);
    }
};

BC.prototype.toggleMenu = function (callBack) {
    if (this.config.autoClose) {
        var event = SIDENavigator.getEvent();
        if (event) {
            event.stopPropagation();
        }
    }
    if (!this.config.visible) {
        return;
    }

    var $$treeDiv = $$.byid(this.config.id);
    if ($$treeDiv.style.display) {
        $$.css($$treeDiv, "display", "");
    } else {
        $$.css($$treeDiv, "display", "none");
    }
    if (typeof callBack === "function") {
        callBack();
    }
};

BC.prototype.getNode = function (id) {
    var node = csCloneObject(this.menuMap[id], false);
    return node;
};

BC.prototype.destroybc = function () {
    $$.unbindEvent(window, "click", this.windowEventHandler, false);
};
BC.prototype.closeAll = function () {
    var bc = this
    var root = bc.treeRootId;
    var selected = bc.tree.selNodeArr;
    var main = $$.byid(root);

    var opened = main.getElementsByClassName("cstree-outer-opened");
    var clicked = main.getElementsByClassName("cstree-clicked");
    var clicOpened = main.getElementsByClassName("cstree-open");

    var inneNone = main.getElementsByClassName("inner-menu");

    var openedlength = opened.length
    for (var index = 0; index < openedlength; index++) {
        var nextSib = opened[index].nextSibling;
        opened[0].classList.remove("cstree-outer-opened");
        nextSib.style.display = "none";
    }

    var clickedlength = clicked.length
    for (var index = 0; index < clickedlength; index++) {
        console.log("--> index : " + index);
        clicked[0].classList.remove("cstree-clicked");
    }

    var clicOpenedlength = clicOpened.length
    for (var index = 0; index < clicOpenedlength; index++) {
        clicOpened[index].style.display = "none";
        clicOpened[0].classList.remove("cstree-open");
    }
    for (var index = 0; index < inneNone.length; index++) {
        inneNone[index].style.display = "none";
    }

}
BC.prototype.selectOne = function (id, select, fireSelectEvent) {
    var bc = this;
   // bc.closeAll();
    if (select === undefined) {
        select = true;
    }
    this.tree.expandTree(id, false, true);
    if (select) {
        this.tree.select(id, fireSelectEvent);
    }
    var outerDiv = $$.byid(bc.tree.idPrefix + "-" + id + "_outerdiv");
    outerDiv.classList.add("cstree-outer-opened");

    var innerDiv = $$.byid(bc.tree.idPrefix + "-" + id + "_innerdiv");
    innerDiv.style.display = "block";

}

BC.prototype.render = function ($container) {
    var bc = this, bf = this.bf, config = bc.config;
    if (window.mobileMod) {
        var $$headerDiv = $$.create("div", {id: config.id + "_header"}, ["csc-acc-menu-header"], undefined, $container);
        var $$toggleButton = $$.create("input", {
            id: config.id + "_toggle",
            type: "button"
        }, ["csc-acc-menu-toggle-btn"], undefined, $$headerDiv);
        $$toggleButton.onclick = function () {
            bc.toggleMenu();
        }
    }

    var $$treeDiv = $$.create("DIV", {"id": config.id}, ["csdTree", "cstree", config.cssClass, (config.disableZebra ? "cstree-nozebra" : "")], undefined, $container);
    if (config.disabled) {
        $$.attr($$treeDiv, "disabled", config.disabled);
    }
    $$.css($$treeDiv, "display", config.visible ? "" : "none");
    if (config.style && config.style.width) {
        $$.css($$treeDiv, "width", config.style.width);
    }
    if (window.mobileMod) {
        $$.addClass($$treeDiv, "csc-acc-menu-responsive");
    }

    bc.treeRootId = $$treeDiv.getAttribute("id");
    if (config.accordion) {
        $$.addClass($$treeDiv, "csc-acc-menu");

        var $$leftDiv = $$.create("DIV", {"id": getid()}, "csc-acc-menu-left");
        var $$rightDiv = $$.create("DIV", undefined, "csc-acc-menu-right");
        $$treeDiv.appendChild($$leftDiv);
        $$treeDiv.appendChild($$rightDiv);

        bc.treeRootId = $$leftDiv.getAttribute("id");
    }

    var tree = new CSTree(bc.treeRootId, {
        keyboardShortcutKeyCode: config.keyboardShortcutKeyCode,
        keyboardShortcutEnabled: config.keyboardShortcutEnabled,
        accordion: config.accordion,
        searchable: config.searchable,
        showOnlySearchResults: true,
        idprefix: bc.treeRootId + "-",
        searchPlaceHolder: config.searchPlaceHolder || SideMLManager.get("common.search")
    });
    this.tree = tree;
    tree.onselect(function (id, event) {
        bc.treeNodeSelected(id, event);
    });
    tree.onacc(function (id, event) {
        bc.accordionSelected(id, event);
    });
    tree.init();

    tree.ondragstart(bc.dragStart);
    if (config.movable) {
        tree.ondragover(bc.dragOver).ondragleave(bc.dragLeave).ondragend(bc.dragEnd).ondrop(bc.drop);
        bc.dndHelper.init();
    }

    var disabled = this.bf.isDisabled() ? "disabled" : "";
    if (disabled) {
        tree.setDisabled(true);
    } else {
        tree.setDisabled(false);
    }

    if (config.autoClose && !inDesigner(bf)) {
        $$.unbindEvent(window, "click", bc.windowEventHandler, false);
        bc.windowEventHandler = function (event) {
            var $$treediv = $$.byid(config.id);
            if ($$treediv.style.display == "none") {
                return;
            }
            if (!event.target) {
                return;
            }
            var target = event.target;
            while (true) {
                if (!target || !target.tagName || target.tagName == "BODY") {
                    break;
                }
                if (target.getAttribute("id") == config.id) {
                    return;
                }
                target = target.parentNode;
            }
            //bu event menu haricinde ekranda bir alana tıklandığında oluşur
            bf.fire("windowClicked")
        };
        $$.bindEvent(window, "click", bc.windowEventHandler, false);
    }

    // design time
    if (inDesigner(bf)) {
        this.menuMap = {};
        var m1 = getid();
        var m2 = getid();
        var m3 = getid();
        var m4 = getid();
        var m5 = getid();
        var m6 = getid();

        if (config.accordion) {
            var parentid = this.treeRootId;
            tree.create(m2, parentid, "child 1");
            tree.create(m3, parentid, "child 2");
            tree.create(m4, parentid, "child 3");
            tree.create(m5, parentid, "child 4");
            tree.create(m6, parentid, "child 5");
        } else {
            tree.create(m1, -1, "root");
            tree.create(m2, m1, "child 1");
            tree.create(m3, m1, "child 2");
            tree.create(m4, m2, "child 3");
            tree.create(m5, m2, "child 4");
            tree.create(m6, m3, "child 5");
            tree.expandTree(config.id);
        }
    } else {

        if (config.app == "static") {
            var menuRootId = "menuDefRoot";
            if (config.accordion) {
                if (!bc.menuMap) {
                    bc.menuMap = {};
                }
                //root düğümün çocukları root olacak şekilde ağacı çiz.
                var rootMenuDef = bc.menuMap[menuRootId];
                if (rootMenuDef && rootMenuDef.children) {
                    var c = rootMenuDef.children;
                    for (var i = 0; i < c.length; i++) {
                        var childMenuDef = bc.menuMap[c[i]];
                        if (childMenuDef) {
                            childMenuDef.parentid = bc.treeRootId;
                            //Özyineli çağır
                            bc.createTree(c[i]);
                        }
                    }
                } else {
                    Object.keys(bc.menuMap).forEach(function (element) {
                        if (bc.menuMap[element].parentid === "menuDefRoot") {
                            bc.menuMap[element].parentid = bc.treeRootId;
                        }
                        if (element !== "menuDefRoot") {
                            bc.createTree(bc.menuMap[element].id || bc.menuMap[element].defId);
                        }
                    });
                }
            } else {
                if (!bc.menuMap) {
                    bc.menuMap = {};
                }
                if (bc.menuMap[menuRootId] && bc.menuMap[menuRootId].children) {
                    bc.createTree(menuRootId);
                    bc.tree.expandTree("menuDefRoot", false, false);
                } else {
                    Object.keys(bc.menuMap).forEach(function (element) {
                        bc.createTree((bc.menuMap[element].id || bc.menuMap[element].defId))
                    });
                }

            }
            return;
        }
        var url = SideModuleManager.getSideUrl(bf.getModuleName());
        var sn = "SIDE.GET_ALL_MENU_DEFINITIONS3";
        var authManager = CSSession.get("AUTH_MANAGER");
        if (authManager === true || authManager === "true") {
            sn = "SIDE.GET_ALL_MENU_DEFINITIONS2";
            url = SideModuleManager.getAppUrl(SideModuleManager.getLocalModuleName(), csdc.DISPATCH_APP_CSDYS);
        } else if (config.app == "app") {
            url = undefined;
            sn = this.config.sn;
        }
        var isTest = (CSSession.getEnv() == "dev" || CSSession.getEnv() == "test") ? true : false;
        CSCaller.call(sn, {
            csapUserId: CSSession.getUserId(),
            rn: config.rn,
            isTest: isTest,
            lang: CSSession.getLang()
        }, {
            url: url, bf: bf
        }).then(function (data) {
            bc.menuMap = {};
            var objArr = data;
            if (objArr && objArr.length > 0) {
                for (var j = 0; j < objArr.length; j++) {
                    var obj = objArr[j];
                    if (obj) {
                        var menuDef = obj;
                        if (obj.json) {
                            if (!obj.json.defId) {
                                obj.json.defId = menuDef.defId;
                            }
                            menuDef = obj.json;
                        }
                        menuDef.id = obj.id || obj.defId;
                        menuDef.text = menuDef.text;
                        menuDef.title = menuDef.title;
                        bc.menuMap[menuDef.id] = menuDef;
                        if (menuDef.parentid === "menuDefRoot") {
                            menuDef.parentid = bc.treeRootId;
                        }
                    }
                }
            }

            var menuRootId = "menuDefRoot";
            if (config.accordion) {
                //root düğümün çocukları root olacak şekilde ağacı çiz.
                var rootMenuDef = bc.menuMap[menuRootId];
                if (rootMenuDef && rootMenuDef.children) {
                    var c = rootMenuDef.children;
                    for (var i = 0; i < c.length; i++) {
                        var childMenuDef = bc.menuMap[c[i]];
                        if (childMenuDef) {
                            childMenuDef.parentid = bc.treeRootId;
                            //Özyineli çağır
                            bc.createTree(c[i]);
                        }
                    }
                } else {
                    Object.keys(bc.menuMap).forEach(function (element) {
                        if (bc.menuMap[element].parentid === "menuDefRoot") {
                            bc.menuMap[element].parentid = bc.treeRootId;
                        }
                        if (element !== "menuDefRoot") {
                            bc.createTree(bc.menuMap[element].id || bc.menuMap[element].defId);
                        }
                    });
                }

            } else {
                if (!bc.menuMap) {
                    bc.menuMap = {};
                }
                if (bc.menuMap[menuRootId] && bc.menuMap[menuRootId].children) {
                    bc.createTree(menuRootId);
                } else {
                    Object.keys(bc.menuMap).forEach(function (element) {
                        bc.createTree((bc.menuMap[element].id || bc.menuMap[element].defId));
                    });
                }
            }
            bf.fire("menuLoaded", bc.menuMap);
        });
    }
};
BC.prototype.bindEvent = function (eventName, callback) {
    if (eventName == "selected") {
        var dom = $$.byid(this.config.id);
        if (dom) {
            dom.onclick = callback;
        }
    }
};


})(window);
/****************************=csc-mini-button.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-MIN-BUTTON
 * @classdesc Temel buton componenti.
 * @author Mahmut Yıldız, Mete Işık
 */
function Definition(CS) {
	this.DEFAULTS = {
		focusable: true
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "setTips(tips)", "changeIcon(src)", "focus", "setOnContextMenuCallback(callback)", "showContextMenu","changeButtonType(buttonType)","changeTheme(buttonTheme)", "setBadge(text)", "removeBadge" ];
	this.EVENTS = [ "selected" ];
	this.DISABLE_EVENTS = [ "selected" ];
	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-MINI-BUTTON", def);

var BC = def.Type;

BC.prototype.miniButtonTooltips=function () {
	return {
		"fa-plus":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Add")
		},
		"fa-plus-circle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Add")
		},
		"fa-car":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Car")
		},
		"fa-caret-down":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Down")
		},
		"fa-caret-up":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Up")
		},
		"fa-caret-left":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Left")
		},
		"fa-caret-right":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Right")
		},
		"fa-paperclip":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Attachment")
		},
		"fa-bars":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Dropdown")
		},
		"fa-calendar":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Calendar")
		},
		"fa-calculator":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Calculator")
		},
		"fa-bar-chart":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Chart")
		},
		"fa-check":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Check")
		},
		"fa-files-o":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Copy")
		},
		"fa-times":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Delete")
		},
		"fa-trash":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Delete")
		},
		"fa-file-text":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Detail")
		},
		"fa-download":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Download")
		},
		"fa-arrow-circle-o-down":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Down")
		},
		"fa-pencil":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Edit")
		},
		"fa-pencil-square-o":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Edit")
		},
		"fa-exchange":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Exchange")
		},
		"fa-external-link":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.ExternalLink")
		},
		"fa-filter":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Filter")
		},
		"fa-folder":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Folder")
		},
		"fa-arrow-right":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Go")
		},
		"fa-question":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Help")
		},
		"fa-question-circle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Help")
		},
		"fa-info":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Info")
		},
		"fa-info-circle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Info")
		},
		"fa-link":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Link")
		},
		"fa-list":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.List")
		},
		"fa-lock":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Lock")
		},
		"fa-envelope":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.MailClose")
		},
		"fa-envelope-o":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.MailClose")
		},
		"fa-envelope-open":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.MailOpen")
		},
		"fa-envelope-open-o": {
			"tooltipText":SideMLManager.get("CSC-MINI-Button.MailOpen")
		},
		"fa-male":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Male")
		},
		"fa-minus":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Minus")
		},
		"fa-minus-circle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Minus")
		},
		"fa-mobile":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Mobile")
		},
		"fa-desktop":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Monitor")
		},
		"fa-sort":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Order")
		},
		"fa-print":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Print")
		},
		"fa-refresh":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Reload")
		},
		"fa-reply":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Reply")
		},
		"fa-reply-all":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.ReplyAll")
		},
		"fa-repeat":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Reset")
		},
		"fa-floppy-o":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Save")
		},
		"fa-search":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Search")
		},
		"fa-send":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Send")
		},
		"fa-cog":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Settings")
		},
		"fa-sign-out":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Signout")
		},
		"fa-stop":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Stop")
		},
		"fa-stop-circle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Stop")
		},
		"fa-unlock":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Unlock")
		},
		"fa-upload":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Upload")
		},
		"fa-user":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.User")
		},
		"fa-exclamation":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Warning")
		},
		"fa-exclamation-triangle":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Warning")
		},
		"fa-facebook":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Facebook")
		},
		"fa-twitter":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Twitter")
		},
		"fa-google-plus":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.GoolePlus")
		},
		"fa-youtube":{
			"tooltipText":SideMLManager.get("CSC-MINI-Button.Youtube")
		}
	};
};

/**
 * @function setOnContextMenuCallback
 * @description Context menü açıldıktan sonra çağrılacak callback fonksiyonunu ayarlar.
 * @param [callback] callback fonksiyonu
 */
BC.prototype.setOnContextMenuCallback = function(callback) {
	var bc = this;
	 this.contextMenuCallback = callback;

	var $$dom = $$.byid(this.config.id);
	if($$dom){
		$$.bindEvent($$dom, "contextmenu", function(event){
			bc.showContextMenu(event);
		});
	}
};

/**
 * @function showContextMenu
 * @description Pop-up şeklinde açılan context menüyü gösterir. Bunun için bir callback fonksiyonu olmak zorundadır.
 * @param [event]
 */
BC.prototype.showContextMenu = function(event) {
	event = event || window.event;
	var bc = this;
	console.log("mini button context menu");
	event.preventDefault();
	var menuItemsObj = this.contextMenuCallback();

	csdu.contextMenu({
		moduleName: bc.bf.getModuleName(),
		left: event.pageX,
		top: event.pageY,
		items:menuItemsObj
	}, undefined, event);
};

/**
 * @function focus
 * @description Odağı mini butona alır.
 */
BC.prototype.focus = function(){
	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};

/**
 * @function setTips
 * @description Mini butonun üstüne gelip bekleyince beliren ipucunu ayarlar.
 * @param [tips] Mini butonun üstünde beliren ipucu
 */
BC.prototype.setTips = function(tips) {
	this.config.tips = tips;
	var $$btn = $$.byid(this.config.id);
	if ($$btn) {
		$$btn.setAttribute("title", this.config.tips);
	}
};

/**
 * @function changeIcon
 * @description Mini butonu ikon olarak ayarlar.
 * @param [src] Mini butonun ikon path ini değiştirir.
 */
BC.prototype.changeIcon = function(src) {
	this.config.src = src;
	this.reRender();
};
/**
 * @function changeButtonType
 * @description Mini butonun ikonunu değiştirir.
 * @param [buttonType] Mini butonun font ikonların value larıdır.
 */
BC.prototype.changeButtonType=function (buttonType) {
	this.config.buttonType=" fa-"+buttonType
	this.reRender();
};
/**
 * @function changeTheme
 * @description Mini butonun temasini değiştirir.
 * @param [buttonTheme] primary,success,warning,danger seçeneklerinden biri string olarak gönderilir.
 */
BC.prototype.changeTheme=function (buttonTheme) {
	this.config.buttonTheme=buttonTheme;
	this.reRender();
};

BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config;
	var btnSelector=null, src;

	var moduleName = this.bf.getModuleName(), pm;
	if(SModules[moduleName]){
		pm = SModules[moduleName].pm;
	}

	if(!config.src && config.buttonType){
		if(config.buttonType.indexOf("css/bc-style") !== -1){
			//eskiden kalan icon button ise
			src = config.buttonType;
		}else{
			//yeni buttonType secilmis ise
			src=null;
		}
	}else{
		//icon olarak disaridan source verilmis ise
		if(config.src){
			if(config.src.indexOf("base64")<0){
				src = SideModuleManager.getResourceUrl(moduleName, config.src);
			} else {
				src = config.src;
			}
		}else{
			src="css/bc-style/img/iconNotAvaliable.png";
		}
		src = ( window.sideRuntimeEnvironment === "prod" ? src : SUtil.addParamToUrl(src, "pm", pm) );
	}


	if(src===null){
		//yebni ikon button
		btnSelector="A";
	}else{
		//eski icon button ya da disardan source verilmis
		btnSelector="INPUT";
	}
	var $$input = $$.create(
		btnSelector,
		{id : config.id, type : "button", "tabindex": config.tabIndex, disabled : (bf.isDisabled() && !config.runOnDisabled), title : config.tips},
		["csc-mini-button", config.cssClass],
		config.style
	);
	$$input.setAttribute("rel",bf.$CS$.name);
	$$.css($$input, {
		display : bf.isVisible() ? "" : "none"
	});
	if(src!==null){
		$$input.style.backgroundImage = "url("+ src + ")";
		$$input.style.backgroundRepeat = "no-repeat";
		$$input.style.backgroundPosition = "center center";
		var style = config.style;
		if(style && (config.style.width || config.style.height)){
			var width = style.width ? style.width+"" : "16px", height = style.height ? style.height+"":"16px";
			if(width.indexOf("%") < 0 && height.indexOf("%") < 0){
				width = width.indexOf("px")>=0 ? width : width + "px";
				height = height.indexOf("px")>=0 ? height : height + "px";
				$$.css($$input, {
					backgroundSize : width + " " +height
				});
			}
		}
	}else{
		if(this.config.badge) {
			var $$buttonBadge = $$.create("span",null,["mini-button__badge"],null,$$input);
			$$.addClass($$buttonBadge, "hide");
			$$buttonBadge .setAttribute("id", this.config.id + "_badge");
		}
		if (this.config.iconClass) {
			$$.create("I",null,["fa "+this.config.iconClass],null,$$input);
		} else{
			$$.create("I",null,["fa "+this.config.buttonType],null,$$input);
		}
		if(!bc.config.tips && bc.miniButtonTooltips()[this.config.buttonType]){
			$$input.setAttribute("title",bc.miniButtonTooltips()[this.config.buttonType.trim()].tooltipText);

		}else if(bc.config.tips) {
			$$input.setAttribute("title",bc.config.tips);
		}
		$$.addClass($$input,"csc-mini-button--font-icon");
		if(config.buttonTheme){
			$$.addClass($$input,"csc-mini-button--theme csc-mini-button--"+config.buttonTheme);
		}
	}
	if (inDesigner(bf)) { // Design Time da visible yap
		$$input.style.display = "";
	}

	if(bc.contextMenuCallback){
		$$.bindEvent($$input, "contextmenu", function(event){
			bc.showContextMenu(event);
		});
	}

	$container.appendChild($$input);
};
BC.prototype.setBadge = function(text){
	var bc=this, bf=bc.bf, config=bc.config;
	if (!config.badge) {
		console.error("CSC-MIN-BUTTON:\nNotification Badge is " + config.badge);
		return;
	}
	var badge = $$.byid(config.id + "_badge");
	$$.rmClass(badge, "hide");
	badge.innerHTML = text;
}
BC.prototype.removeBadge = function(){
	var bc=this, bf=bc.bf, config=bc.config;
	var badge = $$.byid(config.id + "_badge");
	$$.addClass(badge, "hide");
}
BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	}
};

})(window);
/****************************=csc-empty.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-EMPTY
 * 
 * @classdesc Temel empty componenti.
 * 
 * @author Mahmut Yıldız, Mete Işık
 */
function Definition(CS) {
	this.DEFAULTS = {};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [];
	this.EVENTS = [];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-EMPTY", def);

var BC = def.Type;

BC.prototype.render = function($container) {
};

BC.prototype.bindEvent = function(eventName, callback) {
};
})(window);
/****************************=csc-passwordfield.js=******************************/
(function(window, undefined) {
function Definition() {
	this.DEFAULTS = {
		disabled: false,
		cls: "csc-textbox",
		focusable: true
	};

	this.BaseBF = "BASIC";
	this.METHODS = ["focus"];
	this.EVENTS = ["changed", "selected", "blur", "onfocus()", "keyup"];

	this.Type = function () {
	};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-PASSWORDFIELD", def);

var BC = def.Type;

BC.prototype.getValue = function () {
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		return $$dom.value;
	}
	return this.config.value;
};

BC.prototype.setValue = function (value) {
	if (value === null || undefined === value) {
		value = "";
	}
	this.config.value = value;
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		$$dom.value = value;
	}
};

/**
 * @function focus
 * @description Focuses the component
 */
BC.prototype.focus = function () {
	var $$dom = $$.byid(this.config.id);
	if ($$dom) {
		$$dom.focus();
	}
};

BC.prototype.render = function ($$container) {
	var bc=this, bf=bc.bf, config=bc.config;
	// Create Password Field
	var $$input = $$.create("INPUT", {id:config.id, type:"password",maxLength: config.maxlength||1000, placeholder:config.placeholder}, ["csc-password",config.cssClass],config.style,$$container);
	if(bf.isDisabled()){
		$$input.setAttribute("disabled", "disabled");
	}
	if (inDesigner(this.bf)) {//Designer'da autocomplete'i kapat
		$$input.setAttribute("autocomplete", "new-password");
	}
	if (bf.isRequired()) {
		$$.addClass($$input, "csc-required");
	}
};

BC.prototype.bindEvent = function (eventName, callback) {
	var $$dom = $$.byid(this.config.id);
	if(!$$dom){
		return;
	}
	if (eventName == "changed") {
		$$dom.onchange = callback;
	} else if (eventName == "keyup") {
		$$dom.onkeyup = callback;
	} else if (eventName == "selected") {
		$$dom.onclick = callback;
	} else if (eventName == "blur") {
		$$dom.onblur = callback;
	}else if (eventName == "onfocus") {
		$$dom.onfocus = callback;
	}
};


})(window);
/****************************=csc-cgart.js=******************************/
(function(window, undefined) {
/** @class CSC-CGART-EDITOR*/
function Definition(CS) {
	this.DEFAULTS = {
	};

	this.BaseBF = "BASIC";
	this.METHODS = [];
	this.EVENTS = [];
	this.DEPENDENCIES = [
		{"name": "cgart", "version": "1.0"}
	];

	this.Type = function() {};
};

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-CGART", def);

var BC = def.Type;
var gauges = [];

BC.prototype.render = function($container) {
	var itemContainer = document.createElement("SPAN");
	itemContainer.id =  "gaugeContainer";
	$container.appendChild(itemContainer);
	createGauge("gaugeContainer", this.config.labelOfCgart, parseInt(this.config.min), parseInt(this.config.max), this.config.value);
};



BC.prototype.reRender = function() {
	document.getElementById("gaugeContainer").innerHTML = "";
	createGauge("gaugeContainer", this.config.labelOfCgart, parseInt(this.config.min), parseInt(this.config.max), this.config.value);
};


function createGauge(name, label, min, max, value)
{
	var config =
		{
			size: 120,
			label: label,
			min: undefined != min ? min : 0,
			max: undefined != max ? max : 100,
			minorTicks: 5
		}

	var range = config.max - config.min;
	config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
	config.redZones = [{ from: config.min + range*0.9, to: config.max }];

	gauges[name] = new Gauge("gaugeContainer", config);
	gauges[name].render();
	updateGauges(value, name);

}

function updateGauges(value, name)
{
		gauges[name].redraw(value);
}

BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = $$.byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	}
};

})(window);
/****************************=csc-textarea.js=******************************/
(function(window, undefined) {
/** 
 * @class CSC-TEXTAREA 
 */


function Definition(CS) {
	this.DEFAULTS = {
		cls : "csc-textarea",
		roEmptyValue: "-----",
		focusable: true,
		disabledKey: "disabled"
	};

	this.BaseBF = "BASIC";

	this.METHODS = [ "focus", "setMaxLength(maxLength)", "setDefaultValue(value)" ];
	this.EVENTS = [ "changed", "selected", "onkeypress(event)", "onkeyup(event)" ];

	this.Type = function() {};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TEXTAREA", def);

var BC = def.Type;
BC.prototype.setDefaultValue = function(value) {
	this.config.defaultValue = value;
}
BC.prototype.clear = function() {
	this.setValue(this.config.defaultValue || "");
}
BC.prototype.getValue = function() {
	var domObject = byid(this.config.id);
	if (domObject) {
		var readonly = this.isParentReadonly() || this.bf.isReadonly();
		if (readonly || domObject.value === undefined) {
			return this.config.value;
		} else {
			return domObject.value;
		}
	}
	return this.config.value || "";
};
BC.prototype.saveState = function() {
	this.config.value = this.getValue();
};
BC.prototype.focus = function(){
	$$txt = $$.byid(this.config.id);
	if($$txt){
		$$txt.focus();
	}
};
BC.prototype.setMaxLength = function(maxLength) {
	this.config.maxlength = maxLength;
}
BC.prototype.ellipsis=function (value, maxLength) {
	var thiz = this;
	var ellipsistxt=document.createElement("span");
    var showAllLink=document.createElement("a");
    showAllLink.classList.add("showButon");
    var showSummary=document.createElement("a");
    showSummary.classList.add("hideButon");
    showAllLink.innerHTML="Tümünü Göster";
    showSummary.innerHTML="Daralt";
	showAllLink.addEventListener("click",function () {
        ellipsistxt.innerHTML=value;
        showSummary.style.display = "block";
        showAllLink.style.display = "none";
    });

    showSummary.addEventListener("click",function () {
        ellipsistxt.innerHTML=value.substring(0, maxLength-1)  + "..." ;
        showSummary.style.display = "none";
        showAllLink.style.display = "block";
	});

	if(typeof  maxLength === "string"){
		maxLength = parseInt(maxLength);
	}
	if(value.length < maxLength){
        return [ellipsistxt];

		//return value;

	} else{
		ellipsistxt.innerHTML=value.substring(0, maxLength-1)  + "..." ;
		return [ellipsistxt,showAllLink,showSummary];
		//return value.substring(0, maxLength-1)  + "..." ;

	}

}
BC.prototype.setValue = function(value) {
	if (value === null || undefined === value) {
        value = "";
    }
    this.config.value = value;
    var domObject = byid(this.config.id);
    if (domObject) {
        var readonly = this.isParentReadonly() || this.bf.isReadonly();
        //var ellipsisARR=this.ellipsis(value, this.config.ellipsis);
        if (readonly ) {
			var ellipsisARR=this.ellipsis(value, this.config.ellipsis);
			if(this.config.ellipsis==0 || undefined==this.config.ellipsis){
				domObject.innerHTML=value;
			}
			else{
				for(var i=0; i<ellipsisARR.length; i++){
                domObject.appendChild(ellipsisARR[i]);
                }
			}

		} else {
            domObject.value = value;
        }
    }
};
BC.prototype.render = function($container) {
	var bc=this, bf=bc.bf, config=bc.config, readonly = bc.isParentReadonly() || bf.isReadonly();
	if (readonly) {
		var $$span = $$.create("span", {"id": config.id}, ["csc-rospan", config.cssClass], config.style);
		if(config.value === undefined || config.value === null || config.value === ""){
			$$span.innerHTML = config.roEmptyValue || config.defaultValue || "";				
		} else if(config.ellipsis) {
			var tempVal= this.ellipsis(config.ellipsis);
		}else{
            $$span.innerHTML = config.value;
		}
		
		if (inDesigner(bf)) {
			$$span.style.display = "";
			$$span.innerHTML = config.roEmptyValue || "Readonly";
		}
		if(!config.style || !config.style.whiteSpace){
			$$span.style.whiteSpace = "normal";
		}
		if(config.style && config.style.whiteSpace == "none"){
			$$span.style.whiteSpace = "";
		}
		$container.appendChild($$span);
	} else {
		var $$newTextArea = $$.create("TEXTAREA", {
			id : config.id,
			rows : config.rows,
			title:config.tips,
			placeholder: config.placeholder,
			cols : config.cols,
			maxlength : config.maxlength,
			tabindex: config.tabIndex
		});
		if(bf.isDisabled()){
			$$newTextArea.setAttribute(config.disabledKey,config.disabledKey);
		}
		if (config.resize == false) {
			$$.css($$newTextArea, "resize", "none");
		}
		$$.css($$newTextArea, "display", config.visible ? "" : "none");
		$$.css($$newTextArea, config.style || {});

		// Design Time da visible yap
		if (inDesigner(bf)) {
			$$.css($$newTextArea, "display", "");
		}

		$$.addClass($$newTextArea, "csc-textarea");
		if (config.cssClass) {
			$$.addClass($$newTextArea, config.cssClass);
		}

		if (config.value !== undefined && config.value !== null ) {
			$$newTextArea.value = config.value;
		}else{
			$$newTextArea.value = config.defaultValue || "";
		}
		$$.bindEvent($$newTextArea, "keypress", function(e){
			if (e.keyCode == 13) {
				e.stopPropagation();//panel içinde onEnterPress engelleme
			}
		});
		
		if(config.filter == "number"){
			$$.bindEvent($$newTextArea, "keypress", function(e){
				if(e.charCode == 0){
					return true;
				}
				if(e.charCode < 48 || e.charCode > 57){
					e.preventDefault();
					return false;
				}
			});
		}



		if (config.filter == "upper") {
			$$.bindEvent($$newTextArea, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$newTextArea.value = SIDEString.turkishToUpperCase($$newTextArea.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter == "upperEnglish") {
			$$.bindEvent($$newTextArea, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$newTextArea.value = SIDEString.turkishToEngUpperCase($$newTextArea.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter === "lower") {
			$$.bindEvent($$newTextArea, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$newTextArea.value = SIDEString.turkishToLoverCase($$newTextArea.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filter === "lowerEnglish") {
			$$.bindEvent($$newTextArea, "keyup", function (e) {
				// ctrl + a ve ctrl + c için selection kaybolması sorunu çözümü.
				e = e || window.event;
				var key = e.which || e.keyCode; // keyCode detection
				var ctrl = e.ctrlKey || (key === 17); // ctrl detection
				if (ctrl && (key === 65 || key === 67)) {
					return;
				}
				if (ctrl && key == 17) {
					return;
				}
				var caretPosition = this.selectionStart;
				var caretPositionEnd = this.selectionEnd;
				$$newTextArea.value = SIDEString.turkishToLoverCase($$newTextArea.value);
				this.setSelectionRange(caretPosition, caretPositionEnd);
				bc.changedFlag = true;
			}, false);
		}
		if (config.filterRegex) {
			$$.bindEvent($$newTextArea, "keypress", function (e) {
				if (isInIt([186, 188, 190, 219, 221, 222], e.which)) {
					return true;
				}
				var input = String.fromCharCode(e.which);
				try {
					var regex = new RegExp(config.filterRegex);
					if (!regex.test(input)) {
						e.preventDefault();
						return false;
					}
				} catch (ex) {
					e.preventDefault();
					return false;
				}
			});
		}
		if (config.sql || config.filter == "number") {
			$$.bindEvent($$newTextArea, "keypress", function (e) {
				if (config.sql) {
					if (e.which == 37 || e.which == 91 || e.which == 93 || e.which == 95 || e.which == 94) {
						e.preventDefault();
						return false;
					}
				}
				if (config.filter == "number") {
					if (e.charCode == 0) {//backspace, tab, del vs
						return true;
					}
					if (e.charCode < 48 || e.charCode > 57) {//[0..9]
						e.preventDefault();
						return false;
					}
				}
			});
		}
		
		if(bf.isRequired()){
			$$.addClass($$newTextArea, "csc-required");
		}
		bc.applyInlineValidation($$newTextArea);
		$container.appendChild($$newTextArea);
		if (config.charLength){
			var $$charLengthSpan = $$.create("span", null, ["char_length", config.cssClass + "char_length"]);
			$container.appendChild($$charLengthSpan);
			$$charLengthSpan.innerHTML = $$newTextArea.value.length + "/" +  config.maxlength;
			$$.bindEvent($$newTextArea, "keydown", function(e){
				$$charLengthSpan.innerHTML = ($$newTextArea.value.length + 1) + "/" +  config.maxlength;
				if ($$newTextArea.value.length + 1 > config.maxlength) {
					$$charLengthSpan.innerHTML = config.maxlength + "/" + config.maxlength;
				}
			});
		}
	}
};
BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "changed") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onchange = callback;
		}
	} else if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	} else if (eventName == "onkeypress") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onkeypress = callback;
		}
	} else if (eventName == "onkeyup") {
		var dom = byid(this.config.id);
		if (typeof dom != "undefined" && dom != null) {
			dom.onkeyup = callback;
		}
	}
};
})(window);
/****************************=csc-announcement.js=******************************/
(function(window, undefined) {
//global_declarations
//global console, byid, BaseBC, BCEngine
/**
* @class CSC-ANNOUNCEMENT
*/
function Definition() {
    this.DEFAULTS = {
        controlPanel: true,
        timer: 1000,
        shownItemCount: 3
    };
    this.BaseBF = "NON-BUSINESS";
    this.LABEL = "Announcement";
    this.METHODS = ["setData(data)"];
    this.EVENTS = ["selected(data)", "onload"];
    this.DISABLE_EVENTS = [];
    this.Type = function () {
        this.prototype = new BaseBC();
    };
}

var def = new Definition();
//def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-ANNOUNCEMENT", def);
var BC = def.Type;
BC.prototype = new BaseBC();
BC.prototype.createMainHTML = function (wrapper) {
    "use strict";
    var self = this, config = self.config;
    wrapper.setAttribute("id", config.id);

    self.container = document.createElement("div");
    if (config.cssClass){
        $$.addClass(self.container, config.cssClass);
    }
    $$.addClass(self.container, "csc-duyuru");
    wrapper.appendChild(self.container);

    self.announcementList = document.createElement("ul");
    $$.addClass(self.announcementList, "csc-duyuru__list");
    self.container.appendChild(self.announcementList);

    if (config.controlPanel) {
        var controlPanel = document.createElement("div");
        $$.addClass(controlPanel, "csc-duyuru__control-panel");
        self.container.appendChild(controlPanel);

        var prevLink = document.createElement("a");
        $$.addClass(prevLink, "csc-duyuru__prev");
        var prevLinkIcon = document.createElement("i");
        $$.addClass(prevLinkIcon, "fa fa-angle-up");
        prevLink.appendChild(prevLinkIcon);
        prevLink.addEventListener("click", function () {
            self.prevItem();
        });
        controlPanel.appendChild(prevLink);

        var nextLink = document.createElement("a");
        $$.addClass(nextLink, "csc-duyuru__next");
        var nextLinkIcon = document.createElement("i");
        $$.addClass(nextLinkIcon, "fa fa-angle-down");
        nextLink.appendChild(nextLinkIcon);
        nextLink.addEventListener("click", function () {
            self.nextItem();
        });
        controlPanel.appendChild(nextLink);
        console.log("Announcemet list control panel added...");
    }
    self.createAnnouncementList();
};

BC.prototype.nextItem = function () {
    var self = this;
    var firstElement = self.announcementList.firstElementChild;
    $$.addClass(firstElement, "itemHide");
    setTimeout(function () {
        self.announcementList.appendChild(firstElement);
        $$.rmClass(self.announcementList.lastElementChild, "itemHide");
    }, 500);
};

BC.prototype.prevItem = function () {
    "use strict";
    var self = this;
    var lastElement = self.announcementList.lastElementChild;
    $$.addClass(lastElement, "itemHide");
    self.announcementList.insertBefore(lastElement, self.announcementList.childNodes[0]);
    setTimeout(function () {
        $$.rmClass(lastElement, "itemHide");
    }, 1);

};

BC.prototype.run = function () {
    var self = this, config = self.config;
    if (self.data.length <= config.shownItemCount) {
        return;
    }
    function runTimer() {
        self.timer = setInterval(function () {
            self.nextItem();
        }, config.timer);
    }
    self.container.addEventListener("mouseover", function () {
        clearInterval(self.timer);
    });
    self.container.addEventListener("mouseleave", function () {
        runTimer();
    });
    runTimer();
    console.log("Announcemet list timer runing... (" + config.timer + " second/s.)");
};

BC.prototype.createAnnouncementList = function () {
    "use stirct";
    var self = this, config = self.config;
    if (!self.announcementList) {
        self.reRender();
        return;
    }
    self.announcementList.innerHTML = "";
    if(self.data.length > 0){
		self.data.forEach(function (elem) {
			var listItem = document.createElement("li");
            $$.addClass(listItem, "csc-duyuru__list__item");
			self.announcementList.appendChild(listItem);

			if (elem.img && elem.img.length > 0) {
				var img = document.createElement("img");
                $$.addClass(img, "csc-duyuru__image");
				img.setAttribute("src", elem.img + "?pm=smplpr_smplmd");
				listItem.appendChild(img);
				self.withImg = true;
                $$.addClass(self.announcementList, "has-image");
			}

			var rightPart = document.createElement("div");
            $$.addClass(rightPart, "csc-duyuru__right-part");
			listItem.appendChild(rightPart);

			var time = document.createElement("time");
            $$.addClass(time, "csc-duyuru__time");
			time.innerHTML = elem.date;
			rightPart.appendChild(time);

			var itemText = document.createElement("span");
            $$.addClass(itemText, "csc-duyuru__text");
			itemText.innerHTML = elem.title;
			rightPart.appendChild(itemText);

			listItem.addEventListener("click", function (e) {
				self.bf.fire("selected", elem);
                e.stopPropagation();
			});
			if (!self.withImg) {
				self.heightARR.push(listItem.offsetHeight);
			}
		});
        self.heightARR.forEach(function (elem) {
            if (elem > self.height) {
                if (elem > 60) {
                    self.height = 60;
                    return;
                }
                self.height = elem;
            }
        });
        if (!self.withImg) {
            var announcementListItemIndex = 0;
            for (announcementListItemIndex = 0; announcementListItemIndex < self.announcementList.children.length; announcementListItemIndex += 1) {
                self.announcementList.children[announcementListItemIndex].style.height = (self.height + 20) + "px";
                self.announcementList.children[announcementListItemIndex].querySelector(".csc-duyuru__text").style.height = (self.height - 20) + "px";
            }
        } else {
            self.height = 69;
        }
        self.announcementList.style.height = (config.shownItemCount * (self.height + 20)) + "px";
        console.log("Announcemet list items ready...");
        if (config.timer > 0) {
            self.run();
        } else {
            console.log("Announcemet list done.");
        }
    } else {
        console.log("Announcemet list data not found.");
    }
};

/**
* @function setData
* @description menu için data gönderir.
* @example [
{
  "img":"img/001.jpg",
  "date":"00.00.0000",
  "text":"Praesent eget tristique ex.",
  "title": ""
},{
    "img":"",
    "date":"00.00.0000",
    "text":"Nulla eu condimentum lectus",
  "title": ""
},{
    "img":"img/003.jpg",
    "date":"00.00.0000",
    "text":"Proin vulputate, felis id varius bibendum, erat ipsum ultricies est, et interdum eros quam ac orci. Proin vulputate, felis id varius bibendum, erat ipsum ultricies est, et interdum eros quam ac orci.",
  "title": ""
},{
    "img":"img/004.jpg",
    "date":"00.00.0000",
    "text":"Mauris bibendum justo sagittis, tincidunt elit eu, commodo lectus. ",
  "title": ""
},{
    "img":"img/005.jpg",
    "date":"00.00.0000",
    "text":"Vivamus faucibus"
},{
    "img":"img/006.jpg",
    "date":"00.00.0000",
    "text":"Suspendisse aliquam posuere",
  "title": ""
}
]
* img şart değildir.
*/
BC.prototype.setData = function (data) {
    "use strict";
    this.data = data;
    //this.createAnnouncementList();
    this.reRender();
};

BC.prototype.load = function () {
    this.bf.fire("onload");
};

BC.prototype.render = function (wrapper) {
    "use strict";
    this.heightARR = [];
    this.height = 0;
    this.timer = null;
    this.withImg = false;
    this.wrapper = document.createElement("div");
    this.wrapper.id = this.getConfig().id;
    wrapper.appendChild(this.wrapper);
    this.timer = null;
    if (this.data){
        this.createMainHTML(this.wrapper);
    }
};

BC.prototype.bindEvent = function (eventName, callback) {
    if (eventName === "selected") {
        var dom = byid(this.config.id);
        if (dom !== "undefined" && dom !== null) {
            dom.onclick = callback;
        }
    }
};
})(window);
/****************************=csc-html-element.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-HTML-ELEMENT
 */
function Definition(CS) {
	this.METHODS = ["setInnerHTML(str)"];
	this.EVENTS = ["selected", "changed"];
	this.BaseBF = "BASIC";
	this.Type = function () {	};
}
var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-HTML-ELEMENT", def);

var BC = def.Type;

/**
 * @function setInnerHTML
 * @description HTML içeriğini ayarlar.
 * @param [str] HTML kodlarının yer aldığı içerik
 */
BC.prototype.setInnerHTML = function (str) {
	this.config.innerHTML = str;
	this.bf.fire("changed");
	this.bf.rerender();
};

BC.prototype.render = function ($container) {
	var $element = $("<div>").attr("id", this.config.id).addClass("csc-html-element").addClass(this.config.cssClass);
	$element.css("display", this.config.visible ? "" : "none");
	$element.css(this.config.style || {});
	if(inDesigner(this.bf)) {
		$element.css("background-image", "url('designer/img/027.gif')");
		$element.css("height", this.config.height || "50px");
	} else {
		$element.html(this.config.innerHTML || "");
	}
	$container.appendChild($element[0]);
};

BC.prototype.bindEvent = function (eventName, callback) {
	if(eventName == "selected") {
		this.clickBinded = true;
		var dom = byid(this.config.id);
		if(typeof dom != "undefined" && dom != null) {
			dom.onclick = callback;
		}
	}
};

})(window);
/****************************=csc-wizard.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-WIZARD
 * @classdesc Wizard component
 * @author Erce Can Balcıoğlu
 */
function Definition(CS) {
	this.DEFAULTS = {
		focusable: true
	};

	this.BaseBF = "NON-BUSINESS";
	this.METHODS = [ "nextStep","prevStep","setTabPanel(tab)", "hide(tabName)", "show(tabName)", "setStepTitle(tabName, value)", "setStepDescription(tabName, value)", "setStepDisabled(tabName, value)", "setStepActive(tabName, value)", "setStepFocused(tabName, value)"];
	this.EVENTS = [ "selected" ];
	this.DISABLE_EVENTS = [ "selected" ];
	this.Type = function() {};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-WIZARD", def);

var BC = def.Type;
//var tabPanel;

BC.prototype.init = function() {
	this.stepMap = {};
};

BC.prototype.render = function($container) {
	var bc=this,
		bf=bc.bf,
		config=bc.config;

	if(config.cssClass){
		$container.classList.add(config.cssClass);
	}

	if(config.style) {
        if(config.style.width){
            if(config.style.width.indexOf("px")<0){
                config.style.width=config.style.width+"px";
            }
            $container.style.width=config.style.width;
        }
        if(config.style.height){
            if(config.style.height.indexOf("px")<0){
                config.style.height=config.style.width+"px";
            }
            $container.style.height=config.style.width;
        }
	}

	var self=this;
	self.container=$container;
    var stepNavBar=document.createElement("ul");
    stepNavBar.setAttribute("id",this.config.id);
    self.container.appendChild(stepNavBar);

	if(this.tab) {
        var config = self.config;
        self.tabPanel = this.tab;
        self.tabPanel.bcRef.config.showButtons=false;

        stepNavBar.classList.add("wizard-ul");

        self.tab.on("tabClosed", this, function(bindObj, tabName){
            var name = this.removeStep(tabName);
            self.tab.selectTab(name);
            self.stepMap[name].disabled = false;
            self.stepMap[name].active = true;
            self.stepMap[name].focused = true;
            self.setTabConfig();
        });

        self.tab.on("tabSelected", this, function(bindObj, tab){
        	var tabName = tab.$CS$.name;
            self.stepMap[tabName].disabled = false;
            self.stepMap[tabName].active = true;
            self.setAllFocusedFalse();
            self.stepMap[tabName].focused = true;
            self.setTabConfig();
        });
		if (self.stepMap.rendered === undefined) {
			//self.stepMap.rendered = true;
			//self.tab.bcRef.reRender();
		}
		var flag=0;

        function createStepButtons(tabMember, id) {

            var stepNavBarItem=document.createElement("li");
            if(config.style){
                if(config.style.buttonsWidth){
                    if(config.style.buttonsWidth.indexOf("px")<0){
                        config.style.buttonsWidth=config.style.buttonsWidth+"px";
                    }
                    stepNavBarItem.style.width=config.style.buttonsWidth;
                }
                if(config.style.stepDescNowrap){
                    stepNavBarItem.classList.add("wizard-li--nowrap");
                }
            }
            stepNavBarItem.classList.add("wizard-li");
            stepNavBarItem.name = tabMember.$CS$.name;
            var stepInfo = getStepInfo(tabMember.$CS$.name, self.tab, tabMember, self.mainPage);
            if (typeof stepInfo === "string") {
                var stepTitle=document.createElement("div");
                stepTitle.innerHTML=stepInfo;
                stepTitle.classList.add("step-title");
                stepNavBarItem.appendChild(stepTitle);
            }
            else {
                var tempObj = stepInfo;
				/* Adding title */
                var stepTitle=document.createElement("div");
                stepTitle.innerHTML=tempObj.title;
                stepTitle.classList.add("step-title");
                stepNavBarItem.appendChild(stepTitle);

				/* Adding description if it exists */
                if(typeof tempObj.description === "string" && tempObj.description !== "") {
                    var stepDesc=document.createElement("div");
                    stepDesc.classList.add("step-desc");
                    stepDesc.innerHTML=tempObj.description;
                    stepNavBarItem.appendChild(stepDesc);
                }
				/* Adding stepInfo object to stepMap */
                flag++;
            }

            stepNavBar.appendChild(stepNavBarItem);
			if (config.stepSelect !== false) {
				stepNavBarItem.addEventListener("click",function () {
					if(stepNavBarItem.classList.toString().indexOf("active-wizard-li") != -1 && stepNavBarItem.classList.toString().indexOf("focused-wizard-li") == -1) {
						var selectedTabName = self.tabPanel.getSelectedTab();
						self.tab.selectTab(tabMember.$CS$.name);
						/* focus on clicked active class */
						self.stepMap[tabMember.$CS$.name].focused = true;
						self.stepMap[selectedTabName.$CS$.name].focused = false;
						self.setTabConfig(); // Set step config from updated stepMap
					}

				})
			}
        }
        var tabMembers=self.tab.members;

        for(var elem in tabMembers) {
            createStepButtons(tabMembers[elem]);
        }
        self.setTabConfig(); // Set step config from created stepMap
    }
};

BC.prototype.setActiveClass = function (selectedTabLabel) {
	var bc = this;
	var thisContainer = document.getElementById(bc.config.id);
	if (!thisContainer) {
		return;
	}
	var li = thisContainer.getElementsByClassName("wizard-li");
	for(var i=0; i<li.length; i++) {
		if(li[i].outerText == selectedTabLabel) {
			li[i].classList.add("active-wizard-li");
			li[i].classList.add("focused-wizard-li");
			li[i].classList.remove("disabled-wizard-li");
		}
		else {
			li[i].classList.remove("focused-wizard-li");
		}
	}
}

/* Sets all focused attr false in stepMap */
BC.prototype.setAllFocusedFalse = function () {
	for(var elem in this.stepMap) {
		this.stepMap[elem].focused = false;
	}
}

/**
 * Sets step title
 * @param tabName [string]
 * @param value [string]
 */
BC.prototype.setStepTitle = function (tabName, value) {
	this.stepMap[tabName].title = value;
	this.setTabConfig();
	var bc = this;
	var thisContainer = document.getElementById(bc.config.id);
	if (!thisContainer) {
		return;
	}
	var li = thisContainer.getElementsByClassName("wizard-li");
    for(var i=0; i<li.length; i++) { //Travels each li tag member
        if(typeof li[i] != "undefined" && li[i].name == tabName)
        {
            li[i].childNodes[0].innerText = value;
        }
    }
}

/**
 * Sets step description
 * @param tabName [string]
 * @param value [string]
 */
BC.prototype.setStepDescription = function (tabName, value) {
	this.stepMap[tabName].description = value;
    this.setTabConfig();
	var bc = this;
	var thisContainer = document.getElementById(bc.config.id);
	if (!thisContainer) {
		return;
	}
	var li = thisContainer.getElementsByClassName("wizard-li");
    for(var i=0; i<li.length; i++) { //Travels each li tag member
        if(typeof li[i] != "undefined" && li[i].name == tabName)
        {
            li[i].childNodes[1].innerText = value;
        }
    }
}

/**
 * Sets step disabled attribute
 * @param tabName [string]
 * @param value [true,false]
 */
BC.prototype.setStepDisabled = function (tabName, value) {
	this.stepMap[tabName].disabled = value;
    this.stepMap[tabName].active = !value;
    this.setTabConfig();
}

/**
 * Sets step active attribute
 * @param tabName [string]
 * @param value [true,false]
 */
BC.prototype.setStepActive = function (tabName, value) {
    this.stepMap[tabName].disabled = !value;
	this.stepMap[tabName].active = value;
	var activeIndex = Object.keys(this.stepMap).indexOf(tabName);
	var forIndex = 0;

	//var activeFlag = false;
	console.log();
	for (var i in this.stepMap){
		if (forIndex <= activeIndex){
			this.stepMap[i].disabled = !value;
			this.stepMap[i].active = value;
			this.stepMap[i].focused = value;
		}
		forIndex += 1;
		 /*else {
			this.stepMap[i].active = !value;
			this.stepMap[i].focused = !value;
			if (activeFlag) {
				this.stepMap[i].disabled = value;
			} else {
				this.stepMap[i].disabled = !value;
			}
		}*/
	}
	console.log(this.stepMap);
    this.setTabConfig();
}

/**
 * Sets step focused attribute
 * @param tabName [string]
 * @param value [true,false]
 */
BC.prototype.setStepFocused = function (tabName, value) {
    this.setAllFocusedFalse();
	this.stepMap[tabName].focused = value;
    this.setTabConfig();
    this.tab.selectTab(tabName);
}

/* Set step config from stepMap */
BC.prototype.setTabConfig = function (rendered) {
	var bc = this;

	for(var i in this.stepMap) { //Travels each stepMap member
		var temp = this.stepMap[i];
		var thisContainer = document.getElementById(bc.config.id);
		if (!thisContainer) {
			return;
		}
		var li = thisContainer.getElementsByClassName("wizard-li");

		for(var elem=0; elem<li.length; elem++) { //Travels each li tag members
			if(li[elem].childNodes[0].innerText == temp.title || li[elem].innerText == temp.title) {//Match with stepMap members
				/* Adding focused-wizard-li class */
				if(temp.focused == true) {
					li[elem].classList.add("focused-wizard-li");
				}
				else {
					li[elem].classList.remove("focused-wizard-li");
				}

				/* Adding active-wizard-li class */
				if(temp.active == true) {
					li[elem].classList.add("active-wizard-li");
					li[elem].classList.remove("disabled-wizard-li");
				}
				else {
					li[elem].classList.remove("active-wizard-li");
				}

				/* Adding disabled-wizard-li class */
				if(temp.disabled == true){
					li[elem].classList.add("disabled-wizard-li");
					li[elem].classList.remove("active-wizard-li");
				}
				else {
					li[elem].classList.remove("disabled-wizard-li");
				}

				/* Adding hide-wizard-li class */
				if(temp.hidden == true) {
                    li[elem].classList.add("hidden-wizard-li");
				}
				else {
                    li[elem].classList.remove("hidden-wizard-li");
				}
			}
		}

		if (rendered) {
			this.stepMap.rendered = true;
		}
	}
}

/**
 * selects the next step
 */
BC.prototype.nextStep=function () {
	var self = this;
	var selectedTabName = self.tabPanel.getSelectedTab();
	var tabMembers = self.tabPanel.getMembers();
	for(var elem in tabMembers) {
		var temp = parseInt(elem);

        if(tabMembers[elem].$CS$.name == selectedTabName.$CS$.name && temp+1<tabMembers.length) {
            /* Setting current step in stepMap */
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].focused = false;
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].active = true;
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].disabled = false;
		    for(temp+=1;temp<tabMembers.length; temp++) {
                if (typeof self.stepMap[tabMembers[(temp).toString()].$CS$.name].hidden == "undefined" || self.stepMap[tabMembers[(temp).toString()].$CS$.name].hidden == false) {
                    self.tabPanel.selectTab(tabMembers[(temp).toString()].$CS$.name); //Selecting next tab
                    /* Setting next step in stepMap */
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].focused = true;
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].active = true;
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].disabled = false;

                    break;
                }
            }
            self.setTabConfig(true); //Set step config from created stepMap
		}
	}
};

/**
 * selects the previous step
 */
BC.prototype.prevStep=function () {
	var self = this;
	var selectedTabName = self.tabPanel.getSelectedTab();
	var tabMembers = self.tabPanel.getMembers();

	for(var elem in tabMembers) {
		var temp = parseInt(elem);

		if(tabMembers[elem].$CS$.name == selectedTabName.$CS$.name && -1<temp-1) {
            /* Setting current step in stepMap */
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].focused = false;
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].active = true;
            self.stepMap[tabMembers[(temp).toString()].$CS$.name].disabled = false;
            for(temp-=1;temp<tabMembers.length; temp--) {
                if (typeof self.stepMap[tabMembers[(temp).toString()].$CS$.name].hidden == "undefined" || self.stepMap[tabMembers[(temp).toString()].$CS$.name].hidden == false) {
                    self.tabPanel.selectTab(tabMembers[(temp).toString()].$CS$.name); //Selecting next tab
                    /* Setting next step in stepMap */
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].focused = true;
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].active = true;
                    self.stepMap[tabMembers[(temp).toString()].$CS$.name].disabled = false;

                    break;
                }
            }
            self.setTabConfig(true); //Set step config from created stepMap
		}
	}
};

BC.prototype.hide=function (tabName) {
    var self = this;

    if(self.tab.getTabByName(tabName) && self.stepMap[tabName]) {
        var selectedTabName = self.tab.getTabByName(tabName);
        /* Hides the chosen tab */
        self.stepMap[tabName].hidden = true;
        self.stepMap[tabName].disabled = true;
        self.stepMap[tabName].active = false;
        self.stepMap[tabName].focused = false;

        /* Looks for the first tab which is not hidden */
        var firstTabName;
        for (var elem in self.stepMap) {
            if (typeof self.stepMap[elem].hidden == "undefined" || self.stepMap[elem].hidden == false) {
                firstTabName = self.tab.getMember(elem).$CS$.name;
                break;
            }
        }

        if (firstTabName) {
            /* Selects the first tab */
            self.stepMap[firstTabName].hidden = false;
            self.stepMap[firstTabName].disabled = false;
            self.stepMap[firstTabName].active = true;
            self.stepMap[firstTabName].focused = true;
            self.tab.selectTab(firstTabName);
            self.setTabConfig();
        }
    }
};

BC.prototype.show=function (tabName) {
    var self = this;
    if(self.tab.getTabByName(tabName) && self.stepMap[tabName]) {
        var selectedTabName = self.tab.getTabByName(tabName);
        /* Shows the chosen tab */
        self.stepMap[tabName].hidden = false;
        self.setTabConfig();
    }
};

function getStepInfo(memberName, tab, tabMember, mainPage) {
	/* Checks if mainpage was sent as parameter, if it has getStepInfo function and if it getStepInfo function returns */
	if(typeof mainPage != "undefined" && typeof mainPage.getStepInfo == "function" && typeof mainPage.getStepInfo(memberName) != "undefined"){
		return mainPage.getStepInfo(memberName);
	}
	/* Checks tab's parent if it has getStepInfo function and if it getStepInfo function returns */
	else if(typeof tab.getParent().getStepInfo == "function" && typeof tab.getParent().getStepInfo(memberName) != "undefined") {
		return tab.getParent().getStepInfo(memberName);
	}
	/* Gets the title from tabMember */
	else {
		return tabMember.getConfig("title");
	}
}

BC.prototype.removeStep = function(tabName) {
	var prevTabName;
	var self = this;
	var thisContainer = document.getElementById(bc.config.id);
	if (!thisContainer) {
		return;
	}
	var li = thisContainer.getElementsByClassName("wizard-li");
	for(var i=0; i<li.length; i++) { //Travels each li tag member
		if(typeof li[i] != "undefined" && li[i].name == tabName)
		{
            delete self.stepMap[li[i].name];
            li[i].remove();
			for(var i in self.stepMap) {
			    if(typeof self.stepMap[i].hidden == "undefined" || self.stepMap[i].hidden == false) {
                    prevTabName = i;
			        break;
                }
            }
		}
	}
	return prevTabName;
}

BC.prototype.prepareSteps=function (tab) {
	var self=this, flag=0;
	var tabMembers = tab.members;
	for (var elem in tabMembers) {
		var tabMember=tabMembers[elem];
		var stepInfo = getStepInfo(tabMember.$CS$.name, self.tab, tabMember, self.mainPage);
		if (typeof stepInfo === "string") {
			var tempObj = {
				"title": stepInfo,
				"description": "",
				"disabled": false,
				"focused": false,
				"active": false,
				"hide": false
			};

			if (flag++ == 0) {
				tempObj.active = true;
				tempObj.focused = true;
			}
			else {
				tempObj.disabled = true;
			}

		} else {
			tempObj = stepInfo;
		}
		if (self.stepMap.rendered === undefined) {
			self.stepMap[tabMember.$CS$.name] = tempObj;
		}
	}
};


/**
 * Gets tab component and optional mainPage
 * to set tab panel and tabs with names and
 * properties according to returns from
 * getStepInfo function
 * @param tab
 * @param mainPage
 */
BC.prototype.setTabPanel=function (tab, mainPage) {
	this.tab = tab;
	this.mainPage = mainPage;
	this.prepareSteps(tab);
    this.reRender();
};



BC.prototype.bindEvent = function(eventName, callback) {
	if (eventName == "selected") {
		var dom = byid(this.config.id);
		if (dom) {
			dom.onclick = callback;
		}
	}
};
})(window);
/****************************=csc-tarih.js=******************************/
(function(window, undefined) {
/**
 * @class CSC-TARIH
 */
function Definition(CS) {
	this.DEFAULTS = {
		cls: "csc-tarih",
		focusable: true,
		disabledKey: "disabled",
		iconWidth: 32
	};

	this.BaseBF = "BASIC";

	this.METHODS = ["setMaxDate(date)", "setMinDate(date)", "setTips(tips)"];
	this.EVENTS = ["changed", "selected", "beforeShow","blur"];
	this.DEPENDENCIES = [
		{"name": "jquery-ui", "version": "1.12.0"},
		{"name": "jquery-maskedinput", "version": "1.3"},
		{"name": "jquery-ui-timepicker", "version": "1.3"}
	];

	this.Type = function () {
	};
}

var def = new Definition();
def.Type.prototype = new BaseBC();
BCEngine.registerType("CSC-TARIH", def);
var BC = def.Type;
BC.prototype.init = function () {
	var bc = this, config = bc.config;
	bc.ddf = "dd/mm/yyyy"; //ddf -> Default date format
	if (!config.dateFormat) {
		var LOCAL_MAP ={
			tr:{
				dateFormat:"dd/mm/yyyy",
			},
			en:{
				dateFormat:"mm/dd/yyyy",
			},
			az:{
				dateFormat:"dd.mm.yyyy"
			},
		}
		var locale = SSession.getAny("LOCALE_DATE", "LOCALE") || window.sideLang;
		config.dateFormat = LOCAL_MAP[locale].dateFormat|| bc.ddf;
	}

	if (config.onlyMY) {
		config.dateFormat = "mm/yyyy";
		config.returnFormat = "mmyyyy";
	}
	if (config.initToday) {
		config.value = SIDEDateUtil.getFormattedDateByDate(new Date(), config.dateFormat || bc.ddf);
	}

	if (config.dateFormat || bc.ddf) {
		bc.emptyMask = (config.dateFormat || bc.ddf).replace("yyyy", "____").replace("mm", "__").replace("dd", "__");
	}
};

BC.prototype.setMaxDate = function (date) {
	var bc = this, config = bc.config;
	if (!(date instanceof Date)) {
		date = SIDEDateUtil.getDateObjFromString(date, "yyyymmdd");
	}
	config.maxDate = date;
	var $tarih = $("#date-" + config.id);
	if ($tarih) {
		$tarih.datepicker("option", "maxDate", config.maxDate);
	}
};

BC.prototype.focus = function () {
	$$txt = $$.byid("date-" + this.config.id);
	if ($$txt) {
		$$txt.focus();
	}
};

BC.prototype.setMinDate = function (date) {
	var bc = this, config = bc.config;
	if (!(date instanceof Date)) {
		date = SIDEDateUtil.getDateObjFromString(date, "yyyymmdd");
	}
	config.minDate = date;

	var $tarih = $("#date-" + config.id);
	if ($tarih) {
		$tarih.datepicker("option", "minDate", config.minDate);
	}
};

BC.prototype.getRawValue = function() {
	return this.getValue("yyyymmdd");
};

BC.prototype.getValue = function (returnFormat) {
	var bc = this, config = bc.config, value = bc.getText();
	if (value.indexOf('_') >= 0) {//mask geliyor
		return "";
	}
	returnFormat = returnFormat || config.returnFormat;
	if (stringTrim(value) == "" || !returnFormat || returnFormat == "same") {
		return value;
	}
	return SIDEDateUtil.getFormattedDate(value, config.dateFormat || bc.ddf, returnFormat || config.dateFormat || bc.ddf);
};

BC.prototype.setValue = function (value) {
	var bc = this, config = bc.config;
	if (value === undefined || value === null) {
		value = "";
	}

	var format = config.dateFormat;
	if (config.returnFormat) {
		if (config.returnFormat == "same") {
			format = config.dateFormat || bc.ddf || config.returnFormat;
			config.returnFormat = format;
		} else {
			format = config.returnFormat;
		}
	};

	// Date Valid değilse hata mesajı atıp dön;
	if (stringTrim(value) != "" && !SIDEDateUtil.isValidDate(value, format)) {
		return;
	}

	config.value = SIDEDateUtil.getFormattedDate(value, config.returnFormat, config.dateFormat || bc.ddf);
	var domObject = byid("date-" + config.id);
	if (domObject) {
		domObject.value = config.value;
		if (config.value == "") {
			$(domObject).trigger("clearmask");
		}
	} else {// readonly durumunu kontrol et
		var domObject = byid(config.id);
		if (domObject) {
			domObject.innerHTML = config.value;
		}
	}

	if( getSideDefaults("support-changed-event-on-setvalue") ){
		bc.bf.fire("changed");
	}
};

BC.prototype.saveState = function () {
	var bc = this, config = bc.config;
	var $$dom = byid("date-" + config.id) || byid(config.id);
	if (!$$dom) {
		return;
	}
	config.value = bc.getText();
};

BC.prototype.getText = function () {
	var bc = this, config = bc.config;
	var $$dom = byid("date-" + config.id);
	var value = config.value || "";
	if ($$dom) {
		value = $$dom.value;
	} else {
		$$dom = byid(config.id);
		if ($$dom) {
			value = ($$dom.innerHTML == "--/--/----") ? "" : $$dom.innerHTML;
		}
	}
	return value;
};

BC.prototype.destroybc = function () {
	var bc = this, config = bc.config;
	var $tarih = $("#date-" + config.id);
	if (!bc.selectEvent && $tarih.datepicker("widget").is(":visible")) {
		bc.fireDestroy = true;
		bc.destroys = bc.destroys || [];
		bc.destroys.push($tarih);
		return;
	}
	if (bc.selectEvent) {
		window.setTimeout(function () {
			for (var i = 0; bc.destroys && i < bc.destroys.length; i++) {
				bc.destroys[i].datepicker("destroy").unmask().off();
			}
			bc.destroys = [];
		}, 1);
	} else {
		$tarih.datepicker("destroy").unmask().off();
	}
};

/**
 * @function setTips
 * @description Sets tooltip of component
 * @param {string} tips - tooltip
 **/
BC.prototype.setTips = function (tips) {
	var bc = this, config = bc.config;
	config.tips = tips || "";
	var $$p = $$.byid(config.id);
	if ($$p) {
		$$p.setAttribute("title", config.tips);
	}
};
BC.prototype.ordinal_suffix_of = function (i) {
	var bc = this, config = bc.config;
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return "st";
	}
	if (j == 2 && k != 12) {
		return "nd";
	}
	if (j == 3 && k != 13) {
		return "rd";
	}
	return "th";
}
BC.prototype.humanViewChangeFormat = function () {
	var bc = this, config = bc.config;
	if(!config.value){
		return "";
	}

	var date = SDate.getDateObjFromString(config.value, config.returnFormat);
	var months = [SideMLManager.get("common.january"), SideMLManager.get("common.february"), SideMLManager.get("common.march"),
		SideMLManager.get("common.april"), SideMLManager.get("common.may"), SideMLManager.get("common.june"),
		SideMLManager.get("common.july"), SideMLManager.get("common.august"), SideMLManager.get("common.september"),
		SideMLManager.get("common.october"), SideMLManager.get("common.november"), SideMLManager.get("common.december")];

	if (window.sideLang == "en") {
		return months[d.getMonth()] + " " + date.getDate() + this.ordinal_suffix_of(date.getDate()) + " " + date.getFullYear();
	}
	else {
		return date.getDate() + " " + months[d.getMonth()] + " " + date.getFullYear();
	}
};

BC.prototype.render = function ($container) {
	var bc = this, bf = bc.bf, config = bc.config, readonly = bf.isReadonly();
	var value = config.value || "";
	if (readonly) {
		var $$tarih = $$.create("SPAN", {"id": config.id}, "csc-rospan");
		if (value ==="") {
			$$tarih.innerHTML = "--/--/----";
		}else{
			$$tarih.innerHTML = value;
		}
		if (inDesigner(bf)) {
			$$tarih.innerHTML = "01/01/1901";
		}
		if (config.cssClass) {
			$$.addClass($$tarih, config.cssClass);
		}
		if (config.tips) {
			$$.attr($$tarih, "title", config.tips);
		}
		$container.appendChild($$tarih);
		if (config.readonlyFormat == "human-view") {
			$$tarih.innerHTML = this.humanViewChangeFormat();
		}
	}	else {
		var disabled = bf.isDisabled();
		var dateFormat = config.dateFormat || bc.ddf;
		var $$tarihDiv = $$.create("DIV", {id: config.id}, "csc-tarih-container");
		if (config.style && config.style.width) {
			var size = parseInt(config.style.width.split("px")[0], 10);
			if(config.iconWidth){
				size = size + parseInt(config.iconWidth, 10);
			}
			$$tarihDiv.style.minWidth = size + "px";
			$$tarihDiv.style.width = size + "px";
		}

		if (config.tips) {
			$$.attr($$tarihDiv, "title", config.tips);
		}

		var placeHolder = config.placeholder;
		if (config.placeholder == "auto") {
			placeHolder = dateFormat;
			if (window.sideLang == "tr") {
				placeHolder = placeHolder.replace("dd", "gg").replace("mm", "aa");
			}
		}

		var $$tarih = $$.create("INPUT", {id : "date-" + config.id, placeholder: placeHolder,"tabindex": config.tabIndex, type : "text", value : value}, ["csc-tarih", config.cssClass], config.style);
		if(disabled || config.onlyPicker){
			$$tarih.setAttribute(config.disabledKey,config.disabledKey);
		}
		$$tarihDiv.style.display = config.visible ? "" : "none";

		if(bf.isRequired()){
			$$.addClass($$tarih, "csc-required");
		}
		$$tarihDiv.appendChild($$tarih);
		$container.appendChild($$tarihDiv);

		if(SModules[this.bf.getModuleName()]){
			var pm = SModules[this.bf.getModuleName()].pm;
		}
		if ( config.iconSource && (config.iconSource.indexOf("pm=") === -1) ) {
			config.iconSource = (["dev","designer","dashboard"].indexOf(window.sideRuntimeEnvironment) < 0 ? config.iconSource : SUtil.addParamToUrl(config.iconSource, "pm", pm) );
		}
		if (!disabled) {
			// Create DatePicker
			var $tarih = $($$tarih);
			$tarih.datepicker({
				showOn: "button",
				changeMonth: true,
				changeYear: true,
				buttonImage: config.iconSource || "css/bc-style/img/calendar.png",
				buttonImageOnly: true,
				buttonText: config.tips || "",
				yearRange: config.yearRange,
				reverseYearRange: config.reverseYears,
				showButtonPanel: true,
				onSelect: function (date) {
					if (config.onlyMY) {
						return;
					}
					$tarih.val(date);
					bc.blurFired = true;
					$tarih.blur();
					delete bc.blurFired;
					bf.fire("selected");
					bc.selectEvent = true;
					if (bc.fireDestroy) {
						bc.destroybc();
					}
					bc.selectEvent = false;
				},
				beforeShow: function () {
					bc.calenderIsOpen = true;
					if (config.onlyMY) {
						$("#ui-datepicker-div").addClass("csc-tarih-no-days");
					}
					bf.fire("beforeShow");
				},
				onClose: function () {
					if (config.onlyMY) {
						bc.blurFired = true;
						$tarih.blur();
						var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
						var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
						month = parseInt(month, 10) + 1;
						if (month < 10) {
							month = "0" + month;
						}
						$tarih.datepicker('option', 'defaultDate', new Date(year, month - 1, 1));
						$tarih.val(month + "/" + year);
						$("#ui-datepicker-div").removeClass("csc-tarih-no-days");
					}
					var error = bc.validate();
					if (error) {
						$$tarih.value = "";
						setMask();
						CSPopupUTILS.MessageBox(error);
					}

					bc.calenderIsOpen = false;

					this.focus();
				}
			});


			if (config.immError) {
				$$.bindEvent($$tarih, "blur", function () {
					if ($tarih.datepicker("widget").is(":visible")) {
						return;
					}
					var value = $$tarih.value;
					if (value == "" || value == bc.emptyMask) {
						$$tarih.value = "";
						return;
					}
					var error = bc.validate();
					if (error) {
						$$tarih.value = "";
						setMask();
						CSPopupUTILS.MessageBox(error);
					}

				});
			}

			$tarih.focus(function () {
				if (this.createTextRange) {
					var range = this.createTextRange();
					range.move('character', 0);
					range.select();
				} else {
					this.setSelectionRange(0, 1);
				}
			});

			$tarih.blur(function (){
				if(!bc.calenderIsOpen){
					bf.fire("blur");
				}
			});

			if (!config.onlyMY) {
				$tarih.datepicker("option", "dateFormat", dateFormat.replace("yyyy", "yy"));
				if (value) {
					$tarih.val(value);
				}
			}
			bc.applyInlineValidation($$tarih, $$tarihDiv);
			// Set Mask
			function setMask() {
				var mask = dateFormat.replace("dd", "99").replace("mm", "99").replace("yyyy", "9999");
				$tarih.mask(mask, {notclearvalue: true});
			}

			setMask();

			$tarih.datepicker("option", "minDate", config.minDate);
			$tarih.datepicker("option", "maxDate", config.maxDate);
		}
	}
};

BC.prototype.renderRequired = function (flag) {
	var bc = this, config = bc.config;
	if (!config.validation) {
		return;
	}
	var $$dom = $$.byid("date-" + config.id);
	if (!$$dom) {
		return;
	}
	if (config.validation.req) {
		$$.addClass($$dom, "csc-required");
	} else {
		$$.rmClass($$dom, "csc-required");
	}
};

BC.prototype.validate = function () {
	var bc = this, config = bc.config;
	var value = stringTrim(bc.getText());
	var format = config.dateFormat || bc.ddf;
	if (value != "" && value != bc.emptyMask) {
		var dateObj = SIDEDateUtil.getDateObjFromString(value, config.dateFormat || bc.ddf);
		if (config.minDate && config.minDate > dateObj) {
			return SideMLManager.get(bc, "dateIntervalError");
		}
		if (config.maxDate && config.maxDate < dateObj) {
			return SideMLManager.get(bc, "dateIntervalError");
		}
		return SIDEDateUtil.checkDate(value, format, config.rejectWeekend, config.label);
	}
};

BC.prototype.renderInlineVal = function ($val) {
	if (!this.bf.isReadonly()) {
		var $tarihDiv = $("#" + this.config.id);
		$tarihDiv.append($val);
	}
};

BC.prototype.bindEvent = function (eventName, callback) {
	var bc = this, config = bc.config, $$dom;
	if (eventName == "changed") {
		$$dom = $$.byid(config.id);
		if ($$dom) {
			var $tarih = $("#date-" + config.id);
			$$dom.onchange = function () {
				if ($tarih.datepicker("widget").is(":visible") && !bc.blurFired) {
					return;
				}
				callback();
			};
		}
	} else if (eventName == "selected") {
		$$dom = $$.byid(config.id);
		if ($$dom) {
			$$dom.onclick = callback;
			var bc = this;
			if (!inDesigner(bc.bf) && $$dom.tagName == "SPAN" && !bc.bf.isDisabled()) {
				$$.addClass($$dom, "csc-textbox-linked");
			}
		}
	}
};



})(window);
