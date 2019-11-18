import React from "react";
import { Icon, Button } from "react-materialize";

class ItemCard extends React.Component {
  render() {
    const {
      assigned_to,
      description,
      completed,
      due_date,
      id,
      key
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
    const completedDiv = completed ? <div>Completed</div> : <div>Pending</div>;
    return (
      <div className="new_item_div_container">
        <div className="list_item_card">
          <div className="list_item_card_description">{description}</div>
          <div class="list_item_card_assigned_to">
            Assigned To: <strong>{assigned_to}</strong>
          </div>
          <div className="list_item_card_due_date">{due_date}</div>
          <div className="list_item_card_completed">{completedDiv}</div>
        </div>
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
