import Menu from './components/Menu.tsx';
import PlayScreenV2 from './components/PlayScreenV2.tsx';
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
          (view === 'play') 
          ? <PlayScreenV2/>
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
