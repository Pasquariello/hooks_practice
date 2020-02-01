
import { useReducer, useCallback } from 'react';



const httpReducer = (currentHttpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null};
      case 'RESPONSE':
        return {...currentHttpState, loading: false, data: action.responseData}; // so we dont lose state spread
      case 'ERROR':
        return {loading: false, error: action.errorData};
      case 'CLEAR': 
        return {...currentHttpState, error: null}; // so we dont lose state spread
  
      default:
        throw new Error('should not get here!')
    }
  }
  

const useHttpHook = () => {
    const [httpState, dispatchHttp ] = useReducer(httpReducer, {loading: false, error: null, data: null});

    const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({type: 'SEND'});

    fetch(url, {
        method: method,
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.json();
      }).then( responseData => {
        dispatchHttp({type: 'RESPONSE', responseData: responseData});
      }).catch(error => {
        dispatchHttp({type: 'ERROR', errorData: 'Something Went Wrong!'});
      });
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest
    };
};

export default useHttpHook;