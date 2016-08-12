
require("javascript.util");
var devices = require('./../src/device');

var rate  = parseFloat(process.argv[2]) || 50;
var range = parseFloat(process.argv[3]) || 2;

var sensor = null;
var id = 'c9ee6389a176';


var ArrayList = javascript.util.ArrayList;
var Arrays = javascript.util.Arrays;


var lastError = 1;
var distanceBuffor  = new ArrayList();
var medianBuffor = new ArrayList();
var kalmanEstimation = 0;
var bufforSize = 6;

var lowerThreshold = 0.4;
var higherThreshold = 0.9;

// TODO : Retest the discovery with device.discoverById(id, callback)

devices.discover(function(device) {

    console.log('discovered device ', device.address, device.uuid);
    
    var led           = new device.Led(device);
    
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
       getProximity(-59, rssi);

       if(rssi < -75) device.disconnect();
    });
    
});

function calculateAccuracy(measuredPower, rssi) {
  
  //var txPower = -59 //hard coded power value. Usually ranges between -59 to -65
  
  return Math.pow(12.0, 1.5 * ((rssi / measuredPower) - 1));

  // if (rssi == 0) {
  //   return -1.0; 
  // }
 
  // var ratio = rssi*1.0/txPower;
  // if (ratio < 1.0) {
  //   return Math.pow(ratio,10);
  // }
  // else {
  //   var distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
  //   return distance;
  // }
}

function calculateProximity(accuracy) {

  var proximity;

      if (accuracy < 0) {
        proximity = 'unknown';
      } else if (accuracy < 0.5) {
        proximity = 'immediate';
      } else if (accuracy < 4.0) {
        proximity = 'near';
      } else {
        proximity = 'far';
      }
  
  return proximity;

}

function getMedian(arrayList) {
    var middle = arrayList.size()/2;
    if (arrayList.size() % 2 == 1) {
        return arrayList.get(middle);
    } else {
        return (arrayList.get(middle-1) + arrayList.get(middle)) / 2.0;
    }
}

function getProximity(measuredPower, rssi) {
        var result;

        var varianceSum = 0;
        var expectedDistance = 0;
        var tempDistance = calculateAccuracy(measuredPower, rssi);
        var proximity = calculateProximity(tempDistance);

        
        if (distanceBuffor.size() == bufforSize) {
            distanceBuffor.remove(distanceBuffor.get(0));
            //console.log('clean buffor');
        }
        
        distanceBuffor.add(tempDistance);

        if (proximity == 'immediate') {
            expectedDistance = 0.8625;
            lastError = 1;
            kalmanEstimation = 0;
        } else if (proximity == 'near') {
            expectedDistance = 1.75;
            lastError = 1;
            kalmanEstimation = 0;
        } else if (proximity == 'far') {
            expectedDistance = 2.625;
            lastError = 1;
            kalmanEstimation = 0;
        }

        for (var k = 0; k < distanceBuffor.size(); k++) {
            varianceSum = varianceSum + (distanceBuffor.get(k) - expectedDistance) * (distanceBuffor.get(k) - expectedDistance);
        }

        var variance = varianceSum / bufforSize;
        var standardDeviation = Math.sqrt(variance);

        var kalmanParameter = lastError / (lastError + standardDeviation);
        kalmanEstimation = kalmanEstimation + kalmanParameter * (tempDistance - kalmanEstimation);
        lastError = (1 - kalmanParameter) * lastError;

        if (medianBuffor.size() >= bufforSize) {
            medianBuffor.remove(medianBuffor.get(0));

        }

        medianBuffor.add(kalmanEstimation);
        var medianBufforSorted = new ArrayList();
        
        // for(var i = 0; i < medianBufforSorted.size(); i++) {
        //   medianBufforSorted.remove(i);  
        // }
        
        
        medianBufforSorted.addAll(medianBuffor);
        var arMedianBufforSorted = medianBufforSorted.toArray();
        javascript.util.Arrays.sort(arMedianBufforSorted);

        medianBufforSorted = javascript.util.Arrays.asList(arMedianBufforSorted);

        var median = getMedian(medianBufforSorted);

        

        if ( median < lowerThreshold) {
          result = 'immediate';
        } else if ( median < higherThreshold) {
          result = 'near';
        } else if ( median >= higherThreshold) {
          result = 'far';
        }

        if (result) {
          console.log('name : ', name, ' result: ', result);
        }

        return result;
}