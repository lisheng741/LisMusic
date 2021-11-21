/*
模块：提示层
作者：cls
日期：2020.11.26
说明：基于jQuery 和 bootstrap-icons@1.4.0
      1、success 和 fail 层浮现3/timeOut 秒后消失
      2、loading 浮现后，需要自己 hidden
使用：
var layerTip = new LayerTip();
layerTip.render({ type: 'loading', ins: 'show' });
layerTip.render({ type: 'loading', ins: 'hidden' });
layerTip.render({ type: 'success', ins: 'show', tip: '成功！' });
layerTip.render({ type: 'fail', ins: 'show', tip: '权限不足！' });
*/

function LayerTip(o) {
    //o = { ele: 'body', layerEle: '#i-layer-success', timeOut: 3000 };
    o = o || {};
    o.ele = o.ele || "body";
    o.timeOut = o.timeOut || 3000;
    var oParent = $(o.ele);
    if (oParent.length == 0) {
        console.error("模块LayerTip初始化：缺少宿主容器！");
        return;
    }
    if (o.layerEle != undefined) {
        var sFirst = o.layerEle.slice(0, 1);
        if (sFirst != "#") {
            console.error("模块LayerTip初始化：layerEle错误，首字符应为#");
            return;
        }
        var oLayer = $(o.layerEle);
        if (oLayer.length > 0) {
            console.error("模块LayerTip初始化：已存在与layerEle相同的元素！");
            return;
        }
    }

    this.o = o;
    this.bolInit = true; //初始化标志
}

LayerTip.prototype = {
    render: function (o) {
        //o = { type: 'success', ins: 'show', tip: '成功！' } //ins: instruction
        //入参检查
        o = o || {};
        o.type = o.type || "loading";
        o.ins = o.ins || "show";
        if (o.tip == undefined || o.tip == "") {
            switch (o.type) {
                case "success":
                    o.tip = "成功！";
                    break;
                case "fail":
                    o.tip = "失败！";
                    break;
                case "loading":
                default:
                    o.tip = "加载中……";
                    break;
            }
        }
        //模块检查
        var othis = this;
        if (!othis.bolInit) {
            console.error("模块LayerTip调用render：未初始化！");
            return;
        }
        //获取父级容器
        var oParent = $(othis.o.ele);
        //如果layer-tip 存在唯一id
        if (othis.o.layerEle != undefined) {
            var oLayer = $(othis.o.layerEle);
            if (oLayer.length > 0) {
                //两种情况：1、切换type，删除原layer，然后再分：show-继续执行生成元素；hidden-跳过后续
                //2、没有切换type，走else里的代码
                if ((oLayer.hasClass("lisui-loading") && o.type != "loading") || (oLayer.hasClass("lisui-layer-tip") && o.type == "loading")) {
                    oLayer.remove();
                } else {
                    switch (o.type) {
                        case "success":
                        case "fail":
                            oLayer.remove(); //直接删除元素重新生成
                            break;
                        case "loading":
                        default:
                            if (o.ins == "hidden" && !oLayer.hasClass("hidden")) { //隐藏-显示 切换
                                oLayer.addClass("hidden");
                            } else if (o.ins == "show" && oLayer.hasClass("hidden")) {
                                oLayer.removeClass("hidden");
                            }
                            return;
                    }
                }
            }
        }

        if (othis.o.layerEle != undefined && o.ins == "hidden") { //存在唯一id，instruction为hidden，跳过后续代码
            return;
        } else if (othis.o.layerEle == undefined && o.ins == "hidden") { //不存在唯一id，instruction为hidden，删除所有没有id的
            var oLayer;
            switch (o.type) {
                case "success":
                    var oLayer = $(".lisui-layer-success");
                    break;
                case "fail":
                    var oLayer = $(".lisui-layer-fail");
                    break;
                case "loading":
                default:
                    var oLayer = $(".lisui-loading");
                    break;
            }
            oLayer.each(function () {
                if ($(this).attr("id") == undefined) {
                    $(this).remove();
                }
            });
            return;
        }

        //生成元素
        var sId = null;
        if (othis.o.layerEle != undefined) {
            sId = othis.o.layerEle.substring(1);
        }
        var eDiv = $("<div></div>").attr("id", sId);
        switch (o.type) {
            case "success":
                eDiv.addClass("lisui-layer-tip lisui-layer-success");
                var eIcon = $("<i class='icomoon-cool'></i>");
                var eP = $("<p>" + o.tip + "</p>");
                eDiv.append(eIcon);
                eDiv.append(eP);
                break;
            case "fail":
                eDiv.addClass("lisui-layer-tip lisui-layer-fail");
                var eIcon = $("<i class='icomoon-baffled'></i>");
                var eP = $("<p>" + o.tip + "</p>");
                eDiv.append(eIcon);
                eDiv.append(eP);
                break;
            case "loading":
            default:
                eDiv.addClass("lisui-loading");
                var eDivTip = $("<div class='lisui-loading-tip'></div>");
                var eIcon = $("<i></i>");
                var eP = $("<p>" + o.tip + "</p>");
                eDivTip.append(eIcon);
                eDivTip.append(eP);
                eDiv.append(eDivTip);
                break;
        }
        oParent.append(eDiv);

        switch (o.type) {
            case "success":
            case "fail":
                eDiv.on("click", function () {
                    $(this).remove();
                });
                othis.LayerTipShowTimeOut(eDiv);
                break;
            default:
                break;
        }
    }

    , LayerTipShowTimeOut: function (oLayer, iTimeOut) {
        var othis = this;
        if (iTimeOut == undefined || iTimeOut <= 0) {
            iTimeOut = othis.o.timeOut;
        }
        setTimeout(function () {
            oLayer.remove();
        }, iTimeOut);
    }
}