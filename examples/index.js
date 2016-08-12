var spawn = require('child_process').spawn;


function launchChild() {
    var ls = spawn('node', ['accelerometer.js']);
    

    ls.stdout.on('data', function(data) {
      console.log('stdout:' + data);
    });

    ls.on('close', function(code) {
        console.log('child process exited with code ' + code);
        launchChild();
    });
}


launchChild();
launchChild();
