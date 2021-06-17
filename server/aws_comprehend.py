import boto3
import json

def getPII(comprehend, text):
    return comprehend.detect_pii_entities(Text=text, LanguageCode='en')

if __name__ == '__main__':
    comprehend = boto3.client(service_name='comprehend')

    with open('detect_sample.txt') as sample_file:
        sample_text = sample_file.read()
    sample_text = json.loads(sample_text)
    # print(getPII(comprehend, sample_text['Text'])['Entities'])
    text = sample_text['Text']
    entities = getPII(comprehend, text)['Entities']
    for entity in entities:
        print(entity['Type'], text[entity['BeginOffset']:entity['EndOffset']])