import {Container,Graphics} from "pixi.js";
import {dragable} from "./eventsExt.js";
import {drawSprite} from "./global.js";

 class Slider extends Container{
  /**
   *拖动滚动条Slider,实例对象是容器Container的子类
  * @param {object} params
  *    barkground: {...} - options for background
  *    bar:{...},     - options for bar
  *    dir:Slider.H,  - direction
  *    percent:0，    - percent
  *    cb:            - callback 
  */
  constructor(params){
    if(!params){
      console.error("params is required!");
      return;
    }
    super();
    this._optionsBackground = Slider.__defOptions.background;
    this._optionsBar = Slider.__defOptions.bar;
    this._dir = Slider.__defOptions.dir;
    this._alpha = Slider.__defOptions.alpha;
    this._alphaActive = Slider.__defOptions.alphaActive;
    
    this.background = null;
    this.bar = null;
    this.maxMovement = 0;
    this.percent = 0; //当前百分比
    this.cb = null;

    // 刷新绘制slider
    this.refresh(params);
    dragable(this.bar,{
      x:this._dir==Slider.H,
      y:this._dir==Slider.V,
      onStart:(e)=>{
        this.setActive(true);
      },
      onMove:(e)=>{
        if(this.maxMovement==0){
          return false;
        }
        if(e.nextPosition[this._dir]<0){
          e.nextPosition[this._dir]=0;
        }
        if(e.nextPosition[this._dir]>this.maxMovement){
          e.nextPosition[this._dir] = this.maxMovement;
        }
        this.setPercent(e.nextPosition[this._dir]/this.maxMovement);
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
    Object.assign(this._optionsBackground,params.background);
    Object.assign(this._optionsBar,params.bar);
    if(!Number.isInteger(this._optionsBackground.t)){
      if(!this._optionsBackground.width){
        this._optionsBackground.width = this._optionsBackground.t.width;
      }
      if(!this._optionsBackground.height){
        this._optionsBackground.height = this._optionsBackground.t.height;
      }
    }
    if(!Number.isInteger(this._optionsBar.t)){
      if(!this._optionsBar.width){
        this._optionsBar.width = this._optionsBar.t.width;
      }
      if(!this._optionsBar.height){
        this._optionsBar.height = this._optionsBar.t.height;
      }
    }
    this._dir = "dir" in params?params.dir:this._dir;
    this._alpha = "alpha" in params?params.alpha:this._alpha;
    this._alphaActive = "alphaActive" in params?params.alphaActive:this._alphaActive;

    this.cb =  "cb" in params?params.cb:this.cb;

    this._drawBg();
    this._drawBar();
    this._center();

    if(this._dir == Slider.V){
      this.maxMovement = this._optionsBackground.height-this._optionsBar.height;
    }else{
      this.maxMovement = this._optionsBackground.width-this._optionsBar.width;
    }
    if(this.maxMovement<0){
      this.maxMovement = 0;
    }

    let percent = "percent" in params?params.percent:this.percent; //当前百分比
    this.setPercent(percent);
    this.setActive(false);
  }
  /**
   * 主动设置滚动条区域的激活状态
   * @param {boolean} active  是否激活状态
   */
  setActive(active=true){
    this.alpha=active?this._alphaActive:this._alpha;
  }
  /**
   * 手动设置百分比
   */
  setPercent(percent,movebar=true){
    percent =percent>1?1:(percent<0?0:percent);
    percent = this.maxMovement==0?0:percent;
    this.percent = percent;
    if(movebar){
      this.bar.position[this._dir] = parseInt(this.maxMovement*percent);
    }
  }

  // 绘制bar
  _drawBar(){
    if(this.bar){
      this.removeChild(this.bar);
      this.bar.destroy({children:true});
    }
    this.bar = this.addChild(drawSprite(this._optionsBar.t,this._optionsBar.width,this._optionsBar.height));
  }
  // 绘制bg
  _drawBg(){
    if(this.background){
      this.removeChild(this.background);
      this.background.destroy({children:true});
    }
    this.background = this.addChild(drawSprite(this._optionsBackground.t,this._optionsBackground.width,this._optionsBackground.height));
  }

  // 居中
  _center(){
    const keyParam = this._dir==Slider.V?"width":"height";
    const offset = this.background[keyParam]-this.bar[keyParam];
    if(offset!=0){
      const item =offset>0?this.bar:this.background;
      const keyPos = this._dir==Slider.V?"x":"y";
      item[keyPos] =  Math.abs(offset)/2;
    }
  }
}
Slider.H = "x";
Slider.V = "y";
// 拖动滚动条的默认样式
Slider.__defOptions = {
  background:{
    t:0x666666,  //Hex color|PIXI.Texture
    width:0,     //宽度,如果 t 是材质，可以不设置使用材质自身宽度
    height:0,    //高度,如果 t 是材质，可以不设置使用材质自身高度
  },
  bar:{
    t:0Xff3300,
    width:0,
    height:0,
  },
  alpha:0.6,         //初始透明度
  alphaActive:1,     //激活时候的透明度
  percent:0,
  dir:Slider.H,
  cb:null
};




export {Slider};