import { USER_ROLE_ENUM } from "@common";
import { AbstractEntity } from "database/abstract.entity";
import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { PermissionsEntitiy } from "./permission.entity";

@Entity({ name: "roles" })
@Index(["name"])
export class RolesEntity extends AbstractEntity {
    @Column({ type: "enum", enum: USER_ROLE_ENUM, unique: true })
    name: USER_ROLE_ENUM

    @ManyToMany(() => PermissionsEntitiy)
    @JoinTable({
        name: "role_permissions",
        joinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "permission_id",
            referencedColumnName: "id"
        }
    })
    permissions: PermissionsEntitiy[];
}
