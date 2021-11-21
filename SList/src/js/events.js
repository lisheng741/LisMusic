class Events {
    constructor() {
        this.events = {};

        this.listEvents = [
            'add',
            'delete',
            'lineclick',
            'addclick',
            'deleteclick',
            'aftersearch'
        ];
    }

    on(name, callback) {
        if (this.listEvents.indexOf(name) === -1) {
            console.error(`Unknown event name: ${name}`);
            return;
        }
        if (typeof callback === 'function') {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        }
    }

    off(name, callback) {
        if (this.listEvents.indexOf(name) === -1 || typeof callback === 'function') {
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
}

export default Events;
