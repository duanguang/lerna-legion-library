import getDecorators from 'inversify-inject-decorators';
import { Container, injectable, tagged, named } from 'inversify';
import 'reflect-metadata';
let container = new Container();
let { lazyInject } = getDecorators(container);
let TYPES = { Weapon: 'Weapon' };
describe('inversify-inject-decorators.test', () => {
  it('lazyInject', () => {
    interface Weapon {
      name: string;
      durability: number;
      use(): void;
    }

    @injectable()
    class Sword implements Weapon {
      public name: string;
      public durability: number;
      public constructor() {
        this.durability = 100;
        this.name = 'Sword';
      }
      public use() {
        this.durability = this.durability - 10;
      }
    }

    class Warrior {
      @lazyInject(TYPES.Weapon)
      public weapon: Weapon | undefined;
    }
    container.bind<Weapon>(TYPES.Weapon).to(Sword);
    let warrior = new Warrior();
    expect(warrior.weapon instanceof Sword).toEqual(true);
  });
});
