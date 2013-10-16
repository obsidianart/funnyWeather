(function (window, undefined) {
 
    var TopMenu = {
        info: "Yeeey"
    };
 
    // node
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = TopMenu;
    }
    // window
    else {
        window.PoniesModule = PoniesModule;
        // requireJS
        if (typeof define === "function" && define.amd) {
            define("topmenu", [], function () {
                return TopMenu;
            });
        }
    }
 
})(this);