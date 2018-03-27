"use strict;"
const EventEmitter = require('events');
class Elevator extends EventEmitter {
	constructor(floors, currentFloor) {
		this.floors = floors;
		this.currentFloor = floor;
		this.destination = floor;
		this.doorsOpen = true;
		this.trips = 0;
		this.floorsPassed = 0;
		this.state = 'idle';
	}
	
	openDoors() {
		event.emit('opening doors');
	}
	
	closeDoors() {
		event.emit('closing doors');
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
			setTimeout(this.closeDoors, 10000);		// i'm assuming someone can still get out by pressing the button
		}
		return true;
	}
	
	moveDown() {
		if(this.currentFloor <= 1) {
			event.emit('invalid request', 'moveDown');
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
			event.emit('invalid request', 'moveUp');
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
	
	requestElevator(fromFloor, direction) {
		let targetElevator = false;
		while(targetElevator === false) {	// repeat until an elevator becomes available
			for(let elevatorIndex in this.elevators) {
				let elevator = elevators[elevatorIndex];
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
					elevatorIsCloser: Math.abs(elevator.floor - fromFloor) < Math.abs(elevators[targetElevator].floor - fromFloor)
				};
				if( (truthTable.movingPast || !truthTable.moving) && (truthTable.elevatorIscloser || targetElevator === false) ) {
					targetElevator = elevatorIndex;
				}
			}
		}
	}
	
}


x = new ElevatorController(10, 100)
