## FrappeJS CLI  

> A Command Line Interface for quickly building apps with [FrappeJS](https://frappe.io/frappejs).

<p align="middle">
    <img src="https://github.com/frappe/frappejs-cli/blob/master/img/new-app.gif" width="430" height="310"/>
    <img src="https://github.com/frappe/frappejs-cli/blob/master/img/start-electron.gif" width="430" height="310"/>
</p>

### Installation 

    npm i -g https://github.com/frappe/frappejs-cli  
      
### Usage

 - [Create new app](#newApp)
 - [Create new model](#newModel)
 - [Serve application](#serve)
 - [Build application](#build)

---
<a id="newApp"></a>
#### Create new app

Create a new FrappeJS application 

##### Step 1:
    frappe create-app app-name

##### Step 2:
Choose any of the following boilerplate for your new app:

 1. Blank ( Blank Frontend + Server )
 2. VueJS ( Vue.js Frontend + Server + SQLite Database )
 3. Server ( No Frontend + Server )

#####  Step 3:
Choose a target platform for your new app:

 1. Web
 2. Electron

##### Step 4:
Choose a node package manager to install dependencies or skip to install dependencies later:

 1. NPM
 2. Yarn
 3. Skip this step

---
<a id="newModel"></a>
#### Create new model
Create a new FrappeJS model

    frappe create-model model-name
Enter the model details as prompted. [Click here](https://frappe.io/frappejs/docs/models.md) to know more about models in FrappeJS.

---
<a id="serve"></a>
#### Serve application
Serve your application in development mode either in Browser (Web) or Electron with auto-reload capabillity.

To serve in Browser

    frappe start 
    
To serve in Electron

    frappe start electron

---
<a id="build"></a>
#### Build application
This feature is under development.
