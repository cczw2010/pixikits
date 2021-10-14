import {Container,Sprite} from "pixi.js";
import {app} from "./global.js";

/**
 *拼接图片精灵，用于过大的图片素材分割后组成一个精灵，会根据当前显示区域的位置显示对应精灵切片，不会一次性全部绘制.
 * (比如超长的一镜到底复杂背景图)
 * @class SpliceSprite
 * @extends {Sprite}
 */
export class SpliceSprite extends Container{
  
  /**
   *Creates an instance of SpliceSprite.
   * @param {Array|Object} textures   数组或者jsonmap
   * @param {Number} dir  SpliceSprite.H(默认) | SpliceSprite.V
   * @memberof SpliceSprite
   */
  constructor(textures,dir){
    super();
    if(!textures||!dir){
      console.error("The params of constructor is error ");
      return;
    }
    // 所有的材质的位置数组
    this.dir = dir||SpliceSprite.H;
    this.maps = [];
    let lastItem = {x:0,y:0,width:0,height:0};
    for (const k in textures) {
      if (Object.hasOwnProperty.call(textures, k)) {
        const s = this.addChild(new Sprite(textures[k]));
        const x = lastItem.x+(this.dir==SpliceSprite.H)?lastItem.width:0;
        const y = lastItem.y+(this.dir==SpliceSprite.V)?lastItem.height:0;
        s.position.set(x,y);
        s.visible = false;
        // s.renderable = false;  //updateTransform methods will still be called
        this.maps.push(s);
        lastItem = s;
      }
    }
    app.ticker.add((delta)=>{
      this.maps.forEach(function(item){
        let bounds = item.getBounds();
        // console.log(bounds,item.worldTransform);
        let out = bounds.right< 0|| bounds.bottom<0 || bounds.right>app.screen.width || bounds.top>app.screen.height;
        item.visible = !out;
      });
    });
  }
}
// 横向
SpliceSprite.H = 1;
// 纵向
SpliceSprite.V = 2;