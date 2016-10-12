'use strict';

// Module imports
var GrovePi = require('node-grovepi').GrovePi
  , async = require('async')
  , dcl = require('./device-library.node')
  , Device = require('./device')
  , log = require('npmlog-ts')
;

// IoTCS stuff
const GROVEPIDEV = "GrovePi+";
dcl = dcl({debug: false});
var storePassword = 'Welcome1';
const LIGHTSENSOR     = "urn:com:oracle:ccasares:iot:device:grovepi:sensors:light";
const MOTIONSENSOR    = "urn:com:oracle:ccasares:iot:device:grovepi:sensors:motion";
const PROXIMITYSENSOR = "urn:com:oracle:ccasares:iot:device:grovepi:sensors:proximity";
const SOUNDSENSOR     = "urn:com:oracle:ccasares:iot:device:grovepi:sensors:sound";
var urn = [
     LIGHTSENSOR
   , MOTIONSENSOR
   , PROXIMITYSENSOR
   , SOUNDSENSOR
];
var grovepi = new Device(GROVEPIDEV);
const storeFile = process.argv[2];
var devices = [ grovepi ];

// Init Devices
grovepi.setStoreFile(storeFile, storePassword);
grovepi.setUrn(urn);

// GrovePi stuff
var board = undefined;

// Misc
const PROCESS = 'PROCESS';
const IOTCS   = 'IOTCS';
const GROVEPI = 'GROVEPI';
log.level ='verbose';
log.timestamp = true;

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
  iot: function(callbackMainSeries) {
    log.info(IOTCS, "Initializing IoTCS devices");
    log.info(IOTCS, "Using IoTCS JavaScript Libraries v" + dcl.version);
    async.eachSeries( devices, function(d, callbackEachSeries) {
      async.series( [
        function(callbackSeries) {
          // Initialize Device
          log.info(IOTCS, "Initializing IoT device '" + d.getName() + "'");
          d.setIotDcd(new dcl.device.DirectlyConnectedDevice(d.getIotStoreFile(), d.getIotStorePassword()));
          callbackSeries(null);
        },
        function(callbackSeries) {
          // Check if already activated. If not, activate it
          if (!d.getIotDcd().isActivated()) {
            log.verbose(IOTCS, "Activating IoT device '" + d.getName() + "'");
            d.getIotDcd().activate(d.getUrn(), function (device, error) {
              if (error) {
                log.error(IOTCS, "Error in activating '" + d.getName() + "' device (" + d.getUrn() + "). Error: " + error.message);
                callbackSeries(error);
              }
              d.setIotDcd(device);
              if (!d.getIotDcd().isActivated()) {
                log.error(IOTCS, "Device '" + d.getName() + "' successfully activated, but not marked as Active (?). Aborting.");
                callbackSeries("ERROR: Successfully activated but not marked as Active");
              }
              callbackSeries(null);
            });
          } else {
            log.verbose(IOTCS, "'" + d.getName() + "' device is already activated");
            callbackSeries(null);
          }
        },
        function(callbackSeries) {
          // When here, the device should be activated. Get device models, one per URN registered
          async.eachSeries(d.getUrn(), function(urn, callbackEachSeriesUrn) {
            getModel(d.getIotDcd(), urn, (function (error, model) {
              if (error !== null) {
                log.error(IOTCS, "Error in retrieving '" + urn + "' model. Error: " + error.message);
                callbackEachSeriesUrn(error);
              } else {
                d.setIotVd(urn, model, d.getIotDcd().createVirtualDevice(d.getIotDcd().getEndpointId(), model));
                log.verbose(IOTCS, "'" + urn + "' intialized successfully");
              }
              callbackEachSeriesUrn(null);
            }).bind(this));
          }, function(err) {
            if (err) {
              callbackSeries(err);
            } else {
              callbackSeries(null, true);
            }
          });
        }
      ], function(err, results) {
        callbackEachSeries(err);
      });
    }, function(err) {
      if (err) {
        callbackMainSeries(err);
      } else {
        log.info(IOTCS, "IoTCS device initialized successfully");
        callbackMainSeries(null, true);
      }
    });
  },
  grovepi: function(callbackMainSeries) {
    log.info(GROVEPI, "Initializing GrovePi devices");
    if (board)
      callbackMainSeries(null, true);
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
              var vd = car.getIotVd(PROXIMITYSENSOR);
              if (vd) {
                vd.update({ distance: res});
              } else {
                log.error(IOTCS, "URN not registered: " + PROXIMITYSENSOR);
              }
            } else {
              log.warn(GROVEPI, "Proximity Sensor: Invalid value read: " + res);
            }
          })
          ultrasonicSensor.watch();
          // Light Sensor
          log.verbose(GROVEPI, 'Light Analog Sensor (start watch)')
          lightSensor.on('change', function(res) {
            if (typeof res === 'number') {
              var vd = car.getIotVd(LIGHTSENSOR);
              if (vd) {
                vd.update({ intensity: res});
              } else {
                log.error(IOTCS, "URN not registered: " + LIGHTSENSOR);
              }
            } else {
              log.warn(GROVEPI, "Light Sensor: Invalid value read: " + res);
            }
          })
          lightSensor.watch();
          // Motion Sensor
          log.verbose(GROVEPI, 'Motion Digital Sensor (start watch)');
          motionSensor.on('change', function(res) {
            var vd = car.getIotVd(MOTIONSENSOR);
            if (vd) {
              vd.update({ motion_detected: (res === '1')});
            } else {
              log.error(IOTCS, "URN not registered: " + MOTIONSENSOR);
            }
          });
          motionSensor.watch();
          log.info(GROVEPI, "GrovePi devices initialized successfully");
        } else {
          log.error(GROVEPI, 'TEST CANNOT START')
        }
      }
    })
    board.init()
    callbackMainSeries(null, true);
  }
}, function(err, results) {
  if (err) {
  } else {
    log.info(PROCESS, 'Initialization completed');
  }
});
