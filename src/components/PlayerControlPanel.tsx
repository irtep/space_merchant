import { Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Character, GameObject } from '../interfaces/sharedInterfaces';

interface PCPprops {
    pause: boolean;
    setPause: React.Dispatch<React.SetStateAction<boolean>>;
    gameObject: GameObject;
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>;
    liveGameObject: GameObject;
};

const PlayerControlPanel: React.FC<PCPprops> = ({
    pause,
    setPause,
    gameObject,
    setGameObject,
    liveGameObject
}): React.ReactElement => {
    const [charIsSelected, setCharIsSelected] = useState<boolean>(false);
    const [indexOfSelected, setIndexOfSelected] = useState<number>(0);

    useEffect( () => {
        gameObject.characters.forEach( (c: Character, i: number) => {
            if (c.selected && !charIsSelected) {
                setCharIsSelected(true);
                setIndexOfSelected(i);
            } 
        });
    }, [gameObject]);

    return (
        <Container sx={{ color: 'white' }}>
            {
                (pause)
                    ?
                    <>
                        {
                            gameObject.characters.map((c: Character, i: number) => {
                                if (c.team === gameObject.characters[0].team) {
                                    return (
                                        <div
                                            key={`${c.id} ${i}`}
                                        >
                                            <button
                                                onClick={() => {
                                                    const oldGameObject: GameObject = {...gameObject}
                                                    // unselect all
                                                    oldGameObject.characters.forEach( (cha: Character) => {
                                                        cha.selected = false;
                                                    });
                                                    // select this
                                                    oldGameObject.characters[i].selected = true;

                                                    // update
                                                    liveGameObject = oldGameObject;
                                                    setGameObject(oldGameObject);
                                                }}
                                                style={{
                                                }}
                                            >
                                                {c.name}
                                            </button>
                                        </div>
                                    )
                                }
                            })
                        }
                    </>
                    :
                    <>
                        <Typography>
                            not paused
                        </Typography>
                        <button
                            onClick={ () => {
                                setPause(!pause);
                            }}
                        >
                            pause
                        </button>
                    </>
            }
            {
                (charIsSelected)
                ?
                <>
                    selected char {indexOfSelected}
                </>
                :
                <>
                    not selected
                </>
            }
        </Container>
    );
}

export default PlayerControlPanel;