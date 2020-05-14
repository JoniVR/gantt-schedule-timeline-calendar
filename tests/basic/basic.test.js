// @ts-nocheck
const path = require('path');
const url = 'file:///' + path.resolve('./tests/basic');

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`${url}/index.html`);
  });

  it('should display things', async () => {
    await expect(page).toMatchElement('.gstc__list-column-header-resizer-container--label', {
      text: 'Label',
    });
  });
});
