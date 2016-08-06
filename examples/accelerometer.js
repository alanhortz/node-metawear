
var devices = require('./../src/device');

var rate  = parseFloat(process.argv[2]) || 50;
var range = parseFloat(process.argv[3]) || 2;

var sensor = null;

devices.discoverById(id, function(device) {
    
    sensor = device;

    device.connectAndSetup(function() {
        console.log('connected and setup');
    });


    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
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
