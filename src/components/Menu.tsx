import React, { useState } from 'react';
import Footer from './Footer';
import { Button, Container } from '@mui/material';
import { spaceButton } from '../styles/styles';
import CreateCharacter from './CreateCharacter';

const Menu: React.FC = (): React.ReactElement => {
    const [menuState, setMenuState] = useState<'start' | 'create'>('start');

    return (
        <Container>

            <Container
                style={{
                    textAlign: 'center',
                    color: 'black',
                    backgroundImage: "linear-gradient(to right, black, black, rgb(236, 230, 57), black, black",
                }}
            >
                <h1>
                    Space Merchant
                </h1>
            </Container>

            <Container>
            {
                (menuState === 'start')
                ?
                <>
                <Button
                    sx={spaceButton}
                    onClick={ () => {
                        setMenuState('create');
                    }}
                    >
                    new game
                </Button>
                <br/>
                <Button
                    sx={spaceButton}>
                    load game
                </Button>
                </>
                :
                <CreateCharacter/>
            }
            </Container>
            
            <Container>
                <Footer />
            </Container>

        </Container>
    );
}

export default Menu;