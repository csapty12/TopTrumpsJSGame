var id; //stores the id of a hand
var getships;//gets all the ships
var player;//required as part of getships
var card;//specific card to be selected
var categoryName = ["built","tonnage","len","capacity"]; //the 4 categories that can be used


window.onload = function() {
    getships();
}

//returns data describing each of the ships
function getships() {
    console.log("get ships function running");
    var xmlObj = new XMLHttpRequest();
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState === 4) {
            console.log(xmlObj.responseText);
            getships = JSON.parse(xmlObj.responseText);


        }
    };
    var url = "http://farthing.ex.ac.uk/students/djw213/toptrumps/api/getships.php";
    xmlObj.open("POST", url, true);
    xmlObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlObj.send("id=" + id + "&player=" + player + "&card=" + card);

}
//function to return a specific ship on demand
function specificship(i){
    var specificship = getships[i];
    console.log(getships[i]);
    var image = document.getElementById("img");
    image.setAttribute("src", "Data/" + specificship.filename);
    loadshipinfo(i);

}
//load the actual card that relates to the specific ship
function loadshipinfo(i){
    var specificship = getships[i];
    var built = document.getElementById("built");
    var tonnage = document.getElementById("tonnage");
    var len = document.getElementById("len");
    var capacity = document.getElementById("capacity");
    var name = document.getElementById("name");

    name.innerHTML = "Name: " + specificship.name;
    built.innerHTML = "Built: " + specificship.built;
    tonnage.innerHTML = "Tonnage: " + specificship.tonnage;
    len.innerHTML = "Length: " + specificship.len;
    capacity.innerHTML = "Capacity: " + specificship.capacity;
    loadgraph(i);

}  

//load the corresponding graph to the specific ship that has been loaded
function loadgraph(i){
    d3.selectAll(".chart > *").remove();
    var dataset = [];
    var specificship = getships[i];
    dataset.push(specificship.built);
    dataset.push(specificship.tonnage);
    dataset.push(specificship.len);
    dataset.push(specificship.capacity);

    //the strucutre of the D3 graph
    var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    console.log(dataset);
var x = d3.scale.linear().domain([d3.max(dataset),100]).range([0,50]);

d3.select(".chart")
  .selectAll("div")
    .data(dataset)
  .enter().append("div")
    .style("width", function(d) {
            return x(d/100)+"px"; }).text(function(d, i) {return categoryName[i]+ " " + d;});
}
