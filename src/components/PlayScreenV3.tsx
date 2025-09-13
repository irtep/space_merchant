import React, { useState, useRef, useEffect } from "react";
import { Grid, AStarFinder } from "pathfinding";
import { Box, Container } from "@mui/material";
import { useSMContext } from "../context/smContext";
import { AnyItem, Character, Weapon, } from "../interfaces/sharedInterfaces";
import { placeCharactersRandomly } from "../functions/playScreenV3/pSv3functions";
import { drawGame } from "../functions/playScreenV3/drawGame";
import { getItem, equipItem, unequipItem } from "../functions/playScreenV3/equipmentHandling";
import { itemStore } from "../data/itemStore";

interface Projectile {
    x: number;
    y: number;
    dx: number;
    dy: number;
    active: boolean;
    trail: { x: number; y: number; alpha: number }[];
    type: "laser" | "energy" | "bullet";
    targetId?: string;
}

const CELL_SIZE = 20;
const GRID_WIDTH = 60;
const GRID_HEIGHT = 40;
const DEBUG_MODE: boolean = true;

const PlayScreenV3: React.FC = () => {
    const { gameObject, setGameObject } = useSMContext();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<"move" | "ranged" | "melee" | null>(null);
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);
    const [hoverCharId, setHoverCharId] = useState<string | null>(null);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [projectileType, setProjectileType] = useState<'laser' | 'energy' | 'bullet'>('energy');
    const [paused, setPaused] = useState(false);

    const pauseRef = useRef(paused);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const charactersRef = useRef<Character[]>(gameObject.characters);
    // derived character
    const hoverChar = hoverCharId
        ? gameObject.characters.find(c => c.id === hoverCharId) || null
        : null;
    const groundLoots = hoverChar
        ? gameObject.gameMap.loots.filter(
            loot =>
                Math.round(loot.location.x) === Math.round(hoverChar.location.x) &&
                Math.round(loot.location.y) === Math.round(hoverChar.location.y)
        )
        : [];
    const selectedChar = gameObject.characters.find(c => c.id === selectedId);
    const isWeapon = (item: AnyItem | undefined): item is Weapon =>
        !!item && item.type === "weapon";

    const rightHandId = selectedChar?.equipment.rightHand;
    const leftHandId = selectedChar?.equipment.leftHand;

    const equippedWeapon =
        (rightHandId && rightHandId !== "" ? getItem(rightHandId, itemStore) : undefined) ||
        (leftHandId && leftHandId !== "" ? getItem(leftHandId, itemStore) : undefined);

    const hasRanged = isWeapon(equippedWeapon) && equippedWeapon.effects.includes("ranged");



    /** BUILD PATHFINDING GRID */
    const buildGrid = (excludeId?: string) => {
        const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);

        gameObject.gameMap.rectObstacles.forEach(b => {
            for (let i = 0; i < b.w; i++) {
                for (let j = 0; j < b.h; j++) {
                    grid.setWalkableAt(b.x + i, b.y + j, false);
                }
            }
        });

        gameObject.characters.forEach(c => {
            if (c.id !== excludeId) {
                const cx = Math.round(c.location.x);
                const cy = Math.round(c.location.y);
                grid.setWalkableAt(cx, cy, false);
            }
        });
        return grid;
    };

    /** MOUSE EVENTS */
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        setHoverPos({ x, y });

        // Detect hovered character
        const hovered = gameObject.characters.find(c =>
            Math.round(c.location.x) === x &&
            Math.round(c.location.y) === y
        );

        // Only update hoverChar if we actually hover a character
        if (hovered) {
            setHoverCharId(hovered.id);
        }
        // else keep last hovered character
    };

    const handleMouseLeave = () => {
        setHoverPos(null);
    };

    /** CHARACTER CLICK & ACTIONS */
    const handleClick = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const clickY = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        // Targeting for ranged/melee
        if ((selectedAction === "ranged" || selectedAction === "melee") && selectedId) {
            const targetChar = gameObject.characters.find(c =>
                Math.round(c.location.x) === clickX &&
                Math.round(c.location.y) === clickY
            );

            if (targetChar) {
                if (selectedAction === "ranged") {
                    shootAtCharacter(selectedId, targetChar);
                } else {
                    console.log("Melee attack", targetChar.id);
                    // TODO: melee logic
                }
                setSelectedAction(null);
                return;
            }
            setSelectedAction(null);
            return;
        }

        // Movement
        if (selectedAction === "move" && selectedId) {
            const grid = buildGrid(selectedId);
            const finder = new AStarFinder({ allowDiagonal: true, dontCrossCorners: true });

            setGameObject(gob => ({
                ...gob,
                characters: gob.characters.map(c => {
                    if (c.id === selectedId) {
                        const path = finder.findPath(
                            Math.round(c.location.x),
                            Math.round(c.location.y),
                            clickX,
                            clickY,
                            grid.clone()
                        );
                        return { ...c, targetLocation: { x: clickX, y: clickY }, path };
                    }
                    return c;
                }),
            }));
            setSelectedAction(null);
            return;
        }

        // Selection
        const clickedChar = gameObject.characters.find(c =>
            Math.round(c.location.x) === clickX && Math.round(c.location.y) === clickY &&
            c.team === gameObject.characters[0].team
        );
        if (clickedChar) setSelectedId(clickedChar.id);
    };

    const handleDrop = (itemId: string) => {
        setGameObject(prev => {
            const updatedChars = prev.characters.map(c => {
                if (c.id !== hoverCharId) return c;
                const newInv = c.inventory.map(i =>
                    i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
                ).filter(i => i.quantity > 0);

                return { ...c, inventory: newInv };
            });

            const char = prev.characters.find(c => c.id === hoverCharId)!;
            console.log('char: ', char);
            const newLoot = {
                id: crypto.randomUUID(),
                itemId,
                quantity: 1,
                location: { ...char.location }
            };

            return {
                ...prev,
                characters: updatedChars,
                gameMap: {
                    ...prev.gameMap,
                    loots: [...prev.gameMap.loots, newLoot]
                }
            };
        });
    };

    const handlePickUp = (lootId: string) => {
        setGameObject(prev => {
            const loot = prev.gameMap.loots.find(l => l.id === lootId);
            if (!loot) return prev;

            const updatedChars = prev.characters.map(c => {
                if (c.id !== selectedId) return c;
                const existing = c.inventory.find(i => i.itemId === loot.itemId);
                if (existing) {
                    return {
                        ...c,
                        inventory: c.inventory.map(i =>
                            i.itemId === loot.itemId
                                ? { ...i, quantity: i.quantity + loot.quantity }
                                : i
                        )
                    };
                } else {
                    return {
                        ...c,
                        inventory: [...c.inventory, { itemId: loot.itemId, quantity: loot.quantity }]
                    };
                }
            });

            return {
                ...prev,
                characters: updatedChars,
                gameMap: {
                    ...prev.gameMap,
                    loots: prev.gameMap.loots.filter(l => l.id !== lootId)
                }
            };
        });
    };

    /** PROJECTILE FIRING */
    const shootAtCharacter = (shooterId: string, target: Character) => {
        const shooter = gameObject.characters.find(c => c.id === shooterId);
        if (!shooter) return;

        const startX = shooter.location.x * CELL_SIZE + CELL_SIZE / 2;
        const startY = shooter.location.y * CELL_SIZE + CELL_SIZE / 2;
        const targetX = target.location.x * CELL_SIZE + CELL_SIZE / 2;
        const targetY = target.location.y * CELL_SIZE + CELL_SIZE / 2;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        setProjectiles(prev => [
            ...prev,
            { x: startX, y: startY, dx: dx / dist, dy: dy / dist, active: true, trail: [], type: projectileType, targetId: target.id },
        ]);
    };

    /** GAME LOOP */
    useEffect(() => {
        let animationFrame: number;

        const step = () => {
            if (!pauseRef.current) {
                // Update characters
                setGameObject(prev => ({
                    ...prev,
                    characters: prev.characters.map(c => {
                        if (c.path && c.path.length > 0) {
                            const [nextX, nextY] = c.path[0];
                            const targetX = nextX * CELL_SIZE + CELL_SIZE / 2;
                            const targetY = nextY * CELL_SIZE + CELL_SIZE / 2;
                            const currentX = c.location.x * CELL_SIZE + CELL_SIZE / 2;
                            const currentY = c.location.y * CELL_SIZE + CELL_SIZE / 2;

                            const dx = targetX - currentX;
                            const dy = targetY - currentY;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const speed = 0.3;

                            if (dist < speed) {
                                return { ...c, location: { x: nextX, y: nextY }, path: c.path.slice(1) };
                            } else {
                                return { ...c, location: { x: (currentX + (dx / dist) * speed) / CELL_SIZE - 0.5, y: (currentY + (dy / dist) * speed) / CELL_SIZE - 0.5 } };
                            }
                        }
                        return c;
                    }),
                }));

                // Update projectiles
                setProjectiles(prev => prev.map(p => {
                    if (!p.active) return p;
                    const speed = 5;
                    const nx = p.x + p.dx * speed;
                    const ny = p.y + p.dy * speed;
                    const newTrail = [...p.trail, { x: nx, y: ny, alpha: 1 }].slice(-15);

                    // Check target collision
                    if (p.targetId) {
                        const target = charactersRef.current.find(c => c.id === p.targetId);
                        if (target && Math.hypot(nx - (target.location.x * CELL_SIZE + CELL_SIZE / 2), ny - (target.location.y * CELL_SIZE + CELL_SIZE / 2)) < CELL_SIZE / 2) {
                            return { ...p, active: false };
                        }
                    }
                    return { ...p, x: nx, y: ny, trail: newTrail };
                }).filter(p => p.active));
            }
            animationFrame = requestAnimationFrame(step);
        };
        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    /** KEYBOARD PAUSE */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.code === "Space") setPaused(p => !p); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    /** INITIAL CHARACTER PLACEMENT */
    useEffect(() => {
        setGameObject(gob => ({
            ...gob,
            characters: placeCharactersRandomly(gob.characters, gob.gameMap.rectObstacles, GRID_WIDTH, GRID_HEIGHT)
        }));
    }, []);

    /** DRAW CANVAS */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawGame(ctx, canvas, gameObject, selectedId, projectiles, hoverPos, selectedAction);
    }, [gameObject, selectedId, projectiles, hoverPos, selectedAction]);

    /** REFS */
    useEffect(() => { pauseRef.current = paused; }, [paused]);
    useEffect(() => { charactersRef.current = gameObject.characters; }, [gameObject.characters]);

    /** HOVER PANEL ACTIONS */
    const handleEquip = (itemId: string, slot: keyof Character['equipment']) => {
        if (!hoverChar) return;
        const updatedChar = equipItem(hoverChar, itemId, slot);
        setGameObject(gob => ({
            ...gob,
            characters: gob.characters.map(c => c.id === hoverChar.id ? updatedChar : c),
        }));
    };

    const handleUnequip = (slot: keyof Character['equipment']) => {
        if (!hoverChar) return;
        const updatedChar = unequipItem(hoverChar, slot);
        setGameObject(gob => ({
            ...gob,
            characters: gob.characters.map(c => c.id === hoverChar.id ? updatedChar : c),
        }));
    };

    return (
        <Container maxWidth={false} disableGutters>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 3, background: 'rgb(66, 64, 64)', color: 'red', height: '100vh' }}>

                {/* Left Panel: Hover Info (20%) */}
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        background: 'rgb(220, 220, 220)',
                        height: '100%',         // make it full height
                        overflowY: 'auto',      // scroll if content is too big
                        minHeight: 0,           // fix flexbox overflow issue
                        minWidth: 0
                    }}
                >
                    {hoverChar ? (
                        <>
                            <h3>{hoverChar.name}</h3>
                            <div>
                                {`${hoverChar.profession} ${hoverChar.race}`} <br/>
                                {`hit points: ${hoverChar.hitPoints}/${hoverChar.maxHitPoints}`} <br/>
                                {`endurance points: ${hoverChar.endurancePoints}/${hoverChar.maxEndurancePoints}`} <br/>
                            </div>
                            <div>
                                <h4>Equipment:</h4>
                                {Object.entries(hoverChar.equipment).map(([slot, itemId]) => {
                                    const item = itemId ? getItem(itemId, itemStore) : null;
                                    return (
                                        <div
                                            key={slot}
                                            style={{ borderStyle: "solid" }}
                                        >
                                            {slot}: {item ? item.name : "empty"}
                                            {hoverChar.team === gameObject.characters[0].team && item && (
                                                <button
                                                    onClick={() => handleUnequip(slot as keyof Character["equipment"])}
                                                    style={{ marginLeft: 5 }}
                                                >
                                                    Unequip
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <h4>Inventory:</h4>
                                {hoverChar.inventory.map((invItem, index) => {
                                    const item = getItem(invItem.itemId, itemStore);
                                    if (!item) return null;

                                    // check if target slot already has something
                                    const rightHandFree = !hoverChar.equipment.rightHand;
                                    const leftHandFree = !hoverChar.equipment.leftHand;
                                    const armourSlotFree = item.type === "armour"
                                        ? !hoverChar.equipment[item.slot as keyof Character["equipment"]]
                                        : false;

                                    return (
                                        <div
                                            key={`invOfPl-${invItem.itemId}-${index}`}
                                            style={{ borderStyle: "solid" }}
                                        >
                                            {item.name} x{invItem.quantity}
                                            {hoverChar.team === gameObject.characters[0].team && (
                                                <div style={{ display: "inline-block", marginLeft: 5 }}>
                                                    {item.type === "weapon" && (
                                                        <>
                                                            {rightHandFree && (
                                                                <button onClick={() => handleEquip(invItem.itemId, "rightHand")}>
                                                                    Equip Right
                                                                </button>
                                                            )}
                                                            {leftHandFree && (
                                                                <button onClick={() => handleEquip(invItem.itemId, "leftHand")}>
                                                                    Equip Left
                                                                </button>
                                                            )}
                                                        </>
                                                    )}

                                                    {item.type === "armour" && armourSlotFree && (
                                                        <button
                                                            onClick={() =>
                                                                handleEquip(invItem.itemId, item.slot as keyof Character["equipment"])
                                                            }
                                                        >
                                                            Equip {item.slot}
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDrop(invItem.itemId)}>Drop</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {groundLoots.length > 0 && (
                                <div>
                                    <h4>On Ground:</h4>
                                    {groundLoots.map(loot => {
                                        const item = getItem(loot.itemId, itemStore);
                                        return (
                                            <div key={loot.id} style={{ borderStyle: "dashed" }}>
                                                {item?.name} x{loot.quantity}
                                                <button onClick={() => handlePickUp(loot.id)}>Pick Up</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <p style={{ minHeight: '200px' }}>Hover over a character to see info</p>
                    )}
                </Box>


                {/* Center Panel: Canvas (60%) */}
                <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <canvas
                        ref={canvasRef}
                        width={GRID_WIDTH * CELL_SIZE}
                        height={GRID_HEIGHT * CELL_SIZE}
                        onClick={handleClick}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="border border-gray-400"
                    />
                </Box>

                {/* Right Panel: Controls (20%) */}
                <Box sx={{ flex: 1, textAlign: 'center', color: 'black', minWidth: 0 }}>
                    <h2>Controls</h2>
                    {gameObject.characters.filter(c => c.team === gameObject.characters[0].team).map(c => (
                        <button key={c.id} onClick={() => setSelectedId(c.id)} style={{ background: selectedId === c.id ? "yellow" : "white", display: 'block', margin: '5px 0' }}>
                            Select Character {c.id}
                        </button>
                    ))}

                    {selectedId && (
                        <div style={{ marginTop: 10 }}>
                            <button onClick={() => setSelectedAction("move")}>Move</button>

                            {hasRanged && (
                                <button onClick={() => setSelectedAction("ranged")}>
                                    Ranged Attack
                                </button>
                            )}

                            <button onClick={() => setSelectedAction("melee")}>Close Combat</button>
                        </div>
                    )}


                    <div style={{ marginTop: 10 }}>
                        <label>Projectile Type: </label>
                        <select value={projectileType} onChange={e => setProjectileType(e.target.value as any)}>
                            <option value="laser">Laser</option>
                            <option value="energy">Energy Gun</option>
                            <option value="bullet">Bullet</option>
                        </select>
                    </div>

                    <button onClick={() => setPaused(p => !p)} style={{ marginTop: 10 }}>
                        {paused ? "Resume" : "Pause"}
                    </button>

                    {DEBUG_MODE && <div style={{ marginTop: 10 }}>Debug mode ON</div>}
                </Box>
            </Box>
        </Container>
    );
};

export default PlayScreenV3;
