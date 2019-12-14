import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    public pickRadius: number = 0;

    public getPlayerDistance() {
        // judge the distance according to the position of the player node
        let playerPos = Game.mng.player.node.getPosition();
        // calculate the distance between two nodes according to their positions
        let dist = this.node.position.sub(playerPos).mag();
        return dist;
    }
    update() {
        // judge if the distance between the star and main character is less than the collecting distance for each frame
        if (this.getPlayerDistance() < this.pickRadius) {
            // invoke collecting behavior
            this.onPicked();
            return;
        }
    }
    onPicked() {
        Game.mng.setScore();
        // When the stars are being collected, invoke the interface in the Game script to generate a new star
        Game.mng.spawnNewStar();
        // then destroy the current star's node
        this.node.destroy();
    }
}
