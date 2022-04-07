import * as React from "react";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";

export default () => {
  const [items, setItems] = React.useState([]);

  return <MasonryInfiniteGrid
    align="center"
    gap={5}
    onRequestAppend={e => {
      const nextGroupKey = (e.groupKey || 0) + 1;
      const length = items.length;

      setItems([
        ...items,
        { groupKey: nextGroupKey, key: length },
        { groupKey: nextGroupKey, key: length + 1 },
        { groupKey: nextGroupKey, key: length + 2 },
      ]);
    }}>
    {items.map((item) => {
      return <div className="item" data-grid-groupkey={item.groupKey} key={item.key}>{item.key}</div>
    })}
  </MasonryInfiniteGrid>;
}