import { AbstractEntity } from "database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "permissions" })
export class PermissionsEntitiy extends AbstractEntity {
    @Column({ type: "varchar", unique: true })
    code: string;
}
