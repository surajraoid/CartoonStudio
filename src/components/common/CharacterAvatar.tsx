import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, G } from 'react-native-svg';
import { CharacterCustomization } from '../../types';

interface CharacterAvatarProps {
  customization: CharacterCustomization;
  size?: number;
  style?: ViewStyle;
  animated?: boolean;
}

const EMOJI_MAP: Record<string, string> = {
  body1: '🟤', body2: '🟡', body3: '⚪', body4: '🟠', body5: '🟣',
  head1: '🔵', head2: '🟢', head3: '🔴', head4: '🟡', head5: '⚫',
  hair1: '💇', hair2: '👱', hair3: '🦰', hair4: '🦱', hair5: '🦳', hair6: '🦲', hair7: '👸',
  eyes1: '👁', eyes2: '😊', eyes3: '😢', eyes4: '😠', eyes5: '😲', eyes6: '😎',
  mouth1: '😄', mouth2: '😮', mouth3: '😐', mouth4: '☹️', mouth5: '😤',
  casual: '👕', formal: '👔', hero: '🦸', princess: '👸', ninja: '🥷', wizard: '🧙', robot: '🤖',
  none: '', glasses: '🕶', hat: '🎩', crown: '👑', headband: '🎀', bow: '🎀',
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  customization,
  size = 120,
  style,
}) => {
  const {
    skinColor,
    hairColor,
    eyeColor,
    outfitColor,
    backgroundColor,
    outfit,
    accessories,
    eyes,
    mouth,
    hair,
  } = customization;

  const s = size;
  const cx = s / 2;

  // Map eyes to expressions
  const eyeExpressions: Record<string, { lx: number; ly: number; rx: number; ry: number; r: number; brow: string }> = {
    eyes1: { lx: cx - 14, ly: s * 0.37, rx: cx + 14, ry: s * 0.37, r: 5, brow: 'neutral' },
    eyes2: { lx: cx - 14, ly: s * 0.37, rx: cx + 14, ry: s * 0.37, r: 5, brow: 'happy' },
    eyes3: { lx: cx - 14, ly: s * 0.39, rx: cx + 14, ry: s * 0.39, r: 5, brow: 'sad' },
    eyes4: { lx: cx - 14, ly: s * 0.36, rx: cx + 14, ry: s * 0.36, r: 5, brow: 'angry' },
    eyes5: { lx: cx - 14, ly: s * 0.37, rx: cx + 14, ry: s * 0.37, r: 6, brow: 'surprised' },
    eyes6: { lx: cx - 14, ly: s * 0.38, rx: cx + 14, ry: s * 0.38, r: 4, brow: 'cool' },
  };

  const eyeData = eyeExpressions[eyes] || eyeExpressions.eyes2;

  const mouthPaths: Record<string, string> = {
    mouth1: `M ${cx - 12} ${s * 0.55} Q ${cx} ${s * 0.64} ${cx + 12} ${s * 0.55}`,
    mouth2: `M ${cx - 8} ${s * 0.57} Q ${cx} ${s * 0.64} ${cx + 8} ${s * 0.57}`,
    mouth3: `M ${cx - 10} ${s * 0.57} L ${cx + 10} ${s * 0.57}`,
    mouth4: `M ${cx - 12} ${s * 0.60} Q ${cx} ${s * 0.52} ${cx + 12} ${s * 0.60}`,
    mouth5: `M ${cx - 12} ${s * 0.58} Q ${cx} ${s * 0.65} ${cx + 12} ${s * 0.58}`,
  };

  const hairStyles: Record<string, React.ReactNode> = {
    hair1: <Ellipse cx={cx} cy={s * 0.22} rx={s * 0.27} ry={s * 0.10} fill={hairColor} />,
    hair2: <Path d={`M ${cx - s*0.27} ${s*0.26} Q ${cx} ${s*0.08} ${cx + s*0.27} ${s*0.26}`} fill={hairColor} stroke={hairColor} strokeWidth={3} />,
    hair3: <G>
      <Ellipse cx={cx} cy={s * 0.21} rx={s * 0.28} ry={s * 0.11} fill={hairColor} />
      <Path d={`M ${cx - s*0.27} ${s*0.24} Q ${cx - s*0.35} ${s*0.55} ${cx - s*0.28} ${s*0.6}`} stroke={hairColor} strokeWidth={8} fill="none" strokeLinecap="round" />
    </G>,
    hair4: <G>
      <Ellipse cx={cx} cy={s * 0.21} rx={s * 0.28} ry={s * 0.11} fill={hairColor} />
      <Path d={`M ${cx + s*0.27} ${s*0.24} Q ${cx + s*0.35} ${s*0.55} ${cx + s*0.28} ${s*0.6}`} stroke={hairColor} strokeWidth={8} fill="none" strokeLinecap="round" />
    </G>,
    hair5: <Ellipse cx={cx} cy={s * 0.20} rx={s * 0.30} ry={s * 0.12} fill="#CCCCCC" />,
    hair6: null,
    hair7: <G>
      <Ellipse cx={cx} cy={s * 0.21} rx={s * 0.28} ry={s * 0.11} fill={hairColor} />
      <Circle cx={cx} cy={s * 0.13} r={s * 0.06} fill={hairColor} />
    </G>,
  };

  const accessoryMap: Record<string, React.ReactNode> = {
    none: null,
    glasses: <G>
      <Circle cx={cx - 14} cy={s * 0.38} r={7} fill="none" stroke="#333" strokeWidth={2} />
      <Circle cx={cx + 14} cy={s * 0.38} r={7} fill="none" stroke="#333" strokeWidth={2} />
      <Path d={`M ${cx - 7} ${s*0.38} L ${cx + 7} ${s*0.38}`} stroke="#333" strokeWidth={2} />
    </G>,
    crown: <G>
      <Path d={`M ${cx-18} ${s*0.22} L ${cx-22} ${s*0.14} L ${cx} ${s*0.18} L ${cx+22} ${s*0.14} L ${cx+18} ${s*0.22} Z`}
        fill="#FFD700" stroke="#FFA500" strokeWidth={1} />
      <Circle cx={cx} cy={s*0.17} r={3} fill="#FF6B6B" />
      <Circle cx={cx - 18} cy={s*0.22} r={2} fill="#A29BFE" />
      <Circle cx={cx + 18} cy={s*0.22} r={2} fill="#00B894" />
    </G>,
    hat: <G>
      <Rect x={cx - 22} y={s * 0.22} width={44} height={5} rx={2} fill="#2D3436" />
      <Rect x={cx - 12} y={s * 0.08} width={24} height={16} rx={3} fill="#2D3436" />
    </G>,
    headband: <Rect x={cx - s*0.28} y={s*0.26} width={s*0.56} height={6} rx={3} fill="#FF6B6B" />,
    bow: <G>
      <Path d={`M ${cx} ${s*0.24} L ${cx - 14} ${s*0.18} L ${cx} ${s*0.22} L ${cx + 14} ${s*0.18} Z`} fill="#FD79A8" />
      <Circle cx={cx} cy={s*0.22} r={4} fill="#FFD700" />
    </G>,
  };

  const outfitColors: Record<string, { primary: string; secondary: string }> = {
    casual: { primary: outfitColor, secondary: '#74B9FF' },
    formal: { primary: '#2D3436', secondary: '#636E72' },
    hero: { primary: outfitColor, secondary: '#FF6B6B' },
    princess: { primary: '#FD79A8', secondary: '#FDCB6E' },
    ninja: { primary: '#2D3436', secondary: '#636E72' },
    wizard: { primary: '#6C5CE7', secondary: '#A29BFE' },
    robot: { primary: '#74B9FF', secondary: '#DFE6E9' },
  };

  const oc = outfitColors[outfit] || { primary: outfitColor, secondary: '#74B9FF' };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Background */}
        <Circle cx={cx} cy={cx} r={cx} fill={backgroundColor} opacity={0.3} />

        {/* Body / Outfit */}
        <Ellipse cx={cx} cy={s * 0.78} rx={s * 0.28} ry={s * 0.22} fill={oc.primary} />
        {outfit === 'hero' && <Path d={`M ${cx - s*0.15} ${s*0.65} L ${cx} ${s*0.72} L ${cx + s*0.15} ${s*0.65}`}
          fill={oc.secondary} />}
        {outfit === 'wizard' && <Path d={`M ${cx} ${s*0.60} L ${cx - s*0.30} ${s*0.95} L ${cx + s*0.30} ${s*0.95} Z`}
          fill={oc.primary} opacity={0.7} />}

        {/* Neck */}
        <Rect x={cx - 8} y={s * 0.60} width={16} height={10} rx={4} fill={skinColor} />

        {/* Head */}
        <Ellipse cx={cx} cy={s * 0.36} rx={s * 0.27} ry={s * 0.24} fill={skinColor} />

        {/* Hair (behind face) */}
        {hairStyles[hair] || hairStyles.hair1}

        {/* Ears */}
        <Ellipse cx={cx - s * 0.27} cy={s * 0.38} rx={5} ry={7} fill={skinColor} />
        <Ellipse cx={cx + s * 0.27} cy={s * 0.38} rx={5} ry={7} fill={skinColor} />

        {/* Eyes */}
        <Circle cx={eyeData.lx} cy={eyeData.ly} r={eyeData.r + 2} fill="white" />
        <Circle cx={eyeData.rx} cy={eyeData.ry} r={eyeData.r + 2} fill="white" />
        <Circle cx={eyeData.lx} cy={eyeData.ly} r={eyeData.r} fill={eyeColor} />
        <Circle cx={eyeData.rx} cy={eyeData.ry} r={eyeData.r} fill={eyeColor} />
        <Circle cx={eyeData.lx + 1.5} cy={eyeData.ly - 1.5} r={1.5} fill="white" />
        <Circle cx={eyeData.rx + 1.5} cy={eyeData.ry - 1.5} r={1.5} fill="white" />

        {/* Eyebrows */}
        {eyeData.brow === 'happy' && <>
          <Path d={`M ${eyeData.lx - 6} ${eyeData.ly - 8} Q ${eyeData.lx} ${eyeData.ly - 11} ${eyeData.lx + 6} ${eyeData.ly - 8}`}
            stroke={hairColor} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d={`M ${eyeData.rx - 6} ${eyeData.ry - 8} Q ${eyeData.rx} ${eyeData.ry - 11} ${eyeData.rx + 6} ${eyeData.ry - 8}`}
            stroke={hairColor} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>}
        {eyeData.brow === 'angry' && <>
          <Path d={`M ${eyeData.lx - 7} ${eyeData.ly - 10} L ${eyeData.lx + 7} ${eyeData.ly - 7}`}
            stroke={hairColor} strokeWidth={2.5} strokeLinecap="round" />
          <Path d={`M ${eyeData.rx - 7} ${eyeData.ry - 7} L ${eyeData.rx + 7} ${eyeData.ry - 10}`}
            stroke={hairColor} strokeWidth={2.5} strokeLinecap="round" />
        </>}
        {(eyeData.brow === 'neutral' || eyeData.brow === 'cool') && <>
          <Path d={`M ${eyeData.lx - 7} ${eyeData.ly - 9} L ${eyeData.lx + 7} ${eyeData.ly - 9}`}
            stroke={hairColor} strokeWidth={2} strokeLinecap="round" />
          <Path d={`M ${eyeData.rx - 7} ${eyeData.ry - 9} L ${eyeData.rx + 7} ${eyeData.ry - 9}`}
            stroke={hairColor} strokeWidth={2} strokeLinecap="round" />
        </>}

        {/* Nose */}
        <Ellipse cx={cx} cy={s * 0.46} rx={3} ry={2} fill={skinColor} stroke="#DDD" strokeWidth={0.5} />

        {/* Mouth */}
        <Path d={mouthPaths[mouth] || mouthPaths.mouth1}
          stroke="#D63031" strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Cheeks */}
        <Ellipse cx={cx - 20} cy={s * 0.50} rx={8} ry={5} fill="#FFB8B8" opacity={0.5} />
        <Ellipse cx={cx + 20} cy={s * 0.50} rx={8} ry={5} fill="#FFB8B8" opacity={0.5} />

        {/* Accessories */}
        {accessoryMap[accessories] || null}

        {/* Arms */}
        <Ellipse cx={cx - s*0.33} cy={s*0.73} rx={7} ry={14} fill={oc.primary}
          transform={`rotate(-15, ${cx - s*0.33}, ${s*0.73})`} />
        <Ellipse cx={cx + s*0.33} cy={s*0.73} rx={7} ry={14} fill={oc.primary}
          transform={`rotate(15, ${cx + s*0.33}, ${s*0.73})`} />

        {/* Hands */}
        <Circle cx={cx - s*0.36} cy={s*0.83} r={7} fill={skinColor} />
        <Circle cx={cx + s*0.36} cy={s*0.83} r={7} fill={skinColor} />
      </Svg>
    </View>
  );
};
