function splitIntoSentences(text) {
    // Trim whitespace and split the text using regex for punctuation marks followed by whitespace or end of line
    const sentences = text.match(/[^.!?]*[.!?]/g);
    // Return an array of trimmed sentences, filtering out any empty ones
    return sentences ? sentences.map(sentence => sentence.trim()) : [];
}

document.addEventListener(`click`, a1)

let stored_words = [
  { value: "в", type: "preposition" },
  { value: "времена", type: "noun", singular:false, gender: "neutral", case: "nominative" },
  { value: "год", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "годовом", type: "adjective", singular:true, gender: "male", case: "instrumental" },
  { value: "достигала", aspect: "imperfective", type: "verb", singular:true, tense: "past", gender: "female"},
  { value: "закончила",aspect: "perfective",  type: "verb", singular:true, tense: "past", gender: "female"},
  { value: "компании", type: "noun", singular:true, gender: "female", case: "genitive" },
  { value: "компания", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "лучшие", type: "adjective", singular:false},
  { value: "миллион", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "миллионов", type: "noun", singular:false, gender: "male", case: "genitive" },
  { value: "не", type: "particle", },
  { value: "никак", type: "adverb", },
  { value: "объясняет", aspect: "imperfective", type: "verb", singular:true, tense: "present"},
  { value: "отчете", type: "noun", singular:true, gender: "male", case: "prepositional" },
  { value: "почти", type: "adverb" },
  { value: "прибыль", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "прошлая", type: "adjective", singular:true, gender: "female"},
  { value: "прошлый", type: "adjective", singular:true, gender: "male"},
  { value: "с", type: "preposition" },
  { value: "своем", type: "pronoun", singular:true, gender: "male", case: "prepositional" },
  { value: "свой", type: "pronoun", singular:true, gender: "male", case: "nominative" },
  { value: "убытки", type: "noun", singular:false, gender: "male", case: "nominative" },
  { value: "убытком", type: "noun", singular:true, gender: "male", case: "instrumental" },
  { value: "убыток", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "эстонская", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "эстонский", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "этой", type: "pronoun", singular:true, gender: "female", case: "genitive" },
];


let statistics = Array.from({length: 10}, _=>Array.from({length: 20}, _=>0));

function a1(event)
{
  let sentences = splitIntoSentences(event.target.innerText);
  one: for(let sentence=0;sentence<sentences.length;sentence++)
  {
    let words = sentences[sentence].match(/[а-яa-z0-9\-]+/gi).map(e=>e.toLowerCase());
    
    for(let word=0;word<words.length;word++)
    {
      if(word == 10) break;
      if(!stored_words.filter(e=>e["value"]==words[word]).length){
        if(words[word].match(/[a-z]+/gi) && words[word].match(/[a-z]+/gi)[0] == words[word])
        {
          statistics[word][0] += 1;
        }
        else if(words[word].match(/[0-9]+/gi) && words[word].match(/[0-9]+/gi)[0] == words[word])
        {
          statistics[word][1] += 1;
        }
        else{
          console.log(words[word]);
          break one;
        }
      }
    }
  }
}
