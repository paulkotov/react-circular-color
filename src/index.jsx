import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sector from './sector';
import hsvToRgb from './hsvToRgb';

class CircularColor extends PureComponent {
  constructor(props) {
    super(props);

    const { size } = props;
    const handlerSize = Math.floor(size / 2 * 0.3 / 2);

    this.state = {
      touched: false,
      cx: Math.floor((size / 2) + (Math.floor(size / 2 * 0.6) + handlerSize) * Math.cos(Math.PI)),
      cy: Math.floor((size / 2) - (Math.floor(size / 2 * 0.6) + handlerSize) * Math.sin(Math.PI)),
      color: hsvToRgb(Math.abs(Math.PI) * 180 / Math.PI)
    }
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.preventScrolling, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.preventScrolling);
  }

  preventScrolling = (event) => {
    const { touched } = this.state;
    if(touched) {
      event.preventDefault();
    }
  }

  renderSectors() {
    const { size, numberOfSectors } = this.props;
    const outerRadius = Math.floor(size / 2 * 0.9);
    const innerRadius = Math.floor(size / 2 * 0.6);

    return Array(numberOfSectors).fill(0).map((sector, idx) => {
      const startAngle = (idx * Math.PI / 180) * 360 / numberOfSectors;
      const endAngle = ((idx + 1 === numberOfSectors ? 0 : idx + 1) * Math.PI / 180) * 360 / numberOfSectors;
      return (
        <Sector 
          key={idx}
          size={size}
          startAngle={-startAngle} 
          endAngle={-endAngle} 
          innerRadius={innerRadius} 
          outerRadius={outerRadius} 
        />
      );
    });
  }

  handleDown = (event) => {
    this.setState({
      touched: true
    });
  }

  handleUp = (event) => {
    this.setState({
      touched: false
    });
  }

  handleMove = (event) => {
    const { size, onChange } = this.props;
    const { touched } = this.state;
    
    if(touched) {
      const { x: xBlock, y: yBlock } = event.currentTarget.getBoundingClientRect();

      const evt = event.type === 'touchmove' ? event.touches[0] || event.changedTouches[0] : event;
      const x = evt.clientX - xBlock - size / 2;
      const y = evt.clientY - yBlock - size / 2; 

      const angle = -Math.atan2(y, x);
      const handlerSize = Math.floor(size / 2 * 0.3 / 2);

      this.setState({
        cx: Math.floor((size / 2) + (Math.floor(size / 2 * 0.6) + handlerSize) * Math.cos(angle)),
        cy: Math.floor((size / 2) - (Math.floor(size / 2 * 0.6) + handlerSize) * Math.sin(angle)),
        color: hsvToRgb(Math.abs(angle) * 180 / Math.PI)
      });

      if(typeof onChange === 'function') {
        onChange(hsvToRgb(Math.abs(angle) * 180 / Math.PI));
      }
    }
  }

  render() {
    const { size, className, centerRect } = this.props;
    const { cx, cy, color } = this.state;
    const handlerSize = Math.floor(size / 2 * 0.3 / 2);

    return (
      <svg 
        className={className}
        width={size}
        height={size}
        onMouseMove={this.handleMove}
        onMouseUp={this.handleUp}
        onTouchEnd={this.handleUp}
        onTouchMove={this.handleMove}
      >
        {this.renderSectors()}
        {centerRect ? <rect 
          x={size / 2 - 15}
          y={size / 2 - 15}
          height="30"
          width="30"
          fill={color}
        />: ''}
        <circle 
          onMouseDown={this.handleDown}
          onTouchStart={this.handleDown}
          cx={cx} 
          cy={cy} 
          r={handlerSize}
          fill="transparent"
          stroke="#363636"
          strokeWidth="5"
        />
      </svg>
    )
  }
}

CircularColor.propTypes = {
  size: PropTypes.number,
  numberOfSectors: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
  centerRect: PropTypes.bool
};

CircularColor.defaultProps = {
  size: 200,
  numberOfSectors: 360,
  centerRect: false
};

export default CircularColor;
