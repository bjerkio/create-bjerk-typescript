import { main } from '../main';

describe('main', () => {
  it('should return hello', async () => {
    const res = await main();

    expect(res).toEqual('hello');
  });
});
