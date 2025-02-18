import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSMContext } from '../context/smContext';

const PlayScreen: React.FC = (): React.ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        gameObject
    } = useSMContext();

    useEffect( () => {
        console.log('go: ', gameObject);
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
