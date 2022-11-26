document.addEventListener(`DOMContentLoaded`, function () { onLoad(); } );
// window.addEventListener("mousedown", function (e) { clicked( e ); } );
// window.addEventListener("keydown", function(e) { pressed( e ) } );


function onLoad(){
    data = JSON.parse( JSON.stringify( sample ) );
    loadFonts();
    renderSample();
}

var data = [];
var deck = [];

function renderSample(){
    let a = data.split(`\n`);
    let s = [];
    for( let i = 0; i < a.length; i++ ){
        let dual = a[i].indexOf(`//`) !== -1
        s.push( { 
            ind: i, 
            qty: parseInt( a[i].substring(0,a[i].indexOf(` `)) ), 
            name: dual ? a[i].substring(a[i].indexOf(` `)+1, a[i].indexOf(` /`)) : a[i].substring(a[i].indexOf(` `)+1),
            dual: dual ? i * -1 : null
        } )
        if( dual ){
            s.push( {
                ind: i * -1,
                qty: parseInt( a[i].substring(0,a[i].indexOf(` `)) ), 
                name: a[i].substring(a[i].indexOf(` /`)+4),
                dual: i
            } )
        }
    }
    deck = s;
    populateDeck( 0, 1 );
}

function populateDeck( n, q ){
    if( n >= deck.length ){ setTimeout(() => { displayDeck( 0 ); }, 2000 ); return; }
    gathererer( deck[n].name, n, q );
}

