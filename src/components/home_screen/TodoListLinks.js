import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import TodoListCard from "./TodoListCard";

class TodoListLinks extends React.Component {
  render() {
    console.log("IN TODOLIST LINKS");
    let todoLists = this.props.todoLists;
    if (todoLists) todoLists.sort(sortingFunction);

    return (
      <div className="todo-lists section">
        {todoLists &&
          todoLists.map(todoList => (
            <Link to={"/todoList/" + todoList.id} key={todoList.id}>
              <TodoListCard todoList={todoList} />
            </Link>
          ))}
      </div>
    );
  }
}

const sortingFunction = (a, b) => {
  const firstSortVarA = a.lastModified.seconds;
  const firstSortVarB = b.lastModified.seconds;
  const secondSortVarA = a.lastModified.nanoseconds;
  const secondSortVarB = b.lastModified.nanoseconds;

  const winner =
    firstSortVarA < firstSortVarB
      ? 1
      : firstSortVarA === firstSortVarB
      ? secondSortVarA < secondSortVarB
        ? 1
        : -1
      : -1;
  return winner;
};

const mapStateToProps = state => {
  // console.log("Todolist screen state is: ");
  // console.log(state);
  return {
    todoLists: state.firestore.ordered.todoLists,
    auth: state.firebase.auth
  };
};

export default compose(connect(mapStateToProps))(TodoListLinks);
