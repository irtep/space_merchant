    import { Armour, Character, GameObject, Item, Loot, Weapon } from "../interfaces/sharedInterfaces";
    import { isCircleColliding } from "./collisions";

    const buttonWidth: number = 120;
    const buttonHeight: number = 30;
    const smallButtonWidth: number = 80;
    const smallButtonHeight: number = 14;
    const fontSize: number = 14;
    let detailsButtonX: number = 0;
    let detailsButtonY: number = 0;
    let pauseButtonX: number = 0;
    let pauseButtonY: number = 0;
    const unequipButtons: { x: number; y: number; slot: string; type: "weapon" | "armour" }[] = [];
    const dropButtons: { x: number; y: number; itemIndex: number }[] = [];
    const equipButtons: { x: number; y: number; itemIndex: number }[] = [];
    const pickUpButtons: { x: number; y: number; lootIndex: number }[] = [];

    export const handleMouseDownToConsole = (
        event: MouseEvent,
        canvas: HTMLCanvasElement,
        gameObject: GameObject,
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setPause: React.Dispatch<React.SetStateAction<boolean>>,
        pauseRef: React.RefObject<boolean>,
        setMessage: React.Dispatch<React.SetStateAction<string>>/*,
        setGameObject: React.Dispatch<React.SetStateAction<GameObject>>*/
    ) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        console.log('x and y ', clickX, clickY);
        console.log('console listens');
        console.log('dropB: ', dropButtons);
        console.log('equipB: ', equipButtons);
        console.log('unEb: ', unequipButtons);

        // Check if click is inside the "More Details" button
        if (
            clickX >= detailsButtonX &&
            clickX <= detailsButtonX + buttonWidth &&
            clickY >= detailsButtonY &&
            clickY <= detailsButtonY + buttonHeight
        ) {
            // Get clicked character
            const clickedCharacter = gameObject.characters[gameObject.clickedCharacterIndex];

            if (clickedCharacter) {
                /*
                alert(
                    `More Details:\n` +
                    `Name: ${clickedCharacter.name}\n` +
                    `Race: ${clickedCharacter.race}\n` +
                    `Profession: ${clickedCharacter.profession}\n` +
                    `Description: ${clickedCharacter.desc}\n`
                );
                */
                setDialogOpen(true);
            }
        }

        // Check if click is inside the "pause" button
        if (
            clickX >= pauseButtonX &&
            clickX <= pauseButtonX + buttonWidth &&
            clickY >= pauseButtonY &&
            clickY <= pauseButtonY + buttonHeight
        ) {
            setPause((prevPause) => {
                const newPauseState = !prevPause;
                pauseRef.current = newPauseState; // Ensure pauseRef is updated
                console.log('Paused:', newPauseState);
                setMessage(newPauseState ? 'PAUSED' : 'not in pause');
                return newPauseState;
            });

            //setGameObject(gameObject); // ref to gameObject is actually liveGameObject
        }

        // Check for "Unequip" button clicks
        unequipButtons.forEach(({ x, y, slot, type }) => {
            if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
                const character = gameObject.characters[gameObject.clickedCharacterIndex];
                if (character) {
                    if (type === "weapon") {
                        console.log('Unequipping:', character.weapons[slot as keyof typeof character.weapons]);

                        // Store the item before clearing it
                        const unequippedWeapon = character.weapons[slot as keyof typeof character.weapons];
                        if (unequippedWeapon) {
                            character.inventory.push(unequippedWeapon);
                        }

                        // Clear the slot
                        character.weapons[slot as keyof typeof character.weapons] = "" as any;
                    } else {
                        console.log('Unequipping Armour:', character.armours[slot as keyof typeof character.armours]);

                        const unequippedArmour = character.armours[slot as keyof typeof character.armours];
                        if (unequippedArmour) {
                            character.inventory.push(unequippedArmour);
                        }

                        character.armours[slot as keyof typeof character.armours] = "" as any;
                    }

                    //setGameObject({ ...gameObject });
                }
            }
        });

        equipButtons.forEach(({ x, y, itemIndex }) => {
            if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
                const character = gameObject.characters[gameObject.clickedCharacterIndex];
                if (character) {
                    // Find the actual item in inventory
                    const itemToEquip = character.inventory[itemIndex];

                    if (itemToEquip) {
                        let equipped = false; // Track if we successfully equipped

                        if (itemToEquip.type === "weapon") {
                            if (!character.weapons.rightHand) {
                                character.weapons.rightHand = itemToEquip;
                                equipped = true;
                            } else if (!character.weapons.leftHand) {
                                character.weapons.leftHand = itemToEquip;
                                equipped = true;
                            } else {
                                console.log("Hands are full!");
                            }
                        } else if (itemToEquip.type === "armour") {
                            const slot = itemToEquip.slot as keyof typeof character.armours;
                            if (!character.armours[slot]) {
                                character.armours[slot] = itemToEquip;
                                equipped = true;
                            } else {
                                console.log(`Slot ${slot} is occupied!`);
                            }
                        }

                        // Remove from inventory only if equipped
                        if (equipped) {
                            const index = character.inventory.findIndex((item) => item === itemToEquip);
                            if (index !== -1) {
                                character.inventory.splice(index, 1);
                            }
                            console.log(`Equipped: ${itemToEquip.name}`);
                        }
                    }
                }
            }
        });

        // Check for "Drop" button clicks
        dropButtons.forEach(({ x, y, itemIndex }) => {
            if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
                const character = gameObject.characters[gameObject.clickedCharacterIndex];
                if (character) {
                    // Ensure valid index
                    if (itemIndex >= 0 && itemIndex < character.inventory.length) {
                        const itemToDrop = character.inventory[itemIndex];

                        if (itemToDrop) {
                            // Drop only that item
                            gameObject.gameMap.loots.push({
                                x: character.location.x,
                                y: character.location.y,
                                what: itemToDrop
                            });

                            // Remove only the dropped item from inventory
                            const index = character.inventory.findIndex((item) => item === itemToDrop);
                            if (index !== -1) {
                                character.inventory.splice(index, 1);
                            }

                            console.log(`Dropped: ${itemToDrop.name}`);
                        }
                    }
                }
            }
        });

        // Check for "Pick Up" button clicks
        pickUpButtons.forEach(({ x, y, lootIndex }) => {
            if (clickX >= x && clickX <= x + smallButtonWidth && clickY >= y && clickY <= y + smallButtonHeight) {
                const character = gameObject.characters[gameObject.clickedCharacterIndex];

                if (character) {
                    // Ensure valid index
                    if (lootIndex >= 0 && lootIndex < gameObject.gameMap.loots.length) {
                        const lootToPickUp = gameObject.gameMap.loots[lootIndex];

                        if (lootToPickUp) {
                            // Add item to character's inventory
                            character.inventory.push(lootToPickUp.what);

                            // Remove the picked-up loot from the map
                            gameObject.gameMap.loots.splice(lootIndex, 1);

                            console.log(`Picked up: ${lootToPickUp.what.name}`);
                        }
                    }
                }
            }
        });
    };

    export const drawConsole = (
        canvas: HTMLCanvasElement,
        gameObject: GameObject
    ): void => {
        const marginLeft: number = 20;
        const marginTop: number = 20;
        let lines: number = 0;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        unequipButtons.length = 0;
        dropButtons.length = 0;
        equipButtons.length = 0;
        pickUpButtons.length = 0;

        gameObject.characters.forEach((c: Character, i: number) => {
            if (i === gameObject.clickedCharacterIndex) {
                ctx.font = `16px Arial`;
                ctx.fillStyle = "white";

                // Character info
                ctx.fillText(
                    `${c.name} the ${c.race} ${c.profession}`,
                    marginLeft,
                    marginTop + lines * fontSize
                );
                lines++;
                lines++;

                ctx.font = `${fontSize}px Arial`;

                if (c.desc !== '' && c.desc) {
                    ctx.fillText(c.desc, marginLeft, marginTop + lines * fontSize);
                    lines++;
                    lines++;
                }

                ["leftHand", "rightHand"].forEach((slot) => {
                    const weapon = c.weapons[slot as keyof typeof c.weapons];
                    if (weapon) {
                        ctx.fillText(`in ${slot}: ${weapon.name}`, marginLeft, marginTop + lines * fontSize);
                        ctx.fillStyle = "red";
                        ctx.fillRect(marginLeft + 250, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                        ctx.fillStyle = "white";
                        ctx.fillText("Unequip", marginLeft + 260, marginTop + lines * fontSize);
                        unequipButtons.push({ x: marginLeft + 250, y: marginTop + lines * fontSize - 10, slot, type: "weapon" });
                        lines++;
                    }
                });

                lines++;
                ctx.fillText(`Armours:`, marginLeft, marginTop + lines * fontSize);
                lines++;
                Object.entries(c.armours).forEach(([slot, armour]) => {
                    if (armour) {
                        ctx.fillText(`${armour.name} (${slot})`, marginLeft, marginTop + lines * fontSize);
                        ctx.fillStyle = "red";
                        ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                        ctx.fillStyle = "white";
                        ctx.fillText("Unequip", marginLeft + 210, marginTop + lines * fontSize);
                        unequipButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, slot, type: "armour" });
                        lines++;
                    }
                });

                lines++;
                ctx.fillText(`Inventory:`, marginLeft, marginTop + lines * fontSize);
                lines++;

                const inventoryGrouped: Record<string, { item: Armour | Weapon | Item, count: number }> = {};

                c.inventory.forEach((item) => {
                    if (inventoryGrouped[item.name]) {
                        inventoryGrouped[item.name].count++;
                    } else {
                        inventoryGrouped[item.name] = { item, count: 1 };
                    }
                });
                
                Object.entries(inventoryGrouped).forEach(([name, { item, count }], index) => {
                    lines++;
                    ctx.fillText(`${name} x${count}`, marginLeft, marginTop + lines * fontSize);
                
                    // Drop button
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                    ctx.fillStyle = "black";
                    ctx.fillText("Drop", marginLeft + 210, marginTop + lines * fontSize);
                
                    dropButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, itemIndex: index });
                
                    // Equip button (if applicable)
                    if (item.type === "armour" || item.type === "weapon") {
                        ctx.fillStyle = "green";
                        ctx.fillRect(marginLeft + 290, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                        ctx.fillStyle = "white";
                        ctx.fillText("Equip", marginLeft + 300, marginTop + lines * fontSize);
                        equipButtons.push({ x: marginLeft + 290, y: marginTop + lines * fontSize - 10, itemIndex: index });
                    }
                });
                
/*
                c.inventory.forEach((item: Armour | Weapon | Item, index: number) => {
                    lines++;
                    ctx.fillText(`${item.name}`, marginLeft, marginTop + lines * fontSize);

                    // Draw Drop button
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(marginLeft + 200, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                    ctx.fillStyle = "black";
                    ctx.fillText("Drop", marginLeft + 210, marginTop + lines * fontSize);

                    // Draw Equip button
                    if (item.type === 'armour' || item.type === 'weapon') {
                        ctx.fillStyle = "green";
                        ctx.fillRect(marginLeft + 290, marginTop + lines * fontSize - 10, smallButtonWidth, smallButtonHeight);
                        ctx.fillStyle = "white";
                        ctx.fillText("Equip", marginLeft + 300, marginTop + lines * fontSize);
                        // store equip button positions
                        equipButtons.push({ x: marginLeft + 290, y: marginTop + lines * fontSize - 10, itemIndex: index });
                    }

                    // Store drop button positions
                    dropButtons.push({ x: marginLeft + 200, y: marginTop + lines * fontSize - 10, itemIndex: index });
                    
                });
*/

                // ground
                lines++;
                lines++;
                ctx.fillText(`On ground near:`, marginLeft, marginTop + lines * fontSize);
                lines++;
                // code to check if something near

                gameObject.gameMap.loots.forEach((loot: Loot, i: number) => {
                    // c.stats.size
                    // loot size is 5
                    const colDetect: boolean = isCircleColliding(
                        { x: c.location.x, y: c.location.y, size: c.stats.size },
                        { x: loot.x, y: loot.y, size: 5 }
                    );
                    if (colDetect) {
                        lines++;
                        ctx.fillText(`${loot.what.name}`, marginLeft, marginTop + lines * fontSize);
                        // Draw "Pick Up" button
                        const pickUpX = marginLeft + 200;
                        const pickUpY = marginTop + lines * fontSize - 10;

                        ctx.fillStyle = "blue";
                        ctx.fillRect(pickUpX, pickUpY, smallButtonWidth, smallButtonHeight);
                        ctx.fillStyle = "white";
                        ctx.fillText("Pick Up", pickUpX + 10, pickUpY + 10);

                        // Store button in an array for interaction
                        pickUpButtons.push({ x: pickUpX, y: pickUpY, lootIndex: i });
                    }
                });

                // Draw "More Details" Button
                lines += 2;
                detailsButtonX = marginLeft;
                detailsButtonY = marginTop + lines * fontSize;
                ctx.fillStyle = "blue"; // Button color
                ctx.fillRect(detailsButtonX, detailsButtonY, buttonWidth, buttonHeight);
                ctx.fillStyle = "white"; // Text color
                ctx.font = "14px Arial";
                ctx.fillText("More Details", detailsButtonX + 10, detailsButtonY + 20);
                // Draw "Pause toggle button" Button
                lines += 3;
                pauseButtonX = marginLeft;
                pauseButtonY = marginTop + lines * fontSize;
                ctx.fillStyle = "green"; // Button color
                ctx.fillRect(pauseButtonX, pauseButtonY, buttonWidth, buttonHeight);
                ctx.fillStyle = "white"; // Text color
                ctx.font = "14px Arial";
                ctx.fillText("Pause/unpause", pauseButtonX + 10, pauseButtonY + 20);
            }
        });
    };
