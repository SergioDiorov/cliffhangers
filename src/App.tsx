import { HashRouter, Routes, Route } from 'react-router-dom';

import GameScreen from './components/GameScreen/GameScreen';
import ProdutScreen from './components/ProductScreen/ProdutScreen';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<GameScreen />} />
        <Route path='/products' element={<ProdutScreen />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
