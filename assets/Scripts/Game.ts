import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    public starPrefab: cc.Prefab;
    @property(cc.Node)
    public ground: cc.Node;
    @property(Player)
    public player: Player;
    @property(cc.Label)
    public scoreLable: cc.Label;
    @property(cc.AudioClip)
    public scoreSound: cc.AudioClip;
    @property(cc.Node)
    public startSplash: cc.Node;

    @property
    public maxStarDuration: number = 0;
    @property
    public minStarDuration: number = 0;

    public score: number = 0;
    private groundY: number = 0;

    public static mng: Game;

    onLoad() {
        Game.mng = this;
        //pause game
        cc.director.pause();
        // obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height / 2;// this.ground.top may also work
        // generate a new star
        this.spawnNewStar();
    }

    public spawnNewStar() {
        // generate a new node in the scene with a preset template
        let newStar = cc.instantiate(this.starPrefab);
        // put the newly added node under the Canvas node
        this.node.addChild(newStar);
        // set up a random position for the star
        newStar.setPosition(this.getNewStarPosition());
    }
    private getNewStarPosition() {
        let randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        var randY = this.groundY + Math.random() * this.player.jumpHeight + 50;
        // according to the width of the screen, randomly obtain an anchor point of star on the x axis
        let maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // return to the anchor point of the star
        return new cc.Vec2(randX, randY);
    }
    public setScore() {
        this.score++;
        this.scoreLable.string = "Score : " + this.score;
        cc.audioEngine.play(this.scoreSound, false, 1);
    }
    public PlayGame() {
        //Active Splash Start
        this.startSplash.active = false;
        //Resume game
        cc.director.resume();
    }
}
