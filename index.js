function initFires() {
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');

	const width = window.innerWidth;
	const height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	let balls = [];
	let fires = [];
	const ballsCnt = 10;
	let count = 0;

	class Ball {
		constructor(opts) {
			this.settings = Object.assign(
				{
					color: 'yellow',
					r: 5,
					g: 0.1,
					end() {},
				},
				opts
			);

			for (let attr in this.settings) {
				this[attr] = this.settings[attr];
			}
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;
			this.vy += this.g;
		}

		render() {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.r, 0, (360 * Math.PI) / 180);
			ctx.closePath();
			ctx.fill();
			this.end();
		}
	}

	class Fire {
		constructor(opts) {
			this.settings = Object.assign(
				{
					color: 'yellow',
					r: 5,
					g: 0.1,
					fs: 0.95,
					life: 100,
					end() {},
				},
				opts
			);

			for (let attr in this.settings) {
				this[attr] = this.settings[attr];
			}
		}

		update() {
			this.x += this.vx;
			this.y += this.vy;
			this.vy += this.g;
			this.vx *= this.fs;
			this.vy *= this.fs;

			if (this.life > 0 && this.life < 300) {
				this.life--;
			}
		}

		render() {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.r * (Math.min(this.life, 100) / 100), 0, (360 * Math.PI) / 180);
			ctx.closePath();
			ctx.fill();
			this.end();
		}
	}

	let timer = setInterval(() => {
		if (count === ballsCnt) {
			clearInterval(timer);

			count = 0;
			timer = null;
		} else {
			count++;
			balls.push(
				new Ball({
					r: 3,
					x: (Math.random() * width) / 3 + width / 3,
					y: height,
					vx: Math.random() * 2 - 1,
					vy: -Math.random() * 2 - 9,
					end() {
						if (this.vy > 1) {
							balls.splice(balls.indexOf(this), 1);

							let size = Math.random() * 10;
							for (let i = 0; i < 60; i++) {
								let power = Math.random() * size;

								let vx = Math.cos((i * 6 * Math.PI) / 180) * power;
								let vy = Math.sin((i * 6 * Math.PI) / 180) * power;
								const nf = new Fire({
									r: 2,
									x: this.x,
									y: this.y,
									vx: vx,
									vy: vy,
									g: 0.05,
									end() {
										if (this.life < 10) {
											fires.splice(fires.indexOf(this), 1);
										}
									},
								});
								fires.push(nf);
							}
						}
					},
				})
			);
		}
	}, 500);

	function loop() {
		if (balls.length) {
			ctx.fillStyle = 'rgba(184, 42, 30, 0.2)';
			ctx.fillRect(0, 0, width, height);
		} else {
			ctx.fillStyle = 'rgb(184, 42, 30)';
			ctx.fillRect(0, 0, width, height);
		}

		for (let i = 0; i < balls.length; i++) {
			balls[i].update();
			balls[i].render();
		}

		for (let i = 0; i < fires.length; i++) {
			fires[i].update();
			fires[i].render();
		}

		requestAnimationFrame(loop);
	}
	loop();
}

initFires();
