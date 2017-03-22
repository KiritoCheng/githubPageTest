/**
 * Created by Kirito on 2017/2/27.
 */

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 1050600;
var url = "http://www.xxbiquge.com/1_1413/1050330.html";
//初始url

function fetchPage(x) {     //封装了一层函数
    startRequest(x);
}


function startRequest(x) {
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

            var text = $('#content').text().trim();
            if (text != '') {
                var news_item = {
                    text: text,   //标题
                };
                console.log(news_item);
                savedContent($, news_item);
            }
            i = i + 1;
            var nextLink = "http://www.xxbiquge.com/1_1413/" + i + '.html';
            var str = encodeURI(nextLink);
            if (i < 1052330) {
                fetchPage(str)
            }
        });
    }).on('error', function (err) {
        console.log(err)
    });
}
function savedContent($, new_contnt) {
    var mysql = require('mysql');
    var TEST_DATABASE = 'BiliBili';
    var TEST_TABLE = 'dp';
    var client = mysql.createConnection({
        user: 'root',
        password: 'kirito'
    });
    client.connect();
    client.query("use " + TEST_DATABASE);
    client.query(
        'SELECT * FROM ' + TEST_TABLE,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                var userAddSql = 'INSERT INTO dp(text) VALUES(?)';
                new_contnt.text = (new_contnt.text);
                var userAddSql_Params = [new_contnt.text];
                client.query(userAddSql, userAddSql_Params, function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    console.log('-------INSERT----------');
                    console.log('INSERT ID:', result);
                    console.log('#######################');
                });
            }
            client.end();
        }
    );
}

fetchPage(url);