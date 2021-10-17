import {Container,LoaderResource} from "pixi.js";
import {drawSprite} from "./global.js";

/**
 *拼接图片精灵，用于多个的图片素材再拼接组成一个精灵.
 * (比如超长的一镜到底复杂背景图，切片加载在拼装)
 * @class SpliceSprite
 * @extends {Container}
 */
export class SpliceSprite extends Container{
  
  /**
   *Creates an instance of SpliceSprite.
   * @param {Array|Object} textures   数组或者jsonmap或者object<LoaderResource>
   * @param {Number} dir  SpliceSprite.H(默认) | SpliceSprite.V
   * @memberof SpliceSprite
   */
  constructor(textures,dir){
    super();
    if(!textures||(typeof textures!="object")){
      console.error("Invalid params!");
    }
    // 所有的材质的位置数组
    this.dir = dir||SpliceSprite.H;
    let lastItem = {x:0,y:0,width:0,height:0};
    for (const k in textures) {
      if (Object.hasOwnProperty.call(textures, k)) {
        let texture = textures[k];
        if(texture instanceof LoaderResource){
          texture = texture.texture;
        }
        let item = super.addChild(drawSprite(texture));
        const x = lastItem.x+((this.dir==SpliceSprite.H)?lastItem.width:0);
        const y = lastItem.y+((this.dir==SpliceSprite.V)?lastItem.height:0);
        item.position.set(x,y);
        lastItem = item;
        s.visible = false;
        // s.renderable = false;  //updateTransform methods will still be called
      }
    }
  }
}
// 横向
SpliceSprite.H = 1;
// 纵向
SpliceSprite.V = 2;