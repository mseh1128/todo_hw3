import React from "react";
import { Link } from "react-router-dom";
import { Icon, Button } from "react-materialize";

class ItemCard extends React.Component {
  render() {
    const {
      assigned_to,
      description,
      completed,
      due_date,
      id
    } = this.props.item;
    const {
      todoList,
      removeItems,
      moveItemUp,
      moveItemDown,
      firstItem,
      lastItem,
      indexPos
    } = this.props;
    const upButtonClass = firstItem ? "grey" : "blue";
    const downButtonClass = lastItem ? "grey" : "green";

    // assigned_to = "Joe"
    // completed = true
    // description = "CSE 114"
    // due_date = "2018-12-31" (String)
    const completedDiv = completed ? (
      <div className="list_item_card_completed">Completed</div>
    ) : (
      <div className="list_item_card_pending ">Pending</div>
    );
    return (
      <div className="new_item_div_container">
        <Link
          to={"/todoList/" + todoList.id + "/" + id}
          key={todoList.id}
          className="list_item_card"
        >
          <div className="list_item_card_description">
            {description ? description : "Unknown"}
          </div>
          <div class="list_item_card_assigned_to">
            Assigned To:{" "}
            <strong>{assigned_to ? assigned_to : "Unknown"}</strong>
          </div>
          <div className="list_item_card_due_date">
            {due_date ? due_date : "Unknown"}
          </div>
          {completedDiv}
        </Link>
        <div className="list_item_btn_container">
          <Button floating fab={{ direction: "left" }} className="red" large>
            <Button
              floating
              icon={<Icon>arrow_upward</Icon>}
              onClick={() => moveItemUp(todoList, indexPos)}
              className={upButtonClass}
            />
            <Button
              floating
              icon={<Icon>arrow_downward</Icon>}
              onClick={() => moveItemDown(todoList, indexPos)}
              className={downButtonClass}
            />
            <Button
              floating
              icon={<Icon>delete</Icon>}
              onClick={() => removeItems(todoList, indexPos)}
              className="red"
            />
          </Button>
        </div>
      </div>
    );
  }
}
export default ItemCard;
