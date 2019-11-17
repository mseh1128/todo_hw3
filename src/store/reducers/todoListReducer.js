import * as actionCreators from "../actions/actionCreators";

const initState = {
  todoList: [],
  error: ""
};

const todoListReducer = (state = initState, action) => {
  switch (action.type) {
    case actionCreators.UPDATE_TODO_LIST:
      console.log("Updated todolist successfully");
      return state;
    case actionCreators.CREATE_TODO_LIST:
      console.log("Created todolist successfully with");
      console.log(action.todoList);
      return {
        ...state,
        todoList: action.todoList
      };
    case actionCreators.CREATE_TODO_LIST_ERROR:
      console.log("Error in creating todolist");
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
};

export default todoListReducer;
