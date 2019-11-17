import React, { Component } from "react";
import { updateTodoList } from "../../store/database/asynchHandler";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ItemsList from "./ItemsList.js";
import { firestoreConnect } from "react-redux-firebase";

class ListScreen extends Component {
  state = {
    name: this.props.todoList.name,
    owner: this.props.todoList.owner
  };

  handleChange = e => {
    const { target } = e;
    const { id } = this.props.todoList;
    this.setState(state => ({
      ...state,
      [target.id]: target.value
    }));
    console.log("NEW STATE: ");
    console.log(this.state);
    this.props.updateTodoList(this.state, id);
  };

  render() {
    const auth = this.props.auth;
    const { todoList } = this.props;
    const { name, owner } = this.state;
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
        <ItemsList todoList={todoList} />
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

const mapDispatchToProps = dispatch => {
  return {
    updateTodoList: (todoList, docID) =>
      dispatch(updateTodoList(todoList, docID))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(ListScreen);
