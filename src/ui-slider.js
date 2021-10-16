import {Container} from "pixi.js";
import {dragable} from "./eventsExt.js";
import {drawSprite,deepAssign} from "./global.js";

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
    this._params = deepAssign({},Slider.__defOptions);
    this.background = null;
    this.bar = null;
    this.maxMovement = 0;
    this.percent = 0; //当前百分比

    // 刷新绘制slider
    this.refresh(params);
  }
  // 重新设置参数，并刷新
  refresh(params={}){
    const _params = deepAssign(this._params,params);
    if(!Number.isInteger(_params.background.texture)){
      if(!_params.background.width){
        _params.background.width = _params.background.texture.width;
      }
      if(!_params.background.height){
        _params.background.height = _params.background.texture.height;
      }
    }
    if(!Number.isInteger(_params.bar.texture)){
      if(!_params.bar.width){
        _params.bar.width = _params.bar.texture.width;
      }
      if(!_params.bar.height){
        _params.bar.height = _params.bar.texture.height;
      }
    }

    this._drawBg();
    this._drawBar();
    this._center();

    if(_params.dir == Slider.V){
      this.maxMovement = _params.background.height-_params.bar.height;
    }else{
      this.maxMovement = _params.background.width-_params.bar.width;
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
    this.alpha=active?this._params.alphaActive:this._params.alpha;
  }
  /**
   * 手动设置百分比
   */
  setPercent(percent,movebar=true){
    percent =percent>1?1:(percent<0?0:percent);
    percent = this.maxMovement==0?0:percent;
    this.percent = percent;
    if(movebar){
      this.bar.position[this._params.dir] = parseInt(this.maxMovement*percent);
    }
  }

  // 绘制bar
  _drawBar(){
    if(this.bar){
      this.removeChild(this.bar);
      this.bar.destroy({children:true});
    }
    this.bar = this.addChild(drawSprite(this._params.bar.texture,this._params.bar.width,this._params.bar.height));
    dragable(this.bar,{
      x:this._params.dir==Slider.H,
      y:this._params.dir==Slider.V,
      onStart:(e)=>{
        this.setActive(true);
      },
      onMove:(e)=>{
        if(this.maxMovement==0){
          return false;
        }
        if(e.nextPosition[this._params.dir]<0){
          e.nextPosition[this._params.dir]=0;
        }
        if(e.nextPosition[this._params.dir]>this.maxMovement){
          e.nextPosition[this._params.dir] = this.maxMovement;
        }
        this.setPercent(e.nextPosition[this._params.dir]/this.maxMovement);
        this._params.cb&&this._params.cb(this.percent);
        // return false;
      },
      onEnd:(e)=>{
        this.setActive(false);
      }
    });
  }
  // 绘制bg
  _drawBg(){
    if(this.background){
      this.removeChild(this.background);
      this.background.destroy({children:true});
    }
    this.background = this.addChild(drawSprite(this._params.background.texture,this._params.background.width,this._params.background.height));
  }

  // 居中
  _center(){
    const keyParam = this._params.dir==Slider.V?"width":"height";
    const offset = this.background[keyParam]-this.bar[keyParam];
    if(offset!=0){
      const item =offset>0?this.bar:this.background;
      const keyPos = this._params.dir==Slider.V?"x":"y";
      item[keyPos] =  Math.abs(offset)/2;
    }
  }
}
Slider.H = "x";
Slider.V = "y";
// 默认样式
Slider.__defOptions = {
  background:{
    texture:0xeeeeee, //Hex color|PIXI.Texture
    width:0,          //宽度,如果 t 是材质，可以不设置使用材质自身宽度
    height:0,         //高度,如果 t 是材质，可以不设置使用材质自身高度
  },
  bar:{
    texture:0x666666,
    width:0,
    height:0,
  },
  alpha:1,            //初始透明度
  alphaActive:1,      //激活时候的透明度
  percent:0,
  dir:Slider.H,
  cb:null
};

export {Slider};