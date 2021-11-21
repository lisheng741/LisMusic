/*
 * 模块：单页应用路由
 * 作者：cls
 * 日期：2021.04.17
 * 使用：var routes = [{ id: '' }, { id: 'index', title: '首页' }, { id: 'next', handle: function () { console.log("切换到next");} }]
 *       var router = new Router(routes);
 * 注意：不要对一个 router 进行多次 new Router()操作 。若要切换路由表使用 init() 方法即可
 */
function Router(routes, defaultRoute) {
    var othis = this;

    //路由初始化
    routes && othis.init(routes, defaultRoute);

    //绑定 hashchange 事件
    window.addEventListener("hashchange", function () {
        let route = location.hash.slice(1) || "";
        othis.oldRoute = othis.currentRoute;
        othis.currentRoute = route;
        othis.changePage(route);
    });
}

//初始化，可多次初始化
Router.prototype.init = function (routes, defaultRoute) {
    if (!routes || !routes.length) {
        console.error("Router初始化失败：routes错误！");
        return;
    }
    this.routes = routes;
    this.currentRoute = location.hash.slice(1) || defaultRoute || routes[0].id; //当前路由获取顺序
    this.oldRoute = "";
    location.hash || history.replaceState(null, null, '#' + this.currentRoute); //hash为空，切换当前hash
    this.changePage(this.currentRoute);
    this.oldRoute = location.hash.slice(1);
}

//切换路由
Router.prototype.push = function (route, callback) {
    //获取route
    switch (typeof (route)) {
        case "string":

            break;
        case "number":
            route = this.routes[route] || "";
            break;
        case "object":
            route = route.id || "";
            break;
        case "undefined":
        default:
            route = location.hash.slice(1) || "";
            break;
    }
    location.hash = route; //切换hash，接下来的事情交给hashchange去做。如果与上一次的route一致，不会触发hashchange事件
}

//切换页面：route为字符串，为空则隐藏所有路由
Router.prototype.changePage = function (route) {
    if (!this.routes || !this.routes.length) { //没有初始化成功的路由，直接返回
        return;
    }
    for (let i = 0; i < this.routes.length; i++) {
        let e = document.getElementById(routes[i].id);
        if (routes[i].id == route) {
            e && (e.style.display = "block");
            (typeof (routes[i].title) === "string") && routes[i].title && (document.title = routes[i].title);
            (typeof (routes[i].handle) === "function") && routes[i].handle(); //handle 存在，执行函数
        }
        else {
            e && (e.style.display = "none");
        }
    }
}


function Router2(routes, defaultRoute) {
    var othis = this;
    var routes, currentRoute, oldRoute;
    othis.init = init;
    othis.push = push;
    othis.para = {
        routes,
        currentRoute: currentRoute,
        oldRoute: oldRoute,
    }

    return {
        oldRoute
    }

    othis.routes = routes;
    othis.currentRoute = currentRoute;
    othis.oldRoute = oldRoute;

    //路由初始化
    routes && init(routes, defaultRoute);

    //绑定 hashchange 事件
    window.addEventListener("hashchange", function () {
        let route = location.hash.slice(1) || "";
        oldRoute = currentRoute;
        currentRoute = route;
        changePage(route);
    });

    

    //初始化，可多次初始化
    function init(routes, defaultRoute) {
        if (!routes || !routes.length) {
            console.error("Router初始化失败：routes错误！");
            return;
        }

        routes = routes;
        currentRoute = location.hash.slice(1) || defaultRoute || routes[0].id; //当前路由获取顺序
        oldRoute = "";
        location.hash || history.replaceState(null, null, '#' + currentRoute); //hash为空，切换当前hash
        changePage(currentRoute);
        oldRoute = location.hash.slice(1);
    }

    //切换路由
    function push(route) {
        //获取route
        switch (typeof (route)) {
            case "string":

                break;
            case "number":
                route = routes[route] || "";
                break;
            case "object":
                route = route.id || "";
                break;
            case "undefined":
            default:
                route = location.hash.slice(1) || "";
                break;
        }
        location.hash = route; //切换hash，接下来的事情交给hashchange去做。如果与上一次的route一致，不会触发hashchange事件
    }

    //切换页面：route为字符串，为空则隐藏所有路由
    function changePage(route) {
        if (!routes || !routes.length) { //没有初始化成功的路由，直接返回
            return;
        }
        for (let i = 0; i < routes.length; i++) {
            let e = document.getElementById(routes[i].id);
            if (routes[i].id == route) {
                e && (e.style.display = "block");
                (typeof (routes[i].title) === "string") && routes[i].title && (document.title = routes[i].title);
                (typeof (routes[i].handle) === "function") && routes[i].handle(); //handle 存在，执行函数
            }
            else {
                e && (e.style.display = "none");
            }
        }
    }
}