import fs from 'fs';
import { fetch_json, FetchError } from './fetchJson'; // Adjust the import path accordingly
import { isLeft, isRight } from 'fp-ts/lib/Either';

// Mocking the global fetch function
global.fetch = jest.fn();

describe('fetch_json', () => {
  beforeEach(() => {
    jest.resetModules(); // Clears any cache between tests
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch and return JSON data', async () => {
    // Mocking a successful fetch response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(JSON.parse(fs.readFileSync(`${__dirname}/../../public/assets/test_json.json`, 'utf8'))),
      })
    );

    const result = await fetch_json('public/assets/test_json.json');
    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      const data = result.right;
      expect(data).toEqual(JSON.parse(fs.readFileSync('path/to/test_json.json', 'utf8')));
    }
  });

  it('should return an error for an unknown URL', async () => {
    // Mocking a failed fetch response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    const result = await fetch_json('path/to/unknown/url');
    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      const error = result.left;
      expect(error.message).toBe('HTTP error! Status: 404');
    }
  });
});
