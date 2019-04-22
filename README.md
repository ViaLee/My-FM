— — — — 存在的问题 - - - -
  获取音乐 403 百度设置了权限 
  解决：将发送请求的url设置为空
  <!-- <meta name="referrer" content="never"> -->


  — — — — 事件中心 - - - -
  EventCenter.on('hello', function(e, data){
      console.log(data)
    })
    EventCenter.fire('hello', '你好')
   
    用法
        $('footer').on('click', 'li', () => {
            console.log(this)
            $(this).addClass('active').siblings().removeClass('active')
        })


  — — — — audio对象 - - - -
    function getAudioObject(){
        var audioObject = document.querySelector('#music')
        audioObject.autoplay = false
    }
