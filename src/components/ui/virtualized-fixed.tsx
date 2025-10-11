import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List, VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { LoadingAnimation, SkeletonPulse } from './animated';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number | ((index: number) => number);
  height?: number;
  className?: string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  overscan?: number;
}

// Memoized item renderer
const createItemRenderer = <T,>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode
) => {
  return memo(({ index, style }: ListChildComponentProps) => (
    <div style={style}>{renderItem(items[index], index)}</div>
  ));
};

// Fixed height virtualized list
const VirtualizedList = memo(
  <T,>({
    items,
    renderItem,
    itemHeight,
    height = 400,
    className,
    loading = false,
    error,
    emptyMessage = 'No items found',
    overscan = 5,
  }: VirtualizedListProps<T>) => {
    const ItemRenderer = useMemo(() => createItemRenderer(items, renderItem), [items, renderItem]);

    // Loading state
    if (loading) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <LoadingAnimation size="lg" />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading items</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    // Empty state
    if (items.length === 0) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    const fixedHeight = typeof itemHeight === 'number' ? itemHeight : 50;

    return (
      <div className={className} style={{ height }}>
        <AutoSizer>
          {({ height: autoHeight, width }) => (
            <List
              height={autoHeight}
              width={width}
              itemCount={items.length}
              itemSize={fixedHeight}
              overscanCount={overscan}
            >
              {ItemRenderer}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }
) as <T>(props: VirtualizedListProps<T>) => JSX.Element;

export { VirtualizedList };

// Variable height virtualized list
interface VariableVirtualizedListProps<T> extends Omit<VirtualizedListProps<T>, 'itemHeight'> {
  getItemHeight: (index: number) => number;
  estimatedItemHeight?: number;
}

const VariableVirtualizedList = memo(
  <T,>({
    items,
    renderItem,
    getItemHeight,
    height = 400,
    className,
    loading = false,
    error,
    emptyMessage = 'No items found',
    overscan = 5,
    estimatedItemHeight = 50,
  }: VariableVirtualizedListProps<T>) => {
    const ItemRenderer = useMemo(() => createItemRenderer(items, renderItem), [items, renderItem]);

    const itemSizeGetter = useCallback((index: number) => getItemHeight(index), [getItemHeight]);

    // Loading state
    if (loading) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <LoadingAnimation size="lg" />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading items</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    // Empty state
    if (items.length === 0) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={className} style={{ height }}>
        <AutoSizer>
          {({ height: autoHeight, width }) => (
            <VariableSizeList
              height={autoHeight}
              width={width}
              itemCount={items.length}
              itemSize={itemSizeGetter}
              overscanCount={overscan}
              estimatedItemSize={estimatedItemHeight}
            >
              {ItemRenderer}
            </VariableSizeList>
          )}
        </AutoSizer>
      </div>
    );
  }
) as <T>(props: VariableVirtualizedListProps<T>) => JSX.Element;

export { VariableVirtualizedList };

// Grid virtualized component
interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth: number;
  itemHeight: number;
  columnCount: number;
  height?: number;
  className?: string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  gap?: number;
}

const VirtualizedGrid = memo(
  <T,>({
    items,
    renderItem,
    itemWidth,
    itemHeight,
    columnCount,
    height = 400,
    className,
    loading = false,
    error,
    emptyMessage = 'No items found',
    gap = 8,
  }: VirtualizedGridProps<T>) => {
    const rowCount = Math.ceil(items.length / columnCount);

    const GridItemRenderer = useMemo(() => {
      return memo(({ rowIndex, style }: { rowIndex: number; style: React.CSSProperties }) => (
        <div style={style} className="flex" data-testid={`grid-row-${rowIndex}`}>
          {Array.from({ length: columnCount }, (_, colIndex) => {
            const itemIndex = rowIndex * columnCount + colIndex;
            const item = items[itemIndex];

            if (!item) return null;

            return (
              <div
                key={itemIndex}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  marginRight: colIndex < columnCount - 1 ? gap : 0,
                }}
              >
                {renderItem(item, itemIndex)}
              </div>
            );
          })}
        </div>
      ));
    }, [items, renderItem, columnCount, itemWidth, itemHeight, gap]);

    // Loading state
    if (loading) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <LoadingAnimation size="lg" />
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading items</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    // Empty state
    if (items.length === 0) {
      return (
        <div className={`flex items-center justify-center h-${height} ${className}`}>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    const rowHeight = itemHeight + gap;

    return (
      <div className={className} style={{ height }}>
        <AutoSizer>
          {({ height: autoHeight, width }) => (
            <List
              height={autoHeight}
              width={width}
              itemCount={rowCount}
              itemSize={rowHeight}
              overscanCount={2}
            >
              {({ index, style }) => <GridItemRenderer rowIndex={index} style={style} />}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }
) as <T>(props: VirtualizedGridProps<T>) => JSX.Element;

export { VirtualizedGrid };

// Skeleton loader for virtualized lists
export const VirtualizedListSkeleton = memo<{
  itemHeight: number;
  itemCount?: number;
  className?: string;
}>(({ itemHeight, itemCount = 10, className }) => {
  return (
    <div className={className}>
      {Array.from({ length: itemCount }, (_, index) => (
        <div key={index} className="mb-2 rounded" style={{ height: itemHeight }}>
          <SkeletonPulse className="w-full h-full" />
        </div>
      ))}
    </div>
  );
});
