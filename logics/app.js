var App = App || {},
    $bCanvas = $('#board-canvas')[0],
    $tCanvas = $('#tile-canvas')[0],
    $nCanvas = $('#next-canvas')[0],
    time = 0,
    speed = { start: 0.6, decrement: 0.005, min: 0.1 },
    last = now =  new Date().getTime();
App.init = function(){
    this.btx = $bCanvas.getContext('2d');
    this.ttx = $tCanvas.getContext('2d');
    this.ntx = $nCanvas.getContext('2d');
    this.pieces = this.CONFIG.TILES_HELPER;
    this.colCount = $bCanvas.width / this.CONFIG.WIDTH_PER_GRID;
    this.rowCount = $bCanvas.height / this.CONFIG.WIDTH_PER_GRID;
    this.lines = 0;
    this.score = 0;
    this.actions = [];
    this.isPause = false;
    this.newTile();
    this.drawBoardLines();
    this.createBoard();
    this.bindEvent();
    this.frame();
};
App.pause = function(){
    this.isPause = !this.isPause;
    if (this.isPause){
        cancelAnimationFrame(this.requestId);
    }else{
        App.requestId = requestAnimationFrame(App.frame);
    }
};
App.clearLines = function(){
    this.lines = 0;
};
App.curSpeed = function(){
    return Math.max(speed.min, speed.start - (speed.decrement * this.lines))
};
App.animateScore = function(addScore){
    var score = $('.display-score');
    this.score += addScore
    score.animate({
       curScore: this.score
    },{
        duration: 3000,
        easing: 'linear',
        progress: function(){
            score.text(Math.ceil((this.curScore)));
        },
        complete: function(){
            score.text(this.curScore);
        }
    });
};
App.animateLine = function(addLines){
    var score = $('.display-lines');
    this.lines += addLines;
    score.animate({
        curLines: this.lines
    },{
        duration: 3000,
        easing: 'linear',
        progress: function(){
            score.text(Math.ceil((this.curLines)));
        },
        complete: function(){
            score.text(this.curLines);
        }
    });
};
App.frame = function(){
    var now = new Date().getTime();
    App.update(Math.min(1, (now - last) / 1000.00));
    if (!App.occupied(App.curRow, App.curCol)) App.drawTiles();
    else {
        alert('Game over, game will be restarted..');
        App.init();
        return;
    }
    last = now;
    App.requestId = requestAnimationFrame(App.frame);
};
App.update = function(timePass){
    time = time + timePass;
    var curSpeed = this.curSpeed();
    this.handle(this.actions.shift());
    if (time > curSpeed){
        time = time - curSpeed;
        this.drop();
    }
};
App.setBlocks = function(){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    for(var bit = curTileConfig['blocks'][this.curMovIndex]; bit > 0; bit = bit >> 1){
        if(parseInt(bit & bitCheck) == 1){
            this.setBlock(this.curRow + row - 1, this.curCol + col - 1, true);
        }
        if (--col === 0){
            col = 4;
            row--;
        }
    }
};
App.occupied = function(x, y){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    for(var bit = curTileConfig['blocks'][this.curMovIndex]; bit > 0; bit = bit >> 1){
        if(parseInt(bit & bitCheck) == 1){
            var checkRow = x + row - 1;
            var checkCol = y + col - 1;
            if (checkRow >= this.rowCount || checkCol < 0 || checkCol >= this.colCount || this.getBlock(checkRow, checkCol)){
                return true;
            }
        }
        if (--col === 0){
            col = 4;
            row--;
        }
    }
    return false;
};
App.getBlock = function(row, col){
    if (!this.board) return null;
    if (row >= this.board.length || col < 0 || col >= this.board[0].length) return null;
    return this.board[row][col];
};
App.setBlock = function(row, col, value){
    if (!this.board) return null;
    if (row < this.board.length || col >= 0 || col < this.board[0].length){
        this.board[row][col] = value;
    };
};
App.handle = function(action){
    switch(action) {
        case this.CONFIG.DIR.LEFT:  this.move(this.CONFIG.DIR.LEFT);  break;
        case this.CONFIG.DIR.RIGHT: this.move(this.CONFIG.DIR.RIGHT); break;
        case this.CONFIG.DIR.UP:    this.rotate();                    break;
        case this.CONFIG.DIR.DOWN:  this.move(this.CONFIG.DIR.DOWN);  break;
    }
};
App.drawBoardLines = function(){
    this.btx.clearRect(0, 0, $bCanvas.width, $bCanvas.height);
    this.btx.lineWidth = 0.5;
    this.btx.strokeStyle = this.CONFIG.BOARD_LINE_COLOR;
    // draw vertical
    for(var i = 0; i < this.colCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.btx.beginPath();
        this.btx.moveTo(curPos, 0);
        this.btx.lineTo(curPos, $bCanvas.height);
        this.btx.stroke();
    }
    // draw horizontal
    for (var i = 0; i < this.rowCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.btx.beginPath();
        this.btx.moveTo(0, curPos);
        this.btx.lineTo($bCanvas.width, curPos);
        this.btx.stroke();
    }
};
App.bindEvent = function(){
    var handled = false;
    $('body').keydown(function(ev){
        switch (ev.keyCode) {
            case App.CONFIG.KEY.LEFT:
                handled = true;
                App.actions.push(App.CONFIG.DIR.LEFT);
                break;
            case App.CONFIG.KEY.RIGHT:
                handled = true;
                App.actions.push(App.CONFIG.DIR.RIGHT);
                break;
            case App.CONFIG.KEY.UP:
                handled = true;
                App.actions.push(App.CONFIG.DIR.UP);
                break;
            case App.CONFIG.KEY.DOWN:
                handled = true;
                App.actions.push(App.CONFIG.DIR.DOWN);
                break;
        }
        if (handled) ev.preventDefault();
    });
    $('.restart-button').click(function(e){
        App.init();
    });
    $('.pause-button').click(function(e){
        var $target = $(e.currentTarget);
        App.pause();
        var text = App.isPause ? "Resume" : "Pause";
        $target.text(text);
    });
};
App.move = function(direction){
    var col = this.curCol;
    var row = this.curRow;
    switch (direction){
        case this.CONFIG.DIR.LEFT:col--;break;
        case this.CONFIG.DIR.RIGHT:col++;break;
        case this.CONFIG.DIR.DOWN:row++;break;
    }
    if (!this.occupied(row, col)){
        this.curCol = col;
        this.curRow = row;
        return true;
    }else{
        return false;
    }
};
App.drop = function(){
  if(!this.move(this.CONFIG.DIR.DOWN)){
      this.setBlocks();
      this.testBoard();
      this.drawBoard();
      this.newTile();
  }
};
App.rotate = function(){
    this.curMovIndex = this.curMovIndex == 3 ? 0 : this.curMovIndex + 1;
    this.drawTiles();
};
App.newTile = function(){
    this.curRow = this.CONFIG.DEFAULT_STARTING_POINT['row'];
    this.curCol = this.CONFIG.DEFAULT_STARTING_POINT['col'];
    this.curTile = this.nextTile ? this.nextTile : this.ramdomPiece();
    this.curMovIndex = 0;
    this.nextTile = this.ramdomPiece();
    this.drawNext();
};
App.drawBoard = function(){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    for(var bit = curTileConfig['blocks'][this.curMovIndex]; bit > 0; bit = bit >> 1){
        if(parseInt(bit & bitCheck) == 1){
            var x = (this.curCol + col - 1) * this.CONFIG.WIDTH_PER_GRID;
            var y = (this.curRow + row - 1) * this.CONFIG.WIDTH_PER_GRID;
            this.drawTile(x, y, this.CONFIG.WIDTH_PER_GRID - 0.5, curTileConfig['color'], this.btx);
        }
        if (--col === 0){
            col = 4;
            row--;
        }
    }
};
App.drawTiles = function(){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    this.ttx.clearRect(0, 0, $bCanvas.width, $bCanvas.height);
    for(var bit = curTileConfig['blocks'][this.curMovIndex]; bit > 0; bit = bit >> 1){
        if(parseInt(bit & bitCheck) == 1){
            var x = (this.curCol + col - 1) * this.CONFIG.WIDTH_PER_GRID;
            var y = (this.curRow + row - 1) * this.CONFIG.WIDTH_PER_GRID;
            this.drawTile(x, y, this.CONFIG.WIDTH_PER_GRID, curTileConfig['color'], this.ttx);
        }
        if (--col === 0){
            col = 4;
            row--;
        }
    }
};
App.drawNext = function(){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.nextTile];
    this.ntx.clearRect(0, 0, $nCanvas.width,$nCanvas.height);
    for(var bit = curTileConfig['preview']; bit > 0; bit = bit >> 1){
        if(parseInt(bit & bitCheck) == 1){
            var x = (col - 1) * (this.CONFIG.PREVIEW_TILE_WIDTH + 1);
            var y = (row - 1) * (this.CONFIG.PREVIEW_TILE_WIDTH + 1);
            this.drawTile(x, y, this.CONFIG.PREVIEW_TILE_WIDTH, curTileConfig['color'], this.ntx);
        }
        if (--col === 0){
            col = 4;
            row--;
        }
    }
};
App.drawTile = function(x, y, width, color, context){
    context.fillStyle = color;
    context.fillRect(x,y,width,width);
};
App.ramdomPiece = function(){
    if (!this.pieces || this.pieces.length == 0) {
        this.pieces = ["I","I","I","I",
            "J","J","J","J",
            "O","O","O","O",
            "S","S","S","S",
            "T","T","T","T",
            "L","L","L","L",
            "Z","Z","Z","Z"];
    }
    var index = Math.floor(Math.random() * this.pieces.length);
    return this.pieces.splice(index, 1)[0];
};
App.createBoard = function(){
    App.board = [];
    for(var row = 0;row < this.rowCount; row++){
        App.board[row] = new Array();
        for (var col = 0; col < this.colCount; col++){
            App.board[row].push(false);
        }
    }
};
App.testBoard = function(){
    var str = [];
    for(var row = 0;row < this.board.length; row++){
        for (var col = 0; col < this.board[row].length; col++){
            str.push(this.board[row][col] == true ? 1 : 0);
        }
        console.log(str.join(','));
        str = [];
    }
    console.log('**************************************************');
}
$(document).ready(function(){
    App.init();
});
