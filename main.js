const $ = s => document.querySelector(s)
const canvas = $('#canvas')
const ctx = canvas.getContext('2d')
const options = {
    debug: false,

    mouseRadius: 200,
    maxDist: 150,
    maxLines: 50,

    starColor(star) {
        return `rgba(255, 255, 255, ${star.o})`
    },
    lineColor(from, to) {
        return `rgba(200, 200, 255, ${from.o})`
    },
}
let shouldRedistribute = false

function printDebug(debug) {
    ctx.save()
    ctx.font = "20px Georgia";
    ctx.fillStyle = 'white'
    ctx.fillText('D: ' + debug, 100, 100)
    ctx.restore()
}

function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    options.maxDist = canvas.width / 5
    if (options.maxDist > 150) {
        options.maxDist = 150
    }
    shouldRedistribute = true
}

resizeCanvas()
let mouse = {x: canvas.width / 2, y: canvas.height / 2}
window.addEventListener('resize', resizeCanvas);

let stars = []

for (let i = 0; i < 180; i++) {
    stars.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        vx: random(-10, 10) * 0.02,
        vy: random(-10, 10) * 0.02,
        r: random(1, 5) * 0.3,
        o: Math.random() + 0.2
    })
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})

!(function loop() {

    window.requestAnimationFrame(loop)
    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // update
    options.debug && printDebug(`Mouse x: ${mouse.x} | y: ${mouse.y}`)

    if (shouldRedistribute) {
        shouldRedistribute = false

        stars.forEach((star) => {
            star.x = random(0, canvas.width)
            star.y = random(0, canvas.height)
        })
    }

    stars.forEach((star) => {
        if (star.x > canvas.width || star.x < 0) {
            star.vx *= -1
        }

        if (star.y > canvas.height || star.y < 0) {
            star.vy *= -1
        }

        star.x += star.vx
        star.y += star.vy
    })

    // draw
    stars.forEach((star) => {
        drawCircle(star.x, star.y, star.r, options.starColor(star))
    })

    let drawn = 0
    for (let i = 0; i < stars.length; i++) {
        for (let j = 0; j < stars.length; j++) {
            let star1 = stars[i]
            let star2 = stars[j]

            let diffX = star1.x - star2.x
            let diffY = star1.y - star2.y

            let distX = Math.abs(diffX)
            let distY = Math.abs(diffY)

            let xmax = mouse.x + options.mouseRadius
            let xmin = mouse.x - options.mouseRadius

            let ymax = mouse.y + options.mouseRadius
            let ymin = mouse.y - options.mouseRadius

            if (star1.x < xmin || star1.x > xmax) {
                continue
            }

            if (star1.y < ymin || star1.y > ymax) {
                continue
            }

            if (distX + distY < options.maxDist && ++drawn < options.maxLines) {
                drawLine(star1.x, star1.y, star2.x, star2.y, options.lineColor(star1, star2))
            }
        }
    }
})()

function drawCircle(x, y, r, fillStyle) {
    ctx.beginPath()
    ctx.fillStyle = fillStyle
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.fill()
}

function drawLine(fx, fy, tx, ty, color) {
    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
}


function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}