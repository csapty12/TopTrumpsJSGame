var id;//id of game
var player;//current player
var card;//current card being used
var p1hand;//player 1 hand
var p1deck = [];//player 1 stack of 10
var ships;//array of ships
var p2hand;//player 2's hand
var p2deck = [];//player two deck of cards
var category;//category selected
var p1counter=10; //inital player counter
var p2counter = 10;

//create a new game on page refresh
window.onload = function (){
	newGame();
}

//function to start a new game
function newGame(){
	console.log("new game function running");
	var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4 && xmlObj.status === 200) {
            //print out p1hand
            console.log("p1 hand: ")
            console.log(xmlObj.responseText);
            p1hand = JSON.parse(xmlObj.responseText);
            //put elements into list of cards
            for (var i = 0; i < 10; i++) {
                p1deck.push(p1hand["C" + i]);
            }
            id = p1hand.gid;

            //return all ships from server.
            getShips();
        }
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/newgame.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send();
}

//returns data describing each of the ships
function getShips() {
    console.log("get ships function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            console.log(xmlObj.responseText);
            ships = JSON.parse(xmlObj.responseText);
            loadCard();

        }
        console.log(ships);
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/getships.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&player=" + player + "&card=" + card);
  
}

//load player 1 card to the screen. 
function loadCard() {
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
    //send player 1 card to server
    sendCard(1);
}

//send the player card back to the server. 
function sendCard(pNo){
	console.log("sending card to server");
	if (pNo === 1) {
        player = 1;
        card = p1hand.C0;
        console.log("p1 top card is: "+card);
    	if(p2deck.length===0){
    	loadP2Hand();

    }	else{
    	loadP2Card();
    }
	}if(pNo ==0){
    	console.log("accessing player2");
    	player = 0;
        card = p2hand.C0;
        console.log("p2 top card is :" +card)
    }
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4 && xmlObj.status === 200) {
        }
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/sendcard.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&player=" + player + "&card=" + card);
}

//load the remaining hand that is p2
function loadP2Hand(){
	console.log("loading player 2's hand");
	var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            console.log(xmlObj.responseText);
            p2hand = JSON.parse(xmlObj.responseText);
            for (var i = 0; i < 10; i++) {
                p2deck.push(p2hand["C" + i]);
            }
            var removep2 = document.getElementById("p2");
            removep2.style.visibility = "hidden";
            loadP2Card();
        }
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/loadgame.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id);
}

//load the p2 card to the screen for visual purposes. 
function loadP2Card(){

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
    sendCard(0);
}

//send the appropriate cateogy off after the text has been clicked. 
function selectButton(cat){
     	//human card
	if(cat>0 && cat<=4){
		sendCategory(cat);
		player = 1;

	}
	//computer selects card
	if(cat>4 && cat <=8){
		cat2 =cat-4;
		sendCategory(cat2);
        player = 0;
	}
}

//send off the cateogy of the card so that way comparisons can be made. 
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
//compare the cateogy of the two cards values. 
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
	//case where p1 wins the round
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
	//case where p2 wins the round
    	p1counter = p1counter-1;
    	p2counter = p2counter+1;
    }


    console.log("p1 deck is : "+p1deck);
    console.log("p2 deck is : "+p2deck);
    getScore();

}

//function that will getthe score back after each turn. 
//if p1wins then alert, else alert if p2 wins.
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
	//initialise comp mode.
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
//now it is the computer turn to select a value
function compTurn(val){
	if(val == 0){

        setTimeout(function(){
        var getp2 = document.getElementById("p2");
        getp2.style.visibility = "visible";
        var getp1 = document.getElementById("p1");
        getp1.style.visibility = "visible";
            selectButton(Math.round(Math.random()*3+5));
        }, 2000);

    }
}
