import { render } from '@testing-library/react';
import App from '../src/App';

describe('<App /> Integration Tests', () => {
  it('renders the main application title and components', () => {
    render(<App />);
  });
});
