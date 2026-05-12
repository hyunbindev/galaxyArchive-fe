"use client"

import {Graph, Point3D} from "./types";
import { GraphCoordinate } from "@/components/view/@galaxyview/core/GraphCoordinate";
import { NodesRender } from "@/components/view/@galaxyview/layers/NodesRender";
import * as THREE from "three"
import { Canvas } from "@react-three/fiber";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";
import { useMemo} from "react";
interface GalaxyViewProps{
    graph : Graph|null;
}

export default function GalaxyView({ graph }: GalaxyViewProps) {
    if (!graph) return null;

    const nodePosition = useMemo(() => {
        const c = GraphCoordinate(graph);
        console.log(c)
        return GraphCoordinate(graph);
    }, [graph]);

    const nodes = useMemo(() => {

        return graph.nodes.map((n) => ({
            id: n.id,
            title: n.title,
            cluster: n.cluster,
            position: nodePosition[n.id],
        }));

    }, [graph, nodePosition]);

    return (
        <div className="w-screen h-screen">
            <Canvas gl={{ antialias: true }} className="w-full h-full">

                <OrthographicCamera
                    makeDefault
                    zoom={80}
                    position={[1000, 1000, 1000]}
                />

                <OrbitControls />

                <NodesRender
                    nodes={nodes}
                    nodeColor={new THREE.Color("#404040")}
                />

            </Canvas>
        </div>
    );
}