function splitIntoSentences(text) {
    // Trim whitespace and split the text using regex for punctuation marks followed by whitespace or end of line
    const sentences = text.match(/[^.!?]*[.!?]/g);
    // Return an array of trimmed sentences, filtering out any empty ones
    return sentences ? sentences.map(sentence => sentence.trim()) : [];
}

document.addEventListener(`click`, a1)

let stored_words = [
  { value: "больше", type: "adjective", gender: "male", case: "instrumental", degree: "comparative" },
  { value: "в", type: "preposition" },
  { value: "времена", type: "noun", singular:false, gender: "neutral", case: "nominative" },
  { value: "год", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "году", type: "noun", singular:true, gender: "male", case: "prepositional" },
  { value: "годовом", type: "adjective", singular:true, gender: "male", case: "instrumental", degree: "none" },
  { value: "достигала", aspect: "imperfective", type: "verb", singular:true, tense: "past", gender: "female"},
  { value: "еще", type: "adjerb"},
  { value: "закончила",aspect: "perfective",  type: "verb", singular:true, tense: "past", gender: "female"},
  { value: "и", type: "union"},
  { value: "компании", type: "noun", singular:true, gender: "female", case: "genitive" },
  { value: "компания", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "лучшие", type: "adjective", singular:false, degree: "superlative"},
  { value: "миллион", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "миллионов", type: "noun", singular:false, gender: "male", case: "genitive" },
  { value: "не", type: "particle", },
  { value: "никак", type: "adverb", },
  { value: "оборот", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "объясняет", aspect: "imperfective", type: "verb", singular:true, tense: "present"},
  { value: "огромный", type: "adjective", singular:true, gender: "male", degree: "none"},
  { value: "отчете", type: "noun", singular:true, gender: "male", case: "prepositional" },
  { value: "почти", type: "adverb" },
  { value: "прибыль", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "прошлая", type: "adjective", singular:true, gender: "female", degree: "none"},
  { value: "прошлый", type: "adjective", singular:true, gender: "male", degree: "none"},
  { value: "с", type: "preposition" },
  { value: "своем", type: "pronoun", singular:true, gender: "male", case: "prepositional" },
  { value: "свой", type: "pronoun", singular:true, gender: "male", case: "nominative" },
  { value: "снизился",aspect: "perfective",  type: "verb", singular:true, tense: "past", gender: "male"},
  { value: "составил", aspect: "perfective", type: "verb", singular:true, tense: "past", gender: "male"},
  { value: "убытки", type: "noun", singular:false, gender: "male", case: "nominative" },
  { value: "убытком", type: "noun", singular:true, gender: "male", case: "instrumental" },
  { value: "убыток", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "эстонская", type: "noun", singular:true, gender: "female", case: "nominative" },
  { value: "эстонский", type: "noun", singular:true, gender: "male", case: "nominative" },
  { value: "этой", type: "pronoun", singular:true, gender: "female", case: "genitive" },
  { value: "этом", type: "pronoun", singular:true, gender: "male", case: "prepositional" },
];


let statistics = Array.from({length: 10}, _=>Array.from({length: 20}, _=>0));

function a1(event)
{
  let sentences = splitIntoSentences(event.target.innerText);
  one: for(let s=0;s<sentences.length;s++)
  {
    let sentence = sentences[s];
    let words = sentence.match(/[а-яa-z0-9\-]+/gi).map(e=>e.toLowerCase());
    for(let w=0;w<words.length;w++)
    {
      if(w == 10) break;
      let word = words[w];
      // If there is not word in the list
      if(!stored_words.filter(e=>e["value"]==word).length){
         
        // If it is a latin word then it is a male noun
        if(word.match(/[a-z]+/gi) && word.match(/[a-z]+/gi)[0] == word)
        {
          statistics[w]
        }
        else if(word.match(/[0-9]+/gi) && word.match(/[0-9]+/gi)[0] == word)
        {
          statistics[w][1] += 1;
        }
        else{
          console.log(word);
          break one;
        }
      }
    }
  }
}
