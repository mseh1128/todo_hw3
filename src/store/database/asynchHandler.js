import * as actionCreators from "../actions/actionCreators.js";

export const createTodoListHandler = () => (
  dispatch,
  getState,
  { getFirestore }
) => {
  const fireStore = getFirestore();
  fireStore
    .collection("todoLists")
    .add({
      name: "Unknown",
      owner: "Unknown",
      items: [],
      lastModified: fireStore.Timestamp.fromDate(new Date())
    })
    .then(ref => {
      dispatch(actionCreators.createTodoList(ref));
    })
    .catch(err => {
      dispatch(actionCreators.createTodoListError(err));
    });
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
