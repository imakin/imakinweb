var PI = 3.14159;
var RADTODEG = 57.2957795;
function RadToDeg(x) {
	return x*RADTODEG;
}
function DegToRad(x) {
	return x/RADTODEG;
}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
//~ var game = new Phaser.Game($(window).width()-10, $(window).height()-35, Phaser.AUTO, 'div_slam',null, true);
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'div_slam',null, true);
var echo = console.log;
var frame = 0;
var p = {x:0,y:0};
var vehicle = {
	avatar: null,
	move_rate:50, 
	next_move:0,
	rot_expected:0,
	rot_expected_d: function() {return this.rot_expected*RADTODEG;},
	rot_expected_c: function() {return this.rot_expected+PI;},
	rot_expected_cd: function() {return (this.rot_expected+PI)*RADTODEG;},
	rot_current:0,
	rot_current_d: function() {return this.rot_current*RADTODEG;},
	rot_current_c: function() {return this.rot_current+PI;},
	rot_current_cd: function() {return (this.rot_current+PI)*RADTODEG;},
	rot_diff:0,
	rot_diff_d:function() {return (this.rot_diff*RADTODEG);},
	rot_taken:'stop',
	pos_expected: {
		x:0,
		y:0
	},
	pos_current: function() { return ({x:this.avatar.body.x, y:this.avatar.body.y});},
	pos_diff: 0,
	
	update_rot_diff: function() {
		this.rot_diff = Math.max(this.rot_current_c(),this.rot_expected_c()) - Math.min(this.rot_current_c(),this.rot_expected_c());
	},
	update_pos_diff: function() {
		current_x = this.avatar.body.x;
		current_y = this.avatar.body.y;
		this.pos_diff = Math.sqrt((this.pos_expected.x-current_x)*(this.pos_expected.x-current_x) + (this.pos_expected.y-current_y)*(this.pos_expected.y-current_y));
	},
	update_rot_current: function() { 
		this.rot_current = this.avatar.rotation;
	},
	rightSensor: new Phaser.Line(0,0,0,0),
	leftSensor: new Phaser.Line(0,0,0,0),
	
	checkSensor: function(len) {
		this.update_rot_current();
		var rotme = this.rot_current_cd();
		var aim = 90; //-- the sensor direction
		function aimd() {
			var res = rotme+aim;
			if (res>360)
				res = res - 360;
			else if (res<0)
				res = res + 360;
			return res;
		}
		function aimd(x) {
			var res = rotme+x;
			if (res>360)
				res = res - 360;
			else if (res<0)
				res = res + 360;
			return res;
		}
		var range = 100; //-- the range where sensor will reach&check
		
		var x = vehicle.avatar.body.x + vehicle.avatar.body.width/2 + range*Math.cos(DegToRad(aimd()));
		var y = vehicle.avatar.body.y + vehicle.avatar.body.height/2 - range*Math.sin(DegToRad(aimd()));
		main_state.info.text = Math.floor(vehicle.avatar.x)+","+Math.floor(vehicle.avatar.y)+"  "+Math.floor(x)+","+Math.floor(y);
		
		main_state.info.text ="";
		
		aim = 90;
		var a;
		var foundany; 
		foundany = false;
		var res = 10;
		for(a=0;a<=180;a+=res)
		{
			for(var i=0;i<=range;i+=5)
			{
				this.leftSensor.fromAngle(vehicle.avatar.body.x + vehicle.avatar.body.width/2,
											vehicle.avatar.body.y + vehicle.avatar.body.height/2,
											DegToRad(aimd(a)),
											i);
				//~ game.debug.geom(this.leftSensor);
				if (game.physics.arcade.getObjectsAtLocation(this.leftSensor.end.x, this.leftSensor.end.y, platforms).length) /** it shows if there is platforms object in certain position **/
				{
					main_state.info.text = "found on left, b:"+ Math.floor(aimd(a)) +" r:"+i+"\t\t"+game.time.fps;
					//~ game.debug.geom(this.leftSensor, "rgb(155,50,50)");
					//~ a = 200;
					foundany=true;
					break;
				}
			}
			//~ if (a==200) break;
		}
		//~ if (a!=200)
			//~ game.debug.reset();
			
		aim = -90;
		for(a=0;a>=-180;a-=res)
		{
			for(var i=0;i<=range;i+=5)
			{
				this.rightSensor.fromAngle(vehicle.avatar.body.x + vehicle.avatar.body.width/2,
											vehicle.avatar.body.y + vehicle.avatar.body.height/2,
											DegToRad(aimd(a)),
											i);
				//~ game.debug.geom(this.rightSensor);
				if (game.physics.arcade.getObjectsAtLocation(this.rightSensor.end.x, this.rightSensor.end.y, platforms).length) /** it shows if there is platforms object in certain position **/
				{
					main_state.info.text = " found on right, b:"+ Math.floor(aimd(a)) +" r:"+i+"\t\t"+game.time.fps;
					//~ game.debug.geom(this.rightSensor, "rgb(155,50,50)");
					//~ a = 200;
					foundany=true;
					break;
				}
			}
			//~ if (a==200) break;
		}
		if (!foundany)
			game.debug.reset();
			
	},
	getCoord: function (range,bearing) {
		//get coord relatives to the current vehicle body
		var x = vehicle.avatar.body.x + vehicle.avatar.body.width/2 + range*Math.cos(DegToRad(bearing));
		var y = vehicle.avatar.body.y + vehicle.avatar.body.height/2 - range*Math.sin(DegToRad(bearing));
		return {x:x, y:y};
	},
	sensorRead: function (D,maxrange=100) {
		var sensor = null;
		var foundany = false;
		
		function aimd(x) {
			var res = vehicle.rot_current_cd()+x;
			if (res>360)
				res = res - 360;
			else if (res<0)
				res = res + 360;
			return res;
		}
		if (D>0)
			sensor = this.leftSensor;
		else
			sensor = this.rightSensor;
		for(var i=0;i<=maxrange;i+=5)
		{
			sensor.fromAngle(vehicle.avatar.body.x + vehicle.avatar.body.width/2,
										vehicle.avatar.body.y + vehicle.avatar.body.height/2,
										DegToRad(aimd(D)),
										i);
			if (game.physics.arcade.getObjectsAtLocation(sensor.end.x, sensor.end.y, platforms).length) /** it shows if there is platforms object in certain position **/
			{
				main_state.info.text = " found, b:"+ Math.floor(aimd(D))
				//~ game.debug.geom(this.leftSensor, "rgb(155,50,50)");
				foundany=true;
				break;
			}
		}
		if (foundany)
			return i;
		else
			return -1;
	},
	
	sensorRansac: function(knownpoint) {
		/**-- Find Ransac line from knownpoint that's assumed as landmark, knownpoint is in {range,bearing} **/
		this.update_rot_current();
		var rotme = this.rot_current_cd();
		var aim = 90; //-- the sensor direction
		var range = 100; //-- the range where sensor will reach&check
		
		function aimd(x) {
			var res = rotme+x;
			if (res>360)
				res = res - 360;
			else if (res<0)
				res = res + 360;
			return res;
		}
		main_state.info.text ="";
		
		var foundany = false;
		var p;
		var MINIML = 20;
		var s = 18; //-- number of samples
		var si = 0; //-- sample id
		var line = {slope:0, }
		var lineT = {slope:0 }
		/**  Get initial Line **/
		var p0 = this.getCoord(knownpoint.range,knownpoint.bearing);
		while (!foundany && si<s)
		{
			si += 1;
			if (knownpoint.bearing>0) //-- left side
				aim = getRandomInt(0,180);
			else
				aim = getRandomInt(-180,0);
				
			var read = this.sensorRead(aim,range);
			if (read!=-1)
			{
				var p = this.getCoord(read,aim);
				line.slope = (p.y - p0.y)/(p.x - p0.x);
				foundany = true;
				vehicle.leftSensor.start.x = p0.x;
				vehicle.leftSensor.start.y = p0.y;
				vehicle.leftSensor.end.x = p.x;
				vehicle.leftSensor.end.y = p.y;
				game.debug.geom(vehicle.leftSensor, "rgb(155,50,50)");
				main_state.info.text = p0.x+","+p0.y+"\t\t"+p.x+","+p.y;
			}
		}
		
	},
	
	sensorScan: function() {
		var res = 5;
		var range = 100;
		var sensorB;
		var read;
		for (sensorB = 0; sensorB<360; sensorB+=res)
		{
			read = this.sensorRead(sensorB);
			if (read!=-1)
			{
				this.sensorRansac({range:read,bearing:sensorB});
			}
		}
		
	},
};

