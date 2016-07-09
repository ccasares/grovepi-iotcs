# grovepi-iotcs
Simple test of GrovePi Kit sending data to Oracle IoTCS
## Purpose
This is a simple node.js project that shows how to send data from devices connected through a GrovePi+ Kit for Raspberry Pi (http://www.seeedstudio.com/item_detail.html?p_id=2572), to Oracle Internet Of Things Cloud Service (https://cloud.oracle.com/iot). I'm obviously leveraging IoTCS's JavaScript Device Client Libraries.
## Disclamer
Follow my instructions at your own risk. Although everything related to the RPi, GrovePi+ board and devices is extremely simple and nothing should go wrong, be sure to read any additional information from the original manufacturers of Raspberry and GrovePi+ if you're not sure what you're doing.
## My environment
I provide details about how to setup everything from scratch, assuming you will be using a similar environment:

* Raspberry Pi 3 (https://www.raspberrypi.org). Earlier models should work, but I'm omitting any setup related to WiFi or Bluetooth dongles, as the RPi3 has built-in support for those.
* GrovePi+ Kit (http://www.seeedstudio.com/wiki/GrovePi%2B, http://www.dexterindustries.com/shop/grovepi-starter-kit-raspberry-pi/)
* Raspbian For Robots image installed in your SD card (http://www.dexterindustries.com/howto/install-raspbian-for-robots-image-on-an-sd-card/)
 * There are instructions available about how to enable your own Raspbian image for GrovePi. Unfortunately, even after following those instructions, it didn't work for me. So I decided to use this pre-configured image from Dexter Industries which worked like a charm.
* For the demo, I've used the Light Sensor (http://www.seeedstudio.com/wiki/Grove_-_Light_Sensor) and Ultrasonic Ranger (http://www.seeedstudio.com/wiki/Grove_-_Ultrasonic_Ranger). GrovePi+ Kit comes with many other ones, and even more sensors are available and could be used for your own purposes. Just plug them in to the GrovePi board and use the right libraries to access them!
* Although both IoTCS and GrovePi+ support many different programming languages (Java, Python, C#...) I'm a JavaScript/nodejs fan. And that's what you'll find in here :grin:.
 * I've used nodejs 6.2.0 (https://nodejs.org) for development and testing. But I'm pretty sure this should work with earlier and newer versions of nodejs. Just give it a try yourself.

## Let's go for it!
### Raspberry Pi 3 setup

1. Get a microSD card (at least 4GB)
2. Download Raspbian for Robots image from here: http://www.dexterindustries.com/howto/install-raspbian-for-robots-image-on-an-sd-card/. This page also contains detailed instructions about how to write the image to your microSD card.
3. Plug your GrovePi+ board in your RPi3. Make sure  
4. Start your RPi3 and log in. The image includes libraries and samples for many GrovePi sensors and programming languages. You can find those in your Desktop folder
```
total 136
drwxr-xr-x  3 pi pi   4096 Jun  1 11:39 Firmware
-rw-r--r--  1 pi pi 100572 Jun  1 11:39 GrovePi_Plus_By_Dexter_Industries_For_the_Raspberry_Pi.JPG
drwxr-xr-x  2 pi pi   4096 Jun  1 11:39 Hardware
-rwxr-xr-x  1 pi pi   1201 Jun  1 11:39 LICENSE
drwxr-xr-x 21 pi pi   4096 Jun  1 11:39 Projects
-rwxr-xr-x  1 pi pi   4200 Jun  1 11:39 README.md
drwxr-xr-x  5 pi pi   4096 Jun  1 13:24 Script
drwxr-xr-x  9 pi pi   4096 Jun  1 11:39 Software
drwxr-xr-x  2 pi pi   4096 Jun  2 01:29 Troubleshooting
```
```
pi@raspberrypi3:~/GrovePi/Software $ ls -l
total 32
drwxr-xr-x  2 pi pi 4096 Jun  1 11:39 C
drwxr-xr-x  5 pi pi 4096 Jun  1 11:39 CSharp
drwxr-xr-x  3 pi pi 4096 Jun  1 11:39 Go
drwxr-xr-x  4 pi pi 4096 Jun  1 11:39 NodeJS
drwxr-xr-x 23 pi pi 4096 Jul  6 23:19 Python
-rwxr-xr-x  1 pi pi 1445 Jun  1 11:39 README.md
drwxr-xr-x  4 pi pi 4096 Jun  1 11:39 Scratch
drwxr-xr-x  4 pi pi 4096 Jun  1 11:39 Shell
```
as noted above, I've used NodeJS stuff. However, it's a good idea to use the Python individual samples to test each sensor. More on this next.
5. Now, let's test our Light Sensor and Ultrasonic Range devices before going further with my sample.

![Ultrasonic Ranger](http://www.seeedstudio.com/wiki/images/3/3a/Ultrasonic_Ranger.jpg)
![Light Sensor](http://www.seeedstudio.com/wiki/images/1/1c/Twig-Light.jpg)
