//Creating a node module from scratch.


exports.getDate = function(){//getDate will be bounded to this fn. chech 6 ways to declare js fns.
var today = new Date();
    //Next two lines are copied from stack overflow.(formatting date in js)
    //( Format: Saturday, September 17, 2016)
    //Check other formats in stack overflow.
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}


exports.getDay = function(){
    var today = new Date();
    //Next two lines are copied from stack overflow.(formatting date in js)
    //( Format: Saturday, September 17, 2016)
    //Check other formats in stack overflow.
    var options = { weekday: 'long' };
    return today.toLocaleDateString('en-US', options);
}

