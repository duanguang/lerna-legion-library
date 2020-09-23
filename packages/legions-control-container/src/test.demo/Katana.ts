import { provide } from 'inversify-binding-decorators';
import 'reflect-metadata';
@provide(Shuriken)
class Shuriken {
  public hit() {
    return 'cutKatana!';
  }
}
export { Shuriken as Katana };
