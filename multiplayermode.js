var id; //sotres game id
var p1hand; //stores p1 hand
var p1deck =[]; //sotres p1 deck 
var p2deck =[]; //stores p2 deck 
var player;	//stores the current player 
var card;	//stores the current card
var stateofplayer;//checks teh state of the player
var gameID;	//checks that the game id is equal to the original game ID
var ships;	//stores all the ships as a ship object 
var category;	//stores the current cateogry to be selected

//load new game upon page refresh
window.onload = function(){
    newgame();
}
//function to start a new game
function newgame(){
    console.log("new game function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4 && xmlObj.status === 200) {
            console.log("p1 hand: "+ xmlObj.responseText);
            p1hand = JSON.parse(xmlObj.responseText);
            for (var i = 0; i < 10; i++) {
                p1deck.push(p1hand["C" + i]);
            }
	//store the game id
            id = p1hand.gid;
            
            console.log(id);
            sendcard(1);
            var getID = document.getElementById("gameid");
            getID.innerHTML = "give Id to player 2 to connect to each other!: "+id;
            waitforplayerconnection();
        }

    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/newgame.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send();
}

//function to get the ships of a player
function getships(p){
console.log("get ships function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            console.log(xmlObj.responseText);
            ships = JSON.parse(xmlObj.responseText);
            if(p===1){
                loadcard(); 
            }
            if(p===2){
                loadp2card();
            }
            
        }
    };

    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/getships.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&player=" + player + "&card=" + card);
  
}

//load the p1 card 
function loadcard() {
    
    console.log("load card function running");
    var topCard = ships[p1deck[0]];
    var image = document.getElementById("p1Image");
    var built = document.getElementById("built");
    var tonnage = document.getElementById("tonnage");
    var len = document.getElementById("len");
    var capacity = document.getElementById("capacity");
    var name = document.getElementById("name");

    image.setAttribute("src", "Data/" + topCard.filename);
    name.innerHTML = "Name: " + topCard.name;
    built.innerHTML = "Built: " + topCard.built;
    tonnage.innerHTML = "Tonnage: " + topCard.tonnage;
    len.innerHTML = "Length: " + topCard.len;
    capacity.innerHTML = "Capacity: " + topCard.capacity;

}
//load the card fro player 2
function loadp2card() {
    
    console.log("load p2 card function running");
    var topCard = ships[p2deck[0]];
    var image = document.getElementById("p2Image");

    var built = document.getElementById("p2built");
    var tonnage = document.getElementById("p2tonnage");
    var len = document.getElementById("p2len");
    var capacity = document.getElementById("p2capacity");
    var name = document.getElementById("p2name");

    image.setAttribute("src", "Data/" + topCard.filename);
    name.innerHTML = "Name: " + topCard.name;
    built.innerHTML = "Built: " + topCard.built;
    tonnage.innerHTML = "Tonnage: " + topCard.tonnage;
    len.innerHTML = "Length: " + topCard.len;
    capacity.innerHTML = "Capacity: " + topCard.capacity; 

    var p1image = document.getElementById("p1Image");

}

//send the corresponding card depending on whos turn it is
function sendcard(playerNo) {
    console.log("sending card 1 to server...");
    if (playerNo === 1) {
        getships(playerNo);
        player = 1;
        card = p1hand.C0;
        console.log("p1 top Card: " + card);

    }

    if(playerNo ===2){
        loadp2card();
        player = 2;
        card = p2hand.C0;
        console.log("P2 top card: " + card);

    }
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4 && xmlObj.status === 200) {
            console.log("the state of the game is...");
            getgamestate();

        }


    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/sendcard.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&player=" + player + "&card=" + card);
}

//return whether or not the card has successfully been sent to the server. 
function getgamestate() {
    console.log("get game state function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            console.log(xmlObj.responseText);
            stateofplayer = JSON.parse(xmlObj.responseText);   
        }
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/getgamestate.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id);
}

//query whether or not the two player have the same id. 
function waitforplayerconnection(){

    if(stateofplayer===undefined|| stateofplayer.player2===null ){
        
        setTimeout(waitforplayerconnection,1000);
        getgamestate();
        
    }
}

//load teh cards for p2 
function loadgame() {
    id= document.getElementById("gameID").value;

    console.log(id);
    console.log("load game function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            p2hand = JSON.parse(xmlObj.responseText);
            for(var i = 0; i<10; i++){
            p2deck.push(p2hand["C"+i]);
            
        }
        sendcard(2);
        console.log(p2deck);
        }
       
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/loadgame.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id);
}

//select the corresponding cateogy for whoever's turn it is
function selectButton(cat){
     
    if(cat>0 && cat<=4){
        sendCategory(cat);
        player = 1;

    }
    if(cat>4 && cat <=8){
        cat2 =cat-4;
        sendCategory(cat2);
        player = 2;
    }
}

//send the cateogy to the server with the cards 
function sendCategory(val){
 console.log("send category function running");
 var xmlObj = new XMLHttpRequest();
 xmlObj.onreadystatechange = function() {
    if (xmlObj.readyState === 4 & xmlObj.status == 200) {
        compare(val);
    }
 };
 var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/sendcategory.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&category=" + category);

}
//now allow for the comparison of the cards to take place. 
function compare(cat){
    var p1topCard = ships[p1deck[0]];
    var p2topCard = ships[p2deck[0]];
    console.log("compare function running");
    var key;
    switch(cat){
        case 1:
            key = "built";
            break;
        case 2:
            key = "tonnage";
            break;
        case 3:
            key = "len";
            break;
        case 4:
            key = "capacity";
            break;
    }
    console.log(p1deck);
    console.log(p2deck);
    var p1ship = p1topCard[key];
    var p2ship = p2topCard[key];
    if(p1ship > p2ship){
        var remove = p1deck.shift();
        var append = p1deck.push(remove);
        var remove2 = p2deck.shift();
        var append2 = p1deck.push(remove2);
        var getp1 = document.getElementById("winner");
        getp1.innerHTML = "you won that round!";
	//player 1 wins
        p1counter = p1counter+1;
        p2counter = p2counter-1;
    }
    if(p1ship < p2ship){
        var remove = p2deck.shift();
        var append = p2deck.push(remove);
        var remove2 = p1deck.shift();
        var append2 = p2deck.push(remove2);
        var getp1 = document.getElementById("winner");
        getp1.innerHTML = "you lost that round!";
	//player 2 has won
        p1counter = p1counter-1;
        p2counter = p2counter+1;
    }


    console.log("p1 deck is : "+p1deck);
    console.log("p2 deck is : "+p2deck);
    getScore();

}

//return the score of the game after each round. 
function getScore(){
    console.log("lets calculate the scores");
    var human = document.getElementById("humanscore");
    var comp = document.getElementById("compscore");
    human.innerHTML = "Your Score: " + p1counter;
    comp.innerHTML = "Player 2 score: " + p2counter;
    if(p1counter==20){
        alert("player 1 has won! ");
    }
    if(p2counter==20){
        alert("player 2 has won! ");
    }
    if(player ==1){ 
    var getp2 = document.getElementById("p2");
    getp2.style.visibility = "visible";
    
    setTimeout(function(){
      var remp1 = document.getElementById("p1");
      remp1.style.visibility = "hidden"; 
        compTurn(0);},1000);
    }
    if(player == 0){
        
        var getp1 = document.getElementById("p1");
        getp1.style.visibility = "visible";
        var remp2 = document.getElementById("p2");
        remp2.style.visibility = "hidden";
        setTimeout(loadCard,1000);
        loadP2Card();
        compTurn(1);
        
    }
    
}
