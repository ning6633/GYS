/*
 * @Author: jiwei 
 * @Date: 2019-03-29 15:22:33 
 * @Last Modified by: jiwei
 * @Last Modified time: 2019-03-29 15:48:22
 */

var loaderUtils = require('loader-utils');
var fs = require("fs");
var path = require("path");
// 兼容XP中 asp-os/asp-img问题
module.exports = function (source) {
    var newsource = source;
    var repsource = newsource.replace(/(asp-os:\/\/)/ig, '/app/browser/');
    var retsource = repsource.replace(/(asp-img:)(\/\/(appicon|useravatar|cloudfile|fileicon)\/)/ig, 'http://api.bjsasc.com/aspfile/file/1.0/files/');
    return retsource;
};