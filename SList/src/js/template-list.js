import templateList from '../template/list.art';
import templateLine from '../template/line.art';

class TemplateList {
    constructor(options) {
        this.ele = options.ele;
        this.data = options.list;
        this.options = options.options;
        this.init();
    }

    init() {
        this.ele.innerHTML = templateList({
            options: this.options
        });

        this.list = this.ele.querySelector('.slist-list');
        this.search = this.ele.querySelector('.slist-search');
        this.searchText = this.ele.querySelector('.slist-search-text');
        this.searchButton = this.ele.querySelector('.slist-search-button');

        this.add(this.data);
    }

    add(list, index){
        this.list.innerHTML += templateLine({
            list: list,
            options: this.options,
            index: index || 0,
        });
    }

    delete(index){
        if(typeof index === 'undefined'){
            return;
        }
        let list = this.list.querySelectorAll('.slist-list-line');
        list[index].remove();
    }

    clear(){
        this.list.innerHTML = '';
    }
}

export default TemplateList;