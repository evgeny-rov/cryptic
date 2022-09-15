export type RemoveNameField<Type, Keys> = {
  [Property in keyof Type as Exclude<Property, Keys>]: Type[Property];
};
