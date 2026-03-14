import 'reflect-metadata';

declare global {
  interface Reflect {
    getMetadata(metadataKey: any, target: any, propertyKey?: string | symbol): any;
    defineMetadata(metadataKey: any, metadataValue: any, target: any, propertyKey?: string | symbol): void;
    hasMetadata(metadataKey: any, target: any, propertyKey?: string | symbol): boolean;
  }
}
