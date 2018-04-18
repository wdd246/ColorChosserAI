var input = new synaptic.Layer(3); // Two inputs
var output = new synaptic.Layer(1); // Three outputs
var igen = 0; //count of generations
var correct = 0; //count of trues
var score = 0; //correct %
var plus = false; //train next
var bow = null; // prevoius output

input.project(output); // Connect input to output

// 11 training input datas
var trainingData = [
    {input: [0, 0, 0],output: [1]},
    {input: [1, 1, 1],output: [0]},
    {input: [125 / 255, 125 / 255, 125 / 255],output: [1]},
    {input: [50 / 255, 100 / 255, 150 / 255],output: [1]},
    {input: [150 / 255, 100 / 255, 50 / 255],output: [0]},
    {input: [1, 0, 0],output: [1]},
    {input: [0, 1, 0],output: [0]},
    {input: [0, 0, 1],output: [1]},
    {input: [1, 1, 0],output: [0]},
    {input: [1, 0, 1],output: [1]},
    {input: [0, 1, 1], output: [0]},
];

var learningRate = 0.2;  //learning rate

function train() {    
    for (var i = 0; i < trainingData.length; i++) {        
        input.activate(trainingData[i]["input"]);        
        output.activate();        
        output.propagate(learningRate, trainingData[i]["output"]);    
    }
}

function retrain() {    
    for (var i = 0; i < 10000; i++) {        
        trainingData = _.shuffle(trainingData);        
        train();    
    }
} 

// if color is correct retrain NN with new data of this color
function correc() {
    correct++;
    plus=true;
}

// creating a new geneartion
function nextGen() {

    var r = Math.floor((Math.random() * 255) + 0); //RED
    var g = Math.floor((Math.random() * 255) + 0); //GREEN
    var b = Math.floor((Math.random() * 255) + 0); //BLUE
    var ra = r / 255; //Red 0-1
    var ga = g / 255; //Green 0-1
    var ba = b / 255; //Blue 0-1
    
    input.activate([ra, ga, ba]); // Whistle
    var result = output.activate(); //result of new generation

    // Comparing corrct with result
    if (result[0] > 0.5 && plus == true) {
        bow = 1;
    }
    if (result[0] < 0.5 && plus == true) {
        bow = 0;
    }
    if (result[0] > 0.5 && plus == false) {
        bow = 0;
    }
    if (result[0] < 0.5 && plus == false) {
        bow = 1;
    }

    // trainingData array length
    var dl = trainingData.length - 1; //cout of trained data

    // inserting new empty cell into trainingdata array
    trainingData.push({
        input: [0, 0, 0],
        output: [1]
    });
    
    //inserting correct generation into trainingdata array
    trainingData[dl]['input'][0] = ra;
    trainingData[dl]['input'][1] = ga;
    trainingData[dl]['input'][2] = ba;
    trainingData[dl]['output'][0] = bow;
    //console.log(trainingData);

    plus = false; //reseting plus
    bow = null; //reseting bow
    
    // Generation & color INFO
    score = (correct / igen) * 100;
    score = score.toFixed(2);
    var gen = document.getElementById("gen");
    gen.innerHTML = "Generation: " + igen + "<br>Corrects: " + correct + "<br>Score: " + score + " %";
    igen++;
    
    document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')'; // change a bg

    var pp = document.getElementById('rgb');
    pp.innerHTML = 'rgb(' + r + ',' + g + ',' + b + ')';

    //reseting a black or white circle
    document.getElementById("white").style.display = "none";
    document.getElementById("black").style.display = "none";

    //Show black or white
    if (result[0] > 0.5) {
        document.getElementById("white").style.display = "block";
    }
    if (result[0] < 0.5) {
        document.getElementById("black").style.display = "block";
    }
    
    retrain(); //retrain NN with new data
}
