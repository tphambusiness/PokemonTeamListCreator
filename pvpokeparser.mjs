// loosely based on koffing.js

// import level scalar values from json
// move, pokemon data from pvpoke (EN)
import scalarData from './GameMaster/levelscalar.json' with { type: "json" };
import moveData from './GameMaster/moves.json' with { type: "json" };
import pokemonData from './GameMaster/pokemon.json' with {type: "json" };

// convert json to searchable map
let scalarsMap = new Map();
let moveMap = new Map();
let pokemonMap = new Map();

for (let i of scalarData) {
    scalarsMap.set(i.lvl, i.scalar);
}

for (let j of moveData) {
    moveMap.set(j.moveId, j.name);
}

for (let k of pokemonData) {
    pokemonMap.set(k.speciesId, k.speciesName);
}

// test
// console.log(scalarsMap.get(5.5));
// console.log(moveMap.get("BULLET_PUNCH"));
// console.log(pokemonMap.get("scizor_shadow"));


var POKEMON_STAT_NAMES = ["HP", "Atk", "Def", "CP"];
var Pokemon = class {
  constructor() {

  }
  static fromObject(obj) {
    const p = new Pokemon();
    p.speciesId = obj.speciesId;
    //p.nickname = obj.nickname;
    //p.gender = obj.gender;
    p.level = obj.level;
    //p.shiny = obj.shiny;
    p.shadowType = obj.shadowType;
    p.cp = obj.cp; // combat power
    p.hp = obj.hp;
    p.ivs = obj.ivs; // ivs: [ATK, DEF, HP]
    //p.pokeball = obj.pokeball;
    //p.moves = Array.isArray(obj.moves) ? obj.moves : [];
    p.fastMove = obj.fastMove;
    p.chargedMoves = obj.chargedMoves;
    p.isShadow = obj.isShadow;
    p.BestBuddy = obj.isBestBuddy;
    return p;
  };
  toJson(indentation = 2) {
    return JSON.stringify(this, null, indentation);
  }

};

var PokemonTeam = class {
  constructor(format = "OGL", name = "Untitled", folder = void 0) {
    this.pokemon = [];
    this.name = name;
    this.format = format;
    this.folder = folder;
  }
  static fromObject(obj) {
    const team = new PokemonTeam();
    team.name = obj.name;
    team.format = obj.format;
    team.folder = obj.folder;
    team.pokemon = obj.pokemon ? obj.pokemon.map(function(pokemon) {
      return Pokemon.fromObject(pokemon);
    }) : [];
    return team;
  }
  toJson(indentation = 2) {
    return JSON.stringify(this, null, indentation);
  }
  jsonTeamBuilder(json) {

  }
};
export {
  Pokemon,
  PokemonTeam,
  scalarsMap,
  moveMap,
  pokemonMap
};

/*
let teamString = '[{"speciesId":"scizor_shadow","fastMove":"BULLET_PUNCH","chargedMoves":["NIGHT_SLASH","TRAILBLAZE"],"shadowType":"shadow","cp":1500,"hp":105,"bestBuddy":false,"isShadow":true},{"speciesId":"talonflame_shadow","fastMove":"INCINERATE","chargedMoves":["FLAME_CHARGE","FLY"],"shadowType":"shadow","cp":1500,"hp":135,"bestBuddy":false,"isShadow":true},{"speciesId":"stunfisk","fastMove":"THUNDER_SHOCK","chargedMoves":["MUD_BOMB","DISCHARGE"],"level":27,"ivs":[0,12,15],"cp":1498,"hp":177,"bestBuddy":false,"isShadow":false},{"speciesId":"furret","fastMove":"SUCKER_PUNCH","chargedMoves":["SWIFT","TRAILBLAZE"],"level":35.5,"ivs":[1,15,14],"cp":1500,"hp":162,"bestBuddy":false,"isShadow":false},{"speciesId":"guzzlord","fastMove":"DRAGON_TAIL","chargedMoves":["BRUTAL_SWING","SLUDGE_BOMB"],"cp":1499,"hp":265,"bestBuddy":false,"isShadow":false},{"speciesId":"jellicent","fastMove":"HEX","chargedMoves":["SURF","SHADOW_BALL"],"cp":1499,"hp":156,"bestBuddy":false,"isShadow":false}]';
let team = JSON.parse(teamString);

let mon1 = Pokemon.fromObject(team[0]);


console.log(mon1.speciesId);
console.log(pokemonMap.get(mon1.speciesId));
console.log(mon1.cp);
console.log(mon1.hp);
console.log(mon1.fastMove);
console.log(moveMap.get(mon1.fastMove));
*/

/*
let count = 1;

for (let i of team) {
    console.log(`Pokemon #${count}`);

    console.log(i);

    console.log(i.chargedMoves);

    count++;
};
*/
