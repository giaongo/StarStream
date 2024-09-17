import asyncpg
import bcrypt
from ..models.types import User
from quart import g
from quart_bcrypt import check_password_hash, generate_password_hash


def hash_password(password:str) -> str:
    """Hashing raw password

    Args:
        password (str): _description_

    Returns:
        str: _description_
    """
    return generate_password_hash(password, 12).decode('utf-8')


def check_password(hashed_pw: str, raw_pw: str) -> bool:
    """Compare password

    Args:
        hashed_pw (str):
        raw_pw (str):

    Returns:
        bool
    """
    return check_password_hash(pw_hash=hashed_pw, password=raw_pw)


async def admin_exists(email: str, conn:any) -> bool|None:
    """Check admin existence in database

    Args:
        email (str) 

    Returns:
        bool|None
    """
    try: 
        user_result = await conn.fetchrow("SELECT * FROM admin where email = $1", email)
        return user_result != None
    except Exception as error:
        print(f'error getting user from db ', error)
        return None
    
    
async def add_default_admin(defaultUser: User, dbUrl: str) -> bool:
    """Add default admin to databse

    Args:
        defaultUser (User)
    Returns:
        bool:
    """
    conn = await asyncpg.connect(dbUrl)
    try: 
        exist_result = await admin_exists(email=defaultUser.email, conn=conn)
        
        if (exist_result != None and not exist_result):
            hashed_pw = hash_password(defaultUser.password)
            await conn.execute('''INSERT INTO admin (email, password) VALUES ($1, $2)''', 
                           defaultUser.email, 
                           hashed_pw)
            return True
        else:
            print(f'admin exists or error getting admin user')
            return False
    
    except Exception as error:
        print(f'error adding user to db {error}')
        return False
    finally: 
        await conn.close()


async def test_database(url: str):
    try: 
        conn = await asyncpg.connect(url)
        hashed_pw = hash_password(password="test")
        await conn.execute('''INSERT INTO admin (email, password) VALUES ($1, $2)''', "test1", hashed_pw)
        await conn.close()
   
    except Exception as error:
        print(f'error testing the database {error}')