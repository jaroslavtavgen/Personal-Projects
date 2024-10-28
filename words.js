function splitIntoSentences(text) {
    // Trim whitespace and split the text using regex for punctuation marks followed by whitespace or end of line
    const sentences = text.match(/[^.!?]*[.!?]/g);
    // Return an array of trimmed sentences, filtering out any empty ones
    return sentences ? sentences.map(sentence => sentence.trim()) : [];
}

let chasti_rechi = Array.from({length:10}, _=>[]);

let adjectives = 0;
let adverbs = 1;
let chastitsy = 2;
let deeprichastiya = 3;
let nimetives = 4;
let prichastyya = 5;
let prepositions = 6; 
let unions = 7;
let verbs = 8;
let other = 9;

chasti_rechi[adjectives] = 'банковская банковские банковский банковских банковское больше годовом коммерческая коммерческие коммерческий коммерческое коммерческом корпоративный корпоративная корпоративное корпоративные лучшие намерен намерена огромный офисный офисная офисное первый прошлый эстонская эстонский эстонское эстонскому юридические юридическая юридические юридическое'.split(` `);
chasti_rechi[adverbs] = 'всего еще когда несколько никак почти'.split(` `);
chasti_rechi[chastitsy] = 'ли лишь не'.split(` `);
chasti_rechi[deeprichastiya] = 'включая отмечая'.split(` `);
chasti_rechi[nimetives] = 'другая другие другой им их какая-то какие-то какой-то мы нее он она они оно своем свою что этой этом этот'.split(` `);
chasti_rechi[prichastyya] = 'действующая действующее действующей действующие действующий зарегистрирован зарегистрирована зарегистрированы'.split(` `);
chasti_rechi[prepositions] = 'в до за к на от после с у'.split(` `);
chasti_rechi[unions] = 'а и'.split(` `);
chasti_rechi[verbs] = 'был была были было достигала есть закончила объясняет ответившая ответившее ответившего ответивший ответившее отвечал отвечала отвечали отвечало отвечать отвечаю отказалась отказались отказалось отказался отказаться поинтересовались поинтересовалась поинтересовался поинтересоваться предоставлять предоставляет предоставлял предоставляла предоставляли предоставляло продолжать снизился составил уполномочил уполномочила уполномочили'.split(` `);

document.addEventListener(`click`, a1)
function a1(event)
{
  let nouns = [];
  let sentences = splitIntoSentences(event.target.innerText);
  for(let sentence=0;sentence<sentences.length;sentence++)
  {
    let words = sentences[sentence].match(/[а-я\-]+/gi).map(e=>e.toLowerCase());
    let arr = Array.from({length:words.length}, _=>0);
    for(let word=0;word<words.length;word++)
    {
      let found = 0;
      for(let chast_rechi=0;chast_rechi<chasti_rechi.length-1;chast_rechi++)
      {
        if(chasti_rechi[chast_rechi].includes(words[word]))
        {
          arr[word] = chast_rechi;
          found = 1;
          break
        }
      }
      if(!found && !nouns.includes(words[word])) nouns.push(words[word]);
    }
  }
  console.log(nouns);
}