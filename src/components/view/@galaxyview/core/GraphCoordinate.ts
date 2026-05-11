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

export const GraphCoordinate = ({ clusters, edges }: Graph) => {
    const clusterCenters: Record<string, Point3D> = {};
    const clusterRadius: Record<string, number> = {};
    const nodePoint: Record<number, Point3D> = {};

    const sortedCluster = clusters.sort((a, b) => b.nodeIds.length - a.nodeIds.length);

    //  각 클러스터의 반지름 미리 계산
    sortedCluster.forEach((cluster) => {
        clusterRadius[cluster.name] = Math.sqrt(cluster.nodeIds.length) * CLUSTER_SCALE_SCALA + CLUSTER_MARGIN;
    });

    //  클러스터 센터 배치를 위한 정규화 벡터 계산
    const getClusterNormalizedVector = (): Record<string, Point3D> => {
        const clusterPosition: Record<string, Point3D> = {};
        const count = sortedCluster.length;
        sortedCluster.forEach((cluster, index) => {
            const y = count > 1 ? 1 - (index / (count - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = GOLDEN_RADIUS * index;
            clusterPosition[cluster.name] = normalize({
                x: Math.cos(theta) * radiusAtY,
                y: y,
                z: Math.sin(theta) * radiusAtY
            });
        });
        return clusterPosition;
    };

    //  충돌을 방지하며 클러스터 중심점 확정
    const getClusterCenterFromNormalizedVector = (normalizedVectors: Record<string, Point3D>): Record<string, Point3D> => {
        const centers: Record<string, Point3D> = {};
        const clusterNames = Object.keys(normalizedVectors);
        const centralClusterName = clusterNames[0];

        clusterNames.forEach((name, index) => {
            if (index === 0) {
                centers[name] = { ...ZERO_POINT };
                return;
            }

            const vector = normalizedVectors[name];
            let distance = clusterRadius[centralClusterName] + clusterRadius[name] + CLUSTER_MARGIN;

            for (let i = 1; i < index; i++) {
                const prevName = clusterNames[i];
                const prevCenter = centers[prevName];
                const prevRadius = clusterRadius[prevName];
                const minDistance = clusterRadius[name] + prevRadius + CLUSTER_MARGIN;

                const preDistance = Math.sqrt(prevCenter.x ** 2 + prevCenter.y ** 2 + prevCenter.z ** 2);
                const cosTheta = (vector.x * prevCenter.x + vector.y * prevCenter.y + vector.z * prevCenter.z) / (preDistance || 1);

                const b = -2 * preDistance * cosTheta;
                const c = preDistance ** 2 - minDistance ** 2;
                const discriminant = b ** 2 - 4 * c;

                if (discriminant >= 0) {
                    const sol = (-b + Math.sqrt(discriminant)) / 2;
                    distance = Math.max(distance, sol);
                }
            }
            centers[name] = multiplyScalar(vector, distance);
        });
        return centers;
    };

    //  노드 배치 실행
    const getNodePosition = () => {
        sortedCluster.forEach((cluster) => {
            const center = clusterCenters[cluster.name];
            const clusterNodeSet = new Set(cluster.nodeIds);
            const clusterEdges = edges.filter(edge => clusterNodeSet.has(edge.u) && clusterNodeSet.has(edge.v));

            const adjList: Record<number, number[]> = {};
            cluster.nodeIds.forEach(id => adjList[id] = []); // adjList 초기화
            clusterEdges.forEach(edge => {
                adjList[edge.u].push(edge.v);
                adjList[edge.v].push(edge.u);
            });

            const rootNode = cluster.nodeIds.reduce((maxNode, node) =>
                (adjList[node].length > (adjList[maxNode]?.length || 0)) ? node : maxNode, cluster.nodeIds[0]
            );

            const visited = new Set<number>();
            const depthMap: Record<number, number> = {};
            const queue: number[] = [rootNode];
            const nodesByDepth: Record<number, number[]> = {};

            visited.add(rootNode);
            depthMap[rootNode] = 0;

            let head = 0;
            let maxDepth = 0;
            while (head < queue.length) {
                const currId = queue[head++];
                const currDepth = depthMap[currId];
                maxDepth = Math.max(maxDepth, currDepth);

                if (!nodesByDepth[currDepth]) nodesByDepth[currDepth] = [];
                nodesByDepth[currDepth].push(currId);

                adjList[currId].forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        depthMap[neighbor] = currDepth + 1;
                        queue.push(neighbor);
                    }
                });
            }

            for (let d = 0; d <= maxDepth; d++) {
                const depthNodes = nodesByDepth[d];
                const n = depthNodes.length;
                const shellRadius = d === 0 ? 0 : (clusterRadius[cluster.name] - CLUSTER_MARGIN) * Math.pow(d / maxDepth, 0.5);

                depthNodes.forEach((id, i) => {
                    if (d === 0) {
                        nodePoint[id] = { ...center };
                        return;
                    }
                    const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
                    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
                    const theta = GOLDEN_RADIUS * i;

                    nodePoint[id] = {
                        x: center.x + Math.cos(theta) * radiusAtY * shellRadius,
                        y: center.y + y * shellRadius,
                        z: center.z + Math.sin(theta) * radiusAtY * shellRadius
                    };
                });
            }

            // 고립 노드 처리
            cluster.nodeIds.forEach(id => {
                if (!visited.has(id)) {
                    const t = GOLDEN_RADIUS * id;
                    const r = (clusterRadius[cluster.name] - CLUSTER_MARGIN) * 0.9;
                    nodePoint[id] = {
                        x: center.x + Math.cos(t) * r,
                        y: center.y + (Math.random() - 0.5) * r * 0.2,
                        z: center.z + Math.sin(t) * r
                    };
                }
            });
        });

        return nodePoint;
    };

    const normalizedVectors = getClusterNormalizedVector();
    Object.assign(clusterCenters, getClusterCenterFromNormalizedVector(normalizedVectors));

    return getNodePosition();
};