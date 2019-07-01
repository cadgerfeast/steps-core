import storage from 'node-persist';

export default class StorageHelper {

    public static async storeCurrentStepId (currentStep: number) {
        await storage.init();
        storage.setItem('currentStep', currentStep);
    }
    public static async getCurrentStepId (): Promise<number> {
        await storage.init();
        return storage.getItem('currentStep');
    }
}
