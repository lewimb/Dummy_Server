## Starting the Server

Enter the following command to run the server:

1. Installing dependencies

```bash
npm install
```

2. Running the server

```bash
npm start
```

Server is running on port 8080 by default

## Database Configuration

Database is configured using PostgreSQL and can be further
configured by creating a .env file with the following
variables:

- DB_HOST -> defaults to "localhost"
- DB_DATABASE -> defaults to "dev"
- DB_USER -> defaults to "postgres"
- DB_PASSWORD -> defaults to "postgres"
- DB_PORT -> defaults to 5432

Database pool connection is in src/config/db.js
