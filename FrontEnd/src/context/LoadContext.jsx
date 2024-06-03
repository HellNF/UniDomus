import React, {createContext, useState, useContext} from 'react';

const LoadContext = createContext();

export const LoadProvider = ({children}) => {
    const [load,setLoad] = useState(false);

    return (
        <LoadContext.Provider value={{ load, setLoad}}>
            {children}
        </LoadContext.Provider>
    );
};


export const useLoadContext = () => useContext(LoadContext);