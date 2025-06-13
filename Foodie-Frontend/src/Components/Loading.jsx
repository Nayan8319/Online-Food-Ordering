import React, { useEffect, useRef } from 'react';

const Loading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const toRadians = (deg) => deg * Math.PI / 180;
    const map = (val, a1, a2, b1, b2) =>
      b1 + ((val - a1) * (b2 - b1)) / (a2 - a1);

    class Pizza {
      constructor() {
        this.canvas = canvas;
        this.ctx = ctx;

        this.sliceCount = 6;
        this.sliceSize = 80;

        this.width = this.height =
          this.canvas.height = this.canvas.width =
          this.sliceSize * 2 + 50;
        this.center = (this.height / 2) | 0;

        this.sliceDegree = 360 / this.sliceCount;
        this.sliceRadians = toRadians(this.sliceDegree);
        this.progress = 0;
        this.cooldown = 10;
      }

      update() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        if (--this.cooldown < 0)
          this.progress +=
            this.sliceRadians * 0.01 + this.progress * 0.07;

        ctx.save();
        ctx.translate(this.center, this.center);

        for (let i = this.sliceCount - 1; i > 0; i--) {
          let rad;
          if (i === this.sliceCount - 1) {
            const ii = this.sliceCount - 1;
            rad = this.sliceRadians * i + this.progress;

            ctx.strokeStyle = '#FBC02D';
            cheese(ctx, rad, 0.9, ii);
            cheese(ctx, rad, 0.6, ii);
            cheese(ctx, rad, 0.5, ii);
            cheese(ctx, rad, 0.3, ii);
          } else {
            rad = this.sliceRadians * i;
          }

          // Border
          ctx.beginPath();
          ctx.lineCap = 'butt';
          ctx.lineWidth = 11;
          ctx.arc(0, 0, this.sliceSize, rad, rad + this.sliceRadians);
          ctx.strokeStyle = '#F57F17';
          ctx.stroke();

          // Slice
          const startX = this.sliceSize * Math.cos(rad);
          const startY = this.sliceSize * Math.sin(rad);
          const endX = this.sliceSize * Math.cos(rad + this.sliceRadians);
          const endY = this.sliceSize * Math.sin(rad + this.sliceRadians);

          ctx.fillStyle = '#FBC02D';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(startX, startY);
          ctx.arc(0, 0, this.sliceSize, rad, rad + this.sliceRadians);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.lineWidth = 0.3;
          ctx.stroke();

          // Topping (meat)
          const x =
            this.sliceSize * 0.65 *
            Math.cos(rad + this.sliceRadians / 2);
          const y =
            this.sliceSize * 0.65 *
            Math.sin(rad + this.sliceRadians / 2);
          ctx.beginPath();
          ctx.arc(x, y, this.sliceDegree / 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#D84315';
          ctx.fill();
        }

        ctx.restore();

        if (this.progress > this.sliceRadians) {
          ctx.translate(this.center, this.center);
          ctx.rotate((-this.sliceDegree * Math.PI) / 180);
          ctx.translate(-this.center, -this.center);
          this.progress = 0;
          this.cooldown = 20;
        }
      }
    }

    function cheese(ctx, rad, multi, ii) {
      const sliceSize = 80;
      const sliceDegree = 360 / 6;
      const x1 =
        sliceSize * multi * Math.cos(toRadians(ii * sliceDegree) - 0.2);
      const y1 =
        sliceSize * multi * Math.sin(toRadians(ii * sliceDegree) - 0.2);
      const x2 = sliceSize * multi * Math.cos(rad + 0.2);
      const y2 = sliceSize * multi * Math.sin(rad + 0.2);

      const csx = sliceSize * Math.cos(rad);
      const csy = sliceSize * Math.sin(rad);

      const d = Math.sqrt(
        (x1 - csx) * (x1 - csx) + (y1 - csy) * (y1 - csy)
      );
      ctx.beginPath();
      ctx.lineCap = 'round';

      const percentage = map(d, 15, 70, 1.2, 0.2);

      let tx = x1 + (x2 - x1) * percentage;
      let ty = y1 + (y2 - y1) * percentage;
      ctx.moveTo(x1, y1);
      ctx.lineTo(tx, ty);

      tx = x2 + (x1 - x2) * percentage;
      ty = y2 + (y1 - y2) * percentage;
      ctx.moveTo(x2, y2);
      ctx.lineTo(tx, ty);

      ctx.lineWidth = map(d, 0, 100, 20, 2);
      ctx.stroke();
    }

    const pizza = new Pizza();

    const animate = () => {
      requestAnimationFrame(animate);
      pizza.update();
    };

    animate();
  }, []);

  return (
    <div style={styles.container}>
      <canvas id="pizza" ref={canvasRef}></canvas>
    </div>
  );
};

const styles = {
  container: {
    background: '#6A1B9A',
    height: '100vh',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Loading;
