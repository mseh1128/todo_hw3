import React, { Component } from "react";
import { updateTodoList } from "../../store/database/asynchHandler";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ItemsList from "./ItemsList.js";
import { firestoreConnect } from "react-redux-firebase";
import { Icon, Button } from "react-materialize";
import { sortByCriteriaHandler } from "../../store/database/asynchHandler";
import { Checkbox } from "react-materialize";

class EditItem extends Component {
  handleChange = e => {
    // const { target } = e;
    // const { id } = this.props.todoList;
    // const { sortByCriteria } = this.props;
    // this.setState(
    //   {
    //     [target.id]: target.value
    //   },
    //   () => this.props.updateTodoList(this.state, id)
    // );
  };

  render() {
    const auth = this.props.auth;
    const { item } = this.props;

    if (!auth.uid) {
      return <Redirect to="/" />;
    }
    // console.log(item);
    // const { todoList } = this.props;
    // const { name, owner } = this.state;
    // const { sortByCriteria } = this.props;
    return (
      <div id="edit_item_container">
        <div id="item_heading">Item</div>
        <div id="item_form_container">
          <div
            className="item_form_values_container"
            id="item_description_container"
          >
            <p className="item_prompts" id="item_description_prompt">
              Description:
            </p>
            <div className="item_field_container">
              <input
                type="text"
                id="item_description_textfield"
                name="description"
                value={item.description}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="item_form_values_container"
            id="item_assigned_to_container"
          >
            <p className="item_prompts" id="item_assigned_to_prompt">
              Assigned to:
            </p>
            <div className="item_field_container">
              <input
                type="text"
                id="item_assigned_to_textfield"
                name="assigned_to"
                value={item.assigned_to}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="item_form_values_container"
            id="item_due_date_container"
          >
            <p className="item_prompts" id="item_due_date_prompt">
              Due Date:
            </p>
            <div className="item_field_container">
              <input
                type="date"
                id="item_due_date_picker"
                name="due_date"
                value={item.due_date}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="item_form_values_container"
            id="item_completed_container"
          >
            <p className="item_prompts" id="item_completed_prompt">
              Completed:
            </p>
            <div id="checkbox_field_container" className="item_field_container">
              {item.completed ? (
                <Checkbox value="completed" checked />
              ) : (
                <Checkbox value="completed" />
              )}
            </div>
          </div>
          <div id="item_completed_container">
            <input
              type="submit"
              id="item_form_submit_button"
              value="Submit"
              name="submit"
              onClick={() => console.log("submit button was clicked!")}
            />
            <input
              type="submit"
              id="item_form_cancel_button"
              value="Cancel"
              name="cancel"
              onClick={() => console.log("cancel button was clicked!")}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { itemId } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  let item;
  if (todoList) {
    todoList.id = id;
    // need to find it in the todoList
    // console.log(todoList.items.filter(item => item.id !== ));
    item = todoList.items.filter(item => item.id === parseInt(itemId))[0];
    // item = item[0];
  }
  return {
    todoList,
    item,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(EditItem);
