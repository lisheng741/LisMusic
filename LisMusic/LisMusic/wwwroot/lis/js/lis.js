/*
 * 模块：全局lis对象
 * 作者：cls
 * 日期：2021.04.19
 * 使用：基于jQuery 和 相关lis组件
 */
let lis = (function () {
    //变量
    let loading = new LayerTip();
    let layerTip = new LayerTip({ layerEle: '#lt13149527' });
    let router = new Router();

    //方法
    function ajax(o) {
        loading.render({ type: 'loading', ins: 'show' }); //显示加载
        let request = $.ajax(o); //调用jquery的ajax
        $.when(request).done(function (r) {
            if (r.code == 0) {
                layerTip.render({ type: 'success', ins: 'show', tip: r.status });
            } else {
                layerTip.render({ type: 'fail', ins: 'show', tip: r.status });
            }
        }).fail(function () {
            layerTip.render({ type: 'fail', ins: 'show' });
        }).always(function () {
            loading.render({ type: 'loading', ins: 'hidden' }); //隐藏加载
        });
    }

    return {
        //属性
        Loading: loading,
        LayerTip: layerTip,
        Router: router,

        //方法
        ajax,
    }
})();