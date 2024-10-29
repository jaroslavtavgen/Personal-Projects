function createElement(name, parent1)
{
  return parent1.appendChild(document.createElement(name));
}
let tags = what => document.getElementsByTagName(what);

createElement(`textarea`, document.body);
createElement(`button`, document.body);
tags(`textarea`)[0].style.height = `400px`;
tags(`textarea`)[0].style.width = `1000px`;
tags(`button`)[0].innerHTML = `OK`;
tags(`button`)[0].addEventListener(`click`, a1);
let index = 0;
let sentences = [];
let words = [];
function a1(event)
{
  sentences = tags(`textarea`)[0].value.split(`\n`);
  tags(`textarea`)[0].value = ``;
  tags(`button`)[0].removeEventListener(`keyup`, a2);
  document.addEventListener(`keyup`, a2);
}
function a2(event)
{
  console.log(event.keyCode)
  if(event.keyCode == 37)
  {
    if ( index > 0 ) index--;  
  }
  if(event.keyCode == 39)
  {
    if ( index < (sentences.length-1) ) index++;  
  }
  tags(`textarea`)[0].value = sentences[index];
}