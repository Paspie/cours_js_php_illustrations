window.onload = function () {

    var canvasWidht = 900 ;
    var canvasHeight = 600 ;
    var v=blockSize = 30 ;
    var contexte ;
    var delay = 100 ;
    var snakee ;
    

    init () ;

    function init(){

        var canvas = document.createElement('canvas') ;
        canvas.width = canvasWidht ;
        canvas.height = canvasHeight ;
        canvas.style.border = "1px solid" ;
        document.body.appendChild(canvas) ;
        contexte = canvas.getContext('2d') ;
        snakee = new snake ([[6,4], [5,4], [4,4]]) ;
        refreshCanvas () ;

    }

    function refreshCanvas () {
        contexte.clearRect(0,0,canvasWidth, canvasHeight) ; 
        snakee.advance() ;
        snakee.draw() ;
        setTimeout(refreshCanvas,delay) ;
    }

    function drawBlock(contexte, position) {
        var x = position[0] * blockSize ;
        var y = position[1] * blockSize ;
        contexte.fillRect(x,y, blockSize, blockSize) ;

    }

    function Snake (body) {

        this.body = body ;
        this.draw = function() {
            contexte.save() ;
            contexte.fillStyle = "#47C" ;
            for(var i = 0 ; i < this.body.length ; i++ ) {
                drawBlock(contexte, this.body[i]) ;
            }
            contexte.restore() ;
        } ;
        this.advance = function () {
            var nextPosition = this.body[0].slice() ;
            nextPosition[0] +=1 ;
            this.body.unshift(nextPosition) ;
            this.body.pop() ;
        };
    }

    
}