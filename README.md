# HW1> API Application

This is a RESTful API application built with pure Python that connects to a PostgreSQL database. The API provides various endpoints to manage attractions and users.

## Database

The application is connected to a PostgreSQL database, which stores information about:

- **Attractions** (e.g., museums, parks, historical sites)
- **Users** (user accounts and authentication details)

## Endpoints

The API supports the following endpoints:

### Attractions Endpoints

| Method | Endpoint            | Description                                     |
| ------ | ------------------- | ----------------------------------------------- |
| GET    | \`/attractions\`      | Retrieve all attractions                        |
| GET    | \`/attractions/{id}\` | Retrieve a single attraction by ID              |
| POST   | \`/attractions\`      | Create a new attraction                         |
| PUT    | \`/attractions/{id}\` | Update an existing attraction by ID             |
| DELETE | \`/attractions/{id}\` | Delete an attraction by ID                      |
| GET    | \`/museum\`           | Retrieve all attractions categorized as museums |

### Locations Endpoints

| Method | Endpoint     | Description                                  |
| ------ | ------------ | -------------------------------------------- |
| GET    | \`/locations\` | Retrieve all unique locations of attractions |

### User Endpoints

| Method | Endpoint     | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | \`/users\`     | Retrieve all users            |
| GET    | \`/user/{id}\` | Retrieve a single user by ID  |
| POST   | \`/user\`      | Create a new user             |
| PUT    | \`/user/{id}\` | Update an existing user by ID |
| DELETE | \`/user/{id}\` | Delete a user by ID           |

## Running the Server

To start the API server, run the following command:

\`\`\`bash
python <script_name>.py
\`\`\`

The server will run on port **8083** by default.

## Database Connection

The API retrieves a database connection using the \`get_db_connection()\` function from the \`db_connect\` module. Ensure that the PostgreSQL database is properly configured and accessible.

## Dependencies

- Python
- PostgreSQL
- \`db_connect.py\` (should include the database connection logic)

