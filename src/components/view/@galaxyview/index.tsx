"use client"

import {Graph, Point3D} from "./types";
import { GraphCoordinate } from "@/components/view/@galaxyview/core/GraphCoordinate";
import { NodesRender } from "@/components/view/@galaxyview/layers/NodesRender";
import * as THREE from "three"
import { Canvas } from "@react-three/fiber";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";
import { useMemo} from "react";
import {EdgesRender} from "@/components/view/@galaxyview/layers/EdgeRender";
import {MetaDataRender} from "@/components/view/@galaxyview/layers/MetaDataRender";

interface GalaxyViewProps {
    graph: Graph | null;
}

export default function GalaxyView({ graph }: GalaxyViewProps) {
    if (!graph) return null;

    const nodePosition = useMemo(() => GraphCoordinate(graph), [graph]);

    const nodes = useMemo(() => {
        return graph.nodes.map((n) => ({
            id: n.id,
            title: n.title,
            cluster: n.cluster,
            position: nodePosition[n.id],
        }));
    }, [graph, nodePosition]);

    const nodeColor = useMemo(() => new THREE.Color("#353535"), []);
    const edgeColor = useMemo(() => new THREE.Color("#a3a3a3"), []);
    const selectedNodeColor = useMemo(() => new THREE.Color("#47857b"), []);

    return (
        <div className="w-screen h-screen">
            <Canvas gl={{ antialias: true }} className="w-full h-full">
                <OrthographicCamera
                    makeDefault
                    far={10000}
                    zoom={1}
                    position={[1200, 1200, 1200]}
                />
                <OrbitControls />
                <NodesRender nodes={nodes} nodeColor={nodeColor} selectedNodeColor={selectedNodeColor}/>
                <EdgesRender edges={graph.edges} nodePosition={nodePosition} edgeColor={edgeColor}  />
                <MetaDataRender edges={graph.edges} nodePosition={nodePosition} />
            </Canvas>
        </div>
    );
}