import React, { Component } from "react";
import { updateTodoList } from "../../store/database/asynchHandler";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ItemsList from "./ItemsList.js";
import { firestoreConnect } from "react-redux-firebase";
import { Icon, Button, Modal } from "react-materialize";
import {
  updateTodoItemHandler,
  sortByCriteriaHandler,
  removeTodoListHandler
} from "../../store/database/asynchHandler";

class ListScreen extends Component {
  state = {
    name: this.props.todoList ? this.props.todoList.name : null,
    owner: this.props.todoList ? this.props.todoList.owner : null
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

  goToEditPage = editPageID => {
    const { id } = this.props.todoList;
    this.props.history.push("/todoList/" + id + "/" + editPageID);
  };

  getLargestKey = () => {
    return Math.max.apply(
      Math,
      this.props.todoList.items.map(function(o) {
        return o.key;
      })
    );
  };

  createNewItem = () => {
    let newItemKey = 0;
    if (this.props.todoList.items.length !== 0)
      newItemKey = this.getLargestKey() + 1;
    const newItem = {
      key: newItemKey,
      id: newItemKey,
      description: "",
      due_date: "",
      assigned_to: "",
      completed: false
    };
    this.props.todoList.items.push(newItem);
    this.props.updateTodoItem(
      this.props.todoList,
      this.goToEditPage.bind(this),
      newItemKey
    );
  };

  goToHomePage = () => {
    this.props.history.push("/");
  };

  render() {
    console.log("State in render is: ");
    console.log(this.state);
    const auth = this.props.auth;
    const { todoList, removeTodoList } = this.props;
    const { goToHomePage } = this;
    const { name, owner } = this.state;
    const { sortByCriteria } = this.props;
    if (!auth.uid) {
      return <Redirect to="/" />;
    }

    if (!todoList) return <React.Fragment />;

    return (
      <div className="container white">
        <div className="list-header">
          <h5 className="grey-text text-darken-3">Todo List</h5>

          <Modal
            header="Delete this list?"
            trigger={
              <Button
                icon={<Icon>delete</Icon>}
                onClick={() => console.log("DO SOMETHING")}
                className="modal-button"
              />
            }
          >
            <p id="delete_confirm_text">
              Are you sure you want to delete this list?
            </p>
            <div id="yes_no_btns">
              <button
                id="yes_modal_button"
                onClick={() => removeTodoList(todoList, goToHomePage)}
              >
                Yes
              </button>
              <button id="no_modal_button" className="modal-close">
                No
              </button>
            </div>
            <p id="delete_warning">The list will not be retrievable.</p>
          </Modal>
        </div>
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
          onClick={this.createNewItem}
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
  if (todoList) todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => ({
  updateTodoList: (todoList, docID) =>
    dispatch(updateTodoList(todoList, docID)),
  sortByCriteria: (todoList, criteriaName) =>
    dispatch(sortByCriteriaHandler(todoList, criteriaName)),
  updateTodoItem: (newTodoList, cb, newItemID) =>
    dispatch(updateTodoItemHandler(newTodoList, cb, newItemID)),
  removeTodoList: (todoList, cb) =>
    dispatch(removeTodoListHandler(todoList, cb))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(ListScreen);
