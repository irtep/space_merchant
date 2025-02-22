import { Container } from '@mui/material';
import React from 'react';
import { useSMContext } from '../context/smContext';
import { Character, GameObject } from '../interfaces/sharedInterfaces';

const CharacterOptions: React.FC<{ liveGameObject: GameObject }> = ({ liveGameObject }): React.ReactElement => {
    const {
        gameObject,
        setGameObject,
        indexOfSelected
    } = useSMContext();

    return (
        <Container sx={{
            margin: 1
        }}>
            <button
                onClick={ () => {
                    const oldGameObject: GameObject = {
                        ...gameObject,
                        characters: gameObject.characters.map((c: Character, i: number) => {
                            if (i === indexOfSelected) {
                                console.log('setting move to: ', c.name);
                                return { ...c, action: 'move' }
                            } else {
                                console.log('not setting move to: ', c.name);
                                return c;
                            }}
                        )};
                    liveGameObject = oldGameObject;
                    setGameObject(oldGameObject);
                }}
            >
                Move
            </button>
            <br />
            <button>
                Attack
            </button>
            <br />
            <button>
                Talk
            </button>
            <br />
            <button>
                Trade
            </button>
        </Container >
    );
}

export default CharacterOptions;