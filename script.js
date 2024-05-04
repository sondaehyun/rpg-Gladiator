let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let enemyHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const enemyStats = document.querySelector("#enemyStats");
const enemyNameText = document.querySelector("#enemyName");
const enemyHealthText = document.querySelector("#enemyHealth");

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "spear",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const enemies = [
    {
        name: "Pawn",
        level: 2,
        health: 15
    },
    {
        name: "Knight",
        level: 8,
        health: 60
    },
    {
        name: "King",
        level: 20,
        health: 300
    }
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to coliseum", "Fight king"],
        "button functions": [goStore, goColiseum, fightKing],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "coliseum",
        "button text": ["Fight Pawn", "Fight Knight", "Go to town square"],
        "button functions": [fightPawn, fightKnight, goTown],
        text: "You enter the coliseum. You see some enemies."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting an enemy."
    },
    {
        name: "kill enemy",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The enemy screams "Arg!" as they die. You gain experience points and find gold.'
    },
    { 
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. ☠️"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the king! YOU WIN THE GAME! 🎉"
    },
    {
        name: "easteregg",
        "button text": ["3", "7", "Go to town square"],
        "button functions": [pickThree, pickSeven, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
];

//  initialize buttons

button1.onclick = goStore;
button2.onclick = goColiseum;
button3.onclick = fightKing;

function update(location) {
    enemyStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goColiseum() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
    
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText = "In your inventory you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy weapon.";
        }
    }else {
        text.innerText = "You already have the most powerful weapon.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory > 1) {
        gold += 15;
        gold.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In you inventory you have: " + inventory;
    } else { 
        text.innerText = "Don't sell your only weapon!";
    }

}

function fightPawn() {
    fighting = 0;
    goFight();
}

function fightKnight() {
    fighting = 1;
    goFight();
}

function fightKing() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    enemyHealth = enemies[fighting].health;
    enemyStats.style.display = "block";
    enemyNameText.innerText = enemies[fighting].name;
    enemyHealthText.innerText = enemyHealth;
}

function attack() {
    text.innerText = "The " + enemies[fighting].name + " attacks.";
    text.innerText += "You attack them with your " + weapons[currentWeapon].name + ".";

    if (isEnemyHit()) {
        health -= getEnemyAttackValue(enemies[fighting].level);
    } else {
        text.innerText += " You miss.";
    }
    
    enemyHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    enemyHealthText.innerText = enemyHealth;
    if (health <= 0) {
        lose();
    } else if (enemyHealth <= 0) {
        fighting === 2 ? winGame() : defeatEnemy();
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}

function getEnemyAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isEnemyHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + enemies[fighting].name + ".";
}

function defeatEnemy() {
    gold += Math.floor(enemies[fighting].level * 6.7);
    xp += enemies[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickThree() {
    pick(3);
}

function pickSeven() {
    pick(7);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health;
        if (health <=0) {
            lose();
        }
    }

}