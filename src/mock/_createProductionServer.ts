import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

const modules = import.meta.glob('/mock/dir/*.ts', {
    import: 'default',
    eager: true,
});
console.log(modules);
const mockModules: any[] = [];
Object.keys(modules).forEach(async (key) => {
    if (key.includes('_')) {
        return;
    }
    mockModules.push(...(modules[key] as any));
});
console.log(mockModules);
export function setupProdMockServer() {
    createProdMockServer(mockModules);
}
