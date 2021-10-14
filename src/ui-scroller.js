import {dragable} from "./eventsExt.js";
import {Slider} from "./ui-slider2.js";
import {Container,Graphics} from "pixi.js";
/**
 *滚动区域Scroller，实例是Container的子类，内容区域不满不会显示滚动条
 *通过refresh方法可以手动更新视图。通过addChild来增加内容，会自动调用refresh方法
 * @param {object} scrolParams  滚动区域设置
 *  {
 *    width:300,    
 *    height:200,
 *    x:true,             //是否开启横向滚动,
 *    y:true,             //是否开启纵向滚动
 *    slideBar:false,     //开启滚动时候是否显示滚动条，设为false代表不显示，传入配置对象则显示滚动条（滚动条和滚动块的长度会自动计算)
 *                          {tx,ty,thin,alpha,alpaActive}
 *    bgColor:0xFFFFFF    //不设置的话默认白色
 *  }
 */
 class Scroller extends Container{
  //  构造函数
  constructor(scrolParams={}){
    super();
    this._scrollParams = Scroller.__defScrollOptions;
    this._sliderParams = Slider.__defOptions;
    this._hasSlider = true;
    // 内容最大滚动坐标
    this._contentLimitPos ={x:0,y:0};
    // 内容容器
    this.content = super.addChildAt(new Container(),0);
    this.content.zIndex = 2;
    // 滚动条
    this.sliderX = null;
    this.sliderY = null;
    this.percent = {x:0,y:0};

    // 总容器
    this.sortableChildren = true;
    // 刷新UI
    this.refresh(scrolParams);
    // 内容区域可拖动
    dragable(this,{
      x:this._scrollParams.x,
      y:this._scrollParams.y,
      onStart:(e)=>{
        this.startPos = this.content.position.clone();
        if(this.sliderX && this._contentLimitPos.x){
          this.sliderX.setActive(true);
        }
        if(this.sliderY && this._contentLimitPos.y){
          this.sliderY.setActive(true);
        }
      },
      onMove:(e)=>{
        if(this._scrollParams.x && this._contentLimitPos.x){
          let posx = this.startPos.x+e.distance.x;
          posx=posx>0?0:(posx<this._contentLimitPos.x?this._contentLimitPos.x:posx);
          this.percent.x = posx/this._contentLimitPos.x;
        }
        if(this._scrollParams.y && this._contentLimitPos.y){
          let posy = this.startPos.y+e.distance.y;
          posy=posy>0?0:(posy<this._contentLimitPos.y?this._contentLimitPos.y:posy);
          this.percent.y = posy/this._contentLimitPos.y;
        }
        this._refreshPercent();
        return false;
      },
      onEnd:(e)=>{
        if(this.sliderX ){
          this.sliderX.setActive(false);
        }
        if(this.sliderY){
          this.sliderY.setActive(false);
        }
      }
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
    this._scrollParams = Object.assign({},this._scrollParams,params);
    this._hasSlider = this._scrollParams.slideBar?true:false;
    if(this._hasSlider){
      this._sliderParams = Object.assign({},this._sliderParams,params.slideBar);
    }
    this._drawBg();
    if(this._hasSlider && this._scrollParams.x){
      this._drawSliderX();
    }else if(this.sliderX){
      this.removeChild(this.sliderX);
      this.sliderX.destroy({children:true});
      this.sliderX = null;
    }
    if(this._hasSlider && this._scrollParams.y){
      this._drawSliderY();
    }else if(this.sliderY){
      this.removeChild(this.sliderY);
      this.sliderY.destroy({children:true});
      this.sliderY = null;
    }
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
    if(!this.bg){
      this.bg = super.addChild(new Graphics());
      this.bg.zIndex=1;
      this.bgMask = super.addChild(new Graphics());
      // this.bg.zIndex=1;
    }
    this.bg.clear();
    this.bg.beginFill(this._scrollParams.bgColor)
      .drawRect(0, 0, this._scrollParams.width, this._scrollParams.height)
      .endFill();

    this.bgMask.clear();
    this.bgMask.beginFill()
      .drawRect(0, 0, this._scrollParams.width, this._scrollParams.height)
      .endFill();
    this.mask = this.bgMask;
  }
  _drawSliderX(){
    const contentWidth = this.content.width;
    const disx =this._scrollParams.width-contentWidth;
    this._contentLimitPos.x = disx>0?0:disx;
    let barWidth = contentWidth==0?0:((this._scrollParams.width/contentWidth)*this._scrollParams.width);
    const params = Object.assign({},this._sliderParams,{
        background:{width:this._scrollParams.width},
        bar:{width:barWidth},
        dir:Slider.H,
      });
    if(!this.sliderX){
      this.sliderX = new Slider(params,(percent)=>{
        this.percent.x = percent;
        this._refreshPercent();
      });
      this.sliderX.zIndex=4;
      this.sliderX.position.set(0,this._scrollParams.height-this._sliderParams.background.height); 
      super.addChild(this.sliderX);
    }else{
      this.sliderX.refresh(params);
    }
    this.sliderX.visible=(this.sliderX.maxMovement>0);
  }
  _drawSliderY(){
    let height = this.content.height;
    if(this.sliderX && this.sliderX.maxMovement>0){
      height=height-this.sliderX.height;
    }
    const disy =this._scrollParams.height-height;
    this._contentLimitPos.y = disy>0?0:disy;
    // 要固定长度
    const barHeight = height==0?0:((this._scrollParams.height/height)*this._scrollParams.height);
    
    const params = Object.assign({},this._sliderParams,{
        background:{height},
        bar:{height:barHeight},
        dir:Slider.V,
      });
      if(!this.sliderY){
        this.sliderY = new Slider(params,(percent)=>{
          this.percent.y = percent;
          this._refreshPercent();
        });
        this.sliderY.zIndex=5;
        this.sliderY.position.set(this._scrollParams.width-this.sliderY.width/2,0);
        super.addChild(this.sliderY);
      }else{
        this.sliderY.refresh(params);
      }
      this.sliderY.visible=(this.sliderY.maxMovement>0);
  }
}
// 默认滚动区域配置
Scroller.__defScrollOptions = {
  width:350,
  height:200,
  x:true,
  y:true,
  slideBar:{},
  bgColor:0xFFFFFF    //默认白色
};

export {Scroller};