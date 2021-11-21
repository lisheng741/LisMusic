import axios from "axios";

class Search {
    constructor(list) {
        this.list = list;
        this.options = this.list.options;
        this.data = this.list.list;

        this.bindEvents();
    }

    bindEvents() {
        this.list.templateList.searchButton.addEventListener('click', (e) => {
            this.search(this.list.templateList.searchText.value);
        });
        this.list.templateList.searchText.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                this.search(this.list.templateList.searchText.value);
            }
        });
        this.list.on('aftersearch', (e) => {
            this.list.list = e;
            this.list.templateList.clear();
            this.list.templateList.add(this.list.list);
        });
    }

    search(text) {
        axios.get(this.options.url, {
            params: {
                keyWord: text
            }
        }).then((response) => {
            let adapter = this.list.adapter.get('search') || (data => data);
            //console.log(response.data);
            this.data = adapter(response.data.data);
            this.list.events.trigger('aftersearch', this.data);
        }).catch((error) => {
            //console.error(error);
            //this.data = [];
        });

        // axios.get('https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=64686845').then(function(response){
        //     console.log(response.data);
        // })
    }
}

export default Search;