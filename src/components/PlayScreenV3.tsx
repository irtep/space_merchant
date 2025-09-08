import React, { useState, useRef, useEffect } from "react";
import { Grid, AStarFinder } from "pathfinding";
import { Box, Container } from "@mui/material";
import { useSMContext } from "../context/smContext";
import { GameObject } from "../interfaces/sharedInterfaces";
import { Character } from "../interfaces/sharedInterfaces";
/*
interface Character {
    id: number;
    x: number;
    y: number;
    destX: number;
    destY: number;
    color: string;
    //path: [number, number][];
    path: number[][];
}
*/
interface Projectile {
    x: number;
    y: number;
    dx: number;
    dy: number;
    active: boolean;
    trail: { x: number; y: number; alpha: number }[];
    type: "laser" | "energy" | "bullet";
}

const CELL_SIZE = 20;
const GRID_WIDTH = 60;
const GRID_HEIGHT = 40;

const BUILDINGS = [
    { x: 5, y: 5, w: 4, h: 4 },
    { x: 15, y: 10, w: 5, h: 3 },
    { x: 22, y: 4, w: 3, h: 6 },
];

const DEBUG_MODE = true;

const PlayScreenV3: React.FC = () => {
    const {
        gameObject,
        setGameObject,
        //      dialogOpen,
        //      setDialogOpen
        //indexOfSelected,
        //setIndexOfSelected
    } = useSMContext();
    /*
    const [characters, setCharacters] = useState<Character[]>([
        { id: 1, x: 2, y: 2, destX: 2, destY: 2, color: "red", path: [] },
        { id: 2, x: 10, y: 2, destX: 10, destY: 2, color: "blue", path: [] },
        { id: 3, x: 2, y: 10, destX: 2, destY: 10, color: "green", path: [] },
    ]);
    */
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [opponent, setOpponent] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [projectileType, setProjectileType] = useState<'laser' | 'energy' | 'bullet'>('energy');
    const [paused, setPaused] = useState(false);
    const pauseRef: React.RefObject<boolean> = useRef<boolean>(paused); // UseRef to store latest pause state
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const buildGrid = (excludeId?: string) => {
        const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);

        /*
        BUILDINGS.forEach(b => {
            for (let i = 0; i < b.w; i++) {
                for (let j = 0; j < b.h; j++) {
                    grid.setWalkableAt(b.x + i, b.y + j, false);
                }
            }
        });
        */
        gameObject.gameMap.rectObstacles.forEach(b => {
            for (let i = 0; i < b.w; i++) {
                for (let j = 0; j < b.h; j++) {
                    grid.setWalkableAt(b.x + i, b.y + j, false);
                }
            }
        });

        /*
         // mark other characters as obstacles
         characters.forEach(c => {
             if (c.id !== excludeId) {
                 const cx = Math.round(c.x);
                 const cy = Math.round(c.y);
                 grid.setWalkableAt(cx, cy, false);
             }
         });
         // mark opponent as obstacle
         const ox = Math.round(opponent.x);
         const oy = Math.round(opponent.y);
         grid.setWalkableAt(ox, oy, false);
         */
        gameObject.characters.forEach(c => {
            if (c.id !== excludeId) {
                const cx = Math.round(c.location.x);
                const cy = Math.round(c.location.y);
                grid.setWalkableAt(cx, cy, false);
            }
        });
        return grid;
    };

    const handleClick = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        const clickY = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        // check if clicked inside any character
        /*
        const clickedChar = characters.find(c => {
        */
        const clickedChar = gameObject.characters.find(c => {
            const cx = c.location.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = c.location.y * CELL_SIZE + CELL_SIZE / 2;
            const dist = Math.hypot(
                e.clientX - rect.left - cx,
                e.clientY - rect.top - cy
            );
            return dist < CELL_SIZE / 2; // inside circle
        });

        if (clickedChar) {
            // select character instead of moving
            setSelectedId(clickedChar.id);
            return;
        }

        // otherwise try to move selected character
        if (!selectedId) return;

        const grid = buildGrid(selectedId);
        const finder = new AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true, // optional: prevents cutting through corners of buildings
        });

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
        /*
        setCharacters(chars =>
            chars.map(c => {
                if (c.id === selectedId) {
                    const path = finder.findPath(
                        Math.round(c.x),
                        Math.round(c.y),
                        clickX,
                        clickY,
                        grid.clone()
                    );
                    return { ...c, destX: clickX, destY: clickY, path };
                }
                return c;
            })
        );
        */
    };


    const shoot = () => {
        if (!selectedId) return;
        const shooter = gameObject.characters.find(c => c.id === selectedId);
        if (!shooter) return;

        const startX = shooter.location.x * CELL_SIZE + CELL_SIZE / 2;
        const startY = shooter.location.y * CELL_SIZE + CELL_SIZE / 2;
        const targetX = opponent.x * CELL_SIZE + CELL_SIZE / 2;
        const targetY = opponent.y * CELL_SIZE + CELL_SIZE / 2;

        const dx = targetX - startX;
        const dy = targetY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let blocked = false;

        for (let i = 1; i <= dist / 5; i++) {
            const cx = startX + (dx * i) / (dist / 5);
            const cy = startY + (dy * i) / (dist / 5);

            for (const b of gameObject.gameMap.rectObstacles/*BUILDINGS*/) {
                if (
                    cx >= b.x * CELL_SIZE &&
                    cx <= (b.x + b.w) * CELL_SIZE &&
                    cy >= b.y * CELL_SIZE &&
                    cy <= (b.y + b.h) * CELL_SIZE
                ) {
                    blocked = true;
                    if (DEBUG_MODE) console.log("Shot blocked by building at", cx, cy);
                    break;
                }
            }

            for (const c of gameObject.characters) {
                if (c.id === selectedId) continue; // don't block self
                const ccx = c.location.x * CELL_SIZE + CELL_SIZE / 2;
                const ccy = c.location.y * CELL_SIZE + CELL_SIZE / 2;
                if (Math.hypot(cx - ccx, cy - ccy) < CELL_SIZE / 2) {
                    blocked = true;
                    if (DEBUG_MODE) console.log("Shot blocked by teammate", c.id);
                    break;
                }
            }
        }

        if (blocked && !DEBUG_MODE) return;

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
                setProjectiles(prev =>
                    prev
                        .map(p => {
                            if (!p.active) return p;
                            const speed = 5;
                            const nx = p.x + p.dx * speed;
                            const ny = p.y + p.dy * speed;

                            const newTrail = [...p.trail, { x: nx, y: ny, alpha: 1 }].slice(-15);

                            // Opponent still as-is for now
                            const ox = opponent.x * CELL_SIZE + CELL_SIZE / 2;
                            const oy = opponent.y * CELL_SIZE + CELL_SIZE / 2;
                            if (Math.hypot(nx - ox, ny - oy) < CELL_SIZE / 2) {
                                if (DEBUG_MODE) console.log("Projectile hit opponent!");
                                return { ...p, active: false };
                            }

                            for (const b of BUILDINGS) {
                                if (
                                    nx >= b.x * CELL_SIZE &&
                                    nx <= (b.x + b.w) * CELL_SIZE &&
                                    ny >= b.y * CELL_SIZE &&
                                    ny <= (b.y + b.h) * CELL_SIZE
                                ) {
                                    if (DEBUG_MODE) console.log("Projectile collided with building");
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
    }, [opponent]);


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
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#ccc";

        // border lines
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(GRID_WIDTH * CELL_SIZE, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, GRID_HEIGHT * CELL_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, GRID_HEIGHT * CELL_SIZE);
        ctx.lineTo(GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(GRID_WIDTH * CELL_SIZE, 0);
        ctx.lineTo(GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE);
        ctx.stroke();

        // buildings
        ctx.fillStyle = "gray";

        gameObject.gameMap.rectObstacles.forEach(b => {
        //BUILDINGS.forEach(b => {
            console.log('building: ', b.x * CELL_SIZE, b.y * CELL_SIZE, b.w * CELL_SIZE, b.h * CELL_SIZE);
            ctx.fillRect(b.x * CELL_SIZE, b.y * CELL_SIZE, b.w * CELL_SIZE, b.h * CELL_SIZE);
        });

        // characters
        gameObject.characters.forEach(c => {
            ctx.beginPath();
            console.log('character: ', c.location.x * CELL_SIZE + CELL_SIZE / 2, c.location.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
            ctx.arc(c.location.x * CELL_SIZE + CELL_SIZE / 2, c.location.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
            if (c.id === selectedId) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = "yellow";
                ctx.stroke();
            }
        });

        // "opponent"
        ctx.beginPath();
        ctx.arc(opponent.x * CELL_SIZE + CELL_SIZE / 2, opponent.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();

        // projectiles
        projectiles.forEach(p => {
            switch (p.type) {
                case "laser":
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    const endX = p.x + p.dx * 10;
                    const endY = p.y + p.dy * 10;
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = "cyan";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    break;
                case "energy":
                    for (let i = 0; i < p.trail.length; i++) {
                        const t = p.trail[i];
                        ctx.beginPath();
                        ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255,165,0,${(i + 1) / p.trail.length})`;
                        ctx.fill();
                    }
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                    ctx.fillStyle = "orange";
                    ctx.fill();
                    break;
                case "bullet":
                    ctx.fillStyle = "black";
                    ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
                    break;
            }
        });
    }, [gameObject, selectedId, opponent, projectiles]);

    useEffect(() => {
        pauseRef.current = paused;
    }, [paused]);

    useEffect( () => {
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
                        <canvas ref={canvasRef} width={GRID_WIDTH * CELL_SIZE} height={GRID_HEIGHT * CELL_SIZE} onClick={handleClick} className="border border-gray-400" />
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

                        {gameObject.characters.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedId(c.id)}
                                style={{
                                    background: `${selectedId === c.id ? "yellow" : "white"}`
                                }}
                            >
                                Select Character {c.id}
                            </button>
                        ))}

                        <div className="mt-2">
                            <label>Projectile Type: </label>
                            <select value={projectileType} onChange={e => setProjectileType(e.target.value as any)} className="border p-1 rounded">
                                <option value="laser">Laser</option>
                                <option value="energy">Energy Gun</option>
                                <option value="bullet">Bullet</option>
                            </select>
                        </div>
                        {selectedId && (
                            <button onClick={shoot} className="p-2 mt-4 bg-red-300 rounded border">
                                Shoot Opponent
                            </button>
                        )}
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
