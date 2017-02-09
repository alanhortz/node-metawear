/* jshint esversion: 6 */

var devices = require('./../src/device');

devices.discover(function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        
        const EULER_ANGLES = 0x8;
        const DATA_EULER_ANGLE = 0x4;
        const MODE_NDOF = 0x1;

        var sensorFusion = new device.SensorFusion(device);
        
        sensorFusion.config.setMode(MODE_NDOF);
        sensorFusion.subscribe(EULER_ANGLES);
        sensorFusion.enableData(DATA_EULER_ANGLE);
        sensorFusion.start();

        sensorFusion.onChange(function(data) {
            console.log("heading", data.heading,  "\t\tpitch:", data.pitch, "\t\tyaw:", data.yaw, "\t\troll:", data.roll);
        });
    });
});