function gathererer( name, ind, prog ){
    fetch(`https://api.magicthegathering.io/v1/cards?name=${name}`, {
        method: 'GET', headers: { 'Accept': 'application/json' }
    })
    .then( response => response.text() )
    .then( text =>
        {
            let data = JSON.parse( text ).cards.filter( function( c ) { return c.name == name } )[0];
            if( data == undefined ){ 
                if( deck[ind].ind < 0 ){ data = JSON.parse( text ).cards[1]; }
                else{ data = JSON.parse( text ).cards[0]; }
            }
            if( data.manaCost !== undefined ){
                let mc = data.manaCost;
                deck[ind].manaCost = mc.split(`}`);
                deck[ind].manaCost.pop();
                for( i in deck[ind].manaCost ){
                    deck[ind].manaCost[i] = deck[ind].manaCost[i].substring(1);
                }
            }
            else{ deck[ind].manaCost = []; }
            deck[ind].text = data.text;
            deck[ind].type = data.type;
            deck[ind].dispType = data.types[0];
            deck[ind].layout = data.layout;
            let iden = data.colorIdentity;
            deck[ind].identity = [];
            if( deck[ind].type.indexOf(`Land`) !== -1 ){ deck[ind].identity = [`L`]; }
            else if( deck[ind].type.indexOf(`Artifact`) !== -1 ){ deck[ind].identity = [`C`]; }
            else{
                if( iden.length == 5 ){
                    deck[ind].identity = [`W`,`U`,`B`,`R`,`G`];
                }
                else if( iden.length == 4 ){
                         if( iden.indexOf(`W`) == -1 ){ deck[ind].identity = [`U`,`B`,`R`,`G`]; }
                    else if( iden.indexOf(`U`) == -1 ){ deck[ind].identity = [`W`,`B`,`R`,`G`]; }
                    else if( iden.indexOf(`B`) == -1 ){ deck[ind].identity = [`W`,`U`,`R`,`G`]; }
                    else if( iden.indexOf(`R`) == -1 ){ deck[ind].identity = [`W`,`U`,`B`,`G`]; }
                    else if( iden.indexOf(`G`) == -1 ){ deck[ind].identity = [`W`,`U`,`B`,`R`]; }
                }
                else if( iden.length == 3 ){
                    // SHARDS
                         if( iden.indexOf(`W`) == -1 && iden.indexOf(`U`) == -1 ){ deck[ind].identity = [`B`,`R`,`G`]; }
                    else if( iden.indexOf(`U`) == -1 && iden.indexOf(`B`) == -1 ){ deck[ind].identity = [`R`,`G`,`W`]; }
                    else if( iden.indexOf(`B`) == -1 && iden.indexOf(`R`) == -1 ){ deck[ind].identity = [`G`,`W`,`U`]; }
                    else if( iden.indexOf(`R`) == -1 && iden.indexOf(`G`) == -1 ){ deck[ind].identity = [`W`,`U`,`B`]; }
                    else if( iden.indexOf(`G`) == -1 && iden.indexOf(`W`) == -1 ){ deck[ind].identity = [`U`,`B`,`R`]; }
                    // WEDGES
                    else if( iden.indexOf(`W`) == -1 && iden.indexOf(`B`) == -1 ){ deck[ind].identity = [`G`,`U`,`R`]; }
                    else if( iden.indexOf(`U`) == -1 && iden.indexOf(`R`) == -1 ){ deck[ind].identity = [`W`,`B`,`G`]; }
                    else if( iden.indexOf(`B`) == -1 && iden.indexOf(`G`) == -1 ){ deck[ind].identity = [`U`,`R`,`W`]; }
                    else if( iden.indexOf(`R`) == -1 && iden.indexOf(`W`) == -1 ){ deck[ind].identity = [`B`,`G`,`U`]; }
                    else if( iden.indexOf(`G`) == -1 && iden.indexOf(`U`) == -1 ){ deck[ind].identity = [`R`,`W`,`B`]; }
                }
                else if( iden.length == 2 ){
                    // ALLIES
                         if( iden.indexOf(`W`) !== -1 && iden.indexOf(`U`) !== -1 ){ deck[ind].identity = [`W`,`U`]; }
                    else if( iden.indexOf(`U`) !== -1 && iden.indexOf(`B`) !== -1 ){ deck[ind].identity = [`U`,`B`]; }
                    else if( iden.indexOf(`B`) !== -1 && iden.indexOf(`R`) !== -1 ){ deck[ind].identity = [`B`,`R`]; }
                    else if( iden.indexOf(`R`) !== -1 && iden.indexOf(`G`) !== -1 ){ deck[ind].identity = [`R`,`G`]; }
                    else if( iden.indexOf(`G`) !== -1 && iden.indexOf(`W`) !== -1 ){ deck[ind].identity = [`G`,`W`]; }
                    // ENEMIES
                    else if( iden.indexOf(`W`) !== -1 && iden.indexOf(`B`) !== -1 ){ deck[ind].identity = [`W`,`B`]; }
                    else if( iden.indexOf(`U`) !== -1 && iden.indexOf(`R`) !== -1 ){ deck[ind].identity = [`U`,`R`]; }
                    else if( iden.indexOf(`B`) !== -1 && iden.indexOf(`G`) !== -1 ){ deck[ind].identity = [`B`,`G`]; }
                    else if( iden.indexOf(`R`) !== -1 && iden.indexOf(`W`) !== -1 ){ deck[ind].identity = [`R`,`W`]; }
                    else if( iden.indexOf(`G`) !== -1 && iden.indexOf(`U`) !== -1 ){ deck[ind].identity = [`G`,`U`]; }
                }
                else{
                    // MONO
                    if( iden.indexOf(`W`) !== -1 ){ deck[ind].identity = [`W`]; }
                    if( iden.indexOf(`U`) !== -1 ){ deck[ind].identity = [`U`]; }
                    if( iden.indexOf(`B`) !== -1 ){ deck[ind].identity = [`B`]; }
                    if( iden.indexOf(`R`) !== -1 ){ deck[ind].identity = [`R`]; }
                    if( iden.indexOf(`G`) !== -1 ){ deck[ind].identity = [`G`]; }
                }
            }
            deck[ind].toughness = data.toughness;
            deck[ind].power = data.power;
            deck[ind].loyalty = data.loyalty;
        }
    )
    .then( p => {
        document.querySelector(`.loading1`).style.width = prog / deck.length * 100 + `%`;
        setTimeout( () => { populateDeck( ind + 1, prog + 1 ); }, 1000 );
    } );
}

