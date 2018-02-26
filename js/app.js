// 元素
var container = document.getElementById('game');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// 获取画布相关信息
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
// 兼容定义requestAnimationFrame
window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback){
  window.setTimeout(callback,1000/60);
};
//兼容定义cancelAnimationFrame
window.cancelAnimFrame =
window.cancelAnimationFrame ||
window.webkitCancelAnimationFrame ||
window.mozCancelAnimationFrame ||
window.oCancelAnimationFrame ||
window.msCancelAnimationFrame ||
function(id){
  window.clearTimeout(id);  
};
var loop_keypress;

/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opts) {
    // 设置opts
    var opts = Object.assign({},opts,CONFIG);
    this.opts = opts;
    // 设置初始score、level
    this.score = 0;
    this.level = opts.level;
    // 计算飞机初始坐标
    this.planePosX = canvasWidth /2 - opts.planeSize.width /2;
    this.planePosY = canvasHeight - opts.planeSize.height - opts.canvasPadding;

    this.status = 'start';
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var replayBtn = document.querySelector('.js-replay');
    var playAgainBtn = document.querySelector('.js-play-again');
    var nextBtn = document.querySelector('.js-next');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    replayBtn.onclick = function() {
      self.play();
    };
    nextBtn.onclick = function() {
      self.play();
    };
    playAgainBtn.onclick = function() {
      self.play();
    };
  },
/**
 * 自定义键盘按键函数,设置多键触发(对比按键绑定方法，流畅度、操作性大大提高！)
 */
