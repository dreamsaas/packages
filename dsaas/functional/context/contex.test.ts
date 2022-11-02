import { pipe } from '../utils';
import { addContext, createContext, removeContext, updateContext } from './context';

describe('context', () => {
  describe('createContext', () => {
    it('should create context', () => {
      const context = createContext('name', { initial: true });

      expect(context.name.initial).toBe(true);
      expect(typeof context.setname).toBe('function');
    });

    it('should update context', () => {
      const context = createContext('name', { initial: true });
      context.setname({ initial: false });
      expect(context.name.initial).toBe(false);
    });
  });

  describe('addContext', () => {
    it('should add context with existing', () => {
      const result = pipe(addContext('name', { initial: true }))({ existing: true });

      expect(result).toMatchObject({ existing: true, name: { initial: true } });
    });

    it('should throw if context already exists', () => {
      expect(() => {
        pipe(addContext('name', {}), addContext('name', {}))({});
      }).toThrow();
    });

    it('should be able to update context', () => {
      const result = pipe(addContext('name', { initial: true }))({ existing: true });
      result.setname({ initial: false });
      expect(result).toMatchObject({ existing: true, name: { initial: false } });
    });
  });

  describe('updateContext', () => {
    it('should throw if context does not exist', () => {
      expect(() => {
        pipe(updateContext('name', {}))({});
      }).toThrow();
    });
    it('should be able to update context', () => {
      const result = pipe(
        addContext('name', { initial: true }),
        updateContext('name', { initial: false })
      )({ existing: true });

      expect(result).toMatchObject({ existing: true, name: { initial: false } });
    });

    it('should be able to partial update context', () => {
      const result = pipe(
        addContext('name', { initial: true, another: true }),
        updateContext('name', { initial: false })
      )({ existing: true });

      expect(result).toMatchObject({ existing: true, name: { initial: false, another: true } });
    });
  });

  describe('removeContext', () => {
    it('should throw if context does not exist', () => {
      expect(() => {
        pipe(removeContext('name'))({});
      }).toThrow();
    });
    it('should be able to remove context', () => {
      const result = pipe(
        addContext('name', { initial: true }),
        removeContext('name')
      )({ existing: true });

      expect(result).toMatchObject({ existing: true });
      expect(result.name).toBeUndefined();
      expect(result.setname).toBeUndefined();
    });
  });
});
