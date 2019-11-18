import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import ItemCard from "./ItemCard";
import { firestoreConnect } from "react-redux-firebase";
import { removeItemHandler } from "../../store/database/asynchHandler";
import { moveItemDownHandler } from "../../store/database/asynchHandler";
import { moveItemUpHandler } from "../../store/database/asynchHandler";

class ItemsList extends React.Component {
  getItemsArr(todoList, items) {
    console.log("Current context is: ");
    console.log(this);
    const { removeItems, moveItemUp, moveItemDown } = this.props;
    const { sortCriteriaName, sortCriteriaAsc } = this.props.todoList;
    console.log("GETSITEMSARR: CRITERIA NAME IS " + sortCriteriaName);
    console.log("GETSITEMSARR: CRITERIA ASC IS " + sortCriteriaAsc);

    if (sortCriteriaName && sortCriteriaAsc !== null) {
      console.log("GETSITEMSARR: GOING TO SORT ITEMS NOW");
      this.sortTasksHeader(items, sortCriteriaName, sortCriteriaAsc);
    }
    if (items) {
      const arrLength = items.length;
      return items.map(function(item, index) {
        let firstItem = false;
        let secondItem = false;
        if (index === 0) firstItem = true;
        if (index === arrLength - 1) secondItem = true;
        item.id = item.key;
        return (
          <ItemCard
            todoList={todoList}
            item={item}
            removeItems={removeItems}
            moveItemUp={moveItemUp}
            moveItemDown={moveItemDown}
            indexPos={index}
            firstItem={firstItem}
            lastItem={secondItem}
          />
        );
      });
    } else {
      return null;
    }
  }

  sortTasksHeader = (itemsToSort, sortType, ascending) => {
    console.log("IN SORT TASKS HEADER: ");
    console.log("IN SORT TASKS HEADER: ITEMSTOSORT");
    console.log(itemsToSort);
    console.log("IN SORT TASKS HEADER: SORT TYPE");
    console.log(sortType);
    console.log("IN SORT TASKS HEADER: ASCENDING");
    console.log(ascending);
    if (sortType === "task") {
      if (ascending) {
        itemsToSort.sort((a, b) => this.taskSortComparator(a, b));
      } else {
        itemsToSort.sort((a, b) => this.taskSortComparator(a, b)).reverse();
      }
    } else if (sortType === "due_date") {
      if (ascending) {
        itemsToSort.sort((a, b) => this.dueDateSortComparator(a, b));
      } else {
        itemsToSort.sort((a, b) => this.dueDateSortComparator(a, b)).reverse();
      }
    } else {
      // status
      if (ascending) {
        itemsToSort.sort((a, b) => this.statusSortComparator(a, b));
      } else {
        itemsToSort.sort((a, b) => this.statusSortComparator(a, b)).reverse();
      }
    }
  };

  taskSortComparator = (a, b) => {
    if (a.description > b.description) {
      return -1;
    }
    if (b.description > a.description) {
      return 1;
    }
    return 0;
  };

  dueDateSortComparator = (a, b) => {
    if (new Date(a.due_date) > new Date(b.due_date)) {
      return -1;
    }
    if (new Date(b.due_date) > new Date(a.due_date)) {
      return 1;
    }
    return 0;
  };

  statusSortComparator = (a, b) => {
    if (a.completed > b.completed) {
      return -1;
    }
    if (b.completed > a.completed) {
      return 1;
    }
    return 0;
  };

  render() {
    const todoList = this.props.todoList;
    const items = todoList.items;
    const { removeItems } = this.props;
    console.log("ItemsList: todoList.id " + todoList.id);
    const itemArray = items ? this.getItemsArr(todoList, items) : null;
    console.log(itemArray);

    return <div className="todo-lists section">{itemArray}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const todoList = ownProps.todoList;
  console.log(ownProps);
  return {
    todoList,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => ({
  removeItems: (todoList, id) => dispatch(removeItemHandler(todoList, id)),
  moveItemUp: (todoList, id) => dispatch(moveItemUpHandler(todoList, id)),
  moveItemDown: (todoList, id) => dispatch(moveItemDownHandler(todoList, id))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(ItemsList);
