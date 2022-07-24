const carCanvas=document.getElementById("carCanvas");
carCanvas.width=600;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=650;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1000;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        // cars[i].brain=defaultBrain;
        if(i!=0) {
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
    cars[4].brain=defaultBrain;
}

const traffic=[
    new Car(road.getLaneCenter(2),-500,30,50,"DUMMY",7,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",8,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-100,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-200,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-300,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-400,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-500,30,50,"AI",Math.random() *  7 + 6,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-700,30,50,"AI",Math.random() *  8 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-800,30,50,"AI",Math.random() *  9 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-900,30,50,"AI",Math.random() *  12 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-100,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-200,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-300,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-400,30,50,"AI",Math.random() *  7 + 2,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-500,30,50,"AI",Math.random() *  7 + 6,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-700,30,50,"AI",Math.random() *  8 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-800,30,50,"AI",Math.random() *  9 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 18),-900,30,50,"AI",Math.random() *  12 + 4,'black'),
    new Car(road.getLaneCenter(Math.random() * 8),-1000,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1100,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1200,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1300,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1400,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1500,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1600,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1700,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1800,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1900,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-2000,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1300 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1400 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1500 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1600 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1700 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1800 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-1900 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
    new Car(road.getLaneCenter(Math.random() * 8),-2000 * 2,30,50,"DUMMY",Math.random() *  7 + 2,getRandomColor()),
];

// Give traffic a brain
for(let i=0;i<traffic.length;i++){
    traffic[i].brain=JSON.parse(
        localStorage.getItem("bestBrain"));
    if(i!=0) {
        NeuralNetwork.mutate(traffic[i].brain,0.05);
    }
}


animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(getRandomInt(1, 8)),getRandomInt(75, 125),30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}