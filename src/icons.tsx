import React from 'react';
import Svg, { Circle, Path, Rect, G, Line } from 'react-native-svg';

export type IconName =
  | 'bolt'
  | 'boltFill'
  | 'briefcase'
  | 'people'
  | 'target'
  | 'user'
  | 'megaphone'
  | 'repeat'
  | 'trend'
  | 'flame'
  | 'mountain'
  | 'guitar'
  | 'ball'
  | 'route'
  | 'shield'
  | 'lock'
  | 'dice'
  | 'close'
  | 'calendar'
  | 'idea'
  | 'box'
  | 'palette'
  | 'coin'
  | 'phone'
  | 'rocket'
  | 'plus'
  | 'check'
  | 'flag'
  | 'block'
  | 'reset'
  | 'export'
  | 'pin'
  | 'clock'
  | 'link'
  | 'sliders'
  | 'share';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }: Props) {
  const s = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {render(name, s, color)}
    </Svg>
  );
}

function render(name: IconName, s: any, color: string) {
  switch (name) {
    case 'boltFill':
      return <Path d="M13 2.5 6 13.5h4.8l-1 8 7.2-11h-4.8l.8-8Z" fill={color} />;
    case 'bolt':
      return <Path d="M13 3 6.5 13h4.5l-1 8 6.5-10h-4.5L13 3Z" {...s} />;
    case 'briefcase':
      return (
        <G>
          <Rect x="4" y="8" width="16" height="11" rx="2.5" {...s} />
          <Path d="M9 8V6.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V8M4 12.5h16" {...s} />
        </G>
      );
    case 'people':
      return (
        <G>
          <Circle cx="9" cy="10" r="3.4" {...s} />
          <Path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" {...s} />
          <Circle cx="16.5" cy="8.5" r="2.6" {...s} />
          <Path d="M17.5 13.7c1.9.5 3 1.9 3.4 4.1" {...s} />
        </G>
      );
    case 'target':
      return (
        <G>
          <Circle cx="12" cy="12" r="8.2" {...s} />
          <Circle cx="12" cy="12" r="4.2" {...s} />
          <Circle cx="12" cy="12" r="1" fill={color} />
        </G>
      );
    case 'user':
      return (
        <G>
          <Circle cx="12" cy="8" r="3.6" {...s} />
          <Path d="M5 20c.8-3.6 3.5-5.4 7-5.4s6.2 1.8 7 5.4" {...s} />
        </G>
      );
    case 'megaphone':
      return (
        <G>
          <Path d="M5 10.5v3a2 2 0 0 0 2 2h1.5L16 20V4L8.5 8.5H7a2 2 0 0 0-2 2Z" {...s} />
          <Path d="M19 9.5a3.4 3.4 0 0 1 0 5M8.5 15.5l1 4.5h2.2l-.9-4.5" {...s} />
        </G>
      );
    case 'repeat':
      return (
        <G>
          <Path d="M4 12a8 8 0 0 1 13.7-5.7M20 12a8 8 0 0 1-13.7 5.7" {...s} />
          <Path d="M17.6 2.6v3.8h-3.8M6.4 21.4v-3.8h3.8" {...s} />
        </G>
      );
    case 'trend':
      return (
        <G>
          <Path d="M4 17l5-5 4 3 7-8" {...s} />
          <Path d="M15 7h5v5" {...s} />
        </G>
      );
    case 'flame':
      return (
        <Path
          d="M12 3c1 3.5-4.5 5-4.5 9.5a4.5 4.5 0 0 0 9 0c0-2-1-3.4-1.8-4.4-.9 1.1-1.5 1.6-2.5 1.7.6-2.6.3-4.8-.2-6.8Z"
          {...s}
        />
      );
    case 'mountain':
      return <Path d="M4 18 10 7l4 7 2-3 4 7H4Z" {...s} />;
    case 'guitar':
      return (
        <G>
          <Path d="M9 17.5V5.5l9-2v11" {...s} />
          <Circle cx="6.8" cy="17.5" r="2.4" {...s} />
          <Circle cx="15.8" cy="14.5" r="2.4" {...s} />
        </G>
      );
    case 'ball':
      return (
        <G>
          <Circle cx="12" cy="12" r="8.2" {...s} />
          <Path d="M12 8.6l3.2 2.3-1.2 3.8h-4l-1.2-3.8L12 8.6Z" {...s} />
        </G>
      );
    case 'route':
      return (
        <G>
          <Path d="M5 19c6 0 2-7 8-7 4.5 0 3-6 6-6" {...s} />
          <Circle cx="5" cy="19" r="1.6" {...s} />
          <Circle cx="19" cy="6" r="2" {...s} />
        </G>
      );
    case 'shield':
      return <Path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" {...s} />;
    case 'lock':
      return (
        <G>
          <Rect x="5.5" y="10.5" width="13" height="9" rx="2.5" {...s} />
          <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" {...s} />
        </G>
      );
    case 'dice':
      return (
        <G>
          <Rect x="4" y="4" width="16" height="16" rx="4.5" {...s} />
          <Circle cx="9" cy="9" r="1.1" fill={color} />
          <Circle cx="15" cy="15" r="1.1" fill={color} />
          <Circle cx="15" cy="9" r="1.1" fill={color} />
          <Circle cx="9" cy="15" r="1.1" fill={color} />
        </G>
      );
    case 'close':
      return <Path d="M5 5l14 14M19 5 5 19" {...s} strokeWidth={2.2} />;
    case 'calendar':
      return (
        <G>
          <Rect x="4" y="5.5" width="16" height="14" rx="3" {...s} />
          <Path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" {...s} />
        </G>
      );
    case 'idea':
      return (
        <G>
          <Path d="M9 17h6M10 20.5h4" {...s} />
          <Path d="M12 3a6 6 0 0 1 3.6 10.8c-.5.4-.8 1-.8 1.6H9.2c0-.6-.3-1.2-.8-1.6A6 6 0 0 1 12 3Z" {...s} />
        </G>
      );
    case 'box':
      return (
        <G>
          <Path d="M4 8.5 12 4.5l8 4v7l-8 4-8-4v-7Z" {...s} />
          <Path d="M4 8.5 12 12.5l8-4M12 12.5v7" {...s} />
        </G>
      );
    case 'palette':
      return (
        <G>
          <Path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.6-1-2.6 0-.8.7-1.4 1.6-1.4h1.6a5 5 0 0 0 5-5c0-3.5-3.7-6.3-9-6.3Z" {...s} />
          <Circle cx="8" cy="10" r="1.1" fill={color} />
          <Circle cx="12" cy="7.8" r="1.1" fill={color} />
          <Circle cx="16" cy="10" r="1.1" fill={color} />
        </G>
      );
    case 'coin':
      return (
        <G>
          <Circle cx="12" cy="12" r="8.2" {...s} />
          <Path d="M14.5 9.2c-.7-.8-1.7-1.2-2.7-1.2-2 0-3.4 1.7-3.4 4s1.4 4 3.4 4c1 0 2-.4 2.7-1.2M8 11.2h5M8 13.4h5" {...s} />
        </G>
      );
    case 'phone':
      return (
        <G>
          <Rect x="6.5" y="3" width="11" height="18" rx="3" {...s} />
          <Path d="M10.5 6.2h3" {...s} />
          <Circle cx="12" cy="17.4" r="1.1" fill={color} />
        </G>
      );
    case 'rocket':
      return (
        <G>
          <Path d="M12 3c3 2 4.5 5 4.5 8.5L12 16l-4.5-4.5C7.5 8 9 5 12 3Z" {...s} />
          <Path d="M7.5 11.5 5 13v3l2.6-1.3M16.5 11.5 19 13v3l-2.6-1.3M10.3 18.5c.5 1.3 1.1 2.2 1.7 2.7.6-.5 1.2-1.4 1.7-2.7" {...s} />
          <Circle cx="12" cy="9.4" r="1.6" {...s} />
        </G>
      );
    case 'plus':
      return <Path d="M12 5.5v13M5.5 12h13" {...s} strokeWidth={2} />;
    case 'check':
      return <Path d="M4.5 12.5 9.5 17.5 19.5 6.5" {...s} strokeWidth={2.2} />;
    case 'flag':
      return (
        <G>
          <Path d="M6 20.5V4M6 5h9.5l-1.6 3.4L15.5 12H6" {...s} />
        </G>
      );
    case 'block':
      return (
        <G>
          <Circle cx="12" cy="12" r="8.2" {...s} />
          <Line x1="6.3" y1="6.3" x2="17.7" y2="17.7" {...s} />
        </G>
      );
    case 'reset':
      return (
        <G>
          <Path d="M19.5 12a7.5 7.5 0 1 1-2.6-5.7" {...s} />
          <Path d="M20 4.2v4.3h-4.3" {...s} />
        </G>
      );
    case 'export':
      return (
        <G>
          <Path d="M12 15.5V4.5M8.4 8 12 4.5 15.6 8" {...s} />
          <Path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" {...s} />
        </G>
      );
    case 'pin':
      return (
        <G>
          <Path d="M12 21c4-4.4 6-7.6 6-10a6 6 0 1 0-12 0c0 2.4 2 5.6 6 10Z" {...s} />
          <Circle cx="12" cy="10.8" r="2.3" {...s} />
        </G>
      );
    case 'clock':
      return (
        <G>
          <Circle cx="12" cy="12" r="8.2" {...s} />
          <Path d="M12 7.4V12l3.2 2" {...s} />
        </G>
      );
    case 'link':
      return (
        <G>
          <Path d="M10 13.8a3.6 3.6 0 0 0 5.2.3l2.4-2.4a3.6 3.6 0 0 0-5.1-5.1l-1.3 1.3" {...s} />
          <Path d="M14 10.2a3.6 3.6 0 0 0-5.2-.3l-2.4 2.4a3.6 3.6 0 0 0 5.1 5.1l1.3-1.3" {...s} />
        </G>
      );
    case 'sliders':
      return (
        <G>
          <Path d="M5 7.5h14M5 12h14M5 16.5h14" {...s} />
          <Circle cx="9.5" cy="7.5" r="2" {...s} />
          <Circle cx="15" cy="12" r="2" {...s} />
          <Circle cx="8" cy="16.5" r="2" {...s} />
        </G>
      );
    case 'share':
      return (
        <G>
          <Circle cx="17.5" cy="6" r="2.6" {...s} />
          <Circle cx="6.5" cy="12" r="2.6" {...s} />
          <Circle cx="17.5" cy="18" r="2.6" {...s} />
          <Path d="M8.9 10.8 15.2 7.4M8.9 13.2l6.3 3.4" {...s} />
        </G>
      );
    default:
      return null;
  }
}
