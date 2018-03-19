/**
 * 继承：inheritPrototype方法
 */
function inheritPrototype (subType, superType) {
  var proto = Object.create(superType.prototype)
  proto.constructor = subType
  subType.prototype = proto
}

/**
 * 父类：Element对象
 */
function Element (opts) {
  var opts = opts || {}
    // 设置坐标和尺寸
  this.x = opts.x
  this.y = opts.y
  this.width = opts.width
  this.height = opts.height
  this.speed = opts.speed
}
Element.prototype = {
  move: function (x, y) {
    this.x += x
    this.y += y
  },
  draw: function () {
  }
}
/**
 * 子类：Enemy对象
 */
function Enemy (opts) {
  var opts = opts || {}
    // 继承父类属性
  Element.call(this, opts)
    // enemy特有属性
  this.status = 'alive' // 可为alive、booming、boomed
  this.icon = opts.icon
  this.boomIcon = opts.boomIcon
  this.boomCount = 0 // 爆炸的次数
  this.direction = opts.direction
}
// 继承父类方法
inheritPrototype(Enemy, Element)
// enemy 特有的方法
// 左右移动
Enemy.prototype.animate = function () {
  var dx = this.speed
  if (this.direction === 'right') {
    this.move(dx, 0)
  } else if (this.direction == 'left') {
    this.move(-dx, 0)
  }
}
// 向下移动
Enemy.prototype.down = function () {
  var dy = CONFIG.enemyDistance
  var dx = this.speed
  if (this.direction === 'right') {
    this.direction = 'left'
    this.move(-dx, dy)
  } else if (this.direction === 'left') {
    this.direction = 'right'
    this.move(dx, dy)
  }
}
// 爆炸方法
Enemy.prototype.booming = function () {
    // 设置为booming 状态
  this.status = 'booming'
  this.boomCount += 1
    // 如果booming了3次，则设置为 boomed
  if (this.boomCount > 3) {
    this.status = 'boomed'
  }
}
// 重写draw方法
Enemy.prototype.draw = function () {
  switch (this.status) {
    case 'alive':
      context.drawImage(this.icon, this.x, this.y, this.width, this.height)
      break
    case 'booming':
      context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height)
      break
    case 'boomed':
  }
}

/**
 * 子类：Bullet 子弹对象
 */
var Bullet = function (opts) {
  var opts = opts || {}
    // 继承父类属性
  Element.call(this, opts)
}
// 继承父类方法
inheritPrototype(Bullet, Element)
// Bullet 特有的方法
// Bullet 移动方法
Bullet.prototype.fly = function () {
  this.move(0, -this.speed)
  return this
}
// 判断是否和物体碰撞
Bullet.prototype.hasCrash = function (target) {
  var crash = false
  if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
        // 碰撞了
    crash = true
  }
  return crash
}
// Bullet draw方法
Bullet.prototype.draw = function () {
  context.fillStyle = '#fff'
  context.fillRect(this.x, this.y, this.width, this.height)
  return this
}

/**
 * 子类：Plane 飞机对象
 * 依赖 Bullet
 */
var Plane = function (opts) {
  var opts = opts || {}
    // 继承父类属性
  Element.call(this, opts)
    // Plane特有属性
  this.status = 'alive'  // 有 alive 和 boomed 2种状态
  this.icon = opts.icon
    // 子弹相关
  this.bullets = []
  this.bulletSize = opts.bulletSize
  this.bulletSpeed = opts.bulletSpeed
}
// 继承父类方法
inheritPrototype(Plane, Element)
// Plane 特有方法
// 判断是否和物体碰撞
Plane.prototype.hasCrash = function (target) {
  var crash = false
  if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
        // 碰撞了
    crash = true
  }
  return crash
}
// 判断是否击中目标
Plane.prototype.hasHit = function (target) {
  var bullets = this.bullets
  var hasHit = false
  for (var i = bullets.length - 1; i >= 0; i--) {
        // 如果飞机击中目标，则销毁子弹
    if (bullets[i].hasCrash(target)) {
      this.bullets.splice(i, 1)
      hasHit = true
      break
    }
  }
  return hasHit
}
// 飞机移动方法（向左）
Plane.prototype.animateLeft = function () {
  var dx = this.speed
  var canvasPadding = CONFIG.canvasPadding
  if (this.x <= canvasPadding) return
  this.move(-dx, 0)
}
// 飞机移动方法（向右）
Plane.prototype.animateRight = function () {
  var dx = this.speed
  var canvasPadding = CONFIG.canvasPadding
  if (this.x >= canvasWidth - canvasPadding - this.width) return
  this.move(dx, 0)
}
// 飞机射击方法
Plane.prototype.startShoot = function () {
  var self = this
  var bulletWidth = CONFIG.bulletWidth
  var bulletHeight = this.bulletSize
  var bulletX = self.x + self.width / 2 - bulletWidth / 2
  var bulletY = self.y - bulletHeight
    // 创建子弹
  self.bullets.push(new Bullet({
    x: bulletX,
    y: bulletY,
    width: bulletWidth,
    height: bulletHeight,
    speed: self.bulletSpeed
  }))
}
// 画子弹
Plane.prototype.drawBullets = function () {
  var bullets = this.bullets
  var i = bullets.length
  while (i--) { // 注意："i--"为先判断i再减1，所以遍历bullets[i-1]--bullets[0],plane的hasHit中的for是一样的用法
    var bullet = bullets[i]
        // 更新子弹的位置
    bullet.fly()
        // 如果子弹超出边界，则删除
    if (bullet.y <= 0) {
      bullets.splice(i, 1)
    } else {
      bullet.draw()
    }
  }
}
// draw方法：绘制飞机
Plane.prototype.draw = function () {
    // 绘制飞机
  context.drawImage(this.icon, this.x, this.y, this.width, this.height)
    // 绘制子弹
  this.drawBullets()
  return this
}
