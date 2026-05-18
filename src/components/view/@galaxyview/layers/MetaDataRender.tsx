import { Edge, Point3D } from "@/components/view/@galaxyview/types";
import { Html } from "@react-three/drei";
import { useMemo } from "react";

interface MetaDataRenderProps {
    edges: Edge[];
    nodePosition: Record<number, Point3D>;
}

export function MetaDataRender({ edges, nodePosition }: MetaDataRenderProps) {
    const titleMap = useMemo(() => {
        const titleMap: Record<number, string> = {}
        edges.forEach((edge) => {
            titleMap[edge.u] = edge.u_title
            titleMap[edge.v] = edge.v_title
        })
        return titleMap
    }, [edges])

    return (
        <>
            {Object.entries(titleMap).map(([key, title]) => {
                const pos = nodePosition[Number(key)];
                if (!pos) return null; // 위치 정보가 없을 경우 대비

                return (
                    <group key={`node-meta-${key}`} position={[pos.x, pos.y, pos.z]}>
                        <Html
                            distanceFactor={20}
                            position={[0, 20, 0]}
                            center
                            occlude
                        >
                            <div style={{
                                color: 'black',
                                borderRadius: '8px',
                                fontSize: '1px', // 1px은 너무 작을 수 있으니 상황 봐서 조절해라
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>
                                {title}
                            </div>
                        </Html>
                    </group>
                );
            })}
        </>
    );
}