bindKeyEvent:function(){
  var self = this;
  var key_press={};
  window.addEventListener('keydown',function(event){
      key_press[event.keyCode] = true;
  });
  window.addEventListener('keyup',function(event){
      key_press[event.keyCode] = false; // 这一句可以不用写，写下来只是为了看起来逻辑比较顺畅
      delete key_press[event.keyCode];  // key up即删除，节省内存，提高遍历速度
  });
  function keyPress(){
      for(var key in key_press){ 
          switch(key){
              case '32': // 射击子弹
                self.plane.startShoot();
              break;
              case '37': // 移动飞机（向左） 
                self.plane.animateLeft();
              break;
              case '39': // 移动飞机（向右） 
                self.plane.animateRight();
              break;
          }
      }
      loop_keypress = requestAnimFrame(keyPress);
  }
  keyPress();
},
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus('playing');
    this.start();
  },
  failed: function() {
    this.setStatus('failed');
    var scoreSpan = document.querySelector('.game-failed .score');
    scoreSpan.innerHTML = this.score;
    this.score = 0;
    this.level = 1;
  },
  success: function() {
    this.setStatus('success');
    var scoreSpan = document.querySelector('.game-success .score');
    var levelSpan = document.querySelector('.game-success .level');
    scoreSpan.innerHTML = this.score;
    this.level++;
    levelSpan.innerHTML = this.level;
  },
  all_success: function() {
    this.setStatus('all-success');
    var scoreSpan = document.querySelector('.game-all-success .score');
    scoreSpan.innerHTML = this.score;
    this.score = 0;
    this.level = 1;
  },
  /**
   * 开始游戏
   */
  start: function(){
    // 获取游戏初始化数据
    let self = this;
    var opts = this.opts;
    var level = this.level;
    // 清空射击目标对象数组和分数设置为 0
    this.enemies = [];
    // 创建敌人
    for(var i=0;i<level;i++){
      for(var j=0;j<opts.numPerLine;j++){
        self.createEnemy(i,j);
      }
    }
    // 创建主角
    self.createPlane();
    // 绑定键盘事件
    this.bindKeyEvent();
    // 开始更新游戏
    this.update();
  },
  /**
   * 更新游戏（循环）
   */
  update: function(){
    let self = this;
    var opts = this.opts;

    // 更新飞机、敌人
    this.updateElement();
    // 清除
    context.clearRect(0,0,canvasWidth,canvasHeight);

    if(this.plane.status === 'boomed'){
      this.end();
      this.failed();
      return; //退出 update 循环 (退出requestAnimationFrame循环)
    }
    if(this.enemies.length === 0){
      this.end();
      if(this.level<this.opts.totalLevel){
        this.success();
      }else{
        this.all_success();
      }
      return; //退出 update 循环 (退出requestAnimationFrame循环)
    }
    // 绘制
    this.draw();

    //不断循环 update
    requestAnimFrame(function(){
      self.update();
    });
    
  },
  /**
   * 更新所有元素（主角与敌人）的状态
   */
  updateElement: function(){
    var opts = this.opts;
    var canvasPadding = opts.canvasPadding;
    var enemySize = opts.enemySize;
    var enemies = this.enemies;
    var plane = this.plane;
    var i = enemies.length;

    // 1、判断敌人是否到左右边界
    function isDown(enemy,index,array){
      return(enemy.x>canvasWidth-canvasPadding-enemy.width||enemy.x<canvasPadding);
    } 
    // 2、判断敌人是否被击中
    function enemyIsHit(enemy){
      switch(enemy.status){
        case 'alive':
          if(plane.hasHit(enemy)) {
            enemy.booming();
          }
        break;
        case 'booming':
          enemy.booming();
        break;
        case 'boomed':
          enemies.splice(i, 1);
          GAME.score++;
        break;
      }
    }
    // 3、判断主角是否被击中
    function planeIsHit(enemy){
      if(plane.hasCrash(enemy)){
        plane.status = 'boomed';
      }
    }
    // init
    if(enemies.some(isDown)){
        // （1）若已到达左右边界，则向下移动敌人
      while(i--){
        var enemy = enemies[i];
        enemy.down();
        if(enemy.y >= canvasHeight) {
          this.enemies.splice(i,1);
        }else{
          enemyIsHit(enemy);
          planeIsHit(enemy);
        }
      }
    }else{ // （2）若未到达左右边界，则左右移动敌人
      while(i--){
        var enemy = enemies[i];
        enemy.animate(); 
        enemyIsHit(enemy);
        planeIsHit(enemy);
      }
    }

   
  },
  /**
   * 生成主角
   */
  createPlane: function() {
    var opts = this.opts;
    this.plane = new Plane({
      x: this.planePosX,
      y: this.planePosY,
      width: opts.planeSize.width,
      height: opts.planeSize.height,
      speed:opts.planeSpeed,
      icon: resourceHelper.getImage('planeIcon'),
      bulletSize: opts.bulletSize,
      bulletSpeed: opts.bulletSpeed
    });
  },
  /**
   * 生成敌人
   */
  createEnemy: function(i,j) {
    var enemies = this.enemies;
    var opts = this.opts;
    var enemyIcon = resourceHelper.getImage('enemyIcon');
    var enemyBoomIcon = resourceHelper.getImage('enemyBoomIcon');
    // 综合元素的参数
    var initOpt = {
      x: opts.canvasPadding + j*(opts.enemySize+opts.enemyGap),
      y: opts.canvasPadding + i*(opts.enemySize+opts.enemyGap),
      width: opts.enemySize,
      height: opts.enemySize,
      speed :opts.enemySpeed,
      icon: enemyIcon,
      boomIcon: enemyBoomIcon,
      boomCount: 0,
      direction: opts.enemyDirection
    };
    
    enemies.push(new Enemy(initOpt));
    
  },
  end: function(){
    console.log('游戏结束');
    cancelAnimFrame(loop_keypress);
  },
  draw: function(){
    // 绘制敌人
    this.enemies.forEach(function(enemy){
      enemy.draw();
    });
    // 绘制主角
    this.plane.draw();
     // 绘制分数
     var text = '分数：' + this.score;
     context.fillStyle = '#fff';
     context.font = '18px 幼圆';
     context.fillText(text,20,40);
  }

};
/**
 * 主入口
 */
function init(){
  // 加载图片资源，加载完成才能交互,否则会报错（因为图片为异步加载）
  resourceHelper.load(CONFIG.resources, function(resources){
    // 加载完成
    // 初始化
    GAME.init();
  });
}
init();

