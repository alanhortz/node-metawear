var spawn = require('child_process').spawn;


function launchChild(id) {
    var ls = spawn('node', ['accelerometer.js', id]);
    

    ls.stdout.on('data', function(data) {
      console.log('stdout:' + data);
    });

    ls.on('close', function(code) {
        console.log('child process exited with code ' + code);
        launchChild();
    });
}

launchChild('c9:ee:63:89:a1:76');
launchChild('fb:b6:e4:41:83:5e');

