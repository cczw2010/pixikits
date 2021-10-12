import {Container,Graphics} from "pixi.js"
import {drawSprite} from "./global.js";
// 默认参数
const defaultParams = {
  percent:0,
  background:0xe2e2e2, //color|PIXI.Texture
  progress:0x65d521,   //color|PIXI.Texture
  icon:null,          //PIXI.Texture|PIXI.Texture，可以在进度条前设置一个前进的图标
  width:0,            //如果background和progress不是颜色，可以不设置使用自身宽高
  height:0,           //如果background和progress不是颜色，可以不设置使用自身宽高
};
// 实际参数
const actualParams = {};
// mask
const progressMask = new Graphics();

/**
 * ProgressBar组件
 */
export class ProgressBar extends Container{
  // 构造函数
  constructor(params){
    super();
    params = params||{};
    Object.assign(actualParams,defaultParams,params);
    this.sortableChildren = true;
    
    this.percent = actualParams.percent;
    this.addChild(progressMask);
    this.icon = null;
    if(actualParams.icon){
      this.icon = this.addChild(drawSprite(actualParams.icon));
      this.icon.zIndex =2;
    }

    this.setBackground(actualParams.background);
    this.setProgress(actualParams.progress);
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
      this.background.destory({children:true});
    }
    this.background = this.addChild(drawSprite(background,actualParams.width,actualParams.height));
    this.background.zIndex = 0;
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
    this.progress = this.addChild(drawSprite(progress,actualParams.width,actualParams.height));
    this.progress.zIndex = 1;
    this.progress.mask = progressMask;

    this.setPercent();
  }

  // 设置进度 
  setPercent(percent){
    if(percent){
      this.percent = percent;
    }
    progressMask.clear();
    progressMask.beginFill(0xff0000)
      .drawRect(0, 0, actualParams.width*this.percent, actualParams.height)
      .endFill();

    if(this.icon){
      this.icon.position.x=actualParams.width*this.percent;
    }
  }
}