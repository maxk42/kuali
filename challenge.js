const EventEmitter = require('events');
class Elevator extends EventEmitter {
	constructor(floors, currentFloor) {
		this.floors = floors;
		this.currentFloor = floor;
		this.doorsOpen = true;
		this.floorsPassed = 0;
	}
	
	getFloor() {
		return this.currentFloor;
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
	
	moveDown() {
	}
	
	moveUp() {
	}
}

