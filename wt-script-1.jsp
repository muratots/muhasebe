




	var sideRuntimeEnvironment = 'prod';

    var SideDefaults = {"portal":{"theme":"blackberry","sn-getUserSessionInfo":"getUserSessionInfo"}};

var SModules = {"portal":{"app":"/earsiv-services/dispatch","side":"side-dispatch","im":"","prefix":"portal","isFormDesigner":false,"pm":"arsiv_portal","isLocalModule":true}};

    var BCDefaults = {
        get: function (bcName, key, defvalue, module) {
            if (!bcName || !key) {
                return defvalue;
            }
            if (!module) {
                if (BCEngine && BCEngine.getRegisterModuleName) {
                    module = BCEngine.getRegisterModuleName();
                }
                if (!module && SideModuleManager) {
                    module = SideModuleManager.getLocalModuleName();
                }
                if (!module) {
                    throw "BCDefaults module name not found";
                }
            }
            // modul clone yapılmışsa
            var sourceModule = SideModuleManager.getModules()[module].clonedFrom;
            if (sourceModule) {
                module = sourceModule;
            }
            if (!BCDefaults[module] || !BCDefaults[module][bcName]) {
                return defvalue;
            }
            return BCDefaults[module][bcName][key];
        }
    };

    window.BCDefaults = BCDefaults;

BCDefaults['portal'] = {};

window.Side3LibDeps = { "portal": [{"libName":"jquery","libVersion":"2.0.3","libSource":"jquery","jsImports":["jquery-2.0.3.min.js"],"libOrder":10},{"libName":"jquery-maskedinput","libVersion":"1.3","libSource":"jquery-maskedinput","jsImports":["jquery.maskedinput.js"],"libOrder":20},{"libName":"jquery-ui","libVersion":"1.12.0","libSource":"jquery-ui","jsImports":["jquery-ui.min.js","ui.datepicker.locale.min.js"],"cssImports":["jquery-ui.min.css"],"libOrder":20},{"libName":"jquery-autonumeric","libVersion":"1.9.7","libSource":"jquery-autonumeric","jsImports":["autoNumeric.min.js"],"libOrder":20},{"libName":"cgart","libVersion":"1.0","libSource":"cgart","jsImports":["gauge.js"],"libOrder":30},{"libName":"jquery-ui-timepicker","libVersion":"1.3","libSource":"jquery-ui-timepicker","jsImports":["jquery-ui-timepicker-addon.min.js","ui.timepicker.locale.min.js"],"cssImports":["jquery-ui-timepicker-addon.css"],"libOrder":30}]};
