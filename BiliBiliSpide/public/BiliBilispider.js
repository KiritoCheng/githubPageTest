// /**
//  * Created by Kirito on 2017/2/16.
//  */

//function BiliBiliSpider() {
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://bangumi.bilibili.com/anime/0";

//初始url

function fetchPage(x, iStart, iTotal,client) {     //封装了一层函数
    startRequest(x, iStart, iTotal,client);
}


function startRequest(x, iStart, iTotal,client) {
    //采用http模块向服务器发起一次get请求
    http.get(x, function (res) {
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {

            var $ = cheerio.load(html); //采用cheerio模块解析html

            var title = $('.info-title').text().trim(),
                av = $('.info-title').data('seasonid'),
                tag = [],
                playNum = $('.info-count-item-play').find('em').text().trim(),
                fans = $('.info-count-item-fans').find('em').text().trim(),
                barrage = $('.info-count-item-review').find('em').text().trim(),
                playFirsrTime = $($('.info-update').find('span')[0]).text().trim(),
                playState = $($('.info-update').find('span')[1]).text().trim(),
                cv = $('.info-cv').text().trim().replace(/\s+/g, ""),
                desc = $('.info-desc').text().trim();

            $('.info-style-item').each(function () {
                tag.push($(this).text().trim())
            });
            if (av !== undefined) {
                var num = playNum;
                if (playNum == '-') {
                    playNum = 0;
                }
                if (barrage == '') {
                    barrage = 0;
                }
                var news_item = {
                    title: title,   //标题
                    av: av,     //番号
                    tag: tag.toString(),   //标签
                    playNum: playNum,   //播放次数
                    fans: fans,     //追番人数
                    barrage: barrage,   //弹幕总数
                    playFirsrTime: playFirsrTime,   //首映时间
                    playState: playState,       //播放状态
                    cv: cv,         //声优
                    desc: desc     //描述
                };
                savedContent($, client,news_item);
            }
            i = iStart + 1;
            var nextLink = "http://bangumi.bilibili.com/anime/" + i;
            var str = encodeURI(nextLink);
            if (i < iTotal) {
                fetchPage(str, i, iTotal,client)
            }
        });
    }).on('error', function (err) {
        console.log(err)
    });
}

function savedContent($, client,new_contnt) {

    client.query(
        'SELECT * FROM ' + TEST_TABLE,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                var userAddSql = 'INSERT INTO mytable(title,AV,target,playNum,fans,danmu,premiere,state,VA,info) VALUES(?,?,?,?,?,?,?,?,?,?)';
                new_contnt.playNum = (new_contnt.playNum == 0 ? 0 : new_contnt.playNum.indexOf('万') == new_contnt.playNum.length - 1 ? parseFloat(new_contnt.playNum) * 10000 : parseFloat(new_contnt.playNum));
                new_contnt.fans = (new_contnt.fans.indexOf('万') == new_contnt.fans.length - 1 ? parseFloat(new_contnt.fans) * 10000 : parseFloat(new_contnt.fans));
                var userAddSql_Params = [new_contnt.title, parseFloat(new_contnt.av), new_contnt.tag, new_contnt.playNum, new_contnt.fans, new_contnt.barrage,
                    new_contnt.playFirsrTime, new_contnt.playState, new_contnt.cv, new_contnt.desc];
                client.query(userAddSql, userAddSql_Params, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    console.log('-------INSERT----------');
                    // console.log('INSERT ID:', result);
                    // console.log('#######################');
                });
            }
        }
    );
}

var mysql = require('mysql');
var TEST_DATABASE = 'BiliBili';
var TEST_TABLE = 'mytable';
var client = mysql.createConnection({
    user: 'root',
    password: 'kirito'
});
client.connect();

client.query("use " + TEST_DATABASE);
client.query("truncate table " + TEST_TABLE);


var p = [];
for (var i = 0; i < 10000; i += 10) {
    (function (client) {
        p.push(new Promise((resolve, reject) => {
            fetchPage(url, i, i + 10,client)
            return resolve(true)
        }))
    })(client);
}
Promise.all(p).then(values => {
    console.log(values);
}, reason => {
    console.log(reason)
});




