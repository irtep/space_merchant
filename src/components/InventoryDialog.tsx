import { Box, Button, Dialog, Typography } from '@mui/material';
import React from 'react';
import { useSMContext } from '../context/smContext';
import { Armour, Armours, Item, Weapon, Weapons } from '../interfaces/sharedInterfaces';

const InventoryDialog: React.FC = (): React.ReactElement => {
    const { gameObject, setGameObject, dialogOpen, setDialogOpen } = useSMContext();
    const selectedCharacter = gameObject.characters[gameObject.clickedCharacterIndex];

    const unequipArmour = (slot: keyof Armours) => {
        console.log('un equip: ', ' from slot ', slot);
        console.log('selected char: ', selectedCharacter);
        setGameObject(prevState => {
            const character = prevState.characters[gameObject.clickedCharacterIndex];
            const armourItem = character.armours[slot]; // Get the armour in the slot

            if (armourItem) {
                character.inventory.push(armourItem);
                character.armours[slot] = ''; // Mark as unequipped
            }
            //liveGameObject = prevState;
            return { ...prevState };
        });
    };

    const unequipWeapon = (slot: keyof Weapons) => {
        console.log('un equip: ', ' from slot ', slot);
        console.log('selected char: ', selectedCharacter);
        setGameObject(prevState => {
            const character = prevState.characters[gameObject.clickedCharacterIndex];
            const weaponInCase = character.weapons[slot]; // Get the wep in the slot

            if (weaponInCase) {
                character.inventory.push(weaponInCase);
                character.weapons[slot] = ''; // Mark as unequipped
            }
            //liveGameObject = prevState;
            return { ...prevState };
        });
    };

    const equipItem = (item: any, slot: keyof typeof selectedCharacter.armours | keyof typeof selectedCharacter.weapons) => {
        console.log('equip: ', item, ' to slot ', slot);
        /*
        setGameObject(prevState => {
            const updatedCharacter = { ...selectedCharacter };
            if (updatedCharacter.armours[slot] || updatedCharacter.weapons[slot]) return prevState; // Slot occupied
            updatedCharacter.inventory = updatedCharacter.inventory.filter(i => i !== item);
            updatedCharacter[item.type === 'armour' ? 'armours' : 'weapons'][slot] = item;
            return { ...prevState };
        });
        */
    };

    const dropItem = (item: Weapon | Armour | Item) => {
        console.log('drop: ', item);

        setGameObject(prevState => {
            //let updatedObject = {};
            const updatedCharacters = prevState.characters.map((char, index) =>
                index === gameObject.clickedCharacterIndex
                    ? {
                        ...char,
                        inventory: char.inventory.filter(i => i !== item)
                    }
                    : char
            );

            const updatedLoots = [
                ...prevState.gameMap.loots,
                { 
                    what: item,
                    x: JSON.parse(JSON.stringify(selectedCharacter.location.x)),
                    y: JSON.parse(JSON.stringify(selectedCharacter.location.y)) }
            ];
            /*
            updatedObject = {
                ...prevState,
                characters: updatedCharacters,
                gameMap: {
                    ...prevState.gameMap,
                    loots: updatedLoots
                }
            };
            */
            //liveGameObject = updatedObject;
            return {
                ...prevState,
                characters: updatedCharacters,
                gameMap: {
                    ...prevState.gameMap,
                    loots: updatedLoots
                }
            };
        });
    };


    const pickUpItem = (item: any) => {
        console.log('pick up: ', item);
        /*
        setGameObject(prevState => {
            const updatedCharacter = { ...selectedCharacter };
            prevState.map.loots = prevState.map.loots.filter(i => i !== item);
            updatedCharacter.inventory.push(item);
            return { ...prevState };
        });
        */
    };

    return (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 3, background: 'rgb(66, 64, 64)', color: 'white' }}>
                {/* Equipped Items */}
                <Box sx={{ flex: 1.66 }}>
                    <Typography>Equipped by {selectedCharacter.name}</Typography>
                    {Object.entries(selectedCharacter.armours).map(([slot, item]) => item && (
                        <Box key={`${slot} equipped `}>
                            <Typography>{slot}: {item.name}</Typography>
                            <Button onClick={() => {
                                if (slot !== '') {
                                    unequipArmour(slot as keyof typeof selectedCharacter.armours);
                                }
                            }}>Unequip</Button>
                        </Box>
                    ))}
                    {Object.entries(selectedCharacter.weapons).map(([slot, item]) => item && (
                        <Box key={`${slot}imte `}>
                            <Typography>{slot}: {item.name}</Typography>
                            <Button
                                onClick={() => {
                                    unequipWeapon(slot as keyof typeof selectedCharacter.weapons);
                                }}>
                                Unequip
                            </Button>
                        </Box>
                    ))}
                </Box>

                {/* Inventory */}
                <Box sx={{ flex: 1.66 }}>
                    <Typography>Inventory of {selectedCharacter.name}</Typography>
                    {selectedCharacter.inventory.map(item => (
                        <Box key={`${item.name} chars item `}>
                            <Typography>{item.name}</Typography>
                            <Button onClick={() => equipItem(item, item.type === 'armour' ? 'head' : 'rightHand')}>Equip</Button>
                            <Button onClick={() => dropItem(item)}>Drop</Button>
                        </Box>
                    ))}
                </Box>

                {/* Items on Ground */}
                <Box sx={{ flex: 1.66 }}>
                    <Typography>On Ground</Typography>
                    {gameObject.gameMap.loots.filter(loot => loot.x === selectedCharacter.location.x && loot.y === selectedCharacter.location.y).map(item => (
                        <Box key={`${item.what.name} onG `}>
                            <Typography>{item.what.name}</Typography>
                            <Button onClick={() => pickUpItem(item)}>Pick Up</Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Dialog>
    );
}

export default InventoryDialog;