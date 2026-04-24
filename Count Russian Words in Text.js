let text = ``;

class Word {
  value;
  count;

  constructor ( value ) {
      this.value = value;
      this.count = 0;
  }
}

words = text.match(/[а-я]+/gi).map(e=>e.toLowerCase());
uniqueWords = [...new Set(words)].map ( e=> new Word( e ) );

for ( const i in words) {

    uniqueWords.filter(e=>e.value==words[i])[0].count += 1;

}

let i = 1;
while ( i < uniqueWords.length ) {

    if ( uniqueWords[i].count > uniqueWords[i-1].count ) {

        let temp = uniqueWords[i];
        uniqueWords[i] = uniqueWords[i-1];
        uniqueWords[i-1] = temp;
        i = 1;    
    }
    else i++;
}
console.log(uniqueWords);
