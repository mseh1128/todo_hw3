export const sortTasksHeader = (itemsToSort, sortType, ascending) => {
  console.log("IN SORT TASKS HEADER: ");
  console.log("IN SORT TASKS HEADER: ITEMSTOSORT");
  console.log(itemsToSort);
  console.log("IN SORT TASKS HEADER: SORT TYPE");
  console.log(sortType);
  console.log("IN SORT TASKS HEADER: ASCENDING");
  console.log(ascending);
  if (sortType === "task") {
    if (ascending) {
      itemsToSort.sort((a, b) => taskSortComparator(a, b));
    } else {
      itemsToSort.sort((a, b) => taskSortComparator(a, b)).reverse();
    }
  } else if (sortType === "due_date") {
    if (ascending) {
      itemsToSort.sort((a, b) => dueDateSortComparator(a, b));
    } else {
      itemsToSort.sort((a, b) => dueDateSortComparator(a, b)).reverse();
    }
  } else {
    // status
    if (ascending) {
      itemsToSort.sort((a, b) => statusSortComparator(a, b));
    } else {
      itemsToSort.sort((a, b) => statusSortComparator(a, b)).reverse();
    }
  }
};

const taskSortComparator = (a, b) => {
  if (a.description > b.description) {
    return -1;
  }
  if (b.description > a.description) {
    return 1;
  }
  return 0;
};

const dueDateSortComparator = (a, b) => {
  if (new Date(a.due_date) > new Date(b.due_date)) {
    return -1;
  }
  if (new Date(b.due_date) > new Date(a.due_date)) {
    return 1;
  }
  return 0;
};

const statusSortComparator = (a, b) => {
  if (a.completed > b.completed) {
    return -1;
  }
  if (b.completed > a.completed) {
    return 1;
  }
  return 0;
};
