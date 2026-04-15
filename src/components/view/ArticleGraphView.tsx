"use client"

import { useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { PointMaterial, Points, OrbitControls } from "@react-three/drei"
import { Points as PointsImpl, Vector3 } from 'three'

function Scene({ count = 100 }) {
    const pointsRef = useRef<PointsImpl>(null!)
    const lineRef = useRef<THREE.LineSegments>(null!)
    const controlsRef = useRef<any>(null!)

    // 클릭 시 이동할 목표 지점 상태
    const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 0, 0))

    // 1. 노드 데이터 생성 (생략 없음)
    const { positions, colors, rawPositions } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const raw: Vector3[] = []
        const minDist = 1.5;

        for (let i = 0; i < count; i++) {
            let x, y, z, isTooClose;
            let attempts = 0;

            do {
                isTooClose = false;
                // 구형 분포 생성
                const theta = THREE.MathUtils.randFloat(0, 2) * Math.PI * 2;
                const phi = Math.acos(THREE.MathUtils.randFloat(0, 2) - 1);
                const radius = THREE.MathUtils.randInt(2, 20);

                x = Math.sin(phi) * Math.cos(theta) * radius;
                y = Math.sin(phi) * Math.sin(theta) * radius;
                z = Math.cos(phi) * radius;

                // 근접 노드 체크
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
            } while (isTooClose && attempts * 10 < 100);

            pos.set([x, y, z], i * 3);
            cols.set([1, 1, 1], i * 3); // 기본 흰색
            raw.push(new THREE.Vector3(x, y, z));
        }

        return { positions: pos, colors: cols, rawPositions: raw }
    }, [count])

    // 2. 노드 클릭 이벤트 핸들러
    const handlePointClick = (e: any) => {
        e.stopPropagation();
        if (e.index !== undefined) {
            const idx = e.index;
            // 클릭된 점의 세계 좌표를 목표 지점으로 설정
            const newTarget = new THREE.Vector3(
                positions[idx * 3],
                positions[idx * 3 + 1],
                positions[idx * 3 + 2]
            );
            setTargetPos(newTarget);
        }
    };

    // 3. 매 프레임 업데이트 (이동 및 선 연결)
    useFrame((_, delta) => {
        if (controlsRef.current) {
            // 카메라 타겟을 클릭한 노드 위치로 부드럽게 이동
            controlsRef.current.target.lerp(targetPos, 0.1);
            controlsRef.current.update();
        }

        if (pointsRef.current && lineRef.current) {
            // 점의 회전과 선의 회전 동기화
            lineRef.current.rotation.copy(pointsRef.current.rotation);

            const lineIndices = [];
            const limitDistance = 5.5;

            for (let i = 0; i < count; i++) {
                let minDistance = Number.POSITIVE_INFINITY;
                let target = null;
                for (let j = i + 1; j < count; j++) {
                    const dist = rawPositions[i].distanceTo(rawPositions[j]);
                    if (dist < minDistance && dist < limitDistance) {
                        minDistance = dist;
                        target = j;
                    }
                }
                if (target !== null) {
                    lineIndices.push(rawPositions[i].x, rawPositions[i].y, rawPositions[i].z);
                    lineIndices.push(rawPositions[target].x, rawPositions[target].y, rawPositions[target].z);
                }
            }

            lineRef.current.geometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(lineIndices, 3)
            );
            lineRef.current.geometry.attributes.position.needsUpdate = true;
        }
    })

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                makeDefault
                enablePan={true}
                enableZoom={true}
                rotateSpeed={0.2}
                enableDamping={true}
                dampingFactor={0.05}
            />

            <Points
                ref={pointsRef}
                positions={positions}
                colors={colors}
                stride={3}
                onClick={handlePointClick}
            >
                <PointMaterial
                    size={0.8}
                    vertexColors
                    transparent
                    opacity={1}
                    sizeAttenuation
                    depthWrite={true}
                    alphaTest={0.5}
                />
            </Points>

            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial color="white" transparent opacity={0.15} depthWrite={false} />
            </lineSegments>
        </>
    )
}

export default function ArticleGraphView() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full" style={{ mixBlendMode: 'difference' }}>
            <Canvas camera={{ position: [15, 15, 15], fov: 60 }}>
                <Scene />
            </Canvas>
        </div>
    )
}