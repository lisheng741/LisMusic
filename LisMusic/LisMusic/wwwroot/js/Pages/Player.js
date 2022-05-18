const CON_MOVING_DIRECTION_HORIZONTAL = 'horizontal';
const CON_MOVING_DIRECTION_VERTICAL = 'vertical';
const CON_PAGE_1 = 0;
const CON_PAGE_2 = -33.3333;
const CON_PAGE_3 = -66.6666;

let isMobile = /mobile/i.test(window.navigator.userAgent);

let utils = {
    nameMap: {
        dragStart: isMobile ? 'touchstart' : 'mousedown',
        dragMove: isMobile ? 'touchmove' : 'mousemove',
        dragEnd: isMobile ? 'touchend' : 'mouseup',
    }
};


// 2022-5-18 cls 添加分享设置 begin ------
const shareAdapter = (data) => {
    var item = {};
    item.name = data.name;
    item.artist = data.artist;
    item.url = `http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid=MUSIC_${data.info}&type=convert_url&response=res`;
    item.lrc = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${data.info}`;
    item.lrcAdapter = lrcAdapter;
    return item;
}
// 2022-5-18 cls 添加分享设置 end -----------

const lrcAdapter = (data) => {
    let lrc = [];
    let lrcList = data.data.lrclist || [];
    for (let i = 0; i < lrcList.length; i++) {
        lrc.push([parseFloat(lrcList[i].time), lrcList[i].lineLyric]);
    }
    lrc.sort((a, b) => a[0] - b[0]);
    return lrc;
}
const searchAdapter = (data) => {
    return data.map(item => {
        let musicId = item.downloadInfo.match(/\d+/)[0];
        item.name = item.name;
        item.artist = item.artist || item.singer;
        //item.url = `http://url.amp3a.com/kuwo.php/${musicId}.mp3`;
        item.url = `http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid=MUSIC_${musicId}&type=convert_url&response=res`;
        item.lrc = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${musicId}`;
        item.downloadInfo = item.downloadInfo;
        item.lrcAdapter = lrcAdapter;
        return item;
    });
}

const playerListSwitch = (e) => {
    let index = e.index;
    player.list.container.active(index);
}
const listLineClick = (e) => {
    if (player.list.container !== list) {
        player.list.container = list;
        player.list.clear();
        player.list.add(list.list);
    }
    let index = parseInt(e.getAttribute('data-id'));
    player.list.switch(index);
    player.play();
}
const listDelete = (e) => {
    if (!window.confirm('确认删除？')) {
        return;
    }
    let index = parseInt(e.getAttribute('data-id'));
    player.list.remove(index);
}
const searchLineClick = (e) => {
    if (player.list.container !== search) {
        player.list.container = search;
    }
    if (player.list.audios !== search.list) {
        player.list.clear();
        player.list.add(search.list);
    }
    let index = parseInt(e.getAttribute('data-id'));
    player.list.switch(index);
    player.play();
}
const searchAdd = (e) => {
    let index = parseInt(e.getAttribute('data-id'));
    list.add(search.list[index]);
    alert('添加成功！');
}

const initPageControl = (container) => {
    const thumbMove = (e) => {
        e.preventDefault();
        if (!container.dragging) {
            return;
        }
        if (!container.direction) {
            let dragX = Math.abs((e.clientX || e.changedTouches[0].clientX) - container.dragStartX);
            let dragY = Math.abs((e.clientY || e.changedTouches[0].clientY) - container.dragStartY);
            if (dragX > dragY && dragX > 5) {
                //横向
                container.direction = CON_MOVING_DIRECTION_HORIZONTAL;
            } else if (dragX < dragY && dragY > 5) {
                //纵向
                container.direction = CON_MOVING_DIRECTION_VERTICAL;
            }
        }
        if (!container.direction || container.direction !== CON_MOVING_DIRECTION_HORIZONTAL) {
            return;
        }
        let dragPercentage = ((e.clientX || e.changedTouches[0].clientX) - container.dragStartX) / document.documentElement.clientWidth / 3 * 100;
        let percentage = (container.dragStartPercentageX || CON_PAGE_1) + dragPercentage;
        if (percentage >= 0 || percentage <= -66.6666) return;
        container.style.transform = `translateX(${percentage}%)`;
    };

    const thumbUp = (e) => {
        let transformArray = container.style.transform.match(/-?\d+(.\d+)?%/) || [`${CON_PAGE_2}%`];
        let percentage = parseFloat(transformArray[0]);
        let finalPercentage = container.dragStartPercentageX || CON_PAGE_1;
        let dragPercentage = ((e.clientX || e.changedTouches[0].clientX) - container.dragStartX) / document.documentElement.clientWidth / 3 * 100;
        if (!container.direction || container.direction !== CON_MOVING_DIRECTION_HORIZONTAL || Math.abs(dragPercentage) < 8.55) {
            clearEvents(percentage, finalPercentage);
            return;
        }
        if (finalPercentage == CON_PAGE_2) {
            if (dragPercentage > 0) {
                finalPercentage = CON_PAGE_1;
            } else {
                finalPercentage = CON_PAGE_3;
            }
        } else if ((finalPercentage == CON_PAGE_1 && dragPercentage < 0) || (finalPercentage == CON_PAGE_3 && dragPercentage > 0)) {
            finalPercentage = CON_PAGE_2;
        } else {
            //保持原 finalPercentage
        }
        clearEvents(percentage, finalPercentage);
    };

    const clearEvents = (percentage, finalPercentage) => {
        //清除
        container.removeEventListener(utils.nameMap.dragMove, thumbMove);
        container.removeEventListener(utils.nameMap.dragEnd, thumbUp);
        //定时器
        let translateInterval = setInterval(() => {
            if (Math.abs(percentage - finalPercentage) < 1) {
                container.style.transform = `translateX(${finalPercentage}%)`;
                container.dragStartPercentageX = finalPercentage;
                clearInterval(translateInterval);
                container.direction = '';
                container.dragging = false;
            } else if (percentage < finalPercentage) {
                percentage = percentage + 1;
                container.style.transform = `translateX(${percentage}%)`;
            } else {
                percentage = percentage - 1;
                container.style.transform = `translateX(${percentage}%)`;
            }
        }, 15);
    };

    container.addEventListener(utils.nameMap.dragStart, (e) => {
        if (container.dragging) {
            return;
        }
        container.dragging = true;
        let transformArray = container.style.transform.match(/-?\d+(.\d+)?%/) || [`${CON_PAGE_2}%`];
        container.dragStartPercentageX = container.dragStartPercentageX || parseFloat(transformArray[0]) || CON_PAGE_1;
        container.dragStartX = e.clientX || e.changedTouches[0].clientX;
        container.dragStartY = e.clientY || e.changedTouches[0].clientY;
        container.addEventListener(utils.nameMap.dragMove, thumbMove);
        container.addEventListener(utils.nameMap.dragEnd, thumbUp);
    });
}


// ------------------------------------------------------------------- 


let container = document.querySelector('.container');
let ele = document.querySelector('.lplayer');
let audios = [
    //{
    //    title: '九万字',
    //    author: '黄诗扶',
    //    url: 'http://music.163.com/song/media/outer/url?id=1335942780.mp3',
    //    lrc: "[00:00.000] 作词 : 左木修\n[00:05.000] 作曲 : WH宇恒/黄诗扶\n[00:04.74]编曲：李大白\n[00:07.21]“当坊间最善舞的女儿死了，京城就该有一场大雪。”\n[00:15.98]—— 叶三·《九万字》\n[00:16.68]\n[00:23.13]飘泊的雪 摇曳回风\n[00:26.77]诗意灵魂 更迭情人\n[00:30.40]总惯用轻浮的茂盛 掩抹深沉\n[00:36.98]\n[00:37.77]有谁不是 少年热诚\n[00:41.53]孑然一身 爱一个人\n[00:45.25]望尽了毕生温柔眼神\n[00:49.98]\n[00:51.24]写得出最刻薄的字文\n[00:57.24]以讥诮这庸尘\n[01:00.42]却不忍 斥你毫分\n[01:05.20]\n[01:05.46]我也算万种风情 实非良人\n[01:10.18]谁能有幸 错付终身\n[01:13.51]最先动情的人\n[01:15.83]剥去利刃 沦为人臣\n[01:20.08]\n[01:20.38]我爱你苍凉双眼 明月星辰\n[01:24.86]不远万里 叩入心门\n[01:28.33]一个孤僻的唇\n[01:30.40]摘获了你首肯 献上一吻\n[01:39.84]\n[01:41.62]—— Music ——\n[01:49.06]\n[01:55.30]有谁不是 死而寻生\n[01:59.03]险些终结 险些偿命\n[02:02.76]睡梦中无数次的自刎\n[02:07.98]\n[02:08.87]笔下有最淋漓的爱恨\n[02:14.64]以剜挑这浮生\n[02:18.19]只写你 衣不染尘\n[02:22.58]\n[02:23.00]我也算万种风情 实非良人\n[02:27.64]谁能有幸 错付终身\n[02:30.93]幻想岁月无声\n[02:33.25]百年之后 合于一坟\n[02:37.45]\n[02:37.68]我爱你苍凉双眼 留有余温\n[02:42.42]荒芜的心 旷野徒奔\n[02:45.83]你会弹落烟尘 抹去指上灰痕\n[02:52.10]各自纷呈\n[02:54.48]\n[02:56.38]看那些 流离失所的游魂\n[03:00.78]莫衷一是 层层围困\n[03:04.25]从来酿酒的人\n[03:06.52]分外清醒 独善其身\n[03:10.58]\n[03:10.96]常言说 命运半点不由人\n[03:15.26]不信常言 偏信方寸\n[03:19.00]那些荒唐传闻\n[03:21.39]化名称为青春\n[03:25.38]红尘滚滚\n[03:29.70]\n[03:30.76]“人间不值得”系列歌曲\n[03:45.86]策划：左木修\n[03:46.59]混音：幺唠\n[03:47.06]和声编写、和声：黄诗扶\n[03:48.46]录音：后权宝@行人studio\n[03:49.22]出品：万象凡音\n[03:50.22]——  End ——\n"
    //},
    //{
    //    title: '吹梦到西州',
    //    author: '恋恋故人难、黄诗扶、妖扬',
    //    url: 'http://music.163.com/song/media/outer/url?id=1376873330.mp3',
    //    lrc: '[00:00.000] 作词 : 颀鞍[00:01.000] 作曲 : 铃木航海[00:02.000] 编曲 : 远藤直弥/冯帆[00:03.000] 制作人 : 冯帆/铃木航海[00:06.985][00:13.428]（妖扬）[00:13.723]无何化有 感物知春秋[00:19.232]秋毫濡沫欲绸缪 搦管相留[00:25.036]（黄诗扶）[00:25.412]留骨攒峰 留容映水秀[00:31.406]留观四时曾邂逅 佳人西洲[00:37.086][00:38.415]（妖扬）[00:38.848]西洲何有 远树平高丘[00:44.521]云闲方外雨不收 稚子牵牛[00:50.098]（黄诗扶）[00:50.354]闹市无声 百态阴晴栩栩侔[00:56.773]藤衣半卷苔衣皱 岁月自无忧[01:03.450][01:03.885]（妖扬）[01:04.148]驾马驱车 尚几程扶摇入画中 咫尺[01:10.172]（黄诗扶）[01:10.347]径曲桥横 精诚难通[01:15.168][01:15.268]（黄诗扶、妖扬）[01:15.468]盼你渡口 待你桥头[01:21.898]松香接地走[01:23.962]挥癯龙绣虎出怀袖[01:27.213]起微石落海连波动[01:30.185]描数曲箜篌线同轴[01:34.062]勒笔烟直大漠 沧浪盘虬[01:37.916]一纸淋漓漫点方圆透[01:41.369]记我 长风万里绕指未相勾[01:46.935]形生意成 此意 逍遥不游[01:54.349][02:03.987]（妖扬）[02:04.205]日月何寿 江海滴更漏[02:09.237]爱向人间借朝暮 悲喜为酬[02:15.371]（黄诗扶）[02:15.698]种柳春莺 知它风尘不可求[02:21.941]绵绵更在三生后 谁隔世读关鸠[02:28.355][02:28.701]（妖扬）[02:28.967]诗说红豆 遍南国未见人长久 见多少[02:35.581]（黄诗扶）[02:35.815]来时芳华 去时白头[02:40.135][02:40.235]（黄诗扶、妖扬）[02:40.635]忘你不舍 寻你不休[02:47.047]画外人易朽[02:49.148]似浓淡相间色相构[02:52.398]染冰雪先披琉璃胄[02:55.348]蘸朱紫将登金银楼[02:59.333]天命碧城灰土 刀弓褐锈[03:03.624]举手夜古泼断青蓝右[03:06.468]照我 萤灯嫁昼只影归洪流[03:12.055]身魂如寄 此世 逍遥不游[03:18.514][03:18.693]（黄诗扶）[03:18.909]情一物 无木成林无水行舟[03:24.364]情一事 未算藏谋真还谬[03:30.299]情一人 积深不厚积年不旧[03:37.414]情一念 墨尽非空 百代飞白骤 划地为囚[03:46.721][03:46.974]（妖扬）[03:47.200]蓝田需汲酒 惟琼浆能浇美玉瘦[03:52.442]至高者清难垢 至贵者润因愁[03:59.234]痴竭火 知她不能求[04:02.423]醉逢歌 知他不必候[04:06.140]只约灵犀过隙灵光暗相投[04:12.131][04:12.349]（黄诗扶、妖扬）[04:12.553]万籁停吹奏[04:14.724]支颐听秋水问蜉蝣[04:17.654]既玄冥不可量北斗[04:20.602]却何信相思最温柔[04:24.458]顾盼花发鸿蒙 怦然而梦[04:28.453]你与二十八宿皆回眸[04:31.660]系我 彩翼鲸尾红丝天地周[04:37.427]情之所至 此心 逍遥不游[04:41.733] 吉他 : ShadOw[04:46.039] 钢琴 : ShadOw[04:50.345] 和声编写 : 冯帆[04:54.651] 和声 : 黄诗扶[04:58.957] 人声混音 : 徐志明[05:03.263] 混音 : 冯帆[05:07.569] 母带 : 冯帆[05:11.875] 企划 : 三糙文化[05:16.181] 出品公司 : Negia Entertainment Inc.'
    //},
    //{
    //    title: '沈园外',
    //    author: '阿YueYue、戾格',
    //    url: 'http://music.163.com/song/media/outer/url?id=1808078153.mp3',
    //    lrc: '[00:00.000] 作词 : 於世同君[00:01.000] 作曲 : 爱写歌的小田[00:02.000] 编曲 : 卡其漠罗洋[00:03.000] 制作人 : 爱写歌的小田[00:18.35]上次落下[00:20.74]要送给你的花[00:23.86]生根让满园都发芽[00:31.21]不见不散吗[00:33.86]这道墙后谁笑了[00:37.23]让我结疤让我落地风化[00:45.37]能释然吧[00:47.62]哪怕拱手送走她[00:51.35]推开门重逢 再相拥吗[00:58.42]约好的山盟 总是入梦[01:01.80]思念难作假[01:04.96]又留在心底 太嘲哳[01:10.98]在池台的正中[01:12.61]像当初的怀中[01:14.46]隔太多春秋会不能相拥[01:17.87]还没到开满花[01:19.50]却看见天边一点点变红[01:24.86]还以为无影踪[01:26.28]记忆里又翻涌[01:28.12]人长大后 太难学从容[01:31.76]总有事忙怎么像化蝶 那么勇[01:53.70]能释然吧[01:56.16]哪怕拱手送走她[01:59.99]推开门重逢 再相拥吗[02:07.04]约好的山盟 总是入梦[02:10.13]思念难作假[02:13.55]又留在心底 太嘲哳[02:19.69]在池台的正中[02:21.23]像当初的怀中[02:22.98]隔太多春秋会不能相拥[02:26.44]还没到开满花[02:28.18]却看见天边一点点变红[02:33.34]还以为无影踪[02:34.92]记忆里又翻涌[02:36.82]人长大后 太难学从容[02:40.23]总有事忙怎么像化蝶 那么勇[02:47.22]在池台的正中[02:48.66]像当初的怀中[02:50.44]隔太多春秋会不能相拥[02:53.81]还没到开满花[02:55.49]却看见天边一点点变红[03:00.85]还以为无影踪[03:02.28]记忆里又翻涌[03:04.27]人长大后 太难学从容[03:07.59]总有事忙怎么像化蝶 那么勇[03:14.81]总有事忙怎么像化蝶 那么勇[03:21.416] 混音 : 张鸣利[03:28.751] 和声 : 李沅芷[03:36.086] 出品 : 小田音乐社/飞行计划'
    //},
    //{
    //    title: "讲真的",
    //    author: "曾惜",
    //    url: "http://music.163.com/song/media/outer/url?id=30987293.mp3",
    //    pic: "http://p1.music.126.net/cd9tDyVMq7zzYFbkr0gZcw==/2885118513459477.jpg?param=300x300",
    //    lrc: "[by:却连一句我爱你都不能说出口]\n[ti:讲真的]\n[ar:曾惜]\n[al:不要你为难]\n[by:冰城离殇]\n[00:00] 作曲 : 何诗蒙\n[00:01] 作词 : 黄然\n[00:18]今夜特别漫长\n[00:21]有个号码一直被存放\n[00:25]源自某种倔强\n[00:30]不舍删去又不敢想\n[00:33]明明对你念念不忘\n[00:37]思前想后愈发紧张\n[00:41]无法深藏\n[00:43]爱没爱过想听你讲\n[00:48]讲真的\n[00:51]会不会是我 被鬼迷心窍了\n[00:54]敷衍了太多 我怎么不难过\n[00:58]要你亲口说 别只剩沉默\n[01:03]或许你早就回答了我\n[01:06]讲真的\n[01:08]想得不可得 是最难割舍的\n[01:11]各自好好过 也好过一直拖\n[01:15]自作多情了 好吧我认了\n[01:19]至少能换来释怀洒脱\n[01:23]没丢失掉自我\n[01:42]今夜特别漫长\n[01:44]有个号码一直被存放\n[01:49]源自某种倔强\n[01:53]不舍删去又不敢想\n[01:57]明明对你念念不忘\n[02:01]思前想后愈发紧张\n[02:05]无法深藏\n[02:08]爱没爱过想听你讲\n[02:13]讲真的\n[02:15]会不会是我 被鬼迷心窍了\n[02:19]敷衍了太多 我怎么不难过\n[02:23]要你亲口说 别只剩沉默\n[02:27]或许你早就回答了我\n[02:30]讲真的\n[02:32]想得不可得 是最难割舍的\n[02:35]各自好好过 也好过一直拖\n[02:40]自作多情了 好吧我认了\n[02:44]至少能换来释怀洒脱\n[02:47]没丢失掉自我\n[03:04]讲真的\n[03:05]会不会是我 被鬼迷心窍了\n[03:09]敷衍了太多 我怎么不难过\n[03:14]要你亲口说 别只剩沉默\n[03:18]或许你早就回答了我\n[03:21]讲真的\n[03:22]想得不可得 是最难割舍的\n[03:26]各自好好过 也好过一直拖\n[03:30]自作多情了 好吧我认了\n[03:35]至少能换来释怀洒脱\n[03:38]没丢失掉自我\n"
    //}, {
    //    title: "学猫叫",
    //    author: "小潘潘",
    //    url: "http://music.163.com/song/media/outer/url?id=554191055.mp3",
    //    pic: "http://p1.music.126.net/D1Ov-XMAwUzsr16mQk95fA==/109951163256119128.jpg?param=300x300",
    //    lrc: "[00:00.00] 作曲 : 小峰峰[00:01.00] 作词 : 小峰峰[00:05.03]编曲：吕宏斌&塞米七[00:05.28]和声：小峰峰[00:05.45]混音：陈秋洁[00:05.63]制作人：小峰峰[00:05.85]唱片：麦袭时代[00:06.40]OP：百纳娱乐[00:06.93][00:07.96]小潘潘：[00:08.31]我们一起学猫叫[00:10.58]一起喵喵喵喵喵[00:12.60]在你面前撒个娇[00:14.71]哎呦喵喵喵喵喵[00:16.77]我的心脏砰砰跳[00:18.85]迷恋上你的坏笑[00:21.31]你不说爱我我就喵喵喵[00:24.10][00:24.75]小峰峰：[00:26.17]每天都需要你的拥抱[00:29.08]珍惜在一起的每分每秒[00:33.35]你对我多重要[00:35.21]我想你比我更知道[00:38.00]你就是我的女主角[00:41.34][00:41.80]小潘潘：[00:42.80]有时候我懒的像只猫[00:45.69]脾气不好时又张牙舞爪[00:50.10]你总是温柔的[00:51.96]能把我的心融化掉[00:54.65]我想要当你的小猫猫[00:59.93][01:00.38]合：[01:00.70]我们一起学猫叫[01:02.69]一起喵喵喵喵喵[01:04.72]在你面前撒个娇[01:06.81]哎呦喵喵喵喵喵[01:08.82]我的心脏砰砰跳[01:10.79]迷恋上你的坏笑[01:13.42]你不说爱我我就喵喵喵[01:16.86][01:17.23]我们一起学猫叫[01:19.30]一起喵喵喵喵喵[01:21.45]我要穿你的外套[01:23.55]闻你身上的味道[01:25.62]想要变成你的猫[01:27.68]赖在你怀里睡着[01:30.17]每天都贪恋着你的好[01:33.85][01:50.67]小潘潘：[01:51.73]有时候我懒的像只猫[01:54.62]脾气不好时又张牙舞爪[01:58.95]你总是温柔的[02:01.07]能把我的心融化掉[02:03.62]我想要当你的小猫猫[02:07.97][02:09.19]合：[02:09.49]我们一起学猫叫[02:11.49]一起喵喵喵喵喵[02:13.55]在你面前撒个娇[02:15.55]哎呦喵喵喵喵喵[02:17.72]我的心脏砰砰跳[02:19.77]迷恋上你的坏笑[02:22.28]你不说爱我我就喵喵喵[02:26.01][02:26.21]我们一起学猫叫[02:28.30]一起喵喵喵喵喵[02:30.30]我要穿你的外套[02:32.38]闻你身上的味道[02:34.58]想要变成你的猫[02:36.56]赖在你怀里睡着[02:39.02]每天都贪恋着你的好[02:42.40][02:42.85]我们一起学猫叫[02:44.84]一起喵喵喵喵喵[02:46.89]在你面前撒个娇[02:49.02]哎呦喵喵喵喵喵[02:51.14]我的心脏砰砰跳[02:53.32]迷恋上你的坏笑[02:55.75]你不说爱我我就喵喵喵[02:59.12][02:59.47]我们一起学猫叫[03:01.59]一起喵喵喵喵喵[03:03.66]我要穿你的外套[03:05.82]闻你身上的味道[03:07.88]想要变成你的猫[03:09.98]赖在你怀里睡着[03:12.37]每天都贪恋着你的好"
    //}
    {
        name: "晴天",
        artist: "周杰伦",
        //url: "http://url.amp3a.com/kuwo.php/228908.mp3",
        url: "http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid=MUSIC_228908&type=convert_url&response=res",
        lrc: "https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=228908",
        lrcAdapter: lrcAdapter,
    },
    {
        name: "夜曲",
        artist: "周杰伦",
        //url: "http://url.amp3a.com/kuwo.php/118980.mp3",
        url: "http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid=MUSIC_118980&type=convert_url&response=res",
        lrc: "https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=118980",
        lrcAdapter: lrcAdapter,
    },
    {
        name: "青花瓷",
        artist: "周杰伦",
        //url: "http://url.amp3a.com/kuwo.php/324244.mp3",
        url: "http://antiserver.kuwo.cn/anti.s?format=mp3|mp3&rid=MUSIC_324244&type=convert_url&response=res",
        lrc: "https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=324244",
        lrcAdapter: lrcAdapter,
    }
]

let player = new LPlayer({
    ele,
    lrcType: 1,
    music: []
});
//右侧列表
let list = new SList({
    ele: document.querySelector('.list'),
    button: { delete: true },
    list: audios,
    mode: 'local',
});
if (!list.list || list.list.length === 0) {
    list.add(audios);
}
list.on('lineclick', listLineClick);
list.on('deleteclick', listDelete);

//左侧搜索
let search = new SList({
    ele: document.querySelector('.search'),
    list: [],
    button: { add: true },
    url: '/api/Music/GetMusicList',
    mode: 'url',
    search: true,
});
search.on('lineclick', searchLineClick);
search.on('addclick', searchAdd);
search.adapter.set('search', searchAdapter);

if (musicShare.info) {
    // 2022-5-18 cls 添加分享设置
    search.add(shareAdapter(musicShare));

    search.active(0);
    player.list.add(search.list);
    player.list.container = search;
} else {
    // 2022-5-18 cls 添加分享设置 原本走的设置
    list.active(0);
    player.list.add(list.list);
    player.list.container = list;
}


player.on('listswitch', playerListSwitch);
player.adapter.set('lrc', lrcAdapter);

container.player = player;
initPageControl(container);
