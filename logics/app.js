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
    this.width = $bCanvas.width;
    this.height = $bCanvas.height;
    this.curRow = this.CONFIG.DEFAULT_STARTING_POINT['row'];
    this.curCol = this.CONFIG.DEFAULT_STARTING_POINT['col'];
    this.pieces = this.CONFIG.TILES_HELPER;
    this.colCount = this.width / this.CONFIG.WIDTH_PER_GRID;
    this.rowCount = this.height / this.CONFIG.WIDTH_PER_GRID;
    this.rows = 0;
    this.actions = [];
    this.newTile();
    this.drawBoardLines();
    this.createBoard();
    this.bindKeyEvent();
    this.drawNext();
    this.frame();
};
App.clearRows = function(){
    this.rows = 0;
};
App.curSpeed = function(){
    return Math.max(speed.min, speed.start - (speed.decrement * this.rows))
};
App.frame = function(){
    var now = new Date().getTime();
    App.update(Math.min(1, (now - last) / 1000.00));
    App.drawTiles();
    last = now;
    requestAnimationFrame(App.frame);
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
App.handle = function(action){
    switch(action) {
        case this.CONFIG.DIR.LEFT:  this.move(this.CONFIG.DIR.LEFT);  break;
        case this.CONFIG.DIR.RIGHT: this.move(this.CONFIG.DIR.RIGHT); break;
        case this.CONFIG.DIR.UP:    this.rotate();        break;
        case this.CONFIG.DIR.DOWN:  this.drop();          break;
    }
};
App.drawBoardLines = function(){
    this.btx.lineWidth = 0.5;
    this.btx.strokeStyle = this.CONFIG.BOARD_LINE_COLOR;
    // draw vertical
    for(var i = 0; i < this.colCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.btx.beginPath();
        this.btx.moveTo(curPos, 0);
        this.btx.lineTo(curPos, this.height);
        this.btx.stroke();
    }
    // draw horizontal
    for (var i = 0; i < this.rowCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.btx.beginPath();
        this.btx.moveTo(0, curPos);
        this.btx.lineTo(this.width, curPos);
        this.btx.stroke();
    }
};
App.bindKeyEvent = function(){
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
};
App.move = function(direction){
    switch (direction){
        case this.CONFIG.DIR.LEFT:
            this.curCol--;
            break;
        case this.CONFIG.DIR.RIGHT:
            this.curCol++;
            break;

    }
};
App.rotate = function(){
    this.curMovIndex = this.curMovIndex == 3 ? 0 : this.curMovIndex + 1;
    this.drawTiles();
};
App.drop = function(){
    this.curRow++;
    this.drawTiles();
};
App.newTile = function(){
    this.curTile = this.ramdomPiece();
    this.curMovIndex = 0;
}
App.drawTiles = function(){
    var bitCheck = 0x0001;
    var row = 4, col = 4;
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    this.ttx.clearRect(0, 0, this.width, this.height);
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
    var curTileConfig = this.CONFIG.TILES[this.curTile];
    this.ntx.clearRect(0, 0, this.ntx.width,this.ntx.height);
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
    if (this.pieces.length == 0) this.pieces = this.CONFIG.TILES_HELPER;
    var index = Math.floor(Math.random() * this.pieces.length);
    return this.pieces.splice(index, 1)[0];
};
App.createBoard = function(){
    App.board = [];
    for(var row = 0;row < this.rowCount; row++){
        App.board[row] = new Array();
        for (var col = 0; col < this.colCount; col++){
            App.board[row].push(0);
        }
    }
};
$(document).ready(function(){
    App.init();
});
