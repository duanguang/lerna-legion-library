import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
const legionsContainer = new Container({
  skipBaseClassChecks: true,
});
let {
  /** @internal */
  lazyInject,
} = getDecorators(legionsContainer);
export { legionsContainer, lazyInject };
