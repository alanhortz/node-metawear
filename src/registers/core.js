/**
* @module registers/core
*/

/**
* @summary 	Compares two numbers regarding their relative closeness 
*			whith a tolerance of 0.001 (1&#8240;)
* @param {!number} - The first number
* @param {!number} - The second number
* @returns {boolean} 
*/

var isClose = function(fst, snd) {
		return Math.abs(fst - snd) <= Math.max( 0.001 * Math.max(Math.abs(fst), Math.abs(snd)), 0.001 );
};

var CartesianFloat = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

CartesianFloat.prototype.isEqual = function(cartesianFloat) {
	return Core.isClose(this.x, cartesianFloat.x) && Core.isClose(this.y, cartesianFloat.y) && Core.isClose(this.z, cartesianFloat.z);
};

CorrectedCartesianFloat = function(x, y, z, accuracy) {
	var that = new Core.CartesianFloat(x, y, z);
	that.accuracy = accuracy;
	return that;
};

CorrectedCartesianFloat.prototype.isEqual = function(correctedCartesianFloat) {
	return this.isEqual(correctedCartesianFloat) && (this.accuracy === correctedCartesianFloat.accuracy);
};

/**
* @summary Represents a Quaternion
* @class
*
* @param {!number} w - w coordinate
* @param {!number} x - x coordinate
* @param {!number} y - y coordinate
* @param {!number} z - z coordinate
* @example 
* new Quaternion(0.940, -0.050, -0.154, -0.301);
*/

var Quaternion = function(w, x, y, z) {
	this.w = w;
	this.x = x;
	this.y = y;
	this.z = z;
};

/**
* @summary 	Compares this instance with another instance of a Quaternion object regarding their relative closeness 
*			whith a tolerance of 0.001 (1&#8240;)
* @param {Quaternion} - An instance of a Quaternion object
* @returns {boolean} 
*/

Quaternion.prototype.isEqual = function(quaternion) {
	return isClose(this.w, quaternion.w) && isClose(this.x, quaternion.x) && isClose(this.y, quaternion.y) && isClose(this.z, quaternion.z);
};

/**
* @summary Represents an EurlerAngle
* @class
*
* @param {!number} heading - The direction in which the device is pointing
* @param {!number} pitch - The Y intrinsic rotation axis
* @param {!number} yaw - The Z intrinsic rotation axis
* @param {!number} roll - The X intrinsic rotation axis
* @example
* new EulerAngle(24.747, -120.862, 24.747, -33.046)
*/

var EulerAngle = function(heading, pitch, yaw, roll) {
	this.heading = heading;
	this.pitch = pitch;
	this.yaw = yaw;
	this.roll = roll;
};

/**
* @summary 	Compares this instance with another instance of an EulerAngle object regarding their relative closeness 
*			whith a tolerance of 0.001 (1&#8240;)
* @param {EulerAngle} - An instance of an EulerAngle object
* @returns {boolean} 
* @example 
* var ea1 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
* var ea2 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
* var ea3 = new EulerAngle(24.746, -120.862, 24.747, -33.046);
* var ea4 = new EulerAngle(24.722, -120.862, 24.747, -33.046);
*
* ea1.isEqual(ea2); //true
* ea1.isEqual(ea3); //true
* ea1.isEqual(ea4); //false 
*/

EulerAngle.prototype.isEqual = function(eulerAngle) {
	return isClose(this.heading, eulerAngle.heading) && isClose(this.pitch, eulerAngle.pitch) && isClose(this.yaw, eulerAngle.yaw) && isClose(this.roll, eulerAngle.roll);
};

exports.Quaternion = Quaternion;
exports.EulerAngle = EulerAngle;
