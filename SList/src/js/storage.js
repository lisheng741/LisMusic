import utils from './utils';

class Storage {
    constructor(list) {
        this.CON_STORAGE_LIST = 'slist_storage_list';
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
