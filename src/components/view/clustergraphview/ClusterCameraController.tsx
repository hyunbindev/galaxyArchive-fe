"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ElementRef } from "react";
import { useEffect, useRef } from "react";
import * as Three from "three";
import { ClusterBounds, Point3D } from "@/components/view/clustergraphview/type";

interface ClusterCameraControllerProps {
    bounds: ClusterBounds;
    targetPosition: Point3D | null;
}

export default function ClusterCameraController({ bounds, targetPosition }: ClusterCameraControllerProps) {
    const cameraRef = useRef<Three.PerspectiveCamera>(null);
    const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
    const far = Math.max(1000, Math.max(bounds.radius, 24) * 20);

    useEffect(() => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

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

        controls.target.lerp(
            new Three.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
            0.65,
        );
        controls.update();
    }, [targetPosition]);

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault fov={46} near={0.1} far={far} />
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
