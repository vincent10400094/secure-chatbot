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
    print('Server starting at: ' + 'ws://{}:{}'.format('127.0.0.1', 4000))
    start_server = websockets.serve(reply, host='127.0.0.1', port=4000)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    run_test()