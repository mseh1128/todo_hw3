import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { updateTodoItemHandler } from "../../store/database/asynchHandler";
import { Checkbox } from "react-materialize";

class EditItem extends Component {
  state = {
    description: this.props.item.description,
    assigned_to: this.props.item.assigned_to,
    due_date: this.props.item.due_date,
    completed: this.props.item.completed
  };

  initialTodoList = this.props.todoList;

  handleChange = e => {
    const { target } = e;
    const name = target.type === "checkbox" ? target.value : target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    let { todoList, item } = this.props;
    console.log("The value is: ");
    console.log(value);
    console.log(typeof value);
    console.log(name);
    item[name] = value;
    this.setState(
      {
        [name]: value
      },
      () => this.props.updateTodoItem(todoList)
    );
  };

  goBackToTodolist = () => {
    const { id } = this.props.todoList;
    this.props.history.push("/todoList/" + id);
  };

  removeDatabaseChanges = () => {
    this.props.updateTodoItem(
      this.initialTodoList,
      this.goBackToTodolist.bind(this)
    );
    // console.log("REACHED HERE");
    // const { id } = this.props.todoList;
    // this.props.history.push("/todoList/" + id);
    // return <Redirect to={"/todoList/" + id} />;
  };

  render() {
    const auth = this.props.auth;
    // const { item } = this.props;
    const { description, assigned_to, due_date, completed } = this.state;
    const { id } = this.props.todoList;

    if (!auth.uid) {
      return <Redirect to="/" />;
    }
    // console.log(item);
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
                value={description}
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
                value={assigned_to}
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
                value={due_date}
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
            <div
              name="completed"
              id="checkbox_field_container"
              className="item_field_container"
            >
              {completed ? (
                <Checkbox
                  value="completed"
                  onChange={this.handleChange}
                  checked
                />
              ) : (
                <Checkbox value="completed" onChange={this.handleChange} />
              )}
            </div>
          </div>
          <div id="item_completed_container">
            <Link to={"/todoList/" + id}>
              <input
                type="submit"
                id="item_form_submit_button"
                value="Submit"
                name="Submit"
              />
            </Link>
            <input
              type="submit"
              id="item_form_cancel_button"
              value="Cancel"
              name="cancel"
              onClick={() => this.removeDatabaseChanges()}
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

const mapDispatchToProps = dispatch => ({
  updateTodoItem: (newTodoList, cb) =>
    dispatch(updateTodoItemHandler(newTodoList, cb))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: "todoLists", orderBy: ["lastModified", "desc"] }
  ])
)(EditItem);
