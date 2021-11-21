export default (options) => {
    // default options
    const defaultOption = {
        ele: options.ele || document.querySelector('.slist'),
        button: options.button || {},
        list: options.list || [],
        url: options.url || '',
        mode: options.mode || 'list', //url //local
        search: options.search || false,
    };
    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }

    return options;
};