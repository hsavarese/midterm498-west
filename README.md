# Wild West Forum

The most inseucre web forum out there

## Tech Used

- Node.js with express 
- handlebars with layouts and partials
- css for design
- docker with nginx reverse proxy
- manual cookie sessions with in memory storage

## Features 

- User registration and authentication. 
- session management with cookies and server side session objects
- comment posting and viewing 
- responsive interface with a navigation bar to get to all pages


## Pre Reqs

- Docker and docker compose installed
- git installed

## How to Install

1. 
git clone https://github.com/hsavarese/midterm498-west.git
cd midterm498-west

2. Then build and run the containers: docker-compose up --build -d | (or) docker compose up --build -d
3. default will be http://localhost:[port]

## How to Change the Port

- navigate to the docker-compose.yml file.  - Should see something like 
nginx:
  ports:
    - "YOUR_PORT:80"  # Change YOUR_PORT to desired port

change "Your_PORT" to your desired port

Then rebuild with:

docker compose down | (or) docker-compose down
then,
docker compose up --build -d | (or) docker-compose up --build -d
