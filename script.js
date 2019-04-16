var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler)
    },
    fire: function (type, data) {
        $(document).trigger(type, data)
    }
}


var fm = {
    init: function () {
        this.audioObject = new Audio()
        this.audioObject.autoplay = true
        this.audioObject.volume = 0.2
        this.duration = 0
        this.currentTime = 0
        this.bind()
    },
    bind: function () {
        var _this = this


        EventCenter.on('selectChannel', (e, data) => {
            // console.log('selectChannel')
            // console.log(data)
            _this.channelId = data.channelId
            $('.term').text(data.channelName)
            _this.loadmusic()
            // console.log(_this.currentTime)
        })

        $('main .left #like').on('click', (e) => {
            if ($(e.currentTarget).hasClass('icon-like')) {
                $('#likecount span').text(parseInt($('#likecount span').text()) + 1)
                $(e.currentTarget).removeClass('icon-like').addClass('icon-like4')
            } else if ($(e.currentTarget).hasClass('icon-like4')) {
                $('#likecount span').text(parseInt($('#likecount span').text()) - 1)
                $(e.currentTarget).removeClass('icon-like4').addClass('icon-like')
            }
        })

        $('main .left #nextsong').on('click', (e) => {
            $('#like').removeClass('icon-like4').addClass('icon-like')
            _this.loadmusic()
            $('#pause').removeClass('icon-play-circle-outline').addClass('icon-pause-circle-outline')
        })

        $('main .left #pause').on('click', () => {
            if ($('#pause').hasClass('icon-pause-circle-outline')) {
                this.audioObject.pause()
                $('#pause').removeClass('icon-pause-circle-outline').addClass('icon-play-circle-outline')
            } else {
                this.audioObject.play()
                $('#pause').removeClass('icon-play-circle-outline').addClass('icon-pause-circle-outline')
            }
        })


        _this.audioObject.addEventListener('play', function () {
            clearInterval(_this.statusClock)
            _this.statusClock = setInterval(function () {
                _this.updateStatus()
            }, 1000)

        })

        _this.audioObject.addEventListener('pause', function () {
            clearInterval(_this.statusClock)
            console.log('pause')
        })

        _this.audioObject.addEventListener('ended', function () {
            console.log('ended')
            _this.loadmusic()
        })
    },
    loadmusic: function (callback) {
        var _this = this
        $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php', { channel: _this.channelId }).done((data1) => {
            $('.bg').css('background-image', 'url(' + data1.song[0].picture + ')')
            $('main .left > figure').css('background-image', `url(` + data1.song[0].picture + `)`)
            $('.singer').text(data1.song[0].artist)
            $('.song').text(data1.song[0].title)
            var url = data1.song[0].url
            _this.audioObject.src = url
            _this.audioObject.addEventListener('playing', function (e) {
                _this.duration = _this.audioObject.duration
            })
            _this.loadLyric(data1)
            $('songduration').text(_this.audioObject.duration)
        })
    },
    updateStatus() {
        var min = Math.floor(this.audioObject.currentTime / 60)
        var second = Math.floor(fm.audioObject.currentTime % 60) + ''
        second = second.length === 2 ? second : '0' + second
        $('#songduration').text(min + ':' + second)
        $('.bar-progress').css('width', this.audioObject.currentTime / this.audioObject.duration * 100 + '%')
        var line = this.lyricObj['0' + min + ':' + second]
        if (line) {
            $('main .lyric p').text(line)
                .boomText()
        }
    },
    loadLyric(data) {
        var _this = this
        $.getJSON('https://jirenguapi.applinzi.com/fm/getLyric.php', { sid: data.song[0].sid }).done(function (ret) {
            var lyric = ret.lyric
            var lyricObj = {}
            lyric.split('\n').forEach(function (line) {
                //[01:10.25][01:20.25]It a new day
                var times = line.match(/\d{2}:\d{2}/g)
                //times == ['01:10.25', '01:20.25']
                var str = line.replace(/\[.+?\]/g, '')
                if (Array.isArray(times)) {
                    times.forEach(function (time) {
                        lyricObj[time] = str
                    })
                }
            })
            _this.lyricObj = lyricObj
        })
    }
}


var footer = {
    init: function () {
        this.$footer = $('footer')
        this.render()
    },
    bind: function (data) {
        var itemwidth = $('#channelList ul').find('li').outerWidth(true)
        var count = parseInt($('.box').width() / itemwidth)
        var x = itemwidth * count

        //footernext()
        $('footer #footerNext').on('click', () => {
            if (parseInt($('#channelList > ul').css('left')) > -5367) {
                $('#channelList > ul').css('left', '-=' + x).addClass('tsfX')
            }
        })
        // footerlast()
        $('footer #footerLast').on('click', () => {
            if (parseInt($('#channelList > ul').css('left')) < 0) {
                $('#channelList > ul').css('left', '+=' + x).addClass('tsfX')
            }
        })
        this.$footer.on('click', 'li', function () {
            console.log(this)
            $(this).addClass('active').siblings().removeClass('active')
            $('#pause').removeClass('icon-play-circle-outline').addClass('icon-pause-circle-outline')
            EventCenter.fire('selectChannel', {  //jquery中用attr()方法来获取和设置元素属性
                channelId: $(this).find('div').attr('id'),
                channelName: $(this).find('h3').text()
            })
        })

    },
    render: function (channels) {
        $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php').done((data1) => {
            // console.log(data1.channels)
            let list = $('#channelList h3')
            var length = data1.channels.length
            var i
            for (i = 0; i < length; i++) {
                var str = `<li>
                        <div class="cover" id="`+ data1.channels[i].channel_id + `" style="background-image:url(` + data1.channels[i].cover_small + `)"></div>
                        <h3>`+ data1.channels[i].name + `</h3>
                    </li>`
                $('footer ul').append(str)
            }
        }).then((data1) => {
            this.bind(data1)
        })
    }
}

$.fn.boomText = function(type){
type = type || 'rollIn'
console.log(type)
this.html(function(){
var arr = $(this).text()
.split('').map(function(word){
    return '<span class="boomText">'+ word + '</span>'
})
return arr.join('')
})

var index = 0
var $boomTexts = $(this).find('span')
var clock = setInterval(function(){
$boomTexts.eq(index).addClass('animated ' + type)
index++
if(index >= $boomTexts.length){
  clearInterval(clock)
}
}, 300)
}

fm.init()
footer.init()
