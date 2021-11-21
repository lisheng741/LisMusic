class Events {
    constructor() {
        this.events = {};

        this.audioEvents = [
            'abort',
            'canplay',
            'canplaythrough',
            'durationchange',
            'emptied',
            'ended',
            'error',
            'loadeddata',
            'loadedmetadata',
            'loadstart',
            'mozaudioavailable',
            'pause',
            'play',
            'playing',
            'progress',
            'ratechange',
            'seeked',
            'seeking',
            'stalled',
            'suspend',
            'timeupdate',
            'volumechange',
            'waiting',
        ];
        this.playerEvents = [
            'destroy', 'listshow', 'listhide', 'listadd', 'listremove', 'listswitch', 'listclear', 'noticeshow', 'noticehide', 'lrcshow', 'lrchide',
            'dragstart', 'dragmove', 'dragend',
            'aftergetlrc'
        ];
    }

    on(name, callback) {
        if (this.type(name) && typeof callback === 'function') {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        }
    }

    off(name, callback) {
        if (!this.type(name) || !typeof callback === 'function') {
            return false;
        }
        let index = (this.events[name] || []).indexOf(callback);
        if (index === -1) {
            return false;
        }
        this.events[name].splice(index, 1);
        return true;
    }

    trigger(name, data) {
        if (this.events[name] && this.events[name].length) {
            for (let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](data);
            }
        }
    }

    type(name) {
        if (this.playerEvents.indexOf(name) !== -1) {
            return 'player';
        } else if (this.audioEvents.indexOf(name) !== -1) {
            return 'audio';
        }

        console.error(`Unknown event name: ${name}`);
        return null;
    }
}

export default Events;
