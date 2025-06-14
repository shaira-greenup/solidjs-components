import { Component, createSignal, createEffect } from 'solid-js';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
}

interface RadialMenuProps {
  items: MenuItem[];
  x: number;
  y: number;
  show: boolean;
  onClose: () => void;
}

const RadialMenu: Component<RadialMenuProps> = (props) => {
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();
  
  const outerRadius = 120;
  const innerRadius = 30;
  const menuSize = outerRadius * 2;
  
  createEffect(() => {
    if (props.show) {
      const menu = menuRef();
      if (menu) {
        menu.style.left = `${props.x}px`;
        menu.style.top = `${props.y}px`;
      }
    }
  });

  const handleBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const createPieSlicePath = (index: number, total: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;
    
    const x1 = Math.cos(startAngle) * innerRadius + outerRadius;
    const y1 = Math.sin(startAngle) * innerRadius + outerRadius;
    const x2 = Math.cos(endAngle) * innerRadius + outerRadius;
    const y2 = Math.sin(endAngle) * innerRadius + outerRadius;
    
    const x3 = Math.cos(endAngle) * outerRadius + outerRadius;
    const y3 = Math.sin(endAngle) * outerRadius + outerRadius;
    const x4 = Math.cos(startAngle) * outerRadius + outerRadius;
    const y4 = Math.sin(startAngle) * outerRadius + outerRadius;
    
    const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0;
    
    return `M ${x1} ${y1} 
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
            Z`;
  };

  const getTextPosition = (index: number, total: number) => {
    const anglePerSlice = (2 * Math.PI) / total;
    const angle = index * anglePerSlice + anglePerSlice / 2 - Math.PI / 2;
    const textRadius = (innerRadius + outerRadius) / 2;
    const x = Math.cos(angle) * textRadius + outerRadius;
    const y = Math.sin(angle) * textRadius + outerRadius;
    return { x, y };
  };

  return (
    <div
      class={`fixed inset-0 z-50 transition-opacity duration-200 ${
        props.show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdrop}
    >
      <div
        ref={setMenuRef}
        class="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${menuSize}px`, height: `${menuSize}px` }}
      >
        <svg
          width={menuSize}
          height={menuSize}
          class="drop-shadow-lg"
        >
          {props.items.map((item, index) => {
            const textPos = getTextPosition(index, props.items.length);
            return (
              <g key={item.id}>
                <path
                  d={createPieSlicePath(index, props.items.length)}
                  class="pie-slice fill-white stroke-gray-200 stroke-2 hover:fill-blue-50 hover:stroke-blue-400 cursor-pointer transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action();
                    props.onClose();
                  }}
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  text-anchor="middle"
                  dominant-baseline="middle"
                  class="text-sm font-medium fill-gray-700 pointer-events-none select-none"
                >
                  {item.icon ? (
                    <tspan class="text-lg">{item.icon}</tspan>
                  ) : (
                    item.label
                  )}
                </text>
              </g>
            );
          })}
          
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={innerRadius}
            class="fill-gray-800 stroke-gray-600 stroke-2 shadow-lg"
          />
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={3}
            class="fill-gray-400"
          />
        </svg>
      </div>
    </div>
  );
};

export default RadialMenu;