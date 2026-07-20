"use client"

import { useEffect, useRef } from "react"
import * as Three from "three"
import { Node } from "@/components/view/articlegraphview/type";

interface NodeRenderProp {
    nodes: Node[];
    nodeColor: string;
    titleColor: string;
    onNodeClickEvent: (node: Node) => void;
    selectedNode:Node|null;
}

// 텍스트 텍스처 생성 헬퍼 함수
function createTextTexture(text: string, titleColor: string): Three.CanvasTexture {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return new Three.CanvasTexture(canvas);

    //defaultFont Family
    const computedStyle = window.getComputedStyle(document.body);
    const defaultFontFamily = computedStyle.fontFamily;

    //font size
    const fontSize = 50;
    ctx.font = `${fontSize}px ${defaultFontFamily}`;

    //텍스트 실제 넓이
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    //패딩
    const paddingX = 40;
    const paddingY = 20;

    //실제 canvas 넓이 : 텍스트 넓이, 높이 + 패딩
    canvas.width = textWidth + paddingX;
    canvas.height = fontSize + paddingY;

    ctx.font = `${fontSize}px ${defaultFontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";



    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = titleColor;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new Three.CanvasTexture(canvas);
    texture.minFilter = Three.LinearMipmapLinearFilter;
    texture.magFilter = Three.LinearFilter;
    texture.generateMipmaps = true;

    (texture as any).aspectRatio = canvas.width / canvas.height;

    return texture;
}

export default function NodeRender({ nodes, nodeColor, titleColor, onNodeClickEvent , selectedNode }: NodeRenderProp) {
    const meshRef = useRef<Three.InstancedMesh>(null!);
    const textGroupRef = useRef<Three.Group>(null!);

    // 구체(Mesh) 위치 업데이트 로직
    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh || !nodes.length) return;

        const dummy = new Three.Object3D();

        const colorDefault = new Three.Color(nodeColor);
        //클릭시 변경될 노드 색
        //const colorSelected = new Three.Color("#cccc");

        nodes.forEach((node, index) => {
            if (!node.position) return;
            dummy.position.set(node.position.x, node.position.y, node.position.z);
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);

            mesh.setColorAt(index, colorDefault);
        });

        mesh.count = nodes.length;
        mesh.instanceMatrix.needsUpdate = true;

        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
        }

        //인스턴스들의 충돌 감지 영역을 강제로 리컴퓨팅함
        mesh.computeBoundingBox();
        mesh.computeBoundingSphere();
    }, [nodeColor, nodes, selectedNode]);

    // 텍스트 스프라이트 생성 및 렌더링 로직
    useEffect(() => {
        const textGroup = textGroupRef.current;
        if (!textGroup) return;

        while (textGroup.children.length > 0) {
            const child = textGroup.children[0] as Three.Sprite;
            if (child.material) {
                child.material.map?.dispose();
                child.material.dispose();
            }
            textGroup.remove(child);
        }

        nodes.forEach((node) => {
            if (!node.position) return;

            const label = node.title || `Node`;
            const texture = createTextTexture(label, titleColor);
            const aspectRatio = (texture as any).aspectRatio || 4;

            const spriteMaterial = new Three.SpriteMaterial({
                map: texture,
                transparent: true,
                depthTest: true,
                depthWrite: false,
                sizeAttenuation: true,
            });

            const sprite = new Three.Sprite(spriteMaterial);

            const worldHeight = 3.5;
            sprite.scale.set(worldHeight * aspectRatio, worldHeight, 1);
            sprite.position.set(node.position.x, node.position.y + 4, node.position.z);

            textGroup.add(sprite);
        });

        return () => {
            while (textGroup.children.length > 0) {
                const child = textGroup.children[0] as Three.Sprite;
                if (child.material) {
                    child.material.map?.dispose();
                    child.material.dispose();
                }
                textGroup.remove(child);
            }
        };
    }, [nodes, titleColor]);

    return (
        <group>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, nodes.length]}
                onPointerDown={(e) => {
                    e.stopPropagation();

                    if (e.instanceId !== undefined) {
                        const clickNode = nodes[e.instanceId];

                        if (clickNode) {
                            onNodeClickEvent(clickNode);
                        }
                    }
                }}
            >
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial />
            </instancedMesh>
            {selectedNode && selectedNode.position && (
                <mesh position={[selectedNode.position.x, selectedNode.position.y, selectedNode.position.z]}>
                    <sphereGeometry args={[2.7, 32, 32]} />

                    <meshBasicMaterial
                        color="#A748FF"
                        side={Three.BackSide}
                        toneMapped={false}
                        transparent={true}  // 1. 투명도 기능을 쓰겠다고 선언 (필수)
                        opacity={0.6}       // 2. 알파값 지정 (0.0은 완전 투명, 1.0은 완전 불투명. 원하는 만큼 조절해)
                    />

                </mesh>
            )}
            <group ref={textGroupRef} />
        </group>
    );
}