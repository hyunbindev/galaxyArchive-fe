"use client"

import { useMemo, useRef } from "react"
import {Canvas, useFrame, useThree} from "@react-three/fiber"
import * as THREE from "three"
import {PointMaterial} from "@react-three/drei";
import {Bloom, EffectComposer} from "@react-three/postprocessing";

function Scene({ count = 1000 }) {
    const pointsRef = useRef<THREE.Points>(null!)
    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const cols = new Float32Array(count * 3)


        for (let i = 0; i < count; i++) {

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const distance = 4 + Math.random() * 15;


            const x = Math.sin(phi) * Math.cos(theta) * distance;
            const y = Math.sin(phi) * Math.sin(theta) * distance;
            const z = Math.cos(phi) * distance;

            const r = THREE.MathUtils.randFloat(0.4, 0.8)
            const g = THREE.MathUtils.randFloat(0.4, 0.8)
            const b = THREE.MathUtils.randFloat(0.4, 0.8)


            cols.set([r, g, b], i * 3)

            pos.set([x, y, z], i * 3)
        }
        return {positions:pos , colors:cols}
    }, [count])
    const s = 0.02
    useFrame((_, delta) => {

        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * s
            pointsRef.current.rotation.x += delta * s
            pointsRef.current.rotation.z += delta * s
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <PointMaterial
                size={0.07}
                vertexColors
                sizeAttenuation={true}
                transparent
                opacity={1.0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

export default function GalaxyBackground() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full">
            <Canvas camera={{ position: [0, 0, 0] }}>
                <Scene />
                <EffectComposer>
                    <Bloom luminanceThreshold={0} intensity={1.5} mipmapBlur />
                </EffectComposer>
            </Canvas>
        </div>
    )
}