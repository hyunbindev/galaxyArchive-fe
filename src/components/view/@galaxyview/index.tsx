import {Cluster, Edge, Graph} from "./types";
import {GraphCoordinate} from "@/components/view/@galaxyview/core/GraphCoordinate";

interface GalaxyViewProps{
    graph : Graph;
}

export default function GalaxyView({ graph }:GalaxyViewProps){
    const nodePosition = GraphCoordinate(graph);

}