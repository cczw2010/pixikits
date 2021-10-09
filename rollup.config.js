// 两个插件可以让你加载Node.js里面的CommonJS模块
// 如果引入的第三方库太大  不建议使用，合并成一个文件太大了影响速度
import nodeResolve from '@rollup/plugin-node-resolve';   // 帮助寻找node_modules里的包
import commonjs from '@rollup/plugin-commonjs';     // 将Commonjs语法的包转为ES6可用
// rollup-plugin-replace   // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
// rollup-plugin-babel     // rollup 的 babel 插件，ES6转ES5
import babel from "@rollup/plugin-babel";   //es6 to es5

// for error: Missing shims for Node.js built-ins
// 用于引入node自带的库 比如  url,fs等
import nodeBuiltins from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';

// 转换json为 es6
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";  //压缩

const version = 1.0;

export default {
  input: 'src/index.js',
  external:["pixi.js","@pixi/events","@pixi/core"],      // 告诉rollup，不打包的库，将其视为外部依赖
  output: {
    file: 'pixikits.js',
    format: 'umd',          // umd  各种模块规范通用   
    name:"PixiKits",
    globals: { 
      "pixi.js": 'PIXI',     // 这跟external 是配套使用的，指明pixi.js库即是外部依赖PIXI
      "@pixi/events":"PIXI",   //浏览器引入events.js文件后，会将EventSystem对象集成到PIXI
      "@pixi/core":"PIXI"
    },
    sourcemap: true,          //开启sourcemap
    banner:"/* PixiTool version "+version+" . by awen*/",
  },
  // 实时监控
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'   //排除
  },
  plugins: [
    nodeBuiltins(),
    nodeResolve({
      preferBuiltins: false,
      mainFields: ['browser','module', 'main']
    }) ,
    commonjs({
      include: 'node_modules/**'
    }),
    nodeGlobals(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // 只编译我们的源代码,排除node_mouldes下的
    }),
    json(),
    terser()
  ]
};