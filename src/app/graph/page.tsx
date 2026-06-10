"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Layers,
  FileText,
  Cpu,
  User,
  Users,
  Terminal,
  ChevronRight,
  TrendingUp
} from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "Team" | "Project" | "Technology" | "Document" | "Person";
  x: number;
  y: number;
  details: {
    owner?: string;
    status?: string;
    description: string;
    dependencies?: string[];
    risk?: string;
  };
}

interface Link {
  source: string;
  target: string;
  label: string;
}

const INITIAL_NODES: Node[] = [
  {
    id: "node-1",
    label: "Checkout Team",
    type: "Team",
    x: 150,
    y: 150,
    details: {
      description: "Core platform group responsible for purchasing APIs, shopping cart syncs, and payment services.",
      status: "Active",
      dependencies: ["Sarah Jenkins", "Marcus Chen"]
    }
  },
  {
    id: "node-2",
    label: "Payment Service",
    type: "Technology",
    x: 350,
    y: 150,
    details: {
      owner: "Checkout Team",
      status: "Degraded Performance",
      description: "Spring Boot microservice processing credit card and bank transactions.",
      dependencies: ["AWS Infrastructure", "checkout-api-v2.md"],
      risk: "Outdated Stripe library version in use."
    }
  },
  {
    id: "node-3",
    label: "Project Phoenix",
    type: "Project",
    x: 450,
    y: 300,
    details: {
      owner: "Checkout Team",
      status: "Delayed",
      description: "Initiative to redesign checkout layout and reduce load speeds to under 1.2s.",
      dependencies: ["Payment Service"],
      risk: "Delayed by Payment Service Spec version mismatch."
    }
  },
  {
    id: "node-4",
    label: "AWS Infrastructure",
    type: "Technology",
    x: 250,
    y: 350,
    details: {
      owner: "DevOps Team",
      status: "Active",
      description: "VPC container grids in AWS ECS running on EC2 Fargate clusters.",
      dependencies: ["Security Policies"]
    }
  },
  {
    id: "node-5",
    label: "checkout-api-v2.md",
    type: "Document",
    x: 550,
    y: 120,
    details: {
      owner: "Checkout Team",
      description: "Notion document specifying endpoints, validation parameters, and webhook structures for checkout v2.",
      status: "Active"
    }
  },
  {
    id: "node-6",
    label: "Sarah Jenkins",
    type: "Person",
    x: 100,
    y: 280,
    details: {
      description: "Principal Checkout Architect. Technical Owner of Payment Service APIs.",
      status: "Active"
    }
  },
  {
    id: "node-7",
    label: "Marcus Chen",
    type: "Person",
    x: 320,
    y: 280,
    details: {
      description: "Checkout Team Lead Product Manager. Owner of Project Phoenix roadmap.",
      status: "Active"
    }
  }
];

const INITIAL_LINKS: Link[] = [
  { source: "node-1", target: "node-2", label: "owns" },
  { source: "node-2", target: "node-3", label: "blocks" },
  { source: "node-2", target: "node-4", label: "hosted on" },
  { source: "node-5", target: "node-2", label: "documents" },
  { source: "node-1", target: "node-6", label: "has member" },
  { source: "node-1", target: "node-7", label: "has member" }
];

