import utils from "./utils";

class List {
    constructor(player) {
        this.player = player;
        this.index = 0;
        this.audios = this.player.options.audios;
        // this.handleAudio(this.audios);
    }

    handleAudio(audios) {
        if (Object.prototype.toString.call(audios) !== '[object Array]') {
            audios = [audios];
        }

        audios.map((item) => {
            item.name = item.name || item.title || 'Audio name';
            item.artist = item.artist || item.author || item.singer || 'Audio artist';
            item.lrc = item.lrc;
            item.cover = item.cover || item.pic;
            item.type = item.type || 'normal';
            return item;
        });

        // let audio = {
        //     name: '',
        //     artist: '',
        //     lrc: '[00:00.000] 作词 \n[00:05.000] 作曲' || '/api/music/getLrc' || [],
        //     src: '',
        // }
    }

    add(audios) {
        if (Object.prototype.toString.call(audios) !== '[object Array]') {
            audios = [audios];
        }
        this.player.events.trigger('listadd', {
            audios: audios,
        });
        // this.handleAudio(audios);
        let wasEmpty = this.audios.length === 0;
        //this.audios = this.audios.concat(audios);
        if (wasEmpty) {
            this.audios = audios;
            this.switch(0);
        }else{
            for(let i = 0; i < audios.length; i++){
                this.audios.push(audios[i]);
            }
        }
    }

    remove(index) {
        this.player.events.trigger('listremove', {
            index: index,
        });
        if (this.audios[index]) {
            if (this.audios.length > 1) {
                this.audios.splice(index, 1);

                if (index === this.index) {
                    if (this.audios[index]) {
                        this.switch(index);
                    } else {
                        this.switch(index - 1);
                    }
                }
                if (this.index > index) {
                    this.index--;
                }
            } else {
                this.clear();
            }
        }
    }

    last() {
        if (!this.audios.length) {
            return false;
        }
        let index = this.index === 0 ? this.audios.length - 1 : this.index - 1;
        this.switch(index);
        return true;
    }

    next() {
        if (!this.audios.length) {
            return false;
        }
        let index = this.index === this.audios.length - 1 ? 0 : this.index + 1;
        this.switch(index);
        return true;
    }

    switch(index) {
        this.player.events.trigger('listswitch', {
            index: index,
        });

        if (typeof index !== 'undefined' && this.audios[index]) {
            this.index = index;

            this.player.setAudio(this.audios[this.index]);
            this.setHtml();

            // set duration time
            if (this.player.duration !== 1) {
                // compatibility: Android browsers will output 1 at first
                this.player.templatePlayer.endTime.innerHTML = utils.secondToTime(this.player.duration);
            }
        }
    }

    setHtml() {
        if (!this.audios.length) {
            return false;
        }
        //current
        let index = this.index;
        let audio = this.audios[index];
        this.player.templatePlayer.title.innerHTML = audio.name;
        this.player.templatePlayer.author.innerHTML = audio.artist;
        this.player.lrc.set(index);
        this.player.lrc.update(0);
        //last
        index = this.index === 0 ? this.audios.length - 1 : this.index - 1;
        audio = this.audios[index];
        this.player.templatePlayer.titleLast.innerHTML = audio.name;
        this.player.templatePlayer.authorLast.innerHTML = audio.artist;
        this.player.lrc.set(index, this.player.templatePlayer.lrcLast);
        //next
        index = this.index === this.audios.length - 1 ? 0 : this.index + 1;
        audio = this.audios[index];
        this.player.templatePlayer.titleNext.innerHTML = audio.name;
        this.player.templatePlayer.authorNext.innerHTML = audio.artist;
        this.player.lrc.set(index, this.player.templatePlayer.lrcNext);
    }

    clear() {
        this.player.events.trigger('listclear');
        this.index = 0;
        this.player.pause();
        this.audios = [];
        this.player.lrc.clear();
        this.player.audio.src = '';
        this.player.templatePlayer.title.innerHTML = '';
        this.player.templatePlayer.author.innerHTML = '';
        this.player.bar.set('loaded', 0, 'height');
        this.player.templatePlayer.endTime.innerHTML = utils.secondToTime(0);
    }
}

export default List;