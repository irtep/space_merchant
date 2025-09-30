import Menu from './components/Menu.tsx';
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
