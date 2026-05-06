import {
    CLUSTER_MARGIN,
    CLUSTER_SCALE_SCALA,
    Edge,
    GOLDEN_RADIUS,
    Graph,
    Point3D, ZERO_POINT
} from "@/components/view/@galaxyview/types";

const normalize = (point:Point3D)=>{
    const length = Math.sqrt(point.x **2 + point.y**2 + point.z **2);
    return length === 0 ? { x: 0, y: 0, z: 0 } : { x: point.x / length, y: point.y / length, z: point.z / length };
}

const multiplyScalar = (p:Point3D, s:number):Point3D =>{
    return {x:p.x*s, y:p.y*s, z:p.z*s};
}

export const GraphCoordinate = (
    {clusters, nodes, edges}:Graph
) => {
    //center of cluster
    const clusterCenters:Record<string, Point3D> = {};

    //radius of cluster
    const clusterRadius:Record<string,number> = {};

    //position of node
    const nodePoint:Record<number,Point3D> = {};

    const sortedCluster = clusters
        .sort((a,b)=> b.nodeIds.length - a.nodeIds.length);


    sortedCluster.forEach((cluster)=>{
        clusterRadius[cluster.name] = Math.sqrt(cluster.nodeIds.length) * CLUSTER_SCALE_SCALA + CLUSTER_MARGIN;
    });


    const getClusterNormalizedVector= ():Record<string, Point3D> => {
        const clusterPosition:Record<string, Point3D> = {};
        sortedCluster.forEach((cluster,index)=>{
            const clusterSize:number = cluster.nodeIds.length;

            const y = clusterSize > 1? 1-(index/(clusterSize - 1))*2: 0;

            const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));

            const theta =GOLDEN_RADIUS * index;

            clusterPosition[cluster.name] = normalize({x:Math.cos(theta)*radiusAtY,y:y, z:Math.sin(theta)*radiusAtY});

        });

        return clusterPosition
    }

    const getClusterCenterFromNormalizedVector = (clusters:Record<string,Point3D>):Record<string,Point3D> =>{
        const centers:Record<string, Point3D> = {}
        const clusterName:string[] = Object.keys(clusters);
        const centralClusterName:string = clusterName[0];
        Object.entries(clusters).forEach(([name,vector],index)=>{
            if(index === 0){
                centers[name] = ZERO_POINT;
                return;
            }

            let distance = clusterRadius[centralClusterName] + clusterRadius[name] + CLUSTER_MARGIN;

            for(let i=1; i<index; i++){
                const prevName = clusterName[i];
                const prevCenter = centers[prevName];
                const prevRadius = clusterRadius[prevName];

                const minDistance = clusterRadius[name] + prevRadius + CLUSTER_MARGIN;


                const preDistance = Math.sqrt(prevCenter.x ** 2 + prevCenter.y ** 2 + prevCenter.z ** 2);
                if (preDistance === 0) return;

                const cosTheta:number = vector.x * prevCenter.x +
                                        vector.y * prevCenter.y +
                                        vector.z * prevCenter.z

                const b = -2 * preDistance * cosTheta;
                const c = preDistance ** 2 - minDistance ** 2;
                const discriminant = b ** 2 - 4 * c;

                if (discriminant >= 0) {
                    const sol = (-b + Math.sqrt(discriminant)) / 2;
                    distance = Math.max(distance, sol);
                }
            }
            centers[name] = multiplyScalar(vector, distance);
        })

        return centers;
    }

    const getNodePosition = (clusterPosition:Record<string, Point3D>) => {
        const nodePosition:Record<string, Record<number, Point3D>> = {};
        sortedCluster.forEach((cluster)=>{

            if (cluster.nodeIds.length === 1) {
                nodePosition[cluster.name][cluster.nodeIds[0]] = { ...clusterCenters[cluster.name] };
                return;
            }

            const clusterNodeSet:Set<number> = new Set(cluster.nodeIds);

            const clusterEdges:Edge[] = edges.filter(edge=>
                clusterNodeSet.has(edge.u) && clusterNodeSet.has(edge.v));

            const adjList: Record<number, number[]> = {};
            const edgeWeights: Record<string, number> ={};

            cluster.nodeIds.forEach((edge)=>{
                adjList[edge] = []
            });

            clusterEdges.forEach(edge=>{
                adjList[edge.u].push(edge.v);
                adjList[edge.v].push(edge.u);

                const edgeKey = [edge.u, edge.v].sort().join('-');
                edgeWeights[edgeKey] = edge.w;
            });

            const rootNode = cluster.nodeIds.reduce((maxNode, node)=>
                (adjList[node].length > (adjList[maxNode].length || 0)) ? node : maxNode, cluster.nodeIds[0]
            )
            //bfs
            const visited = new Set<number>();
            const queue:[number,number | null, number][] = [];

            nodePosition[cluster.name][rootNode] = { ...clusterCenters[cluster.name] }
            visited.add(rootNode)

            const rootChildren = adjList[rootNode];
            rootChildren.forEach((child, i)=>{
                const edgeKey:string = [rootNode, child].sort().join('-');
                const w = edgeWeights[edgeKey] ?? 0.5;

            })
        })
    }
}