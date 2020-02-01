import React, { useReducer, useMemo, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';

import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get here!')
  }
}

const httpReducer = (currentHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...currentHttpState, loading: false}; // so we dont lose state spread
    case 'ERROR':
      return {loading: false, error: action.errorData};
    case 'CLEAR': 
      return {...currentHttpState, error: null}; // so we dont lose state spread

    default:
      throw new Error('should not get here!')
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp ] = useReducer(httpReducer, {loading: false, error: null});

  // const  [userIngredients, setUserIngredients] =  useState([])
  // const  [isLoading, setIsLoading] =  useState(false);
  // const  [error, setError] =  useState();

  
  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);


  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-update-93a89.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});
      return response.json(); // converts from json to a normal js obj this returns a promise
    }).then( responseData => { // because above returns a promise use .then again
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients, {id:responseData.name , ...ingredient}  //.name is just a firebase thing
      // ]);
      dispatch({type: 'ADD', ingredient: {id:responseData.name , ...ingredient}});

    });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-update-93a89.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});

      // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id))
      dispatch({type: 'DELETE', id: id});

    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorData: 'Something Went Wrong!'});
    } )
  }, []);


  const clearError = useCallback(() => {
    dispatchHttp({type: 'CLEAR'});
  }, []);

  const ingredientList = useMemo(()=>{
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler]);


  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {/* Need to add list here! */}
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
