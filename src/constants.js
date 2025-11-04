export const PIPE_TYPES = {
  STRAIGHT_V: 'straight_v',
  STRAIGHT_H: 'straight_h',
  CORNER_TR: 'corner_tr',
  CORNER_TL: 'corner_tl',
  CORNER_BR: 'corner_br',
  CORNER_BL: 'corner_bl',
  START: 'start',
  TARGET: 'target',
  BLOCKED: 'blocked'
};

export const LEVEL_CONFIGS = [
  { grid: 5, straights: 6, corners: 4, moves: 20, blocked: 0, name: 'Başlangıç' },
  { grid: 6, straights: 7, corners: 5, moves: 18, blocked: 2, name: 'Kolay' },
  { grid: 7, straights: 8, corners: 6, moves: 16, blocked: 4, name: 'Orta' },
  { grid: 7, straights: 9, corners: 7, moves: 14, blocked: 6, name: 'Zor' },
  { grid: 8, straights: 10, corners: 8, moves: 12, blocked: 8, name: 'Uzman' },
  { grid: 8, straights: 11, corners: 9, moves: 10, blocked: 10, name: 'Usta' },
  { grid: 9, straights: 12, corners: 10, moves: 8, blocked: 12, name: 'Efsane' }
];

export const rotatePipe = (type) => {
  const rotations = {
    [PIPE_TYPES.STRAIGHT_V]: PIPE_TYPES.STRAIGHT_H,
    [PIPE_TYPES.STRAIGHT_H]: PIPE_TYPES.STRAIGHT_V,
    [PIPE_TYPES.CORNER_TR]: PIPE_TYPES.CORNER_BR,
    [PIPE_TYPES.CORNER_BR]: PIPE_TYPES.CORNER_BL,
    [PIPE_TYPES.CORNER_BL]: PIPE_TYPES.CORNER_TL,
    [PIPE_TYPES.CORNER_TL]: PIPE_TYPES.CORNER_TR
  };
  return rotations[type] || type;
};
