import {Texture,Sprite,AnimatedSprite} from "pixi.js"

// global variable
export let app = null;   //Application instance

/**
 * init
 * @param {*} pixiApp  Application instance
 */
export function init(pixiApp){
  app = pixiApp;
}

/**
 * 绘制Sprite或者AnimationSprite通用方法
 * @export drawSprite
 * @param {Hex|PIXI.Texture|Array\<PIXI.Texture>}  tc   素材,可以是16位颜色值，也可以是Texture，也可以是AnimationSprite的Texture数组
 * @param {float} width  默认0，如果tc不是颜色，可以不设置使用纹理的宽度
 * @param {float} height 默认0，如果tc不是颜色，可以不设置使用纹理的高度
 * @param {boolean} [autoPlay=true] 如果tc是数组，这里设置生成的AnimationSprite是否自动播放
 * @returns PIXI.Sprite|PIXI.AnimationSprite
 */
export function drawSprite(tc,width,height,autoPlay=true){
  let object;
  if(Number.isInteger(tc)){
    object = new Sprite(Texture.WHITE);
    object.tint = tc;
  }else if(Array.isArray(tc)){
    object = new AnimatedSprite(tc,true);
    autoPlay && object.play();
  }else{
    object = new Sprite(tc);
  }
  if(width){
    object.width = width;
  }
  if(height){
    object.height = height;
  }
  return object;
}