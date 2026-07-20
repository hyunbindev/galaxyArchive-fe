import {
    ClusterBounds,
    ClusterEdge,
    ClusterGroup,
    ClusterKeywordNode,
    ClusterNode,
    ClusterScene,
    Point3D,
    UserClusterSnapshot,
} from "@/components/view/clustergraphview/type";

const CLUSTER_COLORS = [
    "#2563eb",
    "#dc2626",
    "#059669",
    "#d97706",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#ea580c",
    "#4f46e5",
];

const NOISE_COLOR = "#8a8f98";

// 클러스터 중심 사이를 살짝 벌려 서로 겹쳐 보이는 것을 줄입니다.
const CLUSTER_SPACING = 1.65;
const MAX_KEYWORDS_PER_CLUSTER = 4;

function distance(a: Point3D, b: Point3D) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function centerOf(points: Point3D[]): Point3D {
    // 점이 없을 때도 후속 계산이 깨지지 않도록 원점을 반환합니다.
    if (points.length === 0) return { x: 0, y: 0, z: 0 };

    const sum = points.reduce(
        (acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y,
            z: acc.z + point.z,
        }),
        { x: 0, y: 0, z: 0 },
    );

    return {
        x: sum.x / points.length,
        y: sum.y / points.length,
        z: sum.z / points.length,
    };
}

function buildBounds(items: { position: Point3D }[]): ClusterBounds {
    // 카메라 초기 위치 계산에 사용할 전체 scene의 중심과 반경입니다.
    if (items.length === 0) {
        return { center: { x: 0, y: 0, z: 0 }, radius: 24 };
    }

    const center = centerOf(items.map((item) => item.position));
    const radius = Math.max(
        24,
        ...items.map((item) => distance(center, item.position)),
    );

    return { center, radius };
}

function buildMstEdges(nodes: ClusterNode[], clusterId: number): ClusterEdge[] {
    // 클러스터 내부 노드를 최소한의 선으로 연결하기 위해 MST 형태의 edge를 만듭니다.
    if (nodes.length <= 1) return [];

    const visited = new Set<number>([nodes[0].id]);
    const edges: ClusterEdge[] = [];

    while (visited.size < nodes.length) {
        let best: ClusterEdge | null = null;

        for (const source of nodes) {
            if (!visited.has(source.id)) continue;

            for (const target of nodes) {
                if (visited.has(target.id)) continue;

                const weight = distance(source.position, target.position);
                if (!best || weight < best.weight) {
                    best = {
                        sourceId: source.id,
                        targetId: target.id,
                        clusterId,
                        weight,
                    };
                }
            }
        }

        if (!best) break;

        edges.push(best);
        visited.add(best.targetId);
    }

    return edges;
}

