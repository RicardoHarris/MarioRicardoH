// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);
        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        this.renderable.setCurrentAnimation("idle");
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            this.flipX(false);
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }else if (me.input.isKeyPressed("left")){
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }else{
            this.body.vel.x = 0;
        }
        
        if (me.input.isKeyPressed("jump")){
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }

        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }

        this._super(me.Entity, "update", [delta]);
        return true;
        }

        ,collideHandler: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            console.log(ydif);
            
            if(response.b.type === 'Minion'){
                if(ydif <= -115){
                    
                }else{
                    response.b.alive = false;
                }
                
                me.state.change(me.state.MENU);
            }
        }


});

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }

});

game.Minion = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);
        
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();
        
        this.alwaysUpdate = true;
        
        this.walkLeft = false;
        this.alive = true;
        this.type = "Minion";
        
        this.renderable.addAnimation("run", [0, 1, 2], 80);
        
        this.body.setVelocity(4, 6);
        
    },
    
    update: function(delta){
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.alive){
            if(this.walkLeft && this.pos.x <= this.startX){
                this.walkLeft = false;
            }else if(!this.walkLeft && this.pos.x >= this.endX){
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
            
        }else{
            me.game.world.removeChild(this);
        }
        
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(){
        
    }
    
});