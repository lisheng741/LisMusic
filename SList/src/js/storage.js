import utils from './utils';

class Storage {
    constructor(list) {
        var storageName = 'slist_storage_list_' + list.options.ele.className;
        this.CON_STORAGE_LIST = storageName;
        this.list = list;
    }

    getList(){
        return JSON.parse(this.get(this.CON_STORAGE_LIST)) || [];
    }

    setList(){
        this.set(this.CON_STORAGE_LIST, this.list.list);
    }

    get(key) {
        return utils.storage.get(key);
    }

    set(key, data) {
        utils.storage.set(key, JSON.stringify(data));
    }
}

export default Storage;
