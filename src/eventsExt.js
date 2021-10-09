/**
 * 会禁用默认的interaction plugin 事件体系，换用pixijs6新增的 EventSystem.
 * 声明V7才会正式集成， 且调用初始化之前无法使用新的事件体系 EventSystem。
 * 这里引入并未不打包生效，所以需要在页面上显式的引入对应文件。
 */ 
import * as G from "./global.js";
import { Renderer } from '@pixi/core';
import {EventSystem} from "@pixi/events";
// If you are using the pixi.js/pixi.js-legacy bundles, you'll need to remove the interaction
// plugin. This is not needed when using the scoped (@pixi/) packages directly.
// delete PIXI.Renderer.__plugins.interaction;
delete Renderer.__plugins.interaction;
// 初始化基础事件
const EventDatas = {
  isInit:false,
  isTap:false,
  drag:null,
  startGlobal:null
};
// 初始化
function initEvent(){
  if(EventDatas.isInit){
    return false;
  }
  EventDatas.isInit = true;
  // Install EventSystem, if not already
  // (PixiJS 6 doesn't add it by default)
  if (!('events' in G.app.renderer)) {
    G.app.renderer.addSystem(EventSystem, 'events');
  }
  // Render stage so that it becomes the root target for UI events
  G.app.renderer.render(G.app.stage);
  // 确保stage区域全部可响应事件
  G.app.stage.interactive = true;
  G.app.stage.hitArea = G.app.renderer.screen; 
  const _dragEnd = (e)=>{
    if(EventDatas.drag){
      EventDatas.drag.onEnd&&EventDatas.drag.onEnd(e);
      EventDatas.drag = null;
    }
    // 本次pointer周期移动距离
    if(Math.abs(e.global.x-EventDatas.startGlobal.x)>3 || Math.abs(e.global.y-EventDatas.startGlobal.y>3)){
      EventDatas.isTap = false;
    }
  };
  G.app.stage.addEventListener('pointerdown', (e)=>{
    EventDatas.startGlobal = e.global.clone();
    EventDatas.isTap = true;
    EventDatas.drag = {};
  },true);
  G.app.stage.addEventListener('pointermove', (e)=>{
    if(!EventDatas.drag || !EventDatas.drag.item){
      // _dragEnd(e);
      return false;
    }
    const dragdata = EventDatas.drag;
    const elocal = dragdata.item.parent.toLocal(e.global, null);
    let nextPosition = dragdata.item.position.clone();
    if(dragdata.autoMoveX){
      nextPosition.x = elocal.x - dragdata.startOffset.x;
    }
    if(dragdata.autoMoveY){
      nextPosition.y = elocal.y - dragdata.startOffset.y;
    }
    e.nextPosition = nextPosition;
    e.distance = {x:elocal.x-dragdata.startLocal.x,y:elocal.y-dragdata.startLocal.y};
    // console.log(e.nextPosition,e.distance);
    if(dragdata.onMove &&( dragdata.onMove(e)===false)){
      return false;
    }
    dragdata.item.position.set(e.nextPosition.x,e.nextPosition.y);
  },true);
  G.app.stage.addEventListener('pointerup', _dragEnd,true);
  G.app.stage.addEventListener('pointerleave', _dragEnd,true);
  G.app.stage.addEventListener('pointercancel', _dragEnd,true);
}

// ============================================= 事件部分
/**
 * 可拖动化
 * 原始的EventSystem 移动端的拖动通用事件的movement存在bug,这里新增了下一个位置的坐标对象（event.nextPosition）
 * !!! 特别注意，如果页面翻转，movement x,y值在逻辑上是反的
 * @param {*} object   拖拽的对象
 * @param {*} params  
 *  {
 *    dragX:true,      //是否开启拖拽X
 *    dragY:true,      //是否开启拖拽Y
 *    onStart,
 *    onMove,          //返回false会阻止自动拖拽行为， event.nextPosition代表下一个位置的local坐标，e.distance都代表移动的总距离
 *    onEnd            //e.distance都代表移动的总距离
 *  }
 */
 function dragable(object,params={}){
  if(object.isDragable){return false;}
  object.isDragable = true;
  object.interactive = true;
  object.addEventListener('pointerdown', (e)=>{
    e.preventDefault();
    e.stopPropagation();  //必须，不然多层嵌套拖动会出现问题
    const startLocal = e.target.parent.toLocal(e.global, null);
    const startPosition = e.target.position;
    const startOffset = {x:startLocal.x-startPosition.x,y:startLocal.y-startPosition.y};
    // console.log("starting",startLocal,startPosition,startOffset);
    Object.assign(EventDatas.drag,{
      startOffset,
      startLocal,
      item:object,
      autoMoveX:params.dragX===false?false:true,
      autoMoveY:params.dragY===false?false:true,
      onMove:params.onMove,
      onEnd:params.onEnd
    });
    params.onStart&&params.onStart(e);
  },false);
  // object.addEventListener('pointerup', _dragEnd);
  // object.addEventListener('pointerout', _dragEnd);
}

/**
 *点击，eventSystem的tap和pointertap移动端并不好用，所以实现一个通用的
 * @param {*} object
 * @param {*} cb
 */
function tap(object,cb){
  if(!cb){return false;}
  object.interactive = true;
  if(PIXI.utils.isMobile.phone){
    object.addEventListener("pointerup",(e)=>{
      if(EventDatas.isTap){
        cb.bind(object)(e);
      }
    });
  }else{
    object.addEventListener("click",cb);
  }
}


export {initEvent,tap,dragable};