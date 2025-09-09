import React, { useState, useRef, useEffect } from "react";
import { Grid, AStarFinder } from "pathfinding";
import { Box, Container } from "@mui/material";
import { useSMContext } from "../context/smContext";
import { Character } from "../interfaces/sharedInterfaces";
import { placeCharactersRandomly } from "../functions/playScreenV3/pSv3functions";
import { drawGame } from "../functions/playScreenV3/drawGame";

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
    const {
        gameObject,
        setGameObject,
    } = useSMContext();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<"move" | "ranged" | "melee" | null>(null);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [projectileType, setProjectileType] = useState<'laser' | 'energy' | 'bullet'>('energy');
    const [paused, setPaused] = useState(false);
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);
    const pauseRef: React.RefObject<boolean> = useRef<boolean>(paused); // UseRef to store latest pause state
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const charactersRef = useRef<Character[]>(gameObject.characters);

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

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
        setHoverPos({ x, y });
    };

    const handleMouseLeave = () => {
        setHoverPos(null); // reset when leaving canvas
    };

    const handleClick = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const clickY = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        // If we are waiting for a target (ranged or melee)
        if (selectedAction === "ranged" || selectedAction === "melee") {
            const targetChar = gameObject.characters.find(c =>
                Math.round(c.location.x) === clickX &&
                Math.round(c.location.y) === clickY
            );

            if (targetChar) {
                if (selectedAction === "ranged" && selectedId !== null) {
                    console.log("Ranged attack on", targetChar.id);
                    shootAtCharacter(selectedId, targetChar);  // ✅ actually shoot
                    setSelectedAction(null);
                    return;
                } else {
                    console.log("Melee attack on", targetChar.id);
                    // TODO: your melee damage logic here
                }
            }

            setSelectedAction(null); // reset after action
            return;
        }

        // If we are moving
        if (selectedAction === "move" && selectedId) {
            const grid = buildGrid(selectedId);
            const finder = new AStarFinder({ allowDiagonal: true, dontCrossCorners: true });

            setGameObject(gob => ({
                ...gob,
                characters: gob.characters.map((c: Character) => {
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

            setSelectedAction(null); // reset
            return;
        }

        // Otherwise: maybe just select a character
        const clickedChar = gameObject.characters.find(c => {
            const cx = c.location.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = c.location.y * CELL_SIZE + CELL_SIZE / 2;
            const dist = Math.hypot(e.clientX - rect.left - cx, e.clientY - rect.top - cy);
            return dist < CELL_SIZE / 2;
        });

        if (clickedChar && clickedChar.team === "player") {
            setSelectedId(clickedChar.id);
        }
    };

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
            {
                x: startX,
                y: startY,
                dx: dx / dist,
                dy: dy / dist,
                active: true,
                trail: [],
                type: projectileType,
                targetId: target.id
            },
        ]);
    };

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
                            const speed = 0.3; // your requested walking speed

                            if (dist < speed) {
                                // Snap to grid cell and consume first step
                                return {
                                    ...c,
                                    location: { x: nextX, y: nextY },
                                    path: c.path.slice(1),
                                };
                            } else {
                                // Move smoothly toward target
                                const moveX = currentX + (dx / dist) * speed;
                                const moveY = currentY + (dy / dist) * speed;
                                return {
                                    ...c,
                                    location: {
                                        x: moveX / CELL_SIZE - 0.5,
                                        y: moveY / CELL_SIZE - 0.5,
                                    },
                                };
                            }
                        }
                        return c;
                    }),
                }));

                // Update projectiles (if you still keep them separate)
                // Update projectiles
                setProjectiles(prev =>
                    prev
                        .map(p => {
                            if (!p.active) return p;
                            const speed = 5;
                            const nx = p.x + p.dx * speed;
                            const ny = p.y + p.dy * speed;
                            const characters = charactersRef.current;

                            const newTrail = [...p.trail, { x: nx, y: ny, alpha: 1 }].slice(-15);

                            // ✅ If projectile had a specific target
                            if (p.targetId) {
                                const target = characters.find(c => c.id === p.targetId);

                                if (target) {
                                    const tx = target.location.x * CELL_SIZE + CELL_SIZE / 2;
                                    const ty = target.location.y * CELL_SIZE + CELL_SIZE / 2;
                                    if (Math.hypot(nx - tx, ny - ty) < CELL_SIZE / 2) {
                                        if (DEBUG_MODE) console.log(`Projectile reached target ${target.id}!`);
                                        return { ...p, active: false };
                                    }
                                }
                            }

                            // ✅ Or: check generic collision with *any* enemy
                            for (const enemy of characters.filter(c => c.team !== gameObject.characters[0].team)) {
                                const ex = enemy.location.x * CELL_SIZE + CELL_SIZE / 2;
                                const ey = enemy.location.y * CELL_SIZE + CELL_SIZE / 2;
                                if (Math.hypot(nx - ex, ny - ey) < CELL_SIZE / 2) {
                                    if (DEBUG_MODE) console.log(`Projectile hit ${enemy.id}!`);
                                    return { ...p, active: false };
                                }
                            }

                            // Check collision with obstacles
                            for (const b of gameObject.gameMap.rectObstacles) {
                                if (
                                    nx >= b.x * CELL_SIZE &&
                                    nx <= (b.x + b.w) * CELL_SIZE &&
                                    ny >= b.y * CELL_SIZE &&
                                    ny <= (b.y + b.h) * CELL_SIZE
                                ) {
                                    return { ...p, active: false };
                                }
                            }

                            return { ...p, x: nx, y: ny, trail: newTrail };
                        })
                        .filter(p => p.active)
                );

            } else {
                console.log("pause");
            }

            animationFrame = requestAnimationFrame(step);
        };

        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, []);


    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setPaused(p => !p);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    useEffect(() => {
        setGameObject(gob => ({
            ...gob,
            characters: placeCharactersRandomly(
                gob.characters,
                gob.gameMap.rectObstacles,
                GRID_WIDTH,
                GRID_HEIGHT
            ),
        }));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        drawGame(ctx, canvas, gameObject, selectedId, projectiles, hoverPos, selectedAction);
    }, [gameObject, selectedId, projectiles, hoverPos, selectedAction]);


    useEffect(() => {
        pauseRef.current = paused;
    }, [paused]);

    useEffect(() => {
        charactersRef.current = gameObject.characters;
    }, [gameObject.characters]);

    useEffect(() => {
        console.log('game Ob', gameObject);
    }, []);

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
                        flex: 2.5, // 80% width
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >

                    {/* Left Column: Canvas (80%) */}
                    <div className="w-3/5 flex justify-center items-center bg-green-50">
                        <canvas
                            ref={canvasRef}
                            width={GRID_WIDTH * CELL_SIZE}
                            height={GRID_HEIGHT * CELL_SIZE}
                            onClick={handleClick}
                            className="border border-gray-400"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave} />
                    </div>

                </Box>

                {/* Right Column: Texts (20%) */}
                <Box
                    sx={{
                        flex: 2.5, // 20% width
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            color: 'black',
                            margin: 1
                        }}
                    >
                        <h2 className="text-lg font-semibold">Controls</h2>

                        {gameObject.characters
                            .filter(c => c.team === gameObject.characters[0].team)
                            .map(c => (
                                <button
                                    key={`selChar-${c.id}`}
                                    onClick={() => setSelectedId(c.id)}
                                    style={{
                                        background: selectedId === c.id ? "yellow" : "white",
                                    }}
                                >
                                    Select Character {c.id}
                                </button>
                            ))}
                        {selectedId && (
                            <div className="mt-4 flex flex-col gap-2">
                                <button onClick={() => setSelectedAction("move")} className="p-2 bg-blue-200 rounded">
                                    Move
                                </button>
                                <button onClick={() => setSelectedAction("ranged")} className="p-2 bg-red-200 rounded">
                                    Ranged Attack
                                </button>
                                <button onClick={() => setSelectedAction("melee")} className="p-2 bg-green-200 rounded">
                                    Close Combat
                                </button>
                            </div>
                        )}

                        <div className="mt-2">
                            <label>Projectile Type: </label>
                            <select value={projectileType} onChange={e => setProjectileType(e.target.value as any)} className="border p-1 rounded">
                                <option value="laser">Laser</option>
                                <option value="energy">Energy Gun</option>
                                <option value="bullet">Bullet</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setPaused(p => !p)}
                            className="p-2 mt-4 bg-blue-300 rounded border"
                        >
                            {paused ? "Resume" : "Pause"}
                        </button>
                        {DEBUG_MODE && (
                            <div className="mt-4 p-2 text-sm bg-gray-100 border">
                                <p>✅ Debug mode ON</p>
                                <p>Projectiles will fire even if blocked.</p>
                                <p>Check console logs for hit/block info.</p>
                            </div>
                        )}
                    </div>
                </Box>
            </Box>
        </Container >
    );
};

export default PlayScreenV3;
