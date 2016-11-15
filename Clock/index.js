import {Observable} from 'rxjs/RX';
import {Subject} from 'rxjs/RX';

window.onload = function() {
  initialize();
}

const initialize = function() {
  var canvas = document.getElementById("stopwatch");
  var ctx = canvas.getContext("2d");
  var radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90
  
  stopwatch.ctx = ctx;
  stopwatch.radius = radius;
  stopwatch.canvas = canvas;
  stopwatch.ctx = ctx;
  stopwatch.drawClock();

  addStreams();
}

const addStreams = () => {
  var buttonStreams = Observable.merge(
    Observable.fromEvent(document.getElementById('start'), 'click').mapTo(stopwatch.start),
    Observable.fromEvent(document.getElementById('stop'), 'click').mapTo(stopwatch.stop),
    Observable.fromEvent(document.getElementById('split'), 'click').mapTo(stopwatch.split),
    Observable.fromEvent(document.getElementById('reset'), 'click').mapTo(stopwatch.reset)
  )
  buttonStreams
    .scan((accum, curr) => curr.apply(stopwatch, accum), {})
    .subscribe();
}



var Timer = {
  time: Date,
  subscription: {},
  pauser: Subject,
  start: function(interval, cb) {
    this.pauser = new Subject();
    this.started = true;
    this.time = new Date();
    this.time.setSeconds(0);
    this.time.setMinutes(0);
    this.time.setHours(0);
    
    var pauser = new Subject();       
    this.subscription = Observable
      .interval(interval)
      .timeInterval()
      .share()
      .subscribe((total) => {
        this.time.setMilliseconds(this.time.getMilliseconds() + 100);
        cb(this.time);
      });
  },
  pause: function() {
    pauser.onNext(false);
  },
  stop: function() {
    this.subscription.unsubscribe();
  }
}



const stopwatch = {
  ctx: {},
  radius: 0,
  canvas: {},
  context: {},
  started: false,
  splits: [],
  start: function() {
    if (this.started) {
      return;
    } else {
      this.started = true;
    }
    this.timer = Object.create(Timer);
    var digital = document.getElementById('digital');
    this.timer.start(100,
      time => {
        digital.innerHTML = this.humanReadableTime(time);
        this.drawClock(time);
      });
  },

  stop: function() {
    this.started = false;
    this.timer.pause();
  },

  reset: function() {
    this.splits = [];
    const splitContainer = document.getElementById("split-container");
    const rows = splitContainer.getElementsByClassName("rows")[0];
    while(rows.firstChild) {
      rows.removeChild(rows.firstChild); // Remove all rows.
    }
    this.drawClock();
    var digital = document.getElementById('digital');
    digital.innerHTML = "00:00:0"
  },

  split: function() {
    const splitTime = this.humanReadableTime(this.timer.time);
    this.splits.push(splitTime);
    const splitContainer = document.getElementById("split-container");
    const rows = splitContainer.getElementsByClassName("rows")[0];

    if (this.splits.length == 1) {
      var topRow = document.createElement("div");
      topRow.className = "split-row top";
      topRow.innerHTML = splitTime;
      rows.appendChild(topRow);
    } else {
      var row = document.createElement("div");
      row.className = "split-row";
      row.innerHTML = splitTime;
      rows.appendChild(row);
    }
  },

  drawClock: function (time=null) {
    this.drawFace();
    this.drawNumbers();
    this.drawTime(time);
  },

  humanReadableTime: function(time) {
    return time.toISOString().slice(14,21);
  },

  drawFace: function () {
    var grad = null;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    grad = this.ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    this.ctx.strokeStyle = grad;
    this.ctx.lineWidth = this.radius * 0.1;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
  },

  drawNumbers: function () {
    var ang;
    var num;
    this.ctx.font = this.radius * 0.15 + "px arial";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
      ang = num * Math.PI / 6;
      this.ctx.rotate(ang);
      this.ctx.translate(0, -this.radius * 0.85);
      this.ctx.rotate(-ang);
      this.ctx.fillText("-", 0, 0);
      this.ctx.rotate(ang);
      this.ctx.translate(0, this.radius * 0.85);
      this.ctx.rotate(-ang);
    }
  },

  drawTime: function (time=null) {
    var hour = 0;
    var minute = 0;
    var second = 0;

    if (time !== null) {
      hour = time.getHours();
      minute = time.getMinutes();
      second = time.getSeconds();
    }
    
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
      (minute * Math.PI / (6 * 60)) +
      (second * Math.PI / (360 * 60));
    this.drawHand(this.ctx, hour, this.radius * 0.5, this.radius * 0.07);
    //minute
    minute = ((minute * Math.PI) / 30) + ((second * Math.PI) / (30 * 60));
    this.drawHand(this.ctx, minute, this.radius * 0.8, this.radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    this.drawHand(this.ctx, second, this.radius * 0.9, this.radius * 0.02);
  },
  
  drawHand: function (ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }
}


