import Icons from './icons';
import tplPlayer from '../template/player.art'

class TemplatePlayer {
    constructor(options) {
        this.ele = options.ele;
        this.options = options.options;
        this.init();
    }

    init() {
        this.ele.innerHTML = tplPlayer({
            options: this.options,
            icons: Icons,
        });

        this.player = this.ele.querySelector('.lplayer-window');

        this.playerBody = this.ele.querySelector('.lplayer-body');
        this.playerLast = this.ele.querySelector('.lplayer-body-last');
        this.playerCurrent = this.ele.querySelector('.lplayer-body-current');
        this.playerNext = this.ele.querySelector('.lplayer-body-next');

        this.lrcLast = this.ele.querySelector('.lplayer-body-last .lplayer-lrc-contents');
        this.titleLast = this.ele.querySelector('.lplayer-body-last .lplayer-title');
        this.authorLast = this.ele.querySelector('.lplayer-body-last .lplayer-author');
        this.lrc = this.ele.querySelector('.lplayer-body-current .lplayer-lrc-contents');
        this.title = this.ele.querySelector('.lplayer-body-current .lplayer-title');
        this.author = this.ele.querySelector('.lplayer-body-current .lplayer-author');
        this.lrcNext = this.ele.querySelector('.lplayer-body-next .lplayer-lrc-contents');
        this.titleNext = this.ele.querySelector('.lplayer-body-next .lplayer-title');
        this.authorNext = this.ele.querySelector('.lplayer-body-next .lplayer-author');

        this.playBar = this.ele.querySelector('.lplayer-time-bar');
        this.played = this.ele.querySelector('.lplayer-bar-played');
        this.loaded = this.ele.querySelector('.lplayer-bar-loaded');
        this.playTime = this.ele.querySelector('.lplayer-time-play');
        this.endTime = this.ele.querySelector('.lplayer-time-end');
        this.playButton = this.ele.querySelector('.lplayer-play-btn');
    }
}

export default TemplatePlayer;