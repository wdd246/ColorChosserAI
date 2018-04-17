var input = new synaptic.Layer(3); // Two inputs
var output = new synaptic.Layer(1); // Three outputs
var igen = 0; //count of generations
var correct = 0; //count of trues
var score = 0; //correct %
var plus = false; //train next
var bow = null; // sumbit prevoius



input.project(output); // Connect input to output

var trainingData = [
    {
        input: [0, 0, 0],
        output: [1]
            },
    {
        input: [1, 1, 1],
        output: [0]
            },
    {
        input: [125 / 255, 125 / 255, 125 / 255],
        output: [1]
            },
    {
        input: [50 / 255, 100 / 255, 150 / 255],
        output: [1]
            },
    {
        input: [150 / 255, 100 / 255, 50 / 255],
        output: [0]
            },
    {
        input: [1, 0, 0],
        output: [1]
            },
    {
        input: [0, 1, 0],
        output: [0]
            },
    {
        input: [0, 0, 1],
        output: [1]
            },
    {
        input: [1, 1, 0],
        output: [0]
            },
    {
        input: [1, 0, 1],
        output: [1]
            },
    {
        input: [0, 1, 1],
        output: [0]
            },
];

var learningRate = 0.2; 
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

function correc() {
    correct++;
    plus = true;
    retrain();
    nextGen();
}


function nextGen() {

    var r = Math.floor((Math.random() * 255) + 0);
    var g = Math.floor((Math.random() * 255) + 0);
    var b = Math.floor((Math.random() * 255) + 0);
    var ra = r / 255;
    var ga = g / 255;
    var ba = b / 255;
    input.activate([ra, ga, ba]); // Whistle
    var result = output.activate();

    document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';

    var pp = document.getElementById('rgb');
    pp.innerHTML = 'rgb(' + r + ',' + g + ',' + b + ')';

    document.getElementById("white").style.display = "none";
    document.getElementById("black").style.display = "none";
    if (result[0] > 0.5) {
        //console.log(1);
        document.getElementById("white").style.display = "block";

    }
    if (result[0] < 0.5) {
        //console.log(0);
        document.getElementById("black").style.display = "block";
    }

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

    score = (correct / igen) * 100;
    score = score.toFixed(2);
    
    var gen = document.getElementById("gen");
    gen.innerHTML = "Generation: " + igen + "<br>Corrects: " + correct + "<br>Score: " + score + " %";
    igen++;

    if (plus) {
        var dl = trainingData.length; //cout of trained data
        
        trainingData.push({
            input: [0, 0, 0],
            output: [1]
        });
        
        trainingData[dl]['input'][0] = ra;
        trainingData[dl]['input'][1] = ga;
        trainingData[dl]['input'][2] = ba;
        trainingData[dl]['output'][0] = bow;

        dl++;
        plus = false;

    }
    
    bow = null;
}
