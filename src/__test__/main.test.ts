import { main } from '../main.js';

describe('main', () => {
  it('should return hello', async () => {
    const res = await main();

    expect(res).toEqual('hello');
  });
});
