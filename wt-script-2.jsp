(function(window, undefined) {
	function Definition(){
		this.VERSION = '1';
		this.MEMBERS = {"panel":{"bcName":"CSC-VERTICAL","MEMBERS":{"panel4":{"bcName":"CSC-VERTICAL","MEMBERS":{"img":{"bcName":"CSC-IMAGE"}}},"seperator":{"bcName":"CSC-SEPERATOR"},"title":{"bcName":"CSC-TITLE"}}},"userinfo":{"bcName":"CSC-VERTICAL","MEMBERS":{"userid":"E_KULLANICIKODU","password":"E_SIFRE"}},"btnPanel":{"bcName":"CSC-VERTICAL","MEMBERS":{"girisBtn":{"bcName":"CSC-BUTTON"}}},"linkPanel":{"bcName":"CSC-VERTICAL","MEMBERS":{"anaSayfaLink":{"bcName":"CSC-LINK"}}}};
		this.EVENTS = [{"name":"login","parameters":["component"]}];
		this.METHODS = [{"ispublic":false,"name":"ajaxcall","code":"var xmlhttp = new XMLHttpRequest();\n\nxmlhttp.onreadystatechange = function() {\n    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {\n        if(callback){\n            callback(xmlhttp.responseText);\n        }\n    }\n};\nvar paramStr = \"\";\nfor(var key in params){\n    if(typeof params[key] === \"string\"){\n        paramStr += key + \"=\" + params[key]+\"&\";\n    }else{\n        paramStr += key + \"=\" + JSON.stringify(params[key])+\"&\";\n    }\n}\n\n\nxmlhttp.open(\"POST\", SModuleManager.getAppUrl(SModuleManager.getLocalModuleName(), \"assos-login\"), true);\nxmlhttp.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded;charset=utf-8\");\nxmlhttp.send(paramStr);","parameters":["params","callback"]}];
		this.SCR = {"layoutConfig":{"minWidth":"400"},"visible":true,"style":{},"validation":{},"layout":"CSC-PAGE","border":true,"readonly":false,"disabled":false,"memberConfig":{"anaSayfaLink":{"title":"Ana Sayfaya Git","fontSize":"12","validation":{"regex":"1234567808"}},"btnPanel":{"layoutConfig":{"zindex":100},"horAlign":"center"},"girisBtn":{"title":"Giriş"},"img":{"layoutConfig":{},"src":"sf/img/logo-gib-kirmizi.png"},"linkPanel":{"layoutConfig":{"zindex":100},"horAlign":"right"},"panel":{"layoutConfig":{"zindex":100},"style":{"height":"90","width":""},"horAlign":"center"},"panel4":{"layoutConfig":{},"cssClass":"gibKirmiziBg","horAlign":"center"},"seperator":{"layoutConfig":{},"size":"10"},"title":{"title":"Oturum süreniz doldu. Lütfen tekrar giriş yapınız.","style":{}},"userid":{"sql":false,"label":"Kullanıcı Kodu","readonly":true},"userinfo":{"layoutConfig":{"zindex":100},"layout":"CSC-BASIC-FORM"}}};
		this.Business = function(){
		 var panel = null;
		 var panel4 = null;
		 var img = null;
		 var seperator = null;
		 var title = null;
		 var userinfo = null;
		 var userid = null;
		 var password = null;
		 var btnPanel = null;
		 var girisBtn = null;
		 var linkPanel = null;
		 var anaSayfaLink = null;
this.$$oc=function(n,i){window.z=i;eval(n+'=window.z;');}
this.$$destroy = function(){
this.panel = null;
this.panel4 = null;
this.img = null;
this.seperator = null;
this.title = null;
this.userinfo = null;
this.userid = null;
this.password = null;
this.btnPanel = null;
this.girisBtn = null;
this.linkPanel = null;
this.anaSayfaLink = null;
}
			this.init = function(){
				panel=BFEngine.get('panel',this);
				panel4=BFEngine.get('panel.panel4',this);
				img=BFEngine.get('panel.panel4.img',this);
				seperator=BFEngine.get('panel.seperator',this);
				title=BFEngine.get('panel.title',this);
				userinfo=BFEngine.get('userinfo',this);
				userid=BFEngine.get('userinfo.userid',this);
				password=BFEngine.get('userinfo.password',this);
				btnPanel=BFEngine.get('btnPanel',this);
				girisBtn=BFEngine.get('btnPanel.girisBtn',this);
				linkPanel=BFEngine.get('linkPanel',this);
				anaSayfaLink=BFEngine.get('linkPanel.anaSayfaLink',this);
this.$CS$.bindings = [{ on: "anaSayfaLink", event: "selected", f: function(component){
BFEngine.a();
try{

window.location = "/";

 
}finally{BFEngine.r();}
} },{ on: "girisBtn", event: "selected", f: function(component){
BFEngine.a();
try{
/*
this.call("login", userinfo.getValue()).then(function(resp){
    SPopupContext.getLasPopup().close();
    this.fire("login", resp);
});

*/

var me = this;

ajaxcall({
		assoscmd: "login",
		rtype: "json",
		userid: userid.getValue(),
		sifre: password.getValue(),
		parola: "1"
	}, function(resp){
	    if(resp){
	        resp = eval("("+resp+")");
	    }
	    if(resp.error) {
            if(resp.messages && resp.messages.length > 0){
                alert(resp.messages[0].text);
            } else {
                alert("Sunucu ile iletişimde problem var. Lütfen bir süre sonra tekrar deneyiniz.");
            }
		}
	    localStorage.setItem("token", resp.token);
	    SPopupContext.getLasPopup().close();
        me.fire("login", resp);
	});

 
}finally{BFEngine.r();}
} },{ on: "this", event: "oninit", f: function(component,param){
BFEngine.a();
try{

if(SSession.getEnv() == "dev"){
    userid.setReadonly(false);
}

if(param && param.message){
    title.setTitle(param.message);
}
var s_userid = SSession.getUserId();

if(SSession.getEnv() == "dev"){//SIDE test sayfasında mıyız?
    var kkodu = localStorage.getItem("test-last-user");
    var pwd = localStorage.getItem("test-last-user");
    
    userid.setValue(kkodu);
    password.setValue(pwd);
} else {//export durum (örneğin prod)
    userinfo.setVisible(false);
    btnPanel.setVisible(false);
}
 
}finally{BFEngine.r();}
} },{ on: "this", event: "onload", f: function(component,param){
BFEngine.a();
try{

if(userid.getValue()){
    password.focus();
} else {
    userid.focus();
}
    

 
}finally{BFEngine.r();}
} },{ on: "userinfo", event: "onEnterPressed", f: function(component){
BFEngine.a();
try{

girisBtn.fire("selected");

 
}finally{BFEngine.r();}
} },{ on: "this", event: "selected", f: function(component){
BFEngine.a();
try{
 
}finally{BFEngine.r();}
} },{ on: "this", event: "onopen", f: function(component,param){
BFEngine.a();
try{
 
}finally{BFEngine.r();}
} }];for(var i=0; i < this.$CS$.bindings.length ;i++){
	var b = this.$CS$.bindings[i];
	var bf = b.on == "this" ? this : BFEngine.get(b.on, this);
	if(bf){
		bf.on(b.event, this, b.f);
	}}

			var ajaxcall = function(params,callback) {
BFEngine.a();
try{
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if(callback){
            callback(xmlhttp.responseText);
        }
    }
};
var paramStr = "";
for(var key in params){
    if(typeof params[key] === "string"){
        paramStr += key + "=" + params[key]+"&";
    }else{
        paramStr += key + "=" + JSON.stringify(params[key])+"&";
    }
}


xmlhttp.open("POST", SModuleManager.getAppUrl(SModuleManager.getLocalModuleName(), "assos-login"), true);
xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
xmlhttp.send(paramStr); 
} finally{BFEngine.r();}
};
			};
		}
	}
	BFEngine.register('P_RE_LOGIN', new Definition());
})(window);
(function(window, undefined) {
	function Definition(){
		this.VERSION = '1';
		this.BC_REF = 'CSC-CS-METIN';
		this.EVENTS = [];
		this.METHODS = [];
		this.SCR = {"defaultName":"kKodu","label":"KULLANICI KODU","labelPosition":"inherited"};
		this.Business = function(){
this.$$oc=function(n,i){window.z=i;eval(n+'=window.z;');}
this.$$destroy = function(){
}
			this.init = function(){
this.$CS$.bindings = [];for(var i=0; i < this.$CS$.bindings.length ;i++){
	var b = this.$CS$.bindings[i];
	var bf = b.on == "this" ? this : BFEngine.get(b.on, this);
	if(bf){
		bf.on(b.event, this, b.f);
	}}			};
		}
	}
	BFEngine.register('E_KULLANICIKODU', new Definition());
})(window);
(function(window, undefined) {
	function Definition(){
		this.VERSION = '1';
		this.BC_REF = 'CSC-PASSWORDFIELD';
		this.EVENTS = [];
		this.METHODS = [];
		this.SCR = {"layoutConfig":{},"defaultName":"eSifre","style":{},"visible":true,"validation":{},"label":"Şifre","labelPosition":"inherited","readonly":false,"disabled":false};
		this.Business = function(){
this.$$oc=function(n,i){window.z=i;eval(n+'=window.z;');}
this.$$destroy = function(){
}
			this.init = function(){
this.$CS$.bindings = [];for(var i=0; i < this.$CS$.bindings.length ;i++){
	var b = this.$CS$.bindings[i];
	var bf = b.on == "this" ? this : BFEngine.get(b.on, this);
	if(bf){
		bf.on(b.event, this, b.f);
	}}			};
		}
	}
	BFEngine.register('E_SIFRE', new Definition());
})(window);


	var sideRefDataVers = "{}";

	function initSession(flow, puttoken, useNewToken) {
		if (useNewToken)
			sideToken = null;

		if (!sideToken || sideToken === "null") {
			sideToken = CSSession.getToken();
			if (!sideToken) {
				sideToken = localStorage.getItem("token");
				if (!sideToken)
					sideToken = getid();//sompo için gerekli
			}
		}

		localStorage.setItem("token", sideToken);

		if (!sideIsOpenBf && !getSideDefaults("support-multi-page")) {
			$$.bindEvent(window, "storage", function (e) {
				if ($$.isie())
					return;

				if (e.key !== 'token')
					return;

				if (e.key !== sideToken)
					window.location = "login.html?dl=e";
			});
		}

		CSSession.setToken(sideToken);
		CSSession.set("SIDE-THEME", sideTheme);
		CSSession.setModuleName("portal");


		var noRefData = false;

        CSCaller.call(
            getSideDefaults("sn-getUserSessionInfo"), {
                rfDataInfo: noRefData ? [] : SRefDataManager.getAppRefVersionInfo(),
                token: puttoken !== false ? sideToken : undefined
            }
        ).then(function (resp) {
            CSSession.setSession(resp);
            if (resp.rfDeleteList && resp.rfDeleteList.length > 0)
                SRefDataManager.removeAppRefdata(resp.rfDeleteList, flow);
            else
                flow();
        }).error(function (resp) {
            GlobalBusinessEvents.onReLogin(function () {
                initSession(flow, false, true);
            });
        });

	}

	function initServiceManager(flow) {
		CSServiceManager = new CsServiceManager();
		flow();
	}

	function loadServiceList(flow) {
		CSServiceManager.init(flow);
	}

	function loadRequired3Libs(callback){
		if(required3Libs && required3Libs.length){
			required3Libs = SLibraryLoader.sort3LibNamesByOrder(required3Libs);
			SAsync.map(
				required3Libs,
				function (lib, flow) {
					SLibraryLoader.loadLib(lib, undefined, { serieLoad: true}, flow);
				},
				callback
			);
		} else {
            callback();
        }
	}

	var SRefDataManager = null;

	function initRefDataManager(flow) {
		SRefDataManager = new RefDataManager("designer");
		SRefDataManager.init(flow);
	}

	function initAuthorization(flow) {
		var authManager = CSSession.get("AUTH_MANAGER");
		if (authManager === true || authManager === "true") {
			CSAuthorizationMan = new CSAuthorizationManager();
			CSAuthorizationMan.init(true, flow);
		} else {
			//createSession-auth-sn varsa global olarak yetki tanımı gerekmiyordur ama modül özelinde yetki tanımlarını istemek gerekir.
			if (window.getSideDefaults("createSession-auth-sn")) {
				CSAuthorizationMan = new CSAuthorizationManager();
				SideModuleManager.loadAuthInfo(SideModuleManager.getLocalModuleName(), function (success) {
					if (success)
						flow();
					else
						flow("Authorization load error");
				});
			} else {
				flow();
			}
		}
	}

	function initPage(flow) {
		var bfname = SModuleManager.getLocalModuleName() + "." + SideMasterDefinition;
		BFEngine.loadDefinition(bfname, function () {
			var bf = BFEngine.create({BF: bfname, name: "PROD"}, "root");
			var title = bf.getConfig().title || "Side", err;
			document.title = title;
			try {
				BFEngine.renderTo("runtime-main", bf);
			} catch (e) {
				err = e;
			}
			flow(err);
		});
	}

	function byid(id) {
		return document.getElementById(id);
	}

	function updateSideProgressMessage(msg) {
		if (typeof msg === "function")
			msg = msg();

		var msgDiv = byid("side-progress-msg-div");
		if (msgDiv)
			msgDiv.innerHTML = msg;
	}

	function showHideSideProgressDiv(show) {
		var msgDiv = byid("side-progress-msg-div");
		if (msgDiv)
			msgDiv.style.display = show ? "block" : "none";
	}

	//bu metod side nin kendi ihtiyacı olan ml gereksinimleri için var. Bc, util ve core kısımda kullanılan kullanıcı mesajları ve bileşenlere ait gerekli yerlerde kullanılır.
	function initSideMultiLang(flow) {
		window.SideMLManager = new SideMLManagerClass();
		SideMLManager.init(flow);
	}

	function checkRefDataVersions(flow) {
		var localRefDatas = SRefDataManager.getLocalCacheStatus(true);
		var removeList = [];
		for (var i = 0; i < localRefDatas.length; i++) {
			if (localRefDatas[i] === "__lang")
				continue;

			var refDataVer = sideRefDataVers[localRefDatas[i].rf];
			if (refDataVer) {
				var lv = localRefDatas[i].v;
				if (!lv || lv < refDataVer.version)
					removeList.push(localRefDatas[i].rf);
			}
		}

		SRefDataManager.removeSideRefdata(removeList, flow);
	}

	function runStartJob(callback) {
		var startJob = getSideDefaults("side-start-job");
		startJob = eval(startJob);
		if (startJob) {
			startJob(callback);
		} else {
			callback();
		}
	}

    function runInitJob(callback) {
        var startJob = getSideDefaults("side-init-job");
        startJob = eval(startJob);
        if(startJob){
            startJob(callback);
        } else {
            callback();
        }
    }

	function initSide() {

		SAsync.series([
            function (flow) {
                runInitJob(flow);
            },
			function (flow) {
				showHideSideProgressDiv(true);
				flow();
			},
			function (flow) {
				updateSideProgressMessage("Uygulama başlatılıyor...");
				initSideMultiLang(flow);
			},
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.appStart"));
				initServiceManager(flow);
			},
			function (flow) {
				if (getSideDefaults("support-side-services")) {
					updateSideProgressMessage(SideMLManager.get("welcome.appStart"));
					loadServiceList(flow);
				} else {
					flow();
				}
			},
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.appStart"));
				initRefDataManager(flow);
			},
			loadRequired3Libs,
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.sessionStart"));
				initSession(flow);
			},
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.refDataControl"));
				checkRefDataVersions(flow);
			},
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.sessionStart"));
				initAuthorization(flow);
			},
			function (flow) {
				if (getSideDefaults("support-side-im")) {
					updateSideProgressMessage(SideMLManager.get("welcome.sessionStart"));
					flow();
				} else {
					flow();
				}
			},
			function (flow) {
				runStartJob(flow);
			},
			function (flow) {
				updateSideProgressMessage(SideMLManager.get("welcome.pageLoading"));
				initPage(flow);
			}
		], function (err, index) {
			if (err) {
				console.log("ERROR at FUNCTION " + index + "\n" + err);
			} else {
				showHideSideProgressDiv(false);
			}
		});

		//istenmişse pencere kapatılırken logout servisini çağır
		// if(getSideDefaults("call-logout-on-window-unload")){
		// window.onbeforeunload = function() {
		// CSCaller.call(getSideDefaults("sn-logout"), {}).then(function(resp){
		// console.log("Uygulama sunucusunda oturum sonlandırıldı.")
		// }).error(function(resp){
		// console.error("Uygulama sunucusunda oturum sonlandırılamadı.")
		// });
		// }
		// }


		//ekranda hata olunca işleme izin verme
		if (getSideDefaults("show-errors-on-runtime-errors")) {
			window.onerror = function (err, url, lineNumber) {
				console.error(err);
				var msg = "Beklenmeyen bir hata oluştu.";
				try {
					var config = {};
					if (getSideDefaults("mask-page-on-runtime-errors")) {
						//ekranı maskele işleme izin verme...
						config.showTitleBar = false;
						config.closeOnEscape = false;
					}
					config.utilPopup = true;
					config.width = 520;
					config.height = 70;
					var $msgDiv = $("<div>").html(msg).css("text-align", "center");
					var popup = new CSSimplePopup($msgDiv, config);
					popup.open();
				} catch (e) {
					console.error(e);
					alert(msg);
				}
			};
		}
	}
