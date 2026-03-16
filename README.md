# Expense Tracker

A clean, browser-based expense tracking application for recording daily spending, reviewing totals, and organizing expenses by category.

Built with plain HTML, CSS, and JavaScript, this project focuses on a polished user experience while keeping the codebase lightweight and easy to understand. Expense data is stored in the browser using `localStorage`, so entries remain available after page refreshes.

## Overview

The Expense Tracker helps users:

- Add and save daily expenses
- Organize purchases by category
- View running totals and entry counts
- Filter expenses by category
- Remove expenses when no longer needed
- Keep data persisted locally in the browser

## Features

- Professional responsive interface with a modern card-based layout
- Expense form with validation for description, amount, and category
- Real-time summary cards for total expenses, visible entries, and categories used
- Category filter for narrowing the displayed list
- Delete action for removing saved expenses
- Local persistence with `window.localStorage`
- Object-oriented JavaScript structure for expense management

## Technologies used

- `HTML5`
- `CSS3`
- `JavaScript`

## Project Structure

```text
Expense_Tracker/
|-- index.html
|-- styles.css
|-- script.js
|-- README.md
```

## How It Works

### 1. Add an Expense

Users enter:

- A short description
- The amount spent
- A category

When the form is submitted, the application validates the data, creates a new expense object, saves it to local storage, and updates the interface.

### 2. Track Spending

The app calculates and displays:

- Total amount spent
- Number of currently visible expenses
- Number of categories in use

### 3. Filter by Category

Users can choose a specific category from the filter dropdown to focus only on matching entries.

### 4. Persist Data

Saved expenses remain available even after refreshing the page because they are stored in the browser.

## Getting Started

No installation or build setup is required.

### Open Directly

Open [`index.html`](./index.html) in any modern web browser.



## Usage

1. Open the application in your browser.
2. Enter an expense description.
3. Add the amount spent.
4. Choose or type a category.
5. Click `Add expense`.
6. Review the updated totals and expense list.
7. Use the category filter to narrow results.
8. Click `Delete` to remove an entry.

## Data Storage

This project stores expense records in the browser under a local storage key:

```text
expense-tracker-expenses
```

If browser storage is cleared, the saved expense history will also be removed.

## Possible Improvements

- Edit existing expense entries
- Add date-based filtering and reporting
- Support multiple currencies
- Add charts for spending insights
- Export expenses to CSV or PDF
- Add monthly and weekly summaries

 ## Screenshots

 ![Website screenshots](images/expense_screenshots%20(1).png)
 ![Website screenshots](images/expense_screenshots%20(2).png)
 ![Website screenshots](images/expense_screenshots%20(3).png)

 ## Links
 [Github repository](https://github.com/josephgakono/Expense_tracker)
 [live demo](https://josephgakono.github.io/Expense_tracker/)
