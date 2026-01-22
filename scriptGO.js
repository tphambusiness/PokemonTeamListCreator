'use strict'


import * as pkg from './pvpokeparser.mjs';
// const { pvpokeparser } = pkg;

let teamString = '[{"speciesId":"scizor_shadow","fastMove":"BULLET_PUNCH","chargedMoves":["NIGHT_SLASH","TRAILBLAZE"],"shadowType":"shadow","cp":1500,"hp":105,"bestBuddy":false,"isShadow":true},{"speciesId":"talonflame_shadow","fastMove":"INCINERATE","chargedMoves":["FLAME_CHARGE","FLY"],"shadowType":"shadow","cp":1500,"hp":135,"bestBuddy":false,"isShadow":true},{"speciesId":"stunfisk","fastMove":"THUNDER_SHOCK","chargedMoves":["MUD_BOMB","DISCHARGE"],"level":27,"ivs":[0,12,15],"cp":1498,"hp":177,"bestBuddy":false,"isShadow":false},{"speciesId":"furret","fastMove":"SUCKER_PUNCH","chargedMoves":["SWIFT","TRAILBLAZE"],"level":35.5,"ivs":[1,15,14],"cp":1500,"hp":162,"bestBuddy":false,"isShadow":false},{"speciesId":"guzzlord","fastMove":"DRAGON_TAIL","chargedMoves":["BRUTAL_SWING","SLUDGE_BOMB"],"cp":1499,"hp":265,"bestBuddy":false,"isShadow":false},{"speciesId":"jellicent","fastMove":"HEX","chargedMoves":["SURF","SHADOW_BALL"],"cp":1499,"hp":156,"bestBuddy":false,"isShadow":false}]';
let team = JSON.parse(teamString);

let mon1 = pkg.Pokemon.fromObject(team[0]);

console.log(mon1.speciesId);
console.log(pkg.pokemonMap.get(mon1.speciesId));

//Thanks a lot to @joezhuu for these brilliant changes
const urlParams = new URLSearchParams(window.location.search);
document.getElementById('playerName').value = urlParams.get('player');
document.getElementById('trainerName').value = urlParams.get('trainer');
document.getElementById('playerId').value = urlParams.get('id');
document.getElementById('birth').value = urlParams.get('dob');
if (urlParams.get('lang')){
    document.getElementById(urlParams.get('lang')).checked = true;
}

/*
const langs = ['Chs', 'Cht', 'En', 'Es', 'Fre', 'Ger', 'Ita', 'Jpn', 'Kor'];

for (let i = 0; i < langs.length; i++) {
    for (let z = 0; z < langFiles.length; z++) {
        var myScript = document.createElement('script');
        myScript.setAttribute('src', langFiles[z] + langs[i] + '.js');
        document.head.appendChild(myScript);
    }
}
*/

const params = Object.fromEntries(urlParams.entries());


for (let i = 0; i < 7; i++) {
    var pholder = document.createElement('script');
    pholder.setAttribute('src', `./Fonts/font${i+1}.js`);
    document.head.appendChild(pholder);
}

const button = document.getElementById('print');
const sheets = document.getElementsByName('sheet');

/*
function getStats(poke, ivs, level) {
    // if you need to reverse calc CP and HP given base stats, level, ivs
    // not normally needed with pvpoke team builder json export

    var ret = {'hp': 0, 'atk': 0, 'def': 0};

    var baseStats = pokedex[poke];
    //var nature = natures[nat];

    // use for final stat calcs as multiplier
    let monScalar = scalarsMap[level];

    for (const [key, value] of Object.entries(baseStats)){
        if (key == 'hp'){
            //var stat = Math.floor(((((2 * baseStats.hp) + (evs.hp/4) + ivs.hp) * level)/100) + level + 10);
            let stat = (baseStats.hp + ivs.hp) * monScalar; // check hp formula later
            ret['hp'] = stat;
        } else { // cp
            //var stat = Math.floor(Math.floor((((((2 * baseStats[key]) + (evs[key]/4) + ivs[key]) * level) / 100) + 5)) * nature[key]);
            
             
            //combat power formula: 
            //CP = MAX (10,  [ (Base ATK + Atk IV) * (Base Def + Def IV)^0.5 * (Base Stamina + Stamina IV)^0.5 * LevelMultiplier^2 / 10 ])
            
            let stat = max(((baseStats.atk + ivs.atk) * ((baseStats.def + ivs.def) ** 0.5) * ((baseStats.hp + ivs.hp) ** 0.5) * (monScalar ** 2) / 10),10);
            ret[key] = stat;
        }
        // future: calculate atk and defense to decimal?
        // *unnecessary for team sheet
    }

    return ret
}
*/


