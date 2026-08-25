'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Badge } from '@/components/design-system/Badge';
import { Sparkles } from 'lucide-react';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'change' | 'file' | 'knowledge_area' | 'doc_page' | 'agent_knowledge';
  status?: 'definitely' | 'possibly' | 'unaffected' | 'published' | 'draft';
  category?: string;
  details?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
  label?: string;
}

export function ImpactGraph({
  onNodeClick,
  className = '',
}: {
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    // Color definitions
    const nodeColors: Record<string, string> = {
      change: '#3b63f7',
      file: '#64748b',
      knowledge_area_definitely: '#ef4444',
      knowledge_area_possibly: '#f59e0b',
      knowledge_area_unaffected: '#94a3b8',
      doc_page: '#10b981',
      agent_knowledge: '#8b5cf6',
    };

    const nodes: GraphNode[] = [
      // Root Change
      {
        id: 'change-root',
        name: 'Smart Sync Feature',
        type: 'change',
        details: 'feat(sync): introduce Smart Sync for connected documentation',
      },

      // Repo Files
      { id: 'f-settings', name: 'SmartSyncSettings.ts', type: 'file', details: 'Data model & frequency options' },
      { id: 'f-route', name: 'api/v1/sync/route.ts', type: 'file', details: 'POST endpoint & JWT auth & scopes' },
      { id: 'f-panel', name: 'SmartSyncPanel.tsx', type: 'file', details: 'User-facing settings UI component' },
      { id: 'f-test', name: 'smartSync.test.ts', type: 'file', details: 'Integration test suite' },

      // Knowledge Areas (Definitely, Possibly, Unaffected)
      {
        id: 'ka-smart-sync',
        name: 'Smart Sync',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: New feature requires full dedicated page',
      },
      {
        id: 'ka-settings',
        name: 'Project Settings',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: Needs Smart Sync configuration section',
      },
      {
        id: 'ka-permissions',
        name: 'Permissions',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: Requires project:write scope documentation',
      },
      {
        id: 'ka-api',
        name: 'API Reference',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: Needs POST /v1/sync endpoint definition',
      },
      {
        id: 'ka-getting-started',
        name: 'Getting Started',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: Quickstart guide needs Smart Sync link',
      },
      {
        id: 'ka-changelog',
        name: 'Changelog',
        type: 'knowledge_area',
        status: 'definitely',
        details: 'Definitely Affected: Needs v1.1.0 release note',
      },
      {
        id: 'ka-faq',
        name: 'FAQ',
        type: 'knowledge_area',
        status: 'possibly',
        details: 'Possibly Affected: Optional clarifying question on selective sync',
      },
      {
        id: 'ka-billing',
        name: 'Billing',
        type: 'knowledge_area',
        status: 'unaffected',
        details: 'Unaffected: Smart Sync is included across tiers',
      },

      // Doc Pages
      { id: 'doc-smartsync', name: 'docs/smart-sync', type: 'doc_page', status: 'published', details: 'Published page' },
      { id: 'doc-settings', name: 'docs/project-settings', type: 'doc_page', status: 'published', details: 'Updated page' },
      { id: 'doc-api', name: 'docs/api-reference', type: 'doc_page', status: 'published', details: 'Updated page' },

      // Agent Knowledge
      {
        id: 'agent-sync',
        name: 'Agent Knowledge Engine',
        type: 'agent_knowledge',
        details: '47 chunks indexed, embeddings updated with citations',
      },
    ];

    const links: GraphLink[] = [
      // Change to files
      { source: 'change-root', target: 'f-settings' },
      { source: 'change-root', target: 'f-route' },
      { source: 'change-root', target: 'f-panel' },
      { source: 'change-root', target: 'f-test' },

      // Files to Knowledge Areas
      { source: 'f-settings', target: 'ka-smart-sync' },
      { source: 'f-panel', target: 'ka-settings' },
      { source: 'f-route', target: 'ka-permissions' },
      { source: 'f-route', target: 'ka-api' },
      { source: 'f-test', target: 'ka-faq' },
      { source: 'change-root', target: 'ka-getting-started' },
      { source: 'change-root', target: 'ka-changelog' },
      { source: 'change-root', target: 'ka-billing' },

      // Knowledge Areas to Doc Pages
      { source: 'ka-smart-sync', target: 'doc-smartsync' },
      { source: 'ka-settings', target: 'doc-settings' },
      { source: 'ka-api', target: 'doc-api' },

      // Doc Pages to Agent Knowledge
      { source: 'doc-smartsync', target: 'agent-sync' },
      { source: 'doc-settings', target: 'agent-sync' },
      { source: 'doc-api', target: 'agent-sync' },
    ];

    // Glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 2.5]).on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
    svg.call(zoom);

    // Force Simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(70)
      )
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(28));

    // Render Links
    const link = g
      .append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d: any) => {
        if (d.target.status === 'unaffected') return '3,3';
        return 'none';
      });

    // Node container
    const dragBehavior: any = d3
      .drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = g
      .append('g')
      .selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(dragBehavior);

    // Node circles with rich styling
    node
      .append('circle')
      .attr('r', (d) => {
        if (d.type === 'change' || d.type === 'agent_knowledge') return 16;
        if (d.type === 'knowledge_area') return 13;
        return 10;
      })
      .attr('fill', (d) => {
        if (d.type === 'knowledge_area') {
          return nodeColors[`knowledge_area_${d.status || 'unaffected'}`] || '#64748b';
        }
        return nodeColors[d.type] || '#3b82f6';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('filter', (d) => (d.type === 'change' || d.type === 'agent_knowledge' ? 'url(#glow)' : 'none'))
      .style('transition', 'all 0.2s');

    // Node Labels
    node
      .append('text')
      .text((d) => d.name)
      .attr('x', 0)
      .attr('y', (d) => (d.type === 'change' || d.type === 'agent_knowledge' ? 26 : 22))
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', 'var(--text-primary)')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Click handler
    node.on('click', (_event, d) => {
      setSelectedNode(d);
      onNodeClick?.(d);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [onNodeClick]);

  return (
    <div className={`impact-graph-container ${className}`.trim()} ref={containerRef}>
      <div className="flex items-center justify-between p-4 border-b border-subtle">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand" />
          <span className="font-semibold text-sm">Interactive Impact Graph</span>
          <Badge variant="brand">Dynamic D3</Badge>
        </div>
        <span className="text-xs text-tertiary">Drag nodes to explore • Scroll to zoom</span>
      </div>

      <svg ref={svgRef} className="impact-graph-canvas" />

      {selectedNode && (
        <div className="p-4 bg-surface-2 border-t border-subtle flex items-start justify-between gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-primary">{selectedNode.name}</span>
              <Badge
                variant={
                  selectedNode.type === 'change'
                    ? 'brand'
                    : selectedNode.status === 'definitely'
                    ? 'error'
                    : selectedNode.status === 'possibly'
                    ? 'warning'
                    : selectedNode.type === 'agent_knowledge'
                    ? 'purple'
                    : 'default'
                }
              >
                {selectedNode.status ? `${selectedNode.status} affected` : selectedNode.type}
              </Badge>
            </div>
            <p className="text-xs text-secondary mt-1">{selectedNode.details || 'No additional details.'}</p>
          </div>
          <button onClick={() => setSelectedNode(null)} className="btn-ghost btn-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="impact-graph-legend">
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#3b63f7' }} />
          <span>Product Change</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#64748b' }} />
          <span>Repository Files</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#ef4444' }} />
          <span>Definitely Affected</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#f59e0b' }} />
          <span>Possibly Affected</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#94a3b8' }} />
          <span>Unaffected</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#10b981' }} />
          <span>Published Docs</span>
        </div>
        <div className="impact-graph-legend-item">
          <span className="impact-graph-legend-dot" style={{ background: '#8b5cf6' }} />
          <span>Agent Knowledge</span>
        </div>
      </div>
    </div>
  );
}
