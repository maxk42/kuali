"use strict;"
const EventEmitter = require('events');
class Elevator extends EventEmitter {
  constructor(floors, currentFloor) {
    super();
    this.floors = floors;
    this.currentFloor = currentFloor;
    this.destination = currentFloor;
    this.doorsOpen = true;
    this.trips = 0;
    this.floorsPassed = 0;
    this.state = 'idle';
  }
  
  openDoors() {
    this.emit('opening doors');
  }
  
  closeDoors() {
    this.emit('closing doors');
  }
  
  moveTo(floor) {
    if(this.state == 'maintenance') {
      this.emit('invalid request', 'moveTo', 'maintenance');
      return false;
    }
    if(floor < 1 || floor > this.floors) {
      this.emit('invalid request', 'moveTo', floor);
      return false;
    }
    if(floor == this.currentFloor) {
      return false;
    }
    this.emit('moving to floor', floor);
    this.destination = floor;
    if(this.doorsOpen) {
      this.closeDoors();
    }
    this.state = 'moving';
    while(this.currentFloor != floor) {
      if(this.currentFloor < floor) {
        this.moveUp();
      } else {
        this.moveDown();
      }
    }
    this.state = 'idle';
    this.openDoors();
    this.trips++;
    if(this.trips >= 100) {
      this.state = 'maintenance';
      this.emit('entering maintenance mode');
      setTimeout(this.closeDoors, 10000);    // i'm assuming someone can still get out by pressing the button
    }
    return true;
  }
  
  moveDown() {
    if(this.currentFloor <= 1) {
      this.emit('invalid request', 'moveDown');
      return;
    }
    if(this.doorsOpen) {
      this.closeDoors();
    }
    this.currentFloor--;
    this.arriveAtFloor(this.currentFloor);
  }
  
  moveUp() {
    if(this.currentFloor >= this.floors) {
      this.emit('invalid request', 'moveUp');
      return;
    }
    if(this.doorsOpen) {
      this.closeDoors();
    }
    this.currentFloor++;
    this.arriveAtFloor(this.currentFloor);
  }
  
  arriveAtFloor(floor) {
    this.emit('arrived', floor);
    this.floorsPassed++;
  }
}

class ElevatorController {
  constructor(nElevators, floors) {
    this.elevators = [];
    for(let i = 0; i < nElevators; i++) {
      this.elevators.push(new Elevator(floors, 1));
    }
  }
  
  requestElevator(fromFloor) {
    let targetElevator = false;
    let nearestIsMoving = false;
    while(targetElevator === false) {  // repeat until an elevator becomes available
      for(let elevatorIndex in this.elevators) {
        let elevator = this.elevators[elevatorIndex];
        if(elevator.currentFloor == fromFloor) {
          elevatorFound = elevatorIndex;
          break;
        }
        if(elevator.state == "maintenance") {
          continue;
        }
        // Precompute a few conditionals to make the following `if` statement readable
        let truthTable = {
          moving: elevator.state == "moving",
          movingPast: (elevator.floor >= fromFloor && elevator.destination <= fromFloor)
            || (elevator.floor <= fromFloor && elevator.destination >= fromFloor),
          elevatorIsCloser: targetElevator === false ? false : Math.abs(elevator.floor - fromFloor) < Math.abs(this.elevators[targetElevator].floor - fromFloor)
        };
        if( (truthTable.movingPast || !truthTable.moving) && (truthTable.elevatorIscloser || targetElevator === false) ) {
          if(targetElevator !== false && nearestIsMoving && !truthTable.moving && elevator.floor != fromFloor) {	// skip idling elevators if we've already found one headed our way, unless it's on the same level
            continue;
	  }
          targetElevator = elevatorIndex;
          if(truthTable.moving) {
            nearestIsMoving = true;
	  }
        }
      }
    }
  }
}


