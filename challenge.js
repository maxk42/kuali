const EventEmitter = require('events');
class Elevator extends EventEmitter {
	constructor(floors, currentFloor) {
		this.floors = floors;
		this.currentFloor = floor;
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
		if(this.doorsOpen) {
			this.closeDoors();
		}
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
		this.floorsPassed++;
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
		this.floorsPassed++;
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
		for(let elevator in this.elevators) {
			if(this.elevators.currentFloor == fromFloor) {
			}
		}
	}
}

