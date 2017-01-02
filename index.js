// allows node to interact with the file system
// (if this causes reference error type $ 'npm install fs')
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

// adds max & min element functions to Array prototype
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

// converts array of passengers from string to numbers
const numberize = function(arrOfStrings, floors){
    let arrOfNums = [];
    for (var i = 0; i < arrOfStrings.length; i++){
        arrOfNums[i] = Number(arrOfStrings[i])
        if (arrOfNums[i] > floors){
            console.error('Error: Invalid input; person ' + (i + 1).toString() + ' is attempting to go to floor ' + arrOfNums[i] + ', but only ' + floors.toString() + ' floors exist.');
            process.exit();
            // break;
        }
    };
    return arrOfNums;
}

// parses input txt file
const elevatorProblem = function(filename){
    const input = require('./input-files/' + filename);
    const inputArr = input.split("\n");
    if (inputArr.length !== 4){
        console.error('Invalid input; must have an M, N, Q, and array of people; input contains ' + inputArr.length + ' parameters');
        process.exit();
    }
    const numElevators = Number(inputArr[0]);
    const floors = Number(inputArr[1]);
    const capacity = Number(inputArr[2]);
    const queue = numberize(inputArr[3].split(','), floors);

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
    i = 0; // i = time in seconds
    while (queue.length + passengersInTransit > 0){
        log[i] = 'T(' + i + '): ';

        // find available elevators on floor 0
        bottomFloorElevators = [];
        for (var j = 0; j < elevators.length; j++){
            if (elevators[j].position === 0) {
                bottomFloorElevators.push(j);
                elevators[j].ascending = true;
            } else if (elevators[j].position >= elevators[j].targetFloor){
                elevators[j].ascending = false;
            }
        }

        //  elevators receive passengers; log is populated as passengers board
        let currentPool = queue.slice(0,  bottomFloorElevators.length * capacity).sort();
        for (j = 0; j < bottomFloorElevators.length; j++){
            let currentElevator = elevators[bottomFloorElevators[j]];
            currentElevator.passengers = currentPool.slice(j*capacity, j*capacity + capacity);
            if (currentElevator.passengers.length) currentElevator.targetFloor = currentElevator.passengers.max();
            currentElevator.passengers.length > 0 ?
            log[i] += currentElevator.passengers.length + ' passengers board elevator ' + currentElevator.id + '. ' :
            log[i] += 'Elevator ' + currentElevator.id + ' returns to the bottom floor. ';
            for (var k = 0; k < capacity; k++) queue.shift();
        }

        // elevators move up & down; log is populated as passengers leave
        passengersInTransit = 0;
        for (j = 0; j < elevators.length; j++){
            currentElevator = elevators[j];
            if (currentElevator.ascending){
                currentElevator.position += 0.5;
                let departingPassengers = 0;
                while (currentElevator.position === currentElevator.passengers.min()){
                    departingPassengers++;
                    currentElevator.passengers.splice(currentElevator.passengers.indexOf(currentElevator.passengers.min()), 1);
                }
                if (departingPassengers){
                    departingPassengers === 1 ? 
                    log[i] += departingPassengers + ' passenger exits elevator ' + currentElevator.id + ' on floor ' + currentElevator.position + '. ' :
                    log[i] += departingPassengers + ' passengers exit elevator ' + currentElevator.id + ' on floor ' + currentElevator.position + '. ';
                }
            passengersInTransit += currentElevator.passengers.length;
            } else currentElevator.position--;
        }

        // console.log('current pool: ', currentPool, ' bottom floor elevators: ', bottomFloorElevators, ' elevators: ', elevators, ' log: ', log[i], ' in transit: ', passengersInTransit, ' i: ', i);
        i++;
    }  
    let firstline = filename + ' elevator logs\n' + 'Total time to serve all passengers: ' + (i/60).toFixed(0) + ' minutes and ' + (i%60) + ' seconds.\n'
    return firstline + log.join('\n');
}

// writes output file
const write = function(filename){
    let log = elevatorProblem(filename);
    fs.writeFile('./output.txt', log, function(err){
            if(err) return console.log(err);
            console.log('Result written to ./output.txt');
        });
}

// allows node to take input from the terminal
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a file name> '
});
rl.prompt();
rl.on('line', (line) => {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      write(line.trim());
      break;
  }
rl.prompt();
}).on('close', () => {
  console.log('\nHave a great day!');
  process.exit(0);
});

// for testing
module.exports = {
    Array,
    numberize,
    elevatorProblem
}