import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import TodoListLinks from "./TodoListLinks";

import { createTodoListHandler } from "../../store/database/asynchHandler";

class HomeScreen extends Component {
  handleNewList = () => {
    this.props.createNewList(this.goToListScreen);
    // console.log(`The todolist id is ${todolistID}`);
    // create a new todo list
    // create new todolist, get its id & then do Link w/ its id
  };

  goToListScreen = todoListID => {
    this.props.history.push("/todoList/" + todoListID);
  };

  render() {
    if (!this.props.auth.uid) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m4">
            <TodoListLinks />
          </div>

          <div className="col s8">
            <div className="banner">
              @todo
              <br />
              List Maker
            </div>

            <div className="home_new_list_container">
              <button
                className="home_new_list_button"
                onClick={this.handleNewList}
              >
                Create a New To Do List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log("Home screen state is: ");
  console.log(state);
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => ({
  createNewList: cb => dispatch(createTodoListHandler(cb))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(HomeScreen);
