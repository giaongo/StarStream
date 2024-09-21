import quart_db

#### Please note: this file is not used in the project. It is just a reference for the migration file. ####


async def migrate(connection: quart_db.Connection) -> None:
    # SQL query to create a new table 'users'
    # await connection.execute(
    #     """
    #     CREATE TABLE tests (
    #         id SERIAL PRIMARY KEY,
    #         username VARCHAR(50) UNIQUE NOT NULL,
    #         email VARCHAR(100) NOT NULL,
    #         created_at TIMESTAMP DEFAULT NOW()
    #     );
    #     """
    # )
    return None


async def valid_migration(connection: quart_db.Connection) -> bool:
    # print('validating migration')
    # Check if the 'tests' table was created successfully
    # result = await connection.fetch_one(
    #     """
    #     SELECT COUNT(*) FROM information_schema.tables
    #     WHERE table_name = 'tests';
    #     """
    # )
    # return result[0] > 0  # Return True if the table exists
    return True
