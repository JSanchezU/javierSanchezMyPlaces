var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var uniqid = require('uniqid');
var port = 3000;
var localhost = 'localhost';

var server = http.createServer(function (request, response) {

    var parseUrl = url.parse(request.url, true);
    var path = parseUrl.pathname;
    
    path = path.replace(/^\/+|\/+$/g, '');
    var method = request.method;

    var query = parseUrl.query;
    var key = query.query;
    var headers = request.headers;

    var buffer = '';
    let data = [];

    switch (path) {
        case 'data':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                    break;
                case 'GET':
                    getDatas (request, response);
                    break;
                case 'POST':
                    postData(request, response);
                    break;
                default:
                    send404 ( request, response);
                    break;

            }
            break;
        case 'categories':
            switch (method) {
                case 'OPTIONS':
                    respondToOptions(request, response);
                    break;
                case 'GET':
                    getDatas (request, response);
                    break;
                case 'POST':
                    saveData(request, response);
                    break;
                default:
                    send404 ( request, response);
                    break;

            }
            break;
            
        default:
            console.log('Resquest no process');
            send404 ( request, response);
            break;
    }

});



server.listen(port, localhost, function () {
    console.log('el servidor esta corriendo');
});

function loadDatas(){
    return new Promise(function (resolve, reject){
        fs.readFile(path.resolve(process.cwd(), './data/posts.json'), function(err,data){
            if (err){
                reject(null);
            } else {
                var posts = JSON.parse(data);
                resolve(posts);
            }
        })
    });
}

function saveDatas(posts){
    return new Promise(function (resolve, reject){
        fs.writeFile(path.resolve(process.cwd(), './data/posts.json'), JSON.stringify(posts), function(err){
            if (err){
                reject();
            } else {
                resolve();
            }
        })
    });
}

function getData (request, response){
    addCrossHeaders(request, response);
    
    loadDatas().then(resolve).catch(reject);

    function resolve(posts){
        response.writeHead(200,{
            'Content-Type':'application/json'
        })
        response.write(JSON.stringify(posts));
        response.end();
    }

    function reject (){
        send404(request, response)
    }
}

function postData (request, response){

    addCrossHeaders(request, response);
    
    let buffer = [];
    let post = null;

    request.on('data', function (chunk){
        console.log(chunk);
        buffer.push(chunk);
    });

    request.on('end', function (){
        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);
        console.log(post);

        loadDatas().then(function (posts){
            posts[uniqid()] = post;
            saveDatas(posts).then(function () {
                response.writeHead(200);
                response.end();
            }).catch(function (){
                send404(request, response);
            });
        }).catch(function (){
            send404(request, response);
        });
    });
}



//categories

function saveCategories(posts){
    return new Promise(function (resolve, reject){
        fs.writeFile(path.resolve(process.cwd(), './data/posts.json'), JSON.stringify(posts), function(err){
            if (err){
                reject();
            } else {
                resolve();
            }
        })
    });
}

function getCategories (request, response){
    addCrossHeaders(request, response);
    
    loadDatas().then(resolve).catch(reject);

    function resolve(posts){
        response.writeHead(200,{
            'Content-Type':'application/json'
        })
        response.write(JSON.stringify(posts));
        response.end();
    }

    function reject (){
        send404(request, response)
    }
}

function postCategories (request, response){

    addCrossHeaders(request, response);
    
    let buffer = [];
    let post = null;

    request.on('data', function (chunk){
        console.log(chunk);
        buffer.push(chunk);
    });

    request.on('end', function (){
        buffer = Buffer.concat(buffer).toString();
        post = JSON.parse(buffer);
        console.log(post);

        loadDatas().then(function (posts){
            posts[uniqid()] = post;
            saveDatas(posts).then(function () {
                response.writeHead(200);
                response.end();
            }).catch(function (){
                send404(request, response);
            });
        }).catch(function (){
            send404(request, response);
        });
    });
}



function respondToOptions(request, response){
    addCrossHeaders(request, response);
    response.writeHead(200);
    response.end();
}

function addCrossHeaders(request, response){
    var origin = "*";

    if (request.headers['origin']) {
        origin = request.headers['origin'];
    }

    if (request.headers['content-type']) {
        response.setHeader('Content-Type', request.headers['content-type']);
    }
    response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, PATCH, POST, DELETE');

    response.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Content-Type');
}

function send404(request, response) {

    addCrossHeaders(request, response);

    response.writeHead(404, {
        'Content-Type': 'applicacion/json'
    });
    response.end();
}


function getDatas (request, response){

    addCrossHeaders(request, response);
    
    loadDatas().then(resolve).catch(reject);

    function resolve(posts){
        response.writeHead(200,{
            'Content-Type':'application/json'
        })
        response.write(JSON.stringify(posts));
        response.end();
    }

    function reject (){
        send404(request, response)
    }
}

function getCategories (request, response){

    addCrossHeaders(request, response);
    
    loadDatas().then(resolve).catch(reject);

    function resolve(posts){
        response.writeHead(200,{
            'Content-Type':'application/json'
        })
        response.write(JSON.stringify(posts));
        response.end();
    }

    function reject (){
        send404(request, response)
    }
}


