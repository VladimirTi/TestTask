class Todos {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    this.render();
    this.deleteTodo = this.deleteTodo.bind(this);
    document.querySelector('#add').addEventListener('click', this.addingNew.bind(this));
    window.addEventListener('beforeunload', () => localStorage.setItem('tasks', JSON.stringify(this.tasks)))
  }

  render() {
    document.querySelector('#conteiner').innerHTML = '';
    Object.entries(this.tasks).forEach(([date, todos]) => {
      const day = this.createNewDay(date);
      todos.forEach(todo => {
        this.createTask(day, todo, date);
      });
    });
  }

  createNewDay(day) {
    const table = document.createElement('table');
    table.className = 'todo-list';
    table.innerHTML = `<thead><tr><th colspan="6">${day}</th></tr></thead>`;
    const tbody = document.createElement('tbody');
    table.append(tbody);
    return table;
  }

  createTask(table, todo, date) {
    const tbody = table.querySelector('tbody');
    const [task, start, end] = todo;
    const row = tbody.insertRow();

    const taskCell = row.insertCell();
    taskCell.innerText = task;

    const corection = row.insertCell();
    corection.className = 'correction-custom1';

    const startCell = row.insertCell();
    startCell.setAttribute('data-start', start);
    startCell.innerText = start;

    const endCell = row.insertCell();
    endCell.setAttribute('data-end', end);
    endCell.innerText = end;

    const correctionButton = row.insertCell();
    correctionButton.setAttribute('data-day', date);
    correctionButton.innerHTML = '&#9998';

    const deleteButton = row.insertCell();
    deleteButton.setAttribute('data-day', date);
    deleteButton.innerHTML = `&times;`;

    table.append(tbody);
    document.querySelector('#conteiner').append(table);

    correctionButton.addEventListener('click', this.correctTodo.bind(this));

    deleteButton.addEventListener('click', this.deleteTodo.bind(this));
  }

  addingNew(event) {
    event.preventDefault()
    const nameTodo = document.querySelector('#name').value;
    const dateTodo = document.querySelector('#date').value.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3.$2.$1');
    const startTodo = document.querySelector('#start').value;
    const endTodo = document.querySelector('#end').value;
    if (nameTodo && dateTodo && startTodo && endTodo) {
      this.tasks[dateTodo] ?
        this.tasks[dateTodo].push([nameTodo, startTodo, endTodo]) :
        this.tasks[dateTodo] = [[nameTodo, startTodo, endTodo]];
      document.querySelector('#name').value = '';
      document.querySelector('#date').value = '';
      document.querySelector('#start').value = '';
      document.querySelector('#end').value = '';
      this.render();
    }
  }

  correctTodo(event) {
    const list = event.target.parentElement.children;
    const day = event.target.dataset.day;

    const date = document.createElement('input');
    date.type = 'text';
    date.value = day;
    list[1].append(date);

    const start = document.createElement('input');
    start.type = 'time';
    start.value = list[2].innerHTML;
    list[2].innerHTML = '';
    list[2].append(start);

    const end = document.createElement('input');
    end.type = 'time';
    end.value = list[3].innerHTML;
    list[3].innerHTML = '';
    list[3].append(end);

    list[4].replaceWith(document.createElement('td'));
    list[4].innerHTML = '&#10003;';
    list[4].addEventListener('click', this.saveCorrectData.bind(this));
  }

  saveCorrectData(event) {
    const collection = event.target.parentElement.children;
    const day = event.target.nextElementSibling.dataset.day;
    const index = this.tasks[day].findIndex(todo => todo[0] === collection[0].innerHTML);
    const task = this.tasks[day][index];
    task[2] = collection[3].firstChild.value;
    task[1] = collection[2].firstChild.value;
    if (collection[1].firstChild.value !== day) {
      console.log('I didn`t made changing the day');
    }
    this.render();
  }

  deleteTodo(event) {
    const day = event.target.dataset.day;
    const task = event.target.parentElement.firstChild.innerHTML;
    this.tasks[day] = this.tasks[day].filter(todo => todo[0] !== task);
    this.render();
  }
}

  const todos = new Todos;
