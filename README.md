# grovepi-iotcs
Simple test of GrovePi Kit sending data to Oracle IoTCS
## Purpose
This is a simple node.js project that shows how to send data from devices connected through a GrovePi+ Kit for Raspberry Pi, to Oracle Internet Of Things Cloud Service (IoTCS). I'm obviously leveraging IoTCS's JavaScript Device Client Libraries.
## Disclamer
Follow my instructions at your own risk. Although everything related to the RPi, GrovePi+ board and devices is extremely simple, and nothing should go wrong, be sure to read any additional information from the original manufacturers of Raspberry and GrovePi+ if you're not sure what you're doing.
### My environment
I provide details about how to setup everything from scratch, assuming you will be using a similar environment:

* Raspberry Pi 3 (earlier models will work, but I'm omitting any setup related to WiFi or Bluetooth dongles, as the RPi3 have built-in support for those)
* GrovePi+ Kit (http://www.seeedstudio.com/wiki/GrovePi%2B, http://www.dexterindustries.com/shop/grovepi-starter-kit-raspberry-pi/)
* Raspbian For Robots image installed in your SD card (http://www.dexterindustries.com/howto/install-raspbian-for-robots-image-on-an-sd-card/)
 * There are instructions available about how to enable your own Raspbian image for GrovePi. Unfortunately, even after following those instructions, I didn't succeed. So I decided to use this pre-configured image from Dexter Industries which worked like a charm.
* For the demo, I've used the Light Sensor (http://www.seeedstudio.com/wiki/Grove_-_Light_Sensor) and Ultrasonic Ranger (http://www.seeedstudio.com/wiki/Grove_-_Ultrasonic_Ranger). GrovePi+ comes with many other ones, and even more sensors are available and could be used for your own purposes. Just plug them in to the GrovePi board and use the right libraries to access them!
