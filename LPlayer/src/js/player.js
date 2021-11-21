import Promise from 'promise-polyfill';

import utils from './utils';
import handleOption from './options';
import TemplatePlayer from './template-player';
import Lrc from './lrc';
import Events from './events';
import Adapter from './adapter';
import Storage from './storage';
import Bar from './bar';
import Controller from './controller';
import List from './list';

const instances = [];

class Player {
    constructor(options) {
        this.options = handleOption(options);
        this.ele = this.options.ele;
        this.paused = true;
        this.playedPromise = Promise.resolve();

        this.ele.classList.add('lplayer');
        this.templatePlayer = new TemplatePlayer({
            ele: this.ele,
            options: this.options
        });
        this.lrc = new Lrc({
            container: this.templatePlayer.lrc,
            player: this,
            async: this.options.lrcType === 1,
        })
        this.events = new Events();
        this.adapter = new Adapter();
        this.storage = new Storage(this);
        this.bar = new Bar(this.templatePlayer);
        this.controller = new Controller(this);
        this.list = new List(this);

        this.initAudio();
        this.bindEvents();
        this.list.switch(0);

        instances.push(this);
    }

    initAudio() {
        this.audio = document.createElement('audio');
        this.audio.preload = this.options.preload;

        for (let i = 0; i < this.events.audioEvents.length; i++) {
            this.audio.addEventListener(this.events.audioEvents[i], (e) => {
                this.events.trigger(this.events.audioEvents[i], e);
            });
        }
    }

    bindEvents() {
        this.on('play', () => {
            if (this.paused) {
                this.setUIPlaying();
            }
        });

        this.on('pause', () => {
            if (!this.paused) {
                this.setUIPaused();
            }
        });

        this.on('timeupdate', () => {
            if (!this.disableTimeupdate) {
                this.bar.set('played', this.audio.currentTime / this.duration, 'height');
                this.lrc && this.lrc.update();
                const currentTime = utils.secondToTime(this.audio.currentTime);
                if (this.templatePlayer.playTime.innerHTML !== currentTime) {
                    this.templatePlayer.playTime.innerHTML = currentTime;
                }
            }
        });

        // show audio time: the metadata has loaded or changed
        this.on('durationchange', () => {
            if (this.duration !== 1) {
                // compatibility: Android browsers will output 1 at first
                this.templatePlayer.endTime.innerHTML = utils.secondToTime(this.duration);
            }
        });

        // Can seek now
        this.on('loadedmetadata', () => {
            this.seek(0);
            if (!this.paused) {
                this.audio.play();
            }
        });

        // show audio loaded bar: to inform interested parties of progress downloading the media
        this.on('canplay', () => {
            const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0;
            this.bar.set('loaded', percentage, 'height');
        });
        this.on('progress', () => {
            const percentage = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.duration : 0;
            this.bar.set('loaded', percentage, 'height');
        });

        // loop audio play
        this.on('ended', () => {
            this.play();
            switch (this.options.loop) {
                case 'one':
                    this.play();
                    break;
                case 'list':
                default:
                    this.next();
                    break;
            }
        });
    }

    setAudio(audio) {
        this.audio.src = audio.url;
    }

    get duration() {
        return isNaN(this.audio.duration) ? 0 : this.audio.duration;
    }

    on(name, callback) {
        this.events.on(name, callback);
    }

    off(name, callback) {
        this.events.off(name, callback);
    }

    seek(time) {
        time = Math.max(time, 0);
        time = Math.min(time, this.duration);
        this.audio.currentTime = time;
        this.bar.set('played', time / this.duration, 'height');
        this.templatePlayer.playTime.innerHTML = utils.secondToTime(time);
    }

    last() {
        this.list.last();
    }

    next() {
        this.list.next();
    }

    /**
     * toggle between play and pause
     */
    toggle() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.setUIPlaying();

        const playPromise = this.audio.play();
        if (playPromise) {
            playPromise.catch((e) => {
                console.warn(e);
                if (e.name === 'NotAllowedError') {
                    this.setUIPaused();
                }
            })
        }
    }

    pause() {
        this.setUIPaused();
        this.audio.pause();
    }

    setUIPlaying() {
        if (this.paused) {
            this.paused = false;
            clearInterval(this.templatePlayer.playButton.rotateAnimation);
            this.templatePlayer.playButton.rotateAnimation = setInterval(() => {
                let iAngle = this.templatePlayer.playButton.angle || 0;
                iAngle = (iAngle + 9) % 360;
                this.templatePlayer.playButton.angle = iAngle;
                this.templatePlayer.playButton.style.transform = `rotate(${iAngle}deg)`;
            }, 50);
        }
    }

    setUIPaused() {
        if (!this.paused) {
            this.paused = true;
            clearInterval(this.templatePlayer.playButton.rotateAnimation);
        }
    }
}

export default Player;