  — — — — 存在的问题 - - - -
  getSong接口只能用http协议，https不可
  获取音乐 403 百度设置了权限 将发送请求的url设置为空
  <meta name="referrer" content="never">


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


  — — — —自己写的烂代码- - - -
  function footerlast() {
        var divwidth = $('#channelList').css('width')
        var itemwidth = $('#channelList ul').find('li').outerWidth(true)
        var count = parseInt($('.box').width() / itemwidth)
        var x = itemwidth * count
        $('footer #footerLast').on('click', () => {
            if (parseInt($('#channelList > ul').css('left')) < 0) {
                $('#channelList > ul').css('left', '+=' + x).addClass('tsfX')
            }
        })
    }
    function footernext() {
        var divwidth = $('#channelList').css('width')
        var itemwidth = $('#channelList ul').find('li').outerWidth(true)
        var count = parseInt($('.box').width() / itemwidth)
        var x = itemwidth * count
        $('footer #footerNext').on('click', () => {
            if (parseInt($('#channelList > ul').css('left')) > -5367) {
                $('#channelList > ul').css('left', '-=' + x).addClass('tsfX')
            }
        })
    }
    function itemclick(data) {
        $('footer .box ul li div').on('click', (e) => {
            var id = e.currentTarget.id
            for (var i = 0; i < data.channels.length; i++) {
                if (id === data.channels[i].channel_id) {
                    $('footer .box ul li').on('click', (e) => {
                        $('.term').text($(e.currentTarget).find('h3')[0].textContent)
                    })
                }
            }
            $.getJSON('https://api.jirengu.com/fm/getLyric.php', { channel: id }).done((data1) => { })
                .then((data1) => {
                    $('main .left > figure').css('background-image', `url(` + data1.song[0].picture + `)`)
                    $('.singer').text(data1.song[0].artist)
                    $('.song').text(data1.song[0].title)
                    console.log(data1)
                    var url = data1.song[0].url
                    $('main').append(`
                      <audio id="music" src="">你的浏览器不支持喔！</audio>`)
                    var audioObject = document.querySelector('#music')
                    audioObject.src = url
                    audioObject.autoplay = true
                    audioObject.volume = 0.3
                })
        })
    }

     $('main .left #pause').on('click',()=>{
                 this.audioObject.pause()
                 $('main .left #play').css('display','block').on('click',()=>{
                    $('main .left #pause').css('display','block')
                 })
             }).css('display','none')


              $('main .left #pause').on('click', () => {
                this.audioObject.pause()
                $('main .left #pause').css('display', 'none')
                setTimeout(() => {
                    $('main .left #play').css('display', 'block')
                }, 100)
            })
            $('main .left #play').on('click', () => {
                this.audioObject.play()
                setTimeout(() => {
                    $('main .left #play').css('display', 'none')
                    $('main .left #pause').css('display', 'block')
                }, 100)
            })