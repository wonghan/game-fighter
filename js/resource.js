/**
 * 资源管理器
 */
var resourceHelper = {
    /**
     * 加载图片
     */
    imageLoader: function(src,callback) {
        var image = new Image();
        image.src = src;
        //图片加载完成
        image.addEventListener('load',callback);
        image.addEventListener('errpr',function(){
            console.log('Image_error')
        });
        return image;
    },
    // 根据名称返回图片对象
    getImage: function(imageName) {
        return this.resources.images[imageName];
    },
    /**
     * 资源加载
     * @param {Array} resources 资源列表
     */
    load: function(resources, callback) {
        var images = resources.images;
        // var sounds = resources.sounds;
        var total = images.length;
        var finish = 0; // 已完成的个数
        // 保存加载后的图片对象和声音对象
        this.resources = {
            images: {}
            // sounds: {}
        };
        var self = this;

        // 遍历加载图片
        for(var i = 0 ; i < images.length; i++) {
            var name = images[i].name;
            var src = images[i].src;
            self.resources.images[name] = self.imageLoader(src, function() {
              // 加载完成
              finish++;
              if( finish == total){
                //全部加载完成
                callback(self.resources);
              }
            });
        }
    }
}
  
  