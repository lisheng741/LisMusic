
class Adapter{
    constructor(){
        this.adapters = {};
        this.events = ['lrc'];
    }

    execute(name, data){
        if(typeof this.adapters[name] !== 'function'){
            return;
        }
        return this.adapters[name](data);
    }

    get(name){
        if(typeof this.adapters[name] !== 'function'){
            return;
        }
        return this.adapters[name];
    }

    set(name, callback){
        if(this.events.indexOf(name) === -1 || typeof callback !== 'function'){
            return;
        }
        this.adapters[name] = callback;
    }

    remove(name, callback){
        if(this.events.indexOf(name) === -1 || typeof callback !== 'function'){
            return false;
        }
        return delete this.adapters[name];
    }
}

export default Adapter;