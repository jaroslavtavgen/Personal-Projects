with open("the-verdict.txt", "r", encoding="utf-8") as file:
    raw_text = file.read()
print(len(raw_text))
print(raw_text[:99])
import re
text = "Hello, world. This, is a test."
result = re.split(r'(\s)', text)
result = re.split(r'([,.]|\s)', text)
print(result)
result = [ item for item in result if item.strip() ]
print(result)
text = "Hello, world. Is this-- a test?"
result = re.split(r'([,.:;?_!"()\']|--|\s)', text)
result = [item.strip() for item in result if item.strip()]
print(result)
preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', raw_text)
preprocessed = [item.strip() for item in preprocessed if item.strip()]
print(len(preprocessed))
print(preprocessed[:30])
all_words = sorted(set(preprocessed))
vocab_size = len(all_words)
print(vocab_size)
vocab = {token:integer for integer, token in enumerate(all_words)}
for i, item in enumerate(vocab.items()):
    print(item)
    if i >= 50:
        break