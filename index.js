'use strict';

let Router = module.exports = require('koa-router');

let FILE_TEMP_KEY = '__is__file__';

let methods = 'get,put,post,del,delete,options,head,trace'.split(',');

Router.prototype.load = function(folder, prefix){
    prefix = prefix || '';
    let resources = require('require-all')({
            dirname   : folder,
            //filter    : /\.js$/,
            recursive : true,
            resolve: function(resource){
                resource[FILE_TEMP_KEY] = true;
                return resource;
            }
        });
        resources = flat(resources, {});

    for(let key in resources){
        let res = resources[key];
        //允许通过设置`exports.path = null;`忽略某些文件
        if(res.path === null) continue;
        key = res.path || key;
        for(let method in res){
            //忽略非标准HTTP method的函数
            if(methods.indexOf(method) === -1) continue;
            let path = require('path').normalize(`${prefix}/${key}`);
            let func = res[method];
            //使用koa router加载资源
            this[method](path, func);
        }
    }

    return this;
};

/*
 * 将资源树拍平，成 key-value 结构
 */
function flat(tree, map, path){
    path = path || '';
    for(let key in tree){
        let res = tree[key];
        //如果是文件
        if(res[FILE_TEMP_KEY]){
            //如果是index.js
            if(key === 'index'){
                map[path] = res;
            }else{
                map[`${path}/${key}`] = res;
            }
        }
        //如果是文件夹，递归遍历
        else{
            flat(res, map, `${path}/${key}`);
        }
    }
    return map;
}
