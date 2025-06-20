interface Tetromino {
  colors: string[];
  data: number[][];
}

interface BoardCell {
  data: number;
  colors: string[];
}

interface CurrentPiece {
  data: number[][];
  colors: string[];
  x: number;
  y: number;
}

export class TetrisGame {
  private posX: number;
  private posY: number;
  private width: number;
  private height: number;
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private unitSize: number;
  private board: BoardCell[][];
  private boardWidth: number;
  private boardHeight: number;
  private curPiece: CurrentPiece;
  private lastMove: number;
  private curSpeed: number;
  private linesCleared: number;
  private level: number;
  private loseBlock: number;
  private animationFrameId: number | null = null;
  private tetrominos: Tetromino[];

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.posX = 0;
    this.posY = 0;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d')!;

    this.unitSize = 20;
    this.board = [];
    this.boardWidth = Math.floor(this.width / this.unitSize);
    this.boardHeight = Math.floor(this.height / this.unitSize);
    this.curPiece = {
      data: [],
      colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'],
      x: 0,
      y: 0,
    };
    this.lastMove = Date.now();
    this.curSpeed = 50 + Math.random() * 50;
    this.linesCleared = 0;
    this.level = 0;
    this.loseBlock = 0;

    this.tetrominos = [
      {
        // box
        colors: ['rgb(59,84,165)', 'rgb(118,137,196)', 'rgb(79,111,182)'],
        data: [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // stick
        colors: ['rgb(214,30,60)', 'rgb(241,108,107)', 'rgb(236,42,75)'],
        data: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ],
      },
      {
        // z
        colors: ['rgb(88,178,71)', 'rgb(150,204,110)', 'rgb(115,191,68)'],
        data: [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 1, 1],
          [0, 0, 0, 0],
        ],
      },
      {
        // T
        colors: ['rgb(62,170,212)', 'rgb(120,205,244)', 'rgb(54,192,240)'],
        data: [
          [0, 0, 0, 0],
          [0, 1, 1, 1],
          [0, 0, 1, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // s
        colors: ['rgb(236,94,36)', 'rgb(234,154,84)', 'rgb(228,126,37)'],
        data: [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // backwards L
        colors: ['rgb(220,159,39)', 'rgb(246,197,100)', 'rgb(242,181,42)'],
        data: [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        // L
        colors: ['rgb(158,35,126)', 'rgb(193,111,173)', 'rgb(179,63,151)'],
        data: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ],
      },
    ];

    this.init();
  }

  private init() {
    this.curPiece = {
      data: [],
      colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'],
      x: 0,
      y: 0,
    };

    this.lastMove = Date.now();
    this.curSpeed = 50 + Math.random() * 50;
    this.linesCleared = 0;
    this.level = 0;
    this.loseBlock = 0;

    // init the board
    this.board = [];
    const halfHeight = this.boardHeight / 2;

    for (let x = 0; x <= this.boardWidth; x++) {
      this.board[x] = [];
      for (let y = 0; y <= this.boardHeight; y++) {
        this.board[x][y] = {
          data: 0,
          colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'],
        };

        if (Math.random() > 0.15 && y > halfHeight) {
          this.board[x][y] = {
            data: 1,
            colors:
              this.tetrominos[
                Math.floor(Math.random() * this.tetrominos.length)
              ].colors,
          };
        }
      }
    }

    // collapse the board a bit
    for (let x = 0; x <= this.boardWidth; x++) {
      for (let y = this.boardHeight - 1; y > -1; y--) {
        if (this.board[x][y].data === 0 && y > 0) {
          for (let yy = y; yy > 0; yy--) {
            if (this.board[x][yy - 1].data) {
              this.board[x][yy].data = 1;
              this.board[x][yy].colors = this.board[x][yy - 1].colors;
              this.board[x][yy - 1].data = 0;
              this.board[x][yy - 1].colors = [
                'rgb(0,0,0)',
                'rgb(0,0,0)',
                'rgb(0,0,0)',
              ];
            }
          }
        }
      }
    }

    // render the board
    this.checkLines();
    this.renderBoard();

    // assign the first tetromino
    this.newTetromino();
    this.update();
  }

  private update() {
    if (!this.checkMovement(this.curPiece, 0, 1)) {
      if (this.curPiece.y < -1) {
        // you lose
        this.loseScreen();
        return;
      } else {
        this.fillBoard(this.curPiece);
        this.newTetromino();
      }
    } else {
      if (Date.now() > this.lastMove) {
        this.lastMove = Date.now() + this.curSpeed;
        if (this.checkMovement(this.curPiece, 0, 1)) {
          this.curPiece.y++;
        } else {
          this.fillBoard(this.curPiece);
          this.newTetromino();
        }
      }
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(() => this.update());
  }

  private renderBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let x = 0; x <= this.boardWidth; x++) {
      for (let y = 0; y <= this.boardHeight; y++) {
        if (this.board[x][y].data !== 0) {
          const bX = x * this.unitSize;
          const bY = y * this.unitSize;

          this.ctx.fillStyle = this.board[x][y].colors[0];
          this.ctx.fillRect(bX, bY, this.unitSize, this.unitSize);

          this.ctx.fillStyle = this.board[x][y].colors[1];
          this.ctx.fillRect(
            bX + 2,
            bY + 2,
            this.unitSize - 4,
            this.unitSize - 4,
          );

          this.ctx.fillStyle = this.board[x][y].colors[2];
          this.ctx.fillRect(
            bX + 4,
            bY + 4,
            this.unitSize - 8,
            this.unitSize - 8,
          );
        }
      }
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderBoard();

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.curPiece.data[x][y] === 1) {
          const xPos = (this.curPiece.x + x) * this.unitSize;
          const yPos = (this.curPiece.y + y) * this.unitSize;

          if (yPos > -1) {
            this.ctx.fillStyle = this.curPiece.colors[0];
            this.ctx.fillRect(xPos, yPos, this.unitSize, this.unitSize);

            this.ctx.fillStyle = this.curPiece.colors[1];
            this.ctx.fillRect(
              xPos + 2,
              yPos + 2,
              this.unitSize - 4,
              this.unitSize - 4,
            );

            this.ctx.fillStyle = this.curPiece.colors[2];
            this.ctx.fillRect(
              xPos + 4,
              yPos + 4,
              this.unitSize - 8,
              this.unitSize - 8,
            );
          }
        }
      }
    }
  }

  private checkMovement(
    curPiece: CurrentPiece,
    newX: number,
    newY: number,
  ): boolean {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (curPiece.data[x][y] === 1) {
          if (!this.board[curPiece.x + x + newX]) {
            this.board[curPiece.x + x + newX] = [];
          }

          if (!this.board[curPiece.x + x + newX][y + curPiece.y + newY]) {
            this.board[curPiece.x + x + newX][y + curPiece.y + newY] = {
              data: 0,
              colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'],
            };
          }

          if (
            curPiece.x + x + newX >= this.boardWidth ||
            curPiece.x + x + newX < 0 ||
            this.board[curPiece.x + x + newX][y + curPiece.y + newY].data === 1
          ) {
            return false;
          }

          if (curPiece.y + y + newY > this.boardHeight) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private checkLines() {
    let y = this.boardHeight + 1;
    while (y--) {
      let lines = 0;
      for (let x = 0; x <= this.boardWidth; x++) {
        if (this.board[x][y].data === 1) {
          lines++;
        }
      }

      if (lines === this.boardWidth) {
        this.linesCleared++;
        this.level = Math.round(this.linesCleared / 20) * 20;

        let lineY = y;
        while (lineY) {
          for (let x = 0; x <= this.boardWidth; x++) {
            if (lineY - 1 > 0) {
              this.board[x][lineY].data = this.board[x][lineY - 1].data;
              this.board[x][lineY].colors = this.board[x][lineY - 1].colors;
            }
          }
          lineY--;
        }
        y++;
      }
    }
  }

  private loseScreen() {
    const y = this.boardHeight - this.loseBlock;

    for (let x = 0; x < this.boardWidth; x++) {
      const bX = x * this.unitSize;
      const bY = y * this.unitSize;

      this.ctx.fillStyle = 'rgb(80,80,80)';
      this.ctx.fillRect(bX, bY, this.unitSize, this.unitSize);

      this.ctx.fillStyle = 'rgb(150,150,150)';
      this.ctx.fillRect(bX + 2, bY + 2, this.unitSize - 4, this.unitSize - 4);

      this.ctx.fillStyle = 'rgb(100,100,100)';
      this.ctx.fillRect(bX + 4, bY + 4, this.unitSize - 8, this.unitSize - 8);
    }

    if (this.loseBlock <= this.boardHeight + 1) {
      this.loseBlock++;
      this.animationFrameId = requestAnimationFrame(() => this.loseScreen());
    } else {
      this.init();
    }
  }

  private fillBoard(curPiece: CurrentPiece) {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (curPiece.data[x][y] === 1) {
          this.board[x + curPiece.x][y + curPiece.y].data = 1;
          this.board[x + curPiece.x][y + curPiece.y].colors = curPiece.colors;
        }
      }
    }

    this.checkLines();
    this.renderBoard();
  }

  private rotateTetrimono(curPiece: CurrentPiece): number[][] {
    const rotated: number[][] = [];

    for (let x = 0; x < 4; x++) {
      rotated[x] = [];
      for (let y = 0; y < 4; y++) {
        rotated[x][y] = curPiece.data[3 - y][x];
      }
    }

    if (
      !this.checkMovement(
        {
          data: rotated,
          colors: curPiece.colors,
          x: curPiece.x,
          y: curPiece.y,
        },
        0,
        0,
      )
    ) {
      return curPiece.data;
    }

    return rotated;
  }

  private newTetromino() {
    const pieceNum = Math.floor(Math.random() * this.tetrominos.length);
    this.curPiece.data = this.tetrominos[pieceNum].data;
    this.curPiece.colors = this.tetrominos[pieceNum].colors;
    this.curPiece.x = Math.floor(
      Math.random() * (this.boardWidth - this.curPiece.data.length + 1),
    );
    this.curPiece.y = -4;
  }

  public handleKeyDown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37: // left arrow
        if (this.checkMovement(this.curPiece, -1, 0)) {
          this.curPiece.x--;
        }
        break;
      case 39: // right arrow
        if (this.checkMovement(this.curPiece, 1, 0)) {
          this.curPiece.x++;
        }
        break;
      case 40: // down arrow
        if (this.checkMovement(this.curPiece, 0, 1)) {
          this.curPiece.y++;
        }
        break;
      case 32: // space
      case 38: // up arrow
        this.curPiece.data = this.rotateTetrimono(this.curPiece);
        break;
    }
  }

  public cleanup() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
