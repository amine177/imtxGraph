var gamejs = require('gamejs');
var font_sizes = [50, 25, 50, 25, 50, 50, 50]
var seed = 1;
var tileSurfaces;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var seed = 0;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


function draw_text(text, color, max_size, index_size, x, y, display)
{
    font = new gamejs.font.Font(String(font_sizes[index_size])+"px");
    label = font.render(text, color);
    while(label.rect.width > max_size)
    {
        font_sizes[index_size] = font_sizes[index_size] - 1;
        font = new gamejs.font.Font(String(font_sizes[index_size])+"px");
        label = font.render(text, color);
    }
    x_position = x - Math.round(label.rect.width / 2);
    display.blit(label, [x_position,y]);
}


class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.random = Math.round(random()*9);
        return this;
    }
    draw(display) {
        display.blit(tileSurfaces[this.random], [this.x, this.y], gamejs.Rect(this.x, this.y));
    }
};


function preload_images() {
    var tiles = []
    for (i = 1; i <= 10; i++) {
        tiles.push('./resources/gameElements/tile' + String(i) + '.png');
    }
    backgroundImg = './resources/illustrations/background.jpg';
    image_cheese = "resources/gameElements/cheese.png";
    image_corner = "resources/gameElements/corner.png";
    image_moving_python = "resources/gameElements/movingPython.png";
    image_moving_rat = "resources/gameElements/movingRat.png";
    image_python = "resources/gameElements/python.png";
    image_rat = "resources/gameElements/rat.png";
    image_wall = "resources/gameElements/wall.png";
    image_mud = "resources/gameElements/mud.png";
    image_portrait_python = "resources/illustrations/python_left.png";
    image_portrait_rat = "resources/illustrations/rat.png";
    images = [backgroundImg, image_cheese, image_corner, image_moving_python, image_moving_rat, image_python, image_rat, image_wall, image_mud, image_portrait_python,image_portrait_rat].concat(tiles);
    gamejs.preload(images);
    return tiles
}