export default function GraphExplorer() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [links, setLinks] = useState<Link[]>(INITIAL_LINKS);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-2");
  const [search, setSearch] = useState("");
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    Team: true,
    Project: true,
    Technology: true,
    Document: true,
    Person: true
  });

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Check local auth and onboarding status
    const auth = localStorage.getItem("nexus_auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    const onboarded = localStorage.getItem("nexus_onboarded");
    if (onboarded !== "true") {
      router.push("/onboarding");
      return;
    }

    // Check localStorage for uploaded docs to dynamically insert them into the graph!
    const cachedDocs = localStorage.getItem("nexus_docs");
    if (cachedDocs) {
      try {
        const docs = JSON.parse(cachedDocs);
        // Find custom uploaded docs (not default ones)
        const customDocs = docs.filter((d: { source: string }) => d.source === "Local Upload");

        if (customDocs.length > 0) {
          const newNodes: Node[] = [...INITIAL_NODES];
          const newLinks: Link[] = [...INITIAL_LINKS];

          customDocs.forEach((d: { id: string; name: string; uploadDate: string; entities: string[] }, idx: number) => {
            const docId = `custom-doc-${d.id}`;
            // Avoid adding duplicates
            if (!newNodes.some(n => n.id === docId)) {
              // Position doc node in a clean ring space
              const angle = (idx * 2 * Math.PI) / customDocs.length;
              const x = 300 + 200 * Math.cos(angle);
              const y = 200 + 150 * Math.sin(angle);

              newNodes.push({
                id: docId,
                label: d.name,
                type: "Document",
                x,
                y,
                details: {
                  owner: "Uploaded User",
                  description: `Custom indexed file uploaded on ${d.uploadDate}. Extracted entity tags: ${d.entities.join(", ")}.`,
                  status: "Active"
                }
              });

              // Link to its extracted entities if they exist on the graph
              d.entities.forEach((entity: string) => {
                const targetNode = newNodes.find(n => n.label.toLowerCase() === entity.toLowerCase());
                if (targetNode) {
                  newLinks.push({
                    source: docId,
                    target: targetNode.id,
                    label: "references"
                  });
                }
              });
            }
          });

          setTimeout(() => {
            setNodes(newNodes);
            setLinks(newLinks);
          }, 0);
        }
      } catch (e) {
        console.error("Error updating graph from cache", e);
      }
    }
  }, []);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !svgRef.current) return;

    // Get cursor relative coordinates inside SVG
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev =>
      prev.map(n => (n.id === draggedNodeId ? { ...n, x, y } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const toggleFilter = (type: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Filter nodes & links based on searches and active type filters
  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.label.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilters[n.type];
    return matchesSearch && matchesFilter;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  // Only render links between active nodes
  const filteredLinks = links.filter(l =>
    filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Knowledge Graph Explorer</h1>
          <p className="text-slate-500 text-sm">
            Semantically mapped entity graph linking teams, developers, technologies, and documents.
          </p>
        </div>
        {/* Node Filters Toolbar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(Object.keys(activeFilters) as Array<keyof typeof activeFilters>).map(type => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1.5 rounded-full border transition-all font-semibold ${
                activeFilters[type]
                  ? "bg-black text-white border-black"
                  : "bg-white text-slate-400 border-slate-200 hover:text-slate-700"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive SVG Canvas Explorer */}
        <div className="lg:col-span-2 premium-card p-0 overflow-hidden relative border border-slate-200 rounded-lg min-h-[500px]">
          {/* Header toolbar */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/95 border border-slate-200 rounded px-8 py-1 text-xs focus:outline-none focus:border-slate-400 w-44"
              />
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 text-[10px] text-slate-400 bg-white/95 px-2 py-1 rounded border font-medium">
            💡 Drag nodes to rearrange relationships
          </div>

          {/* SVG Canvas Area */}
          <svg
            ref={svgRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-[500px] select-none"
            style={{ cursor: draggedNodeId ? "grabbing" : "default" }}
          >
            {/* Draw Links/Lines */}
            {filteredLinks.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              // Compute midpoints for connection labels
              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray={link.label === "references" ? "4 4" : ""}
                  />
                  <rect
                    x={midX - 22}
                    y={midY - 7}
                    width="44"
                    height="14"
                    fill="#ffffff"
                    rx="3"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    className="fill-slate-400 font-mono font-bold"
                    style={{ fontSize: "7px" }}
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {filteredNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              let stroke = "#94a3b8";

              // Classification Colors
              switch (node.type) {
                case "Team":
                  stroke = "#0f172a"; // dark slate
                  break;
                case "Project":
                  stroke = "#64748b"; // slate
                  break;
                case "Technology":
                  stroke = "#e2e8f0"; // light slate border
                  break;
                case "Person":
                  stroke = "#000000"; // pure black border
                  break;
                case "Document":
                  stroke = "#94a3b8"; // grey
                  break;
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? "18" : "14"}
                    fill={isSelected ? "#000000" : "#ffffff"}
                    stroke={isSelected ? "#000000" : stroke}
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />
                  <text
                    y={isSelected ? "32" : "26"}
                    textAnchor="middle"
                    className={`font-semibold ${isSelected ? "fill-black font-bold" : "fill-slate-700"}`}
                    style={{ fontSize: "10px" }}
                  >
                    {node.label}
                  </text>

                  {/* Icon representations inside circle */}
                  <g transform="translate(-6, -6) scale(0.65)" className={isSelected ? "stroke-white" : "stroke-slate-700"}>
                    {node.type === "Team" && <Users className="h-4.5 w-4.5" />}
                    {node.type === "Project" && <Cpu className="h-4.5 w-4.5" />}
                    {node.type === "Technology" && <Terminal className="h-4.5 w-4.5" />}
                    {node.type === "Person" && <User className="h-4.5 w-4.5" />}
                    {node.type === "Document" && <FileText className="h-4.5 w-4.5" />}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Node Inspector</h3>

          {selectedNode ? (
            <div className="premium-card space-y-6">
              {/* Node Basic Header */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] bg-slate-100 border px-2 py-0.5 rounded font-mono font-bold text-slate-500 uppercase">
                  {selectedNode.type}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2">{selectedNode.label}</h4>
              </div>

              {/* Status or Risk alerts */}
              {selectedNode.details.status && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Operational Status</span>
                  <span className={`inline-flex items-center gap-1 mt-1 text-xs font-bold ${
                    selectedNode.details.status.toLowerCase().includes("degraded") ||
                    selectedNode.details.status.toLowerCase().includes("delay")
                      ? "text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded"
                      : "text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded"
                  }`}>
                    {selectedNode.details.status}
                  </span>
                </div>
              )}

              {/* Description */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Description</span>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">
                  {selectedNode.details.description}
                </p>
              </div>

              {/* Dependencies info */}
              {selectedNode.details.dependencies && selectedNode.details.dependencies.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Linked Connections</span>
                  <div className="mt-2 space-y-1">
                    {selectedNode.details.dependencies.map((dep, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 border border-slate-100 rounded text-xs hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                        onClick={() => {
                          const target = nodes.find(n => n.label.toLowerCase() === dep.toLowerCase());
                          if (target) setSelectedNodeId(target.id);
                        }}
                      >
                        <span>{dep}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Alert Block */}
              {selectedNode.details.risk && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded text-xs space-y-1">
                  <span className="font-bold block text-[10px] uppercase tracking-wide">Security/Operational Risk</span>
                  <p className="font-semibold leading-normal">{selectedNode.details.risk}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="premium-card p-12 text-center text-slate-400 text-xs">
              Click a node on the canvas network to inspect relationship paths.
            </div>
          )}

          {/* Quick Node statistics indicator */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white/70 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Stats</h4>
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Total Graph Nodes</span>
              <span className="font-bold text-slate-900">{nodes.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Total Relationships</span>
              <span className="font-bold text-slate-900">{links.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Graph Centrality</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 94% sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
