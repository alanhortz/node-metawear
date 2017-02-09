<a name="module_registers/core"></a>

## registers/core

* [registers/core](#module_registers/core)
    * [~Quaternion](#module_registers/core..Quaternion)
        * [new Quaternion(w, x, y, z)](#new_module_registers/core..Quaternion_new)
        * [.isEqual(quaternion)](#module_registers/core..Quaternion+isEqual) ⇒ <code>boolean</code>
    * [~EulerAngle](#module_registers/core..EulerAngle)
        * [new EulerAngle(heading, pitch, yaw, roll)](#new_module_registers/core..EulerAngle_new)
        * [.isEqual(eulerAngle)](#module_registers/core..EulerAngle+isEqual) ⇒ <code>boolean</code>
    * [~isClose()](#module_registers/core..isClose) ⇒ <code>boolean</code>

<a name="module_registers/core..Quaternion"></a>

### registers/core~Quaternion
**Kind**: inner class of <code>[registers/core](#module_registers/core)</code>  
**Summary**: Represents a Quaternion  

* [~Quaternion](#module_registers/core..Quaternion)
    * [new Quaternion(w, x, y, z)](#new_module_registers/core..Quaternion_new)
    * [.isEqual(quaternion)](#module_registers/core..Quaternion+isEqual) ⇒ <code>boolean</code>

<a name="new_module_registers/core..Quaternion_new"></a>

#### new Quaternion(w, x, y, z)

| Param | Type | Description |
| --- | --- | --- |
| w | <code>number</code> | w coordinate |
| x | <code>number</code> | x coordinate |
| y | <code>number</code> | y coordinate |
| z | <code>number</code> | z coordinate |

**Example**  
```js
new Quaternion(0.940, -0.050, -0.154, -0.301);
```
<a name="module_registers/core..Quaternion+isEqual"></a>

#### quaternion.isEqual(quaternion) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[Quaternion](#module_registers/core..Quaternion)</code>  
**Summary**: Compares this instance with another instance of a Quaternion object regarding their relative closeness 
			whith a tolerance of 0.001 (1&#8240;)  

| Param | Type | Description |
| --- | --- | --- |
| quaternion | <code>Quaternion</code> | An instance of a Quaternion object |

<a name="module_registers/core..EulerAngle"></a>

### registers/core~EulerAngle
**Kind**: inner class of <code>[registers/core](#module_registers/core)</code>  
**Summary**: Represents an EurlerAngle  

* [~EulerAngle](#module_registers/core..EulerAngle)
    * [new EulerAngle(heading, pitch, yaw, roll)](#new_module_registers/core..EulerAngle_new)
    * [.isEqual(eulerAngle)](#module_registers/core..EulerAngle+isEqual) ⇒ <code>boolean</code>

<a name="new_module_registers/core..EulerAngle_new"></a>

#### new EulerAngle(heading, pitch, yaw, roll)

| Param | Type | Description |
| --- | --- | --- |
| heading | <code>number</code> | The direction in which the device is pointing |
| pitch | <code>number</code> | The Y intrinsic rotation axis |
| yaw | <code>number</code> | The Z intrinsic rotation axis |
| roll | <code>number</code> | The X intrinsic rotation axis |

**Example**  
```js
new EulerAngle(24.747, -120.862, 24.747, -33.046)
```
<a name="module_registers/core..EulerAngle+isEqual"></a>

#### eulerAngle.isEqual(eulerAngle) ⇒ <code>boolean</code>
**Kind**: instance method of <code>[EulerAngle](#module_registers/core..EulerAngle)</code>  
**Summary**: Compares this instance with another instance of an EulerAngle object regarding their relative closeness 
			whith a tolerance of 0.001 (1&#8240;)  

| Param | Type | Description |
| --- | --- | --- |
| eulerAngle | <code>EulerAngle</code> | An instance of an EulerAngle object |

**Example**  
```js
var ea1 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
var ea2 = new EulerAngle(24.747, -120.862, 24.747, -33.046);
var ea3 = new EulerAngle(24.746, -120.862, 24.747, -33.046);
var ea4 = new EulerAngle(24.722, -120.862, 24.747, -33.046);

ea1.isEqual(ea2); //true
ea1.isEqual(ea3); //true
ea1.isEqual(ea4); //false 
```
<a name="module_registers/core..isClose"></a>

### registers/core~isClose() ⇒ <code>boolean</code>
**Kind**: inner method of <code>[registers/core](#module_registers/core)</code>  
**Summary**: Compares two numbers regarding their relative closeness 
			whith a tolerance of 0.001 (1&#8240;)  

| Type | Description |
| --- | --- |
| <code>number</code> | The first number |
| <code>number</code> | The second number |

