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
pi@raspberrypi3:~/Desktop/GrovePi $ ls -l
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

5. Now, let's test our Light Sensor and Ultrasonic Ranger devices before going further with my sample. Make sure you take the right sensors :wink::

![Ultrasonic Ranger](http://www.seeedstudio.com/wiki/images/3/3a/Ultrasonic_Ranger.jpg)
![Light Sensor](http://www.seeedstudio.com/wiki/images/1/1c/Twig-Light.jpg)

6. Plug each of them in the right ports. It is important to note that there are some sensors that produce analog signals, and others produce digital signals. Thus, the GrovePi+ board contains 3 input ports for analog sensors (numbered as A0, A1 and A2), and 7 input ports for digital sensors (numbered as D2, D3, D4, D5, D6, D7 and D8). You can localize them in the next diagram:

![GrovePi+ Board Port Diagram](http://www.dexterindustries.com/wp-content/uploads/2014/07/desc1.jpg)

The Light Sensor produces analog signals, so you must plug it in in any of the Analog Ports (A0, A1 or A2). The Ultrasonic Ranger sensor produces digital signals, so plug it in, in any of the Digital Ports (D2, D3, D4, D5, D6, D7 or D8). Just **take note of the port used**.

In my case, I've plug them in using the **A2** and **D4** ports.

7. Once plugged in, go to the Python samples directory

```
pi@raspberrypi3:~ $ cd $HOME/Desktop/GrovePi/Software/Python
pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ ls -l grove_ultrasonic.py grove_light_sensor.py
-rw-r--r-- 1 pi pi 2674 Jun  1 11:39 grove_light_sensor.py
-rw-r--r-- 1 pi pi 1941 Jun  1 11:39 grove_ultrasonic.py
```
Edit both files and make sure you set the port number you're using in your case.
For the `grove_light_sensor.py` file:

```
...
# Connect the Grove Light Sensor to analog port A0
# SIG,NC,VCC,GND
light_sensor = 0
...
```
Change the `0` to your port (if necessary).

For the `grove_ultrasonic.py` file:

```
...
# Connect the Grove Ultrasonic Ranger to digital port D2
# SIG,NC,VCC,GND
ultrasonic_ranger = 2
...
```
Change the `2` to your port (if necessary).

Now, start the `grove_light_sensor.py` test sample and check the results. Cover the sensor with your finger or palm and see what happens:

```
pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ python grove_light_sensor.py
sensor_value = 759 resistance =3.48
sensor_value = 757 resistance =3.51
sensor_value = 438 resistance =13.36
sensor_value = 376 resistance =17.21
sensor_value = 381 resistance =16.85
sensor_value = 16 resistance =629.38
```
Do the same with the `grove_ultrasonic.py` test sample. Move your palm over the sensor to see how it measures the distance in centimeters:

```
pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ python grove_ultrasonic.py
61
61
266
267
16
3
```

Cool, isn't it? :grimacing:. Let's move on.
8. Sensors are working like a charm. Now, let's send the data to Oracle IoTCS.
