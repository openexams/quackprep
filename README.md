# QuackPrep: Your one stop shop for all your exam preparation needs.

<b>Get
involved: [Discord](https://discord.com/invite/APy5379qT8) • [Website](https://quackprep.com) • [Issues](https://github.com/quackprep/quackprep/issues)</b>

## Background

QuackPrep is a platform that helps students prepare for exams. Finding and studying with the past exams is like gold, its exactly what will be on the actual exam.
Maddox started this project and his hope is to help him and others around the world prepare for their exams.

## Tech Stack

#### Frontend

The frontend is built with React & Redux and uses the Semantic UI Components library.

#### Backend

The backend is built with Node.js and uses the Express framework.

#### Database

The database is built with mysql.

## Local Development Setup

We use a monorepo setup to keep the frontend and backend close to each other, but separated so we can work on them independently.

### Requirements

- Node.js
- git
- mysql

To run locally you will need to run `npm run dev` in the root directory. This will start and install packages for the backend and frontend.

then check http://localhost:3001 to see the app running.

### ENV Vars setup

You will see there is a file called `@backend/config/secrets.js` which holds all of the environment variables to be exported. You will need to create a secrets.env file in the root directory and add the following from secrets.js to it.

More coming soon about secrets.env file.

## Contributing

If you would like to contribute to the project, please feel free to fork the repository and create a pull request. Please make sure you pass all the tests in /tests/. Guide coming soon.

We love to have new people contribute to the project!
