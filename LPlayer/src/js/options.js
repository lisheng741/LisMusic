export default (options) => {
    const defaultOption = {
        ele: options.ele || document.querySelector('.player'),
        audios: options.music || [],
        preload: 'metadata',
        loop: options.loop || 'list', //one
        lrcType: options.lrcType || 0,
    };
    for (const defaultKey in defaultOption) {
        if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
            options[defaultKey] = defaultOption[defaultKey];
        }
    }

    return options;
};