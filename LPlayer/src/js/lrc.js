import templateLrc from '../template/lrc.art';
import axios from 'axios';

const CON_LRC_HEIGHT = 20;

class Lrc {
    constructor(options) {
        this.container = options.container;
        this.async = options.async;
        this.player = options.player;
        this.index = 0;
        this.current = [];
    }

    update(currentTime = this.player.audio.currentTime) {
        if (this.index > this.current.length - 1 || currentTime < this.current[this.index][0] || (!this.current[this.index + 1] || currentTime >= this.current[this.index + 1][0])) {
            for (let i = 0; i < this.current.length; i++) {
                if (currentTime >= this.current[i][0] && (!this.current[i + 1] || currentTime < this.current[i + 1][0])) {
                    let iTranslate = i - 1 < 0 ? 0 : i - 1;
                    this.index = i;
                    this.container.style.transform = `translateY(${-iTranslate * CON_LRC_HEIGHT}px)`;
                    this.container.style.webkitTransform = `translateY(${-iTranslate * CON_LRC_HEIGHT}px)`;
                    this.container.getElementsByClassName('lplayer-lrc-current')[0].classList.remove('lplayer-lrc-current');
                    this.container.getElementsByTagName('p')[i].classList.add('lplayer-lrc-current');
                }
            }
        }
    }

    clear() {
        this.current = [];
        this.container.innerHTML = '';
    }

    set(index, container) {
        if (Object.prototype.toString.call(this.player.list.audios[index].lrc) !== '[object Array]') {
            if (!this.async) {
                if (this.player.list.audios[index].lrc) {
                    this.player.list.audios[index].lrc = this.parse(this.player.list.audios[index].lrc);
                } else {
                    this.player.list.audios[index].lrc = [['00:00', 'Not available']];
                }
            } else {
                let url = this.player.list.audios[index].lrc;
                this.player.list.audios[index].lrc = [['00:00', 'Loading']];
                axios.get(url)
                    .then((response) => {
                        let data = response.data;
                        let adapter = this.player.list.audios[index].lrcAdapter || this.player.adapter.get('lrc') || (data => data);
                        this.player.list.audios[index].lrc = adapter(data);
                        this.set(index, container); //再调一次自己
                    }).catch((error) => {
                        console.error(error);
                        this.player.list.audios[index].lrc = [['00:00', 'Not available']];
                    });
            }
        }

        container = container || this.container;
        container.innerHTML = templateLrc({
            lyrics: this.player.list.audios[index].lrc,
        });
        if(container === this.container){
            this.current = this.player.list.audios[index].lrc;
            this.update(0);
        }
    }

    /**
     * Parse lrc, suppose multiple time tag
     *
     * @param {String} lrc_s - Format:
     * [mm:ss]lyric
     * [mm:ss.xx]lyric
     * [mm:ss.xxx]lyric
     * [mm:ss.xx][mm:ss.xx][mm:ss.xx]lyric
     * [mm:ss.xx]<mm:ss.xx>lyric
     *
     * @return {String} [[time, text], [time, text], [time, text], ...]
     */
    parse(lrc_s) {
        if (lrc_s) {
            lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + '\n[');
            const lyric = lrc_s.split('\n');
            let lrc = [];
            const lyricLen = lyric.length;
            for (let i = 0; i < lyricLen; i++) {
                // match lrc time
                const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
                // match lrc text
                const lrcText = lyric[i]
                    .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                    .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                    .replace(/^\s+|\s+$/g, '');

                if (lrcTimes) {
                    // handle multiple time tag
                    const timeLen = lrcTimes.length;
                    for (let j = 0; j < timeLen; j++) {
                        const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                        const min2sec = oneTime[1] * 60;
                        const sec2sec = parseInt(oneTime[2]);
                        const msec2sec = oneTime[4] ? parseInt(oneTime[4]) / ((oneTime[4] + '').length === 2 ? 100 : 1000) : 0;
                        const lrcTime = min2sec + sec2sec + msec2sec;
                        lrc.push([lrcTime, lrcText]);
                    }
                }
            }
            // sort by time
            lrc = lrc.filter((item) => item[1]);
            lrc.sort((a, b) => a[0] - b[0]);
            return lrc;
        } else {
            return [];
        }
    }
}

export default Lrc;
