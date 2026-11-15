import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { GeographicIntelligence, ScamOriginNode } from '../types.js';
import {
  Globe,
  Radio,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CreditCard,
  Server,
  Network,
  Info,
  X,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface GeographicThreatMapProps {
  geoData: GeographicIntelligence;
}

type RegionFilter = 'All' | 'Asia-Pacific' | 'Europe & Middle East' | 'Americas' | 'Africa';

export const GeographicThreatMap: React.FC<GeographicThreatMapProps> = ({ geoData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ScamOriginNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ScamOriginNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All');
  const [showArcs, setShowArcs] = useState(true);
  const [radarPulse, setRadarPulse] = useState(true);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 900,
    height: 460
  });

  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          const height = Math.max(360, Math.min(500, Math.round(width * 0.5)));
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredNodes = useMemo(() => {
    if (selectedRegion === 'All') return geoData.nodes;
    return geoData.nodes.filter((n) => n.region === selectedRegion);
  }, [geoData.nodes, selectedRegion]);

  const filteredArcs = useMemo(() => {
    if (!showArcs) return [];
    if (selectedRegion === 'All') return geoData.arcs;
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return geoData.arcs.filter(
      (a) => nodeIds.has(a.sourceId) || nodeIds.has(a.targetId)
    );
  }, [geoData.arcs, filteredNodes, selectedRegion, showArcs]);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 5.5)
      .translate([width / 2, height / 1.85]);

    const pathGenerator = d3.geoPath().projection(projection);
    const g = svg.append('g').attr('class', 'map-stage');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.85, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const defs = svg.append('defs');
    const arcGradient = defs
      .append('linearGradient')
      .attr('id', 'threat-arc-gradient-pink')
      .attr('gradientUnits', 'userSpaceOnUse');
    arcGradient.append('stop').attr('offset', '0%').attr('stop-color', '#E94D9B').attr('stop-opacity', '0.85');
    arcGradient.append('stop').attr('offset', '50%').attr('stop-color', '#C92D7D').attr('stop-opacity', '0.95');
    arcGradient.append('stop').attr('offset', '100%').attr('stop-color', '#E5484D').attr('stop-opacity', '0.85');

    // Light Rose-White Ocean Backdrop
    g.append('rect')
      .attr('width', width * 3)
      .attr('height', height * 3)
      .attr('x', -width)
      .attr('y', -height)
      .attr('fill', '#FFF8FC');

    const graticule = d3.geoGraticule10();
    g.append('path')
      .datum(graticule)
      .attr('d', (d: any) => pathGenerator(d) || '')
      .attr('fill', 'none')
      .attr('stroke', '#F0E5EC')
      .attr('stroke-width', 0.7)
      .attr('stroke-dasharray', '2,4');

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as any;

    g.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', (d: any) => pathGenerator(d) || '')
      .attr('fill', '#F6E8F1')
      .attr('stroke', '#E7D2DF')
      .attr('stroke-width', 0.7)
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#FCE7F3');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#F6E8F1');
      });

    if (showArcs && filteredArcs.length > 0) {
      const arcsGroup = g.append('g').attr('class', 'arcs-layer');

      filteredArcs.forEach((arc) => {
        const source = projection(arc.sourceCoords);
        const target = projection(arc.targetCoords);
        if (!source || !target) return;

        const [sx, sy] = source;
        const [tx, ty] = target;
        const dx = tx - sx;
        const dy = ty - sy;
        const dr = Math.sqrt(dx * dx + dy * dy);
        const bend = Math.min(dr * 0.35, 90);
        const mx = (sx + tx) / 2 - (dy / dr) * bend;
        const my = (sy + ty) / 2 + (dx / dr) * bend;

        const pathD = `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`;

        arcsGroup
          .append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', '#E94D9B')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.18)
          .attr('stroke-linecap', 'round');

        arcsGroup
          .append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', 'url(#threat-arc-gradient-pink)')
          .attr('stroke-width', 1.6)
          .attr('stroke-opacity', 0.85)
          .attr('stroke-dasharray', '5,5')
          .append('title')
          .text(`${arc.label} (${arc.transitType})`);
      });
    }

    const nodesGroup = g.append('g').attr('class', 'nodes-layer');

    filteredNodes.forEach((node) => {
      const coords = projection([node.longitude, node.latitude]);
      if (!coords) return;
      const [cx, cy] = coords;

      const nodeG = nodesGroup
        .append('g')
        .attr('class', 'origin-node-group cursor-pointer')
        .attr('transform', `translate(${cx}, ${cy})`)
        .on('click', () => {
          setSelectedNode(node);
        })
        .on('mouseenter', (event) => {
          setHoveredNode(node);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
            });
          }
        })
        .on('mouseleave', () => {
          setHoveredNode(null);
          setTooltipPos(null);
        });

      const color =
        node.severity === 'CRITICAL'
          ? '#E5484D'
          : node.severity === 'HIGH'
          ? '#E99A24'
          : '#E94D9B';

      const baseRadius = Math.max(
        5.5,
        Math.min(12, Math.round(Math.sqrt(node.incidentCount) / 3.8))
      );

      if (radarPulse) {
        nodeG
          .append('circle')
          .attr('r', baseRadius + 7)
          .attr('fill', color)
          .attr('fill-opacity', 0.14)
          .attr('stroke', color)
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.45);
      }

      nodeG
        .append('circle')
        .attr('r', baseRadius)
        .attr('fill', color)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.8);

      nodeG
        .append('circle')
        .attr('r', 2)
        .attr('fill', '#FFFFFF');

      nodeG
        .append('text')
        .attr('x', baseRadius + 6)
        .attr('y', 3)
        .attr('fill', '#252033')
        .attr('font-size', '10px')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('font-weight', '600')
        .text(node.city.split('(')[0].trim());
    });
  }, [dimensions, filteredNodes, filteredArcs, showArcs, radarPulse]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 1.4);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
  };

  const regions: RegionFilter[] = ['All', 'Asia-Pacific', 'Europe & Middle East', 'Americas', 'Africa'];

  return (
    <div
      id="geographic-threat-visualization"
      className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F0E5EC]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#252033]">
              Geographic Threat Telemetry
            </h3>
            <span className="text-xs font-semibold text-[#E5484D] inline-flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{geoData.advisoryLevel}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777181] max-w-3xl">
            Correlated syndicate origin hubs, laundering corridors, and infrastructure clusters linked to this pattern.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs shrink-0">
          <div>
            <span className="text-[#777181] block">Correlated Incidents</span>
            <span className="text-lg font-bold font-mono tabular-nums text-[#C92D7D]">
              {geoData.totalRelatedIncidents.toLocaleString()}+
            </span>
          </div>
          <div className="pl-6 border-l border-[#F0E5EC]">
            <span className="text-[#777181] block">Active Hubs</span>
            <span className="text-lg font-bold font-mono tabular-nums text-[#252033]">
              {geoData.nodes.length} Clusters
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => {
                setSelectedRegion(reg);
                handleResetZoom();
              }}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-[#FCE7F3] border-[#E94D9B] text-[#C92D7D] font-semibold'
                  : 'bg-[#FFF8FC] border-[#F0E5EC] text-[#777181] hover:text-[#252033]'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowArcs(!showArcs)}
            className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
              showArcs
                ? 'bg-[#FCE7F3] border-[#E94D9B]/50 text-[#C92D7D]'
                : 'bg-white border-[#F0E5EC] text-[#777181]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Transit Arcs</span>
          </button>

          <button
            type="button"
            onClick={() => setRadarPulse(!radarPulse)}
            className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
              radarPulse
                ? 'bg-[#FCE7F3] border-[#E94D9B]/50 text-[#C92D7D]'
                : 'bg-white border-[#F0E5EC] text-[#777181]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Halos</span>
          </button>

          <div className="flex items-center bg-[#FFF8FC] rounded-lg border border-[#F0E5EC] p-0.5">
            <button type="button" onClick={handleZoomIn} className="p-1.5 text-[#777181] hover:text-[#252033] cursor-pointer" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={handleZoomOut} className="p-1.5 text-[#777181] hover:text-[#252033] cursor-pointer" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={handleResetZoom} className="p-1.5 text-[#777181] hover:text-[#252033] cursor-pointer" title="Reset Zoom">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div
        ref={containerRef}
        className="w-full relative rounded-xl border border-[#F0E5EC] bg-[#FFF8FC] overflow-hidden"
        style={{ minHeight: '360px', height: `${dimensions.height}px` }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
        />

        {hoveredNode && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-xl bg-white border border-[#F0E5EC] shadow-xl text-xs max-w-xs"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 10}px`
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#F0E5EC] pb-1.5 mb-1.5">
              <span className="font-bold text-[#252033]">{hoveredNode.city}</span>
              <span className="text-[#777181]">{hoveredNode.country}</span>
            </div>
            <div className="space-y-1 text-[11px] text-[#777181]">
              <div>Classification: <strong className="text-[#252033]">{hoveredNode.hubType}</strong></div>
              <div>Incidents: <strong className="text-[#C92D7D] font-mono">{hoveredNode.incidentCount.toLocaleString()}+</strong></div>
              <div>Confidence: <strong className="text-[#252033] font-mono">{hoveredNode.confidenceScore}%</strong></div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-white/92 border border-[#F0E5EC] rounded-lg px-3 py-2 text-[11px] backdrop-blur-sm flex items-center gap-3 text-[#252033] pointer-events-none shadow-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5484D]" />
            <span>Critical</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E99A24]" />
            <span>High</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E94D9B]" />
            <span>Transit</span>
          </span>
        </div>
      </div>

      {/* Selected Node Dossier or Summary */}
      {selectedNode ? (
        <div className="p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] relative space-y-3">
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 p-1.5 text-[#777181] hover:text-[#252033] rounded-lg hover:bg-white cursor-pointer"
            title="Close dossier"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-xs text-[#777181] flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#C92D7D]">{selectedNode.countryCode} Cluster</span>
            <span>·</span>
            <span className={selectedNode.severity === 'CRITICAL' ? 'text-[#E5484D] font-semibold' : 'text-[#E99A24] font-semibold'}>
              {selectedNode.severity} Risk
            </span>
            <span>·</span>
            <span className="font-mono">Confidence: {selectedNode.confidenceScore}%</span>
          </div>

          <h4 className="text-base font-bold text-[#252033]">
            {selectedNode.city}, {selectedNode.country} — {selectedNode.patternType}
          </h4>

          <p className="text-sm text-[#777181] leading-relaxed">{selectedNode.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-white border border-[#F0E5EC]">
              <span className="text-[#777181] flex items-center gap-1.5 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Primary Payment Rail</span>
              </span>
              <span className="font-semibold text-[#252033]">{selectedNode.primaryPaymentRail}</span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#F0E5EC]">
              <span className="text-[#777181] flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-[#E99A24]" />
                <span>Infrastructure</span>
              </span>
              <span className="font-semibold text-[#252033]">
                {selectedNode.infrastructureAsn || 'Rotational Proxy / Mobile SIMs'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#F0E5EC]">
              <span className="text-[#777181] flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-[#E5484D]" />
                <span>Historical Losses</span>
              </span>
              <span className="font-bold text-[#E5484D] font-mono">{selectedNode.historicalLossEstimate}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C92D7D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#252033] block">
                Cluster Summary: {geoData.activePatternCluster}
              </span>
              <p className="text-[#777181] mt-0.5 leading-relaxed">{geoData.analystSummary}</p>
            </div>
          </div>
          <div className="shrink-0 font-mono">
            <span className="text-[#777181]">Estimated global impact: </span>
            <strong className="text-[#C92D7D]">{geoData.estimatedGlobalImpact}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