function main() {


    

    var window_height;
    var window_width;
    var portrait_python_surface;
    var portrait_rat_surface;
    var backgroundSurface;
    var mud_surface;
    var wall_surface;
    var cheese_surface;
    var python_surface;
    var display;
    var rat_surface;
    var scale;
    var scale_portrait_h;
    var scale_portrait_w;
    var offset_x;
    var offset_y;
    var rotated_wall;
    var rotated_mud;
    display = gamejs.display.getSurface();

    function reload_definitions(display)
    {
        window_height = display.getRect().height;
        window_width = display.getRect().width;  
    
        scale = Math.floor(Math.min((window_height - 50) / squares_height, window_width * 2/3 / squares_width))
        offset_x = Math.floor(window_width / 2) - Math.floor(squares_width / 2 * scale)
        offset_y = Math.max(25, Math.floor(window_height / 2) - Math.floor(scale * squares_height / 2))
        scale_portrait_w = Math.floor(window_width / 6)
        scale_portrait_h = Math.floor(window_width / 6)
    
    
        portrait_rat_surface = gamejs.image.load(image_portrait_rat).scale([scale_portrait_w,scale_portrait_h]); 
        portrait_python_surface = gamejs.image.load(image_portrait_python).scale([scale_portrait_w,scale_portrait_h]);
        backgroundSurface = gamejs.image.load(backgroundImg).scale([window_width,window_height]);
        mud_surface = gamejs.image.load(image_mud).scale([scale,scale]);
        wall_surface = gamejs.image.load(image_wall).scale([scale,scale]);
        cheese_surface = gamejs.image.load(image_cheese).scale([scale,scale]);
        python_surface = gamejs.image.load(image_python).scale([scale,scale]);
        rat_surface = gamejs.image.load(image_rat).scale([scale,scale]);
        rotated_wall = wall_surface.rotate(270);
        rotated_mud = mud_surface.rotate(270);
        tileSurfaces = []
        for(i=0;i<10;i++)
        {
            tileSurfaces.push(gamejs.image.load(tiles[i]).scale([scale,scale]));
        }
    
    
    }
    reload_definitions(display);



    function start_draw(display)
    {
        var balls = [];
        seed = 0;
        display.blit(backgroundSurface)
        for (i = 0; i < squares_width; i++) {
            local_width = offset_x + i*scale; 
            for (j = 0; j < squares_height; j++) {
                local_height = window_height-offset_y-(scale *(j+1));
                ball = new Square(local_width,local_height);
                balls.push(ball);
            }
        }

        draw_background(balls,display);

        splitted = labyrinth.split("###");
        for (i=0;i<squares_width;i++)
        {
            line = splitted[i].split(" ")
            for (j=0;j<squares_height;j++)
            {
                information = parseInt(line[j]);
                if (information & 1) // LEFT WALL
                {
                    x_wall = offset_x + scale * i - scale / 2;
                    y_wall = window_height - offset_y - scale * (j+1);
                    display.blit(wall_surface, [x_wall, y_wall])    
                } 
                if (information & 2) // UP WALL
                {
                    x_wall = offset_x + scale * i;
                    y_wall = window_height - offset_y - scale * (j+1) - scale/2;
                    display.blit(rotated_wall, [x_wall, y_wall]);
                } 
                if (information & 4) // LEFT MUD
                {
                    display.blit(mud_surface, [offset_x + scale * i - scale/2, window_height - offset_y - scale * (j+1)]);
                } 
                if (information & 8) // UP MUD
                {
                    display.blit(rotated_mud, [offset_x + scale * i, window_height - offset_y - scale * (j+1) - scale/2]);
                } 
            }
        } 

        for (i=0;i<squares_width;i++)
            display.blit(rotated_wall, [offset_x + scale * i, window_height - offset_y - scale/2]);
        for (j=0;j<squares_height;j++)
            display.blit(wall_surface, [offset_x + (scale * squares_width) -scale/2, window_height - offset_y - scale * (j+1)]);

        

        cheeses = pieces_of_cheese[turn].split(";");
        for (i=0;i<cheeses.length;i++)
        {
            x = parseInt(cheeses[i].split(",")[0]);
            y = parseInt(cheeses[i].split(",")[1]);
            if (isNaN(x) || isNaN(y))
            {
                continue;
            }
            display.blit(cheese_surface, [offset_x + scale * x, window_height - offset_y - scale * (y+1)]);
        }

        local_player1_location = player1_location[turn];
        local_player2_location = player2_location[turn];

        if (local_player1_location[0] != -1 && local_player1_location[1] != -1)
        {
            display.blit(portrait_rat_surface, [Math.floor(window_width / 12 - scale_portrait_w / 2), 100]);
        
            //draw_text("Score: "+String(score1), "#323232", Math.ceil(window_width / 6), 0, Math.floor(window_width / 12), window_width/3 + 50, display);
            //draw_text(p1name,"#323232", window_width / 6, 5, Math.floor(window_width / 12), window_width/3, display);
            //draw_text("Moves: " + String(moves1), "#027689", window_width / 6, 1, Math.floor(window_width / 12), window_width/3 + 150, display);
            //draw_text("Miss: " + String(miss1), "#E5234O", window_width / 6, 1, Math.floor(window_width / 12), window_width/3 + 180, display);
            //draw_text("Mud: " + String(stuck1), "#E52340", window_width / 6, 1, Math.floor(window_width / 12), window_width/3 + 210, display);

            i = local_player1_location[0];
            j = local_player1_location[1];
            display.blit(rat_surface, [offset_x + scale * i, window_height - offset_y - scale * (j+1)]);    
            
        }

        
        if (local_player2_location[0] != -1 && local_player2_location[1] != -1)
        {
            display.blit(portrait_python_surface, [Math.floor(window_width * 11 / 12 - scale_portrait_w / 2), 100]);

            //draw_text("Score: "+String(score2), "#323232", Math.ceil(window_width / 5), 0, Math.floor(window_width*11 / 12), window_width/3 + 50, display);
            //draw_text(p2name,"#323232", window_width / 6, 5, Math.floor(window_width*11 / 12), window_width/3, display);
            //draw_text("Moves: " + String(moves2), "#027689", window_width / 6, 1, Math.floor(window_width*11 / 12), window_width/3 + 150, display);
            //draw_text("Miss: " + String(miss2), "#E5234O", window_width / 6, 1, Math.floor(window_width*11 / 12), window_width/3 + 180, display);
            //draw_text("Mud: " + String(stuck2), "#E52340", window_width / 6, 1, Math.floor(window_width*11 / 12), window_width/3 + 210, display);
    
            i = local_player2_location[0];
            j = local_player2_location[1];
            display.blit(python_surface, [offset_x + scale * i, window_height - offset_y - scale * (j+1)]);
        
        }
    

        return balls;
    }

   
    function draw_background(balls,display)
    {
        balls.forEach(function(item,index) {
            item.draw(display)
        });

    }
    balls = start_draw(gamejs.display.getSurface())

    var cumulatedtime = 0
    function test()
    {
        if(resize)
        {
            reload_definitions(display);
            resize = false;
        }
//        if (turn == 0 && max_turn > 2)
//            window.dispatchEvent(new Event('resize'));
        turn = turn + 1;
        if (turn >= max_turn)
            turn = 0;
        gamejs.display.getSurface().clear()
        balls = start_draw(gamejs.display.getSurface());  
        setTimeout(test,500)
    }
    test()

}



// call main after all resources have finished loading
var tiles = preload_images();
gamejs.ready(main);
