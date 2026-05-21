"use client"

import { useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useRef, useState } from "react"
import * as Three from "three"

interface CameraControllerProps {
    // 나중에 클릭 인터랙션 붙일 때를 대비해 미리 열어둠 (우선 안 넘겨줘도 작동함)
    targetPosition?: { x: number; y: number; z: number } | null;
}

export default function CameraController({ targetPosition }: CameraControllerProps) {
    const cameraRef = useRef<Three.PerspectiveCamera>(null!);
    const controlsRef = useRef<any>(null!);

    const [isIntro, setIsIntro] = useState(true);

    const finalRadius = 400;

    useFrame((state) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        const elapsedTime = state.clock.getElapsedTime();

        if (isIntro) {
            //인트로 애니메이션
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
                // 오빗 컨트롤러가 현재 카메라 위치에서 자연스럽게 마우스 이벤트를 이어받도록 초기화
                controls.saveState();
            }
        } else {
            // 인트로 종료
            if (targetPosition) {
                const lerpSpeed = 0.05; // 부드럽게 쫓아가는 속도

                const targetVec = new Three.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);

                // 오빗 컨트롤의 회전 중심점(타겟)을 노드 위치로 부드럽게 이동
                controls.target.lerp(targetVec, lerpSpeed);


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
            />
        </>
    )
}