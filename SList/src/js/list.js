import handleOption from './options';
import Storage from './storage';
import Events from './events';
import Adapter from './adapter';
import TemplateList from "./template-list";
import Search from './search';

class SList {
    constructor(options) {
        this.index = 0;
        this.options = handleOption(options);
        this.storage = new Storage(this);
        if(options.mode === 'list'){
            this.list = this.options.list;
        }else if(options.mode === 'local'){
            this.list = this.storage.getList() || [];
        }else{
            this.list = [];
        }
        this.ele = this.options.ele;
        this.events = new Events();
        this.adapter = new Adapter();

        this.templateList = new TemplateList({
            ele: this.ele,
            list: this.list,
            options: this.options
        });
        if(this.options.search){
            this.search = new Search(this);
        }
        this.bindEvents();
    }

    bindEvents() {
        this.templateList.list.addEventListener('click', (e) => {
            if (e.target.tagName.toUpperCase() === 'OL') {
                return;
            }
            if(e.target.classList.contains('slist-list-line-add')){
                this.events.trigger('addclick', e.target.parentElement);
                return;
            }
            if(e.target.classList.contains('slist-list-line-delete')){
                this.events.trigger('deleteclick', e.target.parentElement);
                return;
            }
            let target;
            if (e.target.tagName.toUpperCase() === 'LI') {
                target = e.target;
            } else {
                target = e.target.parentElement;
            }
            this.events.trigger('lineclick', target);
            let index = parseInt(target.getAttribute('data-id'));
            this.active(index);
        });

        this.on('deleteclick', (e) => {
            let index = parseInt(e.getAttribute('data-id'));
            this.delete(index);
        });
    }

    on(name, callback) {
        this.events.on(name, callback);
    }

    off(name, callback) {
        return this.events.off(name, callback);
    }

    active(index){
        if(typeof index === 'undefined'){
            return;
        }
        this.index = index;
        let oldActive = this.templateList.list.querySelector('.slist-list-line.active');
        oldActive && oldActive.classList.remove('active');
        let list = this.templateList.list.querySelectorAll('.slist-list-line');
        list[index].classList.add('active');
    }

    add(list){
        if(Object.prototype.toString.call(list) !== '[object Array]'){
            list = [list];
        }
        this.events.trigger('add', {list});
        this.templateList.add(list, this.list.length);
        //this.list = this.list.concat(list);
        for(let i = 0; i < list.length; i++){
            this.list.push(list[i]);
        }
        this.storage.setList();
    }

    delete(index){
        if(typeof index === 'undefined'){
            return;
        }
        this.events.trigger('delete', {index});
        if(this.list[index]){
            this.list.splice(index, 1);
        }
        this.templateList.delete(index);
        this.storage.setList();
    }
}

export default SList;