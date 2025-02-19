import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSMContext } from '../context/smContext';
import { draw } from '../functions/draw';
import { arenaHeight, arenaWidth } from '../measures/measures';
import { GameObject } from '../interfaces/sharedInterfaces';
import { handleKeyDown, handleMouseDown } from '../functions/gameControls';

const PlayScreen: React.FC = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        gameObject
    } = useSMContext();
    const [message, setMessage] = useState<string>('');
    const [pause, setPause] = useState<boolean>(true);
    const pauseRef: React.MutableRefObject<boolean> = useRef<boolean>(pause); // UseRef to store latest pause state


    useEffect( () => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        console.log('go: ', gameObject);
        console.log('canvas: ', canvas);
        if (!canvas) return;
        if (!canvasRef) return;

        canvas.width = arenaWidth;  
        canvas.height = arenaHeight;    
        
        // generate random npc:s to the area

        // create copy, that will be updated in game loop
        let liveGameObject: GameObject = JSON.parse(JSON.stringify(gameObject));

        /*
        * event listeners
        */ 
        console.log('handlers');
        const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, setPause, pauseRef, setMessage);
        const mouseDownHandler = (e: MouseEvent) => handleMouseDown(e, canvasRef, liveGameObject);

        window.addEventListener('keydown', keyDownHandler); 
        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const rect: DOMRect = canvas.getBoundingClientRect();
            liveGameObject.mouseNowX = e.clientX - rect.left;
            liveGameObject.mouseNowY = e.clientY - rect.top;
        });

        /* 
        *       update function
        */

        const update = (): void => {
            console.log('update');
            //liveGameObject.updateCounter++;

            // update movements
            //liveGameObject = updateTeamMovements(liveGameObject);
            
            // shoot

            // close combat

            // update bullets
            draw(canvas, liveGameObject);

        };

        const loop = (): void => {
            //console.log('loop');
            if (!pauseRef.current) {
                console.log('not in pause');
                update();
            }
            requestAnimationFrame(loop);
        };

        console.log('loop should start');
        loop();

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            //window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousedown', mouseDownHandler);
        };

    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                p: 3,
                background: 'black',
                color: 'red',
                height: '100vh', // Ensure full height
            }}>

                {/* Left Column: Canvas (80%) */}
                <Box
                    sx={{
                        flex: 4, // 80% width
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {message}

                    <canvas
                        ref={canvasRef}
                        style={{
                            width: '700px',
                            height: '550px',
                            border: '1px solid black',
                            background: '#9A7B4D',
                            backgroundRepeat: 'no-repeat',
                            margin: 5
                        }}
                    />
                </Box>

                {/* Right Column: Texts (20%) */}
                <Box
                    sx={{
                        flex: 1, // 20% width
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography sx={{ color: 'white' }}>
                        Kaupunki
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default PlayScreen;
