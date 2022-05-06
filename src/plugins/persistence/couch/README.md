# Introduction
These instructions are for setting up CouchDB for a **development** environment. For a production environment, we recommend running Open MCT behind a proxy server (e.g., Nginx or Apache), and securing the CouchDB server properly:
https://docs.couchdb.org/en/main/intro/security.html

# Installing CouchDB
## macOS 
### Installing with admin privileges to your computer
1. Install CouchDB using: `brew install couchdb`. 
2. Edit `/usr/local/etc/local.ini` and add the following settings:
  ```
  [admins]
  admin = youradminpassword
  ```
  And set the server up for single node:
  ```
  [couchdb]
  single_node=true
  ```
  Enable CORS
  ```
  [chttpd]
  enable_cors = true
  [cors]
  origins = http://localhost:8080
  ```
### Installing without admin privileges to your computer
1. Install CouchDB following these instructions: https://docs.brew.sh/Installation#untar-anywhere.
1. Edit `local.ini` in Homebrew's `/etc/` directory as directed above in the 'Installing with admin privileges to your computer' section.
## Other Operating Systems
Follow the installation instructions from the CouchDB installation guide: https://docs.couchdb.org/en/stable/install/index.html
# Configuring CouchDB
1. Start CouchDB by running: `couchdb`.
2. Add the `_global_changes` database using `curl` (note the `youradminpassword` should be changed to what you set above 👆): `curl -X PUT http://admin:youradminpassword@127.0.0.1:5984/_global_changes`
1. Navigate to http://localhost:5984/_utils
2. Create a database called `openmct`
3. Navigate to http://127.0.0.1:5984/_utils/#/database/openmct/permissions
4. Remove permission restrictions in CouchDB from Open MCT by deleting `_admin` roles for both `Admin` and `Member`.

# Configuring Open MCT
1. Edit `openmct/index.html` comment out the following line:
```
openmct.install(openmct.plugins.LocalStorage());
```
Add a line to install the CouchDB plugin for Open MCT:
```
openmct.install(openmct.plugins.CouchDB("http://localhost:5984/openmct"));
```
6. Enable cors in CouchDB by editing `~/homebrew/etc/local.ini` and add: `
```
[chttpd]
enable_cors = true

[cors]
origins = http://localhost:8080
```
7. Remove permission restrictions in CouchDB from OpenMCT by navigating to http://127.0.0.1:5984/_utils/#/database/openmct/permissions and deleting `_admin` roles for both `Admin` and `Member`.
8. Start openmct by running `npm start` in the OpenMCT directory.
9. Navigate to http://localhost:8080/ and create a random object in OpenMCT (e.g., a `Clock`) and save. You may get an error saying that the objects failed to persist. This is a known error that you can ignore, and will only happen the first time you save.
10. Navigate to: http://127.0.0.1:5984/_utils/#database/openmct/_all_docs
11. Look at the `JSON` tab and ensure you can see the `Clock` object you created above.
12. All done! 🏆
