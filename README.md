9K Project
=========

#Code9000 project for #oSoc13
(c) 2013, OKFN Belgium. Some rights reserved.

# Folder structure

/ is assumed to be the root folder (/Code9000)

* /config: contains configuration files (e.g. connectiondetails.php which you need to make)
* /vendor: contains autogenerated vendor files
* /img: contains project images
* /scripts: contains all javascript
* /css: contains all css
* /templates: contains all .phtml files as referred to in /index.php
* /uploads: contains uploaded files and images
* /utils: helper classes and functions

# Deployment instructions

In short, here's what you need to do in order to deploy the project 

1) Place the Code9000 dir onto the server root.
2) Create an /uploads folder in the Code9000 directory
3) Deploy an empty database from /docs into the MySQL server
4) Install all required vendor packages using Composer
5) Ensure that the server configuration runs, see example file in /docs/Database/Connection/connectiondetails.php which needs to be moved to Code9000/config/connectiondetails.php
6) Run the servers and navigate to www.yourdomain.com/Code9000
7) Set up referrals to refer www.yourdomain.com/ to www.yourdomain.com/Code9000
