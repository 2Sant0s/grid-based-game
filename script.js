var field, player;

class Field {
    constructor(cols, rows, containerId) {
        this.cols = cols;
        this.rows = rows;
        this.container = document.querySelector(containerId);
        this.createField();
    }

    createField() {
        var field = [];
        for (var i = 0; i < this.rows; i++) {
            field[i] = [];
            for (var j = 0; j < this.cols; j++) {
                field[i].push(this.createRock());
            }
        }
        this.field = field;
        this.drawField();
    }

    createRock() {
        // 1 em 5 chance de ser uma pedra
        return Math.trunc(Math.random() * 5) === 1 ? '🧱' : '';
    }

    drawField() {
        var template = '';
        for (var i = 0; i < this.rows; i++) {
            template += '<tr>';
            for (var j = 0; j < this.cols; j++) {
                template += `<td>${this.field[i][j]}</td>`;
            }
            template += '</tr>';
        }
        this.container.innerHTML = template;
    }
}

class Character {
    constructor(field, x, y, face) {
        this.face = face;
        this.x = x;
        this.y = y;
        this.table = field;

        if (!this.setPosition(this.x, this.y)) {
            throw new Error("Posição inválida para o personagem.");
        }
    }

    up() {
        if (this.y > 0) {
            this.setPosition(this.x, this.y - 1);
        }
    }

    down() {
        if (this.y + 1 < this.table.rows) {
            this.setPosition(this.x, this.y + 1);
        }
    }

    left() {
        if (this.x > 0) {
            this.setPosition(this.x - 1, this.y);
        }
    }

    right() {
        if (this.x + 1 < this.table.cols) {
            this.setPosition(this.x + 1, this.y);
        }
    }

    setPosition(x, y) {
        if (this.table.field[y][x] === '') {
            this.table.field[this.y][this.x] = '';
            this.x = x;
            this.y = y;
            this.table.field[this.y][this.x] = this.face;
            this.table.drawField();
            return true;
        }
        return false;
    }
}

class Player extends Character {
    constructor(field) {
        super(field, 0, 0, '🧙‍♂️');
    }
}

class Npc extends Character {
    constructor(field) {
        // Tenta encontrar uma posição livre
        let x, y, maxTries = 100, tries = 0;
        do {
            x = Math.trunc(Math.random() * field.cols);
            y = Math.trunc(Math.random() * field.rows);
            tries++;
        } while (field.field[y][x] !== '' && tries < maxTries);

        if (field.field[y][x] !== '') {
            throw new Error("Não foi possível posicionar o NPC.");
        }

        super(field, x, y, '🕷️');
        setInterval(this.walk.bind(this), 500);
    }

    walk() {
        var direction = Math.trunc(Math.random() * 4) + 1;
        switch (direction) {
            case 1: this.up(); break;
            case 2: this.down(); break;
            case 3: this.right(); break;
            case 4: this.left(); break;
        }
    }
}

function startField() {
    // Garante que cols e rows sejam no mínimo 3 ** corrigir essa bagunça
    var cols = parseInt(document.querySelector('#cols').value) || 3;
    var rows = parseInt(document.querySelector('#rows').value) || 3;

    if (isNaN(cols) || cols < 3) cols = 3;
    if (isNaN(rows) || rows < 3) rows = 3;

    document.querySelector('button').disabled = true;

    field = new Field(cols, rows, '#myTable');

    try {
        player = new Player(field);
        new Npc(field); // Agora funciona corretamente
    } catch (e) {
        console.log('Campo inválido. Reiniciando...');
        startField();
    }
}

window.addEventListener('keyup', function (event) {
    if (player) {
        const A = 65, S = 83, D = 68, W = 87;

        switch (event.keyCode) {
            case A: player.left(); break;
            case S: player.down(); break;
            case D: player.right(); break;
            case W: player.up(); break;
        }
    }
});
