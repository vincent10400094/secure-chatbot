import asyncio
import websockets
import json

chatBox = {}

async def reply(client, path):
    async for message in client:
        request = json.loads(message)
        chatBoxName = 'test'
        
        replyMessage = {}
        if request['type'] == 'CHAT':
            if not chatBox.get(chatBoxName):
                chatBox[chatBoxName] = set([client])
            else:
                chatBox[chatBoxName].add(client)
            
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
            users = list(chatBox[chatBoxName])
            for user in users:
                try:
                    await user.send(replyMessage)
                except websockets.ConnectionClosed:
                    chatBox[chatBoxName].remove(user)
        

def run_test():
    serverIP = '140.112.30.34'
    serverPort = 4000
    print('Server starting at: ' + 'ws://{}:{}'.format(serverIP, serverPort))
    start_server = websockets.serve(reply, host=serverIP, port=serverPort)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    run_test()
