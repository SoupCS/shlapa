const statusEl = document.getElementById('status');
const errorEl = document.getElementById('error');
const usersEl = document.getElementById('users');

const showError = (message) => {
  statusEl.hidden = true;
  errorEl.textContent = message;
  errorEl.hidden = false;
};

const renderUsers = (users) => {
  statusEl.hidden = true;
  usersEl.replaceChildren(
    ...users.map((user) => {
      const li = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = user.name;
      const email = document.createElement('div');
      email.className = 'email';
      email.textContent = user.email;
      li.append(name, email);
      return li;
    }),
  );
};

const loadUsers = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (response.status === 403) {
      showError('Ошибка 403: доступ запрещён. У вас нет прав для просмотра этих данных.');
      return;
    }
    if (!response.ok) {
      showError(`Не удалось загрузить данные (статус ${response.status}).`);
      return;
    }

    renderUsers(await response.json());
  } catch {
    showError('Ошибка сети: не удалось выполнить запрос.');
  }
};

loadUsers();
