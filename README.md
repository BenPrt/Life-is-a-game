# Life is a game..

## Description

This project is an Electron/VueJs implementation of the John Conway's Game of Life. It was part of a job technical interview, and I made it from scratch in less than 48 hours without any knowledge of Electron, and only basics of VueJs.

#### Features

This application implements the basic game rules, and I also added some additionnal features :

- An automatic game mode with adjustable speed
- A step-by-step mode
- The game grid is initialized with a randomly placed glider
- A reset button
- The game grid is resizable (However, I limited this feature to a maximal size to keep a harmonious display)

#### Architecture and configuration

This project is made up from 2 parts :

- A VueJs application, implementing the view part
- An Electron application, rendering the VueJs application in a native window, and handling algorithm and process.


Those two parts are communicating using the IPC (inter-process communication) module from Electron framework.


The codebase is linted with ESLint and the Airbnb configuration.

## Installation

```bash
npm install
```

I would also advise you to execute this command to have the less vulnerable libraries possible :

```bash
npm audit fix
```

## Start the project

#### Start the production mode : Electron renders optimized VueJs app

```bash
npm start
```

#### Start the development mode with hot reload (Electron rendering the VueJS development server)

```bash
npm run start-dev
```

#### Lint the application

```bash
npm run lint
```
