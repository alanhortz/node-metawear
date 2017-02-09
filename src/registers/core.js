/**
* Core module
* @module registers/core
* @author Alan Hortz [alan@handson.io]
*/

var Core = {};

Core.isClose = function(fst, snd) {
		return Math.abs(fst - snd) <= Math.max( 0.001 * Math.max(Math.abs(fst), Math.abs(snd)), 0.001 );
};

Core.CartesianFloat = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

Core.CartesianFloat.prototype.isEqual = function(cartesianFloat) {
	return Core.isClose(this.x, cartesianFloat.x) && Core.isClose(this.y, cartesianFloat.y) && Core.isClose(this.z, cartesianFloat.z);
};

Core.CorrectedCartesianFloat = function(x, y, z, accuracy) {
	var that = new Core.CartesianFloat(x, y, z);
	that.accuracy = accuracy;
	return that;
};

Core.CorrectedCartesianFloat.prototype.isEqual = function(correctedCartesianFloat) {
	return this.isEqual(correctedCartesianFloat) && (this.accuracy === correctedCartesianFloat.accuracy);
};

Core.Quaternion = function(w, x, y, z) {
	this.w = w;
	this.x = x;
	this.y = y;
	this.z = z;
};

Core.Quaternion.prototype.isEqual = function(quaternion) {
	return Core.isClose(this.w, quaternion.w) && Core.isClose(this.x, quaternion.x) && Core.isClose(this.y, quaternion.y) && Core.isClose(this.z, quaternion.z);
};

/**
* @summary Represent an EurlerAngle
* @class
*
* @param {!number} heading - The direction in which the device is pointing
* @param {!number} pitch - The Y intrinsic rotation axis
* @param {!number} roll - The X intrinsic rotation axis
* @param {!number} yaw - The Z intrinsic rotation axis
*/

Core.EulerAngle = function(heading, pitch, roll, yaw) {
	this.heading = heading;
	this.pitch = pitch;
	this.roll = roll;
	this.yaw = yaw;
};

/**
* @summary 	Compares this instance with another instance of an EulerAngle object regarding their relative closeness 
*			whith a tolerance of 0.001
* @function isEqual
* @param {EulerAngle} - An instance of an EulerAngle object
*/

Core.EulerAngle.prototype.isEqual = function(eulerAngle) {
	return Core.isClose(this.heading, eulerAngle.heading) && Core.isClose(this.pitch, eulerAngle.pitch) && Core.isClose(this.roll, eulerAngle.roll) && Core.isClose(this.yaw, eulerAngle.yaw);
};

module.exports = Core;