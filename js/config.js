 /**
  * 游戏相关配置
  * @type {Object}
  */
  var CONFIG = {
    status: 'start', // 游戏开始默认为开始中
    level: 1, // 游戏默认等级
    totalLevel: 6, // 总共6关
    numPerLine: 7, // 游戏默认每行多少个怪兽
    canvasPadding: 30, // 默认画布的间隔
    bulletSize: 10, // 默认子弹长度
    bulletWidth: 1, // 默认子弹宽度
    bulletSpeed: 10, // 默认子弹的移动速度
    enemySpeed: 2, // 默认敌人移动距离
    enemySize: 50, // 默认敌人的尺寸
    enemyGap: 10,  // 默认敌人之间的间距
    enemyDistance: 50, //默认敌人向下走的距离
    enemyDirection: 'right', // 默认敌人一开始往右移动
    planeSpeed: 5, // 默认飞机每一步移动的距离
    planeSize: {
      width: 60,
      height: 100
    }, // 默认飞机的尺寸,
    // planeIcon: './img/plane.png',
    resources: {
      images: [
        {
          src: './img/enemy.png',
          name: 'enemyIcon'
        },
        {
          src: './img/boom.png',
          name: 'enemyBoomIcon'
        },
        {
          src: './img/plane.png',
          name: 'planeIcon'
        }
      ]
    }
  };