function displayDeck( i ){
    if( i >= deck.length ){ return }
    let t = document.getElementById(`main`);
    
    for( let j = 0; j < deck[i].qty; j++ ){
        let c = document.createElement('canvas');
        c.id = `c${deck[i].ind}`;
        c.width = 1600;
        c.height = 2200;
        const ctx = c.getContext('2d');
        // Background
        let iden = [...new Set(deck[i].manaCost.join(``).replace(/[^A-Z]/gi, '').split(``))];
        let bg = iden[0];
        if( iden.length > 1 ){ bg = `X` }
        if( bg == undefined ){ bg = deck[i].identity; }
        let bord = iden[0];
        if( iden.length == 2 ){ bord = `${iden[0]}${iden[1]}` }
        else if( iden.length > 2 ){ bord = `X` }
        if( bord == undefined ){ bord = deck[i].identity; }

        const loadImage = (url) => new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (err) => reject(err));
            img.src = url;
            });
            
        let imageUrls = [
            `bg/${bg}.png`,
            `panels/${bg}.png`,
            `panels/lighten.png`,
            `frame/${bord}.png`,
            `a/${deck[i].name}.png`,
        ];
        if( deck[i].power !== undefined ){ imageUrls.push(`combat/${bg}.png`)}
        if( deck[i].loyalty !== undefined ){ imageUrls.push(`combat/Loyalty.png`)}
        let p = ( Math.PI / 180 );
        Promise
            .all(imageUrls.map(loadImage))
            .then(([one, two, three, four, five, six]) => {
                ctx.drawImage(one, 0, 0);
                ctx.drawImage(two, 0, 0);
                ctx.drawImage(three, 0, 0);
                ctx.drawImage(four, 0, 0);
                ctx.drawImage(five, 160, 260);
                if( six !== undefined ){ ctx.drawImage(six, 0, 0); }
                // Card Text
                ctx.fillStyle = `#000`;
                let xx = 168;
                if( deck[i].layout == "modal_dfc" ){
                    ctx.font = "65px mana";
                    ctx.fillStyle = `#FFF`;
                    ctx.strokeStyle = `#FFF`;
                    let nn = ``;
                    if( deck[i].ind < 0 ){ nn = ``; }
                    ctx.lineWidth = 5;
                    ctx.strokeText( nn, xx, 227.5);
                    ctx.fillText( nn, xx, 227.5);
                    ctx.fillStyle = `#000`;
                    ctx.fillText( nn, xx, 227.5);
                    xx += 85;
                }
                ctx.font = "65px Beleren2016";
                ctx.fillText(deck[i].name, xx, 222.5);
                ctx.font = "55px Beleren2016";
                ctx.fillText(deck[i].type, 168, 1270);
                ctx.font = "55px MPlantin";
                let d = fragmentText( ctx, deck[i].text, 1180 );
                desc = d.lines;
                doot = d.doots;
                fillDoots = [];
                let y = 1410;
                for( ii in desc ){
                    // Planeswalker Stuff
                    // let loyal = [...new Set(deck[i].manaCost.join(``).replace(/[^0-9]/gi, '').split(``))];
                    let x = 210;
                    if( desc[ii] == `` ){
                        if( desc.length < 10 ){ y -= 40; }
                        else{ y -= 55; }
                    }
                    ctx.fillText( desc[ii], x, y, 1180 );
                    while( desc[ii].indexOf(`--`) >= 0 ){
                        doot[0].y = y;
                        x += ( ctx.measureText( desc[ii].substring( 0, desc[ii].indexOf(`--`) ) ).width ) * ( 10000 / 10075 );
                        doot[0].x = x;
                        x += ctx.measureText( `--` ).width;
                        desc[ii] = desc[ii].substring( desc[ii].indexOf(`--`) + 2 );
                        fillDoots.push( JSON.parse( JSON.stringify( doot[0] ) ) );
                        doot.shift();
                    }
                    y += 65;
                }
                // Mana Symbols
                for( ii in fillDoots ){
                    if( fillDoots[ii].c.indexOf(`/`) > 0 ){
                        let tmp = fillDoots[ii].c.split(`/`);
                        // Base Doot
                        ctx.beginPath();
                        ctx.arc( fillDoots[ii].x + 20, fillDoots[ii].y - 15, 22.5, 0, 2 * Math.PI );
                        if( color[tmp[0].toLowerCase() ] == undefined ){ ctx.fillStyle = color[`c`]; }
                        else{ ctx.fillStyle = color[tmp[0].toLowerCase()]; }
                        ctx.fill();
                        ctx.closePath();
                        // Second Doot
                        ctx.beginPath();
                        ctx.arc( fillDoots[ii].x + 20, fillDoots[ii].y - 15, 22.5, 315 * p, 135 * p );
                        if( color[tmp[1].toLowerCase() ] == undefined ){ ctx.fillStyle = color[`c`]; }
                        else{ ctx.fillStyle = color[tmp[1].toLowerCase()]; }
                        ctx.fill();
                        ctx.closePath();
                        // First Symbol
                        ctx.font = "25px MTG2016";
                        ctx.fillStyle = `#000`;
                        ctx.fillText(tmp[0], fillDoots[ii].x - 1, fillDoots[ii].y - 15 );
                        // Second Symbol
                        ctx.fillText(tmp[1], fillDoots[ii].x + 17.5, fillDoots[ii].y + 2.5 );
                    }
                    else{
                        if( color[fillDoots[ii].c.toLowerCase() ] == undefined ){ ctx.fillStyle = color[`c`]; }
                        else{ ctx.fillStyle = color[fillDoots[ii].c.toLowerCase()]; }
                        ctx.beginPath();
                        ctx.arc( fillDoots[ii].x + 20, fillDoots[ii].y - 15, 22.5, 0, 2 * Math.PI );
                        ctx.fill();
                        ctx.font = "50px MTG2016";
                        ctx.fillStyle = `#000`;
                        ctx.fillText(fillDoots[ii].c, fillDoots[ii].x - 1, fillDoots[ii].y);
                        ctx.closePath();
                    }
                }
                // Mana Cost Doots
                x = 1375;
                y = 222.5;
                for( let j = deck[i].manaCost.length - 1; j >= 0; j-- ){
                    // Mana Doot Shadow
                    ctx.beginPath();
                    ctx.arc( x + 27.5, y - 20, 32.5, 0, 2 * Math.PI );
                    ctx.fillStyle = `#000`;
                    ctx.fill();
                    if( deck[i].manaCost[j].indexOf(`/`) > 0 ){
                        let tmp = deck[i].manaCost[j].split(`/`);
                        // Second Semicircle
                        if( color[tmp[1]] == undefined ){ ctx.fillStyle = color.c; }
                        else{ ctx.fillStyle = color[tmp[1].toLowerCase()]; }
                        ctx.beginPath();
                        ctx.arc( x + 32.5, y - 25, 32.5, 0, 2 * Math.PI );
                        ctx.fill();
                        // First Semicircle
                        if( color[tmp[0]] == undefined ){ ctx.fillStyle = color.c; }
                        else{ ctx.fillStyle = color[tmp[0].toLowerCase()]; }
                        ctx.beginPath();
                        ctx.arc( x + 32.5, y - 25, 32.5, 135 * p, 315 * p );
                        ctx.fill();
                        // set font
                        ctx.font = "37.5px MTG2016";
                        // First Symbol
                        ctx.fillStyle = `#000`;
                        ctx.fillText( tmp[0], x + 3.5, y - 22.5, 75 );
                        // Second Symbol
                        ctx.fillText( tmp[1], x + 26.5, y - 2, 75 );
                    }
                    else{
                        ctx.font = "75px MTG2016";
                        // Mana Doot
                        ctx.beginPath();
                        ctx.arc( x + 32.5, y - 25, 32.5, 0, 2 * Math.PI );
                        if( color[deck[i].manaCost[j]] == undefined ){
                            ctx.fillStyle = color.c;
                        }
                        else{ ctx.fillStyle = color[deck[i].manaCost[j].toLowerCase()]; }
                        ctx.fill();
                        // Mana Symbol
                        ctx.fillStyle = `#000`;
                        ctx.fillText( deck[i].manaCost[j], x, y, 75 );
                    }
                    x -= 80;
                }
                // Power, Toughness, Loyalty
                ctx.font = "normal 900 60px MPlantin";
                x = 1465;
                y = 2020;
                s = 15;
                if( deck[i].toughness !== undefined ){
                    x -= 75;
                    ctx.fillStyle = `#000`;
                    ctx.fillText( deck[i].toughness, x, y, 60 );
                    x -= ctx.measureText(`/`).width + s;
                    ctx.fillText( `/`, x, y, 60 );
                    x -= ctx.measureText(deck[i].power).width + s;
                    ctx.fillText( deck[i].power, x, y, 60 );
                }
                if( deck[i].loyalty !== undefined ){
                    x -= 85;
                    ctx.fillStyle = `#FFF`;
                    ctx.fillText( deck[i].loyalty, x, y + 45, 60 );
                }
            });
        t.appendChild(c)
    }
    document.querySelector(`.loading2`).style.width = ( i + 1 ) / ( deck.length ) * 100 + `%`;
    setTimeout(() => {
        displayDeck( i + 1 );
    }, 250 );
}

