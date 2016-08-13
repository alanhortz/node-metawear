var spawn = require('child_process').spawn;


function launchChild(id) {
    var ls = spawn('node', ['accelerometer.js', id]);
    

    ls.stdout.on('data', function(data) {
      console.log('stdout:' + data);
    });

    ls.on('close', function(code) {
        console.log('child process exited with code ' + code);
        launchChild(id);
    });
}

launchChild('c9ee6389a176');
launchChild('fbb6e441835e');

