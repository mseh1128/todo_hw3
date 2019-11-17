import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import TodoListCard from "./TodoListCard";

class TodoListLinks extends React.Component {
  render() {
    console.log("IN TODOLIST LINKS");
    const { todoLists } = this.props;

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

const mapStateToProps = (state, ownProps) => {
  // console.log("Todolist screen state is: ");
  return {
    todoLists: state.firestore.ordered.todoLists,
    auth: state.firebase.auth
  };
};

export default compose(connect(mapStateToProps))(TodoListLinks);
