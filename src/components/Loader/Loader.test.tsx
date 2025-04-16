import React from 'react';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });

  it('contains the preloader div', () => {
    const { container } = render(<Loader />);
    const preloader = container.querySelector('.preloader');
    expect(preloader).toBeInTheDocument();
  });

  it('renders the SVG inside preloader', () => {
    const { container } = render(<Loader />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('SVG has the correct attributes', () => {
    const { container } = render(<Loader />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('id', 'sun');
    expect(svgElement).toHaveAttribute('xmlns');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 10 10');
  });

  it('applies the correct inline styles', () => {
    const { container } = render(<Loader />);
    const preloader = container.querySelector('.preloader');
    expect(preloader).toHaveStyle({ opacity: '1' });
  });
});
