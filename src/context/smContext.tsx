import { createContext, useState, ReactNode, FC, ReactElement, useContext } from 'react';
import { GameObject } from '../interfaces/sharedInterfaces';
//import { weapons } from '../data/weapons';
import { jyvaskylaTown } from '../data/maps';

interface SMContextType {
    view: 'menu' | 'play' | 'after';
    setView: React.Dispatch<React.SetStateAction<'menu' | 'play' | 'after'>>;
    gameObject: GameObject;
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>;
    charIsSelected: boolean;
    setCharIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
    indexOfSelected: number;
    setIndexOfSelected: React.Dispatch<React.SetStateAction<number>>;
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SMContext = createContext<SMContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
};

export const SMProvider: FC<Props> = ({ children }): ReactElement => {
    const [view, setView] = useState<'menu' | 'play' | 'after'>('menu');
    const [gameObject, setGameObject] = useState<GameObject>({
        characters: [],
        mouseNowX: 0,
        mouseNowY: 0,
        gameMap: jyvaskylaTown,
        clickedCharacterIndex: 0,
        updateCounter: 0
    });
    const [charIsSelected, setCharIsSelected] = useState<boolean>(false);
    const [indexOfSelected, setIndexOfSelected] = useState<number>(0);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <SMContext.Provider value={{
            view, setView,
            gameObject, setGameObject,
            charIsSelected, setCharIsSelected,
            indexOfSelected, setIndexOfSelected,
            dialogOpen, setDialogOpen
        }}>
            {children}
        </SMContext.Provider>
    );
};

export const useSMContext = (): SMContextType => {
    const context = useContext(SMContext);

    if (!context) {
        throw new Error('useSMContext must be used within a SMProvider');
    }

    return context;
};
