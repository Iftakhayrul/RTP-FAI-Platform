import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function NetworkGraph({ clusters, selectedCluster, onSelectCluster, highlightHubs }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;

    // Clear
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < displayWidth; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, displayHeight);
      ctx.stroke();
    }
    for (let y = 0; y < displayHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(displayWidth, y);
      ctx.stroke();
    }

    if (!clusters || clusters.length === 0) return;

    // Generate node positions for each cluster
    const clusterData = clusters.map((cluster, clusterIdx) => {
      const centerX = 100 + (clusterIdx % 3) * 200;
      const centerY = 100 + Math.floor(clusterIdx / 3) * 180;
      
      const accounts = new Set();
      cluster.transfers?.forEach(t => {
        accounts.add(t.from_account);
        accounts.add(t.to_account);
      });
      
      const accountList = Array.from(accounts);
      const nodes = accountList.map((acc, i) => {
        const angle = (i / accountList.length) * Math.PI * 2;
        const radius = 50 + Math.random() * 20;
        const isHub = cluster.hub_accounts?.includes(acc);
        return {
          id: acc,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          isHub,
        };
      });

      return { ...cluster, nodes, centerX, centerY };
    });

    // Draw edges
    clusterData.forEach((cluster) => {
      const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;
      
      cluster.transfers?.forEach((transfer) => {
        const fromNode = cluster.nodes.find(n => n.id === transfer.from_account);
        const toNode = cluster.nodes.find(n => n.id === transfer.to_account);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = isSelected ? '#6366f1' : '#cbd5e1';
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();

          // Arrow
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
          const arrowX = toNode.x - Math.cos(angle) * 12;
          const arrowY = toNode.y - Math.sin(angle) * 12;
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - 6 * Math.cos(angle - Math.PI / 6),
            arrowY - 6 * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            arrowX - 6 * Math.cos(angle + Math.PI / 6),
            arrowY - 6 * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = isSelected ? '#6366f1' : '#94a3b8';
          ctx.fill();
        }
      });
    });

    // Draw nodes
    clusterData.forEach((cluster) => {
      const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;
      
      cluster.nodes.forEach((node) => {
        const size = node.isHub ? 12 : 8;
        
        // Glow for hubs
        if (node.isHub && highlightHubs) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        
        if (node.isHub) {
          ctx.fillStyle = '#ef4444';
        } else if (isSelected) {
          ctx.fillStyle = '#6366f1';
        } else {
          ctx.fillStyle = '#64748b';
        }
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Cluster label
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText(cluster.typology, cluster.centerX, cluster.centerY + 90);
    });

  }, [clusters, selectedCluster, highlightHubs]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{ minHeight: '400px' }}
    />
  );
}