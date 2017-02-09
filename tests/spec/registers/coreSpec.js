var EulerAngle = require('../../../src/registers/core').EulerAngle;

describe('Core module', function() {
	describe('EulerAngle.isEqual', function() {
		it('should compare this instance with another EulerAngle instance for their relative closeness regarding a 0.001 tolerance', function() {
			var ea1 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
			var ea2 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
			var ea3 = new EulerAngle(24.746, -120.862, 24.747, -33.046);
			var ea4 = new EulerAngle(24.722, -120.862, 24.747, -33.046);

			expect(ea1.isEqual(ea2)).toBe(true);
			expect(ea1.isEqual(ea3)).toBe(true);
			expect(ea1.isEqual(ea4)).toBe(false);
		});
	});
});