# Manual Testing Plan for Todo Application

This document outlines the manual testing steps to ensure all functionalities of the Todo application are working as expected.

**Pre-requisites:**
*   A modern web browser with developer tools (console, local storage inspector).
*   The application files (`index.html`, `style.css`, `script.js`) served or opened locally in the browser.

**General Instructions:**
*   After each major action (add, complete, delete, edit), check the browser's local storage (usually under Developer Tools > Application > Local Storage) to verify that the `tasks` array is updated correctly.
*   Pay attention to the browser console for any errors.
*   Refresh the page at various points (as specified) to test data persistence via local storage.

---

## 1. Adding Tasks

**Test Case 1.1: Add a new task without due date or priority.**
1.  **Action:** Open `index.html`. Type "Test Task 1" into the task input field. Leave due date and priority as default. Click "Add Task".
2.  **Expected Result:**
    *   "Test Task 1" appears in the list.
    *   It should have a default priority indicator (e.g., medium - yellow left border).
    *   No due date is displayed.
    *   Local storage contains a task object for "Test Task 1" with `dueDate: null` and `priority: "Medium"`.
3.  **Verification:** Check UI and Local Storage.

**Test Case 1.2: Add a new task with a due date and specific priority.**
1.  **Action:** Type "Test Task 2" into the input. Select a due date (e.g., tomorrow). Select "High" priority. Click "Add Task".
2.  **Expected Result:**
    *   "Test Task 2" appears in the list.
    *   The selected due date is displayed.
    *   It has a "High" priority indicator (e.g., red left border).
    *   Local storage contains a task object for "Test Task 2" with the correct `dueDate` string and `priority: "High"`.
3.  **Verification:** Check UI and Local Storage.

**Test Case 1.3: Add a task by pressing 'Enter'.**
1.  **Action:** Type "Test Task Enter" into the input. Press 'Enter'.
2.  **Expected Result:**
    *   Task is added to the list as in Test Case 1.1.
3.  **Verification:** Check UI and Local Storage.

**Test Case 1.4: Attempt to add an empty task.**
1.  **Action:** Ensure the task input field is empty. Click "Add Task".
2.  **Expected Result:**
    *   No task is added to the list.
    *   Local storage remains unchanged.
    *   No errors in the console.
3.  **Verification:** Check UI and Local Storage.

---

## 2. Completing Tasks

**Test Case 2.1: Mark a task as complete.**
1.  **Action:** Add a task "Task to Complete". Click on the task text/info area.
2.  **Expected Result:**
    *   The task text gets a line-through.
    *   The task may change appearance (e.g., color).
    *   In local storage, the `completed` property for this task is `true`.
3.  **Verification:** Check UI and Local Storage.

**Test Case 2.2: Mark a completed task as incomplete.**
1.  **Action:** Click on the already completed "Task to Complete".
2.  **Expected Result:**
    *   The line-through is removed.
    *   Appearance reverts to normal.
    *   In local storage, the `completed` property for this task is `false`.
3.  **Verification:** Check UI and Local Storage.

**Test Case 2.3: Completion status persists after reload.**
1.  **Action:** Mark a task as complete. Refresh the page.
2.  **Expected Result:**
    *   The task remains marked as complete.
3.  **Verification:** Check UI.

---

## 3. Deleting Tasks

**Test Case 3.1: Delete a task.**
1.  **Action:** Add a task "Task to Delete". Click the "Delete" button for this task.
2.  **Expected Result:**
    *   The task is removed from the list (with a fade-out animation).
    *   The task is removed from local storage.
3.  **Verification:** Check UI and Local Storage.

**Test Case 3.2: Deleting tasks affects other tasks correctly.**
1.  **Action:** Add three tasks. Delete the middle task.
2.  **Expected Result:**
    *   The middle task is removed.
    *   The other two tasks remain.
    *   Local storage is updated correctly.
