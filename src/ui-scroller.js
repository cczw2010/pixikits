import {dragable} from "./eventsExt.js";
import {Slider} from "./ui-slider.js";
import {Container,Graphics} from "pixi.js";
/**
 *滚动区域Scroller，实例是Container的子类，内容区域不满不会显示滚动条
 *通过refresh方法可以手动更新视图。通过addChild来增加内容，会自动调用refresh方法
 * @param {object} scrolParams  滚动区域设置
 *  {
 *    width:300,    
 *    height:200,
 *    x:true,             //是否开启横向滚动
 *    y:true,             //是否开启纵向滚动
 *    slideBar:false,     //开启滚动时候是否显示滚动条，设为false代表不显示，传入Slider的样式则显示滚动条（滚动条和滚动块的长度会自动计算）,默认为显示
 *    bgColor:0xFFFFFF    //不设置的话默认白色
 *  }
 */
 class Scroller extends Container{
  //  构造函数
  constructor(scrolParams={}){
    super();
    this.scrollParams = Scroller.__defScrollOptions;
    this.sliderParams = Slider.__defOptions;
    this.hasSlider = true;
    this.percent = {x:0,y:0};
    // 总容器
    this.sortableChildren = true;
    // 内容最大滚动坐标
    this.contentLimitPos ={x:0,y:0};
    // 滚动条
    this.sliders = {x:null,y:null};
    // 内容容器
    this.content = super.addChildAt(new Container(),0);
    this.content.zIndex = 2;
    // 刷新UI
    this.refresh(scrolParams);
    // 内容区域可拖动
    dragable(this,{
      dragX:this.scrollParams.x,
      dragY:this.scrollParams.y,
      onStart:(e)=>{
        this.startPos = this.content.position.clone();
        if(this.sliders.x && this.contentLimitPos.x){
          this.sliders.x.setActive(true);
        }
        if(this.sliders.y && this.contentLimitPos.y){
          this.sliders.y.setActive(true);
        }
      },
      onMove:(e)=>{
        if(this.scrollParams.x && this.contentLimitPos.x){
          let posx = this.startPos.x+e.distance.x;
          posx=posx>0?0:(posx<this.contentLimitPos.x?this.contentLimitPos.x:posx);
          this.percent.x = posx/this.contentLimitPos.x;
        }
        if(this.scrollParams.y && this.contentLimitPos.y){
          let posy = this.startPos.y+e.distance.y;
          posy=posy>0?0:(posy<this.contentLimitPos.y?this.contentLimitPos.y:posy);
          this.percent.y = posy/this.contentLimitPos.y;
        }
        this._refreshPercent();
        return false;
      },
      onEnd:(e)=>{
        if(this.sliders.x ){
          this.sliders.x.setActive(false);
        }
        if(this.sliders.y){
          this.sliders.y.setActive(false);
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
    this.scrollParams = Object.assign({},this.scrollParams,params);
    this.hasSlider = this.scrollParams.slideBar?true:false;
    if(this.hasSlider){
      this.sliderParams = Object.assign({},this.sliderParams,params.slideBar);
    }
    this._drawBg();
    this._drawSlider();
  }
  /**
   * 设置横向百分比
   * @param {float} percent  百分比
   */
  _refreshPercent = function(){
    if(this.sliders.x){
      this.sliders.x.setPercent(this.percent.x);
    }
    if(this.sliders.y){
      this.sliders.y.setPercent(this.percent.y);
    }
    this.content.position.x = this.contentLimitPos.x*this.percent.x;
    this.content.position.y = this.contentLimitPos.y*this.percent.y;
  }
  // 绘制或者更新背景
  _drawBg (){
    if(!this.bg){
      this.bg = super.addChild(new Graphics());
      this.bg.zIndex=1;
      this.bgMask = super.addChild(new Graphics());
      // this.bg.zIndex=1;
    }
    this.bg.clear();
    this.bg.beginFill(this.scrollParams.bgColor)
      .drawRect(0, 0, this.scrollParams.width, this.scrollParams.height)
      .endFill();

    this.bgMask.clear();
    this.bgMask.beginFill()
      .drawRect(0, 0, this.scrollParams.width, this.scrollParams.height)
      .endFill();
    this.mask = this.bgMask;
  }
  // 绘制或者更新滚动条
  _drawSlider(){
    const contentWidth = this.content.width;
    const contentHeight = this.content.height;
    const disx =this.scrollParams.width-contentWidth;
    const disy =this.scrollParams.height-contentHeight;
    this.contentLimitPos.x = disx>0?0:disx;
    this.contentLimitPos.y = disy>0?0:disy;
    // h slider
    if(this.hasSlider && this.scrollParams.x){
      let lengthBar = contentWidth==0?0:((this.scrollParams.width/contentWidth)*this.scrollParams.width);
      const params = Object.assign({},this.sliderParams,{
          length:this.scrollParams.width,
          lengthBar
        });  
      if(!this.sliders.x){
        this.sliders.x = new Slider(params,(percent)=>{
          this.percent.x = percent;
          this._refreshPercent();
        });
        this.sliders.x.zIndex=4;
        this.sliders.x.position.set(0,this.scrollParams.height-this.sliders.x.width/2); 
        this.sliders.x.angle = -90;
        super.addChild(this.sliders.x);
      }else{
        this.sliders.x.refresh(params);
      }
      this.sliders.x.visible=(this.sliders.x.maxMovement>0);
    }else if(this.sliders.x){
      this.removeChild(this.sliders.x);
      this.sliders.x.destroy({children:true});
      this.sliders.x = null;
    }
    // v slider
    if(this.hasSlider && this.scrollParams.y){
      let length = this.scrollParams.height;
      // 纵向滚动条的长度会减去横向滚动条的宽度，防止重叠
      if(this.sliders.x && this.sliders.x.maxMovement>0){
        length=length-this.sliders.x.width;
      }
      let lengthBar = contentHeight==0?0:((this.scrollParams.height/contentHeight)*this.scrollParams.height);
      let params = Object.assign({},this.sliderParams,{length,lengthBar});
      // console.log(params);
      if(!this.sliders.y){
        this.sliders.y = new Slider(params,(percent)=>{
          this.percent.y = percent;
          this._refreshPercent();
        });
        this.sliders.y.zIndex=5;
        this.sliders.y.position.set(this.scrollParams.width-this.sliders.y.width/2,0);
        super.addChild(this.sliders.y);
      }else{
        this.sliders.y.refresh(params);
      }
      this.sliders.y.visible=(this.sliders.y.maxMovement>0);
    }else if(this.sliders.y){
      this.removeChild(this.sliders.y);
      this.sliders.y.destroy({children:true});
      this.sliders.y = null;
    }
    // 重置位置
    this._refreshPercent();
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