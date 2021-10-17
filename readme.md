
## 开发环境

  pixijs  6.1.3

  @pixi/events 6.1.3

  rollup 打包，使用es6模式开发

## 注意！ 

*** 特别注意！ `V2.0`和`V1.0`版本不兼容**

**\* 事件系统选择使用6.1.*新增的 `Federated Events (@pixi/events)`**

>官方是针对`pixijs6+`实现的`Federated Events `，该插件没有正式集成到pixi6，官方声明pixi7才会正式集成。貌似pixi的next分支集成了该插件，未测试。所以在集成前需要在页面上显示的引入。关于该事件体系的具体说明看[这里](http://www.shukantpal.com/blog/pixijs/federated-events-api/).<br>
>本库经过测试前端使用`5.2.5+`都可正常运行，但不保证



## Changed v2.0
本版本与`1.0.x`版本不兼容，重构了太多的API。
	
####fixed

1. `dragable`对本对象其他事件的影响

####reBuild

1. `Slider`
2. `Scroller`

####new

1. add `ProgressBar` class
2. add some common function


## 开始

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

3. rollup
   
	如果项目使用rollup打包，那么需要在rollup中增加一下代码：

		...
		external:["pixi.js","@pixi/events","@pixi/core"],      // 告诉rollup，不打包的库，将其视为外部依赖
		...
		globals: { 
			"pixi.js": 'PIXI',      // 指明pixi.js库即是外部依赖PIXI
			"@pixi/events":"PIXI",   //浏览器引入events.js文件后，会将EventSystem对象集成到PIXI
			"@pixi/core":"PIXI", 	//同样不用打包
		}
		...

	前端只需要引入`pixi.js`和`events.js`就可正常运行，不需要加载前端的`pixikits.js`文件。如果想在前端自己加载`pixikits.js`文件(有时rollup打包关联的库文件时会出现各种问题)，在上面的配置中增加配置项不打包即可 。
	
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

3. [Demo](https://codepen.io/cczw2010/pen/gOxaGKd)

## Document

### <div style="color:blue">Members</div>
Name | Value| Desc |
---|:---|:---|
**`isSkew`** | Boolean | 是否翻转了stage, 受`keepScreen`方法影响，未调用前无效 |

### <div style="color:blue">Methods</div>

#### PixiKits.init(app)
初始化，**必须首先调用该方法初始化**，初始化之后将使用新的事件系统**`EventSystem(@pixi/events)`**，可能会影响已有的使用老的事件系统的代码

Name | Type  | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`app`** |PIXI.Application|  <mark>required</mark> |  |  初始化的应用

#### PixiKits.keepScreen(direction)
保持stage的逻辑绘制方向为横屏或者纵屏

Name | Type  | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`direction`** |String| \<optional>  | v | 设置当前stage的绘制方向，保持横屏还是枞屏<br>`h` 横向 ,`v` 纵向 |

#### PixiKits.dragable(object,params={})
使对象可拖拽

Name  | Attributes| Type | Default | Desc |
---|:---|:---|:---|:---|
|**`object`** | <mark>required</mark> |Pixi.DisplayObject |  | 要实现拖拽功能的对象
|**`params`** | \<optional> |Object |  | 相关参数
| | x  | Boolean | true | 是否开启横向拖拽
| | y  | Boolean | true | 是否开启纵向拖拽
| | onStart | Function \| Null | null | 拖拽开始的回调
| | onMove  |Function \| Null | null | 拖拽中的回调.返回`false`会阻止自动拖拽行为， `event.nextPosition`代表下一个位置的local坐标对象，`e.distance`代表移动的总距离对象
| | onEnd  |Function \| Null | null | 开始结束的回调，`e.distance`代表移动的总距离对象


#### PixiKits.tap(object,cb)
使对象可点击，主要针对新事件体系click做了移动端兼容（当前阶段事件体系的`tap`移动端不是很好用）

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**object** |Pixi.DisplayObject| <mark>required</mark>  |  | 要实现点击功能的对象
**cb** |Function| \<optional>  |  | 点击回调函数


## UI
基本都是继承`Sprite`或者`Container`对象，下面的属性和方法只介绍新增或者变更的部分

### <div style="color:red">PixiKits.Slider</div>
基于`dragable`实现的滚动条类，继承`PIXI.Container`

	const params = {
					background:{
						texture:0xeeeeee,
						width:20,
						height:200
					},
					bar:{
						texture:0xeeeeee,
						width:16,
						height:50
					},
					alpha:0.6,
					dir:Slider.V,
					cb:(percent)=>{
	                	console.log(percent);
	                }
				};
	const slider = new PixiKits.Slider(params);
	app.stage.addChild(slider);

### <div style="color:blue">Constructor</div>
Name | Attributes | Type | Default | Desc 
---|:---|:---|:---|:---
**`params`** |<mark>\<required></mark>  |Object|  |滚动条样式参数对象 
|barkground | Object |  | 滚动条背景 
 |   - - -  texture | Hex color \| Texture \| Graphics \| Array<Texture> | 0xeeeeee | 滚动条背景样式 
 |   - - -  width| Number | 0 | 显示宽度 ，如果 `texture `不是颜色，可以不设置使用`texture `自身宽度
 |   - - -  height | Number | 0 | 显示高度 ，如果 `texture `不是颜色，可以不设置使用`texture `自身高度
 |bar | Object |  | 滚动块 
 |   - - -  texture | Hex color \| Texture \| Graphics \| Array<Texture> | 0x666666 | 滚动块样式
 |   - - -  width| Number | 0 | 显示宽度 ，如果 `texture `不是颜色，可以不设置为`0`,使用`texture `自身宽度 
 |   - - -  height | Number | 0 | 显示高度 ，如果 `texture `不是颜色，可以设置为`0`,使用`texture `自身高度 
 |alpha  | Number | 1 | 初始透明度0~1 
 |alphaActive  | Number | 1 | 激活后的透明度0~1 
|dir | String | Slider.H | 滚动条滑动的滚动方向`Slider.H |Slider.V` 
|alpha| Float | 1 | 初始透明度0~1 
|alphaActive| Float | 1 | 激活后的透明度0~1 
|cb| Function |null | 滚动回调，参数 为`percent` 

### <div style="color:blue">Members</div>

Name | Value| Desc 
---|:---|:---
**`percent`** | Float | 当前滚动条百分比0~1  
**`maxMovement`** | Number | 当前滚动条可滚动长度 
**`background`** | Graphics\|Sprite | 滚动条背景对象 
**`bar`** | Graphics\|Sprite | 滚动块对象  


### <div style="color:blue">Methods</div>

#### Slider.refresh(params)
刷新slider参数设置

Name | Type | Attributes | Default | Desc 
---|:---|:---|:---|:---
**`params`** |Object|\<optional> |  |样式设定，参见构造函数，可增量更新

#### Slider.setPercent(percent,movebar)
刷新slider参数设置

Name | Type | Attributes | Default | Desc 
---|:---|:---|:---|:---
**`percent`** | Float |<mark>\<required></mark> |  | 当前百分比 0~1
**`movebar `** |Boolean|\<optional> |  true | 是否同时刷新滚动块位置, 一般用于第三方开发扩展


#### Slider.setActive(active)
刷新slider参数设置

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`active`** |Boolean|\<optional> |true  |是指当前滚动条的激活状态

### <div style="color:red">PixiKits.Scroller</div> 
基于`dragable`和`Slider`实现的滚动条类，继承`PIXI.Container`

	const params = {
		width:350,
		height:200,
		background:Texture.WHITE,
		x:{
			background:{
				texture:Texture.WHITE,
				height:10,
			},
			bar:{
	      		texture:0xff3366,
				height:10
			}
		},
		y:false
	};
	const scroller = new PixiKits.Scroller(params);
	app.stage.addChild(scroller);
	scroller.addChild(...);

### <div style="color:blue">Constructor</div>
Name | Attributes | Type | Default | Desc 
---|:---|:---|:---|:---
**`params`**|<mark>\<required></mark>  |Object|  |参数对象
 |width | Number | 350 | 内容区域宽度
 |height | Number | 200 | 内容区域高度
 |x | Boolean\|Object | {...} | 是否开启横向滚动，传入`Slider`的配置对象会绘制滚动条（width`和`dir`参数会自动设定），不设定该参数会有一个默认的滚动条 
 |y | Boolean\|Object | {...} | 是否开启纵向滚动，传入`Slider`的配置对象会绘制滚动条（`height`和`dir`参数会自动设定），不设定该参数会有一个默认的滚动条 
 |background | Hex color \|Texture \|Graphics \|Array<Texture> |  | 背景材质 
 |drag | Boolean | true | 内容区域是否可以拖动 

### <div style="color:blue">Members</div>

Name | Value| Desc 
---|:---|:---
**`percent`** | Object | 当前Scroller的横向和纵向百分比`{x,y}` 
**`sliderX`** | Object\|Null | 横向滚动条对象（如果有的话）  
**`sliderY`** | Object\|Null | 横向滚动条对象（如果有的话） 
**`content`** | Container | 内容区域容器对象 
**`background`** | Sprite\|Graphics | 背景对象 

### <div style="color:blue">Methods</div>

#### Scroller.refresh(params={})
刷新Scroller，该方法会重新计算内容尺寸和滚动条。 适用于增加非直接子对象时，比如内部的对象自己新增子对象或者自己变换尺寸时，这时`Scroller`是无感的，需要手动调用本方法重新计算 刷新UI。当然也可传入参数局部刷新设定参数。

Name | Type | Attributes | Default | Desc 
---|:---|:---|:---|:---
**`params`** |Object|\<optional> |  |参见构造函数

#### Slider. addChild(...) `overrides`
重写了`Container.addChild`方法,该方法会自动调用`refresh`方法刷新滚动条

### <div style="color:red">PixiKits.ProgressBar</div> 
继承`PIXI.Container`实现的进度条类

	const processBar = new PixiKits.ProgressBar({
	  width:200,
	  height:20,
	  percent:0.5,
	  background:PIXI.utils.TextureCache.input,
	  progress:PIXI.utils.TextureCache.progress,
	  icon:resources.spritesheet.spritesheet.animations.iconfly
	});
	processBar.icon.animationSpeed =0.2;
	//processBar.setPercent(0.5);
	app.stage.addChild(processBar);

### <div style="color:blue">Constructor</div>
Name | Attributes | Type | Default | Desc |
---|:---|:---|:---|:---|
|**`params`** |<mark>\<required></mark> | Object| |参数设定
| | width | Number | 0 | 宽度，如果background和progress不是颜色，可以不设置使用自身宽度
| | height| Number | 0 | 高度，如果background和progress不是颜色，可以不设置使用自身高度
| | percent |Float | 0 | 进度 0~1
| | background | Hex \| PIXI.Texture \| Array\<PIXI.Texture> | 0xe2e2e2| 背景素材
| | progress | Hex \| PIXI.Texture \| Array\<PIXI.Texture>e=| 0x65d521| 滚动条素材
| | icon | PIXI.Texture \| Array\<PIXI.Texture> | null | 可以在进度条前设置一个前进的图标
### <div style="color:blue">Members</div>

Name | Value| Desc |
---|:---|:---|
**`percent`** | Float | 当前进度0~1  |
**`background`** | Sprite \| AnimatedSprite | 背景对象  |
**`progress`** | Sprite \| AnimatedSprite | 进度条对象  |
**`icon`** | Sprite \| AnimatedSprite | 进度条`前置图标对象  |

### <div style="color:blue">Methods</div>

#### Scroller.setPercent(percent)
设定当前滚动条的进度

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`percent`** |Float |  |进度0~1| 

#### Scroller.setBackground(background)
重新设置背景对象

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`background`** |Hex \| PIXI.Texture \| Array\<PIXI.Texture> | <mark>\<required></mark> |背景素材| 

#### Scroller.setProgress(progress)
重新设置滚动条对象

Name | Type | Attributes | Default | Desc |
---|:---|:---|:---|:---|
**`progress `** |Hex \| PIXI.Texture \| Array\<PIXI.Texture> | <mark>\<required></mark> |滚动条素材| 

### <div style="color:red">PixiKits.SpliceSprite</div> 
继承`PIXI.Container`拼接图片精灵，用于多个的图片素材再拼接组成一个精灵. (比如超长的一镜到底复杂背景图，切片加载在拼装)

	const bg = new PixiKits.SpliceSprite(
	  resources,
		//{loader.Resources}
	  //{a:t1,b:t2...}
	  //[t1,t2,t3,...]
	  PixiKits.SpliceSprite.V
	);
	//bg.position.set(0,0);
	app.stage.addChild(bg);

### <div style="color:blue">Constructor</div>
Name | Attributes | Type | Default | Desc |
---|:---|:---|:---|:---|
|**`textures`** |<mark>\<required></mark> | Array\|Object|  |`Texure`或者`LoaderResource`的数组或者json对象
|**`dir`** |\<optional> | Number| SpliceSprite.H|方向 ` SpliceSprite.H` or ` SpliceSprite.V`

 
