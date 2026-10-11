// Sistemas: Força centrípeta e Força de arrasto


let modo;
let controles = [];
let rotulos = [];


const G = 9.81;


function setup() {
  createCanvas(900, 620);
  textFont("Arial");


  modo = createSelect();
  modo.position(20, 20);
  modo.option("Força centrípeta");
  modo.option("Força de arrasto");
  modo.changed(configurarControles);


  for (let i = 0; i < 3; i++) {
    let rotulo = createP("");
    rotulo.position(20, 50 + i * 65);
    rotulo.style("margin", "0");
    rotulos.push(rotulo);


    let controle = createSlider(0, 10, 2, 0.1);
    controle.position(20, 80 + i * 65);
    controle.style("width", "220px");
    controles.push(controle);
  }


  configurarControles();
}


function configurarControles() {
  if (modo.value() === "Força centrípeta") {
    definirControle(0, "Massa m (kg)", 0.2, 10, 2, 0.1);
    definirControle(1, "Raio R (m)", 0.2, 8, 3, 0.1);
    definirControle(2, "Velocidade v (m/s)", 0.2, 15, 5, 0.1);
  } else {
    definirControle(0, "Massa m (kg)", 0.2, 10, 2, 0.1);
    definirControle(1, "Arrasto linear b", 0.1, 5, 1, 0.1);
    definirControle(2, "Arrasto quadrático c", 0.1, 5, 0.8, 0.1);
  }
}


function definirControle(i, nome, minimo, maximo, inicial, passo) {
  rotulos[i].html(nome);
  controles[i].attribute("min", minimo);
  controles[i].attribute("max", maximo);
  controles[i].attribute("step", passo);
  controles[i].value(inicial);
}


function draw() {
  background(250);


  fill(30);
  noStroke();
  textSize(20);
  text("Simulação — Leis de Newton", 290, 35);


  textSize(13);
  text("Altere os controles para atualizar a simulação.", 290, 60);


  let p1 = Number(controles[0].value());
  let p2 = Number(controles[1].value());
  let p3 = Number(controles[2].value());


  if (modo.value() === "Força centrípeta") {
    simularForcaCentripeta(p1, p2, p3);
  } else {
    simularArrasto(p1, p2, p3);
  }
}


// SISTEMA 1 — FORÇA CENTRÍPETA
function simularForcaCentripeta(massa, raio, velocidade) {
  // MCU:
  // omega = v/R
  // x(t) = R*cos(omega*t)
  // y(t) = R*sin(omega*t)
  // Fc = m*v²/R


  let omega = velocidade / raio;
  let forca = massa * velocidade ** 2 / raio;


  let centroX = 560;
  let centroY = 310;
  let raioVisual = min(150, raio * 25);


  // Trajetória circular.
  noFill();
  stroke(100);
  strokeWeight(2);
  ellipse(
    centroX,
    centroY,
    raioVisual * 2,
    raioVisual * 2
  );


  // Posição do objeto ao longo da circunferência.
  let angulo = frameCount * 0.025 * omega;
  let x = centroX + raioVisual * cos(angulo);
  let y = centroY + raioVisual * sin(angulo);


  // Linha do centro até o objeto.
  stroke(220, 80, 80);
  line(centroX, centroY, x, y);


  // Objeto em movimento.
  noStroke();
  fill(70, 130, 220);
  circle(x, y, 22);


  // Informações calculadas.
  fill(25);
  textSize(16);
  text("Força centrípeta", 290, 110);


  textSize(14);
  text(
    "Força centrípeta: " + forca.toFixed(2) + " N",
    290, 485
  );


  text(
    "Velocidade angular: " + omega.toFixed(2) + " rad/s",
    290, 510
  );


  text("Fc = m * v² / R", 290, 535);
}


// SISTEMA 2 — FORÇA DE ARRASTO
function simularArrasto(massa, b, c) {

  let vtLinear = massa * G / b;
  let tau = massa / b;
  let vtQuadratico = sqrt(massa * G / c);


  let tempoMaximo = 10;
  let largura = 540;
  let altura = 320;
  let inicioX = 310;
  let inicioY = 150;


  let vmax = max(
    G * tempoMaximo,
    vtLinear,
    vtQuadratico
  ) * 1.05;


  // Eixos do gráfico.
  stroke(80);
  strokeWeight(1);
  line(inicioX, inicioY, inicioX, inicioY + altura);
  line(
    inicioX,
    inicioY + altura,
    inicioX + largura,
    inicioY + altura
  );


  noFill();
  stroke(50, 110, 220);
  strokeWeight(2);
  beginShape();


  for (let i = 0; i <= 150; i++) {
    let t = tempoMaximo * i / 150;
    let v = vtLinear * (1 - exp(-t / tau));


    let x = inicioX + largura * t / tempoMaximo;
    let y = inicioY + altura * (1 - v / vmax);


    vertex(x, y);
  }


  endShape();



  stroke(220, 90, 80);
  beginShape();


  for (let i = 0; i <= 150; i++) {
    let t = tempoMaximo * i / 150;
    let v = vtQuadratico * Math.tanh(G * t / vtQuadratico);


    let x = inicioX + largura * t / tempoMaximo;
    let y = inicioY + altura * (1 - v / vmax);


    vertex(x, y);
  }


  endShape();

  stroke(40, 150, 90);
  beginShape();


  for (let i = 0; i <= 150; i++) {
    let t = tempoMaximo * i / 150;
    let v = G * t;


    let x = inicioX + largura * t / tempoMaximo;
    let y = inicioY + altura * (1 - v / vmax);


    vertex(x, y);
  }


  endShape();

  noStroke();
  fill(25);
  textSize(16);
  text("Velocidade em função do tempo", 290, 110);


  textSize(12);
  text("Tempo (s)", 540, 500);


  push();
  translate(280, 310);
  rotate(-HALF_PI);
  text("Velocidade (m/s)", -55, 0);
  pop();


  fill(50, 110, 220);
  text("Azul: arrasto linear", 320, 510);


  fill(220, 90, 80);
  text("Vermelho: arrasto quadrático", 470, 530);


  fill(40, 150, 90);
  text("Verde: queda livre", 650, 510);


  fill(25);
  textSize(14);


  text(
    "Velocidade terminal linear: " +
    vtLinear.toFixed(2) + " m/s",
    290, 560
  );


  text(
    "Velocidade terminal quadrática: " +
    vtQuadratico.toFixed(2) + " m/s",
    290, 585
  );
}
