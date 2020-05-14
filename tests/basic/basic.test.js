//@ts-nocheck

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:4444/tests/basic/index.html');
  });

  it('should display things', async () => {
    await expect(page).toMatchElement('.gstc__list-column-header-resizer-container--label', {
      text: 'Label',
    });
  });
});