// given moveID, get the move from pvpoke moves.json
// should parse both fast and charged moves 
// todo: multi language support
// would require parsing of pokeminers jsons -> extract to readable format
function naturalNameMove(move) {
    return pkg.Pokemon.moveMap(move);
}

// similar as above but using species id
function naturalNamePokemon(id) {
    return pkg.Pokemon.pokemonMap(id);
}

function sheetChange(event) {

    if (event.target.id == "reg"){
        var langInputs = document.querySelectorAll("#listLang input");
        for (const element of langInputs) {
          element.setAttribute("type", "checkbox");
          element.checked = true;
        }

        var spanTags = document.querySelectorAll('#listLang .dot');
        for (const element of spanTags) {
            element.style.borderRadius  = 0;
        }

        var spanTags = document.querySelectorAll('#listLang .option');
        for (const element of spanTags) {
            element.classList.add("cb");
        }
    } else {
        var langInputs = document.querySelectorAll("#listLang input");
        for (const element of langInputs) {
            element.setAttribute("type", "radio");
        }

        var spanTags = document.querySelectorAll('#listLang .dot');
        for (const element of spanTags) {
            element.style.borderRadius  = "50%";
        }

        var spanTags = document.querySelectorAll('#listLang .option');
        for (const element of spanTags) {
            element.classList.remove("cb");
        }
    }

}

