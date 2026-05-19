
export interface Graph{
    clusters:Cluster[];
    edges:Edge[];
    nodes:Node[];
}

export interface Cluster{
    name: string;
    nodeIds: number[];
    position: Point3D;
}

export interface Edge{
    u:{ id:number,title:string };
    v:{ id:number,title:string };
    w:number;
}

export interface Node{
    id:number;
    title:string;
    position:Point3D;
}

export interface Point3D{
    x:number;
    y:number;
    z:number;
}
