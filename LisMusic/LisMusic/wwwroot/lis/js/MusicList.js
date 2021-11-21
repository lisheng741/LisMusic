/*
 * 模块：音乐列表
 * 作者：cls
 * 日期：2021.04.18
 * 使用：基于jQuery 和 lis.js， 需绑定一个 zplayer
 */
//var options = { ele: '#id', url: '/api/Music/GetList', keyword: '九万字', kwplaceholder: '输入关键词搜索', zplayer: zplayer, btn: ['play', 'download', 'more'] };
function MusicList(options, callback) {
    var othis = this;
    if (!options || !options.ele || !options.url || !options.zplayer) {
        console.error("MusicList模块加载错误：options缺少必要参数！");
        return;
    }
    var oContainer = $(options.ele);
    if (!oContainer) {
        console.error("MusicList模块加载错误：缺少容器！");
        return;
    }
    var defaultOptions = {
        kwplaceholder: "输入关键词搜索",
        btn: ['play', 'download', 'more'],
    }
    for (var option in defaultOptions) {
        defaultOptions.hasOwnProperty(option) && !options.hasOwnProperty(option) && (options[option] = defaultOptions[option]);
    }

    var shtml = ""
        + "<div class='lst-search'>"
        + "    <div class='lst-search-body'>"
        + "        <input class='lst-search-text' type='text' placeholder='" + options.kwplaceholder + "' />"
        + "        <button class='lst-search-submit' type='submit'><i class='icon-search'></i></button>"
        + "    </div>"
        + "</div>"
        + "<div class='lst-list'>"
        + "</div>";
    oContainer.html(shtml);

    //------------------- 绑定事件 begin --------------
    //搜索
    $(document).on("click", options.ele + " .lst-search-submit", function () {
        Search($(".lst-search-text").val());
    });
    $(document).on("keyup", options.ele + " .lst-search-text", function (event) {
        (event.keyCode == 13) && Search($(this).val());
    });
    //点击播放音乐
    $(document).on("click", options.ele + " .lst-list-item-content", function () {
        if ($(this).hasClass("disabled")) {
            lis.LayerTip.render({ type: 'fail', ins: 'show', tip: "无法播放！" });
            return;
        }
        othis.Play($(this).data("index"));
    });
    //------------------- 绑定事件 end --------------

    var sourceArray = ["", "QQ", "酷狗", "酷我", "网易云"];
    othis.zplayer = options.zplayer;
    othis.musicList = [];
    othis.options = options;
    Search(options.keyword); //搜索
    typeof (callback) === "function" && callback(); //执行回调

    //------------------- 内部函数 --------------
    //搜索
    function Search(keyword) {
        $(options.ele + " .lst-list").html(""); //清空
        if (!keyword) {
            return;
        }
        lis.ajax({
            type: "get",
            data: { keyword },
            url: options.url,
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: function (r) {
                if (r.code == 0) {
                    othis.musicList = r.data;
                    BuildList();
                }
            },
            error: function (xhr) {
                //tip = "错误信息：" + xhr.status + " " + xhr.statusText;
            }
        }); //lis.ajax
    } //Search
    //建立音乐列表
    function BuildList(musicList) {
        musicList = musicList || othis.musicList;
        var listBody = $(options.ele + " .lst-list");
        listBody.html(""); //清空
        if (!musicList || !musicList.length) {
            return;
        }
        var shtml = "";
        for (let i = 0; i < musicList.length; i++) {
            shtml += ""
                + "<div class='lst-list-item'>"
                + "    <div class='lst-list-item-content " + (musicList[i].CanDownload ? "" : "disabled") + "' data-index='" + i + "'>"
                + "        <div class='lst-i-content-title'>"
                + "            <span class='lst-i-content-title-name'>" + musicList[i].Name + "</span>"
                + "            <span class='lst-i-content-title-source'>" + sourceArray[musicList[i].MusicSource] + "</span>"
                + "        </div>"
                + "        <div class='lst-i-content-description'>"
                + "            <span class='lst-i-content-description-singer'>" + musicList[i].Singer + "</span>"
                + "            <span>&nbsp;-&nbsp;</span>"
                + "            <span class='lst-i-content-description-album'>" + musicList[i].Album + "</span>"
                + "        </div>"
                + "    </div>"
                + "    <div class='lst-list-item-btn'>"
                + "        <button class='lst-i-btn-play' type='submit'><i class='icon-play'></i></button>"
                + "        <button class='lst-i-btn-download' type='submit'><i class='icon-download'></i></button>"
                + "    </div>"
                + "</div>";
        }
        listBody.html(shtml);
    } //BuildList
    //播放
    othis.Play = function (index) {
        var music = othis.musicList[index];
        var musicUrl = "";
        $.ajax({
            type: "get",
            data: { DownloadInfo: music.DownloadInfo, MusicSource: music.MusicSource },
            url: options.urlGetMusic,
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            async: false,
            success: function (r) {
                if (r.code == 0) {
                    musicUrl = r.data;
                    musicUrl || lis.LayerTip.render({ type: 'fail', ins: 'show', tip: "播放失败" });
                }
            }
        }); //$.ajax
        //临时处理，后面修改 zplayer 完再修改这里
        musicUrl && othis.zplayer.add({
            Name: music.Name,
            Singer: music.Singer,
            url: musicUrl
        });
        musicUrl && othis.zplayer.next(2);
        musicUrl && othis.zplayer.remove(0);
    }
}
