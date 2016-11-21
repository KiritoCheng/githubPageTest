/**
 * Created by Kirito on 2016/11/22.
 */

var srtCanRun = true;
window.onload = function () {
    $('body').fadeIn(350);
    var scroll = document.getElementsByClassName("scroll")[0];  //ie不兼容，换成id会成功
    var panel = document.getElementsByClassName("panel");   //ie不兼容，换成id会成功

    var clientH = window.innerHeight;
    scroll.style.height = clientH + "px";
    for (var i = 0; i < panel.length; i++) {
        panel[i].style.height = clientH + "px";
    }
    /*下面是关于鼠标滚动*/
    var inputC = document.getElementsByTagName("input");
    var wheel = function (event) {
        var delta = 0;
        if (!event)//for ie
            event = window.event;
        if (event.wheelDelta) {//ie,opera
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta) {
            handle(delta, inputC);
        }
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    };
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = wheel;
    if (localStorage.leaveworld != '' && localStorage.leaveworld !== undefined) {
        $('#leaveWordDiv').html('<p>' + localStorage.leaveworld + '</p>')
    }
};

function handle(delta, arr) {
    var num;
    for (var i = 0; i < arr.length; i++) {  //得到当前checked元素的下标
        if (arr[i].checked) {
            num = i;
        }
    }
    if (num == 2) {
        if (srtCanRun) {
            strt();
        }
    }
    if (delta > 0 && num > 0) {     //向上滚动
        num--;
        arr[num].checked = true;
    } else if (delta < 0 && num < 4) {  //向下滚动
        num++;
        arr[num].checked = true;
    }
}

function leaveWord() {
    var leaveWord = $('#leaveWord').val();
    if (leaveWord.indexOf('智障') >= 0) {
        $('#zhizhang').html('说了别骂我智障[掀桌]').fadeIn(350);
        return;
    }
    if (leaveWord == '') {
        $('#zhizhang').html('输入内容再点击').fadeIn(350);
        return;
    }
    localStorage.leaveworld = leaveWord;
    $('#leaveWordDiv').html('<p>' + localStorage.leaveworld + '</p>')
    $('#huaji').slideDown(350)
}

var offsetX = $("#loveHeart").width() / 2;
var offsetY = $("#loveHeart").height() / 2 - 55;
var together = new Date();
together.setFullYear(1995, 11, 23);
together.setHours(0);
together.setMinutes(0);
together.setSeconds(0);
together.setMilliseconds(0);

//love start
function strt() {
    if (!document.createElement('canvas').getContext) {
        var msg = document.createElement("div");
        msg.id = "errorMsg";
        msg.innerHTML = "Your browser doesn't support HTML5!<br/>Recommend use Chrome 14+/IE 9+/Firefox 7+/Safari 4+";
        document.body.appendChild(msg);
        $("#code").css("display", "none");
        document.execCommand("stop");
    } else {
        setTimeout(function () {
            startHeartAnimation();
        }, 5000);

        timeElapse(together);
        setInterval(function () {
            timeElapse(together);
        }, 500);

        adjustCodePosition();
        $("#code").typewriter();
    }
    srtCanRun = false;
}
//播放
function playmusic(me) {
    $('embed').css('display', 'block');
    $(me).fadeOut(350);
    $('#danInfo').html('你打破神蛋了！ლ(╹◡╹ლ)，从此一个美丽的生命诞生于此！').fadeIn(350)
    $('#danInfo').animate({top: '40px'}, 350, function () {
        $('#caret').fadeIn(350)
    });
}