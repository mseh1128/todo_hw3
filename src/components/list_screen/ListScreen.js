import React, { Component } from "react";
import { updateTodoList } from "../../store/database/asynchHandler";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ItemsList from "./ItemsList.js";
import { firestoreConnect } from "react-redux-firebase";
import { Icon, Button } from "react-materialize";
import { sortByCriteriaHandler } from "../../store/database/asynchHandler";

class ListScreen extends Component {
  state = {
    name: this.props.todoList.name,
    owner: this.props.todoList.owner
  };

  handleChange = e => {
    const { target } = e;
    const { id } = this.props.todoList;
    const { sortByCriteria } = this.props;
    this.setState(
      {
        [target.id]: target.value
      },
      () => this.props.updateTodoList(this.state, id)
    );
  };

  render() {
    console.log("State in render is: ");
    console.log(this.state);
    const auth = this.props.auth;
    const { todoList } = this.props;
    const { name, owner } = this.state;
    const { sortByCriteria } = this.props;
    if (!auth.uid) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container white">
        <h5 className="grey-text text-darken-3">Todo List</h5>
        <div className="input-field">
          <label htmlFor="email">Name</label>
          <input
            className="active"
            type="text"
            name="name"
            id="name"
            onChange={this.handleChange}
            value={name}
          />
        </div>
        <div className="input-field">
          <label htmlFor="password">Owner</label>
          <input
            className="active"
            type="text"
            name="owner"
            id="owner"
            onChange={this.handleChange}
            value={owner}
          />
        </div>
        <div id="list_item_container">
          <div class="list_item_header_card">
            <div
              class="list_item_task_header"
              onClick={() => sortByCriteria(todoList, "task")}
            >
              Task
            </div>
            <div
              class="list_item_due_date_header"
              onClick={() => sortByCriteria(todoList, "due_date")}
            >
              Due Date
            </div>
            <div
              class="list_item_status_header"
              onClick={() => sortByCriteria(todoList, "status")}
            >
              Status
            </div>
          </div>
          <ItemsList todoList={todoList} />
        </div>
        <div
          class="list_item_create_new_item_container"
          onClick={() => console.log("I WAS FINALLY CLICKED")}
        >
          <Button icon={<Icon>add</Icon>} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("MAP STATE TO PROPS CALLED IN LISTSCREEN");
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => ({
  updateTodoList: (todoList, docID) =>
    dispatch(updateTodoList(todoList, docID)),
  sortByCriteria: (todoList, criteriaName) =>
    dispatch(sortByCriteriaHandler(todoList, criteriaName))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(ListScreen);
