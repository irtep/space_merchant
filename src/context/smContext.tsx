import { createContext, useState, ReactNode, FC, ReactElement, useContext } from 'react';
import { Character, GameObject } from '../sharedInterfaces/sharedInterfaces';


interface SMContextType {
    view: 'menu' | 'play' | 'after';
    setView: React.Dispatch<React.SetStateAction<'menu' | 'play' | 'after'>>;
    gameObject: GameObject;
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>;
};

export const SMContext = createContext<SMContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
};

export const SMProvider: FC<Props> = ({ children }): ReactElement => {
    const [view, setView] = useState<'menu' | 'play' | 'after'>('menu');
    const [gameObject, setGameObject] = useState<GameObject>({
        playerCharacter: new Character({
            title: '',
            name: '',
            race: '',
            profession: '', 
            ship: '',
            stats: {
                strength: 10,
                dexterity: 8,
                toughness: 12,
                magic: 5,
                abilities: [],
                skills: []
            },
            location: { x: 0, y: 0 },
            world: 'Earth',
            zone: 'Sector 1',
            hitPoints: 100,
            maxHitPoints: 100,
            magicPoints: 50,
            endurancePoints: 50,
        })
    });

    return (
        <SMContext.Provider value={{ 
            view, setView,
            gameObject, setGameObject 
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
