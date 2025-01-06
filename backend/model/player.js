// Classe Player que é composta por um nome de campeão e uma quantidade de rolls
class Player {
    constructor(champion, rolls) {
        this.champion = champion;
        this.rolls = rolls;
        this.image = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champion + "_0.jpg";
    }

    diplayInfo() {
        console.log(`Jogador: ${this.champion}, Rolls: ${this.rolls}`);
    }

    setChampion(champion) {
        this.champion = champion;
    }

    setRolls(rolls) {
        this.rolls = rolls;
    }
}

module.exports = Player;