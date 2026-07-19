"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ElementRef } from "react";
import { useEffect, useRef } from "react";
import * as Three from "three";
import { ClusterBounds, Point3D } from "@/components/view/clustergraphview/type";
import { useFrame } from "@react-three/fiber";

interface ClusterCameraControllerProps {
    bounds: ClusterBounds;
    targetPosition: Point3D | null;
}

export default function ClusterCameraController({ bounds, targetPosition }: ClusterCameraControllerProps) {
    const cameraRef = useRef<Three.PerspectiveCamera>(null);
    const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
    const targetRef = useRef<Three.Vector3>(null);

    // 그래프 크기에 맞춰 far plane을 넉넉하게 잡아 멀리 있는 노드가 잘리지 않게 합니다.
    const far = Math.max(1000, Math.max(bounds.radius, 24) * 20);

    useEffect(() => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        // 전체 그래프 bounds가 바뀌면 카메라를 그래프 중심 기준으로 다시 배치합니다.
        const radius = Math.max(bounds.radius, 24);
        camera.position.set(
            bounds.center.x + radius * 1.4,
            bounds.center.y + radius * 0.8,
            bounds.center.z + radius * 1.6,
        );
        camera.updateProjectionMatrix();

        controls.target.set(bounds.center.x, bounds.center.y, bounds.center.z);
        controls.update();
    }, [bounds]);


    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls || !targetPosition) return;

        targetRef.current = new Three.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)

    }, [targetPosition]);

    useFrame(()=>{
        const controls = controlsRef.current;
        const target = targetRef.current;
        if(!controls || !target) return;

        if (controls.target.distanceTo(target) < 0.01) {
            controls.target.copy(target);
            targetRef.current = null;
        }

        controls.target.lerp(target, 0.08);
        controls.update()
    })

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault fov={46} near={0.01} far={far} />
            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.55}
                zoomSpeed={0.75}
                panSpeed={0.55}
            />
        </>
    );
}
