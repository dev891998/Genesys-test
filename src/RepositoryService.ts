import * as Keyv from 'keyv';
import { KeyvFile } from 'keyv-file';
import { ServiceError } from './Model';

const Ajv = require('ajv').default
const ajv = new Ajv();

export enum RepositoryType {
  User = 'USER',
  Message = 'MESSAGE'
}
const userSchema = {
  'type': 'object',
  'properties': {
    'name': { 'type': 'string' },
    'id': { 'type': 'string' },
  },
  'required': ['id', 'name'],
};
const messageSchema = {
  'type': 'object',
  'properties': {
    'from': {
      'type': 'object',
      'properties': {
        'id': { 'type': 'string' },
      },
      'required': ['id'],
    },
    'to': {
      'type': 'object',
      'properties': {
        'id': { 'type': 'string' },
      },
      'required': ['id'],
    },
    'message': { 'type': 'string' },
    'time': { 'type': 'string' },
  },
  'required': ['id', 'from', 'to', 'message', 'time'],
};
const schemaMap: { [key: string]: any } = {
  'USER': userSchema,
  'MESSAGE': messageSchema,
};

export class MyKeyv<T = any> extends Keyv<T> {
  private cache: Map<string, string>;
  private type: string;

  constructor(opts: Keyv.Options<T>, type: string,) {
    super(opts);
    this.cache = (opts! as any).store._cache;
    this.type = type!;
  }

  query(callback: (value: T, key: string) => boolean): T[] {
    // bite me
    const result: T[] = [];
    this.cache.forEach((v: any, k, _map) => {
      var item = JSON.parse(v.value).value as T
      if (callback(item, k)) {
        result.push(item);
      }
    });
    return result;
  }

  async set(key: string, value: T, ttl?: number | undefined): Promise<true> {
    try {
      await this.validate(value);
      return super.set(key, value, ttl);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async validate(object: T): Promise<void> {
    const schema = schemaMap[this.type];
    const validate = ajv.compile(schema);
    const valid = validate(object);
    if (!valid) {
      const errorMessage = validate.errors[0].message;
      console.error(errorMessage);
      throw new ServiceError(errorMessage, 400)
    }
  }
}

class RepositoryService {
  private repositoryMap: Map<string, MyKeyv> = new Map();

  constructor() {
    try {
      for (const type of Object.values(RepositoryType)) {
        const store = new KeyvFile({
          filename: `./db.${type.toLowerCase()}.json`
        });

        const keyvOptions: Keyv.Options<any> = {
          store,
          namespace: type,
          ttl: 1 * 7 * 24 * 60 * 60 * 1000,// one week
        };

        this.repositoryMap.set(type, new MyKeyv(keyvOptions, type));
      }
    } catch (error) {
      console.error('Caught error while initializing repository.', error);
    }
  }

  get<T>(type: RepositoryType): MyKeyv<T> {
    return this.repositoryMap.get(type) as MyKeyv<T>;
  }
}

export const repos = new RepositoryService();