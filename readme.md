
## 开发环境

  pixijs  6.1.3
  
  @pixi/events 6.1.3

  rollup 打包，使用es6模式开发

## 注意！

>事件体系

事件系统选择使用6.1.*新增的 `EventSystem(@pixi/events)。该插件官方还没正式发布,也没有正式集成到pixi6，官方声明pixi7才会正式集成。貌似pixi的next分支集成了该插件，未测试。所以在集成前需要在页面上显示的引入。关于该事件体系的具体说明看[这里](http://www.shukantpal.com/blog/pixijs/federated-events-api/). 

**\* 特别注意！ 使用本库之后旧的事件系统将失效，转为使用`addEventListener`方法,所以老的项目慎重使用**

**\* 官方是针对`pixijs6+`实现的`EventSystem`，本库经过测试前端使用`5.2.5+`都可正常运行，但不保证**


## Example

### node ES6

在node下开发的话需要先安装，因为是es6的库，所以请使用es6模式开发

1. 安装

		npm install pixikits

2. 使用

    	import * as PIXI  from "pixi.js";
    	import * as PixiKits  from "pixikits";
    	
    	const app = new PIXI.Application();
    	document.body.appendChild(app.view);
    	...
    	<!--先初始化-->
    	PixiKits.init(app);
    	<!--开始使用-->
    	const slider = new PixiKits.Slider({...});


### browser

1. 页面上显示引入@pixi/events插件的browser文件和pixikits的brower文件

		<script src=".../pixi.js"></script>
 		<script src=".../events.js"></script> //here(./assets/events.js)
		<script src=".../pixikits.js"></script>

 
2. 初始化后，通过 `PixiKits` 对象调用

    	
    	const app = new PIXI.Application();
    	document.body.appendChild(app.view);
    	<!--先初始化-->
    	PixiKits.init(app);
    	<!--开始使用-->
    	PixiKits.keepScreen("h");
    	...

## Document

### <div style="color:blue">Members</div>
name |  value| desc |
---|:---|:---|
**`isSkew`** | Boolean | 是否翻转了stage, 受`keepScreen`方法影响  |

### <div style="color:blue">Methods</div>

#### PixiKits.init(app)
>初始化，必须在使用之前调用该方法初始化，初始化之后将使用新的事件系统**`EventSystem(@pixi/events)`**，可能会影响已有的使用老的事件系统的代码

Name | Type  | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`app`** |PIXI.Application|  <mark>required</mark> |  |  初始化的应用

#### PixiKits.keepScreen(direction)
>保持stage的逻辑绘制方向为横屏或者纵屏

Name | Type  | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`direction`** |String| \<optional>  | v | 设置当前stage的绘制方向，保持横屏还是枞屏<br>`h` 横向 ,`v` 纵向 |

#### PixiKits.dragable(object,params={})
>使对象可拖拽

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`object`** |Pixi.DisplayObject| <mark>required</mark>  |  | 要实现拖拽功能的对象
**`params`** |Object| \<optional>  |  | 相关参数
 | | dragX  | true | 是否开启横向拖拽
 | | dragY  | true | 是否开启纵向拖拽
 | | onStart  | null | 拖拽开始的回调
 | | onMove  | null | 拖拽中的回调.返回`false`会阻止自动拖拽行为， `event.nextPosition`代表下一个位置的local坐标对象，`e.distance`代表移动的总距离对象
 | | onEnd  | null | 开始结束的回调，`e.distance`代表移动的总距离对象


#### PixiKits.tap(object,cb)
>使对象可点击，主要针对新事件体系click做了移动端兼容（当前阶段事件体系的click移动端不是很好用）

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**object** |Pixi.DisplayObject| <mark>required</mark>  |  | 要实现点击功能的对象
**cb** |Function| \<optional>  |  | 点击回调函数


## UI

### <div style="color:red">PixiKits.Slider</div>
基于`dragable`实现的滚动条类，继承`PIXI.Container`

	const params = {length:200,lengthBar:20,width:10,color:0xffffff,colorBar:0Xff3300};
	const slider = new PixiKits.Slider(params,(percent)=>{
		console.log(percent);
	})
	app.stage.addChild(slider);

### <div style="color:blue">Constructor</div>
Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`params`** |Object|\<optional> |  |样式设定
 | | length  | 200 | 滚动条总长度
 | | lengthBar  | 20 | 滚动块的长度，可根据内容区域大小比来设定
 | | width  | 10| 滚动条的宽度
 | | widthBar  | 0 | 默认0，与with相同
 | | color  | 0xffffff | 滚动条颜色
 | | colorBar  | 0Xff3300 | 滚动块颜色
 | | alpha  | 0.4 | 初始透明度
 | | alphaActive  | 0.8 | 激活后的透明度
**cb** |Function| \<optional>  | null | 滚动是的回调函数,传入`percent`参数|

### <div style="color:blue">Members</div>
	
name | value| desc |
---|:---|:---|
**`percent`** | Float | 当前滚动条百分比  |

### <div style="color:blue">Methods</div>

#### Slider.refresh(params)
>刷新slider参数设置

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`params`** |Object|\<optional> |  |样式设定，参见构造函数| 

#### Slider.setPercent(percent,movebar)
>刷新slider参数设置

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`percent`** |Float|<mark>\<required></mark> | 0 | 当前百分比
**`movebar `** |Object|\<optional> |  true | 是否同时刷新滚动块位置


#### Slider.setActive(active)
>刷新slider参数设置

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`active`** |Boolean|\<optional> |true  |是指当前滚动条的激活状态

### <div style="color:red">PixiKits.Scroller</div> 
基于`dragable`和`Slider`实现的滚动条类，继承`PIXI.Container`

	const params = {width:500,height:300,x:true,y:false,sliderBar:false};
	const scroller = new PixiKits.Scroller(params);
	app.stage.addChild(scroller);
	scroller.addChild(...);

### <div style="color:blue">Constructor</div>
Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`params`** |Object|\<optional> |  |样式设定
 | | width  | 300 | 内容区域宽度
 | | height  | 200 | 内容区域高度
 | | x  | true | 是否开启横向滚动
 | | y  | true| 是否开启纵向滚动
 | | bgColor  | 0Xffffff| 背景颜色
 | | slideBar  | false | 如需显示滚动条，传入`Slider`对象的参数对象，`{}`代表使用`Slider`的默认参数

### <div style="color:blue">Members</div>
	
name | value| desc |
---|:---|:---|
**`percent`** | Object | 当前Scroller的横向和纵向百分比  |
**`sliders`** | Object | 横向和纵向滚动条对象（如果有的话）  |

### <div style="color:blue">Methods</div>

#### Scroller.refresh(params)
>刷新Scroller，该方法会重新计算内容尺寸和滚动条位置。比如内部的对象自己新增子对象或者自己变换尺寸时Scroller是无感的，需要手动调用本方法计算 刷新UI。也可传入参数重新设定样式。

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`params`** |Object|\<optional> |  |样式设定，参见构造函数| 

#### Slider. addChild(...)
>重写了`Container.addChild`方法,会自动刷新滚动区域


