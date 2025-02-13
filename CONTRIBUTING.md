# How To Start Contributing

## Pratices we Use

- Use zod for input validation
- Abstract when you can
- use the standardApiCall middleware on the frontend whenever using the api

If you have a better idea for anything we do let us know!

## Setup Instructions

Follow these steps to set up and run the application locally.

## 1. Run `npm run dev` to install deps

Run the following command in the root directory of the project:

```bash
npm run dev
```

This will attempt to install dependencies for both the frontend and backend (npm i).

## 2. Install MySQL Locally

Install MySQL version 8 or above on your machine. During installation:

Remember the username and password you set.

Note the server configuration (e.g., localhost:3306).

## 3. Set Up Environment Variables

Navigate to the @backend/config/secrets.js file to see the required environment variables.

Create a secrets.env file in the root directory of the project.

Add the following variables to the secrets.env file:

```env
NODE_ENV="local"
SESSION_SECRET="some_long_uuid"
MADDOX_MYSQL_USERNAME="your_mysql_username"
MADDOX_MYSQL_PASSWORD="your_mysql_password"
MADDOX_MYSQL_SERVER="your_mysql_server"
MADDOX_MYSQL_DB="your_database_name"
```

Replace the placeholders with your actual MySQL credentials and configuration.

## 4. Initialize the Database

Use the provided init.sql file to create the necessary tables in your MySQL database.

Run the following command to seed the master tables:

```bash
npm run seed
```

## 5. Run the Application

Navigate back to the root directory of the project:

```bash
cd ..
```

Start the application:

```bash
npm run dev
```

## 6. Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

And You should see the application running.

**Notes:**

Additional environment variables may be required for other parts of the application, but the ones listed above are sufficient for the base app to function.

Database migrations will be added in the future for easier setup.

### Making a Pull Request

1. Fork the repo
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request, and be sure to check the [Allow edits from maintainers](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) option while creating your PR. This allows maintainers to collaborate with you on your PR if needed.
6. If possible, [link your pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) by adding the appropriate keyword (e.g. `fixes issue #XXX`)
7. Before requesting a review, please make sure that all [Github Checks](https://docs.github.com/en/rest/checks?apiVersion=2022-11-28) have passed and your branch is up-to-date with the `main` branch. After doing so, request a review and wait for a maintainer's approval.

All PRs should target the `main` branch.
