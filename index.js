'use strict';

let Router = module.exports = require('koa-router');

let FILE_TEMP_KEY = '__is__file__';

let methods = 'get,put,post,del,delete'.split(',');

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
        key = res.path || key;
        for(var method in res){
            if(methods.indexOf(method) === -1) continue;
            let path = require('path').normalize(`${prefix}/${key}`);
            let func = res[method];
            this[method](path, func);
            console.log(this);
            console.log(method);
            console.log(path);
        }
    }
};

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
