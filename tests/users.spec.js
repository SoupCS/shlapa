import { expect, test } from '@playwright/test';

const patt = '**/jsonplaceholder.typicode.com/users';

test('отображает пользователей из подменённого ответа', async ({ page }) => {
  const mockUsers = [
    { id: 1, name: 'Мок Иванов', email: 'ivanov@mock.test' },
    { id: 2, name: 'Мок Петрова', email: 'petrova@mock.test' },
  ];

  await page.route(patt, (route) =>
    route.fulfill({ status: 200, json: mockUsers }),
  );

  await page.goto('/');

  const items = page.getByTestId('users').locator('li');
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText('Мок Иванов');
  await expect(items.first()).toContainText('ivanov@mock.test');
  await expect(items.nth(1)).toContainText('Мок Петрова');
  await expect(page.getByRole('alert')).toBeHidden();
});

test('показывает уведомление при ошибке 403', async ({ page }) => {
  await page.route(patt, (route) =>
    route.fulfill({ status: 403, json: { message: 'запрещено' } }),
  );

  await page.goto('/');

  await expect(page.getByRole('alert')).toHaveText(
    'Ошибка 403: доступ запрещён. У вас нет прав для просмотра этих данных.',
  );
  await expect(page.getByTestId('users').locator('li')).toHaveCount(0);
});
