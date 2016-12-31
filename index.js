// allows node to interact with the file system
// (if this causes reference error type $ 'npm install fs')
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

// allows node to take input from the console
/*
const readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('guess> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "right") rl.close();
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});
*/

// parses input txt file
const input = require('./input-files/' + 'eztest1.txt');
const inputArr = input.split("\n");
if (inputArr.length !== 4){
    console.error('Invalid input; must have an M, N, Q, and array of people; input contains ' + inputArr.length + ' parameters');
    process.exit();
}
const numElevators = Number(inputArr[0]);
const floors = Number(inputArr[1]);
const capacity = Number(inputArr[2]);
const queue = inputArr[3].split(',');
for (var i = 0; i < queue.length; i++){
    queue[i] = Number(queue[i])
    if (queue[i] > floors){
        console.error('Invalid input; person ' + (i + 1).toString() + ' is attempting to go to floor ' + queue[i].toString() + ', but only ' + floors.toString() + ' floors exist.');
        process.exit();
    }
};

// initializes elevator system
let bottomFloorElevators = [], log = [], elevators = [], passengersInTransit = capacity * numElevators;
for (var i = 0; i < numElevators; i++){
    elevators.push({id: i,
        position: 0,
        ascending: true,
        passengers: [],
        targetFloor: floors
    });
    bottomFloorElevators.push(i);
}

// runs simulation
i = 0; // i = time in 2 second intervals
while (queue.length > 0 && passengersInTransit !== 0){
    i++;

    // find available elevators on floor 0
    bottomFloorElevators = [];
    for (var j = 0; j < elevators.length; j++){
        if (elevators[j].position === 0) {
            bottomFloorElevators.push(j);
            elevators[j].ascending = true;
        } else if (elevators[j].position === elevators[j].targetFloor){
            elevators[j].ascending = false;
        }
    }

    // passengers get into available elevators
    let currentPool = queue.slice(0,  bottomFloorElevators.length * capacity).sort();
    for (j = 0; j < elevators.length; j++){
        elevators[j].passengers = currentPool.slice(j*capacity, j*capacity + capacity);
        elevators[j].targetFloor = elevators[j].passengers[elevators[j].passengers.length-1];
        for (var k = 0; k < capacity; k++) queue.shift();
    }
    
    console.log('current pool: ', currentPool, ' bottom floor elevators: ', bottomFloorElevators, ' elevators: ', elevators, ' i: ', i);
}

/*
// writes output file
fs.writeFile('./output.txt', (currentIndex+1).toString(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('Result written to ./output.txt');
    });
*/