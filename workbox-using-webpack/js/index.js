console.log('loaded index.js 1')

// 1. 使用ES5语法导入UMD版本
// (pkg.main: "build/workbox-window.prod.umd.js")
const { Workbox } = require('workbox-window');
// 2. 使用ES5语法导入模块版本
// (pkg.module: "build/workbox-window.prod.es5.mjs")
// import { Workbox } from 'workbox-window';
// 3. 使用ES2015 + 语法导入模块源文件
// import { Workbox } from 'workbox-window/Workbox.mjs';

require('../css/style.css');

const elImg = document.createElement('img');
elImg.src = require('../images/icon-48.png');
document.body.appendChild(elImg);

// Register A service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     const prefix = location.pathname.replace(/\/(index\.html)?$/, '');
//     navigator.serviceWorker.register(`${prefix}/sw.js`)
//       .then(function(registration) {
//         // Registration was successful
//         console.log('[success] scope: ', registration.scope);
//       }, function(err) {
//         // registration failed :(
//         console.log('[fail]: ', err);
//       });
//   });
// }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      console.log('Service worker installed!');
    });

    wb.addEventListener('activated', (event) => {
      console.log('Service worker activated!');
      // 获取当前页面URL + 页面加载的所有资源
      const urlsToCache = [
        window.location.href,
        ...window.performance.getEntriesByType('resource').map((r) => r.name),
      ];
      // 将该URL列表发送到 serviceWorker 的路由器
      wb.messageSW({
        type: 'CACHE_URLS',
        payload: {urlsToCache},
      });
    });

    wb.register();
  });
} else {
  console.error('Service worker is not supported!', window.navigator.userAgent);
}