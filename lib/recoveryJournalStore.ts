import { get, put, BlobPreconditionFailedError } from '@vercel/blob';

function path(value: string) {
  if (!/^ggl-recovery\/[a-zA-Z0-9_./-]+\.json$/.test(value) || value.includes('..')) throw new Error('INVALID_JOURNAL_PATH');
  return value;
}
export function recoveryJournalStore() {
  return {
    async read(name: string) {
      // An eventually cached routing decision is unsafe. Always read origin storage.
      const result = await get(path(name), { access: 'private', useCache: false });
      if (!result) return null;
      if (result.statusCode !== 200 || !result.stream) throw new Error('JOURNAL_READ_FAILED');
      return { value: JSON.parse(await new Response(result.stream).text()), etag: result.blob.etag };
    },
    async create(name: string, value: unknown) {
      try {
        const result = await put(path(name), JSON.stringify(value), { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
        return result.etag;
      } catch (error) {
        // SDKs use a separate error class for duplicate creates and failed CAS.
        if (error instanceof BlobPreconditionFailedError || (error as Error)?.name === 'BlobAlreadyExistsError' || /already exists/i.test((error as Error)?.message || '')) throw Object.assign(new Error('JOURNAL_CONFLICT'), { code: 'CONFLICT' });
        throw error;
      }
    },
    async cas(name: string, value: unknown, etag: string) {
      try {
        const result = await put(path(name), JSON.stringify(value), { access: 'private', addRandomSuffix: false, allowOverwrite: true, ifMatch: etag, contentType: 'application/json' });
        return result.etag;
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) throw Object.assign(new Error('JOURNAL_CONFLICT'), { code: 'CONFLICT' });
        throw error;
      }
    },
  };
}
