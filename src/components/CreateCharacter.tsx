import { Container, MenuItem, Select, FormControl, Button, Box, Typography, SelectChangeEvent } from '@mui/material';
import { useSMContext } from '../context/smContext.tsx';
import React, { useEffect } from 'react';
import { races } from '../data/races.ts';
import { Race } from '../sharedInterfaces/sharedInterfaces.tsx';
import { professions } from '../data/professions.ts';

const CreateCharacter: React.FC = (): React.ReactElement => {
    const { gameObject, setGameObject } = useSMContext();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameObject({
            ...gameObject,
            playerCharacter: {
                ...gameObject.playerCharacter,
                [event.target.name]: event.target.value
            }
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setGameObject({
            ...gameObject,
            playerCharacter: {
                ...gameObject.playerCharacter,
                [event.target.name]: event.target.value
            }
        });
    };

    useEffect(() => {
        console.log('go: ', gameObject);
    }, [gameObject]);

    return (
        <Container maxWidth="sm">

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                p: 3,
                background: 'black',
                color: 'red'
            }}>

                {/* Left Column: Form */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2} mt={4}>

                        <Typography variant="h5" color="primary">Create Your Character</Typography>

                        {/* Name Input */}
                        <Typography>
                            What is your name:
                        </Typography>
                        <input
                            id="selectName"
                            name="name"
                            type="text"
                            value={gameObject.playerCharacter.name}
                            onChange={handleInputChange}
                            style={{
                                backgroundColor: 'black',
                                color: 'white'
                            }}
                        />

                        <Typography>
                            Name your crew:
                        </Typography>
                        <input
                            id="selectName"
                            name="crew"
                            type="text"
                            value={gameObject.playerCharacter.crew}
                            onChange={handleInputChange}
                            style={{
                                backgroundColor: 'black',
                                color: 'white'
                            }}
                        />

                        <FormControl fullWidth>
                            <Typography>
                                Select race of your character
                            </Typography>
                            <Select
                                id="selectRace"
                                name="race"
                                value={gameObject.playerCharacter.race}
                                onChange={handleSelectChange}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }}
                            >
                                <MenuItem value="" disabled>Select an option</MenuItem>
                                {races.map((option: Race) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography>
                                Select your profession
                            </Typography>
                            <Select
                                id="selectProfession"
                                name="profession"
                                value={gameObject.playerCharacter.profession}
                                onChange={handleSelectChange}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }}
                            >
                                <MenuItem value="" disabled>Select an option</MenuItem>
                                {professions.map((option: Race) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        {/* Start Button */}
                        {gameObject.playerCharacter.name && gameObject.playerCharacter.race && gameObject.playerCharacter.profession ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => console.log('clicked to preBattle')}
                            >
                                Start the Adventure
                            </Button>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                Create your character to play.
                            </Typography>
                        )}

                    </Box>
                </Box>

                {/* Right Column: Desc of selected stuff */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gridTemplateRows: '1fr',
                        gap: 2,
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2} mt={4}>
                        {
                            (gameObject.playerCharacter.name !== '')
                                ?
                                <Typography>
                                    {`Greetings master ${gameObject.playerCharacter.name}`}
                                </Typography>
                                : <></>
                        }
                        {
                            (gameObject.playerCharacter.race !== '')
                                ?
                                <Typography>
                                    {`${gameObject.playerCharacter.race} is an excellent choice.`}
                                </Typography>
                                : <></>
                        }
                        {
                            (gameObject.playerCharacter.profession !== '')
                                ?
                                <Typography>
                                    {`${gameObject.playerCharacter.profession} is an intresting choice.`}
                                </Typography>
                                : <></>
                        }
                    </Box>
                </Box>
            </Box>


        </Container>
    );
}

export default CreateCharacter;
