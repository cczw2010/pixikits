import {dragable} from "./eventsExt.js";
import {Slider} from "./ui-slider.js";
import {Container,Graphics,Texture} from "pixi.js";
import {drawSprite,deepAssign} from "./global.js";

/**
 * 滚动区域Scroller，实例是Container的子类，内容区域不满不会显示滚动条
 * 通过refresh方法可以手动更新视图。通过addChild来增加内容，会自动调用refresh方法
 * @class Scroller
 * @extends {Container}
 */
class Scroller extends Container{
  /**
   *Creates an instance of Scroller.
   * @param {Object} params  {
   *    width,   //宽度
   *    height,  //高度
   *    x:true|Object,             //是否开启横向滚动，传入Slider对象的配置参数才会显示滚动条
   *    y:true|Object,             //是否开启纵向滚动，传入Slider对象的配置参数才会显示滚动条
   *    bacground:0xFFFFFF|Texture|Graphics //背景
   *    drag:true,                 //是否开启内容拖拽
   *  }
   * @memberof Scroller
   */
  constructor(params){
    super();
    if(typeof params != "object"){
      console.error("params must be required!");
      // return;
    }
    this._params = deepAssign({},Scroller.__defOptions);
    // 内容最大滚动坐标
    this._contentLimitPos ={x:0,y:0};
    // 背景
    this.background = null;
    // 内容容器
    this.content = super.addChild(new Container());
    this.content.zIndex = 2;
    // 滚动条
    this.sliderX = null;
    this.sliderY = null;
    // 滚动百分比
    this.percent = {x:0,y:0};
    // 总容器
    this.sortableChildren = true;
    // 刷新UI
    this.refresh(params);
    // 内容区域可拖动
    dragable(this,{
      onStart:(e)=>{
        this.startPos = this.content.position.clone();
      },
      onMove:(e)=>{
        if(this._params.drag){
          if(this._params.x && this._contentLimitPos.x){
            let posx = this.startPos.x+e.distance.x;
            posx=posx>0?0:(posx<this._contentLimitPos.x?this._contentLimitPos.x:posx);
            this.percent.x = posx/this._contentLimitPos.x;
          }
          if(this._params.y && this._contentLimitPos.y){
            let posy = this.startPos.y+e.distance.y;
            posy=posy>0?0:(posy<this._contentLimitPos.y?this._contentLimitPos.y:posy);
            this.percent.y = posy/this._contentLimitPos.y;
          }
          this._refreshPercent();
        }
        return false;
      },
      // onEnd:(e)=>{}
    });
   
  }
  // 重写addChild，自动刷新容器
  addChild(...childs){
    this.content.addChild(...childs);
    this.refresh();
    return childs[0];
  }
  /**
   * 刷新Scroller。主要是重新计算内容尺寸和滚动条
   * Scroller.addChild 会自动计算一次，但是如果是内部的对象自己增加子对象或者自己变换尺寸并不会触发refresh ，这时候就需要自己调用刷新
   * @param object params 可以在这里重新设置参数
   */
  refresh(params={}){
    deepAssign(this._params,params);
    this._drawMask();
    this._drawBg();
    // ------- slider x
    const disx =this._params.width-this.content.width;
    this._contentLimitPos.x = disx>0?0:disx;

    if(typeof this._params.x != "object" || this._contentLimitPos.x==0){
      if(this.sliderX){
        this.removeChild(this.sliderX);
        this.sliderX.destroy({children:true});
        this.sliderX = null;
      }
    }
    if(typeof this._params.x == "object" && this._contentLimitPos.x<0){
      this._drawSliderX();
    } 
    // ------- slider y
    const disy =this._params.height-this.content.height;
    this._contentLimitPos.y = disy>0?0:disy;
    if(typeof this._params.y != "object" || this._contentLimitPos.y==0){
      if(this.sliderY){
        this.removeChild(this.sliderY);
        this.sliderY.destroy({children:true});
        this.sliderY = null;
      }
    }
    if(typeof this._params.y == "object" && this._contentLimitPos.y<0){
      this._drawSliderY();
    }
    // 重置content的点击区域
    // this.content.hitArea = new Rectangle(0,0,this.content.width,this.content.height);
    // 重置位置
    this._refreshPercent();
  }
  /**
   * 设置横向百分比
   * @param {float} percent  百分比
   */
  _refreshPercent(){
    if(this.sliderX){
      this.sliderX.setPercent(this.percent.x);
    }
    if(this.sliderY){
      this.sliderY.setPercent(this.percent.y);
    }
    this.content.position.x = this._contentLimitPos.x*this.percent.x;
    this.content.position.y = this._contentLimitPos.y*this.percent.y;
  }
  // 绘制或者更新背景
  _drawBg(){
    if(this.background){
      this.removeChild(this.background);
      this.background.destroy();
    }
    this.background = super.addChild(drawSprite(this._params.background,this._params.width, this._params.height));
    this.background.zIndex=1;
  }
  // 绘制或者更新mask
  _drawMask(){
    if(!this.mask){
      this.mask = super.addChild(new Graphics());
    }
    this.mask.clear();
    this.mask.beginFill(0xffffff)
      .drawRect(0, 0, this._params.width, this._params.height)
      .endFill();
  }
  // 绘制横向滚动条
  _drawSliderX(){
    this._params.x.background.width = this._params.width;
    this._params.x.bar.width = this._contentLimitPos.x<0?(this._params.width/this.content.width)*this._params.width:0;
    this._params.x.dir = Slider.H;
    if(!this.sliderX){
      this._params.x.cb = (percent)=>{
        this.percent.x = percent;
        this._refreshPercent();
      };
      this.sliderX = new Slider(this._params.x);
      this.sliderX.position.set(0,this._params.height-this.sliderX.height); 
      super.addChild(this.sliderX);
    }else{
      this.sliderX.refresh(this._params.x);
    }
    this.sliderX.zIndex=4;
    this.sliderX.bar.interactive=true;
    // this.sliderX.visible=(this.sliderX.maxMovement>0);
  }
  // 绘制纵向滚动条
  _drawSliderY(){
    let height = this._params.height;
    if(this.sliderX){
      height-=this.sliderX.height;
    }
    this._params.y.background.height = height;
    this._params.y.bar.height = this._contentLimitPos.y<0?(this._params.height/this.content.height)*this._params.height:0;
    this._params.y.dir = Slider.V;
    if(!this.sliderY){
      this._params.y.cb = (percent)=>{
        this.percent.y = percent;
        this._refreshPercent();
      };
      this.sliderY = new Slider(this._params.y);
      this.sliderY.position.set(this._params.width-this.sliderY.width,0);
      super.addChild(this.sliderY);
    }else{
      this.sliderY.refresh(this._params.y);
    }
    this.sliderY.zIndex=5;
    // this.sliderY.visible=(this.sliderY.maxMovement>0);
  }
}
// 默认滚动区域配置
Scroller.__defOptions = {
  width:350,
  height:200,
  background:0xFFFFFF,    //默认白色
  drag:true,   //内容区域是否可拖动,设置后不可更改
  x:{
    background:{
      texture:Texture.EMPTY,
      // width, auto set
      height:10,
    },
    bar:{
      texture:0x666666,
      // width, auto set
      height:10,
    },
    alpha:0.8,            //初始透明度
    alphaActive:1,      //激活时候的透明度
    // dir,  auto set
  },
  y:{
    background:{
      // texture:Texture.EMPTY,
      width:10,
      // height   auto set
    },
    bar:{
      texture:0x666666,
      width:8,
      // height   auto set
    },
    alpha:0.8,            //初始透明度
    alphaActive:1,      //激活时候的透明度
    // dir,  auto set
  }
};

export {Scroller};