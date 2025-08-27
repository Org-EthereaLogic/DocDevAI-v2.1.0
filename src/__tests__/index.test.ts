import { version } from '../index';

describe('Application', () => {
  it('should have a version', () => {
    expect(version).toBe('1.0.0');
  });
});
