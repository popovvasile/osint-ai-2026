import type { QuartzComponent } from "@quartz-community/types";
export interface D3Config {
    drag: boolean;
    zoom: boolean;
    depth: number;
    scale: number;
    repelForce: number;
    centerForce: number;
    linkDistance: number;
    fontSize: number;
    opacityScale: number;
    removeTags: string[];
    showTags: boolean;
    focusOnHover?: boolean;
    enableRadial?: boolean;
}
/**
 * A course section. Notes carrying any of `tags` (and the `tags/<tag>` nodes
 * themselves) are coloured with `var(cssVar, fallback)` and, in the global
 * graph, pulled towards that section's cluster anchor.
 */
export interface GraphSection {
    id: string;
    label: string;
    tags: string[];
    cssVar: string;
    fallback: string;
}
export interface GraphLegendOptions {
    show: boolean;
    currentPageLabel: string;
}
export interface GraphOptions {
    localGraph?: Partial<D3Config>;
    globalGraph?: Partial<D3Config>;
    sections?: GraphSection[];
    legend?: Partial<GraphLegendOptions>;
}
export declare const defaultSections: GraphSection[];
declare const _default: (userOpts?: Partial<GraphOptions>) => QuartzComponent;
export default _default;
//# sourceMappingURL=Graph.d.ts.map