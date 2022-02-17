# Tools
* https://mobaxterm.mobatek.net/ (windows)
* https://filezilla-project.org/
* http://mqtt-explorer.com/ 
* https://mqttfx.jensd.de/
* https://code.visualstudio.com/

# Setup the PI

* Install rapbian stretch lite image using  Etcher: https://www.raspberrypi.org/downloads/raspbian/

* Enable SSH on a headless Raspberry Pi (add file to SD card on another machine). For headless setup, SSH can be enabled by placing a file named ssh, without any extension, onto the boot partition of the SD card from another computer.

* Update your PI 
```zsh
sudo apt-get update && sudo apt-get upgrade
```

# Install Mosquitto
```zsh
# Broker
sudo apt-get install mosquitto
# Clients mosquitto_sub & mosquitto_pub
sudo apt-get install mosquitto-clients
# Check installation
systemctl status mosquitto
# systemcctl commands 
# sudo systemctl (enable|disable) mosquitto
# sudo systemctl (start|stop) mosquitto

# Secure mosquitto broker
# Add listener on port 1883 (https://mosquitto.org/documentation/migrating-to-2-0/)
sudo mosquitto_passwd -c /etc/mosquitto/passwd <USER>
# Add the following lines to mosquitto.conf
# allow_anonymous false
# listener 1883 
# password_file /etc/mosquitto/passwd 
sudo nano /etc/mosquitto/mosquitto.conf

# restart the mosquitto service to apply changes
pi@raspberrypi:~/Downloads $ sudo systemctl restart mosquitto
# test your broker 
# subscribing to the 'test' topic
pi@raspberrypi:~/Downloads $ mosquitto_sub -h localhost -t test -u "pi" -P "raspberry"
# publish "hello world" to the "test" topic on another terminal window
pi@raspberrypi:~/Downloads $ mosquitto_pub -h localhost -t test -m "hello world" -u "pi" -P "raspberry"



