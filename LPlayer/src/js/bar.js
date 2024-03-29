class Bar {
    constructor(templatePlayer) {
        this.elements = {};
        this.elements.played = templatePlayer.played;
        this.elements.loaded = templatePlayer.loaded;
    }

    /**
     * Update progress
     *
     * @param {String} type - Point out which bar it is
     * @param {Number} percentage
     * @param {String} direction - Point out the direction of this bar, Should be height or width
     */
    set(type, percentage, direction) {
        percentage = Math.max(percentage, 0);
        percentage = Math.min(percentage, 1);
        this.elements[type].style[direction] = percentage * 100 + '%';
    }

    get(type, direction) {
        return parseFloat(this.elements[type].style[direction]) / 100;
    }
}

export default Bar;
