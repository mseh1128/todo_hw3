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

  render() {
    const todoList = this.props.todoList;
    const items = todoList.items;
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
