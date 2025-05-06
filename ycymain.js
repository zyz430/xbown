'use strict';

var ipUrlMap = {
  '42.186.235.35': 'https://dev.avg.163.com',
  '42.186.235.40': 'https://testing.avg.163.com',
  '42.186.235.26': 'https://gray.avg.163.com',
  '42.186.209.71': 'https://release.avg.163.com',
  '42.186.69.122': 'https://avg.163.com',
  '52.223.44.174': 'https://avg.163.com',
  '59.111.129.56': 'https://avg.163.com',
};

(function() {
  var url = window.location.href;
  if (url.indexOf('http://avg.163.com') > -1) {
    url = url.replace('http://avg.163.com', 'https://avg.163.com');
    window.location.replace(url);
    return;
  }

  var hostname = window.location.hostname;
  // 需要排除一些特殊情况，例如 https://s.avg.163.com/login?state=xxx&redirect=mofang.163.com&isDisableAutoLogin=1
  if (hostname === 's.avg.163.com' && url.indexOf('mofang.163.com') < 0) {
    window.location.replace('https://avg.163.com');
    return;
  }

  // 用ip地址访问时需要跳转相应的域名
  if (
    /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/.test(
      hostname,
    )
  ) {
    window.location.replace(ipUrlMap[hostname] || 'https://avg.163.com');
  }
})();

(function() {
  var ua = navigator.userAgent.toLowerCase();
  var IEVersion = null;
  var check = null;

  if ((check = ua.match(/rv:([\d.]+)\) like gecko/))) {
    IEVersion = check[1];
  } else if ((check = ua.match(/msie ([\d.]+)/))) {
    IEVersion = check[1];
  }

  if (IEVersion && IEVersion < 11) {
    location.href = '/browser.html';
  }

  if (IEVersion) {
    // 为IE环境导入一些ES6的polyfill
    document.write(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js"></script>',
    );
  }
})();

(function() {
  // 检查webp兼容性，为了避免ios14.0 webp显示有问题，所有ios强制AVG_SUPPORT_WEBP为false
  var isIOS = !!navigator.userAgent.match(/(iPhone|iPod|iPad);?/i);
  function checkWebpSupport() {
    var kTestImages =
      'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';
    var img = new Image();

    img.onload = function() {
      window.AVG_SUPPORT_WEBP = img.width > 0 && img.height > 0 && !isIOS;

      if (localStorage) {
        localStorage.setItem(
          'AVG_SUPPORT_WEBP',
          String(window.AVG_SUPPORT_WEBP),
        );
      }
    };

    img.onerror = function() {
      window.AVG_SUPPORT_WEBP = false;

      if (localStorage) {
        localStorage.setItem(
          'AVG_SUPPORT_WEBP',
          String(window.AVG_SUPPORT_WEBP),
        );
      }
    };

    img.src = 'data:image/webp;base64,'.concat(kTestImages);
  }

  if (localStorage && localStorage.getItem('AVG_SUPPORT_WEBP')) {
    window.AVG_SUPPORT_WEBP =
      localStorage.getItem('AVG_SUPPORT_WEBP') === 'true' && !isIOS;
  } else {
    checkWebpSupport();
  }
})();
