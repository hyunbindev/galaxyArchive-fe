// 서버에서 내려오는 사용자 클러스터 스냅샷 원본 구조입니다.
export interface UserClusterSnapshot {
    snapshotId: number;
    userId: string;
    createdAt: string;
    clusters: UserCluster[];
    clustersCount?: number;
    clusterCount?: number;
    articleCount: number;
}

// 하나의 클러스터와 그 안에 속한 article 목록입니다.
export interface UserCluster {
    clusterId: number;
    label: number;
    articleCount: number;
    isNoise: boolean;
    clusterArticles: ClusterArticle[];
    keywords: ClusterKeyWord[];
}

export interface ClusterKeyWord {
    clusterId: number;
    keyword: string;
    similarity: number;
}

// 클러스터 그래프에서 하나의 article이 가진 원본 좌표와 메타데이터입니다.
export interface ClusterArticle {
    title: string;
    articleId: number;
    x: number;
    y: number;
    z: number;
    probability: number | null;
    outlierScore: number | null;
}

// Three.js scene에서 공통으로 사용하는 3차원 좌표 타입입니다.
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

// 렌더링에 바로 사용할 수 있도록 변환된 그래프 scene 구조입니다.
export interface ClusterScene {
    snapshotId: number;
    createdAt: string;
    articleCount: number;
    clusterCount: number;
    nodes: ClusterNode[];
    keywordNodes: ClusterKeywordNode[];
    groups: ClusterGroup[];
    edges: ClusterEdge[];
    bounds: ClusterBounds;
}

// 화면에 표시되는 article node입니다. rawPosition은 원본 좌표, position은 정규화된 렌더링 좌표입니다.
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

// 클러스터 단위 렌더링에 필요한 중심점, 색상, 포함 node id 목록입니다.
export interface ClusterGroup {
    clusterId: number;
    label: number;
    isNoise: boolean;
    articleCount: number;
    keywords: string[];
    color: string;
    centroid: Point3D;
    nodeIds: number[];
}

export interface ClusterKeywordNode {
    id: string;
    clusterId: number;
    keyword: string;
    position: Point3D;
    color: string;
}

// 같은 클러스터 안의 node 사이를 잇는 선분 정보입니다.
export interface ClusterEdge {
    sourceId: number;
    targetId: number;
    clusterId: number;
    weight: number;
}

// 전체 그래프를 카메라에 맞추기 위한 중심점과 반경입니다.
export interface ClusterBounds {
    center: Point3D;
    radius: number;
}
