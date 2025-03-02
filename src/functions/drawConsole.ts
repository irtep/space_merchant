import { Character, GameObject } from "../interfaces/sharedInterfaces";

const buttonWidth: number = 120;
const buttonHeight: number = 30;
let detailsButtonX: number = 0;
let detailsButtonY: number = 0;
let pauseButtonX: number = 0;
let pauseButtonY: number = 0;

export const handleMouseDownToConsole = (
    event: MouseEvent,
    canvas: HTMLCanvasElement,
    gameObject: GameObject,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setPause: React.Dispatch<React.SetStateAction<boolean>>,
    pauseRef: React.RefObject<boolean>,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setGameObject: React.Dispatch<React.SetStateAction<GameObject>>
) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    console.log('x and y ', clickX, clickY);
    console.log('console listens');

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
        
        setGameObject(gameObject); // ref to gameObject is actually liveGameObject
    }
};

export const drawConsole = (
    canvas: HTMLCanvasElement,
    gameObject: GameObject
): void => {
    const marginLeft: number = 20;
    const marginTop: number = 20;
    let lines: number = 0;
    const fontSize: number = 14;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            // Weapons
            if (c.weapons.leftHand !== "") {
                ctx.fillText(`Wielded in left:`, marginLeft, marginTop + lines * fontSize);
                lines++;
                ctx.fillText(`${c.weapons.leftHand.name}`, marginLeft, marginTop + lines * fontSize);
                lines++;
            }
            if (c.weapons.rightHand !== "") {
                ctx.fillText(`Wielded in right:`, marginLeft, marginTop + lines * fontSize);
                lines++;
                ctx.fillText(`${c.weapons.rightHand.name}`, marginLeft, marginTop + lines * fontSize);
                lines++;
            }

            // Armours
            lines++;
            ctx.fillText(`Armours:`, marginLeft, marginTop + lines * fontSize);
            lines++;
            Object.entries(c.armours).forEach(([slot, armour]) => {
                if (armour && typeof armour === "object" && "name" in armour) {
                    ctx.fillText(`${armour.name} (${slot})`, marginLeft, marginTop + lines * fontSize);
                    lines++;
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
