import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {Graph} from "@/components/view/articlegraphview/type";
import NodeRender from "@/components/view/articlegraphview/NodeRender";
import * as Three from "three"
import EdgeRender from "@/components/view/articlegraphview/EdgeRender";

interface ArticleGraphViewProps{
    graph:Graph|null
}

export default function ArticleGraphView({ graph }:ArticleGraphViewProps){
    if(!graph) return;

    const {clusters, nodes, edges} = graph

    return(
        <Canvas gl={{ antialias: true }} className="w-full h-full">

            <PerspectiveCamera
                makeDefault
                fov={45}                // 화각 (값이 클수록 광각렌즈처럼 원근감이 강해짐)
                near={0.1}              // 카메라가 볼 수 있는 가장 가까운 거리
                far={5000}              // 카메라가 볼 수 있는 가장 먼 거리
                position={[60, 60, 60]}
            />

            <OrbitControls />

            <NodeRender
                nodes={nodes}
                nodeColor={new Three.Color("#404040")}
            />
            <EdgeRender
                edges={edges}
                nodes={nodes}
                edgeColor={new Three.Color("#919191")}
            />

        </Canvas>

    )
}