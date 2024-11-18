
# Dissmissal APP

Aplikasi untuk penjemputan di area HBICS


## How to Used

Penggunaanya bisa digunakan di server dan menggunakan python
## Installation

windows Install:

1. Copy Folder tersebut di Disk
2. Install Python ; python Downloads\get-pip.py
3. buka terminal : pip install gspread oauth2client ; pip install flask ; pip install flask_cors
4. Buat Dokumen di google sheet , dengan nama "StudentDatabase", dengan detail Column A = Barcode, B = Name, C= Class
5. Buat akun Google Cloud service, pergi ke APIs & Servives > Credentials, Download credentials.json
6. Share gooogle sheet "StudentDatabase" ke email yang ada di credentials.json (your-service-account@your-project-id.iam.gserviceaccount.com)
7. run server, buka terminal > arahkan ke folder > python server.py
8. buka index.html

Install on Ubuntu

```bash
cd ~/PATH/TO/YOUR/FOLDER
python3 -m venv myenv
source myenv/bin/activate
pip install flask
python server.py
```
For Production Server

Install WAITRESS

```bash
pip install waitress
cd /path/to/project
waitress-serve --host=0.0.0.0 --port=5000 wsgi:app
```

Make Waitress a Service (Optional)

```bash
sudo nano /etc/systemd/system/flaskapp.service
```
Add the following content (adjust paths and usernames):

```bash
[Unit]
Description=Gunicorn instance to serve Flask app
After=network.target
 
 
[Service]
User=your-username
Group=www-data
WorkingDirectory=/path/to/project
Environment="PATH=/path/to/your/python/environment/bin"
ExecStart=/usr/bin/python3 -m waitress --host=0.0.0.0 --port=5000 wsgi:app
 
[Install]
WantedBy=multi-user.target
```
Enable and Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable flaskapp.service
sudo systemctl start flaskapp.service
```
Check service status

```bash
sudo systemctl status flaskapp.service
```

Make the Server Accessible on the Network

```bash
sudo ufw allow 5000
```
## Authors

- [@dedebono](https://www.github.com/dedebono)

