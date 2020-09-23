import { provide } from 'inversify-binding-decorators';
import 'reflect-metadata';
@provide(Shuriken)
export class Shuriken {
  public throw() {
    return 'hit!';
  }
}
