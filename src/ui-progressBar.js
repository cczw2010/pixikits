import {Container,Texture,Graphics,Sprite,AnimatedSprite} from "pixi.js"

// 默认参数
const defaultParams = {
  percent:0,
  background:0xFFFFFF, //color|PIXI.Texture
  progress:0xFF0033,   //color|PIXI.Texture
  width:0,
  height:0, 
};
// 实际参数
const actualParams = {};

// 绘制对象，tc可以是颜色，可以是Texture或者AnimatedSprite的纹理数组。
const drawObject = (tc)=>{
  let object;
  if(Number.isInteger(tc)){
    object = new Sprite(Texture.WHITE);
    object.hint = tc;
  }else if(Array.isArray(tc)){
    object = new Sprite(tc);
  }else{
    object = new AnimatedSprite(textures);
  }
  if(actualParams.width){
    object.width = actualParams.width;
  }
  if(actualParams.height){
    object.height = actualParams.height;
  }
  return object;
}
// progress的mask
const progressMask = new Graphics();
/**
 * ProgressBar组件
 */
export class ProgressBar extends Container{
  // 构造函数
  constructor(params){
    super.constructor();
    if(!params || !params.width){
      console.error("ProgressBar: The constructor's params is required!")
      return false;
    }
    Object.assign(actualParams,defaultParams,params);
    this.sortableChildren = true;
    
    this.percent = actualParams.percent;

    this.setBackground(actualParams.background);
    this.setProgress(actualParams.progress);
    this.setPercent();
  }
  
  /**
   * 绘制背景,可以是颜色 也可以是Sprite的纹理或者AnimatedSprite的纹理数组。
   * @param  number<Color>|PIXI.Texture|Array<PIXI.Texture>
   */
  setBackground(background){
    if(!background){
      console.error("params is required!");
      return false;
    }
    if(this.background){
      this.removeChild(this.background);
      this.background.destory();
    }
    const bg = drawObject(background);
    bg.zIndex = 0;
    this.addChild(bg);
  }
  /**
   * 绘制progress,可以是颜色 也可以是Sprite的纹理或者AnimatedSprite的纹理数组。
   * @param  number<Color>|PIXI.Texture|Array<PIXI.Texture>
   */
  setProgress(progress){
    if(!progress){
      console.error("params is required!");
      return false;
    }
    if(this.progress){
      this.removeChild(this.progress);
      this.progress.destory();
    }
    const p = drapwObject(progress);
    p.zIndex = 1;
    p.mask = progressMask;
    this.setPercent();

    this.addChild(p);
  }

  // 设置进度 
  setPercent(percent){
    if(percent){
      this.percent = percent;
    }
    progressMask.clear();
    progressMask.beginFill()
      .drawRect(0, 0, actualParams.width*this.percent, actualParams.height)
      .endFill();
  }
}