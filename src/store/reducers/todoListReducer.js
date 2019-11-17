import * as actionCreators from "../actions/actionCreators";

const initState = {
  todoList: []
};

const todoListReducer = (state = initState, action) => {
  switch (action.type) {
    case actionCreators.CREATE_TODO_LIST:
      return {
        ...state,
        todoList: action.todoList
      };
    // case actionCreators.CREATE_TODO_LIST:
    //   return {
    //     ...state,
    //     todoList: action.todoList
    //   };
    // case actionCreators.CREATE_TODO_LIST_ERROR:
    //   return {
    //     ...state,
    //     todoList: todoLists
    //   };
    /* IF YOU HAVE ANY TODO LIST EDITING REDUCERS ADD THEM HERE */

    default:
      return state;
  }
};

export default todoListReducer;