function fragmentText(ctx, txt, maxWidth) {
    if( txt == undefined ){ return [""], [] }
    let words = txt.split(' ');
    let lines = [];
    let doots = [];
    let line = "";
    while( words.length > 0 ){
        let split = false;
        let doot = null;
        // Handle doots
        while( words[0].indexOf(`{`) !== -1 ){
            words[0] = words[0].replace( `}{`, `} {`);
            doot = words[0].substring(words[0].indexOf(`{`) + 1, words[0].indexOf(`}`) );
            doots.push( { c: doot } );
            words[0] = words[0].replace( `{` + doot + `}`, `--` );
        }
        // Handle manual carriage returns
        if( words[0].indexOf(`\n`) !== -1 ){
            let t1 =  words[0].substring( 0, words[0].indexOf(`\n`) );
            let t2 = words[0].substring( words[0].indexOf(`\n`) + 1 );
            words.shift();
            if( ctx.measureText( line + t1 ).width < maxWidth ){
                line += t1;
                lines.push( line );
            }
            else{
                lines.push( line );
                lines.push( t1 );
            }
            lines.push( "" );
            line = "";
            words.unshift( t2 );
        }
        // Handle actual text
        while( ctx.measureText(words[0]).width >= maxWidth ){
            let tmp = words[0];
            words[0] = tmp.slice( 0, -1 );
            if( !split ){
                split = true;
                words.splice(  1, 0, tmp.slice(-1) );
            }
            else{
                words[1] = tmp.slice(-1) + words[1];
            }
        }
        if( ctx.measureText( line + words[0] ).width < maxWidth ){
            line += words.shift() + " ";
        }
        else{
            lines.push( line );
            line = "";
        }
        if( words.length === 0 ){
            lines.push( line );
        }
    }
    return { lines, doots };
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

async function loadFonts() {
    let font = new FontFace(`MPlantin`, `url(./MPlantin.ttf)`, { style: "normal" });
    await font.load();
    document.fonts.add(font);
    font = new FontFace(`Beleren2016`, `url(./Beleren2016-Bold.ttf)`, { style: "normal", weight: "400", stretch: "condensed", });
    await font.load();
    document.fonts.add(font);
    font = new FontFace(`mana`, `url(./mana.ttf)`, { style: "normal", weight: "400", stretch: "condensed", });
    await font.load();
    document.fonts.add(font);
    font = new FontFace(`MTG2016`, `url(./MTG2016.ttf)`, { style: "normal", weight: "400", stretch: "condensed", });
    await font.load();
    document.fonts.add(font);
    document.body.classList.add("fonts-loaded");
}

const color = {
    W: `#ffc000`, U: `#1a93f5`, B: `#6a38c2`, G: `#48bb4e`, R: `#ef2c28`, C: `#8a8a8a`, L: `#8d5d4c`,
    w: `#fbf9d9`, u: `#c1d9ed`, b: `#bab1ab`, g: `#a6c597`, r: `#f29971`, c: `#cbc6c1`
}
const symbols = {
    Creature: ``
    , Artifact: ``
    , Instant: ``
    , Land: ``
    , Planeswalker: ``
    , Sorcery: ``
    , Enchantment: ``
}


/* TODO

Handle Fucky Card Layouts (https://docs.google.com/document/d/1R_-_AmOKqrWFRM6_H7SsD_usWw7769dL0THkhLN18o0/edit)
Render Cards-within-cards (Bonecrusher Giant)
Render Classes
Render Double Cards
Render Sideways Cards
*/