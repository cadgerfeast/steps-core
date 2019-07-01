import storage from 'node-persist';

export default class StorageHelper {

    public static async storeCurrentStepId (currentStep: number) {
        await storage.init({dir: './steps/.storage/'});
        storage.setItem('currentStep', currentStep);
    }
    public static async getCurrentStepId (): Promise<number> {
        await storage.init({dir: './steps/.storage/'});
        return storage.getItem('currentStep');
    }
}
