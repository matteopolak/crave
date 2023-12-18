/// Adapted from a codepen by @ZevanRosser:
/// codepen.io/ZevanRosser/pen/OJJGoXo/bde8e879b344202cf06379e44f9e80b2

const HALF_PI = Math.PI / 2;

export class Blob {
	wobbleIncrement: number;
	segments: number;
	step: number;
	anchors: number[];
	radii: number[];
	thetaOff: number[];
	theta: number;
	thetaRamp: number;
	thetaRampDest: number;
	rampDamp: number;

	constructor(public radius: number, public colour: string) {
		this.wobbleIncrement = 0;
		this.segments = 12;
		this.step = HALF_PI / this.segments;
		this.anchors = [];
		this.radii = [];
		this.thetaOff = [];

		const bumpRadius = radius / 5;
		const halfBumpRadius = bumpRadius / 2;

		for (let i = 0; i < this.segments + 2; i++) {
			this.anchors.push(0, 0);
			this.radii.push(Math.random() * bumpRadius - halfBumpRadius);
			this.thetaOff.push(Math.random() * 2 * Math.PI);
		}

		this.theta = 0;
		this.thetaRamp = 0;
		this.thetaRampDest = 12;
		this.rampDamp = 25;
	}

	update(ctx: CanvasRenderingContext2D) {
		this.thetaRamp += (this.thetaRampDest - this.thetaRamp) / this.rampDamp;
		this.theta += 0.03;
		this.anchors = [0, this.radius];

		for (let i = 0; i <= this.segments + 2; i++) {
			const sine = Math.sin(this.thetaOff[i] + this.theta + this.thetaRamp);
			const rad = this.radius + this.radii[i] * sine;
			const x = rad * Math.sin(this.step * i);
			const y = rad * Math.cos(this.step * i);

			this.anchors.push(x, y);
		}

		ctx.save();
		ctx.translate(-10, -10);
		ctx.scale(0.5, 0.5);
		ctx.fillStyle = this.colour;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		bezierSkin(ctx, this.anchors, false);

		ctx.lineTo(0, 0);
		ctx.fill();
		ctx.restore();
	}
}

function bezierSkin(ctx: CanvasRenderingContext2D, bez: number[], closed = true) {
	const avg = calcAvgs(bez);
	const leng = bez.length;

	if (closed) {
		ctx.moveTo(avg[0], avg[1]);

		for (let i = 2; i < leng; i += 2) {
			ctx.quadraticCurveTo(bez[i], bez[i + 1], avg[i], avg[i + 1]);
		}

		ctx.quadraticCurveTo(bez[0], bez[1], avg[0], avg[1]);
	} else {
		ctx.moveTo(bez[0], bez[1]);
		ctx.lineTo(avg[0], avg[1]);

		for (let i = 2; i < leng - 2; i += 2) {
			ctx.quadraticCurveTo(bez[i], bez[i + 1], avg[i], avg[i + 1]);
		}

		ctx.lineTo(bez[leng - 2], bez[leng - 1]);
	}
}

function calcAvgs(p: number[]) {
	const avg: number[] = [];
	const leng = p.length;

	for (let i = 2; i < leng; i++) {
		avg.push((p[i - 2] + p[i]) / 2);
	}

	avg.push((p[0] + p[leng - 2]) / 2, (p[1] + p[leng - 1]) / 2);

	return avg;
}
