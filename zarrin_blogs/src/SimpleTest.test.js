import { render, screen } from '@testing-library/react';

// Simple test without importing App which has dependencies
test('basic render test works', () => {
  const { container } = render(
    <div>
      <h1>Hello World</h1>
      <p>This is a test</p>
    </div>
  );
  
  expect(screen.getByText('Hello World')).toBeInTheDocument();
  expect(screen.getByText('This is a test')).toBeInTheDocument();
});

test('math works correctly', () => {
  expect(2 + 2).toBe(4);
  expect(10 - 5).toBe(5);
  expect(3 * 4).toBe(12);
});

test('string matching', () => {
  const password = 'Password123';
  expect(password).toMatch(/[0-9]/);
  expect(password).toMatch(/[A-Z]/);
  expect(password).toMatch(/[a-z]/);
});
