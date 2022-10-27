!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.DigitalSambaEmbedded=t():e.DigitalSambaEmbedded=t()}(this,(()=>(()=>{"use strict";var e={432:function(e,t,r){var o=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var o,n,i=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(o=i.next()).done;)a.push(o.value)}catch(e){n={error:e}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}return a};Object.defineProperty(t,"__esModule",{value:!0}),t.DigitalSambaEmbedded=void 0;var n=r(517),i=function(){function e(e,t,r){void 0===e&&(e={}),void 0===t&&(t={}),void 0===r&&(r=!0);var i=this;this.savedIframeSrc="",this.allowedOrigin="*",this.connected=!1,this.frame=document.createElement("iframe"),this.eventHandlers={},this.reportErrors=!1,this.mountFrame=function(e){var t=i.initOptions,r=t.url,o=t.frame,a=t.root;if(a?a.appendChild(i.frame):o?(i.frame=o,o.allow||i.logError(n.ALLOW_ATTRIBUTE_MISSING)):document.body.appendChild(i.frame),r)try{var s=new URL(r).toString();i.frame.src=s,i.savedIframeSrc=s}catch(e){i.logError(n.INVALID_URL)}e||(i.savedIframeSrc=i.frame.src,i.frame.src="")},this.load=function(e){void 0===e&&(e={}),i.reportErrors=e.reportErrors||!1,i.setFrameSrc(),i.applyFrameProperties(e),i.frame.style.display="block"},this.on=function(e,t){i.eventHandlers[e]=t},this.onMessage=function(e){if("function"==typeof i.eventHandlers["*"]&&i.eventHandlers["*"](e.data),e.data.type){var t=i.eventHandlers[e.data.type];t instanceof Function&&t(e.data)}},this.setFrameSrc=function(){var e=i.savedIframeSrc,t=i.initOptions,r=t.team,o=t.room,a=t.token;if(r&&o){if(e="https://".concat(r,".digitalsamba.com/").concat(o),a){var s=new URLSearchParams({token:a});e="".concat(e,"?").concat(s)}i.frame.src=e;var c=new URL(i.frame.src);i.allowedOrigin=c.origin,i.frame.onload=function(){return i.checkTarget()}}else i.logError(n.INVALID_CONFIG)},this.logError=function(e){if(i.reportErrors)throw e},this.applyFrameProperties=function(e){e.frameAttributes&&Object.entries(e.frameAttributes).forEach((function(e){var t=o(e,2),r=t[0],n=t[1];null!=n?i.frame.setAttribute(r,n.toString()):i.frame.removeAttribute(r)})),e.reportErrors&&(i.reportErrors=!0)},this.enableVideo=function(){i.sendMessage({type:"enableVideo"})},this.disableVideo=function(){i.sendMessage({type:"disableVideo"})},this.toggleVideo=function(e){void 0===e?i.sendMessage({type:"toggleVideo"}):e?i.enableVideo():i.disableVideo()},this.enableAudio=function(){i.sendMessage({type:"enableAudio"})},this.disableAudio=function(){i.sendMessage({type:"disableAudio"})},this.toggleAudio=function(e){void 0===e?i.sendMessage({type:"toggleAudio"}):e?i.enableAudio():i.disableAudio()},this.startScreenshare=function(){i.sendMessage({type:"startScreenshare"})},this.stopScreenshare=function(){i.sendMessage({type:"stopScreenshare"})},this.initOptions=e,this.frame.allow="camera; microphone; display-capture; autoplay;",this.frame.setAttribute("allowFullscreen","true"),this.mountFrame(r),r?this.load(t):this.frame.style.display="none",window.addEventListener("message",this.onMessage)}var t;return e.prototype.checkTarget=function(){var e=this;this.sendMessage({type:"connect"});var t=window.setTimeout((function(){e.logError(n.UNKNOWN_TARGET)}),5e3);this.on("connected",(function(){e.connected=!0,clearTimeout(t)}))},e.prototype.sendMessage=function(e){this.frame.contentWindow&&this.frame.contentWindow.postMessage(e,{targetOrigin:this.allowedOrigin})},t=e,e.createControl=function(e){return new t(e,{},!1)},e}();t.DigitalSambaEmbedded=i},625:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var o=r(432);e.exports=o.DigitalSambaEmbedded},517:function(e,t){var r,o=this&&this.__extends||(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.INVALID_URL=t.ALLOW_ATTRIBUTE_MISSING=t.INVALID_CONFIG=t.UNKNOWN_TARGET=t.RichError=void 0;var n=function(e){function t(t){var r=e.call(this,t.message)||this;return r.name=t.name,r}return o(t,e),t}(Error);t.RichError=n,t.UNKNOWN_TARGET=new n({name:"UNKNOWN_TARGET",message:"Could not verify the identity of target frame. Commands may not work"}),t.INVALID_CONFIG=new n({name:"INVALID_INIT_CONFIG",message:"Initializations options are invalid. Missing team name or room ID"}),t.ALLOW_ATTRIBUTE_MISSING=new n({name:"ALLOW_ATTRIBUTE_MISSING",message:"You've provided a frame that is mising 'allow' attribute. Some functionality may not work."}),t.INVALID_URL=new n({name:"INVALID_URL",message:"Invalid frame url specified"})}},t={};return function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,r),i.exports}(625)})()));