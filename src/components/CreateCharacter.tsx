import { Container, MenuItem, Select, FormControl, Button, Box, Typography, SelectChangeEvent } from '@mui/material';
import { useSMContext } from '../context/smContext.tsx';
import React, { useEffect, useState } from 'react';
import { races } from '../data/races.ts';
import { Character, Profession, Race } from '../interfaces/sharedInterfaces.tsx';
import { professions } from '../data/professions.ts';

const CreateCharacter: React.FC = (): React.ReactElement => {
    const [initialCharacter, setInitialCharacter] = useState<Character>({
        id: 'p0',
        title: '',
        name: '',
        race: '',
        profession: '',
        team: '',
        stats: {
            strength: 10,
            dexterity: 8,
            toughness: 12,
            perception: 5,
            size: 10,
            magic: 5,
            abilities: [],
            skills: []
        },
        location: { x: 50, y: 50 },
        world: 'Earth',
        zone: 'Sector 1',
        hitPoints: 100,
        maxHitPoints: 100,
        magicPoints: 50,
        endurancePoints: 50,
        armours: {
            head: '',
            upperBody: '',
            hands: '',
            legs: '',
            feet: ''
        },
        weapons: {
            leftHand: '',
            rightHand: ''
        },
        npc: false,
        aggressive: false,
        status: [],
        active: true,
        enemies: [],
        friends: [],
        canTalk: true,
        action: 'wait',
        actionTarget: '',
        targetLocation: {x: 0, y: 0},
        inventory: [],
        isPlayer: true,
        selected: false
    });
    const {
        gameObject, setGameObject,
        setView
    } = useSMContext();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInitialCharacter({
            ...initialCharacter, // Spread current character properties
            [event.target.name]: event.target.value // Update the changed property
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setInitialCharacter({
            ...initialCharacter, // Keep existing properties
            [event.target.name]: event.target.value // Update changed field
        });
    };

    useEffect(() => {

    }, []);

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
                            value={initialCharacter.name}
                            onChange={handleInputChange}
                            style={{
                                backgroundColor: 'black',
                                color: 'white'
                            }}
                        />

                        <Typography>
                            Name your team:
                        </Typography>
                        <input
                            id="selectName"
                            name="team"
                            type="text"
                            value={initialCharacter.team}
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
                                value={initialCharacter.race}
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
                                value={initialCharacter.profession}
                                onChange={handleSelectChange}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }}
                            >
                                <MenuItem value="" disabled>Select an option</MenuItem>
                                {professions.map((option: Profession) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        {/* Start Button */}
                        {initialCharacter.name && initialCharacter.race && initialCharacter.profession ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    console.log('clicked to preBattle');
                                    setGameObject({
                                        ...gameObject,
                                        characters:[initialCharacter]
                                    });
                                    setView('play');
                                }}
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
                            (initialCharacter.name !== '')
                                ?
                                <Typography>
                                    {`Greetings master ${initialCharacter.name}`}
                                </Typography>
                                : <></>
                        }
                        {
                            (initialCharacter.race !== '')
                                ?
                                <Typography>
                                    {`${initialCharacter.race} is an excellent choice.`}
                                </Typography>
                                : <></>
                        }
                        {
                            (initialCharacter.profession !== '')
                                ?
                                <Typography>
                                    {`${initialCharacter.profession} is an intresting choice.`}
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
