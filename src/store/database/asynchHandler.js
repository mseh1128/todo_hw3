import * as actionCreators from "../actions/actionCreators.js";
import { sortTasksHeader } from "../../utils/index";

export const createTodoListHandler = cb => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const fireStore = getFirestore();
  fireStore
    .collection("todoLists")
    .add({
      name: "",
      owner: "",
      items: [],
      lastModified: fireStore.Timestamp.now(),
      sortCriteriaName: null,
      sortCriteriaAsc: null
    })
    .then(ref => {
      cb(ref.id);
    })
    .catch(err => {
      dispatch(actionCreators.createTodoListError(err));
    });
};

export const removeTodoListHandler = (todoList, cb) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const { id } = todoList;
  const fireStore = getFirestore();
  fireStore
    .collection("todoLists")
    .doc(id)
    .delete()
    .then(() => cb())
    .catch(err => console.log(err));
};

export const removeItemHandler = (todoList, index) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  console.log("IN REMOVE ITEM HANDLER");
  console.log("TODOLIST IS: ");
  console.log(todoList);
  console.log("INDEX TO REMOVE IS: ");
  console.log(index);
  const fireStore = getFirestore();
  const docID = todoList.id;
  todoList.items.splice(index, 1);
  // const tItem = todoList.items.splice(tIndex, 1)[0];
  // todoList.items.splice(tIndex - 1, 0, tItem);
  console.log(todoList);
  fireStore
    .collection("todoLists")
    .doc(docID)
    .update({ items: todoList.items })
    .catch(err => console.log(err));
};

export const moveItemUpHandler = (todoList, index) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  if (index !== 0) {
    const fireStore = getFirestore();
    const docID = todoList.id;
    const tItem = todoList.items.splice(index, 1)[0];
    todoList.items.splice(index - 1, 0, tItem);
    fireStore
      .collection("todoLists")
      .doc(docID)
      .update({ items: todoList.items })
      .catch(err => console.log(err));
  }
};

export const moveItemDownHandler = (todoList, index) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const todoListLength = todoList.items.length;
  if (index !== todoListLength - 1) {
    const fireStore = getFirestore();
    const docID = todoList.id;
    const tItem = todoList.items.splice(index, 1)[0];
    todoList.items.splice(index + 1, 0, tItem);
    fireStore
      .collection("todoLists")
      .doc(docID)
      .update({ items: todoList.items })
      .catch(err => console.log(err));
  }
};

export const sortByCriteriaHandler = (todoList, criteriaName) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  //   if sortCriteriaName is null or different:
  // If so then set sortCriteriaName & sortCriteriaAsc to true (asc)
  console.log("CRITERIA HANDLER: IN HERE");
  const { sortCriteriaName, id } = todoList;
  const fireStore = getFirestore();

  if (!sortCriteriaName || sortCriteriaName !== criteriaName) {
    todoList.sortCriteriaName = criteriaName;
    todoList.sortCriteriaAsc = true;
    const todoListItems = todoList.items;
    console.log("todoList items before: ");
    console.log(todoListItems);
    sortTasksHeader(todoList.items, criteriaName, true);
    console.log("todoList items after: ");
    console.log(todoListItems);
    fireStore
      .collection("todoLists")
      .doc(id)
      .update(todoList)
      .catch(err => console.log(err));
  } else {
    // if same then just reverse sortCriteriaAsc
    todoList.sortCriteriaAsc = !todoList.sortCriteriaAsc;
    const todoListItems = todoList.items;
    console.log("todoList items before: ");
    console.log(todoListItems);
    sortTasksHeader(todoList.items, criteriaName, todoList.sortCriteriaAsc);
    console.log("todoList items after: ");
    console.log(todoListItems);
    fireStore
      .collection("todoLists")
      .doc(id)
      .update(todoList)
      .catch(err => console.log(err));
  }
};

export const updateTodoList = (todoList, docID) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const fireStore = getFirestore();
  console.log("UPDATING TODO LIST");
  console.log(todoList);
  console.log("DOC ID IS");
  console.log(docID);
  fireStore
    .collection("todoLists")
    .doc(docID)
    .update(todoList)
    // .then(() => (cb ? cb() : null));
    .catch(err => console.log(err));
};

export const updateTodoItemHandler = (newTodoList, cb, newItemID) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  console.log(newItemID);
  const fireStore = getFirestore();
  const docID = newTodoList.id;
  fireStore
    .collection("todoLists")
    .doc(docID)
    .update(newTodoList)
    .then(() => (cb ? (newItemID !== null ? cb(newItemID) : cb()) : null))
    .catch(err => console.log(err));
};

export const loginHandler = ({ credentials, firebase }) => (
  dispatch,
  getState
) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(credentials.email, credentials.password)
    .then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch({ type: "LOGIN_SUCCESS" });
    })
    .catch(err => {
      dispatch({ type: "LOGIN_ERROR", err });
    });
};

export const logoutHandler = firebase => (dispatch, getState) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(resp =>
      firestore
        .collection("users")
        .doc(resp.user.uid)
        .set({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          initials: `${newUser.firstName[0]}${newUser.lastName[0]}`
        })
    )
    .then(() => {
      dispatch(actionCreators.registerSuccess);
    })
    .catch(err => {
      dispatch(actionCreators.registerError);
    });
};
