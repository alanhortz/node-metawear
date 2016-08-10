
var devices = require('./../src/device');

var rate  = parseFloat(process.argv[2]) || 50;
var range = parseFloat(process.argv[3]) || 2;

var sensor = null;
var id = 'c9ee6389a176';


// TODO : Retest the discovery with device.discoverById(id, callback)

devices.discover(function(device) {

    console.log('discovered device ', device.address, device.uuid);

    device.connectAndSetup(function() {
        
        console.log('were connected!');
        console.log('Starting accelerometer with ' + rate + 'hz ang +-' + range + 'g');
        
        var accelerometer = new device.Accelerometer(device);
        var logger        = new device.Log(device);
        var switched = true;

        accelerometer.setOutputDataRate(rate);
        accelerometer.setAxisSamplingRange(range);
        logger.startLogging(false);

        accelerometer.setConfig();
        accelerometer.enableNotifications();
        accelerometer.enableAxisSampling();
        accelerometer.start();

        accelerometer.onChange(function(data) {
            console.log("x:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
        });

        setInterval(function() {
            if(device.connectedAndSetUp) {
                if(switched) {
                    accelerometer.stop();
                    switched = false;
                    device._peripheral.updateRssi();
                } else {
                    accelerometer.start();
                    switched = true;
                }
            }
        }, 1000);




    });

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
	process.exit();
    });

    device._peripheral.on('rssiUpdate', function (rssi){
       console.log(rssi);
       if(rssi < -75) device.disconnect();
    });
    
});

// var startDiscovering = function(id) {
// devices.discoverById(id, function(device) {
// //devices.discover(function(device) {
//     console.log('discovered device ', device.address, device.uuid);

//     device.on('disconnect', function() {
//         console.log('we got disconnected! :( ');
//         //startDiscovering(id);
//     });

//     device.connectAndSetup(function(error) {
//         console.log('were connected!');

  
//       console.log('Start accelerometer with ' + rate + 'hz ang +-' + range + 'g');

//         var accelerometer = new device.Accelerometer(device);
//         var logger        = new device.Log(device);
// 	var switched = true;

//         accelerometer.setOutputDataRate(rate);
//         accelerometer.setAxisSamplingRange(range);
//         logger.startLogging(false);

//         accelerometer.setConfig();
//         accelerometer.enableNotifications();
//         accelerometer.enableAxisSampling();
//         accelerometer.start();

//         accelerometer.onChange(function(data) {
//             console.log("x:", data.x, "\t\ty:", data.y, "\t\tz:", data.z);
//         });

// 	setInterval(function() {
// 	    if(device.connectedAndSetUp) {
// 	    	if(switched) {
//               	accelerometer.stop();
// 	      	switched = false;
// 	      	device._peripheral.updateRssi();	      
// 	    	} else {
// 	      	accelerometer.start();
// 	      	switched = true;
// 	    	}
// 	    }
// 	}, 1000);

//     });

//     device._peripheral.on('rssiUpdate', function (rssi){
//        console.log(rssi);
//        if(rssi < -75) device.disconnect();
//     });
// });
// };
// startDiscovering('c9ee6389a176');
