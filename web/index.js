let tasks = [];

const form = document.getElementById("add-form");
const input = document.getElementById("input");
const listEl = document.getElementById("list");
const listDoneEl = document.getElementById("list-done");
const openFile = document.getElementById("openFile");
const saveBtn = document.getElementById("saveBtn");

const API = "https://todo-app-6omx.onrender.com";

async function loadTodos() {
    const res = await fetch(`${API}/todos`);
    tasks = await res.json();
    render();
}

loadTodos();

// добавить
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    await loadTodos();
    input.value = "";
});


// выполнено/не выполнено
async function toggle(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    await fetch(`${API}/todos/${id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(!t.done)
    });

    await loadTodos();
}


// редактировать
async function editTodo(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    const val = prompt("Изменить текст:", t.text);
    if (val === null) return;

    const txt = val.trim();
    if (!txt) return;

    await fetch(`${API}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txt)
    });

    await loadTodos();
}


// удалить
async function removeTodo(id) {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' });
    await loadTodos();
}


//рендер
function render() {
    listEl.innerHTML = "";
    listDoneEl.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        const li = document.createElement("li");

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = t.done;
        cb.addEventListener("change", function () { toggle(t.id); });

        const span = document.createElement("span");
        span.className = "todo-text" + (t.done ? " done" : "");
        span.textContent = t.text;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Редактировать";
        editBtn.addEventListener("click", function () { editTodo(t.id); });

        const delBtn = document.createElement("button");
        delBtn.textContent = "Удалить";
        delBtn.className = "danger";
        delBtn.addEventListener("click", function () { removeTodo(t.id); });

        actions.append(editBtn, delBtn);
        li.append(cb, span, actions);

        if (t.done) listDoneEl.appendChild(li);
        else listEl.appendChild(li);
    }

    if (!tasks.some(t => !t.done)) {
        listEl.innerHTML = '<li class="empty">Нет активных дел</li>';
    }
    if (!tasks.some(t => t.done)) {
        listDoneEl.innerHTML = '<li class="empty">Пока ничего не выполнено</li>';
    }
}

// экспорт
saveBtn.addEventListener("click", function () {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "todos.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
});

// импорт
openFile.addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        try {
            const arr = JSON.parse(String(reader.result));
            if (!Array.isArray(arr)) {
                alert("не)))");
                return;
            }
            tasks = arr.map(function (x) {
                return {
                    id: Number(x.id) || Date.now(),
                    text: String(x.text || ""),
                    done: Boolean(x.done)
                };
            });
            render();
        } catch (err) {
            alert("неее))");
            console.error(err);
        } finally {
            e.target.value = "";
        }
    };
    reader.readAsText(file);
});
