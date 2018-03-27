const EventEmitter = require('events');
class Elevator extends EventEmitter {
	constructor(floors, currentFloor) {
		this.floors = floors;
		this.currentFloor = floor;
		this.doorsOpen = true;
		this.floorsPassed = 0;
		this.maintenanceMode = false;
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
}

