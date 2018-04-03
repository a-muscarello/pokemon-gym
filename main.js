const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
// const POKEMON_URL = "http://pokeapi.salestock.net/api/v2/pokemon/"; // backup url

class Gym {
  constructor(name) {
    this.name = name;
    this.squad = [];
  }

  get(pokemon) { // takes in pokemon name as argument and returns index of pokemon in squad
    for (var i = 0; i < this.squad.length; i++) {
      if (this.squad[i].name === pokemon) {
        return this.show(i);
      }
    }
    return "error";
  }

  // i = index of pokemon in squad array
  show(i) {
    let $pokeNameId = $(`<h2>${this.squad[i].name}</h2><h2>no: ${this.squad[i].id}</h2>`);
    $( "#name-display" ).html($pokeNameId);
    let $biometrics = $(`<h3>height: ${this.squad[i].height / 10}m</h3><h3>weight: ${this.squad[i].weight / 10}kg</h3>`);
    $( "#biometrics" ).html($biometrics);
    let $baseStats = $(`</br><h3>HP: ${this.squad[i].hp}</h3><div class="stat-bar" style="width: ${this.squad[i].hp * 2}px"></div><h3>attack: ${this.squad[i].attack}</h3><div class="stat-bar" style="width: ${this.squad[i].attack * 2}px"></div><h3>defense: ${this.squad[i].defense}</h3><div class="stat-bar" style="width: ${this.squad[i].defense * 2}px"></div>`);
    $( "#base-stats" ).html($baseStats);
    $( "#abilities" ).html("</br><h3>abilities:</h3>" + `<h3>${this.squad[i].abilities.join(", ")}</h3>`);
    let $image = $(`<img class="pokemon-image" src="${this.squad[i].image}" alt="${this.squad[i].name}">`);
    $ ("#image-display" ).html($image);
    $( "#types" ).html("</br><h3>type:</h3>" + `<h3>${this.squad[i].type.join("/")}</h3>`);

    let self = this;

    $( "#right-arrow" ).click(function(e) {
      i === self.squad.length - 1 ? i = 0 : i++;
      self.show(i);
    });

    $( "#left-arrow" ).click(function() {
      i === 0 ? i = self.squad.length - 1 : i--;
      self.show(i);
    });

    if (this.squad[i].type.length === 2) {
      $( "#main-body" ).css("background", `linear-gradient(90deg, var(--${this.squad[i].type[0]}) 50%, var(--${this.squad[i].type[1]}) 50%)`);
    } else {
      $( "#main-body" ).css("background", `var(--${this.squad[i].type[0]})`);
    }

  }
}

class Pokemon {
  constructor(id, name, height, weight, defense, attack, hp, abilities, type, image) {
    this.id = id;
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.defense = defense;
    this.attack = attack;
    this.hp = hp;
    this.abilities = abilities;
    this.type = type;
    this.image = image;
  }
}

function createPokemon(id) {
  return $.ajax({
    url: POKEMON_URL + id,
    dataType: 'json',
    type: "GET",
  }).done(function(data) {
      console.log("success!");
      let id = data.id;
      let name = data.name;
      let height = data.height;
      let weight = data.weight;
      let defenseStat = data.stats[3].base_stat;
      let attackStat = data.stats[4].base_stat;
      let hpStat = data.stats[5].base_stat;
      let abilities = data.abilities.map(x => x.ability.name);
      let type = data.types.map(x => x.type.name);
      let image = data.sprites.front_default;
      let myPokemon = new Pokemon(id, name, height, weight, defenseStat, attackStat, hpStat, abilities, type, image);
      saffron.squad.push(myPokemon);
  }).fail(function() {
      if (saffron) {
        saffron.show(0);
      } else {
        alert("404 not found");
      }
  });
}

let saffron = new Gym("saffron");
$.when(createPokemon(130)
  ).done(
    createPokemon(208)
  ).done(
    createPokemon(131)
  ).done(
    createPokemon(112)
  ).done(
    createPokemon(143)
  ).done(
    createPokemon(37)
  ).done(function() {
    $(" #image-preloader ").hide();
    saffron.show(0); // pass in 0 by default to show first pokemon in squad
    $(" #name-display ").show();
});
