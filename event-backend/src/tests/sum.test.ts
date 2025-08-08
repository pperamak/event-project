//import { sum } from './sum';

const sum = (a: number, b: number):number =>{
  return a + b;
};

test('adds numbers correctly', () => {
  expect(sum(1, 2)).toBe(3);
});