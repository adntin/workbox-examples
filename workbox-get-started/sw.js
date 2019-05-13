importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// 主文档: 网络优先
// https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing#registerRoute
workbox.routing.registerRoute(
  /index\.html/,
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies
  workbox.strategies.networkFirst({
    cacheName: 'workbox:html',
  })
);

// 主文档: 网络优先
workbox.routing.registerRoute(
  /\/$/,
  // 直接改, 马上生效
  workbox.strategies.networkFirst({
    cacheName: 'workbox:html',
  })
);

// JS 请求: 网络优先
workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  // 直接改, 马上生效
  workbox.strategies.networkFirst({
    cacheName: 'workbox:js',
  })
);

// CSS 请求: 缓存优先，同时后台更新后下次打开页面才会被页面使用
workbox.routing.registerRoute(
  /.*\.css/,
  // 直接改, 代码生效, 需要再次刷新才生效
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'workbox:css',
  })
);

// 图片请求: 缓存优先
workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  workbox.strategies.cacheFirst({
    cacheName: 'workbox:image',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20, // Cache only 20 images
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for a maximum of a week
      })
    ],
  })
);

