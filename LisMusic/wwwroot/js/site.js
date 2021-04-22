// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

//window.onload = function () {
//    window.addEventListener("hashchange", function () {
//        console.log(1);
//    });

//    window.addEventListener("hashchange", function (e) {
//        console.log(e.oldURL);
//        console.log(e.newURL);
//    });

//    var t2 = new test();
//}

//function test() {
//    //var a = document.getElementsByTagName("body")[0];

//    window.addEventListener("hashchange", function () {
//        console.log(3);
//    });

//    window.addEventListener("load", function () {
//        console.log("load");
//    }, false)

//}

function bb() {
    var str = "string";
    api();

    function test() {
        console.log(str);
    }
    function api() {
        test();
        console.log(this);
        return str;
    }

    var othis = this;
    this.api = api;
}

bb.prototype.api2 = function () {
    console.log("api2");
    console.log(this);
}