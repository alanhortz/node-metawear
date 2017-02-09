/* jshint esversion: 6 */

/*
	This specification has been build based on the python test
	suite located at https://github.com/mbientlab/Metawear-CppAPI/blob/master/test/test_sensor_fusion.py
*/

var SensorFusion = require('../../../src/registers/sensorFusion'),
	SensorFusionConfig = require('../../../src/registers/config/sensorFusion'),
	Device = require('../helpers/device'),
	Core = require('../../../src/registers/core'),
	bufferEqual = require('buffer-equal'),
	clone = require('clone');


const	MODULE_OPCODE = 0x19;

const 	MODE_SLEEP = 0x0,
		MODE_NDOF = 0x1,
		MODE_IMU_PLUS = 0x2,
		MODE_COMPASS = 0x3,
		MODE_M4G = 0x4;

const	ACC_RANGE_2G = 0x0,
		ACC_RANGE_4G = 0x1,
		ACC_RANGE_8G = 0x2,
		ACC_RANGE_16G = 0x3;

const	GYRO_RANGE_2000DPS = 0x0,
		GYRO_RANGE_1000DPS = 0x1,
		GYRO_RANGE_500DPS = 0x2,
		GYRO_RANGE_250DPS = 0x3;

const	ENABLE= 0x1,
		MODE= 0x2,
		OUTPUT_ENABLE= 0x3,
		CORRECTED_ACC= 0x4,
		CORRECTED_GYRO= 0x5,
		CORRECTED_MAG= 0x6,
		QUATERNION= 0x7,
		EULER_ANGLES= 0x8,
		GRAVITY_VECTOR= 0x9,
		LINEAR_ACC= 0xa;

/* Data sources */

const	DATA_CORRECTED_ACC = 0,
		DATA_CORRECTED_GYRO = 1,
		DATA_CORRECTED_MAG = 2,
		DATA_QUATERION = 3,
		DATA_EULER_ANGLE = 4,
		DATA_GRAVITY_VECTOR = 5,
		DATA_LINEAR_ACC = 6;

const	acc_ranges = [
			ACC_RANGE_2G, 
			ACC_RANGE_4G, 
			ACC_RANGE_8G, 
			ACC_RANGE_16G
		];

const	rot_ranges = [
			GYRO_RANGE_2000DPS, 
			GYRO_RANGE_1000DPS, 
			GYRO_RANGE_500DPS, 
			GYRO_RANGE_250DPS
		];

const 	config_masks = [
        	[0x10, 0x11, 0x12, 0x13],
        	[0x20, 0x21, 0x22, 0x23],
        	[0x30, 0x31, 0x32, 0x33],
        	[0x40, 0x41, 0x42, 0x43]
    	];

 const bmi160_acc_range_bitmask = [ 0x3, 0x5, 0x8, 0xc ];
 const bmi160_rot_range_bitmask = [ 0x0, 0x1, 0x2, 0x3, 0x4 ];

const tests_output = [
	{
		'expected': new Core.Quaternion(0.940, -0.050, -0.154, -0.301),
		'response': new Buffer([0x1b,0x9b,0x70,0x3f,0x8c,0x5e,0x4d,0xbd,0x07,0x7f,0x1d,0xbe,0x78,0x02,0x9a,0xbe]),
		'data': QUATERNION
	},
    {
        'expected' : new Core.EulerAngle(24.747, -120.862, 24.747, -33.046),
        'response' : new Buffer([0xb1,0xf9,0xc5,0x41,0x44,0xb9,0xf1,0xc2,0x1a,0x2f,0x04,0xc2,0xb1,0xf9,0xc5,0x41]),
        'data' : EULER_ANGLE
    }	
];

const data_sources = [
		DATA_CORRECTED_ACC,
		DATA_CORRECTED_GYRO,
		DATA_CORRECTED_MAG,
		DATA_QUATERION,
		DATA_EULER_ANGLE,
		DATA_GRAVITY_VECTOR,
		DATA_LINEAR_ACC
];

/* The 'enable' property indexes the 'expected_start's item to mask in order to indicates the fusion's data_source */

const test_bases = [
	{
		'enable': 6,
		'mode': MODE_NDOF,
		'name': 'ndof',
		'expected_start': [
			new Buffer([0x03, 0x02, 0x01, 0x00]),
			new Buffer([0x13, 0x02, 0x01, 0x00]),
			new Buffer([0x15, 0x02, 0x01, 0x00]),
			new Buffer([0x03, 0x01, 0x01]),
			new Buffer([0x13, 0x01, 0x01]),
			new Buffer([0x15, 0x01, 0x01]),
			new Buffer([0x19, 0x03, 0x00, 0x00]),
			new Buffer([0x19, 0x01, 0x01])
		],
		'expected_stop': [
			new Buffer([0x19, 0x01, 0x00]),
			new Buffer([0x19, 0x03, 0x00, 0x7f]),
			new Buffer([0x03, 0x01, 0x00]),
			new Buffer([0x13, 0x01, 0x00]),
			new Buffer([0x15, 0x01, 0x00]),
			new Buffer([0x03, 0x02, 0x00, 0x01]),
			new Buffer([0x13, 0x02, 0x00, 0x01]),
			new Buffer([0x15, 0x02, 0x00, 0x01])
		]
	}
];

