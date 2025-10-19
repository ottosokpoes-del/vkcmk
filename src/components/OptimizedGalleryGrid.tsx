import React, { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Optimized Gallery Grid Component
interface OptimizedGalleryGridProps {
  graders: any[];
  viewMode: 'grid' | 'list';
  GraderCard: React.ComponentType<any>;
}

export const OptimizedGalleryGrid: React.FC<OptimizedGalleryGridProps> = ({
  graders,
  viewMode,
  GraderCard
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer to load content when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('gallery-grid');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div id="gallery-grid" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <VirtualScroll
        items={graders}
        itemHeight={200}
        containerHeight={800}
        renderItem={(grader, index) => (
          <GraderCard key={grader.id} grader={grader} viewMode="list" />
        )}
        className="space-y-4"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {graders.map((grader, index) => (
        <div
          key={grader.id}
          style={{
            animationDelay: `${index * 50}ms`,
            animation: 'fadeInUp 0.5s ease-out forwards',
            opacity: 0
          }}
        >
          <GraderCard grader={grader} viewMode="grid" />
        </div>
      ))}
    </div>
  );
};
