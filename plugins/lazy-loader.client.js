import CryptoJS from "crypto-js";

export default defineNuxtPlugin(() => {
  (function () {
    var root =
      (typeof self == "object" && self.self == self && self) ||
      (typeof global == "object" && global.global == global && global) ||
      this ||
      {};

    // ä¿®å¤ bind å‡½æ•°
    Function.prototype.bind =
      Function.prototype.bind ||
      function (context) {
        if (typeof this !== "function") {
          throw new Error(
            "Function.prototype.bind - what is trying to be bound is not callable"
          );
        }

        var self = this;
        var args = Array.prototype.slice.call(arguments, 1);

        var fNOP = function () {};

        var fBound = function () {
          var bindArgs = Array.prototype.slice.call(arguments);
          self.apply(
            this instanceof fNOP ? this : context,
            args.concat(bindArgs)
          );
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
      };

    var util = {
      extend: function (target) {
        for (var i = 1, len = arguments.length; i < len; i++) {
          for (var prop in arguments[i]) {
            if (arguments[i].hasOwnProperty(prop)) {
              target[prop] = arguments[i][prop];
            }
          }
        }

        return target;
      },
      addEvent: function (elem, type, fn) {
        if (document.addEventListener) {
          elem.addEventListener(type, fn, false);
          return fn;
        } else if (document.attachEvent) {
          var bound = function () {
            return fn.apply(elem, arguments);
          };
          elem.attachEvent("on" + type, bound);
          return bound;
        }
      },
      removeEvent: function (elem, type, fn) {
        if (document.removeEventListener) {
          elem.removeEventListener(type, fn, false);
        } else {
          elem.detachEvent("on" + type, fn);
        }
      },
    };

    function Lazy(opts) {
      this.opts = util.extend({}, this.constructor.defaultOpts, opts);
      this.init();
    }

    Lazy.VERSION = "1.0.0";

    Lazy.defaultOpts = {
      delay: 250,
      useDebounce: false,
    };

    var proto = Lazy.prototype;

    proto.init = function () {
      // åˆå§‹åŒ–å¤„ç†çŠ¶æ€
      this.isRendering = false;
      this.isProcessing = {};
      this.urlCache = {};

      // è®¡ç®—è§†å›¾å¹¶ç»‘å®šäº‹ä»¶
      this.calulateView();
      this.bindScrollEvent();
    };

    proto.calulateView = function () {
      this.view = {
        top: 0 - (parseInt(this.opts.top, 10) || 0),
        bottom:
          (root.innerHeight || document.documentElement.clientHeight) +
          (parseInt(this.opts.bottom, 10) || 0),
        left: 0 - (parseInt(this.opts.left, 10) || 0),
        right:
          (root.innerWidth || document.documentElement.clientWidth) +
          (parseInt(this.opts.right, 10) || 0),
      };
    };

    proto.bindScrollEvent = function () {
      var scrollEvent = util.addEvent(
        root,
        "scroll",
        this.handleLazyLoad.bind(this)
      );
      var loadEvent = util.addEvent(
        root,
        "load",
        this.handleLazyLoad.bind(this)
      );

      this.event = {
        scrollEvent: scrollEvent,
        loadEvent: loadEvent,
      };
    };

    var timer = null;

    proto.handleLazyLoad = function () {
      var self = this;

      if (!this.opts.useDebounce && !!timer) {
        return;
      }

      clearTimeout(timer);

      timer = setTimeout(function () {
        timer = null;
        self.render();
      }, this.opts.delay);
    };

    proto.isHidden = function (element) {
      return element.offsetParent === null;
    };

    proto.checkInView = function (element) {
      if (this.isHidden(element)) {
        return false;
      }

      var rect = element.getBoundingClientRect();

      return (
        rect.right >= this.view.left &&
        rect.bottom >= this.view.top &&
        rect.left <= this.view.right &&
        rect.top <= this.view.bottom
      );
    };

    // æ·»åŠ URLç¼“å­˜æ˜ å°„
    Lazy.prototype.urlCache = {};

    // ä¿®æ”¹renderæ–¹æ³•ï¼Œé‡‡ç”¨é¡ºåºå¤„ç†å›¾ç‰‡
    proto.render = async function () {
      // èŽ·å–æ‰€æœ‰éœ€è¦å¤„ç†çš„å…ƒç´
      var nodes = Array.from(
        document.querySelectorAll("[data-lazy-src], [data-lazy-background]")
      );

      // å¦‚æžœæ²¡æœ‰éœ€è¦å¤„ç†çš„å…ƒç´ ï¼Œè§£ç»‘äº‹ä»¶
      if (nodes.length === 0) {
        //this.unbindScrollEvent();
        return;
      }

      // ç»™æ¯ä¸ªå…ƒç´ æ·»åŠ ä¸€ä¸ªå¤„ç†æ ‡è®°ï¼Œé˜²æ­¢é‡å¤å¤„ç†
      for (let i = 0; i < nodes.length; i++) {
        const elem = nodes[i];

        // å¦‚æžœå…ƒç´ å·²ç»åœ¨å¤„ç†ä¸­ï¼Œè·³è¿‡
        if (elem.dataset.lazyProcessing === "true") {
          continue;
        }

        // æ ‡è®°ä¸ºå¤„ç†ä¸­
        elem.dataset.lazyProcessing = "true";

        // è®°å½•åŽŸå§‹URLç”¨äºŽè°ƒè¯•
        let originalUrl = "";
        let elementType = "";

        // å¤„ç†èƒŒæ™¯å›¾ç‰‡
        if (elem.getAttribute("data-lazy-background") !== null) {
          elementType = "background";
          // æ£€æŸ¥æ˜¯å¦å·²æœ‰blobèƒŒæ™¯
          let isBlob = this.checkBlobInBackground(elem);
          if (!isBlob) {
            originalUrl =
              this.opts.host + elem.getAttribute("data-lazy-background");

            //console.log(`å¤„ç†èƒŒæ™¯å›¾ [${i}]:`, originalUrl);

            try {
              // è§£å¯†å›¾ç‰‡
              let res = await this.decryptImage(originalUrl);

              // ç¡®ä¿å…ƒç´ ä»å­˜åœ¨äºŽDOMä¸­
              if (elem.isConnected) {
                // æ›´æ–°èƒŒæ™¯å›¾ï¼Œæ³¨æ„æ˜Žç¡®è®¾ç½®ä¸ºbackground-imageè€Œä¸æ˜¯background
                elem.style.backgroundImage = `url('${res}')`;
                elem.style.backgroundSize = "cover";

                // å®Œå…¨ç§»é™¤å±žæ€§ï¼Œé˜²æ­¢é‡å¤å¤„ç†
                elem.removeAttribute("data-lazy-background");
              }
            } catch (error) {
              console.error("èƒŒæ™¯å›¾å¤„ç†å¤±è´¥:", originalUrl, error);
            }
          }
        }
        // å¤„ç†æ™®é€šå›¾ç‰‡
        else if (elem.getAttribute("data-lazy-src") !== null) {
          elementType = "image";
          originalUrl = this.opts.host + elem.getAttribute("data-lazy-src");

          console.log(`å¤„ç†å›¾ç‰‡ [${i}]:`, originalUrl);

          // è·³è¿‡å·²å¤„ç†å›¾ç‰‡
          if (elem.src && elem.src.startsWith("blob:")) {
            elem.dataset.lazyProcessing = "false";
            continue;
          }

          try {
            // è§£å¯†å›¾ç‰‡
            let res = await this.decryptImage(originalUrl);

            // ç¡®ä¿å…ƒç´ ä»å­˜åœ¨äºŽDOMä¸­
            if (elem.isConnected) {
              // è®¾ç½®å›¾ç‰‡æº
              elem.src = res;

              // æ›´æ–°çˆ¶å…ƒç´ é“¾æŽ¥
              // if (elem.parentElement && elem.parentElement.tagName === 'A') {
              //     elem.parentElement.href = res;
              // }

              // å®Œå…¨ç§»é™¤å±žæ€§ï¼Œé˜²æ­¢é‡å¤å¤„ç†
              elem.removeAttribute("data-lazy-src");
            }
          } catch (error) {
            console.error("å›¾ç‰‡å¤„ç†å¤±è´¥:", originalUrl, error);
          }
        }

        // å›¾ç‰‡å¤„ç†å®ŒæˆåŽç§»é™¤å¤„ç†æ ‡è®°
        elem.dataset.lazyProcessing = "false";

        // è§¦å‘å›žè°ƒ
        if (
          this.opts.onload &&
          typeof this.opts.onload === "function" &&
          elem.isConnected
        ) {
          this.opts.onload(elem);
        }
      }
    };

    // ä¿®æ”¹è§£å¯†å‡½æ•°ï¼Œæ·»åŠ ç¼“å­˜åŠŸèƒ½
    proto.isProcessing = {}; // è·Ÿè¸ªæ­£åœ¨å¤„ç†çš„URL

    proto.decryptImage = async function (url) {
      // ä¿å­˜åŽŸå§‹URLç”¨äºŽè°ƒè¯•
      const originalUrl = url;

      // ç”Ÿæˆä¸€ä¸ªå”¯ä¸€çš„ç¼“å­˜é”®
      const cacheKey = url;

      // æ£€æŸ¥ç¼“å­˜
      if (this.urlCache[cacheKey]) {
        console.log("ä½¿ç”¨ç¼“å­˜å›¾ç‰‡:", cacheKey);
        return this.urlCache[cacheKey];
      }
      //console.log(originalUrl, cacheKey);
      // æ ‡è®°ä¸ºæ­£åœ¨å¤„ç†
      this.isProcessing[cacheKey] = true;

      try {
        //console.log('å¼€å§‹è§£å¯†å›¾ç‰‡:', cacheKey);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`ç½‘ç»œå“åº”é”™è¯¯: ${response.status}`);
        }

        // è§£å¯†è¿‡ç¨‹ä¿æŒä¸å˜
        const encryptedData = await response.arrayBuffer();
        const key = CryptoJS.enc.Utf8.parse("k9:3zeFq~]-EQMF,gpGx*uRw+x,n]xw9");
        const encryptedBytes = new Uint8Array(encryptedData);
        const iv = CryptoJS.enc.Utf8.parse("Zd3!t#t1YN=!fs)D");
        const cipherText = CryptoJS.lib.WordArray.create(encryptedBytes);

        const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: cipherText },
          key,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );

        let decryptedData = new Uint8Array(
          decrypted.words.flatMap((word) => [
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff,
          ])
        ).slice(0, decrypted.sigBytes);

        if (!decryptedData || decryptedData.length === 0) {
          throw new Error("è§£å¯†å¤±è´¥æˆ–æ•°æ®ä¸ºç©º");
        }

        // åˆ›å»ºå”¯ä¸€çš„ blob å¯¹è±¡å’Œ URL
        const blob = new Blob([decryptedData], { type: "image/jpeg" });
        const blobUrl = URL.createObjectURL(blob);

        // console.log('è§£å¯†å®Œæˆï¼ŒURL:', cacheKey, '-> Blob:', blobUrl);

        // å­˜å…¥ç¼“å­˜
        this.urlCache[cacheKey] = blobUrl;

        // ç§»é™¤å¤„ç†ä¸­æ ‡è®°
        delete this.isProcessing[cacheKey];
        //console.log('è§£å¯†å›¾ç‰‡æˆåŠŸ:', originalUrl, '->', blobUrl);
        return blobUrl;
      } catch (error) {
        // ç§»é™¤å¤„ç†ä¸­æ ‡è®°
        delete this.isProcessing[cacheKey];
        console.error("å›¾ç‰‡è§£å¯†å¤±è´¥:", originalUrl, error);
        throw error;
      }
    };

    // æ·»åŠ æ¸…ç†æ–¹æ³•
    proto.clearCache = function () {
      for (let url in this.urlCache) {
        if (this.urlCache.hasOwnProperty(url)) {
          URL.revokeObjectURL(this.urlCache[url]);
        }
      }
      this.urlCache = {};
      this.isProcessing = {};
    };

    // åœ¨é¡µé¢å¸è½½æ—¶é‡Šæ”¾èµ„æº
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", function () {
        if (window.lazyLoader) {
          window.lazyLoader.clearCache();
        }
      });
    }

    proto.setImageSrc = async function (imgElement, url) {
      if (!imgElement) {
        console.error("æœªæä¾›æœ‰æ•ˆçš„å›¾ç‰‡å…ƒç´ ");
        return;
      }
      try {
        const decryptedUrl = await this.decryptImage(url);
        imgElement.src = decryptedUrl;
        imgElement.removeAttribute("data-lazy-src");
        return decryptedUrl;
      } catch (error) {
        console.error("è®¾ç½®å›¾ç‰‡æºå¤±è´¥:", error);
        return null;
      }
    };

    proto.setBackground = async function (element, url) {
      if (!element) {
        console.error("æœªæä¾›æœ‰æ•ˆçš„DOMå…ƒç´ ");
        return;
      }
      try {
        const decryptedUrl = await this.decryptImage(url);
        element.style.backgroundImage = `url('${decryptedUrl}')`;
        return decryptedUrl;
      } catch (error) {
        console.error("è®¾ç½®èƒŒæ™¯å›¾å¤±è´¥:", error);
        return null;
      }
    };

    /**
     * æ£€æŸ¥å…ƒç´ çš„èƒŒæ™¯æ ·å¼æ˜¯å¦åŒ…å« blob URL
     * @param {HTMLElement} element - è¦æ£€æŸ¥çš„ DOM å…ƒç´
     * @returns {boolean} - å¦‚æžœåŒ…å« blob URL è¿”å›ž trueï¼Œå¦åˆ™è¿”å›ž false
     */
    proto.checkBlobInBackground = function (element) {
      if (!element) {
        console.error("æœªæä¾›æœ‰æ•ˆçš„ DOM å…ƒç´ ");
        return false;
      }

      // èŽ·å–è®¡ç®—åŽçš„æ ·å¼
      const computedStyle = window.getComputedStyle(element);

      // æ£€æŸ¥ background-image å±žæ€§
      const backgroundImage = computedStyle.backgroundImage || "";

      // æ£€æŸ¥ background å±žæ€§
      const background = computedStyle.background || "";
      if (!backgroundImage && !background) {
        return false;
      }

      // æ£€æŸ¥æ˜¯å¦åŒ…å« "blob:"
      const hasBlobInBackgroundImage = backgroundImage.includes("blob:");
      const hasBlobInBackground = background.includes("blob:");

      return hasBlobInBackgroundImage || hasBlobInBackground;
    };

    // Always assign Lazy to window after definition

    if (typeof window !== "undefined") {
      window.Lazy = Lazy;
      window.decryptImage = async function (url) {
        // Use a real instance to ensure urlCache works
        if (!window._lazyDecryptInstance) {
          window._lazyDecryptInstance = new window.Lazy({});
        }
        return window._lazyDecryptInstance.decryptImage(url);
      };
    }
  })();
});
