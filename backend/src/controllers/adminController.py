import asyncpg
from ..models.types import User
from quart import g
from quart_bcrypt import check_password_hash, generate_password_hash
from PIL import Image

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
        user_result = await conn.fetchrow("SELECT * FROM admin WHERE email = $1", email)
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
            await conn.execute("INSERT INTO admin (email, password) VALUES ($1, $2)", 
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



async def check_login(user: User) -> User|None:
    """ Check the admin user in the database and compare the password
    Returns:
        bool:
    """
    try: 
        found_user = await g.connection.fetch_one("SELECT * FROM admin WHERE email = :email", {"email" : user.email})    
        if (found_user and check_password(hashed_pw=found_user["password"],raw_pw=user.password)):
            return User(email=found_user["email"], password=found_user["password"], id=found_user["id"])
        return None
    except Exception as error: 
        print(f'error checking login {error}')
        return None
    
    
def validate_image_extension(filename:str) -> bool:
    print('validate image extension reaches')
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in filename and filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return False
    return True


def store_thumbnail(file, thumbnail_path:str) -> bool:
    """Create thumbnail of the image
    Args:
        file (str)
        thumbnail_path (str)
    """
    size = (500, 500)
    try:
        with Image.open(file) as img:
            img.thumbnail(size)
            img.save(thumbnail_path)
        return True
    except Exception as error:
        print(f'error saving thumbnail {error}')
        return False
    
async def add_event_to_db(event: dict) -> bool:
    """Add event to database

    Args:
        event (dict)

    Returns:
        bool
    """
    try:
        await g.connection.execute("INSERT INTO events (title, event_start_date, event_end_date, event_image, streaming_key) VALUES (:title, :start_date, :end_date, :event_image, :streaming_key)", 
                                   event)
        return True
    except Exception as error:
        print(f'error adding event to db {error}')
        return False