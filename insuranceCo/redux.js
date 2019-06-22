console.clear();

const { createStore, combineReducers } = Redux;



//people dropping off forms (actions creators)   , the three functions below
const createClaim = (name, amountOfMoneyToCollect) => {
  return {
    //this object is the form
    type: "CREATE_CLAIM",
    payload: {
      name: name,
      amountOfMoneyToCollect: amountOfMoneyToCollect
    }
  };
};
//cost 20 dollar to make a policy
const createPolicy = name => {
  return {
    type: "CREATE_POLICY",
    payload: {
      name: name,
      amount: 20
    }
  };
};
const deletePolicy = name => {
  return {
    type: "DELETE_POLICY",
    payload: {
      name: name
    }
  };
};



//Departments (reducers)  , functions that take in a form, look at the form, and operate on the data in some way
//claims history dept. default old list to empty array
const claimsHistory = (oldListOfClaims = [], action) => {
  if (action.type === "CREATE_CLAIM") {
    //redux compares old data with returned data to check for changes
    //use ... to create a new instance of the old data array and add to the array the action.payload new data
    return [...oldListOfClaims, action.payload];
  }
  //return old data if no new claim
  return oldListOfClaims;
};

//reducer for accounting dept, default money to 100
const accounting = (bagOfMoney = 100, action) => {
  if (action.type === "CREATE_CLAIM") {
    //if you make an insurance claim subract from insurance companys money the money for the claim
    return bagOfMoney - action.payload.amountOfMoneyToCollect;
  } else if (action.type === "CREATE_POLICY") {
    //when making a policy add the 20 to insur comps money
    return bagOfMoney + action.payload.amount;
  }
  //if no claim return money
  return bagOfMoney;
};

//policy dept reducer, default list to empty array
const policies = (listOfPolicies = [], action) => {
  if (action.type === "CREATE_POLICY") {
    //add new policy to the new instance of the old policy list array
    return [...listOfPolicies, action.payload.name];
  } else if (action.type === "DELETE_POLICY") {
    //if the policy does not equal the payload to delete policy, then keep it and return it in array
    return listOfPolicies.filter(policy => policy != action.payload.name);
  }
  //if not delete or add policy return old list
  return listOfPolicies;
};



//company setup, combine reducers is function from redux used to setup initial thought of grouping departments
const ourDepartments = combineReducers({
  accounting: accounting,
  claimsHistory: claimsHistory,
  policies: policies
});

//setup store (entire combined insurance co) with departments
const store = createStore(ourDepartments);


//testing

//dispatch takes form and sends it to all reducers in store, all data returned is then collected
store.dispatch(createPolicy("Alex"));
// log the data being return from the store
console.log(store.getState());
// returns this ==>   {accounting: 120, claimsHistory: [], policies: ["Alex"]}

store.dispatch(createClaim("Alex", 100));
console.log(store.getState());
// returns this ==>   {accounting: 20, claimsHistory: [{name: "Alex", amountOfMoneyToCollect: 100}], policies: ["Alex"]}

store.dispatch(deletePolicy("Alex"));
console.log(store.getState());
// returns this ==>   {accounting: 20, claimsHistory: [{name: "Alex", amountOfMoneyToCollect: 100}], policies: []}
