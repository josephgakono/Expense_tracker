(function createExpenseTrackerApp() {
  const STORAGE_KEY = "expense-tracker-expenses";

  class Expense {
    constructor(expenseData) {
      const { id, description, amount, category, createdAt } = expenseData;

      this.id = id || Expense.createId();
      this.description = String(description).trim();
      this.amount = Number(amount);
      this.category = String(category).trim();
      this.createdAt = createdAt || new Date().toISOString();
    }

    static createId() {
      return "expense-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
    }
  }

  class ExpenseTracker {
    constructor(storageKey) {
      this.storageKey = storageKey || STORAGE_KEY;
      this.expenses = [];
      this.loadExpenses();
    }

    validateExpenseData(expenseData) {
      const { description, amount, category } = expenseData;

      if (!description || !String(description).trim()) {
        throw new Error("Please enter an expense description.");
      }

      if (!category || !String(category).trim()) {
        throw new Error("Please enter an expense category.");
      }

      if (Number(amount) <= 0 || isNaN(Number(amount))) {
        throw new Error("Please enter a valid amount greater than zero.");
      }
    }

    normalizeExpenses(expenses) {
      return expenses.map(function (expense) {
        this.validateExpenseData(expense);

        if (expense instanceof Expense) {
          return expense;
        }

        return new Expense(expense);
      }, this);
    }

    addExpenses(...expenseEntries) {
      const normalizedExpenses = this.normalizeExpenses(expenseEntries);
      this.expenses = [...this.expenses, ...normalizedExpenses];
      this.saveExpenses();
      return normalizedExpenses;
    }

    removeExpense(expenseId) {
      const startingCount = this.expenses.length;

      this.expenses = this.expenses.filter(function (expense) {
        return expense.id !== expenseId;
      });

      if (this.expenses.length !== startingCount) {
        this.saveExpenses();
        return true;
      }

      return false;
    }

    getExpenses() {
      return this.expenses.slice();
    }

    getCategories() {
      const categories = [];

      this.expenses.forEach(function (expense) {
        if (categories.indexOf(expense.category) === -1) {
          categories.push(expense.category);
        }
      });

      return categories.sort();
    }

    filterExpensesByCategory(category) {
      const selectedCategory = category || "All";

      if (selectedCategory === "All") {
        return this.getExpenses();
      }

      return this.expenses.filter(function (expense) {
        return (
          expense.category.toLowerCase() ===
          String(selectedCategory).trim().toLowerCase()
        );
      });
    }

    getTotalExpenses(expenses) {
      const expenseList = expenses || this.expenses;

      return expenseList.reduce(function (total, expense) {
        return total + Number(expense.amount);
      }, 0);
    }

    saveExpenses() {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.expenses),
      );
    }

    loadExpenses() {
      try {
        const storedExpenses = window.localStorage.getItem(this.storageKey);

        if (!storedExpenses) {
          this.expenses = [];
          return;
        }

        const parsedExpenses = JSON.parse(storedExpenses);

        if (Array.isArray(parsedExpenses)) {
          this.expenses = this.normalizeExpenses(parsedExpenses);
        } else {
          this.expenses = [];
        }
      } catch (error) {
        this.expenses = [];
      }
    }
  }

  const tracker = new ExpenseTracker();
  const state = {
    selectedCategory: "All",
  };

  const categorySuggestions = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Health",
    "Entertainment",
    "Utilities",
  ];

  const currentDateElement = document.querySelector("[data-current-date]");
  const expenseForm = document.querySelector("[data-expense-form]");
  const formMessage = document.querySelector("[data-form-message]");
  const totalAmount = document.querySelector("[data-total-amount]");
  const entryCount = document.querySelector("[data-entry-count]");
  const categoryCount = document.querySelector("[data-category-count]");
  const categoryFilter = document.querySelector("[data-category-filter]");
  const filterNote = document.querySelector("[data-filter-note]");
  const expenseList = document.querySelector("[data-expense-list]");
  const categorySuggestionList = document.querySelector(
    "#category-suggestions",
  );

  function formatMoney(amount) {
    return "KES " + Number(amount).toFixed(2);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      days[date.getDay()] +
      ", " +
      months[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear()
    );
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = "AM";

    if (hours >= 12) {
      period = "PM";
    }

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return hours + ":" + minutes + " " + period;
  }

  function updateCurrentDate() {
    currentDateElement.textContent = formatDate(new Date().toISOString());
  }

  function setMessage(message, stateName) {
    formMessage.textContent = message;

    if (stateName) {
      formMessage.setAttribute("data-state", stateName);
    } else {
      formMessage.removeAttribute("data-state");
    }
  }

  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function getMergedCategories() {
    const mergedCategories = categorySuggestions.slice();
    const savedCategories = tracker.getCategories();

    savedCategories.forEach(function (category) {
      if (mergedCategories.indexOf(category) === -1) {
        mergedCategories.push(category);
      }
    });

    return mergedCategories.sort();
  }

  function renderCategorySuggestions() {
    const categories = getMergedCategories();

    clearChildren(categorySuggestionList);

    categories.forEach(function (category) {
      const option = document.createElement("option");
      option.value = category;
      categorySuggestionList.appendChild(option);
    });
  }

  function renderFilters() {
    const categories = ["All"].concat(tracker.getCategories());

    if (categories.indexOf(state.selectedCategory) === -1) {
      state.selectedCategory = "All";
    }

    clearChildren(categoryFilter);

    categories.forEach(function (category) {
      const option = document.createElement("option");

      option.value = category;
      option.textContent = category === "All" ? "All categories" : category;

      if (category === state.selectedCategory) {
        option.selected = true;
      }

      categoryFilter.appendChild(option);
    });
  }

  function createMetaItem(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  }

  function createExpenseItem(expense) {
    const { id, description, amount, category, createdAt } = expense;

    const item = document.createElement("li");
    item.className = "item";

    const main = document.createElement("div");
    main.className = "main";

    const top = document.createElement("div");
    top.className = "top";

    const title = document.createElement("h3");
    title.className = "title";
    title.textContent = description;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = category;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.appendChild(createMetaItem("Saved " + formatTime(createdAt)));
    meta.appendChild(createMetaItem("Stored locally"));

    const actions = document.createElement("div");
    actions.className = "actions";

    const amt = document.createElement("p");
    amt.className = "amt";
    amt.textContent = formatMoney(amount);

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("data-id", id);

    top.appendChild(title);
    top.appendChild(tag);
    main.appendChild(top);
    main.appendChild(meta);
    actions.appendChild(amt);
    actions.appendChild(del);
    item.appendChild(main);
    item.appendChild(actions);

    return item;
  }

  function renderSummary(expenses) {
    const total = tracker.getTotalExpenses(expenses);
    const categories = tracker.getCategories();
    let entryLabel = "expenses";
    let categoryLabel = "categories";

    if (expenses.length === 1) {
      entryLabel = "expense";
    }

    if (categories.length === 1) {
      categoryLabel = "category";
    }

    totalAmount.textContent = formatMoney(total);
    entryCount.textContent = expenses.length + " " + entryLabel;
    categoryCount.textContent = categories.length + " " + categoryLabel;

    if (state.selectedCategory === "All") {
      filterNote.textContent = "Showing every category";
    } else {
      filterNote.textContent = "Filtered by " + state.selectedCategory;
    }
  }

  function renderEmpty() {
    const empty = document.createElement("li");
    const title = document.createElement("h3");
    const text = document.createElement("p");

    empty.className = "empty";
    title.textContent = "No matching expenses";

    if (state.selectedCategory === "All") {
      text.textContent =
        "Add your first expense to start tracking today's spending.";
    } else {
      text.textContent =
        "No expenses found in " + state.selectedCategory + " right now.";
    }

    empty.appendChild(title);
    empty.appendChild(text);
    expenseList.appendChild(empty);
  }

  function renderExpenseList(expenses) {
    clearChildren(expenseList);

    if (expenses.length === 0) {
      renderEmpty();
      return;
    }

    expenses.forEach(function (expense) {
      expenseList.appendChild(createExpenseItem(expense));
    });
  }

  function render() {
    const visibleExpenses = tracker.filterExpensesByCategory(
      state.selectedCategory,
    );

    renderCategorySuggestions();
    renderFilters();
    renderSummary(visibleExpenses);
    renderExpenseList(visibleExpenses);
  }

  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const { description, amount, category } = expenseForm.elements;

    const expenseData = {
      description: description.value,
      amount: amount.value,
      category: category.value,
    };

    try {
      const addedExpenses = tracker.addExpenses(expenseData);
      const firstExpense = addedExpenses[0];

      setMessage(
        "Added " +
        firstExpense.description +
        " to " +
        firstExpense.category +
        ".",
        "success",
      );
      expenseForm.reset();
      description.focus();
      render();
    } catch (error) {
      setMessage(error.message, "error");
    }
  });

  categoryFilter.addEventListener("change", function () {
    state.selectedCategory = categoryFilter.value;
    render();
  });

  expenseList.addEventListener("click", function (event) {
    if (event.target.className !== "del") {
      return;
    }

    const expenseId = event.target.getAttribute("data-id");

    if (tracker.removeExpense(expenseId)) {
      setMessage("Expense removed from your list.", "success");
      render();
    }
  });

  updateCurrentDate();
  render();
})();
