import React, { useReducer, useMemo, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';

import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttpHook from '../../hooks/useHttpHook';

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


const Ingredients = () => {
  const [userIngredients, dispatch ] = useReducer(ingredientReducer, []);

  const {
    isLoading,
    error, 
    data, 
    sendRequest
  } = useHttpHook();


  
  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);


  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-update-93a89.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'});
    //   return response.json(); // converts from json to a normal js obj this returns a promise
    // }).then( responseData => { // because above returns a promise use .then again
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients, {id:responseData.name , ...ingredient}  //.name is just a firebase thing
    //   // ]);
    //   dispatch({type: 'ADD', ingredient: {id:responseData.name , ...ingredient}});

    // });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    // dispatchHttp({type: 'SEND'});
    sendRequest(`https://react-hooks-update-93a89.firebaseio.com/ingredients/${id}.json`, 'DELETE')
  
  }, [sendRequest]);


  const clearError = useCallback(() => {
    // dispatchHttp({type: 'CLEAR'});
  }, []);

  const ingredientList = useMemo(()=>{
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler]);


  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {/* Need to add list here! */}
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
