import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './components/GameHeader';
import PipeCell from './components/PipeCell';
import AvailablePipe from './components/AvailablePipe';
import Modal from './components/Modal';
import { PIPE_TYPES, LEVEL_CONFIGS, rotatePipe } from './constants';

const App = () => {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [movesLeft, setMovesLeft] = useState(20);
  const [grid, setGrid] = useState([]);
  const [availablePipes, setAvailablePipes] = useState([]);
  const [selectedPipe, setSelectedPipe] = useState(null);
  const [flowActive, setFlowActive] = useState(false);
  const [flowPath, setFlowPath] = useState([]);
  const [infoMessage, setInfoMessage] = useState('Boruları yerleştir\nÇift tıkla = Döndür');

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);
  const [levelStats, setLevelStats] = useState({ score: 0, stars: 0 });

  const gridSize = LEVEL_CONFIGS[level]?.grid || 5;

  const initLevel = useCallback(() => {
    if (level >= LEVEL_CONFIGS.length) {
      setShowGameCompleteModal(true);
      return;
    }

    const config = LEVEL_CONFIGS[level];
    setMovesLeft(config.moves);
    setInfoMessage('Boruları yerleştir\nÇift tıkla = Döndür');
    setFlowActive(false);
    setFlowPath([]);
    setSelectedPipe(null);

    // Generate blocked positions
    const blockedSet = new Set();
    for (let i = 0; i < config.blocked; i++) {
      let r, c;
      do {
        r = Math.floor(Math.random() * config.grid);
        c = Math.floor(Math.random() * config.grid);
      } while (
        (r === 0 && c === 0) ||
        (r === config.grid - 1 && c === config.grid - 1) ||
        blockedSet.has(`${r},${c}`)
      );
      blockedSet.add(`${r},${c}`);
    }

    // Create grid
    const newGrid = [];
    for (let r = 0; r < config.grid; r++) {
      const row = [];
      for (let c = 0; c < config.grid; c++) {
        const cell = {
          row: r,
          col: c,
          placed: false,
          type: null,
          fixed: false,
          hasFlow: false,
          isBlocked: false
        };

        if (r === 0 && c === 0) {
          cell.placed = true;
          cell.type = PIPE_TYPES.START;
          cell.fixed = true;
        } else if (r === config.grid - 1 && c === config.grid - 1) {
          cell.placed = true;
          cell.type = PIPE_TYPES.TARGET;
          cell.fixed = true;
        } else if (blockedSet.has(`${r},${c}`)) {
          cell.isBlocked = true;
          cell.fixed = true;
        }

        row.push(cell);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);

    // Generate available pipes
    const pipes = [];
    for (let i = 0; i < config.straights; i++) {
      pipes.push({
        id: `straight-${i}`,
        type: Math.random() > 0.5 ? PIPE_TYPES.STRAIGHT_V : PIPE_TYPES.STRAIGHT_H
      });
    }
    for (let i = 0; i < config.corners; i++) {
      const corners = [PIPE_TYPES.CORNER_TR, PIPE_TYPES.CORNER_TL, PIPE_TYPES.CORNER_BR, PIPE_TYPES.CORNER_BL];
      pipes.push({
        id: `corner-${i}`,
        type: corners[Math.floor(Math.random() * corners.length)]
      });
    }
    setAvailablePipes(pipes);
  }, [level]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  const getNextPosition = (current, cellType) => {
    const { row, col, direction } = current;

    if (cellType === PIPE_TYPES.START) {
      return { row: row + 1, col, direction: 'down' };
    }

    if (cellType === PIPE_TYPES.TARGET) {
      return null;
    }

    if (cellType === PIPE_TYPES.STRAIGHT_V) {
      if (direction === 'down') return { row: row + 1, col, direction: 'down' };
      if (direction === 'up') return { row: row - 1, col, direction: 'up' };
      return null;
    }

    if (cellType === PIPE_TYPES.STRAIGHT_H) {
      if (direction === 'right') return { row, col: col + 1, direction: 'right' };
      if (direction === 'left') return { row, col: col - 1, direction: 'left' };
      return null;
    }

    if (cellType === PIPE_TYPES.CORNER_TR) {
      if (direction === 'down') return { row, col: col + 1, direction: 'right' };
      if (direction === 'left') return { row: row - 1, col, direction: 'up' };
      return null;
    }

    if (cellType === PIPE_TYPES.CORNER_TL) {
      if (direction === 'down') return { row, col: col - 1, direction: 'left' };
      if (direction === 'right') return { row: row - 1, col, direction: 'up' };
      return null;
    }

    if (cellType === PIPE_TYPES.CORNER_BR) {
      if (direction === 'up') return { row, col: col + 1, direction: 'right' };
      if (direction === 'left') return { row: row + 1, col, direction: 'down' };
      return null;
    }

    if (cellType === PIPE_TYPES.CORNER_BL) {
      if (direction === 'up') return { row, col: col - 1, direction: 'left' };
      if (direction === 'right') return { row: row + 1, col, direction: 'down' };
      return null;
    }

    return null;
  };

  const calculateFlowPath = () => {
    const path = [];
    let current = { row: 0, col: 0, direction: 'down' };
    const visited = new Set();
    path.push({ ...current });

    for (let i = 0; i < gridSize * gridSize * 2; i++) {
      const key = `${current.row},${current.col}`;
      if (visited.has(key)) break;
      visited.add(key);

      const cell = grid[current.row]?.[current.col];
      if (!cell || !cell.placed || cell.isBlocked) break;

      const next = getNextPosition(current, cell.type);
      if (!next) break;

      if (next.row === gridSize - 1 && next.col === gridSize - 1) {
        path.push(next);
        return path;
      }

      if (next.row < 0 || next.row >= gridSize || next.col < 0 || next.col >= gridSize) {
        break;
      }

      path.push(next);
      current = next;
    }

    return path;
  };

  const startFlow = () => {
    if (flowActive) return;

    const path = calculateFlowPath();
    setFlowPath(path);
    setFlowActive(true);
    setInfoMessage('Su akıyor...');

    let index = 0;
    const interval = setInterval(() => {
      if (index >= path.length) {
        clearInterval(interval);
        setFlowActive(false);

        const lastPos = path[path.length - 1];
        if (lastPos && lastPos.row === gridSize - 1 && lastPos.col === gridSize - 1) {
          handleLevelComplete();
        } else {
          setShowFailModal(true);
        }
        return;
      }

      setGrid(prev => {
        const newGrid = prev.map(row => row.map(cell => ({ ...cell, hasFlow: false })));
        for (let i = 0; i <= index; i++) {
          const p = path[i];
          if (p && newGrid[p.row]?.[p.col]) {
            newGrid[p.row][p.col].hasFlow = true;
          }
        }
        return newGrid;
      });

      index++;
    }, 166);
  };

  const handleLevelComplete = () => {
    const config = LEVEL_CONFIGS[level];
    const movesBonus = movesLeft * 100;
    const efficiency = grid.flat().filter(c => c.placed && !c.fixed).length;
    const efficiencyBonus = Math.max(0, (config.straights + config.corners - efficiency) * 50);
    const levelScore = 1000 + movesBonus + efficiencyBonus;

    let stars = 1;
    if (movesLeft >= config.moves * 0.5) stars = 3;
    else if (movesLeft >= config.moves * 0.25) stars = 2;

    setScore(prev => prev + levelScore);
    setTotalStars(prev => prev + stars);
    setLevelStats({ score: levelScore, stars });
    setShowCompleteModal(true);
  };

  const handleCellPress = (row, col) => {
    if (flowActive || movesLeft <= 0) return;

    const cell = grid[row][col];
    if (cell.fixed || cell.isBlocked) return;

    if (cell.placed && cell.type !== PIPE_TYPES.START && cell.type !== PIPE_TYPES.TARGET) {
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        newGrid[row][col].placed = false;
        const oldType = newGrid[row][col].type;
        newGrid[row][col].type = null;
        setAvailablePipes(p => [...p, { id: `returned-${Date.now()}`, type: oldType }]);
        setMovesLeft(m => m + 1);
        return newGrid;
      });
    } else if (selectedPipe && !cell.placed) {
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        newGrid[row][col].placed = true;
        newGrid[row][col].type = selectedPipe.type;
        return newGrid;
      });
      setAvailablePipes(prev => prev.filter(p => p.id !== selectedPipe.id));
      setSelectedPipe(null);
      setMovesLeft(m => m - 1);
      setInfoMessage('Boruları yerleştir\nÇift tıkla = Döndür');
    }
  };

  const handleCellRotate = (row, col) => {
    if (flowActive) return;
    const cell = grid[row][col];
    if (!cell.placed || cell.fixed || cell.type === PIPE_TYPES.START || cell.type === PIPE_TYPES.TARGET) return;
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].type = rotatePipe(newGrid[row][col].type);
      return newGrid;
    });
  };

  const handleAvailablePress = (pipe) => {
    if (flowActive) return;
    setSelectedPipe(selectedPipe?.id === pipe.id ? null : pipe);
    setInfoMessage(selectedPipe?.id === pipe.id ? 'Boruları yerleştir\nÇift tıkla = Döndür' : 'Boruyu yerleştir\nveya çift tıkla');
  };

  const handleAvailableRotate = (pipe) => {
    if (flowActive) return;
    setAvailablePipes(prev => prev.map(p => 
      p.id === pipe.id ? { ...p, type: rotatePipe(p.type) } : p
    ));
  };

  const nextLevel = () => {
    setShowCompleteModal(false);
    if (level + 1 >= LEVEL_CONFIGS.length) {
      setShowGameCompleteModal(true);
    } else {
      setLevel(prev => prev + 1);
    }
  };

  const restartGame = () => {
    setLevel(0);
    setScore(0);
    setTotalStars(0);
    setShowGameCompleteModal(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <GameHeader
          level={level + 1}
          levelName={LEVEL_CONFIGS[level]?.name || ''}
          score={score}
          moves={movesLeft}
        />
        {/* Devamında yan panel ve modallar burada olacak */}
      </div>
    </div>
  );
};

export default App;
