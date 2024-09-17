from dataclasses import dataclass
from typing import TypeAlias
from quart import Quart


App: TypeAlias = Quart

@dataclass
class User: 
    email: str
    password: str 