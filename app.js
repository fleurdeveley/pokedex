let allPokemon = [];
let pokemonFin = [];

const searchInput = document.querySelector('.pokemon-search input');
const listPokemon = document.querySelector('.pokemon-list');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};

function fetchPokemonBase() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        .then(response => response.json())
        .then((allPoke) => {
            allPoke.results.forEach((pokemon) => {
                fetchFullPokemon(pokemon);
            })
        })
}

fetchPokemonBase();

function fetchFullPokemon(pokemon) {
    let objectFullPokemon = {};
    let namePokemon = pokemon.name;
    let urlPokemon = pokemon.url;

    fetch(urlPokemon)
    .then(response => response.json())
    .then((pokemonData) => {
        objectFullPokemon.picture = pokemonData.sprites.front_default;
        objectFullPokemon.type = pokemonData.types[0].type.name;
        objectFullPokemon.id = pokemonData.id;
    })

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${namePokemon}`)
    .then(response => response.json())
    .then((pokemonData) => {
        objectFullPokemon.name = pokemonData.names[4].name;
        allPokemon.push(objectFullPokemon);

        if(allPokemon.length === 100) {
            endTable = allPokemon.sort((a, b) => {
                return a.id - b.id;
            }).slice(0,21);

            createCard(endTable);
            chargement.style.display = "none";
        }
    })
}

// cards creation
function createCard(array) {
    for(let i =0; i < array.length; i++) {
        const card = document.createElement('li');
        let color = types[array[i].type];
        card.style.background = color;

        const textCard = document.createElement('h5');
        textCard.innerText = array[i].name;

        const idCard = document.createElement('p');
        idCard.innerText = `ID# ${array[i].id}`;

        const imgCard = document.createElement('img');
        imgCard.src = array[i].picture;

        card.appendChild(imgCard);
        card.appendChild(textCard);
        card.appendChild(idCard);

        listPokemon.appendChild(card);
    }
}

// infinite scroll
window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // scrolltop : scroll from top.
    // scrollHeight : full-scroll.
    // clientHeight : window height, visible part.
    
    if(clientHeight + scrollTop >= scrollHeight - 20) {
        addPokemon(6);
    }
})

let index = 21;

function addPokemon(number) {
    if(index > 100) {
        return;
    }

    const arrayToAdd = allPokemon.slice(index, index + number);
    createCard(arrayToAdd);
    index += number;
}

// search bar

// dynamic search
searchInput.addEventListener('keyup', search);

// no dynamic search
// const formRecherche = document.querySelector('form');
// formRecherche.addEventListener('submit', (event) => {
//     event.preventDefault();
//     search();
// })
    
function search() {
    if(index < 100) {
        addPokemon(79);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');
    
    for(i = 0; i < allLi.length; i++) {
        titleValue = allTitles[i].innerText;

        if(titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }
}

// animation input
searchInput.addEventListener('input', function(event) {
    if(event.target.value !== "") {
        event.target.parentNode.classList.add("active-input");
    } else if(event.target.value === "") {
        event.target.parentNode.classList.remove("active-input");
    }
})