3.  **Verification:** Check UI and Local Storage.

---

## 4. Editing Tasks

**Test Case 4.1: Edit task text.**
1.  **Action:** Add "Original Text". Click its "Edit" button. The text becomes an input field. Change text to "Edited Text". Click "Save" (or press Enter, or click outside the input).
2.  **Expected Result:**
    *   The task text updates to "Edited Text" in the list.
    *   The "Save" button reverts to "Edit".
    *   Local storage is updated with "Edited Text".
    *   Due date and priority (if set) remain unchanged.
3.  **Verification:** Check UI and Local Storage.

**Test Case 4.2: Edit task text to empty.**
1.  **Action:** Add "Task to make empty". Click "Edit". Clear the text in the input. Click "Save".
2.  **Expected Result:**
    *   The task text becomes empty in the list.
    *   Local storage is updated with `text: ""`. (Verify application's intended behavior for empty tasks - does it delete or keep an empty task?)
3.  **Verification:** Check UI and Local Storage.

**Test Case 4.3: Cancel edit by blur (if save on blur is implemented).**
1.  **Action:** Add "Blur Test". Click "Edit". Change text to "New Text for Blur". Click outside the input field.
2.  **Expected Result:**
    *   Text should save as "New Text for Blur".
3.  **Verification:** Check UI and Local Storage.

---

## 5. Local Storage Persistence

**Test Case 5.1: Tasks persist after page reload.**
1.  **Action:**
    1.  Add several tasks with different properties (due dates, priorities, some completed).
    2.  Refresh the page.
2.  **Expected Result:**
    *   All tasks are still present with their correct text, completion status, due dates, and priorities.
    *   Visual indicators (overdue, due-soon, priority borders) are correctly applied.
3.  **Verification:** Check UI.

**Test Case 5.2: Actions modify local storage correctly.**
1.  **Action:** Perform various actions (add, complete, edit, delete).
2.  **Expected Result:** After each action, the `tasks` array in local storage reflects the change accurately.
3.  **Verification:** Check Local Storage frequently during other tests.

---

## 6. Filtering

**Test Case 6.1: Filter by "Active".**
1.  **Action:**
    1.  Add three tasks: "Active Task 1", "Completed Task 1", "Active Task 2".
    2.  Mark "Completed Task 1" as complete.
    3.  Click the "Active" filter button.
2.  **Expected Result:**
    *   Only "Active Task 1" and "Active Task 2" are visible.
    *   "Completed Task 1" is hidden.
    *   The "Active" button is highlighted.
3.  **Verification:** Check UI.

**Test Case 6.2: Filter by "Completed".**
1.  **Action:** With the same tasks as 6.1, click the "Completed" filter button.
2.  **Expected Result:**
    *   Only "Completed Task 1" is visible.
    *   "Active Task 1" and "Active Task 2" are hidden.
    *   The "Completed" button is highlighted.
3.  **Verification:** Check UI.

**Test Case 6.3: Filter by "All".**
1.  **Action:** With the same tasks, click the "All" filter button.
2.  **Expected Result:**
    *   All three tasks ("Active Task 1", "Completed Task 1", "Active Task 2") are visible.
    *   The "All" button is highlighted.
3.  **Verification:** Check UI.

**Test Case 6.4: Filter state persists after adding/completing a task.**
1.  **Action:**
    1.  Filter by "Active".
    2.  Add a new task "New Active Task".
    3.  Mark an existing active task as complete.
2.  **Expected Result:**
    *   "New Active Task" is visible (as it's active).
    *   The task marked as complete disappears from the "Active" view.
    *   The "Active" filter button remains highlighted.
3.  **Verification:** Check UI.

---

## 7. Due Dates

**Test Case 7.1: Add and display due date.**
1.  **Action:** Add a task with a specific due date (e.g., "2023-12-25").
2.  **Expected Result:**
    *   The due date is displayed in a readable format (e.g., "Due: 12/25/2023").
    *   Local storage has the correct due date string.
3.  **Verification:** Check UI and Local Storage.

**Test Case 7.2: Overdue visual indicator.**
1.  **Action:** Add a task with a due date set to yesterday.
2.  **Expected Result:**
    *   The task is marked as overdue (e.g., red text for due date, red left border).
    *   The `overdue` class is present on the `<li>` element.
3.  **Verification:** Check UI and inspect element classes.

**Test Case 7.3: Due-soon visual indicator.**
1.  **Action:** Add a task with a due date set to tomorrow.
2.  **Expected Result:**
    *   The task is marked as due-soon (e.g., orange text for due date, orange left border).
    *   The `due-soon` class is present on the `<li>` element.
3.  **Verification:** Check UI and inspect element classes.

**Test Case 7.4: No due date.**
1.  **Action:** Add a task without specifying a due date.
2.  **Expected Result:**
    *   No due date is displayed for the task.
    *   No overdue/due-soon indicators.
    *   `dueDate` in local storage is `null` or empty.
3.  **Verification:** Check UI and Local Storage.

---

## 8. Prioritization

**Test Case 8.1: Add and display priority.**
1.  **Action:** Add tasks with "High", "Medium", and "Low" priorities.
2.  **Expected Result:**
    *   Tasks display their respective priorities (e.g., High = red border, Medium = yellow, Low = green).
    *   Local storage has the correct priority string ("High", "Medium", "Low").
3.  **Verification:** Check UI and Local Storage.

**Test Case 8.2: Default priority.**
1.  **Action:** Add a task without explicitly selecting a priority.
2.  **Expected Result:**
    *   Task defaults to "Medium" priority (visual indicator and in local storage).
3.  **Verification:** Check UI and Local Storage.

---

## 9. Sorting

**Test Case 9.1: Sort by Due Date.**
1.  **Action:**
    1.  Add tasks with various due dates: Task A (tomorrow), Task B (today), Task C (next week), Task D (no due date).
    2.  Click "Sort by Due Date".
2.  **Expected Result:**
    *   Tasks are reordered: Task B, Task A, Task C, Task D (nulls last, ascending).
    *   "Sort by Due Date" button is highlighted.
3.  **Verification:** Check UI order.

**Test Case 9.2: Sort by Priority.**
1.  **Action:**
    1.  Add tasks: Task P1 (High), Task P2 (Low), Task P3 (Medium), Task P4 (High).
    2.  Click "Sort by Priority".
2.  **Expected Result:**
    *   Tasks are reordered: Task P1, Task P4 (High first), Task P3 (Medium), Task P2 (Low). (Order among same priorities might be original insertion or by text - check consistency).
    *   "Sort by Priority" button is highlighted.
3.  **Verification:** Check UI order.

**Test Case 9.3: Default Order (Clear Sort).**
1.  **Action:** After sorting by due date or priority, click "Default Order".
2.  **Expected Result:**
    *   Tasks revert to their original load order (usually the order they are in local storage, which is often insertion order).
    *   "Default Order" button is highlighted.
3.  **Verification:** Check UI order.

**Test Case 9.4: Sorting interacts with Filtering.**
1.  **Action:**
    1.  Add a mix of active/completed tasks with different due dates/priorities.
    2.  Apply a filter (e.g., "Active").
    3.  Sort the filtered list (e.g., "Sort by Priority").
2.  **Expected Result:**
    *   Only "Active" tasks are visible, and they are sorted by priority.
    *   The filter remains active. The sort button also remains active.
3.  **Verification:** Check UI.
4.  **Action:** Change filter to "All".
5.  **Expected Result:** All tasks are visible, still sorted by priority.
6.  **Verification:** Check UI.

---

This manual testing plan provides a structured approach to verifying the application's features. Each step should be performed carefully, observing both the UI and the underlying data in local storage.
