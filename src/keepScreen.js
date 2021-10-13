import * as G from "./global.js";
import {Rectangle} from "pixi.js";

export let isSkew = false;
let orientation = "v";
/**
 * 全屏化并保持舞台的方向
 * @param {string} direction 方向，h横向，v纵向（默认）
 * @return {object} StageSize 程序逻辑意义上的宽高，比如保持横屏翻转后，高就是宽
 */
function keepScreen(direction) {
  if(direction && typeof direction=="string"){
    // console.log(orientation,"change",orientation);
    orientation = direction=="h"?"h":"v";
  }
  const app = G.app;
  let wWidth = document.body.clientWidth;
  let wHeight = document.body.clientHeight;

  const isV = wWidth<wHeight;  //是否竖屏
  isSkew = ((orientation=="v"&&!isV) || (orientation!="v"&&isV))?true:false;
  app.renderer.autoResize = true;    //为了确认宽高的格式正确
  app.renderer.resize(wWidth, wHeight);
  if(isSkew){
    // app.stage.rotation = 1.57;
    app.stage.angle = 90;
    app.stage.x = wWidth;
    app.stage.hitArea =  new Rectangle(0, 0, wHeight,wWidth);  //翻转后移动端会影响点击区域
  }else{
    app.stage.angle = 0;
    app.stage.x = 0;
    app.stage.hitArea =  app.screen;
  }
  // console.log(isSkew,"isSkew",wWidth,wHeight, app.stage.hitArea);

  window.addEventListener("resize",keepScreen);
  return isSkew?{width:wHeight,height:wWidth}:{width:wWidth,height:wHeight};
}
export  {keepScreen};