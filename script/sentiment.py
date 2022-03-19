import sys
import re
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from transformers import pipeline

filename = sys.argv[1]
lines = tuple(open(filename, 'r'))

tokenizer = AutoTokenizer.from_pretrained("tblard/tf-allocine")
model = TFAutoModelForSequenceClassification.from_pretrained("tblard/tf-allocine")

nlp = pipeline('sentiment-analysis', model=model, tokenizer=tokenizer)

for line in lines :
    sentences = re.split('(?<=[.!?\n]) +',line)

    for sentence in sentences :
        sentence = sentence.strip()

        if sentence:
            print(sentence)
            result = nlp(sentence)

            if result[0]['score'] > 0.9 :
                print(result[0]['label'])
            else :
                print("NEUTRAL")