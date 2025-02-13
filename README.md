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

## Structure

We use a monorepo setup to keep the frontend and backend close to each other, but separated so we can work on them independently.

### Backend

Starting with the backend, we use a models & routes file structure.

#### Models

- Business logic functions

#### Routes

- API routes & error checking

Models & routes share the same folder structure.  
The API routes should directly match the folder structure.

### Frontend

The frontend is less rigid and is the weakest part of the project.

## Contributing

If you would like to contribute to the project, please feel free to fork the repository and create a pull request. Please make sure you pass all the tests in tests. See [CONTRIBUTING.md](./CONTRIBUTING.md) for more.

We'd love to have new people contribute to the project!
