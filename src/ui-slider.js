import {Container,Graphics} from "pixi.js";
import {dragable} from "./eventsExt.js";
/**
 *拖动滚动条Slider,实例对象是容器Container的子类
 * @param {object} params
 *    length:200,     //滚动条总长度
 *    lengthBar:20,   //滚动块的长度，可根据内容区域大小比来设定
 *    width:10,       //滚动条的宽度
 *    widthBar:0,   //默认0，与with相同
 *    color:0xffffff,
 *    colorBar:0Xff3300,
 *    alpha:0.4,      //初始透明度
 *    alphaActive:0.8 //激活后的透明度
 * @param {function} cb 回调  function(percent)
 */
 class Slider extends Container{
  constructor(params,cb){
    super();
    this.params = Slider.__defOptions;
    this.percent = 0; //当前百分比
    this.maxMovement = 0;
    this.cb = cb;
    // 刷新绘制slider
    this.refresh(params);
  
    dragable(this.bar,{
      dragX:false,
      onStart:(e)=>{
        this.setActive(true);
      },
      onMove:(e)=>{
        if(this.maxMovement==0){
          return false;
        }
        if(e.nextPosition.y<0){
          e.nextPosition.y=0;
        }
        if(e.nextPosition.y>this.maxMovement){
          e.nextPosition.y = this.maxMovement;
        }
        this.setPercent(e.nextPosition.y/this.maxMovement);
        this.cb&&this.cb(this.percent);
        // return false;
      },
      onEnd:(e)=>{
        this.setActive(false);
      }
    });
  }
  // 重新设置参数，并刷新
  refresh(params={}){
    this.params = Object.assign({},this.params,params);
    if(this.params.widthBar <= 0){
      this.params.widthBar = this.params.width;
    }
    this._drawBg();
    this._drawBar();
    this.alpha=this.params.alpha;

    this.maxMovement = this.params.length-this.params.lengthBar;
    this.maxMovement = this.maxMovement<0?0:this.maxMovement;
    let percent = this.maxMovement==0?0:this.bar.position.y/this.maxMovement;
    this.setPercent(percent);
  }
  /**
   * 主动设置滚动条区域的激活状态
   * @param {boolean} active  是否激活状态
   */
  setActive(active=ture){
    this.alpha=active?this.params.alphaActive:this.params.alpha;
  }
  /**
   * 手动设置百分比
   */
  setPercent(percent,movebar=true){
    percent =percent>1?1:(percent<0?0:percent);
    this.percent = percent;
    if(movebar){
      this.bar.position.y = parseInt(this.maxMovement*percent);
    }
  }

  // 绘制bar
  _drawBar(){
    if(!this.bar){
      this.bar = this.addChild(new Graphics());
    }
    this.bar.clear();
    this.bar.beginFill(this.params.colorBar)
        .drawRoundedRect(0,0,this.params.widthBar,this.params.lengthBar,10)
        .endFill();
    this.bar.pivot.set(this.params.widthBar/2,0);
  }
  // 绘制bg
  _drawBg(){
    if(!this.bg){
      this.bg = this.addChild(new Graphics());
    }
    this.bg.clear();
    this.bg.beginFill(this.params.color)
          .drawRoundedRect(0,0,this.params.width,this.params.length,1)
          .endFill();
    this.bg.pivot.set(this.params.width/2,0);
  }
}

// 拖动滚动条的默认样式
Slider.__defOptions = {
  length:200,
  lengthBar:50,
  width:10,
  widthBar:0,   //默认0，与with相同
  color:0xffffff,
  colorBar:0Xff3300,
  alpha:0.6,
  alphaActive:0.8
};

export {Slider};