
window.onload = function(){ //fais  ce code lorsque la page se charge.
    var monCanvas ;
    canvasWidth = 900 ;
    canvasHeigth = 600 ;
    var ctx ;
    var delay = 100 ;
    blockSize = 30 ;
    coordx = 0;
    coordy = 0 ;
    var snakee ;
    var applee ;
    widthInBlocks = canvasWidth /blockSize ; // 900 : 30 =30 blocs
    heightInBlocks = canvasHeigth/blockSize ; //600 :30 = 20 blocks
    var score ;
    var timeout ;

    
    
    function init () {
    monCanvas = document.createElement('canvas') ; //création de l'objet canvas depuis le js

    monCanvas.style.backgroundColor = 'beige' ;// les propriétés de l'objet canvas
    monCanvas.width = canvasWidth ;
    monCanvas.height = canvasHeigth ;
    monCanvas.style.border = '30px solid #8A2' ;
    monCanvas.style.margin =  '50px auto' ;
    monCanvas.style.display = 'block'

    ctx = monCanvas.getContext('2d') ; //le contexte de l'objet canvas, grâce à la variable ctx déclarée en global
    
    document.body.appendChild(monCanvas) ; // accrochage de l'objet canvas au body de notre document html

    snakee = new Snake([[6,4],[5,4],[4,4], [3,4],[2,4]], "right") ; //initialisation du tout premier serpent. C'est une instance de l'objet Snake créé plus bas

    applee = new Apple ([10,10]) ; //initialisation de la pomme

    score = 0 ;

    refreshCanvas () ; //la fonctionnalité d'initialisation se termine en actualisant le canvas pour prendre en compte les nouvelles données des variables progressives.
    }

    init() ; //appel de la fonction d'initialisation, afin de déclencher l'orchestre.

    function refreshCanvas () { //Quelle est la nouvelle structure géométrique du canvas après chaque actualisation

       // coordx +=1 ; Progression en abscisse, pour illustrer le déplacement d'un bloc, avec la méthode setTimeout
       // coordy +=1 ; Progression en ordonnée, pour illustrer le déplacement d'un bloc, avec la méthode setTimeout
      //  ctx.fillStyle = '#E48'; couleur du block, pour illustrer le déplacement d'un bloc, avec la méthode setTimeout
       // ctx.fillRect(coordx,coordy,65,20) ; dessin du block, pour illustrer le déplacement d'un bloc, avec la méthode setTimeout
       snakee.advance() ;

       if(snakee.checkCollision()) {
           gameOver() ;
       }
       else {
           if(snakee.isEatingApple(applee)) {

            score++ ;

            snakee.ateApple = true ;

            do {
                applee.setNewPosition() ;  // définis une autre position lorsque la nouvelle position aléatoire se trouve sur le corps du serpent.
            }
            while(applee.isOnSnake(snakee)) ;
           }
        ctx.clearRect(0,0,monCanvas.width,monCanvas.height) ; // pour reset le plateau, lors de chaque actualisation. Vider le tableau
       
       drawScore() ;
       snakee.draw() ; //dessiner le nouveau snakee en prenant en compte ses nouvelles coordonnées, après chaque actualisation
       applee.draw() ; //dessine la nouvelle pomme
       
       timeout = setTimeout(refreshCanvas, delay) ; //délai de rafraichissement, redessine snakee après chaque 100ms
       }
    }
    //on crée la fonction GAME OVER, pour indiquer à l'user où pour recommencer
    function gameOver() {
        ctx.save() ;
        ctx.font = 'bold 70px sans-serif' ;
        ctx.fillStyle = '#A34' ;
        ctx.textAlign = 'center' ;
        ctx.textBaseline = 'middle' ;
        ctx.strokeStyle = 'white' ;
        ctx.lineWidth = 5 ;
        var centreX = canvasWidth/2 ;
        var centreY = canvasHeigth/2 ;
        ctx.strokeText("Game Over",centreX,centreY-180) ;
        ctx.fillText("Game Over",centreX,centreY-180) ;
        ctx.font = 'bold 30px sans-serif' ;
        ctx.strokeText("Appuyer sur la touche ENTRER pour rejouer", centreX, centreY-120) ;
        ctx.fillText('Appuyer sur la touche "Enter" pour rejouer', centreX, centreY-120) ;
        ctx.restore() ;
    }
    //on crée la fonction restart() 
    function restart() {
        snakee = new Snake([[6,4],[5,4],[4,4], [3,4],[2,4]], "right") ;
        applee = new Apple ([10,10]) ;
        score = 0 ;
        clearTimeout(timeout) ;
        refreshCanvas () ;
    }

    function drawScore() {
        ctx.save() ;
        ctx.font = 'bold 200px sans-serif' ;
        ctx.fillStyle = 'gray' ;
        ctx.textAlign = 'center' ;
        ctx.textBaseline = 'middle' ;
        var centreX = canvasWidth/2 ;
        var centreY = canvasHeigth/2 ;
        ctx.fillText(score.toString(),centreX, centreY) ;
        ctx.restore() ;
    }

    //matérialisation des blocks
    function drawBlock (ctx, position) { 
        var x = position[0] * blockSize ; //position du block selon l'axe des abscisses (x). par exemple le premier c'est 6x30px ou bien 3Opx x 6 et le 7e correspond à notre block
        var y = position[1] * blockSize ; //position du block selon l'axe des ordonnées (y)
        ctx.fillRect(x,y, blockSize, blockSize) ;
    }
     
    //création de l'objet Snake
    function Snake (bodySnake, direction) { //l'objet snake est simplement une suite de block dont les positions varient de x en abscisses et y en ordonnées, et de longueur(ou largeur) x+30px et de hauteur y+30px. l'objet snake est fonction de la dessination des blocs et de la direction choisie par l'user.

        this.bodySnake = bodySnake ; //une propriété de l'objet Snake, le corps du serpent. Il est composé d'une suite de blocks de positions [x,y] et de mesures "blockSize". Donc les valeurs array des blocks, des bocks qui constituent eux même des valeurs array du corps du serpent.

        this.direction = direction ; 

        this.ateApple = false ; //On initialise "si le serpent a mangé la pomme" à non. interrupteur fermé.

        this.draw = function (){ //une méthode de l'objet Snake. on donne la capacité de dessiner à notre objet Snake 
            ctx.save() ; //RAS
            ctx.fillStyle = '#E48' ; //dessin
            for (var i = 0 ; i < this.bodySnake.length ; i++) { //l'objet dessine chaque block ou un block, tant que l'indice i < à la taille du body(le serpent)
                drawBlock(ctx, this.bodySnake[i]) ; // Au départ i va de 1 à 3 car on a trois blocks qui constituent le corps du serpent. i représente les indexes de chaque bloc, et peux prendre les valeurs 0,1,2 au départ.
            }
            ctx.restore() //RAS
        } ;
        this.advance = function () { //on ajout une nouvelle fonction à notre objet, capacité d'ajouter un nouveau block au début du corps du serpent.
            var nextPosition = this.bodySnake[0].slice() ; //Crée un nouveau bloc en extrayant les valeurs du tableau bodySnake (ou allonge le tableau bodySnake existant) à la suite de i=0 du bodySnake. BodySnake[0] représente le premier index du multi-tableau qui forme le corps du serpent. Il représente dont le premier block du corps du serpent. 
            // nextPosition est une variable array et peut prendre les coordonnées des indexes de chaque block, ie 0 ou 1. O ->axe des abscisses(x) et 1 ->axe des ordonnées (y). compte tenu du caractère aléatoire du changement de position ou de la matérialisation du prochain bloc du point de vu de la position, on peut mettre en place ici un système de conditions, ou simplement de bloucles avec "case".
           switch(this.direction) {
            case "left" :
                nextPosition[0] -=1 ; // évolue en retirant 1 à chaque fois sur l'axe des x. donc va vers la gauche
               break ;
            case "right" :
                nextPosition[0] +=1 ; // évolue en ajoutant 1 à chaque fois sur l'axe des x. situation logique par défaut. donc va vers la droite. 
               break ;
            case "down" :
                nextPosition[1] +=1 ; // évolue en ajoute 1 à chaque fois sur l'axe des y. donc vers le bas
               break ;
            case "up" :
                nextPosition[1] -=1 ; // évolue en retranchant 1 à chaque fois sur l'axe des y. donc va vers le haut
               break ;
            default : 
                    throw ("Invalid direction") ;
           }
            
            this.bodySnake.unshift(nextPosition) ; //ajoute ou dessine ou matérialise le nouveau block à la suite de l'indexe i=0 du bodySnake
            
            if(!this.ateApple) //interrupteur "ateApple" s'allume, le processus est modifié et le dernier block n'est pas retiré.
            this.bodySnake.pop() ;// supprime le dernier block bodySnake
            else
                this.ateApple = false ; // ensuite l'interrupteur s'éteint à nouveau.


        };
        //LIAISON DES DIRECTIONS DU SERPENT AUX TOUCHES CLAVIER UP DOWN LEFT RIGHT
        this.setDirection = function (newDirection) { //une autre méthode ou propriété de l'objet Snake pour gérer les directions.

            var allowedDirections ; //directions autorisées : up down left right

            switch(this.direction) { //le serpent ne peut aller qu'à gauche ou à droite si il est dans la direction up ou down, et vice versa.
                case "right" :
                case "left" :
                    allowedDirections = ["up","down"]  ;
                    break ;
                case "down" :
                case "up" :
                    allowedDirections = ["left","right"]  ;
                    break ;
                default : 
                    throw ("Invalid direction") ;
            }
            if(allowedDirections.indexOf(newDirection) > -1){ //si l'indexe de la direction est retrouvé(0 ou 1), alors tu autorises cette direction. Sachant que indexOf() renvoie l'index si trouvé et -1 si pas trouvé.
                this.direction = newDirection ;
            }
            
        } ;
        //une autre fonction de l'objet Snake, pour vérifier les collisions (avec le mur ou avec le corps du serpent lui même)
        this.checkCollision = function() {

            var wallCollision = false ;
            var snakeCollision = false ;
            var head = this.bodySnake[0] ; //on récupère la tête du bodySnake, qui correspond au premier bloc du bodySnake , i=0
            var rest = this.bodySnake.slice(1) ; //on récupère le reste de bodySnake, (récupère le reste dans un tableau à partir du deuxième bloc, i=1)
            var snakeX = head[0] ; //l'abscisse du bodySnake correspond aussi à l'abscisse du serpent, (le x du premier bloc)
            var snakeY = head[1] ; // l'ordonné du serpent correspond à l'ordonné de la tête du serpent (le y du premier block) 
            var minX = 0 ; //le premier index des abscisses correspond à 0 et va jusqu'à 29 , ce qui fait au total 30 blocks
            var maxX = widthInBlocks -1 ; // -//-
            var minY = 0 ;
            var maxY = heightInBlocks -1 ;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX ;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY ;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true ;
            }

            for(var i = 0 ; i < rest.length ; i++) {
                if(snakeX === rest[i][0] && snakeY === rest[i][1] ) {
                    snakeCollision = true ;
                }
            }
            return wallCollision || snakeCollision ;
        } ;
        this.isEatingApple = function (appleToEat) {

            var head = this.bodySnake[0] ;

            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] )
                return true ;
                else 
                    return false ;
        } ;

    }

    //CREATION DE LA POMME 
    function Apple (position) { //tout comme l'objet Snake, on crée l'objet pomme qui est fonction d'une position(array) sur la surface du jeu.
        
        this.position = position ;
        this.draw = function () {
            ctx.save() ; //enregistre les paramètres de contexte précédents avant de dessiner cette figure,
            ctx.fillStyle = "#58D" ;
            ctx.beginPath() ;
            var radius = blockSize/2 ;
            var x = this.position[0] * blockSize + radius ;
            var y = this.position[1] * blockSize + radius ;
            ctx.arc(x,y,radius,0, Math.PI*2, true) ;
            ctx.fill() ;
            ctx.restore() ; //restore les paramètres de ctx par defaut (précédents)
        } ;

        this.setNewPosition = function() { //nouvelle méthode de l'objet Apple, pour définir une nouvelle position, de façon aléatoire
            var newX = Math.round(Math.random()*(widthInBlocks -1)) ; //génère un chiffre décimal aléatoire et arrondis le
            var newY = Math.round(Math.random()*(heightInBlocks -1)) ;
            this.position = [newX , newY] ;
        } ; 

        this.isOnSnake = function(snakeToCheck) { //nouvelle méthode de Apple, pour gérer le scénario où la nouvelle position de la pomme se trouve sur le corps du serpent

            var isOnSnake = false ;

            for(var i = 0 ; i < snakeToCheck.bodySnake.length ; i++ ) { //pour vérifier si la nouvelle se trouve sur le corps du serpent
                if(this.position[0] === snakeToCheck.bodySnake[i][0] && this.position[1] === snakeToCheck.bodySnake[i][1]) {
                    isOnSnake = true ;
                }
                return isOnSnake
            } ;
        }
    }


    //DESIGNATION DES TOUCHES CLAVIER UP DOWN LEFT RIGHT POUR LE JEU

    document.onkeydown = function handlekeyDown(e) {
        var key = e.key ;
        var newDirection ;
        switch(key) {
            case 'ArrowLeft' :
                newDirection = "left" ;
                break ;
            case 'ArrowUp' :
                    newDirection = "up" ;
                break ; 
            case 'ArrowRight' :
                newDirection = "right" ;
                break ;
            case 'ArrowDown' :
                newDirection = "down" ;
                break ;
            case "Enter" :
                restart() ;
                return ;
            default :
                return ;
        }
        snakee.setDirection(newDirection) ;
    }

}










