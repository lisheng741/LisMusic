import utils from './utils';
import Icons from './icons';

const CON_MOVING_DIRECTION_HORIZONTAL = 'horizontal';
const CON_MOVING_DIRECTION_VERTICAL = 'vertical';
const CON_PAGE_1 = 0;
const CON_PAGE_2 = -33.3333;
const CON_PAGE_3 = -66.6666;

class Controller {
    constructor(player) {
        this.player = player;

        this.initPlayBar();
        this.initControl();
        this.initPlayControl();

        this.player.templatePlayer.playButton.addEventListener('click', () => {
            this.player.toggle();
        });
    }

    initPlayBar() {
        const thumbMove = (e) => {
            let percentage = ((e.clientY || e.changedTouches[0].clientY) - this.player.templatePlayer.playBar.getBoundingClientRect().top) / this.player.templatePlayer.playBar.clientHeight;
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.player.bar.set('played', percentage, 'height');
            this.player.lrc.update(percentage * this.player.duration);
            this.player.templatePlayer.playTime.innerHTML = utils.secondToTime(percentage * this.player.duration);
        };

        const thumbUp = (e) => {
            document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
            document.removeEventListener(utils.nameMap.dragMove, thumbMove);
            let percentage = ((e.clientY || e.changedTouches[0].clientY) - this.player.templatePlayer.playBar.getBoundingClientRect().top) / this.player.templatePlayer.playBar.clientHeight;
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.player.bar.set('played', percentage, 'height');
            this.player.seek(percentage * this.player.duration);
            this.player.play();
            this.player.disableTimeupdate = false;
            this.dragging = false;
        };

        this.player.templatePlayer.playBar.addEventListener(utils.nameMap.dragStart, () => {
            this.dragging = true;
            this.player.disableTimeupdate = true;
            document.addEventListener(utils.nameMap.dragMove, thumbMove);
            document.addEventListener(utils.nameMap.dragEnd, thumbUp);
        });
    }

    initControl() {
        const thumbMove = (e) => {
            if (!this.movingDirection) {
                let dragX = Math.abs((e.clientX || e.changedTouches[0].clientX) - this.dragStartX);
                let dragY = Math.abs((e.clientY || e.changedTouches[0].clientY) - this.dragStartY);
                if (dragX > dragY && dragX > 5) {
                    //横向
                    this.movingDirection = CON_MOVING_DIRECTION_HORIZONTAL;
                } else if (dragX < dragY && dragY > 5) {
                    //纵向
                    this.movingDirection = CON_MOVING_DIRECTION_VERTICAL;
                }
            }
            e.dragStartX = this.dragStartX;
            e.dragStartY = this.dragStartY;
            e.direction = this.movingDirection;
            this.player.events.trigger('dragmove', e);
        };

        const thumbUp = (e) => {
            e.dragStartX = this.dragStartX;
            e.dragStartY = this.dragStartY;
            e.direction = this.movingDirection;
            this.movingDirection = '';
            this.player.templatePlayer.player.removeEventListener(utils.nameMap.dragEnd, thumbUp);
            this.player.templatePlayer.player.removeEventListener(utils.nameMap.dragMove, thumbMove);
            this.player.events.trigger('dragend', e);
        };

        this.player.templatePlayer.player.addEventListener(utils.nameMap.dragStart, (e) => {
            this.dragStartX = e.clientX || e.changedTouches[0].clientX;
            this.dragStartY = e.clientY || e.changedTouches[0].clientY;
            this.player.templatePlayer.player.addEventListener(utils.nameMap.dragMove, thumbMove);
            this.player.templatePlayer.player.addEventListener(utils.nameMap.dragEnd, thumbUp);
            e.dragStartX = this.dragStartX;
            e.dragStartY = this.dragStartY;
            e.direction = this.movingDirection;
            this.player.events.trigger('dragstart', e);
        });
    }

    initPlayControl() {
        const thumbMove = (e) => {
            if (e.direction !== CON_MOVING_DIRECTION_VERTICAL) {
                return;
            }
            let dragPercentage = ((e.clientY || e.changedTouches[0].clientY) - e.dragStartY) / document.documentElement.clientHeight / 3 * 100;
            let percentage = (this.player.templatePlayer.playerBody.dragStartPercentageY || CON_PAGE_1) + dragPercentage;
            if (percentage >= 0 || percentage <= -66.6666) return;
            this.player.templatePlayer.playerBody.style.transform = `translateY(${percentage}%)`;
        };

        const thumbUp = (e) => {
            let drag = (e.clientY || e.changedTouches[0].clientY) - e.dragStartY;
            let playControl = '';
            let finalPercentage = this.player.templatePlayer.playerBody.dragStartPercentageY || CON_PAGE_1;
            let percentage = finalPercentage + (drag / document.documentElement.clientHeight / 3 * 100); //初始 + 拖动距离
            if (e.direction !== CON_MOVING_DIRECTION_VERTICAL || Math.abs(drag) < 100) {
                clearEvents(percentage, finalPercentage, playControl);
                return;
            }
            
            if (drag > 100) {
                //上一曲
                finalPercentage = CON_PAGE_1;
                playControl = 'l';
            } else if (drag < 100) {
                //下一曲
                finalPercentage = CON_PAGE_3;
                playControl = 'n';
            }
            clearEvents(percentage, finalPercentage, playControl);
        };

        const clearEvents = (percentage, finalPercentage, playControl) => {
            //清除事件
            this.player.off('dragmove', thumbMove);
            this.player.off('dragend', thumbUp);
            //设置定时器
            let transformInterval = setInterval(() => {
                if (Math.abs(percentage - finalPercentage) < 1) {
                    //切换歌词 action ……
                    switch (playControl) {
                        case 'l':
                            this.player.last();
                            break;
                        case 'n':
                            this.player.next();
                            break;
                        default:
                            break;
                    }
                    //补充代码
                    this.player.templatePlayer.playerBody.dragStartPercentageY = CON_PAGE_2; //finalPercentage;
                    let percentage = this.player.templatePlayer.playerBody.dragStartPercentageY || 0;
                    this.player.templatePlayer.playerBody.style.transform = `translateY(${percentage}%)`;
                    clearInterval(transformInterval);
                    this.dragging = false;
                } else if (percentage < finalPercentage) {
                    percentage = percentage + 1;
                    this.player.templatePlayer.playerBody.style.transform = `translateY(${percentage}%)`;
                } else {
                    percentage = percentage - 1;
                    this.player.templatePlayer.playerBody.style.transform = `translateY(${percentage}%)`;
                }
            }, 15);
        };

        this.player.on('dragstart', (e) => {
            if (this.dragging) {
                return;
            }
            this.dragging = true;
            this.player.templatePlayer.playerBody.dragStartPercentageY = this.player.templatePlayer.playerBody.dragStartPercentageY || parseFloat(this.player.templatePlayer.playerBody.style.transform.match(/-?\d+(.\d+)?%/)[0]) || CON_PAGE_1;
            this.player.on('dragmove', thumbMove);
            this.player.on('dragend', thumbUp);
        });
    }
}

export default Controller;
