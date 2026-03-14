"use client";
import { useEffect, useRef } from "react";

export default function GalaxyNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const state = useRef({
        stars: [] as any[],
        adj: [] as number[][],
        mstEdges: [] as any[],
        nodeBrightness: [] as number[],
        nodeDepth: [] as number[],
        hoveredNodeId: -1,
        transform: { x: 0, y: 0, scale: 0.6 },
        isDragging: false,
        lastMouse: { x: 0, y: 0 },
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            state.current.transform.x = canvas.width / 2;
            state.current.transform.y = canvas.height / 2;
        };
        window.addEventListener('resize', resize);
        resize();

        // --- 1. 데이터 생성 ---
        const nodeCount = 180;
        const rawEdges = Array.from({ length: 300 }, () => ({
            u: Math.floor(Math.random() * nodeCount),
            v: Math.floor(Math.random() * nodeCount),
            w: Math.random()
        }));

        const adj = Array.from({ length: nodeCount }, () => [] as number[]);
        const parent = Array.from({ length: nodeCount }, (_, i) => i);
        const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
        const sortedEdges = rawEdges.sort((a, b) => a.w - b.w);
        const mstEdges: any[] = [];

        for (const edge of sortedEdges) {
            const rootU = find(edge.u), rootV = find(edge.v);
            if (rootU !== rootV) {
                parent[rootU] = rootV;
                mstEdges.push(edge);
                adj[edge.u].push(edge.v);
                adj[edge.v].push(edge.u);
            }
        }

        // --- 2. 레이아웃 생성 ---
        const stars = Array.from({ length: nodeCount }, (_, i) => ({
            id: i, x: 0, y: 0, size: 2.5, hue: 200, sat: 30, blinkOffset: Math.random() * 10
        }));

        const centerNode = adj.reduce((m, c, i, a) => (c.length > a[m].length ? i : m), 0);
        const visitedLayout = new Set([centerNode]);
        const queueLayout = [{ id: centerNode, level: 0, parentAngle: 0 }];
        stars[centerNode] = { ...stars[centerNode], x: 0, y: 0, size: 8, hue: 210, sat: 15 };

        while (queueLayout.length > 0) {
            const { id, level, parentAngle } = queueLayout.shift()!;
            const neighbors = adj[id].filter(n => !visitedLayout.has(n));
            neighbors.forEach((neighbor, i) => {
                visitedLayout.add(neighbor);
                const spread = Math.PI / (level * 0.4 + 1);
                const childAngle = level === 0 ? (i / neighbors.length) * Math.PI * 2 : parentAngle + (i - (neighbors.length - 1) / 2) * (spread / Math.max(1, neighbors.length));
                const radius = (level + 1) * 170;
                let hue = (Math.random() < 0.5) ? 210 + Math.random() * 20 : 260 + Math.random() * 25;
                stars[neighbor] = {
                    ...stars[neighbor],
                    x: Math.cos(childAngle) * radius + (Math.random() - 0.5) * 80,
                    y: Math.sin(childAngle) * radius + (Math.random() - 0.5) * 80,
                    size: 2.5 + Math.random() * 3.5,
                    hue,
                    sat: 40 + Math.random() * 30
                };
                queueLayout.push({ id: neighbor, level: level + 1, parentAngle: childAngle });
            });
        }

        state.current.stars = stars;
        state.current.adj = adj;
        state.current.mstEdges = mstEdges;
        state.current.nodeBrightness = new Array(nodeCount).fill(1);
        state.current.nodeDepth = new Array(nodeCount).fill(99);

        // --- 3. 렌더링 루프 ---
        const render = () => {
            const { width, height } = canvas;
            const now = Date.now();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "#000105";
            ctx.fillRect(0, 0, width, height);

            const { x, y, scale } = state.current.transform;
            ctx.translate(x, y); ctx.scale(scale, scale);
            ctx.globalCompositeOperation = "lighter";

            // [간선]
            state.current.mstEdges.forEach(e => {
                const s1 = state.current.stars[e.u], s2 = state.current.stars[e.v];
                const d1 = state.current.nodeDepth[e.u], d2 = state.current.nodeDepth[e.v];
                const b1 = state.current.nodeBrightness[e.u], b2 = state.current.nodeBrightness[e.v];
                const avgB = (b1 + b2) / 2;

                if (d1 <= 5 || d2 <= 5) {
                    const distAlpha = Math.max(0, 1 - Math.min(d1, d2) / 5);
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(${s1.hue}, ${s1.sat}%, 70%, ${0.1 + avgB * distAlpha * 0.12})`;
                    ctx.lineWidth = (0.9 + avgB * distAlpha * 1.0) / scale;
                    ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(180, 220, 255, ${0.08 * avgB})`;
                    ctx.lineWidth = 0.7 / scale;
                    ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
                }
            });

            // [노드]
            state.current.stars.forEach(s => {
                const b = state.current.nodeBrightness[s.id];
                const d = state.current.nodeDepth[s.id];
                const baseRadius = (s.size / scale);

                if (d <= 5) {
                    const displayD = d > 5 ? 5 : d;
                    const glowScale = d === 0 ? 45 : (16 * (1 - displayD / 6));
                    const r1 = baseRadius * glowScale * b;
                    const opacity = d === 0 ? 0.8 : (0.13 * (1 - displayD / 6));

                    const grad1 = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r1);
                    grad1.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, 60%, ${opacity * b})`);
                    grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.beginPath(); ctx.arc(s.x, s.y, r1, 0, Math.PI * 2);
                    ctx.fillStyle = grad1; ctx.fill();

                    const coreR = baseRadius * (d === 0 ? 12 : 4) * b;
                    const grad2 = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, coreR);
                    grad2.addColorStop(0, `hsla(${s.hue}, ${d === 0 ? 0 : 20}%, ${d === 0 ? 100 : 80}%, ${b})`);
                    grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.beginPath(); ctx.arc(s.x, s.y, coreR, 0, Math.PI * 2);
                    ctx.fillStyle = grad2; ctx.fill();

                    state.current.nodeBrightness[s.id] = Math.min(1, b + 0.08);
                } else {
                    const wave = Math.sin(now * 0.0008 + (s.blinkOffset || 0));
                    const targetAlpha = Math.max(0.12, 0.22 + wave * 0.1);
                    const currentAlpha = targetAlpha * b;

                    const staticR = baseRadius * 5;
                    const staticGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, staticR);
                    staticGrad.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, 70%, ${currentAlpha})`);
                    staticGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                    ctx.beginPath(); ctx.arc(s.x, s.y, staticR, 0, Math.PI * 2);
                    ctx.fillStyle = staticGrad; ctx.fill();

                    if (b > 0.4) {
                        state.current.nodeBrightness[s.id] *= 0.97;
                    } else {
                        state.current.nodeBrightness[s.id] = Math.min(1, b + 0.02);
                    }
                }
            });

            ctx.globalCompositeOperation = "source-over";
            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // --- 4. 인터랙션 (수정된 BFS 파동) ---
    const triggerBFS = (startId: number, isEntering: boolean) => {
        const waves: number[][] = [];
        let tempQueue = [{ id: startId, d: 0 }];
        let tempVisited = new Set([startId]);

        while(tempQueue.length > 0) {
            const levelSize = tempQueue.length;
            const currentLevelNodes: number[] = [];
            for(let i=0; i<levelSize; i++) {
                const item = tempQueue.shift()!;
                currentLevelNodes.push(item.id);
                state.current.adj[item.id]?.forEach(n => {
                    if(!tempVisited.has(n) && item.d < 5) {
                        tempVisited.add(n);
                        tempQueue.push({id: n, d: item.d + 1});
                    }
                });
            }
            waves.push(currentLevelNodes);
        }

        const applyWave = (waveIdx: number) => {
            // 들어올 때(isEntering === true)만 현재 마우스 위치를 체크합니다.
            // 해제할 때(isEntering === false)는 중간에 중단하지 않고 끝까지 99로 밀어버립니다.
            if (isEntering && state.current.hoveredNodeId !== startId) return;

            waves[waveIdx].forEach(nodeId => {
                state.current.nodeDepth[nodeId] = isEntering ? waveIdx : 99;
            });

            if (waveIdx < waves.length - 1) {
                setTimeout(() => applyWave(waveIdx + 1), 120);
            }
        };

        applyWave(0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
        const { x, y, scale } = state.current.transform;

        if (state.current.isDragging) {
            state.current.transform.x += mouseX - state.current.lastMouse.x;
            state.current.transform.y += mouseY - state.current.lastMouse.y;
        }
        state.current.lastMouse = { x: mouseX, y: mouseY };

        const worldX = (mouseX - x) / scale, worldY = (mouseY - y) / scale;
        let foundId = -1;
        for (const star of state.current.stars) {
            if (star && Math.hypot(star.x - worldX, star.y - worldY) < 35 / scale) {
                foundId = star.id; break;
            }
        }

        if (foundId !== -1) {
            if (state.current.hoveredNodeId !== foundId) {
                // 이전 노드 해제는 끝까지 가도록 trigger
                if (state.current.hoveredNodeId !== -1) triggerBFS(state.current.hoveredNodeId, false);
                state.current.hoveredNodeId = foundId;
                triggerBFS(foundId, true);
            }
        } else if (state.current.hoveredNodeId !== -1) {
            triggerBFS(state.current.hoveredNodeId, false);
            state.current.hoveredNodeId = -1;
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { x, y, scale } = state.current.transform;
        const newScale = Math.max(0.05, Math.min(5, scale * (1 - e.deltaY * 0.002)));
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
        const worldX = (mouseX - x) / scale, worldY = (mouseY - y) / scale;
        state.current.transform.scale = newScale;
        state.current.transform.x = mouseX - worldX * newScale;
        state.current.transform.y = mouseY - worldY * newScale;
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={() => (state.current.isDragging = true)}
            onMouseMove={handleMouseMove}
            onMouseUp={() => (state.current.isDragging = false)}
            onWheel={handleWheel}
            style={{
                display: "block",
                background: "#000105",
                width: "100%",
                height: "100%",
                cursor: "crosshair"
            }}
        />
    );
}