var App = App || {};

App.init = function(){
    this.drawBoardLines();
};
App.drawBoardLines = function(){
    var colCount = this.width / this.CONFIG.WIDTH_PER_GRID;
    var rowCount = this.height / this.CONFIG.WIDTH_PER_GRID;
    this.context.lineWidth = 0.5;
    this.context.strokeStyle = '#f0d7b4';
    // draw vertical
    for(var i = 0; i < colCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.context.beginPath();
        this.context.moveTo(curPos, 0);
        this.context.lineTo(curPos, this.height);
        this.context.stroke();
    }
    // draw horizontal
    for (var i = 0; i < rowCount; i++){
        var curPos = (i + 1)*this.CONFIG.WIDTH_PER_GRID;
        this.context.beginPath();
        this.context.moveTo(0, curPos);
        this.context.lineTo(this.width, curPos);
        this.context.stroke();
    }
};
$(document).ready(function(){
    var $canvas = $('#board-canvas')[0];
    App.context = $canvas.getContext('2d');
    App.width = $canvas.width;
    App.height = $canvas.height;
    App.init();
})