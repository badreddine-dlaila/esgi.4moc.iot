# Install docker
```zsh
# Install 
sudo curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
# Configure Docker to start on boot
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker pi
# Check installation
docker version
sudo docker run hello-world
```

# Install portainer
```zsh
# Create portainer volume
sudo docker volume create portainer_data 
# Create & launch portainer container
sudo docker run -d -p 8000:8000 -p 9000:9000 --restart unless-stopped --name="portainer" -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
# Go to your portainer UI on <PI-HOSTNAME-OR-IP>:9000 
# Set your Username & password 
# Connect to your local docker environment 
```
