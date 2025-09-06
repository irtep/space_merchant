import Menu from './components/Menu.tsx';
import PlayScreen from './components/PlayScreen.tsx';
import PlayScreenV2 from './components/PlayScreenV2.tsx';
import PlayScreenV3 from './components/PlayScreenV3.tsx';
import { useSMContext } from './context/smContext.tsx';

function App() {
  const { view } = useSMContext();
  return (
    <>
      <div>
        {
          (view === 'menu')
          ? <Menu/>
          : <></>
        }
        {
          (view === 'play1') 
          ? <PlayScreen/>
          : <></>
        }
        {
          (view === 'play2') 
          ? <PlayScreenV2/>
          : <></>
        }
        {
          (view === 'play3') 
          ? <PlayScreenV3/>
          : <></>
        }
        {
          (view === 'after')
          ? <>menu</>
          : <></>
        }
      </div>
    </>
  )
}

export default App
