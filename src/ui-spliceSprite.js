import {Container,Sprite} from "pixi.js";

/**
 *拼接精灵，用于过大的图片素材分割后组成一个精灵，会根据当前显示区域的位置显示对应精灵切片，不会一次性全部绘制.
 * (比如超长的一镜到底复杂背景图)
 * @class SpliceSprite
 * @extends {Sprite}
 */
class SpliceSprite extends Container{
  constructor(params={}){
    super();
    if(Array.isArray(params.textures) || !params.width || !params.height){
      console.error("The params of constructor is error ");
      return;
    }
    // 所有的材质的位置数组
    this.maps = [];
    textures.forEach(t => {
      
    });
  }
}
