/*
gravatar:
When your server receives a request sent to  [server url]/gravatarUrl/[email address] , it will accept an email address from the url, and respond with the corresponding Gravatar url.
calc:
This endpoint will take accept an arithmetic calculation in the URL, evaluate it, and then return the result.  It will take the form of two numbers with one operator in between them
count:
This endpoint will accept a sentence string, and then count up the letters, spaces, and words in that string.  This will be URI encoded (the spaces will be %20s).  To decode it, use decodeURI(). Your server should return an object with all of the required counts.  This object will need to be stringified.
*/

var fs = require("fs"),
    http = require("http"),
    request = require('request'),
    url = require('url'),
    exec = require("child_process").exec,
    md5 = require('MD5');

http.createServer(responseHandler).listen(8888);

function responseHandler(req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  if (req.url.match("fav")) {
    res.end("");
    return;
  }
  else if (req.url === "/") {
    res.write()
  }
  else if (req.url.match("/gravatar/")) {
    var hash = '';
    hash= md5(req.url.match(/gravatar\/(.*)/)[1] || '');
    res.write("http://www.gravatar.com/avatar/" + hash);
  }
  else if (req.url.match("/Calc/")) {
    var equation = req.url.match(/Calc\/(.*)/)[1].toString().split(/[^0-9]/);
    var operator = req.url.match(/Calc\/(.*)/)[1].toString().match(/[^0-9]/)[0];
    console.log(equation, operator);
    var operate = function(opr) {
      return {
        '+' : function (a, b) { return a + b },
        '-' : function (a, b) { return a - b },
        '*' : function (a, b) { return a * b },
        '/' : function (a, b) { return a / b }
      }[opr];
    };
    var result = operate(operator)(parseInt(equation[0]), parseInt(equation[1]));
    res.write(JSON.stringify(result));
  }
  else if (req.url.match("/Counts/")) {
    wordCount = {
      words: 0,
      letters: 0,
      spaces: 0
    };
    var total = decodeURI(req.url).match(/Counts\/(.*)/)[1];
    wordCount.words = total.match(/(\w+)/g).length;
    console.log();
    wordCount.letters = total.match(/(\w)/g).length;
    console.log(total.match(/(\s)/g).length);
    wordCount.spaces = req.url.match(/Counts\/(.*)/)[1].match(/%20/g).length;
    res.write(JSON.stringify(wordCount));
  }
  res.end();
}
