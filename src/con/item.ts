import vs from '../glsl/simple.vert';
import fs from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Util } from "../libs/util";
import { Mesh } from 'three/src/objects/Mesh';
import { FrontSide } from 'three/src/constants';
import { Func } from "../core/func";
import { Vector3 } from "three/src/math/Vector3";
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Color } from 'three/src/math/Color';
import { Object3D } from "three/src/core/Object3D";
import { Conf } from "../core/conf";
import { Scroller } from "../core/scroller";

export class Item extends MyObject3D {

  private _mesh:Array<Object3D> = []
  private _id:number
  private _isBottom:boolean

  public itemSize:Vector3 = new Vector3()

  constructor(opt:any = {}) {
    super()

    this._id = opt.id
    this._isBottom = opt.isBottom

    const geo = opt.geo
    const col = ~~(this._id / 3) % 2 == 0 ? opt.col[this._isBottom ? 0 : 1] : 0x000000

    let num = 2
    for(let i = 0; i < num; i++) {
      const m = new Mesh(
        geo,
        new ShaderMaterial({
          vertexShader:vs,
          fragmentShader:fs,
          transparent:true,
          side:FrontSide,
          uniforms:{
            alpha:{value:1},
            color:{value:new Color(col)},
          }
        })
      )
      this.add(m)
      this._mesh.push(m)
    }
    this.visible = false
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()
    const baseSize = Func.instance.val(sw, sw * 0.5)
    const s = Scroller.instance.val.y
    const sr = (s) / (sh * Conf.instance.SCROLL_HEIGHT - sh)

    let test = sr > Util.instance.map(this._id, 0, 1, 0, Conf.instance.ITEM_NUM - 1)
    if(!this._isBottom) {
        test = sr > Util.instance.map(this._id, 1, 0, 0, Conf.instance.ITEM_NUM - 1)
    }
    this.visible = test

    // ひねる
    this.rotation.y = Util.instance.radian(Util.instance.map(sr, 0, 1, 0.5, 1) * this._id * 3)

    // 基本サイズ
    this.itemSize.x = baseSize * 0.5
    this.itemSize.y = 5

    // すきま開ける
    const offset = 5

    const d = this.itemSize.x / 4
    this._mesh.forEach((val,i) => {
      val.scale.set(d - offset, this.itemSize.y, this.itemSize.x)
      val.position.x = (d * 2) * i + (d * 0.5) - this.itemSize.x * 0.5
      if(this._isBottom) {
        val.position.x += d
      }
    })
  }
}