describe('SensorFusion - Metawear Motion R Board', function() {
	var device = new Device(),
     	sensorFusion;

	beforeAll(function() {
		spyOn(device, 'send').and.callThrough();
		jasmine.addCustomEqualityTester(bufferEqual);
	});

	beforeEach(function() {
		device.reset();
		device.send.calls.reset();
		sensorFusion = new SensorFusion(device);
	});

	describe('Configuration', function() {

		var queue_tests = [];
		var configureAlgorithm; 

		beforeAll(function() {
			for(var i = 0; i < acc_ranges.length; i++) {
				for(var j = 0; j< rot_ranges.length; j++) {
					queue_tests.push({
                    	'acc_range': acc_ranges[i],
                    	'gyro_range': rot_ranges[j]
                	});
				}
			}
			configureAlgorithm = function(mode, acc_range, gyro_range) {
				sensorFusion.config.setMode(mode);
				sensorFusion.config.setAccRange(acc_range);
				sensorFusion.config.setGyroRange(gyro_range);
				sensorFusion.writeConfig();
			};
		});

		it('should be in sleep mode by default', function() {
			expect(sensorFusion.config.mode).toEqual(MODE_SLEEP);
		});

		it('should be configured with a 16G accelerometer range  by default', function() {
			expect(sensorFusion.config.acc_range).toEqual(ACC_RANGE_16G);
		});

		it('should be configured with a 2000 DPS (degrees per second °/s) gyroscope range  by default', function() {
			expect(sensorFusion.config.gyro_range).toEqual(GYRO_RANGE_2000DPS);
		});		

		describe('writeConfig() for a configured NDOF mode', function() {
			
			it('should properly send the NDOF mode, accelerometer and gyroscope range to the device', function() {
				for (var i = 0; i < queue_tests.length; i++) {
					configureAlgorithm(MODE_NDOF, queue_tests[i].acc_range, queue_tests[i].gyro_range);
					expect(device.send).toHaveBeenCalled();
					expect(device.buffers[0]).toEqual(new Buffer([0x19, 0x02, MODE_NDOF, config_masks[queue_tests[i].gyro_range][queue_tests[i].acc_range]]));
					expect(device.buffers[1]).toEqual(new Buffer([0x03, 0x03, 0x28, bmi160_acc_range_bitmask[queue_tests[i].acc_range]]));
					expect(device.buffers[2]).toEqual(new Buffer([0x13, 0x03, 0x28, bmi160_rot_range_bitmask[queue_tests[i].gyro_range]]));
					expect(device.buffers[3]).toEqual(new Buffer([0x15, 0x04, 0x04, 0x0e]));
					expect(device.buffers[4]).toEqual(new Buffer([0x15, 0x03, 0x6]));
					device.reset();
				}
			});

		});
		describe('setMode(mode)', function() {
			it('should properly set the mode', function() {
				sensorFusion.config.setMode(SensorFusionConfig.MODE.M4G);
				expect(sensorFusion.config.mode).toEqual(MODE_M4G);
			});
		});
		describe('setAccRange(acc_range)', function() {
			it('should properly set the accelerometer range', function() {
				sensorFusion.config.setAccRange(SensorFusionConfig.ACC_RANGE.AR_2G);
				expect(sensorFusion.config.acc_range).toEqual(ACC_RANGE_2G);
			});
		});
		describe('setGyroRange(gyro_range)', function() {
			it('should properly set the gyroscope range', function() {
				sensorFusion.config.setGyroRange(SensorFusionConfig.GYRO_RANGE.GR_250DPS);
				expect(sensorFusion.config.gyro_range).toEqual(GYRO_RANGE_250DPS);
			});
		});
	});

	describe('onChange listener', function() {

		var foo = {};

		beforeAll(function() {
			foo.callback =  function(data) { return data;};
			spyOn(foo,'callback').and.callThrough();
			sensorFusion.onChange(foo.callback);
		});

		//TODO : Implement every data type extraction
		xit('should properly extract any data type and execute the registered callback', function() {});

		it('should properly extract QUATERNION data type and execute the registered callback', function() {
			for(var i = 0; i < tests_output.length; i++) {
				device.emitter.emit([MODULE_OPCODE, tests_output[i].data], tests_output[i].response, MODULE_OPCODE.toString(16), tests_output[i].data.toString(32));
				expect(foo.callback.calls.argsFor(0)[0].isEqual(tests_output[i].expected)).toBe(true);
				foo.callback.calls.reset();
			}
		});
	});

	describe('NDOF mode', function() {
		var tests = [];

		beforeAll(function() {
			for(var i=0; i<test_bases.length; i++) {
				for(var j=0; j<data_sources.length; j++) {
					var test = clone(test_bases[i], false); // deep copy with no circular refs
					test.expected_start[test.enable][2] |= (0x1 << data_sources[j]);
					test.source = data_sources[j];
					tests.push(test);
				}
			}
		});

		describe('start()', function() {
			
			//TODO 
			xit('should enable [accelerometer, gyroscope, magnetometer] sampling, start the sensors and enable the NDOF fusion for [any type of output]', function() {});
			
			it('should enable [accelerometer, gyroscope, magnetometer] sampling, start the sensors and enable the NDOF fusion for [QUATERNION output type]', function() {
				for(var i = 0; i< tests.length; i++) {
					sensorFusion.config.setMode(tests[i].mode);
					sensorFusion.enableData(tests[i].source);
					sensorFusion.start();
					expect(device.send).toHaveBeenCalled();

					for(var j=0; j<device.buffers.length; j++) {
						expect(device.buffers[j]).toEqual(new Buffer(tests[i].expected_start[j]));	
					}
					device.reset();
				}
			});
		});

		describe('stop()', function() {

			// TODO
			xit('should disable the NDOF fusion for [any type of output], stop the sensors and disable the [accelerometer, gyroscope, magnetometer] sampling', function() {});

			it('should disable the NDOF fusion for [QUATERNION output type], stop the sensors and disable the [accelerometer, gyroscope, magnetometer] sampling', function() {
				for(var i = 0; i< tests.length; i++) {
					sensorFusion.stop();
					expect(device.send).toHaveBeenCalled();
					device.reset();
				}
			});
		});
	});

});