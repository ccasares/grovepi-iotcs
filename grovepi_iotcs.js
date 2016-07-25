'use strict';

// Module imports
var GrovePi = require('node-grovepi').GrovePi
  , async = require('async')
  , dcl = require('./device-library.node')
  , Device = require('./device')
  , log = require('npmlog')
;

// IoTCS stuff
dcl = dcl({debug: false});
var storePassword = 'welcome1';
var proximity = new Device('Proximity Sensor');
var light = new Device('Light Sensor');
var motion = new Device('Motion Sensor');
var devices = [ proximity, light, motion ];

// Init Devices
proximity.setStoreFile(process.argv[2], storePassword);
proximity.setUrn('urn:com:oracle:ccasares:iot:device:grovepi:sensors:proximity');
light.setStoreFile(process.argv[3], storePassword);
light.setUrn('urn:com:oracle:ccasares:iot:device:grovepi:sensors:light');
motion.setStoreFile(process.argv[4], storePassword);
motion.setUrn('urn:com:oracle:ccasares:iot:device:grovepi:sensors:motion');

// GrovePi stuff
var board = undefined;

// Misc
const PROCESS = 'PROCESS';
const IOTCS   = 'IOTCS';
const GROVEPI = 'GROVEPI';
log.level ='verbose';

function getModel(device, urn, callback) {
  device.getDeviceModel(urn, function (response, error) {
    if (error) {
      callback(error);
    }
    callback(null, response);
  });
}

// Detect CTRL-C
process.on('SIGINT', function() {
  log.info(PROCESS, "Caught interrupt signal");
  log.info(PROCESS, "Exiting gracefully");
  if (board) board.close()
  board = undefined;
  process.removeAllListeners()
  if (typeof err != 'undefined')
    log.error(PROCESS, err)
  process.exit(2);
});


async.series( {
  iot: function(callback) {
    log.info(IOTCS, "Initializing IoTCS devices");
    async.eachSeries( devices, function(d, cb) {
      async.series( [
        function(cb1) {
          // Initialize Device
          log.verbose(IOTCS, "Initializing IoT device '" + d.getName() + "'");
          d.setIotDcd(new dcl.device.DirectlyConnectedDevice(d.getIotStoreFile(), d.getIotStorePassword()));
          cb1(null);
        },
        function(cb2) {
          // Check if already activated. If not, activate it
          if (!d.getIotDcd().isActivated()) {
            log.verbose(IOTCS, "Activating IoT device '" + d.getName() + "'");
            d.getIotDcd().activate([d.getUrn()], function (device, error) {
              if (error) {
                log.error(IOTCS, "Error in activating '" + d.getName() + "' device (" + d.getUrn() + "). Error: " + error.message);
                cb2(error);
              }
              d.setIotDcd(device);
              if (!d.getIotDcd().isActivated()) {
                log.error(IOTCS, "Device '" + d.getName() + "' successfully activated, but not marked as Active (?). Aborting.");
                cb2("Not activated");
              }
              cb2(null);
            });
          } else {
            log.verbose(IOTCS, "'" + d.getName() + "' device is already activated");
            cb2(null);
          }
        },
        function(cb3) {
          // When here, the device should be activated. get device model
          getModel(d.getIotDcd(), d.getUrn(), (function (error, model) {
            if (error !== null) {
              log.error(IOTCS, "Error in retrieving '" + d.getName() + "' model. Error: " + error.message);
              cb3(error);
            } else {
              d.setIotModel(model);
              d.setIotVd(d.getIotDcd().createVirtualDevice(d.getIotDcd().getEndpointId(), model));
              log.verbose(IOTCS, "'" + d.getName() + "' intialized successfully");
            }
            cb3();
          }).bind(this));
        }
      ], function(err, results) {
        cb();
      });
    }, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, true);
      }
    });
  },
  grovepi: function(callback) {
    log.info(GROVEPI, "Initializing GrovePi devices");
    if (board)
      callback(null, true);
    log.verbose(GROVEPI, 'Starting Board setup');
    board = new GrovePi.board({
      debug: true,
      onError: function(err) {
        log.error(GROVEPI, 'TEST ERROR');
        log.error(GROVEPI, err);
      },
      onInit: function(res) {
        if (res) {
          var ultrasonicSensor = new GrovePi.sensors.UltrasonicDigital(4);
          var lightSensor = new GrovePi.sensors.LightAnalog(2);
          var motionSensor = new GrovePi.sensors.DigitalInput(8);
          log.verbose(GROVEPI, 'GrovePi Version :: ' + board.version());
          // Ultrasonic Ranger
          log.verbose(GROVEPI, 'Ultrasonic Ranger Digital Sensor (start watch)');
          ultrasonicSensor.on('change', function(res) {
            if (typeof res === 'number') {
              proximity.getIotVd().update({ distance: res});
            } else {
              log.warn(GROVEPI, "Proximity Sensor: Invalid value read: " + res);
            }
          })
          ultrasonicSensor.watch();
          // Light Sensor
          log.verbose(GROVEPI, 'Light Analog Sensor (start watch)')
          lightSensor.on('change', function(res) {
            if (typeof res === 'number') {
              light.getIotVd().update({ intensity: res});
            } else {
              log.warn(GROVEPI, "Light Sensor: Invalid value read: " + res);
            }
          })
          lightSensor.watch();
          // Motion Sensor
          log.verbose(GROVEPI, 'Motion Digital Sensor (start watch)');
          motionSensor.on('change', function(res) {
            motion.getIotVd().update({ motion_detected: (res === '1')});
          });
          motionSensor.watch();

          log.info(GROVEPI, "GrovePi devices initialized successfully");
        } else {
          log.error(GROVEPI, 'TEST CANNOT START')
        }
      }
    })
    board.init()
    callback(null, true);
  }
}, function(err, results) {
  if (err) {
  } else {
    log.info(PROCESS, 'Initialization completed');
  }
});
