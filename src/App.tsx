import Menu from './components/Menu.tsx';
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
          ? <>menu</>
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