// Thanks to DhSufi for the following jsPDF code
function generateStaffList(){
    document.getElementById('error').innerText = '';

    var playerName = document.getElementById('playerName').value;
    var trainerName = document.getElementById('trainerName').value;
    var playerId = document.getElementById('playerId').value;
    var birth = document.getElementById('birth').value;
    //var event = document.getElementById('event').value;
    var paste = document.getElementById('paste').value;
    var chosenLang = document.querySelectorAll('input[name="radioLang"]:checked');

    // todo: fix inputted value validation for selection boxes/etc
    /*
    for (var sheet of sheets) {
        if (sheet.checked){
            sheet = sheet.value;
            break;
        }
    }

    if (!sheet){
        document.getElementById('error').innerText = 'NO TEAM LIST SELECTED';
        return
    }
    else if (!paste) {
        document.getElementById('error').innerText = 'NO PASTE DETECTED';
        return
    }
    else if (chosenLang.length === 0){
        document.getElementById('error').innerText = 'NO LANGUAGE SELECTED';
        return
    }
    */

    //var pokes = parsedTeam.teams[0].pokemon;
    
    let pokejson = JSON.parse(paste);
    let pokes = pkg.Pokemon.fromObject(pokejson);

    for (let i = 0; i < pokes.length; i++) {

        var textX = 35;
        var statX = 100;
        var gapX = 100;
        var textXX = 27.5;

        var pokeY = 67;
        //var teraY = pokeY + 9.5;
        //var levelY = pokeY + 9.5;
        //var abilityY = pokeY + 18;
        //var itemY = pokeY + 26;
        var gapY = 70;

        var moveY = pokeY + 34;
        var moveGapY = 8;

        var statY = pokeY + 19;
        var statGapY = 8;

        var nameId = PokeTranslator[pokes[i].name];

        var level = 50;
        if (pokes[i].level){
            level = pokes[i].level;
        }

        /*
        var ivs = {'hp': 15, 'atk': 15, 'def': 15};
        if (pokes[i].ivs) {
            for (const [key, value] of Object.entries(pokes[i].ivs)){
                ivs[key] = value;
            }
        }
        */

        // data validation
        // todo: adjust for pogo gamemaster
        /*
        if (!pokedex[pokes[i].name]){
            document.getElementById('error').innerText = 'ERROR IN PASTE';
            return;
        }
        */

        var name = window['pokes' + chosenLang][nameId];

        // split for fast and charged move
        var movs = [];
        for (let x = 0; x < pokes[i].moves.length; x++){
            var moveId = MoveTranslator[pokes[i].moves[x]];
            movs.push(window['moves' + chosenLang][moveId]);
        }

        doc.setFontSize(13);
        doc.setFont("text1", 'normal');
        doc.text("Pokémon", textXX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY, "right");
        doc.setFontSize(12);
        doc.setFont("customFont", 'normal');
        doc.text(name, textX + (i%2) * gapX, pokeY + (Math.floor(i/2)) * gapY);

        for (let j = 0; j < movs.length; j++) {
            doc.setFontSize(13);
            doc.setFont("text1", 'normal');
            doc.text("Move " + (j+1), textXX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY, "right");
            doc.setFontSize(11);
            doc.setFont("customFont", 'normal');
            doc.text(movs[j], textX + (i%2) * gapX, moveY + (Math.floor(i/2)) * gapY + j * moveGapY);
        }
        
        

        if (sheet == "close") {
            //var stats = getStats(pokes[i].name, ivs, evs, level, nature);
            let stats = pokes[i]; // todo: fix stats to array of mon name, cp, hp, move

            doc.text(level.toString(), statX + (i%2) * (gapX-1), levelY + (Math.floor(i/2)) * gapY, 'right');

            var j = 0;
            for (const [key, value] of Object.entries(stats)){
                doc.text(value.toString(), statX + (i%2) * (gapX-1), statY + (Math.floor(i/2)) * gapY + j * statGapY, 'right');

                j = j + 1;
            }
        }
    }


    const doc = new jspdf.jsPDF();

    var glyph = {
        "english": "1",
        "spanish": "1",
        "portuguese": "1",
        "french": "1",
        "german": "1",
        "indonesian": "1",
        "italian": "1",
        "turkish": "1",
        "russian": "1",
        "korean": "2",
        "thai": "3",
        "hindi": "4",
        "japanese": "5",
        "chinese": "6",
    }

    // doc.addFileToVFS("test.ttf", font6);
    // doc.addFont('test.ttf', 'test', 'normal');

    // doc.setFontSize(12);
    // doc.setFont("test", 'normal');
    //     var msg = "이상해씨 korean"; 
    // doc.text(50, 30, msg);
    //     var msg = "ฟุชิกิดาเนะ thai";
    // doc.text(50, 40, msg);
    //     var msg = "बल्बासॉर hindi";
    // doc.text(50, 50, msg);
    //     var msg = "フシギダネ japanese";
    // doc.text(50, 60, msg);
    //     var msg = "妙蛙種子 chinese T";
    // doc.text(50, 70, msg);
    //     var msg = "妙蛙种子 chinese S";
    // doc.text(50, 80, msg);

    // drawList(doc, "opp");

    // doc.save("-reg.pdf");

    drawList(doc, "staff");

    doc.save("-reg.pdf");

}


