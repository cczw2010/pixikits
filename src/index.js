/**
 * 基于pixijs6, 该套件会禁用默认的interaction plugin 事件体系，换用pixijs6新增的 EventSystem,需要在页面上显式的引入对应文件, 且调用初始化之前无法使用新的事件体系 EventSystem
 * 需要注意的是该事件体系并未正式发布
 * 调用pixiToolHook初始化该组件，要在页面加载完之后
 */
import * as global from "./global.js";
import {initEvent,tap,dragable} from "./eventsExt.js";
export const VERSION = '1.0.0';
/**
 * @namespace PixiKits
 */
// 初始化
export function init(pixiApp){
  global.init(pixiApp);
  initEvent();
};
export {tap,dragable};
export * from "./keepScreen.js";
export * from "./ui-slider.js";
export * from "./ui-scroller.js";


