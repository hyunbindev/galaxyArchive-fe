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

    // 인트로 애니메이션 진행 중인지 여부 (완료되면 마우스 조작을 자유롭게 풀기 위함)
    const [isIntro, setIsIntro] = useState(true);

    // 카메라가 최종적으로 도달할 디폴트 반경(거리)
    const finalRadius = 400;

    useFrame((state) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        // 경과 시간 (애니메이션의 타이밍 축이 됨)
        const elapsedTime = state.clock.getElapsedTime();

        if (isIntro) {
            // [인트로 애니메이션 로직]
            // 1. 시간이 흐를수록 반경을 500(우주 멀리)에서 100(기본 거리)으로 점점 좁힘
            // Math.exp(-elapsedTime * 0.8)을 써서 처음엔 빠르게, 갈수록 천천히 접근하게 만듦
            const currentRadius = finalRadius + (400 * Math.exp(-elapsedTime * 0.8));

            // 2. 회전 속도 세팅 (시간에 따라 뱅글뱅글 도는 각도 계산)
            const rotationSpeed = elapsedTime * 0.5;

            // 3. 삼각함수로 삼차원 나선형(Spiral) 좌표 생성
            const nextX = Math.cos(rotationSpeed) * currentRadius;
            const nextZ = Math.sin(rotationSpeed) * currentRadius;
            // 위에서 아래로 사선으로 내려오는 느낌을 주기 위해 Y축도 시간에 따라 하강시킴
            const nextY = 60 + (200 * Math.exp(-elapsedTime * 0.8));

            // 4. 카메라 위치 세팅
            camera.position.set(nextX, nextY, nextZ);

            // 5. 인트로 중에는 무조건 월드 중심(0, 0, 0)을 강제로 쳐다보게 고정
            controls.target.set(0, 0, 0);
            controls.update();

            // 6. 시작한 지 약 5초가 지나거나 카메라가 거의 다 접근했으면 인트로 종료하고 제어권 넘김
            if (elapsedTime > 5.0 || currentRadius - finalRadius < 1) {
                setIsIntro(false);
                // 오빗 컨트롤러가 현재 카메라 위치에서 자연스럽게 마우스 이벤트를 이어받도록 초기화
                controls.saveState();
            }
        } else {
            // [인트로 종료 후: 일반 모드]
            if (targetPosition) {
                const lerpSpeed = 0.08;
                const targetVec = new Three.Color(targetPosition.x, targetPosition.y, targetPosition.z); // 벡터 대용 가상

                // (여기는 클릭 인터랙션 붙일 때 활성화하면 돼!)
                // controls.target.lerp(..., lerpSpeed);
                // controls.update();
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
            {/*
               인트로 애니메이션 중에는 유저가 마우스로 화면을 돌리면
               수식이랑 마우스 좌표가 싸우면서 화면이 발작하니까, 인트로 중엔 조작을 잠시 막아둠
            */}
            <OrbitControls
                ref={controlsRef}
                enabled={!isIntro}
                enableDamping
                dampingFactor={0.05}
            />
        </>
    )
}