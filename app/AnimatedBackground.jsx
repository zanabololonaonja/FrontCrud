// AnimatedBackground.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import TweenOne from 'rc-tween-one';
import './AnimatedBackground.css'; // Assure-toi de créer ce fichier CSS

class GridLayout {
  // ... (tout le code de GridLayout que tu as fourni)
}

const getPointPos = (width, height, length) => {
  // ... (tout le code de getPointPos que tu as fourni)
};

const getDistance = (t, a) => (Math.sqrt((t.x - a.x) * (t.x - a.x) + (t.y - a.y) * (t.y - a.y)));

class Point extends React.PureComponent {
  render() {
    const { tx, ty, x, y, opacity, backgroundColor, radius, ...props } = this.props;
    let transform;
    let zIndex = 0;
    let animation = { 
      y: (Math.random() * 2 - 1) * 20 || 15, 
      duration: 3000, 
      delay:Math.random() * 1000,
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
          className={`${this.props.className}-child`}
        />
      </div>
    );
  }
}

class LinkedAnimate extends React.Component {
  static defaultProps = {
    className: 'linked-animate-demo',
  };

  num = 50;

  constructor(props) {
    super(props);
    this.state = {
      data: getPointPos(1280, 600, this.num).map(item => ({
        ...item,
        opacity: Math.random() * 0.2 + 0.05,
        backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
      })),
      tx: 0,
      ty: 0,
    };
  }

  onMouseMove = (e) => {
    const cX = e.clientX;
    const cY = e.clientY;
    const boxRect = this.box.getBoundingClientRect();
    const pos = this.state.data.map((item) => {
      const { x, y, radius } = item;
      return { x, y, distance: getDistance({ x: cX - boxRect.x, y: cY - boxRect.y }, { x, y }) - radius };
    }).reduce((a, b) => {
      if (!a.distance || a.distance > b.distance) {
        return b;
      }
      return a;
    });
    if (pos.distance < 60) {
      this.setState({
        tx: pos.x,
        ty: pos.y,
      });
    } else {
      this.onMouseLeave();
    }
  }

  onMouseLeave = () => {
    this.setState({
      tx: 0,
      ty: 0,
    });
  }

  render() {
    const { className } = this.props;
    const { data, tx, ty } = this.state;
    return (
      <div className={`${className}-wrapper`}>
        <div
          className={`${className}-box`}
          ref={(c) => { this.box = c; }}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        >
          {data.map((item, i) => (
            <Point {...item} tx={tx} ty={ty} key={i.toString()} className={`${className}-block`} />
          ))}
        </div>
      </div>
    );
  }
}

export default LinkedAnimate;
