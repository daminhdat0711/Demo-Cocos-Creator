const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.AudioClip)
    public jumpSound: cc.AudioClip;

    // main character's jump height
    @property
    public jumpHeight: number = 0;
    // main character's jump duration
    @property
    public jumpDuration: number = 0;
    // maximal movement speed
    @property
    public maxMoveSpeed: number = 0;
    // acceleration
    @property
    public accel: number = 0;

    private jumpAction;
    private accLeft: boolean = false;
    private accRight: boolean = false;
    private xSpeed: number = 0;


    onLoad() {
        // initialize jump action
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // Initialize the keyboard input listening
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public setJumpAction() {
        // jump up
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // jump down
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        //callback
        let callback = cc.callFunc(this.playJumpSound, this);
        //  repeat
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }
    private playJumpSound() {
        cc.audioEngine.play(this.jumpSound, false, 1);
    }
    update(dt) {
        // update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // restrict the movement speed of the main character to the maximum movement speed
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        // update the position of the main character according to the current speed
        this.node.x += this.xSpeed * dt;
    }

    private onKeyDown(event) {
        // set a flag when key pressed
        if (event.keyCode == cc.macro.KEY.a) {
            this.accLeft = true;
        }
        else if (event.keyCode == cc.macro.KEY.d) {
            this.accRight = true;
        }
    }
    private onKeyUp(event) {
        // set a flag when key pressed
        if (event.keyCode == cc.macro.KEY.a) {
            this.accLeft = false;
        }
        else if (event.keyCode == cc.macro.KEY.d) {
            this.accRight = false;
        }
    }
    onDestroy() {
        // Cancel keyboard input monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
