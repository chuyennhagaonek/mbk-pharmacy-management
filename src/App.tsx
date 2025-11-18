import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { GlobalContextProvider } from './context/GlobalContextProvider';
import { Toaster } from './components/atoms/toaster';
import Router from './Router';

function App() {
  return (
    <Provider store={store}>
      <GlobalContextProvider>
        <Router />
        <Toaster />
      </GlobalContextProvider>
    </Provider>
  );
}

export default App;
