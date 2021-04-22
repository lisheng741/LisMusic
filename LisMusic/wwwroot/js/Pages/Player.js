//路由表
var routes = [
    { id: '' },
    { id: 'index', title: '首页' },
    { id: 'next', title: '下一页', handle: function () { console.log("切换到next"); console.log(this); } }
]

//路由器
var router = new Router(routes);