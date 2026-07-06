import {
    ClusterBounds,
    ClusterEdge,
    ClusterGroup,
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

function distance(a: Point3D, b: Point3D) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function centerOf(points: Point3D[]): Point3D {
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

function buildBounds(nodes: ClusterNode[]): ClusterBounds {
    if (nodes.length === 0) {
        return { center: { x: 0, y: 0, z: 0 }, radius: 24 };
    }

    const center = centerOf(nodes.map((node) => node.position));
    const radius = Math.max(
        24,
        ...nodes.map((node) => distance(center, node.position)),
    );

    return { center, radius };
}

function buildMstEdges(nodes: ClusterNode[], clusterId: number): ClusterEdge[] {
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

    const nodes: ClusterNode[] = snapshot.clusters.flatMap((cluster, clusterIndex) => {
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
            color,
            centroid: centerOf(groupNodes.map((node) => node.position)),
            nodeIds: groupNodes.map((node) => node.id),
        };
    });

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
        groups,
        edges,
        bounds: buildBounds(nodes),
    };
}
