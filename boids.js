const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const protectedRangeSquared = 50 * 50;
const visibleRangeSquared = 100 * 100;
var avoidFactor = 0.05;
var matchingFactor = 0.05;
var centeringFactor = 0.005;
var turnFactor = 0.2;
const leftMargin = 100;
const rightMargin = canvas.width - 100;
const topMargin = 100;
const bottomMargin = canvas.height - 100;
var maxSpeed = 5;
var minSpeed = 2;

class Boid {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.vx = Math.random() * 2 - 1;
		this.vy = Math.random() * 2 - 1;
	}

	update(flock) {
		let xpos_avg = 0,
			ypos_avg = 0,
			xvel_avg = 0,
			yvel_avg = 0,
			neighboring_boids = 0;
		let close_dx = 0,
			close_dy = 0;

		flock.forEach((otherBoid) => {
			if (otherBoid !== this) {
				const dx = this.x - otherBoid.x;
				const dy = this.y - otherBoid.y;
				const squared_distance = dx * dx + dy * dy;

				if (
					Math.abs(dx) < visibleRangeSquared &&
					Math.abs(dy) < visibleRangeSquared
				) {
					if (squared_distance < protectedRangeSquared) {
						close_dx += dx;
						close_dy += dy;
					} else if (squared_distance < visibleRangeSquared) {
						xpos_avg += otherBoid.x;
						ypos_avg += otherBoid.y;
						xvel_avg += otherBoid.vx;
						yvel_avg += otherBoid.vy;
						neighboring_boids++;
					}
				}
			}
		});

		if (neighboring_boids > 0) {
			xpos_avg /= neighboring_boids;
			ypos_avg /= neighboring_boids;
			xvel_avg /= neighboring_boids;
			yvel_avg /= neighboring_boids;

			this.vx +=
				(xpos_avg - this.x) * centeringFactor +
				(xvel_avg - this.vx) * matchingFactor;
			this.vy +=
				(ypos_avg - this.y) * centeringFactor +
				(yvel_avg - this.vy) * matchingFactor;
		}

		this.vx += close_dx * avoidFactor;
		this.vy += close_dy * avoidFactor;

		if (this.x < leftMargin) this.vx += turnFactor;
		if (this.x > rightMargin) this.vx -= turnFactor;
		if (this.y < topMargin) this.vy += turnFactor;
		if (this.y > bottomMargin) this.vy -= turnFactor;

		const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
		if (speed < minSpeed) {
			this.vx = (this.vx / speed) * minSpeed;
			this.vy = (this.vy / speed) * minSpeed;
		} else if (speed > maxSpeed) {
			this.vx = (this.vx / speed) * maxSpeed;
			this.vy = (this.vy / speed) * maxSpeed;
		}

		this.x += this.vx;
		this.y += this.vy;

		if (this.x > canvas.width) this.x = 0;
		if (this.y > canvas.height) this.y = 0;
		if (this.x < 0) this.x = canvas.width;
		if (this.y < 0) this.y = canvas.height;

		
	}

	

	draw() {
    ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}
}

let flock = [];
for (let i = 0; i < 200; i++) {
	flock.push(new Boid());
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  const drawnCenters = new Set();
	flock.forEach((boid) => {
		boid.update(flock);
		boid.draw();

  });
	requestAnimationFrame(animate);
}

animate();