var main_state = {
	init: function() {
		
	},
	
	preload: function() {
		//~ game.load.image('concrete', '/static/img/custom/slam/concrete.png');
		game.load.image('concrete', './concrete.png');
		//~ game.load.image('sprite_vehicle', '/static/img/custom/slam/avatar.png');
		game.load.image('sprite_vehicle', './avatar.png');
	},

	create: function() { 
		game.physics.startSystem(Phaser.Physics.ARCADE);
		vehicle.avatar = game.add.sprite(250, 300, 'sprite_vehicle');
		vehicle.avatar.anchor.set(0.5);
		game.physics.enable(vehicle.avatar, Phaser.Physics.ARCADE);
		game.physics.arcade.enable(vehicle.avatar);
		vehicle.avatar.body.allowRotation = true;
		vehicle.avatar.body.collideWorldBounds = true;
		
		this.bmd = game.add.bitmapData(game.width,game.height);
		this.bmd.addToWorld();
		this.bmd.clear();
		this.info = game.add.text(20,20,"Bismillah",{font:"normal 12px Arial"});
		this.plot();
		
		/** platforms **/
		platforms = game.add.group();
		platforms.enableBody = true;
		var wall = platforms.create(150, 150, 'concrete');
		wall.body.immovable = true;
		wall.width = 300;
		wall.height = 20;
		var wall = platforms.create(150, 250, 'concrete');
		wall.body.immovable = true;
		wall.width = 300;
		wall.height = 20;

		this.path = new Phaser.Line(0,0,0,0);
	},
	update: function() {
		//~ game.physics.arcade.collide(vehicle.avatar, platforms);
		//~ vehicle.checkSensor();
		vehicle.sensorScan();
		//~ if (game.physics.arcade.getObjectsAtLocation(155, 155, platforms).length) /** it shows if there is platforms object in certain position **/
		
		if (game.input.activePointer.isDown) {
			this.vehicle_setGoal();
		}
		
		//~ this.info.text = "r.rot_expected "+vehicle.rot_expected+" ("+vehicle.rot_expected_cd()+")"+
						//~ "\n a.rot"+vehicle.avatar.rotation +
						//~ "\n v.rot_current"+vehicle.rot_current +" ("+vehicle.rot_current_cd()+")"+
						//~ "\n v.rd"+ vehicle.rot_diff+ " ("+vehicle.rot_diff_d()+")"+
						//~ "\n v.rt"+vehicle.rot_taken;
		vehicle.update_rot_current();
		if (vehicle.rot_diff_d()>5)
		{
			if (vehicle.rot_taken=='stop')
			{
				if (vehicle.rot_current_cd()>90 && vehicle.rot_current_cd()<270)
				{
					if (vehicle.rot_expected_cd()> vehicle.rot_current_cd())
						vehicle.rot_taken = 'right';
					else
						vehicle.rot_taken = 'left';
				}
				else
				{
					var flip = vehicle.rot_current_cd()+180;
					if (flip>360)	flip = flip - 360;
					if (vehicle.rot_expected_cd()> flip)
						vehicle.rot_taken = 'left';
					else
						vehicle.rot_taken = 'right';
				}
			}
			
			if (vehicle.rot_taken == 'left') {
				vehicle.rot_current = vehicle.rot_current - 0.05;
				if (vehicle.rot_current_cd() < 0)
					vehicle.rot_current = ((360+vehicle.rot_current_cd())/RADTODEG)-PI;
			}
			else {
				vehicle.rot_current = vehicle.rot_current + 0.05;
				if (vehicle.rot_current_cd() > 360)
					vehicle.rot_current = ((vehicle.rot_current_cd()-360)/RADTODEG)-PI;
			}
			vehicle.avatar.rotation = vehicle.rot_current;
			vehicle.update_rot_diff();
			var angle = vehicle.avatar.rotation;
			var speed = 30;
			vehicle.avatar.body.velocity.x = Math.cos(angle) * speed;
			vehicle.avatar.body.velocity.y = Math.sin(angle) * speed;
		}
		else
		{
			vehicle.rot_taken = 'stop';
			this.vehicle_stop();
			if (vehicle.pos_diff>30)
			{
				vehicle.avatar.body.velocity.x = Math.cos(vehicle.avatar.rotation) * 40;
				vehicle.avatar.body.velocity.y = Math.sin(vehicle.avatar.rotation) * 40;
				vehicle.update_pos_diff();
				
				vehicle.rot_expected = game.physics.arcade.angleToXY(vehicle.avatar,p.x,p.y);
				vehicle.update_rot_current();
				vehicle.update_rot_diff();
			}
			else
			{
				this.vehicle_stop();
				this.bmd.clear();
			}
		}
	},
	
	vehicle_setGoal: function () {
		p = {x:game.input.x, y:game.input.y};
		vehicle.rot_expected = game.physics.arcade.angleToXY(vehicle.avatar,p.x,p.y);
		vehicle.rot_current = vehicle.avatar.rotation;
		vehicle.update_rot_diff();
		vehicle.pos_expected = p;
		vehicle.update_pos_diff();
		vehicle.rot_taken = 'stop';
		this.bmd.clear();
		this.bmd.rect(p.x-4,p.y-4, 8,8, 'rgba(200,230,200,1)');
		
		this.path.fromAngle(vehicle.avatar.body.x + vehicle.avatar.body.width/2,
							vehicle.avatar.body.y + vehicle.avatar.body.height/2,
							vehicle.rot_expected,
							vehicle.pos_diff);
		game.debug.geom(this.path);
	},
	vehicle_rotInstant: function() {
		vehicle.avatar.rotation = vehicle.rot_expected;
		vehicle.update_rot_current();
	},
	vehicle_stop: function() {
		vehicle.avatar.body.velocity.x = 0;
		vehicle.avatar.body.velocity.y = 0;
	},
	plot: function () {
		this.bmd.rect(vehicle.avatar.body.x,vehicle.avatar.body.y, 1,1, 'rgba(0,0,0,1)');
	},
}

game.state.add('main', main_state,true);
