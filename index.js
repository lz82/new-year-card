function initFires() {
  loadStaticFile(["./imgs/pic.png"]).then((pics) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let balls = [];
    let fires = [];
    const ballsCnt = 10;
    let count = 0;

    let points1 = getImagePoints(pics[0], 3);
    let textFires = [];

    class Ball {
      constructor(opts) {
        this.settings = Object.assign(
          {
            color: "yellow",
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
            color: "yellow",
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
        ctx.arc(
          this.x,
          this.y,
          this.r * (Math.min(this.life, 100) / 100),
          0,
          (360 * Math.PI) / 180
        );
        ctx.closePath();
        ctx.fill();
        this.end();
      }
    }

    class TextFire {
      constructor(opts) {
        this.settings = Object.assign(
          {
            color: "yellow",
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
        ctx.arc(
          this.x,
          this.y,
          this.r * (Math.min(this.life, 100) / 100),
          0,
          (360 * Math.PI) / 180
        );
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

        balls.push(
          new Ball({
            r: 5,
            x: width / 2,
            y: height,
            vx: 0,
            vy: -10,
            end() {
              if (this.vy > 1) {
                balls.splice(balls.indexOf(this), 1);

                for (let i = 0; i < 60; i++) {
                  let power = Math.random() * 10;

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

                for (let i = 0; i < points1.length; i++) {
                  let power = 0.05;
                  let vx = (points1[i].x - points1.w / 2) * power;
                  let vy = (points1[i].y - points1.h / 2) * power;

                  textFires.push(
                    new TextFire({
                      x: this.x,
                      y: this.y,
                      r: 1,
                      vx: vx,
                      vy: vy,
                      g: 0.03,
                      life: 200,
                      end() {
                        if (this.life < 10) {
                          textFires.splice(textFires.indexOf(this), 1);
                        }
                      },
                    })
                  );
                }
              }
            },
          })
        );
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
        ctx.fillStyle = "rgba(184, 42, 30, 0.2)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "rgb(184, 42, 30)";
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

      for (let i = 0; i < textFires.length; i++) {
        textFires[i].update();
        textFires[i].render();
      }

      requestAnimationFrame(loop);
    }
    loop();

    function getImagePoints(img, level = 5) {
      const width = img.width;
      const height = img.height;

      let points = [];

      let x = Math.floor(width / level);
      let y = Math.floor(height / level);

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.drawImage(img, 0, 0);
      ctx.closePath();

      let imgData = ctx.getImageData(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);
      points.w = width;
      points.h = height;

      for (let i = 0; i < y; i++) {
        for (let j = 0; j < x; j++) {
          let colors = getImageColor(imgData, j * level, i * level);

          if (colors[0] === 245 && colors[1] === 9 && colors[2] === 71) {
            points.push({
              x: j * level,
              y: i * level,
            });
          }
        }
      }

      return points;
    }

    function getImageColor(imgData, x, y) {
      const w = imgData.width;
      const h = imgData.height;
      const d = imgData.data;

      let colors = [];
      colors[0] = d[(y * w + x) * 4];
      colors[1] = d[(y * w + x) * 4 + 1];
      colors[2] = d[(y * w + x) * 4 + 2];
      colors[3] = d[(y * w + x) * 4 + 3];

      return colors;
    }
  });
}

function loadStaticFile(arr) {
  let promises = [];

  for (let i = 0; i < arr.length; i++) {
    let promise = new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.src = arr[i];
      img.onload = function () {
        resolve(img);
      };
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

initFires();
