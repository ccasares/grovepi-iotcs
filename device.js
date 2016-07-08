var method = Device.prototype;

function Device(name) {
  // Initialize device (sub)structures
  this._device = {};
  this._device.iotcs = {};
  this._device.name = name;
}

method.setStoreFile = function(storeFile, passphrase) {
  this._device.iotcs.storeFile = storeFile;
  this._device.iotcs.storePassword = passphrase;
}

method.setUrn = function(urn) {
  this._device.iotcs.urn = urn;
}

method.setIotDcd = function(dcd) {
  this._device.iotcs.dcd = dcd;
}

method.setIotModel = function(model) {
  this._device.iotcs.model = model;
}

method.setIotVd = function(vd) {
  this._device.iotcs.vd = vd;
}

method.toString = function() {
  return JSON.stringify(this._device);
}
// Getters
method.getName = function() {
    return this._device.name;
};

method.getIotStoreFile = function() {
  return this._device.iotcs.storeFile;
}

method.getIotStorePassword = function() {
  return this._device.iotcs.storePassword;
}

method.getUrn = function() {
  return this._device.iotcs.urn;
}

method.getIotDcd = function() {
  return this._device.iotcs.dcd;
}

method.getIotVd = function() {
  return this._device.iotcs.vd;
}

module.exports = Device;
