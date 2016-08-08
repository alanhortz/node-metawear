const spawn = require('child_process').spawn;


function launchChild() {
    var ls = spawn('node', ['accelerometer.js']);
    
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        launchChild();
    });
};


launchChild();