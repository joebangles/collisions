Array.prototype.inverse = function() {
    return [-this[0], -this[1]]
}

class Ball {
    constructor(pos, vel, id) {
        this.position = pos;
        this.velocity = vel;

        this.element = document.getElementById(id);

        this.element.style.left = this.position[0];
        this.element.style.top = -this.position[1];

        this.colliding = false;
    }

    tick(delta) {
        if(!this.colliding){
            this.position = [this.position[0] + this.velocity[0] * delta, this.position[1] + this.velocity[1] * delta]

            this.element.style.left = this.position[0] + "vh"
            this.element.style.top = -this.position[1] + "vh"
            this.velocity[0] = this.velocity[0] * 0.995
            this.velocity[1] = this.velocity[1] * 0.995
        }
    }
}

var balls = [];

let red_ball = new Ball([30, -44], [60, -10], "red_ball")
let blue_ball = new Ball([100, -60], [-60, 10], "blue_ball")

balls.push(red_ball)
balls.push(blue_ball)

function distance(b1, b2) {
    return Math.sqrt((parseFloat(b1.style.top, 10) - parseFloat(b2.style.top, 10)) ** 2 + (parseFloat(b1.style.left, 10) - parseFloat(b2.style.left, 10)) ** 2);
}

var lastTimeAsked = Date.now() / 1000

function deltaT() {
    let toReturn = (Date.now() / 1000 - lastTimeAsked)
    lastTimeAsked = Date.now() / 1000
    return toReturn;
}

function dot(u, v) {
    return u[0]*v[0] + u[1]*v[1]
}

function updatePos() {

    let delta = deltaT()

    for(let b of Array(balls.length).keys()){
        for(let c = b+1; c<=balls.length-1; c++){
            let ball1 = balls[b]
            let ball2 = balls[c]
            if(distance(ball1.element, ball2.element) < 10 && !ball1.colliding && !ball2.colliding){
                console.log("collision")
                ball1.colliding = ball2.colliding = true;

                let contact = [ball1.position[0] - ball2.position[0], ball1.position[1] - ball2.position[1]]
                let velo1 = [...ball1.velocity]
                let velo2 = [...ball2.velocity]
                let deltaV = [velo1[0] - velo2[0], velo1[1] - velo2[1]]
                let norm = Math.sqrt(contact[0]**2 + contact[1]**2)
                console.log("v1: "+  velo1 + " v2: " + velo2 + " contact: " + contact)
                console.log(ball1.element.id + ": " + ball1.velocity + " " + ball2.element.id + ": " + ball2.velocity)
                console.log("cont: " + contact + " inverse: " + contact.inverse())

                ball1.velocity = [
                    ball1.velocity[0] - (dot(deltaV, contact) * contact[0]) / (norm**2),
                    ball1.velocity[1] - (dot(deltaV, contact) * contact[1]) / (norm**2)]
                ball2.velocity = [
                    ball2.velocity[0] - (dot(deltaV.inverse(), contact.inverse()) * contact.inverse()[0]) / (norm**2),
                    ball2.velocity[1] - (dot(deltaV.inverse(), contact.inverse()) * contact.inverse()[1]) / (norm**2)]
                console.log(ball1.element.id + ": " + ball1.velocity + " " + ball2.element.id + ": " + ball2.velocity)
            } else {
                ball1.colliding = ball2.colliding = false;
            }

        }

    }
    /* if (distance(red_ball.element, blue_ball.element) < 10 && !red_ball.colliding) {
        red_ball.colliding = true;

        let contact = [blue_ball.position[0] - red_ball.position[0], blue_ball.position[1] - red_ball.position[1]]
        let velo = [...red_ball.velocity]

        //console.log("Contact: " + contact + " Velocity: " + velo)
        let norm = Math.sqrt(contact[0]**2 + contact[1]**2)
        let dotted = (contact[0] * velo[0] + contact[1] * velo[1])/norm
        blue_ball.velocity = [dotted * contact[0]/norm, dotted * contact[1]/norm]
        red_ball.velocity = [red_ball.velocity[0] - blue_ball.velocity[0], red_ball.velocity[1] - blue_ball.velocity[1]]

        console.log([red_ball.velocity[0] + blue_ball.velocity[0],red_ball.velocity[1] + blue_ball.velocity[1]])
      } else {
        red_ball.colliding = false;
      } */
    for(let b of balls){
        b.tick(delta);
    }
}

setInterval(updatePos, 10);
