import asyncio
import websockets
import json

chatbox = {}

async def reply(client, path):
    async for message in client:
        request = json.loads(message)
        chatBoxName = 'test'
        
        replyMessage = {}
        if request['type'] == 'CHAT':
            if not chatbox.get(chatBoxName):
                chatbox[chatBoxName] = set([client])
            else:
                chatbox[chatBoxName].add(client)
            
            replyMessage = {
                'type' : 'CHAT',
                'data' : {
                    'messages': []
                }
            }
            replyMessage = json.dumps(replyMessage)
            await client.send(replyMessage)
        
        elif request['type'] == 'MESSAGE':
            replyMessage = {
                'type' : 'MESSAGE',
                'data' : {
                    'message': {
                        'name' : request['data']['name'],
                        'body' : request['data']['body']
                    }
                }
            }
            replyMessage = json.dumps(replyMessage)
            for user in chatbox[chatBoxName]:
                await user.send(replyMessage)
        

def run_test():
    serverIP = '140.112.30.34'
    serverPort = 4000
    print('Server starting at: ' + 'ws://{}:{}'.format(serverIP, serverPort))
    start_server = websockets.serve(reply, host=serverIP, port=serverPort)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    run_test()