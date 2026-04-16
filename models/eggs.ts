export type EggCategory = 'caipira' | 'branco' | 'orgânico' | 'colonial' | 'outro';

export default class Egg {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public vendor: string,
        public vendorRating: number,
        public imageUrl: string,
        public producerId: string = '',
        public category: EggCategory = 'outro',
        public quantity: number = 30,
        public description: string = '',
    ) {}
}
