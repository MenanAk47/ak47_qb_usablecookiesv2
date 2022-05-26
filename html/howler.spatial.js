/*!
* Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
*
* howler.js v2.2.3
* howlerjs.com
*
* (c) 2013-2020, James Simpson of GoldFire Studios
* goldfirestudios.com
*
* MIT License
*/(function(){'use strict';HowlerGlobal.prototype._pos=[0,0,0];HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0];HowlerGlobal.prototype.stereo=function(pan){var self=this;if(!self.ctx||!self.ctx.listener){return self;}
for(var i=self._howls.length-1;i>=0;i--){self._howls[i].stereo(pan);}
return self;};HowlerGlobal.prototype.pos=function(x,y,z){var self=this;if(!self.ctx||!self.ctx.listener){return self;}
y=(typeof y!=='number')?self._pos[1]:y;z=(typeof z!=='number')?self._pos[2]:z;if(typeof x==='number'){self._pos=[x,y,z];if(typeof self.ctx.listener.positionX!=='undefined'){self.ctx.listener.positionX.setTargetAtTime(self._pos[0],Howler.ctx.currentTime,0.1);self.ctx.listener.positionY.setTargetAtTime(self._pos[1],Howler.ctx.currentTime,0.1);self.ctx.listener.positionZ.setTargetAtTime(self._pos[2],Howler.ctx.currentTime,0.1);}else{self.ctx.listener.setPosition(self._pos[0],self._pos[1],self._pos[2]);}}else{return self._pos;}
return self;};HowlerGlobal.prototype.orientation=function(x,y,z,xUp,yUp,zUp){var self=this;if(!self.ctx||!self.ctx.listener){return self;}
var or=self._orientation;y=(typeof y!=='number')?or[1]:y;z=(typeof z!=='number')?or[2]:z;xUp=(typeof xUp!=='number')?or[3]:xUp;yUp=(typeof yUp!=='number')?or[4]:yUp;zUp=(typeof zUp!=='number')?or[5]:zUp;if(typeof x==='number'){self._orientation=[x,y,z,xUp,yUp,zUp];if(typeof self.ctx.listener.forwardX!=='undefined'){self.ctx.listener.forwardX.setTargetAtTime(x,Howler.ctx.currentTime,0.1);self.ctx.listener.forwardY.setTargetAtTime(y,Howler.ctx.currentTime,0.1);self.ctx.listener.forwardZ.setTargetAtTime(z,Howler.ctx.currentTime,0.1);self.ctx.listener.upX.setTargetAtTime(xUp,Howler.ctx.currentTime,0.1);self.ctx.listener.upY.setTargetAtTime(yUp,Howler.ctx.currentTime,0.1);self.ctx.listener.upZ.setTargetAtTime(zUp,Howler.ctx.currentTime,0.1);}else{self.ctx.listener.setOrientation(x,y,z,xUp,yUp,zUp);}}else{return or;}
return self;};Howl.prototype.init=(function(_super){return function(o){var self=this;self._orientation=o.orientation||[1,0,0];self._stereo=o.stereo||null;self._pos=o.pos||null;self._pannerAttr={coneInnerAngle:typeof o.coneInnerAngle!=='undefined'?o.coneInnerAngle:360,coneOuterAngle:typeof o.coneOuterAngle!=='undefined'?o.coneOuterAngle:360,coneOuterGain:typeof o.coneOuterGain!=='undefined'?o.coneOuterGain:0,distanceModel:typeof o.distanceModel!=='undefined'?o.distanceModel:'inverse',maxDistance:typeof o.maxDistance!=='undefined'?o.maxDistance:10000,panningModel:typeof o.panningModel!=='undefined'?o.panningModel:'HRTF',refDistance:typeof o.refDistance!=='undefined'?o.refDistance:1,rolloffFactor:typeof o.rolloffFactor!=='undefined'?o.rolloffFactor:1};self._onstereo=o.onstereo?[{fn:o.onstereo}]:[];self._onpos=o.onpos?[{fn:o.onpos}]:[];self._onorientation=o.onorientation?[{fn:o.onorientation}]:[];return _super.call(this,o);};})(Howl.prototype.init);Howl.prototype.stereo=function(pan,id){var self=this;if(!self._webAudio){return self;}
if(self._state!=='loaded'){self._queue.push({event:'stereo',action:function(){self.stereo(pan,id);}});return self;}
var pannerType=(typeof Howler.ctx.createStereoPanner==='undefined')?'spatial':'stereo';if(typeof id==='undefined'){if(typeof pan==='number'){self._stereo=pan;self._pos=[pan,0,0];}else{return self._stereo;}}
var ids=self._getSoundIds(id);for(var i=0;i<ids.length;i++){var sound=self._soundById(ids[i]);if(sound){if(typeof pan==='number'){sound._stereo=pan;sound._pos=[pan,0,0];if(sound._node){sound._pannerAttr.panningModel='equalpower';if(!sound._panner||!sound._panner.pan){setupPanner(sound,pannerType);}
if(pannerType==='spatial'){if(typeof sound._panner.positionX!=='undefined'){sound._panner.positionX.setValueAtTime(pan,Howler.ctx.currentTime);sound._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime);sound._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime);}else{sound._panner.setPosition(pan,0,0);}}else{sound._panner.pan.setValueAtTime(pan,Howler.ctx.currentTime);}}
self._emit('stereo',sound._id);}else{return sound._stereo;}}}
return self;};Howl.prototype.pos=function(x,y,z,id){var self=this;if(!self._webAudio){return self;}
if(self._state!=='loaded'){self._queue.push({event:'pos',action:function(){self.pos(x,y,z,id);}});return self;}
y=(typeof y!=='number')?0:y;z=(typeof z!=='number')?-0.5:z;if(typeof id==='undefined'){if(typeof x==='number'){self._pos=[x,y,z];}else{return self._pos;}}
var ids=self._getSoundIds(id);for(var i=0;i<ids.length;i++){var sound=self._soundById(ids[i]);if(sound){if(typeof x==='number'){sound._pos=[x,y,z];if(sound._node){if(!sound._panner||sound._panner.pan){setupPanner(sound,'spatial');}
if(typeof sound._panner.positionX!=='undefined'){sound._panner.positionX.setValueAtTime(x,Howler.ctx.currentTime);sound._panner.positionY.setValueAtTime(y,Howler.ctx.currentTime);sound._panner.positionZ.setValueAtTime(z,Howler.ctx.currentTime);}else{sound._panner.setPosition(x,y,z);}}
self._emit('pos',sound._id);}else{return sound._pos;}}}
return self;};Howl.prototype.orientation=function(x,y,z,id){var self=this;if(!self._webAudio){return self;}
if(self._state!=='loaded'){self._queue.push({event:'orientation',action:function(){self.orientation(x,y,z,id);}});return self;}
y=(typeof y!=='number')?self._orientation[1]:y;z=(typeof z!=='number')?self._orientation[2]:z;if(typeof id==='undefined'){if(typeof x==='number'){self._orientation=[x,y,z];}else{return self._orientation;}}
var ids=self._getSoundIds(id);for(var i=0;i<ids.length;i++){var sound=self._soundById(ids[i]);if(sound){if(typeof x==='number'){sound._orientation=[x,y,z];if(sound._node){if(!sound._panner){if(!sound._pos){sound._pos=self._pos||[0,0,-0.5];}
setupPanner(sound,'spatial');}
if(typeof sound._panner.orientationX!=='undefined'){sound._panner.orientationX.setValueAtTime(x,Howler.ctx.currentTime);sound._panner.orientationY.setValueAtTime(y,Howler.ctx.currentTime);sound._panner.orientationZ.setValueAtTime(z,Howler.ctx.currentTime);}else{sound._panner.setOrientation(x,y,z);}}
self._emit('orientation',sound._id);}else{return sound._orientation;}}}
return self;};Howl.prototype.pannerAttr=function(){var self=this;var args=arguments;var o,id,sound;if(!self._webAudio){return self;}
if(args.length===0){return self._pannerAttr;}else if(args.length===1){if(typeof args[0]==='object'){o=args[0];if(typeof id==='undefined'){if(!o.pannerAttr){o.pannerAttr={coneInnerAngle:o.coneInnerAngle,coneOuterAngle:o.coneOuterAngle,coneOuterGain:o.coneOuterGain,distanceModel:o.distanceModel,maxDistance:o.maxDistance,refDistance:o.refDistance,rolloffFactor:o.rolloffFactor,panningModel:o.panningModel};}
self._pannerAttr={coneInnerAngle:typeof o.pannerAttr.coneInnerAngle!=='undefined'?o.pannerAttr.coneInnerAngle:self._coneInnerAngle,coneOuterAngle:typeof o.pannerAttr.coneOuterAngle!=='undefined'?o.pannerAttr.coneOuterAngle:self._coneOuterAngle,coneOuterGain:typeof o.pannerAttr.coneOuterGain!=='undefined'?o.pannerAttr.coneOuterGain:self._coneOuterGain,distanceModel:typeof o.pannerAttr.distanceModel!=='undefined'?o.pannerAttr.distanceModel:self._distanceModel,maxDistance:typeof o.pannerAttr.maxDistance!=='undefined'?o.pannerAttr.maxDistance:self._maxDistance,refDistance:typeof o.pannerAttr.refDistance!=='undefined'?o.pannerAttr.refDistance:self._refDistance,rolloffFactor:typeof o.pannerAttr.rolloffFactor!=='undefined'?o.pannerAttr.rolloffFactor:self._rolloffFactor,panningModel:typeof o.pannerAttr.panningModel!=='undefined'?o.pannerAttr.panningModel:self._panningModel};}}else{sound=self._soundById(parseInt(args[0],10));return sound?sound._pannerAttr:self._pannerAttr;}}else if(args.length===2){o=args[0];id=parseInt(args[1],10);}
var ids=self._getSoundIds(id);for(var i=0;i<ids.length;i++){sound=self._soundById(ids[i]);if(sound){var pa=sound._pannerAttr;pa={coneInnerAngle:typeof o.coneInnerAngle!=='undefined'?o.coneInnerAngle:pa.coneInnerAngle,coneOuterAngle:typeof o.coneOuterAngle!=='undefined'?o.coneOuterAngle:pa.coneOuterAngle,coneOuterGain:typeof o.coneOuterGain!=='undefined'?o.coneOuterGain:pa.coneOuterGain,distanceModel:typeof o.distanceModel!=='undefined'?o.distanceModel:pa.distanceModel,maxDistance:typeof o.maxDistance!=='undefined'?o.maxDistance:pa.maxDistance,refDistance:typeof o.refDistance!=='undefined'?o.refDistance:pa.refDistance,rolloffFactor:typeof o.rolloffFactor!=='undefined'?o.rolloffFactor:pa.rolloffFactor,panningModel:typeof o.panningModel!=='undefined'?o.panningModel:pa.panningModel};var panner=sound._panner;if(panner){panner.coneInnerAngle=pa.coneInnerAngle;panner.coneOuterAngle=pa.coneOuterAngle;panner.coneOuterGain=pa.coneOuterGain;panner.distanceModel=pa.distanceModel;panner.maxDistance=pa.maxDistance;panner.refDistance=pa.refDistance;panner.rolloffFactor=pa.rolloffFactor;panner.panningModel=pa.panningModel;}else{if(!sound._pos){sound._pos=self._pos||[0,0,-0.5];}
setupPanner(sound,'spatial');}}}
return self;};Sound.prototype.init=(function(_super){return function(){var self=this;var parent=self._parent;self._orientation=parent._orientation;self._stereo=parent._stereo;self._pos=parent._pos;self._pannerAttr=parent._pannerAttr;_super.call(this);if(self._stereo){parent.stereo(self._stereo);}else if(self._pos){parent.pos(self._pos[0],self._pos[1],self._pos[2],self._id);}};})(Sound.prototype.init);Sound.prototype.reset=(function(_super){return function(){var self=this;var parent=self._parent;self._orientation=parent._orientation;self._stereo=parent._stereo;self._pos=parent._pos;self._pannerAttr=parent._pannerAttr;if(self._stereo){parent.stereo(self._stereo);}else if(self._pos){parent.pos(self._pos[0],self._pos[1],self._pos[2],self._id);}else if(self._panner){self._panner.disconnect(0);self._panner=undefined;parent._refreshBuffer(self);}
return _super.call(this);};})(Sound.prototype.reset);var setupPanner=function(sound,type){type=type||'spatial';if(type==='spatial'){sound._panner=Howler.ctx.createPanner();sound._panner.coneInnerAngle=sound._pannerAttr.coneInnerAngle;sound._panner.coneOuterAngle=sound._pannerAttr.coneOuterAngle;sound._panner.coneOuterGain=sound._pannerAttr.coneOuterGain;sound._panner.distanceModel=sound._pannerAttr.distanceModel;sound._panner.maxDistance=sound._pannerAttr.maxDistance;sound._panner.refDistance=sound._pannerAttr.refDistance;sound._panner.rolloffFactor=sound._pannerAttr.rolloffFactor;sound._panner.panningModel=sound._pannerAttr.panningModel;if(typeof sound._panner.positionX!=='undefined'){sound._panner.positionX.setValueAtTime(sound._pos[0],Howler.ctx.currentTime);sound._panner.positionY.setValueAtTime(sound._pos[1],Howler.ctx.currentTime);sound._panner.positionZ.setValueAtTime(sound._pos[2],Howler.ctx.currentTime);}else{sound._panner.setPosition(sound._pos[0],sound._pos[1],sound._pos[2]);}
if(typeof sound._panner.orientationX!=='undefined'){sound._panner.orientationX.setValueAtTime(sound._orientation[0],Howler.ctx.currentTime);sound._panner.orientationY.setValueAtTime(sound._orientation[1],Howler.ctx.currentTime);sound._panner.orientationZ.setValueAtTime(sound._orientation[2],Howler.ctx.currentTime);}else{sound._panner.setOrientation(sound._orientation[0],sound._orientation[1],sound._orientation[2]);}}else{sound._panner=Howler.ctx.createStereoPanner();sound._panner.pan.setValueAtTime(sound._stereo,Howler.ctx.currentTime);}
sound._panner.connect(sound._node);if(!sound._paused){sound._parent.pause(sound._id,true).play(sound._id,true);}};})();