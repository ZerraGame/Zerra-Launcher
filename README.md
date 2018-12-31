<a href="https://discord.gg/cEuUxkB">
        <img src="https://img.shields.io/discord/308323056592486420.svg?logo=discord&colorB=8080ff"
            alt="chat on Discord"></a>

## About
A launcher for Zerra, the video game.

Credit to Arpaesis#8924, BitCrack#6374, and Ruthless#5405 for its design.

## Usage
The launcher is used to manage instances of the game Zerra, a top down survival sandbox game. 

Using the launcher is rather straightforward. The gear at the top right opens the **launcher settings**, which manage the general settings the launcher program uses. You can customize the functionality of the launcher under this window, changing features such as maximum bandwidth for downloads, notifications for updates, and so on.

The **Play** button allows for the launching of the game. Note that this button is disabled unless an instance of the game is selected to run.

Instances can be selected by using the button to the right of the **Play** button. This button allows for the selection of instance folders. Any folder with the game files located inside can be treated like an instance.

## Setting Up the Dev Environment
**NOTE:** Before proceeding with these instructions, make sure you have both [Git Bash](https://git-scm.com/downloads) and [NPM](https://www.npmjs.com/get-npm) installed.
1. In the project directory, run the command `git clone https://github.com/Arpaesis/Zerra-Launcher.git`
1. In the new folder you just cloned, run the command ``npm install``. Wait for the dependencies to install.
1. Now your dev environment is all set up. To run the launcher, run the command ``npm start``, and the launcher should run.
1. That's it! You're done. If at any single one of these steps you encountered an error, please contact any of the developers in the **About** section above for help.

## Dependencies
Our launcher uses the following main dependencies:
* Electron
* Popper.js
* jQuery
* Bootstrap 4
* Shuffle.js
* Mkdirp
* Electron Packager (dev)
* Electron Winstaller (dev)

By using the command ``npm install``, you are installing these dependencies. This section is here for your convenience and to inform you of what is going on with the dependencies. Of course, you can always see **package.json** to see the dependencies the project makes use of.