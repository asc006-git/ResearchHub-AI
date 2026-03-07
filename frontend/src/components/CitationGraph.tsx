import React, { useMemo } from 'react';
// @ts-ignore
import ForceGraph2D from 'react-force-graph-2d';
import { Share2 } from 'lucide-react';

interface CitationGraphProps {
    papers: any[];
}

const CitationGraph: React.FC<CitationGraphProps> = ({ papers }) => {
    const graphData = useMemo(() => {
        const nodes = papers.map(p => ({
            id: p.id,
            name: p.title,
            val: 5
        }));

        // Mocking some links for visualization since we don't have real citation data yet
        const links: any[] = [];
        if (nodes.length > 1) {
            for (let i = 1; i < nodes.length; i++) {
                links.push({
                    source: nodes[i].id,
                    target: nodes[0].id
                });
            }
        }

        return { nodes, links };
    }, [papers]);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2 text-[#38bdf8]">
                <Share2 className="h-4 w-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Citation Matrix</h3>
            </div>

            <div className="dark-card p-0 overflow-hidden h-[300px] border border-white/5 relative bg-[#0b1220]">
                {papers.length > 0 ? (
                    <ForceGraph2D
                        graphData={graphData}
                        width={300}
                        height={300}
                        backgroundColor="#0b1220"
                        nodeLabel="name"
                        nodeColor={() => '#22c1f1'}
                        linkColor={() => 'rgba(255,255,255,0.05)'}
                        nodeRelSize={6}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Insufficient data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitationGraph;
