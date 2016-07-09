# grovepi-iotcs
Simple test of GrovePi Kit sending data to Oracle IoTCS
## Purpose
This is a simple node.js project that shows how to send data from devices connected through a GrovePi+ Kit for [Raspberry Pi](http://www.seeedstudio.com/item_detail.html?p_id=2572), to [Oracle Internet Of Things Cloud Service](https://cloud.oracle.com/iot). I'm obviously leveraging IoTCS's JavaScript Device Client Libraries.
## Disclamer
Follow my instructions at your own risk. Although everything related to the RPi, GrovePi+ board and devices is extremely simple and nothing should go wrong, be sure to read any additional information from the original manufacturers of Raspberry and GrovePi+ if you're not sure what you're doing.
## My environment
I provide details about how to setup everything from scratch, assuming you will be using a similar environment:

* [Raspberry Pi 3](https://www.raspberrypi.org). Earlier models should work, but I'm omitting any setup related to WiFi or Bluetooth dongles, as the RPi3 has built-in support for those.
* [GrovePi+ Kit](http://www.dexterindustries.com/shop/grovepi-starter-kit-raspberry-pi/)
* [Raspbian For Robots image](http://www.dexterindustries.com/howto/install-raspbian-for-robots-image-on-an-sd-card/) installed in your SD card
 * There are instructions available about how to enable your own Raspbian image for GrovePi. Unfortunately, even after following those instructions, it didn't work for me. So I decided to use this pre-configured image from Dexter Industries which worked like a charm.
* For the demo, I've used the [Light Sensor](http://www.seeedstudio.com/wiki/Grove_-_Light_Sensor) and [Ultrasonic Ranger](http://www.seeedstudio.com/wiki/Grove_-_Ultrasonic_Ranger). GrovePi+ Kit comes with many other ones, and even more sensors are available and could be used for your own purposes. Just plug them in to the GrovePi board and use the right libraries to access them!
* Although both IoTCS and GrovePi+ support many different programming languages (Java, Python, C#...) I'm a JavaScript/nodejs fan. And that's what you'll find in here :grin:.
 * I've used [nodejs](https://nodejs.org) 6.2.0 for development and testing. But I'm pretty sure this should work with earlier and newer versions of nodejs. Just give it a try yourself.
* [Oracle Internet Of Things Cloud Service release 16.2.3](https://cloud.oracle.com/iot). The instructions you'll find here about IoTCS are for releases 16.1.3 or higher. Same for the Client libraries.
* [Oracle Process Cloud Service](https://cloud.oracle.com/process) release 16.1.3 or higher.
* [Oracle Integration Cloud Service](https://cloud.oracle.com/integration) release 16.2.3 or higher.

## Let's go for it!
### Raspberry Pi 3 & GrovePi+ Kit Setup

1. Get a microSD card (at least 4GB)
2. Download Raspbian for Robots image from [here](http://www.dexterindustries.com/howto/install-raspbian-for-robots-image-on-an-sd-card/). This page also contains detailed instructions about how to write the image to your microSD card.
3. Plug your GrovePi+ board in your RPi3. Make sure you do it properly. Have a look to the following picture: __**TODO**__
4. The Raspian for Robots image already includes a nodejs. Unfortunately it's an old one and it's better to install a newer versions
    1. Download the latest version of nodejs from [here](https://nodejs.org). Make sure you download the **ARMv6** platform.
    2. Uninstall the previous nodejs and install (unzip) the new one. Make sure you clean up the `/usr/local/bin` folder to point to your nodejs instance.
5. Start your RPi3 and log in. The image includes libraries and samples for many GrovePi sensors and programming languages. You can find those in your Desktop folder
    ```bash
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
    ```bash
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

6. Now, let's test our Light Sensor and Ultrasonic Ranger devices before going further with my sample. Make sure you take the right sensors :wink::

    ![Ultrasonic Ranger](http://www.seeedstudio.com/wiki/images/3/3a/Ultrasonic_Ranger.jpg)
    ![Light Sensor](http://www.seeedstudio.com/wiki/images/1/1c/Twig-Light.jpg)

7. Plug each of them in the right ports. It is important to note that there are some sensors that produce analog signals, and others produce digital signals. Thus, the GrovePi+ board contains 3 input ports for analog sensors (numbered as A0, A1 and A2), and 7 input ports for digital sensors (numbered as D2, D3, D4, D5, D6, D7 and D8). You can localize them in the next diagram:

    ![GrovePi+ Board Port Diagram](http://www.dexterindustries.com/wp-content/uploads/2014/07/desc1.jpg)

    The Light Sensor produces analog signals, so you must plug it in in any of the Analog Ports (A0, A1 or A2). The Ultrasonic Ranger sensor produces digital signals, so plug it in, in any of the Digital Ports (D2, D3, D4, D5, D6, D7 or D8). Just **take note of the port used**.

    In my case, I've plugged them in using the **A2** and **D4** ports.

8. Once plugged in, go to the Python samples directory

    ```bash
    pi@raspberrypi3:~ $ cd $HOME/Desktop/GrovePi/Software/Python
    pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ ls -l grove_ultrasonic.py grove_light_sensor.py
    -rw-r--r-- 1 pi pi 2674 Jun  1 11:39 grove_light_sensor.py
    -rw-r--r-- 1 pi pi 1941 Jun  1 11:39 grove_ultrasonic.py
    ```
Edit both files and make sure you set the port number you're using in your case.
    For the `grove_light_sensor.py` file:

    ```python
    ...
    # Connect the Grove Light Sensor to analog port A0
    # SIG,NC,VCC,GND
    light_sensor = 0
    ...
    ```
Change the `0` to your port (if necessary).

    For the `grove_ultrasonic.py` file:

    ```python
    ...
    # Connect the Grove Ultrasonic Ranger to digital port D2
    # SIG,NC,VCC,GND
    ultrasonic_ranger = 2
    ...
    ```
Change the `2` to your port (if necessary).

    Now, start the `grove_light_sensor.py` test sample and check the results. Cover the sensor with your finger or palm and see what happens:

    ```bash
pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ python grove_light_sensor.py
sensor_value = 759 resistance =3.48
sensor_value = 757 resistance =3.51
sensor_value = 438 resistance =13.36
sensor_value = 376 resistance =17.21
sensor_value = 381 resistance =16.85
sensor_value = 16 resistance =629.38
```
    Do the same with the `grove_ultrasonic.py` test sample. Move your palm over the sensor to see how it measures the distance in centimeters:

    ```bash
pi@raspberrypi3:~/Desktop/GrovePi/Software/Python $ python grove_ultrasonic.py
61
61
266
267
16
3
```

    Cool, isn't it? :grimacing:. Sensors are working like a charm. Now, let's move on and send the data to Oracle IoTCS.

### Oracle IoTCS setup (Server side) (1)
#### Get your Instance
You will need to purchase an instance of Oracle IoTCS or request a trial account. I have been using a shared instance used by many Sales Consultants in Oracle around the world. Visit https://cloud.oracle.com/iot to get more info.
#### Create the Device Models
In IoTCS, a device model is a single entity that represents the interface through which Oracle IoT Cloud Service can interact with a specific device type.
The first step is to define the device models we're going to use in this sample. Say, the "Light Sensor" device model and the "Ultrasonic Ranger" device model.

1. Login to your IoTCS instance and click the `Devices`tab
2. Click the `+` button to create a new device model
3. In my sample I created my device model with the following data:
    1. Details:
        ```
    Name: CarlosC-GrovePi-Proximity Sensor Model
    Description: Proximity Sensor Model from GrovePi (http://www.dexterindustries.com/grovepi)
    URN: urn:com:oracle:ccasares:iot:device:grovepi:sensors:proximity
    ```

        The `URN`(_Uniform Resource Name_) is like a namespace in XML. It uniquely defines the device model in the IoTCS infrastructure. See more about URNs [here](https://en.wikipedia.org/wiki/Uniform_Resource_Name)

    2. Attributes:

        Click the `+` button to create a new attribute with the following details:

       ```
    Name: distance
    Description: Distance in centimeters
    Type: Integer
    Range: From 0 to 9999
    ```

4. Repeat the same steps for the "Light Sensor" model, with the following data:
    1. Details:
        ```
    Name: CarlosC-GrovePi-Light Sensor Model
    Description: Light Sensor Model from GrovePi (http://www.dexterindustries.com/grovepi)
    URN: urn:com:oracle:ccasares:iot:device:grovepi:sensors:light
    ```
    2. Attributes:
       ```
    Name: intensity
    Description: Intensity
    Type: Number
    Range: From 0.0 to 999999.0
    ```

#### Register virtual devices
You must first register each device with Oracle IoT Cloud Service before the device can communicate and send any data to Oracle IoT Cloud Service.
Actual devices are _virtualized_ in IoTCS infrastructure. We will be using _Directly Connected Device_  in our sample. See IoTCS [documentation](https://docs.oracle.com/cloud/latest/iot/IOTGS/GUID-0AFFC157-E54C-4CE5-BB98-ED887C3977E7.htm) about device types.
One _virtualized device_ can be associated with one or more _device models_. Nonetheless, we will create one virtualized device per _actual device_.

1. While in the `Devices` tab, click on the `Register` icon on the left, and `Register Single Device` button.
2. Enter a meaningful `Name`, `Manufacturer`, `Serial Number` and `Model Number` values. Type in also the `Shared Secret` (or _password_) for this device. **Remember this shared secret** as it will be used later. Click `Register`.
3. Take note of the **`Device ID`**.

### Oracle IoTCS setup (Client side)
#### Download and unzip the libraries
1. Official and supported IoTCS Client libraries are available in this [page](http://www.oracle.com/technetwork/indexes/downloads/iot-client-libraries-2705514.html). However, we're going to use a newer version which hasn't yet be release at the time I wrote this tutorial. This is because it contains some fixes that we'll take advantage of. You can find it in this repo <a href="Dockerfile">here</a>
2. Copy/upload the downloaded ZIP file to the RPi3.
3. I created the `projects` folder to work from there
   ```
mkdir $HOME/projects
```
   Login to the RPi3 and unzip the ZIP file into such folder. A `$HOME/projects/iot` folder structure will be created.

4. d

#### Create the trusr-store files
### Build your client sample
### Oracle IoTCS setup (Server side) (2)
#### Create and setup your application
##### Create your application
##### Register your device models
##### Create your explorations
### Build your Process in Oracle Process Cloud Service
#### Get your Instance
You will need to purchase an instance of Oracle Process Cloud Service (PCS) or request a trial account. I have been using a shared instance used by many Sales Consultants in Oracle around the world. Visit https://cloud.oracle.com/process to get more info.
#### Create your process application
### Create your integration in Oracle Integration Cloud Service
#### Get your Instance
You will need to purchase an instance of Oracle Integration Cloud Service (PCS) or request a trial account. I have been using a shared instance used by many Sales Consultants in Oracle around the world. Visit https://cloud.oracle.com/integration to get more info.
#### Create your integration
### Oracle IoTCS setup (Server side) (3)
#### Create and setup your application (2)
##### Create the enterprise application integration
### Run the sample end2end!
