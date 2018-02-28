# Canvas 射击小游戏

## 项目说明
- 概述：Canvas 射击小游戏要求玩家控制飞机发射子弹，消灭会移动的怪兽，如果全部消灭了则游戏成功，如果怪兽移动到底部则游戏失败。

## 项目结构
- **index.html**: 游戏页面
- **style.css**: 页面样式
- **js**: 页面涉及的所有 js 代码
  - **app.js**: 页面逻辑入口 js
- **img**: 存放游戏的图片素材
- **demo**: 存放游戏的演示图片
- **视觉稿**: 存放游戏的视觉稿
- **readme.md**: 项目说明文档


## 项目演示地址
https://wonghan.github.io/game-fighter/


## 具体实现

### 1、打通游戏整体流程 （开始->游戏进行中->成功或者失败）
游戏共分为四种状态：`游戏准备`->`游戏进行`->`游戏成功`或者`游戏失败`
#### 1.1、游戏准备
首次打开页面，将会展现游戏准备界面，界面有游戏标题和和游戏描述以及开始游戏按钮。

![](.demo/game-start.png)

- 游戏标题：设计游戏
- 游戏描述：这是一个令人欲罢不能的射击游戏，使用 ← 和 → 操作你的飞机，使用空格（space）进行射击。一起来消灭宇宙怪兽吧！


#### 1.2、游戏进行

- 画面出现顶部一行怪兽（7个），底部中间出现一个飞机
- 玩家可以通过键盘控制飞机左右移动并且发射子弹，子弹碰到怪兽则怪兽被消灭，消灭所有怪兽则显示游戏成功界面
- 怪兽初始统一往右移动。当怪兽移动到达边界时，则向下移动一格，并且往相反反向移动。以次类推，直到触碰到底部边界，则显示游戏失败界面。

![](.demo/game-in.png)

#### 1.3、游戏成功
在每一关卡中，成功消灭所有的怪兽，则显示游戏通过成功。可以点击“再玩一次” 回到游戏进行界面

![](.demo/game-success.png)

#### 1.4、游戏失败
在游戏中，当怪兽成功突破到飞机的竖直位置，则显示游戏通过失败。可以点击“重新开始” 回到游戏进行界面

![](.demo/game-failed.png)

---

### 2、使用Canvas 绘制游戏

#### 设置游戏场景
游戏场地尺寸为 700 * 600,游戏场地分成三个部分：
- `场景边距区域` 绿色的表示为边距区域，边距长度为30
- `怪兽移动区域`: 蓝色区域，尺寸为 640 * 440
- `飞机移动区域`: 黄色区域表示飞机移动区域，尺寸为 640 * 100

![](.demo/game-platform.jpg)

#### 2.1、实现游戏元素 - 飞机（游戏主角）

![](.demo/game-plane.png)

游戏中**飞机元素**是我们需要操作的主人公，以下是飞机元素需要注意的内容：

- 飞机尺寸为 60 * 100
- 飞机需绘制为飞机图像 `img/plane.png`
- 可通过键盘左右方向键移动飞机元素，默认飞机移动的步伐长度为 5，飞机不可移动出前面所讲的 `飞机移动区域`


#### 2.2、实现游戏元素 - 飞机子弹
![](.demo/game-bullet.png)

通过点击空格键，飞机将射击出**子弹元素**，飞机可同时射出多个子弹。以下是子弹元素需要注意的内容：

- 子弹是一根颜色为白色竖直线条，长度为 10，线条宽度为 1
- 子弹初始横坐标为飞机的正中间即 `plane.x + (plane.width / 2）`
- 子弹初始纵坐标等于飞机的纵坐标 `plane.y`
- 子弹会不断往前方飞行，子弹每帧移动距离为 10
- 当子弹元素飞出画布时，需删除该子弹元素
- 当子弹元素和怪兽元素发生碰撞时，需删除该子弹元素

#### 2.3、实现游戏元素 - 怪兽
![](http://coding.imweb.io/img/p5/game-monster.png)

游戏中怪兽元素共有两种状态（存活和死亡），存活时怪兽会移动，死亡时会绽放成烟花。以下是怪兽元素需要注意的内容：

- 怪兽尺寸为 50 * 50
- 一行怪兽元素共有7个，每个怪兽之间间隔为 10
- 怪兽元素处于存活状态时，需绘制为怪兽图像 `img/enemy.png`
- 怪兽元素处于存活状态时，每一帧移动距离为 2
- 当最右边的怪兽元素移动到 `怪兽移动区域的`左右边界时，下一帧则往下移动，移动的距离为 50，如下图所示：</br>
    ![](.demo/game-monster-move.gif)
- 当怪兽移动超过到`怪兽移动区域的`底部边界时，则游戏结束：</br>
    ![](.demo/game-monster-end.gif)
- 当子弹元素和怪兽元素发生碰撞时，怪兽元素处于死亡状态，且怪兽元素需绘制为爆炸图像 `img/boom.png` （爆炸过程建议绘制三帧，即怪兽死亡过程持续3帧）
- 怪兽死亡过程结束后，删除怪兽元素
- 当怪兽移动超过到`怪兽移动区域的`底部边界时，则游戏结束
    


#### 2.4、实现游戏分数
![](.demo/game-score.png)

在游戏场景左上角有一个分数元素，以下是分数元素需要注意的内容：

- 分数坐标为（20，20)，分数的文字大小 18px
- 分数默认为0，当消灭一个怪兽，则分数加1
- 分数一直进行累加，直到游戏结束



### 游戏可通过修改配置，来修改游戏（如下图所示)

  ```js
  /**
  * 游戏相关配置
  * @type {Object}
  */
  var CONFIG = {
    status: 'start', // 游戏开始默认为开始中
    level: 1, // 游戏默认等级
    totalLevel: 6, // 总共6关
    numPerLine: 6, // 游戏默认每行多少个怪兽
    canvasPadding: 30, // 默认画布的间隔
    bulletSize: 10, // 默认子弹长度
    bulletSpeed: 10, // 默认子弹的移动速度
    enemySpeed: 2, // 默认敌人移动距离
    enemySize: 50, // 默认敌人的尺寸
    enemyGap: 10,  // 默认敌人之间的间距
    enemyIcon: './img/enemy.png', // 怪兽的图像
    enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
    enemyDirection: 'right', // 默认敌人一开始往右移动
    planeSpeed: 5, // 默认飞机每一步移动的距离
    planeSize: {
      width: 60,
      height: 100
    }, // 默认飞机的尺寸,
    planeIcon: './img/plane.png',
  };
  ```
