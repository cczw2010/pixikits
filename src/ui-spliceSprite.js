import {Container,Sprite} from "pixi.js";
import {app} from "./global.js";

/**
 *拼接精灵，用于过大的图片素材分割后组成一个精灵，会根据当前显示区域的位置显示对应精灵切片，不会一次性全部绘制.
 * (比如超长的一镜到底复杂背景图)
 * @class SpliceSprite
 * @extends {Sprite}
 */
class SpliceSprite extends Container{
  /**
   * 构造含税
   * @param {*} params {width,height,textures,dir}
   * @returns 
   */
  constructor(params){
    super();
    if(!params||Array.isArray(params.textures) || !params.width || !params.height){
      console.error("The params of constructor is error ");
      return;
    }
    // 所有的材质的位置数组
    this.dir = params.dir||SpliceSprite.H;
    this.maps = [];
    let lastItem = {x:0,y:0,t:null};
    params.textures.forEach((t) => {
      const item = {
        x:lastItem.x+(lastItem.t && this.dir==SpliceSprite.H)?lastItem.t.width:0,
        y:lastItem.y+(lastItem.t && this.dir==SpliceSprite.V)?lastItem.t.height:0,
        t
      };
      this.maps.push(item);
      lastItem = item;
    });
    console.log(this.maps);
  }
}
// 横向
SpliceSprite.H = 1;
// 纵向
SpliceSprite.V = 2;