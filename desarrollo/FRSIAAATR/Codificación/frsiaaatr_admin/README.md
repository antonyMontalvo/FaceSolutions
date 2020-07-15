# BackMEAN

Project to test all new technologies: Node.js, Express, JWT, MongoDB (Mongoose), Multer, Nodemailer, Twilio, Docker, GraphQL, Mocha, Bots, GITLAB DEVOPS, AWS.
All these technologies will have a simple example of their use.

---

## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v10.15.1

    $ npm --version
    6.11.3

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install

    $ git clone https://gitlab.com/personal-antony/node.js/backmean.git
    $ cd BackMEAN
    $ npm install

## Configure app

Open `./src/config` then edit it with your settings. You will need:

- A setting:
  - Copy .env.example in config folder, to the root folder and rename to .env
- Another setting;
- One more setting;

## Running the project

    $ npm start

## Simple build for production

    $ npm pm2 ecosystem.config.js
