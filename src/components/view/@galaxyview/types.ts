import * as Three from 'three'


export const ZERO_POINT:Point3D = { x:0, y: 0,z:0 }
export const CLUSTER_SCALE_SCALA = 1200;
export const CLUSTER_MARGIN = 50;
export const GOLDEN_RADIUS = Math.PI * (3- Math.sqrt(5));


export interface Graph{
    nodes: Node[];
    edges: Edge[];
    clusters: Cluster[];
}

export interface Node{
    id:number;
    title?:string;
    cluster?:string;
    position?:Point3D;
}

export interface Point3D{
    x:number;
    y:number;
    z:number;
}

export interface Edge{
    u_title: string;
    v_title: string;
    u: number;
    v: number;
    w: number;
}

export interface Cluster{
    name:string;
    nodeIds:number[];
}


export interface GalaxyViewProps{
    graph:Graph;
    onNodeClick?: (id: number) => void;
}
