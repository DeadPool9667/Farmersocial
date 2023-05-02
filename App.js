import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import GlobalStyles from './GlobalStyles';
import SignedInStack from './navigation';

import { store, persistor } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SignedInStack />
      </PersistGate>
    </Provider>
  );
}

