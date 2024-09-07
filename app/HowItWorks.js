"use client"; // This is important for client-side rendering in Next.js

import React, { useState, useEffect, useRef } from 'react';
import { Steps } from 'antd';
import TweenOne from 'rc-tween-one';
import './HowItWorks.css'; // Ensure this file exists

const { Step } = Steps;

const GridLayout = class {
  constructor(rect, width, height) {
    this.gridX = Math.floor(width / rect);
    this.gridY = Math.floor(height / rect);
    this.cellWidth = width / this.gridX;
    this.cellHeight = height / this.gridY;
    this.grid = [];
    for (let i = 0; i < this.gridY; i += 1) {
      this.grid[i] = [];
      for (let s = 0; s < this.gridX; s += 1) {
        this.grid[i][s] = [];
      }
    }
  }

  getCells = (e) => {
    const gridArray = [];
    const w1 = Math.floor((e.x - e.radius) / this.cellWidth);
    const w2 = Math.ceil((e.x + e.radius) / this.cellWidth);
    const h1 = Math.floor((e.y - e.radius) / this.cellHeight);
    const h2 = Math.ceil((e.y + e.radius) / this.cellHeight);
    for (let c = h1; c < h2; c += 1) {
      for (let l = w1; l < w2; l += 1) {
        gridArray.push(this.grid[c][l]);
      }
    }
    return gridArray;
  }

  hasCollisions = t => (
    this.getCells(t).some(e => e.some(v => this.collides(t, v)))
  )

  collides = (t, a) => {
    if (t === a) {
      return false;
    }
    const n = t.x - a.x;
    const i = t.y - a.y;
    const r = t.radius + a.radius;
    return n * n + i * i < r * r;
  }

  add = (value) => {
    this.getCells(value).forEach((item) => {
      item.push(value);
    });
  }
}

const getPointPos = (width, height, length) => {
  const grid = new GridLayout(150, width, height);
  const posArray = [];
  const num = 500;
  const radiusArray = [20, 35, 60];
  for (let i = 0; i < length; i += 1) {
    let radius;
    let pos;
    for (let j = 0; j < num; j += 1) {
      radius = radiusArray[Math.floor(Math.random() * radiusArray.length)];
      pos = { x: Math.random() * (width - radius * 2) + radius, y: Math.random() * (height - radius * 2) + radius, radius };
      if (!grid.hasCollisions(pos)) {
        break;
      }
    }
    posArray.push(pos);
    grid.add(pos);
  }
  return posArray;
};

const getDistance = (t, a) => (Math.sqrt((t.x - a.x) * (t.x - a.x) + (t.y - a.y) * (t.y - a.y)));

const Point = ({ tx, ty, x, y, opacity, backgroundColor, radius, ...props }) => {
  let transform;
  let zIndex = 0;
  let animation = { 
    y: (Math.random() * 2 - 1) * 20 || 15, 
    duration: 3000, 
    delay: Math.random() * 1000,
    yoyo: true,
    repeat: -1,
  };
  if (tx && ty) {
    if (tx !== x && ty !== y) {
      const distance = getDistance({ x, y }, { x: tx, y: ty });
      const g = Math.sqrt(2000000 / (0.1 * distance * distance));
      transform = `translate(${g * (x - tx) / distance}px, ${g * (y - ty) / distance}px)`;
    } else if (tx === x && ty === y) {
      transform = `scale(${80 / radius})`;
      animation = { y: 0, yoyo: false, repeat: 0, duration: 300 };
      zIndex = 1;
    }
  }
  return (
    <div
      style={{
        left: x - radius,
        top: y - radius,
        width: radius * 1.8,
        height: radius * 1.8,
        opacity,
        zIndex,
        transform,
      }}
      {...props}
    >
      <TweenOne
        animation={animation}
        style={{
          backgroundColor,
        }}
        className={`${props.className}-child`}
      />
    </div>
  );
}

const LinkedAnimate = () => {
  const [data, setData] = useState([]);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    const initialData = getPointPos(1280, 600, 50).map(item => ({
      ...item,
      opacity: Math.random() * 0.2 + 0.05,
      backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
    }));
    setData(initialData);
  }, []);

  const onMouseMove = (e) => {
    const cX = e.clientX;
    const cY = e.clientY;
    const boxRect = boxRef.current.getBoundingClientRect();
    const pos = data.map((item) => {
      const { x, y, radius } = item;
      return { x, y, distance: getDistance({ x: cX - boxRect.x, y: cY - boxRect.y }, { x, y }) - radius };
    }).reduce((a, b) => {
      if (!a.distance || a.distance > b.distance) {
        return b;
      }
      return a;
    });
    if (pos.distance < 60) {
      setTx(pos.x);
      setTy(pos.y);
    } else {
      onMouseLeave();
    }
  }

  const onMouseLeave = () => {
    setTx(0);
    setTy(0);
  }

  return (
    <div className="linked-animate-demo-wrapper">
      <div
        className="linked-animate-demo-box"
        ref={boxRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {data.map((item, i) => (
          <Point {...item} tx={tx} ty={ty} key={i.toString()} className="linked-animate-demo-block" />
        ))}
      </div>
    </div>
  );
}

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <div className="title-container">
      <h2>How Does It Work?</h2>
      <p>The steps to follow to use </p>
      <p> our platform effectively:</p>
      </div>

      <div className="steps-container">
        <Steps
          direction="vertical"
          items={[
            {
              title: 'Registration and Login',
              description: 'Create your account and log in to access your personal information.'
            },
            {
              title: 'Adding and Managing Information',
              description: 'Easily add and manage your important data securely.'
            },
            {
              title: 'Data Security and Backup',
              description: 'Your information is protected and regularly backed up.'
            },
            {
              title: 'Easy Access to Your Data',
              description: 'Quickly access your data from any device.'
            },
            {
              title: 'Support and Assistance',
              description: 'Get continuous support for any questions or issues.'
            }
          ]}
        />
      </div>

      <div className="animation-container">
        <LinkedAnimate />
      </div>
    </div>
  );
}

export default HowItWorks;
