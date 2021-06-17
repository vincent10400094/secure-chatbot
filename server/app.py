import asyncio
import websockets
import json
from aws_comprehend import getPII
import boto3

chatBox = {}
chatBotList = []
reservePII = []
comprehend = boto3.client(service_name='comprehend')


async def reply(client, path):
    async for message in client:
        request = json.loads(message)
        chatBoxName = 'test'
        
        replyMessage = {}
        if request['type'] == 'CHAT':
            if not chatBox.get(chatBoxName):
                chatBox[chatBoxName] = set([(client, request['data']['isChatBot'])])
            else:
                chatBox[chatBoxName].add((client, request['data']['isChatBot']))
            
            if request['data']['isChatBot']:
                chatBotList.append(request['data']['name'])
                global reservePII
                reservePII = request['data']['filters']
                replyMessage = {
                    'type' : 'CHAT',
                    'data' : {
                        'messages': [],
                        'filters' : request['data']['filters']
                    }
                }
                replyMessage = json.dumps(replyMessage)
                await client.send(replyMessage)
            else:
                replyMessage = {
                    'type' : 'CHAT',
                    'data' : {
                        'messages': [],
                        'filters' : []
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
            
            cleanMessage_ = ''
            echoText_ = ''
            replyMessage_ = json.dumps(replyMessage)
            users = list(chatBox[chatBoxName])
            
            if len(chatBotList) > 0:
                if replyMessage['data']['message']['name'] not in chatBotList:
                    text = request['data']['body']
                    entities = getPII(comprehend, text)['Entities']
                    for entity in entities:
                        if entity['Type'] not in reservePII:
                            text = text[:entity['BeginOffset']] + '*' * (entity['EndOffset'] - entity['BeginOffset']) + text[entity['EndOffset']:]
                    replyMessage['data']['message']['body'] = text
                    echoText_ = text
                    cleanMessage_ = json.dumps(replyMessage)
                else:
                    cleanMessage_ = json.dumps(replyMessage)

            for user in users:
                try:
                    if user[1]:
                        await user[0].send(cleanMessage_)
                    
                    else:
                        await user[0].send(replyMessage_)
                        for chatBot in chatBotList:
                            echo = {
                                'type' : 'MESSAGE',
                                'data' : {
                                    'message': {
                                        'name' : chatBot,
                                        'body' : f"[Message {chatBot} actually saw] : " + echoText_
                                    }
                                }
                            }
                            echo = json.dumps(echo)
                            await user[0].send(echo)
                
                except websockets.ConnectionClosed:
                    chatBox[chatBoxName].remove(user)
        

def run_test():
    serverIP = '140.112.30.35'
    serverPort = 4000
    print('Server starting at: ' + 'ws://{}:{}'.format(serverIP, serverPort))
    start_server = websockets.serve(reply, host=serverIP, port=serverPort)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    run_test()
