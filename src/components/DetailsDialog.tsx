import { Box, Button, Dialog, Typography } from '@mui/material';
import React from 'react';
import { useSMContext } from '../context/smContext';

const DetailsDialog: React.FC = (): React.ReactElement => {
    const { gameObject, setGameObject, dialogOpen, setDialogOpen } = useSMContext();
    const selectedCharacter = gameObject.characters[gameObject.clickedCharacterIndex];

    const unequipItem = (slot: keyof typeof selectedCharacter.armours | keyof typeof selectedCharacter.weapons) => {
        console.log('un equip: ', ' from slot ', slot);
        /*
        setGameObject(prevState => {
            const updatedCharacter = { ...selectedCharacter };
            const unequippedItem = updatedCharacter.armours[slot] || updatedCharacter.weapons[slot];
            if (!unequippedItem) return prevState; // No item to unequip
            updatedCharacter.inventory.push(unequippedItem);
            updatedCharacter.armours[slot] = '';
            updatedCharacter.weapons[slot] = '';
            return { ...prevState };
        });
        */
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

    const dropItem = (item: any) => {
        console.log('drop: ', item);
        /*
        setGameObject(prevState => {
            const updatedCharacter = { ...selectedCharacter };
            updatedCharacter.inventory = updatedCharacter.inventory.filter(i => i !== item);
            prevState.map.loots.push({ ...item, location: selectedCharacter.location });
            return { ...prevState };
        });
        */
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
                        <Box key={slot}>
                            <Typography>{slot}: {item.name}</Typography>
                            <Button onClick={() => unequipItem(slot)}>Unequip</Button>
                        </Box>
                    ))}
                    {Object.entries(selectedCharacter.weapons).map(([slot, item]) => item && (
                        <Box key={slot}>
                            <Typography>{slot}: {item.name}</Typography>
                            <Button onClick={() => unequipItem(slot)}>Unequip</Button>
                        </Box>
                    ))}
                </Box>

                {/* Inventory */}
                <Box sx={{ flex: 1.66 }}>
                    <Typography>Inventory of {selectedCharacter.name}</Typography>
                    {selectedCharacter.inventory.map(item => (
                        <Box key={item.name}>
                            <Typography>{item.name}</Typography>
                            <Button onClick={() => equipItem(item, item.type === 'armour' ? 'head' : 'rightHand')}>Equip</Button>
                            <Button onClick={() => dropItem(item)}>Drop</Button>
                        </Box>
                    ))}
                </Box>

                {/* Items on Ground */}
                <Box sx={{ flex: 1.66 }}>
                    <Typography>On Ground</Typography>
                    {gameObject.map.loots.filter(loot => loot.location === selectedCharacter.location).map(item => (
                        <Box key={item.name}>
                            <Typography>{item.name}</Typography>
                            <Button onClick={() => pickUpItem(item)}>Pick Up</Button>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Dialog>
    );
}

export default DetailsDialog;