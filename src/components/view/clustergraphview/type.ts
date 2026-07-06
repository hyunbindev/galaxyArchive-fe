export interface UserClusterSnapshot {
    snapshotId: number;
    userId: string;
    createdAt: string;
    clusters: UserCluster[];
    clustersCount?: number;
    clusterCount?: number;
    articleCount: number;
    keyWords?: string[];
}

export interface UserCluster {
    clusterId: number;
    label: number;
    articleCount: number;
    isNoise: boolean;
    clusterArticles: ClusterArticle[];
}

export interface ClusterArticle {
    title: string;
    articleId: number;
    x: number;
    y: number;
    z: number;
    probability: number | null;
    outlierScore: number | null;
}

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface ClusterScene {
    snapshotId: number;
    createdAt: string;
    articleCount: number;
    clusterCount: number;
    nodes: ClusterNode[];
    groups: ClusterGroup[];
    edges: ClusterEdge[];
    bounds: ClusterBounds;
}

export interface ClusterNode {
    id: number;
    title: string;
    clusterId: number;
    label: number;
    isNoise: boolean;
    position: Point3D;
    rawPosition: Point3D;
    probability: number | null;
    outlierScore: number | null;
    color: string;
}

export interface ClusterGroup {
    clusterId: number;
    label: number;
    isNoise: boolean;
    articleCount: number;
    color: string;
    centroid: Point3D;
    nodeIds: number[];
}

export interface ClusterEdge {
    sourceId: number;
    targetId: number;
    clusterId: number;
    weight: number;
}

export interface ClusterBounds {
    center: Point3D;
    radius: number;
}
