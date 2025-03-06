import { Box, Container } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSMContext } from '../context/smContext';
import { draw } from '../functions/draw';
import { arenaHeight, arenaWidth } from '../measures/measures';
import { Character, GameObject } from '../interfaces/sharedInterfaces';
import { handleKeyDown, handleMouseDown } from '../functions/mouseAndKeyControls';
import { npcs } from '../data/npcs';
import { updateTeamMovements } from '../functions/updateTeamMovements';
import { drawConsole, handleMouseDownToConsole } from '../functions/drawConsole';
import InventoryDialog from './InventoryDialog';
//import PlayerControlPanel from './PlayerControlPanel';

const PlayScreen: React.FC = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const {
        gameObject,
        setGameObject,
        dialogOpen,
        setDialogOpen
        //indexOfSelected,
        //setIndexOfSelected
    } = useSMContext();
    const [message, setMessage] = useState<string>('');
    const [pause, setPause] = useState<boolean>(true);
    const pauseRef: React.RefObject<boolean> = useRef<boolean>(pause); // UseRef to store latest pause state
    let liveGameObject: GameObject = gameObject;
    //const canvas: HTMLCanvasElement | null = canvasRef.current;

    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const canvas2: HTMLCanvasElement | null = canvasRef2.current;
        console.log('go: ', gameObject);
        if (!canvas) return;
        if (!canvasRef) return;
        if (!canvas2) return;
        if (!canvasRef2) return;

        console.log('copying go to live go');
        liveGameObject = JSON.parse(JSON.stringify(gameObject));
        // generate random npc:s to the area
        // temporarily all npcs
        npcs.forEach((c: Character) => {
            console.log('adding: ', c.name);
            liveGameObject.characters.push(c);
        });
        /*
        * event listeners
        */
        console.log('handlers');
        const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, setPause, pauseRef, setMessage, liveGameObject, setGameObject);
        const mouseDownHandler = (e: MouseEvent) => {
            if (!canvasRef.current) return; // Ensure it's not null
            handleMouseDown(e, canvasRef as React.RefObject<HTMLCanvasElement>, liveGameObject, /*indexOfSelected, setIndexOfSelected, setPause, pause*/);
        };
        const mouseDownHandlerConsole = (e: MouseEvent) => {
            if (!canvasRef2.current) return;
            handleMouseDownToConsole(
                e,
                canvas2,
                liveGameObject,
                setDialogOpen,
                setPause,
                pauseRef,
                setMessage,
                setGameObject
                );
        };
        window.addEventListener('keydown', keyDownHandler);
        canvas.addEventListener('mousedown', mouseDownHandler);
        canvas2.addEventListener('mousedown', mouseDownHandlerConsole);
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const rect: DOMRect = canvas.getBoundingClientRect();
            liveGameObject.mouseNowX = e.clientX - rect.left;
            liveGameObject.mouseNowY = e.clientY - rect.top;
        });

        draw(canvas, liveGameObject);

        /* 
        *       update function
        */

        const update = (): void => {
            //console.log('update');
            //liveGameObject.updateCounter++;

            // update movements
            liveGameObject = updateTeamMovements(liveGameObject);

            // shoot

            // close combat

            draw(canvas, liveGameObject); // map
            drawConsole(canvas2, liveGameObject); // console at right side
            //console.log('lgo: ', liveGameObject);
        };

        const loop = (): void => {
            //console.log('loop');
            if (!pauseRef.current) {
                //console.log('not in pause');
                update();
            } else {
                // could try to update state variables here
                //setGameObject(liveGameObject);
                draw(canvas, liveGameObject); // map
                drawConsole(canvas2, liveGameObject); // console at right side
            }
            requestAnimationFrame(loop);
        };

        console.log('loop should start');
        loop();

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            //window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousedown', mouseDownHandler);
            canvas2.removeEventListener('mousedown', mouseDownHandlerConsole);
        };
    }, []);

    useEffect( () => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if (!canvas) return;
        draw(canvas, liveGameObject);
    }, [gameObject]);

    useEffect( () => {
        setGameObject(liveGameObject);
    }, [dialogOpen]);

    return (
        <Container maxWidth="lg">
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                p: 3,
                background: 'rgb(66, 64, 64)',
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
                        width={arenaWidth}
                        height={arenaHeight}
                        style={{
                            border: '1px solid black',
                            background: '#9A7B4D',
                            backgroundRepeat: 'no-repeat',
                            margin: 5
                        }}
                    />

                    <InventoryDialog
                       // liveGameObject={liveGameObject}
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
                    <canvas
                        ref={canvasRef2}
                        width="300"
                        height={arenaHeight}
                        style={{
                            border: '1px solid black',
                            background: '#9A7B4D',
                            backgroundRepeat: 'no-repeat',
                            margin: 1
                        }}
                    />
                </Box>
            </Box>
        </Container>
    );
}

export default PlayScreen;
