const TYPES = {
  Legions: Symbol.for('Legions'),
  ControllerClass: Symbol.for('Newable<controllerClass>'),
  PLUGINCLASS: Symbol.for('Newable<pluginClass>'),
  PluginInstance: Symbol.for('Value<PluginInstance>'),
  Timer: Symbol.for('Newable<Timer>'),
  Middleware: Symbol.for('Newable<GlobalMiddleware>'),
  Service: Symbol.for('Newable<Service>'),
};

export { TYPES };