export function toClusterScene(snapshot: UserClusterSnapshot): ClusterScene {
    // 원본 임베딩 좌표 전체의 중심과 스케일을 구해 Three.js 화면에 맞는 크기로 정규화합니다.
    const rawPoints = snapshot.clusters.flatMap((cluster) =>
        cluster.clusterArticles.map((article) => ({
            x: article.x,
            y: article.y,
            z: article.z,
        })),
    );

    const rawCenter = centerOf(rawPoints);
    const maxDistance = Math.max(1, ...rawPoints.map((point) => distance(rawCenter, point)));
    const scale = 70 / maxDistance;

    // API article 데이터를 렌더링용 node로 변환하면서 색상과 정규화된 좌표를 붙입니다.
    const baseNodes: ClusterNode[] = snapshot.clusters.flatMap((cluster, clusterIndex) => {
        const color = cluster.isNoise
            ? NOISE_COLOR
            : CLUSTER_COLORS[clusterIndex % CLUSTER_COLORS.length];

        return cluster.clusterArticles.map((article) => ({
            id: article.articleId,
            title: article.title,
            clusterId: cluster.clusterId,
            label: cluster.label,
            isNoise: cluster.isNoise,
            rawPosition: {
                x: article.x,
                y: article.y,
                z: article.z,
            },
            position: {
                x: (article.x - rawCenter.x) * scale,
                y: (article.y - rawCenter.y) * scale,
                z: (article.z - rawCenter.z) * scale,
            },
            probability: article.probability,
            outlierScore: article.outlierScore,
            color,
        }));
    });

    // 클러스터 간 spacing을 적용하기 전에 각 클러스터의 현재 중심점을 계산합니다.
    const baseGroups = snapshot.clusters.map((cluster) => {
        const groupNodes = baseNodes.filter((node) => node.clusterId === cluster.clusterId);

        return {
            clusterId: cluster.clusterId,
            centroid: centerOf(groupNodes.map((node) => node.position)),
        };
    });
    const centroidByClusterId = new Map(baseGroups.map((group) => [group.clusterId, group.centroid]));

    // 클러스터 중심은 바깥쪽으로 밀되, 클러스터 내부의 상대적인 노드 배치는 유지합니다.
    const nodes: ClusterNode[] = baseNodes.map((node) => {
        const centroid = centroidByClusterId.get(node.clusterId);
        if (!centroid || node.isNoise) return node;

        return {
            ...node,
            position: {
                x: centroid.x * CLUSTER_SPACING + (node.position.x - centroid.x),
                y: centroid.y * CLUSTER_SPACING + (node.position.y - centroid.y),
                z: centroid.z * CLUSTER_SPACING + (node.position.z - centroid.z),
            },
        };
    });

    // 최종 노드 좌표를 기준으로 클러스터 메타데이터와 중심점을 다시 계산합니다.
    const groups: ClusterGroup[] = snapshot.clusters.map((cluster, clusterIndex) => {
        const groupNodes = nodes.filter((node) => node.clusterId === cluster.clusterId);
        const color = cluster.isNoise
            ? NOISE_COLOR
            : CLUSTER_COLORS[clusterIndex % CLUSTER_COLORS.length];

        return {
            clusterId: cluster.clusterId,
            label: cluster.label,
            isNoise: cluster.isNoise,
            articleCount: cluster.articleCount,
            keywords: cluster.keywords?.map((clusterKeyword)=>clusterKeyword.keyword) ??  [],
            color,
            centroid: centerOf(groupNodes.map((node) => node.position)),
            nodeIds: groupNodes.map((node) => node.id),
        };
    });
    //키워느 노드 생성
    const keywordNodes: ClusterKeywordNode[] = groups.flatMap((group) => {
        if (group.isNoise) return [];

        const radius = Math.max(5.5, Math.min(11, group.articleCount * 0.18));
        const keywords = group.keywords.slice(0, MAX_KEYWORDS_PER_CLUSTER);


        return keywords.map((keyword, keywordIndex) => {
            const angle = (Math.PI * 2 * keywordIndex) / Math.max(1, keywords.length) - Math.PI / 2;

            return {
                id: `${group.clusterId}:${keyword}`,
                clusterId: group.clusterId,
                keyword,
                position: {
                    x: group.centroid.x + Math.cos(angle) * radius,
                    y: group.centroid.y + Math.sin(angle) * radius,
                    z: group.centroid.z + (keywordIndex % 2 === 0 ? 1.2 : -1.2),
                },
                color: group.color,
            };
        });
    });

    // noise가 아닌 클러스터에만 내부 연결선을 생성합니다.
    const edges = groups.flatMap((group) =>
        group.isNoise
            ? []
            : buildMstEdges(
                nodes.filter((node) => node.clusterId === group.clusterId),
                group.clusterId,
            ),
    );

    return {
        snapshotId: snapshot.snapshotId,
        createdAt: snapshot.createdAt,
        articleCount: snapshot.articleCount,
        clusterCount: snapshot.clusterCount ?? snapshot.clustersCount ?? groups.filter((group) => !group.isNoise).length,
        nodes,
        keywordNodes,
        groups,
        edges,
        bounds: buildBounds([...nodes, ...keywordNodes]),
    };
}
