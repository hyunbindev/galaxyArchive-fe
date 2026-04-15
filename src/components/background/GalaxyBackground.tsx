"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PointMaterial, Points } from "@react-three/drei"
import {Points as PointsImpl, Vector3} from 'three'
function Scene({ count = 300 }) {
    const pointsRef = useRef<PointsImpl>(null!)
    const lineRef = useRef<THREE.LineSegments>(null!)

    const { positions, colors, rawPositions } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const cols = new Float32Array(count * 3)
        const raw:Vector3[] = []

        const minDist = 1.5;


        for (let i = 0; i < count; i++) {
            let x, y, z, isTooClose;
            let attempts = 0;

            do {
                isTooClose = false;

                const theta = THREE.MathUtils.randFloat(0,2) * Math.PI * 2;
                const phi = Math.acos(THREE.MathUtils.randFloat(0,2) - 1);

                const radius =THREE.MathUtils.randInt(2,20);


                x = Math.sin(phi) * Math.cos(theta) * radius;
                y = Math.sin(phi) * Math.sin(theta) * radius;
                z = Math.cos(phi) * radius;

                const minDistSq = minDist * minDist;
                for (let j = 0; j < raw.length; j++) {
                    const dx = raw[j].x - x;
                    const dy = raw[j].y - y;
                    const dz = raw[j].z - z;
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < minDistSq) {
                        isTooClose = true;
                        break;
                    }
                }
                attempts++;
            } while (isTooClose && attempts < 10);

            pos.set([x, y, z], i * 3);
            cols.set([1,1,1], i * 3);
            raw.push(new THREE.Vector3(x, y, z));
        }

        return { positions: pos, colors: cols, rawPositions: raw }
    }, [count])

    useFrame((_, delta) => {
        if (pointsRef.current && lineRef.current) {
            // 회전 동기화
            pointsRef.current.rotation.y += delta * 0.01
            pointsRef.current.rotation.x -= delta * 0.02
            pointsRef.current.rotation.z += delta * 0.03


            lineRef.current.rotation.copy(pointsRef.current.rotation)

            const lineIndices = []
            const limitDistance=5.5

            for (let i = 0; i < count; i++) {
                let minDistance:number = Number.POSITIVE_INFINITY
                let target:number|null = null
                for (let j = i + 1; j < count; j++) {
                    const dist = rawPositions[i].distanceTo(rawPositions[j])
                    if (dist < minDistance && dist < limitDistance) {
                        minDistance = dist
                        target = j
                    }
                }
                if(target){
                    lineIndices.push(rawPositions[i].x, rawPositions[i].y, rawPositions[i].z)
                    lineIndices.push(rawPositions[target].x, rawPositions[target].y, rawPositions[target].z)
                }
            }

            lineRef.current.geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(lineIndices, 3)
            )
        }
    })

    return (
        <>
            <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
                <PointMaterial size={0.35} vertexColors transparent opacity={1} sizeAttenuation depthWrite={true} alphaTest={0.5}/>
            </Points>

            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial color="white" transparent opacity={0.15} depthWrite={false} />
            </lineSegments>
        </>
    )
}

export default function GalaxyBackground() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none" style={{ mixBlendMode: 'difference' }}>
            <Canvas camera={{ position: [11, 11, 11], fov: 60 }}>
                <Scene />
            </Canvas>
        </div>
    )
}