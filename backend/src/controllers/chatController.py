from ..models.broker import Broker
from quart import websocket


async def _receive(broker: Broker) -> None:
    while True:
        message = await websocket.receive()
        print(f"Received message: {message}")
        await broker.publish(message)