function drawList(doc, listType, data){

    if (listType === "staff" || listType === "opp"){
        doc.addFileToVFS("font1.ttf", font1);
        doc.addFont('font1.ttf', 'font1', 'normal');
        doc.addFileToVFS("font7.ttf", font7);
        doc.addFont('font7.ttf', 'font7', 'normal');

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("font1", 'normal');

        var msg = "Name:";
        doc.text(msg, 28, 32);
        doc.line(40, 33, 100, 33);

        var msg = "In-game Nickname:";
        doc.text(msg, 28, 43);
        doc.line(62, 44, 100, 44);

        doc.setFontSize(11);
        doc.setFont("font1", 'normal');
        var msg = "When listing the Pokémon species, include whether that Pokémon is any of the following.";
        doc.text(msg, 26, 53);

        var msg = "•    A regional Pokémon (e.g., Galarian Rapidash)";
        doc.text(msg, 32, 62);

        var msg = "•    A specifically named form (e.g., Wash Rotom)";
        doc.text(msg, 32, 67);

        var msg = "•    A Shadow Pokémon or a Purified Pokémon";
        doc.text(msg, 32, 72);

        var msg = "•    A currently active Best Buddy Pokémon";
        doc.text(msg, 32, 77);

        var msg1 = "For Best Buddy Pokémon, list the CP it will be used at. The Pokémon’s CP must remain the same for";
        var msg2 = "each match; you can only use one Pokémon with the Best Buddy CP boost active.";
        doc.text([msg1, msg2], 26, 85);


        let words;
        if (listType === "staff"){
            doc.setFontSize(16);
            doc.setFont("font7", 'normal');

            var msg = "Pokémon GO Team List";
            doc.text(msg, pageWidth / 2, 18, { 'align': 'center' });

            doc.setFontSize(12);
            doc.setFont("font1", 'normal');

            var msg = "1 of 2: For Tournament Staff";
            doc.text(msg, pageWidth / 2, 24, { 'align': 'center' });

            var msg = "Pokémon Player ID:";
            doc.text(msg, 120, 32);
            doc.line(155, 33, 180, 33);

            var msg = "Birthdate:";
            doc.text(msg, 120, 43);
            doc.line(138.5, 44, 180, 44);

            words = ["Pokémon", "Nickname", "CP & HP", "Fast Attack", "Charged 1", "Charged 2"]

        }
        else if (listType === "opp"){
            doc.setFontSize(16);
            doc.setFont("font7", 'normal');

            var msg = "Pokémon GO Team Preview List";
            doc.text(msg, pageWidth / 2, 18, { 'align': 'center' });

            doc.setFontSize(12);
            doc.setFont("font1", 'normal');
            var msg = "2 of 2: For Opponents";
            doc.text(msg, pageWidth / 2, 24, { 'align': 'center' });

            doc.setFontSize(11);
            var msg = "Event:";
            doc.text(msg, 120, 43);
            doc.line(131.5, 44, 180, 44);

            words = ["Pokémon", "CP", "Fast Attack", "Charged 1", "Charged 2"]
        }


        const row_height = 10
        const rect_width = 166
        const rect_height = row_height * words.length
        const words_gap = row_height / 2
        const cols = [26, 58, 109, 141]
        const rows = [95, 95 + rect_height + 5, 95 + 2 * (rect_height + 5)]

        doc.setLineWidth(0.1);
        for (let i = 0; i < rows.length; i++){

            doc.rect(cols[0], rows[i], rect_width, rect_height);

            // Vertical lines
            for (let j = 1; j < cols.length; j++){
                doc.line(cols[j], rows[i], cols[j], rows[i] + rect_height);
            }
            
            // Horizontal lines
            for (let j = 1; j < words.length; j++) {
                let currY = rows[i]+ row_height * j
                doc.line(cols[0], currY, cols[0] + rect_width, currY);
            }
        }

        doc.setFontSize(13);
        doc.setFont("font7", 'normal');
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < words.length; j++){
                if (j == 0) {
                    doc.text(words[j] + ` ${2*i+1}`, cols[0] + 4, rows[i] + words_gap + (row_height * j), {'baseline': 'middle'});
                    doc.text(words[j] + ` ${2*i+2}`, cols[2] + 4, rows[i] + words_gap + (row_height * j), {'baseline': 'middle'});
                }
                else{
                    doc.text(words[j], cols[0] + 4, rows[i] + words_gap + (row_height * j), {'baseline': 'middle'});
                    doc.text(words[j], cols[2] + 4, rows[i] + words_gap + (row_height * j), {'baseline': 'middle'});
                }
            }
        }

    }

}

button.addEventListener('click', generateStaffList);

document.getElementById("open").checked = true;
window.generatePdf = generatePdf;
window.jsPDF = window.jspdf.jsPDF;
