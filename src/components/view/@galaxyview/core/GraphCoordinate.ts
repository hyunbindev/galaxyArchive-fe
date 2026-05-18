import {
    CLUSTER_MARGIN,
    CLUSTER_SCALE_SCALA,
    Edge,
    GOLDEN_RADIUS,
    Graph,
    Point3D,
    ZERO_POINT
} from "@/components/view/@galaxyview/types";

const normalize = (p: Point3D): Point3D => {
    const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    return len === 0
        ? { x: 0, y: 0, z: 0 } : { x: p.x / len, y: p.y / len, z: p.z / len };
};

const multiplyScalar = (p: Point3D, s: number): Point3D => ({
    x: p.x * s,
    y: p.y * s,
    z: p.z * s
});

export const GraphCoordinate = ({ clusters, edges }: Graph) => {
    const clusterCenters: Record<string, Point3D> = {};
    const clusterRadius: Record<string, number> = {};
    const nodePoint: Record<number, Point3D> = {};
    const nodeToClusterName: Record<number, string> = {};

    const sortedCluster = [...clusters].sort(
        (a, b) => b.nodeIds.length - a.nodeIds.length
    );

    // -----------------------------
    // cluster radius
    // -----------------------------
    sortedCluster.forEach((c) => {
        clusterRadius[c.name] =
            Math.sqrt(c.nodeIds.length) * CLUSTER_SCALE_SCALA +
            CLUSTER_MARGIN;
    });

    // -----------------------------
    // direction
    // -----------------------------
    const getDirs = () => {
        const res: Record<string, Point3D> = {};
        const n = sortedCluster.length;

        sortedCluster.forEach((c, i) => {
            const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = GOLDEN_RADIUS * i * 0.1;

            res[c.name] = normalize({
                x: Math.cos(theta) * r,
                y,
                z: Math.sin(theta) * r
            });
        });

        return res;
    };

    // -----------------------------
    // cluster centers
    // -----------------------------
    const getCenters = (dirs: Record<string, Point3D>) => {
        const centers: Record<string, Point3D> = {};
        const base = sortedCluster[0].name;

        sortedCluster.forEach((c, i) => {
            const name = c.name;

            if (i === 0) {
                centers[name] = { ...ZERO_POINT };
                return;
            }

            const dir = dirs[name];

            let dist =
                clusterRadius[base] +
                clusterRadius[name] +
                CLUSTER_MARGIN;

            for (let j = 0; j < i; j++) {
                const prev = sortedCluster[j].name;
                const prevCenter = centers[prev];

                const minDist =
                    clusterRadius[name] +
                    clusterRadius[prev] +
                    CLUSTER_MARGIN;

                const len = Math.sqrt(
                    prevCenter.x ** 2 +
                    prevCenter.y ** 2 +
                    prevCenter.z ** 2
                );

                const cos =
                    (dir.x * prevCenter.x +
                        dir.y * prevCenter.y +
                        dir.z * prevCenter.z) /
                    (len || 1);

                const b = -2 * len * cos;
                const c = len * len - minDist * minDist;
                const d = b * b - 4 * c;

                if (d >= 0) {
                    const sol = (-b + Math.sqrt(d)) / 2;
                    dist = Math.max(dist, sol);
                }
            }

            centers[name] = multiplyScalar(dir, dist);
        });

        return centers;
    };

    const centers = getCenters(getDirs());
    Object.assign(clusterCenters, centers);

    // -----------------------------
    // 4. init nodes (radius 반영)
    // -----------------------------
    const init = () => {
        const all: number[] = [];
        const nodeToCenter: Record<number, Point3D> = {};

        sortedCluster.forEach((c) => {
            const center = clusterCenters[c.name];
            const radius = clusterRadius[c.name];

            c.nodeIds.forEach((id) => {
                all.push(id);
                nodeToCenter[id] = center;
                nodeToClusterName[id] = c.name;

                nodePoint[id] = {
                    x: center.x + (Math.random() - 0.5) * radius,
                    y: center.y + (Math.random() - 0.5) * radius,
                    z: center.z + (Math.random() - 0.5) * radius
                };
            });
        });

        return { all, nodeToCenter };
    };

    const { all: ALL_NODES, nodeToCenter } = init();

    // -----------------------------
    // 5. physics constants
    // -----------------------------
    const ITERATIONS = 120;
    const REPULSION_STRENGTH = 3000;
    const ATTRACTION_STRENGTH = 0.05;
    const BASE_CENTER_GRAVITY = 0.02;
    const FRICTION = 0.78;

    const MIN_DIST = 10;

    const velocities: Record<number, Point3D> = {};
    ALL_NODES.forEach((id) => {
        velocities[id] = { x: 0, y: 0, z: 0 };
    });

    // -----------------------------
    // 6. simulation
    // -----------------------------
    for (let step = 0; step < ITERATIONS; step++) {
        const forces: Record<number, Point3D> = {};
        ALL_NODES.forEach((id) => {
            forces[id] = { x: 0, y: 0, z: 0 };
        });

        // A. repulsion
        for (let i = 0; i < ALL_NODES.length; i++) {
            for (let j = i + 1; j < ALL_NODES.length; j++) {
                const u = ALL_NODES[i];
                const v = ALL_NODES[j];

                const dx = nodePoint[u].x - nodePoint[v].x;
                const dy = nodePoint[u].y - nodePoint[v].y;
                const dz = nodePoint[u].z - nodePoint[v].z;

                const distSq = dx * dx + dy * dy + dz * dz || 0.01;
                const dist = Math.sqrt(distSq);

                const force = REPULSION_STRENGTH / distSq;

                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                const fz = (dz / dist) * force;

                forces[u].x += fx;
                forces[u].y += fy;
                forces[u].z += fz;

                forces[v].x -= fx;
                forces[v].y -= fy;
                forces[v].z -= fz;

                if (dist < MIN_DIST && dist > 0.00001) {
                    const overlap = (MIN_DIST - dist) * 0.5;

                    const nx = dx / dist;
                    const ny = dy / dist;
                    const nz = dz / dist;

                    nodePoint[u].x += nx * overlap;
                    nodePoint[u].y += ny * overlap;
                    nodePoint[u].z += nz * overlap;

                    nodePoint[v].x -= nx * overlap;
                    nodePoint[v].y -= ny * overlap;
                    nodePoint[v].z -= nz * overlap;
                }
            }
        }

        // B. spring attraction
        edges.forEach((e) => {
            const u = e.u;
            const v = e.v;

            if (!nodePoint[u] || !nodePoint[v]) return;

            const dx = nodePoint[v].x - nodePoint[u].x;
            const dy = nodePoint[v].y - nodePoint[u].y;
            const dz = nodePoint[v].z - nodePoint[u].z;

            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

            const target = 2;

            const force = ATTRACTION_STRENGTH * (dist - target);

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            const fz = (dz / dist) * force;

            forces[u].x += fx;
            forces[u].y += fy;
            forces[u].z += fz;

            forces[v].x -= fx;
            forces[v].y -= fy;
            forces[v].z -= fz;
        });

        // C. center gravity + update
        ALL_NODES.forEach((id) => {
            const pos = nodePoint[id];
            const center = nodeToCenter[id];
            const cluster = nodeToClusterName[id];

            const radius = clusterRadius[cluster];

            const gdx = center.x - pos.x;
            const gdy = center.y - pos.y;
            const gdz = center.z - pos.z;

            const gravity = BASE_CENTER_GRAVITY / (radius + 1);

            forces[id].x += gdx * gravity;
            forces[id].y += gdy * gravity;
            forces[id].z += gdz * gravity;

            velocities[id].x = (velocities[id].x + forces[id].x) * FRICTION;
            velocities[id].y = (velocities[id].y + forces[id].y) * FRICTION;
            velocities[id].z = (velocities[id].z + forces[id].z) * FRICTION;

            pos.x += velocities[id].x;
            pos.y += velocities[id].y;
            pos.z += velocities[id].z;
        });
    }

    return nodePoint;
};