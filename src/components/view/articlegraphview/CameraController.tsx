"use client"

import { useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as Three from "three"
import { Point3D } from "./type"

interface CameraControllerProps {
    targetPosition: Point3D | null;
}

export default function CameraController({ targetPosition }: CameraControllerProps) {
    const [target, setTarget] = useState<Point3D | null>(null);
    const cameraRef = useRef<Three.PerspectiveCamera>(null!);
    const controlsRef = useRef<any>(null!);
    const [isIntro, setIsIntro] = useState(true);

    const finalRadius = 400;

    useEffect(() => {
        setTarget(targetPosition);
    }, [targetPosition]);

    // 사용자가 드래그(우클릭/좌클릭 등)를 시작하면 자동 이동을 멈춤
    const handleControlStart = () => {
        if (!isIntro) {
            setTarget(null); // 목적지를 초기화해서 useFrame의 lerp 로직을 끔
        }
    };

    useFrame((state) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        const elapsedTime = state.clock.getElapsedTime();

        if (isIntro) {
            // 인트로 애니메이션 (기존과 동일)
            const currentRadius = finalRadius + (400 * Math.exp(-elapsedTime * 3));
            const rotationSpeed = elapsedTime * 0.5;
            const nextX = Math.cos(rotationSpeed) * currentRadius;
            const nextZ = Math.sin(rotationSpeed) * currentRadius;
            const nextY = 60 + (200 * Math.exp(-elapsedTime * 0.8));

            camera.position.set(nextX, nextY, nextZ);
            controls.target.set(0, 0, 0);
            controls.update();

            if (elapsedTime > 5.0 || currentRadius - finalRadius < 1) {
                setIsIntro(false);
                controls.saveState();
            }
        } else {
            // target이 있을 때만 강제 보간 이동
            if (target) {
                const lerpSpeed = 0.05;
                const targetVec = new Three.Vector3(target.x, target.y, target.z);
                const distance = controls.target.distanceTo(targetVec);

                if (distance > 0.1) {
                    controls.target.lerp(targetVec, lerpSpeed);
                    controls.update(); // lerp 작동 중일 때는 수동 update 호출
                } else {
                    setTarget(null); // 목적지에 도달했으면 target을 비워줌 (수동 조작 완전히 양도)
                    controls.saveState();
                }
            } else {
                // target이 없을 때(수동 조작 중일 때)는 enableDamping이 작동하도록
                // controls.update()를 매 프레임 호출해줘야 부드럽게 움직임
                controls.update();
            }
        }
    });

    return (
        <>
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                fov={45}
                near={0.1}
                far={5000}
                position={[500, 300, 500]}
            />
            <OrbitControls
                ref={controlsRef}
                enabled={!isIntro}
                enableDamping
                dampingFactor={0.05}
                onStart={handleControlStart} // 마우스 조작 시작 이벤트 바인딩
            />
        </>
    )
}