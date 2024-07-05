import asyncio
import logging

from temporalio.client import Client
from temporalio.worker import Worker
from teste import buscar_dados_api, calcular_matematica_avancada

interrupt_event = asyncio.Event()
async def main():
    logging.basicConfig(level=logging.INFO)

    client = await Client.connect("localhost:7233")
    handle = Worker(
        client,
        task_queue="matematico",
        activities=[buscar_dados_api, calcular_matematica_avancada],
    )
    await handle.run()


if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        interrupt_event.set()
        loop.run_until_complete(loop.shutdown_asyncgens())
        print("\nShutting down workers")