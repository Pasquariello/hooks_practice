import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [ searchValue, setSearchValue ] = useState('');
  const inputRef = useRef();


  useEffect(()=>{
    const timer = setTimeout(() => {
      // at this point due to closures searchValue is locked in / scoped to setTimeout
      if (searchValue === inputRef.current.value){
        const query = searchValue.length === 0 ? '' : `?orderBy="title"&equalTo="${searchValue}"`
        fetch('https://react-hooks-update-93a89.firebaseio.com/ingredients.json' + query).then(
          response => response.json()
        ).then(responseData => {
          const loadedIngredients = [];
          for(const key in responseData){
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount 
        
            });
          }
          onLoadIngredients(loadedIngredients);
        });
      }
    }, 500);
    return () => {
      // clear the timer so we dont have a ton of random timers all running 
      // this will ensure we have only one timer running
      // more memory efficient
      clearTimeout(timer);
    }
  }, [searchValue, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            type="text" 
            ref = {inputRef}
            value={searchValue} 
            onChange={event => setSearchValue(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
