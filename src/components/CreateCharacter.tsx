import { Container, MenuItem, Select, FormControl, Button, Box, Typography, SelectChangeEvent } from '@mui/material';
import { useSMContext } from '../context/smContext.tsx';
import React, { useEffect, useState } from 'react';
import { races } from '../data/races.ts';
import { Ability, Character, Profession, Race, Skill, Stats } from '../interfaces/sharedInterfaces.tsx';
import { professions } from '../data/professions.ts';
import { npcs } from '../data/npcs.ts';

const CreateCharacter: React.FC = (): React.ReactElement => {
    const [initialCharacter, setInitialCharacter] = useState<Character>({
        id: '0',
        title: '',
        name: '',
        race: '',
        profession: '',
        team: '',
        stats: {
            strength: 0,
            dexterity: 0,
            toughness: 0,
            perception: 0,
            size: 0,
            magic: 0,
            learning: 0,
            physicalResistance: 0,
            magicResistance: 0,
            fireResistance: 0,
            poisonResistance: 0,
            coldResistance: 0,
            psionicResistance: 0
        },
        location: { x: 2, y: 2 },
        world: 'Earth',
        zone: 'Sector 1',
        hitPoints: 100,
        maxHitPoints: 100,
        magicPoints: 50,
        maxMagicPoints: 50,
        endurancePoints: 50,
        maxEndurancePoints: 50,
        equipment: {},
        npc: false,
        aggressive: false,
        status: [],
        active: true,
        enemies: [],
        friends: [],
        canTalk: true,
        action: 'wait',
        actionTarget: null,
        targetLocation: { x: 0, y: 0 },
        inventory: [],
        isPlayer: true,
        selected: false,
        abilities: [],
        skills: [],
        path: []
    });
    const {
        gameObject, setGameObject,
        setView
    } = useSMContext();


    const mergeSkills = (raceSkills: Skill[] = [], professionSkills: Skill[] = []): Skill[] => {
        const skillMap = new Map<string, Skill>();

        [...raceSkills, ...professionSkills].forEach((skill) => {
            if (skillMap.has(skill.name)) {
                // Sum the levels if the skill already exists
                skillMap.set(skill.name, {
                    ...skill,
                    level: skillMap.get(skill.name)!.level + skill.level,
                });
            } else {
                skillMap.set(skill.name, skill);
            }
        });

        return Array.from(skillMap.values());
    };

    const mergeAbilities = (raceAbilities: Ability[] = [], professionAbilities: Ability[] = []): Ability[] => {
        // Use a Set to remove duplicates based on ability name
        const abilitySet = new Map<string, Ability>();
        [...raceAbilities, ...professionAbilities].forEach((ability) => {
            abilitySet.set(ability.name, ability);
        });

        return Array.from(abilitySet.values());
    };


    // Function to merge stats
    const mergeStats = (raceStats: Partial<Stats> = {}, professionStats: Partial<Stats> = {}): Stats => {
        return {
            strength: (raceStats.strength || 0) + (professionStats.strength || 0),
            dexterity: (raceStats.dexterity || 0) + (professionStats.dexterity || 0),
            toughness: (raceStats.toughness || 0) + (professionStats.toughness || 0),
            perception: (raceStats.perception || 0) + (professionStats.perception || 0),
            size: (raceStats.size || 0) + (professionStats.size || 0),
            magic: (raceStats.magic || 0) + (professionStats.magic || 0),
            learning: (raceStats.learning || 0) + (professionStats.learning || 0),
            physicalResistance: (raceStats.physicalResistance || 0) + (professionStats.physicalResistance || 0),
            magicResistance: (raceStats.magicResistance || 0) + (professionStats.magicResistance || 0),
            fireResistance: (raceStats.fireResistance || 0) + (professionStats.fireResistance || 0),
            poisonResistance: (raceStats.poisonResistance || 0) + (professionStats.poisonResistance || 0),
            coldResistance: (raceStats.coldResistance || 0) + (professionStats.coldResistance || 0),
            psionicResistance: (raceStats.psionicResistance || 0) + (professionStats.psionicResistance || 0),
        };
    };

    // Function to merge skills and abilities (avoids duplicates)
    /*
    const mergeArrays = <T,>(raceArray: T[] = [], professionArray: T[] = []): T[] => {
        return Array.from(new Set([...raceArray, ...professionArray])); // Ensures no duplicates
    };
    */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInitialCharacter({
            ...initialCharacter, // Spread current character properties
            [event.target.name]: event.target.value // Update the changed property
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;

        let updatedCharacter = { ...initialCharacter, [name]: value };

        if (name === 'race') {
            const selectedRace = races.find((r) => r.name === value);
            if (selectedRace) {
                updatedCharacter = {
                    ...updatedCharacter,
                    stats: mergeStats(
                        selectedRace.stats,
                        initialCharacter.profession ? professions.find((p) => p.name === initialCharacter.profession)?.stats : {}
                    ),
                    skills: mergeSkills(
                        selectedRace.skills,
                        initialCharacter.profession ? professions.find((p) => p.name === initialCharacter.profession)?.skills : []
                    ),
                    abilities: mergeAbilities(
                        selectedRace.abilities,
                        initialCharacter.profession ? professions.find((p) => p.name === initialCharacter.profession)?.abilities : []
                    )
                };
            }
        }

        if (name === 'profession') {
            const selectedProfession = professions.find((p) => p.name === value);
            if (selectedProfession) {
                updatedCharacter = {
                    ...updatedCharacter,
                    stats: mergeStats(
                        initialCharacter.race ? races.find((r) => r.name === initialCharacter.race)?.stats : {},
                        selectedProfession.stats
                    ),
                    skills: mergeSkills(
                        initialCharacter.race ? races.find((r) => r.name === initialCharacter.race)?.skills : [],
                        selectedProfession.skills
                    ),
                    abilities: mergeAbilities(
                        initialCharacter.race ? races.find((r) => r.name === initialCharacter.race)?.abilities : [],
                        selectedProfession.abilities
                    )
                };
            }
        }

        setInitialCharacter(updatedCharacter);
    };


    /*
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setInitialCharacter({
            ...initialCharacter, // Keep existing properties
            [event.target.name]: event.target.value // Update changed field
        });
    };
*/
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
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        console.log('clicked to preBattle');
                                        setGameObject({
                                            ...gameObject,
                                            characters: [initialCharacter, ...npcs]
                                        });
                                        setView('play1');
                                    }}
                                >
                                    Start the Adventure
                                </Button>
                            </>
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
