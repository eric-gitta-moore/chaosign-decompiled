function Audio(opt) {
  this.init(opt);
}
Audio.prototype = {
  opt: '',
  isMove:false,
  // 初始化元素
  init:function (opt) {
    this.opt = opt; 
    this.isMove = this.opt.isMove;
    this.audioDetail = this.opt.ele.getElementsByClassName('audio-progress-detail')[0];// progress detail 
    this.audioVoiceP = this.opt.ele.getElementsByClassName('audio-voice-p')[0]; // voice p
    this.audioBufferP = this.opt.ele.getElementsByClassName('audio-buffer-p')[0];// buffer p
    this.audioC = this.opt.ele.getElementsByClassName('audio-content')[0];// laoding wrapper
    this.audioOriginBar = this.opt.ele.getElementsByClassName('audio-origin-bar')[0];// origin bar
    this.audioOrigin = this.opt.ele.getElementsByClassName('audio-origin')[0];// origin
    this.audioTime = this.opt.ele.getElementsByClassName('audio-time')[0];// 音乐时间信息
    this.audioCurrent = this.opt.ele.getElementsByClassName('current-t')[0];// currentT
    this.audioDuration = this.opt.ele.getElementsByClassName('duration-t')[0];// durationT
		this.durationT = this.opt.duration;
    this.audioDuration.innerText = this.formartTime(this.durationT);// 初始化视频时间
    this.initAudioEvent();
  },
  onloadedmetadata : function (duration) {
//    alert('loadedmetadata')
      this.durationT = duration;
      // 初始化视频时间
      this.audioDuration.innerText = this.formartTime(this.durationT)
  },
  ontimeupdate : function (currentTime,duration) {
      var date = new Date ()
      if (!this.isDrag) {
        this.currentT = currentTime;
        this.durationT = duration;
        this.currentP = Number((this.currentT / this.durationT) * 100);
        this.currentP = this.currentP > 100 ? 100 : this.currentP;
        this.audioVoiceP.style.width = this.currentP + '%';
        this.audioOrigin.style.left = this.currentP + '%';
        // 更改时间进度
        this.audioCurrent.innerText = this.formartTime(this.currentT);
      }
  },
  initAudioEvent :function() {
    var _this = this
  
   

    _this.audioOrigin.onmousedown = function (event) {
      if(_this.isMove == true){
        _this.isDrag = true
        var e = event || window.event
        var x = e.clientX
        var l = event.target.offsetLeft
        _this.maxProgressWidth = _this.audioOriginBar.offsetWidth;
        _this.audioC.onmousemove = function (event) {
          if (_this.isDrag) {
            var e = event || window.event
            var thisX = e.clientX
            _this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
            // update Time
            _this.updatePorgress()
          }
        }
        _this.audioC.onmouseup = function () {
          if (_this.isDrag) {
            _this.isDrag = false
            var currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT);
            updateVoiceTime(currentTime);
          } else {
            return
          }
        }

        _this.audioC.onmouseleave = function () {
          if (_this.isDrag) {
            _this.isDrag = false
            var currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT);
            updateVoiceTime(currentTime);
          } else {
            return
          }
        }
      }
    }

    _this.audioOrigin.ontouchstart = function (event) {
      if(_this.isMove == true){
        _this.isDrag = true
        var e = event || window.event
        var x = e.touches[0].clientX
        var l = e.target.offsetLeft

        _this.maxProgressWidth = _this.audioOriginBar.offsetWidth

        _this.audioC.ontouchmove = function (event) {
          if (_this.isDrag) {
            var e = event || window.event
            var thisX = e.touches[0].clientX
            _this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
            _this.updatePorgress()
          }
        },
        _this.audioC.ontouchend = function () {
          if (_this.isDrag) {
            _this.isDrag = false
            var currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT);
            updateVoiceTime(currentTime);
          } else {
            return
          }
        }
      }
    }

    // _this.audioDetail.onclick = function (event) {
    //   if(_this.isMove == true){
    //     event.stopPropagation();
    //     var e = event || window.event;
    //     var l = e.layerX;
    //     var w = _this.audioDetail.offsetWidth;
    //      _this.maxProgressWidth = w;
    //      _this.dragProgressTo = l;
    //     var currentTime = Math.floor(l / w * _this.durationT);
    //     _this.updatePorgress();
    //     updateVoiceTime(currentTime);
    //     e.stopPropagation(); 
    //   }
    // }
  },
  updateTime:function(event){
      if(this.isMove == true){
        var e = event || window.event;
        var timeW = this.audioCurrent.offsetWidth;
        var l = e.changedTouches[0].clientX - 85 - timeW;
        var w = this.audioDetail.offsetWidth;
        this.maxProgressWidth = w;
        this.dragProgressTo = l;
        var currentTime = Math.floor(l / w * this.durationT);
        this.updatePorgress();
        updateVoiceTime(currentTime);
        e.stopPropagation(); 
      }
  },
  updatePorgress :function() {
    this.audioOrigin.style.left = this.dragProgressTo + 'px'
    this.audioVoiceP.style.width = this.dragProgressTo + 'px'
    var currentTime = Math.floor(this.dragProgressTo / this.maxProgressWidth * this.durationT)
    // this.audio.currentTime = currentTime
    this.audioCurrent.innerText = this.formartTime(currentTime)
    // this.audio.currentTime = Math.floor(this.dragProgressTo / this.maxProgressWidth * this.durationT)
  },

  formartTime :function(time) {
    var newtime;
    if (null != time) {
        if(this.durationT >= 60 * 60){
          if(time < 60){ 
              var seconds = parseInt(time) < 10 ? ('0' + parseInt(time)) : parseInt(time);
              newtime = '00:00:' + seconds;
          }else  if (time >= 60 && time < 60 * 60) {
              var minute = parseInt(time / 60.0) < 10 ? ('0' + parseInt(time / 60.0)) : parseInt(time / 60.0);
              var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
              newtime = '00:' + minute + ':' + seconds;
          }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
              var hour = parseInt(time / 3600.0) < 10 ? ('0' + parseInt(time / 3600.0)) : parseInt(time / 3600.0);
              var minute = (parseInt(time / 60.0 % 60.0) < 10) ? ('0' + parseInt(time / 60.0 % 60.0)) : parseInt(time / 60.0 % 60.0);
              var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
              newtime = hour + ':' + minute + ':' + seconds;
          }
        }else{
          if(time < 60){ 
              var seconds = parseInt(time) < 10 ? ('0' + parseInt(time)) : parseInt(time);
              newtime = '00:' + seconds;
          }else  if (time >= 60 && time < 60 * 60) {
              var minute = parseInt(time / 60.0) < 10 ? ('0' + parseInt(time / 60.0)) : parseInt(time / 60.0);
              var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
              newtime = minute + ':' + seconds;
          }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
              var hour = parseInt(time / 3600.0) < 10 ? ('0' + parseInt(time / 3600.0)) : parseInt(time / 3600.0);
              var minute = (parseInt(time / 60.0 % 60.0) < 10) ? ('0' + parseInt(time / 60.0 % 60.0)) : parseInt(time / 60.0 % 60.0);
              var seconds = (parseInt(time % 60.0) < 10) ? ('0' + parseInt(time % 60.0)) : parseInt(time % 60.0);
              newtime = hour + ':' + minute + ':' + seconds;
          }
        }
    }
    return newtime;
  }
}
