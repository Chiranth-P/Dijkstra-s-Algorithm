document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const rows = 10;
    const cols = 10;
    const cells = [];
    let start = null;
    let end = null;
    let mode = '';
  
    // Create the grid
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
        row.push(cell);
      }
      cells.push(row);
    }
  
    // Set mode for placing start, end, or obstacles
    document.getElementById('start-btn').addEventListener('click', () => { mode = 'start'; });
    document.getElementById('end-btn').addEventListener('click', () => { mode = 'end'; });
    document.getElementById('obstacle-btn').addEventListener('click', () => { mode = 'obstacle'; });
  
    // Handle cell click to set start, end, or obstacles
    function handleCellClick(event) {
      const cell = event.target;
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
  
      if (mode === 'start') {
        if (start) cells[start[0]][start[1]].classList.remove('start');
        start = [row, col];
        cell.classList.add('start');
      } else if (mode === 'end') {
        if (end) cells[end[0]][end[1]].classList.remove('end');
        end = [row, col];
        cell.classList.add('end');
      } else if (mode === 'obstacle') {
        cell.classList.add('obstacle');
      }
    }
  
    // Find shortest path using Dijkstra's algorithm
    function findShortestPath() {
      if (!start || !end) {
        alert('Please set both start and end points.');
        return;
      }
  
      const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
      const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
      const queue = [[...start, 0]]; // [row, col, distance]
      dist[start[0]][start[1]] = 0;
  
      while (queue.length > 0) {
        queue.sort((a, b) => a[2] - b[2]);
        const [row, col, d] = queue.shift();
        if (cells[row][col].classList.contains('obstacle')) continue;
        if (row === end[0] && col === end[1]) break;
  
        const neighbors = [
          [row - 1, col],
          [row + 1, col],
          [row, col - 1],
          [row, col + 1],
        ];
  
        for (const [nRow, nCol] of neighbors) {
          if (
            nRow >= 0 &&
            nRow < rows &&
            nCol >= 0 &&
            nCol < cols &&
            d + 1 < dist[nRow][nCol]
          ) {
            dist[nRow][nCol] = d + 1;
            prev[nRow][nCol] = [row, col];
            queue.push([nRow, nCol, d + 1]);
          }
        }
      }
  
      let [row, col] = end;
      while (prev[row][col]) {
        const [pRow, pCol] = prev[row][col];
        if (!(pRow === start[0] && pCol === start[1])) {
          cells[pRow][pCol].classList.add('path');
        }
        [row, col] = [pRow, pCol];
      }
    }
  
    // Event listener for the find path button
    document.getElementById('find-path').addEventListener('click', findShortestPath);
  });
  