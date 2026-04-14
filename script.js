(function(){
  const KEY = 'todos_simple';
  let todos = [];

  const inp      = document.getElementById('inp');
  const addBtn   = document.getElementById('addBtn');
  const list     = document.getElementById('list');
  const empty    = document.getElementById('empty');
  const msgEl    = document.getElementById('msg');
  const countEl  = document.getElementById('count');
  const footer   = document.getElementById('footer');
  const clearBtn = document.getElementById('clearBtn');

  let msgTimer;
  function msg(text, ok) {
    clearTimeout(msgTimer);
    msgEl.textContent = text;
    msgEl.className = 'msg' + (ok ? ' ok' : '');
    msgTimer = setTimeout(() => { msgEl.textContent = ''; }, 2600);
  }

  function save() { localStorage.setItem(KEY, JSON.stringify(todos)); }

  function load() {
    try {
      const d = localStorage.getItem(KEY);
      if (d) todos = JSON.parse(d);
    } catch(e) { todos = []; }
  }

  function add() {
    const text = inp.value.trim();
    if (!text) { msg('what do you want to do? '); inp.focus(); return; }
    if (todos.some(t => t.text.toLowerCase() === text.toLowerCase())) {
      msg('Oopps that\'s already on your list!'); inp.select(); return;
    }
    todos.unshift({ id: Date.now() + Math.random(), text, done: false });
    save(); render();
    msg('Successfully added!', true);
    inp.value = ''; inp.focus();
  }

  function toggle(id) {
    const t = todos.find(t => t.id === id);
    if (t) { t.done = !t.done; save(); render(); }
  }

  function remove(id) {
    const li = list.querySelector('[data-id="' + id + '"]');
    if (li) {
      li.classList.add('bye');
      li.addEventListener('animationend', () => {
        todos = todos.filter(t => t.id !== id);
        save(); render();
      }, { once: true });
    }
  }

  function clearDone() {
    todos = todos.filter(t => !t.done);
    save(); render();
  }

  function render() {
    list.innerHTML = '';
    const left = todos.filter(t => !t.done).length;
    const done = todos.filter(t => t.done).length;

    empty.style.display = todos.length === 0 ? 'block' : 'none';
    footer.style.display = todos.length > 0 ? 'flex' : 'none';
    clearBtn.style.display = done > 0 ? 'inline' : 'none';

    if (left === 0 && done > 0) countEl.textContent = ' Good Job😎! Tasks completed';
    else if (left === 1) countEl.textContent = 'You got this 👍 1 more to go';
    else if (left > 1) countEl.textContent = left + ' more to go';
    else countEl.textContent = '';

    todos.forEach(t => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.setAttribute('data-id', t.id);

      const chk = document.createElement('div');
      chk.className = 'check' + (t.done ? ' checked' : '');
      chk.addEventListener('click', () => toggle(t.id));

      const span = document.createElement('span');
      span.className = 'item-text' + (t.done ? ' done' : '');
      span.textContent = t.text;

      const del = document.createElement('button');
      del.className = 'del-btn';
      del.textContent = '✕';
      del.title = 'remove';
      del.addEventListener('click', () => remove(t.id));

      li.append(chk, span, del);
      list.appendChild(li);
    });
  }

  addBtn.addEventListener('click', add);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  clearBtn.addEventListener('click', clearDone);

  load(); render();
})();

