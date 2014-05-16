Chat system - playing around with node + coffeescript + socket.io + mongodb

Canned is a chat app. It is for the sole purpose of playing with node + coffeescript + socket.io + mongodb + oauth.

Chat usernames are twitter ids. When you go to '/' the app will redirect you to twitter to login and obtain your twitter id.

A work in progress but comments and thoughts welcome.

Paul

# Installation

Install mongodb e.g. on OSX brew install mongodb
Start mongodb e.g. mongod run --config /usr/local/Cellar/mongodb/2.0.4-x86_64/mongod.conf

Install node.js e.g. on OSX brew install node
Install npm e.g. curl http://npmjs.org/install.sh | sh

cd into the cloned repo install packages by running
npm install

Copy the example config file:
cp src/server/config.cs.example src/server/config.cs

Get a twitter oauth consumer key and consumer secret for your canned app.
You'll need to register an app with twitter https://dev.twitter.com/apps
Look at your App's 'settings' tab on dev.twitter.
The "Callback URL" field must be set to e.g. http:// <your app's domain> /callback.php
You can use e.g. localhost:3000 as your app's domain if you're running locally on port 3000.
Put your key and secret in your new src/server/config.cs file.


Run app with
node app.js

Open a couple of browsers and point them at 0.0.0.0:3000


# Building

## To clean - delete compiled js..
gulp clean

## To build - compile to js..
gulp build

## To watch and build..
gulp



