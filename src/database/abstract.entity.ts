import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date

    @DeleteDateColumn({ type: "timestamptz" })
    deleted_at?: Date
}
