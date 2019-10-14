export class BoxContext {
    constructor(lowerBoundIndex: number, upperBoundIndex: number) {
        this.lowerBoundIndex = lowerBoundIndex;
        this.upperBoundIndex = upperBoundIndex;
        this.volume = 0;
        this.frequency = 0;
    }

    public upperBoundIndex: number;
    public lowerBoundIndex: number;
    public volume: number;
    public frequency: number;
    public maxFrequency: number = 0;
    public minFrequency: number = 20000;
}