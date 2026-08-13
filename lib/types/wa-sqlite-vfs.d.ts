declare module "wa-sqlite/src/examples/IDBBatchAtomicVFS.js" {
    export class IDBBatchAtomicVFS {
        constructor(idbDatabaseName?: string, options?: object);
        name: string;
        close(): Promise<void>;
    }
}