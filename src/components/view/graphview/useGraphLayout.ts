import {useMemo} from "react";
import * as THREE from "three";
import {ArticleGraph, VectorEdge} from "@/components/view/graphview/ArticleGraphView";

export default function useGraphLayout({ clusters, edges }: ArticleGraph){
    //원점(0,0,0) 각성단의 중심
    const ZERO_POINT = new THREE.Vector3(0,0,0)

    const { nodePosition } = useMemo(() => {
        //성단 중심
        const clusterCenters: Record<string, THREE.Vector3> = {};
        //성단 반지름
        const clusterRadius: Record<string, number> = {}

        //노드 위치
        const nodePosition: Record<number, THREE.Vector3> = {};

        //단방향 간선
        const edgesMap: Record<number, VectorEdge> = {};

        //u->v key를 u index 로 간선 저장
        edges.forEach((edge) => {
            edgesMap[edge.u] = edge;
        });

        //성단 크기 별 내림 차순 정렬
        const sortedClusters = Object.entries(clusters)
            .sort((a, b) => b[1].length - a[1].length);

        //성단의 노드 갯수에 따른 성단 크기증가 상수
        const SCALE_VECTOR_SCALA:number = 1;
        const CLUSTER_MARGIN = 5;
        //노드 갯수에 따라 극단적으로 성단 구가 커지지 않도록
        sortedClusters.forEach(([key, nodes])=>{
            clusterRadius[key] = Math.sqrt(nodes.length) * SCALE_VECTOR_SCALA + CLUSTER_MARGIN;
        })

        //피보나치 구면을 통해 성단 방향 백터 산출을 위한 황금각 상수 (pi * (3-root5))
        const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

        const totalClusterSize = sortedClusters.length;

        //성단 중심 계산 반복문
        for (let i = 0; i < totalClusterSize; i++) {
            //성단식별 키와 노드들
            const [clusterKey, nodes] = sortedClusters[i];

            //성단 크기에 비례한 반지름
            const radius = clusterRadius[clusterKey];

            //Y축 방향 벡터 y축(높이)를 key/totalCluster size로 균등 하게 분배
            const y = totalClusterSize > 1 ? 1 - (i / (totalClusterSize - 1)) * 2: 0;

            //Y축 좌표에 따른 피타고라스 정리 단위 벡터 각도 계산
            const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
            //수직각 계산 y좌표(높이) 가 낮아 질때마다 각 증가
            const theta = GOLDEN_ANGLE*i

            //x,y,z 방향을 포함한 단위 벡터 생성
            const normalizedVector = new THREE.Vector3(Math.cos(theta)*radiusAtY,y,Math.sin(theta)*radiusAtY)
                .normalize()

            let distance = 0

            //이미 배치된 성단으로 부터 겹치지 않을지
            for(let j=0; j<i; j++){
                //이전 배치된 성단 키
                const prevID = sortedClusters[j][0];
                //이전 성단 중심
                const prevCenter = clusterCenters[prevID];

                //이전 성단 반지름
                const prevRadius = clusterRadius[prevID];
                //이전 성단과 최소 거리
                const minimumDistance = radius + prevRadius;

                //이전 성단의 중심과 원점의 거리
                const distanceToPreCenter = prevCenter.distanceTo(ZERO_POINT)

                //성단간 각
                const cosTheta = normalizedVector.dot(prevCenter.clone().normalize())

                //제2 코사인 법칙
                const b = -2 * distanceToPreCenter * cosTheta;
                const c = Math.pow(distanceToPreCenter, 2) - Math.pow(minimumDistance, 2);

                //판별식으로 실근을 갖는지
                const discriminant = b * b - 4 * c;
                if (discriminant >= 0) {
                    // 두 근 중 더 큰 값(밖으로 밀려나는 지점)을 선택
                    const sol = (-b + Math.sqrt(discriminant)) / 2;
                    // 이전 성단들과 비교해서 가장 멀리 가야 하는 원점으로부터를 저장
                    distance = Math.max(distance, sol);
                }
            }
            //성단간 최소 거리 스칼라 * 단위 벡터 위치 확정
            clusterCenters[clusterKey] = normalizedVector.clone().multiplyScalar(distance);

//-------------------------------------성단 중심 배치 끝------------------------------------

            //성단 내부 노드 배치
            const currentCenter = clusterCenters[clusterKey];
            const maxR = Math.sqrt(nodes.length) * 5;

            for (const node of nodes) {
                const u = Math.random() * 2 * Math.PI; // 0 ~ 360도
                const v = Math.acos(2 * Math.random() - 1); // 위아래 구면 각도
                const initR = maxR * Math.pow(Math.random(), 1 / 3);

                nodePosition[node] = new THREE.Vector3(
                    currentCenter.x + initR * Math.sin(v) * Math.cos(u),
                    currentCenter.y + initR * Math.sin(v) * Math.sin(u),
                    currentCenter.z + initR * Math.cos(v)
                );
            }

            // 시뮬레이션 (Relaxation): 노드 간 가중치를 거리에 반영
            const nodeSet = new Set(nodes);
            // 현재 클러스터 내부에 속한 엣지들만 싹 다 긁어옴
            const clusterEdges = edges.filter(e => nodeSet.has(e.u) && nodeSet.has(e.v));

            //척력및 인력 연산 반복
            const iterations = 50;

            for (let step = 0; step < iterations; step++) {
                // [인력/척력 적용]
                for (const edge of clusterEdges) {
                    const pU = nodePosition[edge.u];
                    const pV = nodePosition[edge.v];
                    if (!pU || !pV) continue;

                    const delta = pV.clone().sub(pU);
                    const currentDist = delta.length();
                    if (currentDist === 0) continue;

                    // 목표 거리 설정 (네 로직 응용: w에 비례 혹은 반비례)
                    // 예시: w가 작을수록(유사도가 높을수록) 거리가 짧아짐
                    const targetDist = (edge.w + 0.1) * (maxR * 0.4);

                    // 목표 거리와의 오차만큼 서로를 끌어당기거나 밀어냄
                    const force = (currentDist - targetDist) / currentDist;
                    const correction = delta.multiplyScalar(force * 0.3); // 0.3은 텐션(탄성) 조절값

                    pU.add(correction);
                    pV.sub(correction);
                }

                // 성단(maxR) 밖으로 튕겨 나간 놈들 멱살 잡고 원대복귀
                for (const node of nodes) {
                    const pos = nodePosition[node];
                    const offset = pos.clone().sub(currentCenter);
                    const dist = offset.length();

                    if (dist > maxR) {
                        offset.setLength(maxR);
                        nodePosition[node] = currentCenter.clone().add(offset);
                    } else if (dist < 1) {
                        // 중심부에 블랙홀처럼 너무 떡지는 것 방지
                        offset.setLength(1);
                        nodePosition[node] = currentCenter.clone().add(offset);
                    }
                }
            }
        }

        return { clusterCenter: clusterCenters, nodePosition: nodePosition };
    }, [clusters, edges]);

    return { nodePosition }
}