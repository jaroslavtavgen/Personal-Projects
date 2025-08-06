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