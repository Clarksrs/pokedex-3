// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeHP = document.querySelector('.poke-HP');
const pokeAtt = document.querySelector('.poke-att');
const pokeDef = document.querySelector('.poke-def');
const pokeSpcAtt = document.querySelector('.poke-spcAtt');
const pokeSpcDef = document.querySelector('.poke-spcDef');
const pokeSpeed = document.querySelector('.poke-speed');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const topButton = document.querySelector('.top-button');
const bottomButton = document.querySelector('.bottom-button');
const pageText = document.querySelector('#page-number');
let pageNumber=1;


// constants and variables
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;


// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

const fetchPokeList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];
          pokeListItem.textContent = id + '. ' + capitalize(name);
        } else {
          pokeListItem.textContent = '';
        }
      }
    });
};

const fetchPokeData = id => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      console.table(data.stats);
      resetScreen();

      /*Get Types and Fromat*/
      const dataTypes = data['types'];
      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
      pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
      if (dataSecondType) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
      } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
      }
      mainScreen.classList.add(dataFirstType['type']['name']);


      pokeName.textContent = capitalize(data['name']);
      pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
      pokeWeight.textContent = data['weight']; 
      pokeHeight.textContent = data['height'];
      pokeHP.textContent = data.stats[0].base_stat; 
      pokeAtt.textContent = data.stats[1].base_stat;
      pokeDef.textContent = data.stats[2].base_stat; 
      pokeSpcAtt.textContent = data.stats[3].base_stat;
      pokeSpcDef.textContent = data.stats[4].base_stat; 
      pokeSpeed.textContent = data.stats[5].base_stat;
      pokeFrontImage.src = data['sprites']['front_default'] || '';
      pokeBackImage.src = data['sprites']['back_default'] || '';
    });
};

const disableButtons = () =>{
  leftButton.removeEventListener('click', handleLeftButtonClick);
  rightButton.removeEventListener('click', handleRightButtonClick);
  bottomButton.removeEventListener('click', handleLeftButtonClick);
  topButton.removeEventListener('click', handleRightButtonClick);
}

const enableButtons = () =>{
  leftButton.addEventListener('click', handleLeftButtonClick);
  rightButton.addEventListener('click', handleRightButtonClick);
  bottomButton.addEventListener('click', handleLeftButtonClick);
  topButton.addEventListener('click', handleRightButtonClick);
}

const handleLeftButtonClick = () => {
  disableButtons();
  if (prevUrl) {    
    fetchPokeList(prevUrl);
    pageNumber--;
    pageText.innerText=pageNumber;
  }  
    setTimeout(enableButtons, 100);
};

const handleRightButtonClick = () => {
  disableButtons();
  if (nextUrl) {    
    if (pageNumber===15){}
    else {
      fetchPokeList(nextUrl);
    pageNumber++;
    pageText.innerText=pageNumber;
    }    
    setTimeout(enableButtons, 100);
  }
};

const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};


// adding event listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
bottomButton.addEventListener('click', handleLeftButtonClick);
topButton.addEventListener('click', handleRightButtonClick);

for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}


// initialize App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10');
