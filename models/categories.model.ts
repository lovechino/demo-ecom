export class Category {
    private id: string
    private name: string
    private description: string
    private createdAt: Date
    constructor(id: string, name: string, description: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }
    public getId(): string {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string {
        return this.description;
    }
    public getCreatedAt(): Date {
        return this.createdAt;
    }
    public setId(id: string): void {
        this.id = id;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public setDescription(description: string): void {
        this.description = description;
    }
    public setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }
    public toJson(): string {
        return JSON.stringify(this);
    }
}

